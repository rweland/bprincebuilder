import React from 'react';
import styled from 'styled-components';
import { lightTheme, darkTheme } from '../../utils/theme';

/**
 * Search section component that displays room search functionality and room cards
 * @param {Object} props - Component props
 * @param {string} props.theme - Current theme ('light' or 'dark')
 * @param {string} props.searchQuery - Current search query
 * @param {Function} props.setSearchQuery - Function to update search query
 * @param {Array} props.categories - Array of available room categories
 * @param {string} props.selectedCategory - Currently selected category
 * @param {Function} props.handleCategoryChange - Handler for category changes
 * @param {boolean} props.showChessRoomsOnly - Whether to show only rooms with chess pieces
 * @param {Function} props.handleChessFilterChange - Handler for chess filter changes
 * @param {boolean} props.hideDuplicateChessPieces - Whether to hide rooms with duplicate chess pieces
 * @param {Function} props.setHideDuplicateChessPieces - Function to toggle duplicate chess pieces filter
 * @param {boolean} props.isLoading - Whether rooms are being loaded
 * @param {Array} props.filteredRooms - Array of filtered rooms to display
 * @param {Object} props.selectedRoom - Currently selected room
 * @param {Function} props.handleRoomSelect - Handler for room selection
 * @param {Function} props.handleDragStart - Handler for drag start events
 * @param {Array} props.grid - Array of grid cells with room data
 */
const SearchSection = ({
    theme,
    searchQuery,
    setSearchQuery,
    categories,
    selectedCategory,
    handleCategoryChange,
    showChessRoomsOnly,
    handleChessFilterChange,
    hideDuplicateChessPieces,
    setHideDuplicateChessPieces,
    isLoading,
    filteredRooms,
    selectedRoom,
    handleRoomSelect,
    handleDragStart,
    grid
}) => {
    return (
        <SearchSectionContainer theme={theme}>
            <Header theme={theme}>Room Search</Header>
            <SearchInput
                type="text"
                placeholder="Search rooms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                theme={theme}
            />

            <CategoryFilter>
                {categories.map(category => (
                    <CategoryButton
                        key={category}
                        selected={selectedCategory === category}
                        onClick={() => handleCategoryChange(category)}
                        theme={theme}
                    >
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                    </CategoryButton>
                ))}
            </CategoryFilter>

            <ChessFilter>
                <ChessFilterCheckbox
                    type="checkbox"
                    id="chessFilter"
                    checked={showChessRoomsOnly}
                    onChange={handleChessFilterChange}
                />
                <ChessFilterLabel htmlFor="chessFilter" theme={theme}>
                    Show only rooms with chess pieces
                </ChessFilterLabel>
            </ChessFilter>

            <ChessFilter>
                <ChessFilterCheckbox
                    type="checkbox"
                    id="duplicateChessPieceFilter"
                    checked={hideDuplicateChessPieces}
                    onChange={() => setHideDuplicateChessPieces(!hideDuplicateChessPieces)}
                />
                <ChessFilterLabel htmlFor="duplicateChessPieceFilter" theme={theme}>
                    Hide rooms with duplicate chess pieces
                </ChessFilterLabel>
            </ChessFilter>

            {isLoading ? (
                <LoadingIndicator theme={theme}>Loading rooms...</LoadingIndicator>
            ) : (
                <RoomCardsContainer theme={theme}>
                    {filteredRooms.map(room => {
                        // Check if this room is already placed in the grid
                        const isPlaced = grid.some(cell => cell && cell.id === room.id);

                        return (
                            <RoomCard
                                key={room.id}
                                selected={selectedRoom && selectedRoom.id === room.id}
                                onClick={() => handleRoomSelect(room)}
                                theme={theme}
                                draggable={!isPlaced}
                                onDragStart={(e) => handleDragStart(e, room)}
                                imageUrl={room.imageUrl}
                                disabled={isPlaced}
                            >
                                {room.chess && <span>♟ {room.chess}</span>}
                            </RoomCard>
                        );
                    })}
                    {filteredRooms.length === 0 && (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '20px' }}>
                            No rooms found matching your criteria.
                        </div>
                    )}
                </RoomCardsContainer>
            )}
        </SearchSectionContainer>
    );
};

// Styled components
const SearchSectionContainer = styled.div`
  flex: 4;
  background-color: ${props => props.theme === 'dark' ? darkTheme.cardBackground : lightTheme.cardBackground};
  border-radius: 8px;
  box-shadow: 0 2px 10px ${props => props.theme === 'dark' ? darkTheme.shadowColor : lightTheme.shadowColor};
  padding: 20px;
  display: flex;
  flex-direction: column;
  overflow: auto;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
`;

