<template>
  <!-- 重复的客户 -->
  <div class="wdf-custom-wrapper">
    <div class="search-wrapper">
      <a-input placeholder="范围开始" v-model="searchParam.startNum" allowClear style="width:120px;" />
      <a-input placeholder="范围结束" v-model="searchParam.endNum" allowClear style="width:120px;" />
      <a-input placeholder="排除的字符" v-model="searchParam.exChar" allowClear style="width:180px;" />
      <a-input placeholder="设定多少位相同为重复" v-model="searchParam.num" allowClear style="width:200px;" />
      <a-select placeholder="是否更新当前所有客户" v-model="searchParam.update" :allowClear="true" style="width: 220px">
        <a-select-option :value="1">是</a-select-option>
        <a-select-option :value="2">否</a-select-option>
      </a-select>
      <a-button class="a-button" type="primary" icon="search" @click="searchAction({current:1})">查询</a-button>
    </div>
    <div class="main-wrapper">
      <a-table
        :columns="columns"
        :dataSource="dataSource"
        :pagination="false"
        :loading="loading"
      >
        <div slot="order" slot-scope="text, record, index">
          <span>{{ index + 1 }}</span>
        </div>

        <a-table
          slot="expandedRowRender"
          slot-scope="record, index, indent, expanded"
          :columns="columns"
          :data-source="record.repetitionCustomers"
          :pagination="false"
        >
          <div slot="order" slot-scope="text, record, index">
            <span>{{ index + 1 }}</span>
          </div>
        </a-table>
      </a-table>
    </div>
  </div>
</template>

<script>

import {
  customerrepetitionNames
} from '@/api/customer'

const columns = [
  {
    align: 'center',
    title: '序号',
    key: 'order',
    width: '70px',
    scopedSlots: { customRender: 'order' }
  },
  {
    align: 'center',
    title: '客户编号',
    dataIndex: 'customerId'
  },
  {
    align: 'center',
    title: '客户名称',
    dataIndex: 'name',
  },
  {
    align: 'center',
    title: '所属销售',
    dataIndex: 'userName'
  },
  {
    align: 'center',
    title: '所属客户池',
    dataIndex: 'poolTxt'
  }
]

let uuid = () => Math.random().toString(16).slice(-6) + Math.random().toString(16).slice(-6)
export default {
  name: 'repetition-names-customer',
  data() {
    return {
      searchParam:{
        num:5,
        update:2
      },
      columns,
      dataSource: [],
      loading: false,
      userInfo: this.$store.getters.userInfo, // 当前登录人
    }
  },
  computed: {

  },
  watch: {
    $route: {
      handler: function(to, from) {
        if (to.name === 'repetition-names-customer') {
          this.init()
        }
      },
      immediate: true
    }
  },
  methods: {
    init() {
      this.searchAction()
    },
    searchAction(opt = {}) {
      const that = this
      let {startNum,endNum} = that.searchParam
      if(!startNum || !endNum){
        that.$message.info('请输入范围开始位/结束位')
        return
      }
      let _searchParam = Object.assign({}, { ...that.searchParam }, opt)
      console.log('执行搜索...', _searchParam)
      that.loading = true
      customerrepetitionNames(_searchParam)
        .then(res => {
          that.loading = false
          if(res && res.code && res.code !== 200){
            that.$message.info(res.msg)
            return
          }
          that.dataSource = res.data.map((item, index) => {
            item.key = uuid()
            item.poolTxt = ({1:'公共',2:'部门'}[item.pool]) || `未知：${item.pool}`
            if(Array.isArray(item.repetitionCustomers)){
              item.repetitionCustomers.map(c => {
                c.key = uuid()
                c.poolTxt = ({1:'公共',2:'部门'}[item.pool]) || `未知：${item.pool}`
                return c
              })
            }
            return item
          })
        })
        .catch(err => (that.loading = false))
    }
  }
}
</script>

<style scoped>
.wdf-custom-wrapper {
  background-color: #fff;
  padding: 10px 20px;
}
.wdf-custom-wrapper .search-wrapper * {
  margin: 10px 15px 0 0;
}
.main-wrapper {
  margin-top: 20px;
}
</style>
