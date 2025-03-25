const contentArea = document.getElementById("content-area");
    const slideMenu = document.getElementById("slide-menu");
    const menuImage = document.getElementById("menu-image");
    const menuTitle = document.getElementById("menu-title");
    const menuPoints = document.getElementById("menu-points");

    let certificationsData = []; // Store fetched data for sorting
    let sortAscending = true; // Track sorting state

    async function fetchData(jsonFile, contentId) {
      try {
        const response = await fetch(jsonFile, { cache: "no-cache" });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        
        if (contentId === "content-certifications") {
          certificationsData = data.items; // Store data for sorting
        }
    
        renderCards(data.items, contentId);
      } catch (error) {
        console.error(`Error fetching ${jsonFile}:`, error);
        document.getElementById(contentId).innerHTML = `<p style="color: red;">Failed to load data from ${jsonFile}.</p>`;
      }
    }

    function renderCards(cards, contentId) {
      const contentArea = document.querySelector(`#${contentId} .card-grid`);
      if (!contentArea) return;
      
      contentArea.innerHTML = "";
      if (!cards || cards.length === 0) {
        contentArea.innerHTML = `<p style="color: gray;">No items found.</p>`;
        return;
      }
    
      cards.forEach(card => {
        const cardDiv = document.createElement("div");
        cardDiv.className = "card";
        cardDiv.innerHTML = `
          <img src="${card.image}" alt="${card.name} Badge">
          <h2>${card.name}</h2>
          <div class="points">Points: ${card.points}</div>
        `;
        cardDiv.addEventListener("click", () => openMenu(card));
        contentArea.appendChild(cardDiv);
      });
    }

    function openMenu(card) {
      menuImage.src = card.image;
      menuTitle.textContent = card.name;
      menuPoints.textContent = `Points: ${card.points}`;
      
      document.getElementById("menu-duration").textContent = card.duration || "N/A";
      document.getElementById("menu-price").textContent = card.price || "N/A";
      document.getElementById("menu-passing-grade").textContent = card.passing_grade || "N/A";
      document.getElementById("menu-structure").textContent = card.structure || "N/A";
      document.getElementById("menu-results").textContent = card.results || "N/A";
      document.getElementById("menu-scheduling").textContent = card.scheduling || "N/A";
      document.getElementById("menu-expiration").textContent = card.expiration || "N/A";
      document.getElementById("menu-prerequisites").textContent = card.prerequisites || "N/A";
    
      // Populate people who have it
      const peopleList = document.getElementById("menu-people");
      peopleList.innerHTML = "";
      if (card.people_who_have_it && card.people_who_have_it.length > 0) {
        card.people_who_have_it.forEach(person => {
          const li = document.createElement("li");
          li.textContent = person;
          peopleList.appendChild(li);
        });
      } else {
        peopleList.innerHTML = "<li>N/A</li>";
      }
    
      // Populate study resources
      const resourcesList = document.getElementById("menu-study-resources");
      resourcesList.innerHTML = "";
      if (card.study_resources && card.study_resources.length > 0) {
        card.study_resources.forEach(resource => {
          const li = document.createElement("li");
          li.textContent = resource;
          resourcesList.appendChild(li);
        });
      } else {
        resourcesList.innerHTML = "<li>N/A</li>";
      }
    
      // Set certification link
      const linkElement = document.getElementById("menu-link");
      linkElement.href = card.link || "#";
      linkElement.style.display = card.link ? "block" : "none";
    
      slideMenu.classList.add("open");
    }
    

    function closeMenu() {
      slideMenu.classList.remove("open");
    }

    fetchData().then(data => {
      if (data) renderCards(data.certifications);
    });

    document.addEventListener("DOMContentLoaded", function () {
      const menuItems = document.querySelectorAll(".menu-item a");
    
      menuItems.forEach(item => {
        item.addEventListener("click", function (event) {
          event.preventDefault();
    
          const menuTitle = item.querySelector(".menu-title").textContent.trim().toLowerCase().replace(/\s+/g, "-");
          const contentId = `content-${menuTitle}`;
          const jsonFile = `content/${menuTitle}.json`; // Dynamic JSON file
    
          // Hide all content sections
          document.querySelectorAll(".menu-content").forEach(section => {
            section.style.display = "none";
          });
    
          // Show the selected section
          const selectedContent = document.getElementById(contentId);
          if (selectedContent) {
            selectedContent.style.display = "block";
            
            // Fetch data for this specific section
            fetchData(jsonFile, contentId);
          }
        });
      });
    });

    document.addEventListener("DOMContentLoaded", function () {
      const buttons = document.querySelectorAll(".sort-button");
    
      function setActiveButton(selectedButton) {
        buttons.forEach(button => button.classList.remove("selected"));
        selectedButton.classList.add("selected");
      }
    
      document.getElementById("sort-category").addEventListener("click", function () {
        fetchData("content/certifications.json", "content-certifications"); // Reload original JSON order
        setActiveButton(this);
      });
    
      document.getElementById("sort-points-asc").addEventListener("click", function () {
        certificationsData.sort((a, b) => a.points - b.points);
        renderCards(certificationsData, "content-certifications");
        setActiveButton(this);
      });
    
      document.getElementById("sort-points-desc").addEventListener("click", function () {
        certificationsData.sort((a, b) => b.points - a.points);
        renderCards(certificationsData, "content-certifications");
        setActiveButton(this);
      });
    });

    document.addEventListener("click", function (event) {
      const isClickInsideMenu = slideMenu.contains(event.target);
      const isClickOnCard = event.target.closest(".card");
      
      // Close the menu if clicking outside and not on a certification card
      if (!isClickInsideMenu && !isClickOnCard) {
        closeMenu();
      }
    });
    