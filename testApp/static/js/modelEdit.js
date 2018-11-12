
function main () {
    var canvas = document.getElementById("modelEditCanvas");
    var ctx = canvas.getContext("2d");
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
    }*/
    ctx.rect(50, 50, 100, 50);
    ctx.stroke();
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