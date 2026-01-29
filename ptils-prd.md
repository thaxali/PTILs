# PTILS: Product Requirements Document

## Overview

Build **PTILS** (Prompts: Today I Learned) — a discovery tool where users learn interesting AI prompt techniques. Each "petal" is a bite-sized TIL about what you can do with AI.

**Tagline:** "Discover one interesting thing you can do with AI today"

**Tech Stack:**
- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- Vercel for deployment
- localStorage for saves (no auth required)

---

## Brand & Design

### Visual Language
- **Tons of white space** — let content breathe, generous padding and margins
- **Rounded corners** — 16px radius on cards, 8px on buttons/tags
- **Subtle shadows** — soft, diffused (`shadow-sm` or custom with low opacity)
- **Gentle animations** — fade, ease-in-out, 200-300ms durations, nothing bouncy
- **Light palette** — predominantly white/cream backgrounds, color as accent only

### Card Photography
Each PTIL card has a calming photo header. Use curated Unsplash images.

**Vibe:** Calming, abstract, nature-inspired
- Soft gradients and bokeh
- Water, sky, plants, abstract textures
- Muted, desaturated tones matching the lavender/sage palette
- NO literal flowers (too on the nose)

**Implementation:** Store curated Unsplash image URLs in PTIL data. Pick 25-30 images manually that match the aesthetic.

Example Unsplash searches: "calm minimal", "abstract soft", "nature blur", "gradient sky"

### Color Palette
```
Primary:     #9B7ED9 (lavender)
Secondary:   #F4A7B9 (coral pink)
Accent:      #A8D5BA (sage green)
Background:  #FDFBF7 (warm cream)
Text:        #2D2A32 (soft black)
Muted:       #8A8690 (gray)
```

### Typography

| Use | Font | Weight |
|-----|------|--------|
| Logo / Brand | Aboreto | Regular |
| Headings | Instrument Serif | Regular |
| Body text | Instrument Serif | Regular |
| Prompts / Code | JetBrains Mono | ExtraLight |
| UI elements (buttons, tags) | JetBrains Mono | Regular or ExtraLight |

**Font loading:** Use `next/font` for Instrument Serif and JetBrains Mono. Aboreto only needed for logo (can be SVG text or loaded separately).

### Logo
`{ P T I L S }` — spaced letters with bracket bookends, set in Aboreto. Clean and geometric.

---

## Site Structure

```
/                   → Home (card grid of all PTILs)
/til/[id]           → Individual PTIL detail page
/saved              → User's saved PTILs
/about              → Long-scroll about page
```

---

## Page Specifications

### 1. Home Page (`/`)

**Layout:**
```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│  { P T I L S }                          Saved    About     │
│                                                            │
├────────────────────────────────────────────────────────────┤
│                                                            │
│   Discover something new about AI prompting                │
│                                                            │
│   ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐      │
│   │  photo  │  │  photo  │  │  photo  │  │  photo  │      │
│   │         │  │         │  │         │  │         │      │
│   │ #001    │  │ #002    │  │ #003    │  │ #004    │      │
│   │ Title   │  │ Title   │  │ Title   │  │ Title   │      │
│   │ here... │  │ here... │  │ here... │  │ here... │      │
│   │ tags    │  │ tags    │  │ tags    │  │ tags    │      │
│   └─────────┘  └─────────┘  └─────────┘  └─────────┘      │
│                                                            │
│   ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐      │
│   │  ...    │  │  ...    │  │  ...    │  │  ...    │      │
│   └─────────┘  └─────────┘  └─────────┘  └─────────┘      │
│                                                            │
│                        Footer                              │
└────────────────────────────────────────────────────────────┘
```

**Card Grid:**
- 4 columns on desktop (>1024px)
- 2 columns on tablet (640-1024px)
- 1 column on mobile (<640px)
- Gap: 24px between cards

**Card Anatomy:**
```
┌─────────────────────────────────────┐
│                                     │
│     [calming photo header]          │  ← ~40% of card height
│                                     │
├─────────────────────────────────────┤
│                                     │
│  #042                               │  ← small, muted gray
│                                     │
│  You can ask Claude to critique     │  ← Instrument Serif, 2-3 lines max
│  its own output and improve it      │
│  in one go                          │
│                                     │
│  #writing  #self-critique           │  ← subtle tag pills
│                                     │
└─────────────────────────────────────┘
```

