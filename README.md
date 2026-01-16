# WebGL Graphics Library

A modular TypeScript WebGL graphics library built from scratch, designed for learning and practical use.

## Overview

This library provides a clean, modular API for WebGL graphics programming, similar to three.js but built from the ground up. It's designed with education in mind, featuring extensive documentation and comments to help understand graphics programming concepts.

## Status

🚧 **In Development** - Currently in planning phase. See [PLAN.md](./PLAN.md) for the complete development roadmap.

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

## Development Plan

See [PLAN.md](./PLAN.md) for the complete development roadmap and architecture details.

## License

[To be determined]
