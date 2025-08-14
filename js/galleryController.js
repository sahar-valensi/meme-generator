"use strict";

function renderGallery() {
  var elGrid = document.querySelector(".gallery-grid");
  if (!elGrid) return;
  var strHtml =
    '<article class="card upload" onclick="onOpenUpload()">' +
    '<div class="upload-inner">' +
    '<span class="upload-icon" aria-hidden="true">📷</span>' +
    '<span class="upload-text">Upload photo</span>' +
    "</div>" +
    "</article>";

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

function renderSaved() {
  var elGrid = document.querySelector("#saved .saved-grid");
  if (!elGrid) return;

  var list = typeof getSavedMemes === "function" ? getSavedMemes() : [];
  var html = "";

  if (!list.length) {
    html =
      '<article class="card"><div class="upload-inner">No saved memes yet</div></article>';
  } else {
    for (var i = 0; i < list.length; i++) {
      var it = list[i];
      html +=
        '<article class="card">' +
        '<img src="' +
        it.url +
        '" alt="saved meme" data-id="' +
        it.id +
        '"' +
        ' loading="lazy" decoding="async" onclick="onOpenSaved(this)">' +
        "</article>";
    }
  }
  elGrid.innerHTML = html;
}

function onOpenSaved(elImg) {
  if (!elImg) return;
  var url = elImg.getAttribute("src");
  if (!url) return;

  var id = typeof addUserImage === "function" ? addUserImage(url) : null;
  if (id != null && typeof setImg === "function") setImg(id);
  if (typeof onOpenEditor === "function") onOpenEditor();
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

function onOpenUpload() {
  var elInput = document.getElementById("file-input");
  if (elInput) elInput.click();
}

function onPickFile(ev) {
  var file = ev.target && ev.target.files && ev.target.files[0];
  if (!file) return;

  var url = URL.createObjectURL(file);

  var id = addUserImage(url);
  setImg(id);
  onOpenEditor();

  ev.target.value = "";
}