**Behavior:**
- Cards link to `/til/[id]` on click
- Hover state: slight lift (translateY -2px) + shadow increase
- Gentle stagger animation on initial load (cards fade in sequentially)
- No shuffle on home — user browses the grid

**Components:**
```tsx
<Header />
<Hero tagline="Discover something new about AI prompting" />
<PTILGrid ptils={allPtils} />
<Footer />
```

---

### 2. PTIL Detail Page (`/til/[id]`)

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│  { P T I L S }                           Saved    About     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ← Back to all                                              │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │            [calming photo - wide banner]            │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  #042                                                       │
│                                                             │
│  You can ask Claude to critique its own output              │
│  and improve it in one go                                   │
│                                                             │
│  ───────────────────────────────────────────────────────   │
│                                                             │
│  THE PROMPT                                    [📋 Copy]    │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  Write a product description for [X], then          │   │
│  │  critique it for clarity and persuasiveness,        │   │
│  │  then write an improved version.                    │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  WHY IT WORKS                                               │
│  Self-critique forces the model to evaluate from            │
│  a reader's perspective before revising. This               │
│  mimics the revision process of expert writers...           │
│                                                             │
│  EXAMPLE OUTPUT                              [▼ Expand]     │
│  ───────────────────────────────────────────────────────   │
│                                                             │
│  Works with: Claude, GPT-4, Gemini                          │
│                                                             │
│  #writing  #self-critique  #productivity                    │
│                                                             │
│                                              [❤️ Save]      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Behavior:**
- Back link returns to home (`/`)
- Photo banner uses same image as card, wider aspect ratio
- Copy button copies prompt text to clipboard, shows toast "Copied!"
- Save button toggles save state (heart filled when saved)
- Example Output section collapsed by default, click to expand
- Tags displayed but not clickable (future: filter by tag)

**Styling:**
- Max-width container (~720px) for comfortable reading
- Generous vertical spacing between sections
- Prompt block: subtle background (light gray/cream), rounded corners, JetBrains Mono ExtraLight
- Section labels ("THE PROMPT", "WHY IT WORKS"): JetBrains Mono, small, muted uppercase

**Data Structure:**
```typescript
interface PTIL {
  id: string;
  number: number;
  title: string;           // The hook/headline
  prompt: string;          // The actual prompt template
  whyItWorks: string;      // Explanation paragraph
  exampleOutput: string;   // Real example of output
  tags: string[];          // e.g., ["writing", "productivity"]
  worksWith: string[];     // e.g., ["Claude", "GPT-4", "Gemini"]
  imageUrl: string;        // Unsplash image URL for card/banner
  createdAt: string;
}
```

---

### 3. Saved Page (`/saved`)

**Layout:**
- Header
- Title: "Your Saved Petals"
- Grid of saved PTIL cards (smaller than home)
- Empty state if no saves: "No saved petals yet. Start exploring!"
- Each card links to `/til/[id]`

**Behavior:**
- Reads from localStorage key `ptils-saved` (array of PTIL IDs)
- Cards show title + tags only (compact view)
- Can unsave from this view (X button on card)

**localStorage Schema:**
```typescript
// Key: "ptils-saved"
// Value: string[] (array of PTIL IDs)
["ptil-001", "ptil-042", "ptil-017"]
```

---

### 4. About Page (`/about`)

**Purpose:** Long-scroll page explaining PTILS. This page has a Seena scroll trigger at 50%, so it needs enough content to require scrolling.

**Content Sections:**
1. **Hero:** "What is PTILS?"
2. **The Problem:** Most people use AI the same way every time. There's so much more you can do.
3. **The Solution:** Daily bite-sized prompt techniques to expand your AI toolkit.
4. **How It Works:** Browse → Learn → Try → Save
5. **Who Made This:** Built by Seena Labs — we're building tools to understand user behavior.
6. **The Seena Dot:** You might notice a small dot appear while using PTILS. That's Seena — our contextual micro-interview tool. It helps us learn what you think. Your feedback shapes the product.
7. **Contact/Links:** Link to Seena Labs, Twitter/X, etc.

**Design:**
- Each section is a full or half viewport height
- Subtle scroll animations (fade in on scroll)
- Total page should require 3-4 full scrolls minimum

---

## Data: PTIL Content

Seed the app with 25 PTILs. Store as a JSON file or TypeScript constant for MVP (no database needed).

