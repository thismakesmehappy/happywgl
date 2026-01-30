# Phase 1 Resource Architecture - Critical Decisions

**Date:** January 29, 2026
**Status:** Planning - Awaiting Decisions Before Implementation
**Focus:** Clarifying Layer 2 GPU Resource Design

---

## The Question: Program vs Shader

During GLContext resource registration system implementation, a critical architectural question emerged:

**Current Documentation Says:**
- Implement `Shader.ts` to wrap shader compilation and program management
- Shader manages uniform/attribute location caching
- Shader provides `use()` method and state management

**New Question:**
- **Shouldn't it be the other way around?**
- A WebGL Program IS the compiled resource (not just a feature)
- Shader sources are inputs; Program is the output
- Why should Shader wrap Program instead of Program being the Layer 2 resource?

---

## Conceptual Model

### Previous Model (Initial Documentation)
```
Layer 2 Resources:
├── Buffer      (wraps WebGLBuffer)
├── Shader      (wraps WebGLProgram internally)
├── VertexArray (wraps WebGLVertexArrayObject)
└── Texture     (wraps WebGLTexture)

Problem: Shader name doesn't reflect that it wraps compiled Program
```

### APPROVED Model (WebGL Hierarchy + Reserved Abstraction)
```
Layer 2: GPU Resources (Direct WebGL Wrappers)
├── Buffer        (wraps WebGLBuffer)
├── Program       (wraps WebGLProgram) ← Compiled resource
├── VertexArray   (wraps WebGLVertexArrayObject)
└── Texture       (wraps WebGLTexture)

Layer 2.5: Shader Wrapper (Reserves Abstraction for Future Utilities)
├── Shader        (wraps Program + reserves for: load, write, validate, cache)
└── BasicShader   (optional - pre-built shaders like BasicShader.basic())

Layer 3: High-Level Concepts
├── Material      (uses Shader + manages uniforms)
├── Geometry      (uses Buffer + VertexArray + manages layout)
└── BufferGeometry (specialization of Geometry)

Layer 4: Scene Graph
├── Object3D      (transform, hierarchy)
├── Mesh          (Object3D + Geometry + Material)
├── Scene         (container for objects)
└── WebGLRenderer (renders Scene)

User API:
├── new Buffer(ctx, target, usage)           ← Layer 2
├── new Program(ctx, vertexSource, fragment) ← Layer 2 (advanced)
├── new Shader(ctx, vertexSource, fragment)  ← Layer 2.5 (user-facing)
├── new VertexArray(ctx)                     ← Layer 2 (advanced)
├── new Texture(ctx)                         ← Layer 2 (advanced)
├── new Material(ctx, shader)                ← Layer 3
├── new Mesh(geometry, material)             ← Layer 4
└── renderer.render(scene)                   ← Layer 4
```

**Rationale:**
- Program is the low-level, direct WebGL resource (Layer 2)
- Shader wraps Program, provides high-level API, reserves space for utilities (Layer 2.5)
- Material uses Shader, doesn't need refactoring when shader utilities are added (Phase 4+)
- Clean mental model: "I created a Shader for my Material" makes intuitive sense

---

## Key Architectural Questions

### Question 1: Is There a Program Class at Layer 2?

**Option A: Yes - Program is a Layer 2 Resource**
```typescript
// src/resources/Program.ts
class Program {
  private ctx: GLContext;
  private program: WebGLProgram;
  private uniformLocations: Map<string, GLint>;
  private attributeLocations: Map<string, GLint>;

  constructor(ctx: GLContext, vertexSource: string, fragmentSource: string) {
    this.program = ctx.createProgram(vertexSource, fragmentSource);
    ctx.registerProgram(this.program);
  }

  use(): this { /* ... */ }
  getUniformLocation(name: string): GLint { /* ... */ }
  getAttributeLocation(name: string): GLint { /* ... */ }
  static getCurrentProgram(): WebGLProgram | null { /* ... */ }
  dispose(): void { /* ... */ }
}
```

**Option B: No - Shader Wraps Program Internally**
```typescript
// src/resources/Shader.ts
class Shader {
  private ctx: GLContext;
  private program: WebGLProgram;  // Internal detail
  private uniformLocations: Map<string, GLint>;
  private attributeLocations: Map<string, GLint>;

  constructor(ctx: GLContext, vertexSource: string, fragmentSource: string) {
    this.program = ctx.createProgram(vertexSource, fragmentSource);
    ctx.registerProgram(this.program);
  }

  use(): this { /* ... */ }
  getUniformLocation(name: string): GLint { /* ... */ }
  getAttributeLocation(name: string): GLint { /* ... */ }
  dispose(): void { /* ... */ }
}
```

**Implications:**

