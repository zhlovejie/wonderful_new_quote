<template>
  <div class="adjust-apply-list-wrapper">
    <div class="search-wrapper">
      <a-select
        style="width: 280px; margin-right: 10px"
        placeholder="供应商物料"
        :allowClear="true"
        show-search
        :filter-option="filterOption"
        v-model="queryParam.materialIdName"
      >
        <a-select-option v-for="item in depList" :key="item.id" :value="item.id"
          >{{ item.materialName }} {{ item.materialCode }}</a-select-option
        >
      </a-select>

      <a-select
        placeholder="不限规模"
        v-model="queryParam.supplierScale"
        :allowClear="true"
        style="width: 150px; margin-right: 10px"
      >
        <a-select-option :value="0">小规模</a-select-option>
        <a-select-option :value="1">一般规模</a-select-option>
      </a-select>
      <a-select
        placeholder="不限结算方式"
        v-model="queryParam.settlementMode"
        :allowClear="true"
        style="width: 150px; margin-right: 10px"
      >
        <a-select-option :value="0">现款现货</a-select-option>
        <a-select-option :value="1">帐期结算</a-select-option>
      </a-select>
      <a-select
        placeholder="不限交易记录"
        v-model="queryParam.requirementType"
        :allowClear="true"
        style="width: 150px; margin-right: 10px"
      >
        <a-select-option :value="1">有</a-select-option>
        <a-select-option :value="2">无</a-select-option>
      </a-select>
      <a-input
        placeholder="请输入供应商名称/编号关键词"
        v-model="queryParam.salesmanNameCode"
        allowClear
        style="width: 200px; margin-right: 10px"
      />
      <a-select
        placeholder="审核状态"
        v-model="queryParam.status"
        :allowClear="true"
        style="width: 200px; margin-right: 10px"
      >
        <a-select-option :value="0">待提交</a-select-option>
        <a-select-option :value="1">待审批</a-select-option>
        <a-select-option :value="2">通过</a-select-option>
        <a-select-option :value="3">不通过</a-select-option>
        <a-select-option :value="4">已撤回</a-select-option>
      </a-select>
      <a-button
        class="a-button"
        type="primary"
        style="position: relative; top: -1px"
        icon="search"
        @click="searchAction({ current: 1 })"
        >查询</a-button
      >
      <a-button class="a-button" type="primary" style="margin-left: 10px" @click="showModal">导入</a-button>

      <template v-if="$auth('supplier:add')">
        <a-dropdown style="float: right">
          <a-button type="primary" @click="doAction('add', null)"> <a-icon type="plus" />新增 </a-button>
        </a-dropdown>
      </template>

      <div style="float: right"></div>
    </div>
    <div class="main-wrapper">
      <a-tabs :activeKey="String(activeKey)" defaultActiveKey="0" @change="tabChange">
        <a-tab-pane tab="我的" key="0" />
        <template v-if="$auth('supplier:list')">
          <a-tab-pane tab="待我审批" key="1" />
          <a-tab-pane tab="我已审批" key="2" />
        </template>
      </a-tabs>
      <a-table
        v-if="$auth('supplier:lists')"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <div slot="order" slot-scope="text, record, index">
          <span>{{ index + 1 }}</span>
        </div>
        <div slot="supplierScale" slot-scope="text, record, index">
          <span v-if="text === 0">小规模</span>
          <span v-if="text === 1">一般规模 </span>
        </div>
        <div slot="status" slot-scope="text, record">
          <a @click="approvalPreview(record)">{{ getStateText(text) }}</a>
        </div>
        <div class="action-btns" slot="action" slot-scope="text, record">
          <!-- 公告审批状态：0 待审批，1 审批通过，2 审批驳回 -->
          <template v-if="activeKey === 0">
            <template v-if="$auth('supplier:view')">
              <!-- <a type="primary" @click="doAction('view', record)">查看</a>
              <a-divider type="vertical" /> -->
              <a type="primary" @click="process(record)">详情</a>
            </template>
            <template v-if="record.status === 2 && $auth('supplier:enable')">
              <a-divider type="vertical" />
              <a type="primary" v-if="record.type === 0" @click="Enable(record, 1)">启用</a>
              <a type="primary" v-if="record.type === 1" @click="Enable(record, 0)">禁用</a>
            </template>
            <template v-if="record.status === 1 && +record.createdId === +userInfo.id">
              <a-divider type="vertical" />
              <template v-if="$auth('supplier:Withdraw')">
                <a-popconfirm title="是否确定撤回" ok-text="确定" cancel-text="取消" @confirm="confirmWithdraw(record)">
                  <a type="primary">撤回</a>
                </a-popconfirm>
              </template>
            </template>
            <template
              v-if="
                $auth('supplier:edit-salary') &&
                (record.status === 3 || record.status === 4 || record.status === 0) &&
                +record.createdId === +userInfo.id
              "
            >
              <a-divider type="vertical" />
              <a type="primary" @click="doAction('edit-salary', record)">修改</a>
              <a-divider type="vertical" />
              <a-popconfirm title="是否确定删除" ok-text="确定" cancel-text="取消" @confirm="confirmDelete(record)">
                <a type="primary">删除</a>
              </a-popconfirm>
            </template>
          </template>

          <template v-if="activeKey === 1 && record.status === 1">
            <a type="primary" @click="doAction('edit', record)">审核</a>
          </template>

          <template v-if="activeKey === 2">
            <!-- <a type="primary" @click="doAction('view', record)">查看</a> -->
            <a type="primary" @click="process(record)">详情</a>
          </template>
        </div>
      </a-table>
    </div>
    <a-modal title="导入" :width="800" :visible="visible" @ok="handleOk" @cancel="handleCancel">
      <a-button class="a-button" type="primary" @click="commonly">下载一般供应商模板</a-button>
      <a-button class="a-button" type="primary" style="margin-left: 10px" @click="Small">下载小供应商模板</a-button>
      <a-upload :beforeUpload="beforeUpload" style="margin-left: 10px" :showUploadList="false">
        <a-button class="a-button" type="primary" icon="upload" :loading="uploading">导入一般供应商</a-button>
      </a-upload>
      <a-upload :beforeUpload="beforeUploads" style="margin-left: 10px" :showUploadList="false">
        <a-button class="a-button" type="primary" icon="upload" :loading="uploading">导入小供应商</a-button>
      </a-upload>
    </a-modal>
    <a-modal title="错误数据" :visible="visibles" @ok="handleOks" @cancel="handleCancels">
      <h3>{{ iserror.failNum || 0 }}条错误数据</h3>
      <div v-for="item in iserror.errorList" :key="item.failNum">
        <p>第{{ item.rowNum }}行 {{ item.msg }}</p>
      </div>
    </a-modal>
    <AddForm ref="addForm" @finish="searchAction()" />
    <ApproveInfo ref="approveInfoCard" />
  </div>
