function initGlobe() {
  const canvas = document.getElementById('globeCanvas');
  if (!canvas) return;
  // ... seu setup de cena, câmera, renderer, controls, texturas, luzes ...

  // Colete as esferas num array para o raycaster
  const clickableObjects = [centralSphere, orbitSphere];

  // Cria raycaster e vetor de mouse
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  // Função para animar câmera e controls.target
  function focusOn(object, zoomDistance = 2, duration = 600) {
    const fromPos = camera.position.clone();
    const toPos = object.position.clone().add(
      object === orbitSphere
        ? new THREE.Vector3(0, 0, 0.6)    // offset para a órbita
        : new THREE.Vector3(0, 0, zoomDistance) // offset para o central
    );

    const fromTarget = controls.target.clone();
    const toTarget = object.position.clone();

    const start = performance.now();
    function tween() {
      const t = Math.min((performance.now() - start) / duration, 1);
      camera.position.lerpVectors(fromPos, toPos, t);
      controls.target.lerpVectors(fromTarget, toTarget, t);
      controls.update();
      renderer.render(scene, camera);
      if (t < 1) requestAnimationFrame(tween);
    }
    tween();
  }

  // Escuta cliques no canvas
  canvas.addEventListener('mousedown', (event) => {
    // converte coords do mouse para NDC
    const rect = canvas.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const hits = raycaster.intersectObjects(clickableObjects, false);
    if (hits.length > 0) {
      const picked = hits[0].object;
      if (picked === centralSphere) {
        window.myGlobe.trackingMode = "central";
        focusOn(centralSphere, 2);
      } else if (picked === orbitSphere) {
        window.myGlobe.trackingMode = "orbit";
        focusOn(orbitSphere, 0.6);
      }
    }
  });

  // ... seu animate() e resize listener ...
}
window.addEventListener('load', initGlobe);
