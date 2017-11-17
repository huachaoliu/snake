import { makeScope, facotry, setStyle, getMaxXYNumber } from './utils';
import _ from 'lodash';
import Grid from '../ui/grid';

const constants = {
  D_LEFT: 'left',
  D_RIGHT: 'right',
  D_UP: 'up',
  D_DOWN: 'down',
  DEFAULT_COLOR: 'default',
  SINGLE_COLOR: 'single',
  MULTIPLE_COLOR: 'multiple'
}

module.exports = class Snake {
  constructor(panel, options) {
    this.panel = panel;
    this.configs = _.assign({
      speed: 200,
      size: 10,
      length: 3,
      color: constants.DEFAULT_COLOR
    }, options);
    this.scope = makeScope(this.configs.length);
    this.snake = [];
  }

  build() {
    //生成游戏界面
    const { size, length } = this.configs;
    const grid = new Grid(size);
    const snakeSize = size - 2;
    //初始化蛇，并在界面中显示
    for (let i = 0; i < length; i++) {
      const [x, y] = this.scope[i];
      const box = facotry('snake');
      this.updateStyle(box, x, y);
      this.snake.push(box);
    }
    //初始化食物
    const food = facotry('snake food');
    //随机生产坐标
    const { x, y } = getMaxXYNumber(size);    
    const { fx, fy } = this.randomPosition(x, y);

    this.updateStyle(food, fx, fy);

    grid.generator(this.snake, food);
    grid.build(this.panel);
  }

  updateStyle(source, left, top) {
    const { size } = this.configs;
    const s = size - 2;    
    setStyle.call(source, { left: left * size, top: top* size, width: s, height: s });    
  }

  randomPosition(x, y) {  
    const refer = x > y ? y : x;
    const fx = Math.floor(Math.random() * refer);
    const fy = Math.floor(Math.random() * refer);

    let flag = false;
    for (let i = this.scope.length - 1; i >= 0; i--) {
      const ss = this.scope[i];
      if (ss[0] === fx && ss[1] === fy) {
        flag = true;
        break;
      }
    }

    if (flag) {
      const rand = getMaxXYNumber(this.configs.size);
      x = rand.x;
      y = rand.y;
    } else {
      return { fx ,fy };
    }
    //尾递归，减少调用栈，提高程序性能
    return this.randomPosition(x, y);
  }

  start() {
    //TODO 启动定时器，设置默认方向。
    this.direction = constants.D_RIGHT;
    this.bindKeyEvent();
    this.timer = setInterval(() => {
      this.updateSnake();
    }, this.configs.speed);
  }

  pause() {
    clearInterval(this.timer);
  }

  bindKeyEvent() {
    document.addEventListener('keydown', (e) => {
      this.updateDirection(e.keyCode);    
    });
  }

  //更新方向
  updateDirection(code) {
    const { D_LEFT, D_RIGHT, D_UP, D_DOWN } = constants;
    if (code === 37 && this.direction !== D_RIGHT) {
      this.direction = D_LEFT;
    } else if (code === 38 && this.direction !== D_DOWN) {
      this.direction = D_UP;
    } else if (code === 39 && this.direction !== D_LEFT) {
      this.direction = D_RIGHT;
    } else if (code === 40 && this.direction !== D_UP) {
      this.direction = D_DOWN;
    }
  }
  /**
   * 通过方向，找到下一个坐标点，依次更新当前坐标
   */
  updateSnake() {
    const { D_LEFT, D_RIGHT, D_UP, D_DOWN } = constants;
    const { length, size } = this.configs;
    let turnedPoint = this.scope[length - 1];
    let nextPoint;
    for (let i = 0; i < length; i++) {
      const snake = this.snake[i];
      switch(this.direction) {
        case D_RIGHT:
          nextPoint = [turnedPoint[0] + 1, turnedPoint[1]];
          break;
        case D_DOWN:
          nextPoint = [turnedPoint[0], turnedPoint[1] + 1];
          break;
        case D_LEFT:
          nextPoint = [turnedPoint[0] - 1, turnedPoint[1]];
          break;
        case D_UP:
          nextPoint = [turnedPoint[0], turnedPoint[1] - 1];
          break;
      }
      
      if (this.scope[i + 1]) {
        this.scope[i] = this.scope[i + 1];
        this.scope[i + 1] = nextPoint;
      }
      this.updateStyle(snake, this.scope[i][0], this.scope[i][1]);
    }
  }
}