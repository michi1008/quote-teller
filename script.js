// Get Quotes from API
const quoteContainer = document.getElementById('quote-container');
const quoteText = document.getElementById('quote');
const authorText = document.getElementById('author');
const newQuoteBtn = document.getElementById("new-quote");
const audioElement = document.getElementById('audio');
const loader = document.getElementById('loader');


// Show Loading
function loading() {
  loader.hidden = false;
  quoteContainer.hidden = true;
}

// Hide Loading
function complete() {
  if (!loader.hidden) {
      quoteContainer.hidden = false;
      loader.hidden = true;
  }
}


// Disable/Enable Button
function toggleButton() {
  newQuoteBtn.disabled = !newQuoteBtn.disabled;
}

function tellMe(quote) {
  VoiceRSS.speech({
      key: '91c7325e7ed5452884b2438ad55b2e61',
      src: quote,
      hl: 'en-us',
      v: 'Linda',
      r: 0, 
      c: 'mp3',
      f: '44khz_16bit_stereo',
      ssml: false

  });
}



// // Show New Quote
function newQuote(result) {
  loading();

  // Check if Author field is blank and replace it with 'Unknown'
  if (!result[0].author) {
    authorText.textContent = "Unknown";
  } else {
    authorText.textContent = result[0].author;
  }
  // Check Quote length to determine styling
  if (result[0].quote.length > 120) {
    quoteText.classList.add("long-quote");
  } else {
    quoteText.classList.remove("long-quote");
  }
  // Set Quote, Hide Loader
  quoteText.textContent = result[0].quote;
  complete();
}

// Get Quotes From API
async function getQuotes() {
  // Get the selected category
  let selectedCategory = document.getElementById("category").value;

  try {
    const url =
      "https://api.api-ninjas.com/v1/quotes?category=" + selectedCategory;
    const apiKey = "UjlGNJsuyiHHVGHirCga1Q==nhkDElT2f0JCRsv8";

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "X-Api-Key": apiKey,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error: " + response.statusText);
    }

    const result = await response.json();
    console.log(result)
    if (!result || result.length === 0) {
      throw new Error("Error: Empty or invalid response from the API");
    }

    // Set Quote
    quoteText.textContent = result[0].quote
    authorText.textContent = result[0].author
    tellQuote = result[0].quote + 'by' + result[0].author
    newQuote(result)
    tellMe(tellQuote)
    toggleButton()
  } catch (error) {
    console.error("Error: ", error.message);
  }
}

// Add eventlistener to button
newQuoteBtn.addEventListener("click", getQuotes);
audioElement.addEventListener('ended', toggleButton);

