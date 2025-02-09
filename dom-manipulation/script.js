const quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "Knowledge is Power", category: "knowledge" },
  { text: "Health is Wealth", category: "health" },
];

// Function to save quotes to local storage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Function to populate the category filter dropdown
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';

  const categories = [...new Set(quotes.map((q) => q.category))];
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  // Restore last selected category
  const lastSelectedCategory = localStorage.getItem("lastSelectedCategory");
  if (lastSelectedCategory) {
    categoryFilter.value = lastSelectedCategory;
    filterQuotes();
  }
}

// Function to filter and display quotes based on the selected category
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem("lastSelectedCategory", selectedCategory);

  const filteredQuotes =
    selectedCategory === "all"
      ? quotes
      : quotes.filter((q) => q.category === selectedCategory);

  displayQuotes(filteredQuotes);
}

// Function to display quotes
function displayQuotes(quoteList) {
  const quoteDisplay = document.getElementById("quoteContainer");
  quoteDisplay.innerHTML = "";

  quoteList.forEach((quote) => {
    const div = document.createElement("div");
    div.classList.add("quote-item");
    div.textContent = `${quote.text} - (${quote.category})`;
    quoteDisplay.appendChild(div);
  });
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
  saveQuotes();
  populateCategories(); // Update category filter
  filterQuotes(); // Refresh quote display

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
}

// Function to export quotes as JSON
function exportQuotes() {
  const dataStr =
    "data:text/json;charset=utf-8," +
    encodeURIComponent(JSON.stringify(quotes));
  const downloadAnchor = document.createElement("a");
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", "quotes.json");
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  document.body.removeChild(downloadAnchor);
}

// Function to import quotes from JSON file
function importQuotes(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories();
        filterQuotes();
      }
    } catch (error) {
      alert("Invalid JSON file");
    }
  };
  reader.readAsText(file);
}

// Initialize the app on page load
document.addEventListener("DOMContentLoaded", function () {
  populateCategories();
  filterQuotes();
  document
    .getElementById("exportQuotes")
    .addEventListener("click", exportQuotes);
  document
    .getElementById("importFile")
    .addEventListener("change", importQuotes);
});
