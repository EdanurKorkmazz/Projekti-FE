// Lisätään tapahtumankuuntelijat sisällysluettelon linkeille
document.addEventListener('DOMContentLoaded', function() {
    const infoSections = document.querySelectorAll('.info-section');
    const tocLinks = document.querySelectorAll('.toc-link');
    
    // Lisätään id:t osioille navigointia varten
    infoSections[0].id = 'uni-palautuminen';
    infoSections[1].id = 'hrv';
    infoSections[2].id = 'vinkit';
    infoSections[3].id = 'kriisitilanteet';
    
    // Linkkien tapahtumankuuntelijat
    tocLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Poistetaan active-luokka kaikilta linkeiltä
        tocLinks.forEach(l => l.classList.remove('active'));
        
        // Lisätään active-luokka klikatulle linkille
        this.classList.add('active');
        
        // Scrollataan vastaavaan osioon
        const targetId = this.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
          window.scrollTo({
            top: targetSection.offsetTop - 80, // Otetaan header-navigointi huomioon
            behavior: 'smooth'
          });
        }
      });
    });
    
    // Seurataan scrollia ja päivitetään aktiivinen linkki
    window.addEventListener('scroll', function() {
      let current = '';
      
      infoSections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.pageYOffset >= sectionTop) {
          current = section.getAttribute('id');
        }
      });
      
      tocLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
          link.classList.add('active');
        }
      });
    });
    
    // Vinkkikorttien hover-efekti kosketusnäytöille
    const tipCards = document.querySelectorAll('.tip-card');
    
    tipCards.forEach(card => {
      card.addEventListener('touchstart', function() {
        this.classList.add('hover');
      });
      
      card.addEventListener('touchend', function() {
        setTimeout(() => {
          this.classList.remove('hover');
        }, 200);
      });
    });
    
    // Aktiivisoida ensimmäinen linkki oletuksena
    if (tocLinks.length > 0) {
      tocLinks[0].classList.add('active');
    }
  });