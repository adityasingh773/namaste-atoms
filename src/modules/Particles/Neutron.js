import Particle from './Particle';

class Neutron extends Particle {
  constructor(position) {
    super(1, 0x00ff00, position);
  }
}

export default Neutron;
