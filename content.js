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
  [
    "console.log(`⚔️ Attacking starbase at ${Zi.systemName}`)",
    "console.log(`⚔️ Attacking starbase at ${Zi.systemName}`);(()=>{try{const _st=of?.data?.starbase;const _v=_st?.__option===\"Some\"?_st.value:_st?.value??_st;const _hp=Number(_v?.hp??NaN);window.__SA_PRE_COMBAT__=window.__SA_PRE_COMBAT__||{};const _k=String(Zi.systemName||Zi.systemKey||\"\");if(_k&&Number.isFinite(_hp)){window.__SA_PRE_COMBAT__[_k]={hp:_hp,t:Date.now(),key:Zi.systemKey};window.__SA_PRE_COMBAT__._last=_k}}catch{}})()",
  ],
  // Live bundle (index-CZzek2X2+): resolve hit/miss ASAP via starSystem poll (parallel to fleets+AP).
  // Stock now inserts extra $1(fleet,ap)/e1(...) between refetch IIFE and Pt toast — exact anchors updated.
  [
    'console.log("✅ Attack starbase transaction sent"),(()=>{const Pg=()=>Promise.all([Kt.refetch.starSystem(),Kt.refetch.factionOwnership()]).catch(xv=>{console.warn("Failed to refresh starbase ownership after attack",xv)});Pg();for(const xv of[2e3,5e3,1e4])setTimeout(()=>void Pg(),xv)})(),$1(xm.address,Tp(xm.data)),e1(xm.address,!0),Pt(`Attack order submitted against ${Zi.systemName}.`,"success",{presentation:"feed",title:"Starbase attack launched",targets:[Ly(Zi)]}),await R1({fleetKey:xm.address,fleetInfo:xu,game:df,character:Af,gw:_c,actionLabel:"Attack",onFleetRefreshed:Rf.createCounterstrikeRefreshHandler(_g,dv,.8)})',
    'console.log("✅ Attack starbase transaction sent"),$1(xm.address,Tp(xm.data)),e1(xm.address,!0),Pt(`Attack order submitted against ${Zi.systemName}.`,"success",{presentation:"feed",title:"Starbase attack launched",targets:[Ly(Zi)]});(()=>{const _key=Zi.systemKey,_lbl=Zi.systemName,_snap=_g,_toast=Pt,_tgt=[Ly(Zi)],_read=()=>{try{const list=wt?.state?.starSystems||[];const s=list.find(x=>x.address===_key||String(x.address)===String(_key));const st=s?.data?.starbase??of?.data?.starbase;const v=st?.__option==="Some"?st.value:st?.value??st;return Number(v?.hp??0)}catch{return 0}},_readOwner=()=>{try{const map=wt?.state?.map?.systems||{};let sys=map[_key]||map[String(_key)];if(!sys){for(const k of Object.keys(map)){const m=map[k];if(m&&(m.name===_lbl||String(m._systemId)===String(_key)||m.address===_key)){sys=m;break}}}if(sys?.owner!=null)return sys.owner;const list=wt?.state?.starSystems||[];const s=list.find(x=>x.address===_key||String(x.address)===String(_key));return s?.data?.owner??s?.owner??null}catch{return null}};window.__SA_RESOLVE_COMBAT?.({kind:"STARBASE",target:_lbl,preHp:(()=>{try{const c=window.__SA_PRE_COMBAT__&&window.__SA_PRE_COMBAT__[_lbl];const live=_read();if(c&&Number.isFinite(Number(c.hp))&&Date.now()-Number(c.t||0)<18e4)return Math.max(Number(c.hp),Number(live)||0);return live}catch{return _read()}})(),preOwner:_readOwner(),id:`sb-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,7)}`,readHp:_read,readOwner:_readOwner,refetch:async()=>{try{await Kt?.refetch?.starSystem?.();await Kt?.refetch?.factionOwnership?.();window.__SA_MAP_BUMP__?.afterData?.({name:_lbl})}catch{}},x:_snap?.target?.x,y:_snap?.target?.y,sx:_snap?.source?.x,sy:_snap?.source?.y,toast:_toast,targets:_tgt})})();await R1({fleetKey:xm.address,fleetInfo:xu,game:df,character:Af,gw:_c,actionLabel:"Attack",onFleetRefreshed:window.__SA_WRAP_CS?.(Rf.createCounterstrikeRefreshHandler(_g,dv,.8),{attacker:_g?.attacker,coords:_g,toast:Pt,target:Zi.systemName,targets:[Ly(Zi)]})||Rf.createCounterstrikeRefreshHandler(_g,dv,.8)})',
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
  // Space: with selected fleet → enter subwarp destination pick; with destination set → submit
  [
    'const Lp=lf=>{lf.key==="Escape"&&Jc().active&&!hd&&(Xt(),Yv())};window.addEventListener("keydown",Lp)',
    'const Lp=lf=>{if(lf.key==="Escape"&&Jc().active&&!hd)return Xt(),Yv();if((lf.code==="Space"||lf.key===" ")&&!lf.repeat&&!lf.metaKey&&!lf.ctrlKey&&!lf.altKey){const el=lf.target;if(el&&((el.closest&&el.closest("input,textarea,select,[contenteditable=true]"))||el.tagName==="INPUT"||el.tagName==="TEXTAREA"||el.isContentEditable))return;if(typeof hc==="function"&&hc().active)return;if(window.__SA_HOTKEYS__&&window.__SA_HOTKEYS__.isCapture&&window.__SA_HOTKEYS__.isCapture())return;lf.preventDefault();if(Jc().active&&typeof Rp==="function"&&Rp(Jc())&&!hd){typeof zp==="function"?zp():up(Jc());return}if(Jc().active)return;const f=typeof hf==="function"?hf():null;if(f)tp(lf.shiftKey?"warp":"subwarp")}};window.addEventListener("keydown",Lp)',
  ],
  // Destination click: styled confirm; Shift+click: launch immediately via zp() (no stock Start button wait)
  [
    "yu(ig),yr(),ih?(Tc=!0,window.setTimeout(()=>{Tc=!1},0),Ac({type:\"choose-destination\",destination:{label:ig.snappedSystemName??`Coordinates (${ig.gameX}, ${ig.gameY})`,systemId:ig.snappedSystemId??void 0,x:ig.gameX,y:ig.gameY}}),yu(null)):Rc(Eg=>({...Eg,targetX:ig.gameX,targetY:ig.gameY,confirmed:!0,snappedSystemName:ig.snappedSystemName??null}))}Kd=null",
    "yu(ig),yr(),ih?(Tc=!0,window.setTimeout(()=>{Tc=!1},0),Ac({type:\"choose-destination\",destination:{label:ig.snappedSystemName??`Coordinates (${ig.gameX}, ${ig.gameY})`,systemId:ig.snappedSystemId??void 0,x:ig.gameX,y:ig.gameY}}),yu(null)):(Rc(Eg=>({...Eg,targetX:ig.gameX,targetY:ig.gameY,confirmed:!0,snappedSystemName:ig.snappedSystemName??null})),queueMicrotask(()=>{const _s=Jc();if(typeof Rp!==\"function\"||!Rp(_s)||hd)return;const _go=()=>{typeof zp===\"function\"?zp():up(_s)};const _lbl=_s.snappedSystemName||`(${Number(_s.targetX).toFixed(2)}, ${Number(_s.targetY).toFixed(2)})`,_mode=_s.type===\"warp\"?\"warp\":\"subwarp\";if(lf.shiftKey||lf.metaKey||(lf.originalEvent&&(lf.originalEvent.shiftKey||lf.originalEvent.metaKey||lf.originalEvent.ctrlKey))||window.__SA_MOD_SKIP__){_go();return}const _p=window.__SA_CONFIRM_FLY__?window.__SA_CONFIRM_FLY__({mode:_mode,label:_lbl,fleet:_s.fleetLabel||\"Fleet\"}):Promise.resolve(!0);Promise.resolve(_p).then(ok=>{if(ok)_go();else Yv()})}))}Kd=null",
  ],
  [
    "function showStop(){getEngine().trigger(\"show stop\")}",
    "function showStop(){getEngine().trigger(\"show stop\")}window.__SA_SAGE_ACTIONS__={showScan:function(){try{return showScan()}catch(e){return!1}},showSubwarp:function(){var m=window.__SA_MOVEMENT__;if(m&&m.start)return m.start(\"subwarp\");return!1},showWarp:function(){var m=window.__SA_MOVEMENT__;if(m&&m.start)return m.start(\"warp\");return!1},showStop:function(){var m=window.__SA_MOVEMENT__;if(m&&m.cancel&&m.getState&&m.getState().active)return m.cancel();try{return showStop()}catch(e){return!1}},showMine:function(){try{return showMine()}catch(e){return!1}}};",
  ],
  // Expose owned-fleet list + selected fleet for Wings board
  [
    "peekFleets:()=>vt,subscribeFleetChanges:",
    "peekFleets:()=>(window.__SA_PEEK_FLEETS__=()=>vt,vt),subscribeFleetChanges:",
  ],
  [
    "Hl&&console.log(\"[PixiMap] Player profile set:\",Hl)",
    "Hl&&(window.__SA_PLAYER_PROFILE__=Hl,console.log(\"[PixiMap] Player profile set:\",Hl))",
  ],
  [
    "hf=createMemo(()=>{const Zi=hs(),Hl=rs();if(!Zi||!Hl)return null;const _c=wt.getFleet(Zi);return _c?.exists?{...Hl,fleetAccount:_c}:null})",
    "hf=createMemo(()=>{const Zi=hs(),Hl=rs();if(!Zi||!Hl){try{window.__SA_SELECTED_FLEET__=null}catch{}return null}const _c=wt.getFleet(Zi);const _out=_c?.exists?{...Hl,fleetAccount:_c}:null;try{window.__SA_SELECTED_FLEET__=_out?{key:String(Zi),label:String(Hl.fleetLabel||_out.fleetLabel||Zi).slice(0,48)}:null}catch{}return _out})",
  ],
  [
    "Ap=createMemo(()=>{const Zi=Jc();return Zi.active?wt.getFleet(String(Zi.fleetKey))?.data??null:null})",
    "Ap=createMemo((()=>{try{window.__SA_MOVEMENT__={start:tp,cancel:Yv,submit:zp,getState:Jc,canSubmit:Rp}}catch(e){}return()=>{const Zi=Jc();return Zi.active?wt.getFleet(String(Zi.fleetKey))?.data??null:null}})())",
  ],
  // Movement planner + map math for wing multi-subwarp
  [
    'const Ac=Zi=>{pc()||Md(Hl=>movementPlannerReducer(Hl,Zi))},Ic={active:!1,type:"warp",fleetKey:"",fleetLabel:"",sourceX:0,sourceY:0,targetX:null,targetY:null,confirmed:!1,snappedSystemName:null}',
    'const Ac=Zi=>{pc()||Md(Hl=>movementPlannerReducer(Hl,Zi));try{if(Zi&&Zi.type==="choose-destination"&&window.__SA_WING_ORDER__&&window.__SA_WING_ORDER__.pending){const _wo=window.__SA_WING_ORDER__;const _dest=Zi.destination;queueMicrotask(()=>{try{if(window.__SA_WING_CONFIRM__){window.__SA_WING_CONFIRM__({wing:_wo,dest:_dest})}else if(window.__SA_PLANNER__&&window.__SA_PLANNER__.submit){window.__SA_PLANNER__.submit()}}catch(e){window.__SA_FLIGHT_LOG__&&window.__SA_FLIGHT_LOG__.push({type:"ERROR",msg:String(e&&e.message||e)})}})}}catch(_e){}},_saP=(window.__SA_PLANNER__={dispatch:Ac,set:Md,getState:hc,openList:function(m){return Md(startMovementPlannerFromFleetList(m||"subwarp"))},openFleet:function(k,m){return Md(startMovementPlannerFromFleet(k,m||"subwarp"))},openWing:function(keys,m){return Md({active:!1,destination:null,mapTargeting:!1,mode:m||"subwarp",origin:"fleet",searchQuery:"",selectedFleetKeys:(keys||[]).map(String)})},primeBatch:function(keys,m,dest){return Md({active:!1,destination:dest||null,mapTargeting:!1,mode:m||"subwarp",origin:"fleet",searchQuery:"",selectedFleetKeys:(keys||[]).map(String)})},bindSubmit:function(fn){this.submit=fn},submit:null}),Ic={active:!1,type:"warp",fleetKey:"",fleetLabel:"",sourceX:0,sourceY:0,targetX:null,targetY:null,confirmed:!1,snappedSystemName:null}',
  ],
  [
    "uh=async()=>{if(Us||pc())return;const Zi=hc()",
    "uh=async()=>{if(window.__SA_PLANNER__){window.__SA_PLANNER__.submit=uh;try{window.__SA_PLANNER__.bindSubmit(uh)}catch(e){}}if(Us||pc())return;const Zi=hc()",
  ],
  [
    "function pixelPointToGamePoint(ee,Se,nt){const at=Math.floor(Se/2),mt=ee.x/nt-at,ft=at-ee.y/MAP_CONFIG.COORDINATE_Y_SQUASH/nt;return{x:mt,y:ft}}",
    "function pixelPointToGamePoint(ee,Se,nt){const at=Math.floor(Se/2),mt=ee.x/nt-at,ft=at-ee.y/MAP_CONFIG.COORDINATE_Y_SQUASH/nt;return{x:mt,y:ft}}window.__SA_MAP_MATH__={pixelPointToGamePoint,MAP_CONFIG};",
  ],
  // Movement API: register inside function bodies (comma-chain inserts break this bundle's parse)
  [
    "snappedSystemName:null}),yu(null)},Yv=(Zi={})=>{iu=Zi.restoreInteractionRange??!0,Rc(Ic),yu(null)},Rp=Zi=>Zi.confirmed&&Zi.targetX!==null&&Zi.targetY!==null",
    "snappedSystemName:null}),yu(null),window.__SA_MOVEMENT__={start:tp,cancel:Yv,submit:()=>typeof zp===\"function\"?zp():null,getState:Jc,canSubmit:Rp}},Yv=(Zi={})=>{iu=Zi.restoreInteractionRange??!0,Rc(Ic),yu(null)},Rp=Zi=>Zi.confirmed&&Zi.targetX!==null&&Zi.targetY!==null",
  ],
  [
    "zp=async()=>{const Zi=Jc();if(!(hd||!Rp(Zi))){hd=!0,Td(!0);try{await up(Zi)}finally{hd=!1,Td(!1)}}}",
    "zp=async()=>{window.__SA_MOVEMENT__={start:tp,cancel:Yv,submit:zp,getState:Jc,canSubmit:Rp};const Zi=Jc();if(!(hd||!Rp(Zi))){hd=!0,Td(!0);try{await up(Zi)}finally{hd=!1,Td(!1)}}}",
  ],
  // Issue #1: skip warp/subwarp particle trails when disabled (FPS)
  // https://github.com/Harlock-Space-Pirate/sage-ui-fixes/issues/1
  [
    "createWarpTrail(Se,nt,at){this.destroyWarpTrail(),this.warpTrailContainer=new Container",
    "createWarpTrail(Se,nt,at){if(window.__SA_NO_WARP_TRAILS__)return;this.destroyWarpTrail(),this.warpTrailContainer=new Container",
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
    // Issue #1: warp trails off (param-name agnostic)
    [
      /createWarpTrail\(([A-Za-z0-9_$]+),([A-Za-z0-9_$]+),([A-Za-z0-9_$]+)\)\{this\.destroyWarpTrail\(\),/g,
      'createWarpTrail($1,$2,$3){if(window.__SA_NO_WARP_TRAILS__)return;this.destroyWarpTrail(),'
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
      'console.log("✅ Attack starbase transaction sent"),$1(`Attack order submitted against ${$2.systemName}.`,"success",{presentation:"feed",title:"Starbase attack launched",targets:[$3($2)]});(()=>{const _key=$2.systemKey,_lbl=$2.systemName||"Starbase",_snap=$11,_toast=$1,_tgt=[$3($2)],_read=()=>{try{const list=(typeof wt!=="undefined"&&wt?.state?.starSystems)||[];const s=list.find(x=>x.address===_key||String(x.address)===String(_key));const st=s?.data?.starbase;const v=st?.__option==="Some"?st.value:st?.value??st;return Number(v?.hp??0)}catch{return 0}},_readOwner=()=>{try{const map=(typeof wt!=="undefined"&&wt?.state?.map?.systems)||{};let sys=map[_key]||map[String(_key)];if(!sys){for(const k of Object.keys(map)){const m=map[k];if(m&&(m.name===_lbl||String(m._systemId)===String(_key)||m.address===_key)){sys=m;break}}}if(sys?.owner!=null)return sys.owner;const list=(typeof wt!=="undefined"&&wt?.state?.starSystems)||[];const s=list.find(x=>x.address===_key||String(x.address)===String(_key));return s?.data?.owner??s?.owner??null}catch{return null}};window.__SA_RESOLVE_COMBAT?.({kind:"STARBASE",target:_lbl,preHp:(()=>{try{const c=window.__SA_PRE_COMBAT__&&window.__SA_PRE_COMBAT__[_lbl];const live=_read();if(c&&Number.isFinite(Number(c.hp))&&Date.now()-Number(c.t||0)<18e4)return Math.max(Number(c.hp),Number(live)||0);return live}catch{return _read()}})(),preOwner:_readOwner(),id:`sb-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,7)}`,readHp:_read,readOwner:_readOwner,refetch:async()=>{try{await Kt?.refetch?.starSystem?.();await Kt?.refetch?.factionOwnership?.();window.__SA_MAP_BUMP__?.afterData?.({name:_lbl})}catch{}},x:_snap?.target?.x,y:_snap?.target?.y,sx:_snap?.source?.x,sy:_snap?.source?.y,toast:_toast,targets:_tgt})})();await $4({fleetKey:$5.address,fleetInfo:$6,game:$7,character:$8,gw:$9,actionLabel:"Attack",onFleetRefreshed:window.__SA_WRAP_CS?.($10.createCounterstrikeRefreshHandler($11,$12,.8),{attacker:$11?.attacker,coords:$11,toast:$1,target:$2.systemName||"Starbase",targets:[$3($2)]})||$10.createCounterstrikeRefreshHandler($11,$12,.8)})'
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

    // Space → subwarp pick / confirm (locals renamable)
    [
      /const ([A-Za-z0-9_$]+)=([A-Za-z0-9_$]+)=>\{\2\.key==="Escape"&&([A-Za-z0-9_$]+)\(\)\.active&&!([A-Za-z0-9_$]+)&&\(([A-Za-z0-9_$]+)\(\),([A-Za-z0-9_$]+)\(\)\)\};window\.addEventListener\("keydown",\1\)/g,
      'const $1=$2=>{if($2.key==="Escape"&&$3().active&&!$4)return $5(),$6();if(($2.code==="Space"||$2.key===" ")&&!$2.repeat&&!$2.metaKey&&!$2.ctrlKey&&!$2.altKey){const el=$2.target;if(el&&((el.closest&&el.closest("input,textarea,select,[contenteditable=true]"))||el.tagName==="INPUT"||el.tagName==="TEXTAREA"||el.isContentEditable))return;if(typeof hc==="function"&&hc().active)return;$2.preventDefault();if(window.__SA_HOTKEYS__&&window.__SA_HOTKEYS__.isCapture&&window.__SA_HOTKEYS__.isCapture())return;if($3().active&&typeof Rp==="function"&&Rp($3())&&!$4){typeof zp==="function"?zp():up($3());return}if($3().active)return;const f=typeof hf==="function"?hf():null;if(f)tp($2.shiftKey?"warp":"subwarp")}};window.addEventListener("keydown",$1)'
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
window.__SA_WARP_TRAILS__=window.__SA_WARP_TRAILS__||(function(){var KEY="saNoWarpTrails";function read(){try{return localStorage.getItem(KEY)==="1"}catch(e){return!1}}function apply(){try{window.__SA_NO_WARP_TRAILS__=read()}catch(e){window.__SA_NO_WARP_TRAILS__=!1}}function wipe(){try{var walk=function(n,d){if(!n||d>20)return;try{if(typeof n.destroyWarpTrail==="function")n.destroyWarpTrail();else if(n.warpTrailContainer){try{n.warpTrailContainer.visible=!1}catch(_){}try{n.warpTrailActive=!1}catch(_){}}}catch(_){}var kids=n.children;if(kids)for(var i=0;i<kids.length;i++)walk(kids[i],d+1)};var roots=[window.__SA_MAP_VIEWPORT__,window.__SA_PIXI_APP__&&window.__SA_PIXI_APP__.stage].filter(Boolean);for(var r=0;r<roots.length;r++)walk(roots[r],0)}catch(e){}}function setEnabled(on){try{if(on)localStorage.removeItem(KEY);else localStorage.setItem(KEY,"1")}catch(e){}apply();if(!on)wipe();return isEnabled()}function isEnabled(){return!read()&&!window.__SA_NO_WARP_TRAILS__}apply();return{isEnabled:isEnabled,isOff:function(){return!isEnabled()},setEnabled:setEnabled,enable:function(){return setEnabled(!0)},disable:function(){return setEnabled(!1)},wipe:wipe}})();
window.__SA_ZOOM_HUD__=window.__SA_ZOOM_HUD__||(function(){
  var KEY="saZoomHud", timer=null, el=null;
  function read(){try{return localStorage.getItem(KEY)==="1"}catch(e){return!1}}
  function ensure(){
    if(el&&el.isConnected)return el;
    el=document.createElement("div");
    el.id="sa-zoom-hud";
    el.setAttribute("aria-live","polite");
    el.style.cssText="position:fixed;top:12px;right:12px;z-index:999995;pointer-events:none;"
      +"min-width:148px;padding:10px 12px;border-radius:4px;"
      +"background:linear-gradient(165deg,rgba(22,18,12,.96),rgba(10,12,16,.98));"
      +"border:1px solid rgba(255,190,77,.45);"
      +"box-shadow:0 12px 32px rgba(0,0,0,.55),inset 0 1px rgba(255,255,255,.06);"
      +"font:700 10px Orbitron,ui-sans-serif,system-ui,sans-serif;color:#e8d9a8;letter-spacing:.06em;"
      +"display:none";
    el.innerHTML='<div style="color:#ffbe4d;font:800 9px Orbitron,sans-serif;letter-spacing:.14em;text-transform:uppercase;margin-bottom:6px">Zoom</div>'
      +'<div data-z style="font:800 18px Orbitron,sans-serif;color:#ffbe4d;letter-spacing:.04em;line-height:1.1">—</div>'
      +'<div data-w style="margin-top:6px;font:600 8px Orbitron,sans-serif;color:rgba(200,184,138,.55);letter-spacing:.04em;line-height:1.35">world —</div>'
      +'<div data-g style="font:600 8px Orbitron,sans-serif;color:rgba(200,184,138,.55);letter-spacing:.04em;line-height:1.35">game —</div>';
    (document.body||document.documentElement).appendChild(el);
    return el;
  }
  function readZoom(){
    var vp=window.__SA_MAP_VIEWPORT__, scale=null, cx=null, cy=null, gx=null, gy=null;
    try{
      if(vp){
        scale=Number(vp.scale&&(vp.scale.x!=null?vp.scale.x:vp.scale));
        if(!Number.isFinite(scale)&&typeof vp.scaled==="number")scale=Number(vp.scaled);
        if(vp.center){cx=Number(vp.center.x);cy=Number(vp.center.y)}
        else if(typeof vp.center==="object"&&vp.center){cx=vp.center.x;cy=vp.center.y}
      }
    }catch(e){}
    try{
      var math=window.__SA_MAP_MATH__;
      if(math&&math.pixelPointToGamePoint&&math.MAP_CONFIG&&Number.isFinite(cx)&&Number.isFinite(cy)){
        var cfg=math.MAP_CONFIG;
        var g=math.pixelPointToGamePoint({x:cx,y:cy},cfg.WORLD_GRID_SIZE||101,cfg.TILE_SIZE||80);
        if(g){gx=g.x;gy=g.y}
      }else if(Number.isFinite(cx)&&Number.isFinite(cy)){
        // fallback inverse of gameToWorld used elsewhere
        var TILE=80,GRID=101,SQUASH=.7,at=Math.floor(GRID/2);
        gx=cx/TILE-at; gy=at-cy/SQUASH/TILE;
      }
    }catch(e){}
    return{scale:scale,cx:cx,cy:cy,gx:gx,gy:gy,hasVp:!!vp};
  }
  function paint(){
    if(!read())return;
    var n=ensure(), z=readZoom();
    var zEl=n.querySelector("[data-z]"), wEl=n.querySelector("[data-w]"), gEl=n.querySelector("[data-g]");
    if(zEl)zEl.textContent=Number.isFinite(z.scale)?("×"+z.scale.toFixed(2)):("— no vp");
    if(wEl)wEl.textContent=Number.isFinite(z.cx)?("world "+z.cx.toFixed(1)+", "+z.cy.toFixed(1)):"world —";
    if(gEl)gEl.textContent=Number.isFinite(z.gx)?("game "+z.gx.toFixed(2)+", "+z.gy.toFixed(2)):"game —";
    n.style.display="block";
    n.title=z.hasVp?"Map zoom (viewport scale)":"Waiting for map viewport…";
  }
  function start(){
    try{localStorage.setItem(KEY,"1")}catch(e){}
    ensure();
    paint();
    if(timer)clearInterval(timer);
    timer=setInterval(paint,150);
    return!0;
  }
  function stop(){
    try{localStorage.removeItem(KEY)}catch(e){}
    if(timer){clearInterval(timer);timer=null}
    if(el){try{el.style.display="none"}catch(e){}}
    return!1;
  }
  function isOn(){return read()||!!timer}
  function setEnabled(on){return on?start():stop()}
  // auto
  try{if(read())setTimeout(start,1200)}catch(e){}
  return{on:start,off:stop,start:start,stop:stop,isOn:isOn,setEnabled:setEnabled,enable:start,disable:stop,paint:paint,read:readZoom};
})();
window.__SA_COALESCE_MAP_REFRESH__=window.__SA_COALESCE_MAP_REFRESH__||(function(){let inflight=null,timers=[];const clearT=()=>{for(const t of timers)clearTimeout(t);timers=[]};return function(refetchers,meta){const run=()=>{if(inflight)return inflight;const jobs=[];try{const r=refetchers;if(typeof r==="function")jobs.push(r());else if(r&&typeof r==="object"){if(r.starSystem)jobs.push(r.starSystem());if(r.factionOwnership)jobs.push(r.factionOwnership());if(r.fleets)jobs.push(r.fleets())}}catch(_){}inflight=Promise.all(jobs.map(p=>Promise.resolve(p).catch(()=>{}))).finally(()=>{inflight=null;try{window.__SA_MAP_BUMP__?.afterData?.(meta)}catch(_){}});return inflight};clearT();run();for(const ms of[1500,6e3])timers.push(setTimeout(()=>void run(),ms));return!0}})();
window.__SA_MAP_BUMP__=window.__SA_MAP_BUMP__||(function(){const USTUR=16755200,MUD=14958374,ONI=26367,NEUT=10526880;const tintFor=o=>{const n=Number(o);if(n===1||o==="MUD"||o==="Mud")return MUD;if(n===2||o==="ONI"||o==="Oni")return ONI;if(n===3||o==="USTUR"||o==="Ustur")return USTUR;return NEUT};const walk=(n,fn,d=0)=>{if(!n||d>16)return;try{fn(n)}catch(_){}const kids=n.children;if(!kids)return;for(let i=0;i<kids.length;i++)walk(kids[i],fn,d+1)};const bumpPin=(pin,owner)=>{if(!pin)return!1;const t=tintFor(owner);try{pin._systemOwner=typeof owner==="string"?owner:owner;if(pin._starGlow){pin._starGlow.tint=t;pin._starGlow.alpha=Math.min(.04,Number(pin._starGlow.alpha)||.04)}if(pin._starCore)pin._starCore.tint=t;if(pin._softHalo)pin._softHalo.tint=t;return!0}catch{return!1}};function afterData(meta){try{const vp=window.__SA_MAP_VIEWPORT__,stage=window.__SA_PIXI_APP__?.stage;let n=0;const want=(meta&&meta.name)||null;const roots=[vp,stage].filter(Boolean);for(const root of roots)walk(root,node=>{if(!node||!node._starGlow)return;if(want&&node.label&&String(node.label)!==String(want)&&!(node._systemName&&node._systemName===want))return;if(node._systemOwner!=null||node._starGlow){const o=meta&&meta.owner!=null?meta.owner:node._systemOwner;if(o!=null&&bumpPin(node,o))n++}});if(n)console.debug("%c ⚔️ sa-map-bump %c pins", "background:#0a0f19;color:#00e5ff;padding:1px 6px","color:#34d399",n,meta||{})}catch(_){}}function bumpSystem(meta){afterData(meta||{});return!0}return{afterData,bumpSystem,bumpPin}})();
/* HUD overlays must never leak pointer events into the game (station view treats any click as map intent) */
function saIsolate(el){try{if(!el||el.__saIso)return el;el.__saIso=1;["pointerdown","pointermove","pointerup","mousedown","mousemove","mouseup","click","dblclick","contextmenu","wheel","touchstart","touchmove","touchend"].forEach(function(t){el.addEventListener(t,function(e){e.stopPropagation()},false)})}catch(e){}return el}
/* On-chain strings (fleet labels, system names) are untrusted — escape before innerHTML */
function saEsc(s){return String(s==null?"":s).replace(/[&<>"']/g,function(ch){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]})}
/* True once past the splash menu (fleets loaded or HUD header present) */
window.__SA_IN_GAME=function(){try{var p=window.__SA_PEEK_FLEETS__;if(typeof p==="function"&&p().length>0)return!0}catch(e){}try{if(document.querySelector('[class*="globalHeaderContainer"]'))return!0}catch(e){}return!1};
function saGameToPixel(x,y){try{var m=window.__SA_MAP_MATH__;if(m&&m.MAP_CONFIG){var T=Number(m.MAP_CONFIG.TILE_SIZE)||80,G=Number(m.MAP_CONFIG.WORLD_GRID_SIZE)||101,S=Number(m.MAP_CONFIG.COORDINATE_Y_SQUASH)||.7,at=Math.floor(G/2);return{x:(Number(x)+at)*T,y:(at-Number(y))*S*T}}}catch(e){}return null}
/* Shared chamfered gold-frame modal skin (fly confirm + wing confirm) */
function saEnsureModalCss(){if(document.getElementById("sa-mf-style"))return;var st=document.createElement("style");st.id="sa-mf-style";st.textContent=".sa-mf-wrap{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(3,5,9,.68);font-family:Orbitron,ui-sans-serif,system-ui,sans-serif}"
+".sa-mf-frame{width:min(440px,92vw);padding:1px;background:linear-gradient(160deg,rgba(255,190,77,.9),rgba(255,190,77,.25) 45%,rgba(255,190,77,.75));clip-path:polygon(16px 0,calc(100% - 16px) 0,100% 16px,100% calc(100% - 16px),calc(100% - 16px) 100%,16px 100%,0 calc(100% - 16px),0 16px);filter:drop-shadow(0 24px 60px rgba(0,0,0,.78))}"
+".sa-mf-card{clip-path:polygon(15px 0,calc(100% - 15px) 0,100% 15px,100% calc(100% - 15px),calc(100% - 15px) 100%,15px 100%,0 calc(100% - 15px),0 15px);background:linear-gradient(165deg,rgba(26,21,13,.99),rgba(9,11,15,.99));color:#e8d9a8}"
+".sa-mf-head{display:flex;align-items:center;gap:10px;padding:12px 14px;border-bottom:1px solid rgba(255,190,77,.25);background:rgba(255,190,77,.08)}"
+".sa-mf-head .ico{flex-shrink:0;width:30px;height:30px;display:flex;align-items:center;justify-content:center;border:1px solid rgba(255,190,77,.4);background:rgba(0,0,0,.35)}"
+".sa-mf-head .ico svg{width:18px;height:18px;stroke:#ffbe4d;fill:none;stroke-width:2}"
+".sa-mf-head .t{color:#ffbe4d;font:800 11px Orbitron,sans-serif;letter-spacing:.14em;text-transform:uppercase}"
+".sa-mf-head .s{color:rgba(232,217,168,.55);font:600 9px Orbitron,sans-serif;letter-spacing:.06em;margin-top:2px;text-transform:uppercase}"
+".sa-mf-head .mode{margin-left:auto;padding:4px 8px;border:1px solid;font:800 9px Orbitron,sans-serif;letter-spacing:.12em}"
+".sa-mf-head .mode.w{color:#32feff;border-color:rgba(50,254,255,.5);background:rgba(50,254,255,.08)}"
+".sa-mf-head .mode.s{color:#34ff88;border-color:rgba(52,255,136,.5);background:rgba(52,255,136,.08)}"
+".sa-mf-body{padding:14px 14px 10px}"
+".sa-mf-line{font:700 9px Orbitron,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:rgba(232,217,168,.6)}"
+".sa-mf-dest{margin-top:8px;padding:10px 12px;border:1px solid rgba(255,190,77,.45);background:rgba(0,0,0,.42);box-shadow:inset 0 0 14px rgba(255,190,77,.07);color:#fff8e8;font:800 13px Orbitron,sans-serif;letter-spacing:.04em;word-break:break-word}"
+".sa-mf-hint{margin-top:10px;font:600 8px Orbitron,sans-serif;letter-spacing:.1em;text-transform:uppercase;color:rgba(232,217,168,.42)}"
+".sa-mf-hint b{color:rgba(255,190,77,.75)}"
+".sa-mf-foot{display:flex;gap:8px;justify-content:flex-end;padding:12px 14px;border-top:1px solid rgba(255,190,77,.2)}"
+".sa-mf-btn{appearance:none;cursor:pointer;min-width:104px;padding:10px 14px;border-radius:2px;font:800 10px Orbitron,sans-serif;letter-spacing:.12em;text-transform:uppercase;transition:background .12s,border-color .12s,transform .1s,box-shadow .12s}"
+".sa-mf-btn:active{transform:translateY(1px)}"
+".sa-mf-btn.gold{border:1px solid rgba(255,190,77,.7);background:linear-gradient(165deg,#6b5a28,#3a3216);color:#fff8e0;box-shadow:inset 0 1px rgba(255,255,255,.1)}"
+".sa-mf-btn.gold:hover{background:linear-gradient(165deg,#7d6a30,#443a1a);box-shadow:0 0 14px rgba(255,190,77,.25)}"
+".sa-mf-btn.gold:disabled{opacity:.4;cursor:not-allowed;box-shadow:none}"
+".sa-mf-btn.dim{border:1px solid rgba(255,255,255,.18);background:transparent;color:#9a917c}"
+".sa-mf-btn.dim:hover{color:#e8d9a8;border-color:rgba(255,190,77,.4)}";document.documentElement.appendChild(st)}
window.__SA_LOG_COMBAT_EVENT=window.__SA_LOG_COMBAT_EVENT||(function(){let min=!1;const c=document.createElement("div");c.id="sa-combat-log-box";c.className="sa-hud-panel";c.style.cssText="position:fixed;bottom:16px;left:16px;width:min(400px,calc(100vw - 24px));max-width:calc(100vw - 24px);max-height:min(300px,42vh);background:linear-gradient(165deg,rgba(22,18,12,.97),rgba(10,12,16,.98));backdrop-filter:blur(10px);border:1px solid rgba(255,190,77,.4);border-radius:4px;box-shadow:0 16px 48px rgba(0,0,0,.65),0 0 0 1px rgba(0,0,0,.4),inset 0 1px rgba(255,255,255,.06);font-family:Orbitron,ui-sans-serif,system-ui,sans-serif;color:#e8d9a8;font-size:10px;z-index:999999;display:flex;flex-direction:column;overflow:hidden;box-sizing:border-box;";c.title='SAGE UI Fixes — Combat / Flight Log (drag tabs · dbl-click reset)';c.dataset.saOverlay='combat-log';saIsolate(c);c.setAttribute("data-fc-floating-utility","true");const b=document.createElement("div");b.className="sa-cl-body";b.style.cssText="padding:8px 10px;overflow-x:hidden;overflow-y:auto;flex:none;height:132px;display:flex;flex-direction:column;gap:5px;min-height:0;box-sizing:border-box;scrollbar-width:thin;scrollbar-color:rgba(255,190,77,.45) transparent;";if(!document.getElementById("sa-cl-style")){const st=document.createElement("style");st.id="sa-cl-style";st.textContent="#sa-combat-log-box{font-family:Orbitron,ui-sans-serif,system-ui,sans-serif}#sa-combat-log-box .sa-cl-head{font-family:Orbitron,sans-serif}#sa-combat-log-box .sa-cl-ico{appearance:none;min-height:32px;min-width:34px;padding:6px 10px;border-radius:2px;border:1px solid rgba(255,255,255,.14);background:rgba(0,0,0,.3);color:#e8d9a8;font:700 10px Orbitron,sans-serif;letter-spacing:.08em;text-transform:uppercase;cursor:pointer}#sa-combat-log-box .sa-cl-ico:hover{border-color:rgba(255,190,77,.5);color:#ffbe4d;background:rgba(255,190,77,.08)}#sa-combat-log-box .sa-cl-tabs{display:flex;gap:0;flex-shrink:0;border-bottom:1px solid rgba(255,190,77,.18);background:rgba(0,0,0,.2)}#sa-combat-log-box .sa-cl-tabs button{flex:1;appearance:none;border:none;background:transparent;color:rgba(200,184,138,.45);font:700 10px Orbitron,sans-serif;letter-spacing:.12em;text-transform:uppercase;padding:9px 6px;cursor:pointer}#sa-combat-log-box .sa-cl-tabs button:hover{color:rgba(255,190,77,.75)}#sa-combat-log-box .sa-cl-tabs button.on{color:#ffbe4d;background:rgba(255,190,77,.1);box-shadow:inset 0 -2px #ffbe4d}#sa-combat-log-box .sa-cl-body::-webkit-scrollbar{width:8px}#sa-combat-log-box .sa-cl-body::-webkit-scrollbar-track{background:transparent}#sa-combat-log-box .sa-cl-body::-webkit-scrollbar-thumb{background:linear-gradient(180deg,rgba(255,190,77,.5),rgba(255,190,77,.2));border-radius:4px;border:2px solid transparent}#sa-combat-log-box .sa-cl-body::-webkit-scrollbar-thumb:hover{background:rgba(255,190,77,.7)}#sa-combat-log-box .sa-cl-row{line-height:1.4;border-bottom:1px solid rgba(255,190,77,.1);padding:4px 2px 6px;overflow-wrap:anywhere;word-break:break-word;white-space:normal;max-width:100%;box-sizing:border-box;font:600 1em/1.4 ui-sans-serif,system-ui,sans-serif;color:rgba(232,217,168,.85)}#sa-combat-log-box .sa-cl-row .t{color:rgba(200,184,138,.45);font:600 .9em ui-monospace,Menlo,monospace}#sa-combat-log-box .sa-cl-row .tag{font:800 .9em Orbitron,sans-serif;letter-spacing:.08em;text-transform:uppercase}#sa-combat-log-box.sa-cl-dragging{opacity:.97;box-shadow:0 22px 56px rgba(0,0,0,.75),0 0 20px rgba(255,190,77,.12)}#sa-combat-log-box.sa-cl-dragging .sa-cl-head{cursor:grabbing}#sa-combat-log-box .sa-cl-flight .sa-cl-row{color:rgba(232,217,168,.8)}#sa-combat-log-box .sa-cl-comms .sa-cl-row{user-select:text}#sa-combat-log-box .sa-cl-msg{margin-top:2px;font:600 1em/1.45 ui-sans-serif,system-ui,sans-serif;color:rgba(232,217,168,.9);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;cursor:pointer}#sa-combat-log-box .sa-cl-msg.open{white-space:normal;overflow:visible;font-size:1.2em;line-height:1.5;color:#fff8e8}#sa-combat-log-box .sa-cl-tabs button.ping{color:#ff6b6b;animation:saTabPing .7s ease-in-out 5}@keyframes saTabPing{50%{opacity:.3}}#sa-comms-strip{position:fixed;top:110px;left:50%;transform:translateX(-50%);z-index:999998;max-width:min(680px,92vw);padding:8px 14px;background:linear-gradient(165deg,rgba(22,18,12,.97),rgba(10,12,16,.98));border:1px solid rgba(255,190,77,.5);border-radius:3px;color:#ffe9b0;font:700 11px/1.4 Orbitron,sans-serif;letter-spacing:.05em;box-shadow:0 10px 30px rgba(0,0,0,.6),0 0 14px rgba(255,190,77,.15);opacity:0;transition:opacity .25s;pointer-events:none;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}#sa-comms-strip.on{opacity:1;pointer-events:auto;cursor:pointer}#sa-combat-log-box .sa-cl-tabs{cursor:grab;touch-action:none;user-select:none;align-items:stretch}#sa-combat-log-box.sa-cl-dragging .sa-cl-tabs{cursor:grabbing}#sa-combat-log-box .sa-cl-ctl{display:flex;gap:4px;align-items:center;padding:3px 4px;margin-left:auto;border-left:1px solid rgba(255,190,77,.18)}#sa-combat-log-box .sa-cl-ctl .sa-cl-ico{min-height:22px;min-width:26px;padding:3px 6px;font-size:9px}#sa-combat-log-box .sa-cl-minlabel{display:none;flex:1;align-items:center;gap:7px;padding-left:10px;min-width:0;white-space:nowrap;overflow:hidden;color:rgba(255,190,77,.85);font:800 10px Orbitron,sans-serif;letter-spacing:.14em;text-transform:uppercase;pointer-events:none}#sa-combat-log-box.sa-cl-min .sa-cl-minlabel{display:flex}#sa-combat-log-box.sa-cl-min .sa-cl-tabs{border-bottom:none}#sa-combat-log-box.sa-cl-min .sa-cl-tabs button[data-tab]{display:none}#sa-combat-log-box.sa-cl-min .sa-cl-ctl .sa-cl-ico:not(#sa-cl-min){display:none}#sa-combat-log-box .sa-cl-grip{display:flex;align-items:center;padding:0 7px;color:rgba(255,190,77,.65);font-size:13px;line-height:1;cursor:grab;user-select:none;letter-spacing:-2px}#sa-combat-log-box.sa-cl-dragging .sa-cl-grip{cursor:grabbing}#sa-combat-log-box.sa-cl-min .sa-cl-grip{display:none}#sa-combat-log-box .sa-cl-pop{position:absolute;top:36px;right:6px;z-index:6;display:flex;gap:4px;padding:4px;background:rgba(8,10,14,.98);border:1px solid rgba(255,190,77,.4);border-radius:3px;box-shadow:0 10px 26px rgba(0,0,0,.65)}#sa-combat-log-box .sa-cl-pop .sa-cl-ico{min-height:24px;min-width:30px}"
+"#sa-combat-log-box .sa-cl-resize{position:absolute;right:2px;bottom:2px;width:14px;height:14px;cursor:nwse-resize;z-index:7;background:linear-gradient(135deg,transparent 50%,rgba(255,190,77,.6) 50%,rgba(255,190,77,.6) 58%,transparent 58%,transparent 70%,rgba(255,190,77,.4) 70%,rgba(255,190,77,.4) 78%,transparent 78%)}";document.documentElement.appendChild(st)}const tabs=document.createElement("div");tabs.className="sa-cl-tabs";tabs.innerHTML='<span class="sa-cl-grip" title="Drag log">⠿</span><span class="sa-cl-minlabel">⚔️ Combat · Flight · Comms</span><button type="button" data-tab="combat" class="on">Combat</button><button type="button" data-tab="flight">Flight</button><button type="button" data-tab="comms">Comms</button><span class="sa-cl-ctl"><button id="sa-cl-menu" type="button" class="sa-cl-ico" title="Text size · clear">⋮</button><button id="sa-cl-min" type="button" class="sa-cl-ico" title="Minimize">−</button></span>';const bf=document.createElement("div");bf.className="sa-cl-body sa-cl-flight";bf.style.cssText=b.style.cssText;bf.style.display="none";const bc=document.createElement("div");bc.className="sa-cl-body sa-cl-comms";bc.style.cssText=b.style.cssText;bc.style.display="none";c.appendChild(tabs);c.appendChild(b);c.appendChild(bf);c.appendChild(bc);const pop=document.createElement("div");pop.className="sa-cl-pop";pop.style.display="none";pop.innerHTML='<button type="button" id="sa-cl-fd" class="sa-cl-ico" title="Smaller text">A−</button><button type="button" id="sa-cl-fi" class="sa-cl-ico" title="Bigger text">A+</button><button type="button" id="sa-cl-cls" class="sa-cl-ico" title="Clear">CLR</button>';c.appendChild(pop);const rz=document.createElement("div");rz.className="sa-cl-resize";rz.title="Drag to resize";c.appendChild(rz);(function(){var drag=!1,sx=0,sy=0,sw=0,sh=0;rz.addEventListener("pointerdown",function(e){if(e.button!==0)return;drag=!0;sx=e.clientX;sy=e.clientY;sw=c.offsetWidth;sh=b.offsetHeight;try{rz.setPointerCapture(e.pointerId)}catch(_){}e.preventDefault();e.stopPropagation()});rz.addEventListener("pointermove",function(e){if(!drag)return;var w=Math.max(260,Math.min(window.innerWidth-24,sw+(e.clientX-sx)));var h=Math.max(80,Math.min(window.innerHeight-120,sh+(e.clientY-sy)));c.style.width=w+"px";[b,bf,bc].forEach(function(x){x.style.height=h+"px"})});var up=function(){drag=!1};rz.addEventListener("pointerup",up);rz.addEventListener("pointercancel",up)})();let activeTab="combat";const showTab=t=>{activeTab=t;tabs.querySelectorAll("button").forEach(btn=>{btn.classList.toggle("on",btn.dataset.tab===t)});b.style.display=t==="combat"?"flex":"none";bf.style.display=t==="flight"?"flex":"none";bc.style.display=t==="comms"?"flex":"none";if(t==="flight")paintFlight();if(t==="comms"){paintComms();try{tabs.querySelector('[data-tab="comms"]').classList.remove("ping")}catch(_){}}};tabs.onclick=e=>{const btn=e.target.closest("button[data-tab]");if(btn)showTab(btn.dataset.tab)};const paintFlight=()=>{bf.innerHTML="";const ev=(window.__SA_FLIGHT_LOG__&&window.__SA_FLIGHT_LOG__.get&&window.__SA_FLIGHT_LOG__.get())||[];if(!ev.length){const empty=document.createElement("div");empty.className="sa-cl-row";empty.style.color="rgba(200,184,138,.4)";empty.textContent="No flight orders yet — select a wing + Subwarp, click map.";bf.appendChild(empty);return}ev.slice().reverse().forEach(e=>{const r=document.createElement("div");r.className="sa-cl-row";const t=e.at?new Date(e.at).toLocaleTimeString("en-US",{hour12:!1}):"";const col=e.type==="ERROR"?"#f87171":e.type==="WARN"||e.type==="SKIP"?"#fbbf24":e.type==="SUBMIT"||e.type==="ORDER"||e.type==="PICK"?"#ffbe4d":e.type==="WING"?"#e8d9a8":"#94a3b8";r.innerHTML='<span class="t">['+t+']</span> <span class="tag" style="color:'+col+'">'+String(e.type||"LOG")+'</span> '+(e.fleet?('<b style="color:#f0ebe0">'+saEsc(e.fleet)+'</b> '):"")+(e.wing?('<span style="color:#ffbe4d">'+saEsc(e.wing)+'</span> '):"")+saEsc(e.msg||e.dest||"");bf.appendChild(r)});bf.scrollTop=0};const comms=[];let stripEl=null,stripT=0;const paintComms=()=>{bc.innerHTML="";if(!comms.length){const empty=document.createElement("div");empty.className="sa-cl-row";empty.style.color="rgba(200,184,138,.4)";empty.textContent="No comms yet — game pop-ups land here.";bc.appendChild(empty);return}comms.slice().reverse().forEach(e=>{const r=document.createElement("div");r.className="sa-cl-row";const t=e.at?new Date(e.at).toLocaleTimeString("en-US",{hour12:!1}):"";const head=document.createElement("span");head.className="t";head.textContent="["+t+"]";r.appendChild(head);if(e.title){const tg=document.createElement("span");tg.className="tag";tg.style.color="#ffbe4d";tg.textContent=" "+e.title;r.appendChild(tg)}const m=document.createElement("div");m.className="sa-cl-msg";m.textContent=e.msg||"";m.title="Click to expand · select to copy";m.onclick=function(){m.classList.toggle("open")};r.appendChild(m);bc.appendChild(r)});bc.scrollTop=0};const pingTab=()=>{try{const btn=tabs.querySelector('[data-tab="comms"]');if(btn&&activeTab!=="comms"){btn.classList.remove("ping");void btn.offsetWidth;btn.classList.add("ping");setTimeout(function(){btn.classList.remove("ping")},4000)}}catch(_){}};const showStrip=text=>{try{if(!stripEl){stripEl=document.createElement("div");stripEl.id="sa-comms-strip";saIsolate(stripEl);stripEl.onclick=function(){stripEl.classList.remove("on");try{showTab("comms")}catch(_){}};document.body.appendChild(stripEl)}stripEl.textContent=text.length>140?text.slice(0,140)+"…":text;stripEl.classList.add("on");clearTimeout(stripT);stripT=setTimeout(function(){stripEl.classList.remove("on")},6000)}catch(_){}};const pushComms=(title,msg)=>{comms.push({at:Date.now(),title:String(title||""),msg:String(msg||"")});if(comms.length>150)comms.shift();if(activeTab==="comms")paintComms();pingTab();showStrip((title?title+" — ":"")+msg)};window.__SA_COMMS__={push:function(m,t){pushComms(t,m)},get:function(){return comms.slice()}};(function(){if(typeof MutationObserver==="undefined")return;const seen=new WeakSet();const mo=new MutationObserver(function(muts){for(let i=0;i<muts.length;i++){const added=muts[i].addedNodes;for(let j=0;j<added.length;j++){const el=added[j];if(!el||el.nodeType!==1)continue;let row=null;try{const SEL='[class*="notificationRow_"],[class*="notificationAnnouncement_"]';row=el.matches&&el.matches(SEL)?el:(el.querySelector&&el.querySelector(SEL))}catch(_){}if(row&&!seen.has(row)){seen.add(row);const tt=row.querySelector('[class*="notificationRowTitle"]')||row.querySelector('[class*="notificationTitle_"]');const dd=row.querySelector('[class*="notificationRowDetail"]')||row.querySelector('[class*="notificationBody_"]')||row.querySelector('[class*="notificationDetail_"]');const msg=(dd&&dd.textContent||"").trim()||(row.textContent||"").trim();if(msg)pushComms((tt&&tt.textContent||"").trim(),msg)}}}});const start=()=>{if(document.body)mo.observe(document.body,{childList:true,subtree:true});else setTimeout(start,300)};start()})();const mount=()=>{if(document.body){if(!document.getElementById("sa-combat-log-box"))document.body.appendChild(c)}else setTimeout(mount,100)};mount();c.querySelector("#sa-cl-cls").onclick=e=>{e.stopPropagation();if(activeTab==="flight"){try{window.__SA_FLIGHT_LOG__.clear()}catch(_){ }paintFlight()}else b.innerHTML="";pop.style.display="none"};const setMin=function(on){min=!!on;c.classList.toggle("sa-cl-min",min);if(min){if(!c.dataset.saPrevPos)c.dataset.saPrevPos=JSON.stringify({left:c.style.left,top:c.style.top,bottom:c.style.bottom,right:c.style.right,width:c.style.width,bh:b.style.height});c.style.top="auto";c.style.bottom="8px";c.style.left="16px";c.style.right="auto";c.style.width="auto"}else{if(c.dataset.saPrevPos){try{var pp=JSON.parse(c.dataset.saPrevPos);c.style.left=pp.left;c.style.top=pp.top;c.style.bottom=pp.bottom;c.style.right=pp.right;if(pp.width)c.style.width=pp.width;if(pp.bh!==undefined){b.style.height=pp.bh;bf.style.height=pp.bh;bc.style.height=pp.bh}}catch(_){ }delete c.dataset.saPrevPos}}c.style.maxHeight=min?"42px":"min(300px,42vh)";b.style.display=min||activeTab!=="combat"?"none":"flex";bf.style.display=min||activeTab!=="flight"?"none":"flex";bc.style.display=min||activeTab!=="comms"?"none":"flex";try{var mb=tabs.querySelector("#sa-cl-min");mb.textContent=min?"+":"−";mb.title=min?"Restore":"Minimize"}catch(_){}};tabs.querySelector("#sa-cl-min").onclick=function(e){e.stopPropagation();setMin(!min)};c.querySelector("#sa-cl-menu").onclick=function(e){e.stopPropagation();pop.style.display=pop.style.display==="none"?"flex":"none"};tabs.addEventListener("click",function(e){if(min&&!(e.target&&e.target.closest&&e.target.closest("button"))){var de=parseInt(c.dataset.saDragEnd||"0",10);if(Date.now()-de<300)return;setMin(!1)}});(function(){var FK="saLogFont.v1";var px=10;try{var v=parseFloat(localStorage.getItem(FK));if(Number.isFinite(v))px=Math.max(9,Math.min(14,v))}catch(_){}function apply(){[b,bf,bc].forEach(function(x){x.style.fontSize=px+"px"})}apply();var fd=c.querySelector("#sa-cl-fd"),fi=c.querySelector("#sa-cl-fi");if(fd)fd.onclick=function(e){e.stopPropagation();px=Math.max(9,px-1);try{localStorage.setItem(FK,String(px))}catch(_){}apply()};if(fi)fi.onclick=function(e){e.stopPropagation();px=Math.min(14,px+1);try{localStorage.setItem(FK,String(px))}catch(_){}apply()}})();(()=>{const POS_KEY='saCombatLogPos.v1';let drag=!1,moved=!1,ox=0,oy=0,sx=0,sy=0;const clamp=()=>{const maxX=Math.max(8,(window.innerWidth||0)-c.offsetWidth-8);const maxY=Math.max(8,(window.innerHeight||0)-c.offsetHeight-8);const L=parseFloat(c.style.left),T=parseFloat(c.style.top);if(Number.isFinite(L))c.style.left=Math.min(maxX,Math.max(8,L))+'px';if(Number.isFinite(T))c.style.top=Math.min(maxY,Math.max(8,T))+'px'};const applyPos=(L,T)=>{c.style.right='auto';c.style.bottom='auto';c.style.left=L+'px';c.style.top=T+'px';clamp()};const savePos=()=>{try{localStorage.setItem(POS_KEY,JSON.stringify({left:parseFloat(c.style.left),top:parseFloat(c.style.top)}))}catch(_){}};const resetPos=()=>{c.style.left='16px';c.style.top='auto';c.style.right='auto';c.style.bottom='16px';try{localStorage.removeItem(POS_KEY)}catch(_){}};try{const raw=localStorage.getItem(POS_KEY);if(raw){const p=JSON.parse(raw);if(Number.isFinite(p.left)&&Number.isFinite(p.top))applyPos(p.left,p.top)}}catch(_){}const onDown=e=>{if(e.button!==0)return;if(e.target&&e.target.closest&&e.target.closest('button'))return;drag=!0;moved=!1;c.classList.add('sa-cl-dragging');const r=c.getBoundingClientRect();ox=e.clientX;oy=e.clientY;sx=r.left;sy=r.top;applyPos(sx,sy);try{tabs.setPointerCapture(e.pointerId)}catch(_){}e.preventDefault()};const onMove=e=>{if(!drag)return;const dx=e.clientX-ox,dy=e.clientY-oy;if(Math.abs(dx)>2||Math.abs(dy)>2)moved=!0;applyPos(sx+dx,sy+dy)};const onUp=()=>{if(!drag)return;drag=!1;c.classList.remove('sa-cl-dragging');if(moved){c.dataset.saDragEnd=String(Date.now());savePos()}};tabs.addEventListener('pointerdown',onDown);tabs.addEventListener('pointermove',onMove);tabs.addEventListener('pointerup',onUp);tabs.addEventListener('pointercancel',onUp);tabs.addEventListener('dblclick',e=>{if(e.target&&e.target.closest&&e.target.closest('button'))return;resetPos()});window.addEventListener('resize',()=>{if(c.style.top&&c.style.top!=='auto')clamp()});})();const paint=(r,e)=>{const time=new Date().toLocaleTimeString("en-US",{hour12:!1});let icon="🎯",color="#f87171",msg="";const dmg=Number(e.damage||0);const kind=e.damageKind||"HP";if(e.type==="PENDING"){icon="⏳";color="#ffbe4d";msg=e.kind==="STARBASE"?\`<span style="color:#ffbe4d;font-weight:bold;">RESOLVING</span> <b style="color:#fff">\${saEsc(e.target||"?")}</b> starbase…\`:\`<span style="color:#ffbe4d;font-weight:bold;">RESOLVING</span> vs <b style="color:#fff">\${saEsc(e.target||"?")}</b>…\`}else if(e.type==="HIT"){icon="🎯";color="#f87171";msg=\`<span style="color:#ef4444;font-weight:bold;">HIT</span> vs <b style="color:#fff">\${saEsc(e.target||"?")}</b> <span style="color:#f87171;font-weight:bold;">-\${dmg.toLocaleString()} HP</span>\`}else if(e.type==="MISS"){icon="❌";color="#9ca3af";msg=\`<span style="color:#9ca3af;font-weight:bold;">MISS</span> vs <b style="color:#fff">\${saEsc(e.target||"?")}</b> (0 DMG)\`}else if(e.type==="CAPTURE"){icon="🏳️";color="#34d399";msg=\`<span style="color:#34d399;font-weight:bold;">CAPTURE</span> @ <b style="color:#fff">\${saEsc(e.target||"?")}</b>\${dmg>0?\` <span style="color:#f87171;font-weight:bold;">-\${dmg.toLocaleString()} HP</span>\`:\` <span style="color:#94a3b8;">(no HP dmg)</span>\`}\`}else if(e.type==="STARBASE"){icon="🏰";color=dmg>0?"#f87171":"#9ca3af";msg=\`<span style="color:\${color};font-weight:bold;">STARBASE</span> @ <b style="color:#fff">\${saEsc(e.target||"?")}</b> \${dmg>0?\`<span style="color:#f87171;font-weight:bold;">-\${dmg.toLocaleString()} HP</span>\`:"(0 DMG)"}\`}else if(e.type==="COUNTER"){icon="⚡";color="#fb923c";msg=\`<span style="color:#fb923c;font-weight:bold;">COUNTER</span> from <b style="color:#fff">\${saEsc(e.target||"?")}</b> <span style="color:#fb923c;font-weight:bold;">-\${dmg.toLocaleString()} \${kind}</span> on your fleet\`}else if(e.type==="FLEE"){icon="🏃";color="#fbbf24";msg=\`<span style="color:#fbbf24;font-weight:bold;">FLEE</span> <b style="color:#fff">\${saEsc(e.target||"?")}</b> warped away / exited sector!\`}else if(e.type==="CONTESTED"){icon="🛡️";color="#fbbf24";msg=\`<span style="color:#fbbf24;font-weight:bold;">CONTESTED</span> · <b style="color:#fff">\${saEsc(e.target||"?")}</b> starbase under protection/cooldown\`}else{msg=String(e.type||"EVENT")+" "+saEsc(e.target||"")}r.innerHTML=\`<span style="color:#64748b;">[\${time}]</span> \${icon} \${msg}\`;r.dataset.saTarget=String(e.target||"");r.dataset.saType=String(e.type||"");if(e.id)r.dataset.saId=String(e.id);if(e.type!=="PENDING")r.dataset.saDone="1"};const _logFn=function(e){try{let r=null;if(e.type!=="PENDING"&&e.type!=="COUNTER"){const rows=[...b.children];for(let i=rows.length-1;i>=0;i--){if(e.id&&rows[i].dataset.saId===String(e.id)){r=rows[i];break}if(!r&&rows[i].dataset.saType==="PENDING"&&rows[i].dataset.saTarget===String(e.target||"")&&!rows[i].dataset.saDone){r=rows[i];/* fallback: oldest-first would be better for multi; use first unmatched pending from start */} }if(!r){for(let i=0;i<rows.length;i++){if(rows[i].dataset.saType==="PENDING"&&rows[i].dataset.saTarget===String(e.target||"")&&!rows[i].dataset.saDone){r=rows[i];break}}} }if(!r){r=document.createElement("div");r.className="sa-cl-row";b.appendChild(r)}if(e.id)r.dataset.saId=String(e.id);if(e.type!=="PENDING")r.dataset.saDone="1";paint(r,e);b.scrollTop=b.scrollHeight;if(e.type==="PENDING")return;const dmg=Number(e.damage||0);const color=e.type==="COUNTER"?"#fb923c":e.type==="CAPTURE"?"#34d399":e.type==="FLEE"||e.type==="CONTESTED"?"#fbbf24":dmg>0?"#f87171":"#9ca3af";const kind=e.damageKind||"HP";const tgtTxt=e.type==="COUNTER"?\`COUNTER -\${dmg.toLocaleString()} \${kind}\`:(e.type==="CAPTURE"?(dmg>0?\`CAPTURE -\${dmg.toLocaleString()}\`:"CAPTURED!"):(dmg>0?\`-\${dmg.toLocaleString()} HP\`:(e.type==="FLEE"?"FLED!":e.type==="CONTESTED"?"CONTESTED":e.type==="HIT"?"HIT!":"MISS")));const srcTxt=e.type==="COUNTER"?"HIT YOU!":(e.type==="CAPTURE"?"YOURS!":(dmg>0?"HIT!":(e.type==="FLEE"?"FLED":e.type==="CONTESTED"?"!":"MISS")));const toClient=(wx,wy)=>{try{if(!Number.isFinite(wx)||!Number.isFinite(wy))return null;const canvas=document.querySelector("canvas");const rect=canvas&&canvas.getBoundingClientRect();if(!rect||rect.width<2||rect.height<2)return null;let sx=wx,sy=wy;const vp=window.__SA_MAP_VIEWPORT__;if(vp&&typeof vp.toScreen==="function"){try{const p=vp.toScreen(wx,wy);if(p&&Number.isFinite(p.x)&&Number.isFinite(p.y)){sx=p.x;sy=p.y}}catch(_){}}const app=window.__SA_PIXI_APP__;let scaleX=1,scaleY=1;if(app&&app.screen&&app.screen.width>0&&app.screen.height>0){scaleX=rect.width/app.screen.width;scaleY=rect.height/app.screen.height}else if(canvas.width>0&&canvas.height>0){scaleX=rect.width/canvas.width;scaleY=rect.height/canvas.height}const left=rect.left+sx*scaleX,top=rect.top+sy*scaleY;if(!Number.isFinite(left)||!Number.isFinite(top))return null;return{x:left,y:top}}catch{return null}};const spawnFloat=(pt,txt,col,scale)=>{if(!pt)return;const pop=document.createElement("div");pop.textContent=txt;pop.style.cssText=\`position:fixed;left:\${pt.x}px;top:\${pt.y-28}px;transform:translate(-50%,-50%) scale(\${scale||1});font-family:monospace;font-weight:900;font-size:\${scale>1?24:20}px;color:\${col};text-shadow:0 0 8px #000,2px 2px 0 #000;pointer-events:none;z-index:999999;animation:saFloatUp 1.4s cubic-bezier(0.2,0.8,0.2,1) forwards;\`;document.body.appendChild(pop);setTimeout(()=>pop.remove(),1400)};if(!document.getElementById("sa-c-style")){const s=document.createElement("style");s.id="sa-c-style";s.textContent="@keyframes saFloatUp{0%{opacity:0;transform:translate(-50%,0) scale(.6)}15%{opacity:1;transform:translate(-50%,-20px) scale(1.25)}70%{opacity:1;transform:translate(-50%,-45px) scale(1)}100%{opacity:0;transform:translate(-50%,-65px) scale(.8)}}";document.head.appendChild(s)}const tgt=toClient(e.x,e.y);const src=toClient(e.sx,e.sy);if(tgt||src){spawnFloat(tgt,tgtTxt,color,1.15);spawnFloat(src,srcTxt,e.type==="COUNTER"?"#fb923c":(color==="#f87171"?"#67e8f9":color),0.95)}else{const vw=window.innerWidth||0,vh=window.innerHeight||0;spawnFloat({x:vw/2,y:vh*.35},tgtTxt,color,1)}}catch(_err){console.warn("%c ⚔️ sa-ui-fixes %c ⚠️ combat log","background:#0a0f19;color:#00e5ff;border:1px solid #00e5ff55;padding:1px 6px;border-radius:3px;font-weight:700","color:#fbbf24;font-weight:600",_err)}};_logFn.showTab=showTab;_logFn._paintFlight=paintFlight;_logFn.setVisible=function(on){try{if(on)localStorage.removeItem("saHideCombatLog");else localStorage.setItem("saHideCombatLog","1")}catch(_){ }try{c.style.display=on?"":"none"}catch(_){ }return!!on};_logFn.isVisible=function(){try{return localStorage.getItem("saHideCombatLog")!=="1"}catch(_){return!0}};_logFn.hide=function(){return _logFn.setVisible(!1)};_logFn.show=function(){return _logFn.setVisible(!0)};try{if(!_logFn.isVisible())c.style.display="none"}catch(_){ }setInterval(function(){try{var ing=window.__SA_IN_GAME&&window.__SA_IN_GAME();var hide=localStorage.getItem("saHideCombatLog")==="1";c.style.display=(ing&&!hide)?"":"none"}catch(e){}},900);return _logFn})();
window.__SA_WRAP_CS=window.__SA_WRAP_CS||function(handler,meta){return function(fleet){try{const atk=meta?.attacker||meta?.coords?.attacker||null;const post=fleet?.data||fleet;const preHp=Number(atk?.hp??NaN),preSp=Number(atk?.sp??NaN);const postHp=Number(post?.hp??preHp),postSp=Number(post?.sp??preSp);const dmgHp=Number.isFinite(preHp)?Math.max(0,preHp-postHp):0;const dmgSp=Number.isFinite(preSp)?Math.max(0,preSp-postSp):0;if(dmgHp>0||dmgSp>0){const dmg=dmgHp>0?dmgHp:dmgSp;const kind=dmgHp>0?"HP":"SP";const tgt=meta?.target||"Enemy";const c=meta?.coords;window.__SA_LOG_COMBAT_EVENT?.({type:"COUNTER",target:tgt,damage:dmg,damageKind:kind,x:c?.source?.x,y:c?.source?.y,sx:c?.target?.x,sy:c?.target?.y});meta?.toast?.(\`⚡ COUNTER! \${tgt} hit your fleet for \${dmg.toLocaleString()} \${kind}\`,"warning",{presentation:"feed",title:\`Counterstrike — \${tgt}\`,targets:meta?.targets})}}catch(_e){console.warn("%c ⚔️ sa-ui-fixes %c ⚠️ counter wrap","background:#0a0f19;color:#00e5ff;border:1px solid #00e5ff55;padding:1px 6px;border-radius:3px;font-weight:700","color:#fbbf24;font-weight:600",_e)}return typeof handler==="function"?handler(fleet):void 0}};
window.__SA_RESOLVE_COMBAT=window.__SA_RESOLVE_COMBAT||(function(){const sleep=ms=>new Promise(r=>setTimeout(r,ms));let seq=0;const normOwner=o=>{if(o==null||o===void 0)return 0;if(typeof o==="object"){const k=o.__kind||o.kind||o.name;if(k!=null)return normOwner(k);if(o.__option==="None")return 0}const n=Number(o);if(Number.isFinite(n)&&String(o).trim()!==""&&Math.abs(n)<=10)return n|0;const s=String(o).toUpperCase();if(s==="MUD"||s==="1")return 1;if(s==="ONI"||s==="2")return 2;if(s==="USTUR"||s==="3")return 3;if(s==="UNALIGNED"||s==="NONE"||s==="NEUTRAL"||s==="0")return 0;return 0};const rec=e=>{try{window.__SA_COMBAT_RECORDER__?.push?.(e)}catch(_){}};return async function(o){const id=o.id||("r"+Date.now().toString(36)+"-"+(++seq));const log=window.__SA_LOG_COMBAT_EVENT;const base={id,kind:o.kind,target:o.target,x:o.x,y:o.y,sx:o.sx,sy:o.sy};try{const snapKey=String(o.target||"");const snap=window.__SA_PRE_COMBAT__&&(window.__SA_PRE_COMBAT__[snapKey]||(window.__SA_PRE_COMBAT__._last&&window.__SA_PRE_COMBAT__[window.__SA_PRE_COMBAT__._last]));let pre=Number(o.preHp);if(snap&&Number.isFinite(Number(snap.hp))&&Date.now()-Number(snap.t||0)<18e4){pre=Math.max(Number.isFinite(pre)?pre:0,Number(snap.hp))}if(!Number.isFinite(pre))pre=0;const preOwn=normOwner(o.preOwner!=null?o.preOwner:(typeof o.readOwner==="function"?o.readOwner():null));log?.({type:"PENDING",...base,damage:0,preHp:pre});rec({type:"PENDING",...base,preHp:pre,preOwn});let dmg=0,flee=!1,captured=!1;let peak=pre,trough=pre,saw=0;const steps=o.kind==="STARBASE"?[0,150,350,700,1200,2e3,3e3,4500,6e3,8e3,1e4,13e3,17e3,22e3,3e4]:[0,100,250,450,750,1200,1800,2600,4e3,6e3,1e4];let prev=0;for(const t of steps){if(t)await sleep(t-prev);prev=t;try{await o.refetch?.()}catch{}const post=Number(o.readHp?.()??NaN);if(Number.isFinite(post)){saw++;if(saw===1&&post>peak){peak=post;trough=post}if(post>peak)peak=post;if(post<trough)trough=post;dmg=Math.max(0,peak-trough);if(Number.isFinite(pre)&&pre>trough)dmg=Math.max(dmg,pre-trough)}if(o.kind==="STARBASE"&&typeof o.readOwner==="function"){const postOwn=normOwner(o.readOwner());if(postOwn!==preOwn&&postOwn>0)captured=!0}if(o.kind==="FLEET"){const st=o.readState?.();flee=st==="MoveWarp"||st==="MoveSubwarp";if(flee)break}if(dmg>0||captured)break}if(o.kind==="FLEET"){const type=flee?"FLEE":(dmg>0?"HIT":"MISS");log?.({type,...base,damage:dmg});rec({type,...base,damage:dmg,flee});const msg=flee?("🏃 FLEE! Target fleet "+o.target+" fled the area!"):(dmg>0?("🎯 HIT! Dealt "+dmg.toLocaleString()+" damage to "+o.target+"."):("❌ MISS! Attack against "+o.target+" missed."));o.toast?.(msg,flee?"info":(dmg>0?"success":"warning"),{presentation:"feed",title:flee?("Fled — "+o.target):(dmg>0?("Hit — "+o.target):("Miss — "+o.target)),targets:o.targets})}else if(captured){log?.({type:"CAPTURE",...base,damage:dmg});rec({type:"CAPTURE",...base,damage:dmg,preHp:pre});try{window.__SA_MAP_BUMP__?.bumpSystem?.({name:o.target,owner:typeof o.readOwner==="function"?o.readOwner():null})}catch(_){}const msg=dmg>0?("🏳️ CAPTURE! "+o.target+" taken ("+dmg.toLocaleString()+" HP)."):("🏳️ CAPTURE! "+o.target+" taken over (no HP dmg).");o.toast?.(msg,"success",{presentation:"feed",title:("Captured — "+o.target),targets:o.targets})}else{log?.({type:"STARBASE",...base,damage:dmg});rec({type:"STARBASE",...base,damage:dmg,preHp:pre,peak,trough,saw});const msg=dmg>0?("🎯 HIT! Dealt "+dmg.toLocaleString()+" damage to "+o.target+" starbase."):("❌ MISS! Attack on "+o.target+" starbase missed.");o.toast?.(msg,dmg>0?"success":"warning",{presentation:"feed",title:dmg>0?("Starbase Hit — "+o.target):("Starbase Miss — "+o.target),targets:o.targets})}try{if(window.__SA_PRE_COMBAT__&&snapKey)delete window.__SA_PRE_COMBAT__[snapKey]}catch(_){}}catch(_e){try{log?.({type:"STARBASE",...base,damage:0,error:String(_e?.message||_e)});rec({type:"ERROR",...base,error:String(_e?.message||_e)})}catch(_){}console.warn("%c ⚔️ sa-ui-fixes %c ⚠️ combat resolve","background:#0a0f19;color:#00e5ff;border:1px solid #00e5ff55;padding:1px 6px;border-radius:3px;font-weight:700","color:#fbbf24;font-weight:600",_e)}}})();
window.__SA_BUILDER_TIP=window.__SA_BUILDER_TIP||(function(){let el=null,hideT=0;const ensure=()=>{if(el&&el.isConnected)return el;el=document.createElement("div");el.id="sa-builder-tip";el.style.cssText="position:fixed;left:50%;bottom:28px;transform:translateX(-50%);z-index:1000000;max-width:min(520px,92vw);padding:10px 14px;border-radius:8px;background:rgba(15,23,42,.94);border:1px solid rgba(251,191,36,.55);color:#fde68a;font:600 13px/1.35 ui-monospace,Menlo,monospace;box-shadow:0 10px 40px rgba(0,0,0,.55);pointer-events:none;opacity:0;transition:opacity .15s ease";document.body?document.body.appendChild(el):setTimeout(ensure,50);return el};return function(msg){const n=ensure();n.textContent="🏗️ "+String(msg||"");n.style.opacity="1";clearTimeout(hideT);hideT=setTimeout(()=>{n.style.opacity="0"},4200);try{console.log("%c ⚔️ sa-ui-fixes %c 🏗️ "+msg,"background:#0a0f19;color:#00e5ff;border:1px solid #00e5ff55;padding:1px 6px;border-radius:3px;font-weight:700","color:#fbbf24;font-weight:600")}catch(_){}}})();

window.__SA_MOD_SKIP__=window.__SA_MOD_SKIP__||!1;(function(){function set(e){try{window.__SA_MOD_SKIP__=!!(e.shiftKey||e.metaKey)}catch(_){}}function clear(e){try{if(e.key==="Shift"||e.key==="Meta"||e.type==="blur")window.__SA_MOD_SKIP__=!1;else window.__SA_MOD_SKIP__=!!(e.shiftKey||e.metaKey)}catch(_){}}window.addEventListener("keydown",set,!0);window.addEventListener("keyup",clear,!0);window.addEventListener("blur",function(){window.__SA_MOD_SKIP__=!1},!0);window.addEventListener("pointerdown",set,!0)})();
window.__SA_CONFIRM_FLY__=window.__SA_CONFIRM_FLY__||function(opts){return new Promise(function(resolve){try{var prev=document.getElementById("sa-fly-modal");if(prev)prev.remove();saEnsureModalCss();var mode=String(opts&&opts.mode||"subwarp"),label=String(opts&&opts.label||"destination"),fleet=String(opts&&opts.fleet||"Fleet");var warp=mode==="warp";var modeWord=warp?"Warp":"Subwarp";var esc=saEsc;var wrap=document.createElement("div");wrap.id="sa-fly-modal";wrap.className="sa-mf-wrap";wrap.style.zIndex="1000002";wrap.dataset.saOverlay="fly-modal";saIsolate(wrap);wrap.setAttribute("data-fc-floating-utility","true");var frame=document.createElement("div");frame.className="sa-mf-frame";var card=document.createElement("div");card.className="sa-mf-card";card.innerHTML='<div class="sa-mf-head"><span class="ico">'+(warp?'<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 4 L20 12 L16 10 L12 12 Z"/><path d="M8 16 L16 14 L24 16 L16 28 Z"/></svg>':'<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M6 16 H22"/><path d="M18 10 L26 16 L18 22"/></svg>')+'</span><div><div class="t">Movement order</div><div class="s">'+esc(fleet)+'</div></div><span class="mode '+(warp?"w":"s")+'">'+modeWord.toUpperCase()+'</span></div><div class="sa-mf-body"><div class="sa-mf-line">Fly '+modeWord+' to</div><div class="sa-mf-dest">'+esc(label)+'</div><div class="sa-mf-hint"><b>Shift+click</b> map skips · <b>Enter</b> confirm · <b>Esc</b> cancel</div></div><div class="sa-mf-foot"><button type="button" class="sa-mf-btn dim" data-a="no">Cancel</button><button type="button" class="sa-mf-btn gold" data-a="yes">Start '+modeWord+'</button></div>';function done(v){try{wrap.remove()}catch(_e){}resolve(!!v)}card.querySelector('[data-a="no"]').onclick=function(){done(false)};card.querySelector('[data-a="yes"]').onclick=function(){done(true)};wrap.onclick=function(e){if(e.target===wrap)done(false)};wrap.addEventListener("keydown",function(e){if(e.key==="Escape")done(false);if(e.key==="Enter")done(true)});frame.appendChild(card);wrap.appendChild(frame);document.body.appendChild(wrap);try{card.querySelector('[data-a="yes"]').focus()}catch(_e){}}catch(_e){resolve(true)}})};

window.__SA_HOTKEYS__=window.__SA_HOTKEYS__||(function(){var KEY="saFleetHotkeys.v1";var DEF={subwarp:"Space",warp:"Shift+Space",attack:"A",scan:"C",stop:"X",groups:"G"};var map=Object.assign({},DEF);var capturing=null;try{var raw=localStorage.getItem(KEY);if(raw)map=Object.assign({},DEF,JSON.parse(raw))}catch(_e){}function save(){try{localStorage.setItem(KEY,JSON.stringify(map))}catch(_e){}}function norm(e){var p=[];if(e.ctrlKey)p.push("Ctrl");if(e.altKey)p.push("Alt");if(e.metaKey)p.push("Meta");if(e.shiftKey&&e.code!=="Space")p.push("Shift");var k=e.code==="Space"?"Space":(e.key&&e.key.length===1?e.key.toUpperCase():(e.key||""));if(k===" ")k="Space";if(k==="Shift"||k==="Control"||k==="Alt"||k==="Meta")return null;p.push(k);return p.join("+")}function match(e,spec){if(!spec)return false;if(spec==="Space"&&(e.code==="Space"||e.key===" ")&&!e.shiftKey&&!e.ctrlKey&&!e.altKey&&!e.metaKey)return true;if(spec==="Shift+Space"&&(e.code==="Space"||e.key===" ")&&e.shiftKey)return true;var n=norm(e);return n&&n.toLowerCase()===String(spec).toLowerCase()}return{get:function(){return Object.assign({},map)},bind:function(a,s){map[a]=s;save()},match:match,norm:norm,isCapture:function(){return!!capturing},setCapture:function(a){capturing=a},DEF:DEF}})();

window.__SA_FLEET_GROUPS__=window.__SA_FLEET_GROUPS__||(function(){
  var KEY="saFleetGroups.v1";
  var state={groups:[{id:"g-alpha",name:"Alpha Wing",fleetKeys:[]},{id:"g-beta",name:"Beta Wing",fleetKeys:[]}],ungrouped:[],labels:{},selectedKey:null};
  try{
    var raw=localStorage.getItem(KEY);
    if(raw){
      var p=JSON.parse(raw);
      if(Array.isArray(p.groups)&&p.groups.length){
        state.groups=p.groups.map(function(g){
          return{
            id:String(g.id||("g-"+Math.random().toString(36).slice(2,9))),
            name:String(g.name||"Wing"),
            fleetKeys:(g.fleetKeys||[]).map(String),
            temporary:!!g.temporary
          };
        });
      }
      if(p.labels&&typeof p.labels==="object")state.labels=p.labels;
    }
  }catch(_e){}
  function save(){
    try{
      var durable=state.groups.filter(function(g){return !g.temporary&&g.id!=="g-temp-0"});
      var payload={
        v:2,
        groups:durable.map(function(g){
          return{id:g.id,name:g.name,fleetKeys:(g.fleetKeys||[]).map(String),temporary:!1};
        }),
        labels:state.labels||{}
      };
      localStorage.setItem(KEY,JSON.stringify(payload));
    }catch(_e){}
  }
  function uid(){return"g-"+Math.random().toString(36).slice(2,9)}
  function listOwnedFromGame(){
    var out=[],seen={};
    try{
      var peek=window.__SA_PEEK_FLEETS__;
      var all=typeof peek==="function"?peek():[];
      if(!all||!all.length)return out;
      var profile=window.__SA_PLAYER_PROFILE__;
      // bootstrap profile from any selected fleet owner if missing
      if(!profile){
        try{var sel=window.__SA_SELECTED_FLEET__;if(sel&&sel.key){for(var i=0;i<all.length;i++){if(String(all[i].address)===String(sel.key)&&all[i].data&&all[i].data.ownerProfile){profile=all[i].data.ownerProfile;window.__SA_PLAYER_PROFILE__=profile;break}}}}catch(_e2){}
      }
      for(var j=0;j<all.length;j++){
        var f=all[j];if(!f)continue;
        var addr=String(f.address||f.key||"");
        if(!addr||seen[addr])continue;
        var owner=f.data&&f.data.ownerProfile;
        if(profile&&owner&&String(owner)!==String(profile))continue;
        if(!profile)continue; // wait until we know owner
        seen[addr]=1;
        var label=(f.data&&f.data.fleetLabel)||("Fleet "+addr.slice(0,8)+"…");
        out.push({key:addr,label:String(label),state:f.data&&f.data.state&&f.data.state.__kind});
      }
    }catch(_e3){}
    return out;
  }
  function syncOwned(){
    var owned=listOwnedFromGame();
    var sel=null;
    try{sel=window.__SA_SELECTED_FLEET__&&window.__SA_SELECTED_FLEET__.key?String(window.__SA_SELECTED_FLEET__.key):null}catch(_e){}
    state.selectedKey=sel;
    var ownedMap={};
    owned.forEach(function(f){ownedMap[f.key]=f;state.labels[f.key]=f.label});
    // CRITICAL: do not prune/save when fleets are not loaded yet — that wiped wing membership on every refresh.
    var ready=owned.length>0;
    if(ready){
      // prune only fleets we can prove are gone / not ours
      state.groups.forEach(function(g){g.fleetKeys=g.fleetKeys.filter(function(k){return!!ownedMap[k]})});
      // drop empty temporary marquee wing if present
      state.groups=state.groups.filter(function(g){return !(g&&g.temporary&&(!g.fleetKeys||!g.fleetKeys.length))});
    }
    // rebuild ungrouped from known owned (may be empty until ready)
    var assigned={};
    state.groups.forEach(function(g){(g.fleetKeys||[]).forEach(function(k){assigned[k]=1})});
    state.ungrouped=[];
    owned.forEach(function(f){
      if(!assigned[f.key])state.ungrouped.push({key:f.key,label:f.label});
    });
    state.ungrouped.sort(function(a,b){
      if(a.key===state.selectedKey)return -1;
      if(b.key===state.selectedKey)return 1;
      return String(a.label||"").localeCompare(String(b.label||""));
    });
    state.groups.forEach(function(g){
      g.fleetKeys.sort(function(a,b){
        if(a===state.selectedKey)return -1;
        if(b===state.selectedKey)return 1;
        return String(state.labels[a]||a).localeCompare(String(state.labels[b]||b));
      });
    });
    // Only persist when we have a live owned set (or explicit structural edit via save())
    if(ready)save();
    return {owned:owned,selectedKey:state.selectedKey,ready:ready};
  }
  return{
    get:function(){syncOwned();return JSON.parse(JSON.stringify({groups:state.groups,ungrouped:state.ungrouped,labels:state.labels,selectedKey:state.selectedKey}))},
    syncOwned:syncOwned,
    listOwned:listOwnedFromGame,
    addGroup:function(name){state.groups.push({id:uid(),name:name||("Wing "+(state.groups.length+1)),fleetKeys:[]});save()},
    renameGroup:function(id,name){var g=state.groups.find(function(x){return x.id===id});if(g){g.name=name;save()}},
    removeGroup:function(id){var g=state.groups.find(function(x){return x.id===id});if(!g)return;g.fleetKeys.forEach(function(k){if(!state.ungrouped.some(function(f){return f.key===k}))state.ungrouped.push({key:k,label:state.labels[k]||k.slice(0,10)})});state.groups=state.groups.filter(function(x){return x.id!==id});save()},
    moveFleet:function(key,toGroupId){
      state.groups.forEach(function(g){g.fleetKeys=g.fleetKeys.filter(function(k){return k!==key})});
      state.ungrouped=state.ungrouped.filter(function(f){return f.key!==key});
      if(toGroupId==="ungrouped")state.ungrouped.push({key:key,label:state.labels[key]||String(key).slice(0,10)});
      else{var g=state.groups.find(function(x){return x.id===toGroupId});if(g&&g.fleetKeys.indexOf(key)<0)g.fleetKeys.push(key)}
      save();
    },
    ensureFleet:function(){syncOwned()},
    persist:function(){save()},
    storageKey:KEY,
    TEMP_ID:"g-temp-0",
    getTempGroup:function(){
      syncOwned();
      var g=state.groups.find(function(x){return x.id==="g-temp-0"||x.temporary});
      return g?JSON.parse(JSON.stringify(g)):{id:"g-temp-0",name:"Marquee",fleetKeys:[],temporary:!0};
    },
    setTempFleets:function(keys,labels){
      keys=(keys||[]).map(String);
      var uniq=[],seen={};
      keys.forEach(function(k){if(k&&!seen[k]){seen[k]=1;uniq.push(k)}});
      // keep durable wings intact — marquee is a temporary overlay selection only
      var tg=state.groups.find(function(x){return x.id==="g-temp-0"||x.temporary});
      if(!tg){
        tg={id:"g-temp-0",name:"Marquee",fleetKeys:[],temporary:!0};
        state.groups.unshift(tg);
      }
      tg.id="g-temp-0";
      tg.name="Marquee";
      tg.temporary=!0;
      tg.fleetKeys=uniq;
      if(labels&&typeof labels==="object"){
        Object.keys(labels).forEach(function(k){state.labels[k]=labels[k]});
      }
      // do not persist temporary membership into durable wings wipe — save permanent only
      try{
        var durable=state.groups.filter(function(g){return !g.temporary});
        var payload={v:2,groups:durable.map(function(g){return{id:g.id,name:g.name,fleetKeys:(g.fleetKeys||[]).map(String),temporary:!1}}),labels:state.labels||{}};
        // keep temp only in memory; durable wings still saved
        localStorage.setItem(KEY,JSON.stringify(payload));
      }catch(_e){}
      return JSON.parse(JSON.stringify(tg));
    },
    clearTemp:function(){
      state.groups=state.groups.filter(function(g){return !(g&&(g.id==="g-temp-0"||g.temporary))});
      save();
    },
    /** groups for chips 1–N (excludes temporary marquee) */
    getDurableGroups:function(){
      syncOwned();
      return state.groups.filter(function(g){return !g.temporary&&g.id!=="g-temp-0"}).map(function(g){return JSON.parse(JSON.stringify(g))});
    }
  };
})();


window.__SA_FLIGHT_LOG__=window.__SA_FLIGHT_LOG__||(function(){
  var KEY="saFlightLog.v1",events=[];
  try{var raw=localStorage.getItem(KEY);if(raw)events=JSON.parse(raw)||[]}catch(e){}
  function push(e){try{events.push(Object.assign({at:Date.now()},e));if(events.length>200)events=events.slice(-200);localStorage.setItem(KEY,JSON.stringify(events));window.__SA_LOG_COMBAT_EVENT&&window.__SA_LOG_COMBAT_EVENT._paintFlight&&window.__SA_LOG_COMBAT_EVENT._paintFlight()}catch(e){}}
  function dump(){try{console.table(events.slice(-50))}catch(e){}return events.slice()}
  function clear(){events=[];try{localStorage.removeItem(KEY)}catch(e){}window.__SA_LOG_COMBAT_EVENT&&window.__SA_LOG_COMBAT_EVENT._paintFlight&&window.__SA_LOG_COMBAT_EVENT._paintFlight()}
  function get(){return events.slice()}
  return{push:push,dump:dump,clear:clear,get:get};
})();

window.__SA_WING_CONFIRM__=window.__SA_WING_CONFIRM__||function(opts){
  try{
    var wing=opts&&opts.wing||{}, dest=opts&&opts.dest||{}, keys=(wing.keys||[]).map(String);
    var name=wing.name||"Wing", mode=wing.mode||"subwarp";
    var labels={}; try{var fg=window.__SA_FLEET_GROUPS__.get();labels=fg.labels||{}}catch(e){}
    function classify(key){
      var label=labels[key]||(key.slice(0,8)+"…"), reason="";
      try{
        var all=typeof window.__SA_PEEK_FLEETS__==="function"?window.__SA_PEEK_FLEETS__():[];
        var f=null; for(var i=0;i<all.length;i++){if(String(all[i].address||all[i].key)===key){f=all[i];break}}
        if(!f||!f.exists&&f.exists!==void 0&&!f.data){return{key:key,label:label,ok:!1,reason:"Fleet not found"}}
        var d=f.data||f, st=(d.state&&(d.state.__kind||d.state.kind))||d.effectiveState||"?";
        label=d.fleetLabel||label;
        if(st==="Destroyed"||Number(d.hp)===0)return{key:key,label:label,ok:!1,reason:"Destroyed"};
        if(st==="StarbaseLoadingBay"||st==="MineAsteroid"||/Dock/i.test(String(st)))return{key:key,label:label,ok:!1,reason:"Must be Idle (currently "+st+")"};
        if(st==="MoveWarp"||st==="MoveSubwarp")return{key:key,label:label,ok:!1,reason:"Already moving ("+st+")"};
        if(st!=="Idle"&&st!=="?"&&st!=="Unknown")return{key:key,label:label,ok:!1,reason:"Must be Idle (currently "+st+")"};
        return{key:key,label:label,ok:!0,reason:""};
      }catch(e){return{key:key,label:label,ok:!0,reason:""}}
    }
    var rows=keys.map(classify), ready=rows.filter(function(r){return r.ok}), blocked=rows.filter(function(r){return !r.ok});
    var destLabel=dest.label||(Number.isFinite(Number(dest.x))?("("+Number(dest.x).toFixed(2)+", "+Number(dest.y).toFixed(2)+")"):"destination");
    var prev=document.getElementById("sa-wing-confirm"); if(prev)prev.remove();
    var wrap=document.createElement("div"); wrap.id="sa-wing-confirm";
    wrap.className="sa-mf-wrap"; wrap.style.zIndex="1000005"; wrap.dataset.saOverlay="wing-confirm"; saIsolate(wrap); wrap.setAttribute("data-fc-floating-utility","true"); saEnsureModalCss();
    var frame=document.createElement("div"); frame.className="sa-mf-frame";
    var card=document.createElement("div"); card.className="sa-mf-card";
    var readyHtml=ready.map(function(r){return '<div style="padding:4px 0;color:#c8f0c8;font-size:11px;letter-spacing:.04em">✓ '+String(r.label).replace(/[<>&]/g,"")+'</div>'}).join("")||'<div style="color:#888;font-size:11px">None</div>';
    var blockedHtml=blocked.map(function(r){return '<div style="padding:4px 0;color:#f0c8a0;font-size:11px;letter-spacing:.04em">✗ <b style="color:#fff">'+String(r.label).replace(/[<>&]/g,"")+'</b> — '+String(r.reason).replace(/[<>&]/g,"")+'</div>'}).join("")||'<div style="color:#888;font-size:11px">None</div>';
    card.innerHTML='<div class="sa-mf-head"><span class="ico"><svg viewBox="0 0 32 32" aria-hidden="true"><path d="M6 16 H22"/><path d="M18 10 L26 16 L18 22"/></svg></span><div><div class="t">'+String(mode).toUpperCase()+' · '+String(name).replace(/[<>&]/g,"")+'</div><div class="s">→ '+String(destLabel).replace(/[<>&]/g,"")+'</div></div><span class="mode '+(mode==="warp"?"w":"s")+'">'+String(mode).toUpperCase()+'</span></div><div style="padding:12px 14px;max-height:40vh;overflow:auto"><div style="font-size:9px;letter-spacing:.12em;color:#9a8;margin-bottom:6px">READY ('+ready.length+')</div>'+readyHtml+'<div style="font-size:9px;letter-spacing:.12em;color:#9a8;margin:12px 0 6px">BLOCKED ('+blocked.length+') · stock preflight may skip more</div>'+blockedHtml+'</div><div class="sa-mf-foot"><button type="button" class="sa-mf-btn dim" data-a="no">Cancel</button><button type="button" class="sa-mf-btn gold" data-a="yes"'+(ready.length?"":" disabled")+'>Go ready ('+ready.length+')</button></div>';
    function done(go){
      try{wrap.remove()}catch(e){}
      try{document.body.classList.remove("sa-wing-order")}catch(e){}
      if(!go){
        try{window.__SA_WING_ORDER__&& (window.__SA_WING_ORDER__.pending=!1)}catch(e){}
        try{var p=window.__SA_PLANNER__;if(p&&p.dispatch)p.dispatch({type:"close"})}catch(e){}
        try{window.__SA_WING_PICK__&&window.__SA_WING_PICK__.stop()}catch(e){}
        try{window.__SA_FLIGHT_LOG__.push({type:"CANCEL",wing:name,msg:"Order cancelled"})}catch(e){}
        return;
      }
      try{window.__SA_FLIGHT_LOG__.push({type:"ORDER",wing:name,count:ready.length,dest:destLabel,mode:mode,msg:"Go ready "+ready.length+" / skip "+blocked.length+" → "+destLabel})}catch(e){}
      var readyKeys=ready.map(function(r){return r.key});
      var destObj={x:Number(dest.x),y:Number(dest.y),label:destLabel,systemId:dest.systemId};
      var submitted=!1;
      try{
        var p2=window.__SA_PLANNER__;
        // Prime stock batch headless (active:false → no left pane)
        if(p2&&typeof p2.primeBatch==="function")p2.primeBatch(readyKeys,mode,destObj);
        else if(p2&&typeof p2.set==="function")p2.set({active:!1,destination:destObj,mapTargeting:!1,mode:mode,origin:"fleet",searchQuery:"",selectedFleetKeys:readyKeys});
        if(p2&&typeof p2.submit==="function"){p2.submit();submitted=!0}
        else if(typeof p2.submit!=="function"){
          // force first bind: call if assigned later
          try{if(p2&&p2.submit){p2.submit();submitted=!0}}catch(e2){}
        }
      }catch(e){try{window.__SA_FLIGHT_LOG__.push({type:"ERROR",msg:String(e&&e.message||e)})}catch(e3){}}
      // Never fall back to clicking "Issue Movement Orders" (opens huge planner UI)
      try{window.__SA_WING_ORDER__&& (window.__SA_WING_ORDER__.pending=!1)}catch(e){}
      try{window.__SA_WING_PICK__&&window.__SA_WING_PICK__.stop()}catch(e){}
      try{window.__SA_FLIGHT_LOG__.push({type:"SUBMIT",wing:name,count:ready.length,dest:destLabel,msg:submitted?"Stock batch (headless preflight)":"Submit not ready — wait for map boot, retry"})}catch(e){}
      try{window.__SA_ACTION_BAR__&&window.__SA_ACTION_BAR__.paint&&window.__SA_ACTION_BAR__.paint()}catch(e){}
    }
    card.querySelector('[data-a="no"]').onclick=function(){done(!1)};
    var yes=card.querySelector('[data-a="yes"]'); if(yes)yes.onclick=function(){done(!0)};
    wrap.onclick=function(e){if(e.target===wrap)done(!1)};
    if(opts&&opts.skip){
      // headless: no modal chrome
      if(ready.length)done(!0); else done(!1);
      return;
    }
    frame.appendChild(card); wrap.appendChild(frame); document.body.appendChild(wrap);
  }catch(e){console.warn("sa wing confirm",e)}
};

window.__SA_WING_PICK__=window.__SA_WING_PICK__||(function(){
  var state={active:!1,wingId:null,wingIds:[],mode:"subwarp",keys:[],name:""};
  var mapListening=!1;
  function logFlight(e){try{window.__SA_FLIGHT_LOG__.push(e)}catch(err){}}
  function stop(){
    state.active=!1;state.wingId=null;state.wingIds=[];state.keys=[];state.name="";
    try{if(window.__SA_WING_ORDER__)window.__SA_WING_ORDER__.pending=!1}catch(e){}
    try{document.body.classList.remove("sa-wing-order")}catch(e){}
    try{var t=document.getElementById("sa-wing-pick-tip");if(t)t.remove()}catch(e){}
    document.removeEventListener("keydown",onKey,true);
    unlistenMap();
  }
  function unlistenMap(){
    if(!mapListening)return;
    mapListening=!1;
    window.removeEventListener("pointerdown",onMapDown,true);
  }
  function listenMap(){
    if(mapListening)return;
    mapListening=!0;
    window.addEventListener("pointerdown",onMapDown,true);
  }
  function onKey(e){
    if(e.key==="Escape"){
      e.preventDefault();
      stop();
      try{var c=document.getElementById("sa-wing-confirm");if(c)c.remove()}catch(err){}
      logFlight({type:"CANCEL",msg:"Wing pick cancelled"});
      try{window.__SA_ACTION_BAR__&&window.__SA_ACTION_BAR__.paint&&window.__SA_ACTION_BAR__.paint()}catch(err){}
    }
  }
  function uiBlock(el){
    if(!el||!el.closest)return!1;
    return!!el.closest("#sa-action-bar,#sa-combat-log-box,#sa-groups-board,#sa-fly-modal,#sa-wing-confirm,input,textarea,select,button,[contenteditable=true]");
  }
  function clientToGame(clientX,clientY){
    try{
      var vp=window.__SA_MAP_VIEWPORT__,app=window.__SA_PIXI_APP__,canvas=document.querySelector("canvas");
      if(!vp||!canvas)return null;
      var rect=canvas.getBoundingClientRect();
      if(rect.width<2)return null;
      var sw=app&&app.screen&&app.screen.width?app.screen.width:rect.width;
      var sh=app&&app.screen&&app.screen.height?app.screen.height:rect.height;
      var sx=(clientX-rect.left)*(sw/rect.width),sy=(clientY-rect.top)*(sh/rect.height);
      var world=null;
      if(typeof vp.toWorld==="function"){try{world=vp.toWorld(sx,sy)}catch(e){}}
      if(!world||!Number.isFinite(world.x))world={x:sx,y:sy};
      var math=window.__SA_MAP_MATH__;
      if(math&&math.pixelPointToGamePoint&&math.MAP_CONFIG){
        return math.pixelPointToGamePoint({x:world.x,y:world.y},math.MAP_CONFIG.WORLD_GRID_SIZE,math.MAP_CONFIG.TILE_SIZE);
      }
      var TILE=80,GRID=101,SQUASH=.7,at=Math.floor(GRID/2);
      return{x:world.x/TILE-at,y:at-world.y/SQUASH/TILE};
    }catch(e){return null}
  }
  function onMapDown(e){
    if(!state.active)return;
    if(e.button!==0)return;
    // Shift+click skips confirm (marquee yields while wing pick is active)
    var skipConfirm=!!(e.shiftKey||e.metaKey||window.__SA_MOD_SKIP__);
    if(uiBlock(e.target))return;
    var canvas=document.querySelector("canvas");
    if(!canvas)return;
    var r=canvas.getBoundingClientRect();
    if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)return;
    e.preventDefault();
    e.stopPropagation();
    var g=clientToGame(e.clientX,e.clientY);
    if(!g||!Number.isFinite(g.x)||!Number.isFinite(g.y)){
      logFlight({type:"ERROR",msg:"Could not read map coordinates"});
      return;
    }
    var dest={x:g.x,y:g.y,label:"("+g.x.toFixed(2)+", "+g.y.toFixed(2)+")"};
    var order={
      pending:!0,
      wingId:state.wingId,
      wingIds:(state.wingIds||[]).slice(),
      name:state.name,
      keys:state.keys.slice(),
      mode:state.mode
    };
    // Keep pick mode for cancel UI, but hand off to compact confirm (no planner pane)
    unlistenMap();
    try{var tip=document.getElementById("sa-wing-pick-tip");if(tip)tip.remove()}catch(err){}
    // Prime stock batch state WITHOUT opening planner UI (active:false)
    try{
      var p=window.__SA_PLANNER__;
      if(p&&typeof p.primeBatch==="function"){
        p.primeBatch(order.keys,order.mode,dest);
      }else if(p&&typeof p.set==="function"){
        p.set({active:!1,destination:dest,mapTargeting:!1,mode:order.mode,origin:"fleet",searchQuery:"",selectedFleetKeys:order.keys.slice()});
      }
    }catch(err){}
    window.__SA_WING_ORDER__=order;
    if(window.__SA_WING_CONFIRM__)window.__SA_WING_CONFIRM__({wing:order,dest:dest,skip:skipConfirm});
    else logFlight({type:"ERROR",msg:"Confirm UI missing"});
    try{window.__SA_ACTION_BAR__&&window.__SA_ACTION_BAR__.paint&&window.__SA_ACTION_BAR__.paint()}catch(err){}
  }
  function start(wingIdOrIds,mode){
    var fg=window.__SA_FLEET_GROUPS__;
    var cur=fg.get();
    var ids=Array.isArray(wingIdOrIds)?wingIdOrIds.slice():[wingIdOrIds];
    ids=ids.filter(Boolean);
    var groups=[],keys=[],seen={},names=[];
    ids.forEach(function(wid){
      var g=(cur.groups||[]).find(function(x){return x.id===wid});
      // also allow temp id
      if(!g&&(wid==="g-temp-0"||wid==="temp")){
        try{g=fg.getTempGroup&&fg.getTempGroup()}catch(e){}
      }
      if(!g)return;
      groups.push(g);names.push(g.name||wid);
      (g.fleetKeys||[]).forEach(function(k){k=String(k);if(!seen[k]){seen[k]=1;keys.push(k)}});
    });
    if(!groups.length){logFlight({type:"ERROR",msg:"Unknown wing"});return}
    if(!keys.length){logFlight({type:"ERROR",wing:names.join("+"),msg:"No fleets in selected wing(s)"});return}
    var label=names.length>1?("Chain "+names.join(" + ")):(names[0]||"Wing");
    state.active=!0;state.wingId=ids[0];state.wingIds=ids.slice();state.mode=mode||"subwarp";
    state.keys=keys;state.name=label;
    window.__SA_WING_ORDER__={pending:!0,wingId:ids[0],wingIds:ids.slice(),name:label,keys:keys,mode:state.mode};
    document.addEventListener("keydown",onKey,true);
    try{document.body.classList.add("sa-wing-order")}catch(e){}
    // Do NOT open stock Movement Planner panel — compact map pick only
    listenMap();
    logFlight({type:"PICK",wing:label,count:keys.length,mode:state.mode,msg:keys.length+" fleets · click map · Shift+click skips confirm · Esc cancel"});
    try{
      var tip=document.getElementById("sa-wing-pick-tip");if(tip)tip.remove();
      tip=document.createElement("div");tip.id="sa-wing-pick-tip";
      tip.style.cssText="position:fixed;left:50%;bottom:100px;transform:translateX(-50%);z-index:999980;pointer-events:none;padding:8px 14px;border-radius:2px;border:1px solid rgba(255,190,77,.45);background:rgba(12,10,8,.92);color:#ffbe4d;font:700 10px Orbitron,sans-serif;letter-spacing:.12em;text-transform:uppercase";
      tip.textContent=(state.mode==="warp"?"WARP":"SWARP")+" · "+label+" · "+keys.length+" · CLICK MAP · SHIFT+CLICK SKIP · ESC";
      document.body.appendChild(tip);
    }catch(e){}
    try{window.__SA_ACTION_BAR__&&window.__SA_ACTION_BAR__.paint&&window.__SA_ACTION_BAR__.paint()}catch(e){}
  }
  return{
    start:start,
    stop:function(){stop();try{window.__SA_ACTION_BAR__&&window.__SA_ACTION_BAR__.paint&&window.__SA_ACTION_BAR__.paint()}catch(e){}},
    isActive:function(){return!!state.active||!!(window.__SA_WING_ORDER__&&window.__SA_WING_ORDER__.pending)},
    get:function(){return{active:state.active,wingId:state.wingId,wingIds:state.wingIds||[],mode:state.mode}}
  };
})();


window.__SA_FLEET_MARQUEE__=window.__SA_FLEET_MARQUEE__||(function(){
  var drag=null, box=null;
  function log(e){try{window.__SA_FLIGHT_LOG__.push(e)}catch(err){}}
  function ensureBox(){
    if(box&&box.isConnected)return box;
    box=document.createElement("div");
    box.id="sa-fleet-marquee";
    box.style.cssText="position:fixed;pointer-events:none;z-index:999970;border:1px solid rgba(255,190,77,.85);background:rgba(255,190,77,.12);box-shadow:0 0 0 1px rgba(0,0,0,.35),inset 0 0 12px rgba(255,190,77,.15);display:none";
    document.body.appendChild(box);
    return box;
  }
  function parseCoord(v){
    try{
      if(v==null)return NaN;
      if(typeof v==="number")return v;
      if(typeof v==="bigint")return Number(v);
      if(typeof v==="object"){
        if(typeof v.toNumber==="function")return v.toNumber();
        if(v.raw!==void 0){
          try{return Number(BigInt(v.raw))/Math.pow(2,56)}catch(e){return Number(v.raw)}
        }
      }
      return Number(v);
    }catch(e){return NaN}
  }
  function fleetGameXY(f){
    try{
      var d=f&&(f.data||f); if(!d)return null;
      // prefer explicit location
      var loc=d.location;
      if(loc&&(loc.length>=2||(loc[0]!=null&&loc[1]!=null))){
        var x=parseCoord(loc[0]), y=parseCoord(loc[1]);
        if(Number.isFinite(x)&&Number.isFinite(y)){
          // sanity: game AU are small; if huge, try scale
          if(Math.abs(x)>1e5||Math.abs(y)>1e5){x=x/1e9;y=y/1e9}
          return{x:x,y:y};
        }
      }
      // derived coords if present
      if(d.currentCoordinates&&d.currentCoordinates.length>=2){
        var cx=parseCoord(d.currentCoordinates[0]), cy=parseCoord(d.currentCoordinates[1]);
        if(Number.isFinite(cx)&&Number.isFinite(cy))return{x:cx,y:cy};
      }
    }catch(e){}
    return null;
  }
  function clientToGame(clientX,clientY){
    try{
      var vp=window.__SA_MAP_VIEWPORT__, app=window.__SA_PIXI_APP__, canvas=document.querySelector("canvas");
      if(!vp||!canvas)return null;
      var rect=canvas.getBoundingClientRect();
      if(rect.width<2||rect.height<2)return null;
      var sw=app&&app.screen&&app.screen.width?app.screen.width:rect.width;
      var sh=app&&app.screen&&app.screen.height?app.screen.height:rect.height;
      var sx=(clientX-rect.left)*(sw/rect.width), sy=(clientY-rect.top)*(sh/rect.height);
      var world=null;
      if(typeof vp.toWorld==="function"){try{world=vp.toWorld(sx,sy)}catch(e){}}
      if(!world||!Number.isFinite(world.x))world={x:sx,y:sy};
      var math=window.__SA_MAP_MATH__;
      if(math&&math.pixelPointToGamePoint&&math.MAP_CONFIG){
        return math.pixelPointToGamePoint({x:world.x,y:world.y},math.MAP_CONFIG.WORLD_GRID_SIZE,math.MAP_CONFIG.TILE_SIZE);
      }
      var TILE=80,GRID=101,SQUASH=.7,at=Math.floor(GRID/2);
      return{x:world.x/TILE-at,y:at-world.y/SQUASH/TILE};
    }catch(e){return null}
  }
  function uiTarget(el){
    if(!el||!el.closest)return!1;
    return!!el.closest("#sa-action-bar,#sa-combat-log-box,#sa-groups-board,#sa-fly-modal,#sa-wing-confirm,#sa-fleet-marquee,input,textarea,select,button,[contenteditable=true]");
  }
  function ownedFleets(){
    var out=[],seen={};
    try{
      var peek=window.__SA_PEEK_FLEETS__;
      var all=typeof peek==="function"?peek():[];
      var profile=window.__SA_PLAYER_PROFILE__;
      if(!profile){
        try{var sel=window.__SA_SELECTED_FLEET__;if(sel&&sel.key){for(var i=0;i<all.length;i++){if(String(all[i].address)===String(sel.key)&&all[i].data&&all[i].data.ownerProfile){profile=all[i].data.ownerProfile;window.__SA_PLAYER_PROFILE__=profile;break}}}}catch(e){}
      }
      for(var j=0;j<all.length;j++){
        var f=all[j]; if(!f)continue;
        var addr=String(f.address||f.key||"");
        if(!addr||seen[addr])continue;
        var owner=f.data&&f.data.ownerProfile;
        if(profile&&owner&&String(owner)!==String(profile))continue;
        if(!profile)continue;
        // ignore destroyed
        var st=f.data&&f.data.state&&(f.data.state.__kind||f.data.state.kind);
        if(st==="Destroyed")continue;
        seen[addr]=1;
        out.push(f);
      }
    }catch(e){}
    return out;
  }
  function fleetsInGameRect(g0,g1){
    var minX=Math.min(g0.x,g1.x), maxX=Math.max(g0.x,g1.x);
    var minY=Math.min(g0.y,g1.y), maxY=Math.max(g0.y,g1.y);
    // pad tiny drags
    if(maxX-minX<0.05){minX-=0.05;maxX+=0.05}
    if(maxY-minY<0.05){minY-=0.05;maxY+=0.05}
    var keys=[], labels={};
    ownedFleets().forEach(function(f){
      var xy=fleetGameXY(f);
      if(!xy)return;
      if(xy.x>=minX&&xy.x<=maxX&&xy.y>=minY&&xy.y<=maxY){
        var k=String(f.address||f.key);
        keys.push(k);
        labels[k]=(f.data&&f.data.fleetLabel)||k.slice(0,8);
      }
    });
    return{keys:keys,labels:labels};
  }
  function onDown(e){
    if(!e.shiftKey||e.button!==0)return;
    // Yield to warp/subwarp destination pick so Shift+click can skip confirm
    try{
      var mov=window.__SA_MOVEMENT__&&window.__SA_MOVEMENT__.getState&&window.__SA_MOVEMENT__.getState();
      if(mov&&mov.active)return;
      if(window.__SA_WING_PICK__&&window.__SA_WING_PICK__.isActive&&window.__SA_WING_PICK__.isActive())return;
    }catch(err){}
    if(uiTarget(e.target))return;
    // only start on map canvas area
    var canvas=document.querySelector("canvas");
    if(!canvas)return;
    var r=canvas.getBoundingClientRect();
    if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)return;
    drag={x0:e.clientX,y0:e.clientY,x1:e.clientX,y1:e.clientY};
    var el=ensureBox();
    el.style.display="block";
    el.style.left=drag.x0+"px"; el.style.top=drag.y0+"px";
    el.style.width="0px"; el.style.height="0px";
    e.preventDefault();
    e.stopPropagation();
  }
  function onMove(e){
    if(!drag)return;
    drag.x1=e.clientX; drag.y1=e.clientY;
    var el=ensureBox();
    var l=Math.min(drag.x0,drag.x1), t=Math.min(drag.y0,drag.y1);
    var w=Math.abs(drag.x1-drag.x0), h=Math.abs(drag.y1-drag.y0);
    el.style.left=l+"px"; el.style.top=t+"px";
    el.style.width=w+"px"; el.style.height=h+"px";
  }
  function onUp(e){
    if(!drag)return;
    var d=drag; drag=null;
    try{if(box)box.style.display="none"}catch(err){}
    var w=Math.abs(d.x1-d.x0), h=Math.abs(d.y1-d.y0);
    if(w<6&&h<6)return; // click, not drag
    var g0=clientToGame(d.x0,d.y0), g1=clientToGame(d.x1,d.y1);
    if(!g0||!g1){log({type:"ERROR",msg:"Marquee: could not read map coordinates"});return}
    var hit=fleetsInGameRect(g0,g1);
    if(!hit.keys.length){
      log({type:"WARN",msg:"Marquee: no owned fleets in box"});
      try{window.__SA_FLEET_GROUPS__.clearTemp()}catch(err){}
      try{window.__SA_ACTION_BAR__&&window.__SA_ACTION_BAR__.clearSelection&&window.__SA_ACTION_BAR__.clearSelection()}catch(err){}
      try{window.__SA_ACTION_BAR__&&window.__SA_ACTION_BAR__.paint&&window.__SA_ACTION_BAR__.paint()}catch(err){}
      return;
    }
    try{
      var tg=window.__SA_FLEET_GROUPS__.setTempFleets(hit.keys,hit.labels);
      log({type:"WING",msg:"Marquee [0] · "+hit.keys.length+" fleets",count:hit.keys.length});
      if(window.__SA_ACTION_BAR__&&window.__SA_ACTION_BAR__.selectWing){
        window.__SA_ACTION_BAR__.selectWing(tg.id,{ctrlKey:!1,metaKey:!1});
      }
      window.__SA_ACTION_BAR__&&window.__SA_ACTION_BAR__.paint&&window.__SA_ACTION_BAR__.paint();
    }catch(err){
      log({type:"ERROR",msg:"Marquee failed: "+(err&&err.message||err)});
    }
  }
  function boot(){
    if(!document.body){setTimeout(boot,300);return}
    window.addEventListener("pointerdown",onDown,true);
    window.addEventListener("pointermove",onMove,true);
    window.addEventListener("pointerup",onUp,true);
    window.addEventListener("pointercancel",function(){drag=null;try{if(box)box.style.display="none"}catch(e){}},true);
  }
  setTimeout(boot,1800);
  return{boot:boot};
})();


window.__SA_ACTION_BAR__=window.__SA_ACTION_BAR__||(function(){
  var root=null,captureAction=null,activeWingIds=[];
  var HIDE_KEY="saHideActionBar";
  function isBarVisible(){try{return localStorage.getItem(HIDE_KEY)!=="1"}catch(e){return!0}}
  function setBarVisible(on){try{if(on)localStorage.removeItem(HIDE_KEY);else localStorage.setItem(HIDE_KEY,"1")}catch(e){}try{if(root)root.style.display=on?"":"none"}catch(e){}if(on){try{paint()}catch(e){}}return isBarVisible()}

  function css(){
    var cssTxt=""
+"#sa-action-bar{position:fixed;left:50%;bottom:16px;transform:translateX(-50%);z-index:999990;display:flex;flex-direction:column;align-items:center;gap:6px;pointer-events:none;background:rgba(4,6,10,.62);border:1px solid rgba(255,190,77,.18);border-radius:6px;padding:6px 8px;box-shadow:0 12px 32px rgba(0,0,0,.55);"
+"font-family:var(--font-family-display,Orbitron,sans-serif)}"
+"#sa-action-bar.sa-bar-pos{left:auto;bottom:auto;transform:none}"
+"#sa-action-bar .sa-bar-grip{pointer-events:auto;display:flex;align-items:center;justify-content:space-between;gap:10px;min-width:220px;max-width:min(420px,92vw);padding:5px 10px;border-radius:2px;cursor:grab;user-select:none;touch-action:none;"
+"border:1px solid rgba(255,190,77,.4);background:linear-gradient(165deg,rgba(22,18,12,.97),rgba(10,12,16,.98));"
+"box-shadow:0 8px 24px rgba(0,0,0,.5),inset 0 1px rgba(255,255,255,.05);color:#ffbe4d}"
+"#sa-action-bar.sa-bar-dragging .sa-bar-grip{cursor:grabbing;opacity:.97;box-shadow:0 14px 36px rgba(0,0,0,.7),0 0 16px rgba(255,190,77,.12)}"
+"#sa-action-bar .sa-bar-grip .lab{font:800 9px Orbitron,sans-serif;letter-spacing:.1em;text-transform:uppercase;white-space:nowrap}"
+"#sa-action-bar .sa-bar-grip .hint{font:600 8px Orbitron,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:rgba(232,217,168,.5);white-space:nowrap}"
+"#sa-action-bar .sa-cancel-row{pointer-events:auto;display:none;align-items:center;justify-content:center;min-height:0;position:absolute;bottom:calc(100% + 6px);left:50%;transform:translateX(-50%);z-index:2}"
+"#sa-action-bar .sa-cancel-row.show{display:flex}"
+"#sa-action-bar .sa-cancel-btn{appearance:none;cursor:pointer;min-width:120px;padding:10px 18px;border-radius:2px;"
+"border:1px solid rgba(255,100,100,.55);background:linear-gradient(165deg,#5a2828,#3a1818);color:#fecaca;"
+"font:700 10px Orbitron,sans-serif;letter-spacing:.14em;text-transform:uppercase;"
+"box-shadow:inset 0 1px rgba(255,255,255,.08),0 4px 16px rgba(0,0,0,.4);transition:background .12s,border-color .12s,transform .1s}"
+"#sa-action-bar .sa-cancel-btn:hover{border-color:rgba(255,140,140,.8);background:linear-gradient(165deg,#6a3030,#4a2020);transform:translateY(-1px)}"
+"#sa-action-bar .sa-cancel-btn:active{transform:translateY(1px)}"
+"#sa-action-bar .sa-cancel-btn .hk{display:block;margin-top:4px;font-size:7px;opacity:.65;letter-spacing:.1em}"
+"#sa-action-bar .sa-row{pointer-events:auto;display:flex;align-items:center;justify-content:center;gap:6px;flex-wrap:wrap}"
+"#sa-action-bar .sa-chip{appearance:none;min-width:34px;height:32px;padding:2px 8px;border-radius:2px;cursor:pointer;"
+"border:1px solid rgba(255,190,77,.35);background:rgba(40,34,18,.75);color:#e8d9a8;"
+"display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0;transition:border-color .12s,background .12s,box-shadow .12s;"
+"--chip-accent:#ffbe4d}"
+"#sa-action-bar .sa-chip:hover{border-color:color-mix(in srgb,var(--chip-accent) 80%,white);background:color-mix(in srgb,var(--chip-accent) 18%,rgba(40,34,18,.85))}"
+"#sa-action-bar .sa-chip.on{border-color:var(--chip-accent);background:linear-gradient(180deg,color-mix(in srgb,var(--chip-accent) 35%,transparent),color-mix(in srgb,var(--chip-accent) 12%,transparent));"
+"box-shadow:0 0 12px color-mix(in srgb,var(--chip-accent) 35%,transparent);color:#fff8e8}"
+"#sa-action-bar .sa-chip.w0{--chip-accent:#ffbe4d}"
+"#sa-action-bar .sa-chip.w1{--chip-accent:#32feff;border-color:rgba(50,254,255,.35);background:rgba(12,28,32,.8)}"
+"#sa-action-bar .sa-chip.w2{--chip-accent:#34ff88;border-color:rgba(52,255,136,.35);background:rgba(12,28,18,.8)}"
+"#sa-action-bar .sa-chip.w3{--chip-accent:#a78bfa;border-color:rgba(167,139,250,.35);background:rgba(22,16,32,.8)}"
+"#sa-action-bar .sa-chip.w4{--chip-accent:#ff6b35;border-color:rgba(255,107,53,.35);background:rgba(32,16,12,.8)}"
+"#sa-action-bar .sa-chip.w5{--chip-accent:#60a5fa;border-color:rgba(96,165,250,.35);background:rgba(12,18,32,.8)}"
+"#sa-action-bar .sa-chip .n{font-size:12px;font-weight:800;letter-spacing:.04em;line-height:1}"
+"#sa-action-bar .sa-chip .c{font-size:8px;opacity:.7;letter-spacing:.06em}"
+"#sa-action-bar .sa-chip.empty{opacity:.35}"
+"#sa-action-bar .sa-chip.chain{position:relative}"
+"#sa-action-bar .sa-chip.chain:not(:last-of-type):after{content:'';position:absolute;right:-5px;top:50%;width:8px;height:2px;"
+"background:rgba(255,190,77,.85);box-shadow:0 0 6px rgba(255,190,77,.5);transform:translateY(-50%);z-index:2;pointer-events:none}"
+"#sa-action-bar .sa-chip.chain:not(:last-of-type):before{content:'';position:absolute;right:-7px;top:50%;width:6px;height:6px;border-radius:50%;"
+"border:1.5px solid rgba(255,190,77,.9);background:rgba(20,16,8,.95);transform:translateY(-50%);z-index:3;pointer-events:none}"
+"#sa-action-bar .sa-link-hint{font:600 8px Orbitron,sans-serif;letter-spacing:.08em;color:rgba(255,190,77,.55);text-transform:uppercase;margin-left:4px}"
+"#sa-action-bar .sa-chip-0{border-color:rgba(255,190,77,.5);background:rgba(50,40,12,.7)}"
+"#sa-action-bar .sa-chip-0.on{border-color:rgba(255,190,77,.95);box-shadow:0 0 12px rgba(255,190,77,.35)}"
+"#sa-action-bar .sa-x-spacer{display:inline-block;width:28px;height:1px;flex:0 0 28px;pointer-events:none}"
+"#sa-action-bar .sa-x{appearance:none;width:32px;height:32px;border-radius:2px;cursor:pointer;border:1px solid rgba(255,255,255,.2);"
+"background:rgba(20,20,24,.8);color:#ccc;font:800 14px Orbitron,sans-serif;line-height:1;margin-left:4px}"
+"#sa-action-bar .sa-x:hover{border-color:rgba(248,113,113,.5);color:#fca5a5}"
+"#sa-action-bar .sa-chip{position:relative}"
+"#sa-action-bar .sa-chip.on + .sa-chip.on::before{content:'';position:absolute;left:-6px;top:50%;width:6px;height:2px;margin-top:-1px;background:#ffbe4d;box-shadow:0 0 6px rgba(255,190,77,.7)}"
+"#sa-action-bar .sa-lamp-row{pointer-events:none;display:flex;align-items:center;justify-content:center;height:14px}"
+"#sa-action-bar .sa-lamp{display:none;align-items:center;gap:7px;pointer-events:auto;cursor:help}"
+"#sa-action-bar .sa-lamp .bulb{width:9px;height:9px;transform:rotate(45deg);background:#5a1414;border:1px solid rgba(255,80,80,.6);box-shadow:0 0 0 1px rgba(0,0,0,.6)}"
+"#sa-action-bar .sa-lamp .txt{font:800 8px Orbitron,sans-serif;letter-spacing:.16em;color:rgba(255,120,120,.9);text-transform:uppercase}"
+"#sa-action-bar .sa-lamp.out{display:flex;animation:saLampBlink .9s ease-in-out infinite}"
+"#sa-action-bar .sa-lamp.out .bulb{background:#ff2b2b;border-color:#ff9090;box-shadow:0 0 10px rgba(255,40,40,.95),0 0 22px rgba(255,40,40,.55)}"
+"#sa-action-bar .sa-lamp.out .txt{color:#ff6b6b;text-shadow:0 0 8px rgba(255,60,60,.6)}"
+"#sa-action-bar .sa-lamp.low{display:flex}"
+"#sa-action-bar .sa-lamp.low .bulb{background:#ffb020;border-color:#ffd070;box-shadow:0 0 8px rgba(255,176,32,.85),0 0 18px rgba(255,176,32,.4)}"
+"#sa-action-bar .sa-lamp.low .txt{color:#ffb020}"
+"@keyframes saLampBlink{0%,100%{opacity:1}50%{opacity:.3}}"
+"#sa-action-bar .sa-tile.no-ammo{border-color:rgba(255,80,80,.65);animation:saLampBlink .9s ease-in-out infinite}"
+"#sa-action-bar .sa-tile.no-ammo svg{stroke:#ff8080}"
+"#sa-action-bar .sa-acts{pointer-events:auto;display:flex;gap:6px;align-items:stretch;padding-bottom:4px;"
+"border-bottom:1px solid rgba(255,190,77,.22)}"
+"#sa-action-bar .sa-tile{appearance:none;width:66px;min-height:64px;padding:7px 3px 5px;cursor:pointer;border-radius:0;"
+"border:1px solid color-mix(in srgb,rgb(255 190 77 / 90%) 55%,white);"
+"background:linear-gradient(165deg,#6b5a28 0%,#4a3f1c 50%,#3a3216 100%);color:#f4f0e0;"
+"display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;"
+"font:700 9px/1 Orbitron,sans-serif;letter-spacing:.12em;text-transform:uppercase;"
+"transition:background .15s,border-color .15s,box-shadow .15s,transform .1s;"
+"box-shadow:inset 0 1px rgba(255,255,255,.1),0 2px rgba(0,0,0,.3)}"
+"#sa-action-bar .sa-tile:hover{background:linear-gradient(165deg,#7d6a30,#564820 50%,#443a1a);transform:translateY(-1px);"
+"box-shadow:inset 0 1px rgba(255,255,255,.14),0 0 14px rgba(255,190,77,.2)}"
+"#sa-action-bar .sa-tile:active{transform:translateY(1px);background:linear-gradient(165deg,#3a3216,#2a2410)}"
+"#sa-action-bar .sa-tile.dim{opacity:.4;pointer-events:none}"
+"#sa-action-bar .sa-tile.danger{border-color:rgba(255,100,100,.5);background:linear-gradient(165deg,#5a2828,#3a1818)}"
+"#sa-action-bar .sa-tile.on{border-color:rgba(255,190,77,.95);box-shadow:inset 0 0 0 1px rgba(255,190,77,.5),0 0 16px rgba(255,190,77,.3);color:#fff8e0}"
+"#sa-action-bar .sa-tile svg{width:22px;height:22px;stroke:currentColor;fill:none;stroke-width:1.6}"
+"#sa-action-bar .sa-tile .hk{font-size:7px;opacity:.55;letter-spacing:.06em;font-weight:600}"
+"#sa-action-bar .sa-tools{pointer-events:auto;display:flex;gap:6px}"
+"#sa-action-bar .sa-tools button{appearance:none;padding:4px 8px;border-radius:2px;border:1px solid rgba(255,255,255,.12);"
+"background:transparent;color:#888;font:700 8px Orbitron,sans-serif;letter-spacing:.08em;text-transform:uppercase;cursor:pointer}"
+"#sa-action-bar .sa-tools button:hover{color:#ddd;border-color:rgba(255,190,77,.35)}"
/* hide bulky stock planner chrome while wing-ordering (map targeting still works) */
+"body.sa-wing-order [class*=\\"plannerPanel\\"],body.sa-wing-order [class*=\\"plannerRail\\"]{"
+"opacity:0!important;pointer-events:none!important;transform:translateX(-120%)!important;position:fixed!important;left:0;top:0}"
+"#sa-groups-board{position:fixed;inset:0;z-index:1000003;pointer-events:none;font-family:Orbitron,ui-sans-serif,system-ui,sans-serif}"
+"#sa-groups-board .board{pointer-events:auto;position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);"
+"width:min(720px,calc(100vw - 24px));height:min(520px,calc(100vh - 96px));min-width:380px;min-height:300px;max-width:calc(100vw - 12px);max-height:calc(100vh - 12px);"
+"display:flex;flex-direction:column;overflow:hidden;"
+"background:linear-gradient(165deg,rgba(14,18,28,.98),rgba(8,10,16,.99));"
+"border:1px solid rgba(255,190,77,.42);border-radius:4px;"
+"box-shadow:0 20px 56px rgba(0,0,0,.7),0 0 0 1px rgba(0,0,0,.45),inset 0 1px rgba(255,255,255,.06)}"
+"#sa-groups-board .board-h{display:flex;align-items:center;justify-content:space-between;gap:10px;"
+"padding:12px 14px;border-bottom:1px solid rgba(255,190,77,.2);background:rgba(255,190,77,.08);cursor:grab;user-select:none;flex-shrink:0}"
+"#sa-groups-board .board-h:active{cursor:grabbing}"
+"#sa-groups-board .board-h h2{margin:0;color:#ffbe4d;font-size:13px;letter-spacing:.14em;text-transform:uppercase;font-weight:800}"
+"#sa-groups-board .board-h .sub{color:rgba(232,217,168,.55);font-size:9px;letter-spacing:.05em;margin-top:3px;font-weight:600}"
+"#sa-groups-board .board-h .tools{display:flex;gap:8px;align-items:center}"
+"#sa-groups-board .board-h button{appearance:none;min-height:40px;min-width:40px;padding:10px 16px;border-radius:2px;cursor:pointer;"
+"border:1px solid rgba(255,255,255,.18);background:rgba(0,0,0,.35);color:#e8d9a8;"
+"font:700 11px Orbitron,sans-serif;letter-spacing:.1em;text-transform:uppercase}"
+"#sa-groups-board .board-h button:hover{border-color:rgba(255,190,77,.55);color:#ffbe4d;background:rgba(255,190,77,.1)}"
+"#sa-groups-board .board-h button.primary{border-color:rgba(255,190,77,.55);background:rgba(255,190,77,.18);color:#ffbe4d}"
+"#sa-groups-board .board-h button.icon{min-width:42px;padding:10px 0;font-size:18px;line-height:1;font-weight:800}"
+"#sa-groups-board .cols{flex:1;display:flex;gap:10px;padding:12px;overflow:auto;min-height:0;"
+"scrollbar-width:thin;scrollbar-color:rgba(255,190,77,.4) transparent}"
+"#sa-groups-board .col{min-width:196px;flex:1 1 196px;background:rgba(0,0,0,.38);"
+"border:1px solid rgba(255,255,255,.1);border-radius:3px;display:flex;flex-direction:column;min-height:0;"
+"box-shadow:inset 0 0 0 1px rgba(0,0,0,.3)}"
+"#sa-groups-board .col[data-c='0']{border-color:rgba(255,190,77,.55);--col-accent:#ffbe4d;background:linear-gradient(180deg,rgba(255,190,77,.08),rgba(0,0,0,.38))}"
+"#sa-groups-board .col[data-c='1']{border-color:rgba(50,254,255,.5);--col-accent:#32feff;background:linear-gradient(180deg,rgba(50,254,255,.08),rgba(0,0,0,.38))}"
+"#sa-groups-board .col[data-c='2']{border-color:rgba(52,255,136,.5);--col-accent:#34ff88;background:linear-gradient(180deg,rgba(52,255,136,.08),rgba(0,0,0,.38))}"
+"#sa-groups-board .col[data-c='3']{border-color:rgba(167,139,250,.5);--col-accent:#a78bfa;background:linear-gradient(180deg,rgba(167,139,250,.08),rgba(0,0,0,.38))}"
+"#sa-groups-board .col[data-c='4']{border-color:rgba(255,107,53,.5);--col-accent:#ff6b35;background:linear-gradient(180deg,rgba(255,107,53,.08),rgba(0,0,0,.38))}"
+"#sa-groups-board .col[data-c='5']{border-color:rgba(96,165,250,.5);--col-accent:#60a5fa;background:linear-gradient(180deg,rgba(96,165,250,.08),rgba(0,0,0,.38))}"
+"#sa-groups-board .col[data-c='p']{border-color:rgba(148,163,184,.28);--col-accent:#94a3b8}"
+"#sa-groups-board .col-h{padding:10px 12px;border-bottom:1px solid color-mix(in srgb,var(--col-accent,#ffbe4d) 35%,transparent);"
+"color:var(--col-accent,#e8d9a8);font-weight:800;font-size:11px;letter-spacing:.1em;text-transform:uppercase;"
+"display:flex;justify-content:space-between;align-items:center;gap:6px;"
+"background:linear-gradient(90deg,color-mix(in srgb,var(--col-accent,#ffbe4d) 22%,transparent),transparent)}"
+"#sa-groups-board .col-h .cnt{color:color-mix(in srgb,var(--col-accent,#ffbe4d) 75%,#888);font-size:10px;font-weight:700}"
+"#sa-groups-board .col-b{flex:1;overflow:auto;padding:8px;display:flex;flex-direction:column;gap:5px;min-height:72px}"
+"#sa-groups-board .card{display:grid;grid-template-columns:10px minmax(0,1fr);gap:8px;align-items:start;"
+"padding:7px 8px;border-radius:2px;background:rgba(8,12,20,.55);"
+"border:1px solid color-mix(in srgb,var(--col-accent,#ffbe4d) 22%,transparent);cursor:grab}"
+"#sa-groups-board .card:hover{border-color:color-mix(in srgb,var(--col-accent,#ffbe4d) 55%,transparent);"
+"background:color-mix(in srgb,var(--col-accent,#ffbe4d) 10%,rgba(8,12,20,.6))}"
+"#sa-groups-board .card.sel{border-color:color-mix(in srgb,var(--col-accent,#ffbe4d) 80%,white);"
+"box-shadow:0 0 0 1px color-mix(in srgb,var(--col-accent,#ffbe4d) 35%,transparent)}"
+"#sa-groups-board .card .size{display:flex;flex-direction:column;justify-content:flex-end;gap:1.5px;height:28px;width:8px;padding-top:2px}"
+"#sa-groups-board .card .size i{display:block;height:2.5px;border-radius:1px;background:rgba(255,190,77,.18)}"
+"#sa-groups-board .card .size i.on{background:#ffbe4d;box-shadow:0 0 4px rgba(255,190,77,.35)}"
+"#sa-groups-board .card .meta{min-width:0}"
+"#sa-groups-board .card .name{color:#f0ebe0;font-size:11px;font-weight:700;letter-spacing:.02em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;line-height:1.25}"
+"#sa-groups-board .card .line{display:flex;flex-wrap:wrap;gap:3px 5px;align-items:baseline;margin-top:2px}"
+"#sa-groups-board .card .st{font-size:9px;font-weight:800;letter-spacing:.05em;text-transform:uppercase}"
+"#sa-groups-board .card .st.idle{color:#FFB800}"
+"#sa-groups-board .card .st.docked{color:#00D4FF}"
+"#sa-groups-board .card .st.move{color:#FF6B35}"
+"#sa-groups-board .card .st.mine{color:#00FF88}"
+"#sa-groups-board .card .st.scan{color:#A855F7}"
+"#sa-groups-board .card .st.dead{color:#FF4444}"
+"#sa-groups-board .card .st.other{color:#94a3b8}"
+"#sa-groups-board .card .loc{font-size:9px;color:rgba(180,196,220,.55);letter-spacing:.02em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}"
+"#sa-groups-board .card .bars{display:flex;flex-direction:column;gap:3px;margin-top:5px}"
+"#sa-groups-board .card .bar{display:flex;gap:1.5px;height:5px;align-items:stretch}"
+"#sa-groups-board .card .bar b{flex:1;min-width:0;border-radius:1px;background:rgba(255,255,255,.06)}"
+"#sa-groups-board .card .bar.hp b.on{background:#f87171;box-shadow:0 0 3px rgba(248,113,113,.35)}"
+"#sa-groups-board .card .bar.sp b.on{background:#22d3ee;box-shadow:0 0 3px rgba(34,211,238,.3)}"
+"#sa-groups-board .card .bar.fu b.on{background:#fbbf24}"
+"#sa-groups-board .muted{color:rgba(200,184,138,.4);font-size:9px;letter-spacing:.04em;padding:8px 4px}"
+"#sa-groups-board .col-f{padding:8px;display:flex;gap:8px;border-top:1px solid color-mix(in srgb,var(--col-accent,#ffbe4d) 22%,transparent);flex-shrink:0}"
+"#sa-groups-board .col-f button{flex:1;appearance:none;min-height:40px;padding:10px 12px;border-radius:2px;cursor:pointer;"
+"border:1px solid color-mix(in srgb,var(--col-accent,#ffbe4d) 45%,transparent);"
+"background:color-mix(in srgb,var(--col-accent,#ffbe4d) 14%,transparent);color:var(--col-accent,#ffbe4d);"
+"font:700 11px Orbitron,sans-serif;letter-spacing:.1em;text-transform:uppercase}"
+"#sa-groups-board .col-f button:hover{background:color-mix(in srgb,var(--col-accent,#ffbe4d) 24%,transparent)}"
+"#sa-groups-board .col-f button.del{flex:0 0 42px;border-color:rgba(248,113,113,.45);color:#f87171;background:transparent;font-size:16px}"
+"#sa-groups-board .status{padding:8px 14px;border-top:1px solid rgba(255,190,77,.16);color:rgba(200,184,138,.55);"
+"font-size:10px;letter-spacing:.05em;flex-shrink:0}"
+"#sa-groups-board .resize{position:absolute;right:0;bottom:0;width:18px;height:18px;cursor:nwse-resize;pointer-events:auto;"
+"background:linear-gradient(135deg,transparent 48%,rgba(255,190,77,.55) 48%,rgba(255,190,77,.55) 52%,transparent 52%,"
+"transparent 62%,rgba(255,190,77,.4) 62%,rgba(255,190,77,.4) 66%,transparent 66%);opacity:.9}"
+"#sa-groups-board.dragging .board{opacity:.97;box-shadow:0 28px 70px rgba(0,0,0,.75),0 0 24px rgba(255,190,77,.12)}"
+"#sa-combat-log-box{border-color:rgba(255,190,77,.4)!important;border-radius:4px!important;background:linear-gradient(165deg,rgba(22,18,12,.97),rgba(10,12,16,.98))!important;font-family:Orbitron,ui-sans-serif,system-ui,sans-serif!important;color:#e8d9a8!important}"
+"#sa-combat-log-box .sa-cl-head{background:rgba(255,190,77,.08)!important;color:#ffbe4d!important;border-bottom:1px solid rgba(255,190,77,.2)!important}"
+"#sa-combat-log-box .sa-cl-tabs{display:flex;gap:0;flex-shrink:0;border-bottom:1px solid rgba(255,190,77,.18);background:rgba(0,0,0,.2)}"
+"#sa-combat-log-box .sa-cl-tabs button{flex:1;appearance:none;border:none;background:transparent;color:rgba(200,184,138,.45);font:700 10px Orbitron,sans-serif;letter-spacing:.12em;text-transform:uppercase;padding:9px 6px;cursor:pointer}"
+"#sa-combat-log-box .sa-cl-tabs button.on{color:#ffbe4d;background:rgba(255,190,77,.1);box-shadow:inset 0 -2px #ffbe4d}"
+"#sa-combat-log-box .sa-cl-flight .sa-cl-row{color:rgba(232,217,168,.8)}"
+"#sa-combat-log-box .sa-cl-ico{appearance:none;min-height:32px;min-width:34px;padding:6px 10px;border-radius:2px;border:1px solid rgba(255,255,255,.14);background:rgba(0,0,0,.3);color:#e8d9a8;font:700 10px Orbitron,sans-serif;letter-spacing:.08em;text-transform:uppercase;cursor:pointer}"
+"#sa-combat-log-box .sa-cl-ico:hover{border-color:rgba(255,190,77,.5);color:#ffbe4d;background:rgba(255,190,77,.08)}"
+"#sa-action-bar{background:transparent;border:none;box-shadow:none;border-radius:0}"
+"#sa-action-bar .sa-acts{border-bottom:none}"
+"#sa-action-bar .sa-tile{position:relative;overflow:hidden;background:#141008;border:1px solid rgba(255,190,77,.5);color:#ffbe4d}"
+"#sa-action-bar .sa-tile svg{stroke:#ffbe4d}"
+"#sa-action-bar .sa-tile:hover{background:#1d1710}"
+"#sa-action-bar .sa-tile[data-act=dock]{border-color:rgba(56,182,255,.6);color:#38b6ff}"
+"#sa-action-bar .sa-tile[data-act=dock] svg{stroke:#38b6ff}"
+"#sa-action-bar .sa-tile.danger{border-color:rgba(255,100,100,.5);color:#ff6b6b;background:#170b0d}"
+"#sa-action-bar .sa-tile.danger svg{stroke:#ff6b6b}"
+"#sa-action-bar .sa-tile.dim{pointer-events:auto;cursor:not-allowed;background:#0c0a07;border-color:rgba(255,190,77,.16);color:rgba(255,190,77,.35)}"
+"#sa-action-bar .sa-tile.dim svg{stroke:rgba(255,190,77,.3)}"
+"#sa-action-bar .sa-tile.dim.danger{background:#120809;border-color:rgba(255,100,100,.18);color:rgba(255,107,107,.4)}"
+"#sa-action-bar .sa-tile.dim.danger svg{stroke:rgba(255,107,107,.35)}"
+"#sa-action-bar .sa-tile.on{background:#0a0805;box-shadow:inset 0 2px 8px rgba(0,0,0,.7),inset 0 0 0 1px rgba(255,190,77,.5);color:#ffe9b0}"
+"#sa-action-bar .sa-tile.on svg{stroke:#ffe9b0}"
+"#sa-action-bar .sa-tile.busy{pointer-events:none;cursor:wait;background:#0a0805;box-shadow:inset 0 2px 8px rgba(0,0,0,.7)}"
+"#sa-action-bar .sa-tile.busy>svg{opacity:.25}"
+"#sa-action-bar .sa-tile.busy>span:not(.sa-hg){opacity:.5}"
+"#sa-action-bar .sa-tile .sa-hg{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;z-index:3;pointer-events:none}"
+"#sa-action-bar .sa-tile .sa-hg .clk{position:relative;width:22px;height:22px;border-radius:50%;border:1.5px solid rgba(255,190,77,.8);box-shadow:0 0 8px rgba(255,190,77,.35);background:rgba(0,0,0,.4)}"
+"#sa-action-bar .sa-tile .sa-hg .clk::before{content:'';position:absolute;left:50%;top:50%;width:1.5px;height:9px;background:#ffbe4d;transform-origin:50% 0;animation:saClock 2.4s linear infinite}"
+"#sa-action-bar .sa-tile .sa-hg .clk::after{content:'';position:absolute;left:50%;top:50%;width:3px;height:3px;margin:-1.5px;border-radius:50%;background:#ffbe4d}"
+"@keyframes saClock{from{transform:translateX(-50%) rotate(0deg)}to{transform:translateX(-50%) rotate(360deg)}}"
+"#sa-action-bar .sa-tile.no-fuel{border-color:rgba(255,176,32,.7);color:#ffb020}"
+"#sa-action-bar .sa-tile.no-fuel svg{stroke:#ffb020}"
+"#sa-action-bar .sa-lamp.fuel.low .bulb{background:#38b6ff;border-color:#7fd4ff;box-shadow:0 0 8px rgba(56,182,255,.85),0 0 18px rgba(56,182,255,.4)}"
+"#sa-action-bar .sa-lamp.fuel.low .txt{color:#38b6ff}"
+"#sa-action-bar .sa-bar-grip{min-width:0;max-width:none;padding:2px 12px;border:none;background:transparent;box-shadow:none;justify-content:center;opacity:.4}"
+"#sa-action-bar .sa-bar-grip:hover{opacity:.85}"
+"#sa-action-bar .sa-bar-grip .hint{font:600 9px Orbitron,sans-serif;letter-spacing:.24em;color:rgba(232,217,168,.75)}"
+"#sa-action-bar .sa-lamp-row{margin:0 0 -7px;z-index:3}"
+"#sa-action-bar .sa-lamp{background:#000;border:1px solid rgba(255,190,77,.35);border-bottom:none;border-radius:12px 12px 0 0;box-shadow:none;padding:5px 18px 8px}"
+"#sa-action-bar .sa-acts{background:#000;border-radius:12px;padding:6px;border-top:1px solid #000;position:relative;z-index:1}"
+"#sa-action-bar .sa-chip{background:#141008!important}"
+"#sa-action-bar .sa-chip:hover{background:#1d1710!important}"
+"#sa-action-bar .sa-chip.on{background:#0a0805!important;box-shadow:inset 0 0 0 1px var(--chip-accent),0 0 10px color-mix(in srgb,var(--chip-accent) 40%,transparent);color:#fff8e8}"
+"#sa-action-bar .sa-lamp.out{border-color:rgba(255,80,80,.55)}"
+"#sa-action-bar .sa-lamp.low{border-color:rgba(255,176,32,.55)}"
+"#sa-action-bar .sa-lamp.fuel.low{border-color:rgba(56,182,255,.55)}";
    var st=document.getElementById("sa-hud-style");
    if(!st){st=document.createElement("style");st.id="sa-hud-style";document.documentElement.appendChild(st)}
    st.textContent=cssTxt;
  }
  function clickLabel(re){var nodes=document.querySelectorAll("button,[role=button]");for(var i=0;i<nodes.length;i++){var n=nodes[i],t=(n.textContent||"").replace(/\s+/g," ").trim(),title=n.getAttribute("title")||"";if(re.test(t)||re.test(title)){n.click();return true}}return false}
  function wingList(){
    try{
      var api=window.__SA_FLEET_GROUPS__;
      var durable=api.getDurableGroups?api.getDurableGroups():[];
      var temp=api.getTempGroup?api.getTempGroup():null;
      var all=[];
      if(temp&&temp.fleetKeys&&temp.fleetKeys.length)all.push(temp);
      return all.concat(durable||[]);
    }catch(e){return[]}
  }
  function clearSelection(){
    activeWingIds=[];
    pendingTx=null;
    try{window.__SA_ACTIVE_WING__=null;window.__SA_ACTIVE_WINGS__=[]}catch(e){}
    try{if(window.__SA_WING_PICK__&&window.__SA_WING_PICK__.isActive())window.__SA_WING_PICK__.stop()}catch(e){}
    try{var p=window.__SA_PLANNER__;if(p&&p.dispatch)p.dispatch({type:"close"})}catch(e){}
    try{var mov=window.__SA_MOVEMENT__;if(mov&&mov.cancel&&mov.getState&&mov.getState().active)mov.cancel()}catch(e){}
    try{document.getElementById("sa-wing-confirm")&&document.getElementById("sa-wing-confirm").remove()}catch(e){}
    try{document.body.classList.remove("sa-wing-order")}catch(e){}
    paint();
  }
  function isWingOn(id){return activeWingIds.indexOf(id)>=0}
  function selectedWings(){
    var gs=wingList(), out=[];
    activeWingIds.forEach(function(id){var g=gs.find(function(x){return x.id===id});if(g)out.push(g)});
    return out;
  }
  function selectedFleetCount(){
    var n=0,seen={};
    selectedWings().forEach(function(g){(g.fleetKeys||[]).forEach(function(k){k=String(k);if(!seen[k]){seen[k]=1;n++}})});
    return n;
  }
  function selectWing(id,ev){
    if(!id){clearSelection();return}
    var idx=activeWingIds.indexOf(id);
    if(ev&&ev.altKey){
      // Alt+click: solo (or clear if already sole)
      activeWingIds=(idx>=0&&activeWingIds.length===1)?[]:[id];
    }else if(ev&&ev.shiftKey){
      // Shift+click: daisy-chain the range anchor..clicked (anchor = last active)
      var order=[];try{order=(wingList()||[]).map(function(g){return g.id})}catch(e){}
      var ai=order.indexOf(id);
      var anchor=activeWingIds.length?order.indexOf(activeWingIds[activeWingIds.length-1]):-1;
      if(ai<0){activeWingIds=activeWingIds.concat([id])}
      else{
        if(anchor<0)anchor=ai;
        var lo=Math.min(ai,anchor),hi=Math.max(ai,anchor),set={};
        activeWingIds.forEach(function(x){set[x]=1});
        for(var i=lo;i<=hi;i++){if(order[i])set[order[i]]=1}
        activeWingIds=order.filter(function(x){return set[x]});
      }
    }else{
      // plain / Ctrl / Cmd click: toggle this wing in/out of the selection
      if(idx>=0)activeWingIds=activeWingIds.filter(function(x){return x!==id});
      else activeWingIds=activeWingIds.concat([id]);
    }
    try{
      window.__SA_ACTIVE_WING__=activeWingIds[0]||null;
      window.__SA_ACTIVE_WINGS__=activeWingIds.slice();
    }catch(e){}
    paint();
    try{
      var nums=activeWingIds.map(function(wid){return wingList().findIndex(function(g){return g.id===wid})+1}).filter(function(n){return n>0});
      window.__SA_FLIGHT_LOG__.push({type:"WING",msg:nums.length?(nums.length>1?("Chain "+nums.join("+")+" · "+selectedFleetCount()+" fleets"):("Wing "+nums[0])):"cleared",wingIds:activeWingIds.slice()});
    }catch(e){}
  }
  function ico(name){
    var sv={
      warp:'<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 4 L20 12 L16 10 L12 12 Z"/><path d="M8 16 L16 14 L24 16 L16 28 Z"/></svg>',
      swarp:'<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M6 16 H22"/><path d="M18 10 L26 16 L18 22"/></svg>',
      scan:'<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="4"/><circle cx="16" cy="16" r="9"/><path d="M16 2 V6 M16 26 V30 M2 16 H6 M26 16 H30"/></svg>',
      atk:'<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="8"/><path d="M16 4 V10 M16 22 V28 M4 16 H10 M22 16 H28"/><circle cx="16" cy="16" r="2"/></svg>',
      dock:'<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M8 26 H24"/><path d="M10 26 V14 H22 V26"/><path d="M16 4 V12"/><path d="M12 9 L16 13 L20 9"/></svg>',
      gate:'<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="10"/><path d="M6 16 H26"/><path d="M16 6 C11 12 11 20 16 26 C21 20 21 12 16 6"/></svg>',
      stims:'<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M18 6 L26 14"/><path d="M22 10 L10 22 L6 26 L10 26 L22 14"/><path d="M14 18 L18 22"/></svg>',
      mine:'<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M8 26 L20 14"/><path d="M14 8 C20 6 26 10 26 16"/><path d="M14 8 L20 14"/></svg>',
      destruct:'<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 6 L28 26 H4 Z"/><path d="M16 14 V20"/><path d="M16 23 V24"/></svg>',
      lock:'<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="9" y="14" width="14" height="11" rx="2"/><path d="M12 14 V10 a4 4 0 0 1 8 0 V14"/></svg>',
      cancel:'<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M8 8 L24 24 M24 8 L8 24"/></svg>'
    };
    return sv[name]||"";
  }
  function stockBtn(norm){
    try{
      var sec=document.querySelector('[class*="fleetActionBar"]');
      if(!sec)return null;
      var btns=sec.querySelectorAll("button");
      for(var i=0;i<btns.length;i++){
        var t=(btns[i].textContent||"").toUpperCase().split(" ").join("").split(String.fromCharCode(10)).join("");
        if(t.indexOf(norm)===0)return btns[i];
      }
    }catch(e){}
    return null;
  }
  function fwdStock(norm){var b=stockBtn(norm);if(b){try{b.click();return!0}catch(e){}}return!1}
  function run(action){
    var mov=window.__SA_MOVEMENT__,act=window.__SA_SAGE_ACTIONS__;
    if(action==="clear"||action==="cancel"){
      clearSelection();
      return!0;
    }
    if(action==="dock"){var okD=fwdStock("UNDOCK")||fwdStock("DOCK");if(okD)markPendingTx("dock");return okD}
    if(action==="gate"||action==="stims"||action==="mine"||action==="destruct"){
      var okF=fwdStock({gate:"WARPGATE",stims:"STIMS",mine:"MINE",destruct:"DESTRUCT"}[action]);
      if(okF)markPendingTx(action);
      return okF;
    }
    if(action==="subwarp"||action==="swarp"){
      if(!fuelGate("subwarp"))return!1;
      if(activeWingIds.length&&window.__SA_WING_PICK__){
        var has=selectedFleetCount()>0;
        if(has){window.__SA_WING_PICK__.start(activeWingIds.slice(),"subwarp");markPendingTx("swarp");paint();return!0}
      }
      if(mov&&typeof mov.start==="function"){try{return mov.start("subwarp")}catch(e){console.warn("sa subwarp",e)}}
      if(act&&act.showSubwarp){try{var r=act.showSubwarp();if(r!==!1)return r}catch(e){}}
      if(clickLabel(/^\s*subwarp\s*$/i))return!0;
      console.warn("%c ⚔️ sa-ui-fixes %c select a fleet or wing [1-5], then SWARP","background:#0a0f19;color:#ffbe4d;padding:1px 6px","color:#fbbf24");
      return!1;
    }
    if(action==="warp"){
      if(!fuelGate("warp"))return!1;
      if(activeWingIds.length&&window.__SA_WING_PICK__){
        if(selectedFleetCount()>0){window.__SA_WING_PICK__.start(activeWingIds.slice(),"warp");markPendingTx("warp");paint();return!0}
      }
      if(mov&&typeof mov.start==="function"){try{return mov.start("warp")}catch(e){}}
      if(act&&act.showWarp){try{var r2=act.showWarp();if(r2!==!1)return r2}catch(e){}}
      return clickLabel(/^\s*warp\s*$/i);
    }
    if(action==="scan"){
      if(activeWingIds.length){try{window.__SA_FLIGHT_LOG__.push({type:"WARN",msg:"SCAN is single-fleet — clear wings [×] or pick one fleet"})}catch(e){}
        console.warn("%c ⚔️ sa-ui-fixes %c SCAN needs a single fleet (clear wing)","background:#0a0f19;color:#ffbe4d;padding:1px 6px","color:#fbbf24");
        return!1}
      if(act&&act.showScan){try{return act.showScan()}catch(e){}}
      return clickLabel(/^\s*scan\s*$/i);
    }
    if(action==="attack"||action==="atk"){
      var amA=ammoState();
      if(amA.out){notifyBlock("OUT OF AMMO",(amA.lines.join(" · ")||"Selected fleet")+" — attack needs ammo. Restock at a station.");return!1}
      if(activeWingIds.length){try{window.__SA_FLIGHT_LOG__.push({type:"WARN",msg:"ATK is single-fleet — clear wings first"})}catch(e){}
        return!1}
      var okA=clickLabel(/^\s*attack\s*$/i);
      if(okA)markPendingTx("atk");
      return okA;
    }
    if(action==="lock"){
      try{var sel=window.__SA_SELECTED_FLEET__&&window.__SA_SELECTED_FLEET__.key;if(sel){var all=typeof window.__SA_PEEK_FLEETS__==="function"?window.__SA_PEEK_FLEETS__():[];var f=null,prof=window.__SA_PLAYER_PROFILE__;for(var i2=0;i2<all.length;i2++){if(String(all[i2].address||all[i2].key)===String(sel)){f=all[i2];break}}var kind="friendly";if(f&&f.data&&f.data.ownerProfile&&prof&&String(f.data.ownerProfile)!==String(prof))kind="enemy";var lbl=(f&&f.data&&f.data.fleetLabel)||String(sel).slice(0,10);window.__SA_FLEET_LOCKS__.lock(String(sel),lbl,kind);return!0}}catch(e){}
      return!1;
    }
    if(action==="groups")return openGroups();
  }
    function openGroups(){
    css();
    var prev=document.getElementById("sa-groups-board");
    if(prev){prev.remove();return}
    var fg=window.__SA_FLEET_GROUPS__;
    var POS_KEY="saWingsPanelPos.v1";
    var wrap=document.createElement("div");wrap.id="sa-groups-board";saIsolate(wrap);wrap.setAttribute("data-fc-floating-utility","true");
    var board=document.createElement("div");board.className="board";
    board.innerHTML=
      '<div class="board-h" data-drag>'+
        '<div><h2>Wings</h2><div class="sub">drag · resize corner · map stays live</div></div>'+
        '<div class="tools">'+
          '<button type="button" data-a="refresh" title="Refresh">Refresh</button>'+
          '<button type="button" data-a="add" class="primary" title="Add wing">+ Wing</button>'+
          '<button type="button" data-a="close" class="icon" title="Close">×</button>'+
        '</div>'+
      '</div>'+
      '<div class="cols"></div>'+
      '<div class="status" data-status></div>'+
      '<div class="resize" data-resize title="Resize"></div>';
    var cols=board.querySelector(".cols");
    var status=board.querySelector("[data-status]");
    function applyGeom(g){
      if(!g)return;
      if(Number.isFinite(g.left)&&Number.isFinite(g.top)){
        board.style.left=g.left+"px";board.style.top=g.top+"px";board.style.transform="none";
      }
      if(Number.isFinite(g.w)&&g.w>=380)board.style.width=g.w+"px";
      if(Number.isFinite(g.h)&&g.h>=300)board.style.height=g.h+"px";
    }
    function saveGeom(){
      try{
        var r=board.getBoundingClientRect();
        localStorage.setItem(POS_KEY,JSON.stringify({left:r.left,top:r.top,w:r.width,h:r.height}));
      }catch(e){}
    }
    try{applyGeom(JSON.parse(localStorage.getItem(POS_KEY)||"null"))}catch(e){}
    function fleetInfo(key){
      // Stock My Fleets labels/colors mirrored compactly
      var info={key:key,label:key.slice(0,10)+"…",state:"?",stClass:"other",stLabel:"?",size:1,hp:1,sp:1,fuel:1,loc:""};
      try{
        var all=typeof window.__SA_PEEK_FLEETS__==="function"?window.__SA_PEEK_FLEETS__():[];
        var f=null;for(var i=0;i<all.length;i++){if(String(all[i].address||all[i].key)===String(key)){f=all[i];break}}
        if(!f)return info;
        var d=f.data||{};
        info.label=d.fleetLabel||info.label;
        var st=(d.state&&(d.state.__kind||d.state.kind))||"?";
        info.state=String(st);
        var s=info.state;
        // map chain state → My Fleets status keys
        if(s==="Idle"){info.stClass="idle";info.stLabel="UNDOCKED / IDLE"}
        else if(s==="StarbaseLoadingBay"||/Dock|LoadingBay/i.test(s)){info.stClass="docked";info.stLabel="DOCKED"}
        else if(s==="MoveWarp"){info.stClass="move";info.stLabel="WARPING"}
        else if(s==="MoveSubwarp"){info.stClass="move";info.stLabel="SUB-WARPING"}
        else if(s==="MineAsteroid"||/Mine/i.test(s)){info.stClass="mine";info.stLabel="MINING"}
        else if(s==="Scan"||/Scan/i.test(s)){info.stClass="scan";info.stLabel="SCANNING"}
        else if(s==="Destroyed"||s==="Respawn"){info.stClass="dead";info.stLabel=s==="Respawn"?"RESPAWNING":"DESTROYED"}
        else{info.stLabel=s}
        // size: stock uses fleetSizeClass (0–8 segs) or shipCounts weight; we show 6 segs compact
        var SEG=6, sz=1;
        if(typeof d.fleetSizeClass==="number"&&Number.isFinite(d.fleetSizeClass)){
          sz=Math.min(SEG,Math.max(1,Math.ceil(d.fleetSizeClass*(SEG/8))));
        }else if(typeof d.fleetSize==="number"&&Number.isFinite(d.fleetSize)){
          var fmax=Number(d.fleetSizeMax||50)||50;
          sz=Math.min(SEG,Math.max(1,Math.ceil((d.fleetSize/fmax)*SEG)));
        }else{
          var ships=d.shipCounts||d.ships||d.fleetShips;
          var qty=0;
          if(Array.isArray(ships)){
            ships.forEach(function(sh){qty+=Number(sh&&(sh.quantity||sh.count||1))||1});
          }else if(ships&&typeof ships==="object"){
            Object.keys(ships).forEach(function(k){
              var v=ships[k];
              qty+=typeof v==="number"?v:(v&&(v.quantity||v.count||1))||1;
            });
          }
          if(qty>0)sz=Math.min(SEG,Math.max(1,qty<=2?1:qty<=4?2:qty<=8?3:qty<=16?4:qty<=32?5:6));
          else if(d.stats&&(d.stats.movementStats||d.stats.combatStats))sz=3;
        }
        info.size=sz;
        // vitals: account hp/sp + stats.maxHp / stats.maxSp
        var stats=d.stats||{};
        var hp=Number(d.hp), maxHp=Number(d.maxHp!=null?d.maxHp:(stats.maxHp!=null?stats.maxHp:(stats.hp!=null?stats.hp:NaN)));
        var sp=Number(d.sp), maxSp=Number(d.maxSp!=null?d.maxSp:(stats.maxSp!=null?stats.maxSp:(stats.sp!=null?stats.sp:NaN)));
        if(!Number.isFinite(maxHp)||maxHp<=0)maxHp=Number.isFinite(hp)&&hp>0?hp:1;
        if(!Number.isFinite(maxSp)||maxSp<=0)maxSp=Number.isFinite(sp)&&sp>0?sp:1;
        if(Number.isFinite(hp))info.hp=Math.max(0,Math.min(1,hp/maxHp));
        if(Number.isFinite(sp))info.sp=Math.max(0,Math.min(1,sp/maxSp));
        // fuel from fuelTank (stock) or cargo
        try{
          var tank=d.fuelTank||d.cargoHold||d.cargo;
          if(tank){
            var fu=Number(tank.amount!=null?tank.amount:tank.fuel!=null?tank.fuel:tank.current);
            var fcap=Number(tank.capacity!=null?tank.capacity:tank.fuelCapacity!=null?tank.fuelCapacity:tank.maxFuel);
            if(!Number.isFinite(fcap)||fcap<=0){
              var cs=stats.cargoStats||stats;
              fcap=Number(cs.fuelCapacity||cs.maxFuel||0);
            }
            if(Number.isFinite(fu)&&fcap>0)info.fuel=Math.max(0,Math.min(1,fu/fcap));
          }
        }catch(e){}
        // location: system name if present, else coords
        var dest=d.destination||d.warpTo||null;
        var sysName=d.systemName||d.starbaseName||(d.locationName)||(dest&&(dest.label||dest.systemName))||"";
        if(info.stClass==="move"&&sysName)info.loc=sysName;
        else if(sysName)info.loc=sysName;
        else{
          var loc=d.location||d.currentCoordinates;
          if(loc&&loc[0]!=null){
            var x=Number(loc[0]),y=Number(loc[1]);
            if(Number.isFinite(x)&&Number.isFinite(y)){
              if(Math.abs(x)>1e5){x=x/1e9;y=y/1e9}
              info.loc=x.toFixed(1)+", "+y.toFixed(1);
            }
          }
        }
      }catch(e){}
      return info;
    }
    function sizeHtml(n){
      var h="",segs=6;for(var i=0;i<segs;i++)h+="<i class='"+(i<n?"on":"")+"'></i>";
      return '<div class="size">'+h+"</div>";
    }
    function barHtml(cls,ratio){
      var segs=12,on=Math.round(Math.max(0,Math.min(1,ratio))*segs),h="";
      for(var i=0;i<segs;i++)h+="<b class='"+(i<on?"on":"")+"'></b>";
      return '<div class="bar '+cls+'">'+h+"</div>";
    }
    function render(){
      var cur=fg.get();cols.innerHTML="";
      var labels=cur.labels||{},selectedKey=cur.selectedKey||null;
      var durable=(cur.groups||[]).filter(function(g){return !g.temporary&&g.id!=="g-temp-0"});
      var ownedN=(cur.ungrouped||[]).length;
      durable.forEach(function(g){ownedN+=(g.fleetKeys||[]).length});
      status.textContent=ownedN?(ownedN+" fleets · drag between columns · resize ↘"):"Waiting for fleets…";
      function mkCol(id,title,keys,wingIndex,colorIdx){
        var col=document.createElement("div");col.className="col";
        col.setAttribute("data-c",colorIdx!=null?String(colorIdx):"p");
        var badge=wingIndex!=null?(" ["+(wingIndex+1)+"]"):"";
        col.innerHTML='<div class="col-h"><span data-title></span><span class="cnt">'+keys.length+'</span></div><div class="col-b"></div>';
        col.querySelector("[data-title]").textContent=(title||"Wing")+badge;
        if(id!=="ungrouped"&&id!=="g-temp-0"){
          var t=col.querySelector("[data-title]");
          t.style.cursor="text";t.title="Double-click to rename";
          t.onclick=function(e){if(e.detail===2){var n=prompt("Wing name",title);if(n){fg.renameGroup(id,n);render();paint()}}};
        }
        var body=col.querySelector(".col-b");
        body.ondragover=function(e){e.preventDefault();body.style.outline="1px dashed color-mix(in srgb, var(--col-accent) 50%, transparent)"};
        body.ondragleave=function(){body.style.outline="none"};
        body.ondrop=function(e){
          e.preventDefault();body.style.outline="none";
          var key=e.dataTransfer.getData("text/sa-fleet");
          if(key){fg.moveFleet(key,id);render();paint()}
        };
        keys.forEach(function(k){
          var info=fleetInfo(k);
          if(labels[k])info.label=labels[k];
          var card=document.createElement("div");card.className="card";card.draggable=true;
          if(selectedKey&&String(k)===String(selectedKey))card.classList.add("sel");
          var stLabel=info.stLabel||info.state||"?";
          card.innerHTML=sizeHtml(info.size)+
            '<div class="meta"><div class="name"></div><div class="line"><span class="st '+info.stClass+'"></span><span class="loc"></span></div>'+
            '<div class="bars">'+barHtml("hp",info.hp)+barHtml("sp",info.sp)+barHtml("fu",info.fuel)+"</div></div>";
          card.querySelector(".name").textContent=(selectedKey&&String(k)===String(selectedKey)?"▸ ":"")+info.label;
          card.querySelector(".st").textContent=stLabel;
          card.querySelector(".loc").textContent=info.loc?(" @ "+info.loc):"";
          card.title=info.label+" · "+stLabel+(info.loc?" · "+info.loc:"")+" · HP "+Math.round(info.hp*100)+"% · SP "+Math.round(info.sp*100)+"% · Fuel "+Math.round(info.fuel*100)+"%";
          card.ondragstart=function(e){e.dataTransfer.setData("text/sa-fleet",k)};
          body.appendChild(card);
        });
        if(!keys.length){
          var empty=document.createElement("div");empty.className="muted";
          empty.textContent=id==="ungrouped"?"No unassigned fleets":"Drop fleets here";
          body.appendChild(empty);
        }
        if(id!=="ungrouped"&&id!=="g-temp-0"){
          var tools=document.createElement("div");tools.className="col-f";
          tools.innerHTML='<button type="button" data-fly>Use wing</button><button type="button" data-del class="del" title="Delete">×</button>';
          tools.querySelector("[data-del]").onclick=function(){
            try{activeWingIds=activeWingIds.filter(function(x){return x!==id})}catch(e){}
            fg.removeGroup(id);render();paint();
          };
          tools.querySelector("[data-fly]").onclick=function(){selectWing(id)};
          col.appendChild(tools);
        }
        cols.appendChild(col);
      }
      mkCol("ungrouped","Pool",(cur.ungrouped||[]).map(function(f){return f.key}),null,"p");
      durable.forEach(function(g,i){mkCol(g.id,g.name,g.fleetKeys||[],i,String(i%6))});
    }
    board.querySelector('[data-a="close"]').onclick=function(e){e.stopPropagation();saveGeom();wrap.remove()};
    board.querySelector('[data-a="add"]').onclick=function(e){e.stopPropagation();fg.addGroup();render();paint()};
    board.querySelector('[data-a="refresh"]').onclick=function(e){e.stopPropagation();render();paint()};
    // drag by header
    (function(){
      var head=board.querySelector("[data-drag]");
      var dragging=!1,ox=0,oy=0,sl=0,st=0;
      head.addEventListener("pointerdown",function(e){
        if(e.button!==0)return;
        if(e.target&&e.target.closest&&e.target.closest("button"))return;
        dragging=!0;wrap.classList.add("dragging");
        var r=board.getBoundingClientRect();
        ox=e.clientX;oy=e.clientY;sl=r.left;st=r.top;
        board.style.left=sl+"px";board.style.top=st+"px";board.style.transform="none";
        try{head.setPointerCapture(e.pointerId)}catch(err){}
        e.preventDefault();
      });
      head.addEventListener("pointermove",function(e){
        if(!dragging)return;
        var nx=sl+(e.clientX-ox),ny=st+(e.clientY-oy);
        var maxX=Math.max(8,(window.innerWidth||800)-board.offsetWidth-8);
        var maxY=Math.max(8,(window.innerHeight||600)-board.offsetHeight-8);
        board.style.left=Math.min(maxX,Math.max(8,nx))+"px";
        board.style.top=Math.min(maxY,Math.max(8,ny))+"px";
      });
      function endDrag(){if(!dragging)return;dragging=!1;wrap.classList.remove("dragging");saveGeom()}
      head.addEventListener("pointerup",endDrag);
      head.addEventListener("pointercancel",endDrag);
    })();
    // custom resize handle (more reliable than CSS resize alone for fixed panels)
    (function(){
      var h=board.querySelector("[data-resize]");
      var resizing=!1,ox=0,oy=0,sw=0,sh=0;
      h.addEventListener("pointerdown",function(e){
        e.preventDefault();e.stopPropagation();
        resizing=!0;
        var r=board.getBoundingClientRect();
        ox=e.clientX;oy=e.clientY;sw=r.width;sh=r.height;
        board.style.transform="none";
        if(!board.style.left){board.style.left=r.left+"px";board.style.top=r.top+"px"}
        try{h.setPointerCapture(e.pointerId)}catch(err){}
      });
      h.addEventListener("pointermove",function(e){
        if(!resizing)return;
        var nw=Math.max(380,Math.min((window.innerWidth||900)-16,sw+(e.clientX-ox)));
        var nh=Math.max(300,Math.min((window.innerHeight||700)-16,sh+(e.clientY-oy)));
        board.style.width=nw+"px";board.style.height=nh+"px";
      });
      function endR(){if(!resizing)return;resizing=!1;saveGeom()}
      h.addEventListener("pointerup",endR);
      h.addEventListener("pointercancel",endR);
    })();
    wrap.appendChild(board);
    document.body.appendChild(wrap);
    render();
  }
  function ensure(){
    css();
    if(root&&root.isConnected)return root;
    root=document.createElement("div");root.id="sa-action-bar";
    root.dataset.saOverlay="action-bar";
    saIsolate(root);
    root.setAttribute("data-fc-floating-utility","true");
    root.title="SAGE UI Fixes — Fleet action bar (wings · SWARP/WARP · ATK). Drag the gold strip to move; double-click strip to reset.";
    root.innerHTML='<div class="sa-bar-grip" data-drag title="SAGE UI Fixes · Fleet bar · drag to move · dbl-click reset"><span class="hint">⋮⋮</span></div><div class="sa-cancel-row" data-cancel></div><div class="sa-row" data-wings></div><div class="sa-acts" data-acts></div><div class="sa-tools"><button type="button" data-a="groups">Wings</button><button type="button" data-a="flight">Log</button></div>';
    document.body.appendChild(root);
    root.querySelector('[data-a="groups"]').onclick=function(){openGroups()};
    root.querySelector('[data-a="flight"]').onclick=function(){try{window.__SA_LOG_COMBAT_EVENT&&window.__SA_LOG_COMBAT_EVENT.showTab&&window.__SA_LOG_COMBAT_EVENT.showTab("flight")}catch(e){}};
    // drag grip + persist
    (function(){
      var POS_KEY="saActionBarPos.v1";
      var grip=root.querySelector("[data-drag]");
      if(!grip)return;
      var dragging=false,moved=false,ox=0,oy=0,sx=0,sy=0;
      function clamp(){
        var maxX=Math.max(8,(window.innerWidth||800)-root.offsetWidth-8);
        var maxY=Math.max(8,(window.innerHeight||600)-root.offsetHeight-8);
        var L=parseFloat(root.style.left),T=parseFloat(root.style.top);
        if(Number.isFinite(L))root.style.left=Math.min(maxX,Math.max(8,L))+"px";
        if(Number.isFinite(T))root.style.top=Math.min(maxY,Math.max(8,T))+"px";
      }
      function applyPos(L,T){
        root.classList.add("sa-bar-pos");
        root.style.left=L+"px";root.style.top=T+"px";
        root.style.right="auto";root.style.bottom="auto";root.style.transform="none";
        clamp();
      }
      function sizeKey(){return (window.innerWidth||0)+"x"+(window.innerHeight||0)}
      function loadMap(){try{return JSON.parse(localStorage.getItem(POS_KEY)||"{}")||{}}catch(e){return{}}}
      function savePos(){try{var m=loadMap();m[sizeKey()]={left:parseFloat(root.style.left),top:parseFloat(root.style.top)};localStorage.setItem(POS_KEY,JSON.stringify(m))}catch(e){}}
      function centerPos(){
        root.classList.remove("sa-bar-pos");
        root.style.left="";root.style.top="";root.style.right="";root.style.bottom="";root.style.transform="";
      }
      function resetPos(){centerPos();try{localStorage.removeItem(POS_KEY)}catch(e){}}
      function applySavedOrCenter(){var m=loadMap();var p=m[sizeKey()];if(p&&Number.isFinite(p.left)&&Number.isFinite(p.top))applyPos(p.left,p.top);else centerPos()}
      window.__SA_BAR_RESET__=resetPos;
      applySavedOrCenter();
      grip.addEventListener("pointerdown",function(e){
        if(e.button!==0)return;
        dragging=true;moved=false;
        root.classList.add("sa-bar-dragging");
        var r=root.getBoundingClientRect();
        ox=e.clientX;oy=e.clientY;sx=r.left;sy=r.top;
        applyPos(sx,sy);
        try{grip.setPointerCapture(e.pointerId)}catch(err){}
        e.preventDefault();
      });
      grip.addEventListener("pointermove",function(e){
        if(!dragging)return;
        var dx=e.clientX-ox,dy=e.clientY-oy;
        if(Math.abs(dx)>2||Math.abs(dy)>2)moved=true;
        applyPos(sx+dx,sy+dy);
      });
      function endDrag(){
        if(!dragging)return;
        dragging=false;root.classList.remove("sa-bar-dragging");
        if(moved)savePos();
      }
      grip.addEventListener("pointerup",endDrag);
      grip.addEventListener("pointercancel",endDrag);
      grip.addEventListener("dblclick",function(){resetPos()});
      var _rT=0;window.addEventListener("resize",function(){clearTimeout(_rT);_rT=setTimeout(applySavedOrCenter,200)});
    })();
    return root;
  }
  function fleetAmmo(key){
    try{
      var all=typeof window.__SA_PEEK_FLEETS__==="function"?window.__SA_PEEK_FLEETS__():[];
      for(var i=0;i<all.length;i++){
        if(String(all[i].address||all[i].key)===String(key)){
          var d=all[i].data||{},st=d.stats||{},bank=d.ammoBank||{};
          var cur=Number(st.ammoCurrent!=null?st.ammoCurrent:bank.amount);
          var cap=Number(st.totalAmmoCapacity!=null?st.totalAmmoCapacity:bank.capacity);
          var draw=st.totalAmmoDraw!=null?Number(st.totalAmmoDraw):null;
          return{cur:cur,cap:cap,draw:draw,label:d.fleetLabel||String(key).slice(0,8)};
        }
      }
    }catch(e){}
    return null;
  }
  function ammoState(){
    var keys=[],seen={};
    function add(k){k=String(k);if(k&&!seen[k]){seen[k]=1;keys.push(k)}}
    if(activeWingIds.length){selectedWings().forEach(function(g){(g.fleetKeys||[]).forEach(add)})}
    else{try{var fg=window.__SA_FLEET_GROUPS__;var sk=fg&&fg.get&&fg.get().selectedKey;if(sk)add(sk)}catch(e){}}
    var out=!1,cur=0,cap=0,lines=[];
    keys.forEach(function(k){
      var a=fleetAmmo(k);if(!a)return;
      var hasCap=Number.isFinite(a.cap)&&a.cap>0,hasDraw=a.draw!=null&&Number.isFinite(a.draw)&&a.draw>0;
      if(!hasCap&&!hasDraw)return;
      if(Number.isFinite(a.cur))cur+=Math.max(0,a.cur);
      if(hasCap)cap+=a.cap;
      if(Number.isFinite(a.cur)&&a.cur<=0){out=!0;lines.push(a.label+" 0"+(hasCap?"/"+a.cap:""))}
    });
    var low=!out&&cap>0&&cur/cap<=0.15;
    return{out:out,low:low,cur:cur,cap:cap,lines:lines};
  }
  function selectedFleetKeys(){
    var keys=[],seen={};
    function add(k){k=String(k);if(k&&!seen[k]){seen[k]=1;keys.push(k)}}
    if(activeWingIds.length){selectedWings().forEach(function(g){(g.fleetKeys||[]).forEach(add)})}
    else{try{var fg=window.__SA_FLEET_GROUPS__;var sk=fg&&fg.get&&fg.get().selectedKey;if(sk)add(sk)}catch(e){}}
    return keys;
  }
  function fleetFuel(key){
    try{
      var all=typeof window.__SA_PEEK_FLEETS__==="function"?window.__SA_PEEK_FLEETS__():[];
      for(var i=0;i<all.length;i++){
        if(String(all[i].address||all[i].key)===String(key)){
          var d=all[i].data||{},st=d.stats||{};
          var cur=Number(st.fuelCurrent);
          if(!Number.isFinite(cur)){var tank=d.fuelTank||d.cargoHold||d.cargo;if(tank)cur=Number(tank.amount!=null?tank.amount:tank.fuel)}
          var cap=Number(st.totalFuelCapacity);
          if(!Number.isFinite(cap)||cap<=0){var t2=d.fuelTank;if(t2)cap=Number(t2.capacity)}
          return{cur:Number.isFinite(cur)?cur:0,cap:Number.isFinite(cap)&&cap>0?cap:0,label:d.fleetLabel||String(key).slice(0,8)};
        }
      }
    }catch(e){}
    return null;
  }
  function fleetStateKind(key){
    try{
      var all=typeof window.__SA_PEEK_FLEETS__==="function"?window.__SA_PEEK_FLEETS__():[];
      for(var i=0;i<all.length;i++){
        if(String(all[i].address||all[i].key)===String(key)){var d=all[i].data||{};return (d.state&&(d.state.__kind||d.state.kind))||null}
      }
    }catch(e){}
    return null;
  }
  function fuelState(){
    var keys=selectedFleetKeys(),out=0,known=0,cur=0,cap=0,lines=[];
    keys.forEach(function(k){
      var a=fleetFuel(k);if(!a)return;known++;
      cur+=Math.max(0,a.cur);
      if(a.cap>0)cap+=a.cap;
      if(a.cur<=0){out++;lines.push(a.label+" 0"+(a.cap>0?"/"+a.cap:""))}
    });
    var allOut=known>0&&out>=known;
    var low=!allOut&&cap>0&&cur/cap<=0.25;
    return{out:out,known:known,allOut:allOut,low:low,cur:cur,cap:cap,lines:lines};
  }
  function notifyBlock(title,msg){
    try{if(window.__SA_COMMS__)window.__SA_COMMS__.push(msg,title)}catch(e){}
    try{if(window.__SA_FLIGHT_LOG__)window.__SA_FLIGHT_LOG__.push({type:"WARN",msg:title+" \u2014 "+msg})}catch(e){}
  }
  function fuelGate(mode){
    var fs=fuelState();
    if(!fs.known)return!0;
    var word=mode==="warp"?"warp":"subwarp";
    if(fs.allOut){notifyBlock("OUT OF FUEL",(fs.lines.join(" \u00b7 ")||"Selected fleet")+" \u2014 every selected fleet is dry. Refuel at a station before "+word+"ing.");return!1}
    if(fs.out>0){notifyBlock("FUEL WARNING",fs.out+" of "+fs.known+" selected fleets have no fuel ("+fs.lines.join(" \u00b7 ")+"). They may be left behind.")}
    else if(fs.low){notifyBlock("LOW FUEL",Math.round(fs.cur)+" / "+fs.cap+" across selected fleets \u2014 check the distance before committing.")}
    return!0;
  }
  var pendingTx=null;
  function markPendingTx(action){
    var keys=selectedFleetKeys(),snap=[];
    try{
      var all=typeof window.__SA_PEEK_FLEETS__==="function"?window.__SA_PEEK_FLEETS__():[];
      keys.forEach(function(k){
        for(var i=0;i<all.length;i++){
          if(String(all[i].address||all[i].key)===String(k)){
            var d=all[i].data||{};
            snap.push({key:String(k),state:(d.state&&(d.state.__kind||d.state.kind))||"?"});
            break;
          }
        }
      });
    }catch(e){}
    pendingTx={action:action,t0:Date.now(),snap:snap,min:1200,max:action==="dock"?180000:120000};
  }
  function pendingTxDone(){
    if(!pendingTx)return!0;
    var now=Date.now(),el=now-pendingTx.t0;
    if(el>=pendingTx.max){pendingTx=null;return!0}
    if(el<pendingTx.min)return!1;
    if(!pendingTx.snap.length){if(el>4000){pendingTx=null;return!0}return!1}
    var changed=!1;
    try{
      var all=typeof window.__SA_PEEK_FLEETS__==="function"?window.__SA_PEEK_FLEETS__():[];
      pendingTx.snap.forEach(function(s0){
        var cur="?",found=!1;
        for(var i=0;i<all.length;i++){
          if(String(all[i].address||all[i].key)===String(s0.key)){
            var d=all[i].data||{};found=!0;
            cur=(d.state&&(d.state.__kind||d.state.kind))||"?";
            break;
          }
        }
        if(found&&cur!==s0.state)changed=!0;
      });
    }catch(e){}
    if(changed){pendingTx=null;return!0}
    return!1;
  }

  function paint(){
    if(!isBarVisible()||!(window.__SA_IN_GAME&&window.__SA_IN_GAME())){if(root&&root.isConnected)root.style.display="none";return}
    try{if(document.querySelector('[class*="menuContent_"]')){if(root&&root.isConnected)root.style.display="none";return}}catch(e){}
    var bar=ensure();
    try{bar.style.display=""}catch(e){}
    var wingsEl=bar.querySelector("[data-wings]");
    var actsEl=bar.querySelector("[data-acts]");
    var groups=wingList();
    wingsEl.innerHTML="";
    // [0] temporary marquee, then durable 1-5; Ctrl/Cmd+click chains; [×] spaced away
    var fgApi=window.__SA_FLEET_GROUPS__;
    var durable=[];
    try{durable=fgApi.getDurableGroups?fgApi.getDurableGroups():(groups||[]).filter(function(g){return !g.temporary&&g.id!=="g-temp-0"})}catch(e){durable=groups||[]}
    var temp=null;
    try{temp=fgApi.getTempGroup&&fgApi.getTempGroup()}catch(e){}
    // slot 0
    (function(){
      var b=document.createElement("button");b.type="button";
      var n=temp&&temp.fleetKeys?temp.fleetKeys.length:0;
      var on=temp&&isWingOn(temp.id);
      b.className="sa-chip sa-chip-0"+(on?" on":"")+((!n)?" empty":"")+(on&&activeWingIds.length>1?" chain":"");
      b.title=n?("Marquee [0] · "+n+" fleets · Shift+drag on map"):"Shift+drag on map to select owned fleets → [0]";
      b.innerHTML='<span class="n">0</span><span class="c">'+(n||"—")+'</span>';
      b.onclick=function(ev){
        if(!temp||!temp.fleetKeys||!temp.fleetKeys.length)return;
        selectWing(temp.id,ev);
      };
      wingsEl.appendChild(b);
    })();
    var chained=activeWingIds.length>1;
    for(var i=0;i<5;i++){
      var g=durable[i];
      var b=document.createElement("button");b.type="button";
      var n=g&&g.fleetKeys?g.fleetKeys.length:0;
      var on=g&&isWingOn(g.id);
      b.className="sa-chip w"+(i+1)+(on?" on":"")+((!g||!n)?" empty":"")+(on&&chained?" chain":"");
      b.title=g?(g.name||("Wing "+(i+1)))+" · key "+(i+1)+(n?" · click toggle · Shift+click chain · Alt+click solo":""):"Empty wing slot · Edit Wings";
      b.innerHTML='<span class="n">'+(i+1)+'</span><span class="c">'+(g?n:"—")+'</span>';
      (function(gi,grp){
        b.onclick=function(ev){
          if(!grp||!grp.fleetKeys||!grp.fleetKeys.length){openGroups();return}
          selectWing(grp.id,ev);
        };
      })(i,g);
      wingsEl.appendChild(b);
    }
    if(chained){
      var hint=document.createElement("span");hint.className="sa-link-hint";
      hint.textContent="⛓ "+activeWingIds.length+" · "+selectedFleetCount();
      hint.title="Chained wings share one destination";
      wingsEl.appendChild(hint);
    }
    var spacer=document.createElement("span");spacer.className="sa-x-spacer";spacer.setAttribute("aria-hidden","true");
    wingsEl.appendChild(spacer);
    var x=document.createElement("button");x.type="button";x.className="sa-x";x.title="Clear selection (Esc)";x.textContent="×";
    x.onclick=function(){clearSelection()};
    wingsEl.appendChild(x);

    var wingPick=window.__SA_WING_PICK__&&window.__SA_WING_PICK__.isActive();
    var movActive=false;try{movActive=!!(window.__SA_MOVEMENT__&&window.__SA_MOVEMENT__.getState&&window.__SA_MOVEMENT__.getState().active)}catch(e){}
    var picking=!!(wingPick||movActive);
    var cancelRow=bar.querySelector("[data-cancel]");
    if(cancelRow){
      cancelRow.className="sa-cancel-row"+(picking?" show":"");
      cancelRow.innerHTML="";
      if(picking){
        var cb=document.createElement("button");cb.type="button";cb.className="sa-cancel-btn";
        var modeHint="CANCEL";
        try{
          if(wingPick){var wp=window.__SA_WING_PICK__.get&&window.__SA_WING_PICK__.get();modeHint=(wp&&wp.mode==="warp"?"CANCEL WARP":"CANCEL SWARP")}
          else if(movActive){var st=window.__SA_MOVEMENT__.getState();modeHint=(st&&st.type==="warp"?"CANCEL WARP":"CANCEL SWARP")}
        }catch(e){}
        cb.innerHTML=modeHint+'<span class="hk">ESC</span>';
        cb.onclick=function(){run("cancel")};
        cancelRow.appendChild(cb);
      }
    }
    var m=(window.__SA_HOTKEYS__&&window.__SA_HOTKEYS__.get())||{};
    actsEl.innerHTML="";
    // Always show action tiles; highlight active pick mode on warp/swarp
    var pickMode=null;
    try{
      if(wingPick){var wpg=window.__SA_WING_PICK__.get&&window.__SA_WING_PICK__.get();pickMode=wpg&&wpg.mode==="warp"?"warp":"swarp"}
      else if(movActive){var ms=window.__SA_MOVEMENT__.getState();pickMode=ms&&ms.type==="warp"?"warp":"swarp"}
    }catch(e){}
    var hasSec=!1;try{hasSec=!!document.querySelector('[class*="fleetActionBar"]')}catch(e){}
    var hasAtk=!!stockBtn("ATTACK");
    var undock=!!stockBtn("UNDOCK");
    try{
      var fgSel=window.__SA_FLEET_GROUPS__;var skSel=fgSel&&fgSel.get&&fgSel.get().selectedKey;
      if(skSel){var stSel=fleetStateKind(skSel);if(stSel)undock=/Dock|LoadingBay/i.test(String(stSel));}
    }catch(e){}
    var busy=activeWingIds.length>0||picking;
    var fs=fuelState(),am=ammoState();
    pendingTxDone();
    var actions=[
      {id:"dock",lb:undock?"Undock":"Dock",ico:"dock",fwd:1,dim:!hasSec,why:!hasSec?"Dock/Undock needs a station":""},
      {id:"warp",lb:"Warp",ico:"warp",hk:m.warp||"S-Sp",on:pickMode==="warp",dim:(picking&&pickMode!=="warp")||fs.allOut,why:(picking&&pickMode!=="warp")?"Finish or cancel the current pick first":(fs.allOut?"No fuel \u2014 refuel at a station":"")},
      {id:"swarp",lb:"Subwarp",ico:"swarp",hk:m.subwarp||"Sp",on:pickMode==="swarp",dim:(picking&&pickMode!=="swarp")||fs.allOut,why:(picking&&pickMode!=="swarp")?"Finish or cancel the current pick first":(fs.allOut?"No fuel \u2014 refuel at a station":"")},
      {id:"gate",lb:"Warp Gate",ico:"gate",fwd:1,dim:!hasSec,why:!hasSec?"Warp Gate needs a station":""},
      {id:"stims",lb:"Stims",ico:"stims",fwd:1,dim:!hasSec,why:!hasSec?"Stims need a station":""},
      {id:"atk",lb:"Attack",ico:"atk",hk:m.attack||"A",dim:busy||!hasAtk||am.out,noammo:am.out,why:busy?"Attack is single-fleet \u2014 clear wings":(!hasAtk?"Nothing in range to attack":(am.out?"Out of ammo \u2014 restock":""))},
      {id:"mine",lb:"Mine",ico:"mine",fwd:1,dim:busy||!hasSec,why:busy?"Mine is single-fleet \u2014 clear wings":(!hasSec?"Mine needs an asteroid field":"")},
      {id:"scan",lb:"Scan",ico:"scan",hk:m.scan||"C",dim:busy,why:busy?"Scan is single-fleet \u2014 clear wings":""},
      {id:"lock",lb:"Lock",ico:"lock",dim:!1,why:""},
      {id:"destruct",lb:"Destruct",ico:"destruct",fwd:1,cls:"danger",dim:!hasSec,why:!hasSec?"Destruct needs a station":""}
    ];
    actions.forEach(function(a){
      var isBusy=!!(pendingTx&&pendingTx.action===a.id);
      var b=document.createElement("button");b.type="button";
      b.className="sa-tile"+(a.cls?" "+a.cls:"")+(a.dim?" dim":"")+(a.on?" on":"")+(isBusy?" busy":"")+(a.noammo?" no-ammo":"")+(captureAction===a.id?" capturing":"");
      b.dataset.act=a.id;
      var hk=(a.hk||captureAction===a.id)?'<span class="hk">'+(captureAction===a.id?"\u2026":a.hk)+"</span>":"";
      b.innerHTML=ico(a.ico)+'<span>'+a.lb+'</span>'+hk+(isBusy?'<span class="sa-hg"><span class="clk"></span></span>':'');
      b.title=a.dim&&a.why?("\u26d4 "+a.why):"";
      b.onclick=function(){if(a.dim){if(a.why)notifyBlock(a.lb+" unavailable",a.why);return}run(a.id)};
      b.ondblclick=function(e){e.preventDefault();if(a.dim)return;captureAction=a.id==="swarp"?"subwarp":a.id==="atk"?"attack":a.id;if(window.__SA_HOTKEYS__)window.__SA_HOTKEYS__.setCapture(captureAction);paint()};
      actsEl.appendChild(b);
    });
    (function(){
      function notch(actId,cls,txt,title){
        var old=actsEl.querySelector('.sa-notch[data-for="'+actId+'"]');if(old)old.remove();
        if(!cls)return;
        var tile=actsEl.querySelector('[data-act="'+actId+'"]');if(!tile)return;
        var el=document.createElement("div");el.className="sa-notch "+cls;el.setAttribute("data-for",actId);
        el.style.width=Math.max(30,tile.offsetWidth-10)+"px";
        el.style.left=(tile.offsetLeft+5)+"px";
        el.innerHTML='<span class="bulb"></span><span class="txt">'+txt+"</span>";
        el.title=title||"";
        actsEl.appendChild(el);
      }
      var am=ammoState();
      notch("atk",am.out?"out":am.low?"low":"",am.out?"Ammo":am.low?"Low":"",am.out?"OUT OF AMMO \u2014 restock at a station":am.low?"LOW AMMO":"");
      var atk=actsEl.querySelector('[data-act="atk"]');if(atk)atk.classList.toggle("no-ammo",!!am.out);
      var fsL=fuelState();
      notch("warp",fsL.allOut?"fuelout":fsL.low?"fuellow":"",fsL.allOut?"Fuel":fsL.low?"Fuel":"",fsL.allOut?"OUT OF FUEL \u2014 refuel at a station":fsL.low?"LOW FUEL":"");
      var w1=actsEl.querySelector('[data-act="warp"]'),w2=actsEl.querySelector('[data-act="swarp"]');
      if(w1)w1.classList.toggle("no-fuel",!!fsL.allOut);
      if(w2)w2.classList.toggle("no-fuel",!!fsL.allOut);
    })();
  }
  function onKey(e){
    if(e.target&&(e.target.closest&&e.target.closest("input,textarea,select,[contenteditable=true]")||e.target.isContentEditable))return;
    if(!isBarVisible()){
      // Bar OFF: leave stock click-fleet + map pick; only cancel extension wing pick if active
      if(e.key==="Escape"){try{if(window.__SA_WING_PICK__&&window.__SA_WING_PICK__.get&&window.__SA_WING_PICK__.get())window.__SA_WING_PICK__.stop()}catch(err){}try{var mov=window.__SA_MOVEMENT__;if(mov&&mov.cancel&&mov.getState&&mov.getState().active)mov.cancel()}catch(err){}return}
      return;
    }
    var h=window.__SA_HOTKEYS__;
    if(h&&h.isCapture()){e.preventDefault();e.stopPropagation();var n=h.norm(e);if(!n)return;var act=captureAction;captureAction=null;h.setCapture(null);if(act)h.bind(act,n);paint();return}
    if(e.key==="Escape"){
      e.preventDefault();
      clearSelection();
      return;
    }
    if(!e.altKey&&e.key==="0"){
      try{
        var tg=window.__SA_FLEET_GROUPS__.getTempGroup&&window.__SA_FLEET_GROUPS__.getTempGroup();
        if(tg&&tg.fleetKeys&&tg.fleetKeys.length){
          e.preventDefault();
          selectWing(tg.id,{ctrlKey:!!e.ctrlKey,metaKey:!!e.metaKey});
          return;
        }
      }catch(err){}
    }
    if(!e.altKey&&e.key>="1"&&e.key<="5"){
      var idx=parseInt(e.key,10)-1;
      var durable=[];
      try{durable=window.__SA_FLEET_GROUPS__.getDurableGroups?window.__SA_FLEET_GROUPS__.getDurableGroups():wingList().filter(function(g){return !g.temporary})}catch(err){}
      var gs=durable;
      if(gs[idx]&&gs[idx].fleetKeys&&gs[idx].fleetKeys.length){
        e.preventDefault();
        selectWing(gs[idx].id,{ctrlKey:!!e.ctrlKey,metaKey:!!e.metaKey});
        return;
      }
      if(gs[idx]&&!e.ctrlKey&&!e.metaKey){e.preventDefault();openGroups();return}
    }
    if(!h)return;
    var m=h.get();
    [["stop","cancel"],["attack","atk"],["scan","scan"],["groups","groups"],["warp","warp"],["subwarp","swarp"]].forEach(function(pair){
      var bind=pair[0],act=pair[1];
      if(m[bind]&&h.match(e,m[bind])){
        if(bind==="subwarp"&&(e.code==="Space"||e.key===" ")&&!e.shiftKey)return;
        if(bind==="warp"&&(e.code==="Space"||e.key===" ")&&e.shiftKey)return;
        e.preventDefault();run(act);
      }
    });
  }
  function boot(){if(!document.body){setTimeout(boot,200);return}if(isBarVisible()){ensure();paint()}window.addEventListener("keydown",onKey,true);setInterval(function(){try{if(isBarVisible())paint()}catch(e){}},900)}
  setTimeout(boot,1600);
  return{paint:paint,run:run,openGroups:openGroups,selectWing:selectWing,clearSelection:clearSelection,getActiveWings:function(){return activeWingIds.slice()},isVisible:isBarVisible,setVisible:setBarVisible,show:function(){return setBarVisible(!0)},hide:function(){return setBarVisible(!1)}};
})();

window.__SA_FLEET_LOCKS__=window.__SA_FLEET_LOCKS__||(function(){
  var KEY="saFleetLocks.v1",wrap=null,locks=[];
  try{locks=JSON.parse(localStorage.getItem(KEY)||"[]")||[]}catch(e){}
  function save(){try{localStorage.setItem(KEY,JSON.stringify(locks))}catch(e){}}
  function css(){if(document.getElementById("sa-lk-style"))return;var st=document.createElement("style");st.id="sa-lk-style";st.textContent=""
+"#sa-fleet-locks{position:fixed;inset:0;pointer-events:none;z-index:999988}"
+".sa-lock-plate{position:absolute;pointer-events:auto;min-width:120px;max-width:170px;padding:6px 16px 6px 8px;background:#0d1117;border:1px solid rgba(255,190,77,.4);border-radius:4px;cursor:grab;font-family:Orbitron,ui-sans-serif,sans-serif;color:#e8d9a8;box-shadow:0 8px 20px rgba(0,0,0,.5)}"
+".sa-lock-plate.friendly{border-color:rgba(52,255,136,.45)}"
+".sa-lock-plate.enemy{border-color:rgba(255,100,100,.55)}"
+".sa-lock-plate .lp-nm{font-size:10px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}"
+".sa-lock-plate .lp-tag{font-size:8px;font-weight:800;letter-spacing:.08em;text-transform:uppercase}"
+".sa-lock-plate .lp-x{position:absolute;top:1px;right:4px;color:#888;cursor:pointer;font-size:12px;line-height:1}"
+".sa-lock-plate .lp-x:hover{color:#f87171}";
    document.documentElement.appendChild(st)}
  function ensure(){if(wrap)return;css();wrap=document.createElement("div");wrap.id="sa-fleet-locks";saIsolate(wrap);document.body.appendChild(wrap)}
  function render(){if(!wrap)return;wrap.innerHTML="";locks.forEach(function(L,i){
    var pl=document.createElement("div");pl.className="sa-lock-plate "+(L.kind||"friendly");
    pl.style.left=(L.x!=null?L.x:window.innerWidth-190)+"px";pl.style.top=(L.y!=null?L.y:80+i*44)+"px";
    pl.innerHTML='<span class="lp-x" title="Unlock">\u00d7</span><div class="lp-nm"></div><div class="lp-tag" style="color:'+(L.kind==="enemy"?"#ff6b6b":"#34ff88")+'">'+(L.kind==="enemy"?"ENEMY \u00b7 ATTACK":"FRIEND \u00b7 HEAL")+'</div>';
    pl.querySelector(".lp-nm").textContent=L.label||String(L.key).slice(0,10);
    pl.querySelector(".lp-x").onclick=function(e){e.stopPropagation();locks=locks.filter(function(x){return x.key!==L.key});save();render()};
    (function(plate,rec){var drag=!1,sx=0,sy=0,ox=0,oy=0;
      plate.addEventListener("pointerdown",function(e){if(e.target&&e.target.classList&&e.target.classList.contains("lp-x"))return;if(e.button!==0)return;drag=!0;sx=e.clientX;sy=e.clientY;ox=plate.offsetLeft;oy=plate.offsetTop;try{plate.setPointerCapture(e.pointerId)}catch(_){}e.preventDefault();e.stopPropagation()});
      plate.addEventListener("pointermove",function(e){if(!drag)return;plate.style.left=(ox+e.clientX-sx)+"px";plate.style.top=(oy+e.clientY-sy)+"px"});
      var up=function(){if(!drag)return;drag=!1;rec.x=plate.offsetLeft;rec.y=plate.offsetTop;save()};
      plate.addEventListener("pointerup",up);plate.addEventListener("pointercancel",up);
    })(pl,L);
    wrap.appendChild(pl);});}
  function lock(key,label,kind){ensure();if(!locks.some(function(x){return x.key===key}))locks.push({key:key,label:label,kind:kind,x:null,y:null});save();render();}
  function unlock(key){locks=locks.filter(function(x){return x.key!==key});save();render();}
  function boot(){if(!document.body){setTimeout(boot,400);return}ensure();render()}
  setTimeout(boot,2400);
  return{lock:lock,unlock:unlock,list:function(){return locks.slice()},render:render};
})();
window.__SA_FLEET_TABLE__=window.__SA_FLEET_TABLE__||(function(){
  var root=null;
  function css(){if(document.getElementById("sa-ft-style"))return;var st=document.createElement("style");st.id="sa-ft-style";st.textContent=""
+"#sa-fleet-table{position:fixed;right:12px;top:70px;z-index:999989;width:250px;max-height:60vh;display:flex;flex-direction:column;pointer-events:auto;background:#0d1117;border:1px solid rgba(255,190,77,.4);border-radius:6px;box-shadow:0 16px 40px rgba(0,0,0,.6);font-family:Orbitron,ui-sans-serif,system-ui,sans-serif;overflow:hidden}"
+"#sa-fleet-table .ft-h{display:flex;align-items:center;justify-content:space-between;padding:8px 10px;border-bottom:1px solid rgba(255,190,77,.2);background:rgba(255,190,77,.06);color:#ffbe4d;font:800 10px Orbitron,sans-serif;letter-spacing:.12em;text-transform:uppercase}"
+"#sa-fleet-table .ft-h button{appearance:none;border:none;background:transparent;color:#888;font-size:14px;cursor:pointer}"
+"#sa-fleet-table .ft-b{overflow:auto;padding:6px;scrollbar-width:thin;scrollbar-color:rgba(255,190,77,.4) transparent}"
+"#sa-fleet-table .row{display:flex;align-items:center;gap:8px;padding:6px 8px;border-radius:3px;cursor:pointer;border:1px solid transparent}"
+"#sa-fleet-table .row:hover{background:rgba(255,190,77,.08)}"
+"#sa-fleet-table .row.sel{border-color:rgba(255,190,77,.6);background:rgba(255,190,77,.12)}"
+"#sa-fleet-table .row .nm{flex:1;min-width:0;color:#f0ebe0;font-size:10px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}"
+"#sa-fleet-table .row .st{font-size:8px;font-weight:800;letter-spacing:.05em;text-transform:uppercase}"
+"#sa-fleet-table .row .fu{width:34px;height:4px;background:rgba(255,255,255,.08);border-radius:2px;overflow:hidden;flex-shrink:0}"
+"#sa-fleet-table .row .fu i{display:block;height:100%}";
    document.documentElement.appendChild(st)}
  function fleets(){var out=[];try{var p=window.__SA_PEEK_FLEETS__;var all=typeof p==="function"?p():[];var profile=window.__SA_PLAYER_PROFILE__;if(!profile){try{var sel=window.__SA_SELECTED_FLEET__;if(sel&&sel.key){for(var i=0;i<all.length;i++){if(String(all[i].address)===String(sel.key)&&all[i].data&&all[i].data.ownerProfile){profile=all[i].data.ownerProfile;window.__SA_PLAYER_PROFILE__=profile;break}}}}catch(e){}}for(var j=0;j<all.length;j++){var f=all[j];if(!f)continue;var owner=f.data&&f.data.ownerProfile;if(!profile)continue;if(owner&&String(owner)!==String(profile))continue;out.push(f)}}catch(e){}return out}
  function stateInfo(st){st=String(st||"");if(/Dock|LoadingBay/i.test(st))return["DOCKED","#00D4FF"];if(/MoveWarp|MoveSubwarp/i.test(st))return["MOVING","#FF6B35"];if(/Mine/i.test(st))return["MINING","#00FF88"];if(/Scan/i.test(st))return["SCAN","#A855F7"];if(/Destroyed|Respawn/i.test(st))return["LOST","#FF4444"];return["IDLE","#FFB800"]}
  function render(){if(!root)return;var body=root.querySelector(".ft-b");body.innerHTML="";var sel=null;try{sel=window.__SA_SELECTED_FLEET__&&window.__SA_SELECTED_FLEET__.key}catch(e){}
    fleets().forEach(function(f){var d=f.data||{};var key=String(f.address||f.key);var st=(d.state&&(d.state.__kind||d.state.kind))||"?";var si=stateInfo(st);
      var fu=0;try{var stt=d.stats||{};var fc=Number(stt.fuelCurrent),fcap=Number(stt.totalFuelCapacity);if(Number.isFinite(fc)&&Number.isFinite(fcap)&&fcap>0)fu=Math.max(0,Math.min(1,fc/fcap))}catch(e){}
      var row=document.createElement("div");row.className="row"+(sel===key?" sel":"");
      row.innerHTML='<span class="nm"></span><span class="st" style="color:'+si[1]+'">'+si[0]+'</span><span class="fu"><i style="width:'+Math.round(fu*100)+'%;background:'+(fu<=0.15?"#ff4040":fu<=0.4?"#ffb020":"#fbbf24")+'"></i></span>';
      row.querySelector(".nm").textContent=d.fleetLabel||key.slice(0,10);
      row.title=(d.fleetLabel||key)+" \u00b7 "+st+" \u00b7 fuel "+Math.round(fu*100)+"% \u00b7 dbl-click focus";
      row.ondblclick=function(){focusFleet(f,key)};
      body.appendChild(row);});}
  function focusFleet(f,key){
    try{var d=f.data||{},loc=d.location,px=null;if(loc&&loc[0]!=null){var x=Number(loc[0]),y=Number(loc[1]);if(Math.abs(x)>1e5){x/=1e9;y/=1e9}px=saGameToPixel(x,y)}var vp=window.__SA_MAP_VIEWPORT__;if(px&&vp&&typeof vp.center==="function")vp.center(px.x,px.y)}catch(e){}
    try{var fg=window.__SA_FLEET_GROUPS__;if(fg&&fg.setTempFleets)fg.setTempFleets([key],{})}catch(e){}
    render();}
  function show(){if(root){root.style.display="";render();return}css();root=document.createElement("div");root.id="sa-fleet-table";saIsolate(root);root.setAttribute("data-fc-floating-utility","true");
    root.innerHTML='<div class="ft-h"><span>Fleets</span><button type="button" data-a="close" title="Hide">\u00d7</button></div><div class="ft-b"></div>';
    root.querySelector('[data-a="close"]').onclick=function(){root.style.display="none"};
    document.body.appendChild(root);render();}
  function boot(){if(!document.body){setTimeout(boot,400);return}setInterval(function(){try{if(window.__SA_IN_GAME&&window.__SA_IN_GAME()){if(!root)show();else if(root.style.display!=="none")render()}}catch(e){}},1500)}
  setTimeout(boot,2200);
  return{show:show,render:render};
})();
window.__SA_PANEL_TWEAKS__=window.__SA_PANEL_TWEAKS__||(function(){
  function css(){if(document.getElementById("sa-panel-style"))return;var st=document.createElement("style");st.id="sa-panel-style";st.textContent=""
+"[class*='plannerPanel']{top:60px!important;bottom:auto!important}"
+"[class*='plannerRail']{top:60px!important;bottom:auto!important}"
+"[class*='fleetActionBar']{display:none!important}"
+"[class*='supportTileGrid']{gap:6px!important}"
+"[class*='supportTile_']{min-height:0!important;height:46px!important;padding:6px 8px!important;position:relative;overflow:hidden;box-sizing:border-box}"
+"[class*='supportTile_'] svg{width:13px!important;height:13px!important}"
+"[class*='headerLeading']{background:rgba(5,8,12,.55);border-radius:6px;padding:2px 10px}"
+"[class*='dominionHeaderBarContainer']{background:rgba(5,8,12,.55);border-radius:6px;padding:2px 10px;min-width:0}"
+"[class*='secondaryActionsCluster']{background:rgba(5,8,12,.55);border-radius:6px;padding:2px 8px}"
+"[class*='accountCard']{background:rgba(5,8,12,.55)!important;border-radius:6px}"
+"[class*='globalHeaderContainer']{gap:10px;flex-wrap:nowrap}"
+"[class*='dominionChipRow']{flex-wrap:nowrap;gap:6px;min-width:0}"
+"[class*='dominionChip']{flex:0 1 auto;min-width:0}"
+"[class*='headerLogoWrapper']{width:30px;height:30px;flex:0 0 30px;background:url('data:image/svg+xml;utf8,<svg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 32 32%27><path d=%27M16 3 L27 27 H21.5 L16 14.5 L10.5 27 H5 Z%27 fill=%27%23f4f0e0%27/></svg>') center/contain no-repeat}"
+"[class*='headerLogoWrapper'] svg,[class*='headerLogoWrapper'] img{display:none}"
+"[class*='notificationStack_']{top:60px!important;bottom:auto!important;right:16px!important;left:auto!important;transform:none!important;max-height:calc(100vh - 140px);overflow-y:auto}"
+"[class*='supportTile_'].sa-sup-crit{animation:saSupPulse 1s ease-in-out infinite;border:1px solid rgba(255,80,80,.9)!important}"
+"[class*='supportTile_'].sa-sup-low{border:1px solid rgba(255,176,32,.6)!important}"
+"@keyframes saSupPulse{0%,100%{box-shadow:0 0 3px rgba(255,64,64,.25)}50%{box-shadow:0 0 16px rgba(255,64,64,.85)}}"
+"[aria-label='Open Movement Planner']{display:none!important}"
+"[class*='fleetStoreChipGrid']{gap:4px!important}"
+"[class*='fleetStoreChip_']{min-height:0!important;height:46px!important;padding:4px 6px!important;position:relative;overflow:hidden;box-sizing:border-box}"
+"[class*='fleetStoreChip_'] [class*='fleetStoreChipIcon']{width:13px!important;height:13px!important}"
+"[class*='fleetStoreChip_'].sa-sup-crit{animation:saSupPulse 1s ease-in-out infinite;border:1px solid rgba(255,80,80,.9)!important}"
+"[class*='fleetStoreChip_'].sa-sup-low{border:1px solid rgba(255,176,32,.6)!important}"
+"[class*='headerLogoWrapper']{display:none!important}"
+"[class*='headerLeading']{background:none;padding:0}"
+"[class*='dominionHeaderBarContainer']{background:none;padding:0}"
+"[class*='secondaryActionsCluster']{background:none;padding:0}"
+"[class*='accountCard']{background:none!important}"
+"[class*='globalHeaderContainer'] button,[class*='headerEchoMain'] button,[class*='secondaryActionsCluster'] a{background:#0d1117!important;border:1px solid rgba(255,190,77,.28)!important;border-radius:6px;color:#e8d9a8!important}"
+"[class*='globalHeaderContainer'] button svg,[class*='headerEchoMain'] button svg{stroke:#e8d9a8}"
+"[class*='globalHeaderContainer'] a,[class*='headerEchoMain'] a{background:#0d1117!important;border:1px solid rgba(255,190,77,.28)!important;border-radius:6px;color:#e8d9a8!important}"
+"[class*='globalHeaderContainer'] [role='button'],[class*='headerEchoMain'] [role='button']{background:#0d1117!important;border:1px solid rgba(255,190,77,.28)!important;border-radius:6px;color:#e8d9a8!important}"
+"[class*='dominionHeaderBarContainer']{width:fit-content!important;flex:0 1 auto;min-width:0;padding-left:8px}"
+"[class*='dominionChipRow']{width:auto!important;flex-wrap:nowrap;gap:6px}"
+"[class*='dominionSection']{padding-left:6px}"
+"[class*='floatingChip']{flex:0 0 auto}"
+"#sa-action-bar .sa-notch{position:absolute;top:-13px;height:15px;background:#000;border:none;border-radius:8px 8px 0 0;display:flex;align-items:center;justify-content:center;gap:5px;z-index:3;pointer-events:auto;cursor:help}"
+"#sa-action-bar .sa-notch .bulb{width:7px;height:7px;transform:rotate(45deg)}"
+"#sa-action-bar .sa-notch .txt{font:800 7px Orbitron,sans-serif;letter-spacing:.12em;text-transform:uppercase}"
+"#sa-action-bar .sa-notch.out .bulb,#sa-action-bar .sa-notch.fuelout .bulb{background:#ff2b2b;box-shadow:0 0 8px rgba(255,40,40,.9)}"
+"#sa-action-bar .sa-notch.out .txt,#sa-action-bar .sa-notch.fuelout .txt{color:#ff6b6b}"
+"#sa-action-bar .sa-notch.low .bulb{background:#ffb020;box-shadow:0 0 6px rgba(255,176,32,.8)}"
+"#sa-action-bar .sa-notch.low .txt{color:#ffb020}"
+"#sa-action-bar .sa-notch.fuellow .bulb{background:#38b6ff;box-shadow:0 0 6px rgba(56,182,255,.8)}"
+"#sa-action-bar .sa-notch.fuellow .txt{color:#38b6ff}"
+"#sa-action-bar .sa-lamp-row{margin:0 0 -8px!important}"
+"#sa-action-bar .sa-lamp-row .sa-lamp{border-radius:12px 12px 0 0!important;border-bottom:none!important;border-top:1px solid rgba(255,190,77,.35)!important}"
;document.documentElement.appendChild(st)}
  function nums(t){var out=[],cur="";for(var i=0;i<t.length;i++){var c=t[i];if((c>="0"&&c<="9")||c===","){cur+=c}else{if(cur){out.push(parseFloat(cur.split(",").join("")));cur=""}}}if(cur)out.push(parseFloat(cur.split(",").join("")));return out}
  function decorate(t,cur,cap){
    var pct=cap>0?Math.max(0,Math.min(1,cur/cap)):0;
    var bar=t.querySelector("[data-sa-fill]");
    if(!bar){
      bar=document.createElement("div");bar.setAttribute("data-sa-fill","1");
      bar.style.cssText="position:absolute;left:0;bottom:0;height:3px;width:100%;background:rgba(0,0,0,.55);pointer-events:none;z-index:2";
      var f=document.createElement("i");f.style.cssText="display:block;height:100%;width:0";
      bar.appendChild(f);t.appendChild(bar);
      var p=document.createElement("span");p.setAttribute("data-sa-pct","1");
      p.style.cssText="position:absolute;right:6px;bottom:4px;font:700 9px Orbitron,sans-serif;letter-spacing:.06em;color:rgba(255,190,77,.9);pointer-events:none;z-index:2";
      t.appendChild(p);
    }
    var col=pct<=0.15?"#ff4040":pct<=0.4?"#ffb020":"#ffbe4d";
    bar.firstChild.style.width=Math.round(pct*100)+"%";
    bar.firstChild.style.background=col;
    bar.firstChild.style.boxShadow="0 0 6px "+col;
    var critOn=cap>0&&pct<=0.15,lowOn=cap>0&&pct>0.15&&pct<=0.4;
    t.classList.toggle("sa-sup-crit",critOn);
    t.classList.toggle("sa-sup-low",lowOn);
    var p2=t.querySelector("[data-sa-pct]");if(p2){p2.textContent=cap>0?Math.round(pct*100)+"%":"";p2.style.color=critOn?"#ff6b6b":lowOn?"#ffb020":"rgba(255,190,77,.9)"}
  }
  function compactTiles(){
    var g1=document.querySelector('[class*="supportTileGrid"]');
    if(g1){var t1=g1.querySelectorAll('[class*="supportTile_"]');
      for(var i=0;i<t1.length;i++){var txt=t1[i].textContent||"";var all=nums(txt);var cur=all.length?all[0]:0;var cap=0;var mi=txt.toUpperCase().indexOf("MAX");if(mi>=0){var mn=nums(txt.slice(mi));if(mn.length)cap=mn[0]}decorate(t1[i],cur,cap)}}
    var g2=document.querySelector('[class*="fleetStoreChipGrid"]');
    if(g2){var t2=g2.querySelectorAll('[class*="fleetStoreChip_"]');
      for(var j=0;j<t2.length;j++){var t=t2[j];var rc=t.querySelector('[class*="fleetStoreChipRawCurrent"]');var rt=t.querySelector('[class*="fleetStoreChipRawTotal"]');var cur=rc?parseFloat(String(rc.textContent||"").replace(/,/g,"")):0;var cap=rt?parseFloat(String(rt.textContent||"").replace(/,/g,"")):0;if(!Number.isFinite(cur))cur=0;if(!Number.isFinite(cap))cap=0;decorate(t,cur,cap)}}
  }
  function boot(){if(!document.body){setTimeout(boot,400);return}css();setInterval(function(){try{compactTiles()}catch(e){}},1200)}
  setTimeout(boot,1600);
  return{refresh:compactTiles};
})();

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
    slog("info", "⚔️", "combat log + hit/miss HUD · recorder → __SA_COMBAT_RECORDER__.dump()");
    slog("info", "🗺️", "map debug → __SA_MAP_DEBUG__.on() / .off()  ·  popup toggle  ·  ?saMapDebug=1");
    slog("info", "🚀", "warp trails → __SA_WARP_TRAILS__.enable() / .disable()  ·  popup toggle  ·  localStorage saNoWarpTrails");
    slog("info", "🔎", "zoom hud → __SA_ZOOM_HUD__.on() / .off()  ·  popup toggle  ·  localStorage saZoomHud");

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
