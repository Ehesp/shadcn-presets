import { presetToShadcnThemeCss } from "shadcn-presets";

import "./popup.css";

const STYLE_ELEMENT_ID = "shadcn-presets-extension";
const RESTRICTED_PROTOCOLS = ["about:", "chrome:", "chrome-extension:", "edge:"];
const PRESET_FLAG_PATTERN = /(?:^|\s)--preset(?:=|\s+)(['"]?)([A-Za-z0-9]+)\1(?:\s|$)/;

type ActiveTabWithId = chrome.tabs.Tab & { id: number };

function getRequiredElement<T extends Element>(selector: string) {
  const element = document.querySelector<T>(selector);
  if (!element) {
    throw new Error(`Missing required element: ${selector}`);
  }

  return element;
}

const form = getRequiredElement<HTMLFormElement>("#preset-form");
const presetInput = getRequiredElement<HTMLInputElement>("#preset-input");
const applyButton = getRequiredElement<HTMLButtonElement>("#apply-button");
const statusMessage = getRequiredElement<HTMLParagraphElement>("#status-message");

function setStatus(state: "error" | "success" | "idle", message = "") {
  statusMessage.dataset.state = state === "idle" ? "" : state;
  statusMessage.textContent = message;
}

function supportsInjection(url?: string) {
  if (!url) {
    return true;
  }

  return !RESTRICTED_PROTOCOLS.some((protocol) => url.startsWith(protocol));
}

function normalizePresetInput(value: string) {
  const trimmedValue = value.trim();
  if (!trimmedValue) {
    return "";
  }

  const flagMatch = trimmedValue.match(PRESET_FLAG_PATTERN);
  if (flagMatch?.[2]) {
    return flagMatch[2];
  }

  return trimmedValue.replace(/^['"]|['"]$/g, "");
}

async function getActiveTab(): Promise<ActiveTabWithId> {
  const [activeTab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  if (!activeTab?.id) {
    throw new Error("Could not find an active browser tab.");
  }

  return activeTab as ActiveTabWithId;
}

function injectThemeCss(styleElementId: string, cssText: string) {
  let styleElement = document.getElementById(styleElementId) as HTMLStyleElement | null;

  if (!styleElement) {
    styleElement = document.createElement("style");
    styleElement.id = styleElementId;
    (document.head ?? document.documentElement).appendChild(styleElement);
  }

  styleElement.textContent = cssText;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const preset = normalizePresetInput(presetInput.value);
  setStatus("idle");

  if (!preset) {
    setStatus("error", "Paste a preset value before applying it.");
    return;
  }

  const result = presetToShadcnThemeCss(preset);
  if (!result) {
    setStatus("error", "That preset code is invalid or could not be resolved.");
    return;
  }
  const { css } = result;

  applyButton.disabled = true;
  applyButton.textContent = "Applying...";

  try {
    const activeTab = await getActiveTab();

    if (!supportsInjection(activeTab.url)) {
      throw new Error("This page does not allow extension script injection.");
    }

    await chrome.scripting.executeScript({
      target: { tabId: activeTab.id },
      func: injectThemeCss,
      args: [STYLE_ELEMENT_ID, css],
    });

    setStatus("success", `Applied preset ${preset} to the current tab.`);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Chrome could not inject CSS into the current page.";

    setStatus("error", message);
  } finally {
    applyButton.disabled = false;
    applyButton.textContent = "Apply preset";
  }
});
