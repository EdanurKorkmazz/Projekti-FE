document.addEventListener('DOMContentLoaded', function() {
    const floatingButton = document.getElementById('floating-entry-button');
    const entryModal = document.getElementById('entry-modal');
    const closeModalBtn = document.getElementById('close-entry-modal');
    const modalBackdrop = document.querySelector('.entry-modal-backdrop');
    
    if (floatingButton && entryModal && closeModalBtn) {
      floatingButton.addEventListener('click', function() {
        entryModal.classList.add('open');
        
        updateModalContent();
      });
      
      closeModalBtn.addEventListener('click', function() {
        entryModal.classList.remove('open');
      });
      
      modalBackdrop.addEventListener('click', function() {
        entryModal.classList.remove('open');
      });
      
      entryModal.querySelector('.entry-modal-content').addEventListener('click', function(event) {
        event.stopPropagation();
      });
      
      document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && entryModal.classList.contains('open')) {
          entryModal.classList.remove('open');
        }
      });
      
      let pulseTimeout;
      
      const resetPulseAnimation = () => {
        if (pulseTimeout) {
          clearTimeout(pulseTimeout);
        }
        
        const buttonPulse = floatingButton.querySelector('.button-pulse');
        buttonPulse.style.display = 'block';
        
        pulseTimeout = setTimeout(() => {
          buttonPulse.style.display = 'none';
        }, 5000);
      };
      
      const startRandomPulse = () => {
        const randomTime = Math.floor(Math.random() * 40000) + 20000;
        
        setTimeout(() => {
          resetPulseAnimation();
          startRandomPulse(); 
        }, randomTime);
      };
      
      setTimeout(() => {
        startRandomPulse();
      }, 5000);
    }
    
    
    function updateModalContent() {
      const hasEntries = checkForExistingEntries();
      const modalTitle = entryModal.querySelector('.entry-modal-header h2');
      const modalDescription = entryModal.querySelector('.entry-modal-body p');
      
      const browseEntriesBtn = document.querySelector('.entry-options .secondary-option');
      
      if (hasEntries) {
        modalTitle.textContent = 'Merkinnät ja seuranta';
        modalDescription.textContent = 'Voit tehdä uuden merkinnän tai tarkastella aiempia merkintöjäsi.';
        
        if (browseEntriesBtn) {
          browseEntriesBtn.style.display = 'flex';
        }
      } else {
        modalTitle.textContent = 'Uusi merkintä';
        modalDescription.textContent = 'Tee ensimmäinen merkintäsi päiväkirjaan aloittaaksesi unesi seurannan.';
        
        if (browseEntriesBtn) {
          browseEntriesBtn.style.display = 'none';
        }
      }
      
      const selectedData = [];
      document.querySelectorAll('.data-checkbox input:checked').forEach(checkbox => {
        selectedData.push(checkbox.getAttribute('data-id'));
      });
      
      sessionStorage.setItem('selectedData', JSON.stringify(selectedData));
      
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      
      sessionStorage.setItem('lastChartDate', formattedDate);
    }
    
   
    function checkForExistingEntries() {
      return true;
    }
  });