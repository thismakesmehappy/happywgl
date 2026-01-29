# Claude Development Session Guide

**Project:** WebGL Graphics Library - Educational 3D Rendering Framework
**Last Updated:** January 2026
**Current Phase:** Phase 1 - Core MVP Implementation

---

## Quick Navigation

- **HANDOFF.md** - Complete project context, architecture, patterns, and current status
- **PLAN.md** - Full 10-phase development roadmap with rationale
- **TODO.md** - Quick reference checklist for Phase 1
- **SETUP.md** - Initial project setup and configuration
- **.claude/RESOURCE_ARCHITECTURE.md** - How Buffer, Shader, VertexArray, Texture, Geometry, and Material work together

---

## Current Implementation Status

### ✅ Phase 0 - Math Foundation (Complete)

| Feature | File | Coverage | Tests | Status |
| --- | --- | --- | --- | --- |
| Vector (base) | `src/math/Vector.ts` | 99.05% lines / 96.66% branch | 72 | ✅ Complete |
| Vector2 | `src/math/Vector2.ts` | 100% lines / 100% branch | 32 | ✅ Complete |
| Vector3 | `src/math/Vector3.ts` | 100% lines / 100% branch | 34 | ✅ Complete |
| Vector4 | `src/math/Vector4.ts` | 100% lines / 100% branch | 30 | ✅ Complete |
| Matrix (base) | `src/math/Matrix.ts` | 97.31% lines / 91.42% branch | 116 | ✅ Complete |
| SquareMatrix | `src/math/SquareMatrix.ts` | 100% lines / 100% branch | 46 | ✅ Complete |
| Matrix2 | `src/math/Matrix2.ts` | 97.29% lines / 88.88% branch | 69 | ✅ Complete |
| Matrix3 | `src/math/Matrix3.ts` | 99.21% lines / 94.44% branch | 88 | ✅ Complete |
| Matrix4 | `src/math/Matrix4.ts` | 99.45% lines / 94.44% branch | 99 | ✅ Complete |
| Quaternion | `src/math/Quaternion.ts` | 100% lines / 96.51% branch | 232 | ✅ Complete |

### 🚧 Phase 1 - Core Rendering (In Progress - Awaiting Review)

| Feature | File | Coverage | Tests | Status |
| --- | --- | --- | --- | --- |
| WebGLState | `src/core/WebGLState.ts` | 97.4% lines / 93.1% branch | 93 | 🔍 Implemented, Pending Approval |
| WebGLState Constants | `src/core/WebGLState.constants.ts` | 100% lines / 100% branch | 49 | 🔍 Implemented, Pending Approval |
| GLContext | `src/core/GLContext.ts` | 97.32% lines / 90.62% branch | 55 | 🔍 Implemented, Pending Approval |
| Canvas | `src/core/Canvas.ts` | 100% lines / 96.15% branch | 40 | 🔍 Implemented, Pending Approval |
| Renderer | `src/core/Renderer.ts` | 100% lines / 100% branch | 30 | 🔍 Implemented, Pending Approval |
| Buffer | `src/resources/Buffer.ts` | 98.38% lines / 93.93% branch | 35 | 🔍 Implemented, Pending Approval |

**Overall Project:**
- Total Tests: 1,120 passing (16 test files)
- Project Coverage: 99.01% lines / 94.59% branch
- Target Coverage: 95%+ lines / 90%+ branch ✓ **Exceeded**

> **⚠️ Note:** Core rendering features (including WebGLState) have been implemented but are awaiting your review and approval. Please review the implementations and either approve them for commit or request changes.

### 🚧 Next Up (Phase 1 Remaining - APPROVED)

> **✅ Architecture Approved:** Program (Layer 2) + Shader (Layer 2.5) + Reserved Utilities. See `.claude/PHASE1_RESOURCE_ARCHITECTURE_DECISIONS.md` for detailed analysis.

**Phase 1 Remaining Implementation (in order):**

**Layer 2: GPU Resources**
1. **Program.ts** - Wraps WebGLProgram compilation, manages locations, static binding tracking
2. **VertexArray.ts** - Wraps VAO, manages attribute layout, static binding tracking
3. **Texture.ts** - Wraps WebGLTexture, manages image data, static binding tracking

**Layer 2.5: Shader Wrapper (Reserved for Phase 4+ Utilities)**
4. **Shader.ts** - Wraps Program, provides user-facing API, reserves space for: load(), write(), validate(), cache

