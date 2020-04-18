<template>
  <a-modal
    :title="modalTitle"
    :width="550"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false" 
    :footer="null"
  >
    <div class="customer-list-wrapper">
      <div class="main-wrapper">
        <a-table
          :columns="columns"
          :dataSource="dataSource"
          :pagination="false"
          :loading="loading" 
          size="small"
        >
          <div slot="order" slot-scope="text, record, index">
            {{ index + 1 }}
          </div>
        </a-table>
      </div>
    </div>
  </a-modal>
</template>

<script>

import {
  priceAdjustProductConfigDetail
} from '@/api/productOfferManagement'

const columns = [
  {
    align: 'center',
    title: '序号',
    dataIndex: 'order',
    scopedSlots: { customRender: 'order' },
    width:'70px'
  },
  {
    title: '配置名称',
    dataIndex: 'name',
    width:'400px'
  }
]
export default {
  name:'ViewOption',
  components:{

  },
  data(){
    return {
      modalTitle:'',
      visible:false,
      columns:columns,
      dataSource:[],
      loading:false,
      extendSearchParam:{} //传入的搜索参数
    }
  },
  computed:{
    searchParam(){
      return {
      }
    }
  },
  methods:{
    init(){
      let that = this
    },
    searchAction(opt){
      let that = this
      let _searchParam = Object.assign({},{...this.searchParam},{...this.extendSearchParam},opt || {})
      console.log('执行搜索...',_searchParam)
      that.loading = true
      priceAdjustProductConfigDetail(_searchParam).then(res => {
        that.loading = false
        that.modalTitle = res.data.name + `  [ ${(_searchParam.type === 1 ? '标配项' : '选配项')} ]`
        that.dataSource = res.data.sysConfigList.map((item,index) =>{
          item.key = index
          return item
        })
      }).catch(err => that.loading = false)
    },

    async handleOk(){
      let that = this
      that.handleCancel()
    },
    handleCancel(){
      this.$nextTick(() =>this.visible = false)
    },
    async query(searchParam){
      let that = this
      that.visible = true
      that.extendSearchParam = Object.assign({},(searchParam || {}))
      that.searchAction()
    }
  }
}
</script>

<style scoped>
  .selected-wrapper{
    padding: 10px 20px;
    box-shadow: 0 0 2px 0 rgba(0, 0, 0, .1);
  }
  .selected-wrapper .selected-tags{
    margin-top: 8px;
  }
</style>