// content.js

// Function to replace text within a node
function replaceText(node, search, replacement) {
  const regex = new RegExp(search, "gi"); // 'gi' for global, case-insensitive search
  node.nodeValue = node.nodeValue.replace(regex, replacement);
}

// Recursive function to traverse the DOM tree
function walk(node, replacement) {
  // If node is an element and it's a SCRIPT with speculation rules, skip it.
  if (node.nodeType === 1 && node.tagName === "SCRIPT") {
    const type = node.getAttribute("type");
    if (type && type.includes("speculation")) {
      return;
    }
  }

  let child, next;
  switch (node.nodeType) {
    case 1: // Element
    case 9: // Document
    case 11: // Document fragment
      child = node.firstChild;
      while (child) {
        next = child.nextSibling;
        walk(child, replacement);
        child = next;
      }
      break;
    case 3: // Text node
      replaceText(node, "Elon Musk", replacement);
      replaceText(node, "Musk", replacement);
      break;
  }
}

// Retrieve the user's replacement word from storage (default if not set)
chrome.storage.sync.get("replacement", ({ replacement }) => {
  if (typeof replacement !== "string" || replacement === "") {
    replacement = "Beebop Space Man"; // Default word if none is set
  }

  // Initial replacement for the current DOM
  walk(document.body, replacement);

  // Setup MutationObserver to handle dynamically added content
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        walk(node, replacement);
      });
    });
  });

  // Start observing document.body for changes in the subtree
  observer.observe(document.body, { childList: true, subtree: true });
});
