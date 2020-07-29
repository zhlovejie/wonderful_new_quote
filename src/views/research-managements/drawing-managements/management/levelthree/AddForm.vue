<template>
  <a-modal
    :title="modalTitle"
    :width="1080"
    :visible="visible"
    :destroyOnClose="true"
    @cancel="handleCancel"
    :confirmLoading="spinning"
    :maskClosable="false"
    :footer="null"
  >
    <div v-if="isAdd">
      <a-tabs :activeKey="String(activeKey)" defaultActiveKey="1" @change="tabChange">
        <a-tab-pane tab="单文件上传" key="1" />
        <a-tab-pane tab="多文件上传" key="2" />
      </a-tabs>
      <SingleForm v-if="+activeKey === 1" :param="record" :action="type" @finish="finishAction"  />
      <MultiForm v-if="+activeKey === 2" :param="record" :action="type" @finish="finishAction"/>
    </div>
    <div v-if="isView || isEdit">
      <SingleForm :param="record" :action="type" @finish="finishAction"/>
    </div>
  </a-modal>
</template>
<script>
import SingleForm from './AddSingleForm'
import MultiForm from './AddMultiForm'

export default {
  name: 'AddForm',
  components: {SingleForm,MultiForm},
  data() {
    return {
      activeKey:1,
      visible: false,
      spinning: false,
      type: '',
      detail: {},
      record:{}
    }
  },
  computed: {
    modalTitle() {
      return `${this.isView ? '查看' : this.isAdd ? '新增' : '编辑'}`
    },
    isView() {
      return this.type === 'view'
    },
    isEdit() {
      return this.type === 'edit'
    },
    isAdd() {
      return this.type === 'add'
    },
  },
  methods: {
    async query(type, record) {
      let that = this
      that.type = type
      //that.detail = Object.assign({}, record)
      that.record = Object.assign({}, record)
      //await that.initData()
      that.visible = true
    },
    initData() {
      let that = this
      let queue = []

      if(that.isAdd){
        let {id,superiorId,menuName} = that.record.params
        that.detail = {id,superiorId,superiorName:menuName}
      }else{
        let task1 = blueprintMenuDetail({id:that.record.record.id}).then(res =>{
          that.detail = res.data
        })
        queue.push(task1)
      }
      return Promise.all(queue)
    },
    handleCancel() {
      this.$nextTick(() => (this.visible = false))
    },
    tabChange(tagKey) {
      this.activeKey = parseInt(tagKey)
    },
    finishAction(){
      this.visible = false 
      this.$nextTick(() =>this.$emit('finish'))
    }
  },
}
</script>
<style scoped>
.custom-table-border th,
.custom-table-border td {
  padding: 10px;
}
.custom-table-border >>> .ant-form-item {
  margin-bottom: 0;
}
</style>
