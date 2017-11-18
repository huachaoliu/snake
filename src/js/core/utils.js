const facotry = (className, type = 'div') => {
  const dom = document.createElement(type);
  if (className.indexOf(' ') > -1) {
    className.split(' ').map(cls => dom.classList.add(cls));
  } else {
    dom.classList.add(className);    
  }
  return dom;
}

//this 需要bind
function addDom(...domList) {
  domList.map(dom => {
    if (dom) {
      this.appendChild(dom);
    }
  })
}

//set style .this need bind
const suffix = [ 'width', 'height', 'left', 'top' ];
function setStyle (json) {
  for (let p in json) {
    if (suffix.indexOf(p) > -1) {
      this.style[p] = json[p] + 'px';    
    } else {
      this.style[p] = json[p];    
    }
  }
}

const getMaxXYNumber = (size) => {
  const winw = window.innerWidth;
  const winh = window.innerHeight;
  size += 4; //border
  const x = Math.floor(winw / size);
  const y = Math.floor(winh / size);
  return { x, y, winw, winh };
}

//通过box的大小，来换算最大的画布。
const getPanelMaxSize = (size) => {
  const { x, y, winw, winh } = getMaxXYNumber(size);
  const maxw = x * size;
  const maxh = y * size;
  return {
    width: checkSize(maxw, winw, size),
    height: checkSize(maxh, winh, size)
  }
}

const checkSize = (max, win, size) => {
  if (max >= win) {
    max = Math.floor(win / size) * size - size;
  }
  return max;
}

const addClass = (target, className) => {
  if (className.indexOf(' ') > -1) {
    className.split(' ').map(cls => target.classList.add(cls));
  } else {
    target.classList.add(className);
  }

  return target;
}

const removeClass = (target, className) => {
  if (className.indexOf(' ') > -1) {
    className.split(' ').map(cls => target.classList.remove(cls));
  } else {
    target.classList.remove(className);
  }

  return target;
}

const makeScope = (v) => {
  const scope = [];
  for (let i = 0; i < v; i++) {
    scope.push([ i, 0 ]);
  } 
  return scope;
}

module.exports = {
  facotry,
  addDom,
  setStyle,
  getPanelMaxSize,
  checkSize,
  makeScope,
  getMaxXYNumber,
  addClass,
  removeClass,
}