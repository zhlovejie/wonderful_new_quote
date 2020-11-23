let ws;
let canvas;
let context;
let canvasSecond;
let contextSecond;
let canvasX;
let canvasY;
let canvasLastX;
let canvasLastY;
let isDragging = false;
let canvasX_manual = 0;
let canvasY_manual = 0;
let recX_manual = 0;
let recY_manual = 0;
let recW_manual = 0;
let recH_manual = 0;
let rec_ww = 0;
let rec_hh = 0;
let CutType = 0;
let imgOrignalW = 0;
let imgOrignalH = 0;
let rorateAngleType = 0;
let cutXCaibian = 0;
let cutYCaibian = 0;
let isDrawMove = false;

let canvasLastX2;
let canvasLastY2;
let isDragging2 = false;
let canvasX_manual2 = 0;
let canvasY_manual2 = 0;
let recX_manual2 = 0;
let recY_manual2 = 0;
let recW_manual2 = 0;
let recH_manual2 = 0;
let rec_ww2 = 0;
let rec_hh2 = 0;
let imgOrignalW2 = 0;
let imgOrignalH2 = 0;
let isDrawMove2 = false;
let cutXCaibian2 = 0;
let cutYCaibian2 = 0;
let isSecondDev = true //是否有第二个摄像头 
let camidMain = 0
let camidSub = 0

let canvasOffsetLeft = 0
let canvasOffsetTop = 0
let canvasSecondOffsetLeft = 0
let canvasSecondOffsetTop = 0

let options = {}
let isFn = fn => Object.prototype.toString.call(fn) === '[object Function]'
let isBoolean = fn => Object.prototype.toString.call(fn) === '[object Boolean]'
let isIE = (() => !!window.ActiveXObject || "ActiveXObject" in window)()

export function wsClose(){
  if(ws){
    try{
      switch (ws.readyState) {
        case WebSocket.CONNECTING: //值为0，表示正在连接。
          ws.close()
          break;
        case WebSocket.OPEN: //值为1，表示连接成功，可以通信了。
          ws.close()
          break;
        case WebSocket.CLOSING: //值为2，表示连接正在关闭。
          console.log('ws连接正在关闭...')
          break;
        case WebSocket.CLOSED: //值为3，表示连接已经关闭，或者打开连接失败。
          console.log('ws连接已经关闭，或者打开连接失败...')
          break;
        default:
          break;
      }
    }catch(err){
      console.log(err)
    }
  }
}

export function registerCallback(opt={}){
  options = Object.assign({},options,opt)
  isSecondDev = isBoolean(options.isSecondDev) ? options.isSecondDev : true
}

export function WsInit(orignalCanvas,orignalCanvas2 ,enableCanvas=true) {
  WsInit_ip(orignalCanvas,orignalCanvas2, enableCanvas, "localhost");
}

function autoFillOffset(){
  try{
    if(canvas){
      let rectMain = canvas.getBoundingClientRect()
      canvasOffsetLeft = rectMain.left
      canvasOffsetTop = rectMain.top
    }
    if(canvasSecond){
      let rectSub = canvasSecond.getBoundingClientRect()
      canvasSecondOffsetLeft = rectSub.left
      canvasSecondOffsetTop = rectSub.top
    }
  }catch(err){
    console.log(err)
  }
}

