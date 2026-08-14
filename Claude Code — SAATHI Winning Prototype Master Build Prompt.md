# SAATHI — MASTER PROTOTYPE BUILD PROMPT

You are the **lead product engineer, senior UX/UI designer, AI/ML engineer, startup CTO, and hackathon-winning prototype architect** for this project.

We are building the prototype for the **Entrepreneurship Hackathon by STPI × Techniche, IIT Guwahati**.

Our selected official problem statement is:

> **Integrated Rural Life-Support: Interoperable Software Systems for Predictive Healthcare & Agricultural Risk Mitigation**

The goal is to create a **working, polished, judge-ready prototype**, not a static demo and not a generic CRUD application.

The prototype must feel like a real startup product that could be deployed after the hackathon.

---

# 1. PRODUCT

## Name

# SAATHI

### Rural Resilience & Care Intelligence

### Core positioning

> **SAATHI connects the health of the household with the health of the farm.**

### Core promise

> **Predict. Prevent. Plan. Protect.**

### Emotional thesis

> **A farmer shouldn't have to choose between protecting his livelihood and protecting himself.**

---

# 2. THE PROBLEM

Rural agriculture and healthcare are deeply interconnected, but digital systems remain siloed.

Agricultural systems understand:

- crop
- weather
- farm activity
- agricultural workload

Healthcare systems understand:

- symptoms
- health risks
- health-worker observations

But they often do not reason about them together.

Example:

A farmer plans pesticide spraying during extreme heat.

Agriculture knows the spraying is needed.

Weather knows conditions are dangerous.

Healthcare may only become involved after symptoms appear.

SAATHI creates the missing intelligence layer.

---

# 3. THE CORE PRODUCT INSIGHT

SAATHI is NOT:

- a generic farmer app
- a generic healthcare app
- a weather app
- a chatbot
- a crop recommendation app
- a disease diagnosis app

SAATHI is:

# **A rural decision-intelligence layer connecting Agriculture + Healthcare + Environment + Household Resilience.**

The platform operates at three levels:

### LEVEL 1 — INDIVIDUAL

> Is this agricultural activity risky for this farmer right now?

### LEVEL 2 — HOUSEHOLD

> Is this household becoming vulnerable to combined health, environmental and agricultural pressures?

### LEVEL 3 — COMMUNITY

> Are multiple households showing an emerging risk pattern?

---

# 4. THE MOST IMPORTANT PRODUCT FEATURE

Do NOT make a "risk score dashboard" the primary product.

The hero feature is:

# **ADAPTIVE FARM PLAN**

SAATHI should not simply tell a farmer:

> "Risk = 87."

It should answer:

> **"What should I do differently today?"**

Example:

Ramesh:
- Cotton farmer
- 2 acres
- Pesticide spraying planned
- Extreme heat
- High humidity

Original plan:

6:00 AM — Irrigation
10:00 AM — Fertilizer
1:00 PM — Pesticide
3:00 PM — Field work

SAATHI detects elevated occupational risk.

It generates:

### SAFER FARM PLAN

6:00 AM — Irrigation ✓

10:00 AM — Fertilizer ✓

1:00 PM — Pesticide ❌ HIGH RISK

5:00 PM–7:30 PM — Pesticide ✓ SAFER WINDOW

The user must clearly understand:

> **SAATHI doesn't just warn the farmer. It helps redesign agricultural work around the farmer's wellbeing.**

This is the primary product innovation.

---

# 5. PROTOTYPE OBJECTIVE

The final prototype must allow a judge to understand the entire product in approximately **3–5 minutes** without explanation from us.

The ideal demo flow is:

```text
Ramesh
  ↓
Household
  ↓
Farm
  ↓
Today's planned activity
  ↓
Environment + weather
  ↓
SAATHI Intelligence
  ↓
Individual Risk
  ↓
Household Resilience
  ↓
Adaptive Farm Plan
  ↓
Voice Advisory
  ↓
Health Signal
  ↓
Health Worker
  ↓
Community Risk Cluster
  ↓
Offline Mode
  ↓
Sync
```

Everything in the implementation should support this flow.

---

# 6. IMPORTANT: FIRST INSPECT THE REPOSITORY

Before writing code:

1. Inspect the entire repository.
2. Identify the existing stack.
3. Identify existing components.
4. Identify existing routes.
5. Identify existing database/schema.
6. Identify existing APIs.
7. Identify existing assets.
8. Identify whether authentication already exists.
9. Identify whether a design system already exists.
10. Identify what can be reused.

