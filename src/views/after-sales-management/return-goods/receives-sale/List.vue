<template>
  <a-card :bordered="false">
    <div class="top-ation">
      <a-form layout="inline">
        <a-form-item>
          <a-input
            style="width: 200px"
            placeholder="单号模糊查询"
            allowClear
            v-model="queryParam.serialNum"
          />
        </a-form-item>
        <a-form-item>
          <a-input
            placeholder="售后名称模糊查询"
            style="width: 200px"
            allowClear
            v-model="queryParam.sender"
          />
        </a-form-item>
        <a-form-item>
          <a-input
            placeholder="客户名称模糊查询"
            style="width: 200px"
            allowClear
            v-model="queryParam.customerName"
          />
        </a-form-item>
        <a-form-item>
          <a-button
            class="a-button"
            type="primary"
            icon="search"
            @click="() => search()"
          >查询</a-button>
        </a-form-item>
        <div class="fl-r">
          <a-button
            type="primary"
            @click="doAction('add', null)"
          >
            新增
            <a-icon type="plus" />
          </a-button>
        </div>
      </a-form>
    </div>
    <a-row>
      <a-col>
        <a-table
          :columns="columns"
          :dataSource="dataSource"
          :pagination="pagination"
          :loading="loading"
          @change="handleTableChange"
          :expandedRowKeys="expandedRowKeys"
          @expand="expandHandler"
        >
          <div
            slot="order"
            slot-scope="text, record, index"
          >
            <span>{{ index + 1 }}</span>
          </div>

          <div
            slot="action"
            slot-scope="text, record"
          >
              <a @click="doAction('view',record)">查看</a>
          </div>

          <a-table
            slot="expandedRowRender"
            slot-scope="record, index, indent, expanded"
            :columns="innerColumns"
            :dataSource="record.materialList"
            :pagination="false"
            size="small"
          >
            <div
              slot="order"
              slot-scope="text, record, index"
            >
              <span>{{ index + 1 }}</span>
            </div>

            <div
              slot="problemDescription"
              slot-scope="text"
            >
              <a-tooltip v-if="String(text).length > 10">
                <template slot="title">{{ text }}</template>
                {{ String(text).slice(0, 10) }}...
              </a-tooltip>
              <span v-else>{{ text }}</span>
            </div>
          </a-table>
        </a-table>
      </a-col>
    </a-row>
    <AddForm ref="addForm" @finish="() => search()" />
  </a-card>
</template>

<script>
import {
  receiveWorkerAdd,
  receiveWorkerNotReceiveList,
  receiveWorkerPageList,
  receiveWorkerListReceiveAddCustomer,
  receiveWorkerListReceiveCustomerMail,
  receiveWorkerListReceiveCustomerMaterial
} from '@/api/after-sales-management-custom'
import AddForm from './AddForm.vue'
const columns = [
  {
    align: 'center',
    title: '序号',
    width: '80px',
    scopedSlots: { customRender: 'order' }
  },
  {
    title: '收件单号',
    dataIndex: 'serialNum'
  },
  {
    title: '售后',
    dataIndex: 'sender'
  },
  {
    title: '提交人',
    dataIndex: 'createdName'
  },
  {
    title: '提交时间',
    dataIndex: 'createdTime'
  },
  {
    title: '修改时间',
    dataIndex: 'updateTime'
  },
  {
    title: '操作',
    scopedSlots: { customRender: 'action' }
  }
]
const innerColumns = [
  {
    align: 'center',
    title: '序号',
    width: '80px',
    scopedSlots: { customRender: 'order' }
  },
  {
    title: '物料代码',
    dataIndex: 'materialCode'
  },
  {
    title: '物料名称',
    dataIndex: 'materialName'
  },
  {
    title: '规格型号',
    dataIndex: 'materialModel'
  },
  {
    title: '单位',
    dataIndex: 'unit'
  },
  {
    title: '出货数量',
    dataIndex: 'sendQuantity'
  },
  {
    title: '已收数量',
    dataIndex: 'alreadyReceiveQuantity'
  },
  {
    title: '已免寄回数量',
    dataIndex: 'alreadyFreeQuantity'
  },

  {
    title: '本次收货数量',
    dataIndex: 'receiveQuantity'
  },
  {
    title: '本次免寄回数量',
    dataIndex: 'freeQuantity'
  }
]
export default {
  components: {
    AddForm
  },
  data() {
    return {
      userInfo: this.$store.getters.userInfo,
      queryParam: {},
      // 表头
      columns,
      innerColumns,
      dataSource: [],
      pagination: {
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: total => `共有 ${total} 条数据`, //分页中显示总的数据
        onShowSizeChange: this.onShowSizeChangeHandler
      },
      loading: false,
      expandedRowKeys: []
    }
  },
  watch: {
    $route: {
      handler: function(to, from) {
        if (to.name === 'after-sales-management_return-goods_receives-sale') {
          this.search()
        }
      },
      immediate: true
    }
  },
  methods: {
    search(params = {}) {
      const that = this
      const paginationParam = {
        current: that.pagination.current || 1,
        size: that.pagination.pageSize || 10
      }
      that.loading = true
      const _searchParam = Object.assign({}, { ...that.queryParam }, paginationParam, params)
      receiveWorkerPageList(_searchParam)
        .then(res => {
          that.loading = false
          if (!(res && res.data && res.data.records && Array.isArray(res.data.records))) {
            return
          }
          that.dataSource = res.data.records.map((item, index) => {
            item.key = index + 1
            return item
          })
          //设置数据总条数
          const pagination = { ...that.pagination }
          pagination.total = res.data.total || 0
          pagination.current = res.data.current || 1
          that.pagination = pagination

          //有两页数据,第二页只有一条数据,删除第二页的一条数据了,界面显示在第一页,但是不显示第一页数据了
          //刷新也不显示数据
          const { current, pages } = res.data
          if (+pages > 0 && +current > +pages) {
            that.pagination = { ...pagination, current: pages }
            that.search()
          }
        })
        .catch(err => {
          console.error(err)
          that.loading = false
        })
    },
    handleTableChange(pagination, filters, sorter) {
      this.pagination = { ...this.pagination, current: pagination.current }
      this.search()
    },
    onShowSizeChangeHandler(current, pageSize) {
      this.pagination = { ...this.pagination, current, pageSize }
    },
    expandHandler(expanded, record) {
      console.log(arguments)
      if (expanded) {
        this.expandedRowKeys = [...this.expandedRowKeys, record.key]
      } else {
        this.expandedRowKeys = this.expandedRowKeys.filter((val) => val !== record.key)
      }
    },
    doAction(type, record) {
      const that = this
      if(type === 'view' || type === 'add'){
        that.$refs.addForm.query(type,{...record})
        return
      }else{
        that.$message.info(`未知指令...${type}`)
        return
      }
    }
  }
}
</script>

<style scoped>
</style>
