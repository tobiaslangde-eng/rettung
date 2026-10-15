import * as THREE from 'three';
import { ItemArt } from './items';

/** Kleine Helfer zum Bauen der Welt: Texturen aus dem Canvas und einfache Modelle aus Grundformen */

export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function canvasTex(
  w: number,
  h: number,
  draw: (g: CanvasRenderingContext2D, w: number, h: number) => void,
  repeat = true,
): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const g = c.getContext('2d')!;
  draw(g, w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  if (repeat) {
    t.wrapS = THREE.RepeatWrapping;
    t.wrapT = THREE.RepeatWrapping;
  }
  return t;
}

export const asphaltTexture = () =>
  canvasTex(256, 256, (g, w, h) => {
    g.fillStyle = '#3b454a';
    g.fillRect(0, 0, w, h);
    for (let i = 0; i < 1800; i++) {
      const v = 50 + Math.random() * 40;
      g.fillStyle = `rgba(${v},${v + 6},${v + 8},0.35)`;
      g.fillRect(Math.random() * w, Math.random() * h, 2, 2);
    }
    g.fillStyle = '#e9efe9';
    g.fillRect(0, h / 2 - 3, w * 0.5, 6);
  });

export const grassTexture = () =>
  canvasTex(128, 128, (g, w, h) => {
    g.fillStyle = '#7ec48a';
    g.fillRect(0, 0, w, h);
    for (let i = 0; i < 900; i++) {
      g.fillStyle = Math.random() > 0.5 ? 'rgba(96,170,108,0.5)' : 'rgba(150,214,150,0.45)';
      g.fillRect(Math.random() * w, Math.random() * h, 2, 3);
    }
  });

/** Fassade mit Fenstern: 2 Spalten × 2 Etagen pro Kachel; `lit` = beleuchtete Fenster für die Nacht (Leuchttextur) */
export function facadeTextures(wall: string, seed: number): { map: THREE.CanvasTexture; lit: THREE.CanvasTexture } {
  const rnd = mulberry32(seed);
  const draw = (lit: boolean) => (g: CanvasRenderingContext2D, w: number, h: number) => {
    if (lit) {
      g.fillStyle = '#000';
      g.fillRect(0, 0, w, h);
    } else {
      g.fillStyle = wall;
      g.fillRect(0, 0, w, h);
      g.fillStyle = 'rgba(255,255,255,0.12)';
      g.fillRect(0, 0, w, 6);
      g.fillStyle = 'rgba(0,0,0,0.08)';
      g.fillRect(0, h / 2 - 4, w, 4);
    }
    const r2 = mulberry32(seed + 1);
    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < 2; col++) {
        const x = 22 + col * 118;
        const y = 22 + row * 118;
        const on = r2() > 0.45;
        if (lit) {
          if (on) {
            g.fillStyle = r2() > 0.3 ? '#ffd98a' : '#cfe6ff';
            g.fillRect(x, y, 70, 82);
          }
        } else {
          g.fillStyle = '#e8eeee';
          g.fillRect(x - 5, y - 5, 80, 92);
          const gr = g.createLinearGradient(x, y, x + 70, y + 82);
          gr.addColorStop(0, '#9fc5d9');
          gr.addColorStop(1, '#4f7186');
          g.fillStyle = gr;
          g.fillRect(x, y, 70, 82);
          g.fillStyle = 'rgba(255,255,255,0.35)';
          g.beginPath();
          g.moveTo(x, y + 60);
          g.lineTo(x + 40, y);
          g.lineTo(x + 56, y);
          g.lineTo(x, y + 82);
          g.fill();
          g.fillStyle = '#e8eeee';
          g.fillRect(x + 33, y, 4, 82);
        }
      }
    }
    void rnd;
  };
  return { map: canvasTex(256, 256, draw(false)), lit: canvasTex(256, 256, draw(true)) };
}

