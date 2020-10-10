<template>
  <!-- 图纸权限管理 -->
  <div class="wdf-custom-wrapper">
    <div class="search-wrapper">
      <a-input placeholder="名称" v-model="searchParam.fileName" allowClear style="width:160px;margin-right:10px;" />
      <a-input placeholder="代码" v-model="searchParam.productCode" allowClear style="width:160px;margin-right:10px;" />
      <a-input placeholder="图号" v-model="searchParam.pictureNum" allowClear style="width:160px;margin-right:10px;" />
      <a-input placeholder="提交人" v-model="searchParam.createdName" allowClear style="width:160px;margin-right:10px;" />
      <a-input placeholder="备注信息" v-model="searchParam.remark" allowClear style="width:160px;margin-right:10px;;" />

      <a-button class="a-button" type="primary" icon="search" @click="searchAction({current:1})">查询</a-button>
      <!-- <a-button v-if="!globalSearch" style="float:right;" type="primary" icon="plus" @click="doAction('add',null)">新增</a-button> -->
      <a-button v-if="$auth('blueprintFile:add')" style="float:right;" type="primary" icon="plus" @click="doAction('add',null)">新增</a-button>
    </div>
    <div class="main-wrapper">
      <div style="margin-bottom: 16px" v-if="$auth('blueprintFile:delete')">
        <a-button type="primary" :disabled="!hasSelected" @click="doAction('deleteBatch')">
          批量删除
        </a-button>
        <a-button style="margin-left: 15px" type="primary" :disabled="!hasSelected" @click="doAction('downloadBatch')">
          批量下载
        </a-button>
        <span style="margin-left: 15px">
          <template v-if="hasSelected">
            {{ `已选择 ${selectedRowKeys.length} 项` }}
          </template>
        </span>
      </div>
      <a-table
        :columns="columns"
        :dataSource="dataSource"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange" 
        size="middle" 
        :customRow="customRowFunction" 
        :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      >
        <div slot="order" slot-scope="text, record, index">
          <span>{{ index + 1 }}</span>
        </div>
        <div slot="fileType" slot-scope="text, record, index">
          <span>{{ {1:'研发图纸',2:'工艺图纸'}[text] }}</span>
        </div>
        <div slot="remark" slot-scope="text, record, index">
          <a-tooltip v-if="String(text).length > 10">
            <template slot="title">{{text}}</template>
            {{ String(text).slice(0,10) }}...
          </a-tooltip>
          <span v-else>{{text}}</span>
        </div>

        <div slot="createdTime" slot-scope="text, record, index">
          <div>创建时间：{{text}}</div>
          <div v-if="record.modifyTime">修改时间：{{record.modifyTime}}</div>
        </div>
        
        <div class="action-btns" slot="action" slot-scope="text, record" @click.stop="(e) =>{/*防止触发 rowclick 事件*/}">
          <!-- <a type="primary" @click="doAction('view',record)">查看</a> -->
          <a v-if="$auth('blueprintFile:detail')" type="primary" target="_blank" :href="record.fileUrl" >查看</a>
          <a-divider type="vertical" />
          <a v-if="$auth('blueprintFile:update')" type="primary" @click="doAction('edit',record)">修改</a>
          <a-divider type="vertical" />
          <a type="primary" @click="doAction('back',record)">反馈记录</a>

          <template v-if="+record.createdId === +userInfo.id">
          <a-divider type="vertical" />
          <!-- v-if="$auth('blueprintFile:delete')" -->
          <a-popconfirm v-if="$auth('blueprintFile:delete')"  title="是否要删除此行？" @confirm="doAction('del',record)">
            <a>删除</a>
          </a-popconfirm>
          </template>
        </div>
      </a-table>
    </div>

    <AddForm ref="addForm" @finish="() => { searchAction() }" />
    <DisposeForm ref="disposeForm" />
    <XdocView ref="xdocView" />
  </div>
</template>

<script>

