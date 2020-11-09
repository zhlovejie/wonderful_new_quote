<template>
  <a-card :bordered="false">
    <div class="top-ation">
      <a-form layout="inline" :form="form">
        <a-form-item>
          <a-button-group>
            <a-button type="primary" :class="{currentDayWeekMonth:dayWeekMonth === 1}" @click="simpleSearch(1)">今天</a-button>
            <a-button type="primary" :class="{currentDayWeekMonth:dayWeekMonth === 2}" @click="simpleSearch(2)">本周</a-button>
            <a-button type="primary" :class="{currentDayWeekMonth:dayWeekMonth === 3}" @click="simpleSearch(3)">本月</a-button>
          </a-button-group>
        </a-form-item>
        <a-form-item>
          <a-button
            class="a-button"
            type="primary"
            icon="search"
            @click="openSearchModel"
          >高级筛选</a-button>
        </a-form-item>
        <div class="table-operator fl-r">
          <template v-if="$auth('invoice:add')">
            <a-button type="primary" icon="plus" @click="handleAdd">申请</a-button>
          </template>
        </div>
      </a-form>
    </div>
    <a-row>
      <a-col>
        <div>
          <a-tabs defaultActiveKey="0" @change="paramClick">
            <a-tab-pane tab="全部" key="0" forceRender>
            </a-tab-pane>
            <template v-if="$auth('invoice:approval')">
              <a-tab-pane tab="待审批" key="1">
              </a-tab-pane>
              <a-tab-pane tab="已审批" key="2">
              </a-tab-pane>
            </template>
          </a-tabs>
        </div>
        <a-table
          :columns="columns"
          :dataSource="dataSource"
          :pagination="pagination"
          :loading="loading"
          @change="handleTableChange"
          :expandedRowKeys="expandedRowKeys" 
          @expand="expandHandler"
        >
          <div slot="order" slot-scope="text, record, index">
            <span>{{ index + 1 }}</span>
          </div>
          <span slot="customerName" slot-scope="text, record">
            <a @click="tenderingClick(record)">{{ text }}</a>
          </span>
          <div slot="settlementMethod" slot-scope="text">
            <span v-if="text==1">代付</span>
            <span v-if="text==2">包邮</span>
            <span v-if="text==3">到付</span>
          </div>
          <div slot="delivery" slot-scope="text">
            <span v-if="text==1">客户货站自提</span>
            <span v-if="text==2">送货上门</span>
            <span v-if="text==3">万德福自提</span>
          </div>
          <div slot="invoiceStatus" slot-scope="text, record">
            <a @click="handleClick(record)" v-if="+text === 1">待审批</a>
            <a @click="handleClick(record)" v-if="+text === 2">出库</a>
            <a @click="handleClick(record)" v-if="+text === 3">拒绝</a>
            <a @click="handleClick(record)" v-if="+text === 4">待确认</a>
            <a @click="handleClick(record)" v-if="+text === 5">待出库</a>
            <a @click="handleClick(record)" v-if="+text === 9">已撤回</a>
          </div>
          <a slot="isEnd" slot-scope="text, record" @click="checkIsEnd(record)">
            <span v-if="text==0">未完结</span>
            <span v-if="text==1">已完结</span>
          </a>
          <span slot="action" slot-scope="text, record">
            <template v-if="$auth('invoice:one')">
              <a @click="handleSee(record)">查看</a>
            </template>
            <template v-if="$auth('invoice:one')">
              <a-divider  v-if="audit==0" type="vertical"/>
              <a target="_blank" v-if="audit==0" :href=record.wordUrl>下载</a>
            </template>
            <template v-if="$auth('invoice:one')">
              <a-divider v-if="audit==1&&userInfo.id!=1" type="vertical"/>
              <a v-if="audit==1&&userInfo.id!=1" @click="handleApproval(record)">审核</a>
            </template>

            <template v-if="$auth('invoice:edit') && (+record.invoiceStatus === 3 || +record.invoiceStatus === 9) && userInfo.id === record.createdId">
              <a-divider type="vertical"/>
              <a @click="updateInvoice(record)">重新提交</a>
            </template>

            <template v-if="$auth('invoice:del') && userInfo.id === record.createdId && (+record.invoiceStatus === 2 || +record.invoiceStatus === 9)">
              <a-divider type="vertical"/>
              <a-popconfirm
                title="确认删除这条数据？"
                @confirm="handleDelete(record.id)"
                okText="是"
                cancelText="否">
                <a href="#">删除</a>
              </a-popconfirm>
            </template>

            <template v-if="+record.invoiceStatus === 1">
              <a-divider type="vertical"/>
              <a-popconfirm title="确认撤回该条数据吗?" @confirm="() => doAction('reback',record)">
                <a type="primary" href="javascript:;">撤回</a>
              </a-popconfirm>
            </template>
          </span>

          <a-table
            slot="expandedRowRender"
            slot-scope="record, index, indent, expanded"
            :columns="innerColumns"
            :dataSource="record.products"
            :pagination="false" 
            size="small"
          >
          
          <div slot="productModel" slot-scope="text">
            <a-tooltip v-if="String(text).length > 10">
              <template slot="title">{{text}}</template>
              {{ String(text).slice(0,10) }}...
            </a-tooltip>
            <span v-else>{{text}}</span>
          </div>
          <div slot="productName" slot-scope="text">
            <a-tooltip v-if="String(text).length > 10">
              <template slot="title">{{text}}</template>
              {{ String(text).slice(0,10) }}...
            </a-tooltip>
            <span v-else>{{text}}</span>
          </div>
          <div slot="productStandard" slot-scope="text">
            <a-tooltip v-if="String(text).length > 10">
              <template slot="title">{{text}}</template>
              {{ String(text).slice(0,10) }}...
            </a-tooltip>
            <span v-else>{{text}}</span>
          </div>
          <div slot="company" slot-scope="text">
            {{getCompanyTxt(text)}}
          </div>
          
          </a-table>
        </a-table>
      </a-col>
    </a-row>
    <InvestigateNode ref="node"/>
    <Tendering ref="tenderingModel"></Tendering>
    <SearchForm ref="searchForm" @change="paramChangeHandler" />
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { getInvoiceList, update, deleteInvoice ,revocationInvoice} from '@/api/invoice'
import InvestigateNode from '../record/InvestigateNode'
import Tendering from '../record/TenderingUnit'
import { getLoginUser } from '@api/systemSetting'
import SearchForm from './modules/SearchForm'
const innerColumns = [
  {
    align: 'center',
    title: '产品代码',
    dataIndex: 'productModel',
    key: 'productModel',
    width:'200px',
    scopedSlots: { customRender: 'productModel' },
  },
  {
    align: 'center',
    title: '产品名称',
    dataIndex: 'productName',
    key: 'productName',
    scopedSlots: { customRender: 'productName' },
    width:'200px'
  },
  {
    align: 'center',
    title: '规格型号',
    dataIndex: 'productStandard',
    key: 'productStandard',
    scopedSlots: { customRender: 'productStandard' },
    width:'200px'
  },
  {
    align: 'center',
    title: '单位',
    dataIndex: 'company',
    key: 'company',
    scopedSlots: { customRender: 'company' },
    width:'100px'
  },
  {
    align: 'center',
    title: '数量',
    dataIndex: 'invoiceCount',
    key: 'invoiceCount',
    scopedSlots: { customRender: 'invoiceCount' },
    width:'100px'
  }
]

