# Documentation Maintenance Guide

**Purpose:** Procedures for keeping documentation in sync and preventing inconsistencies

---

## Consistency Checks (Manual Process)

Before each major milestone, verify these consistency points:

### 1. Architecture Alignment
- [ ] Does `ARCHITECTURE.md` describe all Layer 2 resources?
- [ ] Does `PLAN.md` Phase 1 section match `ARCHITECTURE.md` layer structure?
- [ ] Do program vs shader distinctions in both documents match?

### 2. Task Coverage
- [ ] Does `TODO.md` list all components in `PLAN.md` Phase 1?
- [ ] Are blocking dependencies in `TODO.md` accurate?
- [ ] Is the status (✅ / 🚧 / ⏳ / [ ]) consistent with reality?

### 3. Navigation Accuracy
- [ ] Do Quick Navigation links in `CLAUDE.md` point to correct documents?
- [ ] Do cross-references between documents work (e.g., "See ARCHITECTURE.md")?
- [ ] Does `docs/_README.md` index match actual file locations?

### 4. Status Table Updates
- [ ] Is `CLAUDE.md` implementation status table up to date?
- [ ] Do test counts and coverage percentages match reality?
- [ ] Is the phase status (✅ / 🔍 / 🚧 / ⏭️) accurate?

---

## Update Sequence (When Making Architecture Decisions)

**Critical:** Follow this order to maintain consistency:

1. **Update `ARCHITECTURE.md`** first
   - Add the decision with rationale
   - Add entry to design principles or strategic decisions section
   - Include code examples if applicable

2. **Update `PLAN.md`** to reference new architecture
   - Add explanation to Phase 1 Architecture section
   - Reference `ARCHITECTURE.md` for details
   - Update phase deliverables if affected

3. **Update `TODO.md`** with new components/tasks
   - Add new checklist items
   - Update blocking dependencies
   - Mark items as blocked/pending as appropriate

4. **Update `CLAUDE.md`** status if needed
   - Update "Current Implementation Status" table
   - Update "Next Up" section if priorities changed
   - Update coverage numbers if new code added

5. **Add to `docs/_LOGS/DECISIONS_LOG.md`**
   - Record the decision with date
   - Explain rationale briefly
   - Note any rejected alternatives
   - Link to affected documents

---

## Documentation Sources of Truth

These documents are authoritative for their domains:

| Document | Covers | Updated By |
| --- | --- | --- |
| `ARCHITECTURE.md` | Design decisions, layer structure, principles | When architecture approved |
| `PLAN.md` | 10-phase roadmap, phase deliverables | When planning phases |
| `TODO.md` | Current tasks, status, blocking dependencies | When work progresses |
| `CLAUDE.md` | Development workflow, code patterns, status | When implementation complete |
| `docs/_LOGS/DECISIONS_LOG.md` | Decision records with rationale | After major decisions |

### Not Sources of Truth (Reference Only)

- `HANDOFF.md` - Historical; superseded by ARCHITECTURE.md + TODO.md
- `docs/_SUPPORTING/*.md` - Learning materials, not authoritative
- `docs/_ARCHIVE/` - Completed work, archived for reference

---

## Document Relationships

### Architecture → Plan → Todo

```
ARCHITECTURE.md (What we decided)
    ↓
PLAN.md (How we'll build it across phases)
    ↓
TODO.md (What we're working on now)
```

**Example Flow:**
1. ARCHITECTURE.md: "Layer 2 includes Program, VertexArray, Texture, Buffer"
2. PLAN.md: "Phase 1 will implement Program, VertexArray, Texture (plus Buffer already done)"
3. TODO.md: "Layer 2: Buffer ✅, Program ⏳, VertexArray [ ], Texture [ ]"

### Cross-References

When documents reference each other:
- Use markdown links: `[ARCHITECTURE.md](../ARCHITECTURE.md)`
- Keep links at appropriate detail level (not just filenames)
- Don't duplicate information; reference instead
- Verify links work when updating file locations

### Consistency Check Query Examples

- **"Does TODO mention all Layer 2 resources?"**
  Compare: ARCHITECTURE.md → PLAN.md → TODO.md layers section

- **"Are design decisions documented?"**
  Check: ARCHITECTURE.md Strategic Design Decisions section

- **"What was decided and when?"**
  Check: docs/_LOGS/DECISIONS_LOG.md

- **"What should I work on next?"**
  Check: TODO.md Critical Path section

- **"Why did we make this choice?"**
  Check: ARCHITECTURE.md + docs/_LOGS/DECISIONS_LOG.md

---

## File Organization Rules

