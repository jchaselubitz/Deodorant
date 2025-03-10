// Define the default excluded domains list
const defaultExcludedDomains = [
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

// Create a new replacement pair input group
function createReplacementPairElement(find = "", replace = "") {
  const pairDiv = document.createElement("div");
  pairDiv.className = "replacement-pair";

  const findInput = document.createElement("input");
  findInput.type = "text";
  findInput.className = "find-input";
  findInput.placeholder = "Word to replace";
  findInput.value = find;

  const replaceInput = document.createElement("input");
  replaceInput.type = "text";
  replaceInput.className = "replace-input";
  replaceInput.placeholder = "Replace with";
  replaceInput.value = replace;

  const removeButton = document.createElement("button");
  removeButton.className = "remove-pair";
  removeButton.textContent = "✕";
  removeButton.onclick = () => pairDiv.remove();

  pairDiv.appendChild(findInput);
  pairDiv.appendChild(replaceInput);
  pairDiv.appendChild(removeButton);

  return pairDiv;
}

// Add new replacement pair inputs
document.getElementById("addPair").addEventListener("click", () => {
  const container = document.getElementById("replacementPairs");
  container.appendChild(createReplacementPairElement());
});

// Save all settings
document.getElementById("save").addEventListener("click", () => {
  // Collect all replacement pairs
  const pairs = Array.from(document.getElementsByClassName("replacement-pair"))
    .map((pair) => ({
      find: pair.querySelector(".find-input").value.trim(),
      replace: pair.querySelector(".replace-input").value.trim(),
    }))
    .filter((pair) => pair.find && pair.replace); // Only save pairs where both inputs have values

  const excludedDomainsValue = document.getElementById("excludedDomains").value;
  const excludedDomains = excludedDomainsValue
    .split("\n")
    .map((domain) => domain.trim())
    .filter((domain) => domain.length > 0);

  chrome.storage.sync.set({ replacementPairs: pairs, excludedDomains }, () => {
    alert("Settings saved!");
  });
});

// Load settings when the options page loads
document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.sync.get(["replacementPairs", "excludedDomains"], (data) => {
    const container = document.getElementById("replacementPairs");

    // Load replacement pairs
    const pairs = data.replacementPairs || [
      {
        find: "elon musk",
        replace: "Beebop Space Man",
      },
    ];

    pairs.forEach((pair) => {
      container.appendChild(
        createReplacementPairElement(pair.find, pair.replace)
      );
    });

    // Load excluded domains
    const excludedDomains =
      data.excludedDomains && Array.isArray(data.excludedDomains)
        ? data.excludedDomains
        : defaultExcludedDomains;

    document.getElementById("excludedDomains").value =
      excludedDomains.join("\n");
  });
});
