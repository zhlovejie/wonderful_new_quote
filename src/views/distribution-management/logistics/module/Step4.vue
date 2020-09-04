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
            <UploadP ref="normalCard" style="margin-left:100px" :msgId="certificateList" />
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
              <UploadP style="margin-left:100px" ref="normalUpload" :msgId="specialList" />
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
// import { getQueryOne, saveDeliveryAddress, deleteQueryOne } from '@/api/contractListManagement'
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
    }
  },
  watch: {
    queryonedata: function () {
      this.init()
    },
  },
  mounted() {
    // this.init()
  },

  methods: {
    regist(flag) {
      return (el) => {
        this.domEles[flag] = el
      }
    },
    onSearch(value) {
      getCardNo({ cardNo: value }).then((res) => {
        console.log(res.data)
      })
    },

    async init() {
      const that = this
      if (that.queryonedata.logisticsPilots.length > 0) {
        console.log(that.queryonedata.logisticsPilots)
        that.certificateList = that.queryonedata.logisticsPilots[0].cardNoAnnuxes.map((item) => {
          return {
            uid: item.id,
            name: '1',
            status: 'done',
            url: item.url,
          }
        })
        that.specialList = that.queryonedata.logisticsPilots[0].driveNoAnnuxes.map((item) => {
          return {
            uid: item.id,
            name: '1',
            status: 'done',
            url: item.url,
          }
        })
        that.form.setFieldsValue({
          cardNo: that.queryonedata.logisticsPilots[0].cardNo,
          driveNo: that.queryonedata.logisticsPilots[0].driveNo,
          fullName: that.queryonedata.logisticsPilots[0].fullName,
          telephone: that.queryonedata.logisticsPilots[0].telephone,
          wechatNumber: that.queryonedata.logisticsPilots[0].wechatNumber,
        })
      }
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
                    status: 1,
                    name: file.name,
                  }
                  return arr
                }
              })
            : []
          let num = that.$refs.normalUpload
            ? that.$refs.normalUpload.getFiles().map((file) => {
                if (file.response && file.response.code === 200 && file.name != '1') {
                  let arr = {
                    url: file.response.data,
                    status: 2,
                    name: file.name,
                  }
                  return arr
                }
              })
            : []
          let arr1 = that.$refs.normalCard
            ? that.$refs.normalCard.getFiles().map((file) => {
                if (file.name === '1') {
                  let arr = {
                    url: file.response.data,
                    status: 1,
                    name: file.name,
                    id: file.id,
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
                    url: file.response.data,
                    status: 2,
                    name: file.name,
                    id: file.id,
                  }
                  return arr
                }
              })
            : []
          num1 = num1.filter((item) => item)
          if (arr || num || arr1 || num1) {
            values.logisticsPilotAnnuxes = [...arr, ...num, ...arr1, ...num1]
          }
          values.logisticsInformationId = that.queryonedata.id
          console.log(values)
          // 校验成功，保存填写的信息，请求后端接口存起来，进入下一个页面
          pilotAndUpdate(values)
            .then((res) => {
              console.log('校验成功，保存填写的信息，请求后端接口结果', res)
              that.loading = false
              if (status != 1) {
                that.$emit('nextStep', { ...res.data })
              } else {
                that.$message.success('保存成功')
              }
            })
            .catch((error) => {
              console.error(error)
            })
        }
      })
    },
    // 上一步
    prevStep() {
      this.$emit('prevStep', this.queryonedata.id)
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
