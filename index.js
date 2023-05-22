//timer
let timeStart = new Date
let endTime
let totalSec = timeStart - endTime
//Mon composant Ball pour générer les tous les éléments (tête et nourriture)
function Ball(w='50px',h='50px',color='blue', x=300,y=100,z='0') {
    
    this.position =[y,x]
    let node
    
    this.shape= {
        width:w,
        height:h,
        borderRadius:'50%',
        background:color,
        position: 'absolute',
        top: `${y}px`,
        left: `${x}px`,
        zIndex: `${z}`
    }  

    this.createNode = function(objectName) {

        node = document.createElement('div')
        node.classList.add(`node-${objectName}`)

        Object.assign(node.style, this.shape)
        
        document.querySelector('body').appendChild(node)
        
        // console.log("objet créé",this)
    }

    this.moove =  function(event){
    
        function reachPosition(){
    
            let stgTop = node.style.top
            stgTop = stgTop.split('px')
            
            let stgLeft = node.style.left
            stgLeft= stgLeft.split('px')
            
            position = [parseInt(stgTop),parseInt(stgLeft)]  
             eat()
            // console.log(position)
            return position
        }
    
        function updateMoove(){
            
            let shift =30;
            reachPosition()
            try{
            switch (event.key) {
                case "ArrowUp":
                  position[0] -= shift  ;
                  node.style.top = `${position[0]}px`;
                  break;
                 case "ArrowDown":
                    position[0] += shift;
                    node.style.top = `${position[0]}px`;
                    break;
                case "ArrowLeft":
                    position[1] -= shift;
                    node.style.left = `${position[1]}px`;
                    break;
                case "ArrowRight":
                    position[1] += shift;
                    node.style.left = `${position[1]}px`;
                    break;
              }
            } catch(e) {
               console.info('début de partie, appuyez sur une touche directionnelle')
            }
        }
    
        updateMoove()
        console.log('position', position)
    }   
}

function moveBall(ball) {
        return function(event) {
            ball.moove(event)
        }
}


let head = new Ball('50px','50px','radial-gradient(circle, rgba(177,49,139,1) 0%, rgba(112,31,88,1) 100%)', undefined, undefined,1)
head.createNode('head')

const moveHead = moveBall(head)

document.addEventListener('keydown', moveHead)

function createNewFood() {
        let widthSize = window.innerWidth

        let heightSize = window.innerHeight

        let x = Math.random()*widthSize

            // console.log('x  :',x)

        let y = Math.random()*heightSize
 
            // console.log('y   :',y)
            
      let newFood = new Ball('20px','20px','rgba(248, 136, 162,1)', x ,y);

      newFood.createNode('food');
    }

// createNewFood()

function removeDiv(n=5) {
    let firstNode = document.querySelector(`body > div:nth-child(${n})`)
    // console.log(firstNode)
    firstNode.remove()
}

// pop food et auto suppression food

let popTime = 400

let letsPop = setInterval(() => {createNewFood(),autoCancel()}, popTime)

let letsRemove = setInterval( () => {removeDiv()}, popTime*3)

function autoCancel() {
    let totalDiv = document.querySelectorAll('div').length 
    if(totalDiv >= 50) {
        let stop = () => { clearInterval(letsPop); clearInterval(letsRemove)};
        stop()
    }
}
//gestion des colisionset de la durée de jeu:


async function eat() {
    let myFoodpos = await getFoodPos()
    let myHeadpos = await getHeadPos()
    let headXmin = myHeadpos[0][0]
    let headXmax = myHeadpos[0][1]
    let headYmin = myHeadpos[1][0]
    let headYmax = myHeadpos[1][1]

    for(let i=0; i<myFoodpos.length;i++){
        let foodXmin = myFoodpos[i][1][0]
        let foodXmax = myFoodpos[i][1][1]
        let foodYmin = myFoodpos[i][2][0]
        let foodYmax = myFoodpos[i][2][1]

        if( (headXmax> foodXmin && headXmin< foodXmax) && (headYmax> foodYmin && headYmin< foodYmax)){
            console.log("i :",i)
            console.table([['headXmax>','foodXmin','headXmin<','foodXmax','headYmax>','foodYmin','headYmin<','foodYmax'],[headXmax,foodXmin,headXmin,foodXmax,headYmax,foodYmin,headYmin,foodYmax]])
            endTime = new Date
            totalSec = endTime - timeStart
            removeDiv(5+i);
            comptor()
        }
   }
//    console.timeEnd('eat')
}


 async function getFoodPos() {
    let allFood = document.querySelectorAll('body div:nth-child(n+4)')
    let arrPosFood=[]

    for(let i=0; i<allFood.length; i++){
        let posX = [allFood[i].getBoundingClientRect().x,allFood[i].getBoundingClientRect().x + allFood[i].getBoundingClientRect().width]
        let posY = [allFood[i].getBoundingClientRect().y, allFood[i].getBoundingClientRect().y + allFood[i].getBoundingClientRect().width]
        let pos = [3+i,posX,posY]
        arrPosFood.push(pos)
    }

    // console.log('position de toutes les div food sous forme :  [ numDiv, [x min, x max], [y min, y max] ]')
    return arrPosFood
}

async function getHeadPos(){
    let head = document.querySelector('body div:nth-child(3)')

    let posX = [head.getBoundingClientRect().x,head.getBoundingClientRect().x + head.getBoundingClientRect().width]
    let posY = [head.getBoundingClientRect().y, head.getBoundingClientRect().y + head.getBoundingClientRect().width]
    let pos = [posX,posY]

    // console.log('position de head :  [ [x min, x max], [y min, y max] ]')
    return pos
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Compteur :

let totalEat = 0
let comptorNode = document.createElement('span')
comptorNode.classList.add('comptor')
let setStyle = {
    border:"2px solid rgba(88, 24, 69,1)",
    width:"100px",
    height:"50px",
    position:"fixed",
    top:'50px',
    left:'50px',
    textAlign:'center',
    lineHeight:'50px',
    borderRadius:'25px',
    boxShadow: '2px 2px 10px rgba(88, 24, 69,1)' ,
    color:"#B1318B" ,
     }

   Object.assign(comptorNode.style, setStyle)

    document.querySelector('body').appendChild(comptorNode)

function comptor(){
  if(totalEat < 10){
    totalEat ++
    comptorNode.textContent = totalEat
    return totalEat} 
    
    else {
        let stop = ( () => {clearInterval(letsPop)})()
        window.alert(`On dirait que tu avais faim ! Tu as mangé 10 boulettes en ${totalSec/1000} secondes ! 🥳}`)
        }
}