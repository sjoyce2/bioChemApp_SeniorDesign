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
    ctx.font = "10px Arial"
    ctx.fillText(enzyme, firstRectMidX + )
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

function main () {
    var canvas = document.getElementById("modelEditCanvas");
    var ctx = canvas.getContext("2d");
    var firstRectMidX = (canvas.clientWidth / 2) + 50;
	var firstRectMidY = 75;
	var firstText = "Glucose";
	var secondText = "G6P";
    var thirdText = "F6P";
    var fourthText = "F16BP";
    var fifthText = "GAP";
    /*for (let i = 0; i < canvas.clientWidth; i += 100) {
        for (let j = 100; j < canvas.clientHeight; j += 50) {
            let grd = ctx.createRadialGradient(i+50, j+25, 20, i+50, j+25, 100);
            grd.addColorStop(0, "lightgray");
            grd.addColorStop(1, "white");
            ctx.fillStyle = grd;
            ctx.fillRect(i, j, 100, 50);
            ctx.rect(i, j, 100, 50);
            ctx.moveTo(i + 50, j + 15);
            ctx.lineTo(i + 50, j + 35);
            ctx.moveTo(i + 40, j + 25);
            ctx.lineTo(i + 60, j + 25);
        }
    }
    ctx.rect(50, 50, 100, 50);
    
    ctx.stroke();*/
    notRevStep(firstText, secondText, firstRectMidX, firstRectMidY, ctx);
    revStep(secondText, thirdText, firstRectMidX, firstRectMidY + 100, ctx);
    notRevStep(thirdText, fourthText, firstRectMidX, firstRectMidY + 200, ctx);
    revStep(fourthText, fifthText, firstRectMidX, firstRectMidY + 300, ctx);
    function getMousePosition(canvas, event) {
        let border = canvas.getBoundingClientRect();
        return {
            x: event.clientX - border.left,
            y: event.clientY - border.top
        };
    }

    canvas.addEventListener('click', function (event) {
        let mousePosition = getMousePosition(canvas, event);
        let rectNum = (Math.floor(mousePosition.x / 100) + Math.floor(mousePosition.y / 50) * 8) - 15;
        let rectClicked = document.getElementById("rectClicked");
        rectClicked.innerHTML = "Rectangle Clicked: " + rectNum;
        //TODO: link to model page and remember rectangle number
    });
}

main();