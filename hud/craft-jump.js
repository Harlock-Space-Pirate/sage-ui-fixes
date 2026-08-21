/** Recipe pick → station crafting bays. MAIN. LEEKS / Produce Bandit ltd
 *
 * Official catalog click only setSelectedRecipe. If the starbase menu API is
 * exposed, reopen CRAFTING / Bays on the current station so you don't hunt the map.
 */
(function () {
  if (localStorage.getItem("saEnabled") !== "1") return;
  function menu() {
    return window.__SA_STARBASE_MENU__ || null;
  }

  function openBays(recipeKey) {
    const api = menu();
    if (!api || typeof api.open !== "function") return false;
    let sys = null;
    try {
      sys = typeof api.systemId === "function" ? api.systemId() : api.systemId;
    } catch {
      sys = null;
    }
    if (!sys) return false;
    try {
      api.open({
        systemId: sys,
        activeTab: "CRAFTING",
        activeSubTab: "Bays",
        initialRecipeKey: recipeKey || undefined,
      });
      return true;
    } catch {
      return false;
    }
  }

  function recipeKeyFromCard(el) {
    if (!el) return "";
    const key =
      el.getAttribute("data-recipe-key") ||
      el.getAttribute("data-key") ||
      "";
    if (key) return key;
    const name = (el.querySelector('[class*="recipeName"], [class*="RecipeName"]') || el)
      .textContent;
    return String(name || "").replace(/\s+/g, " ").trim().slice(0, 64);
  }

  document.addEventListener(
    "click",
    (e) => {
      const t = e.target;
      if (!t || !t.closest) return;
      const card = t.closest('[class*="recipeCard"], [class*="RecipeCard"]');
      if (!card) return;
      if (card.closest && card.closest("#sa-action-bar, #sa-combat-log-box")) return;
      const key = recipeKeyFromCard(card);
      window.setTimeout(() => openBays(key), 40);
    },
    true,
  );

  window.__SA_CRAFT_JUMP__ = { openBays };
})();
