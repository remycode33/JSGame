/* let traject = ({ positionHead }) => {
  let traject = [];
  traject.push(positionHead);
  return traject;
};
 */
import { getHeadPos } from "./index.js";
import { traject } from "./index.js";

export class Traject {
  historic = [];

  async updateHistoric(head) {
    let headPos = await head.then((pos) => pos);
    // console.warn("pos de head après promise:", headPos);

    this.historic.push({ x: headPos[0][0], y: headPos[1][0] });
    // console.warn("new historic :", this.historic);
    return this.historic;
  }

  getLastPos() {
    // console.log("THIS.TRAJECT :", this.historic.at(-1));
    return this.historic.at(-1);
  }
}

export class Point {
  size = "40px";
  position = traject.getLastPos();

  constructor({ x, y }, color, { historic }) {
    this.x = x + 5;
    this.y = y + 5;
    this.color = color;
    // this.position = position;
    this.id = historic.length + 1;
  }
  static insertPoint(thepoint) {
    let pointNode = document.createElement("div");
    pointNode.classList.add("point");

    Object.assign(pointNode.style, {
      position: "absolute",
      borderRadius: "6px",
      width: thepoint.size,
      height: thepoint.size,
      backgroundColor: thepoint.color,
      top: `${thepoint.y}px`,
      left: `${thepoint.x}px`,
      zIndex: "8",
    });

    // console.log(pointNode);

    document.body.appendChild(pointNode);
    // console.info("point designé");
  }

  static setOpacity(indice) {
    let ratio = indice / (document.querySelectorAll(".point").length + 1);
    // console.log("ration :", ratio);
    let opacity = (2 * ratio) / 3;
    // console.log(" opacity :", opacity);
    let color = `rgba(177,49,139,${opacity})`;
    // console.warn("color :", color);
    // point.color = color;
    return color;
  }
}
