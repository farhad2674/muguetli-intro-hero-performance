# Element films

The homepage element chapters and the four matching collection pages use
`components/element-film.tsx`. Both English and Persian labels are supported.
Calligraphy has no supplied film and shows no player.

| Element | Supplied file | Public file | Duration |
| --- | --- | --- | --- |
| Fire | آتش.mov | /media/elements/fire.mp4 | 40.87 s |
| Earth | خاک.mov | /media/elements/earth.mp4 | 54.00 s |
| Water | آب.mp4 | /media/elements/water.mp4 | 92.30 s |
| Wind (homepage `air`) | باد.mp4 | /media/elements/wind.mp4 | 109.37 s |

Sources came from the user's Downloads directory. All are silent, square
848 × 848 H.264 films. The delivered MP4s use lossless stream copying and
faststart metadata placement. Compressed video stream SHA-256 hashes match
their sources; no frames were cropped, replaced, or re-encoded.

The idle page renders only a button. No video, source, poster, or media preload
is mounted until the button is activated. The requested film then opens in a
native dialog with playback controls. Closing pauses the film, clears its
source, releases the player, restores scrolling, and returns focus to the
button. The dialog is portaled to the body to isolate it from pinned-rail
layout and descendant heading styles.

Local verification: production build, targeted lint, desktop playback of all
four collection films, Persian mobile playback, homepage playback, zero film
requests before activation (including hover), Escape/close/reopen, focus
restoration, and no browser errors. These changes have not been deployed.
