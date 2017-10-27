// so we can see the framerate
function initStats(abstractApplication) {
  const stats = new Stats();
  document.body.appendChild( stats.dom );
  abstractApplication.subscribeToUpdate(stats);
}

// so chrome can use Three.js Inspector
function initInspector(abstractApplication) {
  window.scene = abstractApplication.scene;
  window.THREE = THREE;
}

export default {
  initStats,
  initInspector
};
