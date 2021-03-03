<template>
  <a-modal
    title="操作"
    :width="800"
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
        <span slot="advancesCode" slot-scope="text, record">
          <a @click="clickVue(record)">{{ text }}</a>
        </span>
      </s-table>
    </a-spin>
  </a-modal>
</template>

<script>
import { STable } from '@/components'
import { getDeductionList } from '@/api/receipt'

export default {
  name: 'ReceiptAgencyContract',
  components: {
    STable,
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
      salesmanId: undefined,
      contractType: '1',
      contractTypes: [],
      columns: [
        {
          align: 'center',
          title: '序号',
          key: 'order',
          width: '70px',
          scopedSlots: { customRender: 'order' },
        },
        {
          title: '收款编号',
          dataIndex: 'advancesCode',
          scopedSlots: { customRender: 'advancesCode' },
        },
        {
          title: '客户名称',
          dataIndex: 'customerName',
        },

        {
          title: '销售经理',
          dataIndex: 'saleUserName',
        },
        {
          title: '收款日期',
          dataIndex: 'receiptTime',
        },
        {
          title: '结算方式',
          dataIndex: 'bankName',
        },

        {
          title: '本次实收',
          dataIndex: 'paidMoney',
        },
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        return getDeductionList(Object.assign(parameter, this.queryParam)).then((res) => {
          return res
        })
      },
    }
  },
  methods: {
    query(record) {
      this.mdl = Object.assign({}, record)
      if (record != undefined) {
        this.$set(this.queryParam, 'saleUserId', record.saleUserId)
      }
      this.visible = true
      this.search()
    },
    search() {
      this.$set(this.queryParam, 'customerName', this.customerName)
      this.$refs.table && this.$refs.table.refresh(true)
    },
    // close() {
    //   this.$emit('close')
    //   this.visible = false
    // },
    clickVue(data) {
      data.Deduction = Number(data.paidMoney) - Number(data.deductionMoney)
      this.$emit('custom-change', data)
      this.visible = false
      //   this.close()
    },
  },
}
</script>
