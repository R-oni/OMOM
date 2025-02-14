<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8" />
  <title>Exemplo Responsivo sem Rolagem</title>
  <style>
    html, body {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      background-color: #000;
      color: #fff;
      font-family: sans-serif;
    }
    .page-container {
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      align-items: center;
      width: 100%;
      height: 100%;
    }
    .top-section img {
      width: 15vmax;
      max-width: 80vw;
      height: auto;
    }
    .globe-section {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    #globeCanvas {
      width: 25vmax;
      height: 25vmax;
      max-width: 80vw;
      max-height: 40vh;
    }
    #flipbook {
      position: relative;
    }
    .page {
      position: relative;
    }
    .page img {
      width: 100%;
      height: auto;
      display: block;
    }
    /* Botão de troca de foco */
    .focus-button {
      position: absolute;
      top: 10px;
      right: 10px;
      padding: 8px 12px;
      background: rgba(255, 255, 255, 0.2);
      color: #fff;
      border: 1px solid #fff;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <div class="page-container">
    <div class="top-section">
      <img src="titulottok.png" alt="Título Velei'wey">
    </div>
    <!-- Único canvas para os globos -->
    <div class="globe-section">
      <canvas id="globeCanvas"></canvas>
    </div>
    <div id="flipbook">
      <!-- Página 1 -->
      <div class="page hard"><img src="pagina1.png" alt="Capa"></div>
      <!-- Página 2: yyy.png com o botão para trocar o foco -->
      <div class="page">
        <img src="yyy.png" alt="Página 1">
        <button id="focusButton" class="focus-button">Trocar Foco</button>
      </div>
      <!-- Outras páginas -->
      <div class="page"><img src="pagina3.png" alt="Página 2"></div>
      <div class="page"><img src="pagina3.jpg" alt="Página 9"></div>
      <div class="page"><img src="pagina2.png" alt="Página 11"></div>
      <div class="page"><img src="pagina3.png" alt="Página 12"></div>
      <div class="page"><img src="pagina2.png" alt="Página 12"></div>
      <div class="page"><img src="pagina3.png" alt="Página 12"></div>
      <div class="page"><img src="pagina2.png" alt="Página 12"></div>
    </div>
  </div>

  <div id="overlayContainer">
    <img id="overlayImage" src="" alt="Imagem Overlay">
  </div>

  <!-- Scripts necessários -->
  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/three@0.128/examples/js/controls/OrbitControls.js"></script>
  <script src="turn.min.js"></script>
  
  <!-- Carrega o globo.js -->
  <script src="./globo.js"></script>
  
  <!-- Script para o botão de foco -->
  <script>
    document.addEventListener("DOMContentLoaded", () => {
      const focusButton = document.getElementById('focusButton');
      if (focusButton) {
        focusButton.addEventListener('click', (e) => {
          e.stopPropagation();
          // Certifica-se de que os objetos globais foram definidos
          if (window.controls && window.camera && window.orbitSphere) {
            // Captura a posição atual do globo orbitante
            const targetPos = window.orbitSphere.position.clone();
            // Atualiza o alvo dos controles para o globo orbitante
            window.controls.target.copy(targetPos);
            // Reposiciona a câmera para ficar mais próxima do globo orbitante
            // Ajuste o vetor de offset conforme necessário
            window.camera.position.copy(targetPos.clone().add(new THREE.Vector3(0, 0, 2)));
            window.controls.update();
          }
        });
      }
    });
  </script>
</body>
</html>
