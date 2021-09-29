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
            <DepartmentSelect
              placeholder="部门"
              style="width: 150px"
              allowClear
              :depId.sync="queryParam.applyDepId"
            />
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
            <a-select
              placeholder="紧急程度"
              style="width: 150px"
              allowClear
              v-model="queryParam.urgencyDegree"
            >
              <a-select-option :value="1">一般</a-select-option>
              <a-select-option :value="2">加急</a-select-option>
              <a-select-option :value="3">特急</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item v-if="+activeKey === 2">
            <a-select
              placeholder="入库状态"
              style="width: 150px"
              allowClear
              v-model="queryParam.storageStatus"
            >
              <a-select-option :value="0">未入库</a-select-option>
              <a-select-option :value="1">部分入库</a-select-option>
              <a-select-option :value="2">全部入库</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item>
            <a-button
              type="primary"
              icon="search"
              @click="search"
            >查询</a-button>
          </a-form-item>
        </a-form>
      </div>

      <div class="main-wrapper">
        <a-tabs
          :activeKey="activeKey"
          :defaultActiveKey="activeKey"
          @change="tabChange"
        >
          <a-tab-pane tab="需求申请单" :key="1" />
          <a-tab-pane tab="未完成采购单" :key="2" />
          <a-tab-pane tab="已完成采购单" :key="3" />
        </a-tabs>

        <template v-if="[1].includes(activeKey)">
          <ListTypeOne ref="ref_table" :queryParam="queryParamCustom" :tagKey="activeKey"/>
        </template>
        <template v-if="[2].includes(activeKey)">
          <ListTypeTwo ref="ref_table" :queryParam="queryParamCustom" :tagKey="activeKey"/>
        </template>
        <template v-if="[3].includes(activeKey)">
          <ListTypeThree ref="ref_table" :queryParam="queryParamCustom" :tagKey="activeKey"/>
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
  name:'procurement-module-management-order',
  components:{
    DepartmentSelect,
    CommonDictionarySelect,
    ListTypeOne,
    ListTypeTwo,
    ListTypeThree
  },
  data(){
    return {
      queryParam: {},
      activeKey: 1,
    }
  },
  computed:{
    queryParamCustom(){
      let k = this.activeKey
      let case1 = [1].includes(k)
      let case2 = [2].includes(k)
      let case3 = [3].includes(k)

      let extendsParams = {current:1}
      if(case1){
        // forOrder 是否为待采购列表：1是，2否
        // extendsParams = {...extendsParams,queryType:3,result:1,storageStatus:undefined,forOrder:1}
        extendsParams = {...extendsParams,queryType:undefined,result:undefined,storageStatus:undefined,forOrder:1}
      }else if(case2){
        extendsParams = {...extendsParams,finishStatus:1}
      }else if(case3){
        extendsParams = {...extendsParams,createdName:undefined,orderNum:undefined,queryType:1}
      }
      return {...this.queryParam,...extendsParams}
    }
  },
  watch: {
    $route: {
      handler: function(to, from) {
        if (to.name === 'procurement-module-management-order') {
          this.search()
        }
      },
      immediate: true
    }
  },
  methods:{
    search(opt){
      const that = this
      that.$nextTick(() => {
        let _ref = this.$refs['ref_table']
        _ref && _ref.search && _ref.search()
      })
    },
    tabChange(tagKey){
      this.activeKey = +tagKey
      this.search()
    }
  }
}
</script>

<style scoped>

</style>

