<template>
  <a-card :bordered="false">
    <div class="refund-receipt-list-wrapper">
      <div class="search-wrapper">
        <a-button-group>
          <a-button type="primary" :class="{ currentDayWeekMonth: dayWeekMonth === 1 }" @click="simpleSearch(1)"
            >今天</a-button
          >
          <a-button type="primary" :class="{ currentDayWeekMonth: dayWeekMonth === 2 }" @click="simpleSearch(2)"
            >本周</a-button
          >
          <a-button type="primary" :class="{ currentDayWeekMonth: dayWeekMonth === 3 }" @click="simpleSearch(3)"
            >本月</a-button
          >
          <a-button type="primary" :class="{ currentDayWeekMonth: dayWeekMonth === 4 }" @click="simpleSearch(4)"
            >全部</a-button
          >
        </a-button-group>
        <a-button
          class="a-button"
          style="margin-bottom: 20px; margin-left: 10px"
          type="primary"
          icon="search"
          @click="openSearchModel"
          >高级筛选</a-button
        >
        <a-button class="a-button" type="primary" icon="download" @click="exportHandler">导出</a-button>
        <div class="table-operator fl-r">
          <template v-if="$auth('paper:add')">
            <a-dropdown>
              <a-menu slot="overlay" @click="handleAdd">
                <a-menu-item key="1"><a-icon type="file" />销售合同开票单</a-menu-item>
                <a-menu-item key="2"><a-icon type="file" />软件合同开票单</a-menu-item>
              </a-menu>
              <a-button type="primary" style="margin-left: 8px"> 新建 <a-icon type="plus" /> </a-button>
            </a-dropdown>
          </template>
        </div>
      </div>
    </div>
    <a-row>
      <a-alert :message="searchTotalMoney" type="info" />
      <a-col>
        <div>
          <a-tabs defaultActiveKey="0" @change="paramClick">
            <a-tab-pane tab="我的" key="0" forceRender> </a-tab-pane>
            <template v-if="$auth('paper:approval')">
              <a-tab-pane tab="待我审批" key="5"> </a-tab-pane>
              <a-tab-pane tab="我已审批" key="2"> </a-tab-pane>
            </template>
          </a-tabs>
        </div>
        <s-table
          style="margin-bottom: 24px"
          ref="table"
          size="default"
          :columns="columns"
          :data="loadData"
          :alert="false"
          :pagination="pagination"
        >
          <div slot="order" slot-scope="text, record, index">
            <span>{{ index + 1 }}</span>
          </div>
          <span slot="paperType" slot-scope="text, record">
            <span v-if="text == 1">普票</span>
            <span v-if="text == 2">增票</span>
          </span>
          <span slot="customerName" slot-scope="text, record">
            <a @click="tenderingClick(record)">{{ text }}</a>
          </span>
          <div slot="paperQuality" slot-scope="text, record">
            <span v-if="text == 1">常规开票</span>
            <span v-if="text == 2">特殊开票</span>
          </div>
          <div slot="paperStatue" slot-scope="text, record">
            <a @click="handleClick(record)" v-if="+text === 1">待审批</a>
            <a @click="handleClick(record)" v-if="+text === 2">通过</a>
            <a @click="handleClick(record)" v-if="+text === 3">不通过</a>
            <a @click="handleClick(record)" v-if="+text === 9">已撤回</a>
          </div>
          <div slot="paperIsend" slot-scope="text, record">
            <span v-if="text == 1">未完结</span>
            <span v-if="text == 2">已完结</span>
          </div>
          <span slot="action" slot-scope="text, record">
            <template v-if="$auth('paper:one')">
              <a @click="handleVue(record)">查看</a>
            </template>
            <template v-if="$auth('paper:edit')">
              <a-divider v-if="audit" type="vertical" />
              <a v-if="audit" @click="handleAudit(record)">审核</a>
            </template>
            <template v-if="record.paperStatue === 2 && +contractState === 0">
              <a-divider type="vertical" />
              <a v-download="record.wordUrl">下载</a>
            </template>
            <template
              v-if="
                $auth('paper:del') &&
                (+record.paperStatue === 2 || +record.paperStatue === 9) &&
                record.createdId === userInfo.id
              "
            >
              <a-divider type="vertical" />
              <a v-if="!audit" class="delete" @click="() => del(record)">删除</a>
            </template>
            <template
              v-if="
                $auth('paper:edit') &&
                (+record.paperStatue === 3 || +record.paperStatue === 9) &&
                record.createdId === userInfo.id
              "
            >
              <a-divider type="vertical" />
              <a @click="handleEdit(record)">修改</a>
            </template>
            <template v-if="+record.paperStatue === 1 && +contractState === 0">
              <a-divider type="vertical" />
              <a-popconfirm title="确认撤回该条数据吗?" @confirm="() => doAction('reback', record)">
                <a type="primary" href="javascript:;">撤回</a>
              </a-popconfirm>
            </template>
          </span>
        </s-table>
      </a-col>
    </a-row>
    <InvestigateNode ref="node" />
    <Tendering ref="tenderingModel"></Tendering>
    <SearchForm ref="searchForm" @change="paramChangeHandler" />
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { getServiceList, openPaperDelete, revocationOpenpaper } from '@/api/openpaper'
import { openpaperGetSumAmountByList } from '@/api/receipt'
import InvestigateNode from '../record/InvestigateNode'
import Tendering from '../record/TenderingUnit'
import SearchForm from './modules/SearchForm'
import { getListSaleContractUser } from '@/api/contractListManagement'
import { exprotAction } from '@/api/receipt'
export default {
  name: 'OpenPaperList',
  components: {
    Tendering,
    InvestigateNode,
    STable,
    SearchForm,
  },
  data() {
    return {
      form: this.$form.createForm(this),
      userInfo: this.$store.getters.userInfo,
      // 查询参数
      queryParam: { dayWeekMonth: 1 },
      recordResult: {},
      queryRecord: {},
      contractState: 0,
      dayWeekMonth: 1,
      saleCustomer: 0,
      vueBoolean: this.$store.getters.vueBoolean,
      customerName: '',
      saleUserId: undefined,
      saleCustomers: [],
      pagination: {
        showTotal: (total) => '共' + total + '条数据',
      },
      audit: false,
      show: true,
      approvalStatusSelect: 0,
      // 表头
      columns: [
        {
          align: 'center',
          title: '序号',
          key: 'order',
          width: '70px',
          scopedSlots: { customRender: 'order' },
        },
        {
          title: '开票编号',
          dataIndex: 'paperCode',
        },
        {
          title: '客户名称',
          dataIndex: 'saleCustomerName',
          scopedSlots: { customRender: 'customerName' },
        },
        {
          title: '开票单位名称',
          dataIndex: 'openUnit',
        },
        {
          title: '销售经理',
          dataIndex: 'saleUserName',
        },
        // {
        //   title: '发票类型',
        //   dataIndex: 'paperType',
        //   scopedSlots: { customRender: 'paperType' },
        // },
        {
          title: '开票性质',
          dataIndex: 'paperQuality',
          scopedSlots: { customRender: 'paperQuality' },
        },
        {
          title: '开票金额',
          dataIndex: 'paperMoney',
        },
        {
          title: '单据状态',
          dataIndex: 'paperStatue',
          scopedSlots: { customRender: 'paperStatue' },
        },
        {
          title: '是否已结',
          dataIndex: 'paperIsend',
          scopedSlots: { customRender: 'paperIsend' },
        },
        {
          title: '申请人',
          dataIndex: 'createdName',
        },
        {
          title: '申请时间',
          dataIndex: 'createdTime',
        },
        {
          title: '操作',
          dataIndex: 'id',
          width: '200px',
          scopedSlots: { customRender: 'action' },
        },
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        return getServiceList(Object.assign(parameter, this.queryParam)).then((res) => {
          return res
        })
      },

      selectedRowKeys: [],
      selectedRows: [],
      saleUser: [],
      searchTotalMoney: '',
    }
  },
  mounted() {
    getListSaleContractUser().then((res) => (this.saleUser = res.data))
    this.search()
  },
  watch: {
    $route(to, from) {
      if (to.name == 'openPaperList') {
        this.search()
      }
      if (
        from.fullPath === '/sale/openpaper/OpenPaperAdd' ||
        from.fullPath === '/sale/openpaper/OpenPaperVue' ||
        from.fullPath === '/sale/openpaper/EditPaperVue'
      ) {
        this.$refs.table.refresh(true)
      }
    },
  },
  methods: {
    //高级筛选打开
    openSearchModel() {
      this.$refs.searchForm.query(this.contractState)
    },
    //高级筛选返回数据
    paramChangeHandler(params) {
      this.queryParam = { ...this.queryParam, ...params, dayWeekMonth: this.dayWeekMonth }
      this.search()
    },
    simpleSearch(type) {
      if (type === 4) {
        this.queryParam.dayWeekMonth = undefined
        this.dayWeekMonth = undefined
        this.queryParam = { ...this.queryParam, dayWeekMonth: this.dayWeekMonth }
        this.search()
      } else {
        this.dayWeekMonth = this.dayWeekMonth === type ? undefined : type
        this.queryParam = { ...this.queryParam, dayWeekMonth: this.dayWeekMonth }
        this.search()
      }
    },
    search() {
      if (this.$refs.table != null && this.$refs.table != undefined) {
        this.$refs.table.refresh(true)
        this.fetchTotalMoney()
      }
    },
    fetchTotalMoney() {
      const that = this
      openpaperGetSumAmountByList(that.queryParam)
        .then((res) => {
          console.log(that, res)
          if (+res.code !== 200) {
            let msg = `获取【汇总合计金额】接口出错，错误代码:${res.code} 错误消息：${res.msg}。`
            msg += `查询参数:${_searchParam}，`
            msg += '请与管理员联系，谢谢合作。'
            that.searchTotalMoney = 0
            that.$message.error(msg)
            return
          }
          that.searchTotalMoney = `本次搜索汇总合计金额：${that.$root._f('moneyFormatNumber')(res.data)}`
        })
        .catch((err) => {
          that.$message.error(err.message)
        })
    },
    handleAdd(e) {
      if (e.key === '1') {
        this.$router.push({ name: 'openPaperAdd' })
      } else if (e.key === '2') {
        this.$router.push({ name: 'softwareOpenPaperAdd' })
      }
    },
    handleClick(record) {
      console.log('JSON.stringify(record) :' + JSON.stringify(record))
      this.$refs.node.query(record)
      // this.$refs.table.refresh(true)
    },
    del(row) {
      const _this = this
      this.$confirm({
        title: '警告',
        content: `真的要删除编号为: ${row.paperCode} 的开票单吗?`,
        okText: '删除',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
          // 在这里调用删除接口
          openPaperDelete({ id: row.id }).then((res) => {
            if (res.code == 200) {
              _this.$refs.table.refresh(false)
            } else {
              _this.$message.error(res.msg)
            }
          })
        },
        onCancel() {},
      })
    },
    tenderingClick(record) {
      const data = { id: record.saleCustomerId }
      this.$refs.tenderingModel.look(data)
    },
    paramClick(key) {
      if (key == 5) {
        this.audit = true
        this.show = false
      } else if (key == 2) {
        this.audit = false
        this.show = false
      } else if (key == 0) {
        this.show = true
        this.audit = false
      }
      this.contractState = +key
      this.queryParam = { state: key }
      this.$refs.table.refresh(true)
      this.fetchTotalMoney()
    },
    handleEdit(e) {
      // 重新提交
      const contractType = e.contractType
      if (contractType == 1) {
        this.$router.push({ name: 'editPaperVue', params: { id: e.id, auditBoolean: false } })
      } else if (contractType == 2) {
        this.$router.push({ name: 'editSoftwareOpenPaper', params: { id: e.id } })
      } else if (contractType == 6) {
        this.$router.push({ name: 'PartsInvoicingeditPaperVue', params: { id: e.id, auditBoolean: false } })
      }
    },
    handleVue(e) {
      console.log(e)
      const contractType = e.contractType
      if (contractType == 1) {
        this.$router.push({ name: 'openPaperVue', params: { id: e.id, auditBoolean: false } })
      } else if (contractType == 2) {
        this.$router.push({ name: 'softwareOpenPaperView', params: { id: e.id, auditBoolean: false } })
      } else if (contractType == 6) {
        this.$router.push({ name: 'PartsInvoicingOpenPaperVue', params: { id: e.id, auditBoolean: false } })
      }
    },
    handleAudit(e) {
      const contractType = e.contractType
      if (this.userInfo.id == 52) {
        this.$message.info('你没有审批权限，不可以审批')
        return
      }
      if (contractType == 1) {
        this.$router.push({ name: 'openPaperVue', params: { id: e.id, auditBoolean: true } })
      } else if (contractType == 2) {
        this.$router.push({ name: 'softwareOpenPaperView', params: { id: e.id, auditBoolean: true } })
      } else if (contractType == 6) {
        this.$router.push({ name: 'PartsInvoicingOpenPaperVue', params: { id: e.id, auditBoolean: true } })
      }
    },
    doAction(type, record) {
      let that = this
      if (type === 'reback') {
        revocationOpenpaper({ id: record.id }).then((res) => {
          that.$message.info(res.msg)
          that.search()
        })
        return
      }
    },
    filterSalersOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    async exportHandler() {
      const that = this
      let res = await exprotAction(7, { ...that.queryParam }, '开票单')
      console.log(res)
      that.$message.info(res.msg)
    },
  },
}
</script>

<style scoped>
.top-ation .a-input {
  width: 160px;
  margin: 0 8px 8px 0;
}

.a-select {
  margin-right: 8px;
}

.a-button {
  margin-right: 8px;
}

.fl-r {
  float: right;
}

.develop-wrap {
  background-color: #fff;
  padding: 12px;
}
</style>
