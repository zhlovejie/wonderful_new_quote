<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper" style="margin-bottom: 20px;">
      <a-month-picker placeholder="日期" v-model="faceDate" style="width: 200px ;margin-right:10px;" />
      <a-select placeholder="房间号" v-model="roomCode" :allowClear="true" style="width: 200px ">
        <a-select-option
          v-for="item in postSelectDataSource"
          :key="item.id"
          :value="item.id"
        >{{item.roomCode}}</a-select-option>
      </a-select>
      <a-button style="margin-left:10px;" type="primary" @click="searchAction">查询</a-button>
      <a-button style="margin-left:10px;" type="primary">下载</a-button>
      <template v-if="$auth('role:add')">
        <a-button
          style="float:right; margin-left:10px;"
          type="primary"
          @click="handle('add',null)"
        >费用设置</a-button>
      </template>
      <template v-if="$auth('role:add')">
        <a-button style="float:right  " type="primary" icon="plus" @click="handle('add',null)">新增</a-button>
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
        >
          <div slot="order" slot-scope="text, record, index">
            <span>{{ index + 1 }}</span>
          </div>
        </a-table>
      </a-layout-content>
    </a-layout>
    <AddForm ref="addForm" @finish="searchAction()" />
  </a-card>
</template>

<script>
import { getDevisionList, getStationList } from '../../../../api/systemSetting'
import { room_List, listRoom } from '@/api/humanResources'
import AddForm from './module/FormAdd'
import moment from 'moment'

export default {
  name: 'RoleManagement',
  components: {
    AddForm,
  },
  data() {
    return {
      openKeys: ['id'],
      parentId: 0,
      userInfo: this.$store.getters.userInfo, // 当前登录人
      hiddenBoolean: false,
      stationId: undefined,
      roomCode: '',
      faceDate: {},
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
  computed: {
    queryParam() {
      let surfaceDate = undefined
      if (this.faceDate) {
        surfaceDate = this.faceDate instanceof this.moment ? this.faceDate.format('YYYY-MM-DD') : undefined
      }
      return {
        surfaceDate: surfaceDate,
        roomCode: this.roomCode,
      }
    },
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
    init() {
      let that = this
      listRoom().then((res) => {
        this.postSelectDataSource = res.data
      })
      this.searchAction()
    },
    // 获取列表
    searchAction() {
      let that = this
      that.loading = true
      // if (this.queryParam.surfaceDate) {
      //   this.queryParam.surfaceDate = moment(this.queryParam.surfaceDate).format('YYYY-MM')
      // }

      let _searchParam = Object.assign(
        { socialSecurityId: that.recordId },
        { ...this.queryParam },
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
      //   this.$refs.table && this.$refs.table.refresh(true)
    },
    // 分页
    handleTableChange(pagination, filters, sorter) {
      // console.log(pagination, filters, sorter)
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.searchActionsee()
    },
    depChangeHandler(dep_id) {
      let that = this
      that.postSelectDataSource = []
      return getStationList({ id: dep_id }).then((res) => {
        that.postSelectDataSource = res.data
      })
    },

    // 清空、重置
    emptyQueryParam() {
      this.queryParam = {}
      this.roleList = {}
    },
    // 文件预览
    doAction(idurl) {
      this.$refs.xdocView.query(idurl)
    },
    handle(type, record) {
      this.$refs.addForm.query(type, record)
    },
    // 删除
    deleteRoleInfo(record) {
      let that = this
      console.log(record)
      contractAgreement_Remove(`id=${record.id}`).then((res) => {
        if (res.code === 200) {
          this.searchAction()
          that.$message.info(res.msg)
        } else {
          this.$message.error(res.msg)
        }
      })
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
