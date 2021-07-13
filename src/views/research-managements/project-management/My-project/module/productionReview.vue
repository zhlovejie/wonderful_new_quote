<template>
  <a-form-model ref="ruleForm" :model="form" :rules="rules" class="routine-addform-wrapper-baseInnerData">
    <table class="custom-table custom-table-border">
      <h3>评审记录</h3>
      <tr>
        <td>小批量实际生产完成时间</td>
        <td>
          <a-form-model-item ref="finishTime" required prop="finishTime">
            <a-date-picker
              :disabled="isDisabled"
              v-model="form.finishTime"
              type="date"
              placeholder="请选择小批量实际生产完成时间"
              style="width: 100%"
            />
          </a-form-model-item>
        </td>
        <td>生产难点/改进点</td>
        <td>
          <a-form-model-item ref="difculty" prop="difculty">
            <a-input :disabled="isDisabled" v-model="form.difculty" type="textarea" :allowClear="true" />
          </a-form-model-item>
        </td>
      </tr>
      <tr>
        <td>评审结果</td>
        <td colspan="3">
          <a-form-model-item ref="reviewResult" prop="reviewResult">
            <a-radio-group :disabled="isDisabled" v-model="form.reviewResult" @change="changeClient">
              <a-radio :value="1"> 通过 </a-radio>
              <a-radio :value="2"> 不通过 </a-radio>
            </a-radio-group>
          </a-form-model-item>
        </td>
      </tr>
      <tr v-if="Noshow">
        <td>下次评审会议时间</td>
        <td>
          <a-form-model-item ref="nextReviewTime" required prop="nextReviewTime">
            <a-date-picker
              :disabled="isDisabled"
              v-model="form.nextReviewTime"
              show-time
              type="date"
              placeholder="请选择设计联合评审时间"
              style="width: 100%"
            />
          </a-form-model-item>
        </td>
        <td>不通过原因</td>
        <td>
          <a-form-model-item ref="reason" prop="reason">
            <a-input :disabled="isDisabled" v-model="form.reason" type="textarea" :allowClear="true" />
          </a-form-model-item>
        </td>
      </tr>
    </table>
    <div v-if="!Conference" style="margin-top: 20px">
      <h4>评审记录</h4>
      <a-table :columns="columns" :dataSource="dataSource" :pagination="false" size="small">
        <div slot="reviewResult" slot-scope="text, record, index">
          <span v-if="record.reviewResult === 1" style="color: green">通过</span>
          <span v-else style="color: red">不通过</span>
        </div>
        <div slot="nextMeetingCode" slot-scope="text, record, index">
          <a @click="doAction('view', record)">查看</a>
        </div>
      </a-table>
    </div>
    <div class="saveOk">
      <a-button type="primary" style="margin-right: 10px" icon="save" v-if="!isDisabled" @click="validate()"
        >保存</a-button
      >
      <!-- <a-button type="primary" v-if="!isDisabled && !Noshow" @click="validate">提交审核</a-button> -->
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
    <!-- <Approval ref="approval" @opinionChange="opinionChange" /> -->
    <AddForm key="k1" ref="addForm" />
  </a-form-model>
</template>

<script>
import { smallBatchReview, approveProjectStageApply } from '@/api/projectManagement'
import XdocView from './XdocView'
// import Approval from './Approval'
import AddForm from './AddForm'
import moment from 'moment'
export default {
  inject: ['normalAddForm'],
  components: {
    XdocView,
    // Approval,
    AddForm,
  },
  computed: {
    isDisabled() {
      //设计方案联合评审
      return (
        this.normalAddForm.isView ||
        this.normalAddForm.isApproval ||
        (this.normalAddForm.isHandle && this.normalAddForm.status !== 16)
      )
    },
    Conference() {
      //会议记录显示
      return JSON.stringify(this.normalAddForm.reviewData) == '{}'
    },
  },
  data() {
    return {
      columns: [
        {
          align: 'center',
          title: '评审状态',
          dataIndex: 'reviewResult',
          scopedSlots: { customRender: 'reviewResult' },
        },
        {
          align: 'center',
          title: '原因',
          dataIndex: 'reason',
        },
        {
          align: 'center',
          title: '提交人',
          dataIndex: 'createdName',
        },
        {
          align: 'center',
          title: '提交时间',
          dataIndex: 'createdTime',
        },
        {
          align: 'center',
          title: '下次评审时间',
          dataIndex: 'nextReviewTime',
        },
        {
          align: 'center',
          title: '会议记录',
          dataIndex: 'nextMeetingCode',
          scopedSlots: { customRender: 'nextMeetingCode' },
        },
      ],
      spinning: false,
      dataSource: [],
      Noshow: false,
      reviewData: {},
      form: {
        finishTime: undefined,
        difculty: undefined,
        reviewResult: undefined,
        nextReviewTime: undefined,
        reason: undefined,
      },
      queryOneData: {},
      details: {},
      rules: {
        difculty: [{ required: true, message: '请输入生产难点/改进点' }],
        reviewResult: [{ required: true, message: '请选择评审结果' }],
        nextReviewTime: [{ required: true, message: '请选择下次评审会议时间' }],
        reason: [{ required: true, message: '不通过原因' }],
        finishTime: [{ required: true, message: '请选择小批量实际完成时间' }],
      },
    }
  },
  watch: {
    'normalAddForm.reviewData': function (newVal, oldVal) {
      console.log(newVal, oldVal)
      if (newVal) {
        this.queryOneData = newVal
        this.init()
      }
    },
  },
  created() {},
  methods: {
    init() {
      let that = this
      if (that.queryOneData) {
        that.dataSource = that.normalAddForm.reviewData.hisList
        that.Noshow = that.normalAddForm.reviewData.hisList[0].reviewResult === 2 ? true : false
        that.$nextTick(() => {
          that.details = {
            difculty: that.normalAddForm.reviewData.difculty,
            reviewResult: that.normalAddForm.reviewData.hisList[0].reviewResult,
            finishTime: moment(that.normalAddForm.reviewData.finishTime),
            nextReviewTime:
              that.normalAddForm.reviewData.hisList[0].nextReviewTime !== null
                ? moment(that.normalAddForm.reviewData.hisList[0].nextReviewTime)
                : null,
            reason: that.normalAddForm.reviewData.hisList[0].reason,
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
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          that.form.id = that.normalAddForm.reviewData.id || 0
          that.form.projectId = that.normalAddForm.allInfo.id
          that.form.nextReviewTime =
            that.form.reviewResult === 2 ? moment(that.form.nextReviewTime).format('YYYY-MM-DD HH:mm:ss') : undefined
          that.form.finishTime = moment(that.form.finishTime).format('YYYY-MM-DD')
          smallBatchReview(that.form)
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
    //查看
    delSee(idurl) {
      this.$refs.xdocView.query(idurl)
    },
    changeClient(e) {
      this.Noshow = e.target.value === 2 ? true : false
      this.$refs.reviewResult.onFieldChange()
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