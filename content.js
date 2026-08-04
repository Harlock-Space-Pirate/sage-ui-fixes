/** SAGE UI Fixes — LEEKS / Produce Bandit ltd. document_start isolated. */
const ENTRY_RE = /assets\/index-[A-Za-z0-9_-]+\.js(?:\?.*)?$/i;

// Pretty console — ANSI colors (Chrome/Brave DevTools) + %c badge fallback.
// Filter DevTools with: sa-ui-fixes
const ESC = "\x1b[";
const A = {
  reset: `${ESC}0m`,
  bold: `${ESC}1m`,
  dim: `${ESC}2m`,
  gray: `${ESC}90m`,
  bg: `${ESC}48;2;10;15;25m`,
  ice: `${ESC}38;2;0;229;255m`,
  mint: `${ESC}38;2;52;211;153m`,
  gold: `${ESC}38;2;251;191;36m`,
  rose: `${ESC}38;2;248;113;113m`,
  sky: `${ESC}38;2;103;232;249m`,
  white: `${ESC}37m`,
};
const C = {
  badge:
    "background:linear-gradient(90deg,#0a0f19,#0d2137);color:#00e5ff;border:1px solid rgba(0,229,255,.45);padding:2px 8px;border-radius:4px;font-weight:800;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.4px",
  ok: "color:#34d399;font-weight:700;font-family:ui-monospace,Menlo,monospace",
  info: "color:#67e8f9;font-weight:600;font-family:ui-monospace,Menlo,monospace",
  warn: "color:#fbbf24;font-weight:700;font-family:ui-monospace,Menlo,monospace",
  err: "color:#f87171;font-weight:700;font-family:ui-monospace,Menlo,monospace",
  dim: "color:#64748b;font-family:ui-monospace,Menlo,monospace",
};
const TAG = "⚔️ sa-ui-fixes";

function slog(kind, emoji, msg, extra) {
  const style = kind === "ok" ? C.ok : kind === "warn" ? C.warn : kind === "err" ? C.err : kind === "dim" ? C.dim : C.info;
  const fg = kind === "ok" ? A.mint : kind === "warn" ? A.gold : kind === "err" ? A.rose : kind === "dim" ? A.gray : A.sky;
  const fn = kind === "err" ? console.error : kind === "warn" ? console.warn : console.log;
  const plain = `${emoji} ${msg}`;
  const ansi = `${A.bg}${A.ice}${A.bold} ${TAG} ${A.reset} ${fg}${A.bold}${plain}${A.reset}`;
  // %c badge always pops in DevTools; ANSI string colors the same line's text in ANSI-aware consoles
  if (extra !== undefined) fn(`%c ${TAG} %c ${plain}`, C.badge, style, extra);
  else fn(`%c ${TAG} %c ${plain}`, C.badge, style);
  // Pure ANSI line for scrapers / terminals (same filter token)
  try {
    if (extra !== undefined) console.debug(ansi, extra);
    else console.debug(ansi);
  } catch (_) {}
}

