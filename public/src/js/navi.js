// Tämä JavaScript-tiedosto merkitsee nykyisen sivun navigaatiossa aktiiviseksi
document.addEventListener('DOMContentLoaded', function() {
    // Haetaan kaikki navigaatiolinkit
    const navLinks = document.querySelectorAll('nav ul li a');
    
    // Haetaan nykyisen sivun URL
    const currentPageUrl = window.location.pathname;
    
    // Poistetaan active-luokka kaikilta linkeiltä
    navLinks.forEach(link => link.classList.remove('active'));
    
    // Käydään navigaatiolinkit läpi ja verrataan niiden osoitteita nykyiseen URL:iin
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