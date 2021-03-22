<template>
  <a-card :bordered="false">
    <a-row :gutter="24">
      <a-col :span="4">
        <div
          class="menu-tree-list-wrapper"
          style="width: 100%; overflow: auto; box-shadow: 7px 0px 7px -7px #ddd; height: 600px"
        >
          <a-tree
            :treeData="orgTree"
            :selectedKeys="treeSelectedKeys"
            :defaultExpandAll="true"
            @select="handleClick"
          ></a-tree>
        </div>
      </a-col>
      <a-col :span="20">
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
            <a-form-item v-if="$auth('routineMaterialRule:add')">
              <a-button type="primary" @click="doAction('add', null)">新增</a-button>
            </a-form-item>
            <a-form-item v-if="$auth('routineMaterialRule:edit')">
              <a-button :disabled="!canEdit" type="primary" @click="doAction('edit', null)">修改</a-button>
            </a-form-item>

            <a-form-item v-if="$auth('routineMaterialRule:disable')">
              <a-button :disabled="!canUse" type="primary" @click="doAction('disable', null)">禁用</a-button>
            </a-form-item>
            <a-form-item v-if="$auth('routineMaterialRule:enable')">
              <a-button :disabled="!canUse" type="primary" @click="doAction('enable', null)">启用</a-button>
            </a-form-item>
            <a-form-item v-if="$auth('routineMaterialRule:del')">
              <a-button :disabled="!canUse" type="primary" @click="doAction('del', null)">删除</a-button>
            </a-form-item>
            <a-form-item v-if="$auth('routineMaterialRule:audit')">
              <a-button :disabled="!canUse" type="primary" @click="doAction('approval', null)">审核</a-button>
            </a-form-item>
            <a-form-item v-if="$auth('routineMaterialRule:annulAudit')">
              <a-button :disabled="!canUse" type="primary" @click="doAction('unapproval', null)">反审核</a-button>
            </a-form-item>
          </a-form>
        </div>
        <a-table
          :columns="columns"
          :dataSource="dataSource"
          :pagination="pagination"
          :loading="loading"
          @change="handleTableChange"
          :customRow="customRowFunction"
          :rowSelection="{ onChange: rowSelectionChangeHnadler, selectedRowKeys: selectedRowKeys }"
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
    dataIndex: 'code',
  },
  {
    align: 'center',
    title: '名称',
    dataIndex: 'ruleName',
  },
  {
    align: 'center',
    title: '创建人',
    dataIndex: 'createdName',
  },
  {
    align: 'center',
    title: '创建时间',
    dataIndex: 'createdTime',
  }
]

