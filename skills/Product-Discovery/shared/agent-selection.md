# Agent Selection for Product Discovery

Dynamic agent selection based on product idea complexity and research needs.

## Overview

Product Discovery uses **Deep research mode** (5-8 agents) to comprehensively validate ideas.

### Core Research Agents (Always Spawn)

1. **market-researcher**
2. **tech-researcher**
3. **content-researcher**

### Conditional Agents (Spawn Based on Complexity)

4. **financial-researcher** (if business model questions)
5. **team-researcher** (if customer insights needed)

### Support Agents (Always Spawn)

6. **quality-reviewer** (gap analysis)
7. **synthesizer** (consolidation)

---

## Agent Selection Matrix

| Idea Complexity | Core (3) | Conditional (+0-2) | Support (2) | Total Agents |
|-----------------|----------|-------------------|-------------|--------------|
| **Simple** (clear market, simple tech) | ✅ | - | ✅ | 5 agents |
| **Standard** (most ideas) | ✅ | +1 | ✅ | 6 agents |
| **Complex** (novel market or tech) | ✅ | +2 | ✅ | 7-8 agents |

---

## Agent Descriptions & Selection Criteria

### 1. market-researcher (ALWAYS)

**Focus**: TAM/SAM/SOM, market dynamics, competitive landscape

**Tools**: perplexity, exa, parallel-search

**Output**: Market analysis with sizing, trends, competition

**Spawn when**: Always (core to every product idea)

**Research Questions**:
- What is the TAM/SAM/SOM for [product category]?
- Who are the main competitors? Strengths/weaknesses?
- What market trends support or challenge this idea?
- Is the market growing or declining?
- What is the competitive intensity?

**Output File**: `raw/agent-market-researcher.md`

---

### 2. tech-researcher (ALWAYS)

**Focus**: Technical feasibility, complexity, risks, maturity

**Tools**: perplexity (for tech research), exa (for code/papers), parallel-search

**Output**: Feasibility assessment with complexity rating

**Spawn when**: Always (every idea has technical considerations)

**Research Questions**:
- Is [solution] technically feasible with current technology?
- What is the complexity level (Low/Med/High)?
- What are the main technical risks?
- What technology stack is recommended?
- What are the development time estimates?
- Are there any technical moats?

**Output File**: `raw/agent-tech-researcher.md`

---

### 3. content-researcher (ALWAYS)

**Focus**: Similar products, case studies, lessons learned

**Tools**: perplexity, exa (for articles/studies), parallel-search

**Output**: Case study analysis with success/failure patterns

**Spawn when**: Always (learning from similar products is critical)

**Research Questions**:
- What similar products exist or existed?
- Which ones succeeded? Which failed? Why?
- What patterns emerge from successful products?
- What mistakes did failed products make?
- What lessons can be applied to this idea?
- What best practices should be followed?

**Output File**: `raw/agent-content-researcher.md`

---

### 4. financial-researcher (CONDITIONAL)

**Focus**: Business model, revenue potential, unit economics

**Tools**: perplexity, exa (for funding data), parallel-search

**Output**: Financial viability assessment

**Spawn when**:
- ✅ Business model is unclear from interview
- ✅ Monetization is complex (multi-sided marketplace, freemium, etc.)
- ✅ User asking about revenue potential
- ✅ Idea involves financial products or transactions
- ❌ Skip if: Simple SaaS with obvious subscription model

**Decision Logic**:
```python
spawn_financial = (
    business_model_unclear or
    complex_monetization or
    user_asked_about_revenue or
    financial_product
)
```

**Research Questions**:
- What business models work in this category?
- What is realistic ARPU (Average Revenue Per User)?
- What are typical CAC (Customer Acquisition Cost) and LTV (Lifetime Value)?
- What is the path to profitability?
- What revenue milestones are realistic?

**Output File**: `raw/agent-financial-researcher.md`

---

### 5. team-researcher (CONDITIONAL)

**Focus**: Target customer research, behavior patterns, pain validation

**Tools**: perplexity, exa (for behavior studies), parallel-search

**Output**: Customer insights with behavior patterns

