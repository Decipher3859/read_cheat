const wordRegex = /\p{L}/u;

browser.runtime.onMessage.addListener((message) => {
  if (message?.type !== "download-text-content") {
    return undefined;
  }

  readBionic();
  return Promise.resolve({ ok: true });
});

function readBionic() {
  getTextContent(document.body);
}

function getTextContent(node) {
  if (!node) {
    return;
  }

  if (node.nodeType === Node.TEXT_NODE) {
    node.textContent = injectDOM(node.textContent);
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return;
  }

  for (const child of node.childNodes) {
    getTextContent(child);
  }
}

function injectDOM(textContent) {
  if (!textContent) {
    return textContent;
  }

  let newTextContent = "";
  let currentIndex = 0;

  while (currentIndex < textContent.length) {
    const wordStart = identifyWordStart(textContent, currentIndex);

    if (wordStart === -1) {
      newTextContent += textContent.slice(currentIndex);
      break;
    }

    newTextContent += textContent.slice(currentIndex, wordStart);

    const wordEnd = identifyWordEnd(textContent, wordStart);
    const word = textContent.slice(wordStart, wordEnd);

    newTextContent += manipulateString(word);
    currentIndex = wordEnd;
  }

  return newTextContent;
}

function downloadTextContent(textContent) {
  if (!textContent) {
    return;
  }

  const blob = new Blob([textContent], { type: "text/plain" });
  const link = document.createElement("a");

  link.href = URL.createObjectURL(blob);
  link.download = "page.txt";
  link.click();

  URL.revokeObjectURL(link.href);
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

function manipulateString(word) {
  return `${word}${word.length}`;
}
