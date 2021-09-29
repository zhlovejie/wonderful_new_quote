<template>
  <a-modal
    :title="modalTitle"
    :width="1000"
    :visible="visible"
    :destroyOnClose="true"
    @cancel="handleCancel"
    :maskClosable="false"
    :footer="null"
    :forceRender="true"
  >
    <div class="search-wrapper">
      <a-form layout="inline">
        <a-form-item>
          <a-input
            placeholder="名称模糊查询"
            v-model="queryParam.ruleName"
            allowClear
            style="width: 260px"
          />
        </a-form-item>

        <a-form-item>
          <a-button
            type="primary"
            icon="search"
            @click="search({ current: 1 })"
          >查询</a-button>
        </a-form-item>

      </a-form>
    </div>

    <a-table
      :columns="columns"
      :dataSource="dataSource"
      :pagination="pagination"
      :loading="loading"
      @change="handleTableChange"
    >
      <div
        slot="order"
        slot-scope="text, record, index"
      >
        <span>{{ index + 1 }}</span>
      </div>
      <div
        slot="ruleName"
        slot-scope="text, record, index"
      >
        <a
          href="javascript:void(0);"
          @click="doAction('selected',record)"
        >
          {{ record.newRuleName || record.ruleName }}
        </a>
      </div>

    </a-table>

    <SearchForm
      ref="searchForm"
      @change="paramChangeHandler"
    />
  </a-modal>
</template>

<script>
import { routineMaterialRuleSpecificationsPagerTreeList } from '@/api/routineMaterial'
import SearchForm from './SearchForm'

const columns = [
  {
    align: 'center',
    title: '序号',
    key: 'order',
    width: '70px',
    scopedSlots: { customRender: 'order' }
  },
  {
    align: 'center',
    title: '规则名称',
    dataIndex: 'ruleName',
    scopedSlots: { customRender: 'ruleName' }
  },
  {
    align: 'center',
    title: '代码',
    dataIndex: 'code'
  }
]

export default {
  name:'SpecificationSearchForm',
  components: {
    SearchForm
  },
  data() {
    return {
      visible: false,
      loading: false,
      queryParam: {},
      pagination: {
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: total => `共有 ${total} 条数据`, //分页中显示总的数据
        onShowSizeChange: this.onShowSizeChangeHandler
      },
      dataSource: [],
      columns: columns,
      record:{}
    }
  },
  computed:{
    modalTitle(){
      let {newRuleName,ruleName} = this.record
      return `规格型号-选择【${newRuleName || ruleName || ''}】`
    }
  },
  methods: {
    query(type,record) {
      const that = this
      that.record = {...record}
      that.visible = true
      that.queryParam = {
        parentId:record.id
      }
      that.pagination = {
        ...that.pagination,
        current: 1,
        pageSize: 10
      }

      that.$nextTick(() => {
        that.search()
      })
    },
    search(params = {}) {
      const that = this
      const paginationParam = {
        current: that.pagination.current || 1,
        size: that.pagination.pageSize || 10
      }
      that.loading = true
      const _searchParam = Object.assign({}, { ...that.queryParam }, paginationParam, params)
      routineMaterialRuleSpecificationsPagerTreeList(_searchParam)
        .then(res => {
          that.loading = false
          if (!(res && res.data && res.data.records && Array.isArray(res.data.records))) {
            return
          }
          that.dataSource = res.data.records.map((item, index) => {
            item.key = index + 1
            item.fullCode = that.parentCodes ? `${that.parentCodes}.${item.code}` : item.code
            item.specifications = `
              材质：${item.texture}
              厚度：${item.thickness}
              宽度：${item.width}
              长度：${item.length}
            `
            return item
          })
          //设置数据总条数
          const pagination = { ...that.pagination }
          pagination.total = res.data.total || 0
          pagination.current = res.data.current || 1
          that.pagination = pagination

          //有两页数据,第二页只有一条数据,删除第二页的一条数据了,界面显示在第一页,但是不显示第一页数据了
          //刷新也不显示数据
          // let { current, pages } = res.data
          // if (+pages > 0 && +current > +pages) {
          //   that.pagination = { ...pagination, current: pages }
          //   that.search()
          // }
        })
        .catch(err => {
          console.error(err)
          that.loading = false
        })
    },
    handleCancel() {
      this.visible = false
    },
    handleTableChange(pagination, filters, sorter) {
      this.pagination = { ...this.pagination, current: pagination.current }
      this.search()
    },
    onShowSizeChangeHandler(current, pageSize) {
      this.pagination = { ...this.pagination, current, pageSize }
    },
    paramChangeHandler(params) {
      this.queryParam = { ...this.queryParam, ...params }
      this.search()
    },
    doAction(type, record) {
      const that = this
      if (type === 'filter') {
        that.$refs.searchForm.query({
          __from: 'normal'
        })
      } else if (type === 'selected') {
        that.handleCancel()
        that.$emit('selected', { parentItem:that.record, selectItem:{...record} })
      }
    }
  }
}
</script>
