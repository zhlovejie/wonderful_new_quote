<template>
  <!-- 食堂满意度 -->
  <div class="wdf-custom-list-wrapper">
    <div class="search-wrapper">
      <a-input placeholder="报告人模糊查询" v-model="searchParam.createdName" allowClear style="width: 160px" />
      <a-select placeholder="满意度" v-model="searchParam.satisfaction" :allowClear="true" style="width: 140px">
        <a-select-option v-for="(item, index) in menus.satisfaction" :key="index" :value="item.id">{{
          item.txt
        }}</a-select-option>
      </a-select>
      <a-select placeholder="服务态度" v-model="searchParam.attitude" :allowClear="true" style="width: 140px">
        <a-select-option v-for="(item, index) in menus.attitude" :key="index" :value="item.id">{{
          item.txt
        }}</a-select-option>
      </a-select>
      <a-select placeholder="就餐环境" v-model="searchParam.environment" :allowClear="true" style="width: 140px">
        <a-select-option v-for="(item, index) in menus.environment" :key="index" :value="item.id">{{
          item.txt
        }}</a-select-option>
      </a-select>
      <a-select placeholder="饭菜分量" v-model="searchParam.weight" :allowClear="true" style="width: 140px">
        <a-select-option v-for="(item, index) in menus.weight" :key="index" :value="item.id">{{
          item.txt
        }}</a-select-option>
      </a-select>
      <a-button class="a-button" type="primary" icon="search" @click="searchAction({ current: 1 })">查询</a-button>
    </div>
    <div class="main-wrapper">
      <a-table
        :columns="columns"
        :dataSource="dataSource"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <div slot="order" slot-scope="text, record, index">
          <span>{{ index + 1 }}</span>
        </div>
        <div slot="date" slot-scope="text, record, index">
          <span>{{ record.startDate }} ~ {{ record.endDate }}</span>
        </div>
      </a-table>
    </div>
  </div>
</template>
<script>
import { canteenEvaluatePage } from '@/api/canteenMenuManagement'
import moment from 'moment'
const columns = [
  {
    align: 'center',
    title: '序号',
    key: 'order',
    width: '70px',
    scopedSlots: { customRender: 'order' },
  },
  {
    align: 'center',
    title: '日期',
    key: 'date',
    scopedSlots: { customRender: 'date' },
  },
  {
    align: 'center',
    title: '报告人',
    dataIndex: 'createdName',
  },
  {
    align: 'center',
    title: '满意度',
    dataIndex: 'satisfactionTxt',
  },
  {
    align: 'center',
    title: '服务态度',
    dataIndex: 'attitudeTxt',
  },
  {
    align: 'center',
    title: '就餐环境',
    dataIndex: 'environmentTxt',
  },
  {
    align: 'center',
    title: '饭菜分量',
    dataIndex: 'weightTxt',
  },
  {
    align: 'center',
    title: '最满意菜单',
    dataIndex: 'popularMenu',
    scopedSlots: { customRender: 'popularMenu' },
  },
  {
    align: 'center',
    title: '最不满意菜单',
    dataIndex: 'popularMenus',
    scopedSlots: { customRender: 'popularMenus' },
  },
  {
    align: 'center',
    title: '意见建议',
    dataIndex: 'opinion',
  },
  {
    align: 'center',
    title: '提交时间',
    dataIndex: 'createdTime',
  },
]

const MENU_TYPES = {
  satisfaction: [
    { id: 1, txt: '好评' },
    { id: 2, txt: '中评' },
    { id: 3, txt: '差评' },
  ],
  attitude: [
    { id: 1, txt: '非常差' },
    { id: 2, txt: '差' },
    { id: 3, txt: '一般' },
    { id: 4, txt: '好' },
    { id: 5, txt: '非常好' },
  ],
  environment: [
    { id: 1, txt: '非常差' },
    { id: 2, txt: '差' },
    { id: 3, txt: '一般' },
    { id: 4, txt: '好' },
    { id: 5, txt: '非常好' },
  ],
  weight: [
    { id: 1, txt: '太多' },
    { id: 2, txt: '还可以' },
    { id: 3, txt: '不够' },
    { id: 4, txt: '太少' },
  ],
}

export default {
  name: 'canteen-menu-management-evaluate',
  components: {},
  data() {
    return {
      sDate: [undefined, undefined],
      columns: columns,
      dataSource: [],
      pagination: {
        current: 1,
      },
      searchParam: {},
      loading: false,
      menus: MENU_TYPES,
    }
  },
  computed: {},
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'canteen-menu-management-evaluate') {
          this.init()
        }
      },
      immediate: true,
    },
  },
  methods: {
    moment,
    init() {
      let that = this
      this.searchAction()
    },
    searchAction(opt) {
      let that = this
      let _searchParam = Object.assign({}, { ...that.searchParam }, { ...that.pagination }, opt || {}, {
        searchStatus: that.activeKey,
      })
      console.log('执行搜索...', _searchParam)
      that.loading = true
      canteenEvaluatePage(_searchParam)
        .then((res) => {
          that.loading = false
          that.dataSource = res.data.records.map((item, index) => {
            item.key = index + 1
            item.popularMenu = [item.menuOne, item.menuTwo, item.menuThree, item.menuFour]
              .filter((m) => m !== null)
              .join(',')
            item.popularMenus = [
              item.differenceMenuOne,
              item.differenceMenuTwo,
              item.differenceMenuThree,
              item.differenceMenuFour,
            ]
              .filter((m) => m !== null)
              .join(',')
            item.satisfactionTxt = that.menus['satisfaction'].find((m) => m.id === item.satisfaction).txt
            item.attitudeTxt = that.menus['attitude'].find((m) => m.id === item.attitude).txt
            item.environmentTxt = that.menus['environment'].find((m) => m.id === item.environment).txt
            item.weightTxt = that.menus['weight'].find((m) => m.id === item.weight).txt
            return item
          })
          //设置数据总条数
          const pagination = { ...that.pagination }
          pagination.total = res.data.total || 0
          pagination.current = res.data.current || 1
          that.pagination = pagination
        })
        .catch((err) => {
          console.log(err.message)
        })
    },
    // 分页
    handleTableChange(pagination, filters, sorter) {
      console.log(pagination, filters, sorter)
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.searchAction()
    },
  },
}
</script>
<style scoped>
.wdf-custom-list-wrapper {
  background-color: #fff;
  padding: 10px 20px;
}

.wdf-custom-list-wrapper .search-wrapper > * {
  margin-right: 10px;
}

.main-wrapper {
  margin-top: 20px;
}
</style>
