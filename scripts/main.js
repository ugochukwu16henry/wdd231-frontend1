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

document.addEventListener("DOMContentLoaded", function () {
  // Mobile menu toggle
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
  const navMenu = document.querySelector("nav ul");

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", function () {
      navMenu.classList.toggle("active");
    });
  }

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
});
