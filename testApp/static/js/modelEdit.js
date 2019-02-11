var x;
var y;
var x2;
var x3;
var x4;
var firstRectMidX;
var firstRectMidY;
var endY;
var direction = 1;
var stepOrder = []; //array of steps, "n" for non-reversible, "r" for reversible
var speed; //how fast the "molecule" is flowing through the pathway

// Instead of these, we need a list of enzymes and a corresponding 2d list
// for products and another for substrates
var enzymeList = [];
var substrateList = [];
var productList = [];
var enzyme1 = "enzyme1";
var enzyme2 = "enzyme2";
var enzyme3 = "enzyme3";
var enzyme1Name = "hexokinase";
var enzyme2Name = "phosphofructokinase";
var enzyme3Name = "aldolase";
var en1weight = 2;
var en2weight = 9;
var en3weight = 1;

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
}

//create a reversible reaction
function revStep(firstText, secondText, firstRectMidX, firstRectMidY, ctx) {
    //create first protein
    firstWidth = ctx.measureText(firstText).width;
    ctx.rect(firstRectMidX - 100, firstRectMidY - 25, firstWidth, 50);
    //create second protein
    secondWidth = ctx.measureText(secondText).width
    ctx.rect(firstRectMidX - 100, firstRectMidY + 75, secondWidth, 50);
    //draw arrows between proteins
    ctx.moveTo(firstRectMidX - 65, firstRectMidY + 35);
    ctx.lineTo(firstRectMidX - 55, firstRectMidY + 25);
    ctx.lineTo(firstRectMidX - 55, firstRectMidY + 75);
    ctx.moveTo(firstRectMidX - 45, firstRectMidY + 25);
    ctx.lineTo(firstRectMidX - 45, firstRectMidY + 75);
    ctx.lineTo(firstRectMidX - 35, firstRectMidY + 65);
    ctx.font = "20px Arial";
    //add label to first protein
    ctx.fillText(firstText, firstRectMidX - 90, firstRectMidY + 5);
    //add label to second protein
    ctx.fillText(secondText, firstRectMidX - 90, firstRectMidY + 105);
    //draw everything to the screen
    ctx.stroke();
}

//Calculate the x value of the molecule in the reaction. The height
//changes by a consistent value each time but the horizontal
//position can change if it is following a non-reversible reaction
function getDotPos(newY, firstRectMidY, stepOrder, firstRectMidX) {
    var arrayPos = Math.floor((newY - firstRectMidY) / 100);
    if (stepOrder[arrayPos] === "n") {
        x = firstRectMidX + Math.sqrt(-1 * Math.pow((newY - firstRectMidY) - 50 - (100 * arrayPos), 2) + 2500);
    } else {
        x = firstRectMidX - 50;
    }
    return x;
}

//Sets the speed of the molecule given the weight and enzyme speed for the
//reaction it is currently in
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
    x = getDotPos(y, firstRectMidY, stepOrder, firstRectMidX);
    //x2 = getDotPos(y + 6);
    //x3 = getDotPos(y + 12);
    render();
    window.requestAnimationFrame(animate);
}

// specifies which steps of the pathway to draw and draws them
function render() {
    var canvas = document.getElementById("modelEditCanvas");
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    firstRectMidX = (canvas.clientWidth / 2) + 50;
    firstRectMidY = 75;
    //Need to define these differently
	var firstText = "Glucose";
	var secondText = "G6P";
    var thirdText = "F6P";
    var fourthText = "F16BP";
    var fifthText = "GAP";

    //Draw each step of the pathway, including reversible and non-reversible steps
    notRevStep(firstText, secondText, enzyme1Name,
        firstRectMidX, firstRectMidY, ctx);
    stepOrder.push("n");
    revStep(secondText, thirdText, firstRectMidX,
        firstRectMidY + 100, ctx);
        stepOrder.push("r");
    notRevStep(thirdText, fourthText, enzyme2Name,
        firstRectMidX, firstRectMidY + 200, ctx);
    stepOrder.push("n");
    revStep(fourthText, fifthText, firstRectMidX,
        firstRectMidY + 300, ctx);
    stepOrder.push("r");
    endY = firstRectMidY + 390.0;
    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();
    ctx.fillStyle = "blue";
    ctx.moveTo(x + 5, y);
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fill();
}

//resets values of sliders on page (re)load
function reset() {
    //adds functionality to the logout button
    document.getElementById("logout").addEventListener("click", function(event) {
        document.location.href = '..';
    });

    var en1Slider = document.getElementById(enzyme1);
    var en2Slider = document.getElementById(enzyme2);
    //var en3Slider = document.getElementById(enzyme3);
    en1Slider.value = "50";
    en2Slider.value = "50";
    //en3Slider.value = "5";
    en1Slider.oninput = function() {
        document.getElementById("enzyme1value").innerHTML = this.value;
    };
    en2Slider.oninput = function() {
        document.getElementById("enzyme2value").innerHTML = this.value;
    };
    /*en3Slider.oninput = function() {
        document.getElementById("enzyme3value").innerHTML = this.value;
    };*/

}

// Assumes that there are at least one substrate, at least one product,
// exactly one enzyme, and exactly one boolean for reversible/irreversible
function parseThrough(stringToParse) {
    //Need to do a try catch if there is no info in stringToParse
    //Also, on chrome the wrong information is being stored as an enzyme
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
    enzymeList[0] = fullArr[1];
    

    console.log("Substrates: ");
    console.log(subsArr);
    console.log("Enzyme:");
    console.log(fullArr[1]);
    console.log("Products: ");
    console.log(prodArr);
    console.log("Reversible?: ");
    console.log(fullArr[3]);
    //TODO: convert fullArr[3] to boolean, save substrates, enzymes, and
    // products as variables
    return [subsArr, fullArr[1], prodArr, fullArr[3]]
}

function main () {
    reset();
    //get data from database
    //get data from localStorage.getItem("currentRxn")
    localStorage.setItem("reactionClicked", "-1")
    var stringToParse = localStorage.getItem('currentRxn');
    var reaction = parseThrough(stringToParse);

    firstRectMidY = 75;
    y = firstRectMidY;
    // TODO: render() should be able to access the 
    render();
    window.requestAnimationFrame(animate);

    // Will be useful later but is not important right now
    /* function getMousePosition(canvas, event) {
        let border = canvas.getBoundingClientRect();
        return {
            x: event.clientX - border.left,
            y: event.clientY - border.top
        };
    } */

    /* canvas.addEventListener('click', function (event) {
        let mousePosition = getMousePosition(canvas, event);
        //TODO: link to model page and remember rectangle number
    }); */
}


window.onload = main();

//module.exports = getDotPos;
