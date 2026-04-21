const API_URL = 'http://localhost:3000/api';

let currentState = {
  originalText: '',
  encoded: '',
  codes: {},
  steps: [],
  treeData: []
};

const inputText = document.getElementById('inputText');
const encodeBtn = document.getElementById('encodeBtn');
const resetBtn = document.getElementById('resetBtn');
const decodeBtn = document.getElementById('decodeBtn');
const copyEncodedBtn = document.getElementById('copyEncodedBtn');
const treeCanvas = document.getElementById('treeCanvas');
const codesContainer = document.getElementById('codesContainer');
const stepsContainer = document.getElementById('stepsContainer');
const decodedOutput = document.getElementById('decodedOutput');
const stepsModal = document.getElementById('stepsModal');
const closeModal = document.querySelector('.close');

encodeBtn.addEventListener('click', handleEncode);
resetBtn.addEventListener('click', handleReset);
decodeBtn.addEventListener('click', handleDecode);
copyEncodedBtn.addEventListener('click', handleCopyEncoded);
closeModal.addEventListener('click', () => stepsModal.classList.remove('show'));

window.addEventListener('click', (e) => {
  if (e.target === stepsModal) {
    stepsModal.classList.remove('show');
  }
});

async function handleEncode() {
  const text = inputText.value.trim();

  if (!text) {
    alert('Please enter some text to compress');
    return;
  }

  encodeBtn.disabled = true;
  encodeBtn.textContent = 'Encoding...';

  try {
    const response = await fetch(`${API_URL}/encode`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text })
    });

    const data = await response.json();

    if (response.ok) {
      currentState = {
        originalText: text,
        encoded: data.encoded,
        codes: data.codes,
        steps: data.steps,
        treeData: data.treeData
      };

      updateUI(data);
    } else {
      alert(`Error: ${data.error}`);
    }
  } catch (error) {
    alert(`Error: ${error.message}`);
    console.error(error);
  } finally {
    encodeBtn.disabled = false;
    encodeBtn.textContent = 'Compress (Encode)';
  }
}

function updateUI(data) {
  document.getElementById('originalSize').textContent = data.originalSize;
  document.getElementById('compressedSize').textContent = data.encodedSize;
  document.getElementById('compressionRatio').textContent = data.compressionRatio;
  document.getElementById('uniqueChars').textContent = Object.keys(data.codes).length;
  document.getElementById('avgBitsPerChar').textContent = (data.encoded.length / data.originalSize).toFixed(2);

  displayCodes(data.codes);
  drawTree(data.treeData);
  displayEncodedText(data.encoded);
  displaySteps(data.steps);

  decodedOutput.style.display = 'none';
}

function displayCodes(codes) {
  codesContainer.innerHTML = '';

  const sortedCodes = Object.entries(codes).sort((a, b) => a[1].length - b[1].length);

  sortedCodes.forEach(([char, code]) => {
    const displayChar = char === ' ' ? 'SPACE' : (char === '\n' ? 'NEWLINE' : char);
    const codeItem = document.createElement('div');
    codeItem.className = 'code-item';
    codeItem.innerHTML = `
      <div class="code-char">'${displayChar}'</div>
      <div class="code-binary">${code}</div>
    `;
    codesContainer.appendChild(codeItem);
  });
}

function drawTree(treeData) {
  const ctx = treeCanvas.getContext('2d');
  ctx.clearRect(0, 0, treeCanvas.width, treeCanvas.height);

  if (!treeData || treeData.length === 0) {
    ctx.fillStyle = '#999';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('No tree data', treeCanvas.width / 2, treeCanvas.height / 2);
    return;
  }

  const connectedNodes = new Set();
  for (let i = 0; i < treeData.length; i++) {
    for (let j = i + 1; j < treeData.length; j++) {
      const node1 = treeData[i];
      const node2 = treeData[j];

      if (Math.abs(node2.y - node1.y) > 50 && Math.abs(node2.y - node1.y) < 100) {
        if ((node2.x < node1.x && Math.abs(node2.x - (node1.x - 50)) < 60) ||
          (node2.x > node1.x && Math.abs(node2.x - (node1.x + 50)) < 60)) {
          ctx.strokeStyle = '#ccc';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(node1.x + treeCanvas.width / 2, node1.y + 50);
          ctx.lineTo(node2.x + treeCanvas.width / 2, node2.y + 50);
          ctx.stroke();
        }
      }
    }
  }

  treeData.forEach(node => {
    const x = node.x + treeCanvas.width / 2;
    const y = node.y + 50;

    ctx.fillStyle = node.isLeaf ? '#4CAF50' : '#2196F3';
    ctx.beginPath();
    ctx.arc(x, y, 25, 0, 2 * Math.PI);
    ctx.fill();

    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = 'white';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const displayText = node.char === ' ' ? 'SP' : (node.char === '\n' ? 'NL' : node.char);
    if (node.isLeaf) {
      ctx.fillText(displayText, x, y - 8);
      ctx.font = '10px Arial';
      ctx.fillText(node.freq, x, y + 8);
    } else {
      ctx.fillText(node.freq, x, y);
    }
  });
}

function displayEncodedText(encoded) {
  const displayText = encoded.length > 200 ? encoded.substring(0, 200) + '...' : encoded;
  document.getElementById('encodedText').textContent = displayText;
}

