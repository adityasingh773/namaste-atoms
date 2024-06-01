import * as THREE from 'three'
import Particle from './Particle'
import Orbit from './Orbit'

export default class Atom {
  constructor(scene, atomicNumber, neutronNumber) {
    this.scene = scene
    this.atomicNumber = atomicNumber
    this.neutronNumber = neutronNumber
    this.protons = []
    this.neutrons = []
    this.electrons = []
    this.orbits = []

    this.createNucleus()
    this.createElectrons()
  }

  createNucleus() {
    for (let i = 0; i < this.atomicNumber; i++) {
      const proton = new Particle(
        0.5,
        0xff0000,
        this.randomPositionInSphere(0.5),
      )
      proton.addToScene(this.scene)
      this.protons.push(proton)
    }

    for (let i = 0; i < this.neutronNumber; i++) {
      const neutron = new Particle(
        0.5,
        0x00ff00,
        this.randomPositionInSphere(0.5),
      )
      neutron.addToScene(this.scene)
      this.neutrons.push(neutron)
    }
  }

  createElectrons() {
    const electronsInOrbits = this.calculateElectronDistribution(
      this.atomicNumber,
    )

    electronsInOrbits.forEach((count, orbitIndex) => {
      const orbitRadius = 2 + orbitIndex * 2
      const orbit = new Orbit(orbitRadius)
      orbit.addToScene(this.scene)
      this.orbits.push(orbit)

      for (let i = 0; i < count; i++) {
        const angle = (i / count) * 2 * Math.PI
        const electron = new Particle(
          0.2,
          0x0000ff,
          new THREE.Vector3(
            Math.cos(angle) * orbitRadius,
            0,
            Math.sin(angle) * orbitRadius,
          ),
        )
        electron.addToScene(this.scene)
        this.electrons.push({ particle: electron, orbitRadius, angle })
      }
    })
  }

  calculateElectronDistribution(atomicNumber) {
    const distribution = []
    let remainingElectrons = atomicNumber
    let orbitIndex = 0

    while (remainingElectrons > 0) {
      const maxElectronsInOrbit = 2 * Math.pow(orbitIndex + 1, 2)
      const electronsInThisOrbit = Math.min(
        remainingElectrons,
        maxElectronsInOrbit,
      )
      distribution.push(electronsInThisOrbit)
      remainingElectrons -= electronsInThisOrbit
      orbitIndex++
    }

    return distribution
  }

  randomPositionInSphere(radius) {
    const phi = Math.acos(2 * Math.random() - 1)
    const theta = 2 * Math.PI * Math.random()
    const x = radius * Math.sin(phi) * Math.cos(theta)
    const y = radius * Math.sin(phi) * Math.sin(theta)
    const z = radius * Math.cos(phi)
    return new THREE.Vector3(x, y, z)
  }

  animateElectrons(time) {
    this.electrons.forEach((electron) => {
      electron.particle.mesh.position.set(
        Math.cos(time + electron.angle) * electron.orbitRadius,
        0,
        Math.sin(time + electron.angle) * electron.orbitRadius,
      )
    })
  }
}
