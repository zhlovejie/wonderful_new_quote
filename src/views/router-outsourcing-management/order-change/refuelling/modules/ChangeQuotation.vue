<template>
  <a-modal
    title="更新报价"
    :width="1000"
    :visible="visible"
    :destroyOnClose="true"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :maskClosable="false"
    :confirmLoading="spinning"
    :footer="null"
    :forceRender="true"
  >
    <a-spin :spinning="spinning">
      <Quotation
        ref="quotation"
        :dataSource="detail"
        :bEdit="true"
        @cancel="handleCancel"
        @confirm="handleSubmit"
      ></Quotation>
    </a-spin>
  </a-modal>
</template>

<script>
import { refuellingInfo, refuellingQuotationSave, craftInfo, craftQuotationSave } from '@/api/orderChange'
import Quotation from './Quotation.vue'

export default {
  name: 'outsourcing-order-change-refuelling-quotation',
  components: { Quotation },
  data() {
    return {
      visible: false,
      spinning: false,
      detail: {},
      tag: 1 //tag:1 换料单-变更报价 2工序变更单-变更报价
    }
  },
  computed: {},
  methods: {
    async query(record, tag) {
      this.tag = tag
      const that = this
      that.visible = true
      if (tag === 2) {
        //工序变更单-变更报价
        craftInfo({ id: record.id }).then(res => {
          if (res.code === 200) {
            that.detail = res.data
            that.detail.materialVoList = res.data.materialVoList.map((item, index) => {
              item.key = index + 1
              item.stateText = { 1: '原物料', 2: '新物料', 3: '被替换' }[item.state] || '未知'
              item.typeText = { 1: '原料', 2: '模具' }[item.type] || '未知' //类型(1:原料,2:模具)
              return item
            })
            that.detail.sendTakeVoList = res.data.sendTakeVoList.map((item, index) => {
              item.key = index + 1
              item.typeText = { 1: '原料送取', 2: '成品送取' }[item.type] || '未知' //类型(1:原料送取,2:成品送取)
              item.materialName = { 1: '全部原料', 2: '成品' }[item.type] || '未知' //写死 原料送取为‘全部原料’ 成品为‘成品’
              return item
            })
            that.detail.changeNum = this.detail.oldProcessCount //默认为原料的加工数量
            that.$refs.quotation.query(that.detail)
          } else {
            that.$message.error(res.msg)
          }
        })
      } else {
        //换料单-变更报价
        refuellingInfo({ id: record.id }).then(res => {
          if (res.code === 200) {
            that.detail = res.data
            that.detail.materialVoList = res.data.materialVoList.map((item, index) => {
              item.key = index + 1
              item.stateText = { 1: '原物料', 2: '新物料', 3: '被替换' }[item.state] || '未知'
              item.typeText = { 1: '原料', 2: '模具' }[item.type] || '未知' //类型(1:原料,2:模具)
              return item
            })
            that.detail.sendTakeVoList = res.data.sendTakeVoList.map((item, index) => {
              item.key = index + 1
              item.typeText = { 1: '原料送取', 2: '成品送取' }[item.type] || '未知' //类型(1:原料送取,2:成品送取)
              item.materialName = { 1: '全部原料', 2: '成品' }[item.type] || '未知' //写死 原料送取为‘全部原料’ 成品为‘成品’
              return item
            })
            that.detail.changeNum = this.detail.oldProcessCount //默认为原料的加工数量
            that.$refs.quotation.query(that.detail)
          } else {
            that.$message.error(res.msg)
          }
        })
      }
    },
    //提交
    handleSubmit(type, detail, params) {
      console.log('详情：', detail)
      console.log('参数：', params)
      const that = this
      that.spinning = true
      if (that.tag === 2) {
        //工序变更单-变更报价
        craftQuotationSave(params)
          .then(res => {
            that.spinning = false
            that.$message.info(res.msg)
            if (res.code === 200) {
              that.$emit('ok')
              that.handleCancel()
            }
          })
          .catch(err => {
            that.spinning = false
            that.$message.error(err.message)
          })
      } else {
        //换料单-变更报价
        refuellingQuotationSave(params)
          .then(res => {
            that.spinning = false
            that.$message.info(res.msg)
            if (res.code === 200) {
              that.$emit('ok')
              that.handleCancel()
            }
          })
          .catch(err => {
            that.spinning = false
            that.$message.error(err.message)
          })
      }
    },
    //关闭更新报价视图
    handleCancel() {
      const that = this
      that.$nextTick(() => {
        that.visible = false
      })
    }
  }
}
</script>
