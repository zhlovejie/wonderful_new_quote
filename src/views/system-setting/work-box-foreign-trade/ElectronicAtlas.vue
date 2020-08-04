<template>
  <a-card :bordered="false">
    <div class="description-document-search-wrapper">
      <a-form layout="inline">
        <a-form-item label="名称">
          <a-input v-model.trim="queryParam.fileName" placeholder="根据名称模糊查询" :allowClear="true" />
        </a-form-item>
        <template v-if="$auth('document:list')">
          <a-form-item>
            <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
          </a-form-item>
        </template>
        <div class="action-wrapper" style="float:right;">
          <a-form-item>
            <template v-if="$auth('synopsis:add')">
              <a-button type="primary" icon="plus" @click="handleAction('add',null)">新增</a-button>
            </template>
          </a-form-item>
        </div>
      </a-form>
    </div>
        <s-table
          ref="table"
          size="default"
          rowKey="id"
          :columns="columns"
          :data="loadData"
          :alert="false"
        >
          <div slot="order" slot-scope="text, record, index">
            <span>{{ index + 1 }}</span>
          </div>
          <span slot="action" slot-scope="text, record">
            <template v-if="$auth('synopsis:one')">
              <a target="_blank" :href="viewFormat(record)">预览</a>
            </template>
            <template v-if="$auth('synopsis:edit')">
              <a-divider type="vertical"/>
              <a @click="handleAction('edit',record)">编辑</a>
            </template>
            <template v-if="$auth('synopsis:del')">
              <a-divider type="vertical"/>
              <a-popconfirm title="确认删除该条数据吗?" @confirm="handleAction('del',record)">
                <a href="javascript:;">删除</a>
              </a-popconfirm>
            </template>
          </span>
        </s-table>
    <!-- <modal ref="modal" @ok="handleSaveOk" @close="handleSaveClose"/>
    <modal ref="editModal" @ok="handleSaveOk" @close="handleSaveClose"/>
    <preview ref="preview" @ok="handleSaveOk"/> -->
    <ToolBoxCommonUploadForm ref="toolBoxCommonUploadForm" @ok="handleSaveOk"/>
  </a-card>
</template>

<script>
//import { getEnterpriseSynopsisList, delInformation } from '@/api/enterpriseInformation'

import { getFileManagementList, downloadFile, delFileManagement } from '@/api/OperationalScheme'

import { STable } from '@/components'
//import Modal from '../modules/Synopsis'
//import Preview from '../modules/SynopsisPreview'
import ToolBoxCommonUploadForm from '@/views/system-setting/work-box/modules/ToolBoxCommonUploadForm'


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
    dataIndex: 'fileName'
  },
  {
    align: 'center',
    title: '操作人',
    dataIndex: 'modifierName'
  },
  {
    align: 'center',
    title: '操作时间',
    dataIndex: 'modifierTime'
  },
  {
    align: 'center',
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }]

export default {
  name: 'EnterpriseSynopsis',
  components: {
    STable,
    //Modal,
    //Preview,
    ToolBoxCommonUploadForm
  },
  data () {
    return {
      selectedRowKeys: [],
      selectedRows: [],
      // 查询参数
      queryParam: {
        type:4,
        toolType:1
      },
      // 表头
      columns: columns,
      // 初始化加载 必须为 Promise 对象
      loadData: parameter => {
        return getFileManagementList(Object.assign(parameter, this.queryParam))
          .then(res => {
            return res
          }).catch(error => {
            this.loading = false
            console.error(error)
          })
      }
    }
  },
  methods: {
    handleAction(type,record){
      const that = this
      if(['add','edit'].includes(type)){
        let _record = record ? {
          id:record.id,
          fileName:record.fileName,
          fileUrl:record.fileUrl
        } : {}
        that.$refs.toolBoxCommonUploadForm.query(type,_record,4,1)  
      }else if(type === 'del'){
        delFileManagement({ 'id': record.id }).then(data => {
          if (data.code == 200) {
            that.$message.success('删除成功')
            that.$refs.table.refresh(true)
          } else {
            that.$message.error(data.msg)
          }
        }).catch((err) => {
          console.log(err)
        })
      }
    },
    handleSaveOk () {
      this.$refs.table.refresh(true)
    },
    handleSaveClose () {

    },
    handleEditOk () {
      this.$refs.table.refresh(true)
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      console.log('onSelectChange 点击了')
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    viewFormat(record){
      let url = record.fileUrl
      let isWord = url => ['.doc','.docx','.xls','.xlsx'].some(suffix => url.endsWith(suffix))
      let isPdf = url => url.endsWith('.pdf')
      let isImage = url => ['.png','.jpg','jpeg','.gif','.bmp'].some(suffix => url.endsWith(suffix))
      if(url){
        if(isPdf(url) || isImage(url)){
          return url
        }else if(isWord){
          return `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(url)}`
        }
      }
      return '#'
    }
  }
}
</script>

<style scoped>

</style>