Do NOT unnecessarily replace an existing working architecture.

If the repository is empty, use the recommended stack below.

Before implementation, create a short internal implementation plan.

Then start building.

Do NOT spend the entire task only discussing architecture.

---

# 7. RECOMMENDED STACK

If there is no existing stack, use:

## Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

## UI

Use a high-quality component system such as:

- shadcn/ui

Use:

- Lucide icons
- clean cards
- charts where genuinely useful
- responsive layouts
- accessible components

## Backend

Prefer:

- Next.js API routes/server actions if sufficient for the prototype

OR:

- FastAPI if the repository already uses Python/backend separation.

Do not introduce unnecessary microservices.

## Database

Prefer:

- Supabase/PostgreSQL

If a real backend is not available, use a clean local/mock repository abstraction so that replacing mock data with a database later is easy.

## Offline

Use:

- IndexedDB
- service worker/PWA functionality

The offline experience must be real enough to demonstrate.

## AI

Use a transparent risk engine.

For the prototype, deterministic scoring/rules are acceptable and preferred over pretending to have clinically validated ML.

If ML is useful, use a lightweight model.

---

# 8. DESIGN DIRECTION

This is extremely important.

The UI must NOT look like:

- a college project
- a generic admin dashboard
- a Bootstrap template
- a generic AI SaaS
- an over-designed futuristic dashboard

It should look like a **premium Indian deep-tech/social-impact startup**.

Think:

- calm
- trustworthy
- human
- modern
- sophisticated
- minimal
- premium
- rural-context aware

The product should feel credible enough that a government health officer or FPO could imagine using it.

---

# 9. VISUAL IDENTITY

Use a refined visual system.

Primary visual direction:

- deep charcoal
- warm off-white
- agricultural green
- muted earth tones
- subtle amber/orange for warnings
- red only for serious/high-risk states

Do NOT use excessive gradients.

Do NOT use neon colors.

Do NOT use excessive glassmorphism.

Do NOT use random purple AI gradients.

Do NOT make everything rounded pills.

Use visual hierarchy.

Typography:

- large, confident headlines
- readable body text
- strong numeric hierarchy
- generous whitespace

The interface should feel premium and intentional.

---

# 10. UX PRINCIPLES

## Principle 1 — Action over information

Never show data merely because we have it.

Every important piece of data should answer:

> "So what should the user do?"

---

## Principle 2 — Farmer first

The farmer should NOT need technical knowledge.

Avoid:

- complicated graphs
- technical terms
- long forms
- dense tables

Use:

- large actions
- icons
- simple language
- voice
- visual risk indicators

---

## Principle 3 — Health worker first

Health workers need:

- priority
- context
- actionable information
- efficient workflows

Do not overwhelm them with unnecessary information.

---

## Principle 4 — Progressive disclosure

Show:

1. What is happening?
2. Why?
3. What should I do?
4. Details if needed.

---

# 11. USER ROLES

Implement role switching for the prototype.

Roles:

### FARMER

Primary experience.

### HEALTH WORKER

ASHA/ANM/health worker experience.

### AGRICULTURAL WORKER

Agricultural extension/FPO-style experience.

Use demo authentication or a role selector if full authentication is unnecessary.

The role selector should look professional.

---

# 12. FARMER EXPERIENCE

Create a premium farmer home dashboard.

The home screen should immediately answer:

# "How safe is my work today?"

Example:

### GOOD MORNING, RAMESH

**Today · 14 August**

---

### Household Resilience

# 64 / 100

### Declining

Primary drivers:

🌡️ High heat

🧪 Pesticide activity

🌾 High farm workload

Do not make this feel like a judgment of the farmer.

Use language:

> "Your household is facing higher-than-usual combined pressure today."

---

# 13. TODAY'S FARM PLAN

Show a beautiful timeline.

Example:

### 06:00
Irrigation
✓ Recommended

### 10:00
Fertilizer
✓ Recommended

### 13:00
Pesticide spraying
🔴 High risk

### 17:00
Pesticide spraying
🟢 Safer window

Make the adaptive change visually obvious.

Use a "Why?" interaction.

---

# 14. RISK EXPLANATION

When the user opens the risk card:

Show:

# HIGH OCCUPATIONAL RISK

### Why?

🌡️ Heat
+31

💧 Humidity
+18

🧪 Pesticide exposure
+24

⏱️ Work duration
+14

Total:

# 87 / 100

Important:

This is a prototype risk model, NOT a medically validated diagnostic score.

