// V11 animated pedestrians. Optional CC0 assets; procedural NPCs are fallback.
// Keep the original person() object and hit targets so AI, staff badges and click targets survive.
const CHARACTERS_V11={ready:0,failed:[],templates:{},pending:[],count:0};
const characterFactory=person, originalAnimatePerson=anim;
const npcKeys={sales:'kenney-npc-sales',customer:'kenney-npc-customer',female:'kenney-npc-female',vip:'kenney-npc-vip'};
function npcRole(col,vip){
 if(vip)return 'vip';
 if(col===0x1976d2)return 'sales';
 if(col===0xff7043)return 'sales';
 return (++CHARACTERS_V11.count%3===0)?'female':'customer';
}
function characterSwitch(root,model){
 const u=root.userData;if(!model||u.characterImported)return false;
 if(!THREE.SkeletonUtils||typeof THREE.SkeletonUtils.clone!=='function')return false;
 const clone=THREE.SkeletonUtils.clone(model.scene);
 let hasSkin=false;clone.traverse(o=>{if(o.isSkinnedMesh){hasSkin=true;o.frustumCulled=false}if(o.isMesh){o.castShadow=true;o.receiveShadow=true}});
 if(!hasSkin)return false;
 const box=new THREE.Box3().setFromObject(clone),sz=box.getSize(new THREE.Vector3());
 const factor=2.0/Math.max(.5,sz.y);clone.scale.setScalar(factor);
 clone.position.y=-box.min.y*factor;
 u.fallbackParts.forEach(node=>{if(node!==root.dot)node.visible=false});
 root.add(clone);u.characterImported=true;u.characterVisual=clone;u.characterMixer=new THREE.AnimationMixer(clone);
 u.characterClips=model.clips;u.characterMode='';u.characterLastT=undefined;
 u.characterSource=ART[npcKeys[u.characterRole]];
 changeCharacterAction(root,'idle');
 return true;
}
function changeCharacterAction(root,state){
 const u=root.userData,clip=u.characterClips?.[state];
 if(!clip||!u.characterMixer)return;
 if(u.characterMode===state)return;
 const next=u.characterMixer.clipAction(clip);
 if(u.characterAction&&u.characterAction!==next)u.characterAction.fadeOut(.17);
 next.reset().setEffectiveWeight(1).setEffectiveTimeScale(1).fadeIn(.17).play();
 u.characterAction=next;u.characterMode=state;
}
person=function(col,vip){
 const root=characterFactory(col,vip);
 root.userData.fallbackParts=root.children.slice();
 root.userData.characterRole=npcRole(col,vip);
 const model=CHARACTERS_V11.templates[root.userData.characterRole];
 if(model)characterSwitch(root,model);else CHARACTERS_V11.pending.push(root);
 return root;
};
anim=function(root,actor,t){
 if(!root?.userData?.characterImported)return originalAnimatePerson(root,actor,t);
 const mode=actor.mv?'walk':actor.act?'interact-right':'idle';
 changeCharacterAction(root,mode);
 const last=root.userData.characterLastT;
 const dt=last===undefined?.016:Math.max(0,Math.min(.05,t-last));
 root.userData.characterLastT=t;
 root.userData.characterMixer.update(dt);
};
Object.keys(npcKeys).forEach(role=>{
 const key=npcKeys[role],uri=ART[key];
 if(!uri){CHARACTERS_V11.failed.push(key+' not packaged');return}
 assetLoader.load(uri,gltf=>{
  const clips={};gltf.animations.forEach(c=>{clips[c.name]=c});
  if(!clips.idle||!clips.walk||!clips['interact-right'])throw Error('Missing Kenney animation clips '+role);
  CHARACTERS_V11.templates[role]={scene:gltf.scene,clips};
  CHARACTERS_V11.ready++;
  CHARACTERS_V11.pending=CHARACTERS_V11.pending.filter(root=>{
   if(root.userData.characterRole!==role)return !!root.parent;
   try{characterSwitch(root,CHARACTERS_V11.templates[role])}catch(e){CHARACTERS_V11.failed.push(role+' '+e.message)}
   return false;
  });
 },undefined,e=>{CHARACTERS_V11.failed.push(role+': '+(e?.message||String(e)));console.warn('NPC uses fallback',role,e)});
});
