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
    <a-spin :spinning="confirmLoading">
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
        <div slot="contractDetail" slot-scope="text, record, index">
          <a href="javascript:void(0);" @click="viewContractDetail(record)">查看</a>
        </div>
      </s-table>
    </a-spin>
    <ContractInfo ref='contractInfo' />
  </a-modal>
</template>

<script>
import { STable } from '@/components'
import { invoiceSaleContract } from '@/api/invoice'
import { listUserBySale } from '@/api/systemSetting'
import ContractInfo from '@/components/CustomerList/ContractInfo'
export default {
  name: 'InvoiceSaleContract',
  components: {
    STable,
    ContractInfo
  },
  data () {
    return {
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      mdl: {},
      queryParam: {},
      customerName: '',
      loading: true,
      saleUsers: [],
      userId: 0,
      columns: [
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
          dataIndex: 'customerName'
        },
        {
          title: '对应销售',
          dataIndex: 'userName'
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
        return invoiceSaleContract(Object.assign(parameter, {documentType:1},this.queryParam))
          .then(res => {
            return res
          })
      }
    }
  },
  methods: {
    query (record) {
      // this.mdl = Object.assign({}, record)
      this.visible = true
      listUserBySale().then((res) => {
        this.$nextTick(() => {
          this.saleUsers = res.data
        })
      })
    },
    search () {
      this.queryParam = {
        'customerName': this.customerName,
        'userId': this.userId
      }
      this.$refs.table.refresh(true)
    },
    close () {
      this.$emit('close')
      this.visible = false
    },
    clickVue (data) {
      this.$emit('custom-change', data)
      this.close()
    },
    viewContractDetail(record){
      console.log(record)
      this.$refs.contractInfo.init(record.contractId)
    }

  }
}
</script>
