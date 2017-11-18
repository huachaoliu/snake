import Configuration from './ui/configuration';

//先生成配置面板 
const configBoard = new Configuration('.game_config');
//开始构建游戏
const start = document.querySelector('.start');
start.onclick = () => {
  configBoard.start();  
}