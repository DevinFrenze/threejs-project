import AbstractApplication from 'scripts/views/AbstractApplication'

class Main extends AbstractApplication {
  constructor(){

    super();

    var texture = new THREE.TextureLoader().load( 'textures/crate.gif' );

    var geometry = new THREE.BoxGeometry( 200, 200, 200 );
    var material = new THREE.MeshBasicMaterial( { map: texture } );

    this._mesh = new THREE.Mesh( geometry, material );
    this._scene.add( this._mesh );

    this.animate();

  }

}
export default Main;