function WsInit_ip(orignalCanvas,orignalCanvas2, enableCanvas, ip) {
  let orignalCanvasW = orignalCanvas.width
  let orignalCanvasH = orignalCanvas.height
  let orignalCanvasW2 = orignalCanvas2.width
  let orignalCanvasH2 = orignalCanvas2.height
  if (enableCanvas) {
    canvas = orignalCanvas
    context = canvas.getContext("2d");
    if (isSecondDev) {
      canvasSecond = orignalCanvas2
      contextSecond = canvasSecond.getContext("2d");
      canvasSecond.onmousedown = canvasClick2;
      canvasSecond.onmouseup = stopDragging2;
      canvasSecond.onmouseout = stopDragging2;
      canvasSecond.onmousemove = canvasMove2;
    }
    canvas.onmousedown = canvasClick;
    canvas.onmouseup = stopDragging;
    canvas.onmouseout = stopDragging;
    canvas.onmousemove = canvasMove;
    canvasX = 0;
    canvasY = 0;
    canvasLastX = 0;
    canvasLastY = 0;
  }

  //ws=new WebSocket("ws://localhost:9002"); 
  ws = new WebSocket("ws://" + ip + ":9002");
  ws.binaryType = "arraybuffer";
  ws.onmessage = function (event) {

    var aDataArray = new Uint8Array(event.data);
    if (aDataArray.length > 0) {
      if (aDataArray[0] == 0xef && aDataArray[1] == 0x01) {
        // getDeviceName(aDataArray[3]);
        // getResolution(aDataArray,5);
        getUsbCamareMessage(aDataArray, 5)
      } else if (aDataArray[0] == 0xef && aDataArray[1] == 0x17) {
        var camNum = aDataArray[3];
        //GetDevCount(camNum);
        isFn(options.InfoTextCallback) && options.InfoTextCallback(26, camNum);
      } else if (aDataArray[0] == 0xef && aDataArray[1] == 0x19) {
        getResolution(aDataArray, 5);

      } else if (aDataArray[0] == 0xef && aDataArray[1] == 0x23) {
        //getResolution(aDataArray,4);
        var type = aDataArray[3];
        var len = aDataArray[4];
        var data = new Uint8Array(len);
        for (var i = 0; i < len; i++) {
          data[i] = aDataArray[5 + i];
        }
        var str = byteToString(data)
        var text = decodeURIComponent(str);
        isFn(options.InfoTextCallback) && options.InfoTextCallback(type, text);

      } else if (aDataArray[0] == 0xef && aDataArray[1] == 0x05) {
        var ww = aDataArray[3] * 256 + aDataArray[4];
        var hh = aDataArray[5] * 256 + aDataArray[6];
        context.clearRect(0, 0, canvas.width, canvas.height);
        //sendMsgRefreshCam();
        var imgData = context.createImageData(ww, hh);
        var dataNum = 0;
        for (var i = 0; i < imgData.data.length; i += 4) {
          imgData.data[i + 0] = aDataArray[dataNum];
          imgData.data[i + 1] = aDataArray[dataNum + 1];
          imgData.data[i + 2] = aDataArray[dataNum + 2];
          imgData.data[i + 3] = 255;
          dataNum = dataNum + 3;
        }
        sendMsgRefreshCam();
        if (CutType == 2) {
          rec_ww = ww;
          rec_hh = hh;
          context.putImageData(imgData, canvas.width / 2 - ww / 2, canvas.height / 2 - hh / 2);
          refreshRect();
        } else context.putImageData(imgData, canvas.width / 2 - ww / 2 + canvasX, canvas.height / 2 - hh / 2 + canvasY);


      } else if (aDataArray[0] == 0xef && aDataArray[1] == 0x0c) {
        var ww = aDataArray[3] * 256 + aDataArray[4];
        var hh = aDataArray[5] * 256 + aDataArray[6];
        context.clearRect(0, 0, canvas.width, canvas.height);
        //sendMsgRefreshCam();
        var imgData = context.createImageData(ww, hh);
        var dataNum = 0;
        for (var i = 0; i < imgData.data.length; i += 4) {
          imgData.data[i + 0] = aDataArray[dataNum];
          imgData.data[i + 1] = aDataArray[dataNum + 1];
          imgData.data[i + 2] = aDataArray[dataNum + 2];
          imgData.data[i + 3] = 255;
          dataNum = dataNum + 3;
        }
        sendMsgRefreshCam();
        var Xdis = canvas.width / 2 - ww / 2 + canvasX;
        var Ydis = canvas.height / 2 - hh / 2 + canvasY;
        context.putImageData(imgData, Xdis, Ydis);

        var lenJiubian = aDataArray[7];


        context.beginPath();
        context.strokeStyle = "rgb(0,255,0)";
        context.lineWidth = 2;

        for (var j = 0; j < lenJiubian; j++) {
          for (var i = 0; i < 3; i++) {
            var aa = 1;
            if (aDataArray[8 + i * 6 + j * 24] == 1) {
              aa = -1;
            }
            var bb = 1;
            if (aDataArray[11 + i * 6 + j * 24] == 1) {
              bb = -1;
            }
            var cc = 1;
            if (aDataArray[14 + i * 6 + j * 24] == 1) {
              cc = -1;
            }
            var dd = 1;
            if (aDataArray[17 + i * 6 + j * 24] == 1) {
              dd = -1;
            }
            context.moveTo(aDataArray[9 + i * 6 + j * 24] * 256 * aa + aDataArray[10 + i * 6 + j * 24] * aa + Xdis, aDataArray[12 + i * 6 + j * 24] * 256 * bb + aDataArray[13 + i * 6 + j * 24] * bb + Ydis);
            context.lineTo(aDataArray[15 + i * 6 + j * 24] * 256 * cc + aDataArray[16 + i * 6 + j * 24] * cc + Xdis, aDataArray[18 + i * 6 + j * 24] * 256 * dd + aDataArray[19 + i * 6 + j * 24] * dd + Ydis);
            context.stroke();
          }
          var ee = 1;
          if (aDataArray[26 + j * 24] == 1) {
            ee = -1;
          }
          var ff = 1;
          if (aDataArray[8 + j * 24] == 1) {
            ff = -1;
          }
          context.moveTo(aDataArray[27 + j * 24] * 256 + aDataArray[28 + j * 24] + Xdis, aDataArray[30 + j * 24] * 256 + aDataArray[31 + j * 24] + Ydis);
          context.lineTo(aDataArray[9 + j * 24] * 256 + aDataArray[10 + j * 24] + Xdis, aDataArray[12 + j * 24] * 256 + aDataArray[13 + j * 24] + Ydis);
          context.stroke();
        }
      } else if (aDataArray[0] == 0xef && aDataArray[1] == 0x14) {
        var tmp = aDataArray[3];
        isFn(options.InfoCallback) && options.InfoCallback(tmp);
      } else if (aDataArray[0] == 0xef && aDataArray[1] == 0x26) {

        if (isSecondDev) {
          var ww = aDataArray[3] * 256 + aDataArray[4];
          var hh = aDataArray[5] * 256 + aDataArray[6];
          contextSecond.clearRect(0, 0, canvasSecond.width, canvasSecond.height);

          var imgData = contextSecond.createImageData(ww, hh);
          var dataNum = 0;
          for (var i = 0; i < imgData.data.length; i += 4) {
            imgData.data[i + 0] = aDataArray[dataNum];
            imgData.data[i + 1] = aDataArray[dataNum + 1];
            imgData.data[i + 2] = aDataArray[dataNum + 2];
            imgData.data[i + 3] = 255;
            dataNum = dataNum + 3;

          }
          sendMsgRefreshCamSecond();


          contextSecond.putImageData(imgData, canvasSecond.width / 2 - ww / 2, canvasSecond.height / 2 - hh / 2);
          if (CutType == 2) {
            rec_ww2 = ww;
            rec_hh2 = hh;
            refreshRect2();
          }


        }
      } else if (aDataArray[0] == 0xef && aDataArray[1] == 0x30) {
        var type1 = aDataArray[3];
        var ret = 1;
        if (type1 == 0) {
          ret = -1;
        }
        var min = aDataArray[4] * ret;

        var type2 = aDataArray[5];
        ret = 1;
        if (type2 == 0) {
          ret = -1;
        }
        var max = aDataArray[6] * ret;
        var text = "" + min + "*" + max;
        isFn(options.InfoTextCallback) && options.InfoTextCallback(23, text);
        // GetBrightnessRange_ws(min,max);
      } else if (aDataArray[0] == 0xef && aDataArray[1] == 0x32) {
        var type1 = aDataArray[3];
        var ret = 1;
        if (type1 == 0) {
          ret = -1;
        }
        var min = aDataArray[4] * ret;

        var type2 = aDataArray[5];
        ret = 1;
        if (type2 == 0) {
          ret = -1;
        }
        var max = aDataArray[6] * ret;
        var max = aDataArray[6] * ret;
        var text = "" + min + "*" + max;
        isFn(options.InfoTextCallback) && options.InfoTextCallback(22, text);
        // GetExposureRange_ws(min,max);
      } else if (aDataArray[0] == 0xef && aDataArray[1] == 0x36) {
        var len = aDataArray[3] * 65536 + aDataArray[4] * 256 + aDataArray[5];
        var baseDataArray = new Uint8Array(len);
        for (var i = 0; i < len; i++) {
          baseDataArray[i] = aDataArray[6 + i];
        }
        var str = byteToString(baseDataArray);
        var text = decodeURIComponent(str);

        var last = text.substr(str.length - 2, 1);
        var lastSecond = text.substr(str.length - 3, 1);
        if (last == "=" && lastSecond != "=") {
          text = text.substring(0, text.length - 1)
          text = text + "=";
        }

        isFn(options.InfoTextCallback) && options.InfoTextCallback(5, text);
      } else if (aDataArray[0] == 0xef && aDataArray[1] == 0x3b) {
        camidMain = aDataArray[3];
        // if(isSecondDev){
        camidSub = aDataArray[4];

        //主摄像头编号
        isFn(options.InfoTextCallback) && options.InfoTextCallback(-999,aDataArray[3])
        //次摄像头编号
        isFn(options.InfoTextCallback) && options.InfoTextCallback(-998,aDataArray[4])
        // }
      } else if (aDataArray[0] == 0xef && aDataArray[1] == 0x3e) {
        var len = aDataArray[3] * 65536 + aDataArray[4] * 256 + aDataArray[5];
        var baseDataArray = new Uint8Array(len);
        for (var i = 0; i < len; i++) {
          baseDataArray[i] = aDataArray[6 + i];
        }
        var str = byteToString(baseDataArray);
        var text = decodeURIComponent(str);

        isFn(options.InfoTextCallback) && options.InfoTextCallback(19, text);

      } else if (aDataArray[0] == 0xef && aDataArray[1] == 0x43) {
        var len = aDataArray[3] * 65536 + aDataArray[4] * 256 + aDataArray[5];
        var baseDataArray = new Uint8Array(len);
        for (var i = 0; i < len; i++) {
          baseDataArray[i] = aDataArray[6 + i];
        }
        var str = byteToString(baseDataArray);
        var text = decodeURIComponent(str);

        var last = text.substr(str.length - 2, 1);
        var lastSecond = text.substr(str.length - 3, 1);
        if (last == "=" && lastSecond != "=") {
          text = text.substring(0, text.length - 1)
          text = text + "=";
        }

        isFn(options.InfoTextCallback) && options.InfoTextCallback(21, text);
      } else if (aDataArray[0] == 0xef && aDataArray[1] == 0x4a) {
        rorateAngleType = aDataArray[3];
      } else if (aDataArray[0] == 0xef && aDataArray[1] == 0x4c) {
        var len = aDataArray[3] * 65536 + aDataArray[4] * 256 + aDataArray[5];
        var baseDataArray = new Uint8Array(len);
        for (var i = 0; i < len; i++) {
          baseDataArray[i] = aDataArray[6 + i];
        }
        var str = byteToString(baseDataArray);
        var text = decodeURIComponent(str);

        var last = text.substr(str.length - 2, 1);
        var lastSecond = text.substr(str.length - 3, 1);
        if (last == "=" && lastSecond != "=") {
          text = text.substring(0, text.length - 1)
          text = text + "=";
        }

        isFn(options.InfoTextCallback) && options.InfoTextCallback(25, text);
      }
      
      
      else if (aDataArray[0] == 0xef && aDataArray[1] == 0x5f) {
        var len = aDataArray[3] * 65536 + aDataArray[4] * 256 + aDataArray[5];
        var baseDataArray = new Uint8Array(len);
        for (var i = 0; i < len; i++) {
          baseDataArray[i] = aDataArray[6 + i];
        }
        var str = byteToString(baseDataArray);
        var text = decodeURIComponent(str);

        var last = text.substr(str.length - 2, 1);
        var lastSecond = text.substr(str.length - 3, 1);
        if (last == "=" && lastSecond != "=") {
          text = text.substring(0, text.length - 1)
          text = text + "=";
        }

        //InfoTextCallback(28, text);
        isFn(options.InfoTextCallback) && options.InfoTextCallback(28, text);
      } else if (aDataArray[0] == 0xef && aDataArray[1] == 0x60) {
        // faceNum = aDataArray[3];
        // for (var j = 0; j < faceNum * 4; j++) {

        //   var aa = 1;
        //   if (aDataArray[4 + j * 6] == 1) {
        //     aa = -1;
        //   }

        //   faceZuobiao[j * 2] = aDataArray[5 + j * 6] * 256 * aa + aDataArray[6 + j * 6] * aa;


        //   var bb = 1;
        //   if (aDataArray[7 + j * 6] == 1) {
        //     bb = -1;
        //   }
        //   faceZuobiao[j * 2 + 1] = aDataArray[8 + j * 6] * 256 * bb + aDataArray[9 + j * 6] * bb;

        // }


      } else if (aDataArray[0] == 0xef && aDataArray[1] == 0x62) {
        // faceNumSecond = aDataArray[3];
        // for (var j = 0; j < faceNumSecond * 4; j++) {

        //   var aa = 1;
        //   if (aDataArray[4 + j * 6] == 1) {
        //     aa = -1;
        //   }

        //   faceZuobiaoSecond[j * 2] = aDataArray[5 + j * 6] * 256 * aa + aDataArray[6 + j * 6] * aa;


        //   var bb = 1;
        //   if (aDataArray[7 + j * 6] == 1) {
        //     bb = -1;
        //   }
        //   faceZuobiaoSecond[j * 2 + 1] = aDataArray[8 + j * 6] * 256 * bb + aDataArray[9 + j * 6] * bb;

        // }


      } else if (aDataArray[0] == 0xef && aDataArray[1] == 0x67) {
        // var tmp = aDataArray[3];
        // if (tmp == 0x00) {
        //   faceNum = 0;
        // } else if (tmp == 0x01) {
        //   faceNumSecond = 0;
        // }
      } else if (aDataArray[0] == 0xef && aDataArray[1] == 0x71) {
        //getResolution(aDataArray,4);
        var type = aDataArray[3];
        var len = aDataArray[4] * 256 + aDataArray[5];
        var data = new Uint8Array(len);
        for (var i = 0; i < len; i++) {
          data[i] = aDataArray[6 + i];
        }
        var str = byteToString(data)
        var text = decodeURIComponent(str);
        //InfoTextCallback(type, text);
        isFn(options.InfoTextCallback) && options.InfoTextCallback(type, text);
      } else if (aDataArray[0] == 0xef && aDataArray[1] == 0x73) {
        var len = aDataArray[3] * 65536 + aDataArray[4] * 256 + aDataArray[5];
        var baseDataArray = new Uint8Array(len);
        for (var i = 0; i < len; i++) {
          baseDataArray[i] = aDataArray[6 + i];
        }
        var str = byteToString(baseDataArray);
        var text = decodeURIComponent(str);

        var last = text.substr(str.length - 2, 1);
        var lastSecond = text.substr(str.length - 3, 1);
        if (last == "=" && lastSecond != "=") {
          text = text.substring(0, text.length - 1)
          text = text + "=";
        }

        //InfoTextCallback(30, text);
        isFn(options.InfoTextCallback) && options.InfoTextCallback(30, text);
      } else if (aDataArray[0] == 0xef && aDataArray[1] == 0x7e) {
        var len = aDataArray[3] * 65536 + aDataArray[4] * 256 + aDataArray[5];
        var baseDataArray = new Uint8Array(len);
        for (var i = 0; i < len; i++) {
          baseDataArray[i] = aDataArray[6 + i];
        }
        var str = byteToString(baseDataArray);
        var text = decodeURIComponent(str);

        var last = text.substr(str.length - 2, 1);
        var lastSecond = text.substr(str.length - 3, 1);
        if (last == "=" && lastSecond != "=") {
          text = text.substring(0, text.length - 1)
          text = text + "=";
        }

        //InfoTextCallback(33, text);
        isFn(options.InfoTextCallback) && options.InfoTextCallback(33, text);
      } else if (aDataArray[0] == 0xef && aDataArray[1] == 0x84) {
        var len = aDataArray[3] * 65536 + aDataArray[4] * 256 + aDataArray[5];
        var baseDataArray = new Uint8Array(len);
        for (var i = 0; i < len; i++) {
          baseDataArray[i] = aDataArray[6 + i];
        }
        var str = byteToString(baseDataArray);
        var text = decodeURIComponent(str);

        var last = text.substr(str.length - 2, 1);
        var lastSecond = text.substr(str.length - 3, 1);
        if (last == "=" && lastSecond != "=") {
          text = text.substring(0, text.length - 1)
          text = text + "=";
        }

        //InfoTextCallback(36, text);
        isFn(options.InfoTextCallback) && options.InfoTextCallback(36, text);
      } else if (aDataArray[0] == 0xef && aDataArray[1] == 0x80) {
        //getResolution(aDataArray,4);
        var len = aDataArray[3] * 256 + aDataArray[4];
        //InfoTextCallback(34, len);
        isFn(options.InfoTextCallback) && options.InfoTextCallback(34, text);
      } else if (aDataArray[0] == 0xef && aDataArray[1] == 0x92) {
        var len = aDataArray[3] * 256 + aDataArray[4];
        //InfoTextCallback(37, len);
        isFn(options.InfoTextCallback) && options.InfoTextCallback(37, text);
      }
    }

  };
  ws.onclose = function (event) {
    //WebSocket Status:: Socket Closed
    isFn(options.InfoCallback) && options.InfoCallback(0xa3);
    //console.log("程序出现异常,请重新启动0x00")
  };

  ws.onopen = function (event) {
    if (enableCanvas) {
      sendMsgGetMainCameraID();
      sendMsgRefreshDev();
      initParameter(orignalCanvasW, orignalCanvasH, orignalCanvasW2, orignalCanvasH2);
    }

    isFn(options.InfoCallback) && options.InfoCallback(0x24);

  };
  ws.onerror = function (event) {
    //WebSocket Status:: Error was reported
    isFn(options.InfoCallback) && options.InfoCallback(0xa4);
    //console.log("程序出现异常,请重新启动0x01");
  };
}

function initParameter(orignalCanvasW, orignalCanvasH, orignalCanvasW2, orignalCanvasH2) {
  sendMsgBestSize();
  sendMsgSetCutType(0);
  sendMsgSetFileType(0);
  sendMsgSetImageColorMode(0);
  sendMsgSetConntinousShotModel(0);
  sendMsgChangeOrientation(0);
  sendMsgSetCanvasOriginalSize(orignalCanvasW, orignalCanvasH);
  sendMsgSetCanvasSecondOriginalSize(orignalCanvasW2, orignalCanvasH2);

}

function canvasClick(e) {
  //debugger
  isDragging = true;
  if (!isDrawMove) {
    canvasLastX = 0;

    canvasLastY = 0;
    canvasX_manual = 0;
    canvasY_manual = 0;

    recX_manual = 0;
    recY_manual = 0;
    recW_manual = 0;
    recH_manual = 0;
  } else {

  }
}

function stopDragging() {
  isDragging = false;
  canvasLastX = 0;
  canvasLastY = 0;
  canvasX_manual = 0;
  canvasY_manual = 0;
  if (CutType == 2) {
    var bpp = rec_ww / imgOrignalW;
    if (rorateAngleType == 1 || rorateAngleType == 3) {
      bpp = rec_ww / imgOrignalH;
    }
    cutXCaibian = Math.abs(recW_manual) / bpp;
    cutYCaibian = Math.abs(recH_manual) / bpp;
  }
}

