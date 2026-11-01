# Auto Empire Tycoon 3D — Third-party 3D asset licenses

## Kenney (CC0 1.0 Universal)
Original publisher: [Kenney Car Kit](https://kenney.nl/assets/car-kit), [Kenney Furniture Kit](https://kenney.nl/assets/furniture-kit), [Kenney Nature Kit](https://kenney.nl/assets/nature-kit).
- Imported GLB files are sourced from the [Tiny Game Engine CC0 asset mirror](https://github.com/Hidencod/tge-assets), which identifies the original Kenney packs and the CC0-1.0 license in catalog.json.
- Car Kit: sedan, hatchback-sports, suv-luxury, race, delivery-flat.
- Furniture Kit: loungedesignsofa, tablecoffeeglass, pottedplant.
- Nature Kit: plant-bushdetailed.
- All models are locally hosted under `assets/kenney-*.glb`. No runtime request goes to the source mirror.
- License: CC0 1.0 Universal: https://creativecommons.org/publicdomain/zero/1.0/
- Optional credit: 3D assets by Kenney.nl, CC0.

## Three.js GLTFLoader (MIT)
- `vendor/GLTFLoader-r128.js` is the unmodified [Three.js r128 GLTFLoader](https://github.com/mrdoob/three.js/blob/r128/examples/js/loaders/GLTFLoader.js).
- Three.js MIT License: https://github.com/mrdoob/three.js/blob/r128/LICENSE

If models are replaced, recheck the source license and maintain this inventory. Do not redistribute unverified paid models or scraped copyrighted cars.

## Kenney Mini Characters (CC0 1.0 Universal), V11
- Original: https://kenney.nl/assets/mini-characters
- CC0 source mirror: https://github.com/Hidencod/tge-assets (packs/mini-characters/)
- Locally bundled: character-male-a, character-male-c, character-female-b and character-female-e (kenney-npc-*.glb).
- The files include their own rigged meshes and animation clips; no external animation service is used.

## Three.js SkeletonUtils r128 (MIT), V11
- `vendor/SkeletonUtils-r128.js` is copied from https://github.com/mrdoob/three.js/blob/r128/examples/js/utils/SkeletonUtils.js and remains under the Three.js MIT license.

## V12 Kenney Living City models (CC0 1.0 Universal)
Original creator: [Kenney](https://kenney.nl/) • License: https://creativecommons.org/publicdomain/zero/1.0/
Original packs: [City Kit (Commercial)](https://kenney.nl/assets/city-kit-commercial), [City Kit (Suburban)](https://kenney.nl/assets/city-kit-suburban), [City Kit (Roads)](https://kenney.nl/assets/city-kit-roads), [Nature Kit](https://kenney.nl/assets/nature-kit).
Model GLBs copied from the [tge-assets CC0 Kenney mirror](https://github.com/Hidencod/tge-assets), with original paths listed below.
- `assets/city-commercial-a.glb` ← `packs/city-kit-commercial/building-a.glb`
- `assets/city-commercial-c.glb` ← `packs/city-kit-commercial/building-c.glb`
- `assets/city-commercial-g.glb` ← `packs/city-kit-commercial/building-g.glb`
- `assets/city-commercial-h.glb` ← `packs/city-kit-commercial/building-h.glb`
- `assets/city-suburban-h.glb` ← `packs/city-kit-suburban/building-type-h.glb`
- `assets/city-tree-oak.glb` ← `packs/nature-kit/tree-oak.glb`
- `assets/city-tree-detailed.glb` ← `packs/nature-kit/tree-detailed.glb`
- `assets/city-streetlight.glb` ← `packs/city-kit-roads/light-curved.glb`
- `assets/city-traffic-light.glb` ← `packs/city-kit-roads/traffic-light.glb`
All V12 GLB files are hosted locally and cache-versioned by `tools/build.py`. Attribution not required by CC0; credits are maintained for provenance.
