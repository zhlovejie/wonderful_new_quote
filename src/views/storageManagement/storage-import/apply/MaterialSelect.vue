<template>
  <a-modal title="选择物料" :width="1000" :footer="null" v-model="visible" :maskClosable="false">
    <div class="top-ation">
      <a-form layout="inline" :form="form">
        <a-form-item label="物料代码">
          <a-input style="width: 130px; margin-right: 10px" class="modal-input" v-model="queryParam.materialCode" />
        </a-form-item>
        <a-form-item label="物料名称">
          <a-input style="width: 130px; margin-right: 10px" class="modal-input" v-model="queryParam.materialName" />
        </a-form-item>
        <a-form-item>
          <a-button class="a-button" type="primary" icon="search" @click="search">查询</a-button>
        </a-form-item>
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
      <span slot="materialCode" slot-scope="text, record">
        <a @click="clickVue(record)">{{ text }}</a>
      </span>
    </a-table>
  </a-modal>
</template>

<script>
// 常规物料库
import { routineMaterialInfoPageList } from '@/api/routineMaterial'
export default {
  name: 'MaterialSelect',
  data() {
    return {
      visible: false,
      form: this.$form.createForm(this),
      queryParam: {},
      loading: false,
      columns: [
        {
          align: 'center',
          title: '序号',
          key: 'order',
          width: '70px',
          scopedSlots: { customRender: 'order' }
        },
        {
          title: '物料代码',
          dataIndex: 'materialCode',
          width: 180,
          scopedSlots: { customRender: 'materialCode' }
        },
        {
          title: '物料名称',
          width: 180,
          dataIndex: 'materialName'
        },
        {
          title: '规格型号',
          dataIndex: 'specification'
        }
      ],
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
    query(record) {
      this.recordParam = record
      this.visible = true
      this.search()
    },
    search() {
      let that = this
      let paginationParam = {
        current: that.pagination.current || 1,
        size: that.pagination.pageSize || 10
      }
      let _searchParam = Object.assign({}, { ...this.queryParam }, paginationParam)
      console.log('执行搜索...', _searchParam)
      that.loading = true
      routineMaterialInfoPageList(_searchParam)
        .then(res => {
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
        })
        .catch(err => (that.loading = false))
    },
    close() {
      this.$emit('close')
      this.visible = false
    },
    clickVue(data) {
      this.$emit('custom-change', {
        selectItem: data, //用户选择项目
        recordParam: this.recordParam //父页面传过来的项目
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
    },
  }
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
