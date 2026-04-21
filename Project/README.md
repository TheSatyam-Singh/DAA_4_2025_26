# 🔐 Huffman Coding Visualizer

An interactive simulator and visualizer for Huffman Coding file compression algorithm.

## Features

✨ **Core Features:**
- Text Compression using Huffman coding
- Text Decompression with verification
- Interactive Huffman tree visualization
- Huffman codes display for each character
- Compression statistics tracking
- Step-by-step process visualization

🎨 **Visualization:**
- Dynamic Huffman tree
- Green leaf nodes (characters)
- Blue merge nodes
- Real-time statistics dashboard
- Binary code display

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the server:**
   ```bash
   npm start
   ```

3. **Open in browser:**
   Open `http://localhost:3000`

## Usage

1. Enter text in the input area
2. Click "Compress (Encode)" to compress
3. View compression statistics and Huffman codes
4. Click "Decompress (Decode)" to verify
5. Explore the Huffman tree visualization

## How Huffman Coding Works

1. **Frequency Analysis**: Count character frequencies
2. **Build Frequency Table**: Create nodes for each character
3. **Priority Queue**: Maintain min-heap ordered by frequency
4. **Build Tree**: Merge lowest frequency nodes
5. **Generate Codes**: Assign binary codes based on tree
6. **Encode**: Replace characters with binary codes

## Project Structure

```
huffman-coding-visualizer/
├── package.json
├── server.js
├── huffman.js
├── public/
│   ├── index.html
│   ├── styles.css
│   └── script.js
└── README.md
```

## API Endpoints

### POST `/api/encode`
Encodes text using Huffman coding.

### POST `/api/decode`
Decodes Huffman-encoded binary.

### POST `/api/stats`
Gets compression statistics.

## Technical Details

- **Time Complexity**: O(n log n)
- **Space Complexity**: O(n)
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express.js

## License

MIT License
