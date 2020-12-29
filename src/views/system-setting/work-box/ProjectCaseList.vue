<template>
  <a-card :bordered="false">
    <!--搜索模块-->
    <div class="project-case-list-search-wrapper">
      <a-form layout="inline">
        <a-form-item label="案例名称">
          <a-input :allowClear="true" v-model.trim="queryParam.caseName" placeholder="根据案例名模糊查询" style="width: 100%"/>
        </a-form-item>
        <a-form-item label="小区">
          <a-input :allowClear="true" v-model.trim="queryParam.unitName" placeholder="根据小区名模糊查询" style="width: 100%"/>
        </a-form-item>
        <a-form-item label="录入人">
          <a-input :allowClear="true" v-model.trim="queryParam.createdName" placeholder="根据录入人人名查询" style="width: 100%"/>
        </a-form-item>
        <a-form-item label="备注">
          <a-input :allowClear="true" v-model.trim="queryParam.remark" placeholder="备注模糊查询" style="width: 100%"/>
        </a-form-item>
        <template v-if="$auth('case:list')">
          <a-form-item>
          <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
          <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
          </a-form-item>
        </template>
        <div class="action-wrapper" style="float:right;">
          <a-form-item>
          <template v-if="$auth('case:add')">
            <a-button type="primary" icon="plus" @click="$refs.formModal.add()">新增</a-button>
          </template>
          <template v-if="$auth('case:list')">
            <a-button style="margin-left: 8px" type="primary" icon="download" @click="handleBatchDownload">批量下载</a-button>
          </template>
          </a-form-item>
        </div>

      </a-form>
    </div>

    <s-table
      rowKey="id"
      ref="table"
      size="default"
      :columns="columns"
      :data="loadData"
      :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
    >
      <span slot="serial" slot-scope="text,record,index">
        {{ index + 1 }}
      </span>
      <span slot="action" slot-scope="text,record">
        <template>
          <template v-if="$auth('case:one')">
            <a @click="$refs.previewModal.show(record)">预览</a>
          </template>
          <template v-if="$auth('case:edit')">
            <a-divider type="vertical" />
            <a @click="$refs.formModal.edit(record)">修改</a>
          </template>
          <template v-if="$auth('case:del')">
            <a-divider type="vertical" />
            <a-popconfirm title="确认删除这条数据？" @confirm="confirm(record.id)" okText="是" cancelText="否">
              <a href="#">删除</a>
            </a-popconfirm>
          </template>
        </template>
      </span>
    </s-table>
    <project-case-form ref="formModal" @ok="handleOk" />
    <preview ref="previewModal" @ok="handleOk" />
  </a-card>
</template>

<script>
import { STable } from '@/components'
import ProjectCaseForm from './modules/ProjectCaseForm'
import Preview from './modules/ProjectCaseView'
import { projectCaseList, delProjectCase, dunloadProjectCase ,WorkBoxBatchDownload} from '@/api/workBox'
import system from '@/config/defaultSettings'

export default {
  name: 'ProjectCaseList',
  components: { // 组件
    STable,
    ProjectCaseForm, 
    Preview
  },
  data () {
    return {
      // 查询参数
      queryParam: {},
      //上传文件
      fileList: [],
      selectedRowKeys: [],
      uploading: false,
      // 表头
      columns: [
        {
          title: '序号',
          scopedSlots: { customRender: 'serial' }
        },
        {
          title: '案例名称',
          dataIndex: 'caseName'
        },
        {
          title: '小区名称',
          dataIndex: 'unitName'
        },
        {
          title: '创建人',
          dataIndex: 'createdName'
        },
        {
          title: '创建时间',
          dataIndex: 'createdTime'
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '150px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      productTypes: [],
      pagination: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return projectCaseList(Object.assign(parameter, this.queryParam))
          .then(res => {
            return res
          }).catch(function (err) {
            console.log(err)
          })
      }
    }
  },
  methods: {
    handleOk () {
      this.$refs.table.refresh()
    },
    confirm (pId) { // 确认删除事件
      delProjectCase({ 'id': pId }).then(res => {
        this.$refs.table.refresh()
      }).catch(function (err) {
        console.log(err)
      })
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
    },
    handleBatchDownload () { // 批量下载
      let that = this
      const selectedRowKeys = this.selectedRowKeys
      if (selectedRowKeys === undefined || selectedRowKeys.length < 1) {
        this.$message.error('请选择下载信息！')
        return
      } else {
        var ids = ''
        for ( var i = 0; i < selectedRowKeys.length; i ++) {
          if (ids === '') {
            ids = '?ids=' + selectedRowKeys[i]
          } else {
            ids += '&ids=' + selectedRowKeys[i]
          }
        }
        let __url = system.baseURL + '/projectCase/dunload' + ids
        const messageHandler = this.$message.loading('文件批量下载中，请稍候...', 0);
        WorkBoxBatchDownload(__url).then(res => {
          messageHandler()
          let that = this
          if(res instanceof Blob){
            let action = {
              isFile:res.type === 'application/octet-stream',
              isJson:res.type === 'application/json'
            }
            if(action.isFile){
              const objectUrl = URL.createObjectURL(res)
              const a = document.createElement("a")
              document.body.appendChild(a)
              a.style = "display: none"
              a.href = objectUrl
              a.download = 'case.zip'
              a.click()
              document.body.removeChild(a)
              return
            }
          }else{
            console.log('未知错误：')
            console.log('类型：'+typeof res)
            console.log(res)
          }
        }).catch(function (err) {
          that.$message.error('文件下载失败，请稍候再试.')
          messageHandler()
          console.log(err)
        })
      }
      // dunloadProjectCase(param).then(res => {
      //   console.log('res===========', res)
      //   const blob = new Blob(res)
      //   const fileName = '导出信息.zip'
      //   if ('download' in document.createElement('a')) { // 非IE下载
      //     const elink = document.createElement('a')
      //     elink.download = fileName
      //     elink.style.display = 'none'
      //     elink.href = URL.createObjectURL(blob)
      //     document.body.appendChild(elink)
      //     elink.click()
      //     URL.revokeObjectURL(elink.href) // 释放URL 对象
      //     document.body.removeChild(elink)
      //   } else { // IE10+下载
      //     navigator.msSaveBlob(blob, fileName)
      //   }
      // })
    }
  }
}
</script>
