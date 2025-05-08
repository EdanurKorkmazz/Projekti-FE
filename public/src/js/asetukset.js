document.addEventListener('DOMContentLoaded', function() {
  const darkModeToggle = document.getElementById('dark-mode');
  const modeText = document.getElementById('mode-text');
  const form = document.getElementById('asetukset-form');
  const notification = document.getElementById('notification');
  
  const isDarkMode = localStorage.getItem('darkMode') === 'true';
  
  if (isDarkMode) {
    document.body.classList.add('dark-mode');
    darkModeToggle.checked = true;
    modeText.textContent = 'Tumma on tila päällä';
  } else {
    document.body.classList.remove('dark-mode');
    darkModeToggle.checked = false;
    modeText.textContent = 'Tumma tila on pois päältä';
  }
  
  // dark mode variation
  darkModeToggle.addEventListener('change', function() {
    if (this.checked) {
      document.body.classList.add('dark-mode');
      modeText.textContent = 'Päällä';
    } else {
      document.body.classList.remove('dark-mode');
      modeText.textContent = 'Pois päältä';
    }
  });
  
  // form submission
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
  
    const email = document.getElementById('email').value;
    localStorage.setItem('email', email);
    
    const darkModeEnabled = darkModeToggle.checked;
    localStorage.setItem('darkMode', darkModeEnabled);
    
    notification.textContent = 'Asetukset tallennettu onnistuneesti!';
    notification.classList.add('show');
    
    setTimeout(function() {
      notification.classList.remove('show');
    }, 3000);
  });
  
  const savedEmail = localStorage.getItem('email');
  if (savedEmail) {
    document.getElementById('email').value = savedEmail;
  }
});