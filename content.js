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
  // Dirty fingerprint: include HP so pin HP bars refresh without full galaxy thrash
  [
    'nd=Object.values(Jc).map(su=>`${su.name}@${su.coordinates[0]},${su.coordinates[1]}:${su.owner??"none"}:L${su.starbaseLevel??0}:${su.core?"core":"not"}:${su.planetCount}:${su.asteroidCount}:${(su.stars??[]).length}`)',
    'nd=Object.values(Jc).map(su=>`${su.name}@${su.coordinates[0]},${su.coordinates[1]}:${su.owner??"none"}:L${su.starbaseLevel??0}:H${((su.starbaseHpFraction??0)*100)|0}:${su.core?"core":"not"}:${su.planetCount}:${su.asteroidCount}:${(su.stars??[]).length}`)',
  ],
  [
    '.map(hl=>`${hl.name}@${hl.coordinates[0]},${hl.coordinates[1]}:${hl.owner??"none"}:L${hl.starbaseLevel??0}:${hl.core?"core":"not"}:${hl.planetCount}:${hl.asteroidCount}:${(hl.stars??[]).length}`)',
    '.map(hl=>`${hl.name}@${hl.coordinates[0]},${hl.coordinates[1]}:${hl.owner??"none"}:L${hl.starbaseLevel??0}:H${((hl.starbaseHpFraction??0)*100)|0}:${hl.core?"core":"not"}:${hl.planetCount}:${hl.asteroidCount}:${(hl.stars??[]).length}`)',
  ],

  [
    "ht=nt?.hp??mt,vt=Math.max(nt?.maxHp??mt,ht),St=nt?.sp??ft,Ct=Math.max(nt?.maxSp??ft,St)",
    "ht=nt?.hp??0,vt=Math.max(nt?.maxHp??mt,ht),St=nt?.sp??0,Ct=Math.max(nt?.maxSp??ft,St)",
  ],
  [
    "function resolveDisplayOwner(ee,Se,nt,at){const mt=nt.get(String(ee));return mt&&at.hasStarbase&&String(mt.gameId)===String(at.gameId)&&mt.capturedSeqId===at.systemSeqId&&mt.controllingFaction>0?mt.controllingFaction:Se}",
    "function resolveDisplayOwner(ee,Se,nt,at){const mt=nt.get(String(ee));const f=mt!=null?Number(mt.controllingFaction):NaN;return mt&&at.hasStarbase&&String(mt.gameId)===String(at.gameId)&&(f===1||f===2||f===3)?f:Se}",
  ],
  // Coalesce stock ownership refresh storm (0+2s+5s+10s full refetch) → single-flight 0/1.5/6s
  [
    '(()=>{const Pg=()=>Promise.all([Kt.refetch.starSystem(),Kt.refetch.factionOwnership()]).catch(xv=>{console.warn("Failed to refresh starbase ownership after attack",xv)});Pg();for(const xv of[2e3,5e3,1e4])setTimeout(()=>void Pg(),xv)})(),',
    '(()=>{window.__SA_COALESCE_MAP_REFRESH__?.(Kt.refetch,{});})(),',
  ],
  // Live bundle (index-CZzek2X2+): resolve hit/miss ASAP via starSystem poll (parallel to fleets+AP).
  // Stock now inserts extra $1(fleet,ap)/e1(...) between refetch IIFE and Pt toast — exact anchors updated.
  [
    'console.log("✅ Attack starbase transaction sent"),(()=>{const Pg=()=>Promise.all([Kt.refetch.starSystem(),Kt.refetch.factionOwnership()]).catch(xv=>{console.warn("Failed to refresh starbase ownership after attack",xv)});Pg();for(const xv of[2e3,5e3,1e4])setTimeout(()=>void Pg(),xv)})(),$1(xm.address,Tp(xm.data)),e1(xm.address,!0),Pt(`Attack order submitted against ${Zi.systemName}.`,"success",{presentation:"feed",title:"Starbase attack launched",targets:[Ly(Zi)]}),await R1({fleetKey:xm.address,fleetInfo:xu,game:df,character:Af,gw:_c,actionLabel:"Attack",onFleetRefreshed:Rf.createCounterstrikeRefreshHandler(_g,dv,.8)})',
    'console.log("✅ Attack starbase transaction sent"),$1(xm.address,Tp(xm.data)),e1(xm.address,!0),Pt(`Attack order submitted against ${Zi.systemName}.`,"success",{presentation:"feed",title:"Starbase attack launched",targets:[Ly(Zi)]});(()=>{const _key=Zi.systemKey,_lbl=Zi.systemName,_snap=_g,_toast=Pt,_tgt=[Ly(Zi)],_read=()=>{try{const list=wt?.state?.starSystems||[];const s=list.find(x=>x.address===_key||String(x.address)===String(_key));const st=s?.data?.starbase??of?.data?.starbase;const v=st?.__option==="Some"?st.value:st?.value??st;return Number(v?.hp??0)}catch{return 0}},_readOwner=()=>{try{const map=wt?.state?.map?.systems||{};let sys=map[_key]||map[String(_key)];if(!sys){for(const k of Object.keys(map)){const m=map[k];if(m&&(m.name===_lbl||String(m._systemId)===String(_key)||m.address===_key)){sys=m;break}}}if(sys?.owner!=null)return sys.owner;const list=wt?.state?.starSystems||[];const s=list.find(x=>x.address===_key||String(x.address)===String(_key));return s?.data?.owner??s?.owner??null}catch{return null}};window.__SA_RESOLVE_COMBAT?.({kind:"STARBASE",target:_lbl,preHp:_read(),preOwner:_readOwner(),readHp:_read,readOwner:_readOwner,refetch:async()=>{try{await Kt?.refetch?.starSystem?.();await Kt?.refetch?.factionOwnership?.();window.__SA_MAP_BUMP__?.afterData?.({name:_lbl})}catch{}},x:_snap?.target?.x,y:_snap?.target?.y,sx:_snap?.source?.x,sy:_snap?.source?.y,toast:_toast,targets:_tgt})})();await R1({fleetKey:xm.address,fleetInfo:xu,game:df,character:Af,gw:_c,actionLabel:"Attack",onFleetRefreshed:window.__SA_WRAP_CS?.(Rf.createCounterstrikeRefreshHandler(_g,dv,.8),{attacker:_g?.attacker,coords:_g,toast:Pt,target:Zi.systemName,targets:[Ly(Zi)]})||Rf.createCounterstrikeRefreshHandler(_g,dv,.8)})',
  ],
  [
    'console.error("Failed to attack starbase:",_h),Pt(Zy(_h),"error",{title:"Starbase attack failed",targets:[$y(Zi)]})',
    'console.error("Failed to attack starbase:",_h);const _errStr=String(_h?.message||_h?.stack||JSON.stringify(_h)||"");if(/1367933016|0x51890058|Starbase contested/i.test(_errStr)){window.__SA_LOG_COMBAT_EVENT?.({type:"CONTESTED",target:Zi.systemName,damage:0});Pt(`🛡️ ${Zi.systemName} starbase is CONTESTED and under protection/cooldown! (0x51890058)`,"error",{title:`Starbase Contested — ${Zi.systemName}`,targets:[$y(Zi)]})}else if(/1367933091|0x51890023|resource=ap/i.test(_errStr)){Pt("⚡ Insufficient AP! Reload fleet AP or top up ammo.","error",{title:"AP Depleted",targets:[$y(Zi)]})}else{Pt(Zy(_h),"error",{title:"Starbase attack failed",targets:[$y(Zi)]})}',
  ],
  [
    'console.log("✅ Attack fleet transaction sent"),await yp({fleetKey:ym.address,fleetInfo:Mu,game:Tm,character:of,gw:bc,actionLabel:"Attack",onFleetRefreshed:uf.createCounterstrikeRefreshHandler(ig,Jg,.6)})',
    'console.log("✅ Attack fleet transaction sent");(()=>{const _tgt=Zi,_tKey=String(_tgt?.fleetKey||_tgt?.fleetAccount?.address||""),_lbl=_tgt?.fleetLabel||"Target Fleet",_read=()=>{try{const live=wt?.getFleet?.(_tKey);return Number(live?.data?.hp??_tgt?.fleetAccount?.data?.hp??0)}catch{return Number(_tgt?.fleetAccount?.data?.hp??0)}},_state=()=>{try{const live=wt?.getFleet?.(_tKey);return live?.data?.state?.__kind??_tgt?.fleetAccount?.data?.state?.__kind}catch{return _tgt?.fleetAccount?.data?.state?.__kind}};window.__SA_RESOLVE_COMBAT?.({kind:"FLEET",target:_lbl,preHp:_read(),readHp:_read,readState:_state,refetch:async()=>{try{await Kt?.refetch?.fleets?.()}catch{}},x:ig?.target?.x,y:ig?.target?.y,sx:ig?.source?.x,sy:ig?.source?.y,toast:Pt,targets:[Py(Zi)]})})();await yp({fleetKey:ym.address,fleetInfo:Mu,game:Tm,character:of,gw:bc,actionLabel:"Attack",onFleetRefreshed:window.__SA_WRAP_CS?.(uf.createCounterstrikeRefreshHandler(ig,Jg,.6),{attacker:ig?.attacker,coords:ig,toast:Pt,target:Zi?.fleetLabel||"Target Fleet",targets:[Py(Zi)]})||uf.createCounterstrikeRefreshHandler(ig,Jg,.6)})',
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
  // Macro map star glows: SIZE_MULTIPLIER 14 + Ustur tint #ffaa00 (16755200) + blend add = map-wide yellow wash
  // when zoomed (dump cover 1000%–millions%). Shrink + dim.
  [
    "GLOW:{SIZE_MULTIPLIER:14,ALPHA:.15,BASE_ALPHA:.08,PULSE_ALPHA_RANGE:.05}",
    "GLOW:{SIZE_MULTIPLIER:3,ALPHA:.05,BASE_ALPHA:.02,PULSE_ALPHA_RANGE:.012}",
  ],
  // Per-frame pulse overwrites alpha every tick — hard-cap so wash cannot return.
  [
    "Ct.starGlow.alpha=SYSTEM_STAR_CONFIG.GLOW.BASE_ALPHA+$t*SYSTEM_STAR_CONFIG.GLOW.PULSE_ALPHA_RANGE",
    "Ct.starGlow.alpha=Math.min(.04,SYSTEM_STAR_CONFIG.GLOW.BASE_ALPHA+$t*SYSTEM_STAR_CONFIG.GLOW.PULSE_ALPHA_RANGE)",
  ],
  // Detail-view base glow was .45 (gold flood when zoomed into captured system).
  [
    "GLOW_BASE_ALPHA:.45,GLOW_PULSE_RANGE:.15",
    "GLOW_BASE_ALPHA:.08,GLOW_PULSE_RANGE:.04",
  ],
  // Capture while zoomed-in: detail outer glow (screen + faction tint)
  // index-CZzek2X2.js: bo/Ps/ws/Mo/zs
  [
    'Ps=Math.max(SYSTEM_DETAIL_CONFIG.STAR.GLOW_RADIUS*4,Et*4.65)*dn.glowRadiusMultiplier*Zr/yn,bo.scale.set(Ps,Ps*vt),bo.tint=new Color(Kt).toNumber(),ws=Math.min(.56,SYSTEM_DETAIL_CONFIG.STAR.GLOW_BASE_ALPHA*1.02*dn.glowAlphaMultiplier),bo.alpha=ws*.72,bo.blendMode="screen",bo.zIndex=145,bo.position.set(Mo,zs),ht.addChild(bo)',
    'Ps=Math.max(SYSTEM_DETAIL_CONFIG.STAR.GLOW_RADIUS*1.35,Et*1.55)*dn.glowRadiusMultiplier*Zr/yn,bo.scale.set(Ps,Ps*vt),bo.tint=new Color(Kt).toNumber(),ws=Math.min(.08,SYSTEM_DETAIL_CONFIG.STAR.GLOW_BASE_ALPHA*.18*dn.glowAlphaMultiplier),bo.alpha=ws*.18,bo.blendMode="screen",bo.zIndex=145,bo.position.set(Mo,zs),ht.addChild(bo)',
  ],
  // Soften primary-star mesh faction blend (uColorBase/uColorHot) so capture is not a gold flood.
  [
    "if(Ki===0){const xs=new Color(Kt).toArray();Ts=[xs[0]*.58+lo[0]*.42,xs[1]*.58+lo[1]*.42,xs[2]*.58+lo[2]*.42],Pa=[Math.min(1,.94+xs[0]*.06),Math.min(1,.8+xs[1]*.13),Math.min(1,.52+xs[2]*.15)]}",
    "if(Ki===0){const xs=new Color(Kt).toArray();Ts=[xs[0]*.22+lo[0]*.78,xs[1]*.22+lo[1]*.78,xs[2]*.22+lo[2]*.78],Pa=[Math.min(1,.86+xs[0]*.03),Math.min(1,.72+xs[1]*.06),Math.min(1,.45+xs[2]*.08)]}",
  ],
  // After owner/HP signature recreate, always keep macro star hidden while detail is visible
  // (macro glow × high zoom also washes gold after Ustur tint).
  [
    "recreateDetailView(Se,nt,at,mt,ft,ht){const vt=Se.isVisible,St=Se.container.alpha,Ct=Se.container.renderable;this.removeDetailView(Se);const $t=this.createDetailView(nt,at,mt,ft,ht);return $t.isVisible=vt,$t.container.alpha=St,$t.container.renderable=Ct,this.activeDetails.set(ht,$t),this.viewport.addChild($t.container),$t}",
    "recreateDetailView(Se,nt,at,mt,ft,ht){const vt=Se.isVisible,St=Se.container.alpha,Ct=Se.container.renderable;this.removeDetailView(Se);const $t=this.createDetailView(nt,at,mt,ft,ht);return $t.isVisible=vt,$t.container.alpha=St,$t.container.renderable=Ct,this.activeDetails.set(ht,$t),this.viewport.addChild($t.container),vt&&this.hideStarSprite(ht),$t}",
  ],
  [
    'SystemHoverTooltip=ee=>{const Se=createMemo(()=>ee.system?{name:getFactionName$1(ee.system.owner),color:getFactionColor$1(ee.system.owner)}:{name:"NEUTRAL",color:"#9ca3af"}),nt=createMemo(()=>ee.regionColor||Se().color),at=createMemo(()=>ee.system?.planetCount||0),mt=createMemo(()=>1),ft=createMemo(()=>{if(!ee.system)return 0;const Et=ee.system.starbaseLevel;return Et===null?0:Number(Et)}),{store:ht}=useDataSource(),',
    'SystemHoverTooltip=ee=>{const{store:ht}=useDataSource(),liveOwner=createMemo(()=>{const gn=ee.system;if(!gn)return null;const Jr=gn._systemId;const Sn=Jr!=null?(ht.state.map?.systems?.[Jr]??ht.state.map?.systems?.[String(Jr)]):null;return Sn?.owner??gn.owner??null}),Se=createMemo(()=>{const o=liveOwner();return o!=null?{name:getFactionName$1(o),color:getFactionColor$1(o)}:{name:"NEUTRAL",color:"#9ca3af"}}),nt=createMemo(()=>ee.regionColor||Se().color),at=createMemo(()=>ee.system?.planetCount||0),mt=createMemo(()=>1),ft=createMemo(()=>{const gn=ee.system;if(!gn)return 0;const Jr=gn._systemId;const Sn=Jr!=null?(ht.state.map?.systems?.[Jr]??ht.state.map?.systems?.[String(Jr)]):null;let lv=Sn?.starbaseLevel??gn.starbaseLevel;const acc=(ht.state.starSystems??[]).find(H=>H.exists&&H.data.name===gn.name);const sb=acc?.data?.starbase;if(sb&&sb.__option==="Some"&&sb.value){const v=sb.value;const L=Number(v.level);if(Number.isFinite(L))lv=L;const hp=Number(v.hp);if(Number.isFinite(hp)&&hp<=0&&lv>0)return lv-1}return lv==null?0:Number(lv)}),',
  ],
  [
    "getFactionLogoMaskStyle(ee.system?.owner,nt())",
    "getFactionLogoMaskStyle(liveOwner()??ee.system?.owner,nt())",
  ],
  // LIVE (CZzek2X2+): stock destroys+recreates pin on owner change — expensive + glow wash.
  // Surgical re-tint/retexture instead (keep pulse registration / container).
  [
    "const Dt=wt().get(Ft);if(Dt){const Po=convertOwnerToFaction(Lt.owner);if(!shouldRecreateStarSystemVisuals(Dt,Po))continue;Dt.parent?.removeChild(Dt),Dt.destroy({children:!0}),Rt(Jn=>{const An=new Map(Jn);return An.delete(Ft),An})}",
    "const Dt=wt().get(Ft);if(Dt){const Po=convertOwnerToFaction(Lt.owner);if(!shouldRecreateStarSystemVisuals(Dt,Po))continue;Dt._systemOwner=Po;const _saT=cachedColorNumber(getFactionColorFromOwner(Lt.owner)),_saC=mt.get(Po)||mt.get(\"DEFAULT_GLOW\");if(Dt._starGlow){Dt._starGlow.tint=_saT;Dt._starGlow.alpha=.04}if(Dt._starCore){_saC&&(Dt._starCore.texture=_saC);Dt._starCore.tint=_saT}if(Dt._softHalo)Dt._softHalo.tint=_saT;continue}",
  ],
  // LEGACY (pre-shouldRecreate): early-continue never re-tinted — keep for older entry hashes
  [
    "if(!Lt||wt().get(Ft))continue;if(Lt.coordinates.length<2)",
    "if(!Lt)continue;{const _ex=wt().get(Ft);if(_ex){if(_ex._saOwner===Lt.owner&&_ex._systemOwner===convertOwnerToFaction(Lt.owner))continue;_ex._saOwner=Lt.owner;_ex._systemOwner=convertOwnerToFaction(Lt.owner);const _t=cachedColorNumber(getFactionColorFromOwner(Lt.owner)),_f=convertOwnerToFaction(Lt.owner),_c=mt.get(_f)||mt.get(\"DEFAULT_GLOW\");if(_ex._starGlow){_ex._starGlow.tint=_t;_ex._starGlow.alpha=.04}if(_ex._starCore){_c&&(_ex._starCore.texture=_c);_ex._starCore.tint=_t}if(_ex._softHalo)_ex._softHalo.tint=_t;continue}}if(Lt.coordinates.length<2)",
  ],
  // Clamp create-time glow alpha (stock GLOW.ALPHA .15) — pulse also hard-capped separately
  [
    'vr.alpha=SYSTEM_STAR_CONFIG.GLOW.ALPHA,vr.blendMode="add",vr.zIndex=10,Ar.addChild(vr),Ar._starGlow=vr',
    'vr.alpha=Math.min(.05,SYSTEM_STAR_CONFIG.GLOW.ALPHA),vr.blendMode="add",vr.zIndex=10,Ar.addChild(vr),Ar._starGlow=vr',
  ],
  // Expose map viewport + pixi app for combat float world→screen projection
  [
    "this.pixiApp=Se,this.viewport=nt,this.sinLUT=new Float32Array(this.LUT_SIZE)",
    "this.pixiApp=Se,this.viewport=nt,window.__SA_MAP_VIEWPORT__=nt,window.__SA_PIXI_APP__=Se,this.sinLUT=new Float32Array(this.LUT_SIZE)",
  ],
  [
    "this.renderer=Se,this.viewport=nt,this.textureGenerator=new FleetTextureGenerator(Se)",
    "this.renderer=Se,this.viewport=nt,window.__SA_MAP_VIEWPORT__=nt,window.__SA_PIXI_APP__=Se,this.textureGenerator=new FleetTextureGenerator(Se)",
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
    // Stock ownership refresh storm → coalesce (name-agnostic)
    [
      /\(\(\)=>\{const ([A-Za-z0-9_$]+)=\(\)=>Promise\.all\(\[([A-Za-z0-9_$]+)\.refetch\.starSystem\(\),([A-Za-z0-9_$]+)\.refetch\.factionOwnership\(\)\]\)\.catch\(([A-Za-z0-9_$]+)=>\{console\.warn\("Failed to refresh starbase ownership after attack",\4\)\}\);\1\(\);for\(const ([A-Za-z0-9_$]+) of\[2e3,5e3,1e4\]\)setTimeout\(\(\)=>void \1\(\),\5\)\}\)\(\),/g,
      '(()=>{window.__SA_COALESCE_MAP_REFRESH__?.($2.refetch,{});})(),'
    ],
    // Starbase success: fire-and-forget resolve. Middle section (refetch IIFE + optional AP hooks) is flexible.
    // Captures: $1=Pt toast, $2=Zi system, $3=target helper, $4=await yp/R1, $5=fleet acct, $6=fleetInfo,
    // $7=game, $8=character, $9=gw, $10=counterstrike holder, $11=vfx snap, $12=vfx t0.
    // NOTE: must include await-call closing ")".
    [
      /console\.log\("✅ Attack starbase transaction sent"\),.{0,500}?([A-Za-z0-9_$]+)\(`Attack order submitted against \$\{([A-Za-z0-9_$]+)\.systemName\}\.`,"success",\{presentation:"feed",title:"Starbase attack launched",targets:\[([A-Za-z0-9_$]+)\(\2\)\]\}\),await ([A-Za-z0-9_$]+)\(\{fleetKey:([A-Za-z0-9_$]+)\.address,fleetInfo:([A-Za-z0-9_$]+),game:([A-Za-z0-9_$]+),character:([A-Za-z0-9_$]+),gw:([A-Za-z0-9_$]+),actionLabel:"Attack",onFleetRefreshed:([A-Za-z0-9_$]+)\.createCounterstrikeRefreshHandler\(([^,]+),([^,]+),0?\.8\)\}\)/g,
      'console.log("✅ Attack starbase transaction sent"),$1(`Attack order submitted against ${$2.systemName}.`,"success",{presentation:"feed",title:"Starbase attack launched",targets:[$3($2)]});(()=>{const _key=$2.systemKey,_lbl=$2.systemName||"Starbase",_snap=$11,_toast=$1,_tgt=[$3($2)],_read=()=>{try{const list=(typeof wt!=="undefined"&&wt?.state?.starSystems)||[];const s=list.find(x=>x.address===_key||String(x.address)===String(_key));const st=s?.data?.starbase;const v=st?.__option==="Some"?st.value:st?.value??st;return Number(v?.hp??0)}catch{return 0}},_readOwner=()=>{try{const map=(typeof wt!=="undefined"&&wt?.state?.map?.systems)||{};let sys=map[_key]||map[String(_key)];if(!sys){for(const k of Object.keys(map)){const m=map[k];if(m&&(m.name===_lbl||String(m._systemId)===String(_key)||m.address===_key)){sys=m;break}}}if(sys?.owner!=null)return sys.owner;const list=(typeof wt!=="undefined"&&wt?.state?.starSystems)||[];const s=list.find(x=>x.address===_key||String(x.address)===String(_key));return s?.data?.owner??s?.owner??null}catch{return null}};window.__SA_RESOLVE_COMBAT?.({kind:"STARBASE",target:_lbl,preHp:_read(),preOwner:_readOwner(),readHp:_read,readOwner:_readOwner,refetch:async()=>{try{await Kt?.refetch?.starSystem?.();await Kt?.refetch?.factionOwnership?.();window.__SA_MAP_BUMP__?.afterData?.({name:_lbl})}catch{}},x:_snap?.target?.x,y:_snap?.target?.y,sx:_snap?.source?.x,sy:_snap?.source?.y,toast:_toast,targets:_tgt})})();await $4({fleetKey:$5.address,fleetInfo:$6,game:$7,character:$8,gw:$9,actionLabel:"Attack",onFleetRefreshed:window.__SA_WRAP_CS?.($10.createCounterstrikeRefreshHandler($11,$12,.8),{attacker:$11?.attacker,coords:$11,toast:$1,target:$2.systemName||"Starbase",targets:[$3($2)]})||$10.createCounterstrikeRefreshHandler($11,$12,.8)})'
    ],
    [
      /console\.error\("Failed to attack starbase:",([A-Za-z0-9_$]+)\),([A-Za-z0-9_$]+)\(([A-Za-z0-9_$]+)\(\1\),"error",\{title:"Starbase attack failed",targets:\[([^\]]+)\]\}\)/g,
      'console.error("Failed to attack starbase:",$1);const _errStr=String($1?.message||$1?.stack||JSON.stringify($1)||"");if(/1367933016|0x51890058|Starbase contested/i.test(_errStr)){window.__SA_LOG_COMBAT_EVENT?.({type:"CONTESTED",target:"Starbase",damage:0});$2(`🛡️ Starbase is CONTESTED and under protection/cooldown! (0x51890058)`,"error",{title:"Starbase Contested",targets:[$4]})}else if(/1367933091|0x51890023|resource=ap/i.test(_errStr)){$2("⚡ Insufficient AP! Reload fleet AP or top up ammo.","error",{title:"AP Depleted",targets:[$4]})}else{$2($3($1),"error",{title:"Starbase attack failed",targets:[$4]})}'
    ],
    // Fleet success: resolve in parallel with wait/AP (don't block hit toast on AP reload).
    // NOTE: match must include the await-call closing ")" (same bug class as starbase success).
    [
      /([A-Za-z0-9_$]+)\(`Attack order submitted against \$\{([A-Za-z0-9_$]+)\.fleetLabel\}\.`,"success",\{presentation:"feed",title:"Fleet attack launched",targets:\[([A-Za-z0-9_$]+)\(\2\)\]\}\),console\.log\("✅ Attack fleet transaction sent"\),await ([A-Za-z0-9_$]+)\(\{fleetKey:([A-Za-z0-9_$]+)\.address,fleetInfo:([A-Za-z0-9_$]+),game:([A-Za-z0-9_$]+),character:([A-Za-z0-9_$]+),gw:([A-Za-z0-9_$]+),actionLabel:"Attack",onFleetRefreshed:([A-Za-z0-9_$]+)\.createCounterstrikeRefreshHandler\(([^,]+),([^,]+),0?\.6\)\}\)/g,
      '$1(`Attack order submitted against ${$2.fleetLabel}.`,"success",{presentation:"feed",title:"Fleet attack launched",targets:[$3($2)]}),console.log("✅ Attack fleet transaction sent");(()=>{const _tgt=$2,_tKey=String(_tgt?.fleetKey||_tgt?.fleetAccount?.address||""),_lbl=_tgt?.fleetLabel||"Target Fleet",_read=()=>{try{const live=(typeof wt!=="undefined"&&wt?.getFleet?.(_tKey))||null;return Number(live?.data?.hp??_tgt?.fleetAccount?.data?.hp??0)}catch{return Number(_tgt?.fleetAccount?.data?.hp??0)}},_state=()=>{try{const live=(typeof wt!=="undefined"&&wt?.getFleet?.(_tKey))||null;return live?.data?.state?.__kind??_tgt?.fleetAccount?.data?.state?.__kind}catch{return _tgt?.fleetAccount?.data?.state?.__kind}};window.__SA_RESOLVE_COMBAT?.({kind:"FLEET",target:_lbl,preHp:_read(),readHp:_read,readState:_state,refetch:async()=>{try{await Kt?.refetch?.fleets?.()}catch{}},x:$11?.target?.x,y:$11?.target?.y,sx:$11?.source?.x,sy:$11?.source?.y,toast:$1,targets:[$3($2)]})})();await $4({fleetKey:$5.address,fleetInfo:$6,game:$7,character:$8,gw:$9,actionLabel:"Attack",onFleetRefreshed:window.__SA_WRAP_CS?.($10.createCounterstrikeRefreshHandler($11,$12,.6),{attacker:$11?.attacker,coords:$11,toast:$1,target:$2.fleetLabel||"Target Fleet",targets:[$3($2)]})||$10.createCounterstrikeRefreshHandler($11,$12,.6)})'
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
    // LIVE: surgical pin update instead of destroy+recreate on owner flip
    [
      /const ([A-Za-z0-9_$]+)=([A-Za-z0-9_$]+)\(\)\.get\(([A-Za-z0-9_$]+)\);if\(\1\)\{const ([A-Za-z0-9_$]+)=convertOwnerToFaction\(([A-Za-z0-9_$]+)\.owner\);if\(!shouldRecreateStarSystemVisuals\(\1,\4\)\)continue;\1\.parent\?\.removeChild\(\1\),\1\.destroy\(\{children:!0\}\),([A-Za-z0-9_$]+)\(([A-Za-z0-9_$]+)=>\{const ([A-Za-z0-9_$]+)=new Map\(\7\);return \8\.delete\(\3\),\8\}\)/g,
      'const $1=$2().get($3);if($1){const $4=convertOwnerToFaction($5.owner);if(!shouldRecreateStarSystemVisuals($1,$4))continue;$1._systemOwner=$4;const _saT=cachedColorNumber(getFactionColorFromOwner($5.owner)),_saC=mt.get($4)||mt.get("DEFAULT_GLOW");if($1._starGlow){$1._starGlow.tint=_saT;$1._starGlow.alpha=.04}if($1._starCore){_saC&&($1._starCore.texture=_saC);$1._starCore.tint=_saT}if($1._softHalo)$1._softHalo.tint=_saT;continue}'
    ],
    // Create-time glow alpha clamp (name-agnostic)
    [
      /([A-Za-z0-9_$]+)\.alpha=SYSTEM_STAR_CONFIG\.GLOW\.ALPHA,\1\.blendMode="add",\1\.zIndex=10,([A-Za-z0-9_$]+)\.addChild\(\1\),\2\._starGlow=\1/g,
      '$1.alpha=Math.min(.05,SYSTEM_STAR_CONFIG.GLOW.ALPHA),$1.blendMode="add",$1.zIndex=10,$2.addChild($1),$2._starGlow=$1'
    ],
    // Capture wash: shrink + dim detail outer glow (name-agnostic; minifiers rename locals each build)
    [
      /([A-Za-z0-9_$]+)=Math\.max\(SYSTEM_DETAIL_CONFIG\.STAR\.GLOW_RADIUS\*4,([A-Za-z0-9_$]+)\*4\.65\)\*([A-Za-z0-9_$]+)\.glowRadiusMultiplier\*([A-Za-z0-9_$]+)\/([A-Za-z0-9_$]+),([A-Za-z0-9_$]+)\.scale\.set\(\1,\1\*([A-Za-z0-9_$]+)\),\6\.tint=new Color\(([A-Za-z0-9_$]+)\)\.toNumber\(\),([A-Za-z0-9_$]+)=Math\.min\(\.56,SYSTEM_DETAIL_CONFIG\.STAR\.GLOW_BASE_ALPHA\*1\.02\*\3\.glowAlphaMultiplier\),\6\.alpha=\9\*\.72,\6\.blendMode="screen"/g,
      '$1=Math.max(SYSTEM_DETAIL_CONFIG.STAR.GLOW_RADIUS*1.45,$2*1.7)*$3.glowRadiusMultiplier*$4/$5,$6.scale.set($1,$1*$7),$6.tint=new Color($8).toNumber(),$9=Math.min(.1,SYSTEM_DETAIL_CONFIG.STAR.GLOW_BASE_ALPHA*.22*$3.glowAlphaMultiplier),$6.alpha=$9*.22,$6.blendMode="screen"'
    ],
    // Capture wash: desaturate primary star mesh faction colors
    [
      /if\(([A-Za-z0-9_$]+)===0\)\{const ([A-Za-z0-9_$]+)=new Color\(([A-Za-z0-9_$]+)\)\.toArray\(\);([A-Za-z0-9_$]+)=\[\2\[0\]\*\.58\+([A-Za-z0-9_$]+)\[0\]\*\.42,\2\[1\]\*\.58\+\5\[1\]\*\.42,\2\[2\]\*\.58\+\5\[2\]\*\.42\],([A-Za-z0-9_$]+)=\[Math\.min\(1,\.94\+\2\[0\]\*\.06\),Math\.min\(1,\.8\+\2\[1\]\*\.13\),Math\.min\(1,\.52\+\2\[2\]\*\.15\)\]\}/g,
      'if($1===0){const $2=new Color($3).toArray();$4=[$2[0]*.22+$5[0]*.78,$2[1]*.22+$5[1]*.78,$2[2]*.22+$5[2]*.78],$6=[Math.min(1,.86+$2[0]*.03),Math.min(1,.72+$2[1]*.06),Math.min(1,.45+$2[2]*.08)]}'
    ],
    // recreateDetailView: always re-hide macro star when detail stays visible
    [
      /recreateDetailView\(([A-Za-z0-9_$]+),([A-Za-z0-9_$]+),([A-Za-z0-9_$]+),([A-Za-z0-9_$]+),([A-Za-z0-9_$]+),([A-Za-z0-9_$]+)\)\{const ([A-Za-z0-9_$]+)=\1\.isVisible,([A-Za-z0-9_$]+)=\1\.container\.alpha,([A-Za-z0-9_$]+)=\1\.container\.renderable;this\.removeDetailView\(\1\);const ([A-Za-z0-9_$]+)=this\.createDetailView\(\2,\3,\4,\5,\6\);return \10\.isVisible=\7,\10\.container\.alpha=\8,\10\.container\.renderable=\9,this\.activeDetails\.set\(\6,\10\),this\.viewport\.addChild\(\10\.container\),\10\}/g,
      'recreateDetailView($1,$2,$3,$4,$5,$6){const $7=$1.isVisible,$8=$1.container.alpha,$9=$1.container.renderable;this.removeDetailView($1);const $10=this.createDetailView($2,$3,$4,$5,$6);return $10.isVisible=$7,$10.container.alpha=$8,$10.container.renderable=$9,this.activeDetails.set($6,$10),this.viewport.addChild($10.container),$7&&this.hideStarSprite($6),$10}'
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
window.__SA_COALESCE_MAP_REFRESH__=window.__SA_COALESCE_MAP_REFRESH__||(function(){let inflight=null,timers=[];const clearT=()=>{for(const t of timers)clearTimeout(t);timers=[]};return function(refetchers,meta){const run=()=>{if(inflight)return inflight;const jobs=[];try{const r=refetchers;if(typeof r==="function")jobs.push(r());else if(r&&typeof r==="object"){if(r.starSystem)jobs.push(r.starSystem());if(r.factionOwnership)jobs.push(r.factionOwnership());if(r.fleets)jobs.push(r.fleets())}}catch(_){}inflight=Promise.all(jobs.map(p=>Promise.resolve(p).catch(()=>{}))).finally(()=>{inflight=null;try{window.__SA_MAP_BUMP__?.afterData?.(meta)}catch(_){}});return inflight};clearT();run();for(const ms of[1500,6e3])timers.push(setTimeout(()=>void run(),ms));return!0}})();
window.__SA_MAP_BUMP__=window.__SA_MAP_BUMP__||(function(){const USTUR=16755200,MUD=14958374,ONI=26367,NEUT=10526880;const tintFor=o=>{const n=Number(o);if(n===1||o==="MUD"||o==="Mud")return MUD;if(n===2||o==="ONI"||o==="Oni")return ONI;if(n===3||o==="USTUR"||o==="Ustur")return USTUR;return NEUT};const walk=(n,fn,d=0)=>{if(!n||d>16)return;try{fn(n)}catch(_){}const kids=n.children;if(!kids)return;for(let i=0;i<kids.length;i++)walk(kids[i],fn,d+1)};const bumpPin=(pin,owner)=>{if(!pin)return!1;const t=tintFor(owner);try{pin._systemOwner=typeof owner==="string"?owner:owner;if(pin._starGlow){pin._starGlow.tint=t;pin._starGlow.alpha=Math.min(.04,Number(pin._starGlow.alpha)||.04)}if(pin._starCore)pin._starCore.tint=t;if(pin._softHalo)pin._softHalo.tint=t;return!0}catch{return!1}};function afterData(meta){try{const vp=window.__SA_MAP_VIEWPORT__,stage=window.__SA_PIXI_APP__?.stage;let n=0;const want=(meta&&meta.name)||null;const roots=[vp,stage].filter(Boolean);for(const root of roots)walk(root,node=>{if(!node||!node._starGlow)return;if(want&&node.label&&String(node.label)!==String(want)&&!(node._systemName&&node._systemName===want))return;if(node._systemOwner!=null||node._starGlow){const o=meta&&meta.owner!=null?meta.owner:node._systemOwner;if(o!=null&&bumpPin(node,o))n++}});if(n)console.debug("%c ⚔️ sa-map-bump %c pins", "background:#0a0f19;color:#00e5ff;padding:1px 6px","color:#34d399",n,meta||{})}catch(_){}}function bumpSystem(meta){afterData(meta||{});return!0}return{afterData,bumpSystem,bumpPin}})();
window.__SA_LOG_COMBAT_EVENT=window.__SA_LOG_COMBAT_EVENT||(function(){let min=!1;const c=document.createElement("div");c.id="sa-combat-log-box";c.style.cssText="position:fixed;bottom:16px;left:16px;width:360px;max-height:220px;background:rgba(10,15,25,0.92);backdrop-filter:blur(8px);border:1px solid rgba(0,229,255,0.35);border-radius:8px;box-shadow:0 8px 32px rgba(0,0,0,0.7);font-family:monospace;color:#e2e8f0;font-size:11px;z-index:999999;display:flex;flex-direction:column;overflow:hidden;transition:all 0.25s ease;";const h=document.createElement("div");h.style.cssText="background:rgba(0,229,255,0.15);padding:6px 10px;display:flex;align-items:center;justify-content:space-between;font-weight:bold;color:#00e5ff;letter-spacing:0.5px;user-select:none;border-bottom:1px solid rgba(0,229,255,0.2);";h.innerHTML='<span>⚔️ COMBAT LOG</span><div><button id="sa-cl-cls" style="background:none;border:none;color:#94a3b8;cursor:pointer;margin-right:6px;" title="Clear">🗑️</button><button id="sa-cl-min" style="background:none;border:none;color:#00e5ff;cursor:pointer;font-weight:bold;">[−]</button></div>';const b=document.createElement("div");b.style.cssText="padding:6px 8px;overflow-y:auto;flex:1;display:flex;flex-direction:column;gap:4px;max-height:175px;";c.appendChild(h);c.appendChild(b);const mount=()=>{if(document.body){if(!document.getElementById("sa-combat-log-box"))document.body.appendChild(c)}else setTimeout(mount,100)};mount();h.querySelector("#sa-cl-cls").onclick=()=>{b.innerHTML=""};h.querySelector("#sa-cl-min").onclick=()=>{min=!min;c.style.maxHeight=min?"30px":"220px";b.style.display=min?"none":"flex";h.querySelector("#sa-cl-min").textContent=min?"[+]":"[−]"};const paint=(r,e)=>{const time=new Date().toLocaleTimeString("en-US",{hour12:!1});let icon="🎯",color="#f87171",msg="";const dmg=Number(e.damage||0);const kind=e.damageKind||"HP";if(e.type==="PENDING"){icon="⏳";color="#67e8f9";msg=e.kind==="STARBASE"?\`<span style="color:#67e8f9;font-weight:bold;">RESOLVING</span> <b style="color:#fff">\${e.target||"?"}</b> starbase…\`:\`<span style="color:#67e8f9;font-weight:bold;">RESOLVING</span> vs <b style="color:#fff">\${e.target||"?"}</b>…\`}else if(e.type==="HIT"){icon="🎯";color="#f87171";msg=\`<span style="color:#ef4444;font-weight:bold;">HIT</span> vs <b style="color:#fff">\${e.target||"?"}</b> <span style="color:#f87171;font-weight:bold;">-\${dmg.toLocaleString()} HP</span>\`}else if(e.type==="MISS"){icon="❌";color="#9ca3af";msg=\`<span style="color:#9ca3af;font-weight:bold;">MISS</span> vs <b style="color:#fff">\${e.target||"?"}</b> (0 DMG)\`}else if(e.type==="CAPTURE"){icon="🏳️";color="#34d399";msg=\`<span style="color:#34d399;font-weight:bold;">CAPTURE</span> @ <b style="color:#fff">\${e.target||"?"}</b>\${dmg>0?\` <span style="color:#f87171;font-weight:bold;">-\${dmg.toLocaleString()} HP</span>\`:\` <span style="color:#94a3b8;">(no HP dmg)</span>\`}\`}else if(e.type==="STARBASE"){icon="🏰";color=dmg>0?"#f87171":"#9ca3af";msg=\`<span style="color:\${color};font-weight:bold;">STARBASE</span> @ <b style="color:#fff">\${e.target||"?"}</b> \${dmg>0?\`<span style="color:#f87171;font-weight:bold;">-\${dmg.toLocaleString()} HP</span>\`:"(0 DMG)"}\`}else if(e.type==="COUNTER"){icon="⚡";color="#fb923c";msg=\`<span style="color:#fb923c;font-weight:bold;">COUNTER</span> from <b style="color:#fff">\${e.target||"?"}</b> <span style="color:#fb923c;font-weight:bold;">-\${dmg.toLocaleString()} \${kind}</span> on your fleet\`}else if(e.type==="FLEE"){icon="🏃";color="#fbbf24";msg=\`<span style="color:#fbbf24;font-weight:bold;">FLEE</span> <b style="color:#fff">\${e.target||"?"}</b> warped away / exited sector!\`}else if(e.type==="CONTESTED"){icon="🛡️";color="#fbbf24";msg=\`<span style="color:#fbbf24;font-weight:bold;">CONTESTED</span> · <b style="color:#fff">\${e.target||"?"}</b> starbase under protection/cooldown\`}else{msg=String(e.type||"EVENT")+" "+(e.target||"")}r.innerHTML=\`<span style="color:#64748b;">[\${time}]</span> \${icon} \${msg}\`;r.dataset.saTarget=String(e.target||"");r.dataset.saType=String(e.type||"")};return function(e){try{let r=null;if(e.type!=="PENDING"&&e.type!=="COUNTER"){const rows=[...b.children];for(let i=rows.length-1;i>=0;i--){if(rows[i].dataset.saType==="PENDING"&&rows[i].dataset.saTarget===String(e.target||"")){r=rows[i];break}}}if(!r){r=document.createElement("div");r.style.cssText="line-height:1.35;border-bottom:1px solid rgba(255,255,255,0.06);padding-bottom:2px;";b.appendChild(r)}paint(r,e);b.scrollTop=b.scrollHeight;if(e.type==="PENDING")return;const dmg=Number(e.damage||0);const color=e.type==="COUNTER"?"#fb923c":e.type==="CAPTURE"?"#34d399":e.type==="FLEE"||e.type==="CONTESTED"?"#fbbf24":dmg>0?"#f87171":"#9ca3af";const kind=e.damageKind||"HP";const tgtTxt=e.type==="COUNTER"?\`COUNTER -\${dmg.toLocaleString()} \${kind}\`:(e.type==="CAPTURE"?(dmg>0?\`CAPTURE -\${dmg.toLocaleString()}\`:"CAPTURED!"):(dmg>0?\`-\${dmg.toLocaleString()} HP\`:(e.type==="FLEE"?"FLED!":e.type==="CONTESTED"?"CONTESTED":e.type==="HIT"?"HIT!":"MISS")));const srcTxt=e.type==="COUNTER"?"HIT YOU!":(e.type==="CAPTURE"?"YOURS!":(dmg>0?"HIT!":(e.type==="FLEE"?"FLED":e.type==="CONTESTED"?"!":"MISS")));const toClient=(wx,wy)=>{try{if(!Number.isFinite(wx)||!Number.isFinite(wy))return null;const canvas=document.querySelector("canvas");const rect=canvas&&canvas.getBoundingClientRect();if(!rect||rect.width<2||rect.height<2)return null;let sx=wx,sy=wy;const vp=window.__SA_MAP_VIEWPORT__;if(vp&&typeof vp.toScreen==="function"){try{const p=vp.toScreen(wx,wy);if(p&&Number.isFinite(p.x)&&Number.isFinite(p.y)){sx=p.x;sy=p.y}}catch(_){}}const app=window.__SA_PIXI_APP__;let scaleX=1,scaleY=1;if(app&&app.screen&&app.screen.width>0&&app.screen.height>0){scaleX=rect.width/app.screen.width;scaleY=rect.height/app.screen.height}else if(canvas.width>0&&canvas.height>0){scaleX=rect.width/canvas.width;scaleY=rect.height/canvas.height}const left=rect.left+sx*scaleX,top=rect.top+sy*scaleY;if(!Number.isFinite(left)||!Number.isFinite(top))return null;return{x:left,y:top}}catch{return null}};const spawnFloat=(pt,txt,col,scale)=>{if(!pt)return;const pop=document.createElement("div");pop.textContent=txt;pop.style.cssText=\`position:fixed;left:\${pt.x}px;top:\${pt.y-28}px;transform:translate(-50%,-50%) scale(\${scale||1});font-family:monospace;font-weight:900;font-size:\${scale>1?24:20}px;color:\${col};text-shadow:0 0 8px #000,2px 2px 0 #000;pointer-events:none;z-index:999999;animation:saFloatUp 1.4s cubic-bezier(0.2,0.8,0.2,1) forwards;\`;document.body.appendChild(pop);setTimeout(()=>pop.remove(),1400)};if(!document.getElementById("sa-c-style")){const s=document.createElement("style");s.id="sa-c-style";s.textContent="@keyframes saFloatUp{0%{opacity:0;transform:translate(-50%,0) scale(.6)}15%{opacity:1;transform:translate(-50%,-20px) scale(1.25)}70%{opacity:1;transform:translate(-50%,-45px) scale(1)}100%{opacity:0;transform:translate(-50%,-65px) scale(.8)}}";document.head.appendChild(s)}const tgt=toClient(e.x,e.y);const src=toClient(e.sx,e.sy);if(tgt||src){spawnFloat(tgt,tgtTxt,color,1.15);spawnFloat(src,srcTxt,e.type==="COUNTER"?"#fb923c":(color==="#f87171"?"#67e8f9":color),0.95)}else{const vw=window.innerWidth||0,vh=window.innerHeight||0;spawnFloat({x:vw/2,y:vh*.35},tgtTxt,color,1)}}catch(_err){console.warn("%c ⚔️ sa-ui-fixes %c ⚠️ combat log","background:#0a0f19;color:#00e5ff;border:1px solid #00e5ff55;padding:1px 6px;border-radius:3px;font-weight:700","color:#fbbf24;font-weight:600",_err)}}})();
window.__SA_WRAP_CS=window.__SA_WRAP_CS||function(handler,meta){return function(fleet){try{const atk=meta?.attacker||meta?.coords?.attacker||null;const post=fleet?.data||fleet;const preHp=Number(atk?.hp??NaN),preSp=Number(atk?.sp??NaN);const postHp=Number(post?.hp??preHp),postSp=Number(post?.sp??preSp);const dmgHp=Number.isFinite(preHp)?Math.max(0,preHp-postHp):0;const dmgSp=Number.isFinite(preSp)?Math.max(0,preSp-postSp):0;if(dmgHp>0||dmgSp>0){const dmg=dmgHp>0?dmgHp:dmgSp;const kind=dmgHp>0?"HP":"SP";const tgt=meta?.target||"Enemy";const c=meta?.coords;window.__SA_LOG_COMBAT_EVENT?.({type:"COUNTER",target:tgt,damage:dmg,damageKind:kind,x:c?.source?.x,y:c?.source?.y,sx:c?.target?.x,sy:c?.target?.y});meta?.toast?.(\`⚡ COUNTER! \${tgt} hit your fleet for \${dmg.toLocaleString()} \${kind}\`,"warning",{presentation:"feed",title:\`Counterstrike — \${tgt}\`,targets:meta?.targets})}}catch(_e){console.warn("%c ⚔️ sa-ui-fixes %c ⚠️ counter wrap","background:#0a0f19;color:#00e5ff;border:1px solid #00e5ff55;padding:1px 6px;border-radius:3px;font-weight:700","color:#fbbf24;font-weight:600",_e)}return typeof handler==="function"?handler(fleet):void 0}};
window.__SA_RESOLVE_COMBAT=window.__SA_RESOLVE_COMBAT||(function(){const sleep=ms=>new Promise(r=>setTimeout(r,ms));const normOwner=o=>{if(o==null||o===void 0)return 0;if(typeof o==="object"){const k=o.__kind||o.kind||o.name;if(k!=null)return normOwner(k);if(o.__option==="None")return 0}const n=Number(o);if(Number.isFinite(n)&&String(o).trim()!==""&&Math.abs(n)<=10)return n|0;const s=String(o).toUpperCase();if(s==="MUD"||s==="1")return 1;if(s==="ONI"||s==="2")return 2;if(s==="USTUR"||s==="3")return 3;if(s==="UNALIGNED"||s==="NONE"||s==="NEUTRAL"||s==="0")return 0;return 0};return async function(o){try{const log=window.__SA_LOG_COMBAT_EVENT;const pre=Number(o.preHp||0);const preOwn=normOwner(o.preOwner!=null?o.preOwner:(typeof o.readOwner==="function"?o.readOwner():null));log?.({type:"PENDING",kind:o.kind,target:o.target,damage:0});let dmg=0,flee=!1,captured=!1;const steps=o.kind==="STARBASE"?[0,200,500,1e3,2e3,3500,5e3,7e3,1e4,15e3,2e4,3e4]:[0,100,250,450,750,1200,1800,2600,4e3,6e3,1e4];let prev=0;for(const t of steps){if(t)await sleep(t-prev);prev=t;try{await o.refetch?.()}catch{}const post=Number(o.readHp?.()??0);dmg=Math.max(0,pre-post);if(o.kind==="STARBASE"&&typeof o.readOwner==="function"){const postOwn=normOwner(o.readOwner());if(postOwn!==preOwn&&postOwn>0)captured=!0}if(o.kind==="FLEET"){const st=o.readState?.();flee=st==="MoveWarp"||st==="MoveSubwarp";if(flee)break}if(dmg>0||captured)break}if(o.kind==="FLEET"){const type=flee?"FLEE":(dmg>0?"HIT":"MISS");log?.({type,target:o.target,damage:dmg,x:o.x,y:o.y,sx:o.sx,sy:o.sy});const msg=flee?\`🏃 FLEE! Target fleet \${o.target} fled the area!\`:(dmg>0?\`🎯 HIT! Dealt \${dmg.toLocaleString()} damage to \${o.target}.\`:\`❌ MISS! Attack against \${o.target} missed.\`);o.toast?.(msg,flee?"info":(dmg>0?"success":"warning"),{presentation:"feed",title:flee?\`Fled — \${o.target}\`:(dmg>0?\`Hit — \${o.target}\`:\`Miss — \${o.target}\`),targets:o.targets})}else if(captured){log?.({type:"CAPTURE",target:o.target,damage:dmg,x:o.x,y:o.y,sx:o.sx,sy:o.sy});try{window.__SA_MAP_BUMP__?.bumpSystem?.({name:o.target,owner:typeof o.readOwner==="function"?o.readOwner():null})}catch(_){}const msg=dmg>0?\`🏳️ CAPTURE! \${o.target} taken (\${dmg.toLocaleString()} HP).\`:\`🏳️ CAPTURE! \${o.target} taken over (no HP dmg).\`;o.toast?.(msg,"success",{presentation:"feed",title:\`Captured — \${o.target}\`,targets:o.targets})}else{log?.({type:"STARBASE",target:o.target,damage:dmg,x:o.x,y:o.y,sx:o.sx,sy:o.sy});const msg=dmg>0?\`🎯 HIT! Dealt \${dmg.toLocaleString()} damage to \${o.target} starbase.\`:\`❌ MISS! Attack on \${o.target} starbase missed.\`;o.toast?.(msg,dmg>0?"success":"warning",{presentation:"feed",title:dmg>0?\`Starbase Hit — \${o.target}\`:\`Starbase Miss — \${o.target}\`,targets:o.targets})}}catch(_e){console.warn("%c ⚔️ sa-ui-fixes %c ⚠️ combat resolve","background:#0a0f19;color:#00e5ff;border:1px solid #00e5ff55;padding:1px 6px;border-radius:3px;font-weight:700","color:#fbbf24;font-weight:600",_e)}}})();
window.__SA_BUILDER_TIP=window.__SA_BUILDER_TIP||(function(){let el=null,hideT=0;const ensure=()=>{if(el&&el.isConnected)return el;el=document.createElement("div");el.id="sa-builder-tip";el.style.cssText="position:fixed;left:50%;bottom:28px;transform:translateX(-50%);z-index:1000000;max-width:min(520px,92vw);padding:10px 14px;border-radius:8px;background:rgba(15,23,42,.94);border:1px solid rgba(251,191,36,.55);color:#fde68a;font:600 13px/1.35 ui-monospace,Menlo,monospace;box-shadow:0 10px 40px rgba(0,0,0,.55);pointer-events:none;opacity:0;transition:opacity .15s ease";document.body?document.body.appendChild(el):setTimeout(ensure,50);return el};return function(msg){const n=ensure();n.textContent="🏗️ "+String(msg||"");n.style.opacity="1";clearTimeout(hideT);hideT=setTimeout(()=>{n.style.opacity="0"},4200);try{console.log("%c ⚔️ sa-ui-fixes %c 🏗️ "+msg,"background:#0a0f19;color:#00e5ff;border:1px solid #00e5ff55;padding:1px 6px;border-radius:3px;font-weight:700","color:#fbbf24;font-weight:600")}catch(_){}}})();
window.__SA_MAP_DEBUG__=window.__SA_MAP_DEBUG__||(function(){
  const tag="%c ⚔️ sa-map-debug";
  const st="background:#0a0f19;color:#00e5ff;border:1px solid #00e5ff55;padding:1px 6px;border-radius:3px;font-weight:700";
  const log=(...a)=>{try{console.log(tag,st,...a)}catch(_){}};
  const roots=()=>({viewport:window.__SA_MAP_VIEWPORT__,app:window.__SA_PIXI_APP__,stage:window.__SA_PIXI_APP__?.stage});
  const labOf=(n)=>String((n&&n.label)!=null?n.label:"");
  // Never read .width/.height — Pixi v8 may walk mask bounds and warn + thrash fleets.
  const texSize=(n)=>{
    try{
      const t=n.texture;if(!t)return{tw:0,th:0};
      const f=t.frame;if(f&&f.width)return{tw:f.width,th:f.height};
      if(t.width)return{tw:t.width,th:t.height||t.width};
      const s=t.source||t.baseTexture;if(s&&s.width)return{tw:s.width,th:s.height||s.width};
    }catch(_){}
    return{tw:0,th:0};
  };
  const localVisual=(n)=>{
    const sx=Math.abs(Number(n.scale&&n.scale.x)||1),sy=Math.abs(Number(n.scale&&n.scale.y)||1);
    const{tw,th}=texSize(n);
    return{w:tw*sx,h:th*sy,sx,sy,tw,th};
  };
  const walk=(node,fn,d=0,path)=>{
    if(!node||d>14)return;
    try{fn(node,d,path)}catch(_){}
    const kids=node.children;if(!kids||!kids.length)return;
    for(let i=0;i<kids.length;i++){
      const c=kids[i];const lab=labOf(c)||String(i);
      walk(c,fn,d+1,path?path+"/"+lab:lab);
    }
  };
  const tintRGB=(t)=>{const v=(Number(t)>>>0)>>>0;return{r:(v>>16)&255,g:(v>>8)&255,b:v&255}};
  const isWarm=(t)=>{const{r,g,b}=tintRGB(t);return r>150&&g>70&&b<130&&r>b+35};
  const USTUR=16755200; // #ffaa00
  const MUD=14958374, ONI=26367;
  const factionTint=(t)=>{const n=Number(t)>>>0;return n===USTUR||n===MUD||n===ONI||isWarm(t)};
  const blendHot=(b)=>b==="screen"||b==="add"||b===1||b===2||b==="lighter";
  const typeOf=(n)=>n&&n.constructor&&n.constructor.name||"Node";
  const scr=()=>{const a=roots().app;const s=a&&a.screen;return s?{w:s.width,h:s.height}:{w:innerWidth||1920,h:innerHeight||1080}};

  // Star-glow only: never fleet pins (small sprites) or containers.
  const isStarGlowSprite=(n,row)=>{
    if(!n||typeOf(n)!=="Sprite")return!1;
    if(!blendHot(row.blend))return!1;
    if(!factionTint(row.tint)&&row.blend!=="screen")return!1;
    // Fleet ship sprites are small in local visual space even when zoomed;
    // macro/detail glows use large textures * scale (often >> 256 local).
    const area=row.w*row.h;
    if(area<200*200&&row.blend!=="screen")return!1;
    // Skip anything that looks like a ship icon texture (small frame)
    if(row.tw>0&&row.tw<=128&&row.th<=128&&row.blend==="add"&&area<400*400)return!1;
    return!0;
  };

  const collectGlows=()=>{
    const{viewport,stage}=roots();const out=[];const seen=new Set();
    const visit=(root)=>{
      if(!root||seen.has(root))return;seen.add(root);
      walk(root,(n,d,path)=>{
        // Explicit stock refs
        if(n._starGlow&&n._starGlow.texture){
          const g=n._starGlow;const lv=localVisual(g);
          const tintN=Number(g.tint)>>>0;
          const isLoot=tintN===10177994||(lv.tw>0&&lv.tw<=64&&lv.w>0&&lv.w<=28);
          out.push({path:path+"/_starGlow",lab:labOf(g)||"_starGlow",d:d+1,type:"Sprite",
            alpha:Number(g.alpha),blend:g.blendMode,tint:g.tint,visible:g.visible!==!1,
            ...lv,_n:g,kind:isLoot?"loot":"macro",loot:isLoot});
        }
        const lv=localVisual(n);
        const row={path,lab:labOf(n),d,type:typeOf(n),alpha:Number(n.alpha),blend:n.blendMode,tint:n.tint,visible:n.visible!==!1,...lv};
        if(isStarGlowSprite(n,row))out.push({...row,_n:n,kind:row.blend==="screen"?"detail-or-flare":"macro-add"});
      });
    };
    visit(viewport);visit(stage);
    return out;
  };

  const touched=[];
  const remember=(n)=>{if(!touched.some(t=>t.node===n))touched.push({node:n,alpha:Number(n.alpha),visible:n.visible!==!1})};

  function dump(opts){
    opts=opts||{};
    const rows=collectGlows().map(({_n,...r})=>({...r,ustur:(Number(r.tint)>>>0)===USTUR,warm:isWarm(r.tint)}))
      .sort((a,b)=>(b.w*b.h*b.alpha)-(a.w*a.h*a.alpha));
    const lim=opts.limit||30;
    try{console.table(rows.slice(0,lim).map(r=>({path:r.path,kind:r.kind,alpha:+r.alpha.toFixed(3),blend:r.blend,tint:r.tint,w:Math.round(r.w),h:Math.round(r.h),tw:r.tw,ustur:r.ustur,loot:!!r.loot})))}
    catch(_){console.log(rows.slice(0,lim))}
    const sysN=rows.filter(r=>r.kind==="macro"||r.kind==="detail-or-flare").length;
    const lootN=rows.filter(r=>r.kind==="loot"||r.loot).length;
    log("dump glows",rows.length,"(top "+Math.min(lim,rows.length)+") — systems~"+sysN+" loot~"+lootN+" (fleets excluded)");
    return rows;
  }

  function dimWash(opts){
    opts=opts||{};
    const maxScreen=opts.maxScreen!=null?opts.maxScreen:0.04;
    const maxAdd=opts.maxAdd!=null?opts.maxAdd:0.06;
    let n=0;
    for(const row of collectGlows()){
      const node=row._n;if(!node)continue;
      if(row.loot||row.kind==="loot"){if(!opts.includeLoot)continue}
      remember(node);
      try{
        const cap=row.blend==="screen"?maxScreen:maxAdd;
        if(Number(node.alpha)>cap)node.alpha=cap;
        // Only hide if explicitly requested — never default (ships were vanishing via over-broad rules)
        if(opts.hide)node.visible=!1;
      }catch(_){}
      n++;
    }
    if(!opts.quiet)log("dimWash star-glows only, touched",n);
    return n;
  }

  function restore(){
    let n=0;
    for(const t of touched){
      try{t.node.alpha=t.alpha;t.node.visible=t.visible;n++}catch(_){}
    }
    touched.length=0;
    log("restore",n);
    return n;
  }

  let watchOff=null;
  function watch(on,ms,opts){
    if(watchOff){try{watchOff()}catch(_){}watchOff=null}
    if(on===!1||on==="off"||on===0){log("watch off");return!1}
    opts=Object.assign({maxScreen:0.04,maxAdd:0.06},opts||{});
    // Interval not ticker: avoid fighting fleet alpha every frame (blink)
    const id=setInterval(()=>dimWash(Object.assign({},opts,{quiet:!0})),ms||250);
    watchOff=()=>clearInterval(id);
    log("watch on every",ms||250,"ms — star-glows only (no fleet width/bounds)");
    dimWash(Object.assign({},opts,{quiet:!0}));
    return!0;
  }

  let preCapture=null;
  function markPre(){
    preCapture=dump({limit:25});
    log("markPre stored",preCapture.length,"glows — attack, then markPost()");
    return preCapture;
  }
  function markPost(){
    const post=dump({limit:25});
    if(!preCapture){log("no markPre");return{post}}
    // stable key: tint+blend+kind+rounded size (paths renumber)
    const key=r=>[r.kind,r.blend,r.tint,Math.round(r.w/50),Math.round(r.h/50)].join("|");
    const preKeys=new Map();
    for(const r of preCapture)preKeys.set(key(r),(preKeys.get(key(r))||0)+1);
    const hotter=post.filter(r=>{
      const p=preCapture.find(x=>x.path===r.path);
      return p&&(r.alpha>p.alpha+0.05||r.w>p.w*1.4);
    });
    log("markPost glows pre",preCapture.length,"post",post.length,"hotter",hotter.length);
    return{pre:preCapture,post,hotter};
  }

  function snapshot(){
    const{viewport,app}=roots();
    const glows=dump({limit:15});
    return{
      hasViewport:!!viewport,hasApp:!!app,
      scale:viewport&&viewport.scale?viewport.scale.x:null,
      glowCount:glows.length,
      top:glows.slice(0,10),
      watching:!!watchOff
    };
  }

  function isOn(){
    try{if(watchOff)return!0;return localStorage.getItem("saMapDebug")==="1"||new URLSearchParams(location.search).get("saMapDebug")==="1"}catch{return!!watchOff}
  }
  function on(opts){
    try{localStorage.setItem("saMapDebug","1")}catch(_){}
    watch(!0,(opts&&opts.ms)||250,opts);
    log("ENABLED — watch on. Paste OFF to stop:  __SA_MAP_DEBUG__.off()");
    return!0
  }
  function off(){
    try{localStorage.removeItem("saMapDebug")}catch(_){}
    watch(!1);
    try{restore()}catch(_){}
    log("DISABLED — map debug off (localStorage cleared)");
    return!1
  }
  function help(){
    log("Map graphics debugger — easy on/off");
    console.log([
      "",
      "  EASY (copy-paste one line):",
      "  ON:   __SA_MAP_DEBUG__.on()",
      "  OFF:  __SA_MAP_DEBUG__.off()",
      "",
      "  Or localStorage + reload:",
      "  ON:   localStorage.saMapDebug=\\"1\\";location.reload()",
      "  OFF:  localStorage.removeItem(\\"saMapDebug\\");location.reload()",
      "",
      "  Or extension popup → Map debugger toggle",
      "",
      "  Power tools:",
      "  __SA_MAP_DEBUG__.dump()        // list star glows",
      "  __SA_MAP_DEBUG__.dimWash()     // clamp glows once",
      "  __SA_MAP_DEBUG__.watch()       // re-clamp every 250ms",
      "  __SA_MAP_DEBUG__.watch(false)  // stop watch only",
      "  __SA_MAP_DEBUG__.restore()",
      "  __SA_MAP_DEBUG__.markPre() / markPost()",
      "  Safe: star-glows only (no fleet thrash)"
    ].join("\\n"));
  }

  // Auto-watch: opt-in only, never per-frame
  try{
    const q=new URLSearchParams(location.search);
    if(q.get("saMapDebug")==="1"||localStorage.getItem("saMapDebug")==="1"){
      setTimeout(()=>{log("auto-ON (saMapDebug=1) — __SA_MAP_DEBUG__.off() to disable");watch(!0,250)},2500);
    }
  }catch(_){}

  return{help,on,off,isOn,enable:on,disable:off,roots,dump,dimWash,watch,restore,snapshot,markPre,markPost,collectGlows};
})();
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
    slog("info", "🗺️", "map debug → __SA_MAP_DEBUG__.on() / .off()  ·  popup toggle  ·  ?saMapDebug=1");

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
