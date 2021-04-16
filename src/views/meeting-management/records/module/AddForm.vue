<template>
  <a-modal
    :title="modalTitle"
    :width="1000"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
    :destroyOnClose="true"
  >
    <a-spin :spinning="spinning">
      <a-form :form="form" class="add-form-wrapper">
        <a-form-item hidden>
          <a-input v-decorator="['eventId']" />
        </a-form-item>
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
              <div style="display: flex" v-if="isStart">
                <a-form-item>
                  <a-select
                    style="width: 165px; margin-right: 10px"
                    placeholder="选择部门"
                    @change="depChangeHandler"
                    v-decorator="['departmentId', { rules: [{ required: true, message: '选择部门' }] }]"
                  >
                    <a-select-option v-for="item in depList" :key="item.id" :value="item.id">{{
                      item.departmentName
                    }}</a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item>
                  <a-select
                    style="width: 165px"
                    placeholder="选择人员"
                    v-decorator="['chargePersonId', { rules: [{ required: true, message: '选择人员' }] }]"
                    @change="chargePersonChange"
                  >
                    <a-select-option v-for="item in personList" :key="item.id" :value="item.id">{{
                      item.trueName
                    }}</a-select-option>
                  </a-select>
                </a-form-item>
              </div>
              <span v-if="isView">
                <a-form-item>{{ detail.departmentName }}-{{ detail.chargePersonName }}</a-form-item>
              </span>
            </td>
            <td class="wdf-column">会议名称</td>
            <td style="width: 35%">
              <a-form-item>{{ detail.name }}</a-form-item>
            </td>
          </tr>
          <tr>
            <td class="wdf-column">会议时间</td>
            <td>
              <div style="display: flex" v-if="isStart">
                <a-form-item>
                  <a-date-picker
                    placeholder="会议日期"
                    style="width: 120px; margin-right: 10px"
                    format="YYYY-MM-DD"
                    v-decorator="['meetingDate', { rules: [{ required: true, message: '请选会议日期！' }] }]"
                    @change="meetingDateChange"
                  />
                </a-form-item>
                <a-form-item>
                  <a-time-picker
                    placeholder="开始时间"
                    @change="meetingDateChange"
                    style="width: 100px; margin-right: 10px"
                    format="HH:mm"
                    v-decorator="['beginTime', { rules: [{ required: true, message: '请选择会议开始时间' }] }]"
                  />
                </a-form-item>
                <a-form-item>
                  <a-time-picker
                    placeholder="结束时间"
                    @change="meetingDateChange"
                    style="width: 100px"
                    format="HH:mm"
                    v-decorator="['endTime', { rules: [{ required: true, message: '请选择会议结束时间' }] }]"
                  />
                </a-form-item>
              </div>
              <span v-if="isView">
                <a-form-item>{{ detail.meetingTimeStr }}</a-form-item>
              </span>
            </td>
            <td class="wdf-column">会议时长</td>
            <td style="width: 35%">
              <a-form-item>
                <span v-if="isStart">{{ meetingLenths }}</span>
                <span v-if="isView">{{ detail.meetingTimeLengthStr }}</span>
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
              <div v-if="isStart">
                <div style="display: flex">
                  <a-form-item>
                    <a-select
                      style="width: 150px; margin-right: 10px"
                      placeholder="选择部门"
                      :defaultValue="+record.departmentId"
                      @change="depChangeHandler1"
                    >
                      <a-select-option v-for="item in depList" :key="item.id" :value="item.id">{{
                        item.departmentName
                      }}</a-select-option>
                    </a-select>
                  </a-form-item>
                  <a-form-item>
                    <a-select
                      style="width: 150px; margin-right: 10px" placeholder="选择人员"
                      mode="multiple"
                      :allowClear="true"
                      @change="personChange"
                      :value="currentPerson"
                    >
                      <a-select-option v-for="item in personJoinList" :key="item.id" :value="item.id">{{
                        item.trueName
                      }}</a-select-option>
                    </a-select>
                  </a-form-item>
                  <a-form-item>
                    <a-button type="primary" style="margin-right: 10px" @click="joinPersonAction('add')">添加</a-button>
                  </a-form-item>
                  <a-form-item>
                    <a-button type="primary" @click="joinPersonAction('reset')">重选</a-button>
                  </a-form-item>
                </div>
                <div class="join-person-wrapper" style="border: 2px dashed #ddd; padding: 10px 15px 15px 15px">
                  <div style="text-align: left" v-if="oaMeetingJoinList.length > 0">
                    <a-tag
                      v-for="item in oaMeetingJoinList"
                      :key="item._key"
                      style="margin-top: 7px"
                      :closable="!item.__root"
                      :color="item.__root ? 'red' : ''"
                      @close="removeTag(item)"
                      >{{ item.trueName }}</a-tag
                    >
                  </div>
                  <div v-else>暂无参与人员</div>
                </div>
              </div>
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
                    <span style="color: red" v-else>{{ {1:'已签到',2:'未签到',3:'考勤请假',4:'会议请假',5:'其它'}[item.signStatus] }}</span>
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
import {
  departmentList, //所有部门
  getStationList, //获取部门下面的岗位
  getUserByDep, //获取人员
} from '@/api/systemSetting'
//查询部门主管
import { getPositionManager } from '@/api/personnelManagement'
import { getDictionaryList } from '@/api/workBox'
import { meetingRecordDetail, meetingRecordSaveOrUpdate } from '@/api/meetingManagement'
import moment from 'moment'
function makeUUID() {
  return Math.random().toString(32).slice(-10)
}
export default {
  name: 'AddForm',
  components: {},
  data() {
    return {
      meetingAddrList: [],
      depList: [],
      personList: [],
      personJoinList: [],
      oaMeetingJoinList: [],
      currentPerson: [],
      form: this.$form.createForm(this, { name: 'meeting-management_AddForm' }),
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
    init() {
      let that = this
      return Promise.all([
        departmentList().then((res) => (that.depList = res.data)), //部门
        getDictionaryList({ parentId: 503 }).then((res) => (that.meetingAddrList = res.data)),
      ])
    },
    depChangeHandler(depId) {
      return getUserByDep({ departmentId: depId }).then((res) => (this.personList = res.data))
    },
    depChangeHandler1(depId) {
      this.currentPerson = []
      return getUserByDep({ departmentId: depId }).then((res) => (this.personJoinList = res.data))
    },
    async handleOk() {
      let that = this
      if (that.isView) {
        that.handleCancel()
        return
      }
      this.form.validateFields((err, values) => {
        if (!err) {
          //提交
          let meetingDate = values.meetingDate.format('YYYY-MM-DD')
          let beginTime = values.beginTime.format('HH:mm')
          let endTime = values.endTime.format('HH:mm')
          values.beginTime = `${meetingDate} ${beginTime}:00`
          values.endTime = `${meetingDate} ${endTime}:00`
          delete values.meetingDate
          values.oaMeetingJoinList = that.oaMeetingJoinList.map((item) => {
            return {
              userId: item.id,
              userName: item.trueName,
            }
          })
          console.log(values)
          that.spinning = true
          meetingRecordSaveOrUpdate(values)
            .then((res) => {
              that.spinning = false
              console.log(res)
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
      that.oaMeetingJoinList = []
      that.detail = {}
      await that.form.resetFields()
      await that.init()

      //填充数据
      if (that.isStart) {
        await that.depChangeHandler(that.record.departmentId)
        await that.depChangeHandler1(that.record.departmentId)

        let obj = {
          eventId: that.record.eventId,
          meetingNum: that.record.meetingNum,
          typeDicName: that.record.typeDicName,
          departmentId: +that.record.departmentId,
          chargePersonId: +that.record.chargePersonId,
          name: that.record.name,
          checkFlag: that.record.checkFlag,
        }
        that.$nextTick(() => that.form.setFieldsValue(obj))

        that.setRootPerson(that.record.chargePersonId)

        that.detail = { ...that.record }
        return
      }
      let result = await meetingRecordDetail({ id: that.record.id })
        .then((res) => res.data)
        .catch((err) => null)

      if (!result) {
        setTimeout(function () {
          that.visible = false
          that.$message.info('获取会议详情信息失败。')
        }, 500)
        return
      }
      if (that.isView) {
        that.detail = Object.assign({}, result)
        return
      }
      if (result) {
        await that.depChangeHandler(result.departmentId)
        let obj = {
          eventId: that.record.eventId,
          departmentId: result.departmentId,
          chargePersonId: result.chargePersonId,
          addressDicId: result.addressDicId,
          checkFlag: result.checkFlag,
          meetingDate: that.moment(result.beginTime),
          beginTime: that.moment(result.beginTime),
          endTime: that.moment(result.endTime),
        }
        that.$nextTick(() => that.form.setFieldsValue(obj))

        let diff = that.moment(result.endTime).diff(that.moment(result.beginTime), 'minutes')
        that.meetingLenths = `${diff / 60}小时${diff % 60}分钟`

        that.oaMeetingJoinList = result.oaMeetingJoinList.map((item) => {
          return {
            _key: makeUUID(),
            id: item.userId,
            trueName: item.userName,
            ...item,
          }
        })
      }
    },
    selectSystemUsers({ decoratorKey, record }) {
      let that = this
      console.log(decoratorKey, record)
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
    removeTag(item) {
      this.oaMeetingJoinList = this.oaMeetingJoinList.filter((p) => p._key !== item._key)
    },
    personChange(vals) {
      this.currentPerson = vals
    },
    joinPersonAction(type) {
      let that = this
      if (type === 'add') {
        if (that.currentPerson.length === 0) {
          that.$message.info('请选择会议参与人员')
          return
        }

        let oaMeetingJoinList = [...that.oaMeetingJoinList]
        that.currentPerson.map(id =>{
          let _u = oaMeetingJoinList.find(usr => +usr.id === +id)
          if(!_u){
            let target = that.personJoinList.find((usr) => +usr.id === +id)
            oaMeetingJoinList.push({ ...target,_key: makeUUID() })
          }
        })

        that.oaMeetingJoinList = oaMeetingJoinList
      } else if (type === 'reset') {
        that.oaMeetingJoinList = that.oaMeetingJoinList.filter((item) => item.__root)
      }
    },
    meetingDateChange() {
      console.log(arguments)
      let that = this
      that.$nextTick(() => {
        let { meetingDate, beginTime, endTime } = that.form.getFieldsValue()
        if (meetingDate && beginTime && endTime) {
          let diff = that.moment(endTime).diff(that.moment(beginTime), 'minutes')
          that.meetingLenths = `${parseInt(diff / 60, 10)}小时${diff % 60}分钟`
        }
      })
    },
    chargePersonChange(pid) {
      this.setRootPerson(pid)
    },
    setRootPerson(pid) {
      const that = this
      let _person = that.personList.find((p) => +p.id === +pid)
      if (_person) {
        that.oaMeetingJoinList = [
          Object.assign({}, _person, { __root: true, _key: makeUUID() }),
          ...that.oaMeetingJoinList.filter((p) => !p.__root),
        ]
      }
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
