# Where this entry came from — a provenance & attribution table

A condensed, public-facing companion to a full conversation log of human/AI interactions that led to this entry. It traces, as best it can, **where each idea, decision, and artifact originated** across the
sprint that produced the MIRA epistack entry and its site.

Three sources of origin are distinguished:

- **Matt Akamatsu (MA)** — the human author. Cells quote his own words (short excerpts; full verbatim
  is in the log).
- **Claude** — the AI collaborator. Cells describe what it contributed (investigation, synthesis into
  specs, building, debugging).
- **Predates / outside the conversation** — scaffolding neither party originated in-dialogue: the MIRA
  schema and its community, the June 2026 workshop, the competition reviewer's feedback, prior
  artifacts (the `schema-demo` deck, `panel-qa-site`), live community prototypes, and published
  scientific sources.

> **Caveat.** Attribution is approximate and generous on both sides — most threads were *co-developed*,
> often as a one-line course-correction from MA that redirected a body of Claude's work. Quotes are
> excerpts. The competition reviewer is referred to by role, not name. The site was also built across
> ~11 concurrent sessions, so a few changes crossed between agents (noted where relevant).

---

## 1 · Core thesis & intellectual frame

| Element | Matt — in his words | Claude — contribution | Predates / outside |
|---|---|---|---|
| **Compounding needs a shared target, not better extraction** | (endorsed, then steered) | Argued the precondition: analyses only compound if they agree what a claim *is*; wrote the "minimality test" for the shared core | — |
| **Index the artifact, not the claim** (the entry's spine) | "they point to the same empirical data artifact (a plot or table) [so] they can coexist as different descriptors" | Inverted MA's schema correction into the thesis: moved the objective/subjective boundary onto the *artifact* | The `observationBase` / `observationStatement` slots are the MIRA schema's |
| **Center empirical findings; treat each data artifact as indexed** | "Center the empirical findings - the core evidence… we are treating each relevant data artifact as indexed" | Built §6 and the artifact-anchored exhibits around it | — |
| **Request→Study as a handoff to *active* research** | "our treatment of REQuests and STUdy nodes as the handoff back to active research… pointing the way toward active knowledge generation" | Made the closing "killer experiment" a Request; designed the Request→Study spin-out device | `Request`/`Study` are MIRA schema nodes; "modular science" framing is MA/community |
| **Valence & confidence stay qualitative, never numeric** | "make sure the confidence and the valence are qualitative categories, and not quantitative values" | Fixed to three flavors (supports/informs/opposes with degrees); logged valence-unification as a deferred proposal | — |
| **Human curation is a designed interface, not a failure** | "the 'hand correction' you mention is a feature and not a bug" | Reframed the whole human-in-the-loop story accordingly | MA cited `oasisresearchlab` language-and-health as the model |
| **Thesis > rubric-chasing** | "The thesis is more about… the value of MIRAfying research writ large" | Named the drift, rewrote away from conceding rubric dimensions toward the three payoffs | — |

## 2 · Content — the case studies & evidence

| Element | Matt — in his words | Claude — contribution | Predates / outside |
|---|---|---|---|
| **COVID origins as the primary case** | "we can MIRAfy some of the evidence as an example… identify a REQuest for the 'killer experiment'" | Ran the investigation; found the **evidence-independence finding** (one thin 155-location dataset behind a "23-order" spread) | COVID is the competition's own case; WHO report + Worobey 2022 are published |
| **The eggs case** | "a slightly flippant/fun example in the 'are eggs healthy' category too" | Found the structural parallel: cohort-recurrence across meta-analyses + a *missing `observationBase`* (no validated biomarker) | The six meta-analyses are published |
| **DNA double-helix teaching opener** | "our opening should use the DNA double helix example, with 'CLM - DNA forms a double helix'" | Built the 9-scene walkthrough; kept Pauling's triple helix as the `opposed` claim so Photo(graph) 51 carries both verdicts | The DNA / Photo 51 example predates — from the `schema-demo` deck and the May-2026 workshop |
| **_Cell_ (2026) extensibility example + EVD nodes** | "generate evidence nodes with these two figure panels as the two evidencebase artifacts" | Built the Evidence records; verified the CC BY-NC license and corrected the published K/p values | Havens et al., _Cell_ (2026), published under CC BY-NC |

## 3 · Format & information architecture

| Element | Matt — in his words | Claude — contribution | Predates / outside |
|---|---|---|---|
| **Progressive-graph storytelling (two-tab deck)** | "lean on progressive graphical representations… as a storytelling device, much like schema-explainer" | Designed the two-tab structure (walk-through / metascience) and the hero reveal scenes | The `schema-demo` / schema-explainer deck is a prior artifact |
| **Pivot to an 8-page, menu-driven FAQ site** | "the products so far… have been unsatisfactory… more like a menu of different pages" | Wrote `SUBMISSION-ARTIFACT-SPEC.md`; built the 8 pages + shared design system | MA cited `discoursegraphs.github.io/panel-qa-site` as the model |
| **Protocol FAQ as the spine** | (open-decision) don't label them as "the competition's questions" | FAQ with attributed answers + a grounding link per answer | The three Protocol subquestions come from the competition |
| **A parallel essay-form entry** | "in parallel we should draft an essay (linear document) as an alternative" | Drafted `ESSAY.md` — positive thesis first, grammar taught early | — |

## 4 · Visual & graph design

| Element | Matt — in his words | Claude — contribution | Predates / outside |
|---|---|---|---|
| **Architecture schematic (schema / ops / KOI, federation dashed)** | "build a schematic diagram of our existing schema + operations… and underlying network (KOI)… in the MIRAverse.tldraw" | Built it via the tldraw agent (three bands, status badges, arrow legend) | — |
| **Palette** | "use the color scheme from … `schema-demo/index.html`" | Applied it across figures and the site | The palette is the `schema-demo` prior artifact's |
| **Nest the artifact *inside* the Evidence node; node coloring** | "put the artifact inside the evidence node (as a field of the node)" · "the inside of the evd node is shaded red, the boundary of observationBase is dark grey" | Built the `evidenceCard()` pattern and documented it as the reusable standard | — |
| **A co-editable design surface** | "I want to do some co-design (moving objects around etc)… that I can co-edit" | Set up the FigJam board; seeded the COVID artifact-chain | — |
| **"Evidence bundle" → three-tier layout** | "emphasize the 'Evidence bundle'… the analyses are like interpretations of the core evidence" | Translated it to `observationBase`-as-shared-container with an explicit objective/subjective boundary | — |

## 5 · Build & debugging

| Element | Matt | Claude — contribution | Predates / outside |
|---|---|---|---|
| **The single-file deck, the 8-page site, the graph & scrollytelling engines** | "You have license to interpret for clear storytelling" | Essentially all of the HTML/CSS/JS, from the specs | — |
| **Autonomous bug-hunting** | — | Found & fixed a class-name collision spiking the menu icons, made scene-nav deterministic, added the ≥900px sticky-graph desktop layout, resolved CSS-inheritance overflows | — |
| **Constraint & asset audit** | (set the guardrails) | Caught the dead KOI URL, the `@context` validator bug, corrected 661→**347** violations, verified every figure license | Facts about the world (DNS, licenses) |

## 6 · Copy, revisions & correctness

| Element | Matt — in his words | Claude — contribution | Predates / outside |
|---|---|---|---|
| **"Slots are fields, not edges" correction** | "the slots are *not* necessarily edges… they're fields for a given node… update several of the pages" | Swept the reframe across grammar/walk/faq/appendix/audit/cases | The authoritative `mira.yaml` on `main` |
| **De-AI copy pass** | "check for distracting-AI-overexplanation, streamline language" | Fixed broken numbering, killed repetition, cut over-explanation across the deck | — |
| **MA's own line edits** | "I made a bunch of suggestions in site-copy.md" · the epigraph, the "Photograph 51" standardization, section deletions | Applied and merged them — including against edits arriving from a concurrent agent | Some edits (a node-fields rework, a site-wide rename) originated in **other concurrent sessions** |

## 7 · Foundations that predate the sprint

| Element | Origin |
|---|---|
| **The MIRA schema itself** (6 node types + the edge grammar) | The MIRA community / the `schema` repo — not invented in these conversations |
| **Schema convergence history** | The user-story calls, technical-interop calls, and the June 2026 Ireland workshop. MA directed the reconstruction ("summarize how the MIRA schema came to be"); Claude wrote `story of MIRA.md`. Internal/private sources were used but are marked for scrubbing. |
| **The rebuttal target** | The competition reviewer's feedback (the "fewer relation types" prior, the evidence-independence test) — external input that shaped strategy |
| **Live prototype graphs** | `language-and-health-open-synthesis`, `rdf.scios.tech`, the KOI nodes — deployed by the community; MA pointed to them |
| **Published scientific sources** | Worobey 2022 (CC BY 4.0), the WHO joint report, Havens et al. _Cell_ 2026 (CC BY-NC) |

---

## Net attribution, in one paragraph

The **schema and its community-tested grammar predate the sprint and underlie everything** — the entry
is an argument *for* that structure, not an invention of it. **Matt Akamatsu supplied the steering
intelligence**: the thesis corrections (index the artifact; slots are fields; qualitative-not-numeric),
the case choices (COVID, eggs, the DNA opener), the format pivots (progressive graphics → menu-driven
FAQ → parallel essay), the art direction, and the guardrails — frequently as a single sentence that
redirected hours of work. **Claude did the investigation, turned steers into drafts and build-ready specs, and
wrote and debugged essentially all of the code.** The two contested cases' structural findings — the
COVID evidence-independence result and the eggs cohort-recurrence result — were Claude's investigative
work on public primary sources, *chosen and framed* by Matt. External scaffolding (the reviewer's
feedback, the workshop, prior demos, published science) set the terms the collaboration worked within.