function canvasMove(e) {
  //console.log(e.pageX,e.pageY,canvas.offsetLeft,canvas.offsetTop)
  autoFillOffset()
  var mx = e.pageX - canvasOffsetLeft;
  var my = e.pageY - canvasOffsetTop;
  if (CutType == 2) {
    var x1 = recX_manual;
    var x2 = recX_manual + recW_manual;
    if (x1 > x2) {
      x1 = x2;
      x2 = recX_manual;
    }

    var y1 = recY_manual;
    var y2 = recY_manual + recH_manual;
    if (y1 > y2) {
      y1 = y2;
      y2 = recY_manual;
    }

    if (x1 <= mx && mx <= x2 && y1 <= my && my <= y2) {
      isDrawMove = true;
      if (isDragging) {
        if (canvasLastX == 0 && canvasLastY == 0) {
          canvasLastX = mx;
          canvasLastY = my;

        } else {
          recX_manual = recX_manual + (mx - canvasLastX);
          recY_manual = recY_manual + (my - canvasLastY);
          canvasLastX = mx;
          canvasLastY = my;
        }

      }
      return;
    } else if (x1 - 30 <= mx && mx <= x2 + 30 && y1 - 30 <= my && my <= y2 + 30) {
      isDrawMove = true;
      if (isDragging) {
        if (canvasLastX == 0 && canvasLastY == 0) {

          canvasLastX = mx;
          canvasLastY = my;

        } else {
          var tmpX2 = recX_manual + recW_manual;
          if (Math.abs(recX_manual - mx) < Math.abs(tmpX2 - mx)) {
            recX_manual = recX_manual + (mx - canvasLastX);
            recW_manual = recW_manual - (mx - canvasLastX);
          } else recW_manual = recW_manual + (mx - canvasLastX);

          var tmpY2 = recY_manual + recH_manual;
          if (Math.abs(recY_manual - my) < Math.abs(tmpY2 - my)) {
            recY_manual = recY_manual + (my - canvasLastY);
            recH_manual = recH_manual - (my - canvasLastY);
          } else recH_manual = recH_manual + (my - canvasLastY);

          canvasLastX = mx;
          canvasLastY = my;
        }

        return;
      }
    } else isDrawMove = false;
  }

  if (isDragging == true) {
    if (CutType != 2) {
      if (canvasLastX == 0 && canvasLastY == 0) {
        canvasLastX = e.pageX - canvas.offsetLeft;
        canvasLastY = e.pageY - canvas.offsetTop;

      } else {

        canvasX = canvasX + (mx - canvasLastX);
        canvasY = canvasY + (my - canvasLastY);
        canvasLastX = mx;
        canvasLastY = my;
      }
    } else {




      if (canvasLastX == 0 && canvasLastY == 0) {

        canvasLastX = mx;
        canvasLastY = my;
        recX_manual = mx;
        recY_manual = my;
      } else {



        canvasX_manual = canvasX_manual + (mx - canvasLastX);
        canvasY_manual = canvasY_manual + (my - canvasLastY);
        canvasLastX = mx;
        canvasLastY = my;
        recW_manual = canvasX_manual;
        recH_manual = canvasY_manual;
      }

    }
  }
}

function canvasClick2(e) {
  isDragging2 = true;
  if (!isDrawMove2) {
    canvasLastX2 = 0;

    canvasLastY2 = 0;
    canvasX_manual2 = 0;
    canvasY_manual2 = 0;

    recX_manual2 = 0;
    recY_manual2 = 0;
    recW_manual2 = 0;
    recH_manual2 = 0;
  }
}

function stopDragging2() {
  isDragging2 = false;
  canvasLastX2 = 0;
  canvasLastY2 = 0;
  canvasX_manual2 = 0;
  canvasY_manual2 = 0;
  if (CutType == 2) {
    var bpp2 = rec_ww2 / imgOrignalW2;
    cutXCaibian2 = Math.abs(recW_manual2) / bpp2;
    cutYCaibian2 = Math.abs(recH_manual2) / bpp2;
  }
}

function canvasMove2(e) {
  autoFillOffset()
  var mx = e.pageX - canvasSecondOffsetLeft;
  var my = e.pageY - canvasSecondOffsetTop;
  if (CutType == 2) {
    var x1 = recX_manual2;
    var x2 = recX_manual2 + recW_manual2;
    if (x1 > x2) {
      x1 = x2;
      x2 = recX_manual2;
    }

    var y1 = recY_manual2;
    var y2 = recY_manual2 + recH_manual2;
    if (y1 > y2) {
      y1 = y2;
      y2 = recY_manual2;
    }

    if (x1 <= mx && mx <= x2 && y1 <= my && my <= y2) {
      isDrawMove2 = true;
      if (isDragging2) {
        if (canvasLastX2 == 0 && canvasLastY2 == 0) {
          canvasLastX2 = mx;
          canvasLastY2 = my;

        } else {
          recX_manual2 = recX_manual2 + (mx - canvasLastX2);
          recY_manual2 = recY_manual2 + (my - canvasLastY2);
          canvasLastX2 = mx;
          canvasLastY2 = my;
        }

      }
      return;

    } else if (x1 - 30 <= mx && mx <= x2 + 30 && y1 - 30 <= my && my <= y2 + 30) {
      isDrawMove2 = true;
      if (isDragging2) {
        if (canvasLastX2 == 0 && canvasLastY2 == 0) {

          canvasLastX2 = mx;
          canvasLastY2 = my;

        } else {

          var tmpX2 = recX_manual2 + recW_manual2;
          if (Math.abs(recX_manual2 - mx) < Math.abs(tmpX2 - mx)) {
            recX_manual2 = recX_manual2 + (mx - canvasLastX2);
            recW_manual2 = recW_manual2 - (mx - canvasLastX2);
          } else recW_manual2 = recW_manual2 + (mx - canvasLastX2);

          var tmpY2 = recY_manual2 + recH_manual2;
          if (Math.abs(recY_manual2 - my) < Math.abs(tmpY2 - my)) {
            recY_manual2 = recY_manual2 + (my - canvasLastY2);
            recH_manual2 = recH_manual2 - (my - canvasLastY2);
          } else recH_manual2 = recH_manual2 + (my - canvasLastY2);

          canvasLastX2 = mx;
          canvasLastY2 = my;
        }

        return;
      }
    } else isDrawMove2 = false;
  }

  if (isDragging2 == true) {
    if (CutType != 2) {

    } else {

      if (canvasLastX2 == 0 && canvasLastY2 == 0) {

        canvasLastX2 = mx;
        canvasLastY2 = my;
        recX_manual2 = mx;
        recY_manual2 = my;
      } else {

        canvasX_manual2 = canvasX_manual2 + (mx - canvasLastX2);
        canvasY_manual2 = canvasY_manual2 + (my - canvasLastY2);
        canvasLastX2 = mx;
        canvasLastY2 = my;
        recW_manual2 = canvasX_manual2;
        recH_manual2 = canvasY_manual2;
      }

    }
  }
}

function getResolution(arrayData, tmpNum) {
  var type = arrayData[3]
  var len = arrayData[4];
  var data = new Int32Array(len * 2);
  var num = 0;
  for (var i = 0; i < len; i++) {
    data[num] = arrayData[tmpNum] * 256 + arrayData[tmpNum + 1];
    num++;
    data[num] = arrayData[tmpNum + 2] * 256 + arrayData[tmpNum + 3];
    num++;
    tmpNum += 4;
  }
  if (type == 0) {
    //获取分辨率(data为分辨率数组,每2个为一组,宽高)
    isFn(options.GetDeviceResolution) && options.GetDeviceResolution(data);
  } else {
    if (isSecondDev) {
      //获取分辨率副头(data为分辨率数组,每2个为一组,宽高)
      isFn(options.GetDeviceResolutionSecond) && options.GetDeviceResolutionSecond(data);
      //设备2初始化完成,可以进行相关操作
      isFn(options.LoadOver2) && options.LoadOver2();
    }
  }

}

function getUsbCamareMessage(arrayData, tmpNum) {
  var numCam = arrayData[3];
  var len = arrayData[4];
  var data = new Int32Array(len * 2);
  var num = 0;
  for (var i = 0; i < len; i++) {
    data[num] = arrayData[tmpNum] * 256 + arrayData[tmpNum + 1];
    num++;
    data[num] = arrayData[tmpNum + 2] * 256 + arrayData[tmpNum + 3];
    num++;
    tmpNum += 4;
  }
  //获取分辨率(data为分辨率数组,每2个为一组,宽高)
  isFn(options.GetDeviceResolution) && options.GetDeviceResolution(data);
  //加载完成回调
  isFn(options.LoadOver) && options.LoadOver();

  var strUsbNamr = new Array()
  for (var i = 0; i < numCam; i++) {
    var tmpLen = arrayData[tmpNum];
    var tmpData = new Uint8Array(tmpLen);
    tmpNum++;
    for (var j = 0; j < tmpLen; j++) {
      tmpData[j] = arrayData[tmpNum];
      tmpNum++;
    }
    // var arr =       Utf8ToUnicode(tmpData)
    var str = byteToString(tmpData);
    var text = decodeURIComponent(str);
    strUsbNamr[i] = text;
  }
  //获取设备名称(num为当前摄像头数量,strUsbNamr为摄像头名字数组)
  isFn(options.GetDevName) && options.GetDevName(numCam, strUsbNamr);


}



function sendMsgRefreshCam() {
  var aDataArray = new Uint8Array(3);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x04;
  aDataArray[2] = 0x00;
  ws.send(aDataArray.buffer);
}

function sendMsgStartVideo2(camId, width, height) {

  imgOrignalW2 = width;
  imgOrignalH2 = height;
  var aDataArray = new Uint8Array(8);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x25;
  aDataArray[2] = 0x05;
  aDataArray[3] = camId;
  aDataArray[4] = width / 256;
  aDataArray[5] = width % 256;
  aDataArray[6] = height / 256;
  aDataArray[7] = height % 256;
  ws.send(aDataArray.buffer);
}

function sendMsgRefreshCamSecond() {
  var aDataArray = new Uint8Array(3);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x27;
  aDataArray[2] = 0x00;
  ws.send(aDataArray.buffer);
}

function sendMsgSetCanvasOriginalSize(ww, hh) {
  var aDataArray = new Uint8Array(7);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x15;
  aDataArray[2] = 0x04;
  aDataArray[3] = ww / 256;
  aDataArray[4] = ww % 256;
  aDataArray[5] = hh / 256;
  aDataArray[6] = hh % 256;
  ws.send(aDataArray.buffer);
}

function sendMsgSetCanvasSecondOriginalSize(ww, hh) {
  var aDataArray = new Uint8Array(7);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x37;
  aDataArray[2] = 0x04;
  aDataArray[3] = ww / 256;
  aDataArray[4] = ww % 256;
  aDataArray[5] = hh / 256;
  aDataArray[6] = hh % 256;
  ws.send(aDataArray.buffer);
}

function sendMsgRefreshDev() {
  var aDataArray = new Uint8Array(3);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x00;
  aDataArray[2] = 0x00;
  ws.send(aDataArray.buffer);
}

function sendMsgStartVideo(camId, width, height) {

  imgOrignalW = width;
  imgOrignalH = height;
  var aDataArray = new Uint8Array(8);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x02;
  aDataArray[2] = 0x05;
  aDataArray[3] = camId;
  aDataArray[4] = width / 256;
  aDataArray[5] = width % 256;
  aDataArray[6] = height / 256;
  aDataArray[7] = height % 256;
  ws.send(aDataArray.buffer);
}

function sendMsgChangeOrientation(type) {
  var aDataArray = new Uint8Array(4);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x06;
  aDataArray[2] = 0x01;
  aDataArray[3] = type;
  ws.send(aDataArray.buffer);
}

function sendMsgSetImageColorMode(type) {
  var aDataArray2 = new Uint8Array(4);
  aDataArray2[0] = 0xef;
  aDataArray2[1] = 0x07;
  aDataArray2[2] = 0x01;
  aDataArray2[3] = type;
  ws.send(aDataArray2.buffer);
}

function sendMsgCloseVideo() {

  var aDataArray = new Uint8Array(3);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x08;
  aDataArray[2] = 0x00;
  ws.send(aDataArray.buffer);
  context.clearRect(0, 0, canvas.width, canvas.height);
}

