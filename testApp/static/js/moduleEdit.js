"use strict";

var checkedProdsEnzsSubs = []; //array of types (i.e. enzyme, product or substrate)
var checkedProdsEnzsSubsNames = []; //array of names of enzymes, products, substrates in rxn
var canvas1; //variable for canvas element
var substrates; //holds array of all substrate checkboxes
var enzymes; //holds array of all enzyme radio buttons
var products; //holds array of all product checkboxes
var ctx; //context of the canvas element, is 2d
var image; //image to be displayed corresponding to substrates and products chosen
var createBtn; //button hit after module settings are set (displays rxn in canvas)
var isReversible; //boolean that indicates if user wants rxn to be reversible or not
var reversibleChoice; //variable to hold reversible radio buttons
var weightSliderValue; //var corresponding to textbox for weight slider, displays weight value and allows user to set weight
var submitWeightBtn; //var corresponding to button to enter weight set in text weightSliderValue textbox
var weightSlider; //var corresponding to weight slider
var objectWidth = 125; //width of boxes for substrates and products and arrows
var objectHeight = 125; //height of boxes for substrates and products
var horizontalBuffer = 20; //buffer size between each substrate, product and enzyme in canvas
var verticalBuffer = 10;
var countProducts;
var countSubstrates;

//function to change the text box to the value set by slider
function updateTextInput(val) {
  document.getElementById('weightSliderValue').value=val;
}
//function to change reversible boolean depending on which reversible radio btn is set
function onRadioReverseChange(){
  if(reversibleChoice[0].checked){
    isReversible = true;
  }else{
    isReversible = false;
  }
  console.log(isReversible);
}

//check which radio buttons and checkboxes are clicked for products, enzymes and substrates
//push name of product, substrate, enzyme to checkedProdsEnzsSubsNames
//push type to checkedProdsEnzsSubs
function onRadioChange(){
  checkedProdsEnzsSubs = [];
  checkedProdsEnzsSubsNames = [];
  for(var i = 0; i < substrates.length; i++){
    if(substrates[i].checked){
      countSubstrates++;
      checkedProdsEnzsSubs.push(substrates[i].name);
      checkedProdsEnzsSubsNames.push(substrates[i].value);
    }
  }
  for(var j = 0; j < enzymes.length; j++){
    if(enzymes[j].checked){
      checkedProdsEnzsSubs.push(enzymes[j].name);
      checkedProdsEnzsSubsNames.push(enzymes[j].value);
    }
  }
  for(var k = 0; k < products.length; k++){
    if(products[k].checked){
      countProducts++;
      checkedProdsEnzsSubs.push(products[k].name);
      checkedProdsEnzsSubsNames.push(products[k].value);
    }
  }
}
//not used as of right now
// function getMousePosition(canvas1, event) {
//     let border = canvas1.getBoundingClientRect();
//     return {
//         x: event.clientX - border.left,
//         y: event.clientY - border.top
//     };
// }
//display image corresponding to substrates and products chosen
function displayImage(xcoor, ycoor, name){
  console.log(name);
  var img = document.getElementById(name);
  ctx.drawImage(img, xcoor, ycoor, objectWidth, objectHeight);
}
//draw boxes for substrates and products and set text for substrates, products and enzymes
function drawObject(count, type, xcoor, ycoor, name){
  if(type === "substrate" || type === "product"){
    displayImage(xcoor, ycoor, name);
    //draw box around image
    ctx.moveTo(xcoor,ycoor);
    ctx.lineTo(xcoor + objectWidth, ycoor);
    ctx.lineTo(xcoor + objectWidth, ycoor + objectHeight);
    ctx.lineTo(xcoor, ycoor + objectHeight);
    ctx.lineTo(xcoor, ycoor);
    ctx.stroke();

    ycoor = ycoor + objectHeight / 25; //add a small buffer so that text below image does not overlap with square
    ctx.font = "12px Arial";
    //draw text below box containing substrate or product
    ctx.fillText(name, xcoor, ycoor + objectHeight + verticalBuffer);

  }else if (type === "enzyme"){
    ctx.font = "12px Arial";
    ycoor = ycoor + objectHeight / 25;
    // ctx.fillText(name, xcoor , ycoor + objectBuffer); //This is for version without downwards arrow
    ctx.fillText(name, xcoor , ycoor + (objectHeight / 2));//This is for version with downwards arrow
  }else{
  }
}
//draw dotted line across screen
// function drawLine(xcoor, ycoor){
//   ctx.moveTo(objectBuffer, ycoor + objectHeight + objectBuffer * 2);
//   ctx.setLineDash([objectBuffer, objectBuffer/2]);
//   ctx.lineTo(canvas1.width - objectBuffer, ycoor + objectHeight + objectBuffer * 2);
//   ctx.stroke();
//   ctx.beginPath();
//   ctx.setLineDash([]);
// }

