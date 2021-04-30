<template>
  <a-modal
    title="新增实际退款"
    :width="800"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
    :confirmLoading="spinning"
  >
    <template slot="footer">
      <!-- <template v-if="isApproval">
        <a-button class="a-button" type="primary" icon="close" @click="noPassAction(recordDetails)">不通过</a-button>
        <a-button class="a-button" type="primary" icon="check" @click="passAction()">通过</a-button>
      </template> -->
      <template>
        <a-button key="back" @click="handleCancel">取消</a-button>
        <a-button key="submit" type="primary" :loading="spinning" @click="handleOk">提交</a-button>
      </template>
    </template>

    <a-spin :spinning="spinning">
      <a-form :form="form" class="becoming-form-wrapper">
        <table class="custom-table custom-table-border">
          <tr>
            <th>序号</th>
            <th>退款金额(元)</th>
            <th>退款日期</th>
            <th>操作</th>
          </tr>
          <tr v-for="(items, index) in programme" :key="items.key">
            <td>{{ index + 1 }}</td>
            <td>
              <a-form-item>
                <a-input-number
                  placeholderindex
                  :precision="2"
                  :disabled="items.id ? true : false"
                  @change="inputChange($event, items.key, 'refundAmount')"
                  v-decorator="[
                    `programme.${index}.refundAmount`,
                    { initialValue: items.refundAmount, rules: [{ required: true, message: '请输入退款金额' }] },
                  ]"
                />
              </a-form-item>
            </td>
            <td>
              <a-form-item>
                <a-date-picker
                  :disabled="items.id ? true : false"
                  @change="inputChange($event, items.key, 'refundDate')"
                  v-decorator="[
                    `programme.${index}.refundDate`,
                    {
                      initialValue: items.refundDate ? moment(items.refundDate) : undefined,
                      rules: [{ required: true, message: '请选择退款时间' }],
                    },
                  ]"
                />
              </a-form-item>
            </td>
            <td>
              <a @click="del(items.key)">删除</a>
            </td>
          </tr>
          <tr>
            <td colspan="4">
              <a-button style="width: 100%" type="dashed" icon="plus" @click="addItem"></a-button>
            </td>
          </tr>
        </table>
        <div class="totals">
          <span>合计退款(元)：{{ totalPrice }}</span>
        </div>
      </a-form>
    </a-spin>
  </a-modal>
</template>
<script>
import moment from 'moment'
import { addRefundReality, getListByRefundId } from '@/api/receipt'
let uuid = () => Math.random().toString(32).slice(-10)

export default {
  name: 'BecomingForm',

  data() {
    return {
      todayList: [],
      programme: [],
      // refundDate: [],
      month: '',
      monthsll: '',
      remark: '',
      months: '',
      visible: false,
      visibleMonth: false,
      year: '',
      spinning: false,
      ment: false,
      form: this.$form.createForm(this, { name: 'do_becoming' }),
      type: 'view',
      record: {},
      isModified: false, //财务人员为 true
      previewVisible: false,
    }
  },
  computed: {
    totalPrice() {
      return this.programme.reduce((addr, item) => {
        addr = Number(addr) + Number(item.refundAmount)
        return parseFloat(addr).toFixed(2)
      }, 0)
    },
  },

  methods: {
    moment,
    inputChange(event, keys, field) {
      let programme = [...this.programme]
      let target = programme.find((item) => item.key === keys)
      if (target) {
        target[field] = event instanceof Event ? event.target.value : event
        this.programme = programme
      }
    },
    addItem() {
      let that = this
      that.programme.push({
        key: uuid(),
        refundAmount: '',
        refundDate: undefined,
      })
    },
    del(key) {
      let that = this
      that.programme = that.programme.filter((item) => item.key !== key || item.id)
    },
    query(type, record) {
      this.visible = true
      this.type = type
      this.record = record
      getListByRefundId({ refundId: record.id }).then((res) => {
        this.programme = res.data.map((item) => {
          return {
            key: uuid(),
            id: item.id,
            refundDate: moment(item.refundDate),
            refundAmount: item.refundAmount,
          }
        })
      })
    },

    handleOk() {
      let that = this
      if (that.type === 'view') {
        this.visible = false
      } else {
        that.form.validateFields((err, values) => {
          if (!err) {
            if (that.record.refundAmountMoney < this.totalPrice) {
              return that.$message.error('实际退款总金额不能大于预退款总金额')
            }
            values.refundId = this.record.id
            values.refundRealityList = values.programme || []
            delete values.programme
            values.refundRealityList =
              values.refundRealityList.map((item) => {
                return {
                  refundDate: moment(item.refundDate).format('YYYY-MM-DD'),
                  refundAmount: item.refundAmount,
                }
              }) || []
            that.spinning = true
            addRefundReality(values)
              .then((res) => {
                this.programme = []
                this.visible = false
                that.spinning = false
                that.$message.info(res.msg)
                that.$emit('finish')
              })
              .catch((err) => (that.spinning = false))
          }
        })
      }
    },
    handleCancel() {
      this.programme = []
      this.remark = '' // 清空表
      this.visible = false
    },
  },
}
</script>
<style scoped>
.totals {
  float: right;
}
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