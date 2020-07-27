<template>
<!-- 图纸管理 -->
  <a-card :bordered="false">
    <a-row :gutter="24">
      <a-col :span="4">
        <div class="menu-tree-list-wrapper" style="width:100%;overflow:auto;box-shadow: 7px 0px 7px -7px #ddd;height: 600px;">
          <a-tree 
            :treeData="orgTree" 
            :replaceFields="replaceFields" 
            :defaultExpandedKeys="[0,1,3]"
            @select="handleClick" 
            :showLine="true"
          />
        </div>
      </a-col>
      <a-col :span="20">
        <div class="search-wrapper">
          <a-input placeholder="名称" v-model="searchParam.name" allowClear style="width:160px;margin-right:10px;" />
          <a-input placeholder="代码" v-model="searchParam.code" allowClear style="width:160px;margin-right:10px;" />
          <a-input placeholder="备注信息" v-model="searchParam.remark" allowClear style="width:160px;margin-right:10px;;" />

          <a-button style="position:relative;top:-1px;" class="a-button" type="primary" icon="search" @click="searchAction({current:1})">查询</a-button>
          <a-button style="float:right;" type="primary" icon="plus" @click="doAction('add',null)">新增</a-button>
        </div>
        <div class="main-wrapper">
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

            <div slot="stationNames" slot-scope="text, record, index" style="text-align:center;">
              <div class="__station_names">{{text}}</div>
            </div>

            <div class="action-btns" slot="action" slot-scope="text, record">
              <a type="primary" @click="doAction('view',record)">查看</a>
              <a-divider type="vertical" />
              <a type="primary" @click="doAction('edit',record)">修改</a>
              <a-divider type="vertical" />
              <a type="primary" @click="doAction('back',record)">反馈记录</a>
              <a-divider type="vertical" />
              <a-popconfirm title="是否要删除此行？" @confirm="doAction('del',record)">
                <a>删除</a>
              </a-popconfirm>
            </div>
          </a-table>
        </div>
      </a-col>
    </a-row>

  </a-card>
</template>

<script>
import {
  blueprintMenuTreeList,
  blueprintMenuPageList,
  blueprintMenuDetail,
  blueprintMenuDel,
  blueprintMenuAddOrUpdate
} from '@/api/researchManagement'

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
    title: '名称',
    dataIndex: 'title'
  },
  {
    align: 'center',
    title: '备注',
    dataIndex: 'type'
  },
  {
    align: 'center',
    title: '操作',
    dataIndex: 'id',
    width: '150px',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'research-managements-drawing-managements-management',
  components: {

  },
  data () {
    return {
      searchParam:{},
      columns: columns,
      dataSource: [],
      pagination: {
        current: 1
      },
      loading: false,
      userInfo: this.$store.getters.userInfo, // 当前登录人
      superiorId: 0, // 父id

      orgTree: [],
      selectedRowKeys: [],
      selectedRows: [],
      replaceFields:{
        key:'id',
        title:'menuName',
        children:'subList'
      },

      currentItem:null, //当前选择的项
    }
  },
  watch: {
    $route: {
      handler: function(to, from) {
        if (to.name === 'research-managements-drawing-managements-management') {
          this.init()
        }
      },
      immediate: true
    }
  },
  created () {
    
  },
  methods: {
    init(){
      this.initTreeData()
      this.searchAction()
    },
    initTreeData(){
      return blueprintMenuTreeList({superiorId:this.superiorId}).then(res => {
        this.orgTree = [res.data]
      })
    },
    searchAction(opt = {}) {
      let that = this
      let _searchParam = Object.assign({}, { ...this.searchParam }, { ...this.pagination }, opt)
      that.loading = true
      blueprintMenuPageList(_searchParam)
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
        .catch(err => (that.loading = false))
    },
    // 分页
    handleTableChange(pagination, filters, sorter) {
      console.log(pagination, filters, sorter)
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.searchAction({ current: pagination.current })
    },
    handleClick (selectedKeys,nodes) { // 点击树结构菜单
      this.currentItem = Object.assign({},nodes.node.dataRef)

      console.log(arguments)
      this.searchAction({
        current:1,
        superiorId:this.currentItem.id
      })
    },
    del (row) {
      const _this = this
      this.$confirm({
        title: '警告',
        content: `真的要删除 ${row.title} 吗?`,
        okText: '删除',
        okType: 'danger',
        cancelText: '取消',
        onOk () {
          // 在这里调用删除接口
          blueprintMenuDel(`id=${row.id}`).then(res => {
            if (res.code === 200) {
              // _this.$refs.table.refresh(true)
              // _this.$nextTick(() => {
              //   routeTreeList().then(res => {
              //     _this.orgTree = res.data
              //   })
              // })
            } else {
              _this.$message.error(res.msg)
            }
          })
        }
      })
    }
  }
}
</script>


