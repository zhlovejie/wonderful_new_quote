<template>
  <a-modal
    :title="modalTitle"
    :width="550"
    :visible="visible"
    :footer="footer"
    @cancel="handleCancel"
    :maskClosable="false"
    :destroyOnClose="true"
  >
    <a-spin :spinning="spinning">
      <a-form-model
        ref="ruleForm"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >

        <a-form-model-item label="车间名称" prop="name">
          <a-select v-model="form.name" placeholder="选择车间名称" :disabled="isDisabled">
            <a-select-option value="shanghai">
              Zone one
            </a-select-option>
            <a-select-option value="beijing">
              Zone two
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item ref="code" label="工序代码" prop="code">
          <a-input
            :disabled="isDisabled"
            placeholder="工序代码"
            v-model="form.code"
            @blur="
              () => {
                $refs.code.onFieldBlur();
              }
            "
          />
        </a-form-model-item>
        <a-form-model-item ref="code" label="K3工序代码" prop="k3Code">
          <a-input
            :disabled="isDisabled"
            placeholder="K3工序代码"
            v-model="form.k3Code"
            @blur="
              () => {
                $refs.code.onFieldBlur();
              }
            "
          />
        </a-form-model-item>
        <a-form-model-item ref="code" label="工序名称" prop="codeName">
          <a-input
            :disabled="isDisabled"
            placeholder="工序名称"
            v-model="form.codeName"
            @blur="
              () => {
                $refs.code.onFieldBlur();
              }
            "
          />
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
import {
  addAndUpdateMeetingLeave,
  approvalMeetingLeave,
  getMeetingLeaveDetail
} from '@/api/meetingManagement'
import moment from 'moment'


export default {
  name: 'product-process-management_workshop-management-addForm',
  components: {

  },
  data() {
    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      visible: false,
      actionType: 'view',
      spinning: false,
      detail: {},
      form:{
        name:undefined,
        code:undefined
      },
      rules:{
        name: [{ required: true, message: '请选择车间名称', trigger: 'change' }],
        code: [
          { required: true, message: '请输入车间代码', trigger: 'blur' }
        ],

      }
    }
  },
  computed: {
    modalTitle() {
      return this.isView ? '查看' : this.isAdd ? '新增' : '编辑'
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
    isApproval(){
      return this.actionType === 'approval'
    },
    isDisabled(){
      return this.isView || this.isApproval
    },
    footer() {
      let that = this
      const h = that.$createElement
      let btn = []
      if (that.isView) {
        return null
      } else if (that.isAdd || that.isEdit) {
        btn.push(h('a-button', { key: 'cancel', on: { click: that.handleCancel } }, '取消'))
        btn.push(
          h(
            'a-button',
            {
              key: 'submit',
              on: { click: () => that.handleOk() },
              props: { type: 'primary', loading: that.spinning },
            },
            '提交'
          )
        )
      } else if (that.isApproval) {
        btn.push(h('a-button', { key: 'no-pass', on: { click: that.noPassAction } ,props:{loading: that.spinning}}, '不通过'))
        btn.push(
          h(
            'a-button',
            { key: 'pass', on: { click: that.passAction }, props: { type: 'primary', loading: that.spinning } },
            '通过'
          )
        )
      }
      return btn
    },
  },
  methods: {
    moment,
    async handleOk() {
      let that = this
      if (that.isView) {
        that.handleCancel()
        return
      }
      this.form.validateFields((err, values) => {
        if (!err) {
          values.beginTime = values.beginTime.format('YYYY-MM-DD HH:mm:ss')
          values.endTime = values.endTime.format('YYYY-MM-DD HH:mm:ss')
          that.spinning = true
          addAndUpdateMeetingLeave(values)
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
    },
    handleCancel() {
      this.form.resetFields()
      this.$nextTick(() => (this.visible = false))
    },
    async query(type, record = {}) {
      let that = this
      that.visible = true
      that.actionType = type
      that.leaveTime = ''
      that.detail = {}
      if(that.isAdd){
        let {id:meetingId,setTimeStr} = record
        let f = (str) => {
          let [ymd,sub] = str.split(' ')
          let [s,e] = sub.split('-')
          return {beginTime:`${ymd} ${s}:00`,endTime:`${ymd} ${e}:00`}
        }
        let {beginTime,endTime} = f(setTimeStr)
        that.detail = {
          meetingId,
          beginTime,
          endTime
        }
        that.leaveTime = that.calcTimes(that.moment(beginTime),that.moment(endTime))
      }else{
        await getMeetingLeaveDetail({id:record.id}).then(res =>{
          that.detail = res.data
          let {beginTime,endTime} = that.detail
          that.leaveTime = that.calcTimes(that.moment(beginTime),that.moment(endTime))
        })
      }
    }
  }
}
</script>

<style scoped>
.custom-table-border th,
.custom-table-border td {
  padding: 5px 10px;
}

.add-form-wrapper >>> .ant-form-item {
  margin-bottom: 0;
}

.add-form-wrapper >>> .custom-table {
  margin-bottom: 0;
}
.custom-table >>> .custom-table {
  margin: -1px;
  width: calc(100% + 2px);
}

.wdf-column {
  width: 160px;
}
</style>
