from pathlib import Path
p=Path('src/assets-3d.js');text=p.read_text()
def patch(old,new):
 global text
 n=text.count(old)
 if n!=1:raise RuntimeError(f'Expected one match for {old[:80]}, got {n}')
 text=text.replace(old,new)
patch("function applyVehicleAsset(root,k){", """// Kenney car body and glass share a colormap atlas. Recolor only the body
// paint swatch in a cloned body texture. Wheel meshes keep the original map.
const paintMaterialCache=new Map(),paintRuleCache=new Map();
function paintForBody(body,k,hex){
 const source=body.material,texture=source?.map,image=texture?.image;
 if(!source||!texture||!image)return null;
 const id=k+':'+hex.toString(16);
 if(paintMaterialCache.has(id))return paintMaterialCache.get(id);
 let rule=paintRuleCache.get(k);
 if(!rule){
  const c=document.createElement('canvas');c.width=image.width;c.height=image.height;
  const ctx=c.getContext('2d',{willReadFrequently:true});ctx.drawImage(image,0,0,c.width,c.height);
  const img=ctx.getImageData(0,0,c.width,c.height),data=img.data;
  const uv=body.geometry.attributes.uv,pos=body.geometry.attributes.position;
  const index=body.geometry.index,hist=new Map(),a=new V(),b=new V(),cc=new V();
  const triangles=index?index.count:pos.count;
  for(let i=0;i<triangles;i+=3){
   const i0=index?index.getX(i):i,i1=index?index.getX(i+1):i+1,i2=index?index.getX(i+2):i+2;
   const u=(uv.getX(i0)+uv.getX(i1)+uv.getX(i2))/3,v=(uv.getY(i0)+uv.getY(i1)+uv.getY(i2))/3;
   const px=Math.min(c.width-1,Math.max(0,Math.floor(((u%1+1)%1)*c.width)));
   const py=Math.min(c.height-1,Math.max(0,Math.floor(((v%1+1)%1)*c.height)));
   const at=(py*c.width+px)*4,red=data[at],green=data[at+1],blue=data[at+2];
   const hi=Math.max(red,green,blue),lo=Math.min(red,green,blue);
   if(hi<70||hi-lo<32||lo>190)continue;
   a.fromBufferAttribute(pos,i0);b.fromBufferAttribute(pos,i1);cc.fromBufferAttribute(pos,i2);
   const area=b.clone().sub(a).cross(cc.clone().sub(a)).length();
   const key=(red>>3)+','+(green>>3)+','+(blue>>3);
   hist.set(key,(hist.get(key)||0)+area);
  }
  const ranked=[...hist.entries()].sort((a,b)=>b[1]-a[1]);
  if(!ranked.length)throw Error('No paint swatch sampled for '+k);
  const paint=ranked[0][0].split(',').map(n=>Number(n)*8+4);
  rule={paint,width:c.width,height:c.height,image:img};
  paintRuleCache.set(k,rule);
  console.log('V11.2 Kenney paint',k,'swatch',paint,'candidates',ranked.slice(0,3));
 }
 const canvas=document.createElement('canvas');canvas.width=rule.width;canvas.height=rule.height;
 const ctx=canvas.getContext('2d');
 const img=new ImageData(new Uint8ClampedArray(rule.image.data),rule.width,rule.height);
 const d=img.data,[r,g,b]=rule.paint,red=hex>>16&255,green=hex>>8&255,blue=hex&255;
 let count=0;
 for(let i=0;i<d.length;i+=4){
  if(Math.abs(d[i]-r)>17||Math.abs(d[i+1]-g)>17||Math.abs(d[i+2]-b)>17)continue;
  d[i]=red;d[i+1]=green;d[i+2]=blue;count++;
 }
 if(count===0)throw Error('Paint swatch has no atlas pixels '+k);
 ctx.putImageData(img,0,0);
 const map=texture.clone();map.image=canvas;map.needsUpdate=true;
 const mat=source.clone();mat.map=map;paintMaterialCache.set(id,mat);
 return mat;
}
function vehiclePaint(root,k,col){
 if(Number.isInteger(col))return col;
 if(Number.isInteger(root.userData.requestedColor))return root.userData.requestedColor;
 const original=root.children.find(c=>c.isMesh&&c.material?.color);
 if(original)return original.material.color.clone().convertLinearToSRGB().getHex();
 return CARS[k].col;
}
function applyVehicleAsset(root,k,col){""")
patch("""if(wheels.length!==4)return false; // Keep the working procedural fallback if source changes.
 root.clear();root.add(copy);root.wheels=wheels;""",
"""if(wheels.length!==4)return false; // Keep the working procedural fallback if source changes.
 const paintHex=vehiclePaint(root,k,col);
 const body=copy.getObjectByName('body');
 if(!body||!body.isMesh)return false;
 const paint=paintForBody(body,k,paintHex);
 if(!paint)return false;
 body.material=paint;
 // Preserve the original v9 trim and sunroof, including their geometries.
 const details=root.getObjectByName('vehicle-detail-package');
 root.children.slice().forEach(child=>{if(child!==details)root.remove(child)});
 root.add(copy);root.wheels=wheels;root.userData.paintHex=paintHex;""")
patch("""const root=fallbackCarFactory(k,col);
 if(vehicleTemplates[k])applyVehicleAsset(root,k);""",
"""const root=fallbackCarFactory(k,col);
 root.userData.requestedColor=Number.isInteger(col)?col:CARS[k].col;
 if(vehicleTemplates[k])applyVehicleAsset(root,k,col);""")
patch("for(const root of pendingVehicle[k])if(root.parent)applyVehicleAsset(root,k);",
      "for(const root of pendingVehicle[k])if(root.parent)applyVehicleAsset(root,k,root.userData.requestedColor);")
p.write_text(text)
print('v11.2 GLB body paint and v9 trim preservation applied')
