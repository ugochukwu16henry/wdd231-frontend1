// prophets.js

// 1. Declare const variable 'url'
const url =
  "https://byui-cse.github.io/cse-ww-program/data/latter-day-prophets.json";

// 2. Declare const variable 'cards'
const cards = document.querySelector("#cards");

// 3. Create async function 'getProphetData'
async function getProphetData() {
  const response = await fetch(url);
  const data = await response.json();
  // console.table(data.prophets); // Commented out after initial testing
  displayProphets(data.prophets); // Call displayProphets with the 'prophets' array
}

// 4. Define function expression 'displayProphets'
const displayProphets = (prophets) => {
  prophets.forEach((prophet) => {
    // Create elements to add to the div.cards element
    let card = document.createElement("section");
    // fill in the blank: h2
    let fullName = document.createElement("h2");
    let portrait = document.createElement("img");

    // Additional elements for DoB and PoB as required by the final steps
    let birthDate = document.createElement("p");
    let birthPlace = document.createElement("p");

    // Build the h2 content out to show the prophet's full name
    // fill in the blank: name, lastname
    fullName.textContent = `${prophet.name} ${prophet.lastname}`;

    // Add DoB and PoB content
    birthDate.textContent = `Date of Birth: ${prophet.birthdate}`;
    birthPlace.textContent = `Place of Birth: ${prophet.birthplace}`;

    // Build the image portrait by setting all the relevant attributes
    portrait.setAttribute("src", prophet.imageurl);
    // fill in the blank: name, lastname
    portrait.setAttribute(
      "alt",
      `Portrait of ${prophet.name} ${prophet.lastname}`
    );
    portrait.setAttribute("loading", "lazy");
    portrait.setAttribute("width", "340");
    portrait.setAttribute("height", "440");

    // Append the section(card) with the created elements
    // fill in the blank: fullName
    card.appendChild(fullName);
    // Add DoB and PoB to the card before the image
    card.appendChild(birthDate);
    card.appendChild(birthPlace);
    card.appendChild(portrait);

    // Add the completed card to the 'cards' div
    cards.appendChild(card);
  }); // end of arrow function and forEach loop
};

// 5. Call the function 'getProphetData'
getProphetData();
