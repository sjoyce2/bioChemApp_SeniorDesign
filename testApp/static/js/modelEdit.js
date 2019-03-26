'use strict'

var firstRectMidX;
var firstRectMidY;

var canvas = document.getElementById("modelEditCanvas");
var modelDiv = document.getElementById("modelEditDiv");
var divWidth = window.getComputedStyle(modelDiv, null).width;
var context = canvas.getContext('2d');
var dragging = false;
var lastX;
var lastY;
var marginLeft = -(divWidth/2 - canvas.width/2);
var marginTop = 0;
var positionChange = 2;

// Instead of these, we need a list of enzymes and a corresponding 2d list
// for products and another for substrates
var enzymeList = [];
var substrateList = [];
var productList = [];
var revList = [];
var xCoords = [];
var yCoords = [];
var dotPositions = []; //For each module, the (x, y) position of the "dot" representing the flow
var directions = [];
var prodSubValues = [];
var rxnDir = [];
var kValues = [];
var highlightRects = []; //For each rectangular outline: [x, y, width, height, visible]
var db_modules = JSON.parse(document.getElementById('db-modules').textContent);
var db_substrates = JSON.parse(document.getElementById('db-substrates').textContent);
var db_products = JSON.parse(document.getElementById('db-products').textContent);
var modelNum = parseInt(document.getElementById('modelNum').textContent);

canvas.addEventListener('mousedown', function(e) {
    var evt = e || event;
    dragging = true;
    lastX = evt.clientX;
    lastY = evt.clientY;
    e.preventDefault();
}, false);

window.addEventListener('mousemove', function(e) {
    var evt = e || event;
    if (dragging) {
        var delta = evt.clientX - lastX;
        var deltaY = evt.clientY - lastY;
        lastX = evt.clientX;
        lastY = evt.clientY;
        marginLeft += delta;
        marginTop += deltaY;
        marginLeft = marginLeft;
        marginTop = Math.min(marginTop, 0);
        var marginBot = Math.max(marginBot, window.getComputedStyle(modelDiv, null).height);
        canvas.style.marginLeft = marginLeft + "px";
        canvas.style.marginTop = marginTop + "px";
        canvas.style.marginBottom = marginBot + "px";
    }
    e.preventDefault();
}, false);

window.addEventListener('mouseup', function() {
    dragging = false;
}, false);

//Create a non-reversible reaction
function notRevStep(substrate, product, enzyme,
    firstRectMidX, firstRectMidY, ctx) {
	//create starting protein
    ctx.rect(firstRectMidX - 100, firstRectMidY - 25, 100, 50);

	//create arrow to second protein
    ctx.moveTo(firstRectMidX, firstRectMidY);
       ctx.arcTo(firstRectMidX + 50, firstRectMidY,
        firstRectMidX + 50, firstRectMidY + 50, 50);
    ctx.arcTo(firstRectMidX + 50, firstRectMidY + 100,
        firstRectMidX, firstRectMidY + 100, 50);
    ctx.lineTo(firstRectMidX + 10, firstRectMidY + 90);
    ctx.moveTo(firstRectMidX + 10, firstRectMidY + 110);
    ctx.lineTo(firstRectMidX, firstRectMidY + 100);

	//create second protein
    ctx.rect(firstRectMidX - 100, firstRectMidY + 75, 100, 50);

	//create arrow for other substrates (inputs) into the reaction (such as ATP)
    ctx.moveTo(firstRectMidX + 100, firstRectMidY);
    ctx.arcTo(firstRectMidX + 50, firstRectMidY,
        firstRectMidX + 50, firstRectMidY + 50, 50);
    ctx.arcTo(firstRectMidX + 50, firstRectMidY + 100,
        firstRectMidX + 100, firstRectMidY + 100, 50);
    ctx.lineTo(firstRectMidX + 90, firstRectMidY + 90);
    ctx.moveTo(firstRectMidX + 90, firstRectMidY + 110);
    ctx.lineTo(firstRectMidX + 100, firstRectMidY + 100);
    ctx.fillStyle = "black";
    ctx.stroke();

    //create enzyme at center of reaction
    ctx.beginPath();
    ctx.font = "12px Arial";
    var fontMeasures = ctx.measureText(enzyme);
    var xCoord = firstRectMidX + 45 - (fontMeasures.width / 2);
    ctx.moveTo(xCoord, firstRectMidY + 50);
    ctx.bezierCurveTo(
        xCoord, firstRectMidY + 30,
        xCoord + fontMeasures.width + 10, firstRectMidY + 30,
        xCoord + fontMeasures.width + 10, firstRectMidY + 50);
    ctx.bezierCurveTo(
        xCoord + fontMeasures.width + 10, firstRectMidY + 70,
        xCoord, firstRectMidY + 70,
        xCoord, firstRectMidY + 50);
    ctx.fillStyle = "white";
	ctx.fill();

    //Label the proteins(rectangles) and enzyme(oval)
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText(substrate, firstRectMidX - 90, firstRectMidY + 5);
    ctx.fillText(product, firstRectMidX - 90, firstRectMidY + 105);
    ctx.font = "12px Arial";
    ctx.fillText(enzyme, firstRectMidX + 50 - fontMeasures.width / 2,
        firstRectMidY + 54);
    ctx.fillText("ATP", firstRectMidX + 110, firstRectMidY + 5);
    ctx.fillText("ADP", firstRectMidX + 110, firstRectMidY + 105);
    ctx.stroke();
}

