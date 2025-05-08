/* import "../css/style.css"; */
import { fetchData } from "./fetch.js";


// Function to calculate the total sleep time in minutes
function timeToMinutes(hours, minutes) {
  // Convert to integers
  hours = parseInt(hours);
  minutes = parseInt(minutes);

  // Check if both variables are numbers
  if (isNaN(hours) || isNaN(minutes)) {
    console.log("Invalid input");
    return 0;
  }

  // Calculate total minutes
  const totalMinutes = hours * 60 + minutes;
  return totalMinutes;
}

// Toggles the read-only state of the inputs in the form
function toggleInputsReadOnly(readOnly) {
  const inputs = document.querySelectorAll(
    "#merkinta-form input, #merkinta-form select, #merkinta-form textarea"
  );

  inputs.forEach((input) => {
    if (input.type === "range") {
      input.disabled = readOnly; 
    } else {
      input.readOnly = readOnly;
    }
  });

  const divs = document.querySelectorAll(
    "#merkinta-form div, #merkinta-form .double-inputs, #merkinta-form .multiple-inputs"
  );
  
  divs.forEach((div) => {
    div.classList.toggle("read-only", readOnly);
  });

  const status = document.getElementById("save-status");

  if (status.style.display === "block") {
    status.style.display = "none";
  }
  
}

// Gathers form data from the inputs

function gatherFormData() {
  let fieldMap = {
    "date": "date",
    "time": "bed_time",
    "lkm": "wakeup_time",
    "delay-hours": "asleep_delay",
    "delay-minutes": "asleep_delay",
    "timeup-hours": "time_awake",
    "timeup-minutes": "time_awake",
    "wakeups": "wakeups",
    "sleeptime-hours": "total_sleep",
    "sleeptime-minutes": "total_sleep",
    "inbed-hours": "total_bed_time",
    "inbed-minutes": "total_bed_time",
    "quality": "sleep_quality",
    "alertness": "daytime_alertness",
    "treatment": "sleep_mgmt_methods",
    "haitat": "sleep_factors",
  };

  let data = {};

  // Gathers draft data from corresponding input fields
  Object.entries(fieldMap).forEach(([fieldId, dataKey]) => {
    const element = document.querySelector(`#${fieldId}`);
    if (element && element.value) {
      if (dataKey in data) {
        // Sum minutes and hours separately
        if (fieldId.includes('hours')) {
          data[dataKey] += parseInt(element.value || 0) * 60;
        } else if (fieldId.includes('minutes')) {
          data[dataKey] += parseInt(element.value || 0);
        }
      } else {
        if (fieldId.includes('hours') || fieldId.includes('minutes')) {
          data[dataKey] = 0;
          if (fieldId.includes('hours')) {
            data[dataKey] += parseInt(element.value || 0) * 60;
          } else {
            data[dataKey] += parseInt(element.value || 0);
          }
        } else {
          data[dataKey] = element.value;
        }
      }
    }
  });

  data.user_id = sessionStorage.getItem("user_id");

  return data;
}


// Fills the form with data from the draft

const fillFormFromDraft = (draft) => {
  if (!draft || !draft.data) return; 

  const data = draft.data;

  const fieldMap = {
    "date": "date",
    "time": "bed_time",
    "lkm": "wakeup_time",
    "delay-hours": "asleep_delay",
    "delay-minutes": "asleep_delay",
    "timeup-hours": "time_awake",
    "timeup-minutes": "time_awake",
    "wakeups": "wakeups",
    "sleeptime-hours": "total_sleep",
    "sleeptime-minutes": "total_sleep",
    "inbed-hours": "total_bed_time",
    "inbed-minutes": "total_bed_time",
    "quality": "sleep_quality",
    "alertness": "daytime_alertness",
    "treatment": "sleep_mgmt_methods",
    "haitat": "sleep_factors",
  };

  // Places fetched draft data on corresponding input fields
  Object.entries(fieldMap).forEach(([fieldId, dataKey]) => {
    const element = document.querySelector(`#${fieldId}`);
    if (!element || !(dataKey in data)) {
      return;
    }; // skip if no element or data missing

    const value = data[dataKey];

    // Handle time fields stored as total minutes
    if (fieldId.includes("hours")) {
      element.value = Math.floor(value / 60); 
    } else if (fieldId.includes("minutes")) {
      element.value = value % 60; 
    } else {
      element.value = value;
    }
  });

};

