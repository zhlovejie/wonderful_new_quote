<template>
  <!-- 油补记录 -->
  <div class="wdf-custom-wrapper">
    <div class="search-wrapper">
      <a-select
        show-search
        placeholder="部门"
        :filterOption="filterOption"
        v-model="searchParam.deptId"
        :allowClear="true"
        style="width: 160px"
      >
        <a-select-option v-for="item in depList" :key="item.id" :value="item.id">
          {{ item.departmentName }}
        </a-select-option>
      </a-select>
      <a-input placeholder="姓名" v-model="searchParam.userName" :allowClear="true" style="width: 160px" />
      <a-month-picker placeholder="选择年月" style="width: 160px" v-model="searchParam.startDate" />
      <span>~</span>
      <a-month-picker placeholder="选择年月" style="width: 160px" v-model="searchParam.endDate" />

      <a-button class="a-button" type="primary" icon="search" @click="searchAction({ current: 1 })">查询</a-button>
      <a-button class="a-button" type="primary" @click="downloadClick()">下载</a-button>
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
        <div slot="presentTime" slot-scope="text, record, index">
          <span>{{ record.presentTime.substring(0, 10) }}</span>
        </div>
      </a-table>
    </div>
  </div>
</template>

<script>
import { pageAllowanceOilInfo, exportAllowanceOilInfo } from '@/api/salaryManagement'
import {
  departmentList, //所有部门
} from '@/api/systemSetting'
import { getDictionaryList } from '@/api/workBox'
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
    title: '日期',
    dataIndex: 'presentTime',
    scopedSlots: { customRender: 'presentTime' },
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
    title: '油补（元）',
    dataIndex: 'allowanceOil',
  },
  {
    align: 'center',
    title: '出/入场记录（天）',
    dataIndex: 'enterSiteDays',
  },
  {
    align: 'center',
    title: '实发油补（元）',
    dataIndex: 'realAllowanceOil',
  },
]

export default {
  name: 'replenishment-oil',
  components: {},
  data() {
    return {
      columns: columns,
      dataSource: [],
      depList: [],
      assetTypeList: [],
      pagination: {
        current: 1,
        _prePageSize: 10,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: (total) => `共有 ${total} 条数据`, //分页中显示总的数据
      },
      searchParam: {},
      loading: false,
    }
  },
  computed: {},
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'replenishment-oil') {
          this.init()
        }
      },
      immediate: true,
    },
  },
  methods: {
    moment,
    init() {
      let that = this
      let queue = []
      let task1 = departmentList().then((res) => (that.depList = res.data))
      queue.push(task1)
      that.searchAction()
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    downloadClick() {
      let that = this
      that.spinning = true
      let _beginTime = this.searchParam.startDate
      _beginTime = _beginTime instanceof moment ? _beginTime.format('YYYY-MM') : undefined
      let _endTime = this.searchParam.endDate
      _endTime = _endTime instanceof moment ? _endTime.format('YYYY-MM') : undefined
      let _searchParam = Object.assign({}, { ...this.searchParam }, { startDate: _beginTime, endDate: _endTime })
      exportAllowanceOilInfo(_searchParam)
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
              a.download = `油补记录.xls`
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
    searchAction(opt = {}) {
      let that = this

      let _beginTime = this.searchParam.startDate
      _beginTime = _beginTime instanceof moment ? _beginTime.format('YYYY-MM') : undefined
      let _endTime = this.searchParam.endDate
      _endTime = _endTime instanceof moment ? _endTime.format('YYYY-MM') : undefined

      let _searchParam = Object.assign(
        {},
        { ...this.searchParam },
        { startDate: _beginTime, endDate: _endTime },
        { ...this.pagination },
        opt
      )
      console.log('执行搜索...', _searchParam)
      that.loading = true
      pageAllowanceOilInfo(_searchParam)
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
            that.searchAction()
          }
        })
        .catch((err) => (that.loading = false))
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

    doAction(type, record) {
      let that = this
      if (type === 'miss') {
        oaAssertsInfoInventoryMissing({ id: record.id }).then((res) => {
          console.log(res)
          that.$message.info(res.msg)
          if (res.code === 200) {
            that.searchAction()
          }
        })
      }
    },
  },
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
