<template>
  <div class="file-wrapper">
    <template v-if="dir">
      <DirectoryManagement :dir="dir" :isView="true" @back="doAction('back',null)" />
    </template>
    <template v-else>
      <a-table
        :columns="columns" 
        :dataSource="dirList"
        :pagination="false"
        size="middle"
      >
        <div slot="order" slot-scope="text, record, index">
          <span>{{ index + 1 }}</span>
        </div>
        <div slot="dirName" slot-scope="text, record, index">
          <a-tooltip v-if="String(text).length > 20">
            <template slot="title">{{text}}</template>
            {{ String(text).slice(0,20) }}...
          </a-tooltip>
          <span v-else>{{text}}</span>
        </div>
        <div slot="action" slot-scope="text, record, index">
          <a href="javascript:void(0);" @click="doAction('view',record)">进入</a>
        </div>
      </a-table>
    </template>
  </div>
</template>

<script>
import { docDirList } from '@/api/files-management'
import DirectoryManagement from '@/views/files-management/DirectoryManagement' 
const columns = [
  {
    title: '序号',
    scopedSlots: { customRender: 'order' },
    width:60
  },
  {
    title: '文件夹名称',
    dataIndex: 'dirName',
    scopedSlots: { customRender: 'dirName' },
  },
  {
    align: 'center',
    title: '操作',
    scopedSlots: { customRender: 'action' },
    width:80
  }
]
export default {
  name:'CommonFiles',
  components:{
    DirectoryManagement
  },
  data(){
    return {
      dirList:[],
      dir:null,
      columns
    }
  },
  created(){
    this.init()
  },
  methods:{
    init() {
      let that = this
      docDirList().then(res => (that.dirList = res.data))
    },
    doAction(type,dir){
      if(type === 'view'){
        this.dir = dir
        return
      }
      if(type === 'back'){
        this.dir = null
        return
      }
    }
  }
}
</script>
<style>
.file-wrapper .dir-wrapper{
  margin-top: 0;
  border: none;
  box-shadow: none;
  padding: 0;
}

.file-wrapper .dir-wrapper .dir-main-wrapper {
  /* height: 335px; */
  height: auto;
  min-height: auto;
  max-height: 335px;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>

<style lang="less" scoped>
  .file-wrapper {
    .file-render-item{
      display: flex;
      line-height: 40px;
      .file-render-item_bd{
        flex: 1;
        margin-right: 20px;
        word-break: break-all;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }


</style>