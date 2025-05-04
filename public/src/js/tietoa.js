document.addEventListener('DOMContentLoaded', function() {
    const infoSections = document.querySelectorAll('.info-section');
    const tocLinks = document.querySelectorAll('.toc-link');
    
    infoSections[0].id = 'uni-palautuminen';
    infoSections[1].id = 'hrv';
    infoSections[2].id = 'vinkit';
    infoSections[3].id = 'kriisitilanteet';
    
    tocLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        
        tocLinks.forEach(l => l.classList.remove('active'));
        
        this.classList.add('active');
        
        // Scrollataan kyseiseen kohtaan 
        const targetId = this.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
          window.scrollTo({
            top: targetSection.offsetTop - 80, 
            behavior: 'smooth'
          });
        }
      });
    });
    
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
    
    if (tocLinks.length > 0) {
      tocLinks[0].classList.add('active');
    }
  });