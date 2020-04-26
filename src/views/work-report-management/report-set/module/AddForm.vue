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
        <a-form-item label="部门">
          <a-select
            :disabled="isEdit"
            placeholder="选择部门"
            @change="depChangeHandler"
            v-decorator="['departmentId',{rules: [{required: true,message: '选择部门'}]}]"
            :allowClear="true"
          >
            <a-select-option
              v-for="item in depSelectDataSource"
              :key="item.id"
              :value="item.id"
            >{{item.departmentName}}</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="岗位">
          <a-select
            placeholder="选择岗位"
            v-decorator="['stationId',{rules: [{required: true,message: '选择岗位'}]}]"
            :allowClear="true"
          >
            <a-select-option
              v-for="item in postSelectDataSource"
              :key="item.id"
              :value="item.id"
            >{{item.stationName}}</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="工作上报">
          <a-select
            placeholder="工作上报"
            v-decorator="['docType',{rules: [{required: true,message: '请选择工作上报'}]}]"
          >
            <a-select-option :value="1">日报</a-select-option>
            <a-select-option :value="2">周报</a-select-option>
            <a-select-option :value="3">月报</a-select-option>
            <a-select-option :value="4">日报和周报</a-select-option>
            <a-select-option :value="5">日报和月报</a-select-option>
            <a-select-option :value="6">周报和月报</a-select-option>
            <a-select-option :value="7">全部</a-select-option>
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
import { workReportSetSaveAndUpdate } from '@/api/workReportManagement'
export default {
  name: 'AddForm',
  data() {
    return {
      form: this.$form.createForm(this, { name: 'reserve_add' }),
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
      let task1 = function() {
        return departmentList().then(res => (that.depSelectDataSource = res.data))
      }
      queue.push(task1())
      if (that.isEdit) {
        let task2 = function() {
          return that.depChangeHandler(that.record.departmentId)
        }
        queue.push(task2())
      }
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
          workReportSetSaveAndUpdate(values)
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
      this.depSelectDataSource = []
      this.postSelectDataSource = []
      this.$nextTick(() => (this.visible = false))
    },
    depChangeHandler(dep_id) {
      let that = this
      that.postSelectDataSource = []
      return getStationList({ id: dep_id }).then(res => {
        let result = [...res.data]
        result.unshift({
          id: 0,
          stationName: '该部门所有岗位'
        })
        that.postSelectDataSource = [...result]
      })
    }
  }
}
</script>
<style scoped>
</style>
