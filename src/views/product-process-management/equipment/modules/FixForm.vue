<template>
  <a-modal
    :title="modalTitle"
    :width="1000"
    :visible="visible"
    :destroyOnClose="true"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :confirmLoading="spinning"
    :maskClosable="false"
  >
    <template slot="footer">
      <template v-if="isApproval">
        <a-button key="back" icon="close" @click="noPassAction">不通过</a-button>
        <a-button key="submit" type="primary" icon="check" :loading="spinning" @click="passAction">通过</a-button>
      </template>
      <template v-else>
        <a-button key="back" @click="handleCancel">取消</a-button>
        <a-button key="submit" type="primary" :loading="spinning" @click="handleSubmit">确定</a-button>
      </template>
    </template>
    <a-spin :spinning="spinning">
      <a-form :form="form" class="wdf-custom-add-form-wrapper">
        <table class="custom-table custom-table-border">
          <tr>
            <td style="width: 150px">申请部门</td>
            <td style="width: 180px">
              <a-form-item>{{ record.departmentName || userInfo.departmentName }}</a-form-item>
            </td>
            <td style="width: 150px">申请人</td>
            <td style="width: 180px">{{ userInfo.trueName }}</td>
            <td style="width: 150px">申请日期</td>
            <td style="width: 180px">{{ isAdd ? record.__currentDate : record.applyDate }}</td>
          </tr>
          <tr>
            <td style="width: 150px">设备/模具编号</td>
            <td style="width: 180px">{{ detail.code || record.devNum }}</td>
            <td style="width: 150px">设备/模具名称</td>
            <td style="width: 180px">{{ detail.name || record.devName }}</td>
            <td style="width: 150px">需求时间</td>
            <td style="width: 180px">
              <a-form-item>
                <a-date-picker
                  v-if="!isDisabled"
                  v-decorator="[
                    'needTime',
                    {
                      initialValue: detail.needTime ? moment(record.needTime) : undefined,
                      rules: [{ required: true, message: '请选择需求时间' }],
                    },
                  ]"
                  style="width: 100%"
                />
                <span v-else>{{ detail.needTime }}</span>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td style="width: 150px">设备类型</td>
            <td colspan="2" style="width: 360px">
              <a-form-item>
                <a-radio-group
                  v-if="!isDisabled"
                  v-decorator="['type', { initialValue: detail.type || 1, rules: [{ required: true }] }]"
                  style="width: 100%"
                >
                  <a-radio :value="1">固定资产</a-radio>
                  <a-radio :value="2">车间设备</a-radio>
                </a-radio-group>
                <span v-else>{{ { 1: '固定资产', 2: '车间设备' }[detail.type] }}</span>
              </a-form-item>
            </td>
            <td style="width: 150px">紧急程度</td>
            <td colspan="2" style="width: 360px">
              <a-form-item>
                <a-radio-group
                  v-if="!isDisabled"
                  v-decorator="['emaeceLevel', { initialValue: detail.emaeceLevel || 1, rules: [{ required: true }] }]"
                  style="width: 100%"
                >
                  <a-radio :value="2">紧急(优先处理)</a-radio>
                  <a-radio :value="1">一般</a-radio>
                </a-radio-group>
                <span v-else>{{ { 1: '一般', 2: '紧急(优先处理)' }[detail.emaeceLevel] }}</span>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td style="width: 150px">故障描述</td>
            <td colspan="5">
              <a-form-item>
                <a-textarea
                  v-if="!isDisabled"
                  style="width: 100%"
                  placeholder="故障描述"
                  :rows="3"
                  v-decorator="[
                    'qustDesc',
                    { initialValue: detail.qustDesc, rules: [{ required: true, message: '请输入故障描述' }] },
                  ]"
                />
                <div v-else style="text-align: left" v-html="formatHTML(detail.qustDesc || '')" />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td style="width: 150px">维修方案</td>
            <td colspan="5">
              <a-form-item>
                <a-textarea
                  v-if="isFix || !isDisabled"
                  :disabled="!isFix"
                  style="width: 100%"
                  :rows="3"
                  v-decorator="[
                    'solutionPlan',
                    { initialValue: detail.solutionPlan, rules: [{ required: isFix, message: '请输入维修方案' }] },
                  ]"
                />
                <div v-else style="text-align: left" v-html="formatHTML(detail.solutionPlan || '')" />
              </a-form-item>
            </td>
          </tr>
        </table>
        <a-alert :message="msg" banner />
        <Approval ref="approval" @opinionChange="opinionChange" />
      </a-form>
    </a-spin>
  </a-modal>
</template>
<script>
import {
  departmentList, //所有部门
  getStationList, //获取所有岗位
} from '@/api/systemSetting'
import Approval from './Approval'
import { getDictionaryList } from '@/api/workBox'

