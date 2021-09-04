<template>
  <a-card
    :bordered="false"
    class="product-process-management_process-route-management_route"
  >
    <div class="resize-column-wrapper">
      <div class="resize-column-left">
        <div
          class="menu-tree-list-wrapper"
          style="width: 100%; overflow: auto; height: auto; min-height: 600px"
        >
          <a-tree
            ref="treeRef"
            :loadData="onLoadData"
            :treeData="orgTree"
            :defaultExpandAll="true"
            @select="handleClick"
            :showLine="true"
          >
            <template
              slot="title"
              slot-scope="{ title ,__color}"
            >
              <span :style="{'color':__color}">{{ title }}</span>
            </template>
          </a-tree>
        </div>
      </div>
      <div class="resize-column-control-bar"></div>
      <div class="resize-column-right">
        <template v-if="routeView">
          <RouteViewFrom ref="routeViewFrom" />
        </template>
        <template v-else>
          <div class="search-wrapper">
            <a-form layout="inline">
              <a-form-item>
                <a-input
                  placeholder="工艺路线代码"
                  v-model="queryParam.routeCode"
                  allowClear
                  style="width: 150px"
                />
              </a-form-item>
              <a-form-item>
                <a-input
                  placeholder="工艺路线名称"
                  v-model="queryParam.routeName"
                  allowClear
                  style="width: 150px"
                />
              </a-form-item>
              <a-form-item>
                <a-input
                  placeholder="物料代码"
                  v-model="queryParam.materialCommonCode"
                  allowClear
                  style="width: 150px"
                />
              </a-form-item>
              <a-form-item>
                <a-input
                  placeholder="物料名称"
                  v-model="queryParam.materialCommonName"
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
                >高级筛选</a-button>
              </a-form-item>
              <a-form-item v-if="$auth('craftRoute:add')">
                <a-button
                  type="primary"
                  :disabled="!canAdd"
                  @click="doAction('add', null)"
                >新增</a-button>
              </a-form-item>
              <a-form-item v-if="$auth('craftRoute:update')">
                <a-button
                  :disabled="!canEdit"
                  type="primary"
                  @click="doAction('edit', null)"
                >修改</a-button>
              </a-form-item>
              <a-form-item v-if="$auth('craftRoute:del')">
                <a-button
                  :disabled="!canUse"
                  type="primary"
                  @click="doAction('del', null)"
                >删除</a-button>
              </a-form-item>
              <a-form-item v-if="$auth('craftRoute:add')">
                <a-button
                  :disabled="!canEdit"
                  type="primary"
                  @click="doAction('copy', null)"
                >复制</a-button>
              </a-form-item>
              <a-form-item v-if="$auth('craftRoute:audit')">
                <a-button
                  :disabled="!canUse"
                  type="primary"
                  @click="doAction('approval', null)"
                >审核</a-button>
              </a-form-item>
              <a-form-item v-if="$auth('craftRoute:annulAudit')">
                <a-button
                  :disabled="!canUse"
                  type="primary"
                  @click="doAction('unapproval', null)"
                >反审核</a-button>
              </a-form-item>
              <!-- <a-form-item >
                <a-button
                  :disabled="!canAdd"
                  type="primary"
                  @click="doAction('import', null)"
                >导入</a-button>
              </a-form-item> -->
              <!-- <a-form-item >
                <a-button
                  :disabled="!canUse"
                  type="primary"
                  @click="doAction('export', null)"
                >导出</a-button>
              </a-form-item> -->
            </a-form>
          </div>
          <h3 class="_hd">基本信息</h3>
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
              slot="materialCommonCaculatorUnit"
              slot-scope="text, record, index"
            >
              {{ {1:'支',2:'把',3:'件'}[text] || text }}
            </div>

            <div
              slot="defaultStatus"
              slot-scope="text, record, index"
            >
              {{ {1:'是',0:'否'}[text] }}
            </div>

            <div
              slot="materialCommonType"
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
              slot="status"
              slot-scope="text, record"
              @click="approvalPreview(record)"
            >
              {{ {1:'未审核',2:'审批中',3:'已审核'}[text] }}
            </a>
          </a-table>
          <h3 class="_hd">工序信息</h3>
          <a-table
            :columns="gxColumns"
            :dataSource="gxDataSource"
            :pagination="false"
            :loading="gxLoading"
          >
            <div
              slot="personCost"
              slot-scope="text, record, index"
            >
              <span>{{ text | moneyFormatNumber }}</span>
            </div>
            <div
              slot="workshopId"
              slot-scope="text, record, index"
            >
              <span>{{ getWorkShop(text) }}</span>
            </div>
            <div
              slot="checkType"
              slot-scope="text, record, index"
            >
              <span>{{ {1:'免检',2:'抽检',3:'全检'}[text] }}</span>
            </div>
            <div
              slot="foreignFlag"
              slot-scope="text, record, index"
            >
              <span>{{ {1:'是',0:'否'}[text] }}</span>
            </div>
          </a-table>
        </template>
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
import { productMaterialInfoTwoTierTreeList } from '@/api/routineMaterial'

