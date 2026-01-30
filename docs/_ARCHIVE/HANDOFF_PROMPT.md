# Handoff Prompt Template

Copy and paste this prompt when starting a new session with Claude:

---

## Initial Handoff Prompt

```
I'm handing off this WebGL graphics library project to you. This is a TypeScript WebGL library similar to three.js, built from scratch for educational purposes.

**Please start by:**

1. Reading `HANDOFF.md` thoroughly - it contains comprehensive project context, architecture, patterns, and current status
2. Reviewing `PLAN.md` for the complete development roadmap
3. Examining the existing codebase, starting with:
   - `src/math/Matrix4.ts` (example of complete implementation)
   - `src/math/Quaternion.ts` (example of complex math primitive)
   - `tests/math/Matrix4.test.ts` (example of comprehensive test suite)

**Current Status:**
- ✅ Math primitives are complete (Vectors, Matrices, Quaternions) - 99%+ test coverage
- 🚧 Next: Implement Phase 1 Core MVP (rendering infrastructure)

**Key Patterns to Follow:**
- Column-major matrices (WebGL convention)
- Float32Array for all math primitives
- Instance methods (mutating) + Static methods (non-mutating)
- Method chaining support
- Maintain 95%+ line coverage, 90%+ branch coverage

**Key Files:**
- `HANDOFF.md` - Comprehensive handoff documentation
- `PLAN.md` - Complete development roadmap
- `TODO.md` - Quick-reference TODO list
- `README.md` - Project overview

Please confirm you've read the documentation and ask any clarifying questions before we proceed with implementation.
```

---

## Verification Questions

After Claude reads the docs, ask:

```
Before we start coding, please confirm your understanding:

1. Do you understand the column-major matrix storage convention and why it's used?
2. Are you familiar with the instance vs static method pattern used throughout?
3. Do you understand the test coverage goals (95%+ lines, 90%+ branches)?
4. Have you reviewed the existing code patterns in Matrix4.ts and Quaternion.ts?
5. What questions do you have about the architecture or next steps?

Once confirmed, we'll start with the first task from Phase 1.
```

---

## Task Assignment Template

```
Let's implement [TASK_NAME] from Phase 1.

**Task:** [Brief description]
**File:** `src/[path]/[File].ts`
**Requirements:**
- [Requirement 1]
- [Requirement 2]
- [Requirement 3]

**Reference:**
- See HANDOFF.md section "[Section Name]" for patterns
- Follow the code style from `src/math/Matrix4.ts`
- See `PLAN.md` Phase 1 for API requirements

**Testing:**
- Create comprehensive tests following `tests/math/Matrix4.test.ts` pattern
- Ensure 95%+ line coverage, 90%+ branch coverage
- Test edge cases (NaN, Infinity, errors, etc.)

Please:
1. Review similar implementations in other libraries if needed
2. Follow existing code patterns and conventions
3. Write comprehensive tests
4. Ensure TypeScript strict mode compliance

Let me know if you have questions before implementing.
```

---

## Code Review Template

```
Please verify your implementation against this checklist:

- [ ] Follows existing code patterns (see Matrix4.ts for reference)
- [ ] Has comprehensive tests (95%+ line coverage, 90%+ branch coverage)
- [ ] TypeScript compiles without errors (strict mode)
- [ ] Matches the API design from PLAN.md
- [ ] Includes JSDoc comments explaining graphics concepts
- [ ] Handles edge cases (NaN, Infinity, zero, errors)
- [ ] Proper resource cleanup/disposal (if applicable)
- [ ] Error messages are descriptive and helpful

Run: `npm test -- --coverage` to verify coverage goals.
```

---

## Progress Update Template

```
Let's update our progress:

**Phase 1 Core MVP:**
✅ Math primitives (complete)
✅ [Completed task 1]
🚧 [Current task] (in progress)
⏭️ [Next task]

**Coverage Status:**
- Line coverage: [X]% (target: 95%+)
- Branch coverage: [X]% (target: 90%+)

See TODO.md for the full checklist. Should we continue with [next task]?
```

---

## Context Refresh Template

```
Let's pause and refresh context. Current state:

**Completed:**
- Math primitives (all tests passing, 99%+ coverage)
- [Other completed items]

**In Progress:**
- [Current task]

**Next:**
- [Next task]

**Key Decisions to Remember:**
- Column-major matrices (WebGL convention)
- Float32Array for performance
- Instance + static method pattern
- Method chaining support

Please review HANDOFF.md "Key Decisions & Rationale" if needed before continuing.
```

---

## Problem-Solving Template

```
We're encountering [specific issue/error].

According to HANDOFF.md "Common Issues & Solutions", this might be related to:
- [Relevant section from HANDOFF.md]

Let's debug step by step:
1. Check if this matches a known issue pattern
2. Review the existing code for similar patterns
3. Test the hypothesis with a minimal example
4. Implement the fix following existing conventions

[Additional context or error messages]
```

---

## Quality Gate Template

```
Before we move to the next task, let's verify quality:

**Verification Steps:**
1. ✅ Run tests: `npm test -- --coverage`
2. ✅ Check coverage meets goals (95%+ lines, 90%+ branches)
3. ✅ Review code follows patterns from HANDOFF.md
4. ✅ Ensure no TypeScript errors (`npm run build`)
5. ✅ Verify API matches PLAN.md specification
6. ✅ Check for proper error handling and edge cases

**Results:**
- Tests: [Pass/Fail]
- Coverage: [X]% lines, [X]% branches
- TypeScript: [No errors / List errors]
- API: [Matches spec / Needs adjustment]

Once all checks pass, we can proceed to [next task].
```

---

## Tips for Effective Handoff

1. **Start Fresh Sessions:** If conversation gets too long, start a new session with the initial handoff prompt
2. **Reference Specific Sections:** Always reference specific sections in HANDOFF.md or PLAN.md
3. **Small Increments:** Break work into small, focused tasks
4. **Verify Understanding:** Ask Claude to explain their approach before implementing
5. **Iterate:** Review and provide feedback before moving to next task
6. **Use Examples:** Point to existing code (Matrix4.ts, Quaternion.ts) as examples
7. **Check Coverage:** Always verify test coverage goals are met
8. **Document Decisions:** If Claude makes design decisions, document them in HANDOFF.md

---

## Quick Reference Commands

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- Matrix4.test.ts

# Build project
npm run build

# Check TypeScript errors
npx tsc --noEmit
```
