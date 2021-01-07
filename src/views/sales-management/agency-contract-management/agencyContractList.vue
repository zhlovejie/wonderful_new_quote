<template>
  <!-- 代理合同 -->
  <div class="wdf-custom-wrapper" id="agency-contract-wrapper">
    <div class="search-wrapper">
      <a-form layout="inline">
        <a-form-item>
          <a-input style="width: 200px" :allowClear="true" placeholder="合同编号" v-model="searchParam.contractNum" />
        </a-form-item>
        <a-form-item>
          <a-input style="width: 200px" :allowClear="true" placeholder="客户名称" v-model="searchParam.customerName" />
        </a-form-item>

        <!-- <CustomerSelect
          ref="customerSelect"
          :options="customerSelectOptions"
          @selected="(e) => customAction('select', e)"
          @inputClear="(e) => customAction('clear', null)"
        /> -->
        <a-form-item>
          <a-select placeholder="销售人员" v-model="searchParam.salesmanId" style="width: 150px" :allowClear="true">
            <a-select-option v-for="val in saleUsers" :key="val.id" :value="val.id">{{ val.trueName }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-select
            placeholder="审批状态"
            v-model="searchParam.state"
            style="width: 150px"
            :allowClear="true"
            v-if="+activeKey === 1"
          >
            <a-select-option :value="1">待提交</a-select-option>
            <a-select-option :value="2">待审批</a-select-option>
            <a-select-option :value="3">已撤回</a-select-option>
            <a-select-option :value="4">不通过</a-select-option>
            <a-select-option :value="5">通过</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item>
          <a-button class="a-button" type="primary" icon="search" @click="searchAction({ current: 1 })">查询</a-button>
        </a-form-item>

        <!-- <a-button
          v-if="$auth('agencyContractList:add')"
          style="float: right"
          type="primary"
          icon="plus"
          @click="doAction('add', null)"
          >申请</a-button
        > -->
        <a-button style="float: right" type="primary" icon="plus" @click="doAction('add', null)">申请</a-button>
      </a-form>
    </div>
    <div class="main-wrapper">
      <a-tabs :activeKey="String(activeKey)" defaultActiveKey="0" @change="tabChange">
        <a-tab-pane tab="我的" key="1" />
        <template v-if="$auth('agencyContractList:approval')">
          <a-tab-pane tab="待我审批" key="2" />
          <a-tab-pane tab="我已审批" key="3" />
        </template>
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

        <div slot="state" slot-scope="text, record">
          <a href="javascript:void(0);" @click="approvalPreview(record)">{{
            { 1: '待提交', 2: '待审批', 3: '已撤回', 4: '不通过', 5: '通过' }[text] || '未知'
          }}</a>
        </div>
        <div slot="validityDate" slot-scope="text, record, index">
          <span>{{ record.validityDateStart }} ~ {{ record.validityDateEnd }}</span>
        </div>
        <a slot="customerName" slot-scope="text, record" @click="consumerInfoShow(record)">{{ text }}</a>

        <div class="action-btns" slot="action" slot-scope="text, record">
          <template v-if="+activeKey === 3 || activeKey === 1">
            <a type="primary" @click="doAction('view', record)">查看</a>
          </template>

          <template v-if="+activeKey === 2">
            <a type="primary" @click="doAction('approval', record)">审批</a>
          </template>

          <template v-if="+activeKey === 1">
            <a-divider type="vertical" />
            <a-dropdown :trigger="['click']">
              <a class="ant-dropdown-link" @click="(e) => e.preventDefault()"> 更多 <a-icon type="down" /> </a>
              <a-menu slot="overlay">
                <a-menu-item key="0" v-if="+record.state === 2">
                  <a-popconfirm title="确认撤回该条数据吗?" @confirm="() => doAction('withdraw', record)">
                    <a type="primary" href="javascript:;">撤回</a>
                  </a-popconfirm>
                </a-menu-item>
                <a-menu-item key="1" v-if="[1, 3, 4].includes(+record.state) && $auth('agencyContractList:edit')">
                  <a type="primary" href="javascript:;" @click="doAction('edit', record)">修改</a>
                </a-menu-item>
                <a-menu-divider />
                <a-menu-item key="2" v-if="+record.state === 1">
                  <a type="primary" href="javascript:;" @click="doAction('pdf', record)">生成PDF</a>
                </a-menu-item>
                <a-menu-item key="3" v-if="[1, 3, 4].includes(+record.state) && $auth('agencyContractList:del')">
                  <a-popconfirm title="确认删除该条数据吗?" @confirm="() => doAction('del', record)">
                    <a type="primary" href="javascript:;">删除</a>
                  </a-popconfirm>
                </a-menu-item>
                <a-menu-item key="4" v-if="+record.state !== 1">
                  <a target="_blank" :href="record.pdfUrl">下载</a>
                </a-menu-item>
                <a-menu-item key="5" v-if="+record.state !== 1">
                  <a type="primary" href="javascript:;" @click="uploadPhoto(record)">附件</a>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </template>

          <!-- <template v-if="+activeKey === 1"> -->
          <!-- <template v-if="+record.state === 2">
              <a-divider type="vertical" />
              <a-popconfirm title="确认撤回该条数据吗?" @confirm="() => doAction('withdraw', record)">
                <a type="primary" href="javascript:;">撤回</a>
              </a-popconfirm>
            </template> -->

          <!-- <template v-if="[1, 3, 4].includes(+record.state) && $auth('agencyContractList:edit')">
              <a-divider type="vertical" />
              <a type="primary" href="javascript:;" @click="doAction('edit', record)">修改</a>
            </template> -->
          <!-- 
            <template v-if="+record.state === 1">
              <a-divider type="vertical" />
              <a type="primary" href="javascript:;" @click="doAction('pdf', record)">生成PDF</a>
            </template> -->
          <!-- 
            <template v-if="[1, 3, 4].includes(+record.state) && $auth('agencyContractList:del')">
              <a-divider type="vertical" />
              <a-popconfirm title="确认删除该条数据吗?" @confirm="() => doAction('del', record)">
                <a type="primary" href="javascript:;">删除</a>
              </a-popconfirm>
            </template> -->

          <!-- <template v-if="+record.state !== 1">
              <a-divider type="vertical" />
              <a target="_blank" :href="record.pdfUrl">下载</a>
            </template>
            <a-divider type="vertical" />
            <a type="primary" href="javascript:;" @click="uploadPhoto(record)">附件</a>
          </template> -->
        </div>
      </a-table>
    </div>
    <ApproveInfo ref="approveInfoCard" />
    <CustomerInfo ref="customerInfoCard" />
    <AddForm ref="addForm" @finish="searchAction({ current: 1 })" />
    <UploadPhoto ref="uploadPhoto" @ok="handleSaveOk" />
  </div>
</template>

<script>
import { listUserBySale } from '@/api/systemSetting'
import {
  agencyContractAddOrUpdate,
  agencyContractApprove,
  agencyContractDel,
  agencyContractDetail,
  agencyContractGenerateContractNum,
  agencyContractPageList,
  agencyContractGenerateFDF,
  agencyContractRevocation,
  agencyContractAttachmentAddOrUpdate,
  agencyContractAttachmentDel,
  agencyContractAttachmentList,
} from '@/api/agencyContract'
import AddForm from './AddForm'

import moment from 'moment'
import ApproveInfo from '@/components/CustomerList/ApproveInfo'
import CustomerInfo from '@/components/CustomerList/CustomerInfo'
import CustomerSelect from '@/components/CustomerList/CustomerSelect'
import UploadPhoto from './UploadPhoto'
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
    title: '合同编号',
    dataIndex: 'contractNum',
  },
  {
    align: 'center',
    title: '客户名称',
    dataIndex: 'customerName',
    scopedSlots: { customRender: 'customerName' },
  },
  {
    align: 'center',
    title: '销售人员',
    dataIndex: 'salesmanName',
  },
  {
    align: 'center',
    title: '协议有效期',
    scopedSlots: { customRender: 'validityDate' },
  },
  {
    align: 'center',
    title: '单据状态',
    dataIndex: 'state',
    scopedSlots: { customRender: 'state' },
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
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' },
  },
]

