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
            <td>销售额（万元）</td>
            <td colspan="2">
              <a-form-item>
                <a-input-number
                  :precision="2"
                  :disabled="isSee"
                  style="width: 190px"
                  placeholder="开始销售额"
                  v-decorator="['startQuota', { rules: [{ required: true, message: '请输入销售额起始值' }] }]"
                />
                <span> 至 </span>
                <a-input-number
                  :precision="2"
                  :disabled="isSee"
                  style="width: 190px"
                  placeholder="结束销售额"
                  v-decorator="['endQuota', { rules: [{ required: true, message: '请输入销售额结束值' }] }]"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>活跃度指数</td>
            <td colspan="2">
              <a-form-item>
                <a-input-number
                  :precision="2"
                  :disabled="isSee"
                  style="width: 400px"
                  placeholder="输入活跃度指数"
                  v-decorator="['exponent', { rules: [{ required: true, message: '请输入扣款!' }] }]"
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
import { saveAndUpdateIndexAdd } from '@/api/saleReport'

export default {
  name: 'BecomingForm',
  components: {},
  data() {
    return {
      visible: false,
      spinning: false,
      record: undefined,
      recordtype: {},
      bounsDicNames: [],
      bounsDicIds: [],
      type: 'View',
      form: this.$form.createForm(this),
    }
  },
  computed: {
    modalTitle() {
      if (this.isEditSalary) {
        return this.recordtype.type === 1
          ? '修改销售额指数'
          : this.recordtype.type === 2
          ? '修改销售订单指数'
          : '修改平均销售额指数'
      }
      if (this.isSee) {
        return this.recordtype.type === 1
          ? '查看销售额指数'
          : this.recordtype.type === 2
          ? '查看销售订单指数'
          : '查看平均销售额指数'
      }
      if (this.isView) {
        return this.recordtype.type === 1
          ? '新增销售额指数'
          : this.recordtype.type === 2
          ? '新增销售订单指数'
          : '新增平均销售额指数'
      }
    },
    isView() {
      //新增
      return this.type === 'add'
    },
    isSee() {
      //查看
      return this.type === 'see'
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
    query(type, record, recordtype) {
      this.visible = true
      this.type = type
      this.recordtype = recordtype
      this.record = record
      if (type !== 'add') {
        this.fillData()
      }
    },

    fillData() {
      this.$nextTick(() => {
        console.log(this.record)
        this.form.setFieldsValue({
          startQuota: this.record.startQuota,
          endQuota: this.record.endQuota,
          exponent: this.record.exponent,
        })
      })
    },

    handleOk() {
      let that = this
      if (this.type === 'see') {
        that.visible = false
      }
      if (that.type === 'add' || that.type === 'edit-salary') {
        that.form.validateFields((err, values) => {
          if (!err) {
            if (that.type !== 'add') {
              values.id = this.record.id
              values.type = this.recordtype.type
            } else {
              values.type = this.recordtype.type
            }
            that.spinning = true
            saveAndUpdateIndexAdd(values)
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