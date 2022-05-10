<template>
  <a-modal
    title="查看"
    :width="860"
    :confirmLoading="confirmLoading"
    :footer="null"
    v-model="visible"
    :maskClosable="false"
  >
    <!-- <div class="top-ation">12312312</div> -->

    <div v-for="(i, index) in todayList" :key="index">
      <h3 style="font-weight: 700">发货单{{ index + 1 }}</h3>
      <table class="custom-table custom-table-border">
        <tr>
          <td colspan="3" style="text-align: Left; border-top: none; border-left: none; border-right: none">
            <b>提货信息</b>
          </td>
        </tr>
        <tr>
          <th>客户名称</th>
          <th>收货人</th>
          <th>电话</th>
        </tr>
        <tr>
          <td>{{ i.customerName }}</td>
          <td>{{ i.consignee }}</td>
          <td>{{ i.contactInformation }}</td>
        </tr>
        <tr>
          <td colspan="3" style="text-align: Left; border-left: none; border-right: none">
            <b>货物信息</b>
          </td>
        </tr>
        <tr>
          <th>名称</th>
          <th>数量</th>
          <th>方数</th>
        </tr>
        <tr v-for="(item, index) in i.logisticsCargInformationList" :key="index">
          <td>{{ item.productName }}</td>
          <td>{{ item.invoiceCount }}</td>
          <td>{{ item.squareNum }}</td>
        </tr>
      </table>
    </div>
  </a-modal>
</template>

<script>
import { getQueryOne } from '@/api/distribution-management'

export default {
  name: 'ProductModel',

  data() {
    return {
      first: false,
      visible: false,
      confirmLoading: false,
      todayList: [],
    }
  },
  computed: {},
  watch: {},
  cerated() {},
  mounted() {},
  methods: {
    query(record) {
      this.visible = true
      getQueryOne({ id: record.id }).then((res) => {
        this.todayList = res.data.logisticsInvoices
      })
    },

    // 关闭弹窗函数
    close() {
      this.visible = false
    },
  },
}
</script>

<style lang="less" scoped>
.marg-t16 {
  margin-top: 16px;
}
.modal-input {
  width: 100px;
}
</style>
