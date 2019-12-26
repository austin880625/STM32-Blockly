const Blockly = require('blockly');
const { ipcRenderer } = require('electron');
const { readFileSync } = require('fs');

let blocklyArea = document.getElementById("blockly-area");
let blocklyRoot = document.getElementById("blockly-root");
let toolbox = readFileSync("toolbox.xml", { encoding: 'utf-8' });

let workspace = Blockly.inject(blocklyRoot, {
  toolbox: toolbox,
});

let onresize = (e = null) => {
  let element = blocklyArea;
  let x = 0, y = 0;
  do {
    x += element.offsetLeft;
    y += element.offsetTop;
    element = element.parentElement;
  } while (element);
  blocklyRoot.style.left = x + 'px';
  blocklyRoot.style.top = y + 'px';
  blocklyRoot.style.height = blocklyArea.offsetHeight + 'px';
  blocklyRoot.style.width = blocklyArea.offsetWidth + 'px';

  Blockly.svgResize(workspace);
}

onresize();

window.addEventListener('resize', onresize, false);
Blockly.svgResize(workspace);
