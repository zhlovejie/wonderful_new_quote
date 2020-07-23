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
        <table class="custom-table custom-table-border">
          <tr>
            <td style="width:120px;">出差人</td>
            <td colspan="3">
              <a-form-item>
                {{detail.createdUserName || userInfo.trueName}}
              </a-form-item>
            </td>
          </tr>

          <tr>
            <td style="width:120px;">出差类型</td>
            <td :colspan="!isSalesman ? 3 : 1">
              <a-form-item>
                <a-select
                  v-if="!isDisabled"
                  placeholder="选择出差类型"
                  v-decorator="['travelType',{initialValue:detail.travelType,rules: [{required: true,message: '选择出差类型'}]}]"
                  :allowClear="true"
                  style="width:100%;"
                >
                  <a-select-option :value="1">出差</a-select-option>
                  <a-select-option :value="2">公事外出</a-select-option>
                </a-select>
                <span v-else>
                  {{ {1:'出差',2:'公事外出'}[detail.travelType] }}
                </span>
              </a-form-item>
            </td>
            <td style="width:120px;" v-if="isSalesman">客户名称</td>
            <td v-if="isSalesman">
              <a-form-item>
                <a-input
                  v-if="!isDisabled"
                  class="a-input"
                  style="width:100%;"
                  title="选择客户名称"
                  read-only
                  placeholder="选择客户名称"
                  @click="handleCustomerClick"
                  v-decorator="['customerName',{initialValue:detail.customerName,rules: [{ required: true, message: '选择客户名称'}]}]"
                />
                <span v-else>{{detail.customerName}}</span>
              </a-form-item>
              <a-form-item hidden>
                <a-input v-decorator="['customerId',{initialValue:detail.customerId}]" />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td style="width:120px;">出发城市</td>
            <td style="width:355px;">
              <a-form-item>
                <AreaCascade
                  v-if="!isDisabled"
                  :fill="detail && detail.beginAreaId ? detail.beginAreaId.split(',') : []"
                  @change="(...args) => {areaCascadeChange('beginAreaId',null,...args)}"
                  style="width:100%;"
                />
                <span v-else>{{detail.beginAreaName}}</span>
              </a-form-item>
            </td>
            <td style="width:120px;">时长</td>
            <td>
              <a-form-item>
                <span>{{calcRouteTimeDiff}}</span>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td style="width:120px;">出差备注</td>
            <td colspan="3">
              <a-form-item>
                <a-textarea
                  v-if="!isDisabled"
                  style="width:100%;"
                  placeholder="出差备注"
                  :rows="2"
                  v-decorator="['remark', { initialValue:detail.remark,rules: [{ required: false, message: '请输入出差备注' }] }]"
                />
                <span v-else>{{detail.remark}}</span>
              </a-form-item>
            </td>
          </tr>
        </table>

        <table
          class="custom-table custom-table-border"
          v-for="(item,idx) in routesList"
          :key="item._key"
        >
          <caption>
            <div style="display:flex;">
              <div style="flex:1;text-align:left;">行程{{idx + 1}}</div>
              <a-popconfirm
                v-if="!isDisabled && routesList.length > 1"
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
                  v-if="!isDisabled"
                  :fill="item.endAreaId ? item.endAreaId.split(',') : []"
                  @change="(...args) => {areaCascadeChange('endAreaId',item._key,...args)}"
                  style="width:100%;"
                />
                <span v-else>{{item.endAreaName}}</span>
              </a-form-item>
            </td>
            <td style="width:120px;">交通工具</td>
            <td>
              <a-form-item>
                <a-select
                  v-if="!isDisabled"
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
                <span v-else>
                  {{item.vehicle}}
                </span>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td style="width:120px;">开始日期</td>
            <td>
              <a-form-item>
                <DateTimePicker
                  v-if="!isDisabled"
                  :fill="item.startTime"
                  @change="(...args) => {dateTimePickerChange('startTime',item._key,...args)}"
                  style="width:100%;"
                />
                <span v-else>{{item.startTime}}</span>
              </a-form-item>
            </td>
            <td style="width:120px;">结束日期</td>
            <td>
              <a-form-item>
                <DateTimePicker
                  v-if="!isDisabled"
                  :fill="item.endTime"
                  @change="(...args) => {dateTimePickerChange('endTime',item._key,...args)}"
                  style="width:100%;"
                />
                <span v-else>{{item.endTime}}</span>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td style="width:120px;">出差事由</td>
            <td colspan="3">
              <a-form-item>
                <a-textarea
                  v-if="!isDisabled"
                  style="width:100%;"
                  placeholder="出差事由"
                  :rows="2"
                  :value="item.reason"
                  @change="reasonChange('reason',item._key,$event)"
                />
                <span v-else>{{item.reason}}</span>
              </a-form-item>
            </td>
          </tr>
          
          <tr>
            <td style="width:120px;">出差同行人</td>
            <td colspan="3">
              <a-form-item>
                <DepUserMulSelect
                  v-if="!isDisabled"
                  :users="item.users"
                  @change="(...args) => {depUserMulChange('users',item._key,...args)}"
                  style="width:100%;"
                />
                <span>{{ item.users.map(u =>u.trueName).join(',') }}</span>
              </a-form-item>
            </td>
          </tr>
          <tr v-show="item.users && item.users.length > 0">
            <td style="width:120px;">出差负责人</td>
            <td colspan="3">
              <a-form-item>
                <DepUserSelect
                  v-if="!isDisabled"
                  :depId="item.chargeUserDepId || userInfo.departmentId"
                  :userId="item.chargeUserId || userInfo.id"
                  @change="(...args) => {depUserChange('chargeUserId',item._key,...args)}"
                  style="width:100%;"
                />
                <span v-else>{{item.chargeUserName}}</span>
              </a-form-item>
            </td>
          </tr>
        </table>

        <a-button
          v-if="!isDisabled"
          style="width: 100%;"
          type="dashed"
          icon="plus"
          @click="routeAction('add')"
        >新增行</a-button>

        <table class="custom-table custom-table-border" style="margin-top:20px;">
          <tr>
            <td style="width:120px;">使用公车</td>
            <td style="width:355px;">
              <a-form-item>
                <a-select
                  v-if="!isDisabled"
                  :disabled="!isCompanyCar"
                  placeholder="选择公车"
                  v-decorator="['carDicNum',{initialValue:detail.carDicNum ? +detail.carDicNum : undefined,rules: [{required: isCompanyCar,message: '选择公车'}]}]"
                  :allowClear="true"
                  style="width:334px;"
                >
                  <a-select-option
                    v-for="item in carList"
                    :key="item.id"
                    :value="item.id"
                  >{{item.text}}</a-select-option>
                </a-select>
                <span v-else>{{detail.carDicNumTxt}}</span>
              </a-form-item>
            </td>
            <td style="width:120px;">预支金额(元)</td>
            <td style="width:355px;">
              <a-form-item>
                <a-input-number
                  v-if="!isDisabled"
                  style="width:334px;"
                  :min="0"
                  :max="2000"
                  :step="1"
                  v-decorator="['overdraftAmount', {initialValue:detail.overdraftAmount}]"
                />
                <span v-else>
                  {{detail.overdraftAmount | moneyFormatNumber}}
                </span>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td style="width:120px;">银行卡号</td>
            <td colspan="3">
              <a-form-item>
                <a-input
                  v-if="!isDisabled"
                  style="width:100%;"
                  placeholder="银行卡号"
                  v-decorator="['bankAccount', {initialValue:detail.bankAccount,rules: [{pattern: /^\d{15,20}$/, message: '请输入正确银行账号' }]}]"
                />
                <span v-else>
                  {{detail.bankAccount}}
                </span>
              </a-form-item>
            </td>
          </tr>


        </table>

        <table class="custom-table custom-table-border" style="margin-top:20px;" v-if="+detail.status === 2">
          <tr>
            <td style="width:120px;">提交人</td>
            <td style="width:355px;">{{detail.createdUserName}}</td>
            <td style="width:120px;">提交时间</td>
            <td style="width:355px;">{{detail.createdTime}}</td>
          </tr>
          <tr>
            <td>审批人</td>
            <td>{{lastApprovedNode.userName}}</td>
            <td>审批结果</td>
            <td>{{lastApprovedNode.code}}</td>
          </tr>
          <tr>
            <td>审批时间</td>
            <td colspan="3">{{lastApprovedNode.createTime}}</td>
          </tr>
        </table>
      </a-form>
    </a-spin>
    <Approval ref="approval" @opinionChange="opinionChange" />
    <CustomerList ref="customerList" @selected="handlerCustomerSelected" />
  </a-modal>
