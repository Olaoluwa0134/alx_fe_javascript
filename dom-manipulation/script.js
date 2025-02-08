const quotes = [
  { text: "Knowledge is Power", category: "knowledge" },
  { text: "health is wealth", category: "health" },
];

function createAddQuoteForm() {
  const addDiv = document.createElement("div");
  addDiv.innerHTML = `
  <div>
      <input
        id="newQuoteText"
        type="text"
        placeholder="Enter a new quote"
      /><br /><br />
      <input
        id="newQuoteCategory"
        type="text"
        placeholder="Enter quote category"
      /><br /><br />
      <button onclick="addQuote()">Add Quote</button><br /><br />

    `;
  document.body.appendChild(addDiv);
}

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function addQuote() {
  let newQuoteText = document.getElementById("newQuoteText");
  let newQuoteCategory = document.getElementById("newQuoteCategory");

  const quote = { text: newQuoteText.value, category: newQuoteCategory.value };
  quotes.push(quote);

  newQuoteCategory.value = "";
  newQuoteText.value = "";
}

function displayRandomQuote() {
  const quoteDisplay = document.getElementById("showRandomQuote");
  quoteDisplay.style.display = "block";
  quoteDisplay.innerHTML = getRandomItem(quotes).text;
}

document.addEventListener("DOMContentLoaded", function () {
  const addQuoteForm = createAddQuoteForm();
  displayRandomQuote();
  newQuote.addEventListener("click", displayRandomQuote);
});
