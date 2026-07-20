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

## Run locally

Plain HTML/CSS/JS — open `index.html` directly, or serve the folder over HTTP:

```sh
python3 -m http.server 8000
# → http://localhost:8000
```

## About MIRA

**MIRA = Modular Interoperable Research Attribution** ([mira.science](https://mira.science)) is
an open architecture and shared schema — not an app and not a host. The canonical LinkML schema
lives at [MIRA-science/schema](https://github.com/MIRA-science/schema); MIRA generalizes, and is
co-developed with, the [Discourse Graphs](https://discoursegraphs.com) project.

Public MIRA components referenced from the site:
[schema](https://github.com/MIRA-science/schema) ·
[demo-MIRA-graph-data](https://github.com/MIRA-science/demo-MIRA-graph-data) ·
[myst-plus-mira](https://github.com/MIRA-science/myst-plus-mira) ·
[koi-net-mira-prototype](https://github.com/MIRA-science/koi-net-mira-prototype) ·
[inter-lab-user-story](https://github.com/MIRA-science/inter-lab-user-story) ·
[MIRA-extraction](https://github.com/MIRA-science/MIRA-extraction)
