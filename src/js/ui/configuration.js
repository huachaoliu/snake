//在开始游戏之前或游戏结束之后，对游戏的设置。
import { facotry, addDom } from '../core/utils';

module.exports = class Configuration {
  constructor () {
    this._wrapper = facotry('ctrl_wrapper');
  }

  show() {
    this._mask = facotry('div', 'ctrl_mask');
    this._board = facotry('div', 'ctrl_board');
    addDom.call(this._wrapper, this._mask, this._board);
    document.body.appendChild(this._wrapper);
  }
}