// Fetches data from the server
async function saveDraft() {
  let formData = gatherFormData();

  try {

    // Endpoint
    const url = "https://oma-uni.norwayeast.cloudapp.azure.com/api/entries/draft";

    // Token
    const token = sessionStorage.getItem("token");
  
    // Request options
    const options = {
      body: JSON.stringify(formData),
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`, // Add the token to the headers
      },
    };

    // Fetch data from the server
    const response = await fetchData(url, options);

    // If entry was found with requested date
    if (response.entry) {

      const entry = response.entry;

      const form = document.getElementById("merkinta-form");
      form.reset();
      const dateInput = document.getElementById("date");
      dateInput.value = entry.date.split('T')[0];

      const dateDiv = document.getElementById("date-container");

      const alertDiv = document.createElement("div");
      alertDiv.textContent = response.error;
      alertDiv.classList.add("error-message");
      dateDiv.insertAdjacentElement("beforeend", alertDiv); 

      const note = document.getElementById("save-status");
      if (note) {
        note.style.display = "none";
      }

      return false;
    }

    // If draft was found, fill the form with the data
    if (response.rows) {
      const draft = response.rows;
      fillFormFromDraft(draft);
      const string = "Luonnos löydetty";
      saveStatus(string, 0, "green");
      removeMessage();
      return true;
    }

    return true;
  } catch (error) {
    console.error('Error saving draft', error);
    return false;
  }
}


// Submits draft data to the server
const updateDraft = async () => {

  const div = document.getElementById("error-message");
  if (div && div.style.display === "block") {
    saveStatus("Tallennus epäonnistui, tarkista syöttämäsi arvot", 0, "red")
    return;
  }

  const bodyData = {
    date: document.querySelector("#date").value,
    user_id: sessionStorage.getItem("user_id"),
    data: gatherFormData(),
  };

  // Token
  const token = sessionStorage.getItem("token");
  
  // Endpoint
  const url = "https://oma-uni.norwayeast.cloudapp.azure.com/api/entries/draft";

  // Request options
  const options = {
    body: JSON.stringify(bodyData),
    method: "PUT",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${token}`, // Add the token to the headers
    },
  };

  // Fetch data from the server
  const response = await fetchData(url, options);

  if (response) {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}`;
    const string = `Tallennettu viimeksi ${timeString}`;
    saveStatus(string, 4000, null);
  }
};


// Submits a new entry to the server
const submitData = async () => {

  // Get the values from the form inputs
  const date = document.querySelector("#date").value;
  const time = document.querySelector("#time").value;
  const wakeup_time = document.querySelector("#lkm").value;
  const delay = timeToMinutes(
    document.querySelector("#delay-hours").value,
    document.querySelector("#delay-minutes").value
  );
  const wakeups = document.querySelector("#wakeups").value;
  const timeup = timeToMinutes(
    document.querySelector("#timeup-hours").value,
    document.querySelector("#timeup-minutes").value
  );
  const sleeptime = timeToMinutes(
    document.querySelector("#sleeptime-hours").value,
    document.querySelector("#sleeptime-minutes").value
  );
  const inbed = timeToMinutes(
    document.querySelector("#inbed-hours").value,
    document.querySelector("#inbed-minutes").value
  );
  const quality = document.querySelector("#quality").value;
  const alertness = document.querySelector("#alertness").value;
  const treatment = document.querySelector("#treatment").value;
  const haitat = document.querySelector("#haitat").value;

  // Request body from the form inputs
  const bodyData = {
    date: date,
    bed_time: time,
    asleep_delay: delay,
    wakeups: wakeups,
    time_awake: timeup,
    wakeup_time: wakeup_time ,
    total_sleep: sleeptime,
    total_bed_time: inbed,
    sleep_quality: quality,
    daytime_alertness: alertness,
    sleep_mgmt_methods: treatment,
    sleep_factors: haitat,
  };

  // Endpoint
  const url = "https://oma-uni.norwayeast.cloudapp.azure.com/api/entries";

  // Token
  const token = sessionStorage.getItem("token");

  // Request options
  const options = {
    body: JSON.stringify(bodyData),
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${token}`, // Add the token to the headers
    },
  };

  // Fetch data from the server
  const response = await fetchData(url, options);

  // Check for errors in the response
  if (response.error) {
    console.error("Error adding a new entry:", response.error);
    return;
  }

  // Check for success in the response
  if (response.message) {

    // Replace the form with a confirmation message
    const container = document.getElementById("boksi");
    container.innerHTML = `
    <div class="confirmation">
      <h2>Kiitos!</h2>
      <p>Merkintäsi on tallennettu onnistuneesti.</p>
      <br>
      <button id="new-entry-btn" type="button">Tee uusi merkintä</button>
      <button id="view-entries-btn" type="button">Tarkastele merkintöjä</button>
    </div>
  `;

    document.getElementById("new-entry-btn").addEventListener("click", () => {
      window.location.reload(); 
    });

    document.getElementById("view-entries-btn").addEventListener("click", () => {
      window.location.href = "/src/pages/seuranta.html";
    });

  }
};

