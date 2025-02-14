// options.js

// Save the replacement word when the button is clicked
document.getElementById("save").addEventListener("click", () => {
  const replacement = document.getElementById("replacement").value;
  chrome.storage.sync.set({ replacement }, () => {
    alert("Replacement word saved: " + replacement);
  });
});

// Load the current replacement word when the options page loads
document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.sync.get("replacement", ({ replacement }) => {
    if (replacement) {
      document.getElementById("replacement").value = replacement;
    }
  });
});
