import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Atom from './modules/Atom/Atom';

class App {
  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 20;
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(this.renderer.domElement);

    this.atoms = []; // Array to hold multiple Atom instances
    this.bonds = []; // Array to hold bond lines

    this.addLights();
    this.addAtom(new THREE.Vector3(0, 0, 0), 1, 1); // Add a default atom (Hydrogen) at the origin
    this.addOrbitControls();
    this.addEventListeners();
    this.render();
  }

  addLights() {
    const ambientLight = new THREE.AmbientLight(0x404040);
    this.scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    this.scene.add(directionalLight);
  }

  addAtom(position, atomicNumber, neutronNumber) {
    const atom = new Atom(this.scene, atomicNumber, neutronNumber, position);
    this.atoms.push(atom); // Add the atom to the array
  }

  addOrbitControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
  }

  addEventListeners() {
    window.addEventListener('resize', this.onWindowResize.bind(this), false);
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  triggerReaction() {
    // Example reaction trigger: if atoms are close enough, trigger their reaction methods
    for (let i = 0; i < this.atoms.length; i++) {
      for (let j = i + 1; j < this.atoms.length; j++) {
        const distance = this.atoms[i].group.position.distanceTo(this.atoms[j].group.position);
        const combinedRadius = this.atoms[i].radius + this.atoms[j].radius;
        if (distance < combinedRadius) {
          this.createBond(this.atoms[i], this.atoms[j]);
          // Adjust positions to maintain the minimum distance
          const midPoint = this.atoms[i].group.position.clone().add(this.atoms[j].group.position).divideScalar(2);
          this.atoms[i].setTargetPosition(midPoint.clone().add(this.atoms[i].group.position.clone().sub(midPoint).normalize().multiplyScalar(combinedRadius / 2)));
          this.atoms[j].setTargetPosition(midPoint.clone().add(this.atoms[j].group.position.clone().sub(midPoint).normalize().multiplyScalar(combinedRadius / 2)));
        }
      }
    }
  }

  createBond(atom1, atom2) {
    // Check if a bond already exists
    for (let bond of this.bonds) {
      if ((bond.atom1 === atom1 && bond.atom2 === atom2) || (bond.atom1 === atom2 && bond.atom2 === atom1)) {
        return;
      }
    }

    const material = new THREE.LineBasicMaterial({ color: 0xffffff });
    const geometry = new THREE.BufferGeometry().setFromPoints([atom1.group.position, atom2.group.position]);
    const line = new THREE.Line(geometry, material);

    this.scene.add(line);
    this.bonds.push({ line, atom1, atom2 });
  }

  updateBonds() {
    for (let bond of this.bonds) {
      bond.line.geometry.setFromPoints([bond.atom1.group.position, bond.atom2.group.position]);
    }
  }

  moveAtomsTowardsEachOther() {
    if (this.atoms.length > 1) {
      for (let i = 0; i < this.atoms.length - 1; i++) {
        this.atoms[i].setTargetPosition(this.atoms[i + 1].group.position);
        this.atoms[i + 1].setTargetPosition(this.atoms[i].group.position);
      }
    }
  }

  render() {
    requestAnimationFrame(this.render.bind(this));

    const time = Date.now() * 0.001;
    this.atoms.forEach(atom => atom.animate(time)); // Animate all atoms
    this.moveAtomsTowardsEachOther(); // Move atoms
    this.triggerReaction(); // Check for reactions
    this.updateBonds(); // Update bond positions

    this.renderer.render(this.scene, this.camera);
  }
}

export default App;
