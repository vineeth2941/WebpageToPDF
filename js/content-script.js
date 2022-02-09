// Content script content goes here or in activatedContentHooks (use activatedContentHooks if you need a variable
// accessible to both the content script and inside a hook

var drag = false;
var l = 0, t = 0, w = 0, h = 0;
chrome.runtime.onMessage.addListener(() => {
  const body = document.body;
  const html = document.documentElement;

  const width = body.clientWidth;
  const height = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
  body.style.setProperty('--wtp-screen-width', `${width}px`);
  body.style.setProperty('--wtp-screen-height', `${height}px`);
  var cover = document.createElement('div');
  cover.classList.add('cover');
  body.prepend(cover);
  var crop = document.createElement('div');
  crop.classList.add('crop');
  body.prepend(crop);
  var playground = document.createElement('div');
  playground.classList.add('playground');
  body.prepend(playground);

  playground.onmousedown = (evt) => {
    if (evt.button !== 0) return;
    drag = true;
    l = evt.offsetX;
    t = evt.offsetY;
    w = h = 0;
    crop.style.left = `${l}px`;
    crop.style.top = `${t}px`;
    crop.style.width = `${w}px`;
    crop.style.height = `${h}px`;
  };

  playground.onmousemove = (evt) => {
    if (!drag) return;
    w = evt.offsetX - l;
    h = evt.offsetY - t;
    crop.style.width = `${w}px`;
    crop.style.height = `${h}px`;
  };

  playground.onmouseup = (evt) => {
    if (!drag) return;
    drag = false;
    w = evt.offsetX - l;
    h = evt.offsetY - t;
    crop.style.width = `${w}px`;
    crop.style.height = `${h}px`;

    if (w <= 1 || h <= 1) return;

    body.removeChild(cover);
    body.removeChild(crop);
    body.removeChild(playground);

    const div = document.createElement('div');
    div.style.position = 'relative';
    div.style.overflow = 'hidden';
    div.style.width = `${w}px`;
    div.style.height = `${h}px`;
    const iframe = document.createElement('div');
    iframe.style.width = `${width}px`;
    iframe.style.height = `${height}px`;
    iframe.style.position = 'absolute';
    iframe.style.transform = `translate(-${l}px, -${t}px)`;
    iframe.replaceChildren(...body.childNodes);
    div.appendChild(iframe);
    body.replaceChildren(div);
    window.print();
    body.replaceChildren(...iframe.childNodes);
    body.style.removeProperty('--wtp-screen-width');
    body.style.removeProperty('--wtp-screen-height');
  };
});
