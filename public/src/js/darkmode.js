// Dark Mode toiminnallisuus kaikille sivuille
document.addEventListener('DOMContentLoaded', function() {
    // Tarkistetaan dark mode -asetus local storagesta
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    
    // Päivitetään body-elementin luokka asetuksen mukaan
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  });