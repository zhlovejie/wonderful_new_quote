<template>
  <!-- 重复的客户 -->
  <div class="wdf-custom-wrapper">
    <div class="search-wrapper">
      <a-input placeholder="范围开始" v-model="searchParam.startNum" allowClear style="width:160px;" />
      <a-input placeholder="范围结束" v-model="searchParam.endNum" allowClear style="width:160px;" />
      <a-input placeholder="排除的字符" v-model="searchParam.exChar" allowClear style="width:160px;" />
      <a-input placeholder="设定多少位相同为重复" v-model="searchParam.num" allowClear style="width:160px;" />
      <a-select placeholder="是否更新当前所有客户" v-model="searchParam.update" :allowClear="true" style="width: 180px">
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
    title: '编号',
    dataIndex: 'reportNum'
  },
  {
    align: 'center',
    title: '部门',
    dataIndex: 'departmentName',
    key: 'departmentName'
  },
  {
    align: 'center',
    title: '岗位',
    dataIndex: 'stationName',
    key: 'stationName'
  },
  {
    align: 'center',
    title: '状态',
    dataIndex: 'rebackFlag',
    key: 'rebackFlag',
    scopedSlots: { customRender: 'rebackFlag' }
  },
  {
    align: 'center',
    title: '提交人',
    key: 'createuserName',
    dataIndex: 'createuserName'
  },
  {
    align: 'center',
    title: '提交时间',
    key: 'createdTime',
    dataIndex: 'createdTime'
  },
  {
    align: 'center',
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'repetition-names-customer',
  data() {
    return {
      searchParam:{
        num:5,
        update:2
      },
      columns: columns,
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
          that.dataSource = res.data.records.map((item, index) => {
            item.key = index + 1
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
