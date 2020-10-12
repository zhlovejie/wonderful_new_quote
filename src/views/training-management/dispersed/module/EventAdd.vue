<template>
  <a-modal
    :title="modalTitle"
    :width="850"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <a-spin :spinning="spinning">
      <a-form :form="form" class="add-form-wrapper">
        <a-form-item hidden>
          <a-input v-decorator="['id']" />
        </a-form-item>
        <table class="custom-table custom-table-border">
          <tr>
            <td>会议类别</td>
            <td>
              <a-form-item>
                <a-select
                  placeholder="选择会议类别"
                  v-decorator="['typeDicId', { rules: [{ required: true, message: '选择会议类别' }] }]"
                  :allowClear="true"
                >
                  <a-select-option v-for="item in meetingTypesList" :key="item.id" :value="item.id">{{
                    item.text
                  }}</a-select-option>
                </a-select>
              </a-form-item>
            </td>
            <td>会议部门</td>
            <td>
              <a-form-item>
                <a-select
                  placeholder="选择会议部门"
                  @change="depChange"
                  v-decorator="['departmentId', { rules: [{ required: true, message: '选择会议部门' }] }]"
                  :allowClear="true"
                >
                  <a-select-option v-for="item in depList" :key="item.id" :value="item.id">{{
                    item.departmentName
                  }}</a-select-option>
                </a-select>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>会议负责人</td>
            <td>
              <a-form-item>
                <a-input
                  placeholder="选择人员"
                  read-only
                  @click="openSystemUsers('chargePersonName')"
                  v-decorator="['chargePersonName', { rules: [{ required: true, message: '选择人员' }] }]"
                />
                <a-input hidden v-decorator="['chargePersonId']" />
              </a-form-item>
            </td>
            <td>会议名称</td>
            <td>
              <a-form-item>
                <a-input
                  placeholder="会议名称"
                  v-decorator="['name', { rules: [{ required: true, message: '请输入会议名称' }] }]"
                />
              </a-form-item>
            </td>
          </tr>

          <tr>
            <td>是否有考核</td>
            <td colspan="3">
              <a-form-item>
                <a-radio-group v-decorator="['checkFlag', { initialValue: 0 }]">
                  <a-radio :value="1">有</a-radio>
                  <a-radio :value="0">无</a-radio>
                </a-radio-group>
              </a-form-item>
            </td>
          </tr>
        </table>
      </a-form>
      <SystemUserSelect ref="systemUserSelect" @selectSystemUsers="selectSystemUsers" />
    </a-spin>
  </a-modal>
</template>

<script>
import {
  departmentList, //所有部门
  getStationList, //获取部门下面的岗位
} from '@/api/systemSetting'
//查询部门主管
import { getPositionManager } from '@/api/personnelManagement'
import { getDictionaryList } from '@/api/workBox'
import { dispersedMeetingEvent, meetingSetDetail } from '@/api/training-management'

import moment from 'moment'
import SystemUserSelect from '@/components/CustomerList/SystemUserSelect'

function range(start, end, step = 1, suffix = '') {
  let i = start,
    len = end
  let res = []
  for (; i <= len; i += step) {
    res.push(i + '' + suffix)
  }
  return res
}

export default {
  name: 'AddForm',
  components: {
    SystemUserSelect: SystemUserSelect,
  },
  data() {
    return {
      meetingTypesList: [],
      depList: [],

      form: this.$form.createForm(this),
      visible: false,
      actionType: 'add',
      record: {},
      spinning: false,
      dayLoop: range(1, 31, 1, '号'),
      weekLoop: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      monthLoop: range(1, 12, 1, '月'),
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
  },
  methods: {
    moment: moment,
    init() {
      let that = this
      return Promise.all([
        departmentList().then((res) => (that.depList = res.data)), //部门
        getDictionaryList({ parentId: 498 }).then((res) => (that.meetingTypesList = res.data)),
      ])
    },
    async handleOk() {
      let that = this
      this.form.validateFields((err, values) => {
        if (!err) {
          that.spinning = true
          values.trainId = that.record.id
          dispersedMeetingEvent(values)
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
    async query(type, record) {
      let that = this
      that.visible = true
      that.actionType = type
      that.record = record || {}
      await that.form.resetFields()
      await that.init()
      //填充数据
      if (type === 'edit') {
        meetingSetDetail({ eventId: that.record.meetingEventId })
          .then((res) => {
            that.$nextTick(() => that.form.setFieldsValue(Object.assign({}, res.data)))
          })
          .catch((err) => null)
      }
    },
    selectSystemUsers({ decoratorKey, record }) {
      let that = this
      if (record) {
        that.form.setFieldsValue({
          chargePersonId: record.id,
          chargePersonName: record.trueName,
        })
      }
    },
    openSystemUsers(decoratorKey) {
      this.$refs.systemUserSelect.query(decoratorKey)
    },

    resetValues() {
      let that = this
    },
    depChange(dep_id) {
      let that = this
      getPositionManager({ departmentId: dep_id }).then((res) => {
        that.form.setFieldsValue({
          chargePersonId: res.data.id,
          chargePersonName: res.data.trueName,
        })
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

.add-form-wrapper >>> .ant-form-item {
  margin-bottom: 0;
}

.add-form-wrapper >>> .custom-table {
  margin-bottom: 0;
}
.custom-table >>> .custom-table {
  margin: -1px;
}
</style>