<template>
  <!-- 人工盘点计划 -->
  <div class="wdf-custom-wrapper">
    <div class="search-wrapper">
      <a-form layout="inline">
        <a-form-item>
          <a-input placeholder="盘点计划单号" v-model="searchParam.inventoryCode" style="width:180px;" />
        </a-form-item>
        <a-form-item>
          <a-select placeholder="盘点方式" v-model="searchParam.type" style="width: 150px" :allowClear="true">
            <a-select-option :value="0">全盘</a-select-option>
            <a-select-option :value="1">循环盘</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="盘点开始时间">
          <a-range-picker style="width:220px;" v-model="searchParam.date" />
        </a-form-item>

        <a-form-item label="盘点结束时间">
          <a-range-picker style="width:220px;" v-model="searchParam.dateEnd" />
        </a-form-item>

        <a-form-item>
          <a-button class="a-button" type="primary" icon="search" @click="searchAction({ current: 1 })">查询</a-button>
        </a-form-item>
      </a-form>
    </div>
    <div class="main-wrapper">
      <a-tabs :activeKey="String(activeKey)" defaultActiveKey="2" @change="tabChange">
        <a-tab-pane tab="待盘点" key="2" />
        <a-tab-pane tab="已盘点" key="5" />
      </a-tabs>
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

        <div slot="status" slot-scope="text, record">
          <a href="javascript:void(0);" @click="approvalPreview(record)">{{ record.statusText }}</a>
        </div>

        <div class="action-btns" slot="action" slot-scope="text, record">
          <a type="primary" @click="doAction('view', record)">查看</a>

          <a-divider type="vertical" />
          <a-popconfirm title="确认盘点吗?" @confirm="() => doAction('pandian', record)">
            <a type="primary" href="javascript:;">盘点</a>
          </a-popconfirm>
          <a-divider type="vertical" />
          <a type="primary" href="javascript:;" @click="doAction('download', record)">下载</a>
          <a-divider type="vertical" />

          <a-upload :beforeUpload="file => beforeUpload(file,record)" :showUploadList="false">
            <a-button class="a-button" type="link" :loading="uploading">上传</a-button>
          </a-upload>

          <!-- <a type="primary" href="javascript:;" @click="doAction('upload', record)">上传</a> -->
          <a-divider type="vertical" />
          <a-popconfirm title="确认完结吗?" @confirm="() => doAction('over', record)">
            <a type="primary" href="javascript:;">完结</a>
          </a-popconfirm>
        </div>
      </a-table>
    </div>
    <ApproveInfo ref="approveInfoCard" />
    <!-- <CustomerInfo ref="customerInfoCard" /> -->
    <AddForm ref="addForm" @ok="() => searchAction()" />
  </div>
</template>

