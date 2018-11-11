"use strict";

var checkedProdsEnzsSubs = [];
var canvas1;
var radios;
var ctx;
var image;
var createBtn;
var objectWidth = 100;
var objectHeight = 100;
//check which radio buttons are clicked
function onRadioChange(){
  checkedProdsEnzsSubs = [];
  for(var i = 0; i < radios.length; i++){
    if(radios[i].checked){
      checkedProdsEnzsSubs.push(radios[i].value);
    }
  }
  console.log(radios.length);
  console.log(checkedProdsEnzsSubs);
}

function getMousePosition(canvas1, event) {
    let border = canvas1.getBoundingClientRect();
    return {
        x: event.clientX - border.left,
        y: event.clientY - border.top
    };
}

function displayImage(){
  console.log("FUNCTION CALLED");
  displayReaction();
}


function drawObject(count, type, xcoor, ycoor){
  if(type === "substrate" || type === "product"){
    ctx.moveTo(xcoor,ycoor);
    ctx.lineTo(xcoor + objectWidth, ycoor);
    ctx.lineTo(xcoor + objectWidth, ycoor + objectHeight);
    ctx.lineTo(xcoor, ycoor + objectHeight);
    ctx.lineTo(xcoor, ycoor);
    ctx.stroke();
  }else if (type === "enzyme"){
    ycoor = ycoor + objectHeight / 2;
    ctx.moveTo(xcoor, ycoor);
    ctx.lineTo(xcoor + objectWidth, ycoor);
    ctx.lineTo(xcoor + objectWidth - (objectWidth / 4), ycoor - (objectHeight / 4));
    ctx.lineTo(xcoor + objectWidth - (objectWidth / 4), ycoor + (objectHeight / 4));
    ctx.lineTo(xcoor + objectWidth, ycoor);
    ctx.stroke();
  }else{

  }
}

function drawPlus(xcoor, ycoor){
  xcoor = xcoor + objectWidth + 10;
  ycoor = ycoor + objectHeight / 2;
  ctx.moveTo(xcoor, ycoor);
  ctx.lineTo(xcoor, ycoor - 10);
  ctx.moveTo(xcoor - 5, ycoor - 5);
  ctx.lineTo(xcoor + 5, ycoor - 5);
}
//width of enzyme, substrate, product is objectWidth
//width of + is 10
function displayReaction(){
  ctx.clearRect(0, 0, canvas1.width, canvas1.height);
  console.log("DISPLAY REACTION CALLED");
  console.log(checkedProdsEnzsSubs);
  var currentX = 10;
  var currentY = 10;
  for(var a = 0; a < checkedProdsEnzsSubs.length; a++){
    var currentObject = checkedProdsEnzsSubs[a];
    if(currentObject < 9){
      drawObject(a, "substrate", currentX, currentY);
      if(checkedProdsEnzsSubs[a+1] < 9){
        drawPlus(currentX, currentY);
      }
      currentX = currentX + 120;
      console.log(currentObject);
    }else if(currentObject < 17){
      drawObject(a, "enzyme", currentX, currentY);
      currentX = currentX + 120;
      console.log(currentObject);
    }else{
      drawObject(a, "product", currentX, currentY);
      if(checkedProdsEnzsSubs.length - 1 > a){
        drawPlus(currentX, currentY);
      }
      currentX = currentX + 120;
      console.log(currentObject);
    }
  }
}

window.onload = function init(){
  canvas1 = document.getElementById("imageCanvas");
  radios  = document.getElementsByTagName('input');
  ctx  = canvas1.getContext("2d");
  image  = document.getElementById("step1");
  createBtn = document.getElementById("createReaction");

  createBtn.addEventListener("click", function(event){
    console.log("button clicked");//show reaction
    console.log(checkedProdsEnzsSubs);
    displayImage();
  });

  canvas1.addEventListener("click", function (event) {
      let mousePosition = getMousePosition(canvas1, event);
      let rectNum = (Math.floor(mousePosition.x / 100) + Math.floor(mousePosition.y / objectWidth) * 8) - 15;
      let rectClicked = document.getElementById("rectClicked");
      console.log("CLICK");
      //TODO: link to model page and remember rectangle number
  });
}

