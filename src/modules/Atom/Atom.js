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
    this.radius = 0; // Initialize the radius
    this.hasReacted = false; // Track if the atom has already reacted

    this.targetPosition = position.clone(); // Target position for movement

    this.createNucleus();
    this.createElectrons();
    this.createShell(); // Create the transparent shell

    scene.add(this.group); // Add the entire group to the scene
    this.calculateRadius(); // Calculate the radius based on the outermost orbit
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

  createShell() {
    this.calculateRadius();
    const geometry = new THREE.SphereGeometry(this.radius/2, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0xffff00, transparent: true, opacity: 0.3 });
    const shell = new THREE.Mesh(geometry, material);
    this.group.add(shell);
  }

  calculateRadius() {
    if (this.orbits.length > 0) {
      this.radius = this.orbits[this.orbits.length - 1].radius;
    }
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

  moveToTarget() {
    const direction = this.targetPosition.clone().sub(this.group.position).normalize();
    const speed = 0.05; // Adjust speed as necessary
    const step = direction.multiplyScalar(speed);
    this.group.position.add(step);

    // If close to target, stop movement
    if (this.group.position.distanceTo(this.targetPosition) < 0.1) {
      this.group.position.copy(this.targetPosition);
    }
  }

  animate(time) {
    this.animateElectrons(time);
    this.moveToTarget();
  }

  setTargetPosition(position) {
    this.targetPosition.copy(position);
  }
}

export default Atom;