**Layer 3: High-Level Concepts**
5. **Geometry.ts** - Creates Buffer + VertexArray internally, configures vertex layout
6. **Material.ts** - Uses Shader, manages uniforms, orchestrates render state
7. **BasicMaterial.ts** - Extends Material, creates Shader internally, provides color management

**Layer 4: Scene Graph & Rendering**
8. **Object3D.ts** - Transform management, hierarchy support (position, rotation, scale)
9. **Scene.ts** - Container for objects, simple tree structure
10. **Mesh.ts** - Object3D + Geometry + Material, orchestrates rendering
11. **WebGLRenderer.ts** - Renders Scene, iterates objects, handles viewport

**Finalization**
12. Image export & demo

---

## Development Workflow

### ⚠️ Important Principles

**One Feature At A Time**
- I will only work on ONE feature between approval cycles
- Each feature gets its own branch: `feature/[feature-name]`
- I will NOT move to the next feature until you approve the current one
- This ensures clear communication and easy review/rollback if needed

**Branch Strategy**
- All work happens on feature branches (never directly on `main`)
- Branch naming: `feature/[feature-name]` (e.g., `feature/shader-ts`)
- Only merge to `main` after your approval
- Each feature is one focused commit or logically grouped commits

**Testing Before Approval**
- ALL tests must pass locally before requesting review
- Coverage targets (95%+ lines, 90%+ branches) must be met
- No incomplete or "work in progress" code sent for review

**⚠️ Column-Major Matrix Storage**
- **ALL matrices use COLUMN-MAJOR order (WebGL/GLSL convention)**
- This is NOT the intuitive row-major order - it's critical for GPU compatibility
- Data layout: `[col0_row0, col0_row1, col0_row2, col0_row3, col1_row0, ...]`
- Reference existing Matrix4.ts implementation for the pattern
- ALL new matrix-related code must follow this convention

### Status Legend

- ✅ **Complete** - Implemented, reviewed, approved, and committed to `main`
- 🔍 **Pending Approval** - Implemented on feature branch with tests, awaiting your review
- 🚧 **In Progress** - Currently being implemented on feature branch
- ⏭️ **Not Started** - Scheduled for implementation

### How to Approve/Request Changes

When you see features marked as "🔍 Pending Approval", you can:

1. **Approve for commit to main:**
```
   Looks good, commit this.
```
   I will then: merge feature branch → main, create commit, update CLAUDE.md

2. **Request changes:**
```
   Please modify [feature] to [change]. Here's why: [reason].
```
   I will: make changes on same branch, push, and request re-review

3. **Ask questions:**
```
   Can you explain [aspect]? I'm concerned about [specific thing].
```
   I will: explain or show relevant code sections before continuing

4. **Reject and redo:**
```
   Let's redo this. Here's the issue: [explanation].
```
   I will: delete branch, start fresh with new approach after discussion

Once approved, I'll merge to `main` with a detailed commit message and update CLAUDE.md to mark it as ✅ Complete.

### How to Request Features

When starting work on a new feature, follow this process:

#### 1. **Initiate the Feature**
Use the format:
```
Let's implement [FEATURE_NAME].

**Feature:** [Brief description]
**File:** `src/[path]/[File].ts`
**Key Requirements:**
- [Requirement 1]
- [Requirement 2]
- [Requirement 3]

Before I start, please review the approach and let me know if you have any feedback or changes needed.
```

#### 2. **Review & Approval**
You review the approach and either:
- ✅ Approve: "Looks good, proceed"
- 💭 Request changes: Describe modifications
- ❓ Ask questions: I clarify before proceeding

#### 3. **Implementation**
Once approved, I will:
- Implement the feature following existing patterns
- Write comprehensive tests (aiming for 95%+ line coverage, 90%+ branch coverage)
- Verify all tests pass
- Show you the results

#### 4. **Completion & Review**
When feature is complete, I'll report:
```
**[FEATURE_NAME] Complete ✅**

**Implementation:**
- [Key classes/methods]
- [Important design decisions]
- [Coverage metrics]

**Tests:**
- X tests covering [key scenarios]
- Y% line coverage / Z% branch coverage

**Project Status:**
- Total tests: N passing
- Project coverage: X% lines / Y% branch

Ready for review and feedback before proceeding to [NEXT_FEATURE].
```

