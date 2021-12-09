<template>
  <a-card :bordered="false">
    <!--即时库存-->
    <div class="description-document-search-wrapper">
      <a-form layout="inline">
        <a-form-item>
          <a-select
            placeholder="仓库名称"
            show-search
            :filter-option="filterOption"
            v-model="queryParam.warehouseId"
            allowClear
            style="width: 180px"
          >
            <a-select-option v-for="item in warehouseList" :key="item.id" :value="item.id">{{
              item.warehouseName
            }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-select
            placeholder="库区名称"
            show-search
            :filter-option="filterOption"
            v-model="queryParam.reservoirAreaId"
            allowClear
            style="width: 180px"
          >
            <a-select-option v-for="item in ReservoiList" :key="item.id" :value="item.id">{{
              item.reservoirName
            }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-input v-model.trim="queryParam.materialCode" allowClear placeholder="物料代码" style="width: 180px" />
        </a-form-item>
        <a-form-item>
          <a-input v-model.trim="queryParam.k3Code" allowClear placeholder="原K3物料代码" style="width: 180px" />
        </a-form-item>
        <a-form-item>
          <a-input v-model.trim="queryParam.materialName" allowClear placeholder="物料名称" style="width: 180px" />
        </a-form-item>
        <a-form-item>
          <a-range-picker v-model="sDate" style="width: 280px" />
        </a-form-item>
        <template>
          <a-form-item>
            <a-button type="primary" @click="searchAction">查询</a-button>
          </a-form-item>
        </template>
      </a-form>
    </div>
    <div v-for="(i, index) in dataSource" :key="i.key">
      <h3>{{ i.shelvesLocationName }}</h3>
      <table class="custom-table custom-table-border" style="margin-top: 20px">
        <tr>
          <th v-for="(item, index) in i.shelvesColumn" :key="item.index">{{ index }}</th>
        </tr>
        <tr v-for="(u, index) in i.shelvesRow" :key="u.key">
          <td>{{ index + 1 }}</td>
          <td v-for="(u, index) in i.shelvesColumn - 1" :key="u.index"></td>
        </tr>
      </table>
    </div>

    <!-- <a-table
      :columns="columns"
      :dataSource="dataSource"
      :pagination="pagination"
      :loading="loading"
      @change="handleTableChange"
    >
      <div slot="order" slot-scope="text, record, index">
        <span>{{ index + 1 }}</span>
      </div>
    </a-table> -->
  </a-card>
</template>

<script>
import { getList, getVisualizationList, ReservoiGetList, exportInstantPositionList } from '@/api/storage'
import moment from 'moment'
const columns = [
  {
    align: 'center',
    title: '序号',
    width: '70px',
    scopedSlots: { customRender: 'order' },
  },
  {
    align: 'center',
    title: '物料代码',
    key: 'materialCode',
    dataIndex: 'materialCode',
  },

  {
    align: 'center',
    title: '原K3物料代码',
    key: 'k3Code',
    dataIndex: 'k3Code',
  },
  {
    align: 'center',
    title: '物料名称',
    key: 'materialName',
    dataIndex: 'materialName',
  },
  {
    align: 'center',
    title: '规格型号',
    key: 'specification',
    dataIndex: 'specification',
  },
  {
    align: 'center',
    title: '仓库',
    key: 'warehouseName',
    dataIndex: 'warehouseName',
  },
  {
    align: 'center',
    title: '库区',
    key: 'reservoirAreaName',
    dataIndex: 'reservoirAreaName',
  },
  {
    align: 'center',
    title: '仓位代码',
    key: 'positionCode',
    dataIndex: 'positionCode',
  },
  {
    align: 'center',
    title: '最新入库时间',
    key: 'newImmigrateLocationTime',
    dataIndex: 'newImmigrateLocationTime',
  },
  {
    align: 'center',
    title: '辅计量单位',
    key: 'subUnit',
    dataIndex: 'subUnit',
  },
  {
    align: 'center',
    title: '单位数量',
    key: 'positionQuantity',
    dataIndex: 'positionQuantity',
  },
]

export default {
  name: 'EnterpriseSynopsis',
  components: {},
  data() {
    return {
      visible: false,
      // 表头
      warehouseList: [],
      ReservoiList: [],
      dataSource: [],
      columns: columns,
      sDate: [undefined, undefined],
      tutorialList: undefined,
      loading: false,
      // 查询参数
      queryParam: {},
      pagination1: {},
      pagination: {
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: (total) => `共有 ${total} 条数据`, //分页中显示总的数据
        onShowSizeChange: (current, pageSize) => ((this.pagination1.size = pageSize), this.searchAction()),
      },
    }
  },
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'visualizationList') {
          this.searchAction()
          getList().then((res) => {
            this.warehouseList = res.data
          })
          ReservoiGetList().then((res) => {
            this.ReservoiList = res.data
          })
        }
      },
      immediate: true,
    },
  },

  methods: {
    moment,
    searchAction(opt) {
      let that = this
      this.queryParam.newImmigrateLocationBeginTime = undefined
      this.queryParam.newImmigrateLocationEndTime = undefined
      if (Array.isArray(this.sDate) && this.sDate.length === 2) {
        this.queryParam.newImmigrateLocationBeginTime =
          this.sDate[0] instanceof moment ? this.sDate[0].format('YYYY-MM-DD') : undefined
        this.queryParam.newImmigrateLocationEndTime =
          this.sDate[1] instanceof moment ? this.sDate[1].format('YYYY-MM-DD') : undefined
      }
      let _searchParam = Object.assign({}, { ...this.queryParam }, { ...this.pagination1 }, opt || {})
      that.loading = true
      getVisualizationList(_searchParam)
        .then((res) => {
          console.log(res)
          that.loading = false
          that.dataSource = res.data.map((item, index) => {
            item.key = index + 1
            return item
          })
          //设置数据总条数
          // const pagination = { ...that.pagination }
          // pagination.total = res.data.total
          // that.pagination = pagination
        })
        .catch((err) => (that.loading = false))
      // this.$refs.table.refresh(true)
    },
    // 分页
    // handleTableChange(pagination, filters, sorter) {
    //   this.pagination1.size = pagination.pageSize
    //   this.pagination1.current = pagination.current
    //   this.searchAction()
    // },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
  },
}
</script>

<style scoped>
.custom-table {
  margin-bottom: 0;
}

.custom-table-border th,
.custom-table-border td {
  padding: 15px 10px;
}

.custom-table >>> .custom-table {
  position: relative;
  top: 0;
  left: 0;
  width: calc(100% + 2px);
  margin-bottom: -2px;
}
.custom-table >>> .custom-table td {
  text-align: left;
}
.ant-form-item {
  margin-bottom: 0;
}

.bank-card-list-wrapper {
  display: flex;
}
.bank-card-list-wrapper >>> .ant-form-item {
  display: flex;
  margin: 0 7px;
}
</style>
