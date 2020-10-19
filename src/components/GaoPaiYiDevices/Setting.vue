<template>
  <a-modal
      title="高级设置"
      :width="750"
      :visible="visible"
      :maskClosable="false" 
      @cancel="handleCancel"
      :footer="null"
    >
    <a-form :form="form" class="advanced-setting-wrapper">
      <a-form-item label="保存格式">
        <a-radio-group :value="config.fileType" @change="(e) =>changeHandler(e,'fileType')">
          <a-radio :value="0">jpg</a-radio>
          <a-radio :value="1">png</a-radio>
          <a-radio :value="2">bmp</a-radio>
          <a-radio :value="3">gif</a-radio>
          <a-radio :value="4">tif</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="颜色格式">
        <a-radio-group :value="config.imageColorMode" @change="(e) => changeHandler(e,'imageColorMode')">
          <a-radio :value="0">彩色</a-radio>
          <a-radio :value="1">灰度</a-radio>
          <a-radio :value="2">黑白</a-radio>
        </a-radio-group>
      </a-form-item>
      
      <a-form-item label="裁切模式">
        <a-radio-group :value="config.cutType" @change="(e) => changeHandler(e,'cutType')">
          <a-radio :value="0">不裁切</a-radio>
          <a-radio :value="1">自动裁切</a-radio>
          <a-radio :value="2">手动裁切</a-radio>
        </a-radio-group>
        <a-alert v-if="+config.cutType === 2" message="手动裁切需要在设备上点击鼠标左键拖动形成矩形区域" banner closable />
      </a-form-item>

      <a-form-item label="自动裁切" v-if="+config.cutType === 1">
        <a-radio-group :value="config.autoCutType" @change="(e) => changeHandler(e,'autoCutType')">
          <a-radio :value="1">单图</a-radio>
          <a-radio :value="2">多图</a-radio>
        </a-radio-group>
        <a-checkbox :value="config.bubai" @change="(e) => changeHandler(e,'bubai')">开启补白</a-checkbox>
      </a-form-item>
      <a-form-item label="连拍模式">
        <a-radio-group :value="config.captureModel" @change="(e) => changeHandler(e,'captureModel')">
          <a-radio :value="0">无</a-radio>
          <a-radio :value="1">智能连拍</a-radio>
          <a-radio :value="2">定时连拍</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="时间间隔" v-if="+config.captureModel === 2">
        <a-input-number
          style="width:80px;"
          :min="1"
          :max="3600"
          :step="1"
          :value="config.captureTime"
          @change="(e) => changeHandler(e,'captureTime')"
        />
        <span style="margin-left:10px;">秒</span>
      </a-form-item>

      <a-form-item label="自动曝光">
        <a-radio-group :value="config.autoExposure" @change="(e) => changeHandler(e,'autoExposure')">
          <a-radio :value="1">开启</a-radio>
          <a-radio :value="2">关闭</a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item label="文件路径">
        <p>
          <span>照片保存路径：</span>
          <a-input  style="width:250px;" :value="config.path.imagePath" @change="(e) => changeHandler(e,'path','imagePath')"/>
        </p>
        <p>
          <span>合并PDF保存路径：</span>
          <a-input  style="width:250px;" :value="config.path.pdfPath" @change="(e) => changeHandler(e,'path','pdfPath')"/>
        </p>
        <p>
          <span>录像保存路径：</span>
          <a-input  style="width:250px;" :value="config.path.videoPath" @change="(e) => changeHandler(e,'path','videoPath')"/>
        </p>
      </a-form-item>
      <a-form-item label="文件命名">
        <a-radio-group :value="config.fileNameMode" @change="(e) => changeHandler(e,'fileNameMode')">
          <a-radio :value="1">自定义</a-radio>
          <a-radio :value="2">时间</a-radio>
          <a-radio :value="3">固定</a-radio>
        </a-radio-group>

        <p v-if="+config.fileNameMode === 1">
          <span>设置自定义文件名称：</span>
          <a-input  style="width:150px;" :value="config.customFileName" @change="(e) => changeHandler(e,'customFileName')"/>
          <span style="margin-left:10px;">起始编号：</span>
          <a-input-number
            style="width:80px;"
            :min="1"
            :max="3600"
            :step="1"
            :value="config.customFileNameNumber" 
            @change="(e) => changeHandler(e,'customFileNameNumber')"
          />
        </p>

        <p v-if="+config.fileNameMode === 3">
          <span>设置固定文件名称：</span>
          <a-input  style="width:150px;" :value="config.customFileName" @change="(e) => changeHandler(e,'customFileName')"/>
        </p>


      </a-form-item>

      <a-form-item label="添加水印">
        <a-radio-group :value="config.waterType" @change="(e) => changeHandler(e,'waterType')">
          <a-radio :value="1">关闭</a-radio>
          <a-radio :value="2">开启</a-radio>
        </a-radio-group>
        <div class="water-type-settings" v-if="+config.waterType === 2">
        <p>
          <span>水印内容：</span>
          <a-input  style="width:150px;" :value="config.waterTypeConfig.content" @change="(e) => changeHandler(e,'waterTypeConfig','content')" />
        </p>
        <p>
          <span>字体大小：</span>
          <a-input-number
            style="width:80px;"
            :min="10"
            :max="1000"
            :step="1"
            :value="config.waterTypeConfig.fontSize" 
            @change="(e) => changeHandler(+e,'waterTypeConfig','fontSize')"
          />
          <span style="margin-left:15px;">字体颜色：</span>
          <a-input  
            style="width:150px;" 
            :value="config.waterTypeConfig.fontColor" 
            @change="(e) => changeHandler(e,'waterTypeConfig','fontColor')"
          />
          <a style="margin-left:15px;" href="https://encycolorpedia.cn/html" target="_blank">参考颜色</a>
        </p>
        <p>
          <span>字体样式：</span>
          <a-radio-group :value="config.waterTypeConfig.fontStyle" @change="(e) => changeHandler(e,'waterTypeConfig','fontStyle')">
            <a-radio :value="0">宋体</a-radio>
            <a-radio :value="1">黑体</a-radio>
            <a-radio :value="2">幼圆</a-radio>
            <a-radio :value="3">楷体</a-radio>
            <a-radio :value="4">新宋体</a-radio>
          </a-radio-group>
        </p>
        <p>
          <span>水印位置：</span>
          <a-radio-group :value="config.waterTypeConfig.position" @change="(e) => changeHandler(e,'waterTypeConfig','position')">
            <a-radio :value="0">左上角</a-radio>
            <a-radio :value="1">左下角</a-radio>
            <a-radio :value="2">右上角</a-radio>
            <a-radio :value="3">右下角</a-radio>
            <a-radio :value="4">垂直居中</a-radio>
          </a-radio-group>
        </p>
        </div>
      </a-form-item>

    </a-form>
    </a-modal>
