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