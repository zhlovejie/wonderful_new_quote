<template>
  <a-modal
    :title="modalTitle"
    :width="1050"
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
          label="节点选项"
          prop="configName"
        >
          <a-input
            v-if="!isView"
            v-model="form.nodeName"
          />
          <span v-else>{{form.nodeName}}</span>
        </a-form-model-item>
        <a-form-model-item
          v-if="!isView"
          label="关联节点"
          prop="stageList"
        >
          <a-select
            mode="multiple"
            v-model="form.stageList"
            placeholder="请选择关联节点"
          >
            <a-select-option
              v-for="item in nodeList"
              :value="item.id"
              :key="item.id"
            >{{item.text}}</a-select-option>
          </a-select>
        </a-form-model-item>
      </a-form-model>

      <h3>已关联节点列表</h3>
      <table class="custom-table custom-table-border">
        <thead>
          <tr>
            <th>序号</th>
            <th>关联节点</th>
            <th v-if="!isView"><a
                href="javascript:void(0);"
                @click="doAction('clearAll')"
              >清空</a></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item,idx) in stageList"
            :key="item.id"
          >
            <td>{{idx + 1}}</td>
            <td>{{item.text}}</td>
            <td v-if="!isView"><a
                href="javascript:void(0);"
                @click="doAction('clear',item)"
              >删除</a></td>
          </tr>
        </tbody>
      </table>

    </a-spin>
  </a-modal>
</template>
<script>
import { nodeInfoDetail, nodeInfoAdd, nodeInfoUpdate } from '@/api/researchManagementByWzz'

function makeNodes() {
  const arr = [
    '立项阶段',
    '设计方案评审',
    '试制资料输出',
    '产品试制',
    '可行性测试',
    '可行性测试结果联合评审',
    '稳定性测试',
    '稳定性测试结果评审',
    '配置方案研发',
    '配置方案研发评审',
    '配置方案技术资料归档',
    '设计模块',
    '工艺研发',
    '工艺下达',
    '小批量生产',
    '小批量生产评审',
    '样品展示',
    '批量生产&完结'
  ]
  return arr.map((v, idx) => {
    return {
      id: idx + 1,
      text: v
    }
  })
}

export default {
  name: 'project-management-Project-node_AddForm',
  components: {},
  data() {
    return {
      type: 'add',
      visible: false,
      spinning: false,
      form: {
        stageList: []
      },
      rules: {
        nodeName: [{ required: true, message: '请输入节点选项名称' }],
        stageList: [{ required: true, message: '请选择关联节点' }]
      },
      nodeList: Object.freeze(makeNodes())
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
      that.detail = {}
      that.visible = true
      that.optStandItems = []
      that.optChoiceItems = []
      that.filterKeys = []

      if (!this.isAdd) {
        that.spinning = true
        await nodeInfoDetail({ nodeId: record.nodeId }).then(res => {
          that.spinning = false
          console.log(res)
          that.form = res.data
        }).catch(err => (that.spinning = false))
      }
    },
    doAction(type, item) {
      const that = this
      if (type === 'clearAll') {
        that.form = { ...that.form, stageList: [] }
      } else if (type === 'clear') {
        let stageList = [...that.form.stageList]
        stageList = stageList.filter(v => v !== item.id)
        that.form = { ...that.form, stageList }
      }
    },
    handleSubmit() {
      const that = this
      that.$refs.ruleForm.validate(valid => {
        if (valid) {
          const api = that.isAdd ? nodeInfoAdd : nodeInfoUpdate
          const stageList = [...that.form.stageList].sort((a, b) => a - b)
          that.spinning = true
          api({ ...that.form, stageList })
            .then(res => {
              that.spinning = false
              that.$message.info(res.msg)
              that.$emit('finish')
              that.handleCancel()
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
      that.form = {}
      that.$nextTick(() => (that.visible = false))
    }
  }
}
</script>

<style scoped>
</style>

