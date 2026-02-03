# WebGL Graphics Library - Architecture

**Date:** January 30, 2026
**Status:** ✅ APPROVED - Foundation for Phase 1+ Implementation
**Layer Structure:** 4-layer architecture with user-friendly wrappers

---

## Architecture Layers Overview

```
┌─────────────────────────────────────────────────────────────┐
│ Layer 4: Scene Graph & Rendering                            │
├─────────────────────────────────────────────────────────────┤
│  Object3D, Scene, Mesh, WebGLRenderer                        │
│  (High-level scene management)                              │
└─────────────────────────────────────────────────────────────┘
                            ▲
                            │ uses
┌─────────────────────────────────────────────────────────────┐
│ Layer 3: High-Level Concepts                                │
├─────────────────────────────────────────────────────────────┤
│  Geometry, Material, BasicMaterial                           │
│  (User-friendly rendering abstractions)                      │
└─────────────────────────────────────────────────────────────┘
                            ▲
                            │ uses
┌─────────────────────────────────────────────────────────────┐
│ Layer 2.5: Shader Wrapper (RESERVES UTILITIES)              │
├─────────────────────────────────────────────────────────────┤
│  Shader - User-facing API                                   │
│  Phase 1: Wraps Program cleanly                             │
│  Phase 4+: Adds utilities (load, validate, cache)           │
│  Material takes Shader → No refactoring when utilities added│
└─────────────────────────────────────────────────────────────┘
                            ▲
                            │ wraps
┌─────────────────────────────────────────────────────────────┐
│ Layer 2: GPU Resources (Direct WebGL Wrappers)              │
├─────────────────────────────────────────────────────────────┤
│  Program, VertexArray, Texture, Buffer                       │
│  (Low-level resource management)                             │
│  Design Pattern: Static binding tracking + GPU query        │
│  Self-registration for GLContext cleanup tracking           │
└─────────────────────────────────────────────────────────────┘
                            ▲
                            │ uses
┌─────────────────────────────────────────────────────────────┐
│ Layer 1: Low-Level APIs                                     │
├─────────────────────────────────────────────────────────────┤
│  GLContext (WebGL wrapper with error checking)              │
│  WebGLState (comprehensive state management)                │
│  Canvas (context creation & initialization)                 │
└─────────────────────────────────────────────────────────────┘
```

---

## Key Design Principles

### 1. Dual-Layer Shader Architecture (Program + Shader)

**Why:** WebGL has Programs (compiled resources) and Shaders (source code). Our API should reflect this for clarity.

**Program.ts (Layer 2)** - Low-level resource wrapper
- Handles compilation and linking
- Manages uniform/attribute location caching
- Provides `use()` and `unused()` methods
- For advanced users who need direct control

**Shader.ts (Layer 2.5)** - User-facing wrapper
- Wraps Program for intuitive API
- **Phase 1:** Delegates to Program
- **Phase 4+:** Adds utilities without breaking Material:
  - `static load(ctx, url)` - Load from file
  - `static write(shader, path)` - Export source
  - `validate()` - Compile-time validation
  - `static cache` - Caching layer
- Material takes Shader (not Program) - future-proof design

**Mental Model:**
```typescript
// User-friendly API
const shader = new Shader(ctx, vertexSource, fragmentSource);
const material = new Material(ctx, shader);

// Advanced users can drop to Program
const program = new Program(ctx, vertexSource, fragmentSource);

// Phase 4+: Shader gains utilities, Material unaffected
const shader = await Shader.load(ctx, 'shader.glsl');
const material = new Material(ctx, shader);  // Still works!
```

### 2. Binding State Query Pattern (Source of Truth from GPU)

**Why:** WebGL is the authoritative source of state. Support expert users mixing library code with raw `ctx.gl` calls.

Each resource class provides static `queryBinding()` method to get actual GPU state:

```typescript
// Query what's actually bound to GPU
const bound = Buffer.queryBinding(ctx, ctx.gl.ARRAY_BUFFER);
const program = Program.queryBinding(ctx);
const vao = VertexArray.queryBinding(ctx);
const texture = Texture.queryBinding(ctx, textureUnit);
```

**Benefits:**
- ✅ Always accurate (GPU source of truth)
- ✅ Works with expert `ctx.gl` calls
- ✅ No risk of getting out of sync
- ✅ Great for debugging/validation

### 3. Resource Self-Registration

Each resource registers itself with GLContext for automatic cleanup:

