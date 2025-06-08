import React from 'react';
import styled from 'styled-components';
import { lightTheme, darkTheme } from '../../utils/theme';

/**
 * Chess piece display component showing available and used chess pieces
 * @param {Object} props - Component props
 * @param {string} props.theme - Current theme ('light' or 'dark')
 * @param {Array} props.pieces - Array of chess piece objects with name, symbol, and availability status
 */
const ChessPieceDisplay = ({ theme, pieces }) => {
  return (
    <ChessPieceContainer theme={theme}>
      {pieces.map(piece => (
        <ChessPiece 
          key={piece.name} 
          name={piece.name} 
          available={!piece.available} 
          theme={theme}
        >
          {piece.symbol}
        </ChessPiece>
      ))}
    </ChessPieceContainer>
  );
};

// Styled components
const ChessPieceContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  gap: 15px;
  padding: 15px;
  padding-bottom: 35px;
  background-color: ${props => props.theme === 'dark' ? darkTheme.cardBackground : lightTheme.cardBackground};
  border-radius: 8px;
  box-shadow: 0 2px 10px ${props => props.theme === 'dark' ? darkTheme.shadowColor : lightTheme.shadowColor};
  flex-wrap: wrap;
`;

const ChessPiece = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: ${props => props.theme === 'dark' ? darkTheme.emptyCellBackground : lightTheme.emptyCellBackground};
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 32px;
  color: ${props => props.available ? (props.theme === 'dark' ? darkTheme.textColor : lightTheme.textColor) :
    (props.theme === 'dark' ? 'rgba(224, 224, 224, 0.3)' : 'rgba(51, 51, 51, 0.3)')};
  transition: all 0.3s ease;
  position: relative;
  
  &:after {
    content: "${props => props.name}";
    position: absolute;
    bottom: -20px;
    font-size: 12px;
    color: ${props => props.theme === 'dark' ? darkTheme.secondaryTextColor : lightTheme.secondaryTextColor};
  }
`;

export default ChessPieceDisplay;