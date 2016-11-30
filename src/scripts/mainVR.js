import AbstractVRApplication from 'scripts/views/AbstractVRApplication'

class Main extends AbstractVRApplication {
  constructor(){

    super();

    var texture = new THREE.TextureLoader().load( 'textures/crate.gif' );

    var geometry = new THREE.BoxGeometry( 200, 200, 200 );
    var material = new THREE.MeshBasicMaterial( { map: texture } );

    this._mesh = new THREE.Mesh( geometry, material );
    this._mesh.position.set(0,0,-300);

    this._scene.add( this._mesh );

    this.animate();

  }

}
export default Main;
