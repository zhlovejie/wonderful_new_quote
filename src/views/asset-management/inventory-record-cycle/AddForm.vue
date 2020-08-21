<template>
  <a-modal
    :title="modalTitle"
    :width="420"
    :visible="visible"
    :destroyOnClose="true"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :confirmLoading="spinning"
    :maskClosable="false"
  >
    <a-spin :spinning="spinning">
      <a-form :form="form">
        <a-form-item label="规则名称">
          <a-input 
            :disabled="isEdit"
            placeholder="规则名称" 
            v-decorator="['ruleName',{initialValue:detail.ruleName, rules: [{required: true,message: '输入规则名称'}]}]"
            :allowClear="true"
            
          />
        </a-form-item>

        <a-form-item label="开始时间(含)">
          <a-date-picker  
            placeholder="开始时间"
            v-decorator="['beginTime',{initialValue:detail.beginTime ? moment(`2020-${detail.beginTime}`) :undefined,rules: [{required: true,message: '选择开始时间'}]}]" 
            style="width:100%;" 
            format="MM-DD"
          />
        </a-form-item>

        <a-form-item label="结束时间(含)">
          <a-date-picker  
            placeholder="结束时间"
            v-decorator="['endTime',{initialValue:detail.endTime ? moment(`2020-${detail.endTime}`) : undefined,rules: [{required: true,message: '选择结束时间'}]}]" 
            style="width:100%;"
            format="MM-DD"
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>
<script>
import {
  oaAssertsInfoInventoryTimeDetail,
  oaAssertsInfoInventoryTimeAddOrUpdate
} from '@/api/assetManagement'
import moment from 'moment'

export default {
  name: 'asset-management-inventory-record-cycle-AddForm',
  data() {
    return {
      form: this.$form.createForm(this, { name: 'asset-management-inventory-record-cycle-AddForm' }),
      visible: false,
      spinning: false,
      type: 'view',
      record: {},
      detail:{}
    }
  },
  computed: {
    modalTitle() {
      return this.type === 'add' ? '新增' : '编辑'
    },
    isAdd() {
      return this.type === 'add'
    },
    isEdit() {
      return this.type === 'edit'
    }
  },
  methods: {
    moment,
    async query(type, record) {
      let that = this
      that.visible = true
      that.type = type
      that.record = Object.assign({}, record)
      that.detail = {}
      await that.initData()
      if (that.isEdit) {
        oaAssertsInfoInventoryTimeDetail({id:that.record.id}).then(res => {
          console.log(res)
          that.detail = res.data
        })
        // that.$nextTick(() => {
        //   that.form.setFieldsValue(Object.assign({}, that.record))
        // })
      }
    },
    initData() {
      let that = this
      let queue = []
      return Promise.all(queue)
    },
    handleSubmit() {
      let that = this
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          if (that.isEdit) {
            values.id = that.record.id
          }
          if(values.beginTime instanceof moment){
            values.beginTime = values.beginTime.format('YYYY-MM-DD')
          }
          if(values.endTime instanceof moment){
            values.endTime = values.endTime.format('YYYY-MM-DD')
          }
          that.spinning = true
          oaAssertsInfoInventoryTimeAddOrUpdate(values)
            .then(res => {
              that.spinning = false
              if (res.code === 200) {
                that.visible = false
                that.$message.success('操作成功')
                that.$emit('finish')
              } else {
                that.$message.warning(res.msg)
              }
            })
            .catch(err => {
              that.spinning = false
              that.$message.error('操作失败')
            })
        }
      })
    },
    handleCancel() {
      this.form.resetFields()
      this.$nextTick(() => (this.visible = false))
    }
  }
}
</script>
<style scoped>
</style>
