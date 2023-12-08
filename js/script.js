
    const boardElement = document.getElementById('board');
    const board = createBoard();
    let currentPlayer = 'W';
    renderBoard(board);

    let selectedCell = null;

    function createBoard() {
        const board = [];
        for (let row = 0; row < 8; row++) {
            const rowData = [];
            for (let col = 0; col < 8; col++) {
                const cell = {
                    row,
                    col,
                    isWhite: (row + col) % 2 === 0,
                    piece: null,
                };
                if (row < 3 && cell.isWhite) {
                    cell.piece = 'W';
                } else if (row > 4 && cell.isWhite) {
                    cell.piece = 'B';
                }
                rowData.push(cell);
            }
            board.push(rowData);
        }
        return board;
    }

    function renderBoard(board) {
        boardElement.innerHTML = '';
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const cell = board[row][col];
                const cellElement = document.createElement('div');
                cellElement.classList.add('cell');
                cellElement.style.backgroundColor = cell.isWhite ? '#f0d9b5' : '#d18b47';

                // Attach the 'click' event listener to each cell
                cellElement.addEventListener('click', () => handleCellClick(cell));

                boardElement.appendChild(cellElement);

                if (cell.piece) {
                    const pieceElement = document.createElement('div');
                    pieceElement.classList.add('piece', cell.piece === 'W' ? 'piece-white' : 'piece-black');
                    cellElement.appendChild(pieceElement);
                }
            }
        }
    }
    
    function handleCellClick(cell) {
        if (!selectedCell) {
            // Select the piece to move
            if (cell.piece && isCurrentPlayerPiece(cell.piece)) {
                selectedCell = cell;
                highlightPossibleMoves(cell);
            }
        } else {
            // Move the selected piece
            if (isValidMove(selectedCell, cell)) {
                movePiece(selectedCell, cell);
                switchPlayer();
            }

            // Clear the selection and highlights
            clearSelection();
        }
    }

    function switchPlayer() {
        // Switch players between 'W' and 'B'
        currentPlayer = currentPlayer === 'W' ? 'B' : 'W';
    }

    function isCurrentPlayerPiece(piece) {
        // Check if the piece belongs to the current player
        return piece === currentPlayer;
    }

    function isValidMove(startCell, endCell) {
        const rowDiff = Math.abs(endCell.row - startCell.row);
        const colDiff = Math.abs(endCell.col - startCell.col);

        // Check if the destination cell is empty
        if (endCell.piece) {
            return false;
        }

        // Check if it's a regular move
        if (rowDiff === 1 && colDiff === 1) {
            return true;
        }

        // Check if it's a jump move
        if (rowDiff === 2 && colDiff === 2) {
            const jumpedRow = (startCell.row + endCell.row) / 2;
            const jumpedCol = (startCell.col + endCell.col) / 2;
            const jumpedCell = board[Math.floor(jumpedRow)][Math.floor(jumpedCol)];

            // Check if there is an opponent's piece to jump over
            return jumpedCell.piece && jumpedCell.piece !== startCell.piece;
        }

        return false;
    }

    function movePiece(startCell, endCell) {
        // Move the piece from startCell to endCell
        endCell.piece = startCell.piece;
        startCell.piece = null;

        // Update the visual representation of the board
        renderBoard(board);
    }


    function isCaptureMove(startCell, endCell) {
        // Check if it's a capturing move (jump move)
        return isValidMove(startCell, endCell) && Math.abs(endCell.row - startCell.row) === 2 && Math.abs(endCell.col - startCell.col) === 2;
    }
        

    function isCurrentPlayerPiece(piece) {
        // Replace with your player tracking logic
        return true;
    }

    function isValidMove(startCell, endCell) {
        const rowDiff = Math.abs(endCell.row - startCell.row);
        const colDiff = Math.abs(endCell.col - startCell.col);
    
        // Check if the destination cell is empty
        if (endCell.piece) {
            return false;
        }
    
        // Check if it's a regular move
        if (rowDiff === 1 && colDiff === 1) {
            return true;
        }
    
        // Check if it's a jump move
        if (rowDiff === 2 && colDiff === 2) {
            const jumpedRow = (startCell.row + endCell.row) / 2;
            const jumpedCol = (startCell.col + endCell.col) / 2;
            const jumpedCell = board[Math.floor(jumpedRow)][Math.floor(jumpedCol)];
    
            // Check if there is an opponent's piece to jump over
            return jumpedCell.piece && jumpedCell.piece !== startCell.piece;
        }
    
        return false;
    }

    function isCaptureMove(startCell, endCell) {
        // Check if it's a capturing move (jump move)
        const rowDiff = Math.abs(endCell.row - startCell.row);
        const colDiff = Math.abs(endCell.col - startCell.col);
    
        // Check if it's a valid move with a jump of two squares
        if (rowDiff === 2 && colDiff === 2) {
            const jumpedRow = (startCell.row + endCell.row) / 2;
            const jumpedCol = (startCell.col + endCell.col) / 2;
            const jumpedCell = board[Math.floor(jumpedRow)][Math.floor(jumpedCol)];
    
            // Check if there is an opponent's piece to jump over
            return jumpedCell.piece && jumpedCell.piece !== startCell.piece && !endCell.piece;
        }
    
        return false;
    }

    let jumpedRowIndex, jumpedColIndex;
    
    function performCapture(startCell, endCell) {
        // Capture the opponent's piece
        const jumpedRow = (startCell.row + endCell.row) / 2;
        const jumpedCol = (startCell.col + endCell.col) / 2;
        const jumpedRowIndex = Math.floor(jumpedRow);
        const jumpedColIndex = Math.floor(jumpedCol);
    
        // Log information about the captured piece
        const capturedPiece = board[jumpedRowIndex][jumpedColIndex].piece;
        console.log(`Captured piece at row ${jumpedRowIndex}, col ${jumpedColIndex}: ${capturedPiece}`);
    
        // Clear the piece from the logical representation of the board
        board[jumpedRowIndex][jumpedColIndex].piece = null;
    
        // Move the current piece to the destination cell
        movePiece(startCell, endCell);
    
        // Remove the HTML element of the jumped-over piece
        const jumpedCellElement = getCellElement(jumpedRowIndex, jumpedColIndex);
        jumpedCellElement.innerHTML = '';
    
        renderBoard(board);
    }
    
    

    function movePiece(startCell, endCell) {
        // Move the piece from startCell to endCell
        endCell.piece = startCell.piece;
        startCell.piece = null;

        // Update the visual representation of the board
        renderBoard(board);
    }

    function hasMoreCaptures(cell) {
        // Add your logic to check if there are more possible captures for the current player
        // For simplicity, we'll assume the player can keep capturing if available
        const possibleCaptures = getCapturingMoves(cell);
        return possibleCaptures.length > 0;
    }

    function highlightPossibleMoves(cell) {
        // Clear previous highlights
        clearHighlights();
    
        // Add your logic to highlight possible moves
        // For simplicity, we'll highlight the adjacent cells and capturing moves
        const adjacentCells = getAdjacentCells(cell);
        const capturingMoves = getCapturingMoves(cell);
    
        for (const adjCell of adjacentCells) {
            if (!adjCell.piece) {
                const cellElement = getCellElement(adjCell.row, adjCell.col);
                cellElement.classList.add('highlight');
            }
        }
    
        for (const capturingMove of capturingMoves) {
            if (!capturingMove.piece) {
                const cellElement = getCellElement(capturingMove.row, capturingMove.col);
                cellElement.classList.add('highlight-capture');
            }
        }
    }
    

    function getCapturingMoves(cell) {
        // Return capturing moves for the current player
        const capturingMoves = [];
        const rowOffsets = [-2, 2];
        const colOffsets = [-2, 2];
    
        for (const rowOffset of rowOffsets) {
            for (const colOffset of colOffsets) {
                const newRow = cell.row + rowOffset;
                const newCol = cell.col + colOffset;
                const capturedRow = (cell.row + newRow) / 2;
                const capturedCol = (cell.col + newCol) / 2;
    
                if (isValidCell(newRow, newCol) && isValidCell(capturedRow, capturedCol)) {
                    const capturedCell = board[capturedRow][capturedCol];
                    const capturingMove = board[newRow][newCol];
    
                    if (capturedCell.piece && capturedCell.piece !== cell.piece && !capturingMove.piece) {
                        capturingMoves.push(capturingMove);
                    }
                }
            }
        }
    
        return capturingMoves;
    }
    

    function getAdjacentCells(cell) {
        // Return adjacent cells (for simplicity, only diagonal moves)
        const adjacentCells = [];
        const rowOffsets = [-1, 1];
        const colOffsets = [-1, 1];

        for (const rowOffset of rowOffsets) {
            for (const colOffset of colOffsets) {
                const newRow = cell.row + rowOffset;
                const newCol = cell.col + colOffset;
                if (isValidCell(newRow, newCol)) {
                    adjacentCells.push(board[newRow][newCol]);
                }
            }
        }
        return adjacentCells;
    }

    function isValidCell(row, col) {
        return row >= 0 && row < 8 && col >= 0 && col < 8;
    }

    function getCellElement(row, col) {
        const index = row * 8 + col;
        return boardElement.children[index];
    }

    function clearSelection() {
        // Clear the selection and highlights
        selectedCell = null;
        clearHighlights();
    }

    
    function clearHighlights() {
        // Remove the highlight classes from all cells
        const highlightedCells = document.querySelectorAll('.highlight, .highlight-capture');
        highlightedCells.forEach(cell => cell.classList.remove('highlight', 'highlight-capture'));
    }
 
    function handleCellClick(cell) {
        if (!selectedCell) {
            // Select the piece to move
            if (cell.piece && isCurrentPlayerPiece(cell.piece)) {
                selectedCell = cell;
                highlightPossibleMoves(cell);
            }
        } else {
            // Move the selected piece
            if (isValidMove(selectedCell, cell)) {
                movePiece(selectedCell, cell);
                switchPlayer();
    
                // Check for capture moves
                if (isCaptureMove(selectedCell, cell)) {
                    performCapture(selectedCell, cell);
    
                    // Check for additional captures
                    if (hasMoreCaptures(cell)) {
                        // Allow for consecutive captures
                        selectedCell = cell;
                        highlightPossibleMoves(cell);
                        return;
                    }
                }
    
                // Clear the selection and highlights
                clearSelection();
            }
        }
    }