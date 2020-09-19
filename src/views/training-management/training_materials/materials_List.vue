<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper" style="margin-bottom: 20px;">
      <!-- <a-month-picker style="width:300px;" v-model="queryParam.Dates" /> -->
      <a-input
        placeholder="名称"
        v-model="queryParam.folderName"
        allowClear
        @keydown.native.stop="handleKeyDown"
        style="width: 200px;margin-right:10px;"
      />
      <a-input
        placeholder="备注信息"
        v-model="queryParam.remark"
        allowClear
        @keydown.native.stop="handleKeyDown"
        style="width: 200px;margin-right:10px;"
      />
      <a-button style="margin-left:10px;" type="primary" @click="searchAction()">查询</a-button>
      <template>
        <template v-if="fold">
          <a-button
            style="float:right;  margin-right:10px;"
            type="primary"
            @click="gohandle()"
          >&lt;返回</a-button>
          <a-button
            style="float:right; margin-right:10px;"
            type="primary"
            icon="plus"
            @click="fileAdd('add',{Id:pagination.folderId ,name:folderNa||''})"
          >新增文件</a-button>
        </template>
        <a-button
          style="float:right; margin-right:10px;"
          type="primary"
          icon="plus"
          @click="handleAdd('add',{Id:pagination.folderId ,name:folderNa||'',type:authority})"
        >新增文件夹</a-button>
      </template>
    </div>
    <a-layout>
      <!--  此处编写表单中的功能按钮    -->
      <a-table
        :columns="columns"
        :data-source="dataSource"
        :pagination="pagination"
        @change="handleTableChange"
      >
        <div slot="order" slot-scope="text, record, index">
          <span>{{ index + 1 }}</span>
        </div>
        <div slot="orderIocn" slot-scope="text, record, index">
          <template v-if="record.isFileFlag===1">
            <a-icon style="color:#ecc865;font-size:30px;" type="folder-open" theme="filled" />
          </template>
          <template v-else>
            <a-icon style="color:#ecc865;font-size:30px;" theme="filled" type="file" />
          </template>
        </div>

        <div slot="folderName" slot-scope="text, record, index">
          <template v-if="record.isFileFlag===1">
            <a @click="folderName(record)">{{record.folderName}}</a>
          </template>
          <template v-else>
            <span>{{record.folderName}}</span>
          </template>
        </div>

        <div slot="authorityType" slot-scope="text, record, index">
          <template v-if="record.authorityType===2">
            <span>私密</span>
          </template>
          <template v-else>
            <span>公开</span>
          </template>
        </div>
        <span slot="action" slot-scope="text, record">
          <template v-if="record.isFileFlag===1">
            <a-dropdown>
              <a-menu slot="overlay">
                <a-menu-item key="1" @click="handleMenuClick(1,record)">文件夹</a-menu-item>
                <a-menu-item key="2" @click="handleMenuClick(2,record)">文件</a-menu-item>
              </a-menu>
              <a>
                新增
                <a-icon type="down" />
              </a>
            </a-dropdown>
            <a-divider type="vertical" />
            <template>
              <a
                @click="handleAdd('edit-salary',{deptId:record.deptId,id:record.id,name:folderNa||'',Id:pagination.folderId})"
              >修改</a>
              <a-divider type="vertical" />
              <a-popconfirm
                title="是否确定删除"
                ok-text="确定"
                cancel-text="取消"
                @confirm="confirmDelete(record)"
              >
                <a type="primary">删除</a>
              </a-popconfirm>
            </template>
          </template>
          <template v-else>
            <a @click="doAction(record.fileUrl)">查看</a>
            <a-divider type="vertical" />
            <a class="ant-dropdown-link" :href="record.fileUrl" target="_blank">下载</a>
            <template>
              <a-divider type="vertical" />
              <a
                @click="fileAdd('edit-salary',{deptId:record.deptId,id:record.id,name:folderNa||'',Id:pagination.folderId})"
              >修改</a>
              <a-divider type="vertical" />
              <a-popconfirm
                title="是否确定删除"
                ok-text="确定"
                cancel-text="取消"
                @confirm="confirmDelete(record)"
              >
                <a type="primary">删除</a>
              </a-popconfirm>
              <!-- <a class="ant-dropdown-link" @click="delete_list(record)">删除</a> -->
            </template>
          </template>
        </span>
      </a-table>

      <AddForm ref="addForm" @finish="search" />
      <AppFrom ref="appForm" @finish="search" />
      <XdocView ref="xdocView" />
    </a-layout>
  </a-card>
</template>

<script>
import { materialsList, materialsId, materialsSaveOrRemove, materialsSaveOrDelete } from '@/api/training-management'
import AddForm from './module/AddForm'
import AppFrom from './module/AppFrom'
import XdocView from './module/XdocView'