</template>
<script>
import {
  departmentList, //所有部门
  getStationList, //获取部门下面的岗位
  getUserByDep //获取人员
} from '@/api/systemSetting'
import { getDictionaryList } from '@/api/workBox'
import { getAreaByParent } from '@/api/common'
import { getOneSalesman } from '@/api/customer/salesman'
import {
  attenceTravelApplyDetail,
  attenceTravelApplyAddAndUpdate,
  attenceTravelApplyApprove,
  attenceTravelApplyGetNewstAccount
} from '@/api/attendanceManagement'
import {findApprovedNodeList} from '@/api/common'
import Approval from './Approval'
import CustomerList from '@/components/CustomerList/CustomerList'
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
  name: 'business-trip-apply-add',
  components: {
    Approval,
    CustomerList,
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

      vehicleList: [], //交通工具
      carList: [], //公司车辆
      beginAreaId: [], //出发城市
      beginAreaName:'',
      routesList: [], //出差行程
      isSalesman: false,

      isCompanyCar: false, //交通工具为公车时，下面的选项才可以选择车牌号
      lastApprovedNode:{} //取最后一个审批节点信息
    }
  },
  computed: {
    modalTitle() {
      let obj = { view: '查看', add: '新增', edit: '修改', approval: '审批' }
      return `${obj[this.actionType]}出差申请`
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
    calcRouteTimeDiff() {
      let total = this.routesList.reduce((adder, item, idx, arr) => {
        let s1 = moment(item.startTime),
          e1 = moment(item.endTime)
        if (s1.isValid() && e1.isValid()) {
          return adder + e1.diff(s1, 'minutes')
        }
        return adder
      }, 0)
      if (total <= 0) {
        return '-'
      }
      let days = parseInt(total / 60 / 24, 10)
      let hours = parseInt(total / 60 - days * 24, 10)
      let minutes = parseInt(total - days * 24 * 60 - hours * 60, 10)
      return `${days ? days + ' 天 ' : ''}${hours ? hours + ' 小时 ' : ''}${minutes > 0 ? minutes + ' 分钟 ' : ''}`
    }
  },
  watch: {},
  methods: {
    moment,
    init() {
      let that = this
      let queue = []
      let task1 = getDictionaryList({ parentId: 509 }).then(res => (that.vehicleList = res.data))
      queue.push(task1)
      let task2 = getDictionaryList({ parentId: 515 }).then(res => (that.carList = res.data))
      queue.push(task2)
      let task3 = that.checkSalesman()
      queue.push(task3)
      return Promise.all(queue)
    },
    checkSalesman() {
      let that = this
      let userId = this.userInfo.id || this.record.createdId
      return getOneSalesman({ userId }).then(res => {
        that.isSalesman = res.data.length > 0
      })
    },
    async query(type, record) {
      let that = this
      ;(that.actionType = type), (that.record = Object.assign({}, record))
      that.detail = {}
      that.routesList = []
      that.form.resetFields()
      await that.init()
      that.visible = true



      if (that.isAdd) {
        that.detail = {}
        attenceTravelApplyGetNewstAccount().then(res =>{
          if(res && res.data && res.data.bankAccount){
            that.detail = Object.assign({},that.detail,{bankAccount:res.data.bankAccount})
          }
        })
        that.routeAction('add')
        return
      }
      attenceTravelApplyDetail({ id: record.id }).then(res => {
        let data = res.data
        
        data.carDicNumTxt = that.getCarDicNumTxt(data.carDicNum)
        //data.beginAreaName = await that.getAreaTextByIds(data.beginAreaId)
        that.detail = { ...data }

        that.isCompanyCar = !!that.carList.find(item => String(item.label) === '公车')

        that.beginAreaId = data.beginAreaId
        that.beginAreaName = data.beginAreaName
        that.routesList = that.detail.routes.map(route => {
          return {
            _key: uuid(),
            endAreaId: route.endAreaId,
            endAreaName: route.endAreaName || '',
            vehicleId: route.vehicleId,
            vehicle:route.vehicle,
            startTime: route.startTime,
            endTime: route.endTime,
            reason: route.reason,
            chargeUserDepId: route.chargeUserDepId,
            chargeUserId: route.chargeUserId,
            chargeUserName:route.chargeUserName,
            users: route.users
              ? route.users.map(u => {
                  return {
                    _key: uuid(),
                    id: u.userId,
                    trueName: u.userName
                  }
                })
              : []
          }
        })

        if(+data.status === 2){
          that.fetchApprovedNode(data.instanceId)
        }
      })
    },
    fetchApprovedNode(instanceId){
      let that = this
      findApprovedNodeList({instanceId: instanceId})
      .then(res => {
        if(Array.isArray(res.data) && res.data.length > 0)
        that.lastApprovedNode = res.data[res.data.length - 1]
      })
    },
    
    areaCascadeChange(type, key, arrArea, arrAreaItems) {
      //debugger
      let that = this
      if (type === 'beginAreaId') {
        this.beginAreaId = arrArea.join(',')
        that.detail = Object.assign({}, that.detail, { 
          beginAreaId: arrArea.join(','),
          beginAreaName: arrAreaItems.map(item =>item.label).join('')
        })
        return
      }
      if (type === 'endAreaId') {
        let _routesList = [...that.routesList]
        let target = _routesList.find(item => item._key === key)
        if (target) {
          target.endAreaId = arrArea.join(',')
          target.endAreaName = arrAreaItems.map(item =>item.label).join('')
          that.routesList = [..._routesList]
        }
      }
    },
    dateTimePickerChange(type, key, timeStr) {
      let _routesList = [...this.routesList]
      let target = _routesList.find(item => item._key === key)
      if (target) {
        target[type] = timeStr
        target['__dateStatus'] = target['endTime'] > target['startTime']

        this.routesList = [..._routesList]
      }
      console.log(this.routesList)
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

      let car = this.vehicleList.find(car => +car.id === +val)
      this.isCompanyCar = car && String(car.text).trim() === '公车'
      if (!this.isCompanyCar) {
        this.form.setFieldsValue({ carDicNum: undefined })
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
    handleCustomerClick() {
      this.$refs.customerList.init({userId:this.userInfo.id})
    },
    handlerCustomerSelected(record) {
      this.form.setFieldsValue({
        customerName: record.name,
        customerId: record.id
      })
    },
    birthplaceCascaderChange(arrSelected) {
      console.log('birthplaceCascaderChange called...')
      console.log(arguments)
    },
    birthplaceCascaderLoadData(selectedOptions) {
      let that = this
      const targetOption = selectedOptions[selectedOptions.length - 1]
      targetOption.loading = true
      getAreaByParent({ pId: targetOption.value })
        .then(res => {
          //城市
          targetOption.loading = false
          targetOption.children = res.data.map(item => {
            return {
              label: item.area,
              value: item.id,
              isLeaf: item.level === 3 ? true : false
            }
          })
          that.birthplaceOptions = [...that.birthplaceOptions]
        })
        .catch(function(err) {
          console.log(err)
        })
    },
    loadAreaAction(pId) {
      const that = this
      return getAreaByParent({ pId: pId })
        .then(res => {
          //城市
          return res.data.map(item => {
            return {
              label: item.area,
              value: item.id,
              isLeaf: item.level === 3 ? true : false
            }
          })
        })
        .catch(function(err) {
          console.log(err)
          return []
        })
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
          console.log(that.routesList)
          if(!that.beginAreaId || (Array.isArray(that.beginAreaId) && that.beginAreaId.length === 0)){
            that.$message.info('请选择出发城市')
            return
          }

          for(let i =0,len = that.routesList.length;i<len;i++){
            let route = that.routesList[i]
            if(!route.endAreaId){
              that.$message.info(`请选择行程${i + 1}内的 目的城市`)
              return
            }
            if(!route.vehicleId){
              that.$message.info(`请选择行程${i + 1}内的 交通工具`)
              return
            }
            if(!route.startTime){
              that.$message.info(`请选择行程${i + 1}内的 开始日期`)
              return
            }
            if(!route.endTime){
              that.$message.info(`请选择行程${i + 1}内的 结束日期`)
              return
            }
            if(!route.__dateStatus){
              that.$message.info(`行程${i + 1}内的 结束日期 必须大于 开始时间`)
              return
            }
          }

          //return
          values.status = that.record.status || 0 //状态待审批
          values.beginAreaId = that.beginAreaId || that.detail.beginAreaId //外层出发城市
          values.beginAreaName = that.beginAreaName || that.detail.beginAreaName
          values.routes = that.$_.cloneDeep(that.routesList).map(item => {
            delete item._key
            return item
          })




          that.spinning = true
          // 判断开始日期 1.早于当前时间，给出提示
          //2.开始时间不能早于当前时间
          let nowTime = new Date()
          let valueStartTime = new Date(Date.parse(values.routes[0].startTime.replace(/-/g, '/')))
          if (valueStartTime < nowTime) {
            that.spinning = false
            this.$message.warning('选择时间不能在当前时间之前')
          } else {
            attenceTravelApplyAddAndUpdate(values)
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
      attenceTravelApplyApprove(values)
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
    getCarDicNumTxt(id){
      let target = this.carList.find(item => +item.id === +id)
      if(target){
        return target.text
      }
      return ''
    },
    async getAreaTextByIds(ids){
      let _ids = ids.split(',')
      let arr = []

      let getAreaText = async (pId,key) => {
        let res = await getAreaByParent({pId:pId})
        let target = res.data.find(item => String(item.id) === String(key))
        return target ? target.area : ''
      }

      let initKey = '100000',findKey = ''
      for(let i=0,len = _ids.length;i<len;i++){
        findKey = _ids[i]
        let res = await getAreaText(initKey,findKey)
        arr.push(res)
        initKey = findKey
      }

      console.log(arr)
      return arr.join('/')
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
</style>