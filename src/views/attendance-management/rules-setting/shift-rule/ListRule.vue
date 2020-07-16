<template>
  <a-modal
    :title="modalTitle"
    :width="880"
    :visible="visible"
    :destroyOnClose="true"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <a-spin :spinning="spinning">
      <a-table
        :columns="columns"
        :dataSource="dataSource"
        :pagination="false"
        :loading="loading"
      >
        <div slot="order" slot-scope="text, record, index">
          <span>{{ index + 1 }}</span>
        </div>
        <div slot="beginDate" slot-scope="text, record, index">
          <span>{{ record.beginDate }}~{{ record.endDate }}</span>
        </div>
        <div slot="lunchBeginTime" slot-scope="text, record, index">
          <span>{{ record.lunchBeginTime }}~{{ record.lunchEndTime }}</span>
        </div>
        <div class="action-btns" slot="action" slot-scope="text, record">
          <a-popconfirm title="确认删除该条数据吗?" @confirm="() => doAction('del',record)">
            <a type="primary" href="javascript:;">删除</a>
          </a-popconfirm>
          <a-divider type="vertical" />
          <a type="primary" @click="doAction('edit',record)">修改</a>
        </div>
      </a-table>
    </a-spin>
    <AddFormRule ref="addFormRule" @finish="finish"/>
  </a-modal>
</template>
<script>
import {classRuleConfigList , classRuleConfigDetail , classRuleConfigDel} from '@/api/attendanceManagement'
import AddFormRule from './AddFormRule'
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
    title: '时间范围',
    dataIndex: 'beginDate',
    scopedSlots: { customRender: 'beginDate' }
  },
  {
    align: 'center',
    title: '上班时间',
    dataIndex: 'workBeginTime',
    scopedSlots: { customRender: 'workBeginTime' }
  },
  {
    align: 'center',
    title: '午休时间',
    dataIndex: 'lunchBeginTime',
    scopedSlots: { customRender: 'lunchBeginTime' }
  },
  {
    align: 'center',
    title: '下班时间',
    dataIndex: 'workEndTime',
    scopedSlots: { customRender: 'workEndTime' }
  },
  {
    align: 'center',
    title: '处理',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  name:'shift-rule-config-list-add',
  components:{AddFormRule},
  data(){
    return {
      visible:false,
      columns: columns,
      dataSource: [],
      pagination: {
        current: 1
      },
      loading: false,
      spinning:false,
      searchParam:{}
    }
  },
  computed:{
    modalTitle(){
      //let m = {'view':'查看','add':'新增','edit' : '修改','approval':'审批'}
      //return `${m[this.actionType]}`
      return '规则明细'
    },
    isView(){
      return this.actionType === 'view'
    },
    isAdd(){
      return this.actionType === 'add'
    },
    isEdit(){
      return this.actionType === 'edit'
    },
    isApproval(){
      return this.actionType === 'approval'
    },
    isDisabled(){ //此状态下表单元素被禁用
      return this.isView || this.isApproval
    }
  },
  methods:{
    finish(){
      this.searchAction()
    },
    searchAction(opt = {}) {
      let that = this
      let _searchParam = Object.assign({}, { ...this.searchParam }, { ...this.pagination }, opt)
      console.log('执行搜索...', _searchParam)
      that.loading = true
      classRuleConfigList(_searchParam)
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
    query(type,record){
      this.visible = true
      this.searchParam = {
        classRuleId:record.id
      }
      this.searchAction()
    },
    handleSubmit(){
      this.handleCancel()
    },
    handleCancel(){
      this.$nextTick(() =>this.visible = false)
    },
    doAction(actionType, record) {
      let that = this
      if(actionType === 'edit'){
        that.$refs.addFormRule.query(actionType,record)
      }else if(actionType === 'del'){
        classRuleConfigDel(`id=${record.id}`)
          .then(res => {
            that.$message.info(res.msg)
            that.searchAction()
          })
          .catch(err => {
            that.$message.info(`错误：${err.message}`)
          })
      }
    }
  }
}
</script>
<style scoped>
.wdf-custom-add-form-wrapper >>> .ant-form-item{
  display:flex;
}

.ant-form-item >>> .ant-form-item-label{
  width:80px;
}
.ant-form-item >>> .ant-form-item-control-wrapper{
  flex:1;
}
</style>