"use strict";

var checkedSubsNames = []; //array of names of enzymes, products, substrates in rxn
var checkedEnzsNames = [];
var checkedProdsNames = [];
var canvas1; //variable for canvas element
var substrates; //holds array of all substrate checkboxes
var enzymes; //holds array of all enzyme radio buttons
var products; //holds array of all product checkboxes
var ctx; //context of the canvas element, is 2d
var image; //image to be displayed corresponding to substrates and products chosen
var createBtn; //button hit after module settings are set (displays rxn in canvas)
var saveBtn; //button hit after user is finished, send user back to model edit screen
var clearBtn;
var isReversible = false; //boolean that indicates if user wants rxn to be reversible or not
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
var currentRxn = "";
var modal;

var step1 = "Glucose+ATP>Hexokinase<Glucose-6-Phosphate+ADP;false";
var step2 = "Glucose-6-Phosphate>Phosphoglucose isomerase<Fructose-6-Phosphate;true";
var step3 = "Fructose-6-Phosphate+ATP>Phosphofructokinase<Fructose-1,6-bisphosphate+ADP;false";
var step4 = "Fructose-1,6-bisphosphate>aldolase<Dihydroxyacetone Phosphate+Glyceraldehyde-3-Phosphate;true"
var step5 = "Dihydroxyacetone Phosphate>Triosephosphate isomerase<Glyceraldehyde-3-Phosphate;true";
var step6 = "Glyceraldehyde-3-Phosphate>Glyceraldehyde phosphate dehydrogenase<1,3-bisphoglycerate;true";
var step7 = "1,3-bisphoglycerate>Phosphoglycerate kinase<3 phosphoglycerate;true";
var step8 = "3 phosphoglycerate>Phosphoglycerate mutase<2 phosphoglycerate;true";
var step9 = "2 phosphoglycerate>Enolase<Phosphoenolpyruvate;true";
var step10 = "Phosphoenolpyruvate>Pyruvate kinase<Pyruvate;false";

//My guess is we'll need a similar construct like this in the DB
//there will be 3 columns Enzyme name, product/substrate name/ and boolean indicating type (prod/sub)
//then the enzymeProds array will fetch all rows with type product and enzymeSubs will fetch the rest
//And we'll end up with 2 arrays filled with arrays of length 2
var enzymeProds = [["Hexokinase","Glucose-6-Phosphate"],["Hexokinase","ADP"],["Phosphoglucose isomerase","Fructose-6-Phosphate"],
  ["Phosphofructokinase","Fructose-1,6-bisphosphate"],["Phosphofructokinase","ADP"],["aldolase","Dihydroxyacetone Phosphate"],["aldolase","Glyceraldehyde-3-Phosphate"],
  ["Triosephosphate isomerase","Glyceraldehyde-3-Phosphate"],["Glyceraldehyde phosphate dehydrogenase","1,3-bisphoglycerate"],
  ["Phosphoglycerate kinase","3 phosphoglycerate"],["Phosphoglycerate kinase","ADP"],["Phosphoglycerate mutase","2 phosphoglycerate"],["Enolase","Phosphoenolpyruvate"],
  ["Pyruvate kinase","Pyruvate"],["Pyruvate kinase","ADP"]];
var enzymeSubs = [["Hexokinase","Glucose"],["Hexokinase","ATP"],["Phosphoglucose isomerase","Glucose-6-Phosphate"],
  ["Phosphofructokinase","Fructose-6-Phosphate"],["Phosphofructokinase","ATP"],["aldolase","Fructose-1,6-bisphosphate"], ["Triosephosphate isomerase","Dihydroxyacetone Phosphate"],
  ["Glyceraldehyde phosphate dehydrogenase","Glyceraldehyde-3-Phosphate"],["Phosphoglycerate kinase","1,3-bisphoglycerate"],["Phosphoglycerate kinase","ATP"],
  ["Phosphoglycerate mutase","3 phosphoglycerate"],["Enolase","2 phosphoglycerate"],["Pyruvate kinase","Phosphoenolpyruvate"],["Pyruvate kinase","ATP"]];

