<template>
  <a-card
    :bordered="false"
    class="material-rule-management-library-normal"
  >
    <div class="resize-column-wrapper">
      <div class="resize-column-left">
        <div
          class="menu-tree-list-wrapper"
          style="width: 100%; overflow: auto; height: auto; min-height: 600px"
        >
          <!-- <a-input-search
            style="line-height: 40px; width: 100%"
            placeholder="代码/名称模糊查询"
            @change="treeInputSearchDebounce"
          /> -->
          <a-tree
            ref="treeRef"
            :loadData="onLoadData"
            :treeData="orgTree"
            :selectedKeys="treeSelectedKeys"
            :defaultExpandAll="true"
            @select="handleClick"
            :expandedKeys="expandedKeys"
            :autoExpandParent="autoExpandParent"
            @expand="onExpand"
            :showLine="true"
          >
            <template
              slot="title"
              slot-scope="{ title }"
            >
              <span v-if="title.indexOf(searchValue) > -1">
                {{ title.substr(0, title.indexOf(searchValue)) }}
                <span style="color: #f50">{{ searchValue }}</span>
                {{ title.substr(title.indexOf(searchValue) + searchValue.length) }}
              </span>
              <span v-else>{{ title }}</span>
            </template>
          </a-tree>
        </div>
      </div>
      <div class="resize-column-control-bar"></div>
      <div class="resize-column-right">
        <div class="search-wrapper">
          <a-form layout="inline">
            <a-form-item>
              <a-input
                placeholder="代码模糊查询"
                v-model="queryParam.materialCode"
                allowClear
                style="width: 150px"
              />
            </a-form-item>
            <a-form-item>
              <a-input
                placeholder="名称模糊查询"
                v-model="queryParam.materialName"
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
            <a-form-item>
              <a-button
                type="primary"
                icon="filter"
                @click="doAction('filter', null)"
              >筛选</a-button>
            </a-form-item>
            <a-form-item v-if="$auth('routineMaterialInfo:add')">
              <a-button
                type="primary"
                @click="doAction('add', null)"
              >新增</a-button>
            </a-form-item>
            <a-form-item v-if="$auth('routineMaterialInfo:edit')">
              <a-button
                :disabled="!canEdit"
                type="primary"
                @click="doAction('edit', null)"
              >修改</a-button>
            </a-form-item>

            <a-form-item v-if="$auth('routineMaterialInfo:disable')">
              <a-button
                :disabled="!canUse"
                type="primary"
                @click="doAction('disable', null)"
              >禁用</a-button>
            </a-form-item>
            <a-form-item v-if="$auth('routineMaterialInfo:enable')">
              <a-button
                :disabled="!canUse"
                type="primary"
                @click="doAction('enable', null)"
              >启用</a-button>
            </a-form-item>
            <a-form-item v-if="$auth('routineMaterialInfo:del')">
              <a-button
                :disabled="!canUse"
                type="primary"
                @click="doAction('del', null)"
              >删除</a-button>
            </a-form-item>
            <a-form-item v-if="$auth('routineMaterialInfo:audit')">
              <a-button
                :disabled="!canUse"
                type="primary"
                @click="doAction('approval', null)"
              >审核</a-button>
            </a-form-item>
            <a-form-item v-if="$auth('routineMaterial:annulAudit')">
              <a-button
                :disabled="!canUse"
                type="primary"
                @click="doAction('unapproval', null)"
              >反审核</a-button>
            </a-form-item>
            <a-form-item v-if="$auth('routineMaterial:export')">
              <a-button
                :disabled="!canUse"
                type="primary"
                @click="doAction('export', null)"
              >导出</a-button>
            </a-form-item>
          </a-form>
        </div>
        <a-alert
          message="字体颜色说明"
          type="info"
          show-icon
          style="margin-top: 10px"
        >
          <div slot="description">
            <span style="color: blue">蓝色使用</span>
            <span style="color: red; margin: 0 10px">红色禁用</span>
            <span>黑色未使用/未检测</span>
          </div>
        </a-alert>
        <a-table
          :columns="columns"
          :dataSource="dataSource"
          :pagination="pagination"
          :loading="loading"
          @change="handleTableChange"
          :customRow="customRowFunction"
          :rowSelection="{ onChange: rowSelectionChangeHnadler, selectedRowKeys: selectedRowKeys }"
        >
          <div
            slot="order"
            slot-scope="text, record, index"
          >
            <span>{{ index + 1 }}</span>
          </div>
          <div
            slot="materialSource"
            slot-scope="text, record, index"
          >
            {{ {1:'自制',2:'外购',3:'委外',4:'标准件'}[text] }}
          </div>

          <div
            slot="mainUnit"
            slot-scope="text, record, index"
          >
            {{ {1:'支',2:'把',3:'件'}[text] }}
          </div>
          <div
            slot="specifications"
            slot-scope="text, record, index"
          >
            <a-tooltip>
              <template slot="title">
                {{text}}
              </template>
              <span class="icon-required">查看</span>
              <a-icon
                type="question-circle"
                style="margin-left:5px;color:#1890ff;"
              />
            </a-tooltip>
          </div>
          <a
            slot="auditStatus"
            slot-scope="text, record"
            @click="approvalPreview(record)"
          >
            {{ {1:'未审核',2:'审批中',3:'已审核'}[text] }}
          </a>
        </a-table>
      </div>
    </div>
    <NormalAddForm
      ref="NormalAddForm"
      :key="normalAddFormKeyCount"
      @finish="finishHandler"
    />
    <ApproveInfo ref="approveInfoCard" />
    <SearchForm
      ref="searchForm"
      @change="paramChangeHandler"
    />
  </a-card>
