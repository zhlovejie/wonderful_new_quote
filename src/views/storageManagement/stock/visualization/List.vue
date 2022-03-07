<template>
  <a-card :bordered="false">
    <!--即时库存-->
    <div class="description-document-search-wrapper">
      <a-form layout="inline">
        <a-form-item>
          <a-input v-model.trim="queryParam.materialCode" allowClear placeholder="物料代码" style="width: 180px" />
        </a-form-item>
        <a-form-item>
          <a-input v-model.trim="queryParam.materialName" allowClear placeholder="物料名称" style="width: 180px" />
        </a-form-item>
        <a-form-item>
          <a-select
            placeholder="仓库名称"
            show-search
            :filter-option="filterOption"
            v-model="queryParam.warehouseId"
            allowClear
            style="width: 180px"
            @change="warehchange"
          >
            <a-select-option v-for="item in warehouseList" :key="item.id" :value="item.id">{{
              item.warehouseName
            }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item v-if="queryParam.warehouseId">
          <a-select
            placeholder="库区名称"
            show-search
            :filter-option="filterOption"
            v-model="queryParam.reservoirAreaId"
            @change="reservoirchange"
            allowClear
            style="width: 180px"
          >
            <a-select-option v-for="item in ReservoiList" :key="item.id" :value="item.id">{{
              item.reservoirName
            }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item v-if="queryParam.reservoirAreaId && queryParam.warehouseId">
          <a-select
            placeholder="库位名称"
            show-search
            :filter-option="filterOption"
            v-model="queryParam.shelvesLocationId"
            allowClear
            style="width: 180px"
          >
            <a-select-option v-for="item in depList" :key="item.shelvesLocationId" :value="item.shelvesLocationId">{{
              item.shelvesLocationName
            }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item v-if="queryParam.reservoirAreaId && queryParam.warehouseId && queryParam.shelvesLocationId">
          <a-select v-model="queryParam.positionRow" allowClear style="width: 180px">
            <a-select-option v-for="(item, index) in shelvesColumnList" :key="item.index" :value="index + 1"
              >第{{ index + 1 }}排</a-select-option
            >
          </a-select>
        </a-form-item>

        <template>
          <a-form-item>
            <a-button type="primary" @click="searchAction">查询</a-button>
          </a-form-item>
        </template>
      </a-form>
    </div>
    <div style="margin-top: 200px; margin-bottom: 200px" v-if="dataSource.length === 0">
      <a-empty />
    </div>
    <div v-else v-for="(i, index) in dataSource" :key="i.index">
      <h3 style="margin-top: 20px">{{ i.shelvesLocationName }}</h3>
      <table class="custom-table custom-table-border" style="margin-top: 20px">
        <tr style="border: none">
          <th style="width: 128px" id="lineTd">
            <span style="float: left; margin-top: 20px">行</span>
            <span style="float: right; margin-top: -10px">列</span>
          </th>
          <th style="" v-for="(item, index) in i.shelvesColumn" :key="item.index">{{ index + 1 }}</th>
        </tr>
        <tr v-for="(u, x) in i.shelvesRow" :key="u.index">
          <td>
            {{ x + 1 }}
          </td>
          <td v-for="(t, y) in i.shelvesColumn" :key="t.index">
            <span v-if="showContent(x + 1, y + 1, i) !== 0">
              <a-popover>
                <template slot="title">
                  {{ showContenttitle(x + 1, y + 1, i, 'positionCode') }}
                </template>
                <template slot="content">
                  <table class="custom-table custom-table-border">
                    <tr>
                      <th>托盘号</th>
                      <th>物料代码</th>
                      <th>物料名称</th>
                      <th>使用计量单位</th>
                      <th>库存数量</th>
                    </tr>
                    <tr>
                      <td>{{ showContenttitle(x + 1, y + 1, i, 'palletCode') }}</td>
                      <td>{{ showContenttitle(x + 1, y + 1, i, 'materialCode') }}</td>
                      <td>{{ showContenttitle(x + 1, y + 1, i, 'materialName') }}</td>
                      <td>{{ showContenttitle(x + 1, y + 1, i, 'subUnit') }}</td>
                      <td>{{ showContenttitle(x + 1, y + 1, i, 'positionQuantity') }}</td>
                    </tr>
                  </table>
                </template>
                <a-icon type="check-circle" :style="{ fontSize: '25px' }" />
              </a-popover>
            </span>
            <span v-else></span>
          </td>
        </tr>
      </table>
    </div>
  </a-card>
</template>

<script>
import { getList, getVisualizationList, ReservoiGetList, translocateGetShelvesByAreaId } from '@/api/storage'
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
    title: '使用计量单位',
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
      depList: [],
      shelvesColumnList: 0,
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
          getList().then((res) => {
            this.warehouseList = res.data
          })
          // this.searchAction()
        }
      },
      immediate: true,
    },
  },

  methods: {
    //
    // 库区拿取库位
    reservoirchange(opt) {
      this.queryParam = {
        ...this.queryParam,
        shelvesLocationId: undefined,
        positionRow: undefined,
      }
      translocateGetShelvesByAreaId({ areaId: opt }).then((res) => {
        this.depList = res.data
        this.shelvesColumnList = res.data[0].shelvesRow || 0
      })
    },
    warehchange(opt) {
      this.queryParam = {
        ...this.queryParam,
        reservoirAreaId: undefined,
        shelvesLocationId: undefined,
        positionRow: undefined,
      }
      ReservoiGetList({ warehouseId: opt }).then((res) => {
        this.ReservoiList = res.data
      })
    },
    searchAction(opt) {
      let that = this
      let _searchParam = Object.assign({}, { ...this.queryParam }, { ...this.pagination1 }, opt || {})
      that.loading = true
      getVisualizationList(_searchParam)
        .then((res) => {
          console.log(res)
          that.loading = false
          that.dataSource = res.data
        })
        .catch((err) => (that.loading = false))
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    showContenttitle(x, y, record, type) {
      let react = record.positionModelVoList.find((i) => i.positionRow === x && i.positionColumn === y)
      return react[type]
    },

    showContent(x, y, record) {
      let react = record.positionModelVoList.find((i) => i.positionRow === x && i.positionColumn === y)
      return (react && react.positionQuantity) || 0
    },
  },
}
</script>

<style scoped>
#lineTd {
  background: #fff
    url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxsaW5lIHgxPSIwIiB5MT0iMCIgeDI9IjEwMCUiIHkyPSIxMDAlIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjEiLz48L3N2Zz4=)
    no-repeat 100% center;
}
.custom-table {
  margin-bottom: 0;
}

.custom-table-border th,
.custom-table-border td {
  padding: 15px 10px;
  border: 1px solid #aaa;
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
