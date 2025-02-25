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
  const texture = textureLoader.load('mapabotychera.png', checkLoaded); // seu arquivo
  const material = new THREE.MeshStandardMaterial({ map: texture });

  // (3) Mesh do globo principal
  const sphere = new THREE.Mesh(geometry, material);
  sphere.castShadow = true;  
  sphere.receiveShadow = true; 
  scene.add(sphere);

  // Adicionando a camada de nuvem
  const cloudGeometry = new THREE.SphereGeometry(1.01, 64, 64); 
  const cloudTexture = textureLoader.load('mapabotychera.png', checkLoaded); 
  const cloudMaterial = new THREE.MeshPhongMaterial({
    map: cloudTexture,
    transparent: true,  
    opacity: 1,        
    depthWrite: false  
  });
  const cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
  scene.add(cloudMesh);

  // Inclinação para melhorar a visualização do anel
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
  // Substituindo o anel de partículas por um anel único semitransparente branco
  // =========================================
  const ringInner = 1.8; // Raio interno do anel
  const ringOuter = 1.9; // Raio externo do anel
  const ringGeometry = new THREE.RingGeometry(ringInner, ringOuter, 64);
  const ringMaterial = new THREE.MeshStandardMaterial({
    color: 0xFFFFFF, // Branco
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.5
  });
  const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
  // A geometria do anel é criada no plano XY; para alinhá-lo com o equador do globo,
  // rotacionamos -90° em X.
  ringMesh.rotation.x = -Math.PI / 2;
  // Adiciona o anel como filho do globo para herdar sua inclinação
  sphere.add(ringMesh);

  // =========================================
  // Criando 1 globo orbitante (pivot)
  // =========================================
  const pivot1 = new THREE.Object3D();
  scene.add(pivot1);

  const miniGeo = new THREE.SphereGeometry(0.1, 32, 32);
  const miniMat1 = new THREE.MeshStandardMaterial({ color: 0x654321 });
  const miniSphere1 = new THREE.Mesh(miniGeo, miniMat1);
  miniSphere1.position.x = 4;
  pivot1.add(miniSphere1);

  // =========================================
  // Função de animação unificada
  // =========================================
  function animate() {
    requestAnimationFrame(animate);

    // Rotação contínua do globo principal e das nuvens
    sphere.rotation.y += 0.003;
    cloudMesh.rotation.y += 0.0039;

    // Rotaciona o pivot (globo orbitante) com velocidade desacelerada
    pivot1.rotation.y += 0.01;

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
};oad = () => {
  initGlo
