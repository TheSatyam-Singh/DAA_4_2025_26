// Huffman Node class
class HuffmanNode {
  constructor(char, freq) {
    this.char = char;
    this.freq = freq;
    this.left = null;
    this.right = null;
  }
}

// Priority Queue using Min Heap
class PriorityQueue {
  constructor() {
    this.items = [];
  }

  enqueue(node) {
    let added = false;
    for (let i = 0; i < this.items.length; i++) {
      if (node.freq < this.items[i].freq) {
        this.items.splice(i, 0, node);
        added = true;
        break;
      }
    }
    if (!added) {
      this.items.push(node);
    }
  }

  dequeue() {
    return this.items.shift();
  }

  isEmpty() {
    return this.items.length === 0;
  }

  size() {
    return this.items.length;
  }

  getAll() {
    return [...this.items];
  }
}

// Main Huffman Coding class
class HuffmanCoder {
  constructor() {
    this.root = null;
    this.codes = {};
    this.steps = [];
  }

  // Build frequency table from text
  buildFrequencyTable(text) {
    const frequency = {};
    for (let char of text) {
      frequency[char] = (frequency[char] || 0) + 1;
    }
    return frequency;
  }

  // Build Huffman Tree
  buildTree(text) {
    const frequency = this.buildFrequencyTable(text);
    const pq = new PriorityQueue();

    // Create leaf nodes and add to priority queue
    for (let char in frequency) {
      const node = new HuffmanNode(char, frequency[char]);
      pq.enqueue(node);
      this.steps.push({
        type: 'create_leaf',
        char: char,
        freq: frequency[char],
        queue: pq.getAll()
      });
    }

    // Build tree
    while (pq.size() > 1) {
      const left = pq.dequeue();
      const right = pq.dequeue();

      const parent = new HuffmanNode(null, left.freq + right.freq);
      parent.left = left;
      parent.right = right;

      pq.enqueue(parent);

      this.steps.push({
        type: 'merge',
        left: left.char || '(merge)',
        right: right.char || '(merge)',
        leftFreq: left.freq,
        rightFreq: right.freq,
        parentFreq: parent.freq,
        queue: pq.getAll()
      });
    }

    this.root = pq.dequeue();
    return this.root;
  }

  // Generate Huffman codes from tree
  generateCodes() {
    this.codes = {};
    this._generateCodesHelper(this.root, '');
    return this.codes;
  }

  _generateCodesHelper(node, code) {
    if (!node) return;

    if (node.char !== null) {
      this.codes[node.char] = code || '0';
      this.steps.push({
        type: 'code_generated',
        char: node.char,
        code: code || '0'
      });
      return;
    }

    if (node.left) {
      this._generateCodesHelper(node.left, code + '0');
    }
    if (node.right) {
      this._generateCodesHelper(node.right, code + '1');
    }
  }

  // Encode text
  encode(text) {
    this.steps = [];
    this.buildTree(text);
    this.generateCodes();

    let encoded = '';
    for (let char of text) {
      encoded += this.codes[char];
    }

    return {
      encoded: encoded,
      codes: this.codes,
      steps: this.steps,
      originalSize: text.length,
      encodedSize: Math.ceil(encoded.length / 8),
      compressionRatio: ((1 - Math.ceil(encoded.length / 8) / text.length) * 100).toFixed(2)
    };
  }

  // Decode text
  decode(encoded, codes) {
    let decoded = '';
    let currentCode = '';

    // Reverse the codes map
    const reverseMap = {};
    for (let char in codes) {
      reverseMap[codes[char]] = char;
    }

    for (let bit of encoded) {
      currentCode += bit;
      if (reverseMap[currentCode]) {
        decoded += reverseMap[currentCode];
        currentCode = '';
      }
    }

    return decoded;
  }

  // Get tree visualization data
  getTreeData(node = this.root, x = 0, y = 0, offsetX = 100) {
    if (!node) return [];

    const result = [{
      char: node.char || '(merge)',
      freq: node.freq,
      x: x,
      y: y,
      isLeaf: node.char !== null
    }];

    if (node.left) {
      result.push(...this.getTreeData(node.left, x - offsetX, y + 80, offsetX / 2));
    }
    if (node.right) {
      result.push(...this.getTreeData(node.right, x + offsetX, y + 80, offsetX / 2));
    }

    return result;
  }
}

module.exports = { HuffmanCoder, HuffmanNode, PriorityQueue };
