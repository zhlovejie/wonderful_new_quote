<template>
  <a-modal
    :title="modalTitle"
    :width="600"
    :visible="visible"
    :destroyOnClose="true"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :confirmLoading="spinning"
    :maskClosable="false"
  >
    <a-spin :spinning="spinning">
      <a-form :form="form" class="wdf-custom-form-wrapper">
        <a-form-item hidden>
          <a-input v-decorator="['id',{initialValue:detail.id}]" />
        </a-form-item>
        <table class="custom-table custom-table-border">
          <tr>
            <td>违规人员</td>
            <td >
              <DepUserSelect @change="depUserChange" :depId="detail.departmentId" :userId="detail.userId" />
              <a-form-item hidden>
                <a-input v-decorator="['departmentId',{initialValue:detail.departmentId}]" />
              </a-form-item>
              <a-form-item hidden>
                <a-input v-decorator="['userId',{initialValue:detail.userId,rules: [{required: true,message: '选择保管人'}]}]" />
              </a-form-item>
            </td>
          </tr>
        </table>
      </a-form>

    </a-spin>
  </a-modal>
</template>
<script>

import {
  carIllegalAddUser,carIllegalDetail
} from '@/api/vehicleManagement'
import DepUserSelect from '@/components/CustomerList/DepUserSelect'
import moment from 'moment'

export default {
  name: 'AddForm',
  components: {
    DepUserSelect
  },
  data() {
    return {
      form: this.$form.createForm(this, { name: 'add_form' }),
      visible: false,
      spinning: false,
      type: 'view',
      record: {},
      detail: {}
    }
  },
  watch: {},
  computed: {
    isAdd() {
      return this.type === 'addUser'
    },
    isEdit() {
      return this.type === 'editUser'
    },
    modalTitle() {
      return this.type === 'addUser' ? '新增' : '编辑'
    },
  },
  methods: {
    moment,
    async query(type, record) {
      let that = this
      that.visible = true
      that.type = type
      that.record = Object.assign({}, record)
      that.detail = {}
      that.form.resetFields()
      await that.initData()
      that.spinning = true
      let _detail = null
      try {
        _detail = await carIllegalDetail({ id: record.id }).then((res) => res.data)
        that.spinning = false
        that.detail = { ..._detail || {} }
      } catch (err) {
        console.log(err)
        that.spinning = false
      }
    },
    initData() {
      let that = this
      let queue = []
      return Promise.all(queue)
    },

    handleSubmit() {
      let that = this
      if (that.isView) {
        that.handleCancel()
        return
      }

      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          that.spinning = true
          carIllegalAddUser(values)
            .then((res) => {
              that.spinning = false
              if (res.code === 200) {
                that.visible = false
                that.$message.success('操作成功')
                that.$emit('finish')
              } else {
                that.$message.warning(res.msg)
              }
            })
            .catch((err) => {
              that.spinning = false
              that.$message.error('操作失败')
            })
        }
      })
    },
    handleCancel() {
      this.form.resetFields()
      this.$nextTick(() => (this.visible = false))
    },
    depUserChange(depId,userId){
      this.form.setFieldsValue({
        'departmentId':depId,
        'userId':userId
      })
    }
  }
}
</script>
<style scoped>
.wdf-custom-form-wrapper >>> .ant-form-item {
  margin-bottom: 0;
}
.wdf-custom-form-wrapper >>> .custom-table td {
  padding: 5px 10px;
  text-align: center;
}

.wdf-custom-form-wrapper >>> .ant-upload-list-picture-card .ant-upload-list-item-info::before{
  left: 0;
}
</style>
