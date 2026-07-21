/* =====================================================================
   Static discourse-graph exhibits (COVID chain, snap-on, Request→Study
   spin-out, eggs missing-base, interop hub, WHO schematic).
   Ported from the legacy deck; each builder guards on element presence
   and injects its own arrow markers so it works on any page.
   Depends on window.MIRAsvg (mira.js).
   ===================================================================== */
(function(){
'use strict';
const {el,side,lcg,nodeBox,connect,creatorChip,scatterNode}=window.MIRAsvg;

function ensureMarkers(svg){
  if(svg.querySelector('defs[data-mira]')) return;
  const defs=el('defs',{'data-mira':'1'},null);
  svg.insertBefore(defs,svg.firstChild);
  const m1=el('marker',{id:'arrow2',viewBox:'0 0 10 10',refX:'8.5',refY:'5',markerWidth:'7',markerHeight:'7',orient:'auto-start-reverse'},defs);
  el('path',{d:'M0,0 L10,5 L0,10 z',fill:'#AAA59C'},m1);
  const m2=el('marker',{id:'arrowghost',viewBox:'0 0 10 10',refX:'8.5',refY:'5',markerWidth:'7',markerHeight:'7',orient:'auto-start-reverse'},defs);
  el('path',{d:'M0,0 L10,5 L0,10 z',fill:'#B7B1A8'},m2);
}

/* ---- COVID convergence graph ---- */
function buildCovid(){
  const svg=document.getElementById('covidgraph'); if(!svg) return; ensureMarkers(svg);
  const readers=['Worobey 2022','Stoyan & Chiu 2024','Judge Stansifer','Judge Van Treuren','Rootclaim'];
  const rn=[];
  readers.forEach((label,i)=>{ rn.push(nodeBox(svg,{x:18,y:26+i*74,w:168,h:46,type:'evidence',label,sub:'a reading',r:10})); });
  const ghostData=nodeBox(svg,{x:300,y:22,w:210,h:56,type:'entity',label:'released dataset',sub:'does not exist',dash:true,r:10});
  const who=scatterNode(svg,{x:322,y:146,w:172,h:132,title:'WHO Fig. 23',sub:'the only public depiction',seed:20260719,bg:'#F2F0EC'});
  const worobey=scatterNode(svg,{x:544,y:146,w:160,h:132,title:'Worobey Fig. 1A',sub:'155 of 164 points',seed:51,bg:'#EDEFF2'});
  const ghostLog=nodeBox(svg,{x:322,y:328,w:214,h:52,type:'study',label:'collection log & caveats',sub:'not released',dash:true,r:10});
  rn.forEach((R,i)=>{ connect(svg,R,who,{fs:['right',.5],ts:['left',(i+1)/(rn.length+1)],pred:i===2?'observationBase':'',cls:'base',bow:(i-2)*3,tip:'<code>Evidence → Entity</code> — the artifact this reading rests on. Every reader’s edge lands on the same one.'}); });
  connect(svg,ghostData,who,{fs:['bottom',.5],ts:['top',.5],pred:'stands in for',cls:'base',dash:true,tip:'The public depiction stands in for a released dataset that does not exist.'});
  connect(svg,who,worobey,{fs:['right',.5],ts:['left',.5],pred:'digitized',cls:'base',tip:'<code>Worobey Fig. 1A</code> is a digitization of the WHO depiction — a picture of a picture.'});
  connect(svg,who,ghostLog,{fs:['bottom',.4],ts:['top',.5],pred:'ascertainment log',cls:'ground',dash:true,tip:'Where the WHO team’s collection methods and caveats should sit — not released.'});
}

/* ---- Evidence node that carries its panel INSIDE it as the observationBase
        field (a slot of the node, not a free-floating edge) ---- */
function evidenceCard(svg,{x,y,w,h,label,sub,href,imgW,imgH,tip}){
  const grp=el('g',{class:'gnode gnode--evidence'},svg);
  const rect=el('rect',{x,y,width:w,height:h,rx:12},grp);
  rect.setAttribute('style','fill:var(--evidence-fill);stroke-width:2.4px');
  el('text',{x:x+w/2,y:y+22},grp).textContent=label;
  const s=el('text',{x:x+w/2,y:y+40,class:'nsub'},grp); s.textContent=sub;
  const fn=el('text',{x:x+14,y:y+61},grp); fn.textContent='observationBase';
  fn.setAttribute('style','fill:var(--evidence-ink);font-size:9.5px;font-weight:800;letter-spacing:.05em;text-anchor:start');
  const ix=x+(w-imgW)/2, iy=y+70;
  const fr=el('rect',{x:ix-3,y:iy-3,width:imgW+6,height:imgH+6,rx:6},grp);
  fr.setAttribute('style','fill:#fff;stroke:#4a444f;stroke-width:1.4px');
  const im=el('image',{x:ix,y:iy,width:imgW,height:imgH,preserveAspectRatio:'xMidYMid meet'},grp);
  im.setAttribute('href',href);
  if(tip) rect.dataset.tip=tip;
  return {x,y,w,h};
}

/* ---- snap-on graph (extensibility): new records carry their real data ---- */
function buildSnap(){
  const svg=document.getElementById('snapgraph'); if(!svg) return; ensureMarkers(svg);
  const q=nodeBox(svg,{x:24,y:56,w:148,h:44,type:'question',label:'Question',sub:'where did it begin?',r:10});
  const cOld=nodeBox(svg,{x:24,y:182,w:192,h:56,type:'claim',label:'Claim (contested)',sub:'the outbreak centered on the market',r:11});
  connect(svg,cOld,q,{fs:['top',.5],ts:['bottom',.5],pred:'addresses',cls:'addresses'});
  const cNew=nodeBox(svg,{x:250,y:44,w:232,h:50,type:'claim',label:'Claim · NEW',sub:'no pre-emergence selection signature',cls:'is-new',r:11});
  const card1=evidenceCard(svg,{x:250,y:150,w:224,h:224,label:'Evidence · Fig 5A–B',sub:'single ω purifying · ω ≪ 1',href:'assets/sarscov2-selection-tree.png',imgW:196,imgH:128,tip:'<code>observationBase</code> — the actual panel this Evidence rests on, held as a field of the node: the SARS-CoV-2 phylogeny and single-ω plot.'});
  const card2=evidenceCard(svg,{x:498,y:150,w:198,h:224,label:'Evidence · Fig 5C',sub:'no shift on stem · K = 1.1, n.s.',href:'assets/sarscov2-selection-k.png',imgW:76,imgH:140,tip:'<code>observationBase</code> — the RELAX selection-intensity panel held inline: K = 1.1 on the stem, no change.'});
  connect(svg,card1,cNew,{fs:['top',.5],ts:['bottom',.4],pred:'supports',cls:'supports'});
  connect(svg,card2,cNew,{fs:['top',.5],ts:['bottom',.72],pred:'',cls:'supports',bow:16});
  connect(svg,cNew,cOld,{fs:['left',.5],ts:['right',.4],pred:'informs',cls:'addresses',bow:-30,tip:'The new claim bears on the contested one — the graph re-weights without a rewrite.'});
}

/* ---- Request→Study spin-out loop ----
   Orthogonal ring: Request (top-left) and Study (top-right) across the top;
   Claim (bottom-left) and Evidence (bottom-right) across the bottom; every
   edge runs pure H or V so nothing reads as askew. The production spine runs
   the outer three sides (request_for → grounds → observationStatement); the
   request_target chord drops straight down the ring's left side; the Question
   hangs off the far left, and Evidence→Claim→Question sit colinear so the
   observation flowing in and the claim addressing the question read as one
   straight line. Creator chips sit ABOVE the top row, clear of every edge. */
function buildSpin(){
  const svg=document.getElementById('spingraph'); if(!svg) return; ensureMarkers(svg);
  const q  =nodeBox(svg,{x:16, y:192,w:130,h:52,type:'question',label:'Question',r:10});
  const req=nodeBox(svg,{x:196,y:40, w:164,h:52,type:'request',label:'Request',sub:'a dormant issue',r:10});
  const stu=nodeBox(svg,{x:476,y:40, w:164,h:52,type:'study',label:'Study',sub:'claimed 14 mo later',r:10});
  const evd=nodeBox(svg,{x:476,y:192,w:164,h:52,type:'evidence',label:'Evidence',sub:'a result — before the PI knew',r:10});
  const clm=nodeBox(svg,{x:196,y:192,w:164,h:52,type:'claim',label:'Claim',r:10});
  connect(svg,req,stu,{fs:['right',.5], ts:['left',.5], pred:'request_for',cls:'request',tip:'<code>Request → Study</code> — a newcomer claims the request; it spins out a study.'});
  connect(svg,stu,evd,{fs:['bottom',.5],ts:['top',.5],  pred:'grounds',cls:'ground',loff:[-54,0],tip:'<code>Study → Evidence</code> — the study produces a new result.'});
  connect(svg,evd,clm,{fs:['left',.5],  ts:['right',.5],pred:'observationStatement',cls:'obs',tip:'<code>Evidence → Claim</code> — the result speaks to a claim.'});
  connect(svg,req,clm,{fs:['bottom',.5],ts:['top',.5],  pred:'request_target',cls:'request',loff:[54,0],tip:'<code>Request → Claim</code> — the gap points at the claim it wants settled.'});
  connect(svg,clm,q,  {fs:['left',.5],  ts:['right',.5],pred:'addresses',cls:'addresses',tip:'<code>Claim → Question</code> — closing the loop back to the open question.'});
  creatorChip(svg,196,14,'asked by · a lab member',getComputedStyle(document.documentElement).getPropertyValue('--request-ink').trim()||'#26309A');
  creatorChip(svg,476,14,'claimed by · a newcomer',getComputedStyle(document.documentElement).getPropertyValue('--study-ink').trim()||'#1F5596');
}

/* ---- eggs: missing observationBase, answerable sub-questions, and one
        sub-question worked through into a specific Request + an
        unsubstantiated Claim (a proposed answer with no evidence yet) ---- */
function buildEggs(){
  const svg=document.getElementById('egggraph'); if(!svg) return; ensureMarkers(svg);
  const q=nodeBox(svg,{x:24,y:120,w:188,h:56,type:'question',label:'Are eggs healthy?',sub:'no observationBase',r:12});
  const subs=[{y:12,t:'…vs processed meat?'},{y:76,t:'…lower apoB, in whom?'},{y:140,t:'…reduce lifespan?'},{y:204,t:'…lower “biological age”?'}];
  const sn=subs.map(s=>nodeBox(svg,{x:248,y:s.y,w:186,h:46,type:'question',label:'sub-question',sub:s.t,r:11}));
  sn.forEach((S,i)=>connect(svg,q,S,{fs:['right',.5],ts:['left',.5],pred:i===1?'splits into':'',cls:'addresses',bow:(i-1.5)*8}));
  /* one sub-question worked through: a proposed answer with no evidence, plus the Request that would test it */
  const claim=nodeBox(svg,{x:492,y:120,w:200,h:50,type:'claim',label:'Claim · proposed',sub:'eggs slow biological aging',r:11});
  const ghostEv=nodeBox(svg,{x:512,y:196,w:150,h:40,type:'evidence',label:'supporting evidence',sub:'none yet',dash:true,r:9});
  const req=nodeBox(svg,{x:492,y:246,w:200,h:50,type:'request',label:'Request',sub:'longitudinal · biological age ± eggs',r:11});
  connect(svg,claim,sn[3],{fs:['left',.5],ts:['right',.4],pred:'addresses',cls:'addresses',tip:'The proposed answer to the biological-age sub-question.'});
  connect(svg,ghostEv,claim,{fs:['top',.5],ts:['bottom',.5],pred:'supports?',cls:'supports',dash:true,tip:'A proposed answer with no supporting evidence yet — an unsubstantiated Claim.'});
  connect(svg,req,ghostEv,{fs:['top',.5],ts:['bottom',.5],pred:'would supply',cls:'ground',dash:true,tip:'Running the Request produces the evidence the claim is missing.'});
  connect(svg,sn[3],req,{fs:['right',.6],ts:['left',.5],pred:'opens',cls:'request',tip:'<code>sub-question → Request</code> — an answerable sub-question names a specific study to run.'});
}

/* ---- WHO schematic (the pair, left) ---- */
function buildWhoSchem(){
  const svg=document.getElementById('who-schem'); if(!svg) return;
  el('rect',{x:0,y:0,width:300,height:300,rx:10,fill:'#EFEDE8'},svg);
  const rng=lcg(88);
  for(const d of ['M0,120 Q150,90 300,150','M0,210 Q140,190 300,230','M70,0 Q100,150 60,300','M210,0 Q180,160 250,300','M0,60 L300,40']){
    el('path',{d,fill:'none',stroke:'#FFFFFF','stroke-width':7,'stroke-linecap':'round','stroke-opacity':.9},svg);
  }
  el('path',{d:'M0,250 Q150,215 300,265 L300,300 L0,300 Z',fill:'#D9D6CF','fill-opacity':.6},svg);
  el('rect',{x:16,y:16,width:150,height:40,rx:5,fill:'#fff','stroke':'#DEDAD2'},svg);
  el('circle',{cx:28,cy:30,r:4,fill:'#E19A3C'},svg);
  el('circle',{cx:28,cy:45,r:4,fill:'#5E9EED'},svg);
  const l1=el('text',{x:38,y:30,'font-size':8,'font-weight':600,fill:'#4a444f','text-anchor':'start','dominant-baseline':'middle'},svg); l1.textContent='Linked to the market';
  const l2=el('text',{x:38,y:45,'font-size':8,'font-weight':600,fill:'#4a444f','text-anchor':'start','dominant-baseline':'middle'},svg); l2.textContent='No known link';
  const cxs=158, cys=176;
  for(let k=0;k<70;k++){ const ang=rng()*6.283, rad=Math.pow(rng(),0.62)*118; const px=cxs+Math.cos(ang)*rad*0.95, py=cys+Math.sin(ang)*rad*0.8; if(px<10||px>290||py<64||py>292) continue; const orange=rng()<0.27; el('circle',{cx:px,cy:py,r:2.6,fill:orange?'#E19A3C':'#5E9EED','fill-opacity':.9,stroke:'#fff','stroke-width':.6},svg); }
  el('rect',{x:cxs-5,y:cys-5,width:10,height:10,rx:2,fill:'#C0396B',stroke:'#fff','stroke-width':1.4},svg);
  const m=el('text',{x:cxs,y:cys+22,'font-size':8.5,'font-weight':700,fill:'#241F2B','text-anchor':'middle'},svg); m.textContent='Huanan market';
  m.setAttribute('paint-order','stroke'); m.setAttribute('stroke','#EFEDE8'); m.setAttribute('stroke-width','2.5');
  el('line',{x1:206,y1:280,x2:250,y2:280,stroke:'#241F2B','stroke-width':1.6},svg);
  const sc=el('text',{x:228,y:272,'font-size':7.5,'font-weight':600,fill:'#4a444f','text-anchor':'middle'},svg); sc.textContent='5 km';
}

/* ---- interop hub ---- */
function buildInterop(){
  const svg=document.getElementById('interopgraph'); if(!svg) return; ensureMarkers(svg);
  nodeBox(svg,{x:270,y:130,w:180,h:70,type:'source',label:'one shared graph',sub:'JSON-LD',r:14});
  const hub={x:270,y:130,w:180,h:70};
  const src=svg.querySelector('.gnode--source rect'); if(src) src.setAttribute('fill','#EFECE6');
  const auth=[['Roam',34],['Obsidian',108],['MyST',182]];
  const an=auth.map(([n,y])=>nodeBox(svg,{x:36,y,w:130,h:46,type:'claim',label:n,sub:'authoring',r:10}));
  an.forEach((A,i)=>connect(svg,A,hub,{fs:['right',.5],ts:['left',(i+1)/4],pred:i===1?'writes JSON-LD':'',cls:'addresses',bow:(i-1)*10}));
  const view=[['d3 viewer',34],['topology view',108],['narrative render',182]];
  const vn=view.map(([n,y])=>nodeBox(svg,{x:554,y,w:132,h:46,type:'study',label:n,sub:'viewer',r:10}));
  vn.forEach((V,i)=>connect(svg,hub,V,{fs:['right',(i+1)/4],ts:['left',.5],pred:i===1?'reads JSON-LD':'',cls:'ground',bow:(i-1)*10}));
  const g1=nodeBox(svg,{x:210,y:262,w:140,h:52,type:'evidence',label:'live: 210 nodes',sub:'language & health',r:11});
  const g2=nodeBox(svg,{x:372,y:262,w:140,h:52,type:'evidence',label:'live: 349 nodes',sub:'whitepaper graph',r:11});
  connect(svg,hub,g1,{fs:['bottom',.35],ts:['top',.5],pred:'',cls:'base',bow:0});
  connect(svg,hub,g2,{fs:['bottom',.65],ts:['top',.5],pred:'real instances',cls:'base',bow:0});
}

/* ---- workflow figure (run.html): tools as boxes, JSON-LD as the labelled
        edge, a closed loop — both tools ⇄ one KOI transport; the graph
        surfaces Requests → Study → new evidence re-enters. Self-contained
        (own box/edge helpers + markers); reuses MIRAsvg el/side. ---- */
function buildWorkflow(){
  const svg=document.getElementById('workflow'); if(!svg) return;
  const E=(tag,attrs,parent=svg)=>el(tag,attrs,parent);
  const defs=E('defs',{});
  const mkr=(id,fill)=>{ const m=E('marker',{id,viewBox:'0 0 10 10',refX:'8.5',refY:'5',markerWidth:'7',markerHeight:'7',orient:'auto-start-reverse'},defs); E('path',{d:'M0,0 L10,5 L0,10 z',fill},m); };
  mkr('wfArrow','#AAA59C'); mkr('wfArrowWire','#241F2B'); mkr('wfArrowGhost','#B7B1A8'); mkr('wfArrowWork','#ADB2EE');

  function box(cls,{x,y,w,h,name,sub,status,tag}){
    const g=E('g',{class:`box ${cls}`});
    E('rect',{x,y,width:w,height:h,rx:11},g);
    if(status){ E('circle',{cx:x+14,cy:y+14,r:4.2,class:'status',fill:status==='designed'?'var(--question)':'var(--claim)'},g); }
    if(tag){ const tg=E('text',{x:x+w/2,y:y+13,class:'ntag'},g); tg.textContent=tag; }
    const ty=sub?y+h*(tag?0.5:0.44):y+h/2+1;
    const t=E('text',{x:x+w/2,y:ty,class:'name','dominant-baseline':'middle'},g); t.textContent=name;
    if(sub){ const s=E('text',{x:x+w/2,y:y+h*0.76,class:'sub','dominant-baseline':'middle'},g); s.textContent=sub; }
    return {x,y,w,h};
  }
  function wedge(A,fromSide,B,toSide,o={}){
    const {label,wire,work,designed,both,fromT=.5,toT=.5,bow=0}=o;
    const a=side(A,fromSide,fromT), b=side(B,toSide,toT);
    const [x1,y1]=a,[x2,y2]=b;
    const cls=designed?'edge designed':work?'edge work':wire?'edge wire':'edge';
    const mk=designed?'url(#wfArrowGhost)':work?'url(#wfArrowWork)':wire?'url(#wfArrowWire)':'url(#wfArrow)';
    let d;
    if(bow){ const mx=(x1+x2)/2,my=(y1+y2)/2,dx=x2-x1,dy=y2-y1,len=Math.hypot(dx,dy)||1,nx=-dy/len,ny=dx/len;
      d=`M${x1},${y1} Q${mx+nx*bow},${my+ny*bow} ${x2},${y2}`; }
    else d=`M${x1},${y1} L${x2},${y2}`;
    const pa={class:cls,d,'marker-end':mk}; if(both) pa['marker-start']=mk; E('path',pa);
    if(label){
      let lx=(x1+x2)/2, ly=(y1+y2)/2;
      if(bow){ const dx=x2-x1,dy=y2-y1,len=Math.hypot(dx,dy)||1,nx=-dy/len,ny=dx/len; lx+=nx*bow*.52; ly+=ny*bow*.52; }
      if(wire){
        const pill=E('g',{});
        const txt=E('text',{x:lx,y:ly,class:'wirelabel','dominant-baseline':'middle'},pill); txt.textContent=label;
        requestAnimationFrame(()=>{ try{ const bb=txt.getBBox(),px=7,py=3.5;
          const r=E('rect',{x:bb.x-px,y:bb.y-py,width:bb.width+2*px,height:bb.height+2*py,rx:8,class:'wirepill'},pill);
          pill.insertBefore(r,txt);}catch(_){} });
      } else {
        const txt=E('text',{x:lx,y:ly-3,class:work?'elabel work':'elabel'}); txt.textContent=label;
      }
    }
  }

  [['SOURCE',96],['INGEST · AUTHOR',300],['TRANSPORT',553],['RENDER',832]].forEach(([t,x])=>{ const s=E('text',{x,y:24,class:'stage'}); s.textContent=t; });

  const CX=706, CY=84, CW=252, CH=252;
  E('rect',{x:CX,y:CY,width:CW,height:CH,rx:16,class:'container-bg'});
  const hd=E('text',{x:CX+CW/2,y:CY+22,class:'container-hd'}); hd.textContent='the shared graph — read many ways';

  const S1  = box('io-src', {x:22, y:84,  w:148,h:52, name:'Source PDF', sub:'a paper · a figure'});
  const EXT = box('tool',   {x:208,y:78,  w:178,h:64, name:'MIRA-extraction', sub:'AI-assisted MIRAfication', status:'shipped'});
  const S2  = box('io-src', {x:22, y:238, w:148,h:52, name:'MyST Markdown', sub:'authored in prose'});
  const MYST= box('tool',   {x:208,y:234, w:178,h:60, name:'myst-plus-mira', sub:'MyST → nodes parser', status:'shipped'});
  const KOI = box('tool',   {x:470,y:150, w:166,h:76, name:'KOI node', sub:'shared cross-org transport', status:'shipped'});

  box('io-view',{x:722,y:CY+36, w:220,h:44, name:'d3 viewer', sub:'traverse the graph'});
  box('io-view',{x:722,y:CY+86, w:220,h:44, name:'narrative render', sub:'prose is a rendering'});
  box('io-live',{x:722,y:CY+136,w:220,h:46, name:'live · 210 nodes', sub:'language & health'});
  box('io-live',{x:722,y:CY+188,w:220,h:46, name:'live · 349 nodes', sub:'whitepaper graph'});

  const FED = box('designed',{x:452,y:250,w:202,h:46, name:'federation across schemas', sub:'+ public ATProto layer'});

  wedge(S1,'right', EXT,'left', {label:'PDF'});
  wedge(S2,'right', MYST,'left',{label:'MyST'});
  wedge(EXT,'right', KOI,'left', {label:'.mira.jsonld', wire:true, toT:0.28, both:true});
  wedge(MYST,'right',KOI,'left', {label:'JSON-LD', wire:true, toT:0.72, both:true});
  wedge(KOI,'right', {x:CX,y:CY,w:0,h:CH},'left', {label:'JSON-LD', wire:true, toT:(188-CY)/CH});
  wedge(KOI,'bottom',FED,'top', {label:'designed', designed:true});
  const rw=E('text',{x:428,y:192,class:'rwlabel'}); rw.textContent='read ↔ write';
  const rw2=E('text',{x:428,y:203,class:'rwlabel'}); rw2.setAttribute('style','font-weight:600;fill:var(--muted);font-size:8px'); rw2.textContent='the same shared node';

  const REQ = box('req',{x:520,y:432,w:172,h:56, name:'Request', sub:'a newcomer picks it up', tag:'open unit of work'});
  const STU = box('stu',{x:250,y:432,w:172,h:56, name:'Study', sub:'runs it → new Evidence', tag:'answers the request'});
  wedge({x:CX,y:CY,w:CW,h:CH},'bottom', REQ,'top', {label:'surfaces a gap', work:true, fromT:0.46, toT:0.62, bow:-44});
  wedge(REQ,'left', STU,'right', {label:'request_for', work:true, bow:-26});
  wedge(STU,'top', S2,'bottom', {label:'new Evidence → re-enters', work:true, fromT:0.42, toT:0.5, bow:-58});

  const ln=E('text',{x:512,y:382,class:'loopnote'}); ln.textContent='the graph opens its own next questions';
  const lc=E('text',{x:512,y:400,class:'loopcap'}); lc.textContent='research compounds — the loop closes';

  const BX=20,BY=512,BW=940,BH=42;
  E('rect',{x:BX,y:BY,width:BW,height:BH,rx:10,class:'schemaband'});
  E('rect',{x:BX,y:BY,width:6,height:BH,rx:3,class:'schema-accent'});
  const sn=E('text',{x:BX+BW/2,y:BY+17,class:'schema-name'}); sn.textContent='schema  ·  mira.yaml → SHACL';
  const ss=E('text',{x:BX+BW/2,y:BY+32,class:'schema-sub'}); ss.textContent='one grammar under the whole loop — every record validates against it, conformance is machine-checkable';
}

document.addEventListener('DOMContentLoaded',()=>{
  try{ buildCovid(); buildWhoSchem(); buildSnap(); buildSpin(); buildEggs(); buildInterop(); buildWorkflow(); }
  catch(err){ console.error('graphs build',err); }
});
})();
