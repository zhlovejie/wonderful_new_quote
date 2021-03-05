<template>
  <a-modal
    title="操作"
    :width="500"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">

        <a-form-item label="部门">
          <a-select placeholder="请选择部门" v-model="Selected" name="departmentId" id="departmentId" @change="handleChange">
            <a-select-option :value="0" >请选择部门</a-select-option>
            <a-select-option v-for="item in options" :key="item.id" :value="item.id">{{ item.departmentName }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          label="Id"
          hidden>
          <a-input v-decorator="['id', {}]"/>
        </a-form-item>
        <a-form-item
          label="角色"
        >
          <a-input placeholder="请输入角色" v-decorator="['roleName', {}]"/>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { getDevisionList, editRole, saveRole } from '@/api/systemSetting'

export default {
  name: 'RoleModal',
  data () {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      visible: false,
      confirmLoading: false,
      mdl: {},
      addOredit: 'save',
      queryBoolean: false,
      options: [],
      Selected: 0,
      departmentId: 0,
      couponSelected: 0
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  created () {

  },
  methods: {
    add () {
      this.edit()
      this.addOredit = 'save'
    },
    edit (record) {
      this.addOredit = 'edit'
      // this.couponSelected = record.departmentId;
      getDevisionList().then(res => {
        this.options = res.data
        for (let i = 0; i < this.options.length; i++) {
          if (this.options[i].id == record.departmentId) {
            this.Selected = this.options[i].id
          }
        }
      })
      this.mdl = Object.assign({}, record)
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue({ ...record })
      })
    },
    handleChange (value) {
      console.log(`selected ${value}`)
      console.log(this.Selected)
    },
    query (record) {
      this.queryBoolean = true
      console.log('query :' + JSON.stringify(record))
      this.mdl = Object.assign({}, record)
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue({ ...record })
      })
    },
    close () {
      this.$emit('close')
      this.visible = false
    },
    handleOk () {
      const _this = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        // 验证表单没错误
        if (!err) {
          if (values.roleName.length > 30) {
            _this.$message.error('角色名过长')
            return
          }
          _this.confirmLoading = true
          // 模拟后端请求 2000 毫秒延迟
          // setTimeout(() => resolve(), 2000)
          console.log('this.addOredit :' + _this.addOredit)
          if (_this.addOredit == 'save') {
            _this.$set(values, 'departmentId', _this.Selected)
            _this.$set(values, 'Authorization', _this.$store.getters.token)
            saveRole(values).then((data) => {
              if (data.code == 200) {
                _this.$message.success('保存成功')
                _this.$emit('ok')
              } else {
                _this.$message.error(data.msg)
              }
            }).catch(() => {
              // Do something
            }).finally(() => {
              _this.confirmLoading = false
              _this.form.resetFields()
              _this.close()
            })
          } else if (this.addOredit == 'edit') {
            _this.$set(values, 'departmentId', _this.Selected)
            _this.$set(values, 'Authorization', _this.$store.getters.token)
            editRole(values).then((data) => {
              if (data.code == 200) {
                _this.$message.success('保存成功')
                _this.$emit('ok')
              } else {
                _this.$message.error(data.msg)
              }
            }).catch(() => {
              // Do something
            }).finally(() => {
              _this.confirmLoading = false
              _this.form.resetFields()
              _this.close()
            })
          }
        }
      }
      )
    },
    handleCancel () {
      this.close()
    }

  }
}
</script>

<style scoped>

</style>
