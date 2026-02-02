# Product Discovery Orchestrator

Universal workflow for validating product ideas using Lean Product Playbook methodology.

## Overview

This orchestrator executes a 4-phase validation process:
1. **INTERVIEW** - Conversational discovery of idea using Product Pyramid
2. **CLARIFY** - Refine understanding and confirm hypotheses
3. **RESEARCH** - Spawn 5-8 parallel agents for comprehensive research
4. **REPORT** - Generate 4 deliverables (Research, Feasibility, PMF Score, Action Plan)

**Key principle**: User provides rough idea → Skill transforms it into validated, actionable plan

---

## Phase 1: INTERVIEW (Conversational Discovery)

### 1.1 Welcome & Context Setting

Greet user warmly and explain the process:

```markdown
Welcome to Product Discovery! 🚀

I'm here to help you validate your product idea using the Lean Product Playbook methodology.

Over the next 15-25 minutes, we'll:
1. **Interview** (5-10 min) - Explore your idea through the Product-Market Fit Pyramid
2. **Research** (10-15 min) - I'll spawn research agents to validate hypotheses
3. **Report** - You'll receive 4 comprehensive reports

Let's start with understanding your idea. Don't worry about having all the answers—this is a conversation, not an exam.
```

### 1.2 Conversational Interview

Load interview guide from `@.claude/skills/Product-Discovery/shared/interview-guide.md`.

**Interview Structure** (Adaptive - adjust based on responses):

#### Module A: Target Customer (Who?)
Start broad, then narrow:
1. "What product idea are you considering?" (Get initial pitch)
2. "Who specifically is this for?" (Not "everyone")
   - If vague: "Can you describe a specific person who has this problem?"
   - Probe: Demographics, role, behaviors
3. "Walk me through a day in their life related to this problem"
   - Look for specific pain points

**Capture**:
- Customer segment(s)
- Specific persona traits
- Context of problem

#### Module B: Underserved Needs (What problem?)
Dig into the pain:
1. "What problem are they trying to solve?" (Their words, not yours)
2. "How important is this problem to them?" (Scale: 1-10, why?)
3. "How do they solve it today?" (Current alternatives/workarounds)
4. "How satisfied are they with current solutions?" (Scale: 1-10, why?)
5. "What frustrates them most about current solutions?"

**Capture**:
- Core pain points (list)
- Importance rating (per pain point)
- Current satisfaction rating (per pain point)
- **Opportunity Gap** = High Importance + Low Satisfaction

#### Module C: Value Proposition (Why you?)
Explore differentiation:
1. "How will your solution be different from what exists?"
2. "What will make customers choose you over alternatives?"
3. Apply Kano Model:
   - "What features are absolutely required (must-haves)?"
   - "What performance attribute will you excel at?"
   - "What will surprise and delight users?"

**Capture**:
- Key differentiators
- Must-have features (table stakes)
- Performance dimension (where you compete)
- Delighters (unique wow factors)

#### Module D: Feature Set (What to build?)
Scope the MVP:
1. "If you could only build 3 features for your first version, what would they be?"
2. For each feature:
   - "Why is this critical?"
   - "How will you know it's successful?"
3. "What are you explicitly NOT building in V1?"

**Capture**:
- MVP feature list (prioritized)
- Success criteria per feature
- Out-of-scope items (important!)

### 1.3 Interview Output

Save transcript to workspace as `interview-transcript.md`:

```markdown
# Product Discovery Interview

**Date**: [MMDD-YY]
**Product Idea**: [Name/Description]

## Target Customer
[Persona details, segment, context]

## Underserved Needs
| Need | Importance (1-10) | Current Satisfaction (1-10) | Opportunity Gap |
|------|-------------------|----------------------------|-----------------|
| ... | ... | ... | ... |

## Value Proposition
**Differentiators**: [Key points]

**Kano Analysis**:
- Must-haves: [List]
- Performance: [Dimension you'll win on]
- Delighters: [Unique features]

## MVP Feature Set
1. [Feature] - [Why critical] - [Success metric]
2. [Feature] - [Why critical] - [Success metric]
3. [Feature] - [Why critical] - [Success metric]

**Out of Scope for V1**: [List]

## Next Steps
Proceeding to research phase to validate hypotheses.
```

---

## Phase 2: CLARIFY (Synthesis & Confirmation)

### 2.1 Synthesize Findings

Review interview transcript and identify:
- **Clear**: Well-defined aspects
- **Ambiguous**: Areas needing clarification
- **Gaps**: Missing critical information