export function signTexture(text: string, bg: string, fg = '#ffffff', icon?: string): THREE.CanvasTexture {
  return canvasTex(
    512,
    128,
    (g, w, h) => {
      g.fillStyle = bg;
      g.fillRect(0, 0, w, h);
      g.fillStyle = 'rgba(255,255,255,0.18)';
      g.fillRect(0, 0, w, 10);
      g.fillStyle = fg;
      const label = (icon ? icon + ' ' : '') + text;
      let size = 66;
      g.font = `bold ${size}px sans-serif`;
      const breite = g.measureText(label).width;
      if (breite > w - 40) size = Math.floor((size * (w - 40)) / breite);
      g.font = `bold ${size}px sans-serif`;
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.fillText(label, w / 2, h / 2 + 4);
    },
    false,
  );
}

export function spriteTexture(draw: (g: CanvasRenderingContext2D, s: number) => void, size = 128): THREE.CanvasTexture {
  return canvasTex(size, size, (g) => draw(g, size), false);
}

const std = (color: number | string, extra: THREE.MeshStandardMaterialParameters = {}) =>
  new THREE.MeshStandardMaterial({ color, roughness: 0.7, metalness: 0.05, ...extra });

export function box(w: number, h: number, d: number, mat: THREE.Material, x = 0, y = 0, z = 0, shadow = true) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z);
  m.castShadow = shadow;
  m.receiveShadow = true;
  return m;
}

/** Wagen: Karosserie, Kabine, Räder. Vorne ist +z. */
export function carModel(color: number | string, opts: { rtw?: boolean; length?: number } = {}) {
  const g = new THREE.Group();
  const L = opts.length ?? (opts.rtw ? 5.6 : 4.3);
  const H = opts.rtw ? 2.5 : 1.35;
  const body = std(color, { roughness: 0.35, metalness: 0.25 });
  g.add(box(2, H, L, body, 0, H / 2 + 0.35, 0));
  if (!opts.rtw) {
    g.add(box(1.8, 0.7, L * 0.5, std('#aecbd8', { roughness: 0.1, metalness: 0.4 }), 0, H + 0.6, -0.2));
  } else {
    g.add(box(2.02, 0.2, L, std('#d83a3a'), 0, 1.4, 0));
    g.add(box(1.7, 0.9, 1.5, std('#2f5f7a', { roughness: 0.1, metalness: 0.4 }), 0, H - 0.3 + 0.35, L / 2 - 0.9));
  }
  const wheel = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 14);
  const wm = std('#1f2a2d');
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      const w = new THREE.Mesh(wheel, wm);
      w.rotation.z = Math.PI / 2;
      w.position.set(sx * 1.02, 0.4, sz * L * 0.32);
      w.castShadow = true;
      g.add(w);
    }
  }
  g.add(box(1.6, 0.18, 0.06, std('#fff6c8', { emissive: 0xfff6c8, emissiveIntensity: 0.6 }), 0, 0.85, L / 2 + 0.02, false));
  g.add(box(1.6, 0.18, 0.06, std('#c62828', { emissive: 0xc62828, emissiveIntensity: 0.5 }), 0, 0.85, -L / 2 - 0.02, false));
  return g;
}

export function personModel(shirt: string, skin = '#e8b896', lying = false) {
  const g = new THREE.Group();
  const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.22, 0.65, 10), std(shirt));
  torso.position.y = 1.1;
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.15, 12, 10), std(skin));
  head.position.y = 1.62;
  const legL = box(0.14, 0.8, 0.16, std('#35506a'), -0.1, 0.4, 0);
  const legR = box(0.14, 0.8, 0.16, std('#35506a'), 0.1, 0.4, 0);
  legL.name = 'legL';
  legR.name = 'legR';
  torso.castShadow = head.castShadow = true;
  g.add(torso, head, legL, legR);
  if (lying) {
    g.rotation.x = -Math.PI / 2;
    g.position.y = 0.32;
  }
  return g;
}

