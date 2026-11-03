import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Bar, Button, Card, Eyebrow, TopBar } from '../components/UI';
import { BereichStand, FallInfo, bereichStaende, einschaetzung, schwacheFaelle } from '../game/lernstand';
import { useRolle } from '../game/rolle';
import { Progress } from '../game/storage';
import { useLayout } from '../layout';
import { colors, fonts, spacing, type } from '../theme';

const sterneText = (n: number) => '★'.repeat(n) + '☆'.repeat(3 - n);

/** Mein Lernstand: wie weit bin ich je Bereich, was kann ich gut, was sollte ich wiederholen */
export function LernstandScreen({
  progress,
  faelle,
  titel,
  onWiederholen,
  onBack,
}: {
  progress: Progress;
  /** Alle Einsätze der aktiven Rolle */
  faelle: (FallInfo & { diagnosis?: string; title?: string })[];
  /** Name des Falls für die Liste (Diagnose bzw. Titel) */
  titel: (id: string) => string;
  onWiederholen: () => void;
  onBack: () => void;
}) {
  const L = useLayout();
  const r = useRolle();
  const bereiche = useMemo(() => bereichStaende(faelle, progress.bestStars), [faelle, progress.bestStars]);
  const { staerken, luecken } = useMemo(() => einschaetzung(bereiche), [bereiche]);
  const schwach = useMemo(() => schwacheFaelle(faelle, progress.bestStars), [faelle, progress.bestStars]);
  const gespielt = faelle.filter((f) => f.id in progress.bestStars).length;
  const gemeistert = faelle.filter((f) => (progress.bestStars[f.id] ?? 0) >= 3).length;

  const zeile = (b: BereichStand) => (
    <View key={b.id} style={{ gap: 4 }}>
      <View style={styles.zeile}>
        <Text style={styles.name} numberOfLines={1}>
          {b.icon} {b.titel}
        </Text>
        <Text style={type.small}>
          {b.gemeistert} gemeistert · {b.gespielt}/{b.gesamt} gespielt
        </Text>
      </View>
      {/* Der helle Balken zeigt, wie viel gespielt ist, der kräftige, wie viel gemeistert ist */}
      <View>
        <Bar pct={b.gespielt / Math.max(1, b.gesamt)} color={r.akzentTint} height={10} />
        <View style={{ position: 'absolute', left: 0, right: 0, top: 0 }}>
          <Bar pct={b.gemeistert / Math.max(1, b.gesamt)} color={r.akzent} height={10} track="transparent" />
        </View>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <TopBar kicker={r.titel} title="Mein Lernstand" onBack={onBack} />
      <ScrollView contentContainerStyle={[styles.content, L.wide && styles.wide]}>
        <Card style={{ gap: spacing.xs }}>
          <Eyebrow title="Gesamt" />
          <Text style={type.h2}>
            {gespielt} von {faelle.length} Einsätzen gespielt
          </Text>
          <Text style={type.body}>{gemeistert} davon mit 3 Sternen gemeistert.</Text>
        </Card>

        {(staerken.length > 0 || luecken.length > 0) && (
          <Card style={{ gap: spacing.xs }}>
            {staerken.length > 0 && (
              <Text style={type.body}>
                💪 <Text style={{ fontFamily: fonts.bold }}>Stark:</Text> {staerken.map((b) => b.titel).join(' und ')}
              </Text>
            )}
            {luecken.length > 0 && (
              <Text style={type.body}>
                🎯 <Text style={{ fontFamily: fonts.bold }}>Da lohnt sich Üben:</Text> {luecken.map((b) => b.titel).join(' und ')}
              </Text>
            )}
          </Card>
        )}

        <Card style={{ gap: spacing.md }}>
          <Eyebrow title="Bereiche" />
          {bereiche.map(zeile)}
        </Card>

        <Card style={{ gap: spacing.sm }}>
          <Eyebrow title="Wiederholen" />
          {schwach.length === 0 ? (
            <Text style={type.body}>
              Noch keine Schwachstellen: Alle Einsätze, die du gespielt hast, hast du mit mindestens 2 Sternen geschafft. 👏
            </Text>
          ) : (
            <>
              <Text style={type.body}>
                Diese {schwach.length} Einsätze hast du mit höchstens einem Stern abgeschlossen – hier kannst du dich verbessern:
              </Text>
              {schwach.slice(0, 8).map((f) => (
                <View key={f.id} style={styles.zeile}>
                  <Text style={[type.body, { flex: 1 }]} numberOfLines={2}>
                    {titel(f.id)}
                  </Text>
                  <Text style={styles.sterne}>{sterneText(progress.bestStars[f.id] ?? 0)}</Text>
                </View>
              ))}
              {schwach.length > 8 && <Text style={type.small}>… und {schwach.length - 8} weitere</Text>}
            </>
          )}
          <Button label={schwach.length > 0 ? 'Schwache Einsätze wiederholen' : 'Einen Einsatz spielen'} onPress={onWiederholen} />
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxl },
  wide: { padding: spacing.xl, maxWidth: 760, alignSelf: 'center', width: '100%' },
  zeile: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing.sm },
  name: { fontFamily: fonts.semibold, fontSize: 14, color: colors.ink, flex: 1 },
  sterne: { fontFamily: fonts.bold, fontSize: 14, color: colors.orange },
});
