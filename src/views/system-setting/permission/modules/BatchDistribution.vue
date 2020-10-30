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
        <a-col :span="8" style="height: 600px; overflow-y: auto; overflow: auto">
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
        <a-col :span="16">
          <div class="table-page-search-wrapper">
            <a-form :form="form" class="form wdf-form">
              <a-col :span="12">
                <a-form-item>
                  <a-select
                    style="width: 300px; margin-bottom: 10px"
                    @change="handleProvinceChange"
                    placeholder="请选择部门"
                  >
                    <a-select-option :value="undefined">请选择部门</a-select-option>
                    <a-select-option v-for="item in departmentList" :key="item.id" :value="item.id">{{
                      item.departmentName
                    }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item>
                  <a-select
                    mode="multiple"
                    style="width: 300px; margin-left: 10px"
                    placeholder="请选择角色"
                    :allowClear="true"
                    :maxTagCount="1"
                    @change="handleChange"
                    v-decorator="['authTrainFolderBoList']"
                  >
                    <a-select-option v-for="item in roleList" :key="item.id" :value="item.id">{{
                      item.roleName
                    }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-form>
          </div>

          <a-table
            style="margin-top: 40px"
            :scroll="{ y: 400 }"
            :columns="columns"
            :dataSource="dataSource"
            :pagination="false"
            :loading="loading"
          >
            <div slot="order" slot-scope="text, record, index">
              <span>{{ index + 1 }}</span>
            </div>
            <div slot="action" slot-scope="text, record, index">
              <a-popconfirm title="是否确定删除" ok-text="确定" cancel-text="取消" @confirm="confirmDelete(index)">
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
      loading: false,
      cancelTag: null,
      form: this.$form.createForm(this),
      // 部门列表
      departmentList: [],
      // 角色列表
      roleList: {},
      _d: {
        departmentId: '',
        departmentName: '',
      },
      depart: '',
    }
  },
  watch: {
    depart: function (val) {
      let _d = this.departmentList.find((_d) => _d.id === val)
      this._d.departmentId = val
      this._d.departmentName = _d.departmentName
    },
  },
  created() {
    routeTreeList().then((res) => {
      this.treeData = res.data
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
        this.depart = value
        queryRoleListById({ departmentId: value, status: 0 })
          .then((rs) => {
            this.roleList = rs.data
          })
          .catch((error) => {
            console.error(error)
          })
      } else {
        this.roleList = []
      }
    },
    setCheckedNodes(res, id) {
      let that = this
      this.visible = true
      this.checkedKeys = []
      this.dataSource = []
      this.form.resetFields() // 清空表
    },

    handleChange(value) {
      let that = this
      this.roleIdList = value
      if (!Array.isArray(value)) return
      value.map((_ppid) => {
        if (!_ppid) return
        let target = that.dataSource.find((p) => p.id === _ppid)
        if (!target) {
          let _p = that.roleList.find((_p) => _p.id === _ppid)
          _p.roleName = _p.roleName
          that.dataSource.push({ ..._p, ...that._d })
        }
      })
    },
    confirmDelete(index) {
      // 确认删除事件
      this.dataSource.splice(index, 1)
      let arr = []
      this.dataSource.map((item) => {
        arr.push(item.id)
      })
      this.form.setFieldsValue({
        authTrainFolderBoList: arr,
      })
    },
    handleOk() {
      if (this.checkedKeys.length == 0) {
        return this.$message.error('请选择菜单')
      }
      if (this.dataSource.length == 0) {
        return this.$message.error('请选择角色')
      }
      let arr = {}
      arr.roleIdList = this.roleIdList
      arr.menuIdList = this.checkedKeys
      arr.notAllMenuIdList = []
      this.loading = true
      getSaveRoleMenu(arr)
        .then((res) => {
          if (res.code === 200) {
            this.$message.info(res.msg)
            console.log(res.msg)
            this.visible = false
            this.loading = false
            this.checkedKeys = []
            this.queryParam = {}
            that.form.resetFields() // 清空表
            this.dataSource = []
          } else {
            this.$message.info(res.msg)
            this.loading = false
          }
        })
        .catch((err) => (this.visible = false))
    },
    handleCancel() {
      this.visible = false
      this.checkedKeys = []
      this.form.resetFields() // 清空表
      this.dataSource = []
    },
  },
}
</script>

<style scoped>
</style>
