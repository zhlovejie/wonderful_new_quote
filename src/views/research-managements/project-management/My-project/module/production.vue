<template>
  <a-form-model ref="ruleForm" :model="form" class="routine-addform-wrapper-baseInnerData">
    <h4>产品试制资料(难点及改进)</h4>
    <a-table
      :columns="columns1"
      :dataSource="form.developmentProjectProductTrialImproves"
      :pagination="false"
      size="small"
    >
      <div slot="action" slot-scope="text, record, index">
        <a @click="delSee(record.fileUrl)">查看</a>
        <template v-if="!isproduction && normalAddForm.status === 4">
          <a-divider type="vertical" />
          <a-popconfirm title="确认删除该条数据吗?" @confirm="handleAction('del', record)">
            <a href="javascript:;">删除</a>
          </a-popconfirm>
        </template>
        <a-divider type="vertical" />
        <a target="_blank" v-download="record.fileUrl">下载</a>
      </div>
    </a-table>
    <a-button v-if="!isproduction" style="width: 100%" type="dashed" icon="plus" @click="handleAction('add', null)"
      >上传新文件</a-button
    >
    <table class="custom-table custom-table-border">
      <h3></h3>
      <tr>
        <td>产品试制任务单</td>
        <td>
          <a @click="delSee(normalAddForm.ProductTrial.taskUrl)">查看</a>
          <a-divider type="vertical" />
          <a target="_blank" v-download="normalAddForm.ProductTrial.taskUrl">下载</a>
        </td>
      </tr>
    </table>
    <div class="saveOk">
      <a-button type="primary" style="margin-right: 10px" icon="save" v-if="!isproduction" @click="validate"
        >保存</a-button
      >
      <a-button v-if="!isproduction && !Noshow" @click="handleGo">取消</a-button>
    </div>

    <XdocView ref="xdocView" />
    <ToolBoxCommonUploadForm ref="toolBoxCommonUploadForm" @ok="handleSaveOk" />
  </a-form-model>
</template>

<script>
import { getDealEverySaveTrial } from '@/api/projectManagement'
import XdocView from './XdocView'
import ToolBoxCommonUploadForm from './ToolBoxCommonUploadForm'
export default {
  inject: ['normalAddForm'],
  components: {
    XdocView,
    ToolBoxCommonUploadForm,
  },
  computed: {
    isproduction() {
      //产品试制
      return (
        this.normalAddForm.isView ||
        this.normalAddForm.isApproval ||
        (this.normalAddForm.isHandle && this.normalAddForm.status !== 4)
      )
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
      Noshow: false,
      developmentProjectDesignReview: {},
      form: {
        developmentProjectProductTrialImproves: [],
      },
      queryOneData: {},
      details: {},
    }
  },
  watch: {
    'normalAddForm.ProductTrial': function (newVal, oldVal) {
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
        console.log(that.normalAddForm.ProductTrial.developmentProjectProductTrialImproveVos)
        that.$nextTick(() => {
          that.details = {
            developmentProjectProductTrialImproves:
              that.normalAddForm.ProductTrial.developmentProjectProductTrialImproveVos || [],
          }
          that.form = {
            ...that.details,
          }
        })
      }
    },
    handleGo() {
      this.$router.go(-1)
    },
    validate() {
      let that = this
      if (this.form.developmentProjectProductTrialImproves.length === 0) {
        return this.$message.error('请上传产品试制资料')
      }
      let value = {
        developmentProjectProductTrialImproves: that.form.developmentProjectProductTrialImproves,
        projectId: that.normalAddForm.ProductTrial.projectId,
        id: that.normalAddForm.ProductTrial.id,
      }
      getDealEverySaveTrial(value)
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

    // preservation(status) {
    //   let that = this
    //   let value = {}
    //   that.validate()
    //   if (that.details) {
    //     value.id = this.normalAddForm.developmentProjectDesignReview.id
    //   }
    //   value.projectId = that.normalAddForm.allInfo.id
    //   value.status = status
    //   value.remark = that.developmentProjectDesignReview.remark
    //   delete that.developmentProjectDesignReview.remark
    //   that.developmentProjectDesignReview.nextReviewTime =
    //     that.developmentProjectDesignReview.passStatus === '0'
    //       ? moment(that.developmentProjectDesignReview.nextReviewTime).format('YYYY-MM-DD hh-mm-ss')
    //       : undefined
    //   value.developmentProjectDesignReviewHis = that.developmentProjectDesignReview

    // },
    //查看
    delSee(idurl) {
      this.$refs.xdocView.query(idurl)
    },
    handleSaveOk(data) {
      this.form.developmentProjectProductTrialImproves.push(data)
    },
    // changeClient(e) {
    //   this.Noshow = e.target.value === '0' ? true : false
    //   this.$refs.passStatus.onFieldChange()
    // },
    handleAction(type, record) {
      const that = this
      if (['add'].includes(type)) {
        that.$refs.toolBoxCommonUploadForm.query(type, record)
      } else if (type === 'del') {
        that.form.developmentProjectProductTrialImproves = that.form.developmentProjectProductTrialImproves.filter(
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