import * as THREE from 'three';
import './styles/main.css';
import App from './App';

const app = new App();

setTimeout(() => {
  app.addAtom(new THREE.Vector3(10, 0, 0), 4, 4); 
}, 2000);

// setTimeout(() => {
//   app.addAtom(new THREE.Vector3(-10, 0, 0), 1, 0); // Example: Adding a hydrogen atom at position (-10, 0, 0)
// }, 10000);
