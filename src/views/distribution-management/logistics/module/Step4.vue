<template>
  <div class="content-wrap">
    <a-row>
      <a-col :span="24" class="basic-tit" justify="center" align="middle">驾驶员信息</a-col>
    </a-row>
    <a-form :form="form">
      <a-form-item>
        <a-row type="flex">
          <a-col :span="6"></a-col>
          <a-col class="col-border" :span="3" justify="center" align="middle">身份证号码</a-col>
          <a-col class="col-border" :span="9" justify="center" align="middle">
            <a-form-item>
              <a-input-search
                placeholder=" 身份证号码"
                :disabled="isSee"
                v-decorator="['cardNo',{rules: [{required: true,message: '请输入身份证号码',},
              ]}]"
                style="width:60%;"
                enter-button
                @search="onSearch"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row type="flex">
          <a-col :span="6"></a-col>
          <a-col class="col-border" :span="3" justify="center" align="middle">姓名</a-col>
          <a-col class="col-border" :span="9" justify="center" align="middle">
            <a-form-item>
              <a-input
                style="width:60%;"
                :precision="0"
                placeholder="姓名"
                :disabled="isSee"
                v-decorator="['fullName',{rules: [{required: true,message: '请输入姓名',},
             ]}]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row type="flex">
          <a-col :span="6"></a-col>
          <a-col class="col-border" :span="3" justify="center" align="middle">电话</a-col>
          <a-col class="col-border" :span="9" justify="center" align="middle">
            <a-form-item>
              <a-input
                style="width:60%;"
                :precision="0"
                :disabled="isSee"
                placeholder="电话"
                v-decorator="['telephone',{rules: [{required: true,message: '请输入电话',},
             ]}]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row type="flex">
          <a-col :span="6"></a-col>
          <a-col class="col-border" :span="3" justify="center" align="middle">微信号</a-col>
          <a-col class="col-border" :span="9" justify="center" align="middle">
            <a-form-item>
              <a-input
                style="width:60%;"
                :precision="0"
                :disabled="isSee"
                placeholder="微信号"
                v-decorator="['wechatNumber',{rules: [{required: true,message: '请输入微信号',},
             ]}]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row type="flex">
          <a-col :span="6"></a-col>
          <a-col class="col-border" :span="3" justify="center" align="middle">驾驶证号码</a-col>
          <a-col class="col-border" :span="9" justify="center" align="middle">
            <a-form-item>
              <a-input
                style="width:60%;"
                :precision="0"
                placeholder="驾驶证号码"
                :disabled="isSee"
                v-decorator="['driveNo',{rules: [{required: true,message: '请输入驾驶证号码',},
             ]}]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row type="flex">
          <a-col :span="6"></a-col>
          <a-col class="col-border" :span="3" justify="center" align="middle">身份证</a-col>
          <a-col class="col-border" :span="9" justify="center" align="middle">
            <UploadP
              ref="normalCard"
              style="margin-left:100px"
              :msgId="certificateList"
              :name="isSee"
            />
          </a-col>
        </a-row>

        <a-form-item>
          <a-row type="flex">
            <a-col :span="6"></a-col>
            <a-col
              class="col-border"
              :style="{borderBottom:'1px solid #ddd'}"
              justify="center"
              align="middle"
              :span="3"
            >驾驶证</a-col>
            <a-col
              class="col-border"
              :style="{borderBottom:'1px solid #ddd'}"
              justify="center"
              align="middle"
              :span="9"
            >
              <UploadP
                style="margin-left:100px"
                ref="normalUpload"
                :msgId="specialList"
                :name="isSee"
              />
            </a-col>
          </a-row>
        </a-form-item>
      </a-form-item>
      <a-form-item class="btns-grop" style="border-left: none">
        <a-button style="margin-left: 8px;" @click="prevStep">上一步</a-button>
        <a-button type="primary" @click="nextStep">下一步</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script>
import { getCardNo, pilotAndUpdate } from '@/api/distribution-management'
import moment from 'moment'
import UploadP from './UploadP'
export default {
  name: 'Step4',
  components: {
    UploadP,
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
    onSearch(value) {
      let that = this
      getCardNo({ cardNo: value }).then((res) => {
        console.log(res.data)
        that.certificateList = res.data[0].cardNoAnnuxes.map((item) => {
          return {
            uid: item.id,
            name: '1',
            fileName: item.name,
            status: 'done',
            url: item.url,
          }
        })
        that.specialList = res.data[0].driveNoAnnuxes.map((item) => {
          return {
            uid: item.id,
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
