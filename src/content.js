const wordRegex = /\p{L}/u;
let emphasisRatio = 0.45;

// --- LISTENER ---

browser.runtime.onMessage.addListener((message) => {
  if (message?.type !== "download-text-content") {
    return undefined;
  }

  readBionic();
  return Promise.resolve({ ok: true });
});

browser.runtime.onMessage.addListener((message) => {
  if (message.type === "emphasisRatioValue") {
    emphasisRatio = message.value;
    readBionic();
  }
});

// --- DOM MANIPULATION ---
function readBionic() {
  getTextContent(document.body);
}

function getTextContent(node) {
  if (!node) {
    return;
  }

  if (node.nodeType === Node.TEXT_NODE) {
    const fragment = injectDOM(node.textContent);

    if (fragment) {
      node.replaceWith(fragment);
    }

    return;
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return;
  }

  if (["SCRIPT", "STYLE", "NOSCRIPT", "TEXTAREA"].includes(node.tagName)) {
    return;
  }

  for (const child of [...node.childNodes]) {
    getTextContent(child);
  }
}

function injectDOM(textContent) {
  if (!textContent) {
    return null;
  }

  const fragment = document.createDocumentFragment();
  let currentIndex = 0;

  while (currentIndex < textContent.length) {
    const wordStart = identifyWordStart(textContent, currentIndex);

    if (wordStart === -1) {
      fragment.append(document.createTextNode(textContent.slice(currentIndex)));
      break;
    }

    fragment.append(
      document.createTextNode(textContent.slice(currentIndex, wordStart)),
    );

    const wordEnd = identifyWordEnd(textContent, wordStart);
    const word = textContent.slice(wordStart, wordEnd);

    fragment.append(manipulateString(word));
    currentIndex = wordEnd;
  }

  return fragment;
}

function identifyWordStart(textContent, startIndex = 0) {
  for (let i = startIndex; i < textContent.length; i++) {
    if (wordRegex.test(textContent[i])) {
      return i;
    }
  }

  return -1;
}

function identifyWordEnd(textContent, wordStart) {
  let wordEnd = wordStart;

  while (wordEnd < textContent.length && wordRegex.test(textContent[wordEnd])) {
    wordEnd++;
  }

  return wordEnd;
}

function manipulateString(word, emphasisRatio = 0.45) {
  let emphasizedCharCount = emphasisRatio * word.length;

  if (!Number.isInteger(emphasizedCharCount)) {
    emphasizedCharCount = Math.round(emphasizedCharCount);
  }

  emphasizedCharCount = Math.max(1, emphasizedCharCount);

  const emphasizedPart = word.slice(0, emphasizedCharCount);
  const remainingPart = word.slice(emphasizedCharCount);
  const fragment = document.createDocumentFragment();
  const strongElement = document.createElement("strong");

  strongElement.textContent = emphasizedPart;
  fragment.append(strongElement);

  if (remainingPart) {
    fragment.append(document.createTextNode(remainingPart));
  }

  return fragment;
}
