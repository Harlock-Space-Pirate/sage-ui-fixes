/** SAGE UI Fixes v2 patches. Pinned to live 0.0.371 / assets/index-DmmfP5d6.js (2026-08-18).
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
    find: "return ee.nearbyFleets.filter(Fc=>{const fu=oc(ol,$c,Fc.coordinates[0],Fc.coordinates[1])<=Ac,sc=toFactionEnum(Fc.faction),fc=sc!==yi&&!(yi===w.Unaligned&&sc===w.Unaligned),ud=String(Fc.fleetKey)!==String(ee.fleetData?.fleetKey);return fu&&fc&&ud})",
    replace:
      'return ee.nearbyFleets.filter(Fc=>{const fu=oc(ol,$c,Fc.coordinates[0],Fc.coordinates[1])<=Ac,sc=toFactionEnum(Fc.faction),fc=sc!==yi&&!(yi===w.Unaligned&&sc===w.Unaligned),ud=String(Fc.fleetKey)!==String(ee.fleetData?.fleetKey),dead=Fc.fleetAccount?.data?.state?.__kind==="Destroyed"||Number(Fc.fleetAccount?.data?.hp??0)<=0;return fu&&fc&&ud&&!dead})',
  },
  {
    id: "starbase-hp-bar",
    find: "if(Jc){const gu=Jc.hp+Jc.pendingHp;Od=gu>0?Jc.hp/gu:0}",
    replace:
      "if(Jc){const gu=Math.max(1,520+Number(Jc.level||0)*180);Od=Math.min(1,Math.max(0,Number(Jc.hp||0)/gu))}",
  },
  {
    id: "fingerprint-hp",
    find: "Object.values(Qc).map(_c=>`${_c.name}@${_c.coordinates[0]},${_c.coordinates[1]}:${_c.owner??\"none\"}:L${_c.starbaseLevel??0}:${_c.core?\"core\":\"not\"}:${_c.planetCount}:${_c.asteroidCount}:${(_c.stars??[]).length}`)",
    replace:
      "Object.values(Qc).map(_c=>`${_c.name}@${_c.coordinates[0]},${_c.coordinates[1]}:${_c.owner??\"none\"}:L${_c.starbaseLevel??0}:H${((_c.starbaseHpFraction??0)*100)|0}:${_c.core?\"core\":\"not\"}:${_c.planetCount}:${_c.asteroidCount}:${(_c.stars??[]).length}`)",
  },
  {
    id: "resolve-display-owner",
    find: "function resolveDisplayOwner(ee,Se,nt,at){const mt=nt.get(String(ee));return mt&&at.hasStarbase&&String(mt.gameId)===String(at.gameId)&&mt.capturedSeqId===at.systemSeqId&&mt.controllingFaction>0?mt.controllingFaction:Se}",
    replace:
      "function resolveDisplayOwner(ee,Se,nt,at){const mt=nt.get(String(ee));const f=mt!=null?Number(mt.controllingFaction):NaN;return mt&&at.hasStarbase&&String(mt.gameId)===String(at.gameId)&&(f===1||f===2||f===3)?f:Se}",
  },
  {
    id: "owner-panel-memo",
    find: "Et=createMemo(()=>ee.system?.owner??w.Unaligned)",
    replace:
      "Et=createMemo(()=>{const gn=ee.system;if(!gn)return w.Unaligned;const Jr=gn._systemId;const Sn=Jr!=null?(Se.state.map?.systems?.[Jr]??Se.state.map?.systems?.[String(Jr)]):null;return Sn?.owner??gn.owner??w.Unaligned})",
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
    find: 'An.alpha=SYSTEM_STAR_CONFIG.GLOW.ALPHA,An.blendMode="add",An.zIndex=10,wn.addChild(An),wn._starGlow=An',
    replace:
      'An.alpha=Math.min(.05,SYSTEM_STAR_CONFIG.GLOW.ALPHA),An.blendMode="add",An.zIndex=10,wn.addChild(An),wn._starGlow=An',
  },
  {
    id: "detail-glow-base",
    find: "GLOW_BASE_ALPHA:.45,GLOW_PULSE_RANGE:.15",
    replace: "GLOW_BASE_ALPHA:.08,GLOW_PULSE_RANGE:.04",
  },
  {
    id: "detail-outer-glow",
    find: 'Fs=Math.max(SYSTEM_DETAIL_CONFIG.STAR.GLOW_RADIUS*4,It*4.65)*Gr.glowRadiusMultiplier*Ar/Pr,Ns.scale.set(Fs,Fs*vt),Ns.tint=new Color(Dt).toNumber(),Vs=Math.min(.56,SYSTEM_DETAIL_CONFIG.STAR.GLOW_BASE_ALPHA*1.02*Gr.glowAlphaMultiplier),Ns.alpha=Vs*.72,Ns.blendMode="screen"',
    replace:
      'Fs=Math.max(SYSTEM_DETAIL_CONFIG.STAR.GLOW_RADIUS*1.45,It*1.7)*Gr.glowRadiusMultiplier*Ar/Pr,Ns.scale.set(Fs,Fs*vt),Ns.tint=new Color(Dt).toNumber(),Vs=Math.min(.1,SYSTEM_DETAIL_CONFIG.STAR.GLOW_BASE_ALPHA*.22*Gr.glowAlphaMultiplier),Ns.alpha=Vs*.22,Ns.blendMode="screen"',
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
    find: 'createEffect(()=>{const At="EKEj47SzaCjPM3m4T4vRXrrsVtkEmiNgPMMFye3AkXj4",Et=nt.get("games").map(Lt=>Lt.address).sort()',
    replace:
      'createEffect(()=>{if(!(typeof isStartupDebugEnabled=="function"&&isStartupDebugEnabled()))return;const At="EKEj47SzaCjPM3m4T4vRXrrsVtkEmiNgPMMFye3AkXj4",Et=nt.get("games").map(Lt=>Lt.address).sort()',
  },
  {
    id: "systems-memo",
    find: "const Hn=On.reduce((Ur,os)=>(Ur.set(os.address,{...os.data,key:os.address}),Ur),new Map)",
    replace:
      'const Hn=typeof __saSysMemo=="function"?__saSysMemo():On.reduce((Ur,os)=>(Ur.set(os.address,{...os.data,key:os.address}),Ur),new Map)',
  },
  {
    id: "regions-memo",
    find: "regions:gn.flatMap(Ur=>Ur.data.regions.unsizedList)",
    replace:
      'regions:typeof __saRegionMemo=="function"?__saRegionMemo():gn.flatMap(Ur=>Ur.data.regions.unsizedList)',
  },
  {
    id: "post-attack-poll",
    find: "const POST_ATTACK_POLL_DELAYS_MS=[2e3,5e3,1e4]",
    replace: "const POST_ATTACK_POLL_DELAYS_MS=[1500,6e3]",
  },
  {
    id: "pin-retint",
    find: "if(!shouldRecreateStarSystemVisuals(Ft,os,Wr))continue;Ft.parent?.removeChild(Ft),Ft.destroy({children:!0}),Rt(Xr=>{const pi=new Map(Xr);return pi.delete(Pt),pi})}",
    replace:
      "if(!shouldRecreateStarSystemVisuals(Ft,os,Wr))continue;Ft._systemOwner=os;Ft._baseSize=Wr;const _saT=cachedColorNumber(getFactionColorFromOwner(Lt.owner));if(Ft._starGlow){Ft._starGlow.tint=_saT;Ft._starGlow.alpha=.04}if(Ft._starCore)Ft._starCore.tint=_saT;if(Ft._softHalo)Ft._softHalo.tint=_saT;continue}",
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
    find: 'W1.afterStarbaseAttack(String(go.systemKey))',
    replace:
      'W1.afterStarbaseAttack(String(go.systemKey)),(()=>{try{window.__SA_ON_ATTACK__?.({kind:"STARBASE",systemKey:go.systemKey,systemName:go.systemName,x:Fg?.target?.x,y:Fg?.target?.y,sx:Fg?.source?.x,sy:Fg?.source?.y})}catch(_sa){}})()',
  },
  {
    id: "attack-fl-hook",
    find: '$n(`Attack order submitted against ${go.fleetLabel}.`,"success",{presentation:"feed",title:"Fleet attack launched",targets:[lp(go)]}),console.log("✅ Attack fleet transaction sent")',
    replace:
      '$n(`Attack order submitted against ${go.fleetLabel}.`,"success",{presentation:"feed",title:"Fleet attack launched",targets:[lp(go)]}),console.log("✅ Attack fleet transaction sent"),(()=>{try{window.__SA_ON_ATTACK__?.({kind:"FLEET",fleetKey:String(go.fleetKey||go.fleetAccount?.address||""),fleetLabel:go.fleetLabel,x:hg?.target?.x,y:hg?.target?.y,sx:hg?.source?.x,sy:hg?.source?.y,preHp:Number(go.fleetAccount?.data?.hp),preSp:Number(go.fleetAccount?.data?.sp)})}catch(_sa){}})()',
  },
  {
    id: "attack-sb-error",
    find: 'console.error("Failed to attack starbase:",Rh),$n(bp(Rh),"error",{title:"Starbase attack failed",targets:[sp(go)]})',
    replace:
      'console.error("Failed to attack starbase:",Rh);const _errStr=String(Rh?.message||Rh?.stack||JSON.stringify(Rh)||"");if(/1367933016|0x51890058|Starbase contested/i.test(_errStr)){$n(`🛡️ ${go.systemName} starbase is CONTESTED and under protection/cooldown! (0x51890058)`,"error",{title:`Starbase Contested — ${go.systemName}`,targets:[sp(go)]})}else if(/Not within range/i.test(_errStr)){$n("📡 Fleet is not in range of that starbase. Idle on the target system first.","error",{title:"Out of range",targets:[sp(go)]})}else if(/npc_attacker_ownership_missing/i.test(_errStr)){$n("This hull has no Jorvik/Baron faction tag. Tag it on console.leeks.ink (Fleet tab) then retry.","error",{title:"No faction tag",targets:[sp(go)]})}else if(/0x51890057|faction_economics_config required/i.test(_errStr)){$n("Reload SAGE UI Fixes 2.3.9+ — capture needs FactionEconomicsConfig.","error",{title:"NPC capture accounts",targets:[sp(go)]})}else if(/1367933091|0x51890023|resource=ap/i.test(_errStr)){$n("⚡ Insufficient AP! Reload fleet AP or top up ammo.","error",{title:"AP Depleted",targets:[sp(go)]})}else{$n(bp(Rh),"error",{title:"Starbase attack failed",targets:[sp(go)]})}',
  },
  {
    id: "attack-fl-error",
    find: 'console.error("Failed to attack fleet:",Wf),$n(bp(Wf),"error",{title:"Fleet attack failed",targets:[lp(go)]})',
    replace:
      'console.error("Failed to attack fleet:",Wf);const _errStr=String(Wf?.message||Wf?.stack||JSON.stringify(Wf)||"");if(/1367933091|0x51890023|resource=ap/i.test(_errStr)){$n("⚡ Insufficient AP! Reload fleet AP or top up ammo.","error",{title:"AP Depleted",targets:[lp(go)]})}else if(/xp\\.rs:132|overflow/i.test(_errStr)){$n("⚠️ SAGE Program Panic (XP Overflow). Retrying attack may succeed.","error",{title:"Program Panic",targets:[lp(go)]})}else{$n(bp(Wf),"error",{title:"Fleet attack failed",targets:[lp(go)]})}',
  },
  {
    id: "builder-pulse",
    find: "DIAGRAM_PULSE_TICK_MS=1e3/30",
    replace: "DIAGRAM_PULSE_TICK_MS=1e3",
  },
  {
    id: "builder-autoscroll",
    find: 'Yn.recordProgrammaticScrollTarget(uu),Cc.scrollTo({top:uu,behavior:"smooth"})',
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
    find: "{requestGoHome:um,requestOpenMovementPlanner:Rc,requestPanTo:dd,requestSelectFleet:Vd,publishVisibleFleetOrder:Yc,toggleFleetListRequest:Io,clearToggleFleetListRequest:uc}=useMapControl()",
    replace:
      "{requestGoHome:um,requestOpenMovementPlanner:Rc,requestPanTo:dd,requestSelectFleet:Vd,publishVisibleFleetOrder:Yc,toggleFleetListRequest:Io,clearToggleFleetListRequest:uc,requestFocusSelectedFleet:_saFf,publishMapInteractionBlocked:_saBlk}=useMapControl(),_saMC=(window.__SA_MAP_CONTROL__={requestPanTo:dd,requestSelectFleet:Vd,requestOpenMovementPlanner:Rc,requestFocusSelectedFleet:_saFf,unblockMap:()=>_saBlk(!1)})",
  },
  {
    id: "derived-fleets",
    find: "{pixiMapHoverEventsDisabled:Ft}=usePixiMapHover(),Dt=useRpcDataStore(),Ht=useDerivedFleetStore()",
    replace:
      "{pixiMapHoverEventsDisabled:Ft}=usePixiMapHover(),Dt=useRpcDataStore(),Ht=useDerivedFleetStore(),_saDF=(window.__SA_DERIVED_FLEETS__=Ht)",
  },
  {
    id: "planner-dispatch",
    find: "const Au=go=>{hd()||bc(hl=>movementPlannerReducer(hl,go))},gd={active:!1,type:\"warp\"",
    replace:
      "const Au=go=>{hd()||bc(hl=>movementPlannerReducer(hl,go));try{window.__SA_PLANNER__=Object.assign(window.__SA_PLANNER__||{},{dispatch:Au,set:bc,getState:ed,openWing:function(keys,m){return bc({active:!0,destination:null,mapTargeting:!0,mode:m||\"warp\",origin:\"fleet\",searchQuery:\"\",selectedFleetKeys:(keys||[]).map(String)})},primeBatch:function(keys,m,dest){return bc({active:!0,destination:dest||null,mapTargeting:!dest,mode:m||\"warp\",origin:\"fleet\",searchQuery:\"\",selectedFleetKeys:(keys||[]).map(String)})}})}catch(_sa){}},gd={active:!1,type:\"warp\"",
  },
  {
    id: "expose-inkchat",
    find: "const Vt={activeChannel:at,setActiveChannel:mt,messages:ft,",
    replace:
      "const Vt=window.__SA_INK__={activeChannel:at,setActiveChannel:mt,messages:ft,",
  },
  {
    id: "expose-inkdm",
    find: "const An={conversations:nt,contacts:yn,openDM:Ut,",
    replace:
      "const An=window.__SA_INK_DM__={conversations:nt,contacts:yn,openDM:Ut,",
  },
  {
    id: "expose-identity",
    find: "return{byProfile:at,byWallet:mt}})}function resolveByWallet",
    replace:
      "return(window.__SA_IDENTITY__={byProfile:at,byWallet:mt})})}function resolveByWallet",
  },
  {
    id: "expose-ink-settings",
    find: "return createComponent(ChatSettingsContext.Provider,{value:{manualContacts:ht,addContact:vt,removeContact:St,isContact:Ct,blockedUsers:$t,blockUser:wt,unblockUser:Rt,isBlocked:At,hiddenChannels:Et,toggleChannel:It,isChannelVisible:Pt",
    replace:
      "return createComponent(ChatSettingsContext.Provider,{value:window.__SA_INK_SET__={manualContacts:ht,addContact:vt,removeContact:St,isContact:Ct,blockedUsers:$t,blockUser:wt,unblockUser:Rt,isBlocked:At,hiddenChannels:Et,toggleChannel:It,isChannelVisible:Pt",
  },
  {
    id: "peek-fleets",
    find: "peekFleets:()=>vt,subscribeFleetChanges:",
    replace:
      "peekFleets:()=>(window.__SA_PEEK_FLEETS__=()=>vt,vt),subscribeFleetChanges:",
  },
  {
    id: "player-profile",
    find: 'hl&&console.log("[PixiMap] Player profile set:",hl)',
    replace:
      'hl&&(window.__SA_PLAYER_PROFILE__=hl,console.log("[PixiMap] Player profile set:",hl))',
  },
  {
    id: "selected-fleet",
    find: "mm=createMemo(()=>{const go=vs(),hl=kc();if(!go||!hl)return null;const gc=wt.getFleet(go);return gc?.exists?{...hl,fleetAccount:gc}:null})",
    replace:
      "mm=createMemo(()=>{const go=vs(),hl=kc();if(!go||!hl){try{window.__SA_SELECTED_FLEET__=null}catch{}return null}const gc=wt.getFleet(go);const _out=gc?.exists?{...hl,fleetAccount:gc}:null;try{window.__SA_SELECTED_FLEET__=_out?{key:String(go),label:String(hl.fleetLabel||_out.fleetLabel||go).slice(0,48)}:null}catch{}return _out})",
  },
  {
    id: "planner-submit",
    find: "Hi=async()=>{if(xd||hd())return;const go=ed(),hl=Object.freeze([...go.selectedFleetKeys])",
    replace:
      "Hi=async()=>{if(window.__SA_PLANNER__)window.__SA_PLANNER__.submit=Hi;if(xd||hd())return;const go=ed(),hl=Object.freeze([...go.selectedFleetKeys])",
  },
  {
    id: "map-follow",
    find: "yf=()=>{const go=vs();if(go){if(us()===go){Ch();return}cg()&&(Bc=null,Hc=null,ns=null,Ys=null,bs(go),wh(Date.now()/1e3-Dt.ledgerTimeDrift()))}}",
    replace:
      "yf=()=>{const go=vs();if(go){if(us()===go){Ch();return}cg()&&(Bc=null,Hc=null,ns=null,Ys=null,bs(go),wh(Date.now()/1e3-Dt.ledgerTimeDrift()))}},_saMF=(window.__SA_MAP_FOLLOW__={stop:Ch,toggle:yf,key:()=>us()})",
  },
  {
    id: "map-viewport",
    find: "this.pixiApp=Se,this.viewport=nt,this.sinLUT=",
    replace: "this.pixiApp=Se,this.viewport=nt,window.__SA_MAP_VIEWPORT__=nt,window.__SA_PIXI_APP__=Se,this.sinLUT=",
  },
  {
    id: "fleet-viewport",
    find: "this.renderer=Se,this.viewport=nt,this.textureGenerator=",
    replace: "this.renderer=Se,this.viewport=nt,window.__SA_MAP_VIEWPORT__=window.__SA_MAP_VIEWPORT__||nt,window.__SA_PIXI_APP__=window.__SA_PIXI_APP__||Se,this.textureGenerator=",
  },
  {
    id: "expose-starbase-menu",
    find: "openStarbaseMenu:Yt,starbaseMenuOpenRequest:wt",
    replace:
      "openStarbaseMenu:(window.__SA_STARBASE_MENU__={open:Yt,systemId:()=>vt}).open,starbaseMenuOpenRequest:wt",
  },
  {
    id: "keybind-actions-category",
    find: 'const KEYBINDING_CATEGORIES=[{id:"fleet",label:"Fleet selection"},{id:"panels",label:"Panels and camera"}]',
    replace:
      'const KEYBINDING_CATEGORIES=[{id:"fleet",label:"Fleet selection"},{id:"panels",label:"Panels and camera"},{id:"actions",label:"Fleet actions"}]',
  },
  {
    id: "keybind-fleet-actions",
    find: '{id:"openCommandSettings",label:"Open command settings",description:"Open the Options / Command Settings panel.",category:"panels",defaultChord:"o"}];BINDABLE_ACTIONS.map(ee=>ee.id)',
    replace:
      '{id:"openCommandSettings",label:"Open command settings",description:"Open the Options / Command Settings panel.",category:"panels",defaultChord:"o"},{id:"dock",label:"Dock / undock",description:"Dock or undock the selected fleet.",category:"actions",defaultChord:"d"},{id:"warp",label:"Warp",description:"Start a warp for the selected fleet.",category:"actions",defaultChord:"w"},{id:"subwarp",label:"Subwarp",description:"Start a subwarp for the selected fleet.",category:"actions",defaultChord:"s"},{id:"gate",label:"Warp gate",description:"Use a warp gate with the selected fleet.",category:"actions",defaultChord:"t"},{id:"scan",label:"Scan",description:"Scan with the selected fleet.",category:"actions",defaultChord:"c"},{id:"attack",label:"Attack",description:"Attack with the selected fleet.",category:"actions",defaultChord:"a"},{id:"repair",label:"Repair",description:"Repair the selected fleet.",category:"actions",defaultChord:"r"},{id:"mine",label:"Mine",description:"Start mining with the selected fleet.",category:"actions",defaultChord:"n"},{id:"stop",label:"Stop",description:"Stop the selected fleet.",category:"actions",defaultChord:"x"},{id:"stims",label:"Stims",description:"Apply stims to the selected fleet.",category:"actions",defaultChord:"v"}];BINDABLE_ACTIONS.map(ee=>ee.id)',
  },
  {
    id: "keybind-dispatch-fire",
    find: 'Zi&&($s.preventDefault(),lr(Zi))};window.addEventListener("keydown",Ss)',
    replace:
      'Zi&&($s.preventDefault(),lr(Zi),(()=>{try{window.__SA_ACTION_BAR__?.fire(Zi)}catch(_sa){}})())};window.__SA_KEYBIND_HOOK__=!0;window.addEventListener("keydown",Ss)',
  },
];
