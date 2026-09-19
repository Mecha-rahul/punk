# ─────────────────────────────────────────────────────────────────────────────
# AKUMA backend — Railway deploy image
#
# Railway Settings → Root Directory = backend/
# (Docker build context IS this folder — copy paths are relative to it,
# and Railway picks up backend/railway.json automatically.)
#
# Key choices:
#   - Debian slim (NOT alpine): bcryptjs is pure JS (no native builds at all),
#     but slim keeps the image small and avoids musl edge cases entirely.
#   - `npm ci --omit=dev` (not install): reproducible from the lockfile, and
#     mongodb-memory-server (devDependency, smoke-test only) is never installed.
#   - Seeding is handled inside index.js when SEED_ON_BOOT=true — it shares the
#     already-open MongoDB connection (idempotent, safe on every restart).
# ─────────────────────────────────────────────────────────────────────────────

FROM node:20-slim

# Production mode (JWT cookies get `secure: true` — correct behind Railway's HTTPS proxy)
ENV NODE_ENV=production

WORKDIR /app

# Install dependencies first (cached layer — only rebuilds when the lockfile changes)
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# App source
COPY . .

# Run as non-root
USER node

# Railway injects PORT; 8000 is the local default
EXPOSE 8000

CMD ["node", "index.js"]
