# How Context Actually Works in Claude Code

**The mechanics of context loading, pasting, and session compaction**

---

## The Problem You're Asking About

> "If I paste the bootstrap file into chat at the beginning of each session, what happens when Claude compacts the session?"

This is the RIGHT question because **session compaction is how Claude manages context limits**.

---

## How Claude Code Sessions Work

### What is a Session?

A Claude Code session is a **conversation between you and Claude**. The session has:

- **Conversation history** - All messages you and Claude have sent
- **Context window** - How much history Claude can "see" (currently ~200K tokens)
- **Token budget** - Every message costs tokens (input + output)

### What is Session Compaction?

When your conversation gets **too long** (approaching token limits), Claude automatically:

1. **Summarizes old messages** - Compresses earlier messages into a summary
2. **Keeps recent messages** - Keeps the last N messages in full
3. **Preserves important info** - Summaries capture key decisions/context

**Example:**
```
Original conversation (100 messages):
Messages 1-80:   [COMPACTED into a summary]
Messages 81-100: [KEPT in full - most recent]

Claude can still see decisions from message 1-80, just summarized.
```

---

## What Happens to Your Bootstrap File?

### Scenario 1: Bootstrap File Gets Compacted ❌ (BAD)

```
Session Start:
├─ Message 1: [Paste .claude/session-context.txt bootstrap file]
├─ Message 2: "Let's implement Shader.ts"
├─ ... work for hours ...
├─ Message 150: [Compaction triggered - session too long]
│
After Compaction:
├─ Bootstrap file → Gets summarized into compaction summary
├─ Your work → Mostly kept in full (recent messages)
│
Later in same session:
├─ Message 151: Claude needs to reference the bootstrap
├─ Bootstrap info is in the compaction summary (not full detail)
├─ Some context might be lost or vague
└─ You have to re-paste or re-explain
```

**Result:** Your bootstrap context becomes fuzzy after compaction.

---

### Scenario 2: Claude.md Gets Auto-Loaded ✅ (GOOD)

