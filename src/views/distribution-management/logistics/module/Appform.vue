<template>
  <a-modal
    title="新增货物合同"
    :width="700"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
    :confirmLoading="spinning"
  >
    <template slot="footer">
      <template>
        <a-button key="back" @click="handleCancel">取消</a-button>
        <a-button key="submit" type="primary" :loading="spinning" @click="handleOk">确定</a-button>
      </template>
    </template>

    <a-spin :spinning="spinning">
      <a-form :form="form" class="becoming-form-wrapper">
        <table class="custom-table custom-table-border">
          <tr>
            <td>名称</td>
            <td colspan="3">
              <a-form-item>
                <a-input
                  style="width: 300px"
                  placeholder="输入名称"
                  v-decorator="['name', { rules: [{ required: true, message: '请输入版本号!' }] }]"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>文件</td>
            <td colspan="3">
              <a-form-item>
                <a-upload
                  v-decorator="[
                    'url',
                    { rules: [{ required: false, message: '请上传文件' }] },
                    { valuePropName: 'fileList', getValueFromEvent: normFile },
                  ]"
                  name="file"
                  :fileList="fileList"
                  accept=".pdf, .doc, .docx"
                  @change="handleChange"
                  :action="uploadUrl"
                >
                  <a-button style="width: 200px"> <a-icon type="upload" /> 本地上传 </a-button>
                </a-upload>
              </a-form-item>
              <a-button style="width: 200px" @click="gaoPaiYiDevicesClickHandler">设备上传 </a-button>
            </td>
          </tr>
        </table>
      </a-form>
      <GaoPaiYiDevices ref="gaoPaiYiDevices" @change="gaoPaiYiDevicesChange" />
    </a-spin>
  </a-modal>
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
      visible: false,
      spinning: false,
      form: this.$form.createForm(this),
      uploadUrl: getUploadPath2(),
      //   上传文件
      fileList: [],
      fileType: undefined,
    }
  },

  created() {},
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
        this.fileType = url
      }
      //#处理自己的逻辑END
      //关闭高拍仪
    },
    gaoPaiYiDevicesClickHandler() {
      //打开高拍仪
      this.$refs.gaoPaiYiDevices.show()
    },
    query() {
      this.visible = true
    },

    handleOk() {
      let that = this
      that.form.validateFields((err, values) => {
        if (!err) {
          values.url = that.fileType || values.url.fileList[0].response.data
          that.$emit('msgId', values)
          that.fileList = []
          that.fileType = undefined
          that.form.resetFields()
          that.visible = false
        }
      })
    },
    //上传
    normFile(e) {
      debugger
      console.log('Upload event:', e)
      if (Array.isArray(e)) {
        return e
      }
      return e && e.fileList
    },
    handleChange(info) {
      this.fileList = []
      let fileList = [...info.fileList]
      fileList = fileList.map((file) => {
        if (file.response && file.response.code === 200) {
          file.url = file.response.data
        }
        return file
      })
      this.fileList = fileList
    },
    handleCancel() {
      this.fileList = []
      this.form.resetFields() // 清空表
      this.visible = false
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