**Spawn when**:
- ✅ Target customer is poorly defined in interview
- ✅ Need to validate customer pain points
- ✅ User doesn't have direct access to target customers
- ✅ B2B idea where buyer personas are complex
- ❌ Skip if: User has already done extensive customer research

**Decision Logic**:
```python
spawn_team = (
    target_customer_vague or
    pain_validation_needed or
    no_customer_access or
    complex_buyer_personas
)
```

**Research Questions**:
- What do we know about [target customer] demographics and behaviors?
- What similar pain points do they have?
- Where do they discover new products/solutions?
- What are their decision-making patterns?
- What influences their buying behavior?

**Output File**: `raw/agent-team-researcher.md`

---

### 6. quality-reviewer (ALWAYS)

**Focus**: Gap analysis, contradiction detection, completeness check

**Tools**: Read only (reviews other agent outputs)

**Output**: Quality assessment + follow-up recommendations

**Spawn when**: Always (ensures research quality)

**Process**:
1. Read all agent outputs (`raw/agent-*.md`)
2. Assess completeness: Are all dimensions covered?
3. Detect contradictions: Do agents report conflicting data?
4. Identify gaps: What critical information is missing?
5. Generate follow-up questions (if needed)

**Note**: In Product Discovery, quality-reviewer does NOT spawn follow-up agents (time constraint). Instead, flags gaps in final report.

**Output File**: `raw/agent-quality-reviewer.md`

---

### 7. synthesizer (ALWAYS)

**Focus**: Consolidate findings, apply Lean Product lens, generate unified insights

**Tools**: Read only (reads all agent outputs)

**Output**: Synthesis for final report

**Spawn when**: Always (consolidates all research)

**Process**:
1. Read all agent outputs (including quality-reviewer)
2. Consolidate findings by dimension:
   - Market Analysis (from market-researcher)
   - Technical Feasibility (from tech-researcher)
   - Case Studies (from content-researcher)
   - Financial Viability (from financial-researcher if available)
   - Customer Insights (from team-researcher if available)
3. Resolve contradictions
4. Apply Lean Product Playbook lens:
   - Map findings to Product-Market Fit Pyramid
   - Identify validation priorities
   - Flag risks and assumptions
5. Generate actionable insights

**Output File**: `raw/agent-synthesizer.md`

---

## Agent Spawning Workflow

### Step 1: Analyze Interview

After interview completion, analyze to determine agent needs:

```python
# Always spawn
agents = [
    "market-researcher",
    "tech-researcher",
    "content-researcher",
    "quality-reviewer",
    "synthesizer"
]

# Conditional spawning
if needs_financial_analysis(interview):
    agents.insert(3, "financial-researcher")

if needs_customer_insights(interview):
    agents.insert(4, "team-researcher")

total_agents = len(agents)  # 5-7 agents
```

### Step 2: Spawn All Agents in Parallel

```markdown
Spawning {total_agents} research agents in parallel...

🔬 **DEEP RESEARCH MODE** (10-15 minutes)

Agents:
1. market-researcher - Market sizing and competitive analysis
2. tech-researcher - Technical feasibility assessment
3. content-researcher - Case study research
{if_spawned: 4. financial-researcher - Business model analysis}
{if_spawned: 5. team-researcher - Customer insights research}
6. quality-reviewer - Gap analysis
7. synthesizer - Consolidation

Please wait while research completes...
```

### Step 3: Configure Agent Prompts

Each agent receives:
1. **Product Idea Summary** (from interview)
2. **Target Customer** (from interview)
3. **Key Hypotheses** (from clarify phase)
4. **Workspace Path**
5. **Agent-Specific Focus** (see individual agent descriptions)
6. **MCP Tool Access** (perplexity, exa, parallel-search)

