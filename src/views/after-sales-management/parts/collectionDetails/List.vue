<template>
  <a-card :bordered="false">
    <!--div中可以写搜索条件，和功能按键-->
    <div class="description-document-search-wrapper">
      <a-form layout="inline">
        <a-form-item>
          <a-input v-model.trim="queryParam.problemPoint" allowClear placeholder="配件清单编号模糊查询" />
        </a-form-item>
        <a-form-item>
          <a-input v-model.trim="queryParam.problemDescription" allowClear placeholder="客户名称/机构名称" />
        </a-form-item>
        <a-form-item>
          <a-select placeholder="结果" v-model="queryParam.isSuccess" allowClear style="width: 200px">
            <a-select-option :value="0">成功 </a-select-option>
            <a-select-option :value="1">失败</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-select placeholder="支付方式" v-model="queryParam.paymentMethod" allowClear style="width: 200px">
            <a-select-option :value="0">支付宝 </a-select-option>
            <a-select-option :value="1">微信</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-select placeholder="是否结算" v-model="queryParam.isSettlement" allowClear style="width: 200px">
            <a-select-option :value="0">结算 </a-select-option>
            <a-select-option :value="1">未结算</a-select-option>
          </a-select>
        </a-form-item>
        <template v-if="$auth('video:list')">
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
      <div slot="isSuccess" slot-scope="text, record, index">
        <span v-if="text === 0" style="color: blue">成功</span>
        <span v-if="text === 1" style="color: red">失败</span>
      </div>
    </s-table>
  </a-card>
</template>

<script>
import { accessoriesCollectionPage } from '@/api/after-sales-management'

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
    title: '配件清单编号',
    key: 'accessoriesNum',
    dataIndex: 'accessoriesNum',
  },
  {
    align: 'center',
    title: '客户名称',
    key: 'customerName',
    dataIndex: 'customerName',
  },
  {
    align: 'center',
    title: '机构名称',
    key: 'orgName',
    dataIndex: 'orgName',
  },

  {
    align: 'center',
    title: '金额',
    key: 'totalAmount',
    dataIndex: 'totalAmount',
  },
  {
    align: 'center',
    title: '结果',
    key: 'isSuccess',
    dataIndex: 'isSuccess',
    scopedSlots: { customRender: 'isSuccess' },
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
    key: 'modifierName',
    dataIndex: 'modifierName',
  },
  {
    align: 'center',
    title: '是否结算',
    key: 'modifyTime',
    dataIndex: 'modifyTime',
  },
  // {
  //   align: 'center',
  //   title: '操作',
  //   key: 'action',
  //   scopedSlots: { customRender: 'action' },
  // },
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
        return accessoriesCollectionPage(Object.assign(parameter, this.queryParam))
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
