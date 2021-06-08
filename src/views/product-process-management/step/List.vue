<template>
  <!-- 工序管理 -->
  <div class="product-process-management_step-management">
    <div class="search-wrapper">
      <a-form layout="inline">
        <a-form-item>
          <a-select placeholder="车间名称" v-model="searchParam.workshopId" allowClear style="width: 180px">
            <a-select-option v-for="item in workshop" :key="item.id" :value="item.id">{{
              item.departmentName
            }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-input
            placeholder="工序代码/工序名称模糊查询"
            v-model="searchParam.process"
            allowClear
            style="width: 180px"
          />
        </a-form-item>
        <a-form-item>
          <a-button class="a-button" type="primary" icon="search" @click="searchAction({ current: 1 })">查询</a-button>
        </a-form-item>
        <a-form-item>
          <a-upload :beforeUpload="beforeUpload" :showUploadList="false">
            <a-button class="a-button" type="primary" icon="upload" :loading="uploading">导入</a-button>
          </a-upload>
        </a-form-item>
        <a-form-item>
          <a-button class="a-button" type="primary" @click="exprotAction()">下载模板</a-button>
        </a-form-item>
        <div class="action-wrapper" style="float: right">
          <a-form-item>
            <a-button type="primary" icon="plus" @click="doAction('add', null)">新增</a-button>
          </a-form-item>
        </div>
      </a-form>
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

        <div class="action-btns" slot="action" slot-scope="text, record">
          <a type="primary" @click="doAction('view', record)">查看</a>
          <a-divider type="vertical" />
          <a type="primary" @click="doAction('edit', record)">修改</a>
          <a-divider type="vertical" />
          <a-popconfirm title="是否确定删除" ok-text="确定" cancel-text="取消" @confirm="doAction('del', record)">
            <a type="primary">删除</a>
          </a-popconfirm>
        </div>
      </a-table>
    </div>
    <AddForm key="k1" ref="addForm" @finish="searchAction" />
    <a-modal title="错误数据" :visible="visible" @ok="handleOk" @cancel="handleCancel">
      <h3>{{ iserror.failNum || 0 }}条错误数据</h3>
      <div v-for="item in iserror.errorList" :key="item.failNum">
        <p>第{{ item.rowNum }}行 {{ item.msg }}</p>
      </div>
    </a-modal>
  </div>
</template>

<script>
import {
  pageDevelopmentCraftProcessDelete,
  pageDevelopmentCraftProcessList,
  listDevelopmentCraftWorkshopList,
  pageExportExcel,
  pageImportExcel,
} from '@/api/ProcessManagement'
import AddForm from './AddForm'
import moment from 'moment'

const columns = [
  {
    align: 'center',
    title: '序号',
    key: 'order',
    width: '70px',
    scopedSlots: { customRender: 'order' },
  },
  {
    align: 'center',
    title: '车间名称',
    dataIndex: 'workshopName',
  },
  {
    align: 'center',
    title: '工序代码',
    dataIndex: 'processNum',
  },
  {
    align: 'center',
    title: '工序名称',
    dataIndex: 'processName',
  },
  {
    align: 'center',
    title: '提交人',
    dataIndex: 'createdName',
  },
  {
    align: 'center',
    title: '提交时间',
    dataIndex: 'createdTime',
  },
  {
    align: 'center',
    title: '修改人',
    dataIndex: 'modifierName',
  },
  {
    align: 'center',
    title: '修改时间',
    dataIndex: 'modifyTime',
  },
  {
    align: 'center',
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' },
  },
]

export default {
  name: 'product-process-management_step-management',
  components: {
    AddForm,
  },
  data() {
    return {
      visible: false,
      columns: columns,
      dataSource: [],
      iserror: {},
      workshop: [],
      loading: false,
      uploading: false,
      pagination: {
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: (total) => `共有 ${total} 条数据`, //分页中显示总的数据
        onShowSizeChange: this.onShowSizeChangeHandler,
      },
      searchParam: {},
      aceptFileTypes: [
        '.xls',
        '.xlsx',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
      ],
    }
  },
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'product-process-management_step-management') {
          this.init()
        }
      },
      immediate: true,
    },
  },
  methods: {
    moment,
    handleOk() {
      this.visible = false
    },
    handleCancel() {
      this.visible = false
    },
    init() {
      const that = this
      listDevelopmentCraftWorkshopList().then((res) => {
        that.workshop = res.data
      })
      that.searchAction()
    },
    searchAction(opt = {}) {
      let that = this
      let paginationParam = {
        current: that.pagination.current || 1,
        size: that.pagination.pageSize || 10,
      }
      let _searchParam = Object.assign({}, { ...this.searchParam }, opt, paginationParam)
      that.loading = true
      pageDevelopmentCraftProcessList(_searchParam)
        .then((res) => {
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

          //有两页数据,第二页只有一条数据,删除第二页的一条数据了,界面显示在第一页,但是不显示第一页数据了
          //刷新也不显示数据
          let { current, pages } = res.data
          if (+pages > 0 && +current > +pages) {
            that.pagination = { ...pagination, current: pages }
            that.search()
          }
        })
        .catch((err) => (that.loading = false))
    },
    // 分页
    handleTableChange(pagination, filters, sorter) {
      this.pagination = { ...this.pagination, current: pagination.current }
      this.searchAction()
    },
    onShowSizeChangeHandler(current, pageSize) {
      this.pagination = { ...this.pagination, current, pageSize }
    },
    doAction(actionType, record) {
      let that = this
      if (['view', 'add', 'edit', 'approval'].includes(actionType)) {
        this.$refs.addForm.query(actionType, record)
      } else if (actionType === 'del') {
        pageDevelopmentCraftProcessDelete({ id: record.id }).then((res) => {
          that.$message.info(res.msg)
          that.searchAction()
        })
        return
      } else {
        that.$message.info(`未知指令：${actionType}`)
      }
    },
    beforeUpload(file) {
      let _aceptFileTypes = this.aceptFileTypes
      const isDocType = _aceptFileTypes.includes(file.type)
      if (!isDocType) {
        this.$message.error('只支持上传.xls,.xlsx的Excel!')
      }
      const isLt10M = file.size / 1024 / 1024 < 10
      if (!isLt10M) {
        this.$message.error('Excel文档必须小于10M!')
      }
      if (isDocType && isLt10M) {
        this.fileList = [file]
        this.handleUpload()
      }
      return false
    },
    handleUpload() {
      const that = this
      const { fileList } = that
      const formData = new FormData()
      fileList.forEach((file) => {
        formData.append('file', file)
      })
      that.uploading = true
      pageImportExcel(formData)
        .then((res) => {
          that.uploading = false
          console.log(res.type)
          if (res instanceof Blob) {
            let action = {
              isFile: res.type === 'application/x-download',
              isJson: res.type === 'application/json',
            }

            if (action.isFile) {
              const objectUrl = URL.createObjectURL(res)
              const a = document.createElement('a')
              document.body.appendChild(a)
              a.style = 'display: none'
              a.href = objectUrl
              a.download = 'error.xlsx'
              a.click()
              document.body.removeChild(a)

              that.$message.error('您提交的信息存在重复数据，请查看下载的 error.xlsx 文件！')
              return
            } else if (action.isJson) {
              var reader = new FileReader()
              reader.onload = function (e) {
                let _res = null
                try {
                  _res = JSON.parse(e.target.result)
                } catch (err) {
                  _res = null
                  console.log('JSON.parse error...', e.target.result)
                }
                if (_res !== null) {
                  debugger
                  that.fileList = []
                  console.log(_res.msg)
                  if (_res.msg === '操作成功') {
                    that.$message.info(res.msg || '操作成功')
                  } else {
                    try {
                      that.iserror = JSON.parse(_res.msg)
                    } catch (err) {
                      console.log(err)
                    }

                    that.visible = true
                  }
                  that.searchAction()
                }
              }
              reader.readAsText(res)
            }
          } else {
            console.log('未知错误：')
            console.log('类型：' + typeof res)
            console.log(res)
          }
          // let that = that
          // if (res.code === 200) {
          //   that.$message.info(res.msg || '操作成功')
          //   that.searchAction()
          // } else {
          //   console.log(res)
          //   that.iserror = JSON.stringify(res.msg)
          //   that.visible = true
          // }
        })
        .catch((err) => {
          that.uploading = false
          that.$message.error(res.msg)
          console.log(err)
        })
    },
    //下载模板
    exprotAction() {
      let that = this
      pageExportExcel()
        .then((res) => {
          //console.log(res)
          if (res instanceof Blob) {
            const isFile = res.type === 'application/vnd.ms-excel'
            const isJson = res.type === 'application/json'
            if (isFile) {
              //返回文件 则下载
              const objectUrl = URL.createObjectURL(res)
              const a = document.createElement('a')
              document.body.appendChild(a)
              a.style = 'display: none'
              a.href = objectUrl
              a.download = `工序模板.xls`
              a.click()
              document.body.removeChild(a)
              that.$message.info('下载成功')
              return
            } else if (isJson) {
              //返回json处理
              var reader = new FileReader()
              reader.onload = function (e) {
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
        .catch((err) => {
          that.$message.info(`请求出错：${err.message}`)
        })
    },
  },
}
</script>

<style scoped>
.product-process-management_step-management {
  background-color: #fff;
  padding: 10px 20px;
}

.main-wrapper {
  margin-top: 20px;
}
.currentDayWeekMonth {
  opacity: 0.7;
}
</style>
