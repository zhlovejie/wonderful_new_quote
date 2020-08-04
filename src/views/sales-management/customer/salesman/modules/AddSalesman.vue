<template>
  <a-modal
    :title="formTitle"
    :width="640"
    :visible="visible"
    :destroyOnClose="true"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :confirmLoading="confirmLoading"
    :maskClosable="false"
  >
    <div>
      <a-form :form="form" style="max-width: 500px; margin: 40px auto 0;" class="sForm">
        <a-form-item hidden>
          <a-input v-decorator="['id']"/>
        </a-form-item>
        <a-form-item label="选择销售人员" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select
            showSearch
            placeholder="请选择销售人员"
            optionFilterProp="children"
            :filterOption="userFilter"
            @change="checkUser"
            v-decorator="['userId',{rules: [{required: true, message: '请选择销售人员！'}]}]">
            <a-select-option v-for="user in allUser" :key="user.index" :value="user.id">{{ user.trueName }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="选择对应领导" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select
            showSearch
            placeholder="请选择对应领导"
            optionFilterProp="children"
            :filterOption="userFilter"
            v-decorator="['leader',{rules: [{required: true, message: '请选择对应领导'}]}]">
            <a-select-option v-for="user in allUser" :key="user.index" :value="user.id">{{ user.trueName }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="被分配权" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-switch checkedChildren="有" unCheckedChildren="无" :defaultChecked="cdsc" @change="changeDstb"/>
          <a-input type="hidden" v-decorator="['canDistribute', {rules: [{required: true,message: '请选择被分配权！'}],initialValue:1}]"/>
        </a-form-item>
        <a-form-item label="提取客户权限" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-switch checkedChildren="有" unCheckedChildren="无" :defaultChecked="cesc" @change="changeExtc"/>
          <a-input type="hidden" v-decorator="['canExtract', {rules: [{required: true,message: '请选择提取客户权限！'}],initialValue:1}]"/>
        </a-form-item>
        <a-form-item label="录入部门客户权限" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-switch checkedChildren="有" unCheckedChildren="无" :defaultChecked="cedsc" @change="changeEtdp"/>
          <a-input type="hidden" v-decorator="['canEnterDep', {rules: [{required: true,message: '请选择录入部门客户权限！'}],initialValue:1}]"/>
        </a-form-item>
        <a-form-item label="给其他人员录入客户权限" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-switch checkedChildren="有" unCheckedChildren="无" :defaultChecked="ceosc" @change="changeEtoh"/>
          <a-input type="hidden" v-decorator="['canEnterOther', {rules: [{required: true,message: '请选择给其他人员录入客户权限！'}],initialValue:1}]"/>
        </a-form-item>
        <a-form-item label="录入公共客户权限" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-switch checkedChildren="有" unCheckedChildren="无" :defaultChecked="cecsc" @change="changeEtcm"/>
          <a-input type="hidden" v-decorator="['canEnterCommon', {rules: [{required: true,message: '请选择录入公共客户权限！'}],initialValue:1}]"/>
        </a-form-item>
        <a-form-item label="未维护处罚" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-switch checkedChildren="有" unCheckedChildren="无" :defaultChecked="op" @change="changeOP"/>
          <a-input type="hidden" v-decorator="['overduePunish', {rules: [{required: true,message: '请选择未维护处罚！'}],initialValue:0}]"/>
        </a-form-item>
        <a-form-item label="客户上限" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['maximum', {rules: [{required: true,message: '请填写客户上限！'},{ pattern: /^\d+$/,message: '必须是数字'}],initialValue:230}]"/>
        </a-form-item>
        <a-form-item label="提取周期（天）" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['recoverTime', {rules: [{required: true, message: '请填写提取周期！'},{ pattern: /^\d+$/,message: '必须是数字'}],initialValue:180}]"/>
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>

<script>
import ATextarea from 'ant-design-vue/es/input/TextArea'
import { getAllUser, addSalesman, getOneSalesman, editSalesman } from '@/api/customer/salesman'

export default {
  name: 'AddSalesman',
  components: { ATextarea },
  data () {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 12 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 }
      },
      form: this.$form.createForm(this), // 只有这样注册后，才能通过表单拉取数据
      visible: false, // 表单对话框是否可见
      formTitle: '新增销售人员',
      confirmLoading: false, // 确定按钮后是否显示加载图 loading
      allUser: [],
      subType: 'add',
      cdsc: true,
      cesc: true,
      cedsc: true,
      ceosc: true,
      cecsc: true,
      op: true
    }
  },
  created () {
    getAllUser().then(res => {
      if (res.code === 200) {
        this.allUser = res.data
      } else {
        this.$message.error(res.msg)
      }
    })
  },
  methods: {
    checkUser (value) {
      getOneSalesman({ userId: value }).then(res => {
        if (res.code === 200) {
          if (res.data != null && res.data.length > 0) {
            this.form.setFields({ 'userId': { value: '', errors: [{ 'message': '该人员已经是销售人员!', 'field': 'userId' }] } })
          }
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    changeDstb (checked) {
      if (checked) {
        this.form.setFieldsValue({ 'canDistribute': 1 })
      } else {
        this.form.setFieldsValue({ 'canDistribute': 0 })
      }
    },
    changeExtc (checked) {
      if (checked) {
        this.form.setFieldsValue({ 'canExtract': 1 })
      } else {
        this.form.setFieldsValue({ 'canExtract': 0 })
      }
    },
    changeEtdp (checked) {
      if (checked) {
        this.form.setFieldsValue({ 'canEnterDep': 1 })
      } else {
        this.form.setFieldsValue({ 'canEnterDep': 0 })
      }
    },
    changeEtoh (checked) {
      if (checked) {
        this.form.setFieldsValue({ 'canEnterOther': 1 })
      } else {
        this.form.setFieldsValue({ 'canEnterOther': 0 })
      }
    },
    changeEtcm (checked) {
      if (checked) {
        this.form.setFieldsValue({ 'canEnterCommon': 1 })
      } else {
        this.form.setFieldsValue({ 'canEnterCommon': 0 })
      }
    },
    changeOP (checked) {
      if (checked) {
        this.form.setFieldsValue({ 'overduePunish': 1 })
      } else {
        this.form.setFieldsValue({ 'overduePunish': 0 })
      }    
    },
    userFilter (input, option) { // 下拉框搜索
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    showForm (record) {
      this.visible = true
      if (record.id != null){
        this.subType = 'edit'
        this.formTitle = '修改权限分配'
        this.$nextTick(() => {
          this.form.setFieldsValue({
            id: record.id,
            userId: record.userId,
            leader: record.leader,
            canDistribute: record.canDistribute,
            canExtract: record.canExtract,
            canEnterDep: record.canEnterDep,
            canEnterOther: record.canEnterOther,
            canEnterCommon: record.canEnterCommon,
            overduePunish: record.overduePunish,
            maximum: record.maximum,
            recoverTime: record.recoverTime
          })
        })
        this.cdsc = record.canDistribute === 1 ? true : false
        this.cesc = record.canExtract === 1 ? true : false
        this.cedsc = record.canEnterDep === 1 ? true : false
        this.ceosc = record.canEnterOther === 1 ? true : false
        this.cecsc = record.canEnterCommon === 1 ? true : false
        this.op = record.overduePunish === 1 ? true : false
      }
    },
    handleCancel () {
      this.subType = 'add'
      this.formTitle = '新增销售人员'
      this.cdsc =true
      this.cesc =true
      this.cedsc = true
      this.ceosc = true
      this.cecsc = true
      this.op = true
      this.form.resetFields() // 清空表
      this.visible = false
    },
    handleSubmit () {
      const { form: { validateFields } } = this
      this.confirmLoading = true
      // 通过validateFields的方法，能够校验必填项是否有值，若无，则页面会给出警告！
      // 执行this.form.resetFields()，则会将表单清空。
      validateFields((errors, values) => {
        if (!errors) {
          if(this.subType === 'add') {
            addSalesman(values).then(res => {
              if (res.code === 200) {
                this.visible = false
                this.$emit('ok')// 刷新父组件
              } else {
                this.$message.error(res.msg)
              }
            }) 
          } else if(this.subType === 'edit') {
            editSalesman(values).then(res => {
              if (res.code === 200) {
                this.visible = false
                this.$emit('ok')// 刷新父组件
              } else {
                this.$message.error(res.msg)
              }
            })
          }
        }
        this.confirmLoading = false
      })
    }
  }
}
</script>

<style scoped>
.sForm >>> .ant-form-item-label{
  text-align: left;
}
</style>
