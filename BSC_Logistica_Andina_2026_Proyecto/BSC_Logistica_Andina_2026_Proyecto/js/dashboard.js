/* ===== Render e interacción del dashboard ===== */
const $=id=>document.getElementById(id);
const f=n=>(+n).toLocaleString("es-PE",{maximumFractionDigits:2});
const si=p=>p>=90?0:p>=70?1:2;
const CL=["var(--ok)","var(--wa)","var(--cr)"],SN=["Logrado","En riesgo","Crítico"];
const S={per:-1,rg:-1,st:-1,k:0};
let DATA=null,SC=[];

async function loadData(){
  const r=await fetch("data/bsc_data.json");
  DATA=await r.json();
  initDashboard();
}
const pct=(d,rg)=>{ if(rg<0) return d[10]; const v=d[5+rg],m=d[4]; return Math.round((m<d[8]?m/v:v/m)*1000)/10; };
const val=(d,rg)=>rg<0?d[9]:d[5+rg];
const all=()=>DATA.kpis.map((d,i)=>({d,i,p:pct(d,S.rg),v:val(d,S.rg)})).filter(x=>S.per<0||x.d[0]==S.per);
const scope=()=>all().filter(x=>S.st<0||si(x.p)==S.st);
const row=()=>S.rg<0?DATA.promedios:DATA.matrizRegiones[S.rg];

function nav(){
  const it=(l,on,fn,bd,r)=>`<div class="nv ${on?"on":""}" onclick="${fn}"><span>${l}</span>${bd!=null?`<span class="bd ${r?"r":""}">${bd}</span>`:""}</div>`;
  $("#nav").innerHTML=`<div class="logo"><b>D</b>ASHBOARD</div><div class="sec">Perspectivas</div>`
   +it("▦ Dashboard",S.per<0,"S.per=-1;S.st=-1;go()")
   +DATA.perspectivas.map((p,j)=>it("◈ "+p,S.per==j,`S.per=${j};S.st=-1;go()`)).join("")
   +`<div class="sec">Estados</div>`+it("◎ Consolidado",S.rg<0,"S.rg=-1;go()")
   +DATA.regiones.map((r,i)=>it("⌖ "+r,S.rg==i,`S.rg=${i};go()`,DATA.kpis.filter(d=>pct(d,i)<70).length,1)).join("");
}
function pills(){ const st=[-1,0,1,2],lb=["Todos","Logrado","En riesgo","Crítico"];
  $("#pills").innerHTML=st.map((v,i)=>`<button class="pill ${S.st==v?"on":""}" onclick="S.st=${v};go()">${lb[i]}</button>`).join(""); }
function tiles(){ const a=scope(),n=a.length,c=[0,0,0]; a.forEach(x=>c[si(x.p)]++);
  const avg=n?Math.round(a.reduce((s,x)=>s+x.p,0)/n*10)/10:0;
  $("#tiles").innerHTML=`<div class="tile" onclick="S.k=-1;go()"><div class="n">${n}</div><small>KPIs visibles</small><div class="ic"><i class="fa-solid fa-list-check"></i></div></div>
  <div class="tile mid"><div class="n">${avg}%</div><small>Cumplimiento promedio</small><div class="ic"><i class="fa-solid fa-bullseye"></i></div></div>
  <div class="tile"><div class="n">${c[2]}</div><small>KPIs críticos</small><div class="ic" style="color:var(--cr)"><i class="fa-solid fa-triangle-exclamation"></i></div></div>`; }