export default {
  name: 'agency-contract-wrapper',
  components: {
    AddForm,
    CustomerSelect,
    ApproveInfo,
    CustomerInfo,
    UploadPhoto,
  },
  data() {
    return {
      columns: columns,
      dataSource: [],
      depList: [],
      pagination: {
        current: 1,
        _prePageSize: 10,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: (total) => `共有 ${total} 条数据`, //分页中显示总的数据
      },
      loading: false,
      searchParam: {},
      activeKey: 1,
      bindEnterFn: null,
      userInfo: this.$store.getters.userInfo, // 当前登录人
      saleUsers: [],
      customerSelectOptions: {
        showInputLabel: false,
        wrapperStyle: {
          display: 'inline-block',
        },
        formLayout: 'horizontal',
        formItemLayout: {
          labelCol: { span: '' },
          wrapperCol: { span: '' },
        },
        inputRequired: false,
        inputAllowClear: true,
      },
    }
  },
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'agencyContractList') {
          this.init()
        }
      },
      immediate: true,
    },
  },
  mounted() {
    let that = this
    let ele = document.querySelector('#agency-contract-wrapper')
    that.bindEnterFn = (event) => {
      if (event.type === 'keyup' && event.keyCode === 13) {
        //Enter
        that.searchAction()
      }
    }
    if (ele) {
      ele.addEventListener('keyup', that.bindEnterFn)
    }
  },
  methods: {
    moment,
    init() {
      let that = this
      that.searchParam = { ...that.searchParam, queryType: that.activeKey }
      let queue = []
      //let task1 = departmentList().then((res) => (that.depList = res.data))
      //queue.push(task1)
      let task2 = listUserBySale().then((res) => {
        that.saleUsers = res.data
      })
      queue.push(task2)
      that.searchAction()
      return Promise.all(queue)
    },
    consumerInfoShow(record) {
      this.$refs.customerInfoCard.init(record.customerId)
    },
    customAction(type, data) {
      console.log(arguments)
      let searchParam = { ...this.searchParam }
      if (type === 'select') {
        searchParam.customerName = data.name
      } else if (type === 'clear') {
        searchParam.customerName = undefined
      }
      this.searchParam = searchParam
    },
    searchAction(opt = {}) {
      let that = this
      let paginationParam = {
        current: that.pagination.current || 1,
        size: that.pagination.pageSize || 10,
      }
      let _searchParam = Object.assign({}, { ...this.searchParam }, paginationParam, opt)
      console.log('执行搜索...', _searchParam)
      that.loading = true
      agencyContractPageList(_searchParam)
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

    doAction(actionType, record) {
      let that = this
      if (['view', 'add', 'edit', 'approval'].includes(actionType)) {
        that.$refs.addForm.query(actionType, record || {})
      } else if (actionType === 'del') {
        agencyContractDel(`id=${record.id}`)
          .then((res) => {
            that.$message.info(res.msg)
            that.searchAction()
          })
          .catch((err) => {
            that.$message.info(`错误：${err.message}`)
          })
      } else if (actionType === 'withdraw') {
        agencyContractRevocation(`id=${record.id}`)
          .then((res) => {
            that.$message.info(res.msg)
            that.searchAction()
          })
          .catch((err) => {
            that.$message.info(`错误：${err.message}`)
          })
      } else if (actionType === 'pdf') {
        agencyContractGenerateFDF(`id=${record.id}`)
          .then((res) => {
            that.$message.info(res.msg)
          })
          .catch((err) => {
            that.$message.info(`错误：${err.message}`)
          })
      }
    },
    tabChange(tagKey) {
      this.activeKey = parseInt(tagKey)
      this.searchParam = { ...this.searchParam, queryType: this.activeKey }
      this.searchAction({ current: 1 })
    },
    approvalPreview(record) {
      this.$refs.approveInfoCard.init(record.instanceId)
    },
    uploadPhoto(record) {
      this.$refs.uploadPhoto.showForm(record)
    },
    handleSaveOk() {
      this.searchAction()
    },
  },
  beforeDestroy() {
    let that = this
    let ele = document.querySelector('#agency-contract-wrapper')
    ele && that.bindEnterFn && ele.removeEventListener('keyup', that.bindEnterFn)
  },
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
