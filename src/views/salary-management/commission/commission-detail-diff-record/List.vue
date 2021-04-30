<template>
  <!-- 差额记录 -->
  <div class="container-list-wrapper">
    <div class="search-wrapper">
      <a-month-picker
        placeholder="选择年月"
        style="width:160px;"
        v-model="searchParam.staticsDate"
      />
      <a-select
        placeholder="选择部门"
        v-model="searchParam.departmentId"
        :allowClear="true"
        style="width: 160px"
      >
        <a-select-option
          v-for="item in depSelectDataSource"
          :key="item.id"
          :value="item.id"
        >{{item.departmentName}}</a-select-option>
      </a-select>

      <a-input
        placeholder="姓名模糊查询"
        :allowClear="true"
        v-model="searchParam.userName"
        style="width: 160px"
      />

      <a-button class="a-button" type="primary" icon="search" @click="searchAction({ current: 1 })">查询</a-button>
      <a-button class="a-button" :loading="btnDownloadLoading" v-if="$auth('salaryPercentageDifHis:download')" type="primary" icon="download" @click="doAction('download')">下载</a-button>
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
        <div slot="difAmount" slot-scope="text, record, index">
          <span>{{ text | moneyFormatNumber }}</span>
        </div>
        <div slot="staticsDate" slot-scope="text, record, index">
          <span>{{ text ? String(text).slice(0,7) : text }}</span>
        </div>

        <div class="action-btns" slot="action" slot-scope="text, record">
          <template v-if="$auth('salaryPercentageDifHis:detail')">
          <a type="primary" @click="doAction('view', record)">查看</a>
          </template>
        </div>
      </a-table>
      <AddForm ref="addForm" />
    </div>
  </div>
</template>
<script>

import {
  departmentList //所有部门
} from '@/api/systemSetting'
import moment from 'moment'
import {
  percentageDifHisList,
  exportExcelDatas
} from '@/api/commissionDetail'

import AddForm from './AddForm'

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
    title: '月份',
    dataIndex: 'staticsDate',
    scopedSlots: { customRender: 'staticsDate' }
  },
  {
    align: 'center',
    title: '部门',
    dataIndex: 'departmentName',
  },
  {
    align: 'center',
    title: '岗位',
    dataIndex: 'stationName',
  },
  {
    align: 'center',
    title: '姓名',
    dataIndex: 'userName',
  },
  {
    align: 'center',
    title: '差额（元）',
    dataIndex: 'difAmount',
    scopedSlots: { customRender: 'difAmount' }
  },
  {
    align: 'center',
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' },
  },
]
export default {
  name: 'commission-detail-diff-record',
  components: {
    AddForm
  },
  data() {
    return {
      searchParam: {},
      columns: columns,
      dataSource: [],
      depSelectDataSource: [],
      pagination1: {},
      pagination: {
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: (total) => `共有 ${total} 条数据`, //分页中显示总的数据
        onShowSizeChange: this.onShowSizeChangeHandler,
      },
      loading: false,
      userInfo: this.$store.getters.userInfo, // 当前登录人
      pageTitle:'差额记录',
      btnDownloadLoading:false
    }
  },
  computed: {},
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'commission-detail-diff-record') {
          this.init()
        }
      },
      immediate: true,
    },
  },
  methods: {
    init() {
      let that = this
      departmentList().then(res => {
        that.depSelectDataSource = res.data
      })
      that.searchAction()
    },
    searchAction(opt) {
      let that = this
      if(!that.$auth('salaryPercentageDifHis:list')){
        that.$message.info('无权限查看此列表数据')
        return
      }
      let paginationParam = {
        current: that.pagination.current || 1,
        size: that.pagination.pageSize || 10,
      }

      let staticsDate = that.searchParam.staticsDate
      let _searchParam = Object.assign({}, { ...that.searchParam }, paginationParam,{
        staticsDate : staticsDate instanceof moment ? staticsDate.format('YYYY-MM') : undefined
      })
      that.loading = true
      percentageDifHisList(_searchParam)
        .then((res) => {
          that.loading = false
          that.dataSource = res.data.records.map((item, index) => {
            item.key = index + 1
            item.effective = `${item.effectiveStart} ~ ${item.effectiveEnd}`
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
    doAction(type, record) {
      let that = this
      if(type === 'download'){
        that.downloadAction()
        return
      }else{
        that.$refs.addForm.query(type, record)
      }
    },
    downloadAction() {
      let that = this
      that.btnDownloadLoading = true
      exportExcelDatas(2, that.getSearchParams())
        .then((res) => {
          that.btnDownloadLoading = false
          if (res instanceof Blob) {
            let files = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','application/vnd.ms-excel']
            const isFile = files.includes(res.type)
            const isJson = res.type === 'application/json'
            if (isFile) {
              //返回文件 则下载
              const objectUrl = URL.createObjectURL(res)
              const a = document.createElement('a')
              document.body.appendChild(a)
              a.style = 'display: none'
              a.href = objectUrl
              a.download = `${that.pageTitle}.xls`
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
                    that.$message.info(_res.msg)
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
          that.btnDownloadLoading = false
          that.$message.info(`请求出错：${err.message}`)
        })
    },

    getSearchParams(){
      const that = this
      let staticsDate = that.searchParam.staticsDate
      let _searchParam = Object.assign({}, { ...that.searchParam },{
        staticsDate : staticsDate instanceof moment ? staticsDate.format('YYYY-MM') : undefined
      })
      return _searchParam
    }

  }
}
</script>
<style scoped>
.container-list-wrapper {
  background-color: #fff;
  padding: 10px 20px;
}

.container-list-wrapper .search-wrapper > * {
  margin-right: 10px;
}

.main-wrapper {
  margin-top: 20px;
}
</style>
