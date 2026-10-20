import { Rolle } from './rolle';

/** Teilbare Bild-Karten (SVG, 1080 × 1350) für Einsatz-Ergebnis, Spickzettel und Schicht */
export const KARTE_B = 1080;
export const KARTE_H = 1350;

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const FONT = "Georgia, 'Times New Roman', serif";
const SANS = "'Helvetica Neue', Arial, sans-serif";

export function umbrechen(text: string, max: number): string[] {
  const zeilen: string[] = [];
  let z = '';
  for (const w of text.split(' ')) {
    if ((z + ' ' + w).trim().length > max) {
      zeilen.push(z.trim());
      z = w;
    } else z = (z + ' ' + w).trim();
  }
  if (z) zeilen.push(z);
  return zeilen;
}

const farben = (rolle: Rolle) =>
  rolle === 'helfer'
    ? { a: '#0FA391', b: '#0A4A47', dunkel: '#0A6F66', hell: '#E3F5F1' }
    : { a: '#E5484D', b: '#7E1A1E', dunkel: '#C62E33', hell: '#FDEDEC' };

const stern = (cx: number, cy: number, r: number, voll: boolean, farbe: string) => {
  const pts = Array.from({ length: 10 }, (_, i) => {
    const w = (Math.PI / 5) * i - Math.PI / 2;
    const rr = i % 2 === 0 ? r : r * 0.45;
    return `${(cx + Math.cos(w) * rr).toFixed(1)},${(cy + Math.sin(w) * rr).toFixed(1)}`;
  }).join(' ');
  return `<polygon points="${pts}" fill="${voll ? farbe : 'none'}" stroke="${farbe}" stroke-width="6" stroke-linejoin="round" opacity="${voll ? 1 : 0.35}"/>`;
};

const lebensstern = (c: string, s: number) =>
  `<svg viewBox="0 0 100 100" width="${s}" height="${s}"><g stroke="${c}" stroke-width="11" stroke-linecap="round"><line x1="50" y1="14" x2="50" y2="86"/><line x1="19" y1="32" x2="81" y2="68"/><line x1="19" y1="68" x2="81" y2="32"/></g></svg>`;

