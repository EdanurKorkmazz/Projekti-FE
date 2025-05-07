document.addEventListener('DOMContentLoaded', function() {
  const style = document.createElement('style');
  style.textContent = `
    .sidebar, .sidebar-toggle, [class*="toggle-button"], button[aria-label*="sivupalkki"] {
      display: none !important;
    }
    
    /* Oma nuolipainike */
    #oma-nuoli {
      position: fixed;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 30px;
      height: 50px;
      background-color: #003a63;
      color: white;
      border: none;
      border-radius: 4px 0 0 4px;
      cursor: pointer;
      z-index: 9999;
      box-shadow: -1px 0 5px rgba(0,0,0,0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.3s;
    }
    
    #oma-nuoli:hover {
      background-color: #00558e;
    }
    
    body.dark-mode #oma-nuoli {
      background-color: #0078d4;
    }
    
    body.dark-mode #oma-nuoli:hover {
      background-color: #0086f0;
    }
    
    /* Oma sivupalkki */
    #oma-sivupalkki {
      position: fixed;
      right: 0;
      top: 0;
      width: 300px;
      height: 100%;
      background: white;
      box-shadow: -2px 0 10px rgba(0,0,0,0.1);
      z-index: 9998;
      overflow-y: auto;
      transition: transform 0.3s ease;
      transform: translateX(100%);
      padding: 20px;
    }
    
    #oma-sivupalkki.auki {
      transform: translateX(0);
    }
    
    body.dark-mode #oma-sivupalkki {
      background: #121212;
      color: white;
    }
  `;
  document.head.appendChild(style);
  
  const alkuperainenSivupalkki = document.querySelector('.sidebar');
  let sisalto = '';
  
  if (alkuperainenSivupalkki) {
    sisalto = alkuperainenSivupalkki.innerHTML;
  } else {
    
    sisalto = `
      <h3 class="sidebar-title">Tietoa unesta</h3>
      <div class="sidebar-content">
        <h4>Uni ja palautuminen</h4>
        <p>Riittävä uni on tärkeää niin fyysiselle kuin psyykkisellekin hyvinvoinnille.</p>
        <h4>Vinkkejä parempaan uneen</h4>
        <ul>
          <li>Pidä säännöllinen unirytmi</li>
          <li>Vältä kofeiinia iltapäivällä</li>
          <li>Rauhoitu ennen nukkumaanmenoa</li>
        </ul>
      </div>
    `;
  }
  
  const omaSivupalkki = document.createElement('div');
  omaSivupalkki.id = 'oma-sivupalkki';
  omaSivupalkki.innerHTML = sisalto;
  
  const omaNuoli = document.createElement('button');
  omaNuoli.id = 'oma-nuoli';
  omaNuoli.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>';
  omaNuoli.setAttribute('aria-label', 'Näytä tietopalkki');
  
  document.body.appendChild(omaSivupalkki);
  document.body.appendChild(omaNuoli);
  
  omaNuoli.addEventListener('click', function() {
    if (omaSivupalkki.classList.contains('auki')) {
      omaSivupalkki.classList.remove('auki');
      omaNuoli.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>';
      omaNuoli.setAttribute('aria-label', 'Näytä tietopalkki');
    } else {
      omaSivupalkki.classList.add('auki');
      omaNuoli.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>';
      omaNuoli.setAttribute('aria-label', 'Piilota tietopalkki');
    }
  });
  

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && omaSivupalkki.classList.contains('auki')) {
      omaSivupalkki.classList.remove('auki');
      omaNuoli.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>';
      omaNuoli.setAttribute('aria-label', 'Näytä tietopalkki');
    }
  });
});