// Enhanced Dark Mode Implementation
// This script ensures that dark mode is properly applied across all elements

document.addEventListener('DOMContentLoaded', function() {
  // Get the dark mode toggle element if it exists (on settings page)
  const darkModeToggle = document.getElementById('dark-mode');
  const modeText = document.getElementById('mode-text');
  
  // Check if dark mode is enabled in local storage
  const isDarkMode = localStorage.getItem('darkMode') === 'true';
  
  // Apply dark mode based on stored setting
  if (isDarkMode) {
    enableDarkMode();
  } else {
    disableDarkMode();
  }
  
  // If we're on the settings page, set up the toggle
  if (darkModeToggle) {
    // Set initial toggle state
    darkModeToggle.checked = isDarkMode;
    if (modeText) {
      modeText.textContent = isDarkMode ? 'Päällä' : 'Pois päältä';
    }
    
    // Add event listener for toggle changes
    darkModeToggle.addEventListener('change', function() {
      if (this.checked) {
        enableDarkMode();
        if (modeText) {
          modeText.textContent = 'Päällä';
        }
      } else {
        disableDarkMode();
        if (modeText) {
          modeText.textContent = 'Pois päältä';
        }
      }
      
      // Save preference to localStorage
      localStorage.setItem('darkMode', this.checked);
    });
  }
  
  // Function to enable dark mode
  function enableDarkMode() {
    document.body.classList.add('dark-mode');
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', '#121212');
    }
    
    // Dispatch an event so other scripts can react to dark mode
    document.dispatchEvent(new CustomEvent('darkModeChange', { detail: { isDarkMode: true } }));
  }
  
  // Function to disable dark mode
  function disableDarkMode() {
    document.body.classList.remove('dark-mode');
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', '#f5f5f7');
    }
    
    // Dispatch an event so other scripts can react to dark mode
    document.dispatchEvent(new CustomEvent('darkModeChange', { detail: { isDarkMode: false } }));
  }
  
  // Utility to check if element needs dark mode fix
  function needsDarkModeFix(element) {
    const computedStyle = window.getComputedStyle(element);
    const bgColor = computedStyle.backgroundColor;
    // Check if background is white or very light
    return (bgColor === 'rgb(255, 255, 255)' || 
            bgColor === 'rgba(255, 255, 255, 1)' ||
            bgColor === '#ffffff' ||
            bgColor === 'white');
  }
  
  // Apply fixes to any dynamically added content
  // You can call this manually from other scripts when adding new content
  window.applyDarkModeToNewContent = function(container = document.body) {
    if (!document.body.classList.contains('dark-mode')) return;
    
    // Find elements with white backgrounds
    const elementsToFix = container.querySelectorAll('.message-bubble, .form-container, .modal-content, .tip-card, .support-info');
    
    elementsToFix.forEach(element => {
      if (needsDarkModeFix(element)) {
        // Apply appropriate dark background
        element.style.backgroundColor = '#1e1e1e';
        element.style.color = '#e0e0e0';
        
        // Fix child text elements if needed
        const textElements = element.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, label');
        textElements.forEach(textEl => {
          if (window.getComputedStyle(textEl).color === 'rgb(0, 0, 0)' || 
              window.getComputedStyle(textEl).color === '#000000') {
            textEl.style.color = '#e0e0e0';
          }
        });
      }
    });
  };

  // Listen for DOM changes to fix any dynamically added content
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.addedNodes.length) {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === 1) { // Element node
            window.applyDarkModeToNewContent(node);
          }
        });
      }
    });
  });
  
  // Start observing the document
  observer.observe(document.body, { childList: true, subtree: true });
  
  // Initial check for elements that need fixing
  if (isDarkMode) {
    window.applyDarkModeToNewContent();
  }
});