// Handles the submit button click event
const submitBtn = document.getElementById("submit-btn");
submitBtn.addEventListener("click", (e) => {

  // Check for form validity
  const form = document.getElementById("merkinta-form");
  if (!form.checkValidity()) {
    form.reportValidity(); 
    return;
  }

  // Prevent form submission
  e.preventDefault();

  // If form is valid, proceed to submit
  submitData();
});

// Handles the button display logic
const previewBtn = document.getElementById("preview-btn");
const editBtn = document.getElementById("edit-btn");
const form = document.getElementById("merkinta-form");

previewBtn.addEventListener("click", (e) => {

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  // Toggles the read-only state of the inputs in the form
  toggleInputsReadOnly(true);

  previewBtn.style.display = "none";
  editBtn.style.display = "inline-block";
  submitBtn.style.display = "inline-block";

  window.scrollTo({ top: 0, behavior: 'smooth' });

  document.querySelector("h1").innerText = "Esikatselu"; 

});

// Toggles back to new entry mode
editBtn.addEventListener("click", () => {
  toggleInputsReadOnly(false);

  previewBtn.style.display = "inline-block";
  editBtn.style.display = "none";
  submitBtn.style.display = "none";

  window.scrollTo({ top: 0, behavior: 'smooth' });

  document.querySelector("h1").innerText = "Uusi merkintä"; 
});

// Handles the date input change event

document.addEventListener("DOMContentLoaded", () => {

  const dateInput = document.getElementById("date");
  const form = document.getElementById("merkinta-form");

  // Disable all inputs except date
  [...form.elements].forEach((el) => {
    if (el.id !== "date" && el.type !== "button") {
      el.disabled = true;
      const label = form.querySelector(`label[for="${el.id}"]`);
      if (label) {
        label.classList.add("disabled");
      }
      const h2s = form.querySelectorAll("h2");
      if (h2s[1]) {
        h2s[1].classList.add("disabled");
      }
      const h3s = form.querySelectorAll("h3");
      if (h3s) {
        h3s.forEach(h3 => {
          h3.classList.add("disabled");
        });
      }
    }
  });
  // Enable inputs when a valid date is picked
  dateInput.addEventListener("change", async () => {

    const saveDraftResponse = await saveDraft();

    if (dateInput.value && saveDraftResponse === true) {
        const time = document.getElementById("time");
        const lkm = document.getElementById("lkm");
        const date = dateInput.value;

        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1);
        const pad = (num) => String(num).padStart(2, '0');
        const nextDayString = `${nextDay.getFullYear()}-${pad(nextDay.getMonth() + 1)}-${pad(nextDay.getDate())}`;

        time.value = date + "T21:00";
        time.min = date + "T00:00";
        time.max = nextDayString + "T23:59";

        lkm.value = nextDayString + "T09:00";
        lkm.min = date + "T00:00";
        lkm.max = nextDayString + "T23:59";

      [...form.elements].forEach((el) => {
        if (el.id !== "date") {
          el.disabled = false;
          const label = form.querySelector(`label[for="${el.id}"]`);
          if (label) {
            label.classList.remove("disabled");
          }   
          const h2s = form.querySelectorAll("h2");
          if (h2s[1]) {
            h2s[1].classList.remove("disabled");
          }
          const h3s = form.querySelectorAll("h3, #merkinta-form h3"); 
          h3s.forEach(h3 => {
            h3.classList.remove("disabled");
          });
        }
      });
      window.location.href = "#question-header"; // Scroll to the form
    } else {
      [...form.elements].forEach((el) => {
        if (el.id !== "date" && el.type !== "button") {
          el.disabled = true;
          const label = form.querySelector(`label[for="${el.id}"]`);
          if (label) {
            label.classList.add("disabled");
          }
          const h2s = form.querySelectorAll("h2");
          if (h2s[1]) {
            h2s[1].classList.add("disabled");
          }
          const h3s = form.querySelectorAll("h3, #merkinta-form h3"); 
          h3s.forEach(h3 => {
            h3.classList.add("disabled");
          });
        }
      });
    }
  });
});

