# Product-Market Fit Scorecard Template

Scoring rubric and methodology for evaluating product ideas across 4 dimensions.

## Scoring Overview

| Dimension | Weight | Max Score | Focus Area |
|-----------|--------|-----------|------------|
| **Problem Clarity** | 30% | 100 | Is the customer pain well-defined and validated? |
| **Market Size** | 25% | 100 | Is the addressable market large enough? |
| **Solution Uniqueness** | 25% | 100 | Is your solution differentiated? |
| **Technical Feasibility** | 20% | 100 | Can this be built within constraints? |
| **TOTAL PMF SCORE** | **100%** | **100** | **Weighted average** |

---

## Dimension 1: Problem Clarity (Weight: 30%)

**Why it matters most**: If the problem isn't real or well-understood, nothing else matters.

### Scoring Rubric

#### 90-100: Crystal Clear Problem (Exceptional)
- ✅ Target customer segment precisely defined (specific persona)
- ✅ Pain point validated with customer interviews/research
- ✅ Importance rating consistently 9-10/10 from multiple customers
- ✅ Current satisfaction consistently ≤5/10
- ✅ Customers actively seeking solutions (pull, not push)
- ✅ Evidence of willingness to pay
- ✅ Problem occurs frequently (daily/weekly)

**Example**: Uber in 2009 - "Can't reliably get a cab in SF" (validated, urgent, frequent)

#### 70-89: Well-Defined Problem (Strong)
- ✅ Target customer segment defined
- ✅ Pain point articulated clearly
- ✅ Importance rating 7-8/10
- ✅ Current satisfaction 4-6/10
- ⚠️ Some validation from customers
- ⚠️ Problem occurs regularly (weekly/monthly)
- ⚠️ Assumed willingness to pay (not confirmed)

**Example**: Meal planning apps - Clear pain (decision fatigue) but moderate importance

#### 50-69: Problem Exists But Fuzzy (Moderate)
- ⚠️ Target customer segment broad or generic
- ⚠️ Pain point described but not validated
- ⚠️ Importance rating 5-7/10 (nice to have)
- ⚠️ Current satisfaction 5-7/10 (neutral)
- ❌ Little evidence customers actively seeking solutions
- ❌ Problem occurs occasionally
- ❌ Unclear if they'd pay

**Example**: "People want to be more productive" (too vague, low urgency)

#### 30-49: Unclear if Problem is Real (Weak)
- ❌ No specific target customer
- ❌ Pain point is assumed, not observed
- ❌ Importance rating <5/10 (low priority)
- ❌ Current satisfaction is actually OK (6-8/10)
- ❌ Solution looking for a problem
- ❌ Problem is rare or theoretical

**Example**: "A social network for [niche hobby]" without evidence of pain

#### 0-29: No Clear Problem (Poor)
- ❌ Cannot articulate customer segment
- ❌ No evidence of pain point
- ❌ "It would be cool if..." thinking
- ❌ Customers don't recognize problem
- ❌ Building features, not solving problems

**Example**: "Uber for [X]" with no validation that [X] has issues

### Evidence to Collect

**Quantitative**:
- Importance scores (average from interviews)
- Satisfaction scores (average from interviews)
- Opportunity gap (Importance - Satisfaction)
- Search volume for "[problem] solution"
- Forum/Reddit discussions about problem

**Qualitative**:
- Customer interview quotes describing pain
- Observable workarounds customers use
- Money/time spent on current solution
- Competitive product reviews mentioning gap

### Scoring Calculation

```
Problem Clarity Score =
  (Target Customer Precision × 20) +
  (Pain Validation Strength × 30) +
  (Importance Rating × 25) +
  (Opportunity Gap × 25)

Where each subscore is 0-100
```

---

## Dimension 2: Market Size (Weight: 25%)

**Why it matters**: Even perfect PMF in a tiny market = small outcome

### Scoring Rubric

#### 90-100: Massive Market (Exceptional)
- ✅ TAM >$10B globally
- ✅ SAM >$1B (serviceable)
- ✅ SOM >$100M (obtainable in 5 years)
- ✅ Market growing >20% annually
- ✅ Greenfield or disrupting massive incumbents
- ✅ Category creation potential

**Example**: Cloud infrastructure (AWS), AI infrastructure

#### 70-89: Large Market (Strong)
- ✅ TAM $1-10B
- ✅ SAM $100M-1B
- ✅ SOM $10-100M
- ✅ Market growing 10-20% annually
- ⚠️ Established category with room for new players

**Example**: Project management SaaS, CRM for specific verticals

#### 50-69: Medium Market (Moderate)
- ⚠️ TAM $100M-1B
- ⚠️ SAM $10-100M
- ⚠️ SOM $1-10M
- ⚠️ Market growing 5-10% annually
- ⚠️ Niche but sustainable

