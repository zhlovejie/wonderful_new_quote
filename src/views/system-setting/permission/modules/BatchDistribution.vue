<template>
  <a-modal
    v-if="visible"
    title="批量分配菜单"
    :width="1000"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :confirmLoading="loading"
    :maskClosable="false"
  >
    <a-spin :spinning="loading" tip="处理中...">
      <a-row>
        <a-col :span="7" style="height: 661px; overflow-y: auto; overflow: auto; padding-right: 10px">
          <div class="spin-content">
            <a-tree
              ref="aTree"
              checkable
              v-model="checkedKeys"
              :showLine="false"
              @expand="onExpand"
              :expandedKeys="expandedKeys"
              :autoExpandParent="autoExpandParent"
              @select="onSelect"
              @check="onCheck"
              :selectedKeys="selectedKeys"
              :treeData="treeData"
            />
          </div>
        </a-col>
        <a-col :span="17">
          <a-row :gutter="24">
            <a-form :form="form" class="form wdf-form">
              <a-col :span="10">
                <a-form-item style="margin-bottom: 0">
                  <a-select
                    style="width: 100%; margin-bottom: 10px; margin-left: 10px"
                    @change="handleProvinceChange"
                    :allowClear="true"
                    placeholder="请选择部门"
                    v-model="departmentId"
                  >
                    <a-select-option :value="undefined">请选择部门</a-select-option>
                    <a-select-option v-for="item in departmentList" :key="item.id" :value="item.id">{{
                      item.departmentName
                    }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="10">
                <a-form-item class="form wdf-form">
                  <a-select
                    mode="multiple"
                    style="width: 100%; margin-left: 10px"
                    placeholder="请选择角色"
                    :allowClear="true"
                    :maxTagCount="1"
                    @deselect="desedel"
                    @change="handleProvince"
                    v-model="roleArr"
                  >
                    <a-select-option v-for="item in roleList" :key="item.id" :value="item.id">{{
                      item.roleName
                    }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-button style="float: right; margin-top: 5px" type="primary" @click="whole"> 全部</a-button>
            </a-form>
          </a-row>

          <a-table style="margin-left: 10px" :columns="columns" :dataSource="dataSource">
            <div slot="order" slot-scope="text, record, index">
              <span>{{ index + 1 }}</span>
            </div>
            <div slot="action" slot-scope="text, record, index">
              <a-popconfirm title="是否确定删除" ok-text="确定" cancel-text="取消" @confirm="confirmDelete(record.id)">
                <a type="primary">删除</a>
              </a-popconfirm>
            </div>
          </a-table>
        </a-col>
      </a-row>
    </a-spin>
  </a-modal>
</template>

<script>
import { routeTreeList } from '@/api/system/menu'
import {
  editAuthority,
  editAuthorityWithCancel,
  getDevisionList,
  queryRoleListById,
  getSaveRoleMenu,
  querygetAllRole,
} from '@/api/systemSetting'
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
    title: '部门',
    dataIndex: 'departmentName',
    key: 'departmentName',
  },
  {
    align: 'center',
    title: '角色',
    dataIndex: 'roleName',
    key: 'roleName',
  },
  {
    align: 'center',
    title: '操作',
    width: 150,
    key: 'action',
    scopedSlots: { customRender: 'action' },
  },
]

