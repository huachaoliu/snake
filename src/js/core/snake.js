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
    //初始化蛇，并在界面中显示
    for (let i = 0; i < length; i++) {
      const [x, y] = this.scope[i];
      const box = facotry('snake');
      const w = size - 2;
      setStyle.call(box, { width: w, height: w , left: x * size, top: y * size });
      this.snake.push(box);
    }
    //初始化食物

    const food = facotry('snake food');
    //随机生产坐标
    const { x, y } = getMaxXYNumber(this.configs.size);    
    const { fx, fy } = this.randomPosition(x, y);

    setStyle.call(food, { left: fx * size, top: fy * size, width: size - 2, height: size - 2 });

    grid.generator(this.snake, food);
    grid.build(this.panel);
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
    
    return this.randomPosition(x, y);
  }
}