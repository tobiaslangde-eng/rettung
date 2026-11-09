/**
 * Live-Kurven für den Simulator: EKG, Pulskurve (SpO₂) und Atemkurve laufen endlos weiter und passen sich
 * sofort an, wenn sich Rhythmus oder Frequenz des Patienten ändern.
 */
import { EkgId, gauss, Schlag, schlagWert } from './ekg';

/** 'pea' = geordnete Herzaktion ohne Puls (sieht im EKG wie ein langsamer, breiter Rhythmus aus) */
export type LiveRhythmus = EkgId | 'pea';

const hash = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

type Param = Omit<Schlag, 'tq'>;
type Schlag2 = Schlag;

export class EkgQuelle {
  modus: LiveRhythmus = 'sinus';
  hf = 70;
  private beats: Schlag2[] = [];
  private pWellen: number[] = [];
  private naechster = 0;
  private naechsterP = 0;
  private zaehler: number;
  private phase: number;
  private nummer = 0;
  /** Zeitpunkte der letzten Herzschläge (für die Pulskurve) */
  schlaege: number[] = [];

  constructor(seed = 1) {
    this.zaehler = seed * 977;
    this.phase = hash(seed) * 10;
  }

  setze(modus: LiveRhythmus, hf: number) {
    this.modus = modus;
    this.hf = hf;
  }

  private rnd() {
    this.zaehler++;
    return hash(this.zaehler);
  }

  private plane(bis: number) {
    const m = this.modus;
    // ohne Herzaktion nichts planen (die Uhr läuft trotzdem mit)
    if (m === 'vf' || m === 'asystolie') {
      if (this.naechster < bis - 1) this.naechster = bis - 0.3;
      return;
    }
    const hf = Math.max(20, Math.min(230, this.hf));
    let guard = 0;
    while (this.naechster < bis && guard++ < 20) {
      let rr = 60 / hf;
      let s: Param = {};
      let tq = this.naechster;
      switch (m) {
        case 'sinus':
          s = { pq: 0.16 };
          rr *= 1 + (this.rnd() - 0.5) * 0.03;
          break;
        case 'tachy':
          s = { pq: 0.13, tPos: 0.2, tAmp: 0.26 };
          rr *= 1 + (this.rnd() - 0.5) * 0.02;
          break;
        case 'brady':
          s = { pq: 0.17, tPos: 0.27 };
          rr *= 1 + (this.rnd() - 0.5) * 0.03;
          break;
        case 'avb1':
          s = { pq: 0.34 };
          break;
        case 'stemi':
          s = { pq: 0.16, st: 0.42, tAmp: 0.45, tPos: 0.27, ampR: 1.05 };
          rr *= 1 + (this.rnd() - 0.5) * 0.03;
          break;
        case 'svt':
          s = { tPos: 0.17, tAmp: 0.18, st: -0.06 };
          break;
        case 'af':
          s = { tAmp: 0.2, tPos: 0.2 };
          rr *= 0.55 + this.rnd() * 0.95;
          break;
        case 'flutter':
          s = { tAmp: 0.12, tPos: 0.22, ampR: 0.9 };
          rr = 0.8;
          break;
        case 'ves':
          this.nummer++;
          if (this.nummer % 6 === 0) {
            // zu früh, breit, danach eine Pause
            tq = this.naechster - rr * 0.32;
            s = { breit: true, ampR: 1 };
            rr *= 1.25;
          } else s = { pq: 0.16 };
          break;
        case 'vt':
          s = { breit: true, ampR: 1.15 };
          break;
        case 'av3':
          s = { breit: true, ampR: 0.85 };
          rr = 60 / Math.min(hf, 45);
          break;
        case 'pea':
          s = { breit: true, ampR: 0.6 };
          rr = 60 / Math.min(hf, 60);
          break;
      }
      this.beats.push({ tq, ...s });
      this.schlaege.push(tq);
      this.naechster = tq + rr;
    }
    // P-Wellen beim AV-Block 3 laufen unabhängig vom QRS
    if (m === 'av3') {
      while (this.naechsterP < bis) {
        this.pWellen.push(this.naechsterP);
        this.naechsterP += 60 / 76;
      }
    }
  }

