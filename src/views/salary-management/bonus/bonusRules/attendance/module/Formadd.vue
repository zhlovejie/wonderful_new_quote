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
            <td>出勤天数(天)</td>
            <td colspan="2">
              <a-form-item>
                <span>大于等于</span>
                <a-select
                  placeholder="选择天数"
                  v-decorator="['onDutyDays', { rules: [{ required: true, message: '请选择天数' }] }]"
                  :allowClear="true"
                  style="width: 130px; margin: 0 10px"
                >
                  <a-select-option :value="1">1</a-select-option>
                  <a-select-option :value="2">2</a-select-option>
                  <a-select-option :value="3">3</a-select-option>
                  <a-select-option :value="4">4</a-select-option>
                  <a-select-option :value="5">5</a-select-option>
                  <a-select-option :value="6">6</a-select-option>
                  <a-select-option :value="7">7</a-select-option>
                  <a-select-option :value="8">8</a-select-option>
                  <a-select-option :value="9">9</a-select-option>
                  <a-select-option :value="10">10</a-select-option>
                  <a-select-option :value="12">12</a-select-option>
                  <a-select-option :value="13">13</a-select-option>
                  <a-select-option :value="14">14</a-select-option>
                  <a-select-option :value="15">15</a-select-option>
                  <a-select-option :value="16">16</a-select-option>
                  <a-select-option :value="17">17</a-select-option>
                  <a-select-option :value="18">18</a-select-option>
                  <a-select-option :value="19">19</a-select-option>
                  <a-select-option :value="20">20</a-select-option>
                  <a-select-option :value="21">21</a-select-option>
                  <a-select-option :value="22">22</a-select-option>
                  <a-select-option :value="23">23</a-select-option>
                  <a-select-option :value="24">24</a-select-option>
                  <a-select-option :value="25">25</a-select-option>
                  <a-select-option :value="26">26</a-select-option>
                  <a-select-option :value="27">27</a-select-option>
                  <a-select-option :value="28">28</a-select-option>
                  <a-select-option :value="29">29</a-select-option>
                  <a-select-option :value="30">30</a-select-option>
                  <a-select-option :value="31">31</a-select-option>
                </a-select>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>条件</td>
            <td colspan="2">
              <a-form-item>
                <span>请假时长小于等于</span>
                <a-select
                  placeholder="选择小时"
                  v-decorator="['maxLeaveHours', { rules: [{ required: true, message: '请选择小时' }] }]"
                  :allowClear="true"
                  style="width: 130px; margin: 0 10px"
                >
                  <a-select-option :value="1">1</a-select-option>
                  <a-select-option :value="2">2</a-select-option>
                  <a-select-option :value="3">3</a-select-option>
                  <a-select-option :value="4">4</a-select-option>
                  <a-select-option :value="5">5</a-select-option>
                  <a-select-option :value="6">6</a-select-option>
                  <a-select-option :value="7">7</a-select-option>
                  <a-select-option :value="8">8</a-select-option>
                </a-select>
                <span>每小时</span>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>奖金(元/h)</td>
            <td colspan="2">
              <a-form-item>
                <a-input-number
                  :precision="2"
                  style="width: 400px"
                  placeholder="输入奖金"
                  v-decorator="['bonus', { rules: [{ required: true, message: '请输入奖金!' }] }]"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>备注</td>
            <td colspan="2">
              <a-form-item>
                <a-textarea
                  style="width: 400px"
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
import { attendance_add } from '@/api/bonus_management'

export default {
  name: 'BecomingForm',
  components: {},
  data() {
    return {
      visible: false,
      spinning: false,
      record: undefined,
      type: 'View',
      form: this.$form.createForm(this),
    }
  },
  computed: {
    modalTitle() {
      if (this.isEditSalary) {
        return '修改全勤规则'
      }
      if (this.isView) {
        return '新增全勤规则'
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
  methods: {
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
        this.form.setFieldsValue({
          onDutyDays: this.record.onDutyDays,
          maxLeaveHours: this.record.maxLeaveHours,
          bonus: this.record.bonus,
          remark: this.record.remark,
        })
      })
    },

    handleOk() {
      console.log('你是要提交')
      let that = this
      if (that.type === 'add' || that.type === 'edit-salary') {
        that.spinning = true
        that.form.validateFields((err, values) => {
          if (!err) {
            let arr = {}
            if (that.type !== 'add') {
              values.id = this.record.id
            }
            attendance_add(values)
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