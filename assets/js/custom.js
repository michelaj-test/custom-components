console.log("✅ custom.js caricato correttamente");


// prove per inserire l'immagine di SBA accanto al logo Minerva
(function () {
  // Aspetta che il DOM sia pronto
  const waitForElement = (selector, callback) => {
    const el = document.querySelector(selector);
    if (el) {
      callback(el);
    } else {
      setTimeout(() => waitForElement(selector, callback), 300);
    }
  };
  // Quando flex-layout-center è disponibile
  waitForElement('header .header-container .flex-layout-center', function (logoElDesktop) {
    // Crea nuovo contenitore per l'immagine
    const newDiv1 = document.createElement('div');
    newDiv1.className = 'custom-injected-logo sba-desktop';

    // Crea link + immagine
    newDiv1.innerHTML = `
      <a href="https://www.sba.unimi.it" target="_blank" rel="noopener">
        <img src="custom/39UMI_INST-VU_NDE_ELISA/assets/images/logo-sba.png" alt="SBA">
      </a>
    `;

    // Inserisce PRIMA del logo ufficiale
    logoElDesktop.parentNode.insertBefore(newDiv1, logoElDesktop);
  });

  // Quando <nde-logo> è disponibile
  waitForElement('nde-logo', function (logoEl) {
    // Crea nuovo contenitore per l'immagine
    const newDiv = document.createElement('div');
    newDiv.className = 'custom-injected-logo sba-mobile';

    // Crea link + immagine
    newDiv.innerHTML = `
      <a href="https://www.sba.unimi.it" target="_blank" rel="noopener">
        <img src="custom/39UMI_INST-VU_NDE_ELISA/assets/images/logo-sba.png" alt="SBA">
      </a>
    `;

    // Inserisce PRIMA del logo ufficiale
    logoEl.parentNode.insertBefore(newDiv, logoEl);
  });
})();

//barra intestazione Collezioni

(function() {
  const style = document.createElement('style');
  style.textContent = `
    nde-collection-discovery-lobby-header .collection-discovery-header {
      background: none !important;
      background-color: #f1f0f4 !important;
    }
    nde-collection-discovery-lobby-header .collection-discovery-header-title {
      color: #003366 !important;
    }
  `;
  document.head.appendChild(style);
})();


//BiblioHELP EG 20260211 (c'è una parte anche in custom.css
/* ====== CREAZIONE PULSANTE BIBLIOHELP ====== */
/*function creaPulsanteVerticale() {
    if (document.getElementById("helpdesk-vertical")) return;

    const btn = document.createElement("div");
    btn.id = "helpdesk-vertical";
    btn.title = "BiblioHELP";
    btn.innerHTML = '<span class="vertical-text">BiblioHELP</span>';
    document.body.appendChild(btn);

    
    /* CLICK → apri BiblioHELP 
    btn.addEventListener("click", function () {
        window.location.href = "https://unimi.libanswers.com/";
    });

}*/
/* ====== CREAZIONE PULSANTE BIBLIOHELP con immagine ufficiale bibliohelp.png ====== */
function creaPulsanteVerticale() {
    if (document.getElementById("helpdesk-vertical")) return;

    const btn = document.createElement("div");
    btn.id = "helpdesk-vertical";
    btn.title = "BiblioHELP";

    const img = document.createElement("img");
    img.src = "custom/39UMI_INST-VU_NDE_ELISA/assets/images/bibliohelp.png";
    img.alt = "BiblioHELP";
    img.className = "helpdesk-img";

    btn.appendChild(img);
    document.body.appendChild(btn);

    btn.addEventListener("click", () => {
        window.location.href = "https://unimi.libanswers.com/";
    });
}

/* POSIZIONAMENTO DINAMICO */
function posizionaPulsante() {
    const btn = document.getElementById("helpdesk-vertical");
    if (!btn) return;

    const footer = document.querySelector("footer");
    const footerHeight = footer ? footer.offsetHeight : 0;

    const vh = window.innerHeight;
    let top = vh * 0.70;

    if (window.innerWidth < 768) {
        top = vh * 0.80;
    }

    btn.style.top = `calc(${top}px - ${footerHeight + 20}px)`;
}

/* AVVIO */
const start = setInterval(() => {
    if (document.body) {
        creaPulsanteVerticale();
        posizionaPulsante();
    }

    if (document.getElementById("helpdesk-vertical")) {
        clearInterval(start);
    }
}, 300);

window.addEventListener("resize", posizionaPulsante);
setInterval(posizionaPulsante, 1000);