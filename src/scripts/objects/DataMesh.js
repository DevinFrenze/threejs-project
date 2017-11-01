const DOWN_SPEED = 35;
const UP_SPEED = 10;

export default class DataMesh {
  constructor(abstractApplication, originalGeometry, scale, color) {
    const originalVertices = originalGeometry.vertices;
    this.vertices_tmp = [];
    const newGeometry = new THREE.Geometry();

    for ( let i = 0; i < originalVertices.length; i ++ ) {
      let point = originalVertices[ i ];
      newGeometry.vertices[ i ] = point.clone();
      this.vertices_tmp[ i ] = [ point.x, point.y, point.z, 0, 0 ];
    }

    this.vertices = newGeometry.vertices;
    this.mesh = new THREE.Points( newGeometry, new THREE.PointsMaterial( { size: 8, color } ) );
    this.mesh.scale.x = this.mesh.scale.y = this.mesh.scale.z = scale;

    this.down = 0;
    this.up = 0;
    this.direction = 'none';
    this.delay = Math.floor( 200 + 200 * Math.random() );
    this.started = false;
    this.start = Math.floor( 100 + 200 * Math.random() );

    abstractApplication.subscribeToUpdate(this);
  }

  update(change) {
    const delta = 10 * change;
    const vertices = this.vertices;
    const vertices_tmp = this.vertices_tmp;
    const verticesLength = vertices.length;

    if ( this.start > 0 ) {
      this.start -= 1;
    } else if ( !this.started ) {
      this.direction = 'down';
      this.started = true;
    }

    this.moveVertices(delta);

    if ( this.down === verticesLength ) {
      if ( this.delay === 0 ) {
        this.direction = 'up';
        this.down = 0;
        this.delay = 320;
        for ( let i = 0; i < verticesLength; i ++ ) {
          vertices_tmp[ i ][ 3 ] = 0;
        }
      } else {
        this.delay -= 1;
      }
    } else if ( this.up === verticesLength ) {
      if ( this.delay === 0 ) {
        this.direction = 'down';
        this.up = 0;
        this.delay = 120;
        for ( let i = 0; i < verticesLength; i ++ ) {
          vertices_tmp[ i ][ 4 ] = 0;
        }
      } else {
        this.delay -= 1;
      }
    }

    this.mesh.geometry.verticesNeedUpdate = true;
  }

  moveVertices(delta) {
    for ( let i = 0; i < this.vertices.length; i ++ ) {
      const point = this.vertices[ i ];
      const pointTemp = this.vertices_tmp[ i ];

      // falling down
      if ( this.direction === 'down' ) {
        if ( point.y > 0 ) {
          point.x += 1.5 * ( 0.50 - Math.random() ) * DOWN_SPEED * delta;
          point.y += 3.0 * ( 0.25 - Math.random() ) * DOWN_SPEED * delta;
          point.z += 1.5 * ( 0.50 - Math.random() ) * DOWN_SPEED * delta;
        } else {
          if ( !pointTemp[ 3 ] ) {
            pointTemp[ 3 ] = 1; // mark as down
            this.down += 1;
          }
        }
      } else if ( this.direction === 'up' ) {
        const d = Math.abs( point.x - pointTemp[ 0 ] ) + Math.abs( point.y - pointTemp[ 1 ] ) + Math.abs( point.z - pointTemp[ 2 ] );
        if ( d > 1 ) {
          point.x += - ( point.x - pointTemp[ 0 ] ) / d * UP_SPEED * delta * ( 0.85 - Math.random() );
          point.y += - ( point.y - pointTemp[ 1 ] ) / d * UP_SPEED * delta * ( 1 + Math.random() );
          point.z += - ( point.z - pointTemp[ 2 ] ) / d * UP_SPEED  * delta * ( 0.85 - Math.random() );
        } else {
          if ( !pointTemp[ 4 ] ) {
            pointTemp[ 4 ] = 1; // mark as up
            this.up += 1;
          }
        }
      }
    }
  }
}
