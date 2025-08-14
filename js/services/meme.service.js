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

var gStickers = [
  "😂",
  "😎",
  "🔥",
  "👍",
  "❤️",
  "💯",
  "🎉",
  "👑",
  "🐱",
  "🥳",
  "💣",
  "👅",
  "✨",
];
var gStickerPageIdx = 0;
var STICKERS_PER_PAGE = 3;

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
  var idx = gMeme.selectedLineIdx;
  var line = gMeme.lines[idx];
  if (!line) {
    line = {
      txt: "",
      size: 20,
      color: "red",
      stroke: "#ffffffff",
      align: "center",
    };
    gMeme.lines[idx] = line;
  }
  line.txt = txt;
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

function appendImgsUpTo(maxId) {
  var basePath = 'assets/meme-imgs/';
  var lastId = 0;

  for (var i = 0; i < gImgs.length; i++) {
    if (gImgs[i].id > lastId) lastId = gImgs[i].id;
  }
  for (var id = lastId + 1; id <= maxId; id++) {
    gImgs.push({ id: id, url: basePath + id + ".jpg", keywords: [] });
  }
}

/*TOOLBAR */
function changeFontSize(diff) {
  var idx = gMeme.selectedLineIdx;
  var line = gMeme.lines[idx];
  if (!line) return;

  var size = +line.size || 20;
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

function addLine(txt) {
  var base = gMeme.lines[0] || {
    size: 20,
    color: "red",
    stroke: "#000000",
    align: "center",
  };
  var line = {
    txt: txt || "",
    size: base.size,
    color: base.color,
    stroke: base.stroke || "#000000",
    align: base.align,
  };
  // gMeme.lines.push(line);
  // gMeme.selectedLineIdx = gMeme.lines.length - 1;
  var insertIdx = gMeme.selectedLineIdx + 1;
  gMeme.lines.splice(insertIdx, 0, line);
  gMeme.selectedLineIdx = insertIdx;
}

function deleteLine() {
  var len = gMeme.lines.length;
  if (!len) return;
  var idx = gMeme.selectedLineIdx;
  gMeme.lines.splice(idx, 1);
  if (gMeme.lines.length === 0) gMeme.selectedLineIdx = 0;
  else
    gMeme.selectedLineIdx = Math.max(0, Math.min(idx, gMeme.lines.length - 1));
}

function switchLine(dir) {
  var len = gMeme.lines.length;
  if (!len) return;
  var idx = gMeme.selectedLineIdx;
  if (dir === "up") idx = (idx - 1 + len) % len;
  else idx = (idx + 1) % len;
  gMeme.selectedLineIdx = idx;
}

function getCurrLine() {
  return gMeme.lines[gMeme.selectedLineIdx] || null;
}

function getLineY(idx, ch) {
  if (idx === 0) return Math.round(ch * 0.15);
  if (idx === 1) return Math.round(ch * 0.85);
  return Math.round(ch * 0.5 + (idx - 2) * 40);
}
function setFillColor(color) {
  var idx = gMeme.selectedLineIdx;
  var line = gMeme.lines[idx];
  if (!line) return;
  line.color = color;
}

function setStrokeColor(color) {
  var idx = gMeme.selectedLineIdx;
  var line = gMeme.lines[idx];
  if (!line) return;
  line.stroke = color;
}

function toggleStroke() {
  var idx = gMeme.selectedLineIdx;
  var line = gMeme.lines[idx];
  if (!line) return;
  line.hasStroke = line.hasStroke === false ? true : false;
}

function setFont(family) {
  var idx = gMeme.selectedLineIdx;
  var line = gMeme.lines[idx];
  if (!line) return;
  line.font = String(family);
}

function changeStrokeWidth(diff) {
  var idx = gMeme.selectedLineIdx;
  var line = gMeme.lines[idx];
  if (!line) return;

  var w = Number(line.strokeWidth);
  if (!w) w = 8;
  w += diff;

  if (w < 1) w = 1;
  if (w > 30) w = 30;

  line.strokeWidth = w;
}
/*STICKERS */
function getStickersPage() {
  var out = [];
  for (var i = 0; i < STICKERS_PER_PAGE; i++) {
    var idx = (gStickerPageIdx + i) % gStickers.length;
    out.push(gStickers[idx]);
  }
  return out;
}
function stickerPrev() {
  gStickerPageIdx = (gStickerPageIdx - 1 + gStickers.length) % gStickers.length;
}
function stickerNext() {
  gStickerPageIdx = (gStickerPageIdx + 1) % gStickers.length;
}
function addSticker(sym, x, y, size) {
  if (!gMeme.stickers) gMeme.stickers = [];
  gMeme.stickers.push({ sym: sym, x: x, y: y, size: size || 64 });
}

function _syncInputWithCurrentLine() {
  var meme = getMeme();
  var elInput = document.querySelector(".tool-input");
  if (!elInput) return;
  var line = meme.lines[meme.selectedLineIdx];
  elInput.value = line ? line.txt || "" : "";
}

function _clearInput() {
  var elInput = document.querySelector(".tool-input");
  if (elInput) elInput.value = "";
}

function _syncFontSelect() {
  var line = getCurrLine && getCurrLine();
  var elSel = document.querySelector(".tool-select");
  if (elSel) elSel.value = (line && line.font) || "Impact";
}

function addUserImage(url) {
  var maxId = 0;
  for (var i = 0; i < gImgs.length; i++) if (gImgs[i].id > maxId) maxId = gImgs[i].id;
  var id = maxId + 1;

  gImgs.push({ id: id, url: url, keywords: ['user'] });
  return id;
}

