import { fetchData } from './fetch.js';

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
          <form id="merkinta-view-form">
            <div class="form-grid">
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

      modalHTML += `
        <div class="entry-modal-field">
          <label>${label}</label>
          <input type="text" value="${value}" readonly>
        </div>
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
  
      <div class="button-container">
        <button type="button" id="close-entry-modal-below">Sulje ikkuna</button>
      </div>

    </form>
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
        
        const date = entry.date.split("T")[0]; // Extract date from entry
        div.innerHTML = `
          <h3>Merkintä ${date}</h3>
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

loadEntries();