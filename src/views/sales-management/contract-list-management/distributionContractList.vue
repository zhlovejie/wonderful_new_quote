<template>
  <div class="develop-wrap">
    <div class="top-ation">
      <a-input class="a-input" placeholder="合同编号" v-model="contractNum"/>

      <CustomerSelect
        ref="customerSelect"
        :options="customerSelectOptions"
        @selected="handleCustomerSelected"
        @inputClear="handleCustomerClear"
      />

      <a-select
        class="a-select"
        placeholder="合同状态"
        v-model="contractStatus"
        style="width: 100px"
        @change="handleContactChange">
        <a-select-option :value="-1">请选择合同状态</a-select-option>
        <a-select-option :value="0">未启动</a-select-option>
        <a-select-option :value="1">已启动</a-select-option>
        <a-select-option :value="2">已作废</a-select-option>
      </a-select>
      <a-select
        class="a-select"
        placeholder="审批状态"
        v-model="approveStatus"
        style="width: 100px"
        v-show="show"
        >
        <a-select-option :value="0">请选择审批状态</a-select-option>
        <a-select-option :value="-1">待提交</a-select-option>
        <a-select-option :value="1">待审批</a-select-option>
        <a-select-option :value="2">通过</a-select-option>
        <a-select-option :value="3">不通过</a-select-option>
      </a-select>
      <template v-if="$auth('distributionContract:list')">
        <a-button class="a-button" type="primary" icon="search" @click="searchDistributionContract">查询</a-button>
      </template>
      <template v-if="$auth('distributionContract:add')">
        <a-button class="fl-r" type="primary" @click="applyFor" icon="plus">申请</a-button>
      </template>
    </div>
    <div>
      <a-tabs defaultActiveKey="1" @change="callback">
        <a-tab-pane tab="全部" key="1">
          <all-the-contract ref="AllTheContract" :contractNum="contractNum" :approveStatus="approveStatus" :customerId="customerId" :contractStatus="contractStatus"></all-the-contract>
        </a-tab-pane>

        <template v-if="$auth('distributionContract:approval')">
          <a-tab-pane tab="待审批" key="2">
            <approval-pending ref="pending" :contractNum="contractNum" :customerId="customerId" :contractStatus="contractStatus"></approval-pending>
          </a-tab-pane>
          <a-tab-pane tab="已审批" key="3">
            <approved-contract ref="approvedcontract" :contractNum="contractNum" :customerId="customerId" :contractStatus="contractStatus"></approved-contract>
          </a-tab-pane>
        </template>
      </a-tabs>
      <!-- <div class="annotation">注：3万元以下的合同不需要邮寄，3万元以上的合同需要邮寄</div> -->
      <div class="annotation">注：合同大于等于50万元邮寄合同原件存档</div>
    </div>
  </div>

</template>

<script>
import { getcusSelectsList } from '../../../api/contractListManagement'
import allTheContract from './distribution-contract-list/Allthecontract'
import ApprovalPending from './distribution-contract-list/ApprovalPending'
import ApprovedContract from './distribution-contract-list/ApprovedContract'

import CustomerSelect from '@/components/CustomerList/CustomerSelect'


export default {
  name: 'DistributionContractList',
  components: {
    allTheContract, // 全部
    ApprovalPending, // 待审批
    ApprovedContract, // 已审批
    CustomerSelect
  },
  props: {},
  data () {
    return {
      contractNum: '', // 合同编号
      saleCustomers: {}, // 客户名称数组
      selectedCustomer: '选择客户名称', // 选中的客户名称
      selectedSeller: '选择对应的销售', // 选中的对应销售
      selectedExamion: '0', // 选中的审批状态
      contractStatus: -1, // 选中的合同状态
      approveStatus:0,
      customerName: '', // 客户名称
      customerId: 0, // 客户id
      selectTab:1,
      show: true,
      customerSelectOptions:{
        showInputLabel:false,
        wrapperStyle:{
          width:'260px',
          display: 'inline-block',
          marginRight: '8px'
        },
        formLayout:'horizontal',
        formItemLayout:{
          labelCol: { span: '' },
          wrapperCol: { span: '' },
        },
        inputRequired:false,
        inputAllowClear:true
      }
    }
  },
  computed: {

  },
  watch: {
    $route (to, from) {
      if(to.name === 'distributionContractList'){
        this.searchDistributionContract()
      }
    }
  },
  cerated () {

  },
  mounted () {
    this.init()
  },
  methods: {
    init () {

    },
    // 选择客户id下拉框变化
    handleCustomerChange (value) {
      console.log(`selected ${value}`)
      this.customerId = value
    },
    // 选择客户名称下拉框失去焦点
    handleCustomerBlur () { // 失去焦点的时回调
      console.log('blur')
    },
    // 选择客户名称下拉框获取焦点
    handleCustomerFocus () { // 获取焦点的时回调
      console.log('focus')
    },
    // 选择客户名称下拉框根据输入项进行筛选
    filterCustomerOption (input, option) { // 是否根据输入项进行筛选。当其为一个函数时，会接收 inputValue option 两个参数，当 option 符合筛选条件时，应返回 true，反之则返回 false。
      console.log('下拉框带搜索input', input)
      console.log('下拉框带搜索option', option)
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      // option.componentOptions.children[0].text   结果是"郑州依依不舍"
    },
    // 审批状态下拉选项改变
    handleExamineChange (value) {
      console.log(`selected ${value}`)
    },

    // 合同状态下拉选项改变
    handleContactChange (value) {
      // console.log('合同状态下拉选项改变',value)
      this.contractStatus = value
      console.log('合同状态下拉选项改变', this.contractStatus)


    },
    // 查询经销商合同
    searchDistributionContract (res) {
      //获取销售合同列表数据
      if(this.selectTab == 1){
        this.$refs['AllTheContract'].getList()
      }else if(this.selectTab == 2){
        this.$refs['pending'].getList()
      }else{
        this.$refs['approvedcontract'].getList()
      }

    },
    // 申请
    applyFor () {
      this.$router.push({ name: 'basicInformation1', params: { id:  null , action:'add' , from : 'distributionContractList'}})
    },
    // tab标签切换：全部、待审批、已审批
    callback (key) {
      this.selectTab = key;
      console.log("-------key:" + key)
      if (this.selectTab != 1) {
        this.show = false
      }else{
        this.show = true
      }
    },
    handleCustomerSelected(item){
      this.customerId = item.id
    },
    handleCustomerClear(){
      this.customerId = 0
    }
  }
}
</script>

<style lang="less" scoped>
  .top-ation .a-input {
    width: 160px;
    margin: 0 8px 8px 0;
  }
  .a-select{
    margin-right: 8px;
  }
  .a-button{
    margin-right: 8px;
  }
  .fl-r{
    float: right;
  }
  .develop-wrap{
    background-color: #fff;
    padding: 12px;
  }
  .annotation{
    color:red;
    margin-top: 12px;
  }
</style>
