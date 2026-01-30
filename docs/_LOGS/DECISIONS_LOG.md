# Decisions Log

**Purpose:** Record of architectural and strategic decisions with dates and rationale

---

## January 30, 2026

### Documentation Reorganization Approved
**Decision:** Consolidate 16 fragmented documents into modular structure with root-level sources of truth

**Rationale:**
- DOCUMENTATION_ARCHITECTURE.md identified fragmentation across root and .claude/ directories
- Single source of truth needed for architecture decisions, tasks, and roadmap
- Supporting materials should be clearly labeled as learning resources, not authoritative

**Changes:**
- Created root-level `ARCHITECTURE.md` as primary architecture source
- Updated `PLAN.md` to reference `ARCHITECTURE.md` and explain Program vs Shader
- Restructured `TODO.md` to be cumulative across all 10 phases with inline status
- Added Quick Navigation to `CLAUDE.md` referencing all documents
- Created `/docs/` subdirectory structure:
  - `/docs/_SUPPORTING/` - Learning materials and detailed references
  - `/docs/_ARCHIVE/` - Completed/superseded documents
  - `/docs/_LOGS/` - Decision records and maintenance procedures
- Moved 7 supporting docs to `/docs/_SUPPORTING/` with renamed titles
- Moved 3 archived docs to `/docs/_ARCHIVE/`
- Removed `.claude/` directory after moving all content

**Impact:** Documentation now has clear hierarchy with explicit sources of truth

---

## January 29, 2026

### Dual-Layer Shader Architecture (Program + Shader)
**Decision:** Implement both Program (Layer 2) and Shader (Layer 2.5) instead of just one

**Design:**
- **Program.ts (Layer 2):** Low-level WebGL program wrapper
  - Compilation and linking of shader source
  - Location caching for uniforms and attributes
  - For advanced users needing direct control

- **Shader.ts (Layer 2.5):** User-facing wrapper around Program
  - Phase 1: Delegates to Program
  - Phase 4+: Adds utilities (load from file, validate, cache) without requiring Material refactoring
  - Material takes Shader (not Program)

**Rationale:**
- Reflects WebGL's actual hierarchy (Programs are compiled resources, Shaders are source)
- User-intuitive API: "I created a Shader for my Material"
- Future-proof: Phase 4 utilities added to Shader don't require Material changes
- Multiple escape hatches: beginners use Material, advanced users use Program directly

**Impact:** Clean separation with Phase 4+ extensibility built in

---

### Binding State Query Pattern (Source of Truth from GPU)
**Decision:** Each resource provides static `queryBinding()` method to get actual GPU state

**Implementation:**
```typescript
const bound = Buffer.queryBinding(ctx, ctx.gl.ARRAY_BUFFER);  // GPU source of truth
const program = Program.queryBinding(ctx);
const vao = VertexArray.queryBinding(ctx);
```

**Rationale:**
- Always accurate (source of truth from GPU)
- Works when expert users mix library code with raw `ctx.gl` calls
- No risk of getting out of sync
- Great for debugging and validation

**Impact:** Expert users fully supported, library can detect binding state issues

---

### Material Architecture: Design A (Shader + Uniforms)
**Decision:** Each Material owns its Shader instance and manages uniforms

**Design:**
```typescript
class Material {
  shader: Shader;
  uniforms: { color: Vec4, shininess: number, ... };

  use() {
    this.shader.use();
    ctx.gl.uniform4f(colorLoc, ...this.uniforms.color);
  }
}
```

**Rationale:**
- Clear and intuitive: Material = shader + properties
- Flexible: Different materials can use different shaders
- Lighting: Lights passed as uniforms to shader
- Phase 3: Can add shared lighting support if needed

**Alternatives Rejected:**
- Design B (shared shader): Less flexible, requires complex generic shader handling
- Design C (hybrid): More complex for Phase 1, can adopt later if needed

**Impact:** Simple, clear API that supports material variants

---

### State Management: Simple Approach (Phase 1)
**Decision:** Keep state management straightforward for Phase 1

