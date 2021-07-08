<template>
  <a-form-model ref="ruleForm" :model="form" :rules="rules" class="routine-addform-wrapper-baseInnerData">
    <h4 style="float：left;    display: inline-block;">测试内容</h4>
    <div class="action-wrapper" style="float: right;margin-bottom：10px ;">
      <template v-if="isFeasibility">
        <a-button type="link" @click="downloadAction">下载测试报告</a-button>
      </template>
    </div>
    <a-table
      :columns="columns1"
      :dataSource="form.developmentProjectStabilityTestResults"
      :pagination="false"
      size="small"
    >
      <div slot="action" slot-scope="text, record, index">
        <template v-if="!isFeasibility && normalAddForm.status === 7">
          <a-popconfirm title="确认删除该条数据吗?" @confirm="handleAction('del', record)">
            <a href="javascript:;">删除</a>
          </a-popconfirm>
        </template>
      </div>
    </a-table>
    <a-button v-if="!isFeasibility" style="width: 100%" type="dashed" icon="plus" @click="handleAction('add', null)"
      >新增测试项</a-button
    >
    <table class="custom-table custom-table-border">
      <h4>测试时间</h4>
      <tr>
        <td>测试开始时间</td>
        <td>
          <a-form-model-item ref="beginTime" required prop="beginTime">
            <a-date-picker
              :disabled="isFeasibility"
              v-model="form.beginTime"
              show-time
              type="date"
              placeholder="请选择设计联合评审时间"
              style="width: 100%"
            />
          </a-form-model-item>
        </td>
        <td>测试周期（天）</td>
        <td>
          <a-form-model-item ref="period" prop="period">
            <a-input :disabled="isFeasibility" v-model="form.period" :allowClear="true" />
          </a-form-model-item>
        </td>
      </tr>
      <tr>
        <td>测试内容备注</td>
        <td colspan="3">
          <a-form-model-item ref="contentRemark" prop="contentRemark">
            <a-input :disabled="isFeasibility" v-model="form.contentRemark" type="textarea" :allowClear="true" />
          </a-form-model-item>
        </td>
      </tr>
    </table>
    <div v-if="testResultsDow" style="margin-top: 20px">
      <h4 style="float：left;    display: inline-block;">测试结果</h4>
      <div class="action-wrapper" style="float: right;margin-bottom：10px ;">
        <template v-if="testResultsDownload">
          <a-button type="link" @click="downloadAction">下载测试结果报告</a-button>
        </template>
      </div>
      <a-table
        :columns="columns"
        :dataSource="form.developmentProjectStabilityTestResults"
        :pagination="false"
        size="small"
      >
        <div slot="testResult" slot-scope="text, record, index">
          <a-form-model-item
            ref="record.testResult"
            :prop="'developmentProjectStabilityTestResults.' + index + '.testResult'"
            :rules="{
              required: true,
              message: '请选择是否通过',
            }"
          >
            <a-radio-group :disabled="!testResults" v-model="record.testResult">
              <a-radio :value="1"> 通过 </a-radio>
              <a-radio :value="0"> 不通过 </a-radio>
            </a-radio-group>
          </a-form-model-item>
        </div>
      </a-table>
      <table class="custom-table custom-table-border">
        <h4></h4>
        <tr></tr>
        <tr>
          <td>项目总结</td>
          <td>
            <a-form-model-item ref="summary" prop="summary">
              <a-input :disabled="!testResults" v-model="form.summary" type="textarea" :allowClear="true" />
            </a-form-model-item>
          </td>
          <td>测试结果备注</td>
          <td>
            <a-form-model-item ref="resultRemark" prop="resultRemark">
              <a-input :disabled="!testResults" v-model="form.resultRemark" type="textarea" :allowClear="true" />
            </a-form-model-item>
          </td>
        </tr>
      </table>
    </div>
    <div class="saveOk">
      <a-button type="primary" style="margin-right: 10px" icon="save" v-if="testResults" @click="resultsTest"
        >保存</a-button
      >
      <a-button v-if="testResults" @click="handleGo()">取消</a-button>
      <a-button type="primary" style="margin-right: 10px" icon="save" v-if="!isFeasibility" @click="preservation(0)"
        >保存</a-button
      >
      <a-button style="margin-right: 10px" type="primary" v-if="!isFeasibility" @click="preservation(1)"
        >提交审核</a-button
      >
      <a-button v-if="!isFeasibility" @click="handleGo()">取消</a-button>

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
    <FeasibilityForm ref="feasibilityForm" @ok="handleSaveOk" />
    <Approval ref="approval" @opinionChange="opinionChange" />
  </a-form-model>
