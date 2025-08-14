'use strict'

var SAVED_MEMES_KEY = 'meme-saved-v1';

function saveToStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function loadFromStorage(key) {
  var obj = localStorage.getItem(key);
  return JSON.parse(obj);
}

function getSavedMemes() {
  return loadFromStorage(SAVED_MEMES_KEY) || [];
}

function saveMemeDataUrl(dataUrl) {
  var list = getSavedMemes();
  var item = { id: Date.now(), url: dataUrl }; // מזהה פשוט לפי זמן
  list.unshift(item); // האחרון נשמר ראשון
  saveToStorage(SAVED_MEMES_KEY, list);
  return item.id;
}

function removeSavedMeme(id) {
  var list = getSavedMemes().filter(function (it) { return it.id !== id; });
  saveToStorage(SAVED_MEMES_KEY, list);
}

function clearSavedMemes() {
  saveToStorage(SAVED_MEMES_KEY, []);
}