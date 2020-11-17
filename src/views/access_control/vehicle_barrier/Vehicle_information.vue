<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper" style="margin-bottom: 20px">
      <a-button-group style="margin-right: 10px">
        <a-button type="primary" :class="{ currentDayWeekMonth: +queryParam.statusTime === 1 }" @click="simpleSearch(1)"
          >今天</a-button
        >
        <a-button type="primary" :class="{ currentDayWeekMonth: +queryParam.statusTime === 2 }" @click="simpleSearch(2)"
          >全部</a-button
        >
      </a-button-group>
      <a-date-picker
        v-if="queryParam.statusTime === 2"
        style="width: 200px; margin-right: 10px"
        v-model="queryParam.date"
      />
      <a-input
        class="main-items"
        style="width: 200px; margin-right: 10px"
        placeholder="车牌号"
        allowClear
        v-model="queryParam.licensePlateNumber"
      />
      <a-select
        placeholder="方向"
        v-model="queryParam.direction"
        :allowClear="true"
        style="width: 100px; margin-right: 10px"
      >
        <a-select-option :value="1">进</a-select-option>
        <a-select-option :value="2">出</a-select-option>
      </a-select>
      <a-select
        placeholder="当前状态"
        v-model="queryParam.currentState"
        :allowClear="true"
        style="width: 100px; margin-right: 10px"
      >
        <a-select-option :value="1">厂区</a-select-option>
        <a-select-option :value="2">厂外</a-select-option>
      </a-select>
      <a-range-picker
        v-if="queryParam.statusTime === 2"
        v-model="sDate"
        format="YYYY-MM-DD"
        :placeholder="['开始日期', '结束日期']"
        @change="rangePickerChange"
      />
      <a-button style="margin-left: 10px" type="primary" @click="searchAction({ current: 1 })">查询</a-button>
      <a-button style="margin-left: 10px" type="primary" @click="downloadAction">下载</a-button>
    </div>
    <a-row>
      <a-col :span="12">
        <a-col :span="8">
          <span style="size: 20px; margin-bottom: 10px">车位 : </span>
          {{ NumbeofCars }}</a-col
        >
        <a-col :span="8">
          <span style="size: 20px">入场 : </span>
          {{ admission }}</a-col
        >
        <a-col :span="8">
          <span style="size: 20px">剩余车位 :</span>
          {{ modalTitle }}
        </a-col>
      </a-col>
    </a-row>
    <a-layout>
      <!--  此处编写表单中的功能按钮    -->
      <a-layout-content>
        <a-table
          :columns="columns"
          :data-source="this.dataSource"
          :pagination="pagination"
          @change="handleTableChange"
          v-if="$auth('electricity:list')"
        >
          <div slot="order" slot-scope="text, record, index">
            <span>{{ index + 1 }}</span>
          </div>
        </a-table>
      </a-layout-content>
    </a-layout>
    <!-- <AddForm ref="addForm" @finish="init()" /> -->
  </a-card>
</template>

<script>
import { accessControlList, accessExportExcel } from '@/api/accessControl'
import { getDictionaryList } from '@/api/workBox'

export default {
  name: 'RoleManagement',
  components: {
    // AddForm,
  },
  data() {
    return {
      sDate: [undefined, undefined],
      openKeys: ['id'],
      parentId: 0,
      NumbeofCars: 0,
      admission: 0,
      userInfo: this.$store.getters.userInfo, // 当前登录人
      hiddenBoolean: false,
      stationId: undefined,
      queryParam: { current: 1 },
      searchParam: {
        isToday: 1,
      },
      recordResult: {},
      queryRecord: {},
      pagination1: {},
      pagination: {
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: (total) => `共有 ${total} 条数据`, //分页中显示总的数据
        onShowSizeChange: (current, pageSize) => ((this.pagination1.size = pageSize), this.searchAction()),
      },
      // 表头
      columns: [
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
          dataIndex: 'date',
        },
        {
          align: 'center',
          title: '车牌号',
          dataIndex: 'licensePlateNumber',
          key: 'licensePlateNumber',
        },
        {
          align: 'center',
          title: '方向',
          dataIndex: 'directionName',
          key: 'directionName',
        },
        {
          align: 'center',
          title: '当前状态',
          dataIndex: 'currentStateName',
          key: 'currentStateName',
        },
        {
          align: 'center',
          title: '时间',
          dataIndex: 'createdTime',
          key: 'createdTime',
        },
      ],
      //列表数据
      dataSource: [],
    }
  },
  computed: {
    modalTitle() {
      let totals = Number(this.NumbeofCars) - Number(this.admission)
      return totals
    },
  },
  // 初始化搜索条件钩子函数
  created() {},
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'access_control_Vehicle_information') {
          this.queryParam.statusTime = 1
          this.init()
          getDictionaryList({ parentId: 627 }).then((res) => {
            this.NumbeofCars = res.data[0].remarks
            this.admission = res.data[1].remarks
          })
        }
      },
      immediate: true,
    },
  },
  methods: {
    init() {
      this.searchAction()
    },
    rangePickerChange(arrMoment, arrStrs) {
      if (Array.isArray(arrMoment)) {
        if (arrMoment.length === 2) {
          this.queryParam.startDate = arrMoment[0].format('YYYY-MM-DD')
          this.queryParam.endDate = arrMoment[1].format('YYYY-MM-DD')
        } else {
          this.queryParam.startDate = undefined
          this.queryParam.endDate = undefined
        }
      }
    },
    downloadAction() {
      let that = this
      that.spinning = true
      let _searchParam = Object.assign({}, { ...this.queryParam }, { ...this.pagination1 })
      accessExportExcel(_searchParam)
        .then((res) => {
          that.spinning = false
          console.log(res)
          if (res instanceof Blob) {
            const isFile = res.type === 'application/vnd.ms-excel'
            const isJson = res.type === 'application/json'
            if (isFile) {
              //返回文件 则下载
              const objectUrl = URL.createObjectURL(res)
              const a = document.createElement('a')
              document.body.appendChild(a)
              a.style = 'display: none'
              a.href = objectUrl
              a.download = `车辆信息.xls`
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
        .catch((err) => (that.spinning = true))
    },
    simpleSearch(type) {
      this.queryParam = Object.assign({}, this.queryParam, { statusTime: type })
      this.searchAction()
    },
    // 获取列表
    searchAction() {
      let that = this
      that.loading = true
      if (that.queryParam.date) {
        that.queryParam.date = that.queryParam.date.format('YYYY-MM-DD')
      }
      let _searchParam = Object.assign({}, { ...this.queryParam }, { ...this.pagination1 })
      accessControlList(_searchParam)
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
    },
    // 分页
    handleTableChange(pagination, filters, sorter) {
      this.pagination1.size = pagination.pageSize
      this.pagination1.current = pagination.current

      this.searchActionsee()
    },

    // 清空、重置
    emptyQueryParam() {
      this.queryParam = {}
      this.roleList = {}
    },
  },
}
</script>

<style lang="less" scoped>
.search {
  margin-bottom: 54px;
}

.fold {
  width: calc(100% - 216px);
  display: inline-block;
}

.operator {
  margin-bottom: 18px;
}

@media screen and (max-width: 900px) {
  .fold {
    width: 100%;
  }
}

.left-tree {
  display: flex;
}

.treewrap {
  margin-right: 24px;
}

.righttab {
  width: 100%;
}
.currentDayWeekMonth {
  opacity: 0.7;
}
</style>
