const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const { HuffmanCoder } = require('./huffman');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.static('public'));

// Routes

// Serve main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Encode endpoint
app.post('/api/encode', (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.length === 0) {
      return res.status(400).json({ error: 'Text cannot be empty' });
    }

    const coder = new HuffmanCoder();
    const result = coder.encode(text);

    res.json({
      success: true,
      encoded: result.encoded,
      codes: result.codes,
      steps: result.steps,
      originalSize: result.originalSize,
      encodedSize: result.encodedSize,
      compressionRatio: result.compressionRatio,
      treeData: coder.getTreeData()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Decode endpoint
app.post('/api/decode', (req, res) => {
  try {
    const { encoded, codes } = req.body;

    if (!encoded || !codes) {
      return res.status(400).json({ error: 'Encoded text and codes are required' });
    }

    const coder = new HuffmanCoder();
    const decoded = coder.decode(encoded, codes);

    res.json({
      success: true,
      decoded: decoded
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get compression statistics
app.post('/api/stats', (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.length === 0) {
      return res.status(400).json({ error: 'Text cannot be empty' });
    }

    const coder = new HuffmanCoder();
    const result = coder.encode(text);

    res.json({
      success: true,
      originalSize: result.originalSize,
      encodedSize: result.encodedSize,
      compressionRatio: result.compressionRatio,
      uniqueCharacters: Object.keys(result.codes).length,
      averageBitsPerCharacter: (result.encoded.length / text.length).toFixed(2)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Huffman Coding Visualizer running at http://localhost:${PORT}`);
  console.log(`📊 Open the browser and navigate to http://localhost:${PORT}`);
});