**Image URLs:** Each PTIL needs an `imageUrl` field. Use these curated Unsplash images (calming, abstract, nature-inspired):

```typescript
const unsplashImages = [
  "https://images.unsplash.com/photo-1557682250-33bd709cbe85", // purple gradient
  "https://images.unsplash.com/photo-1579546929518-9e396f3cc809", // colorful gradient
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4", // mountain fog
  "https://images.unsplash.com/photo-1507400492013-162706c8c05e", // soft clouds
  "https://images.unsplash.com/photo-1518837695005-2083093ee35b", // ocean wave
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05", // foggy hills
  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429", // calm lake
  "https://images.unsplash.com/photo-1519681393784-d120267933ba", // starry mountain
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d", // abstract light
  "https://images.unsplash.com/photo-1557683316-973673baf926", // gradient mesh
  "https://images.unsplash.com/photo-1508739773434-c26b3d09e071", // sunset sky
  "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1", // green valley
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e", // nature light
  "https://images.unsplash.com/photo-1433086966358-54859d0ed716", // waterfall mist
  "https://images.unsplash.com/photo-1501854140801-50d01698950b", // aerial nature
  "https://images.unsplash.com/photo-1518495973542-4542c06a5843", // sunlight leaves
  "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1", // misty forest
  "https://images.unsplash.com/photo-1509023464722-18d996393ca8", // dark clouds
  "https://images.unsplash.com/photo-1534088568595-a066f410bcda", // pink sky
  "https://images.unsplash.com/photo-1517483000871-1dbf64a6e1c6", // abstract water
  "https://images.unsplash.com/photo-1504253163759-c23fccaebb55", // calm sea
  "https://images.unsplash.com/photo-1505765050516-f72dcac9c60e", // forest light
  "https://images.unsplash.com/photo-1439066615861-d1af74d74000", // lake reflection
  "https://images.unsplash.com/photo-1540206395-68808572332f", // mountain range
  "https://images.unsplash.com/photo-1531366936337-7c912a4589a7", // northern lights
];
// Add ?w=800&q=80 to each URL for optimized loading
```

### Sample PTILs to Include:

