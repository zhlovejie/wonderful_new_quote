<template>
  <a-modal
    :title="modalTitle"
    :width="650"
    :visible="visible"
    :destroyOnClose="true"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :maskClosable="false"
    :confirmLoading="spinning"
  >
    <a-spin :spinning="spinning">

      <a-form :form="form" class="routine-addform-wrapper">
          <a-form-item label="已选择节点">
            <template v-if="Array.isArray(detail.selectedRows)">
              <div v-for="item in detail.selectedRows">
                {{item.ruleName}}
              </div>
            </template>
            <template v-else>
              <span>无</span>
            </template>
          </a-form-item>
          <a-form-item label="选择迁入位置">
            <a-tree-select
              style="width: 100%"
              v-decorator="[
                'parentId',
                { initialValue: detail.parentId, rules: [{ required: true, message: '选择迁入位置' }] },
              ]"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              :loadData="onLoadData"
              :tree-data="treeData"
            />
          </a-form-item>
      </a-form>

    </a-spin>
  </a-modal>
</template>
<script>
import {
  routineMaterialRulePageTwoTierTreeList,
  productMaterialRulePageTwoTierTreeList,
  materialRuleTransferSeat
} from '@/api/routineMaterial'
import { getDictionary } from '@/api/common'

export default {
  name: 'BatchTransferForm',
  data() {
    return {
      type: 'add',
      visible: false,
      spinning: false,
      treeData: [],
      form: this.$form.createForm(this),
      from: 'normal', // normal常规 product成品
      detail:{}
    }
  },
  created() {},
  computed: {
    modalTitle() {
      return '数据迁移'
    },
    treeDisable() {
      return this.type === 'edit'
    },
    isAdd() {
      return this.type === 'add'
    },
    isEdit() {
      return this.type === 'edit'
    },
    isNormal() {
      return this.from === 'normal'
    },
    isProduct() {
      return this.from === 'product'
    },
    isNormalAdd() {
      return this.isNormal && this.isAdd
    },
    isNormalUpdate(){
      return this.isNormal && this.isEdit
    },
    isProductAdd() {
      return this.isProduct && this.isAdd
    },
  },
  methods: {
    async query(type, record) {
      debugger
      const that = this
      that.type = type
      that.detail = {}
      that.visible = true

      let { __selectItem, __treeData, __from ,selectedRows} = record
      that.from = __from
      that.treeData = __treeData

      that.detail = { ...record }
      that.$nextTick(() => {
        that.form.setFieldsValue({ parentId: __selectItem.key })
      })
    },
    handleSubmit() {
      const that = this
      that.form.validateFields((err, values) => {
        if (!err) {

          let param = {
            transferSeatId:values.parentId,
            ids:that.detail.selectedRows.map(item => String(item.id))
          }

          if([...param.ids,'0'].includes(String(param.transferSeatId))){
            that.$message.info('迁入位置节点重复')
            return
          }
          let emitParam = {
            key: param.transferSeatId
          }
          that.spinning = true
          materialRuleTransferSeat(param)
            .then((res) => {
              that.spinning = false
              that.form.resetFields() // 清空表
              that.visible = false
              that.$message.info(res.msg)
              that.$emit('finish', emitParam)
            })
            .catch((err) => (that.spinning = false))
        }
      })
    },
    handleCancel() {
      this.value = []
      this.visible = false
    },
    onLoadData(treeNode) {
      const that = this
      return new Promise((resolve) => {
        if (treeNode.dataRef.children) {
          resolve()
          return
        }
        let api = that.isNormal ? routineMaterialRulePageTwoTierTreeList : productMaterialRulePageTwoTierTreeList
        api({ parentId: treeNode.dataRef.value })
          .then((res) => {
            treeNode.dataRef.children = res.data.map((item) => that.formatTreeData(item))
            that.treeData = [...that.treeData]
            resolve()
          })
          .catch((err) => {
            that.$message.error(`调用接口[routineMaterialRulePageTreeList]时发生错误，错误信息:${err}`)
          })
      })
    },
    //格式化接口数据 key,title,value
    formatTreeData(item) {
      let that = this
      let obj = {}
      obj.key = String(item.id)
      obj.title = `${item.newRuleName || item.ruleName}(${item.code})`
      obj.value = String(item.id)
      // obj.isLeaf = !(Array.isArray(item.subList) && item.subList.length > 0)
      obj.parentId = item.parentId
      obj.codeLength = +item.codeLength
      obj.code = item.code
      obj.scopedSlots = { title: 'title' }
      //obj.__selectable = obj.isLeaf
      if (Array.isArray(item.subList) && item.subList.length > 0) {
        obj.children = item.subList.map((v) => that.formatTreeData(v))
      }
      return obj
    },
  },
}
</script>

<style scoped>
.routine-addform-wrapper >>> .ant-form-item {
  display: flex;
}
.routine-addform-wrapper >>> .ant-form-item .ant-form-item-label {
  width: 140px;
  text-align: left;
}
.routine-addform-wrapper >>> .ant-form-item .ant-form-item-control-wrapper {
  flex: 1;
}
</style>

