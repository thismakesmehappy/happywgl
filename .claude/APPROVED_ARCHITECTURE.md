# Approved Phase 1 Architecture

**Date:** January 29, 2026
**Status:** ✅ APPROVED - Ready for Implementation
**Decision:** Program (Layer 2) + Shader (Layer 2.5) + Reserved Utilities

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│ Layer 4: Scene Graph & Rendering                            │
├─────────────────────────────────────────────────────────────┤
│  Object3D ──→ Scene, Mesh                                   │
│  WebGLRenderer (iterates scene, renders Mesh)               │
└─────────────────────────────────────────────────────────────┘
                            ▲
                            │ uses
┌─────────────────────────────────────────────────────────────┐
│ Layer 3: High-Level Concepts                                │
├─────────────────────────────────────────────────────────────┤
│  Geometry (uses Buffer + VertexArray)                       │
│  Material (uses Shader, manages uniforms)                   │
│  BasicMaterial (creates Shader internally)                  │
└─────────────────────────────────────────────────────────────┘
                            ▲
                            │ uses
┌─────────────────────────────────────────────────────────────┐
│ Layer 2.5: Shader Wrapper (RESERVES UTILITIES)              │
├─────────────────────────────────────────────────────────────┤
│  Shader wraps Program                                       │
│  Phase 1: Provides user-facing API                          │
│  Phase 4+: Add load(), write(), validate(), cache()        │
│  Material takes Shader, NO REFACTORING NEEDED when utils   │
│            added                                             │
└─────────────────────────────────────────────────────────────┘
                            ▲
                            │ wraps
┌─────────────────────────────────────────────────────────────┐
│ Layer 2: GPU Resources (Direct WebGL Wrappers)              │
├─────────────────────────────────────────────────────────────┤
│  Program (wraps WebGLProgram)                               │
│  VertexArray (wraps WebGLVertexArrayObject)                 │
│  Texture (wraps WebGLTexture)                               │
│  Buffer (wraps WebGLBuffer) ← Already implemented ✅         │
│                                                              │
│  Design Pattern:                                             │
│  - Each maintains static _currentBinding tracking           │
│  - Each calls ctx.register*() for cleanup tracking          │
│  - Each provides getCurrentBinding() / getCurrentProgram()  │
└─────────────────────────────────────────────────────────────┘
                            ▲
                            │ uses
┌─────────────────────────────────────────────────────────────┐
│ Layer 1: Low-Level APIs (GLContext, WebGLState, Canvas)    │
├─────────────────────────────────────────────────────────────┤
│  GLContext (WebGL wrapper with error checking)              │
│  WebGLState (state management)                              │
│  Canvas (context creation)                                  │
└─────────────────────────────────────────────────────────────┘
```

---

## Key Design Decisions

### 1. Dual-Layer Shader Architecture

**Why this matters:**
- WebGL has Programs (compiled resources) and Shaders (source code)
- Our API should reflect this hierarchy for clarity

**The Solution:**
- **Program.ts (Layer 2):** Low-level resource wrapping WebGLProgram
  - Handles compilation and linking
  - Manages uniform/attribute location caching
  - Provides `use()` and `unused()` methods
  - Advanced users can access: `ctx.gl.useProgram(program.webGLProgram)`

- **Shader.ts (Layer 2.5):** User-facing wrapper around Program
  - For Phase 1: Just wraps Program cleanly
  - Reserves space for Phase 4+ utilities:
    - `static load(ctx, url)` - Load from file/URL
    - `static write(shader, path)` - Export source
    - `validate()` - Compile-time validation
    - `static cache` - Caching layer
  - Material takes Shader (not Program)
  - **BENEFIT:** When Phase 4 adds utilities, Material doesn't need changes!

**Mental Model:**
```typescript
// User thinks: "I created a Shader for my Material"
const shader = new Shader(ctx, vertexSource, fragmentSource);
const material = new Material(ctx, shader);  // Intuitive!

// Advanced user can drop to Program if needed
const program = new Program(ctx, vertexSource, fragmentSource);
ctx.gl.useProgram(program.webGLProgram);  // Full control

