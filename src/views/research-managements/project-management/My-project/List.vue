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
          <a-select v-model="modelType" placeholder="项目开发模式" allowClear style="width: 200px">
            <a-select-option v-for="item in projectDevelopmentModes" :value="item.id" :key="item.id">{{
              item.text
            }}</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item>
          <a-select v-model="status" placeholder="项目进程" allowClear style="width: 200px">
            <a-select-option v-for="item in projectProcesses" :value="item.id" :key="item.id">{{
              item.text
            }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <template>
            <a-button class="a-button" type="primary" icon="search" @click="search">查询</a-button>
          </template>
        </a-form-item>
      </a-form>
    </div>
    <a-row>
      <a-col>
        <div>
          <a-tabs defaultActiveKey="1" @change="paramClick">
            <a-tab-pane tab="待处理" key="1" forceRender></a-tab-pane>
            <a-tab-pane tab="已处理" key="2"></a-tab-pane>
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
            <a type="primary" @click="toAdd('view', record)">查看</a>
            <template v-if="audit === 1 && record.showDealHandle === 1">
              <a-divider type="vertical" />
              <a type="primary" @click="toAdd('handle', record)">处理</a>
            </template>

            <template v-if="audit === 1 && record.showDesignHandle === 1">
              <a-divider type="vertical" />
              <a type="primary" @click="toAdd('design', record)">设计模块处理</a>
            </template>
          </span>
        </s-table>
      </a-col>
    </a-row>
  </a-card>
</template>

<script>
import {
  listMyProjectAllInfo,
  pageDevelopmentgetDelete,
  finishDevelopmentProjectCheckApply,
} from '@/api/projectManagement'
import { STable } from '@/components'
function makeProjectDevelopmentMode() {
  const arr = ['全部', '自主研发新产品', '客户定制新产品', '产品研发改进', '非常规产品开发']
  return arr.map((v, idx) => {
    return { id: idx, text: v }
  })
}

function makeProjectProcess() {
  const arr = [
    '立项阶段',
    '设计方案评审',
    '试制资料输出',
    '产品试制',
    '可行性测试',
    '可行性测试结果联合评审',
    '稳定性测试',
    '稳定性测试结果评审',
    '配置方案研发',
    '配置方案研发评审',
    '配置方案技术资料归档',
    '设计模块',
    '工艺研发',
    '工艺下达',
    '小批量生产',
    '小批量生产评审',
    '样品展示',
    '批量生产&完结',
  ]
  return arr
    .map((v, idx) => {
      return {
        id: idx + 1,
        text: v,
      }
    })
    .filter((item) => item.id > 0)
}

export default {
  name: 'DelayedPayment',
  components: {
    STable,
  },
  data() {
    return {
      projectDevelopmentModes: Object.freeze(makeProjectDevelopmentMode()),
      projectProcesses: Object.freeze(makeProjectProcess()),
      form: this.$form.createForm(this),
      queryParam: {
        handleSearchFlag: 1,
      },
      patentName: undefined,
      projectCode: undefined,
      projectName: undefined,
      modelType: undefined,
      status: undefined,
      recordResult: {},
      queryRecord: {},
      contractState: 0,
      saleCustomer: 0,
      customerName: undefined,
      saleCustomers: [],
      audit: 1,
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
          title: '项目负责人',
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
          title: '操作',
          dataIndex: 'id',
          scopedSlots: { customRender: 'action' },
        },
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        return listMyProjectAllInfo(Object.assign(parameter, this.queryParam)).then((res) => {
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
  mounted() {},
  methods: {
    toAdd(type, record) {
      record.audit = this.audit
      if (type === 'design') {
        this.$router.push({
          name: 'project-management-My-handle',
          params: { type: type, id: record.id, status: 12, record: record },
        })
      } else {
        this.$router.push({
          name: 'project-management-My-handle',
          params: { type: type, id: record.id, status: record.status, record: record },
        })
      }
    },
    search(opt = {}) {
      this.queryParam = {
        modelType: this.modelType,
        handleSearchFlag: this.audit,
        patentName: this.patentName,
        projectCode: this.projectCode,
        projectName: this.projectName,
        status: this.status,

        ...opt,
      }
      if (this.audit == 0) {
        this.queryParam['status'] = this.approvalStatusSelect
      }
      this.$refs.table.refresh(true)
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
      this.queryParam = { handleSearchFlag: key }
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
