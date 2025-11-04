// Dark Mode Toggle
const themeToggle = document.querySelector(".theme-toggle");
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  if (document.body.classList.contains("dark-mode")) {
    themeToggle.textContent = "☀️";
  } else {
    themeToggle.textContent = "🌙";
  }
});

// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
const mainNav = document.querySelector(".main-nav");

mobileMenuBtn.addEventListener("click", () => {
  mainNav.classList.toggle("active");

  // Change hamburger icon to X when menu is open
  if (mainNav.classList.contains("active")) {
    mobileMenuBtn.textContent = "✕";
  } else {
    mobileMenuBtn.textContent = "☰";
  }
});

// Close menu when clicking outside
document.addEventListener("click", (e) => {
  if (!mobileMenuBtn.contains(e.target) && !mainNav.contains(e.target)) {
    mainNav.classList.remove("active");
    mobileMenuBtn.textContent = "☰";
  }
});

// Update Last Modified Date
document.getElementById("last-modified").textContent += document.lastModified;

// Business Card Interaction
const businessCards = document.querySelectorAll(".business-card");
businessCards.forEach((card) => {
  card.addEventListener("click", () => {
    // In a real implementation, this would navigate to the business detail page
    alert(
      "Viewing business details - this would navigate to a detail page in a full implementation"
    );
  });
});

// Membership Banner Close Functionality
const membershipBanner = document.querySelector(".membership-banner");
if (membershipBanner) {
  setTimeout(() => {
    membershipBanner.style.display = "none";
  }, 10000); // Hide after 10 seconds
}

// CTA Button Functionality
const ctaButtons = document.querySelectorAll(".cta-button");
ctaButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (button.textContent.includes("Become a Member")) {
      window.location.href = "#join";
    } else if (button.textContent.includes("Learn More")) {
      alert("Redirecting to membership information page");
    }
  });
});

// Hero Button Functionality
const heroButton = document.querySelector(".hero button");
if (heroButton) {
  heroButton.addEventListener("click", () => {
    window.location.href = "#events";
  });
}

// Simple Weather Data Update (in a real implementation, this would fetch from an API)
function updateWeather() {
  // This is a placeholder for actual weather API integration
  console.log("Weather data would be updated here");
}

// Initialize
updateWeather();

// js/directory.js

const dataURL = "data/members.json";
const membersContainer = document.querySelector("#members-container");
// Select the buttons for view toggling (assuming you have them in your HTML)
const gridbutton = document.querySelector("#grid-view-btn");
const listbutton = document.querySelector("#list-view-btn");

// --- Main Data Fetching Function ---
async function getMemberData() {
  try {
    const response = await fetch(dataURL);
    const data = await response.json();
    // Start in 'grid' view by default (matching the initial CSS class)
    displayMembers(data.companies, "grid");
  } catch (error) {
    console.error("Error fetching member data:", error);
  }
}

// --- Dynamic Display Function ---
function displayMembers(companies, viewType) {
  membersContainer.innerHTML = ""; // Clear existing content

  // Set the appropriate class for styling the container
  membersContainer.className = "";
  membersContainer.classList.add(viewType); // 'grid' or 'list'

  companies.forEach((company) => {
    // Create the card/list item container
    let memberCard = document.createElement("section");
    memberCard.classList.add("member-card");

    // Content elements
    let name = document.createElement("h3");
    let address = document.createElement("p");
    let phone = document.createElement("p");
    let website = document.createElement("a");
    let image = document.createElement("img");
    let membership = document.createElement("p");

    // Populate elements
    name.textContent = company.name;
    address.textContent = company.address;
    phone.textContent = company.phone;

    website.textContent = company.website;
    website.href = company.website;
    website.target = "_blank"; // Open in new tab

    image.setAttribute("src", `images/${company.imagefile}`); // Assuming images are in an 'images' folder
    image.setAttribute("alt", `Logo of ${company.name}`);
    image.setAttribute("loading", "lazy");

    // Display membership level text
    let levelText = "";
    if (company.membershiplevel === 3) levelText = "Gold Member";
    else if (company.membershiplevel === 2) levelText = "Silver Member";
    else levelText = "Basic Member";
    membership.textContent = levelText;
    membership.classList.add(`level-${company.membershiplevel}`);

    // Append elements to the card
    memberCard.appendChild(name);
    memberCard.appendChild(image);
    memberCard.appendChild(address);
    memberCard.appendChild(phone);
    memberCard.appendChild(website);
    memberCard.appendChild(membership);

    // Append the card to the main container
    membersContainer.appendChild(memberCard);
  });
}

// --- Toggle Event Listeners ---
gridbutton.addEventListener("click", () => {
  // Read the data directly from the container if it exists, or re-fetch
  if (membersContainer.classList.contains("list")) {
    // A simpler approach: just change the class and let CSS handle the rest
    membersContainer.classList.replace("list", "grid");
  }
});

listbutton.addEventListener("click", () => {
  if (membersContainer.classList.contains("grid")) {
    membersContainer.classList.replace("grid", "list");
  }
});

// Initial function call to start the process
getMemberData();