**Example**: Tools for specific professional segments (realtors, dentists)

#### 30-49: Small Market (Weak)
- ❌ TAM $10-100M
- ❌ SAM $1-10M
- ❌ SOM <$1M
- ❌ Market flat or slow growth (<5%)
- ❌ Very niche

**Example**: Productivity tools for [ultra-specific role]

#### 0-29: Tiny Market (Poor)
- ❌ TAM <$10M
- ❌ SAM <$1M
- ❌ Market declining
- ❌ No clear path to scale

**Example**: Apps for [hyper-specific local community]

### Market Sizing Framework

**Top-Down**:
```
TAM (Total Addressable Market) =
  [# of potential customers globally] × [ARPU]

SAM (Serviceable Addressable Market) =
  [# you can realistically reach] × [ARPU]

SOM (Serviceable Obtainable Market) =
  [# you can win in 3-5 years] × [ARPU]
```

**Bottom-Up**:
```
Year 1: [X customers] × [ARPU] = $Y
Year 3: [X customers] × [growth factor] × [ARPU] = $Z
Year 5: [X customers] × [growth factor]² × [ARPU] = $A
```

### Evidence to Collect

- Analyst reports (Gartner, Forrester, CB Insights)
- Competitor revenue/funding (Crunchbase, PitchBook)
- Search volume / Google Trends
- Industry association data
- Government statistics (Census, BLS)
- Proxy metrics (related category size)

### Scoring Calculation

```
Market Size Score =
  (TAM Size × 40) +
  (Growth Rate × 30) +
  (Reachability × 20) +
  (Competitive Intensity × 10)

TAM Size:
  >$10B = 100, $1-10B = 75, $100M-1B = 50, $10-100M = 25, <$10M = 0

Growth Rate:
  >20% = 100, 10-20% = 75, 5-10% = 50, 0-5% = 25, Declining = 0

Reachability (SAM/TAM):
  >50% = 100, 25-50% = 75, 10-25% = 50, <10% = 25

Competitive Intensity:
  Greenfield = 100, Few players = 75, Moderate = 50, Crowded = 25, Red ocean = 0
```

---

## Dimension 3: Solution Uniqueness (Weight: 25%)

**Why it matters**: Differentiation creates moat and prevents commoditization

### Scoring Rubric

#### 90-100: Strong Moat (Exceptional)
- ✅ Unique data asset competitors can't replicate
- ✅ Network effects (value grows with users)
- ✅ Deep tech / IP / patents
- ✅ 10x better on key dimension
- ✅ Clear category differentiation
- ✅ Defensible over 5+ years

**Example**: Google (PageRank + data flywheel), Tesla (battery tech + manufacturing)

#### 70-89: Clear Differentiation (Strong)
- ✅ 3-5x better on key performance dimension
- ✅ Unique positioning / brand angle
- ⚠️ Moat is process/execution, not just idea
- ⚠️ Defensible for 2-3 years
- ⚠️ Competitors would need significant effort to copy

**Example**: Notion (all-in-one workspace vs. point solutions)

#### 50-69: Incremental Improvement (Moderate)
- ⚠️ 2x better on key dimension
- ⚠️ Differentiation is feature-based
- ⚠️ Moat is narrow (better UX, specific integration)
- ⚠️ Defensible for 1 year
- ⚠️ Competitors could catch up with effort

**Example**: Another project management tool with slightly better UI

#### 30-49: Similar to Existing (Weak)
- ❌ Only marginally better (10-20% improvement)
- ❌ Differentiation is superficial (design, marketing)
- ❌ No clear moat
- ❌ Easy for competitors to copy in months
- ❌ "Me too" product

**Example**: 15th CRM tool with minor tweaks

#### 0-29: No Differentiation (Poor)
- ❌ Identical to existing solutions
- ❌ No unique value proposition
- ❌ Competing on price only
- ❌ Commoditized
- ❌ "Feature wrapper" on existing platforms

**Example**: Generic ChatGPT wrapper with no added value

### Kano Model Application

**Must-Haves**: Do you have all table stakes?
- If missing any → Score capped at 30

**Performance**: Are you 3x+ better on key dimension?
- 10x better → +40 points
- 3-5x better → +30 points
- 2x better → +20 points
- Marginal → +10 points

**Delighters**: Do you have unexpected wow factors?
- Multiple unique delighters → +30 points
- One strong delighter → +20 points
- Minor delighter → +10 points
- None → 0 points

### Evidence to Collect

- Competitive feature matrix
- Performance benchmarks (speed, accuracy, etc.)
- User testimonials highlighting differentiation
- Patents/IP filings
- Network effect metrics (if applicable)
- Switching cost analysis

### Scoring Calculation

