import { createSpaces, removeSpaces, hashSpaceName } from "../scripts/spaces.mjs";
import { getApps, storeApps } from "../scripts/storage.mjs";

function buildInputRow(name, value) {
  const td = document.createElement("td");

  const input = document.createElement("input");
  input.setAttribute("type", "text");
  input.setAttribute("name", name);
  input.setAttribute("value", value);

  td.appendChild(input);
  return td;
}

function buildSpaceElement(app) {
  const tr = document.createElement("tr");
  tr.className = "space";

  tr.appendChild(buildInputRow("title", app.title));
  tr.appendChild(buildInputRow("url", app.url));
  tr.appendChild(buildInputRow("badgeBackgroundColor", app.badgeBackgroundColor));

  const removeTd = document.createElement("td");
  const removeButton = document.createElement("button");
  removeButton.setAttribute("type", "button");
  removeButton.addEventListener("click", removeSpace);
  removeButton.textContent = "Remove";
  removeTd.appendChild(removeButton);

  tr.appendChild(removeTd);
  return tr;
}

async function setupPage() {
  const apps = await getApps();
  const spaces = document.querySelector("#spaces > tbody");

  apps.forEach((app) => {
    spaces.appendChild(buildSpaceElement(app));
  });
}

function addSpace() {
  const spaces = document.querySelector("#spaces > tbody");
  const newApp = {
    title: "",
    url: "",
    badgeBackgroundColor: "",
  };
  spaces.appendChild(buildSpaceElement(newApp));
}

function removeSpace(e) {
  e.target.parentElement.parentElement.remove();
}

async function saveChanges(e) {
  await e.preventDefault();

  const apps = [];

  const spaces = Array.from(document.getElementsByClassName("space"));
  spaces.forEach((space) => {
    const app = {
      name: hashSpaceName(space.querySelector("input[name='url']").value),
      title: space.querySelector("input[name='title']").value,
      url: space.querySelector("input[name='url']").value,
      badgeBackgroundColor: space.querySelector("input[name='badgeBackgroundColor']").value,
    };
    apps.push(app);
  });

  await removeSpaces();
  await storeApps(apps);
  await createSpaces();
}

document.addEventListener("DOMContentLoaded", setupPage);
document.getElementById("add").addEventListener("click", addSpace);
document.querySelector("form").addEventListener("submit", saveChanges);