| Aspect | Option A (Program) | Option B (Shader) |
|--------|-------------------|-------------------|
| **Layer 2 resources** | Buffer, Program, Texture, VertexArray | Buffer, Shader, Texture, VertexArray |
| **Clarity** | WebGL hierarchy is clear (Program IS compiled) | Names are less clear (Shader contains Program) |
| **Advanced Users** | Can use Program directly at Layer 2 | Program is hidden inside Shader |
| **Material.ts** | `new Material(ctx, program)` | `new Material(ctx, shader)` |
| **Escape Hatch** | GLContext.createProgram() still available | GLContext.createProgram() still available |
| **Future** | Clear separation: Program (compile), Shader (features) | May need refactoring later |

---

### Question 2: What Goes in Layer 3 Materials?

Depending on the answer above, Material.ts will work differently:

**If Program is Layer 2:**
```typescript
// src/materials/Material.ts
class Material {
  protected program: Program;  // Layer 2 resource
  protected uniforms: Map<string, any>;

  constructor(ctx: GLContext, program: Program) {
    this.program = program;
  }

  use(ctx: GLContext): void {
    this.program.use();  // Bind program
    // Upload uniforms...
  }
}
```

**If Shader is Layer 2:**
```typescript
// src/materials/Material.ts
class Material {
  protected shader: Shader;  // Layer 2 resource
  protected uniforms: Map<string, any>;

  constructor(ctx: GLContext, shader: Shader) {
    this.shader = shader;
  }

  use(ctx: GLContext): void {
    this.shader.use();  // Bind shader
    // Upload uniforms...
  }
}
```

---

### Question 3: Resource Tracking - Static Methods vs GLContext Tracking

This is independent of Question 1, but relevant for design.

**Proposed Decision: Static Methods in Each Resource**

```typescript
class Buffer {
  private static _currentBinding: WebGLBuffer | null = null;

  bind(): this {
    if (Buffer._currentBinding === this.buffer) return this;  // Skip redundant call
    this.ctx.gl.bindBuffer(this.target, this.buffer);
    Buffer._currentBinding = this.buffer;
    return this;
  }

  static getCurrentBinding(): WebGLBuffer | null {
    return Buffer._currentBinding;
  }
}

// Similarly for Program/Shader, VertexArray, Texture
class Program {
  private static _currentBinding: WebGLProgram | null = null;

  use(): this {
    if (Program._currentBinding === this.program) return this;
    this.ctx.gl.useProgram(this.program);
    Program._currentBinding = this.program;
    return this;
  }

  static getCurrentProgram(): WebGLProgram | null {
    return Program._currentBinding;
  }
}
```

**Benefits:**
- ✅ Each resource owns its binding state
- ✅ No coupling to GLContext
- ✅ Enables optimization: skip redundant WebGL calls
- ✅ Easy debugging: `Buffer.getCurrentBinding()`, `Program.getCurrentProgram()`
- ✅ No global state in GLContext (keeps it lightweight)

**Risks:**
- ❌ Static state can be fragile (shared across all instances)
- ❌ Harder to reset if WebGL context is lost (can mitigate with reset() method)

---

## Phase 1 Implementation Order (APPROVED)

### Architecture: Program (Layer 2) + Shader (Layer 2.5) + Utilities Reserved

This implements both Program and Shader, with Shader wrapping Program and reserving space for future utilities (load, write, validate, cache) that will be revealed during Phase 4 Material System development.

**Phase 1 Remaining Implementation (In Order):**

1. **Program.ts** (Layer 2 - Low-level Resource)
   - Wraps WebGLProgram compilation directly
   - Manages uniform/attribute location caching
   - Provides use() / unused() methods
   - Static _currentBinding tracking for optimization
   - Registers with GLContext for cleanup
   - ~250 lines of code
   - Target: 95%+ line coverage, 90%+ branch coverage

2. **Shader.ts** (Layer 2.5 - User-Facing Wrapper)
   - Wraps Program instance
   - Provides cleaner API for users ("I created a Shader")
   - Reserves space for future utilities:
     - `static load(ctx, url)` - Load from file/URL (Phase 4+)
     - `static write(shader, path)` - Export shader (Phase 4+)
     - `validate()` - Compile-time validation (Phase 4+)
     - Caching layer (Phase 4+)
   - For Phase 1: Just wraps Program, no utilities yet
   - ~100 lines of code

3. **VertexArray.ts** (Layer 2 - GPU Resource)
   - Wraps WebGL VAO
   - Manages vertex attribute layout
   - setAttributePointer(index, buffer, size, type, stride, offset)
   - setIndexBuffer(indexBuffer) support
   - Static _currentBinding tracking
   - Provides bind() / unbind() methods
   - ~200 lines of code

4. **Texture.ts** (Layer 2 - GPU Resource)
   - Wraps WebGLTexture
   - setImage(imageData, width, height) method
   - bind(textureUnit) with unit tracking
   - Static _currentBinding tracking
   - Parameter management (filters, wrapping)
   - ~150 lines of code

5. **Geometry.ts** (Layer 3 - Uses Layer 2)
   - Creates Buffer instances internally for vertex data
   - Creates VertexArray instance internally
   - Configures vertex attribute layout (position, normal, UV, etc.)
   - Provides getVertexArray() / getIndexBuffer() / getVertexCount()
   - No direct shader knowledge (Material handles that)
   - ~300 lines of code

