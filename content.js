/** SAGE UI Fixes — LEEKS / Produce Bandit ltd. document_start isolated. */
const LOG = "[sa-fix]";
const ENTRY_RE = /assets\/index-[A-Za-z0-9_-]+\.js(?:\?.*)?$/i;

// find must match exactly once in minified entry or patch is skipped
const PATCHES = [
  [
    'if(mt==="Docked"||mt==="StarbaseLoadingBay"||mt==="Respawn"){const St=this.fleetPins.get(Se.address);St&&this.removeFleetPin(Se.address,St);const Ct=this.fleetGameCoordsMap.get(Se.address);Ct&&this.removeStationaryFleetFromLocation(Se.address,Ct);return}',
    'if(mt==="Docked"||mt==="StarbaseLoadingBay"||mt==="Respawn"||mt==="Destroyed"){const St=this.fleetPins.get(Se.address);St&&this.removeFleetPin(Se.address,St);const Ct=this.fleetGameCoordsMap.get(Se.address);Ct&&this.removeStationaryFleetFromLocation(Se.address,Ct);return}',
  ],
  [
    "return ee.nearbyFleets.filter(Kl=>{const Lc=Io($s,Tl,Kl.coordinates[0],Kl.coordinates[1])<=Sl,vc=toFactionEnum(Kl.faction),Zl=vc!==yn&&!(yn===w.Unaligned&&vc===w.Unaligned),sc=String(Kl.fleetKey)!==String(ee.fleetData?.fleetKey);return Lc&&Zl&&sc})",
    'return ee.nearbyFleets.filter(Kl=>{const Lc=Io($s,Tl,Kl.coordinates[0],Kl.coordinates[1])<=Sl,vc=toFactionEnum(Kl.faction),Zl=vc!==yn&&!(yn===w.Unaligned&&vc===w.Unaligned),sc=String(Kl.fleetKey)!==String(ee.fleetData?.fleetKey),dead=Kl.fleetAccount?.data?.state?.__kind==="Destroyed"||Number(Kl.fleetAccount?.data?.hp??0)<=0;return Lc&&Zl&&sc&&!dead})',
  ],
  [
    "if(Nc){const Mc=Nc.hp+Nc.pendingHp;Tc=Mc>0?Nc.hp/Mc:0}",
    "if(Nc){const Mc=Math.max(1,520+Number(Nc.level||0)*180);Tc=Math.min(1,Math.max(0,Number(Nc.hp||0)/Mc))}",
  ],
  [
    'nd=Object.values(Jc).map(su=>`${su.name}@${su.coordinates[0]},${su.coordinates[1]}:${su.owner??"none"}:L${su.starbaseLevel??0}:${su.core?"core":"not"}:${su.planetCount}:${su.asteroidCount}:${(su.stars??[]).length}`)',
    'nd=Object.values(Jc).map(su=>`${su.name}@${su.coordinates[0]},${su.coordinates[1]}:${su.owner??"none"}:L${su.starbaseLevel??0}:H${((su.starbaseHpFraction??0)*100)|0}:${su.core?"core":"not"}:${su.planetCount}:${su.asteroidCount}:${(su.stars??[]).length}`)',
  ],
  [
    "ht=nt?.hp??mt,vt=Math.max(nt?.maxHp??mt,ht),St=nt?.sp??ft,Ct=Math.max(nt?.maxSp??ft,St)",
    "ht=nt?.hp??0,vt=Math.max(nt?.maxHp??mt,ht),St=nt?.sp??0,Ct=Math.max(nt?.maxSp??ft,St)",
  ],
  [
    "function resolveDisplayOwner(ee,Se,nt,at){const mt=nt.get(String(ee));return mt&&at.hasStarbase&&String(mt.gameId)===String(at.gameId)&&mt.capturedSeqId===at.systemSeqId&&mt.controllingFaction>0?mt.controllingFaction:Se}",
    "function resolveDisplayOwner(ee,Se,nt,at){const mt=nt.get(String(ee));const f=mt!=null?Number(mt.controllingFaction):NaN;return mt&&at.hasStarbase&&String(mt.gameId)===String(at.gameId)&&(f===1||f===2||f===3)?f:Se}",
  ],
  [
    'console.log("✅ Attack starbase transaction sent"),Ap(pm.address,ip(pm.data)),Pt(`Attack order submitted against ${Ki.systemName}.`,"success",{presentation:"feed",title:"Starbase attack launched",targets:[Ov(Ki)]}),await Tp({fleetKey:pm.address,fleetInfo:Pu,game:ff,character:_f,gw:Ac,actionLabel:"Attack",onFleetRefreshed:yf.createCounterstrikeRefreshHandler(yg,nv,.8)})',
    'console.log("✅ Attack starbase transaction sent"),Ap(pm.address,ip(pm.data)),Pt(`Attack order submitted against ${Ki.systemName}.`,"success",{presentation:"feed",title:"Starbase attack launched",targets:[Ov(Ki)]});const _sbHpPre=Number(ef?.data?.starbase?.value?.hp??0);await Tp({fleetKey:pm.address,fleetInfo:Pu,game:ff,character:_f,gw:Ac,actionLabel:"Attack",onFleetRefreshed:yf.createCounterstrikeRefreshHandler(yg,nv,.8)});const _sbHpPost=Number(ef?.data?.starbase?.value?.hp??0),_sbDmg=Math.max(0,_sbHpPre-_sbHpPost);window.__SA_LOG_COMBAT_EVENT?.({type:"STARBASE",target:Ki.systemName,damage:_sbDmg,x:yg?.target?.x,y:yg?.target?.y});Pt(_sbDmg>0?`🎯 HIT! Dealt ${_sbDmg.toLocaleString()} damage to starbase at ${Ki.systemName}.`:`❌ MISS! Attack against starbase at ${Ki.systemName} missed.`,_sbDmg>0?"success":"warning",{presentation:"feed",title:_sbDmg>0?`Starbase Hit — ${Ki.systemName}`:`Starbase Miss — ${Ki.systemName}`});(async()=>{const sa=async()=>{try{Kt?.refetch?.starSystem&&await Kt.refetch.starSystem();Kt?.refetch?.factionOwnership&&await Kt.refetch.factionOwnership()}catch(_e){}};await sa();[2e3,5e3,1e4].forEach(ms=>setTimeout(sa,ms))})()',
  ],
  [
    'console.error("Failed to attack starbase:",ph),Pt(Ny(ph),"error",{title:"Starbase attack failed",targets:[Ov(Ki)]})',
    'console.error("Failed to attack starbase:",ph);const _errStr=String(ph?.message||ph?.stack||JSON.stringify(ph)||"");if(/1367933016|0x51890058|Starbase contested/i.test(_errStr)){window.__SA_LOG_COMBAT_EVENT?.({type:"CONTESTED",target:Ki.systemName,damage:0});Pt(`🛡️ Starbase ${Ki.systemName} is CONTESTED and under protection/cooldown! (0x51890058)`,"error",{title:"Starbase Contested",targets:[Ov(Ki)]})}else if(/1367933091|0x51890023|resource=ap/i.test(_errStr)){Pt("⚡ Insufficient AP! Reload fleet AP or top up ammo.","error",{title:"AP Depleted",targets:[Ov(Ki)]})}else{Pt(Ny(ph),"error",{title:"Starbase attack failed",targets:[Ov(Ki)]})}',
  ],
  [
    'console.log("✅ Attack fleet transaction sent"),await Tp({fleetKey:ym.address,fleetInfo:Pu,game:pm,character:ef,gw:Ac,actionLabel:"Attack",onFleetRefreshed:ff.createCounterstrikeRefreshHandler(Jh,nv,.6)})',
    'console.log("✅ Attack fleet transaction sent");const _hpPre=Number(Qh?.fleetAccount?.data?.hp??0);await Tp({fleetKey:ym.address,fleetInfo:Pu,game:pm,character:ef,gw:Ac,actionLabel:"Attack",onFleetRefreshed:ff.createCounterstrikeRefreshHandler(Jh,nv,.6)});const _hpPost=Number(Qh?.fleetAccount?.data?.hp??0),_dmg=Math.max(0,_hpPre-_hpPost),_st=Qh?.fleetAccount?.data?.state?.__kind,_flee=_st==="MoveWarp"||_st==="MoveSubwarp";window.__SA_LOG_COMBAT_EVENT?.({type:_flee?"FLEE":(_dmg>0?"HIT":"MISS"),target:Ki.fleetLabel,damage:_dmg,x:Jh?.target?.x,y:Jh?.target?.y});Pt(_flee?`🏃 FLEE! Target fleet ${Ki.fleetLabel} fled the area!`:(_dmg>0?`🎯 HIT! Dealt ${_dmg.toLocaleString()} damage to ${Ki.fleetLabel}.`:`❌ MISS! Attack against ${Ki.fleetLabel} missed.`),_flee?"info":(_dmg>0?"success":"warning"),{presentation:"feed",title:_flee?`Fled — ${Ki.fleetLabel}`:(_dmg>0?`Hit — ${Ki.fleetLabel}`:`Miss — ${Ki.fleetLabel}`)});',
  ],
  [
    'console.error("Failed to attack fleet:",_f),Pt(Ny(_f),"error",{title:"Fleet attack failed",targets:[Sy(Ki)]})',
    'console.error("Failed to attack fleet:",_f);const _errStr=String(_f?.message||_f?.stack||JSON.stringify(_f)||"");if(/1367933091|0x51890023|resource=ap/i.test(_errStr)){Pt("⚡ Insufficient AP! Reload fleet AP or top up ammo.","error",{title:"AP Depleted",targets:[Sy(Ki)]})}else if(/xp\\.rs:132|overflow/i.test(_errStr)){Pt("⚠️ SAGE Program Panic (XP Overflow). Retrying attack may succeed.","error",{title:"Program Panic",targets:[Sy(Ki)]})}else{Pt(Ny(_f),"error",{title:"Fleet attack failed",targets:[Sy(Ki)]})}',
  ],
  [
    "It=createMemo(()=>ee.system?.owner??w.Unaligned)",
    "It=createMemo(()=>{const gn=ee.system;if(!gn)return w.Unaligned;const Jr=gn._systemId;const Sn=Jr!=null?(Se.state.map?.systems?.[Jr]??Se.state.map?.systems?.[String(Jr)]):null;return Sn?.owner??gn.owner??w.Unaligned})",
  ],
  [
    "updateDetailFaction(Se,nt){const at=FACTION_COLORS[nt]||FACTION_COLORS.DEFAULT_GLOW;for(const St of Se.warpLanes||[])St.container&&St.container.parent&&St.container.parent.removeChild(St.container),St.container.destroy({children:!0});for(const St of Se.warpGates||[]){for(const Ct of St.clouds||[])Ct.sprite&&Ct.sprite.parent&&Ct.sprite.parent.removeChild(Ct.sprite),Ct.sprite.destroy();St.sprite&&St.sprite.parent&&St.sprite.parent.removeChild(St.sprite),St.sprite.destroy()}const mt=(Se.planets.length+Se.asteroidBelts.length)*SYSTEM_DETAIL_CONFIG.PLANET.ORBIT_SPACING+SYSTEM_DETAIL_CONFIG.PLANET.MIN_ORBIT_RADIUS,ft=.6,ht=Se.system._systemId||Se.system.name,vt=this.createWarpConnections(Se.system,ht,nt,at,Se.container,Se.centerX,Se.centerY,mt,ft);Se.warpGates=vt.warpGates,Se.warpLanes=vt.warpLanes,this.moveStarGlowsToTop(Se.container,Se.stars),Se.faction=nt}",
    'updateDetailFaction(Se,nt){const sys=Se.system,cx=Se.centerX,cy=Se.centerY,key=Se.systemKey,vis=!!Se.isVisible,alpha=Se.container&&Se.container.alpha,tp=Se.transitionProgress,parent=Se.container&&Se.container.parent;this.removeDetailView(Se),this.activeDetails.delete(key);const ht=this.createDetailView(sys,cx,cy,nt,key);this.activeDetails.set(key,ht),(parent||this.viewport).addChild(ht.container),vis&&(ht.isVisible=!0,ht.container.renderable=!0,typeof alpha=="number"&&(ht.container.alpha=alpha),typeof tp=="number"&&(ht.transitionProgress=tp),this.hideStarSprite(key))}',
  ],
  [
    'SystemHoverTooltip=ee=>{const Se=createMemo(()=>ee.system?{name:getFactionName$1(ee.system.owner),color:getFactionColor$1(ee.system.owner)}:{name:"NEUTRAL",color:"#9ca3af"}),nt=createMemo(()=>ee.regionColor||Se().color),at=createMemo(()=>ee.system?.planetCount||0),mt=createMemo(()=>1),ft=createMemo(()=>{if(!ee.system)return 0;const Et=ee.system.starbaseLevel;return Et===null?0:Number(Et)}),{store:ht}=useDataSource(),',
    'SystemHoverTooltip=ee=>{const{store:ht}=useDataSource(),liveOwner=createMemo(()=>{const gn=ee.system;if(!gn)return null;const Jr=gn._systemId;const Sn=Jr!=null?(ht.state.map?.systems?.[Jr]??ht.state.map?.systems?.[String(Jr)]):null;return Sn?.owner??gn.owner??null}),Se=createMemo(()=>{const o=liveOwner();return o!=null?{name:getFactionName$1(o),color:getFactionColor$1(o)}:{name:"NEUTRAL",color:"#9ca3af"}}),nt=createMemo(()=>ee.regionColor||Se().color),at=createMemo(()=>ee.system?.planetCount||0),mt=createMemo(()=>1),ft=createMemo(()=>{const gn=ee.system;if(!gn)return 0;const Jr=gn._systemId;const Sn=Jr!=null?(ht.state.map?.systems?.[Jr]??ht.state.map?.systems?.[String(Jr)]):null;let lv=Sn?.starbaseLevel??gn.starbaseLevel;const acc=(ht.state.starSystems??[]).find(H=>H.exists&&H.data.name===gn.name);const sb=acc?.data?.starbase;if(sb&&sb.__option==="Some"&&sb.value){const v=sb.value;const L=Number(v.level);if(Number.isFinite(L))lv=L;const hp=Number(v.hp);if(Number.isFinite(hp)&&hp<=0&&lv>0)return lv-1}return lv==null?0:Number(lv)}),',
  ],
  [
    "getFactionLogoMaskStyle(ee.system?.owner,nt())",
    "getFactionLogoMaskStyle(liveOwner()??ee.system?.owner,nt())",
  ],
  [
    "if(!Lt||wt().get(Ft))continue;if(Lt.coordinates.length<2)",
    "if(!Lt)continue;{const _ex=wt().get(Ft);if(_ex){if(_ex._saOwner===Lt.owner)continue;_ex._saOwner=Lt.owner;const _t=cachedColorNumber(getFactionColorFromOwner(Lt.owner)),_f=convertOwnerToFaction(Lt.owner),_c=mt.get(_f)||mt.get(\"DEFAULT_GLOW\");_ex._starGlow&&(_ex._starGlow.tint=_t);if(_ex._starCore){_c&&(_ex._starCore.texture=_c);_ex._starCore.tint=_t}continue}}if(Lt.coordinates.length<2)",
  ],
  [
    "Nr._starCore=sr;let Dt=null",
    "Nr._starCore=sr,Nr._saOwner=Lt.owner;let Dt=null",
  ],
];

