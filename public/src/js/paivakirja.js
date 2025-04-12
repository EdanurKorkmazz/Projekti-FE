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
 * Submits data to the server
 *
 */
const submitData = async () => {

  // Get the values from the form inputs
  const date = document.querySelector("#date").value;
  const time = document.querySelector("#time").value;
  const delay = timeToMinutes(
    document.querySelector("#delay-hours").value,
    document.querySelector("#delay-minutes").value
  );
  const wakeups = document.querySelector("#wakeups").value;
  const timeup = timeToMinutes(
    document.querySelector("#timeup-hours").value,
    document.querySelector("#timeup-minutes").value
  );
  const lkm = document.querySelector("#lkm").value;
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
    user_id: 1,
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

  // Request options
  const options = {
    body: JSON.stringify(bodyData),
    method: "POST",
    headers: {
      "Content-type": "application/json",
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
  }

  // Log the response data
  console.log(response);
};


/**
 * Handles the submit button click event
 */
const getItemBtn = document.getElementById("submit-btn");
getItemBtn.addEventListener("click", (e) => {

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
