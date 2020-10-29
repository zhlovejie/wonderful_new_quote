<template>
  <a-modal
    :title="modalTitle"
    :width="650"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <a-spin :spinning="spinning">
      <a-form :form="form" class="add-form-wrapper">
        <a-form-item hidden>
          <a-input v-decorator="['id', { initialValue: detail.id }]" />
        </a-form-item>
        <table class="custom-table custom-table-border">
          <tr>
            <td style="width: 200px">岗位等级</td>
            <td>
              <a-form-item>
                <a-select
                  v-if="!isDisabled"
                  placeholder="岗位等级"
                  :allowClear="true"
                  v-decorator="[
                    `levelType`,
                    {
                      initialValue: detail.levelType,
                      rules: [{ required: true, message: '请选择岗位等级' }],
                    },
                  ]"
                >
                  <a-select-option v-for="level in levelList" :key="level" :value="level">{{ level }}</a-select-option>
                </a-select>
                <span v-else>{{ detail.levelType }}</span>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>油补(元)</td>
            <td>
              <a-form-item>
                <a-input-number
                  v-if="!isDisabled"
                  :min="0"
                  :step="1"
                  :precision="2"
                  style="width: 100%"
                  v-decorator="[
                    `oilAmount`,
                    {
                      initialValue: detail.oilAmount,
                      rules: [{ required: true, message: '请输入油补' }],
                    },
                  ]"
                />
                <span v-else>{{ detail.oilAmount | moneyFormatNumber }}</span>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>通讯补贴(元)</td>
            <td>
              <a-form-item>
                <a-input-number
                  v-if="!isDisabled"
                  :min="0"
                  :step="1"
                  :precision="2"
                  style="width: 100%"
                  v-decorator="[
                    `comAmount`,
                    {
                      initialValue: detail.comAmount,
                      rules: [{ required: true, message: '请输入通讯补贴' }],
                    },
                  ]"
                />
                <span v-else>{{ detail.comAmount | moneyFormatNumber }}</span>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>高级工程师补贴(元)</td>
            <td>
              <a-form-item>
                <a-input-number
                  v-if="!isDisabled"
                  :min="0"
                  :step="1"
                  :precision="2"
                  style="width: 100%"
                  v-decorator="[
                    `highEngAmount`,
                    {
                      initialValue: detail.highEngAmount,
                      rules: [{ required: true, message: '请输入高级工程师补贴' }],
                    },
                  ]"
                />
                <span v-else>{{ detail.highEngAmount | moneyFormatNumber }}</span>
              </a-form-item>
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
import { getSelectLevelList } from '@/api/systemSetting'
import { levelRuleAddOrUpdate } from '@/api/salaryManagement'
import moment from 'moment'

let uuid = () => Math.random().toString(32).slice(-10)

export default {
  name: 'AddForm',
  components: {},
  data() {
    return {
      levelList: [],
      form: this.$form.createForm(this),
      visible: false,
      actionType: 'add',
      spinning: false,
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
    departmentName() {
      let target = this.depList.find((item) => item.id === this.departmentId)
      if (target) {
        return target.departmentName || ''
      }
      return ''
    },
  },
  methods: {
    moment: moment,
    init() {
      let that = this
      return Promise.all([getSelectLevelList().then((res) => (that.levelList = res.data))])
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
          console.log(values)
          levelRuleAddOrUpdate(values)
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
      that.detail = {}
      await that.form.resetFields()
      await that.init()
      if (type === 'add') return
      //填充数据
      that.detail = record || {}
    },
  },
}
</script>

<style scoped>
.custom-table-border th,
.custom-table-border td {
  padding: 5px 10px;
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