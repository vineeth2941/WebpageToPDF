// Content script content goes here or in activatedContentHooks (use activatedContentHooks if you need a variable
// accessible to both the content script and inside a hook

var initiated = false;
var drag = false;
var x = 0, y = 0;
var cover, crop, playground;
chrome.runtime.onMessage.addListener(() => {
  const body = document.body;
  const html = document.documentElement;

  const cleanUp = () => {
    body.removeChild(playground);
    body.removeChild(crop);
    body.removeChild(cover);
    initiated = false;
    drag = false;
  };

  if (initiated) return cleanUp();
  initiated = true;

  const width = body.clientWidth;
  const height = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
  body.style.setProperty('--wtp-screen-width', `${width}px`);
  body.style.setProperty('--wtp-screen-height', `${height}px`);
  cover = document.createElement('div');
  cover.classList.add('cover');
  body.prepend(cover);
  crop = document.createElement('div');
  crop.classList.add('crop');
  body.prepend(crop);
  playground = document.createElement('div');
  playground.classList.add('playground');
  body.prepend(playground);

  playground.onmousedown = (evt) => {
    if (evt.button !== 0) return;
    drag = true;
    x = evt.offsetX;
    y = evt.offsetY;
    setCrop(x, y);
  };

  const getRect = (mx, my) => {
    var l = x, t = y;
    var w = Math.abs(mx - x);
    var h = Math.abs(my - y);
    if (mx < x) l = mx;
    if (my < y) t = my;
    return { l, t, w, h };
  };

  const setCrop = (mx, my) => {
    const { l, t, w, h } = getRect(mx, my);
    crop.style.left = `${l}px`;
    crop.style.top = `${t}px`;
    crop.style.width = `${w}px`;
    crop.style.height = `${h}px`;
    return { l, t, w, h };
  };

  playground.onmousemove = (evt) => {
    if (!drag) return;
    setCrop(evt.offsetX, evt.offsetY);
  };

  playground.onmouseup = (evt) => {
    if (!drag) return;
    drag = false;

    const { l, t, w, h } = setCrop(evt.offsetX, evt.offsetY);
    if (w <= 1 || h <= 1) return;

    cleanUp();

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
    initiated = false;
  };
});
