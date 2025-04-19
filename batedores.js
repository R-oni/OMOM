<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OMOM SPA</title>
  <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
  <style>
    /* ===== ESTILOS GERAIS ===== */
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body, html { width: 100%; height: 100%; overflow: hidden; background: black; color: white; font-family: 'Courier New', monospace; }

    /* painel sobre o globo e abaixo do flipbook */
    #painel {
      position: fixed;
      top: 0; left: 0;
      width: 100vw; height: 100vh;
      object-fit: cover;
      object-position: center;
      z-index: 2;
      pointer-events: none;
    }

    /* grid 50/50 dividindo a tela */
    #app {
      display: grid;
      grid-template-rows: 50% 50%;
      width: 100vw; height: 100vh;
      position: relative;
    }

    /* loading */
    #loading-screen {
      position: fixed;
      top: 0; left: 0;
      width: 100vw; height: 100vh;
      background: black;
      display: flex; align-items: center; justify-content: center;
      z-index: 9999;
    }
    #loading-text {
      font-family: 'Press Start 2P', cursive;
      color: #00FFE7;
      font-size: 20px;
    }

    /* globo e flipbook */
    #globe-area, #flipbook-area {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
    }

    /* Globo centralizado ocupando 80% do espaço superior */
    #globe-area {
      z-index: 0;
      width: 80%; height: 100%;
      margin: 0 auto;
      position: relative;
    }
    #globeCanvas {
      width: 100%; height: 100%; max-height: 100%;
      object-fit: contain;
    }
    /* Canvas para o starfield dentro do globe-area, inicialmente oculto */
    #warpCanvas {
      display: none;
      position: absolute;
      top: 10%;
      left: 50%;
      transform: translateX(-50%);
      width: 50%;
      height: 50%;
      z-index: 3;
      pointer-events: none;
    }
    /* Texto de carregamento do globo */
    #globeLoading {
      position: absolute;
      top: 65%;
      left: 50%;
      transform: translateX(-50%);
      font-family: 'Press Start 2P', cursive;
      color: #00FFE7;
      font-size: 8px;
      z-index: 2;
      pointer-events: none;
    }
    /* botão menu escondido inicialmente */
    #btnMenu {
      display: none;
      position: absolute;
      top: 25px; left: 10px;
      background: rgba(0,0,0,0.7);
      color: #00FFE7;
      border: 2px solid #00FFE7;
      font-family: 'Press Start 2P', cursive;
      font-size: 6px;
      padding: 10px;
      cursor: pointer;
      z-index: 999;
    }
    #btnMenu:hover { background: rgba(0,0,0,0.9); }

    /* flipbook posicionado e animável */
    #flipbook-area {
      margin-left: 5%; padding-top: 2vh;
      overflow: hidden;
      width: 100%; height: 100%;
      z-index: 4;
      transform: translateX(100%);
      transition: transform 1.5s ease-out;
    }
    #flipbook-area.show { transform: translateX(0); }
    #flipbook-area.slide-out-left { transform: translateX(-100%); }

    #flipbookContainer { width: 100%; height: calc(100% - 7vh); }

    /* Seta menor no flipbook */
    #flipbook-area #setaBtn {
      position: absolute;
      top: 5px !important; right: 5px;
      width: 35px !important; height: auto !important;
      cursor: pointer; opacity: 0;
      animation: fadeInArrow 0.6s forwards 0.4s, slideArrow 1.0s ease-in-out infinite 0.6s;
      z-index: 5;
    }
    @keyframes fadeInArrow { from { opacity: 0 } to { opacity: 1 } }
    @keyframes slideArrow { 0% { transform: translate(0,0) } 50% { transform: translate(-8px,8px) } 100% { transform: translate(0,0) } }

    /* Imagens clicáveis no flipbook */
    #cliquemundo, #cliqueinversao, #cliqueg, #cliquerefracao,
    #cliquemorse, #cliquecapacitor, #cliquesanguedomundo {
      position: absolute; top:0; left:0; right:0; bottom:0;
      cursor: pointer; width: 100%; height: 100%; z-index: 10;
      animation: fadeInOut 0.7s infinite;
    }
    @keyframes fadeInOut { 0% { opacity:1 } 50% { opacity:0 } 100% { opacity:1 } }

    /* Overlay do Menu Rolante: dentro de #globe-area */
    #menu-overlay {
      position: absolute;
      top:0; left:0;
      width:100%; height:100%;
      backdrop-filter: blur(6px);
      display: none; z-index: 2;
    }
    #menu-overlay.visible { display: block; }

    .symbols-wrapper {
      position: absolute;
      top:40px; left:0; right:0; bottom:0;
      overflow-y: auto; padding:20px;
    }
    .symbols-container {
      display: flex; flex-wrap: wrap;
      justify-content: center; gap: 25px;
    }
    .symbol { cursor: pointer; transition: transform .1s; }
    .symbol img { width: 18vw; transition: transform .3s; }
    .symbol img:hover { transform: scale(1.1); }
    .symbol.brither img { filter: brightness(180%); }
    .symbol.locked img { filter: brightness(50%); }

    /* Overlay para imagens interativas */
    #overlayContainer {
      position: fixed; top:0; left:0;
      width: 100%; height:100%;
      background: rgba(0,0,0,0.8);
      display: none; justify-content: center; align-items: center;
      z-index: 1000;
    }
    #overlayImage { max-width:80%; max-height:80%; transition: transform .3s ease; }
    #btnSair {
      position:absolute; top:20px; right:20px;
      background: rgba(0,0,0,0.7);
      color: #00FFE7;
      border: 2px solid #00FFE7;
      font-family:'Press Start 2P',cursive;
      font-size:12px; padding:10px;
      cursor:pointer; z-index:1001;
    }

    /* --- TÍTULO OMOM --- */
    #menu-title {
      display: none;
      position: absolute;
      top:45%; left:50%;
      transform: translate(-50%,-50%) scale(0.8);
      font-family:'Press Start 2P',cursive;
      color: #FFFFFF;
      font-size: min(5vw,30px);
      opacity:0; z-index:3;
    }
    #menu-title.animate {
      display:block;
      animation: fadeScaleTitle 0.8s ease-out forwards;
    }
    @keyframes fadeScaleTitle { from { opacity:0; transform: translate(-50%,-50%) scale(0.8) } to { opacity:1; transform: translate(-50%,-50%) scale(1) } }

    /* --- FADE+SCALE PARA OS ÍCONES --- */
    .animate-symbols .symbol {
      opacity:0; transform: scale(0.8);
      animation: fadeScaleIn 0.6s ease-out forwards;
    }
    .animate-symbols .symbol:nth-child(1){animation-delay:0.3s}
    .animate-symbols .symbol:nth-child(2){animation-delay:0.4s}
    .animate-symbols .symbol:nth-child(3){animation-delay:0.5s}
    @keyframes fadeScaleIn { from { opacity:0; transform: scale(0.8) } to { opacity:1; transform: scale(1) } }
  </style>