import {
  blueprintFileAdd,
  blueprintFilePageList,
  blueprintFileDetail,
  blueprintFileDel,
  blueprintFileAddOrUpdate,
  blueprintFileDeleteBatch,
  duplicateCheck,
  blueprintFileDownloadZip
} from '@/api/researchManagement'
import AddForm from './AddForm'
import DisposeForm from './DisposeForm'
import XdocView from './XdocView'
import moment from 'moment'
import { downloadFile } from '@/api/OperationalScheme'


const columns = [
  {
    title: '序号',
    key: 'order',
    scopedSlots: { customRender: 'order' }
  },
  {
    title: '名称',
    dataIndex: 'fileName'
  },
  {
    title: '代码',
    dataIndex: 'productCode'
  },
  {
    title: '图号',
    dataIndex: 'pictureNum'
  },
  {
    title: '类型',
    dataIndex: 'fileType',
    scopedSlots: { customRender: 'fileType' }
  },
  {
    title: '备注',
    dataIndex: 'remark',
    scopedSlots: { customRender: 'remark' }
  },
  {
    title: '提交人',
    dataIndex: 'createdName'
  },
  {
    title: '时间',
    dataIndex: 'createdTime',
    scopedSlots: { customRender: 'createdTime' }
  },
  {
    title: '操作',
    dataIndex: 'id',
    scopedSlots: { customRender: 'action' }
  }
]


