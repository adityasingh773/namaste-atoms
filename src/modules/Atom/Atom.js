import * as THREE from 'three';
import Proton from '../Particles/Proton';
import Neutron from '../Particles/Neutron';
import Electron from '../Particles/Electron';
import Orbit from '../Orbit';
import { calculateElectronDistribution, randomPositionInSphere } from './helpers';

class Atom {
  constructor(scene, atomicNumber, neutronNumber, position = new THREE.Vector3(0, 0, 0)) {
    this.group = new THREE.Group();
    this.group.position.copy(position);
    this.atomicNumber = atomicNumber;
    this.neutronNumber = neutronNumber;
    this.protons = [];
    this.neutrons = [];
    this.electrons = [];
    this.orbits = [];

    this.createNucleus();
    this.createElectrons();

    scene.add(this.group); // Add the entire group to the scene
  }

  createNucleus() {
    for (let i = 0; i < this.atomicNumber; i++) {
      const proton = new Proton(randomPositionInSphere(0.5));
      this.group.add(proton.mesh);
      this.protons.push(proton);
    }

    for (let i = 0; i < this.neutronNumber; i++) {
      const neutron = new Neutron(randomPositionInSphere(0.5));
      this.group.add(neutron.mesh);
      this.neutrons.push(neutron);
    }
  }

  createElectrons() {
    const electronsInOrbits = calculateElectronDistribution(this.atomicNumber);
        
    electronsInOrbits.forEach((count, orbitIndex) => {
      const orbitRadius = 2 + orbitIndex * 2; // Example radius calculation
      const orbit = new Orbit(orbitRadius);
      this.group.add(orbit.path);
      this.orbits.push(orbit);

      for (let i = 0; i < count; i++) {
        const angle = (i / count) * 2 * Math.PI;
        const electron = new Electron(new THREE.Vector3(Math.cos(angle) * orbitRadius, 0, Math.sin(angle) * orbitRadius));
        this.group.add(electron.mesh);
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

  animate(time) {
    this.animateElectrons(time);
  }
}

export default Atom;
