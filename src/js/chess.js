// Piece images
const whitePawnImage = new Image(); whitePawnImage.src = "./assets/whitePawn.png";
const blackPawnImage = new Image(); blackPawnImage.src = "./assets/blackPawn.png";

const whiteBishopImage = new Image(); whiteBishopImage.src = "./assets/whiteBishop.png";
const blackBishopImage = new Image(); blackBishopImage.src = "./assets/blackBishop.png";

const whiteKnightImage = new Image(); whiteKnightImage.src = "./assets/whiteKnight.png";
const blackKnightImage = new Image(); blackKnightImage.src = "./assets/blackKnight.png";

const whiteRookImage = new Image(); whiteRookImage.src = "./assets/whiteRook.png";
const blackRookImage = new Image(); blackRookImage.src = "./assets/blackRook.png";

const whiteKingImage = new Image(); whiteKingImage.src = "./assets/whiteKing.png";
const blackKingImage = new Image(); blackKingImage.src = "./assets/blackKing.png";

const whiteQueenImage = new Image(); whiteQueenImage.src = "./assets/whiteQueen.png";
const blackQueenImage = new Image(); blackQueenImage.src = "./assets/blackQueen.png";


// Piece encodings
const Piece = Object.freeze({
    EMPTY: 0,
    WHITE_PAWN: 1,
    BLACK_PAWN: -1,
    WHITE_KNIGHT: 2,
    BLACK_KNIGHT: -2,
    WHITE_BISHOP: 3,
    BLACK_BISHOP: -3,
    WHITE_ROOK: 4,
    BLACK_ROOK: -4,
    WHITE_QUEEN: 5,
    BLACK_QUEEN: -5,
    WHITE_KING: 6,
    BLACK_KING: -6
});
// Board State
let board
let canvas, ctx
let boardLength

let pieceHeld = null;
let holdingPiece = false;

window.onload = function () {
    // Initial board configuration
    resetBoard();
    // Set up canvas rendering
    resizeCanvas();
    // Event listeners
    window.addEventListener("resize", function (){
        resizeCanvas();
    });
    window.addEventListener("click", (event) => {
        // Get the rank and file of the mouse click
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        const file = Math.floor(mouseX / 100);
        const rank = Math.floor(mouseY / 100); 
        // Get the piece clicked
        const pieceClicked = board[rank][file];
        renderBoard();
        
        const legalMoves = getLegalMoves(rank, file);
        for (const legalMove of legalMoves){
            console.log(legalMove);
        }
        
        renderPieces();
    });

    // rendering
    renderBoard();
    renderPieces();
}


function getLegalMoves(rank, file){
    return [(0, 0), (1, 1)];
}

function resizeCanvas(){
    // Set canvas length to the minimum between the screen width and height
    let body = document.getElementById("body");
    boardLength = Math.min(body.offsetWidth, body.offsetHeight);
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
}

function render(){
    //...
}

function renderBoard(){
    // Render the black and white squares
    let white = false;
    for (let rank = 0; rank <= 7; rank++){
        white = !white
        for (let file = 0; file <= 7; file++){
            // Fill in the square
            ctx.fillStyle = white ? "white" : "brown"; 
            ctx.fillRect(file * 100, rank * 100, 100, 100);
            white = !white;
        }
    }
}

function renderPieces(){
    // Render the pieces
    for (let rank = 0; rank <= 7; rank++){
        for (let file = 0; file <= 7; file++){
            // Draw the piece on the square (if there is one)
            switch (board[rank][file]) {
                case 1:
                    ctx.drawImage(whitePawnImage, file * 100, rank * 100, 100, 100);
                    break;
                case -1:
                    ctx.drawImage(blackPawnImage, file * 100, rank * 100, 100, 100);
                    break;
                case 2:
                    ctx.drawImage(whiteKnightImage, file * 100, rank * 100, 100, 100);
                    break;
                case -2:
                    ctx.drawImage(blackKnightImage, file * 100, rank * 100, 100, 100);
                    break;
                case 3:
                    ctx.drawImage(whiteBishopImage, file * 100, rank * 100, 100, 100);
                    break;
                case -3:
                    ctx.drawImage(blackBishopImage, file * 100, rank * 100, 100, 100);
                    break;
                case 4:
                    ctx.drawImage(whiteRookImage, file * 100, rank * 100, 100, 100);
                    break;
                case -4:
                    ctx.drawImage(blackRookImage, file * 100, rank * 100, 100, 100);
                    break;
                case 5:
                    ctx.drawImage(whiteQueenImage, file * 100, rank * 100, 100, 100);
                    break;
                case -5:
                    ctx.drawImage(blackQueenImage, file * 100, rank * 100, 100, 100);
                    break;
                case 6:
                    ctx.drawImage(whiteKingImage, file * 100, rank * 100, 100, 100);
                    break;
                case -6:
                    ctx.drawImage(blackKingImage, file * 100, rank * 100, 100, 100);
                    break;
            }
        }
    }
}

function resetBoard(){
    board = [
        [-4, -2, -3, -5, -6, -3, -2, -4],
        [-1, -1, -1, -1, -1, -1, -1, -1],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 1, 1, 1],
        [4, 2, 3, 5, 6, 3, 2, 4]
    ]
}