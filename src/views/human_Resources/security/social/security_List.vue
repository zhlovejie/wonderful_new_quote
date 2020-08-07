<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-select
        style="width:200px;"
        v-model="queryParam.departmentId"
        @change="handleProvinceChange"
        placeholder="请选择部门"
      >
        <a-select-option :value="undefined">请选择部门</a-select-option>
        <a-select-option
          v-for="item in departmentList"
          :key="item.id"
          :value="item.id"
        >{{ item.departmentName }}</a-select-option>
      </a-select>
      <a-select style="width:200px;margin-left:10px;" v-model="queryParam.id" placeholder="请选择角色">
        <a-select-option :value="undefined">请选择</a-select-option>
        <a-select-option
          v-for="item in roleList"
          :key="item.id"
          :value="item.id"
        >{{ item.roleName }}</a-select-option>
      </a-select>
      <a-button style="margin-left:10px;" type="primary" @click="$refs.table.refresh(true)">查询</a-button>
      <template v-if="$auth('role:add')">
        <a-button style="float:right;" type="primary" icon="plus" @click="handleAdd">新建角色</a-button>
      </template>
    </div>
    <a-layout>
      <!--  此处编写表单中的功能按钮    -->
      <a-layout-content>
        <s-table ref="table" size="default" :columns="columns" :data="loadData" :alert="false">
          <div slot="order" slot-scope="text, record, index">
            <span>{{ index + 1 }}</span>
          </div>
          <div slot="status" slot-scope="text, record">
            <template v-if="$auth('role:edit')">
              <a-switch
                checkedChildren="启用"
                :checked="(text === 0) ? true : false"
                unCheckedChildren="禁用"
                @click="checkStates(text,record)"
              />
            </template>
            <template v-if="!$auth('role:edit')">
              <span v-if="text === 0">启用</span>
              <span v-if="text === 1">禁用</span>
            </template>
          </div>
          <span slot="action" slot-scope="text, record">
            <template v-if="$auth('role:edit')">
              <a @click="handleEdit(record)">编辑</a>
              <a-divider type="vertical" />
              <a @click="deleteRoleInfo(record)">删除</a>
              <a-divider type="vertical" />
              <a @click="handleMenu(record)">菜单权限</a>
            </template>
          </span>
        </s-table>
      </a-layout-content>
    </a-layout>
    <role-modal ref="modal" @ok="handleSaveOk" @close="handleSaveClose" />
    <role-modal ref="editModal" @ok="handleEditOk" @close="handleEditOk" />
    <role-modal ref="queryModal" @ok="handleEditOk" @close="handleEditOk" />
    <role-modal ref="copyModal" @ok="handleEditOk" @close="handleEditOk" />
    <role-tree-modal ref="role" @ok="handleEditOk" @close="handleEditOk"></role-tree-modal>
  </a-card>
</template>

<script>
import {
  deleteRole,
  getRoleManagementList,
  editRole,
  getDevisionList,
  queryRoleListById,
  queryRoleMenu,
} from '../../../../api/systemSetting'
import { STable } from '@/components'
// import RoleModal from './modules/RoleModal'
// import RoleTreeModal from './modules/RoleTreeModal'
// import ACol from 'ant-design-vue/es/grid/Col'

export default {
  name: 'RoleManagement',
  components: {
    // ACol,
    // STable,
    // RoleModal,
    // RoleTreeModal,
  },
  data() {
    return {
      openKeys: ['id'],
      parentId: 0,
      hiddenBoolean: false,
      options: [],
      Selected: '',
      queryParam: {},
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
          title: '角色',
          dataIndex: 'roleName',
          key: 'roleName',
        },
        {
          align: 'center',
          title: '状态',
          dataIndex: 'status',
          key: 'status',
          scopedSlots: { customRender: 'status' },
        },
        {
          align: 'center',
          title: '操作人',
          key: 'modifierName',
          dataIndex: 'modifierName',
        },
        {
          align: 'center',
          title: '操作时间',
          key: 'modifyTime',
          dataIndex: 'modifyTime',
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
        return getRoleManagementList(Object.assign(parameter, this.queryParam)).then((res) => {
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
    // 获取部门角色联动
    handleProvinceChange(value) {
      if (value != undefined) {
        // 获取部门下的角色
        queryRoleListById({ departmentId: value })
          .then((rs) => {
            this.roleList = rs.data
            this.$set(this.queryParam, 'id', undefined)
          })
          .catch((error) => {
            console.error(error)
          })
      } else {
        this.$set(this.queryParam, 'id', undefined)
        this.roleList = []
      }
    },
    // 改变select
    handleChange(value) {
      console.log(`selected ${value}`)
    },
    // 清空、重置
    emptyQueryParam() {
      this.queryParam = {}
      this.roleList = {}
    },

    // 新增
    handleAdd(item) {
      this.$refs.modal.add()
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