6. **Material.ts** (Layer 3 - High-Level Concept)
   - Takes Shader instance in constructor
   - Manages uniform values (stored internally)
   - Manages WebGL state via WebGLState (blend, depth, cull, etc.)
   - use(ctx) method orchestrates:
     - shader.use() - binds program
     - Upload uniforms to GPU
     - Set render state
   - dispose() for cleanup
   - ~250 lines of code

7. **BasicMaterial.ts** (Layer 3 - Concrete Material)
   - Extends Material
   - Creates Shader internally with basic vertex/fragment shaders
   - Provides color management (setColor, getColor)
   - No complexity - mostly just defines shader source strings
   - ~100 lines of code

8. **Object3D.ts** (Layer 4 - Scene Graph)
   - Transform management (position, rotation, scale)
   - Matrix calculations (local to world space)
   - Parent/child hierarchy (for Scene later)
   - Provides getWorldMatrix(), getLocalMatrix()
   - ~200 lines of code

9. **Scene.ts** (Layer 4 - Container)
   - Extends Object3D
   - Container for objects (add, remove, traverse)
   - Simple tree structure for scene graph
   - ~150 lines of code

10. **Mesh.ts** (Layer 4 - Renderable)
    - Extends Object3D
    - Takes Geometry + Material in constructor
    - Orchestrates rendering:
      - Calls material.use(ctx)
      - Calls geometry.getVertexArray().bind()
      - Calls ctx.gl.drawElements()
    - ~150 lines of code

11. **WebGLRenderer.ts** (Layer 4 - Rendering Pipeline)
    - Takes GLContext in constructor
    - render(scene, camera) method
    - Iterates scene graph, renders each Mesh
    - Handles viewport, clear
    - Basic animation loop support
    - ~250 lines of code

---

## Key Design Decisions (APPROVED)

### 1. Dual-Layer Shader Architecture
- **Program** = Low-level, direct WebGL resource (Layer 2)
  - Advanced users can use directly: `ctx.gl.useProgram(program.program)`
  - Transparent compilation with error handling

- **Shader** = User-facing wrapper (Layer 2.5)
  - Reserved for future utilities (load, write, validate, cache)
  - Material takes Shader, not Program
  - Clean mental model: "I created a Shader for my Material"

### 2. Static Binding Tracking
- Each resource type tracks its own current binding state
- Enables optimization: skip redundant WebGL calls
- Query methods: `Buffer.getCurrentBinding()`, `Program.getCurrentProgram()`
- Decoupled from GLContext (no coupling)

### 3. Resource Self-Registration
- Each resource calls `ctx.register*()` during construction
- GLContext handles cleanup via dispose()
- No creation methods in lower layers create confusion

### 4. Three-Tier Usability
- **Tier 1 (Beginners):** Use Mesh + BasicMaterial
- **Tier 2a (Intermediate):** Use Material + Geometry with built-in shaders
- **Tier 2b (Intermediate-Advanced):** Create custom Shader, use with Material
- **Tier 3 (Advanced):** Use Program directly, manage render state manually
- **Tier 4 (Expert):** Use GLContext.gl directly for full WebGL control

---

## Future Extensibility (Phase 4+)

When Phase 4 Material System is built, Shader utilities can be added to Layer 2.5:

```typescript
// Phase 4+ additions to Shader.ts
class Shader {
  private program: Program;

  // Phase 1 - just wraps Program
  constructor(ctx, vertexSource, fragmentSource) { ... }

  // Phase 4+ - add as Material System reveals what's needed
  static async load(ctx: GLContext, url: string): Promise<Shader> {
    const { vertex, fragment } = await fetch(url).then(r => r.json());
    return new Shader(ctx, vertex, fragment);
  }

  async write(path: string): Promise<void> {
    // Export shader source to file
  }

  validate(): ValidationResult {
    // Compile-time validation of shader
  }

  // Caching layer
  private static cache: Map<string, Shader> = new Map();
  static getOrCreate(ctx, key, sources) { ... }
}
```

Material doesn't need any changes - it already uses Shader abstraction.

---

## Summary

**The approved architecture cleanly separates concerns:**
1. **Program** handles WebGL program compilation (Layer 2)
2. **Shader** provides user-facing API and reserves utilities (Layer 2.5)
3. **Material** uses Shader and manages uniforms (Layer 3)
4. **Geometry** uses Layer 2 resources, no shader knowledge (Layer 3)
5. **Scene Graph** orchestrates rendering (Layer 4)

**Benefits:**
- ✅ WebGL hierarchy is clear (Program = compiled resource)
- ✅ User-facing API is intuitive ("I created a Shader")
- ✅ Future utilities can be added without Material refactoring
- ✅ Advanced users have Program escape hatch
- ✅ Experts can use GLContext.gl directly
- ✅ Clear separation of concerns at each layer

