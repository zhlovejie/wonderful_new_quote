<template>
  <a-card :bordered="false">
    <!--div中可以写搜索条件，和功能按键-->
    <div class="description-document-search-wrapper">
      <a-form layout="inline">
        <a-form-item>
          <a-input v-model.trim="queryParam.logisticsOrderNo" allowClear placeholder="物流单号" />
        </a-form-item>

        <a-form-item>
          <a-select placeholder="结果" v-model="queryParam.resultType" allowClear style="width: 200px">
            <a-select-option :value="1">成功 </a-select-option>
            <a-select-option :value="2">失败</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-select placeholder="支付方式" v-model="queryParam.payType" allowClear style="width: 200px">
            <a-select-option :value="1">支付宝 </a-select-option>
            <a-select-option :value="2">微信</a-select-option>
          </a-select>
        </a-form-item>
        <template>
          <a-form-item>
            <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
          </a-form-item>
        </template>
      </a-form>
    </div>
    <s-table ref="table" size="default" rowKey="id" :columns="columns" :data="loadData" :alert="false">
      <div slot="order" slot-scope="text, record, index">
        <span>{{ index + 1 }}</span>
      </div>
      <div slot="resultType" slot-scope="text, record, index">
        <span v-if="text === 1" style="color: blue">成功</span>
        <span v-if="text === 2" style="color: red">失败</span>
      </div>

      <div slot="payType" slot-scope="text, record, index">
        <span v-if="text === 1">支付宝</span>
        <span v-if="text === 2">微信</span>
      </div>
    </s-table>
  </a-card>
</template>

<script>
import { getCollectionDetailList } from '@/api/distribution-management'

import { STable } from '@/components'

const columns = [
  {
    align: 'center',
    title: '序号',
    key: 'order',
    width: '70px',
    scopedSlots: { customRender: 'order' },
  },

  {
    align: 'center',
    title: '物流单号',
    key: 'logisticsOrderNo',
    dataIndex: 'logisticsOrderNo',
  },
  {
    align: 'center',
    title: '金额',
    key: 'price',
    dataIndex: 'price',
  },

  {
    align: 'center',
    title: '结果',
    key: 'resultType',
    dataIndex: 'resultType',
    scopedSlots: { customRender: 'resultType' },
  },
  {
    align: 'center',
    title: '付款时间',
    key: 'createdTime',
    dataIndex: 'createdTime',
  },
  {
    align: 'center',
    title: '支付方式',
    key: 'payType',
    dataIndex: 'payType',
    scopedSlots: { customRender: 'payType' },
  },
]

export default {
  name: 'EnterpriseSynopsis',
  components: {
    STable,
  },
  data() {
    return {
      visible: false,
      // 表头
      columns: columns,
      Warehouse: [],
      tutorialList: undefined,
      // 查询参数
      queryParam: {},
      // 初始化加载 必须为 Promise 对象
      loadData: (parameter) => {
        console.log('页面开始加载数据。。。', parameter, this.queryParam)
        return getCollectionDetailList(Object.assign(parameter, this.queryParam))
          .then((res) => {
            return res
          })
          .catch((error) => {
            this.loading = false
            console.error(error)
          })
      },
    }
  },
  created() {},
  methods: {
    // // 新增
    // handleAdd(type, e) {
    //   this.$refs.modal.query(type, e)
    // },
    // // 详情
    // query(e) {
    //   this.$refs.queryModal.query(e)
    // },
    // handleSaveOk() {
    //   this.$refs.table.refresh(true)
    // },
    // handleEditOk() {
    //   this.$refs.table.refresh(true)
    // },
  },
}
</script>

<style scoped>
</style>
