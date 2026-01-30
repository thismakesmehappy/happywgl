# Context Loading Strategies

**How to use multiple context files in Claude Code sessions**

Three distinct approaches, each with different use cases and trade-offs.

---

## Strategy 1: Manual Invocation (User-Driven)

**How it works:** You manually tell the AI to load specific context when needed.

### Usage Pattern

```
You: "Let's implement the Shader feature."

Claude: [Loads CLAUDE.md for project overview]

You: "Here's the approach... before I start, can you review?"

Claude: [You could say] "Check the approval workflow to see if this meets requirements"

Claude: [Then loads .claude/contexts/approval-workflow.md to verify]
```

### Implementation

You would include **`@-references`** in your prompts:

```
Let's implement Shader.ts

Feature: Shader compilation and program management
File: src/resources/Shader.ts
Key Requirements:
- Compile vertex and fragment shaders
- Link into programs
- Error handling with descriptive messages

Review this against: @.claude/contexts/approval-workflow.md

Does this approach meet the requirements?
```

Or when debugging:

```
I'm getting a test failure in the shader compilation tests.
The error is: [error details]

Check @.claude/contexts/debugging.md and @.claude/quick-ref/troubleshooting.md

What could cause this?
```

### Advantages ✅

- **Flexibility:** Load exactly what you need, when you need it
- **No automation needed:** Works with current Claude Code out of the box
- **Clear intent:** The AI sees exactly what you're asking it to reference
- **Natural workflow:** Matches how you'd reference docs anyway
- **No setup:** Just organize files and reference them

### Disadvantages ❌

- **Manual:** You have to remember to reference the right file
- **Token overhead:** You must type the reference each time
- **Easy to forget:** Might load wrong context if you're not explicit
- **Not automated:** AI doesn't know which context to load proactively

### When to Use

✅ **Good for:**
- You like being explicit and in control
- You work on different task types with clear boundaries
- You remember to reference docs when needed
- You want no configuration or setup

❌ **Not ideal for:**
- Consistent context loading across sessions
- Multi-session projects where context should persist
- Automatic context switching

---

## Strategy 2: Session-Specific Context (File-Based Auto-Load)

**How it works:** Claude Code auto-loads context based on which files you reference.

### Implementation

Each `.claude/` file would start with auto-load directives. Claude Code looks for these when starting a session.

**`.claude/contexts/approval-workflow.md`** (first few lines):

```markdown
<!-- claude-context: approval-workflow -->
<!-- auto-load: when-feature-requested -->
<!-- priority: high -->

# Feature Approval Workflow

When starting a new feature...
```

**`.claude/contexts/implementation.md`:**

```markdown
<!-- claude-context: implementation -->
<!-- auto-load: when-coding -->
<!-- priority: medium -->

# Implementation Guide

Patterns and quality standards...
```

**`.claude/SNAPSHOT.md`:**

```markdown
<!-- claude-context: snapshot -->
<!-- auto-load: always -->
<!-- priority: high -->

# Session Snapshot

**Project:** WebGL Graphics Library
**Status:** Phase 1 - 99.01% coverage
...
```

### How It Works in Practice

**Session Start (auto-loads):**
```
Starting new Claude Code session in /webgl

Auto-loading contexts:
✓ .claude/SNAPSHOT.md (always)
✓ CLAUDE.md (always)
[This takes ~1 second]

Ready to help! What would you like to work on?
```

**Task: Approve a feature (auto-loads):**
```
You: "I want to implement a new feature. Here's the approach..."

Claude: [Detects feature request, auto-loads approval-workflow.md]
Claude: "Let me check this against our approval workflow..."
Claude: [Shows approval criteria from the context]
```

**Task: Writing code (auto-loads):**
```
You: "Let's implement the Geometry class"

Claude: [Detects coding task, auto-loads implementation.md]
Claude: "Following our implementation guide, here's the pattern..."
```

### Advantages ✅

