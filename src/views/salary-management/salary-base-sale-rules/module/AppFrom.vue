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
                  style="width: 190px"
                  placeholder="输入扣款"
                  v-decorator="['salerAmountBegin', { rules: [{ required: true, message: '请输入销售额起始值' }] }]"
                />
                <span> 至 </span>
                <a-input-number
                  :precision="2"
                  style="width: 190px"
                  placeholder="输入扣款"
                  v-decorator="['salerAmountEnd', { rules: [{ required: true, message: '请输入销售额结束值' }] }]"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>基本工资</td>
            <td colspan="2">
              <a-form-item>
                <a-input-number
                  :precision="2"
                  style="width: 400px"
                  placeholder="输入基本工资"
                  v-decorator="['salaryBigDeciaml', { rules: [{ required: true, message: '请输入扣款!' }] }]"
                />
              </a-form-item>
            </td>
          </tr>
          <tr v-for="(item, index) in bounsDicNames" :key="item.index">
            <td>{{ item.bounsDicName }}</td>
            <td colspan="2">
              <a-form-item>
                <a-input-number
                  :precision="6"
                  style="width: 400px"
                  placeholder="输入系数"
                  v-decorator="[
                    `bounsDicNames.${index}.bounsItemRetio`,
                    { initialValue: item.bounsItemRetio, rules: [{ required: true, message: '请输入系数!' }] },
                  ]"
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
import { salary_sale_saveOrUpdateSalerRule } from '@/api/bonus_management'

export default {
  name: 'BecomingForm',
  components: {},
  data() {
    return {
      visible: false,
      spinning: false,
      record: undefined,
      bounsDicNames: [],
      bounsDicIds: [],
      type: 'View',
      form: this.$form.createForm(this),
    }
  },
  computed: {
    modalTitle() {
      if (this.isEditSalary) {
        return '修改规则'
      }
      if (this.isView) {
        return '新增规则'
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
      if (type === 'add') {
        this.bounsDicNames = record.bounsDicNames.split(',')
        this.bounsDicNames = this.bounsDicNames.map((item) => {
          return {
            bounsDicName: item,
          }
        })
        this.bounsDicIds = record.bounsDicIds.split(',')
      } else {
        this.fillData()
      }
    },

    fillData() {
      this.$nextTick(() => {
        console.log(this.record)
        this.bounsDicNames = this.record.bounsItemVoList
        this.form.setFieldsValue({
          salerAmountBegin: this.record.salerAmountBegin,
          salerAmountEnd: this.record.salerAmountEnd,
          salaryBigDeciaml: this.record.salaryBigDeciaml,
        })
      })
    },

    handleOk() {
      let that = this
      if (that.type === 'add' || that.type === 'edit-salary') {
        that.form.validateFields((err, values) => {
          if (!err) {
            let target = values.bounsDicNames.every((p) => p.bounsItemRetio < 1)
            if (target) {
              if (that.type === 'add') {
                values.baseSalerId = this.record.id
                values.bounsItemBoList = values.bounsDicNames.map((item, index) => {
                  return {
                    bounsDicId: that.bounsDicIds[index],
                    bounsItemRetio: item.bounsItemRetio,
                  }
                })
              } else {
                values.baseSalerId = this.record.routerId
                values.id = this.record.id
                values.bounsItemBoList = values.bounsDicNames.map((item, index) => {
                  return {
                    bounsDicId: that.bounsDicNames[index].bounsDicId,
                    bounsItemRetio: item.bounsItemRetio,
                  }
                })
              }
            } else {
              return this.$message.error('单个系数不能大于1')
            }

            delete values.bounsDicNames
            that.spinning = true
            salary_sale_saveOrUpdateSalerRule(values)
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
        // that.form.resetFields() // 清空表
        // that.visible = false
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