<template>
  <a-modal
    title="高拍仪-图文拍摄仪"
    :width="1200"
    :visible="visible"
    :maskClosable="false"
    @cancel="handleCancel"
    :footer="null"
  >
    <a-spin :spinning="spinning" :tip="spinTips" :delay="100">
      <div id="scan-devices-wrapper">
        <!-- <template v-if="isIE">
        <OBJECT ref="axCam_Ocx"  classid="clsid:D5BD5B4A-4FC0-4869-880B-27EE9869D706" width="500px" height="400px" />
        <OBJECT ref="axCam_Ocx2"  classid="clsid:341014BA-CD4A-4918-A11F-8A33B152915A" width="500px" height="400px" />
      </template> -->
        <a-tabs :activeKey="String(activeKey)" defaultActiveKey="1" @change="tabChange">
          <a-tab-pane tab="文件" key="1" />
          <a-tab-pane tab="身份证" key="2" />
          <a-tab-pane tab="人脸拍照" key="3" />
          <a-tab-pane tab="录像" key="4" />
        </a-tabs>

        <div class="camera-wrapper">
          <div class="camera-main-wrapper" style="width: 800px">
            <div
              class="camera-one-wrapper"
              v-show="[1, 2].includes(+activeKey) || (+activeKey === 4 && videoType === 0)"
            >
              <div class="camera-one-body">
                <div class="camera-record-sign-wrap" v-show="cameraRecordSign.status">
                  <div class="camera-record-sign">{{ cameraRecordTimeDiff }}</div>
                </div>

                <canvas ref="cameraCanvas" width="800" height="600" style="background: #000" />
              </div>
              <div class="camera-action">
                <a-row :gutter="16" class="camera-action-row">
                  <a-col :span="24">
                    <span>设备名称：{{ camidMainName }}</span>
                    <span style="margin-left: 15px">分辨率：</span>
                    <a-select @change="deviceResolutionOneChange" style="width: 200px" :value="deviceResolutionValue">
                      <a-select-option v-for="item in deviceResolutionList" :key="item.key" :value="item.key">{{
                        item.text
                      }}</a-select-option>
                    </a-select>

                    <a-button style="margin-left: 15px" @click="settingAction">高级设置</a-button>
                    <a-button style="margin-left: 15px" @click="startVideo">打开</a-button>
                    <a-button style="margin-left: 15px" @click="closeVideo">关闭</a-button>
                  </a-col>
                </a-row>
                <a-row :gutter="16" class="camera-action-row" v-show="+activeKey === 1">
                  <a-col :span="6">
                    <a-button style="width: 100%" icon="cloud-upload" @click="captureUpload">拍照上传</a-button>
                  </a-col>
                </a-row>
                <a-row :gutter="16" class="camera-action-row" v-show="+activeKey === 1">
                  <a-col :span="6">
                    <a-button style="width: 100%" icon="zoom-in" @click="() => ZoomOut(1)">放大</a-button>
                  </a-col>
                  <a-col :span="6">
                    <a-button style="width: 100%" icon="zoom-out" @click="() => ZoomIn(1)">缩小</a-button>
                  </a-col>
                  <a-col :span="6">
                    <a-button style="width: 100%" @click="() => BestSize(1)">适合大小</a-button>
                  </a-col>
                  <a-col :span="6">
                    <a-button style="width: 100%" @click="() => TrueSize(1)">实际大小</a-button>
                  </a-col>
                </a-row>
                <a-row :gutter="16" class="camera-action-row" v-show="+activeKey === 1">
                  <a-col :span="6">
                    <a-button style="width: 100%" icon="undo" @click="() => RoateL(1)">向左旋转</a-button>
                  </a-col>
                  <a-col :span="6">
                    <a-button style="width: 100%" icon="redo" @click="() => RoateR(1)">向右旋转</a-button>
                  </a-col>
                  <a-col :span="6">
                    <a-button style="width: 100%" icon="camera" @click="capture">拍照</a-button>
                  </a-col>
                  <a-col :span="6">
                    <a-button style="width: 100%" @click="funConvertToPDF">合并为PDF</a-button>
                  </a-col>
                </a-row>

                <a-row :gutter="16" class="camera-action-row" v-show="+activeKey === 2">
                  <a-col :span="6">
                    <a-button style="width: 100%" @click="() => getICValue()">获取身份证信息</a-button>
                  </a-col>
                  <a-col :span="6">
                    <a-button style="width: 100%" @click="() => getICPicture()">获取身份证复印件</a-button>
                  </a-col>
                </a-row>

                <a-row :gutter="16" class="camera-action-row" v-show="+activeKey === 4">
                  <a-col :span="6">
                    <a-button style="width: 100%" @click="videoType = 1">切换摄像头</a-button>
                  </a-col>
                  <a-col :span="6">
                    <a-button style="width: 100%" @click="fnBeginVideo">开始录像</a-button>
                  </a-col>
                  <a-col :span="6">
                    <a-button style="width: 100%" @click="() => StopVideo()">停止录像</a-button>
                  </a-col>
                </a-row>
              </div>
            </div>

            <div class="camera-second-wrapper" v-show="+activeKey === 3 || (+activeKey === 4 && videoType === 1)">
              <div class="camera-second-body">
                <div class="camera-record-sign-wrap" v-show="cameraRecordSign.status">
                  <div class="camera-record-sign">{{ cameraRecordTimeDiff }}</div>
                </div>

                <canvas ref="cameraCanvasSecond" width="800" height="600" style="background: #000" />
              </div>
              <div class="camera-action">
                <a-row :gutter="16" class="camera-action-row">
                  <a-col :span="24">
                    <span>设备名称：{{ camidSubName }}</span>
                    <span style="margin-left: 15px">分辨率：</span>
                    <a-select
                      @change="deviceResolutionSecondChange"
                      style="width: 200px"
                      :value="deviceResolutionSecondValue"
                    >
                      <a-select-option v-for="item in deviceResolutionSecondList" :key="item.key" :value="item.key">{{
                        item.text
                      }}</a-select-option>
                    </a-select>
                    <a-button style="margin-left: 15px" @click="startVideo2">打开</a-button>
                    <a-button style="margin-left: 15px" @click="closeVideo2">关闭</a-button>
                  </a-col>
                </a-row>
                <a-row :gutter="16" class="camera-action-row" v-show="+activeKey === 3">
                  <a-col :span="6">
                    <a-button style="width: 100%" @click="capture2">拍照</a-button>
                  </a-col>
                </a-row>
                <a-row :gutter="16" class="camera-action-row" v-show="+activeKey === 4">
                  <a-col :span="6">
                    <a-button style="width: 100%" @click="videoType = 0">切换摄像头</a-button>
                  </a-col>
                  <a-col :span="6">
                    <a-button style="width: 100%" @click="fnBeginVideoSecond">开始录像</a-button>
                  </a-col>
                  <a-col :span="6">
                    <a-button style="width: 100%" @click="() => StopVideoSecond()">停止录像</a-button>
                  </a-col>
                </a-row>
              </div>
            </div>
          </div>
          <div class="camera-info-wrapper">
            <p v-for="item in cameraInfoCallBackList" :key="item.key" v-html="item.msg" />
          </div>
        </div>

        <Setting ref="setting" />
      </div>
    </a-spin>
  </a-modal>