- **Automatic:** No manual referencing needed
- **Contextual:** Right context loads for the task type
- **Efficient:** Doesn't load unnecessary contexts
- **Fast:** Multi-session projects stay in sync
- **Smart:** AI understands context purpose

### Disadvantages ❌

- **Requires setup:** Need metadata in files
- **Not native Claude Code:** Requires custom integration or hook
- **Magic behavior:** Harder to debug why context loaded
- **Platform dependent:** Depends on Claude Code supporting it
- **Overkill for small projects:** Too much infrastructure

### When to Use

✅ **Good for:**
- Multi-session projects with consistent workflow
- Teams using Claude Code together
- Complex projects with many context types
- You want "set it and forget it"

❌ **Not ideal for:**
- Simple, one-off projects
- When you prefer explicit control
- Projects where context rarely changes
- If Claude Code doesn't support it

---

## Strategy 3: Conversation-Based Context (Persistent Sessions)

**How it works:** You keep one long-running Claude conversation where context accumulates naturally.

### Usage Pattern

**Session 1 - Setup:**
```
You: "I'm building a WebGL graphics library. Here's the project structure..."
You: "These are our code patterns and quality standards..."
You: "Here's the approval workflow we use..."

Claude: [Learns everything over conversation]
Claude: "Got it! I understand the project. Ready to work."
```

**Session 2 - Later, same conversation:**
```
You: "Let's implement the Shader feature."

Claude: [Remembers all previous context from conversation history]
Claude: "Based on your patterns and workflow, here's the approach..."
```

**Session 3 - Even later:**
```
You: "I need to debug a test failure."

Claude: [Still has all context in conversation memory]
Claude: "Let me check against the patterns we discussed earlier..."
```

### Implementation

**File: `.claude/session-context.txt`** - Paste into new conversation to bootstrap:

```
PROJECT CONTEXT
===============

Project: WebGL Graphics Library
Current Status: Phase 1 - 99.01% coverage / 1,120 tests

APPROVAL WORKFLOW
=================
1. Present feature with: Feature description, file path, key requirements
2. Get feedback: Approve, request changes, or ask questions
3. Implement: Following patterns below, target 95%/90% coverage
4. Report: Show implementation, tests, coverage, project status
5. Approval to commit: User approves, then I commit

CODE PATTERNS
=============

Instance Methods (mutate + chain):
```typescript
multiply(other: Matrix4): this {
  // mutate this
  return this;
}
```

Static Methods (no mutation):
```typescript
static multiply(a: Matrix4, b: Matrix4): Matrix4 {
  const result = a.clone();
  result.multiply(b);
  return result;
}
```

[... more patterns ...]

KEY DECISIONS
=============

1. WebGLState manages state, not GLContext
   - GLContext: Resources and canvas
   - WebGLState: State tracking
   - Prevents out-of-sync issues

2. Redundancy detection
   - Skip redundant GPU calls
   - Track internal state
   - O(1) lookups with Maps

3. Column-major matrices
   - All matrices use GLSL convention
   - Data: [col0_row0, col0_row1, ..., col1_row0, ...]
   - Reference: Matrix4.ts

[... more decisions ...]
```

### How It Works in Practice

**Starting:**
```
You: [Paste bootstrap file]
You: "This is the project context. Ready?"

Claude: "Ready! I have the full project context. What should we work on?"
```

**Working:**
```
You: "Let's implement Shader.ts"

Claude: [Has all context in memory]
Claude: "Based on our patterns and workflow, here's the approach...
   Following our approval workflow, I'll need:
   1. Your confirmation this looks good
   2. Then I'll implement
   ..."
```

**Later in same conversation:**
```
You: "The tests are failing"

Claude: [Still has full context]
Claude: "Let me check against our patterns and our test organization...
   Looking at the error, this might be because...
   "
```

### Advantages ✅

- **Simple:** No file setup or infrastructure needed
- **Works today:** Native Claude Code support
- **Persistent memory:** Context stays throughout long conversation
- **Natural:** Feels like talking to someone who knows the project
- **Flexible:** Add context incrementally as needed
- **No automation:** Just text pasting, no magic

