<template>
  <a-card :bordered="false">
    <div class="table-operator" style="text-align: right">
      <template v-if="$auth('department:add')">
        <a-button type="primary" icon="plus" @click="showModal('add')">新建部门</a-button>
      </template>
    </div>
    <a-layout>
      <a-layout-sider width="200" style="background: #fff">
        <a-tree
          v-if="treeData.length > 0"
          :defaultExpandAll="true"
          @select="onSelect"
          @expand="onExpand"
          :treeData="treeData"
        >
        </a-tree>
      </a-layout-sider>
      <a-layout>
        <a-layout-content>
          <s-table
            ref="table"
            size="default"
            :columns="columns"
            :data="loadData"
            :alert="false"
          >
            <div slot="order" slot-scope="text, record, index">
              <span>{{ index + 1 }}</span>
            </div>
            <div slot="states" slot-scope="text, record">
              <template v-if="$auth('department:edit')">
                <a-switch
                  checkedChildren="启用"
                  :checked="(text === 0) ? true : false"
                  unCheckedChildren="禁用"
                  @click="changeStatue(text,record)"/>
              </template>
              <template v-if="!$auth('department:edit')">
                <span v-if="text === 0">
                  启用
                </span>
                <span v-if="text === 1">
                  禁用
                </span>
              </template>
            </div>
            <div slot="action" slot-scope="text, record">
              <template v-if="$auth('department:edit')">
                <a @click="showModal('edit', record)">编辑</a>
              </template>
            </div>
          </s-table>
        </a-layout-content>
      </a-layout>
    </a-layout>
    <a-modal
      :title="dialogTitle"
      v-model="visible"
      @ok="handleSubmit()"
      okText="确认"
      cancelText="取消"
      :maskClosable="false"
    >
      <a-form
        :form="currentRecord"
      >
        <a-form-item
          label="上级"
          :label-col="{ span: 6 }"
          :wrapper-col="{ span: 18 }"
        >
          <span>{{ (currentRecord.parentDepartment && currentRecord.parentDepartment.departmentName) || '-' }}</span>
        </a-form-item>
        <a-form-item
          label="名称"
          :label-col="{ span: 6 }"
          :wrapper-col="{ span: 18 }"
        >
          <a-input
            v-model="currentRecord.departmentName"
          />
        </a-form-item>

        <a-form-item
          label="部门总经理"
          :label-col="{ span: 6 }"
          :wrapper-col="{ span: 18 }"
        >
          <a-input read-only @click="openSystemUsers('currentRecord.leaderName')" v-model="currentRecord.leaderName"  />
          <a-input hidden v-model="currentRecord.leader" />
        </a-form-item>
        
        <a-form-item
          label="部门类型"
          :label-col="{ span: 6 }"
          :wrapper-col="{ span: 18 }"
        >
          <a-select placeholder="选择部门类型" v-model="currentRecord.type">
            <a-select-option :value="0">其他</a-select-option>
            <a-select-option :value="1">销售部</a-select-option>
            <a-select-option :value="2">研发部</a-select-option>
            <a-select-option :value="3">车间部门</a-select-option>
          </a-select>
        </a-form-item>


        <a-form-item
          label="选择部门等级"
          :label-col="{ span: 6 }"
          :wrapper-col="{ span: 18 }"
        >
          <a-select placeholder="选择部门等级" v-model="currentRecord.level">
            <a-select-option value="1">1</a-select-option>
            <a-select-option value="2">2</a-select-option>
            <a-select-option value="3">3</a-select-option>
            <a-select-option value="4">4</a-select-option>
            <a-select-option value="5">5</a-select-option>
            <a-select-option value="6">6</a-select-option>
          </a-select>
        </a-form-item>


        <a-form-item
          label="备注"
          :label-col="{ span: 6 }"
          :wrapper-col="{ span: 18 }"
        >
          <a-textarea v-model="currentRecord.remarks" :rows="4"/>
        </a-form-item>
        <a-form-item
          label="状态"
          :label-col="{ span: 6 }"
          :wrapper-col="{ span: 18 }"
        >
          <a-radio-group name="radioGroup" v-model="currentRecord.status" @change="radioChange">
            <a-radio :value="0">启用</a-radio>
            <a-radio :value="1">禁用</a-radio>
          </a-radio-group>
        </a-form-item>

      </a-form>
      <SystemUserSelect ref="systemUserSelect" @selectSystemUsers="selectSystemUsers" />
    </a-modal>
  </a-card>
</template>

