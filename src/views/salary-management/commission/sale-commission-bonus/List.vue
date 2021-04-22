<template>
  <div class="adjust-apply-list-wrapper">
    <div class="search-wrapper">
      <a-month-picker style="width: 200px;margin-right: 10px;" v-model="queryParam.month" />
      <!-- <a-select
        style="width: 200px; margin-left: 10px; margin-right: 10px"
        placeholder="选择部门"
        :allowClear="true"
        v-model="queryParam.departmentId"
      >
        <a-select-option v-for="item in depList" :key="item.id" :value="item.id">{{
          item.departmentName
        }}</a-select-option>
      </a-select> -->
      <a-select
        placeholder="审核状态"
        v-if="activeKey === 0"
        v-model="queryParam.status"
        :allowClear="true"
        style="width: 200px; margin-right: 10px"
      >
        <a-select-option :value="1">待审批</a-select-option>
        <a-select-option :value="2">审批通过</a-select-option>
        <a-select-option :value="3">审批不通过</a-select-option>
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
    </div>
    <div class="main-wrapper">
      <a-tabs :activeKey="activeKey" :defaultActiveKey="0" @change="tabChange">
        <a-tab-pane tab="我的" :key="0" />
        <a-tab-pane tab="待我审批" :key="1" />
        <a-tab-pane tab="我已审批" :key="2" />
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
          <a @click="approvalPreview(record)">{{ getStateText(text) }}</a>
        </div>

        <div slot="allAmount" slot-scope="text, record, index">
          <span>{{ text | moneyFormatNumber }}</span>
        </div>

        <div class="action-btns" slot="action" slot-scope="text, record">
          <template v-if="activeKey === 0">
            <template v-if="$auth('salerBouns:detail')">
              <a type="primary" @click="doAction('view', record)">查看</a>
            </template>
            <template v-if="record.status === 1">
              <template v-if="$auth('salerBouns:withdraw')">
                <a-divider type="vertical" />
                <a type="primary" @click="doAction('reback', record)">撤回</a>
              </template>
            </template>

            <template v-if="record.status === 2">
              <template v-if="$auth('salerBouns:download')">
              <a-divider type="vertical" />
              <a type="primary" @click="doAction('download', record)">下载</a>
              </template>
            </template>

            <template v-if="record.status === 3 || record.status === 4">
              <template v-if="$auth('salerBouns:remove')">
              <a-divider type="vertical" />
              <a-popconfirm title="是否要删除此行？" @confirm="doAction('del', record)">
                <a>删除</a>
              </a-popconfirm>
              </template>
            </template>
          </template>

          <template v-if="activeKey === 1">
            <template v-if="$auth('salerBouns:approve')">
            <a type="primary" @click="doAction('approval', record)">审核</a>
            </template>
          </template>

          <template v-if="activeKey === 2">
            <template v-if="$auth('salerBouns:detail')">
            <a type="primary" @click="doAction('view', record)">查看</a>
            </template>
          </template>
        </div>
      </a-table>
    </div>
    <ApproveInfo ref="approveInfoCard" />
    <AddForm ref="addForm" @finish="finishedHandler" />
  </div>
</template>
<script>

import {
  departmentList //所有部门
} from '@/api/systemSetting'
import {
  approvalSalaryMonthInstanceApply,
  exportSalaryExcel,
  getOaSalarySalerBounsApplyDetail,
  getOaSalarySalerBounsApplyPageList,
  removeSalarySalerBounsApply,
  withdrawSalarySalerBounsApply
} from '@/api/commissionDetail'
import ApproveInfo from '@/components/CustomerList/ApproveInfo'
import AddForm from './module/AddForm'
import moment from 'moment'
const columns = [
  {
    title: '序号',
    scopedSlots: { customRender: 'order' },
  },

  {
    title: '日期',
    dataIndex: 'month'
  },

  {
    title: '总提成(元)',
    dataIndex: 'allAmount',
    scopedSlots: { customRender: 'allAmount' }
  },

  {
    title: '状态',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' }
  },

  {
    title: '提交人',
    dataIndex: 'createdUserName'
  },
  {
    title: '提交人时间',
    dataIndex: 'createdTime'
  },
  {
    title: '操作',
    scopedSlots: { customRender: 'action' }
  },
]

export default {
  name: 'sale-commission',
  components: {
    AddForm,
    ApproveInfo
  },
  data() {
    return {
      activeKey:0,
      depList: [],
      queryParam: {},
      columns: columns,
      dataSource: [],
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
    }
  },
  computed: {},
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'sale-commission') {
          this.init()
        }
      },
      immediate: true,
    },
  },
  methods: {
    init(){
      const that = this
      departmentList().then(res => that.depList = res.data)
      that.searchAction()
    },
    getStateText(state) {
      let stateMap = {
        1: '待审批',
        2: '通过',
        3: '未通过',
        4: '已撤回',
        5: '已完结',
      }
      return stateMap[state] || `未知状态:${state}`
    },
    searchAction(opt) {
      let that = this

      if(!that.$auth('salerBouns:list')){
        that.$message.info('无权限查看此列表数据')
        return
      }
      let month = undefined
      if (that.queryParam.month) {
        month = moment(that.queryParam.month).format('YYYY-MM')
      }
      let _searchParam = Object.assign({}, { ...that.queryParam ,month}, opt || {}, {
        searchStatus: that.activeKey,
      })
      that.loading = true
      getOaSalarySalerBounsApplyPageList(_searchParam)
        .then((res) => {
          that.loading = false
          that.dataSource = res.data.records.map((item, index) => {
            item.key = index + 1
            item.month = item.month ? item.month.slice(0,7) : item.month
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
      const that = this
      if(type === 'view'){
        that.$refs.addForm.query(type,record)
        return
      }else if(type === 'del'){
        removeSalarySalerBounsApply(`id=${record.id}`).then(res =>{
          res.code === 200 && that.searchAction()
          that.$message.info(res.msg)
        }).catch(err => that.$message.error(err.message))
        return
      }else if(type === 'reback'){
        withdrawSalarySalerBounsApply(`id=${record.id}`).then(res =>{
          res.code === 200 && that.searchAction()
          that.$message.info(res.msg)
        }).catch(err => that.$message.error(err.message))
        return
      }else if(type === 'approval'){
        that.$refs.addForm.query(type,record)
        return
      }else if(type === 'download'){
        that.downAction(record)
        return
      }
      else{
        return
      }
    },
    tabChange(tagKey) {
      this.activeKey = +tagKey
      this.searchAction({ current: 1})
    },
    finishedHandler(){
      this.searchAction()
    },
    approvalPreview(record) {
      this.$refs.approveInfoCard.init(record.instanceId)
    },
    // 下载
    downAction(record) {
      let that = this
      let fname = `${moment(record.month).format('YYYY年MM月')}销售提成数据.xlsx`
      that.loading = true
      exportSalaryExcel({applyId:record.id})
        .then((res) => {
          console.log(res)
          this.loading = false
          if (res instanceof Blob) {
            const isFile = res.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            const isJson = res.type === 'application/json'
            if (isFile) {
              //返回文件 则下载
              const objectUrl = URL.createObjectURL(res)
              const a = document.createElement('a')
              document.body.appendChild(a)
              a.style = 'display: none'
              a.href = objectUrl
              a.download = fname
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
        .catch((err) => (this.loading = false))
    },
  }
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
