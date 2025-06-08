import React from 'react';
import styled from 'styled-components';
import { lightTheme, darkTheme } from '../../utils/theme';
import ChessPieceDisplay from '../ChessPieceDisplay';

/**
 * Grid section component that displays the room layout grid
 * @param {Object} props - Component props
 * @param {string} props.theme - Current theme ('light' or 'dark')
 * @param {Array} props.grid - Array of grid cells with room data
 * @param {Array} props.rotations - Array of rotation values for each cell
 * @param {number} props.entranceHallIndex - Index of the entrance hall cell
 * @param {number|null} props.dragOverIndex - Index of the cell being dragged over, or null
 * @param {Function} props.handleGridCellClick - Handler for grid cell clicks
 * @param {Function} props.handleDragOver - Handler for drag over events
 * @param {Function} props.handleDragLeave - Handler for drag leave events
 * @param {Function} props.handleDrop - Handler for drop events
 * @param {Function} props.handleRemoveRoom - Handler for removing rooms
 * @param {Function} props.handleRotateRoom - Handler for rotating rooms
 * @param {Function} props.getChessPiecesAvailability - Function to get chess piece availability
 */
const GridSection = ({
    theme,
    grid,
    rotations,
    entranceHallIndex,
    dragOverIndex,
    handleGridCellClick,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleRemoveRoom,
    handleRotateRoom,
    getChessPiecesAvailability
}) => {
    return (
        <GridSectionContainer theme={theme}>
            <Header theme={theme}>Room Grid Layout</Header>
            <Instructions theme={theme}>
                Select a room from the right panel, then click on a grid cell to place it.
                You can also drag rooms directly from the search panel to the grid.
                Click the red X button to remove a room from the grid.
                Use the rotation buttons to rotate rooms clockwise or counterclockwise.
            </Instructions>
            <Grid>
                {grid.map((cell, index) => (
                    <GridCell
                        key={index}
                        hasRoom={cell !== null}
                        onClick={() => handleGridCellClick(index)}
                        theme={theme}
                        className={dragOverIndex === index ? 'drag-over' : ''}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, index)}
                        imageUrl={cell ? cell.imageUrl : null}
                        rotation={rotations[index]}
                    >
                        {cell ? (
                            <>
                                {cell.chess && <span style={{ fontSize: '14px' }}>{
                                    cell.chess.toLowerCase() === 'king' ? '♚' :
                                        cell.chess.toLowerCase() === 'queen' ? '♛' :
                                            cell.chess.toLowerCase() === 'rook' ? '♜' :
                                                cell.chess.toLowerCase() === 'bishop' ? '♝' :
                                                    cell.chess.toLowerCase() === 'knight' ? '♞' :
                                                        cell.chess.toLowerCase() === 'pawn' ? '♟' : '♟'
                                } {cell.chess}</span>}
                                {/* Only show remove button if this is not the Entrance Hall cell */}
                                {index !== entranceHallIndex &&
                                    <RemoveButton onClick={(e) => handleRemoveRoom(index, e)}>×</RemoveButton>
                                }
                                {/* Only show rotation buttons if this is not the Entrance Hall cell */}
                                {index !== entranceHallIndex && (
                                    <>
                                        <RotateLeftButton
                                            theme={theme}
                                            onClick={(e) => handleRotateRoom(index, 'left', e)}
                                            title="Rotate counterclockwise"
                                        >
                                            ↺
                                        </RotateLeftButton>
                                        <RotateRightButton
                                            theme={theme}
                                            onClick={(e) => handleRotateRoom(index, 'right', e)}
                                            title="Rotate clockwise"
                                        >
                                            ↻
                                        </RotateRightButton>
                                    </>
                                )}
                            </>
                        ) : (
                            <RoomName theme={theme}>Empty Cell</RoomName>
                        )}
                    </GridCell>
                ))}
            </Grid>
            <ChessPieceDisplay
                theme={theme}
                pieces={getChessPiecesAvailability()}
            />
        </GridSectionContainer>
    );
};

