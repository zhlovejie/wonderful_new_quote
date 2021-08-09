<template>
  <a-modal
    :title="modalTitle"
    :width="800"
    :visible="visible"
    :destroyOnClose="true"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :maskClosable="false"
    :confirmLoading="spinning"
  >
    <a-spin :spinning="spinning">
      <a-form-model
        ref="ruleForm"
        :model="form"
        :rules="rules"
        class="addform-wrapper"
      >
        <a-form-model-item
          label="项目开发模式"
          prop="relationSchema"
        >
          <a-select
            v-if="!isView"
            v-model="form.relationSchema"
            placeholder="请选择项目开发模式"
          >
            <a-select-option
              v-for="item in nodeList"
              :value="item.id"
              :key="item.id"
            >{{item.text}}</a-select-option>
          </a-select>
          <span v-else>
            {{ getRelationSchemaType(form.relationSchema) }}
          </span>

        </a-form-model-item>
      </a-form-model>

      <h3>节点选项</h3>
      <a-table
        :columns="columns"
        :dataSource="dataSource"
        :loading="loading"
        :pagination="false"
        :rowSelection=" !isView ? { onChange: rowSelectionChangeHnadler, selectedRowKeys: form.nodeIds } : null"
        size="small"
      >
        <div
          slot="order"
          slot-scope="text, record, index"
        >
          <span>{{ index + 1 }}</span>
        </div>
      </a-table>
    </a-spin>
  </a-modal>
</template>
<script>
import {
  schemeNodeRelationDetail,
  schemeNodeRelationAdd,
  schemeNodeRelationUpdate,
  nodeInfoListAll
} from '@/api/researchManagementByWzz'

function makeNodes() {
  const arr = ['全部', '自主研发新产品', '客户定制新产品', '产品研发改进', '非常规产品开发']
  return arr.map((v, idx) => {
    return { id: idx, text: v }
  })
}

const columns = [
  {
    align: 'center',
    title: '序号',
    scopedSlots: { customRender: 'order' }
  },
  {
    align: 'center',
    title: '节点选项',
    dataIndex: 'nodeName'
  }
]

export default {
  name: 'project-management-Project-selection_AddForm',
  components: {},
  data() {
    return {
      type: 'add',
      visible: false,
      spinning: false,
      form: {
        relationSchema: undefined,
        nodeIds: []
      },
      rules: {
        relationSchema: [{ required: true, message: '请选择项目开发模式' }]
      },
      nodeList: Object.freeze(makeNodes()),
      columns,
      dataSource: [],
      loading: false
    }
  },
  created() {},
  computed: {
    modalTitle() {
      const type = this.type
      return type === 'add' ? '新增' : type === 'edit' ? '修改' : type === 'view' ? '查看' : '未知'
    },
    isAdd() {
      return this.type === 'add'
    },
    isEdit() {
      return this.type === 'edit'
    },
    isView() {
      return this.type === 'view'
    },
    stageList() {
      if (this.form && this.form.stageList) {
        const stageList = [...this.form.stageList]
        return this.nodeList.filter(node => stageList.includes(node.id)).sort((a, b) => a.id - b.id)
      }
      return []
    }
  },
  methods: {
    async query(type, record) {
      const that = this
      that.type = type
      that.visible = true

      that.form = {
        relationSchema: undefined,
        nodeIds: []
      }

      that.loading = true
      await nodeInfoListAll()
        .then(res => {
          that.loading = false
          that.dataSource = res.data.map(item => {
            item.key = item.id
            return { ...item }
          })
        })
        .catch(err => {
          that.loading = false
          console.log(err)
        })

      if (!this.isAdd) {
        that.spinning = true
        await schemeNodeRelationDetail({ schemaId: record.schemaId })
          .then(res => {
            that.spinning = false
            const { schemaId, schema, nodeInfoList } = res.data

            that.form = {
              id: schemaId,
              relationSchema: schema,
              nodeIds: Array.isArray(nodeInfoList) ? nodeInfoList.map(item => item.id) : []
            }

            if (that.isView) {
              that.dataSource = that.dataSource.filter(item => that.form.nodeIds.includes(item.id))
            }
          })
          .catch(err => (that.spinning = false))
      }
    },
    handleSubmit() {
      const that = this
      that.$refs.ruleForm.validate(valid => {
        if (valid) {
          const api = that.isAdd ? schemeNodeRelationAdd : schemeNodeRelationUpdate
          that.spinning = true
          api({ ...that.form, nodeIds: that.form.nodeIds.join(',') })
            .then(res => {
              that.spinning = false
              that.$message.info(res.msg)
              if (res.code === 200) {
                that.$emit('finish')
                that.handleCancel()
              }
            })
            .catch(err => (that.spinning = false))
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleCancel() {
      const that = this
      that.$refs.ruleForm.resetFields()
      that.$nextTick(() => (that.visible = false))
    },
    rowSelectionChangeHnadler(selectedRowKeys, selectedRows) {
      this.form = { ...this.form, nodeIds: selectedRowKeys }
    },
    getRelationSchemaType(type) {
      const arr = ['全部', '自主研发新产品', '客户定制新产品', '产品研发改进', '非常规产品开发']
      return arr[type]
    }
  }
}
</script>

<style scoped>
</style>

