'use strict'

let gElCanvas;
let gCtx;
let gBgImg;

function init() {
    createLineDefaults();
    loadImages();
    gBgImg = new Image();
    renderImgGallery();
}

function onGalleryNavBtnClick(elGalleryBtn) {
    onNavBtnClick(elGalleryBtn);
    hideElByClass('editor-container');
    displayElByClassAndType('gallery-container', 'flex');
    displayElByClassAndType('about-container', 'flex');
}

function onNavBtnClick(elNavBtn) {
    let elNavBtns = document.querySelectorAll('.main-nav li');
    elNavBtns.forEach(navBtn => navBtn.classList.remove('active'));
    elNavBtn.classList.add('active');
}

function displayElByClassAndType(elClass, displayType) {
    let el = document.querySelector(`.${elClass}`);
    el.style.display = displayType;
}

function hideElByClass(elClass) {
    let el = document.querySelector(`.${elClass}`);
    el.style.display = 'none';
}

// ---------- Gallery ----------

function onGalleryImageClick(elImg) {
    hideElByClass('gallery-container');
    hideElByClass('about-container');
    showEditor(elImg.dataset.imgid);
    let elGalleryNavBtn = document.querySelector('.gallery-link');
    elGalleryNavBtn.classList.remove('active');
}

function renderImgGallery() {
    let elImgGallery = document.querySelector('.images-gallery');
    let images = getImages();
    images.forEach((image) => elImgGallery.innerHTML += getImgHtml(image));
}

function getImgHtml(image) {
    let imgWidth = 250;
    let imgHeight = 250;
    let imgHTML = `<img src="${image.url}" height="${imgHeight}" width="${imgWidth}" data-imgid=${image.id} class="gallery-image" onclick="onGalleryImageClick(this)">`;
    return imgHTML;
}


// ---------- Editor ----------

function hideEditor() {
    let elGallery = document.querySelector('.editor-container');
    elGallery.style.display = 'none';
}

function showEditor(bgImgId) {
    gElCanvas = document.getElementById('canvas');
    gCtx = gElCanvas.getContext('2d');
    setCanvasSizeByScreenSize(gElCanvas);
    updateCanvasWidth(gElCanvas.width);
    updateCanvasHeight(gElCanvas.height);
    initGmeme();
    setSelectedImgById(bgImgId);
    displayElByClassAndType('editor-container', 'flex');
    renderCanvas();
}

function renderCanvas() {
    gBgImg.src = getBgImg().url;
    gBgImg.onload = () => {
        gCtx.drawImage(gBgImg, 0, 0, gElCanvas.width, gElCanvas.height);
        drawTextLines();
    }
}

function setCanvasSizeByScreenSize(elCanvas) {
    let screenWidth = window.screen.width;

    if (screenWidth <= 740) {
        elCanvas.width = 280;
        elCanvas.height = 280;
    }
}

function drawTextLines() {
    let txtLines = getAllTxtLines();
    txtLines.forEach((txtLine) => drawTextLine(txtLine));
}

function drawTextLine(textLine) {
    gCtx.font = `${textLine.fontSize}px ${textLine.font}`;
    gCtx.textAlign = textLine.align;
    gCtx.fillStyle = textLine.fontColor;
    gCtx.strokeStyle = textLine.strokeColor;
    gCtx.textBaseline = textLine.baseLine;
    gCtx.fillText(textLine.txt, textLine.pos.x, textLine.pos.y);
    gCtx.strokeText(textLine.txt, textLine.pos.x, textLine.pos.y);
}

function onAddLine() {
    addLine();
    renderCanvas();
}

function onRemoveSelectedLine() {
    removeSelectedLine();
    renderCanvas();
}

function onChangeLine() {
    setNextLineAsSelected();
}

function onTextLineInputChange(txt) {
    setSelectedLineTxt(txt);
    renderCanvas();
}

function onLineHeightChange(yPosDiff) {
    setSelectedLineYPos(yPosDiff);
    renderCanvas();
}

function onFontFamilyChange(fontFamily) {
    setSelectedLineFontFamily(fontFamily);
    renderCanvas();
}

function onFontSizeChange(fontDiff) {
    setSelectedLineFontSize(fontDiff);
    renderCanvas();
}

function onFontColorChange(fontColor) {
    setSelectedLineFontColor(fontColor);
    renderCanvas();
}

function onStrokeColorChange(strokeColor) {
    setSelectedLineStrokeColor(strokeColor);
    renderCanvas();
}

function onTextAlignChange(textAlign) {
    alignSelectedLine(textAlign);
    renderCanvas();
}

function onDownloadMeme(elDownloadLink) {
    const data = gElCanvas.toDataURL();
    elDownloadLink.href = data;
    elDownloadLink.download = 'meme.png';
}