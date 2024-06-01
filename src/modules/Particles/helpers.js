import * as THREE from 'three';

export function createTextSprite(message, parameters = {}) {
  const fontface = parameters.fontface || 'Arial';
  const fontsize = parameters.fontsize || 18;
  const borderThickness = parameters.borderThickness || 4;
  const borderColor = parameters.borderColor || { r: 0, g: 0, b: 0, a: 1.0 };
  const backgroundColor = parameters.backgroundColor || { r: 255, g: 255, b: 255, a: 1.0 };

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  context.font = `${fontsize}px ${fontface}`;

  const metrics = context.measureText(message);
  const textWidth = metrics.width;

  context.fillStyle = `rgba(${backgroundColor.r},${backgroundColor.g},${backgroundColor.b},${backgroundColor.a})`;
  context.strokeStyle = `rgba(${borderColor.r},${borderColor.g},${borderColor.b},${borderColor.a})`;

  context.lineWidth = borderThickness;
  context.fillStyle = 'rgba(255, 255, 255, 1.0)';
  context.strokeRect(0, 0, textWidth + borderThickness, fontsize * 1.4 + borderThickness);
  context.fillStyle = 'rgba(0, 0, 0, 1.0)';
  context.fillText(message, borderThickness, fontsize + borderThickness);

  const texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;

  const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
  const sprite = new THREE.Sprite(spriteMaterial);
  sprite.scale.set(0.5 * fontsize, 0.25 * fontsize, 1.0);
  return sprite;
}
