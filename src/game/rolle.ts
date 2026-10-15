import { createContext, useContext } from 'react';

/** Wer spielt: Sanitäter/in im Rettungsdienst oder Ersthelfer/in im Alltag. Jede Rolle hat einen eigenen Spielstand. */
export type Rolle = 'sani' | 'helfer';

export interface RollenInfo {
  id: Rolle;
  titel: string;
  kurz: string;
  icon: string;
  beschreibung: string;
  /** Akzentfarbe der Rolle (Knöpfe, aktive Tabs, Hervorhebungen) */
  akzent: string;
  akzentDunkel: string;
  akzentTint: string;
  /** Das eigene Fahrzeug */
  fahrzeug: string;
  fahrzeugKurz: string;
  /** Wie ein Einsatz heißt */
  einsatz: string;
}

export const ROLLEN: Record<Rolle, RollenInfo> = {
  helfer: {
    id: 'helfer',
    titel: 'Ersthelfer/in',
    kurz: 'Ersthelfer',
    icon: '🩹',
    beschreibung: 'Erste Hilfe im Alltag: richtig prüfen, Notruf, Seitenlage, Wiederbelebung. Du rüstest dein eigenes Auto aus.',
    akzent: '#12805C',
    akzentDunkel: '#0B5E43',
    akzentTint: '#E5F4EE',
    fahrzeug: 'Mein Auto',
    fahrzeugKurz: 'Auto',
    einsatz: 'Notfall',
  },
  sani: {
    id: 'sani',
    titel: 'Sanitäter/in',
    kurz: 'Sanitäter',
    icon: '🚑',
    beschreibung: 'Rettungsdienst: Patienten untersuchen, Werte messen, Diagnosen stellen. Du rüstest deinen Rettungswagen aus.',
    akzent: '#D92D20',
    akzentDunkel: '#B42318',
    akzentTint: '#FDECEA',
    fahrzeug: 'Mein Rettungswagen',
    fahrzeugKurz: 'Fahrzeug',
    einsatz: 'Einsatz',
  },
};

/**
 * Die aktive Rolle für Spiel-Logik außerhalb von React (Ränge, Ausrüstung, Abzeichen).
 * App.tsx setzt sie, bevor die Bildschirme gezeichnet werden.
 */
let aktiv: Rolle = 'sani';
export const aktiveRolle = () => aktiv;
export const setAktiveRolle = (r: Rolle) => {
  aktiv = r;
};

export const RolleContext = createContext<Rolle>('sani');
export const useRolle = () => ROLLEN[useContext(RolleContext)];
