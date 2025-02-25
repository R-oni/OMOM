function initGlobe() {
  const canvas = document.getElementById('globeCanvas');
  if (!canvas) return;

  // Adicione esta variável para controlar o carregamento
  let texturesLoaded = 0;
  const totalTextures = 2;

  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
  camera.position.set(0, 0, 4);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(width, height);

  const controls = new THREE.OrbitControls(camera, canvas);
  controls.enableDamping = true;

  const textureLoader = new THREE.TextureLoader();

  // Função para verificar se todas as texturas carregaram
  function checkTexturesLoaded() {
    texturesLoaded++;
    if (texturesLoaded === totalTextures) {
      document.dispatchEvent(new Event('globoCarregado'));
    }
  }

  // Globo Central
  const centralGeometry = new THREE.SphereGeometry(1, 64, 64);
  const centralTexture = textureLoader.load('mapatoktok.png', checkTexturesLoaded);
  const centralMaterial = new THREE.MeshStandardMaterial({ map: centralTexture });
  const centralSphere = new THREE.Mesh(centralGeometry, centralMaterial);
  scene.add(centralSphere);

  // Globo Orbitante
  const orbitGeometry = new THREE.SphereGeometry(0.1, 64, 64);
  const orbitTexture = textureLoader.load('mapattok.png', checkTexturesLoaded);
  const orbitMaterial = new THREE.MeshStandardMaterial({ map: orbitTexture });
  const orbitSphere = new THREE.Mesh(orbitGeometry, orbitMaterial);
  orbitSphere.position.set(3, 0, 0);
  scene.add(orbitSphere);

  // Restante do código permanece igual...
  // [mantenha todo o resto da função initGlobe() original]
}

window.addEventListener('load', initGlobe);