const msg = (m) =>
  new Promise((resolve) => {
    try {
      chrome.runtime.sendMessage(m, (r) =>
        resolve(chrome.runtime.lastError ? { ok: false, error: chrome.runtime.lastError.message } : r || { ok: false }),
      );
    } catch (e) {
      resolve({ ok: false, error: String(e) });
    }
  });

function killStock(node) {
  if (!node || node.nodeType !== 1 || node.tagName !== "SCRIPT" || node.dataset?.saFixes === "patched") return;
  const src = node.getAttribute("src") || node.src || "";
  if (!ENTRY_RE.test(src)) return;
  try {
    node.type = "javascript/blocked";
    node.removeAttribute("src");
    node.remove();
  } catch (_) {}
}

function neutralize() {
  try {
    for (const s of document.querySelectorAll("script[src]")) killStock(s);
  } catch (_) {}
  const obs = new MutationObserver((ms) => {
    for (const m of ms) for (const n of m.addedNodes) killStock(n);
  });
  try {
    obs.observe(document.documentElement || document, { childList: true, subtree: true });
  } catch (_) {}
  setTimeout(() => {
    try {
      obs.disconnect();
    } catch (_) {}
  }, 6e4);
}

async function entryUrl() {
  for (const el of document.querySelectorAll("script[src]")) {
    const src = el.getAttribute("src") || "";
    if (!ENTRY_RE.test(src)) continue;
    try {
      return new URL(src, location.href).href;
    } catch (_) {}
  }
  const html = await (await fetch(location.href, { cache: "no-cache" })).text();
  const m = html.match(/src="(\.\/assets\/index-[^"]+\.js)"/);
  if (!m) return null;
  try {
    return new URL(m[1], location.href).href;
  } catch (_) {
    return null;
  }
}

