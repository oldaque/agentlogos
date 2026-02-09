---
title: Core Concepts
description: The essential components that make up an AI agent.
date: 2026-02-09
order: 1
section_top_parent: Agent Building
section_parent: Core Concepts
---

# Core Concepts of Agent Architecture

When we strip away the marketing terms, every AI agent consists of four main components interacting in a loop. Understanding these components is critical to designing systems that actually work.

## 1. The Brain (Model)

The central component is the Large Language Model (LLM). In an agentic system, the LLM is not just a text generator; it is a **reasoning engine**.

-   **Role**: To understand the current state, decide what to do next, and generate the arguments for tool calls.
-   **Key Capability**: Instruction following and function calling (tool use).
-   **Constraint**: It is stateless by default. It forgets everything after each API call unless we provide context.

## 2. The Body (Tools)

An agent without tools is just a chatbot. Tools are the functions and APIs that allow the agent to interact with the world.

-   **Examples**:
    -   A function to query a SQL database.
    -   An API call to send a Slack message.
    -   A script to scrape a webpage.
-   **Design Principle**: Tools must be deterministic and return structured data (JSON) that the LLM can easily parse. A tool that returns a 500-page HTML dump will confuse the model; a tool that returns a specific extracted value is gold.

## 3. The Memory (State)

Because LLMs are stateless, "memory" is simply the mechanism we use to pass history back to the model in each turn of the conversation.

-   **Short-term Memory**: The list of messages in the current conversation (User, Assistant, Tool Output). We must manage this window carefully (e.g., summarizing old messages) to stay within context limits and keep costs down.
-   **Long-term Memory**: storing data in a database (Vector DB or SQL) and retrieving relevant information (RAG) when needed. This allows the agent to "remember" things from widely past conversations or documents.

## 4. The Orchestrator (Control Flow)

This is the code that ties it all together. It's the `while` loop that keeps the agent running.

The basic loop looks like this:
1.  **Input**: Receive a task from the user.
2.  **Think**: Send the task + history to the LLM.
3.  **Decide**: The LLM decides to use a **Tool**.
4.  **Act**: The Orchestrator executes the tool code.
5.  **Observe**: The tool returns an output.
6.  **Loop**: The output is added to history, and we go back to step 2.
7.  **Finish**: If the LLM decides it has the answer, it returns the final response to the user.

Frameworks like **LangChain** and runtimes like **LangGraph** exist primarily to manage this loop robustly—handling errors, managing state, and allowing for complex branching logic (e.g., "if the tool fails, try this other tool").

## Visualizing the Architecture

(Diagram placeholder - Imagine a flowchart where the LLM is a decision diamond, connected to a "Tools" box, with a "Memory" cylinder feeding into the LLM)

Understanding these four pillars—Brain, Body, Memory, and Orchestrator—is the first step. Next, we look at the specific technologies we use to build them.
