import Snake from './core/snake';
import Configuration from './ui/configuration';

const snake = new Snake(document.querySelector('.container'), {
  size: 16
});
//先生成配置面板 
// const configBoard = new Configuration();
// configBoard.show();

//开始构建游戏
snake.build();

//事件绑定
let count = 0;
document.addEventListener('keydown', (e) => {
  count++;
  if (e.keyCode === 32) {
    //开始游戏
    if (count % 2 === 1 && !snake.moved) {
      snake.start();      
    } else {
      console.log('pause');
      snake.pause();
    }
  }

  // if (count > 0 && count % 2 === 1) {
  //   snake.updateDirection(e.keyCode);    
  // }
});