//create a reversible reaction
function revStep(firstText, secondText, enzyme, firstRectMidX, firstRectMidY, 
        nextX, nextY, ctx) {
    //create first protein
    ctx.font = "20px Arial";
    //color = yourFunction(max)
    ctx.rect(firstRectMidX - 100, firstRectMidY - 25, 100, 50);
    //draw arrows between proteins
    if (nextX) {
        if (nextX === firstRectMidX) { //reactions are formatted normally
            ctx.moveTo(firstRectMidX - 65, firstRectMidY + 35);
            ctx.lineTo(firstRectMidX - 55, firstRectMidY + 25);
            ctx.lineTo(firstRectMidX - 55, firstRectMidY + 75);
            ctx.moveTo(firstRectMidX - 45, firstRectMidY + 25);
            ctx.lineTo(firstRectMidX - 45, firstRectMidY + 75);
            ctx.lineTo(firstRectMidX - 35, firstRectMidY + 65);
            ctx.fillStyle = "black";
            //create second protein
            ctx.rect(firstRectMidX - 100, firstRectMidY + 75, 100, 50);
            ctx.stroke();
        } else {
            if (nextY === firstRectMidY) { //reactions horizontally connected
                ctx.moveTo(firstRectMidX + 10, firstRectMidY - 15);
                ctx.lineTo(firstRectMidX, firstRectMidY - 5);
                ctx.lineTo(firstRectMidX + 50, firstRectMidY - 5);
                ctx.moveTo(firstRectMidX, firstRectMidY + 5);
                ctx.lineTo(firstRectMidX + 50, firstRectMidY + 5);
                ctx.lineTo(firstRectMidX + 40, firstRectMidY + 15);
                ctx.rect(firstRectMidX + 50, firstRectMidY - 25, 100, 50);
                ctx.stroke();
            } else { //reactions diagonally connected
                ctx.moveTo(firstRectMidX - 55, firstRectMidY + 25);
                ctx.lineTo(firstRectMidX - 55, firstRectMidY + 50);
                ctx.lineTo(firstRectMidX - 130, firstRectMidY + 75);
                ctx.moveTo(firstRectMidX - 55, firstRectMidY + 50);
                ctx.lineTo(firstRectMidX + 20, firstRectMidY + 75);
                ctx.moveTo(firstRectMidX - 45, firstRectMidY + 25);
                ctx.lineTo(firstRectMidX - 45, firstRectMidY + 50);
                ctx.lineTo(firstRectMidX - 120, firstRectMidY + 75);
                ctx.moveTo(firstRectMidX - 45, firstRectMidY + 50);
                ctx.lineTo(firstRectMidX + 30, firstRectMidY + 75);
                ctx.stroke();
                ctx.rect(firstRectMidX - 175, firstRectMidY + 75, 100, 50);
                ctx.rect(firstRectMidX - 25, firstRectMidY + 75, 100, 50);
                ctx.stroke();
            }
        }
    }
    //Enzyme
    ctx.beginPath();
    ctx.font = "12px Arial";
    var fontMeasures = ctx.measureText(enzyme);

    var xCoord;
    var yCoord;
    if (nextX && (nextY === firstRectMidY)) {
        xCoord = firstRectMidX + 20 - (fontMeasures.width / 2);
        yCoord = firstRectMidY;
    } else {
        xCoord = firstRectMidX - 55 - (fontMeasures.width / 2);
        yCoord = firstRectMidY + 50;
    }
    ctx.moveTo(xCoord, yCoord);
    ctx.bezierCurveTo(
        xCoord, yCoord - 20,
        xCoord + fontMeasures.width + 10, yCoord - 20,
        xCoord + fontMeasures.width + 10, yCoord);
    ctx.bezierCurveTo(
        xCoord + fontMeasures.width + 10, yCoord + 20,
        xCoord, yCoord + 20,
        xCoord, yCoord);
    ctx.fillStyle = "white";
    ctx.fill();

    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    //add label to first protein
    ctx.fillText(firstText, firstRectMidX - 90, firstRectMidY + 5);
    if (!nextY) {
        //add label to second protein
        ctx.fillText(secondText, firstRectMidX - 90, firstRectMidY + 105);
    }
    ctx.font = "12px Arial";
    ctx.fillText(enzyme, xCoord + 5, yCoord + 4);
    //draw everything to the screen
    ctx.stroke();
}

