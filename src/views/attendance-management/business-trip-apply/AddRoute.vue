<template>
  <a-modal
    :title="modalTitle"
    :width="1000"
    :visible="visible"
    :destroyOnClose="true"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <template slot="footer">
      <a-button key="back" @click="handleCancel">取消</a-button>
      <a-button key="submit" type="primary" :loading="spinning" @click="handleSubmit">确定</a-button>
    </template>
    <a-spin :spinning="spinning">
      <a-form :form="form" layout="inline" class="wdf-custom-add-form-wrapper">
        <a-form-item hidden>
          <a-input v-decorator="['id',{initialValue:detail.id}]" />
        </a-form-item>
        
        <table
          class="custom-table custom-table-border"
          v-for="(item,idx) in routesList"
          :key="item._key"
        >
          <caption>
            <div style="display:flex;">
              <div style="flex:1;text-align:left;">行程{{idx + 1}}</div>
              <a-popconfirm
                title="确认删除该行程吗?"
                @confirm="() => routeAction('remove',item._key)"
              >
                <a type="primary" href="javascript:;">删除</a>
              </a-popconfirm>
            </div>
          </caption>
          <tr>
            <td style="width:120px;">目的城市</td>
            <td>
              <a-form-item>
                <AreaCascade
                  :fill="item.endAreaId ? item.endAreaId.split(',') : []"
                  @change="(...args) => {areaCascadeChange('endAreaId',item._key,...args)}"
                  style="width:100%;"
                />
              </a-form-item>
            </td>
            <td style="width:120px;">交通工具</td>
            <td>
              <a-form-item>
                <a-select
                  placeholder="选择交通工具"
                  :value="item.vehicleId"
                  :allowClear="true"
                  style="width:100%;"
                  @change="(val) => { vehicleChange('vehicleId',item._key,val) }"
                >
                  <a-select-option
                    v-for="item in vehicleList"
                    :key="item.id"
                    :value="item.id"
                  >{{item.text}}</a-select-option>
                </a-select>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td style="width:120px;">开始日期</td>
            <td>
              <a-form-item>
                <DateTimePicker
                  :fill="item.startTime"
                  @change="(...args) => {dateTimePickerChange('startTime',item._key,...args)}"
                  style="width:100%;"
                />
              </a-form-item>
            </td>
            <td style="width:120px;">结束日期</td>
            <td>
              <a-form-item>
                <DateTimePicker
                  :fill="item.endTime"
                  @change="(...args) => {dateTimePickerChange('endTime',item._key,...args)}"
                  style="width:100%;"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td style="width:120px;">出差事由</td>
            <td colspan="3">
              <a-form-item>
                <a-textarea
                  style="width:100%;"
                  placeholder="出差事由"
                  :rows="2"
                  :value="item.reason"
                  @change="reasonChange('reason',item._key,$event)"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td style="width:120px;">出差负责人</td>
            <td colspan="3">
              <a-form-item>
                <DepUserSelect
                  :depId="item.chargeUserDepId"
                  :userId="item.chargeUserId"
                  @change="(...args) => {depUserChange('chargeUserId',item._key,...args)}"
                  style="width:100%;"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td style="width:120px;">出差同行人</td>
            <td colspan="3">
              <a-form-item>
                <DepUserMulSelect
                  :users="item.users"
                  @change="(...args) => {depUserMulChange('users',item._key,...args)}"
                  style="width:100%;"
                />
              </a-form-item>
            </td>
          </tr>
        </table>

        <a-button
          style="width: 100%;"
          type="dashed"
          icon="plus"
          @click="routeAction('add')"
        >新增行</a-button>

      </a-form>
    </a-spin>
  </a-modal>
</template>
<script>

import { getDictionaryList } from '@/api/workBox'
import {
  attenceTravelRouteAdd
} from '@/api/attendanceManagement'

import AreaCascade from './AreaCascade'
import DateTimePicker from './DateTimePicker'
import DepUserSelect from './DepUserSelect'
import DepUserMulSelect from './DepUserMulSelect'
import moment from 'moment'

let uuid = () =>
  Math.random()
    .toString(32)
    .slice(-10)

export default {
  name: 'business-trip-route-add',
  components: {
    AreaCascade,
    DateTimePicker,
    DepUserSelect,
    DepUserMulSelect
  },
  data() {
    return {
      form: this.$form.createForm(this),
      visible: false,
      spinning: false,
      actionType: 'view',
      detail: {},
      record: {},
      spinning: false,
      userInfo: this.$store.getters.userInfo, // 当前登录人

      routesList: [], //出差行程
      vehicleList:[]
    }
  },
  computed: {
    modalTitle() {
      return '添加行程'
    },
  },
  watch: {},
  methods: {
    moment,
    init() {
      let that = this
      let queue = []
      let task1 = getDictionaryList({ parentId: 509 }).then(res => (that.vehicleList = res.data))
      queue.push(task1)
      return Promise.all(queue)
    },

    async query(type, record) {
      let that = this
      ;(that.actionType = type), (that.record = Object.assign({}, record))
      that.detail = {}
      that.routesList = []
      that.form.resetFields()
      await that.init()
      that.visible = true
      that.routeAction('add')
    },
    areaCascadeChange(type, key, arrArea, arrAreaItems) {
      let that = this
      if (type === 'beginAreaId') {
        this.beginAreaId = arrArea.join(',')
        that.detail = Object.assign({}, that.detail, { beginAreaId: arrArea.join(',') })
        return
      }
      if (type === 'endAreaId') {
        let _routesList = [...that.routesList]
        let target = _routesList.find(item => item._key === key)
        if (target) {
          target.endAreaId = arrArea.join(',')
          that.routesList = [..._routesList]
        }
      }
    },
    dateTimePickerChange(type, key, timeStr) {
      let _routesList = [...this.routesList]
      let target = _routesList.find(item => item._key === key)
      if (target) {
        target[type] = timeStr
        this.routesList = [..._routesList]
      }
    },
    reasonChange(type, key, event) {
      let _routesList = [...this.routesList]
      let target = _routesList.find(item => item._key === key)
      if (target) {
        target[type] = event.target.value
        this.routesList = [..._routesList]
      }
    },
    depUserChange(type, key, depId, userId) {
      //chargeUserId
      let _routesList = [...this.routesList]
      let target = _routesList.find(item => item._key === key)
      if (target) {
        target[type] = userId
        this.routesList = [..._routesList]
      }
    },
    depUserMulChange(type, key, users) {
      let _routesList = [...this.routesList]
      let target = _routesList.find(item => item._key === key)
      if (target) {
        target[type] = users.map(id => {
          return { userId: id }
        })
        this.routesList = [..._routesList]
      }
    },
    vehicleChange(type, key, val) {
      let _routesList = [...this.routesList]
      let target = _routesList.find(item => item._key === key)
      if (target) {
        target[type] = val
        this.routesList = [..._routesList]
      }
    },
    routeAction(type, key) {
      let that = this
      if (type === 'add') {
        that.routesList.push({
          _key: uuid(),
          endAreaId: undefined,
          vehicleId: undefined,
          startTime: undefined,
          endTime: undefined,
          reason: '',
          users: []
        })
      } else if (type === 'remove') {
        that.routesList = that.routesList.filter(item => item._key !== key)
      }
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

          if(that.routesList.length === 0){
            that.$message.info('请添加行程后再提交')
            return
          }

          values.travelId = that.record.id
          values.routes = that.$_.cloneDeep(that.routesList).map(item => {
            delete item._key
            return item
          })
          that.spinning = true
          attenceTravelRouteAdd(values)
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
}
</style>