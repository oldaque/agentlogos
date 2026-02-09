---
title: "Frameworks, Runtimes, and Harnesses"
description: Understanding the difference between frameworks, runtimes, and harnesses — and why this separation of concepts is here to stay.
date: 2025-02-09
section_top_parent: Agent Building
section_parent: Core Concepts
---

# Frameworks, Runtimes, and Harnesses: The Three Layers of Agent Construction

Every passing day I see more YouTube videos, X posts, Reddit threads — everyone with a "revolutionary new way" to build AI agents. And when you look closely, the person hasn't even structured the fundamental concepts of what building a real agent actually is. They put a wrapper on top of an API, call it an agent, and start selling courses.

The truth is that there is a method. There is a separation of concerns that the market has already validated and that is independent of which model you use, which provider you choose, or whatever hype is happening this week. Frameworks, runtimes, and harnesses are three distinct layers of agent construction, and understanding this separation is what separates those who build demos from those who put agents into production and make the project survive.

LangChain published [documentation](https://docs.langchain.com/oss/concepts/products) that maps this out clearly. I will use it as a basis, but adding my practical experience with each layer.

## Framework: Where you start

An agent framework gives you abstractions and integrations. It is the layer that standardizes how you interact with models, define tools, and set up the basic loop of an agent. The value is in reducing boilerplate and creating a common interface.

LangChain is the primary example, but Vercel AI SDK, CrewAI, OpenAI Agents SDK, Google ADK, Pydantic AI — they all operate at this layer. Each with its own opinions on how the interface should be.

When I started in this world, I entered through LlamaIndex. At the time it made sense — the project had a strong value proposition and an active community. But, to be honest, today I don't see the same relevance it had at launch. The ecosystem evolved and it didn't keep up at the same pace.

Today my stack is divided into two frameworks:

* **Pydantic AI** — I use it for more direct operations: CRUD, isolated LLM requests, flows where I don't need complex orchestration. What won me over with Pydantic AI is the native integration with the Pydantic ecosystem (which I already use for everything) and the fact that it talks well with Langsmith for observability due to OpenTelemetry.
* **LangChain** — It comes in when things get complex and I need a real runtime.

**When to use a framework:**

* You are starting a project and need speed to validate the idea.
* The flow is relatively linear: receive input → call model → execute tool → return.
* You want to standardize how the team interacts with LLMs without reinventing the wheel.
* Intelligent CRUD operations, classification, data extraction, summarization.

And that is exactly the point: a framework is an entry point. When the problem scales, you need the next layer.

## Runtime: Where things get serious

Here is what's happening: an agent in production is not just "call the model, get the response, execute the tool." You need to handle durable execution (the agent might run for hours), state persistence, streaming, human-in-the-loop, and fault recovery. That is the job of a runtime.

LangGraph is the runtime I use. It gives you granular control over orchestration — you define the execution graph, the nodes, the transitions, and you have visibility over everything that is happening. It is low-level compared to a framework, and that is exactly what you want when you are building something that will run in production with complex workflows.

Other options in this layer include Temporal and Inngest, which come from the world of durable execution and are not AI-specific — which, depending on the case, is an advantage.

The key point here: **frameworks run on top of runtimes**. LangChain 1.0, for example, is built on top of LangGraph. They are not competitors; they are complementary layers.

**When to use a runtime:**

* The agent needs to maintain state between executions (long conversations, multi-step processes).
* You need human-in-the-loop — a human approving or correcting agent decisions before proceeding.
* The workflow mixes deterministic steps with agentic steps (e.g., data validation → model decision → conditional execution).
* Fault recovery matters — if the agent goes down in the middle, it needs to resume from where it left off.
* Streaming partial responses is a requirement (real-time UX).

## Harness: Where the agent gains superpowers (and where the risk lives)

This is the newest layer and deserves special attention — both for its potential and its risk.

A harness is an opinionated framework that comes with batteries included: pre-defined tools, planning capabilities, sub-agents, file systems, context management. LangChain's [Deep Agents SDK](https://docs.langchain.com/oss/python/deepagents/overview) is the example I'm testing — built on top of LangGraph, it adds planning via a to-do list, pluggable filesystem, sub-agent spawning, and automatic token management.

What I've observed so far is promising: **the barrier to entry drops drastically when you understand the mental model of skills and sub-agents**. You can build complex agents with much less code and fewer architectural decisions because the harness has already made many of those decisions for you. But everything Deep Agents does, you can build directly in LangGraph. It is a layer of convenience and opinion on top of the runtime, not a new capability layer.

**When to use a harness:**

* The agent needs to plan and decompose complex tasks on its own (research, document analysis, code generation).
* You want to delegate subtasks to specialized sub-agents without manually orchestrating everything.
* The agent needs a filesystem — reading, writing, and manipulating files as part of the flow.
* Context management is critical (automatic history summarization, eviction of large results).
* You have good software engineering foundations and want to accelerate without losing control.

### The warning about market harnesses

I need to be direct about something: there is a category of harness that deserves special care — "ready-made" tools controlled by companies. Claude Code, ChatGPT Codex, Gemini CLI (or Antigravity), Cursor, and the like.

I use these tools. They are useful and speed up daily work. But it is fundamental to understand the risk: **you have no control over their behavior**. The company can change the underlying model, alter the system prompt, modify how tools are called, and what worked yesterday simply stops working tomorrow. You don't have access to the code, you have no way to debug what changed, and you are at the mercy of product decisions that don't necessarily align with your use case.

As an engineer, this bothers me. Not because the tools are bad — they are great for many scenarios — but because if your product depends on a specific behavior of an agent, you need to have control over that agent. Building with open-source frameworks and runtimes gives you that. Building solely on top of proprietary harnesses leaves you vulnerable.

Not every harness has this problem. Langsmith, for example, is an observability harness that saves an incredible amount of time in building and debugging agents — and even though it's paid, the value it delivers justifies it. It is also possible to build your own harnesses with Pydantic AI or LangGraph, but then you need to code and validate more structures. It's more work, but it's possible and gives you total control.

## Why LangChain

With so many options, why LangChain as the primary ecosystem?

**Validated market standard.** It's not just hype — serious companies use it in production. Replit built its code agent with LangGraph. Uber uses it for developer productivity and code generation. LinkedIn uses it for search and text-to-SQL. Klarna, BlackRock, J.P. Morgan in the financial sector. Elastic, GitLab, Rakuten, Vodafone, Cisco — the [list of case studies](https://docs.langchain.com/oss/python/langgraph/case-studies) is extensive and features names you recognize.

**Community and ecosystem.** A massive community, tons of integrations, and problems you encounter have likely already been solved by someone else.

**Completeness.** It has everything you need to build agents — from the basic framework to the production runtime to the advanced harness. You don't need to stitch five different libraries together.

**Truly open source.** LangChain, LangGraph, and Deep Agents are open source. Only Langsmith and the cloud infra are paid, and they are not mandatory — Langsmith has a free tier that covers the development phase well.

**Language runtime flexibility.** This is a point few people talk about: LangChain has an implementation in JavaScript/TypeScript, which means you can run it with the `bun` runtime — which is absurdly faster than the standard Python runtime. In high-scale and high-speed scenarios, this can be a real differentiator. Pydantic AI, for example, only runs Python. I confess I haven't used LangChain with Bun in production in a demanding environment yet, but it's an ace up my sleeve that keeps me prepared if needed. Programming language runtimes are a topic for another note.

## The separation that matters

| Layer | What it gives you | When to use | Examples |
| --- | --- | --- | --- |
| **Framework** | Abstractions, integrations, standardization | Quick start, direct operations, team standardization | LangChain, Pydantic AI, Vercel AI SDK |
| **Runtime** | Durable execution, persistence, streaming, HITL | Production agents, complex workflows, fault recovery | LangGraph, Temporal, Inngest |
| **Harness** | Ready-made tools, planning, sub-agents, context management | Autonomous agents, multi-step tasks, rapid prototyping | Deep Agents SDK, Claude Agent SDK |

Regardless of the model you choose, the provider you use, or the trendy tool of the moment — these three concepts are fundamental to putting an agent into production and making the project succeed. Models will evolve, tools will emerge and die, but the separation between framework, runtime, and harness is architectural. It's like separating frontend, backend, and infra — you can swap the parts, but the structure of responsibilities remains.

In practice, my stack today is Pydantic AI for simple things, LangChain + LangGraph for complex orchestration, Deep Agents when the agent needs real autonomy with planning, and Langsmith cutting across everything for observability. Use the market's ready-made tools to accelerate, but maintain the ability to build without them.