chrome.storage.sync.get(["replacement", "excludedDomains"], (data) => {
  let replacement = data.replacement;
  if (typeof replacement !== "string" || replacement === "") {
    replacement = "Beebop Space Man";
  }

  let excludedDomains = data.excludedDomains;
  if (!Array.isArray(excludedDomains) || excludedDomains.length === 0) {
    excludedDomains = [
      "docs.google.com",
      "drive.google.com",
      "sheets.google.com",
      "slides.google.com",
      "office.com",
      "onenote.com",
      "onedrive.live.com",
      "outlook.com",
      "teams.microsoft.com",
      "slack.com",
      "zoom.us",
      "skype.com",
      "trello.com",
      "asana.com",
      "monday.com",
      "clickup.com",
      "basecamp.com",
      "todoist.com",
      "any.do",
      "notion.so",
      "evernote.com",
      "quip.com",
      "dropbox.com",
      "airtable.com",
      "miro.com",
      "atlassian.com",
      "zoho.com",
      "smartsheet.com",
      "wrike.com",
      "podio.com",
      "rescuetime.com",
      "clockify.me",
    ];
  }

  // Function to check if the current domain is excluded
  function shouldRun() {
    const hostname = window.location.hostname;
    return !excludedDomains.some((domain) => hostname.endsWith(domain));
  }

  if (!shouldRun()) {
    console.log(`Extension disabled on ${window.location.hostname}`);
    return;
  }

  const cachedPattern = /\b(?:elon\s*musk|elon|musk)\b/gi;
  const replacementCache = new Map();

  function replaceText(node, replacement) {
    const text = node.nodeValue;
    const cached = replacementCache.get(text);
    if (cached) {
      node.nodeValue = cached;
    } else {
      const newText = text.replace(cachedPattern, replacement);
      replacementCache.set(text, newText);
      node.nodeValue = newText;
    }
  }

  function walk(node, replacement) {
    if (node.nodeType === 1) {
      const tagName = node.tagName.toLowerCase();
      if (
        ["input", "textarea", "script"].includes(tagName) ||
        node.isContentEditable
      ) {
        return;
      }
    }

    let child, next;
    switch (node.nodeType) {
      case 1:
      case 9:
      case 11:
        child = node.firstChild;
        while (child) {
          next = child.nextSibling;
          walk(child, replacement);
          child = next;
        }
        break;
      case 3:
        if (cachedPattern.test(node.nodeValue)) {
          replaceText(node, replacement);
        }
        break;
    }
  }

  // Initial replacement for the current DOM
  walk(document.body, replacement);

  // Setup MutationObserver to handle dynamically added content
  const observer = new MutationObserver((mutations) => {
    requestAnimationFrame(() => {
      const uniqueNodes = new Set();
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => uniqueNodes.add(node));
      });
      uniqueNodes.forEach((node) => walk(node, replacement));
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
});