function sendMsgCloseVideoSecond() {

  var aDataArray = new Uint8Array(3);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x28;
  aDataArray[2] = 0x00;
  ws.send(aDataArray.buffer);
  contextSecond.clearRect(0, 0, canvas.width, canvas.height);
}

function sendMsgChangeResolution(camId, width, height) {



  var aDataArray = new Uint8Array(8);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x02;
  aDataArray[2] = 0x05;
  aDataArray[3] = camId;
  aDataArray[4] = width / 256;
  aDataArray[5] = width % 256;
  aDataArray[6] = height / 256;
  aDataArray[7] = height % 256;
  ws.send(aDataArray.buffer);
}

function sendMsgSetFilePath(pathUnicode) {
  var path = encodeURI(pathUnicode);
  var pathdata = stringToByte(path);
  var len = path.length;
  var aDataArray = new Uint8Array(3 + len);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x1c;
  aDataArray[2] = len;
  for (var i = 0; i < len; i++) {
    aDataArray[3 + i] = pathdata[i];
  }
  ws.send(aDataArray.buffer);
}

function sendMsgSetFileNameModelCustom(index, pathUnicode) {
  var path = encodeURI(pathUnicode);
  var pathdata = stringToByte(path);
  var len = path.length;
  var aDataArray = new Uint8Array(6 + len);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x1d;
  aDataArray[2] = len + 3;
  aDataArray[3] = index / 256;
  aDataArray[4] = index % 256;
  aDataArray[5] = len;
  for (var i = 0; i < len; i++) {
    aDataArray[6 + i] = pathdata[i];
  }
  ws.send(aDataArray.buffer);
}

function sendMsgSetFileNameModelCustomSecond(index, pathUnicode) {
  var path = encodeURI(pathUnicode);
  var pathdata = stringToByte(path);
  var len = path.length;
  var aDataArray = new Uint8Array(6 + len);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x46;
  aDataArray[2] = len + 3;
  aDataArray[3] = index / 256;
  aDataArray[4] = index % 256;
  aDataArray[5] = len;
  for (var i = 0; i < len; i++) {
    aDataArray[6 + i] = pathdata[i];
  }
  ws.send(aDataArray.buffer);
}

function sendMsgSetFileNameModelFixed(pathUnicode) {
  var path = encodeURI(pathUnicode);
  var pathdata = stringToByte(path);
  var len = path.length;
  var aDataArray = new Uint8Array(3 + len);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x1f;
  aDataArray[2] = len;
  for (var i = 0; i < len; i++) {
    aDataArray[3 + i] = pathdata[i];
  }
  ws.send(aDataArray.buffer);
}

function sendMsgSetFileNameModelFixedSecond(pathUnicode) {
  var path = encodeURI(pathUnicode);
  var pathdata = stringToByte(path);
  var len = path.length;
  var aDataArray = new Uint8Array(3 + len);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x48;
  aDataArray[2] = len;
  for (var i = 0; i < len; i++) {
    aDataArray[3 + i] = pathdata[i];
  }
  ws.send(aDataArray.buffer);
}

function sendMsgSetFileNameModelTime() {
  var aDataArray = new Uint8Array(3);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x1e;
  aDataArray[2] = 0x00;
  ws.send(aDataArray.buffer);
}

function sendMsgSetFileNameModelTimeSecond() {
  var aDataArray = new Uint8Array(3);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x47;
  aDataArray[2] = 0x00;
  ws.send(aDataArray.buffer);
}

function sendMsgSetFileNameModelBarcode() {
  var aDataArray = new Uint8Array(3);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x2b;
  aDataArray[2] = 0x00;
  ws.send(aDataArray.buffer);
}

function sendMsgSetFileType(type) {
  var aDataArray = new Uint8Array(4);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x20;
  aDataArray[2] = 0x01;
  aDataArray[3] = type;
  ws.send(aDataArray.buffer);
}

function sendMsgSetConntinousShotModel(type) {
  var aDataArray = new Uint8Array(4);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x21;
  aDataArray[2] = 0x01;
  aDataArray[3] = type;
  ws.send(aDataArray.buffer);
}

function sendMsgSetConntinousShotModelTime(len) {
  var aDataArray = new Uint8Array(5);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x22;
  aDataArray[2] = 0x02;
  aDataArray[3] = len / 256;
  aDataArray[4] = len % 256;
  ws.send(aDataArray.buffer);
}

function sendMsgUploadFile(uploadSerHead, uploadSerLast, uploadSerFile) {
  var path = encodeURI(uploadSerHead);
  var pathdata = stringToByte(path);
  var len = path.length;

  var path2 = encodeURI(uploadSerLast);
  var pathdata2 = stringToByte(path2);
  var len2 = path2.length;

  var path3 = encodeURI(uploadSerFile);
  var pathdata3 = stringToByte(path3);
  var len3 = path3.length;

  var aDataArray = new Uint8Array(8 + len + len2 + len3);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x24;
  aDataArray[2] = 5 + len + len2 + len3;
  aDataArray[3] = 0x00;
  aDataArray[4] = 80 % 256;
  aDataArray[5] = len;
  for (var i = 0; i < len; i++) {
    aDataArray[6 + i] = pathdata[i];
  }
  aDataArray[6 + len] = len2;
  for (var i = 0; i < len2; i++) {
    aDataArray[7 + len + i] = pathdata2[i];
  }
  aDataArray[7 + len + len2] = len3;
  for (var i = 0; i < len3; i++) {
    aDataArray[8 + len + len2 + i] = pathdata3[i];
  }
  ws.send(aDataArray.buffer);

}

function sendMsgUploadFilePort(port, uploadSerHead, uploadSerLast, uploadSerFile) {
  var path = encodeURI(uploadSerHead);
  var pathdata = stringToByte(path);
  var len = path.length;

  var path2 = encodeURI(uploadSerLast);
  var pathdata2 = stringToByte(path2);
  var len2 = path2.length;

  var path3 = encodeURI(uploadSerFile);
  var pathdata3 = stringToByte(path3);
  var len3 = path3.length;

  var aDataArray = new Uint8Array(8 + len + len2 + len3);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x24;
  aDataArray[2] = 5 + len + len2 + len3;
  aDataArray[3] = port / 256;
  aDataArray[4] = port % 256;
  aDataArray[5] = len;
  for (var i = 0; i < len; i++) {
    aDataArray[6 + i] = pathdata[i];
  }
  aDataArray[6 + len] = len2;
  for (var i = 0; i < len2; i++) {
    aDataArray[7 + len + i] = pathdata2[i];
  }
  aDataArray[7 + len + len2] = len3;
  for (var i = 0; i < len3; i++) {
    aDataArray[8 + len + len2 + i] = pathdata3[i];
  }
  ws.send(aDataArray.buffer);

}

function sendMsgCapture(type) {
  if (type != 2) {
    var aDataArray = new Uint8Array(4);
    aDataArray[0] = 0xef;
    aDataArray[1] = 0x0a;
    aDataArray[2] = 0x01;
    aDataArray[3] = 0x00;
    ws.send(aDataArray.buffer);
  } else {
    var x1 = recX_manual;
    if (recX_manual > recX_manual + recW_manual) {
      x1 = recX_manual + recW_manual;

    }
    var y1 = recY_manual;
    if (recY_manual > recY_manual + recH_manual) {
      y1 = recY_manual + recH_manual;

    }


    //   var bpp = rec_ww/imgOrignalW;

    // if(rorateAngleType==1 || rorateAngleType==3){
    //   bpp = rec_hh/imgOrignalH;
    // }

    //var w1 = Math.abs(recW_manual/bpp);
    //  var h1 = Math.abs(recH_manual/bpp);
    var xsend = x1 - (canvas.width / 2 - rec_ww / 2);
    var ysend = y1 - (canvas.height / 2 - rec_hh / 2);


    if (xsend < 0) xsend = 0;
    if (ysend < 0) ysend = 0;
    var aDataArray = new Uint8Array(11);
    aDataArray[0] = 0xef;
    //aDataArray[1] = 0x0f;
    aDataArray[1] = 0x4b;
    aDataArray[2] = 0x08;
    aDataArray[3] = xsend / 256;
    aDataArray[4] = xsend % 256;
    aDataArray[5] = ysend / 256;
    aDataArray[6] = ysend % 256;
    aDataArray[7] = cutXCaibian / 256;
    aDataArray[8] = cutXCaibian % 256;
    aDataArray[9] = cutYCaibian / 256;
    aDataArray[10] = cutYCaibian % 256;
    // aDataArray[7] = recW_manual/256;
    // aDataArray[8] = recW_manual%256;
    // aDataArray[9] = recH_manual/256;
    // aDataArray[10] = recH_manual%256;
    ws.send(aDataArray.buffer);
  }

}

function sendMsgCaptureSecond() {
  var aDataArray = new Uint8Array(3);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x29;
  aDataArray[2] = 0x00;
  ws.send(aDataArray.buffer);
}

function sendMsgCaptureSecondCaibian() {
  var x1 = recX_manual2;
  if (recX_manual2 > recX_manual2 + recW_manual2) {
    x1 = recX_manual2 + recW_manual2;

  }
  var y1 = recY_manual2;
  if (recY_manual2 > recY_manual2 + recH_manual2) {
    y1 = recY_manual2 + recH_manual2;

  }

  var xsend = x1 - (canvasSecond.width / 2 - rec_ww2 / 2);
  var ysend = y1 - (canvasSecond.height / 2 - rec_hh2 / 2);


  if (xsend < 0) xsend = 0;
  if (ysend < 0) ysend = 0;
  var aDataArray = new Uint8Array(11);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x4c;
  aDataArray[2] = 0x08;
  aDataArray[3] = xsend / 256;
  aDataArray[4] = xsend % 256;
  aDataArray[5] = ysend / 256;
  aDataArray[6] = ysend % 256;
  aDataArray[7] = cutXCaibian2 / 256;
  aDataArray[8] = cutXCaibian2 % 256;
  aDataArray[9] = cutYCaibian2 / 256;
  aDataArray[10] = cutYCaibian2 % 256;

  ws.send(aDataArray.buffer);
}

function sendMsgShowImageSettingWindow() {
  var aDataArray = new Uint8Array(3);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x0b;
  aDataArray[2] = 0x00;
  ws.send(aDataArray.buffer);
}

export function sendMsgShowImageSettingWindowB() {
  var aDataArray = new Uint8Array(3);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x45;
  aDataArray[2] = 0x00;
  ws.send(aDataArray.buffer);
}


function sendMsgZoom(type) {
  var aDataArray = new Uint8Array(4);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x0d;
  aDataArray[2] = 0x01;
  aDataArray[3] = type;
  ws.send(aDataArray.buffer);
}

function sendMsgSetCutType(type) {
  canvasX = 0;
  canvasY = 0;
  CutType = type;
  var aDataArray = new Uint8Array(4);

  aDataArray[0] = 0xef;
  aDataArray[1] = 0x0e;
  aDataArray[2] = 0x01;
  aDataArray[3] = type;
  ws.send(aDataArray.buffer);

}

function sendMsgSetJiubianModel(type) {
  var aDataArray = new Uint8Array(4);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x10;
  aDataArray[2] = 0x01;
  aDataArray[3] = type;
  ws.send(aDataArray.buffer);

}

function sendMsgGetCamNum() {
  var aDataArray = new Uint8Array(3);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x16;
  aDataArray[2] = 0x00;
  ws.send(aDataArray.buffer);

}

function sendMsgGetResolution(camid) {
  var aDataArray = new Uint8Array(5);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x18;
  aDataArray[2] = 0x02;
  aDataArray[3] = 0x00;
  aDataArray[4] = camid;
  ws.send(aDataArray.buffer);
}

function sendMsgGetResolutionSecond(camid) {
  var aDataArray = new Uint8Array(5);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x18;
  aDataArray[2] = 0x02;
  aDataArray[3] = 0x01;
  aDataArray[4] = camid;
  ws.send(aDataArray.buffer);
}

function sednMsgSavePDF(pathUnicode) {
  var path = encodeURI(pathUnicode);
  var pathdata = stringToByte(path);
  var len = path.length;
  var aDataArray = new Uint8Array(3 + len);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x11;
  aDataArray[2] = len;
  for (var i = 0; i < len; i++) {
    aDataArray[3 + i] = pathdata[i];
  }
  ws.send(aDataArray.buffer);
}

