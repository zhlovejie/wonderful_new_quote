<template>
  <a-modal
    :title="modalTitle"
    :width="1000"
    :visible="visible"
    :footer="null"
    @cancel="handleCancel"
    :maskClosable="false"
    :destroyOnClose="true"
  >
    <a-spin :spinning="spinning">
      <a-form :form="form" class="add-form-wrapper">
        <table class="custom-table custom-table-border">
          <tr>
            <td class="wdf-column">编号</td>
            <td>
              <a-form-item>{{ detail.meetingNum }}</a-form-item>
            </td>
            <td class="wdf-column">会议类别</td>
            <td style="width: 35%">
              <a-form-item>{{ detail.typeDicName }}</a-form-item>
            </td>
          </tr>
          <tr>
            <td class="wdf-column">会议负责人</td>
            <td>
              <a-form-item>{{ detail.departmentName }}-{{ detail.chargePersonName }}</a-form-item>
            </td>
            <td class="wdf-column">会议名称</td>
            <td style="width: 35%">
              <a-form-item>
                <span>{{ detail.name }}</span>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td class="wdf-column">会议时间</td>
            <td>
              <a-form-item>
                <span>{{ detail.meetingTimeStr }}</span>
              </a-form-item>
            </td>
            <td class="wdf-column">会议时长</td>
            <td style="width: 35%">
              <a-form-item>
                <span>{{ detail.meetingTimeLengthStr }}</span>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td class="wdf-column">会议地点</td>
            <td>
              <div style="display: flex" v-if="isStart">
                <a-form-item>
                  <a-select
                    placeholder="选择会议地点"
                    :allowClear="true"
                    style="width: 340px"
                    v-decorator="['addressDicId', { rules: [{ required: true, message: '请选择会议地点' }] }]"
                  >
                    <a-select-option v-for="item in meetingAddrList" :key="item.id" :value="item.id">{{
                      item.text
                    }}</a-select-option>
                  </a-select>
                </a-form-item>
              </div>
              <a-form-item v-if="isView">{{ detail.addressDicName }}</a-form-item>
            </td>
            <td class="wdf-column">是否有考核</td>
            <td style="width: 35%">
              <a-form-item v-if="isStart">
                <a-radio-group
                  v-decorator="['checkFlag', { rules: [{ required: true, message: '请选择是否有考核' }] }]"
                >
                  <a-radio :value="1">有</a-radio>
                  <a-radio :value="0">无</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item v-if="isView">{{ detail.checkFlag === 1 ? '有' : '无' }}</a-form-item>
            </td>
          </tr>
          <tr>
            <td class="wdf-column">参与人员</td>
            <td colspan="3">
              <a-form-item v-if="isView">{{ detail.oaMeetingJoinUserStr }}</a-form-item>
            </td>
          </tr>
          <tr v-if="isView">
            <td class="wdf-column">会议启动开始时间</td>
            <td>
              <a-form-item>{{ detail.startTime || '尚未启动' }}</a-form-item>
            </td>
            <td class="wdf-column">会议启动结束时间</td>
            <td>
              <a-form-item>{{ detail.overTime }}</a-form-item>
            </td>
          </tr>
          <tr v-if="isView">
            <td class="wdf-column">签到记录</td>
            <td colspan="3" style="padding: 0">
              <table class="custom-table custom-table-border">
                <tr>
                  <th>序号</th>
                  <th>姓名</th>
                  <th>签到时间</th>
                </tr>
                <tr v-for="(item, index) in detail.oaMeetingJoinList" :key="item.userId">
                  <td>{{ index + 1 }}</td>
                  <td>{{ item.userName }}</td>
                  <td>
                    <span v-if="item.signStatus === 1">{{ item.signTime }}</span>
                    <span style="color: red" v-else>{{
                      { 1: '已签到', 2: '未签到', 3: '考勤请假', 4: '会议请假', 5: '其它' }[item.signStatus]
                    }}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr v-if="detail.recordUrl !== null">
            <td class="wdf-column">会议纪要</td>
            <td colspan="3">
              <a @click="delSee(detail.recordUrl)">查看</a>
            </td>
          </tr>
        </table>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import moment from 'moment'

export default {
  components: {},
  data() {
    return {
      meetingAddrList: [],
      depList: [],
      personList: [],
      personJoinList: [],
      oaMeetingJoinList: [],
      currentPerson: [],
      form: this.$form.createForm(this),
      visible: false,
      actionType: 'view',
      spinning: false,
      meetingLenths: '',
      record: {},
      detail: {},
    }
  },
  computed: {
    modalTitle() {
      return this.isView ? '查看' : '发起会议'
    },
    isView() {
      return this.actionType === 'view'
    },
    isStart() {
      return this.actionType === 'start'
    },
    isDisabled() {
      //此状态下表单元素被禁用
      return this.isView
    },
  },
  methods: {
    moment: moment,
    async handleOk() {
      this.handleCancel()
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
      that.oaMeetingJoinList = []
      that.detail = Object.assign({}, record)
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
  width: calc(100% + 2px);
}

.wdf-column {
  width: 120px;
}
</style>