function main () {

  // set1.forEach(function(elem){
  //   elem.addEventListener("change", function(){
  //     if(this.checked) {
  //         console.log("CHECKED");
  //     } else {
  //         console.log("UNCHECKED");
  //     }
  //   });
  //   console.log("running");
  // });
  // set2.forEach(function(elem){
  // elem.addEventListener("change", function(){
  //   if(this.checked) {
  //       console.log("CHECKED");
  //       //displayImage();
  //   } else {
  //       console.log("UNCHECKED");
  //   }
  // });
  // console.log("running");
  // });
  // set3.forEach(function(elem){
  //   elem.addEventListener("change", function(){
  //     if(this.checked) {
  //         console.log("CHECKED");
  //         //displayImage();
  //     } else {
  //         console.log("UNCHECKED");
  //     }
  //   });
  //   console.log("running");
  // });

    // sub1.addEventListener("change", function(){
    //   if(this.checked) {
    //       // Checkbox is checked..
    //       //displayImage();
    //       console.log("CHECKED");
    //       checkedProdsEnzsSubs.push()
    //   } else {
    //       // Checkbox is not checked..
    //       console.log("UNCHECKED");
    //       ctx.clearRect(0,0, canvas1.width, canvas1.height);
    //   }
    // });
    //
    // sub2.addEventListener("change", function(){
    //   if(this.checked) {
    //       // Checkbox is checked..
    //       displayImage();
    //       console.log("CHECKED");
    //   } else {
    //       // Checkbox is not checked..
    //       console.log("UNCHECKED");
    //   }
    // });
    //
    // sub3.addEventListener("change", function(){
    //   if(this.checked) {
    //       // Checkbox is checked..
    //       displayImage();
    //       console.log("CHECKED");
    //   } else {
    //       // Checkbox is not checked..
    //       console.log("UNCHECKED");
    //   }
    // });
    // sub4.addEventListener("change", function(){
    //   if(this.checked) {
    //       // Checkbox is checked..
    //       displayImage();
    //       console.log("CHECKED");
    //   } else {
    //       // Checkbox is not checked..
    //       console.log("UNCHECKED");
    //   }
    // });
    // sub5.addEventListener("change", function(){
    //   if(this.checked) {
    //       // Checkbox is checked..
    //       displayImage();
    //       console.log("CHECKED");
    //   } else {
    //       // Checkbox is not checked..
    //       console.log("UNCHECKED");
    //   }
    // });
    // sub6.addEventListener("change", function(){
    //   if(this.checked) {
    //       // Checkbox is checked..
    //       displayImage();
    //       console.log("CHECKED");
    //   } else {
    //       // Checkbox is not checked..
    //       console.log("UNCHECKED");
    //   }
    // });
    // sub7.addEventListener("change", function(){
    //   if(this.checked) {
    //       // Checkbox is checked..
    //       displayImage();
    //       console.log("CHECKED");
    //   } else {
    //       // Checkbox is not checked..
    //       console.log("UNCHECKED");
    //   }
    // });
    // sub8.addEventListener("change", function(){
    //   if(this.checked) {
    //       // Checkbox is checked..
    //       displayImage();
    //       console.log("CHECKED");
    //   } else {
    //       // Checkbox is not checked..
    //       console.log("UNCHECKED");
    //   }
    // });
    // prod1.addEventListener("change", function(){
    //   if(this.checked) {
    //       // Checkbox is checked..
    //       displayImage();
    //       console.log("CHECKED");
    //   } else {
    //       // Checkbox is not checked..
    //       console.log("UNCHECKED");
    //   }
    // });
    // prod2.addEventListener("change", function(){
    //   if(this.checked) {
    //       // Checkbox is checked..
    //       displayImage();
    //       console.log("CHECKED");
    //   } else {
    //       // Checkbox is not checked..
    //       console.log("UNCHECKED");
    //   }
    // });
    // prod3.addEventListener("change", function(){
    //   if(this.checked) {
    //       // Checkbox is checked..
    //       displayImage();
    //       console.log("CHECKED");
    //   } else {
    //       // Checkbox is not checked..
    //       console.log("UNCHECKED");
    //   }
    // });
    // prod4.addEventListener("change", function(){
    //   if(this.checked) {
    //       // Checkbox is checked..
    //       displayImage();
    //       console.log("CHECKED");
    //   } else {
    //       // Checkbox is not checked..
    //       console.log("UNCHECKED");
    //   }
    // });
    // prod5.addEventListener("change", function(){
    //   if(this.checked) {
    //       // Checkbox is checked..
    //       displayImage();
    //       console.log("CHECKED");
    //   } else {
    //       // Checkbox is not checked..
    //       console.log("UNCHECKED");
    //   }
    // });
    // prod6.addEventListener("change", function(){
    //   if(this.checked) {
    //       // Checkbox is checked..
    //       displayImage();
    //       console.log("CHECKED");
    //   } else {
    //       // Checkbox is not checked..
    //       console.log("UNCHECKED");
    //   }
    // });
    // prod7.addEventListener("change", function(){
    //   if(this.checked) {
    //       // Checkbox is checked..
    //       displayImage();
    //       console.log("CHECKED");
    //   } else {
    //       // Checkbox is not checked..
    //       console.log("UNCHECKED");
    //   }
    // });
    // prod8.addEventListener("change", function(){
    //   if(this.checked) {
    //       // Checkbox is checked..
    //       displayImage();
    //       console.log("CHECKED");
    //   } else {
    //       // Checkbox is not checked..
    //       console.log("UNCHECKED");
    //   }
    // });
    // enz1.addEventListener("change", function(){
    //   if(this.checked) {
    //       // Checkbox is checked..
    //       displayImage();
    //       console.log("CHECKED");
    //   } else {
    //       // Checkbox is not checked..
    //       console.log("UNCHECKED");
    //   }
    // });
    // enz2.addEventListener("change", function(){
    //   if(this.checked) {
    //       // Checkbox is checked..
    //       displayImage();
    //       console.log("CHECKED");
    //   } else {
    //       // Checkbox is not checked..
    //       console.log("UNCHECKED");
    //   }
    // });
    // enz3.addEventListener("change", function(){
    //   if(this.checked) {
    //       // Checkbox is checked..
    //       displayImage();
    //       console.log("CHECKED");
    //   } else {
    //       // Checkbox is not checked..
    //       console.log("UNCHECKED");
    //   }
    // });
    // enz4.addEventListener("change", function(){
    //   if(this.checked) {
    //       // Checkbox is checked..
    //       displayImage();
    //       console.log("CHECKED");
    //   } else {
    //       // Checkbox is not checked..
    //       console.log("UNCHECKED");
    //   }
    // });
    // enz5.addEventListener("change", function(){
    //   if(this.checked) {
    //       // Checkbox is checked..
    //       displayImage();
    //       console.log("CHECKED");
    //   } else {
    //       // Checkbox is not checked..
    //       console.log("UNCHECKED");
    //   }
    // });
    // enz6.addEventListener("change", function(){
    //   if(this.checked) {
    //       // Checkbox is checked..
    //       displayImage();
    //       console.log("CHECKED");
    //   } else {
    //       // Checkbox is not checked..
    //       console.log("UNCHECKED");
    //   }
    // });
    // enz7.addEventListener("change", function(){
    //   if(this.checked) {
    //       // Checkbox is checked..
    //       displayImage();
    //       console.log("CHECKED");
    //   } else {
    //       // Checkbox is not checked..
    //       console.log("UNCHECKED");
    //   }
    // });
    // enz8.addEventListener("change", function(){
    //   if(this.checked) {
    //       // Checkbox is checked..
    //       displayImage();
    //       console.log("CHECKED");
    //   } else {
    //       // Checkbox is not checked..
    //       console.log("UNCHECKED");
    //   }
    // });
    // var sub1 = document.querySelector("input[name=sub1]");
    // var sub2 = document.querySelector("input[name=sub2]");
    // var sub3 = document.querySelector("input[name=sub3]");
    // var sub4 = document.querySelector("input[name=sub4]");
    // var sub5 = document.querySelector("input[name=sub5]");
    // var sub6 = document.querySelector("input[name=sub6]");
    // var sub7 = document.querySelector("input[name=sub7]");
    // var sub8 = document.querySelector("input[name=sub8]");
    // var prod1 = document.querySelector("input[name=prod1]");
    // var prod2 = document.querySelector("input[name=prod2]");
    // var prod3 = document.querySelector("input[name=prod3]");
    // var prod4 = document.querySelector("input[name=prod4]");
    // var prod5 = document.querySelector("input[name=prod5]");
    // var prod6 = document.querySelector("input[name=prod6]");
    // var prod7 = document.querySelector("input[name=prod7]");
    // var prod8 = document.querySelector("input[name=prod8]");
    // var enz1 = document.querySelector("input[name=enz1]");
    // var enz2 = document.querySelector("input[name=enz2]");
    // var enz3 = document.querySelector("input[name=enz3]");
    // var enz4 = document.querySelector("input[name=enz4]");
    // var enz5 = document.querySelector("input[name=enz5]");
    // var enz6 = document.querySelector("input[name=enz6]");
    // var enz7 = document.querySelector("input[name=enz7]");
    // var enz8 = document.querySelector("input[name=enz8]");

}
main()
