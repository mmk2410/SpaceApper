import { changeUserAgent } from "./listeners.mjs";
import { getApps, storeApps } from "./storage.mjs";

export { createSpaces, removeSpaces, hashSpaceName };

function hashSpaceName(url) {
  return btoa(url).replaceAll("=", "");
}

async function createSpaces() {
  const apps = await getApps();

  if (apps.length === 0) {
    return;
  }

  const urls = [];

  apps.forEach(async (app) => {
    urls.push(app.url);
    await browser.spaces.create(app.name, app.url, {
      title: app.title,
      defaultIcons: app.icon,
    });
  });

  const matchUrls = urls.map((url) => {
    return url.replace(/^(https?:\/\/).*((?<=[\/\.])[^\/\.?]*\.[^\/\.?]*)[\/?]?.*$/g, "$1*.$2/*");
  });

  if (browser.webRequest.onBeforeSendHeaders.hasListener(changeUserAgent)) {
    browser.webRequest.onBeforeSendHeaders.removeListener(changeUserAgent);
  }

  browser.webRequest.onBeforeSendHeaders.addListener(changeUserAgent, { urls: matchUrls }, [
    "requestHeaders",
    "blocking",
  ]);
}

async function removeSpaces() {
  const spaces = await browser.spaces.query({ isSelfOwned: true });

  spaces.forEach(async (space) => {
    await browser.spaces.remove(space.id);
  });

  await storeApps([]);
}