// Calculates the x-value of a point on a circle (of radius 50) given the y value
function calculateX(y, centerX, centerY) {
    var x;
    x = centerX + Math.sqrt(-1 * Math.pow((y - centerY), 2) + 2500);
    if (Number.isNaN(x)) {
        return centerX + 50;
    } else {
        return x;
    }
}

function checkRatio(moduleNumber) {
    //var q = prodSubValues[0] / prodSubValues[1];
    // test value for q: TODO: Fix so i don't need test value
    var k = kValues[moduleNumber];
    var q = k - 0.1;
    if (q/k > 1.0) {
        rxnDir[moduleNumber] = -1;
    } else if (q/k < 1.0) {
        rxnDir[moduleNumber] = 1;
    } else {
        rxnDir[moduleNumber] = 0;
    }
}

//Calculate the x value of the molecule in the reaction. The height
//changes by a consistent value each time but the horizontal
//position can change if it is following a non-reversible reaction
//TODO: allow sliders to control speed of irreversible reaction
function getDotPos(moduleNumber) {
    //find whether module is reversible
    //find module start and end positions
    //if irreversible:
        //semicircular path
    //else:
        //if startX == endX:
            //vertical path
        //else:
            //if startY == endY:
                //horizontal path
            //else:
                //weird path
    var startX = xCoords[moduleNumber];
    var startY = yCoords[moduleNumber];
    var endX;
    var endY;
    var x;
    var y;
    if (moduleNumber === xCoords.length - 1) {
        endX = xCoords[moduleNumber];
        endY = yCoords[moduleNumber] + 1;
    } else {
        endX = xCoords[moduleNumber + 1];
        endY = yCoords[moduleNumber + 1];
    }
    var revMod = revList[moduleNumber];
    checkRatio(moduleNumber);
    if (revMod === "irreversible") {
        if (dotPositions[moduleNumber][0] <= (startX * 75 + canvas.clientWidth / 2 + 50)) {
            if (dotPositions[moduleNumber][1] === startY * 100) {
                dotPositions[moduleNumber][0] += directions[moduleNumber] * positionChange;
            } else {
                dotPositions[moduleNumber][0] -= directions[moduleNumber] * positionChange;
            }
        } else {
            dotPositions[moduleNumber][1] += directions[moduleNumber] * positionChange;
            dotPositions[moduleNumber][0] = calculateX(dotPositions[moduleNumber][1],
                (startX * 75 + canvas.clientWidth / 2 + 50), startY * 100 + 50);
        }
        if (dotPositions[moduleNumber][1] >= endY * 100 && dotPositions[moduleNumber][0] < 
            (endX * 75) + canvas.clientWidth / 2) { //if reaches end of reaction
            dotPositions[moduleNumber] = [startX*75+canvas.clientWidth/2, startY*100];
            if (rxnDir[moduleNumber] != 1) {
                directions[moduleNumber] = 0;
            }
            prodSubValues[moduleNumber][0] ++;
            prodSubValues[moduleNumber][1] --;
            if (prodSubValues < 1) {
                prodSubValues = 1;
            }
            if (moduleNumber != prodSubValues.length - 1) {
                prodSubValues[moduleNumber + 1][1] ++;
            }
        }
    } else {
        if (startX === endX) { //vertical
            dotPositions[moduleNumber][1] += directions[moduleNumber] * positionChange;
            if (dotPositions[moduleNumber][1] >= endY * 100) {
                if (rxnDir[moduleNumber] === 0 || rxnDir[moduleNumber] === -1) {
                    directions[moduleNumber] = -1;
                } else {
                    dotPositions[moduleNumber][0] = startX * 75 + canvas.clientWidth / 2;
                    dotPositions[moduleNumber][1] = startY * 100;
                    directions[moduleNumber] = 1;
                }
                prodSubValues[moduleNumber][0] ++;
                prodSubValues[moduleNumber][1] --;
                if (prodSubValues[moduleNumber][1] < 1) {
                    prodSubValues[moduleNumber][1] = 1;
                }
                if (moduleNumber != prodSubValues.length - 1) {
                    prodSubValues[moduleNumber + 1][1] ++;
                }
            } else if (dotPositions[moduleNumber][1] <= startY * 100) {
                if (rxnDir[moduleNumber] === 0 || rxnDir[moduleNumber] === 1) {
                    directions[moduleNumber] = 1;
                } else {
                    dotPositions[moduleNumber][0] = endX * 75 + canvas.clientWidth / 2;
                    dotPositions[moduleNumber][1] = endY * 100;
                    directions[moduleNumber] = -1;
                }
                prodSubValues[moduleNumber][0] --;
                prodSubValues[moduleNumber][1] ++;
                if (prodSubValues[moduleNumber][0] < 1) {
                    prodSubValues[moduleNumber][0] = 1;
                }
                if (moduleNumber != 0) {
                    prodSubValues[moduleNumber + 1][0] ++;
                }
            }
        } else {
            if (startY === endY) { //horizontal
                var currPosChange = (3/2) * positionChange
                dotPositions[moduleNumber][0] += directions[moduleNumber] * currPosChange;
                if (dotPositions[moduleNumber][0] >= (endX * 75) + canvas.clientWidth / 2) {
                    if (rxnDir[moduleNumber] === 0 || rxnDir[moduleNumber] === -1) {
                        directions[moduleNumber] = -1;
                    } else {
                        dotPositions[moduleNumber][0] = startX * 75 + canvas.clientWidth / 2;
                        dotPositions[moduleNumber][1] = startY * 100;
                        directions[moduleNumber] = 1;
                    }
                    prodSubValues[moduleNumber][0] ++;
                    prodSubValues[moduleNumber][1] --;
                    if (prodSubValues[moduleNumber][1] < 1) {
                        prodSubValues[moduleNumber][1] = 1;
                    }
                    if (moduleNumber != prodSubValues.length - 1) {
                        prodSubValues[moduleNumber + 1][1] ++;
                    }
                } else if (dotPositions[moduleNumber][0] <= (startX * 75) + 
                    canvas.clientWidth / 2) {
                    if (rxnDir[moduleNumber] === 0 || rxnDir[moduleNumber] === 1) {
                        directions[moduleNumber] = 1;
                    } else {
                        dotPositions[moduleNumber][0] = endX * 75 + canvas.clientWidth / 2;
                        dotPositions[moduleNumber][1] = endY * 100;
                        directions[moduleNumber] = -1;
                    }
                    prodSubValues[moduleNumber][0] --;
                    prodSubValues[moduleNumber][1] ++;
                    if (prodSubValues[moduleNumber][0] < 1) {
                        prodSubValues[moduleNumber][0] = 1;
                    }
                    if (moduleNumber != 0) {
                        prodSubValues[moduleNumber + 1][0] ++;
                    }
                }
            } else { //weird
                var midPoint = (yCoords[moduleNumber] * 100) + 50;
                var botMidPoint = midPoint + 25;
                if (dotPositions[moduleNumber][2] === 'undefined') { //If the reaction has not reached the midpoint before
                    dotPositions[moduleNumber].append(0);
                    dotPositions[moduleNumber].append(0);
                }
                if (dotPositions[moduleNumber][1] >= midPoint) {
                    dotPositions[moduleNumber][1] += directions[moduleNumber] * positionChange;
                    if (dotPositions[moduleNumber][1] < botMidPoint) {
                        dotPositions[moduleNumber][0] = (startX*75+canvas.clientWidth/2) + 
                            directions[moduleNumber] * 3 * (dotPositions[moduleNumber][1] - 
                            midPoint);
                    }
                    dotPositions[moduleNumber][3] = dotPositions[moduleNumber][1];
                    if (dotPositions[moduleNumber][3] < botMidPoint) {
                        dotPositions[moduleNumber][2] = (startX*75+canvas.clientWidth/2) - 
                            directions[moduleNumber] * 3 * (dotPositions[moduleNumber][1] - 
                            midPoint);
                    }
                } else {
                    dotPositions[moduleNumber][0] = startX*75+canvas.clientWidth/2;
                    dotPositions[moduleNumber][1] += directions[moduleNumber] * positionChange;
                    dotPositions[moduleNumber][2] = startX*75+canvas.clientWidth/2;
                    dotPositions[moduleNumber][3] = dotPositions[moduleNumber][1];
                }
                if (dotPositions[moduleNumber][1] >= endY * 100 && dotPositions[moduleNumber][0] >= 
                    (endX * 75) + canvas.clientWidth / 2) {
                    if (rxnDir[moduleNumber] === 0 || rxnDir[moduleNumber] === -1) {
                        directions[moduleNumber] = -1;
                    } else {
                        dotPositions[moduleNumber][0] = startX * 75 + canvas.clientWidth / 2;
                        dotPositions[moduleNumber][1] = startY * 100;
                        dotPositions[moduleNumber][2] = startX * 75 + canvas.clientWidth / 2;
                        dotPositions[moduleNumber][3] = startY * 100;
                        directions[moduleNumber] = 1;
                    }
                    prodSubValues[moduleNumber][0] ++;
                    prodSubValues[moduleNumber][1] --;
                    if (prodSubValues[moduleNumber][1] < 1) {
                        prodSubValues[moduleNumber][1] = 1;
                    }
                    if (moduleNumber != prodSubValues.length - 1) {
                        prodSubValues[moduleNumber + 1][1] ++;
                    }
                } else if (dotPositions[moduleNumber][1] <= startY * 100 && 
                    dotPositions[moduleNumber][0] <= (startX * 75) + 
                    canvas.clientWidth / 2) {
                    if (rxnDir[moduleNumber] === 0 || rxnDir[moduleNumber] === 1) {
                        directions[moduleNumber] = 1;
                    } else {
                        dotPositions[moduleNumber][0] = endX * 75 + canvas.clientWidth / 2;
                        dotPositions[moduleNumber][1] = endY * 100;
                        dotPositions[moduleNumber][2] = startX * 75 + canvas.clientWidth / 2;
                        dotPositions[moduleNumber][3] = startY * 100;
                        directions[moduleNumber] = -1;
                    }
                    prodSubValues[moduleNumber][0] --;
                    prodSubValues[moduleNumber][1] ++;
                    if (prodSubValues[moduleNumber][0] < 1) {
                        prodSubValues[moduleNumber][0] = 1;
                    }
                    if (moduleNumber != 0) {
                        prodSubValues[moduleNumber + 1][0] ++;
                    }
                }
            }
        }
    }
}


