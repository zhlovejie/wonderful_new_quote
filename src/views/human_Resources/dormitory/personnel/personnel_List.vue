<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper" style="margin-bottom: 20px">
      <a-input placeholder="房间号" v-model="queryParam.roomCode" allowClear style="width: 200px; margin-right: 10px" />
      <a-select
        style="width: 200px; margin-right: 10px"
        v-model="queryParam.deptId"
        :allowClear="true"
        @change="depChangeHandler"
        placeholder="请选择部门"
      >
        <a-select-option v-for="item in departmentList" :key="item.id" :value="item.id">{{
          item.departmentName
        }}</a-select-option>
      </a-select>
      <a-select placeholder="人员" v-model="queryParam.userId" :allowClear="true" style="width: 200px">
        <a-select-option v-for="item in postSelectDataSource" :key="item.id" :value="item.id">{{
          item.trueName
        }}</a-select-option>
      </a-select>
      <a-button style="margin-left: 10px" type="primary" @click="searchAction">查询</a-button>
      <template v-if="$auth('personnel:add')">
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
          v-if="$auth('personnel:list')"
        >
          <div slot="order" slot-scope="text, record, index">
            <span>{{ index + 1 }}</span>
          </div>
          <span slot="action" slot-scope="text, record">
            <template v-if="$auth('personnel:add') && record.status === 0">
              <a @click="showModal(record)">退房</a>
            </template>
            <template>
              <template v-if="$auth('personnel:add') && record.status === 0">
                <a-divider type="vertical" />
                <a @click="handle('edit-salary', record)">修改</a>
              </template>
              <a-divider type="vertical" />
              <a-popconfirm title="是否删除" ok-text="是" cancel-text="否" @confirm="deleteRoleInfo(record)">
                <a type="primary">删除</a>
              </a-popconfirm>
            </template>
          </span>
        </a-table>
      </a-layout-content>
    </a-layout>
    <AddForm ref="addForm" @finish="searchAction()" />
    <a-modal
      title="退房操作"
      :visible="visible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <a-form-item label="退房时间">
          <a-date-picker
            format="YYYY-MM-DD"
            :disabled-date="disabledDate"
            v-decorator="['checkOutTime', { rules: [{ required: true, message: '请选择退房时间' }] }]"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </a-card>
</template>

<script>
import { getDevisionList, getStationList } from '../../../../api/systemSetting'
import { personnel_List, queryList, personnel_delete, personnel_Check } from '@/api/humanResources'
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
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this, { name: 'coordinated' }),
      userInfo: this.$store.getters.userInfo, // 当前登录人
      hiddenBoolean: false,
      stationId: undefined,
      queryParam: {},
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
          title: '人员',
          key: 'userName',
          dataIndex: 'userName',
        },
        {
          align: 'center',
          title: '部门',
          dataIndex: 'deptName',
          key: 'deptName',
        },
        {
          align: 'center',
          title: '房间号',
          dataIndex: 'roomCode',
          key: 'roomCode',
        },
        {
          align: 'center',
          title: '入住时间',
          key: 'checkInTime',
          dataIndex: 'checkInTime',
        },
        {
          align: 'center',
          title: '退房时间',
          key: 'checkOutTime',
          dataIndex: 'checkOutTime',
        },
        {
          align: 'center',
          title: '提交人',
          key: 'createdName',
          dataIndex: 'createdName',
        },
        {
          align: 'center',
          title: '操作',
          key: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],
      //列表数据
      dataSource: [],
      Check: {},

      // 部门列表
      departmentList: [],
      // 角色列表
      roleList: {},
    }
  },
  // 初始化搜索条件钩子函数
  created() {},
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'human_Resources_personnel') {
          this.init()
        }
      },
      immediate: true,
    },
  },
  methods: {
    moment,
    disabledDate(current) {
      return current && current.format('MM') !== moment().format('MM')
    },
    init() {
      let that = this
      getDevisionList().then((res) => {
        this.departmentList = res.data
      })
      this.searchAction()
    },
    // 获取列表
    searchAction() {
      let that = this
      that.loading = true
      let _searchParam = Object.assign(
        { socialSecurityId: that.recordId },
        { ...this.queryParam },
        { ...this.pagination }
      )
      personnel_List(_searchParam)
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
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.searchAction()
    },
    depChangeHandler(dep_id) {
      let that = this
      that.postSelectDataSource = []
      return queryList({ departmentId: dep_id }).then((res) => {
        that.postSelectDataSource = res.data
      })
    },

    // 清空、重置
    emptyQueryParam() {
      this.queryParam = {}
      this.roleList = {}
    },
    handle(type, record) {
      this.$refs.addForm.query(type, record)
    },
    showModal(record) {
      this.form.resetFields()
      this.visible = true
      this.Check = record
    },
    handleOk(e) {
      this.form.validateFields((err, values) => {
        if (!err) {
          values.id = this.Check.id
          values.checkOutTime = moment(values.checkOutTime).format('YYYY-MM-DD')
          this.confirmLoading = true
          personnel_Check(values).then((res) => {
            if (res.code === 200) {
              this.visible = false
              this.confirmLoading = false
              this.searchAction()
              this.$message.info(res.msg)
            } else {
              this.confirmLoading = false
              this.$message.error(res.msg)
            }
          })
        }
      })
    },
    handleCancel(e) {
      this.visible = false
    },
    // 删除
    deleteRoleInfo(record) {
      let that = this
      personnel_delete({ id: record.id }).then((res) => {
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
