<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper" style="margin-bottom: 20px">
      <a-month-picker placeholder="日期" v-model="queryParam.surfaceDate" style="width: 200px; margin-right: 10px" />
      <a-select placeholder="房间号" v-model="queryParam.roomCode" :allowClear="true" style="width: 200px">
        <a-select-option v-for="item in postSelectDataSource" :key="item.id" :value="item.roomCode">{{
          item.roomCode
        }}</a-select-option>
      </a-select>
      <a-button style="margin-left: 10px" type="primary" @click="searchAction">查询</a-button>
      <a-button style="margin-left: 10px" type="primary" @click="download()">下载</a-button>
      <template v-if="$auth('room:cost')">
        <a-button style="float: right; margin-left: 10px" type="primary" @click="configures()">费用设置</a-button>
      </template>
      <template v-if="$auth('room:add')">
        <a-button style="float: right" type="primary" icon="plus" @click="handle('add', null)">新增</a-button>
      </template>
    </div>
    <a-layout>
      <!--  此处编写表单中的功能按钮    -->
      <a-layout-content>
        <a-table
          :columns="columns"
          :data-source="this.dataSource"
          :pagination="pagination"
          @change="handleTableChange"
          v-if="$auth('room:list')"
        >
          <div slot="order" slot-scope="text, record, index">
            <span>{{ index + 1 }}</span>
          </div>
        </a-table>
      </a-layout-content>
    </a-layout>
    <AddForm ref="addForm" @finish="searchAction()" />
    <AddConfigure ref="add" @finish="searchAction()" />
  </a-card>
</template>

<script>
import { getDevisionList, getStationList, downexportExcel } from '../../../../api/systemSetting'
import { room_List, listRoom } from '@/api/humanResources'
import systemConfig from '@/config/defaultSettings'
import AddForm from './module/FormAdd'
import AddConfigure from './module/configure'
import moment from 'moment'

export default {
  name: 'RoleManagement',
  components: {
    AddForm,
    AddConfigure,
  },
  data() {
    return {
      openKeys: ['id'],
      parentId: 0,
      userInfo: this.$store.getters.userInfo, // 当前登录人
      // system: systemConfig.baseURL + '/room/room-electricity-fees/roomElectricityFees/exportExcel',
      hiddenBoolean: false,
      stationId: undefined,
      roomCode: '',
      faceDate: {},
      queryParam: {
        surfaceDate: moment().add(-1, 'months'),
      },
      postSelectDataSource: [], //
      recordResult: {},
      queryRecord: {},
      pagination: {
        current: 1,
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
          key: 'surfaceDate',
          dataIndex: 'surfaceDate',
        },
        {
          align: 'center',
          title: '房间号',
          dataIndex: 'roomCode',
          key: 'roomCode',
        },
        {
          align: 'center',
          title: '上月读数(度) ',
          dataIndex: 'lastMonthDegree',
          key: 'lastMonthDegree',
        },
        {
          align: 'center',
          title: '本月读数(度)',
          key: 'thisMonthDegree',
          dataIndex: 'thisMonthDegree',
        },
        {
          align: 'center',
          title: '实际用电量(度)',
          key: 'actualElectricityDegree',
          dataIndex: 'actualElectricityDegree',
        },
        {
          align: 'center',
          title: '电费(元)',
          key: 'electricityFees',
          dataIndex: 'electricityFees',
        },
      ],
      //列表数据
      dataSource: [],

      // 部门列表
      departmentList: [],
      // 角色列表
      roleList: {},
    }
  },
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'human_Resources_room') {
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
      listRoom().then((res) => {
        this.postSelectDataSource = res.data
      })
      //let date = new Date()
      //let surfaceDate = date.getFullYear() + '-' + date.getMonth()
      //this.queryParam.surfaceDate  moment(surfaceDate)
      this.searchAction()
    },
    // 获取列表
    searchAction() {
      let that = this
      that.loading = true

      let surfaceDate = undefined
      if (that.queryParam.surfaceDate) {
        surfaceDate = that.queryParam.surfaceDate.format('YYYY-MM')
      }

      let _searchParam = Object.assign(
        { socialSecurityId: that.recordId },
        { ...this.queryParam, surfaceDate },
        { ...this.pagination }
      )
      room_List(_searchParam)
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
      this.$refs.table && this.$refs.table.refresh(true)
    },
    // 分页
    handleTableChange(pagination, filters, sorter) {
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.searchAction()
    },
    depChangeHandler(dep_id) {
      let that = this
      that.postSelectDataSource = []
      return getStationList({ id: dep_id }).then((res) => {
        that.postSelectDataSource = res.data
      })
    },
    //下载
    download() {
      let that = this
      let surfaceDate = undefined
      if (that.queryParam.surfaceDate) {
        surfaceDate = that.queryParam.surfaceDate.format('YYYY-MM')
      }
      let _searchParam = Object.assign({ ...this.queryParam, surfaceDate })
      downexportExcel(_searchParam)
        .then((res) => {
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
              a.download = `电费信息${that.queryParam.surfaceDate}.xls`
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
        .catch((err) => {
          that.$message.info(`请求出错：${err.message}`)
        })
    },

    // 清空、重置
    emptyQueryParam() {
      this.queryParam = {}
      this.roleList = {}
    },
    configures() {
      this.$refs.add.query()
    },
    handle(type, record) {
      this.$refs.addForm.query(type, record)
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
</style>
