/** SAGE UI Fixes v2 patches. Pinned to live 0.0.416 / assets/index-1rYn0BJE.js (2026-08-21).
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
    id: "nearby-fleets",
    find: "get nearbyStarbases(){return bc()},get nearbyFleets(){return Tc()}",
    replace:
      "get nearbyStarbases(){return (window.__SA_NEARBY_STARBASES__=bc)()},get nearbyFleets(){return (window.__SA_NEARBY_FLEETS__=Tc)()}",
  },
  {
    id: "nearby-dead-filter",
    find: "return ee.nearbyFleets.filter(Pc=>{const su=Wc(Ys,bc,Pc.coordinates[0],Pc.coordinates[1])<=Tc,rc=toFactionEnum(Pc.faction),dc=rc!==pi&&!(pi===w.Unaligned&&rc===w.Unaligned),gd=String(Pc.fleetKey)!==String(ee.fleetData?.fleetKey);return su&&dc&&gd})",
    replace:
      "return ee.nearbyFleets.filter(Pc=>{const su=Wc(Ys,bc,Pc.coordinates[0],Pc.coordinates[1])<=Tc,rc=toFactionEnum(Pc.faction),dc=rc!==pi&&!(pi===w.Unaligned&&rc===w.Unaligned),gd=String(Pc.fleetKey)!==String(ee.fleetData?.fleetKey),dead=Pc.fleetAccount?.data?.state?.__kind===\"Destroyed\"||Number(Pc.fleetAccount?.data?.hp??0)<=0;return su&&dc&&gd&&!dead})",
  },
  {
    id: "starbase-hp-bar",
    find: "if(Lc){const Zd=Lc.hp+Lc.pendingHp;Hc=Zd>0?Lc.hp/Zd:0}",
    replace:
      "if(Lc){const Zd=Math.max(1,520+Number(Lc.level||0)*180);Hc=Math.min(1,Math.max(0,Number(Lc.hp||0)/Zd))}",
  },
  {
    id: "fingerprint-hp",
    find: "Object.values(Cc).map(hc=>`${hc.name}@${hc.coordinates[0]},${hc.coordinates[1]}:${hc.owner??\"none\"}:L${hc.starbaseLevel??0}:${hc.core?\"core\":\"not\"}:${hc.planetCount}:${hc.asteroidCount}:${(hc.stars??[]).length}:${hc.bannerCode??\"none\"}`)",
    replace:
      "Object.values(Cc).map(hc=>`${hc.name}@${hc.coordinates[0]},${hc.coordinates[1]}:${hc.owner??\"none\"}:L${hc.starbaseLevel??0}:H${((hc.starbaseHpFraction??0)*100)|0}:${hc.core?\"core\":\"not\"}:${hc.planetCount}:${hc.asteroidCount}:${(hc.stars??[]).length}:${hc.bannerCode??\"none\"}`)",
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
    find: "Hn.alpha=SYSTEM_STAR_CONFIG.GLOW.ALPHA,Hn.blendMode=\"add\",Hn.zIndex=10,pn.addChild(Hn),pn._starGlow=Hn",
    replace:
      "Hn.alpha=Math.min(.05,SYSTEM_STAR_CONFIG.GLOW.ALPHA),Hn.blendMode=\"add\",Hn.zIndex=10,pn.addChild(Hn),pn._starGlow=Hn",
  },
  {
    id: "detail-glow-base",
    find: "GLOW_BASE_ALPHA:.45,GLOW_PULSE_RANGE:.15",
    replace: "GLOW_BASE_ALPHA:.08,GLOW_PULSE_RANGE:.04",
  },
  {
    id: "detail-outer-glow",
    find: "Xr=Math.max(SYSTEM_DETAIL_CONFIG.STAR.GLOW_RADIUS*4,It*4.65)*Mo.glowRadiusMultiplier*Di/yr,Hs.scale.set(Xr,Xr*vt),Hs.tint=new Color(Dt).toNumber(),Pr=Math.min(.56,SYSTEM_DETAIL_CONFIG.STAR.GLOW_BASE_ALPHA*1.02*Mo.glowAlphaMultiplier),Hs.alpha=Pr*.72,Hs.blendMode=\"screen\"",
    replace:
      "Xr=Math.max(SYSTEM_DETAIL_CONFIG.STAR.GLOW_RADIUS*1.45,It*1.7)*Mo.glowRadiusMultiplier*Di/yr,Hs.scale.set(Xr,Xr*vt),Hs.tint=new Color(Dt).toNumber(),Pr=Math.min(.1,SYSTEM_DETAIL_CONFIG.STAR.GLOW_BASE_ALPHA*.22*Mo.glowAlphaMultiplier),Hs.alpha=Pr*.22,Hs.blendMode=\"screen\"",
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
    find: "const Gn=An.reduce((Gr,ls)=>(Gr.set(ls.address,{...ls.data,key:ls.address}),Gr),new Map)",
    replace:
      "const Gn=typeof __saSysMemo==\"function\"?__saSysMemo():An.reduce((Gr,ls)=>(Gr.set(ls.address,{...ls.data,key:ls.address}),Gr),new Map)",
  },
  {
    id: "regions-memo",
    find: "regions:yn.flatMap(Gr=>Gr.data.regions.unsizedList)",
    replace:
      "regions:typeof __saRegionMemo==\"function\"?__saRegionMemo():yn.flatMap(Gr=>Gr.data.regions.unsizedList)",
  },
  {
    id: "post-attack-poll",
    find: "const POST_ATTACK_POLL_DELAYS_MS=[2e3,5e3,1e4]",
    replace: "const POST_ATTACK_POLL_DELAYS_MS=[1500,6e3]",
  },
  {
    id: "pin-retint",
    find: "if(!shouldRecreateStarSystemVisuals(Ft,ls,jr))continue;Ft.parent?.removeChild(Ft),Ft.destroy({children:!0}),Rt(pa=>{const go=new Map(pa);return go.delete(Pt),go})}",
    replace:
      "if(!shouldRecreateStarSystemVisuals(Ft,ls,jr))continue;Ft._systemOwner=ls;Ft._baseSize=jr;const _saT=cachedColorNumber(getFactionColorFromOwner(Lt.owner));if(Ft._starGlow){Ft._starGlow.tint=_saT;Ft._starGlow.alpha=.04}if(Ft._starCore)Ft._starCore.tint=_saT;if(Ft._softHalo)Ft._softHalo.tint=_saT;continue}",
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
      'factionOwnership:await findSystemFactionOwnershipPda({game:Se.key,system:mt.key}),crewBinding:wt,...(Number(at.npcFactionId)===4||Number(at.npcFactionId)===5?{attackerFleetOwnership:await findFleetFactionOwnershipPda({game:Se.key,fleet:at.key}),attackerFactionAccount:Number(at.npcFactionId)===5?"DH5rqiA3ybiNCP15h8egVcV4FNoimwngw78enykuV5nk":"HXGodmpxppG6oJCxzWUjyjWk847W8H8JKh6iXebEcCz8",factionEconomicsConfig:"Ej43zV14WQweU28SgvWXj8tej3VADQSZNqWFzYm2TvjL"}:{}),rewardRegistry:Ct.registry,rewardConfig:Ct.config,kingTracker:$t,keyIndex:St};return YQ(Rt,SAGE_PDA_CONFIG)',
  },
  {
    id: "attack-sb-hook",
    find: "await lc.sendTransactionWithSubmission({instructions:withSoloAttackComputeBudget(Ag),...Og?{sendOptions:{skipPreflight:!0}}:{}},()=>{}),console.log(\"✅ Attack starbase transaction sent\"),V0.afterStarbaseAttack(String(uo.systemKey))",
    replace:
      "const _saTx=await lc.sendTransactionWithSubmission({instructions:withSoloAttackComputeBudget(Ag),...Og?{sendOptions:{skipPreflight:!0}}:{}},()=>{});console.log(\"✅ Attack starbase transaction sent\"),V0.afterStarbaseAttack(String(uo.systemKey)),(()=>{try{const _t=typeof _saTx===\"string\"?_saTx:_saTx&&(_saTx.signature||_saTx.txid)||\"\";window.__SA_ON_ATTACK__?.({kind:\"STARBASE\",systemKey:uo.systemKey,systemName:uo.systemName,attacker:String(fu.fleetLabel||\"\"),tx:_t,x:op(String(uo.systemKey),\"starbase\")?.x,y:op(String(uo.systemKey),\"starbase\")?.y,sx:op(String(fu.fleetKey),\"fleet\")?.x,sy:op(String(fu.fleetKey),\"fleet\")?.y})}catch(_sa){}})()",
  },
  {
    id: "attack-fl-hook",
    find: "await lc.sendTransactionWithSubmission({instructions:withSoloAttackComputeBudget(Xh),...Hg?{sendOptions:{skipPreflight:!0}}:{}},()=>{}),F1(mm.address,bp(mm.data)),Up(mm.address,!0),On(`Attack order submitted against ${uo.fleetLabel}.`,\"success\",{presentation:\"feed\",title:\"Fleet attack launched\",targets:[Sp(uo)]}),console.log(\"✅ Attack fleet transaction sent\")",
    replace:
      "const _saTx=await lc.sendTransactionWithSubmission({instructions:withSoloAttackComputeBudget(Xh),...Hg?{sendOptions:{skipPreflight:!0}}:{}},()=>{});F1(mm.address,bp(mm.data)),Up(mm.address,!0),On(`Attack order submitted against ${uo.fleetLabel}.`,\"success\",{presentation:\"feed\",title:\"Fleet attack launched\",targets:[Sp(uo)]}),console.log(\"✅ Attack fleet transaction sent\"),(()=>{try{const _t=typeof _saTx===\"string\"?_saTx:_saTx&&(_saTx.signature||_saTx.txid)||\"\";window.__SA_ON_ATTACK__?.({kind:\"FLEET\",fleetKey:String(uo.fleetKey||uo.fleetAccount?.address||\"\"),fleetLabel:uo.fleetLabel,attacker:String(fu.fleetLabel||\"\"),tx:_t,x:op(String(uo.fleetKey||uo.fleetAccount?.address||\"\"),\"fleet\")?.x,y:op(String(uo.fleetKey||uo.fleetAccount?.address||\"\"),\"fleet\")?.y,sx:op(String(fu.fleetKey),\"fleet\")?.x,sy:op(String(fu.fleetKey),\"fleet\")?.y,preHp:Number(uo.fleetAccount?.data?.hp),preSp:Number(uo.fleetAccount?.data?.sp)})}catch(_sa){}})()",
  },
  {
    id: "attack-sb-error",
    find: "console.error(\"Failed to attack starbase:\",bf),On(lv(bf),\"error\",{title:\"Starbase attack failed\",targets:[ip(uo)]})",
    replace:
      "console.error(\"Failed to attack starbase:\",bf);const _errStr=String(bf?.message||bf?.stack||JSON.stringify(bf)||\"\");let _msg=\"Starbase attack failed.\",_title=\"Starbase attack failed\";if(/1367933016|0x51890058|Starbase contested/i.test(_errStr)){_msg=`🛡️ ${uo.systemName} is contested (protection/cooldown).`;_title=`Starbase Contested — ${uo.systemName}`}else if(/Not within range/i.test(_errStr)){_msg=\"Fleet is not in range. Idle on the target system first.\";_title=\"Out of range\"}else if(/npc_attacker_ownership_missing|AccountDataTooSmall|attacker_fleet_ownership/i.test(_errStr)){_msg=\"This hull has no Jorvik/Baron faction tag. Tag it on console.leeks.ink (Fleet tab) then retry.\";_title=\"No faction tag\"}else if(/0x51890057|faction_economics_config required/i.test(_errStr)){_msg=\"Reload SAGE UI Fixes — capture needs FactionEconomicsConfig.\";_title=\"NPC capture accounts\"}else if(/1367933091|0x51890023|resource=ap/i.test(_errStr)){_msg=\"Insufficient AP. Reload fleet AP or top up ammo.\";_title=\"AP Depleted\"}On(_msg,\"error\",{title:_title,targets:[ip(uo)]});try{window.__SA_LOG_COMBAT_EVENT?.({type:\"FAIL\",target:uo.systemName,attacker:String(fu.fleetLabel||\"\"),msg:_msg,tx:_errStr})}catch(_sa){}",
  },
  {
    id: "attack-fl-error",
    find: "console.error(\"Failed to attack fleet:\",Sf),On(lv(Sf),\"error\",{title:\"Fleet attack failed\",targets:[Sp(uo)]})",
    replace:
      "console.error(\"Failed to attack fleet:\",Sf);const _errStr=String(Sf?.message||Sf?.stack||JSON.stringify(Sf)||\"\");let _msg=\"Fleet attack failed.\",_title=\"Fleet attack failed\";if(/1367933091|0x51890023|resource=ap/i.test(_errStr)){_msg=\"Insufficient AP. Reload fleet AP or top up ammo.\";_title=\"AP Depleted\"}else if(/xp\\.rs:132|overflow/i.test(_errStr)){_msg=\"SAGE program panic (XP overflow). Retry may succeed.\";_title=\"Program Panic\"}On(_msg,\"error\",{title:_title,targets:[Sp(uo)]});try{window.__SA_LOG_COMBAT_EVENT?.({type:\"FAIL\",target:uo.fleetLabel,attacker:String(fu.fleetLabel||\"\"),msg:_msg,tx:_errStr})}catch(_sa){}",
  },
  {
    id: "builder-pulse",
    find: "DIAGRAM_PULSE_TICK_MS=1e3/30",
    replace: "DIAGRAM_PULSE_TICK_MS=1e3",
  },
  {
    id: "builder-autoscroll",
    find: 'Yn.recordProgrammaticScrollTarget(nm),$c.scrollTo({top:nm,behavior:"smooth"})',
    replace: "0",
  },
  {
    id: "map-math",
    find: "function pixelPointToGamePoint(ee,Se,nt){const at=Math.floor(Se/2),mt=ee.x/nt-at,ft=at-ee.y/MAP_CONFIG.COORDINATE_Y_SQUASH/nt;return{x:mt,y:ft}}",
    replace:
      "function pixelPointToGamePoint(ee,Se,nt){const at=Math.floor(Se/2),mt=ee.x/nt-at,ft=at-ee.y/MAP_CONFIG.COORDINATE_Y_SQUASH/nt;return{x:mt,y:ft}}window.__SA_MAP_MATH__={pixelPointToGamePoint,gamePointToPixelPoint,MAP_CONFIG};",
  },
  {
    id: "pixi-map",
    find: "getFleetWorldPosition(Se){const nt=this.fleetPins.get(Se);if(nt&&!nt.destroyed)return{x:nt.x,y:nt.y}",
    replace:
      "getFleetWorldPosition(Se){window.__SA_PIXI_MAP__=this;const nt=this.fleetPins.get(Se);if(nt&&!nt.destroyed)return{x:nt.x,y:nt.y}",
  },
  {
    id: "map-control",
    find: "publishMapInteractionBlocked:An,visibleFleetOrder:pn",
    replace:
      "publishMapInteractionBlocked:An,_saMC:(window.__SA_MAP_CONTROL__={requestPanTo:ft,requestSelectFleet:Ct,unblockMap:()=>An(!1)}),visibleFleetOrder:pn",
  },
  {
    id: "derived-fleets",
    find: "{pixiMapHoverEventsDisabled:Dt}=usePixiMapHover(),Ht=useRpcDataStore(),Kt=useDerivedFleetStore()",
    replace:
      "{pixiMapHoverEventsDisabled:Dt}=usePixiMapHover(),Ht=useRpcDataStore(),Kt=useDerivedFleetStore(),_saDF=(window.__SA_DERIVED_FLEETS__=Kt)",
  },
  {
    id: "expose-combat-tab",
    find: "[jr,pa]=createSignal(760),[go,Dr]=createSignal(360);let Pi,bo,Oo;",
    replace:
      "[jr,pa]=createSignal(760),[go,Dr]=createSignal(360);window.__SA_COMBAT_TAB__={get:()=>Gn(),set:Hn,derived:()=>Xf(),targets:()=>Ec(),getTarget:()=>Jn(),selectTarget:t=>_r(t)};let Pi,bo,Oo;",
  },
  {
    // gameToPixel multiplies Y by COORDINATE_Y_SQUASH; the class inverse never divided it
    // back, parking the interaction ring of moving fleets at 0.3*at+0.7*y. The standalone
    // pixelPointToGamePoint divides correctly — make the method the true inverse too.
    id: "pixel-to-game-squash",
    find: "pixelToGame(Se,nt){const at=Math.floor(MAP_CONFIG.WORLD_GRID_SIZE/2),mt=Se/MAP_CONFIG.TILE_SIZE-at,ft=at-nt/MAP_CONFIG.TILE_SIZE;return{x:mt,y:ft}}",
    replace:
      "pixelToGame(Se,nt){const at=Math.floor(MAP_CONFIG.WORLD_GRID_SIZE/2),mt=Se/MAP_CONFIG.TILE_SIZE-at,ft=at-nt/MAP_CONFIG.TILE_SIZE/MAP_CONFIG.COORDINATE_Y_SQUASH;return{x:mt,y:ft}}",
  },
  {
    id: "planner-dispatch",
    find: "const rm=uo=>{Xd()||md(zs=>movementPlannerReducer(zs,uo))},ym={active:!1,type:\"warp\"",
    replace:
      "const rm=uo=>{Xd()||md(zs=>movementPlannerReducer(zs,uo));try{window.__SA_PLANNER__=Object.assign(window.__SA_PLANNER__||{},{dispatch:rm,set:md,getState:Hc,openWing:function(keys,m){return md({active:!0,destination:null,mapTargeting:!0,mode:m||\"warp\",origin:\"fleet\",searchQuery:\"\",selectedFleetKeys:(keys||[]).map(String)})},primeBatch:function(keys,m,dest){return md({active:!0,destination:dest||null,mapTargeting:!dest,mode:m||\"warp\",origin:\"fleet\",searchQuery:\"\",selectedFleetKeys:(keys||[]).map(String)})}})}catch(_sa){}},ym={active:!1,type:\"warp\"",
  },
  {
    id: "expose-inkchat",
    find: "const Vt={activeChannel:at,setActiveChannel:mt,messages:ft,",
    replace:
      "const Vt=window.__SA_INK__={activeChannel:at,setActiveChannel:mt,messages:ft,",
  },
  {
    id: "expose-inkdm",
    find: "const Hn={conversations:nt,contacts:dn,openDM:Ut,",
    replace:
      "const Hn=window.__SA_INK_DM__={conversations:nt,contacts:dn,openDM:Ut,",
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
    find: "peekFleets:()=>wt,subscribeFleetChanges:",
    replace:
      "peekFleets:()=>(window.__SA_PEEK_FLEETS__=()=>wt,wt),subscribeFleetChanges:",
  },
  {
    id: "player-profile",
    find: 'zs&&console.log("[PixiMap] Player profile set:",zs)',
    replace:
      'zs&&(window.__SA_PLAYER_PROFILE__=zs,console.log("[PixiMap] Player profile set:",zs))',
  },
  {
    id: "selected-fleet",
    find: "Cm=createMemo(()=>{const uo=us(),zs=$d();if(!uo||!zs)return null;const lc=wt.getFleet(uo);return lc?.exists?{...zs,fleetAccount:lc}:null})",
    replace:
      "Cm=createMemo(()=>{const uo=us(),zs=$d();if(!uo||!zs){try{window.__SA_SELECTED_FLEET__=null}catch{}return null}const lc=wt.getFleet(uo);const _out=lc?.exists?{...zs,fleetAccount:lc}:null;try{window.__SA_SELECTED_FLEET__=_out?{key:String(uo),label:String(zs.fleetLabel||_out.fleetLabel||uo).slice(0,48)}:null}catch{}return _out})",
  },
  {
    id: "planner-submit",
    find: "Hl=async()=>{if(Yd||Xd())return;const uo=Hc(),zs=Object.freeze([...uo.selectedFleetKeys])",
    replace:
      "Hl=async()=>{if(window.__SA_PLANNER__)window.__SA_PLANNER__.submit=Hl;if(Yd||Xd())return;const uo=Hc(),zs=Object.freeze([...uo.selectedFleetKeys])",
  },
  {
    id: "map-follow",
    find: "Zh=()=>{const uo=us();if(uo){if($s()===uo){vh();return}Rg()&&(pc=null,Id=null,Zl=null,gc=null,_l(uo),Bh(Date.now()/1e3-Ht.ledgerTimeDrift()))}}",
    replace:
      "Zh=()=>{const uo=us();if(uo){if($s()===uo){vh();return}Rg()&&(pc=null,Id=null,Zl=null,gc=null,_l(uo),Bh(Date.now()/1e3-Ht.ledgerTimeDrift()))}},_saMF=(window.__SA_MAP_FOLLOW__={stop:vh,toggle:Zh,key:()=>us()})",
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
    find: "openStarbaseMenu:Ct,setIsStarbaseMenuOpen:$t}=useStarbaseMenu()",
    replace:
      "openStarbaseMenu:Ct,_saSB1=(window.__SA_STARBASE_MENU__=Object.assign(window.__SA_STARBASE_MENU__||{},{open:Ct})),setIsStarbaseMenuOpen:$t}=useStarbaseMenu()",
  },
  {
    id: "expose-starbase-menu-sysid",
    find: "starbaseMenuOpenRequest:mt,clearStarbaseMenuOpenRequest:ft}=useStarbaseMenu()",
    replace:
      "starbaseMenuOpenRequest:mt,clearStarbaseMenuOpenRequest:ft,_saSB2=(window.__SA_STARBASE_MENU__=Object.assign(window.__SA_STARBASE_MENU__||{},{systemId:()=>nt}))}=useStarbaseMenu()",
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
    find: 'os&&(qa.preventDefault(),Di(os))};window.addEventListener("keydown",Po)',
    replace:
      'os&&(qa.preventDefault(),Di(os),(()=>{try{window.__SA_ACTION_BAR__?.fire(os)}catch(_sa){}})())};window.__SA_KEYBIND_HOOK__=!0;window.addEventListener("keydown",Po)',
  },
];