// Future: Phase 4 adds utilities to Shader, Material unaffected
const shader = await Shader.load(ctx, 'my-shader.glsl');  // Works!
const material = new Material(ctx, shader);  // Still works!
```

---

### 2. Binding State Query Pattern (Source of Truth from WebGL)

**Why this matters:**
- WebGL is the source of truth for what's actually bound
- Avoid manual tracking that can get out of sync
- Support expert users who mix library code with raw `ctx.gl` calls
- Debugging tool for catching binding issues

**The Pattern: Query WebGL State**

Each bindable resource class provides a static method to query the actual GPU state:

```typescript
class Buffer {
  /**
   * Query the currently bound buffer from WebGL (source of truth)
   * @param ctx - GLContext to query
   * @param target - Buffer target (ARRAY_BUFFER, ELEMENT_ARRAY_BUFFER, etc.)
   * @returns Currently bound WebGLBuffer or null
   */
  static queryBinding(ctx: GLContext, target: GLenum = ctx.gl.ARRAY_BUFFER): WebGLBuffer | null {
    return ctx.gl.getParameter(
      target === ctx.gl.ARRAY_BUFFER
        ? ctx.gl.ARRAY_BUFFER_BINDING
        : ctx.gl.ELEMENT_ARRAY_BUFFER_BINDING
    );
  }
}

class Program {
  /**
   * Query the currently bound program from WebGL (source of truth)
   * @param ctx - GLContext to query
   * @returns Currently bound WebGLProgram or null
   */
  static queryBinding(ctx: GLContext): WebGLProgram | null {
    return ctx.gl.getParameter(ctx.gl.CURRENT_PROGRAM);
  }
}

class VertexArray {
  /**
   * Query the currently bound VAO from WebGL (source of truth)
   * @param ctx - GLContext to query
   * @returns Currently bound WebGLVertexArrayObject or null
   */
  static queryBinding(ctx: GLContext): WebGLVertexArrayObject | null {
    return ctx.gl.getParameter(ctx.gl.VERTEX_ARRAY_BINDING);
  }
}

class Texture {
  /**
   * Query the currently bound texture from WebGL (source of truth)
   * @param ctx - GLContext to query
   * @param textureUnit - Texture unit to query (0-based, default 0)
   * @returns Currently bound WebGLTexture or null
   */
  static queryBinding(ctx: GLContext, textureUnit: number = 0): WebGLTexture | null {
    ctx.gl.activeTexture(ctx.gl.TEXTURE0 + textureUnit);
    return ctx.gl.getParameter(ctx.gl.TEXTURE_BINDING_2D);
  }
}
```

**Why Query WebGL vs Manual Tracking:**
- ✅ Always accurate - source of truth from GPU
- ✅ Works with raw `ctx.gl` calls from expert users
- ✅ No risk of getting out of sync
- ✅ Transparent to calling code
- ❌ Small performance cost (WebGL API call)
- **But:** This query is fast compared to actual GPU work, and only used when debugging/validating

**Usage Examples:**

```typescript
// Library code: bind normally
buffer.bind();

// Expert user queries state
const currently = Buffer.queryBinding(ctx, ctx.gl.ARRAY_BUFFER);
console.log(currently === buffer.webGLBuffer);  // true (always accurate)

// Expert user bypasses library
ctx.gl.bindBuffer(ctx.gl.ARRAY_BUFFER, someOtherBuffer);

// Query still accurate
const now = Buffer.queryBinding(ctx, ctx.gl.ARRAY_BUFFER);
console.log(now === someOtherBuffer);  // true (reflects actual GPU state)
```

---

### 3. GLContext Query Methods (Convenience Layer)

**Optional convenience methods in GLContext for checking what's bound:**

```typescript
class GLContext {
  /**
   * Query the currently bound buffer (source of truth from WebGL)
   * @param target - Buffer target (default: ARRAY_BUFFER)
   * @returns Currently bound WebGLBuffer or null
   */
  queryBufferBinding(target: GLenum = this._gl.ARRAY_BUFFER): WebGLBuffer | null {
    const param = target === this._gl.ARRAY_BUFFER
      ? this._gl.ARRAY_BUFFER_BINDING
      : this._gl.ELEMENT_ARRAY_BUFFER_BINDING;
    return this._gl.getParameter(param);
  }

