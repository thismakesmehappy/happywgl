# Documentation Index

**Last Updated:** January 30, 2026

This directory contains supporting documentation, archived documents, and decision logs for the WebGL Graphics Library project.

---

## Quick Navigation

For **active development**, start here:

- **[ARCHITECTURE.md](../ARCHITECTURE.md)** ← Architecture decisions and layer structure
- **[TODO.md](../TODO.md)** ← Current tasks and cumulative status
- **[PLAN.md](../PLAN.md)** ← Complete 10-phase roadmap
- **[CLAUDE.md](../CLAUDE.md)** ← Development workflow and current status

---

## Documentation Structure

### Root Level (Source of Truth)

These are your primary documents while developing:

- `README.md` - Project overview and getting started
- `ARCHITECTURE.md` - Approved architecture, design principles, layers
- `PLAN.md` - 10-phase development roadmap with detailed deliverables
- `TODO.md` - Cumulative task list tracking all phases
- `CLAUDE.md` - Development workflow, testing strategy, code patterns
- `SETUP.md` - Development environment setup (⚠️ development-only)
- `DOCUMENTATION_ARCHITECTURE.md` - Meta-document: How docs are organized

### Supporting Materials (`_SUPPORTING/`)

These are learning materials, research, and detailed reference documents:

- `ARCHITECTURE_APPROVED_2026_01_29.md` - Complete approved architecture analysis
- `ARCHITECTURE_RESOURCE_LAYER_DESIGN.md` - Detailed resource layer design
- `PHASE1_ARCHITECTURE_DECISIONS.md` - Phase 1 specific architecture decisions
- `WEBGLSTATE_DETAILED.md` - Comprehensive WebGLState design and capabilities
- `CONTEXT_LOADING_STRATEGIES.md` - Research on WebGL context loading approaches
- `CONTEXT_MECHANICS_EXPLAINED.md` - Deep dive into context mechanics
- `CONTEXT_OPTIMIZATIONS.md` - Optimization strategies for WebGL context

**These are learning/reference materials, not source of truth.**

### Archived Documents (`_ARCHIVE/`)

These documents are completed or superseded by newer versions:

- `HANDOFF.md` - Previous comprehensive handoff (superseded by ARCHITECTURE.md + TODO.md)
- `HANDOFF_PROMPT.md` - Old template (archived for reference)
- `IMPLEMENTATION_REVIEW.md` - Completed review (historical record)

**These documents are preserved for historical context but should not be updated.**

### Decision Logs (`_LOGS/`)

These documents track decisions and maintenance processes:

- `DECISIONS_LOG.md` - Record of architectural and strategic decisions with dates
- `DOCUMENTATION_MAINTENANCE.md` - Procedures for keeping docs in sync
- `DOCUMENTATION_CLEANUP_2026_01_30.md` - This cleanup session's actions and results

---

## How Documentation is Organized

### Philosophy

1. **Content drives structure** - Files are organized by purpose, not alphabetically
2. **Single sources of truth** - One document per concern
3. **Clear hierarchy** - Root level has active docs, /docs/ has supporting materials
4. **Learning artifacts labeled** - Supporting docs clearly marked as reference
5. **Consistency checks** - Manual processes to verify docs stay in sync

### Update Sequence (When Making Architecture Decisions)

1. Update `ARCHITECTURE.md` first
2. Update `PLAN.md` to reference new architecture
3. Update `TODO.md` with new components/tasks
4. Update `CLAUDE.md` status table if needed
5. Add entry to `docs/_LOGS/DECISIONS_LOG.md`

### Consistency Maintenance

These documents should stay in sync:

- `ARCHITECTURE.md` and `PLAN.md` - Both reference Phase 1 layer structure
- `TODO.md` and `PLAN.md` - TODO lists what PLAN describes
- `CLAUDE.md` status table - Reflects what TODO tracks

---

## For Different Needs

### "I want to understand the architecture"
→ Start with `ARCHITECTURE.md`, then read `PLAN.md` Phase 1 section

### "I want to know what to work on next"
→ See `TODO.md` - Critical Path section at the bottom

### "I want to understand the development workflow"
→ Read `CLAUDE.md` - Development Workflow section

### "I want detailed design rationale"
→ Read documents in `docs/_SUPPORTING/`

### "I want to see the complete 10-phase roadmap"
→ Read `PLAN.md` - Development Roadmap section

### "I want to know what was previously decided"
→ Check `docs/_LOGS/DECISIONS_LOG.md`

---

## Document Status Legend

- ✅ **Complete** - Finalized and checked into main branch
- 🚧 **In Progress** - Currently being worked on
- ⏳ **Blocked** - Waiting on other work before proceeding
- 🔍 **Pending Approval** - Ready for review
- 📋 **Planning** - Specification complete, not yet implemented

---

## Key Principles for Documentation

1. **Cumulative, not per-phase** - TODO.md evolves across all 10 phases
2. **Retroactive updates allowed** - Can update earlier phases as we learn
3. **No duplication** - If something's in TODO.md, it's not repeated in PLAN.md
4. **Clear ownership** - Each document has a specific purpose
5. **Linked, not copied** - Documents reference each other, not repeat information
6. **Temporary marked** - Development-only docs (SETUP.md) are clearly marked

---

## Questions?

- **Quick facts** → Check `TODO.md` status
- **How to do something** → See `CLAUDE.md` sections
- **Why we made a choice** → Read `ARCHITECTURE.md` or check `docs/_LOGS/DECISIONS_LOG.md`
- **Deep understanding** → Read the supporting materials in `docs/_SUPPORTING/`
- **Historical context** → Check `docs/_ARCHIVE/`

---

**Last Reorganized:** January 30, 2026
**Responsibility:** Keep this index updated when documentation structure changes
