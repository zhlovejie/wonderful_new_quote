<template>
  <div class="material-rule-management-library-normal-step2-wrapper">
    <a-spin :spinning="spinning">
      <a-tabs
        :activeKey="activeKey"
        :defaultActiveKey="1"
        @change="tabChange"
      >
        <a-tab-pane
          tab="基本资料"
          :key="1"
        />
        <a-tab-pane
          tab="工艺资料"
          :key="2"
        />
        <a-tab-pane
          tab="采购资料"
          :key="3"
        />
        <a-tab-pane
          tab="附件"
          :key="4"
        />
      </a-tabs>
      <!-- 基本资料 -->
      <div v-show="activeKey === 1">
        <BaseData ref="baseData" />
      </div>
      <!-- 基本资料 END-->

      <!-- 工艺资料 -->
      <div v-show="activeKey === 2">
        <TechnologyData ref="technologyData" />
      </div>
      <!-- 工艺资料 END-->

      <!-- 采购资料 -->
      <div v-show="activeKey === 3">
        <ShoppingData ref="shoppingData" />
      </div>
      <!-- 采购资料 END-->

      <!-- 附件 -->
      <div v-show="activeKey === 4">
        <AppendData ref="appendData" />
      </div>
      <!-- 附件 END-->
      <p
        style="margin-top:20px;text-align:center;"
        v-if="normalAddForm.isAdd || normalAddForm.isEdit"
      >
        <a-button
          v-if="normalAddForm.isAdd"
          type="primary"
          @click="() => onSubmit(1)"
        >
          上一步
        </a-button>
        <a-button
          style="margin: 0 10px;"
          type="primary"
          @click="() => onSubmit(2)"
        >
          保存
        </a-button>
        <!-- <a-button
          v-if="normalAddForm.isAdd"
          type="primary"
          @click="() => onSubmit(3)"
        >
          提交审核
        </a-button> -->
        <a-button

          @click="resetForm"
        >
          取消
        </a-button>
      </p>
    </a-spin>
  </div>
</template>
<script>
import BaseData from './BaseData'
import TechnologyData from './TechnologyData'
import ShoppingData from './ShoppingData'
import AppendData from './AppendData'
import {
  routineMaterialInfoAdd,
  routineMaterialInfoUpdate ,
  productMaterialInfoAdd,
  productMaterialInfoUpdate
} from '@/api/routineMaterial'

export default {
  name: 'material-rule-management-library-normal-step2',
  inject: ['normalAddForm'],
  components: {
    BaseData,
    TechnologyData,
    ShoppingData,
    AppendData
  },
  data() {
    return {
      activeKey: 1,
      spinning: false
    }
  },
  methods: {
    tabChange(key) {
      this.activeKey = +key
    },
    async onSubmit(type) {
      const that = this

      if(type === 1){ //返回上一步
        that.$emit('change','prevStep')
        return
      }

      let refs = ['baseData', 'technologyData', 'shoppingData']

      let baseDataResult = await that.$refs.baseData.validate()
      let appendDataResult = await that.$refs.appendData.validate()

      if (baseDataResult && appendDataResult) {
        that.spinning = true
        let api;
        if(that.normalAddForm.isNormal){
          api = that.normalAddForm.isAdd ? routineMaterialInfoAdd : routineMaterialInfoUpdate
        }else{
          api = that.normalAddForm.isAdd ? productMaterialInfoAdd : productMaterialInfoUpdate
        }

        // console.log(that.normalAddForm.submitParams)
        let submitParams = {...that.normalAddForm.submitParams}
        delete submitParams.specificationsList
        api(submitParams)
          .then(res => {
            that.spinning = false
            that.$message.info(res.msg)
            if (res.code === 200) {
              that.$emit('change','ok')
            }
          })
          .catch(err => {
            console.log(err)
            that.spinning = false
          })
      }
    },
    resetForm() {
      this.normalAddForm.handleCancel()
    },
    fillData() {
      const that = this[('baseData', 'technologyData', 'shoppingData', 'appendData')].map(s => {
        let _c = that.$refs[s]
        _c && _c.fillData && _c.fillData()
      })
    }
  }
}
</script>
<style scoped>
</style>
