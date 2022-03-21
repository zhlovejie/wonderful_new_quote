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
      <div  v-if="detail.id">
        <BaseInfo1 ref="baseInfo1" />
        <div class="steps-action">
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
import { facinfoneedDetail, facinfoneedUpdate, facinfoneedApprove } from '@/api/outsourcingManagement'
import BaseInfo1 from './BaseInfo1'
import Approval from './Approval'
export default {
  name: 'ViewForm',
  provide() {
    return {
      addForm: this
    }
  },
  components: {
    BaseInfo1,
    Approval
  },
  data() {
    return {
      visible: false,
      spinning: false,
      type: 'view',
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
      that.spinning = true
      facinfoneedDetail({ id: record.id })
        .then(res => {
          that.spinning = false
          that.detail = res.data
        })
        .catch(err => {
          that.spinning = false
          that.$message.error(err.message)
        })
    },
    async handleSubmit(operationFlag) {
      let that = this
      

      let {code,result} = await that.$refs.baseInfo1.validate()
      if(code === 0){

      }else{
        return
      }
      console.log(result)

      that.spinning = true
      await facinfoneedUpdate({
        ...result,
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
