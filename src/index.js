import * as THREE from 'three';
import './styles/main.css';
import App from './App';

const app = new App();

// Example: Adding new atoms at different positions
setTimeout(() => {
  app.addAtom(new THREE.Vector3(10, 0, 0), 1, 1); // Example: Adding another atom at position (10, 0, 0)
}, 1500);

// setTimeout(() => {
//   app.addAtom(new THREE.Vector3(-10, 0, 0), 8, 8); // Example: Adding another atom at position (-10, 0, 0)
// }, 4000);
