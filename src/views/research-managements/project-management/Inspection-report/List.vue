<template>
  <a-card :bordered="false">
    <div class="top-ation">
      <a-form layout="inline" :form="form">
        <a-form-item>
          <a-input v-model="projectCode" placeholder="项目编号" style="width: 200px" :allowClear="true" />
        </a-form-item>
        <a-form-item>
          <a-input v-model="projectName" placeholder="项目名称" style="width: 200px" :allowClear="true" />
        </a-form-item>
        <a-form-item>
          <a-input v-model="patentName" placeholder="专利名称" style="width: 200px" :allowClear="true" />
        </a-form-item>
        <a-form-item v-show="show">
          <a-select style="width: 150px" placeholder="审批状态" v-model="approvalStatusSelect" :allowClear="true">
            <a-select-option :value="0">待处理</a-select-option>
            <a-select-option :value="1">已处理</a-select-option>
            <a-select-option :value="2">处理中</a-select-option>
            <a-select-option :value="3">完结</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <template>
            <a-button class="a-button" type="primary" icon="search" @click="search">查询</a-button>
          </template>
        </a-form-item>
        <a-dropdown style="float: right">
          <a-button type="primary" @click="toAdd('add', null)"> <a-icon type="plus" />新增 </a-button>
        </a-dropdown>
      </a-form>
    </div>
    <a-row>
      <a-col>
        <div>
          <a-tabs defaultActiveKey="0" @change="paramClick">
            <a-tab-pane tab="我的" key="0" forceRender></a-tab-pane>
            <template>
              <a-tab-pane tab="待我审批" key="1"></a-tab-pane>
              <a-tab-pane tab="已完结" key="2"></a-tab-pane>
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
          <div slot="haveCheckFlag" slot-scope="text">
            <span v-if="text == 0">无</span>
            <span v-if="text == 1">有</span>
          </div>
          <div slot="status" slot-scope="text, record">
            <a v-if="text == 0">待处理</a>
            <a v-if="text == 1">已处理</a>
            <a v-if="text == 2">处理中</a>
            <a v-if="text == 3">完结</a>
          </div>

          <span slot="action" slot-scope="text, record">
            <template v-if="audit == 0 || audit == 2">
              <a type="primary" @click="toAdd('view', record)">查看</a>
            </template>
            <template v-if="audit == 0 && record.status === 2">
              <a-divider type="vertical" />
              <a-popconfirm title="是否确定完结" ok-text="确定" cancel-text="取消" @confirm="confirmWithdraw(record)">
                <a type="primary">完结</a>
              </a-popconfirm>
            </template>

            <template v-if="audit == 0 && (record.status === 0 || record.status === 2)">
              <a-divider type="vertical" />
              <a type="primary" @click="toAdd('edit', record)">修改</a>
              <a-divider type="vertical" />
              <a-popconfirm title="是否确定删除" ok-text="确定" cancel-text="取消" @confirm="confirmDelete(record)">
                <a type="primary">删除</a>
              </a-popconfirm>
            </template>
            <template v-if="audit == 1 && record.status === 0">
              <a type="primary" @click="toAdd('accept', record)">接受</a>
            </template>
            <template v-if="audit == 0 && record.status === 1">
              <a-divider type="vertical" />
              <a type="primary" @click="toAdd('patent', record)">专利上传</a>
            </template>
          </span>
        </s-table>
      </a-col>
    </a-row>
    <!-- <common-step-form ref="commonStepForm" @finish="search()" /> -->
    <!-- <ApproveInfo ref="approveInfoCard" /> -->
    <AddForm ref="addForm" @finish="search()" />
    <Appform ref="appform" @finish="search()" />
  </a-card>
</template>