var enzymeReverse = [["Hexokinase","irreversible"], ["Phosphoglucose isomerase","reversible"], ["Phosphofructokinase","irreversible"], ["aldolase","reversible"],
  ["Triosephosphate isomerase","reversible"],["Glyceraldehyde phosphate dehydrogenase","reversible"],["Phosphoglycerate kinase","reversible"],
  ["Phosphoglycerate mutase","reversible"],["Enolase","reversible"],["Pyruvate kinase","irreversible"]];
//function to change the text box to the value set by slider
// function updateTextInput(val) {
//   document.getElementById('weightSliderValue').value=val;
// }

//function to change reversible boolean depending on which reversible radio btn is set
function onRadioReverseChange(){
  if(reversibleChoice[0].checked){
    isReversible = true;
  }else{
    isReversible = false;
  }
}

//check which radio buttons and checkboxes are clicked for products, enzymes and substrates
//push name of product, substrate, enzyme to checkedProdsEnzsSubsNames
//push type to checkedProdsEnzsSubs
function onRadioChange(){
  countProducts = 0;
  countSubstrates = 0;
  checkedSubsNames = [];
  checkedProdsNames = [];
  checkedEnzsNames = []

  for(var i = 0; i < substrates.length; i++){
    if(substrates[i].checked){
      countSubstrates++;
      checkedSubsNames.push(substrates[i].value);
    }
  }
  for(var j = 0; j < enzymes.length; j++){
    if(enzymes[j].checked){
      checkedEnzsNames.push(enzymes[j].value);
    }
  }
  for(var k = 0; k < products.length; k++){
    if(products[k].checked){
      countProducts++;
      checkedProdsNames.push(products[k].value);
    }
  }
  if(countProducts > 5 || countSubstrates > 5){
    modal.style.display = "block";
    ctx.clearRect(0, 0, canvas1.width, canvas1.height);
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
  if(name === "ADP" || name === "ATP"){
    console.log("ADP OR ATP");
  }else{
    var img = document.getElementById(name);
    ctx.drawImage(img, xcoor, ycoor, objectWidth, objectHeight);
  }
  console.log("image info  " + name + xcoor + ycoor);
}

//draw boxes for substrates and products and set text
function drawObject(xcoor, ycoor, name){
  console.log(name);
  if(name === "ATP" || name === "ADP"){
    //xcoor = xcoor + (objectWidth / 2);
    ycoor = ycoor - (objectHeight / 2);
    ctx.font = "24px Arial";
    ctx.fillText(name, xcoor, ycoor + objectHeight + verticalBuffer);
    ycoor = ycoor + (objectHeight / 2);
    //xcoor = xcoor - (objectWidth / 2);
  }else{
    displayImage(xcoor, ycoor, name);
    //draw box around image
    ctx.moveTo(xcoor,ycoor);
    ctx.lineTo(xcoor + objectWidth, ycoor);
    ctx.lineTo(xcoor + objectWidth, ycoor + objectHeight);
    ctx.lineTo(xcoor, ycoor + objectHeight);
    ctx.lineTo(xcoor, ycoor);
    ctx.stroke();

    ycoor = ycoor + objectHeight / 25; //add a small buffer so that text below image does not overlap with square
    ctx.font = "14px Arial";
    //draw text below box containing substrate or product
    ctx.fillText(name, xcoor, ycoor + objectHeight + verticalBuffer);
  }
  return [xcoor, ycoor, name];
}

//draw downwards arrow in center of current row
function drawDownArrow(xcoor, ycoor, name){
  ctx.font = "14px Arial";
  ycoor = ycoor + objectHeight / 25;
  // ctx.fillText(name, xcoor , ycoor + objectBuffer); //This is for version without downwards arrow
  ctx.fillText(name, xcoor + 5 , ycoor + (objectHeight / 2));//This is for version with downwards arrow
  if(isReversible){
    //xcoor = canvas1.width / 2;
    ctx.moveTo(xcoor, ycoor);
    ctx.lineTo(xcoor + (objectWidth / 4), ycoor + (objectHeight / 4));
    ctx.lineTo(xcoor, ycoor);
    ctx.lineTo(xcoor - (objectWidth / 4), ycoor + (objectHeight / 4));
    ctx.lineTo(xcoor, ycoor);
    ctx.lineTo(xcoor, ycoor + objectHeight);
    ctx.lineTo(xcoor + (objectWidth / 4), ycoor + objectHeight - (objectHeight / 4));
    ctx.lineTo(xcoor, ycoor + objectHeight);
    ctx.lineTo(xcoor - (objectWidth / 4), ycoor + objectHeight - (objectHeight / 4));
    ctx.stroke();
  }else{
    //xcoor = canvas1.width / 2;
    ctx.moveTo(xcoor, ycoor);
    ctx.lineTo(xcoor, ycoor + objectHeight);
    ctx.lineTo(xcoor + (objectWidth / 4), ycoor + objectHeight - (objectHeight / 4));
    ctx.lineTo(xcoor, ycoor + objectHeight);
    ctx.lineTo(xcoor - (objectWidth / 4), ycoor + objectHeight - (objectHeight / 4));
    ctx.stroke();
  }
  return [xcoor, ycoor, name];
}

//draw regular arrow for reaction, reversible or irreversible
// function drawArrow(xcoor, ycoor){
//   if(isReversible){
//     ycoor = ycoor + objectHeight / 2;
//     ctx.moveTo(xcoor, ycoor);
//     ctx.lineTo(xcoor + (objectWidth / 4), ycoor - (objectHeight / 4));
//     ctx.lineTo(xcoor + (objectWidth / 4), ycoor + (objectHeight / 4));
//     ctx.lineTo(xcoor, ycoor);
//     ctx.lineTo(xcoor + objectWidth, ycoor);
//     ctx.lineTo(xcoor + objectWidth - (objectWidth / 4), ycoor - (objectHeight / 4));
//     ctx.lineTo(xcoor + objectWidth - (objectWidth / 4), ycoor + (objectHeight / 4));
//     ctx.lineTo(xcoor + objectWidth, ycoor);
//     ctx.stroke();
//   }else{
//     ycoor = ycoor + objectHeight / 2;
//     ctx.moveTo(xcoor, ycoor);
//     ctx.lineTo(xcoor + objectWidth, ycoor);
//     ctx.lineTo(xcoor + objectWidth - (objectWidth / 4), ycoor - (objectHeight / 4));
//     ctx.lineTo(xcoor + objectWidth - (objectWidth / 4), ycoor + (objectHeight / 4));
//     ctx.lineTo(xcoor + objectWidth, ycoor);
//     ctx.stroke();
//   }
// }
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

function setInitialXCoor(count){
  var xcoor;
  console.log("SET X COOR");
  if(count === 1){
    console.log(count);
    xcoor = objectWidth * 2 + horizontalBuffer * 4;
  }else if(count === 2){
    xcoor = (canvas1.width / 2) - (horizontalBuffer * 2) - objectWidth;
  }else if(count === 3){
    xcoor = objectWidth + horizontalBuffer * 2;
  }else if(count === 4){
    xcoor = (canvas1.width / 2) - (horizontalBuffer * 4) - objectWidth * 2;
  }else{
    xcoor = 0;
  }
  return xcoor;
}

function drawSubstrates(currentX, currentY){
  var name;
  var a;
  for(a = 0; a < checkedSubsNames.length; a++){
    name = checkedSubsNames[a];
    drawObject(currentX, currentY, name);
    if(checkedSubsNames.length > a + 1){
      drawPlus(currentX, currentY);
      currentX = currentX + objectWidth + horizontalBuffer * 2;
    }
  }
}

function drawProducts(currentX, currentY){
  var name;
  var a;
  for(a = 0; a < checkedProdsNames.length; a++){
    name = checkedProdsNames[a];
    drawObject(currentX, currentY, name);
    if(checkedProdsNames.length > a + 1){
      drawPlus(currentX, currentY);
      currentX = currentX + objectWidth + horizontalBuffer * 2;
    }
  }
}

//called when create button is clicked
function displayReaction(){
  var name;
  var currentX = horizontalBuffer;
  var currentY = verticalBuffer;
  currentX = currentX + setInitialXCoor(countSubstrates);
  drawSubstrates(currentX, currentY);

  currentY = currentY + objectHeight + verticalBuffer * 2; //for version with downwards arrow
  currentX = canvas1.width / 2; //for version with downwards arrow
  name = checkedEnzsNames[0];
  drawDownArrow(currentX, currentY, name);

  currentX = horizontalBuffer;
  currentY = verticalBuffer * 5 + objectHeight * 2;
  currentX = currentX + setInitialXCoor(countProducts);
  drawProducts(currentX, currentY);
}

function setReaction(enzymeSubs, enzymeProds, enzymeReverse){
  var enzymeName = checkedEnzsNames[0];
  for(var i = 0; i < enzymeSubs.length; i++){
    for(var j = 1; j < enzymeSubs[i].length; j++){
      if(enzymeSubs[i][0] === enzymeName){
        console.log("**********"+enzymeSubs[i],[j]);
        checkedSubsNames.push(enzymeSubs[i][j]);
        countSubstrates++;
      }
    }
  }
  for(var i = 0; i < enzymeProds.length; i++){
    for(var j = 1; j < enzymeProds[i].length; j++){
      if(enzymeProds[i][0] === enzymeName){
        checkedProdsNames.push(enzymeProds[i][j]);
        countProducts++;
      }
    }
  }
  console.log(enzymeReverse);
  for(var i = 0; i < enzymeReverse.length; i++){
    for(var j = 1; j < enzymeReverse[i].length; j++){
      if(enzymeReverse[i][0] === enzymeName){
        console.log(enzymeReverse[i][j]);
        if(enzymeReverse[i][j] === "reversible"){
          console.log("HERE");
          isReversible = true;
          reversibleChoice[0].checked = true;
        }else{
          isReversible = false;
          reversibleChoice[1].checked = true;
        }
      }
    }
  }
}

function testClickSaveBtn(click){
  if(click === "click"){
    //saveBtn.style.background = '#4CAF50'
    return false;
  }else{
    //saveBtn.style.background = '#000000';
    return true;
  }
}

// Clear button function to uncheck all boxes if clicked
function clearAll(){
    countProducts = 0;
    countSubstrates = 0;
    checkedSubsNames = [];
    checkedProdsNames = [];
    checkedEnzsNames = []

    for(var i = 0; i < substrates.length; i++){
      if(substrates[i].checked){
        substrates[i].checked = false
      }
    }
    for(var j = 0; j < enzymes.length; j++){
      if(enzymes[j].checked){
        enzymes[j].checked = false
      }
    }
    for(var k = 0; k < products.length; k++){
      if(products[k].checked){
        products[k].checked = false
      }
    }
}

function validateReaction(){
  //iterate through user selections and create string representation
  //this is done so that if it is a complete reaction (something from
  //every categor is chosen) it can easily be compared to the known
  //reactions
  for(var i = 0; i < checkedSubsNames.length; i++){
    if(i === checkedSubsNames.length - 1){
      currentRxn = currentRxn + checkedSubsNames[i] + ">";
    }else {
      currentRxn = currentRxn + checkedSubsNames[i] + "+";
    }
  }

  for(var j = 0; j < checkedEnzsNames.length; j++){
    currentRxn = currentRxn + checkedEnzsNames[j] + "<";
  }

  for(var k = 0; k < checkedProdsNames.length; k++){
    currentRxn = currentRxn + checkedProdsNames[k];
    if(checkedProdsNames.length > k + 1){
      currentRxn = currentRxn + "+";
    }
  }
  currentRxn = currentRxn + ";" + isReversible;
  console.log("THE CURRENT REACTION ***" + currentRxn + "*******");

  if(countProducts > 5 || countSubstrates > 5 || checkedEnzsNames.length === 0 ){
    //settings are invalid, user is limited to 5 products and 5 substrates and an
    //enzyme must be selected
    console.log("INVALID");
    ctx.fillStyle = "tomato";
    ctx.fillRect(0, 0, canvas1.width, canvas1.height);

    return false;

  }else if(countSubstrates === 0 && countProducts === 0){
    setReaction(enzymeSubs, enzymeProds, enzymeReverse); //the user has only selected the enzyme so fill in reaction
    ctx.fillStyle = "limegreen";//reaction will be correct so set to green
    ctx.fillRect(0, 0, canvas1.width, canvas1.height);

  }else if(countSubstrates === 0 || countProducts === 0){
    //settings are invalid, cannot have selected some products and
    //no substrates or some substrates and no products
    console.log("INVALID");
    ctx.fillStyle = "tomato";
    ctx.fillRect(0, 0, canvas1.width, canvas1.height);

    return false;

  }else if(step1 === currentRxn || step2 === currentRxn || step3 === currentRxn || step4 === currentRxn
        || step5 === currentRxn || step6 === currentRxn || step7 === currentRxn || step8 === currentRxn
        || step9 === currentRxn || step10 === currentRxn){
    //Reaction is valid
    ctx.fillStyle = "limegreen";
    ctx.fillRect(0, 0, canvas1.width, canvas1.height);

  }else{
    //reaction is invalid, but still want to display reaction
    ctx.fillStyle = "tomato";
    ctx.fillRect(0, 0, canvas1.width, canvas1.height);
  }
  //set fillStyle back to black
  ctx.fillStyle = "black";
  return true;
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
  saveBtn = document.getElementById("saveReaction");
  clearBtn = document.getElementById("clearReaction");
  weightSliderValue = document.getElementById('weightSliderValue');
  submitWeightBtn = document.getElementById('submitWeight');
  weightSlider = document.getElementById('weightSlider');
  modal = document.getElementById('invalidModal');
  var span = document.getElementsByClassName("close")[0];
  var saveBtnClicked = false;

  createBtn.addEventListener("click", function(event){
    //reset global variables
    currentRxn = "";

    //clear everything out of canvas on button click so we can draw new rxn
    ctx.clearRect(0, 0, canvas1.width, canvas1.height);
    //calling beginPath here preps canvas for drawing
    ctx.beginPath();
    ctx.lineWidth = 3;

    //validate that settings are good, reaction created is good or bad
    var continueDisplay = validateReaction();

    //the settings are valid so display as usual
    if(continueDisplay){
      console.log("IS REVERSIBLE:" + isReversible);
      displayReaction();
    }else{
      modal.style.display = "block";
      ctx.clearRect(0, 0, canvas1.width, canvas1.height);
    }

  });

  saveBtn.addEventListener("click", function(event){
    //if(saveBtnClicked){
      //saveBtn.style.background = '#4CAF50'
      //saveBtnClicked = false;
      document.location.href = 'modelEdit';
    //}else{
    //  saveBtn.style.background = '#000000';
    //  saveBtnClicked = true;
    //}
  });



  clearBtn.addEventListener("click", function(event){
    //reset global variables
    currentRxn = "";

    //clear everything out of canvas on button click so we can draw new rxn
    ctx.clearRect(0, 0, canvas1.width, canvas1.height);

    //calling beginPath here preps canvas for drawing
    ctx.beginPath();

    clearAll();
  });

  //exit out of invalidModal when x is clicked
  span.addEventListener("click", function(event) {
    modal.style.display = "none";
  });

  document.getElementById("logout").addEventListener("click", function(event) {
    document.location.href = '..';
  });

  //exit out of invalidModal when area outside of modal is clicked
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }

//not currently important
  // canvas1.addEventListener("click", function (event) {
  //     let mousePosition = getMousePosition(canvas1, event);
  //     let rectNum = (Math.floor(mousePosition.x / 100) + Math.floor(mousePosition.y / objectWidth) * 8) - 15;
  //     let rectClicked = document.getElementById("rectClicked");
  // });

//button to submit value entered in weight value text box
//and set slider accordingly
 //  submitWeightBtn.addEventListener("click", function(event) {
 //    var val = weightSliderValue.value;
 //    //verify that value entered is valid and within range
 //    if(val >= -1.0 && val <= 1.0){
 //      weightSlider.value=val;
 //    }else{
 //      weightSliderValue.value=0.0;
 //      weightSlider.value = 0.0;
 //    }
 // });
}
function main () {
}
main()

// module.exports = {};
// module.exports.testClickSaveBtn = testClickSaveBtn;
// module.exports.setReaction = setReaction;
// module.exports.setInitialXCoor = setInitialXCoor;
