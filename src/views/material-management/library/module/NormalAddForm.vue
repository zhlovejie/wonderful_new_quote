<template>
  <a-modal
    :title="modalTitle"
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
    <div v-if="isAdd || isEdit">
      <StepOne ref="stepOne" v-show="isNormal && step === 1" @change="stepOneChange" />
      <StepProduct v-show="isProduct && step === 1" @change="stepOneChange" />
      <StepTwo v-if="step === 2" @change="stepTwoChange" />
    </div>
    <div v-else-if="isView">
      <StepTwo @change="stepTwoChange" />
    </div>
    <div v-else></div>
  </a-modal>
</template>

<script>
import StepOne from './Step1'
import StepTwo from './Step2'
import StepProduct from './StepProduct'
import {
  routineMaterialInfo,
  routineMaterialAccessory,
  productMaterialAccessory,
  productMaterialInfo,
  getRoutineMaterialInfoCode
} from '@/api/routineMaterial'
const modalTitleMap = { add: '新增', view: '查看', edit: '修改', loading: '加载中...' }
let uuid = () =>
  Math.random()
    .toString(32)
    .slice(-10)
export default {
  name: 'material-rule-management-library-normal-AddForm',
  components: {
    StepOne,
    StepTwo,
    StepProduct
  },
  provide() {
    return {
      normalAddForm: this
    }
  },
  data() {
    return {
      type: 'loading',
      visible: false,
      spinning: false,
      step: 1,
      detail: {},
      record: {},
      submitParams: {},
      selectNode: {},
      stepOneCacheData: {},
      stepTwoCacheData: {}
    }
  },
  computed: {
    modalTitle() {
      return modalTitleMap[this.type]
    },
    isView() {
      return this.type === 'view'
    },
    isAdd() {
      return this.type === 'add'
    },
    isEdit() {
      return this.type === 'edit'
    },
    isNormal() {
      return this.detail.__from === 'normal'
    },
    isProduct() {
      return this.detail.__from === 'product'
    }
  },
  methods: {
    uuid,
    async query(type, record) {
      const that = this
      //that.type = type
      that.visible = true
      that.detail = { ...record }
      that.record = { ...record }
      that.stepOneCacheData = {}
      that.stepTwoCacheData = {}
      that.selectNode = { ...that.detail.__selectItem }

      let isAdd = type === 'add'
      let isEdit = type === 'edit'
      let isView = type === 'view'
      if (isAdd) {
        that.step = 1
      } else if (isView || isEdit) {
        that.step = 2
        let __APIAccessory = that.isNormal ? routineMaterialAccessory : productMaterialAccessory
        let __APIInfo = that.isNormal ? routineMaterialInfo : productMaterialInfo

        let [accessory, result, stepOneData] = await Promise.all([
          __APIAccessory({ materialId: record.id }).then(res => res.data),
          __APIInfo({ id: record.id }).then(res => res.data),
          getRoutineMaterialInfoCode({ materialId: record.id }).then(res => res.data)
        ])

        // let accessory = await __APIAccessory({ materialId: record.id }).then((res) => res.data)
        // let result = await __APIInfo({ id: record.id }).then((res) => res.data)
        // let stepOneData = await getRoutineMaterialInfoCode({materialId:record.id}).then((res) => res.data)

        that.submitParams = {
          ...result,
          accessory,
          stepOneData: stepOneData,
          __materialCodeCache: result.materialCode
        }
      }
      that.$nextTick(() => {
        that.type = type
      })
    },
    stepOneChange({ __action__, values }) {
      debugger
      const that = this
      if (__action__ === 'nextStep') {
        that.submitParams = { ...that.submitParams, ...values }
        that.step = 2
      } else if (__action__ === 'close') {
        that.visible = false
      } else {
        console.error(`未知命令：`, arguments)
      }
    },
    stepTwoChange(type) {
      const that = this
      if (type === 'ok') {
        that.handleCancel()
        that.$emit('finish')
      } else if (type === 'prevStep') {
        debugger
        that.step = 1
        if (that.isEdit && that.$refs.stepOne) {
          that.$refs.stepOne.fillDate()
        }
      }
    },
    handleSubmit() {
      this.handleCancel()
    },
    handleCancel() {
      const that = this
      that.step = 1
      that.detail = {}
      that.submitParams = {}
      that.stepOneCacheData = {}
      that.stepTwoCacheData = {}
      that.$nextTick(() => {
        that.visible = false
      })
    },
    getSelectNode() {
      return this.selectNode
    },
    getId() {
      return this.detail.id
    }
  }
}
</script>

<style scoped></style>
