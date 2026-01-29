# WebGL Graphics Library

A modular TypeScript WebGL graphics library built from scratch, designed for learning and practical use.

## Overview

This library provides a clean, modular API for WebGL graphics programming, similar to three.js but built from the ground up. It's designed with education in mind, featuring extensive documentation and comments to help understand graphics programming concepts.

## Status

🚧 **In Development** - Currently implementing Phase 1 (Core MVP). 

**Completed:**
- ✅ Math primitives (Vectors, Matrices, Quaternions) - 99%+ test coverage
- ✅ Comprehensive test suite

**Next Up:**
- 🚧 Core rendering infrastructure (Canvas, GLContext, Renderer)
- 🚧 GPU resources (Buffers, Shaders, Textures)
- 🚧 Geometry system
- 🚧 Basic rendering pipeline

See [PLAN.md](./PLAN.md) for the complete development roadmap and [HANDOFF.md](./HANDOFF.md) for handoff documentation.

## Features (Planned)

### Core
- ✅ Canvas and WebGL 2 context management
- ✅ Modular architecture with tree-shaking support
- ✅ TypeScript with strict type checking

### Geometry
- Primitive shapes (Box, Sphere, Plane, Cylinder, Torus)
- Bezier curves and surfaces
- Catmull-Rom splines
- Superellipsoids
- Rotational solids

### Scene Management
- Hierarchical scene graph
- Camera system (Perspective, Orthographic)
- Transform hierarchy

### Lighting & Materials
- Multiple light types (Ambient, Directional, Point, Spot)
- Lambert and Phong shading
- Texture support
- Mirror/reflective materials

### Animation
- Keyframe animation system
- Time-based animations
- Animation mixing

### Asset Loading
- OBJ loader
- glTF 2.0 loader

## Project Structure

```
webgl/
├── src/              # Source code
├── examples/         # Example projects
├── tests/            # Unit tests
├── docs/             # Documentation
└── dist/             # Build output
```

## Documentation

- **[PLAN.md](./PLAN.md)** - Complete development roadmap and architecture details
- **[HANDOFF.md](./HANDOFF.md)** - Comprehensive handoff documentation for taking over the project
- **[HANDOFF_PROMPT.md](./HANDOFF_PROMPT.md)** - Template prompts for effective handoff with AI assistants
- **[TODO.md](./TODO.md)** - Quick-reference TODO list

## Development Plan

See [PLAN.md](./PLAN.md) for the complete development roadmap and architecture details.

## License

[To be determined]
