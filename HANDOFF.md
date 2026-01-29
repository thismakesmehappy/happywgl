# Project Handoff Documentation

**Purpose:** This document provides comprehensive information for Claude (or any AI assistant) to take over and continue development of this WebGL graphics library project.

**Last Updated:** January 2026

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Current Implementation Status](#current-implementation-status)
3. [Architecture & Design Patterns](#architecture--design-patterns)
4. [Code Conventions & Patterns](#code-conventions--patterns)
5. [Testing Strategy](#testing-strategy)
6. [TODO Lists & Next Steps](#todo-lists--next-steps)
7. [Development Workflow](#development-workflow)
8. [Key Decisions & Rationale](#key-decisions--rationale)
9. [Common Issues & Solutions](#common-issues--solutions)
10. [Resources & References](#resources--references)

---

## Project Overview

### What This Project Is

A **modular TypeScript WebGL graphics library** built from scratch, similar to three.js but designed for learning and educational purposes. The library provides:

- **Math primitives** (Vectors, Matrices, Quaternions)
- **Scene graph** architecture
- **Rendering pipeline** abstraction
- **Modular imports** for tree-shaking
- **TypeScript-first** with strict type checking

### Project Goals

1. **Educational:** Extensive documentation and comments explaining graphics concepts
2. **Modular:** Each module independently importable
3. **Production-ready:** Usable in real projects
4. **Progressive:** Built incrementally, starting with foundations

### Tech Stack

- **TypeScript** (strict mode)
- **Vite** (build tool)
- **Vitest** (testing)
- **WebGL 2.0** (rendering API)
- **ES Modules** (module system)

---

## Current Implementation Status

### ✅ Completed (Phase 1 - Math Foundation)

#### Math Primitives (100% Complete)

**Vectors:**
- ✅ `Vector` (abstract base class)
- ✅ `Vector2`, `Vector3`, `Vector4` (concrete implementations)
- ✅ Operations: add, subtract, multiply, divide, dot, cross, normalize, length, lerp
- ✅ Coverage: 100% line coverage, 100% branch coverage

**Matrices:**
- ✅ `Matrix` (abstract base class for any size)
- ✅ `SquareMatrix` (abstract base for square matrices)
- ✅ `Matrix2`, `Matrix3`, `Matrix4` (concrete implementations)
- ✅ Operations: multiply, transpose, determinant, inverse
- ✅ Transformation builders: translation, rotation, scale
- ✅ Coverage: 97-100% line coverage, 88-100% branch coverage

**Quaternions:**
- ✅ `Quaternion` class (complete implementation)
- ✅ Operations: multiply, conjugate, inverse, normalize, dot
- ✅ Conversions: to/from axis-angle, Euler angles, rotation matrices
- ✅ Interpolation: lerp, slerp, nlerp, squad
- ✅ Rotation utilities: rotateVector, fromLookAt, fromRotationBetweenVectors
- ✅ Coverage: 100% line coverage, 96.51% branch coverage

#### Test Coverage Summary

```
All files        |   99.24 |    94.87 |     100 |   99.14 |
 Matrix.ts       |   97.31 |    91.42 |     100 |   96.89 |
 Matrix2.ts      |   97.29 |    88.88 |     100 |   96.92 |
 Matrix3.ts      |   99.21 |    94.44 |     100 |   98.98 |
 Matrix4.ts      |   99.45 |    94.44 |     100 |   99.23 |
 Quaternion.ts   |     100 |    96.51 |     100 |     100 |
 SquareMatrix.ts |     100 |      100 |     100 |     100 |
 Vector.ts       |   99.05 |    96.66 |     100 |    98.9 |
 Vector2.ts      |     100 |      100 |     100 |     100 |
 Vector3.ts      |     100 |      100 |     100 |     100 |
 Vector4.ts      |     100 |      100 |     100 |     100 |
```

### 🚧 In Progress / Next Up

#### Phase 1 Remaining (Core MVP)
- [ ] Core rendering infrastructure (`core/Canvas.ts`, `core/GLContext.ts`, `core/Renderer.ts`)
- [ ] Buffer management (`resources/Buffer.ts`)
- [ ] Shader compilation (`resources/Shader.ts`)
- [ ] Basic geometry (`geometry/Geometry.ts`, `geometry/BufferGeometry.ts`)
- [ ] Simple primitives (triangle, quad)
- [ ] Basic material (`materials/Material.ts`, `materials/BasicMaterial.ts`)
- [ ] Object3D base class (`scene/Object3D.ts`)
- [ ] Simple renderer (`renderer/WebGLRenderer.ts`)
- [ ] Basic image export

#### Phase 2 (Geometry & Primitives)
- [ ] Primitive shapes: Box, Sphere, Plane, Cylinder, Torus
- [ ] Bezier curves
- [ ] Catmull-Rom splines
- [ ] Superellipsoids
- [ ] Rotational solids

#### Phase 3+ (Future Phases)
See `PLAN.md` for complete roadmap.

---

## Architecture & Design Patterns

### Class Hierarchy

```
Matrix (abstract)
├── SquareMatrix (abstract)
│   ├── Matrix2
│   ├── Matrix3
│   └── Matrix4
└── (future: non-square matrices)

Vector (abstract)
├── Vector2
├── Vector3
└── Vector4

Quaternion (standalone)
```

### Design Principles

1. **Inheritance for Shared Behavior**
   - `Matrix` → `SquareMatrix` → `Matrix2/3/4`
   - `Vector` → `Vector2/3/4`
   - Shared methods in base classes, size-specific optimizations in subclasses

2. **Static vs Instance Methods**
   - **Instance methods** (e.g., `m1.multiply(m2)`): Mutate the calling object
   - **Static methods** (e.g., `Matrix.multiply(m1, m2)`): Return new object, don't mutate
   - Pattern: Both versions available for flexibility

3. **Method Chaining**
   - Mutating methods return `this` for chaining
   - Example: `matrix.makeTranslation(1,2,3).multiply(other).invert()`

4. **Column-Major Storage**
   - All matrices use column-major order (WebGL/OpenGL convention)
   - Access: `matrix.get(column, row)` or `matrix[column][row]`
   - Storage: `elements[column * rows + row]`

5. **Float32Array for Performance**
   - All math primitives use `Float32Array` for WebGL compatibility
   - Efficient memory layout and GPU transfer

### Code Organization

```
src/
├── math/           # ✅ Complete - Mathematical primitives
├── core/           # 🚧 Next - WebGL context & renderer base
├── resources/      # 🚧 Next - GPU resources (buffers, shaders)
├── geometry/       # 🚧 Next - Geometry generation
├── scene/          # 🚧 Next - Scene graph
├── camera/         # 🚧 Next - Camera implementations
├── lights/         # 🚧 Next - Lighting system
├── materials/      # 🚧 Next - Material system
├── animation/      # 🚧 Future - Animation system
├── renderer/       # 🚧 Next - WebGL renderer
├── loaders/        # 🚧 Future - Asset loaders
└── utils/          # 🚧 Future - Utilities (Color, MathUtils, Transform)
```

---

## Code Conventions & Patterns

### Naming Conventions

- **Classes:** PascalCase (`Matrix4`, `Vector3`)
- **Methods:** camelCase (`multiply`, `makeRotation`)
- **Private fields:** `_elements`, `_validateSize()`
- **Constants:** UPPER_SNAKE_CASE (`EPSILON`, `I2`)

### Method Patterns

#### Mutating Instance Methods
```typescript
multiply(other: Matrix4): this {
  // Mutate this matrix
  return this; // For chaining
}
```

#### Non-Mutating Static Methods
```typescript
static multiply(a: Matrix4, b: Matrix4): Matrix4 {
  const result = a.clone();
  result.multiply(b);
  return result;
}
```

#### Factory Methods
```typescript
static identity(): Matrix4 {
  return new Matrix4().makeIdentity();
}

static fromArray(array: ArrayLike<number>): Matrix4 {
  return new Matrix4(...Array.from(array));
}
```

### Error Handling

- **Validation:** Methods validate inputs and throw descriptive errors
- **Error Messages:** Include context (e.g., "Matrix multiplication incompatible: 3x4 * 2x3")
- **Edge Cases:** Handle NaN, Infinity, zero vectors, singular matrices

### Type Safety

- **Strict TypeScript:** All code uses strict mode
- **Generic Constraints:** Use generics for type preservation (e.g., `static lerp<T extends Vector>`)
- **Type Guards:** Check types at runtime when needed (e.g., `instanceof Matrix4`)

---

## Testing Strategy

### Test Organization

Tests mirror source structure:
```
tests/
├── math/
│   ├── Matrix.test.ts
│   ├── Matrix2.test.ts
│   ├── Matrix3.test.ts
│   ├── Matrix4.test.ts
│   ├── Quaternion.test.ts
│   ├── SquareMatrix.test.ts
│   ├── Vector.test.ts
│   ├── Vector2.test.ts
│   ├── Vector3.test.ts
│   └── Vector4.test.ts
└── helpers/
    └── math/
        ├── createMatrixPair.ts
        ├── createSquareMatrix.ts
        └── ...
```

### Test Structure

Each test file follows this pattern:

```typescript
describe('ClassName', () => {
  describe('Constructor', () => { ... });
  describe('Getters', () => { ... });
  describe('Proxy', () => { ... });
  describe('Element Access', () => { ... });
  describe('Copy/Clone', () => { ... });
  describe('Comparison', () => { ... });
  describe('Arithmetic', () => { ... });
  describe('Static Factory Methods', () => { ... });
  describe('Static Methods', () => { ... });
  // ... method-specific sections
});
```

### Test Coverage Goals

- **Line Coverage:** 95%+ (currently 99.24%)
- **Branch Coverage:** 90%+ (currently 94.87%)
- **Function Coverage:** 100% (currently 100%)

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test -- Matrix4.test.ts

# Run in watch mode
npm test -- --watch
```

### Test Helpers

Located in `tests/helpers/math/`:
- `createSquareMatrix.ts` - Creates test square matrix classes
- `createMatrixPair.ts` - Creates test matrix pairs (e.g., 3x2 and 2x3)
- `TestSquareMatrixUneven.ts` - Test class for non-square matrices
- `const.ts` - Shared constants (EPSILON, etc.)

---

## TODO Lists & Next Steps

### Immediate Next Steps (Phase 1 - Core MVP)

#### 1. Core Rendering Infrastructure

**Priority: HIGH**

- [ ] **`src/core/Canvas.ts`**
  - Canvas element initialization
  - WebGL context creation
  - Resize handling
  - Error handling for context creation failures

- [ ] **`src/core/GLContext.ts`**
  - WebGL 2.0 wrapper class
  - Error checking wrapper for all WebGL calls
  - State management helpers
  - Extension checking

- [ ] **`src/core/Renderer.ts`**
  - Abstract base renderer interface
  - Common rendering methods
  - State management abstraction

#### 2. GPU Resources

**Priority: HIGH**

- [ ] **`src/resources/Buffer.ts`**
  - Vertex Buffer Object (VBO) abstraction
  - Index Buffer Object (IBO) abstraction
  - Buffer data upload/update
  - Buffer binding/unbinding
  - Cleanup/disposal

- [ ] **`src/resources/Shader.ts`**
  - Shader compilation (vertex/fragment)
  - Shader program linking
  - Uniform management
  - Attribute management
  - Error handling for compilation failures

- [ ] **`src/resources/VertexArray.ts`** (WebGL 2)
  - Vertex Array Object (VAO) abstraction
  - Attribute binding
  - VAO state management

- [ ] **`src/resources/Texture.ts`**
  - Texture creation and binding
  - Image loading
  - Texture parameters (wrap, filter)
  - Mipmap generation

#### 3. Geometry System

**Priority: HIGH**

- [ ] **`src/geometry/Geometry.ts`**
  - Base geometry class
  - Vertex data storage
  - Attribute definitions

- [ ] **`src/geometry/BufferGeometry.ts`**
  - Geometry with GPU buffers
  - Buffer management
  - Index buffer support
  - Attribute management

- [ ] **Simple Primitives**
  - Triangle geometry
  - Quad geometry
  - Basic vertex attributes (position, normal, UV)

#### 4. Material System

**Priority: HIGH**

- [ ] **`src/materials/Material.ts`**
  - Base material class
  - Shader program management
  - Uniform management
  - Render state (blending, depth, etc.)

- [ ] **`src/materials/BasicMaterial.ts`**
  - Flat color material
  - Simple vertex/fragment shaders
  - Color uniform

#### 5. Scene Graph

**Priority: HIGH**

- [ ] **`src/scene/Object3D.ts`**
  - Base class for all scene objects
  - Transform (position, rotation, scale)
  - Parent/child relationships
  - World matrix calculation
  - `add()`, `remove()`, `traverse()` methods

- [ ] **`src/scene/Scene.ts`**
  - Root scene container
  - Extends Object3D
  - Scene-level properties

- [ ] **`src/scene/Mesh.ts`**
  - Renderable mesh object
  - Geometry + Material
  - Extends Object3D

#### 6. Renderer Implementation

**Priority: HIGH**

- [ ] **`src/renderer/WebGLRenderer.ts`**
  - Main WebGL renderer implementation
  - Render loop
  - Scene traversal
  - Draw call batching
  - State management

#### 7. Basic Image Export

**Priority: MEDIUM**

- [ ] Browser: `canvas.toDataURL()` wrapper
- [ ] Basic image export API

### Future Phases

See `PLAN.md` for complete roadmap:
- **Phase 2:** Geometry & Primitives (Box, Sphere, etc.)
- **Phase 3:** Scene Graph & Cameras
- **Phase 4:** Lighting & Materials
- **Phase 5:** Animation System
- **Phase 6:** Asset Loading
- **Phase 7:** Advanced Effects
- **Phase 8:** Polish & Packaging
- **Phase 9:** Output Capabilities
- **Phase 10:** Interactivity Module

### Known Issues & Technical Debt

1. **Uncovered Lines (Minor)**
   - `Matrix.ts`: Lines 456-459, 467 (edge cases)
   - `Matrix2.ts`: Lines 123, 152 (edge cases)
   - `Matrix3.ts`: Line 174 (edge case)
   - `Matrix4.ts`: Line 146 (edge case)
   - `Vector.ts`: Line 90 (edge case)
   - `Quaternion.ts`: Lines 1200, 1262-1263 (very rare edge cases)

2. **TypeScript Type Conflicts (Resolved)**
   - Static method inheritance between `Matrix`, `SquareMatrix`, and concrete classes
   - Solution: Use generic constraints and careful method signatures

3. **Git History**
   - Recent rebase fixed commit message for Matrix classes commit
   - Branch has diverged from remote (will need force push if updating remote)

---

## Development Workflow

### Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Tests**
   ```bash
   npm test
   ```

3. **Build**
   ```bash
   npm run build
   ```

4. **Development Server** (when examples exist)
   ```bash
   npm run dev
   ```

### Making Changes

1. **Create Feature Branch** (if using git workflow)
   ```bash
   git checkout -b feature/new-feature
   ```

2. **Implement Feature**
   - Follow existing code patterns
   - Add comprehensive tests
   - Update documentation

3. **Run Tests**
   ```bash
   npm test -- --coverage
   ```

4. **Ensure Coverage Goals Met**
   - Line coverage: 95%+
   - Branch coverage: 90%+

5. **Commit Changes**
   ```bash
   git add .
   git commit -m "Descriptive commit message"
   ```

### Code Review Checklist

- [ ] Tests pass (`npm test`)
- [ ] Coverage goals met (95%+ lines, 90%+ branches)
- [ ] Code follows existing patterns
- [ ] TypeScript compiles without errors
- [ ] No linter errors
- [ ] Documentation updated if needed

---

## Key Decisions & Rationale

### Why Column-Major Matrices?

- **WebGL Convention:** WebGL uses column-major order
- **GPU Compatibility:** Direct transfer to GPU without transposition
- **Standard:** Matches OpenGL and most graphics libraries

### Why Float32Array?

- **WebGL Requirement:** WebGL buffers require typed arrays
- **Performance:** Efficient memory layout and GPU transfer
- **Precision:** Float32 is sufficient for graphics (Float64 unnecessary overhead)

### Why Instance + Static Methods?

- **Flexibility:** Users can choose mutating (performance) or non-mutating (immutability)
- **Pattern:** Common in graphics libraries (three.js, gl-matrix)
- **Chaining:** Instance methods enable method chaining

### Why Abstract Base Classes?

- **Code Reuse:** Shared implementation in base classes
- **Type Safety:** TypeScript generics ensure type preservation
- **Extensibility:** Easy to add new matrix/vector sizes

### Why Separate Geometry and Material?

- **Reusability:** Same geometry with different materials
- **Separation of Concerns:** Geometry = shape, Material = appearance
- **Performance:** Can batch render same geometry with different materials

---

## Common Issues & Solutions

### Issue: TypeScript Static Method Inheritance Errors

**Error:** `TS2417: Class static side incorrectly extends base class static side`

**Solution:**
- Use generic constraints: `static identity<T extends SquareMatrix>(this: new (...args: any[]) => T): T`
- Avoid conflicting static method signatures
- Use `call()` pattern when needed: `SquareMatrix.identity.call(Matrix4)`

### Issue: Matrix Multiplication Order Confusion

**Problem:** Matrix multiplication order (left-to-right vs right-to-left)

**Solution:**
- Document clearly: `A.multiply(B)` means `A = A * B` (A transformed by B)
- Use `multiplyMatrices()` for explicit order: `multiplyMatrices(A, B)` = `A * B`
- Follow WebGL convention: transformations applied right-to-left

### Issue: Quaternion Round-Trip Failures

**Problem:** Converting quaternion → matrix → quaternion doesn't match

**Solution:**
- Handle non-unit quaternions in `toRotationMatrix()` methods
- Use scaled formula: `s = 2 / n` where `n = x² + y² + z² + w²`
- Compare rotations by transforming test vectors, not direct quaternion equality
- Account for `q` and `-q` representing the same rotation

### Issue: Test Coverage Not Reaching Goals

**Solution:**
- Identify uncovered lines using coverage report
- Add edge case tests (NaN, Infinity, zero, singular matrices)
- Test all branches (if/else, switch cases)
- Test error paths (invalid inputs, edge cases)

### Issue: Git Rebase Conflicts

**Solution:**
- Use `git rebase --continue` after resolving conflicts
- Use `git rebase --abort` to cancel if needed
- Use `--force-with-lease` instead of `--force` when pushing

---

## Resources & References

### Documentation Files

- **`PLAN.md`** - Complete development roadmap and architecture
- **`README.md`** - Project overview and status
- **`HANDOFF.md`** - This document (handoff guide)

### External Resources

- **WebGL 2.0 Specification:** https://www.khronos.org/registry/webgl/specs/latest/2.0/
- **Three.js Documentation:** https://threejs.org/docs/ (reference for API design)
- **gl-matrix:** https://github.com/toji/gl-matrix (reference for math library patterns)
- **TypeScript Handbook:** https://www.typescriptlang.org/docs/

### Key Concepts to Understand

- **WebGL Pipeline:** Vertex shader → Rasterization → Fragment shader
- **Column-Major Matrices:** Storage order for matrices
- **Homogeneous Coordinates:** 4D coordinates for 3D transformations
- **Quaternions:** Rotation representation avoiding gimbal lock
- **Scene Graph:** Hierarchical object organization
- **MVP Matrix:** Model-View-Projection matrix composition

---

## Quick Reference

### Project Structure
```
webgl/
├── src/              # Source code
├── tests/            # Tests
├── dist/             # Build output
├── docs/             # Documentation
├── examples/         # Example projects
├── package.json      # Dependencies & scripts
├── tsconfig.json     # TypeScript config
├── vite.config.ts    # Vite config
└── vitest.config.ts  # Vitest config
```

### Key Commands
```bash
npm test              # Run tests
npm test -- --coverage # Run with coverage
npm run build         # Build project
npm run dev           # Dev server
```

### Key Files to Understand
- `src/math/Matrix4.ts` - Example of complete matrix implementation
- `src/math/Quaternion.ts` - Example of complex math primitive
- `tests/math/Matrix4.test.ts` - Example of comprehensive test suite
- `PLAN.md` - Complete project roadmap

---

## Contact & Continuation

When taking over this project:

1. **Read this document thoroughly**
2. **Review `PLAN.md` for roadmap**
3. **Examine existing code** (start with `Matrix4.ts` and `Quaternion.ts`)
4. **Run tests** to understand current state
5. **Start with Phase 1 remaining tasks** (Core MVP)
6. **Follow existing patterns** and conventions
7. **Maintain test coverage** (95%+ lines, 90%+ branches)
8. **Document as you go** (comments, JSDoc, examples)

**Good luck!** 🚀