#### 5. **Your Review**
You can:
- ✅ Approve for commit: "Looks good, commit this"
- 💬 Request changes: "Please modify..."
- 🚫 Reject: "Let's redo this, here's why..."
- 💭 Ask questions: "Can you explain..."

#### 6. **Commit**
Once approved, I will commit with a detailed commit message.

---

## Code Quality Standards

### Coverage Requirements
- **Line Coverage:** 95%+ (target) - Currently 99.11%
- **Branch Coverage:** 90%+ (target) - Currently 94.78%
- **Function Coverage:** 100% (target) - Currently 100%

### Code Patterns to Follow

#### Instance vs Static Methods
```typescript
// Instance method (mutates this, returns this for chaining)
multiply(other: Matrix4): this {
  // Mutate this
  return this;
}

// Static method (creates new object, no mutation)
static multiply(a: Matrix4, b: Matrix4): Matrix4 {
  const result = a.clone();
  result.multiply(b);
  return result;
}
```

#### Constructors & Factory Methods

**Constructors are implicitly chainable** (TypeScript returns the new instance):
```typescript
// Constructor: implicitly returns this (the new instance)
const ctx = new GLContext(canvas)
  .setSize(800, 600)
  .setClearColor(0.1, 0.1, 0.1, 1.0);
```

**Factory methods should also be chainable** (return `this`):
```typescript
// Static factory method: creates instance + returns it for chaining
const ctx = GLContext.fromElementId('canvas')
  .setSize(800, 600)
  .setClearColor(0.1, 0.1, 0.1, 1.0);

// Instance method as alternative factory path:
// (returns this, allowing immediate chaining)
const ctx = new GLContext(canvas)
  .withViewport(100, 100, 400, 300)
  .setSize(800, 600);
```

**Constructor vs Factory Method Pattern:**
- **Constructor:** Use when you already have the required object (e.g., HTMLCanvasElement)
  ```typescript
  const canvas = document.getElementById('my-canvas') as HTMLCanvasElement;
  const ctx = new GLContext(canvas); // Direct path
  ```

- **Factory Methods:** Use for convenience initialization paths (e.g., element ID lookup)
  ```typescript
  const ctx = GLContext.fromElementId('my-canvas'); // Convenience path
  ```

- **Both paths:** Should create identical instances, both fully chainable with configuration methods

#### Method Chaining & Builder Pattern
```typescript
// All configuration methods return this for chaining
matrix.makeTranslation(1, 2, 3).multiply(other).invert();

// Builder pattern: all setter methods are chainable
// Allows flexible, readable fluent API
const ctx = GLContext.fromElementId('canvas')
  .setSize(800, 600)
  .setClearColor(0.1, 0.1, 0.1, 1.0);

// Methods can be called in any order when all are chainable
ctx.setClearColor(0.5, 0.5, 0.5)
   .setViewport(100, 100, 300, 200)
   .setCanvasSize(1024, 768);
```

**Chainability Rule:**
- Any method that modifies state should return `this` for chaining
- Exception: Methods that return meaningful data (queries) return that data, not `this`
- Constructor + chainable instance methods = flexible builder pattern

**Three Categories of Methods:**

1. **Mutation methods** (modify state) → return `this`:
   ```typescript
   vector.normalize().multiplyScalar(2).add(other);  // All return this
   matrix.makeTranslation(1,2,3).multiply(other).invert();
   quaternion.fromAxisAngle(axis, angle).normalize();
   ```

2. **Query methods** (return data) → return value, NOT `this`:
   ```typescript
   const magnitude = vector.magnitude;  // Returns number
   const determinant = matrix.determinant;  // Returns number
   const dotProduct = vector1.dot(vector2);  // Returns number
   ```

3. **Static/Factory methods** (create new instances) → return new instance:
   ```typescript
   const newVec = Vector3.add(v1, v2);  // Returns new Vector3
   const newMat = Matrix4.multiply(m1, m2);  // Returns new Matrix4
   const ctx = GLContext.fromElementId('canvas');  // Returns new GLContext
   ```

**Reference Implementation:** See math module classes (Vector3, Matrix4, Quaternion) for perfect adherence to this pattern.

#### Error Handling
```typescript
// Validate inputs with descriptive errors
if (!Number.isFinite(value)) {
  throw new Error(`Invalid value: ${value}. Must be a finite number.`);
}
```