<script>
import {
  pageDevelopmentCraftDevRecoveApply,
  listProjectgetDelete,
  acceptDevelopmentProjectPatentApply,
  finishDevelopmentProjectPatentApply,
} from '@/api/projectManagement'
import { STable } from '@/components'
import AddForm from './module/AddForm'
import Appform from './module/appform'
// import ApproveInfo from '@/components/CustomerList/ApproveInfo'
export default {
  name: 'DelayedPayment',
  components: {
    AddForm,
    STable,
    Appform,
    // ApproveInfo,
  },
  data() {
    return {
      form: this.$form.createForm(this),
      queryParam: {},
      patentName: undefined,
      projectCode: undefined,
      projectName: undefined,
      recordResult: {},
      queryRecord: {},
      contractState: 0,
      saleCustomer: 0,
      customerName: undefined,
      saleCustomers: [],
      audit: 0,
      show: true,
      userInfo: {},
      approvalStatusSelect: undefined,
      // 查询参数
      pagination: {
        showTotal: (total) => '共' + total + '条数据',
      },
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
          align: 'center',
          title: '项目编号',
          dataIndex: 'projectCode',
          key: 'projectCode',
        },
        {
          align: 'center',
          title: '项目名称',
          dataIndex: 'projectName',
          key: 'projectName',
        },
        {
          align: 'center',
          title: '专利名称',
          dataIndex: 'patentName',
          key: 'patentName',
        },
        {
          align: 'center',
          title: '提交人',
          key: 'createdName',
          dataIndex: 'createdName',
        },
        {
          align: 'center',
          title: '提交时间',
          key: 'createdTime',
          dataIndex: 'createdTime',
        },

        {
          align: 'center',
          title: '状态',
          dataIndex: 'status',
          key: 'status',
          scopedSlots: { customRender: 'status' },
        },
        {
          align: 'center',
          title: '操作',
          dataIndex: 'id',
          scopedSlots: { customRender: 'action' },
        },
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        return pageDevelopmentCraftDevRecoveApply(Object.assign(parameter, this.queryParam)).then((res) => {
          return res
        })
      },
      selectedRowKeys: [],
      selectedRows: [],
    }
  },
  watch: {
    $route(to, from) {
      if (to.name === 'project-management-Inspection-report') {
        this.$refs.table.refresh(true)
      }
    },
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {},
    toAdd(type, record) {
      if (['view', 'edit', 'add'].includes(type)) {
        this.$refs.addForm.query(type, record)
      }
      if (type === 'accept') {
        acceptDevelopmentProjectPatentApply({ id: record.id }).then((res) => {
          if (res.code === 200) {
            this.$message.info(res.msg)
            this.search()
          }
        })
      }
      if (type === 'patent') {
        this.$refs.appform.query('add', record)
      }
    },
    //完结
    confirmWithdraw(record) {
      finishDevelopmentProjectPatentApply({ id: record.id }).then((res) => {
        if (res.code === 200) {
          this.$message.info(res.msg)
          this.search()
        }
      })
    },
    // 列表删除
    confirmDelete(record) {
      listProjectgetDelete({ id: record.id }).then((res) => {
        if (res.code === 200) {
          this.$message.info(res.msg)
          this.search()
        }
      })
    },
    search(opt = {}) {
      this.queryParam = {
        searchStatus: this.audit,
        patentName: this.patentName,
        projectCode: this.projectCode,
        projectName: this.projectName,
        ...opt,
      }
      if (this.audit == 0) {
        this.queryParam['status'] = this.approvalStatusSelect
      }
      this.$refs.table.refresh(true)
    },
    //审批流组件
    // handleClick(record) {
    //   this.$refs.approveInfoCard.init(record.instanceId)
    // },

    paramClick(key) {
      if (key === '1') {
        this.audit = 1
        this.show = false
      } else if (key === '2') {
        this.audit = 2
        this.show = false
      } else {
        this.show = true
        this.audit = 0
      }
      this.queryParam = { searchStatus: key }
      this.$refs.table.refresh(true)
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
.currentDayWeekMonth {
  opacity: 0.7;
}
</style>
