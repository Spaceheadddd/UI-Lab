// =====================================================
// ☄️ CYAN COMET ORB — Tight Follow + Short Streak
// =====================================================

// 1) Minimal CSS overlay and hidden cursor
const css = `
  * { cursor: none !important; }
  html,body { margin:0; height:100%; background:#000; overflow:hidden; }
  #orbCanvas { position: fixed; inset: 0; pointer-events: none; z-index: 9999; }
`;
document.head.appendChild(Object.assign(document.createElement("style"), { textContent: css }));

// 2) Canvas & DPI setup
const canvas = document.createElement("canvas");
canvas.id = "orbCanvas";
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");
const DPR = Math.min(window.devicePixelRatio || 1, 2);
function resize(){ canvas.width = innerWidth * DPR; canvas.height = innerHeight * DPR; }
resize(); addEventListener("resize", resize);

// 3) Physics — follow closer
let tx = innerWidth/2, ty = innerHeight/2, x = tx, y = ty, vx = 0, vy = 0;
const stiff = 0.22;   // ↑ for closer/snappier follow
const damp  = 0.86;   // ↑ for smoother inertia
let pulse = 0.0;

// 4) Trail + particles
const trail = [];
const TRAIL_LENGTH = 20;  // ↓ = shorter streak
const particles = [];
const MAX_PARTICLES = 300;
const EMIT_RATE = 4;
const COLORS = [
  "rgba(200,255,255,1)",
  "rgba(150,220,255,0.9)",
  "rgba(80,180,255,0.6)"
];

// 5) Input
addEventListener("mousemove", e => { tx = e.clientX; ty = e.clientY; }, { passive:true });
addEventListener("touchmove", e => { const t=e.touches[0]; if(t){ tx=t.clientX; ty=t.clientY; } }, { passive:true });

// 6) Emitter
function emit(px, py){
  for(let i=0;i<EMIT_RATE;i++){
    const a = Math.random()*Math.PI*2;
    const s = Math.random()*0.9 + 0.3;
    const life = Math.random()*0.6 + 0.4; // shorter life → shorter streak
    particles.push({ x:px, y:py, vx:Math.cos(a)*s, vy:Math.sin(a)*s, life, maxLife:life,
      color:COLORS[(Math.random()*COLORS.length)|0] });
  }
  if(particles.length>MAX_PARTICLES) particles.splice(0, particles.length-MAX_PARTICLES);
}

// 7) Render loop
// 🔧 TRAIL FADE SPEED: raise alpha (e.g. 0.18–0.3) to make trails vanish faster
const CLEAR_ALPHA = 0.22;

// 🔧 ORB SIZE: edit these bases (pixels, scaled by DPR)
const r1Base = 32;  // inner core radius base  (was 55)
const r2Base = 70;  // outer halo radius base  (was 110)

function loop(){
  // physics
  const dx = tx - x, dy = ty - y;
  vx = vx*damp + dx*stiff;
  vy = vy*damp + dy*stiff;
  x += vx; y += vy;
  pulse += 0.05;

  // clear with transparency for smooth fade-out
  ctx.fillStyle = `rgba(0,0,0,${CLEAR_ALPHA})`;
  ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.globalCompositeOperation = "lighter";

  // ① Ribbon
  trail.unshift({x,y});
  if(trail.length>TRAIL_LENGTH) trail.pop();
  for(let i=0;i<trail.length;i++){
    const p = trail[i];
    const fade = 1 - i/trail.length;
    const cx = p.x*DPR, cy = p.y*DPR;
    const r = 80 * DPR * fade * 0.45; // width tapering along the tail
    const g = ctx.createRadialGradient(cx,cy,0,cx,cy,r);
    g.addColorStop(0, `rgba(150,230,255,${0.22*fade})`);
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2); ctx.fill();
  }

  // ② Particles
  emit(x,y);
  for(let i=particles.length-1;i>=0;i--){
    const p = particles[i];
    p.x += p.vx; p.y += p.vy;
    p.life -= 0.04; // faster decay
    if(p.life<=0){ particles.splice(i,1); continue; }
    const alpha = p.life/p.maxLife;
    const cx=p.x*DPR, cy=p.y*DPR;
    const r = 2.5*DPR*alpha;
    const grad = ctx.createRadialGradient(cx,cy,0,cx,cy,r*3);
    grad.addColorStop(0, p.color.replace("1)", `${alpha})`));
    grad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.arc(cx,cy,r*3,0,Math.PI*2); ctx.fill();
  }

  // ③ Core orb
  const cx = x*DPR, cy = y*DPR;
  const r1 = r1Base * DPR * (1 + Math.sin(pulse)*0.08); // 🔧 smaller core here
  const r2 = r2Base * DPR * (1 + Math.cos(pulse*0.4)*0.05); // 🔧 smaller halo here

  const g1 = ctx.createRadialGradient(cx,cy,0,cx,cy,r1);
  g1.addColorStop(0.0,"rgba(255,255,255,1)");
  g1.addColorStop(0.3,"rgba(190,245,255,0.95)");
  g1.addColorStop(0.7,"rgba(120,220,255,0.35)");
  g1.addColorStop(1.0,"rgba(0,0,0,0)");
  ctx.fillStyle = g1;
  ctx.beginPath(); ctx.arc(cx,cy,r1,0,Math.PI*2); ctx.fill();

  const g2 = ctx.createRadialGradient(cx,cy,0,cx,cy,r2);
  g2.addColorStop(0,"rgba(100,200,255,0.22)");
  g2.addColorStop(1,"rgba(0,0,0,0)");
  ctx.fillStyle = g2;
  ctx.beginPath(); ctx.arc(cx,cy,r2,0,Math.PI*2); ctx.fill();

  requestAnimationFrame(loop);
}
loop();