<template>
  <div>
    <a-spin :spinning="spinning">
      <a-table
        ref="table"
        :columns="columns"
        rowKey="id"
        :dataSource="data"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <div slot="order" slot-scope="text, record, index">
          <span>{{ index + 1 }}</span>
        </div>
        <a slot="customerName" slot-scope="text, record" @click="consumerInfo(record)">{{ text }}</a>
        <a slot="approvalStatus" slot-scope="text, record" @click="approvalPreview(record)">
          {{ { '-1': '待提交', 0: '待审批', 2: '通过', 4: '待审批', 9: '已撤回' }[text] || '不通过' }}
          <!-- <span v-if="parseInt(text) === -1">待提交</span>
          <span v-else-if="parseInt(text) === 0 || parseInt(text) == 4">待审批</span>
          <span v-else-if="parseInt(text) === 2">通过</span>
          <span v-else>不通过</span> -->
        </a>
        <div slot="contractStatus" slot-scope="text">
          {{ { '-1': '请选择合同状态', 0: '未启动', 1: '已启动', 2: '已作废' }[text] }}
          <!-- <span v-if="text === -1">请选择合同状态</span>
          <span v-if="text === 0">未启动</span>
          <span v-if="text === 1">已启动</span>
          <span v-if="text === 2">已作废</span> -->
        </div>
        <div slot="freightCharge" slot-scope="text, record">
          <span>{{
            record.freightType === 0
              ? Math.ceil(record.isTax === 1 ? record.freightCharge * 1.13 : record.freightCharge) || 0
              : '0'
          }}</span>
        </div>
        <span slot="isDisabled" slot-scope="text, record">
          <template v-if="$auth('distributionContract:edit') && record.createdId === user.id">
            <!-- :checked="record.isDisabled === 0" -->
            <!-- :disabled="record.isDisabled === 1" -->
            <!-- :defaultChecked="text === 0 ? true : false" -->
            <!-- :defaultChecked="record.isDisabled === 0 ? true : false" -->
            <a-switch
              :checked="record.isDisabled === 0 ? true : false"
              checkedChildren="启用"
              unCheckedChildren="禁用"
              @change="changeDisabled($event, record)"
            />
          </template>
          <template v-else>
            <span v-if="record.isDisabled === 0">启用</span>
            <span v-if="record.isDisabled === 1">禁用</span>
          </template>
        </span>
        <div class="action-btns" slot="action" slot-scope="text, record">
          <template v-if="$auth('distributionContract:one')">
            <!-- <a type="primary" @click="showModal('edit', record)">查看</a> -->
            <a type="primary" @click="SeeSaleContract(record)">查看</a>
          </template>
          <template>
            <a-divider type="vertical" />
            <a-dropdown :trigger="['click']">
              <a class="ant-dropdown-link" @click="(e) => e.preventDefault()">更多 <a-icon type="down" /> </a>
              <a-menu slot="overlay">
                <a-menu-item key="1" v-if="$auth('distributionContract:one') && record.contractStatus === 1">
                  <a type="primary" @click="copyContract(record)">复制合同</a></a-menu-item
                >
                <a-menu-item
                  key="2"
                  v-if="
                    $auth('distributionContract:change') &&
                    record.operatorStatus !== 0 &&
                    record.approvalStatus !== 0 &&
                    record.createdId === user.id
                  "
                >
                  <a type="primary" @click="editSaleContract(record)">修改</a></a-menu-item
                >
                <a-menu-item
                  key="3"
                  v-if="
                    $auth('distributionContract:changeProduct') &&
                    (record.approvalStatus === 5 || record.operatorStatus === 3)
                  "
                >
                  <a type="primary" @click="splitOrderAction(record)">重新拆分</a></a-menu-item
                >
                <a-menu-item
                  key="4"
                  v-if="$auth('distributionContract:one') && record.contractStatus === 1 && record.orderNum != null"
                >
                  <a type="primary" @click="viewSalesOrders(record.id)">查看销售订单</a></a-menu-item
                >
                <a-menu-item
                  key="5"
                  v-if="
                    $auth('distributionContract:edit') && record.contractStatus === 1 && record.approvalStatus === 2
                  "
                >
                  <a type="primary" @click="addDelayedPayment(record)">申请延迟付款单</a></a-menu-item
                >
                <a-menu-item
                  key="6"
                  v-if="
                    $auth('distributionContract:edit') && record.contractStatus === 1 && record.approvalStatus === 2
                  "
                >
                  <a type="primary" @click="uploadPhoto(record)">附件</a></a-menu-item
                >
                <a-menu-item
                  key="7"
                  v-if="
                    $auth('distributionContract:change') &&
                    (record.approvalStatus === -1 || record.approvalStatus === 9)
                  "
                >
                  <a type="primary" @click="submitApprove(record)">提交审批</a>
                </a-menu-item>
                <a-menu-item key="8" v-if="userInfo.id === 1">
                  <a type="primary" @click="createPdf(record)">生成pdf</a>
                </a-menu-item>
                <a-menu-item key="9" v-if="$auth('distributionContract:delete')">
                  <a type="primary" @click="deleteCurrentContract(record)">删除</a>
                </a-menu-item>
                <a-menu-item key="10" v-if="[0, 4].includes(+record.approvalStatus)">
                  <a-popconfirm title="确认撤回该条数据吗?" @confirm="() => doAction('reback', record)">
                    <a type="primary" href="javascript:;">撤回</a>
                  </a-popconfirm>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </template>
        </div>
      </a-table>
    </a-spin>
    <a-modal title="客户信息" v-model="visible" :footer="null" :maskClosable="false">
      <p>客户名称：{{ infoCustomerName }}</p>
      <p>联系人：{{ linkManName }}</p>
      <p>联系方式：{{ linkManPhone }}</p>
      <p>微信号：{{ linkManWeChat }}</p>
      <p>地址：{{ customerAddress }}</p>
    </a-modal>
    <a-modal title="审批预览" v-model="priewVisible" :footer="null" :maskClosable="false">
      <a-table :columns="priewColumns" rowKey="id" :dataSource="priewData" :pagination="false" :loading="loading">
        <div slot="order" slot-scope="text, record, index">
          <span>{{ index + 1 }}</span>
        </div>
      </a-table>
    </a-modal>
    <upload-photo ref="uploadPhoto" @ok="handleSaveOk" />
    <photo-view ref="photoView" />
  </div>
