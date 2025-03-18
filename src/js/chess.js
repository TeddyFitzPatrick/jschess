/* Image assets for pieces */
// Pawns
const whitePawnImage = new Image(); whitePawnImage.src = "./src/assets/whitePawn.png";
const blackPawnImage = new Image(); blackPawnImage.src = "./src/assets/blackPawn.png";
// Bishops
const whiteBishopImage = new Image(); whiteBishopImage.src = "./src/assets/whiteBishop.png";
const blackBishopImage = new Image(); blackBishopImage.src = "./src/assets/blackBishop.png";
// Knights
const whiteKnightImage = new Image(); whiteKnightImage.src = "./src/assets/whiteKnight.png";
const blackKnightImage = new Image(); blackKnightImage.src = "./src/assets/blackKnight.png";
// Rooks
const whiteRookImage = new Image(); whiteRookImage.src = "./src/assets/whiteRook.png";
const blackRookImage = new Image(); blackRookImage.src = "./src/assets/blackRook.png";
// Kings
const whiteKingImage = new Image(); whiteKingImage.src = "./src/assets/whiteKing.png";
const blackKingImage = new Image(); blackKingImage.src = "./src/assets/blackKing.png";
// Queens
const whiteQueenImage = new Image(); whiteQueenImage.src = "./src/assets/whiteQueen.png";
const blackQueenImage = new Image(); blackQueenImage.src = "./src/assets/blackQueen.png";

/* Piece encodings */
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

/* Piece Move Rules */
const bishopMoveDirections = [
    [-1, -1], [-1, 1], 
    [1, -1], [1, 1]   
];
const knightMoveDirections = [
    [-2, -1], [-2, 1], 
    [-1, -2], [-1, 2],
    [1, -2], [1, 2],   
    [2, -1], [2, 1]    
];
const rookMoveDirections = [
    [-1, 0], [1, 0], 
    [0, -1], [0, 1]  
];
const queenMoveDirections = [
    [-1, -1], [-1, 1], [1, -1], [1, 1], 
    [-1, 0], [1, 0], [0, -1], [0, 1]    
];
const kingMoveDirections = [
    [-1, -1], [-1, 1], [1, -1], [1, 1], 
    [-1, 0], [1, 0], [0, -1], [0, 1]   
];

// Board State
let board
let canvas, ctx
let boardLength

// Player
let playerColor = "white";

// Gameplay
let turnToMove = "white";
let pieceHeldRank = null;
let pieceHeldFile = null;
let isHoldingPiece = false;

// castling and en passant
let kingMoved = false;

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

        // If holding a piece
        if (isHoldingPiece){
            // Legal move is played
            if (getLegalMoves(pieceHeldRank, pieceHeldFile).some(move => move[0] == rank && move[1] == file)){
                isHoldingPiece = false;
                // Move the piece from the old square to the new 
                board[rank][file] = board[pieceHeldRank][pieceHeldFile];
                board[pieceHeldRank][pieceHeldFile] = Piece.EMPTY;
            }
            // Reselect same piece to deselect
            else if (rank == pieceHeldRank && file == pieceHeldFile){
                isHoldingPiece = false;
            }
            // Select another piece
            else if (pieceClicked > 0){
                pickupPiece(rank, file);
            }
            // Empty spot clicked, deselect piece
            else{
                isHoldingPiece = false;
            }
        }
        // Pick up a piece
        else if (pieceClicked != Piece.EMPTY && pieceClicked > 0){
            pickupPiece(rank, file);
        }
        console.log("HOLDING_PIECE: " + isHoldingPiece);
        renderPieces();
    });

    // rendering
    render();
}

function pickupPiece(rank, file){
    isHoldingPiece = true;
    pieceHeldRank = rank;
    pieceHeldFile = file;
    // Highlight legal moves
    ctx.strokeStyle = "lightgreen";
    ctx.lineWidth = 8;
    ctx.fillStyle = "lightgreen";
    for (const [legalRank, legalFile] of getLegalMoves(rank, file)){
        // Draw a circle around legal spots to move
        // ctx.beginPath();
        // ctx.arc(legalFile * 100+50, legalRank * 100+50, 45, 0, Math.PI * 2);
        // ctx.stroke();
        ctx.strokeRect(legalFile * 100 + 2.5, legalRank * 100 + 2.5, 95, 95);
        // console.log(legalRank + ", " + legalFile); DEBUG
    }
}

