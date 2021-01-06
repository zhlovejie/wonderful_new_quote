<template>
  <a-modal
    v-if="visible"
    title="权限详情"
    :width="800"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :confirmLoading="loading"
    :maskClosable="false"
  >
    <a-spin :spinning="loading" tip="处理中...">
      <a-row>
        <div class="table-page-search-wrapper" style="margin-bottom: 20px">
          <a-select
            style="width: 250px; margin-bottom: 10px"
            :allowClear="true"
            placeholder="请选择部门"
            v-model="departmentId"
          >
            <a-select-option :value="undefined">请选择部门</a-select-option>
            <a-select-option v-for="item in departmentList" :key="item.id" :value="item.id">{{
              item.departmentName
            }}</a-select-option>
          </a-select>
          <a-input
            class="main-items"
            style="width: 250px; margin-left: 10px"
            placeholder="姓名"
            allowClear
            v-model="name"
          />
          <a-button style="margin-left: 10px" type="primary" @click="info">查询</a-button>
        </div>
        <a-table style="margin-left: 10px" :columns="columns" :dataSource="dataSource">
          <div slot="order" slot-scope="text, record, index">
            <span>{{ index + 1 }}</span>
          </div>
        </a-table>
      </a-row>
    </a-spin>
  </a-modal>
</template>

<script>
import { departmentList } from '@/api/systemSetting'
import { GatelistEquipmentDe } from '@/api/accessControl'
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
]

export default {
  name: 'RoleTreeModal',
  data() {
    return {
      roleId: '',
      visible: false,
      resId: '',
      name: '',
      departmentId: undefined,
      columns: columns,
      queryParam: {},
      dataSource: [],
      selectedKeys: [],
      treeData: [],
      roleIdList: [],
      loading: false,

      // 部门列表
      departmentList: [],
      // 岗位列表
      roleList: [],
    }
  },
  created() {
    departmentList().then((res) => {
      this.departmentList = res.data
    })
  },
  methods: {
    setCheckedNodes(res) {
      let that = this
      that.visible = true
      that.resId = res.id
      that.info()
    },
    info() {
      GatelistEquipmentDe({ id: this.resId, name: this.name, departmentId: this.departmentId }).then((rs) => {
        this.dataSource = rs.data
      })
    },

    handleOk() {
      this.visible = false
      this.dataSource = []
    },
    handleCancel() {
      this.visible = false
      this.dataSource = []
    },
  },
}
</script>

<style  scoped>
</style>
