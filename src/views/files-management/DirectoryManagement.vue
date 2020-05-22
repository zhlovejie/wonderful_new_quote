<template>
  <div class="dir-wrapper">
    <div class="dir-header">
      <h3><a-icon type="folder" /><span style="margin-left:10px;">{{dir.dirName}}</span></h3>
      <div class="dir-option-wrapper" v-if="$auth('files-management-list:addFile') || $auth('files-management-list:delDir')">
        <a-dropdown>
          <a-menu slot="overlay" @click="handleMenuClick">
            <a-menu-item key="add" v-if="$auth('files-management-list:addFile')">
              <a-icon type="plus" />添加文件
            </a-menu-item>
            <a-menu-item key="clear" v-if="$auth('files-management-list:delDir')">
              <a-icon type="close" />删除文件夹
            </a-menu-item>
          </a-menu>
          <a-button type="link"><a-icon type="menu" /></a-button>
        </a-dropdown>
        <!-- <a-button v-if="$auth('files-management-list:addFile')"  icon="plus" @click="doAction('add')" >添加文件</a-button>
        <a-button v-if="$auth('files-management-list:delDir')" style="margin-left:10px;"  icon="close" @click="doAction('clear')" >删除文件夹</a-button> -->
      </div>
    </div>
    <div class="dir-body">
      <div class="dir-search-wrapper">
        <a-form layout="inline">
          <a-form-item>
            <a-input
              v-model="fileName"
              style="width:200px;"
              placeholder="文件名模糊查询"
              :allowClear="true"
            />
          </a-form-item>
          <a-form-item>
            <a-button
              class="a-button"
              icon="search"
              @click="searchAction({current:1})"
            >查询</a-button>
          </a-form-item>
        </a-form>
      </div>
      <div class="dir-main-wrapper">
        <a-table
          :columns="columns" 
          :dataSource="dataSource"
          :pagination="pagination"
          :loading="loading"
          @change="handleTableChange"
          size="small"
        >
          <div slot="action" slot-scope="text, record">
            <template v-if="$auth('files-management-list:viewFile')">
              <a type="primary" @click="doAction('view',record)">查看</a>
            </template>
            <template v-if="$auth('files-management-list:downloadFile')">
              <a-divider type="vertical" />
              <a target="_blank" :href="record.filePath">下载</a>
            </template>
            <template v-if="$auth('files-management-list:editFile')">
              <a-divider type="vertical" />
              <a type="primary" @click="doAction('edit',record)">修改</a>
            </template>
            <template v-if="$auth('files-management-list:delFile')">
              <a-divider type="vertical" />
              <a-popconfirm title="是否要删除此行？" @confirm="doAction('del',record)">
                <a href="javascript:void(0);">删除</a>
              </a-popconfirm>
            </template>
          </div>
        </a-table>
      </div>
    </div>
    <AddFile ref="addFile" @finish="searchAction({current:1})" />
    <XdocView ref="xdocView" />
  </div>
</template>
<script>
import { docDirDelete, docFileList, docFileDelete } from '@/api/files-management'
import AddFile from './AddFile'
import XdocView from './XdocView'
const columns = [
  {
    title: '文件名',
    dataIndex: 'fileName'
  },
  {
    align: 'center',
    title: '操作',
    scopedSlots: { customRender: 'action' },
    width:180
  }
]
export default {
  name: 'DirectoryManagement',
  components: {
    AddFile,
    XdocView
  },
  props: {
    dir: {
      type: Object,
      default() {
        return {
          fileList: []
        }
      }
    }
  },
  data() {
    return {
      columns: columns,
      pagination: {
        current: 1,
        defaultPageSize:5
      },
      loading: false,
      fileName: undefined,
      dataSource: []
    }
  },
  computed: {
    searchParam() {
      return {
        dirId: this.dir.id || undefined,
        userId: this.dir.userId || undefined,
        fileName: this.fileName
      }
    }
  },
  mounted() {
    this.searchAction()
  },
  methods: {
    searchAction(opt) {
      let that = this
      let _searchParam = Object.assign({}, { ...this.searchParam }, { ...this.pagination },{size:5}, opt || {})
      console.log('执行搜索...', _searchParam)
      that.loading = true
      docFileList(_searchParam)
        .then(res => {
          that.loading = false
          that.dataSource = res.data.records.map((item, index) => {
            item.key = index + 1
            return item
          })
          //设置数据总条数
          const pagination = { ...that.pagination }
          pagination.total = res.data.total
          pagination.current = res.data.current
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
      this.searchAction()
    },
    doAction(type, record) {
      let that = this
      if (type === 'del') {
        docFileDelete(`id=${record.id}`).then(res => {
          that.$message.info(res.msg)
          if (res.code === 200) {
            that.searchAction()
          }
        })
        return
      }
      if (type === 'clear') {
        if (this.dataSource.length > 0) {
          that.$message.info('不能删除非空目录')
          return
        }
        this.$confirm({
          title: '警告',
          content: `确定要删除此文件夹吗?`,
          okText: '确定',
          cancelText: '取消',
          onOk() {
            console.log('OK')
            docDirDelete(`dirId=${that.dir.id}`).then(res => {
              that.$message.info(res.msg)
              if (res.code !== 200) {
                return
              }
              that.$emit('finish')
            })
          },
          onCancel() {
            console.log('Cancel')
          }
        })
        return
      }
      if (type === 'add' || type === 'edit' ) {
        that.$refs.addFile.query(type, {
          dir: { ...that.dir },
          record: { ...(record || {}) }
        })
        return
      }
      if(type === 'view'){
        that.$refs.xdocView.query(record.filePath)
        return
      }
    },
    handleMenuClick(event){
      this.doAction(event.key)
    }
  }
}
</script>
<style scoped>
.dir-wrapper {
  padding: 20px 20px 0 20px;
  margin-top: 24px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0 0 10px 0 rgba(34, 58, 156, 0.07);
  border-radius: 2px;
  border: 1px solid rgba(231, 233, 234, 1);
}
.dir-wrapper .dir-header {
  position: relative;
  line-height: 40px;
  border-bottom: 1px solid #ddd;
}
.dir-wrapper .dir-header .dir-option-wrapper {
  position: absolute;
  top: 0;
  right: 0;
}
.dir-wrapper .dir-body {
  margin-top: 0;
}
.dir-wrapper .dir-main-wrapper {
  height: 295px;
  min-height: 295px;
  max-height: 295px;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>