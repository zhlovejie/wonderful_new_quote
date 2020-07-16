<template>
  <a-modal
    :title="modalTitle"
    :width="600"
    :visible="visible"
    :destroyOnClose="true"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <template slot="footer">
      <template v-if="isApproval">
        <a-button key="back" icon="close" @click="noPassAction">不通过</a-button>
        <a-button
          key="submit"
          type="primary"
          icon="check"
          :loading="spinning"
          @click="passAction"
        >通过</a-button>
      </template>
      <template v-else>
        <a-button key="back" @click="handleCancel">取消</a-button>
        <a-button key="submit" type="primary" :loading="spinning" @click="handleSubmit">确定</a-button>
      </template>
    </template>
    <a-spin :spinning="spinning">
      <a-form :form="form" layout="inline" class="wdf-custom-add-form-wrapper">
        <a-form-item hidden>
          <a-input v-decorator="['id',{initialValue:detail.id}]" />
        </a-form-item>
        <a-form-item hidden>
          <a-input v-decorator="['instanceId',{initialValue:detail.instanceId}]" />
        </a-form-item>
        <table
          class="custom-table custom-table-border"
          style="table-layout:fixed;word-break:break-all"
        >
          <tr>
            <td style="width:120px;">节假日名称</td>
            <td>
              <a-form-item>
                <a-input v-if="isAdd || isEdit" v-decorator="['festivalName',{initialValue:detail.festivalName,rules: [{required: true,message: '输入节假日名称'}]}]" :allowClear="true"/>
                <span class="word-break" v-else>{{detail.festivalName}}</span>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td style="width:120px;">开始日期</td>
            <td>
              <a-form-item>
                <a-date-picker v-if="isAdd || isEdit" @change="dateChange"  placeholder="开始日期" v-decorator="['beginDate',{initialValue:detail.beginDate ? moment(detail.beginDate) : undefined,rules: [{required: true,message: '请选择开始日期'}]}]" style="width:100%;" />
                <span v-else>{{detail.beginDate}}</span>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td style="width:120px;">结束日期</td>
            <td>
              <a-form-item>
                <a-date-picker v-if="isAdd || isEdit" @change="dateChange" placeholder="结束日期" v-decorator="['endDate',{initialValue:detail.endDate ? moment(detail.endDate) :undefined,rules: [{required: true,message: '请选择结束日期'}]}]" style="width:100%;" />
                <span v-else>{{detail.endDate}}</span>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td style="width:120px;">总计(天)</td>
            <td>
              <a-form-item>{{diffDate}}</a-form-item>
            </td>
          </tr>

          <tr>
            <td style="width:120px;">调休日期</td>
            <td>
              <a-form-item>
                <span @click="openDateModel" v-if="isAdd || isEdit">
                  {{changeRestDateTxt || '点击选择日期'}}
                </span>
                <span class="word-break" v-else>
                  {{changeRestDateTxt}}
                </span>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td style="width:120px;">试用部门</td>
            <td>
              <a-form-item>
                <div style="display:flex;" v-if="isAdd || isEdit">
                <a-select 
                  mode="multiple"
                  placeholder="选择部门"
                  v-decorator="['useDepartments',{initialValue:detail.useDepartments,rules: [{required: true,message: '请选择部门'}]}]"
                  :allowClear="true" 
                  style="width:100%;margin-right:10px;"
                  @blur="useDepartmentsChange('blur')"
                  @focus="useDepartmentsChange('focus')"
                  :open="useDepartmentsOpen"
                >
                  

                  <!-- 管理人员 -->
                  <a-select-opt-group label="管理人员">
                  <a-select-option
                    v-for="item in depList.filter(item=>item.parentId===4)"
                    :key="item.id"
                    :value="item.id"
                  >{{item.departmentName}}</a-select-option>
                  </a-select-opt-group>
                  <!-- 车间人员 -->
                  <a-select-opt-group label="车间人员">
                  <a-select-option
                    v-for="item in depList.filter(item=>item.parentId!==4)"
                    :key="item.id"
                    :value="item.id"
                  >{{item.departmentName}}</a-select-option>
                  </a-select-opt-group>
                </a-select>
                <a-button @click="useDepartmentsCheckAll">全选/反选</a-button>
                </div>
                <span class="word-break" v-else>{{detail.useDepartmentName}}</span>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td style="width:120px;">通知信息</td>
            <td>
              <a-form-item >
                <a-textarea 
                  v-if="isAdd || isEdit"
                  placeholder="通知信息"
                  :rows="2"
                  v-decorator="['informContent', {  initialValue:detail.informContent,rules: [{ required: true, message: '请输入通知信息' }] }]"
                />
                <span class="word-break" v-else>{{detail.informContent}}</span>  
              </a-form-item>
              
            </td>
          </tr>
        </table>
      </a-form>
    </a-spin>
    <Approval ref="approval" @opinionChange="opinionChange" />
    <MultipleCalendarDates ref="multipleCalendarDates" @change="multipleCalendarDatesChange" />
  </a-modal>
</template>
<script>
import {
  departmentList //所有部门
} from '@/api/systemSetting'
import MultipleCalendarDates from '@/components/CustomerList/MultipleCalendarDates'
import { festivalRuleDetail, festivalRuleAddAndUpdate, festivalRuleApproval } from '@/api/attendanceManagement'
import Approval from './Approval'
import moment from 'moment'
let uuid = () =>
  Math.random()
    .toString(32)
    .slice(-10)

