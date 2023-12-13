import {
  Ball,
  removeDiv,
  autoCancel,
  allInterval,
  setPoppingInterval,
  setRemovingInterval,
  createNewFood,
} from "./index.js";

export class SuperBall extends Ball {
  constructor(w, h, color, x, y, z) {
    super(w, h, color, x, y, z);
  }
}
