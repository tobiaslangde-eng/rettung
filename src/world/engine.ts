import * as THREE from 'three';
import { BLOCKS, Block, Collider, EXTENT, ROADS, Spawn, WorldData, buildWorld } from './build';
import { ItemDef } from './items';
import { box, carModel, itemModel, labelSprite, mulberry32, personModel, spriteTexture } from './models';

export interface SlotState {
  id: string;
  icon: string;
  name: string;
  text: string;
  stufe?: string;
  active: boolean;
  status: string;
}
export interface Aufgabe {
  text: string;
  erledigt: boolean;
}
export interface HudState {
  zeit: string;
  nacht: number;
  nah: null | { dist: number; vorbereitet: string[]; rtw: 'keiner' | 'unterwegs' | 'da'; abgesichert: boolean; art: string };
  ziel: null | { winkel: number; dist: number; art: string };
  slots: SlotState[];
  aktiv: number;
  weste: boolean;
  licht: boolean;
  meldung: string;
  aufgaben: Aufgabe[];
  geholfen: number;
  gesperrt: boolean;
  touch: boolean;
}
export interface HelfenInfo {
  id: number;
  art: 'kollaps' | 'unfall';
  bonus: number;
  zeilen: string[];
}
export interface WorldOptions {
  rolle: 'helfer' | 'sani';
  items: ItemDef[];
  mobile: boolean;
  lichtStufe: number;
  onHud: (h: HudState) => void;
  onHelfen: (i: HelfenInfo) => void;
}

interface Emergency {
  id: number;
  art: 'kollaps' | 'unfall';
  pos: THREE.Vector3;
  group: THREE.Group;
  beacon: THREE.Mesh;
  label: THREE.Sprite;
  vorbereitet: Set<string>;
  rtw: 'keiner' | 'unterwegs' | 'da';
  abgesichert: boolean;
  smoke: THREE.Sprite[];
}
interface Walker {
  g: THREE.Group;
  target: THREE.Vector3;
  speed: number;
  phase: number;
}
interface Traffic {
  g: THREE.Group;
  axis: 'x' | 'z';
  dir: 1 | -1;
  lane: number;
  speed: number;
  cur: number;
}

const TAU = Math.PI * 2;
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Himmelsfarben: 0 = Mitternacht, 0.5 = Mittag */
const SKY: [number, string][] = [
  [0, '#0a1530'],
  [0.2, '#16264a'],
  [0.27, '#f2a98c'],
  [0.34, '#9fd4ee'],
  [0.5, '#8fd0f0'],
  [0.68, '#9fd4ee'],
  [0.76, '#f59a7a'],
  [0.84, '#243a6a'],
  [1, '#0a1530'],
];
function skyAt(t: number): THREE.Color {
  for (let i = 0; i < SKY.length - 1; i++) {
    const [a, ca] = SKY[i];
    const [b, cb] = SKY[i + 1];
    if (t >= a && t <= b) return new THREE.Color(ca).lerp(new THREE.Color(cb), (t - a) / (b - a));
  }
  return new THREE.Color(SKY[0][1]);
}

export class WorldEngine {
  private o: WorldOptions;
  private renderer!: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(72, 1, 0.08, 420);
  private world!: WorldData;
  private container!: HTMLElement;
  private overlay!: HTMLCanvasElement;
  private oc!: CanvasRenderingContext2D;
  private raf = 0;
  private last = 0;
  private paused = true;
  private disposed = false;

  // Spieler
  private pos = new THREE.Vector3(0, 1.7, 0);
  private yaw = Math.PI;
  private pitch = 0;
  private bob = 0;
  private keys = new Set<string>();
  private sprint = false;
  private stick = { id: -1, x: 0, y: 0, cx: 0, cy: 0 };
  private look = { id: -1, x: 0, y: 0 };
  private lookDelta = { x: 0, y: 0 };
  private touchMode = false;
  private locked = false;

  // Welt
  private sun!: THREE.DirectionalLight;
  private hemi!: THREE.HemisphereLight;
  private sunMesh!: THREE.Mesh;
  private moonMesh!: THREE.Mesh;
  private stars!: THREE.Points;
  private time = 0.36;
  private walkers: Walker[] = [];
  private traffic: Traffic[] = [];
  private emergencies: Emergency[] = [];
  private nextId = 1;
  private spawnTimer = 6;
  private rtw: {
    g: THREE.Group;
    path: THREE.Vector3[];
    idx: number;
    target: Emergency | null;
    lights: THREE.PointLight[];
    phase: number;
  } | null = null;
  private siren: { ctx: AudioContext; osc: OscillatorNode; gain: GainNode } | null = null;
  private rnd = mulberry32(7);
  private placed: THREE.Object3D[] = [];

  // Inventar
  private active = 0;
  private weste = false;
  private licht = false;
  private held!: THREE.Group;
  private heldModels: THREE.Group[] = [];
  private flash!: THREE.SpotLight;
  private placedDreieck = 0;
  private meldung = '';
  private meldungT = 0;
  private geholfen = 0;
  private aufgaben: Aufgabe[];
  private hudT = 0;
  private lastHelfen = 0;

  constructor(o: WorldOptions) {
    this.o = o;
    this.touchMode = o.mobile;
    this.aufgaben =
      o.rolle === 'helfer'
        ? [
            { text: 'Warnweste anziehen', erledigt: false },
            { text: 'Zu einem Notfall laufen (rotes Licht)', erledigt: false },
            { text: 'Warndreieck aufstellen', erledigt: false },
            { text: '112 anrufen', erledigt: false },
            { text: 'Verletzten helfen', erledigt: false },
          ]
        : [
            { text: 'Warnweste anziehen', erledigt: false },
            { text: 'Zum Einsatzort laufen (rotes Licht)', erledigt: false },
            { text: 'Funkgerät: Leitstelle informieren', erledigt: false },
            { text: 'Ausrüstung beim Patienten bereitstellen', erledigt: false },
            { text: 'Patienten versorgen', erledigt: false },
          ];
  }