### Root Level (Source of Truth)
- **Keep:** README.md, ARCHITECTURE.md, PLAN.md, TODO.md, CLAUDE.md, SETUP.md
- **Size:** Should be readable (< 500 lines each ideally)
- **Purpose:** Active development guidance
- **Update:** Frequently, as work progresses

### `/docs/_SUPPORTING/` (Learning Materials)
- **Keep:** Detailed design analysis, research documents, reference materials
- **Size:** Can be longer (learning materials are thorough)
- **Purpose:** Deep understanding and historical record
- **Update:** Rarely; snapshots in time
- **Label:** Each file named with date: `ARCHITECTURE_APPROVED_2026_01_29.md`

### `/docs/_ARCHIVE/` (Historical)
- **Keep:** Superseded documents, completed reviews, old templates
- **Size:** Original size (preserved as-is)
- **Purpose:** Historical context and reference
- **Update:** Never; locked in time
- **Label:** In header: "This document is archived..."

### `/docs/_LOGS/` (Decisions & Processes)
- **Keep:** DECISIONS_LOG.md, DOCUMENTATION_MAINTENANCE.md, session cleanup records
- **Size:** Growing over time
- **Purpose:** Track decisions and processes
- **Update:** After major milestones
- **Format:** Dated entries with clear decisions

---

## Preventing Inconsistencies

### During Development

1. **Before committing code:** Check if architecture changed
   - If yes: Update ARCHITECTURE.md first, then TODO.md
   - If no: Just update TODO.md status

2. **After completing feature:** Update CLAUDE.md status table
   - Update test count and coverage %
   - Update feature status (✅ Complete)
   - Note any insights in DECISIONS_LOG.md

3. **When approving changes:** Verify documentation is consistent
   - Architecture decisions → documented in ARCHITECTURE.md?
   - New tasks → added to TODO.md?
   - New design → referenced in PLAN.md?

### Periodic Checks (Each Major Phase)

- Run consistency verification (see Consistency Checks above)
- Update `docs/_README.md` index if structure changed
- Add entry to `docs/_LOGS/DECISIONS_LOG.md` if important decision made
- Verify all cross-references still work
- Check that nothing is duplicated across documents

### Never Duplicate

If information exists in one document, reference it, don't copy:

```markdown
# ❌ BAD - Duplicated in two places
ARCHITECTURE.md: Layer 2 includes Program, VertexArray, Texture, Buffer
PLAN.md: Layer 2 includes Program, VertexArray, Texture, Buffer

# ✅ GOOD - Single source, referenced from other
ARCHITECTURE.md: Layer 2 includes Program, VertexArray, Texture, Buffer
PLAN.md: See ARCHITECTURE.md for Layer 2 resources
```

---

## Quick Reference: When to Update What

| Event | Update This | Reason |
| --- | --- | --- |
| Architecture decision made | ARCHITECTURE.md | Record the decision |
| New design finalized | Add to ARCHITECTURE.md | Architecture is source of truth |
| Feature completed | CLAUDE.md status table | Reflect current state |
| Work started/finished | TODO.md | Track progress |
| Major decision made | docs/_LOGS/DECISIONS_LOG.md | Record rationale |
| Phase planned | PLAN.md | Update roadmap |
| File moved | docs/_README.md | Keep index current |
| Something questioned | docs/_LOGS/DECISIONS_LOG.md | Document why |

---

## Common Mistakes to Avoid

1. ❌ **Updating PLAN.md without updating TODO.md**
   - If PLAN.md phase changes, TODO.md should reflect new tasks

2. ❌ **Approving code that changes architecture without ARCHITECTURE.md update**
   - Always update ARCHITECTURE.md first

3. ❌ **Writing architecture decisions only in CLAUDE.md**
   - ARCHITECTURE.md is the official record for design decisions

4. ❌ **Duplicating information across documents**
   - One source per concern; reference instead of duplicate

5. ❌ **Updating CLAUDE.md without updating DECISIONS_LOG.md**
   - Keep decision record for future reference

6. ❌ **Changing TODO.md without referencing PLAN.md/ARCHITECTURE.md**
   - TODO should reflect what PLAN describes

---

## Document Lifecycle

### Planned (PLAN.md)
Document describes what we want to build across 10 phases

### Designed (ARCHITECTURE.md)
Design decisions finalized, architecture approved

### Tracked (TODO.md)
Tasks broken down, dependencies identified, tracking progress

### In Progress (CLAUDE.md status)
Code being written, tests being added, features implemented

### Complete (✅ marked in TODO.md)
Feature finished, tests passing, coverage met, code reviewed

### Archived (docs/_ARCHIVE/)
After project complete or feature superseded, move to archive

---

**Last Updated:** January 30, 2026
**Review Frequency:** Each major phase completion
**Responsible:** Development team + AI assistant
