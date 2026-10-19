import { useRef, useState } from 'react';
import { PanResponder, ScrollView, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, G, Line, Path, Rect } from 'react-native-svg';
import { zaehle } from '../analytics';
import { Ziehbar } from '../components/Ziehbar';
import { Button, Card, Tap, TopBar } from '../components/UI';
import { useRolle } from '../game/rolle';
import { useLayout } from '../layout';
import { colors, fonts, spacing, type } from '../theme';

const HAUT = '#F0C7A5';
const HAUT_DUNKEL = '#DDA983';

/** Handgriff-Labor: Druckverband und stabile Seitenlage zum Selbermachen (Ziehen und Tippen) */
export function LaborScreen({
  geloest,
  onFinish,
  onBack,
}: {
  geloest: string[];
  onFinish: (punkte: number, id: string) => void;
  onBack: () => void;
}) {
  const L = useLayout();
  const r = useRolle();
  const [uebung, setUebung] = useState<'druck' | 'lage' | null>(null);
  const [fertigPunkte, setFertigPunkte] = useState<number | null>(null);
  const [zieht, setZieht] = useState(false);

  const fertig = (id: 'druckverband' | 'seitenlage') => {
    const punkte = geloest.includes(id) ? 10 : 40;
    onFinish(punkte, id);
    zaehle('labor-' + id);
    setFertigPunkte(punkte);
  };

  if (!uebung) {
    return (
      <View style={{ flex: 1 }}>
        <TopBar kicker={r.titel} title="Handgriff-Labor" onBack={onBack} />
        <ScrollView contentContainerStyle={[styles.content, L.wide && styles.wide]}>
          <Text style={type.body}>
            Übe Handgriffe wirklich mit den Fingern: ziehen, wickeln, tippen – Schritt für Schritt in der richtigen Reihenfolge.
          </Text>
          {[
            {
              id: 'druck' as const,
              icon: '🩹',
              titel: 'Druckverband anlegen',
              sub: 'Wundauflage, Polster, Binde wickeln, Durchblutung prüfen',
              ok: geloest.includes('druckverband'),
            },
            {
              id: 'lage' as const,
              icon: '🛌',
              titel: 'Stabile Seitenlage',
              sub: 'Arm, Arm, Bein, Drehen, Kopf überstrecken',
              ok: geloest.includes('seitenlage'),
            },
          ].map((u) => (
            <Tap
              key={u.id}
              onPress={() => setUebung(u.id)}
              accessibilityLabel={u.titel}
              style={[styles.zeile, u.ok && { backgroundColor: r.akzentTint, borderColor: r.akzent }]}
            >
              <Text style={styles.zeichen}>{u.icon}</Text>
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={[type.headline, { fontSize: 15 }]}>{u.titel}</Text>
                <Text style={type.small}>{u.sub}</Text>
              </View>
              <Text style={[styles.zeichen, { fontSize: 18 }]}>{u.ok ? '✓' : '›'}</Text>
            </Tap>
          ))}
        </ScrollView>
      </View>
    );
  }

  const zurueck = () => {
    setUebung(null);
    setFertigPunkte(null);
  };
  return (
    <View style={{ flex: 1 }}>
      <TopBar
        kicker="Handgriff-Labor"
        title={uebung === 'druck' ? 'Druckverband anlegen' : 'Stabile Seitenlage'}
        onBack={zurueck}
      />
      <ScrollView scrollEnabled={!zieht} contentContainerStyle={[styles.content, L.wide && styles.wide]}>
        {uebung === 'druck' ? (
          <Druckverband onZiehen={setZieht} onFertig={() => fertig('druckverband')} fertigPunkte={fertigPunkte} />
        ) : (
          <Seitenlage onFertig={() => fertig('seitenlage')} fertigPunkte={fertigPunkte} />
        )}
        <Button label="Zurück zur Auswahl" variant="outline" onPress={zurueck} />
      </ScrollView>
    </View>
  );
}

// ---------------------------------------------------------------- Druckverband
const BW = 320;
const BH = 230;

