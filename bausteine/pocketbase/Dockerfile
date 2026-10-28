# PocketBase: Datenbank, Login und Verwaltung in einem Programm (https://pocketbase.io)
FROM alpine:3.22
ARG PB_VERSION=0.40.5
ARG TARGETARCH
RUN apk add --no-cache ca-certificates wget unzip \
 && wget -q "https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_${TARGETARCH:-amd64}.zip" \
      "https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/checksums.txt" \
 && grep "_linux_${TARGETARCH:-amd64}.zip" checksums.txt | sha256sum -c - \
 && unzip -q pocketbase_*.zip pocketbase -d /pb && rm pocketbase_*.zip checksums.txt
COPY pb_migrations/ /pb/pb_migrations/
EXPOSE 8090
CMD ["/pb/pocketbase", "serve", "--http=0.0.0.0:8090", "--dir=/pb/pb_data", "--migrationsDir=/pb/pb_migrations"]
