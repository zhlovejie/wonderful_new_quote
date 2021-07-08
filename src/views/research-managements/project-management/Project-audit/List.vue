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
          <a-select style="width: 200px" placeholder="项目开发模式" v-model="modelType" :allowClear="true">
            <a-select-option :value="0">待处理</a-select-option>
            <a-select-option :value="1">已处理</a-select-option>
            <a-select-option :value="2">处理中</a-select-option>
            <a-select-option :value="3">完结</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-select style="width: 200px" placeholder="项目阶段" v-model="approvalStatusSelect" :allowClear="true">
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
        <!-- <a-dropdown style="float: right">
          <a-button type="primary" @click="toAdd('add', null)"> <a-icon type="plus" />新增 </a-button>
        </a-dropdown> -->
      </a-form>
    </div>
    <a-row>
      <a-col>
        <div>
          <a-tabs defaultActiveKey="0" @change="paramClick">
            <a-tab-pane tab="我提交的" key="0" forceRender></a-tab-pane>
            <a-tab-pane tab="待我审批" key="1" forceRender></a-tab-pane>
            <a-tab-pane tab="我已审批" key="2"></a-tab-pane>
            <!-- <a-tab-pane tab="已完结" key="2"></a-tab-pane> -->
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

          <div slot="approveStatus" slot-scope="text, record">
            <a href="javascript:void(0);" @click="approvalPreview(record)">{{
              { 1: '待审批', 2: '通过', 3: '不通过', 4: '已撤回' }[text] || '未知'
            }}</a>
          </div>
          <div slot="modelType" slot-scope="text, record">
            {{ { 1: '自主研发新产品', 2: '客户定制新需求', 3: '产品研发改进', 4: '非常规产品研发' }[text] || '未知' }}
          </div>
          <div slot="status" slot-scope="text, record">
            <a>
              {{
                {
                  1: '立项阶段',
                  2: '设计方案评审',
                  3: '试制资料输出',
                  4: '产品试制',
                  5: '可行性测试',
                  6: '可行性测试结果联合评审',
                  7: '稳定性测试',
                  8: '稳定性测试结果评审',
                  9: '配置方案研发',
                  10: '配置方案研发评审',
                  11: '配置方案技术资料归档',
                  12: '设计模块',
                  13: '工艺研发',
                  14: '工艺下达',
                  15: '小批量生产',
                  16: '小批量生产评审',
                  17: '样品展示',
                  18: '批量生产&完结',
                }[text] || '未知'
              }}</a
            >
          </div>

          <span slot="action" slot-scope="text, record">
            <template v-if="audit === 0">
              <a type="primary" @click="toAdd('view', record)">查看</a>
              <template v-if="record.approveStatus === 1">
                <a-divider type="vertical" />
                <a-popconfirm title="确认撤回该条数据吗?" @confirm="() => toAdd('withdraw', record)">
                  <a type="primary" href="javascript:;">撤回</a>
                </a-popconfirm>
                <!-- <a type="primary" @click="toAdd('view', record)">撤回</a> -->
              </template>
              <template v-if="record.approveStatus === 3 || record.approveStatus === 4">
                <a-divider type="vertical" />
                <a type="primary" @click="toAdd('handle', record)">修改</a>
                <a-divider type="vertical" />
                <!-- <a type="primary" @click="toAdd('handle', record)">删除</a> -->
                <a-popconfirm title="确认删除该条数据吗?" @confirm="() => toAdd('del', record)">
                  <a type="primary" href="javascript:;">删除</a>
                </a-popconfirm>
              </template>
            </template>

            <template v-if="audit === 1">
              <a type="primary" @click="toAdd('Approval', record)">审核</a>
            </template>

            <template v-if="audit === 2">
              <a type="primary" @click="toAdd('view', record)">查看</a>
            </template>

            <!-- <a type="primary" @click="toAdd('view', record)">查看</a>
            <a-divider type="vertical" />
            <a type="primary" @click="toAdd('handle', record)">处理</a> -->
            <!-- <template v-if="['12', '13', '14', '15', '16', '17', '18'].includes(record.status)">
              <a-divider type="vertical" />
              <a type="primary" @click="toAdd('patent', record)">设计模块处理</a>
            </template> -->
          </span>
        </s-table>
      </a-col>
    </a-row>
    <!-- <common-step-form ref="commonStepForm" @finish="search()" /> -->
    <ApproveInfo ref="approveInfoCard" />
    <!-- <AddForm ref="addForm" @finish="search()" />
    <Appform ref="appform" @finish="search()" /> -->
  </a-card>
</template>

<script>
import {
  pageList,
  withDrawProjectStageApply,
  removeProjectStageApply,
  // pageDevelopmentgetDelete,
  // acceptDevelopmentProjectCheckApply,
  // finishDevelopmentProjectCheckApply,
} from '@/api/projectManagement'
import { STable } from '@/components'
// import AddForm from './module/AddForm'
// import Appform from './module/appform'
import ApproveInfo from '@/components/CustomerList/ApproveInfo'
export default {
  name: 'DelayedPayment',
  components: {
    // AddForm,
    STable,
    // Appform,
    ApproveInfo,
  },
  data() {
    return {
      form: this.$form.createForm(this),
      queryParam: {
        searchStatus: 0,
      },
      patentName: undefined,
      projectCode: undefined,
      projectName: undefined,
      modelType: undefined,
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
          title: '项目开发模式',
          dataIndex: 'modelType',
          key: 'modelType',
          scopedSlots: { customRender: 'modelType' },
        },
        {
          align: 'center',
          title: '项目名称',
          dataIndex: 'projectName',
          key: 'projectName',
        },
        {
          align: 'center',
          title: '项目总负责人',
          key: 'chargeUserName',
          dataIndex: 'chargeUserName',
        },

        {
          align: 'center',
          title: '项目进程',
          dataIndex: 'status',
          key: 'status',
          scopedSlots: { customRender: 'status' },
        },
        {
          align: 'center',
          title: '状态',
          dataIndex: 'approveStatus',
          key: 'approveStatus',
          scopedSlots: { customRender: 'approveStatus' },
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
        return pageList(Object.assign(parameter, this.queryParam)).then((res) => {
          return res
        })
      },
      selectedRowKeys: [],
      selectedRows: [],
    }
  },
  watch: {
    $route(to, from) {
      if (to.name === 'project-management-Project-audit') {
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
      if (['view', 'Approval'].includes(type)) {
        this.$router.push({
          name: 'project-management-Project-audit-handle',
          params: { type: type, id: record.projectId, status: record.status, record: record },
        })
        return
      }
      if (type === 'del') {
        removeProjectStageApply({
          id: record.id,
          serviceId: record.serviceId,
          stageNum: record.status,
          projectId: record.projectId,
        })
          .then((res) => {
            if (res.code === 200) {
              this.search()
              this.$message.info(res.msg)
            }
          })
          .catch((err) => this.$message.info(err))

        return
      }
      if (type === 'withdraw') {
        withDrawProjectStageApply({
          id: record.id,
          serviceId: record.serviceId,
          stageNum: record.status,
          projectId: record.projectId,
        })
          .then((res) => {
            if (res.code === 200) {
              this.$message.info(res.msg)
              this.search()
            }
          })
          .catch((err) => this.$message.info(err))

        return
      }
    },
    search(opt = {}) {
      this.queryParam = {
        modelType: this.modelType,
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
    approvalPreview(record) {
      this.$refs.approveInfoCard.init(record.instanceId)
    },

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