// Last saved information
function saveStatus(string, timeout, color) {

  const status = document.getElementById("save-status");

  if (status.style.display === "none") {
    status.style.display = "block";
  }

  setTimeout(() => {
    status.innerText = string;
    status.classList.add(color); 
  }, timeout);

  status.innerText = `Tallennetaan...`;
  status.classList.remove("green", "red");

}

// Save draft when an input loses focus
document.querySelectorAll('input, textarea, select').forEach((element) => {
  element.addEventListener('blur', () => {
    if (element.id === 'date') return; // Skip date input
    if (element.value === "") return; // Skip empty inputs
    setTimeout(updateDraft, 500); 
  });
});

// Function to count sleep minutes
function totalMinutes(hours, minutes) {
  // Convert to integers
  hours = parseInt(hours.value) || 0;
  minutes = parseInt(minutes.value) || 0;

  // Check if both variables are numbers
  if (isNaN(hours) || isNaN(minutes)) {
    console.log("Invalid input");
    return 0;
  }

  // Calculate total minutes
  const totalMinutes = hours * 60 + minutes;
  return totalMinutes;
};

document.addEventListener("DOMContentLoaded", function () {

  const timeInput = document.getElementById("time"); // "Menin vuoteeseen klo"
  const lkmInput = document.getElementById("lkm");   // "Nousin vuoteesta klo"
  const delayHoursInput = document.getElementById("delay-hours"); // "Nukahtamisviive"
  const delayMinutesInput = document.getElementById("delay-minutes");
  const timeupHoursInput = document.getElementById("timeup-hours"); // "Valveillaoloaika unijakson aikana"
  const timeupMinutesInput = document.getElementById("timeup-minutes");
  const sleeptimeHoursInput = document.getElementById("sleeptime-hours"); // "Nukuttu aika"
  const sleeptimeMinutesInput = document.getElementById("sleeptime-minutes");
  const inbedHoursInput = document.getElementById("inbed-hours"); // "Vuoteessaoloaika"
  const inbedMinutesInput = document.getElementById("inbed-minutes");


  // Function to calculate the difference between two times
  function calculateTimes() {
    const timeIn = new Date(timeInput.value); // Time when user went to bed
    const timeOut = new Date(lkmInput.value); // Time when user woke up

    // Get the sleep delay in minutes
    const sleepDelayInMinutes = totalMinutes(delayHoursInput, delayMinutesInput); // Call the function to calculate total minutes

    // Get the total time awake during the night (in minutes)
    const awakeTimeInMinutes = totalMinutes(timeupHoursInput, timeupMinutesInput); 

    // If both times are valid (i.e., not empty)
    if (!isNaN(timeIn.getTime()) && !isNaN(timeOut.getTime())) {
      // Calculate the total time spent in bed
      const totalBedTimeMilliseconds = timeOut - timeIn;
      const totalBedTimeInMinutes = totalBedTimeMilliseconds / 1000 / 60;

      if (totalBedTimeInMinutes > 0) {
        // Calculate the actual sleep time (subtracting sleep delay and time awake)
        const actualSleepTimeInMinutes = totalBedTimeInMinutes - sleepDelayInMinutes - awakeTimeInMinutes;

        // Calculate the final sleep time in hours and minutes
        const sleepHours = Math.floor(actualSleepTimeInMinutes / 60);
        const sleepMinutes = Math.floor(actualSleepTimeInMinutes % 60);

        // Set the calculated values for "Nukuttu aika" (sleeping time)
        if (sleepHours > 0 || sleepMinutes > 0) {
          sleeptimeHoursInput.value = sleepHours;
          sleeptimeMinutesInput.value = sleepMinutes;
        } else {
          createMessage("Nukuttu aika ei voi olla negatiivinen"); 
          sleeptimeHoursInput.value = "";
          sleeptimeMinutesInput.value = "";
        }

        // Calculate the final bed time (adding awake time adjustment to the total bed time)
        const totalBedTimeAdjustedInMinutes = totalBedTimeInMinutes;
        const bedTimeHours = Math.floor(totalBedTimeAdjustedInMinutes / 60);
        const bedTimeMinutes = Math.floor(totalBedTimeAdjustedInMinutes % 60);

        // Set the calculated values for "Vuoteessaoloaika" (total bed time)
        inbedHoursInput.value = bedTimeHours;
        inbedMinutesInput.value = bedTimeMinutes;
      }
    }
  }

  // Add event listeners to trigger calculation when time inputs change
  timeInput.addEventListener("change", calculateTimes);
  lkmInput.addEventListener("change", calculateTimes);
  delayHoursInput.addEventListener("change", calculateTimes);
  delayMinutesInput.addEventListener("change", calculateTimes);
  timeupHoursInput.addEventListener("change", calculateTimes); 
  timeupMinutesInput.addEventListener("change", calculateTimes); 
});