```
Solution Uniqueness Score =
  (Must-Haves Met × 30) +
  (Performance Advantage × 40) +
  (Delighters × 30)

Must-Haves Met:
  All = 100, Most = 50, Some = 25, Few = 0

Performance Advantage (vs. best competitor):
  10x = 100, 5x = 80, 3x = 60, 2x = 40, Marginal = 20, None = 0

Delighters:
  Multiple unique = 100, One strong = 67, Minor = 33, None = 0
```

---

## Dimension 4: Technical Feasibility (Weight: 20%)

**Why it matters**: Can you actually build this within constraints?

### Scoring Rubric

#### 90-100: Low Risk (Exceptional)
- ✅ Low complexity (weeks to MVP)
- ✅ Proven technology stack
- ✅ No novel technical challenges
- ✅ Clear technical architecture
- ✅ Minimal dependencies on external APIs/data
- ✅ Team has relevant expertise

**Example**: Simple SaaS with CRUD operations, standard stack

#### 70-89: Manageable Risk (Strong)
- ✅ Medium complexity (months to MVP)
- ✅ Mature technology stack
- ⚠️ Some technical challenges but solvable
- ⚠️ Architecture is understood
- ⚠️ Some external dependencies (manageable)
- ⚠️ Team can learn required skills

**Example**: Mobile app with real-time features, standard integrations

#### 50-69: Moderate Risk (Moderate)
- ⚠️ High complexity (6+ months to MVP)
- ⚠️ Emerging technology (some unknowns)
- ⚠️ Novel technical challenges
- ⚠️ Architecture needs validation
- ⚠️ Significant external dependencies
- ⚠️ Team has gaps in expertise

**Example**: ML-powered product requiring custom models

#### 30-49: High Risk (Weak)
- ❌ Very high complexity (1+ year to MVP)
- ❌ Experimental technology
- ❌ Major unsolved technical challenges
- ❌ Architecture uncertain
- ❌ Critical dependencies on unreliable APIs/data
- ❌ Team lacks key expertise

**Example**: Autonomous systems, novel hardware

#### 0-29: Infeasible (Poor)
- ❌ Requires breakthrough technology
- ❌ Fundamental technical barriers
- ❌ Laws of physics/economics don't support
- ❌ No clear path to working solution
- ❌ Would require team of 50+ engineers

**Example**: AGI, fusion power, teleportation

### Complexity Assessment

**Low Complexity** (Score: 80-100):
- Standard web/mobile app
- CRUD operations
- Proven frameworks (React, Rails, etc.)
- No real-time requirements
- Simple integrations

**Medium Complexity** (Score: 50-79):
- Real-time features
- Complex data processing
- Multiple system integrations
- Performance optimization needed
- Moderate scale (thousands of users)

**High Complexity** (Score: 20-49):
- ML/AI components
- Large-scale distributed systems
- Custom algorithms
- Novel architectures
- Massive scale (millions of users)

**Very High Complexity** (Score: 0-19):
- Research-level problems
- Hardware + software integration
- Cutting-edge AI
- Blockchain consensus at scale
- Requires scientific breakthroughs

### Evidence to Collect

- Technical architecture diagram
- Technology stack evaluation
- Similar product case studies
- Expert technical interviews
- Prototype/proof-of-concept results
- Team skill assessment

### Scoring Calculation

```
Technical Feasibility Score =
  (Complexity × 40) +
  (Technology Maturity × 30) +
  (Team Capability × 20) +
  (Dependency Risk × 10)

Complexity:
  Low = 100, Medium = 70, High = 40, Very High = 10

Technology Maturity:
  Proven = 100, Mature = 75, Emerging = 50, Experimental = 25, Theoretical = 0

Team Capability:
  Experts = 100, Proficient = 75, Can Learn = 50, Major Gaps = 25, Impossible = 0

Dependency Risk:
  None = 100, Minimal = 75, Moderate = 50, High = 25, Critical = 0
```

---

## Overall PMF Score Calculation

### Weighted Average

```
Overall PMF Score =
  (Problem Clarity × 0.30) +
  (Market Size × 0.25) +
  (Solution Uniqueness × 0.25) +
  (Technical Feasibility × 0.20)
```

### Interpretation

**80-100: Strong PMF Potential** 🟢
- High confidence this could work
- Recommend: Proceed with confidence
- Next step: Customer interviews → MVP → Launch

**60-79: Moderate PMF Potential** 🟡
- Promising but needs iteration
- Recommend: Validate weak dimensions before building
- Next step: Test hypotheses in low-scoring areas

**40-59: Weak PMF** 🟠
- Significant concerns
- Recommend: Major pivot needed
- Next step: Reconsider approach or target market

**0-39: Poor PMF** 🔴
- High likelihood of failure
- Recommend: Reconsider direction entirely
- Next step: New idea or different problem

### Minimum Viable Scores