**Template**:
```
Task: {agent-name}
Model: haiku (for speed, except synthesizer uses sonnet)

Prompt:
"Research {product-idea} to validate hypotheses.

**Product Idea**: {1-paragraph summary}
**Target Customer**: {persona}
**Key Hypotheses**:
{list from clarify phase}

**Workspace**: {workspace-path}
**Output to**: {workspace-path}/raw/agent-{agent-name}.md

**Your Focus** (as {agent-name}):
{agent-specific focus from above}

**Research Questions**:
{agent-specific questions from above}

You have access to MCP tools (perplexity, exa, parallel-search). Make autonomous calls.

Use emoji format:
- 🔍 Starting research
- 📊 Data/findings sections
- 💡 Key insights
- ⚠️ Concerns/risks
- ✅ Strengths
- 🔗 Sources
- 🎯 Completion

Save to workspace path."
```

---

## Agent Model Selection

| Agent | Model | Rationale |
|-------|-------|-----------|
| market-researcher | haiku | Speed, sufficient for research |
| tech-researcher | haiku | Speed, sufficient for research |
| content-researcher | haiku | Speed, sufficient for research |
| financial-researcher | haiku | Speed, sufficient for research |
| team-researcher | haiku | Speed, sufficient for research |
| quality-reviewer | haiku | Simple gap analysis |
| synthesizer | **sonnet** | Complex consolidation requires reasoning |

**Cost Optimization**: Use haiku ($0.02-0.05/agent) for data gathering, sonnet ($0.10-0.20) only for synthesis.

---

## Expected Agent Outputs

### market-researcher Output Structure

```markdown
🔍 **STARTING:** market-researcher analyzing [product idea]

## Market Size

📊 TAM/SAM/SOM Analysis:
- TAM (Total Addressable Market): $[X]
- SAM (Serviceable Addressable Market): $[Y]
- SOM (Serviceable Obtainable Market): $[Z]
- Sources: [List]

## Market Dynamics

📊 Growth & Trends:
- Market growth rate: [X]% annually
- Key trends: [List]
- Drivers: [List]

## Competitive Landscape

📊 Competitors:
| Competitor | Strengths | Weaknesses | Market Share |
|------------|-----------|------------|--------------|
| [Name] | [List] | [List] | [%] |

💡 **Key Insights**:
- [Insight 1]
- [Insight 2]

⚠️ **Concerns**:
- [Concern 1]

✅ **Strengths**:
- [Strength 1]

🔗 **Sources**:
- [Source 1]
- [Source 2]

🎯 **COMPLETED:** market-researcher finished [product idea] research
```

### tech-researcher Output Structure

```markdown
🔍 **STARTING:** tech-researcher analyzing [product idea]

## Technical Feasibility

📊 Feasibility Assessment:
- Overall feasibility: High | Medium | Low
- Rationale: [Explanation]

## Complexity Analysis

📊 Complexity Rating: Low | Medium | High | Very High

**Breakdown**:
- [Component 1]: [Complexity level] - [Why]
- [Component 2]: [Complexity level] - [Why]

## Technology Stack

📊 Recommended Stack:
- Frontend: [Tech]
- Backend: [Tech]
- Database: [Tech]
- Infrastructure: [Tech]

## Risks & Mitigation

⚠️ **Technical Risks**:
- [Risk 1] - Mitigation: [How to reduce]
- [Risk 2] - Mitigation: [How to reduce]

💡 **Key Insights**:
- [Insight 1]

✅ **Technical Advantages**:
- [Advantage 1]

🔗 **Sources**:
- [Source 1]

🎯 **COMPLETED:** tech-researcher finished [product idea] analysis
```

### content-researcher Output Structure

```markdown
🔍 **STARTING:** content-researcher analyzing [product idea]

## Similar Products

📊 Products Analyzed:
1. [Product 1] - Status: [Success/Failed]
2. [Product 2] - Status: [Success/Failed]
3. [Product 3] - Status: [Success/Failed]

## Success Patterns

✅ **What Worked**:
- [Pattern 1] - Example: [Product]
- [Pattern 2] - Example: [Product]

## Failure Patterns

❌ **What Didn't Work**:
- [Pattern 1] - Example: [Product]
- [Pattern 2] - Example: [Product]

## Key Lessons

💡 **Actionable Insights**:
- [Lesson 1]
- [Lesson 2]

🔗 **Sources**:
- [Case study 1]
- [Case study 2]

🎯 **COMPLETED:** content-researcher finished case study analysis
```

### quality-reviewer Output Structure