function animate() {
    canvas = document.getElementById("modelEditCanvas");
    render();
    window.requestAnimationFrame(animate);
}

// specifies which steps of the pathway to draw and draws them
function render() {
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    var varList = document.getElementsByClassName("inner-flex-horiz");
    //Draw each step of the pathway, including reversible and non-reversible steps
    for (var i = 0; i < enzymeList.length; i++) {
        getDotPos(i);
        //set speed
        if (i === 0) {
            firstRectMidX = xCoords[i] * 75 + (canvas.clientWidth / 2 + 50);
            firstRectMidY = yCoords[i] * 100;
        }
        if (revList[i] === "reversible") {
            var nextX;
            var nextY;
            if (i != enzymeList.length) {
                nextX = xCoords[i+1] * 75 + (canvas.clientWidth / 2 + 50);
                nextY = yCoords[i+1] * 100;
            } else {
                nextX = xCoords[i] * 75 + (canvas.clientWidth / 2 + 50);
                nextY = yCoords[i] * 100;
            }
            revStep(substrateList[i][0], productList[i][0], enzymeList[i], 
                xCoords[i] * 75 + (canvas.clientWidth / 2 + 50), yCoords[i] * 100, 
                nextX, nextY, ctx);
        } else {
            notRevStep(substrateList[i][0], productList[i][0], enzymeList[i], 
                xCoords[i] * 75 + (canvas.clientWidth / 2 + 50), yCoords[i] * 100, 
                ctx);
        }
        if (varList[i].getAttribute("drawRect") === "true") {
            ctx.beginPath();
            ctx.rect(highlightRects[i][0], highlightRects[i][1], highlightRects[i][2], 
                highlightRects[i][3]);
            ctx.stroke();
        }
    }
    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();
    ctx.fillStyle = "blue";
    for (var i = 0; i < dotPositions.length; i++) {
        ctx.moveTo(dotPositions[i][0] + 5, dotPositions[i][1]);
        ctx.arc(dotPositions[i][0], dotPositions[i][1], 5, 0, 2 * Math.PI);
        if (dotPositions[i].length === 4) {
            ctx.moveTo(dotPositions[i][2] + 5, dotPositions[i][3]);
            ctx.arc(dotPositions[i][2], dotPositions[i][3], 5, 0, 2 * Math.PI);
        }
    }
    ctx.fill();
}

