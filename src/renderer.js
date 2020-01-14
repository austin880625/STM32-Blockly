const prompt = require('electron-prompt');
const { ipcRenderer } = require('electron');
const { readFileSync } = require('fs');
const $ = require('jquery');

let devList = [];

ipcRenderer.on('dev-list-update', function(e, arg) {
  devList = arg.list;
  let listHTML = devList.map((item) => `<option value="${item}">${item}</option>`).join('\n');
  $("#port_list").html(listHTML);
});

ipcRenderer.on('command-reply', function(e, arg) {
  if(arg.command == "1" || arg.command == "5") {
    $("#current_option").text(arg.value);
  } else if(arg.command == "") {
  }
  $(".spinner").hide();
});

$(document).ready(function() {
  ipcRenderer.send('dev-list-update');
  $(".btn").click(function() {
    $(".spinner").show();
  });
  $("#upload_btn").click(function(e) {
    console.log('upload');
    let dev = "/dev/" + $("#port_list").val();
    let fileInput = document.getElementById("bin_file");
    if(typeof fileInput.files[0] !== 'undefined') {
      let binaryPath = fileInput.files[0].path;
      console.log(binaryPath);
      ipcRenderer.send('run-command', [dev, "4", binaryPath]);
    }
  });
  $("#get_btn").click(function(e) {
    console.log('get');
    let dev = "/dev/" + $("#port_list").val();
    ipcRenderer.send('run-command', [dev, "1"]);
  });
  $("#set_btn").click(function(e) {
    console.log('set');
    let newOption = $("#new_option").val() || "0";
    let dev = "/dev/" + $("#port_list").val();
    ipcRenderer.send('run-command', [dev, "5", newOption]);
  });
  $("#run_btn").click(function(e) {
    console.log('run');
    let dev = "/dev/" + $("#port_list").val();
    ipcRenderer.send('run-command', [dev, "2"]);
  });
  $("#reset_btn").click(function(e) {
    console.log('reset');
    let dev = "/dev/" + $("#port_list").val();
    ipcRenderer.send('run-command', [dev, "3"]);
  });
});