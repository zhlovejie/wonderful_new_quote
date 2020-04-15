<template>
  <a-card :bordered="false">
    <!--搜索模块-->
    <div class="process-list-search-wrapper">
      <a-form layout="inline">
        <a-form-item label="名称">
          <a-input v-model.trim="queryParam.processName" placeholder="根据工序名称模糊查询"/>
        </a-form-item>

        <template v-if="$auth('processList')">
          <a-form-item>
          <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
          <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
          </a-form-item>
        </template>
        <div class="action-wrapper" style="float:right;">
          <a-form-item>
          <template v-if="$auth('processList:add')">
            <a-button style="margin-left: 8px" type="primary" icon="plus" @click="$refs.createModal.add()">新增</a-button>
          </template>
          </a-form-item>
        </div>

        <a-form-item>
        <a-button type="primary" @click="handleUpload" :disabled="fileList.length === 0" :loading="uploading" style="margin-left: 8px">
          {{uploading ? '导入中' : '开始导入' }}
        </a-button>
        <a-upload 
          :fileList="fileList" 
          :remove="handleRemove" 
          :beforeUpload="beforeUpload" 
          style="margin-left: 8px">
          <a-button>选择文件</a-button>
        </a-upload>
        </a-form-item>

      </a-form>
    </div>

    <s-table
      ref="table"
      size="default"
      rowKey="ppId"
      :columns="columns"
      :data="loadData"
    >
      <span slot="needPicture" slot-scope="text">
        <span v-if="text == 0">否</span>
        <span v-if="text == 1">是</span>
      </span>
      <span slot="action" slot-scope="text,record">
        <template>
          <template v-if="$auth('processList:edit')">
            <a @click="$refs.createModal.edit(record)">修改</a>
          </template>
          <template v-if="$auth('processList:del')">
            <a-divider type="vertical" />
            <a-popconfirm title="确认删除这条数据？" @confirm="confirm(record.ppId)" okText="是" cancelText="否">
              <a href="#">删除</a>
            </a-popconfirm>
          </template>
        </template>
      </span>
    </s-table>

    <create-form ref="createModal" @ok="handleOk" />
  </a-card>
</template>

<script>
import { STable } from '@/components'
import CreateForm from './modules/ProcessForm'
import { toProcessList, deleteProcess ,importProductProcess} from '@/api/production/retrospect'

export default {
  name: 'ProcessList',
  components: { // 组件
    STable,
    CreateForm
  },
  data () {
    return {
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '工序名称',
          dataIndex: 'processName'
        },
        {
          title: '是否需要图片',
          dataIndex: 'needPicture',
          scopedSlots: { customRender: 'needPicture' }
        },
        {
          title: '创建人',
          width: '100px',
          dataIndex: 'creater'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime'
        },
        {
          title: '修改人',
          width: '100px',
          dataIndex: 'updater'
        },
        {
          title: '修改时间',
          dataIndex: 'updateTime'
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '150px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      pagination: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return toProcessList(Object.assign(parameter, this.queryParam))
          .then(res => {
            if (res.code === 200) {
              return res
            } else {
              this.$message.error(res.msg)
            }
          })
      },
      //上传文件
      fileList: [],
      uploading: false,
      aceptFileTypes:['.xls','.xlsx','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel']
    }
  },
  methods: {
    handleOk () {
      this.$refs.table.refresh()
    },
    confirm (ppId) { // 确认删除事件
      deleteProcess({ 'ppId': ppId }).then(res => {
        if (res.code === 200) {
          this.$refs.table.refresh()
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    handleRemove(file) {
      const index = this.fileList.indexOf(file);
      const newFileList = this.fileList.slice();
      newFileList.splice(index, 1);
      this.fileList = newFileList
    },
    beforeUpload(file) {
      let _aceptFileTypes = this.aceptFileTypes
      const isDocType = _aceptFileTypes.includes(file.type)
      if (!isDocType) {
        this.$message.error('只支持上传.xls,.xlsx的Excel!');
      }
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        this.$message.error('Excel文档必须小于10M!');
      }
      if(isDocType && isLt10M){
        this.fileList = [file]
      }
      return false
    },
    handleUpload() {
      const { fileList } = this;
      const formData = new FormData();
      fileList.forEach((file) => {
        formData.append('file', file);
      });
      this.uploading = true
      importProductProcess(formData)
      .then(res => {
        this.uploading = false
        let that = this
        console.log(res.type)
        //application/x-download
        //application/json
        if(res instanceof Blob){
          let action = {
            isFile:res.type === 'application/x-download',
            isJson:res.type === 'application/json'
          }
          if(action.isFile){
            const objectUrl = URL.createObjectURL(res)
            const a = document.createElement("a")
            document.body.appendChild(a)
            a.style = "display: none"
            a.href = objectUrl
            a.download = 'error.xlsx'
            a.click()
            document.body.removeChild(a)

            that.$message.error('您提交的信息存在重复数据，请查看下载的 error.xlsx 文件！')
            return
          }else if(action.isJson){
            var reader = new FileReader()
            reader.onload = function(e){
              let _res = null 
              try{
                _res = JSON.parse(e.target.result)
              }catch(err){
                _res = null
                console.log('JSON.parse error...',e.target.result)
              }
              if(_res !== null){
                that.$message.success(_res.msg || '操作成功')
                that.fileList = []
              }
            }
            reader.readAsText(res)
          }
        }else{
          console.log('未知错误：')
          console.log('类型：'+typeof res)
          console.log(res)
        }
      })
      .catch((err) =>{
        this.uploading = false
        console.log(err)
      })
    },

  }
}

</script>
