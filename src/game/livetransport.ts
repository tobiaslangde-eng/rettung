import { Platform } from 'react-native';
import type { DataConnection, Peer as PeerTyp, PeerOptions } from 'peerjs';
import { AnHost, VonHost } from './liverunde';

/**
 * Verbindung für die Live-Runde: direkt von Handy zu Handy (WebRTC) über die freie PeerJS-Vermittlung.
 * Es gibt keinen eigenen Server; Namen und Antworten gehen nur zwischen den Mitspielenden hin und her.
 */
const PRAEFIX = 'e112raum-';
const ICE = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
  { urls: 'stun:stun.cloudflare.com:3478' },
];

/** Läuft im Browser mit WebRTC? (Zum Ausprobieren kann `localStorage['e112.live.peer']` einen eigenen Vermittler angeben.) */
export const liveMoeglich = (): boolean => Platform.OS === 'web' && typeof RTCPeerConnection !== 'undefined';

function optionen(): PeerOptions {
  const basis: PeerOptions = { config: { iceServers: ICE }, debug: 0 };
  try {
    const test = localStorage.getItem('e112.live.peer');
    if (test) return { ...basis, ...JSON.parse(test) };
  } catch {
    // egal
  }
  return basis;
}

function neuerPeer(id?: string): PeerTyp {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Peer } = require('peerjs') as typeof import('peerjs');
  return id ? new Peer(id, optionen()) : new Peer(optionen());
}

const zufallsPin = () => String(Math.floor(100000 + Math.random() * 900000));

export interface HostVerbindung {
  pin: string;
  senden(id: string, n: VonHost): void;
  schliessen(): void;
}

export interface HostHandler {
  onNachricht(id: string, n: AnHost): void;
  onNeu(id: string): void;
  onGetrennt(id: string): void;
}

/** Raum eröffnen: sucht einen freien PIN und wartet auf Mitspieler */
export async function oeffneRaum(h: HostHandler): Promise<HostVerbindung> {
  for (let versuch = 0; versuch < 6; versuch++) {
    const pin = zufallsPin();
    const peer = neuerPeer(PRAEFIX + pin);
    const ergebnis = await new Promise<'ok' | 'belegt' | 'netz'>((fertig) => {
      const frist = setTimeout(() => fertig('netz'), 12000);
      peer.on('open', () => {
        clearTimeout(frist);
        fertig('ok');
      });
      peer.on('error', (e: { type?: string }) => {
        clearTimeout(frist);
        fertig(e.type === 'unavailable-id' ? 'belegt' : 'netz');
      });
    });
    if (ergebnis === 'belegt') {
      peer.destroy();
      continue;
    }
    if (ergebnis === 'netz') {
      peer.destroy();
      throw new Error('netz');
    }
    const verbindungen = new Map<string, DataConnection>();
    peer.on('connection', (conn) => {
      const id = conn.peer;
      conn.on('open', () => {
        verbindungen.set(id, conn);
        h.onNeu(id);
      });
      conn.on('data', (d) => h.onNachricht(id, d as AnHost));
      conn.on('close', () => {
        verbindungen.delete(id);
        h.onGetrennt(id);
      });
      conn.on('error', () => {
        verbindungen.delete(id);
        h.onGetrennt(id);
      });
    });
    // Reißt die Verbindung zur Vermittlung ab, bleiben laufende Spiele bestehen; neue Mitspieler brauchen sie aber
    peer.on('disconnected', () => {
      if (!peer.destroyed) peer.reconnect();
    });
    return {
      pin,
      senden: (id, n) => {
        const c = verbindungen.get(id);
        if (c && c.open) c.send(n);
      },
      schliessen: () => {
        verbindungen.forEach((c) => c.close());
        peer.destroy();
      },
    };
  }
  throw new Error('netz');
}

export interface SpielerVerbindung {
  senden(n: AnHost): void;
  schliessen(): void;
}

export interface SpielerHandler {
  onNachricht(n: VonHost): void;
  onGetrennt(): void;
}

/** Einem Raum beitreten; wirft 'nicht-gefunden', 'zeit' oder 'netz' */
export async function trittBei(pin: string, h: SpielerHandler): Promise<SpielerVerbindung> {
  const peer = neuerPeer();
  return new Promise<SpielerVerbindung>((ok, nein) => {
    let fertig = false;
    const scheitere = (grund: 'nicht-gefunden' | 'zeit' | 'netz') => {
      if (fertig) return;
      fertig = true;
      clearTimeout(frist);
      peer.destroy();
      nein(new Error(grund));
    };
    const frist = setTimeout(() => scheitere('zeit'), 15000);
    peer.on('error', (e: { type?: string }) => {
      if (!fertig) scheitere(e.type === 'peer-unavailable' ? 'nicht-gefunden' : 'netz');
    });
    peer.on('open', () => {
      const conn = peer.connect(PRAEFIX + pin, { reliable: true, serialization: 'json' });
      conn.on('open', () => {
        if (fertig) return;
        fertig = true;
        clearTimeout(frist);
        ok({
          senden: (n) => conn.open && conn.send(n),
          schliessen: () => {
            conn.close();
            peer.destroy();
          },
        });
      });
      conn.on('data', (d) => h.onNachricht(d as VonHost));
      conn.on('close', () => (fertig ? h.onGetrennt() : scheitere('netz')));
      conn.on('error', () => (fertig ? h.onGetrennt() : scheitere('netz')));
    });
  });
}

export const RAUM_URL = 'https://rettung.tankard.de/';
export const raumLink = (pin: string) => `${RAUM_URL}?raum=${pin}`;

/** Liest die PIN aus einem Einladungslink (?raum=123456, nur Web) */
export function leseRaumLink(): string | null {
  if (Platform.OS !== 'web' || typeof location === 'undefined') return null;
  try {
    const pin = new URLSearchParams(location.search).get('raum') ?? '';
    return /^\d{6}$/.test(pin) ? pin : null;
  } catch {
    return null;
  }
}

export function loescheRaumLink(): void {
  try {
    if (Platform.OS === 'web') history.replaceState(null, '', location.pathname);
  } catch {
    // egal
  }
}
