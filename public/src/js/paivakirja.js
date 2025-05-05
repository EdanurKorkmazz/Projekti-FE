import "../css/style.css";
import { fetchData } from "./fetch.js";

/**
 * Calculates the total sleep time in minutes
 *
 * @param {string} hours - user input for hours
 * @param {string} hours - user input for minutes
 *
 * @returns {string} total sleep time in minutes
 */

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
  console.log("Total minutes:", totalMinutes);
  return totalMinutes;
}

/**
 * Toggles the read-only state of the inputs in the form
 *
 * @param {string} readonly
 */
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



}

/**
 * Gathers form data from the inputs
 */

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
  console.log("gatherFormData() Draft data:", data);

  return data;
}


/**
 * Fills the form with data from the draft
 *
 * @param {object} draft - The draft data to fill the form with
 */

const fillFormFromDraft = (draft) => {
  if (!draft) return; 

  const data = draft;

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

  Object.entries(fieldMap).forEach(([fieldId, dataKey]) => {
    const element = document.querySelector(`#${fieldId}`);
    if (!element || !(dataKey in data)) return; // skip if no element or data missing

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

/**
  * Fetches data from the server
  */
async function saveDraft() {
  let formData = gatherFormData();

  try {

    console.log("Saving draft...", formData);

    // Endpoint
    const url = "http://localhost:3000/api/entries/draft";
  
    // Request options
    const options = {
      body: JSON.stringify(formData),
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
    };
  
    // Fetch data from the server
    const response = await fetchData(url, options);

    console.log("Draft saved", response);

    // If draft was found, fill the form with it
    if (response.rows) {
      const draft = response.rows;
      console.log("Draft was found", draft);
      fillFormFromDraft(draft);
    }
  } catch (error) {
    console.error('Error saving draft', error);
  }
}


/**
 * Submits data to the server
 *
 */
const updateDraft = async () => {
  const bodyData = {
    date: document.querySelector("#date").value,
    user_id: sessionStorage.getItem("user_id"),
    data: gatherFormData(),
  };

  // Endpoint
  const url = "http://localhost:3000/api/entries/draft";

  // Request options
  const options = {
    body: JSON.stringify(bodyData),
    method: "PUT",
    headers: {
      "Content-type": "application/json",
    },
  };

  // Fetch data from the server
  const response = await fetchData(url, options);

};


/**
 * Submits data to the server
 *
 */
const submitData = async () => {
  // Get the values from the form inputs
  const date = document.querySelector("#date").value;
  const time = document.querySelector("#time").value;
  const bedtime = document.querySelector("#lkm").value;
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
    wakeup_time: lkm,
    total_sleep: sleeptime,
    total_bed_time: inbed,
    sleep_quality: quality,
    daytime_alertness: alertness,
    sleep_mgmt_methods: treatment,
    sleep_factors: haitat,
  };

  // Endpoint
  const url = "http://localhost:3000/api/entries";

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
    console.log(response.message, "success");

    // Replace the form with a confirmation message
    const container = document.getElementById("boksi");
    container.innerHTML = `
    <div class="confirmation">
      <h2>Kiitos!</h2>
      <p>Merkintäsi on tallennettu onnistuneesti.</p>
      <br>
      <button id="new-entry-btn" type="button">Tee uusi merkintä</button>
    </div>
  `;

    // Optional: add a listener to restart the form
    document.getElementById("new-entry-btn").addEventListener("click", () => {
      window.location.reload(); // or re-render the form dynamically
    });
  }

  // Log the response data
  console.log(response);
};

/**
 * Handles the submit button click event
 */
const submitBtn = document.getElementById("submit-btn");
submitBtn.addEventListener("click", (e) => {
  // Prevent form submission
  e.preventDefault();

  // Check for form validity
  const form = document.getElementById("merkinta-form");
  if (!form.checkValidity()) {
    form.reportValidity(); // This will show the browser's native validation error messages
    return;
  }

  // If form is valid, proceed to submit
  submitData();
});

/**
 * Handles the button display logic
 */
const previewBtn = document.getElementById("preview-btn");
const editBtn = document.getElementById("edit-btn");
const form = document.getElementById("merkinta-form");

previewBtn.addEventListener("click", () => {

  // Prevent form submission if all required fields are not filled
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  // Toggles the read-only state of the inputs in the form
  toggleInputsReadOnly(true);

  previewBtn.style.display = "none";
  editBtn.style.display = "inline-block";
  submitBtn.style.display = "inline-block";

});




editBtn.addEventListener("click", () => {
  toggleInputsReadOnly(false);

  previewBtn.style.display = "inline-block";
  editBtn.style.display = "none";
  submitBtn.style.display = "none";
});



/**
 * Handles the date input change event
 * Enables or disables the form inputs based on the date selection
 */
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
  dateInput.addEventListener("change", () => {
    saveDraft(); // Call saveDraft function to save the draft;
    if (dateInput.value) {

        const time = document.getElementById("time");
        const lkm = document.getElementById("lkm");
      
        time.value = dateInput.value + "T21:00";
        lkm.value = dateInput.value + "T09:00";

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
          
        }
      });
    }
  });
});

