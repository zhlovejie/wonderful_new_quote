<template>
  <div class="wdf-module-wrapper">
    <div class="top-ation">
      <a-form layout="inline">
        <a-form-item label="客户名称">
          <a-input v-model="customerName"/>
        </a-form-item>
        <a-form-item label="销售人员">
          <a-select class="a-select" style="width: 150px" v-model="userId" defaultValue="0">
            <a-select-option :value="0">请选择单位</a-select-option>
            <a-select-option :key="val.id" v-for="val in saleUsers" :value="val.id">{{ val.trueName }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button class="a-button" type="primary" icon="search" @click="search">查询</a-button>
        </a-form-item>
      </a-form>
    </div>
    <s-table
      ref="table"
      size="default"
      :columns="columns"
      :data="loadData"
      :alert="false"
    >
      <div slot="order" slot-scope="text, record, index">
        <span>{{ index + 1 }}</span>
      </div>
      <span slot="contractNum" slot-scope="text, record">
        <a @click="clickVue(record)">{{ text }}</a>
      </span>
      <span slot="presentNum" slot-scope="text, record">
        <a @click="clickVue(record)">{{ text }}</a>
      </span>
      
      <div slot="contractDetail" slot-scope="text, record, index">
        <a href="javascript:void(0);" @click="viewContractDetail(record)">查看</a>
      </div>
    </s-table>
    <PresentOrderDetail ref='contractInfo' />
  </div>
</template>

<script>
import { STable } from '@/components'
import { presentOrderPageList } from '@/api/receipt'
import { listUserBySale } from '@/api/systemSetting'
import PresentOrderDetail from '@/views/sale/present-order/AddForm'
export default {
  name: 'invoicePresentOrder',
  components: {
    STable,
    PresentOrderDetail
  },
  data () {
    return {
      visible: false,
      queryParam: {},
      customerName: '',
      userId: 0,
      saleUsers: [],
      columns: [
        {
          align: 'center',
          title: '序号',
          key: 'order',
          width: '70px',
          scopedSlots: { customRender: 'order' }
        },
        {
          title: '赠送单编号',
          dataIndex: 'presentNum',
          scopedSlots: { customRender: 'presentNum' }
        },
        
        {
          title: '客户名称',
          dataIndex: 'customerName'
        },
        {
          title: '对应销售',
          dataIndex: 'saleUserName'
        },
        {
          title:'合同详情',
          dataIndex: 'contractDetail',
          scopedSlots: { customRender: 'contractDetail' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        console.log('开始加载列表数据')
        return presentOrderPageList(Object.assign(parameter,this.queryParam))
          .then(res => {
            return res
          })
      }
    }
  },
  mounted(){
    this.init()
  },
  methods: {
    init () {
      listUserBySale().then((res) => this.saleUsers = res.data)
    },
    search () {
      this.queryParam = {
        'customerName': this.customerName,
        'userId': this.userId
      }
      this.$refs.table.refresh(true)
    },
    clickVue (data) {
      this.$emit('change', data)
    },
    viewContractDetail(record){
      console.log(record)
      this.$refs.contractInfo.query('view',record)
    }
  }
}
</script>
