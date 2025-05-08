<<<<<<< HEAD
import { fetchData } from './fetch.js';

function formatDate(dateString) {
  const [year, month, day] = dateString.split('T')[0].split('-');
  return `${day}.${month}.${year}`;
}

// Function to format minutes to hours and minutes
function formatMinutes(minutes) {
  if (!minutes) return '-';
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours} h ${mins} min`;
}

// Function to get entry data from the database
const getEntryData = async () => {
  const entriesApiUrl = 'https://oma-uni.norwayeast.cloudapp.azure.com/api/entries';
  const url = entriesApiUrl;
  const token = sessionStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };
  const options = {
    headers: headers,
  };
  const entryData = await fetchData(url, options);
  console.log('Entry data:', entryData);

  if (entryData.error) {
    console.log('Käyttäjän tietojen haku omauniDB-tietokannasta epäonnistui');
    return [];
  }

  return entryData;
};

// Function to create modal for viewing entry details
function createModal(entryData) {
  console.log('Creating modal with entry data:', entryData);
  
  let modalHTML = `
    <div class="entry-modal" id="merkinta-modal-${entryData.user_id}" style="display: block;">
    <div class="entry-modal-backdrop"></div>
    <div class="entry-modal-content wide-modal">
      <div class="entry-modal-header">
        <h2>Päiväkirjamerkintä</h2>
        <button class="entry-modal-close" id="close-entry-modal">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
        
      <div class="entry-modal-body">
        <div class="form-grid entry-modal-grid">
  `;

  // Define labels for fields
  const labelMap = {
    date: "Päivämäärä",
    bed_time: "Nukkumaanmenoaika",
    wakeup_time: "Nousemisaika",
    time_awake: "Hereilläoloaika unijakson aikana",
    asleep_delay: "Nukahtamisviive",
    total_sleep: "Kokonaisunen kesto",
    wakeups: "Heräilyjen lukumäärä",
    sleep_quality: "Unen laatu (1-10)",
    daytime_alertness: "Päivän aikainen vireys (1-10)",
    created_at: "Luotu",
    sleep_mgmt_methods: "Hoitokeinot",
    sleep_factors: "Unen häiriötekijät",
    total_bed_time: "Kokonaisaika vuoteessa",
  };

  // Build fields for modal
  Object.entries(entryData).forEach(([key, value]) => {
    // Skip some fields
    if (["created_at", "entry_id", "user_id", "sleep_quality", "daytime_alertness"].includes(key)) return;
      
    const label = labelMap[key] || key;

    // Format date
    if (key === "date") {
      value = formatDate(value);
    }

    // Format time fields
    if (key === "bed_time" || key === "wakeup_time") {
      value = value.split("T")[1].slice(0, 5); 
    }

    // Format minute fields
    if (key === "asleep_delay" || key === "time_awake" || key === "total_sleep" || key === "total_bed_time") {
      value = parseInt(value, 10); 
      const sleepHours = Math.floor(value / 60);
      const sleepMinutes = Math.floor(value % 60);
      value = `${sleepHours} h ${sleepMinutes} min`;
    }

    // Skip empty values
    if (value === null || value === undefined || value === "") {
      return;
    }

    modalHTML += `
      <div class="entry-modal-field">
        <p><b>${label}:</b> ${value}</p>
      </div>
    `;
  });

  // Add quality and alertness fields
  modalHTML += `
    <div>
      <label>Unen laatu (1-10)</label>
      <div class="progress-container">
        <div class="progress-bar" id="modal-quality-bar" style="width: ${entryData.sleep_quality * 10}%"></div>
        <span>${entryData.sleep_quality}</span>
      </div>
    </div>

    <div>
      <label>Päivän aikainen vireys (1-10)</label>
      <div class="progress-container">
        <div class="progress-bar" id="modal-alertness-bar" style="width: ${entryData.daytime_alertness * 10}%"></div>
        <span>${entryData.daytime_alertness}</span>
      </div>
    </div>

    <div class="button-container" style="border-bottom: 0px;">
      <button type="button" id="close-entry-modal-below">Sulje ikkuna</button>
    </div>
  </div>
  </div>
  </div>`;

  // Add modal to page
  document.body.insertAdjacentHTML("beforeend", modalHTML);

  // Add close functionality to buttons
  document.getElementById("close-entry-modal").onclick = () => {
    document.getElementById(`merkinta-modal-${entryData.user_id}`).remove();
  };

  document.getElementById("close-entry-modal-below").onclick = () => {
    document.getElementById(`merkinta-modal-${entryData.user_id}`).remove();
  };
}

// Main function to load and display entries
async function loadEntries() {
  const container = document.getElementById("merkinta-list");
  container.innerHTML = ""; // Clear existing entries

  // Get data
  const entryData = await getEntryData();

  // Check if we have data
  if (!entryData || entryData.length === 0) {
    container.innerHTML = `
      <div class="no-merkinta">
        Ei merkintöjä. Voit luoda uuden merkinnän <a href="/src/pages/paivakirja.html">Päiväkirja-sivulla</a>.
      </div>
    `;
    return;
  }

  // Sort entries by date, newest first
  const sortedEntries = [...entryData].sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });

  console.log('Merkinnät järjestetty uusimmasta vanhimpaan:', sortedEntries);

  // Create HTML for each entry
  sortedEntries.forEach((entry) => {
    const date = formatDate(entry.date);
    
    const div = document.createElement("div");
    div.classList.add("message-item");
    
    div.innerHTML = `
      <h3>Merkintä ${date}</h3>
      <p>Nukuttu aika: ${formatMinutes(entry.total_sleep)} | Unen laatu: ${entry.sleep_quality}/10</p>
      <button type="button">Tarkastele merkintää</button>
    `;
    
    // Add click event to open modal
    div.addEventListener("click", () => {
      createModal(entry);
    });

    // Add to container
    container.appendChild(div);
  });
}

// Load entries when the page loads
document.addEventListener('DOMContentLoaded', () => {
  console.log('Ladataan merkinnät...');
  loadEntries();
});

// Also load immediately in case DOMContentLoaded has already fired
=======

import { fetchData } from './fetch.js';

function formatDate (dateString) {
  const [year, month, day] = dateString.split('T')[0].split('-')
  return `${day}.${month}.${year}`;
}

// Function to get entry data from the database
const getEntryData = async () => {
    const entriesApiUrl = 'https://oma-uni.norwayeast.cloudapp.azure.com/api/entries';
    const url = entriesApiUrl;
    const token = sessionStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    const options = {
        headers: headers,
    };
    const entryData = await fetchData(url, options);
    console.log('Entry data:', entryData);

    if (entryData.error) {
        console.log('Käyttäjän tietojen haku omauniDB-tietokannasta epäonnistui');
        return;
    }

    return entryData;
};



const entryData = await getEntryData();



function createModal(entryData) {
    console.log('Creating modal with entry data:', entryData);
  
    let modalHTML = `
      <div class="entry-modal" id="merkinta-modal-${entryData.user_id}" style="display: block;">
      <div class="entry-modal-backdrop"></div>
      <div class="entry-modal-content wide-modal">
          <div class="entry-modal-header">
          <h2>Päiväkirjamerkintä</h2>
            <button class="entry-modal-close" id="close-entry-modal">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          <div class="entry-modal-body">
          <!--<form id="merkinta-view-form">-->
            <div class="form-grid entry-modal-grid">
    `;
  
    const labelMap = {
        date: "Päivämäärä",
        bed_time: "Nukkumaanmenoaika",
        wakeup_time: "Nousemisaika",
        time_awake: "Hereilläoloaika unijakson aikana",
        asleep_delay: "Nukahtamisviive",
        total_sleep: "Kokonaisunen kesto",
        wakeups: "Heräilyjen lukumäärä",
        sleep_quality: "Unen laatu (1-10)",
        daytime_alertness: "Päivän aikainen vireys (1-10)",
        created_at: "Luotu",
        sleep_mgmt_methods: "Hoitokeinot",
        sleep_factors: "Unen häiriötekijät",
        total_bed_time: "Kokonaisaika vuoteessa",
      };

    // Dynamically build inputs
    Object.entries(entryData).forEach(([key, value]) => {
      // Skip rendering these fields as inputs
      if (["created_at", "entry_id", "user_id", "sleep_quality", "daytime_alertness"].includes(key)) return;
        
      const label = labelMap[key] || key;

      if (key === "date") {
        value = formatDate(value);
      }

      if (key === "bed_time" || key === "wakeup_time") {
        value = value.split("T")[1].slice(0, 5); 
      }

      if (key === "asleep_delay" || key === "time_awake" || key === "total_sleep" || key === "total_bed_time") {
        value = parseInt(value, 10); 
        const sleepHours = Math.floor(value / 60);
        const sleepMinutes = Math.floor(value % 60);
        value = `${sleepHours} h ${sleepMinutes} min`;
      }

      if (value === null || value === undefined || value === "") {
        return;
      }

      modalHTML += `
        <div class="entry-modal-field">
        <p>
          <b>${label}:</b> ${value}
        </div>
        </p>
      `;
    });
  
    // Add special fields
    modalHTML += `
      <div>
        <label>Unen laatu (1-10)</label>
        <div class="progress-container">
          <div class="progress-bar" style="width: ${entryData.sleep_quality * 10}%"></div>
          <span>${entryData.sleep_quality}</span>
        </div>
      </div>
  
      <div>
        <label>Päivän aikainen vireys (1-10)</label>
        <div class="progress-container">
          <div class="progress-bar" style="width: ${entryData.daytime_alertness * 10}%"></div>
          <span>${entryData.daytime_alertness}</span>
        </div>
      </div>
  
      <div class="button-container" style="border-bottom: 0px;">
        <button type="button" id="close-entry-modal-below">Sulje ikkuna</button>
      </div>

    <!--</form>-->
    </div>
  </div>
  </div>`;
  
    document.body.insertAdjacentHTML("beforeend", modalHTML);
  
    document.getElementById("close-entry-modal").onclick = () => {
      document.getElementById(`merkinta-modal-${entryData.user_id}`).remove();
    };

    document.getElementById("close-entry-modal-below").onclick = () => {
      document.getElementById(`merkinta-modal-${entryData.user_id}`).remove();
    };
  }
  

  

function loadEntries() {
    const container = document.getElementById("merkinta-list");

    container.innerHTML = ""; // Clear existing entries

    console.log('Entry data:', entryData);

    entryData.forEach((entry) => {
        const div = document.createElement("div");
        div.classList.add("message-item");
        
        const date = formatDate(entry.date); // Extract date from entry
        div.innerHTML = `
          <h3>Merkintä ${date}</h3><br>
        `;
        
        const button = document.createElement("button");
        button.type = "button";
        button.innerText = "Tarkastele merkintää";

        button.addEventListener("click", () => {
            createModal(entry);
        });

        div.appendChild(button);
        container.appendChild(div);
      });

};

>>>>>>> 0a5b5d131cffbc14d1a898b3194e99c1721d4470
loadEntries();