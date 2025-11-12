// OpenWeatherMap API Configuration (Free Tier)
const WEATHER_API_KEY = "da30ce22c9b196b583ee7cdbebdc9ecc";
const CITY = "Uyo";
const COUNTRY_CODE = "NG";
const UNITS = "imperial"; // Use 'metric' for Celsius

// Dark Mode Toggle
const themeToggle = document.querySelector(".theme-toggle");
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    if (document.body.classList.contains("dark-mode")) {
      themeToggle.textContent = "☀️";
    } else {
      themeToggle.textContent = "🌙";
    }
  });
}

// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
const mainNav = document.querySelector(".main-nav");

if (mobileMenuBtn && mainNav) {
  mobileMenuBtn.addEventListener("click", () => {
    mainNav.classList.toggle("active");
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
}

// Hero Slideshow
let currentSlide = 0;
const slides = document.querySelectorAll(".hero-slide");
const dots = document.querySelectorAll(".dot");

function showSlide(index) {
  // Remove active class from all slides and dots
  slides.forEach((slide) => slide.classList.remove("active"));
  dots.forEach((dot) => dot.classList.remove("active"));

  // Add active class to current slide and dot
  slides[index].classList.add("active");
  dots[index].classList.add("active");
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}

// Auto-advance slides every 5 seconds
let slideInterval = setInterval(nextSlide, 5000);

// Dot navigation
dots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    currentSlide = index;
    showSlide(currentSlide);

    // Reset the interval when user manually changes slide
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 5000);
  });
});

// Initialize first slide
if (slides.length > 0) {
  showSlide(0);
}

// Fetch Weather Data from OpenWeatherMap API (Free Tier - 2.5 API)
async function fetchWeatherData() {
  try {
    // Current Weather - Free API 2.5
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${CITY},${COUNTRY_CODE}&appid=${WEATHER_API_KEY}&units=${UNITS}`;
    const currentResponse = await fetch(currentWeatherUrl);

    if (!currentResponse.ok) {
      throw new Error(`Weather API Error: ${currentResponse.status}`);
    }

    const currentData = await currentResponse.json();

    // 5-Day/3-Hour Forecast - Free API 2.5
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${CITY},${COUNTRY_CODE}&appid=${WEATHER_API_KEY}&units=${UNITS}`;
    const forecastResponse = await fetch(forecastUrl);

    if (!forecastResponse.ok) {
      throw new Error(`Forecast API Error: ${forecastResponse.status}`);
    }

    const forecastData = await forecastResponse.json();

    // Update UI with weather data
    updateCurrentWeather(currentData);
    updateForecast(forecastData);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    displayWeatherError();
  }
}

// Update Current Weather Display
function updateCurrentWeather(data) {
  const weatherIcon = document.querySelector(".weather-icon");
  const weatherInfo = document.querySelector(".weather-info");

  if (!weatherInfo) return;

  const temp = Math.round(data.main.temp);
  const description = data.weather[0].description;
  const high = Math.round(data.main.temp_max);
  const low = Math.round(data.main.temp_min);
  const humidity = data.main.humidity;

  // Handle sunrise/sunset times
  const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString(
    "en-US",
    {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }
  );
  const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  // Get weather icon
  const iconCode = data.weather[0].icon;
  const weatherEmoji = getWeatherEmoji(iconCode);

  if (weatherIcon) {
    weatherIcon.textContent = weatherEmoji;
  }

  weatherInfo.innerHTML = `
    <p><strong>${temp}°F</strong></p>
    <p>${capitalizeWords(description)}</p>
    <p>High: ${high}°F</p>
    <p>Low: ${low}°F</p>
    <p>Humidity: ${humidity}%</p>
    <p>Sunrise: ${sunrise}</p>
    <p>Sunset: ${sunset}</p>
  `;
}

// Update 3-Day Forecast Display
function updateForecast(data) {
  const forecastList = document.querySelector(".weather-forecast ul");

  if (!forecastList) return;

  // Process 5-day/3-hour forecast data to get daily forecasts
  const dailyForecasts = [];
  const processedDates = new Set();

  // Get today's date string for comparison
  const today = new Date().toDateString();

  for (const item of data.list) {
    const forecastDate = new Date(item.dt * 1000);
    const dateString = forecastDate.toDateString();

    // Skip today, get next 3 days around midday (12:00 PM)
    if (
      dateString !== today &&
      !processedDates.has(dateString) &&
      dailyForecasts.length < 3
    ) {
      // Get the forecast closest to noon for each day
      const hour = forecastDate.getHours();
      if (hour >= 11 && hour <= 14) {
        dailyForecasts.push({
          date: forecastDate,
          temp: Math.round(item.main.temp),
          description: item.weather[0].description,
        });
        processedDates.add(dateString);
      }
    }

    // Stop if we have 3 days
    if (dailyForecasts.length >= 3) break;
  }

  // Build forecast HTML
  let forecastHTML = "";
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  dailyForecasts.forEach((forecast, index) => {
    const dayName = days[forecast.date.getDay()];
    forecastHTML += `
      <li>${dayName}: <strong>${forecast.temp}°F</strong> - ${capitalizeWords(
      forecast.description
    )}</li>
    `;
  });

  // If we don't have enough forecasts, fill remaining slots
  if (dailyForecasts.length < 3) {
    for (let i = dailyForecasts.length; i < 3; i++) {
      forecastHTML += `<li>Day ${i + 1}: <strong>--°F</strong></li>`;
    }
  }

  forecastList.innerHTML = forecastHTML;
}

