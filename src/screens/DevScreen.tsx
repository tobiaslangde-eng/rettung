import { szenenFuer } from '../game/gefahren';
import { LEITSTELLE_SZENARIEN } from '../data/leitstelle/szenarien';
import { fehlerSzenarienFuer } from '../game/fehler';
import { LABOR_UEBUNGEN } from '../data/labor';
import { ReactNode, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ambulance } from '../components/Ambulance';
import { AutoDeviceArt, hatAutoArt } from '../components/AutoDevices';
import { Car } from '../components/Car';
import { DeviceArt } from '../components/Devices';
import { Button, Tap, TopBar } from '../components/UI';
import { AED_SZENARIEN } from '../data/aed';
import { aktenListe } from '../game/detective';
import { CASES } from '../data/cases';
import { HELFER_FAELLE } from '../data/helfer';
import { NOTRUF_SZENARIEN } from '../data/notruf';
import { PACKLISTEN } from '../data/packlisten';
import { badgesFuerRolle } from '../game/achievements';
import { EQUIPMENT_BY_ID, EquipmentId, MAX_LEVEL, ausruestung, euro, levelOf } from '../game/equipment';
import { useRolle } from '../game/rolle';
import { rankFor, rankList } from '../game/scoring';
import { ablaeufeFuer } from '../game/schritte';
import { Progress } from '../game/storage';
import { KAPITEL } from '../game/story';
import { HILFPUNKT, HILF_MAX, hilfLevel } from '../game/hilfspunkt';
import { WACHE, WACHE_MAX, wacheLevel } from '../game/wache';
import { useLayout } from '../layout';
import { colors, fonts, spacing, type } from '../theme';

type Tab = 'werte' | 'frei' | 'raenge' | 'technik' | 'grafik' | 'abzeichen' | 'wache' | 'hilf';

const nf = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');