</template>
<script>
import {
  SetImageType,
  SetColorMode,
  SetCamCutType,
  SetCamCutType2,
  SetJiubianModel,
  SetBuBai,
  SetTimeCapture,
  SetWiseCapture,
  SetAutoExposure,
  MakeDir,
  SetFileNameCustom,
  SetFileNameCustom2,
  SetFileNameTime,
  SetFileNameTime2,
  SetFileNameFixed,
  SetFileNameFixed2,
  CloseWaterMark,
  OpenWaterMark,
} from './WsUtil'
import _ from 'lodash'
export default {
  name:"setting",
  data(){
    return {
      form: this.$form.createForm(this, { name: 'setting-form' }),
      visible: false,
      config:{
        "fileType": 0,//保存格式 0jpg 1png 2bmp 3gif  4tif
        "imageColorMode": 0,//颜色格式 0彩色 1灰色 2黑白
        "cutType": 0,//裁切模式 0无 1自动裁边 2手动裁边
        "autoCutType": 0,//裁切类型 自动裁切模式可用  1单图 2多图
        "bubai": true,//启动四周黑边补白 0关闭 1启动
        "captureModel": 0,//连拍模式 0关闭 1启动
        "captureTime": 5,//时间间隔 定时连拍可用
        "autoExposure": 1,//自动曝光
        "path": { //文件路径
          "imagePath": "d:/camera_gp/image",//照片保存路径
          "pdfPath": "d:/camera_gp/pdf",//合并PDF保存路径
          "videoPath": "d:/camera_gp/video",//主摄像头录像保存路径
        },
        "fileNameMode": 2,//文件命名
        "customFileName": "guding", //自定义 和  固定 可用
        "customFileNameNumber": 10, //自定义 可用
        "waterType": 1, //添加水印
        "waterTypeConfig": { //开启添加水印 可用
          "content": "ceshi", //水印内容：
          "fontSize": 32,//字体大小：
          "fontColor": "ff0000",//字体颜色：
          "fontStyle": 1,//字体样式：
          "position": 3//水印位置：
        }
      },
      throttlehangeHandler:null
    }
  },
  created(){
    if(this.throttlehangeHandler === null){
      this.throttlehangeHandler = _.debounce(this.actionHandler,2000)
    }
  },
  methods:{
    show(){
      this.visible = true
    },
    handleCancel(){
      this.visible = false
    },
    changeHandler2(){

    },
    changeHandler(e,key1,key2){
      let that = this
      //console.log(arguments)
      let _value = null
      if(e && e.target){
        let {type,value,checked} = e.target
        if(type === "radio"){
          _value = +value
        }else if(type === "checkbox"){
          _value = checked ? 1 : 0
        }else if(type === "text"){
          _value = value
        }
      }else{
        _value = +e
      }
      let _config = {...that.config}
      if(key1 && key2){
        _config[key1][key2] = _value
      }else if(key1){
        _config[key1] = _value
      }
      that.config = _config
      that.throttlehangeHandler(key1,key2)
    },
    actionHandler(key1,key2){
      //debugger
      let config = this.config
      if(key1 === 'fileType'){
        SetImageType(config.fileType)
      }else if(key1 === 'imageColorMode'){
        SetColorMode(config.fileType)
      }else if(key1 === 'cutType'){
        SetCamCutType(config.cutType)
        if(config.cutType === 1){
          console.log('设置副边模式(副头不支持自动裁边)')
        }
        if(config.cutType !== 1){
          SetCamCutType2(config.cutType)
        }
      }else if(key1 === 'autoCutType'){
        if(config.cutType === 1){
          SetJiubianModel(config.autoCutType)
        }
      }else if(key1 === 'bubai'){
        if(config.cutType === 1){
          SetBuBai(config.bubai)
        }
      }else if(key1 === 'captureModel'){
        if(config.captureModel === 2){
          config.captureTime > 0 && SetTimeCapture(1,config.captureTime * 1000)
        }else{
          SetWiseCapture(config.captureModel)
        }
      }else if(key1 === 'captureTime'){
        config.captureTime > 0 && SetWiseCapture(1,config.captureTime * 1000)
      }else if(key1 === 'autoExposure'){
        SetAutoExposure(config.autoExposure)
      }else if(key1 === 'path'){
        key2 === 'imagePath' && config.path.imagePath && MakeDir(config.path.imagePath)
        key2 === 'pdfPath' && config.path.pdfPath && MakeDir(config.path.pdfPath)
        key2 === 'videoPath' && config.path.videoPath && MakeDir(config.path.videoPath)
      }else if(key1 === 'fileNameMode'){
        if(config.fileNameMode === 1){
          SetFileNameCustom(config.customFileName,config.customFileNameNumber)
          SetFileNameCustom2(config.customFileName,config.customFileNameNumber)
        }else if(config.fileNameMode === 2){
          SetFileNameTime()
          SetFileNameTime2()
        }else if(config.fileNameMode === 3){
          SetFileNameFixed(config.customFileName)
          SetFileNameFixed2(config.customFileName)
        }
      }else if(key1 === 'waterType'){
        if(config.waterType === 1){
          CloseWaterMark()
        }
        if(config.waterType === 2){
          this.updateWaterTypeConfig()
        }
      }else if(key1 === 'waterTypeConfig'){
        this.updateWaterTypeConfig()
      }
      else{
        console.log(`未知：key1:${key1} , key2:${key2}`)
      }
    },
    updateWaterTypeConfig(){
      let reg = /#?([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/
      let {content,fontSize,fontStyle,fontColor,position} = this.config.waterTypeConfig
      if(!(content && content.length > 0)){
        return 
      }
      if(!(fontSize && fontSize >= 10)){
        return 
      }
      if(!(fontSize >= 0)){
        return 
      }
      if(!typeof fontColor === 'string'){
        return
      }
      let colorMatch = fontColor.match(reg)
      if(!([6,7].includes(fontColor.length) && colorMatch !== null)){
        return
      }
      if(!(position >= 0)){
        return 
      }
      let r,g,b,x,y 
      r = parseInt(`0x${colorMatch[1]}`,16)
      g = parseInt(`0x${colorMatch[2]}`,16)
      b = parseInt(`0x${colorMatch[3]}`,16)
      let posMap = {
        0:[0,0],
        1:[0,100],
        2:[100,0],
        3:[100,100],
        4:[50,50]
      }
      let point = posMap[position]
      x = point[0],y = point[1]
      console.log('设置水印：',content,fontSize,fontStyle,r,g,b,x,y)
      OpenWaterMark(content,fontSize,fontStyle,r,g,b,x,y)
    }
  }
}
</script>

<style scoped>
.advanced-setting-wrapper >>> .ant-form-item {
  display: flex;
  margin: 0;
}

.ant-form-item >>> .ant-form-item-label {
  width: 100px;
}
.ant-form-item >>> .ant-form-item-control-wrapper {
  flex: 1;
}
</style>