const columns = [
  {
    dataIndex: 'name',
    title: '序号',
    key: 'name',
    align: 'center',
    scopedSlots: { customRender: 'order' },
  },
  {
    dataIndex: 'orderIocn',
    title: '文件类型',
    key: 'orderIocn',
    align: 'center',
    scopedSlots: { customRender: 'orderIocn' },
  },

  {
    title: '文件名称',
    dataIndex: 'folderName',
    key: 'folderName',
    align: 'center',
    scopedSlots: { customRender: 'folderName' },
  },
  {
    title: '备注',
    dataIndex: 'remark',
    key: 'remark',
    align: 'center',
  },
  {
    title: '提交人',
    dataIndex: 'createdUsername',
    key: 'createdUsername',
    align: 'center',
  },
  {
    title: '提交时间',
    dataIndex: 'createdTime',
    key: 'createdTime',
    align: 'center',
  },
  {
    title: '状态',
    dataIndex: 'authorityType',
    key: 'authorityType',
    align: 'center',
    scopedSlots: { customRender: 'authorityType' },
  },
  {
    title: '修改时间',
    dataIndex: 'modifyTime',
    key: 'modifyTime',
    align: 'center',
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' },
    align: 'center',
  },
]
export default {
  name: 'RoleManagement',
  components: {
    AppFrom,
    XdocView,
    AddForm: AddForm,
  },
  data() {
    return {
      userInfo: this.$store.getters.userInfo, // 当前登录人
      dataSource: [],
      columns,
      parentId: '',
      folderNa: '',
      authority: '',
      fold: false,
      pagination: {
        current: 1,
        folderId: -1,
      },
      queryParam: {},
      hiddenBoolean: false,

      selectedRowKeys: [],
      selectedRows: [],
    }
  },
  // 初始化搜索条件钩子函数
  created() {},
  computed: {},
  watch: {
    pagination: function (val) {
      // debugger
      if (val.folderId === -1) {
        this.fold = false
      } else {
        this.fold = true
      }
    },
    $route: {
      handler: function (to, from) {
        if (to.name === 'training-management_materials') {
          this.init()
        }
      },
      immediate: true,
    },
  },
  methods: {
    init() {
      let that = this
      this.searchAction()
    },

    handleKeyDown(e) {
      let eCode = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode
      if (eCode === 13) {
        //调用对应的方法
        this.searchAction()
      }
    },
    handleMenuClick(e, record) {
      if (e === 1) {
        this.$refs.addForm.query('folder', record)
      } else {
        this.$refs.appForm.query('folder', record)
      }
    },
    //进入下一级
    folderName(record) {
      this.pagination.folderId = record.id
      this.folderNa = record.folderName
      this.authority = record.authorityType
      this.parentId = record.id
      this.searchAction()
    },
    //返回上一级
    gohandle() {
      materialsId({ folderId: this.parentId }).then((res) => {
        this.pagination.folderId = res.data.parentId
        this.parentId = res.data.parentId
        this.searchAction()
      })
    },
    //接收子组件数据
    search(data) {
      this.parentId = data.id
      this.pagination.folderId = data.id
      this.searchAction()
    },
    searchAction(opt) {
      let that = this
      that.loading = true
      let _searchParam = Object.assign({}, { ...this.queryParam }, { ...this.pagination }, opt || {})
      materialsList(_searchParam)
        .then((res) => {
          that.loading = false
          if (res.data.records.length == 0) {
            that.$message.info('当前文件夹下没有文件')
          }
          that.dataSource = res.data.records
            ? res.data.records.map((item, index) => {
                item.key = index + 1
                return item
              })
            : []
          //设置数据总条数
          // that.queryParam.accountDate = ''
          const pagination = { ...that.pagination }
          pagination.total = res.data.total
          that.pagination = pagination
        })
        .catch((err) => (that.loading = false))
    },

    // 分页
    handleTableChange(pagination, filters, sorter) {
      // console.log(pagination, filters, sorter)
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.searchAction()
    },
    confirmDelete(record) {
      let that = this

      console.log('你是要删除')
      console.log(record)

      if (record.isFileFlag === 1) {
        //文件夹删除
        materialsSaveOrRemove(`folderId=${record.id}`).then((res) => {
          if (res.code === 200) {
            this.searchAction()
            that.$message.info(res.msg)
          } else {
            that.$message.error(res.msg)
          }
        })
      } else {
        //文件删除
        materialsSaveOrDelete(`fileId=${record.id}`).then((res) => {
          if (res.code === 200) {
            this.searchAction()
            that.$message.info(res.msg)
          } else {
            that.$message.error(res.msg)
          }
        })
      }
    },
    //文件夹新增 修改
    handleAdd(type, record) {
      this.$refs.addForm.query(type, record)
    },
    // 文件 查看 新增 修改
    fileAdd(type, record) {
      this.$refs.appForm.query(type, record)
    },
    //文件查看
    doAction(idurl) {
      this.$refs.xdocView.query(idurl)
    },
  },
}
</script>

<style lang="less" scoped>
.search {
  margin-bottom: 54px;
}

.fold {
  width: calc(100% - 216px);
  display: inline-block;
}

.operator {
  margin-bottom: 18px;
}

@media screen and (max-width: 900px) {
  .fold {
    width: 100%;
  }
}

.left-tree {
  display: flex;
}

.treewrap {
  margin-right: 24px;
}

.righttab {
  width: 100%;
}
</style>
