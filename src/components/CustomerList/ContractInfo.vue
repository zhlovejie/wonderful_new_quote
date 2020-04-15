<template>
  <a-modal
    title="合同详细"
    :width="900"
    v-model="visible"
    :maskClosable="false" 
    :footer="null"
  >
    <a-table
      :columns="columns"
      rowKey="id"
      :dataSource="dataSource"
      :loading="loading"
    >
      <div slot="company" slot-scope="text,record,index">
        {{companyFormat(record.company)}}
      </div>
    </a-table>
  </a-modal>
</template>

<script>
import {productListByContract} from '@/api/receipt'
import {companyFormat} from '@/utils/util'
let columns = [
  // {
  //   align: 'center',
  //   title: '序号',
  //   key: 'order',
  //   width: '70px',
  //   scopedSlots: { customRender: 'order' }
  // },
  // {
  //   align: 'center',
  //   title: '产品类型',
  //   dataIndex: 'pType',
  //   key: 'pType',
  //   scopedSlots: { customRender: 'pType' }
  // },
  {
    align: 'center',
    title: '产品代码',
    dataIndex: 'productType',
    key: 'productType',
    scopedSlots: { customRender: 'productType' },
    width:'200px'
  },
  {
    align: 'center',
    title: '产品名称',
    dataIndex: 'productName',
    key: 'productName',
    scopedSlots: { customRender: 'productName' },
    width:'200px'
  },
  {
    align: 'center',
    title: '产品规格',
    dataIndex: 'productStandard',
    key: 'productStandard',
    scopedSlots: { customRender: 'productStandard' },
    width:'200px'
  },
  {
    align: 'center',
    title: '单位',
    dataIndex: 'company',
    key: 'company',
    scopedSlots: { customRender: 'company' }
  },
  {
    align: 'center',
    title: '数量',
    dataIndex: 'count',
    key: 'count',
    scopedSlots: { customRender: 'count' }
  },
  // {
  //   align: 'center',
  //   title: '单价(元)',
  //   dataIndex: 'unitPrice',
  //   key: 'unitPrice',
  //   scopedSlots: { customRender: 'unitPrice' }
  // },
  // {
  //   align: 'center',
  //   title: '税率',
  //   dataIndex: 'taxRate',
  //   key: 'taxRate',
  // },
  // {
  //   align: 'center',
  //   title: '已收款',
  //   dataIndex: 'receivable',
  //   key: 'receivable'
  // }
]
export default {
  name:'ContractInfo',
  data(){
    return {
      visible:false,
      columns:columns,
      dataSource:[],
      loading:false
    }
  },
  mounted(){
    this.dataSource = []
  },
  methods:{
    init(contractID){
      this.visible = true
      this.loading = true
      productListByContract({id:contractID})
        .then(res =>this.dataSource = res.data)
        .catch(error =>console.log(error))
        .finally(() => this.loading = false)
    },
    companyFormat:companyFormat
  }
}
</script>

<style scoped>

</style>