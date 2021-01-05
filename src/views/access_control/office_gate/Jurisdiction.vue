<template>
  <a-modal
    v-if="visible"
    title="分配权限"
    :width="800"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :confirmLoading="loading"
    :maskClosable="false"
  >
    <a-spin :spinning="loading" tip="处理中...">
      <a-row>
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
                <!-- @deselect="desedel" -->
                <!-- mode="multiple" -->
                <!-- :maxTagCount="1" -->
                <!-- v-model="roleArr" -->
                <a-select
                  style="width: 100%; margin-left: 10px"
                  placeholder="请选择岗位"
                  :allowClear="true"
                  @change="handleProvince"
                >
                  <a-select-option v-for="item in roleList" :key="item.id" :value="item.id">{{
                    item.stationName
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
            <a-popconfirm title="是否确定删除" ok-text="确定" cancel-text="取消" @confirm="confirmDelete(index)">
              <a type="primary">删除</a>
            </a-popconfirm>
          </div>
        </a-table>
      </a-row>
    </a-spin>
  </a-modal>
</template>

<script>
import { routeTreeList } from '@/api/system/menu'
import { departmentList, getStationList, getUserByStation, getUserByDep } from '@/api/systemSetting'
import { GatelistEquipmentId, GatelistAdd } from '@/api/accessControl'
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
    title: '岗位',
    dataIndex: 'stationName',
    key: 'stationName',
  },
  {
    align: 'center',
    title: '名字',
    dataIndex: 'name',
    key: 'name',
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
      resId: '',
      columns: columns,
      queryParam: {},
      dataSource: [],
      selectedKeys: [],
      treeData: [],
      roleIdList: [],
      halfCheckedKeys: [],
      loading: false,
      cancelTag: null,
      form: this.$form.createForm(this),
      // 部门列表
      departmentList: [],
      // 岗位列表
      roleList: [],

      personnelList: [],

      departmentId: undefined,
      roleArr: [],
    }
  },
  watch: {
    departmentId: function (val) {
      if (val !== undefined) {
        getUserByDep({ departmentId: val })
          .then((rs) => {
            this.personnelList = rs.data.map((item) => {
              return {
                departmentName: item.departmentName,
                name: item.trueName,
                userId: item.id,
                stationName: item.stationName,
              }
            })
          })
          .catch((error) => {
            console.error(error)
          })
      }
    },
  },
  created() {
    // routeTreeList().then((res) => {
    //   this.treeData = res.data
    // })
    departmentList().then((res) => {
      this.departmentList = res.data
    })
  },
  methods: {
    // 获取部门岗位联动
    handleProvinceChange(value) {
      if (value != undefined) {
        // 获取部门下的岗位
        // this.depart = value
        getStationList({ id: value })
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
    handleProvince(value) {
      getUserByStation({ stationId: value }).then((rs) => {
        rs.data = rs.data.map((item) => {
          return {
            name: item.trueName,
            userId: item.userInfo.userId,
            stationName: item.station.stationName,
            departmentName: item.department.departmentName,
          }
        })
        if (this.dataSource.length > 0) {
          rs.data.map((items) => {
            let targer = this.dataSource.find((item) => item.userId === items.userId)
            if (!targer) {
              this.dataSource.push(items)
            }
          })
        } else {
          this.dataSource = this.dataSource.concat(rs.data)
        }
      })
    },
    setCheckedNodes(res) {
      let that = this
      that.visible = true
      that.resId = res.id
      GatelistEquipmentId({ id: res.id }).then((rs) => {
        this.dataSource = rs.data
      })
    },

    // 选择全部部门人员
    whole() {
      if (this.dataSource.length > 0) {
        this.personnelList.map((items) => {
          let targer = this.dataSource.find((item) => item.userId === items.userId)
          if (!targer) {
            this.dataSource.push(items)
          }
        })
      } else {
        this.dataSource = this.dataSource.concat(this.personnelList)
      }
    },
    confirmDelete(roleId) {
      this.dataSource.splice(roleId, 1)
    },
    handleOk() {
      if (this.dataSource.length == 0) {
        return this.$message.error('请选择人员')
      }
      let arr = this.dataSource.map((rs) => {
        return {
          userId: rs.userId,
        }
      })
      this.loading = true
      GatelistAdd({ oaAccessGateEquipmentJurisdictions: arr, equipmentId: this.resId })
        .then((res) => {
          if (res.code === 200) {
            this.$message.info(res.msg)
            this.visible = false
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
      this.dataSource = []
      this.departmentId = undefined
    },
    // getDepartmentName(id) {
    //   let _val = this.departmentList.find((item) => +item.id === +id)
    //   return _val.departmentName
    // },
  },
}
</script>

<style  scoped>
</style>
