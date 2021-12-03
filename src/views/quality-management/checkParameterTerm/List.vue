<template>
  <a-card :bordered="false" class="material-rule-management-library-normal">
    <div class="resize-column-wrapper">
      <div class="resize-column-left">
        <a-spin :spinning="spinning">
        <div class="menu-tree-list-wrapper" style="width: 100%; overflow: auto; max-height: 900px; min-height: 600px">
          <a-tree
            ref="treeRef"
            :loadData="onLoadData"
            :loadedKeys="loadedKeys"
            :treeData="orgTree"
            @select="handleClick"
            :expandedKeys="expandedKeys"
            :autoExpandParent="autoExpandParent"
            @expand="onExpand"
            :showLine="true"
          >
          </a-tree>
        </div>
        </a-spin>
      </div>
      <div class="resize-column-control-bar"></div>
      <div class="resize-column-right">
        <div class="search-wrapper">
          <a-form layout="inline">
            <a-form-item>
              <a-input placeholder="配置名称模糊查询" v-model="queryParam.termName" allowClear style="width: 250px" />
            </a-form-item>
            <a-form-item>
              <a-button
                type="primary"
                icon="search"
                @click="search({ current: 1 })"
              >查询</a-button>
            </a-form-item>

            <a-form-item >
              <a-button type="primary" @click="doAction('add', null)">新增</a-button>
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
          <div slot="order" slot-scope="text, record, index">
            <span>{{ index + 1 }}</span>
          </div>

          <div slot="doAction" slot-scope="text, record, index">
            <a href="javascript:void(0);" @click="doAction('edit',record)">修改</a>
            <a-divider type="vertical" />
              <a-popconfirm title="确认删除该条数据吗?" @confirm="() => doAction('delete', record)">
                <a type="primary" href="javascript:;">删除</a>
              </a-popconfirm>
          </div>


        </a-table>
      </div>
    </div>
    <AddForm ref="addForm" @ok="handleOk"/>
  </a-card>
</template>

<script>
import {
  checkParameterTermPageList,
  checkParameterTermList,
  checkParameterTermDelete
} from '@/api/qualityManagement'
import ResizeColumn from '@/components/CustomerList/ResizeColumn'
import AddForm from './AddForm'
const columns = [
  {
    align: 'center',
    title: '序号',
    scopedSlots: { customRender: 'order' },
  },
  {
    align: 'center',
    title: '配置名称',
    dataIndex: 'termName',
  },
  {
    align: 'center',
    title: '备注',
    dataIndex: 'remarks',
  },
  {
    align: 'center',
    title: '操作人',
    dataIndex: 'createdName',
  },
  {
    align: 'center',
    title: '操作时间',
    dataIndex: 'createdTime',
  },
  {
    align: 'center',
    title: '操作',
    scopedSlots: { customRender: 'doAction' },
  },
]

const getParentKey = (key, tree) => {
  let parentKey
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i]
    if (node.children) {
      if (node.children.some((item) => item.key === key)) {
        parentKey = node.key
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children)
      }
    }
  }
  return parentKey
}

