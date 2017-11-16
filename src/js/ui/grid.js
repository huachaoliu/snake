//构建面板
import { facotry, getPanelMaxSize, setStyle } from '../core/utils';

module.exports = class Grid {
  constructor(size) {
    this._size = size;
  }

  //生产游戏界面
  generator(snake, food) {
    this._grid = facotry('grid');
    const { width, height } = getPanelMaxSize(this._size);
    const size = width > height ? height : width;
    setStyle.call(this._grid, { width: size, height: size });
    snake.map(box => this._grid.appendChild(box));
    this._grid.appendChild(food);
    return this._grid;
  }

  //导出游戏界面
  get getGrid() {
    return this._grid;
  }

  build (panel) {
    panel.appendChild(this._grid);
  }
}