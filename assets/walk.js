/* =====================================================================
   walk.html — the DNA double-helix teaching walkthrough.
   Lifted from the legacy deck's Tab 1 (PAGE-SPEC §4): a data-driven SVG
   graph built cumulatively across nine scenes, IntersectionObserver +
   keyboard/click nav, prefers-reduced-motion honoured.
   Depends on window.MIRAsvg (mira.js).
   ===================================================================== */
(function(){
'use strict';
const {el,cx,cy,side,pathD,labelPt,drawNode}=window.MIRAsvg;

/* ---- graph data (build this exact graph — PAGE-SPEC §4.1) ---- */
const T1N = {
  Q1:{id:'Q1',type:'question',x:164,y:12,w:92,h:34,label:'Question',appear:1},
  C1:{id:'C1',type:'claim',x:50,y:86,w:118,h:42,label:'Claim',sub:'double helix',appear:2},
  C2:{id:'C2',type:'claim',x:252,y:86,w:118,h:42,label:'Claim',sub:'triple helix',appear:2},
  E1:{id:'E1',type:'evidence',x:150,y:166,w:128,h:134,label:'Evidence',appear:3},
  D1:{id:'D1',type:'source',x:300,y:182,w:122,h:40,label:'SourceDocument',appear:5},
  R1:{id:'R1',type:'request',x:300,y:268,w:122,h:40,label:'Request',appear:6},
  A1:{id:'A1',type:'entity',x:162,y:222,w:104,h:68,label:'entity',appear:4},
  S1:{id:'S1',type:'study',x:8,y:182,w:120,h:40,label:'Study',appear:5},
  P1:{id:'P1',type:'protocol',x:8,y:256,w:120,h:40,label:'Protocol',appear:5}
};
const T1E = [
  {from:'C1',to:'Q1',fs:['top',.6],ts:['bottom',.32],pred:'addresses',cls:'addresses',appear:2,bow:0},
  {from:'C2',to:'Q1',fs:['top',.4],ts:['bottom',.68],pred:'addresses',cls:'addresses',appear:2,bow:0},
  {from:'E1',to:'C1',fs:['top',.22],ts:['bottom',.5],pred:'supports',cls:'supports',appear:3,bow:-16},
  {from:'E1',to:'C2',fs:['top',.78],ts:['bottom',.5],pred:'opposes',cls:'opposes',appear:3,bow:16},
  {from:'E1',to:'S1',fs:['left',.32],ts:['right',.35],pred:'is_grounded_in',cls:'ground',appear:5,bow:-9,lx:139,ly:172},
  {from:'S1',to:'E1',fs:['right',.74],ts:['left',.74],pred:'grounds',cls:'ground',appear:5,bow:-9,lx:141,ly:244},
  {from:'E1',to:'D1',fs:['right',.3],ts:['left',.5],pred:'sourceDocument',cls:'source',appear:5,bow:0,lx:289,ly:196},
  {from:'S1',to:'P1',fs:['bottom',.5],ts:['top',.5],pred:'follows',cls:'follows',appear:5,bow:0,lx:99,ly:242},
  {from:'R1',to:'C1',fs:['left',.5],ts:['right',.82],pred:'request_target',cls:'request',appear:6,bow:66,lx:246,ly:248}
];
const T1_EDGE_TIP={
  addresses:'<code>Claim → Question</code> — proposes an answer to this open question.',
  supports:'<code>Evidence → Claim</code> — this observation backs the claim. Evidence is an Argument.',
  opposes:'<code>Evidence → Claim</code> — the same observation counts against a different claim.',
  is_grounded_in:'<code>Evidence → Study</code> — the experiment behind this observation.',
  grounds:'<code>Study → Evidence</code> — the same link read from the study’s end: the evidence it produced.',
  sourceDocument:'<code>Evidence → SourceDocument</code> — the paper that reported this observation.',
  follows:'<code>Study → Protocol</code> — one run of a reusable recipe.',
  request_target:'<code>Request → Claim</code> — the claim this request wants settled.'
};
/* ---- node-type tips (hover any node box) ---- */
const T1_NODE_TIP={
  question:'<code>Question</code> — a scientific unknown, addressable by research methods. The durable target a field’s claims hang off.',
  claim:'<code>Claim</code> — an atomic, generalized assertion that proposes to answer a question. It can be wrong and still belong.',
  evidence:'<code>Evidence</code> — one empirical observation from one method. Its fields place it: the reading, the artifact it rests on, the study, the paper.',
  entity:'<code>observationBase</code> — the artifact itself: figure, blot or dataset. A pointer, never a payload — and it lives <i>inside</i> the Evidence that rests on it.',
  study:'<code>Study</code> — the activity, an experiment or analysis, that produced the evidence.',
  protocol:'<code>Protocol</code> — the reusable method a study follows. A recipe, written once.',
  source:'<code>SourceDocument</code> — the paper, book or preprint that reported the observation.',
  request:'<code>Request</code> — a unit of work the community can pick up. Issue-tracker-shaped.'
};

function buildT1Graph(){
  const eg=document.getElementById('t1edges');
  const ng=document.getElementById('t1nodes');
  const ag=document.getElementById('t1anno');
  for(const e of T1E){
    const A=T1N[e.from], B=T1N[e.to];
    const a=side(A,e.fs[0],e.fs[1]), b=side(B,e.ts[0],e.ts[1]);
    const grp=el('g',{class:`gedge gedge--${e.cls}`,'data-appear':e.appear},eg);
    el('path',{class:'glink',d:pathD(a,b,e.bow),'marker-end':'url(#arrow)'},grp);
    let lx,ly; if(e.lx!==undefined){ lx=e.lx; ly=e.ly; } else { [lx,ly]=labelPt(a,b,e.bow); }
    const tx=el('text',{class:'elabel',x:lx,y:ly-2},grp); tx.textContent=e.pred;
    grp._tip=T1_EDGE_TIP[e.pred]; grp._lbl=tx;
  }
  for(const id in T1N){
    const n=T1N[id];
    if(n.type==='entity'){
      // the artifact, nested inside its Evidence as the value of observationBase — neutral white frame, dark schematic, never red
      const grp=el('g',{class:'gnode gnode--entity','data-node':id},ng);
      grp.dataset.tip=T1_NODE_TIP.entity;
      const fr=el('rect',{x:n.x,y:n.y,width:n.w,height:n.h,rx:6,class:'frame'},grp);
      fr.setAttribute('style','fill:#fff;stroke:#4a444f;stroke-width:1.4px');
      const cxp=n.x+n.w/2, cyp=n.y+n.h*0.4;
      const gl=el('g',{transform:`translate(${cxp} ${cyp})`,fill:'#3a343f'},grp);
      for(const rot of [45,-45]){
        const rg=el('g',{transform:`rotate(${rot})`},gl);
        for(const d of [-16,-9,9,16]){ el('ellipse',{cx:0,cy:d,rx:(7-Math.abs(d)/3),ry:2.6,opacity:(1-Math.abs(d)/28)},rg); }
      }
      el('circle',{cx:0,cy:0,r:1.8},gl);
      const t=el('text',{x:cxp,y:n.y+n.h-8,fill:'#4a444f','font-size':'8.5','font-weight':'700','text-anchor':'middle'},grp); t.textContent='Photograph 51';
    } else if(id==='E1'){
      // Evidence is a card: header · the reading (its observationStatement, a title) · the observationBase field-label · then the artifact nested below
      const grp=el('g',{class:'gnode gnode--evidence','data-node':id},ng);
      grp.dataset.tip=T1_NODE_TIP.evidence;
      const rect=el('rect',{x:n.x,y:n.y,width:n.w,height:n.h,rx:12},grp);
      rect.setAttribute('style','fill:var(--evidence-fill);stroke-width:2.4px');
      el('text',{x:n.x+n.w/2,y:n.y+18},grp).textContent='Evidence';
      const rd=el('text',{x:n.x+n.w/2,y:n.y+33,class:'nsub'},grp); rd.textContent='reads as a helix';
      const ob=el('text',{x:n.x+12,y:n.y+52},grp); ob.setAttribute('style','fill:var(--evidence-ink);font-size:8.5px;font-weight:800;letter-spacing:.03em;text-anchor:start'); ob.textContent='observationBase';
    } else {
      const g=drawNode(ng,n);
      g.dataset.tip=T1_NODE_TIP[n.type];
    }
  }
  const rb=el('g',{class:'badge refuted'},ag);
  el('rect',{x:T1N.C2.x+T1N.C2.w-58,y:T1N.C2.y-11,width:58,height:16,rx:8},rb);
  el('text',{x:T1N.C2.x+T1N.C2.w-29,y:T1N.C2.y-2.5},rb).textContent='✕ refuted';
  const sb=el('g',{class:'badge supported'},ag);
  el('rect',{x:T1N.C1.x,y:T1N.C1.y-11,width:66,height:16,rx:8},sb);
  el('text',{x:T1N.C1.x+33,y:T1N.C1.y-2.5},sb).textContent='✓ supported';
  const so=el('g',{class:'spinout'},ag);
  el('path',{class:'glink',d:`M${T1N.R1.x+T1N.R1.w/2},${T1N.R1.y+T1N.R1.h} q0,26 -34,30`},so);
  el('rect',{x:T1N.R1.x+8,y:T1N.R1.y+T1N.R1.h+26,width:86,height:26,rx:8,fill:'var(--study-fill)',stroke:'var(--study)','stroke-width':'1.6','stroke-dasharray':'4 3'},so);
  el('text',{x:T1N.R1.x+8+43,y:T1N.R1.y+T1N.R1.h+26+14,'text-anchor':'middle','font-size':'9.5','fill':'var(--study-ink)','font-weight':'700'},so).textContent='→ a new Study';
  el('text',{x:T1N.R1.x-2,y:T1N.R1.y+T1N.R1.h+20,'text-anchor':'end','font-size':'8','fill':'var(--request-ink)','font-weight':'700'},so).textContent='request_for';
  requestAnimationFrame(()=>{
    for(const grp of eg.querySelectorAll('.gedge')){
      const lbl=grp.querySelector('.elabel'); if(!lbl||!grp._tip) continue;
      let bb; try{ bb=lbl.getBBox(); }catch(_){ continue; }
      const pad=6, r=el('rect',{class:'ehit',x:bb.x-pad,y:bb.y-pad,width:bb.width+2*pad,height:bb.height+2*pad},grp);
      r.dataset.tip=grp._tip;
    }
  });
}

/* ---- shared fields block ---- */
const FIELD_GROUPS=[
  ['identity',[['title','A short name for the record — what you’d see in a list.'],['content','The record’s own text: the claim as written, the note as typed.'],['format','What kind of text <code>content</code> is — plain, Markdown, HTML.']]],
  ['provenance',[['creator','Who posted it — a person, a group, or a piece of software. A record can name several.'],['created','When the record was first posted.'],['modified','When it last changed. Records are revised, not overwritten in silence.']]],
  ['context',[['description','The longer account around the record: an abstract, a summary, free notes.'],['has_container','The collection this record belongs to — a lab’s space, a project, a notebook.']]]
];
const FIELDS=`<div class="fields">
  <p class="fields-h"><span>The eight fields, on every node</span>
    <span class="src"><span class="h-hover">hover a name</span><span class="h-tap">tap a name</span></span></p>
  ${FIELD_GROUPS.map(([g,fs])=>`<p class="frow"><b>${g}</b><span class="fs">${
    fs.map(([n,d])=>`<button class="f" type="button" aria-expanded="false" data-tip="${d}">${n}</button>`).join('<span aria-hidden="true"> · </span>')}</span></p>`).join('')}
</div>`;

const TIP_FWD={
  addresses:'The open question this claim proposes to answer.',
  observationStatement:'The claim this observation speaks to — what it is evidence <i>of</i>. A reading, attributed.',
  observationBase:'The artifact itself — figure, blot, dataset — kept as a pointer, never a payload.',
  observationOriginActivity:'The experiment or analysis that produced this observation.',
  sourceDocument:'The paper that reported this observation.',
  follows:'The reusable recipe this study ran.',
  grounds:'The evidence this study produced.',
  request_for:'The study this request wants someone to run.',
  request_target:'The claim this request wants settled.',
  supports:'The claim this argument backs. Evidence and Claim can both take a side.',
  opposes:'The claim this argument counts against.'
};
const TIP_INV={
  addressedBy:'The claims proposing answers here — <code>addresses</code>, read from the question’s end.',
  supportedBy:'Arguments in favour — <code>supports</code>, read from the claim’s end.',
  opposedBy:'Arguments against — <code>opposes</code>, read from the claim’s end.',
  is_grounded_in:'The study behind this evidence — <code>grounds</code>, read from the other end.',
  follows:'The studies that have run this recipe — <code>follows</code>, read from the study’s end.'
};
function pills(list,inv){
  return `<div class="attrs">${list.map(r=>{
    const t=(inv?TIP_INV:TIP_FWD)[r.s];
    return `<button type="button" class="pill${inv?' inv':''}"${t?` data-tip="${t}" aria-expanded="false"`:''}>`+
      `${r.s}${r.many?`<span class="many">many</span>`:''}`+
      `<span class="ar">${inv?'←':'→'}</span><span class="tg">${r.t}</span></button>`;}).join('')}</div>`;
}
const ARTIFACT=`<svg class="artifact" width="58" height="58" viewBox="0 0 62 62" aria-hidden="true">
  <rect width="62" height="62" rx="8" fill="#181821"/>
  <g fill="#efeede" opacity=".9">
    <g transform="translate(31 31) rotate(45)">${[-20,-12,12,20].map(d=>`<ellipse cx="0" cy="${d}" rx="${9-Math.abs(d)/3}" ry="3.4" opacity="${1-Math.abs(d)/34}"/>`).join('')}</g>
    <g transform="translate(31 31) rotate(-45)">${[-20,-12,12,20].map(d=>`<ellipse cx="0" cy="${d}" rx="${9-Math.abs(d)/3}" ry="3.4" opacity="${1-Math.abs(d)/34}"/>`).join('')}</g>
    <circle cx="31" cy="31" r="2.2"/>
  </g></svg>`;

const SCENES=[
  {key:'hook',accent:'ink',g:0,type:'hero',
   kicker:'MIRA · walk one result through',
   hero:'A result isn’t a PDF.<br>It’s a graph.',
   lede:'A finding usually ships as a sealed document. MIRA turns it into a handful of signed, citable records — the question asked, the claim that answers it, and the evidence behind it, anchored on the actual data. We’ll build one of the most famous results in science a record at a time: <b>the discovery of DNA’s structure.</b>',
   hint:'Scroll, or tap the right edge'},
  {key:'overview',accent:'ink',g:0,type:'hero',
   kicker:'The whole picture',
   hero:'Seven node types.<br>Each one a record<br>of fields.',
   lede:'Every node carries the same shared fields, so what makes a type a type is <b>the few slots it adds</b> — some holding a value, some referencing another node. Keeping the layers apart is what lets you ask <i>which</i> layer a problem is in — is the claim contested, the evidence un-reproduced, or the figure itself unsound? Once it’s a graph, you can ask which claims are supported, which are contested, and which questions still have no answer. Each slot explains itself — <span class="h-hover">hover it</span><span class="h-tap">tap it</span>.',
   fields:true, hint:'Meet them one by one'},
  {key:'question',accent:'question',g:1,type:'node',
   kicker:'Question',also:'research goal · research unknown',
   def:'A scientific unknown we want to make known — addressable by the systematic application of research methods.',
   ex:{tag:'In the DNA story',lead:'What is the three-dimensional structure of DNA?',note:'Why it matters: the mechanism of genetic inheritance turns on the answer.'},
   why:'Questions are the spine of a field. Pin one down and every claim, supported or contested, hangs off a shared, durable target — so you can spot the questions that still have <b>no</b> answer.',
   slots:[],inv:[{s:'addressedBy',t:'Claim',many:true}]},
  {key:'claim',accent:'claim',g:2,type:'node',
   kicker:'Claim',also:'hypothesis',
   def:'An atomic, generalized assertion about the world that (proposes to) answer a research question.',
   ex:{tag:'In the DNA story',lead:'DNA forms a double helix.',note:'Watson &amp; Crick, <i>Nature</i>, 25 April 1953 — correct. Its rival stays in the graph: Pauling &amp; Corey’s <b>triple helix</b> (1953), phosphates on the inside — famously <b>wrong</b>.'},
   why:'A claim can be wrong, and MIRA keeps it anyway. The claim is a stable thing to argue <i>about</i>; evidence then supports or opposes it. Being contested is data, not deletion.',
   slots:[{s:'addresses',t:'Question',many:true}],
   inv:[{s:'supportedBy',t:'Argument',many:true},{s:'opposedBy',t:'Argument',many:true}],
   note:'An <b>Argument</b> is anything that can take a side — a Claim or a piece of Evidence. <code>supports</code> and <code>opposes</code> are the pair that make a graph <i>argue</i> rather than merely cite.'},
  {key:'evidence',accent:'evidence',g:3,type:'node',
   kicker:'Evidence',also:'result · observation',
   def:'A specific empirical observation from a particular application of a research method.',
   ex:{tag:'In the DNA story',artifact:true,lead:'Photograph 51 shows an X-shaped diffraction pattern — a helix, ~3.4 nm repeat, ~2 nm wide.',note:'That sentence is a <b>reading</b> of the image — Franklin &amp; Gosling’s, attributed. It <b>supports</b> the double helix and <b>opposes</b> the triple.'},
   why:'Evidence is one observation, not a verdict. It points four ways at once — to the claim it speaks to, the actual figure, the experiment that made it, and the paper that reported it. That’s what lets you trace a claim down to the literal pixels.',
   slots:[{s:'observationStatement',t:'Claim'},{s:'observationBase',t:'Entity'},{s:'observationOriginActivity',t:'Activity'},{s:'sourceDocument',t:'SourceDocument'}],
   inv:[{s:'is_grounded_in',t:'Study'}],
   note:'<code>observationStatement</code> is a reading, not a fact — which is why the <i>same</i> artifact can support one claim and oppose another.'},
  {key:'artifact',accent:'ink',g:4,type:'node',
   kicker:'Entity',also:'the observationBase · the actual data',
   def:'The artifact itself — the figure, blot or dataset an observation stands on. Held as a pointer, never a payload.',
   ex:{tag:'In the DNA story',artifact:true,lead:'Photograph 51 — the diffraction image.',note:'Stylized here; the real scan lives behind a URL on <code>observationBase</code> (King’s College London holds the copyright). An 80-GB stack would stay where it lives — the record keeps its address.'},
   why:'This is the thing the claim stands or falls on — and it isn’t a seventh node type. It’s the <i>value</i> of the Evidence’s <code>observationBase</code> field, so it lives <b>inside</b> the Evidence that rests on it. Keep it individually addressable and several Evidence records can name the same artifact — which is how this one image <b>supports</b> the double helix and <b>opposes</b> the triple, indexed to the figure, not the paper.',
   slots:[],inv:[{s:'observationBase',t:'Evidence',many:true}],
   note:'Because <code>observationBase</code> is a field of Evidence — not a free-floating node — the artifact is drawn <i>inside</i> the Evidence box, never on an edge. Indexing evidence by its artifact rather than by the paper that cites it is the whole move.'},
  {key:'study',accent:'study',g:5,type:'node',
   kicker:'Study → Protocol → SourceDocument',also:'the experiment, its method, its paper',
   def:'A Study is the activity that produced the evidence; a Protocol is the reusable method it followed; a SourceDocument is the paper that reported it.',
   ex:{tag:'In the DNA story',lead:'X-ray fibre diffraction of B-form DNA — Franklin &amp; Gosling, King’s College London, 1952.',note:'The Protocol: hydrated-fibre prep + humidity-controlled X-ray diffraction — a recipe, written once. The SourceDocument: their 25 April 1953 <i>Nature</i> paper.'},
   why:'The Study is the <i>event</i>; the Protocol is the <i>recipe</i>. Splitting them lets two labs run the same method and be compared — and lets you tell a flawed result apart from a flawed method.',
   slots:[{s:'follows',t:'Protocol',many:true},{s:'grounds',t:'Evidence',many:true}],
   inv:[{s:'is_grounded_in',t:'Evidence',many:true}],
   note:'<code>grounds</code> and <code>is_grounded_in</code> are one link read two ways — Study→Evidence, and Evidence→Study. Reading an edge from either end is free.'},
  {key:'request',accent:'request',g:6,type:'node',
   kicker:'Request',also:'need · issue · idea',
   def:'A unit of work the community can pick up — issue-tracker-shaped.',
   ex:{tag:'In the DNA story',lead:'A cleaner, higher-resolution run to pin the helix parameters.',note:'Unclaimed — it sits in the graph until someone picks it up, pointing at the claim it wants settled.'},
   why:'The graph also holds what <i>hasn’t</i> been done. A Request points at the Study it wants or the Claim it wants settled — so stalled work and open asks are first-class, not lost in a hallway. It’s the node the cases turn into the whole argument.',
   slots:[{s:'request_for',t:'Study',many:true},{s:'request_target',t:'Claim',many:true}],inv:[]},
  {key:'payoff',accent:'ink',g:7,type:'hero',
   kicker:'Why it’s a graph',
   hero:'Now query<br>the whole field.',
   lede:'Every record is signed, dated and linked. The triple helix was wrong — and the graph shows exactly how one artifact overturned it: <b>supported</b> the double helix, <b>opposed</b> the triple. A claimed Request would spin out into a new Study, closing the loop. That was the easy case, where everyone agrees.',
   bridge:'Now watch it on two questions where they don’t.'}
];

function renderCard(s){
  if(s.type==='hero'){
    return `<article class="card">
      <p class="eyebrow">${s.kicker}</p>
      <h1 class="hero">${s.hero}</h1>
      <p class="lede">${s.lede}</p>
      ${s.fields?FIELDS:''}
      ${s.bridge?`<a class="bridge" href="cases.html"><span>${s.bridge}</span><span class="ar">The two cases →</span></a>
        <a class="bridge alt" href="protocol-faq.html"><span>Or ask the protocol questions directly</span><span class="ar">Protocol FAQ →</span></a>`:''}
      ${s.hint?`<button class="hint" type="button" style="background:none;border:0;padding:0;font-family:inherit;cursor:pointer;text-align:left"><span class="k">↓</span> ${s.hint}</button>`:''}
    </article>`;
  }
  const ex=s.ex;
  const exHtml=`<div class="ex"><div class="tag">${ex.tag}</div><div class="row">${ex.artifact?ARTIFACT:''}<div><div class="lead">${ex.lead}</div>${ex.note?`<div class="note">${ex.note}</div>`:''}</div></div></div>`;
  return `<article class="card">
    <p class="eyebrow">${s.kicker}${s.also?`<span class="also">${s.also}</span>`:''}</p>
    <h2 class="def">${s.def}</h2>
    ${exHtml}
    <p class="why labelled">${s.why}</p>
    <div class="rel">
      <p class="rel-label"><span class="on">${s.kicker.split(' ')[0]}</span>’s slots</p>
      ${s.slots.length?pills(s.slots,false):`<p class="none">No type-specific slots — other nodes reference it.</p>`}
      ${s.inv.length?`<p class="rel-sub">Referenced by</p>${pills(s.inv,true)}`:''}
      ${s.note?`<p class="snote">${s.note}</p>`:''}
    </div>
  </article>`;
}

document.addEventListener('DOMContentLoaded',()=>{
  const stepsEl=document.getElementById('steps');
  const dotsEl=document.getElementById('dots');
  if(!stepsEl) return;
  SCENES.forEach((s,i)=>{
    const step=document.createElement('section');
    step.className='step scene--'+s.accent; step.id='step-'+i; step.dataset.index=i; step.dataset.g=s.g;
    step.innerHTML=renderCard(s); stepsEl.appendChild(step);
    const dot=document.createElement('button');
    dot.className='dot'; dot.setAttribute('role','tab'); dot.setAttribute('aria-label',s.kicker); dot.dataset.index=i;
    dot.addEventListener('click',()=>goTo(i)); dotsEl.appendChild(dot);
  });
  const ACCENTS={question:['--question','--question-fill','--question-ink'],claim:['--claim','--claim-fill','--claim-ink'],
    evidence:['--evidence','--evidence-fill','--evidence-ink'],study:['--study','--study-fill','--study-ink'],
    protocol:['--protocol','--protocol-fill','--protocol-ink'],request:['--request','--request-fill','--request-ink'],ink:[null,null,null]};
  { const st=document.createElement('style'); let css='';
    for(const [k,[a,f,ink]] of Object.entries(ACCENTS)){
      if(k==='ink'){ css+=`.scene--ink{--accent:var(--ink);--fill:#F1F0EC;--accent-ink:var(--ink);}`; continue; }
      css+=`.scene--${k}{--accent:var(${a});--fill:var(${f});--accent-ink:var(${ink});}`;
    } st.textContent=css; document.head.appendChild(st); }

  buildT1Graph();
  const figure=document.getElementById('figure');
  function setGraph(g){
    const all=(g===0||g===7);
    figure.classList.toggle('is-overview',g===0);
    figure.classList.toggle('is-payoff',g===7);
    for(const grp of figure.querySelectorAll('.gnode,.gedge')){
      const ap = grp.dataset.appear!==undefined ? +grp.dataset.appear : (T1N[grp.dataset.node]?T1N[grp.dataset.node].appear:99);
      grp.classList.toggle('is-on', all||ap<=g);
      grp.classList.toggle('is-ghost', !all&&ap>g);
      grp.classList.toggle('is-active', !all&&ap===g);
    }
  }
  const progress=document.getElementById('progress');
  const counter=document.getElementById('counter');
  const dots=[...dotsEl.children];
  let active=-1;
  function setActive(i){
    if(i===active) return; active=i;
    const s=SCENES[i]; setGraph(s.g);
    const accentVar=s.accent==='ink'?'var(--ink)':`var(--${s.accent})`;
    document.documentElement.style.setProperty('--accent',accentVar);
    progress.style.width=((i+1)/SCENES.length*100)+'%';
    counter.textContent=String(i+1).padStart(2,'0')+' / '+String(SCENES.length).padStart(2,'0');
    dots.forEach((d,j)=>d.setAttribute('aria-current',j===i?'true':'false'));
  }
  const io=new IntersectionObserver(entries=>{
    let best=null;
    for(const e of entries){ if(e.isIntersecting&&(!best||e.intersectionRatio>best.intersectionRatio)) best=e; }
    if(best) setActive(+best.target.dataset.index);
  },{threshold:[.15,.4,.7],rootMargin:'-45% 0px -25% 0px'});
  [...stepsEl.children].forEach(s=>io.observe(s));
  setActive(0);

  const wide=()=>window.matchMedia('(min-width:900px)').matches;
  function goTo(i){
    i=Math.max(0,Math.min(SCENES.length-1,i));
    const elm=document.getElementById('step-'+i);
    const head=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--head'))||56;
    const rect=elm.getBoundingClientRect();
    let y;
    if(wide()){
      // desktop: figure is a sticky column beside the steps — centre the step in the viewport
      const centre=window.scrollY+rect.top+rect.height/2;
      y=Math.max(0, centre-window.innerHeight/2);
    } else {
      // mobile: figure is a sticky band above — clear it (≈44svh + header)
      const margin=window.innerHeight*0.44+head;
      y=Math.max(0, window.scrollY+rect.top-margin+2);
    }
    const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({top:y, behavior:reduce?'auto':'smooth'});
    setActive(i);
  }
  window.MIRA_walkGoTo=goTo;
  // the down-arrow hint advances a scene
  stepsEl.addEventListener('click',e=>{ if(e.target.closest('.hint')){ e.preventDefault(); goTo(active+1); } });
  document.addEventListener('keydown',e=>{
    if(e.target.closest('.f,.pill,a,button,input,textarea')) return;
    if(['ArrowDown','ArrowRight',' ','PageDown'].includes(e.key)){ e.preventDefault(); goTo(active+1); }
    else if(['ArrowUp','ArrowLeft','PageUp'].includes(e.key)){ e.preventDefault(); goTo(active-1); }
  });
  document.getElementById('walk').addEventListener('click',e=>{
    if(wide()) return; // desktop: no edge-tap-to-advance; the cards scroll normally
    if(e.target.closest('a,button,.dot,.pill,.ehit,.bridge,.gnode')) return;
    if(window.getSelection&&String(window.getSelection())) return;
    const x=e.clientX,w=window.innerWidth;
    if(x>w*0.62) goTo(active+1); else if(x<w*0.24) goTo(active-1);
  });
});
})();