function rahmen(rolle: Rolle, innen: string, fuss = 'Kannst du das auch?'): string {
  const f = farben(rolle);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${KARTE_B} ${KARTE_H}" width="${KARTE_B}" height="${KARTE_H}">
<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${f.a}"/><stop offset="1" stop-color="${f.b}"/></linearGradient></defs>
<rect width="${KARTE_B}" height="${KARTE_H}" fill="url(#g)"/>
<circle cx="980" cy="120" r="360" fill="#fff" opacity="0.08"/><circle cx="60" cy="1250" r="300" fill="#fff" opacity="0.07"/>
<g transform="translate(80 70)">${lebensstern('#FFE08A', 64)}</g>
<text x="162" y="118" font-family="${SANS}" font-size="38" font-weight="700" letter-spacing="9" fill="#FFE08A">EINSATZ 112</text>
<rect x="60" y="190" width="960" height="930" rx="56" fill="#FFFFFF"/>
${innen}
<text x="540" y="1198" text-anchor="middle" font-family="${SANS}" font-size="44" font-weight="700" fill="#FFFFFF">${esc(fuss)}</text>
<text x="540" y="1262" text-anchor="middle" font-family="${SANS}" font-size="42" font-weight="700" fill="#FFE08A" letter-spacing="2">rettung.tankard.de</text>
<text x="540" y="1312" text-anchor="middle" font-family="${SANS}" font-size="24" fill="#FFFFFF" opacity="0.8">Lernspiel – ersetzt keine Ausbildung. Im Notfall: 112</text>
</svg>`;
}

export function ergebnisKarteSvg(o: {
  rolle: Rolle;
  kicker: string;
  titel: string;
  ort?: string;
  sterne: number;
  punkte: number;
  zeilen?: string[];
}): string {
  const f = farben(o.rolle);
  const titelZ = umbrechen(o.titel, 22).slice(0, 2);
  const ortZ = o.ort ? umbrechen(o.ort, 40).slice(0, 2) : [];
  const stars = [0, 1, 2].map((i) => stern(300 + i * 240, 560, 92, i < o.sterne, '#F2B50F')).join('');
  const zeilen = (o.zeilen ?? []).slice(0, 4);
  return rahmen(
    o.rolle,
    `<text x="540" y="290" text-anchor="middle" font-family="${SANS}" font-size="34" font-weight="700" letter-spacing="7" fill="${f.dunkel}">${esc(o.kicker.toUpperCase())}</text>
${titelZ.map((t, i) => `<text x="540" y="${370 + i * 84}" text-anchor="middle" font-family="${FONT}" font-size="76" font-weight="700" fill="#17302E">${esc(t)}</text>`).join('')}
${ortZ.map((t, i) => `<text x="540" y="${titelZ.length === 2 ? 540 + i * 40 : 470 + i * 40}" text-anchor="middle" font-family="${SANS}" font-size="32" fill="#5A6A68">📍 ${esc(t)}</text>`).join('')}
${stars}
<text x="540" y="800" text-anchor="middle" font-family="${FONT}" font-size="150" font-weight="700" fill="${f.dunkel}">+${o.punkte}</text>
<text x="540" y="860" text-anchor="middle" font-family="${SANS}" font-size="40" fill="#5A6A68" letter-spacing="4">PUNKTE</text>
${zeilen.map((z, i) => `<text x="540" y="${930 + i * 46}" text-anchor="middle" font-family="${SANS}" font-size="34" fill="#17302E">${esc(z)}</text>`).join('')}`,
  );
}

export function spickKarteSvg(o: {
  rolle: Rolle;
  icon: string;
  titel: string;
  punkte: { text: string; wichtig?: boolean }[];
  merksatz: string;
}): string {
  const f = farben(o.rolle);
  const titelZ = umbrechen(`${o.icon} ${o.titel}`, 24).slice(0, 2);
  const startY = titelZ.length === 2 ? 440 : 392;
  const ms = umbrechen(o.merksatz, 46).slice(0, 2);
  const msH = ms.length === 2 ? 110 : 76;
  const unten = 1090 - msH - 26; // hier muss die Liste spätestens enden
  // Schriftgröße so wählen, dass alle EP hineinpassen
  let fs = 36;
  let items: { zeilen: string[]; h: number }[] = [];
  for (; fs >= 26; fs -= 2) {
    const max = Math.floor(780 / (0.56 * fs));
    items = o.punkte.map((p) => {
      const zeilen = umbrechen(p.text, max).slice(0, 3);
      return { zeilen, h: zeilen.length * (fs + 4) + 18 };
    });
    if (startY + items.reduce((n, i) => n + i.h, 0) <= unten) break;
  }
  let y = startY;
  const zeilen = o.punkte
    .map((p, i) => {
      const it = items[i];
      const cy = y + fs * 0.35;
      const text = it.zeilen
        .map(
          (t, k) =>
            `<text x="190" y="${y + fs * 0.7 + k * (fs + 4)}" font-family="${SANS}" font-size="${fs}" font-weight="${p.wichtig ? 700 : 400}" fill="${p.wichtig ? f.dunkel : '#17302E'}">${esc(t)}</text>`,
        )
        .join('');
      const out = `<circle cx="134" cy="${cy}" r="${fs * 0.8}" fill="${p.wichtig ? f.dunkel : f.hell}"/><text x="134" y="${cy + fs * 0.36}" text-anchor="middle" font-family="${SANS}" font-size="${fs * 0.9}" font-weight="700" fill="${p.wichtig ? '#fff' : f.dunkel}">${i + 1}</text>${text}`;
      y += it.h;
      return out;
    })
    .join('');
  const boxY = 1090 - msH;
  return rahmen(
    o.rolle,
    `<text x="540" y="276" text-anchor="middle" font-family="${SANS}" font-size="30" font-weight="700" letter-spacing="7" fill="${f.dunkel}">SPICKZETTEL</text>
${titelZ.map((t, i) => `<text x="540" y="${346 + i * 62}" text-anchor="middle" font-family="${FONT}" font-size="54" font-weight="700" fill="#17302E">${esc(t)}</text>`).join('')}
${zeilen}
<rect x="96" y="${boxY}" width="888" height="${msH}" rx="26" fill="${f.hell}"/>
${ms.map((t, i) => `<text x="540" y="${boxY + 46 + i * 40}" text-anchor="middle" font-family="${SANS}" font-size="32" font-weight="700" fill="${f.dunkel}">${i === 0 ? '💡 ' : ''}${esc(t)}</text>`).join('')}`,
    'Spickzettel zum Speichern',
  );
}

export function schichtKarteSvg(o: {
  rolle: Rolle;
  titel: string;
  einsaetze: number;
  sterne: number;
  punkte: number;
  checks: string;
}): string {
  const f = farben(o.rolle);
  return rahmen(
    o.rolle,
    `<text x="540" y="290" text-anchor="middle" font-family="${SANS}" font-size="34" font-weight="700" letter-spacing="7" fill="${f.dunkel}">SCHICHTBILANZ</text>
<text x="540" y="380" text-anchor="middle" font-family="${FONT}" font-size="72" font-weight="700" fill="#17302E">${esc(o.titel)}</text>
${[0, 1, 2].map((i) => stern(300 + i * 240, 530, 92, i < o.sterne, '#F2B50F')).join('')}
<text x="540" y="760" text-anchor="middle" font-family="${FONT}" font-size="150" font-weight="700" fill="${f.dunkel}">+${o.punkte}</text>
<text x="540" y="820" text-anchor="middle" font-family="${SANS}" font-size="40" fill="#5A6A68" letter-spacing="4">PUNKTE</text>
<text x="540" y="920" text-anchor="middle" font-family="${SANS}" font-size="40" fill="#17302E">${o.einsaetze} Einsätze abgearbeitet</text>
<text x="540" y="976" text-anchor="middle" font-family="${SANS}" font-size="40" fill="#17302E">${esc(o.checks)}</text>`,
  );
}

export function duellKarteSvg(o: {
  rolle: Rolle;
  name: string;
  richtig: number;
  von: number;
  gegnerName?: string;
  gegner?: number;
}): string {
  const f = farben(o.rolle);
  const sieg = o.gegner !== undefined && o.richtig > o.gegner;
  const gleich = o.gegner !== undefined && o.richtig === o.gegner;
  const kopf =
    o.gegner === undefined
      ? 'DUELL – KANNST DU MICH SCHLAGEN?'
      : sieg
        ? 'DUELL GEWONNEN'
        : gleich
          ? 'DUELL UNENTSCHIEDEN'
          : 'DUELL VERLOREN';
  return rahmen(
    o.rolle,
    `<text x="540" y="290" text-anchor="middle" font-family="${SANS}" font-size="32" font-weight="700" letter-spacing="5" fill="${f.dunkel}">${esc(kopf)}</text>
<text x="540" y="400" text-anchor="middle" font-family="${FONT}" font-size="72" font-weight="700" fill="#17302E">${esc((o.name || 'Ich').slice(0, 18))}</text>
<text x="540" y="640" text-anchor="middle" font-family="${FONT}" font-size="220" font-weight="700" fill="${f.dunkel}">${o.richtig}/${o.von}</text>
<text x="540" y="710" text-anchor="middle" font-family="${SANS}" font-size="40" fill="#5A6A68" letter-spacing="4">RICHTIG</text>
${o.gegner !== undefined ? `<text x="540" y="830" text-anchor="middle" font-family="${SANS}" font-size="44" fill="#17302E">gegen ${esc((o.gegnerName || 'Freund/in').slice(0, 18))}: ${o.gegner}/${o.von}</text>` : `<text x="540" y="830" text-anchor="middle" font-family="${SANS}" font-size="44" fill="#17302E">Spiel dieselben ${o.von} Fragen!</text>`}`,
    'Spiele dasselbe Duell',
  );
}
