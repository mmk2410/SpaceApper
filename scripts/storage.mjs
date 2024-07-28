export { storeApps, getApps };

async function storeApps(apps) {
  await browser.storage.sync.set({
    apps: apps,
  });
}

async function getApps() {
  const res = await browser.storage.sync.get("apps");

  if (res.apps === undefined) {
    return [];
  }

  return res.apps;
}
