Add-Type -AssemblyName System.Drawing

$srcPath = "d:\21_goal_sheet\public\app-icon.jpg"
$img = [System.Drawing.Image]::FromFile($srcPath)

function Resize-And-Save($targetPath, $width, $height) {
    $bmp = New-Object System.Drawing.Bitmap $width, $height
    $graph = [System.Drawing.Graphics]::FromImage($bmp)
    $graph.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graph.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graph.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $graph.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $graph.DrawImage($img, 0, 0, $width, $height)
    $bmp.Save($targetPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $graph.Dispose()
    $bmp.Dispose()
    Write-Host "Created $targetPath ($width x $height)"
}

Resize-And-Save "d:\21_goal_sheet\public\icon-192.png" 192 192
Resize-And-Save "d:\21_goal_sheet\public\icon-512.png" 512 512
Resize-And-Save "d:\21_goal_sheet\public\icon-maskable-192.png" 192 192
Resize-And-Save "d:\21_goal_sheet\public\icon-maskable-512.png" 512 512
Resize-And-Save "d:\21_goal_sheet\public\apple-touch-icon.png" 180 180
Resize-And-Save "d:\21_goal_sheet\public\favicon-32x32.png" 32 32
Resize-And-Save "d:\21_goal_sheet\public\favicon.png" 64 64

$img.Dispose()
Write-Host "All icons generated successfully!"