### Disadvantages ❌

- **Manual context loading:** Have to paste bootstrap every conversation
- **Context limit:** Claude's context window has limits (~200K tokens)
- **Conversation-bound:** Context lost if you start new conversation
- **Scaling:** Hard to manage as project grows significantly
- **Duplication:** Same bootstrap text in multiple conversations
- **Not distributed:** Can't easily share context with other AI sessions

### When to Use

✅ **Good for:**
- Single long-running development sessions
- Working on one feature at a time
- Projects where you keep conversation open
- Simple, focused workflows
- Maximum flexibility and natural interaction

❌ **Not ideal for:**
- Multi-session projects over weeks/months
- Team collaboration with multiple sessions
- Very large projects with massive context
- When you want automated context switching
- Keeping organized context over time

---

## Strategy 4: Hybrid Approach (Recommended for Your Project)

**Combines the best of manual + conversation-based + file organization**

### How It Works

1. **File Organization:** Keep `.claude/contexts/` organized (like Strategy 3)
2. **Bootstrap Session:** Create `.claude/session-context.txt` with key info
3. **Manual References:** Use `@-references` when you need specific guidance
4. **Conversation Accumulation:** Let context accumulate naturally over session

### Implementation

**Start of project:**
```
You: "Let's set up context for this project"

Claude: [Files already organized in .claude/]

You: [Opens new Claude session]
You: [Pastes `.claude/session-context.txt` into first message]

Claude: "Got it! I have the project context. Ready to work."
```

**Feature approval:**
```
You: "Here's the Shader feature approach..."
You: "Check @.claude/contexts/approval-workflow.md"

Claude: [Has session context + specific approval workflow]
Claude: "Checking against our approval workflow..."
```

**Implementation:**
```
You: "Approved! Proceed with implementation."

Claude: [Has session context in memory, doesn't need to re-reference files]
Claude: "Following our patterns and implementation guide..."
```

**Debugging:**
```
You: "Tests are failing"

Claude: [Has session context, but might need debugging specifics]
Claude: "Let me check our debugging guide... @.claude/contexts/debugging.md"
```

### Advantages ✅

- **Organized:** Clear file structure
- **Efficient:** Don't reload same info every session
- **Flexible:** Manual references when needed
- **Natural:** Context accumulates in conversation
- **Scalable:** Easy to add new contexts as project grows
- **Best of both:** Automatic + manual, file-based + conversation-based

### Disadvantages ❌

- **Setup required:** Need to organize files
- **Bootstrap needed:** Must paste initial context each conversation
- **Balanced complexity:** Not the simplest, not the most automated
- **Requires discipline:** Need to remember when to use references

### When to Use

✅ **Perfect for:**
- Medium to large projects (like your WebGL library)
- Long-term development over weeks/months
- Mix of routine tasks and new challenges
- Organized teams that value structure
- Projects that need both automation and flexibility

---

## Comparison Matrix

| Strategy | Setup | Manual Refs | Auto-Load | Persistent | Token Efficient | Team Friendly |
|----------|-------|------------|-----------|-----------|-----------------|---------------|
| **1. Manual** | ⭐ Easy | ✅ Yes | ❌ No | ❌ No | ⭐ Good | 🟡 OK |
| **2. Auto-Load** | 🟡 Medium | ❌ No | ✅ Yes | ✅ Yes | ✅ Best | ✅ Great |
| **3. Conversation** | ⭐ Easy | ⭐ No | ❌ No | ✅ Yes | 🟡 OK | ❌ No |
| **4. Hybrid** | 🟡 Medium | ✅ Yes | 🟡 Some | ✅ Yes | ✅ Good | ✅ Great |

---

## Recommendation for Your Project

**Use Strategy 4 (Hybrid) because:**

