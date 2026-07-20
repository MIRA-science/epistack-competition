# MIRA — FLF epistack competition entry

**The structure layer for a shared research graph.**

🔗 **Live site: https://mira-science.github.io/epistack-competition/**

Research normally ships as a sealed document — a PDF. This submission reframes it as
**a graph of signed, citable records** anchored on the actual data artifacts (the figure,
the blot, the dataset), so that analyses from different tools, labs, and analysts
**compound into one graph** instead of forking — without forcing anyone to agree on the
interpretation.

Submitted to the [FLF epistack competition](https://flf.org/epistack-competition/) as a
**protocol / interoperability schema** (layer: **Structure**), demonstrated on two worked
cases — COVID-19 origins and "are eggs healthy?" — used to *illustrate the schema and
protocol*, not to adjudicate the controversies.

## What's here

This repository **is** the submission site: a small, self-contained static site with no build
step. Everything a judge needs is reachable from the persistent top nav.

| Page | What it covers |
|---|---|
| [`index.html`](index.html) | Home — the thesis, the layer table, current status |
| [`grammar.html`](grammar.html) | The discourse-graph grammar: nodes, edges, and the artifact anchor |
| [`walk.html`](walk.html) | A guided walkthrough of a single claim through the graph |
| [`cases.html`](cases.html) | The two worked cases — COVID-19 origins and eggs |
| [`protocol-faq.html`](protocol-faq.html) | The Protocol-lane FAQ, answering the competition's questions by name |
| [`run.html`](run.html) | Run it — the live and runnable prototypes |
| [`audit.html`](audit.html) | Context and caveats — the self-audit |
| [`appendix.html`](appendix.html) | Reference — prior art and receipts |

Static assets (CSS, JS, images, the favicon) live in [`assets/`](assets/).

## The prototypes — tools & repos

The material behind the submission is public and lives under
[`github.com/MIRA-science`](https://github.com/MIRA-science). Each entry below carries an honest
status — we don't oversell a link. The [Run it](https://mira-science.github.io/epistack-competition/run.html)
page has a "what to try" for each.

**Status:** `shipped` — runs today · `designed` — a concrete draft, not built ·
`past-tense pilot` — ran during the inter-lab pilot.

| Component | Status | What it is |
|---|---|---|
| [**`schema`**](https://github.com/MIRA-science/schema) | `shipped` | The canonical LinkML grammar — every node and edge on the site is defined in it; SHACL, Turtle, and JSON-LD are generated from the source. |
| [**DNA walkthrough**](https://mira-science.github.io/epistack-competition/walk.html) | `shipped` | Interactive deck: the six-node grammar built one record at a time on the discovery of DNA's structure, every slot and edge explaining itself on hover. |
| [**`MIRA-extraction`**](https://github.com/MIRA-science/MIRA-extraction) | `shipped` | AI-assisted MIRAfication of a source — verbatim provenance excerpts (the receipts), dangling/ungrammatical edges reported instead of dropped, the `source → study → grounds → evidence` spine enforced. Live demo: [mira-extraction.vercel.app](https://mira-extraction.vercel.app/). |
| [**`demo-MIRA-graph-data`**](https://github.com/MIRA-science/demo-MIRA-graph-data) | `shipped · mock data` | A ~314-node discourse graph + a standalone d3 viewer + the Python transform pipeline that built it. Terms are randomized to a microtubule-transport field — validate tooling, **never** a scientific source. |
| [**`myst-plus-mira`**](https://github.com/MIRA-science/myst-plus-mira) | `shipped` | The TypeScript MyST parser — author discourse-graph nodes inside MyST Markdown and emit JSON-LD. `npm test` runs the MyST → JSON-LD round-trip on the golden fixture. |
| [**`koi-net-mira-prototype`**](https://github.com/MIRA-science/koi-net-mira-prototype) | `past-tense pilot` | The KOI cross-organization envelope. During the inter-lab pilot, different people's agents and tools read from and wrote to the same KOI node across org boundaries. We do **not** claim a live federated network today. |
| [**`inter-lab-user-story`**](https://github.com/MIRA-science/inter-lab-user-story) | `shipped · spec` | The north-star user story — "push a result to a shared web interface" — with normative transport/sharing rules R1–R13 and the authoritative open-questions list. `AGENTS.md` is the brief. |
| **Two live public graphs** | `shipped · live` | The same grammar running in public on two unrelated topics — every node gets a URL, the prose is a rendering of the graph: [language-and-health-open-synthesis.vercel.app](https://language-and-health-open-synthesis.vercel.app/) and [rdf.scios.tech](https://rdf.scios.tech/). |
| [**`schema/atproto`**](https://github.com/MIRA-science/schema) | `designed` | A draft ATProto lexicon binding (`science.mira.*`) for public discourse-graph nodes — the intended public layer. Self-labelled DRAFT / PROPOSAL: not adopted, not published, not on the network. |

## Run locally

Plain HTML/CSS/JS — open `index.html` directly, or serve the folder over HTTP:

```sh
python3 -m http.server 8000
# → http://localhost:8000
```

## About MIRA

**MIRA = Modular Interoperable Research Attribution** ([mira.science](https://mira.science)) is
an open architecture and shared schema — not an app and not a host ("MIRA hosts nothing; every
record points at a public artifact"). The canonical LinkML schema lives at
[MIRA-science/schema](https://github.com/MIRA-science/schema); MIRA generalizes, and is
co-developed with, the [Discourse Graphs](https://discoursegraphs.com) project.
