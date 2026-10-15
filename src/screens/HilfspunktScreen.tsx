import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { HilfspunktBild } from '../components/Hilfspunkt';
import { Bar, Button, StatChip, TopBar } from '../components/UI';
import { euro } from '../game/equipment';
import { HILFPUNKT, HILF_GESAMT_MAX, HILF_MAX, HilfId, hilfGesamt, hilfKosten, hilfLevel } from '../game/hilfspunkt';
import { Progress } from '../game/storage';
import { useLayout } from '../layout';
import { colors, fonts, spacing, type } from '../theme';

/** Mein Hilfspunkt: Bereiche ausbauen, Wirkung im Notfall sehen */
export function HilfspunktScreen({ progress, onBuild }: { progress: Progress; onBuild: (id: HilfId) => void }) {
  const L = useLayout();
  const gesamt = hilfGesamt(progress);
  const lv = (id: HilfId) => hilfLevel(progress, id);
  return (
    <View style={{ flex: 1 }}>
      <TopBar kicker="Standort" title="Mein Hilfspunkt" right={<StatChip value={euro(progress.budget)} label="Budget" />} />
      <ScrollView contentContainerStyle={[styles.content, L.wide && styles.wide]}>
        <View style={styles.bild}>
          <HilfspunktBild
            apotheke={lv('apotheke')}
            raum={lv('raum')}
            defi={lv('defi')}
            netz={lv('netz')}
            kursraum={lv('kursraum')}
            width={L.wide ? 640 : 358}
          />
        </View>
        <View style={styles.status}>
          <View style={{ flex: 1, gap: 6 }}>
            <Text style={type.eyebrow}>Ausbau</Text>
            <Text style={type.headline}>
              {gesamt} von {HILF_GESAMT_MAX} Stufen
            </Text>
            <Bar pct={gesamt / HILF_GESAMT_MAX} color={colors.tuerkis} />
            <Text style={type.small}>Dein Hilfspunkt ist der Treffpunkt für Erste Hilfe in deiner Nachbarschaft.</Text>
          </View>
        </View>
        {HILFPUNKT.map((h) => {
          const l = lv(h.id);
          const kosten = hilfKosten(progress, h.id);
          const fehlt = kosten !== null && progress.budget < kosten;
          return (
            <View key={h.id} style={styles.card}>
              <View style={styles.head}>
                <View style={styles.icon}>
                  <Text style={{ fontSize: 24, fontFamily: fonts.regular }}>{h.icon}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={type.headline}>{h.title}</Text>
                  <Text style={[styles.stufe, l === 0 && { color: colors.muted }]}>
                    {l === 0 ? 'Noch nicht gebaut' : `Stufe ${l}: ${h.stufen[l - 1]}`}
                  </Text>
                </View>
                <View style={styles.pips}>
                  {Array.from({ length: HILF_MAX }, (_, i) => (
                    <View
                      key={i}
                      style={[styles.pip, i < l && { backgroundColor: colors.tuerkis, borderColor: colors.tuerkis }]}
                    />
                  ))}
                </View>
              </View>
              <Text style={type.small}>{h.wissen}</Text>
              <Text style={styles.wirkung}>⚙ {h.wirkung}</Text>
              {kosten !== null ? (
                <Button
                  label={`${l === 0 ? 'Bauen' : 'Ausbauen'} · ${euro(kosten)}`}
                  sub={l < HILF_MAX ? `Nächste Stufe: ${h.stufen[l]}` : undefined}
                  onPress={() => onBuild(h.id)}
                  disabled={fehlt}
                  variant={fehlt ? 'outline' : 'primary'}
                />
              ) : (
                <Text style={styles.fertig}>✓ Voll ausgebaut</Text>
              )}
              {fehlt && (
                <Text style={type.small}>
                  Es fehlen noch {euro(kosten! - progress.budget)} – sammle Punkte bei Notfällen und Trainings.
                </Text>
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxl },
  wide: { padding: spacing.xl, maxWidth: 760, alignSelf: 'center', width: '100%' },
  bild: {
    alignItems: 'center',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.navy,
  },
  status: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 14,
    padding: spacing.lg,
  },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 14,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  head: { flexDirection: 'row', gap: spacing.md, alignItems: 'center' },
  icon: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: colors.surface2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stufe: { fontFamily: fonts.semibold, fontSize: 12.5, color: colors.tuerkisDark, marginTop: 2 },
  pips: { flexDirection: 'row', gap: 4 },
  pip: { width: 10, height: 10, borderRadius: 5, borderWidth: 1.5, borderColor: colors.line },
  wirkung: { fontFamily: fonts.semibold, fontSize: 13, color: colors.inkSoft },
  fertig: { fontFamily: fonts.semibold, fontSize: 14, color: colors.mintDark },
});
