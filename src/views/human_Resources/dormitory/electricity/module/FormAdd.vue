<template>
  <a-modal
    :title="modalTitle"
    :width="635"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
    :confirmLoading="spinning"
  >
    <template slot="footer">
      <template>
        <a-button key="back" @click="handleCancel">取消</a-button>
        <a-button key="submit" type="primary" :loading="spinning" @click="handleOk">确定</a-button>
      </template>
    </template>

    <a-spin :spinning="spinning">
      <a-form :form="form" class="becoming-form-wrapper">
        <table class="custom-table custom-table-border">
          <tr>
            <td>房间号</td>
            <td colspan="3">
              <a-form-item>
                <a-input
                  style="width:300px;"
                  placeholder="请输入房间号"
                  v-decorator="['roomCode', {rules: [ {required: true,  message: '请输入房间号'},]}]"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>床位数</td>
            <td colspan="3">
              <a-form-item>
                <a-input
                  style="width:300px;"
                  placeholder="请输入房间床位数"
                  v-decorator="['bedNumber', {rules: [{required: true,message: '请输入房间床位数!',},]}]"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>电表号</td>
            <td colspan="3">
              <a-form-item>
                <a-input
                  style="width:300px;"
                  placeholder="请输入电表号"
                  v-decorator="['meterCode', {rules: [ {required: true,  message: '请输入房间号'},]}]"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>备注</td>
            <td colspan="3">
              <a-form-item>
                <a-textarea
                  style="width:300px;"
                  placeholder="请输入备注"
                  :rows="3"
                  v-decorator="['remark', { rules: [{ required: false, message: '请输入备注' }] }]"
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
import { electricity_Add, electricity_Detail } from '@/api/humanResources'

export default {
  name: 'BecomingForm',

  data() {
    return {
      visible: false,
      spinning: false,
      recordDetails: {},
      record: {},
      type: 'add',
      form: this.$form.createForm(this, { name: 'do_becoming' }),
    }
  },
  computed: {
    modalTitle() {
      if (this.isEditSalary) {
        return '房间'
      }
      let txt = this.isView ? '新增' : '修改'
      return `${txt}房间`
    },
    isView() {
      //查看
      return this.type === 'add'
    },
    isEditSalary() {
      //修改
      return this.type === 'edit-salary'
    },
  },
  methods: {
    query(type, record) {
      console.log(type, record)
      this.visible = true
      this.type = type
      this.record = record
      if (type === 'edit-salary') {
        this.fillData()
      }
    },

    fillData() {
      let that = this
      let id = {
        id: this.record.id,
      }
      electricity_Detail(id).then((res) => {
        that.recordDetails = res.data
        that.form.setFieldsValue({
          roomCode: res.data.roomCode,
          bedNumber: res.data.bedNumber,
          meterCode: res.data.meterCode,
          remark: res.data.remark,
        })
      })
    },

    handleOk() {
      console.log('你是要提交')
      let that = this
      if (that.type === 'add' || that.type === 'edit-salary') {
        that.form.validateFields((err, values) => {
          if (!err) {
            if (that.type !== 'add') {
              values.id = that.record.id
            }
            electricity_Add(values)
              .then((res) => {
                that.spinning = false
                that.form.resetFields() // 清空表
                that.visible = false
                that.$message.info(res.msg)
                that.$emit('finish')
              })
              .catch((err) => (that.spinning = false))
          }
        })
      } else {
        that.form.resetFields() // 清空表
        that.visible = false
      }
    },
    handleCancel() {
      this.fileList = []
      this.form.resetFields() // 清空表
      this.visible = false
    },
  },
}
</script>
<style scoped>
/*自定义table样式*/
.custom-table {
  margin-bottom: 0;
}

.custom-table-border th,
.custom-table-border td {
  padding: 5px 10px;
}

.custom-table >>> .custom-table {
  position: relative;
  top: 0;
  left: 0;
  width: calc(100% + 2px);
  margin-bottom: -2px;
}
.custom-table >>> .custom-table td {
  text-align: left;
}
.becoming-form-wrapper >>> .ant-form-item {
  margin-bottom: 0;
}

.bank-card-list-wrapper {
  display: flex;
}
.bank-card-list-wrapper >>> .ant-form-item {
  display: flex;
  margin: 0 7px;
}
</style>