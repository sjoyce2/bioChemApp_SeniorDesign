
function main () {
    var canvas1 = document.getElementById("imageCanvas");
    var canvas2 = document.getElementById("equationCanvas")
    var btn1 = document.getElementById("substrates");
    var ctx = canvas1.getContext("2d");

    function getMousePosition(canvas1, event) {
        let border = canvas1.getBoundingClientRect();
        return {
            x: event.clientX - border.left,
            y: event.clientY - border.top
        };
    }

    /* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
// var myDropdown = document.getElementById("dropdownBtn");
// myDropdown.addEventListener("click", function(){
//   document.getElementById("myDropdown").classList.toggle("show");
// });
// document.querySelector('.nav-toggle').onclick = function(e) {
//   var nav = document.querySelector('nav')
//   nav.classList.toggle('show')
//   e.preventDefault()
// }
// Close the dropdown menu if the user clicks outside of it

    canvas1.addEventListener('click', function (event) {
        let mousePosition = getMousePosition(canvas1, event);
        let rectNum = (Math.floor(mousePosition.x / 100) + Math.floor(mousePosition.y / 50) * 8) - 15;
        let rectClicked = document.getElementById("rectClicked");
        console.log("CLICK");
        //TODO: link to model page and remember rectangle number
    });
}

main();