function getLegalMoves(rank, file){
    // Get the piece type (Pawn, Bishop, Knight, ...)
    const piece = board[rank][file];
    let legalMoves = [];
    // Ignore empty
    if (piece == Piece.EMPTY) return legalMoves;
    // Pawns
    else if (piece == Piece.WHITE_PAWN){
        // Move forward 1
        if (isInBounds(rank-1, file) && board[rank-1][file] == Piece.EMPTY){
            legalMoves.push([rank-1,file]);
        }
        // Move forward 2 
        if (rank == 6 && isInBounds(rank-2, file) && board[rank-1][file] == Piece.EMPTY && board[rank-2][file] == Piece.EMPTY){
            legalMoves.push([rank-2,file]);
        }
        // Captures
        for (const df of [-1, 1]) {
            if (isInBounds(rank - 1, file + df) && board[rank - 1][file + df] < 0) {
                legalMoves.push([rank - 1, file + df]);
            }
        }
        // TODO: En passant
    }   
    // Bishops
    else if (piece == Piece.WHITE_BISHOP){
        for (const [dr, df] of bishopMoveDirections) {
            let newRank = rank + dr;
            let newFile = file + df;
            while (isInBounds(newRank, newFile) && board[newRank][newFile] <= 0) {
                // Move to empty square
                legalMoves.push([newRank, newFile]);
                // Capture
                if (board[newRank][newFile] < 0) break; 
                newRank += dr;
                newFile += df;
            }
        }
    }
    // Knights
    else if (piece == Piece.WHITE_KNIGHT){
        for (const [dr, df] of knightMoveDirections) {
            const newRank = rank + dr;
            const newFile = file + df;
            if (isInBounds(newRank, newFile) && board[newRank][newFile] <= 0) {
                legalMoves.push([newRank, newFile]);
            }
        }
    }
    // Rooks
    else if (piece == Piece.WHITE_ROOK){
        for (const [dr, df] of rookMoveDirections) {
            let newRank = rank + dr;
            let newFile = file + df;
            while (isInBounds(newRank, newFile) && board[newRank][newFile] <= 0) {
                // Move to empty square
                legalMoves.push([newRank, newFile]);
                // Capture
                if (board[newRank][newFile] < 0) break;
                newRank += dr;
                newFile += df;
            }
        }
    }
    // Queens
    else if (piece == Piece.WHITE_QUEEN) {
        for (const [dr, df] of queenMoveDirections) {
            let newRank = rank + dr;
            let newFile = file + df;
            while (isInBounds(newRank, newFile) && board[newRank][newFile] <= 0) {
                // Move to empty
                legalMoves.push([newRank, newFile]);
                // Capture
                if (board[newRank][newFile] < 0) break; 
                newRank += dr;
                newFile += df;
            }
        }
    }
    // Kings
    else if (piece == Piece.WHITE_KING) {
        for (const [dr, df] of kingMoveDirections) {
            let newRank = rank + dr;
            let newFile = file + df;
            if (isInBounds(newRank, newFile) && board[newRank][newFile] <= 0) {
                legalMoves.push([newRank, newFile]);
            }
        }
    }
    return legalMoves;
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
    renderBoard();
    renderPieces();
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

function renderPieces() {
    // Render the pieces
    for (let rank = 0; rank <= 7; rank++) {
        for (let file = 0; file <= 7; file++) {
            switch (board[rank][file]) {
                case Piece.WHITE_PAWN:
                    ctx.drawImage(whitePawnImage, file * 100, rank * 100, 100, 100);
                    break;
                case Piece.BLACK_PAWN:
                    ctx.drawImage(blackPawnImage, file * 100, rank * 100, 100, 100);
                    break;
                case Piece.WHITE_KNIGHT:
                    ctx.drawImage(whiteKnightImage, file * 100, rank * 100, 100, 100);
                    break;
                case Piece.BLACK_KNIGHT:
                    ctx.drawImage(blackKnightImage, file * 100, rank * 100, 100, 100);
                    break;
                case Piece.WHITE_BISHOP:
                    ctx.drawImage(whiteBishopImage, file * 100, rank * 100, 100, 100);
                    break;
                case Piece.BLACK_BISHOP:
                    ctx.drawImage(blackBishopImage, file * 100, rank * 100, 100, 100);
                    break;
                case Piece.WHITE_ROOK:
                    ctx.drawImage(whiteRookImage, file * 100, rank * 100, 100, 100);
                    break;
                case Piece.BLACK_ROOK:
                    ctx.drawImage(blackRookImage, file * 100, rank * 100, 100, 100);
                    break;
                case Piece.WHITE_QUEEN:
                    ctx.drawImage(whiteQueenImage, file * 100, rank * 100, 100, 100);
                    break;
                case Piece.BLACK_QUEEN:
                    ctx.drawImage(blackQueenImage, file * 100, rank * 100, 100, 100);
                    break;
                case Piece.WHITE_KING:
                    ctx.drawImage(whiteKingImage, file * 100, rank * 100, 100, 100);
                    break;
                case Piece.BLACK_KING:
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
        [0, 0, 0, 0, -1, 0, 0, 0],
        [0, 0, 0, 0, 0, -1, 0, 0],
        [1, 1, 1, 1, 0, 1, 1, 1],
        [4, 2, 3, 5, 6, 3, 2, 4]
    ]
}

function isInBounds(rank, file){
    return (rank >= 0 && rank <= 7) && (file >= 0 && file <= 7);
}