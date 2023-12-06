
    document.addEventListener('DOMContentLoaded', function () {
      const boardElement = document.getElementById('board');
      const board = createBoard();
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
            if (isCaptureMove(selectedCell, cell)) {
              performCapture(selectedCell, cell);
              if (!hasMoreCaptures(cell)) {
                switchPlayer();
              }
            } else {
              switchPlayer();
            }
          }
          clearSelection();
        }
      }

      function isCurrentPlayerPiece(piece) {
        // Replace with your player tracking logic
        return true;
      }

      function isValidMove(startCell, endCell) {
        // Add your move validation logic here
        // For simplicity, we'll assume pieces can only move diagonally
        const rowDiff = Math.abs(endCell.row - startCell.row);
        const colDiff = Math.abs(endCell.col - startCell.col);

        return rowDiff === 1 && colDiff === 1 && !endCell.piece;
      }

      function isCaptureMove(startCell, endCell) {
        // Add your logic to check if the move is a capturing move
        const rowDiff = Math.abs(endCell.row - startCell.row);
        const colDiff = Math.abs(endCell.col - startCell.col);

        return rowDiff === 2 && colDiff === 2 && !endCell.piece;
      }


    function performCapture(startCell, endCell) {
        // Capture the opponent's piece
        const capturedRow = (startCell.row + endCell.row) / 2;
        const capturedCol = (startCell.col + endCell.col) / 2;
        const capturedRowIndex = Math.floor(capturedRow);
        const capturedColIndex = Math.floor(capturedCol);
        board[capturedRowIndex][capturedColIndex].piece = null;
        renderBoard(board);
    }
    
    

      function hasMoreCaptures(cell) {
        // Add your logic to check if there are more possible captures for the current player
        // For simplicity, we'll assume the player can keep capturing if available
        const possibleCaptures = getCapturingMoves(cell);
        return possibleCaptures.length > 0;
      }

      function highlightPossibleMoves(cell) {
        // Add your logic to highlight possible moves
        // For simplicity, we'll highlight the adjacent cells and capturing moves
        const adjacentCells = getAdjacentCells(cell);
        const capturingMoves = getCapturingMoves(cell);

        for (const adjCell of adjacentCells) {
          const cellElement = getCellElement(adjCell.row, adjCell.col);
          cellElement.classList.add('highlight');
        }

        for (const capturingMove of capturingMoves) {
          const cellElement = getCellElement(capturingMove.row, capturingMove.col);
          cellElement.classList.add('highlight-capture');
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
              if (capturedCell.piece && capturedCell.piece !== cell.piece) {
                const capturingMove = board[newRow][newCol];
                if (!capturingMove.piece) {
                  capturingMoves.push(capturingMove);
                }
              }
            }
          }
        }

        return capturingMoves;
      }

      function getAdjacentCells(cell) {
        // Return adjacent cells (for simplicity, only diagonal moves)
        const adjacentCells = [];
        for (let rowOffset = -1; rowOffset <= 1; rowOffset += 2) {
          for (let colOffset = -1; colOffset <= 1; colOffset += 2) {
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
        const highlightedCells = document.querySelectorAll('.highlight, .highlight-capture');
        highlightedCells.forEach(cell => cell.classList.remove('highlight', 'highlight-capture'));
      }

      function switchPlayer() {
        // Add your logic to switch players
        // For simplicity, we'll assume two players taking turns
      }
    });
 