```typescript
const ptils: PTIL[] = [
  {
    id: "ptil-001",
    number: 1,
    title: "You can ask Claude to critique its own output and improve it in one go",
    prompt: "Write a product description for [X], then critique it for clarity and persuasiveness, then write an improved version.",
    whyItWorks: "Self-critique forces the model to evaluate from a reader's perspective before revising. This mimics the revision process of expert writers and often produces significantly better output than a single pass.",
    exampleOutput: "**First draft:** Our app helps you manage tasks...\n\n**Critique:** This is generic and doesn't highlight unique value...\n\n**Improved:** Take back your mornings. TaskFlow uses AI to prioritize what actually matters...",
    tags: ["writing", "self-critique", "productivity"],
    worksWith: ["Claude", "GPT-4", "Gemini"],
    createdAt: "2025-01-15"
  },
  {
    id: "ptil-002",
    number: 2,
    title: "You can give Claude a persona to get more specialized responses",
    prompt: "You are a senior staff engineer at a FAANG company with 15 years of experience. Review this code and give me the feedback you'd give a junior engineer on your team.",
    whyItWorks: "Personas activate domain-specific knowledge and communication styles. A 'senior engineer' persona will catch architectural issues and provide mentorship-style feedback that a generic review wouldn't.",
    exampleOutput: "A few things I'd flag in code review:\n\n1. **Naming:** `processData` tells me nothing...",
    tags: ["coding", "personas", "code-review"],
    worksWith: ["Claude", "GPT-4"],
    createdAt: "2025-01-15"
  },
  {
    id: "ptil-003",
    number: 3,
    title: "You can ask for multiple options and then have the AI pick the best one",
    prompt: "Give me 5 different taglines for [product]. Then evaluate each on clarity, memorability, and emotional impact. Finally, recommend which one to use and why.",
    whyItWorks: "Generating options first expands the solution space. Having the AI evaluate its own options leverages its judgment while giving you transparency into the reasoning.",
    exampleOutput: "**Options:**\n1. 'Your data, decoded.'\n2. 'Insights in seconds.'...\n\n**Evaluation:**...\n\n**Recommendation:** Option 3 because...",
    tags: ["brainstorming", "decision-making", "marketing"],
    worksWith: ["Claude", "GPT-4", "Gemini"],
    createdAt: "2025-01-15"
  },
  {
    id: "ptil-004",
    number: 4,
    title: "You can ask Claude to explain something at multiple levels of complexity",
    prompt: "Explain [concept] three ways: first to a 10-year-old, then to a college student, then to an expert in the field.",
    whyItWorks: "This forces the model to truly understand the concept at different depths. It's also a great way to find the explanation level that works for your audience.",
    exampleOutput: "**For a 10-year-old:** Imagine you have a bunch of LEGO pieces...\n\n**For a college student:** Machine learning is a subset of AI...\n\n**For an expert:** Transformer architectures leverage self-attention mechanisms...",
    tags: ["learning", "explanation", "teaching"],
    worksWith: ["Claude", "GPT-4", "Gemini"],
    createdAt: "2025-01-15"
  },
  {
    id: "ptil-005",
    number: 5,
    title: "You can use 'thinking out loud' to get better reasoning",
    prompt: "Think through this step-by-step, showing your reasoning at each stage: [problem]",
    whyItWorks: "Chain-of-thought prompting improves accuracy on complex tasks by forcing the model to show intermediate steps rather than jumping to conclusions.",
    exampleOutput: "Let me work through this step by step:\n\n**Step 1:** First, I need to understand...\n**Step 2:** Given that, the next consideration is...",
    tags: ["reasoning", "problem-solving", "chain-of-thought"],
    worksWith: ["Claude", "GPT-4", "Gemini"],
    createdAt: "2025-01-15"
  },
  {
    id: "ptil-006",
    number: 6,
    title: "You can ask for the 'devil's advocate' perspective",
    prompt: "I'm considering [decision]. First, make the strongest possible case in favor. Then, play devil's advocate and make the strongest case against. Finally, give me your balanced assessment.",
    whyItWorks: "This overcomes confirmation bias by forcing consideration of opposing views. The balanced assessment at the end synthesizes both perspectives.",
    exampleOutput: "**Case in favor:** The data clearly shows...\n\n**Devil's advocate:** However, we should consider...\n\n**Balanced view:** Weighing both sides...",
    tags: ["decision-making", "critical-thinking", "analysis"],
    worksWith: ["Claude", "GPT-4", "Gemini"],
    createdAt: "2025-01-15"
  },
  {
    id: "ptil-007",
    number: 7,
    title: "You can constrain the format to get more usable output",
    prompt: "Summarize this article in exactly 3 bullet points, where each bullet is one sentence and under 20 words.",
    whyItWorks: "Constraints force precision. Without them, summaries tend to be verbose. Specific word/sentence limits make output immediately usable.",
    exampleOutput: "• The study found remote workers were 13% more productive than office counterparts.\n• Collaboration suffered, with team projects taking 20% longer to complete.\n• Hybrid models (2-3 days remote) showed the best balance of both metrics.",
    tags: ["summarization", "formatting", "constraints"],
    worksWith: ["Claude", "GPT-4", "Gemini"],
    createdAt: "2025-01-15"
  },
  {
    id: "ptil-008",
    number: 8,
    title: "You can ask Claude to write in a specific author's style",
    prompt: "Explain [topic] in the style of [author]. Capture their voice, sentence structure, and typical metaphors.",
    whyItWorks: "Style mimicry helps when you need a specific tone. It's also a great way to make dry topics more engaging by channeling a compelling voice.",
    exampleOutput: "**In the style of David Foster Wallace:**\n\nSo here's the thing about machine learning, and it's the kind of thing that seems obvious once you think about it but which nobody actually thinks about...",
    tags: ["writing", "style", "creative"],
    worksWith: ["Claude", "GPT-4"],
    createdAt: "2025-01-15"
  },
  {
    id: "ptil-009",
    number: 9,
    title: "You can ask for a 'pre-mortem' analysis",
    prompt: "Imagine it's 6 months from now and [project/decision] has completely failed. What went wrong? Give me the 5 most likely reasons for failure.",
    whyItWorks: "Pre-mortems surface risks that optimism bias hides. By assuming failure, you identify vulnerabilities you'd otherwise overlook.",
    exampleOutput: "**Post-mortem from the future:**\n\n1. We underestimated the technical complexity of...\n2. The market shifted when competitor X...\n3. Team burnout became critical after...",
    tags: ["planning", "risk-analysis", "decision-making"],
    worksWith: ["Claude", "GPT-4", "Gemini"],
    createdAt: "2025-01-15"
  },
  {
    id: "ptil-010",
    number: 10,
    title: "You can use examples to calibrate the output you want",
    prompt: "Write a tweet about [topic]. Here are examples of the tone I want:\n\n- 'Just mass unfollowed 50 tech bros. Hygiene.'\n- 'Hot take: your startup doesn't need AI, it needs a user manual.'\n\nNow write 5 tweets in this style about [topic].",
    whyItWorks: "Few-shot examples are more precise than adjectives. Instead of saying 'witty and sarcastic,' showing examples calibrates the exact tone.",
    exampleOutput: "1. 'Your AI assistant doesn't have hallucinations, it has creative differences.'\n2. 'Just prompted ChatGPT to write my OKRs. Finally, corporate speak that makes sense.'...",
    tags: ["few-shot", "social-media", "tone"],
    worksWith: ["Claude", "GPT-4", "Gemini"],
    createdAt: "2025-01-15"
  },
  {
    id: "ptil-011",
    number: 11,
    title: "You can ask Claude to identify what's missing",
    prompt: "Here's my plan for [X]. What am I missing? What questions should I be asking that I haven't thought of?",
    whyItWorks: "You don't know what you don't know. This prompt surfaces blind spots and unknown unknowns that your own thinking can't access.",
    exampleOutput: "Your plan looks solid, but here are some gaps I'd flag:\n\n1. **Distribution:** You've detailed the product but not how people will discover it...\n2. **Edge cases:** What happens when...",
    tags: ["planning", "blind-spots", "review"],
    worksWith: ["Claude", "GPT-4", "Gemini"],
    createdAt: "2025-01-15"
  },
  {
    id: "ptil-012",
    number: 12,
    title: "You can ask for feedback as a specific type of user",
    prompt: "Review this landing page copy as if you're a skeptical enterprise buyer who's been burned by SaaS vendors before. What concerns would you have?",
    whyItWorks: "User personas in feedback prompts surface objections you'd miss. Different personas catch different issues.",
    exampleOutput: "**As a skeptical enterprise buyer:**\n\n'Sounds great, but I've heard this before. My concerns:\n\n1. Where's the case study from a company my size?\n2. 'AI-powered' means what exactly? Last AI tool we bought...'",
    tags: ["feedback", "personas", "marketing"],
    worksWith: ["Claude", "GPT-4", "Gemini"],
    createdAt: "2025-01-15"
  },
  {
    id: "ptil-013",
    number: 13,
    title: "You can have Claude roleplay both sides of a conversation",
    prompt: "Simulate a conversation between a skeptical customer and a sales rep about [product]. The customer has objection [X]. Show how the conversation would unfold over 5 exchanges.",
    whyItWorks: "Dialogue simulation helps you anticipate objections and practice responses. It's like a rehearsal for real conversations.",
    exampleOutput: "**Customer:** Look, I've tried three tools like this already. Why would yours be different?\n\n**Sales rep:** Totally fair question. What specifically didn't work about the others?\n\n**Customer:** They all promised automation but I still ended up doing everything manually...",
    tags: ["sales", "roleplay", "objection-handling"],
    worksWith: ["Claude", "GPT-4"],
    createdAt: "2025-01-15"
  },
  {
    id: "ptil-014",
    number: 14,
    title: "You can ask for progressively deeper explanations",
    prompt: "Explain [concept]. Then explain the most complex part of what you just said. Then explain the most complex part of that.",
    whyItWorks: "Recursive explanation drills into the hardest parts automatically. Each layer unpacks the previous layer's complexity.",
    exampleOutput: "**Level 1:** Neural networks learn patterns by adjusting connection weights based on errors.\n\n**Level 2:** 'Adjusting weights based on errors' means...\n\n**Level 3:** 'Gradient descent' works by...",
    tags: ["learning", "explanation", "deep-dive"],
    worksWith: ["Claude", "GPT-4", "Gemini"],
    createdAt: "2025-01-15"
  },
  {
    id: "ptil-015",
    number: 15,
    title: "You can ask Claude to steelman an argument you disagree with",
    prompt: "I think [position]. But I want to understand the other side. Give me the strongest possible argument against my position, as if you were a skilled debater who genuinely believes it.",
    whyItWorks: "Steelmanning builds empathy and stress-tests your own position. Understanding the best opposing argument makes your own thinking sharper.",
    exampleOutput: "**Steelman against your position:**\n\nThe most compelling counterargument isn't the obvious one. Here's the sophisticated version:\n\n1. You're assuming [X], but what if...",
    tags: ["critical-thinking", "debate", "analysis"],
    worksWith: ["Claude", "GPT-4", "Gemini"],
    createdAt: "2025-01-15"
  },
  {
    id: "ptil-016",
    number: 16,
    title: "You can ask for the 80/20 breakdown",
    prompt: "I want to learn [skill/topic]. What's the 20% I need to learn that will give me 80% of the practical value? Ignore the advanced stuff—what are the fundamentals that matter most?",
    whyItWorks: "This cuts through the completionist urge to learn everything. It prioritizes high-leverage knowledge for practical application.",
    exampleOutput: "**The 80/20 of SQL:**\n\nForget stored procedures and window functions for now. Master these:\n\n1. SELECT, FROM, WHERE (90% of your queries)\n2. JOIN (just LEFT JOIN honestly)...",
    tags: ["learning", "productivity", "prioritization"],
    worksWith: ["Claude", "GPT-4", "Gemini"],
    createdAt: "2025-01-15"
  },
  {
    id: "ptil-017",
    number: 17,
    title: "You can ask Claude to find the flaw in your logic",
    prompt: "Here's my argument: [argument]. Attack this logic. Find the weakest points, hidden assumptions, and logical fallacies. Don't be nice about it.",
    whyItWorks: "Inviting criticism surfaces flaws you're blind to. The 'don't be nice' instruction overrides the model's tendency to be agreeable.",
    exampleOutput: "**Problems with your argument:**\n\n1. **Hidden assumption:** You're assuming correlation implies causation when you say...\n2. **Cherry-picked evidence:** The data points you chose ignore...\n3. **Logical gap:** Even if A→B and B→C, you haven't shown...",
    tags: ["logic", "critical-thinking", "argumentation"],
    worksWith: ["Claude", "GPT-4", "Gemini"],
    createdAt: "2025-01-15"
  },
  {
    id: "ptil-018",
    number: 18,
    title: "You can ask for the 'explain like I'm' format at any level",
    prompt: "Explain [complex topic] like I'm a smart 12-year-old who's curious but has no background in this field.",
    whyItWorks: "The 'smart but uninformed' framing hits a sweet spot: no jargon, but no condescension. It forces clear explanations without oversimplification.",
    exampleOutput: "So you know how when you're trying to find your friend in a crowd, you look for things that stand out—like their red jacket or how tall they are? Machine learning does something similar...",
    tags: ["explanation", "learning", "simplification"],
    worksWith: ["Claude", "GPT-4", "Gemini"],
    createdAt: "2025-01-15"
  },
  {
    id: "ptil-019",
    number: 19,
    title: "You can ask Claude to reverse-engineer a goal",
    prompt: "I want to achieve [outcome] in [timeframe]. Work backwards from the goal: what would need to be true 1 month before? 1 week before? What should I do tomorrow?",
    whyItWorks: "Backward planning from the goal creates concrete stepping stones. It's easier to plan forward once you've mapped backward.",
    exampleOutput: "**Goal:** Launch product in 3 months\n\n**1 month before launch:** Beta testing complete, landing page live, waitlist of 500+\n\n**1 week before:** Final bug fixes, press outreach sent...\n\n**Tomorrow:** Finish MVP spec, reach out to 3 beta testers",
    tags: ["planning", "goals", "productivity"],
    worksWith: ["Claude", "GPT-4", "Gemini"],
    createdAt: "2025-01-15"
  },
  {
    id: "ptil-020",
    number: 20,
    title: "You can ask for analogies from different domains",
    prompt: "Explain [concept] using an analogy from cooking. Then explain it using an analogy from sports. Then from music.",
    whyItWorks: "Multiple analogies from different domains reveal different facets of the concept. One of them will click for any given learner.",
    exampleOutput: "**Cooking analogy:** APIs are like a restaurant menu. You don't need to know how the kitchen works—you just order from the menu and get what you asked for...\n\n**Sports analogy:** APIs are like the rules of basketball...",
    tags: ["explanation", "analogies", "learning"],
    worksWith: ["Claude", "GPT-4", "Gemini"],
    createdAt: "2025-01-15"
  },
  {
    id: "ptil-021",
    number: 21,
    title: "You can ask Claude to compress information ruthlessly",
    prompt: "Summarize [long text] in exactly 50 words. Every word must earn its place. No filler, no fluff.",
    whyItWorks: "Extreme compression forces prioritization. The constraint eliminates 'nice to have' details and keeps only what's essential.",
    exampleOutput: "The study tracked 10,000 remote workers over two years. Key finding: productivity rose 13% but collaboration declined. Teams took longer on joint projects. Hybrid arrangements (2-3 remote days) optimized both metrics. Recommendation: mandate overlap days for synchronous work.",
    tags: ["summarization", "constraints", "writing"],
    worksWith: ["Claude", "GPT-4", "Gemini"],
    createdAt: "2025-01-15"
  },
  {
    id: "ptil-022",
    number: 22,
    title: "You can ask for a 'second opinion' from a different perspective",
    prompt: "I got this advice: [advice]. Now pretend you're a completely different expert with an opposing philosophy. What advice would you give instead, and why might the original advice be wrong?",
    whyItWorks: "Single perspectives have blind spots. Forcing an opposing viewpoint reveals assumptions and alternatives you'd otherwise miss.",
    exampleOutput: "**Original advice:** 'Move fast and break things.'\n\n**Opposing expert (risk-averse CTO):** 'That philosophy created the mess we're cleaning up now. Here's why careful iteration beats speed...'",
    tags: ["decision-making", "perspectives", "advice"],
    worksWith: ["Claude", "GPT-4", "Gemini"],
    createdAt: "2025-01-15"
  },
  {
    id: "ptil-023",
    number: 23,
    title: "You can ask Claude to create a decision framework",
    prompt: "I need to decide between [options]. Create a scoring rubric with 5 weighted criteria. Then score each option and show me the math.",
    whyItWorks: "Structured frameworks externalize your reasoning and make trade-offs explicit. The scoring forces you to quantify gut feelings.",
    exampleOutput: "**Criteria (weighted):**\n1. Cost (25%)\n2. Time to implement (20%)...\n\n**Scoring:**\n| Option | Cost | Time | ... | Total |\n|--------|------|------|-----|-------|\n| A      | 8    | 6    | ... | 7.2   |",
    tags: ["decision-making", "frameworks", "analysis"],
    worksWith: ["Claude", "GPT-4", "Gemini"],
    createdAt: "2025-01-15"
  },
  {
    id: "ptil-024",
    number: 24,
    title: "You can ask for 'yes, and' brainstorming",
    prompt: "I have an idea: [idea]. Instead of critiquing it, build on it. Give me 5 ways to make it bigger, bolder, or more interesting. Say 'yes, and...' to each addition.",
    whyItWorks: "Improv-style brainstorming suspends judgment and expands possibilities. Criticism kills ideas early; 'yes, and' lets them grow first.",
    exampleOutput: "**Yes, and** what if you also made it multiplayer?\n**Yes, and** what if there was a leaderboard?\n**Yes, and** what if the top contributors got featured...",
    tags: ["brainstorming", "creativity", "ideation"],
    worksWith: ["Claude", "GPT-4", "Gemini"],
    createdAt: "2025-01-15"
  },
  {
    id: "ptil-025",
    number: 25,
    title: "You can ask Claude to translate jargon for different audiences",
    prompt: "Take this technical explanation: [text]. Rewrite it for: 1) An executive who has 30 seconds, 2) A non-technical teammate, 3) A customer FAQ.",
    whyItWorks: "The same information needs different framings for different audiences. This prompt does the translation work for you.",
    exampleOutput: "**For executive (30 sec):** We reduced server costs 40% by switching to serverless. No downtime, same performance.\n\n**For teammate:** Instead of paying for servers 24/7, we now only pay when someone actually uses the app...\n\n**For FAQ:** Your app will be just as fast, and we can offer this at a lower price because...",
    tags: ["communication", "translation", "audience"],
    worksWith: ["Claude", "GPT-4", "Gemini"],
    createdAt: "2025-01-15"
  }
];
```