function convertIdToText(id) {
    var stringArr = id.split("_");
    var textStr = stringArr.join(" ");
    return textStr;
}

function convertTextToId(text) {
    var txtArr = text.split(" ");
    var idStr = txtArr.join("_");
    return idStr;
}

function calculateK(moduleNumber) {
    var deltaG = db_modules[moduleNumber].deltaG
    var deltaGNaughtPrime = db_modules[moduleNumber].deltaGNaughtPrime
    var k = Math.exp(deltaGNaughtPrime / (0.008314 * 298));
    return k;
}

//resets values of sliders on page (re)load
function reset() {
    var varList = document.getElementsByClassName("inner-flex-horiz");
    for (var i=0; i<db_modules.length; i++) {
        if (db_modules[i].modelID_id === modelNum) {
            if (db_modules[i].reversible === 'irreversible') {
                var enSlider = document.getElementById(db_modules[i].enzyme);
                enSlider.value = "50";
                var numId = db_modules[i].enzyme + "Value";
                enSlider.oninput = function() {
                    var sliderId = convertTextToId(this.id) + "Value";
                    document.getElementById(sliderId).innerHTML = this.value;
                }
            }
            highlightRects.push([db_modules[i].xCoor*75+canvas.clientWidth/2-130,
                db_modules[i].yCoor*100-30, 260, 160, false]);
            var indexAttrib = document.createAttribute("drawRect");
            indexAttrib.value = "false";
            varList[i].setAttributeNode(indexAttrib);
            varList[i].addEventListener("mouseenter", function(event) {
                this.setAttribute("drawRect", "true");
            }, false);
            varList[i].addEventListener("mouseenter", function(event) {
                this.setAttribute("drawRect", "false");
            }, false)
            dotPositions.push([db_modules[i].xCoor * 75 + (canvas.clientWidth / 2),
                db_modules[i].yCoor * 100])
            directions.push(1);
            rxnDir.push(1);
            if (i === 0) {
                prodSubValues.push([1, 10]);
            } else {
                prodSubValues.push([1, 1]);
            }
            kValues.push(calculateK(i));
        }
    }
}



