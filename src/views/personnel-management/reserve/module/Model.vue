<template>
  <div>
    <a-upload name="file" :action="uploadUrl" :fileList="fileList" @change="handleChange" :showUploadList="fileUrl">
      <a-button class="a-button" type="primary" icon="upload">上传</a-button>
    </a-upload>

    <a-button
      class="a-button"
      style="margin-left: 10px"
      @click="gaoPaiYiDevicesClickHandler"
      type="primary"
      icon="upload"
      >设备上传</a-button
    >
    <GaoPaiYiDevices ref="gaoPaiYiDevices" @change="gaoPaiYiDevicesChange" />
  </div>
</template>
<script>
import { getUploadPath2 } from '@/api/common'
//高拍仪组件
import GaoPaiYiDevices from '@/components/GaoPaiYiDevices/Index'
export default {
  name: 'BecomingForm',
  components: {
    GaoPaiYiDevices,
  },
  data() {
    return {
      uploadUrl: getUploadPath2(),
      fileList: [],
      fileUrl: false,
      id: this.msg,
      tempName: this.name,
    }
  },
  props: ['msg', 'name', 'fileName', 'fileListData'],
  watch: {
    fileName: function (val, oldVal) {
      this.fileList = val || []
    },
  },
  created() {
    this.fileList = this.fileName
  },
  methods: {
    gaoPaiYiDevicesChange(result) {
      console.log(result)
      //result 参数 数据结构说明
      /**
       * type - 'pdf':'PDF文件','face':'人脸照片','video':'录像文件','photo':'照片文件'
       * url  - 上传后返回的 文件url
       */
      /**
       * type - idcard -身份证信息  idcardcopy -身份证复印件base64
       * data - {
            //0x19:'身份证功能启动成功',0x1a:'身份证功能启动失败',
            ICStartStatus: null, 
            //0x1b:'身份证读卡成功',0x1c:'身份证读卡失败',
            ICGetOneStatus: null,
            ICName: null, //姓名
            ICNumber: null, //身份证号码
            ICSex: null, //性别汉字  男or女
            ICNation: null, //民族
            ICBrithday: null, //出生日期
            ICAddr: null, //地址
            ICSignOrganization: null,//签发机关
            ICExpiryBeginDate: null,//生效日期
            ICExpiryEndDate: null,//过期日期
            ICModelNumber: null, //安全码
            ICPhoto: null, //身份证头像 base64 格式
          }
       */
      /**
       * idcardcopy -身份证复印件base64
       * data - base64格式图片
       */

      let { type, url, data } = result
      //#处理自己的逻辑
      if (type === 'pdf') {
        this.$refs.gaoPaiYiDevices.close()
        let arr = {
          fileUrl: url,
          templateName: this.tempName,
          fileType: 1,
        }
        this.$emit('getmsg', arr)
      }
      //#处理自己的逻辑END
      //关闭高拍仪
    },
    gaoPaiYiDevicesClickHandler() {
      //打开高拍仪
      this.$refs.gaoPaiYiDevices.show()
    },

    handleChange(info) {
      // console.log(arguments)
      let that = this
      that.fileUrl = true
      let fileList = [...info.fileList]
      fileList = fileList.slice(-1)
      fileList = fileList.map((file) => {
        if (file.response && file.response.code === 200) {
          file.url = file.response.data
          let arr = {
            fileUrl: file.response.data,
            templateName: that.tempName,
            fileType: 1,
          }
          that.$emit('getmsg', arr)
          that.fileUrl = false
        }
        return file
      })
      that.fileList = fileList
    },
    //上传
    normFile(e) {
      console.log('Upload event:', e)
      if (Array.isArray(e)) {
        return e
      }
      return e && e.fileList
    },
    info() {
      this.tempName = ''
    },
  },
}
</script>
<style scoped>
/*自定义table样式*/
.custom-table {
  margin-bottom: 0;
}

.custom-table-border th,
.custom-table-border td {
  padding: 5px 10px;
}

.custom-table >>> .custom-table {
  position: relative;
  top: 0;
  left: 0;
  width: calc(100% + 2px);
  margin-bottom: -2px;
}
.custom-table >>> .custom-table td {
  text-align: left;
}
.becoming-form-wrapper >>> .ant-form-item {
  margin-bottom: 0;
}

.bank-card-list-wrapper {
  display: flex;
}
.bank-card-list-wrapper >>> .ant-form-item {
  display: flex;
  margin: 0 7px;
}
</style>