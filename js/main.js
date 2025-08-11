"use strict";
console.log("[boot] MemeGen Sprint 2 (minimal)");
/*GLOBALS*/
var gImgs = [
  { id: 1, url: "../assets/meme-img/1.jpg", title: "Meme 1" },
  { id: 2, url: "../assets/meme-img/2.jpg", title: "Meme 2" },
  { id: 3, url: "../assets/meme-img/3.jpg", title: "Meme 3" },
];
var gCurrImgUrl = "";

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

  var elHome   = document.getElementById('home');
  var elEditor = document.getElementById('editor');

  if (elHome)   elHome.hidden = true;
  if (elEditor) elEditor.hidden = false;
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

// initModal();

// window.onOpenPreview  = onOpenPreview;
// window.onClosePreview = onClosePreview;
// window.onModalClick = onModalClick;