### 2.2 Confirm with User

If ambiguities or gaps exist, ask follow-up questions:

```markdown
Great conversation! Let me confirm a few things before I start research:

1. [Clarifying question about customer segment]
2. [Question about key assumption]
3. [Question about scope/constraints]
```

### 2.3 Finalize Research Hypotheses

Based on clarified understanding, formulate testable hypotheses:

**Market Hypotheses**:
- H1: Target market size is >$X
- H2: Competitors have satisfaction gaps in [areas]

**Technical Hypotheses**:
- H3: Solution is technically feasible with [tech stack]
- H4: Development complexity is [Low/Med/High]

**Product Hypotheses**:
- H5: Similar products show [pattern]
- H6: Target customers exhibit [behavior]

---

## Phase 3: RESEARCH (Parallel Agent Execution)

### 3.1 Create Workspace

```
/research/product-ideas/MMDD-<idea-slug>-YY/
├── raw/                  # Agent outputs go here
├── interview-transcript.md (from Phase 1)
```

**Naming**:
- idea-slug: kebab-case from idea name
- Timestamp: MMDD-<slug>-YY format

### 3.2 Select Agents

Load agent selection from `@.claude/skills/Product-Discovery/shared/agent-selection.md`.

**Default Configuration** (5-8 agents):

**Core Agents** (Always spawn):
1. **market-researcher** - TAM, competitors, market dynamics
2. **tech-researcher** - Feasibility, complexity, risks
3. **content-researcher** - Case studies, similar products

**Conditional Agents** (Spawn based on idea complexity):
4. **financial-researcher** - If business model questions exist
5. **team-researcher** - If target customer insights needed

**Support Agents** (Always spawn):
6. **quality-reviewer** - Gap analysis, contradictions
7. **synthesizer** - Consolidate all findings

### 3.3 Spawn Agents in Parallel

Launch selected agents with identical structure:

```
Task: [agent-name]
Model: haiku (for speed, except synthesizer uses sonnet)

Prompt:
"Research [product idea] to validate hypotheses.

**Product Idea**: [1-paragraph summary from interview]
**Target Customer**: [Persona from interview]
**Key Hypotheses**: [List from Phase 2]

**Workspace**: [workspace-path]
**Output to**: [workspace-path]/raw/agent-[agent-name].md

**Your Focus** (as [agent-name]):
[Agent-specific focus area]

**Research Questions**:
[Agent-specific questions derived from interview]

You have access to all MCP tools (perplexity, exa, parallel-search). Make autonomous calls to gather comprehensive data.

Use standardized emoji format (see @.claude/skills/Product-Discovery/shared/output-templates.md).

Save findings to workspace path provided."
```

**Agent-Specific Prompts**:

**market-researcher**:
- Focus: TAM/SAM/SOM, market growth, competitive landscape
- Questions:
  - What is the total addressable market for [idea]?
  - Who are the main competitors? What are their strengths/weaknesses?
  - What market trends support or challenge this idea?

**tech-researcher**:
- Focus: Technical feasibility, complexity, maturity
- Questions:
  - Is [solution] technically feasible with current technology?
  - What are the main technical risks?
  - What is the estimated complexity (Low/Med/High)?

**content-researcher**:
- Focus: Similar products, case studies, lessons learned
- Questions:
  - What similar products exist? What happened to them?
  - What patterns emerge from successful/failed products?
  - What lessons can we learn?

**financial-researcher** (if spawned):
- Focus: Business model, revenue potential, unit economics
- Questions:
  - What business models work for this category?
  - What is realistic revenue potential?
  - What are typical CAC and LTV?

**team-researcher** (if spawned):
- Focus: Target customer research, behavior patterns
- Questions:
  - What do we know about [target customer] behavior?
  - What similar pain points do they have?
  - Where do they discover solutions?

### 3.4 Wait for Completion

Wait for ALL agents to complete before proceeding.

**If agent fails**:
- Log failure
- Continue with remaining agents
- Flag incomplete research in final report

---

## Phase 4: REPORT (Generate Deliverables)

### 4.1 Research Report

Read all agent outputs from `/raw/` and consolidate:

