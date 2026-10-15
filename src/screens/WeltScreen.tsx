import { useEffect, useMemo, useRef, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { EquipmentId, levelOf } from '../game/equipment';
import { Rolle } from '../game/rolle';
import { Progress } from '../game/storage';
import { fonts } from '../theme';
import { weltBus } from '../world/bus';
import { HelfenInfo, HudState, WorldEngine } from '../world/engine';
import { itemsFuer } from '../world/items';

interface Props {
  rolle: Rolle;
  progress: Progress;
  visible: boolean;
  onExit: () => void;
  onHelfen: (info: HelfenInfo) => void;
}

const INK = 'rgba(8,24,27,0.72)';
const LINE = 'rgba(255,255,255,0.22)';
const TEAL = '#2dd4bf';

/** Anleitung nur einmal pro Sitzung zeigen (auch wenn die Welt nach einem Ausrüstungs-Upgrade neu aufgebaut wird) */
let introGezeigt = false;

function webglOk(): boolean {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

/** Runder Pfeil-Knopf: hält man ihn gedrückt, wirkt er (zum Laufen und Umsehen auf dem Handy) */
function PadKnopf({ pfeil, onAn, onAus, style }: { pfeil: string; onAn: () => void; onAus: () => void; style?: object }) {
  return (
    <Pressable
      onPressIn={onAn}
      onPressOut={onAus}
      delayLongPress={0}
      style={({ pressed }) => [S.pad, pressed && S.padOn, style]}
      accessibilityLabel={`Pfeil ${pfeil}`}
    >
      <Text style={S.padT}>{pfeil}</Text>
    </Pressable>
  );
}

/** 3D-Welt in Ego-Perspektive – läuft im Browser (Web/PWA). Auf dem Handy: links Joystick, rechts umsehen. */
export function WeltScreen({ rolle, progress, visible, onExit, onHelfen }: Props) {
  const host = useRef<View>(null);
  const engine = useRef<WorldEngine | null>(null);
  const [hud, setHud] = useState<HudState | null>(null);
  const [inv, setInv] = useState(false);
  const [intro, setIntro] = useState(!introGezeigt);
  const [fehler, setFehler] = useState<string | null>(null);
  const helfenRef = useRef(onHelfen);
  helfenRef.current = onHelfen;

  const items = useMemo(
    () => itemsFuer(rolle === 'sani' ? 'sani' : 'helfer', (id: EquipmentId) => levelOf(progress, id)),
    [rolle, progress],
  );
  const lichtStufe = levelOf(progress, 'licht') - 1;
  const mobile =
    Platform.OS === 'web' && typeof window !== 'undefined' && (window.matchMedia?.('(pointer: coarse)').matches ?? false);

  // Welt einmal aufbauen und im Hintergrund behalten
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    if (!webglOk()) {
      setFehler('Dein Gerät oder Browser unterstützt keine 3D-Grafik (WebGL).');
      return;
    }
    const el = host.current as unknown as HTMLElement | null;
    if (!el) return;
    const e = new WorldEngine({
      rolle: rolle === 'sani' ? 'sani' : 'helfer',
      items,
      mobile,
      lichtStufe,
      onHud: setHud,
      onHelfen: (i) => helfenRef.current(i),
    });
    try {
      e.mount(el);
    } catch (err) {
      setFehler('Die 3D-Welt konnte nicht gestartet werden.');
      return;
    }
    engine.current = e;
    weltBus.erledigt = (ok, bonus) => e.resolve(ok, bonus);
    (window as unknown as { __welt?: WorldEngine }).__welt = e;
    return () => {
      weltBus.erledigt = null;
      e.dispose();
      engine.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rolle]);

  useEffect(() => {
    const e = engine.current;
    if (!e) return;
    e.setPaused(!visible || intro || inv);
    if (visible) setTimeout(() => window.dispatchEvent(new Event('resize')), 30);
  }, [visible, intro, inv, fehler]);

  // Tab / I = Inventar, Esc = Pause
  useEffect(() => {
    if (Platform.OS !== 'web' || !visible) return;
    const onKey = (ev: KeyboardEvent) => {
      const k = ev.key.toLowerCase();
      if (k === 'tab' || k === 'i') {
        ev.preventDefault();
        setInv((v) => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [visible]);

  if (Platform.OS !== 'web') {
    return (
      <View style={[S.root, !visible && S.hidden, S.center]}>
        <Text style={S.big}>🌍 3D-Welt</Text>
        <Text style={S.sub}>Die 3D-Welt läuft in der Web-App im Browser. Öffne Einsatz 112 auf rettung.tankard.de.</Text>
        <Pressable style={S.btn} onPress={onExit}>
          <Text style={S.btnT}>Zurück</Text>
        </Pressable>
      </View>
    );
  }

  const e = engine.current;
  const nah = hud?.nah ?? null;
  const ziel = hud?.ziel ?? null;
  const dunkel = (hud?.nacht ?? 0) > 0.5;

  return (
    <View style={[S.root, !visible && S.hidden]} pointerEvents={visible ? 'auto' : 'none'}>
      <View ref={host} style={S.canvas} />
      {fehler && (
        <View style={[StyleSheet.absoluteFill, S.center, { backgroundColor: '#08181B' }]}>
          <Text style={S.big}>😕</Text>
          <Text style={S.sub}>{fehler}</Text>
        </View>
      )}
      <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
        {/* Oben links */}
        <View style={S.topLeft} pointerEvents="box-none">
          <View style={S.row}>
            <Pressable style={S.chip} onPress={onExit} accessibilityLabel="Zurück zum Menü">
              <Text style={S.chipT}>← Menü</Text>
            </Pressable>
            <View style={S.chip}>
              <Text style={S.chipT}>
                {dunkel ? '🌙' : '☀️'} {hud?.zeit ?? '--:--'}
              </Text>
            </View>
            <View style={S.chip}>
              <Text style={S.chipT}>🏅 {hud?.geholfen ?? 0}</Text>
            </View>
          </View>
          <View style={S.quests}>
            <Text style={S.qHead}>AUFGABEN</Text>
            {(hud?.aufgaben ?? []).map((a, i) => (
              <Text key={i} style={[S.qItem, a.erledigt && S.qDone]}>
                {a.erledigt ? '✓' : '○'} {a.text}
              </Text>
            ))}
          </View>
          {ziel && (
            <View style={S.compassM} pointerEvents="none">
              <View style={[S.arrow, { transform: [{ rotate: `${ziel.winkel}rad` }] }]}>
                <Text style={S.arrowT}>▲</Text>
              </View>
              <Text style={S.compassT}>
                🚨 {ziel.art === 'unfall' ? 'Verkehrsunfall' : 'Person kollabiert'} · {Math.round(ziel.dist)} m
              </Text>
            </View>
          )}
        </View>

        {/* Fadenkreuz */}
        <View style={S.cross} pointerEvents="none">
          <View style={S.dot} />
        </View>

        {/* Meldung */}
        {!!hud?.meldung && (
          <View style={S.toast} pointerEvents="none">
            <Text style={S.toastT}>{hud.meldung}</Text>
          </View>
        )}

        {/* Hilfe-Hinweis am Notfall */}
        {nah && (
          <View style={[S.prompt, hud?.touch && { bottom: 322 }]} pointerEvents="box-none">
            <Text style={S.promptHead}>{nah.art === 'unfall' ? '🚗 Verkehrsunfall' : '🧍 Person am Boden'}</Text>
            <Text style={S.promptSub}>
              {nah.abgesichert ? '✓ abgesichert  ' : '○ absichern  '}
              {nah.rtw === 'keiner' ? '○ 112 rufen  ' : nah.rtw === 'unterwegs' ? '✓ RTW unterwegs  ' : '✓ RTW da  '}
              {nah.vorbereitet.length > 0 ? `✓ ${nah.vorbereitet.length}× bereitgestellt` : ''}
            </Text>
            <Pressable style={S.helpBtn} onPress={() => engine.current?.interact()}>
              <Text style={S.helpBtnT}>{hud?.touch ? 'Tippen: Helfen' : 'E drücken: Helfen'}</Text>
            </Pressable>
          </View>
        )}

        {/* Pfeile zum Laufen (links) und Umsehen (rechts) */}
        {hud?.touch && (
          <>
            <View style={S.padWalk} pointerEvents="box-none">
              <PadKnopf
                pfeil="▲"
                style={{ left: 54, top: 0 }}
                onAn={() => engine.current?.setPad(0, -1)}
                onAus={() => engine.current?.setPad(0, 0)}
              />
              <PadKnopf
                pfeil="◀"
                style={{ left: 0, top: 54 }}
                onAn={() => engine.current?.setPad(-1, 0)}
                onAus={() => engine.current?.setPad(0, 0)}
              />
              <PadKnopf
                pfeil="▶"
                style={{ left: 108, top: 54 }}
                onAn={() => engine.current?.setPad(1, 0)}
                onAus={() => engine.current?.setPad(0, 0)}
              />
              <PadKnopf
                pfeil="▼"
                style={{ left: 54, top: 108 }}
                onAn={() => engine.current?.setPad(0, 1)}
                onAus={() => engine.current?.setPad(0, 0)}
              />
              <Text style={S.padLabel}>LAUFEN</Text>
            </View>
            <View style={S.padLook} pointerEvents="box-none">
              <PadKnopf
                pfeil="▲"
                style={{ left: 40, top: 0 }}
                onAn={() => engine.current?.setPadLook(0, 1)}
                onAus={() => engine.current?.setPadLook(0, 0)}
              />
              <PadKnopf
                pfeil="◀"
                style={{ left: 0, top: 40 }}
                onAn={() => engine.current?.setPadLook(-1, 0)}
                onAus={() => engine.current?.setPadLook(0, 0)}
              />
              <PadKnopf
                pfeil="▶"
                style={{ left: 80, top: 40 }}
                onAn={() => engine.current?.setPadLook(1, 0)}
                onAus={() => engine.current?.setPadLook(0, 0)}
              />
              <PadKnopf
                pfeil="▼"
                style={{ left: 40, top: 80 }}
                onAn={() => engine.current?.setPadLook(0, -1)}
                onAus={() => engine.current?.setPadLook(0, 0)}
              />
              <Text style={S.padLabel}>UMSEHEN</Text>
            </View>
          </>
        )}

        {/* Bildrate / Fehler (zur Fehlersuche) */}
        {!!hud && (
          <View style={S.diag} pointerEvents="none">
            <Text style={S.diagT}>{hud.fehler ? `⚠ ${hud.fehler}` : `${hud.fps} FPS`}</Text>
          </View>
        )}

        {/* Touch-Knöpfe */}
        {hud?.touch && (
          <View style={S.touchBtns} pointerEvents="box-none">
            <Pressable style={S.round} onPress={() => engine.current?.use()}>
              <Text style={S.roundT}>Nutzen</Text>
            </Pressable>
            <Pressable
              style={[S.round, S.roundSm]}
              onPressIn={() => engine.current?.sprintOn(true)}
              onPressOut={() => engine.current?.sprintOn(false)}
            >
              <Text style={S.roundT}>Rennen</Text>
            </Pressable>
          </View>
        )}

        {/* Hotbar */}
        <View style={S.hotbar} pointerEvents="box-none">
          {(
            hud?.slots ??
            items.map((it, i) => ({
              id: it.id,
              icon: it.icon,
              name: it.name,
              text: it.text,
              stufe: it.stufe,
              active: i === 0,
              status: '',
            }))
          ).map((s, i) => (
            <Pressable
              key={s.id}
              onPress={() => engine.current?.select(i)}
              style={[S.slot, mobile && S.slotM, s.active && S.slotOn]}
            >
              <Text style={S.slotKey}>{i + 1}</Text>
              <Text style={S.slotIcon}>{s.icon}</Text>
              {!!s.status && <Text style={S.slotSt}>{s.status}</Text>}
            </Pressable>
          ))}
          <Pressable style={[S.slot, mobile && S.slotM]} onPress={() => setInv(true)}>
            <Text style={S.slotKey}>Tab</Text>
            <Text style={S.slotIcon}>🎒</Text>
          </Pressable>
        </View>
        {hud && (
          <View style={S.hint} pointerEvents="none">
            <Text style={S.hintT}>
              {hud.slots[hud.aktiv]?.name} · {hud.touch ? 'Nutzen' : 'F = benutzen'}
            </Text>
          </View>
        )}
      </View>

      {/* Inventar */}
      {inv && (
        <View style={[StyleSheet.absoluteFill, S.modalBg]}>
          <View style={S.invCard}>
            <View style={[S.row, { justifyContent: 'space-between' }]}>
              <Text style={S.invTitle}>🎒 Inventar</Text>
              <Pressable style={S.chip} onPress={() => setInv(false)}>
                <Text style={S.chipT}>Schließen</Text>
              </Pressable>
            </View>
            <Text style={S.invSub}>
              Dein Inventar kommt aus deiner Ausrüstung. Bessere Ausrüstung aus der Garage macht auch hier mehr möglich.
            </Text>
            <View style={S.invGrid}>
              {items.map((it, i) => (
                <Pressable
                  key={it.id}
                  style={[S.invItem, hud?.aktiv === i && { borderColor: TEAL }]}
                  onPress={() => {
                    e?.select(i);
                    setInv(false);
                  }}
                >
                  <Text style={{ fontSize: 30 }}>{it.icon}</Text>
                  <Text style={S.invName}>{it.name}</Text>
                  {!!it.stufe && <Text style={S.invStufe}>{it.stufe}</Text>}
                  <Text style={S.invText}>{it.text}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      )}

      {/* Start */}
      {intro && !fehler && (
        <View style={[StyleSheet.absoluteFill, S.modalBg]}>
          <View style={S.invCard}>
            <Text style={S.invTitle}>🌍 Einsatz-Welt</Text>
            <Text style={S.invSub}>
              Gehe durch die Stadt. Wenn irgendwo ein rotes Licht aufleuchtet, ist dort ein Notfall. Ziehe die Warnweste an,
              sichere ab, rufe Hilfe und kümmere dich um die Person.
            </Text>
            <View style={{ gap: 6, marginTop: 8 }}>
              {mobile ? (
                <>
                  <Text style={S.help}>📱 Linke Bildschirmhälfte: Joystick zum Laufen</Text>
                  <Text style={S.help}>👆 Rechte Hälfte: wischen zum Umsehen</Text>
                  <Text style={S.help}>🎒 Unten wählst du einen Gegenstand, „Nutzen“ setzt ihn ein</Text>
                </>
              ) : (
                <>
                  <Text style={S.help}>⌨️ W A S D laufen · Umschalt = rennen · Maus = umsehen</Text>
                  <Text style={S.help}>1–9 Gegenstand wählen · F = benutzen · E = helfen</Text>
                  <Text style={S.help}>Tab oder I = Inventar · Esc = Maus freigeben</Text>
                </>
              )}
            </View>
            <Pressable
              style={[S.btn, { marginTop: 14 }]}
              onPress={() => {
                introGezeigt = true;
                setIntro(false);
                setTimeout(() => {
                  engine.current?.setPaused(false);
                  if (!mobile) engine.current?.requestLock();
                }, 0);
              }}
            >
              <Text style={S.btnT}>Los geht’s</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

const S = StyleSheet.create({
  root: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#08181B', zIndex: 50 },
  hidden: { display: 'none' },
  center: { alignItems: 'center', justifyContent: 'center', padding: 24, gap: 12 },
  canvas: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  big: { fontFamily: fonts.display, fontSize: 28, color: '#fff' },
  sub: { fontFamily: fonts.regular, fontSize: 15, color: '#cfe4df', textAlign: 'center', maxWidth: 420, lineHeight: 22 },
  btn: { backgroundColor: TEAL, paddingVertical: 12, paddingHorizontal: 22, borderRadius: 14, alignSelf: 'center' },
  btnT: { fontFamily: fonts.bold, fontSize: 16, color: '#08181B' },
  row: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  topLeft: { position: 'absolute', top: 12, left: 12, gap: 8, maxWidth: 300 },
  compassM: { alignItems: 'flex-start', gap: 4 },
  chip: { backgroundColor: INK, borderColor: LINE, borderWidth: 1, borderRadius: 999, paddingVertical: 7, paddingHorizontal: 12 },
  chipT: { fontFamily: fonts.bold, fontSize: 13, color: '#fff' },
  quests: { backgroundColor: INK, borderColor: LINE, borderWidth: 1, borderRadius: 14, padding: 10, gap: 3 },
  qHead: { fontFamily: fonts.mono, fontSize: 10, letterSpacing: 1.2, color: TEAL },
  qItem: { fontFamily: fonts.medium, fontSize: 12.5, color: '#fff' },
  qDone: { color: '#7fe0b8', textDecorationLine: 'line-through' },
  arrow: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: INK,
    borderColor: '#ff5a5a',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowT: { color: '#ff5a5a', fontSize: 20 },
  compassT: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: '#fff',
    backgroundColor: INK,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    overflow: 'hidden',
  },
  cross: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, alignItems: 'center', justifyContent: 'center' },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderColor: 'rgba(0,0,0,0.4)',
    borderWidth: 1,
  },
  toast: { position: 'absolute', top: '34%', left: 24, right: 24, alignItems: 'center' },
  toastT: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: '#fff',
    backgroundColor: INK,
    borderColor: LINE,
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 16,
    textAlign: 'center',
    overflow: 'hidden',
  },
  prompt: { position: 'absolute', bottom: 120, left: 0, right: 0, alignItems: 'center', gap: 6 },
  promptHead: {
    fontFamily: fonts.display,
    fontSize: 17,
    color: '#fff',
    backgroundColor: INK,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    overflow: 'hidden',
  },
  promptSub: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: '#fff',
    backgroundColor: INK,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
    overflow: 'hidden',
  },
  helpBtn: { backgroundColor: '#e0393e', borderRadius: 14, paddingVertical: 11, paddingHorizontal: 22 },
  helpBtnT: { fontFamily: fonts.bold, fontSize: 16, color: '#fff' },
  touchBtns: { position: 'absolute', right: 14, bottom: 84, flexDirection: 'row', alignItems: 'flex-end', gap: 10 },
  round: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: 'rgba(45,212,191,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#fff',
    borderWidth: 2,
  },
  roundSm: { width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(255,255,255,0.28)' },
  roundT: { fontFamily: fonts.bold, fontSize: 13, color: '#08181B' },
  padWalk: { position: 'absolute', left: 14, bottom: 86, width: 160, height: 166 },
  padLook: { position: 'absolute', right: 14, bottom: 184, width: 130, height: 126 },
  pad: {
    position: 'absolute',
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderColor: 'rgba(255,255,255,0.7)',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  padOn: { backgroundColor: 'rgba(45,212,191,0.85)' },
  padT: { color: '#fff', fontSize: 20 },
  padLabel: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 70,
    textAlign: 'center',
    fontFamily: fonts.bold,
    fontSize: 9,
    letterSpacing: 1,
    color: 'rgba(255,255,255,0.8)',
  },
  diag: { position: 'absolute', left: 14, bottom: 4 },
  diagT: { fontFamily: fonts.medium, fontSize: 10, color: 'rgba(255,255,255,0.6)' },
  hotbar: {
    position: 'absolute',
    bottom: 22,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
  },
  slot: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: INK,
    borderColor: LINE,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotM: { width: 42, height: 50, borderRadius: 11 },
  slotOn: { borderColor: TEAL, backgroundColor: 'rgba(14,70,70,0.85)' },
  slotKey: { position: 'absolute', top: 3, left: 6, fontFamily: fonts.bold, fontSize: 10, color: '#a9c9c3' },
  slotIcon: { fontSize: 26 },
  slotSt: { position: 'absolute', bottom: 2, fontFamily: fonts.bold, fontSize: 8, color: TEAL },
  hint: { position: 'absolute', bottom: 84, left: 0, right: 0, alignItems: 'center' },
  hintT: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: '#fff',
    backgroundColor: INK,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
    overflow: 'hidden',
  },
  modalBg: { backgroundColor: 'rgba(4,14,16,0.78)', alignItems: 'center', justifyContent: 'center', padding: 16 },
  invCard: {
    backgroundColor: '#0F2A2E',
    borderColor: LINE,
    borderWidth: 1,
    borderRadius: 22,
    padding: 18,
    gap: 8,
    maxWidth: 560,
    width: '100%',
  },
  invTitle: { fontFamily: fonts.display, fontSize: 22, color: '#fff' },
  invSub: { fontFamily: fonts.regular, fontSize: 13.5, color: '#cfe4df', lineHeight: 20 },
  invGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 4 },
  invItem: {
    flexGrow: 1,
    flexBasis: 150,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderColor: LINE,
    borderWidth: 2,
    borderRadius: 16,
    padding: 10,
    gap: 2,
  },
  invName: { fontFamily: fonts.bold, fontSize: 14, color: '#fff' },
  invStufe: { fontFamily: fonts.semibold, fontSize: 11, color: TEAL },
  invText: { fontFamily: fonts.regular, fontSize: 12, color: '#b9d3cd', lineHeight: 17 },
  help: { fontFamily: fonts.medium, fontSize: 13.5, color: '#fff' },
});
