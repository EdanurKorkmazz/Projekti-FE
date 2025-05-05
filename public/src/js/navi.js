document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('nav ul li a');
    
    const currentPageUrl = window.location.pathname;
    
    // remove the active class from all links
    navLinks.forEach(link => link.classList.remove('active'));
    
    navLinks.forEach(link => {
      const linkUrl = link.getAttribute('href');
      
      // The homepage is a special case
      if (currentPageUrl === '/' || currentPageUrl === '/index.html') {
        if (linkUrl === '/public/src/pages/etusivu.html') {
          link.classList.add('active');
        }
      } 
      // Other pages
      else if (currentPageUrl.endsWith(linkUrl) || currentPageUrl.includes(linkUrl)) {
        link.classList.add('active');
      }
    });
  });