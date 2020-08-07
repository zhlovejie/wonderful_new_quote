<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper" style="margin-bottom: 20px;">
      <a-select
        style="width:200px;"
        v-model="queryParam.departmentId"
        @change=" depChangeHandler"
        placeholder="请选择部门"
      >
        <a-select-option :value="undefined">请选择部门</a-select-option>
        <a-select-option
          v-for="item in departmentList"
          :key="item.id"
          :value="item.id"
        >{{ item.departmentName }}</a-select-option>
      </a-select>
      <a-select placeholder="选择岗位" v-model="stationId" :allowClear="true" style="width: 200px">
        <a-select-option
          v-for="item in postSelectDataSource"
          :key="item.id"
          :value="item.id"
        >{{item.stationName}}</a-select-option>
      </a-select>
      <a-button style="margin-left:10px;" type="primary" @click="$refs.table.refresh(true)">查询</a-button>
      <template v-if="$auth('role:add')">
        <a-button style="float:right;" type="primary" icon="plus" @click="handle('add',null)">新增</a-button>
      </template>
    </div>
    <a-layout>
      <!--  此处编写表单中的功能按钮    -->
      <a-layout-content>
        <s-table ref="table" size="default" :columns="columns" :data="loadData" :alert="false">
          <div slot="order" slot-scope="text, record, index">
            <span>{{ index + 1 }}</span>
          </div>
          <span slot="action" slot-scope="text, record">
            <template v-if="$auth('role:edit')">
              <a @click="handle('edit',record)">查看</a>
              <a-divider type="vertical" />
              <a @click="handle('edit-salary',record)">修改</a>
              <a-divider type="vertical" />
              <a @click="deleteRoleInfo(record)">删除</a>
            </template>
          </span>
        </s-table>
      </a-layout-content>
    </a-layout>
    <AddForm ref="addForm" @finish="searchAction()" />
  </a-card>
</template>

<script>
import { getDevisionList, getStationList } from '../../../../api/systemSetting'

import { securityInsurance_List } from '@/api/humanResources'
import { STable } from '@/components'
import AddForm from './module/AddForm'

export default {
  name: 'RoleManagement',
  components: {
    AddForm,
    STable,
  },
  data() {
    return {
      openKeys: ['id'],
      parentId: 0,
      hiddenBoolean: false,
      stationId: undefined,
      options: [],
      Selected: '',
      queryParam: {},
      postSelectDataSource: [], //
      recordResult: {},
      queryRecord: {},
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
          title: '部门',
          key: 'departmentName',
          dataIndex: 'departmentName',
        },
        {
          align: 'center',
          title: '岗位',
          dataIndex: 'stationName',
          key: 'stationName',
        },
        {
          align: 'center',
          title: '试用期时间',
          dataIndex: 'probationPeriodTime',
          key: 'probationPeriodTime',
          //   scopedSlots: { customRender: 'status' },
        },
        {
          align: 'center',
          title: '入职空挡期',
          key: 'neutralName',
          dataIndex: 'neutralName',
        },
        {
          align: 'center',
          title: '试用期保险',
          key: 'probationPeriodName',
          dataIndex: 'probationPeriodName',
        },
        {
          align: 'center',
          title: '转正保险',
          key: 'turnJustName',
          dataIndex: 'turnJustName',
        },
        {
          align: 'center',
          title: '提交人',
          key: 'createdName',
          dataIndex: 'createdName',
        },
        {
          align: 'center',
          title: '提交时间',
          key: 'createdTime',
          dataIndex: 'createdTime',
        },
        {
          align: 'center',
          title: '操作',
          key: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],
      // 初始化加载 必须为 Promise 对象
      loadData: (parameter) => {
        console.log('页面开始加载数据。。。', parameter, this.queryParam)
        return securityInsurance_List(Object.assign(parameter, this.queryParam)).then((res) => {
          console.log(res.data)
          return res
        })
      },
      selectedRowKeys: [],
      selectedRows: [],

      // 部门列表
      departmentList: [],
      // 角色列表
      roleList: {},
    }
  },
  // 初始化搜索条件钩子函数
  created() {
    getDevisionList().then((res) => {
      this.departmentList = res.data
    })
  },
  methods: {
    depChangeHandler(dep_id) {
      let that = this
      that.postSelectDataSource = []
      return getStationList({ id: dep_id }).then((res) => {
        that.postSelectDataSource = res.data
      })
    },
    // 获取部门角色联动
    // handleProvinceChange(value) {
    //   if (value != undefined) {
    //     // 获取部门下的角色
    //     queryRoleListById({ departmentId: value })
    //       .then((rs) => {
    //         this.roleList = rs.data
    //         this.$set(this.queryParam, 'id', undefined)
    //       })
    //       .catch((error) => {
    //         console.error(error)
    //       })
    //   } else {
    //     this.$set(this.queryParam, 'id', undefined)
    //     this.roleList = []
    //   }
    // },
    // // 改变select
    // handleChange(value) {
    //   console.log(`selected ${value}`)
    // },
    // 清空、重置
    emptyQueryParam() {
      this.queryParam = {}
      this.roleList = {}
    },

    handle(type, record) {
      this.$refs.addForm.query(type, record)
      //   this.$refs.modal.add()
    },
    deleteRoleInfo(record) {
      const that = this
      // 删除角色角色
      deleteRole({ id: record.id })
        .then((res) => {
          if (res && res.code && parseInt(res.code) === 500) {
            that.$message.error(res.msg)
            return
          } else {
            that.$message.success('删除成功')
            that.$refs.table.refresh(true)
          }
        })
        .catch((error) => {
          console.error(error)
        })
    },
    handleMenu(record) {
      // 获取权限数组
      queryRoleMenu({ id: record.id }).then((res) => {
        this.$refs.role.setCheckedNodes(res.data, record.id)
      })
    },
    handleCopy(record) {},
    // 修改状态
    checkStates(text, record) {
      this.$set(record, 'Authorization', this.$store.getters.token)
      if (text == 0) {
        record.status = 1
      } else if (text == 1) {
        record.status = 0
      }
      editRole(record).then((res) => {
        this.$refs.table.refresh(true)
      })
    },
    searchLog() {
      this.$router.push({ name: 'sysLog' })
      // this.$router.push('sysLog')
    },
    // 修改详情
    handleEdit(e) {
      this.$refs.editModal.edit(e)
    },
    handleSaveOk() {
      this.$refs.table.refresh(true)
    },
    handleSaveClose() {},
    handleEditOk() {
      this.$refs.table.refresh(false)
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      console.log('onSelectChange 点击了')
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
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
