<template>
  <a-card :bordered="false" class="depcustomer-list-wrapper">
    <!--搜索模块-->
    <div class="depcustomer-list-search-wrapper">
      <a-form layout="inline">
        <a-form-item label="客户名称">
          <a-input :allowClear="true" v-model.trim="queryParam.name" placeholder="根据客户名模糊查询" />
        </a-form-item>

        <a-form-item label="销售负责人" v-if="allSalesman.length > 0">
          <a-select
            style="width: 200px"
            :allowClear="true"
            v-model.trim="queryParam.userId"
            placeholder="请选择销售负责人"
          >
            <a-select-option v-for="salesMan in allSalesman" :key="salesMan.index" :value="salesMan.userId">{{
              salesMan.salesmanName
            }}</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item>
          <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
        </a-form-item>
      </a-form>
    </div>
    <s-table ref="table" size="default" rowKey="id" :columns="columns" :data="loadData" :pagination="pagination">
    </s-table>
  </a-card>
</template>

<script>
import { STable } from '@/components'

import { customerListForLearn, salesJurisdiction } from '@/api/customer'

let intentionMap = { 1: '有效客户', 2: '无效客户', 3: '竞争对手', 4: '黑名单客户' }
let poolMap = { 1: '公共客户池', 2: '部门客户池', 3: '待分配客户池', 4: '分配中' }

export default {
  name: 'curtomerLearnList',
  components: {
    // 组件
    STable,
  },
  data() {
    return {
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '序号',
          dataIndex: 'serial',
        },
        {
          title: '客户名称',
          dataIndex: 'name',
        },
        {
          title: '客户地址',
          dataIndex: 'address',
        },
        {
          title: '客户类型',
          dataIndex: 'typeName',
        },
        {
          title: '客户意向度',
          dataIndex: 'intentionTxt',
        },

        {
          title: '所属客户池',
          dataIndex: 'poolTxt',
        },
        {
          title: '销售负责人',
          dataIndex: 'salesman',
        },
        {
          title: '录入人',
          dataIndex: 'createdName',
        },
        {
          title: '录入时间',
          dataIndex: 'createdTime',
        },
      ],
      pagination: {
        showTotal: (total) => '共' + total + '条数据',
      },
      customerTypes: [],
      salesJurisdiction: {}, // 当前用户销售权限
      allSalesman: [], // 所有销售人员
      sources: [],
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        const that = this
        return customerListForLearn(Object.assign(parameter, this.queryParam))
          .then((res) => {
            if (res.code === 200) {
              res.data.records = res.data.records.map((item, idx) => {
                item.serial = idx + 1
                item.intentionTxt = that.getIntentionTxt(item.intention)
                item.poolTxt = that.getPoolTxt(item.pool)
                return item
              })

              return res
            } else {
              this.$message.error(res.msg)
            }
          })
          .catch(function (err) {
            console.log(err)
          })
      },
    }
  },
  created() {
    // 初始化钩子
    salesJurisdiction()
      .then((res) => {
        // 当前用户的销售权限
        var salesJurisdiction = res.data
        this.salesJurisdiction = salesJurisdiction
        if (salesJurisdiction.top) {
          // 最高权限才可以查看所有销售人员的客户
          this.allSalesman = salesJurisdiction.allSalesman
        }
        if (salesJurisdiction.leader || salesJurisdiction.assistant) {
          this.allSalesman = salesJurisdiction.subSalesman
        }
      })
      .catch(function (err) {
        console.log(err)
      })
  },
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'curtomer-learn-not-maintain') {
          this.$nextTick(() => {
            this.$refs.table && this.$refs.table.refresh()
          })
        }
      },
      immediate: true,
    },
  },
  methods: {
    getIntentionTxt(intention) {
      return intentionMap[intention] || '未知'
    },
    getPoolTxt(pool) {
      return poolMap[pool] || '未知'
    },
    getCustomerTypeTxt(type) {
      let target = this.customerTypes.find((item) => +item.id === +type)
      return target ? target.text : '未知'
    },
  },
}
</script>