function Druckverband({
  onZiehen,
  onFertig,
  fertigPunkte,
}: {
  onZiehen: (z: boolean) => void;
  onFertig: () => void;
  fertigPunkte: number | null;
}) {
  const r = useRolle();
  const [schritt, setSchritt] = useState(0); // 0 Handschuhe, 1 Auflage, 2 Polster, 3 wickeln, 4 prüfen, 5 fertig
  const [wickel, setWickel] = useState(0);
  const [hinweis, setHinweis] = useState('');
  const wickelRef = useRef({ dx: 0, richtung: 0, zaehler: 0 });
  const schrittRef = useRef(0);
  schrittRef.current = schritt;
  const WUNDE = { x: 160, y: 118 };

  const nah = (cx: number, cy: number) => Math.hypot(cx - WUNDE.x, cy - WUNDE.y) < 34;
  const weiter = (n: number) => {
    setSchritt(n);
    setHinweis('');
    if (n === 5) onFertig();
  };

  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => schrittRef.current === 3,
      onMoveShouldSetPanResponder: () => schrittRef.current === 3,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: () => {
        wickelRef.current = { dx: 0, richtung: 0, zaehler: wickelRef.current.zaehler };
        onZiehen(true);
      },
      onPanResponderMove: (_, g) => {
        const w = wickelRef.current;
        const rich = g.dx > w.dx + 6 ? 1 : g.dx < w.dx - 6 ? -1 : w.richtung;
        if (rich !== 0 && rich !== w.richtung && w.richtung !== 0) {
          w.zaehler += 1;
          setWickel(w.zaehler);
          if (w.zaehler >= 4) setTimeout(() => weiter(4), 150);
        }
        if (rich !== 0) w.richtung = rich;
        w.dx = g.dx;
      },
      onPanResponderRelease: () => onZiehen(false),
      onPanResponderTerminate: () => onZiehen(false),
    }),
  ).current;

  const anweisung = [
    'Zieh dir Einmalhandschuhe an: Tippe auf die Handschuhe.',
    'Lege die Wundauflage auf die Wunde: Ziehe sie auf die rote Stelle.',
    'Setze das Druckpolster auf die Wundauflage: Ziehe es auf die Wunde.',
    'Wickle die Binde fest um den Arm: Wische vier Mal quer über den Arm hin und her.',
    'Kontrolliere die Durchblutung: Tippe auf die Finger. Sind sie warm, rosig und beweglich?',
    'Geschafft! Ein Druckverband sitzt fest, aber stoppt das Blut nicht ab.',
  ][schritt];

  return (
    <>
      <Card style={{ gap: spacing.xs }}>
        <Text style={type.eyebrow}>Schritt {Math.min(schritt + 1, 5)} von 5</Text>
        <Text style={type.headline}>{anweisung}</Text>
        {!!hinweis && <Text style={[type.small, { color: colors.red }]}>{hinweis}</Text>}
      </Card>
      <View style={styles.flaeche}>
        <View style={{ width: BW, height: BH }}>
          <Svg width={BW} height={BH} viewBox={`0 0 ${BW} ${BH}`}>
            <Rect x={0} y={0} width={BW} height={BH} rx={18} fill="#EAF3F0" />
            <Rect x={40} y={86} width={214} height={64} rx={30} fill={HAUT} stroke={HAUT_DUNKEL} strokeWidth={3} />
            <Rect x={250} y={92} width={56} height={52} rx={16} fill={HAUT} stroke={HAUT_DUNKEL} strokeWidth={3} />
            {[0, 1, 2, 3].map((k) => (
              <Line
                key={k}
                x1={288}
                y1={100 + k * 13}
                x2={314}
                y2={100 + k * 13}
                stroke={HAUT_DUNKEL}
                strokeWidth={9}
                strokeLinecap="round"
              />
            ))}
            <Path d="M142 108 q18 -16 36 0 q10 14 -4 24 q-20 8 -32 -6 q-6 -10 0 -18 z" fill="#C62828" />
            {schritt >= 2 && (
              <Rect x={138} y={102} width={44} height={34} rx={4} fill="#FFFFFF" stroke="#CFD8D4" strokeWidth={2} />
            )}
            {schritt >= 3 && (
              <Rect x={146} y={106} width={28} height={26} rx={13} fill="#6FA8FF" stroke="#3E6FCF" strokeWidth={2} />
            )}
            {Array.from({ length: Math.min(wickel, 4) }).map((_, k) => (
              <Rect
                key={k}
                x={126 + k * 12}
                y={84}
                width={13}
                height={68}
                fill="#F7F7F2"
                stroke="#D3D8D5"
                strokeWidth={1.5}
                transform={`rotate(-6 ${132 + k * 12} 118)`}
              />
            ))}
            {schritt >= 5 && <Circle cx={160} cy={118} r={0} />}
          </Svg>
          {/* Wisch-Fläche zum Wickeln */}
          <View
            {...pan.panHandlers}
            style={[styles.wickelFlaeche, schritt === 3 && { borderColor: r.akzent, borderWidth: 2.5 }]}
            pointerEvents={schritt === 3 ? 'auto' : 'none'}
          />
          {/* Finger zum Prüfen */}
          {schritt === 4 && (
            <Tap
              offset={0}
              onPress={() => weiter(5)}
              accessibilityLabel="Finger prüfen"
              style={[styles.finger, { borderColor: r.akzent }]}
            >
              <Text style={styles.fingerText}>👆</Text>
            </Tap>
          )}
          {/* Ablage */}
          <View style={styles.ablage}>
            {schritt === 0 && (
              <Tap
                onPress={() => weiter(1)}
                accessibilityLabel="Handschuhe anziehen"
                style={[styles.gegenstand, { borderColor: r.akzent }]}
              >
                <Text style={styles.gegenstandIcon}>🧤</Text>
                <Text style={styles.gegenstandText}>Handschuhe</Text>
              </Tap>
            )}
          </View>
          {schritt === 1 && (
            <Ziehbar
              x={40}
              y={168}
              w={64}
              h={46}
              aktiv
              onZiehen={onZiehen}
              onDrop={(cx, cy) => {
                if (nah(cx, cy)) {
                  weiter(2);
                  return true;
                }
                setHinweis('Die Wundauflage gehört direkt auf die Wunde.');
                return false;
              }}
            >
              <View style={styles.auflage}>
                <Text style={styles.gegenstandText}>Auflage</Text>
              </View>
            </Ziehbar>
          )}
          {schritt === 2 && (
            <Ziehbar
              x={128}
              y={168}
              w={64}
              h={46}
              aktiv
              onZiehen={onZiehen}
              onDrop={(cx, cy) => {
                if (nah(cx, cy)) {
                  weiter(3);
                  return true;
                }
                setHinweis('Das Polster kommt auf die Wundauflage, genau auf die Wunde.');
                return false;
              }}
            >
              <View style={styles.polster}>
                <Text style={[styles.gegenstandText, { color: '#fff' }]}>Polster</Text>
              </View>
            </Ziehbar>
          )}
        </View>
      </View>
      {fertigPunkte !== null && (
        <Card style={{ alignItems: 'center', gap: spacing.xs }}>
          <Text style={styles.emoji}>🏅</Text>
          <Text style={[type.headline, { color: r.akzentDunkel }]}>+{fertigPunkte} Punkte</Text>
          <Text style={type.small}>Wirklich bluten? Druck auf die Wunde, Druckverband – und bei starker Blutung immer 112.</Text>
        </Card>
      )}
    </>
  );
}

