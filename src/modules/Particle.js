import * as THREE from 'three'

class Particle {
  constructor(radius, color, position) {
    const geometry = new THREE.SphereGeometry(radius, 32, 32)
    const material = new THREE.MeshPhongMaterial({ color })
    this.mesh = new THREE.Mesh(geometry, material)
    this.mesh.position.copy(position)
  }

  addToScene(scene) {
    scene.add(this.mesh)
  }
}

export default Particle
