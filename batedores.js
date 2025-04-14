// batedores.js

// 1) globo (mantém como antes)
window.initGlobe = selector => {
  // ... seu código de initGlobe aqui (sem alterações) ...
};

// 2) flipbook
window.initFlipbook = () => {
  // 2.1 Remove conteúdo antigo e insere o flipbook
  $('body').append(`
    <div id="flipbookContainer" style="position:absolute; top:50%; left:0; width:100vw; height:50vh; overflow:hidden; z-index:200;">
      <div id="flipbook"></div>
    </div>
    <div id="overlayContainer">
      <img id="overlayImage" src="" draggable="false">
      <button id="btnSair">Voltar</button>
    </div>
  `);

  // 2.2 Prepara o conteúdo do flipbook
  $('#flipbook').html(`
    <div class="page hard">
      <img src="imagens/cap1/capa.webp" draggable="false">
      <img id="setaBtn" src="imagens/seta.webp" draggable="false">
    </div>
    <div class="page"><img src="imagens/cap1/capa2.webp" draggable="false"></div>
    <!-- repita todas as páginas até a 32 -->
    <div class="page"><img src="imagens/cap1/pagina32.webp" draggable="false"></div>
  `);

  // 2.3 Estilos básicos para o flipbookContainer
  $('#flipbookContainer').css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  });

  // 2.4 Carrega áudio
  const flipAudio = new Audio('sompagina.mp3');
  flipAudio.preload = 'auto';
  flipAudio.volume = 0.9;

  // 2.5 Inicializa Turn.js
  $('#flipbook').turn({
    autoCenter: false,
    display: 'double'
  });

  // 2.6 Responsivo
  function resizeFB(){
    const w = $('#flipbookContainer').width();
    const h = $('#flipbookContainer').height();
    $('#flipbook').turn('size', w, h);
  }
  $(window).on('resize', resizeFB);
  resizeFB();

  // 2.7 Som ao virar
  $('#flipbook').on('mousedown touchstart', ()=>{
    flipAudio.currentTime = 0;
    flipAudio.play().catch(()=>{});
  });

  // 2.8 Seta da capa
  $('#flipbook').bind('turning', (e, p)=>{
    if(p>1) $('#setaBtn').fadeOut(300);
  });
  $('body').on('click', '#setaBtn', ()=> $('#flipbook').turn('next'));

  // 2.9 Overlay de imagens
  const mapping = {
    '#cliquemundo':'imagens/cap1/cliquemundo.webp',
    '#cliqueinversao':'imagens/cap1/inversao.webp',
    '#cliqueg':'imagens/cap1/estrelag.webp',
    '#cliquerefracao':'imagens/cap1/refracao.webp',
    '#cliquemorse':'imagens/cap1/morse.webp',
    '#cliquecapacitor':'imagens/cap1/capacitor.webp',
    '#cliquesanguedomundo':'imagens/cap1/sanguedomundo.png'
  };
  // adiciona listeners
  Object.entries(mapping).forEach(([btn,src])=>{
    $('body').on('click', btn, e=>{
      e.stopPropagation();
      $('#overlayImage').attr('src', src);
      $('#overlayContainer').fadeIn(500);
    });
  });
  $('body').on('click', '#btnSair', e=>{
    e.preventDefault();
    $('#overlayContainer').fadeOut(300);
  });
};
