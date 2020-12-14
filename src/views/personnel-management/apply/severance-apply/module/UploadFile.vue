<template>
  <a-modal
    title="上传文件"
    :width="500"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
    :confirmLoading="spinning"
  >
    <a-spin :spinning="spinning">
      <a-form :form="form" class="upload-form-wrapper">
        <a-form-item v-if="record.type === 1">
          <a-upload
            name="file"
            :action="uploadUrl"
            :multiple="false"
            :beforeUpload="beforeUpload"
            :fileList="fileList_leaveTellBookUrl"
            @change="handleChange_leaveTellBookUrl"
          >
            <a-button><a-icon type="upload" />上传辞退告知书</a-button>
          </a-upload>
          <a-button type="link" @click="gaoPaiYiDevicesClickHandler"> 设备上传辞退告知书 </a-button>
          <a-input hidden v-decorator="['leaveTellBookUrl']" />
        </a-form-item>
        <a-form-item v-if="record.type === 3 || record.type === 2">
          <a-upload
            name="file"
            :action="uploadUrl"
            :multiple="false"
            :beforeUpload="beforeUpload"
            :fileList="fileList_leaveReportBookUrl"
            @change="handleChange_leaveReportBookUrl"
          >
            <a-button><a-icon type="upload" />上传辞职报告</a-button>
          </a-upload>
          <a-button type="link" @click="gaoPaiYiDevicesClickHandler1"> 设备上传辞职报告 </a-button>
          <a-input hidden v-decorator="['leaveReportBookUrl']" />
        </a-form-item>
        <a-form-item v-if="record.type === 2">
          <a-upload
            name="file"
            :action="uploadUrl"
            :multiple="false"
            :beforeUpload="beforeUpload"
            :fileList="fileList_leaveAgreeUrl"
            @change="handleChange_leaveAgreeUrl"
          >
            <a-button><a-icon type="upload" />上传离职协议</a-button>
          </a-upload>
          <a-button type="link" @click="gaoPaiYiDevicesClickHandler2"> 设备上传离职协议</a-button>
          <a-input hidden v-decorator="['leaveAgreeUrl']" />
        </a-form-item>
        <a-form-item>
          <a-upload
            name="file"
            :action="uploadUrl"
            :multiple="false"
            :beforeUpload="beforeUpload"
            :fileList="fileList_goodsHandUrl"
            @change="handleChange_goodsHandUrl"
          >
            <a-button><a-icon type="upload" />上传物品交接单</a-button>
          </a-upload>
          <a-button type="link" @click="gaoPaiYiDevicesClickHandler3"> 设备上传物品交接单 </a-button>
          <a-input hidden v-decorator="['goodsHandUrl']" />
        </a-form-item>
        <GaoPaiYiDevices ref="gaoPaiYiDevices" @change="gaoPaiYiDevicesChange" />
      </a-form>
    </a-spin>
  </a-modal>
</template>