**IF Claude Code supported auto-loading CLAUDE.md** (it should, but doesn't yet):

```
Session Start:
├─ Auto-load: CLAUDE.md is in context (always available)
├─ Message 1: "Let's implement Shader.ts"
├─ ... work for hours ...
├─ Message 150: [Compaction triggered]
│
After Compaction:
├─ CLAUDE.md → NEVER compacted (always in context)
├─ Your work → Compacted as needed
│
Later in same session:
├─ Message 151: Claude still has full CLAUDE.md available
├─ Can reference it anytime without re-pasting
└─ Works reliably
```

**Result:** Core context stays fresh throughout session.

---

## The Real Answer: You Need Two Levels of Context

### Level 1: ALWAYS-AVAILABLE Context (Never Compacted)

This should be **auto-loaded by Claude Code** but currently isn't:

```
CLAUDE.md ← Should be auto-loaded, always available
├─ Current status
├─ Key principles
├─ Quick links to detailed docs
└─ Never gets compacted
```

**How to approximate this TODAY:**
- Keep CLAUDE.md **in your editor/IDE sidebar**
- Reference it manually when needed
- It's always available, never compacted

### Level 2: Session-Specific Bootstrap (Gets Compacted)

This is pasted at session start:

```
.claude/session-context.txt ← Pasted at session start
├─ Core workflow reminders
├─ Current feature you're working on
├─ Key decisions for this session
└─ GETS COMPACTED after long conversations
```

---

## Real-World Example: What Actually Happens

### Session Timeline

```
TIME 0 (Session Start):
─────────────────────
Message 1 (You):
  "Let's implement Shader.ts.

   [Paste: .claude/session-context.txt - 2KB of context]

   Here's my approach..."

Message 2 (Claude):
  "Got it! I have the project context. This approach looks good because..."
  [Claude has 2KB of bootstrap context loaded]

────────────────────────────────────────────────────────────

TIME 1 (Working - Messages 3-50):
──────────────────────────────────
Message 3-50: Implementation discussion, test failures, code reviews, etc.

Bootstrap context stays relevant and fresh in Claude's memory.
Total tokens used: ~15,000 tokens


────────────────────────────────────────────────────────────

TIME 2 (Still Working - Messages 51-100):
───────────────────────────────────────────
Message 51-100: Continue implementation, finish tests, prepare for approval

Bootstrap context might be getting older but still fresh enough.
Total tokens used: ~80,000 tokens


────────────────────────────────────────────────────────────

TIME 3 (COMPACTION TRIGGERED - Message 101):
──────────────────────────────────────────────
[Session approaching token limit (~180K tokens)]

Claude automatically compacts:
  Messages 1-80 (earliest work) → Converted to summary:

  "User is implementing Shader.ts for WebGL library.
   Bootstrap included:
   - Project uses WebGLState for state management
   - Need 95%+ line coverage
   - Use existing patterns (instance methods mutate + return this)
   - WebGL error checking on all GPU operations
   - Follow column-major matrix convention

   Implementation status: Started vertex shader compilation,
   now working on program linking. Tests at 89% coverage so far."

Messages 81-100 (recent work) → Kept in FULL
  "This works for shader compilation but we need to handle linking errors..."

Total tokens after compaction: ~60,000 tokens freed


────────────────────────────────────────────────────────────

TIME 4 (After Compaction - Messages 101-150):
───────────────────────────────────────────────
Message 101+: Continue working

Claude can reference:
  ✅ Compaction summary: "You're implementing Shader.ts, need 95% coverage..."
  ✅ Full messages 81-100: Complete context about recent work
  ❌ Full messages 1-80: Lost, only summary available

If you need detailed bootstrap info:
  Problem: "Wait, what's the exact pattern for instance methods?"
  Solution: Claude might not have it in full detail anymore
  Fix: You'd have to re-explain or re-reference
```

---

## The Three Scenarios

### Scenario A: Just Bootstrap (Manual Pasting)

```
❌ Session Start:
  └─ Paste bootstrap file once
  └─ Gets compacted later
  └─ Context degrades as session goes on

⚠️  Problem:
  After compaction, you might need to re-paste
  or remind Claude of details from the bootstrap
```

### Scenario B: CLAUDE.md Only (Current State)

```
⚠️  Session Start:
  └─ CLAUDE.md is in this conversation (I'm reading it)
  └─ Gets compacted later
  └─ Context degrades as session goes on

⚠️  Problem:
  Same as Scenario A - no auto-load means it's not always available
```

### Scenario C: Auto-Loaded CLAUDE.md (Ideal - Not Yet Possible)

```
✅ Session Start:
  └─ Claude Code auto-loads CLAUDE.md
  └─ Never gets compacted (special treatment)
  └─ Always available throughout session

✅ Benefit:
  Can reference anytime: "What's our coverage target?"
  Claude: "95%+ line coverage, 90%+ branch" (from auto-loaded CLAUDE.md)
```

---

## How to Work WITH Compaction (Not Against It)

### Strategy: Use Supplementary Docs

Instead of pasting everything:

1. **CLAUDE.md stays in the chat** (reference it)
2. **Specific docs stay organized** in `.claude/contexts/`
3. **Reference them as needed** during session

### Example Session Using This Strategy

```
Session Start:
├─ I read CLAUDE.md from the conversation
├─ You: "Let's implement Shader.ts"
├─ I know the approval workflow (from CLAUDE.md in chat)

Working (Messages 3-50):
├─ You: "Here's my approach..."
├─ Me: "Checking against our approval process from CLAUDE.md above..."
├─ Context is fresh, no problem

Mid-Session (Messages 50-100):
├─ You: "Test coverage is at 87%, need to hit 95%"
├─ Me: "Our target from CLAUDE.md is 95%+ line / 90%+ branch"
├─ Context still fresh

Long Session (Messages 100-150):
├─ COMPACTION HAPPENS
├─ CLAUDE.md gets compacted too (it's just messages in chat)
│
After Compaction:
├─ You: "What's the coverage target again?"
├─ Me: "From earlier in this conversation, 95%+ line / 90%+ branch"
├─ (Might be in summary, might need reminding)
│
├─ You: "Check CLAUDE.md for the exact pattern for methods"
├─ Me: "Looking at CLAUDE.md in the earlier messages..."
├─ (References the earlier full content if still visible)

Very Long Session (Messages 200+):
├─ Another COMPACTION
├─ Even more context summarized
│
├─ You: "I forgot - should I use @-references for context?"
├─ Me: "Let me look at... actually, that's a good question"
├─ (CLAUDE.md might be too compacted now)
│
├─ Solution: You could say:
│  "Here's the relevant part of CLAUDE.md..."
│  [Paste specific section]
└─ Context refreshed
```

---

## The Real Solution: What SHOULD Happen

**Claude Code should support auto-loading a main context file:**

```yaml
# .claude/config.yaml (hypothetical)
auto_load:
  always: ["CLAUDE.md"]           # Always available, never compacted
  session: ["session-context.txt"] # Auto-loaded per session
  manual: ["contexts/"]            # Available via @-references
```

**Then:**
```
Session Start:
├─ CLAUDE.md auto-loaded (always available)
├─ session-context.txt auto-loaded
├─ .claude/contexts/* available via @-references

Working:
├─ Reference CLAUDE.md anytime (always fresh)
├─ Reference specific docs as needed (@.claude/contexts/approval-workflow.md)
├─ Session gets compacted, but key docs stay fresh

Long Session:
├─ CLAUDE.md still available (never compacted)
├─ Can reference anytime without re-pasting
└─ Perfect!
```

---

## What You Should Do TODAY (Without Auto-Load)

### Option 1: Keep Everything in Chat (Simple)

**Just reference CLAUDE.md that's already in this conversation:**

```
You: "Let's implement Shader.ts"
Me: "I have CLAUDE.md in our conversation history"
Me: "Following our patterns from there, here's the approach..."

[Session works fine while messages are recent]
[After compaction, might need to reference again]
```

### Option 2: Create Lean CLAUDE.md (Recommended)

**Simplify CLAUDE.md to just the essentials:**

```markdown
# CLAUDE.md (100 lines, not 450)

## Status
[Current table only]

## Quick Principles
1. WebGLState for state
2. 95%+ line / 90%+ branch coverage
3. Column-major matrices
4. One feature at a time

## Core Workflow
1. Present approach
2. Get feedback
3. Implement
4. Report results
5. Commit when approved

## Key Files
- HANDOFF.md - Full context
- PLAN.md - Roadmap
- .claude/contexts/ - Detailed guides
```

**Then in session:**
```
Session Start:
├─ I read lean CLAUDE.md (quick reference)
├─ You: "Let's implement Shader.ts"
├─ Me: "Following our core principles and workflow..."

During Work:
├─ You: "Check .claude/contexts/implementation.md"
├─ Me: [References specific doc for details]

After Compaction:
├─ CLAUDE.md is still compact enough to reference
├─ Specific docs can be re-referenced if needed
```

### Option 3: Structured Bootstrap (Best for Long Sessions)

**Create `.claude/session-bootstrap.md`:**

```markdown
# Session Bootstrap

Paste this at start of each session.

## Project Status
- WebGL Graphics Library
- Phase 1: 99.01% coverage (1,120 tests)
- Pending: WebGLState, GLContext approval

## This Session's Focus
[You fill this in before starting]

## Workflow Reminder
1. Present approach
2. Get feedback
3. Implement
4. Report results
5. Commit if approved

## Code Patterns

Instance (mutate + chain):
\`\`\`typescript
method(): this { return this; }
\`\`\`

Static (no mutation):
\`\`\`typescript
static method(): Type { return new Type(); }
\`\`\`

## Coverage Target
95%+ line / 90%+ branch

## Detailed Docs
For more: See .claude/contexts/
```

**Then each session:**
```
Message 1: [Paste .claude/session-bootstrap.md]
Message 2: "Let's work on [feature]"

[Bootstrap is in recent messages, stays fresh]
[After compaction, bootstrap info is in summary]
[Can re-reference or re-paste if needed]
```

---

## Summary: What Actually Happens

| Action | What It Means | When It Works | When It Breaks |
|--------|--------------|---------------|----------------|
| **Reference CLAUDE.md in chat** | I look at earlier messages | Within ~100 messages | After compaction, context gets fuzzy |
| **Paste bootstrap file** | Add context to early messages | Throughout session | Gets compacted, might need re-pasting |
| **Reference @.claude/contexts/** | I load specific file from disk | Anytime you ask | Requires you to remember to reference |
| **Auto-load (not available yet)** | Claude Code loads automatically | Perfect throughout session | Doesn't exist yet |

---

## Recommendation for Your Project

### Best Approach TODAY:

**Use a combination:**

1. **Keep lean CLAUDE.md** - I reference it during session
2. **Create .claude/contexts/** - For specific detailed guidance
3. **Keep it simple** - Don't over-engineer until auto-load exists
4. **Reference docs as needed** - "Check @.claude/contexts/implementation.md"

### When Session Gets Long:

**If you're worried about context degradation:**

1. **Option A:** Start new session with fresh bootstrap
2. **Option B:** Re-paste key info if needed mid-session
3. **Option C:** Summarize and restart: "Here's what we've done..."

### When Auto-Load Exists:

**Claude Code will eventually support:**
```
# Auto-load CLAUDE.md always
# Auto-load session-context.txt per session
# Reference .claude/contexts/* with @-references
```

Then this all becomes automatic and perfect.

---

## Bottom Line

**Your question was exactly right:**

> "What happens when we compact the session?"

**The answer:**
- Pasted content DOES get compacted
- That's why auto-loading (currently unavailable) is better
- For now: Keep CLAUDE.md lean, reference specific docs as needed
- Don't paste massive bootstrap files unless necessary
- Re-reference specific docs if context gets fuzzy

**In practice:**
- You don't need to worry about this for normal sessions
- Just reference CLAUDE.md that's in our conversation
- Reference specific `.claude/contexts/` files when you need detailed guidance
- If session gets REALLY long, start fresh with new bootstrap

---

## TL;DR

**Don't overthink it. Just:**

1. **Keep CLAUDE.md in the conversation** (I can see it)
2. **Organize `.claude/contexts/`** for later reference
3. **Reference specific docs as needed** ("Check @.claude/contexts/implementation.md")
4. **If context feels fuzzy after many messages**, re-reference CLAUDE.md or the specific doc

That's it. This works with Claude Code today without any special setup.
