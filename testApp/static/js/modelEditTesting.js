function getDotPos(newY, firstRectMidY, stepOrder, firstRectMidX) {
    var arrayPos = Math.floor((newY - firstRectMidY) / 100);
    if (stepOrder[arrayPos] === "n") {
        x = firstRectMidX + Math.sqrt(-1 * Math.pow((newY - firstRectMidY) - 50 - (100 * arrayPos), 2) + 2500);
    } else {
        x = firstRectMidX - 50;
    }
    return x;
}

module.exports = getDotPos;