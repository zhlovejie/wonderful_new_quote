<template>
  <a-modal
    :title="modalTitle"
    :width="1000"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-spin :spinning="spinning">
      <a-form class="add-form-wrapper">
        <a-form-item hidden>
          <a-input v-decorator="['eventId']" />
        </a-form-item>
        <table class="custom-table custom-table-border">
          <tr>
            <td class="wdf-column">编号</td>
            <td>
              <a-form-item>{{detail.meetingNum}}</a-form-item>
            </td>
            <td class="wdf-column">会议类别</td>
            <td style="width:35%;">
              <a-form-item>{{detail.typeDicName}}</a-form-item>
            </td>
          </tr>
          <tr>
            <td class="wdf-column">会议负责人</td>
            <td>
              <span v-if="isView">
                <a-form-item>{{detail.departmentName}}-{{detail.chargePersonName}}</a-form-item>
              </span>
            </td>
            <td class="wdf-column">会议名称</td>
            <td style="width:35%;">
              <a-form-item>{{record.name}}</a-form-item>
            </td>
          </tr>
          <tr>
            <td class="wdf-column">会议时间</td>
            <td>
              <span v-if="isView">
                <a-form-item>{{detail.meetingTimeStr}}</a-form-item>
              </span>
            </td>
            <td class="wdf-column">会议时长</td>
            <td style="width:35%;">
              <a-form-item>
                <span v-if="isView">{{detail.meetingTimeLengthStr}}</span>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td class="wdf-column">会议地点</td>
            <td>
              <a-form-item v-if="isView">{{detail.addressDicName}}</a-form-item>
            </td>
            <td class="wdf-column">是否有考核</td>
            <td style="width:35%;">
              <a-form-item v-if="isView">{{detail.checkFlag === 1 ? '有' : '无'}}</a-form-item>
            </td>
          </tr>
          <tr>
            <td class="wdf-column">参与人员</td>
            <td colspan="3">
              <a-form-item v-if="isView">{{detail.oaMeetingJoinUserStr}}</a-form-item>
            </td>
          </tr>
          <tr v-if="isView">
            <td class="wdf-column">会议启动时间</td>
            <td>
              <a-form-item>{{detail.startTime || '尚未启动'}}</a-form-item>
            </td>
            <td class="wdf-column">会议完结时间</td>
            <td>
              <a-form-item>{{detail.finishTime}}</a-form-item>
            </td>
          </tr>
          <tr v-if="isView">
            <td class="wdf-column">签到记录</td>
            <td colspan="3" style="padding:0;">
              <table class="custom-table custom-table-border">
                <tr>
                  <th>序号</th>
                  <th>姓名</th>
                  <th>签到时间</th>
                </tr>
                <tr v-for="(item , index) in detail.oaMeetingJoinList" :key="item.userId">
                  <td>{{index + 1}}</td>
                  <td>{{item.userName}}</td>
                  <td>
                    <span v-if="item.signStatus === 1">{{item.signTime}}</span>
                    <span style="color:red;" v-else>{{item.signStatus === 2 ? '未签到' : '其他'}}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
export default {
  name: 'AddForm',
  components: {},
  data() {
    return {
      visible: false,
      type: '',
      spinning: false,
      record: {},
      detail: {},
    }
  },
  computed: {
    modalTitle() {
      return this.isView ? '查看' : '发起会议'
    },
    isView() {
      return this.type === 'view'
    },
    isStart() {
      return this.type === 'start'
    },
  },
  methods: {
    handleOk() {
      let that = this
      that.visible = false
    },

    handleCancel() {
      let that = this
      that.visible = false
    },
    query(type, record) {
      let that = this
      that.visible = true
      that.type = type
      that.record = record || {}
      that.detail = record
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
