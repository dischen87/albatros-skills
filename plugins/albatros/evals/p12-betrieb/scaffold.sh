#!/usr/bin/env bash
# Gerüst für den Fall p12-betrieb: freigegeben, Wohnort selbst (P1 bis P11, wie der Zustand selbst-lanciert)
set -euo pipefail
. "$(dirname "${BASH_SOURCE[0]}")/../_projekt/projekt.sh"
bis P10
p11_selbst