export default {
  name: 'Invoice',
  components: {
    Tendering,
    InvestigateNode,
    STable,
    SearchForm
  },
  data () {
    return {
      form: this.$form.createForm(this),
      // 查询参数
      queryParam: {
        dayWeekMonth:1
      },
      recordResult: {},
      queryRecord: {},
      contractState: 0,
      saleCustomer: 0,
      vueBoolean: this.$store.getters.vueBoolean,
      customerName: '',
      saleCustomers: [],
      audit: 0,
      userInfo: {},
      showFlag: true,
      approveStatus:0,
      innerColumns:innerColumns,
      // 表头
      columns: [
        {
          align: 'center',
          title: '序号',
          key: 'order',
          width: '70px',
          scopedSlots: { customRender: 'order' }
        },
        {
          title: '发货编号',
          dataIndex: 'invoiceNum',
          // key: 'title',
          scopedSlots: { customRender: 'invoiceNum' }
        },
        {
          title: '客户名称',
          dataIndex: 'customerName',
          scopedSlots: { customRender: 'customerName' }
        },
        {
          title: '运费结算方式',
          dataIndex: 'settlementMethod',
          scopedSlots: { customRender: 'settlementMethod' }
        }, {
          title: '收货人',
          dataIndex: 'consignee'
        }, {
          title: '联系方式',
          dataIndex: 'contactInformation'
        }, {
          title: '单据状态',
          dataIndex: 'invoiceStatus',
          scopedSlots: { customRender: 'invoiceStatus' }
        }, 
        // {
        //   title: '是否完结',
        //   dataIndex: 'isEnd',
        //   scopedSlots: { customRender: 'isEnd' }
        // }, 
        {
          title: '申请人',
          dataIndex: 'createdName'
        }, {
          title: '申请时间',
          dataIndex: 'createdTime'
        },
        {
          title: '操作',
          dataIndex: 'id',
          width: '200px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getInvoiceList(Object.assign(parameter, this.queryParam))
          .then(res => {
            return res
          })
      },
      selectedRowKeys: [],
      selectedRows: [],
      dayWeekMonth:1,
      isExpanded:false, //是否展开列表子数据
      expandedRowKeys:[],
      dataSource: [],
      pagination: {
        current: 1
      },
      loading:false
    }
  },
  watch: {
    $route (to, from) {
      console.log('from.fullPath', from.fullPath)
      if (to.name === 'invoice') {
        this.searchAction()
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    handleDelete (id) {
      deleteInvoice({ id: id }).then(res => {
        if (res.code === 200) {
          this.handleSaveOk()
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    init () {
      // 获取当前登录用户信息
      getLoginUser().then((res) => {
        this.userInfo = res.data
      })
      this.searchAction()
    },
    searchAction(opt) {
      let that = this
      let _searchParam = Object.assign({}, { ...that.queryParam }, { ...that.pagination }, opt || {})
      console.log('执行搜索...', _searchParam)
      that.loading = true
      getInvoiceList(_searchParam)
        .then(res => {
          that.loading = false
          that.dataSource = res.data.records.map((item, index) => {
            item.key = index + 1
            return item
          })

          that.expandedRowKeys = that.isExpanded ?  that.dataSource.map(item => item.key) : []

          //设置数据总条数
          const pagination = { ...that.pagination }
          pagination.total = res.data.total
          that.pagination = pagination
        })
        .catch(err => (that.loading = false))
    },
    // 分页
    handleTableChange(pagination, filters, sorter) {
      console.log(pagination, filters, sorter)
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.searchAction()
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      console.log('onSelectChange 点击了')
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    handleClick (record) {
      console.log('JSON.stringify(record) :' + JSON.stringify(record))
      this.$refs.node.query(record)
    },
    handleSaveOk () {
      //this.searchAction()
      this.searchAction()
    },
    handleSaveClose () {

    },
    tenderingClick (record) {
      console.log('record' + JSON.stringify(record))
      const data = { 'id': record.customerId }
      this.$refs.tenderingModel.look(data)
    },
    paramClick (key) {
      if (key == 1) {
        this.showFlag = false
        this.audit = 1
        this.contractState = 1
      } /*else {
        this.showFlag = true
        this.audit = 0
      }*/

      if (key == 2) {
        this.audit = 2
        this.showFlag = false
        this.contractState = 2
      }

      if (key == 0) {
        this.audit = 0
        this.showFlag = true
        this.contractState = 0
      }
      this.queryParam.statue = key
      //this.searchAction()
      this.searchAction()
      console.log(key)
    },
    handleAdd () {
      this.$router.push({ name: 'invoiceModules', params: { type: 'Add' } })
    },
    handleSee (e) {
      this.$router.push({ name: 'invoiceApproval', params: { record: e, type: 'See' } })
    },
    handleApproval (e) {
      this.$router.push({ name: 'invoiceApproval', params: { record: e, type: 'Approval' } })
    },
    handleAuditOk () {
      this.searchAction()
    },
    handleAuditClose () {
      this.searchAction()
    },
    updateInvoice(record){
      this.$router.push({ name: 'invoiceModules', params: { record,type: 'Edit' } })
    },
    openModel () {
      console.log('openModel click')
      this.$refs.invoiceContract.query()
    },

    // 删除
    checkIsEnd (record) {
      const _this = this
      var text = ''
      if (record.isEnd == 0) {
        text = '已完结'
      } else {
        text = '未完结'
      }
      this.$confirm({ title: '警告',
        content: `是否更改状态为${text}`,
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk () {
          // 在这里调用删除接口
          update(record).then(res => {
            if (res.code == 200) {
              _this.searchAction()
            }
          })
        },
        onCancel () {
          console.log('Cancel')
        }
      })
    },
    getCompanyTxt(type){
      let m = {
        0:'套',
        1:'台',
        2:'个',
        3:'块',
        4:'条',
        5:'根',
        6:'张',
        7:'卷'
      }
      return m[type] || '未知'
    },
    simpleSearch(type){
      this.isExpanded = false
      this.dayWeekMonth = this.dayWeekMonth === type ? undefined : type
      this.queryParam.dayWeekMonth = this.dayWeekMonth
      this.searchAction()
    },
    openSearchModel(){
      this.$refs.searchForm.query()
    },
    paramChangeHandler(params){
      this.isExpanded = true
      this.queryParam = Object.assign({},params)
      this.searchAction()
    },
    expandHandler(expanded,record){
      console.log(arguments)
      if(expanded){
        this.expandedRowKeys = [...this.expandedRowKeys,record.key]
      }else{
        this.expandedRowKeys = this.expandedRowKeys.filter(val => val !== record.key)
      }
    },
    doAction(type,record){
      let that = this
      if(type === 'reback'){
        revocationInvoice({id:record.id}).then(res =>{
          that.$message.info(res.msg)
          that.searchAction()
        })
        return
      }
    }
  }
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
  .currentDayWeekMonth{opacity: .7;}
</style>
