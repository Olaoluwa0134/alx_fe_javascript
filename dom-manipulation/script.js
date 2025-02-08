const quotes = [
  { text: "Knowledge is Power", category: "knowledge" },
  { text: "health is wealth", category: "health" },
];

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
  quoteDisplay.textContent = getRandomItem(quotes).text;
}

document.addEventListener("DOMContentLoaded", function () {
  displayRandomQuote();
  newQuote.addEventListener("click", displayRandomQuote);
});
