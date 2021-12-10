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
            @change="warehchange"
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
          <a-form-item>
            <a-button type="primary" @click="outPort()">导出</a-button>
          </a-form-item>
        </template>
      </a-form>
    </div>
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
    </a-table>
  </a-card>
</template>

<script>
import { getList, inventorygetListByPage, ReservoiGetList, exportInstantPositionList } from '@/api/storage'
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
        if (to.name === 'immediateList') {
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
    warehchange(opt) {
      this.queryParam = {
        ...this.queryParam,
        reservoirAreaId: undefined,
      }
      ReservoiGetList({ warehouseId: opt }).then((res) => {
        this.ReservoiList = res.data
      })
    },
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
      inventorygetListByPage(_searchParam)
        .then((res) => {
          that.loading = false
          that.dataSource = res.data.records.map((item, index) => {
            item.key = index + 1
            return item
          })
          //设置数据总条数
          const pagination = { ...that.pagination }
          pagination.total = res.data.total
          that.pagination = pagination
        })
        .catch((err) => (that.loading = false))
      // this.$refs.table.refresh(true)
    },
    // 分页
    handleTableChange(pagination, filters, sorter) {
      this.pagination1.size = pagination.pageSize
      this.pagination1.current = pagination.current
      this.searchAction()
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    // 导出
    outPort() {
      let that = this
      this.queryParam.newImmigrateLocationBeginTime = undefined
      this.queryParam.newImmigrateLocationEndTime = undefined
      if (Array.isArray(this.sDate) && this.sDate.length === 2) {
        this.queryParam.newImmigrateLocationBeginTime =
          this.sDate[0] instanceof moment ? this.sDate[0].format('YYYY-MM-DD') : undefined
        this.queryParam.newImmigrateLocationEndTime =
          this.sDate[1] instanceof moment ? this.sDate[1].format('YYYY-MM-DD') : undefined
      }
      let _searchParam = Object.assign({}, { ...this.queryParam }, { ...this.pagination1 })
      exportInstantPositionList(_searchParam)
        .then((res) => {
          this.loading = false
          if (res instanceof Blob) {
            const isFile = res.type === 'application/vnd.ms-excel'
            //const isFile = res.type === 'application/msword'
            const isJson = res.type === 'application/json'
            if (isFile) {
              //返回文件 则下载
              const objectUrl = URL.createObjectURL(res)
              const a = document.createElement('a')
              document.body.appendChild(a)
              a.style = 'display: none'
              a.href = objectUrl
              a.download = '即时库存.xls'
              a.click()
              document.body.removeChild(a)
              that.$message.info('下载成功')
              return
            } else if (isJson) {
              //返回json处理
              var reader = new FileReader()
              reader.onload = function (e) {
                let _res = null
                try {
                  _res = JSON.parse(e.target.result)
                } catch (err) {
                  _res = null
                }
                if (_res !== null) {
                  if (_res.code !== 0) {
                    that.$message.info(_res.message)
                  } else {
                    that.$message.info('下载成功')
                  }
                } else {
                  that.$message.info('json解析出错 e.target.result：' + e.target.result)
                  return
                }
              }
              reader.readAsText(res)
            } else {
              that.$message.info('不支持的类型:' + res)
            }
          }
        })
        .catch((err) => (this.loading = false))
    },
  },
}
</script>

<style scoped>
</style>
