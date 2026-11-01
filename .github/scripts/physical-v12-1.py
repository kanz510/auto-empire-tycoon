from pathlib import Path

def replace_once(path, old, new):
    p=Path(path)
    content=p.read_text()
    matches=content.count(old)
    if matches != 1:
        raise RuntimeError(f"{path}: expected one matching anchor, got {matches}: {old[:110]}")
    p.write_text(content.replace(old,new))

replace_once("src/graphics.js",
    "ren.outputEncoding=THREE.sRGBEncoding;document.body.prepend(ren.domElement);",
    "ren.outputEncoding=THREE.sRGBEncoding;ren.toneMapping=THREE.ACESFilmicToneMapping;ren.toneMappingExposure=1.15;document.body.prepend(ren.domElement);")

replace_once("src/graphics.js",
    "fl.material=new THREE.MeshStandardMaterial({map:tex,roughness:.12,metalness:.25});",
    "fl.material=new THREE.MeshStandardMaterial({map:tex,roughness:.22,metalness:.12,envMapIntensity:1.0});")

replace_once("src/assets-3d.js",
    "const mat=source.clone();mat.map=map;paintMaterialCache.set(id,mat);",
    """// Preserve the hashed Kenney colormap so the body retains the requested
 // color while windows, lamps and wheel meshes keep their original UVs.
 // Clearcoat affects the car paint only, not the whole vehicle.
 const mat=new THREE.MeshPhysicalMaterial();mat.copy(source);
 mat.map=map;
 mat.metalness=.75;mat.roughness=.18;
 mat.clearcoat=1.0;mat.clearcoatRoughness=.04;
 paintMaterialCache.set(id,mat);""")

replace_once("src/assets-3d.js",
    "function applyVehicleAsset(root,k,col){",
    """// Only distinct glass/chrome meshes may receive separate physical materials.
 // Kenney's current 'body' mesh also contains mapped windows: never turn
 // that entire mesh transparent (it would destroy the per-car paint atlas).
const premiumGlassCache=new WeakMap(),premiumChromeCache=new WeakMap();
function upgradeVehicleSurface(node){
 if(!node.isMesh||!node.material||Array.isArray(node.material))return;
 const name=(node.name||'').toLowerCase();
 const source=node.material,matName=(source.name||'').toLowerCase();
 if(/glass|window/.test(name)){
  let mat=premiumGlassCache.get(source);
  if(!mat){
   mat=new THREE.MeshPhysicalMaterial();mat.copy(source);
   mat.color.setHex(0x112233);
   mat.transparent=true;mat.opacity=.65;mat.transmission=.85;
   mat.ior=1.5;mat.roughness=.05;mat.metalness=.1;mat.depthWrite=false;
   premiumGlassCache.set(source,mat);
  }
  node.material=mat;
 }else if(/rim|chrome/.test(name)||(/chrome/.test(matName)&&!/wheel/.test(name))){
  let mat=premiumChromeCache.get(source);
  if(!mat){
   mat=new THREE.MeshStandardMaterial();mat.copy(source);
   mat.metalness=.95;mat.roughness=.1;premiumChromeCache.set(source,mat);
  }
  node.material=mat;
 }
}
function applyVehicleAsset(root,k,col){""")

replace_once("src/assets-3d.js",
    "if(o.isMesh){o.castShadow=true;o.receiveShadow=true;}",
    "if(o.isMesh){o.castShadow=true;o.receiveShadow=true;upgradeVehicleSurface(o);}")

p=Path("package.json")
import json
j=json.loads(p.read_text())
test="node tests/physical-polish-v12.cjs"
if test not in j["scripts"]["test"]:
    j["scripts"]["test"]+=" && "+test
p.write_text(json.dumps(j,indent=2,ensure_ascii=False)+"\n")

p=Path("PROGRESS.md")
with p.open("a") as f:
    f.write("""\n## V12.1 Premium Lighting & Vehicle Materials (2026-11-02)
- Renderer: retained Three.js r128 sRGB output and PCFSoftShadowMap, enabled ACES Filmic Tone Mapping with exposure 1.15. Quality 'eco' still disables shadows by existing user preference.
- Car paint: physical clearcoat (1.0, roughness 0.04) using MeshPhysicalMaterial for the GLB body with the V11.2 per-color colormap clone, no loss of wheels, lamp atlas, trim or showroom colors. Distinct glass/chrome meshes, if present in future GLBs, receive corresponding cached materials.
- Kenney current car body includes windows in the same atlas and has no standalone glass mesh. Physical transmission cannot be applied separately to those windows without splitting geometry; dark mapped windows remain visually intact.
- Existing showroom floor is in src/graphics.js rather than showroom-v11.js. Set mapped floor roughness 0.22, metalness 0.12, envMapIntensity 1.0. No environment map provided, so this is a specular floor, not a true mirror/reflection renderer.
- Added tests/physical-polish-v12.cjs to assert ACES/soft shadows, physical body materials, distinct car paint colors, wheel/map preservation, and save-safe changes in Chromium 440x956 / 390x844.
- No gameplay, income, customer AI, save key, or player UI changes. Real iPhone Safari remains untested.
""")
print("Applied targeted V12.1 lighting and physical paint changes")