---

## Seena Integration

Seena will be configured separately. The site should include the Seena SDK script in the layout, but trigger configuration will be done in the Seena dashboard.

```tsx
// Add Seena script to layout.tsx
// Ax will configure triggers in Seena dashboard
```

---

## Component Breakdown

### Shared Components
- `Header` — Logo (`{ P T I L S }` in Aboreto), nav links (Saved, About), mobile responsive
- `Footer` — "Built by Seena Labs" + links
- `PTILCard` — Card with photo header, number, title, tags (used in grid and saved page)
- `Tag` — Pill-style tag component (subtle, rounded)
- `Button` — Primary, secondary, icon variants (rounded corners)
- `Toast` — For "Copied!" feedback (slides in from bottom)

### Page-Specific Components
- `PTILGrid` — Responsive grid layout for cards
- `ExpandableSection` — For example output on detail page
- `CopyButton` — Copies to clipboard, shows toast
- `SaveButton` — Heart icon, toggles state with animation
- `PhotoBanner` — Wide image banner for detail page

---

## Animations & Interactions

**Design principle:** Subtle, gentle, calming. No bouncy or aggressive animations. Everything should feel smooth and unhurried.

### Card Hover
- Slight lift: `translateY(-2px)`
- Shadow increase: `shadow-sm` → `shadow-md`
- Transition: `200ms ease-out`