<script>
import {
  artificialInventoryApproval,
  artificialInventoryImportArtificialInventory,
  artificialInventoryAddOrUpdate,
  artificialInventoryDelete,
  artificialInventoryExportExcel,
  artificialInventoryFinish,
  artificialInventoryGetDetail,
  artificialInventoryGetListByPage,
  artificialInventoryInventory,
  artificialInventoryListArtificialInventory,
  artificialInventoryListInventory,
  artificialInventoryRevocation
} from '@/api/storage_wzz'
import AddForm from '../checkplan/AddForm'
import moment from 'moment'
import ApproveInfo from '@/components/CustomerList/ApproveInfo'
// import CustomerSelect from '@/components/CustomerList/CustomerSelect'
const columns = [
  {
    title: '序号',
    key: 'order',
    width: '70px',
    scopedSlots: { customRender: 'order' }
  },
  {
    title: '盘点计划单号',
    dataIndex: 'inventoryCode'
  },
  {
    title: '盘点方式',
    dataIndex: 'typeText'
  },
  // 不适合人工盘点
  // {
  //   title: '站台',
  //   dataIndex: 'exWarehouseTypeText'
  // },
  // {
  //   title: '库位数',
  //   dataIndex: 'exWarehouseTypeText'
  // },
  {
    title: '盘点部门',
    dataIndex: 'deptName'
  },
  {
    title: '盘点开始时间',
    dataIndex: 'inventoryStartDate'
  },
  {
    title: '提交人',
    dataIndex: 'createdName'
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'stock_management_task_handle_check_detail',
  components: {
    AddForm,
    ApproveInfo
  },
  data() {
    return {
      activeKey: 2,
      columns,
      dataSource: [],
      pagination: {
        current: 1,
        _prePageSize: 10,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: total => `共有 ${total} 条数据` //分页中显示总的数据
      },
      loading: false,
      searchParam: {
        flag: 0
      },
      userInfo: this.$store.getters.userInfo, // 当前登录人
      uploading:false,
      aceptFileTypes: [
        '.xls',
        '.xlsx',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ]
    }
  },
  watch: {
    $route: {
      handler: function(to) {
        if (to.name === 'stock_management_task_handle_check_detail') {
          this.init()
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    moment,
    init() {
      let that = this
      that.searchParam = { ...that.searchParam, searchStatus: that.activeKey }
      let queue = []

      that.searchAction()
      return Promise.all(queue)
    },
    searchAction(opt = {}) {
      let that = this
      let paginationParam = {
        current: that.pagination.current || 1,
        size: that.pagination.pageSize || 10
      }
      const { date, dateEnd } = that.searchParam
      if (Array.isArray(date) && date.length === 2) {
        that.searchParam = {
          ...that.searchParam,
          firstStartDate: date[0].format('YYYY-MM-DD'),
          firstEndDate: date[1].format('YYYY-MM-DD')
        }
      } else {
        that.searchParam = {
          ...that.searchParam,
          firstStartDate: undefined,
          firstEndDate: undefined
        }
      }

      if (Array.isArray(dateEnd) && dateEnd.length === 2) {
        that.searchParam = {
          ...that.searchParam,
          firstStartDate: dateEnd[0].format('YYYY-MM-DD'),
          firstEndDate: dateEnd[1].format('YYYY-MM-DD')
        }
      } else {
        that.searchParam = {
          ...that.searchParam,
          lastStartDate: undefined,
          lastEndDate: undefined
        }
      }

      let _searchParam = Object.assign({}, { ...this.searchParam }, paginationParam, opt)
      console.log('执行搜索...', _searchParam)
      that.loading = true
      artificialInventoryListInventory(_searchParam)
        .then(res => {
          that.loading = false
          that.dataSource = res.data.records.map((item, index) => {
            item.key = index + 1
            item.typeText = { 0: '全盘', 1: '循环盘' }[item.type] || '未知'
            item.statusText =
              { 0: '待提交', 1: '待审批', 2: '通过', 3: '不通过', 4: '撤回', 5: '完结' }[item.status] || '未知'
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
            that.searchAction()
          }
        })
        .catch(err => (that.loading = false))
    },
    // 分页
    handleTableChange(pagination, filters, sorter) {
      const pager = pagination
      pager.current = pagination.current
      if (+pager.pageSize !== +pager._prePageSize) {
        //pageSize 变化
        pager.current = 1 //重置为第一页
        pager._prePageSize = +pager.pageSize //同步两者的值
      }
      this.pagination = { ...this.pagination, ...pager }
      this.searchAction()
    },
    doAction(actionType, record) {
      let that = this
      if (['view', 'pandian'].includes(actionType)) {
        that.$refs.addForm.query(actionType, record || {})
      } else if (actionType === 'download') {
        that.exprotAction(record)
        return
      } else if (actionType === 'over') {
        artificialInventoryFinish({ id: record.id })
          .then(res => {
            that.$message.info(res.msg)
            that.searchAction()
          })
          .catch(err => {
            that.$message.info(`错误：${err.message}`)
          })
      }
    },
    tabChange(tagKey) {
      this.activeKey = parseInt(tagKey)
      this.searchParam = { ...this.searchParam, status: this.activeKey }
      this.searchAction({ current: 1 })
    },
    approvalPreview(record) {
      this.$refs.approveInfoCard.init(record.instanceId)
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },

    beforeUpload(file,record) {
      debugger
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
        this.handleUpload(record)
      }
      return false
    },
    handleUpload(record) {
      const that = this
      const { fileList } = that
      const formData = new FormData()
      fileList.forEach((file) => {
        formData.append('file', file)
      })
      formData.append('id', record.id)
      that.uploading = true
      artificialInventoryImportArtificialInventory(formData)
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
                  console.log(_res.msg)
                  if(+_res.code === 200){
                    that.$message.info(_res.msg)
                    that.searchAction()
                  }else{
                    that.$message.info(`错误：${_res.msg}`)
                  }
                }
              }
              reader.readAsText(res)
            }
          } else {
            console.log('未知错误：')
            console.log('类型：' + typeof res)
            console.log(res)
          }
        })
        .catch((err) => {
          that.uploading = false
          that.$message.error(res.msg)
          console.log(err)
        })
    },
    //下载模板
    exprotAction(record) {
      let that = this
      const fileName = `人工盘点_${record.inventoryCode}.xls`
      artificialInventoryExportExcel({id:record.id})
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
              a.download = fileName
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
  }
}
</script>

<style scoped>
.wdf-custom-wrapper {
  background-color: #fff;
  padding: 10px 20px;
}

.main-wrapper {
  margin-top: 20px;
}
</style>
