import { makeScope, facotry, setStyle, getMaxXYNumber, addClass } from './utils';
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
    this.score = 0;
    this.snake = [];
    this.moved = false;
  }

  build() {
    //生成游戏界面
    const { size, length } = this.configs;
    this.grid = new Grid(size);
    const snakeSize = size - 2;
    //初始化蛇，并在界面中显示
    for (let i = 0; i < length; i++) {
      const [ x, y ] = this.scope[i];
      const box = facotry('snake');
      this.updateStyle(box, x, y);
      this.snake.push(box);
    }
    //初始化食物
    this.food = facotry('snake food');
    //随机生产坐标
    const { x, y } = getMaxXYNumber(size);
    this.x = this.y = x > y ? y : x;    
    const { fx, fy } = this.randomPosition(x, y);

    this.updateStyle(this.food, fx, fy);
    this.grid.generator(this.snake, this.food);
    this.grid.build(this.panel);
  }

  updateStyle(source, left, top) {
    const { size } = this.configs;
    const s = size - 2;    
    setStyle.call(source, { left: left * size, top: top * size, width: s, height: s });    
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
      this.position = { fx, fy };
      return { fx ,fy };
    }
    //如果新的坐标在蛇的身体中，就重新获取
    return this.randomPosition(x, y);
  }

  updateFoodPlace() {
    const { fx, fy } = this.randomPosition(this.x, this.y);
    this.updateStyle(this.food, fx, fy);    
  }

  start() {
    if (this.timer && !this.paused) return;
    this.paused = false;
    this.direction = constants.D_RIGHT;
    this.bindKeyEvent();
    this.timer = setInterval(() => {
      this.cacheScope= _.clone(this.scope);
      this.updateSnake();
    }, this.configs.speed);
  }

  pause() {
    this.paused = true;
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
    //限制转折时过快而导致蛇直接反向行走
    if (this.moved) {
      this.moved = false;
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
  }
  /**
   * 通过方向，找到下一个坐标点，依次更新当前坐标
   */
  updateSnake() {
    this.moved = true;    
    const { D_LEFT, D_RIGHT, D_UP, D_DOWN } = constants;
    const { size } = this.configs;
    const { fx, fy } = this.position;
    const length = this.scope.length;
    let nextPoint;    
    let turnedPoint = this.scope[length - 1];
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
      if (this.checkLife(nextPoint, this.cacheScope)) {
        this.gameOver();
        break;
      } else {
        //检测是否与食物碰撞
        if (this.checkNextPointOrFood(nextPoint)) {
          // this.moved = false;
          const newSnake = facotry('snake');
          this.updateStyle(newSnake, fx, fy);
          this.score += 1;
          this.scope.unshift(nextPoint);
          this.updateFoodPlace();
          this.snake.push(newSnake);
          this.grid.addEle(newSnake);
        }
        if (this.scope[i + 1]) {
          this.scope[i] = this.scope[i + 1];
          this.scope[i + 1] = nextPoint;
        }
        this.updateStyle(snake, this.scope[i][0], this.scope[i][1]);
      }
    }
  }

  checkLife(point, scope) {
    let checked = false;
    const len = scope.length;
    //碰撞自身
    for (let i = 0; i < len; i++) {
      if (point[0] === scope[i][0] && point[1] === scope[i][1]) {
        checked = true;
        break;
      }
    }
    //碰撞边境
    if (point[0] < 0 || point[1] < 0 || point[0] >= this.x || point[1] >= this.y){
      checked = true;
    }
    return checked;
  }

  gameOver() {
    this.died = true;
    clearInterval(this.timer);
    this.configs.configuration.gameOver(this.score);
    // console.log('您已经死亡，游戏结束', this.score);
  }

  rebuild(type) {
    this.score = 0;
    this.snake = [];
    this.moved = false;
    this.paused = false;
    this.died = false;
    this.timer = null;
    this.scope = makeScope(this.configs.length);    
    this.panel.childNodes.forEach(element => {      
      this.panel.removeChild(element);
    });
    type === 'rebuild' && this.build()
  }

  checkNextPointOrFood(point) {
    let checked = false;
    const { fx, fy } = this.position;
    if (point[0] === fx && point[1] === fy) {
      checked = true;
    }
    return checked;
  }
}