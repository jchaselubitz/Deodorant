chrome.storage.sync.get(["replacementPairs", "excludedDomains"], (data) => {
  let replacementPairs = data.replacementPairs;
  if (!Array.isArray(replacementPairs) || replacementPairs.length === 0) {
    replacementPairs = [
      {
        find: "elon musk",
        replace: "Beebop Space Man",
      },
    ];
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

  const replacementCache = new Map();

  // Create a regex pattern from all the "find" terms
  const patterns = replacementPairs.map((pair) => ({
    regex: new RegExp(`\\b(?:${pair.find})\\b`, "gi"),
    replacement: pair.replace,
  }));

  function replaceText(node) {
    const text = node.nodeValue;
    const cached = replacementCache.get(text);
    if (cached) {
      node.nodeValue = cached;
    } else {
      let newText = text;
      patterns.forEach(({ regex, replacement }) => {
        newText = newText.replace(regex, replacement);
      });
      replacementCache.set(text, newText);
      node.nodeValue = newText;
    }
  }

  function walk(node) {
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
          walk(child);
          child = next;
        }
        break;
      case 3:
        if (patterns.some(({ regex }) => regex.test(node.nodeValue))) {
          replaceText(node);
        }
        break;
    }
  }

  // Initial replacement for the current DOM
  walk(document.body);

  // Setup MutationObserver to handle dynamically added content
  const observer = new MutationObserver((mutations) => {
    requestAnimationFrame(() => {
      const uniqueNodes = new Set();
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => uniqueNodes.add(node));
      });
      uniqueNodes.forEach((node) => walk(node));
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
});
