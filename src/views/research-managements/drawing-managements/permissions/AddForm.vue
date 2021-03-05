<template>
  <a-modal
    :title="modalTitle"
    :width="650"
    :visible="visible"
    :destroyOnClose="true"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :confirmLoading="spinning"
    :maskClosable="false"
  >
    <a-spin :spinning="spinning">
      <a-form :form="form">
        <table class="custom-table custom-table-border">
          <tr>
            <td style="width:120px;">名称</td>
            <td>
              <a-form-item>
                <a-input
                  placeholder="名称"
                  allowClear
                  style="width:100%;"
                  v-decorator="['permissionName', {initialValue:detail.permissionName, rules: [{ required: true, message: '输入名称' }] }]"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>权限岗位</td>
            <td>
              <a-form-item
                hasFeedback
                :validateStatus="depPostTreeValidateStatus"
                :help="depPostTreeHelp"
              >
                <DepPostTree
                  :fillPost="detail.stations ? detail.stations : []"
                  @change="depPostTreeChange"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>备注</td>
            <td>
              <a-form-item>
                <a-textarea
                  placeholder
                  :rows="2"
                  v-decorator="['remark', {initialValue:detail.remark, rules: [{ required: false, message: '输入备注' }] }]"
                />
              </a-form-item>
            </td>
          </tr>
        </table>
      </a-form>
    </a-spin>
  </a-modal>
</template>
<script>
import { blueprintPermissionAddOrUpdate } from '@/api/researchManagement'
import DepPostTree from './DepPostTree'

export default {
  name: 'AddForm',
  components: {
    DepPostTree,
  },
  data() {
    return {
      form: this.$form.createForm(this),
      visible: false,
      spinning: false,
      type: 'view',
      detail: {},
      depPostList: [],
      depPostTreeValidateStatus: null,
      depPostTreeHelp: '',
    }
  },
  computed: {
    modalTitle() {
      return `${this.isView ? '查看' : this.isAdd ? '新增' : '编辑'}图纸权限`
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
      that.depPostTreeHelp = ''
      that.depPostTreeValidateStatus = null
      that.depPostList = []
      that.form.resetFields()
      that.type = type
      that.detail = Object.assign({}, record)
      await that.initData()
      that.visible = true
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
      that.depPostTreeValidateStatus = that.depPostList.length > 0 ? null : 'error'
      that.depPostTreeHelp = that.depPostList.length > 0 ? '' : '请选择权限岗位'
      this.form.validateFields((err, values) => {
        if (!err) {
          if (that.isEdit) {
            values.id = that.detail.id
          }
          if (that.depPostList.length === 0) {
            return
          }
          values.stationNames = that.depPostList.map((val) => val.name).join(',')
          values.stations = that.depPostList.map((val) => {
            return { stationId: val.id }
          })
          console.log('Received values of form: ', values)
          that.spinning = true

          blueprintPermissionAddOrUpdate(values)
            .then((res) => {
              that.spinning = false
              if (res.code === 200) {
                that.handleCancel()
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
      this.$nextTick(() => (this.visible = false))
    },
    depPostTreeChange(depPostList) {
      //{id:xx,name:''}
      this.depPostList = depPostList || []
      this.depPostTreeValidateStatus = this.depPostList.length > 0 ? null : 'error'
      this.depPostTreeHelp = this.depPostList.length > 0 ? '' : '请选择权限岗位'
    },
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
