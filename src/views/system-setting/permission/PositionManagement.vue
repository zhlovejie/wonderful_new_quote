<template>
  <a-card :bordered="false">
    <a-layout>
      <a-layout-sider class="bgc-fff">
        <a-tree
          v-if="treeData.length > 0"
          :defaultExpandAll="true"
          @select="onSelect"
          @expand="onExpand"
          :treeData="treeData"
        ></a-tree>
      </a-layout-sider>
      <a-layout class="bgc-fff">
        <div class="top-search">
          <a-select
            defaultValue="请选择部门"
            v-model="selectedDepartment"
            class="select-part"
            @change="handleDepartmentChange"
            placeholder="请选择部门"
          >
            <a-select-option :value="0">请选择部门</a-select-option>
            <a-select-option
              v-for="item in selectdata"
              :key="item.id"
              :value="item.id"
            >{{ item.departmentName }}</a-select-option>
          </a-select>
          <a-button type="primary" icon="search" @click="search">查询</a-button>
          <template v-if="$auth('station:add')">
            <a-button type="primary" style="float:right" icon="plus" @click="showModal('add')">新增岗位</a-button>
          </template>
        </div>
        <a-layout-content>
          <a-table
            :columns="columns"
            rowKey="id"
            :dataSource="data"
            :pagination="pagination"
            :loading="loading"
            @change="handleTableChange"
          >
            <div slot="order" slot-scope="text,record,index">
              <span>{{ index+1 }}</span>
            </div>
            <div slot="roleName" slot-scope="text,record">
              <a-button
                v-if="text === null || text === '' "
                type="primary"
                icon="api"
                @click="bindRole(record)"
              >绑定角色</a-button>
              <span v-else>{{ text }}</span>
            </div>
            <div slot="states" slot-scope="text,record">
              <template v-if="$auth('station:edit')">
                <a-switch
                  checkedChildren="启用"
                  :checked="(text === 0) ? true : false"
                  unCheckedChildren="禁用"
                  @click="changeStatue(text,record,&quot;&quot;)"
                />
              </template>
              <template v-if="!$auth('station:edit')">
                <span v-if="text === 0">启用</span>
                <span v-if="text === 1">禁用</span>
              </template>
            </div>
            <div slot="action" slot-scope="text, record">
              <template v-if="$auth('station:edit')">
                <a @click="showModal('edit', record)">编辑</a>
              </template>
            </div>
          </a-table>
        </a-layout-content>
      </a-layout>
    </a-layout>

    <a-modal
      :title="dialogTitle"
      v-model="visible"
      v-if="visible"
      @ok="handleSubmit()"
      @cancel="handleCancel"
      okText="确认"
      cancelText="取消"
      :maskClosable="false"
    >
      <a-form :form="currentRecord">
        <a-form-item label="部门名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <span>{{ (currentRecord && currentRecord.department && currentRecord.department.departmentName) || '-' }}</span>
        </a-form-item>
        <a-form-item label="上级岗位" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-select
            v-if="parentStationList.length"
            class="select-part"
            :value="selectedStationParentId"
            @change="handParementStationChange"
            placeholder="请选择上级岗位"
          >
            <a-select-option
              v-for="item in parentStationList"
              :key="item.id"
              :value="item.id"
            >{{ item.stationName }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="岗位名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input v-model="currentRecord.stationName" />
        </a-form-item>
        <a-form-item label="岗位设定人数" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input v-model="currentRecord.setNum" />
        </a-form-item>
        <a-form-item label="等级" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-select
            defaultValue="请选择等级"
            class="select-part"
            v-model="selectedLevel"
            @change="handleLevelChange"
            placeholder="请选择等级"
          >
            <a-select-option v-for="level in levelList" :key="level" :value="level">{{ level }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form layout="inline">
          <a-row>
            <a-col :span="4" style="text-align: right;height: 39px;line-height: 39px;">
              <span>绑定角色：</span>
            </a-col>
            <a-col :span="10">
              <a-form-item label="部门">
                <a-select
                  v-model="roleDepartmentId"
                  @change="handleProvinceChange"
                  placeholder="请选择部门"
                  style="width: 120px;"
                >
                  <a-select-option
                    v-for="item in departmentList"
                    :key="item.id"
                    :value="item.id"
                  >{{ item.departmentName }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="10">
              <a-form-item label="角色">
                <a-select
                  v-model="currentRecord.roleId"
                  placeholder="请选择角色"
                  style="width: 120px;"
                  @select="selectRole"
                >
                  <a-select-option
                    v-for="item in roleList"
                    :key="item.id"
                    :value="item.id"
                  >{{ item.roleName }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
        <a-form-item label="备注" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-textarea v-model="currentRecord.remarks" :rows="4" />
        </a-form-item>
        <a-form-item label="状态" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-radio-group name="radioGroup" v-model="currentRecord.status" @change="radioChange">
            <a-radio :value="0">启用</a-radio>
            <a-radio :value="1">禁用</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </a-modal>
  </a-card>
</template>

<script>
import {
  getpositionManagementList,
  stationList,
  gettreeList,
  getSelectdepartmentList,
  positionModify,
  positionAdd,
  getSelectLevelList,
  getParentStationList,
  queryRoleListById,
  queryOne
} from '../../../api/systemSetting'
const columns = [
  {
    align: 'center',
    title: '序号',
    key: 'order',
    width: '70px',
    scopedSlots: { customRender: 'order' }
  },
  {
    align: 'center',
    title: '部门',
    dataIndex: 'department.departmentName',
    key: 'department.departmentName'
  },
  {
    align: 'center',
    title: '岗位',
    dataIndex: 'stationName',
    key: 'stationName'
  },
  {
    align: 'center',
    title: '等级',
    dataIndex: 'level',
    key: 'level'
  },
  {
    align: 'center',
    title: '角色',
    key: 'roleName',
    // scopedSlots: { customRender: 'roleName' },
    dataIndex: 'roleName'
  },
  {
    align: 'center',
    title: '状态',
    dataIndex: 'status',
    key: 'states',
    scopedSlots: { customRender: 'states' }
  },
  {
    align: 'center',
    title: '操作人',
    key: 'modifierName',
    dataIndex: 'modifierName'
  },
  {
    align: 'center',
    title: '操作时间',
    key: 'modifyTime',
    dataIndex: 'modifyTime'
  },
  {
    align: 'center',
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  name: 'PositionManagement',
  data () {
    return {
      data: [],
      columns: columns,
      pagination: {},
      loading: false,
      department: this.$store.getters.department,
      userInfo: this.$store.getters.userInfo,
      departmentId: this.$store.getters.department.departmentId,
      treeData: [],
      role: '',
      status: 0,
      parentDepartment: '',
      departmentName: '',
      remarks: '',
      value: 0,
      currentRecord: {},
      action: 'edit',
      dialogTitle: '修改部门',
      visible: false,
      // selectDepartmentList: []
      selectdata: [],
      levelList: [], // 等级下拉列表
      selectedDepartment: 0, // 部门下拉选项选中
      selectedLevel: '', // 等级下拉选项选中
      selectedStationParentId: 0, // 父岗位下拉选项选中
      level: '', // 等级的value
      parentStationList: '', // 父岗位列表
      selectedTreeData: null,
      roleList: {}, // 角色列表
      queryParam: {},
      departmentList: {},
      roleDepartmentId: 0, // 角色的部门id
      roleId: 0, // 角色Id
      type: 0
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      // 获取岗位列表数据
      this.getList()
      // 获取左侧树结构数据
      gettreeList().then(res => {
        this.treeData = res
      })
      // 获取下拉选择部门数据
      getSelectdepartmentList().then(res => {
        this.departmentList = res.data
        console.log('获取下拉选择部门数据', res)
        // this.selectDepartmentList = res.data
        this.selectdata = res.data
      })
    },

    // 获取岗位列表
    getList (params = {}) {
      params = {
        // departmentId: this.department.departmentId || 1,   //不传入部门id获取到的是所有的岗位信息
        current: params.current || 1
        // size: 8
      }
      // type为1的时候是搜索触发的getList type为0的时候为点击树触发的getList
      this.loading = true
      if (this.type == 1) {
        if (this.selectedDepartment != null && this.selectedDepartment != 0) {
          this.$set(params, 'departmentId', this.selectedDepartment)
        }
      }
      if (this.type == 0) {
        if (this.parentId != 0 && this.parentId != null) {
          this.$set(params, 'departmentId', this.parentId)
        }
      }
      this.loading = true
      getpositionManagementList(params)
        .then(res => {
          console.log('获取岗位列表结果', res)
          const pagination = { ...this.pagination }
          pagination.total = res.data.total || 0
          this.loading = false
          this.data = res.data.records
          this.pagination = pagination
          this.role = res.data.records.roleName
        })
        .catch(error => {
          this.loading = false
          console.error(error)
        })
    },
    handleTableChange (pagination, filters, sorter) {
      console.log(pagination)
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.getList({
        results: pagination.pageSize,
        current: pagination.current,
        sortField: sorter.field,
        sortOrder: sorter.order,
        ...filters
      })
    },
    // 选择部门下拉框
    handleDepartmentChange (value) {
      this.selectedDepartment = value
      console.log('//选择部门下拉框', value)
    },
    // 选择等级下拉
    handleLevelChange (value) {
      console.log('选择等级下拉框', `selected ${value}`)
      this.selectedLevel = value
    },
    // 选择父岗位下拉
    handParementStationChange (value) {
      console.log('选择父岗位下拉框', `selected ${value}`)
      this.selectedStationParentId = value
    },

    /**
     * 选中树节点触发
     * @param selectedKeys
     * @param selected
     * @param node
     * 参数的解构赋值
     */
    onSelect (selectedKeys, { selected, node }) {
      if (selected === false) {
        this.selectedTreeData = null
      } else {
        const { title } = node
        this.selectedTreeData = {
          key: selectedKeys[0],
          title
        }
      }
      this.selectedKeys = selectedKeys
      this.parentId = selectedKeys[0]
      this.type = 0
      this.getList()
    },
    onExpand () {
      console.log('Trigger Expand')
    },

    // 显示新增，修改弹出层
    showModal (action, record) {
      // 获取等级下拉接口
      getSelectLevelList().then(res => {
        // this.options = res
        this.levelList = res.data
      })
      let departmentId = 0
      if (action === 'edit') {
        departmentId = record.departmentId
        if (record.roleId != null) {
          this.roleId = record.roleId
          queryOne({ id: record.roleId }).then(res => {
            this.roleDepartmentId = res.data.departmentId
            this.handleProvinceChange(this.roleDepartmentId)
          })
        } else {
          this.roleId = ''
          this.roleDepartmentId = ''
        }
      } else {
        if (this.selectedTreeData === null) {
          this.$message.warning('请先点击左侧选择部门！', 2)
          return false
        } else {
          departmentId = this.selectedTreeData.key
        }
      }
      // 获取父岗位下拉接口
      getParentStationList({ id: departmentId }).then(res => {
        console.log('获取父岗位数据', res)
        this.parentStationList = res.data
      })
      this.action = action
      if (action === 'edit') {
        this.dialogTitle = '修改岗位'
        this.currentRecord = { ...record }
        this.selectedStationParentId = record.parentId || 0
        this.selectedLevel = record.level
        console.log('----------修改岗位----------', this.currentRecord)
      } else if (action === 'add') {
        this.dialogTitle = '新增岗位'
        this.selectedStationParentId = 0
        this.selectedLevel = ''
        this.roleDepartmentId = ''
        let departmentName = '无'
        departmentName = this.selectedTreeData.title
        departmentId = this.selectedTreeData.key
        this.currentRecord = {
          status: this.status,
          department: {
            departmentName: departmentName,
            id: departmentId
          },
          setNum:0
        }
      }
      this.visible = true
    },

    // 修改单选启用禁用按钮
    radioChange (e) {
      console.log('单选改变 checked', e.target.value)
    },
    // 修改启用禁用按钮
    changeStatue (text, record) {
      let status = 0
      if (text == 0) {
        status = 1
      } else {
        status = 0
      }
      record.status = status
      const { id, stationName, remarks } = record
      const params = { id, status }
      positionModify(params)
        .then(data => {
          console.log('修改岗位了', data)
        })
        .catch(error => {})
    },

    // 弹出层点击修改或者新增页面的确定按钮事件
    handleSubmit () {
      if (this.currentRecord.stationName != null && this.currentRecord.stationName != '') {
        const params = {
          stationName: this.currentRecord.stationName.trim(),
          departmentId: this.currentRecord.department.id
        }
        var _this = this
        stationList(params).then(res => {
          if (this.action === 'edit') {
            if (res.data.length > 0 && _this.currentRecord.id != res.data[0].id) {
              this.$message.error('名称重复')
              return
            }
            this.doEdit()
          } else if (this.action === 'add') {
            if (res.data.length > 0) {
              this.$message.error('名称重复')
              return
            }
            this.doAdd()
          }
        })
      } else {
        this.$message.error('请输入岗位名称')
      }
    },

    // 修改岗位
    doEdit () {
      // 取数据
      const { id, status, Authorization, stationName, remarks, roleId ,setNum} = this.currentRecord
      // 组装接口需要的数据
      const params = {
        id: id,
        status: status,
        Authorization,
        stationName,
        remarks,
        parentId: this.selectedStationParentId,
        level: this.selectedLevel,
        roleId: this.roleId,
        setNum
      }
      console.log('修改的参数=======', params)
      this.loading = true
      positionModify(params)
        .then(data => {
          console.log('点击了提交按钮，并且已经调取修改岗位接口成功了', data)
          this.visible = false
          this.handleCancel()
          this.init()
        })
        .catch(error => {
          console.error(error)
        })
        .finally(() => {
          this.loading = false
        })
    },
    doAdd () {
      // 取数据
      const { id, status, Authorization, stationName, remarks, parentId, departmentId, roleId ,setNum} = this.currentRecord
      // 组装接口需要的数据
      const params = {
        stationName,
        departmentId: this.selectedTreeData.key,
        parentId: this.selectedStationParentId,
        status,
        Authorization,
        level: this.selectedLevel,
        remarks,
        roleId,
        setNum
      }
      console.log('新增岗位参数：', params)
      this.loading = true
      positionAdd(params)
        .then(res => {
          if (res.code == 200) {
            this.visible = false
            this.handleCancel()
            this.init()
            this.$message.success('保存成功')
          } else {
            this.$message.error(res.msg)
          }
        })
        .catch(error => {
          console.error(error)
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 取消
    handleCancel () {
      this.currentRecord = {} // 清空表
    },
    // 查询部门对应的岗位列表
    search () {
      this.type = 1
      this.getList()
    },

    // 获取部门角色联动
    handleProvinceChange (value) {
      // 获取部门下的角色
      queryRoleListById({ departmentId: value, status: 0 })
        .then(rs => {
          this.roleList = rs.data
        })
        .catch(error => {
          console.error(error)
        })
    },
    // 绑定角色 角色选中
    selectRole (value) {
      console.log('绑定角色 角色选中', value)
      this.roleId = value
    }
  }
}
</script>

<style lang="less" scoped>
.bgc-fff {
  background-color: #fff;
}
.top-search {
  margin-bottom: 18px;
}
.select-part {
  width: 120px;
  margin-right: 12px;
}
</style>