Do not present it as clinical truth.

Use language:

> "Estimated occupational-risk signal"

rather than:

> "Medical diagnosis."

---

# 15. SAFE WORK WINDOW

This must be one of the most visually impressive screens.

Show:

# SAFER WORK WINDOW

## 5:00 PM — 7:30 PM

Then explain:

> "Current environmental conditions create elevated exposure risk during the afternoon. Consider shifting outdoor chemical-related work to the recommended window and follow product-label safety instructions."

Include:

### Why this time?

Temperature
Humidity
Weather

Do not invent precise scientific thresholds unless the implementation has them.

If values are simulated, clearly label them as demo/simulated data internally and avoid misleading claims.

---

# 16. VOICE EXPERIENCE

Implement a real-looking voice interface.

Main button:

# 🎙️ Ask SAATHI

Example:

> "Aaj mujhe kya karna chahiye?"

SAATHI responds:

> "Aaj garmi zyada hai. Pesticide spraying dopahar mein avoid karein. Aapke liye shaam ka recommended window 5 baje se 7:30 baje tak hai."

Add:

- Hindi
- English

If technically feasible, add one additional Indian language.

Do NOT claim support for all Indian languages.

If actual voice APIs are unavailable, build a polished simulated voice interaction with clear architecture for real integration later.

---

# 17. SYMPTOM REPORTING

Add a simple:

# "How are you feeling?"

interface.

Use simple symptom options:

- Headache
- Dizziness
- Nausea
- Breathing difficulty
- Weakness
- No symptoms

Also allow voice input if feasible.

Example:

> "Mujhe chakkar aa raha hai."

The system should NOT diagnose.

Instead:

### Elevated occupational-health risk signal

Reason:

- recent agricultural activity
- exposure context
- environmental conditions
- reported symptom

Action:

> "Consider contacting your health worker / appropriate clinical service."

---

# 18. HEALTH WORKER DASHBOARD

Create a completely different interface.

It should feel like a professional field-health dashboard.

Header:

# Village Health Overview

Show:

### High Priority
12

### Moderate
27

### Normal
143

Then:

# Priority Cases

Example:

### Ramesh Kumar
🔴 HIGH

Reason:
Recent agricultural exposure + reported dizziness + heat conditions

Action:
Follow-up recommended.

Do not expose unnecessary health data.

---

# 19. COMMUNITY RISK RADAR

This should be a major visual.

Create a village-level map or spatial visualization.

Show:

🟢 Normal
🟡 Moderate
🔴 High

Example:

### COMMUNITY RISK CLUSTER

Area: North Field Cluster

8 households

Common signals:

- high heat exposure
- pesticide activity
- similar reported symptoms

Then:

# Elevated occupational-health risk detected

This demonstrates the transition:

### Individual → Household → Community

---

# 20. AGRICULTURAL WORKER DASHBOARD

Create a simple agricultural intelligence view.

Show:

### Crop activity

Cotton

### Upcoming activities

- irrigation
- fertilizer
- pesticide
- harvest

### Risk-aware recommendation

> "Current conditions create elevated occupational risk for pesticide application. Consider the recommended work window."

This proves the platform is not only healthcare.

---

# 21. HOUSEHOLD RESILIENCE ENGINE

Create a transparent prototype calculation.

Do NOT create a fake black-box AI.

Build a clear engine such as:

```text
Household Resilience
=
Health Pressure
+
Environmental Pressure
+
Agricultural Workload
+
Available Workforce
```

Normalize into:

0–100.

Use sensible weights and document them in code.

The UI should show:

### Primary drivers

not the entire formula.

Create the engine as a separate module:

`/lib/intelligence/household-resilience`

or equivalent.

Make it easy to modify later.

---

# 22. INDIVIDUAL RISK ENGINE

Create a separate module.

Inputs:

- temperature
- humidity
- activity
- exposure
- work duration
- farmer vulnerability signals

Outputs:

```text
riskScore
riskLevel
drivers[]
recommendedAction
recommendedWindow
```

Make the output deterministic and testable.

Include unit tests.

---

# 23. COMMUNITY INTELLIGENCE

Create an aggregation engine.

Inputs:

- anonymized/appropriate risk signals
- household location/cluster
- activity
- time
- symptom/exposure signals

Output:

```text
cluster
riskLevel
householdCount
dominantSignals[]
recommendedAction
```

The prototype should demonstrate:

8 similar households

↓

community pattern

↓

health-worker warning.

---

