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
        <a-form-item label="Id" hidden>
          <a-input v-decorator="['id', {}]"/>
        </a-form-item>
        <a-form-item label="节点名称">
          <a-input disabled placeholder="" v-decorator="['text', {}]"/>
        </a-form-item>

        <a-form-item label="用户">
          <a-select
            showSearch
            optionFilterProp="children"
            style="width: 200px"
            @focus="handleFocus"
            @blur="handleBlur"
            :filterOption="filterOption"
            placeholder="请选择用户"
            v-model="Selected"
            name="userId"
            id="userId"
            @change="handleChange">
            <a-select-option :value="0">请选择用户</a-select-option>
            <a-select-option v-for="item in options" :value="item.id">{{ item.trueName }}</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { getUserListNoPage } from '@/api/systemSetting'
import { DictionaryModify } from '@/api/workBox'

export default {
  name: 'ApprovalModal',
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
      options: [],
      Selected: 0
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  created () {

  },
  methods: {
    edit (record) {
      getUserListNoPage().then(res => {
        this.options = res.data
        for (let i = 0; i < this.options.length; i++) {
          if (this.options[i].id == record.userId) {
            this.Selected = this.options[i].id
          }
        }
      })
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue({ ...record })
      })
    },
    handleChange (value) {
      console.log(`selected ${value}`)
      console.log(this.Selected)
    },
    handleBlur () {
      console.log('blur')
    },
    handleFocus () {
      console.log('focus')
    },
    filterOption (input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    close () {
      this.$emit('close')
      this.Selected = 0
      this.visible = false
    },
    handleOk () {
      const _this = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        // 验证表单没错误
        if (!err) {
          _this.confirmLoading = true
          _this.$set(values, 'userId', _this.Selected)
          DictionaryModify(values).then((data) => {
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
