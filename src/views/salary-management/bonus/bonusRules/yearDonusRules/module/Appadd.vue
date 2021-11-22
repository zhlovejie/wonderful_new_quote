<template>
  <a-modal
    :title="modalTitle"
    :width="800"
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
            <!-- <td>一期比列(%)：</td>
            <td colspan="2">
              <a-form-item>
                <a-input-number
                  style="width: 200px"
                  placeholder="请输入一期比列"
                  v-decorator="['firPart', { rules: [{ required: true, message: '请输入一期比列' }] }]"
                />
              </a-form-item>
            </td>
            <td>发放时间：</td>
            <td colspan="2">
              <a-form-item>
                <a-date-picker
                  style="border: none; width: 60%"
                  show-time
                  :precision="0"
                  placeholder="年月日"
                  format="YYYY-MM-DD"
                  v-decorator="['firSendDate', { rules: [{ required: true, message: '请选择预提货日期' }] }]"
                />
              </a-form-item>
            </td>
          </tr>

          <tr>
            <td>二期比列(%)</td>
            <td colspan="2">
              <a-form-item>
                <a-input-number
                  style="width: 200px"
                  placeholder="请输入一期比列"
                  v-decorator="['secPar', { rules: [{ required: true, message: '请输入二期比列' }] }]"
                />
              </a-form-item>
            </td>
            <td>发放时间：</td>
            <td colspan="2">
              <a-form-item>
                <a-date-picker
                  style="border: none; width: 60%"
                  show-time
                  placeholder="年月日"
                  format="YYYY-MM-DD"
                  v-decorator="['secSendDate', { rules: [{ required: true, message: '请选择预提货日期' }] }]"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>三期比列(%)</td>
            <td colspan="2">
              <a-form-item>
                <a-input-number
                  style="width: 200px"
                  placeholder="请输入三期比列"
                  v-decorator="['thrPar', { rules: [{ required: true, message: '请输入三期比列' }] }]"
                />
              </a-form-item>
            </td>
            <td>发放时间：</td>
            <td colspan="2">
              <a-form-item>
                <a-date-picker
                  style="border: none; width: 60%"
                  show-time
                  :precision="0"
                  placeholder="年月日"
                  format="YYYY-MM-DD"
                  v-decorator="['thrSendDate', { rules: [{ required: true, message: '请选择预提货日期' }] }]"
                />
              </a-form-item>
            </td> -->
          </tr>
        </table>
      </a-form>
    </a-spin>
  </a-modal>
</template>
<script>
import { year_delete_addAndUpdate } from '@/api/bonus_management'
import moment from 'moment'
export default {
  name: 'BecomingForm',
  data() {
    return {
      visible: false,
      spinning: false,
      record: {},
      type: 'View',
      form: this.$form.createForm(this),
    }
  },
  computed: {
    modalTitle() {
      if (this.isEditSalary) {
        return '修改发放规则'
      }
      if (this.isView) {
        return '新增发放规则'
      }
    },
    isView() {
      //新增
      return this.type === 'add'
    },
    isEditSalary() {
      //修改
      return this.type === 'edit-salary'
    },

    isDisabled() {
      return this.isView || this.isEditSalary
    },
  },
  watch: {},
  created() {},
  methods: {
    moment,

    query(type, record) {
      this.visible = true
      this.type = type
      this.record = record
      if (type === 'edit-salary') {
        this.fillData()
      }
    },

    fillData() {
      this.$nextTick(() => {
        console.log(this.record)
        this.form.setFieldsValue({
          firSendDate: moment(this.record.firSendDate),
          secSendDate: moment(this.record.secSendDate),
          thrSendDate: moment(this.record.thrSendDate),
          thrPar: Number(this.record.thrPar * 100).toFixed(1),
          secPar: Number(this.record.secPar * 100).toFixed(1),
          firPart: Number(this.record.firPart * 100).toFixed(1),
        })
      })
    },

    handleOk() {
      console.log('你是要提交')
      let that = this
      if (that.type === 'add' || that.type === 'edit-salary') {
        that.form.validateFields((err, values) => {
          if (!err) {
            let arr = Number(values.thrPar) + Number(values.secPar) + Number(values.firPart)
            if (arr == 100) {
              values.thrPar = values.thrPar / 100
              values.secPar = values.secPar / 100
              values.firPart = values.firPart / 100

              values.firSendDate = moment(values.firSendDate).format('YYYY-MM-DD')
              values.secSendDate = moment(values.secSendDate).format('YYYY-MM-DD')
              values.thrSendDate = moment(values.thrSendDate).format('YYYY-MM-DD')
              console.log(values)
              if (that.type !== 'add') {
                values.id = this.record.id
              }
              year_delete_addAndUpdate(values)
                .then((res) => {
                  that.spinning = false
                  that.form.resetFields() // 清空表
                  that.visible = false
                  that.$message.info(res.msg)
                  that.$emit('finish')
                })
                .catch((err) => (that.spinning = false))
            } else {
              this.$message.error('比例数相加要等于100')
            }
          }
        })
      } else {
        that.form.resetFields() // 清空表
        that.visible = false
      }
    },
    handleCancel() {
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
.process_tips {
  background-color: antiquewhite;
}
.process_header_wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: antiquewhite;
  font-weight: 700;
  border: 1px solid #ddd;
}
.process_header_wrapper .draggable-columns-2 {
  flex: 1;
}
.process_main_wrapper {
  border: 1px solid #ddd;
}
.process_main_wrapper .draggable-columns-item {
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #ddd;
}
.process_main_wrapper .draggable-columns-item:last-child {
  border-bottom: none;
}
.process_main_wrapper .draggable-columns-2 {
  flex: 1;
}
.draggable-columns {
  text-align: center;
  line-height: 35px;
  cursor: move;
}
.draggable-columns-1,
.draggable-columns-3 {
  width: 50%;
}
.draggable-columns-3 {
  cursor: pointer;
}
.ghost {
  background-color: rgba(250, 235, 215, 0.5);
}
</style>