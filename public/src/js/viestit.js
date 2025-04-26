// Viestit-sivun toiminnallisuus
document.addEventListener('DOMContentLoaded', function() {
    // Elementtien haku
    const inboxTab = document.getElementById('inbox-tab');
    const newMessageTab = document.getElementById('new-message-tab');
    const messageList = document.getElementById('message-list');
    const newMessageForm = document.getElementById('new-message-form');
    const chatContainer = document.getElementById('chat-container');
    const backToMessages = document.getElementById('back-to-messages');
    const cancelMessageBtn = document.getElementById('cancel-message');
    const sendMessageBtn = document.getElementById('send-message');
    const sendChatMessageBtn = document.getElementById('send-chat-message');
    const chatMessages = document.getElementById('chat-messages');
    const chatMessageInput = document.getElementById('chat-message');
    const notification = document.getElementById('notification');
    
    // Viestien tiedot (demo-tarkoituksiin)
    const messageContents = {
      1: {
        title: "Tervetuloa OmaUni-sovellukseen",
        sender: "Unilääkäri Joonas Unikko",
        messages: [
          {
            sender: "Unilääkäri Joonas Unikko",
            content: "Hei ja tervetuloa käyttämään OmaUni-sovellusta! Olen unilääkäri Joonas Unikko ja toimin pääasiallisena yhteyshenkilönäsi sovelluksen käytössä. Tehtäväni on auttaa sinua parantamaan untasi ja seuraamaan palautumistasi säännöllisesti.",
            time: "26.4.2025 8:15"
          },
          {
            sender: "Unilääkäri Joonas Unikko",
            content: "Sovelluksen kautta voit täyttää unipäiväkirjaa, seurata unesi laatua ja saada henkilökohtaista palautetta. Jos sinulla on kysyttävää unitottumuksistasi tai sovelluksen käytöstä, voit aina lähettää minulle viestin tätä kautta.",
            time: "26.4.2025 8:16"
          },
          {
            sender: "Unilääkäri Joonas Unikko",
            content: "Pyrin vastaamaan viesteihin 1-2 arkipäivän kuluessa. Aloitetaan yhdessä matka parempaan uneen!",
            time: "26.4.2025 8:17"
          }
        ]
      },
      2: {
        title: "Tietoja sovelluksen käytöstä",
        sender: "Järjestelmänvalvoja",
        messages: [
          {
            sender: "Järjestelmänvalvoja",
            content: "Hei! Tässä joitakin hyödyllisiä vinkkejä OmaUni-sovelluksen käyttöön. Täyttämällä unipäiväkirjaa säännöllisesti saat tarkempia analyysejä unestasi. Muista myös tarkistaa Seuranta-välilehti, josta näet kehityksen pidemmällä aikavälillä.",
            time: "25.4.2025 10:30"
          }
        ]
      },
      3: {
        title: "Tarkistus kokonaistilanteesta",
        sender: "Unilääkäri Joonas Unikko",
        messages: [
          {
            sender: "Unilääkäri Joonas Unikko",
            content: "Hei! Huomasin, että unesi laatu on parantunut viimeisen viikon aikana. Oletko huomannut itse mitään muutosta virkeydessä tai jaksamisessa?",
            time: "20.4.2025 14:45"
          },
          {
            sender: "Käyttäjä",
            content: "Kyllä, olen huomannut olevani virkeämpi aamuisin! Olen myös noudattanut suosittelemaasi iltarutiinia ja se tuntuu toimivan hyvin.",
            time: "20.4.2025 18:20"
          },
          {
            sender: "Unilääkäri Joonas Unikko",
            content: "Hieno kuulla! Säännöllinen iltarutiini on yksi tehokkaimmista tavoista parantaa unen laatua. Jatka samaan malliin ja seurataan tilannetta.",
            time: "21.4.2025 9:10"
          }
        ]
      },
      4: {
        title: "Päivitys sovellukseen",
        sender: "Järjestelmänvalvoja",
        messages: [
          {
            sender: "Järjestelmänvalvoja",
            content: "Hei! OmaUni-sovellukseen on julkaistu päivitys. Uusina ominaisuuksina mm. mahdollisuus lisätä muistiinpanoja unipäiväkirjamerkintöihin ja paranneltu seurantanäkymä. Päivitys asentuu automaattisesti seuraavan kirjautumisen yhteydessä.",
            time: "15.4.2025 15:00"
          }
        ]
      }
    };
    
    // Välilehtien vaihtaminen
    inboxTab.addEventListener('click', function() {
      messageList.style.display = 'block';
      newMessageForm.style.display = 'none';
      chatContainer.style.display = 'none';
      
      inboxTab.classList.add('active');
      newMessageTab.classList.remove('active');
    });
    
    newMessageTab.addEventListener('click', function() {
      messageList.style.display = 'none';
      newMessageForm.style.display = 'block';
      chatContainer.style.display = 'none';
      
      inboxTab.classList.remove('active');
      newMessageTab.classList.add('active');
    });
    
    // Takaisin viesteihin -painike
    backToMessages.addEventListener('click', function() {
      chatContainer.style.display = 'none';
      messageList.style.display = 'block';
      
      inboxTab.classList.add('active');
      newMessageTab.classList.remove('active');
    });
    
    // Peruuta uusi viesti
    cancelMessageBtn.addEventListener('click', function() {
      document.getElementById('recipient').value = '';
      document.getElementById('subject').value = '';
      document.getElementById('message').value = '';
      
      messageList.style.display = 'block';
      newMessageForm.style.display = 'none';
      
      inboxTab.classList.add('active');
      newMessageTab.classList.remove('active');
    });
    
    // Viestin lähettäminen lomakkeesta
    sendMessageBtn.addEventListener('click', function() {
      const recipient = document.getElementById('recipient').value;
      const subject = document.getElementById('subject').value;
      const message = document.getElementById('message').value;
      
      if (!recipient || !subject || !message) {
        alert('Täytä kaikki kentät ennen lähettämistä.');
        return;
      }
      
      // Simuloidaan viestin lähettämistä
      document.getElementById('recipient').value = '';
      document.getElementById('subject').value = '';
      document.getElementById('message').value = '';
      
      // Näytetään ilmoitus onnistuneesta lähetyksestä
      notification.textContent = 'Viesti lähetetty onnistuneesti!';
      notification.classList.add('show');
      
      // Piilotetaan ilmoitus 3 sekunnin kuluttua
      setTimeout(function() {
        notification.classList.remove('show');
      }, 3000);
      
      // Palataan viestilistaukseen
      messageList.style.display = 'block';
      newMessageForm.style.display = 'none';
      
      inboxTab.classList.add('active');
      newMessageTab.classList.remove('active');
    });
    
    // Viestiketjun avaaminen
    const messageItems = document.querySelectorAll('.message-item');
    messageItems.forEach(item => {
      item.addEventListener('click', function() {
        const messageId = this.getAttribute('data-id');
        const messageSender = this.getAttribute('data-sender');
        
        if (messageId && messageContents[messageId]) {
          // Asetetaan viestiketjun tiedot
          document.getElementById('chat-title').textContent = messageContents[messageId].title;
          document.getElementById('chat-recipient').textContent = messageSender;
          
          // Tyhjennetään aiemmat viestit
          chatMessages.innerHTML = '';
          
          // Lisätään viestit
          messageContents[messageId].messages.forEach(msg => {
            const messageElement = document.createElement('div');
            messageElement.className = msg.sender === 'Käyttäjä' ? 'message-bubble sent' : 'message-bubble received';
            
            let messageHTML = '';
            if (msg.sender !== 'Käyttäjä') {
              messageHTML += `<div class="message-sender">${msg.sender}</div>`;
            }
            
            messageHTML += `<div class="message-content">${msg.content}</div>`;
            messageHTML += `<span class="message-time">${msg.time}</span>`;
            
            messageElement.innerHTML = messageHTML;
            chatMessages.appendChild(messageElement);
          });
          
          // Scrollataan viestilistan loppuun
          chatMessages.scrollTop = chatMessages.scrollHeight;
          
          // Näytetään viestiketju ja piilotetaan muut
          messageList.style.display = 'none';
          newMessageForm.style.display = 'none';
          chatContainer.style.display = 'flex';
          
          // Merkitään viesti luetuksi, jos se oli lukematon
          if (this.classList.contains('unread')) {
            this.classList.remove('unread');
            
            // Päivitetään lukemattomien viestien määrä välilehdissä
            inboxTab.textContent = 'Saapuneet';
          }
        }
      });
    });
    
    // Viestin lähettäminen viestiketjussa
    sendChatMessageBtn.addEventListener('click', function() {
      const messageText = chatMessageInput.value.trim();
      
      if (messageText) {
        // Luodaan uusi viestielementti
        const messageElement = document.createElement('div');
        messageElement.className = 'message-bubble sent';
        
        const now = new Date();
        const formattedDate = `${now.getDate()}.${now.getMonth() + 1}.${now.getFullYear()} ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
        
        messageElement.innerHTML = `
          <div class="message-content">${messageText}</div>
          <span class="message-time">${formattedDate}</span>
        `;
        
        chatMessages.appendChild(messageElement);
        
        // Tyhjennetään tekstikenttä
        chatMessageInput.value = '';
        
        // Scrollataan viestilistan loppuun
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Demo-tarkoituksiin: lisätään automaattinen vastaus 1 sekunnin kuluttua
        setTimeout(function() {
          const replyElement = document.createElement('div');
          replyElement.className = 'message-bubble received';
          
          const recipient = document.getElementById('chat-recipient').textContent;
          const later = new Date(now.getTime() + 60000); // 1 minuutti myöhemmin
          const formattedLaterDate = `${later.getDate()}.${later.getMonth() + 1}.${later.getFullYear()} ${later.getHours()}:${later.getMinutes().toString().padStart(2, '0')}`;
          
          replyElement.innerHTML = `
            <div class="message-sender">${recipient}</div>
            <div class="message-content">Kiitos viestistäsi! Vastaan tarkemmin mahdollisimman pian.</div>
            <span class="message-time">${formattedLaterDate}</span>
          `;
          
          chatMessages.appendChild(replyElement);
          
          // Scrollataan viestilistan loppuun
          chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1000);
      }
    });
    
    // Enter-näppäin lähettää viestin chat-näkymässä
    chatMessageInput.addEventListener('keydown', function(event) {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault(); // Estetään rivinvaihto
        sendChatMessageBtn.click(); // Kutsutaan lähetyspainikkeen klikkausta
      }
    });
  });