```markdown
# Research Report: [Product Idea]

**Date**: MMDD-YY
**Research Depth**: Deep (5-8 agents)
**Confidence**: High | Medium | Low

---

## Executive Summary
[3-4 paragraph overview of key findings]

## Market Analysis
[From market-researcher]
- TAM/SAM/SOM
- Market dynamics
- Competitive landscape
- Key trends

## Technical Feasibility
[From tech-researcher]
- Feasibility assessment
- Technical risks
- Complexity rating
- Technology recommendations

## Case Studies & Learnings
[From content-researcher]
- Similar products analyzed
- Success patterns
- Failure patterns
- Key lessons

## Target Customer Insights
[From team-researcher if available]
- Behavior patterns
- Pain point validation
- Discovery channels

## Financial Viability
[From financial-researcher if available]
- Business model options
- Revenue potential
- Unit economics

## Synthesis
[From synthesizer]
- Cross-agent insights
- Contradictions resolved
- Confidence assessment

## Data Quality
- Agents: [X/Y success]
- MCP tools used: [List]
- Confidence level: [High/Med/Low]
```

Save to: `[workspace]/research-report.md`

### 4.2 Feasibility Assessment

Generate Go/No-Go recommendation:

```markdown
# Feasibility Assessment: [Product Idea]

## Overall Recommendation

🟢 **GO** | 🟡 **PROCEED WITH CAUTION** | 🔴 **NO-GO**

**Confidence**: [High/Med/Low]

---

## Assessment Breakdown

### Problem-Solution Fit
**Rating**: ⭐⭐⭐⭐☆ (4/5)

- ✅ Strengths: [List]
- ⚠️ Concerns: [List]
- ❓ Open Questions: [List]

### Market Opportunity
**Rating**: ⭐⭐⭐⭐⭐ (5/5)

- Market size: [TAM/SAM/SOM]
- Growth: [Trend]
- Competition: [Level]

### Technical Risk
**Rating**: ⭐⭐⭐☆☆ (3/5)

- Feasibility: [High/Med/Low]
- Complexity: [Low/Med/High]
- Risks: [List]

### Overall Readiness
**Rating**: ⭐⭐⭐⭐☆ (4/5)

[Summary paragraph]

---

## Decision Framework

| Criteria | Weight | Score (0-5) | Weighted |
|----------|--------|-------------|----------|
| Problem-Solution Fit | 30% | [X] | [X*0.3] |
| Market Opportunity | 30% | [X] | [X*0.3] |
| Technical Feasibility | 25% | [X] | [X*0.25] |
| Competitive Position | 15% | [X] | [X*0.15] |
| **TOTAL** | **100%** | - | **[Sum]** |

**Interpretation**:
- 4.0-5.0: Strong Go
- 3.0-3.9: Go with iteration
- 2.0-2.9: Proceed with caution (pivot likely)
- 0-1.9: No-Go (reconsider direction)

---

## Recommended Next Steps

Based on [rating]:

**If GO**:
1. [Immediate action]
2. [Validation step]
3. [MVP planning]

**If CAUTION**:
1. [Risk mitigation]
2. [Hypothesis testing]
3. [Pivot considerations]

**If NO-GO**:
1. [Alternative directions]
2. [Lessons learned]
```

Save to: `[workspace]/feasibility-assessment.md`

### 4.3 PMF Scorecard

Load template from `@.claude/skills/Product-Discovery/shared/pmf-scorecard.md` and populate:

