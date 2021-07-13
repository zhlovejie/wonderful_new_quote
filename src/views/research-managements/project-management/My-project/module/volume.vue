<template>
  <a-form-model ref="ruleForm" :model="form" :rules="rules" class="routine-addform-wrapper-baseInnerData">
    <table class="custom-table custom-table-border">
      <h3></h3>
      <tr>
        <td>进入批量生产阶段</td>
        <td>
          <a-form-model-item ref="showFlag" prop="showFlag">
            <a-radio-group :disabled="isDisabled" v-model="form.showFlag">
              <a-radio :value="1"> 通过 </a-radio>
              <a-radio :value="0"> 不通过 </a-radio>
            </a-radio-group>
          </a-form-model-item>
        </td>
      </tr>
    </table>

    <div class="saveOk">
      <a-button style="margin-right: 10px" type="primary" v-if="!isDisabled" @click="validate()">提交审核</a-button>
      <a-button v-if="!isDisabled" @click="handleGo">取消</a-button>
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
    <Approval ref="approval" @opinionChange="opinionChange" />
  </a-form-model>
</template>

<script>
import { batch, approveProjectStageApply } from '@/api/projectManagement'
import Approval from './Approval'
import moment from 'moment'
export default {
  inject: ['normalAddForm'],
  components: {
    Approval,
  },
  computed: {
    isDisabled() {
      //设计方案联合评审
      return (
        this.normalAddForm.isView ||
        this.normalAddForm.isApproval ||
        (this.normalAddForm.isHandle && this.normalAddForm.status !== 18)
      )
    },
  },
  data() {
    return {
      spinning: false,
      dataSource: [],
      Noshow: false,
      form: {
        showFlag: undefined,
      },
      queryOneData: {},
      details: {},
      rules: {
        showFlag: [{ required: true, message: '请选择联合评审状态' }],
      },
    }
  },
  watch: {
    'normalAddForm.volumeData': function (newVal, oldVal) {
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
      let that = this
      if (that.queryOneData) {
        that.$nextTick(() => {
          that.details = {
            showFlag: that.normalAddForm.volumeData.showFlag,
          }
          that.form = {
            ...that.details,
          }
        })
      }
    },
    moment,
    validate() {
      let that = this
      that.$refs.ruleForm.validate((valid) => {
        if (valid) {
          that.form.projectId = that.normalAddForm.allInfo.id
          batch(that.form)
            .then((res) => {
              if (res.code === 200) {
                that.$message.info(res.msg)
                that.$router.go(-1)
              } else {
                that.$message.error(res.msg)
              }
            })
            .catch((err) => (that.spinning = false))
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    doAction(type, record) {
      this.$refs.addForm.query(type, record)
    },
    //返回
    handleGo() {
      this.$router.go(-1)
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