</template>

<script>
import {
  stabilitySaveAndUpdate,
  approveProjectStageApply,
  savaExportExcel,
  stabilityupdateTestesult,
} from '@/api/projectManagement'
import XdocView from './XdocView'
import Approval from './Approval'
import FeasibilityForm from './FeasibilityForm'
import moment from 'moment'
export default {
  inject: ['normalAddForm'],
  components: {
    XdocView,
    FeasibilityForm,
    Approval,
  },
  computed: {
    isFeasibility() {
      //稳定性测试
      return (
        this.normalAddForm.isView ||
        this.normalAddForm.isApproval ||
        (this.normalAddForm.isHandle && this.normalAddForm.status !== 7) ||
        (this.normalAddForm.status === 7 && this.normalAddForm.schemeData.status === 2)
      )
    },
    //稳定性测试测试结果显示问题
    testResults() {
      return (
        this.normalAddForm.isHandle && this.normalAddForm.status === 7 && this.normalAddForm.schemeData.status === 2
      )
    },
    //稳定性测试结果下载显示
    testResultsDownload() {
      return (
        (this.normalAddForm.isView && this.normalAddForm.schemeData.status === 2) ||
        (this.normalAddForm.isHandle && this.normalAddForm.status !== 7 && this.normalAddForm.schemeData.status === 2)
      )
    },
    //稳定性测试结果显示
    testResultsDow() {
      return (
        (this.normalAddForm.isView && this.normalAddForm.schemeData.status === 2) ||
        (this.normalAddForm.isHandle && this.normalAddForm.status === 7 && this.normalAddForm.schemeData.status === 2)
      )
    },
  },
  data() {
    return {
      columns: [
        {
          align: 'center',
          title: '测试项名称',
          dataIndex: 'testItemName',
        },
        {
          align: 'center',
          title: '测试方法',
          dataIndex: 'testMethod',
        },
        {
          align: 'center',
          title: '测试合格标准',
          dataIndex: 'qualifiedStandard',
        },
        {
          align: 'center',
          title: '测试次数',
          dataIndex: 'testNum',
        },
        {
          align: 'center',
          title: '测试结果',
          dataIndex: 'testResult',
          scopedSlots: { customRender: 'testResult' },
        },
        ,
      ],
      columns1: [
        {
          align: 'center',
          title: '测试项名称',
          dataIndex: 'testItemName',
        },
        {
          align: 'center',
          title: '测试方法',
          dataIndex: 'testMethod',
        },
        {
          align: 'center',
          title: '测试合格标准',
          dataIndex: 'qualifiedStandard',
        },
        {
          align: 'center',
          title: '测试次数',
          dataIndex: 'testNum',
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
      FeasibilityTest: {},
      form: {
        period: undefined,
        developmentProjectStabilityTestResults: [],
        beginTime: undefined,
        contentRemark: undefined,
        resultRemark: undefined,
        summary: undefined,
      },
      queryOneData: {},
      details: {},
      rules: {
        period: [{ required: true, message: '请输入测试周期（天）' }],
        beginTime: [{ required: true, message: '请选择测试开始时间' }],
        contentRemark: [{ required: true, message: '请输入测试内容备注' }],
        summary: [{ required: true, message: '请输入项目总结' }],
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
    resultsTest() {
      let that = this
      let value = {}
      that.validate()
      value.id = that.normalAddForm.schemeData.id
      value.projectId = that.normalAddForm.allInfo.id
      value.developmentProjectStabilityTestResults = that.form.developmentProjectStabilityTestResults
      value.resultRemark = that.form.resultRemark
      value.summary = that.form.summary
      stabilityupdateTestesult(value)
        .then((res) => {
          if (res.code === 200) {
            that.$message.info(res.msg)
            that.$router.go(-1)
          }
        })
        .catch((err) => (that.spinning = false))
    },

    downloadAction() {
      let that = this
      that.spinning = true
      savaExportExcel({ testId: that.normalAddForm.schemeData.id })
        .then((res) => {
          that.spinning = false
          console.log(res)
          if (res instanceof Blob) {
            const isFile = res.type === 'application/vnd.ms-excel'
            const isJson = res.type === 'application/json'
            if (isFile) {
              //返回文件 则下载
              const objectUrl = URL.createObjectURL(res)
              const a = document.createElement('a')
              document.body.appendChild(a)
              a.style = 'display: none'
              a.href = objectUrl
              a.download = `测试结果.xls`
              a.click()
              document.body.removeChild(a)
              that.$message.info('下载成功')
              return
            } else if (isJson) {
              //返回json处理
              var reader = new FileReader()
              reader.onload = function (e) {
                let _res = null
                try {
                  _res = JSON.parse(e.target.result)
                } catch (err) {
                  _res = null
                }
                if (_res !== null) {
                  if (_res.code !== 0) {
                    that.$message.info(_res.message)
                  } else {
                    that.$message.info('下载成功')
                  }
                } else {
                  that.$message.info('json解析出错 e.target.result：' + e.target.result)
                  return
                }
              }
              reader.readAsText(res)
            } else {
              that.$message.info('不支持的类型:' + res)
            }
          }
        })
        .catch((err) => (that.spinning = true))
    },
    handleGo() {
      this.$router.go(-1)
    },
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
        that.dataSource = that.normalAddForm.schemeData.developmentProjectStabilityTestResults
        that.$nextTick(() => {
          that.details = {
            period: that.normalAddForm.schemeData.period,
            developmentProjectStabilityTestResults:
              that.normalAddForm.schemeData.developmentProjectStabilityTestResults || [],
            beginTime:
              that.normalAddForm.schemeData.beginTime !== null ? moment(that.normalAddForm.schemeData.beginTime) : null,
            contentRemark: that.normalAddForm.schemeData.contentRemark,
            summary: that.normalAddForm.schemeData.summary,
            resultRemark: that.normalAddForm.schemeData.resultRemark,
          }
          that.form = {
            ...that.details,
          }
        })
      }
    },
    moment,
    validate() {
      if (this.form.developmentProjectStabilityTestResults.length === 0) {
        return this.$message.error('请上传评审文件')
      }
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.FeasibilityTest = this.form
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 设计模块提交审核

    preservation(status) {
      let that = this
      let value = {}
      that.validate()
      if (that.details) {
        value.id = this.normalAddForm.schemeData.id
      }
      value.projectId = that.normalAddForm.allInfo.id
      value.status = status
      value.period = that.FeasibilityTest.period
      value.beginTime = moment(that.FeasibilityTest.beginTime).format('YYYY-MM-DD hh:mm:ss')
      value.developmentProjectStabilityTestResults = that.FeasibilityTest.developmentProjectStabilityTestResults
      value.contentRemark = that.FeasibilityTest.contentRemark
      stabilitySaveAndUpdate(value)
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
    handleSaveOk(data) {
      console.log(data)
      let that = this
      that.form.developmentProjectStabilityTestResults.push(data)
    },
    handleAction(type, record) {
      const that = this
      if (['add'].includes(type)) {
        that.$refs.feasibilityForm.query(type, record)
      } else if (type === 'del') {
        that.form.developmentProjectStabilityTestResults = that.form.developmentProjectStabilityTestResults.filter(
          (item) => item.fileName !== record.fileName
        )
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