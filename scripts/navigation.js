// Responsive Navigation Menu Handler

const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("nav-menu");

// Toggle menu on hamburger click
hamburger.addEventListener("click", () => {
  navMenu.classList.toggle("active");

  // Change hamburger icon
  const icon = hamburger.querySelector("span");
  if (navMenu.classList.contains("active")) {
    icon.textContent = "✕";
  } else {
    icon.textContent = "☰";
  }
});

// Close menu when clicking on a link (mobile)
const navLinks = document.querySelectorAll(".nav-menu a");
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("active");
    const icon = hamburger.querySelector("span");
    icon.textContent = "☰";
  });
});
