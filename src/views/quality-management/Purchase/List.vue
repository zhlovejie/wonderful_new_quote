<template>
  <a-card :bordered="false">
    <!-- 不良品处置单 -->
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
        <a-input
          placeholder="单据编号"
          v-model="queryParam.purchaseNum"
          allowClear
          style="width: 200px; margin: 0 10px"
        />
        <a-input
          placeholder="不良品处置单号"
          v-model="queryParam.dealNum"
          allowClear
          style="width: 200px; margin-right: 10px"
        />
        <a-input
          placeholder="供应商名称"
          v-model="queryParam.supplierName"
          allowClear
          style="width: 200px; margin-right: 10px"
        />
        <a-input
          placeholder="物料代码"
          v-model="queryParam.materialCode"
          allowClear
          style="width: 200px; margin-right: 10px"
        />
        <a-button
          class="a-button"
          type="primary"
          style="position: relative; top: -1px"
          icon="search"
          @click="search({ current: 1 })"
          >查询</a-button
        >
      </div>
    </div>
    <a-row>
      <a-col>
        <div>
          <a-tabs defaultActiveKey="0" @change="paramClick">
            <a-tab-pane tab="待处理" key="0" forceRender> </a-tab-pane>
            <a-tab-pane tab="已完结" key="1"> </a-tab-pane>
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
          <div slot="defectiveRate" slot-scope="text">
            <span>{{ text * 100 + '%' }}</span>
          </div>
          <div slot="status" slot-scope="text, record">
            <span v-if="+text === 0">待处理</span>
            <span v-if="+text === 1">完结</span>
          </div>

          <span slot="action" slot-scope="text, record">
            <template v-if="record.status === 1">
              <a @click="handleVue('view', record)">查看</a>
            </template>
            <template v-else>
              <a @click="handleVue('handle', record)">处理</a>
            </template>
          </span>
        </s-table>
      </a-col>
    </a-row>

    <Formadd ref="formadd" @finish="() => search()" />
    <!-- <SearchForm ref="searchForm" @change="paramChangeHandler" /> -->
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { getPurchaseDisputeDealPage, quality_getCheckGetMaterialId } from '@/api/qualityTesting'
import Formadd from './modules/Formadd'
// import SearchForm from './modules/SearchForm'
export default {
  name: 'OpenPaperList',
  components: {
    Formadd,
    STable,
    // SearchForm,
  },
  data() {
    return {
      form: this.$form.createForm(this),
      userInfo: this.$store.getters.userInfo,
      // 查询参数
      queryParam: { dayWeekMonth: 1, status: 0 },
      contractState: 0,
      dayWeekMonth: 1,
      pagination: {
        showTotal: (total) => '共' + total + '条数据',
      },
      audit: false,
      show: true,
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
          title: '单据编号',
          align: 'center',
          dataIndex: 'purchaseNum',
        },
        {
          title: '不良品处置单号',
          align: 'center',
          dataIndex: 'dealNum',
        },
        {
          title: '供应商名称',
          align: 'center',
          dataIndex: 'supplierName',
        },
        {
          title: '物料代码',
          align: 'center',
          dataIndex: 'materialCode',
        },
        {
          title: '物料名称',
          align: 'center',
          dataIndex: 'materialName',
        },
        {
          title: '报检数量',
          align: 'center',
          dataIndex: 'reportNum',
        },
        {
          title: '检验数量',
          align: 'center',
          dataIndex: 'checkNum',
        },
        {
          title: '不良率（%）',
          align: 'center',
          dataIndex: 'defectiveRate',
          scopedSlots: { customRender: 'defectiveRate' },
        },
        {
          title: '让步接收数量',
          align: 'center',
          dataIndex: 'compromiseNum',
        },
        {
          title: '让步接收原因',
          align: 'center',
          dataIndex: 'dealDesc',
        },
        {
          title: '检验日期',
          align: 'center',
          dataIndex: 'checkTime',
        },
        {
          title: '操作',
          align: 'center',
          width: '200px',
          scopedSlots: { customRender: 'action' },
        },
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        return getPurchaseDisputeDealPage(Object.assign(parameter, this.queryParam)).then((res) => {
          return res
        })
      },
    }
  },
  mounted() {
    this.search()
  },
  watch: {
    $route(to, from) {
      if (to.name == 'qquality-management_Purchase') {
        this.dayWeekMonth = 1
        this.search()
      }
    },
  },
  methods: {
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
      }
    },
    handleClick(record) {
      //   console.log('JSON.stringify(record) :' + JSON.stringify(record))
      this.$refs.node.query(record)
      // this.$refs.table.refresh(true)
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
      this.queryParam = { status: key }
      this.$refs.table.refresh(true)
    },
    handleVue(type, record) {
      if (record.firstInit === 1) {
        quality_getCheckGetMaterialId({ materialId: record.materialId, reportCheckNum: record.reportNum }).then(
          (res) => {
            if (res.data === null) {
              let text = `该物料没配置报检数量为${record.reportNum}的检验标准`
              this.$message.error(text)
            } else {
              this.$refs.formadd.query(type, record, res.data)
            }
          }
        )
      } else {
        this.$refs.formadd.query(type, record, null)
      }
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
