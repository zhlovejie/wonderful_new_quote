<template>
  <a-card :bordered="false">
    <!--搜索模块-->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="8" :sm="12">
            <a-form-item label="主板编号">
              <a-input v-model.trim="queryParam.mainboardId" placeholder="根据主板编号模糊查询"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="12">
            <a-form-item label="产品代码">
              <a-input v-model.trim="queryParam.codeName" placeholder="根据产品代码模糊查询"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="12">
            <a-form-item label="产品名称">
              <a-input v-model.trim="queryParam.productName" placeholder="根据产品名称模糊查询"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="10">
            <a-form-item label="录入日期">
              <a-range-picker @change="dateChange" style="width: 100%" v-model="queryParam.rangeDate"/>
            </a-form-item>
          </a-col>
          <a-col :md="16" :sm="12">
            <span class="table-page-search-submitButtons" :style="{ float: 'right', overflow: 'hidden' }">
              <template v-if="$auth('record:list')">
                <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
                <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
              </template>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <s-table
      ref="table"
      size="default"
      rowKey="prId"
      :columns="columns"
      :data="loadData"
    >
      <span slot="allProcess" slot-scope="text,record">
        <a @click="checkProcess(record.mainboardId)">查看工序</a>
      </span>
      <span slot="reportUrl" slot-scope="text">
        <template v-if="$auth('record:one')">
          <a v-if="text != undefined && text.length > 0" @click="$refs.reportview.show(text)">查看验收报告</a>
        </template>
        <span v-else>未上传</span>
      </span>
      <span slot="action" slot-scope="text,record">
        <template>
          <template v-if="$auth('record:del')">
            <a-popconfirm title="确认删除这条数据？" @confirm="confirm(record.prId)" okText="是" cancelText="否">
              <a href="#">删除</a>
            </a-popconfirm>
          </template>
        </template>
      </span>
    </s-table>

    <record-process-view ref="recordProcessView" />
    <report-view ref="reportview" />
  </a-card>
</template>

<script>
import { STable } from '@/components'
import RecordProcessView from './modules/RecordProcessView'
import ReportView from './modules/ReportView'
import { toRecordList, deleteRecord, getProcessByMid } from '@/api/production/retrospect'

export default {
  name: 'RecordList',
  components: { // 组件
    STable,
    RecordProcessView,
    ReportView
  },
  data () {
    return {
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '主板号',
          dataIndex: 'mainboardId'
        },
        {
          title: '产品代码',
          dataIndex: 'codeName'
        },
        {
          title: '产品名称',
          dataIndex: 'productName'
        },
        {
          title: '工序及操作人',
          dataIndex: 'prId',
          width: '150px',
          scopedSlots: { customRender: 'allProcess' }
        },
        {
          title: '验收报告',
          dataIndex: 'reportUrl',
          scopedSlots: { customRender: 'reportUrl' }
        },
        {
          title: '创建人',
          width: '100px',
          dataIndex: 'creater'
        },
        {
          title: '创建时间',
          width: '200px',
          dataIndex: 'createTime'
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '150px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return toRecordList(Object.assign(parameter, this.queryParam))
          .then(res => {
            if (res.code === 200) {
              return res
            } else {
              this.$message.error(res.msg)
            }
          })
      }
    }
  },
  methods: {
    dateChange (date, dateString) { // 时间选择
      this.$set(this.queryParam, 'rangeDate', date)
      this.$set(this.queryParam, 'startTime', dateString[0])
      this.$set(this.queryParam, 'endTime', dateString[1])
    },
    checkProcess (mId) {
      getProcessByMid({ mainboardId: mId, deviceType: 'pc' }).then(res => {
        if (res.code === 200) {
          this.$refs.recordProcessView.show(res.data.processes)
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    handleOk () {
      this.$refs.table.refresh()
    },
    confirm (prId) { // 确认删除事件
      deleteRecord({ 'prId': prId }).then(res => {
        if (res.code === 200) {
          this.$refs.table.refresh()
        } else {
          this.$message.error(res.msg)
        }
      })
    }
  }
}

</script>
