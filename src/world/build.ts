import * as THREE from 'three';
import { asphaltTexture, box, canvasTex, carModel, facadeTextures, grassTexture, mulberry32, signTexture } from './models';

/** Die Stadt: 3 × 3 Straßen, 16 Blöcke mit Häusern, Park, Wache bzw. Hilfspunkt, Bahnhof und Markt */
export const ROADS = [-48, 0, 48];
export const ROAD_W = 10;
export const EXTENT = 88;
/** Blockbereiche entlang einer Achse (zwischen den Straßen) */
export const BLOCKS: [number, number][] = [
  [-85, -53],
  [-43, -5],
  [5, 43],
  [53, 85],
];

export interface Collider {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}
export interface Spawn {
  x: number;
  z: number;
  /** Blickrichtung zur Straße hin (Drehung um y) */
  ry: number;
}
export interface Block {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}
export interface WorldData {
  root: THREE.Group;
  colliders: Collider[];
  spawnPoints: Spawn[];
  blocks: Block[];
  /** Wache bzw. Hilfspunkt: Vorplatz, auf dem man startet, und Standort des Fahrzeugs */
  start: { x: number; z: number };
  fahrzeugPos: { x: number; z: number };
  /** Nacht-Anteil (0 Tag … 1 Nacht) für Fenster und Laternen */
  setNacht: (n: number) => void;
}

const PALETTE = ['#f1e3d0', '#dfeae6', '#f3d6d0', '#e4dcf2', '#f6edc4', '#d6e6f5'];
const SHOPS: [string, string][] = [
  ['CAFÉ', '#b5651d'],
  ['APOTHEKE', '#1f8a5b'],
  ['BÄCKEREI', '#c98a2b'],
  ['KIOSK', '#2f6fed'],
  ['FRISEUR', '#8b5cf6'],
  ['BANK', '#0f2a2e'],
  ['PIZZA', '#d8402f'],
];

