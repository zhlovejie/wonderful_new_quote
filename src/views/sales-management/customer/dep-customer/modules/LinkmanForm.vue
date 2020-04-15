<template>
  <div>
    <a-form :form="form" style="max-width: 600px; margin: 30px auto 0;">
      <a-form-item label="联系人名" :labelCol="labelCol" :wrapperCol="wrapperCol" class="stepFormText">
        <a-input v-decorator="['name',{rules: [{required: true, min: 1, message: '人名不可为空！'}]}]"/>
      </a-form-item>
      <a-form-item label="性别" :labelCol="labelCol" :wrapperCol="wrapperCol" class="stepFormText">
        <a-radio-group v-decorator="['sex',{initialValue: 1}]">
          <a-radio :value="1">男</a-radio>
          <a-radio :value="0">女</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="是否为主联系人" :labelCol="labelCol" :wrapperCol="wrapperCol" class="stepFormText">
        <a-radio-group v-decorator="['main',{initialValue: 1}]">
          <a-radio :disabled="haveMain" :value="1">是</a-radio>
          <a-radio :value="0">否</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="职位" :labelCol="labelCol" :wrapperCol="wrapperCol" class="stepFormText">
        <a-input v-decorator="['position',{rules: [{required: true, min: 2, message: '职位最少为2个字符！'}]}]"/>
      </a-form-item>
      <a-form-item label="手机号" :labelCol="labelCol" :wrapperCol="wrapperCol" class="stepFormText">
        <a-input @blur="checkPhone()" v-decorator="['phone',{rules: [{required: true, min: 11, max: 11, pattern: '^[0-9]*$', message: '手机号必须为11位纯数字！'}]}]"/>
      </a-form-item>
      <a-form-item label="微信号" :labelCol="labelCol" :wrapperCol="wrapperCol" class="stepFormText">
        <a-input v-decorator="['weixin',{rules: [{required: false}]}]"/>
      </a-form-item>
      <a-form-item label="QQ" :labelCol="labelCol" :wrapperCol="wrapperCol" class="stepFormText">
        <a-input v-decorator="['qq',{rules: [{required: false}]}]"/>
      </a-form-item>
      <a-form-item label="邮箱" :labelCol="labelCol" :wrapperCol="wrapperCol" class="stepFormText">
        <a-input v-decorator="['email',{rules: [{required: false}]}]"/>
      </a-form-item>
      <a-form-item :wrapperCol="{span: 24, offset: 20}">
        <a-button type="primary" icon="plus" @click="addLinkman">继续添加</a-button>
        <!--<a-button style="margin-left: 8px" type="primary" icon="minus" @click="() => linkmans = []">重置</a-button>-->
      </a-form-item>
      <a-form-item :wrapperCol="{span: 24}">
        <a-table
          ref="table"
          :columns="columns"
          :dataSource="linkmans"
          :pagination="false"
          rowKey="name"
        >
          <span slot="main" slot-scope="text">
            <a-icon v-if="text === 1" type="check-circle" theme="twoTone" twoToneColor="#52c41a"/>
            <a-icon v-if="text === 0" type="close-square" theme="twoTone" twoToneColor="#D4D4D4"/>
          </span>
          <span slot="action" slot-scope="text,record,index">
            <template>
              <a @click="handleEdit(record,index)">修改</a>
              <a-divider type="vertical" />
              <a-popconfirm title="确认删除这条数据？" @confirm="confirm(record,index)" okText="是" cancelText="否">
                <a href="#">删除</a>
              </a-popconfirm>
            </template>
          </span>
        </a-table>
      </a-form-item>
      <a-form-item :wrapperCol="{span: 24, offset: 19}">
        <a-button @click="prevStep">上一步</a-button>
        <a-button style="margin-left: 8px" :loading="loading" type="primary" @click="nextStep">提交</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { delLinkman, checkPhone } from '@/api/linkman'