# 24. PRIVACY ARCHITECTURE

This must be visible in the prototype.

Create a small privacy/consent section.

Show:

### Data sharing

Health information

✓ Consent required

### Agriculture information

✓ Operational sharing

### Community analytics

✓ Aggregated / privacy-protected

Include:

- consent status
- role
- data purpose
- last updated

Do NOT make the system appear to expose raw medical records to agricultural workers.

---

# 25. OFFLINE MODE — MUST ACTUALLY WORK

Implement:

### Network status indicator

When online:

🟢 Connected

When offline:

🟠 Offline Mode

In offline mode:

- existing farmer data remains available
- risk calculations still work
- new activities can be recorded
- symptom reports can be stored locally
- advisory can still be shown where cached data/model allows

When network returns:

# SYNCING

Then:

# ✓ SYNC COMPLETE

Implement this with IndexedDB or equivalent.

Do not fake the entire interaction with a static animation.

---

# 26. DEMO MODE

Create a polished:

# DEMO MODE

This is extremely important for the hackathon.

The judges should be able to experience the full story without needing real-world external data.

Add a controlled scenario:

## "Ramesh — Cotton Farmer"

Initial state:

- normal household resilience
- planned pesticide activity

Then allow:

### SIMULATE HEATWAVE

This changes:

- environmental risk
- individual risk
- household resilience
- farm schedule

Then:

### REPORT SYMPTOM

This creates:

- health risk signal
- health-worker priority

Then:

### SHOW COMMUNITY CLUSTER

This creates:

- village-level risk cluster

Then:

### GO OFFLINE

Demonstrate local operation.

Then:

### RESTORE NETWORK

Demonstrate sync.

This should allow us to run the entire final presentation in under 5 minutes.

---

# 27. DEMO SCENARIO

The canonical demo is:

## RAMESH

2-acre cotton farmer.

### Initial:

Household resilience:

78 / 100

Farm plan:

Normal.

---

### Trigger:

Click:

# SIMULATE HEATWAVE

System updates:

Temperature ↑

Humidity ↑

Outdoor risk ↑

---

### Result:

Individual occupational risk:

# 87 — HIGH

Household resilience:

# 64 — DECLINING

---

### Adaptive Farm Plan

Pesticide:

1 PM ❌

5–7:30 PM ✓

---

### Voice

Click:

# ASK SAATHI

Play/show Hindi recommendation.

---

### Health

Click:

# REPORT SYMPTOM

"Dizziness"

System generates:

# ELEVATED OCCUPATIONAL-HEALTH RISK

---

### Health Worker

Open dashboard.

Ramesh appears:

# HIGH PRIORITY

---

### Community

Show:

# 8 HOUSEHOLDS

Common signals.

# COMMUNITY RISK CLUSTER

---

### Offline

Turn off network.

Add event.

System works.

Restore network.

# SYNC COMPLETE

This is the complete story.

---

# 28. NAVIGATION

Use a clean sidebar/bottom navigation.

Farmer:

- Home
- Farm Plan
- Health
- Ask SAATHI
- Profile

Health Worker:

- Overview
- Priority
- Community
- Follow-ups

Agricultural Worker:

- Farms
- Activities
- Risk
- Planning

Do not overcomplicate navigation.

---

# 29. RESPONSIVE DESIGN

The prototype must work beautifully on:

- desktop
- tablet
- mobile

The farmer experience should prioritize mobile.

The health-worker experience can prioritize desktop/tablet.

No broken layouts.

No horizontal scrolling.

---

# 30. MICROINTERACTIONS

Use tasteful microinteractions.

Examples:

- risk score animation
- smooth state transitions
- timeline updates
- sync progress
- toast notifications
- subtle hover states
- loading skeletons
- success states

Do NOT over-animate.

The product should feel calm and trustworthy.

---

# 31. EMPTY / LOADING / ERROR STATES

Implement proper:

- loading states
- empty states
- error states
- offline states
- success states

Do not leave blank screens.

---

# 32. ACCESSIBILITY

Implement:

- sufficient contrast
- keyboard navigation where applicable
- readable text
- clear icons
- accessible buttons
- meaningful labels

---

# 33. DATA

Create a realistic seeded demo dataset.

Use Indian-context names and locations.

Example:

- Ramesh
- Sita
- Mahesh
- Sunita

Use a fictional village.

Do NOT use real people's private data.

Create enough households to demonstrate community clustering.

Example:

20–50 demo households.

Use realistic but clearly synthetic data.

