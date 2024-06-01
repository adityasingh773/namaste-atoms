import Particle from './Particle';

class Electron extends Particle {
  constructor(position) {
    super(0.2, 0x0000ff, position);
  }
}

export default Electron;