**Red Flags** (Auto-fail if any dimension scores <30):
- Problem Clarity <30 → "Building something nobody needs"
- Market Size <30 → "Great product, no business"
- Solution Uniqueness <30 → "Commodity, can't compete"
- Technical Feasibility <30 → "Can't actually build it"

**Yellow Flags** (Watch closely if any dimension <50):
- Indicates area needing immediate attention
- Should be addressed before MVP

---

## Scoring Worksheet Template

```markdown
# PMF Scorecard: [Product Idea]

**Date**: MMDD-YY
**Evaluated by**: [Your name / team]

---

## Dimension 1: Problem Clarity (Weight: 30%)

### Evidence
- Target customer: [Persona description]
- Pain point: [Specific problem]
- Importance rating: [Avg from interviews] / 10
- Satisfaction rating: [Avg from interviews] / 10
- Opportunity gap: [Importance - Satisfaction]
- Validation: [How validated? Interviews, research, etc.]

### Scoring
- Target Customer Precision: [0-100]
- Pain Validation Strength: [0-100]
- Importance Rating: [0-100]
- Opportunity Gap: [0-100]

**Raw Score**: [Average of above 4] / 100
**Justification**: [Why this score? What evidence supports it?]

---

## Dimension 2: Market Size (Weight: 25%)

### Evidence
- TAM: $[X]
- SAM: $[X]
- SOM: $[X]
- Growth rate: [X]% annually
- Source: [Analyst report, bottom-up calc, etc.]

### Scoring
- TAM Size: [0-100]
- Growth Rate: [0-100]
- Reachability: [0-100]
- Competitive Intensity: [0-100]

**Raw Score**: [Weighted average] / 100
**Justification**: [Why this score? What evidence supports it?]

---

## Dimension 3: Solution Uniqueness (Weight: 25%)

### Evidence
- Key differentiators: [List]
- Performance advantage: [Xfactor vs. competitors]
- Moat type: [Data / Network / Tech / Process]
- Delighters: [List unique features]

### Scoring
- Must-Haves Met: [0-100]
- Performance Advantage: [0-100]
- Delighters: [0-100]

**Raw Score**: [Weighted average] / 100
**Justification**: [Why this score? What evidence supports it?]

---

## Dimension 4: Technical Feasibility (Weight: 20%)

### Evidence
- Complexity: [Low / Medium / High / Very High]
- Technology maturity: [Proven / Mature / Emerging / Experimental]
- Team capability: [Expert / Proficient / Can Learn / Gaps]
- Dependencies: [None / Minimal / Moderate / High / Critical]

### Scoring
- Complexity: [0-100]
- Technology Maturity: [0-100]
- Team Capability: [0-100]
- Dependency Risk: [0-100]

**Raw Score**: [Weighted average] / 100
**Justification**: [Why this score? What evidence supports it?]

---

## OVERALL PMF SCORE

| Dimension | Weight | Raw Score | Weighted Score |
|-----------|--------|-----------|----------------|
| Problem Clarity | 30% | [X] | [X × 0.30] |
| Market Size | 25% | [X] | [X × 0.25] |
| Solution Uniqueness | 25% | [X] | [X × 0.25] |
| Technical Feasibility | 20% | [X] | [X × 0.20] |
| **TOTAL PMF SCORE** | **100%** | - | **[Sum]** |

---

## INTERPRETATION

**Overall Score**: [X] / 100

**Rating**: 🟢 Strong | 🟡 Moderate | 🟠 Weak | 🔴 Poor

**Recommendation**: [Proceed / Iterate / Pivot / Stop]

---

## STRENGTHS (High-Scoring Dimensions)
1. [Dimension] (Score: [X]) - [Why this is strong]
2. [Dimension] (Score: [X]) - [Why this is strong]

## WEAKNESSES (Low-Scoring Dimensions)
1. [Dimension] (Score: [X]) - [Why this is weak] - **Action**: [How to improve]
2. [Dimension] (Score: [X]) - [Why this is weak] - **Action**: [How to improve]

## CRITICAL ASSUMPTIONS TO TEST
1. [Assumption from lowest-scoring area] - **Test**: [How to validate]
2. [Assumption that could invalidate thesis] - **Test**: [How to validate]

---

**Next Steps**: [Based on score, what should be done immediately?]
```

---

## Tips for Accurate Scoring

1. **Be Evidence-Based**: Every score should cite specific research/data
2. **Avoid Wishful Thinking**: Score current state, not potential future state
3. **Use Relative Benchmarks**: Compare to successful/failed products in category
4. **Pressure-Test Assumptions**: What if you're wrong about [key assumption]?
5. **Get Second Opinions**: Have someone else score independently, compare
6. **Update Regularly**: Rescore as you gather more validation data

---

**Remember**: The goal isn't a high score. It's an accurate assessment to make informed decisions.
