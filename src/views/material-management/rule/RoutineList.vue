<template>
  <a-card :bordered="false">
    <a-row :gutter="24">
      <a-col :span="24">
        <div class="search-wrapper">
          <a-form layout="inline">
            <a-form-item>
              <a-input placeholder="代码模糊查询" v-model="queryParam.code" allowClear style="width: 150px" />
            </a-form-item>
            <a-form-item>
              <a-input placeholder="名称模糊查询" v-model="queryParam.ruleName" allowClear style="width: 150px" />
            </a-form-item>
            <a-form-item>
              <a-button type="primary" icon="search" @click="search({ current: 1 })">查询</a-button>
            </a-form-item>
            <a-form-item>
              <a-button type="primary" @click="doAction('add', null)">新增</a-button>
            </a-form-item>
            <a-form-item>
              <a-button type="primary" @click="doAction('edit', null)">修改</a-button>
            </a-form-item>
            <a-form-item>
              <a-button type="primary" @click="doAction('disable', null)">禁用</a-button>
            </a-form-item>
            <a-form-item>
              <a-button type="primary" @click="doAction('enable', null)">启用</a-button>
            </a-form-item>
            <a-form-item>
              <a-button type="primary" @click="doAction('del', null)">删除</a-button>
            </a-form-item>
            <a-form-item>
              <a-button type="primary" @click="doAction('approval', null)">审核</a-button>
            </a-form-item>
            <a-form-item>
              <a-button type="primary" @click="doAction('unapproval', null)">反审核</a-button>
            </a-form-item>
          </a-form>
        </div>
      </a-col>
    </a-row>
    <a-row :gutter="24">
      <a-col :span="4">
        <div
          class="menu-tree-list-wrapper"
          style="width: 100%; overflow: auto; box-shadow: 7px 0px 7px -7px #ddd; height: 600px"
        >
          <a-tree :treeData="orgTree" :defaultExpandAll="true" @select="handleClick"></a-tree>
        </div>
      </a-col>
      <a-col :span="20">
        <a-table
          :columns="columns"
          :dataSource="dataSource"
          :pagination="pagination"
          :loading="loading"
          @change="handleTableChange" 
          :rowSelection="rowSelection"
        >
          <div slot="order" slot-scope="text, record, index">
            <span>{{ index + 1 }}</span>
          </div>

          <div slot="customerName" slot-scope="text, record, index">
            <a href="javascript:void(0);" @click="clickVue(record)">{{ text }}</a>
          </div>
        </a-table>
      </a-col>
    </a-row>
    <RoutineAddForm ref="routineAddForm" @finish="finishHandler" />
  </a-card>
</template>

<script>
import {
  routineMaterialRuleAdd,
  routineMaterialRuleUpdate,
  routineMaterialRuleDelete,
  routineMaterialRuleAnnulAudit,
  routineMaterialRuleAudit,
  routineMaterialRuleForbidden,
  routineMaterialRuleStartUsing,
  routineMaterialRulePageList,
  routineMaterialRulePageTreeList,
  materialRuleAuditAudit,
  materialRuleAuditPageList,
} from '@/api/routineMaterial'

import RoutineAddForm from './module/RoutineAddForm'

const columns = [
  {
    align: 'center',
    title: '代码',
    dataIndex: 'code'
  },
  {
    align: 'center',
    title: '名称',
    dataIndex: 'ruleName',
  },
  
  {
    align: 'center',
    title: '创建人',
    dataIndex: 'createdName'
  },
  {
    align: 'center',
    title: '创建时间',
    dataIndex: 'createdTime'
  },
  // {
  //   align: 'center',
  //   title: '更新人',
  //   dataIndex: 'modifierName',
  // },
  // {
  //   align: 'center',
  //   title: '更新时间',
  //   dataIndex: 'modifyTime',
  // },
  // {
  //   align: 'center',
  //   title: '操作',
  //   dataIndex: 'id',
  //   width: '150px',
  //   scopedSlots: { customRender: 'action' },
  // },
]

const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
  onSelect: (record, selected, selectedRows) => {
    console.log(record, selected, selectedRows);
  },
  onSelectAll: (selected, selectedRows, changeRows) => {
    console.log(selected, selectedRows, changeRows);
  },
};

export default {
  name: 'material-management-rule-RoutineList',
  components: {
    RoutineAddForm,
  },
  data() {
    return {
      parentId: 0, // 父id
      parentItem:{},
      // 表头
      columns,
      orgTree: [],
      dataSource: [],
      selectedRowKeys: [],
      selectedRows: [],

      loading: false,
      queryParam: {
        parentId: 1,
      },
      pagination: {
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: (total) => `共有 ${total} 条数据`, //分页中显示总的数据
        onShowSizeChange: this.onShowSizeChangeHandler,
      },
      rowSelection
    }
  },
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'material-rule-management-routine') {
          this.init()
        }
      },
      immediate: true,
    },
  },
  methods: {
    init() {
      this.fetchTree()
      this.search()
    },
    fetchTree() {
      const that = this
      routineMaterialRulePageTreeList().then((res) => {
        that.orgTree = res.data.map((item) => that.formatTreeData(item))
      })
    },
    search(params = {}) {
      const that = this
      let paginationParam = {
        current: that.pagination.current || 1,
        size: that.pagination.pageSize || 10,
      }
      let _searchParam = Object.assign({}, { ...that.queryParam }, paginationParam, params)
      routineMaterialRulePageList(_searchParam)
        .then((res) => {
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
        .catch((err) => (that.loading = false))
    },
    handleTableChange(pagination, filters, sorter) {
      this.pagination = { ...this.pagination, current: pagination.current }
      this.search()
    },
    onShowSizeChangeHandler(current, pageSize) {
      this.pagination = { ...this.pagination, current, pageSize }
    },
    //格式化接口数据 key,title,value
    formatTreeData(item) {
      let that = this
      let obj = {}
      obj.key = String(item.id)
      obj.title = item.ruleName
      obj.value = String(item.id)
      obj.isLeaf = !(Array.isArray(item.subList) && item.subList.length > 0)
      //obj.__selectable = obj.isLeaf
      if (Array.isArray(item.subList) && item.subList.length > 0) {
        obj.children = item.subList.map((v) => that.formatTreeData(v))
      }
      return obj
    },
    handleClick(selectedKeys,e) {
      const that = this
      let dataRef = e.node.dataRef
      // 点击树结构菜单
      var parentId = this.parentId
      if (selectedKeys[0] !== undefined) {
        parentId = selectedKeys[0]
      }
      that.queryParam = { ...that.queryParam, parentId }
      that.parentId = parentId
      that.parentItem = {...dataRef}
      if(dataRef.isLeaf){
        that.search()
      }
    },
    doAction(type, record) {
      const that = this
      console.log(arguments)
      if (type === 'add') {
        that.$refs.routineAddForm.query(type, { ...record, __selectItem:that.parentItem,__treeData: [...that.orgTree] })
        return
      }
    },
    finishHandler() {
      this.fetchTree()
    },
    del(row) {
      const _this = this
      this.$confirm({
        title: '警告',
        content: `真的要删除 ${row.title} 吗?`,
        okText: '删除',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
          // 在这里调用删除接口
          deleteRoute({ id: row.id }).then((res) => {
            if (res.code === 200) {
              _this.$refs.table.refresh(true)
              _this.$nextTick(() => {
                routeTreeList().then((res) => {
                  _this.orgTree = res.data
                })
              })
            } else {
              _this.$message.error(res.msg)
            }
          })
        },
      })
    }
  }
}
</script>