const sm=p=>{let d="M"+p[0];for(let i=0;i<p.length-1;i++){const a=p[i-1]||p[i],b=p[i],c=p[i+1],e=p[i+2]||c;d+=`C${[b[0]+(c[0]-a[0])/6,b[1]+(c[1]-a[1])/6]} ${[c[0]-(e[0]-b[0])/6,c[1]-(e[1]-b[1])/6]} ${c}`}return d};
const Y=p=>185-(Math.min(Math.max(p,40),100)-40)/60*150;
function chart(){ SC=scope(); const n=SC.length;
  if(n<2){$("#ch").innerHTML='<div style="padding:50px;text-align:center;color:var(--mut)">No hay suficientes KPIs.</div>';return}
  const st=560/(n-1),X=j=>40+j*st,pts=SC.map((x,j)=>[X(j),Y(x.p)]),path=sm(pts);
  $("#ch").innerHTML=`<svg viewBox="0 0 620 215"><defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="#4f7cff"/><stop offset="1" stop-color="#9b6bff"/></linearGradient></defs>
  ${[50,70,90].map(v=>`<line x1="36" x2="610" y1="${Y(v)}" y2="${Y(v)}" stroke="${v==90?"#34d399":v==70?"#ff6b81":"#fff"}" stroke-opacity=".18" stroke-dasharray="3 5"/><text x="4" y="${Y(v)+3}" fill="#7d8bb0" font-size="9">${v}%</text>`).join("")}
  <path d="${path}" fill="none" stroke="url(#g)" stroke-width="3"/>
  ${SC.map((x,j)=>`<circle cx="${pts[j][0]}" cy="${pts[j][1]}" r="2.5" fill="${CL[si(x.p)]}"/><rect x="${pts[j][0]-st/2}" y="0" width="${st}" height="195" fill="transparent" style="cursor:pointer" onmouseover="pick(${x.i})" onclick="pick(${x.i})"/>`).join("")}
  <g id="mk"></g></svg>`; mk(); }
function mk(){ const j=SC.findIndex(x=>x.i==S.k); if(j<0||!$("#mk"))return;
  const n=SC.length,x=40+j*560/(n-1),y=Y(SC[j].p),bx=x>500?x-84:x+10;
  $("#mk").innerHTML=`<line x1="${x}" x2="${x}" y1="${y}" y2="195" stroke="#fff" stroke-opacity=".25"/><circle cx="${x}" cy="${y}" r="6" fill="#fff" stroke="#4f7cff" stroke-width="3"/><rect x="${bx}" y="${Math.max(y-18,2)}" width="76" height="32" rx="6" fill="#0c1430"/><text x="${bx+8}" y="${Math.max(y-18,2)+13}" fill="#7d8bb0" font-size="9">KPI-${String(S.k+1).padStart(2,"0")}</text><text x="${bx+8}" y="${Math.max(y-18,2)+26}" fill="#fff" font-size="12" font-weight="700">${SC[j].p}%</text>`; }
function ring(v,l){ const c=2*Math.PI*30,k=v>=90?"#34d399":v>=70?"#f5b942":"#ff6b81";
  return `<div><svg viewBox="0 0 80 80"><circle cx="40" cy="40" r="30" fill="none" stroke="rgba(255,255,255,.1)" stroke-width="7"/><circle cx="40" cy="40" r="30" fill="none" stroke="${k}" stroke-width="7" stroke-dasharray="${c*v/100} ${c}" transform="rotate(-90 40 40)"/><text x="40" y="45" text-anchor="middle" fill="#fff" font-size="16" font-weight="700">${v}%</text></svg><div>${l}</div></div>`; }
function rings(){ const r=row(); $("#rings").innerHTML=DATA.perspectivas.map((p,i)=>ring(Math.round(r[i]*10)/10,p)).join(""); }
function gauge(v){ const c=2*Math.PI*62,k=v>=90?"#34d399":v>=70?"#f5b942":"#ff6b81";
  $("#gauge").innerHTML=`<svg viewBox="0 0 180 150"><circle cx="90" cy="90" r="62" fill="none" stroke="rgba(255,255,255,.1)" stroke-width="12"/><circle cx="90" cy="90" r="62" fill="none" stroke="${k}" stroke-width="12" stroke-dasharray="${c*v/100} ${c}" transform="rotate(-90 90 90)"/><text x="90" y="96" text-anchor="middle" fill="#fff" font-size="30" font-weight="700">${v}%</text></svg>`; }
function detail(){ const d=DATA.kpis[S.k],p=pct(d,S.rg),v=val(d,S.rg),m=d[4];
  $("#dp").innerHTML=`<div class="lb">KPI seleccionado</div><div class="id">KPI-${String(S.k+1).padStart(2,"0")}</div>
  <div class="fl"><b>${d[2]}</b><div>${d[1]}</div></div>
  <div class="c2"><div class="fl"><div class="lb">Valor actual</div><div>${f(v)} ${d[3]}</div></div><div class="fl"><div class="lb">Meta</div><div>${f(m)} ${d[3]}</div></div></div>
  <div class="fl"><div class="lb">Cumplimiento</div><div class="rb s"><span>Progreso</span><span class="t"><i style="width:${Math.min(p,100)}%;background:${CL[si(p)]}"></i></span><b>${p}%</b></div>
  <div style="margin-top:8px"><span class="st" style="background:${CL[si(p)]}22;color:${CL[si(p)]}">${SN[si(p)]}</span></div></div>`; }
function pick(i){ S.k=i; go(); }
function go(){ $("#ttl").innerText=S.per<0?"TODAS LAS PERSPECTIVAS":DATA.perspectivas[S.per].toUpperCase();
  $("#sub").innerText=S.rg<0?" · Consolidado nacional":" · "+DATA.regiones[S.rg];
  nav(); pills(); tiles(); chart(); rings(); detail();
  $("#bn").innerText=DATA.kpis.filter(d=>pct(d,S.rg)<70).length; gauge(row()[4]); }
function initDashboard(){ checkSession(); go(); }
loadData();