  // ---------------------------------------------------------------- Aufbau
  mount(container: HTMLElement) {
    this.container = container;
    const w = container.clientWidth || 800;
    const h = container.clientHeight || 600;
    this.renderer = new THREE.WebGLRenderer({ antialias: !this.o.mobile, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, this.o.mobile ? 1.5 : 2));
    this.renderer.setSize(w, h);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    const cv = this.renderer.domElement;
    cv.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;touch-action:none;outline:none;';
    container.appendChild(cv);

    this.overlay = document.createElement('canvas');
    this.overlay.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;';
    container.appendChild(this.overlay);
    this.oc = this.overlay.getContext('2d')!;
    this.resize();

    this.world = buildWorld(this.o.rolle, 20260 + (this.o.rolle === 'sani' ? 1 : 0));
    this.scene.add(this.world.root);
    this.scene.fog = new THREE.Fog('#9fd4ee', 40, 230);
    this.camera.position.copy(this.pos);
    this.scene.add(this.camera);

    // Licht
    this.hemi = new THREE.HemisphereLight('#cfe8ff', '#7a8f7a', 0.9);
    this.scene.add(this.hemi);
    this.sun = new THREE.DirectionalLight('#fff1d6', 2.2);
    this.sun.castShadow = true;
    const ms = this.o.mobile ? 1024 : 2048;
    this.sun.shadow.mapSize.set(ms, ms);
    const sc = this.sun.shadow.camera;
    sc.left = -45;
    sc.right = 45;
    sc.top = 45;
    sc.bottom = -45;
    sc.near = 1;
    sc.far = 260;
    this.sun.shadow.bias = -0.0004;
    this.scene.add(this.sun, this.sun.target);
    this.sunMesh = new THREE.Mesh(
      new THREE.SphereGeometry(10, 16, 12),
      new THREE.MeshBasicMaterial({ color: '#fff3b0', fog: false }),
    );
    this.moonMesh = new THREE.Mesh(
      new THREE.SphereGeometry(7, 16, 12),
      new THREE.MeshBasicMaterial({ color: '#dfe8ff', fog: false }),
    );
    this.scene.add(this.sunMesh, this.moonMesh);
    const sp = new Float32Array(600 * 3);
    for (let i = 0; i < 600; i++) {
      const a = this.rnd() * TAU;
      const b = Math.acos(this.rnd() * 0.95);
      sp[i * 3] = 300 * Math.sin(b) * Math.cos(a);
      sp[i * 3 + 1] = 300 * Math.cos(b);
      sp[i * 3 + 2] = 300 * Math.sin(b) * Math.sin(a);
    }
    const sg = new THREE.BufferGeometry();
    sg.setAttribute('position', new THREE.BufferAttribute(sp, 3));
    this.stars = new THREE.Points(
      sg,
      new THREE.PointsMaterial({
        color: '#ffffff',
        size: 1.6,
        sizeAttenuation: false,
        transparent: true,
        opacity: 0,
        fog: false,
      }),
    );
    this.scene.add(this.stars);

    // Taschenlampe + Gegenstand in der Hand
    this.flash = new THREE.SpotLight('#fff3c4', 0, 28 + this.o.lichtStufe * 10, 0.42, 0.5, 1.2);
    this.flash.position.set(0.2, -0.1, 0);
    this.flash.target.position.set(0.2, -0.1, -10);
    this.camera.add(this.flash, this.flash.target);
    this.held = new THREE.Group();
    this.held.position.set(0.34, -0.3, -0.62);
    this.held.scale.setScalar(0.5);
    this.held.rotation.set(0.08, -0.4, 0.04);
    const handLicht = new THREE.PointLight('#ffffff', 0.9, 2.2, 1.5);
    handLicht.position.set(0, 0.3, 0.2);
    this.held.add(handLicht);
    this.camera.add(this.held);
    for (const it of this.o.items) {
      const m = itemModel(it.art);
      m.visible = false;
      this.held.add(m);
      this.heldModels.push(m);
    }
    this.heldModels[0].visible = true;

    // Start auf dem Vorplatz, Blick zur Straße
    this.pos.set(this.world.start.x, 1.7, this.world.start.z);
    this.yaw = Math.PI;

    this.populate();
    this.attach();
  }

  private populate() {
    // Fußgänger
    const shirts = ['#e57373', '#64b5f6', '#81c784', '#ffd54f', '#ba68c8', '#4db6ac', '#ff8a65'];
    for (let i = 0; i < 16; i++) {
      const m = personModel(shirts[i % shirts.length], i % 3 === 0 ? '#c99373' : '#e8b896');
      const p = this.randomPavement();
      m.position.copy(p);
      this.scene.add(m);
      this.walkers.push({ g: m, target: this.randomPavement(), speed: 1.1 + this.rnd() * 0.8, phase: this.rnd() * 6 });
    }
    // Verkehr
    const colors = ['#e57373', '#64b5f6', '#81c784', '#ffd54f', '#b39ddb', '#90a4ae'];
    let ci = 0;
    for (const r of ROADS) {
      for (const lane of [-2.5, 2.5]) {
        for (let k = 0; k < 2; k++) {
          const axis: 'x' | 'z' = k === 0 ? 'x' : 'z';
          const dir: 1 | -1 = lane > 0 ? 1 : -1;
          const g = carModel(colors[ci++ % colors.length]);
          this.scene.add(g);
          this.traffic.push({
            g,
            axis,
            dir,
            lane: r + lane * (axis === 'x' ? 1 : -1),
            speed: 7 + (axis === 'x' ? 0 : 1),
            cur: -80 + this.rnd() * 160,
          });
        }
      }
    }
  }