</template>
<script>
import { routineMaterialInfoPageList } from '@/api/routineMaterial'
import {
  manageSupplier,
  SupplierRevocation,
  exportExcelMax,
  exportExcelMin,
  importExcelMax,
  importExcelMin,
  getdelete,
  materialenable,
} from '@/api/supplier'
import AddForm from './modules/Formadd'
import ApproveInfo from './modules/ApproveInfo'
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
    title: '供应商名称',
    dataIndex: 'scompanyName',
    key: 'scompanyName',
  },
  {
    align: 'center',
    title: '供应商编码',
    dataIndex: 'gysCode',
    key: 'gysCode',
  },
  {
    align: 'center',
    title: '规模',
    dataIndex: 'supplierScale',
    key: 'supplierScale',
    scopedSlots: { customRender: 'supplierScale' },
  },
  {
    align: 'center',
    title: '成立年限',
    dataIndex: 'establishYear',
    key: 'establishYear',
  },
  {
    align: 'center',
    title: '诚信级别',
    key: 'sincerityLevel',
    dataIndex: 'sincerityLevel',
  },
  {
    align: 'center',
    title: '业务员',
    key: 'salesmanName',
    dataIndex: 'salesmanName',
  },
  {
    align: 'center',
    title: '业务员电话',
    dataIndex: 'salesmanPhone',
    key: 'salesmanPhone',
  },
  {
    align: 'center',
    title: '状态',
    key: 'status',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' },
  },
  {
    align: 'center',
    title: '创建人',
    dataIndex: 'createdName',
    key: 'createdName',
  },
  {
    align: 'center',
    title: '创建时间',
    dataIndex: 'createdTime',
    key: 'createdTime',
  },

  {
    align: 'center',
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' },
  },
]