---

# 34. NO FAKE CLAIMS

This is critical.

Never display:

- "99.8% accurate"
- "clinically validated"
- "AI diagnosed"
- "government approved"
- "ABDM integrated"

unless actually true and implemented.

Use:

- "prototype"
- "risk signal"
- "decision support"
- "architecture-ready"
- "simulated demo data"

where appropriate.

---

# 35. FHIR / ABDM / AGRISTACK

The challenge expects interoperability.

For the prototype:

Create clean adapter interfaces.

For example:

```text
HealthAdapter
AgriAdapter
WeatherAdapter
```

If actual sandbox credentials/API are available, integrate them.

If not:

Create realistic mock adapters.

Label them in developer documentation as:

> sandbox/mock integration.

Never pretend an integration is live.

---

# 36. CODE QUALITY

This is not throwaway hackathon code.

Use:

- TypeScript
- reusable components
- clear folder structure
- modular intelligence engine
- typed data models
- error handling
- validation
- tests for core risk logic
- environment variables
- no secrets committed

Avoid:

- huge monolithic components
- duplicated logic
- hardcoded UI everywhere
- random inline styles
- magic numbers without documentation

---

# 37. BUILD ORDER

Follow this sequence.

## Phase 1
Inspect repository.

## Phase 2
Set up/repair architecture.

## Phase 3
Build design system.

## Phase 4
Build farmer dashboard.

## Phase 5
Build intelligence engine.

## Phase 6
Build adaptive farm plan.

## Phase 7
Build symptom/health workflow.

## Phase 8
Build health-worker dashboard.

## Phase 9
Build community intelligence.

## Phase 10
Build offline storage/sync.

## Phase 11
Build demo mode.

## Phase 12
Polish UI/UX.

## Phase 13
Testing.

## Phase 14
Prepare demo.

Do NOT build secondary features before the core end-to-end flow works.

---

# 38. DEFINITION OF DONE

The prototype is considered successful only when this works:

### Farmer:

Ramesh logs in.

↓

Sees household resilience.

↓

Sees farm plan.

↓

Heatwave changes risk.

↓

Risk engine calculates elevated risk.

↓

Adaptive farm plan changes.

↓

Farmer can hear advisory.

↓

Farmer reports symptom.

↓

Health signal generated.

↓

Health worker sees priority case.

↓

Community cluster appears.

↓

Offline mode works.

↓

Sync works.

This entire journey must be functional.

---

# 39. FINAL UI/UX QUALITY BAR

Before saying the prototype is complete, inspect every screen.

Ask:

### Would an IIT/STPI judge believe this is a serious startup?

### Would a farmer understand the main action?

### Would a health worker understand what requires attention?

### Is the healthcare component genuinely integrated?

### Is agriculture genuinely integrated?

### Is the cross-domain intelligence visible?

### Does the product look premium?

### Does the demo tell one story?

### Does anything look like a generic template?

If yes, fix it.

---

# 40. CRITICAL PRODUCT PRINCIPLE

Do not optimize for number of features.

Optimize for:

# **ONE UNFORGETTABLE EXPERIENCE**

The judge should remember:

> Ramesh planned to spray at 1 PM.

> SAATHI understood the combined health + environmental + agricultural risk.

> SAATHI changed the farm plan.

> Then the health worker saw the emerging risk.

> Then the village-level pattern appeared.

That is the prototype.

---

# 41. FINAL COMMAND

Start now.

First:

1. Inspect the repository.
2. Understand the current codebase.
3. Create an implementation plan.
4. Build the design system.
5. Build the end-to-end Ramesh demo.
6. Make the intelligence engine functional.
7. Make offline mode functional.
8. Make the health-worker workflow functional.
9. Make the community intelligence functional.
10. Polish everything to a premium startup level.
11. Test the entire flow.
12. Run the application.
13. Fix all obvious bugs.
14. Provide a concise final report containing:
   - what was built
   - how to run it
   - demo credentials if needed
   - key routes
   - key architecture decisions
   - known limitations
   - what remains for production

Do not stop at planning.

Do not ask me to manually create every component.

Make strong reasonable engineering decisions yourself.

If a requirement is technically impossible in the current environment, implement the strongest honest prototype alternative and clearly document the limitation.

Most importantly:

# BUILD A PRODUCT THAT FEELS REAL.

The goal is not to impress another developer.

The goal is for a judge to open SAATHI and immediately think:

> **“This solves a real problem, this is technically serious, and I can see this becoming a real startup.”**