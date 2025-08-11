"use strict";
console.log("[boot] MemeGen Sprint 2 (minimal)");
/*GLOBALS*/
var gImgs = [
  { id: 1, url: "../assets/meme-img/1.jpg", title: "Meme 1" },
  { id: 2, url: "../assets/meme-img/2.jpg", title: "Meme 2" },
  { id: 3, url: "../assets/meme-img/3.jpg", title: "Meme 3" },
];
var gCurrImgUrl = "";
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

  var strHtml = "";
  for (var i = 0; i < gImgs.length; i++) {
    var img = gImgs[i];
    strHtml +=
      '<article class="card">' +
      '<img src="' +
      img.url +
      '" alt="' +
      (img.title || "Meme") +
      '" onclick="onOpenPreview(this)">' +
      "</article>";
  }
  elGrid.innerHTML = strHtml;
}

function onOpenPreview(elImg) {
  if (!elImg) return;

  gCurrImgUrl = elImg.src;
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
  var src = gCurrImgUrl || (gImgs[0] && gImgs[0].url);
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
