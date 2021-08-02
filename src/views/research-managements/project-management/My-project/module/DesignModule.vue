<template>
  <a-form-model ref="ruleForm" :model="form" class="routine-addform-wrapper-baseInnerData">
    <h4>设计资料</h4>
    <a-table :columns="columns1" :dataSource="form.DesignDataHisFiles" :pagination="false" size="small">
      <div slot="action" slot-scope="text, record, index">
        <template v-if="normalAddForm.isApproval || normalAddForm.isView || record.author.findAuthority === 1">
          <a @click="delSee(record.fileUrl)">查看</a>
          <a-divider type="vertical" />
          <a target="_blank" v-download="record.fileUrl">下载</a>
        </template>

        <template v-if="!isDisabled && normalAddForm.status === 12 && record.author.removeAuthority === 1">
          <a-divider type="vertical" />
          <a-popconfirm title="确认删除该条数据吗?" @confirm="handleAction('del', record)">
            <a href="javascript:;">删除</a>
          </a-popconfirm>
        </template>
        <template v-if="!normalAddForm.isApproval && record.author.updateAuthority === 1">
          <a-divider type="vertical" />
          <a @click="handleAction('edit', record)">修改</a>
        </template>
        <template v-if="!normalAddForm.isApproval && record.author.uploadAuthority === 1">
          <a-divider type="vertical" />
          <a @click="handleAction('add', record)">上传</a>
        </template>
      </div>
    </a-table>
    <div class="saveOk">
      <a-button
        type="primary"
        style="margin-right: 10px"
        v-if="
          !isDisabled &&
          !Noshow &&
          normalAddForm.DesignData[0].approveStatus === 1 &&
          normalAddForm.DesignData[0].author.uploadAuthority === 1
        "
        @click="preservation()"
        >提交审核</a-button
      >

      <a-button
        type="primary"
        style="margin-right: 10px"
        v-if="isDesign && trainer && istrain && canTraining"
        @click="training()"
        >发起培训</a-button
      >
      <a-button
        type="primary"
        style="margin-right: 10px"
        v-if="isDesign && trainer && istrain && !canTraining"
        @click="Endtraining()"
        >结束培训</a-button
      >
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
    <div v-if="!Conference" style="margin-top: 20px">
      <h4>培训记录</h4>
      <a-table :columns="columns" :dataSource="dataSource" :pagination="false" size="small">
        <div slot="nextMeetingCode" slot-scope="text, record, index">
          <a @click="doAction('view', record)">查看</a>
        </div>
      </a-table>
    </div>

    <XdocView ref="xdocView" />
    <ToolBoxCommonUploadForm ref="toolBoxCommonUploadForm" @ok="handleSaveOk" />
    <Approval ref="approval" @opinionChange="opinionChange" />
    <AddForm key="k1" ref="addForm" />
  </a-form-model>
</template>

<script>
import {
  submitToAudit,
  approveProjectStageApply,
  fileDesignDivConfDelete,
  submitTolist,
  startTrainings,
  finishTrainings,
} from '@/api/projectManagement'
import XdocView from './XdocView'
import Approval from './Approval'
import AddForm from './AddForm'
import ToolBoxCommonUploadForm from './ToolBoxCommon'
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
    isDisabled() {
      //设计方案联合评审
      return (
        this.normalAddForm.isView ||
        this.normalAddForm.isApproval ||
        (this.normalAddForm.isHandle && this.normalAddForm.status !== 12)
      )
    },
    isDesign() {
      return this.normalAddForm.isDesign
    },
    Conference() {
      //会议记录显示
      return this.dataSource.length === 0 && this.normalAddForm.isApproval
    },

    istrain() {
      return (this.dataSource.length === 0 && this.canTraining !== false) || this.dataSource.length !== 0
    },
  },
  data() {
    return {
      columns: [
        {
          align: 'center',
          title: '发起人',
          dataIndex: 'createdName',
        },
        {
          align: 'center',
          title: '发起时间',
          dataIndex: 'createdTime',
        },
        {
          align: 'center',
          title: '结束时间',
          dataIndex: 'endTime',
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
          title: '名称',
          dataIndex: 'fileDicName',
        },
        {
          align: 'center',
          title: '文件名称',
          dataIndex: 'fileName',
        },
        {
          align: 'center',
          title: '提交人',
          dataIndex: 'fileCreatedName',
        },
        {
          align: 'center',
          title: '提交时间',
          dataIndex: 'fileCreatedTime',
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
      DesignData: {},
      trainer: undefined,
      userInfo: this.$store.getters.userInfo, // 当前登录人
      form: {
        DesignDataHisFiles: [],
      },
      queryOneData: {},
      details: {},
      canTraining: undefined,
    }
  },
  watch: {
    'normalAddForm.DesignData': function (newVal, oldVal) {
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
        submitTolist({ projectId: that.normalAddForm.allInfo.id }).then((res) => {
          that.dataSource = res.data.list
          that.canTraining = res.data.canTraining
          that.trainer = res.data.trainer
        })
        that.$nextTick(() => {
          that.details = {
            DesignDataHisFiles: that.normalAddForm.DesignData,
          }
          that.form = {
            ...that.details,
          }
        })
      }
    },
    moment,
    handleSaveOk() {
      this.$emit('ok')
    },
    //发起培训
    training() {
      let that = this
      startTrainings(`projectId=${that.normalAddForm.allInfo.id}`)
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
    //结束培训
    Endtraining() {
      let that = this
      finishTrainings(`projectId=${that.normalAddForm.allInfo.id}`)
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

    doAction(type, record) {
      this.$refs.addForm.query(type, record)
    },

    preservation() {
      let that = this
      submitToAudit(`projectId=${that.normalAddForm.allInfo.id}`)
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

    handleAction(type, record) {
      const that = this
      if (['add', 'edit'].includes(type)) {
        that.$refs.toolBoxCommonUploadForm.query(type, record)
      } else if (type === 'del') {
        let that = this
        fileDesignDivConfDelete({ id: record.id }).then((res) => {
          if (res.code === 200) {
            this.handleSaveOk()
            that.$message.info(res.msg)
          } else {
            that.$message.error(res.msg)
          }
        })
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