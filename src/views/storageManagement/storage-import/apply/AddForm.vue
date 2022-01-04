<template>
  <a-modal
    :title="modalTitle"
    :width="1000"
    :visible="visible"
    :destroyOnClose="true"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :maskClosable="false"
    :confirmLoading="spinning"
    :footer="null"
    :forceRender="true"
  >
    <component :is="currentComponent" @change="handleComponentChange"></component>
  </a-modal>
</template>

<script>
import GiftForm from './GiftForm'
import RepairForm from './RepairForm'
import SubstandardForm from './SubstandardForm'

export default {
  name: 'stock_management_import_apply_addForm',
  components: {
    GiftForm,
    RepairForm,
    SubstandardForm
  },
  provide() {
    return {
      addForm: this
    }
  },
  data() {
    return {
      visible: false,
      spinning: false,
      record: {},
      type:'view'
    }
  },
  computed: {
    modalTitle() {
      const type = this.record.storageType
      const action = this.isView ? '查看' : this.isEdit ? '编辑' : '新增'
      const m = {
        1: '赠送入库',
        2: '产成品返修入库',
        3: '安装不良品入库'
      }
      return `${action}-${m[type] || '未知'}`
    },
    isView() {
      return this.type === 'view'
    },
    isAdd() {
      return this.type === 'add'
    },
    isEdit() {
      return this.type === 'edit'
    },
    isApproval(){
      return this.type === 'approval'
    },
    isDisabled(){
      return this.isView || this.isApproval
    },
    currentComponent() {
      const m = {
        1: 'GiftForm',
        2: 'RepairForm',
        3: 'SubstandardForm'
      }
      const type = this.record.storageType
      return m[type] || null
    }
  },
  methods: {
    async query(type, record) {
      const that = this
      that.visible = true
      that.record = { ...record }
      that.type = type
    },
    handleSubmit() {
      this.handleCancel()
    },
    handleCancel() {
      const that = this
      that.$nextTick(() => {
        that.visible = false
      })
    },
    handleComponentChange(type) {
      const that = this
      if (type === 'cancel') {
        that.handleCancel()
        return
      } else if (type === 'submit' || type === 'approval') {
        that.handleCancel()
        that.$emit('ok')
        return
      }
    }
  }
}
</script>

<style scoped></style>
