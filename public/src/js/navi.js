document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('nav ul li a');
    
    const currentPageUrl = window.location.pathname;
    
    // Poistetaan active-luokka kaikilta linkeiltä
    navLinks.forEach(link => link.classList.remove('active'));
    
    navLinks.forEach(link => {
      const linkUrl = link.getAttribute('href');
      
      // Etusivu on erikoistapaus
      if (currentPageUrl === '/' || currentPageUrl === '/index.html') {
        if (linkUrl === '/public/src/pages/etusivu.html') {
          link.classList.add('active');
        }
      } 
      // Muut sivut
      else if (currentPageUrl.endsWith(linkUrl) || currentPageUrl.includes(linkUrl)) {
        link.classList.add('active');
      }
    });
  });