import {
  pageacceptanceGuarantee,
  pageDevelopmentDetail,
  pageDevelopmentApproval,
  pageDevelopmenthandleRevocation,
} from '@/api/ProcessManagement'
import moment from 'moment'
export default {
  name: 'asset-management-management-FixForm',
  data() {
    return {
      form: this.$form.createForm(this, { name: 'asset-management-management-FixForm' }),
      visible: false,
      spinning: false,
      type: 'view',
      assetTypeList: [],
      record: {},
      detail: {},
      isManagerCheck: false,
      msg: '注：维修时间超过2小时的必须部门主管签字确认，已保证正常生产和发货；设备/模具/工装需外协维修的，维修方案确定后须报部门负责人审批后执行。',
      userInfo: this.$store.getters.userInfo,
    }
  },
  components: {
    Approval,
  },
  computed: {
    modalTitle() {
      let map = {
        add: '新增',
        view: '查看',
        edit: '编辑',
        approval: '审批',
        fix: '填写维修方案',
      }
      return `报修-${map[this.type]}`
    },
    isView() {
      return this.type === 'view'
    },
    isAdd() {
      return this.type === 'add'
    },
    isEdit() {
      return this.type === 'edit'
    },
    isApproval() {
      return this.type === 'approval'
    },
    isFix() {
      //填写维修方案
      return this.type === 'fix'
    },
    isDisabled() {
      //此状态下表单元素被禁用
      return this.isView || this.isApproval || this.isFix
    },
  },
  methods: {
    moment,
    async query(type, record) {
      let that = this
      that.visible = true
      that.type = type
      console.log(that.userInfo)
      that.record = Object.assign({}, record, { __currentDate: moment().format('YYYY-MM-DD') })
      that.detail = {}

      await that.initData()

      if (!that.isAdd) {
        await pageDevelopmentDetail({ id: that.record.id }).then((res) => {
          that.detail = Object.assign({}, that.record || {}, res.data || {})
        })
      }
      // if (that.isEdit) {
      //   that.$nextTick(() => {
      //     that.form.setFieldsValue(Object.assign({}, that.record))
      //   })
      // }
    },
    initData() {
      let that = this
      let queue = []
      //let task1 = getDictionaryList({ parentId: 532 }).then((res) => (that.assetTypeList = res.data))
      //queue.push(task1)
      return Promise.all(queue)
    },
    handleSubmit() {
      let that = this
      if (that.isView) {
        that.handleCancel()
        return
      }

      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          if (that.isFix) {
            //填写维修方案 来自 维修申请记录
            values.id = that.record.id
          } else if (that.isAdd) {
            //报修   来自 管理资产 和 我的资产
            values.devId = that.record.id
            values.departmentName = that.userInfo.departmentName

            if (values.needTime && values.needTime instanceof moment) {
              values.needTime = values.needTime.format('YYYY-MM-DD')
            }
            values.code = that.record.devNum
            values.name = that.record.devName
            //取当前登录人的 人员ID和部门ID
            values.departmentId = that.userInfo.departmentId
            values.userId = that.userInfo.id
          } else if (that.isEdit) {
            //debugger
            values.id = that.detail.id
            if (values.needTime && values.needTime instanceof moment) {
              values.needTime = values.needTime.format('YYYY-MM-DD')
            }
            values.code = that.detail.code
            values.name = that.detail.name
            //取当前登录人的 人员ID和部门ID
            values.departmentId = that.userInfo.departmentId
            values.userId = that.userInfo.id
          }

          let api = that.isFix ? pageDevelopmenthandleRevocation : pageacceptanceGuarantee

          that.spinning = true
          api(values)
            .then((res) => {
              that.spinning = false
              if (res.code === 200) {
                that.visible = false
                that.$message.success('操作成功')
                that.$emit('finish')
              } else {
                that.$message.warning(res.msg)
              }
            })
            .catch((err) => {
              that.spinning = false
              that.$message.error('操作失败')
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
      pageDevelopmentApproval(values)
        .then((res) => {
          that.spinning = false
          console.log(res)
          that.form.resetFields() // 清空表
          that.visible = false
          that.$message.info(res.msg)
          that.$emit('finish')
        })
        .catch((err) => (that.spinning = false))
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
        opinion: opinion,
      })
    },
    formatHTML(htmlStr) {
      if (typeof htmlStr !== 'string') {
        return ''
      }
      htmlStr = htmlStr.replace(/[\n\r]/g, '<br/>')
      htmlStr = htmlStr.replace(/\s+/g, '&nbsp;')
      return htmlStr
    },
  },
}
</script>
<style scoped>
.wdf-custom-add-form-wrapper >>> .ant-form-item {
  display: flex;
  margin: 0;
}

.ant-form-item >>> .ant-form-item-label {
  width: 100px;
}
.ant-form-item >>> .ant-form-item-control-wrapper {
  flex: 1;
}
.custom-table-border th,
.custom-table-border td {
  padding: 5px 10px;
  /* text-align: left; */
}
</style>