function sednMsgAddPDF(pathUnicode) {
  var path = encodeURI(pathUnicode);
  var pathdata = stringToByte(path);
  var len = path.length;
  var aDataArray = new Uint8Array(3 + len);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x12;
  aDataArray[2] = len;
  for (var i = 0; i < len; i++) {
    aDataArray[3 + i] = pathdata[i];
  }
  ws.send(aDataArray.buffer);
}

function sednMsgWaterMarkOpen(pathUnicode, fontSize, fontStyleIndex, r, g, b, xoffset, yoffset) {
  var path = encodeURI(pathUnicode);
  var pathdata = stringToByte(path);
  var len = path.length;

  var aDataArray = new Uint8Array(11 + len);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x1a;
  aDataArray[2] = 8 + len;
  aDataArray[3] = fontSize;
  aDataArray[4] = fontStyleIndex;
  aDataArray[5] = r;
  aDataArray[6] = g;
  aDataArray[7] = b;
  aDataArray[8] = xoffset;
  aDataArray[9] = yoffset;
  aDataArray[10] = len;
  for (var i = 0; i < len; i++) {
    aDataArray[11 + i] = pathdata[i];
  }
  ws.send(aDataArray.buffer);
}

function sednMsgWaterMarkClose() {
  var aDataArray = new Uint8Array(3);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x1b;
  aDataArray[2] = 0x00;
  ws.send(aDataArray.buffer);
}

function sednMsgBubaiType(type) {
  var aDataArray = new Uint8Array(4);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x2c;
  aDataArray[2] = 0x01;
  aDataArray[3] = type;
  ws.send(aDataArray.buffer);
}

function sednMsgQuqudiseType(type) {
  var aDataArray = new Uint8Array(4);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x34;
  aDataArray[2] = 0x01;
  aDataArray[3] = type;
  ws.send(aDataArray.buffer);
}

function sendMsgCombineTwoImage(path1Unicode, path2Unicode, path3Unicode, type) {
  var path1 = encodeURI(path1Unicode);
  var pathdata1 = stringToByte(path1);
  var len1 = path1.length;

  var path2 = encodeURI(path2Unicode);
  var pathdata2 = stringToByte(path2);
  var len2 = path2.length;

  var path3 = encodeURI(path3Unicode);
  var pathdata3 = stringToByte(path3);
  var len3 = path3.length;

  var aDataArray = new Uint8Array(7 + len1 + len2 + len3);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x13;
  aDataArray[2] = len1 + len2 + len3 + 4;
  aDataArray[3] = type;
  aDataArray[4] = len1;
  for (var i = 0; i < len1; i++) {
    aDataArray[5 + i] = pathdata1[i];
  }
  aDataArray[5 + len1] = len2;
  for (var i = 0; i < len2; i++) {
    aDataArray[6 + len1 + i] = pathdata2[i];
  }

  aDataArray[6 + len1 + len2] = len3;
  for (var i = 0; i < len3; i++) {
    aDataArray[7 + len1 + len2 + i] = pathdata3[i];
  }
  ws.send(aDataArray.buffer);
}

function sendMsgSetAutoExposure(type) {
  var aDataArray = new Uint8Array(4);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x2d;
  aDataArray[2] = 0x01;
  aDataArray[3] = type;
  ws.send(aDataArray.buffer);
}

function sendMsgGetExposureRange() {
  var aDataArray = new Uint8Array(3);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x31;
  aDataArray[2] = 0x00;
  ws.send(aDataArray.buffer);
}

function sendMsgGetBrightnessRange() {
  var aDataArray = new Uint8Array(3);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x2e;
  aDataArray[2] = 0x00;
  ws.send(aDataArray.buffer);
}

function sendMsgSetBrightness(temp) {
  var type;
  if (temp < 0) {
    type = 0;
  } else {
    type = 1;
  }
  temp = Math.abs(temp);
  var aDataArray = new Uint8Array(5);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x2f;
  aDataArray[2] = 0x02;
  aDataArray[3] = type;
  aDataArray[4] = temp;
  ws.send(aDataArray.buffer);
}

function sendMsgSetExposure(temp) {
  var type;
  if (temp < 0) {
    type = 0;
  } else {
    type = 1;
  }
  temp = Math.abs(temp);
  var aDataArray = new Uint8Array(5);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x33;
  aDataArray[2] = 0x02;
  aDataArray[3] = type;
  aDataArray[4] = temp;
  ws.send(aDataArray.buffer);
}

function sednMsgGetBase64(filename) {
  var path = encodeURI(filename);
  var pathdata = stringToByte(path);
  var len = path.length;
  var aDataArray = new Uint8Array(3 + len);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x35;
  aDataArray[2] = len;
  for (var i = 0; i < len; i++) {
    aDataArray[3 + i] = pathdata[i];
  }
  ws.send(aDataArray.buffer);
}

function sendMsgDeleteFile(pathUnicode) {
  var path = encodeURI(pathUnicode);
  var pathdata = stringToByte(path);
  var len = path.length;
  var aDataArray = new Uint8Array(3 + len);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x38;
  aDataArray[2] = len;
  for (var i = 0; i < len; i++) {
    aDataArray[3 + i] = pathdata[i];
  }
  ws.send(aDataArray.buffer);
}

function sendMsgQrcode(pathUnicode) {
  var path = encodeURI(pathUnicode);
  var pathdata = stringToByte(path);
  var len = path.length;
  var aDataArray = new Uint8Array(3 + len);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x39;
  aDataArray[2] = len;
  for (var i = 0; i < len; i++) {
    aDataArray[3 + i] = pathdata[i];
  }
  ws.send(aDataArray.buffer);
}

function sendMsgBarcode(pathUnicode) {
  var path = encodeURI(pathUnicode);
  var pathdata = stringToByte(path);
  var len = path.length;
  var aDataArray = new Uint8Array(3 + len);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x44;
  aDataArray[2] = len;
  for (var i = 0; i < len; i++) {
    aDataArray[3 + i] = pathdata[i];
  }
  ws.send(aDataArray.buffer);
}

function sendMsgGetMainCameraID() {
  var aDataArray = new Uint8Array(4);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x3a;
  aDataArray[2] = 0x01;
  aDataArray[3] = 0x01;
  ws.send(aDataArray.buffer);
}

function sendMsgStartIDCard() {
  var aDataArray = new Uint8Array(4);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x3c;
  aDataArray[2] = 0x01;
  aDataArray[3] = 0x00;
  ws.send(aDataArray.buffer);
}

function sendMsgGetOneIC() {
  var aDataArray = new Uint8Array(4);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x3c;
  aDataArray[2] = 0x01;
  aDataArray[3] = 0x01;
  ws.send(aDataArray.buffer);
}

function sendMsgGetICValues(type) {
  var aDataArray = new Uint8Array(4);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x3d;
  aDataArray[2] = 0x01;
  aDataArray[3] = type;
  ws.send(aDataArray.buffer);
}

function sendMsgRotateL() {
  var aDataArray = new Uint8Array(4);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x40;
  aDataArray[2] = 0x01;
  aDataArray[3] = 0;
  ws.send(aDataArray.buffer);
}

function sendMsgRotateR() {
  var aDataArray = new Uint8Array(4);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x40;
  aDataArray[2] = 0x01;
  aDataArray[3] = 1;
  ws.send(aDataArray.buffer);
}

function sendMsgBestSize() {
  canvasX = 0;
  canvasY = 0;
  var aDataArray = new Uint8Array(4);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x0d;
  aDataArray[2] = 0x01;
  aDataArray[3] = 2;
  ws.send(aDataArray.buffer);
}

function sendMsgTrueSize() {
  canvasX = 0;
  canvasY = 0;
  var aDataArray = new Uint8Array(4);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x0d;
  aDataArray[2] = 0x01;
  aDataArray[3] = 3;
  ws.send(aDataArray.buffer);
}


function sendMsgWorkIDCard() {
  var aDataArray = new Uint8Array(4);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x41;
  aDataArray[2] = 0x01;
  aDataArray[3] = 0x01;
  ws.send(aDataArray.buffer);
}

function sendMsgStopWorkIDCard() {
  var aDataArray = new Uint8Array(4);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x41;
  aDataArray[2] = 0x01;
  aDataArray[3] = 0x00;
  ws.send(aDataArray.buffer);
}

function sendMsgShotBase64(type) {
  var aDataArray = new Uint8Array(4);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x42;
  aDataArray[2] = 0x01;
  aDataArray[3] = type;
  ws.send(aDataArray.buffer);
}

function sendMsgSetJpgQuanlity(value) {
  var aDataArray2 = new Uint8Array(4);
  aDataArray2[0] = 0xef;
  aDataArray2[1] = 0x49;
  aDataArray2[2] = 0x01;
  aDataArray2[3] = value;
  ws.send(aDataArray2.buffer);
}

function sendMsgGetICPictureAll() {
  var aDataArray = new Uint8Array(3);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x4d;
  aDataArray[2] = 0x00;
  ws.send(aDataArray.buffer);
}

function sendMsgInitFinger() {

  var aDataArray = new Uint8Array(3);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x4f;
  aDataArray[2] = 0x00;
  ws.send(aDataArray.buffer);
}

function sendMsgStartFinger() {

  var aDataArray = new Uint8Array(4);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x50;
  aDataArray[2] = 0x01;
  aDataArray[3] = 0x01;
  ws.send(aDataArray.buffer);
}

function sendMsgCloseFinger() {

  var aDataArray = new Uint8Array(4);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x50;
  aDataArray[2] = 0x01;
  aDataArray[3] = 0x00;
  ws.send(aDataArray.buffer);
}

function sendMsgBeginVideo(pathUnicode, id, frame) {
  var path = encodeURI(pathUnicode);
  var pathdata = stringToByte(path);
  var len = path.length;
  var aDataArray = new Uint8Array(6 + len);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x51;
  aDataArray[2] = len + 3;
  aDataArray[3] = id;
  aDataArray[4] = frame;
  aDataArray[5] = len;
  for (var i = 0; i < len; i++) {
    aDataArray[6 + i] = pathdata[i];
  }
  ws.send(aDataArray.buffer);
}

function sendMsgStopVideo() {

  var aDataArray = new Uint8Array(3);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x52;
  aDataArray[2] = 0x00;
  ws.send(aDataArray.buffer);
}

function sendMsgBeginVideoSecond(pathUnicode, id, frame) {
  var path = encodeURI(pathUnicode);
  var pathdata = stringToByte(path);
  var len = path.length;
  var aDataArray = new Uint8Array(6 + len);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x53;
  aDataArray[2] = len + 3;
  aDataArray[3] = id;
  aDataArray[4] = frame;
  aDataArray[5] = len;
  for (var i = 0; i < len; i++) {
    aDataArray[6 + i] = pathdata[i];
  }
  ws.send(aDataArray.buffer);
}

function sendMsgStopVideoSecond() {

  var aDataArray = new Uint8Array(3);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x54;
  aDataArray[2] = 0x00;
  ws.send(aDataArray.buffer);
}

function sendMsgGetAudioName() {

  var aDataArray = new Uint8Array(3);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x55;
  aDataArray[2] = 0x00;
  ws.send(aDataArray.buffer);
}

function sednMsgBarQrcode(type) {
  var aDataArray = new Uint8Array(4);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x59;
  aDataArray[2] = 0x01;
  aDataArray[3] = type;
  ws.send(aDataArray.buffer);
}

function sendMsgMakeDir(pathUnicode) {
  var path = encodeURI(pathUnicode);
  var pathdata = stringToByte(path);
  var len = path.length;
  var aDataArray = new Uint8Array(3 + len);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x5a;
  aDataArray[2] = len;
  for (var i = 0; i < len; i++) {
    aDataArray[3 + i] = pathdata[i];
  }
  ws.send(aDataArray.buffer);
}

