# One-off: convert the brand logo PNGs' flat backgrounds to real transparency.
# logo-black.png: black artwork on white -> alpha = 255 - luminance (white bg
#   becomes fully transparent, antialiased gray edges become soft black).
# logo-white.png: white artwork on black -> alpha = luminance (black bg becomes
#   fully transparent, edges become soft white).
# Pure GDI+ via System.Drawing with LockBits - no deps.
Add-Type -AssemblyName System.Drawing

$ErrorActionPreference = 'Stop'

function Convert-Png([string]$Path, [string]$Mode) {
  $src = [System.Drawing.Bitmap]::new($Path)
  # force 32bppArgb so we can write alpha
  $bmp = $src.Clone([System.Drawing.Rectangle]::new(0, 0, $src.Width, $src.Height),
                    [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $src.Dispose()

  $rect = [System.Drawing.Rectangle]::new(0, 0, $bmp.Width, $bmp.Height)
  $data = $bmp.LockBits($rect,
                        [System.Drawing.Imaging.ImageLockMode]::ReadWrite,
                        [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $bytes = [Math]::Abs($data.Stride) * $bmp.Height
  $buf = [byte[]]::new($bytes)
  [System.Runtime.InteropServices.Marshal]::Copy($data.Scan0, $buf, 0, $bytes)

  for ($i = 0; $i -lt $bytes; $i += 4) {
    $b = $buf[$i]; $g = $buf[$i + 1]; $r = $buf[$i + 2]
    # perceptual luminance (BGRA byte order)
    $lum = [int](0.299 * $r + 0.587 * $g + 0.114 * $b)
    if ($Mode -eq 'black-on-white') {
      $buf[$i] = 0; $buf[$i + 1] = 0; $buf[$i + 2] = 0
      $a = 255 - $lum
    } else {
      $buf[$i] = 255; $buf[$i + 1] = 255; $buf[$i + 2] = 255
      $a = $lum
    }
    $buf[$i + 3] = [byte][Math]::Min(255, [Math]::Max(0, $a))
  }

  [System.Runtime.InteropServices.Marshal]::Copy($buf, 0, $data.Scan0, $bytes)
  $bmp.UnlockBits($data)
  # GDI+ cannot overwrite a file it was cloned from - write to temp, then swap
  $tmp = "$Path.tmp.png"
  $bmp.Save($tmp, [System.Drawing.Imaging.ImageFormat]::Png)
  $bmp.Dispose()
  Move-Item -Force $tmp $Path
  "$([System.IO.Path]::GetFileName($Path)): background -> transparent ($Mode)"
}

Convert-Png "void-studios/public/assets/brand/logo-black.png" "black-on-white"
Convert-Png "void-studios/public/assets/brand/logo-white.png" "white-on-black"
