<template>
  <a-modal
    title="选择合同"
    :width="800"
    :confirmLoading="confirmLoading"
    :footer="null"
    v-model="visible"
    :maskClosable="false"
  >
    <div class="top-ation">
      <a-form layout="inline" :form="form">
        <a-form-item label="客户名称">
          <a-input v-model="customerName"/>
        </a-form-item>
        <a-form-item label="销售人员">
          <a-select
            class="a-select"
            style="width: 150px"
            v-model="userId"
            defaultValue="0"
            showSearch
            placeholder="销售人员"
            optionFilterProp="children"
            :filterOption="filterCustomerOption"
          >
            <a-select-option :value="0">请选择销售人员</a-select-option>
            <a-select-option v-for="val in saleUsers" :key="val.id" :value="val.id">{{ val.trueName }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="是否含税">
          <a-select
            class="a-select"
            style="width: 150px"
            defaultValue="1"
            v-model="isTax"
            showSearch
            placeholder="是否含税"
            optionFilterProp="children"
          >
            <a-select-option :value="1">含税</a-select-option>
            <a-select-option :value="0">不含税</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button class="a-button" type="primary" icon="search" @click="search">查询</a-button>
        </a-form-item>
      </a-form>
    </div>
    <a-spin :spinning="confirmLoading">
      <s-table
        ref="table"
        size="default"
        :columns="columns"
        :data="loadData"
        :alert="false"
      >
        <span slot="contractNum" slot-scope="text, record">
          <a @click="clickVue(record)">{{ text }}</a>
        </span>
      </s-table>
    </a-spin>
  </a-modal>
</template>

<script>
import { STable } from '@/components'
import { allSoftwareContract } from '@/api/receipt'
import { listUserBySale } from '@/api/systemSetting'

export default {
  name: 'ReceiptSaleContract', // 所有的软件合同
  components: {
    STable
  },
  data () {
    return {
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      queryParam: {},
      customerName: '',
      loading: true,
      saleUsers: [],
      userId: 0,
      isTax: 1,
      columns: [
        {
          title: '合同编号',
          dataIndex: 'contractNum',
          scopedSlots: { customRender: 'contractNum' }
        },
        {
          title: '客户名称',
          dataIndex: 'customerName'
        },
        {
          title: '对应销售',
          dataIndex: 'userName'
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return allSoftwareContract(Object.assign(parameter, this.queryParam)).then(res => {
          return res
        })
      }
    }
  },
  methods: {
    query () {
      this.visible = true
      listUserBySale().then(res => {
        this.saleUsers = res.data
      })
    },
    search () {
      this.$set(this.queryParam, 'customerName', this.customerName)
      this.$set(this.queryParam, 'userId', this.userId)
      this.$set(this.queryParam, 'isTax', this.isTax)
      this.$set(this.queryParam, 'type', 1)
      this.$refs.table.refresh(true)
    },
    close () {
      this.visible = false
    },
    clickVue (data) {
      this.$emit('custom-change', data.contractId)
      this.close()
    },
    // 选择客户名称下拉框根据输入项进行筛选
    filterCustomerOption (input, option) { // 是否根据输入项进行筛选。当其为一个函数时，会接收 inputValue option 两个参数，当 option 符合筛选条件时，应返回 true，反之则返回 false。
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    }
  }
}
</script>