//draw downwards arrow in center of current row
function drawDownArrow(xcoor, ycoor){
  if(isReversible){
    //xcoor = canvas1.width / 2;
    ctx.moveTo(xcoor, ycoor);
    ctx.lineTo(xcoor + (objectWidth / 4), ycoor + (objectHeight / 4));
    ctx.lineTo(xcoor - (objectWidth / 4), ycoor + (objectHeight / 4));
    ctx.lineTo(xcoor, ycoor);
    ctx.lineTo(xcoor, ycoor + objectHeight);
    ctx.lineTo(xcoor + (objectWidth / 4), ycoor + objectHeight - (objectHeight / 4));
    ctx.lineTo(xcoor - (objectWidth / 4), ycoor + objectHeight - (objectHeight / 4));
    ctx.lineTo(xcoor, ycoor + objectHeight);
    ctx.stroke();
  }else{
    //xcoor = canvas1.width / 2;
    ctx.moveTo(xcoor, ycoor);
    ctx.lineTo(xcoor, ycoor + objectHeight);
    ctx.lineTo(xcoor + (objectWidth / 4), ycoor + objectHeight - (objectHeight / 4));
    ctx.lineTo(xcoor - (objectWidth / 4), ycoor + objectHeight - (objectHeight / 4));
    ctx.lineTo(xcoor, ycoor + objectHeight);
    ctx.stroke();
  }
}

//draw regular arrow for reaction, reversible or irreversible
function drawArrow(xcoor, ycoor){
  if(isReversible){
    ycoor = ycoor + objectHeight / 2;
    ctx.moveTo(xcoor, ycoor);
    ctx.lineTo(xcoor + (objectWidth / 4), ycoor - (objectHeight / 4));
    ctx.lineTo(xcoor + (objectWidth / 4), ycoor + (objectHeight / 4));
    ctx.lineTo(xcoor, ycoor);
    ctx.lineTo(xcoor + objectWidth, ycoor);
    ctx.lineTo(xcoor + objectWidth - (objectWidth / 4), ycoor - (objectHeight / 4));
    ctx.lineTo(xcoor + objectWidth - (objectWidth / 4), ycoor + (objectHeight / 4));
    ctx.lineTo(xcoor + objectWidth, ycoor);
    ctx.stroke();
  }else{
    ycoor = ycoor + objectHeight / 2;
    ctx.moveTo(xcoor, ycoor);
    ctx.lineTo(xcoor + objectWidth, ycoor);
    ctx.lineTo(xcoor + objectWidth - (objectWidth / 4), ycoor - (objectHeight / 4));
    ctx.lineTo(xcoor + objectWidth - (objectWidth / 4), ycoor + (objectHeight / 4));
    ctx.lineTo(xcoor + objectWidth, ycoor);
    ctx.stroke();
  }
}
//draw plus sign between each substrate and product
function drawPlus(xcoor, ycoor){
  xcoor = xcoor + objectWidth + horizontalBuffer;
  ycoor = ycoor + objectHeight / 2;
  ctx.moveTo(xcoor, ycoor);
  ctx.lineTo(xcoor, ycoor - horizontalBuffer);
  ctx.moveTo(xcoor - horizontalBuffer / 2, ycoor - horizontalBuffer / 2);
  ctx.lineTo(xcoor + horizontalBuffer / 2, ycoor - horizontalBuffer / 2);
  ctx.stroke();
}
//called when create button is clicked
function displayReaction(){
  var name;
  var objectInRowCounter = 0;
  // console.log("DISPLAY REACTION CALLED");
  // console.log(checkedProdsEnzsSubs);
  var currentX = horizontalBuffer;
  var currentY = verticalBuffer;
  //iterate through checkedProdsEnzsSubs array
  for(var a = 0; a < checkedProdsEnzsSubs.length; a++){
    name = checkedProdsEnzsSubsNames[a];
    //reset currentX and currentY if over 4 products and/or substrates are being displayed
    //so that everything is visible inside canvas border
    if(objectInRowCounter > 0 && objectInRowCounter % 5 === 0){
      currentX = horizontalBuffer;
      currentY = currentY + objectHeight + verticalBuffer * 2;
      objectInRowCounter = 0;//reset counter
    }

    var currentObject = checkedProdsEnzsSubs[a];
    //check if currentObject is a Substrate
    if(currentObject === "Substrate"){
      drawObject(a, "substrate", currentX, currentY, name);
      if(checkedProdsEnzsSubs.length - 1 > a){
        //if next object is an enzyme draw arrow
        if(checkedProdsEnzsSubs[a+1] === "Enzyme"){
          console.log(objectInRowCounter + "OBJECT IN ROW ");
          // if(objectInRowCounter > 0 && (objectInRowCounter+1) % 5 === 0){//for version without downwards arrow
          if(objectInRowCounter > 0 && (objectInRowCounter) % 5 === 0){//for version with downwards arrow
            currentX = horizontalBuffer;
            currentY = currentY + objectHeight + verticalBuffer * 2;
            objectInRowCounter = 0;
          }else{
            currentX = currentX + objectWidth + horizontalBuffer * 2;
          }
          //drawArrow(currentX, currentY);//for version without downwards arrow
          currentY = currentY + objectHeight + verticalBuffer * 2; //for version with downwards arrow
          currentX = canvas1.width / 2; //for version with downwards arrow
          drawDownArrow(currentX, currentY); //for version with downwards arrow
          objectInRowCounter = 0;//for version with downwards arrow
        //if next object is not an enzyme draw plus
        }else{
          drawPlus(currentX, currentY);
          currentX = currentX + objectWidth + horizontalBuffer* 2;
        }
      }
    }else if(currentObject === "Enzyme"){
      drawObject(a, "enzyme", currentX, currentY, name);
      console.log(currentObject);
      if(checkedProdsEnzsSubs.length - 1 > a){
        //if next object is a product set currentX
        if(checkedProdsEnzsSubs[a+1] === "Product"){
          // drawLine(currentX, currentY);
          //currentX = currentX + objectWidth + objectBuffer;
          currentX = horizontalBuffer;//for version with downwards arrow
          currentY = currentY + objectHeight + verticalBuffer * 2; //for version with downwards arrow
          objectInRowCounter = 0; //for version with downwards arrow
        }
      }
    }else{
      //draw all products
      drawObject(a, "product", currentX, currentY, name);
      if(checkedProdsEnzsSubs.length - 1 > a){
        drawPlus(currentX, currentY);
      }
      currentX = currentX + objectWidth + horizontalBuffer * 2;
      console.log(currentObject);
    }
    objectInRowCounter++;
  }
}

