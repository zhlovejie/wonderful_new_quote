<template>
  <a-modal
    :title="modalTitle"
    :width="980"
    :visible="visible"
    :destroyOnClose="true"
    @cancel="handleCancel"
    :confirmLoading="spinning"
    :maskClosable="false"
    :footer="null"
  >
    <a-spin :spinning="spinning">
      <div>
        <a-steps :current="current" size="small">
          <a-step v-for="item in steps" :key="item.title" :title="item.title" />
        </a-steps>

        <div class="steps-content">
          <component :is="steps[current].content" @change="handleStepChange"></component>
        </div>
        <!-- <div class="steps-action">
          <a-button v-if="current < steps.length - 1" type="primary" @click="next">
            下一步
          </a-button>
          <template v-if="current == steps.length - 1">
            <a-button type="primary" @click="() => handleSubmit(1)">
              提交审核
            </a-button>
            <a-button type="primary" @click="() => handleSubmit(2)">
              保存
            </a-button>
          </template>
          <a-button v-if="current > 0" style="margin-left: 8px" @click="prev">
            上一步
          </a-button>
        </div> -->
      </div>
    </a-spin>
  </a-modal>
</template>
<script>
import { facInfoAddOrUpdate, facInfoApprove, facInfoDetail } from '@/api/outsourcingManagement'
import BaseInfo from './BaseInfo'
import BussessInfo from './BussessInfo'
import HandleInfo from './HandleInfo'
import CashInfo from './CashInfo'
import RecordInfo from './RecordInfo'

export default {
  name: 'AddForm',
  components: {
    BaseInfo,
    BussessInfo,
    HandleInfo,
    CashInfo,
    RecordInfo
  },
  data() {
    return {
      visible: false,
      spinning: false,
      type: 'view',
      current: 4,
      steps: [
        {
          title: '基础信息',
          content: 'BaseInfo'
        },
        {
          title: '业务信息',
          content: 'BussessInfo'
        },
        {
          title: '加工范围',
          content: 'HandleInfo'
        },
        {
          title: '收款信息',
          content: 'CashInfo'
        },
        {
          title: '考察记录',
          content: 'RecordInfo'
        }
      ],
      record: {},
      detail: {
        
      }
    }
  },
  computed: {
    modalTitle() {
      return `${this.isView ? '查看' : this.isAdd ? '新增' : '编辑'}加工商`
    },
    isView() {
      return this.type === 'view'
    },
    isEdit() {
      return this.type === 'edit'
    },
    isAdd() {
      return this.type === 'add'
    }
  },
  methods: {
    query(type, record) {
      debugger
      let that = this
      that.visible = true
      that.type = type
      that.record = Object.assign({}, record)
      if (type === 'add') {
        return
      }
      facInfoDetail({ id: record.id }).then(res => {
        that.detail = res.data
      })
    },
    async fillData(resultData) {
      let that = this

      that.reportNum = resultData.dailyNum
      that.departmentName = resultData.departmentName
      that.stationName = resultData.stationName
      that.trueName = resultData.userName
      that.todayList = resultData.todayList || []
      that.planList = resultData.planList || []
      if (Array.isArray(resultData.annexList)) {
        that.fileList = resultData.annexList.map((item, index) => {
          return {
            uid: String(index + 1),
            name: item.workUrl,
            status: 'done',
            url: item.workUrl
          }
        })
      }
    },
    handleSubmit() {
      let that = this

      if (that.isView) {
        that.handleCancel()
        return
      }

      this.form.validateFields((err, values) => {
        if (!err) {
        }
      })
    },
    handleCancel() {
      this.current = 0
      this.$nextTick(() => (this.visible = false))
    },
    next() {
      this.current++
    },
    prev() {
      this.current--
    },
    handleStepChange(current,type,record) {
      const that = this
      let len = that.steps.length - 1
      if(type === 'next' && current < len){
        that.current ++
      }
      if(type === 'prev' && current > 0 && current < len){
        that.current --
      }
    }
  }
}
</script>
<style scoped>
.steps-content{
  margin-top: 20px;
}
.steps-action {
  text-align: center;
  margin-top: 20px;
}
</style>
