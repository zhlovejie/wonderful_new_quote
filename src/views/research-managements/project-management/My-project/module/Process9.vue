<template>
  <a-form-model ref="ruleForm" :model="form" :rules="rules" class="routine-addform-wrapper-baseInnerData">
    <h4>摸具生产任务单</h4>
    <a-table
      :columns="columns1"
      :dataSource="form.developmentProjectConfPlanModelTaskFiles"
      :pagination="false"
      size="small"
    >
      <div slot="action" slot-scope="text, record, index">
        <a @click="delSee(record.fileUrl)">查看</a>
        <template v-if="!isResults && normalAddForm.status === 9">
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
      <h4>配置方案</h4>
      <tr>
        <td>归档配置</td>
        <td>
          <a-form-model-item ref="confPlanId" prop="confPlanId">
            <a-select :disabled="isResults" style="width: 200px" v-model="form.confPlanId">
              <a-select-option v-for="item in priceQuoted" :key="item.id" :value="item.id">{{
                item.productName
              }}</a-select-option>
            </a-select>
          </a-form-model-item>
        </td>
        <td v-if="form.confPlanId">
          <a @click="ViewSee()">查看</a>
        </td>
        <td>分类</td>
        <td>PROE结构图</td>
      </tr>
    </table>
    <div class="saveOk">
      <a-button type="primary" style="margin-right: 10px" icon="save" v-if="!isResults" @click="validate(0)"
        >保存</a-button
      >
      <a-button type="primary" style="margin-right: 10px" v-if="!isResults" @click="validate(1)">提交审核</a-button>
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
    <StepView ref="StepView" />
    <ToolBoxCommonUploadForm ref="toolBoxCommonUploadForm" @ok="handleSaveOk" />
    <Approval ref="approval" @opinionChange="opinionChange" />
  </a-form-model>
</template>

<script>
import { developmentSaveAndUpdate, approveProjectStageApply } from '@/api/projectManagement'
import { priceQuotedProductList } from '@/api/productOfferManagement'
import XdocView from './XdocView'
import Approval from './Approval'
import ToolBoxCommonUploadForm from './ToolBoxCommonUploadForm'
import StepView from '../../../../product-offer-management/product-options-management/StepView'
import moment from 'moment'
export default {
  inject: ['normalAddForm'],
  components: {
    XdocView,
    ToolBoxCommonUploadForm,
    Approval,
    StepView,
  },
  computed: {
    isResults() {
      //配置方案研发
      return (
        this.normalAddForm.isView ||
        this.normalAddForm.isApproval ||
        (this.normalAddForm.isHandle && this.normalAddForm.status !== 9)
      )
    },
    Conference() {
      return JSON.stringify(this.normalAddForm.developmentData) == '{}'
    },
  },
  data() {
    return {
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
      priceQuoted: [],
      Noshow: false,
      developmentProjectConfPlanModelTaskFiles: {},
      form: {
        developmentProjectConfPlanModelTaskFiles: [],
        confPlanId: undefined,
      },
      queryOneData: {},
      details: {},
      rules: {
        confPlanId: [{ required: true, message: '请选择归档配置' }],
      },
    }
  },
  watch: {
    'normalAddForm.developmentData': function (newVal, oldVal) {
      console.log(newVal, oldVal)
      if (newVal) {
        this.queryOneData = newVal
        this.init()
      }
    },
  },
  created() {
    priceQuotedProductList().then((res) => {
      this.priceQuoted = res.data
    })
  },
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
        that.$nextTick(() => {
          that.details = {
            confPlanId: that.normalAddForm.developmentData.confPlanId,
            developmentProjectConfPlanModelTaskFiles:
              that.normalAddForm.developmentData.developmentProjectConfPlanModelTaskFiles || [],
          }
          that.form = {
            ...that.details,
          }
        })
      }
    },
    moment,
    //查看配置方案
    ViewSee() {
      let that = this
      let react = that.priceQuoted.find((item) => item.id === that.form.confPlanId)
      that.$refs.StepView.query('view', { ...react })
    },
    validate(key) {
      if (this.form.developmentProjectConfPlanModelTaskFiles.length === 0) {
        return this.$message.error('请上摸具生产任务单')
      }
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (!this.Conference) {
            this.form.id = this.normalAddForm.developmentData.id || 0
          }
          this.form.projectId = this.normalAddForm.allInfo.id
          this.form.status = key
          this.form.developmentProjectConfPlanModelTaskFiles = this.form.developmentProjectConfPlanModelTaskFiles
          developmentSaveAndUpdate(this.form)
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
    handleGo() {
      this.$router.go(-1)
    },
    //查看
    delSee(idurl) {
      this.$refs.xdocView.query(idurl)
    },
    handleSaveOk(data) {
      this.form.developmentProjectConfPlanModelTaskFiles.push(data)
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
        that.form.developmentProjectConfPlanModelTaskFiles = that.form.developmentProjectConfPlanModelTaskFiles.filter(
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