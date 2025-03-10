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

// Save the settings when the button is clicked
document.getElementById("save").addEventListener("click", () => {
  const replacement = document.getElementById("replacement").value;
  const excludedDomainsValue = document.getElementById("excludedDomains").value;
  // Convert the textarea value into an array (split by newline, trim each, and filter out blanks)
  const excludedDomains = excludedDomainsValue
    .split("\n")
    .map((domain) => domain.trim())
    .filter((domain) => domain.length > 0);

  chrome.storage.sync.set({ replacement, excludedDomains }, () => {
    alert("Settings saved!");
  });
});

// Load the settings when the options page loads
document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.sync.get(["replacement", "excludedDomains"], (data) => {
    if (data.replacement) {
      document.getElementById("replacement").value = data.replacement;
    }
    // Use default excludedDomains if none are saved
    const excludedDomains =
      data.excludedDomains && Array.isArray(data.excludedDomains)
        ? data.excludedDomains
        : defaultExcludedDomains;

    document.getElementById("excludedDomains").value =
      excludedDomains.join("\n");
  });
});