export default {
  name: 'material-management-rule-RoutineList',
  components: {
    RoutineAddForm,
  },
  data() {
    return {
      parentId: 0, // 父id
      parentItem: {},
      // 表头
      columns,
      orgTree: [],
      dataSource: [],
      selectedRowKeys: [],
      selectedRows: [],

      loading: false,
      queryParam: {},
      pagination: {
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: (total) => `共有 ${total} 条数据`, //分页中显示总的数据
        onShowSizeChange: this.onShowSizeChangeHandler,
      }
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
    }
  },
  computed: {
    canEdit() {
      return this.selectedRows.length === 1 && +this.selectedRows[0].auditStatus !== 3
    },
    canUse() {
      return this.selectedRows.length > 0
    },
    treeSelectedKeys() {
      return [String(this.parentId)]
    }
  },
  methods: {
    rowSelectionChangeHnadler(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    init() {
      this.parentId = 0
      ;(this.queryParam = {
        ...this.queryParam,
        parentId: this.parentId,
      }),
        this.fetchTree()
      this.search()
    },
    fetchTree() {
      const that = this
      routineMaterialRulePageTreeList().then((res) => {
        const root = {
          key:'0',
          value:'0',
          title:'常规物料规则',
          isLeaf:false,
          children:res.data.map((item) => that.formatTreeData(item))
        }
        that.orgTree = [root]

        if(String(that.parentId) === '0'){
          that.parentItem = root
        }

      }).catch(err =>{
        that.$message.error(`调用接口[routineMaterialRulePageTreeList]时发生错误，错误信息:${err}`)
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
          if(!(res && res.data && res.data.records && Array.isArray(res.data.records))){
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
          let { current, pages } = res.data
          if (+pages > 0 && +current > +pages) {
            that.pagination = { ...pagination, current: pages }
            that.search()
          }
        })
        .catch((err) => {
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
    //格式化接口数据 key,title,value
    formatTreeData(item) {
      let that = this
      let obj = {}
      obj.key = String(item.id)
      obj.title = item.newRuleName || item.ruleName
      obj.value = String(item.id)
      obj.isLeaf = !(Array.isArray(item.subList) && item.subList.length > 0)
      //obj.__selectable = obj.isLeaf
      if (Array.isArray(item.subList) && item.subList.length > 0) {
        obj.children = item.subList.map((v) => that.formatTreeData(v))
      }
      return obj
    },
    handleClick(selectedKeys, e) {
      const that = this
      let dataRef = e.node.dataRef
      // 点击树结构菜单
      var parentId = this.parentId
      if (selectedKeys[0] !== undefined) {
        parentId = selectedKeys[0]
      }
      that.queryParam = { ...that.queryParam, parentId }
      that.parentId = parentId
      that.parentItem = { ...dataRef }

      that.selectedRowKeys = []
      that.selectedRows = []
      that.search()
    },
    doAction(type, record) {
      const that = this
      if (type === 'add') {
        that.$refs.routineAddForm.query(type, {
          ...record,
          __selectItem: that.parentItem,
          __treeData: [...that.orgTree],
          __from:'normal'
        })
        return
      } else if (type === 'edit') {
        that.$refs.routineAddForm.query(type, {
          ...that.selectedRows[0],
          __selectItem: that.parentItem,
          __treeData: [...that.orgTree],
          __from:'normal'
        })
        return
      } else {
        let m = {
          disable: {
            api: routineMaterialRuleForbidden,
            title: '禁用',
            tpl:names => `禁用${names}后，其子规则也被禁用。确定要执行该操作吗？`
          },
          enable: {
            api: routineMaterialRuleStartUsing,
            title: '启用',
            tpl:names => `确定要启用${names}吗？`
          },
          del: {
            api: routineMaterialRuleDelete,
            title: '删除',
            tpl:names => `确定要删除${names}吗？`
          },
          approval: {
            api: routineMaterialRuleAudit,
            title: '审核',
            tpl:names => `审核项目${names}后，将不能修改，同时该核算项目的所有直接上级项目都会被自动审核，是否继续？`
          },
          unapproval: {
            api: routineMaterialRuleAnnulAudit,
            title: '反审核',
            tpl:names => `反审核项目${names}后，数据标记为未审核，是否继续？`
          },
        }
        let target = m[type]
        if (!target) {
          that.$message.error(`不支持的操作类型:${type}`)
          return
        }
        let itemNames = `【${that.selectedRows.map((item) => item.ruleName).join('，')}】`
        let ids = that.selectedRows.map((item) => item.id).join(',')
        that.$confirm({
          title: '提示',
          content: target.tpl(itemNames),
          okText: '确定',
          cancelText: '取消',
          onOk() {
            target
              .api(`ids=${ids}`)
              .then((res) => {
                that.$message.info(res.msg)
                if (res.code === 200) {
                  that.finishHandler()
                }
              })
              .catch((err) => {
                that.$message.error(err.message)
              })
          },
        })
      }
    },
    finishHandler() {
      this.selectedRowKeys = []
      this.selectedRows = []
      this.fetchTree()
      this.search()
    },
    customRowFunction(record) {
      // auditStatus审核状态：1未审核，2审批中，3已审核
      // forbidden  是否禁用：1禁用，2启用
      let { auditStatus, forbidden } = record
      return {
        style: {
          color: +auditStatus === 3 ? 'blue' : +forbidden === 1 ? 'red' : '',
        },
      }
    }
  }
}
</script>