// Styled components
const GridSectionContainer = styled.div`
  flex: 6;
  background-color: ${props => props.theme === 'dark' ? darkTheme.cardBackground : lightTheme.cardBackground};
  border-radius: 8px;
  box-shadow: 0 2px 10px ${props => props.theme === 'dark' ? darkTheme.shadowColor : lightTheme.shadowColor};
  padding: 20px;
  overflow: auto;
  display: flex;
  flex-direction: column;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
`;

const Header = styled.h1`
  color: ${props => props.theme === 'dark' ? darkTheme.textColor : lightTheme.textColor};
  margin-bottom: 20px;
  text-align: center;
  transition: color 0.3s ease;
`;

const Instructions = styled.div`
  margin-bottom: 15px;
  background-color: ${props => props.theme === 'dark' ? darkTheme.instructionsBackground : lightTheme.instructionsBackground};
  border-radius: 4px;
  padding: 10px;
  font-size: 14px;
  color: ${props => props.theme === 'dark' ? darkTheme.textColor : lightTheme.textColor};
  transition: background-color 0.3s ease, color 0.3s ease;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 93px);
  grid-template-rows: repeat(8, 93px);
  gap: 10px;
  flex-grow: 1;
  justify-content: center;
`;

const GridCell = styled.div`
  width: 93px;
  height: 93px;
  background-color: ${props => {
        if (props.hasRoom) {
            return props.theme === 'dark' ? darkTheme.cardBackground : lightTheme.cardBackground;
        }
        return props.theme === 'dark' ? darkTheme.emptyCellBackground : lightTheme.emptyCellBackground;
    }};
  background-image: ${props => props.imageUrl ? `url(${props.imageUrl})` : 'none'};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border: 1px solid ${props => props.theme === 'dark' ? darkTheme.borderColor : lightTheme.borderColor};
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  text-align: center;
  padding: 10px;
  box-sizing: border-box;
  position: relative;
  transition: background-color 0.3s ease, border-color 0.3s ease;
  transform: rotate(${props => props.rotation || 0}deg);
  
  &:hover {
    background-color: ${props => {
        if (props.hasRoom) {
            return props.theme === 'dark' ? darkTheme.cardBackground : lightTheme.cardBackground;
        }
        return props.theme === 'dark' ? darkTheme.emptyCellHoverBackground : lightTheme.emptyCellHoverBackground;
    }};
    box-shadow: 0 2px 8px ${props => props.theme === 'dark' ? darkTheme.shadowColor : lightTheme.shadowColor};
  }
  
  &.drag-over {
    border: 2px dashed ${props => props.theme === 'dark' ? darkTheme.primaryColor : lightTheme.primaryColor};
    background-color: ${props => {
        if (props.theme === 'dark') {
            return 'rgba(77, 171, 245, 0.1)';
        }
        return 'rgba(33, 150, 243, 0.1)';
    }};
  }
`;

const RoomName = styled.p`
  margin: 0;
  font-size: 14px;
  color: ${props => props.theme === 'dark' ? darkTheme.textColor : lightTheme.textColor};
  word-break: break-word;
  transition: color 0.3s ease;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #f44336;
  color: white;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s;
  padding: 0;
  line-height: 1;

  ${GridCell}:hover & {
    opacity: 1;
  }
`;

const RotateButton = styled.button`
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${props => props.theme === 'dark' ? darkTheme.primaryColor : lightTheme.primaryColor};
  color: white;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s;
  padding: 0;
  line-height: 1;
  
  ${GridCell}:hover & {
    opacity: 1;
  }
`;

const RotateLeftButton = styled(RotateButton)`
  top: 5px;
  left: 5px;
`;

const RotateRightButton = styled(RotateButton)`
  top: 5px;
  left: 30px;
`;

export default GridSection;