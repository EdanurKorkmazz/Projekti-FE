document.getElementById("signout") .addEventListener("click", () => {
    // Clear session storage
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user_id");
    window.location.href = '/public/src/pages/kirjaudu.html'; // Redirect to the login page
});