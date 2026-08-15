/** SAGE UI Fixes v2 patches. Pinned to live 0.0.355 / assets/index-DY7IU6C2.js (2026-08-14).
 * Each `find` must occur exactly once in the minified entry or the patch is skipped.
 * LEEKS / Produce Bandit ltd
 */
globalThis.__SA_PATCHES__ = [
  {
    id: "destroyed-pin",
    find: 'if(mt==="Docked"||mt==="StarbaseLoadingBay"||mt==="Respawn"){',
    replace:
      'if(mt==="Docked"||mt==="StarbaseLoadingBay"||mt==="Respawn"||mt==="Destroyed"){',
  },
  {
    id: "nearby-dead-filter",
    find: "return ee.nearbyFleets.filter(Bc=>{const Xd=yc(hl,Rc,Bc.coordinates[0],Bc.coordinates[1])<=Tc,sc=toFactionEnum(Bc.faction),fc=sc!==pi&&!(pi===w.Unaligned&&sc===w.Unaligned),fd=String(Bc.fleetKey)!==String(ee.fleetData?.fleetKey);return Xd&&fc&&fd})",
    replace:
      'return ee.nearbyFleets.filter(Bc=>{const Xd=yc(hl,Rc,Bc.coordinates[0],Bc.coordinates[1])<=Tc,sc=toFactionEnum(Bc.faction),fc=sc!==pi&&!(pi===w.Unaligned&&sc===w.Unaligned),fd=String(Bc.fleetKey)!==String(ee.fleetData?.fleetKey),dead=Bc.fleetAccount?.data?.state?.__kind==="Destroyed"||Number(Bc.fleetAccount?.data?.hp??0)<=0;return Xd&&fc&&fd&&!dead})',
  },
  {
    id: "starbase-hp-bar",
    find: "if(Qc){const gu=Qc.hp+Qc.pendingHp;Wd=gu>0?Qc.hp/gu:0}",
    replace:
      "if(Qc){const gu=Math.max(1,520+Number(Qc.level||0)*180);Wd=Math.min(1,Math.max(0,Number(Qc.hp||0)/gu))}",
  },
  {
    id: "fingerprint-hp",
    find: "Object.values(Jc).map(_c=>`${_c.name}@${_c.coordinates[0]},${_c.coordinates[1]}:${_c.owner??\"none\"}:L${_c.starbaseLevel??0}:${_c.core?\"core\":\"not\"}:${_c.planetCount}:${_c.asteroidCount}:${(_c.stars??[]).length}`)",
    replace:
      "Object.values(Jc).map(_c=>`${_c.name}@${_c.coordinates[0]},${_c.coordinates[1]}:${_c.owner??\"none\"}:L${_c.starbaseLevel??0}:H${((_c.starbaseHpFraction??0)*100)|0}:${_c.core?\"core\":\"not\"}:${_c.planetCount}:${_c.asteroidCount}:${(_c.stars??[]).length}`)",
  },
  {
    id: "resolve-display-owner",
    find: "function resolveDisplayOwner(ee,Se,nt,at){const mt=nt.get(String(ee));return mt&&at.hasStarbase&&String(mt.gameId)===String(at.gameId)&&mt.capturedSeqId===at.systemSeqId&&mt.controllingFaction>0?mt.controllingFaction:Se}",
    replace:
      "function resolveDisplayOwner(ee,Se,nt,at){const mt=nt.get(String(ee));const f=mt!=null?Number(mt.controllingFaction):NaN;return mt&&at.hasStarbase&&String(mt.gameId)===String(at.gameId)&&(f===1||f===2||f===3)?f:Se}",
  },
  {
    id: "owner-panel-memo",
    find: "It=createMemo(()=>ee.system?.owner??w.Unaligned)",
    replace:
      "It=createMemo(()=>{const gn=ee.system;if(!gn)return w.Unaligned;const Jr=gn._systemId;const Sn=Jr!=null?(Se.state.map?.systems?.[Jr]??Se.state.map?.systems?.[String(Jr)]):null;return Sn?.owner??gn.owner??w.Unaligned})",
  },
  {
    id: "warp-trail-gate",
    find: "createWarpTrail(Se,nt,at){this.destroyWarpTrail(),",
    replace:
      "createWarpTrail(Se,nt,at){if(window.__SA_NO_WARP_TRAILS__)return;this.destroyWarpTrail(),",
  },
  {
    id: "glow-size",
    find: "GLOW:{SIZE_MULTIPLIER:14,ALPHA:.15,BASE_ALPHA:.08,PULSE_ALPHA_RANGE:.05}",
    replace: "GLOW:{SIZE_MULTIPLIER:3,ALPHA:.05,BASE_ALPHA:.02,PULSE_ALPHA_RANGE:.012}",
  },
  {
    id: "glow-pulse-cap",
    find: "Ct.starGlow.alpha=SYSTEM_STAR_CONFIG.GLOW.BASE_ALPHA+$t*SYSTEM_STAR_CONFIG.GLOW.PULSE_ALPHA_RANGE",
    replace:
      "Ct.starGlow.alpha=Math.min(.04,SYSTEM_STAR_CONFIG.GLOW.BASE_ALPHA+$t*SYSTEM_STAR_CONFIG.GLOW.PULSE_ALPHA_RANGE)",
  },
  {
    id: "glow-create-alpha",
    find: '$n.alpha=SYSTEM_STAR_CONFIG.GLOW.ALPHA,$n.blendMode="add",$n.zIndex=10,Nn.addChild($n),Nn._starGlow=$n',
    replace:
      '$n.alpha=Math.min(.05,SYSTEM_STAR_CONFIG.GLOW.ALPHA),$n.blendMode="add",$n.zIndex=10,Nn.addChild($n),Nn._starGlow=$n',
  },
  {
    id: "detail-glow-base",
    find: "GLOW_BASE_ALPHA:.45,GLOW_PULSE_RANGE:.15",
    replace: "GLOW_BASE_ALPHA:.08,GLOW_PULSE_RANGE:.04",
  },
  {
    id: "detail-outer-glow",
    find: 'Es=Math.max(SYSTEM_DETAIL_CONFIG.STAR.GLOW_RADIUS*4,Et*4.65)*Zr.glowRadiusMultiplier*vr/yr,$s.scale.set(Es,Es*vt),$s.tint=new Color(Kt).toNumber(),Ms=Math.min(.56,SYSTEM_DETAIL_CONFIG.STAR.GLOW_BASE_ALPHA*1.02*Zr.glowAlphaMultiplier),$s.alpha=Ms*.72,$s.blendMode="screen"',
    replace:
      'Es=Math.max(SYSTEM_DETAIL_CONFIG.STAR.GLOW_RADIUS*1.45,Et*1.7)*Zr.glowRadiusMultiplier*vr/yr,$s.scale.set(Es,Es*vt),$s.tint=new Color(Kt).toNumber(),Ms=Math.min(.1,SYSTEM_DETAIL_CONFIG.STAR.GLOW_BASE_ALPHA*.22*Zr.glowAlphaMultiplier),$s.alpha=Ms*.22,$s.blendMode="screen"',
  },
  {
    id: "culler-gate",
    find: "const tempBounds=new Bounds,_Culler=class{cull(Se,nt,at=!0){this._cullRecursive(Se,nt,at)}",
    replace:
      "const tempBounds=new Bounds,_Culler=class{cull(Se,nt,at=!0){if(window.__SA_FORCE_CULL__!==!0&&!window.__SA_ANY_CULLABLE__)return;this._cullRecursive(Se,nt,at)}",
  },
  {
    id: "cullable-accessor",
    find: "const cullingMixin={cullArea:null,cullable:!1,cullableChildren:!0};",
    replace:
      "const cullingMixin={cullArea:null,get cullable(){return this._saCullable===!0},set cullable(_v){this._saCullable=_v===!0,_v===!0&&(window.__SA_ANY_CULLABLE__=!0)},cullableChildren:!0};",
  },
  {
    id: "startup-debug-idle",
    find: 'createEffect(()=>{const At="EKEj47SzaCjPM3m4T4vRXrrsVtkEmiNgPMMFye3AkXj4",It=nt.get("games").map(Ft=>Ft.address).sort()',
    replace:
      'createEffect(()=>{if(!(typeof isStartupDebugEnabled=="function"&&isStartupDebugEnabled()))return;const At="EKEj47SzaCjPM3m4T4vRXrrsVtkEmiNgPMMFye3AkXj4",It=nt.get("games").map(Ft=>Ft.address).sort()',
  },
  {
    id: "systems-memo",
    find: "const pn=Hn.reduce((Dr,po)=>(Dr.set(po.address,{...po.data,key:po.address}),Dr),new Map)",
    replace:
      'const pn=typeof __saSysMemo=="function"?__saSysMemo():Hn.reduce((Dr,po)=>(Dr.set(po.address,{...po.data,key:po.address}),Dr),new Map)',
  },
  {
    id: "regions-memo",
    find: "regions:wn.flatMap(Dr=>Dr.data.regions.unsizedList)",
    replace:
      'regions:typeof __saRegionMemo=="function"?__saRegionMemo():wn.flatMap(Dr=>Dr.data.regions.unsizedList)',
  },
  {
    id: "post-attack-poll",
    find: "const POST_ATTACK_POLL_DELAYS_MS=[2e3,5e3,1e4]",
    replace: "const POST_ATTACK_POLL_DELAYS_MS=[1500,6e3]",
  },
  {
    id: "pin-retint",
    find: "if(!shouldRecreateStarSystemVisuals(Ht,po,pa))continue;Ht.parent?.removeChild(Ht),Ht.destroy({children:!0}),Rt(ra=>{const si=new Map(ra);return si.delete(Lt),si})}",
    replace:
      "if(!shouldRecreateStarSystemVisuals(Ht,po,pa))continue;Ht._systemOwner=po;Ht._baseSize=pa;const _saT=cachedColorNumber(getFactionColorFromOwner(Ft.owner));if(Ht._starGlow){Ht._starGlow.tint=_saT;Ht._starGlow.alpha=.04}if(Ht._starCore)Ht._starCore.tint=_saT;if(Ht._softHalo)Ht._softHalo.tint=_saT;continue}",
  },
  {
    id: "update-detail-faction",
    find: "updateDetailFaction(Se,nt){const at=FACTION_COLORS[nt]||FACTION_COLORS.DEFAULT_GLOW;for(const St of Se.warpLanes||[])St.container&&St.container.parent&&St.container.parent.removeChild(St.container),St.container.destroy({children:!0});for(const St of Se.warpGates||[]){for(const Ct of St.clouds||[])Ct.sprite&&Ct.sprite.parent&&Ct.sprite.parent.removeChild(Ct.sprite),Ct.sprite.destroy();St.sprite&&St.sprite.parent&&St.sprite.parent.removeChild(St.sprite),St.sprite.destroy()}const mt=(Se.planets.length+Se.asteroidBelts.length)*SYSTEM_DETAIL_CONFIG.PLANET.ORBIT_SPACING+SYSTEM_DETAIL_CONFIG.PLANET.MIN_ORBIT_RADIUS,ft=.6,ht=Se.system._systemId||Se.system.name,vt=this.createWarpConnections(Se.system,ht,nt,at,Se.container,Se.centerX,Se.centerY,mt,ft);Se.warpGates=vt.warpGates,Se.warpLanes=vt.warpLanes,this.moveStarGlowsToTop(Se.container,Se.stars),Se.faction=nt}",
    replace:
      'updateDetailFaction(Se,nt){const sys=Se.system,cx=Se.centerX,cy=Se.centerY,key=Se.systemKey,vis=!!Se.isVisible,alpha=Se.container&&Se.container.alpha,tp=Se.transitionProgress,parent=Se.container&&Se.container.parent;this.removeDetailView(Se),this.activeDetails.delete(key);const ht=this.createDetailView(sys,cx,cy,nt,key);this.activeDetails.set(key,ht),(parent||this.viewport).addChild(ht.container),vis&&(ht.isVisible=!0,ht.container.renderable=!0,typeof alpha=="number"&&(ht.container.alpha=alpha),typeof tp=="number"&&(ht.transitionProgress=tp),this.hideStarSprite(key))}',
  },
  {
    id: "attack-sb-npc-accounts",
    find: "factionOwnership:await findSystemFactionOwnershipPda({game:Se.key,system:mt.key}),crewBinding:wt,rewardRegistry:Ct.registry,rewardConfig:Ct.config,kingTracker:$t,keyIndex:St};return YQ(Rt,SAGE_PDA_CONFIG)",
    replace:
      'factionOwnership:await findSystemFactionOwnershipPda({game:Se.key,system:mt.key}),crewBinding:wt,attackerFleetOwnership:await findFleetFactionOwnershipPda({game:Se.key,fleet:at.key}),attackerFactionAccount:(Number(at.npcFactionId)===5?"DH5rqiA3ybiNCP15h8egVcV4FNoimwngw78enykuV5nk":"HXGodmpxppG6oJCxzWUjyjWk847W8H8JKh6iXebEcCz8"),factionEconomicsConfig:"Ej43zV14WQweU28SgvWXj8tej3VADQSZNqWFzYm2TvjL",rewardRegistry:Ct.registry,rewardConfig:Ct.config,kingTracker:$t,keyIndex:St};return YQ(Rt,SAGE_PDA_CONFIG)',
  },
  {
    id: "attack-sb-hook",
    find: 'y0.afterStarbaseAttack(String(To.systemKey))',
    replace:
      'y0.afterStarbaseAttack(String(To.systemKey)),(()=>{try{window.__SA_ON_ATTACK__?.({kind:"STARBASE",systemKey:To.systemKey,systemName:To.systemName})}catch(_sa){}})()',
  },
  {
    id: "attack-fl-hook",
    find: 'console.log("✅ Attack fleet transaction sent")',
    replace:
      'console.log("✅ Attack fleet transaction sent"),(()=>{try{window.__SA_ON_ATTACK__?.({kind:"FLEET",fleetKey:To?.fleetKey,fleetLabel:To?.fleetLabel})}catch(_sa){}})()',
  },
  {
    id: "attack-sb-error",
    find: 'console.error("Failed to attack starbase:",Ch),Pt(xp(Ch),"error",{title:"Starbase attack failed",targets:[_y(To)]})',
    replace:
      'console.error("Failed to attack starbase:",Ch);const _errStr=String(Ch?.message||Ch?.stack||JSON.stringify(Ch)||"");if(/1367933016|0x51890058|Starbase contested/i.test(_errStr)){Pt(`🛡️ ${To.systemName} starbase is CONTESTED and under protection/cooldown! (0x51890058)`,"error",{title:`Starbase Contested — ${To.systemName}`,targets:[_y(To)]})}else if(/Not within range/i.test(_errStr)){Pt("📡 Fleet is not in range of that starbase. Idle on the target system first.","error",{title:"Out of range",targets:[_y(To)]})}else if(/npc_attacker_ownership_missing/i.test(_errStr)){Pt("This hull has no Jorvik/Baron faction tag. Tag it on console.leeks.ink (Fleet tab) then retry.","error",{title:"No faction tag",targets:[_y(To)]})}else if(/0x51890057|faction_economics_config required/i.test(_errStr)){Pt("Reload SAGE UI Fixes 2.3.9+ — capture needs FactionEconomicsConfig.","error",{title:"NPC capture accounts",targets:[_y(To)]})}else if(/1367933091|0x51890023|resource=ap/i.test(_errStr)){Pt("⚡ Insufficient AP! Reload fleet AP or top up ammo.","error",{title:"AP Depleted",targets:[_y(To)]})}else{Pt(xp(Ch),"error",{title:"Starbase attack failed",targets:[_y(To)]})}',
  },
  {
    id: "attack-fl-error",
    find: 'console.error("Failed to attack fleet:",If),Pt(xp(If),"error",{title:"Fleet attack failed",targets:[ip(To)]})',
    replace:
      'console.error("Failed to attack fleet:",If);const _errStr=String(If?.message||If?.stack||JSON.stringify(If)||"");if(/1367933091|0x51890023|resource=ap/i.test(_errStr)){Pt("⚡ Insufficient AP! Reload fleet AP or top up ammo.","error",{title:"AP Depleted",targets:[ip(To)]})}else if(/xp\\.rs:132|overflow/i.test(_errStr)){Pt("⚠️ SAGE Program Panic (XP Overflow). Retrying attack may succeed.","error",{title:"Program Panic",targets:[ip(To)]})}else{Pt(xp(If),"error",{title:"Fleet attack failed",targets:[ip(To)]})}',
  },
  {
    id: "builder-pulse",
    find: "DIAGRAM_PULSE_TICK_MS=1e3/30",
    replace: "DIAGRAM_PULSE_TICK_MS=1e3",
  },
  {
    id: "builder-autoscroll",
    find: 'er.recordProgrammaticScrollTarget(eu),$c.scrollTo({top:eu,behavior:"smooth"})',
    replace: "0",
  },
  {
    id: "map-math",
    find: "function pixelPointToGamePoint(ee,Se,nt){const at=Math.floor(Se/2),mt=ee.x/nt-at,ft=at-ee.y/MAP_CONFIG.COORDINATE_Y_SQUASH/nt;return{x:mt,y:ft}}",
    replace:
      "function pixelPointToGamePoint(ee,Se,nt){const at=Math.floor(Se/2),mt=ee.x/nt-at,ft=at-ee.y/MAP_CONFIG.COORDINATE_Y_SQUASH/nt;return{x:mt,y:ft}}window.__SA_MAP_MATH__={pixelPointToGamePoint,gamePointToPixelPoint,MAP_CONFIG};",
  },
  {
    id: "map-control",
    find: "{requestOpenMovementPlanner:gm,requestPanTo:Ac,requestSelectFleet:yd}=useMapControl()",
    replace:
      "{requestOpenMovementPlanner:gm,requestPanTo:Ac,requestSelectFleet:yd}=useMapControl(),_saMC=(window.__SA_MAP_CONTROL__={requestPanTo:Ac,requestSelectFleet:yd,requestOpenMovementPlanner:gm})",
  },
  {
    id: "planner-dispatch",
    find: "const Qc=To=>{Vs()||Jc(Tl=>movementPlannerReducer(Tl,To))},Wd={active:!1,type:\"warp\"",
    replace:
      "const Qc=To=>{Vs()||Jc(Tl=>movementPlannerReducer(Tl,To));try{window.__SA_PLANNER__=Object.assign(window.__SA_PLANNER__||{},{dispatch:Qc,set:Jc})}catch(_sa){}},Wd={active:!1,type:\"warp\"",
  },
  {
    id: "expose-inkchat",
    find: "const Pt={activeChannel:at,setActiveChannel:mt,messages:ft,",
    replace:
      "const Pt=window.__SA_INK__={activeChannel:at,setActiveChannel:mt,messages:ft,",
  },
  {
    id: "expose-inkdm",
    find: "const $n={conversations:nt,contacts:An,openDM:Yt,",
    replace:
      "const $n=window.__SA_INK_DM__={conversations:nt,contacts:An,openDM:Yt,",
  },
  {
    id: "expose-identity",
    find: "return{byProfile:at,byWallet:mt}})}function resolveByWallet",
    replace:
      "return(window.__SA_IDENTITY__={byProfile:at,byWallet:mt})})}function resolveByWallet",
  },
  {
    id: "expose-ink-settings",
    find: "return createComponent(ChatSettingsContext.Provider,{value:{manualContacts:ht,addContact:vt,removeContact:St,isContact:Ct,blockedUsers:$t,blockUser:wt,unblockUser:Rt,isBlocked:At,hiddenChannels:It,toggleChannel:Et,isChannelVisible:Lt",
    replace:
      "return createComponent(ChatSettingsContext.Provider,{value:window.__SA_INK_SET__={manualContacts:ht,addContact:vt,removeContact:St,isContact:Ct,blockedUsers:$t,blockUser:wt,unblockUser:Rt,isBlocked:At,hiddenChannels:It,toggleChannel:Et,isChannelVisible:Lt",
  },
  {
    id: "peek-fleets",
    find: "peekFleets:()=>vt,subscribeFleetChanges:",
    replace:
      "peekFleets:()=>(window.__SA_PEEK_FLEETS__=()=>vt,vt),subscribeFleetChanges:",
  },
  {
    id: "player-profile",
    find: 'Tl&&console.log("[PixiMap] Player profile set:",Tl)',
    replace:
      'Tl&&(window.__SA_PLAYER_PROFILE__=Tl,console.log("[PixiMap] Player profile set:",Tl))',
  },
  {
    id: "selected-fleet",
    find: "Mc=createMemo(()=>{const To=fs(),Tl=Ns();if(!To||!Tl)return null;const Cc=wt.getFleet(To);return Cc?.exists?{...Tl,fleetAccount:Cc}:null})",
    replace:
      "Mc=createMemo(()=>{const To=fs(),Tl=Ns();if(!To||!Tl){try{window.__SA_SELECTED_FLEET__=null}catch{}return null}const Cc=wt.getFleet(To);const _out=Cc?.exists?{...Tl,fleetAccount:Cc}:null;try{window.__SA_SELECTED_FLEET__=_out?{key:String(To),label:String(Tl.fleetLabel||_out.fleetLabel||To).slice(0,48)}:null}catch{}return _out})",
  },
];
