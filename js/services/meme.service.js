"use strict";
var gImgs = [
  { id: 1, url: "assets/meme-imgs/1.jpg", title: "Meme 1" },
  { id: 2, url: "assets/meme-imgs/2.jpg", title: "Meme 2" },
  { id: 3, url: "assets/meme-imgs/3.jpg", title: "Meme 3" },
];

var gMeme = {
  selectedImgId: 5,
  selectedLineIdx: 0,
  lines: [{ txt: "I sometimes eat Falafel", size: 20, color: "red" }],
};

var gKeywordSearchCountMap = { funny: 12, cat: 16, baby: 2 };
var gCurrImgUrl = "";

function getImgs() {
  return gImgs;
}

function setImg(imgId) {
  gMeme.selectedImgId = imgId;
}

function getMeme() {
  return gMeme;
}

function setLineTxt(txt) {
  gMeme.lines[gMeme.selectedLineIdx].txt = txt;
}

function setCurrImgUrl(url) {
  gCurrImgUrl = url;
}

function getImgUrlById(id) {
  for (var i = 0; i < gImgs.length; i++)
    if (gImgs[i].id === id) return gImgs[i].url;
  return null;
}

function getCurrImgUrl() {
  return gCurrImgUrl;
}

/*TOOLBAR */
function changeFontSize(diff) {
  var idx = gMeme.selectedLineIdx;
  var line = gMeme.lines[idx];
  if (!line) return;

  var size = line.size || 20;
  size += diff;
  // if (size < 10)  size = 10;
  // if (size > 120) size = 120;

  line.size = size;
}

function setAlign(align) {
  var idx = gMeme.selectedLineIdx;
  var line = gMeme.lines[idx];
  if (!line) return;
  line.align = align;      
}