```markdown
# Product-Market Fit Scorecard

**Product**: [Idea Name]
**Date**: MMDD-YY

---

## Scoring Methodology

Each dimension rated 0-100 based on research evidence.

### 1. Problem Clarity (Weight: 30%)

**Score**: [0-100] / 100

**Evidence**:
- ✅ Clear target customer persona defined
- ✅ Specific pain points identified
- ⚠️ [Any concerns]

**Criteria**:
- 90-100: Crystal clear problem, validated with data
- 70-89: Well-defined problem, some assumptions
- 50-69: Problem exists but fuzzy
- 30-49: Unclear if problem is real
- 0-29: No clear problem identified

**Justification**: [Why this score]

---

### 2. Market Size (Weight: 25%)

**Score**: [0-100] / 100

**Evidence**:
- TAM: $[X]
- SAM: $[X]
- SOM: $[X]
- Growth rate: [X]%

**Criteria**:
- 90-100: TAM >$10B, strong growth
- 70-89: TAM $1-10B, moderate growth
- 50-69: TAM $100M-1B, stable
- 30-49: TAM $10-100M, slow growth
- 0-29: TAM <$10M, declining

**Justification**: [Why this score]

---

### 3. Solution Uniqueness (Weight: 25%)

**Score**: [0-100] / 100

**Evidence**:
- Key differentiators: [List]
- Competitive moat: [Type]
- Positioning: [How you're different]

**Criteria**:
- 90-100: Unique moat (data/network/tech), clear differentiation
- 70-89: Strong differentiation on performance attribute
- 50-69: Incremental improvement over alternatives
- 30-49: Similar to existing solutions
- 0-29: No clear differentiation

**Justification**: [Why this score]

---

### 4. Technical Feasibility (Weight: 20%)

**Score**: [0-100] / 100

**Evidence**:
- Complexity: [Low/Med/High]
- Technology maturity: [Proven/Emerging/Experimental]
- Risks: [List]

**Criteria**:
- 90-100: Low complexity, proven tech, minimal risk
- 70-89: Medium complexity, mature tech, manageable risk
- 50-69: High complexity, emerging tech, moderate risk
- 30-49: Very high complexity, experimental tech, high risk
- 0-29: Infeasible with current technology

**Justification**: [Why this score]

---

## Overall PMF Score

| Dimension | Weight | Raw Score | Weighted Score |
|-----------|--------|-----------|----------------|
| Problem Clarity | 30% | [X] | [X * 0.30] |
| Market Size | 25% | [X] | [X * 0.25] |
| Solution Uniqueness | 25% | [X] | [X * 0.25] |
| Technical Feasibility | 20% | [X] | [X * 0.20] |
| **TOTAL PMF SCORE** | **100%** | - | **[Sum] / 100** |

---

## Interpretation

**Score**: [X] / 100

**Rating**:
- 🟢 **80-100**: Strong PMF Potential - Proceed with confidence
- 🟡 **60-79**: Moderate PMF Potential - Iterate and validate
- 🟠 **40-59**: Weak PMF - Significant pivots needed
- 🔴 **0-39**: Poor PMF - Reconsider direction

**Recommendation**: [Based on score]

---

## Strengths (High Scores)
1. [Dimension] - [Why strong]
2. [Dimension] - [Why strong]

## Weaknesses (Low Scores)
1. [Dimension] - [Why weak] - [How to improve]
2. [Dimension] - [Why weak] - [How to improve]

## Critical Assumptions to Test
1. [Assumption from low-scoring area]
2. [Assumption that needs validation]
```

Save to: `[workspace]/pmf-scorecard.md`

### 4.4 Action Plan

Generate detailed step-by-step roadmap based on Lean Playbook:

```markdown
# Action Plan: [Product Idea]

**Based on**: Feasibility [Go/Caution/No-Go] | PMF Score: [X]/100
**Recommended Path**: [Fast-track MVP | Validate First | Pivot | Stop]

---

## Phase 1: IMMEDIATE VALIDATION (Week 1-2)

**Goal**: Test critical assumptions with real customers

### Customer Interviews (Target: 5-8 users)
- [ ] Define interview script (see template below)
- [ ] Recruit 5-8 target customers
  - Where: [Channels based on research]
  - Who: [Specific persona traits]
- [ ] Conduct interviews (45-60 min each)
  - Focus: Validate [key assumption from PMF weaknesses]
  - Ask: [Top 3 questions to test]
- [ ] Synthesize findings
  - Look for: Pattern confirmation vs. contradiction

**Interview Script Template**:
```
PART 1: Discovery (15 min)
- Tell me about how you currently [activity related to problem]
- What's most frustrating about [current solution]?
- Walk me through the last time you [experienced pain point]

PART 2: Solution Test (20 min)
- [Show concept/wireframe]
- What do you think this does?
- How would you use it to solve [problem]?
- What would make this a "must-have" for you?

