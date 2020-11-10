<template>
  <a-card :bordered="false">
    <!--div写新增-->

    <!--搜索模块-->
    <div class="electronic-receipt-search-wrapper">
      <a-form layout="inline">
        <a-form-item label="交款单位">
          <a-input v-model.trim="queryParam.customerName" placeholder="根据名称模糊查询" />
        </a-form-item>
        <template v-if="$auth('electronicReceipt:list')">
          <a-form-item>
            <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
          </a-form-item>
        </template>
        <div class="action-wrapper" style="float: right">
          <a-form-item>
            <template v-if="$auth('electronicReceipt:add')">
              <a-dropdown>
                <a-menu slot="overlay" @click="handleMenuClick">
                  <a-menu-item key="1">单位收据</a-menu-item>
                  <a-menu-item key="2">个人收据</a-menu-item>
                </a-menu>
                <a-button type="primary"> 申请 <a-icon type="down" /> </a-button>
              </a-dropdown>
              <!-- <a-button class="fl-r" type="primary" @click="handleAdd" icon="plus">申请</a-button> -->
            </template>
          </a-form-item>
        </div>
      </a-form>
    </div>
    <a-layout>
      <!--  此处编写表单中的功能按钮    -->
      <a-layout-content>
        <s-table
          ref="table"
          size="default"
          rowKey="id"
          :columns="columns"
          :data="loadData"
          :alert="false"
          :pagination="pagination"
        >
          <div slot="order" slot-scope="text, record, index">
            <span>{{ index + 1 }}</span>
          </div>
          <div slot="type" slot-scope="text, record, index">
            <span>{{ parseInt(text, 10) === 1 ? '单位' : '个人' }}收据</span>
          </div>
          <div slot="payment" slot-scope="text, record">
            <div v-if="text == 1">银行卡</div>
            <div v-if="text == 2">微信</div>
            <div v-if="text == 3">支付宝</div>
            <div v-if="text == 4">现金</div>
          </div>
          <div slot="money" slot-scope="text, record, index">
            <span>{{ text | moneyFormatNumber }}</span>
          </div>

          <span slot="action" slot-scope="text, record">
            <template v-if="$auth('electronicReceipt:one')">
              <a @click="handleSee(record)">查看</a>
            </template>
            <template v-if="$auth('electronicReceipt:list')">
              <a-divider type="vertical" />
              <a target="_blank" :href="record.wordUrl">下载</a>
            </template>
            <template v-if="$auth('electronicReceipt:del') && userInfo.id === record.createdId">
              <a-divider type="vertical" />
              <a-popconfirm title="确认删除这条数据？" @confirm="handleDelete(record.id)" okText="是" cancelText="否">
                <a href="#">删除</a>
              </a-popconfirm>
            </template>
          </span>
        </s-table>
      </a-layout-content>
    </a-layout>
    <modal ref="modal" @ok="handleSaveOk" @close="handleSaveClose" />
    <modal ref="queryModal" @ok="handleSaveOk" @close="handleSaveClose" />
  </a-card>
</template>
<script>
import { getReceiptList, deleteReceipt } from '@api/electronicReceipt'
import { STable } from '@/components'
import Modal from './modules/receipt'
import system from '@/config/defaultSettings'
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
    title: '收据类型',
    key: 'type',
    dataIndex: 'type',
    scopedSlots: { customRender: 'type' },
  },
  {
    align: 'center',
    title: '收据编号',
    key: 'receiptCode',
    dataIndex: 'receiptCode',
  },

  {
    align: 'center',
    title: '交款单位',
    dataIndex: 'customerName',
    key: 'customerName',
  },
  {
    align: 'center',
    title: '收款日期',
    dataIndex: 'entryTime',
    key: 'entryTime',
  },
  {
    align: 'center',
    title: '人民币',
    dataIndex: 'money',
    key: 'money',
    scopedSlots: { customRender: 'money' },
  },
  {
    align: 'center',
    title: '申请人',
    key: 'createdName',
    dataIndex: 'createdName',
  },
  {
    align: 'center',
    title: '申请时间',
    key: 'createdTime',
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
  name: 'ElectronicReceipt',
  components: {
    // 组件
    STable,
    Modal,
    system,
  },
  data() {
    return {
      // 查询参数
      queryParam: {},
      selectedRowKeys: [],
      selectedRows: [],
      // 表头
      pagination: {
        showTotal: (total) => '共' + total + '条数据',
      },
      columns: columns,
      userInfo: this.$store.getters.userInfo,
      // 初始化加载 必须为 Promise 对象
      loadData: (parameter) => {
        console.log('页面开始加载数据。。。', parameter, this.queryParam)
        return getReceiptList(Object.assign(parameter, this.queryParam))
          .then((res) => {
            return res
          })
          .catch((error) => {
            this.loading = false
            console.error(error)
          })
      },
    }
  },
  watch: {
    $route(to, from) {
      console.log('from.fullPath', from.fullPath)
      if (from.fullPath === '/sale/addReceipt') {
        this.$refs.table.refresh(true)
      }
    },
  },
  methods: {
    // 新增
    // handleAdd () {
    //   this.$refs.modal.add()
    // },
    // 申请单据
    handleAdd(type) {
      //type 1 单位收据  2 个人收据
      this.$router.push({ name: 'addReceipt', params: { actionType: type } })
    },
    handleSee(record) {
      this.$router.push({ name: 'receiptModule', params: { record: record } })
    },
    // handleDownload (record) {
    //   var link = document.createElement('a')
    //   link.href = system.baseURL + '/electronicReceipt/download?id=' + record.id
    //   link.download = 'lslsls'
    //   link.target = '_blank'
    //   // 此写法兼容可火狐浏览器
    //   document.body.appendChild(link)
    //   var evt = document.createEvent('MouseEvents')
    //   evt.initEvent('click', false, false)
    //   link.dispatchEvent(evt)
    //   document.body.removeChild(link)
    // },
    handleDelete(id) {
      deleteReceipt({ id: id }).then((res) => {
        if (res.code === 200) {
          this.handleSaveOk()
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 详情
    query(e) {
      this.$refs.queryModal.query(e)
    },
    handleSaveOk() {
      this.$refs.table.refresh(true)
    },
    handleSaveClose() {},
    handleEditOk() {
      this.$refs.table.refresh(true)
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      console.log('onSelectChange 点击了')
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    handleMenuClick(e) {
      this.handleAdd(parseInt(e.key, 10))
    },
  },
}
</script>

<style scoped>
</style>