/** Entwicklermenü (versteckt): Punkte, Budget, Freischaltungen, Ränge, Ausrüstung, Abzeichen und Wache – je nach Rolle */
export function DevScreen({
  progress,
  onChange,
  onBack,
}: {
  progress: Progress;
  onChange: (p: Progress) => void;
  onBack: () => void;
}) {
  const L = useLayout();
  const r = useRolle();
  const helfer = r.id === 'helfer';
  const [tab, setTab] = useState<Tab>('werte');
  const p = progress;
  const set = (patch: Partial<Progress>) => onChange({ ...p, ...patch });
  const ausr = ausruestung();
  const kapitel = KAPITEL[r.id];
  const faelle = helfer ? HELFER_FAELLE : CASES;
  const badges = badgesFuerRolle();

  const tabs: { id: Tab; label: string }[] = [
    { id: 'werte', label: 'Werte' },
    { id: 'frei', label: 'Freischalten' },
    { id: 'raenge', label: 'Ränge' },
    { id: 'technik', label: helfer ? 'Auto' : 'Fahrzeug' },
    { id: 'grafik', label: 'Grafiken' },
    { id: 'abzeichen', label: 'Abzeichen' },
    helfer ? { id: 'hilf' as Tab, label: 'Hilfspunkt' } : { id: 'wache' as Tab, label: 'Wache' },
  ];

  const alleErledigt = () => {
    const stars: Record<string, number> = { ...p.bestStars };
    faelle.forEach((f) => (stars[f.id] = 3));
    const base: Partial<Progress> = {
      bestStars: stars,
      casesPlayed: Math.max(p.casesPlayed, faelle.length),
      perfectRuns: Math.max(p.perfectRuns, faelle.length),
      correctDiagnoses: Math.max(p.correctDiagnoses, faelle.length),
      quizBest: 10,
      knowBest: 10,
      cprBest: 100,
      ablaeufe: ablaeufeFuer(r.id).map((a) => a.id),
      gefahrGeschafft: szenenFuer(r.id).map((x) => x.id),
      kartenEinsaetze: Math.max(p.kartenEinsaetze, 10),
      leitstelleGeschafft: LEITSTELLE_SZENARIEN.map((x) => x.id),
      fehlerGeschafft: fehlerSzenarienFuer(r.id).map((x) => x.id),
      laborGeschafft: ['druckverband', 'seitenlage', ...LABOR_UEBUNGEN.map((x) => x.id)],
      kartenRouten: Math.max(p.kartenRouten, 10),
      schichten: Math.max(p.schichten, 3),
    };
    if (helfer) {
      Object.assign(base, {
        notrufGeschafft: NOTRUF_SZENARIEN.map((x) => x.id),
        aedGeschafft: AED_SZENARIEN.map((x) => x.id),
        packGeschafft: PACKLISTEN.map((x) => x.id),
        zuerstBest: 10,
        handgriffeBest: 10,
        mythenBest: 10,
        pruefungBest: 20,
      });
    } else {
      const arch: Record<string, 1 | 2> = {};
      aktenListe().forEach((a) => (arch[a.id] = 2));
      Object.assign(base, { manvBest: 8, detectiveSolved: arch, hardWins: Math.max(p.hardWins, 10) });
    }
    set(base);
  };

  const bestwerteNull = () =>
    set({
      quizBest: 0,
      knowBest: 0,
      cprBest: 0,
      manvBest: 0,
      zuerstBest: 0,
      handgriffeBest: 0,
      mythenBest: 0,
      pruefungBest: 0,
      ablaeufe: [],
      notrufGeschafft: [],
      aedGeschafft: [],
      packGeschafft: [],
      gefahrGeschafft: [],
      kartenEinsaetze: 0,
      leitstelleGeschafft: [],
      fehlerGeschafft: [],
      laborGeschafft: [],
      kartenRouten: 0,
      schichten: 0,
      duellGespielt: 0,
      duellSiege: 0,
      spickGesehen: [],
      serieBelohnt: [],
      urkundenDatum: {},
      bestStars: {},
      detectiveSolved: {},
      casesPlayed: 0,
      perfectRuns: 0,
    });

  return (
    <View style={{ flex: 1 }}>
      <TopBar kicker={`Entwickler · ${r.titel}`} title="Entwicklermenü" onBack={onBack} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabScroll} contentContainerStyle={styles.tabs}>
        {tabs.map((t) => (
          <Tap
            key={t.id}
            onPress={() => setTab(t.id)}
            accessibilityLabel={t.label}
            style={[styles.tab, tab === t.id && { backgroundColor: r.akzent, borderColor: r.akzent }]}
          >
            <Text style={[styles.tabText, tab === t.id && { color: colors.onBright }]}>{t.label}</Text>
          </Tap>
        ))}
      </ScrollView>
      <ScrollView contentContainerStyle={[styles.content, L.wide && styles.wide]}>
        {tab === 'werte' && (
          <>
            <Block title="Punkte" info={`${nf(p.totalPoints)} Punkte · Rang: ${rankFor(p.totalPoints).rank.de}`}>
              <Row>
                {[100, 1000, 10000, 100000].map((n) => (
                  <Mini key={n} label={`+${nf(n)}`} onPress={() => set({ totalPoints: p.totalPoints + n })} />
                ))}
              </Row>
              <Row>
                <Mini label="Auf 0" onPress={() => set({ totalPoints: 0 })} />
                <Mini
                  label="Max-Rang"
                  onPress={() => set({ totalPoints: Math.max(p.totalPoints, rankList()[rankList().length - 1].min) })}
                />
              </Row>
            </Block>
            <Block title="Budget" info={euro(p.budget)}>
              <Row>
                {[500, 5000, 50000].map((n) => (
                  <Mini key={n} label={`+${nf(n)} €`} onPress={() => set({ budget: p.budget + n })} />
                ))}
              </Row>
              <Row>
                <Mini label="Unendlich (999.999 €)" onPress={() => set({ budget: 999999 })} />
                <Mini label="Auf 0" onPress={() => set({ budget: 0 })} />
              </Row>
            </Block>
            <Block title="Serie und Tag" info={`Serie ${p.streak} · Tage am Stück ${p.dayStreak} · Einsätze ${p.casesPlayed}`}>
              <Row>
                <Mini label="Serie +5" onPress={() => set({ streak: p.streak + 5 })} />
                <Mini
                  label="Tage +7"
                  onPress={() => set({ dayStreak: p.dayStreak + 7, bestDayStreak: Math.max(p.bestDayStreak, p.dayStreak + 7) })}
                />
                <Mini label="Tagesziel zurück" onPress={() => set({ dayCases: 0, dailyCaseDay: '', lastGoalDay: '' })} />
              </Row>
            </Block>
          </>
        )}

        {tab === 'frei' && (
          <>
            <Block title="Alles auf einmal" info="Schaltet frei oder setzt alle Bestwerte">
              <Button label="Alle Bereiche freischalten" onPress={() => set({ story: Math.max(p.story, kapitel.length - 1) })} />
              <Button label="Geschichte komplett abschließen" variant="outline" onPress={() => set({ story: kapitel.length })} />
              <Button label="Alles auf Maximum (Bestwerte, Sterne, Archiv)" variant="outline" onPress={alleErledigt} />
              <Button label="Alle Bestwerte und Sterne zurücksetzen" variant="outline" onPress={bestwerteNull} />
            </Block>
            <Block title="Geschichte" info={`Kapitel ${Math.min(p.story + 1, kapitel.length)} von ${kapitel.length} aktiv`}>
              <View style={{ gap: 6 }}>
                {kapitel.map((k, i) => (
                  <Tap
                    key={k.titel}
                    onPress={() => set({ story: i })}
                    accessibilityLabel={`Kapitel ${i + 1}`}
                    style={[styles.listRow, p.story === i && { borderColor: r.akzent }]}
                  >
                    <Text style={[styles.nr, i < p.story && { color: colors.mintDark }]}>{i < p.story ? '✓' : i + 1}</Text>
                    <Text style={[type.small, { flex: 1, color: colors.ink }]}>{k.titel}</Text>
                    <Text style={styles.tiny}>springen</Text>
                  </Tap>
                ))}
              </View>
            </Block>
          </>
        )}

        {tab === 'raenge' && (
          <Block title="Alle Dienstgrade" info="Tippe auf einen Rang, um die Punkte dorthin zu setzen.">
            <View style={{ gap: 6 }}>
              {rankList().map((rk, i) => {
                const aktuell = rankFor(p.totalPoints).rank.min === rk.min;
                return (
                  <Tap
                    key={rk.min}
                    onPress={() => set({ totalPoints: rk.min })}
                    accessibilityLabel={rk.de}
                    style={[styles.listRow, aktuell && { borderColor: r.akzent }]}
                  >
                    <Text style={styles.nr}>{i + 1}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={[type.headline, { fontSize: 15 }]}>{rk.de}</Text>
                      <Text style={styles.tiny}>ab {nf(rk.min)} Punkten</Text>
                    </View>
                    {aktuell && <Text style={[styles.tiny, { color: r.akzentDunkel }]}>aktuell</Text>}
                  </Tap>
                );
              })}
            </View>
          </Block>
        )}

        {tab === 'technik' && (
          <>
            <Block
              title={helfer ? 'Mein Auto' : 'Mein Rettungswagen'}
              info={`${ausr.reduce((s, e) => s + levelOf(p, e.id), 0)} von ${ausr.length * MAX_LEVEL} Stufen`}
            >
              <Row>
                <Mini
                  label="Alles Stufe 4"
                  onPress={() => set({ equipment: Object.fromEntries(ausr.map((e) => [e.id, MAX_LEVEL])) })}
                />
                <Mini label="Alles Stufe 1" onPress={() => set({ equipment: {} })} />
              </Row>
            </Block>
            {ausr.map((e) => {
              const l = levelOf(p, e.id);
              const t = EQUIPMENT_BY_ID[e.id].tiers[l - 1];
              return (
                <Block key={e.id} title={`${e.icon} ${e.title}`} info={`Stufe ${l}: ${t.name} (${t.year})`}>
                  <Text style={type.small}>{e.effect(l)}</Text>
                  <Row>
                    {[1, 2, 3, 4].map((n) => (
                      <Mini
                        key={n}
                        label={`Stufe ${n}`}
                        active={l === n}
                        onPress={() => set({ equipment: { ...p.equipment, [e.id]: n } })}
                      />
                    ))}
                  </Row>
                  <Text style={styles.tiny}>Kosten: {e.cost.map((c, i) => (i === 0 ? 'Start' : euro(c))).join(' · ')}</Text>
                </Block>
              );
            })}
          </>
        )}

        {tab === 'grafik' && (
          <>
            <Block title="Alle Grafiken" info="Jede Ausrüstung in allen vier Stufen" />
            {ausr.map((e) => (
              <Block key={e.id} title={`${e.icon} ${e.title}`}>
                <View style={styles.galerie}>
                  {[1, 2, 3, 4].map((n) => (
                    <View key={n} style={styles.galerieZelle}>
                      <View style={styles.galerieBild}>
                        {e.id === 'rtw' ? (
                          <Ambulance level={n} width={96} />
                        ) : e.id === 'auto' ? (
                          <Car level={n} width={96} />
                        ) : hatAutoArt(e.id) ? (
                          <AutoDeviceArt id={e.id} level={n} size={84} />
                        ) : (
                          <DeviceArt id={e.id as Exclude<EquipmentId, 'rtw'>} level={n} size={84} />
                        )}
                      </View>
                      <Text style={styles.tiny}>Stufe {n}</Text>
                      <Text style={[styles.tiny, { color: colors.ink }]} numberOfLines={2}>
                        {e.tiers[n - 1].name}
                      </Text>
                    </View>
                  ))}
                </View>
              </Block>
            ))}
          </>
        )}

        {tab === 'abzeichen' && (
          <>
            <Block
              title="Abzeichen"
              info={`${badges.filter((b) => p.badges.includes(b.id)).length} von ${badges.length} vergeben`}
            >
              <Row>
                <Mini
                  label="Alle vergeben"
                  onPress={() => set({ badges: [...new Set([...p.badges, ...badges.map((b) => b.id)])] })}
                />
                <Mini
                  label="Alle entfernen"
                  onPress={() => set({ badges: p.badges.filter((id) => !badges.some((b) => b.id === id)) })}
                />
              </Row>
            </Block>
            {badges.map((b) => {
              const hat = p.badges.includes(b.id);
              return (
                <Tap
                  key={b.id}
                  onPress={() => set({ badges: hat ? p.badges.filter((id) => id !== b.id) : [...p.badges, b.id] })}
                  accessibilityLabel={b.title}
                  style={[styles.listRow, hat && { borderColor: colors.mintDark }]}
                >
                  <Text style={{ fontSize: 22, fontFamily: fonts.regular, opacity: hat ? 1 : 0.35 }}>{b.icon}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[type.headline, { fontSize: 15 }]}>{b.title}</Text>
                    <Text style={styles.tiny}>{b.description}</Text>
                  </View>
                  <Text style={[styles.tiny, hat && { color: colors.mintDark }]}>{hat ? 'vergeben' : 'offen'}</Text>
                </Tap>
              );
            })}
          </>
        )}

        {tab === 'hilf' && (
          <>
            <Block title="Hilfspunkt" info="Ausbaustufen setzen">
              <Row>
                <Mini label="Alles voll ausbauen" onPress={() => set({ hilfspunkt: Object.fromEntries(HILFPUNKT.map((h) => [h.id, HILF_MAX])) })} />
                <Mini label="Alles zurück" onPress={() => set({ hilfspunkt: {} })} />
              </Row>
            </Block>
            {HILFPUNKT.map((h) => {
              const l = hilfLevel(p, h.id);
              return (
                <Block key={h.id} title={`${h.icon} ${h.title}`} info={l === 0 ? 'Noch nicht gebaut' : `Stufe ${l}: ${h.stufen[l - 1]}`}>
                  <Text style={type.small}>{h.wirkung}</Text>
                  <Row>
                    {[0, 1, 2, 3].map((n) => (
                      <Mini key={n} label={n === 0 ? 'Aus' : `Stufe ${n}`} active={l === n} onPress={() => set({ hilfspunkt: { ...p.hilfspunkt, [h.id]: n } })} />
                    ))}
                  </Row>
                </Block>
              );
            })}
          </>
        )}

        {tab === 'wache' && (
          <>
            <Block title="Rettungswache" info="Ausbaustufen setzen">
              <Row>
                <Mini
                  label="Alles voll ausbauen"
                  onPress={() => set({ wache: Object.fromEntries(WACHE.map((w) => [w.id, WACHE_MAX])) })}
                />
                <Mini label="Alles zurück" onPress={() => set({ wache: {} })} />
              </Row>
            </Block>
            {WACHE.map((w) => {
              const l = wacheLevel(p, w.id);
              return (
                <Block
                  key={w.id}
                  title={`${w.icon} ${w.title}`}
                  info={l === 0 ? 'Noch nicht gebaut' : `Stufe ${l}: ${w.stufen[l - 1]}`}
                >
                  <Text style={type.small}>{w.wirkung}</Text>
                  <Row>
                    {[0, 1, 2, 3].map((n) => (
                      <Mini
                        key={n}
                        label={n === 0 ? 'Aus' : `Stufe ${n}`}
                        active={l === n}
                        onPress={() => set({ wache: { ...p.wache, [w.id]: n } })}
                      />
                    ))}
                  </Row>
                </Block>
              );
            })}
          </>
        )}
      </ScrollView>
    </View>
  );
}

