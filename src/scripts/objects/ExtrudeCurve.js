export default class ExtrudeCurve {
  constructor() {
    this.mesh = this.makeRandomSpline();
  }

  makeRandomSpline() {
    var randomPoints = [];
    for ( var i = 0; i < 6; i ++ ) {
      randomPoints.push( new THREE.Vector3(
        ( i - 4.5 ) * THREE.Math.randFloat( i * 5, 50 ),
        THREE.Math.randFloat( - 100, 100 ),
        THREE.Math.randFloat( - 50, 50 )
      ));
    }

    var randomSpline =  new THREE.CatmullRomCurve3( randomPoints );

    var geometry = new THREE.Geometry();
    geometry.vertices = randomSpline.getPoints( 50 );

    var material = new THREE.LineBasicMaterial( { color : 0xffddff } );
    return new THREE.Line( geometry, material );


    // var shape = new THREE.Shape( randomSpline.getPoints(17) );
    // var geometry = new THREE.ShapeGeometry( shape, 17 );
    // var material2 = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: false });
    // return new THREE.Mesh( geometry, material2 );
  }
}