```markdown
🔍 **STARTING:** quality-reviewer assessing research quality

## Completeness Check

✅ **Covered Dimensions**:
- [Dimension 1]
- [Dimension 2]

⚠️ **Gaps Identified**:
- [Gap 1] - Severity: High/Med/Low
- [Gap 2] - Severity: High/Med/Low

## Contradiction Detection

⚠️ **Contradictions Found**:
- [Agent A] says [X], but [Agent B] says [Y]
- Resolution: [Likely explanation]

## Data Quality

📊 **Confidence Assessment**:
- market-researcher: High | Medium | Low
- tech-researcher: High | Medium | Low
- content-researcher: High | Medium | Low

Overall Confidence: High | Medium | Low

## Recommendations

💡 **Before Building**:
- [Critical validation 1]
- [Critical validation 2]

🎯 **COMPLETED:** quality-reviewer finished assessment
```

### synthesizer Output Structure

```markdown
🔍 **STARTING:** synthesizer consolidating all research

## Executive Summary

[3-4 paragraphs synthesizing key findings across all agents]

## Cross-Agent Insights

💡 **Converging Evidence**:
- [Insight where multiple agents agree]

⚠️ **Diverging Perspectives**:
- [Area where agents have different views]
- Recommended interpretation: [...]

## Lean Product Lens

**Product-Market Fit Pyramid Mapping**:
1. Target Customer: [Validated/Needs validation]
2. Underserved Needs: [Strength of opportunity gap]
3. Value Proposition: [Differentiation strength]
4. Feature Set: [Scope feasibility]

## Validation Priorities

🎯 **Critical Assumptions to Test**:
1. [Assumption from weakest area]
2. [Assumption with highest risk]

## Confidence Assessment

Overall Research Confidence: High | Medium | Low

**Rationale**: [Why this confidence level]

🎯 **COMPLETED:** synthesizer finished consolidation
```

---

## Cost & Duration Estimates

| Agent Count | Haiku Agents | Sonnet Agents | Est. Cost | Duration |
|-------------|--------------|---------------|-----------|----------|
| 5 (Simple) | 4 | 1 | $0.15-0.30 | 8-12 min |
| 6 (Standard) | 5 | 1 | $0.20-0.35 | 10-14 min |
| 7-8 (Complex) | 6-7 | 1 | $0.25-0.45 | 12-16 min |

**Actual duration varies** based on:
- MCP response times
- Research query complexity
- Parallel execution efficiency

---

## Agent Failure Handling

### If Agent Times Out
1. Log failure: `[Agent-name] failed: timeout after 5 minutes`
2. Continue with other agents
3. Flag in final report: "Note: [agent] data unavailable"
4. Adjust confidence scores accordingly

### If MCP Calls Fail
- Agents handle fallbacks internally (exa → parallel-search → WebSearch)
- Log which MCPs failed
- Note data quality concern in output

### If Critical Agent Fails
**Critical agents**: market-researcher, synthesizer

If either fails:
1. Retry ONCE
2. If still fails: Warn user that research is incomplete
3. Offer to retry later or proceed with limitations

---

## Agent Communication

Agents do NOT communicate with each other. They work in isolation and parallel.

**Synthesizer** is responsible for resolving any conflicts or integrating perspectives.

---

## Selection Decision Tree

```
START
├─ Always spawn: market, tech, content, quality, synthesizer (5 agents)
│
├─ Business model unclear or complex?
│   YES → Spawn financial-researcher (6 agents)
│   NO → Skip
│
├─ Target customer vague or no customer access?
│   YES → Spawn team-researcher (7 agents)
│   NO → Skip
│
END: 5-7 agents total
```

---

## Testing & Validation

When testing this agent selection:
- [ ] Verify all 5 core agents spawn correctly
- [ ] Verify financial-researcher spawns when business model is complex
- [ ] Verify team-researcher spawns when customer is vague
- [ ] Verify all agents complete within 15 minutes
- [ ] Verify synthesizer consolidates all outputs
- [ ] Verify quality-reviewer catches gaps

---

**Remember**: More agents = more comprehensive research, but also more time and cost. Balance based on idea complexity.
