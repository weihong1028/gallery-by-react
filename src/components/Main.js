require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDom from 'react-dom';


// import Rest from 'fetch-on-rest';
// let api = new Rest('https://rap.dev.iquantex.com/RAP/mockjs/3/api/chartsetting');
// api.get(['chart','1477637259081']).then(function(response) {
//   console.log('response', response)
// });
// 获取图片数据相关数组
let imageDatas = require('../sources/imageDatas.json');

// 从给定范围随机返回一个值
let getRangeRandom = (low, high) => Math.floor(Math.random() * (high - low) + low);
// 从 -30deg ~ 30deg 随机返回一个值
let getRangeDeg = () => {
  let deg = (Math.random() > 0.5) ? '+' : '-';
  return deg + Math.ceil(Math.random() * 30);
};

// 将图片名信息转化为图片URL路径信息
imageDatas = ((imageDatasArr) => {
  for (let i = 0, j = imageDatasArr.length; i < j; i++) {
    let singleImageData = imageDatasArr[i];
    singleImageData.imageUrl = require('../images/' + singleImageData.filename);
    imageDatasArr[i] = singleImageData;
  }
  return imageDatasArr;
})(imageDatas);

class ImgFigure extends React.Component {

  /**
   * 点击切换图片布局
   * @param e
     */
  handleClick(e) {
    if (this.props.arrange.isCenter) {
      // this.props.inverse()
    } else {
      this.props.center();
    }
    e.stopPropagation();
    e.preventDefault();
  }

  render() {
    var styleObj = {};
    // 如果props属性中指定了这张图片的位置,则使用
    if (this.props.arrange.pos) {
      styleObj = this.props.arrange.pos;
    }
    // 如果图片的旋转角度有值并且不为0，添加旋转角度
    if (this.props.arrange.rotate) {
      (['Moz', 'Ms', 'Webkit', '']).forEach((value) => {
        styleObj[value + 'Transform'] = 'rotate(' + this.props.arrange.rotate + 'deg)';
      })
    }
    if (this.props.arrange.isCenter) {
      styleObj.zIndex = 101;
    }

    return (
      <figure className="img-figure" style={styleObj} onClick={(e) => this.handleClick(e)}>
        <img src={this.props.data.imageUrl} alt={this.props.data.title}/>
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
        </figcaption>
      </figure>
    );
  }
}

class AppComponent extends React.Component {

  constructor(props) {
    super(props);
    this.constant = {
      centerPos: {
        left: 0,
        top: 0
      },
      hPosRange: {
        leftSecX: [0, 0],
        rightSecX: [0, 0],
        y: [0, 0]
      },
      vPosRange: {
        x: [0, 0],
        topSecY: [0, 0]
      }
    };
    this.state = {
      imgsArrangeArr: []
    }
  }

  /**
   * 居中指定位置的图片,同时重新排布图片
   * @param index
   * @returns {function()}
     */
  center(index) {
    return () => {
      this.rearrange(index);
    }
  }

  /**
   * 组件加载完后,为每张图片计算位置范围
   */
  componentDidMount() {
    // 获取舞台大小
    let stageDom = ReactDom.findDOMNode(this.refs.stage),
        stageW = stageDom.scrollWidth,
        stageH = stageDom.scrollHeight,
        halfStageW = Math.ceil(stageW / 2),
        halfStageH = Math.ceil(stageH / 2);

    // 获取一个imgFigure的大小
    let imgFigureDom = ReactDom.findDOMNode(this.refs.imgFigure0),
        imgW = imgFigureDom.scrollWidth,
        imgH = imgFigureDom.scrollHeight,
        halfImgW = Math.ceil(imgW / 2),
        halfImgH = Math.ceil(imgH / 2);

    // 计算中心图片位置点
    this.constant.centerPos = {
      left: halfStageW - halfImgW,
      top: halfStageH - halfImgH
    };

    // 计算左右侧图片排布位置的取值范围
    this.constant.hPosRange.leftSecX[0] = -halfImgW;
    this.constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
    this.constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.constant.hPosRange.rightSecX[1] = stageW - halfImgW;
    this.constant.hPosRange.y[0] = -halfImgH;
    this.constant.hPosRange.y[1] = stageH - halfImgH;

    // 计算上侧图片排布位置的聚会范围
    this.constant.vPosRange.x[0] = halfStageW - imgW;
    this.constant.vPosRange.x[1] = halfStageW;
    this.constant.vPosRange.topSecY[0] = -halfImgH;
    this.constant.vPosRange.topSecY[1] = halfStageH - halfImgH * 3;

    let num = Math.floor(Math.random() * 10);
    this.rearrange(num);
  }

