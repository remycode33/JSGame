/* let traject = ({ positionHead }) => {
  let traject = [];
  traject.push(positionHead);
  return traject;
};
 */
export class Traject {
  historic = [];

  updateHistoric({ x, y }) {
    this.historic.length >= 50
      ? this.historic.pop()
      : this.historic.push({ x: x, y: y });
  }
}

export class Point {
  size = "40px";
  constructor([x, y], color, historic) {
    this.x = [x];
    this.y = [y];
    this.color = color;
    this.position = position;
    this.id = historic.length + 1;
  }
  static insertPoint(point) {
    let pointNode = document.createElement("div");
    let setStylePoint = ((point) => {
      Object.assign(point.style, {
        width: `${point.size}`,
        height: `${point.size}`,
        backgroundColor: `${point.color}`,
      });
      document.body.appendChild(pointNode);
    })(point);
  }

  static setOpacity(point, historic) {
    let ratio = position / historic.length;
    let opacity = (2 * ratio) / 3;
    let color = `rgba(200,200,200,${opacity})`;

    point.color = color;
  }
}
