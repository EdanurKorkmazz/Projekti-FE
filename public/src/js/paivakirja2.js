document.addEventListener('DOMContentLoaded', function() {
    const sliders = document.querySelectorAll('input[type="range"]');
  
    sliders.forEach(function(slider) {
      let valueDisplay = document.getElementById(`${slider.id}-value`);
      
      if (!valueDisplay) {
        valueDisplay = document.createElement('span');
        valueDisplay.id = `${slider.id}-value`;
        valueDisplay.className = 'range-value';
        
        if (slider.nextElementSibling) {
          slider.parentNode.insertBefore(valueDisplay, slider.nextElementSibling);
        } else {
          slider.parentNode.appendChild(valueDisplay);
        }
      }
      
      valueDisplay.textContent = slider.value;
      
      slider.addEventListener('input', function() {
        valueDisplay.textContent = this.value;
        updateProgressBar(this.id, this.value);
      });
    });
    
    function updateProgressBar(sliderId, value) {
      const progressBar = document.getElementById(`${sliderId}-bar`);
      if (progressBar) {
        const slider = document.getElementById(sliderId);
        const min = parseInt(slider.min) || 1;
        const max = parseInt(slider.max) || 10;
        
        const percentage = ((value - min) / (max - min)) * 100;
        
        progressBar.style.width = `${percentage}%`;
        
        const valueElement = document.getElementById(`${sliderId}-bar-value`);
        if (valueElement) {
          valueElement.textContent = value;
        }
      }
      
      const modalProgressBar = document.getElementById(`modal-${sliderId}-bar`);
      const modalValueElement = document.getElementById(`modal-${sliderId}-value`);
      
      if (modalProgressBar && modalValueElement) {
        const slider = document.getElementById(sliderId);
        const min = parseInt(slider.min) || 1;
        const max = parseInt(slider.max) || 10;
        
        const percentage = ((value - min) / (max - min)) * 100;
        
        modalProgressBar.style.width = `${percentage}%`;
        modalValueElement.textContent = `${value}/10`;
      }
    }
  });

  document.addEventListener('DOMContentLoaded', function() {
    const tooltipData = {
      'date': 'Merkitse tähän päivämäärä, jolta merkintä tehdään',
      'time': 'Merkitse kellonaika, jolloin menit vuoteeseen nukkumistarkoituksessa',
      'delay-hours': 'Arvioi, kuinka kauan kesti nukahtaa siitä, kun laitoit valot pois ja aloit yrittää nukahtamista',
      'wakeups': 'Montako kertaa heräsit unijakson aikana',
      'timeup-hours': 'Arvioi, kuinka kauan olit yhteensä hereillä yöllisten heräämisten aikana',
      'lkm': 'Merkitse kellonaika, jolloin nousit vuoteesta aamulla',
      'sleeptime-hours': 'Arvioi, kuinka kauan nukuit yhteensä',
      'inbed-hours': 'Arvioi, kuinka kauan olit vuoteessa yhteensä',
      'quality': 'Arvioi unesi laatua asteikolla 1-10, jossa 1 on erittäin huono ja 10 erinomainen',
      'alertness': 'Arvioi päivänaikaista vireyttäsi asteikolla 1-10, jossa 1 on erittäin väsynyt ja 10 erittäin virkeä',
      'treatment': 'Kirjaa tähän käyttämäsi unenhoitomenetelmät (esim. rentoutusharjoitus, unilääke)',
      'haitat': 'Kirjaa tähän mahdolliset uneen vaikuttaneet häiriötekijät (esim. stressi, alkoholi, sairaus)'
    };
  
    for (const [id, tooltip] of Object.entries(tooltipData)) {
      const element = document.getElementById(id);
      if (element) {
        const tooltipElement = document.createElement('div');
        tooltipElement.className = 'tooltip';
        tooltipElement.textContent = tooltip;
        
        const label = document.querySelector(`label[for="${id}"]`);
        if (label) {
          label.title = tooltip;
          label.classList.add('has-tooltip');
        }
      }
    }
  });