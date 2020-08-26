<template>
  <a-modal
    :title="modalTitle"
    :width="550"
    :visible="visible"
    :destroyOnClose="true"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :confirmLoading="spinning"
    :maskClosable="false"
  >
    <a-spin :spinning="spinning">
      <a-form :form="form" class="wdf-custom-add-form-wrapper">

        <a-form-item label="特殊岗位体检周期（年）" >
          <a-select 
            placeholder="特殊岗位体检周期（年）"
            v-decorator="['specialCycle',{initialValue: 1, rules: [{required: true,message: '请选择特殊岗位体检周期（年）'}]}]"
          >
            <a-select-option  v-for="val in 10" :key="val" :value="val">{{val}}</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="管理层体检周期（年）" >
          <a-select 
            placeholder="管理层体检周期（年）"
            v-decorator="['managerCycle',{initialValue: 3, rules: [{required: true,message: '请选择管理层体检周期（年）'}]}]"
          >
            <a-select-option  v-for="val in 10" :key="val" :value="val">{{val}}</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="工龄体检周期（年）" >
          <a-select 
            placeholder="工龄体检周期（年）"
            v-decorator="['ageCycle',{initialValue: 1, rules: [{required: true,message: '请选择工龄体检周期（年）'}]}]"
          >
            <a-select-option  v-for="val in 10" :key="val" :value="val">{{val}}</a-select-option>
          </a-select>
        </a-form-item>


      </a-form>
    </a-spin>
  </a-modal>
</template>
<script>
import {
  departmentList, //所有部门
  getStationList //获取所有岗位
} from '@/api/systemSetting'
import {
  checkupCycleAddOrUpdate
} from '@/api/welfareManagement'
export default {
  name: 'welfare-management-healthy-config-AddForm',
  data() {
    return {
      form: this.$form.createForm(this, { name: 'welfare-management-healthy-config-AddForm' }),
      visible: false,
      spinning: false,
      type: 'view',
      depSelectDataSource: [],
      postSelectDataSource: [],
      record: {}
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
    async query(type, record) {
      let that = this
      that.visible = true
      that.type = type
      that.record = Object.assign({}, record)
      
      await that.initData()
      if (that.isEdit) {
        that.$nextTick(() => {
          that.form.setFieldsValue(Object.assign({}, that.record))
        })
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
          that.spinning = true
          checkupCycleAddOrUpdate(values)
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
.wdf-custom-add-form-wrapper >>> .ant-form-item{
  display:flex;
  margin: 0;
}

.ant-form-item >>> .ant-form-item-label{
  width:180px;
}
.ant-form-item >>> .ant-form-item-control-wrapper{
  flex:1;
}
.custom-table-border th,
.custom-table-border td {
  padding: 5px 10px;
  text-align: left;
}
</style>
