import { Traject } from "./ghostTraject.js";
import { Point } from "./ghostTraject.js";
import { SuperBall } from "./superBall.js";

//Variables :
let scoreMax = 15;
let speed = 10; // in pixel
let refresh = 20; //in sec
let popTime = 1800;
let removeTime = 5000;
let rayon = 350;
let maxSize = 100;
let foodMax = 20;
let headSize = "50px";

let width = window.innerWidth;
let height = window.innerHeight;

//#######################
//implementation timer :

let timeStart = new Date();
let endTime;
let totalSec = timeStart - endTime;

//##############
// set history :

export let traject = new Traject();

//créer un point à chaque switch
// insérer le point
// set Opacity à chaque nouveau point donc a chaque deplacement

//class to create Head and food :

export function Ball(
  w = headSize,
  h = headSize,
  color = "purple",
  x = window.innerWidth / 2,
  y = window.innerHeight / 2,
  z = 10
) {
  let context = this;
  let node;

  this.position = [y, x];

  this.shape = {
    width: w,
    height: h,
    borderRadius: "50%",
    background: color,
    position: "absolute",
    top: `${y}px`,
    left: `${x}px`,
    zIndex: `${z}`,
    boxShadow: `${
      w !== "50px"
        ? "1px 5px 3px -1px rgba(70,70,70,0.6)"
        : "1px 6px 3px -1px rgba(70,70,70,0.6)"
    }`,
  };

  this.createNode = function (objectName, distance = rayon) {
    node = document.createElement("div");
    node.classList.add(`node-${objectName}`);

    Object.assign(node.style, this.shape);

    for (let i = 1; i <= 5; i++) {
      node.style.setProperty(
        `--randomPos${i}`,
        `${Math.floor(Math.random() * distance)}px`
      );
    }

    document.querySelector("body").appendChild(node);
  };
  //FIXER LE PROBLEME DE CONDITION POUR RESET POS
  this.setPosition = function (x = 0, y = 0) {
    console.log("POSITION :", this.position);

    if (this.position[0] > height) {
      this.position[0] = 0;
      node.style.top = `${this.position[0]}px`;
    }

    if (this.position[1] > width) {
      this.position[1] = 0;
      node.style.left = `${this.position[1]}px`;
    }
    if (this.position[0] < 0) {
      this.position[0] = height;
      node.style.top = `${this.position[0]}px`;
    }

    if (this.position[1] < 0) {
      this.position[1] = width;
      node.style.left = `${this.position[1]}px`;
    }

    this.position[0] = this.position[0] + y;
    node.style.top = `${this.position[0]}px`;

    this.position[1] = this.position[1] + x;
    node.style.left = `${this.position[1]}px`;
  };

  this.reachPosition = function () {
    let stgTop = node.style.top;
    stgTop = stgTop.split("px");

    let stgLeft = node.style.left;
    stgLeft = stgLeft.split("px");
    let position = [parseInt(stgTop), parseInt(stgLeft)];

    this.position = position;
    return position;
  };

  this.moove = function (event) {
    let position = this.reachPosition();

    try {
      let point;
      //parameters to place in my switch to controle ball and his fantom traject
      let dontRepeat = () => {
        traject.updateHistoric(getHeadPos());

        document.body
          .querySelectorAll(".point")
          .forEach(
            (ele, indice) =>
              (ele.style.backgroundColor = Point.setOpacity(indice))
          );

        point = new Point(
          traject.getLastPos(),
          Point.setOpacity(traject.historic.length),
          traject
        );

        Point.insertPoint(point);
        // console.info(point);
        if (traject.historic.length >= maxSize) {
          removeDiv(".point");
        }
      };

      switch (event.key) {
        case "ArrowUp":
          this.setPosition(0, -speed);
          eat();
          dontRepeat();
          break;

        case "ArrowDown":
          this.setPosition(0, speed);
          eat();
          dontRepeat();
          break;

        case "ArrowLeft":
          this.setPosition(-speed, 0);
          eat();
          dontRepeat();
          break;

        case "ArrowRight":
          this.setPosition(speed, 0);
          eat();
          dontRepeat();
          break;
      }
    } catch (e) {
      console.error(e);
      console.info("début de partie, appuyez sur une touche directionnelle");
    }
  };
}

