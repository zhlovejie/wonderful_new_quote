<template>
  <a-modal
    :title="type ? '请选择加工商' : '请选择加工单号'"
    :width="1000"
    :footer="null"
    v-model="visible"
    :maskClosable="false"
  >
    <div class="top-ation">
      <a-form layout="inline" :form="form">
        <a-space>
          <a-form-item :label="type === 1 ? '加工商名称' : '加工单号'">
            <a-input
              class="modal-input"
              v-model="queryParam.keyWords"
              placeholder="请输入搜索关键词"
              :allowClear="true"
            />
          </a-form-item>
          <a-form-item>
            <a-button type="primary" icon="search" @click="search">查询</a-button>
          </a-form-item>
        </a-space>
      </a-form>
    </div>
    <a-table
      :columns="columns"
      :dataSource="dataSource"
      :pagination="pagination"
      :loading="loading"
      @change="handleTableChange"
      size="middle"
    >
      <div slot="order" slot-scope="text, record, index">
        <span>{{ index + 1 }}</span>
      </div>
      <span slot="facName" slot-scope="text, record">
        <a @click="clickVue(record)">{{ text }}</a>
      </span>
      <span slot="orderNo" slot-scope="text, record">
        <a @click="clickVue(record)">{{ text }}</a>
      </span>
    </a-table>
  </a-modal>
</template>

<script>
const facColumns = [
  {
    align: 'center',
    title: '序号',
    key: 'order',
    width: '70px',
    scopedSlots: { customRender: 'order' }
  },
  {
    title: '加工商名称',
    dataIndex: 'facName',
    scopedSlots: { customRender: 'facName' }
  }
]

const orderColumns = [
  {
    align: 'center',
    title: '序号',
    key: 'order',
    width: '70px',
    scopedSlots: { customRender: 'order' }
  },
  {
    title: '委外加工单单号',
    dataIndex: 'orderNo',
    scopedSlots: { customRender: 'orderNo' }
  }
]

import {
  getFacAndOrderList //原料出库申请单/交接单-列表 根据加工商/加工单号筛选
} from '@/api/material'
export default {
  name: 'MaterialSelect',
  data() {
    return {
      type: 1, //type 1 加工商 2订单
      visible: false,
      form: this.$form.createForm(this),
      queryParam: {},
      loading: false,
      columns: [],
      dataSource: [],
      pagination: {
        current: 1,
        _prePageSize: 10,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: total => `共有 ${total} 条数据` //分页中显示总的数据
      }
    }
  },
  methods: {
    query(type) {
      this.type = type
      this.columns = type === 1 ? facColumns : orderColumns
      this.visible = true
      this.search()
    },
    search() {
      let that = this
      let paginationParam = {
        current: that.pagination.current || 1,
        size: that.pagination.pageSize || 10
      }
      let _searchParam = Object.assign({}, { ...this.queryParam }, paginationParam, { type: this.type })
      console.log('执行搜索...', _searchParam)
      that.loading = true
      getFacAndOrderList(_searchParam)
        .then(res => {
          if (res.code === 200) {
            that.loading = false
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
            let { current, pages } = res.data
            if (+pages > 0 && +current > +pages) {
              that.pagination = { ...pagination, current: pages }
              that.search()
            }
          } else {
            that.$message.error(res.msg)
          }
        })
        .catch(err => (that.loading = false))
    },
    close() {
      this.$emit('close')
      this.visible = false
    },
    clickVue(data) {
      this.$emit('change', {
        selectItem: data, //用户选择项目
        type: this.type
      })
      this.close()
    },
    handleTableChange(pagination, filters, sorter) {
      const pager = pagination
      pager.current = pagination.current
      if (+pager.pageSize !== +pager._prePageSize) {
        //pageSize 变化
        pager.current = 1 //重置为第一页
        pager._prePageSize = +pager.pageSize //同步两者的值
      }
      this.pagination = { ...this.pagination, ...pager }
      this.search()
    }
  }
}
</script>

<style lang="less" scoped>
.modal-input {
  width: 200px;
}
</style>
