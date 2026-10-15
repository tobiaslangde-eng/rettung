import AsyncStorage from '@react-native-async-storage/async-storage';

/** Verstecktes Entwicklermenü: Der Code steht nur als Prüfsumme im Programm. */
const KEY = 'kiirabi.dev.v1';

function pruefsumme(text: string): number {
  let h = 0x811c9dc5;
  for (const c of text.trim().toLowerCase()) {
    h ^= c.charCodeAt(0);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h;
}

export const devCodeStimmt = (eingabe: string) => pruefsumme(eingabe) === DEV_SUMME;

/** Auf diesem Gerät schon einmal freigeschaltet? */
export async function devFreigeschaltet(): Promise<boolean> {
  try {
    return (await AsyncStorage.getItem(KEY)) === pruefsumme('ok').toString();
  } catch {
    return false;
  }
}

export async function devMerken(): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY, pruefsumme('ok').toString());
  } catch {
    // Ohne Speicher muss der Code beim nächsten Mal erneut eingegeben werden.
  }
}

const DEV_SUMME = 233698344;
