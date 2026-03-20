---
layout: post
title: "Zero Vibe Coding: How I Engineered a Full-Stack Finance App with Claude Code's Multi-Agent Pipeline"
date: 2026-03-20 12:00:00 +0000
categories: [ai, engineering, claude-code]
tags: [claude-code, multi-agent, hexagonal-architecture, spring-boot, react]
description: "How I built a production-ready Personal Finance Tracker entirely from the terminal using Claude Code CLI with a strict 7-agent spec-driven pipeline — no UI MCP tools, no vibe coding."
---

When we talk about AI-assisted coding, the conversation usually revolves around "vibe coding" — throwing vague prompts at an LLM, connecting a UI layout tool, and crossing our fingers that the underlying architecture holds together.

I wanted to see what happens when you treat AI not as a magic wand, but as an embedded enterprise engineering team. To test this, I built a production-ready Personal Finance Tracker entirely from the terminal. I strictly avoided UI Model Context Protocol (MCP) integrations like Figma. Instead, I forced the **Claude Code CLI** into a rigid, Spec-Driven, Multi-Agent Development Environment.

You can check out the final codebase here: [Personal Finance Tracker on GitHub](https://github.com/shanmuga-sundaram-n/personal-finance-tracker)

## The Final Product

Before diving into *how* the AI built this, here's a look at the final application running locally — clean, modern interface, responsive sidebar navigation, and distinct feature pages (Dashboard, Transactions, Budgets) generated without ever touching a visual design tool:

![Personal Finance Tracker UI Demo](/assets/images/projects/personal-finance-tracker.webp)

---

## 1. Unleashing Claude Code CLI Features

The Claude Code CLI provides native capabilities that elevate it out of a standard web chat interface. By leveraging the local filesystem, I turned the CLI into an automated powerhouse:

- **Custom Prompt Hooks (`.claude/hooks/`):** Building a modern React App requires strict linting, and AI can easily format things incorrectly. I created a `.claude/hooks/post-edit-lint.sh` script. Every time Claude Code edited a `.tsx` or `.ts` file, the CLI automatically fired off `$ESLINT_BIN --fix`. This completely eliminated broken CI builds due to styling errors.

- **Persistent CLI Memory (`.claude/agent-memory/`):** I stored detailed markdown files like `DOMAIN-OWNERSHIP.md` and `hexagonal-architecture.md`. Whenever I prompted Claude Code, it automatically fetched this local context to write code compliant with my architectural decisions.

- **Context Compaction (`/compact`):** Building a complex backend generates massive CLI context. Once Claude finished planning a feature, I simply typed `/compact`. This reset the active context window while keeping core memories intact — saving tokens and keeping the CLI fast.

- **Intelligent Commits (`/commit`):** After `./gradlew test` passed, rather than typing out git messages, I ran `/commit`. Claude Code read the actual `git diff` and generated a perfect, semantic commit message right in the terminal.

### Simulated Terminal Run: Claude Code in Action

```shell
$ claude
╭────────────────────────────────────────────────────────────────────────╮
│ Claude Code (v0.x.x) - Project: personal-finance-tracker               │
╰────────────────────────────────────────────────────────────────────────╯
▶ I want to add double-entry transfers between accounts. Follow the
  `Transaction.md` PRD and use the solution-planner workflow.

(Claude is thinking...)
[Reading files: docs/product/Transaction.md,
 .claude/agent-memory/tech-lead/architecture-decisions.md]

I will act as the solution-planner. Let's start the pipeline.
1. Running Domain Analysis against FR-1 (Double-Entry Transfers).
   - The transaction must atomically generate a TRANSFER_OUT and TRANSFER_IN.
2. Running Tech-Lead Architecture Review...
   - I will utilize a Spring `@Transactional` block.

Would you like me to spawn `full-stack-dev` to implement this now? (Y/n) > y
```

---

## 2. Coordinated Execution: The 7-Agent Pipeline

Instead of hooking up an external Figma MCP and letting a single AI guess at the UI and database simultaneously, I enforced spec-driven development using a pipeline of 7 distinct Markdown-based personas inside `.claude/agents/`.

The most impressive part wasn't the AI's coding ability — it was **the strict handoff mechanism** between agents. They never "spoke" in a chaotic group chat. They communicated by writing strict Markdown files (Briefs) to each other, orchestrated entirely by the `solution-planner`.

```
User Request
    │
    ▼
solution-planner (Orchestrator)
    │
    ├── 1. personal-finance-analyst  → Domain Brief
    ├── 2. tech-lead                 → Architecture Brief
    ├── 3. full-stack-dev            → Implementation
    ├── 4. ux-ui-designer            → Accessibility Audit
    ├── 5. qa-automation-tester      → Test Gatekeeper
    └── 6. devops-engineer           → CI/CD & Containers
                                            │
                                            ▼
                                    Feature Complete
```

Here's exactly how a feature flowed through this virtual team:

**Step 1 — `solution-planner` (The Orchestrator):** The central brain. This agent was explicitly instructed to *never* write software code. Its only job was to take my feature request, kickstart the pipeline, and gather outputs from the analysts.

**Step 2 — `personal-finance-analyst` (Domain Brief):** Before pushing code, the planner invoked the analyst. This agent evaluated feature requests against strict PRDs, caught financial edge cases like rounding errors, and generated a **Domain Brief**.

**Step 3 — `tech-lead` (Architecture Brief):** The architect analyzed business rules and translated them into Hexagonal Architecture and Liquibase schema designs. It generated an **Architecture Brief** outlining exact Java classes, `@Transactional` boundaries, and interfaces — catching cross-context import violations before they happened.

**Step 4 — `full-stack-dev` (Execution):** The developer received the merged Feature Implementation Brief and focused on end-to-end data flow from the PostgreSQL backend to the React Vite frontend — avoiding N+1 queries in JPA and using proper React state management.

**Step 5 — `ux-ui-designer` (Anti-Vibe Coding Audit):** By explicitly avoiding UI MCPs, I forced Claude to rely on strict UX heuristics. This agent reviewed React code strictly against WCAG 2.1 AA standards and Fitts's Law spacing (touch targets ≥ 44px).

**Step 6 — `qa-automation-tester` (The Gatekeeper):** This agent wrote integration tests via JUnit and MockMvc, utilized `axe-core` for accessibility enforcement, and refused to complete until `./gradlew test` passed in the terminal.

**Step 7 — `devops-engineer` (Infrastructure):** Configured Testcontainers (`postgres:15.2`), wrote multi-stage Dockerfiles with Alpine JRE layers, and managed GitHub Actions caching to slash build times.

---

## 3. Engineering Strict Guardrails

To ensure the CLI didn't drift as the conversation grew, I enforced architectural purity with **hard automated constraints** rather than hoping Claude would follow instructions.

### Guardrail A: Pure Hexagonal Boundaries via ArchUnit

The domain layer must be completely unaware of Spring or databases. If Claude generated a `Lombok` or `@Autowired` import inside the domain logic, the build failed physically in the terminal:

```java
// ArchitectureTest.java
@ArchTest
static final ArchRule domain_must_not_import_spring =
        noClasses()
                .that().resideInAPackage("..domain..")
                .should().dependOnClassesThat()
                .resideInAnyPackage("org.springframework..", "jakarta.persistence..", "lombok..")
                .as("Domain classes must not depend on Spring, JPA, Jackson, or Lombok");
```

### Guardrail B: Clean Wiring Without Framework Pollution

Claude was forbidden from using `@Service` or `@Component` on core business logic. Instead, it learned to construct a dedicated configuration class to wire dependencies manually:

```java
// account/config/AccountConfig.java
@Configuration
public class AccountConfig {
    @Bean
    public AccountCommandService accountCommandService(
            AccountPersistencePort accountPersistencePort,
            AccountEventPublisherPort accountEventPublisherPort) {
        return new AccountCommandService(accountPersistencePort, accountEventPublisherPort);
    }
}
```

### Guardrail C: Persistent Database Models vs Domain Models

To avoid attaching `@Entity` to a domain object (which allows bad states to bypass business invariants), Claude maintained two separate class structures:

```java
// account/adapter/outbound/persistence/AccountJpaEntity.java
@Entity
@Table(schema = "finance_tracker", name = "accounts")
public class AccountJpaEntity extends AuditableJpaEntity {

    @Column(name = "current_balance", nullable = false, precision = 19, scale = 4)
    private BigDecimal currentBalance; // Rule: Must be exactly NUMERIC(19,4)

    @Version
    @Column(name = "version", nullable = false)
    private Long version; // Rule: Required for optimistic locking
}
```

### Guardrail D: Anti-Corruption Layers (Bounded Context Isolation)

If the `budget` module needed `transaction` data, Claude had to build an explicit cross-context outbound port adapter — it could not directly import across bounded contexts:

```java
// budget/domain/port/outbound/TransactionSummaryPort.java
public interface TransactionSummaryPort {
    Money sumExpensesForCategory(CategoryId categoryId, LocalDate start, LocalDate end);
}
```

---

## 4. Feature Spotlight: Dynamic Budget Aggregation

**The Challenge:** Storing a physical `spentAmount` column on a Budget table is a classic beginner mistake — if you delete a transaction from 3 weeks ago, the budget's `spentAmount` goes out of sync.

**The Solution:** Because Claude Code was forced to follow the PRD, it leveraged Guardrail D to build a **Runtime Synthesis Engine** — dynamically computing usage on the fly rather than storing stale state:

```java
// Inside BudgetQueryService (Domain logic)
Money spentThisPeriod = transactionSummaryPort.sumExpensesForCategory(
    budget.getCategoryId(),
    budget.getStartDate(),
    budget.getEndDate()
);
budget.evaluateStatus(spentThisPeriod); // Flags true if spent >= 85% alert threshold
```

### QA Execution

```shell
▶ Automatically running QA sequence for new budget logic...

$ ./gradlew test --tests "com.shan.cyber.tech.financetracker.budget.*"

> Task :application:test
com.shan.cyber.tech.financetracker.budget.domain.BudgetQueryServiceTest
  ✔ dynamic_synthesis_calculates_correct_usage_percent()
  ✔ threshold_alert_triggered_when_over_85_percent()

BUILD SUCCESSFUL in 3s

[Claude]: All tests passed. ArchUnit hex boundaries are clean.
          Should I `/commit` these changes? (Y/n) > y
```

---

## Final Thoughts: From Chatbot to Engineering Partner

Building a production-ready application with Claude Code CLI reveals a massive shift in how AI should be utilized for software engineering. By rejecting "vibe coding" and external MCP crutches, and instead relying on Claude Code's native hooks, persistent memory, and `/compact` commands, I was able to enforce a rigid, 7-agent spec-driven environment.

This process didn't just build an app for me — it taught me how to properly design scalable databases, orchestrate Hexagonal solutions, and respect WCAG UX heuristics. By forcing Claude Code to respect pipeline personas and automated tests, you don't just get an AI assistant that writes text files — you get a senior engineering team embedded directly in your terminal.

Check out the full source: [github.com/shanmuga-sundaram-n/personal-finance-tracker](https://github.com/shanmuga-sundaram-n/personal-finance-tracker)