export default {
  name: 'NoticeList',
  components: {
    AddForm: AddForm,
    ApproveInfo: ApproveInfo,
  },
  data() {
    return {
      visible: false,
      visibles: false,
      depList: [],
      fileList: [],
      fileLists: [],
      iserror: {},
      uploading: false,
      aceptFileTypes: [
        '.xls',
        '.xlsx',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
      ],
      queryParam: { current: 1 },
      pagination1: {},
      pagination: {
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: (total) => `共有 ${total} 条数据`, //分页中显示总的数据
        onShowSizeChange: (current, pageSize) => ((this.pagination1.size = pageSize), this.searchAction()),
      },
      status: '',
      depId: '',
      activeKey: 0,
      departmentList: [],
      rule_List: [],
      approval_status: undefined,
      depSelectDataSource: [],
      columns: columns,
      dataSource: [],
      userInfo: this.$store.getters.userInfo, // 当前登录人
      loading: false,
      whole: true,
    }
  },
  computed: {},
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'SupplierList') {
          this.init()
        }
      },
      immediate: true,
    },
  },
  methods: {
    moment,
    process(record) {
      this.$router.push({
        name: 'Supplierdetails',
        params: { record: record, id: record.id },
      })
    },
    Enable(record, type) {
      let that = this
      materialenable({ id: record.id, type: type }).then((res) => {
        this.searchAction()
        that.$message.info(res.msg)
      })
    },
    //小供应商导入
    beforeUploads(file) {
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
        this.fileLists = [file]
        this.handleUploads()
      }
      return false
    },
    handleUploads() {
      const that = this
      const { fileLists } = that
      const formData = new FormData()
      fileLists.forEach((file) => {
        formData.append('file', file)
      })
      that.uploading = true
      importExcelMin(formData)
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

                    that.visibles = true
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
        })
        .catch((err) => {
          that.uploading = false
          that.$message.error(res.msg)
          console.log(err)
        })
    },
    //一般供应商导入
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
      importExcelMax(formData)
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

                    that.visibles = true
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
    Small() {
      let that = this
      that.spinning = true
      exportExcelMin()
        .then((res) => {
          that.spinning = false
          console.log(res)
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
              a.download = `小供应商模板.xls`
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
        .catch((err) => (that.spinning = true))
    },
    //一般供应商模板下载
    commonly() {
      let that = this
      that.spinning = true
      exportExcelMax()
        .then((res) => {
          that.spinning = false
          console.log(res)
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
              a.download = `一般应商模板.xls`
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
        .catch((err) => (that.spinning = true))
    },
    showModal() {
      this.visible = true
    },
    handleOk() {
      this.visible = false
    },
    handleCancel() {
      this.visible = false
    },
    handleOks() {
      this.visibles = false
    },
    handleCancels() {
      this.visibles = false
    },
    init() {
      let that = this
      that.searchAction()
      routineMaterialInfoPageList({ current: 1, size: 10000 }).then((res) => (this.depList = res.data.records))
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    // 删除
    confirmDelete(record) {
      let that = this
      getdelete({ id: record.id }).then((res) => {
        if (res.code === 200) {
          this.searchAction()
          that.$message.info(res.msg)
        } else {
          _this.$message.error(res.msg)
        }
      })
    },
    getStateText(state) {
      let stateMap = {
        0: '待提交',
        1: '待审批',
        2: '通过',
        3: '不通过',
        4: '已撤回',
      }
      return stateMap[state] || `未知状态:${state}`
    },
    //审批流组件
    approvalPreview(record) {
      this.$refs.approveInfoCard.init(record.instanceId)
    },

    // 撤回
    confirmWithdraw(record) {
      let that = this
      SupplierRevocation({ id: record.id }).then((res) => {
        this.searchAction()
        that.$message.info(res.msg)
      })
    },
    searchAction(opt) {
      let that = this
      let _searchParam = Object.assign({}, { ...that.queryParam }, { ...that.pagination1 }, opt || {}, {
        searchStatus: that.activeKey,
      })
      that.loading = true
      manageSupplier(_searchParam)
        .then((res) => {
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
        .catch((err) => (that.loading = false))
    },
    // 分页
    handleTableChange(pagination, filters, sorter) {
      this.pagination1.size = pagination.pageSize
      this.pagination1.current = pagination.current
      this.searchAction()
    },

    doAction(type, record) {
      this.$refs.addForm.query(type, record)
      //this.$message.info('功能尚未实现...')
    },
    tabChange(tagKey) {
      this.activeKey = parseInt(tagKey)
      if (this.activeKey !== 0) {
        this.approval_status = undefined
      }
      //this.$message.info('全部，待审批，审批尚未实现')
      this.searchAction({ current: 1, searchStatus: this.activeKey })
    },
  },
}
</script>
<style scoped>
.adjust-apply-list-wrapper {
  background-color: #fff;
  padding: 10px 20px;
}
.topName {
  top: 230px !important;
}
.main-wrapper {
  margin-top: 20px;
}
</style>