<script>
import { getUploadPath2, getUploadPath } from '@/api/common'
//高拍仪组件
import GaoPaiYiDevices from '@/components/GaoPaiYiDevices/Index'
import { uploadDocPersonnelLeaveApply } from '@/api/personnelManagement'
let uuid = () => Math.random().toString(32).slice(-10)
export default {
  name: 'uploadFile',
  components: {
    GaoPaiYiDevices,
  },
  data() {
    return {
      visible: false,
      spinning: false,
      form: this.$form.createForm(this),
      uploadUrl: getUploadPath2(),
      fileTypes: undefined,
      fileList: [],
      fileList_leaveTellBookUrl: [],
      fileList_leaveReportBookUrl: [],
      fileList_leaveAgreeUrl: [],
      fileList_goodsHandUrl: [],
      aceptFileTypes: [
        '.doc',
        '.docx',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ],
      record: {},
    }
  },
  methods: {
    gaoPaiYiDevicesClickHandler() {
      //打开高拍仪、
      this.fileTypes = 0
      this.$refs.gaoPaiYiDevices.show()
    },
    gaoPaiYiDevicesClickHandler1() {
      //打开高拍仪
      this.fileTypes = 1
      this.$refs.gaoPaiYiDevices.show()
    },
    gaoPaiYiDevicesClickHandler2() {
      //打开高拍仪
      this.fileTypes = 2
      this.$refs.gaoPaiYiDevices.show()
    },
    gaoPaiYiDevicesClickHandler3() {
      //打开高拍仪
      this.fileTypes = 3
      this.$refs.gaoPaiYiDevices.show()
    },

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
      //#处理自己的逻辑END
      if (type === 'pdf' || type === 'photo') {
        const file = result.url.split('/')
        const fileName = file[file.length - 1]
        if (this.fileTypes === 0) {
          this.fileList_leaveTellBookUrl.push({
            uid: uuid(),
            name: fileName,
            status: 'done',
            url: result.url,
          })
          this.form.setFieldsValue({ leaveTellBookUrl: result.url })
        } else if (this.fileTypes === 1) {
          this.fileList_leaveReportBookUrl.push({
            uid: uuid(),
            name: fileName,
            status: 'done',
            url: result.url,
          })
          this.form.setFieldsValue({ leaveReportBookUrl: result.url })
        } else if (this.fileTypes === 2) {
          this.fileList_leaveAgreeUrl.push({
            uid: uuid(),
            name: fileName,
            status: 'done',
            url: result.url,
          })
          this.form.setFieldsValue({ leaveAgreeUrl: result.url })
        } else if (this.fileTypes === 3) {
          this.fileList_goodsHandUrl.push({
            uid: uuid(),
            name: fileName,
            status: 'done',
            url: result.url,
          })
          this.form.setFieldsValue({ goodsHandUrl: result.url })
        }
      }
      //关闭高拍仪
      this.$refs.gaoPaiYiDevices.close()
    },
    query(record) {
      let that = this
      that.record = record
      that.fileList_leaveTellBookUrl = []
      that.fileList_leaveReportBookUrl = []
      that.fileList_leaveAgreeUrl = []
      that.fileList_goodsHandUrl = []

      that.$nextTick(() => (that.visible = true))
      // let target = {}
      // uploadItems.map(item => {
      //   let _item = Object.assign({},item)
      //   let arr = []
      //   if(_item.url){
      //     arr.push({
      //       uid:-1,
      //       name:`${_item.name}-${_item.url}`,
      //       status:'done',
      //       url:_item.url
      //     })
      //   }
      //   target[item.key] = arr
      // })
      // that.fileListObj = {...target}

      // this.$nextTick(() =>this.uploadItems = uploadItems)
    },
    handleOk() {
      let that = this
      that.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          values.id = that.record.id
          values.type = that.record.type
          that.spinning = true
          uploadDocPersonnelLeaveApply(values)
            .then((res) => {
              that.spinning = false
              if (res.code === 200) {
                that.form.resetFields() // 清空表
                that.visible = false
                that.$message.success('操作成功')
                that.$emit('finish')
              } else {
                that.$message.warning(res.msg)
              }
            })
            .catch((err) => (that.spinning = false))
        }
      })
    },
    handleCancel() {
      this.visible = false
    },

    beforeUpload(file) {
      // let _aceptFileTypes = this.aceptFileTypes
      // const isDocType = _aceptFileTypes.includes(file.type)
      // if (!isDocType) {
      //   this.$message.error('只支持上传.doc,.docx的word文档!');
      // }
      const isLt10M = file.size / 1024 / 1024 < 10
      if (!isLt10M) {
        this.$message.error('上传文件必须小于10M!')
      }
      //return isDocType && isLt10M;
      return isLt10M
    },
    handleChange_leaveTellBookUrl({ file, fileList }) {
      let that = this
      that.fileList_leaveTellBookUrl = [...fileList.slice(-1)]
      console.log(fileList)
      if (fileList.length === 0) {
        this.form.setFieldsValue({ leaveTellBookUrl: undefined })
      }
      if (fileList.length > 0) {
        let lastFile = fileList[fileList.length - 1]
        if (lastFile.status && lastFile.status === 'done') {
          this.form.setFieldsValue({ leaveTellBookUrl: lastFile.response.data })
        }
      }
    },
    handleChange_leaveReportBookUrl({ file, fileList }) {
      console.log(fileList)
      let that = this
      that.fileList_leaveReportBookUrl = [...fileList.slice(-1)]
      if (fileList.length === 0) {
        this.form.setFieldsValue({ leaveReportBookUrl: undefined })
      }
      if (fileList.length > 0) {
        let lastFile = fileList[fileList.length - 1]
        if (lastFile.status && lastFile.status === 'done') {
          this.form.setFieldsValue({ leaveReportBookUrl: lastFile.response.data })
        }
      }
    },
    handleChange_leaveAgreeUrl({ file, fileList }) {
      let that = this
      that.fileList_leaveAgreeUrl = [...fileList.slice(-1)]
      console.log(fileList)
      if (fileList.length === 0) {
        this.form.setFieldsValue({ leaveAgreeUrl: undefined })
      }
      if (fileList.length > 0) {
        let lastFile = fileList[fileList.length - 1]
        if (lastFile.status && lastFile.status === 'done') {
          this.form.setFieldsValue({ leaveAgreeUrl: lastFile.response.data })
        }
      }
    },
    handleChange_goodsHandUrl({ file, fileList }) {
      let that = this
      that.fileList_goodsHandUrl = [...fileList.slice(-1)]
      console.log(fileList)
      if (fileList.length === 0) {
        this.form.setFieldsValue({ goodsHandUrl: undefined })
      }
      if (fileList.length > 0) {
        let lastFile = fileList[fileList.length - 1]
        if (lastFile.status && lastFile.status === 'done') {
          this.form.setFieldsValue({ goodsHandUrl: lastFile.response.data })
        }
      }
    },
  },
}
</script>

<style scoped>
</style>