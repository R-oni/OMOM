// Função principal para inicializar o globo
function initGlobe() {
  // Cena
  const scene = new THREE.Scene();

  // Câmera
  const camera = new THREE.PerspectiveCamera(
    60,
    1,        // Aspect ratio ajustado depois no resize
    0.1,
    1000
  );
  camera.position.z = 3;

  // Renderizador
  const canvas = document.getElementById('globeCanvas');
  canvas.style.visibility = "hidden"; // Oculta o globo até carregar
  const renderer = new THREE.WebGLRenderer({ 
    canvas, 
    antialias: true,
    alpha: true   // Permite fundo transparente
  });
  // Define o clear color com alfa 0 para transparência
  renderer.setClearColor(0x000000, 0);

  // Permite sombras (se quiser projetar em um plano, por exemplo)
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // Ajusta o tamanho inicial do renderer
  resizeRenderer();

  // Controles de órbita
  const controls = new THREE.OrbitControls(camera, renderer.domElement);

  // (1) Geometria com resolução maior
  // Mais segmentos => textura mais suave
  const geometry = new THREE.SphereGeometry(1, 64, 64);

  // (2) Carregar textura
  let texturesLoaded = 0;
  function checkLoaded() {
    texturesLoaded++;
    if (texturesLoaded === 2) {
      // Agora que tudo carregou, mostrar o globo e remover o loading
      canvas.style.visibility = "visible";
      document.dispatchEvent(new Event("globoCarregado"));
    }
  }
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load('mapahimpis.png', checkLoaded); // seu arquivo

  // (3) Material que reage a luz (Standard ou Phong ou Lambert)
  const material = new THREE.MeshStandardMaterial({
    map: texture
  });

  // (4) Mesh do globo
  const sphere = new THREE.Mesh(geometry, material);
  sphere.castShadow = true;   // se quiser projetar sombra
  sphere.receiveShadow = true; // se quiser receber sombra (num plano, por ex)
  scene.add(sphere);

  // Adicionando a camada de nuvem
  const cloudGeometry = new THREE.SphereGeometry(1.015, 64, 64); // raio ligeiramente maior
  const cloudTexture = textureLoader.load('nuvemhimpis.png', checkLoaded); // textura com transparência
  const cloudMaterial = new THREE.MeshPhongMaterial({
    map: cloudTexture,
    transparent: true,   // permite transparência
    opacity: 1,          // ajuste de opacidade conforme desejado
    depthWrite: false    // evita problemas de renderização de transparência
  });
  const cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
  scene.add(cloudMesh);

  // (5) Luz ambiente (fraca) + luz direcional (para ver sombreamento)
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(3, 3, 5); // posição da luz
  directionalLight.castShadow = true;     // habilita sombra
  scene.add(directionalLight);

  // Função de animação
  function animate() {
    requestAnimationFrame(animate);

    // Rotação contínua do globo
    sphere.rotation.y += 0.003;  // Ajuste a velocidade se quiser

    // Rotação da camada de nuvem (velocidade diferente para efeito realista)
    cloudMesh.rotation.y += 0.0039;

    renderer.render(scene, camera);
  }
  animate();

  // Redimensionar conforme a janela muda
  window.addEventListener('resize', resizeRenderer);
  function resizeRenderer() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
}

// Inicia o globo quando a página carrega
/*window.onload = () => {
  initGlobe();*/
};
