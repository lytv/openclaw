# Output Templates for Product Discovery

Standardized templates for all Product Discovery outputs.

## Emoji Standards

Use consistent emojis for clarity:

| Emoji | Meaning | Usage |
|-------|---------|-------|
| 🔍 | Starting | Beginning of work |
| 📊 | Data | Presenting findings/data |
| 💡 | Insights | Key insights or analysis |
| ⚠️ | Warning/Concern | Risks or red flags |
| ✅ | Success/Strength | Positive findings |
| ❌ | Failure/Missing | Failed attempts or missing data |
| 🎯 | Completion | Work completed |
| 🔗 | Sources | References and citations |
| 🟢 | Go | Positive recommendation |
| 🟡 | Caution | Proceed with care |
| 🔴 | Stop | Negative recommendation |

---

## Template 1: Interview Transcript

**File**: `interview-transcript.md`

```markdown
# Product Discovery Interview

**Date**: MMDD-YY
**Product Idea**: [One-sentence description]
**Interviewee**: [User name]

---

## Product Idea Summary

[2-3 paragraph description of the idea from user's initial pitch]

---

## Target Customer

**Primary Segment**: [Segment name]

**Demographics**:
- Age: [Range]
- Location: [Where]
- Income/Company size: [Range]
- Role: [Job title/situation]

**Psychographics**:
- Values: [What they care about]
- Attitudes: [Mindset]
- Lifestyle/Work style: [Patterns]

**Behaviors**:
- Tools currently used: [List]
- Daily habits: [Patterns related to problem]
- Workflows: [How they currently work]

**Problem Context**:
- When problem occurs: [Trigger moments]
- Frequency: [Daily/Weekly/Monthly]
- Current solution: [How they cope today]

**Persona Quote**:
> "[Their words describing the customer's frustration]"

---

## Underserved Needs

### Importance vs. Satisfaction Matrix

| Need / Pain Point | Importance (1-10) | Current Satisfaction (1-10) | Gap | Opportunity Level |
|-------------------|-------------------|----------------------------|-----|-------------------|
| [Need 1] | [X] | [Y] | [X-Y] | High/Med/Low |
| [Need 2] | [X] | [Y] | [X-Y] | High/Med/Low |
| [Need 3] | [X] | [Y] | [X-Y] | High/Med/Low |

### Primary Opportunity

**Core Underserved Need**: [The #1 pain point with biggest gap]

**Current Workaround**: [How customers cope today]

**Customer Pain Quote**:
> "[Direct quote about frustration]"

**Job-to-be-Done**:
When [situation], [customer] wants to [goal], so they can [outcome].

**Success Looks Like**:
- [Measurable outcome 1]
- [Measurable outcome 2]

---

## Value Proposition

### Competitive Landscape

**Direct Competitors**:
1. [Competitor 1] - [Brief description]
2. [Competitor 2] - [Brief description]

**Indirect Competitors**:
1. [Alternative approach 1]
2. [Alternative approach 2]

**Non-consumption**: [% who don't use anything, just tolerate pain]

**Competitive Gaps**:
- ✅ What existing solutions do well: [List]
- ⚠️ What they miss: [List]

### Kano Analysis

#### Must-Haves (Table Stakes)
- [Feature 1] - Why required: [Explanation]
- [Feature 2] - Why required: [Explanation]
- [Feature 3] - Why required: [Explanation]

*Strategy*: Include all, but don't compete on these

#### Performance Dimension (Your Winning Attribute)
**Chosen Dimension**: [e.g., Speed | Quality | Ease of Use | Price | Customization]

**Competitive Benchmark**:
| Competitor | [Your Dimension] Rating |
|------------|------------------------|
| Competitor A | [Rating] |
| Competitor B | [Rating] |
| **YOUR PRODUCT** | **[Significantly Better]** |

*Why this dimension*: [Strategic reasoning]

#### Delighters (Unique Features)
- [Delighter 1] - Why unexpected: [Explanation]
- [Delighter 2] - Why exciting: [Explanation]

*Marketing angle*: [How you'll promote this]

### Positioning Statement

For [Target Customer],
who [Core Underserved Need],
our product is a [Category]
that [Primary Benefit].

Unlike [Main Alternative],
we [Unique Differentiator].

**One-sentence pitch**:
> "[Elevator pitch based on conversation]"

---

## MVP Feature Set

### All Feature Ideas (Brainstorm)
1. [Feature idea from interview]
2. [Feature idea from interview]
3. [Feature idea from interview]
...

### MVP Features (Top 3-5)

#### Feature 1: [Name]
- **Why critical**: [Ties to value prop / pain point]
- **User story**: As [user], I want [action], so that [benefit]
- **Success metric**: [X]% of users [action] within [timeframe]
- **Impact**: High | Med | Low
- **Effort**: High | Med | Low
- **Priority**: P0 (MVP)

#### Feature 2: [Name]
[Same format]

#### Feature 3: [Name]
[Same format]

### Out of Scope (V1)
- ❌ [Feature] - Why postponed: [Reasoning]
- ❌ [Feature] - Why postponed: [Reasoning]

### ROI Prioritization Matrix

| Feature | Impact | Effort | ROI | Priority | Include in MVP? |
|---------|--------|--------|-----|----------|-----------------|
| [F1] | H | L | High | P0 | ✅ |
| [F2] | H | M | Med-High | P0 | ✅ |
| [F3] | H | H | Med | P1 | ⏭️ Post-MVP |
| [F4] | M | L | Med | P1 | ⏭️ Post-MVP |
| [F5] | L | H | Low | P2 | ❌ Backlog |

**MVP Scope**: [List P0 features]

---

## Next Steps

Proceeding to **Research Phase** to validate:
- Market size and competitive dynamics
- Technical feasibility
- Similar product patterns
- [If applicable] Business model viability
- [If applicable] Customer behavior insights

**Hypotheses to Test**:
1. [Hypothesis 1 from interview]
2. [Hypothesis 2 from interview]
3. [Hypothesis 3 from interview]

---

*Interview completed. Research agents will now validate these insights.*
```

