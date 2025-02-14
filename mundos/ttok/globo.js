// Função principal para inicializar os globos
function initGlobe() {
  // Cena
  const scene = new THREE.Scene();

  // Câmera
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
  camera.position.z = 7;

  // Renderizador
  const canvas = document.getElementById('globeCanvas');
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true
  });
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  
  // Ajusta o tamanho inicial do renderer
  resizeRenderer();

  // Controles de órbita com damping
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;

  // Carregador de texturas
  const textureLoader = new THREE.TextureLoader();

  // ----- Globo Central (maior) -----
  const centralGeometry = new THREE.SphereGeometry(1, 64, 64);
  const centralTexture = textureLoader.load('mapatoktok.png'); // textura do globo central
  const centralMaterial = new THREE.MeshStandardMaterial({ map: centralTexture });
  const centralSphere = new THREE.Mesh(centralGeometry, centralMaterial);
  centralSphere.castShadow = true;
  centralSphere.receiveShadow = true;
  scene.add(centralSphere);

  // ----- Globo Orbitante (menor) -----
  const orbitRadius = 3;              // distância do centro
  const orbitSphereRadius = 0.1;        // 1/10 do tamanho do central
  const orbitGeometry = new THREE.SphereGeometry(orbitSphereRadius, 64, 64);
  const orbitTexture = textureLoader.load('mapattok.png'); // textura do globo orbitante
  const orbitMaterial = new THREE.MeshStandardMaterial({ map: orbitTexture });
  const orbitSphere = new THREE.Mesh(orbitGeometry, orbitMaterial);
  orbitSphere.castShadow = true;
  orbitSphere.receiveShadow = true;
  // Posição inicial no eixo X, a orbitRadius de distância
  orbitSphere.position.set(orbitRadius, 0, 0);
  scene.add(orbitSphere);

  // ----- Iluminação -----
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(3, 3, 5);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  // ----- Variáveis para animação -----
  let orbitAngle = 0;
  const orbitSpeed = -0.5; // radianos por segundo
  const clock = new THREE.Clock();

  // Função de animação
  function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();

    // Rotação lenta do globo central (opcional)
    centralSphere.rotation.y += 0.003;

    // Movimento circular do globo orbitante (plano XZ)
    orbitAngle += orbitSpeed * delta;
    orbitSphere.position.x = centralSphere.position.x + orbitRadius * Math.cos(orbitAngle);
    orbitSphere.position.z = centralSphere.position.z + orbitRadius * Math.sin(orbitAngle);

    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  // Função para ajustar o renderer e a câmera
  function resizeRenderer() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resizeRenderer);

  // Expondo variáveis globalmente para acesso externo (p. ex., no botão)
  window.camera = camera;
  window.controls = controls;
  window.orbitSphere = orbitSphere;
  window.centralSphere = centralSphere;
}
window.onload = initGlobe;
