<template>
  <a-card
    :bordered="false"
    class="product-offer-management-opt-management"
  >
    <div class="resize-column-wrapper">
      <div id="split-0">
        <div
          class="menu-tree-list-wrapper"
          style="width: 100%; overflow: auto; height: auto; min-height: 600px"
        >
          <a-tree
            ref="treeRef"
            :treeData="orgTree"
            :selectedKeys="treeSelectedKeys"
            :defaultExpandAll="true"
            @select="handleClick"
            :expandedKeys="expandedKeys"
            :autoExpandParent="autoExpandParent"
            @expand="onExpand"
            :showLine="true"
          >
          </a-tree>
        </div>
      </div>
      <div id="split-1">
        <div class="search-wrapper">
          <a-form layout="inline">
            <a-form-item>
              <a-input
                placeholder="模糊查询"
                v-model="queryParam.configName"
                allowClear
                style="width: 150px"
              />
            </a-form-item>

            <a-form-item>
              <a-button
                type="primary"
                icon="search"
                @click="search({ current: 1 })"
              >查询</a-button>
            </a-form-item>
            <a-form-item v-if="$auth('quotedItem:add')">
              <a-button
                type="primary"
                @click="doAction('add', null)"
              >新增</a-button>
            </a-form-item>
            <a-form-item v-if="$auth('quotedItem:edit')">
              <a-button
                :disabled="!canEdit"
                type="primary"
                @click="doAction('edit', null)"
              >修改</a-button>
            </a-form-item>
            <a-form-item v-if="$auth('quotedItem:del')">
              <a-button
                :disabled="!canUse"
                type="primary"
                @click="doAction('del', null)"
              >删除</a-button>
            </a-form-item>
            <a-form-item v-if="$auth('quotedItem:pricing')">
              <a-button
                :disabled="!canPriceUser"
                type="primary"
                @click="doAction('price', null)"
              >核价</a-button>
            </a-form-item>
            <a-form-item v-if="$auth('quotedItem:export')">
              <a-button
                :disabled="!canUse"
                type="primary"
                @click="doAction('export', null)"
              >导出</a-button>
            </a-form-item>
          </a-form>
        </div>

        <a-table
          :columns="columns"
          :dataSource="dataSource"
          :pagination="pagination"
          :loading="loading"
          @change="handleTableChange"
          :rowSelection="{ onChange: rowSelectionChangeHnadler, selectedRowKeys: selectedRowKeys }"
        >
          <div
            slot="order"
            slot-scope="text, record, index"
          >
            <span>{{ index + 1 }}</span>
          </div>
          <div
            slot="price"
            slot-scope="text, record, index"
          >
            <span v-if="String(text) === '-1'">***</span>
            <span v-else>{{ text | moneyFormatNumber }}</span>
          </div>

          <div
            slot="itemConfigType"
            slot-scope="text, record, index"
          >
            <span>{{ {0:'配置名称',1:'配置参数',9:'树结束标记'}[text] }}</span>
          </div>

        </a-table>
      </div>
    </div>
    <AddForm
      ref="addForm"
      @finish="finishHandler"
    />
    <PriceForm
      ref="priceForm"
      @finish="finishHandler"
    />
  </a-card>
</template>

<script>
import {
  priceQuotedItemConfigAddOrUpdate,
  priceQuotedItemConfigDeleteBatch,
  priceQuotedItemConfigSubList,
  priceQuotedItemConfigSubPageList,
  priceQuotedItemConfigTreeList,
  priceQuotedItemConfigSetPrices
} from '@/api/productOfferManagement'

import AddForm from './AddForm.vue'
import PriceForm from './PriceForm'
import Split from 'split.js'
const columns = [
  {
    align: 'center',
    title: '顺序号',
    dataIndex: 'serialNumber'
  },
  {
    align: 'center',
    title: '配置名称',
    dataIndex: 'configName'
  },
  {
    align: 'center',
    title: '成本价',
    dataIndex: 'price',
    scopedSlots: { customRender: 'price' }
  },
  {
    align: 'center',
    title: '配置类型',
    dataIndex: 'itemConfigType',
    scopedSlots: { customRender: 'itemConfigType' }
  },
  {
    align: 'center',
    title: '说明',
    dataIndex: 'configExplain'
  },
  {
    align: 'center',
    title: '操作人',
    dataIndex: 'createdName'
  },
  {
    align: 'center',
    title: '操作时间',
    dataIndex: 'createdTime'
  }
]

