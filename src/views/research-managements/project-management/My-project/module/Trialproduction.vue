<template>
  <a-form-model ref="ruleForm" :model="form" :rules="rules" class="routine-addform-wrapper-baseInnerData">
    <table class="custom-table custom-table-border">
      <h3>生产计划</h3>
      <tr>
        <td>小批量生产配置方案属性</td>
        <td style="widht：200px">{{ normalAddForm.TrialData.configure === 1 ? '高配' : ' 标准配置' }}</td>
        <td>小批量生产配置方案</td>
        <td style="widht：200px">
          <a @click="delSee(normalAddForm.TrialData.files[0])">查看</a>
          <a-divider type="vertical" />
          <a target="_blank" v-download="normalAddForm.TrialData.files[0]">下载</a>
        </td>
        <td>小批量生产数量</td>
        <td>
          <a-form-model-item ref="smallBatchNum" prop="smallBatchNum">
            <a-input :disabled="isDisabled" v-model="form.smallBatchNum" :allowClear="true" />
          </a-form-model-item>
        </td>
      </tr>
    </table>
    <div class="saveOk">
      <a-button type="primary" style="margin-right: 10px" icon="save" v-if="!isDisabled" @click="preservation(1)"
        >保存</a-button
      >
      <a-button type="primary" style="margin-right: 10px" v-if="!isDisabled" @click="preservation(2)"
        >提交审核</a-button
      >
      <a-button style="margin-right: 10px" v-if="!isDisabled" @click="handleGo">取消</a-button>
      <a-button key="back" icon="close" style="margin-right: 10px" v-if="normalAddForm.isApproval" @click="noPassAction"
        >不通过</a-button
      >
      <a-button
        v-if="normalAddForm.isApproval"
        key="submit"
        type="primary"
        icon="check"
        :loading="spinning"
        @click="passAction"
        >通过</a-button
      >
    </div>

    <XdocView ref="xdocView" />
    <Approval ref="approval" @opinionChange="opinionChange" />
  </a-form-model>
</template>

<script>
import { smallBatch, approveProjectStageApply } from '@/api/projectManagement'
import XdocView from './XdocView'
import Approval from './Approval'
import moment from 'moment'
export default {
  inject: ['normalAddForm'],
  components: {
    XdocView,
    Approval,
  },
  computed: {
    isDisabled() {
      //设计方案联合评审
      return (
        this.normalAddForm.isView ||
        this.normalAddForm.isApproval ||
        (this.normalAddForm.isHandle && this.normalAddForm.status !== 15)
      )
    },
  },
  data() {
    return {
      spinning: false,
      dataSource: [],
      Noshow: false,
      TrialData: {},
      form: {
        smallBatchNum: undefined,
      },
      queryOneData: {},
      details: {},
      rules: {
        smallBatchNum: [{ required: true, message: '请输入生产数量' }],
      },
    }
  },
  watch: {
    'normalAddForm.TrialData': function (newVal, oldVal) {
      console.log(newVal, oldVal)
      if (newVal) {
        this.queryOneData = newVal
        this.init()
      }
    },
  },
  created() {},
  methods: {
    passAction(opt = {}) {
      this.submitAction(Object.assign({}, { isAdopt: 0, opinion: '通过' }, opt || {}))
    },
    opinionChange(opinion) {
      //审批意见
      this.submitAction({
        isAdopt: 1,
        opinion: opinion,
      })
    },
    noPassAction() {
      let that = this
      that.$refs.approval.query()
    },
    submitAction(opt) {
      let that = this
      let values = Object.assign({}, opt || {}, {
        projectId: that.normalAddForm.record.projectId,
        id: that.normalAddForm.record.id,
        serviceId: that.normalAddForm.record.serviceId,
        stageNum: that.normalAddForm.record.status,
      })
      that.spinning = true
      approveProjectStageApply(values)
        .then((res) => {
          if (res.code === 200) {
            that.$message.info(res.msg)
            that.$router.go(-1)
          } else {
            that.$message.error(res.msg)
          }
        })
        .catch((err) => (that.spinning = false))
    },
    init() {
      const that = this
      if (that.queryOneData) {
        that.$nextTick(() => {
          that.details = {
            smallBatchNum: that.normalAddForm.TrialData.smallBatchNum,
          }
          that.form = {
            ...that.details,
          }
        })
      }
    },
    moment,
    validate() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.TrialData = this.form
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    doAction(type, record) {
      this.$refs.addForm.query(type, record)
    },
    // 设计模块提交审核

    preservation(status) {
      let that = this
      let value = {}
      that.validate()
      if (that.details) {
        value.id = this.normalAddForm.TrialData.id
      }
      value.projectId = that.normalAddForm.allInfo.id
      value.saveType = status
      value.smallBatchNum = that.TrialData.smallBatchNum
      value.propertiesType = that.normalAddForm.TrialData.configure
      smallBatch(value)
        .then((res) => {
          if (res.code === 200) {
            that.$message.info(res.msg)
            that.$router.go(-1)
          } else {
            that.$message.error(res.msg)
          }
        })
        .catch((err) => (that.spinning = false))
    },
    //返回
    handleGo() {
      this.$router.go(-1)
    },
    //查看
    delSee(idurl) {
      this.$refs.xdocView.query(idurl)
    },
  },
}
</script>

<style scoped>
.saveOk {
  margin-top: 20px;
  text-align: center;
}
.routine-addform-wrapper-baseInnerData >>> .ant-form-item {
  display: flex;
  margin: 0;
  margin-top: 13px;
}
.routine-addform-wrapper-baseInnerData >>> .ant-form-item .ant-form-item-label {
  width: auto;
  text-align: left;
}
.routine-addform-wrapper-baseInnerData >>> .ant-form-item .ant-form-item-control-wrapper {
  flex: 1;
}
.custom-table-border th,
.custom-table-border td {
  padding: 5px;
}
.custom-table-border caption {
  text-align: left;
}
.icon-required::before {
  display: inline-block;
  margin-right: 4px;
  color: #f5222d;
  font-size: 14px;
  font-family: SimSun, sans-serif;
  line-height: 1;
  content: '*';
}
</style>