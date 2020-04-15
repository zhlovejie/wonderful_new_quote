<template>
  <a-card :bordered="false">
    <div class="top-ation">
      <a-form layout="inline" :form="form">
        <a-form-item label="客户名称">
          <a-input v-model="customerName"/>
        </a-form-item>
        <a-form-item label="审批状态"  v-show="show">
          <a-select style="width: 150px" v-model="approvalStatusSelect" defaultValue="0">
            <a-select-option :value="0">请选择审批状态</a-select-option>
            <a-select-option :value="1">待审批</a-select-option>
            <a-select-option :value="2">通过</a-select-option>
            <a-select-option :value="3">不通过</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <template v-if="$auth('paper:list')">
            <a-button class="a-button" type="primary" icon="search" @click="search">查询</a-button>
          </template>
        </a-form-item>
        <div class="table-operator fl-r">
          <template v-if="$auth('paper:add')">
            <a-dropdown>
              <a-menu slot="overlay" @click="handleAdd">
                <a-menu-item key="1"><a-icon type="file" />销售合同开票单</a-menu-item>
                <a-menu-item key="2"><a-icon type="file" />软件合同开票单</a-menu-item>
              </a-menu>
              <a-button type="primary" style="margin-left: 8px"> 新建 <a-icon type="plus"/> </a-button>
            </a-dropdown>
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
            <template v-if="$auth('paper:approval')">
              <a-tab-pane tab="待审批" key="5">
              </a-tab-pane>
              <a-tab-pane tab="已审批" key="2">
              </a-tab-pane>
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
            <span v-if="text==1">常规开票</span>
            <span v-if="text==2">特殊开票</span>
          </div>
          <div slot="paperStatue" slot-scope="text, record">
            <a @click="handleClick(record)" v-if="text==1">待审批</a>
            <a @click="handleClick(record)" v-if="text==2">通过</a>
            <a @click="handleClick(record)" v-if="text==3">不通过</a>
          </div>
          <div slot="paperIsend" slot-scope="text, record">
            <span v-if="text==1">未完结</span>
            <span v-if="text==2">已完结</span>
          </div>
          <span slot="action" slot-scope="text, record">
            <template v-if="$auth('paper:one')">
              <a @click="handleVue(record)">查看</a>
            </template>
            <template v-if="$auth('paper:edit')">
              <a-divider v-if="audit" type="vertical"/>
              <a v-if="audit" @click="handleAudit(record)">审核</a>
            </template>
            <template v-if="$auth('paper:del') && record.paperStatue === 2 && record.createdId === userInfo.id">
              <a-divider type="vertical"/>
              <a v-if="!audit" class="delete" @click="() => del(record)">删除</a>
            </template>
            <template v-if="$auth('paper:edit') && record.paperStatue === 3 && record.createdId === userInfo.id">
              <a-divider type="vertical"/>
              <a @click="handleEdit(record)">重新提交</a>
            </template>

          </span>
        </s-table>
      </a-col>
    </a-row>
    <InvestigateNode ref="node"/>
    <Tendering ref="tenderingModel"></Tendering>
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { getServiceList, openPaperDelete } from '@/api/openpaper'
import InvestigateNode from '../record/InvestigateNode'
import Tendering from '../record/TenderingUnit'

