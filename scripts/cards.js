const contentArea = document.getElementById("content-area");

function setupSection(jsonFile, contentId, slideMenuId) {
  let sectionData = [];

  // Fetch data from the JSON file
  async function fetchData() {
    try {
      const response = await fetch(jsonFile, { cache: "no-cache" });
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();

      sectionData = data.items;
      renderCards(data.items);
    } catch (error) {
      console.error(`Error fetching ${jsonFile}:`, error);
      document.getElementById(
        contentId
      ).innerHTML = `<p style="color: red;">Failed to load data from ${jsonFile}.</p>`;
    }
  }

  // Renders card elements from a given dataset
  function renderCards(cards) {
    const contentArea = document.querySelector(`#${contentId} .card-grid`);
    if (!contentArea) return;

    contentArea.innerHTML = "";
    if (!cards || cards.length === 0) {
      contentArea.innerHTML = `<p style="color: gray;">No items found.</p>`;
      return;
    }

    // Create and inject card elements into the DOM
    cards.forEach((card) => {
      const cardDiv = document.createElement("div");
      cardDiv.className = "card";
      cardDiv.innerHTML = `
        <img src="${card.image}" alt="${card.name} Badge">
        <h2>${card.name}</h2>
        <div class="points-container">
          <div class="points-text">Points: ${card.points}</div>
          <div class="add-circle">+</div>
        </div>
      `;
      cardDiv.addEventListener("click", () => openMenu(card));
      contentArea.appendChild(cardDiv);
    });
  }

  // Opens a slide-out menu with detailed information about a card
  function openMenu(card) {
    const slideMenu = document.getElementById(slideMenuId);
    // Populate the slide menu fields with card data
    slideMenu.querySelector("#menu-image").src = card.image;
    slideMenu.querySelector("#menu-title").textContent = card.name;
    slideMenu.querySelector(
      "#menu-points"
    ).textContent = `Points: ${card.points}`;
    slideMenu.querySelector("#menu-duration").textContent =
      card.duration || "N/A";
    slideMenu.querySelector("#menu-price").textContent = card.price || "N/A";
    slideMenu.querySelector("#menu-passing-grade").textContent =
      card.passing_grade || "N/A";
    slideMenu.querySelector("#menu-structure").textContent =
      card.structure || "N/A";
    slideMenu.querySelector("#menu-results").textContent =
      card.results || "N/A";
    slideMenu.querySelector("#menu-scheduling").textContent =
      card.scheduling || "N/A";
    slideMenu.querySelector("#menu-expiration").textContent =
      card.expiration || "N/A";
    slideMenu.querySelector("#menu-prerequisites").textContent =
      card.prerequisites || "N/A";

    // Populate list of people who hold the item
    const peopleList = slideMenu.querySelector("#menu-people");
    peopleList.innerHTML = "";
    (card.people_who_have_it || ["N/A"]).forEach((person) => {
      const li = document.createElement("li");
      li.textContent = person;
      peopleList.appendChild(li);
    });

    // Populate list of study resources
    const resourcesList = slideMenu.querySelector("#menu-study-resources");
    resourcesList.innerHTML = "";
    (card.study_resources || ["N/A"]).forEach((resource) => {
      const li = document.createElement("li");
      li.textContent = resource;
      resourcesList.appendChild(li);
    });

    // Show link if available
    const linkElement = slideMenu.querySelector("#menu-link");
    linkElement.href = card.link || "#";
    linkElement.style.display = card.link ? "block" : "none";

    // Open the menu
    slideMenu.classList.add("open");

    function showIfAvailable(selector, value) {
      const el = slideMenu.querySelector(selector);
      const wrapper = el.closest("p");
      if (value) {
        wrapper.style.display = "block";
        el.textContent = value;
      } else {
        wrapper.style.display = "none";
      }
    }

    showIfAvailable("#menu-duration", card.duration);
    showIfAvailable("#menu-price", card.price);
    showIfAvailable("#menu-passing-grade", card.passing_grade);
    showIfAvailable("#menu-structure", card.structure);
    showIfAvailable("#menu-results", card.results);
    showIfAvailable("#menu-scheduling", card.scheduling);
    showIfAvailable("#menu-expiration", card.expiration);
    showIfAvailable("#menu-prerequisites", card.prerequisites);
  }

  // Closes the slide menu
  function closeMenu() {
    document.getElementById(slideMenuId).classList.remove("open");
  }

  // Global click listener to close if clicked outside
  document.addEventListener("click", function (event) {
    const slideMenu = document.getElementById(slideMenuId);
    const isClickInsideMenu = slideMenu.contains(event.target);
    const isClickOnCard = event.target.closest(".card");
    if (!isClickInsideMenu && !isClickOnCard) closeMenu();
  });

  // Sorting buttons
  const sortAsc = document.querySelector(`#${contentId} #sort-points-asc`);
  const sortDesc = document.querySelector(`#${contentId} #sort-points-desc`);
  const sortCategory = document.querySelector(`#${contentId} #sort-category`);

  if (sortAsc && sortDesc && sortCategory) {
    function updateSortSelection(activeButton) {
      [sortAsc, sortDesc, sortCategory].forEach((btn) =>
        btn.classList.remove("selected")
      );
      activeButton.classList.add("selected");
    }
    
    sortAsc.addEventListener("click", function () {
      sectionData.sort((a, b) => a.points - b.points);
      renderCards(sectionData);
      updateSortSelection(sortAsc);
    });
    
    sortDesc.addEventListener("click", function () {
      sectionData.sort((a, b) => b.points - a.points);
      renderCards(sectionData);
      updateSortSelection(sortDesc);
    });
    
    sortCategory.addEventListener("click", function () {
      fetchData(); // reload original
      updateSortSelection(sortCategory);
    });
  }

  return { fetchData };
}

// Set up each content section with its JSON data and associated slide menu
const sections = {
  certifications: setupSection(
    "content/certifications.json",
    "content-certifications",
    "slide-menu-certifications"
  ),
  cooperation: setupSection(
    "content/cooperation.json",
    "content-cooperation",
    "slide-menu-cooperation"
  ),
  "knowledge-unlocking": setupSection(
    "content/knowledge-unlocking.json",
    "content-knowledge-unlocking",
    "slide-menu-knowledge-unlocking"
  ),
};

// Listen for menu clicks and load respective JSON
document.addEventListener("DOMContentLoaded", function () {
  const menuItems = document.querySelectorAll(".menu-item a");
  menuItems.forEach((item) => {
    item.addEventListener("click", function (event) {
      event.preventDefault();
      const menuTitle = item
        .querySelector(".menu-title")
        .textContent.trim()
        .toLowerCase()
        .replace(/\s+/g, "-");
      const contentId = `content-${menuTitle}`;

      // Hide all content sections
      document.querySelectorAll(".menu-content").forEach((section) => {
        section.style.display = "none";
      });

      // Show the selected content section and load its data
      const selectedContent = document.getElementById(contentId);
      if (selectedContent) {
        selectedContent.style.display = "block";
        if (sections[menuTitle]) {
          sections[menuTitle].fetchData();
        }
      }
    });
  });
});
