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
            <td style="height: 51px">预警值</td>
            <td colspan="2">
              <a-form-item>
                <a-input-number
                  style="width: 400px"
                  placeholder="输入预警值"
                  v-decorator="['text', { rules: [{ required: true, message: '输入预警值!' }] }]"
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
                  v-decorator="['remarks', { rules: [{ required: false, message: '请输入备注' }] }]"
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
import { DictionaryModify, getDictionaryList, dictionaryAdd } from '@/api/workBox'

export default {
  name: 'BecomingForm',
  components: {},
  data() {
    return {
      visible: false,
      spinning: false,
      record: undefined,
      id: '',
      type: 'View',
      form: this.$form.createForm(this),
    }
  },
  computed: {
    modalTitle() {
      if (this.isEditSalary) {
        return '修改电费预警设置'
      }
      if (this.isView) {
        return '新增电费预警设置'
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
      } else {
        getDictionaryList({ code: 'electric_early_warn' }).then((res) => {
          this.id = res.data[0].id
        })
      }
    },

    fillData() {
      this.$nextTick(() => {
        console.log(this.record)
        this.form.setFieldsValue({
          text: this.record.text,
          remarks: this.record.remarks,
        })
      })
    },

    handleOk() {
      console.log('你是要提交')
      let that = this
      if (that.type === 'add') {
        that.spinning = true
        that.form.validateFields((err, values) => {
          if (!err) {
            values.parentId = this.id
            values.code = 'electric_early_warning'
            dictionaryAdd(values)
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
      } else if (that.type === 'edit-salary') {
        that.spinning = true
        that.form.validateFields((err, values) => {
          if (!err) {
            values.id = this.record.id
            values.code = this.record.code
            DictionaryModify(values)
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