//ACTIONS       ##########################

let head = new Ball(
  undefined,
  undefined,
  "radial-gradient(farthest-corner at 0% 0%, rgba(250,80,200,1) 0%, rgba(112,31,88,1) 100%)",
  undefined,
  undefined,
  undefined
);

head.createNode("head");
let action;
document.addEventListener("keydown", (event) => {
  event.preventDefault();
  if (action !== undefined) {
    clearInterval(action);
  }
  action = setInterval(() => {
    head.moove(event);
  }, refresh);
});

//##############
//CREATE FOOD :

export function createNewFood(
  w = "20px",
  h = "20px",
  color = "#56DE40",
  classname = "food",
  Class = "Ball",
  z = 9
) {
  let widthSize = window.innerWidth;

  let heightSize = window.innerHeight;

  let x = Math.random() * widthSize;

  let y = Math.random() * heightSize;

  let newFood;

  Class == "Ball"
    ? (newFood = new Ball(w, h, color, x, y, z))
    : (newFood = new SuperBall(w, h, color, x, y, z));

  newFood.createNode(classname);
}

//  MANAGE food : appearing and disappearing
//SET FUNCTION INSIDE INTERVAL :

//1) function to remove div (food or superfood)
export function removeDiv(className) {
  let firstNode = document.querySelector(className);
  firstNode && firstNode.remove();
  console.log("removeDiv used for :", className);
}

//2) function to stop poping (food or superfood)
export function autoCancel(fullClassName, popIntervalName, maxUnit = foodMax) {
  let totalDiv = document.querySelectorAll(fullClassName).length;

  if (totalDiv >= maxUnit) {
    clearInterval(allInterval[popIntervalName]);
    console.log("autocancel function used for :", fullClassName);
  }
}

// SET INTERVALS :

export let allInterval = {
  popInterval: undefined,
  removeFoodInterval: undefined,
  popSuperInterval: undefined,
  removeSuperFoodInterva: undefined,
};

//1) Interval to handle poping food :
export let setPoppingInterval = (
  callbackCreateNewFood = createNewFood,
  callbackAutoCancel = autoCancel,
  w,
  h,
  z,
  color,
  className = "food",
  fullClassName = ".node-food",
  popIntervalName = "popInterval",
  Class = "Ball",
  timer = popTime,
  maxUnit = foodMax
) => {
  allInterval[popIntervalName] = setInterval(() => {
    callbackCreateNewFood(w, h, color, className, Class, z);
    callbackAutoCancel(fullClassName, popIntervalName, maxUnit);
  }, timer);
};
let startFood = setPoppingInterval(); // creation de l'interval popping

//2) Interval to handle remove food :

export let setRemovingInterval = (
  intervalName = "removeFoodInterval",
  className = ".node-food",
  frequency
) => {
  allInterval[intervalName] = setInterval(() => {
    if (document.querySelectorAll(className).length <= 0) {
      clearInterval(allInterval[intervalName]);
    }
    removeDiv(className);
  }, frequency);
};
setRemovingInterval(undefined, undefined, removeTime);

//MANAGE COLISIONS and TIMER :