/** Gegenstand in der Hand (links unten im Bild) */
export function itemModel(art: ItemArt): THREE.Group {
  const g = new THREE.Group();
  const em = (c: number, i = 0.8) => std(c, { emissive: c, emissiveIntensity: i });
  switch (art) {
    case 'handy':
    case 'funk': {
      const tall = art === 'funk';
      g.add(box(0.08, tall ? 0.2 : 0.16, 0.014, std('#1c2428'), 0, 0, 0, false));
      g.add(
        box(0.068, tall ? 0.09 : 0.138, 0.004, em(art === 'handy' ? 0x66d9ff : 0x66ff9c, 0.9), 0, tall ? 0.03 : 0, 0.009, false),
      );
      if (tall) g.add(box(0.012, 0.1, 0.012, std('#222'), 0.03, 0.15, 0, false));
      break;
    }
    case 'weste':
      g.add(box(0.26, 0.22, 0.05, std('#f2d21b'), 0, 0, 0, false));
      g.add(box(0.26, 0.03, 0.052, std('#eef3f5'), 0, 0.02, 0, false));
      g.add(box(0.26, 0.03, 0.052, std('#eef3f5'), 0, -0.05, 0, false));
      break;
    case 'dreieck': {
      const t = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.03, 3), std('#e5392e'));
      t.rotation.set(Math.PI / 2, Math.PI, 0);
      const i = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.034, 3), std('#ffffff'));
      i.rotation.set(Math.PI / 2, Math.PI, 0);
      g.add(t, i);
      break;
    }
    case 'verband':
      g.add(box(0.26, 0.18, 0.1, std('#1f8a5b'), 0, 0, 0, false));
      g.add(box(0.04, 0.12, 0.102, std('#ffffff'), 0, 0, 0, false));
      g.add(box(0.12, 0.04, 0.102, std('#ffffff'), 0, 0, 0, false));
      break;
    case 'licht': {
      const c = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.036, 0.22, 12), std('#2a3338'));
      c.rotation.x = Math.PI / 2;
      const l = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.034, 0.03, 12), em(0xfff3b0, 1));
      l.rotation.x = Math.PI / 2;
      l.position.z = -0.12;
      g.add(c, l);
      break;
    }
    case 'aed':
      g.add(box(0.24, 0.2, 0.09, std('#2fa874'), 0, 0, 0, false));
      g.add(box(0.1, 0.1, 0.092, std('#ffffff'), 0, 0.01, 0, false));
      g.add(box(0.05, 0.05, 0.094, em(0xe0393e, 0.6), 0, 0.01, 0, false));
      break;
    case 'decke':
      g.add(box(0.22, 0.16, 0.06, std('#e7c23a', { metalness: 0.6, roughness: 0.25 }), 0, 0, 0, false));
      break;
    case 'rucksack':
      g.add(box(0.22, 0.26, 0.1, std('#c8362b'), 0, 0, 0, false));
      g.add(box(0.22, 0.03, 0.102, std('#f7d33c'), 0, 0.02, 0, false));
      break;
    case 'monitor':
      g.add(box(0.26, 0.2, 0.1, std('#20272f'), 0, 0, 0, false));
      g.add(box(0.2, 0.12, 0.004, em(0x2be38b, 0.9), 0, 0.01, 0.052, false));
      break;
    case 'beatmung': {
      const s = new THREE.Mesh(new THREE.SphereGeometry(0.1, 14, 12), std('#7fc88a'));
      s.scale.set(1, 0.8, 1);
      g.add(s, box(0.08, 0.08, 0.06, std('#dfeef5'), 0.1, 0, 0, false));
      break;
    }
  }
  return g;
}

export function labelSprite(text: string, color = '#e0393e'): THREE.Sprite {
  const t = spriteTexture((g, s) => {
    g.fillStyle = color;
    g.beginPath();
    g.arc(s / 2, s / 2, s * 0.44, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = '#fff';
    g.font = `bold ${s * 0.6}px sans-serif`;
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText(text, s / 2, s / 2 + 4);
  });
  const m = new THREE.SpriteMaterial({ map: t, depthWrite: false, fog: false });
  const sp = new THREE.Sprite(m);
  sp.scale.set(2.4, 2.4, 1);
  return sp;
}
