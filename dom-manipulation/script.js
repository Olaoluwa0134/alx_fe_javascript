const quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "Knowledge is Power", category: "knowledge" },
  { text: "Health is Wealth", category: "health" },
];

// Function to save quotes to local storage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Function to create the add quote form
function createAddQuoteForm() {
  const addDiv = document.createElement("div");
  addDiv.innerHTML = `
    <div>
      <input id="newQuoteText" type="text" placeholder="Enter a new quote" /><br /><br />
      <input id="newQuoteCategory" type="text" placeholder="Enter quote category" /><br /><br />
      <button id="addQuoteButton">Add Quote</button><br /><br />
      <button id="exportQuotes">Export Quotes</button>
      <input type="file" id="importFile" accept=".json" /><br /><br />
      <div id="showRandomQuote"></div>
    </div>
  `;

  document.body.appendChild(addDiv);
  document.getElementById("addQuoteButton").addEventListener("click", addQuote);
  document
    .getElementById("exportQuotes")
    .addEventListener("click", exportToJsonFile);
  document
    .getElementById("importFile")
    .addEventListener("change", importFromJsonFile);
}

// Function to get a random item from an array
function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Function to add a new quote
function addQuote() {
  let newQuoteText = document.getElementById("newQuoteText").value;
  let newQuoteCategory = document.getElementById("newQuoteCategory").value;

  if (newQuoteText.trim() === "" || newQuoteCategory.trim() === "") {
    alert("Please fill in both fields!");
    return;
  }

  const quote = { text: newQuoteText, category: newQuoteCategory };
  quotes.push(quote);
  saveQuotes(); // Save quotes to local storage

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
}

// Function to display a random quote
function displayRandomQuote() {
  const quoteDisplay = document.getElementById("showRandomQuote");
  if (!quoteDisplay) return;

  const randomQuote = getRandomItem(quotes);
  console.log(randomQuote);
  quoteDisplay.style.display = "block";
  quoteDisplay.innerHTML = randomQuote.text;

  sessionStorage.setItem("lastViewedQuote", randomQuote.text); // Store last viewed quote in session storage
}

// Function to export quotes as a JSON file
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      if (!Array.isArray(importedQuotes)) throw new Error("Invalid format");

      quotes.push(...importedQuotes);
      saveQuotes();
      alert("Quotes imported successfully!");
    } catch (error) {
      alert("Error importing file: Invalid JSON format.");
    }
  };
  fileReader.readAsText(file);
}

// Initialize the app on page load
document.addEventListener("DOMContentLoaded", function () {
  createAddQuoteForm();

  // Restore last viewed quote from session storage
  const lastViewedQuote = sessionStorage.getItem("lastViewedQuote");
  if (lastViewedQuote) {
    console.log(lastViewedQuote);
    document.getElementById("showRandomQuote").innerText = lastViewedQuote;
    document.getElementById("showRandomQuote").style.display = "block";
  }
  newQuote.addEventListener("click", displayRandomQuote);
});