async function eat() {
  let myFoodpos = await getFoodPos();
  let myHeadpos = await getHeadPos();
  let headXmin = myHeadpos[0][0];
  let headXmax = myHeadpos[0][1];
  let headYmin = myHeadpos[1][0];
  let headYmax = myHeadpos[1][1];

  for (let i = 0; i < myFoodpos.length; i++) {
    let foodXmin = myFoodpos[i][1][0];
    let foodXmax = myFoodpos[i][1][1];
    let foodYmin = myFoodpos[i][2][0];
    let foodYmax = myFoodpos[i][2][1];

    if (
      headXmax > foodXmin &&
      headXmin < foodXmax &&
      headYmax > foodYmin &&
      headYmin < foodYmax
    ) {
      // console.log("i :", i);
      /* 
           console.table([
          [
            "headXmax>",
            "foodXmin",
            "headXmin<",
            "foodXmax",
            "headYmax>",
            "foodYmin",
            "headYmin<",
            "foodYmax",
          ],
          [
            headXmax,
            foodXmin,
            headXmin,
            foodXmax,
            headYmax,
            foodYmin,
            headYmin,
            foodYmax,
          ],
        ]); 
 */ let divEaten = document.querySelectorAll(".node-food, .node-superfood")[i];
      let removeDivEat = (indice = i) => {
        divEaten.remove();
      };

      removeDivEat();

      endTime = new Date();

      totalSec = endTime - timeStart;
      divEaten.className == "node-food" ? comptor() : comptor(4);
    }
  }
}

async function getFoodPos() {
  let allFood = document.querySelectorAll(".node-food, .node-superfood");
  let arrPosFood = []; // template of the positions of the food div : [ [div1 : [x1 min, x1 max], [y1 min, y1 max]], [ div2 : [x2 min, x2 max], [y2 min, y2 max]], ...  ]

  for (let i = 0; i < allFood.length; i++) {
    let posX = [
      allFood[i].getBoundingClientRect().x,
      allFood[i].getBoundingClientRect().x +
        allFood[i].getBoundingClientRect().width,
    ];
    let posY = [
      allFood[i].getBoundingClientRect().y,
      allFood[i].getBoundingClientRect().y +
        allFood[i].getBoundingClientRect().width,
    ];
    let pos = [i, posX, posY];
    arrPosFood.push(pos);
  }

  return arrPosFood;
}

export async function getHeadPos() {
  let head = document.querySelector(".node-head");

  let posX = [
    head.getBoundingClientRect().x,
    head.getBoundingClientRect().x + head.getBoundingClientRect().width,
  ];
  let posY = [
    head.getBoundingClientRect().y,
    head.getBoundingClientRect().y + head.getBoundingClientRect().width,
  ];
  let pos = [posX, posY];

  // console.log("HEAD POSITION Xmin/Xmax : Ymin/ Ymax : ", pos);
  return pos;
}

//##############
// Compteur :

let totalEat = 0;
let comptorNode = document.createElement("span");
comptorNode.classList.add("comptor");
let setStyle = {
  border: "2px solid rgba(88, 24, 69,1)",
  width: "100px",
  height: "50px",
  position: "fixed",
  top: "50px",
  left: "50px",
  textAlign: "center",
  lineHeight: "50px",
  borderRadius: "25px",
  boxShadow: "3px 3px 10px -3px rgba(88, 24, 69,0.6)",
  fontFamily: "Helvetica",
  fontWeight: "bold",
  color: "#B1318B",
  zIndex: "100",
  backgroundColor: "white",
};

Object.assign(comptorNode.style, setStyle);

document.querySelector("body").appendChild(comptorNode);

function comptor(x = 1) {
  if (totalEat < scoreMax) {
    totalEat += x;
    comptorNode.textContent = totalEat;
    return totalEat;
  } else {
    let stop = (() => {
      clearInterval(allInterval.popInterval);
    })();
    if (
      window.confirm(
        `
On dirait que tu avais faim ! 

Tu as mangé ${scoreMax} boulettes en ${totalSec / 1000} secondes ! 🥳

Veux-tu recommencer ? ✋🤪🤚`
      )
    ) {
      location.reload();
    }
  }
}

let startSuperFood = setPoppingInterval(
  undefined,
  undefined,
  "13px",
  "13px",
  9,
  "white",
  "superfood",
  ".node-superfood",
  "popSuperInterval",
  "SuperBall",
  4000,
  10
);

let deleteSuperFood = setRemovingInterval(
  "removeSuperFoodInterva",
  ".node-superfood",
  6000
);
