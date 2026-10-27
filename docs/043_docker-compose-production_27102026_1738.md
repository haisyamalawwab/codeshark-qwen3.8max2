# 043 — Docker & Docker Compose Production

- Tanggal: 27 Oktober 2026
- Branch: `arena/bca0facd-codeshark-qwen3-8max2`
- Tujuan: repository memiliki `Dockerfile` dan `compose.yaml` yang dapat dipakai untuk menjalankan CodeShark Academy dalam container.

## Ringkasan perubahan

| File | Peran |
|---|---|
| `Dockerfile` | Multi-stage build: `web-build` untuk Vite, `api` untuk Node API, dan `web` sebagai image bawaan berbasis nginx |
| `compose.yaml` | Menjalankan service `api` dan `web`; `web` menunggu healthcheck API |
| `.dockerignore` | Mengecualikan `.git`, `.env*` kecuali `.env.example`, `node_modules`, hasil build, artefak test, arsip, dan dokumentasi dari build context |
| `docker/nginx/default.conf.template` | Routing multi-entry, cache aset, service worker no-store, dan reverse proxy `/api/*` |
| `README.md` | Menambahkan Docker Compose pada pilihan deploy |

## Arsitektur container

```text
Browser
  │
  │ http://localhost:${WEB_PORT:-8080}
  ▼
web (nginx:1.28-alpine)
  ├─ /                 → dist/index.html
  ├─ /codingshark/*    → dist/codingshark/index.html
  ├─ /codingtower/*    → dist/codingtower/index.html
  ├─ /admin/*          → dist/admin/index.html
  └─ /api/*            → http://api:3001/api/*
                              │
                              ▼
api (node:22-alpine)
  └─ node server/dev-api.mjs
```

Service `api` hanya diekspos ke jaringan internal Compose. Service `web` adalah satu-satunya service dengan port host.

## Cara menjalankan

Tanpa konfigurasi cloud:

```bash
docker compose up --build
```

Lalu buka:

```text
http://localhost:8080
```

Mengubah port host:

```bash
WEB_PORT=3000 docker compose up --build
```

Menghentikan stack:

```bash
docker compose down
```

## Environment

- Compose membaca `.env` untuk service API bila file itu ada (`required: false`), sehingga stack tetap dapat dimulai dalam mode lokal tanpa kredensial.
- Variabel publik `VITE_*` diteruskan sebagai build arg ke image web. Jangan memasukkan kredensial database, token admin, atau secret Better Auth sebagai build arg.
- `DATA_MODE` bawaan adalah `auto`. Bila env database/auth belum siap, endpoint status melaporkan tidak siap dan frontend mempertahankan **Env-Gated Capability Detection with Graceful Fallback** ke localStorage/SQLite lokal.
- `BETTER_AUTH_URL` pada `.env` harus sama dengan origin yang benar-benar dipakai browser, termasuk port host/domain produksi.

## Build image tanpa Compose

```bash
docker build -t codeshark-academy:local .
docker run --rm -p 8080:80 codeshark-academy:local
```

Perintah ini hanya menjalankan image web statis. Permintaan `/api/*` tidak memiliki upstream API pada mode ini, sehingga fitur cloud dinonaktifkan oleh fallback frontend. Untuk API pendamping, gunakan target dan orkestrasi pada `compose.yaml`.

## Validasi yang telah dijalankan

- `npm ci` — berhasil.
- `npm run lint` — berhasil.
- `npm run build` — berhasil; entry hub, `codingshark`, `codingtower`, `admin`, `sw.js`, dan manifest PWA tersedia di `dist/`.
- Parser YAML memvalidasi `compose.yaml`: service `api` dan `web` ada, target build benar, dan `web` menunggu API sehat.
- Adapter API dijalankan lokal dengan `DATA_MODE=local`; `/api/__health` menjawab HTTP 503 JSON mode lokal, sesuai status yang diterima healthcheck.
- `git diff --check` — berhasil pada tahap pemeriksaan awal.

## Batas validasi

Sandbox tidak memiliki Docker, Docker Compose, Podman, atau binary nginx. Oleh karena itu, pada pekerjaan ini **belum dibuktikan secara langsung**:

- `docker build`;
- `docker compose config` dan `docker compose up`;
- `nginx -t` di dalam image;
- koneksi live ke Layerbase/TiDB/Aiven/Supabase dari container.

Hasil di atas membuktikan build aplikasi, struktur Compose, dan adapter API lokal; bukan bukti live bahwa image telah dibangun atau database cloud terhubung. Verifikasi pertama pada mesin ber-Docker sebaiknya:

```bash
docker compose config
docker compose up --build
curl -i http://localhost:8080/healthz
curl -i http://localhost:8080/api/database-status
```
