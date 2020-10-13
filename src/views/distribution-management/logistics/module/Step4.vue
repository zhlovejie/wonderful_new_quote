<template>
  <div class="content-wrap">
    <a-row style="margin-bottom: 50px">
      <a-col :span="24" class="basic-tit" justify="center" align="middle">驾驶员信息</a-col>
    </a-row>
    <a-form :form="form">
      <a-form-item>
        <a-row type="flex">
          <a-col :span="5"></a-col>
          <a-col class="col-border" :span="4" justify="center" align="middle">身份证号码</a-col>
          <a-col class="col-border" :span="10" justify="center" align="middle">
            <a-form-item>
              <a-input-search
                placeholder=" 身份证号码"
                :disabled="isSee"
                v-decorator="['cardNo', { rules: [{ required: true, message: '请输入身份证号码' }] }]"
                style="width: 60%"
                enter-button
                @search="onSearch"
              />
              <a-button type="link" @click="scanning">扫描</a-button>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row type="flex">
          <a-col :span="5"></a-col>
          <a-col class="col-border" :span="4" justify="center" align="middle">姓名</a-col>
          <a-col class="col-border" :span="10" justify="center" align="middle">
            <a-form-item>
              <a-input
                style="width: 70%"
                :precision="0"
                placeholder="姓名"
                :disabled="isSee"
                v-decorator="['fullName', { rules: [{ required: true, message: '请输入姓名' }] }]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row type="flex">
          <a-col :span="5"></a-col>
          <a-col class="col-border" :span="4" justify="center" align="middle">电话</a-col>
          <a-col class="col-border" :span="10" justify="center" align="middle">
            <a-form-item>
              <a-input
                style="width: 70%"
                :precision="0"
                :disabled="isSee"
                placeholder="电话"
                v-decorator="['telephone', { rules: [{ required: true, message: '请输入电话' }] }]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row type="flex">
          <a-col :span="5"></a-col>
          <a-col class="col-border" :span="4" justify="center" align="middle">微信号</a-col>
          <a-col class="col-border" :span="10" justify="center" align="middle">
            <a-form-item>
              <a-input
                style="width: 70%"
                :precision="0"
                :disabled="isSee"
                placeholder="微信号"
                v-decorator="['wechatNumber', { rules: [{ required: false, message: '请输入微信号' }] }]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row type="flex">
          <a-col :span="5"></a-col>
          <a-col class="col-border" :span="4" justify="center" align="middle">驾驶证号码</a-col>
          <a-col class="col-border" :span="10" justify="center" align="middle">
            <a-form-item>
              <a-input
                style="width: 70%"
                :precision="0"
                placeholder="驾驶证号码"
                :disabled="isSee"
                v-decorator="['driveNo', { rules: [{ required: true, message: '请输入驾驶证号码' }] }]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row type="flex">
          <a-col :span="5"></a-col>
          <a-col
            class="col-border"
            :span="4"
            justify="center"
            align="middle"
            style="margin-top：20px"
            :style="{ paddingTop: '45px' }"
            >身份证</a-col
          >
          <a-col class="col-border" :span="10" justify="center" align="middle">
            <UploadP ref="normalCard" style="margin-left: 100px" :msgId="certificateList" :name="isSee" />
          </a-col>
        </a-row>

        <a-form-item>
          <a-row type="flex">
            <a-col :span="5"></a-col>
            <a-col
              :style="{ borderBottom: '1px solid #ddd', paddingTop: '45px' }"
              class="col-border"
              justify="center"
              align="middle"
              :span="4"
              >驾驶证</a-col
            >
            <a-col
              :style="{ borderBottom: '1px solid #ddd' }"
              class="col-border"
              justify="center"
              align="middle"
              :span="10"
            >
              <UploadP style="margin-left: 100px" ref="normalUpload" :msgId="specialList" :name="isSee" />
              <a-button style="margin-right: 338px" @click="gaoPaiYiDevicesClickHandler">拍照上传</a-button>
            </a-col>
          </a-row>
        </a-form-item>
      </a-form-item>
      <a-form-item class="btns-grop" style="border-left: none">
        <a-button style="margin-left: 8px" @click="prevStep">上一步</a-button>
        <a-button type="primary" @click="nextStep">下一步</a-button>
      </a-form-item>
    </a-form>
    <GaoPaiYiDevices ref="gaoPaiYiDevices" @change="gaoPaiYiDevicesChange" />
  </div>
