document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.querySelector('.sidebar');
    
    if (!sidebar) return;
    
    const toggleButton = document.createElement('button');
    toggleButton.className = 'sidebar-toggle';
    toggleButton.setAttribute('aria-label', 'Avaa/sulje sivupalkki');
    toggleButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>';
    
    sidebar.insertBefore(toggleButton, sidebar.firstChild);
    
    let sidebarOpen = window.innerWidth >= 768;
    updateSidebarState();
    
    toggleButton.addEventListener('click', function() {
      sidebarOpen = !sidebarOpen;
      updateSidebarState();
      localStorage.setItem('sidebarOpen', sidebarOpen);
    });
    
    function updateSidebarState() {
      if (sidebarOpen) {
        sidebar.classList.remove('collapsed');
        toggleButton.classList.remove('collapsed');
        toggleButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>';
      } else {
        sidebar.classList.add('collapsed');
        toggleButton.classList.add('collapsed');
        toggleButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>';
      }
    }
    
    const savedState = localStorage.getItem('sidebarOpen');
    if (savedState !== null) {
      sidebarOpen = savedState === 'true';
      updateSidebarState();
    }
    
    window.addEventListener('resize', function() {
      if (window.innerWidth < 768 && sidebarOpen) {
        sidebarOpen = false;
        updateSidebarState();
      }
    });
  });