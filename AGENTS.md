# Repository Instructions

## Priority

1. The user's request in the current task takes precedence over this file.
2. Inside this file, items marked **Hard limit** take precedence over style guidance.
3. If two writing rules conflict, apply the stricter one and continue. Do not pause to ask about it.
4. Every rule has a purpose, stated next to it. If the wording and the purpose point in different directions, follow the purpose.
5. If a rule makes you pause, ask for approval, or move away from the user's intent, name that rule in the final report in one sentence.

## Environment

Always run commands in PowerShell without the profile (`-NoProfile`) so the output stays clean.

## Working Style

- Infer scope and intent from the request and the surrounding files. Carry the task through to a finished result instead of stopping at a plan or an offer.
- Do not ask about details that the repository can answer or that do not change the content (file names, heading levels, wording). Ask only when the answer would materially change the result.
- When approval is needed, finish the reviewable work first so that approval is the last step.
- Read the target page and its neighboring pages before writing. Match their terminology. Do not invent facts about systems, APIs, versions, or results. If a fact cannot be verified from the repository, say so in the final report.
- Do not rewrite text that the request did not touch.
- Reply to the user in the language they write in.

## Documentation Writing Standards (`docs/**/*.md`)

These rules apply when creating or editing Indonesian learning modules. They also apply to every Indonesian draft or proposed rewrite shown in chat, not only to saved files.

Read `STYLE.md` before writing. It holds a before/after example of the target style. If the file is missing, continue without it.

### 1. Preserve Syntax (Hard limit)

Change YAML frontmatter, code blocks, Mermaid diagrams, links, or MkDocs admonitions only when the request needs it or the user approved it. Keep valid syntax and keep edits scoped to the requested or approved change.

Purpose: broken syntax breaks the site build, and unrequested edits create review work.

### 2. Natural Indonesian Tone

- Never use the formal `Anda`.
- Omit second-person pronouns by using natural imperatives and context ("Jalankan perintah berikut..."), or use the inclusive `kita` for guided walkthroughs.
- If a pronoun is unavoidable, use `kamu`.

### 3. Conceptual Prose and Voice

Follow ISO 24495-1 and the Google Developer Style Guide.

- Start with the problem context and state the main point early.
- Use active voice and plain words. Prefer concrete examples and precise verbs over jargon.
- State practical trade-offs.
- Calibrate to a beginner: define a term the first time it appears.
- Write as a patient instructor talking to a first-year student: direct, warm, and specific.
- Vary the rhythm. Within a section, mix paragraph lengths (2 to 4 sentences) and sentence lengths (short, medium, and an occasional longer sentence that carries a causal chain).
- Give each new concept one concrete anchor: a scenario from the course domain (sensor, hydroponic system, gateway), an analogy, or a small number. Do not reuse the same anchor in consecutive sections.
- Do not give every paragraph the same shape (claim, reason, example). Let some paragraphs open with the scenario and reach the claim second.

Purpose: recent GPT models drift toward flat, uniform prose. Learners stay engaged when the text sounds like a person explaining something specific.

#### Concept Scaffolding (General-to-Specific)

Never jump straight into hardware-specific edge cases or troubleshooting in the opening paragraph. Introduce foundational concepts in three steps:

1. What the technology is and its core mental model (e.g., request-response, pub-sub).
2. Where it is commonly used in general software engineering.
3. How it connects to the specific AIoT/project context in this module.

### 4. Explanatory Flow (Conceptual Sections)

Counteract token-compression habits. Dry, telegraphic text is a known failure of recent GPT models, so write full explanations.

- Never write sentence fragments or bare bullet dumps for concepts.
- Keep natural Indonesian causal connectors (`sehingga`, `karena`, `akibatnya`, `artinya`) so cause and effect stay linked.
- Explain how the mechanism works, not only what it is called.
- A conceptual paragraph has at least two sentences: one claim and one reason or mechanism behind it.

Purpose: a beginner needs the reasoning, not only the label.

### 5. Procedures and Labs

Follow adapted ASD-STE100.

- Use imperative verbs and one action per step (maximum 20 words).
- Place `Jika...` conditions at the start of the sentence.
- Use strict modals: `wajib`, `dapat`, `akan`.

### 6. No AI Clichés

Avoid the following, and avoid reusing the same signature phrase or sentence opener across consecutive paragraphs or pages.

- Symmetrical or contrastive framing: "Bukan sekadar X, melainkan Y", "X, bukan Y" when the reader never raised Y.
- Dramatic or inflated words: `krusial`, `fundamental`, `revolusioner`, `menjembatani`, `memberdayakan`, `holistik`, "sangat penting".
- Filler openers and stock phrases: "Perlu dicatat bahwa", "Penting untuk diingat", "Pada dasarnya", "Mari kita selami".
- Wrap-up statements at the end of a section: "Singkatnya", "Intinya", "Kesimpulannya".
- Statements about what the text will not do or what stays unchanged. State what it does.
- Invented compound labels and canned transitions. Use plain verbs and prepositions to state the actual relationship.
- Repetitive `**Bold:**` bullet lists used in place of prose.

Purpose: readers recognize these patterns as machine-written and stop trusting the text.

### 7. Web Readability (Hard limit)

1. One paragraph develops one idea. One idea means one claim, its explanation, and at most one example.
2. A new concept, a new example, a trade-off, or a shift in direction starts a new paragraph.
3. Maximum 4 sentences and 70 words per paragraph. If both limits conflict, the stricter one applies.
4. Open a split-off paragraph with a connector that links it to the previous one, so the explanation stays continuous. Rule 4 still applies inside these limits.
5. Default to paragraphs. Use a list only when the items are parallel, sequential, or easier to compare. Avoid nested lists.
6. If splitting makes a run of paragraphs the same length and shape, join related ideas with a causal connector or vary the opening, instead of cutting evenly.

Purpose: phone readers should not face dense blocks. The limits are not a target length, and uniform short paragraphs defeat the goal as much as dense ones.

### 8. Verification Before Output

Do these steps before showing a draft or finishing a file edit.

1. Count sentences and words in every new or changed paragraph. Split any paragraph that exceeds rule 7.
2. Check that consecutive paragraphs do not share the same opener, shape, or concrete anchor.
3. Search the text for `Anda` and for the phrases listed in rule 6.
4. Confirm that frontmatter, code blocks, Mermaid diagrams, links, and admonitions are unchanged unless the task required a change.
5. If the repository provides a docs build or lint command (for example `mkdocs build`), run it after editing. Do not report the task as complete until it passes or the failure is explained.

## Final Report

Keep the final message to the user short and in plain language: what changed, which files, what was checked, and any assumption made. Do not narrate low-level investigation steps unless the user asks.
