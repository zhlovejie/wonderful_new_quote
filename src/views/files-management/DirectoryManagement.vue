<template>
  <div class="dir-wrapper">
    <div class="dir-header">
      <h3>{{dir.dirName}}</h3>
      <div class="dir-option-wrapper">
        <a-button type="primary" icon="plus" @click="doAction('upload')" />
      </div>
    </div>
    <div class="dir-body">
      <div class="dir-search-wrapper">
        <a-form layout="inline">
          <a-form-item >
            <a-input v-model="fileName" style="width:200px;"  placeholder="文件名模糊查询" :allowClear="true" />
          </a-form-item>
          <a-form-item>
            <a-button class="a-button" type="primary" icon="search" @click="searchAction({current:1})">查询</a-button>
          </a-form-item>
        </a-form>
      </div>
      <div class="dir-main-wrapper" @click="doAction('clear')">
        <a-table
          :columns="columns"
          :dataSource="dataSource"
          :pagination="pagination"
          :loading="loading"
          @change="handleTableChange"
          size="small"
        >
          <div slot="action" slot-scope="text, record">
            <a type="primary" @click="doAction('view',record)">预览</a>
            <a-divider type="vertical" />
            <a type="primary" @click="doAction('edit',record)">修改</a>
            <a-divider type="vertical" />
            <a-popconfirm title="是否要删除此行？" @confirm="doAction('del',record)">
              <a href="javascript:void(0);">删除</a>
            </a-popconfirm>
          </div>
        </a-table>
      </div>
    </div>
    <AddFile ref="addFile" @finish="searchAction()"/>
  </div>
</template>
<script>
import {docDirDelete,docFileList,docFileDelete} from '@/api/files-management'
import AddFile from './AddFile'
const columns = [
  {
    title: '文件名',
    dataIndex: 'fileName'
  },
  {
    align: 'center',
    title: '操作',
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  name:'DirectoryManagement',
  components:{
    AddFile
  },
  props:{
    dir:{
      type:Object,
      default(){
        return {
          fileList:[]
        }
      }
    }
  },
  data(){
    return {
      columns: columns,
      pagination: {
        current: 1
      },
      loading: false,
      fileName:undefined,
      dataSource:[]
    }
  },
  computed:{
    searchParam(){
      return {
        dirId:this.dir.id || undefined,
        userId:this.dir.userId || undefined,
        fileName:this.fileName
      }
    },
    // dataSource(){
    //   if(this.dir && this.dir.fileList){
    //     return [...this.dir.fileList]
    //   }
    //   return []
    // }
  },
  mounted(){
    this.searchAction()
  },
  methods:{
    searchAction(opt) {
      let that = this
      let _searchParam = Object.assign({}, { ...this.searchParam }, { ...this.pagination }, opt || {})
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
    doAction(type,record){
      let that = this
      if(type === 'view'){
        return
      }
      if(type === 'edit'){
        return
      }
      if(type === 'del'){
        return
      }
      if(type === 'clear'){
        if(this.dataSource.length > 0 ){
          return
        }
        this.$confirm({
          title: '警告',
          content: `确定要删除此文件夹吗?`,
          okText: '确定',
          cancelText: '取消',
          onOk () {
            console.log('OK')
            docDirDelete(`dirId=${that.dir.id}`).then(res =>{
              that.$message.info(res.msg)
              if(res.code !== 200){
                return
              }
              that.$emit('finish')
            })
          },
          onCancel () {
            console.log('Cancel')
          }
        })
        return
      }
      if(type === 'upload'){
        that.$refs.addFile.query(type,Object.assign({},that.dir))
      }
    }
  }
};
</script>
<style scoped>
.dir-wrapper{
  padding: 20px;
  margin-top:24px;
  background: rgba(255,255,255,1);
    box-shadow: 0 0 10px 0 rgba(34,58,156,.07);
    border-radius: 2px;
    border: 1px solid rgba(231,233,234,1);
}
.dir-wrapper .dir-header{
  position: relative;
  line-height: 40px;
  border-bottom: 1px solid #ddd;
}
.dir-wrapper .dir-header .dir-option-wrapper{
  position: absolute;
  top: 0;
  right: 0;
}
.dir-wrapper .dir-body{
  margin-top: 10px;
}
.dir-wrapper .dir-main-wrapper{
  height: 240px;
  min-height: 240px;
  max-height: 240px;
  overflow-x:hidden;
  overflow-y:auto;
}
</style>