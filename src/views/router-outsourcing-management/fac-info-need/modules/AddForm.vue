<template>
  <a-modal
    :title="modalTitle"
    :width="1200"
    :visible="visible"
    :destroyOnClose="true"
    @cancel="handleCancel"
    :maskClosable="false"
    :footer="null"
  >
    <a-spin :spinning="spinning">
      <div v-if="steps[current]">
        <a-steps :current="current" size="small" style="width: 50%;margin: 0 auto;">
          <a-step v-for="item in steps" :key="item.title" :title="item.title" />
        </a-steps>
        <div class="steps-content">
          <keep-alive>
            <component 
            ref="currentStep" 
            :is="steps[current].content" 
            :detail="detail" 
            :fill="true"
            :disabled="isView || isApprove"
            ></component>
          </keep-alive>
        </div>
        <div class="steps-action">
          <template v-if="current > 0">
            <a-button type="primary" @click="handleStepChange('prev')">
              上一步
            </a-button>
          </template>

          <template v-if="current < steps.length - 1">
            <a-button type="primary" @click="handleStepChange('next')">
              下一步
            </a-button>
          </template>

          <template v-if="current === steps.length - 1">
            <template v-if="isAdd || isEdit">
              <a-button type="primary" @click="handleSubmit(2)">
                提交审核
              </a-button>
              <a-button type="primary" @click="handleSubmit(1)">
                保存
              </a-button>
            </template>

            <template v-if="isApprove">
              <a-button type="primary" @click="passAction">
                通过
              </a-button>
              <a-button type="primary" @click="noPassAction">
                不通过
              </a-button>
            </template>
          </template>
          <a-button type="primary" @click="handleCancel">
            关闭
          </a-button>
        </div>
      </div>
      <Approval ref="approval" @opinionChange="opinionChange" />
    </a-spin>
  </a-modal>
</template>
<script>
import { facinfoneedDetail, facinfoneedAdd, facinfoneedApprove } from '@/api/outsourcingManagement'
import BaseInfo from './BaseInfo'
import BussessInfo from './BussessInfo'
import Approval from './Approval'
export default {
  name: 'AddForm',
  provide() {
    return {
      addForm: this
    }
  },
  components: {
    BaseInfo,
    BussessInfo,
    Approval
  },
  data() {
    return {
      visible: false,
      spinning: false,
      type: 'view',
      current: 0,
      steps: [
        {
          title: '选择成品物料',
          content: 'BaseInfo'
        },
        {
          title: '选择工艺工序及参数',
          content: 'BussessInfo'
        }
      ],
      record: {},
      detail: {}
    }
  },
  computed: {
    modalTitle() {
      return `${this.isView ? '查看' : this.isAdd ? '新增' : this.isEdit ? '编辑' : '审批'}委外加工申请`
    },
    isView() {
      return this.type === 'view'
    },
    isEdit() {
      return this.type === 'edit'
    },
    isAdd() {
      return this.type === 'add'
    },
    isApprove() {
      return this.type === 'approve'
    },
    isDisabled() {
      return this.isView || this.isApprove
    }
  },
  methods: {
    query(type, record = {}) {
      let that = this
      
      that.detail = {}
      that.visible = true
      that.type = type
      that.record = Object.assign({}, record)
      if (type === 'add') {
        that.current = 0
        return
      }
      that.current = -1
      that.spinning = true
      facinfoneedDetail({ id: record.id })
        .then(res => {
          that.spinning = false
          that.detail = res.data
          that.current = 0
        })
        .catch(err => {
          that.spinning = false
          that.$message.error(err.message)
        })
    },
    async handleSubmit(operationFlag) {
      let that = this
      // 处理最后一步
      let result = await that.$refs.currentStep.validate().then(({code,result}) => {
        if(code === 0){
          that.detail = {...that.detail,...result}
        }
        return code
      })
      if(result !== 0){
        return
      }
      that.spinning = true
      await facinfoneedAdd({
        ...that.detail,
        operationFlag
      })
        .then(res => {
          that.spinning = false
          if(+res.code === 200){
            that.visible = false
            that.$emit('ok')
          }
          that.$message.info(res.msg)
        })
        .catch(err => {
          that.spinning = false
          that.$message.error(err.message)
        })
      return
    },
    handleCancel() {
      this.current = 0
      this.$nextTick(() => (this.visible = false))
    },
    handleStepChange(type) {
      const that = this
      if (type === 'next') {
        that.$refs.currentStep.validate().then(({code,result}) => {
          if(code === 0){
            that.detail = {...that.detail,...result}
            that.current++
          }
        })
        return
      }
      if (type === 'prev') {
        that.current--
        return
      }
    },
    submitAction(opt) {
      let that = this
      let values = {
        approveId: that.record.id,
        approveIdList:[that.record.id],
        isAdopt: opt.isAdopt,
        opinion: opt.opinion
      }
      that.spinning = true
      facinfoneedApprove(values)
        .then(res => {
          that.spinning = false
          if(res.code === 200){
            that.visible = false
            that.$emit('ok')
          }
          that.$message.info(res.msg)
        })
        .catch(err => {
          that.spinning = false
          that.$message.error(err.message)
        })
    },
    passAction() {
      this.submitAction({
        isAdopt: 0,
        opinion: '通过'
      })
    },
    noPassAction() {
      let that = this
      //that.opinion = ''
      that.$refs.approval.query()
    },
    opinionChange(opinion) {
      //审批意见
      this.submitAction({
        isAdopt: 1,
        opinion: opinion
      })
    }
  }
}
</script>
<style scoped>
.steps-content {
  margin-top: 20px;
}
.steps-action {
  text-align: center;
  margin-top: 20px;
}
.steps-action >>> .ant-btn {
  margin: 0 5px;
}
</style>
