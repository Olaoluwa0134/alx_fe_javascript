const quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "Knowledge is Power", category: "knowledge" },
  { text: "Health is Wealth", category: "health" },
];

// Function to save quotes to local storage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Function to get unique categories from quotes
function getUniqueCategories() {
  const categories = quotes.map((quote) => quote.category);
  return [...new Set(categories)];
}

// Function to populate category filter dropdown
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  const categories = getUniqueCategories();

  // Clear existing options except "All Categories"
  while (categoryFilter.options.length > 1) {
    categoryFilter.remove(1);
  }

  // Add categories to dropdown
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    categoryFilter.appendChild(option);
  });

  // Restore last selected category from localStorage
  const lastSelectedCategory = localStorage.getItem("lastSelectedCategory");
  if (lastSelectedCategory) {
    categoryFilter.value = lastSelectedCategory;
  }
}

// Function to filter and display quotes
function filterQuotes() {
  const categoryFilter = document.getElementById("categoryFilter");
  const selectedCategory = categoryFilter.value;
  const quoteContainer = document.getElementById("quoteContainer");

  // Save selected category to localStorage
  localStorage.setItem("lastSelectedCategory", selectedCategory);

  // Filter quotes based on selected category
  const filteredQuotes =
    selectedCategory === "all"
      ? quotes
      : quotes.filter((quote) => quote.category === selectedCategory);

  // Clear current quotes display
  quoteContainer.innerHTML = "";

  // Display filtered quotes
  filteredQuotes.forEach((quote) => {
    const quoteDiv = document.createElement("div");
    quoteDiv.className = "quote-item";
    quoteDiv.innerHTML = `
      <div>
        <strong>${quote.text}</strong>
        <br>
        <small>Category: ${quote.category}</small>
      </div>
      <button onclick="deleteQuote('${quote.text}')" class="delete-btn">Delete</button>
    `;
    quoteContainer.appendChild(quoteDiv);
  });
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

  // Event listeners for buttons
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

  const quote = {
    text: newQuoteText,
    category: newQuoteCategory.toLowerCase(),
  };

  quotes.push(quote);
  saveQuotes();

  // Clear input fields
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  // Update categories and refresh display
  populateCategories();
  filterQuotes();
}

// Function to delete quote
function deleteQuote(quoteText) {
  const index = quotes.findIndex((quote) => quote.text === quoteText);
  if (index !== -1) {
    quotes.splice(index, 1);
    saveQuotes();
    populateCategories();
    filterQuotes();
  }
}

// Function to display a random quote
function displayRandomQuote() {
  const quoteDisplay = document.getElementById("showRandomQuote");
  if (!quoteDisplay) return;
  const randomQuote = getRandomItem(quotes);
  quoteDisplay.style.display = "block";
  quoteDisplay.innerHTML = randomQuote.text;
  sessionStorage.setItem("lastViewedQuote", randomQuote.text);
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
      populateCategories(); // Update categories after import
      filterQuotes(); // Refresh the display
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
  populateCategories(); // Initialize categories
  filterQuotes(); // Show initial quotes
  displayRandomQuote();

  // Restore last viewed quote from session storage
  const lastViewedQuote = sessionStorage.getItem("lastViewedQuote");
  if (lastViewedQuote) {
    document.getElementById("showRandomQuote").innerText = lastViewedQuote;
  }
});