function sednMsgControlLed(camid, type) {
  var aDataArray = new Uint8Array(5);
  aDataArray[0] = 0xef;
  aDataArray[1] = 0x88;
  aDataArray[2] = 0x02;
  aDataArray[3] = camid;
  aDataArray[4] = type;
  ws.send(aDataArray.buffer);
}





function SetCusCropPlaceWs(cutX, cutY, cutW, cutH) {

  var bpp = rec_ww / imgOrignalW;
  if (rorateAngleType == 1 || rorateAngleType == 3) {
    bpp = rec_ww / imgOrignalH;
  }
  recX_manual = cutX * bpp + (canvas.width / 2 - rec_ww / 2);
  recY_manual = cutY * bpp + (canvas.height / 2 - rec_hh / 2);
  recW_manual = cutW * bpp;
  recH_manual = cutH * bpp;
  cutXCaibian = cutW;
  cutYCaibian = cutH;


}

function SetCusCropPlaceWs2(cutX, cutY, cutW, cutH) {

  var bpp = rec_ww2 / imgOrignalW2;
  recX_manual2 = cutX * bpp + (canvasSecond.width / 2 - rec_ww2 / 2);
  recY_manual2 = cutY * bpp + (canvasSecond.height / 2 - rec_hh2 / 2);
  recW_manual2 = cutW * bpp;
  recH_manual2 = cutH * bpp;
  cutXCaibian2 = cutW;
  cutYCaibian2 = cutH;


}



//手动裁边时的长方形
function refreshRect() {
  context.beginPath();
  context.rect(recX_manual, recY_manual, recW_manual, recH_manual);
  context.lineWidth = 2;
  context.strokeStyle = "#0000ff";
  context.stroke();
}

function refreshRect2() {
  contextSecond.beginPath();
  contextSecond.rect(recX_manual2, recY_manual2, recW_manual2, recH_manual2);
  contextSecond.lineWidth = 2;
  contextSecond.strokeStyle = "#0000ff";
  contextSecond.stroke();
}

function stringToByte(str) {
  var bytes = new Array();
  var len, c;
  len = str.length;
  for (var i = 0; i < len; i++) {
    c = str.charCodeAt(i);
    if (c >= 0x010000 && c <= 0x10FFFF) {
      bytes.push(((c >> 18) & 0x07) | 0xF0);
      bytes.push(((c >> 12) & 0x3F) | 0x80);
      bytes.push(((c >> 6) & 0x3F) | 0x80);
      bytes.push((c & 0x3F) | 0x80);
    } else if (c >= 0x000800 && c <= 0x00FFFF) {
      bytes.push(((c >> 12) & 0x0F) | 0xE0);
      bytes.push(((c >> 6) & 0x3F) | 0x80);
      bytes.push((c & 0x3F) | 0x80);
    } else if (c >= 0x000080 && c <= 0x0007FF) {
      bytes.push(((c >> 6) & 0x1F) | 0xC0);
      bytes.push((c & 0x3F) | 0x80);
    } else {
      bytes.push(c & 0xFF);
    }
  }
  return bytes;
}

function byteToString(arr) {
  if (typeof arr === 'string') {
    return arr;
  }
  var str = '',
    _arr = arr;
  for (var i = 0; i < _arr.length; i++) {
    var one = _arr[i].toString(2),
      v = one.match(/^1+?(?=0)/);
    if (v && one.length == 8) {
      var bytesLength = v[0].length;
      var store = _arr[i].toString(2).slice(7 - bytesLength);
      for (var st = 1; st < bytesLength; st++) {
        store += _arr[st + i].toString(2).slice(2);
      }
      str += String.fromCharCode(parseInt(store, 2));
      i += bytesLength - 1;
    } else {
      str += String.fromCharCode(_arr[i]);
    }
  }
  return str;
}

function base64Encode(input) {
  var rv;
  rv = encodeURIComponent(input);
  rv = unescape(rv);
  rv = window.btoa(rv);
  return rv;
}



