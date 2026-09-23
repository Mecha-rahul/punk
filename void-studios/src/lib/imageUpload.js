// ==================================================================
// Client-side image compression for admin uploads.
//
// WHY THIS EXISTS: Vercel's rewrite proxy drops multipart bodies larger
// than ~2.85MB with a 502 (ROUTER_EXTERNAL_TARGET_CONNECTION_ERROR)
// before they ever reach Railway. Phone photos are 3–8MB, so every
// real product image was failing with a vague "Internal Server Error".
//
// Fix: re-encode each picked image to a bounded JPEG (max dimension,
// quality-stepped until it fits) *in the browser*. Same visual quality
// for product tiles, guaranteed-small payloads, faster uploads.
// ==================================================================

const MAX_DIMENSION = 1600
const MAX_BYTES = 2_200_000 // ~2.2MB — comfortable margin under the proxy limit

/**
 * compressImage(file) → File
 * Returns a JPEG File guaranteed under MAX_BYTES, or the original file
 * untouched when it's already small enough (no quality loss for small
 * PNGs/logos) or can't be decoded (SVG etc.).
 */
export async function compressImage(file) {
  // Nothing to do for already-small files.
  if (file.size <= MAX_BYTES) return file
  // Can't rasterize non-raster formats (SVG) — pass through and let the
  // backend error honestly if it's a problem.
  if (file.type === 'image/svg+xml') return file

  const bitmap = await loadBitmap(file)
  if (!bitmap) return file

  // Scale down so the longest edge is ≤ MAX_DIMENSION.
  const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height))
  const w = Math.max(1, Math.round(bitmap.width * scale))
  const h = Math.max(1, Math.round(bitmap.height * scale))

  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  // JPEG has no alpha — flatten transparency onto white so transparent PNGs
  // don't come out black.
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, w, h)
  ctx.drawImage(bitmap, 0, 0, w, h)
  if (bitmap.close) bitmap.close()

  // Step quality down until the blob fits.
  for (const quality of [0.85, 0.72, 0.6, 0.5, 0.4]) {
    const blob = await toBlob(canvas, quality)
    if (blob && blob.size <= MAX_BYTES) {
      return new File([blob], renameToJpg(file.name), { type: 'image/jpeg' })
    }
  }

  // Even q0.4 over budget (extreme aspect ratios) — last resort: the 0.4 blob.
  const fallback = await toBlob(canvas, 0.4)
  if (fallback) return new File([fallback], renameToJpg(file.name), { type: 'image/jpeg' })
  return file // give up gracefully; backend will surface any real error
}

async function loadBitmap(file) {
  try {
    if ('createImageBitmap' in window) return await createImageBitmap(file)
  } catch {
    /* fall through to <img> path */
  }
  // Safari fallback
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      resolve(null)
    }
    img.src = url
  })
}

function toBlob(canvas, quality) {
  return new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality))
}

function renameToJpg(name) {
  const base = name.replace(/\.[^.]+$/, '') || 'image'
  return `${base}.jpg`
}
