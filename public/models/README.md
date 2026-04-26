# Ship Model Placement

Drop your FBX file here as:

```
public/models/ship.fbx
```

## Integration Steps (when ready)

1. Install Three.js + react-three-fiber:
   ```bash
   pnpm add three @react-three/fiber @react-three/drei
   pnpm add -D @types/three
   ```

2. Replace `src/scenes/ShipScene.tsx` with a Three.js canvas that:
   - Loads `ship.fbx` using `useGLTF` or `useFBX` from `@react-three/drei`
   - Adds an `OceanShader` (from THREE.Water) for realistic animated ocean
   - Bobs the ship gently using a sine animation in `useFrame`
   - Uses `EnvironmentMap` for metallic reflections

3. The section id `ship-scene` and the bottom gradient fade are already set up.