import {
  getAllProductMaterial,
  craftRouteDetail,
  craftRouteListByMaterial,
  craftRouteApprovePageList,
  craftRouteDelete,
  craftRouteAuditByMaterial,
  craftRouteAnnulAuditBatch,
  __craftRouteExport,
  craftRouteGetAllWorkshop,
  craftRouteAudit,
  craftRouteAnnulAudit
} from '@/api/craftRoute'

import ApproveInfo from '@/components/CustomerList/ApproveInfo'
import AddForm from './module/AddForm'
import RouteViewFrom from './module/RouteView'
import ResizeColumn from '@/components/CustomerList/ResizeColumn'
import SearchForm from './module/SearchForm'

const columns = [
  {
    align: 'center',
    title: '工艺路线代码',
    dataIndex: 'routeCode'
  },
  {
    align: 'center',
    title: '工艺路线名称',
    dataIndex: 'routeName'
  },
  {
    align: 'center',
    title: '物料代码',
    dataIndex: 'materialCommonCode'
  },
  {
    align: 'center',
    title: '物料名称',
    dataIndex: 'materialCommonName'
  },
  {
    align: 'center',
    title: '规格型号',
    dataIndex: 'materialCommonType',
    scopedSlots: { customRender: 'materialCommonType' }
  },
  {
    align: 'center',
    title: '主计量单位',
    dataIndex: 'materialCommonCaculatorUnit',
    scopedSlots: { customRender: 'materialCommonCaculatorUnit' }
  },
  {
    align: 'center',
    title: '缺省状态',
    dataIndex: 'defaultStatus',
    scopedSlots: { customRender: 'defaultStatus' }
  },
  // {
  //   align: 'center',
  //   title: '审核状态',
  //   dataIndex: 'status',
  //   scopedSlots: { customRender: 'status' }
  // },
  {
    align: 'center',
    title: '提交人',
    dataIndex: 'createdName'
  },
  {
    align: 'center',
    title: '提交时间',
    dataIndex: 'createdTime'
  }
]