#### JSDoc Documentation
```typescript
/**
 * Brief description of what this does
 *
 * @param param1 - Description of param1
 * @param param2 - Description of param2
 * @returns Description of return value
 * @throws Error if something invalid
 *
 * @example
 * const result = function(value);
 */
function example(param1: string, param2: number): string {
  // Implementation
}
```

---

## Feature Implementation Checklist

When implementing a feature, ensure:

- [ ] Code follows existing patterns (see Matrix4.ts, Quaternion.ts, Canvas.ts, GLContext.ts)
- [ ] TypeScript compiles without errors (strict mode)
- [ ] All edge cases handled (NaN, Infinity, null, zero, empty, etc.)
- [ ] Error messages are descriptive and helpful
- [ ] JSDoc comments explain graphics concepts
- [ ] **Chainability:** State-modifying methods return `this` for fluent API
- [ ] Comprehensive tests written
- [ ] Tests achieve 95%+ line coverage, 90%+ branch coverage
- [ ] All tests pass (`npm test`)
- [ ] API matches PLAN.md specification
- [ ] Proper resource cleanup/disposal (if applicable)

---

## Test Organization

### Test File Structure
```typescript
describe('ClassName', () => {
  let instance: ClassName;

  beforeEach(() => {
    // Setup
  });

  afterEach(() => {
    // Cleanup
  });

  describe('constructor', () => {
    it('creates instance with valid inputs', () => { });
    it('throws error for invalid inputs', () => { });
  });

  describe('methods', () => {
    it('performs expected operation', () => { });
    it('handles edge cases', () => { });
  });

  describe('integration', () => {
    it('completes workflow', () => { });
  });
});
```

### Running Tests
```bash
# Run all tests
npm test

# Run specific test file
npm test -- tests/resources/Buffer.test.ts

# Run with coverage
npm test -- --coverage

# Run in watch mode
npm test -- --watch
```

---

## Architecture Reference

### Core Module Structure
```
src/
├── core/              # Core rendering (✅ Complete)
│   ├── GLContext.ts   # WebGL 2.0 wrapper
│   ├── Canvas.ts      # Canvas initialization
│   └── Renderer.ts    # Base renderer interface
├── resources/         # GPU resources (🚧 In Progress)
│   ├── Buffer.ts      # Buffers ✅
│   ├── Shader.ts      # Shaders (Next)
│   ├── VertexArray.ts # VAOs
│   └── Texture.ts     # Textures
├── geometry/          # Geometry (🚧 Next)
├── materials/         # Materials (🚧 Next)
├── scene/             # Scene graph (🚧 Next)
└── renderer/          # WebGL renderer (🚧 Next)
```

### Design Patterns
- **Abstraction:** Abstract base classes for extensibility (Renderer, Geometry, Material)
- **Resource Management:** GLContext tracks resources for cleanup
- **Error Checking:** All WebGL calls wrapped with validation
- **Defensive Copies:** Return copies of mutable state (colors, etc.)
- **Type Safety:** Strict TypeScript with enums for constants

---

## Key Decisions & Rationale

### Column-Major Matrices
WebGL uses column-major storage (GLSL convention). Matrices stored in column-major order:
```
Data: [col0_row0, col0_row1, col0_row2, col0_row3, col1_row0, ...]
```

### Float32Array
All GPU-compatible data uses Float32Array for:
- Automatic WebGL compatibility
- Better performance than regular arrays
- Predictable memory layout

### Context-Based Resource Tracking
GLContext tracks all created resources (buffers, shaders, textures, VAOs) for:
- Automatic cleanup on context disposal
- Prevention of memory leaks
- Easier debugging

### Extensible Architecture
Base classes (Renderer, Geometry, Material) allow:
- Future renderers (WebGPU, Canvas 2D, Node.js)
- Custom geometry types
- Custom material shaders

### Three-Tier Usability & Educational Focus

This library is designed for **learners AND expert developers** by providing escape hatches at every level:

**Tier 1: Beginners (High-level abstractions)**
```typescript
// Use pre-built materials - don't worry about shaders
const mesh = new Mesh(geometry, new BasicMaterial({ color: 0xff0000 }));
```

**Tier 2: Intermediate (Customize existing components)**
```typescript
// Write custom shaders when built-in materials aren't enough
const program = ctx.createProgram(myVertexShader, myFragmentShader);
```

