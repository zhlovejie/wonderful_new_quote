<template>
  <a-modal
    :title="modalTitle"
    :width="1200"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
    :confirmLoading="spinning"
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
        <a-button key="submit" type="primary" :loading="spinning" @click="handleOk">确定</a-button>
      </template>
    </template>
    <a-spin :spinning="spinning">
      <div class="add-form-wrapper">
        <h3>日期：{{detail.recordDate}} &nbsp;&nbsp;考核人：{{detail.examineUserName || '-'}} &nbsp;&nbsp;降本激励总金额：{{detail.totalBonus | moneyFormatNumber}}</h3>
        <a-table :columns="columns" :dataSource="dataSource" :pagination="false" size="small">
          <div slot="order" slot-scope="text, record, index">
            <span>{{ index + 1 }}</span>
          </div>
          <div slot="inventoryQuantity" slot-scope="text, record, index">
            <template v-if="isDisabled">{{record.inventoryQuantity | NumberFormat}}</template>
            <template v-else>
              <a-input-number
                style="width:80px;"
                :min="0"
                :step="1"
                :precision="0"
                :disabled="isDisabled"
                :value="record.inventoryQuantity"
                @change="priceChange($event,'inventoryQuantity',record)"
              />
            </template>
          </div>
          <div slot="nowPrice" slot-scope="text, record, index">
            <template v-if="isDisabled">{{record.nowPrice | moneyFormatNumber}}</template>
            <template v-else>
              <a-input-number
                style="width:110px;"
                :min="0"
                :step="1"
                :precision="2"
                :disabled="isDisabled"
                :value="record.nowPrice"
                @change="priceChange($event,'nowPrice',record)"
              />
            </template>
          </div>
          <div slot="convertibleProportion" slot-scope="text, record, index">
            <template v-if="isDisabled">{{record.convertibleProportion}}</template>
            <template v-else>
              <a-input-number
                style="width:80px;"
                :min="0"
                :max="100"
                :step="1"
                :precision="0"
                :disabled="isDisabled"
                :value="record.convertibleProportion"
                @change="priceChange($event,'convertibleProportion',record)"
              />
            </template>
          </div>
          <div slot="economizeMoney" slot-scope="text, record, index">{{text | moneyFormatNumber}}</div>
          <div slot="bonus" slot-scope="text, record, index">{{text | moneyFormatNumber}}</div>

          <div slot="action" slot-scope="text, record, index">
            <a href="javascript:void(0);" @click="doAction('use',record)">
              {{isDisabled ? '查看' : '分配'}}
              <a-tag
                v-if="!isDisabled"
                :color="checkUsers(record) ? 'red' : 'orange'"
              >{{checkUsers(record) ? '已分配' : '尚未分配'}}</a-tag>
            </a>
          </div>
        </a-table>
      </div>
      <DoDisposeRuleForm ref="doDisposeRuleForm" @finish="setUsers" />
      <Approval ref="approval" @opinionChange="opinionChange" />
    </a-spin>
  </a-modal>
</template>

