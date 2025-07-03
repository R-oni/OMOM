// Função principal para inicializar o Globo 2
function initGlobo2() {
  // Cena
  const scene = new THREE.Scene();

  // Câmera
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
  camera.position.z = 3;

  // Renderizador
  const canvas = document.getElementById('globo2Canvas');  // Certifique-se de pegar o segundo canvas!
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true
  });
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // Ajusta o tamanho inicial do renderer
  resizeRenderer();

  // Controles de órbita
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;

  // Carregador de texturas
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load('mapattok.png');

  // Criar o globo
  const geometry = new THREE.SphereGeometry(1, 64, 64);
  const material = new THREE.MeshStandardMaterial({ map: texture });
  const sphere = new THREE.Mesh(geometry, material);
  scene.add(sphere);

  // Iluminação
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(3, 3, 5);
  scene.add(directionalLight);

  // Função de animação
  function animate() {
    requestAnimationFrame(animate);
    sphere.rotation.y += 0.003;
    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  // Ajustar redimensionamento
  function resizeRenderer() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resizeRenderer);
}

// Adiciona o evento corretamente para evitar conflitos
window.addEventListener('load', initGlobo2);