function saveStatus(timeString) {
  const status = document.getElementById("save-status");
  if (status.style.display === "none") {
    status.style.display = "block";
  }
  setTimeout(() => {
    status.innerText = `Tallennettu viimeksi ${timeString}`;
  }, 4000);
  status.innerText = `Tallennettu viimeksi ${timeString}`;
  status.innerText = `Tallennetaan...`;
}

// Save when an input loses focus
document.querySelectorAll('input, textarea, select').forEach((element) => {
  element.addEventListener('blur', () => {
    if (element.id === 'date') return; // Skip date input
    setTimeout(updateDraft, 500); 
    console.log("Draft saved on blur", element.id, element.value);
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}`;
    saveStatus(timeString);
  });
});

document.addEventListener("DOMContentLoaded", function () {
  // Get references to the necessary DOM elements
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
    const delayHours = parseInt(delayHoursInput.value) || 0;
    const delayMinutes = parseInt(delayMinutesInput.value) || 0;
    const sleepDelayInMinutes = (delayHours * 60) + delayMinutes;

    // Get the total time awake during the night (in minutes)
    const awakeTimeHours = parseInt(timeupHoursInput.value) || 0;
    const awakeTimeMinutes = parseInt(timeupMinutesInput.value) || 0;
    const awakeTimeInMinutes = (awakeTimeHours * 60) + awakeTimeMinutes;

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
        sleeptimeHoursInput.value = sleepHours;
        sleeptimeMinutesInput.value = sleepMinutes;

        // Calculate the final bed time (adding awake time adjustment to the total bed time)
        const totalBedTimeAdjustedInMinutes = totalBedTimeInMinutes;
        const bedTimeHours = Math.floor(totalBedTimeAdjustedInMinutes / 60);
        const bedTimeMinutes = Math.floor(totalBedTimeAdjustedInMinutes % 60);

        // Set the calculated values for "Vuoteessaoloaika" (total bed time)
        inbedHoursInput.value = bedTimeHours;
        inbedMinutesInput.value = bedTimeMinutes;

        // Optionally, you can display the awake time during the night as well:
        console.log("Total time awake during the night (in minutes):", awakeTimeInMinutes);
      }
    }
  }

  // Add event listeners to trigger calculation when time inputs change
  timeInput.addEventListener("change", calculateTimes);
  lkmInput.addEventListener("change", calculateTimes);
  delayHoursInput.addEventListener("change", calculateTimes);
  delayMinutesInput.addEventListener("change", calculateTimes);
  timeupHoursInput.addEventListener("change", calculateTimes); // Listen for awake time input (hours)
  timeupMinutesInput.addEventListener("change", calculateTimes); // Listen for awake time input (minutes)
});


