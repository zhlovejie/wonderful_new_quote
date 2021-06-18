<template>
  <!-- 区间配置 -->
  <div class="customer-list-wrapper">
    <div class="search-wrapper">
      <a-input placeholder="区间开始范围查询" v-model="startName" allowClear style="width: 220px" />
      <a-input placeholder="区间结束范围查询" v-model="endName" allowClear style="width: 220px" />
      <a-button type="primary" icon="search" @click="searchAction">查询</a-button>
      <a-button type="primary" style="fmargin-left: 10px" @click="downloadAction">下载</a-button>
      <template>
        <a-button style="float: right" type="primary" icon="plus" @click="doAction('add', null)">新增</a-button>
      </template>
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
          <template>
            <a type="primary" @click="doAction('edit', record)">修改</a>
          </template>
          <template>
            <a-divider type="vertical" />
            <a-popconfirm title="是否删除" ok-text="是" cancel-text="否" @confirm="doAction('del', record)">
              <a type="primary">删除</a>
            </a-popconfirm>
          </template>
        </div>
      </a-table>
    </div>
    <AddForm ref="addForm" @finish="searchAction()" />
  </div>
</template>
<script>
import { intervalConfigPageList, delIntervalConfig, exportIntervalConfigList } from '@/api/productOfferManagement'
import AddForm from './module/AddForm'
let columns = [
  {
    align: 'center',
    title: '序号',
    width: '70px',
    scopedSlots: { customRender: 'order' },
  },
  {
    align: 'center',
    title: '区间值名称',
    dataIndex: 'intervalValueName',
  },
  {
    align: 'center',
    title: '利润值',
    dataIndex: 'profitValue',
  },
  {
    align: 'center',
    title: '利润系数',
    dataIndex: 'profitCoefficient',
  },
  {
    align: 'center',
    title: '提成比率',
    dataIndex: 'commissionRate',
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
  name: 'Interval-allocation',
  components: {
    AddForm: AddForm,
  },
  data() {
    return {
      columns,
      endName: undefined,
      startName: undefined,
      dataSource: [],
      pagination: {
        current: 1,
        _prePageSize: 10,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: (total) => `共有 ${total} 条数据`, //分页中显示总的数据
      },
      loading: false,
    }
  },
  computed: {
    searchParam() {
      return {
        startName: this.startName,
        endName: this.endName,
      }
    },
  },
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'Interval-allocation') {
          this.init()
        }
      },
      immediate: true,
    },
  },
  methods: {
    init() {
      this.searchAction()
    },
    searchAction(opt) {
      let that = this
      let paginationParam = {
        current: that.pagination.current || 1,
        size: that.pagination.pageSize || 10,
      }
      let _searchParam = Object.assign({}, { ...this.searchParam }, paginationParam, opt || {}, {})
      console.log('执行搜索...', _searchParam)
      that.loading = true
      intervalConfigPageList(_searchParam)
        .then((res) => {
          that.loading = false
          that.dataSource = res.data.records.map((item, index) => {
            item.key = index + 1
            return item
          })
          try {
            //设置数据总条数
            const pagination = { ...that.pagination }
            pagination.total = res.data.total
            that.pagination = pagination
            //有两页数据,第二页只有一条数据,删除第二页的一条数据了,界面显示在第一页,但是不显示第一页数据了
            //刷新也不显示数据
            let { current, pages } = res.data
            if (+pages > 0 && +current > +pages) {
              that.pagination = { ...pagination, current: pages }
              that.searchAction()
            }
          } catch (err) {
            console.log(err)
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
    downloadAction() {
      let that = this
      that.spinning = true
      let _searchParam = Object.assign({}, { ...this.searchParam })
      exportIntervalConfigList(_searchParam)
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
              a.download = `区间配置.xls`
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
    doAction(type, record) {
      if (type === 'add' || type === 'edit') {
        this.$refs.addForm.query(type, record)
      } else if (type === 'del') {
        delIntervalConfig({ id: record.id }).then((res) => {
          if (res.code === 200) {
            this.searchAction()
            this.$message.info(res.msg)
          } else {
            this.$message.error(res.msg)
          }
        })
      } else {
        this.$message.info(`不支持的指令：${type}`)
      }
    },
  },
}
</script>
<style scoped>
.customer-list-wrapper {
  background-color: #fff;
  padding: 10px 20px;
}
.customer-list-wrapper .search-wrapper * {
  margin: 10px 15px 0 0;
}
.main-wrapper {
  margin-top: 20px;
}
</style>