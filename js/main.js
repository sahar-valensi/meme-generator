'use strict'
console.log('[boot] MemeGen Sprint 2 (minimal)');

const modal    = document.getElementById('img-modal');
const modalImg = document.getElementById('modal-image');
const btnClose = document.getElementById('modal-close');

function onOpenPreview(elImg) {
  if (!elImg) return;

  modalImg.src = elImg.src;
  modalImg.alt = elImg.alt || '';

  modal.showModal(); 
  if (btnClose && btnClose.focus) btnClose.focus();
}

function onClosePreview() {
  modal.close();
}

function onModalClick(event) {
  if (event.target === modal) {
    closePreview();
  }
}

function onKeyDown(event) {
  var isEsc = (event.key === 'Escape') || (event.keyCode === 27);
  if (isEsc) closePreview();
}

function initModal() {
  document.addEventListener('keydown', onKeyDown);
}

initModal();

window.onOpenPreview  = onOpenPreview;
window.onClosePreview = onClosePreview;
window.onModalClick = onModalClick;