// Assumes that there are at least one substrate, at least one product,
// exactly one enzyme, and exactly one boolean for reversible/irreversible
function parseThrough(stringToParse) {
    //on chrome the wrong information is being stored as an enzyme
    try {
        var tmpArr = stringToParse.split(">");
    } catch (e) {
        return null
    }
    var newArr = tmpArr[1].split("<");
    var evenNewer = newArr[1].split(";");
    // fullArr now contains
    // [0]: substrates (inputs)
    // [1]: enzyme
    // [2]: products (outputs)
    // [3]: reversible? (boolean)
    fullArr = [tmpArr[0], newArr[0], evenNewer[0], evenNewer[1]];
    subsArr = fullArr[0].split("+");
    prodArr = fullArr[2].split("+");
    return [subsArr, fullArr[1], prodArr, fullArr[3]]
}

function addValues() {
    for (var i=0; i<db_modules.length; i++) {
        if (db_modules[i].modelID_id === modelNum) {
            var moduleNum = db_modules[i].id
            enzymeList.push(db_modules[i].enzymeAbbr)
            revList.push(db_modules[i].reversible)
            xCoords.push(db_modules[i].xCoor)
            yCoords.push(db_modules[i].yCoor)
            var subList = []
            for (var j=0; j<db_substrates.length; j++) {
                if (db_substrates[j].moduleID_id === moduleNum) {
                    subList.push(db_substrates[j].abbr)
                }
            }
            substrateList.push(subList)
            var prodList = []
            for (var j=0; j<db_products.length; j++) {
                if (db_products[j].moduleID_id === moduleNum) {
                    prodList.push(db_products[j].abbr)
                }
            }
            productList.push(prodList)
        }
    }
}

