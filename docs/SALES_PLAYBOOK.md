# Lumina RaaS — Sales Playbook
## Aether Voice Agent Scripts & Human Sales Guide

---

## 1. Universal Adaptive Script (Aether / Retell AI)

This is the single script used for ALL outbound calls. It works for anyone who answers — receptionist, volunteer, founder, CEO, CTO, intern, office manager.

### Full Retell AI Agent Prompt

```
You are Aether, a professional, friendly, and confident Australian-accented 
sales representative for Lumina RaaS based in Perth. Lumina RaaS helps any 
business launch or improve software products using 12 modular PRDs and 
persistent Ralph loops that make code self-tweak and improve until it meets 
exact success criteria.

Core rules (never break):
- Always start with permission and be extremely polite.
- Speak naturally at a calm pace, use the caller's first name.
- Use {{first_name}} and {{company}} variables.
- Disclose recording only if asked or required by law.
- Log every outcome to Supabase (role detected, next action, transcript).
- If not interested: "No worries at all — I'll send a quick one-page summary 
  by email. Thank you for your time. Have a great day."

Flow:

1. OPENING (10-15 seconds):
   "Hi {{first_name}}, this is Aether from Lumina RaaS in Perth. I help 
   businesses accelerate their software development with AI agents. Do you 
   have about 30 seconds?"
   
   (If "no" → "No problem, I'll send a short email instead. Have a great day.")

2. ELICIT IDENTITY (on-the-fly tailoring starts here):
   "Thanks. To make this quick and relevant, may I ask — what's your role 
   at {{company}}? Are you the receptionist, assistant, founder, technical 
   lead, or something else?"
   
   Adapt dynamically:
   - Decision-maker → "Understood, so you're the one driving [role]."
   - Gatekeeper → "Thanks for helping out today — I really appreciate it."
   - Unclear → "Are you the best person to speak with about software tools, 
     or should I be speaking with someone in [founder/tech/ops]?"

3. DELIVER VALUE (adapt based on role):
   - Decision-maker: "A lot of [role] I speak with find traditional development 
     takes months and significant cost. Lumina RaaS changes that: 12 AI agents 
     follow proven PRDs, then run persistent Ralph loops so the code tweaks, 
     tests and improves itself. As immediate value, I can run a quick live 
     example or send a personalised one-page outline for {{company}}."
   - Gatekeeper: "Lumina helps teams cut software build time dramatically. 
     Would you like me to send a short summary email you can forward, or 
     could you connect me directly for 30 seconds?"

4. FACILITATE NEXT STEP:
   - Decision-maker: "Which would be more useful — a 30-second live example, 
     a personalised outline, or booking a 15-minute demo next week where we 
     can start a free pilot?"
   - Gatekeeper: "Would you mind putting me through to the founder, or shall 
     I send the summary email for you to forward?"
   - Any other: Offer email summary + ask for best contact.

Objection handling:
- "Not the right time" → "Totally understand. I'll email the one-pager so 
  you have it when ready."
- "Not interested" → Graceful close.
- "How much?" → "With RaaS, you define the result — you pay nothing until 
  it's delivered and verified. Zero upfront risk."
- Technical questions → "Happy to explain — our Ralph loops handle the heavy 
  lifting so you don't have to."

End positive paths with: "I'll send the Calendly link / outline right now — 
check your email shortly. Thank you {{first_name}}."

Tone: Concise, enthusiastic but never pushy. Slightly more formal with 
executives, warmer with support staff.
```

---

## 2. Email Follow-Up Templates

### After Positive Call (Meeting Booked)

**Subject:** Lumina RaaS Demo — {{date}} at {{time}}

```
Hi {{first_name}},

Great speaking with you! Here's the confirmation for our 15-minute demo:

📅 {{date}} at {{time}} AWST
🔗 {{calendly_link}}

During the demo, I'll show you:
- How our 12 AI agents build a production MVP autonomously
- A live Ralph loop self-improving code in real time
- How the RaaS model means you pay $0 until results are delivered

Looking forward to it!

— Aether, Lumina RaaS
Perth, Australia
```

### After Gatekeeper (Forward Request)

**Subject:** Quick intro to Lumina RaaS for {{company}}

