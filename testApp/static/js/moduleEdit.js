"use strict";

var checkedProdsEnzsSubs = [];
var checkedProdsEnzsSubsNames = [];
var canvas1;
var substrates;
var enzymes;
var products;
var ctx;
var image;
var createBtn;
var objectWidth = 125;
var objectHeight = 125;
var objectBuffer = 10;
//check which radio buttons are clicked
function onRadioChange(){
  checkedProdsEnzsSubs = [];
  checkedProdsEnzsSubsNames = [];
  for(var i = 0; i < substrates.length; i++){
    if(substrates[i].checked){
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
      checkedProdsEnzsSubs.push(products[k].name);
      checkedProdsEnzsSubsNames.push(products[k].value);
    }
  }
}

function getMousePosition(canvas1, event) {
    let border = canvas1.getBoundingClientRect();
    return {
        x: event.clientX - border.left,
        y: event.clientY - border.top
    };
}

function displayImage(xcoor, ycoor, name){
  var img = document.getElementById(name);
  ctx.drawImage(img, xcoor, ycoor, objectWidth, objectHeight);
}

function drawObject(count, type, xcoor, ycoor, name){
  if(type === "substrate" || type === "product"){
    displayImage(xcoor, ycoor, name);
    ctx.moveTo(xcoor,ycoor);
    ctx.lineTo(xcoor + objectWidth, ycoor);
    ctx.lineTo(xcoor + objectWidth, ycoor + objectHeight);
    ctx.lineTo(xcoor, ycoor + objectHeight);
    ctx.lineTo(xcoor, ycoor);
    ctx.stroke();
    ctx.font = "12px Arial";
    ctx.fillText(name, xcoor, ycoor + objectHeight + objectBuffer);
  }else if (type === "enzyme"){
    ctx.font = "12px Arial";
    ctx.fillText(name, xcoor, ycoor + objectHeight / 2 + objectBuffer);
  }else{
  }
}

function drawArrow(xcoor, ycoor){
  ycoor = ycoor + objectHeight / 2;
  ctx.moveTo(xcoor, ycoor);
  ctx.lineTo(xcoor + objectWidth, ycoor);
  ctx.lineTo(xcoor + objectWidth - (objectWidth / 4), ycoor - (objectHeight / 4));
  ctx.lineTo(xcoor + objectWidth - (objectWidth / 4), ycoor + (objectHeight / 4));
  ctx.lineTo(xcoor + objectWidth, ycoor);
  ctx.stroke();
}

function drawPlus(xcoor, ycoor){
  xcoor = xcoor + objectWidth + objectBuffer;
  ycoor = ycoor + objectHeight / 2;
  ctx.moveTo(xcoor, ycoor);
  ctx.lineTo(xcoor, ycoor - objectBuffer);
  ctx.moveTo(xcoor - 5, ycoor - 5);
  ctx.lineTo(xcoor + 5, ycoor - 5);
  ctx.stroke();
}

function displayReaction(){
  var name;
  console.log("DISPLAY REACTION CALLED");
  console.log(checkedProdsEnzsSubs);
  var currentX = objectBuffer;
  var currentY = objectBuffer;
  for(var a = 0; a < checkedProdsEnzsSubs.length; a++){
    name = checkedProdsEnzsSubsNames[a];
    if(a > 0 && a % 5 === 0){
      currentX = objectBuffer;
      currentY = currentY + objectHeight + objectBuffer * 2;
    }
    var currentObject = checkedProdsEnzsSubs[a];
    if(currentObject === "Substrate"){
      drawObject(a, "substrate", currentX, currentY, name);
      if(checkedProdsEnzsSubs.length - 1 > a){
        if(checkedProdsEnzsSubs[a+1] === "Enzyme"){
          currentX = currentX + objectWidth + objectBuffer * 2;
          drawArrow(currentX, currentY);
        }else{
          drawPlus(currentX, currentY);
          currentX = currentX + objectWidth + objectBuffer * 2;
        }
      }
    }else if(currentObject === "Enzyme"){
      drawObject(a, "enzyme", currentX, currentY, name);
      console.log(currentObject);
      if(checkedProdsEnzsSubs.length - 1 > a){
        if(checkedProdsEnzsSubs[a+1] === "Product"){
          currentX = currentX + objectWidth + objectBuffer * 2;
        }
      }
    }else{
      drawObject(a, "product", currentX, currentY, name);
      if(checkedProdsEnzsSubs.length - 1 > a){
        drawPlus(currentX, currentY);
      }
      currentX = currentX + objectWidth + objectBuffer * 2;
      console.log(currentObject);
    }
  }
}

window.onload = function init(){
  canvas1 = document.getElementById("imageCanvas");
  substrates  = document.getElementsByName('Substrate');
  enzymes = document.getElementsByName('Enzyme');
  products = document.getElementsByName('Product');
  ctx  = canvas1.getContext("2d");
  image  = document.getElementById("step1");
  createBtn = document.getElementById("createReaction");

  createBtn.addEventListener("click", function(event){
    ctx.clearRect(0, 0, canvas1.width, canvas1.height);
    ctx.beginPath();
    console.log("button clicked");//show reaction
    console.log(checkedProdsEnzsSubs);
    displayReaction();
  });

  canvas1.addEventListener("click", function (event) {
      let mousePosition = getMousePosition(canvas1, event);
      let rectNum = (Math.floor(mousePosition.x / 100) + Math.floor(mousePosition.y / objectWidth) * 8) - 15;
      let rectClicked = document.getElementById("rectClicked");
      console.log("CLICK");
  });
}
function main () {
}
main()