export default {
  name: 'OpenPaperList',
  components: {
    Tendering,
    InvestigateNode,
    STable
  },
  data () {
    return {
      form: this.$form.createForm(this),
      userInfo: this.$store.getters.userInfo,
      // 查询参数
      queryParam: {},
      recordResult: {},
      queryRecord: {},
      contractState: 0,
      saleCustomer: 0,
      vueBoolean: this.$store.getters.vueBoolean,
      customerName: '',
      saleCustomers: [],
      audit: false,
      show:true,
      approvalStatusSelect:0,
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
          title: '收款编号',
          dataIndex: 'paperCode'
        },
        {
          title: '客户名称',
          dataIndex: 'saleCustomerName',
          scopedSlots: { customRender: 'customerName' }
        }, {
          title: '发票类型',
          dataIndex: 'paperType',
          scopedSlots: { customRender: 'paperType' }
        }, {
          title: '开票性质',
          dataIndex: 'paperQuality',
          scopedSlots: { customRender: 'paperQuality' }
        }, {
          title: '开票金额',
          dataIndex: 'paperMoney'
        }, {
          title: '单据状态',
          dataIndex: 'paperStatue',
          scopedSlots: { customRender: 'paperStatue' }
        }, {
          title: '是否已结',
          dataIndex: 'paperIsend',
          scopedSlots: { customRender: 'paperIsend' }
        }, {
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
        return getServiceList(Object.assign(parameter, this.queryParam))
          .then(res => {
            return res
          })
      },
      mounted () {
        this.search()
      },
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  created () {
    this.search()
  },
  watch: {
    $route (to, from) {
      if (to.name == 'openPaperList') {
        this.search()
      }
      if (from.fullPath === '/sale/openpaper/OpenPaperAdd' || from.fullPath === '/sale/openpaper/OpenPaperVue' || from.fullPath === '/sale/openpaper/EditPaperVue') {
        this.$refs.table.refresh(true)
      }
    }
  },
  methods: {
    search () {
      this.queryParam = {
        'customerName': this.customerName,
        'state': this.contractState
      }
      if(this.show == true){
        this.queryParam['approvalStatue'] = this.approvalStatusSelect
      }
      if(this.$refs.table != null && this.$refs.table != undefined){
        this.$refs.table.refresh(true)
      }
    },
    handleAdd (e) {
      if (e.key === '1'){
        this.$router.push({ name: 'openPaperAdd' })
      } else if (e.key === '2') {
        this.$router.push({ name: 'softwareOpenPaperAdd' })
      }
    },
    handleClick (record) {
      console.log('JSON.stringify(record) :' + JSON.stringify(record))
      this.$refs.node.query(record)
      // this.$refs.table.refresh(true)
    },
    del (row) {
      const _this = this
      this.$confirm({
        title: '警告',
        content: `真的要删除编号为: ${row.paperCode} 的开票单吗?`,
        okText: '删除',
        okType: 'danger',
        cancelText: '取消',
        onOk () {
          // 在这里调用删除接口
          openPaperDelete({ 'id': row.id }).then(res => {
            if (res.code == 200) {
              _this.$refs.table.refresh(false)
            } else {
              _this.$message.error(res.msg)
            }
          })
        },
        onCancel () {
        }
      })
    },
    tenderingClick (record) {
      const data = { 'id': record.saleCustomerId }
      this.$refs.tenderingModel.look(data)
    },
    paramClick (key) {
      if (key == 5) {
        this.audit = true
        this.show=false
      } else if (key==2) {
        this.audit = false
        this.show=false
      }else if (key==0){
        this.show=true
        this.audit = false
      }
      this.contractState = key
      this.queryParam = { 'state': key }
      this.$refs.table.refresh(true)
    },
    handleEdit(e){ // 重新提交
      const contractType = e.contractType
      if (contractType == 1) {
        this.$router.push({ name: 'editPaperVue', params: { 'id': e.id, 'auditBoolean': false } })
      } else if (contractType == 2) {
        this.$router.push({ name: 'editSoftwareOpenPaper', params: { 'id': e.id } })
      }
    },
    handleVue (e) {
      const contractType = e.contractType
      if (contractType == 1) {
        this.$router.push({ name: 'openPaperVue', params: { 'id': e.id, 'auditBoolean': false } })
      } else if (contractType == 2) {
        this.$router.push({ name: 'softwareOpenPaperView', params: { 'id': e.id, 'auditBoolean': false } })
      }
    },
    handleAudit (e) {
      const contractType = e.contractType
      if (this.userInfo.id == 52) {
        this.$message.info('你没有审批权限，不可以审批')
        return
      }
      if (contractType == 1) {
        this.$router.push({ name: 'openPaperVue', params: { 'id': e.id, 'auditBoolean': true } })
      } else if (contractType == 2) {
        this.$router.push({ name: 'softwareOpenPaperView', params: { 'id': e.id, 'auditBoolean': true } })
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
</style>
