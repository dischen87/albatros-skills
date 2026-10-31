# Der Eingang: ein kleiner Bun-Dienst ohne Pakete (eingang.ts), dieselbe Bun-Version wie im Test (test.ts)
FROM oven/bun:1.4.2-slim
WORKDIR /eingang
COPY eingang.ts eingang.json ./
USER bun
ENV PORT=8080
# Plätze für fetch zu den Teilen, für alle Besucher zusammen (Bun: 256). Der Eingang lässt je Adresse 20 offen; mit 1024 braucht es
# 52 Adressen, um alle zu belegen, statt 13. Gemessen mit messen.ts --gehalten (README): 1000 offen rund 45 MB, unter mem_limit 128m.
ENV BUN_CONFIG_MAX_HTTP_REQUESTS=1024
EXPOSE 8080
# --smol: kleinerer Speicher bei gleicher Leistung (gemessen, README.md)
CMD ["bun", "--smol", "eingang.ts"]
