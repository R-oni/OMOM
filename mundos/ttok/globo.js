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

  // Controles de órbita com damping para suavizar o movimento
  // Tornando-o global para ser acessível de outros scripts/botões
  window.controls = new THREE.OrbitControls(camera, renderer.domElement);
  window.controls.enableDamping = true;
  window.controls.dampingFactor = 0.05;
  const controls = window.controls;

  // Raycaster para detectar cliques
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  // Carregador de texturas
  const textureLoader = new THREE.TextureLoader();

  // ----- Globo Central -----
  const centralGeometry = new THREE.SphereGeometry(1, 64, 64);
  const centralTexture = textureLoader.load('mapatoktok.png'); // textura do globo central
  const centralMaterial = new THREE.MeshStandardMaterial({ map: centralTexture });
  const centralSphere = new THREE.Mesh(centralGeometry, centralMaterial);
  centralSphere.castShadow = true;
  centralSphere.receiveShadow = true;
  scene.add(centralSphere);
  // Expondo o globo central globalmente
  window.centralSphere = centralSphere;

  // ----- Globo Orbitante (menor) -----
  const orbitRadius = 3;              // distância do centro
  const orbitSphereRadius = 1 / 10;     // 3x menor que o central
  const orbitGeometry = new THREE.SphereGeometry(orbitSphereRadius, 64, 64);
  const orbitTexture = textureLoader.load('mapattok.png'); // textura do globo orbitante
  const orbitMaterial = new THREE.MeshStandardMaterial({ map: orbitTexture });
  const orbitSphere = new THREE.Mesh(orbitGeometry, orbitMaterial);
  orbitSphere.castShadow = true;
  orbitSphere.receiveShadow = true;
  // Posição inicial: no eixo X, a orbitRadius de distância
  orbitSphere.position.set(orbitRadius, 0, 0);
  scene.add(orbitSphere);
  // Expondo o globo orbitante globalmente
  window.orbitSphere = orbitSphere;

  // ----- Iluminação -----
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(3, 3, 5);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  // ----- Variáveis para animação -----
  let orbitAngle = 0;
  const orbitSpeed = -0.5; // velocidade angular (radianos por segundo)
  const clock = new THREE.Clock();

  // Função de animação
  function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();

    // Rotação lenta do globo central (opcional)
    centralSphere.rotation.y += 0.003;

    // Atualiza a posição do globo orbitante (movimento circular no plano XZ)
    orbitAngle += orbitSpeed * delta;
    orbitSphere.position.x = centralSphere.position.x + orbitRadius * Math.cos(orbitAngle);
    orbitSphere.position.z = centralSphere.position.z + orbitRadius * Math.sin(orbitAngle);

    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  // Função para ajustar o tamanho do renderer e da câmera
  function resizeRenderer() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resizeRenderer);

  // ----- Clique para definir qual objeto permanece visível -----
  window.addEventListener('click', (event) => {
    // Converte a posição do clique para coordenadas normalizadas (-1 a 1)
    const rect = canvas.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    // Verifica se o clique atingiu algum dos globos
    const intersects = raycaster.intersectObjects([centralSphere, orbitSphere]);
    if (intersects.length > 0) {
      const clickedObject = intersects[0].object;
      if (clickedObject === centralSphere) {
        // Se clicar no globo central, ele permanece visível e oculta o orbitante
        centralSphere.visible = true;
        orbitSphere.visible = false;
        controls.target.copy(centralSphere.position);
      } else if (clickedObject === orbitSphere) {
        // Se clicar no orbitante, ele permanece visível e oculta o central
        orbitSphere.visible = true;
        centralSphere.visible = false;
        controls.target.copy(orbitSphere.position);
      }
    }
  });
}

// Inicia os globos quando a página carrega
window.onload = () => {
  initGlobe();
};