</head>
<body>
  <audio id="bgm"       src="animus.mp3"    loop preload="auto"></audio>
  <audio id="memories"  src="memories.mp3" loop preload="auto"></audio>

  <img id="painel" src="painel.png" alt="Painel">

  <div id="app">
    <div id="globe-area">
      <canvas id="globeCanvas"></canvas>
      <canvas id="warpCanvas"></canvas>
      <div id="globeLoading">CARREGANDO...</div>
      <div id="menu-title">OMOM</div>
      <button id="btnMenu">MENU</button>
      <div id="menu-overlay">
        <div class="symbols-wrapper">
          <div class="symbols-container">
            <div class="symbol brither" data-world="veleywei"><img src="assets/veleyweimenu.png" alt="Velei'wey"></div>
            <div class="symbol locked"  data-world="botychera"><img src="mundos/botychera/botycheramenu.png" alt="Botychera"></div>
            <div class="symbol locked"  data-world="himpis"><img src="mundos/himpis/himpismenu.png" alt="Himpis"></div>
            <div class="symbol brither" data-world="batedores"><img src="mundos/ttok/ttokmenu.png" alt="Batedores"></div>
            <div class="symbol locked"  data-world="denbou"><img src="mundos/denbou/denboumenu.png" alt="DenDenBouBou"></div>
            <div class="symbol locked"  data-world="araporu"><img src="mundos/araporu/araporumenu.png" alt="Araporu"></div>
            <div class="symbol locked"  data-world="artesaos"><img src="mundos/os artesaos/artesaosmenu.png" alt="Artesãos"></div>
            <div class="symbol locked"  data-world="sapador"><img src="mundos/sapador/sapador.png" alt="Sapador"></div>
            <div class="symbol locked"  data-world="dosirelala"><img src="mundos/dosirelala/dosirelalamenu.png" alt="Dosirelala"></div>
            <div class="symbol locked"  data-world="calindreno"><img src="mundos/calindreno/calindreno.png" alt="Calindreno"></div>
            <div class="symbol locked"  data-world="mundoPulsante"><img src="mundos/mundo pulsante/jocelyn.png" alt="Mundo Pulsante"></div>
            <!-- continue aqui -->
          </div>
        </div>
      </div>
    </div>
    <div id="flipbook-area">
      <div id="flipbookContainer"></div>
    </div>
  </div>

  <div id="overlayContainer">
    <button id="btnSair">FECHAR</button>
    <img id="overlayImage" src="" alt="Imagem em destaque">
  </div>

  <div id="loading-screen">
    <div id="loading-text">CARREGANDO...</div>
  </div>

  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
  <script src="turn.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/three@0.128/examples/js/controls/OrbitControls.js"></script>

  <script>
    // funções de fade para memories
    function fadeIn(audio, duration) {
      audio.volume = 0;
      audio.play().catch(() => {});
      const step = 50;
      const volStep = step / duration;
      const fadeInterval = setInterval(() => {
        if (audio.volume + volStep >= 1) {
          audio.volume = 1;
          clearInterval(fadeInterval);
        } else {
          audio.volume += volStep;
        }
      }, step);
    }

    function fadeOut(audio, duration) {
      const step = 50;
      const volStep = step / duration;
      const fadeInterval = setInterval(() => {
        if (audio.volume - volStep <= 0) {
          audio.volume = 0;
          clearInterval(fadeInterval);
          audio.pause();
          audio.currentTime = 0;
        } else {
          audio.volume -= volStep;
        }
      }, step);
    }

    // --- Limpeza do globo atual ---
    function destroyGlobe() {
      const G = window._Globe;
      if (G) {
        if (G.scene) {
          G.scene.traverse(obj => {
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) {
              if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
              else obj.material.dispose();
            }
          });
          G.scene = null;
        }
        if (G.renderer) {
          G.renderer.dispose();
          G.renderer.forceContextLoss && G.renderer.forceContextLoss();
          if (G.renderer.domElement && G.renderer.domElement.parentNode) {
            G.renderer.domElement.parentNode.removeChild(G.renderer.domElement);
          }
          G.renderer = null;
        }
        if (G.controls) {
          G.controls.dispose();
          G.controls = null;
        }
      }
      const area = document.getElementById('globe-area');
      const oldCanvas = area.querySelector('canvas');
      if (oldCanvas) oldCanvas.remove();
      ['sapetyrGloboImage','sangueGloboImage'].forEach(id => {
        const img = document.getElementById(id);
        if (img) img.remove();
      });
      const newCanvas = document.createElement('canvas');
      newCanvas.id = 'globeCanvas';
      area.prepend(newCanvas);
      // parar starfield e ocultar texto
      if (window.stopStarfield) window.stopStarfield();
      document.getElementById('globeLoading').style.display = 'none';
    }

    window.addEventListener('load', () => {
      document.getElementById('loading-screen').style.display = 'none';
      setTimeout(showMenuTitle, 3000);
    });

    function showMenuTitle() {
      const title = document.getElementById('menu-title');
      title.classList.add('animate');
      title.addEventListener('animationend', () => {
        title.style.display = 'none';
        showOverlayMenu();
      }, { once: true });
    }

    const memories = document.getElementById('memories');

    function showOverlayMenu() {
      const ov = document.getElementById('menu-overlay');
      ov.style.display = 'block';
      ov.style.opacity = '1';
      ov.classList.add('visible');
      document.querySelector('.symbols-container').classList.add('animate-symbols');
      if (memories) fadeIn(memories, 1000);
    }

    document.querySelector('.symbols-container').addEventListener('click', e => {
      const sym = e.target.closest('.symbol');
      if (!sym) return;
      launchWorld(sym.dataset.world);
    });

    document.getElementById('btnMenu')?.addEventListener('click', () => {
      showOverlayMenu();
    });

    function launchWorld(name) {
      const fb = document.getElementById('flipbook-area');
      if (fb.classList.contains('show')) {
        fb.classList.remove('show');
        fb.classList.add('slide-out-left');
        fb.addEventListener('transitionend', onSlideOut);
      } else {
        loadWorld(name);
      }
      function onSlideOut() {
        fb.classList.remove('slide-out-left');
        fb.removeEventListener('transitionend', onSlideOut);
        loadWorld(name);
      }
    }

    function loadWorld(worldName) {
      // exibe starfield e texto de carregamento
      document.getElementById('warpCanvas').style.display = 'block';
      document.getElementById('globeLoading').style.display = 'block';
      if (window.startStarfield) window.startStarfield();

      if (memories) fadeOut(memories, 1000);

      destroyGlobe();

      const ov = document.getElementById('menu-overlay');
      ov.classList.remove('visible');
      ov.style.display = 'none';
      ov.style.opacity = '';

      document.getElementById('btnMenu').style.display = 'block';

      document.getElementById('flipbookContainer').innerHTML = '';
      const s = document.createElement('script');
      s.src = worldName + '.js';
      document.body.appendChild(s);
      s.onload = () => {
        if (window.initGlobe) window.initGlobe('#globeCanvas');
        if (window.initFlipbook) window.initFlipbook('#flipbookContainer');
        const fb = document.getElementById('flipbook-area');
        void fb.offsetWidth;
        fb.classList.add('show');
      };
    }

    document.getElementById('btnSair')?.addEventListener('click', e => {
      e.preventDefault();
      $('#overlayContainer').fadeOut(300);
    });
    document.getElementById('overlayContainer')?.addEventListener('click', function(e) {
      if (e.target === this) $(this).fadeOut(300);
    });

    (function() {
      const bgm = document.getElementById('bgm');
      function playOnFirstClick() {
        bgm.volume = 1.0;
        bgm.play().catch(console.warn);
        window.removeEventListener('click', playOnFirstClick);
      }
      window.addEventListener('click', playOnFirstClick);
    })();
  </script>

  <script>
    // starfield logic
    (function(){
      const canvas = document.getElementById("warpCanvas");
      const ctx = canvas.getContext("2d");
      let stars = [], numStars = 300, speed = 2, animationFrameId;

      function setupCanvas() {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
      }

      function createStars() {
        stars = [];
        for (let i = 0; i < numStars; i++) {
          const r = Math.random();
          let color = r < 0.90 ? "white" : r < 0.95 ? "#FF5555" : "#AAAAFF";
          stars.push({
            x: Math.random() * canvas.width - canvas.width/2,
            y: Math.random() * canvas.height - canvas.height/2,
            z: Math.random() * canvas.width,
            color
          });
        }
      }

      function updateStars() {
        ctx.fillStyle = "black";
        ctx.fillRect(0,0,canvas.width,canvas.height);
        stars.forEach(star => {
          star.z -= speed;
          if (star.z <= 0) {
            star.x = Math.random() * canvas.width - canvas.width/2;
            star.y = Math.random() * canvas.height - canvas.height/2;
            star.z = canvas.width;
          }
          const perspective = 300 / star.z;
          const sx = star.x * perspective + canvas.width/2;
          const sy = star.y * perspective + canvas.height/2;
          const size = Math.max(2 * perspective, 0.5);
          ctx.fillStyle = star.color;
          ctx.beginPath();
          ctx.arc(sx, sy, size, 0, 2*Math.PI);
          ctx.fill();
        });
        animationFrameId = requestAnimationFrame(updateStars);
      }

      window.startStarfield = function() {
        setupCanvas();
        createStars();
        updateStars();
        window.addEventListener("resize", () => {
          setupCanvas();
          createStars();
        });
      };
      window.stopStarfield = function() {
        cancelAnimationFrame(animationFrameId);
        ctx.clearRect(0,0,canvas.width,canvas.height);
        canvas.style.display = "none";
      };
    })();
  </script>

  <script>
    document.addEventListener("globoCarregado", function() {
      document.getElementById("globeLoading").style.display = 'none';
      if (window.stopStarfield) window.stopStarfield();
    });
  </script>
</body>
</html>