  /** Spannung in mV zum Zeitpunkt t (Sekunden, aufsteigend abfragen) */
  wert(t: number): number {
    if (this.naechster === 0) this.naechster = t + 0.2;
    this.plane(t + 0.5);
    let v = 0;
    for (const b of this.beats) {
      if (b.tq > t + 0.45) break;
      if (t - b.tq < 0.8) v += schlagWert(t, b);
    }
    for (const p of this.pWellen) if (Math.abs(t - p) < 0.2) v += gauss(t, p, 0.036, 0.15);
    const m = this.modus;
    if (m === 'af') {
      v += 0.03 * Math.sin(6.283 * 7.3 * t + this.phase) + 0.025 * Math.sin(6.283 * 5.1 * t + 2 * this.phase + 0.9 * Math.sin(1.7 * t)) + 0.02 * Math.sin(6.283 * 9.4 * t);
    } else if (m === 'flutter') {
      const p = (((t / 0.2) % 1) + 1) % 1;
      v += 0.2 * (p < 0.8 ? p / 0.8 : (1 - p) / 0.2) - 0.1;
    } else if (m === 'vf') {
      const huelle = 0.55 + 0.35 * Math.sin(1.3 * t + this.phase) + 0.15 * Math.sin(3.1 * t);
      v +=
        huelle *
        (Math.sin(6.283 * 4.6 * t + this.phase + 1.4 * Math.sin(1.9 * t)) +
          0.7 * Math.sin(6.283 * 6.1 * t + 2 * this.phase + 1.2 * Math.sin(2.3 * t + 1)) +
          0.45 * Math.sin(6.283 * 3.7 * t + 0.5 * this.phase)) *
        0.55;
    } else if (m === 'asystolie') {
      v += 0.03 * Math.sin(0.35 * 6.283 * t + this.phase) + 0.01 * Math.sin(2.1 * 6.283 * t);
    }
    v += 0.025 * Math.sin(0.28 * 6.283 * t + this.phase) + (hash(Math.floor(t * 250) + this.phase) - 0.5) * 0.014;
    // alte Schläge aufräumen
    if (this.beats.length > 24) {
      this.beats = this.beats.filter((b) => b.tq > t - 1.5);
      this.pWellen = this.pWellen.filter((p) => p > t - 1);
      this.schlaege = this.schlaege.filter((q) => q > t - 8);
    }
    return v;
  }

  /** Pulskurve (Pulsoximeter): folgt den Herzschlägen, flach wenn kein Puls getastet werden kann */
  puls(t: number, amp: number): number {
    if (amp <= 0.01) return 0.02 * Math.sin(2.1 * t);
    let v = 0;
    for (const q of this.schlaege) {
      const x = t - (q + 0.17);
      if (x < -0.05 || x > 0.8) continue;
      if (x >= 0) v += (1 - Math.exp(-x / 0.045)) * Math.exp(-x / 0.2) * 1.9 + gauss(x, 0.34, 0.05, 0.14);
    }
    return v * amp;
  }
}

/** Atemkurve (Impedanz/Kapnografie): eine Welle je Atemzug; steht still bei Atemstillstand */
export class AtemQuelle {
  private p = 0;
  private letzte = 0;
  af = 14;
  bvm = false;

  wert(t: number): number {
    if (this.letzte === 0) this.letzte = t;
    const dt = Math.max(0, Math.min(0.5, t - this.letzte));
    this.letzte = t;
    const rate = this.bvm ? 10 : this.af;
    this.p += (dt * rate) / 60;
    if (rate < 1) return 0;
    const x = this.p % 1;
    const sm = (a: number) => a * a * (3 - 2 * a);
    return x < 0.38 ? sm(x / 0.38) : x < 0.5 ? 1 : 1 - sm((x - 0.5) / 0.5);
  }
}