//---OcxUtil.js-------------------------------------------------------------------------------
  let SupportFormat; //设备支持的视频格式代号：1->MJPG; 2->YUY2 
  let OpenFormat; //打开格式：0->YUY；1->MJPG
  let SupportFormat2; //设备支持的视频格式代号：1->MJPG; 2->YUY2 
  let OpenFormat2; //打开格式：0->YUY；1->MJPG
  let axCam_Ocx
  let axCam_Ocx2
  let base64DecodeChars = new Array(
      -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
      -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
      -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
      52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
      -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
      15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
      -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
      41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);

  export function base64decode(str) {
      var c1, c2, c3, c4;
      var i, len, out;

      len = str.length;
      i = 0;
      out = "";
      while (i < len) {
          /* c1 */
          do {
              c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
          } while (i < len && c1 == -1);
          if (c1 == -1)
              break;

          /* c2 */
          do {
              c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
          } while (i < len && c2 == -1);
          if (c2 == -1)
              break;

          out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));

          /* c3 */
          do {
              c3 = str.charCodeAt(i++) & 0xff;
              if (c3 == 61)
                  return out;
              c3 = base64DecodeChars[c3];
          } while (i < len && c3 == -1);
          if (c3 == -1)
              break;

          out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));

          /* c4 */
          do {
              c4 = str.charCodeAt(i++) & 0xff;
              if (c4 == 61)
                  return out;
              c4 = base64DecodeChars[c4];
          } while (i < len && c4 == -1);
          if (c4 == -1)
              break;
          out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
      }
      return out;
  }

  export function getBlobBydataURI(dataURI, type) {
      //var binary = atob(dataURI.split(',')[1]);  
      var binary = base64decode(dataURI);
      var array = [];
      for (var i = 0; i < binary.length; i++) {
          array.push(binary.charCodeAt(i));
      }
      return new Blob([new Uint8Array(array)], {
          type: type
      });
  }

  export function OcxInit(c1,c2) {
    axCam_Ocx = c1
    axCam_Ocx2 = c2
      var strUsbNamr = new Array();
      var numCam = axCam_Ocx.GetDevCount();
      for (var i = 0; i < numCam; i++) {
          strUsbNamr[i] = axCam_Ocx.GetDevFriendName(i);
      }

      //主摄像头编号
      isFn(options.InfoTextCallback) && options.InfoTextCallback(-999,axCam_Ocx.GetMainCameraID(1))
      //次摄像头编号
      isFn(options.InfoTextCallback) && options.InfoTextCallback(-998,axCam_Ocx.GetSecondCameraID())


      camidMain = axCam_Ocx.GetMainCameraID(1);
      camidSub = axCam_Ocx.GetSecondCameraID();
      isFn(options.GetDevName) && options.GetDevName(numCam, strUsbNamr);

      var FormatSum = axCam_Ocx.GetFormatCount(camidMain);
      switch (FormatSum) {
          case 1: //（设备只支持MJPG格式）
              OpenFormat = 1; //打开格式为MJPG
              SupportFormat = 1;
              break;
          case 2: //（设备只支持YUY2格式）
              OpenFormat = 0; //打开格式为YUY
              SupportFormat = 2;
              break;
          case 3: //（设备支持MJPG与YUY2两种格式）
              OpenFormat = 1; //默认打开格式为MJPG
              SupportFormat = 1;
              break;

      }

      OcxGetDeviceResolution();
  }

  //获取分辨率
  export function OcxGetDeviceResolution() {
      var resCount = axCam_Ocx.GetResolutionCount(camidMain, SupportFormat);
      var dataResolution = new Array();
      var num = 0;
      for (var i = 0; i < resCount; i++) {
          var restr = axCam_Ocx.GetResolution(i);
          var pos = restr.lastIndexOf("*");
          var width = parseInt(restr.substring(0, pos));
          var height = parseInt(restr.substring(pos + 1, restr.length));
          dataResolution[num] = width;
          num++;
          dataResolution[num] = height;
          num++;
      }
      isFn(options.GetDeviceResolution) && options.GetDeviceResolution(dataResolution);
  }

  export function OcxGetDeviceResolutionSecond() {
      if (isIE) {
          //camidSub = axCam_Ocx.GetSecondCameraID();
          if (camidSub >= 0) {
              var FormatSum = axCam_Ocx2.GetFormatCount(camidSub);
              switch (FormatSum) {
                  case 1: //（设备只支持MJPG格式）
                      OpenFormat2 = 1; //打开格式为MJPG
                      SupportFormat2 = 1;
                      break;
                  case 2: //（设备只支持YUY2格式）
                      OpenFormat2 = 0; //打开格式为YUY
                      SupportFormat2 = 2;
                      break;
                  case 3: //（设备支持MJPG与YUY2两种格式）
                      OpenFormat2 = 1; //默认打开格式为MJPG
                      SupportFormat2 = 1;
                      break;

              }

              var resCount = axCam_Ocx2.GetResolutionCount(camidSub, SupportFormat2);
              var dataResolution = new Array();
              var num = 0;
              for (var i = 0; i < resCount; i++) {
                  var restr = axCam_Ocx2.GetResolution(i);
                  var pos = restr.lastIndexOf("*");
                  var width = parseInt(restr.substring(0, pos));
                  var height = parseInt(restr.substring(pos + 1, restr.length));
                  dataResolution[num] = width;
                  num++;
                  dataResolution[num] = height;
                  num++;
              }
              isFn(options.GetDeviceResolutionSecond) && options.GetDeviceResolutionSecond(dataResolution);
          }

      } else {
          sendMsgGetResolutionSecond(camidSub);
      }
  }

  //
  export function StartCam(CamID, width, height) {
      if (isIE) {
          var i = axCam_Ocx.CAM_Open(CamID, OpenFormat, width, height);
          if (i == 0) isFn(options.InfoCallback) && options.InfoCallback(0x00);
          else if (i == -1) isFn(options.InfoCallback) && options.InfoCallback(0x16);
          else isFn(options.InfoCallback) && options.InfoCallback(0x02);
      } else {
          sendMsgStartVideo(CamID, width, height);
      }
  }

  export function StartCam2(CamID, width, height) {
      if (isIE) {
          var i = axCam_Ocx2.CAM_Open(CamID, OpenFormat2, width, height);
          if (i == 0) isFn(options.InfoCallback) && options.InfoCallback(0x00);
          else if (i == -1) isFn(options.InfoCallback) && options.InfoCallback(0x16);
          else isFn(options.InfoCallback) && options.InfoCallback(0x02);
      } else {
          sendMsgStartVideo2(CamID, width, height);
      }
  }

  export function CloseCam() {
      if (isIE) {
          axCam_Ocx.CAM_Close();
          isFn(options.InfoCallback) && options.InfoCallback(0x01);
      } else sendMsgCloseVideo();
  }

  export function CloseCam2() {
      if (isSecondDev) {
          if (isIE) {
              axCam_Ocx2.CAM_Close();
              isFn(options.InfoCallback) && options.InfoCallback(0x01);
          } else sendMsgCloseVideoSecond();
      }
  }

  export function CaptureImage(type) {
      if (isIE) {
          axCam_Ocx.CaptureImage();
      } else {
          sendMsgCapture(type);
      }
  }

  export function CaptureImage2(type) {
      if (isIE) {
          axCam_Ocx2.CaptureImage();
      } else {
          if (type != 2) {
              sendMsgCaptureSecond();
          } else sendMsgCaptureSecondCaibian();
      }
  }

  export function ChangeCamDevice(CamID) {

      if (isIE) {
          var FormatSum = axCam_Ocx.GetFormatCount(CamID);
          switch (FormatSum) {
              case 1: //（设备只支持MJPG格式）
                  OpenFormat = 1; //打开格式为MJPG
                  SupportFormat = 1;
                  break;
              case 2: //（设备只支持YUY2格式）
                  OpenFormat = 0; //打开格式为YUY
                  SupportFormat = 2;
                  break;
              case 3: //（设备支持MJPG与YUY2两种格式）
                  OpenFormat = 1; //默认打开格式为MJPG
                  SupportFormat = 1;
                  break;

          }
          OcxGetDeviceResolution();
      } else {
          sendMsgGetResolution(CamID);
      }
  }

  export function ChangeCamDevice2(CamID) {

      if (isIE) {
          var FormatSum = axCam_Ocx2.GetFormatCount(CamID);
          switch (FormatSum) {
              case 1: //（设备只支持MJPG格式）
                  OpenFormat = 1; //打开格式为MJPG
                  SupportFormat = 1;
                  break;
              case 2: //（设备只支持YUY2格式）
                  OpenFormat = 0; //打开格式为YUY
                  SupportFormat = 2;
                  break;
              case 3: //（设备支持MJPG与YUY2两种格式）
                  OpenFormat = 1; //默认打开格式为MJPG
                  SupportFormat = 1;
                  break;

          }
          OcxGetDeviceResolutionSecond();
      } else {
          sendMsgGetResolutionSecond(CamID);
      }
  }

  export function SetColorMode(type) {
      if (isIE) {
          axCam_Ocx.SetImageColorMode(type);
      } else {
          sendMsgSetImageColorMode(type);
      }
  }

  export function ShowSettingWindow() {
      if (isIE) {
          axCam_Ocx.ShowImageSettingWindow();
      } else {
          sendMsgShowImageSettingWindow();
      }
  }

  export function SetCamCutType(type) {
      if (isIE) {
          if (type == 2) {
              axCam_Ocx.CusCrop(1);
          } else axCam_Ocx.SetAutoCut(type);
      } else sendMsgSetCutType(type);

  }

  export function SetCamCutType2(type) {
      if (isIE) {
          if (type == 2) {
              axCam_Ocx2.CusCrop(1);
          } else axCam_Ocx2.SetAutoCut(0);
      }

  }

  export function SetImageType(type) {
      if (isIE) {
          axCam_Ocx.SetFileType(type);
      } else {
          if (type > 2) type++;
          sendMsgSetFileType(type);
      }
  }

  //放大
  export function ZoomOut() {
      if (isIE) {
          axCam_Ocx.CAM_ZoomOut();
      } else sendMsgZoom(1);
  }

  //缩小
  export function ZoomIn() {
      if (isIE) {
          axCam_Ocx.CAM_ZoomIn();
      }
      sendMsgZoom(0);
  }

  //左旋
  export function RoateL() {
      if (isIE) {
          axCam_Ocx.CAM_RotateL();
      } else sendMsgRotateL();

  }

  //右旋
  export function RoateR() {
      if (isIE) {
          axCam_Ocx.CAM_RotateR();
      } else sendMsgRotateR();
  }

  //适合大小
  export function BestSize() {
      if (isIE) {
          axCam_Ocx.BestSize();
      } else {
          sendMsgBestSize();
      }
  }

  //实际大小
  export function TrueSize() {
      if (isIE) {
          axCam_Ocx.TrueSize();
      } else {
          sendMsgTrueSize();
      }
  }

  export function SetWiseCapture(type) {
      if (isIE) {
          axCam_Ocx.WiseCapture(type);

      } else {
          sendMsgSetConntinousShotModel(type);
      }
  }

  export function SetTimeCapture(type, time) {
      if (isIE) {
          axCam_Ocx.TimeCapture(type, time);
      } else {
          time = time / 10;
          sendMsgSetConntinousShotModelTime(time);
      }
  }

  export function SetImagePath(path) {
      if (isIE) {
          var ret = axCam_Ocx.setFilePath(path);
          if (ret == 0) {
              isFn(options.InfoTextCallback) && options.InfoTextCallback(1, path);
          } else isFn(options.InfoCallback) && options.InfoCallback(0xae);
      } else {
          sendMsgSetFilePath(path);
      }
  }

  export function SetImagePath2(path) {
      if (isIE) {
          var ret = axCam_Ocx2.setFilePath(path);
          if (ret == 0) {
              isFn(options.InfoTextCallback) && options.InfoTextCallback(1, path);
          } else isFn(options.InfoCallback) && options.InfoCallback(0xae);
      }
  }

  export function RefreshDevice() {
      if (isIE) {
          OcxInit();
      } else {

          sendMsgRefreshDev();
      }
  }

  export function SetImagebase64(type) {
      if (isIE) {
          axCam_Ocx.IsImageBase64(type);
          if (isSecondDev) {
              axCam_Ocx2.IsImageBase64(type);
          }
      } else {
          sendMsgShotBase64(type);
      }
  }

  export function StartIC() {
      if (isIE) {
          axCam_Ocx.StartIDCard();
          isFn(options.InfoCallback) && options.InfoCallback(0x19);
      } else {
          sendMsgStartIDCard();
      }
  }

  export function StartICWork() {
      if (isIE) {
          var ret = axCam_Ocx.WorkIDCard(1);
          if (ret == 0) {
              isFn(options.InfoCallback) && options.InfoCallback(0x20);
          } else if (ret == -2) {
              isFn(options.InfoCallback) && options.InfoCallback(0x1f);
          }
      } else {
          sendMsgWorkIDCard();
      }
  }

  export function StopICWork() {
      if (isIE) {
          var ret = axCam_Ocx.WorkIDCard(0);
          if (ret == 0) {
              isFn(options.InfoCallback) && options.InfoCallback(0x21);
          } else if (ret == -2) {
              isFn(options.InfoCallback) && options.InfoCallback(0x1f);
          } else if (ret == -3) {
              isFn(options.InfoCallback) && options.InfoCallback(0x1e);
          }
      } else {
          sendMsgStopWorkIDCard();
      }
  }

  export function GetOneIC() {
      if (isIE) {
          var ret = axCam_Ocx.GetOneIC();
          if (ret == 0) {
              isFn(options.InfoCallback) && options.InfoCallback(0x1b);
          } else if (ret == -1) {
              isFn(options.InfoCallback) && options.InfoCallback(0x1d);
          } else if (ret == -2) {
              isFn(options.InfoCallback) && options.InfoCallback(0x1c);
          } else if (ret == -3) {
              isFn(options.InfoCallback) && options.InfoCallback(0x1e);
          } else if (ret == -4) {
              isFn(options.InfoCallback) && options.InfoCallback(0x1f);
          }
      } else {
          sendMsgGetOneIC();
      }
  }

  export function GetICValues() {
      if (isIE) {
          var name = axCam_Ocx.GetICValues("NAME");
          if (name.length > 0) {
              isFn(options.InfoTextCallback) && options.InfoTextCallback(9, name);

              var IC = axCam_Ocx.GetICValues("IC");
              isFn(options.InfoTextCallback) && options.InfoTextCallback(10, IC);

              var SEX = axCam_Ocx.GetICValues("SEX");
              isFn(options.InfoTextCallback) && options.InfoTextCallback(11, SEX);

              var NATION = axCam_Ocx.GetICValues("NATION");
              isFn(options.InfoTextCallback) && options.InfoTextCallback(12, NATION);

              var BIRTHDAY = axCam_Ocx.GetICValues("BIRTHDAY");
              isFn(options.InfoTextCallback) && options.InfoTextCallback(13, BIRTHDAY);

              var ADDRESS = axCam_Ocx.GetICValues("ADDRESS");
              isFn(options.InfoTextCallback) && options.InfoTextCallback(14, ADDRESS);

              var SIGNDEPT = axCam_Ocx.GetICValues("SIGNDEPT");
              isFn(options.InfoTextCallback) && options.InfoTextCallback(15, SIGNDEPT);

              var VALIDSTARTDATE = axCam_Ocx.GetICValues("VALIDSTARTDATE");
              isFn(options.InfoTextCallback) && options.InfoTextCallback(16, VALIDSTARTDATE);

              var VALIDENDDATE = axCam_Ocx.GetICValues("VALIDENDDATE");
              isFn(options.InfoTextCallback) && options.InfoTextCallback(17, VALIDENDDATE);

              var SAMID = axCam_Ocx.GetICValues("SAMID");
              isFn(options.InfoTextCallback) && options.InfoTextCallback(18, SAMID);


              var picBase64 = axCam_Ocx.GetICPicture();
              isFn(options.InfoTextCallback) && options.InfoTextCallback(19, picBase64);
          }

      } else {
          for (var i = 0; i < 11; i++) {
              sendMsgGetICValues(i);
          }
      }
  }

  export function ReadBarCode(imgPath) {
      if (isIE) {
          var CodeStr = axCam_Ocx.GetBarcodeContent(imgPath);
          if (CodeStr.length > 0) {
              isFn(options.InfoTextCallback) && options.InfoTextCallback(2, CodeStr);
          } else {
              isFn(options.InfoCallback) && options.InfoCallback(0xab);
          }
      } else {
          sendMsgBarcode(imgPath);
      }

  }

  export function ReadQrCode(imgPath) {
      if (isIE) {
          var CodeStr = axCam_Ocx.GetQRcodeContent(imgPath);
          isFn(options.InfoTextCallback) && options.InfoTextCallback(7, CodeStr);
      } else {
          sendMsgQrcode(imgPath);
      }
  }

  export function AddPDFImageFile(imgPath) {
      if (isIE) {
          var ret = axCam_Ocx.AddPDFImageFile(imgPath, "", 0);
          if (ret == 0) {
              isFn(options.InfoCallback) && options.InfoCallback(0x05);
          } else if (ret == -1) {
              isFn(options.InfoCallback) && options.InfoCallback(0xa5);
          }
      } else {
          sednMsgAddPDF(imgPath);
      }
  }

  export function SavePDF(path) {
      if (isIE) {
          var ret = axCam_Ocx.Convert2PDF(path);
          if (ret == 0) {
              isFn(options.InfoCallback) && options.InfoCallback(0x06);
          } else if (ret == -1) {
              isFn(options.InfoCallback) && options.InfoCallback(0xa1);
          }
      } else {
          sednMsgSavePDF(path);
      }
  }

  export function CombineTwoImage(combinePath, ImgPath1, ImgPath2, dir) {
      if (isIE) {
          var ret = axCam_Ocx.CombineTwoImage(combinePath, ImgPath1, ImgPath2, dir);
          if (ret == 0) {
              isFn(options.InfoCallback) && options.InfoCallback(0x07);
          } else {
              isFn(options.InfoCallback) && options.InfoCallback(0xad);
          }
      } else {
          if (dir != 1) dir = 0;
          sendMsgCombineTwoImage(ImgPath1, ImgPath2, combinePath, dir);
      }
  }

  export function UpdataFile(ip, port, method, imgPath) {
      if (isIE) {
          var ret = axCam_Ocx.UpdataFile(ip, port, method, imgPath);
          if (ret == 0) {
              isFn(options.InfoCallback) && options.InfoCallback(0x12);
          } else {
              isFn(options.InfoCallback) && options.InfoCallback(0xa9);
          }
      } else {
          sendMsgUploadFilePort(port, ip, method, imgPath);
      }
  }

  export function GetBase64FromFile(path) {
      if (isIE) {
          var basestr = axCam_Ocx.GetBase64FromFile(path);
          isFn(options.InfoTextCallback) && options.InfoTextCallback(5, basestr);
      } else {
          sednMsgGetBase64(path);
      }
  }

  export function CloseWaterMark() {
      if (isIE) {
          axCam_Ocx.SetAddMark(0);
      } else {
          sednMsgWaterMarkClose();
      }
  }

  export function OpenWaterMark(waterinfo, FontSize, FontSytle, r, g, b, c=xOff, d=xOff) {
      if (isIE) {
          axCam_Ocx.SetAddMark(1);
          axCam_Ocx.SetWaterMark(waterinfo, FontSize, FontSytle, r, g, b, c, d);
      } else {
          sednMsgWaterMarkOpen(waterinfo, FontSize, FontSytle, r, g, b, c, d);
      }
  }

  export function SetJiubianModel(type) {
      if (isIE) {
          axCam_Ocx.setJiubianModel(type);
      } else {
          sendMsgSetJiubianModel(type);
      }
  }

  export function SetBuBai(type) {
      if (isIE) {
          axCam_Ocx.setBuBai(type);
      } else {
          sednMsgBubaiType(type);
      }
  }

  export function SetQudise(type) {
      if (isIE) {
          axCam_Ocx.setQudise(type);
      } else {
          sednMsgQuqudiseType(type);
      }
  }

  export function SetFileNameCustom(str, index) {

      if (isIE) {
          axCam_Ocx.setFileNameCustom(str, index);
      } else {
          sendMsgSetFileNameModelCustom(index, str);
      }

  }

  export function SetFileNameCustom2(str, index) {

      if (isIE) {
          axCam_Ocx2.setFileNameCustom(str, index);
      } else {
          sendMsgSetFileNameModelCustomSecond(index, str);
      }

  }

  export function SetFileNameFixed(str) {
      if (isIE) {
          axCam_Ocx.setFileNameFixed(str);
      } else {
          sendMsgSetFileNameModelFixed(str);
      }

  }

  export function SetFileNameFixed2(str) {
      if (isIE) {
          axCam_Ocx2.setFileNameFixed(str);
      } else {
          sendMsgSetFileNameModelFixedSecond(str);
      }

  }

  export function SetFileNameTime() {
      if (isIE) {
          axCam_Ocx.setFileNameTime();
      } else {
          sendMsgSetFileNameModelTime();
      }
  }

  export function SetFileNameTime2() {
      if (isIE) {
          axCam_Ocx2.setFileNameTime();
      } else {
          sendMsgSetFileNameModelTimeSecond();
      }
  }

  export function SetAutoExposure(type) {

      if (isIE) {
          axCam_Ocx.SetAutoExposure(type);
          if (type == 1) {
              isFn(options.InfoCallback) && options.InfoCallback(0x17);

          } else if (type == 0) {
              isFn(options.InfoCallback) && options.InfoCallback(0x18);
          }
      } else {
          sendMsgSetAutoExposure(type);
      }

  }

  export function GetCamParameter() {
      if (isIE) {
          var brightnessValue = axCam_Ocx.GetBrightnessRange();
          isFn(options.InfoTextCallback) && options.InfoTextCallback(23, brightnessValue);
          var exposureValue = axCam_Ocx.GetExposureRange();
          isFn(options.InfoTextCallback) && options.InfoTextCallback(22, exposureValue);

      } else {
          sendMsgGetExposureRange();
          sendMsgGetBrightnessRange();

      }
  }

  export function SetExposure(value) {
      if (isIE) {
          axCam_Ocx.SetExposure(value);
      } else {
          sendMsgSetExposure(value);
      }

  }

  export function SetBrightness(value) {
      if (isIE) {
          axCam_Ocx.SetBrightness(value)
      } else {
          sendMsgSetBrightness(value);
      }

  }

  export function GetCamNum() {
      if (isIE) {
          var num = axCam_Ocx.GetDevCount();
          //GetDevCount(num);
          isFn(options.InfoTextCallback) && options.InfoTextCallback(26, num);
      } else {
          sendMsgGetCamNum();
      }
  }

  export function DeleteFile(path) {
      if (isIE) {
          var ret = axCam_Ocx.DeleteFileImage(path);
          if (ret == 1) {
              isFn(options.InfoTextCallback) && options.InfoTextCallback(6, path);
          } else {
              isFn(options.InfoCallback) && options.InfoCallback(0xa2);

          }
      } else {
          sendMsgDeleteFile(path);
      }
  }

  export function SetJpgQuanlity(value) {
      if (isIE) {
          axCam_Ocx.SetJpgQuanlity(value);
      } else {
          sendMsgSetJpgQuanlity(value);
      }
  }

  export function SetJpgQuanlity2(value) {
      if (isIE) {
          axCam_Ocx2.SetJpgQuanlity(value);
      } else {

      }
  }

  export function SetCusCropPlace(cutX, cutY, cutW, cutH) {
      if (isIE) {
          axCam_Ocx.SetCusCropPlace(cutX, cutY, cutW, cutH);
      } else {
          SetCusCropPlaceWs(cutX, cutY, cutW, cutH);
      }

  }

  export function SetCusCropPlace2(cutX, cutY, cutW, cutH) {
      if (isIE) {
          axCam_Ocx2.SetCusCropPlace(cutX, cutY, cutW, cutH);
      } else {
          SetCusCropPlaceWs2(cutX, cutY, cutW, cutH);
      }

  }

  export function GetICPictureAll() {
      if (isIE) {
          var picBase64 = axCam_Ocx.GetICPictureAll();
          isFn(options.InfoTextCallback) && options.InfoTextCallback(25, picBase64);
      } else {
          sendMsgGetICPictureAll();
      }
  }

  export function InitFinger() {
      if (isIE) {
          var ret = axCam_Ocx.InitFinger();
          if (ret == 1) {
              isFn(options.InfoCallback) && options.InfoCallback(0x25);
          } else isFn(options.InfoCallback) && options.InfoCallback(0x26);
      } else {
          sendMsgInitFinger();
      }
  }

  export function StartFinger() {
      if (isIE) {
          var ret = axCam_Ocx.StartFinger();
          if (ret == 1) {
              isFn(options.InfoCallback) && options.InfoCallback(0x30);
          } else if (ret == -1) {
              isFn(options.InfoCallback) && options.InfoCallback(0x27);
          } else if (ret == -2) {
              isFn(options.InfoCallback) && options.InfoCallback(0x28);
          } else if (ret == -3) {
              isFn(options.InfoCallback) && options.InfoCallback(0xb1);
          } else if (ret == -4) {
              isFn(options.InfoCallback) && options.InfoCallback(0x31);
          }
      } else {
          sendMsgStartFinger();
      }
  }

  export function CloseFinger() {
      if (isIE) {
          axCam_Ocx.CloseFinger();
          isFn(options.InfoCallback) && options.InfoCallback(0x32);
      } else {
          sendMsgCloseFinger();
      }
  }

  export function BeginVideo(filename, id, frameModel) {
      var frame = 4;
      if (frameModel == 1) {
          frame = 8;
      } else if (frameModel == 2) {
          frame = 12;
      }
      if (isIE) {
          var ret = axCam_Ocx.BeginVideoID(filename, id, frame);
          if (ret == 1) {
              isFn(options.InfoCallback) && options.InfoCallback(0x34);
          } else if (ret == -1) {
              isFn(options.InfoCallback) && options.InfoCallback(0xb2);

          } else if (ret == -2) {
              isFn(options.InfoCallback) && options.InfoCallback(0x36);

          }
      } else {
          sendMsgBeginVideo(filename, id, frame);
      }


  }

  export function StopVideo() {
      if (isIE) {
          axCam_Ocx.StopVideo();
      } else {
          sendMsgStopVideo();
      }
  }

  export function BeginVideoSecond(filename, id, frameModel) {
      var frame = 4;
      if (frameModel == 1) {
          frame = 8;
      } else if (frameModel == 2) {
          frame = 12;
      }
      if (isIE) {
          var ret = axCam_Ocx2.BeginVideoID(filename, id, frame);
          if (ret == 1) {
              isFn(options.InfoCallback) && options.InfoCallback(0x37);
          } else if (ret == -1) {
              isFn(options.InfoCallback) && options.InfoCallback(0xb3);

          } else if (ret == -2) {
              isFn(options.InfoCallback) && options.InfoCallback(0x39);

          }
      } else {
          sendMsgBeginVideoSecond(filename, id, frame);
      }


  }

  export function StopVideoSecond() {
      if (isIE) {
          axCam_Ocx2.StopVideo();
      } else {
          sendMsgStopVideoSecond();
      }
  }

  export function GetAudioName() {
      if (isIE) {
          var str = axCam_Ocx.GetAudioName();
          if (str == "-1") {
              isFn(options.InfoCallback) && options.InfoCallback(0x36);
          } else if (str == "0") {
              isFn(options.InfoCallback) && options.InfoCallback(0xb4);
          } else isFn(options.InfoTextCallback) && options.InfoTextCallback(27, str);
      } else {
          sendMsgGetAudioName();
      }

  }

  export function ReadBarQrcodeD(type) {
      if (isIE) {
          var code = axCam_Ocx.ReadBarQrcodeD(type);
          if (type == 1) {
              isFn(options.InfoTextCallback) && options.InfoTextCallback(code, 2);
          } else if (type == 2) {
              isFn(options.InfoTextCallback) && options.InfoTextCallback(code, 7);
          }
      } else {
          sednMsgBarQrcode(type);
      }

  }

  export function MakeDir(path) {
      if (isIE) {
          var ret = axCam_Ocx.MakeDir(path);
          if (ret == 1) {
              isFn(options.InfoCallback) && options.InfoCallback(0x44);
          } else isFn(options.InfoCallback) && options.InfoCallback(0x45);

      } else {
          sendMsgMakeDir(path);
      }

  }

  export function ControlLED(camid, type) {

      if (isIE) {
          axCam_Ocx.ControlLED(camid, type);
      } else {
          sednMsgControlLed(camid, type);
      }

  }
