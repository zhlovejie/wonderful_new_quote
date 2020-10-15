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
            <td style="width: 200px">名称</td>
            <td>
              <a-form-item>
                <a-input
                  v-if="!isDisabled"
                  placeholder="名称"
                  :allowClear="true"
                  v-decorator="[
                    `name`,
                    {
                      initialValue: detail.name,
                      rules: [{ required: true, message: '请输入名称' }],
                    },
                  ]"
                />
                <span v-else>{{ detail.name }}</span>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>补贴规则</td>
            <td style="margin:0;padding:0;">
              <table class="custom-table custom-table-border">
                <tr>
                  <th>工龄年限(年)</th>
                  <th>金额(元)/月</th>
                  <th v-if="!isDisabled">操作</th>
                </tr>
                <template v-if="!isDisabled">
                <tr v-for="(item,idx) in detail.detailRules" :key="item.key">
                  <td>
                    <a-form-item>
                      <a-select 
                        style="width: 80px;" 
                        @change="(e) => ruleChangeAction(item.key,'ageNum',e)"
                        v-decorator="[
                          `detailRules.${idx}.ageNum`,
                          {
                            initialValue: item.ageNum,
                            rules: [{ required: true, message: '请选择工龄年限' }]
                          }
                        ]"
                      >
                        <a-select-option v-for="val in 10" :key="val" >{{val}}</a-select-option>
                      </a-select>
                    </a-form-item>
                  </td>
                  <td>
                    <a-form-item>
                      <a-input-number
                        :min="0"
                        :step="1"
                        :precision="2"
                        style="width: 120px;" 
                        @change="(e) => ruleChangeAction(item.key,'amount',e)"
                        v-decorator="[
                          `detailRules.${idx}.amount`,
                          {
                            initialValue: item.amount,
                            rules: [{ required: true, message: '请输入金额' }],
                          }
                        ]"
                      />
                    </a-form-item>
                  </td>
                  <td><a href="javascript:void(0);" @click="() => ruleAction('remove',item.key)">删除</a></td>
                </tr>
                <tr>
                  <td colspan="3">
                    <a-button
                      style="width:100%;"
                      type="dashed"
                      icon="plus"
                      @click="() => ruleAction('add',null)"
                    >添加</a-button>
                  </td>
                </tr>
                </template>
                <template v-else>
                  <tr v-for="(item) in detail.detailRules" :key="item.key">
                    <td>{{item.ageNum}}</td>
                    <td>{{item.amount | moneyFormatNumber}}</td>
                  </tr>
                </template>
              </table>

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
import {lengthServiceRuleDetail, lengthServiceRuleAddOrUpdate } from '@/api/salaryManagement'
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
    ruleAction(type,key){
      let that = this
      let detail = {...that.detail}
      let detailRules = detail.detailRules || []
      if(type === 'add'){
        detailRules.push({
          key:uuid(),
          ageNum:undefined,
          amount:undefined
        })
      }else if(type === 'remove'){
        detailRules = detailRules.filter(item => item.key !== key)
      }
      detail.detailRules = detailRules
      that.detail = detail
    },
    ruleChangeAction(key,field,val){
      let that = this
      let detail = {...that.detail}
      let detailRules = detail.detailRules || []
      
      let target = detailRules.find(item => item.key === key)
      if(target){
        target[field] = +val
      }

      detail.detailRules = detailRules
      that.detail = detail
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
          lengthServiceRuleAddOrUpdate(values)
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
      lengthServiceRuleDetail({id:record.id}).then(res =>{
        let data = res.data 
        data.detailRules = data.detailRules.map(item =>{
          item.key = uuid()
          return item
        })
        that.detail = data
      })
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