export default {
  name: 'LinkmanForm',
  data () {
    return {
      labelCol: { lg: { span: 5 }, sm: { span: 5 } },
      wrapperCol: { lg: { span: 19 }, sm: { span: 19 } },
      form: this.$form.createForm(this),
      loading: false,
      timer: 0,
      columns: [
        {
          title: '联系人名',
          dataIndex: 'name'
        },
        {
          title: '手机号',
          dataIndex: 'phone'
        },
        {
          title: '是否为主联系人',
          dataIndex: 'main',
          scopedSlots: { customRender: 'main' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      linkmans: [],
      haveMain: false,
      lId: 0,
      customerId: 0
    }
  },
  methods: {
    edit (linkmans, customerId) {
      this.customerId = customerId
      var length = linkmans.length
      if (linkmans != null && length > 0) {
        var linkman = linkmans[0]
        if (length > 1) {
          linkman = linkmans[length - 1]
          linkmans.splice(length - 1, 1)
          this.linkmans = linkmans
        }
        this.lId = linkman.id
        this.haveMain = true // 修改时默认为有主联系人
        if (linkman.main === 1) { // 如果当前修改人为主联系人则可以修改是否为主联系人
          this.haveMain = false
        }
        this.setValue(linkman)
      }
    },
    handleEdit (record, index) {
      const { form: { validateFields } } = this
      validateFields((err, values) => {
        if (!err) {
          this.linkmans.splice(index, 1) // 去除列表中展示的
          this.setIdAndCid(values)
          if (record.id !== undefined && record.id !== 0) { // 修改需要将id带入
            this.lId = record.id
          }
          if (values.main === 1) { // 如果本次保存的为主联系人则其他联系人都不可设置为主联系人
            this.haveMain = true
          }
          if (record.main === 1) { //  如果将要修改的人为主联系人则可以修改是否为主联系人
            this.haveMain = false
          }
          this.linkmans.push(values)
          this.setValue(record)
        }
      })
    },
    setValue (linkman) { // 给表单赋值
      const { form: { setFieldsValue } } = this
      this.$nextTick(() => {
        // setFieldsValue只有通过这种方式给表单赋值
        setFieldsValue({
          name: linkman.name,
          sex: linkman.sex,
          main: linkman.main,
          position: linkman.position,
          phone: linkman.phone,
          weixin: linkman.weixin,
          qq: linkman.qq,
          email: linkman.email
        })
      })
      this.lId = linkman.id
    },
    setIdAndCid (values) {
      if (this.lId !== 0) {
        this.$set(values, 'id', this.lId)
      }
      if (this.customerId !== 0) { // 客户id
        this.$set(values, 'customerId', this.customerId)
      }
    },
    confirm (record, index) { // 确认删除事件
      const lId = record.id
      const main = record.main
      if (main === 1) {
        this.$message.error('不可删除主联系人！')
        return
      }
      if (lId !== undefined && lId !== 0) {
        delLinkman({ 'id': lId }).then(res => {
          if (res.code === 200) {
            this.linkmans.splice(index, 1)
          } else {
            this.$message.error(res.msg)
          }
        })
      } else {
        this.linkmans.splice(index, 1)
      }
    },
    addLinkman () {
      const { form: { validateFields } } = this
      validateFields((err, values) => {
        if (!err) {
          if (values.main === 1) {
            this.haveMain = true
          }
          this.setIdAndCid(values)
          this.lId = 0
          this.linkmans.push(values)
          this.form.resetFields() // 清空表
        } else {
          this.loading = false
        }
      })
    },
    nextStep () {
      // const that = this
      const { form: { validateFields } } = this
      this.loading = true
      validateFields((err, values) => {
        if (!this.haveMain && values.main !== 1) {
          this.$message.error('必须有一位主联系人!')
          this.loading = false
          return false
        }
        if (!err) {
          this.setIdAndCid(values)
          this.linkmans.push(values)
          this.$emit('nextStep', this.linkmans)
        } else {
          this.loading = false
        }
      })
    },
    prevStep () {
      this.$emit('prevStep')
    },
    checkPhone () {
      var phone = this.form.getFieldValue('phone')
      if (phone === undefined || phone.length < 1) {
        return
      }
      checkPhone({ id: this.lId, phone: phone }).then(res => {
        if (res.code === 200) {
          if (res.data.length > 0) {
            this.form.setFields({ 'phone': { value: '', errors: [{ 'message': '该手机号已经存在!', 'field': 'phone' }] } })
          }
        } else {
          console.log(res.msg)
        }
      })
    },
    handleCancel () {
      this.form.resetFields() // 清空表
    }
  },
  beforeDestroy () {
    clearTimeout(this.timer)
  }
}
</script>

<style lang="less" scoped>
  .stepFormText {
    margin-bottom: 24px;
    .ant-form-item-label,
    .ant-form-item-control {
      line-height: 22px;
    }
  }

</style>