// Function to create error message
function createMessage(message) {
  const div = document.getElementById("error-message");
  div.innerText = message;
  div.style.display = "block"; // Show the error message
}

// Function to hide error message
function removeMessage() {
  const divs = document.getElementById("error-message");
  if (divs) {
    document.querySelectorAll("div.error-message").forEach(div => {
      div.style.display = "none";
    });
  }
};

// Functions to handle invalid time inputs
const date = document.getElementById("date");
const bedTimeInput = document.getElementById("time");
const wakeTimeInput = document.getElementById("lkm");
const delayHoursInput = document.getElementById("delay-hours"); 
const delayMinutesInput = document.getElementById("delay-minutes");

// Checks wakeup time validity
function wakeupValidity() {
  createMessage("Nousuaika ei voi olla ennen nukkumaanmenoaikaa.");
  const nextDay = new Date(date.value);
  nextDay.setDate(nextDay.getDate() + 1);
  const pad = (num) => String(num).padStart(2, '0');
  const nextDayString = `${nextDay.getFullYear()}-${pad(nextDay.getMonth() + 1)}-${pad(nextDay.getDate())}`;
  wakeTimeInput.value = nextDayString + "T09:00";
};

// Checks bed time input validity
bedTimeInput.addEventListener("change", () => {
  const dateValue = date.value + "T00:00";
  if (bedTimeInput.value && bedTimeInput.value < dateValue) {
    createMessage("Nukkumaanmenoaika ei voi olla ennen asetettua päivämäärää.");
    bedTimeInput.value = date.value + "T21:00";
  }
  if (bedTimeInput.value && wakeTimeInput.value < bedTimeInput.value) {
    wakeupValidity();
  }
});

// Checks wakeup time input validity
wakeTimeInput.addEventListener("change", () => {
  if (bedTimeInput.value && wakeTimeInput.value < bedTimeInput.value) {
    wakeupValidity();
  }
});

// Remove error message after set time interval
document.querySelectorAll("input").forEach((input) => {
  input.addEventListener("focus", () => {
    setTimeout(() => {
      removeMessage();
    }, 15000);
  });
});

// Calculates if sleep delay is valid
function delayCalculateTimes() {
  const inbedHoursInput = document.getElementById("inbed-hours"); 
  const inbedMinutesInput = document.getElementById("inbed-minutes");
  const delayHoursInput = document.getElementById("delay-hours");
  const delayMinutesInput = document.getElementById("delay-minutes");

  if (inbedHoursInput.value || inbedMinutesInput.value) {
    const delay = totalMinutes(delayHoursInput, delayMinutesInput); 
    const timeIn = totalMinutes(inbedHoursInput, inbedMinutesInput); 

    if (delay > timeIn) {
      createMessage("Nukahtamisviive ei voi olla enemmän kuin vuoteessa oltu aika."); 
      delayHoursInput.value = ""; 
      delayMinutesInput.value = ""; 
    }
  } 
};

// Calculates sleep delay validity when delay hours or delay minutes input is deactivated
delayHoursInput.addEventListener("blur", () => {
  delayCalculateTimes();
});

delayMinutesInput.addEventListener("blur", () => {
  delayCalculateTimes();
});