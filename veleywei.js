window.initFlipbook = function(wrapperSelector) {
  const wrap = document.querySelector(wrapperSelector);
  const slides = [
    'mundos/veleywei/imagens/cap1/pagina1.webp', // slide 3 - Lorem Ipsum
    'mundos/veleywei/imagens/cap1/pagina2.webp', // slide 3
    'mundos/veleywei/imagens/cap1/pagina3.webp', // slide 4                                // slide 2 - Lorem Ipsum  
    'mundos/veleywei/imagens/cap1/pagina4.webp', // slide 4
    'LOREM_1', // slide 6
    'mundos/veleywei/imagens/cap1/empurrando.webp', // slide 4
    'LOREM_2', // slide 6
    'GLOBO',                                  // slide 8: globo
    'LOREM_3', // slide 6
    'LOREM_4', // slide 6
    'LOREM_5', // slide 6
    'LOREM_6', // slide 6
    'LOREM_7', // slide 6
    'LOREM_8', // slide 6
    'LOREM_9', // slide 6
    'LOREM_10', // slide 6
    'LOREM_11', // slide 6
    'LOREM_12', // slide 6
    'LOREM_13', // slide 6
    'LOREM_14', // slide 6
    'LOREM_15', // slide 6
    'mundos/veleywei/imagens/cap1/Spiraqel.webp', // slide 4
    'mundos/veleywei/imagens/cap1/Spiraqel2.webp', // slide 4
    'mundos/veleywei/imagens/cap1/Spiraqel3.webp', // slide 4
    'mundos/veleywei/imagens/cap1/Spiraqel4.webp', // slide 4
    'mundos/veleywei/imagens/cap1/Spiraqel5.webp', // slide 4
    'LOREM_16', // slide 6
    'LOREM_17', // slide 6
    'LOREM_18', // slide 6
    'mundos/veleywei/imagens/cap1/veleywei2.webp', // slide 4
    'LOREM_19', // slide 6
    'LOREM_20', // slide 6
    'LOREM_21', // slide 
    'mundos/veleywei/imagens/cap1/veleywei1.webp', // slide 4
    'mundos/veleywei/imagens/cap1/pagina5.webp', // slide 4
    'mundos/veleywei/imagens/cap1/pagina6.webp', // slide 4
  ];

  // Textos Lorem Ipsum para as duas primeiras páginas
  const loremTexts = {
    'LOREM_1': `
      <div class="lorem-page" style="color:#4B2E19;">
        <p>De elevada estatura, esguios seres</p>
        <p>empurram grandes bolhas de interior</p>
        <p>líquido pelos pântanos de Veley-Wei</p>
        <p>(w com traço em cima).</p>
        <p>Botyr(y com ponto em cima), Botazo,</p>
        <p>Vole'a e Sapetyr lideram e limpam</p>
        <p>caminho enquanto outros empurram</p>
        <p>bolsões, caminhando das águas</p>
        <p>de Ylue até as florestas</p>
        <p>flutuantes de Vorei-ya-Baron</p>
      </div>
    `,
    'LOREM_2': `
      <div class="lorem-page">
        <h2>CAPÍTULO I</h2>
        <p>Veley'wei,%Suas águas se acumulam</p>
        <p>em rios e mares nos trópicos</p>
        <p>do sul. Ao norte, em contraste,</p>
        <p>vastas florestas se erguem sobre</p>
        <p>o solo: as Vorei-ya-Baron ("Boca</p>
        <p>do Céu que Alimenta"), cuja copa</p>
        <p>se estende acima do pântano</p>
        <p>e raízes que jamais tocam a terra.</p>
      </div>
    `,
    'LOREM_3': `
      <div class="lorem-page">
        <p>Durante vinte dias, um grupo</p>
        <p>de Yero-Bens (hifen aqui)</p>
        <p>assim se nomeiam como povo</p>
        <p>(hífen aqui) segue pelas</p>
        <p>florestas rumo ao sul,</p>
        <p>em direção ao litoral.</p>
        <p>As estações são bem definidas,</p>
        <p>marcando o início de seu</p>
        <p>rito reprodutivo, sempre no</p>
        <p>começo do verão.</p>
      </div>
    `,
    'LOREM_4': `
      <div class="lorem-page">
        <p>Quando chegam à praia,</p>
        <p>o ritual começa.</p>
        <p>Iniciam seu canto enquanto</p>
        <p>comem Pyroras, pequenos tipo-fruto</p>
        <p>encontrados em regiões costeiras.</p>
        <p>Pinturas corporais com argila</p>
        <p>tingida fazem parte do fenômeno</p>
        <p>cultural.</p>
      </div>
    `,
    'LOREM_5': `
      <div class="lorem-page">
        <p>Prosseguem, então, para a água</p>
        <p>rica em carbono e mergulham</p>
        <p>até certa profundidade, onde</p>
        <p>se encontram as Ledes, corpos</p>
        <p>esféricos que contém uma seda</p>
        <p>gelatinosa altamente resistente</p>
        <p>à tensão. As Yerô-Bens passam</p>
        <p>por uma metamorfose</p>
      </div>
    `,
    'LOREM_6': `
      <div class="lorem-page">
        <p>durante a alta reprodutiva</p>
        <p>que fortalece seu aspecto</p>
        <p>anfíbio, dando tempo que tudo</p>
        <p>ocorra debaixo d'água. A duração</p>
        <p>do ritual é de cinco dias,</p>
        <p>o tempo exato para</p>
      </div>
    `,
    'LOREM_7': `
      <div class="lorem-page">
        <p>que as alterações fisiológicas</p>
        <p>da metamorfose garantam uma</p>
        <p>adaptação aquática bem sucedida.</p>
        <p>O processo ocorre por <span style="color:red;">partenogênese()</span>.</p>
        <p>As Yerô-Bens são, portanto, tipo-fêmea.</p>
      </div>
    `,
    'LOREM_8': `
      <div class="lorem-page">
        <p>Cantam enquanto liberam os</p>
        <p>tipo-ovo na água e em seguida,</p>
        <p>os enrolam em grupos de sete</p>
        <p>em bolsões, os Ledo, utilizando</p>
        <p>a seda extraída das Ledeo</p>
      </div>
    `,
    'LOREM_9': `
      <div class="lorem-page">
        <h2 style="color:#111; margin-bottom: 24px; text-shadow:none;">YERÔ-BEN</h2>
        <p>A espécie emergiu das águas</p>
        <p>mornas de Veley-wei. Evoluiram</p>
        <p>lentamente de pequenos <span style="color:red;">crustáceos()</span>.</p>
        <p>Seus membros eram curtos e</p>
        <p>segmentados, mas muito ágeis.</p>
      </div>
    `,
    'LOREM_10': `
      <div class="lorem-page">
        <p>Com o tempo, influenciadas pela</p>
        <p>baixa gravidade de Veley-wei</p>
        <p>(4,6 m/s^2), as Yerô-Bens alongaram</p>
        <p>seus membros até atingirem os</p>
        <p>impressionantes 40 metros de altura.</p>
      </div>
    `,
    'LOREM_11': `
      <div class="lorem-page">
        <p>Sete membros segmentados sustentam</p>
        <p>seu corpo. Em paralelo, em seu</p>
        <p>tórax destacam-se sete órgãos <span style="color:red;">vestibulares()</span> externos que as</p>
        <p>permitem controlar seus membros</p>
        <p>com elevada precisão.</p>
      </div>
    `,
    'LOREM_12': `
      <div class="lorem-page">
        <p>Outros quatro órgãos azul-cobalto,</p>
        <p>também <span style="color:red;">vestibulares()</span>, porém, mais</p>
        <p>sensíveis às vibrações sonoras,</p>
        <p>dispostos nos lados de suas cabeças.</p>
      </div>
    `,
    'LOREM_13': `
      <div class="lorem-page">
        <p>Todo esse aparato sensoriomotor</p>
        <p>as capacitam a realizar formidáveis</p>
        <p>acrobacias pelas cordas feitas de</p>
        <p><span style="color:red;">LedeO</span>. Seus dois pares de olhos</p>
        <p>as auxiliam a fitar desde os</p>
        <p>pântanos até os céus.</p>
      </div>
    `,
    'LOREM_14': `
      <div class="lorem-page">
        <p>em suas gargantas, há um grande</p>
        <p>papo ou saco<span style="color:red;">()</span> <span style="color:red;">gular()</span>, preto com</p>
        <p>detalhes vermelhos capaz de gerar</p>
        <p>sons que podem ser ouvidos a</p>
        <p>quilômetros de distância.</p>
      </div>
    `,
    'LOREM_15': `
      <div class="lorem-page">
        <p>Se comunicam tanto oralmente</p>
        <p>quanto por escrito, sendo</p>
        <p>esta última composta por</p>
        <p>uma simbologia discreta:</p>
        <p>o Spiraqel.</p>
      </div>
    `,
    'LOREM_16': `
      <div class="lorem-page">
        <p>Já sua fala, o Vylao,</p>
        <p>é mais complexa e ecoante.</p>
        <p>Os sons são produzidos</p>
        <p>pelo papo e possui várias</p>
        <p>nuances sonoras e níveis</p>
        <p>de intensidade.</p>
        <div style="height: 32px;"></div>
        <p>Lembra-me som de baleias.</p>
      </div>
    `,
    'LOREM_17': `
      <div class="lorem-page">
        <p>Na etapa final da reprodução</p>
        <p>as Yerô-Bens estouram o LedO</p>
        <p>e levam os Lu-L (ovo)</p>
        <p>contendo três ovos fecundados</p>
        <p>para o alto, próximo às</p>
        <p>copas das Vorei-ya-Baron.</p>
      </div>
    `,
    'LOREM_18': `
      <div class="lorem-page">
        <p>A mãe faz um corte</p>
        <p>no tronco mole e</p>
        <p>inserem a seda LedeO.</p>
        <p>Em poucos minutos, o tecido</p>
        <p>da tipo-árvore se funde</p>
        <p>com a seda e impressionante</p>
        <p>processo se inicia:</p>
      </div>
    `,
    'LOREM_19': `
      <div class="lorem-page">
        <p>A seiva nutritiva passa</p>
        <p>a fluir pelas cordas</p>
        <p>da seda interna e</p>
        <p>lentamente até chegar nos</p>
        <p>Lu-L!</p>
      </div>
    `,
    'LOREM_20': `
      <div class="lorem-page">
        <p>A gestação, portanto, acontece</p>
        <p>nas Vorei-ya-Baron, a boca</p>
        <p>do céu que alimenta</p>
        <p>e dá à luz,</p>
        <p>uma Yerô-Ben.</p>
      </div>
    `,
    'LOREM_21': `
      <div class="lorem-page">
        <p>As mães permanecem sempre alertas</p>
        <p>e vigilantes, pois seus ovos</p>
        <p>são alvo constante dos Bure-O,</p>
        <p>enormes predadores que rondam</p>
        <p>as copas voando.</p>
      </div>
    `,
  };

  slides.forEach(src => {
    const slideEl = document.createElement('div');
    slideEl.className = 'swiper-slide';
    
    if (src === 'GLOBO') {
      // canvas para o globo
      slideEl.innerHTML = `<canvas id="globeCanvas" style="width:100%;height:100%"></canvas>`;
    } else if (loremTexts[src]) {
      // Corrigido: agora aceita qualquer LOREM_X
      slideEl.innerHTML = loremTexts[src];
    } else {
      // imagens normais
      slideEl.innerHTML = `<img src="${src}" style="max-width:100%;max-height:100%" draggable="false">`;
    }
    wrap.appendChild(slideEl);
  });
};

