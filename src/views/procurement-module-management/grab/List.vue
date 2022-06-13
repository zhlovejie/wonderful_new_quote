<template>
  <a-card :bordered="false">
    <div class="search-wrapper">
      <a-form layout="inline">
        <a-form-item>
          <a-input
            placeholder="需求单号、物料代码、物料名称模糊查询"
            v-model="queryParam.keyword"
            allowClear
            style="width: 300px"
          />
        </a-form-item>
        <a-form-item>
          <DepartmentSelect placeholder="部门" style="width: 150px" allowClear :depId.sync="queryParam.applyDepId" />
        </a-form-item>
        <a-form-item>
          <CommonDictionarySelect
            placeholder="需求类型"
            style="width: 150px"
            allowClear
            :text="'采购模块-需求类型'"
            :dictionaryId.sync="queryParam.requestType"
          />
        </a-form-item>
        <a-form-item>
          <a-select placeholder="紧急程度" style="width: 150px" allowClear v-model="queryParam.urgencyDegree">
            <a-select-option :value="0">一般</a-select-option>
            <a-select-option :value="2">紧急</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" icon="search" @click="search">查询</a-button>
        </a-form-item>
      </a-form>
    </div>

    <div class="main-wrapper">
      <a-tabs :activeKey="activeKey" :defaultActiveKey="activeKey" @change="tabChange">
        <template v-if="$auth('quotation:qiangdan')">
          <a-tab-pane tab="待抢单" :key="1" />
        </template>
        <template v-if="$auth('quotation:paidan')">
          <a-tab-pane tab="已派单" :key="2" />
        </template>
        <template v-if="$auth('quotation:gongshi')">
          <a-tab-pane tab="公示中" :key="3" />
        </template>

        <template v-if="$auth('quotation:aapproval')">
          <a-tab-pane tab="待审核" :key="4" />
        </template>
        <template v-if="$auth('quotation:pass')">
          <a-tab-pane tab="通过" :key="5" />
        </template>
        <template v-if="$auth('quotation:reject')">
          <a-tab-pane tab="不通过" :key="6" />
        </template>

        <template v-if="$auth('quotation:aexceptioncase')">
          <a-tab-pane tab="待处理报价异常单" :key="7" />
        </template>
        <template v-if="$auth('quotation:bexceptioncase')">
          <a-tab-pane tab="已处理报价异常单" :key="8" />
        </template>
      </a-tabs>

      <template v-if="[1, 2].includes(activeKey)">
        <ListTypeOne ref="ref_table" :queryParam="queryParamCustom" :tagKey="activeKey" />
      </template>
      <template v-if="[3].includes(activeKey)">
        <ListTypeTwo ref="ref_table" :queryParam="queryParamCustom" :tagKey="activeKey" />
      </template>
      <template v-if="[4, 5, 6, 7, 8, 9].includes(activeKey)">
        <ListTypeThree ref="ref_table" :queryParam="queryParamCustom" :tagKey="activeKey" />
      </template>
    </div>
  </a-card>
</template>

<script>
import DepartmentSelect from '@/components/CustomerList/DepartmentSelect'
import CommonDictionarySelect from '@/components/CustomerList/CommonDictionarySelect'
import ListTypeOne from './ListTypeOne'
import ListTypeTwo from './ListTypeTwo'
import ListTypeThree from './ListTypeThree'
export default {
  name: 'procurement-module-management-grab',
  components: {
    DepartmentSelect,
    CommonDictionarySelect,
    ListTypeOne,
    ListTypeTwo,
    ListTypeThree
  },
  data() {
    return {
      queryParam: {},
      activeKey: 1
    }
  },
  computed: {
    queryParamCustom() {
      let k = this.activeKey
      let case1 = [1, 2].includes(k)
      let case2 = [3].includes(k)
      let case3 = [4, 5, 6, 7, 8, 9].includes(k)

      let extendsParams = { current: 1 }
      if (case1) {
        let m = {
          1: {
            //待抢单
            queryType: 4,
            result: undefined
          },
          2: {
            //已派单
            queryType: 5,
            result: undefined
          }
        }
        extendsParams = { ...extendsParams, ...m[k] }
      } else if (case2) {
        let m = {
          3: {
            //公示中
            queryType: undefined,
            result: undefined
          }
        }
        extendsParams = { ...extendsParams, ...m[k] }
      } else if (case3) {
        let m = {
          4: {
            //待审批
            queryType: 2,
            result: undefined,
            exceptionResult: undefined,
            forOrder: 2
          },
          5: {
            //通过
            queryType: 3,
            result: 1,
            exceptionResult: undefined,
            forOrder: 2
          },
          6: {
            //不通过
            queryType: 3,
            result: 2,
            exceptionResult: undefined,
            forOrder: 2
          },
          7: {
            queryType: 3,
            result: 3,
            exceptionResult: 5,
            forOrder: 2
          },
          8: {
            queryType: 3,
            result: 3,
            exceptionResult: 6,
            forOrder: 2
          },
          9: {
            //全部
            queryType: 1,
            result: undefined,
            exceptionResult: undefined,
            forOrder: 2
          }
        }
        extendsParams = { ...extendsParams, ...m[k] }
      }

      return { ...this.queryParam, ...extendsParams }
    }
  },
  watch: {
    $route: {
      handler: function(to, from) {
        if (to.name === 'procurement-module-management-grab') {
          this.search()
        }
      },
      immediate: true
    }
  },
  methods: {
    search(opt) {
      const that = this
      that.$nextTick(() => {
        let _ref = this.$refs['ref_table']
        _ref && _ref.search && _ref.search()
      })
    },
    tabChange(tagKey) {
      this.activeKey = +tagKey
      this.search()
    }
  }
}
</script>

<style scoped></style>
