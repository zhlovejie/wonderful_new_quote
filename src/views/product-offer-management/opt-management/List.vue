<template>
  <a-card
    :bordered="false"
    class="product-offer-management-opt-management"
  >
    <div class="resize-column-wrapper">
      <div class="resize-column-left">
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
      <div class="resize-column-control-bar"></div>
      <div class="resize-column-right">
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
                :disabled="!canUse"
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
          :pagination="false"
          :loading="loading"
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
            slot="configType"
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
  priceQuotedItemConfigTreeList,
  priceQuotedItemConfigSetPrices
} from '@/api/productOfferManagement'

import ResizeColumn from '@/components/CustomerList/ResizeColumn'
import AddForm from './AddForm.vue'
import PriceForm from './PriceForm'

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
    dataIndex: 'configType',
    scopedSlots: { customRender: 'configType' }
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
      queryParam: {}
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
      this.parentId = undefined
      this.selectedTreeNode = null
      this.queryParam = {
        ...this.queryParam,
        id: this.parentId
      }
      this.fetchTree()
      this.search()

      this.$nextTick(() => {
        this._ResizeColumnInstance = new ResizeColumn()
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
            children: res.data.map(item => that.formatTreeData(item))
          }
          that.orgTree = [root]
          // if (that.parentId === -1) {
          //   that.parentItem = root
          // }
          console.log(JSON.stringify(that.orgTree))
        })
        .catch(err => {
          that.$message.error(`调用接口[priceQuotedItemConfigTreeList]时发生错误，错误信息:${err}`)
        })
    },
    search(params = {}) {
      const that = this
      that.loading = true
      const _searchParam = Object.assign({}, { ...that.queryParam }, params)
      priceQuotedItemConfigSubList(_searchParam)
        .then(res => {
          that.loading = false
          that.dataSource = res.data.filter(item => item.configType !== 9).map((item, index) => {
            item.key = index + 1
            return item
          })
        })
        .catch(err => {
          console.error(err)
          that.loading = false
        })
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
      obj.configType = item.configType
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
      that.queryParam = { ...that.queryParam, id: +parentId === 0 ? undefined : parentId }
      that.parentId = parentId
      that.parentItem = { ...dataRef }

      that.selectedRowKeys = []
      that.selectedRows = []
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
        const rows = that.selectedRows.map(r => Object.assign({}, r))
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
    }
  },
  beforeDestroy() {
    if (this._ResizeColumnInstance) {
      this._ResizeColumnInstance.destory()
      this._ResizeColumnInstance = null
    }
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

.product-offer-management-opt-management >>> .resize-column-wrapper .resize-column-control-bar {
  width: 10px;
  background-color: #f5f5f5;
  cursor: col-resize;
  box-shadow: 0 0px 3px 1px #ddd;
  border-radius: 6px;
  margin: 0 10px;
}

.product-offer-management-opt-management >>> .resize-column-wrapper .resize-column-left {
  overflow: auto;
}
.product-offer-management-opt-management >>> .resize-column-wrapper .resize-column-right {
  flex: 1;
}
</style>