</template>

<script>
import {
  registerCallback,
  wsClose,
  WsInit,
  OcxInit,
  StartVideo,
  StartVideo2,
  StartCam,
  StartCam2,
  CloseFinger,
  CloseCam,
  CloseCam2,
  GetStatusCode,
  OcxGetDeviceResolutionSecond,
  ControlLED,
  ZoomOut,
  ZoomIn,
  RoateL,
  RoateR,
  BestSize,
  TrueSize,
  CaptureImage,
  CaptureImage2,
  SetImagePath,
  SetImagePath2,
  AddPDFImageFile,
  SavePDF,
  /*身份证*/
  StartIC,
  StartICWork,
  StopICWork,
  GetOneIC,
  GetICValues,
  GetICPictureAll,
  /*身份证END*/
  /*录像 */
  BeginVideo,
  StopVideo,
  BeginVideoSecond,
  StopVideoSecond,
  /*录像END */
  /*文件操作*/
  MakeDir,
  DeleteFile,
  /*文件操作 END*/
  /*上传*/
  UpdataFile,
  /*上传 END*/
} from './WsUtil'
import moment from 'moment'
import Setting from './Setting'
import { getUploadPath2, gaopaiyiCustomUpload ,gaoPaiYiUploadProxyURL} from '@/api/common'
let uuid = () => Math.random().toString(16).slice(-6) + Math.random().toString(16).slice(-6)
export default {
  name: 'test',
  components: {
    Setting,
  },
  data() {
    return {
      visible: false,
      spinning: false,
      spinTips: '',
      advancedSettingVisible: false,
      activeKey: 1,
      isIE: (() => !!window.ActiveXObject || 'ActiveXObject' in window)(), //是否IE
      isSecondDev: true, //是否有两个canvas显示视频
      camidMain: 0, //主头ID
      camidSub: 0, //副头ID
      camidMainName: '',
      camidSubName: '',
      statusCodeInfo: Object.freeze(GetStatusCode()),
      deviceResolutionList: [],
      deviceResolutionValue: undefined,
      deviceResolutionSecondList: [],
      deviceResolutionSecondValue: undefined,

      ICInfoMap: Object.freeze({
        9: 'ICName',
        10: 'ICNumber',
        11: 'ICSex',
        12: 'ICNation',
        13: 'ICBrithday',
        14: 'ICAddr',
        15: 'ICSignOrganization',
        16: 'ICExpiryBeginDate',
        17: 'ICExpiryEndDate',
        18: 'ICModelNumber',
        19: 'ICPhoto',
      }),
      ICInfo: {
        //0x19:'身份证功能启动成功',0x1a:'身份证功能启动失败',
        ICStartStatus: null,
        //0x1b:'身份证读卡成功',0x1c:'身份证读卡失败',
        ICGetOneStatus: null,
        ICName: null,
        ICNumber: null,
        ICSex: null,
        ICNation: null, //民族
        ICBrithday: null,
        ICAddr: null,
        ICSignOrganization: null, //签发机关
        ICExpiryBeginDate: null,
        ICExpiryEndDate: null,
        ICModelNumber: null, //安全模块编号
        ICPhoto: null, //身份证头像 base64 格式
      },
      ICPicture: null, //身份证复印件
      videoType: 0, // 0主摄像头  1 副摄像头
      cameraInfoCallBackList: [],
      cameraGPPath: {
        initPath: [
          'd:\\camera_gp',
          'd:\\camera_gp\\video',
          'd:\\camera_gp\\pdf',
          'd:\\camera_gp\\image',
        ],
        videoPath: 'd:\\camera_gp\\video',
        pdfPath: 'd:\\camera_gp\\pdf',
        imagePath: 'd:\\camera_gp\\image',
      },
      videoPathCache: [],
      cameraRecordSign: {
        status: false,
        beginTime: moment(),
        endTime: moment(),
      },
      cameraGPConfig: {
        fileType: 0, //保存格式 0jpg 1png 2bmp 3gif  4tif
        imageColorMode: 0, //颜色格式 0彩色 1灰色 2黑白
        cutType: 0, //裁切模式 0无 1自动裁边 2手动裁边
        autoCutType: 0, //裁切类型 自动裁切模式可用  1单图 2多图
        bubai: true, //启动四周黑边补白 0关闭 1启动
        captureModel: 0, //连拍模式 0关闭 1启动
        captureTime: 5, //时间间隔 定时连拍可用
        autoExposure: 1, //自动曝光
        path: {
          //文件路径
          imagePath: 'd:/camera_gp/image', //照片保存路径
          pdfPath: 'd:/camera_gp/pdf', //合并PDF保存路径
          videoPath: 'd:/camera_gp/video', //主摄像头录像保存路径
        },
        fileNameMode: 2, //文件命名
        customFileName: 'guding', //自定义 和  固定 可用
        customFileNameNumber: 10, //自定义 可用
        waterType: 1, //添加水印
        waterTypeConfig: {
          //开启添加水印 可用
          content: 'ceshi', //水印内容：
          fontSize: 32, //字体大小：
          fontColor: 'ff0000', //字体颜色：
          fontStyle: 1, //字体样式：
          position: 3, //水印位置：
        },
      },
      photoCacheList: [], //缓存照片 合并PDF用
      pdfCacheList: [], //缓存PDF 上传用
      uploadUrl: getUploadPath2(),
      uploadProxyURL:gaoPaiYiUploadProxyURL(),
      uploadResultList: [],
      isCaptureUpload:false, //是否拍照并上传标志
    }
  },
  watch: {
    ICInfo(newVal) {},
  },
  computed: {
    cameraRecordTimeDiff() {
      let { beginTime, endTime } = this.cameraRecordSign
      if (beginTime instanceof moment && endTime instanceof moment) {
        let diff = endTime.diff(beginTime, 'seconds')
        let hour = Math.floor(diff / 3600)
        hour = hour < 10 ? '0' + hour : hour
        let minutes = Math.floor((diff % 3600) / 60)
        minutes = minutes < 10 ? '0' + minutes : minutes
        let seconds = Math.floor((diff % 3600) % 60)
        seconds = seconds < 10 ? '0' + seconds : seconds
        return `${hour}:${minutes}:${seconds}`
      }
      return '00:00:00'
    },
  },
  created() {
    //this.init()
  },
  beforeDestroy() {
    console.log('beforeDestroy called....')
  },
  methods: {
    moment,
    ZoomOut,
    ZoomIn,
    RoateL,
    RoateR,
    BestSize,
    TrueSize,
    CaptureImage,
    CaptureImage2,
    SetImagePath,
    SetImagePath2,
    StartIC,
    StartICWork,
    StopICWork,
    GetOneIC,
    GetICValues,
    GetICPictureAll,
    ControlLED,
    /*录像 */
    BeginVideo,
    StopVideo,
    BeginVideoSecond,
    StopVideoSecond,
    /*录像END */
    /*文件操作*/
    MakeDir,
    DeleteFile,
    /*文件操作 END*/

    init() {
      let that = this
      that.initRegisterCallback()
      that.$nextTick(() => {
        if (that.isIE) {
          OcxInit(that.$refs.axCam_Ocx, that.$refs.axCam_Ocx2)
        } else {
          WsInit(that.$refs.cameraCanvas, that.$refs.cameraCanvasSecond)
        }
      })
    },
    query() {
      let that = this
      that.visible = true
      that.spinning = true
      that.spinTips = '设备启动中...'
      that.init()
      setTimeout(() => (that.spinning = false), 2000)
    },
    show(){
      this.query()
    },
    close(){
      this.handleCancel()
    },
    async handleCancel() {
      let that = this
      that.spinning = true
      that.spinTips = '设备关闭中...'
      await this.destroyAction()
      that.spinning = false
      that.visible = false
    },
    destroyAction() {
      StopICWork()
      CloseFinger()
      CloseCam()
      StopVideo()
      if (this.isSecondDev) {
        CloseCam2()
        StopVideoSecond()
      }
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          wsClose()
          resolve()
        }, 2000)
      })
    },
    initRegisterCallback() {
      let that = this
      registerCallback({
        GetDevName: that.GetDevName,
        GetDeviceResolution: that.GetDeviceResolution,
        GetDeviceResolutionSecond: that.GetDeviceResolutionSecond,
        LoadOver: that.LoadOver,
        LoadOver2: that.LoadOver2,
        InfoCallback: that.InfoCallback,
        InfoTextCallback: that.InfoTextCallback,
        isSecondDev: that.isSecondDev,
      })
    },
    GetDevName(num, strUsbNamr) {
      console.log(arguments)
      if (num > 1 && this.isSecondDev) {
        OcxGetDeviceResolutionSecond()
      }
      try {
        this.camidMainName = `${strUsbNamr[this.camidMain]}_${this.camidMain}`
        this.camidSubName = `${strUsbNamr[this.camidSub]}_${this.camidSub}`
      } catch (err) {
        console.log(err)
      }
    },
    GetDeviceResolution(data) {
      let arr = []
      if (data.length > 0) {
        for (var i = 0; i < data.length / 2; i++) {
          var ww = data[i * 2]
          var hh = data[i * 2 + 1]
          arr.push({
            key: uuid(),
            text: `${ww}*${hh}`,
            value: i,
            arr: [ww, hh],
          })
        }
        this.deviceResolutionList = arr.sort((a, b) => b.arr[0] - a.arr[0])
      }
    },
    GetDeviceResolutionSecond(data) {
      let arr = []
      if (data.length > 0) {
        for (var i = 0; i < data.length / 2 - 1; i++) {
          var ww = data[i * 2]
          var hh = data[i * 2 + 1]
          arr.push({
            key: uuid(),
            text: `${ww}*${hh}`,
            value: i,
            arr: [ww, hh],
          })
        }
        this.deviceResolutionSecondList = arr.sort((a, b) => b.arr[0] - a.arr[0])
      }
    },
    LoadOver() {
      console.log('LoadOver 初始化完毕...')
      let that = this
      that.cameraGPPath.initPath.map((path) => that.MakeDir(path))

      that.SetImagePath(that.cameraGPPath.imagePath)
      that.SetImagePath2(that.cameraGPPath.imagePath)

      if (that.deviceResolutionList.length > 0) {
        that.deviceResolutionOneChange(that.deviceResolutionList[0].key)
      }
    },
    LoadOver2() {
      console.log('LoadOver2 初始化完毕...')
      if (this.deviceResolutionSecondList.length > 0) {
        this.deviceResolutionSecondChange(this.deviceResolutionSecondList[0].key)
      }
    },
    InfoCallback(op) {
      let that = this
      console.log(arguments)
      if (this.statusCodeInfo.signMap[op]) {
        //console.log(this.statusCodeInfo.signMap[op])
        let logMsg = {
          key: uuid(),
          msg: `【${moment().format('YYYY/MM/DD HH:mm:ss')}】 ${this.statusCodeInfo.signMap[op]}`,
        }

        //意外断开
        if(op === 0xa3){
          if(+that.activeKey === 4){ //录像意外断开 需要停止计时
            let timer = that.cameraRecordSign.timer
            timer && clearInterval(timer)
            that.cameraRecordSign = {
              status: false,
              beginTime: null,
              endTime: null,
              timer: null,
            }
          }
        }
        //录像模块
        if (op === 0x34 || op === 0x37) {
          that.cameraRecordSignAction('start')
        }
        if (op === 0x35 || op === 0x38) {
          if (that.videoPathCache.length > 0) {
            logMsg.msg += `保存地址：${that.videoPathCache[that.videoPathCache.length - 1]}`
          }
          that.cameraRecordSignAction('stop')
        }
        //录像模块 END

        that.cameraInfoCallBackList = [logMsg, ...that.cameraInfoCallBackList]

        //身份证读卡模块
        if ([0x19, 0x1a].includes(op)) {
          that.ICInfo = Object.assign({}, that.ICInfo, { ICStartStatus: op })
        }
        if ([0x1b, 0x1c].includes(op)) {
          that.ICInfo = Object.assign({}, that.ICInfo, { ICGetOneStatus: op })
        }
        //身份证读卡模块 END

        //PDF保存成功
        if (op === 0x06) {
          let pdfCacheList = [...that.pdfCacheList]
          let target = pdfCacheList[pdfCacheList.length - 1]
          if (target) {
            target.status = 'done'
            that.pdfCacheList = pdfCacheList
          }
        }
        //PDF保存成功 END
      } else {
        console.log('未找到对应的编号的信息:', op)
      }
    },
    InfoTextCallback(type, str) {
      let that = this
      //console.log(arguments)
      if (type === -999) {
        this.camidMain = str
      } else if (type === -998) {
        this.camidSub = str
      } else {
        if (this.statusCodeInfo.infoMap[type]) {
          //console.log(this.statusCodeInfo.infoMap[type], str)
          //拍照
          if (+type === 0) {
            that.photoCacheList = [...that.photoCacheList, str]
            if(+that.activeKey === 3){ //人脸拍照
              that.customMsg('face',str)
            }

            if(+that.activeKey === 1 && that.isCaptureUpload){ //拍照并上传
              that.customMsg('photo',str)
            }
          }
          //拍照END

          let htmlStr = ''
          if ([5, 19, 21, 25].includes(type)) {
            let __str = 'data:;base64,' + str
            htmlStr = `<img src="${__str}" style="width:128px;height:auto;overflow:hidden;border:1px solid #ccc;" />`
          } else {
            htmlStr = str
          }
          that.cameraInfoCallBackList = [
            {
              key: uuid(),
              msg: `【${moment().format('YYYY/MM/DD HH:mm:ss')}】 ${this.statusCodeInfo.infoMap[type]}:${htmlStr}`,
            },
            ...that.cameraInfoCallBackList,
          ]
          //身份证信息模块
          if ([9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19].includes(type)) {
            let __str = 'data:;base64,' + str
            that.ICInfo = Object.assign({}, that.ICInfo, { [that.ICInfoMap[type]]: __str })
          }
          if (type === 25) {
            console.log(arguments)
            that.ICPicture = str
          }
          //身份证信息模块END
        } else {
          console.log('未找到对应的编号的信息:', type, str)
        }
      }
    },
    deviceResolutionOneChange(key) {
      let target = this.deviceResolutionList.find((item) => item.key === key)
      if (target) {
        this.deviceResolutionValue = key
        CloseCam()
        StartCam(this.camidMain, target.arr[0], target.arr[1])
      }
    },
    deviceResolutionSecondChange(key) {
      let target = this.deviceResolutionSecondList.find((item) => item.key === key)
      if (target) {
        this.deviceResolutionSecondValue = key
        CloseCam2()
        StartCam2(this.camidSub, target.arr[0], target.arr[1])
      }
    },
    tabChange(tagKey) {
      this.activeKey = parseInt(tagKey)
    },
    /**获取身份证信息模块 */
    async getICValue() {
      let that = this
      let delay = 200
      let maxWait = 3000
      that.ICInfo = {
        //0x19:'身份证功能启动成功',0x1a:'身份证功能启动失败',
        ICStartStatus: null,
        //0x1b:'身份证读卡成功',0x1c:'身份证读卡失败',
        ICGetOneStatus: null,
        ICName: null,
        ICNumber: null,
        ICSex: null,
        ICNation: null,
        ICBrithday: null,
        ICAddr: null,
        ICSignOrganization: null,
        ICExpiryBeginDate: null,
        ICExpiryEndDate: null,
        ICModelNumber: null,
        ICPhoto: null, //base64 格式
      }

      let ICStartStatus = await new Promise((resolve, reject) => {
        StartIC()
        let currentWait = 0
        let timer = setInterval(function () {
          currentWait += delay
          if (currentWait >= maxWait) {
            timer && clearInterval(timer)
            resolve(1)
          }
          let { ICStartStatus } = that.ICInfo
          //0x19:'身份证功能启动成功',0x1a:'身份证功能启动失败',
          if (ICStartStatus === 0x19) {
            timer && clearInterval(timer)
            resolve(0)
          }
          if (ICStartStatus === 0x1a) {
            timer && clearInterval(timer)
            resolve(1)
          }
        }, delay)
      })
      console.log(
        `ICStartStatus:${ICStartStatus}: ${ICStartStatus === 0 ? '身份证功能启动成功' : '身份证功能启动失败'}`
      )
      if (ICStartStatus === 1) {
        that.$message.warning('身份证功能启动失败，请重试')
        return
      }
      let ICGetOneStatus = await new Promise((resolve, reject) => {
        GetOneIC()
        let currentWait = 0
        let timer = setInterval(function () {
          currentWait += delay
          if (currentWait >= maxWait) {
            timer && clearInterval(timer)
            resolve(1)
          }
          let { ICGetOneStatus } = that.ICInfo
          //0x1b:'身份证读卡成功',0x1c:'身份证读卡失败',
          if (ICGetOneStatus === 0x1b) {
            timer && clearInterval(timer)
            resolve(0)
          }
          if (ICGetOneStatus === 0x1c) {
            timer && clearInterval(timer)
            resolve(1)
          }
        }, 200)
      })
      console.log(`ICGetOneStatus:${ICGetOneStatus}: ${ICGetOneStatus === 0 ? '身份证读卡成功' : '身份证读卡失败'}`)
      if (ICGetOneStatus === 1) {
        that.$message.warning('身份证读卡失败，请重试')
        return
      }
      let GetICValuesStatus = await new Promise((resolve, reject) => {
        GetICValues()
        let currentWait = 0
        let timer = setInterval(function () {
          currentWait += delay
          if (currentWait >= maxWait) {
            timer && clearInterval(timer)
            resolve(1)
          }
          let { ICPhoto } = that.ICInfo
          if (ICPhoto !== null) {
            timer && clearInterval(timer)
            resolve(Object.assign({}, that.ICInfo))
          }
        }, 100)
      })
      if (GetICValuesStatus === 1) {
        that.$message.warning('获取身份证信息失败，请重试')
        return
      }
      that.$emit('change',{type:'idcard',data:GetICValuesStatus})
      return GetICValuesStatus
    },
    /**获取身份证复印件 */
    async getICPicture() {
      let that = this
      let delay = 300
      let maxWait = 3000
      let ICPicture = await new Promise((resolve, reject) => {
        GetICPictureAll()
        let currentWait = 0
        let timer = setInterval(function () {
          currentWait += delay
          if (currentWait >= maxWait) {
            timer && clearInterval(timer)
            resolve(1)
          }
          if (that.ICPicture !== null) {
            console.log(that.ICPicture)
            timer && clearInterval(timer)
            resolve(that.ICPicture)
          }
        }, delay)
      })
      if (ICPicture === 1) {
        that.$message.warning('获取身份证复印件失败，请重试')
        return
      }
      that.$emit('change',{type:'idcardcopy',data:ICPicture})
      return ICPicture
    },
    fnBeginVideo() {
      let fileName = `video1_${this.moment().format('YYYYMMDDHHmmssSS')}.avi`
      let path = `${this.cameraGPPath.videoPath}\\${fileName}`
      this.videoPathCache = [...this.videoPathCache,path]
      BeginVideo(path, 0, 1)
    },
    fnBeginVideoSecond() {
      let fileName = `video2_${this.moment().format('YYYYMMDDHHmmssSS')}.avi`
      let path = `${this.cameraGPPath.videoPath}\\${fileName}`
      this.videoPathCache = [...this.videoPathCache,path]
      BeginVideoSecond(path, 0, 1)
    },
    cameraRecordSignAction(action = 'start') {
      let that = this
      if (action === 'start') {
        let timer = setInterval(() => {
          that.cameraRecordSign = { ...that.cameraRecordSign, endTime: that.moment() }
        }, 1000)
        that.cameraRecordSign = {
          status: true,
          beginTime: that.moment(),
          endTime: that.moment(),
          timer: timer,
        }
      }

      if (action === 'stop') {
        let timer = that.cameraRecordSign.timer
        timer && clearInterval(timer)
        that.cameraRecordSign = {
          status: false,
          beginTime: null,
          endTime: null,
          timer: null,
        }
        let _videoPath = that.videoPathCache[that.videoPathCache.length - 1]
        that.customMsg('video',_videoPath)
      }
    },
    settingAction() {
      this.$refs.setting.show()
    },
    capture() {
      //debugger
      let type = this.$refs.setting.config.cutType || 0
      console.log('CaptureImage', type)
      this.CaptureImage(type)
    },
    capture2() {
      //debugger
      let type = this.$refs.setting.config.cutType || 0
      console.log('CaptureImage', type)
      this.CaptureImage2(type)
    },
    startVideo() {
      if (this.deviceResolutionValue) {
        this.deviceResolutionOneChange(this.deviceResolutionValue)
      }
    },
    closeVideo() {
      CloseCam()
    },
    startVideo2() {
      if (this.deviceResolutionSecondValue) {
        this.deviceResolutionSecondChange(this.deviceResolutionSecondValue)
      }
    },
    closeVideo2() {
      CloseCam2()
    },
    funConvertToPDF() {
      let that = this
      let pdfCacheList = [...that.pdfCacheList]
      if (that.photoCacheList.length === 0) {
        that.$message.info('pdf没有添加任何文件')
        return
      }
      if (that.photoCacheList.some((str) => !str.endsWith('.jpg'))) {
        that.$message.info('pdf添加文件不是jpg格式')
        return
      }
      that.photoCacheList.map((path) => AddPDFImageFile(path))
      let pdfPath = that.cameraGPPath.pdfPath + '\\convert.pdf'
      let key = uuid()
      pdfCacheList.push({
        key,
        path: pdfPath,
        status: 'pending',
      })
      that.pdfCacheList = pdfCacheList
      SavePDF(pdfPath)

      let task1 = new Promise((resolve, reject) => {
        that.spinTips = '生成PDF中...'
        that.spinning = true
        let timer = setInterval(function () {
          let _pdfCacheList = [...that.pdfCacheList]
          let _target = _pdfCacheList.find((item) => item.key === key)
          if (_target && _target.status === 'done') {
            clearInterval(timer)
            that.spinning = false
            resolve(pdfPath)
          }
        }, 1000)
      })

      task1.then((res) => {
        let _pdfPath = that.pdfCacheList[that.pdfCacheList.length - 1]
        that.customMsg('pdf',_pdfPath.path)
      })
    },
    captureUpload(){
      let that = this
      that.isCaptureUpload = true
      that.capture()
    },
    customMsg(type,path){
      let that = this
      let m = {
        'pdf':'PDF文件',
        'face':'人脸照片',
        'video':'录像文件',
        'photo':'照片文件'
      }
      const h = that.$createElement
      let msg = `系统检测到新的${m[type]}【${path}】，需要上传吗？`
      that.$confirm({
        title: '提示',
        okText: '上传',
        cancelText: '取消',
        content: h('div', msg),
        onOk() {
          that._funUpdataFile2(path).then((_file_url) => {
            if (_file_url !== null) {
              that.$message.success('上传成功')
              that.$emit('change',{type:type,url:_file_url})
              if(type === 'pdf'){ //合并PDF后 需要清空照片列表
                that.photoCacheList = []
              }
              return
            } else {
              that.$message.success('上传失败')
              return
            }
          })
        },
        onCancel() {},
      })
    },
    _funUpdataFile2(filePath) {
      let that = this
      let param = `?url=${encodeURIComponent(this.uploadUrl)}&path=${encodeURIComponent(filePath)}`
      let url = that.uploadProxyURL + param

      that.spinTips = '上传文件中...'
      that.spinning = true
      
      return window.fetch(url).then(response =>{
        if(response.ok){
          return response.json()
        }else{
          throw new Error('网络响应不正常，请稍后再试');
        }
      }).then(res =>{
        that.spinning = false
        if (res && res.response && res.response.data) {
          return res.response.data
        }
        return null
      })
      .catch(error =>{
        that.spinning = false
        that.$message.error(error.message)
      })


      //return gaopaiyiCustomUpload(url).then((res) => {
      // return that.$http(url).then((res) => {
      //   that.spinning = false
      //   if (res && res.response && res.response.data) {
      //     return res.response.data
      //   }
      //   return null
      // }).catch(err =>{
      //   console.log(err)
      //   that.spinning = false
      // })
    },
  },
}
</script>
<style>
@keyframes cameraRecordChange {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
<style scoped>
.camera-wrapper {
  display: flex;
}
.camera-main-wrapper {
  flex: 0 0 800px;
}
.camera-info-wrapper {
  box-sizing: border-box;
  flex: 0 0 350px;
  padding: 15px;
  background: #f5f5f5;
  color: #444;
  height: 600px;
  overflow-y: auto;
}
.camera-action {
  padding: 15px;
}
.camera-action .camera-action-row {
  margin-bottom: 15px;
}

.camera-info-wrapper > p {
  background-color: #e6f7ff;
  border: 1px solid #91d5ff;
  border-radius: 4px;
  padding: 5px;
  word-break: break-all;
  white-space: normal;
}

.camera-one-body,
.camera-second-body {
  position: relative;
}
.camera-record-sign-wrap {
  /* transition: all .2s linear; */
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  line-height: 60px;
  background-color: rgba(0, 0, 0, 0.5);
  text-align: center;
  color: #fff;
  font-size: 24px;
}
.camera-record-sign {
  display: inline;
}
.camera-record-sign::before {
  content: '';
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: red;
  margin: 5px 10px 3px 0;
  animation: cameraRecordChange 1s infinite;
}
</style>