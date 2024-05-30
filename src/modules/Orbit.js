import * as THREE from 'three';

export default class Orbit {
  constructor(radius, color = 0x00ff00) {
    this.radius = radius;
    this.color = color;
    this.path = this.createOrbitPath();
  }

  createOrbitPath() {
    const points = [];
    for (let i = 0; i <= 64; i++) {
      const angle = (i / 64) * 2 * Math.PI;
      points.push(
        new THREE.Vector3(
          Math.cos(angle) * this.radius,
          0,
          Math.sin(angle) * this.radius,
        ),
      );
    }
    const pathGeometry = new THREE.BufferGeometry().setFromPoints(points);
    return new THREE.Line(
      pathGeometry,
      new THREE.LineBasicMaterial({ color: this.color }),
    );
  }

  addToScene(scene) {
    scene.add(this.path);
  }
}