**Tier 3: Advanced (Full control)**
```typescript
// Direct access to WebGL API and rendering pipeline
ctx.gl.drawArrays(ctx.gl.TRIANGLES, 0, vertexCount);
```

**Philosophy:**
- Start simple → understand concepts → customize → graduate to expert
- Same library, no switching needed
- `createProgram(vertexSrc, fragmentSrc)` is the key escape hatch:
  - Perfect for educational examples ("here's what a shader is")
  - Enables advanced users to build custom materials
  - Supports library developers extending the system
- Don't add shader file loading or builder helpers until the Material System reveals what's needed (Phase 4+)

**Benefits:**
- Steep learning curve is reduced with high-level APIs
- Advanced users have complete control when needed
- Educational value: see exactly what's happening at each level
- No "magic" that can't be understood or customized

---

## Common Issues & Solutions

### Issue: Tests fail with "WebGL not supported"
**Solution:** Tests run in jsdom environment which mocks WebGL. GLContext expects real WebGL context.

### Issue: Memory grows during tests
**Solution:** Ensure dispose() is called in afterEach() blocks. GLContext tracks resources for cleanup.

### Issue: Coverage gaps in fallback code
**Solution:** Fallback/defensive code doesn't need 100% coverage if main path is tested. Gap coverage over 90% is acceptable.

### Issue: TypeScript strict mode errors
**Solution:** All code must compile with strict mode. Use explicit types and type guards where needed.

---

## Next Steps

1. **Review & approve Buffer.ts implementation** (currently complete, awaiting feedback)
2. **Implement Shader.ts** - Once Buffer.ts approved
3. **Implement VertexArray.ts** - After Shader.ts
4. **Implement geometry system** - After GPU resources
5. **Implement materials** - After geometry
6. **Implement scene graph** - After materials
7. **Implement WebGL renderer** - Core rendering logic
8. **Create demo** - Rotating triangle/cube

Each feature follows the workflow above with your review and approval between steps.

---

## Best Practices & Considerations

### Code Review Checklist
Before requesting approval, I will verify:
- ✅ All tests pass (`npm test`)
- ✅ Coverage targets met (95%+ lines, 90%+ branches)
- ✅ TypeScript strict mode compiles (`npm run build`)
- ✅ Code follows existing patterns (see reference files)
- ✅ JSDoc comments explain graphics concepts
- ✅ Error handling is comprehensive
- ✅ Resource cleanup/disposal is proper (for GPU resources)
- ✅ No console.log or debugging code left in

### Conflict Avoidance
- Feature branches are isolated - no conflicts with other work
- Main branch only updated after approval - always stable
- Clear status in CLAUDE.md prevents confusion
- Each feature has its own commit message explaining changes

### Performance Considerations
- WebGL operations are batch-optimized where possible
- Resource tracking prevents memory leaks
- Float32Array used throughout for GPU efficiency
- Math operations leverage method chaining where appropriate

### Security & Type Safety
- All inputs validated with descriptive error messages
- Strict TypeScript (no `any` without justification)
- WebGL error checking on all GPU operations
- Defensive copies of mutable state

### Documentation Strategy
- Code comments explain graphics concepts (not just syntax)
- JSDoc includes `@example` blocks for usage
- Architecture decisions documented in HANDOFF.md
- Test files serve as usage examples

### Future Extensibility
- Abstract base classes (Renderer, Geometry, Material) allow future implementations
- Enum constants instead of magic numbers
- Modular imports support tree-shaking
- Design patterns support WebGPU or other backends later

---

## Quick Commands

```bash
# Development
npm test                    # Run all tests
npm test -- --watch        # Watch mode
npm run build               # Build project
npm test -- --coverage      # Coverage report

# Git workflow (feature branch)
git status                  # Check status
git diff                    # See changes
git log --oneline           # View history
git checkout -b feature/[name]  # Create feature branch
git push origin feature/[name]  # Push for backup
```

---

## Questions?

Refer to:
- **HANDOFF.md** - Detailed project context and patterns
- **PLAN.md** - Full architecture and roadmap
- **Existing code** - Matrix4.ts, Quaternion.ts, Canvas.ts, GLContext.ts for patterns
- **Test files** - See how similar features are tested
- **This guide** - CLAUDE.md for workflow and current status