---

## Template 2: Research Report

**File**: `research-report.md`

```markdown
# Research Report: [Product Idea]

**Date**: MMDD-YY
**Research Depth**: Deep (5-8 agents)
**Total Research Time**: [X] minutes
**Confidence Level**: High | Medium | Low

---

## Executive Summary

[3-4 paragraphs covering:
- What this product idea is
- Key findings across all dimensions
- Overall assessment from research perspective
- Preliminary recommendation]

---

## Market Analysis

*Source: market-researcher*

### Market Size

**TAM (Total Addressable Market)**: $[X] [globally/region]
**SAM (Serviceable Addressable Market)**: $[Y]
**SOM (Serviceable Obtainable Market)**: $[Z] (achievable in 3-5 years)

**Sizing Methodology**: [Top-down/Bottom-up/Both]
**Sources**: [Analyst reports, data sources]

### Market Dynamics

**Growth Rate**: [X]% CAGR
**Stage**: [Emerging | Growth | Mature | Declining]
**Key Trends**:
- [Trend 1] - Impact: [Positive/Negative/Neutral]
- [Trend 2] - Impact: [Positive/Negative/Neutral]

**Market Drivers**:
- [Driver 1]
- [Driver 2]

### Competitive Landscape

| Competitor | Type | Strengths | Weaknesses | Market Share |
|------------|------|-----------|------------|--------------|
| [Name] | Direct | [List] | [List] | [%] |
| [Name] | Indirect | [List] | [List] | [%] |

**Competitive Intensity**: Low | Moderate | High | Very High

**White Space Opportunities**:
- [Gap 1]
- [Gap 2]

---

## Technical Feasibility

*Source: tech-researcher*

### Overall Feasibility

**Assessment**: ✅ Feasible | ⚠️ Challenging | ❌ High Risk

**Rationale**: [Explanation based on research]

### Complexity Analysis

**Complexity Rating**: Low | Medium | High | Very High

**Breakdown by Component**:
| Component | Complexity | Justification |
|-----------|------------|---------------|
| [Component 1] | [Level] | [Why] |
| [Component 2] | [Level] | [Why] |

### Recommended Technology Stack

**Frontend**: [Technology] - Why: [Rationale]
**Backend**: [Technology] - Why: [Rationale]
**Database**: [Technology] - Why: [Rationale]
**Infrastructure**: [Technology] - Why: [Rationale]

### Technical Risks

| Risk | Likelihood | Impact | Mitigation Strategy |
|------|------------|--------|---------------------|
| [Risk 1] | H/M/L | H/M/L | [How to address] |
| [Risk 2] | H/M/L | H/M/L | [How to address] |

### Estimated Development Time

**MVP**: [X] weeks/months
**Full Product (V1.0)**: [Y] months

---

## Case Studies & Learnings

*Source: content-researcher*

### Similar Products Analyzed

1. **[Product 1]** - Status: Success | Failed
   - What they did: [Brief description]
   - Outcome: [What happened]
   - Key lesson: [Takeaway]

2. **[Product 2]** - Status: Success | Failed
   - What they did: [Brief description]
   - Outcome: [What happened]
   - Key lesson: [Takeaway]

3. **[Product 3]** - Status: Success | Failed
   - What they did: [Brief description]
   - Outcome: [What happened]
   - Key lesson: [Takeaway]

### Success Patterns

✅ **What Worked**:
- [Pattern 1] - Example: [Product that demonstrated this]
- [Pattern 2] - Example: [Product that demonstrated this]
- [Pattern 3] - Example: [Product that demonstrated this]

### Failure Patterns

❌ **What Didn't Work**:
- [Pattern 1] - Example: [Product that failed due to this]
- [Pattern 2] - Example: [Product that failed due to this]

### Actionable Lessons

💡 **Key Takeaways for This Idea**:
1. [Lesson 1] - How to apply: [...]
2. [Lesson 2] - How to apply: [...]
3. [Lesson 3] - How to apply: [...]

---

## [OPTIONAL] Financial Viability

*Source: financial-researcher (if spawned)*

### Business Model Options

| Model | Description | Pros | Cons | Fit for This Idea |
|-------|-------------|------|------|-------------------|
| [Model 1] | [Description] | [List] | [List] | High/Med/Low |
| [Model 2] | [Description] | [List] | [List] | High/Med/Low |

**Recommended**: [Model] - Why: [Rationale]

### Revenue Potential

**ARPU (Average Revenue Per User)**: $[X]/month or $[Y]/year
**Benchmark**: [Comparables in category]

**Realistic Milestones**:
- Year 1: [X] users × $[ARPU] = $[Revenue]
- Year 3: [Y] users × $[ARPU] = $[Revenue]
- Year 5: [Z] users × $[ARPU] = $[Revenue]

### Unit Economics

**CAC (Customer Acquisition Cost)**: $[X] (estimated)
**LTV (Lifetime Value)**: $[Y] (estimated)
**LTV:CAC Ratio**: [Ratio] (Target: >3:1)

**Path to Profitability**: [Timeline and conditions]

---

## [OPTIONAL] Target Customer Insights

*Source: team-researcher (if spawned)*

### Customer Behavior Patterns

**Discovery Channels**:
- [Channel 1] - Usage: [%]
- [Channel 2] - Usage: [%]

**Decision-Making Process**:
- [Step 1 in customer journey]
- [Step 2 in customer journey]
- Average decision time: [X] days/weeks

### Pain Point Validation

**Validated Pains** (from research):
- [Pain 1] - Evidence: [Source]
- [Pain 2] - Evidence: [Source]

**Buying Triggers**:
- [Trigger 1]
- [Trigger 2]

---

## Synthesis & Cross-Agent Insights

*Source: synthesizer*

### Converging Evidence

Areas where multiple agents agree:
- [Insight 1]
- [Insight 2]

### Diverging Perspectives

Areas where agents have different views:
- [Topic]: [Agent A] says [X], [Agent B] says [Y]
- Recommended interpretation: [...]

### Product-Market Fit Pyramid Mapping

| Pyramid Layer | Status | Notes |
|---------------|--------|-------|
| 1. Target Customer | ✅ Validated | [From interview + team-researcher] |
| 2. Underserved Needs | ⚠️ Partially validated | [Strength of evidence] |
| 3. Value Proposition | ✅ Clear | [Differentiation strength] |
| 4. Feature Set | ✅ Scoped | [Feasibility confirmed] |
| 5. UX Design | ⏭️ Not yet addressed | [To be designed] |

### Critical Assumptions Identified

🎯 **Assumptions Requiring Validation**:
1. [Assumption 1] - Risk: High/Med/Low - Test: [How to validate]
2. [Assumption 2] - Risk: High/Med/Low - Test: [How to validate]
3. [Assumption 3] - Risk: High/Med/Low - Test: [How to validate]

---

## Research Quality Assessment

*Source: quality-reviewer*

### Completeness

✅ **Fully Covered**:
- [Dimension 1]
- [Dimension 2]

⚠️ **Gaps Identified**:
- [Gap 1] - Severity: High/Med/Low - Impact: [...]
- [Gap 2] - Severity: High/Med/Low - Impact: [...]

### Data Confidence

| Research Dimension | Confidence | Rationale |
|--------------------|------------|-----------|
| Market Analysis | High/Med/Low | [Why] |
| Technical Feasibility | High/Med/Low | [Why] |
| Case Studies | High/Med/Low | [Why] |
| Financial Viability | High/Med/Low | [Why] |
| Customer Insights | High/Med/Low | [Why] |

**Overall Confidence**: High | Medium | Low

**Rationale**: [Explanation of overall confidence level]

---

## Sources & Methodology

### Agent Results

| Agent | Status | Output Quality | Notes |
|-------|--------|----------------|-------|
| market-researcher | ✅ Success | High/Med/Low | [Notes] |
| tech-researcher | ✅ Success | High/Med/Low | [Notes] |
| content-researcher | ✅ Success | High/Med/Low | [Notes] |
| financial-researcher | ✅ Success / ⏭️ Skipped | High/Med/Low | [Notes] |
| team-researcher | ✅ Success / ⏭️ Skipped | High/Med/Low | [Notes] |
| quality-reviewer | ✅ Success | High/Med/Low | [Notes] |
| synthesizer | ✅ Success | High/Med/Low | [Notes] |

**Success Rate**: [X]/[Y] agents completed successfully

### MCP Tools Used

- perplexity (search): [X] queries
- perplexity (research): [Y] deep research calls
- exa (search): [Z] queries
- exa (getContents): [A] URL fetches
- parallel-search: [B] fallback calls

### Research Limitations

⚠️ **Known Limitations**:
- [Limitation 1]
- [Limitation 2]

💡 **Recommendations for Further Research**:
- [Suggestion 1]
- [Suggestion 2]

---

*Research report complete. Proceed to Feasibility Assessment for recommendation.*
```

