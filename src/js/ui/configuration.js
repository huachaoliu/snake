//在开始游戏之前或游戏结束之后，对游戏的设置。
import { facotry, addDom, addClass, removeClass } from '../core/utils';
import Snake from '../core/snake';

module.exports = class Configuration {
  constructor (container) {
    this._wrapper = document.querySelector(container);
    this.snakeSizeInp = document.querySelector('.snake_size');
    this.snakeSizeInp.onchange = (e) => {
      this.size = parseInt(e.target.value);
    }
    const degres = document.getElementsByName('degree');
    for (let i = 0; i < degres.length; i++) {
      degres[i].onchange = (e) => {
        if (e.target === degres[i]) {
          this.degres = i;
        }
      }
    }
    this.radios = degres;
  }

  start() {
    const size = this.size > 50 ? 50 : this.size < 15 ? 15 : this.size;
    const speed = 200 - this.degres * 50; 
    addClass(this._wrapper, 'hide');
    this.snake = new Snake(document.querySelector('.container'), {
      configuration: this,
      size: size || 15,
      speed: speed || 200,
      length: 5,
    });
    this.degres = 0;
    for (let i = 0; i < this.radios.length; i++) {
      this.radios[i].checked = false;
    }
    this.snake.build();    
    //事件绑定
    document.addEventListener('keydown', (e) => {
      //开始游戏
      if (e.keyCode === 13 && !this.snake.died) {
        this.snake.start();
      }
      //暂停游戏
      if (e.keyCode === 32) {
        this.snake.pause();      
      }
    });
  }

  gameOver(score) {
    const go = document.querySelector('.game_over');
    const _score = document.querySelector('.score');
    const rebuild = document.querySelector('.rebuild');
    const newGamw = document.querySelector('.new_game');
    _score.textContent = score;
    removeClass(go, 'hide');

    rebuild.onclick = () => {
      this.snake.rebuild('rebuild');
      addClass(go, 'hide');
    }

    newGamw.onclick = () => {
      this.snakeSizeInp.value = '';
      this.snake.rebuild('reset');
      addClass(go, 'hide');   
      removeClass(this._wrapper, 'hide');
    }
  }
}