  render() {

    let controllerUnitss = [],
        imgFigures = [];

    imageDatas.forEach((value, index) => {
      if (!this.state.imgsArrangeArr[index]) {
        this.state.imgsArrangeArr[index] = {
          pos: {
            left: 0,
            top: 0
          },
          rotate: 0,
          isCenter: false
        }
      }
      imgFigures.push(<ImgFigure key={index} center={this.center(index)} data={value} arrange={this.state.imgsArrangeArr[index]} ref={'imgFigure' + index}/>);
    });

    return (
      <section className="stage" ref="stage">
        <section className="img-sec">
          {imgFigures}
        </section>
        <div className="ctrl-nav"></div>
      </section>
    );
  }

  /**
   * 重新排布所有图片
   */
  rearrange(centerIndex) {
    let imgsArrangeArr = this.state.imgsArrangeArr,
        constant = this.constant,
        centerPos = constant.centerPos,
        hPosRange = constant.hPosRange,
        vPosRange = constant.vPosRange,
        hPosRangeLeftSecX = hPosRange.leftSecX,
        hPosRangeRightSecX = hPosRange.rightSecX,
        hPosRangeY = hPosRange.y,
        vPosRangeTopSecY = vPosRange.topSecY,
        vPosRangeX = vPosRange.x,
        imgsArrangeTopArr = [],
        topImgNum = Math.floor(Math.random() * 2), //取一个或者不取
        topImgSpiceIndex = 0,
        imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);
    //首先居中centerIndex图片 ,centerIndex图片不需要旋转
    imgsArrangeCenterArr[0] = {
      pos: centerPos,
      rotate: 0,
      isCenter: true
    };
    //取出要布局上测的图片的状态信息
    topImgSpiceIndex = Math.floor(Math.random() * (imgsArrangeArr.length - topImgNum));
    imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpiceIndex, topImgNum);
    // 布局位于上侧的图片
    imgsArrangeTopArr.forEach((value, index) => {
      imgsArrangeTopArr[index] = {
        pos: {
          top: getRangeRandom(vPosRangeTopSecY[0], vPosRangeTopSecY[1]),
          left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
        },
        rotate: getRangeDeg(),
        isCenter: false
      };
    });
    // 布局左右两侧的图片
    for(let i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
      let hPosRangeCurrent = null;
      if (i < k) {
        hPosRangeCurrent = hPosRangeLeftSecX;
      } else {
        hPosRangeCurrent = hPosRangeRightSecX;
      }
      imgsArrangeArr[i] = {
        pos: {
          top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
          left: getRangeRandom(hPosRangeCurrent[0], hPosRangeCurrent[1])
        },
        rotate: getRangeDeg(),
        isCenter: false
      }
    }

    // 合并上侧,中间位置的图片位置信息,拼凑成全部图片位置信息
    if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
      imgsArrangeArr.splice(topImgSpiceIndex, 0, imgsArrangeTopArr[0]);
    }
    imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

    // 更改状态
    this.setState({
      imgsArrangeArr: imgsArrangeArr
    });
  }

}

AppComponent.defaultProps = {};

export default AppComponent;
