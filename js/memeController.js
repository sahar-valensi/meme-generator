"use strict";
console.log("[boot] MemeGen Sprint 2 (minimal)");
/*GLOBALS*/
var gElCanvas;
var gCtx;

const modal = document.getElementById("img-modal");
const modalImg = document.getElementById("modal-image");
const btnClose = document.getElementById("modal-close");

function onInit() {
  initModal();
  window.onOpenPreview = onOpenPreview;
  window.onClosePreview = onClosePreview;
  window.onModalClick = onModalClick;
  window.onOpenEditor = onOpenEditor;
  renderGallery();
}

function renderGallery() {
  var elGrid = document.querySelector(".gallery-grid");
  if (!elGrid) return;

  var imgs = getImgs();
  var strHtml = "";
  for (var i = 0; i < imgs.length; i++) {
    var img = imgs[i];
    strHtml +=
      '<article class="card">' +
      '<img src="' +
      img.url +
      '" alt="meme" data-id="' +
      img.id +
      '" onclick="onOpenPreview(this)">' +
      "</article>";
  }
  elGrid.innerHTML = strHtml;
}

function renderMeme() {
  var meme = getMeme();
  if (!meme || !gElCanvas) return;

  var url = getImgUrlById(meme.selectedImgId);
  if (!url) return;

  var img = new Image();
  img.onload = function () {
    var cw = gElCanvas.width,
      ch = gElCanvas.height;
    gCtx.clearRect(0, 0, cw, ch);

    var rect = getContainRect(img.width, img.height, cw, ch);
    gCtx.drawImage(img, rect.x, rect.y, rect.w, rect.h);

    var line = meme.lines[0];
    var x = Math.round(cw / 2);
    var y = Math.round(ch * 0.15);
    drawText(line.txt, x, y, line);
  };
  img.src = url;
}

function onOpenPreview(elImg) {
  if (!elImg) return;
  var id = +elImg.getAttribute("data-id");
  if (id) setImg(id);

  setCurrImgUrl(elImg.src);
  modalImg.src = elImg.src;
  modalImg.alt = elImg.alt || "";

  modal.showModal();
  if (btnClose && btnClose.focus) btnClose.focus();
}

function onClosePreview() {
  modal.close();
}

function onOpenEditor() {
  onClosePreview();

  var elHome = document.getElementById("home");
  var elEditor = document.getElementById("editor");

  if (elHome) elHome.hidden = true;
  if (elEditor) elEditor.hidden = false;

  if (!gElCanvas) {
    gElCanvas = document.getElementById("meme-canvas");
    if (!gElCanvas) return;
    gCtx = gElCanvas.getContext("2d");
  }

  renderMeme();
  initEditor();
}

function onModalClick(event) {
  if (event.target === modal) {
    onClosePreview();
  }
}

function onKeyDown(event) {
  var isEsc = event.key === "Escape" || event.keyCode === 27;
  if (isEsc) onClosePreview();
}

function initModal() {
  document.addEventListener("keydown", onKeyDown);
}

function initEditor() {
  gElCanvas = document.getElementById("meme-canvas");
  if (!gElCanvas) return;
  gCtx = gElCanvas.getContext("2d");

  gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height);

  drawBaseImage();
}

function drawBaseImage() {
  var src = getCurrImgUrl() || (getImgs()[0] && getImgs()[0].url);
  if (!src) return;

  var img = new Image();
  img.onload = function () {
    var cw = gElCanvas.width;
    var ch = gElCanvas.height;

    gCtx.clearRect(0, 0, cw, ch);

    var rect = getContainRect(img.width, img.height, cw, ch);
    gCtx.drawImage(img, rect.x, rect.y, rect.w, rect.h);
  };
  img.src = src;
}

function drawText(txt, x, y, line) {
  gCtx.lineWidth = 2;
  gCtx.font = (line.size || 20) + 'px Impact, Arial';
  gCtx.textAlign = line.align || 'center';
  gCtx.textBaseline = 'middle';
  gCtx.fillStyle = line.color || 'red';
  gCtx.strokeStyle = '#000000';
  gCtx.fillText(txt || '', x, y);
  gCtx.strokeText(txt || '', x, y);
}

function onTxtInput(val) {
  setLineTxt(val); 
  renderMeme();
}

function getContainRect(iw, ih, cw, ch) {
  var ratio = Math.min(cw / iw, ch / ih);
  var w = Math.round(iw * ratio);
  var h = Math.round(ih * ratio);
  var x = Math.round((cw - w) / 2);
  var y = Math.round((ch - h) / 2);
  return { x: x, y: y, w: w, h: h };
}
// initModal();

// window.onOpenPreview  = onOpenPreview;
// window.onClosePreview = onClosePreview;
// window.onModalClick = onModalClick;
