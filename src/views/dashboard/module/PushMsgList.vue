<template>
  <div class="customer-list-wrapper">
    <div class="main-wrapper">
      <a-table
        :columns="columns"
        :dataSource="dataSource"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange"
        size="middle"
      >
        <div slot="order" slot-scope="text, record, index">
          <span>{{ index + 1 }}</span>
        </div>
        <div slot="content" slot-scope="text, record, index">
          <a-tooltip v-if="String(text).length > 40">
            <template slot="title">{{ text }}</template>
            {{ String(text).slice(0, 40) }}...
          </a-tooltip>
          <span v-else>{{ text }}</span>
        </div>
        <div slot="action" slot-scope="text, record, index">
          <a href="javascript:void(0);" @click="doAction('view', record)">查看</a>
          <template v-if="+msgType === 2">
            <a-divider type="vertical" />
            <a href="javascript:void(0);" @click="doAction('approval', record)">审批</a>
          </template>
        </div>
      </a-table>
    </div>
    <!-- <PushMsgView ref="pushMsgView"/> -->
    <PushMsgApprove ref="pushMsgApprove" @finish="finishAction" />
  </div>
</template>
<script>
import { getPushMsg, getPushShareMsg } from '@/api/common' //消息
//import PushMsgView from './PushMsgView'
import pushMsgTypeEnum from './pushMsgTypeEnum'
//import PushMsgViewComponents from './PushMsgViewComponents'
import PushMsgApprove from './PushMsgApprove'
const columns = [
  {
    align: 'center',
    title: '序号',
    key: 'order',
    scopedSlots: { customRender: 'order' },
  },
  {
    align: 'center',
    title: '事项类型',
    dataIndex: 'businessTypeTxt',
  },
  {
    align: 'left',
    title: '事项简介',
    dataIndex: 'content',
    scopedSlots: { customRender: 'content' },
  },
  {
    align: 'center',
    title: '时间',
    dataIndex: 'createTime',
  },
  {
    align: 'center',
    title: '操作',
    scopedSlots: { customRender: 'action' },
  },
]

export default {
  name: 'PushMsgList',
  props: {
    msgType: {
      type: [String, Number],
      default: () => 1,
    },
  },
  components: {
    //PushMsgView
    PushMsgApprove,
  },
  data() {
    return {
      columns: columns,
      dataSource: [],
      pagination: {
        current: 1,
      },
      loading: false,
      userInfo: this.$store.getters.userInfo, // 当前登录人
    }
  },
  mounted() {
    this.init()
  },
  watch: {
    msgType(val) {
      this.pagination = { ...this.pagination, current: 1 }
      this.init()
    },
  },
  methods: {
    init() {
      this.searchAction()
    },
    searchAction(opt) {
      let that = this
      let isShare = that.msgType.startsWith('share_')
      let _searchParam = Object.assign(
        {},
        {
          msgType: isShare ? that.msgType.replace('share_', '') : that.msgType || 1,
          userId: that.userInfo.id,
        },
        opt
      )
      //console.log('执行搜索...',_searchParam)
      that.loading = true

      let api = isShare ? getPushShareMsg : getPushMsg

      api(_searchParam)
        .then((res) => {
          that.loading = false
          let msgList = res.data.msgList
          that.dataSource = msgList.records.map((item, index) => {
            item.key = item.id
            item.businessTypeTxt = pushMsgTypeEnum[item.businessType] || '未知'
            return item
          })
          //设置数据总条数
          const pagination = { ...that.pagination }
          pagination.total = msgList.total
          that.pagination = pagination
        })
        .catch((err) => (that.loading = false))
    },
    // 分页
    handleTableChange(pagination, filters, sorter) {
      console.log(pagination, filters, sorter)
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.searchAction({ current: pagination.current })
    },
    doAction(type, record) {
      this.$refs.pushMsgApprove.query(type, record)
    },
    finishAction() {
      this.searchAction()
      this.$emit('finish')
    },
  },
}
</script>
