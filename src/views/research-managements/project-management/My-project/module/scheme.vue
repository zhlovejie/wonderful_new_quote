<template>
  <a-form-model ref="ruleForm" :model="form" :rules="rules" class="routine-addform-wrapper-baseInnerData">
    <h4>评审记录</h4>
    <a-table :columns="columns1" :dataSource="form.fileList" :pagination="false" size="small">
      <div slot="action" slot-scope="text, record, index">
        <a @click="delSee(record.fileUrl)">查看</a>
        <template v-if="!isResults && normalAddForm.status === 10">
          <a-divider type="vertical" />
          <a-popconfirm title="确认删除该条数据吗?" @confirm="handleAction('del', record)">
            <a href="javascript:;">删除</a>
          </a-popconfirm>
        </template>
        <a-divider type="vertical" />
        <a target="_blank" v-download="record.fileUrl">下载</a>
      </div>
    </a-table>
    <a-button v-if="!isResults" style="width: 100%" type="dashed" icon="plus" @click="handleAction('add', null)"
      >上传新文件</a-button
    >
    <table class="custom-table custom-table-border">
      <h3></h3>
      <tr>
        <td>评审状态</td>
        <td>
          <a-form-model-item ref="reviewResult" prop="reviewResult">
            <a-radio-group :disabled="isResults" v-model="form.reviewResult" @change="changeClient">
              <a-radio :value="1"> 通过 </a-radio>
              <a-radio :value="2"> 不通过 </a-radio>
            </a-radio-group>
          </a-form-model-item>
        </td>
        <td>归档配置</td>
        <td>
          <a-form-model-item ref="configure" prop="configure">
            <a-select :disabled="isResults" style="width: 200px" v-model="form.configure">
              <a-select-option :value="1">高配 </a-select-option>
              <a-select-option :value="2">标配</a-select-option>
            </a-select>
          </a-form-model-item>
        </td>
        <td>评审备注</td>
        <td>
          <a-form-model-item ref="remark" prop="remark">
            <a-input :disabled="isResults" v-model="form.remark" type="textarea" :allowClear="true" />
          </a-form-model-item>
        </td>
      </tr>
      <tr v-if="Noshow">
        <td>下次评审会议开始时间</td>
        <td>
          <a-form-model-item ref="nextReviewTime" required prop="nextReviewTime">
            <a-date-picker
              :disabled="isResults"
              v-model="form.nextReviewTime"
              show-time
              type="date"
              placeholder="请选择下次评审会议开始时间"
              style="width: 100%"
            />
          </a-form-model-item>
        </td>
        <td>不通过原因</td>
        <td colspan="3">
          <a-form-model-item ref="reason" prop="reason">
            <a-input :disabled="isResults" v-model="form.reason" type="textarea" :allowClear="true" />
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
      <a-button type="primary" style="margin-right: 10px" icon="save" v-if="!isResults && Noshow" @click="validate()"
        >保存</a-button
      >

      <a-button type="primary" style="margin-right: 10px" icon="save" v-if="!isResults && !Noshow" @click="validate()"
        >保存</a-button
      >
      <a-button style="margin-right: 10px" v-if="!isResults" @click="handleGo">取消</a-button>
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
    <ToolBoxCommonUploadForm ref="toolBoxCommonUploadForm" @ok="handleSaveOk" />
    <Approval ref="approval" @opinionChange="opinionChange" />
    <AddForm key="k1" ref="addForm" />
  </a-form-model>
</template>

