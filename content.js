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
    // Adjust the condition based on how speculation rules are identified.
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
  walk(document.body, replacement);
});
