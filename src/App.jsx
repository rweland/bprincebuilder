import { useState, useEffect } from 'react';
import styled from 'styled-components';
import './App.css';
import { useTheme } from './ThemeContext';
import AppHeader from './components/AppHeader';
import GridSection from './components/GridSection';
import SearchSection from './components/SearchSection';

/**
 * Main application container component
 */
const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  padding: 80px 20px 20px;
  gap: 20px;
  background-color: ${props => props.theme === 'dark' ? '#1e1e1e' : '#f5f5f5'};
  color: ${props => props.theme === 'dark' ? '#e0e0e0' : '#333'};
  transition: background-color 0.3s ease, color 0.3s ease;
`;

/**
 * Main App component that coordinates the application functionality
 */
function App() {
  // Get the current theme from context
  const { theme } = useTheme();

  // Define the bottom middle cell index (5 columns, 8 rows, bottom middle is in the 7th row, 2nd column)
  const hardcodedRooms = [
    { id: 37, name: "Entrance Hall" },
    { id: 2, name: "Antechamber" },
    // Add more hardcoded rooms as needed
  ];

  // State for the 5x8 grid
  const [grid, setGrid] = useState(() => {
    // Initialize with all null cells
    const initialGrid = Array(40).fill(null);
    return initialGrid;
  });

  // State for cell rotations
  const [rotations, setRotations] = useState(() => {
    // Initialize with 0 degrees rotation for all cells
    return Array(40).fill(0);
  });

  // State for the selected room
  const [selectedRoom, setSelectedRoom] = useState(null);
  // State for the search query
  const [searchQuery, setSearchQuery] = useState('');
  // State for all rooms data
  const [rooms, setRooms] = useState([]);
  // State for filtered rooms based on search
  const [filteredRooms, setFilteredRooms] = useState([]);
  // State for loading status
  const [isLoading, setIsLoading] = useState(true);
  // State for selected category filter
  const [selectedCategory, setSelectedCategory] = useState('all');
  // State to track which cell is being dragged over
  const [dragOverIndex, setDragOverIndex] = useState(null);
  // State for chess piece filter
  const [showChessRoomsOnly, setShowChessRoomsOnly] = useState(false);
  // State for hiding rooms with duplicate chess pieces
  const [hideDuplicateChessPieces, setHideDuplicateChessPieces] = useState(false);

  // Fetch room data on component mount
  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}/roomdata.json`)
      .then(response => response.json())
      .then(data => {
        setRooms(data.rooms);
        setFilteredRooms(data.rooms);
        setIsLoading(false);


        // Update the grid with both rooms
        setGrid(prevGrid => {
          const newGrid = [...prevGrid];
          hardcodedRooms.forEach(staticRoom => {
            const room = data.rooms.find(dataRoom => dataRoom.name === staticRoom.name);
            if (!room) {
              console.warn(`Room ${staticRoom.name} not found in data.`);
              return;
            }
            newGrid[staticRoom.id] = room;
          })
          return newGrid;
        });
      })
      .catch(error => {
        console.error('Error loading room data:', error);
        setIsLoading(false);
      });
  }, []);

  // Update filtered rooms when search query, category, or chess filters change
  useEffect(() => {
    let filtered = rooms;

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(room => room.category === selectedCategory);
    }

    // Apply chess piece filter
    if (showChessRoomsOnly) {
      filtered = filtered.filter(room => room.chess !== null);
    }

    // Hide rooms with duplicate chess pieces
    if (hideDuplicateChessPieces) {
      const chessPiecesInGrid = new Set();
      grid.forEach(cell => {
        if (cell && cell.chess) {
          chessPiecesInGrid.add(cell.chess.toLowerCase());
        }
      });

      filtered = filtered.filter(room => {
        // Keep rooms with no chess pieces or with chess pieces not in the grid
        return !room.chess || !chessPiecesInGrid.has(room.chess.toLowerCase());
      });
    }

    // Apply search filter
    if (searchQuery.trim() !== '') {
      const lowercasedQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(room =>
        room.name.toLowerCase().includes(lowercasedQuery)
      );
    }

    setFilteredRooms(filtered);
  }, [searchQuery, rooms, selectedCategory, showChessRoomsOnly, hideDuplicateChessPieces, grid]);

  // Get unique categories from rooms
  const categories = ['all', ...new Set(rooms.map(room => room.category))];

  // Handle room card selection
  const handleRoomSelect = (room) => {
    // Check if room is already placed in the grid
    if (grid.some(cell => cell && cell.id === room.id)) {
      return; // Do nothing if room is already placed
    }
    setSelectedRoom(room);
  };

  // Handle grid cell click to place selected room
  const handleGridCellClick = (index) => {
    // Don't allow placing a room on the Entrance Hall cell or Antechamber cell
    if (hardcodedRooms.some(room => room.id === index)) {
      return;
    }

    if (selectedRoom) {
      const newGrid = [...grid];
      newGrid[index] = selectedRoom;
      setGrid(newGrid);
      setSelectedRoom(null);
    }
  };

  // Handle removing a room from the grid
  const handleRemoveRoom = (index, event) => {
    event.stopPropagation(); // Prevent triggering cell click

    // Don't allow removing the Entrance Hall or Antechamber
    if (hardcodedRooms.some(room => room.id === index)) {
      return;
    }

    const newGrid = [...grid];
    newGrid[index] = null;
    setGrid(newGrid);

    // Reset the rotation of the cell to 0
    setRotations(prevRotations => {
      const newRotations = [...prevRotations];
      newRotations[index] = 0;
      return newRotations;
    });
  };

  // Handle category filter change
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  // Handle rotating a room in the grid
  const handleRotateRoom = (index, direction, event) => {
    event.stopPropagation(); // Prevent triggering cell click

    // Ignore any hardcoded rooms
    if (hardcodedRooms.some(room => room.id === index)) {
      return;
    }

    setRotations(prevRotations => {
      const newRotations = [...prevRotations];
      // Add or subtract 90 degrees based on direction
      newRotations[index] = (newRotations[index] + (direction === 'left' ? -90 : 90)) % 360;
      // If rotation becomes -90, convert it to 270
      if (newRotations[index] < 0) newRotations[index] = 270;
      return newRotations;
    });
  };

  // Toggle chess rooms filter
  const handleChessFilterChange = () => {
    setShowChessRoomsOnly(!showChessRoomsOnly);
  };

  // Drag and drop handlers
  const handleDragStart = (e, room) => {
    // Prevent dragging if the room is already in the grid
    if (grid.some(cell => cell && cell.id === room.id)) {
      e.preventDefault();
      return;
    }

    e.dataTransfer.setData('application/json', JSON.stringify(room));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    // Don't allow dropping on the Entrance Hall cell or Antechamber cell
    if (hardcodedRooms.some(room => room.id === index)) {
      return;
    }

    e.preventDefault(); // Allow drop
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    setDragOverIndex(null);

    // Don't allow dropping on the Entrance Hall cell or Antechamber cell
    if (hardcodedRooms.some(room => room.id === index)) {
      return;
    }

    try {
      const roomData = JSON.parse(e.dataTransfer.getData('application/json'));
      const newGrid = [...grid];
      newGrid[index] = roomData;
      setGrid(newGrid);
    } catch (error) {
      console.error('Error dropping room:', error);
    }
  };

  // Get chess pieces from the grid
  const getChessPiecesAvailability = () => {
    // Initialize an object to track chess pieces
    const pieces = {
      king: 0,
      queen: 0,
      rook: 0,
      bishop: 0,
      knight: 0,
      pawn: 0
    };

    // Count the number of each chess piece in the grid
    grid.forEach(cell => {
      if (cell && cell.chess) {
        // Convert to lowercase to ensure case-insensitive matching
        const chessPiece = cell.chess.toLowerCase();
        if (chessPiece in pieces) {
          pieces[chessPiece]++;
        }
      }
    });

    // Create an array of chess piece objects with availability
    return [
      { name: 'King', symbol: '♚', available: pieces.king > 0 },
      { name: 'Queen', symbol: '♛', available: pieces.queen > 0 },
      { name: 'Rook', symbol: '♜', available: pieces.rook > 0 },
      { name: 'Bishop', symbol: '♝', available: pieces.bishop > 0 },
      { name: 'Knight', symbol: '♞', available: pieces.knight > 0 },
      { name: 'Pawn', symbol: '♟', available: pieces.pawn > 0 }
    ];
  };

  return (
    <>
      <AppHeader theme={theme} />
      <AppContainer theme={theme}>
        <GridSection
          theme={theme}
          grid={grid}
          rotations={rotations}
          hardcodedRooms={hardcodedRooms}
          dragOverIndex={dragOverIndex}
          handleGridCellClick={handleGridCellClick}
          handleDragOver={handleDragOver}
          handleDragLeave={handleDragLeave}
          handleDrop={handleDrop}
          handleRemoveRoom={handleRemoveRoom}
          handleRotateRoom={handleRotateRoom}
          getChessPiecesAvailability={getChessPiecesAvailability}
        />

        <SearchSection
          theme={theme}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          categories={categories}
          selectedCategory={selectedCategory}
          handleCategoryChange={handleCategoryChange}
          showChessRoomsOnly={showChessRoomsOnly}
          handleChessFilterChange={handleChessFilterChange}
          hideDuplicateChessPieces={hideDuplicateChessPieces}
          setHideDuplicateChessPieces={setHideDuplicateChessPieces}
          isLoading={isLoading}
          filteredRooms={filteredRooms}
          selectedRoom={selectedRoom}
          handleRoomSelect={handleRoomSelect}
          handleDragStart={handleDragStart}
          grid={grid}
        />
      </AppContainer>
    </>
  );
}

export default App;