**Approach:**
- Material receives `ctx` in constructor
- Material.use() calls `ctx.state.enableBlend()` etc.
- Each material responsible for setting state it needs
- No per-material state restoration
- No complex state tracking

**Rationale:**
- Explicit is better than implicit
- Simpler renderer implementation
- Sufficient for Phase 1
- Can add state restoration in Phase 3+ if advanced techniques need it

**Impact:** Clear material code, simpler renderer, can be enhanced later

---

### OutputTarget Abstraction in Phase 1
**Decision:** Include light OutputTarget abstraction in Phase 1, not defer to Phase 9+

**Design:**
```typescript
interface OutputTarget {
  getContext(): WebGL2RenderingContext;
  render(drawFunction: () => void): void;
}

class CanvasOutput implements OutputTarget { }
// Phase 9+: Add ImageOutput, VideoOutput
```

**Rationale:**
- Foundation for multi-platform support (browser, image, video)
- Prevents refactoring when Phase 9 adds more output types
- Effort: 1-2 days in Phase 1
- Benefit: Future-proof architecture

**Impact:** Renderer accepts OutputTarget, ready for Phase 9 multi-platform features

---

### Program Constructor Signature
**Decision:** Program accepts shader source strings, not Shader objects

**Constructor:**
```typescript
new Program(ctx, vertexSource: string, fragmentSource: string)
```

**Rationale:**
- Program compiles and links shaders (compile-time resource)
- Shader.ts (Layer 2.5) wraps Program for user-facing API
- Phase 4+: Shader.ts adds utilities (load from file, validate, cache)
- No circular dependency
- Clear layer separation

**How It Works:**
```typescript
// User API (most common)
const shader = new Shader(ctx, vertexSrc, fragmentSrc);
const material = new Material(ctx, shader);

// Advanced users use Program directly
const program = new Program(ctx, vertexSrc, fragmentSrc);
program.use();
```

**Impact:** Clean API for users, escape hatch for advanced developers

---

### Resource Self-Registration Pattern
**Decision:** Each resource registers itself with GLContext for automatic cleanup

**Pattern:**
```typescript
class Program {
  constructor(ctx: GLContext, vertexSource: string, fragmentSource: string) {
    this.webGLProgram = ctx.createProgram(vertexSource, fragmentSource);
    ctx.registerProgram(this.webGLProgram);  // Self-register
  }
}
```

**Rationale:**
- No coupling between resource creation and cleanup
- Each resource owns its lifecycle
- GLContext provides infrastructure, not enforcement
- Prevents memory leaks naturally

**Impact:** Simple, clean resource management

---

### Static Binding Tracking (Performance Optimization)
**Decision:** Each Layer 2 resource maintains static `_currentBinding` to avoid redundant calls

**Pattern:**
```typescript
class Buffer {
  private static _currentBinding: Map<GLenum, WebGLBuffer | null> = new Map();

  bind(target: GLenum = this.target): this {
    if (this._currentBinding.get(target) === this.webGLBuffer) {
      return this;  // Already bound, skip redundant call
    }
    // ...bind to GPU...
  }
}
```

**Rationale:**
- Avoids redundant WebGL calls (performance win)
- Small memory cost for significant perf gain
- Phase 1 appropriate (single program/material per render)
- Phase 7+ can use fancier tracking if needed

**Impact:** Performance optimization built into foundation

---

## Design Principles (Approved January 29, 2026)

### Five-Tier Usability

The API is designed to serve users at different expertise levels without forcing abstraction levels:

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

---

## Future Decisions Deferred

### Lighting System (Phase 3 Planning)
**Questions to resolve during Phase 3 planning:**
- How many lights per scene/shader?
- Should lights be uniforms array in shader?
- Lit vs unlit materials - different shaders or conditionals?
- Materials that emit light?

**Approach:** Research progressively as we build Phase 2 geometry system

---

### Animation System (Phase 6 Planning)
**Deferred to Phase 6 planning.** Will analyze design requirements when planning that phase.

---

**Last Updated:** January 30, 2026