  private randomPavement(): THREE.Vector3 {
    const b = this.world.blocks[Math.floor(this.rnd() * this.world.blocks.length)];
    const side = Math.floor(this.rnd() * 4);
    const t = this.rnd();
    const off = 0.8 + this.rnd() * 2;
    if (side === 0) return new THREE.Vector3(lerp(b.minX, b.maxX, t), 0.15, b.minZ + off);
    if (side === 1) return new THREE.Vector3(lerp(b.minX, b.maxX, t), 0.15, b.maxZ - off);
    if (side === 2) return new THREE.Vector3(b.minX + off, 0.15, lerp(b.minZ, b.maxZ, t));
    return new THREE.Vector3(b.maxX - off, 0.15, lerp(b.minZ, b.maxZ, t));
  }

  // ---------------------------------------------------------------- Eingaben
  private onKeyDown = (e: KeyboardEvent) => {
    if (this.paused) return;
    const k = e.key.toLowerCase();
    this.keys.add(k);
    if (k === 'shift') this.sprint = true;
    if (k === 'e') this.interact();
    if (k === 'f') this.use();
    if (/^[1-9]$/.test(k)) this.select(Number(k) - 1);
    if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(k)) e.preventDefault();
  };
  private onKeyUp = (e: KeyboardEvent) => {
    const k = e.key.toLowerCase();
    this.keys.delete(k);
    if (k === 'shift') this.sprint = false;
  };
  private onMouseMove = (e: MouseEvent) => {
    if (this.paused) return;
    // Chrome liefert beim Einrasten manchmal einen riesigen ersten Ausschlag: ignorieren
    if (Math.abs(e.movementX) > 180 || Math.abs(e.movementY) > 180) return;
    if (this.locked || e.buttons & 1) {
      this.lookDelta.x += e.movementX;
      this.lookDelta.y += e.movementY;
    }
  };
  private onPointerDown = (e: PointerEvent) => {
    if (this.paused) return;
    this.startAudio();
    if (e.pointerType === 'mouse') {
      this.touchMode = false;
      if (!this.locked) this.renderer.domElement.requestPointerLock?.();
      return;
    }
    this.touchMode = true;
    const rect = this.container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (x < rect.width * 0.45 && this.stick.id < 0) {
      this.stick = { id: e.pointerId, x: 0, y: 0, cx: x, cy: y };
    } else if (this.look.id < 0) {
      this.look = { id: e.pointerId, x: e.clientX, y: e.clientY };
    }
    (e.target as Element).setPointerCapture?.(e.pointerId);
  };
  private onPointerMove = (e: PointerEvent) => {
    if (e.pointerType === 'mouse') return;
    const rect = this.container.getBoundingClientRect();
    if (e.pointerId === this.stick.id) {
      const dx = e.clientX - rect.left - this.stick.cx;
      const dy = e.clientY - rect.top - this.stick.cy;
      const m = Math.min(1, Math.hypot(dx, dy) / 60);
      const a = Math.atan2(dy, dx);
      this.stick.x = Math.cos(a) * m;
      this.stick.y = Math.sin(a) * m;
    } else if (e.pointerId === this.look.id) {
      this.lookDelta.x += (e.clientX - this.look.x) * 1.6;
      this.lookDelta.y += (e.clientY - this.look.y) * 1.6;
      this.look.x = e.clientX;
      this.look.y = e.clientY;
    }
  };
  private onPointerUp = (e: PointerEvent) => {
    if (e.pointerId === this.stick.id) this.stick = { id: -1, x: 0, y: 0, cx: 0, cy: 0 };
    if (e.pointerId === this.look.id) this.look = { id: -1, x: 0, y: 0 };
  };
  private onLockChange = () => {
    this.locked = document.pointerLockElement === this.renderer.domElement;
  };
  private onResize = () => this.resize();

  private attach() {
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('resize', this.onResize);
    document.addEventListener('pointerlockchange', this.onLockChange);
    const el = this.renderer.domElement;
    el.addEventListener('pointerdown', this.onPointerDown);
    el.addEventListener('pointermove', this.onPointerMove);
    el.addEventListener('pointerup', this.onPointerUp);
    el.addEventListener('pointercancel', this.onPointerUp);
  }

  private resize() {
    if (!this.container) return;
    const w = this.container.clientWidth || 800;
    const h = this.container.clientHeight || 600;
    this.renderer.setSize(w, h);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.overlay.width = Math.floor(w * dpr);
    this.overlay.height = Math.floor(h * dpr);
    this.oc.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  // ---------------------------------------------------------------- Steuerung von außen
  setPaused(p: boolean) {
    this.paused = p;
    if (p) {
      this.keys.clear();
      this.stick = { id: -1, x: 0, y: 0, cx: 0, cy: 0 };
      this.look = { id: -1, x: 0, y: 0 };
      if (document.pointerLockElement) document.exitPointerLock?.();
      this.stopSiren();
      cancelAnimationFrame(this.raf);
      this.raf = 0;
    } else if (!this.raf && !this.disposed) {
      this.last = performance.now();
      this.raf = requestAnimationFrame(this.loop);
    }
  }
  requestLock() {
    this.startAudio();
    this.renderer.domElement.requestPointerLock?.();
  }
  sprintOn(on: boolean) {
    this.sprint = on;
  }
  select(i: number) {
    if (i < 0 || i >= this.o.items.length) return;
    this.active = i;
    this.heldModels.forEach((m, k) => (m.visible = k === i));
  }
  private say(t: string) {
    this.meldung = t;
    this.meldungT = 3.2;
  }
  private done(i: number) {
    if (this.aufgaben[i]) this.aufgaben[i].erledigt = true;
  }
  private bonusInfo(em: Emergency): HelfenInfo {
    const zeilen: string[] = [];
    let bonus = 0;
    if (this.weste) {
      bonus += 10;
      zeilen.push('Warnweste getragen +10');
    }
    if (em.abgesichert) {
      bonus += 12;
      zeilen.push('Stelle abgesichert +12');
    }
    if (em.rtw !== 'keiner') {
      bonus += 15;
      zeilen.push('Notruf abgesetzt +15');
    }
    em.vorbereitet.forEach((id) => {
      const it = this.o.items.find((x) => x.id === id);
      bonus += 8;
      zeilen.push(`${it?.name ?? id} bereitgestellt +8`);
    });
    return { id: em.id, art: em.art, bonus, zeilen };
  }

  /** Nächster Notfall in Reichweite */
  private nearest(maxD = 1e9): { em: Emergency; d: number } | null {
    let best: { em: Emergency; d: number } | null = null;
    for (const em of this.emergencies) {
      const d = Math.hypot(em.pos.x - this.pos.x, em.pos.z - this.pos.z);
      if (d < maxD && (!best || d < best.d)) best = { em, d };
    }
    return best;
  }

  interact() {
    if (this.paused) return;
    const n = this.nearest(4);
    if (!n) {
      this.say('Hier gibt es nichts zu tun. Folge dem roten Licht!');
      return;
    }
    if (performance.now() - this.lastHelfen < 800) return;
    this.lastHelfen = performance.now();
    this.done(this.o.rolle === 'helfer' ? 4 : 4);
    this.o.onHelfen(this.bonusInfo(n.em));
  }

  /** Gegenstand benutzen */
  use() {
    if (this.paused) return;
    const it = this.o.items[this.active];
    if (!it) return;
    const n = this.nearest(14);
    switch (it.kind) {
      case 'weste':
        this.weste = !this.weste;
        this.say(this.weste ? 'Warnweste angezogen – Eigenschutz!' : 'Warnweste ausgezogen');
        if (this.weste) this.done(0);
        break;
      case 'licht':
        this.licht = !this.licht;
        this.flash.intensity = this.licht ? 14 + this.o.lichtStufe * 6 : 0;
        this.say(this.licht ? 'Taschenlampe an' : 'Taschenlampe aus');
        break;
      case 'dreieck': {
        if (this.placedDreieck >= 3) {
          this.say('Du hast schon genug Warndreiecke aufgestellt.');
          break;
        }
        const t = new THREE.Mesh(
          new THREE.CylinderGeometry(0.45, 0.45, 0.04, 3),
          new THREE.MeshStandardMaterial({ color: '#e5392e', emissive: '#e5392e', emissiveIntensity: 0.25 }),
        );
        const inner = new THREE.Mesh(
          new THREE.CylinderGeometry(0.28, 0.28, 0.05, 3),
          new THREE.MeshStandardMaterial({ color: '#ffffff' }),
        );
        const g = new THREE.Group();
        g.add(t, inner);
        g.rotation.set(Math.PI / 2, Math.PI, 0);
        const holder = new THREE.Group();
        holder.add(g);
        const dir = new THREE.Vector3(-Math.sin(this.yaw), 0, -Math.cos(this.yaw));
        holder.position.set(this.pos.x + dir.x * 2, 0.55, this.pos.z + dir.z * 2);
        holder.rotation.y = this.yaw;
        g.castShadow = true;
        this.scene.add(holder);
        this.placed.push(holder);
        this.placedDreieck++;
        this.done(2);
        this.say('Warndreieck aufgestellt');
        if (n && n.d < 30) {
          n.em.abgesichert = true;
          this.say('Stelle abgesichert ✓');
        }
        break;
      }
      case 'notruf':
        if (!n) {
          this.say('Hier ist gerade kein Notfall in der Nähe. Laufe zum roten Licht.');
          break;
        }
        if (n.em.rtw !== 'keiner') {
          this.say('Der Rettungswagen ist schon alarmiert.');
          break;
        }
        this.startRtw(n.em);
        this.done(this.o.rolle === 'helfer' ? 3 : 2);
        this.say(
          this.o.rolle === 'helfer'
            ? '112 gewählt: Rettungswagen ist unterwegs!'
            : 'Leitstelle informiert: Rettungswagen rückt aus!',
        );
        break;
      case 'bereitstellen':
        if (!n || n.d > 9) {
          this.say('Gehe näher zur verletzten Person, um das bereitzustellen.');
          break;
        }
        if (n.em.vorbereitet.has(it.id)) {
          this.say(`${it.name} liegt schon bereit.`);
          break;
        }
        n.em.vorbereitet.add(it.id);
        if (this.o.rolle === 'sani') this.done(3);
        this.say(`${it.name} bereitgestellt ✓`);
        break;
    }
  }

  /** Nach dem Notfall: Notfall auflösen */
  resolve(erfolg: boolean, bonusPunkte: number) {
    const target = this.emergencies.find((e) => e.id === this.lastHelfenId);
    if (target) this.removeEmergency(target);
    this.geholfen++;
    this.spawnTimer = 14;
    this.say(
      erfolg && bonusPunkte > 0
        ? `Gut gemacht! +${bonusPunkte} Punkte für deine Vorbereitung`
        : 'Weiter geht’s – der nächste Notfall kommt bestimmt.',
    );
    if (this.rtw && this.rtw.target === target) this.rtw.target = null;
  }
  private lastHelfenId = 0;
  setLastHelfen(id: number) {
    this.lastHelfenId = id;
  }

  // ---------------------------------------------------------------- Notfälle
  private spawnEmergency() {
    if (this.emergencies.length >= 2) return;
    const pts: Spawn[] = this.world.spawnPoints.filter(
      (p) => Math.hypot(p.x - this.pos.x, p.z - this.pos.z) > 35 && Math.hypot(p.x - this.pos.x, p.z - this.pos.z) < 110,
    );
    if (!pts.length) return;
    const p = pts[Math.floor(this.rnd() * pts.length)];
    const art: 'kollaps' | 'unfall' = this.rnd() > 0.5 ? 'kollaps' : 'unfall';
    const g = new THREE.Group();
    g.position.set(p.x, 0.15, p.z);
    g.rotation.y = p.ry;
    const smoke: THREE.Sprite[] = [];
    if (art === 'kollaps') {
      const v = personModel('#ef9a9a', '#e8b896', true);
      v.position.set(0, 0.5, 0);
      g.add(v);
      for (const dx of [-1.6, 1.8]) {
        const b = personModel(dx < 0 ? '#90caf9' : '#a5d6a7');
        b.position.set(dx, 0, 0.6);
        g.add(b);
      }
    } else {
      const car = carModel('#e57373');
      car.rotation.y = 0.5;
      car.position.set(0, 0, 0);
      g.add(car);
      const car2 = carModel('#90a4ae');
      car2.rotation.y = -1.2;
      car2.position.set(3.4, 0, 1.2);
      g.add(car2);
      const v = personModel('#ffcc80');
      v.position.set(-2.6, 0, 1.4);
      v.scale.set(1, 0.7, 1);
      g.add(v);
      const tex = spriteTexture((c, s) => {
        const gr = c.createRadialGradient(s / 2, s / 2, 4, s / 2, s / 2, s / 2);
        gr.addColorStop(0, 'rgba(230,230,230,0.9)');
        gr.addColorStop(1, 'rgba(230,230,230,0)');
        c.fillStyle = gr;
        c.fillRect(0, 0, s, s);
      });
      for (let i = 0; i < 5; i++) {
        const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, opacity: 0.6, depthWrite: false }));
        sp.scale.set(2, 2, 1);
        sp.position.set(0.5, 1.4 + i * 0.9, 1.5);
        g.add(sp);
        smoke.push(sp);
      }
    }
    const beacon = new THREE.Mesh(
      new THREE.CylinderGeometry(0.6, 0.6, 70, 14, 1, true),
      new THREE.MeshBasicMaterial({
        color: '#ff3b3b',
        transparent: true,
        opacity: 0.32,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
        fog: false,
      }),
    );
    beacon.position.set(0, 35, 0);
    g.add(beacon);
    const label = labelSprite('!', '#e0393e');
    label.position.set(0, 4.8, 0);
    g.add(label);
    this.scene.add(g);
    const em: Emergency = {
      id: this.nextId++,
      art,
      pos: new THREE.Vector3(p.x, 0, p.z),
      group: g,
      beacon,
      label,
      vorbereitet: new Set(),
      rtw: 'keiner',
      abgesichert: false,
      smoke,
    };
    this.emergencies.push(em);
    this.say(
      this.o.rolle === 'helfer' ? '🚨 Notfall in der Nähe! Folge dem roten Licht.' : '🚨 Einsatzmeldung! Fahre zum roten Licht.',
    );
  }
  private removeEmergency(em: Emergency) {
    this.scene.remove(em.group);
    this.emergencies = this.emergencies.filter((e) => e !== em);
  }

  // ---------------------------------------------------------------- Rettungswagen
  private route(from: THREE.Vector3, to: THREE.Vector3): THREE.Vector3[] {
    const snap = (p: THREE.Vector3) => {
      let best = { d: 1e9, x: p.x, z: p.z };
      for (const r of ROADS) {
        const dz = Math.abs(p.z - r);
        if (dz < best.d) best = { d: dz, x: p.x, z: r + (p.z > r ? 2.5 : -2.5) };
        const dx = Math.abs(p.x - r);
        if (dx < best.d) best = { d: dx, x: r + (p.x > r ? -2.5 : 2.5), z: p.z };
      }
      return new THREE.Vector3(best.x, 0.2, best.z);
    };
    const a = snap(from);
    const b = snap(to);
    const nearest = (v: number) => ROADS.reduce((m, r) => (Math.abs(r - v) < Math.abs(m - v) ? r : m), ROADS[0]);
    const ax = nearest(a.x);
    const az = nearest(a.z);
    const bx = nearest(b.x);
    const bz = nearest(b.z);
    const pts = [
      from.clone().setY(0.2),
      a,
      new THREE.Vector3(ax + (a.x > ax ? 2.5 : -2.5), 0.2, az + (a.z > az ? 2.5 : -2.5)),
      new THREE.Vector3(bx + (b.x > bx ? 2.5 : -2.5), 0.2, bz + (b.z > bz ? 2.5 : -2.5)),
      b,
      to.clone().setY(0.2),
    ];
    return pts;
  }
  private startRtw(em: Emergency) {
    em.rtw = 'unterwegs';
    const g = carModel('#ffffff', { rtw: true });
    const start = new THREE.Vector3(this.world.fahrzeugPos.x, 0.2, this.world.fahrzeugPos.z);
    g.position.copy(start);
    const l1 = new THREE.PointLight('#2f6fed', 6, 22);
    const l2 = new THREE.PointLight('#e0393e', 6, 22);
    l1.position.set(-0.7, 3, 1.5);
    l2.position.set(0.7, 3, 1.5);
    g.add(l1, l2);
    const bar = box(
      1.6,
      0.18,
      0.5,
      new THREE.MeshStandardMaterial({ color: '#2f6fed', emissive: '#2f6fed', emissiveIntensity: 1.4 }),
      0,
      2.95,
      1.6,
      false,
    );
    g.add(bar);
    this.scene.add(g);
    this.rtw = {
      g,
      path: this.route(start, em.pos.clone().add(new THREE.Vector3(3.5, 0, 4))),
      idx: 1,
      target: em,
      lights: [l1, l2],
      phase: 0,
    };
    this.startSiren();
  }
  private updateRtw(dt: number, t: number) {
    const r = this.rtw;
    if (!r) return;
    r.phase += dt;
    const on = Math.floor(r.phase * 5) % 2 === 0;
    r.lights[0].intensity = r.target && r.idx < r.path.length ? (on ? 9 : 0) : 0;
    r.lights[1].intensity = r.target && r.idx < r.path.length ? (on ? 0 : 9) : 0;
    if (!r.target) {
      // Rückfahrt
      r.g.position.x -= 0;
      this.scene.remove(r.g);
      this.rtw = null;
      this.stopSiren();
      return;
    }
    if (r.idx >= r.path.length) {
      // angekommen
      if (r.target.rtw !== 'da') {
        r.target.rtw = 'da';
        this.say('🚑 Der Rettungswagen ist da!');
        this.stopSiren();
        for (const dx of [2.4, 3.4]) {
          const pm = personModel('#e0393e');
          pm.position.set(r.g.position.x + dx, 0, r.g.position.z - 1.5);
          this.scene.add(pm);
          this.placed.push(pm);
        }
      }
      return;
    }
    const tgt = r.path[r.idx];
    const d = tgt.clone().sub(r.g.position);
    d.y = 0;
    const len = d.length();
    const step = 13 * dt;
    if (len < step + 0.2) {
      r.idx++;
    } else {
      d.normalize();
      r.g.position.addScaledVector(d, step);
      const ang = Math.atan2(d.x, d.z);
      let da = ang - r.g.rotation.y;
      da = Math.atan2(Math.sin(da), Math.cos(da));
      r.g.rotation.y += da * Math.min(1, dt * 5);
    }
    void t;
    this.sirenVolume(Math.hypot(r.g.position.x - this.pos.x, r.g.position.z - this.pos.z));
  }

  // ---------------------------------------------------------------- Ton
  private startAudio() {
    if (this.siren || typeof AudioContext === 'undefined') return;
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.value = 770;
      gain.gain.value = 0;
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      this.siren = { ctx, osc, gain };
    } catch {
      this.siren = null;
    }
  }
  private sirenOn = false;
  private startSiren() {
    this.startAudio();
    this.sirenOn = true;
  }
  private stopSiren() {
    this.sirenOn = false;
    if (this.siren) this.siren.gain.gain.value = 0;
  }
  private sirenVolume(dist: number) {
    if (!this.siren || !this.sirenOn) return;
    const high = Math.floor(performance.now() / 650) % 2 === 0;
    this.siren.osc.frequency.value = high ? 960 : 770;
    this.siren.gain.gain.value = clamp(1 - dist / 90, 0, 1) * 0.035;
  }

  // ---------------------------------------------------------------- Hauptschleife
  private loop = (now: number) => {
    if (this.disposed || this.paused) return;
    this.raf = requestAnimationFrame(this.loop);
    const dt = Math.min(0.05, (now - this.last) / 1000);
    this.last = now;
    this.update(dt, now / 1000);
    this.renderer.render(this.scene, this.camera);
    this.drawOverlay();
  };

  private update(dt: number, t: number) {
    // Zeit
    this.time = (this.time + dt / 420) % 1;
    const sunA = (this.time - 0.25) * TAU;
    const elev = Math.sin(sunA);
    const nacht = clamp(0.5 - elev * 1.6, 0, 1);
    const sky = skyAt(this.time);
    this.scene.background = sky;
    (this.scene.fog as THREE.Fog).color.copy(sky);
    this.hemi.intensity = lerp(0.18, 0.95, 1 - nacht);
    this.sun.intensity = lerp(0, 2.3, clamp(elev * 2.5, 0, 1));
    this.sun.color.set(elev < 0.25 ? '#ffb48a' : '#fff1d6');
    const sd = new THREE.Vector3(Math.cos(sunA) * 120, Math.sin(sunA) * 140, 40);
    this.sun.position.set(this.pos.x + sd.x, Math.max(10, sd.y), this.pos.z + sd.z);
    this.sun.target.position.set(this.pos.x, 0, this.pos.z);
    this.sunMesh.position.set(this.pos.x + sd.x * 2, sd.y * 2, this.pos.z + sd.z * 2);
    this.moonMesh.position.set(this.pos.x - sd.x * 2, -sd.y * 2, this.pos.z - sd.z * 2);
    this.stars.position.copy(this.pos);
    (this.stars.material as THREE.PointsMaterial).opacity = clamp((nacht - 0.45) * 2, 0, 1);
    this.world.setNacht(nacht);
    (this.nachtWert as { v: number }).v = nacht;

    // Bewegung
    this.look3(dt);
    let fx = 0;
    let fz = 0;
    if (this.keys.has('w') || this.keys.has('arrowup')) fz -= 1;
    if (this.keys.has('s') || this.keys.has('arrowdown')) fz += 1;
    if (this.keys.has('a')) fx -= 1;
    if (this.keys.has('d')) fx += 1;
    if (this.keys.has('arrowleft')) this.yaw += 1.8 * dt;
    if (this.keys.has('arrowright')) this.yaw -= 1.8 * dt;
    if (this.stick.id >= 0) {
      fx += this.stick.x;
      fz += this.stick.y;
    }
    const mag = Math.min(1, Math.hypot(fx, fz));
    const moving = mag > 0.05;
    if (moving) {
      const speed = (this.sprint || this.keys.has('shift') ? 7.2 : 4.4) * mag;
      const nx = fx / (Math.hypot(fx, fz) || 1);
      const nz = fz / (Math.hypot(fx, fz) || 1);
      const sin = Math.sin(this.yaw);
      const cos = Math.cos(this.yaw);
      const dx = (nx * cos + nz * sin) * speed * dt;
      const dz = (-nx * sin + nz * cos) * speed * dt;
      this.moveWithCollision(dx, dz);
      this.bob += dt * speed * 1.7;
    }
    this.pos.x = clamp(this.pos.x, -EXTENT, EXTENT);
    this.pos.z = clamp(this.pos.z, -EXTENT, EXTENT);
    const by = moving ? Math.sin(this.bob) * 0.045 : 0;
    this.camera.position.set(this.pos.x, 1.7 + by, this.pos.z);
    this.camera.rotation.order = 'YXZ';
    this.camera.rotation.set(this.pitch, this.yaw, 0);
    this.held.position.set(
      0.34 + Math.sin(this.bob * 0.5) * 0.008,
      -0.3 + (moving ? Math.abs(Math.sin(this.bob)) * 0.012 : Math.sin(t * 1.6) * 0.003),
      -0.62,
    );

    // Fußgänger
    for (const w of this.walkers) {
      const d = w.target.clone().sub(w.g.position);
      d.y = 0;
      if (d.length() < 0.6) {
        w.target = this.randomPavement();
        continue;
      }
      d.normalize();
      w.g.position.addScaledVector(d, w.speed * dt);
      w.g.rotation.y = Math.atan2(d.x, d.z);
      w.phase += dt * w.speed * 5;
      const l = w.g.getObjectByName('legL');
      const r = w.g.getObjectByName('legR');
      if (l && r) {
        l.rotation.x = Math.sin(w.phase) * 0.5;
        r.rotation.x = -Math.sin(w.phase) * 0.5;
      }
    }
    // Verkehr
    for (const c of this.traffic) {
      const toP =
        c.axis === 'x'
          ? new THREE.Vector2(this.pos.x - c.cur, this.pos.z - c.lane)
          : new THREE.Vector2(this.pos.z - c.cur, this.pos.x - c.lane);
      const ahead = toP.x * c.dir;
      const brake = ahead > 0 && ahead < 9 && Math.abs(toP.y) < 2.6;
      const sp = brake ? 0 : c.speed;
      c.cur += c.dir * sp * dt;
      if (c.cur > EXTENT + 6) c.cur = -EXTENT - 6;
      if (c.cur < -EXTENT - 6) c.cur = EXTENT + 6;
      if (c.axis === 'x') {
        c.g.position.set(c.cur, 0.05, c.lane);
        c.g.rotation.y = c.dir > 0 ? Math.PI / 2 : -Math.PI / 2;
      } else {
        c.g.position.set(c.lane, 0.05, c.cur);
        c.g.rotation.y = c.dir > 0 ? 0 : Math.PI;
      }
    }

    // Notfälle
    this.spawnTimer -= dt;
    if (this.spawnTimer <= 0 && this.emergencies.length < 1) {
      this.spawnEmergency();
      this.spawnTimer = 40;
    }
    for (const e of this.emergencies) {
      const pulse = 0.25 + 0.18 * Math.sin(t * 4);
      const dd = Math.hypot(e.pos.x - this.pos.x, e.pos.z - this.pos.z);
      (e.beacon.material as THREE.MeshBasicMaterial).opacity = pulse * clamp((dd - 2) / 6, 0, 1);
      e.label.position.y = 4.8 + Math.sin(t * 2.4) * 0.25;
      e.smoke.forEach((s, i) => {
        const k = (t * 0.5 + i * 0.2) % 1;
        s.position.y = 1.4 + k * 4.5;
        (s.material as THREE.SpriteMaterial).opacity = 0.6 * (1 - k);
        s.scale.setScalar(1.6 + k * 2.6);
      });
    }
    this.updateRtw(dt, t);
    const nr = this.nearest(40);
    if (nr && !this.aufgaben[1].erledigt) this.done(1);

    if (this.meldungT > 0) {
      this.meldungT -= dt;
      if (this.meldungT <= 0) this.meldung = '';
    }
    this.hudT -= dt;
    if (this.hudT <= 0) {
      this.hudT = 0.12;
      this.pushHud();
    }
  }
  private nachtWert = { v: 0 };

  private look3(dt: number) {
    void dt;
    this.yaw -= this.lookDelta.x * 0.0024;
    this.pitch = clamp(this.pitch - this.lookDelta.y * 0.0024, -1.3, 1.3);
    this.lookDelta.x = 0;
    this.lookDelta.y = 0;
  }

  private moveWithCollision(dx: number, dz: number) {
    const R = 0.42;
    const hit = (x: number, z: number) =>
      this.world.colliders.some((c: Collider) => x > c.minX - R && x < c.maxX + R && z > c.minZ - R && z < c.maxZ + R);
    if (!hit(this.pos.x + dx, this.pos.z)) this.pos.x += dx;
    if (!hit(this.pos.x, this.pos.z + dz)) this.pos.z += dz;
  }

  // ---------------------------------------------------------------- HUD + Karte
  private statusFor(it: ItemDef): string {
    if (it.kind === 'weste') return this.weste ? 'an' : 'aus';
    if (it.kind === 'licht') return this.licht ? 'an' : 'aus';
    if (it.kind === 'dreieck') return `${this.placedDreieck}/3 gestellt`;
    return '';
  }
  private pushHud() {
    const total = Math.floor(this.time * 24 * 60);
    const hh = Math.floor(total / 60);
    const mm = total % 60;
    const n = this.nearest(4.2);
    const far = this.nearest();
    let ziel: HudState['ziel'] = null;
    if (far) {
      const ang = Math.atan2(far.em.pos.x - this.pos.x, far.em.pos.z - this.pos.z);
      ziel = {
        winkel: Math.atan2(Math.sin(Math.PI - ang - this.yaw), Math.cos(Math.PI - ang - this.yaw)),
        dist: far.d,
        art: far.em.art,
      };
    }
    this.o.onHud({
      zeit: `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`,
      nacht: this.nachtWert.v,
      nah: n
        ? { dist: n.d, vorbereitet: [...n.em.vorbereitet], rtw: n.em.rtw, abgesichert: n.em.abgesichert, art: n.em.art }
        : null,
      ziel,
      slots: this.o.items.map((it, i) => ({
        id: it.id,
        icon: it.icon,
        name: it.name,
        text: it.text,
        stufe: it.stufe,
        active: i === this.active,
        status: this.statusFor(it),
      })),
      aktiv: this.active,
      weste: this.weste,
      licht: this.licht,
      meldung: this.meldung,
      aufgaben: this.aufgaben.map((a) => ({ ...a })),
      geholfen: this.geholfen,
      gesperrt: false,
      touch: this.touchMode,
    });
    if (n) this.lastHelfenId = n.em.id;
  }

  private drawOverlay() {
    const g = this.oc;
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    g.clearRect(0, 0, w, h);
    // Joystick
    if (this.touchMode) {
      const sx = this.stick.id >= 0 ? this.stick.cx : 90;
      const sy = this.stick.id >= 0 ? this.stick.cy : h - 130;
      g.globalAlpha = this.stick.id >= 0 ? 0.9 : 0.35;
      g.fillStyle = 'rgba(255,255,255,0.18)';
      g.strokeStyle = 'rgba(255,255,255,0.7)';
      g.lineWidth = 2;
      g.beginPath();
      g.arc(sx, sy, 56, 0, TAU);
      g.fill();
      g.stroke();
      g.fillStyle = 'rgba(255,255,255,0.85)';
      g.beginPath();
      g.arc(sx + this.stick.x * 40, sy + this.stick.y * 40, 24, 0, TAU);
      g.fill();
      g.globalAlpha = 1;
    }
    // Karte
    const S = this.o.mobile ? 104 : 140;
    const cx = w - S / 2 - 14;
    const cy = S / 2 + 56;
    const sc = S / 2 / 70;
    g.save();
    g.beginPath();
    g.arc(cx, cy, S / 2, 0, TAU);
    g.clip();
    g.fillStyle = 'rgba(12,28,32,0.72)';
    g.fillRect(cx - S / 2, cy - S / 2, S, S);
    const tx = (x: number) => cx + (x - this.pos.x) * sc;
    const tz = (z: number) => cy + (z - this.pos.z) * sc;
    // gedreht in Blickrichtung (oben = vorne)
    g.translate(cx, cy);
    g.rotate(this.yaw - Math.PI);
    g.translate(-cx, -cy);
    g.fillStyle = 'rgba(160,190,184,0.35)';
    this.world.blocks.forEach((b: Block) => g.fillRect(tx(b.minX), tz(b.minZ), (b.maxX - b.minX) * sc, (b.maxZ - b.minZ) * sc));
    g.fillStyle = '#2dd4bf';
    g.fillRect(tx(this.world.start.x) - 3, tz(this.world.start.z) - 3, 6, 6);
    for (const e of this.emergencies) {
      g.fillStyle = '#ff4d4d';
      g.beginPath();
      g.arc(tx(e.pos.x), tz(e.pos.z), 4 + 2 * Math.sin(performance.now() / 200), 0, TAU);
      g.fill();
    }
    if (this.rtw) {
      g.fillStyle = '#6fa8ff';
      g.beginPath();
      g.arc(tx(this.rtw.g.position.x), tz(this.rtw.g.position.z), 3.5, 0, TAU);
      g.fill();
    }
    g.restore();
    g.strokeStyle = 'rgba(255,255,255,0.8)';
    g.lineWidth = 2;
    g.beginPath();
    g.arc(cx, cy, S / 2, 0, TAU);
    g.stroke();
    g.fillStyle = '#fff';
    g.beginPath();
    g.moveTo(cx, cy - 6);
    g.lineTo(cx + 4.5, cy + 5);
    g.lineTo(cx - 4.5, cy + 5);
    g.fill();
  }

  /** Einmal rendern (Tests) */
  renderOnce() {
    this.update(0.016, performance.now() / 1000);
    this.renderer.render(this.scene, this.camera);
    this.drawOverlay();
  }
  teleport(x: number, z: number, yaw: number) {
    this.pos.set(x, 1.7, z);
    this.yaw = yaw;
    this.pitch = 0;
  }
  forceEmergency() {
    this.spawnTimer = 0;
  }
  debug() {
    return {
      pos: this.pos.clone(),
      emergencies: this.emergencies.map((e) => ({ id: e.id, x: e.pos.x, z: e.pos.z })),
      time: this.time,
    };
  }
  setTime(t: number) {
    this.time = t;
  }

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('resize', this.onResize);
    document.removeEventListener('pointerlockchange', this.onLockChange);
    this.stopSiren();
    this.siren?.ctx.close?.();
    this.renderer?.dispose();
    this.container?.replaceChildren();
  }
}

void BLOCKS;
