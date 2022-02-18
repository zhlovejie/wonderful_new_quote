<template>
  <a-modal
    title="操作"
    :width="1000"
    :confirmLoading="confirmLoading"
    :footer="null"
    v-model="visible"
    :maskClosable="false"
  >
    <div class="top-ation">
      <a-form layout="inline" :form="form">
        <a-form-item label="客户名称">
          <a-input v-model="customerName" :allowClear="true" />
        </a-form-item>
        <!-- <a-form-item label="销售人员">
          <a-select
            class="a-select"
            style="width: 150px"
            v-model="userId"
            :allowClear="true"
            showSearch
            placeholder="销售人员"
            optionFilterProp="children"
            :filterOption="filterCustomerOption"
          >
            <a-select-option v-for="val in saleUsers" :key="val.userId" :value="val.userId">{{
              val.salesmanName
            }}</a-select-option>
          </a-select>
        </a-form-item> -->
        <!-- <a-form-item label="是否含税">
          <a-select
            :allowClear="true"
            class="a-select"
            style="width: 150px"
            v-model="isTax"
            showSearch
            placeholder="是否含税"
            optionFilterProp="children"
          >
            <a-select-option :value="1">含税</a-select-option>
            <a-select-option :value="0">不含税</a-select-option>
          </a-select>
        </a-form-item> -->
        <a-form-item>
          <a-button class="a-button" type="primary" icon="search" @click="search">查询</a-button>
        </a-form-item>
      </a-form>
    </div>
    <a-spin :spinning="confirmLoading">
      <s-table ref="table" size="default" :columns="columns" :data="loadData" :alert="false">
        <div slot="order" slot-scope="text, record, index">
          <span>{{ index + 1 }}</span>
        </div>
        <span slot="accessoriesContractNum" slot-scope="text, record">
          <a @click="clickVue(record)">{{ text }}</a>
        </span>
        <div slot="contractDetail" slot-scope="text, record, index">
          <a href="javascript:void(0);" @click="viewContractDetail(record)">查看</a>
        </div>
      </s-table>
    </a-spin>

    <ContractInfo ref="contractInfo" />
  </a-modal>
</template>

<script>
import { STable } from '@/components'
// import { receiptSaleContractNoType } from '@/api/receipt'
import ContractInfo from '@/components/CustomerList/ContractInfo'
import { getListByPage } from '@/api/contractListManagement'
export default {
  name: 'ReceiptSaleContract',
  components: {
    STable,
    ContractInfo,
  },
  data() {
    return {
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      mdl: {},
      queryParam: {},
      customerName: '',
      loading: true,
      saleUsers: [],
      userId: undefined,
      isTax: undefined,
      columns: [
        {
          align: 'center',
          title: '序号',
          key: 'order',
          width: '70px',
          scopedSlots: { customRender: 'order' },
        },
        {
          title: '合同编号',
          dataIndex: 'accessoriesContractNum',
          scopedSlots: { customRender: 'accessoriesContractNum' },
        },
        {
          title: '客户名称',
          dataIndex: 'customerName',
        },
        // {
        //   title: '合同详情',
        //   dataIndex: 'contractDetail',
        //   scopedSlots: { customRender: 'contractDetail' },
        // },
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        return getListByPage(Object.assign(parameter, { paymentForm: 1, searchStatus: 0 }, this.queryParam)).then(
          (res) => {
            return res
          }
        )
      },
    }
  },
  methods: {
    query(record) {
      // this.mdl = Object.assign({}, record)
      // debugger
      if (record != undefined) {
        this.$set(this.queryParam, 'type', record.type)
      }
      this.visible = true
      // getListByPage().then((res) => {
      //   this.saleUsers = res.data
      // })
    },
    search() {
      this.$set(this.queryParam, 'customerName', this.customerName)
      // this.$set(this.queryParam, 'userId', this.userId)
      // this.$set(this.queryParam, 'isTax', this.isTax)
      this.$refs.table.refresh(true)
    },
    close() {
      this.$emit('close')
      this.visible = false
    },
    clickVue(data) {
      this.$emit('custom-change', data)
      this.close()
    },
    // 选择客户名称下拉框根据输入项进行筛选
    filterCustomerOption(input, option) {
      // 是否根据输入项进行筛选。当其为一个函数时，会接收 inputValue option 两个参数，当 option 符合筛选条件时，应返回 true，反之则返回 false。
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      // option.componentOptions.children[0].text   结果是"郑州依依不舍"
    },
    viewContractDetail(record) {
      console.log(record)
      this.$refs.contractInfo.init(record.contractId)
    },
  },
}
</script>