// ---------------------------------------------------------------- Seitenlage
const SCHRITTE = [
  {
    text: 'Knie dich neben die Person und lege ihre Brille ab.',
    ziel: 'knie',
    info: 'Tippe auf die Stelle neben dem Oberkörper.',
  },
  {
    text: 'Lege den nahen Arm angewinkelt nach oben, Handfläche nach oben.',
    ziel: 'armNah',
    info: 'Tippe auf den nahen Arm (unten).',
  },
  {
    text: 'Lege den fernen Arm über die Brust, Handrücken an die nahe Wange.',
    ziel: 'armFern',
    info: 'Tippe auf den fernen Arm (oben).',
  },
  { text: 'Beuge das ferne Bein und ziehe es zu dir.', ziel: 'bein', info: 'Tippe auf das ferne Knie.' },
  { text: 'Rolle die Person zu dir auf die Seite.', ziel: 'rollen', info: 'Tippe auf die Schulter.' },
  {
    text: 'Überstrecke den Kopf leicht, Mund zeigt nach unten. Prüfe die Atmung weiter.',
    ziel: 'kopf',
    info: 'Tippe auf den Kopf.',
  },
];
const ZIELE: Record<string, { x: number; y: number }> = {
  knie: { x: 150, y: 178 },
  armNah: { x: 128, y: 138 },
  armFern: { x: 128, y: 86 },
  bein: { x: 250, y: 84 },
  rollen: { x: 118, y: 112 },
  kopf: { x: 66, y: 112 },
};

