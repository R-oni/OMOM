// Função principal para inicializar o globo
function initGlobe() {
  // Cena
  const scene = new THREE.Scene();

  // Câmera
  const camera = new THREE.PerspectiveCamera(
    60,
    1,        // Aspect ratio será ajustado no resize
    0.1,
    1000
  );
  camera.position.z = 3; // Zoom inicial (ajuste conforme necessário)

  // Renderizador
  const canvas = document.getElementById('globeCanvas');
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
  const texture = textureLoader.load('mapaaraporu.png'); // seu arquivo
  const material = new THREE.MeshStandardMaterial({ map: texture });

  // (3) Mesh do globo principal
  const sphere = new THREE.Mesh(geometry, material);
  sphere.castShadow = true;
  sphere.receiveShadow = true;
  scene.add(sphere);

  // Adicionando a camada de nuvem
  const cloudGeometry = new THREE.SphereGeometry(1.01, 64, 64);
  const cloudTexture = textureLoader.load('nuvemaraporu.png');
  const cloudMaterial = new THREE.MeshPhongMaterial({
    map: cloudTexture,
    transparent: true,
    opacity: 1,
    depthWrite: false
  });
  const cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
  scene.add(cloudMesh);

  // (4) Luz ambiente e direcional
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(3, 3, 5);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  // =========================================
  // Criando um anel de pequenas esferas orbitando o globo
  // =========================================

  const ringGroup = new THREE.Group();
  const numRingSpheres = 40;         // Número de esferas no anel
  const ringRadius = 1.2;            // Distância do centro do globo (ajuste para posicionar o anel)
  const ringSphereGeo = new THREE.SphereGeometry(0.05, 16, 16); // Tamanho das esferas do anel
  const ringSphereMat = new THREE.MeshStandardMaterial({ color: 0x808080 }); // Cinza médio

  for (let i = 0; i < numRingSpheres; i++) {
    const angle = (i / numRingSpheres) * Math.PI * 2;
    const ringSphere = new THREE.Mesh(ringSphereGeo, ringSphereMat);
    ringSphere.position.set(
      ringRadius * Math.cos(angle),
      0,  // O anel fica no plano XZ
      ringRadius * Math.sin(angle)
    );
    ringGroup.add(ringSphere);
  }
  scene.add(ringGroup);

  // (5) Função de animação
  function animate() {
    requestAnimationFrame(animate);

    // Rotação lenta do globo principal e das nuvens
    sphere.rotation.y += 0.003;
    cloudMesh.rotation.y += 0.0039;

    // Rotaciona o anel para criar o efeito de órbita
    ringGroup.rotation.y += 0.01;

    controls.update();
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
window.onload = () => {
  initGlobe();
};
