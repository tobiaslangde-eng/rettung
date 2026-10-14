"""Führt einen interaktiven EAS-Befehl in der CI aus und bestätigt jede Rückfrage mit der Vorgabe.

EAS kann Apple-Zertifikat und Provisioning-Profil nur im interaktiven Modus neu anlegen.
Mit gesetztem App-Store-Connect-API-Schlüssel (EXPO_ASC_*) fragt es dabei nur noch
Ja/Nein- und Auswahlfragen – die beantwortet dieses Skript mit der empfohlenen Vorgabe.

Nutzung: python3 scripts/eas-auto-answer.py eas credentials:configure-build -p ios -e production
"""
import sys

import pexpect

MAX_ANSWERS = 40

child = pexpect.spawn(sys.argv[1], sys.argv[2:], encoding="utf-8", timeout=900, dimensions=(50, 200))
child.logfile_read = sys.stdout

answers = 0
while True:
    # Fragen von „prompts“ beginnen mit einem farbigen „?“ und enden mit „›“ (ggf. mit Farbcodes dazwischen)
    i = child.expect([r"\(Y/n\)", r"\(y/N\)", r"Use arrow-keys", r"\?(?:\x1b\[\d+m)? [^\n]*?›", pexpect.EOF])
    if i == 4:
        break
    answers += 1
    if answers > MAX_ANSWERS:
        print("\n::error::Zu viele Rückfragen – Abbruch.")
        child.terminate(force=True)
        sys.exit(1)
    # Ja/Nein mit Vorgabe „Ja“ → y; sonst Vorgabe übernehmen (Enter)
    child.send("y\r" if i == 0 else "\r")

child.close()
sys.exit(child.exitstatus if child.exitstatus is not None else 1)