//----------------------------------------------------------------------------------
export function GetStatusCode(){
  const signMap = {
    0:'连接成功',
    0x01:'断开成功',
    0x02:'设备已经连接',
    0x03:'设备已经关闭',
    0x04:'拍照成功',
    0x05:'pdf添加文件成功',
    0x06:'pdf保存成功',
    0x07:'图片合并成功',
    0x08:'智能连拍启动',
    0x09:'定时连拍启动',
    0x10:'定时连拍成功',
    0x11:'定时连拍关闭',
    0x12:'文件上传服务器成功',
    0x13:'水印开启',
    0x14:'水印关闭',
    0x15:'此设备属于本公司',
    0x16:'此设备不属于本公司',
    0x17:'自动曝光启动',
    0x18:'自动曝光关闭',
    0x19:'身份证功能启动成功',
    0x1a:'身份证功能启动失败',
    0x1b:'身份证读卡成功',
    0x1c:'身份证读卡失败',
    0x1d:'重新操作',
    0x1e:'未发现模块',
    0x1f:'未启动身份证功能',
    0x20:'启动身份证自动读卡',
    0x21:'关闭身份证自动读卡',
    0x22:'启动拍照只生成base64',
    0x23:'关闭拍照只生成base64',
    0x25:'初始化指纹模块成功',
    0x26:'初始化指纹模块失败',
    0x27:'未初始化指纹模块',
    0x28:'身份证没有指纹数据',
    0x29:'指纹认证成功',
    0x30:'开始指纹认证',
    0x31:'正在指纹认证',
    0x32:'停止指纹认证',
    0x33:'指纹认证失败',
    0x34:'开始录像',
    0x35:'停止录像',
    0x36:'正在录像中',
    0x37:'开始录像副头',
    0x38:'停止录像副头',
    0x39:'正在录像中副头',
    0x44:'建立文件成功',
    0x45:'建立文件失败',
    0xa0:'没有对应分辨率',
    0xa1:'pdf没有添加任何文件',
    0xa2:'文件不存在',
    0xa3:'意外断开',
    0xa4:'连接不上',
    0xa5:'pdf添加文件不是jpg格式',
    0xa6:'没有发现摄像头',
    0xa7:'camid无效',
    0xa8:'图片尺寸太小',
    0xa9:'文件上传服务器失败',
    0xaa:'该设备没有副头',
    0xab:'条码识别失败',
    0xac:'二维码识别失败',
    0xad:'图片合并失败',
    0xae:'设置路径文件不存在',
    0xaf:'摄像头切换太频繁',
    0xb1:'未发现指纹模块',
    0xb2:'录像分辨率不能高于1600*1200',
    0xb3:'副头录像分辨率不能高于1600*1200',
    0xb4:'没发现麦克风',
  }
  const infoMap = {
    0:'图片路径',
    1:'默认路径',
    2:'条码',
    3:'文件上传服务器成功',
    4:'文件上传服务器失败',
    5:'base64编码成功',
    6:'删除文件成功',
    7:'二维码',
    8:'拍照失败',
    9:'身份证名字',
    10:'身份证号码',
    11:'身份证性别',
    12:'身份证民族',
    13:'身份证生日',
    14:'身份证地址',
    15:'身份证签发机关',
    16:'身份证有效开始日期',
    17:'身份证有效截至日期',
    18:'安全模块号',
    19:'安全模块号',
    21:'base64编码成功',
    22:'曝光范围',
    23:'亮度范围',
    24:'上传服务器返回',
    25:'身份证复印件',
    26:'当前设备数量',
    27:'麦克风',
  }
  
  return {
    signMap,
    infoMap
  }
} 

