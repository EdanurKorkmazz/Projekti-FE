import "../css/style.css";
import { fetchData } from "./fetch.js";

/**
 * Submits data to the server
 */

const submitData = async () => {

  // Get the values from the form inputs
  const username = document.querySelector("#username").value;
  const password = document.querySelector("#password").value;

  // Request body from the form inputs

  const bodyData = {
    username: username,
    password: password
  };

  // Endpoint
  const url = "https://oma-uni.norwayeast.cloudapp.azure.com/api/auth/login";

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
    console.error("Error signing in", response.error);
    return;
  }

  // Check for success in the response
  if (response.message) {
    console.log(response.message, "success");
    sessionStorage.setItem("token", response.token); // Store the token in session storage
    sessionStorage.setItem("user_id", response.user_id); // Store the user ID in session storage
    window.location.href = '/public/src/pages/paivakirja.html'; // Redirect to the diary page (change to front page when ready)
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
  const form = document.getElementById("login-form");
  if (!form.checkValidity()) {
    form.reportValidity(); // This will show the browser's native validation error messages
    return;
  }

  submitData();
});