function sbanner(ver) {
  console.log(
    `%c ${TAG} %c  LEEKS · Produce Bandit  %c  v${ver}  `,
    C.badge,
    "background:#111827;color:#e2e8f0;padding:2px 8px;font-family:ui-monospace,Menlo,monospace",
    "background:#00e5ff22;color:#00e5ff;padding:2px 8px;font-weight:800;font-family:ui-monospace,Menlo,monospace;border-radius:0 4px 4px 0",
  );
  console.log(`%c ${TAG} %c 🚀 patch engine online — intercepting SAGE entry bundle`, C.badge, C.info);
  try {
    console.debug(
      `${A.bg}${A.ice}${A.bold} ${TAG} ${A.reset} ${A.white}${A.bold}LEEKS · Produce Bandit${A.reset} ${A.ice}v${ver}${A.reset} ${A.dim}· patch engine online${A.reset}`,
    );
  } catch (_) {}
}

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
  // Live bundle: resolve hit/miss ASAP via starSystem poll (parallel to fleets+AP reload).
  // Hit is on-chain RNG — unlike flight path we cannot know pre-tx; we CAN skip the AP-reload wait.
  [
    'console.log("✅ Attack starbase transaction sent"),(()=>{const Gg=()=>Promise.all([Kt.refetch.starSystem(),Kt.refetch.factionOwnership()]).catch(Av=>{console.warn("Failed to refresh starbase ownership after attack",Av)});Gg();for(const Av of[2e3,5e3,1e4])setTimeout(()=>void Gg(),Av)})(),Yp(Tm.address,p1(Tm.data)),Pt(`Attack order submitted against ${Zi.systemName}.`,"success",{presentation:"feed",title:"Starbase attack launched",targets:[$y(Zi)]}),await yp({fleetKey:Tm.address,fleetInfo:Mu,game:uf,character:_f,gw:bc,actionLabel:"Attack",onFleetRefreshed:yf.createCounterstrikeRefreshHandler(_g,Jg,.8)})',
    'console.log("✅ Attack starbase transaction sent"),Yp(Tm.address,p1(Tm.data)),Pt(`Attack order submitted against ${Zi.systemName}.`,"success",{presentation:"feed",title:"Starbase attack launched",targets:[$y(Zi)]});(()=>{const _key=Zi.systemKey,_lbl=Zi.systemName,_read=()=>{try{const list=wt?.state?.starSystems||[];const s=list.find(x=>x.address===_key||String(x.address)===String(_key));const st=s?.data?.starbase??of?.data?.starbase;const v=st?.__option==="Some"?st.value:st?.value??st;return Number(v?.hp??0)}catch{return 0}};window.__SA_RESOLVE_COMBAT?.({kind:"STARBASE",target:_lbl,preHp:_read(),readHp:_read,refetch:async()=>{try{await Kt?.refetch?.starSystem?.();await Kt?.refetch?.factionOwnership?.()}catch{}},x:_g?.target?.x,y:_g?.target?.y,toast:Pt,targets:[$y(Zi)]})})();await yp({fleetKey:Tm.address,fleetInfo:Mu,game:uf,character:_f,gw:bc,actionLabel:"Attack",onFleetRefreshed:yf.createCounterstrikeRefreshHandler(_g,Jg,.8)})',
  ],
  [
    'console.error("Failed to attack starbase:",_h),Pt(Zy(_h),"error",{title:"Starbase attack failed",targets:[$y(Zi)]})',
    'console.error("Failed to attack starbase:",_h);const _errStr=String(_h?.message||_h?.stack||JSON.stringify(_h)||"");if(/1367933016|0x51890058|Starbase contested/i.test(_errStr)){window.__SA_LOG_COMBAT_EVENT?.({type:"CONTESTED",target:Zi.systemName,damage:0});Pt(`🛡️ ${Zi.systemName} starbase is CONTESTED and under protection/cooldown! (0x51890058)`,"error",{title:`Starbase Contested — ${Zi.systemName}`,targets:[$y(Zi)]})}else if(/1367933091|0x51890023|resource=ap/i.test(_errStr)){Pt("⚡ Insufficient AP! Reload fleet AP or top up ammo.","error",{title:"AP Depleted",targets:[$y(Zi)]})}else{Pt(Zy(_h),"error",{title:"Starbase attack failed",targets:[$y(Zi)]})}',
  ],
  [
    'console.log("✅ Attack fleet transaction sent"),await yp({fleetKey:ym.address,fleetInfo:Mu,game:Tm,character:of,gw:bc,actionLabel:"Attack",onFleetRefreshed:uf.createCounterstrikeRefreshHandler(ig,Jg,.6)})',
    'console.log("✅ Attack fleet transaction sent");(()=>{const _tgt=Zi,_tKey=String(_tgt?.fleetKey||_tgt?.fleetAccount?.address||""),_lbl=_tgt?.fleetLabel||"Target Fleet",_read=()=>{try{const live=wt?.getFleet?.(_tKey);return Number(live?.data?.hp??_tgt?.fleetAccount?.data?.hp??0)}catch{return Number(_tgt?.fleetAccount?.data?.hp??0)}},_state=()=>{try{const live=wt?.getFleet?.(_tKey);return live?.data?.state?.__kind??_tgt?.fleetAccount?.data?.state?.__kind}catch{return _tgt?.fleetAccount?.data?.state?.__kind}};window.__SA_RESOLVE_COMBAT?.({kind:"FLEET",target:_lbl,preHp:_read(),readHp:_read,readState:_state,refetch:async()=>{try{await Kt?.refetch?.fleets?.()}catch{}},x:ig?.target?.x,y:ig?.target?.y,toast:Pt,targets:[Py(Zi)]})})();await yp({fleetKey:ym.address,fleetInfo:Mu,game:Tm,character:of,gw:bc,actionLabel:"Attack",onFleetRefreshed:uf.createCounterstrikeRefreshHandler(ig,Jg,.6)})',
  ],
  [
    'console.error("Failed to attack fleet:",_f),Pt(Zy(_f),"error",{title:"Fleet attack failed",targets:[Py(Zi)]})',
    'console.error("Failed to attack fleet:",_f);const _errStr=String(_f?.message||_f?.stack||JSON.stringify(_f)||"");if(/1367933091|0x51890023|resource=ap/i.test(_errStr)){Pt("⚡ Insufficient AP! Reload fleet AP or top up ammo.","error",{title:"AP Depleted",targets:[Py(Zi)]})}else if(/xp\\.rs:132|overflow/i.test(_errStr)){Pt("⚠️ SAGE Program Panic (XP Overflow). Retrying attack may succeed.","error",{title:"Program Panic",targets:[Py(Zi)]})}else{Pt(Zy(_f),"error",{title:"Fleet attack failed",targets:[Py(Zi)]})}',
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
  // --- Builder menu (CraftingHabBuildingDesigner) safe-mode — see docs/builder-menu-audit/ ---
  // 1) Hex diagram: scroll handler must not snap viewport back to stale Dr
  [
    "Ec=()=>{if(Er.active||performance.now()<rr||!Dr.hasPosition)return;const ls=Pt;if(ls){const fc=Math.max(0,ls.scrollWidth-ls.clientWidth),pc=Math.max(0,ls.scrollHeight-ls.clientHeight);if(fc===0&&pc===0)return}Lu()}",
    "Ec=()=>{}",
  ],
  // 2) Diagram: only recenter when hab name/tier key changes (not on buildingDefinitions churn)
  [
    "pc?xd():Lu()||xd(),lr=ls",
    "pc&&xd(),lr=ls",
  ],
  // 3) Catalog: kill selected-building autoscroll entirely (do NOT leave Or.record* armed — audit)
  [
    'Or.recordProgrammaticScrollTarget(su),pc.scrollTo({top:su,behavior:"smooth"})',
    "0",
  ],
  // 4) FPS: throttle diagram pulse (30Hz → 1Hz). Full kill freezes mid-ribbon phase (audit).
  [
    "const fc=window.setInterval(ls,DIAGRAM_PULSE_TICK_MS)",
    "const fc=window.setInterval(ls,1000)",
  ],
  // 5) Claim designer: do NOT paint a fake central hub from the first catalog core def when count is 0.
  // Stock: sc = installedCore ?? firstCoreDef → looks placed while CLAIM LAYOUT EMPTY; modules then fail Hi() silently.
  [
    "sc=createMemo(()=>{const ls=lo().find(nd=>Hn(nd)?(qa().get(nd.buildingId)??0)>0:!1),fc=lo().find(Hn)??null,pc=ls??fc;if(!pc)return null;const bd=qa().get(pc.buildingId)??0,Jc=mt().get(pc.buildingId)??0;return{building:pc,currentCount:bd,change:Jc,isPlaced:bd>0}})",
    "sc=createMemo(()=>{const ls=lo().find(nd=>Hn(nd)?(qa().get(nd.buildingId)??0)>0:!1);if(!ls)return null;const bd=qa().get(ls.buildingId)??0,Jc=mt().get(ls.buildingId)??0;return{building:ls,currentCount:bd,change:Jc,isPlaced:bd>0}})",
  ],
  // 6) Surface builder +/- validation errors (yn) instead of silent no-op on Support Modules / hubs.
  [
    "go=(ls,fc,pc)=>{const bd=lo().find(Jc=>Jc.buildingId===ls);return!bd||(at(ls),yn(bd,fc))?!1:(fc>0&&us(ls),ft(xs(ls,fc)),fc>0&&jr(bd,pc),fc<0&&Jr(ls),!0)}",
    'go=(ls,fc,pc)=>{const bd=lo().find(Jc=>Jc.buildingId===ls);if(!bd)return!1;at(ls);const _e=yn(bd,fc);if(_e){window.__SA_BUILDER_TIP?.(_e);return!1}return(fc>0&&us(ls),ft(xs(ls,fc)),fc>0&&jr(bd,pc),fc<0&&Jr(ls),!0)}',
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
  let exact = 0;
  let regex = 0;
  for (const [find, rep] of PATCHES) {
    if (out.split(find).length - 1 !== 1) {
      continue;
    }
    out = out.replace(find, rep);
    exact++;
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
    // Starbase success: fire-and-forget resolve (no wait on fleets+AP). Groups: $1..$14 as before.
    [
      /console\.log\("✅ Attack starbase transaction sent"\),(?:.{0,700}?,)?([A-Za-z0-9_$]+)\(([A-Za-z0-9_$]+)\.address,([A-Za-z0-9_$]+)\(\2\.data\)\),([A-Za-z0-9_$]+)\(`Attack order submitted against \$\{([A-Za-z0-9_$]+)\.systemName\}\.`,"success",\{presentation:"feed",title:"Starbase attack launched",targets:\[([A-Za-z0-9_$]+)\(\5\)\]\}\),await ([A-Za-z0-9_$]+)\(\{fleetKey:\2\.address,fleetInfo:([A-Za-z0-9_$]+),game:([A-Za-z0-9_$]+),character:([A-Za-z0-9_$]+),gw:([A-Za-z0-9_$]+),actionLabel:"Attack",onFleetRefreshed:([A-Za-z0-9_$]+)\.createCounterstrikeRefreshHandler\(([^,]+),([^,]+),0?\.8\)\}/g,
      'console.log("✅ Attack starbase transaction sent"),$1($2.address,$3($2.data)),$4(`Attack order submitted against ${$5.systemName}.`,"success",{presentation:"feed",title:"Starbase attack launched",targets:[$6($5)]});(()=>{const _key=$5.systemKey,_lbl=$5.systemName||"Starbase",_read=()=>{try{const list=(typeof wt!=="undefined"&&wt?.state?.starSystems)||[];const s=list.find(x=>x.address===_key||String(x.address)===String(_key));const st=s?.data?.starbase??(typeof of!=="undefined"?of?.data?.starbase:null);const v=st?.__option==="Some"?st.value:st?.value??st;return Number(v?.hp??0)}catch{return 0}};window.__SA_RESOLVE_COMBAT?.({kind:"STARBASE",target:_lbl,preHp:_read(),readHp:_read,refetch:async()=>{try{await Kt?.refetch?.starSystem?.();await Kt?.refetch?.factionOwnership?.()}catch{}},x:$13?.target?.x,y:$13?.target?.y,toast:$4,targets:[$6($5)]})})();await $7({fleetKey:$2.address,fleetInfo:$8,game:$9,character:$10,gw:$11,actionLabel:"Attack",onFleetRefreshed:$12.createCounterstrikeRefreshHandler($13,$14,.8)})'
    ],
    [
      /console\.error\("Failed to attack starbase:",([A-Za-z0-9_$]+)\),([A-Za-z0-9_$]+)\(([A-Za-z0-9_$]+)\(\1\),"error",\{title:"Starbase attack failed",targets:\[([^\]]+)\]\}\)/g,
      'console.error("Failed to attack starbase:",$1);const _errStr=String($1?.message||$1?.stack||JSON.stringify($1)||"");if(/1367933016|0x51890058|Starbase contested/i.test(_errStr)){window.__SA_LOG_COMBAT_EVENT?.({type:"CONTESTED",target:"Starbase",damage:0});$2(`🛡️ Starbase is CONTESTED and under protection/cooldown! (0x51890058)`,"error",{title:"Starbase Contested",targets:[$4]})}else if(/1367933091|0x51890023|resource=ap/i.test(_errStr)){$2("⚡ Insufficient AP! Reload fleet AP or top up ammo.","error",{title:"AP Depleted",targets:[$4]})}else{$2($3($1),"error",{title:"Starbase attack failed",targets:[$4]})}'
    ],
    // Fleet success: resolve in parallel with wait/AP (don't block hit toast on AP reload).
    [
      /([A-Za-z0-9_$]+)\(`Attack order submitted against \$\{([A-Za-z0-9_$]+)\.fleetLabel\}\.`,"success",\{presentation:"feed",title:"Fleet attack launched",targets:\[([A-Za-z0-9_$]+)\(\2\)\]\}\),console\.log\("✅ Attack fleet transaction sent"\),await ([A-Za-z0-9_$]+)\(\{fleetKey:([A-Za-z0-9_$]+)\.address,fleetInfo:([A-Za-z0-9_$]+),game:([A-Za-z0-9_$]+),character:([A-Za-z0-9_$]+),gw:([A-Za-z0-9_$]+),actionLabel:"Attack",onFleetRefreshed:([A-Za-z0-9_$]+)\.createCounterstrikeRefreshHandler\(([^,]+),([^,]+),0?\.6\)\}/g,
      '$1(`Attack order submitted against ${$2.fleetLabel}.`,"success",{presentation:"feed",title:"Fleet attack launched",targets:[$3($2)]}),console.log("✅ Attack fleet transaction sent");(()=>{const _tgt=$2,_tKey=String(_tgt?.fleetKey||_tgt?.fleetAccount?.address||""),_lbl=_tgt?.fleetLabel||"Target Fleet",_read=()=>{try{const live=(typeof wt!=="undefined"&&wt?.getFleet?.(_tKey))||null;return Number(live?.data?.hp??_tgt?.fleetAccount?.data?.hp??0)}catch{return Number(_tgt?.fleetAccount?.data?.hp??0)}},_state=()=>{try{const live=(typeof wt!=="undefined"&&wt?.getFleet?.(_tKey))||null;return live?.data?.state?.__kind??_tgt?.fleetAccount?.data?.state?.__kind}catch{return _tgt?.fleetAccount?.data?.state?.__kind}};window.__SA_RESOLVE_COMBAT?.({kind:"FLEET",target:_lbl,preHp:_read(),readHp:_read,readState:_state,refetch:async()=>{try{await Kt?.refetch?.fleets?.()}catch{}},x:$11?.target?.x,y:$11?.target?.y,toast:$1,targets:[$3($2)]})})();await $4({fleetKey:$5.address,fleetInfo:$6,game:$7,character:$8,gw:$9,actionLabel:"Attack",onFleetRefreshed:$10.createCounterstrikeRefreshHandler($11,$12,.6)})'
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
    ],
    // Builder menu safe-mode (name-agnostic where possible)
    // Builder menu safe-mode (regex fallbacks; must stay once-only — see audit §4.1)
    [
      /([A-Za-z0-9_$]+)=\(\)=>\{if\(([A-Za-z0-9_$]+)\.active\|\|performance\.now\(\)<([A-Za-z0-9_$]+)\|\|!([A-Za-z0-9_$]+)\.hasPosition\)return;const ([A-Za-z0-9_$]+)=([A-Za-z0-9_$]+);if\(\5\)\{const ([A-Za-z0-9_$]+)=Math\.max\(0,\5\.scrollWidth-\5\.clientWidth\),([A-Za-z0-9_$]+)=Math\.max\(0,\5\.scrollHeight-\5\.clientHeight\);if\(\7===0&&\8===0\)return\}([A-Za-z0-9_$]+)\(\)\}/g,
      "$1=()=>{}"
    ],
    // Anchor on hasPosition-bearing effect tail: only fire when Lu()||xd() pattern sits next to lr=
    [
      /([A-Za-z0-9_$]+)\?([A-Za-z0-9_$]+)\(\):([A-Za-z0-9_$]+)\(\)\|\|\2\(\),([A-Za-z0-9_$]+)=([A-Za-z0-9_$]+);nd=window\.requestAnimationFrame/g,
      "$1&&$2(),$4=$5;nd=window.requestAnimationFrame"
    ],
    [
      /\.recordProgrammaticScrollTarget\(([A-Za-z0-9_$]+)\),([A-Za-z0-9_$]+)\.scrollTo\(\{top:\1,behavior:"smooth"\}\)/g,
      "0"
    ],
    [
      /const ([A-Za-z0-9_$]+)=window\.setInterval\(([A-Za-z0-9_$]+),DIAGRAM_PULSE_TICK_MS\)/g,
      "const $1=window.setInterval($2,1000)"
    ],
    // Fake central-hub preview (structural; exact preferred)
    [
      /createMemo\(\(\)=>\{const ([A-Za-z0-9_$]+)=([A-Za-z0-9_$]+)\(\)\.find\(([A-Za-z0-9_$]+)=>\3\(\1\)\?\(([A-Za-z0-9_$]+)\(\)\.get\(\1\.buildingId\)\?\?0\)>0:!1\),([A-Za-z0-9_$]+)=\2\(\)\.find\(\3\)\?\?null,([A-Za-z0-9_$]+)=\1\?\?\5;if\(!\6\)return null;const ([A-Za-z0-9_$]+)=\4\(\)\.get\(\6\.buildingId\)\?\?0,([A-Za-z0-9_$]+)=([A-Za-z0-9_$]+)\(\)\.get\(\6\.buildingId\)\?\?0;return\{building:\6,currentCount:\7,change:\8,isPlaced:\7>0\}\}\)/g,
      "createMemo(()=>{const $1=$2().find($3=>$3($1)?($4().get($1.buildingId)??0)>0:!1);if(!$1)return null;const $7=$4().get($1.buildingId)??0,$8=$9().get($1.buildingId)??0;return{building:$1,currentCount:$7,change:$8,isPlaced:$7>0}})"
    ],
    // go() surface yn() errors (structural)
    [
      /([A-Za-z0-9_$]+)=\(([A-Za-z0-9_$]+),([A-Za-z0-9_$]+),([A-Za-z0-9_$]+)\)=>\{const ([A-Za-z0-9_$]+)=([A-Za-z0-9_$]+)\(\)\.find\(([A-Za-z0-9_$]+)=>\7\.buildingId===\2\);return!\5\|\|\(([A-Za-z0-9_$]+)\(\2\),([A-Za-z0-9_$]+)\(\5,\3\)\)\?!1:\(\3>0&&([A-Za-z0-9_$]+)\(\2\),([A-Za-z0-9_$]+)\(([A-Za-z0-9_$]+)\(\2,\3\)\),\3>0&&([A-Za-z0-9_$]+)\(\5,\4\),\3<0&&([A-Za-z0-9_$]+)\(\2\),!0\)\}/g,
      '$1=($2,$3,$4)=>{const $5=$6().find($7=>$7.buildingId===$2);if(!$5)return!1;$8($2);const _e=$9($5,$3);if(_e){window.__SA_BUILDER_TIP?.(_e);return!1}return($3>0&&$10($2),$11($12($2,$3)),$3>0&&$13($5,$4),$3<0&&$14($2),!0)}'
    ],
  ];

  for (const [re, rep] of REGEX_PATCHES) {
    // Once-only gate (mirrors exact path) — prevents runaway /g rewrites (audit §4.1)
    const hits = out.match(re);
    const nHits = hits ? hits.length : 0;
    if (nHits !== 1) continue;
    out = out.replace(re, rep);
    regex++;
  }
  const n = exact + regex;
  // Combat log + fast resolve (poll target only — do NOT wait for fleets+AP reload).
  // Hit/miss is on-chain RNG (unlike flight path); we just surface the result ASAP after confirm.
  const logInit = `
window.__SA_LOG_COMBAT_EVENT=window.__SA_LOG_COMBAT_EVENT||(function(){let min=!1;const c=document.createElement("div");c.id="sa-combat-log-box";c.style.cssText="position:fixed;bottom:16px;left:16px;width:360px;max-height:220px;background:rgba(10,15,25,0.92);backdrop-filter:blur(8px);border:1px solid rgba(0,229,255,0.35);border-radius:8px;box-shadow:0 8px 32px rgba(0,0,0,0.7);font-family:monospace;color:#e2e8f0;font-size:11px;z-index:999999;display:flex;flex-direction:column;overflow:hidden;transition:all 0.25s ease;";const h=document.createElement("div");h.style.cssText="background:rgba(0,229,255,0.15);padding:6px 10px;display:flex;align-items:center;justify-content:space-between;font-weight:bold;color:#00e5ff;letter-spacing:0.5px;user-select:none;border-bottom:1px solid rgba(0,229,255,0.2);";h.innerHTML='<span>⚔️ COMBAT LOG</span><div><button id="sa-cl-cls" style="background:none;border:none;color:#94a3b8;cursor:pointer;margin-right:6px;" title="Clear">🗑️</button><button id="sa-cl-min" style="background:none;border:none;color:#00e5ff;cursor:pointer;font-weight:bold;">[−]</button></div>';const b=document.createElement("div");b.style.cssText="padding:6px 8px;overflow-y:auto;flex:1;display:flex;flex-direction:column;gap:4px;max-height:175px;";c.appendChild(h);c.appendChild(b);const mount=()=>{if(document.body){if(!document.getElementById("sa-combat-log-box"))document.body.appendChild(c)}else setTimeout(mount,100)};mount();h.querySelector("#sa-cl-cls").onclick=()=>{b.innerHTML=""};h.querySelector("#sa-cl-min").onclick=()=>{min=!min;c.style.maxHeight=min?"30px":"220px";b.style.display=min?"none":"flex";h.querySelector("#sa-cl-min").textContent=min?"[+]":"[−]"};const paint=(r,e)=>{const time=new Date().toLocaleTimeString("en-US",{hour12:!1});let icon="🎯",color="#f87171",msg="";const dmg=Number(e.damage||0);if(e.type==="PENDING"){icon="⏳";color="#67e8f9";msg=e.kind==="STARBASE"?\`<span style="color:#67e8f9;font-weight:bold;">RESOLVING</span> <b style="color:#fff">\${e.target||"?"}</b> starbase…\`:\`<span style="color:#67e8f9;font-weight:bold;">RESOLVING</span> vs <b style="color:#fff">\${e.target||"?"}</b>…\`}else if(e.type==="HIT"){icon="🎯";color="#f87171";msg=\`<span style="color:#ef4444;font-weight:bold;">HIT</span> vs <b style="color:#fff">\${e.target||"?"}</b> <span style="color:#f87171;font-weight:bold;">-\${dmg.toLocaleString()} HP</span>\`}else if(e.type==="MISS"){icon="❌";color="#9ca3af";msg=\`<span style="color:#9ca3af;font-weight:bold;">MISS</span> vs <b style="color:#fff">\${e.target||"?"}</b> (0 DMG)\`}else if(e.type==="STARBASE"){icon="🏰";color=dmg>0?"#f87171":"#9ca3af";msg=\`<span style="color:\${color};font-weight:bold;">STARBASE</span> @ <b style="color:#fff">\${e.target||"?"}</b> \${dmg>0?\`<span style="color:#f87171;font-weight:bold;">-\${dmg.toLocaleString()} HP</span>\`:"(0 DMG)"}\`}else if(e.type==="FLEE"){icon="🏃";color="#fbbf24";msg=\`<span style="color:#fbbf24;font-weight:bold;">FLEE</span> <b style="color:#fff">\${e.target||"?"}</b> warped away / exited sector!\`}else if(e.type==="CONTESTED"){icon="🛡️";color="#fbbf24";msg=\`<span style="color:#fbbf24;font-weight:bold;">CONTESTED</span> · <b style="color:#fff">\${e.target||"?"}</b> starbase under protection/cooldown\`}else{msg=String(e.type||"EVENT")+" "+(e.target||"")}r.innerHTML=\`<span style="color:#64748b;">[\${time}]</span> \${icon} \${msg}\`;r.dataset.saTarget=String(e.target||"");r.dataset.saType=String(e.type||"")};return function(e){try{let r=null;if(e.type!=="PENDING"){const rows=[...b.children];for(let i=rows.length-1;i>=0;i--){if(rows[i].dataset.saType==="PENDING"&&rows[i].dataset.saTarget===String(e.target||"")){r=rows[i];break}}}if(!r){r=document.createElement("div");r.style.cssText="line-height:1.35;border-bottom:1px solid rgba(255,255,255,0.06);padding-bottom:2px;";b.appendChild(r)}paint(r,e);b.scrollTop=b.scrollHeight;if(e.type==="PENDING")return;const dmg=Number(e.damage||0);const color=e.type==="FLEE"||e.type==="CONTESTED"?"#fbbf24":dmg>0?"#f87171":"#9ca3af";const vw=window.innerWidth||0,vh=window.innerHeight||0;const onScreen=Number.isFinite(e.x)&&Number.isFinite(e.y)&&e.x>0&&e.y>0&&e.x<vw&&e.y<vh;const left=onScreen?e.x:vw/2,top=onScreen?e.y-25:vh*.35;const txt=dmg>0?\`-\${dmg.toLocaleString()} HP\`:(e.type==="FLEE"?"FLED!":e.type==="CONTESTED"?"CONTESTED":"MISS");const pop=document.createElement("div");pop.textContent=txt;pop.style.cssText=\`position:fixed;left:\${left}px;top:\${top}px;transform:translate(-50%,-50%);font-family:monospace;font-weight:900;font-size:22px;color:\${color};text-shadow:0 0 8px #000,2px 2px 0 #000;pointer-events:none;z-index:999999;animation:saFloatUp 1.4s cubic-bezier(0.2,0.8,0.2,1) forwards;\`;if(!document.getElementById("sa-c-style")){const s=document.createElement("style");s.id="sa-c-style";s.textContent="@keyframes saFloatUp{0%{opacity:0;transform:translate(-50%,0) scale(.6)}15%{opacity:1;transform:translate(-50%,-20px) scale(1.25)}70%{opacity:1;transform:translate(-50%,-45px) scale(1)}100%{opacity:0;transform:translate(-50%,-65px) scale(.8)}}";document.head.appendChild(s)}document.body.appendChild(pop);setTimeout(()=>pop.remove(),1400)}catch(_err){console.warn("%c ⚔️ sa-ui-fixes %c ⚠️ combat log","background:#0a0f19;color:#00e5ff;border:1px solid #00e5ff55;padding:1px 6px;border-radius:3px;font-weight:700","color:#fbbf24;font-weight:600",_err)}}})();
window.__SA_RESOLVE_COMBAT=window.__SA_RESOLVE_COMBAT||(function(){const sleep=ms=>new Promise(r=>setTimeout(r,ms));return async function(o){try{const log=window.__SA_LOG_COMBAT_EVENT;const pre=Number(o.preHp||0);log?.({type:"PENDING",kind:o.kind,target:o.target,damage:0});let dmg=0,flee=!1;const steps=[0,100,250,450,750,1200,1800,2600];let prev=0;for(const t of steps){if(t)await sleep(t-prev);prev=t;try{await o.refetch?.()}catch{}const post=Number(o.readHp?.()??0);dmg=Math.max(0,pre-post);if(o.kind==="FLEET"){const st=o.readState?.();flee=st==="MoveWarp"||st==="MoveSubwarp";if(flee)break}if(dmg>0)break}if(o.kind==="FLEET"){const type=flee?"FLEE":(dmg>0?"HIT":"MISS");log?.({type,target:o.target,damage:dmg,x:o.x,y:o.y});const msg=flee?\`🏃 FLEE! Target fleet \${o.target} fled the area!\`:(dmg>0?\`🎯 HIT! Dealt \${dmg.toLocaleString()} damage to \${o.target}.\`:\`❌ MISS! Attack against \${o.target} missed.\`);o.toast?.(msg,flee?"info":(dmg>0?"success":"warning"),{presentation:"feed",title:flee?\`Fled — \${o.target}\`:(dmg>0?\`Hit — \${o.target}\`:\`Miss — \${o.target}\`),targets:o.targets})}else{log?.({type:"STARBASE",target:o.target,damage:dmg,x:o.x,y:o.y});const msg=dmg>0?\`🎯 HIT! Dealt \${dmg.toLocaleString()} damage to \${o.target} starbase.\`:\`❌ MISS! Attack on \${o.target} starbase missed.\`;o.toast?.(msg,dmg>0?"success":"warning",{presentation:"feed",title:dmg>0?\`Starbase Hit — \${o.target}\`:\`Starbase Miss — \${o.target}\`,targets:o.targets})}}catch(_e){console.warn("%c ⚔️ sa-ui-fixes %c ⚠️ combat resolve","background:#0a0f19;color:#00e5ff;border:1px solid #00e5ff55;padding:1px 6px;border-radius:3px;font-weight:700","color:#fbbf24;font-weight:600",_e)}}})();
window.__SA_BUILDER_TIP=window.__SA_BUILDER_TIP||(function(){let el=null,hideT=0;const ensure=()=>{if(el&&el.isConnected)return el;el=document.createElement("div");el.id="sa-builder-tip";el.style.cssText="position:fixed;left:50%;bottom:28px;transform:translateX(-50%);z-index:1000000;max-width:min(520px,92vw);padding:10px 14px;border-radius:8px;background:rgba(15,23,42,.94);border:1px solid rgba(251,191,36,.55);color:#fde68a;font:600 13px/1.35 ui-monospace,Menlo,monospace;box-shadow:0 10px 40px rgba(0,0,0,.55);pointer-events:none;opacity:0;transition:opacity .15s ease";document.body?document.body.appendChild(el):setTimeout(ensure,50);return el};return function(msg){const n=ensure();n.textContent="🏗️ "+String(msg||"");n.style.opacity="1";clearTimeout(hideT);hideT=setTimeout(()=>{n.style.opacity="0"},4200);try{console.log("%c ⚔️ sa-ui-fixes %c 🏗️ "+msg,"background:#0a0f19;color:#00e5ff;border:1px solid #00e5ff55;padding:1px 6px;border-radius:3px;font-weight:700","color:#fbbf24;font-weight:600")}catch(_){}}})();
`;
  out = logInit + out;
  return { out, n, exact, regex, regexTotal: REGEX_PATCHES.length };
}

function rewrite(src, entry) {
  const base = entry.replace(/[^/]+(?:\?.*)?$/, "");
  return src
    .replace(/(["'])\.\/([A-Za-z0-9_.-]+\.js)\1/g, `$1${base}$2$1`)
    .replace(/\bimport\.meta\.url\b/g, JSON.stringify(entry));
}

const VER = chrome.runtime.getManifest().version;
sbanner(VER);
neutralize();

(async () => {
  try {
    let entry = await entryUrl();
    for (let i = 0; !entry && i < 25; i++) {
      await new Promise((r) => setTimeout(r, 40));
      entry = await entryUrl();
    }
    if (!entry) throw new Error("no entry bundle (assets/index-*.js)");

    const entryName = String(entry).split("/").pop() || entry;
    slog("info", "📦", `entry found → ${entryName}`);

    await msg({ type: "sa-fixes-set-entry-block", entryUrl: entry });
    slog("dim", "🛡️", "stock entry blocked (DNR)");

    const res = await fetch(entry, { cache: "no-cache" });
    if (!res.ok) throw new Error("fetch " + res.status);
    const { out, n, exact, regex, regexTotal } = apply(await res.text());
    const code = rewrite(out, entry);
    slog(
      n > 0 ? "ok" : "warn",
      "🩹",
      `patches landed ×${n}  ·  exact ${exact}/${PATCHES.length}  ·  regex ${regex}/${regexTotal}`,
    );
    slog("info", "⚔️", "combat log + hit/miss HUD injected");

    for (const id of ["root", "modal-root"]) {
      const el = document.getElementById(id);
      if (el) el.innerHTML = "";
    }
    neutralize();

    const r = await msg({ type: "sa-fixes-inject-module", code, entryUrl: entry });
    if (!r?.ok) throw new Error(r?.error || "inject failed");
    if (r?.skipped) {
      slog("warn", "♻️", "module already booted — skipped re-inject");
    } else {
      slog("ok", "✅", "patched MAIN module live — you are running LEEKS UI fixes");
    }
  } catch (e) {
    slog("err", "💥", "patch boot failed", e);
  }
})();
