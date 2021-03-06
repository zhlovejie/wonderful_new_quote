<template>
  <a-modal
    title="选择合同"
    :width="1000"
    :visible="visible"
    :destroyOnClose="true"
    @cancel="handleCancel"
    :maskClosable="false"
    :footer="null"
  >
    <div class="wdf-module-wrapper">
      <a-table
        :columns="columns"
        rowKey="id"
        :dataSource="data"
        :loading="loading"
      >
        <div slot="order" slot-scope="text, record, index">
          <span>{{ index + 1 }}</span>
        </div>
        <div slot="contractNum" slot-scope="text, record, index">
          <a href="javascript:void(0);" @click="clickVue(record)">{{text}}</a>
        </div>
      </a-table>
    </div>
  </a-modal>
</template>

<script>
import { STable } from '@/components'
import { getSaleContractSalesList } from '@/api/contractListManagement'
import ContractInfo from '@/components/CustomerList/ContractInfo'
const columns = [
  {
    align: 'center',
    title: '序号',
    key: 'order',
    width: '70px',
    scopedSlots: { customRender: 'order' }
  },
  {
    title: '合同编号',
    dataIndex: 'contractNum',
    scopedSlots: { customRender: 'contractNum' }
  },
  {
    title: '客户名称',
    dataIndex: 'saleCustomerName'
  },
  // {
  //   title: '对应销售',
  //   dataIndex: 'saleUserTrueName'
  // },
  {
    title: '更新时间',
    dataIndex: 'modifyTime'
  }
]
export default {
  name: 'InvoiceSaleContract',
  components: {
    STable,
    ContractInfo
  },
  data () {
    return {
      visible: false,
      data:[],
      // 表头
      columns: columns,
      loading:false,
      queryParam:{
        
      }
    }
  },
  methods: {
    // 获取列表
    search(params = {}) {
      const that = this
      let _searchParam = Object.assign({}, { ...that.queryParam },{...that.pagination},{
        current:1,size:100
      })
      this.loading = true
      getSaleContractSalesList(_searchParam)
        .then((res) => {
          this.loading = false
          let records = res.data.records
          //this.data = records.filter(item => +item.saleUser.id === +_searchParam.saleUserId)
          this.data = records
        })
        .catch((error) => {
          this.loading = false
          console.error(error)
        })
    },
    query(queryParam={}){
      this.visible = true
      this.queryParam = {...this.queryParam,...queryParam}
      this.$nextTick(() => this.search())
    },
    handleCancel(){
      this.visible = false
    },
    clickVue (data) {
      this.$emit('change', data)
      this.handleCancel()
    }
  }
}
</script>
