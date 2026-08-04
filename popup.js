/** Popup: version + release notes. LEEKS / Produce Bandit ltd */
const REPO_RELEASES = "https://github.com/Harlock-Space-Pirate/sage-ui-fixes/releases";

function tagUrl(version) {
  const v = String(version || "").replace(/^v/i, "");
  return `${REPO_RELEASES}/tag/v${v}`;
}

try {
  const { version } = chrome.runtime.getManifest();
  const verEl = document.getElementById("version");
  const notes = document.getElementById("release-notes");
  const all = document.getElementById("releases-list");
  if (verEl) verEl.textContent = `v${version}`;
  if (notes) {
    notes.href = tagUrl(version);
    notes.textContent = `v${version} release notes`;
  }
  if (all) all.href = REPO_RELEASES;
} catch (e) {
  const verEl = document.getElementById("version");
  if (verEl) verEl.textContent = "unknown";
  console.warn("[sa-ui-fixes] popup", e);
}
