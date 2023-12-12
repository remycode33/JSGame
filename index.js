import { Traject } from "./ghostTraject.js";
import { Point } from "./ghostTraject.js";
import { SuperBall } from "./superBall.js";

//Variables :
let scoreMax = 10;
let vitesse = 30;
let popTime = 1800;
let removeTime = 5000;
let rayon = 350;
let maxSize = 100;
let foodMax = 10;

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

//####################################
//component to create Head and food :

export function Ball(
  w = "50px",
  h = "50px",
  color = "purple",
  x = window.innerWidth / 2,
  y = window.innerHeight / 2,
  z = 10
) {
  let context = this;

  this.position = [y, x];
  let node;

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

  this.moove = function (event) {
    function reachPosition() {
      let stgTop = node.style.top;
      stgTop = stgTop.split("px");

      let stgLeft = node.style.left;
      stgLeft = stgLeft.split("px");
      let position = [parseInt(stgTop), parseInt(stgLeft)];

      eat();
      context.position = position;
      return position;
    }

    function updateMoove() {
      let shift = vitesse;
      let position = reachPosition();

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
          console.info(point);
          if (traject.historic.length >= maxSize) {
            removeDiv(".point");
          }
        };

        switch (event.key) {
          case "ArrowUp":
            position[0] -= shift;
            node.style.top = `${position[0]}px`;
            // set new point :

            dontRepeat();

            break;
          case "ArrowDown":
            context.position[0] += shift;
            node.style.top = `${position[0]}px`;
            dontRepeat();

            break;
          case "ArrowLeft":
            context.position[1] -= shift;
            node.style.left = `${position[1]}px`;

            dontRepeat();

            break;
          case "ArrowRight":
            context.position[1] += shift;
            node.style.left = `${position[1]}px`;

            dontRepeat();

            break;
        }
      } catch (e) {
        console.error(e);
        console.info("début de partie, appuyez sur une touche directionnelle");
      }
    }

    updateMoove();
  };
}

function moveBall(ball) {
  return (event) => {
    event.preventDefault();
    ball.moove(event);
  };
}
//#############
//CREATE HEAD :

let head = new Ball(
  undefined,
  undefined,
  "radial-gradient(circle, rgba(177,49,139,1) 0%, rgba(112,31,88,1) 100%)",
  undefined,
  undefined,
  undefined
);

head.createNode("head");

const moveHead = moveBall(head);

document.addEventListener("keydown", moveHead);

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
//##############
//  MANAGE food : appearing and disappearing

// let popInterval;
// let removeInterval;

//#### SET FUNCTION INSIDE INTERVAL :

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

// #### SET INTERVALS :

export let allInterval = {
  popInterval: undefined,
  removeFoodInterval: undefined,
  popSuperInterval: undefined,
  removeSuperFoodInterva: undefined,
};
// let allClearInterval = {
//   clearPopInterval: undefined,
//   clearRemoveDivInterval: undefined,
// };

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
setPoppingInterval(); // creation de l'interval popping

//2) Interval to handle remove food :

export let setRemovingInterval = (
  intervalName = "removeFoodInterval",
  className = ".node-food",
  frequency
) => {
  allInterval[intervalName] = setInterval(() => {
    // if (document.querySelectorAll(className).length <= 0) {
    //   clearInterval(allInterval[intervalName]);
    // }
    removeDiv(className);
    console.log(frequency);
  }, frequency);
};
setRemovingInterval(undefined, undefined, removeTime);

/* //### interval qui supprimer les div durant la partie
// let letsRemove = ((name = ".node-food") => {
//   removeInterval = setInterval(() => {
//     if (document.querySelectorAll(name).length <= 0) {
//       clearInterval(removeInterval);
//     }
//     removeDiv(name);
//     console.log("etape 2 : letsremove(removediv)");
//   }, popTime * 3);
// })();
 */
//###########################
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
      console.log("i :", i);
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
 */
      let removeDivEat = ((indice = i) => {
        document.querySelectorAll(".node-food")[indice].remove();
      })();

      endTime = new Date();

      totalSec = endTime - timeStart;
      comptor();
    }
  }
}

async function getFoodPos() {
  let allFood = document.querySelectorAll(".node-food");
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

  console.log("HEAD POSITION Xmin/Xmax : Ymin/ Ymax : ", pos);
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

function comptor() {
  if (totalEat < scoreMax) {
    totalEat++;
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
  popTime * 3,
  1
);

let deleteSuperFood = setRemovingInterval(
  "removeSuperFoodInterva",
  ".node-superfood",
  popTime * 3 + 2500
);