function redirect() {
    var url = "/testApp/moduleEdit/" + modelNum + "/0";
    location.href = url;
}

function createSliders() {
    var button = document.getElementById("new-reaction");
    button.setAttribute("onclick", "redirect();");
    button.onclick = function() {redirect();};
    for (var i=0; i<db_modules.length; i++) {
        if (db_modules[i].modelID_id === modelNum) {
            var sliderHolder = document.getElementById("slider-holder");
            var varHolder = document.createElement('div');
            varHolder.setAttribute("class", "variable-holder");
            var enzLabel = document.createElement('label');
            enzLabel.setAttribute("for", db_modules[i].enzyme);
            enzLabel.innerHTML = convertIdToText(db_modules[i].enzyme);
            varHolder.appendChild(enzLabel);
            var inner = document.createElement('div');
            inner.setAttribute("class", "inner-flex-horiz");
            if (db_modules[i].reversible === 'irreversible') {
                //Set slider attributes
                var inputItem = document.createElement('input');
                inputItem.setAttribute("type", "range");
                inputItem.setAttribute("min", "0");
                inputItem.setAttribute("max", "100");
                inputItem.setAttribute("value", "50");
                inputItem.setAttribute("step", "10");
                inputItem.setAttribute("class", "variables");
                inputItem.setAttribute("id", db_modules[i].enzyme);
                inner.appendChild(inputItem);
                var header = document.createElement('h4');
                header.setAttribute("id", db_modules[i].enzyme + "Value");
                header.innerHTML = "50";
                inner.appendChild(header);
            }
            var editButton = document.createElement('a');
            editButton.innerHTML = "Edit";
            var url = "/testApp/moduleEdit/" + modelNum + "/" + (i + 1);
            editButton.setAttribute("href", url);
            inner.appendChild(editButton);
            varHolder.appendChild(inner);
            sliderHolder.append(varHolder); 
        }
        
    }
}

function main () {
    createSliders();
    reset();
    addValues();
    render();
    window.requestAnimationFrame(animate);
}


window.onload = main();

//module.exports = getDotPos;