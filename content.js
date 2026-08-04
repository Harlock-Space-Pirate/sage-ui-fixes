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
    'console.log("✅ Attack starbase transaction sent"),Ap(pm.address,ip(pm.data)),Pt(`Attack order submitted against ${Ki.systemName}.`,"success",{presentation:"feed",title:"Starbase attack launched",targets:[Ov(Ki)]}),await Tp({fleetKey:pm.address,fleetInfo:Pu,game:ff,character:_f,gw:Ac,actionLabel:"Attack",onFleetRefreshed:yf.createCounterstrikeRefreshHandler(yg,nv,.8)}),(async()=>{const sa=async()=>{try{Kt?.refetch?.starSystem&&await Kt.refetch.starSystem();Kt?.refetch?.factionOwnership&&await Kt.refetch.factionOwnership()}catch(_e){}};await sa();[2e3,5e3,1e4].forEach(ms=>setTimeout(sa,ms))})()',
  ],
  [
    'console.log("✅ Attack fleet transaction sent"),await Tp({fleetKey:ym.address,fleetInfo:Pu,game:pm,character:ef,gw:Ac,actionLabel:"Attack",onFleetRefreshed:ff.createCounterstrikeRefreshHandler(Jh,nv,.6)})',
    'console.log("✅ Attack fleet transaction sent");const _hpPre=Number(Qh?.fleetAccount?.data?.hp??0);await Tp({fleetKey:ym.address,fleetInfo:Pu,game:pm,character:ef,gw:Ac,actionLabel:"Attack",onFleetRefreshed:ff.createCounterstrikeRefreshHandler(Jh,nv,.6)});const _hpPost=Number(Qh?.fleetAccount?.data?.hp??0),_dmg=_hpPre-_hpPost;(function(x,y,d,label){const hit=d>0,txt=hit?`-${d.toLocaleString()} HP`:"MISS";Pt(hit?`🎯 HIT! Dealt ${d.toLocaleString()} damage to ${label}.`:`❌ MISS! Attack against ${label} missed.`,hit?"success":"warning",{presentation:"feed",title:hit?`Hit — ${label}`:`Miss — ${label}`});if(x&&y){const el=document.createElement("div");el.textContent=txt;el.style.cssText=`position:fixed;left:${x}px;top:${y-25}px;transform:translate(-50%,-50%);font-family:monospace;font-weight:900;font-size:22px;color:${hit?"#ff4d4d":"#9ca3af"};text-shadow:0 0 8px #000,2px 2px 0 #000;pointer-events:none;z-index:99999;animation:saFloatUp 1.4s cubic-bezier(0.2,0.8,0.2,1) forwards;`;if(!document.getElementById("sa-c-style")){const s=document.createElement("style");s.id="sa-c-style";s.textContent="@keyframes saFloatUp{0%{opacity:0;transform:translate(-50%,0) scale(.6)}15%{opacity:1;transform:translate(-50%,-20px) scale(1.25)}70%{opacity:1;transform:translate(-50%,-45px) scale(1)}100%{opacity:0;transform:translate(-50%,-65px) scale(.8)}}";document.head.appendChild(s)}document.body.appendChild(el);setTimeout(()=>el.remove(),1400)}})(Jh?.target?.x,Jh?.target?.y,_dmg,Ki.fleetLabel)',
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
      console.warn(LOG, "miss", find.slice(0, 40));
      continue;
    }
    out = out.replace(find, rep);
    n++;
  }
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