</template>

<script>
import {
  buildCreateWork,
  getSalesList,
  getsaveAdditionalClause,
  editContract,
  startSaleContractProcess,
  deleteContract,
  copyContract,
  revocationContract,
} from '../../../../api/contractListManagement'
import { getCustomerInfo } from '../../../../api/pricingModule'
import UploadPhoto from './UploadPhoto'
import PhotoView from './PhotoView'
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
    key: 'contractNum',
    width: '150px',
  },
  {
    align: 'center',
    title: '客户名称',
    dataIndex: 'saleCustomerName',
    key: 'saleCustomerName',
    scopedSlots: { customRender: 'customerName' },
    width: '200px',
  },
  {
    align: 'center',
    title: '对应销售',
    key: 'saleUserTrueName',
    dataIndex: 'saleUserTrueName',
    scopedSlots: { customRender: 'saleUserTrueName' },
    width: '100px',
  },
  {
    align: 'center',
    title: '运费(元)',
    key: 'freightCharge',
    dataIndex: 'freightCharge',
    scopedSlots: { customRender: 'freightCharge' },
    width: '100px',
  },
  {
    align: 'center',
    title: '审批状态',
    dataIndex: 'approvalStatus',
    key: 'approvalStatus',
    scopedSlots: { customRender: 'approvalStatus' },
    width: '100px',
  },
  {
    align: 'center',
    title: '合同状态',
    key: 'contractStatus',
    dataIndex: 'contractStatus',
    scopedSlots: { customRender: 'contractStatus' },
    width: '100px',
  },
  {
    align: 'center',
    width: '100px',
    title: '使用状态',
    key: 'isDisabled',
    dataIndex: 'isDisabled',
    scopedSlots: { customRender: 'isDisabled' },
  },
  {
    align: 'center',
    title: '操作人',
    key: 'modifierName',
    dataIndex: 'modifierName',
    width: '100px',
  },
  {
    align: 'center',
    title: '操作时间',
    key: 'modifyTime',
    dataIndex: 'modifyTime',
    width: '150px',
  },
  {
    align: 'center',
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' },
    width: '200px',
  },
]
const priewColumns = [
  {
    align: 'center',
    title: '序号',
    key: 'order',
    scopedSlots: { customRender: 'order' },
  },
  {
    align: 'center',
    title: '审核人',
    dataIndex: 'userName',
    key: 'userName',
    scopedSlots: { customRender: 'userName' },
  },
  {
    align: 'center',
    title: '审核时间',
    key: 'createTime',
    dataIndex: 'createTime',
  },
  {
    align: 'center',
    title: '备注',
    key: 'code',
    dataIndex: 'code',
  },
]
export default {
  name: 'AllTheContract',
  components: {
    UploadPhoto,
    PhotoView,
  },
  props: ['contractNum','customerId','customerName','contractStatus','approveStatus'],
  data() {
    return {
      userInfo: this.$store.getters.userInfo,
      data: [],
      columns: columns,
      priewColumns: priewColumns,
      priewData: [],
      pagination1: { current: 1 },
      pagination: {
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: (total) => '共' + total + '条数据', //分页中显示总的数据
        onShowSizeChange: (current, pageSize) => ((this.pagination1.size = pageSize), this.getList()),
      },
      loading: false,
      visible: false,
      priewVisible: false, // 审批状态弹出层
      infoCustomerName: '', // 客户名称
      linkManName: '', // 联系人名称
      linkManPhone: '', // 联系人手机号
      customerAddress: '', // 联系地址
      linkManWeChat: '', // 联系人微信号
      selectedRowKeys: [],
      selectedRows: [],
      user: this.$store.getters.userInfo, // 当前登录人,
      status: 0,
      spinning: false, //加载中状态
    }
  },
  computed: {},
  watch: {},
  cerated() {},
  mounted() {
    this.init()
  },
  methods: {
    changeDisabled(text, record) {
      let arr = text === true ? 0 : 1
      // record.isDisabled = arr
      editContract({ id: record.id, isDisabled: arr })
        .then((res) => {
          if (res.code === 200) {
            this.$message.success('修改成功')
            this.getList()
          } else {
            this.$message.error(res.msg)
            // this.$set(record, 'isDisabled', (isDisabled = arr))
          }
        })
        .catch(function (err) {
          console.log(err)
        })
    },
    uploadPhoto(record) {
      this.$refs.uploadPhoto.showForm(record)
    },
    submitApprove(record) {
      const _this = this
      const param = { contractId: record.id }
      //console.log(_this)
      //return

      this.$confirm({
        title: '提示',
        content: `确认提交合同？`,
        okText: '确定',
        cancelText: '取消',
        onOk() {
          // 在这里调用删除接口
          _this.spinning = true
          startSaleContractProcess(param)
            .then((res) => {
              if (res.code === 200) {
                _this.spinning = false
                _this.$message.success('提交成功')
                //console.log(_this)
                //_this.$refs.table.refresh(true)
                _this.init()
              } else {
                _this.$message.error(res.msg)
              }
            })
            .catch((err) => {
              _this.spinning = false
            })
        },
      })
    },
    deleteCurrentContract(record) {
      const _this = this
      const param = { contractId: record.id }
      //console.log(_this)
      //return

      this.$confirm({
        title: '提示',
        content: `确认删除合同？`,
        okText: '确定',
        cancelText: '取消',
        onOk() {
          // 在这里调用删除接口
          deleteContract(param)
            .then((res) => {
              if (res.code === 200) {
                _this.$message.success('删除成功')
                //console.log(_this)
                //_this.$refs.table.refresh(true)
                _this.init()
              } else {
                _this.$message.error(res.msg)
              }
            })
            .catch((err) => {})
        },
      })
    },
    init() {
      // 获取销售合同列表数据
      this.getList()
    },
    // 获取列表
    getList(params = {}) {
      console.log('approveStatus----:' + this.approveStatus)
      params = {
        status: this.status,
        contractStatus: this.contractStatus, // 合同状态：0未启动 1已启动，不传查所有
        contractNum: this.contractNum || '', // 不传入合同编号模糊获取到的是所有的信息
        customerId: this.customerId || '', // 不传入客户id获取到的是所有的信息
        approveStatus: this.approveStatus,
        customerName:this.customerName || '',
      }
      let _searchParam = Object.assign({}, { ...params }, { ...this.pagination1 } || {})
      this.loading = true
      getSalesList(_searchParam)
        .then((res) => {
          this.loading = false
          this.data = res.data.records
          console.log('获取销售合同列表结果this.data', this.data)
          const pagination = { ...this.pagination }
          pagination.total = res.data.total
          this.pagination = pagination
        })
        .catch((error) => {
          this.loading = false
          console.error(error)
        })
    },
    // 分页
    handleTableChange(pagination, filters, sorter) {
      this.pagination1.size = pagination.pageSize
      this.pagination1.current = pagination.current
      this.getList()
    },

    // 客户信息弹框
    consumerInfo(record) {
      console.log('客户信息弹框record', record)
      this.visible = true
      const params = {
        id: record.customerId,
      }
      console.log('客户信息弹框params', params)
      // 获取客户信息
      getCustomerInfo(params)
        .then((res) => {
          console.log('//获取客户信息', res)
          ;(this.infoCustomerName = res.data.customerName),
            (this.linkManName = res.data.linkManName),
            (this.linkManPhone = res.data.linkManPhone),
            (this.customerAddress = res.data.customerAddress),
            (this.linkManWeChat = res.data.linkManWeChat)
        })
        .catch((error) => {
          this.loading = false
          console.error(error)
        })
    },
    createPdf(record) {
      // 保存信息成功之后，调取生成合同PDF的接口，留作列表页导出使用
      const _this = this
      const paramsc = {
        id: record.id,
      }
      buildCreateWork(paramsc)
        .then((res) => {
          _this.$message.success('生成pdf成功')
          console.log('调取生成合同PDF的接口，留作列表页导出使用', res)
        })
        .catch((error) => {
          console.error(error)
        })
    },
    // 审批预览弹出层
    approvalPreview(record) {
      this.priewVisible = true
      const params = {
        contractId: record.id,
      }
      // 获取审批预览信息
      getsaveAdditionalClause(params)
        .then((res) => {
          this.priewData = res.data
        })
        .catch((error) => {
          this.loading = false
          console.error(error)
        })
    },
    // 查看销售订单,跳转到销售订单页面，并向目标页面传递参数
    viewSalesOrders(record) {
      this.$router.push({ name: 'orderModule', params: { contractId: record, show: true, type: 1 } })
    },
    editSaleContract(record) {
      this.$router.push({
        name: 'basicInformation1',
        params: { id: record.id, action: 'edit', from: 'distributionContractList' },
      })
    },
    SeeSaleContract(record) {
      this.$router.push({
        name: 'basicInformation1',
        params: { id: record.id, idx: record, action: 'see', from: 'distributionContractList' },
      })
    },
    splitOrderAction(record) {
      //拆分订单
      this.$router.push({
        name: 'basicInformation1',
        params: { id: record.id, action: 'split', from: 'distributionContractList' },
      })
    },
    // 导出多选框
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
      console.log('导出多选框selectedRowKeys:', selectedRowKeys)
      console.log('导出多选框selectedRows:', selectedRows)
    },
    addDelayedPayment(record) {
      // 跳转到申请延迟付款单界面
      this.$router.push({ name: 'addDelayedPayment', params: { id: record.id, contractType: '1' } })
    },
    // showModal(action, record) {
    //   if (record.contractAttribute === 1) {
    //     // 选择三方合同
    //     this.$router.push({ name: 'previewTripartiteContract', params: { queryOneData: record, action: action } })
    //     console.log('queryOneData:record', record)
    //   } else {
    //     if (record.isTax === 1) {
    //       // 含税--选择销售合同
    //       this.$router.push({ name: 'previewSalesContract', params: { queryOneData: record, action: action } })
    //       console.log('queryOneData:record', record)
    //     } else {
    //       this.$router.push({ name: 'previewProductOrderForm', params: { queryOneData: record, action: action } })
    //       console.log('queryOneData:record', record)
    //     }
    //   }
    // },
    copyContract(record) {
      const _this = this
      const param = { id: record.id }
      this.$confirm({
        title: '提示',
        content: `确认复制合同编号为` + record.contractNum + `的合同吗？`,
        okText: '确定',
        cancelText: '取消',
        onOk() {
          _this.spinning = true
          copyContract(param)
            .then((res) => {
              _this.spinning = false
              if (res.code === 200) {
                _this.$message.success('复制成功')
                _this.init()
              } else {
                _this.$message.error(res.msg)
              }
            })
            .catch((err) => {
              _this.spinning = false
            })
        },
      })
    },
    exportWord(record) {
      const link = document.createElement('a')
      link.href = record.wordUrl
      link.download = 'lslsls'
      link.target = '_blank'
      // 此写法兼容可火狐浏览器
      document.body.appendChild(link)
      const evt = document.createEvent('MouseEvents')
      evt.initEvent('click', false, false)
      link.dispatchEvent(evt)
      document.body.removeChild(link)
    },
    handleSaveOk() {
      this.init()
    },
    doAction(type, record) {
      let that = this
      if (type === 'reback') {
        revocationContract({ id: record.id }).then((res) => {
          that.$message.info(res.msg)
          that.init()
        })
        return
      }
    },
  },
}
</script>

<style lang="less" scoped>
.action-btns button:not(:first-child) {
  margin-left: 8px;
}
</style>