<script>
import { departmentAdd, departmentModify, getDevisionManagementList, gettreeList } from '../../../api/systemSetting'
import { STable } from '@/components' 
import SystemUserSelect from '@/components/CustomerList/SystemUserSelect'
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
    dataIndex: 'departmentName',
    key: 'departmentName'
  },
  {
    align: 'center',
    title: '状态',
    dataIndex: 'status',
    // key: 'status'
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
  name: 'DevisionManagement',
  props: {},
  components: {
    STable,
    SystemUserSelect:SystemUserSelect
  },
  data () {
    return {
      data: [],
      columns: columns,
      pagination: {},
      loading: false,
      visible: false,
      formLayout: 'horizontal',
      form: this.$form.createForm(this),
      department: this.$store.getters.department,
      userInfo: this.$store.getters.userInfo,
      role: this.$store.getters.role,
      token: this.$store.getters.token,
      status: 0,
      parentDepartment: '',
      departmentName: '',
      remarks: '',
      value: 0,
      currentRecord: {},
      treeData: [],
      action: 'edit',
      dialogTitle: '修改部门',
      selectedTreeData: null, // 选中的树节点的数据
      parentId: 0,
      queryParam: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        console.log('DevisionManagement 页面开始加载数据。。。')
        return getDevisionManagementList(Object.assign(parameter, this.queryParam))
          .then(res => {
            return res
          })
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      // this.getList()
      this.$refs.table.refresh(true)
      gettreeList().then(res => {
        this.treeData = res
      })
    },
    // 获取部门管理页面列表
    getList (params = {}) {
      params = {
        // parentId: this.department.parentId || 1,
        // parentId: this.department.parentId || 1,
        current: params.current || 1
        // size: 8
      }
      console.log('params:', params)
      if (this.parentId != 0) {
        this.$set(params, 'parentId', this.parentId)
      }
      this.loading = true
      getDevisionManagementList(params).then((res) => {
        const pagination = { ...this.pagination }
        pagination.total = res.data.total || 0
        this.loading = false
        this.data = res.data.records
        this.pagination = pagination
      }).catch(error => {
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
    handleChange (value, key, column, record) {
      console.log(value, key, column)
      record[column.dataIndex] = value
    },
    edit (row) {
      row.editable = true
    },
    // eslint-disable-next-line
      del (row) {
      this.$confirm({
        title: '警告',
        content: `真的要删除 ${row.no} 吗?`,
        okText: '删除',
        okType: 'danger',
        cancelText: '取消',
        onOk () {
          console.log('OK')
          // 在这里调用删除接口
          return new Promise((resolve, reject) => {
            setTimeout(Math.random() > 0.5 ? resolve : reject, 1000)
          }).catch(() => console.log('Oops errors!'))
        },
        onCancel () {
          console.log('Cancel')
        }
      })
    },
    save (row) {
      row.editable = false
    },
    cancel (row) {
      row.editable = false
    },

    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    // 显示新增，修改弹出层
    showModal (action, record) {
      this.action = action
      if (action === 'edit') {
        this.dialogTitle = '修改部门'
        this.currentRecord = { ...record, Authorization: this.token }
      } else if (action === 'add') {
        this.dialogTitle = '新建部门'
        let parentId = 0
        let departmentName = '无'
        // 想办法获取左侧选中的树型节点的数据
        if (this.selectedTreeData !== null) {
          parentId = this.selectedTreeData.key
          departmentName = this.selectedTreeData.title
        }
        this.currentRecord = {
          parentDepartment: {
            departmentName: departmentName
          },
          Authorization: this.token,
          status: 0,
          remarks: '',
          departmentName: '',
          parentId: parentId,
          leaderName:undefined,
          leader:undefined,
          level:undefined
        }
      }
      this.visible = true
    },
    handleSubmit () {
      if (this.currentRecord.departmentName === '' || this.currentRecord.departmentName === '无') {
        this.$message.error('请完善表单信息')
        return false
      } else if (this.currentRecord.departmentName.length > 30) {
        this.$message.error('部门名称过长')
        return
      }
      const params = { 'departmentName': this.currentRecord.departmentName.trim() }
      var _this = this
      getDevisionManagementList(params).then((res) => {
        if (this.action === 'edit') {
          if (res.data.records.length > 0 && _this.currentRecord.id != res.data.records[0].id) {
            this.$message.error('名称重复')
            return
          }
          this.doEdit()
        } else if (this.action === 'add') {
          if (res.data.records.length > 0) {
            this.$message.error('名称重复')
            return
          }
          this.doAdd()
        }
      })
    },
    doEdit () {
      // 取数据
      const { id, status, Authorization, departmentName, remarks ,leader,level,type} = this.currentRecord
      // 组装接口需要的数据
      const params = { id: id, status: status, Authorization, departmentName, remarks ,leader,level,type}
      this.loading = true
      departmentModify(params).then((data) => {
        this.$message.info(data.msg)
        this.visible = false
        this.init()
      }).catch(error => {
        this.loading = false
        console.error(error)
      }).finally(() => {
        this.loading = false
      })
    },
    doAdd () {
      // 取数据
      const { status, Authorization, departmentName, remarks, parentId ,leader,level,type} = this.currentRecord
      // 组装接口需要的数据
      const params = { parentId, status: status, Authorization, departmentName, remarks ,leader,level,type}
      console.log('新增部门参数：', params)
      this.loading = true
      departmentAdd(params).then((res) => {
        this.$message.info(res.msg)
        this.visible = false
        this.init()
      }).catch(error => {
        this.loading = false
        console.error(error)
      }).finally(() => {
        this.loading = false
      })
    },
    /**
       * 选中树节点触发
       * @param selectedKeys
       * @param selected
       * @param node
       * 参数的解构赋值
       */
    onSelect (selectedKeys, { selected, node }) {
      this.$set(this.queryParam, 'parentId', selectedKeys[0])
      console.log('选择下拉的parentId', this.parentId)
      this.$refs.table.refresh(true)
      this.parentId = selectedKeys[0]
      this.getList()
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
    },
    onExpand () {
      console.log('Trigger Expand')
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
      const { id, departmentName, remarks } = record
      const params = { id, status, Authorization: this.token, departmentName, remarks }
      departmentModify(params).then((data) => {

      }).catch(error => {

      })
    },

    // 修改单选启用禁用按钮
    radioChange (e) {
      console.log('单选改变 checked', e.target.value)
    },
    openSystemUsers(decoratorKey){
      this.$refs.systemUserSelect.query(decoratorKey)
    },
    selectSystemUsers({decoratorKey,record}){
      console.log(decoratorKey,record)
      if(record){
        if(decoratorKey === 'currentRecord.leaderName'){
          this.currentRecord.leader = record.id
          this.currentRecord.leaderName = record.trueName
        }
      }
    },

  }
}
</script>

<style lang="less" scoped>
  .search {
    margin-bottom: 54px;
  }

  .fl-r {
    float: right;
  }
  .fold {
    width: calc(100% - 216px);
    display: inline-block
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
