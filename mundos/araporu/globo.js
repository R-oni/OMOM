function initGlobe() {
  // Cena
  const scene = new THREE.Scene();

  // Câmera
  const camera = new THREE.PerspectiveCamera(
    60,
    1, // Aspect ratio ajustado depois no resize
    0.1,
    1000
  );
  camera.position.z = 4; // Zoom inicial

  // Renderizador
  const canvas = document.getElementById('globeCanvas');
  // Oculta o canvas até o carregamento completo
  canvas.style.visibility = "hidden";
  const renderer = new THREE.WebGLRenderer({ 
    canvas, 
    antialias: true 
  });
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  resizeRenderer();

  // Controles de órbita
  const controls = new THREE.OrbitControls(camera, renderer.domElement);

  // (1) Geometria do globo principal
  const geometry = new THREE.SphereGeometry(1, 64, 64);

  // (2) Carregar textura do planeta
  const textureLoader = new THREE.TextureLoader();
  let texturesLoaded = 0;
  function checkLoaded() {
    texturesLoaded++;
    if (texturesLoaded === 2) {
      // Quando ambas as texturas estiverem carregadas:
      canvas.style.visibility = "visible"; // Mostra o globo
      document.dispatchEvent(new Event("globoCarregado"));
    }
  }
  const texture = textureLoader.load('mapaaraporu.png', checkLoaded); // seu arquivo
  const material = new THREE.MeshStandardMaterial({ map: texture });

  // (3) Mesh do globo principal
  const sphere = new THREE.Mesh(geometry, material);
  sphere.castShadow = true;  
  sphere.receiveShadow = true; 
  scene.add(sphere);

  // Adicionando a camada de nuvem
  const cloudGeometry = new THREE.SphereGeometry(1.01, 64, 64); 
  const cloudTexture = textureLoader.load('nuvemaraporu.png', checkLoaded); 
  const cloudMaterial = new THREE.MeshPhongMaterial({
    map: cloudTexture,
    transparent: true,  
    opacity: 1,        
    depthWrite: false  
  });
  const cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
  scene.add(cloudMesh);

  // Inclina o globo para melhorar a visualização
  sphere.rotation.x = Math.PI / 8; // ~22.5° de inclinação
  cloudMesh.rotation.x = Math.PI / 8; // Acompanha a inclinação

  // (4) Luz ambiente + direcional
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(3, 3, 5);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  // =========================================
  // Criando o anel como filho do globo para que fique
  // sempre paralelo ao equador, mesmo com a inclinação.
  // =========================================
  const rInner = 1.7; // Raio interno do anel
  const rOuter = 1.9; // Raio externo do anel
  const ringGeometry = new THREE.RingGeometry(rInner, rOuter, 64);
  const ringMaterial = new THREE.MeshStandardMaterial({
    color: 0xFFFFFF, // Branco
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.5
  });
  const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
  // Por padrão, a geometria de anel é criada no plano XY (normal +Z).
  // Na geometria do globo, o equador está no plano XZ.
  // Rotaciona o anel -90° em X para alinhá-lo ao plano XZ.
  ringMesh.rotation.x = -Math.PI / 2;
  
  // Cria um grupo para o anel e o adiciona como filho do globo.
  // Assim, ele herdará a inclinação (e rotações) do globo.
  const ringGroup = new THREE.Group();
  ringGroup.add(ringMesh);
  sphere.add(ringGroup); // Agora o anel fica posicionado no centro do globo.

  // (5) Função de animação
  function animate() {
    requestAnimationFrame(animate);

    // Rotação lenta do globo principal e das nuvens
    sphere.rotation.y += 0.003;  
    cloudMesh.rotation.y += 0.0039;

    // Rotaciona o grupo do anel para criar o efeito de órbita
    ringGroup.rotation.y += 0.005;

    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  // Redimensiona conforme a janela muda
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
window.onload = () => {
  initGlobe();
};