</template>

<script>
import {
  productMaterialInfoDelete,
  productMaterialInfoAnnulAudit,
  productMaterialInfoAudit,
  productMaterialInfoForbidden,
  productMaterialInfoStartUsing,
  productMaterialInfoPageList,
  productMaterialInfoTwoTierTreeList,
  __MaterialInfoExport
} from '@/api/routineMaterial'
import ApproveInfo from '@/components/CustomerList/ApproveInfo'
import NormalAddForm from './module/NormalAddForm'
import ResizeColumn from '@/components/CustomerList/ResizeColumn'
import SearchForm from './module/SearchForm'

const columns = [
  {
    align: 'center',
    title: '物料代码',
    dataIndex: 'materialCode'
  },
  {
    align: 'center',
    title: '中文名称',
    dataIndex: 'materialName'
  },
  {
    align: 'center',
    title: '物料来源属性',
    dataIndex: 'materialSource',
    scopedSlots: { customRender: 'materialSource' }
  },
  // {
  //   align: 'center',
  //   title: '规格型号',
  //   dataIndex: 'specifications',
  //   scopedSlots: { customRender: 'specifications' }
  // },
  {
    align: 'center',
    title: '主计量单位',
    dataIndex: 'mainUnit',
    scopedSlots: { customRender: 'mainUnit' }
  },
  {
    align: 'center',
    title: '录入人',
    dataIndex: 'createdName'
  },
  {
    align: 'center',
    title: '审核状态',
    dataIndex: 'auditStatus',
    scopedSlots: { customRender: 'auditStatus' }
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
  name: 'material-rule-management-library-finished-code',
  components: {
    NormalAddForm,
    ApproveInfo,
    SearchForm
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
      treeInputSearchDebounce: null,
      normalAddFormKeyCount: 1
    }
  },
  watch: {
    $route: {
      handler: function(to, from) {
        if (to.name === 'material-rule-management-library-finished-code') {
          this.init()
        }
      },
      immediate: true
    }
  },
  computed: {
    canEdit() {
      // auditStatus 审核状态：1未审核，2审批中，3已审核
      // forbidden  是否禁用：1禁用，2启用
      let selectedRows = this.selectedRows
      if (selectedRows.length === 1) {
        let { auditStatus, forbidden } = selectedRows[0]
        return !(+forbidden === 1 || +auditStatus === 3)
      }
      return false
    },
    canUse() {
      return this.selectedRows.length > 0
    },
    treeSelectedKeys() {
      return [String(this.parentId)]
    },
    parentCodes() {
      let arr = []
      let parentId = this.parentId
      while (+parentId) {
        let target = this.dataList.find(item => +item.key === +parentId)
        arr.push({ ...target })
        parentId = target.parentId
      }
      return arr
        .reverse()
        .map(item => item.code)
        .join('')
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
      let arr = []
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
      // if (this.treeInputSearchDebounce === null) {
      //   this.treeInputSearchDebounce = this.$_.debounce(this.onChange, 2000)
      // }

      this.parentId = 0
      this.selectedTreeNode = null
      this.queryParam = {
        ...this.queryParam,
        ruleId: this.parentId
      }
      this.fetchTree()
      this.search()

      this.$nextTick(() => {
        this._ResizeColumnInstance = new ResizeColumn()
      })
    },
    onLoadData(treeNode, isForceRefresh = false) {
      const that = this
      that.selectedTreeNode = treeNode
      return new Promise(resolve => {
        if (!isForceRefresh && treeNode.dataRef.children) {
          resolve()
          return
        }
        productMaterialInfoTwoTierTreeList({ parentId: treeNode.dataRef.value })
          .then(res => {
            let oldChildren = [...(treeNode.dataRef.children || [])]
            let newChildren = res.data.map(item => that.formatTreeData(item))
            let children = that.margeNode(oldChildren, newChildren)

            treeNode.dataRef.children = children
            that.orgTree = [...that.orgTree]
            that.dataList = that.generateList(that.orgTree)
            resolve()
          })
          .catch(err => {
            console.error(err)
            that.$message.error(`调用接口[productMaterialInfoTwoTierTreeList]时发生错误，错误信息:${err}`)
          })
      })
    },
    margeNode(oldChildren, newChildren) {
      let arr = []
      for (let i = 0; i < newChildren.length; i++) {
        let newNode = newChildren[i]
        let oldNode = oldChildren.find(node => node.value === newNode.value)
        if (oldNode) {
          for (let key in newNode) {
            if (newNode.hasOwnProperty(key) && key !== 'children') {
              oldNode[key] = newNode[key]
            }
          }
          arr.push(oldNode)
        } else {
          arr.push(newNode)
        }
      }
      return arr
    },
    fetchTree() {
      const that = this
      // routineMaterialInfoTwoTierTreeList({parentId:that.parentId}).then(res =>{
      //   console.log(res)
      // })
      productMaterialInfoTwoTierTreeList({ parentId: 0 })
        .then(res => {
          const root = {
            key: '0',
            value: '0',
            title: '成品代码库',
            isLeaf: false,
            code: '0',
            codeLength: 10,
            parentId: 0,
            children: res.data.map(item => that.formatTreeData(item)),
            scopedSlots: { title: 'title' }
          }
          that.orgTree = [root]
          that.dataList = that.generateList(that.orgTree)

          if (String(that.parentId) === '0') {
            that.parentItem = root
          }
        })
        .catch(err => {
          that.$message.error(`调用接口[productMaterialInfoTwoTierTreeList]时发生错误，错误信息:${err}`)
        })
    },
    search(params = {}) {
      const that = this
      let paginationParam = {
        current: that.pagination.current || 1,
        size: that.pagination.pageSize || 10
      }
      that.loading = true
      let _searchParam = Object.assign({}, { ...that.queryParam }, paginationParam, params)
      productMaterialInfoPageList(_searchParam)
        .then(res => {
          that.loading = false
          if (!(res && res.data && res.data.records && Array.isArray(res.data.records))) {
            return
          }
          that.dataSource = res.data.records.map((item, index) => {
            item.key = index + 1
            item.fullCode = that.parentCodes ? `${that.parentCodes}${item.code}` : item.code
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
          let { current, pages } = res.data
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
    //格式化接口数据 key,title,value
    formatTreeData(item) {
      let that = this
      let obj = {}
      obj.key = String(item.id)

      let ruleName = item.newRuleName || item.ruleName
      let showCode = +item.isSpecification === 1 ? '' : `(${item.code})`
      obj.title = `${ruleName}${showCode}`

      obj.value = String(item.id)
      // obj.isLeaf = !(Array.isArray(item.subList) && item.subList.length > 0)
      obj.parentId = item.parentId
      obj.codeLength = +item.codeLength
      obj.code = item.code
      obj.scopedSlots = { title: 'title' }
      //obj.__selectable = obj.isLeaf
      if (Array.isArray(item.subList) && item.subList.length > 0) {
        obj.children = item.subList.map(v => that.formatTreeData(v))
      }
      return obj
    },
    handleClick(selectedKeys, e) {
      const that = this
      that.selectedTreeNode = e.node
      let dataRef = e.node.dataRef
      // 点击树结构菜单
      var parentId = this.parentId
      if (selectedKeys[0] !== undefined) {
        parentId = selectedKeys[0]
      }
      that.queryParam = { ...that.queryParam, ruleId: parentId }
      that.parentId = parentId
      that.parentItem = { ...dataRef }

      that.selectedRowKeys = []
      that.selectedRows = []
      that.search()
    },
    async doAction(type, record) {
      const that = this
      if (type === 'add') {
        that.normalAddFormKeyCount = that.normalAddFormKeyCount + 1
        that.$nextTick(() => {
          that.$refs.NormalAddForm.query(type, {
            ...record,
            __selectItem: that.parentItem,
            __treeData: [...that.orgTree],
            __from: 'product'
          })
        })
        return
      } else if (type === 'edit') {
        that.normalAddFormKeyCount = that.normalAddFormKeyCount + 1
        that.$nextTick(() => {
          that.$refs.NormalAddForm.query(type, {
            ...that.selectedRows[0],
            __selectItem: that.parentItem,
            __treeData: [...that.orgTree],
            __from: 'product'
          })
        })
        return
      } else if (type === 'export') {
        let ids = that.selectedRows.map(item => `ids=${item.id}`).join('&')
        let res = await __MaterialInfoExport(2,ids)
        console.log(res)
        that.$message.info(res.msg)
        return
      } else if (type === 'filter') {
        that.$refs.searchForm.query({
            ...record,
            __selectItem: that.parentItem,
            __treeData: [...that.orgTree],
            __from: 'product'
          })
        return
      } else {
        let m = {
          disable: {
            api: productMaterialInfoForbidden,
            title: '禁用',
            tpl: names => `是否要禁用所选项目${names}？`
          },
          enable: {
            api: productMaterialInfoStartUsing,
            title: '启用',
            tpl: names => `确定要启用${names}吗？`
          },
          del: {
            api: productMaterialInfoDelete,
            title: '删除',
            tpl: names => `确定要删除${names}吗？`
          },
          approval: {
            api: productMaterialInfoAudit,
            title: '审核',
            tpl: names => `确定要审核项目${names}吗？`
          },
          unapproval: {
            api: productMaterialInfoAnnulAudit,
            title: '反审核',
            tpl: names => `反审核项目${names}后，数据标记为未审核，是否继续？`
          }
        }
        let target = m[type]
        if (!target) {
          that.$message.error(`不支持的操作类型:${type}`)
          return
        }
        let itemNames = `【${that.selectedRows.map(item => item.materialName).join('，')}】`
        let ids = that.selectedRows.map(item => item.id).join(',')
        that.$confirm({
          title: '提示',
          content: target.tpl(itemNames),
          okText: '确定',
          cancelText: '取消',
          onOk() {
            target
              .api(`ids=${ids}`)
              .then(res => {
                that.$message.info(res.msg)
                if (res.code === 200) {
                  that.finishHandler({ key: that.parentItem.value })
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
      this.selectedRowKeys = []
      this.selectedRows = []
      this.search()
      if (param && param.key) {
        let target = this.findTreeNode(this.$refs.treeRef, param.key)
        if (target) {
          this.onLoadData(target, true)
        }
      }
    },
    findTreeNode(rootNode, key) {
      if (rootNode.dataRef && rootNode.dataRef.value === key) {
        return rootNode
      }
      if (Array.isArray(rootNode.$children)) {
        for (let i = 0; i < rootNode.$children.length; i++) {
          let node = this.findTreeNode(rootNode.$children[i], key)
          if (node) {
            return node
          }
        }
      }
    },
    customRowFunction(record) {
      // useStatus 使用状态：1使用，2未使用，3逐步淘汰，4已淘汰
      // isForbidden  是否禁用：1禁用，2启用
      let { useStatus, isForbidden } = record
      return {
        style: {
          color: +isForbidden === 1 ? 'red' : +useStatus === 1 ? 'blue' : ''
        },
        on: {
          dblclick: event => {
            const that = this
            that.normalAddFormKeyCount = that.normalAddFormKeyCount + 1
            that.$nextTick(() => {
              that.$refs.NormalAddForm.query('view', {
                ...record,
                __selectItem: that.parentItem,
                __treeData: [...that.orgTree],
                __from: 'product'
              })
            })
          }
        }
      }
    },
    approvalPreview(record) {
      if (!record.instanceId) {
        this.$message.info('未生成审批流程')
        return
      }
      this.$refs.approveInfoCard.init(record.instanceId)
    },
    paramChangeHandler(params) {
      this.queryParam = { ...this.queryParam, ...params }
      this.search()
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
.material-rule-management-library-normal >>> .resize-column-wrapper {
  width: 100%;
  height: 100%;
  background-color: #fff;
  display: flex;
  overflow: hidden;
}

.material-rule-management-library-normal >>> .resize-column-wrapper .resize-column-control-bar {
  width: 10px;
  background-color: #f5f5f5;
  cursor: col-resize;
  box-shadow: 0 0px 3px 1px #ddd;
  border-radius: 6px;
  margin: 0 10px;
}

.material-rule-management-library-normal >>> .resize-column-wrapper .resize-column-left {
  overflow: auto;
}
.material-rule-management-library-normal >>> .resize-column-wrapper .resize-column-right {
  flex: 1;
}
</style>