<script>
import {
  depreciateRecordDetail,
  depreciateRecordDispose,
  depreciateRecordApprove,
  depreciateUserListByApply,
  depreciateRecordUserListByDetail
} from '@/api/production/cutCost'
import moment from 'moment'
import DoDisposeRuleForm from './DoDisposeRuleForm'
import Approval from './Approval'
const columns = [
  {
    align: 'center',
    title: '序号',
    key: 'order',
    width: '70px',
    scopedSlots: { customRender: 'order' }
  },
  {
    align: 'center',
    title: '现物料代码',
    dataIndex: 'newCode'
  },
  {
    align: 'center',
    title: '产品名称',
    dataIndex: 'newName'
  },
  {
    align: 'center',
    title: '当月入库数据',
    dataIndex: 'inventoryQuantity',
    scopedSlots: { customRender: 'inventoryQuantity' }
  },
  {
    align: 'center',
    title: '当月零部件采购价格',
    dataIndex: 'nowPrice',
    scopedSlots: { customRender: 'nowPrice' }
  },
  {
    align: 'center',
    title: '总节约金额',
    dataIndex: 'economizeMoney',
    scopedSlots: { customRender: 'economizeMoney' }
  },
  {
    align: 'center',
    title: '奖金兑换比例(%)',
    key: 'convertibleProportion',
    scopedSlots: { customRender: 'convertibleProportion' }
  },
  {
    align: 'center',
    title: '降本激励金额',
    dataIndex: 'bonus',
    scopedSlots: { customRender: 'bonus' }
  },
  {
    align: 'center',
    title: '参与人员金额分配',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'AddForm',
  components: {
    DoDisposeRuleForm,
    Approval
  },
  data() {
    return {
      visible: false,
      actionType: 'add',
      spinning: false,
      columns: columns,
      dataSource: [],
      detail: {},
      record:{}
    }
  },
  computed: {
    modalTitle() {
      return this.isAdd ? '新增' : this.isEdit ? '修改' : '处理'
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
    isUse() {
      return this.actionType === 'use'
    },
    isApproval() {
      return this.actionType === 'approval'
    },
    isDisabled() {
      //此状态下表单元素被禁用
      return this.isView || this.isApproval
    }
  },
  methods: {
    moment: moment,
    disabledDate(current) {
      return current && current < this.moment().endOf('day')
    },
    init() {
      let that = this
      return Promise.all([])
    },
    async handleOk() {
      let that = this
      if (that.isView || that.isApproval) {
        that.handleCancel()
        return
      }

      for(let item of that.dataSource){
        if(!that.checkUsers(item)){
          that.$message.info(`物料代码为【${item.newCode}】,产品名称为【${item.newName}】的记录尚未完成 参与人员金额分配，请分配后再操作。`)
          return
        }
      }

      let values = {
        type: that.record.__type,
        id: that.detail.id || undefined,
        totalBonus:parseFloat(that.detail.totalBonus) || 0,
        instanceId: that.detail.instanceId || undefined,
        detailList: [...that.dataSource]
      }

      that.spinning = true
      depreciateRecordDispose(values).then(res => {
        that.spinning = false
        console.log(res)
        that.visible = false
        that.$message.info(res.msg)
        that.$emit('finish')
      })
    },
    handleCancel() {
      this.$nextTick(() => (this.visible = false))
    },
    async query(type, record) {
      let that = this
      that.actionType = type
      that.record = record || {}
      that.dataSource = []
      await that.init()
      that.visible = true

      that.spinning = true
      depreciateRecordDetail({ id: record.id })
        .then(res => {
          // debugger
          that.spinning = false
          if (res.data.recordDate) {
            res.data.recordDate = that.moment(res.data.recordDate).format('YYYY-MM-DD')
          }

          let usersQueue = []
          res.data.detailList.map(item => {
            // debugger
            let _api = (that.record.withdrawState || 0) === 0 && (that.record.approveState || 0) === 0
            ? depreciateUserListByApply({ applyId: item.applyId })
            : depreciateRecordUserListByDetail({detailId:item.id})
            usersQueue.push(
              _api.then(_res => {
                item.users = [..._res.data]
              })
            )
          })
          Promise.all(usersQueue).then(() => {
            that.detail = { ...res.data }
            that.dataSource = res.data.detailList.map(item => {
              let _item = Object.assign({}, item)
              _item.key = Math.random()
                .toString(16)
                .slice(-10)
              if(that.isUse){
                _item.inventoryQuantity = undefined
                _item.nowPrice = undefined
              }
              return _item
            })
          })
        })
        .catch(err => (that.spinning = false))
    },
    priceChange(val, fieldName, record) {
      let _dataSource = [...this.dataSource]
      let target = _dataSource.find(item => item.key === record.key)
      if (target) {
        target[fieldName] = val
        this.dataSource = _dataSource

        this.calcPrice()
      }
    },
    calcPrice() {
      let _dataSource = [...this.dataSource]
      _dataSource.map(item => {
        let r1 = (parseInt(item.inventoryQuantity, 10) || 0) * parseFloat(item.quondamPrice) || 0
        let r2 = (parseInt(item.inventoryQuantity, 10) || 0) * parseFloat(item.nowPrice) || 0
        //总节约金额
        item.economizeMoney = parseFloat(r1 - r2)
        //奖金兑换比例
        //item.convertibleProportion
        //降本奖励金额
        item.bonus = (parseInt(item.convertibleProportion, 10) / 100) * parseFloat(item.economizeMoney)
      })

      let _totalBonus = _dataSource.reduce((calc,item) =>{
        calc += parseFloat(item.bonus) || 0
        return calc
      },0)
      this.$set(this.detail,'totalBonus',_totalBonus)
    },
    doAction(type, record) {
      if (type === 'use') {
        // if(parseFloat(record.bonus) <= 0){
        //   this.$message.info(`降本奖励金额为:${record.bonus},禁止操作。`)
        //   return
        // }
        //debugger
        let _type = this.isView || this.isApproval ? 'view' : 'use'
        //  withdrawState 撤销状态（0未撤销，1已撤销。默认0）
        this.$refs.doDisposeRuleForm.query(_type, Object.assign({},record,{
          withdrawState:this.record.withdrawState || 0,
          approveState:this.record.approveState || 0
        }))
      }
    },
    setUsers(inputRecord, users) {
      let _dataSource = [...this.dataSource]
      let target = _dataSource.find(item => item.key === inputRecord.key)
      if (target) {
        target['users'] = users
        target.__use = true
        this.dataSource = _dataSource
      }
    },
    submitAction(opt) {
      let that = this
      let values = {
        approveId: that.record.id,
        isAdopt: opt.isAdopt,
        opinion: opt.opinion
      }
      that.spinning = true
      depreciateRecordApprove(values)
        .then(res => {
          that.spinning = false
          console.log(res)
          that.visible = false
          that.$message.info(res.msg)
          that.$emit('finish')
        })
        .catch(err => (that.spinning = false))
    },
    passAction() {
      this.submitAction({
        isAdopt: 0,
        opinion: '通过'
      })
    },
    noPassAction() {
      let that = this
      //that.opinion = ''
      that.$refs.approval.query()
    },
    opinionChange(opinion) {
      //审批意见
      this.submitAction({
        isAdopt: 1,
        opinion: opinion
      })
    },
    checkUsers(record) {
      if (!Array.isArray(record.users)) {
        return false
      }
      let res = record.users.reduce((calc, item) => {
        calc += parseInt(item.allocationProportion, 10) || 0
        return calc
      }, 0)
      return res === 100
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
</style>