PART 3: Wrap-up (10 min)
- On scale 1-10, how useful is this?
- Why that score?
- Would you pay for this? How much?
```

### Prototype Creation
- [ ] Design low-fidelity wireframes (Tool: Figma/Sketch/Paper)
  - Focus: [Top 3 MVP features from interview]
  - Fidelity: Just enough to test core value prop
- [ ] Create clickable prototype (if needed)
- [ ] Prepare test scenarios

**Deliverable**: 5-8 interview transcripts + prototype

**Success Criteria**:
- ✅ 70%+ users confirm problem is important (8+/10)
- ✅ 50%+ users express interest in solution
- ⚠️ If <50% interested → Re-evaluate value prop

---

## Phase 2: MVP SCOPING (Week 3-4)

**Goal**: Define buildable MVP based on validated learnings

### Feature Prioritization (Based on interviews)
- [ ] List all proposed features
- [ ] Apply MoSCoW framework:
  - **Must Have**: [Features] - Critical for core value prop
  - **Should Have**: [Features] - Important but not critical
  - **Could Have**: [Features] - Nice to have
  - **Won't Have**: [Features] - Explicitly out of scope
- [ ] Estimate effort per feature (T-shirt: S/M/L)
- [ ] Calculate ROI (Impact / Effort)

### MVP Definition
- [ ] Lock MVP scope (3-5 features max)
  - Feature 1: [Name] - [Why must-have] - [Success metric]
  - Feature 2: [Name] - [Why must-have] - [Success metric]
  - Feature 3: [Name] - [Why must-have] - [Success metric]
- [ ] Define UX flows (Conceptual design)
- [ ] Specify success metrics (AARRR)
  - Activation: [What is "aha" moment?]
  - Retention: [Day 7/30 metric]
  - Revenue: [If applicable]

**Deliverable**: MVP spec document + metrics dashboard

---

## Phase 3: BUILD & TEST (Month 2-3)

**Goal**: Ship MVP and run validation experiments

### Development
- [ ] Set up development environment
- [ ] Agile sprint planning (2-week sprints)
  - Sprint 1: [Core feature]
  - Sprint 2: [Supporting feature]
  - Sprint 3: [Polish + analytics]
- [ ] Implement analytics (Track: [metrics])
- [ ] QA testing

### Beta Testing
- [ ] Recruit 20-50 beta users (From interview pool + [channel])
- [ ] Onboard with clear expectations
  - "This is early, we need feedback"
  - Specific tasks to complete
- [ ] Collect feedback
  - Quantitative: Usage metrics
  - Qualitative: Surveys + follow-up interviews
- [ ] Iterate based on data

**Deliverable**: Working MVP + beta feedback report

**Success Criteria**:
- ✅ 40%+ activation rate (complete core action)
- ✅ 20%+ Day 7 retention
- ✅ 8+/10 satisfaction from beta users
- ⚠️ If metrics below → Investigate and pivot

---

## Phase 4: LAUNCH & OPTIMIZE (Month 3-4)

**Goal**: Public launch and iterate based on real usage

### Launch Preparation
- [ ] Finalize positioning & messaging (Based on successful beta language)
- [ ] Create landing page (Focus: [key value prop])
- [ ] Set up acquisition channels
  - Channel 1: [Based on research]
  - Channel 2: [Based on research]
- [ ] Prepare launch content (Blog, social, etc.)

### Launch
- [ ] Soft launch to small audience
- [ ] Monitor metrics closely (Daily check-ins)
- [ ] Collect user feedback (NPS, surveys)
- [ ] Hard launch after validation

### Optimization Loop
- [ ] Run A/B tests on [key conversion point]
- [ ] Analyze retention cohorts
- [ ] Identify drop-off points (Funnel analysis)
- [ ] Iterate weekly based on data

**Success Criteria** (Month 3):
- ✅ [X] signups/week
- ✅ [Y]% activation rate
- ✅ [Z]% Week 4 retention
- ✅ NPS > 40

---

## Contingency Plans

### If Validation Fails (Phase 1)
**Signals**: <50% interest, low problem importance scores

**Action**:
- [ ] Analyze failure: Wrong customer? Wrong problem? Wrong solution?
- [ ] Pivot options:
  - Option A: [Different customer segment]
  - Option B: [Different problem to solve]
  - Option C: [Different solution approach]
- [ ] Run quick tests on pivot options (1 week each)
- [ ] Decide: Iterate or Stop

### If MVP Underperforms (Phase 3)
**Signals**: Low activation, poor retention

**Action**:
- [ ] Customer interviews (Why aren't you using it?)
- [ ] Usage analysis (Where do they drop off?)
- [ ] Hypothesis: [Most likely issue]
- [ ] Quick iteration (1-2 week sprint)
- [ ] Re-test

---

## Milestones & Timeline

| Milestone | Target Date | Key Deliverable |
|-----------|-------------|-----------------|
| Interviews Complete | Week 2 | 5-8 transcripts + insights |
| MVP Scoped | Week 4 | Spec + metrics |
| MVP Built | Month 2 | Working product |
| Beta Complete | Month 3 | Feedback + metrics |
| Public Launch | Month 4 | Live product |
| PMF Validation | Month 6 | Strong retention |

---

## Resources Needed

### Team
- Product Manager (You): [X hours/week]
- Designer: [X hours] - For wireframes/UI
- Developer(s): [X hours] - For MVP build
- (Optional) User researcher: [X hours] - For interviews

### Tools
- Design: Figma (Free tier OK)
- Prototype: Figma / InVision
- Analytics: Mixpanel / Amplitude (Free tier)
- User testing: UserTesting.com / Loom (for recordings)
- Survey: Typeform / Google Forms

### Budget (Estimated)
- User recruitment: $[X] (Incentives: $25-50/interview)
- Tools: $[X]/month
- Beta hosting: $[X]/month
- Total first 3 months: $[X]

---

## Key Risks & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| [Risk from research] | High/Med/Low | High/Med/Low | [Action to reduce] |
| Can't recruit users | [X] | [X] | [Alternative channels] |
| Technical complexity | [X] | [X] | [Simplify scope / get help] |

---

## Decision Points

**End of Week 2** (Post-interviews):
- If validation strong (>70% problem confirmation) → Proceed to Phase 2
- If weak (50-70%) → Iterate value prop, re-interview
- If poor (<50%) → Pivot or stop

**End of Month 2** (Post-MVP):
- If beta metrics hit targets → Proceed to launch
- If close but not quite → 2-week iteration, re-test
- If far from targets → Major pivot or stop

**End of Month 4** (Post-launch):
- If PMF signals strong → Scale (growth phase)
- If mixed → Optimize (3 more months)
- If weak → Pivot or wind down

---

**Remember**: "Fall in love with the problem, not your solution." Stay flexible and follow the data.
```