### Card Grid Load
- Cards fade in with gentle stagger (50ms delay between each)
- `opacity: 0 → 1`, `translateY(8px) → 0`
- Duration: `300ms ease-out`

### Save Animation
- Heart fills with color (lavender)
- Subtle scale pulse: `1 → 1.1 → 1`
- Duration: `200ms`

### Copy Feedback
- Button icon briefly changes to checkmark
- Toast slides in from bottom: "Copied to clipboard"
- Toast auto-dismisses after 2 seconds

### Expandable Sections
- Smooth height transition
- Content fades in
- Duration: `200ms ease-out`

### Page Transitions
- Simple fade between pages
- Duration: `150ms`

---

## Technical Requirements

### Performance
- Static generation for PTIL pages (ISR if adding content dynamically later)
- Images optimized with next/image
- Lighthouse score > 90

### SEO
- Meta tags for each PTIL page
- Open Graph images (can be simple branded cards)
- Sitemap generation

### Accessibility
- Keyboard navigation
- ARIA labels on interactive elements
- Color contrast AA compliant

### Mobile
- Fully responsive
- Touch-friendly targets (min 44px)
- Swipe to shuffle (optional, nice-to-have)

---

## File Structure

```
ptils/
├── app/
│   ├── layout.tsx
│   ├── page.tsx              # Home (card grid)
│   ├── til/
│   │   └── [id]/
│   │       └── page.tsx      # PTIL detail
│   ├── saved/
│   │   └── page.tsx          # Saved PTILs
│   └── about/
│       └── page.tsx          # About page
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── PTILCard.tsx
│   ├── PTILGrid.tsx
│   ├── PhotoBanner.tsx
│   ├── SaveButton.tsx
│   ├── CopyButton.tsx
│   ├── Tag.tsx
│   ├── ExpandableSection.tsx
│   └── Toast.tsx
├── data/
│   └── ptils.ts              # PTIL content with image URLs
├── lib/
│   ├── storage.ts            # localStorage helpers
│   └── utils.ts              # Helpers
├── styles/
│   └── globals.css           # Tailwind + custom styles
└── public/
    ├── logo.svg              # { P T I L S } logo
    └── og-image.png
```

---

## Launch Checklist

- [ ] All 25 PTILs entered and displaying correctly
- [ ] Shuffle works on home and detail pages
- [ ] Save/unsave works, persists in localStorage
- [ ] Copy button works with toast feedback
- [ ] About page is long enough for scroll trigger
- [ ] Seena SDK integrated and triggers configured
- [ ] Mobile responsive
- [ ] Deployed to Vercel
- [ ] Custom domain (optional: ptils.seenalabs.com or similar)

---

## Out of Scope (for MVP)

- User accounts / authentication
- Database backend
- Submission form for community PTILs
- Tag filtering
- Search
- Comments / reactions
- Email newsletter signup

These can be added post-launch based on study results.

---

## Success Criteria

The app is successful if:
1. Users can browse, shuffle, save, and copy PTILs without bugs
2. Seena triggers fire correctly at configured moments
3. We collect qualitative feedback through Seena
4. Site loads fast and looks good on mobile and desktop