</template>
<script>
import { getCardNo, pilotAndUpdate } from '@/api/distribution-management'
import moment from 'moment'

//高拍仪组件
import GaoPaiYiDevices from '@/components/GaoPaiYiDevices/Index'
//上传图片
//base64上传接口
import { customUploadBase64 } from '@/api/common'
let uuid = () => Math.random().toString(32).slice(-10)
import UploadP from './UploadP'
export default {
  name: 'Step4',
  components: {
    UploadP,
    GaoPaiYiDevices,
  },
  props: {
    queryonedata: {
      type: Object,
    },
  },
  data() {
    const queryOneData = { ...this.queryonedata }
    return {
      queryOneData: queryOneData,
      form: this.$form.createForm(this),
      certificateList: [], //身份证
      specialList: [], //专业
      queryonedata1: {},
      isSee: false,
      statusType: undefined,
    }
  },
  watch: {
    queryonedata: function (newVal, oldVal) {
      this.queryonedata1 = val
    },
  },
  created() {
    this.queryonedata1 = this.queryonedata
  },
  mounted() {
    this.init()
    if (this.$parent.routeParams.typeName === 'see') {
      this.isSee = true
    }
  },

  methods: {
    init() {
      this.$nextTick(() => {
        let that = this
        if (that.queryonedata1.logisticsPilot) {
          that.certificateList = that.queryonedata1.logisticsPilot.logisticsPilotAnnuxes.filter(
            (item) => item.statusType === 1
          )
          that.certificateList = that.certificateList.map((item, index) => {
            return {
              uid: index,
              name: '1',
              fileName: item.name,
              status: 'done',
              url: item.url,
            }
          })
          that.specialList = that.queryonedata1.logisticsPilot.logisticsPilotAnnuxes.filter(
            (item) => item.statusType === 2
          )
          that.specialList = that.specialList.map((item, index) => {
            return {
              uid: index,
              name: '1',
              fileName: item.name,
              status: 'done',
              url: item.url,
            }
          })
          that.form.setFieldsValue({
            cardNo: that.queryonedata1.logisticsPilot.cardNo,
            driveNo: that.queryonedata1.logisticsPilot.driveNo,
            fullName: that.queryonedata1.logisticsPilot.fullName,
            telephone: that.queryonedata1.logisticsPilot.telephone,
            wechatNumber: that.queryonedata1.logisticsPilot.wechatNumber,
          })
        }
      })
    },
    regist(flag) {
      return (el) => {
        this.domEles[flag] = el
      }
    },
    scanning() {
      this.$refs.gaoPaiYiDevices.show()
    },
    onSearch(value) {
      let that = this
      getCardNo({ cardNo: value }).then((res) => {
        that.certificateList = res.data[0].logisticsPilotAnnuxes.filter((item) => item.statusType === 1)
        that.certificateList = that.certificateList.map((item, index) => {
          return {
            uid: index,
            name: '1',
            fileName: item.name,
            status: 'done',
            url: item.url,
          }
        })
        that.specialList = res.data[0].logisticsPilotAnnuxes.filter((item) => item.statusType === 2)
        that.specialList = that.specialList.map((item, index) => {
          return {
            uid: index,
            name: '1',
            fileName: item.name,
            status: 'done',
            url: item.url,
          }
        })
        that.form.setFieldsValue({
          cardNo: res.data[0].cardNo,
          driveNo: res.data[0].driveNo,
          fullName: res.data[0].fullName,
          telephone: res.data[0].telephone,
          wechatNumber: res.data[0].wechatNumber,
        })
      })
    },
    gaoPaiYiDevicesClickHandler() {
      //打开高拍仪
      this.statusType = 2
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
      if (type === 'idcard') {
        const cardNo = data.ICNumber.split(',')
        const cardl = cardNo[cardNo.length - 1]
        const fullName = data.ICName.split(',')
        const fulll = fullName[fullName.length - 1]
        this.form.setFieldsValue({
          cardNo: cardl,
          fullName: fulll,
        })
      }
      if (type === 'idcardcopy') {
        // this.$refs.gaoPaiYiDevices.close()
        customUploadBase64({ picBase64: data }).then((res) => {
          console.log(res.data)
          if (res.code === 200) {
            this.$refs.gaoPaiYiDevices.close()
            const file = res.data.split('/')
            const fileName = file[file.length - 1]
            this.certificateList.push({
              uid: uuid(),
              name: '1',
              fileName: fileName,
              status: 'done',
              statusType: 1,
              url: res.data,
            })
          } else {
            this.$message.error(res.msg)
            this.$refs.gaoPaiYiDevices.close()
          }
        })
      }
      // 拍照上传驾驶证
      if (type === 'photo' && this.statusType === 2) {
        const file = url.split('/')
        const fileName = file[file.length - 1]
        this.specialList.push({
          uid: uuid(),
          name: '1',
          fileName: fileName,
          status: 'done',
          statusType: 2,
          url: url,
        })
        this.$refs.gaoPaiYiDevices.close()
      }

      //#处理自己的逻辑END
      //关闭高拍仪
    },

    // 点击下一步
    nextStep(status) {
      const that = this
      const {
        form: { validateFields },
      } = this
      // 先校验，通过表单校验后，才进入下一步
      validateFields((err, values) => {
        if (!err) {
          let arr = that.$refs.normalCard
            ? that.$refs.normalCard.getFiles().map((file) => {
                if (file.response && file.response.code === 200 && file.name != '1') {
                  let arr = {
                    url: file.response.data,
                    statusType: 1,
                    name: file.name,
                  }
                  return arr
                }
              })
            : []
          arr = arr.filter((item) => item)
          let num = that.$refs.normalUpload
            ? that.$refs.normalUpload.getFiles().map((file) => {
                if (file.response && file.response.code === 200 && file.name != '1') {
                  let arr = {
                    url: file.response.data,
                    statusType: 2,
                    name: file.name,
                  }
                  return arr
                }
              })
            : []
          num = num.filter((item) => item)
          let arr1 = that.$refs.normalCard
            ? that.$refs.normalCard.getFiles().map((file) => {
                if (file.name === '1') {
                  let arr = {
                    url: file.url,
                    statusType: 1,
                    name: file.fileName,
                  }
                  return arr
                }
              })
            : []
          arr1 = arr1.filter((item) => item)
          let num1 = that.$refs.normalUpload
            ? that.$refs.normalUpload.getFiles().map((file) => {
                if (file.name === '1') {
                  let arr = {
                    url: file.url,
                    statusType: 2,
                    name: file.fileName,
                  }
                  return arr
                }
              })
            : []
          num1 = num1.filter((item) => item)
          if (arr || num || arr1 || num1) {
            values.logisticsPilotAnnuxes = [...arr, ...num, ...arr1, ...num1]
          }
          let params = {
            logisticsPilot: values,
          }
          that.$emit('nextStep', params)
        }
      })
    },
    // 上一步
    prevStep() {
      this.$emit('prevStep')
    },
  },
}
</script>

<style lang="less" scoped>
.wdf-row {
  border: 1px solid #ddd;
}
.col-border {
  border: 1px solid #ddd;
  padding: 10px 0;
  border-bottom: none;
  min-height: 60px;
  box-sizing: border-box;
}
.wdf-form {
  margin-top: 12px;
  padding: 12px;
}
.btns-grop {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 24px;
}
.btns-grop button:not(first-child) {
  margin-left: 12px;
}
.inner-row {
  width: 80%;
}
.inner-row6 {
  width: 60%;
}
.ant-row.ant-form-item {
  margin-bottom: 0;
}
.ant-form-item-children {
  display: block;
}
.ant-form-item-control-wrapper {
  width: 100%;
}
</style>
