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
  const renderer = new THREE.WebGLRenderer({ 
    canvas, 
    antialias: true 
  });
  
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
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load('mapaveleywei.png'); // seu arquivo

  // (3) Material que reage a luz (Standard ou Phong ou Lambert)
  const material = new THREE.MeshStandardMaterial({
    map: texture
  });

  // (4) Mesh do globo
  const sphere = new THREE.Mesh(geometry, material);
  sphere.castShadow = true;   // se quiser projetar sombra
  sphere.receiveShadow = true; // se quiser receber sombra (num plano, por ex)
  scene.add(sphere);

  // (5) Luz ambiente (fraca) + luz direcional (para ver sombreamento)
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(3, 3, 5); // posição da luz
  directionalLight.castShadow = true;     // habilita sombra
  scene.add(directionalLight);

  // Se quiser ver sombra projetada num "chão", crie um plano abaixo do globo:
  /*
  const planeGeometry = new THREE.PlaneGeometry(10, 10);
  const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotation.x = -Math.PI / 2;
  plane.position.y = -1.5;
  plane.receiveShadow = true;
  scene.add(plane);
  */

  // Função de animação
  function animate() {
    requestAnimationFrame(animate);

    // Rotação contínua do globo
    sphere.rotation.y += 0.003;  // Ajuste a velocidade se quiser

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
