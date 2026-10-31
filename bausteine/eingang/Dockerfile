# Der Eingang: ein kleiner Bun-Dienst ohne Pakete (eingang.ts), dieselbe Bun-Version wie im Test (test.ts)
FROM oven/bun:1.4.2-slim
WORKDIR /eingang
COPY eingang.ts eingang.json ./
USER bun
ENV PORT=8080
EXPOSE 8080
# --smol: kleinerer Speicher bei gleicher Leistung (gemessen, README.md)
CMD ["bun", "--smol", "eingang.ts"]