function Seitenlage({ onFertig, fertigPunkte }: { onFertig: () => void; fertigPunkte: number | null }) {
  const r = useRolle();
  const [s, setS] = useState(0);
  const st = SCHRITTE[Math.min(s, SCHRITTE.length - 1)];
  const gerollt = s >= 5;
  const tippe = (ziel: string) => {
    if (s >= SCHRITTE.length || ziel !== st.ziel) return;
    const n = s + 1;
    setS(n);
    if (n === SCHRITTE.length) onFertig();
  };
  const rot = gerollt ? 'translate(0 24) scale(1 0.78)' : '';
  return (
    <>
      <Card style={{ gap: spacing.xs }}>
        <Text style={type.eyebrow}>{s < SCHRITTE.length ? `Schritt ${s + 1} von ${SCHRITTE.length}` : 'Geschafft'}</Text>
        <Text style={type.headline}>
          {s < SCHRITTE.length
            ? st.text
            : 'Die Person liegt stabil. Notruf 112 wählen bzw. weiter beobachten, bis der Rettungsdienst kommt.'}
        </Text>
        {s < SCHRITTE.length && <Text style={type.small}>{st.info}</Text>}
      </Card>
      <View style={styles.flaeche}>
        <View style={{ width: BW, height: BH }}>
          <Svg width={BW} height={BH} viewBox={`0 0 ${BW} ${BH}`}>
            <Rect x={0} y={0} width={BW} height={BH} rx={18} fill="#EAF3F0" />
            <G transform={rot}>
              {/* ferner Arm */}
              {s < 3 ? (
                <Line x1={118} y1={88} x2={176} y2={84} stroke={HAUT} strokeWidth={14} strokeLinecap="round" />
              ) : (
                <Path
                  d="M118 90 L96 108 L78 112"
                  stroke={HAUT}
                  strokeWidth={14}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              )}
              {/* ferne Beine */}
              {s < 4 ? (
                <Line x1={206} y1={94} x2={292} y2={94} stroke="#5C7CFA" strokeWidth={18} strokeLinecap="round" />
              ) : (
                <Path
                  d="M206 94 L262 78 L282 118"
                  stroke="#5C7CFA"
                  strokeWidth={18}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              )}
              {/* Rumpf */}
              <Rect x={100} y={84} width={112} height={56} rx={22} fill="#7DA2FF" />
              {/* nahes Bein */}
              <Line x1={206} y1={128} x2={292} y2={128} stroke="#4A6BE0" strokeWidth={18} strokeLinecap="round" />
              {/* naher Arm */}
              {s < 2 ? (
                <Line x1={118} y1={134} x2={176} y2={140} stroke={HAUT} strokeWidth={14} strokeLinecap="round" />
              ) : (
                <Path
                  d="M118 134 L118 168 L150 168"
                  stroke={HAUT}
                  strokeWidth={14}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              )}
              {/* Kopf */}
              <Circle cx={72} cy={112} r={26} fill={HAUT} stroke={HAUT_DUNKEL} strokeWidth={3} />
              <Circle cx={s >= 6 ? 58 : 64} cy={s >= 6 ? 120 : 106} r={3} fill="#5A4636" />
              {s >= 6 && <Path d="M52 128 q8 6 16 0" stroke="#8A4B3C" strokeWidth={3} fill="none" strokeLinecap="round" />}
            </G>
          </Svg>
          {s < SCHRITTE.length && (
            <Tap
              offset={0}
              onPress={() => tippe(st.ziel)}
              accessibilityLabel={`Ziel: ${st.info}`}
              style={[styles.ziel, { left: ZIELE[st.ziel].x - 24, top: ZIELE[st.ziel].y - 24, borderColor: r.akzent }]}
            >
              <Text style={styles.zielText}>👆</Text>
            </Tap>
          )}
        </View>
      </View>
      {fertigPunkte !== null && (
        <Card style={{ alignItems: 'center', gap: spacing.xs }}>
          <Text style={styles.emoji}>🏅</Text>
          <Text style={[type.headline, { color: r.akzentDunkel }]}>+{fertigPunkte} Punkte</Text>
          <Text style={type.small}>
            Seitenlage nur bei Bewusstlosigkeit mit normaler Atmung. Atmet die Person nicht normal: sofort Herzdruckmassage.
          </Text>
        </Card>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxl },
  wide: { padding: spacing.xl, maxWidth: 760, alignSelf: 'center', width: '100%' },
  zeile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  zeichen: { fontSize: 26, fontFamily: fonts.regular, width: 36, textAlign: 'center' },
  flaeche: { alignItems: 'center' },
  wickelFlaeche: {
    position: 'absolute',
    left: 40,
    top: 86,
    width: 214,
    height: 64,
    borderRadius: 30,
    borderWidth: 0,
    borderColor: 'transparent',
  },
  finger: {
    position: 'absolute',
    left: 276,
    top: 84,
    width: 44,
    height: 68,
    borderRadius: 16,
    borderWidth: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  fingerText: { fontSize: 22, fontFamily: fonts.regular },
  ablage: { position: 'absolute', left: 0, right: 0, bottom: 8, alignItems: 'center' },
  gegenstand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 2.5,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  gegenstandIcon: { fontSize: 26, fontFamily: fonts.regular },
  gegenstandText: { fontFamily: fonts.bold, fontSize: 12, color: colors.ink },
  auflage: {
    width: 64,
    height: 46,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 2.5,
    borderColor: '#B8C2BE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  polster: {
    width: 64,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#5B8DEF',
    borderWidth: 2.5,
    borderColor: '#3E6FCF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ziel: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 3,
    backgroundColor: 'rgba(255,255,255,0.75)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  zielText: { fontSize: 22, fontFamily: fonts.regular },
  emoji: { fontSize: 40, lineHeight: 46, fontFamily: fonts.regular },
});
