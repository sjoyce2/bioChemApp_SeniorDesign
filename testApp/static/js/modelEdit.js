var x;
var y;
var firstRectMidX;
var firstRectMidY;
var endY;  //depricated
var direction = 1; //depricated
var speed; //how fast the "molecule" is flowing through the pathway

var canv = document.getElementById("modelEditCanvas");
var context = canv.getContext('2d');
var dragging = false;
var lastX;
var marginLeft = 0;

// Instead of these, we need a list of enzymes and a corresponding 2d list
// for products and another for substrates
var enzymeList = [];
var substrateList = [];
var productList = [];
var revList = [];
var xCoords = [];
var yCoords = [];
var en1weight = 2;
var en2weight = 9;
var en3weight = 1;
var db_modules = JSON.parse(document.getElementById('db-modules').textContent);
var db_substrates = JSON.parse(document.getElementById('db-substrates').textContent);
var db_products = JSON.parse(document.getElementById('db-products').textContent);

//TODO
/* canv.addEventListener('mousedown', function(e) {
    var evt = e || event;
    dragging = true;
    lastX = evt.clientX;
    e.preventDefault();
}, false); */

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
    ctx.rect(firstRectMidX - 100, firstRectMidY - 25, 100, 50);
    //draw arrows between proteins
    if (nextX) {
        if (nextX == firstRectMidX) { //reactions are formatted normally
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
            if (nextY == firstRectMidY) { //reactions horizontally connected
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
    if (nextX && (nextY == firstRectMidY)) {
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

//Calculate the x value of the molecule in the reaction. The height
//changes by a consistent value each time but the horizontal
//position can change if it is following a non-reversible reaction
//TODO: Fix this equation
function getDotPos(newY, firstRectMidY, firstRectMidX) {
    var arrayPos = Math.floor((newY - firstRectMidY) / 100);
    if (!revList[arrayPos]) {
        x = firstRectMidX + Math.sqrt(-1 * Math.pow((newY - firstRectMidY) - 50 - (100 * arrayPos), 2) + 2500);
    } else {
        x = firstRectMidX - 50;
    }
    return x;
}

//Sets the speed of the molecule given the weight and enzyme speed for the
//reaction it is currently in

//TODO: Fix this
function setSpeed(enzymeName, weight) {
    if (enzymeName === "") {
        speed = 1;
        return 0;
    } else {
        var enzymeSpeed = parseInt(document.getElementById(enzymeName).value);
        speed = weight * (enzymeSpeed / 50);
        return 1;
    }
}

//startX, startY, endX, endY all floats
//stepOrder: array of strings, direction is 1 or -1

//TODO: Fix this
function animate() {
    if (y < firstRectMidY + 0.0 || y >= endY) {
        y = firstRectMidY;
    }
    if (y >= firstRectMidY && y < firstRectMidY + 200.0) {
        setSpeed(enzyme1, en1weight);
    } else if (y >= firstRectMidY + 200.0 && y < firstRectMidY + 400.0) {
        setSpeed(enzyme2, en2weight);
    } else {
        setSpeed("", 1);
    }
    y += 0.25 * direction * speed;
    x = getDotPos(y, firstRectMidY, firstRectMidX);
    render();
    window.requestAnimationFrame(animate);
}

// specifies which steps of the pathway to draw and draws them
function render() {
    var canvas = document.getElementById("modelEditCanvas");
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

    //Draw each step of the pathway, including reversible and non-reversible steps
    for (var i = 0; i < enzymeList.length; i++) {
        if (i == 0) {
            firstRectMidX = xCoords[i] * 75 + (canvas.clientWidth / 2 + 50)
            firstRectMidY = yCoords[i] * 100;
        }
        if (revList[i] == "reversible") {
            var nextX;
            var nextY;
            if (i != enzymeList.length) {
                nextX = xCoords[i+1] * 75 + (canvas.clientWidth / 2 + 50);
                nextY = yCoords[i+1] * 100;
            } else {
                nextX = null
                nextY = null
            }
            revStep(substrateList[i][0], productList[i][0], enzymeList[i], 
                xCoords[i] * 75 + (canvas.clientWidth / 2 + 50), yCoords[i] * 100, 
                nextX, nextY, ctx);
        } else {
            notRevStep(substrateList[i][0], productList[i][0], enzymeList[i], 
                xCoords[i] * 75 + (canvas.clientWidth / 2 + 50), yCoords[i] * 100, 
                ctx);
        }
    }
    endY = firstRectMidY + 390.0;
    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();
    ctx.fillStyle = "blue";
    ctx.moveTo(x + 5, y);
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fill();
}

function convertIdToText(id) {
    stringArr = id.split("_");
    textStr = stringArr.join(" ");
    return textStr;
}

function convertTextToId(text) {
    txtArr = text.split(" ");
    idStr = txtArr.join("_");
    return idStr;
}

//resets values of sliders on page (re)load
function reset() {
    //adds functionality to the logout button
    document.getElementById("logout").addEventListener("click", function(event) {
        document.location.href = '..';
    });
    for (i=0; i<db_modules.length; i++) {
        if (db_modules[i].modelID_id == 1) {
            var enSlider = document.getElementById(db_modules[i].enzyme);
            enSlider.value = "50";
            numId = db_modules[i].enzyme + "Value";
            enSlider.oninput = function() {
                sliderId = convertTextToId(this.id) + "Value";
                document.getElementById(sliderId).innerHTML = this.value;
            }
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
    for (i=0; i<db_modules.length; i++) {
        if (db_modules[i].modelID_id == 1) {
            var moduleNum = db_modules[i].id
            enzymeList.push(db_modules[i].enzymeAbbr)
            revList.push(db_modules[i].reversible)
            xCoords.push(db_modules[i].xCoor)
            yCoords.push(db_modules[i].yCoor)
            var subList = []
            for (j=0; j<db_substrates.length; j++) {
                if (db_substrates[j].moduleID_id == moduleNum) {
                    subList.push(db_substrates[j].abbr)
                }
            }
            substrateList.push(subList)
            var prodList = []
            for (j=0; j<db_products.length; j++) {
                if (db_products[j].moduleID_id == moduleNum) {
                    prodList.push(db_products[j].abbr)
                }
            }
            productList.push(prodList)
        }
    }
}

function createSliders() {
    for (i=0; i<db_modules.length; i++) {
        if (db_modules[i].modelID_id == 1) { //TODO: Set this to the current model id
            sliderHolder = document.getElementById("slider-holder");
            varHolder = document.createElement('div');
            varHolder.setAttribute("class", "variable-holder");
            enzLabel = document.createElement('label');
            enzLabel.setAttribute("for", db_modules[i].enzyme);
            enzLabel.innerHTML = convertIdToText(db_modules[i].enzyme);
            varHolder.appendChild(enzLabel);
            inner = document.createElement('div');
            inner.setAttribute("class", "inner-flex-horiz");
            //Set slider attributes
            inputItem = document.createElement('input');
            inputItem.setAttribute("type", "range");
            inputItem.setAttribute("min", "0");
            inputItem.setAttribute("max", "100");
            inputItem.setAttribute("value", "50");
            inputItem.setAttribute("step", "10");
            inputItem.setAttribute("class", "variables");
            inputItem.setAttribute("id", db_modules[i].enzyme);
            inner.appendChild(inputItem);
            header = document.createElement('h4');
            header.setAttribute("id", db_modules[i].enzyme + "Value");
            header.innerHTML = "50";
            inner.appendChild(header);
            varHolder.appendChild(inner);
            sliderHolder.append(varHolder);
        } 
    }
}

function main () {
    createSliders();
    reset();
    //get data from database
    //get data from localStorage.getItem("currentRxn")
    localStorage.setItem("reactionClicked", "-1")
    var stringToParse = localStorage.getItem('currentRxn');
    var reaction = parseThrough(stringToParse);
    addValues();
    /* canvas.addEventListener('click', function (event) {
        let mousePosition = getMousePosition(canvas, event);
        //TODO: link to model page and remember rectangle number
        if (mousePosition <= )
    }); */
    x = 0;
    y = 0;
    render();
    //window.requestAnimationFrame(animate); //TODO: Fix animate() so we can use this

    // Will be useful later but is not important right now
    /* function getMousePosition(canvas, event) {
        let border = canvas.getBoundingClientRect();
        return {
            x: event.clientX - border.left,
            y: event.clientY - border.top
        };
    } */
}


window.onload = main();

//module.exports = getDotPos;