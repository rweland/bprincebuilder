# WARNING: Potential spoilers for Blue Prince game mechanics and rooms!

# Blue Prince Floorplan Builder

An interactive tool for creating and visualizing floor plans for the Blue Prince video game. This application allows players to arrange rooms on a grid, track chess pieces found in rooms, and experiment with different layouts.

![Blue Prince Floorplan Builder](/screenshots/main.png)

## Try it!
You can try the live version of the Blue Prince Floorplan Builder  [Blue Prince Layout Builder](https://bprincebuilder.rweland.github.com). (Coming soon)

## Features

- **Interactive Grid Layout**: Drag and drop rooms onto a 5x8 grid
- **Room Rotation**: Rotate rooms to experiment with different orientations
- **Chess Piece Tracking**: Monitor which chess pieces have been placed on the grid
- **Advanced Filtering**: Filter rooms by category or by chess piece content
- **Dark/Light Mode**: Toggle between themes for comfortable viewing
- **Smart Filtering**: Hide rooms with duplicate chess pieces that are already on the grid

## Getting Started

### Prerequisites

- Node.js (v18.0.0 or higher)
- pnpm (v8.0.0 or higher)

### Installation

1. Clone the repository
```bash
git clone https://github.com/rweland/bprincebuilder.git
cd bprincebuilder
```

2. Install dependencies
```bash
pnpm install
```

3. Start the development server
```bash
pnpm dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

1. **Add Rooms**: Click on a room in the right panel, then click on an empty grid cell to place it. Alternatively, drag rooms directly from the search panel to the grid.

2. **Remove Rooms**: Click the red X button that appears when hovering over a placed room.

3. **Rotate Rooms**: Use the rotation buttons (↺, ↻) that appear when hovering over a placed room.

4. **Filter Rooms**: 
   - Use the search bar to find rooms by name
   - Click on category buttons to filter by room type
   - Enable "Show only rooms with chess pieces" to filter for rooms containing chess pieces
   - Enable "Hide rooms with duplicate chess pieces" to hide rooms that have the same chess pieces as those already on the grid

5. **Chess Piece Display**: View the missing chess pieces below the grid. Pieces fade out when placed on the grid and reappear when removed.

## Architecture

This application is built using:

- **React**: Functional components with hooks for state management
- **Styled Components**: For component-level styling and theming
- **Context API**: For theme management across the application

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project code is licensed under the MIT License - see the LICENSE file for details.

All room icons and game concepts are the property of their respective owners. This project is intended for educational and entertainment purposes only, and does not claim ownership of any original game assets.