export default {
  name: 'RoleTreeModal',
  data() {
    return {
      roleId: '',
      visible: false,
      columns: columns,
      queryParam: {},
      dataSource: [],
      expandedKeys: [],
      autoExpandParent: true,
      checkedKeys: [],
      selectedKeys: [],
      treeData: [],
      roleIdList: [],
      halfCheckedKeys: [],
      loading: false,
      cancelTag: null,
      form: this.$form.createForm(this),
      // 部门列表
      departmentList: [],
      // 角色列表
      roleList: [],

      departmentId: undefined,
      roleArr: [],
    }
  },
  watch: {
    departmentId: function (val) {
      if (val === undefined) {
        querygetAllRole()
          .then((rs) => {
            this.roleList = rs.data
          })
          .catch((error) => {
            console.error(error)
          })
      }
    },
  },
  created() {
    routeTreeList().then((res) => {
      this.treeData = res.data
    })
    querygetAllRole()
      .then((rs) => {
        this.roleList = rs.data
      })
      .catch((error) => {
        console.error(error)
      })
    getDevisionList().then((res) => {
      this.departmentList = res.data
    })
  },
  methods: {
    onExpand(expandedKeys) {
      console.log('onExpand', expandedKeys)
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    onCheck(checkedKeys, info) {
      console.log('onCheck', checkedKeys)
      this.checkedKeys = checkedKeys
      this.halfCheckedKeys = info.halfCheckedKeys
      console.log(this.checkedKeys)
    },
    onSelect(selectedKeys, info) {
      console.log('onSelect', info)
      this.selectedKeys = selectedKeys
    },
    // 获取部门角色联动
    handleProvinceChange(value) {
      if (value != undefined) {
        // 获取部门下的角色
        // this.depart = value
        queryRoleListById({ departmentId: value, status: 0 })
          .then((rs) => {
            this.roleList = rs.data.map((item) => {
              return {
                roleName: item.roleName,
                id: item.id,
                departmentId: item.departmentId,
                departmentName: this.getDepartmentName(item.departmentId),
              }
            })
          })
          .catch((error) => {
            console.error(error)
          })
      } else {
        this.roleList = []
      }
    },
    desedel(value) {
      // 删除事件
      // console.log(value)
      this.roleArr = this.roleArr.filter((val) => val !== +value)
      this.dataSource = this.dataSource.filter((val) => val.id !== +value)
    },
    handleProvince(value) {
      let that = this
      if (!Array.isArray(value)) return
      value.map((_ppid) => {
        if (!_ppid) return
        let target = that.dataSource.find((p) => p.id === _ppid)
        if (!target) {
          let _p = that.roleList.find((_p) => _p.id === _ppid)
          _p.roleName = _p.roleName
          _p.departmentName = that.getDepartmentName(that.departmentId)
          _p.departmentId = that.departmentId
          that.dataSource.push({ ..._p })
        }
      })
      // this. dataSource = that.roleList
      //     .filter((role) => roleArr.includes(role.id))
      //     .map((role) => {
      //       return {
      //         roleName: role.roleName,
      //         id: role.id,
      //         departmentId: that.departmentId,
      //         departmentName: that.getDepartmentName(that.departmentId),
      //       }
      //     })
    },
    setCheckedNodes(res, id) {
      let that = this
      this.visible = true
      this.checkedKeys = []
      this.dataSource = []
      this.form.resetFields() // 清空表
    },
    unique(arr) {
      //Set数据结构，它类似于数组，其成员的值都是唯一的
      return Array.from(new Set(arr)) // 利用Array.from将Set结构转换成数组
    },
    // 选择全部角色
    whole() {
      if (this.departmentId) {
        let arr = this.roleArr.concat(this.roleList.map((role) => role.id))
        this.roleArr = this.unique(arr)
        this.dataSource = this.dataSource.concat(
          this.roleList.filter((role) => {
            return !this.dataSource.some((item) => item.id === role.id)
          })
        )
      } else {
        this.dataSource = []
        let arr = this.roleArr.concat(this.roleList.map((role) => role.id))
        this.roleArr = this.unique(arr)
        this.dataSource = this.dataSource.concat(
          this.roleList.filter((role) => {
            return !this.dataSource.some((item) => item.id === role.id)
          })
        )
      }
    },
    confirmDelete(roleId) {
      // 确认删除事件
      this.roleArr = this.roleArr.filter((val) => val !== +roleId)
      this.dataSource = this.dataSource.filter((val) => val.id !== +roleId)
    },
    handleOk() {
      if (this.checkedKeys.length == 0) {
        return this.$message.error('请选择菜单')
      }
      if (this.dataSource.length == 0) {
        return this.$message.error('请选择角色')
      }
      let arr = {}
      arr.roleIdList = this.roleArr
      arr.menuIdList = this.checkedKeys
      arr.notAllMenuIdList = this.halfCheckedKeys
      this.loading = true
      getSaveRoleMenu(arr)
        .then((res) => {
          if (res.code === 200) {
            this.$message.info(res.msg)
            this.visible = false
            this.checkedKeys = []
            this.queryParam = {}
            this.roleArr = []
            this.dataSource = []
            this.departmentId = undefined
            this.loading = false
          } else {
            this.$message.error(res.msg)
            this.loading = false
          }
        })
        .catch((err) => {
          this.$message.error(err.msg)
          this.loading = false
        })
    },
    handleCancel() {
      this.visible = false
      this.checkedKeys = []
      // this.form.resetFields() // 清空表
      this.roleArr = []
      this.dataSource = []
      this.departmentId = undefined
    },
    getDepartmentName(id) {
      let _val = this.departmentList.find((item) => +item.id === +id)
      return _val.departmentName
    },
  },
}
</script>

<style  scoped>
</style>
