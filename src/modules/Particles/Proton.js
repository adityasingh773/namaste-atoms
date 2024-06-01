import Particle from './Particle';

class Proton extends Particle {
  constructor(position) {
    super(1, 0xff0000, position);
  }
}

export default Proton;