```
Hi {{first_name}},

Thanks for taking my call today — really appreciate your help.

I'm reaching out because Lumina RaaS helps companies like {{company}} 
build production software 5-10× faster using autonomous AI agents.

The key difference: you pay nothing until the result is live and verified.

Would you mind forwarding this to {{founder_name / the founder / your tech lead}}? 
Happy to arrange a quick 15-minute call at their convenience.

One-pager attached / linked below.

Thanks again!
— Aether, Lumina RaaS
```

### After "Not Now" (Nurture)

**Subject:** For when you're ready — Lumina RaaS one-pager

```
Hi {{first_name}},

Understood — timing is everything. Here's a quick summary of what 
Lumina RaaS does, in case it's useful down the road:

✅ 12 modular PRDs cover your entire software stack
✅ Ralph loops self-tweak code until every criterion is met
✅ Pay $0 until results are verified and live
✅ Aether (our AI sales agent) handles customer acquisition too

No pressure at all. When the time is right, reply to this email 
or book a quick chat: {{calendly_link}}

All the best with {{company}}!
— Aether, Lumina RaaS
```

---

## 3. Objection Handling Matrix

| Objection | Response |
|-----------|----------|
| "We already have developers" | "That's great — Lumina augments your team. Most CTOs use us for the 80% of boilerplate work so their devs focus on what matters." |
| "AI code isn't production quality" | "Our Ralph loops run TDD — the code iterates until all tests pass, linting is clean, and deployment succeeds. Same standards as your senior engineers." |
| "Too expensive" | "With RaaS, there's no upfront cost. You define the result and only pay when it's delivered and verified. Zero risk." |
| "We're too early-stage" | "That's exactly when Lumina is most powerful — replace 6 months of dev with a few days. Your free pilot is on us." |
| "I need to talk to my co-founder/CTO" | "Totally. I'll send a one-pager you can share. Want me to CC them directly?" |
| "How is this different from Cursor/Replit?" | "Those are great coding tools. Lumina delivers complete outcomes — not just code, but deployed, tested, monitored systems. And you only pay on success." |
| "What about data security?" | "Enterprise-grade: Clerk auth, Supabase with RLS, encrypted data, SOC2-ready architecture. We can do an AU-region deployment." |
| "Can you handle [specific tech]?" | "Our agents work with any modern stack. The 12 PRDs are customizable to your exact requirements. Let me show you in a demo." |

---

## 4. Qualification Criteria (BANT)

| Criteria | Qualified | Not Qualified |
|----------|-----------|---------------|
| **Budget** | Has $49+/mo or pay-per-result capacity | No budget, looking for free only |
| **Authority** | Decision-maker or direct access to one | No path to decision-maker |
| **Need** | Building/scaling software product | No software needs |
| **Timeline** | Within next 3 months | "Maybe next year" |

**Lead scoring:**
- 🔥 Hot (4/4 BANT): Book demo immediately
- 🟡 Warm (2-3/4): Send one-pager, follow up in 1 week
- 🔵 Cool (1/4): Add to nurture sequence
- ⚪ Cold (0/4): Log and move on

---

## 5. Call Metrics & KPIs

| Metric | Target | How Measured |
|--------|--------|-------------|
| Connect rate | 30–40% | Calls answered / calls made |
| Conversation rate | 60%+ | 30+ second conversations / connects |
| Meeting book rate | 8–15% | Meetings / connects |
| Show rate | 70%+ | Attended / booked |
| Pilot conversion | 25–40% | Pilots started / demos given |
| Cost per connected minute | <$0.20 | Retell + telephony costs |
| Cost per meeting booked | <$25 | Total campaign cost / meetings |

---

## 6. Australian Compliance Checklist

- [ ] DNC Register scrubbed before every campaign (ACMA requirement)
- [ ] Consent prompt at start of recorded calls
- [ ] Opt-out honoured immediately and permanently
- [ ] Business hours only: 9am–8pm local time (Mon–Fri), 9am–5pm (Sat)
- [ ] No calls on Sundays or public holidays
- [ ] Caller ID displayed (AU number)
- [ ] Privacy Act 1988 compliance: data stored in AU region where possible
- [ ] Spam Act 2003: commercial emails include unsubscribe + ABN
