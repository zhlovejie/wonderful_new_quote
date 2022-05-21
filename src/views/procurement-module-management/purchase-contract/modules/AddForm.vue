<template>
  <div class="purchase-contract-addform-wrapper">
    <a-steps class="steps" :current="currentTab">
      <a-step v-for="s in stepList" :key="s.id" :title="s.title" />
    </a-steps>
    <keep-alive :max="10">
      <component ref="currentComponent" :is="stepList[currentTab].component"></component>
    </keep-alive>
    <div class="btn-wapper">
      <a-button type="primary" :disabled="currentTab === 0" @click="doAction('prev')">上一步</a-button>
      <a-button type="primary" :disabled="currentTab === stepList.length - 1" @click="doAction('next')"
        >下一步</a-button
      >
      <a-button type="primary">保存当前信息</a-button>
      <a-button type="primary">保存</a-button>
      <a-button type="primary">提交审核</a-button>
      <a-button type="danger">退出</a-button>
      <a-button type="danger">合同预览</a-button>
    </div>
  </div>
</template>

<script>
import Step0 from './Step0'
import Step1 from './Step1'
import Step2 from './Step2'
import Step3 from './Step3'
import Step4 from './Step4'
import Step5 from './Step5'

import {
  purchaseContractAddOrUpdate,
  purchaseContractList,
  purchaseContractDetail,
  purchaseContractPageList,
  purchaseContractDel,
  purchaseContractApproval,
  purchaseContractRevocation,
  getDetailBySupplierId,
  purchaseContractOrderList,
  purchaseContractOrderListRefresh
} from '@/api/procurementModuleManagement'

export default {
  name: 'purchase-contract-addform',
  provide() {
    return {
      addForm: this
    }
  },
  props: {
    selectedRows: {
      type: Array,
      default: () => []
    },
    action: {
      type: String,
      default: () => 'add'
    },
    from: {
      type: String,
      default: () => 'procurement-module-management-order'
    },
    record: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      userInfo: this.$store.getters.userInfo, // 当前登录人
      stepList: [
        {
          id: 1,
          title: '基本信息',
          component: Step0
        },
        {
          id: 2,
          title: '产品信息',
          component: Step1
        },
        {
          id: 3,
          title: '结算信息',
          component: Step2
        },
        {
          id: 4,
          title: '交货/验收',
          component: Step3
        },
        {
          id: 5,
          title: '乙方信息',
          component: Step4
        },
        {
          id: 6,
          title: '其他约定',
          component: Step5
        }
      ],
      currentTab: 0,
      submitParams: {},
      supplierInfo: null // 供应商信息
    }
  },
  computed: {
    isAdd() {
      return this.action === 'add'
    },
    isView() {
      return this.action === 'view'
    },
    isEdit() {
      return this.action === 'edit'
    },
    isApproval() {
      return this.action === 'approval'
    }
  },
  watch: {
    $route: {
      handler: function(to, from) {
        if (to.name === 'procurement-module-management-purchase-contract-action') {
          this.init()
        }
      },
      immediate: true
    }
  },
  created() {
    const that = this
    that.submitParams = {
      ...that.submitParams,
      purchaseUserId: that.userInfo.id,
      purchaseUserName: that.userInfo.trueName,
      purchasePhone: that.userInfo.mobile
    }
  },
  methods: {
    async init() {
      const that = this
      // 新增需要获取供应商信息
      debugger
      if (that.isAdd && that.selectedRows.length > 0) {
        that.supplierInfo = await getDetailBySupplierId({ supplierId: that.selectedRows[0].supplierId })
          .then(res => res.data)
          .catch(err => {
            console.log(err)
            return null
          })
      } else {
        // 别的情况需要获取合同详情
        const result_detail = await purchaseContractDetail({ id: that.record.id })
          .then(res => res.data)
          .catch(err => {
            console.log(err)
            return null
          })
        if (result_detail) {
          that.submitParams = { ...result_detail }
        }
      }
    },
    async doAction(type) {
      const that = this
      if (type === 'prev') {
        that.currentTab--
      } else if (type === 'next') {
        let result = await that.$refs['currentComponent'].validate()
        if (result.hasError) {
          return
        }
        that.submitParams = that._.assign(that.submitParams, result.data)
        console.log(JSON.stringify(that.submitParams, null, 2))
        that.currentTab++
      }
    },
    pick(source, keys) {
      let obj = {}
      keys.forEach(k => {
        obj[k] = source[k] || undefined
      })
      return obj
    }
  }
}
</script>

<style lang="less" scoped>
.purchase-contract-addform-wrapper {
  padding: 30px;
  background-color: #fff;
  .btn-wapper {
    margin-top: 20px;
    text-align: center;
    /deep/ .ant-btn {
      margin: 0 10px;
    }
  }
}
</style>