export default {
  name: 'drawing-managements-management-level-3',
  components: {
    AddForm,
    DisposeForm,
    XdocView
  },
  props:{
    params:{
      type:Object,
      default:() =>{
        return {
          id:0,
          type:0,
          superiorId:0,
          menuName:'图纸管理'
        }
      }
    },
    globalSearch:{
      type:Boolean,
      default:false
    }
  },
  data() {
    return {
      searchParam:{},
      columns: columns,
      dataSource: [],
      pagination: {
        current: 1,
        size:"middle"
      },
      loading: false,
      userInfo: this.$store.getters.userInfo, // 当前登录人
      inputParam:{},
      selectedRowKeys:[],
      selectedRows:[]
    }
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0;
    },
  },
  watch:{
    params(val){
      this.init()
    }
  },
  created(){
    this.init()
  },
  methods: {
    moment,
    init() {
      this.selectedRowKeys = []
      this.inputParam = Object.assign({},this.params)
      let {id,superiorId} = this.inputParam
      if(this.globalSearch){
        this.searchParam = Object.assign({},this.searchParam,{
          menuId:undefined,
          permissionId:undefined
        })
      }else{
        this.searchParam = Object.assign({},this.searchParam,{
          menuId:superiorId,
          permissionId:id
        })
      }
      this.searchAction({current:1})
    },
    searchAction(opt = {}) {
      let that = this
      let pagination = {...this.pagination}
      delete pagination.size
      let _searchParam = Object.assign({}, { ...this.searchParam }, pagination, opt)
      console.log('执行搜索...', _searchParam)
      that.loading = true
      blueprintFilePageList(_searchParam)
        .then(res => {
          that.loading = false
          that.dataSource = res.data.records.map((item, index) => {
            item.key = item.id
            return item
          })
          //设置数据总条数
          const pagination = { ...that.pagination }
          pagination.total = res.data.total || 0
          pagination.current = res.data.current || 1
          that.pagination = pagination
          //有两页数据,第二页只有一条数据,删除第二页的一条数据了,界面显示在第一页,但是不显示第一页数据了
          //刷新也不显示数据
          let {current,pages} = res.data
          if(current > pages){
            that.pagination = {...pagination,current:pages}
            that.searchAction()
          }
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
    customRowFunction(record,index){
      let that = this
      return {
        on:{
          click:(event)=>{
            //console.log(record)
            that.$emit('rowhover',Object.assign({},record))
          }
        }
      }
    },
    doAction(actionType, record={}) {
      let that = this
      if(['add','edit'].includes(actionType)){
        that.$refs.addForm.query(actionType, {
          params:{...that.inputParam},
          record:{...record}
        })
      }else if(actionType === 'view'){
        that.$refs.xdocView.query(record.fileUrl)
        return 
      } 
      else if (actionType === 'del') {
        let node = that.findNode(that.inputParam,record.id)
        if(node && Array.isArray(node.subList) && node.subList.length > 0){
          that.$message.info('该目录下有文件，无法执行删除操作')
          return
        }
        blueprintFileDel(`id=${record.id}`)
          .then(res => {
            that.$message.info(res.msg)
            that.searchAction()
            that.$emit('finish')
          })
          .catch(err => {
            that.$message.info(`错误：${err.message}`)
          })
      } else if(actionType === 'back'){
        that.$refs.disposeForm.query(actionType,record)
      } else if(actionType === 'deleteBatch'){
        that.$confirm({
          title: '警告',
          content: `确定要删除已选择文件吗?`,
          okText: '确定',
          okType: 'danger',
          cancelText: '取消',
          onOk () {
            blueprintFileDeleteBatch(`ids=${that.selectedRowKeys.join(',')}`)
            .then(res => {
              that.$message.info(res.msg)
              that.searchAction()
              that.selectedRowKeys = []
              that.selectedRows= []
              //that.$emit('finish')
            })
            .catch(err => {
              that.$message.info(`错误：${err.message}`)
            })
          },
          onCancel () {}
        })

        return
      }else if(actionType === 'downloadBatch'){

        blueprintFileDownloadZip({ids:that.selectedRows.map(r => r.id).join(',')}).then(res =>{
          console.log(res)
          if (res instanceof Blob) {
            const isFile = res.type === 'application/msword'
            const isJson = res.type === 'application/json'
            if (isFile) {
              //返回文件 则下载
              const objectUrl = URL.createObjectURL(res)
              const a = document.createElement('a')
              document.body.appendChild(a)
              a.style = 'display: none'
              a.href = objectUrl
              a.download = '图纸.zip'
              a.click()
              document.body.removeChild(a)
              that.$message.info('下载成功')
              return
            } else if (isJson) {
              //返回json处理
              var reader = new FileReader()
              reader.onload = function(e) {
                let _res = null
                try {
                  _res = JSON.parse(e.target.result)
                } catch (err) {
                  _res = null
                }
                if (_res !== null) {
                  if (_res.code !== 0) {
                    that.$message.info(_res.message)
                  } else {
                    that.$message.info('下载成功')
                  }
                } else {
                  that.$message.info('json解析出错 e.target.result：' + e.target.result)
                  return
                }
              }
              reader.readAsText(res)
            } else {
              that.$message.info('不支持的类型:' + res)
            }
          }
        })
        // let selectedRows = that.selectedRows
        // for (let j = 0; j < selectedRows.length; j++) {
        //   const url = selectedRows[j].fileUrl
        //   downloadFile(url)
        // }
        return
      }
      else {
        this.$message.info('功能尚未实现！')
      }
    },
    findNode(node, id) { //查找指定ID的节点
      let res = null
      let fNode = (obj) => {
        if (obj.id === id) {
          return obj
        }
        if (obj && obj.subList) {
          for (let i = 0, len = obj.subList.length; i < len; i++) {
            res = fNode(obj.subList[i])
            if(res !== null){
              return res
            }
          }
        }
        return null
      }
      return fNode(node)
    },
    onSelectChange(selectedRowKeys,selectedRows) {
      //console.log('selectedRowKeys changed: ', selectedRowKeys);
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    }
  }
}
</script>

<style scoped>
.wdf-custom-wrapper {
  background-color: #fff;
  padding: 10px 20px;
}
.wdf-custom-wrapper .search-wrapper * {
  margin: 10px 15px 0 0;
}
.main-wrapper {
  margin-top: 20px;
}

</style>
