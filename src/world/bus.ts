/** Kleine Brücke zwischen App und 3D-Welt: Die Welt bleibt im Hintergrund erhalten, während ein Notfall gespielt wird */
export const weltBus: {
  /** Notfall in der Welt abgeschlossen (von App aufgerufen) */
  erledigt: ((erfolg: boolean, bonus: number) => void) | null;
} = { erledigt: null };
