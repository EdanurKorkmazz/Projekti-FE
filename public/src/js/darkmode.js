document.addEventListener('DOMContentLoaded', function() {
  const darkModeToggle = document.getElementById('dark-mode');
  const modeText = document.getElementById('mode-text');
  
  const isDarkMode = localStorage.getItem('darkMode') === 'true';
  
  // dark mode on/off

  if (isDarkMode) {
    enableDarkMode();
  } else {
    disableDarkMode();
  }
  
  if (darkModeToggle) {
    darkModeToggle.checked = isDarkMode;
    if (modeText) {
      modeText.textContent = isDarkMode ? 'Päällä' : 'Pois päältä';
    }
    
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
      
      localStorage.setItem('darkMode', this.checked);
    });
  }
  
  function enableDarkMode() {
    document.body.classList.add('dark-mode');
    
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', '#121212');
    }
    
    document.dispatchEvent(new CustomEvent('darkModeChange', { detail: { isDarkMode: true } }));
  }
  
  function disableDarkMode() {
    document.body.classList.remove('dark-mode');
    
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', '#f5f5f7');
    }
    
    document.dispatchEvent(new CustomEvent('darkModeChange', { detail: { isDarkMode: false } }));
  }
  
  function needsDarkModeFix(element) {
    const computedStyle = window.getComputedStyle(element);
    const bgColor = computedStyle.backgroundColor;
    return (bgColor === 'rgb(255, 255, 255)' || 
            bgColor === 'rgba(255, 255, 255, 1)' ||
            bgColor === '#ffffff' ||
            bgColor === 'white');
  }
  
  
  window.applyDarkModeToNewContent = function(container = document.body) {
    if (!document.body.classList.contains('dark-mode')) return;
    
    const elementsToFix = container.querySelectorAll('.message-bubble, .form-container, .modal-content, .tip-card, .support-info');
    
    elementsToFix.forEach(element => {
      if (needsDarkModeFix(element)) {
        element.style.backgroundColor = '#1e1e1e';
        element.style.color = '#e0e0e0';
        
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

  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.addedNodes.length) {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === 1) { 
            window.applyDarkModeToNewContent(node);
          }
        });
      }
    });
  });
  
  observer.observe(document.body, { childList: true, subtree: true });
  
  if (isDarkMode) {
    window.applyDarkModeToNewContent();
  }
});