// Three.js globe init (completamente sem sombras e reflexos)
window.initGlobe = function(selector) {
  const canvas = document.querySelector(selector);
  if (!canvas) return;

  // Ajusta o tamanho do canvas para a resolução real da tela (HiDPI)
  function resizeRendererToDisplaySize(renderer, camera) {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const pixelRatio = window.devicePixelRatio || 1;
    const displayWidth = Math.floor(width * pixelRatio);
    const displayHeight = Math.floor(height * pixelRatio);

    if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
      renderer.setSize(width, height, false);
      renderer.setPixelRatio(pixelRatio);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }
  }

  // Cena com fundo branco
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#FFFFFF');

  const camera = new THREE.PerspectiveCamera(
    60,
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    1000
  );
  camera.position.z = 4;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    preserveDrawingBuffer: false
  });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
  renderer.setPixelRatio(window.devicePixelRatio || 1);

  // IMPORTANTE: Desabilitar completamente o sistema de sombras
  renderer.shadowMap.enabled = false;

  const controls = new THREE.OrbitControls(camera, canvas);
  controls.enableDamping = true;

  const loader = new THREE.TextureLoader();

  // Globo com material básico (sem reflexos nem sombras)
  const earth = new THREE.Mesh(
    new THREE.SphereGeometry(1, 64, 64), // Aumenta a resolução da esfera
    new THREE.MeshBasicMaterial({
      map: loader.load('mundos/ttok/mapatoktok.png'),
      transparent: false,
      opacity: 1,
    })
  );

  scene.add(earth);

  // Iluminação mínima (apenas para caso seja necessária)
  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambientLight);

  // Animação
  (function animate() {
    requestAnimationFrame(animate);
    earth.rotation.y += 0.002;
    controls.update();
    resizeRendererToDisplaySize(renderer, camera); // Garante alta resolução sempre
    renderer.render(scene, camera);
  })();

  // Redimensionamento responsivo
  window.addEventListener('resize', () => {
    resizeRendererToDisplaySize(renderer, camera);
  });
};
