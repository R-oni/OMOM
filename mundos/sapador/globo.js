// Função principal para inicializar o globo
function initGlobe() {
  // Cena
  const scene = new THREE.Scene();
  scene.background = null; // Define o fundo transparente

  // Câmera (agora mais perto)
  const camera = new THREE.PerspectiveCamera(
    60,
    1,        // Aspect ratio ajustado depois no resize
    0.1,
    1000
  );
  camera.position.z = 1.8;  // Câmera mais próxima

  // Renderizador (agora com fundo transparente)
  const canvas = document.getElementById('globeCanvas');
  const renderer = new THREE.WebGLRenderer({ 
    canvas, 
    antialias: true,
    alpha: true  // Fundo transparente ativado
  });
  
  // Permite sombras (se quiser projetar em um plano, por exemplo)
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // Ajusta o tamanho inicial do renderer
  resizeRenderer();

  // Controles de órbita
  const controls = new THREE.OrbitControls(camera, renderer.domElement);

  // Geometria do globo
  const geometry = new THREE.SphereGeometry(1, 64, 64);

  // Carregar textura
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load('mapasapador.png');

  // Material do globo
  const material = new THREE.MeshStandardMaterial({
    map: texture
  });

  // Mesh do globo
  const sphere = new THREE.Mesh(geometry, material);
  sphere.castShadow = true;  
  sphere.receiveShadow = true; 
  scene.add(sphere);

  // Camada de nuvem
  const cloudGeometry = new THREE.SphereGeometry(1.01, 64, 64);
  const cloudTexture = textureLoader.load('nuvemsapador.png');
  const cloudMaterial = new THREE.MeshPhongMaterial({
    map: cloudTexture,
    transparent: true,
    opacity: 1,
    depthWrite: false
  });
  const cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
  scene.add(cloudMesh);

  // Luz ambiente + direcional
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffa07a, 1);
  directionalLight.position.set(3, 3, 5);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  // Função de animação
  function animate() {
    requestAnimationFrame(animate);

    // Rotação do globo e das nuvens
    sphere.rotation.y += 0.003;
    cloudMesh.rotation.y += 0.0039;

    renderer.render(scene, camera);
  }
  animate();

  // Ajustar tamanho conforme a janela muda
  window.addEventListener('resize', resizeRenderer);
  function resizeRenderer() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
}

// Inicia o globo ao carregar a página
window.onload = () => {
  initGlobe();
};