const gxColumns = [
  {
    align: 'center',
    title: '顺序号',
    dataIndex: 'orderNum'
  },
  {
    align: 'center',
    title: '工作中心部门',
    dataIndex: 'workshopId',
    scopedSlots: { customRender: 'workshopId' }
  },
  {
    align: 'center',
    title: '工序名',
    dataIndex: 'processName'
  },
  {
    align: 'center',
    title: '工序代码',
    dataIndex: 'processCode'
  },
  {
    align: 'center',
    title: '检验方式',
    dataIndex: 'checkType',
    scopedSlots: { customRender: 'checkType' }
  },
  {
    align: 'center',
    title: '是否外协',
    dataIndex: 'foreignFlag',
    scopedSlots: { customRender: 'foreignFlag' }
  },
  {
    align: 'center',
    title: '时长(秒)',
    dataIndex: 'duration'
  },
  {
    align: 'center',
    title: '工人费(元)',
    dataIndex: 'personCost',
    scopedSlots: { customRender: 'personCost' }
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
  name: 'product-process-management_process-route-management_route',
  components: {
    NormalAddForm: AddForm,
    ApproveInfo,
    SearchForm,
    RouteViewFrom
  },
  data() {
    return {
      parentId: 0, // 父id
      parentItem: {},
      selectedTreeNode: null, //新增修改后刷新节点用
      // 表头
      columns,
      gxColumns,
      orgTree: [],
      dataSource: [],
      gxDataSource: [],
      selectedRowKeys: [],
      selectedRows: [],

      dataList: [],
      expandedKeys: [],
      searchValue: '',
      autoExpandParent: true,

      loading: false,
      gxLoading: false,
      queryParam: {},
      treeInputSearchDebounce: null,
      normalAddFormKeyCount: 1,
      allWorkshop: [],
      pagination: {
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: total => `共有 ${total} 条数据`, //分页中显示总的数据
        onShowSizeChange: this.onShowSizeChangeHandler
      },

      routeView: false //点击 subProduct 需要查看详情
    }
  },
  watch: {
    $route: {
      handler: function(to, from) {
        if (to.name === 'product-process-management_process-route-management_route') {
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
      // let selectedRows = this.selectedRows
      // if (selectedRows.length === 1) {
      //   let { auditStatus, forbidden } = selectedRows[0]
      //   return !(+forbidden === 1 || +auditStatus === 3)
      // }
      // return false
      return this.selectedRows.length === 1
    },
    canUse() {
      return this.selectedRows.length > 0
    },
    canAdd() {
      return !!this.parentItem.isProduct
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
      // if (this.treeInputSearchDebounce === null) {
      //   this.treeInputSearchDebounce = this.$_.debounce(this.onChange, 2000)
      // }

      that.parentId = 0
      that.selectedTreeNode = null
      that.queryParam = {
        ...that.queryParam
      }
      that.fetchTree()
      this.search()

      that.$nextTick(() => {
        that._ResizeColumnInstance = new ResizeColumn()
      })

      craftRouteGetAllWorkshop().then(res => {
        that.allWorkshop = res.data
      })
    },
    search(params = {}) {
      const that = this
      const paginationParam = {
        current: that.pagination.current || 1,
        size: that.pagination.pageSize || 10
      }
      that.gxDataSource = []
      that.loading = true
      const _searchParam = Object.assign({}, { ...that.queryParam }, params, paginationParam)
      // craftRouteListByMaterial(_searchParam)
      craftRouteApprovePageList(_searchParam)
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
        })
        .catch(err => {
          console.error(err)
          that.loading = false
        })
    },
    // 分页
    handleTableChange(pagination, filters, sorter) {
      this.pagination = { ...this.pagination, current: pagination.current }
      this.search()
    },
    onShowSizeChangeHandler(current, pageSize) {
      this.pagination = { ...this.pagination, current, pageSize }
    },
    /**
     * @description 树加载规则： 1.先加载规则 2.如果没有规则，尝试加载规则对应的成品 3.如果是成品 加载对应成品的工艺
     * @param {treeNode} treeNode 被展开的树节点
     * @param {boolean} force 是否强制加载节点数据
     */
    onLoadData(treeNode, force = false) {
      const that = this
      that.selectedTreeNode = treeNode
      return new Promise(async resolve => {
        if (treeNode.dataRef.children && !force) {
          resolve()
          return
        }
        const { isRule, isProduct, isSubProduct } = treeNode.dataRef
        if (isRule) {
          const ruleResult = await productMaterialInfoTwoTierTreeList({ parentId: treeNode.dataRef.value })
            .then(res => res.data)
            .catch(err => {
              console.log(err)
              return []
            })
          if (ruleResult.length > 0) {
            treeNode.dataRef.children = ruleResult.map(item => that.formatRuleNode(item))
            that.orgTree = [...that.orgTree]
          } else {
            const productResult = await getAllProductMaterial({ ruleId: treeNode.dataRef.value })
              .then(res => res.data)
              .catch(err => {
                console.log(err)
                return []
              })
            if (productResult.length > 0) {
              treeNode.dataRef.children = productResult.map(item => that.formatProductNode(item))
              that.orgTree = [...that.orgTree]
            }
          }
        }
        if (isProduct) {
          const subProductResult = await craftRouteListByMaterial({ materialGroupId: treeNode.dataRef.__id })
            .then(res => res.data)
            .catch(err => {
              console.log(err)
              return []
            })
          if (subProductResult.length > 0) {
            treeNode.dataRef.children = subProductResult.map(item => that.formatSubProductNode(item))
            that.orgTree = [...that.orgTree]
          }
        }
        resolve()
      })
    },
    fetchTree() {
      const that = this
      productMaterialInfoTwoTierTreeList({ parentId: 0 })
        .then(res => {
          const root = {
            key: '0',
            value: '0',
            title: '成品代码库',
            isLeaf: false,
            code: '0',
            parentId: 0,
            children: res.data.map(item => that.formatRuleNode(item)),
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
    //格式化接口数据 key,title,value
    formatRuleNode(item) {
      const that = this
      const obj = {}
      obj.key = String(item.id)
      const ruleName = item.newRuleName || item.ruleName
      const showCode = +item.isSpecification === 1 ? '' : `(${item.code})`
      obj.title = `${ruleName}${showCode}`
      obj.value = String(item.id)
      obj.parentId = item.parentId
      obj.codeLength = +item.codeLength
      obj.code = item.code
      obj.scopedSlots = { title: 'title' }
      obj.isRule = true
      if (Array.isArray(item.subList) && item.subList.length > 0) {
        obj.children = item.subList.map(v => that.formatRuleNode(v))
      }
      return obj
    },

    formatProductNode(item) {
      const that = this
      const obj = {}
      obj.key = obj.value = String(item.materialCode)
      obj.__id = item.id
      obj.__ruleId = item.ruleId
      obj.title = `${item.materialName}(${item.materialCode})`
      obj.__materialName = item.materialName
      obj.__materialCode = item.materialCode
      obj.__mainUnit = item.mainUnit
      obj.__materialSource = item.materialSource
      obj.scopedSlots = { title: 'title' }
      obj.isProduct = true
      return obj
    },
    formatSubProductNode(item) {
      const that = this
      const obj = {}
      obj.key = obj.value =
        String(item.routeCode) + '_' + String(item.routeName) + '_' + String(item.materialCommonCode)
      obj.__id = item.id
      obj.__materialName = item.materialCommonName
      obj.__materialCode = item.materialCommonCode
      obj.__status = item.status
      //审批状态 审批中2黄  通过3蓝  不通过4红
      const m_color = {
        1: 'normal',
        2: '#dada18',
        3: 'blue',
        4: 'red'
      }
      obj.__color = m_color[item.status]
      obj.title = `${item.materialCommonCode}(${item.materialCommonName})`
      obj.scopedSlots = { title: 'title' }
      obj.isSubProduct = true
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

      that.parentId = parentId
      that.parentItem = { ...dataRef }

      that.selectedRowKeys = []
      that.selectedRows = []

      that.routeView = false
      that.dataSource = []
      that.gxDataSource = []

      if (dataRef.isSubProduct) {
        that.routeView = true
        that.$nextTick(() => {
          that.$refs['routeViewFrom'] && that.$refs['routeViewFrom'].query('view', { id: dataRef.__id })
        })
      } else {
        that.routeView = false
        let materialGroupId = dataRef.__id || dataRef.value
        materialGroupId = String(materialGroupId) === "0" ? undefined : materialGroupId
        that.queryParam = { ...that.queryParam, materialGroupId, queryType: 0 }
        that.search()
      }
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
      } else if (type === 'copy') {
        that.normalAddFormKeyCount = that.normalAddFormKeyCount + 1
        that.$nextTick(() => {
          that.$refs.NormalAddForm.query(type, {
            ...that.selectedRows[0],
            __selectItem: that.parentItem,
            __treeData: [...that.orgTree],
            __from: 'product'
          })
        })
      } else if (type === 'import') {
        that.$message.info('暂未开发...')
      } else if (type === 'export') {
        that.$message.info('暂未开发...')

        // let ids = that.selectedRows.map(item => `ids=${item.id}`).join('&')
        // let res = await __craftRouteExport(2,ids)
        // console.log(res)
        // that.$message.info(res.msg)
      } else if (type === 'filter') {
        that.$refs.searchForm.query()
      } else {
        const m = {
          del: {
            api: craftRouteDelete,
            title: '删除',
            tpl: names => `确定要删除${names}吗？`
          },
          approval: {
            api: craftRouteAudit,
            title: '审核',
            tpl: names => `确定要审核项目${names}吗？`
          },
          unapproval: {
            api: craftRouteAnnulAudit,
            title: '反审核',
            tpl: names => `确定要反审核项目${names}吗？`
          }
        }
        const target = m[type]
        if (!target) {
          that.$message.error(`不支持的操作类型:${type}`)
          return
        }
        const itemNames = ` ${that.selectedRows.map(item => `${item.routeCode}【${item.routeName}】`).join('，')} `

        if (type === 'approval') {
          //待审核，审核不通过
          const items = that.selectedRows.filter(item => +item.status !== 1 && +item.status !== 4)
          if (items.length > 0) {
            that.$message.info(
              `${items
                .map(item => `${item.routeCode}【${item.routeName}】`)
                .join('，')} 已经提交审核或审核通过了。禁止重复提交审核！`
            )
            return
          }
        }
        if (type === 'unapproval') {
          const items = that.selectedRows.filter(item => +item.status !== 3)
          if (items.length > 0) {
            that.$message.info(
              `${items.map(item => `${item.routeCode}【${item.routeName}】`).join('，')} 尚未通过审核。禁止反审核操作！`
            )
            return
          }
        }

        // let ids = that.selectedRows.map(item => item.id).join(',')
        that.$confirm({
          title: '提示',
          content: target.tpl(itemNames),
          okText: '确定',
          cancelText: '取消',
          onOk() {
            const arr = []

            that.selectedRows.map(item => {
              arr.push(target.api(`id=${item.id}`).then(res => +res.code === 200))
            })

            Promise.all(arr).then(result => {
              that.$message.info('操作成功')
              that.finishHandler({ key: that.parentItem.value })
            })

            // target
            //   .api(`id=${ids}`)
            //   .then(res => {
            //     that.$message.info(res.msg)
            //     if (res.code === 200) {
            //       that.finishHandler({ key: that.parentItem.value })
            //     }
            //   })
            //   .catch(err => {
            //     that.$message.error(err.message)
            //   })
          }
        })
      }
    },
    finishHandler(param) {
      this.selectedRowKeys = []
      this.selectedRows = []
      this.search()
      if (param && param.key) {
        const target = this.findTreeNode(this.$refs.treeRef, param.key)
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
          const node = this.findTreeNode(rootNode.$children[i], key)
          if (node) {
            return node
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
    },
    customRowFunction(record) {
      // useStatus 使用状态：1使用，2未使用，3逐步淘汰，4已淘汰
      // isForbidden  是否禁用：1禁用，2启用
      const { useStatus, isForbidden } = record
      return {
        style: {
          color: +isForbidden === 1 ? 'red' : +useStatus === 2 ? 'blue' : ''
        },
        on: {
          click: event => {
            const that = this
            that.gxLoading = true
            craftRouteDetail({ id: record.id })
              .then(res => {
                that.gxLoading = false
                that.gxDataSource = res.data.processes.sort((a, b) => a.orderNum - b.orderNum)
              })
              .catch(err => {
                that.gxLoading = false
                console.log(err)
              })
          },
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

            // const that = this
            // that.normalAddFormKeyCount = that.normalAddFormKeyCount + 1

            // that.$nextTick(() => {
            //   that.$refs.NormalAddForm.query('view', {
            //     ...record,
            //     __selectItem: that.parentItem,
            //     __treeData: [...that.orgTree],
            //     __from: 'product'
            //   })
            // })
          }
        }
      }
    },
    getWorkShop(id) {
      const that = this
      const target = that.allWorkshop.find(item => String(item.id) === String(id))
      return target.departmentName
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
._hd {
  background-color: #f5f5f5;
  line-height: 30px;
  font-weight: normal;
  font-size: 100%;
  padding-left: 20px;
  margin: 0;
}
.product-process-management_process-route-management_route >>> .resize-column-wrapper {
  width: 100%;
  height: 100%;
  background-color: #fff;
  display: flex;
  overflow: hidden;
}

.product-process-management_process-route-management_route >>> .resize-column-wrapper .resize-column-control-bar {
  width: 10px;
  background-color: #f5f5f5;
  cursor: col-resize;
  box-shadow: 0 0px 3px 1px #ddd;
  border-radius: 6px;
  margin: 0 10px;
}

.product-process-management_process-route-management_route >>> .resize-column-wrapper .resize-column-left {
  overflow: auto;
}
.product-process-management_process-route-management_route >>> .resize-column-wrapper .resize-column-right {
  flex: 1;
}
</style>

