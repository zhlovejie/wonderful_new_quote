<template>
  <a-modal
    :title="modalTitle"
    :width="600"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <a-spin :spinning="spinning">
      <a-form :form="form" class="add-form-wrapper">
        <table class="custom-table custom-table-border">
          <tr>
            <td style="width: 150px">设备名称</td>
            <td>
              <a-input style="width: 100%" v-model="name" />
            </td>
          </tr>
          <tr>
            <td>主板号</td>
            <td style="color: #929292">
              {{ mainboardNum }}
            </td>
          </tr>
          <tr>
            <td>设备位置</td>
            <td>
              <a-input style="width: 100%" v-model="address" />
            </td>
          </tr>
          <tr>
            <td>物联网卡卡号</td>
            <td>
              <a-input style="width: 100%" v-model="cardNetNum" />
            </td>
          </tr>
        </table>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { updateDeviceInfo } from '@/api/attendanceManagement'
export default {
  name: 'editForm',
  data() {
    return {
      form: this.$form.createForm(this, { name: 'editForm' }),
      visible: false,
      spinning: false,
      record: {},
      modalTitle: '设备名称',
      modelName: '',
      productList: [],
      deviceInfo: {},
      name: '',
      address: '',
      mainboardNum: '',
      cardNetNum: '',
    }
  },
  methods: {
    init() {
      let that = this
      let queue = []
      return Promise.all(queue)
    },
    async handleOk() {
      let that = this
      let values = {
        id: that.record.id,
        address: this.address,
        name: this.name,
        cardNetNum: this.cardNetNum,
      }
      that.spinning = false
      updateDeviceInfo(values)
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
          console.log(err)
          that.$message.error('操作失败')
          that.spinning = false
        })
    },
    handleCancel() {
      this.form.resetFields()
      this.$nextTick(() => (this.visible = false))
    },
    async query(record) {
      this.record = record
      console.log(record)
      this.visible = true
      this.name = record.name
      this.address = record.address
      this.mainboardNum = record.mainboardNum
      this.cardNetNum = record.cardNetNum
    },
  },
}
</script>

<style scoped>
</style>