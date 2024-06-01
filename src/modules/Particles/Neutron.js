import Particle from './Particle';

class Neutron extends Particle {
  constructor(position) {
    super(0.4, 0x00ff00, position);
  }
}

export default Neutron;