// Get appropriate emoji for weather condition
function getWeatherEmoji(iconCode) {
  const emojiMap = {
    "01d": "☀️",
    "01n": "🌙",
    "02d": "⛅",
    "02n": "☁️",
    "03d": "☁️",
    "03n": "☁️",
    "04d": "☁️",
    "04n": "☁️",
    "09d": "🌧️",
    "09n": "🌧️",
    "10d": "🌦️",
    "10n": "🌧️",
    "11d": "⛈️",
    "11n": "⛈️",
    "13d": "❄️",
    "13n": "❄️",
    "50d": "🌫️",
    "50n": "🌫️",
  };
  return emojiMap[iconCode] || "🌤️";
}

// Capitalize first letter of each word
function capitalizeWords(str) {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
}

// Display error message if weather fetch fails
function displayWeatherError() {
  const weatherInfo = document.querySelector(".weather-info");
  if (weatherInfo) {
    weatherInfo.innerHTML = "<p>Unable to load weather data</p>";
  }
}

// Fetch Company Data and Display Spotlights
async function fetchAndDisplaySpotlights() {
  try {
    const response = await fetch("../data/members.json"); // Update path as needed

    if (!response.ok) {
      throw new Error("Failed to fetch company data");
    }

    const data = await response.json();
    const companies = data.companies;

    // Filter gold (3) and silver (2) members
    const qualifiedMembers = companies.filter(
      (company) =>
        company.membershiplevel === 2 || company.membershiplevel === 3
    );

    // Randomly select 2-3 companies
    const spotlightCount = Math.random() < 0.5 ? 2 : 3;
    const selectedCompanies = getRandomCompanies(
      qualifiedMembers,
      spotlightCount
    );

    // Display spotlights
    displaySpotlights(selectedCompanies);
  } catch (error) {
    console.error("Error fetching company data:", error);
    displaySpotlightError();
  }
}

// Get random companies from array
function getRandomCompanies(companies, count) {
  const shuffled = [...companies].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// Display spotlight cards
function displaySpotlights(companies) {
  const businessCardsContainer = document.querySelector(".business-cards");

  if (!businessCardsContainer) return;

  businessCardsContainer.innerHTML = "";

  companies.forEach((company) => {
    const card = createSpotlightCard(company);
    businessCardsContainer.appendChild(card);
  });
}

// Create individual spotlight card
function createSpotlightCard(company) {
  const article = document.createElement("article");
  article.className = "business-card";

  const membershipLevel = getMembershipLevelText(company.membershiplevel);
  const membershipBadge =
    company.membershiplevel === 3 ? "🥇 Gold" : "🥈 Silver";

  article.innerHTML = `
    <h3>${company.name}</h3>
    <p class="category">${membershipBadge} Member</p>
    <div class="business-card-content">
      <div class="business-image">
        <img src="images/${company.imagefile}" alt="${company.name} logo" 
             onerror="this.style.display='none'; this.parentElement.innerHTML='<i class=\\'fas fa-building fa-2x\\'></i>'">
      </div>
      <div class="business-details">
        <p><strong>PHONE:</strong> ${company.phone}</p>
        <p><strong>ADDRESS:</strong> ${company.address}</p>
        <p><strong>URL:</strong> <a href="${
          company.website
        }" target="_blank">${company.website
    .replace("https://www.", "")
    .replace("https://", "")}</a></p>
        <p><strong>INFO:</strong> ${company.otherinfo}</p>
      </div>
    </div>
  `;

  return article;
}

// Get membership level text
function getMembershipLevelText(level) {
  const levels = {
    1: "Bronze",
    2: "Silver",
    3: "Gold",
  };
  return levels[level] || "Member";
}

// Display error if spotlight fetch fails
function displaySpotlightError() {
  const businessCardsContainer = document.querySelector(".business-cards");
  if (businessCardsContainer) {
    businessCardsContainer.innerHTML =
      "<p>Unable to load company spotlights</p>";
  }
}

// Update Last Modified Date
const lastModified = document.getElementById("last-modified");
if (lastModified) {
  lastModified.textContent += document.lastModified;
}

// Membership Banner Auto-hide
const membershipBanner = document.querySelector(".membership-banner");
if (membershipBanner) {
  setTimeout(() => {
    membershipBanner.style.display = "none";
  }, 10000);
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
    const eventsSection = document.querySelector(".events-section");
    if (eventsSection) {
      eventsSection.scrollIntoView({ behavior: "smooth" });
    }
  });
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  fetchWeatherData();
  fetchAndDisplaySpotlights();
});
