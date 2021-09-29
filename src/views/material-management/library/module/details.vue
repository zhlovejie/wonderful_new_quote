<template>
  <div>
    <div v-if="isAdd">
      <template v-if="isNormal">
        <StepOne v-if="step === 1" @change="stepOneChange" />
      </template>
      <template v-if="isProduct">
        <StepProduct v-if="step === 1" @change="stepOneChange" />
      </template>

      <StepTwo v-if="step === 2" @change="stepTwoChange" />
    </div>
    <div v-else-if="isView || isEdit">
      <StepTwo :ShowReturnButton="true" @change="stepTwoChange" />
    </div>
    <div v-else></div>
  </div>
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
} from '@/api/routineMaterial'
// const modalTitleMap = { add: '新增', view: '查看', edit: '修改', loading: '加载中...' }
let uuid = () => Math.random().toString(32).slice(-10)
export default {
  name: 'material-rule-management-library-normal-AddForm',
  components: {
    StepOne,
    StepTwo,
    StepProduct,
  },
  provide() {
    return {
      normalAddForm: this,
    }
  },
  data() {
    return {
      type: 'loading',
      visible: false,
      spinning: false,
      step: 1,
      detail: {},
      submitParams: {},
      record: {},
      selectNode: {},
    }
  },
  computed: {
    // modalTitle() {
    //   return modalTitleMap[this.type]
    // },
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
    },
  },
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'material-rule-details' && this.$route.params.id !== undefined) {
          let that = this
          that.record = this.$route.params
          that.query('view', this.$route.params)
        } else {
          this.$router.go(-1)
        }
      },
      immediate: true,
    },
  },
  methods: {
    uuid,
    async query(type, record) {
      const that = this
      //that.type = type
      //   that.visible = true
      that.detail = { ...record }

      that.selectNode = { ...that.detail.__selectItem }

      let isAdd = type === 'add'
      let isEdit = type === 'edit'
      let isView = type === 'view'
      if (isAdd) {
      } else if (isView || isEdit) {
        let __APIAccessory = that.isNormal ? routineMaterialAccessory : productMaterialAccessory
        let accessory = await __APIAccessory({ materialId: record.id }).then((res) => res.data)

        let __APIInfo = that.isNormal ? routineMaterialInfo : productMaterialInfo
        let result = await __APIInfo({ id: record.id }).then((res) => res.data)

        that.submitParams = {
          ...result,
          accessory,
        }
      }
      that.$nextTick(() => {
        that.type = type
      })
    },
    stepOneChange({ __action__, values }) {
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
    stepTwoChange() {
      this.handleCancel()
      this.$emit('finish')
    },
    handleSubmit() {
      this.handleCancel()
    },
    handleCancel() {
      const that = this
      that.step = 1
      that.detail = {}
      that.submitParams = {}
      that.$nextTick(() => {
        that.visible = false
      })
    },
    getSelectNode() {
      return this.selectNode
    },
    getId() {
      return this.detail.id
    },
  },
}
</script>

<style scoped>
</style>