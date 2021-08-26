<template>
<a-spin :spinning="spinning">
  <div class="apply-form-view-wrapper">
    <div class="card-item">
      <div class="__hd">申请人信息</div>
      <div class="__bd">
        <table class="custom-table custom-table-border">
          <tr>
            <td style="width:150px;">申请人</td>
            <td colspan="3">
              {{detail.applyDepName}}/{{detail.proposerName}}
            </td>
          </tr>
          <tr>
            <td style="width:150px;">申请原因</td>
            <td colspan="3">{{detail.reason}}</td>
          </tr>
          <tr>
            <td style="width:150px;">申请备注</td>
            <td colspan="3">{{detail.remark}}</td>
          </tr>
          <tr>
            <td style="width:150px;">制单人</td>
            <td>{{detail.createdName}}</td>
            <td style="width:150px;">制单时间</td>
            <td>{{detail.createdTime}}</td>
          </tr>
        </table>
      </div>
    </div>
    <div class="card-item">
      <div class="__hd">需求物料</div>
      <div class="__bd">
        <a-table
          :columns="columns"
          :dataSource="dataSource"
          :pagination="false"
          size="small"
        >
          <div
            slot="order"
            slot-scope="text, record, index"
          >
            <span>{{index + 1}}</span>
          </div>
          <div
            slot="requestApplyNum"
            slot-scope="text, record, index"
          >
            {{record.requestApplyNum}}
          </div>

          <div
            slot="materialCode"
            slot-scope="text, record, index"
          >
            {{record.materialCode}}
          </div>

          <div
            slot="requestNum"
            slot-scope="text, record, index"
          >
            {{record.requestNum}}
          </div>
          <div
            slot="requestTime"
            slot-scope="text, record, index"
          >
            {{record.requestTime instanceof moment ? record.requestTime.format('YYYY-MM-DD HH:mm:ss') : record.requestTime}}
          </div>
          <div
            slot="mainUnit"
            slot-scope="text, record, index"
          >
            {{ {1:'支',2:'把',3:'件'}[text] }}
          </div>
          <div
            slot="inventory"
            slot-scope="text, record, index"
          >
            <span>{{text}}</span>
          </div>
        </a-table>
      </div>
    </div>
    <div class="card-item">
      <div class="__hd">需求物料</div>
      <div class="__bd">
        <table class="custom-table custom-table-border" v-for="item in priewData" :key="item.id">
          <tr>
            <td style="width:150px;">审核结果</td>
            <td >
              item
            </td>
          </tr>
          <tr>
            <td style="width:150px;">审核理由</td>
            <td >
              {{item.code}}
            </td>
          </tr>
          <tr>
            <td style="width:150px;">审核人/审核时间</td>
            <td >
              {{item.userName}}/{{item.createTime}}
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</a-spin>
</template>
<script>
import moment from 'moment'

import { requestApplyDetail } from '@/api/procurementModuleManagement'
import {findApprovedNodeList} from '@/api/common'
const columns = [
  {
    title: '序号',
    scopedSlots: { customRender: 'order' }
  },
  {
    title: '需求单号',
    dataIndex: 'requestApplyNum',
    scopedSlots: { customRender: 'requestApplyNum' }
  },
  {
    title: '需求类型',
    dataIndex: 'requestTypeText'
  },
  {
    title: '关联单号',
    dataIndex: 'relatedNumText'
  },
  {
    title: '物料代码',
    dataIndex: 'materialCode',
    scopedSlots: { customRender: 'materialCode' }
  },
  {
    title: '物料名称',
    dataIndex: 'materialName'
  },
  {
    title: '单位',
    dataIndex: 'mainUnit',
    scopedSlots: { customRender: 'mainUnit' }
  },
  {
    title: '当前库存',
    dataIndex: 'inventory',
    scopedSlots: { customRender: 'inventory' }
  },
  {
    title: '需求数量',
    dataIndex: 'requestNum',
    scopedSlots: { customRender: 'requestNum' }
  },
  {
    title: '需求日期',
    dataIndex: 'requestTime',
    scopedSlots: { customRender: 'requestTime' }
  }
]

export default {
  components: {},
  data() {
    return {
      columns,
      visible: false,
      spinning: false,
      detail: {},
      userInfo: this.$store.getters.userInfo, // 当前登录人
      dataSource: [],
      priewData:[]
    }
  },
  computed:{
    lastPriewData(){

    }
  },
  methods: {
    moment,
    async query(record) {
      const that = this
      that.detail = {}
      that.dataSource = []
      that.visible = true

      that.spinning = true
      const result = await requestApplyDetail({ id: record.id }).then(res => res.data).catch(err => {
        console.log(err)
        return null
      })
      if(result === null){
        that.$message.error('requestApplyDetail 接口出错')
        return
      }
      that.detail = result
      that.dataSource = [
        {
          key: that._uuid(),
          ...that.detail,
          mainUnit: that.detail.unit,
          inventory: that.detail.inventory || 0,
          requestTime: moment(that.detail.requestTime),
          unsafetyInventory: that.detail.requestNum > that.detail.inventory ? 1 : 2
        }
      ]

      if(!that.detail.relatedNum){ //不关联订单的，不显示 关联订单列
        that.columns = that.columns.filter(item => item.dataIndex !== 'relatedNumText')
      }
      // 获取审批预览信息
      that.priewData = await findApprovedNodeList({instanceId: that.detail.instanceId})
      .then(res => res.data).catch(err => {
        console.log(err)
        return []
      })

    }
  }
}
</script>

<style scoped>
.card-item {
  margin-bottom: 20px;
}
.card-item:last-child {
  margin-bottom: 0;
}
.__hd {
  font-weight: 700;
  line-height: 40px;
  border-bottom: 1px solid #ccc;
  margin-bottom: 10px;
}

.ant-form-item {
  margin-bottom: 0;
}
.custom-table-border th,
.custom-table-border td {
  padding: 10px;
  text-align: left;
}
.ant-alert-with-description.ant-alert-no-icon {
  padding: 5px 20px;
}
</style>


