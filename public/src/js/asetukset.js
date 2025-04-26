// Asetukset-sivun toiminnallisuus
document.addEventListener('DOMContentLoaded', function() {
    // Elementtien haku
    const darkModeToggle = document.getElementById('dark-mode');
    const modeText = document.getElementById('mode-text');
    const form = document.getElementById('asetukset-form');
    const notification = document.getElementById('notification');
    
    // Dark Mode -asetuksen tarkistus local storagesta
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    
    // Päivitetään käyttöliittymän tila tallennetun asetuksen mukaan
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
      darkModeToggle.checked = true;
      modeText.textContent = 'Päällä';
    } else {
      document.body.classList.remove('dark-mode');
      darkModeToggle.checked = false;
      modeText.textContent = 'Pois päältä';
    }
    
    // Dark Mode -kytkimen toiminnallisuus - päivittää ulkoasun välittömästi
    darkModeToggle.addEventListener('change', function() {
      if (this.checked) {
        document.body.classList.add('dark-mode');
        modeText.textContent = 'Päällä';
      } else {
        document.body.classList.remove('dark-mode');
        modeText.textContent = 'Pois päältä';
      }
    });
    
    // Lomakkeen lähetys
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Tallennetaan sähköpostiosoite
      const email = document.getElementById('email').value;
      localStorage.setItem('email', email);
      
      // Tallennetaan dark mode -asetus
      const darkModeEnabled = darkModeToggle.checked;
      localStorage.setItem('darkMode', darkModeEnabled);
      
      // Näytetään ilmoitus onnistuneesta tallennuksesta
      notification.textContent = 'Asetukset tallennettu onnistuneesti!';
      notification.classList.add('show');
      
      // Piilotetaan ilmoitus 3 sekunnin kuluttua
      setTimeout(function() {
        notification.classList.remove('show');
      }, 3000);
    });
    
    // Jos sähköpostiosoite on tallennettu, näytetään se lomakkeessa
    const savedEmail = localStorage.getItem('email');
    if (savedEmail) {
      document.getElementById('email').value = savedEmail;
    }
  });