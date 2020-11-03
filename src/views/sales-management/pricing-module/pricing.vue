<template>
  <div class="develop-wrap">
    <div class="pricing-search-wrapper">
      <a-form layout="inline">
        <!-- <a-form-item>
          <a-input
            class="search-input"
            v-model="priceModelInput"
            placeholder="核价编号模糊查询"
            @pressEnter="PriceModelPressEnter"
          />
        </a-form-item>
        <a-form-item>
          <a-input
            class="search-input"
            v-model="customerInput"
            placeholder="客户名称模糊查询"
            @pressEnter="CustomerPressEnter"
          />
        </a-form-item>
        <a-form-item>
          <a-select
            :class="hidden"
            class="search-input"
            v-model="approveStatus"
            style="width: 200px"
          >
            <a-select-option :value="-1">请选择审批状态</a-select-option>
            <a-select-option :value="0">待接收</a-select-option>
            <a-select-option :value="1">已接收待核价</a-select-option>
            <a-select-option :value="2">驳回</a-select-option>
            <a-select-option :value="3">核价通过</a-select-option>
            <a-select-option :value="4">待生成代码</a-select-option>
            <a-select-option :value="5">代码已生成</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item>
          <a-input
            :class="hidden"
            read-only
            class="search-input"
            v-model="basisModelName"
            placeholder="所依据产品代码"
            @click="productModelChange"
          >
            <a-icon
              slot="addonAfter"
              v-if="basisModelName.length > 0"
              type="close-circle"
              @click="clearBasisModelName"
            />
          </a-input>
        </a-form-item>

        <a-form-item>
          <a-input :class="hidden" class="search-input" v-model="applyUserName" placeholder="申请人" />
        </a-form-item> -->

        <template v-if="$auth('pricing:list')">
          <a-form-item>
            <a-button-group>
              <a-button type="primary" :class="{ currentDayWeekMonth: dayWeekMonth === 1 }" @click="simpleSearch(1)"
                >今天</a-button
              >
              <a-button type="primary" :class="{ currentDayWeekMonth: dayWeekMonth === 2 }" @click="simpleSearch(2)"
                >本周</a-button
              >
              <a-button type="primary" :class="{ currentDayWeekMonth: dayWeekMonth === 3 }" @click="simpleSearch(3)"
                >本月</a-button
              >
              <a-button type="primary" :class="{ currentDayWeekMonth: dayWeekMonth === 4 }" @click="simpleSearch(4)"
                >全部</a-button
              >
            </a-button-group>
          </a-form-item>
          <!-- <a-form-item>
            <a-button
              class="a-button"
              type="primary"
              icon="search"
              @click="searchNuclearPriceList"
            >查询</a-button>
          </a-form-item> -->
          <a-form-item>
            <a-button class="a-button" type="primary" icon="search" @click="openSearchModel">高级筛选</a-button>
          </a-form-item>
        </template>
        <div class="action-wrapper" style="float: right">
          <a-form-item>
            <template v-if="$auth('pricing:add')">
              <a-button type="primary" @click="applyFor" icon="plus">申请</a-button>
            </template>
          </a-form-item>
        </div>
      </a-form>
    </div>
    <div>
      <a-tabs defaultActiveKey="0" @change="callback">
        <a-tab-pane tab="全部" key="0">
          <all-the-contract ref="allTheContract" />
        </a-tab-pane>
        <template v-if="$auth('pricing:approval')">
          <a-tab-pane tab="待审批" key="1">
            <approval-pending ref="ApprovalPending" />
          </a-tab-pane>
          <a-tab-pane tab="已审批" key="2">
            <approved-contract ref="ApprovedContract" />
          </a-tab-pane>
        </template>
      </a-tabs>
    </div>

    <!-- <product-model ref="productModel" @custom-change="productChange"></product-model> -->
    <SearchForm ref="searchForm" @change="paramChangeHandler" />
  </div>
</template>

<script>
import allTheContract from './pricings/Allthecontract'
import ApprovalPending from './pricings/ApprovalPending'
import ApprovedContract from './pricings/ApprovedContract'
//import ProductModel from '@/views/sales-management/contract-list-management/step-forms/productModel'

import SearchForm from './pricings/SearchForm'
export default {
  name: 'Pricing',
  components: {
    allTheContract, // 全部
    ApprovalPending, // 待审批
    ApprovedContract, // 已审批
    //ProductModel,
    SearchForm,
  },
  props: {},
  data() {
    return {
      data: [],
      priceModelInput: '', // 核价编号输入框的值
      customerInput: '', // 客户名称输入框的值
      hidden: 'block',
      tabKey: '0',
      approveStatus: -1,
      basisModel: 0, //所依据产品代码
      basisModelName: '',
      applyUserName: '', //申请人
      searchParams: {}, //高级筛选条件对象
      dayWeekMonth: 1, //今天、本周、本月
      isExpanded: false, //是否展开列表子数据
    }
  },
  computed: {},
  watch: {
    $route(to, from) {
      //this.$refs['allTheContract'].getList()
      //console.log(from)
      if (to.name === 'pricing') {
        console.log('刷新核价列表this.$refs', this.$refs)
        //this.$refs['allTheContract'].getList()
        //this.$refs['ApprovalPending'].getList()
        // this.$refs['ApprovedContract'].getList()
        // this.$destroy('LookNuclearPrice')
        this.searchAction()
      }
    },
  },
  mounted: function () {
    this.searchAction()
  },
  methods: {
    searchAction(opt = {}) {
      this.$nextTick(() => {
        let target = this.getTargetTableRef()
        console.log('target', target)
        if (target) {
          target.isExpanded = this.isExpanded
          target.getList({ statue: this.tabKey, ...this.searchParams, dayWeekMonth: this.dayWeekMonth, ...opt })
        }
      })
    },
    // 申请
    applyFor() {
      // 跳转到申请核价页面，并携带所要传递的参数传递到目标页面
      this.$router.push({ name: 'ApplyNuclearPrice' })
    },
    // 切换页面的回调
    callback(key) {
      this.tabKey = key
      this.searchAction()
    },
    openSearchModel() {
      this.$refs.searchForm.query()
    },
    paramChangeHandler(params) {
      this.isExpanded = true
      this.searchParams = { ...params }
      this.searchAction()
    },
    simpleSearch(type) {
      if (type === 4) {
        this.dayWeekMonth = undefined
        this.searchAction()
      } else {
        this.isExpanded = false
        this.dayWeekMonth = this.dayWeekMonth === type ? undefined : type
        this.searchAction()
      }
      // this.isExpanded = false
      // this.dayWeekMonth = this.dayWeekMonth === type ? undefined : type
      // this.searchAction()
    },
    getTargetTableRef() {
      let tabKey = parseInt(this.tabKey, 10)
      let target = null
      if (tabKey === 0) {
        target = this.$refs['allTheContract']
      } else if (tabKey === 1) {
        target = this.$refs['ApprovalPending']
      } else if (tabKey === 2) {
        target = this.$refs['ApprovedContract']
      }
      return target
    },
  },
}
</script>

<style lang="less" scoped>
.top-ation .a-input {
  width: 160px;
  margin: 0 8px 8px 0;
}
.search-input {
  width: 160px;
}
.a-button {
  margin-right: 8px;
}
.fl-r {
  float: right;
}
.develop-wrap {
  background-color: #fff;
  padding: 12px;
}
.block {
  display: inline-block;
}
.none {
  display: none;
}

.currentDayWeekMonth {
  opacity: 0.7;
}
</style>