const Header = styled.h1`
  color: ${props => props.theme === 'dark' ? darkTheme.textColor : lightTheme.textColor};
  margin-bottom: 20px;
  text-align: center;
  transition: color 0.3s ease;
`;

const SearchInput = styled.input`
  padding: 10px 15px;
  font-size: 16px;
  border: 1px solid ${props => props.theme === 'dark' ? darkTheme.borderColor : lightTheme.borderColor};
  border-radius: 4px;
  margin-bottom: 20px;
  width: 100%;
  box-sizing: border-box;
  background-color: ${props => props.theme === 'dark' ? darkTheme.emptyCellBackground : lightTheme.cardBackground};
  color: ${props => props.theme === 'dark' ? darkTheme.textColor : lightTheme.textColor};
  transition: border-color 0.3s ease, background-color 0.3s ease, color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme === 'dark' ? darkTheme.primaryColor : lightTheme.primaryColor};
  }
`;

const CategoryFilter = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 15px;
`;

const CategoryButton = styled.button`
  padding: 5px 10px;
  border-radius: 20px;
  background-color: ${props => {
        if (props.selected) {
            return props.theme === 'dark' ? darkTheme.filterBackgroundSelected : lightTheme.filterBackgroundSelected;
        }
        return props.theme === 'dark' ? darkTheme.filterBackground : lightTheme.filterBackground;
    }};
  color: ${props => {
        if (props.selected) {
            return props.theme === 'dark' ? darkTheme.filterTextSelected : lightTheme.filterTextSelected;
        }
        return props.theme === 'dark' ? darkTheme.textColor : lightTheme.textColor;
    }};
  border: none;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => {
        if (props.selected) {
            return props.theme === 'dark' ? '#3d99e6' : '#0d8bf2';
        }
        return props.theme === 'dark' ? '#4d4d4d' : '#e0e0e0';
    }};
  }
`;

const ChessFilter = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  padding: 0 5px;
`;

const ChessFilterCheckbox = styled.input`
  margin-right: 10px;
  cursor: pointer;
`;

const ChessFilterLabel = styled.label`
  font-size: 14px;
  cursor: pointer;
  color: ${props => props.theme === 'dark' ? darkTheme.textColor : lightTheme.textColor};
`;

const LoadingIndicator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  color: ${props => props.theme === 'dark' ? darkTheme.secondaryTextColor : lightTheme.secondaryTextColor};
  transition: color 0.3s ease;
`;

const RoomCardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(186px, 1fr));
  gap: 15px;
  overflow-y: auto;
  flex-grow: 1;
  
  /* Ensure each grid cell maintains a square aspect ratio */
  & > * {
    aspect-ratio: 1 / 1;
  }
  
  /* Update scrollbar styles based on theme */
  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${props => props.theme === 'dark' ? darkTheme.scrollbarTrack : lightTheme.scrollbarTrack};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme === 'dark' ? darkTheme.scrollbarThumb : lightTheme.scrollbarThumb};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme === 'dark' ? darkTheme.scrollbarThumbHover : lightTheme.scrollbarThumbHover};
  }
`;

const RoomCard = styled.div`
  background-color: ${props => {
        if (props.selected) {
            return props.theme === 'dark' ? '#344f65' : '#e3f2fd';
        }
        return props.theme === 'dark' ? darkTheme.cardBackground : lightTheme.cardBackground;
    }};
  background-image: ${props => props.imageUrl ? `url(${props.imageUrl})` : 'none'};
  background-position: center;
  background-repeat: no-repeat;
  border: 1px solid ${props => {
        if (props.selected) {
            return props.theme === 'dark' ? darkTheme.primaryColor : lightTheme.primaryColor;
        }
        return props.theme === 'dark' ? darkTheme.borderColor : lightTheme.borderColor;
    }};
  border-radius: 4px;
  padding: 15px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'grab'};
  transition: all 0.2s ease;
  opacity: ${props => props.disabled ? 0.5 : 1};
  
  /* Ensure square aspect ratio with minimum size */
  min-width: 186px;
  min-height: 186px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  position: relative;
  
  &:hover {
    box-shadow: ${props => props.disabled ? 'none' : `0 2px 8px ${props.theme === 'dark' ? darkTheme.shadowColor : lightTheme.shadowColor}`};
    border-color: ${props => props.disabled ? (props.theme === 'dark' ? darkTheme.borderColor : lightTheme.borderColor) : (props.theme === 'dark' ? darkTheme.primaryColor : lightTheme.primaryColor)};
  }
  
  &:active {
    cursor: ${props => props.disabled ? 'not-allowed' : 'grabbing'};
  }
`;

export default SearchSection;