<template>
  <a-modal
    :title="title"
    :width="940"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="选择用户" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select
            showSearch
            placeholder="请选选择用户"
            optionFilterProp="children"
            :filterOption="userFilter"
            @change="checkUser"
            :disabled="userDisabled"
            v-decorator="['userId',{rules: [{required: true, message: '请选选择用户'}]}]">
            <a-select-option v-for="user in allUser" :key="user.index" :value="user.id">
              {{ user.trueName }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="ip地址1" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['ip1',{rules: [{required: true, min: 1, message: 'ip地址1不可为空！'}]}]"/>
        </a-form-item>
        <a-form-item label="ip地址2" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['ip2']"/>
        </a-form-item>
        <a-form-item label="mac地址1" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['mac1',{rules: [{required: true, min: 1, message: 'mac地址1不可为空！'}]}]"/>
        </a-form-item>
        <a-form-item label="mac地址2" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['mac2']"/>
        </a-form-item>
        <a-form-item label="有效时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-range-picker @change="dateChange" style="width: 100%"  
          v-decorator="['datePicker',{rules: [{required: true, message: '请选择有效时间！'}],initialValue: defaultDate}]"/>
          <a-input hidden="true" v-decorator="['startDate']"/>
          <a-input hidden="true" v-decorator="['endDate']"/>
        </a-form-item>
        <a-form-item label="状态" v-if="subType == 'add'" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select placeholder="请选择状态" v-decorator="['status',{rules: [{required: true, message: '请选择状态！'}],initialValue: 0}]">
            <a-select-option :value="0">启用</a-select-option>
            <a-select-option :value="1">禁用</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>

import moment from 'moment'
import { save, getOne, modify } from '@/api/system/whiteList'
import { getUserListNoPage } from '@/api/systemSetting'

export default {
  name: 'CreateForm',
  data () {
    return {
      title: '',
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      form: this.$form.createForm(this), // 只有这样注册后，才能通过表单拉取数据
      visible: false, // 表单对话框是否可见
      confirmLoading: false, // 确定按钮后是否显示加载图 loading
      subType: 'add', // 新增还是修改的标记
      allUser: [],
      defaultDate: [], // 默认时间
      userDisabled: false, // 是否能选择用户
      wId: 0,
    }
  },
  created (record) { // 初始化钩子,获取所有用户
    getUserListNoPage().then(res => {
      if (res.code === 200) {
        this.allUser = res.data
      } else {
        this.$message.error(res.msg)
      }
    })
  },
  methods: {
    dateChange (date, dateString) { // 时间选择
      this.form.setFieldsValue( { ['startDate']: dateString[0] + ' 00:00:00' } )
      this.form.setFieldsValue( { ['endDate']: dateString[1] + ' 00:00:00' } )
    },
    add () { // 父页面点击新增调用
      this.title = '新增白名单用户'
      this.visible = true
      this.subType = 'add'
    },
    edit (record) { // 父页面点击修改调用
      this.title = '修改白名单用户'
      this.userDisabled = true
      this.visible = true
      this.subType = 'edit'
      this.wId = record.id
      this.defaultDate = [moment(record.startDate, 'YYYY/MM/DD'), moment(record.endDate, 'YYYY/MM/DD')]
      const { form: { setFieldsValue } } = this
      this.$nextTick(() => {
        // setFieldsValue只有通过这种方式给表单赋值
        setFieldsValue({ ...record })
      })
    },
    userFilter (input, option) { // 下拉框搜索
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    checkUser (value) {
      getOne({ userId: value }).then(res => {
        if (res.code === 200) {
          if (res.data != null) {
            this.form.setFields({ 'userId': { value: '', errors: [{ 'message': '该人员已经添加过ip信息!', 'field': 'userId' }] } })
          }
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    handleSubmit () {
      const { form: { validateFields } } = this
      this.confirmLoading = true
      // 通过validateFields的方法，能够校验必填项是否有值，若无，则页面会给出警告！
      // 执行this.form.resetFields()，则会将表单清空。
      validateFields((errors, values) => {
        if (!errors) {
          if (this.subType === 'add') { // 新增
            save(values).then(res => {
              if (res.code === 200) {
                this.handleCancel()
                this.$emit('ok')// 刷新父组件
              } else {
                this.$message.error(res.msg)
              }
            }).catch(function (err) {
              console.log(err)
            })
          } else if (this.subType === 'edit') { // 修改
            this.$set(values, 'id', this.wId)
            modify(values).then(res => {
              if (res.code === 200) {
                this.handleCancel()
                this.$emit('ok')// 刷新父组件
              } else {
                this.$message.error(res.msg)
              }
            }).catch(function (err) {
              console.log(err)
            })
          }
        }
        this.confirmLoading = false
      })
    },
    handleCancel () {
      this.visible = false
      this.userDisabled = false
      this.form.resetFields() // 清空表
    }
  }
}
</script>