  /**
   * Query the currently bound program (source of truth from WebGL)
   * @returns Currently bound WebGLProgram or null
   */
  queryProgram(): WebGLProgram | null {
    return this._gl.getParameter(this._gl.CURRENT_PROGRAM);
  }

  /**
   * Query the currently bound VAO (source of truth from WebGL)
   * @returns Currently bound WebGLVertexArrayObject or null
   */
  queryVAO(): WebGLVertexArrayObject | null {
    return this._gl.getParameter(this._gl.VERTEX_ARRAY_BINDING);
  }

  /**
   * Query the currently bound texture (source of truth from WebGL)
   * @param textureUnit - Texture unit to query (0-based, default 0)
   * @returns Currently bound WebGLTexture or null
   */
  queryTextureBinding(textureUnit: number = 0): WebGLTexture | null {
    this._gl.activeTexture(this._gl.TEXTURE0 + textureUnit);
    return this._gl.getParameter(this._gl.TEXTURE_BINDING_2D);
  }
}
```

**Usage - Prefer resource static methods, use GLContext convenience methods for sanity checks:**

```typescript
// Option 1: Check via resource class (recommended - clear intent)
const bound = Buffer.queryBinding(ctx, ctx.gl.ARRAY_BUFFER);

// Option 2: Check via GLContext (convenience, same result)
const bound = ctx.queryBufferBinding(ctx.gl.ARRAY_BUFFER);

// Both always return GPU source of truth
```

---

### 4. Resource Self-Registration

**Pattern:**
```typescript
class Program {
  constructor(ctx: GLContext, vertexSource: string, fragmentSource: string) {
    this.webGLProgram = ctx.createProgram(vertexSource, fragmentSource);
    ctx.registerProgram(this.webGLProgram);  // Self-register for cleanup
  }
}

// GLContext tracks all resources via register*() methods
// On dispose(), GLContext cleans up: programs, buffers, textures, vaos
```

**Benefits:**
- No coupling between resource creation and cleanup
- Each resource owns its lifecycle
- GLContext provides cleanup infrastructure

---

### 5. Five-Tier Usability

This library serves users at different levels:

**Tier 1: Beginners**
```typescript
const mesh = new Mesh(geometry, new BasicMaterial({ color: 0xff0000 }));
renderer.render(scene);  // Just works!
```

**Tier 2a: Intermediate (Standard Shaders)**
```typescript
const geometry = new BoxGeometry();
const material = new Material(ctx, new Shader(ctx, vertexSrc, fragmentSrc));
const mesh = new Mesh(geometry, material);
```

**Tier 2b: Intermediate-Advanced (Custom Shaders)**
```typescript
const customShader = new Shader(ctx, myVertexShader, myFragmentShader);
const material = new Material(ctx, customShader);
// Phase 4+: Could also use Shader.load() for file-based shaders
```

**Tier 3: Advanced (Direct Program Usage)**
```typescript
const program = new Program(ctx, vertexSrc, fragmentSrc);
program.use();
// Full control over uniforms, attributes, state
```

**Tier 4: Expert (Raw WebGL)**
```typescript
ctx.gl.useProgram(program.webGLProgram);
ctx.gl.drawElements(...);  // Direct WebGL control
```

---

## Phase 1 Remaining Implementation Order

### Batch 1: Layer 2 GPU Resources (3-4 features)

1. **Program.ts**
   - ~250 lines of code
   - Target: 95%+ line / 90%+ branch coverage
   - Key responsibilities:
     - Compile vertex + fragment shaders
     - Link into WebGL program
     - Cache uniform/attribute locations
     - Static binding tracking
     - Chainable use()/unused() methods

2. **VertexArray.ts**
   - ~200 lines of code
   - Key responsibilities:
     - Wrap WebGL VAO
     - Manage vertex attribute layout
     - setAttributePointer() method
     - setIndexBuffer() support
     - Static binding tracking

3. **Texture.ts**
   - ~150 lines of code
   - Key responsibilities:
     - Wrap WebGLTexture
     - setImage() for data upload
     - bind() with texture unit support
     - Parameter management (filters, wrapping)
     - Static binding tracking

### Batch 2: Layer 2.5 Shader Wrapper (1 feature)

4. **Shader.ts**
   - ~100 lines of code
   - **Phase 1 ONLY:**
     - Wraps Program instance
     - Constructor takes Program or creates one
     - Delegates use() to program
     - Provides getUniformLocation(), getAttributeLocation()
   - **Phase 4+ RESERVED SPACE FOR:**
     - `static async load(ctx, url): Promise<Shader>`
     - `async write(path): Promise<void>`
     - `validate(): ValidationResult`
     - `private static cache: Map<string, Shader>`

### Batch 3: Layer 3 High-Level Concepts (3 features)

5. **Geometry.ts**
   - ~300 lines of code
   - Creates Buffer + VertexArray internally
   - Configures vertex layout
   - Provides: getVertexArray(), getIndexBuffer(), getVertexCount()

6. **Material.ts**
   - ~250 lines of code
   - Takes Shader instance (not Program!)
   - Manages uniform values
   - use() orchestrates: shader.use() + uniforms upload + state setup
   - Manages WebGL state via WebGLState

7. **BasicMaterial.ts**
   - ~100 lines of code
   - Extends Material
   - Creates Shader internally with basic shaders
   - Provides color management

### Batch 4: Layer 4 Scene Graph (4 features)

8. **Object3D.ts** - Transform hierarchy
9. **Scene.ts** - Container for objects
10. **Mesh.ts** - Combines Geometry + Material
11. **WebGLRenderer.ts** - Renders Scene

---

## Why This Architecture Works

✅ **Clear WebGL Hierarchy:** Program = compiled resource (not hidden)
✅ **Intuitive User API:** "I created a Shader" makes sense
✅ **Future-Proof:** Shader utilities added without Material refactoring
✅ **Multiple Escape Hatches:** Beginners → Advanced → Experts
✅ **Performance:** Static binding tracking avoids redundant calls
✅ **Separation of Concerns:** Each layer has one responsibility
✅ **Resource Safety:** Self-registration + GLContext cleanup tracking
✅ **Extensible:** New resources just follow the same pattern

---

## Implementation Notes

### Static Binding Tracking Caution

Static binding state is shared across all instances of a resource type:
```typescript
class Program {
  private static _currentBinding: WebGLProgram | null = null;

