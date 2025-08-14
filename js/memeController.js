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
  document.addEventListener("keydown", onKeyDown);

  appendImgsUpTo(40);
  renderGallery();
}

function renderGallery() {
  var elGrid = document.querySelector(".gallery-grid");
  if (!elGrid) return;
 var strHtml =
  '<article class="card upload" onclick="onOpenUpload()">' +
    '<div class="upload-inner">' +
      '<span class="upload-icon" aria-hidden="true">📷</span>' +
      '<span class="upload-text">Upload photo</span>' +
    '</div>' +
  '</article>';

  var imgs = getImgs();
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

    for (var i = 0; i < meme.lines.length; i++) {
      var line = meme.lines[i] || {
        txt: "",
        size: 20,
        color: "red",
        align: "center",
      };
      var x =
        line.align === "left"
          ? 20
          : line.align === "right"
          ? cw - 20
          : Math.round(cw / 2);
      var y = getLineY(i, ch);

      drawText(line.txt, x, y, line);
    }
    if (meme.stickers && meme.stickers.length) {
      for (var s = 0; s < meme.stickers.length; s++) {
        drawSticker(meme.stickers[s]);
      }
    }
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
  renderStickerTrack();
  // initEditor();
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
  line = line || {};

  gCtx.lineWidth = 2;

  var family = (line.font && String(line.font).trim()) || "Impact, Arial";
  gCtx.font = (line.size || 30) + "px " + family;
  gCtx.textAlign = line.align || "center";
  gCtx.textBaseline = "middle";

  gCtx.lineJoin = "round";
  gCtx.miterLimit = 2;

  if (line.hasStroke !== false) {
    gCtx.lineWidth = line.strokeWidth || 8;
    gCtx.strokeStyle = line.stroke || "#ffffffff";
    gCtx.strokeText(txt || "", x, y);
  }

  gCtx.fillStyle = line.color || "red";
  gCtx.fillText(txt || "", x, y);
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

function onAddImages(maxId) {
  appendImgsUpTo(maxId);
  renderGallery();
}
/*CHANGE FONT SIZE */
function onFontInc() {
  console.log("font increace");
  changeFontSize(+2);
  renderMeme();
}

function onFontDec() {
  changeFontSize(-2);
  renderMeme();
}
/*TXT ALIGN */
function onAlignLeft() {
  setAlign("left");
  renderMeme();
}
function onAlignCenter() {
  setAlign("center");
  renderMeme();
}
function onAlignRight() {
  setAlign("right");
  renderMeme();
}
/*ADD/CHANGE/DELETE LINES*/
function onAddLine() {
  addLine("");
  _syncInputWithCurrentLine();
  _syncFontSelect();
  renderMeme();
}

function onDeleteLine() {
  deleteLine();
  _clearInput();
  _syncInputWithCurrentLine();
  _syncFontSelect();
  renderMeme();
}

function onSwitchLine(dir) {
  switchLine(dir);
  _syncInputWithCurrentLine();
  _syncFontSelect();
  renderMeme();
}
/*COLORS */
function onSetFillColor(color) {
  setFillColor(color);
  renderMeme();
}
function onSetStrokeColor(color) {
  setStrokeColor(color);
  renderMeme();
}
function onToggleStroke() {
  toggleStroke();
  renderMeme();
}
/*DOWNLOAD */
function onDownload() {
  if (!gElCanvas) return;

  var link = document.createElement("a");
  link.download = "meme.png";
  link.href = gElCanvas.toDataURL("image/png");
  link.click();
}
/*CHANGE FONT FAMILY */
function onSetFont(family) {
  setFont(family);
  renderMeme();
}

function onStrokeInc() {
  changeStrokeWidth(+1);
  renderMeme();
}
function onStrokeDec() {
  changeStrokeWidth(-1);
  renderMeme();
}
/*STICKERS */
function renderStickerTrack() {
  var elTrack = document.querySelector(".sticker-track");
  if (!elTrack) return;
  var stickers = getStickersPage();
  var html = "";
  for (var i = 0; i < stickers.length; i++) {
    html +=
      '<button class="sticker" onclick="onAddSticker(\'' +
      stickers[i] +
      "')\">" +
      stickers[i] +
      "</button>";
  }
  elTrack.innerHTML = html;
}
function onStickerPrev() {
  stickerPrev();
  renderStickerTrack();
}
function onStickerNext() {
  stickerNext();
  renderStickerTrack();
}

function onAddSticker(sym) {
  if (!gElCanvas) return;
  var cw = gElCanvas.width;
  var ch = gElCanvas.height;

  var count = getMeme().stickers ? getMeme().stickers.length : 0;

  var x = Math.round(cw / 2) + ((count * 60) % 360) - 180;
  var y = Math.round(ch / 2) + ((count * 36) % 360) - 180;

  addSticker(sym, x, y, 64);
  renderMeme();
}

function drawSticker(st) {
  if (!st || !st.sym) return;
  var size = st.size || 60;
  gCtx.font =
    size +
    'px "Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif';
  gCtx.textAlign = "center";
  gCtx.textBaseline = "middle";
  gCtx.fillText(st.sym, st.x, st.y);
}
/*SHARE */
function onShareFacebook() {
  var meme = getMeme && getMeme();
  var txt =
    (meme &&
      meme.lines &&
      meme.lines[meme.selectedLineIdx] &&
      meme.lines[meme.selectedLineIdx].txt) ||
    "";
  var shareUrl = location && location.href ? location.href.split("#")[0] : "";
  var fbUrl =
    "https://www.facebook.com/sharer/sharer.php?u=" +
    encodeURIComponent(shareUrl);

  if (txt) fbUrl += "&quote=" + encodeURIComponent(txt);
  fbUrl += "&hashtag=" + encodeURIComponent("#MemeGenerator");

  window.open(fbUrl, "_blank", "noopener,noreferrer,width=680,height=640");
}

function onOpenUpload() {
  var elInput = document.getElementById('file-input');
  if (elInput) elInput.click();
}

function onPickFile(ev) {
  var file = ev.target && ev.target.files && ev.target.files[0];
  if (!file) return;

  var url = URL.createObjectURL(file);

  var id = addUserImage(url);
  setImg(id);
  onOpenEditor();

  ev.target.value = '';
}