export default {
  name: 'quality-management_parameter-term',
  components: {
    AddForm
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
      loadedKeys:[],
      searchValue: '',
      autoExpandParent: true,

      loading: false,
      queryParam: {},
      pagination: {
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: (total) => `共有 ${total} 条数据`, //分页中显示总的数据
        onShowSizeChange: this.onShowSizeChangeHandler,
      },
      spinning:false,
    }
  },
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'quality-management_parameter-term') {
          this.init()
        }
      },
      immediate: true,
    },
  },
  computed: {

  },
  methods: {
    onExpand(expandedKeys) {
      console.log(arguments)
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
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
        ruleId: +this.parentId === 0 ? undefined : this.parentId,
      }
      this.fetchTree()
      this.search()

      this.$nextTick(() => {
        this._ResizeColumnInstance = new ResizeColumn()
      })
    },
    onLoadData(treeNode ,isForceRefresh = false) {
      const that = this
      // that.selectedTreeNode = treeNode
      return new Promise((resolve) => {
        // if (!isForceRefresh && treeNode.dataRef.children) {
        //   treeNode.dataRef.isLeaf = true
        //   treeNode.dataRef.children = []
        //   that.selectedTreeNode = treeNode
        //   that.orgTree = [...that.orgTree]
        //   that.dataList = that.generateList(that.orgTree)
        //   resolve()
        //   return
        // }
        checkParameterTermList({ parentId: treeNode.dataRef.value })
          .then(res => {
            if(res && res.code === 200 && Array.isArray(res.data) && res.data.length > 0){
              // let oldChildren = [...(treeNode.dataRef.children || [])]
              // let newChildren = res.data.map(item => that.formatTreeData(item))
              // let children = that.margeNode(oldChildren, newChildren)

              let children = res.data.map(item => that.formatTreeData(item))
              treeNode.dataRef.isLeaf = false
              treeNode.dataRef.children = children
              that.selectedTreeNode = treeNode
              that.orgTree = [...that.orgTree]
              that.dataList = that.generateList(that.orgTree)
            }else{
              treeNode.dataRef.isLeaf = true
              treeNode.dataRef.children = []
              that.selectedTreeNode = treeNode
              that.orgTree = [...that.orgTree]
              that.dataList = that.generateList(that.orgTree)
            }
            resolve()
          })
          .catch((err) => {
            that.$message.error(err.message)
            resolve()
            return
          })
      })
    },
    margeNode(oldChildren, newChildren) {
      let arr = []
      for (let i = 0; i < newChildren.length; i++) {
        let newNode = newChildren[i]
        let oldNode = oldChildren.find((node) => node.value === newNode.value)
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
      that.modelType = 1
      that.spinning = true
      that.dataSource = []
      that.selectedRowKeys = []
      that.selectedRows = []
      that.loadedKeys = []
      checkParameterTermList({ parentId: 0 })
        .then((res) => {
          that.spinning = false
          if(+res.code !== 200){
            that.$message.info(res.msg)
            return
          }
          const root = {
            key: '0',
            value: '0',
            title: '参数配置',
            isLeaf: false,
            parentId: 0,
            children: res.data.map((item) => that.formatTreeData(item)),
          }
          that.orgTree = [root]
          that.dataList = that.generateList(that.orgTree)
          that.selectedTreeNode = {
            dataRef:{
              ...root
            }
          }

          if (String(that.parentId) === '0') {
            that.parentItem = root
          }
          Object.assign(that, {
              expandedKeys:['0'],
              autoExpandParent: true,
            })
        })
        .catch((err) => {
          that.spinning = false
          that.$message.error(`调用接口[routineMaterialRulePageTreeList]时发生错误，错误信息:${err}`)
        })
    },


    search(params = {}) {
      const that = this
      let paginationParam = {
        current: that.pagination.current || 1,
        size: that.pagination.pageSize || 10,
        parentId:that.parentId
      }
      that.loading = true
      let _searchParam = Object.assign({}, { ...that.queryParam }, paginationParam, params)
      checkParameterTermPageList(_searchParam)
        .then((res) => {
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

      obj.title = item.termName
      obj.value = String(item.id)
      obj.parentId = item.parentId
      if (Array.isArray(item.children) && item.children.length > 0) {
        obj.children = item.children.map((v) => that.formatTreeData(v))
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
      that.queryParam = { ...that.queryParam, ruleId: +parentId === 0 ? undefined : parentId }
      that.parentId = parentId
      that.parentItem = { ...dataRef }

      that.selectedRowKeys = []
      that.selectedRows = []
      that.search()
    },
    async doAction(type, record={}) {
      const that = this
      if(['add','edit'].includes(type)){
        that.$refs['addForm'].query(type,{record:{...record},node:{...that.parentItem}})
        return
      }else if(type === 'delete'){
        checkParameterTermDelete(`id=${record.id}`).then(res => {
          if(res.code === 200){
            that.handleOk()
          }else{
            that.$message.error(res.msg)
            return
          }
        }).catch(err => {
          that.$message.error(err.message)
        })
        return
      }
    },
    handleOk(){
      if(this.selectedTreeNode){
        let target = this.findTreeNode(this.$refs.treeRef, this.selectedTreeNode.dataRef.key)
        if (target) {
          this.onLoadData(target, true)
        }
      }else{
        this.fetchTree()
      }
      this.search()
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
  },
  beforeDestroy() {
    if (this._ResizeColumnInstance) {
      this._ResizeColumnInstance.destory()
      this._ResizeColumnInstance = null
    }
  },
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