  // This is shared across ALL Program instances!
  // If you have two programs and only track current binding,
  // the second program doesn't know the first is still "bound"

  // For Phase 1: This is fine
  // Material binds ONE program per render
  // Only one program ever "current" at a time
}
```

**When to be careful:** If implementing multi-pass rendering or advanced techniques, track bindings per target or use GLContext-level tracking instead.

---

## Files to Create (Phase 1)

```
src/resources/
├── Program.ts       ← New (Layer 2)
├── Shader.ts        ← New (Layer 2.5)
├── VertexArray.ts   ← New (Layer 2)
├── Texture.ts       ← New (Layer 2)
└── Buffer.ts        ← Exists ✅

src/geometry/
├── Geometry.ts      ← New (Layer 3)
└── index.ts

src/materials/
├── Material.ts      ← New (Layer 3)
├── BasicMaterial.ts ← New (Layer 3)
└── index.ts

src/scene/
├── Object3D.ts      ← New (Layer 4)
├── Scene.ts         ← New (Layer 4)
├── Mesh.ts          ← New (Layer 4)
└── index.ts

src/renderer/
├── WebGLRenderer.ts ← New (Layer 4)
└── index.ts
```

---

## Next Steps

1. ✅ **Architecture Approved** - This document
2. ⏭️ **Implement Program.ts** - First Layer 2 resource
3. ⏭️ **Implement Shader.ts** - Wraps Program, reserves utilities
4. ⏭️ **Implement Layer 2 resources** - VertexArray, Texture
5. ⏭️ **Implement Layer 3 concepts** - Geometry, Material, BasicMaterial
6. ⏭️ **Implement Layer 4 scene graph** - Object3D, Scene, Mesh, WebGLRenderer

Each feature is tested to 95%+ line / 90%+ branch coverage before moving to the next.

---

## Reference Documents

- `.claude/PHASE1_RESOURCE_ARCHITECTURE_DECISIONS.md` - Detailed analysis of design choices
- `CLAUDE.md` - Updated with approved architecture
- `RESOURCE_ARCHITECTURE.md` - Will be updated to reflect Program vs Shader distinction