function Block({ title, info, children }: { title: string; info?: string; children?: ReactNode }) {
  return (
    <View style={styles.block}>
      <Text style={type.headline}>{title}</Text>
      {info ? <Text style={styles.info}>{info}</Text> : null}
      {children}
    </View>
  );
}

const Row = ({ children }: { children: ReactNode }) => <View style={styles.row}>{children}</View>;

function Mini({ label, onPress, active }: { label: string; onPress: () => void; active?: boolean }) {
  return (
    <Tap
      onPress={onPress}
      accessibilityLabel={label}
      style={[styles.mini, active && { backgroundColor: colors.tuerkis, borderColor: colors.tuerkis }]}
    >
      <Text style={[styles.miniText, active && { color: colors.onBright }]}>{label}</Text>
    </Tap>
  );
}

const styles = StyleSheet.create({
  galerie: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  galerieZelle: { width: '48%', gap: 2 },
  galerieBild: { height: 96, alignItems: 'center', justifyContent: 'center', borderRadius: 10, backgroundColor: colors.surface2 },
  content: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxl },
  wide: { padding: spacing.xl, maxWidth: 760, alignSelf: 'center', width: '100%' },
  tabScroll: { flexGrow: 0, maxHeight: 52 },
  tabs: { paddingHorizontal: spacing.lg, gap: 8, paddingBottom: spacing.sm, alignItems: 'center' },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  tabText: { fontFamily: fonts.semibold, fontSize: 13, color: colors.ink },
  block: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 14,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  info: { fontFamily: fonts.semibold, fontSize: 13, color: colors.tuerkisDark },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  mini: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface2,
  },
  miniText: { fontFamily: fonts.semibold, fontSize: 13, color: colors.ink },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 12,
    padding: spacing.md,
    backgroundColor: colors.surface,
  },
  nr: { fontFamily: fonts.displayBlack, fontSize: 15, color: colors.muted, width: 22, textAlign: 'center' },
  tiny: { fontFamily: fonts.regular, fontSize: 12, color: colors.muted },
});