```typescript
class Program {
  constructor(ctx: GLContext, vertexSource: string, fragmentSource: string) {
    this.webGLProgram = ctx.createProgram(vertexSource, fragmentSource);
    ctx.registerProgram(this.webGLProgram);  // Self-register
  }
}
```

**Benefits:**
- No manual cleanup needed
- GLContext tracks all resources
- Prevents memory leaks

### 4. Static Binding Tracking (Performance Optimization)

Each Layer 2 resource maintains static `_currentBinding` to avoid redundant WebGL calls:

```typescript
class Buffer {
  private static _currentBinding: Map<GLenum, WebGLBuffer | null> = new Map();

  bind(target: GLenum = this.target): this {
    if (this._currentBinding.get(target) === this.webGLBuffer) {
      return this;  // Already bound, skip redundant call
    }
    this._ctx.gl.bindBuffer(target, this.webGLBuffer);
    this._currentBinding.set(target, this.webGLBuffer);
    return this;
  }
}
```

**Benefits:**
- Avoids redundant GPU calls
- Small memory cost for significant perf gain
- Phase 1 appropriate (single program/material per render)

### 5. Five-Tier Usability

The API serves users at different expertise levels:

**Tier 1: Beginners**
```typescript
const mesh = new Mesh(geometry, new BasicMaterial({ color: 0xff0000 }));
renderer.render(scene);
```

**Tier 2a: Intermediate**
```typescript
const material = new Material(ctx, new Shader(ctx, vertexSrc, fragmentSrc));
const mesh = new Mesh(geometry, material);
```

**Tier 2b: Intermediate-Advanced**
```typescript
const shader = new Shader(ctx, customVertexShader, customFragmentShader);
const material = new Material(ctx, shader);
// Phase 4+: Could use Shader.load() for file-based shaders
```

**Tier 3: Advanced**
```typescript
const program = new Program(ctx, vertexSrc, fragmentSrc);
program.use();
// Full control over uniforms, attributes, state
```

**Tier 4: Expert**
```typescript
ctx.gl.useProgram(program.webGLProgram);
ctx.gl.drawElements(...);  // Direct WebGL control
```

### 6. Canvas - Independent DOM Management

**Design:** Canvas is independent of GLContext (no viewport sync coupling)

**Why:** Canvas should work with any rendering context:
- Canvas 2D API
- WebGL / WebGPU
- Third-party libraries
- Server-side rendering

**Key Methods:**
- `setSize(width, height)` - Sets canvas CSS and drawing buffer size
- `fillWindow()` - Responsive canvas that fills browser window
- `stopFillWindow(revert?)` - Stop responsive mode, optionally revert size
- Chainable DOM methods: `setId()`, `addClass()`, `removeClass()`, `appendTo()`

**Important:** `fillWindow()` only resizes the canvas element, NOT the WebGL viewport. With WebGL, manually sync after resizing:

```typescript
canvas.fillWindow();
glContext.setViewport(0, 0, canvas.width, canvas.height);

// Or use Renderer (Phase 4) for automatic coordination:
renderer.setSize(canvas.width, canvas.height);
```

**Rationale:**
- ✅ Canvas stays rendering-context-agnostic
- ✅ GLContext stays rendering-logic independent
- ✅ Clear separation of concerns
- ✅ Renderer (Phase 4) will handle high-level coordination

This separation of concerns allows Canvas to be useful for any rendering approach, while GLContext focuses purely on WebGL state management.

### 7. Abstract Renderer Base Class (Phase 1)

**Design:** Renderer is an abstract base class defining the rendering interface

**Purpose:** Provides a common interface for all renderer implementations:
- WebGLRenderer (Phase 4) - WebGL 2.0 implementation
- CanvasRenderer (Phase 8+) - Canvas 2D fallback
- WebGPURenderer (Future) - Next-gen graphics API

**Phase 1 Responsibilities:**
```typescript
abstract class Renderer {
  // Common state
  protected _width: number;
  protected _height: number;
  protected _clearColor: { r, g, b, a };

  // Public interface
  setSize(width, height): void
  setClearColor(r, g, b, a): void
  clear(): void
  abstract render(): void    // Subclasses implement
  abstract dispose(): void   // Subclasses implement
}
```

**Benefits:**
- ✅ Defines common rendering interface early
- ✅ Subclasses only implement rendering-specific logic
- ✅ Consistent API across all renderer backends
- ✅ No need to refactor Material/Geometry later