const getParentKey = (key, tree) => {
  let parentKey
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i]
    if (node.children) {
      if (node.children.some(item => item.key === key)) {
        parentKey = node.key
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children)
      }
    }
  }
  return parentKey
}

export default {
  name: 'product-offer-management-opt-management',
  components: {
    AddForm,
    PriceForm
  },
  data() {
    return {
      parentId: 0, // 父id
      parentItem: {},
      selectedTreeNode: null, //新增修改后刷新节点用
      // 表头
      columns,
      orgTree: [],
      dataSource: [],
      selectedRowKeys: [],
      selectedRows: [],

      dataList: [],
      expandedKeys: [],
      searchValue: '',
      autoExpandParent: true,

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
    }
  },
  watch: {
    $route: {
      handler: function(to, from) {
        if (to.name === 'product-offer-management-opt-management') {
          this.init()
        }
      },
      immediate: true
    }
  },
  computed: {
    canEdit() {
      return this.selectedRows.length === 1
    },
    canUse() {
      return this.selectedRows.length > 0
    },
    canPriceUser(){
      return this.selectedRows.filter(item => item.itemConfigType === 1).length > 0
    },
    treeSelectedKeys() {
      return [String(this.parentId)]
    }
  },
  methods: {
    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    onChange(e) {
      const that = this
      const value = e.target.value.trim()

      const expandedKeys = that.dataList
        .map(item => {
          if (value && item.title.indexOf(value) > -1) {
            return getParentKey(item.key, that.orgTree)
          }
          return null
        })
        .filter((item, i, self) => item && self.indexOf(item) === i)

      Object.assign(that, {
        expandedKeys,
        searchValue: value,
        autoExpandParent: true
      })
    },
    generateList(data) {
      const arr = []
      for (let i = 0; i < data.length; i++) {
        const node = data[i]
        arr.push({ ...node })
        if (node.children) {
          arr.push(...this.generateList(node.children))
        }
      }
      return arr
    },

    rowSelectionChangeHnadler(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    init() {
      const that = this
      that.parentId = undefined
      that.selectedTreeNode = null
      that.queryParam = {
        ...that.queryParam,
        id: that.parentId
      }
      that.fetchTree()
      that.search()

      that.$nextTick(() => {
        that.splitClear()
        that.splitInstance = Split(['#split-0', '#split-1'], {
          gutter: function(i, gutterDirection) {
            var gut = document.createElement('div')
            gut.className = '_wdf_split_gutter _wdf_split_gutter-' + gutterDirection
            return gut
          },
          sizes: [20, 80]
        })
      })
    },

    fetchTree() {
      const that = this
      priceQuotedItemConfigTreeList()
        .then(res => {
          const root = {
            key: 0,
            value: 0,
            title: '配置项',
            isLeaf: false,
            parentId: null,
            children: Array.isArray(res.data) ? res.data.map(item => that.formatTreeData(item)) : []
          }
          that.orgTree = [root]
          // if (that.parentId === -1) {
          //   that.parentItem = root
          // }
          // console.log(JSON.stringify(that.orgTree))
        })
        .catch(err => {
          that.$message.error(`调用接口[priceQuotedItemConfigTreeList]时发生错误，错误信息:${err}`)
        })
    },
    search(params = {}) {
      const that = this
      that.loading = true
      let paginationParam = {
        current: that.pagination.current || 1,
        size: that.pagination.pageSize || 10
      }
      const _searchParam = Object.assign({}, { ...that.queryParam },paginationParam, params)
      priceQuotedItemConfigSubPageList(_searchParam)
        .then(res => {
          that.loading = false
          that.dataSource = res.data.records.filter(item => item.configType !== 9).map((item, index) => {
            item.key = index + 1
            return item
          })
          //设置数据总条数
          const pagination = { ...that.pagination }
          pagination.total = res.data.total || 0
          pagination.current = res.data.current || 1
          that.pagination = pagination
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
    //格式化接口数据 key,title,value
    formatTreeData(item) {
      const that = this
      const obj = {}
      obj.key = String(item.id)
      obj.title = item.configName
      obj.value = String(item.id)
      // obj.isLeaf = !(Array.isArray(item.subList) && item.subList.length > 0)
      obj.parentId = item.parentConfigId || 0
      obj.serialNumber = item.serialNumber
      obj.itemConfigType = item.itemConfigType
      if (Array.isArray(item.quotedItemConfigTreeVOList) && item.quotedItemConfigTreeVOList.length > 0) {
        obj.children = item.quotedItemConfigTreeVOList.map(v => that.formatTreeData(v))
      }
      return obj
    },
    handleClick(selectedKeys, e) {
      const that = this
      that.selectedTreeNode = e.node
      const dataRef = e.node.dataRef
      // 点击树结构菜单
      var parentId = this.parentId
      if (selectedKeys[0] !== undefined) {
        parentId = selectedKeys[0]
      }
      that.queryParam = { ...that.queryParam, id: +parentId === 0 ? 0 : parentId }
      that.parentId = parentId
      that.parentItem = { ...dataRef }

      that.selectedRowKeys = []
      that.selectedRows = []

      that.pagination = {...that.pagination,current:1}

      that.search()
    },
    async doAction(type, record) {
      const that = this
      if (type === 'add') {
        that.$nextTick(() => {
          that.$refs.addForm.query(type, {
            ...record,
            __selectItem: that.parentItem,
            __treeData: [...that.orgTree]
          })
        })
      } else if (type === 'edit') {
        that.$nextTick(() => {
          that.$refs.addForm.query(type, {
            ...that.selectedRows[0],
            __selectItem: that.parentItem,
            __treeData: [...that.orgTree]
          })
        })
      } else if (type === 'export') {
        that.$message.info('功能正在开发中...')
        return
      } else if (type === 'price') {
        const rows = that.selectedRows.map(r => Object.assign({}, r)).filter(item => item.itemConfigType === 1)
        that.$refs.priceForm.query(rows)
      } else {
        const m = {
          del: {
            api: priceQuotedItemConfigDeleteBatch,
            title: '删除',
            tpl: names => `确定要删除${names}吗？`
          }
        }
        const target = m[type]
        if (!target) {
          that.$message.error(`不支持的操作类型:${type}`)
          return
        }
        const itemNames = `【${that.selectedRows.map(item => item.configName).join('，')}】`
        const ids = that.selectedRows.map(item => item.id).join(',')
        that.$confirm({
          title: '提示',
          content: target.tpl(itemNames),
          okText: '确定',
          cancelText: '取消',
          onOk() {
            target
              .api({ ids: ids })
              .then(res => {
                that.$message.info(res.msg)
                if (res.code === 200) {
                  that.finishHandler()
                }
              })
              .catch(err => {
                that.$message.error(err.message)
              })
          }
        })
      }
    },
    finishHandler(param) {
      const that = this
      that.selectedRowKeys = []
      that.selectedRows = []
      that.$nextTick(() => {
        that.search()
        that.fetchTree()
      })
    },
    splitClear() {
      try {
        if (this.splitInstance !== null) {
          this.splitInstance.destroy()
          this.splitInstance = null
        }
      } catch (err) {
        this.splitInstance = null
        console.log(err)
      }
    }
  },
  beforeDestroy() {
    this.splitClear()
  }
}
</script>

<style scoped>
.product-offer-management-opt-management >>> .resize-column-wrapper {
  width: 100%;
  height: 100%;
  background-color: #fff;
  display: flex;
  overflow: hidden;
}

#split-0,
#split-1 {
  padding: 0 5px;
}
</style>

