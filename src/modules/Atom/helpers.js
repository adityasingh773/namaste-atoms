import * as THREE from 'three';

export function calculateElectronDistribution(atomicNumber) {
  const distribution = [];
  let remainingElectrons = atomicNumber;
  let orbitIndex = 0;

  while (remainingElectrons > 0) {
    const maxElectronsInOrbit = 2 * Math.pow(orbitIndex + 1, 2);
    const electronsInThisOrbit = Math.min(remainingElectrons, maxElectronsInOrbit);
    distribution.push(electronsInThisOrbit);
    remainingElectrons -= electronsInThisOrbit;
    orbitIndex++;
  }

  return distribution;
}

export function randomPositionInSphere(radius) {
  const phi = Math.acos(2 * Math.random() - 1);
  const theta = 2 * Math.PI * Math.random();
  const x = radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.sin(phi) * Math.sin(theta);
  const z = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}