<script>
import { confPlanReview, approveProjectStageApply } from '@/api/projectManagement'
import XdocView from './XdocView'
import Approval from './Approval'
import AddForm from './AddForm'
import ToolBoxCommonUploadForm from './ToolBoxCommonUploadForm'
import moment from 'moment'
export default {
  inject: ['normalAddForm'],
  components: {
    XdocView,
    ToolBoxCommonUploadForm,
    Approval,
    AddForm,
  },
  computed: {
    isResults() {
      //可行性测试结果评审
      return (
        this.normalAddForm.isView ||
        this.normalAddForm.isApproval ||
        (this.normalAddForm.isHandle && this.normalAddForm.status !== 10)
      )
    },
    Conference() {
      //会议记录显示
      return JSON.stringify(this.normalAddForm.schemeData) == '{}'
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
      columns1: [
        {
          align: 'center',
          title: '文件名称',
          dataIndex: 'fileName',
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
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],
      spinning: false,
      dataSource: [],
      Noshow: false,
      fileList: {},
      form: {
        remark: undefined,
        fileList: [],
        reviewResult: undefined,
        nextReviewTime: undefined,
        reason: undefined,
        configure: undefined,
      },
      queryOneData: {},
      details: {},
      rules: {
        remark: [{ required: true, message: '请输入评审备注' }],
        reviewResult: [{ required: true, message: '请选择联合评审状态' }],
        nextReviewTime: [{ required: true, message: '请选择设计方案联合评审时间' }],
        reason: [{ required: true, message: '不通过原因' }],
        configure: [{ required: true, message: '请选择归档配置' }],
      },
    }
  },
  watch: {
    'normalAddForm.schemeData': function (newVal, oldVal) {
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
          that.$message.info(res.msg)
          that.$router.go(-1)
        })
        .catch((err) => (that.spinning = false))
    },
    init() {
      const that = this
      if (that.queryOneData) {
        that.dataSource = that.normalAddForm.schemeData.hisList
        that.Noshow = that.normalAddForm.schemeData.hisList[0].reviewResult === 2 ? true : false
        that.$nextTick(() => {
          that.details = {
            configure: that.normalAddForm.schemeData.configure,
            remark: that.normalAddForm.schemeData.remark,
            fileList: that.normalAddForm.schemeData.fileList || [],
            reviewResult: that.normalAddForm.schemeData.hisList[0].reviewResult,
            nextReviewTime:
              that.normalAddForm.schemeData.hisList[0].nextReviewTime !== null
                ? moment(that.normalAddForm.schemeData.hisList[0].nextReviewTime)
                : null,
            reason: that.normalAddForm.schemeData.hisList[0].reason,
          }
          that.form = {
            ...that.details,
          }
        })
      }
    },
    moment,
    validate() {
      if (this.form.fileList.length === 0) {
        return this.$message.error('请上传评审文件')
      }
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          //   if (this.details) {
          this.form.id = this.normalAddForm.schemeData.id || 0
          //   }
          this.form.projectId = this.normalAddForm.allInfo.id
          this.form.nextReviewTime =
            this.form.reviewResult === 2 ? moment(this.form.nextReviewTime).format('YYYY-MM-DD hh:mm:ss') : undefined
          this.form.fileList = this.form.fileList.map((i) => {
            return {
              fileName: i.fileName,
              fileUrl: i.fileUrl,
            }
          })
          confPlanReview(this.form)
            .then((res) => {
              if (res.code === 200) {
                this.$message.info(res.msg)
                this.$router.go(-1)
              } else {
                this.$message.error(res.msg)
              }
            })
            .catch((err) => (this.spinning = false))
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

    // preservation(status) {
    //   let that = this
    //   let value = {}
    //   that.validate()
    //   if (that.details) {
    //     value.id = this.normalAddForm.schemeData.id
    //   }
    //   //   value.projectId = that.normalAddForm.allInfo.id
    //   //   value.status = status
    //   //   value.remark = that.fileList.remark
    //   //   delete that.fileList.remark
    // },
    handleGo() {
      this.$router.go(-1)
    },
    //查看
    delSee(idurl) {
      this.$refs.xdocView.query(idurl)
    },
    handleSaveOk(data) {
      this.form.fileList.push(data)
    },
    changeClient(e) {
      this.Noshow = e.target.value === 2 ? true : false
      this.$refs.reviewResult.onFieldChange()
    },
    handleAction(type, record) {
      const that = this
      if (['add'].includes(type)) {
        that.$refs.toolBoxCommonUploadForm.query(type, record)
      } else if (type === 'del') {
        that.form.fileList = that.form.fileList.filter((item) => item.fileName !== record.fileName)
      }
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