**Phase 4+ Extension:**
WebGLRenderer will implement the abstract methods and add WebGL-specific rendering logic without changing the base interface.

---

## Phase 1 Implementation Strategy

### Layer 2: GPU Resources (40% complete)

**Completed:**
- ✅ Buffer.ts - Array/Element array buffer wrapper

**In Progress:**
- 🔍 Program.ts - Shader compilation and linking

**Remaining:**
- VertexArray.ts (~200 lines) - VAO abstraction
- Texture.ts (~150 lines) - Texture resource wrapper

**Layer 2 Pattern:**
- Static binding tracking (optimization)
- Query methods for GPU state (debugging)
- Self-registration for cleanup
- Use()/bind() methods for activation
- Comprehensive error handling

### Layer 2.5: Shader Wrapper (0% complete)

- Shader.ts (~100 lines) - Wraps Program for user-facing API

### Layer 3: High-Level Concepts (0% complete, blocked)

Blocked until Layer 2.5 complete:
- Geometry.ts (~300 lines) - Uses Buffer + VertexArray
- Material.ts (~250 lines) - Uses Shader + uniforms
- BasicMaterial.ts (~100 lines) - Default material implementation

### Layer 4: Scene Graph (0% complete, blocked)

Blocked until Layer 3 complete:
- Object3D.ts (~150 lines) - Transform hierarchy
- Scene.ts (~100 lines) - Object container
- Mesh.ts (~100 lines) - Geometry + Material combination
- WebGLRenderer.ts (~300 lines) - Render orchestration

---

## Strategic Design Decisions

### Material Architecture: Design A (Shader + Uniforms)

**Decision:** Each Material has its own Shader instance, manages own uniforms.

```typescript
class Material {
  shader: Shader;
  uniforms: { color: Vec4, shininess: number, ... };

  use() {
    this.shader.use();  // Activates program
    ctx.gl.uniform4f(colorLoc, ...this.uniforms.color);
  }
}
```

**Rationale:**
- ✅ Clear and intuitive API
- ✅ Flexible (different materials use different shaders)
- ✅ Lighting can be passed as uniforms
- ✅ Can add shared lighting support in Phase 3

### State Management: Simple Approach (Phase 1)

**Decision:** Keep state management straightforward.

```typescript
// Material receives ctx in constructor
material.use() {
  this.shader.use();
  ctx.state.enableBlend();  // Uses shared ctx.state
  // Upload uniforms
}

// No per-material state restoration
// Each material responsible for setting what it needs
```

**Philosophy:**
- Explicit is better than implicit
- Simple and efficient for Phase 1
- Can adopt state restoration later if needed

### OutputTarget Abstraction (Phase 1)

**Decision:** Include light OutputTarget abstraction in Phase 1, not defer to Phase 8+.

```typescript
interface OutputTarget {
  getContext(): WebGL2RenderingContext;
  render(drawFunction: () => void): void;
}

class CanvasOutput implements OutputTarget {
  // Canvas-specific rendering
}

// Phase 8+: Add ImageOutput, VideoOutput without refactoring
```

**Rationale:**
- Foundation for multi-platform support (browser, image, video)
- Prevents refactoring later
- Effort: 1-2 days in Phase 1
- Benefit: Future-proof architecture

---

## Implementation Quality Standards

### Coverage Requirements
- Line coverage: 95%+ (exceeding 99% currently)
- Branch coverage: 90%+ (exceeding 94% currently)
- All edge cases tested (NaN, Infinity, null, zero, empty, etc.)

### Code Patterns
- Method chaining returns `this` for fluent API
- Static methods create new objects (no mutation)
- Instance methods mutate self and return `this`
- Comprehensive JSDoc with `@example` blocks
- Descriptive error messages

### Testing Strategy
- Unit tests for each component
- Integration tests for layer interactions
- Edge case and error condition coverage
- Cleanup verification for resources

---

## Future Extensions (Phase 2+)

**Phase 2:** Geometry and primitive shapes
**Phase 3:** Lighting system and material variants
**Phase 4:** Shader utilities (load from file, validation, caching)
**Phase 5-7:** Advanced features (shadows, post-processing, etc.)
**Phase 8-10:** Multi-platform support and packaging

The current architecture supports all planned extensions without refactoring.

---

## Why This Architecture Works

