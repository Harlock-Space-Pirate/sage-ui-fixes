# Privacy Policy — SAGE UI Fixes

**Author:** LEEKS / Produce Bandit ltd  
**Product:** SAGE UI Fixes browser extension

## What data we collect

**None.** The extension does not collect personal data, wallet addresses, balances, transaction history, or usage analytics. There is no telemetry and no remote configuration channel.

## Storage

The extension does not store user wallet data, keys, seeds, or session credentials. It does not use `chrome.storage` for account material.

## Network

- The extension only operates on pages under `https://sage.staratlas.com/`.
- It may fetch the same page entry assets the site already loads, then inject a locally patched module.
- Declarative Net Request (DNR) is used to handle the stock entry script and related asset headers so the fix can load. No third-party analytics or phone-home endpoints are contacted by this extension.

## Contact

Questions or concerns: open a GitHub issue on this repository.

https://github.com/Harlock-Space-Pirate/sage-ui-fixes/issues
