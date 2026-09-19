# One-off: trim the brand logo PNGs to their visible artwork bounding box.
# Removes baked-in white padding so the header logo paints edge-to-edge art
# with no stray background band. Pure GDI+ via System.Drawing — no deps.
Add-Type -AssemblyName System.Drawing

$ErrorActionPreference = 'Stop'

function Trim-Png([string]$Path) {
  $src = [System.Drawing.Bitmap]::new($Path)

  $minX = $src.Width; $minY = $src.Height; $maxX = -1; $maxY = -1
  for ($y = 0; $y -lt $src.Height; $y++) {
    for ($x = 0; $x -lt $src.Width; $x++) {
      $p = $src.GetPixel($x, $y)
      # "content" = anything meaningfully not the flat background
      $isBg = ($p.A -lt 24) -or
              ([Math]::Abs($p.R - 255) -lt 12 -and [Math]::Abs($p.G - 255) -lt 12 -and [Math]::Abs($p.B - 255) -lt 12) -or
              ([Math]::Abs($p.R) -lt 12 -and [Math]::Abs($p.G) -lt 12 -and [Math]::Abs($p.B) -lt 12)
      if (-not $isBg) {
        if ($x -lt $minX) { $minX = $x }
        if ($y -lt $minY) { $minY = $y }
        if ($x -gt $maxX) { $maxX = $x }
        if ($y -gt $maxY) { $maxY = $y }
      }
    }
  }

  if ($maxX -lt 0) { throw "no content found in $Path" }

  # tiny breathing room, clamped
  $pad = 4
  $minX = [Math]::Max(0, $minX - $pad); $minY = [Math]::Max(0, $minY - $pad)
  $maxX = [Math]::Min($src.Width - 1, $maxX + $pad); $maxY = [Math]::Min($src.Height - 1, $maxY + $pad)
  $w = $maxX - $minX + 1; $h = $maxY - $minY + 1

  $dst = $src.Clone([System.Drawing.Rectangle]::new($minX, $minY, $w, $h), $src.PixelFormat)
  $src.Dispose()
  $dst.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)
  $dst.Dispose()
  "$([System.IO.Path]::GetFileName($Path)): cropped to ${w}x${h} (from $minX,$minY)"
}

Trim-Png "void-studios/public/assets/brand/logo-black.png"
Trim-Png "void-studios/public/assets/brand/logo-white.png"
