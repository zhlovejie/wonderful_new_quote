<template>
  <a-modal
    :title="modalTitle"
    :width="1080"
    :visible="visible"
    :destroyOnClose="true"
    @cancel="handleCancel"
    :maskClosable="false"
    :footer="null"
  >
    <a-table
      :columns="columns"
      :dataSource="dataSource"
      :pagination="pagination"
      :loading="loading"
      @change="handleTableChange"
    >
      <div slot="order" slot-scope="text, record, index">
        <span>{{ index + 1 }}</span>
      </div>

      <div slot="content" slot-scope="text, record, index">
        <a-tooltip v-if="String(text).length > 10">
          <template slot="title">{{text}}</template>
          {{ String(text).slice(0,10) }}...
        </a-tooltip>
        <span v-else>{{text}}</span>
      </div>

      <div slot="pictureUrl" slot-scope="text, record, index">
        <template v-if="text">
          <div style="display:flex;">
          <img v-for="(url,idx) in text.split(',')" :key="idx" @click="showImg(url)" :src="url" alt="" style="width:48px;height:auto;overflow:hidden;margin:0 5px;" />
          </div>
        </template>
        <template v-else>
          <span>无</span>
        </template>
      </div>
      <div slot="status" slot-scope="text, record, index">
        <template v-if="+text === 0">
          <a-popconfirm title="确定要更改状态为已处理吗？" @confirm="doAction('back',record)">
            <a href="javascript:void(0);">未处理</a>
          </a-popconfirm>
        </template>
        <template v-else>
          <span>已处理</span>
        </template>
      </div>
    </a-table>
    <ImgView ref="imgView" />
  </a-modal>
</template>
<script>

import {
  blueprintFeedbackDispose,
  blueprintFeedbackPageList
} from '@/api/researchManagement'
import ImgView from '@/components/CustomerList/ImgView'
const columns = [
  {
    align: 'center',
    title: '序号',
    key: 'order',
    width: '70px',
    scopedSlots: { customRender: 'order' }
  },
  {
    align: 'center',
    title: '反馈人',
    dataIndex: 'createdName'
  },
  {
    align: 'center',
    title: '反馈时间',
    dataIndex: 'createdTime'
  },
  {
    align: 'center',
    title: '反馈内容',
    dataIndex: 'content',
    scopedSlots: { customRender: 'content' }
  },
  {
    align: 'center',
    title: '反馈图片',
    dataIndex: 'pictureUrl',
    scopedSlots: { customRender: 'pictureUrl' }
  },
  {
    align: 'center',
    title: '状态',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' }
  }
]

export default {
  name: 'DisposeForm',
  components: {ImgView},
  data() {
    return {
      visible: false,
      record:{},
      searchParam:{},
      columns: columns,
      dataSource: [],
      pagination: {
        current: 1
      },
      loading: false,
    }
  },
  computed: {
    modalTitle() {
      return '反馈记录'
    }
  },
  methods: {
    async query(type, record) {
      let that = this
      that.record = Object.assign({}, record)
      that.searchParam = {
        fileId:that.record.id
      }
      that.visible = true
      that.searchAction()
    },
    searchAction(opt = {}) {
      let that = this
      let _searchParam = Object.assign({}, { ...this.searchParam }, { ...this.pagination }, opt)
      console.log('执行搜索...', _searchParam)
      that.loading = true
      blueprintFeedbackPageList(_searchParam)
        .then(res => {
          that.loading = false
          that.dataSource = res.data.records.map((item, index) => {
            item.key = index + 1
            return item
          })
          //设置数据总条数
          const pagination = { ...that.pagination }
          pagination.total = res.data.total || 0
          pagination.current = res.data.current || 1
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
      this.searchAction({ current: pagination.current })
    },
    handleCancel() {
      this.$nextTick(() => (this.visible = false))
    },
    doAction(type,record){
      let that = this
      blueprintFeedbackDispose(`id=${record.id}`).then(res =>{
        that.$message.info(res.msg)
        if(res.code === 200){
          that.searchAction()
        }
      }).catch(err =>{
        that.$message.error(err.message)
      })
    },
    showImg(url){
      this.$refs.imgView.show(url)
    }
  },
}
</script>
<style scoped>
.custom-table-border th,
.custom-table-border td {
  padding: 10px;
}
.custom-table-border >>> .ant-form-item {
  margin-bottom: 0;
}
</style>