window.onload = function init(){
  canvas1 = document.getElementById("imageCanvas");
  substrates  = document.getElementsByName('Substrate');
  enzymes = document.getElementsByName('Enzyme');
  products = document.getElementsByName('Product');
  reversibleChoice = document.getElementsByName('reversibleChoice');
  ctx  = canvas1.getContext("2d");
  image  = document.getElementById("step1");
  createBtn = document.getElementById("createReaction");
  weightSliderValue = document.getElementById('weightSliderValue');
  submitWeightBtn = document.getElementById('submitWeight');
  weightSlider = document.getElementById('weightSlider');

  createBtn.addEventListener("click", function(event){
    //clear everything out of canvas on button click so we can draw new rxn
    ctx.clearRect(0, 0, canvas1.width, canvas1.height);
    //calling beginPath here preps canvas for drawing
    ctx.beginPath();
    console.log("button clicked");//show reaction
    console.log(checkedProdsEnzsSubs);
    displayReaction();
  });

//not currently important
  // canvas1.addEventListener("click", function (event) {
  //     let mousePosition = getMousePosition(canvas1, event);
  //     let rectNum = (Math.floor(mousePosition.x / 100) + Math.floor(mousePosition.y / objectWidth) * 8) - 15;
  //     let rectClicked = document.getElementById("rectClicked");
  //     console.log("CLICK");
  // });

//button to submit value entered in weight value text box
//and set slider accordingly
  submitWeightBtn.addEventListener("click", function(event) {
    var val = weightSliderValue.value;
    console.log(val);
    //verify that value entered is valid and within range
    if(val >= -1.0 && val <= 1.0){
      weightSlider.value=val;
    }else{
      weightSliderValue.value=0.0;
      weightSlider.value = 0.0;
    }
 });
}
function main () {
}
main()

// module.exports = {};
// module.exports.getMousePosition = getMousePosition;
