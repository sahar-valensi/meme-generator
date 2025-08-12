'use strict';
var gImgs = [
  { id: 1, url: '../assets/meme-imgs/1.jpg', title: 'Meme 1' },
  { id: 2, url: '../assets/meme-imgs/2.jpg', title: 'Meme 2' },
  { id: 3, url: '../assets/meme-imgs/3.jpg', title: 'Meme 3' },
];

var gCurrImgUrl ='';

function getImgs() {
  return gImgs;
}

function setCurrImgUrl(url) {
  gCurrImgUrl = url;
}

function getCurrImgUrl() {
  return gCurrImgUrl;
}
