#!/bin/sh
# cloudflare-build.sh
# Build script khusus Cloudflare Pages:
# 1. Build Vite seperti biasa
# 2. Hapus folder video dari dist/ (melebihi batas 25 MB Cloudflare Pages)
# Video tetap tersedia secara penuh di versi Desktop Electron (.exe)

set -e

echo "=== METABODY: Vite Build ==="
npm run build

echo "=== Menghapus file video besar dari dist/ (Cloudflare Pages limit 25 MB) ==="
find dist -name "*.mp4" -delete && echo "Video files removed from dist/ OK" || echo "No .mp4 files found"
find dist -name "*.webm" -delete || true
find dist -name "*.mov" -delete || true

echo "=== Build selesai untuk Cloudflare Pages ==="
ls -lah dist/
