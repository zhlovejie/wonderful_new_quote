<template>
  <div class="content-wrap">
    <a-row type="flex">
      <a-col :span="24" class="basic-tit" justify="center" align="middle">培训介绍</a-col>
    </a-row>
    <div>
      <a-form :form="form" class="form wdf-form">
        <a-form-item>
          <a-row type="flex">
            <a-col
              class="col-border"
              :span="8"
              justify="right"
              align="middle"
              style="text-align: right;"
            >培训名称</a-col>
            <a-col class="col-border" :span="16" type="flex" justify="left" align="middle">
              <a-form-item>
                <a-input
                  :disabled="isSee"
                  style="width:60%;"
                  :precision="0"
                  placeholder="培训名称"
                  v-decorator="['trainName',{rules: [{required: true,message: '请输入培训名称',},
             ]}]"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form-item>

        <a-form-item>
          <a-row type="flex">
            <a-col
              class="col-border"
              :span="8"
              justify="right"
              align="middle"
              style="text-align: right;"
            >培训介绍</a-col>
            <a-col class="col-border" :span="16" type="flex" justify="left" align="middle">
              <a-form-item>
                <a-input
                  type="textarea"
                  :disabled="isSee"
                  style="width:60%;"
                  :precision="0"
                  placeholder="培训介绍"
                  v-decorator="['trainDesc',{rules: [{required: false,message: '请输入培训介绍',},
             ]}]"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item>
          <div style="margin: 16px auto 0;width: 100px;">
            <a-button type="primary" @click="nextStep">下一步</a-button>
          </div>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  name: 'Step1',
  props: {
    queryonedata: {
      type: Object,
    },
    type: '',
  },
  data() {
    return {
      form: this.$form.createForm(this),
      loading: false,
      type1: '',
      queryonedata1: {},
      isSee: false,
    }
  },
  computed: {},
  watch: {
    queryonedata(val) {
      this.queryonedata1 = val
      this.quweyData()
      if (this.type1 === 'view' || this.type1 === 'examine') {
        this.isSee = true
      }
    },
    type(val) {
      this.type1 = val
    },
  },
  created() {
    this.queryonedata1 = this.queryonedata
    this.type1 = this.type
    if (this.type1 === 'view' || this.type1 === 'examine') {
      this.isSee = true
    }
  },
  mounted() {
    this.quweyData()
    // this.init()
  },
  methods: {
    moment,
    quweyData() {
      console.log(this.queryonedata1)
      let qt = this.queryonedata1 ? this.queryonedata1 : {}
      if (JSON.stringify(qt) != '{}') {
        this.form.setFieldsValue({
          trainName: qt.trainName,
          trainDesc: qt.trainDesc,
        })
      }
    },

    // 点击下一步
    nextStep(status) {
      const that = this
      const {
        form: { validateFields },
      } = this

      console.log(that.type1)
      // 先校验，通过表单校验后，才进入下一步
      validateFields((err, values) => {
        console.log('先校验，通过表单校验后，才进入下一步', values)
        if (that.queryonedata.id) {
          values.id = that.queryonedata.id
        }
        if (!err) {
          that.$emit('nextStep', { ...values })
        }
      })
    },
  },
}
</script>

<style lang="less" scoped>
.col-border {
  padding: 10px 0;
  border-bottom: none;
  min-height: 60px;
  box-sizing: border-box;
}
.col-border ~ .col-border {
  border-left: none;
}
.wdf-form {
  margin-top: 12px;
  padding: 12px;
}
.ant-row.ant-form-item {
  margin-bottom: 0;
}
</style>
