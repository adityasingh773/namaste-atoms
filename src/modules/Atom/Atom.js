import * as THREE from 'three';
import Proton from '../Particles/Proton';
import Neutron from '../Particles/Neutron';
import Electron from '../Particles/Electron';
import Orbit from '../Orbit';
import { calculateElectronDistribution, randomPositionInSphere } from './helpers';

class Atom {
  constructor(scene, atomicNumber, neutronNumber) {
    this.scene = scene;
    this.atomicNumber = atomicNumber;
    this.neutronNumber = neutronNumber;
    this.protons = [];
    this.neutrons = [];
    this.electrons = [];
    this.orbits = [];

    this.createNucleus();
    this.createElectrons();
  }

  createNucleus() {
    for (let i = 0; i < this.atomicNumber; i++) {
      const proton = new Proton(randomPositionInSphere(0.5));
      proton.addToScene(this.scene);
      this.protons.push(proton);
    }

    for (let i = 0; i < this.neutronNumber; i++) {
      const neutron = new Neutron(randomPositionInSphere(0.5));
      neutron.addToScene(this.scene);
      this.neutrons.push(neutron);
    }
  }

  createElectrons() {
    const electronsInOrbits = calculateElectronDistribution(this.atomicNumber);
        
    electronsInOrbits.forEach((count, orbitIndex) => {
      const orbitRadius = 2 + orbitIndex * 2; // Example radius calculation
      const orbit = new Orbit(orbitRadius);
      orbit.addToScene(this.scene);
      this.orbits.push(orbit);

      for (let i = 0; i < count; i++) {
        const angle = (i / count) * 2 * Math.PI;
        const electron = new Electron(new THREE.Vector3(Math.cos(angle) * orbitRadius, 0, Math.sin(angle) * orbitRadius));
        electron.addToScene(this.scene);
        this.electrons.push({ particle: electron, orbitRadius, angle });
      }
    });
  }

  animateElectrons(time) {
    this.electrons.forEach((electron) => {
      electron.particle.mesh.position.set(
        Math.cos(time + electron.angle) * electron.orbitRadius,
        0,
        Math.sin(time + electron.angle) * electron.orbitRadius,
      );
    });
  }
}

export default Atom;