---

## Template 3: Feasibility Assessment

**File**: `feasibility-assessment.md`

```markdown
# Feasibility Assessment: [Product Idea]

**Date**: MMDD-YY
**Research Basis**: [Link to research-report.md]

---

## Overall Recommendation

### Rating: [CHOOSE ONE]

🟢 **GO** - Strong feasibility, proceed with confidence

🟡 **PROCEED WITH CAUTION** - Promising but requires iteration/validation

🔴 **NO-GO** - Significant concerns, reconsider direction

**Confidence in Recommendation**: High | Medium | Low

---

## Executive Summary

[2-3 paragraphs explaining:
- The recommendation and why
- Key strengths supporting the decision
- Key concerns/risks
- Recommended immediate next steps]

---

## Detailed Assessment

### 1. Problem-Solution Fit

**Rating**: ⭐⭐⭐⭐⭐ ([X]/5)

**Strengths**:
- ✅ [Strength 1]
- ✅ [Strength 2]
- ✅ [Strength 3]

**Concerns**:
- ⚠️ [Concern 1]
- ⚠️ [Concern 2]

**Open Questions**:
- ❓ [Question 1]
- ❓ [Question 2]

**Justification**: [Why this rating based on research]

---

### 2. Market Opportunity

**Rating**: ⭐⭐⭐⭐⭐ ([X]/5)

**Market Indicators**:
- TAM: $[X] ([Size rating: Small/Med/Large/Massive])
- Growth: [X]% CAGR ([Rating: Declining/Stable/Growing/Booming])
- Competition: [Low/Moderate/High/Intense]

**Strengths**:
- ✅ [Market strength 1]
- ✅ [Market strength 2]

**Concerns**:
- ⚠️ [Market concern 1]
- ⚠️ [Market concern 2]

**Justification**: [Why this rating]

---

### 3. Technical Feasibility

**Rating**: ⭐⭐⭐⭐⭐ ([X]/5)

**Technical Indicators**:
- Complexity: [Low/Med/High/Very High]
- Technology maturity: [Proven/Mature/Emerging/Experimental]
- Development time: [X] months to MVP

**Strengths**:
- ✅ [Technical strength 1]
- ✅ [Technical strength 2]

**Concerns**:
- ⚠️ [Technical concern 1]
- ⚠️ [Technical concern 2]

**Justification**: [Why this rating]

---

### 4. Competitive Position

**Rating**: ⭐⭐⭐⭐⭐ ([X]/5)

**Differentiation**:
- Key differentiator: [What sets you apart]
- Moat strength: [Weak/Moderate/Strong]
- Performance advantage: [Xfactor vs. competitors]

**Strengths**:
- ✅ [Competitive strength 1]
- ✅ [Competitive strength 2]

**Concerns**:
- ⚠️ [Competitive concern 1]
- ⚠️ [Competitive concern 2]

**Justification**: [Why this rating]

---

## Scoring Summary

| Criteria | Weight | Score (0-5) | Weighted Score |
|----------|--------|-------------|----------------|
| Problem-Solution Fit | 30% | [X] | [X × 0.30] |
| Market Opportunity | 30% | [X] | [X × 0.30] |
| Technical Feasibility | 25% | [X] | [X × 0.25] |
| Competitive Position | 15% | [X] | [X × 0.15] |
| **TOTAL** | **100%** | - | **[Sum] / 5.0** |

**Overall Score**: [X] / 5.0

**Interpretation**:
- 4.0-5.0: 🟢 Strong Go - High likelihood of success
- 3.0-3.9: 🟡 Go with Iteration - Promising with adjustments
- 2.0-2.9: 🟡 Proceed with Caution - Significant concerns to address
- 0-1.9: 🔴 No-Go - Reconsider direction

---

## Risk Analysis

### High Risks (Must Address)

🔴 **Critical Risks**:
1. [Risk 1]
   - Impact: [Description]
   - Likelihood: High/Med/Low
   - Mitigation: [How to reduce risk]

2. [Risk 2]
   - Impact: [Description]
   - Likelihood: High/Med/Low
   - Mitigation: [How to reduce risk]

### Medium Risks (Monitor)

🟡 **Moderate Risks**:
1. [Risk 1] - Mitigation: [Strategy]
2. [Risk 2] - Mitigation: [Strategy]

### Low Risks (Acceptable)

🟢 **Minor Risks**:
1. [Risk 1] - Can be managed during execution
2. [Risk 2] - Can be managed during execution

---

## Recommended Next Steps

### If GO (🟢):

**Immediate Actions** (Week 1-2):
1. [Action 1]
2. [Action 2]
3. [Action 3]

**Validation Actions** (Week 3-6):
1. [Validation 1]
2. [Validation 2]

**MVP Development** (Month 2-3):
1. [Development milestone 1]
2. [Development milestone 2]

### If PROCEED WITH CAUTION (🟡):

**Before Proceeding**:
1. [Critical validation 1 - address concern]
2. [Critical validation 2 - address concern]

**If Validation Succeeds**:
- Then proceed to MVP development

**If Validation Fails**:
- Consider pivot to [alternative approach]

### If NO-GO (🔴):

**Alternative Directions**:
1. [Pivot option 1] - Why this might work better
2. [Pivot option 2] - Why this might work better

**Lessons Learned**:
- [Takeaway 1]
- [Takeaway 2]

---

## Decision Factors

### Factors Supporting GO:
1. [Factor 1]
2. [Factor 2]
3. [Factor 3]

### Factors Suggesting CAUTION/NO-GO:
1. [Factor 1]
2. [Factor 2]

### Tiebreakers (if close decision):
- [Consideration 1]
- [Consideration 2]

---

## Timeline to Decision

**Recommended timeline for final go/no-go**:
- [Timeline] after completing [key validations]

**Checkpoint milestones**:
1. [Milestone 1] - Success criteria: [...]
2. [Milestone 2] - Success criteria: [...]

---

*Feasibility assessment complete. See PMF Scorecard for detailed scoring.*
```

