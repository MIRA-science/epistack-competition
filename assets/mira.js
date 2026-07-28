/* =====================================================================
   MIRA shared behaviours — loaded first on every page.
   1. Header menu (mobile toggle).
   2. Shared tooltip keyed on [data-tip] (forward/inverse glosses).
   3. SVG graph helpers used by graphs.js and walk.js.
   4. Protocol-FAQ behaviours (accordion expand-all + TOC scrollspy).
   ===================================================================== */
(function(){
'use strict';

/* ---------- 1. header menu toggle ---------- */
document.addEventListener('DOMContentLoaded',()=>{
  const btn=document.querySelector('.navtoggle');
  const nav=document.getElementById('sitenav');
  if(btn&&nav){
    btn.addEventListener('click',()=>{
      const open=nav.classList.toggle('is-open');
      btn.setAttribute('aria-expanded',open?'true':'false');
    });
    nav.addEventListener('click',e=>{ if(e.target.closest('a')) nav.classList.remove('is-open'); });
  }
});

/* ---------- 2. shared tooltip ---------- */
const tip=document.createElement('div');
tip.className='tip'; tip.setAttribute('role','tooltip'); tip.id='shared-tip';
document.addEventListener('DOMContentLoaded',()=>document.body.appendChild(tip));
let tipFor=null;
function showTip(el){
  if(tipFor===el||!el.dataset.tip) return; tipFor=el;
  tip.innerHTML=el.dataset.tip; tip.classList.add('is-on');
  el.setAttribute('aria-describedby','shared-tip');
  if(el.tagName==='BUTTON') el.setAttribute('aria-expanded','true');
  tip.style.left='0px'; tip.style.top='0px';
  const r=el.getBoundingClientRect(), t=tip.getBoundingClientRect(), pad=10;
  let left=r.left+r.width/2-t.width/2;
  left=Math.max(pad, Math.min(left, window.innerWidth-t.width-pad));
  const below=r.bottom+8;
  const top=(below+t.height>window.innerHeight-pad) ? r.top-t.height-8 : below;
  tip.style.left=left+'px'; tip.style.top=top+'px';
}
function hideTip(){
  if(!tipFor) return;
  tipFor.removeAttribute('aria-describedby');
  if(tipFor.tagName==='BUTTON') tipFor.setAttribute('aria-expanded','false');
  tipFor=null; tip.classList.remove('is-on');
}
document.addEventListener('pointerover',e=>{ const b=e.target.closest('[data-tip]'); if(b&&e.pointerType==='mouse') showTip(b); });
document.addEventListener('pointerout',e=>{ if(e.pointerType!=='mouse') return; const b=e.target.closest('[data-tip]'); if(b&&b===tipFor&&!b.contains(e.relatedTarget)) hideTip(); });
document.addEventListener('click',e=>{ const b=e.target.closest('[data-tip]'); if(b){ e.stopPropagation(); if(b!==tipFor) showTip(b); else if(e.pointerType!=='mouse') hideTip(); } else hideTip(); });
document.addEventListener('focusin',e=>{ const b=e.target.closest('[data-tip]'); if(b&&b.matches(':focus-visible')) showTip(b); else if(!b) hideTip(); });
document.addEventListener('keydown',e=>{ if(e.key==='Escape') hideTip(); });
window.addEventListener('scroll',hideTip,{passive:true});
window.addEventListener('resize',hideTip);
window.MIRA_hideTip=hideTip;

/* ---------- 3. SVG helpers (shared by graphs.js + walk.js) ---------- */
const SVGNS='http://www.w3.org/2000/svg';
function el(tag,attrs,parent){ const n=document.createElementNS(SVGNS,tag); for(const k in attrs) n.setAttribute(k,attrs[k]); if(parent) parent.appendChild(n); return n; }
function cx(n){return n.x+n.w/2} function cy(n){return n.y+n.h/2}
function side(n,s,t=0.5){
  if(s==='top')    return [n.x+n.w*t, n.y];
  if(s==='bottom') return [n.x+n.w*t, n.y+n.h];
  if(s==='left')   return [n.x, n.y+n.h*t];
  if(s==='right')  return [n.x+n.w, n.y+n.h*t];
  return [cx(n),cy(n)];
}
function pathD(a,b,bow){
  const [x1,y1]=a,[x2,y2]=b;
  if(!bow) return `M${x1},${y1} L${x2},${y2}`;
  const mx=(x1+x2)/2,my=(y1+y2)/2,dx=x2-x1,dy=y2-y1,len=Math.hypot(dx,dy)||1;
  const nx=-dy/len, ny=dx/len;
  return `M${x1},${y1} Q${mx+nx*bow},${my+ny*bow} ${x2},${y2}`;
}
function labelPt(a,b,bow){
  const [x1,y1]=a,[x2,y2]=b, mx=(x1+x2)/2,my=(y1+y2)/2;
  if(!bow) return [mx,my];
  const dx=x2-x1,dy=y2-y1,len=Math.hypot(dx,dy)||1, nx=-dy/len,ny=dx/len;
  return [mx+nx*bow*0.52, my+ny*bow*0.52];
}
function lcg(seed){ let s=seed>>>0; return ()=> (s=(s*1664525+1013904223)>>>0)/4294967296; }
function drawNode(g,n){
  const grp=el('g',{class:`gnode gnode--${n.type}`,'data-node':n.id},g);
  el('rect',{x:n.x,y:n.y,width:n.w,height:n.h,rx:9,class:''},grp);
  if(n.sub){
    el('text',{x:cx(n),y:n.y+n.h*0.38},grp).textContent=n.label;
    const s=el('text',{x:cx(n),y:n.y+n.h*0.72,class:'nsub'},grp); s.textContent=n.sub;
  } else {
    el('text',{x:cx(n),y:cy(n)},grp).textContent=n.label;
  }
  return grp;
}
function nodeBox(svg,{x,y,w,h,type,label,sub,cls='',dash=false,r=9}){
  const grp=el('g',{class:`gnode gnode--${type} is-on ${cls}`},svg);
  const rect=el('rect',{x,y,width:w,height:h,rx:r},grp);
  if(dash){ rect.setAttribute('fill','none'); rect.setAttribute('stroke','var(--muted)'); rect.setAttribute('stroke-dasharray','5 4'); rect.setAttribute('stroke-width','1.5'); }
  const N={x,y,w,h};
  if(sub){ const t=el('text',{x:x+w/2,y:y+h*0.4},grp); t.textContent=label; if(dash){t.setAttribute('fill','var(--muted)');t.setAttribute('font-style','italic');}
    const s=el('text',{x:x+w/2,y:y+h*0.72,class:'nsub'},grp); s.textContent=sub; if(dash) s.setAttribute('fill','var(--muted)'); }
  else { const t=el('text',{x:x+w/2,y:y+h/2},grp); t.textContent=label; if(dash){t.setAttribute('fill','var(--muted)');t.setAttribute('font-style','italic');} }
  return N;
}
function connect(svg,A,B,{fs=['right',.5],ts=['left',.5],pred='',cls='',bow=0,dash=false,marker='url(#arrow2)',tip:tipText='',loff=[0,0]}){
  const a=side(A,fs[0],fs[1]), b=side(B,ts[0],ts[1]);
  const grp=el('g',{class:`gedge gedge--${cls} is-on`},svg);
  const p=el('path',{class:'glink',d:pathD(a,b,bow),'marker-end':marker},grp);
  if(dash){ p.setAttribute('stroke-dasharray','5 4'); p.setAttribute('marker-end','url(#arrowghost)'); }
  if(pred){
    const [lx,ly]=labelPt(a,b,bow);
    const tx=el('text',{class:'elabel',x:lx+loff[0],y:ly-2+loff[1]},grp); tx.textContent=pred;
    if(tipText){ requestAnimationFrame(()=>{ try{ const bb=tx.getBBox(),pad=5; const r=el('rect',{class:'ehit',x:bb.x-pad,y:bb.y-pad,width:bb.width+2*pad,height:bb.height+2*pad},grp); r.dataset.tip=tipText; }catch(_){} }); }
  }
  return grp;
}
function creatorChip(svg,x,y,text,color){
  const grp=el('g',{},svg);
  const w=text.length*5.4+22;
  el('rect',{x,y,width:w,height:17,rx:8.5,fill:'#fff',stroke:color,'stroke-width':1.2},grp);
  el('circle',{cx:x+9,cy:y+8.5,r:4,fill:color},grp);
  const t=el('text',{x:x+16,y:y+8.5,class:'who-chip',fill:color,'text-anchor':'start','dominant-baseline':'middle'},grp); t.textContent=text;
  return grp;
}
function scatterNode(svg,{x,y,w,h,title,sub,seed,bg}){
  const grp=el('g',{class:'gnode gnode--entity is-on'},svg);
  el('rect',{x,y,width:w,height:h,rx:12},grp);
  const t=el('text',{x:x+w/2,y:y+16},grp); t.textContent=title;
  const ix=x+10, iy=y+26, iw=w-20, ih=h-52, cxs=ix+iw/2, cys=iy+ih/2;
  el('rect',{x:ix,y:iy,width:iw,height:ih,rx:6,fill:bg},grp);
  const rng=lcg(seed);
  for(let k=0;k<44;k++){ const ang=rng()*6.283, rad=Math.pow(rng(),0.7)*Math.min(iw,ih)*0.46; const px=cxs+Math.cos(ang)*rad, py=cys+Math.sin(ang)*rad*0.85; const orange=rng()<0.28; el('circle',{cx:px,cy:py,r:2,fill:orange?'#E19A3C':'#5E9EED','fill-opacity':.85},grp); }
  el('rect',{x:cxs-3.5,y:cys-3.5,width:7,height:7,rx:1.5,fill:'#C0396B'},grp);
  const s=el('text',{x:x+w/2,y:y+h-11,class:'nsub'},grp); s.textContent=sub;
  return {x,y,w,h};
}
/* expose to the other scripts */
window.MIRAsvg={el,cx,cy,side,pathD,labelPt,lcg,drawNode,nodeBox,connect,creatorChip,scatterNode,SVGNS};

/* ---------- 4. Protocol-FAQ behaviours ---------- */
document.addEventListener('DOMContentLoaded',()=>{
  const faq=document.querySelector('.faq-layout'); if(!faq) return;
  const items=[...faq.querySelectorAll('.qa')];

  /* expand / collapse all */
  const toggle=document.querySelector('.expandall');
  if(toggle){
    toggle.addEventListener('click',()=>{
      const anyClosed=items.some(d=>!d.open);
      items.forEach(d=>{ d.open=anyClosed; });
      toggle.textContent=anyClosed?'Collapse all':'Expand all';
    });
    faq.addEventListener('toggle',()=>{
      const anyClosed=items.some(d=>!d.open);
      toggle.textContent=anyClosed?'Expand all':'Collapse all';
    },true);
  }

  /* open the item a deep-link points at — ids are content-based; the old
     positional ids (q-c4 …) survive as data-legacy so shared links keep working */
  function openHash(){
    const id=location.hash.slice(1); if(!id) return;
    const t=document.getElementById(id)||faq.querySelector(`.qa[data-legacy="${CSS.escape(id)}"]`);
    if(t&&t.classList.contains('qa')){ t.open=true; t.querySelector('summary')?.focus({preventScroll:true}); t.scrollIntoView({block:'start'}); }
  }
  window.addEventListener('hashchange',openHash); openHash();

  /* TOC scrollspy over section headings */
  const links=[...document.querySelectorAll('.toc a[data-sec]')];
  const secs=links.map(a=>document.getElementById(a.dataset.sec)).filter(Boolean);
  if(secs.length&&'IntersectionObserver' in window){
    const spy=new IntersectionObserver(ents=>{
      ents.forEach(e=>{ if(e.isIntersecting){
        const id=e.target.id;
        links.forEach(a=>a.classList.toggle('active',a.dataset.sec===id));
      }});
    },{rootMargin:'-20% 0px -70% 0px',threshold:0});
    secs.forEach(s=>spy.observe(s));
  }
});
})();
