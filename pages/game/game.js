// pages/game/game.js\

var data = require('../../utils/data.js')

//地图图层数据
var map = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0]
]
//箱子图层数据
var box = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0]
]
//方块的边长

var w = 30

//游戏主角小鸟所在的行和列
var row = 0
var col = 0


Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 自定义函数--初始化地图数据
   */
  initMap: function(level) {
    //读取原始地图数据
    let mapData = data.maps[level]

    //使用双重for循环记录地图数据
    for (var i = 0; i < 8; i++) {
      for (var j = 0; j < 8; j++) {
        box[i][j] = 0;
        map[i][j] = mapData[i][j];
        //当前位置是箱子
        if (mapData[i][j] == 4) {
          box[i][j] = 4;
          map[i][j] = 2;
        }
        //当前位置是游戏主角小鸟
        else if (mapData[i][j] == 5) {
          map[i][j] = 2;
          //更新对应行列
          row = i;
          col = j;
        }
      }
    }
  },


  /**
   * 自定义函数--绘制画布
   */
  drawCanvas: function() {
    let pen = this.pen;

    //先清空画布
    pen.clearRect(0, 0, 240, 240)

    //使用双重for循环绘制地图
    for (var i = 0; i < 8; i++) {
      for (var j = 0; j < 8; j++) {
        //默认都是道路
        let img = 'ice'; //这let怕是相当于const，汗
        //如果当前位置是墙
        if (map[i][j] == 1) {
          img = 'stone';
        }
        //如果当前位置是重点
        else if (map[i][j] == 3) {
          img = 'pig';
        }

        //从图片文件夹选择图片绘制地图
        pen.drawImage('/images/icons/' + img + '.png', j * w, i * w, w, w)

        //叠加绘制箱子
        if (box[i][j] == 4) {
          pen.drawImage('/images/icons/box.png', j * w, i * w, w, w)
        }

      }
    }
    //叠加绘制小鸟
    pen.drawImage('/images/icons/bird.png', col * w, row * w, w, w)

    //渲染画布，重要！！,相当于一个结尾
    pen.draw()

  },


  /**
   * 自定义函数--方向键：上
   */
  up: function() {
    //如果小鸟不在最顶端才考虑上移
    if (row != 0) {
      //如果上方不是墙也不是箱子
      if (map[row - 1][col] != 1 && box[row - 1][col] != 4) {
        row--;
      }
      //如果上方是箱子
      else if (box[row - 1][col] == 4) {
        //如果箱子不在最顶端才可以考虑推动
        if (row - 1 != 0) {
          //如果箱子上边不是墙或另一个箱子
          if (map[row - 2][col] != 1 && box[row - 2][col] != 4) {
            //更新箱子数据
            box[row - 2][col] = 4;
            box[row - 1][col] = 0;

            row--;
          }
        }
      }
      //重新绘制地图
      this.drawCanvas();
      //检查游戏是否成功
      this.checkWin();
    }
  },

  /**
   * 自定义函数--方向键：左
   */
  left: function() {
    //如果小鸟不在最左端才考虑左移
    if (col != 0) {
      //如果左方不是墙也不是箱子
      if (map[row][col - 1] != 1 && box[row][col - 1] != 4) {
        col--;
      }
      //如果左方是箱子
      else if (box[row][col - 1] == 4) {
        //如果箱子不在最左端才可以考虑推动
        if (col - 1 != 0) {
          //如果箱子左边不是墙或另一个箱子
          if (map[row][col - 2] != 1 && box[row][col - 2] != 4) {
            //更新箱子数据
            box[row][col - 2] = 4;
            box[row][col - 1] = 0;

            col--;
          }
        }
      }
      //重新绘制地图
      this.drawCanvas();
      //检查游戏是否成功
      this.checkWin();
    }
  },
  /**
   * 自定义函数--方向键：下
   */
  down: function() {
    //如果小鸟不在最底端才考虑下移
    if (row != 7) {
      //如果上方不是墙也不是箱子
      if (map[row + 1][col] != 1 && box[row + 1][col] != 4) {
        row++;
      }
      //如果下方是箱子
      else if (box[row + 1][col] == 4) {
        //如果箱子不在最底端才可以考虑推动
        if (row - 1 != 7) {
          //如果箱子下边不是墙或另一个箱子
          if (map[row + 2][col] != 1 && box[row + 2][col] != 4) {
            //更新箱子数据
            box[row + 2][col] = 4;
            box[row + 1][col] = 0;

            row++;
          }
        }
      }
      //重新绘制地图
      this.drawCanvas();
      //检查游戏是否成功
      this.checkWin();
    }
  },


  /**
   * 自定义函数--方向键：右
   */
  right: function() {
    //如果小鸟不在最右端才考虑右移
    if (col != 7) {
      //如果右方不是墙也不是箱子
      if (map[row][col + 1] != 1 && box[row][col + 1] != 4) {
        col++;
      }
      //如果右方是箱子
      else if (box[row][col + 1] == 4) {
        //如果箱子不在最右端才可以考虑推动
        if (col + 1 != 7) {
          //如果箱子右边不是墙或另一个箱子
          if (map[row][col + 2] != 1 && box[row][col + 2] != 4) {
            //更新箱子数据
            box[row][col + 2] = 4;
            box[row][col + 1] = 0;

            col++;
          }
        }
      }
      //重新绘制地图
      this.drawCanvas();
      //检查游戏是否成功
      this.checkWin();
    }
  },

  /**
   * 自定义函数--判断游戏是否结束
   */
  isWin: function() {
    //用双重for循环遍历整个数组
    for (var i = 0; i < 8; i++) {
      for (var j = 0; j < 8; j++) {
        //如果有箱子没有放回终点
        if (box[i][j] == 4 && map[i][j] != 3) {
          //返回假，游戏尚未成功
          return false;
        }
      }
    } 
    //返回真，游戏成功
    return true;

  },

  /**
   * 自定义函数--游戏成功处理
   */
  checkWin: function() {
    if (this.isWin()) {
      wx.showModal({
        title: '恭喜',
        content: '游戏成功',
        showCancel: false,
      })
    }
  },

  /**
     * 自定义函数--重新开始游戏
     */
  restartGame:function(){
    //初始化地图数据
    this.initMap(this.data.level-1)
    //绘制画布
    this.drawCanvas()
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options.level)

    //获取关卡
    let level = options.level

    //更新关卡标题
    this.setData({
      level: parseInt(level) + 1
    })

    //创建画布上下文
    this.pen = wx.createCanvasContext('myCanvas');

    //初始化地图
    this.initMap(level)

    //绘制地图
    this.drawCanvas()

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})