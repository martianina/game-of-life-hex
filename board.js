var canvas = document.getElementById('board');
var ctx = canvas.getContext('2d');
var mode = '';

var hasAddListener = false;
var clickListener = null;
var mouseMoveListener = null;

var fillColor = '#000000';
var outlineColor = '#000000';
var hoverOutlineColor = "#00fff6";

var makeBoard = function(width) {

    var hexHeight,
        hexRadius,
        hexRectangleHeight,
        hexRectangleWidth,
        hexagonAngle = 0.523598776, // 30 degrees in radians
        sideLength = 600 / (width + .5) / Math.sqrt(3),
        boardWidth = width,
        boardHeight = width;

		hexHeight = Math.sin(hexagonAngle) * sideLength;
		hexRadius = Math.cos(hexagonAngle) * sideLength;
		hexRectangleHeight = sideLength + 2 * hexHeight;
		hexRectangleWidth = 2 * hexRadius;

    if (canvas.getContext) {

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = fillColor;
        ctx.strokeStyle = outlineColor;
        if(width != 100)
        {
          ctx.lineWidth = 1;
        }
        else
        {
          ctx.lineWidth = 0.25;
        }
        drawBoard(ctx, boardWidth, boardHeight);

        clickListener = function(eventInfo) {
            var x,
                y,
                hexX,
                hexY,
                screenX,
                screenY;

            x = eventInfo.offsetX || eventInfo.layerX;
            y = eventInfo.offsetY || eventInfo.layerY;

            hexY = Math.floor(y / (hexHeight + sideLength));
            hexX = Math.floor((x - (hexY % 2) * hexRadius) / hexRectangleWidth);

            screenX = hexX * hexRectangleWidth + ((hexY % 2) * hexRadius);
            screenY = hexY * (hexHeight + sideLength);

            // Clear the board
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Check if the mouse's coords are on the board
            if (hexX >= 0 && hexX < boardWidth) {
                if (hexY >= 0 && hexY < boardHeight) {
                    grid[hexY][hexX].shouldSwap = true;
                    grid[hexY][hexX].doSwap();
                    ctx.fillStyle = getFillColor();
					ctx.strokeStyle = getOutlineColor();
                    drawBoard(ctx, boardWidth, boardHeight);
                }
            }
        }

		mouseMoveListener = function(eventInfo) {
				var x,
				y,
				hexX,
				hexY,
				screenX,
				screenY;

                x = eventInfo.offsetX || eventInfo.layerX;
                y = eventInfo.offsetY || eventInfo.layerY;

                hexY = Math.floor(y / (hexHeight + sideLength));
                hexX = Math.floor((x - (hexY % 2) * hexRadius) / hexRectangleWidth);

                screenX = hexX * hexRectangleWidth + ((hexY % 2) * hexRadius);
                screenY = hexY * (hexHeight + sideLength);

                // Clear the board
                ctx.clearRect(0, 0, canvas.width, canvas.height);

				drawBoard(ctx, boardWidth, boardHeight);

                // Check if the mouse's coords are on the board
                if (hexX >= 0 && hexX < boardWidth) {
                    if (hexY >= 0 && hexY < boardHeight) {
                        ctx.strokeStyle = getHoverOutlineColor();
                        drawHexagon(ctx, screenX, screenY, grid[hexY][hexX].isAlive);
						ctx.strokeStyle = getOutlineColor();
                    }
                }

	}

		//Event listeners
        if (!hasAddListener) {
            hasAddListener = true;

            canvas.addEventListener("click", function(eventInfo) {
				clickListener(eventInfo);
            });

			canvas.addEventListener("mousemove", function(eventInfo) {
				mouseMoveListener(eventInfo);
            });
        }
    }

    function drawBoard(canvasContext, width, height) {
        var i,
            j;

        for (i = 0; i < width; ++i) {
            for (j = 0; j < height; ++j) {
                drawHexagon(
                  ctx,
                  i * hexRectangleWidth + ((j % 2) * hexRadius),
                  j * (sideLength + hexHeight),
                  grid[j][i].isAlive);
            }
        }
    }

    function drawHexagon(canvasContext, x, y, fill) {
        var fill = fill || false;

        canvasContext.beginPath();
        canvasContext.moveTo(x + hexRadius, y);
        canvasContext.lineTo(x + hexRectangleWidth, y + hexHeight);
        canvasContext.lineTo(x + hexRectangleWidth, y + hexHeight + sideLength);
        canvasContext.lineTo(x + hexRadius, y + hexRectangleHeight);
        canvasContext.lineTo(x, y + sideLength + hexHeight);
        canvasContext.lineTo(x, y + hexHeight);
        canvasContext.closePath();

        if (fill) {

			switch (mode) {
				case "rainbow":
					canvasContext.fillStyle = '#'+Math.floor(Math.random()*16777215).toString(16);
					break;
				default:
					break;
			}

            canvasContext.fill();
			canvasContext.stroke();
        } else {
            canvasContext.stroke();
        }
    }

};

function getFillColor(){
	return fillColor;
}

function getOutlineColor(){
	return outlineColor;
}

function getHoverOutlineColor(){
	return hoverOutlineColor;
}

function setFillColor(c){
	fillColor = '#' + c;
	updateBoard();
}

function setOutlineColor(c){
	outlineColor = '#' + c;
	updateBoard();
}

function setHoverOutlineColor(c){
	hoverOutlineColor = '#' + c;
	updateBoard();
}

function setMode(m) {
	if (m == mode) {
		mode = '';
		updateBoard();
		return;
	}

	mode = m;
	updateBoard();
}

function board(size) {
    setSize(size);
    makeBoard(size);
}

function updateBoard(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	makeBoard(grid.length);
}

myVar = false;

function intervalStart() {
  clearInterval(myVar);
  myVar = setInterval(step, stepSpeed);
}

function intervalEnd() {
  clearInterval(myVar);
  myVar = false;
}

function killAll() {
  board(grid.length);
}

var logArr = [50, 100, 150, 200, 250, 375, 500, 1000, 2000];
function logslider(position) {
  return logArr[position];
}

board(20);
