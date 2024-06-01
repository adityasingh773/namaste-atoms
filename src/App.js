import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Atom from './modules/Atom/Atom';

class App {
  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 10;
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(this.renderer.domElement);

    this.atoms = []; // Array to hold multiple Atom instances

    this.addLights();
    this.addAtom(new THREE.Vector3(0, 0, 0), 6, 6); // Add a default atom (Carbon) at the origin
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

  render() {
    requestAnimationFrame(this.render.bind(this));

    const time = Date.now() * 0.001;
    this.atoms.forEach(atom => atom.animate(time)); // Animate all atoms

    this.renderer.render(this.scene, this.camera);
  }
}

export default App;
