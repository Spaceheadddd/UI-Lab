# ☄️ Comet Orb Cursor

A lightweight, pure JavaScript comet-like cursor with a **ribbon trail**, **particle stream**, and a **pulsing orb** nucleus.

## Demo
Open `index.html` in your browser, or deploy via GitHub Pages.

## Usage
Include `comet.js` on any page:
```html
<script src="comet.js" defer></script>
```

## Customize (edit constants in `comet.js`)
```js
const stiff = 0.22;   // responsiveness (↑ = follows closer)
const damp  = 0.86;   // smoothness (↑ = more smoothing/inertia)

const TRAIL_LENGTH = 20;  // ribbon memory length
const EMIT_RATE    = 4;   // particles per frame
const r1Base = 32;        // core radius base (px, scaled by DPR)
const r2Base = 70;        // halo radius base (px, scaled by DPR)
```

- **Smaller orb:** lower `r1Base` and `r2Base`
- **Faster trail fade:** increase canvas clear alpha, e.g. `rgba(0,0,0,0.22)`
- **Shorter streak:** lower `TRAIL_LENGTH` and increase particle decay `p.life -= 0.04`

## License
MIT