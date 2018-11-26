var x;
var y;
var firstRectMidX;
var firstRectMidY;
var endY;
var direction = 1;
var stepOrder = []; //array of steps, "n" for non-reversible, "r" for reversible

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
	
	//create arrow for other substrates (inputs) into the reaction
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
    ctx.moveTo(firstRectMidX + 10, firstRectMidY + 50);
    ctx.bezierCurveTo(
        firstRectMidX + 10, firstRectMidY + 30, 
        firstRectMidX + 90, firstRectMidY + 30, 
        firstRectMidX + 90, firstRectMidY + 50);
    ctx.bezierCurveTo(
        firstRectMidX + 90, firstRectMidY + 70, 
        firstRectMidX + 10, firstRectMidY + 70, 
        firstRectMidX + 10, firstRectMidY + 50);
    ctx.fillStyle = "white";
	ctx.fill();
	
    //Label the proteins(rectangles) and enzyme(oval)
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText(substrate, firstRectMidX - 90, firstRectMidY + 5);
    ctx.fillText(product, firstRectMidX - 90, firstRectMidY + 105);
    ctx.font = "12px Arial";
    ctx.fillText(enzyme, firstRectMidX + 20, firstRectMidY + 54)
    ctx.fillText("ATP", firstRectMidX + 110, firstRectMidY + 5);
    ctx.fillText("ADP", firstRectMidX + 110, firstRectMidY + 105);
}

function revStep(firstText, secondText, firstRectMidX, firstRectMidY, ctx) {
    ctx.rect(firstRectMidX - 100, firstRectMidY - 25, 100, 50);
    ctx.rect(firstRectMidX - 100, firstRectMidY + 75, 100, 50);
    ctx.moveTo(firstRectMidX - 65, firstRectMidY + 35);
    ctx.lineTo(firstRectMidX - 55, firstRectMidY + 25);
    ctx.lineTo(firstRectMidX - 55, firstRectMidY + 75);
    ctx.moveTo(firstRectMidX - 45, firstRectMidY + 25);
    ctx.lineTo(firstRectMidX - 45, firstRectMidY + 75);
    ctx.lineTo(firstRectMidX - 35, firstRectMidY + 65);
    ctx.font = "20px Arial";
    ctx.fillText(firstText, firstRectMidX - 90, firstRectMidY + 5);
    ctx.fillText(secondText, firstRectMidX - 90, firstRectMidY + 105);
    ctx.stroke();
}

function getDotPos(y) {
    var arrayPos = Math.floor((y - firstRectMidY) / 100);
    if (stepOrder[arrayPos] === "n") {
        var x = firstRectMidX + Math.sqrt(-1 * Math.pow((y - (firstRectMidY + arrayPos * 100)) - 50, 2) + 2500);
    } else {
        x = firstRectMidX - 50;
    }
    return x;
}

//startX, startY, endX, endY all floats
//stepOrder: array of strings, direction is 1 or -1
function animate() {
    if (y === firstRectMidY + 0.0) {
        direction = 1;
    } else if (y === endY && endY >= 0) {
        direction = -1;
    }
    y += 0.5 * direction;
    x = getDotPos(y);
    render();
    window.requestAnimationFrame(animate);
}

function render() {
    var canvas = document.getElementById("modelEditCanvas");
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    firstRectMidX = (canvas.clientWidth / 2) + 50;
    firstRectMidY = 75;
	var firstText = "Glucose";
	var secondText = "G6P";
    var thirdText = "F6P";
    var fourthText = "F16BP";
    var fifthText = "GAP";
    var enzyme1 = "hexokinase";
    var enzyme2 = "enzyme2";

    notRevStep(firstText, secondText, enzyme1, 
        firstRectMidX, firstRectMidY, ctx);
    stepOrder.push("n");
    revStep(secondText, thirdText, firstRectMidX, 
        firstRectMidY + 100, ctx);
        stepOrder.push("r");
    notRevStep(thirdText, fourthText, enzyme2,
        firstRectMidX, firstRectMidY + 200, ctx);
    stepOrder.push("n");
    revStep(fourthText, fifthText, firstRectMidX, 
        firstRectMidY + 300, ctx);
    stepOrder.push("r");
    endY = firstRectMidY + 400.0;
    ctx.beginPath();
    ctx.moveTo(x + 5, y);
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = "red";
    ctx.fill();
}

function main () {
    firstRectMidY = 75;
    y = firstRectMidY;
    render();
    window.requestAnimationFrame(animate);

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



main();