✅ **Clear WebGL Hierarchy:** Program = compiled resource, explicitly visible
✅ **Intuitive User API:** "I created a Shader" makes semantic sense
✅ **Future-Proof:** Utilities added to Shader without Material refactoring
✅ **Multiple Escape Hatches:** Beginners → Advanced → Experts
✅ **Performance:** Static binding tracking avoids redundant calls
✅ **Separation of Concerns:** Each layer has clear responsibility
✅ **Resource Safety:** Self-registration + cleanup tracking
✅ **Extensible:** New resources follow the same pattern
✅ **Debuggable:** GPU query methods catch binding issues

---

## Module Organization & Folder Structure

### Design Principle: Hierarchical Organization

The codebase uses **hierarchical folder structures** to organize related types and communicate architectural intent:

- **Abstract base classes** and their **concrete implementations** are grouped in subdirectories
- This signals that abstract classes are internal implementation details, not user-facing APIs
- Only concrete implementations are re-exported from module index files

### Math Module Structure

```
src/math/
├── vectors/
│   ├── Vector.ts              # Abstract base
│   ├── Vector2.ts, Vector3.ts, Vector4.ts  # Concrete implementations
├── matrices/
│   ├── Matrix.ts              # Abstract base
│   ├── SquareMatrix.ts        # Abstract base
│   ├── Matrix2.ts, Matrix3.ts, Matrix4.ts  # Concrete implementations
├── quaternions/
│   └── Quaternion.ts          # Concrete (no abstract needed)
└── index.ts                   # Re-exports only concrete implementations
```

**User API:**
```typescript
import { Vector3, Matrix4, Quaternion } from '@webgl/math';  // ✅ User-facing
// import { Vector, Matrix } from '@webgl/math';  // ❌ Not re-exported
```

**Internal Cross-Directory Imports:**
```typescript
// Matrix2.ts in src/math/matrices/
import { Vector2 } from '../vectors/Vector2.js';
```

### Resources Module Structure

```
src/resources/
├── buffers/
│   ├── Buffer.ts              # Abstract base
│   ├── VertexBuffer.ts        # Concrete
│   ├── IndexBuffer.ts         # Concrete
│   └── [6 more specialized buffer types]
├── Program.ts                 # Single implementation (no subdirectory)
├── index.ts                   # Re-exports concrete buffer types
└── (Future: shaders/, textures/, vertexArrays/)
```

**Why Buffers Get a Subdirectory:**
- Multiple implementations of the same abstraction (9 types)
- Clear hierarchy: Buffer base → 8 specialized buffers
- Justifies dedicated subdirectory

**Why Program Doesn't:**
- Single implementation in Phase 1
- Will get a subdirectory if/when multiple Program variants exist

### Benefits of This Structure

| Aspect | Benefit |
|--------|---------|
| **Self-Documenting** | Developers immediately see what's public vs. internal |
| **Prevents Misuse** | Can't accidentally import and extend abstract bases |
| **Scalable** | Pattern applies consistently across math, resources, and future modules |
| **Maintainable** | Related code is grouped and easy to locate |
| **Future-Proof** | Supports adding more types without refactoring |

### Folder Structure Rule

**Create a subdirectory when:** You have multiple implementations of the same abstraction
- ✅ vectors/ (Vector2, Vector3, Vector4)
- ✅ matrices/ (Matrix2, Matrix3, Matrix4)
- ✅ buffers/ (VertexBuffer, IndexBuffer, etc.)
- ❌ Program.ts (single type—stays at module root)

### Future Module Organization

As the library grows, this pattern extends naturally:

```
src/
├── math/ (vectors/, matrices/, quaternions/) ✅
├── core/ (Canvas, GLContext, WebGLState, Renderer - single types)
├── resources/ (buffers/ ✅, future: shaders/, textures/, vertexArrays/)
├── geometry/ (future: primitives/ with Box, Sphere, Plane)
├── materials/ (future: basics/ with BasicMaterial, PhongMaterial)
├── scene/ (Object3D, Scene, Mesh - single types)
└── renderer/ (future: webgl/, canvas/ for backend-specific implementations)
```

---

## References

For detailed analysis and design rationale, see:
- `docs/_SUPPORTING/ARCHITECTURE_APPROVED_2026_01_29.md`
- `docs/_SUPPORTING/ARCHITECTURE_RESOURCE_LAYER_DESIGN.md`
- `docs/_SUPPORTING/PHASE1_ARCHITECTURE_DECISIONS.md`