export default {
  name: 'vacation-management-add',
  components: { 
    Approval, 
    MultipleCalendarDates,
    VNodes: {
      functional: true,
      render: (h, ctx) => ctx.props.vnodes,
    },
  },
  data() {
    return {
      checkAll:false,
      indeterminate: true,
      plainOptions:[],
      form: this.$form.createForm(this),
      visible:false,
      spinning:false,
      actionType:'view',
      detail:{},
      record:{},
      spinning:false,
      depList:[],
      diffDate:0,
      changeRestDate:[],
      useDepartmentsOpen:false,
      useDepartmentsToggleFlag:false
    }
  },
  computed: {
    modalTitle() {
      let obj = { view: '查看', add: '新增', edit: '修改', approval: '审批' }
      return `${obj[this.actionType]}节假日规则`
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
    changeRestDateTxt() {
      return this.changeRestDate.join(',')
    }
  },
  methods: {
    moment,
    init() {
      let that = this
      let queue = []
      let task1 = departmentList().then(res => (this.plainOptions=that.depList = res.data))
      queue.push(task1)
      return Promise.all(queue)
    },
    async query(type, record) {
      //debugger
      let that = this

      ;(that.actionType = type), (that.record = Object.assign({}, record))
      that.form.resetFields()
      that.changeRestDate = []
      that.diffDate = 0
      that.detail = {}
      await that.init()
      that.visible = true
      if (that.isAdd) {
        that.detail = {}
        return
      }
      if (record) {
        festivalRuleDetail({ id: record.id }).then(res => {
          //debugger
          let obj = { ...res.data }
          if (res.data.changeRestDate) {
            let _obj = {}
            that.changeRestDate = res.data.changeRestDate.split(',')
          } else {
            that.changeRestDate = []
          }

          //obj.beginDate = moment(obj.beginDate)
          //obj.endDate = moment(obj.endDate)
          that.diffDate = obj.days || 0
          console.log(obj.useDepartments)

          if (obj.useDepartments) {
            obj.useDepartments = obj.useDepartments.split(',').map(v => +v)
          }
          that.detail = { ...obj }
          console.log(this.detail)
          if (that.isEdit) {
          }
        })
      }
    },
    handleSubmit() {
      let that = this
      this.form.validateFields((err, values) => {
        if (!err) {
          that.spinning = true

          values.beginDate = values.beginDate.format('YYYY-MM-DD')
          values.endDate = values.endDate.format('YYYY-MM-DD')
          values.useDepartments = values.useDepartments.join(',')
          values.changeRestDate =
            Array.isArray(that.changeRestDate) && that.changeRestDate.length > 0
              ? that.changeRestDate.join(',')
              : undefined

          console.log('Received values of form: ', values)

          festivalRuleAddAndUpdate(values)
            .then(res => {
              that.$message.info(res.msg)
              that.spinning = false
              that.handleCancel()
              that.$emit('finish')
            })
            .catch(err => {
              that.spinning = false
            })
        }
      })
    },
    handleCancel() {
      this.form.resetFields()
      this.$nextTick(() => (this.visible = false))
    },
    submitAction(opt) {
      let that = this
      let values = Object.assign({}, opt || {}, { approveId: that.record.id })
      that.spinning = true
      festivalRuleApproval(values)
        .then(res => {
          that.spinning = false
          console.log(res)
          that.form.resetFields() // 清空表
          that.visible = false
          that.$message.info(res.msg)
          that.$emit('finish')
        })
        .catch(err => (that.spinning = false))
    },
    passAction(opt = {}) {
      this.submitAction(Object.assign({}, { isAdopt: 0, opinion: '通过' }, opt || {}))
    },
    noPassAction() {
      let that = this
      that.$refs.approval.query()
    },
    opinionChange(opinion) {
      //审批意见
      this.submitAction({
        isAdopt: 1,
        opinion: opinion
      })
    },
    dateChange() {
      let that = this
      that.$nextTick(() => {
        let { beginDate, endDate } = that.form.getFieldsValue(['beginDate', 'endDate'])
        if (beginDate instanceof moment && endDate instanceof moment) {
          let s = moment(beginDate.format('YYYY-MM-DD'))
          let e = moment(endDate.format('YYYY-MM-DD'))
          that.diffDate = e.diff(s, 'days')
        }
      })
    },
    openDateModel() {
      this.$refs.multipleCalendarDates.show(this.changeRestDate || [])
    },
    multipleCalendarDatesChange(dateList) {
      this.changeRestDate = dateList
    },
    useDepartmentsCheckAll(){
      //this.useDepartmentsOpen = true
      this.useDepartmentsToggleFlag = !this.useDepartmentsToggleFlag
      this.form.setFieldsValue({
        useDepartments:this.useDepartmentsToggleFlag ? this.depList.map(item =>item.id) : []
      }) 
    },
    useDepartmentsChange(type){
      this.useDepartmentsOpen = type === 'focus'
    }
  }
}
</script>
<style scoped>
.wdf-custom-add-form-wrapper >>> .ant-form-item {
  display: flex;
  margin: 0;
}

.ant-form-item >>> .ant-form-item-label {
  width: 80px;
}
.ant-form-item >>> .ant-form-item-control-wrapper {
  flex: 1;
}
.custom-table-border th,
.custom-table-border td {
  padding: 5px 10px;
  text-align: left;
}

.word-break{
  word-break: break-all;
}
</style>