1. ✅ Your project is complex enough to benefit from organization
2. ✅ You work in long-running sessions (like today)
3. ✅ You want flexibility for different task types
4. ✅ Future features might need specific context
5. ✅ It scales as the project grows
6. ✅ Works with current Claude Code today

### Your Hybrid Setup

**Phase 1: Organize Files**
```
.claude/
├─ session-context.txt    (Bootstrap file with core info)
├─ contexts/
│  ├─ approval-workflow.md
│  ├─ implementation.md
│  ├─ debugging.md
│  └─ architecture.md
└─ quick-ref/
   ├─ npm-commands.md
   ├─ git-workflow.md
   └─ patterns.md
```

**Phase 2: Start Session**
```
1. Open new Claude Code session
2. Paste `.claude/session-context.txt` in first message
3. Claude loads core context
```

**Phase 3: Reference as Needed**
```
When you need specific guidance:
"Check @.claude/contexts/approval-workflow.md"
"Review @.claude/contexts/implementation.md"
"See @.claude/quick-ref/patterns.md for examples"
```

**Phase 4: Context Accumulates**
```
As you work, context naturally accumulates:
- Previous decisions stay in memory
- Patterns you've established stay in memory
- Project state stays in memory
- No re-referencing needed for basic flow
```

### Bootstrap File Structure

**`.claude/session-context.txt`** would be like:

```
PROJECT: WebGL Graphics Library
STATUS: Phase 1 - 99.01% coverage (1,120 tests)

PENDING APPROVAL
- WebGLState (142 tests, complete)
- GLContext (55 tests, complete)
- Canvas, Renderer, Buffer (complete)

KEY PATTERNS

1. Instance methods mutate + return this:
   multiply(other): this { ... return this; }

2. Static methods create new object:
   static multiply(a, b): Matrix4 { ... }

3. Resource tracking for cleanup:
   private _buffers: Set<WebGLBuffer>

WORKFLOW

Approval:
  1. Present feature with description, file, requirements
  2. Get feedback
  3. Implement and test
  4. Report with metrics
  5. Get approval to commit

Implementation:
  - Target 95%+ line, 90%+ branch coverage
  - Follow existing patterns (see quick-ref/patterns.md)
  - Comprehensive tests before showing results
  - JSDoc with graphics concept explanations

Commit:
  - All tests pass
  - Coverage targets met
  - No console.log or debug code
  - Detailed commit message

CURRENT STATUS
- Awaiting your approval on WebGLState/GLContext for commit
- Next: Shader.ts, VertexArray.ts, geometry system...

Ready to work! What's next?
```

---

## Implementation Timeline for Your Project

### Now (Strategy 4 Hybrid Setup)

**Today (~1 hour):**
1. Create `.claude/contexts/` with reorganized content
2. Create `.claude/quick-ref/` with command references
3. Create `.claude/session-context.txt` bootstrap
4. Add `.claude/` to `.gitignore`

**Next session:**
1. Paste bootstrap into first message
2. Continue working with `@-references` when needed

### Later (If Needed)

- **Strategy 2 (Auto-load):** If you integrate Claude Code with your build system
- **Multiple Strategies:** Different teams might use different strategies simultaneously

---

## Summary Table

| What You're Doing | What to Load |
|------------------|------------|
| Starting new feature | Paste bootstrap, reference approval-workflow.md |
| Writing implementation | Bootstrap in memory + reference implementation.md as needed |
| Running tests | Bootstrap in memory, reference debugging.md if tests fail |
| Code review | Bootstrap in memory + reference patterns.md |
| Approving work | Bootstrap in memory, all context in conversation |
| Committing | Bootstrap in memory, reference git-workflow.md |

---

## Quick Start: Your Next Session

**Do this:**

1. Create `.claude/session-context.txt` ← Simple bootstrap file
2. Start new Claude Code session
3. First message: "I'm working on the WebGL project. [paste bootstrap]"
4. Continue: "Let's implement Shader.ts..."
5. When needed: "Check @.claude/contexts/approval-workflow.md"

**That's it.** The hybrid approach just works.