function displaySteps(steps) {
  stepsContainer.innerHTML = '';

  const displaySteps = steps.slice(0, 10);

  if (displaySteps.length === 0) {
    stepsContainer.innerHTML = '<p class="placeholder">No steps available</p>';
    return;
  }

  displaySteps.forEach((step, index) => {
    const stepItem = document.createElement('div');
    stepItem.className = 'step-item';

    let detail = '';
    if (step.type === 'create_leaf') {
      detail = `Created leaf node for '${step.char}' with frequency ${step.freq}`;
    } else if (step.type === 'merge') {
      detail = `Merged nodes: '${step.left}' (${step.leftFreq}) + '${step.right}' (${step.rightFreq}) = ${step.parentFreq}`;
    } else if (step.type === 'code_generated') {
      detail = `Generated code for '${step.char}': ${step.code}`;
    }

    stepItem.innerHTML = `
      <div class="step-type">Step ${index + 1}: ${step.type.replace(/_/g, ' ').toUpperCase()}</div>
      <div class="step-detail">${detail}</div>
    `;
    stepsContainer.appendChild(stepItem);
  });

  if (steps.length > 10) {
    const moreBtn = document.createElement('button');
    moreBtn.className = 'btn btn-small btn-primary';
    moreBtn.textContent = `View All ${steps.length} Steps`;
    moreBtn.addEventListener('click', () => displayAllSteps(steps));
    stepsContainer.appendChild(moreBtn);
  }
}

function displayAllSteps(steps) {
  const modalContainer = document.getElementById('modalStepsContainer');
  modalContainer.innerHTML = '';

  steps.forEach((step, index) => {
    const stepItem = document.createElement('div');
    stepItem.className = 'step-item';

    let detail = '';
    if (step.type === 'create_leaf') {
      detail = `Created leaf node for '${step.char}' with frequency ${step.freq}`;
    } else if (step.type === 'merge') {
      detail = `Merged nodes: '${step.left}' (${step.leftFreq}) + '${step.right}' (${step.rightFreq}) = ${step.parentFreq}`;
    } else if (step.type === 'code_generated') {
      detail = `Generated code for '${step.char}': ${step.code}`;
    }

    stepItem.innerHTML = `
      <div class="step-type">Step ${index + 1}: ${step.type.replace(/_/g, ' ').toUpperCase()}</div>
      <div class="step-detail">${detail}</div>
    `;
    modalContainer.appendChild(stepItem);
  });

  stepsModal.classList.add('show');
}

async function handleDecode() {
  if (!currentState.encoded) {
    alert('Please encode text first');
    return;
  }

  decodeBtn.disabled = true;
  decodeBtn.textContent = 'Decoding...';

  try {
    const response = await fetch(`${API_URL}/decode`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        encoded: currentState.encoded,
        codes: currentState.codes
      })
    });

    const data = await response.json();

    if (response.ok) {
      displayDecodedResult(data.decoded);
    } else {
      alert(`Error: ${data.error}`);
    }
  } catch (error) {
    alert(`Error: ${error.message}`);
    console.error(error);
  } finally {
    decodeBtn.disabled = false;
    decodeBtn.textContent = 'Decompress (Decode)';
  }
}

function displayDecodedResult(decoded) {
  document.getElementById('decodedText').textContent = decoded;
  decodedOutput.style.display = 'block';

  const isMatch = decoded === currentState.originalText;
  const verificationMsg = document.getElementById('verificationMessage');
  if (isMatch) {
    verificationMsg.textContent = '✓ Decompression successful! Original text recovered perfectly.';
    verificationMsg.className = 'verification success';
  } else {
    verificationMsg.textContent = '✗ Decompression failed! Text does not match original.';
    verificationMsg.className = 'verification error';
  }
}

function handleCopyEncoded() {
  const encoded = currentState.encoded;
  if (!encoded) {
    alert('No encoded text to copy');
    return;
  }

  navigator.clipboard.writeText(encoded).then(() => {
    const originalText = copyEncodedBtn.textContent;
    copyEncodedBtn.textContent = 'Copied!';
    setTimeout(() => {
      copyEncodedBtn.textContent = originalText;
    }, 2000);
  }).catch(err => {
    alert('Failed to copy: ' + err);
  });
}

function handleReset() {
  inputText.value = '';
  currentState = {
    originalText: '',
    encoded: '',
    codes: {},
    steps: [],
    treeData: []
  };

  document.getElementById('originalSize').textContent = '-';
  document.getElementById('compressedSize').textContent = '-';
  document.getElementById('compressionRatio').textContent = '-';
  document.getElementById('uniqueChars').textContent = '-';
  document.getElementById('avgBitsPerChar').textContent = '-';

  codesContainer.innerHTML = '<p class="placeholder">Codes will appear here after compression</p>';
  stepsContainer.innerHTML = '<p class="placeholder">Steps will appear here after compression</p>';
  document.getElementById('encodedText').textContent = '-';
  decodedOutput.style.display = 'none';

  const ctx = treeCanvas.getContext('2d');
  ctx.clearRect(0, 0, treeCanvas.width, treeCanvas.height);

  inputText.focus();
}

document.addEventListener('DOMContentLoaded', () => {
  inputText.focus();
});

console.log('Huffman Coding Visualizer Ready!');