---

(File continues with Template 4: PMF Scorecard and Template 5: Action Plan...Due to length, these follow the same structure as defined in pmf-scorecard.md and orchestrator.md)

---

## Naming Conventions

### Workspace Directory
Format: `/research/product-ideas/MMDD-<idea-slug>-YY/`

Example: `/research/product-ideas/0126-meal-planning-app-26/`

### File Names
- Interview: `interview-transcript.md`
- Research: `research-report.md`
- Feasibility: `feasibility-assessment.md`
- PMF Score: `pmf-scorecard.md`
- Action Plan: `action-plan.md`
- Agent outputs: `raw/agent-[agent-name].md`

### Idea Slug
- Lowercase
- Hyphen-separated
- 3-5 words max
- Descriptive of core idea

Examples:
- "AI meal planner" → `ai-meal-planner`
- "Project management for designers" → `pm-for-designers`
- "Fitness tracker with gamification" → `fitness-tracker-game`

---

## Quality Checklist

Before delivering outputs, verify:
- [ ] All emojis used consistently
- [ ] All required sections present
- [ ] Proper markdown formatting
- [ ] Citations for all data/claims
- [ ] Specific, measurable metrics (not vague)
- [ ] Actionable recommendations (not generic advice)
- [ ] Files named correctly
- [ ] Cross-references work (links between files)

---

**Remember**: Templates are guides, not rigid requirements. Adapt based on specific idea context while maintaining core structure.