export function buildWorld(rolle: 'helfer' | 'sani', seed: number): WorldData {
  const rnd = mulberry32(seed);
  const root = new THREE.Group();
  const colliders: Collider[] = [];
  const blocks: Block[] = [];
  const wallMats: THREE.MeshStandardMaterial[] = [];
  const nightMats: { m: THREE.MeshStandardMaterial; k: number }[] = [];

  // ---------- Boden und Straßen
  const grass = grassTexture();
  grass.repeat.set(70, 70);
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(500, 500), new THREE.MeshStandardMaterial({ map: grass, roughness: 1 }));
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.02;
  ground.receiveShadow = true;
  root.add(ground);

  const asphalt = asphaltTexture();
  const roadLen = EXTENT * 2 + 8;
  for (const r of ROADS) {
    const th = asphalt.clone();
    th.needsUpdate = true;
    th.repeat.set(roadLen / 8, 1);
    const hMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(roadLen, ROAD_W),
      new THREE.MeshStandardMaterial({ map: th, roughness: 0.95 }),
    );
    hMesh.rotation.x = -Math.PI / 2;
    hMesh.position.set(0, 0.02, r);
    hMesh.receiveShadow = true;
    root.add(hMesh);
    const tv = asphalt.clone();
    tv.needsUpdate = true;
    tv.center.set(0.5, 0.5);
    tv.rotation = Math.PI / 2;
    tv.repeat.set(roadLen / 8, 1);
    const vMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(ROAD_W, roadLen),
      new THREE.MeshStandardMaterial({ map: tv, roughness: 0.95 }),
    );
    vMesh.rotation.x = -Math.PI / 2;
    vMesh.position.set(r, 0.024, 0);
    vMesh.receiveShadow = true;
    root.add(vMesh);
  }
  // Kreuzungen glatt + Zebrastreifen
  const crossMat = new THREE.MeshStandardMaterial({ color: '#3b454a', roughness: 0.95 });
  const stripeGeo = new THREE.BoxGeometry(0.7, 0.03, 3.4);
  const stripes: THREE.Matrix4[] = [];
  const m4 = new THREE.Matrix4();
  for (const rx of ROADS) {
    for (const rz of ROADS) {
      const sq = new THREE.Mesh(new THREE.PlaneGeometry(ROAD_W, ROAD_W), crossMat);
      sq.rotation.x = -Math.PI / 2;
      sq.position.set(rx, 0.03, rz);
      sq.receiveShadow = true;
      root.add(sq);
      for (const side of [-1, 1]) {
        for (let i = -3; i <= 3; i++) {
          // über die Straße in x-Richtung (Zebra an der z-Seite)
          m4.makeTranslation(rx + i * 1.3, 0.04, rz + side * 5.6);
          stripes.push(m4.clone());
          const q = new THREE.Matrix4().makeRotationY(Math.PI / 2).setPosition(rx + side * 5.6, 0.04, rz + i * 1.3);
          stripes.push(q);
        }
      }
    }
  }
  const stripeMesh = new THREE.InstancedMesh(
    stripeGeo,
    new THREE.MeshStandardMaterial({ color: '#f4f7f4', roughness: 0.8 }),
    stripes.length,
  );
  stripes.forEach((m, i) => stripeMesh.setMatrixAt(i, m));
  stripeMesh.receiveShadow = true;
  root.add(stripeMesh);

  // ---------- Fassaden
  const facades = PALETTE.map((c, i) => facadeTextures(c, 100 + i * 7));
  const addWalls = (w: number, h: number, d: number, pi: number) => {
    const f = facades[pi % facades.length];
    const mk = (span: number) => {
      const map = f.map.clone();
      map.needsUpdate = true;
      map.repeat.set(Math.max(1, Math.round(span / 6.4)), Math.max(1, Math.round(h / 6.4)));
      const lit = f.lit.clone();
      lit.needsUpdate = true;
      lit.repeat.copy(map.repeat);
      const m = new THREE.MeshStandardMaterial({
        map,
        emissiveMap: lit,
        emissive: new THREE.Color('#ffe2a8'),
        emissiveIntensity: 0,
        roughness: 0.85,
      });
      wallMats.push(m);
      return m;
    };
    const front = mk(w);
    const side = mk(d);
    const roof = new THREE.MeshStandardMaterial({ color: '#b8c4c0', roughness: 0.9 });
    return [side, side, roof, roof, front, front];
  };

  const addSign = (
    parent: THREE.Object3D,
    text: string,
    bg: string,
    w: number,
    y: number,
    face: 'n' | 's' | 'e' | 'w',
    cx: number,
    cz: number,
    w2: number,
    d2: number,
  ) => {
    const tex = signTexture(text, bg);
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(w, w / 4),
      new THREE.MeshStandardMaterial({
        map: tex,
        emissiveMap: tex,
        emissive: new THREE.Color('#ffffff'),
        emissiveIntensity: 0.25,
      }),
    );
    const off = 0.06;
    if (face === 'n') {
      mesh.position.set(cx, y, cz - d2 / 2 - off);
      mesh.rotation.y = Math.PI;
    } else if (face === 's') {
      mesh.position.set(cx, y, cz + d2 / 2 + off);
    } else if (face === 'e') {
      mesh.position.set(cx + w2 / 2 + off, y, cz);
      mesh.rotation.y = Math.PI / 2;
    } else {
      mesh.position.set(cx - w2 / 2 - off, y, cz);
      mesh.rotation.y = -Math.PI / 2;
    }
    parent.add(mesh);
    nightMats.push({ m: mesh.material as THREE.MeshStandardMaterial, k: 0.9 });
  };

  const building = (
    cx: number,
    cz: number,
    w: number,
    d: number,
    h: number,
    pi: number,
    face: 'n' | 's' | 'e' | 'w',
    sign?: [string, string],
  ) => {
    const g = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), addWalls(w, h, d, pi));
    mesh.position.set(cx, h / 2, cz);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    g.add(mesh);
    const parapet = box(
      w + 0.5,
      0.5,
      d + 0.5,
      new THREE.MeshStandardMaterial({ color: '#9fb0aa', roughness: 0.9 }),
      cx,
      h + 0.25,
      cz,
    );
    g.add(parapet);
    if (rnd() > 0.4)
      g.add(
        box(
          2.2,
          1.2,
          2.2,
          new THREE.MeshStandardMaterial({ color: '#c9d4d0' }),
          cx + (rnd() - 0.5) * (w - 4),
          h + 1.1,
          cz + (rnd() - 0.5) * (d - 4),
        ),
      );
    colliders.push({ minX: cx - w / 2 - 0.2, maxX: cx + w / 2 + 0.2, minZ: cz - d / 2 - 0.2, maxZ: cz + d / 2 + 0.2 });
    if (sign) addSign(g, sign[0], sign[1], Math.min(7, w - 1.5), 3.6, face, cx, cz, w, d);
    root.add(g);
    return mesh;
  };

  // ---------- Bäume
  const treeSpots: { x: number; z: number; s: number }[] = [];
  const tree = (x: number, z: number, s = 1) => {
    treeSpots.push({ x, z, s });
    colliders.push({ minX: x - 0.45, maxX: x + 0.45, minZ: z - 0.45, maxZ: z + 0.45 });
  };

  // ---------- Blöcke
  let start = { x: 24, z: -4 };
  let fahrzeugPos = { x: 17, z: -7.2 };
  const benches: { x: number; z: number; ry: number }[] = [];
  const pondSpots: { x: number; z: number; r: number }[] = [];

  const rowAlong = (b: Block, axis: 'x' | 'z') => {
    const faces: Record<string, 'n' | 's' | 'e' | 'w'> = axis === 'x' ? { a: 'n', b: 's' } : { a: 'w', b: 'e' };
    for (const side of ['a', 'b'] as const) {
      const depth = 9 + rnd() * 3;
      if (axis === 'x') {
        let x = b.minX + 4;
        while (x < b.maxX - 12) {
          const w = Math.min(8 + rnd() * 6, b.maxX - 4 - x);
          if (w < 6) break;
          const h = 8 + Math.floor(rnd() * 4) * 3;
          const cz = side === 'a' ? b.minZ + 4 + depth / 2 : b.maxZ - 4 - depth / 2;
          building(
            x + w / 2,
            cz,
            w,
            depth,
            h,
            Math.floor(rnd() * 6),
            faces[side],
            rnd() > 0.55 ? SHOPS[Math.floor(rnd() * SHOPS.length)] : undefined,
          );
          x += w + 0.8 + rnd() * 1.5;
        }
      } else {
        let z = b.minZ + 4;
        while (z < b.maxZ - 12) {
          const w = Math.min(8 + rnd() * 6, b.maxZ - 4 - z);
          if (w < 6) break;
          const h = 8 + Math.floor(rnd() * 4) * 3;
          const cx = side === 'a' ? b.minX + 4 + depth / 2 : b.maxX - 4 - depth / 2;
          building(
            cx,
            z + w / 2,
            depth,
            w,
            h,
            Math.floor(rnd() * 6),
            faces[side],
            rnd() > 0.55 ? SHOPS[Math.floor(rnd() * SHOPS.length)] : undefined,
          );
          z += w + 0.8 + rnd() * 1.5;
        }
      }
    }
    // Innenhof mit Bäumen
    const cxm = (b.minX + b.maxX) / 2;
    const czm = (b.minZ + b.maxZ) / 2;
    for (let i = 0; i < 3; i++) tree(cxm + (rnd() - 0.5) * 14, czm + (rnd() - 0.5) * 14, 0.9 + rnd() * 0.5);
  };

  const park = (b: Block) => {
    const cx = (b.minX + b.maxX) / 2;
    const cz = (b.minZ + b.maxZ) / 2;
    pondSpots.push({ x: cx + 4, z: cz - 3, r: 6 });
    for (let i = 0; i < 26; i++) {
      const x = b.minX + 5 + rnd() * (b.maxX - b.minX - 10);
      const z = b.minZ + 5 + rnd() * (b.maxZ - b.minZ - 10);
      if (Math.hypot(x - (cx + 4), z - (cz - 3)) < 8) continue;
      tree(x, z, 0.9 + rnd() * 0.9);
    }
    for (let i = 0; i < 4; i++) benches.push({ x: cx - 8 + i * 5, z: cz + 8, ry: 0 });
  };

  for (let ix = 0; ix < 4; ix++) {
    for (let iz = 0; iz < 4; iz++) {
      const b: Block = { minX: BLOCKS[ix][0], maxX: BLOCKS[ix][1], minZ: BLOCKS[iz][0], maxZ: BLOCKS[iz][1] };
      blocks.push(b);
      const isPark = (ix === 1 && iz === 1) || (ix === 0 && iz === 0) || (ix === 3 && iz === 3) || (ix === 0 && iz === 3);
      const wd = b.maxX - b.minX;
      const dd = b.maxZ - b.minZ;
      // Pflaster bzw. Rasen
      const slab = new THREE.Mesh(
        new THREE.BoxGeometry(wd, 0.15, dd),
        new THREE.MeshStandardMaterial({ color: isPark ? '#8fd29a' : '#d6dedb', roughness: 0.95 }),
      );
      slab.position.set((b.minX + b.maxX) / 2, 0.075, (b.minZ + b.maxZ) / 2);
      slab.receiveShadow = true;
      root.add(slab);

      if (isPark) {
        park(b);
      } else if (ix === 2 && iz === 1) {
        // Wache / Hilfspunkt
        const w = 24;
        const d = 12;
        const cx = 24;
        const cz = -5 - 4 - d / 2;
        const bm = building(cx, cz, w, d, 9, 4, 's');
        (bm.material as THREE.MeshStandardMaterial[]).forEach((m) => {
          if (m.map) m.color = new THREE.Color(rolle === 'helfer' ? '#c9f0e2' : '#ffe0d8');
        });
        // Tore + Schild
        const dmat = new THREE.MeshStandardMaterial({ color: '#46585a', roughness: 0.5 });
        for (const dx of [-5.5, 5.5]) {
          const door = box(5, 4.6, 0.2, dmat, cx + dx, 2.3, cz + d / 2 + 0.1);
          root.add(door);
          for (let k = 0; k < 6; k++)
            root.add(
              box(
                4.8,
                0.08,
                0.05,
                new THREE.MeshStandardMaterial({ color: '#6b8083' }),
                cx + dx,
                0.8 + k * 0.7,
                cz + d / 2 + 0.22,
                false,
              ),
            );
        }
        addSign(
          root,
          rolle === 'helfer' ? 'HILFSPUNKT' : 'RETTUNGSWACHE',
          rolle === 'helfer' ? '#0a8576' : '#c62f34',
          14,
          7,
          's',
          cx,
          cz,
          w,
          d,
        );
        root.add(
          box(
            w + 0.4,
            0.3,
            1.8,
            new THREE.MeshStandardMaterial({ color: rolle === 'helfer' ? '#0a8576' : '#e0393e' }),
            cx,
            5,
            cz + d / 2 + 0.9,
          ),
        );
        start = { x: cx, z: -3.2 };
        fahrzeugPos = { x: cx - 8, z: cz + d / 2 + 3.2 };
        // zweite Reihe hinten
        let x = b.minX + 4;
        while (x < b.maxX - 12) {
          const bw = 8 + rnd() * 5;
          building(x + bw / 2, b.minZ + 4 + 5, bw, 10, 8 + Math.floor(rnd() * 3) * 3, Math.floor(rnd() * 6), 'n');
          x += bw + 1.5;
        }
        for (let i = 0; i < 4; i++) tree(b.minX + 8 + i * 8, cz - 9, 1);
      } else if (ix === 1 && iz === 2) {
        // Bahnhof
        building((b.minX + b.maxX) / 2, b.minZ + 4 + 7, 32, 14, 12, 3, 'n', ['BAHNHOF', '#2f6fed']);
        rowAlong({ ...b, minZ: b.minZ + 18 }, 'x');
      } else if (ix === 2 && iz === 2) {
        // Markt
        building((b.minX + b.maxX) / 2, b.minZ + 4 + 8, 30, 16, 8, 1, 'n', ['MARKT', '#d8402f']);
        rowAlong({ ...b, minZ: b.minZ + 20 }, 'x');
      } else {
        rowAlong(b, (ix + iz) % 2 === 0 ? 'x' : 'z');
      }
    }
  }

  // ---------- Bäume als Instanzen
  const trunkGeo = new THREE.CylinderGeometry(0.22, 0.3, 2.6, 7);
  const crownGeo = new THREE.IcosahedronGeometry(1.7, 1);
  const trunkMesh = new THREE.InstancedMesh(
    trunkGeo,
    new THREE.MeshStandardMaterial({ color: '#7a5a43', roughness: 1 }),
    treeSpots.length,
  );
  const crownMesh = new THREE.InstancedMesh(
    crownGeo,
    new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.9 }),
    treeSpots.length,
  );
  const dummy = new THREE.Object3D();
  const greens = ['#4fae6e', '#5cc084', '#3f9a5f', '#6fcf8e'];
  treeSpots.forEach((t, i) => {
    dummy.position.set(t.x, 1.3 * t.s, t.z);
    dummy.scale.set(t.s, t.s, t.s);
    dummy.rotation.set(0, 0, 0);
    dummy.updateMatrix();
    trunkMesh.setMatrixAt(i, dummy.matrix);
    dummy.position.set(t.x, 3.6 * t.s, t.z);
    dummy.scale.set(t.s * (0.9 + rnd() * 0.3), t.s * (0.9 + rnd() * 0.3), t.s * (0.9 + rnd() * 0.3));
    dummy.updateMatrix();
    crownMesh.setMatrixAt(i, dummy.matrix);
    crownMesh.setColorAt(i, new THREE.Color(greens[Math.floor(rnd() * greens.length)]));
  });
  trunkMesh.castShadow = crownMesh.castShadow = true;
  root.add(trunkMesh, crownMesh);

  // ---------- Teich und Bänke
  for (const p of pondSpots) {
    const pond = new THREE.Mesh(
      new THREE.CircleGeometry(p.r, 28),
      new THREE.MeshStandardMaterial({ color: '#6bb7d8', roughness: 0.1, metalness: 0.35 }),
    );
    pond.rotation.x = -Math.PI / 2;
    pond.position.set(p.x, 0.17, p.z);
    root.add(pond);
    colliders.push({ minX: p.x - p.r * 0.8, maxX: p.x + p.r * 0.8, minZ: p.z - p.r * 0.8, maxZ: p.z + p.r * 0.8 });
  }
  const benchMat = new THREE.MeshStandardMaterial({ color: '#9a6b45', roughness: 0.8 });
  for (const b of benches) {
    root.add(box(2, 0.12, 0.6, benchMat, b.x, 0.55, b.z));
    root.add(box(2, 0.5, 0.1, benchMat, b.x, 0.85, b.z + 0.3));
    colliders.push({ minX: b.x - 1, maxX: b.x + 1, minZ: b.z - 0.4, maxZ: b.z + 0.4 });
  }

  // ---------- Laternen
  const lampPos: { x: number; z: number }[] = [];
  for (const r of ROADS) {
    for (let t = -80; t <= 80; t += 24) {
      if (ROADS.some((q) => Math.abs(t - q) < 8)) continue;
      lampPos.push({ x: t, z: r + 5.9 }, { x: t + 12, z: r - 5.9 });
      lampPos.push({ x: r + 5.9, z: t + 12 }, { x: r - 5.9, z: t });
    }
  }
  const poleMesh = new THREE.InstancedMesh(
    new THREE.CylinderGeometry(0.07, 0.1, 5, 6),
    new THREE.MeshStandardMaterial({ color: '#4b5b5e' }),
    lampPos.length,
  );
  const headMat = new THREE.MeshStandardMaterial({
    color: '#fff3c4',
    emissive: new THREE.Color('#ffe08a'),
    emissiveIntensity: 0,
  });
  const headMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(0.7, 0.18, 0.4), headMat, lampPos.length);
  lampPos.forEach((p, i) => {
    dummy.position.set(p.x, 2.5, p.z);
    dummy.scale.set(1, 1, 1);
    dummy.updateMatrix();
    poleMesh.setMatrixAt(i, dummy.matrix);
    dummy.position.set(p.x, 5.1, p.z);
    dummy.updateMatrix();
    headMesh.setMatrixAt(i, dummy.matrix);
  });
  poleMesh.castShadow = true;
  root.add(poleMesh, headMesh);

  // ---------- Fahrzeug vor der Wache
  const veh = rolle === 'sani' ? carModel('#ffffff', { rtw: true }) : carModel('#4c8df0');
  veh.position.set(fahrzeugPos.x, 0.15, fahrzeugPos.z);
  veh.rotation.y = Math.PI / 2;
  root.add(veh);
  colliders.push({ minX: fahrzeugPos.x - 3, maxX: fahrzeugPos.x + 3, minZ: fahrzeugPos.z - 1.4, maxZ: fahrzeugPos.z + 1.4 });

  // ---------- Notfall-Orte am Straßenrand
  const spawnPoints: Spawn[] = [];
  for (const r of ROADS) {
    for (let t = -75; t <= 75; t += 10) {
      if (ROADS.some((q) => Math.abs(t - q) < 9)) continue;
      for (const s of [-1, 1]) {
        spawnPoints.push({ x: t, z: r + s * 6.9, ry: s > 0 ? Math.PI : 0 });
        spawnPoints.push({ x: r + s * 6.9, z: t, ry: s > 0 ? -Math.PI / 2 : Math.PI / 2 });
      }
    }
  }

  const setNacht = (n: number) => {
    for (const m of wallMats) m.emissiveIntensity = n * 1.1;
    for (const m of nightMats) m.m.emissiveIntensity = 0.25 + n * m.k;
    headMat.emissiveIntensity = n * 2.2;
  };
  void canvasTex;
  return { root, colliders, spawnPoints, blocks, start, fahrzeugPos, setNacht };
}
