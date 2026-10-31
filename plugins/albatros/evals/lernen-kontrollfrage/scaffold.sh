#!/usr/bin/env bash
# Gerüst für den Fall lernen-kontrollfrage: Modus lernen, Plan geprüft, wartet auf das Ja (wie der Zustand gratis-p4)
set -euo pipefail
. "$(dirname "${BASH_SOURCE[0]}")/../_projekt/projekt.sh"
MODUS=lernen
GEPRUEFT=30.10.2026
bis P3
p4_pruefung
