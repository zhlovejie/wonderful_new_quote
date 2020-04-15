<template>
  <a-card :bordered="false">
    <!--搜索模块-->
    <div class="event-list-search-wrapper">
      <a-form layout="inline">

        <a-form-item label="责任部门">
          <a-select style="width:172px;" placeholder="请选择责任部门" v-model.trim="queryParam.depId" default-value="">
            <a-select-option v-for="dep in allDep" :key="dep.index" :value="dep.id">{{ dep.departmentName }}</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="事件状态">
          <a-select style="width:172px;" placeholder="请选择事件状态" v-model.trim="queryParam.status" default-value="">
            <a-select-option v-for="status in allStatus" :key="status.index" :value="status.value">{{ status.key }}</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="客户名称">
          <a-input v-model.trim="queryParam.customerName" placeholder="客户名称模糊查询"/>
        </a-form-item>

        <a-form-item label="产品名称">
          <a-input v-model.trim="queryParam.productName" placeholder="产品名称模糊查询"/>
        </a-form-item>

        <a-form-item label="上报日期">
          <a-range-picker @change="dateChange" style="width: 100%" v-model="queryParam.rangeDate"/>
        </a-form-item>

        <span class="table-page-search-submitButtons" >
          <a-form-item>
          <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
          <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
          </a-form-item>
        </span>

      </a-form>
    </div>

    <s-table
      ref="table"
      size="default"
      rowKey="id"
      :columns="columns"
      :data="loadData"
    >
      <span slot="urgencyLevel" slot-scope="text">
        <template v-if="text == 1">特提</template>
        <template v-if="text == 2">特急</template>
        <template v-if="text == 3">加急</template>
        <template v-if="text == 4">平急</template>
      </span>
      <span slot="photos" slot-scope="text">
        <a v-if="text != undefined && text.length > 0" @click="$refs.eventPhotos.show(text)">查看照片</a>
        <template v-else>无照片</template>
      </span>
      <span slot="principals" slot-scope="text">
        <template v-for="principal in text">
          <template v-if="principal.handler === 1">
            {{ principal.depName + ':' + principal.responsibleName +';  ' }}
          </template>
        </template>
      </span>
      <span slot="status" slot-scope="text">
        <template v-if="text == 1">待分配</template>
        <template v-if="text == 2">待解决</template>
        <template v-if="text == 3">待处罚</template>
        <template v-if="text == 4">待结案</template>
        <template v-if="text == 5">已结案</template>
      </span>
      <span slot="action" slot-scope="text,record">
        <a @click="$refs.eventForm.show(record,'detail')">详情</a>
        <template v-if="record.status === 1 && stationType === 2"><!-- 待分配且是质量主管 -->
          <a-divider type="vertical"/>
          <a @click="$refs.eventForm.show(record,'allocation')">分配</a>
        </template>
        <template v-if="record.status === 2 "><!-- 待解决且是部门主管 -->
          <template v-for="principal in record.principals">
            <template v-if="principal.handler === 1 && principal.responsibleUser === user.id && principal.isSolved === 0">
              <a-divider :key="principal.index" type="vertical"/>
              <a :key="principal.index" @click="$refs.eventForm.show(record,'solve')">解决</a>
            </template>
          </template>
        </template>
        <template v-if="record.status === 3 && stationType === 2"><!-- 待处罚且是质量主管 -->
          <a-divider type="vertical" />
          <a @click="$refs.eventForm.show(record,'punish')">处罚</a>
        </template>
        <template v-if="record.status === 4 && stationType === 1"><!-- 待结案且是董事长 -->
          <a-divider type="vertical" />
          <a @click="$refs.eventForm.show(record,'closing')">结案</a>
        </template>
        <template v-if="record.status === 5">
          <a-divider type="vertical" />
          <a @click="$refs.ticketList.show(record.id)">罚款单</a>
        </template>
      </span>
    </s-table>

    <event-photos ref="eventPhotos"/>
    <ticket-list ref="ticketList"/>
    <event-form ref="eventForm" :allDep="allDep" @ok="handleOk"/>
  </a-card>
</template>

<script>
import { STable } from '@/components'
import EventPhotos from './modules/EventPhotos'
import EventForm from './modules/EventForm'
import TicketList from './modules/TicketList'
import { getPcList } from '@/api/production/event'
import { getDevisionList } from '@/api/systemSetting'
export default {
  name: 'RecordList',
  components: { // 组件
    STable,
    EventPhotos,
    EventForm,
    TicketList
  },
  data () {
    return {
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '客户名称',
          width: '200px',
          align: 'center',
          dataIndex: 'customerName'
        },
        {
          title: '产品名称',
          width: '100px',
          align: 'center',
          dataIndex: 'productName'
        },
        {
          title: '紧急程度',
          width: '100px',
          align: 'center',
          dataIndex: 'urgencyLevel',
          scopedSlots: { customRender: 'urgencyLevel' }
        },
        {
          title: '故障照片',
          width: '90px',
          align: 'center',
          dataIndex: 'photos',
          scopedSlots: { customRender: 'photos' }
        },
        {
          title: '责任部门及负责人',
          width: '200px',
          align: 'center',
          dataIndex: 'principals',
          scopedSlots: { customRender: 'principals' }
        },
        {
          title: '提交人',
          width: '80px',
          align: 'center',
          dataIndex: 'createName'
        },
        {
          title: '上报时间',
          width: '180px',
          align: 'center',
          dataIndex: 'createTime'
        },
        {
          title: '处理时间',
          width: '180px',
          align: 'center',
          dataIndex: 'updateTime'
        },
        {
          title: '事件状态',
          dataIndex: 'status',
          width: '90px',
          align: 'center',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '150px',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      allDep: [],
      stationType: 0, // 岗位类型：1管理员岗位，2质量主管，3部门领导人
      user: this.$store.getters.userInfo, // 当前登录人
      allStatus: [ { key: '待分配', value: 1 }, { key: '待解决', value: 2 }, { key: '待处罚', value: 3 }, { key: '待结案', value: 4 }, { key: '已结案', value: 5 } ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getPcList(Object.assign(parameter, this.queryParam))
          .then(res => {
            if (res.code === 200) {
              this.stationType = res.data.stationType
              return res.data.page
            } else {
              this.$message.error(res.msg)
            }
          })
      }
    }
  },
  mounted () { // 初始化
    getDevisionList().then(res => { // 获取所有部门
      if (res.code === 200) {
        this.allDep = res.data
      }
    })
  },
  methods: {
    dateChange (date, dateString) { // 时间选择
      this.$set(this.queryParam, 'startTime', dateString[0])
      this.$set(this.queryParam, 'endTime', dateString[1])
    },
    handleOk () {
      this.$refs.table.refresh(true)
    }
  }
}

</script>