function apply(src) {
  let out = src;
  let n = 0;
  for (const [find, rep] of PATCHES) {
    if (out.split(find).length - 1 !== 1) {
      continue;
    }
    out = out.replace(find, rep);
    n++;
  }

  const REGEX_PATCHES = [
    [
      /if\(mt==="Docked"\|\|mt==="StarbaseLoadingBay"\|\|mt==="Respawn"\)\{/g,
      'if(mt==="Docked"||mt==="StarbaseLoadingBay"||mt==="Respawn"||mt==="Destroyed"){'
    ],
    [
      /return ([A-Za-z0-9_$]+)\.nearbyFleets\.filter\(([A-Za-z0-9_$]+)=>\{const ([A-Za-z0-9_$]+)=([A-Za-z0-9_$]+)\(([^,]+),([^,]+),\2\.coordinates\[0\],\2\.coordinates\[1\]\)<=([^,]+),([A-Za-z0-9_$]+)=toFactionEnum\(\2\.faction\),([A-Za-z0-9_$]+)=\8!==([A-Za-z0-9_$]+)&&!\(\10===w\.Unaligned&&\8===w\.Unaligned\),([A-Za-z0-9_$]+)=String\(\2\.fleetKey\)!==String\(\1\.fleetData\?\.fleetKey\);return \3&&\9&&\11\}\)/g,
      'return $1.nearbyFleets.filter($2=>{const $3=$4($5,$6,$2.coordinates[0],$2.coordinates[1])<=$7,$8=toFactionEnum($2.faction),$9=$8!=$10&&!($10===w.Unaligned&&$8===w.Unaligned),$11=String($2.fleetKey)!==String($1.fleetData?.fleetKey),dead=$2.fleetAccount?.data?.state?.__kind==="Destroyed"||Number($2.fleetAccount?.data?.hp??0)<=0;return $3&&$9&&$11&&!dead})'
    ],
    [
      /if\(([A-Za-z0-9_$]+)\)\{const ([A-Za-z0-9_$]+)=\1\.hp\+\1\.pendingHp;([A-Za-z0-9_$]+)=\2>0\?\1\.hp\/\2:0\}/g,
      'if($1){const $2=Math.max(1,520+Number($1.level||0)*180);$3=Math.min(1,Math.max(0,Number($1.hp||0)/$2))}'
    ],
    [
      /Object\.values\(([A-Za-z0-9_$]+)\)\.map\(([A-Za-z0-9_$]+)=>\`\$\{\2\.name\}@\$\{\2\.coordinates\[0\]\},\$\{\2\.coordinates\[1\]\}:\$\{\2\.owner\?\?"none"\}:L\$\{\2\.starbaseLevel\?\?0\}:\$\{\2\.core\?"core":"not"\}:\$\{\2\.planetCount\}:\$\{\2\.asteroidCount\}:\$\{\(\2\.stars\?\?\[\]\)\.length\}\`\)/g,
      'Object.values($1).map($2=>`${$2.name}@${$2.coordinates[0]},${$2.coordinates[1]}:${$2.owner??"none"}:L${$2.starbaseLevel??0}:H${(($2.starbaseHpFraction??0)*100)|0}:${$2.core?"core":"not"}:${$2.planetCount}:${$2.asteroidCount}:${($2.stars??[]).length}`)'
    ],
    [
      /ht=nt\?\.hp\?\?mt,vt=Math\.max\(nt\?\.maxHp\?\?mt,ht\),St=nt\?\.sp\?\?ft,Ct=Math\.max\(nt\?\.maxSp\?\?ft,St\)/g,
      'ht=nt?.hp??0,vt=Math.max(nt?.maxHp??mt,ht),St=nt?.sp??0,Ct=Math.max(nt?.maxSp??ft,St)'
    ],
    [
      /function resolveDisplayOwner\(ee,Se,nt,at\)\{const mt=nt\.get\(String\(ee\)\);return mt&&at\.hasStarbase&&String\(mt\.gameId\)===String\(at\.gameId\)&&mt\.capturedSeqId===at\.systemSeqId&&mt\.controllingFaction>0\?mt\.controllingFaction:Se\}/g,
      'function resolveDisplayOwner(ee,Se,nt,at){const mt=nt.get(String(ee));const f=mt!=null?Number(mt.controllingFaction):NaN;return mt&&at.hasStarbase&&String(mt.gameId)===String(at.gameId)&&(f===1||f===2||f===3)?f:Se}'
    ],
    [
      /console\.log\("✅ Attack starbase transaction sent"\),(.*?),await ([A-Za-z0-9_$]+)\(\{fleetKey:([A-Za-z0-9_$]+)\.address,fleetInfo:([A-Za-z0-9_$]+),game:([A-Za-z0-9_$]+),character:([A-Za-z0-9_$]+),gw:([A-Za-z0-9_$]+),actionLabel:"Attack",onFleetRefreshed:([A-Za-z0-9_$]+)\.createCounterstrikeRefreshHandler\(([^,]+),([^,]+),0?\.8\)\}/g,
      'console.log("✅ Attack starbase transaction sent"),$1;const _sbHpPre=Number($5?.data?.starbase?.value?.hp??0);await $2({fleetKey:$3.address,fleetInfo:$4,game:$5,character:$6,gw:$7,actionLabel:"Attack",onFleetRefreshed:$8.createCounterstrikeRefreshHandler($9,$10,.8)});const _sbHpPost=Number($5?.data?.starbase?.value?.hp??0),_sbDmg=Math.max(0,_sbHpPre-_sbHpPost);window.__SA_LOG_COMBAT_EVENT?.({type:"STARBASE",target:"Starbase",damage:_sbDmg,x:$9?.target?.x,y:$9?.target?.y});Pt(_sbDmg>0?`🎯 HIT! Dealt ${_sbDmg.toLocaleString()} damage to starbase.`:`❌ MISS! Attack against starbase missed.`,_sbDmg>0?"success":"warning",{presentation:"feed",title:_sbDmg>0?"Starbase Hit":"Starbase Miss"});(async()=>{const sa=async()=>{try{Kt?.refetch?.starSystem&&await Kt.refetch.starSystem();Kt?.refetch?.factionOwnership&&await Kt.refetch.factionOwnership()}catch(_e){}};await sa();[2e3,5e3,1e4].forEach(ms=>setTimeout(sa,ms))})()'
    ],
    [
      /console\.error\("Failed to attack starbase:",([A-Za-z0-9_$]+)\),([A-Za-z0-9_$]+)\(([A-Za-z0-9_$]+)\(\1\),"error",\{title:"Starbase attack failed",targets:\[([^\]]+)\]\}\)/g,
      'console.error("Failed to attack starbase:",$1);const _errStr=String($1?.message||$1?.stack||JSON.stringify($1)||"");if(/1367933016|0x51890058|Starbase contested/i.test(_errStr)){window.__SA_LOG_COMBAT_EVENT?.({type:"CONTESTED",target:"Starbase",damage:0});$2(`🛡️ Starbase is CONTESTED and under protection/cooldown! (0x51890058)`,"error",{title:"Starbase Contested",targets:[$4]})}else if(/1367933091|0x51890023|resource=ap/i.test(_errStr)){$2("⚡ Insufficient AP! Reload fleet AP or top up ammo.","error",{title:"AP Depleted",targets:[$4]})}else{$2($3($1),"error",{title:"Starbase attack failed",targets:[$4]})}'
    ],
    [
      /console\.log\("✅ Attack fleet transaction sent"\),await ([A-Za-z0-9_$]+)\(\{fleetKey:([A-Za-z0-9_$]+)\.address,fleetInfo:([A-Za-z0-9_$]+),game:([A-Za-z0-9_$]+),character:([A-Za-z0-9_$]+),gw:([A-Za-z0-9_$]+),actionLabel:"Attack",onFleetRefreshed:([A-Za-z0-9_$]+)\.createCounterstrikeRefreshHandler\(([^,]+),([^,]+),0?\.6\)\}/g,
      'console.log("✅ Attack fleet transaction sent");const _hpPre=Number(Qh?.fleetAccount?.data?.hp??0);await $1({fleetKey:$2.address,fleetInfo:$3,game:$4,character:$5,gw:$6,actionLabel:"Attack",onFleetRefreshed:$7.createCounterstrikeRefreshHandler($8,$9,.6)});const _hpPost=Number(Qh?.fleetAccount?.data?.hp??0),_dmg=Math.max(0,_hpPre-_hpPost),_st=Qh?.fleetAccount?.data?.state?.__kind,_flee=_st==="MoveWarp"||_st==="MoveSubwarp";window.__SA_LOG_COMBAT_EVENT?.({type:_flee?"FLEE":(_dmg>0?"HIT":"MISS"),target:"Target Fleet",damage:_dmg,x:$8?.target?.x,y:$8?.target?.y});Pt(_flee?"🏃 FLEE! Target fleet fled the area!":(_dmg>0?`🎯 HIT! Dealt ${_dmg.toLocaleString()} damage.`:"❌ MISS! Attack missed."),_flee?"info":(_dmg>0?"success":"warning"),{presentation:"feed",title:_flee?"Fled":(_dmg>0?"Hit":"Miss")});'
    ],
    [
      /console\.error\("Failed to attack fleet:",([A-Za-z0-9_$]+)\),([A-Za-z0-9_$]+)\(([A-Za-z0-9_$]+)\(\1\),"error",\{title:"Fleet attack failed",targets:\[([^\]]+)\]\}\)/g,
      'console.error("Failed to attack fleet:",$1);const _errStr=String($1?.message||$1?.stack||JSON.stringify($1)||"");if(/1367933091|0x51890023|resource=ap/i.test(_errStr)){$2("⚡ Insufficient AP! Reload fleet AP or top up ammo.","error",{title:"AP Depleted",targets:[$4]})}else if(/xp\\.rs:132|overflow/i.test(_errStr)){$2("⚠️ SAGE Program Panic (XP Overflow). Retrying attack may succeed.","error",{title:"Program Panic",targets:[$4]})}else{$2($3($1),"error",{title:"Fleet attack failed",targets:[$4]})}'
    ],
    [
      /It=createMemo\(\(\)=>ee\.system\?\.owner\?\?w\.Unaligned\)/g,
      'It=createMemo(()=>{const gn=ee.system;if(!gn)return w.Unaligned;const Jr=gn._systemId;const Sn=Jr!=null?(Se.state.map?.systems?.[Jr]??Se.state.map?.systems?.[String(Jr)]):null;return Sn?.owner??gn.owner??w.Unaligned})'
    ],
    [
      /updateDetailFaction\(Se,nt\)\{const at=FACTION_COLORS\[nt\]\|\|FACTION_COLORS\.DEFAULT_GLOW;for\(const St of Se\.warpLanes\|\|\[\]\)St\.container&&St\.container\.parent&&St\.container\.parent\.removeChild\(St\.container\),St\.container\.destroy\(\{children:!0\}\);for\(const St of Se\.warpGates\|\|\[\]\)\{for\(const Ct of St\.clouds\|\|\[\]\)Ct\.sprite&&Ct\.sprite\.parent&&Ct\.sprite\.parent\.removeChild\(Ct\.sprite\),Ct\.sprite\.destroy\(\);St\.sprite&&St\.sprite\.parent&&St\.sprite\.parent\.removeChild\(St\.sprite\),St\.sprite\.destroy\(\)\}const mt=\(Se\.planets\.length\+Se\.asteroidBelts\.length\)\*SYSTEM_DETAIL_CONFIG\.PLANET\.ORBIT_SPACING\+SYSTEM_DETAIL_CONFIG\.PLANET\.MIN_ORBIT_RADIUS,ft=\.6,ht=Se\.system\._systemId\|\|Se\.system\.name,vt=this\.createWarpConnections\(Se\.system,ht,nt,at,Se\.container,Se\.centerX,Se\.centerY,mt,ft\);Se\.warpGates=vt\.warpGates,Se\.warpLanes=vt\.warpLanes,this\.moveStarGlowsToTop\(Se\.container,Se\.stars\),Se\.faction=nt\}/g,
      'updateDetailFaction(Se,nt){const sys=Se.system,cx=Se.centerX,cy=Se.centerY,key=Se.systemKey,vis=!!Se.isVisible,alpha=Se.container&&Se.container.alpha,tp=Se.transitionProgress,parent=Se.container&&Se.container.parent;this.removeDetailView(Se),this.activeDetails.delete(key);const ht=this.createDetailView(sys,cx,cy,nt,key);this.activeDetails.set(key,ht),(parent||this.viewport).addChild(ht.container),vis&&(ht.isVisible=!0,ht.container.renderable=!0,typeof alpha=="number"&&(ht.container.alpha=alpha),typeof tp=="number"&&(ht.transitionProgress=tp),this.hideStarSprite(key))}'
    ]
  ];

  for (const [re, rep] of REGEX_PATCHES) {
    const prev = out.length;
    out = out.replace(re, rep);
    if (out.length !== prev) n++;
  }
  const logInit = `
window.__SA_LOG_COMBAT_EVENT=window.__SA_LOG_COMBAT_EVENT||(function(){let min=!1;const c=document.createElement("div");c.id="sa-combat-log-box";c.style.cssText="position:fixed;bottom:16px;left:16px;width:360px;max-height:220px;background:rgba(10,15,25,0.92);backdrop-filter:blur(8px);border:1px solid rgba(0,229,255,0.35);border-radius:8px;box-shadow:0 8px 32px rgba(0,0,0,0.7);font-family:monospace;color:#e2e8f0;font-size:11px;z-index:999999;display:flex;flex-direction:column;overflow:hidden;transition:all 0.25s ease;";const h=document.createElement("div");h.style.cssText="background:rgba(0,229,255,0.15);padding:6px 10px;display:flex;align-items:center;justify-content:space-between;font-weight:bold;color:#00e5ff;letter-spacing:0.5px;user-select:none;border-bottom:1px solid rgba(0,229,255,0.2);";h.innerHTML='<span>⚔️ COMBAT LOG</span><div><button id="sa-cl-cls" style="background:none;border:none;color:#94a3b8;cursor:pointer;margin-right:6px;" title="Clear">🗑️</button><button id="sa-cl-min" style="background:none;border:none;color:#00e5ff;cursor:pointer;font-weight:bold;">[−]</button></div>';const b=document.createElement("div");b.style.cssText="padding:6px 8px;overflow-y:auto;flex:1;display:flex;flex-direction:column;gap:4px;max-height:175px;";c.appendChild(h);c.appendChild(b);const mount=()=>{if(document.body)document.body.appendChild(c);else setTimeout(mount,100)};mount();h.querySelector("#sa-cl-cls").onclick=()=>{b.innerHTML=""};h.querySelector("#sa-cl-min").onclick=()=>{min=!min;c.style.maxHeight=min?"30px":"220px";b.style.display=min?"none":"flex";h.querySelector("#sa-cl-min").textContent=min?"[+]":"[−]"};return function(e){const time=new Date().toLocaleTimeString("en-US",{hour12:!1});const r=document.createElement("div");r.style.cssText="line-height:1.35;border-bottom:1px solid rgba(255,255,255,0.06);padding-bottom:2px;";let icon="🎯",color="#f87171",msg="";if(e.type==="HIT"){icon="🎯";color="#f87171";msg=\`<span style="color:#ef4444;font-weight:bold;">HIT</span> vs <b style="color:#fff">\${e.target}</b> <span style="color:#f87171;font-weight:bold;">-\${e.damage.toLocaleString()} HP</span>\`}else if(e.type==="MISS"){icon="❌";color="#9ca3af";msg=\`<span style="color:#9ca3af;font-weight:bold;">MISS</span> vs <b style="color:#fff">\${e.target}</b> (0 DMG)\`}else if(e.type==="STARBASE"){icon="🏰";color=e.damage>0?"#f87171":"#9ca3af";msg=\`<span style="color:\${color};font-weight:bold;">STARBASE</span> vs <b style="color:#fff">\${e.target}</b> \${e.damage>0?\`<span style="color:#f87171;font-weight:bold;">-\${e.damage.toLocaleString()} HP</span>\`:"(0 DMG)"}\`}else if(e.type==="FLEE"){icon="🏃";color="#fbbf24";msg=\`<span style="color:#fbbf24;font-weight:bold;">FLEE</span> <b style="color:#fff">\${e.target}</b> warped away / exited sector!\`}r.innerHTML=\`<span style="color:#64748b;">[\${time}]</span> \${icon} \${msg}\`;b.appendChild(r);b.scrollTop=b.scrollHeight;if(e.x&&e.y){const txt=e.damage>0?\`-\${e.damage.toLocaleString()} HP\`:(e.type==="FLEE"?"FLED!":"MISS");const pop=document.createElement("div");pop.textContent=txt;pop.style.cssText=\`position:fixed;left:\${e.x}px;top:\${e.y-25}px;transform:translate(-50%,-50%);font-family:monospace;font-weight:900;font-size:22px;color:\${color};text-shadow:0 0 8px #000,2px 2px 0 #000;pointer-events:none;z-index:999999;animation:saFloatUp 1.4s cubic-bezier(0.2,0.8,0.2,1) forwards;\`;if(!document.getElementById("sa-c-style")){const s=document.createElement("style");s.id="sa-c-style";s.textContent="@keyframes saFloatUp{0%{opacity:0;transform:translate(-50%,0) scale(.6)}15%{opacity:1;transform:translate(-50%,-20px) scale(1.25)}70%{opacity:1;transform:translate(-50%,-45px) scale(1)}100%{opacity:0;transform:translate(-50%,-65px) scale(.8)}}";document.head.appendChild(s)}document.body.appendChild(pop);setTimeout(()=>pop.remove(),1400)}}})();
`;
  out = logInit + out;
  return { out, n };
}

function rewrite(src, entry) {
  const base = entry.replace(/[^/]+(?:\?.*)?$/, "");
  return src
    .replace(/(["'])\.\/([A-Za-z0-9_.-]+\.js)\1/g, `$1${base}$2$1`)
    .replace(/\bimport\.meta\.url\b/g, JSON.stringify(entry));
}

const VER = chrome.runtime.getManifest().version;
console.log(LOG, "v" + VER);
neutralize();

(async () => {
  try {
    let entry = await entryUrl();
    for (let i = 0; !entry && i < 25; i++) {
      await new Promise((r) => setTimeout(r, 40));
      entry = await entryUrl();
    }
    if (!entry) throw new Error("no entry");

    await msg({ type: "sa-fixes-set-entry-block", entryUrl: entry });
    const res = await fetch(entry, { cache: "no-cache" });
    if (!res.ok) throw new Error("fetch " + res.status);
    const { out, n } = apply(await res.text());
    const code = rewrite(out, entry);
    console.log(LOG, n + "/" + PATCHES.length);

    for (const id of ["root", "modal-root"]) {
      const el = document.getElementById(id);
      if (el) el.innerHTML = "";
    }
    neutralize();

    const r = await msg({ type: "sa-fixes-inject-module", code, entryUrl: entry });
    if (!r?.ok) throw new Error(r?.error || "inject failed");
    console.log(LOG, "ok");
  } catch (e) {
    console.error(LOG, e);
  }
})();
