<template>
  <a-modal
    :title="modalTitle"
    :width="900"
    :visible="visible"
    :footer="footer"
    @cancel="handleCancel"
    :maskClosable="false"
    :destroyOnClose="true"
  >
    <a-spin :spinning="spinning">
      <a-form-model ref="ruleForm" :model="form" :rules="rules">
        <h3>基本信息</h3>
        <table class="custom-table custom-table-border">
          <tr>
            <td>项目编号/项目名称</td>
            <td style="width: 250px">
              <a-form-model-item prop="projectId">
                <a-select v-model="form.projectId" placeholder="选择编号/项目名称" :disabled="isDisabled">
                  <a-select-option v-for="item in workshop" :key="item.id" :value="item.id"
                    >{{ item.projectCode }}({{ item.projectName }})</a-select-option
                  >
                </a-select>
              </a-form-model-item>
            </td>
            <td>专利名称</td>
            <td>
              <a-form-model-item ref="patentName" prop="patentName">
                <a-input
                  :disabled="isDisabled"
                  placeholder="专利名称"
                  v-model="form.patentName"
                  @blur="
                    () => {
                      $refs.patentName.onFieldBlur()
                    }
                  "
                />
              </a-form-model-item>
            </td>
          </tr>
        </table>
      </a-form-model>
      <div class="description-document-search-wrapper">
        <a-form layout="inline">
          <a-form-item>
            <h3>相关文件</h3>
          </a-form-item>
          <div class="action-wrapper" style="float: right;margin-bottom：10px">
            <a-form-item v-if="actionType !== 'view'">
              <template>
                <a-button type="primary" icon="plus" @click="handleAction('add', null)">新增</a-button>
              </template>
            </a-form-item>
          </div>
        </a-form>
      </div>
      <table class="custom-table custom-table-border">
        <tr>
          <th>序号</th>
          <th>文件名称</th>
          <th>操作</th>
        </tr>
        <tr v-for="(item, index) in fileManagement" :key="item.index">
          <td>{{ index + 1 }}</td>
          <td>{{ item.fileName }}</td>
          <td>
            <a @click="delSee(item.fileUrl)">查看</a>
            <template v-if="!isView">
              <a-divider type="vertical" />
              <a-popconfirm title="确认删除该条数据吗?" @confirm="handleAction('del', item)">
                <a href="javascript:;">删除</a>
              </a-popconfirm>
            </template>
            <a-divider type="vertical" />
            <a target="_blank" v-download="item.fileUrl">下载</a>
          </td>
        </tr>
      </table>
      <XdocView ref="xdocView" />
      <ToolBoxCommonUploadForm ref="toolBoxCommonUploadForm" @ok="handleSaveOk" />
    </a-spin>
  </a-modal>
</template>

<script>
import { pageDevelopmentCraftSave, listProjectAllInfoDropDown, listProjectgetDetail } from '@/api/projectManagement'
import XdocView from './XdocView'
import ToolBoxCommonUploadForm from './ToolBoxCommonUploadForm'
export default {
  name: 'product-process-management_workshop-management-addForm',
  components: {
    XdocView,
    ToolBoxCommonUploadForm,
  },
  data() {
    return {
      visible: false,
      workshop: [],
      fileManagement: [],
      processCode: undefined,
      actionType: 'view',
      spinning: false,
      detail: {},
      form: {
        projectId: undefined,
        patentName: undefined,
      },
      rules: {
        projectId: [{ required: true, message: '请选择项目编码/项目名称', trigger: 'change' }],
        patentName: [{ required: true, message: '请输入专利名称', trigger: 'blur' }],
      },
    }
  },
  computed: {
    modalTitle() {
      return this.isView ? '查看' : this.isAdd ? '新增' : '编辑'
    },
    isView() {
      return this.actionType === 'view'
    },
    isAdd() {
      return this.actionType === 'add'
    },
    isEdit() {
      return this.actionType === 'edit'
    },
    isApproval() {
      return this.actionType === 'approval'
    },
    isDisabled() {
      return this.isView || this.isApproval
    },
    footer() {
      let that = this
      const h = that.$createElement
      let btn = []
      if (that.isView) {
        return null
      } else if (that.isAdd || that.isEdit) {
        btn.push(h('a-button', { key: 'cancel', on: { click: that.handleCancel } }, '取消'))
        btn.push(
          h(
            'a-button',
            {
              key: 'submit',
              on: { click: () => that.handleOk() },
              props: { type: 'primary', loading: that.spinning },
            },
            '提交'
          )
        )
      }
      return btn
    },
  },
  methods: {
    handleSaveOk(data) {
      this.fileManagement.push(data)
    },
    //查看
    delSee(idurl) {
      this.$refs.xdocView.query(idurl)
    },
    handleAction(type, record) {
      const that = this
      if (['add'].includes(type)) {
        that.$refs.toolBoxCommonUploadForm.query(type, record)
      } else if (type === 'del') {
        that.fileManagement = that.fileManagement.filter((item) => item.fileName !== record.fileName)
      }
    },
    async handleOk() {
      let that = this
      if (that.isView) {
        that.handleCancel()
        return
      }
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let react = this.workshop.find((item) => item.id === that.form.projectId)
          let values = {
            projectId: that.form.projectId,
            proectStatus: react.status,
            patentName: that.form.patentName,
            developmentProjectPatentFiles: that.fileManagement,
          }
          if (that.isEdit) {
            values.id = that.form.id
          }
          that.spinning = true
          pageDevelopmentCraftSave(values)
            .then((res) => {
              that.spinning = false
              that.$refs.ruleForm.resetFields() // 清空表
              that.visible = false
              that.$message.info(res.msg)
              that.$emit('finish')
            })
            .catch((err) => (that.spinning = false))
        }
      })
    },
    handleCancel() {
      this.$refs.ruleForm.resetFields()
      this.fileManagement = []
      this.$nextTick(() => (this.visible = false))
    },
    async query(type, record = {}) {
      let that = this
      that.visible = true
      that.actionType = type
      that.leaveTime = ''
      that.detail = {}
      listProjectAllInfoDropDown().then((res) => {
        that.workshop = res.data
      })
      if (!that.isAdd) {
        await listProjectgetDetail({ id: record.id }).then((res) => {
          that.form = res.data
          that.fileManagement = res.data.developmentProjectPatentFiles
        })
      }
    },
  },
}
</script>

<style scoped>
.custom-table-border th,
.custom-table-border td {
  padding: 5px 10px;
}

.ant-form-item {
  margin-bottom: 0;
}

.add-form-wrapper >>> .custom-table {
  margin-bottom: 0;
}
.custom-table >>> .custom-table {
  margin: -1px;
  width: calc(100% + 2px);
}

.wdf-column {
  width: 160px;
}
</style>
