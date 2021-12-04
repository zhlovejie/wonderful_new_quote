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
    <component :is="currentComponent" ></component>
  </a-modal>
</template>

<script>
import GiftForm from './GiftForm'
import RepairForm from './RepairForm'
import SubstandardForm from './SubstandardForm'
import {
  
} from '@/api/routineMaterial'


export default {
  name: 'stock_management_import_apply_addForm',
  components: {
    GiftForm,
    RepairForm,
    SubstandardForm
  },
  provide() {
    return {
      addForm: this,
    }
  },
  data() {
    return {
      visible: false,
      spinning: false,
      record:{}
    }
  },
  computed: {
    modalTitle() {
      const type = this.record.type
      const m = {
        1:'赠送入库',
        2:'产成品返修入库',
        3:'安装不良品入库'
      }
      return m[type] || '未知'
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
    currentComponent() {
      const m = {
        1:'GiftForm',
        2:'RepairForm',
        3:'SubstandardForm'
      }
      const type = this.record.type
      return m[type] || null
    },
  },
  methods: {
    async query(type, record) {
      const that = this
      that.visible = true
      that.record = { ...record }
      that.type = type
      
      that.$nextTick(() => {
        console.log(that.currentComponent)
      })
      
    },
    
    
    handleSubmit() {
      this.handleCancel()
    },
    handleCancel() {
      const that = this
      that.$nextTick(() => {
        that.visible = false
      })
    }
  }
}
</script>

<style scoped>
</style>
