<template>
  <a-modal
    :title="modalTitle"
    :width="750"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <a-spin :spinning="spinning">
      <a-form :form="form" class="add-form-wrapper">
        <a-form-item hidden>
          <a-input v-decorator="['id',{initialValue: detail.id}]" />
        </a-form-item>
        <table class="custom-table custom-table-border">
          <tr>
            <td>日期</td>
            <td>
              <div style="display:flex;justify-content: center;">
              <a-form-item>
                <a-month-picker 
                  v-if="!isDisabled"
                  placeholder="选择年月" 
                  style="width:160px;" 
                  v-decorator="[
                    `beginDate`,
                    {
                      initialValue: detail.beginDate ? moment(detail.beginDate+'-01') : undefined,
                      rules: [{ required: true, message: '请输入开始日期' }],
                    },
                  ]"
                />
                <span v-else>{{detail.beginDate}}</span>
              </a-form-item>
              <a-form-item><span style="margin:0 10px;">~</span></a-form-item>
              <a-form-item>
                <a-month-picker 
                  v-if="!isDisabled"
                  placeholder="选择年月" 
                  style="width:160px;" 
                  v-decorator="[
                    `endDate`,
                    {
                      initialValue: detail.endDate ? moment(detail.endDate+'-01') : undefined,
                      rules: [{ required: true, message: '请输入结束日期' }],
                    },
                  ]"
                />
                <span v-else>{{detail.endDate}}</span>
              </a-form-item>
              </div>
            </td>
          </tr>
          <tr>
            <td>部门</td>
            <td>
              <a-form-item >
                <a-select  
                  v-if="!isDisabled"
                  placeholder="部门" 
                  :allowClear="true"
                  v-decorator="[
                    `departmentId`,
                    {
                      initialValue: detail.departmentId,
                      rules: [{ required: true, message: '请输入天数' }],
                    },
                  ]"
                >
                  <a-select-option v-for="item in depList" :key="item.id" :value="item.id" >
                    {{item.departmentName}}
                  </a-select-option>
                </a-select>
                <span v-else>{{detail.departmentName}}</span>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>高温补贴(元/天)</td>
            <td>
                <a-form-item>
                  <a-input-number 
                    v-if="!isDisabled"
                    :min="0"
                    :step="1"
                    :precision="2"
                    style="width: 100%;"
                    v-decorator="[
                      `amount`,
                      {
                        initialValue: detail.amount,
                        rules: [{ required: true, message: '请输入金额' }],
                      },
                    ]"
                  />
                  <span v-else>{{detail.amount | moneyFormatNumber}}</span>
                </a-form-item>
              </div>
            </td>
          </tr>
          <tr>
            <td>备注</td>
            <td>
              <a-form-item>
                <a-textarea
                  v-if="!isDisabled"
                  style="width: 100%"
                  placeholder="备注"
                  :rows="2"
                  v-decorator="[
                    'remark',
                    { initialValue: detail.remark, rules: [{ required: false, message: '请输入备注' }] },
                  ]"
                />
                <span v-else>{{ detail.remark }}</span>
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
  departmentList, //所有部门
  getStationList, //获取部门下面的岗位
} from '@/api/systemSetting'
import { hignTemRuleRuleAddOrUpdate } from '@/api/salaryManagement'
import moment from 'moment'

export default {
  name: 'AddForm',
  components: {},
  data() {
    return {
      form: this.$form.createForm(this),
      visible: false,
      actionType: 'add',
      spinning: false,
      depList: [],
      detail: {},
    }
  },
  computed: {
    modalTitle() {
      let m = { view: '查看', add: '新增', edit: '修改', approval: '审批' }
      return `${m[this.actionType]}`
    },
    isView() {
      return this.actionType === 'view'
    },
    isAdd() {
      return this.actionType === 'add'
    },
    isEdit() {
      return this.actionType === 'edit'
    },
    isApproval() {
      return this.actionType === 'approval'
    },
    isDisabled() {
      //此状态下表单元素被禁用
      return this.isView || this.isApproval
    },
  },
  methods: {
    moment,
    init() {
      let that = this
      return Promise.all([departmentList().then((res) => (that.depList = res.data))])
    },
    async handleOk() {
      let that = this
      if (that.isView || that.isApproval) {
        that.handleCancel()
        return
      }
      this.form.validateFields((err, values) => {
        if (!err) {
          that.spinning = true
          if (values.beginDate) {
            values.beginDate = values.beginDate.format('YYYY-MM')
          }
          if (values.endDate) {
            values.endDate = values.endDate.format('YYYY-MM')
          }
          hignTemRuleRuleAddOrUpdate(values)
            .then((res) => {
              that.spinning = false
              console.log(res)
              let { code, msg } = res
              if (+code === 500) {
                that.$message.error(msg)
                return
              }
              that.$message.info(res.msg)
              that.$emit('finish')
              that.handleCancel()
            })
            .catch((err) => (that.spinning = false))
        }
      })
    },
    handleCancel() {
      this.form.resetFields()
      this.$nextTick(() => (this.visible = false))
    },
    async query(type, record) {
      let that = this
      that.visible = true
      that.actionType = type
      that.record = record || {}
      that.detail = {}
      await that.form.resetFields()
      await that.init()
      if (type === 'add') return
      //填充数据
      that.detail = { ...(record || {}) }
    },
  },
}
</script>

<style scoped>
.custom-table-border th,
.custom-table-border td {
  padding: 10px;
}

.add-form-wrapper >>> .custom-table {
  margin-bottom: 0;
}
.custom-table >>> .custom-table {
  margin: -1px;
}

.add-form-wrapper >>> .ant-form-item {
  display: flex;
  margin: 0;
}

.ant-form-item >>> .ant-form-item-label {
  width: 80px;
}
.ant-form-item >>> .ant-form-item-control-wrapper {
  flex: 1;
}
</style>