Save to: `[workspace]/action-plan.md`

---

## Phase 5: DELIVERY (Present to User)

### 5.1 Verify All Outputs

Check that files exist:
- `[workspace]/interview-transcript.md`
- `[workspace]/raw/agent-*.md` (all agent outputs)
- `[workspace]/research-report.md`
- `[workspace]/feasibility-assessment.md`
- `[workspace]/pmf-scorecard.md`
- `[workspace]/action-plan.md`

### 5.2 Summary Message to User

```markdown
🎉 **Product Discovery Complete!**

I've completed comprehensive validation of your product idea.

## 📊 Quick Summary

**Product**: [Idea Name]
**PMF Score**: [X]/100 ([Rating])
**Recommendation**: 🟢 GO | 🟡 CAUTION | 🔴 NO-GO

**Key Findings**:
- ✅ Strength: [Top insight]
- ⚠️ Risk: [Top concern]
- 🎯 Next Step: [Immediate action]

## 📁 Deliverables

All reports saved to: `[workspace-path]/`

1. **Research Report** - Comprehensive findings from 7 research agents
2. **Feasibility Assessment** - Go/No-Go recommendation with scoring
3. **PMF Scorecard** - Detailed scoring across 4 dimensions
4. **Action Plan** - Step-by-step roadmap (next 4 months)

## 🚀 Recommended Immediate Actions

Based on [assessment], I recommend you:
1. [Action 1]
2. [Action 2]
3. [Action 3]

**Want me to help with any of these next steps?** I can:
- Generate interview scripts
- Create wireframe outlines
- Suggest beta testing strategies
```

---

## Error Handling

### If Interview is Vague
- Ask more probing questions
- Provide examples to spark thinking
- Don't proceed to research until clarity achieved

### If Agent Fails
- Log failure details
- Continue with available agents
- Note limitation in reports
- Adjust confidence scores accordingly

### If Research Contradicts Interview
- Highlight contradiction in reports
- Explain both perspectives
- Recommend additional validation
- Lower confidence scores

---

## Success Criteria

- [ ] Interview captured all 4 Pyramid layers
- [ ] All agents completed (or failures logged)
- [ ] 4 reports generated with correct structure
- [ ] PMF score calculated and justified
- [ ] Action plan is specific and actionable
- [ ] Workspace properly organized
- [ ] User understands next steps

---

## Reference Files

Load on-demand:
- `@.claude/skills/Product-Discovery/shared/interview-guide.md` - Full question bank
- `@.claude/skills/Product-Discovery/shared/pmf-scorecard.md` - Scoring rubrics
- `@.claude/skills/Product-Discovery/shared/agent-selection.md` - Agent configs
- `@.claude/skills/Product-Discovery/shared/output-templates.md` - Report templates

---

**Duration Estimate**: 15-25 minutes total
- Interview: 5-10 min
- Research: 10-15 min
- Report generation: 2-5 min
