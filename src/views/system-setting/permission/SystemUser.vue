<template>
  <a-card :bordered="false">
    <a-form layout="inline" :form="form">
      <a-form-item label="工号">
        <a-input v-model="jobNum" />
      </a-form-item>
      <a-form-item label="姓名">
        <a-input v-model="trueName" />
      </a-form-item>
      <a-form-item label="手机号">
        <a-input v-model="mobile" />
      </a-form-item>
      <a-form-item label="部门">
        <a-select style="width: 150px" v-model="selectedDepartment">
          <a-select-option :value="0">请选择</a-select-option>
          <a-select-option v-for="val in department" :key="val.id" :value="val.id">{{ val.departmentName }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item>
        <template v-if="$auth('user:list')">
          <a-button type="primary" icon="search" @click="search">查询</a-button>
        </template>
      </a-form-item>
      <!-- <template v-if="$auth('user:add')">
        <a-button type="primary" style="float: right" icon="plus" @click="handleAdd()">新建用户</a-button>
      </template> -->
    </a-form>
    <a-layout>
      <a-layout>
        <a-layout-content>
          <s-table ref="table" size="default" :columns="columns" :data="loadData" :alert="false">
            <div slot="order" slot-scope="text, record, index">
              <span>{{ index + 1 }}</span>
            </div>
            <div slot="states" slot-scope="text, record">
              <template v-if="$auth('user:edit')">
                <a-switch
                  @click="changeStatue(text,record,&quot;&quot;)"
                  checkedChildren="启用"
                  :checked="(text === 0) ? true : false"
                  unCheckedChildren="禁用"
                />
              </template>
              <template v-if="!$auth('user:edit')">
                <span v-if="text === 0">启用</span>
                <span v-if="text === 1">禁用</span>
              </template>
            </div>
            <div slot="sexs" slot-scope="text, record">
              <div v-if="text === 1">男</div>
              <div v-else>女</div>
            </div>
            <div slot="positionStatuss" slot-scope="text, record">
              <span>{{getUserStatusTxt(text)}}</span>
            </div>
            <div slot="action" slot-scope="text, record">
              <template v-if="$auth('user:reset')">
                <a @click="resetPassword(record)">重置密码</a>
                <a-divider type="vertical" />
              </template>
              <template v-if="$auth('user:one')">
                <a @click="handleSee(record)">查看</a>
                <a-divider type="vertical" />
              </template>
              <!-- <template v-if="$auth('user:edit')">
                <a @click="handleEdit(record)">编辑</a>
                <a-divider type="vertical" />
              </template>
              <template v-if="$auth('user:del')">
                <a @click="del(record)">删除</a>
              </template> -->
            </div>
          </s-table>
        </a-layout-content>
      </a-layout>
    </a-layout>
    <user-modal ref="modal" @ok="handleSaveOk" @close="handleSaveClose" />
    <!-- <user-see ref="see" @ok="handleSaveOk" @close="handleSaveClose" /> -->
    <UserSeeNew ref="userSeeNew" />
  </a-card>
</template>

<script>
import { getDevisionList, getUserList, modifyStatus , initializePassword} from '../../../api/systemSetting'
import moment from 'moment'
import { STable } from '@/components'
import UserModal from './modules/UserModal'
// import UserSee from './modules/UserSee'

import UserSeeNew from './modules/UserSeeNew'

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
    title: '工号',
    dataIndex: 'jobNum',
    key: 'jobNum'
  },
  {
    align: 'center',
    title: '姓名',
    dataIndex: 'trueName',
    key: 'trueName'
  },
  {
    align: 'center',
    title: '性别',
    dataIndex: 'sex',
    // key: 'sex',
    key: 'sexs',
    scopedSlots: { customRender: 'sexs' }
  },
  {
    align: 'center',
    title: '用户名',
    dataIndex: 'userName',
    key: 'userName'
  },
  {
    align: 'center',
    title: '手机号',
    dataIndex: 'mobile',
    key: 'mobile'
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
    dataIndex: 'station.stationName',
    key: 'station.stationName'
  },
  {
    align: 'center',
    title: '微信号',
    dataIndex: 'wxNum',
    key: 'wxNum'
  },
  {
    align: 'center',
    title: 'qq号',
    dataIndex: 'qqNum',
    key: 'qqNum'
  },
  {
    align: 'center',
    title: '员工状态',
    dataIndex: 'positionStatus',
    key: 'positionStatuss',
    scopedSlots: { customRender: 'positionStatuss' }
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
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

const data = []
export default {
  name: 'SystemUser',
  components: {
    //UserSee,
    UserSeeNew,
    UserModal,
    STable
  },
  data () {
    return {
      data: data,
      columns: columns,
      pagination: {},
      loading: false,
      visible: false,
      formLayout: 'horizontal',
      form: this.$form.createForm(this),
      department: [],
      currentRecord: {},
      dialogTitle: '修改部门',
      status: 0,
      jobNum: '', // 搜索栏
      trueName: '', // 搜索栏
      mobile: '', // 搜索栏
      selectedDepartment: 0, // 搜索栏
      entryDate: moment(), // 入职日期, 默认今天
      // 部门列表
      departmentList: [],
      // 选择的部门
      selectedDepartmentId: 0,
      // 岗位列表
      stationList: [],
      // 选择的岗位
      selectedStationId: 0,
      queryParam: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getUserList(Object.assign(parameter, this.queryParam)).then(res => {
          return res
        })
      }
    }
  },
  mounted () {
    this.getList({})
    getDevisionList()
      .then(data => {
        this.department = data.data
      })
      .catch(error => {
        this.loading = false
        console.error(error)
      })
  },
  methods: {
    search () {
      if (this.trueName != '') {
        this.$set(this.queryParam, 'trueName', this.trueName)
      } else {
        this.$set(this.queryParam, 'trueName', undefined)
      }
      if (this.mobile != '') {
        this.$set(this.queryParam, 'mobile', this.mobile)
      } else {
        this.$set(this.queryParam, 'mobile', undefined)
      }
      if (this.jobNum != '') {
        this.$set(this.queryParam, 'jobNum', this.jobNum)
      } else {
        this.$set(this.queryParam, 'jobNum', undefined)
      }
      if (this.selectedDepartment != 0) {
        this.$set(this.queryParam, 'departmentId', this.selectedDepartment)
      } else {
        this.$set(this.queryParam, 'departmentId', undefined)
      }
      this.$refs.table.refresh(false)
    },
    // 获取用户管理页面列表
    getList (params = {}) {
      params = {
        current: params.current || 1,
        // results: 10,
        size: 8
        // ...params
      }
      if (this.selectedDepartment) {
        params.departmentId = this.selectedDepartment
      }
      if (this.jobNum !== '') {
        params.jobNum = this.jobNum
      }
      if (this.trueName !== '') {
        params.trueName = this.trueName
      }
      if (this.mobile !== '') {
        params.mobile = this.mobile
      }
      this.loading = true
      getUserList(params)
        .then(data => {
          const pagination = { ...this.pagination }
          pagination.total = data.data.total || 200
          this.loading = false
          this.data = data.data.records
          this.pagination = pagination
        })
        .catch(error => {
          this.loading = false
          console.error(error)
        })
    },
    // eslint-disable-next-line
    del (row) {
      const _this = this
      this.$confirm({
        title: '警告',
        content: `真的要删除姓名为 ${row.trueName} 的用户吗?`,
        okText: '删除',
        okType: 'danger',
        cancelText: '取消',
        onOk () {
          console.log('OK')
          // 在这里调用删除接口
          const params = { 'id': row.id, 'isDelete': 1 }
          modifyStatus(params).then(res => {
            if (res.code == 200) {
              _this.$message.success('删除成功')
              _this.$refs.table.refresh(false)
            }
          })
        },
        onCancel () {
          console.log('Cancel')
        }
      })
    },
    resetPassword (row) {
      const _this = this
      this.$confirm({
        title: '警告',
        content: `确定要重置${row.trueName} 的密码?`,
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk () {
          console.log('OK')
          // 在这里调用删除接口
          const params = { 'id': row.id }
          initializePassword(params).then(res => {
            // debugger
            if (res.code == 200) {
              _this.$message.success('重置成功')
              _this.$refs.table.refresh(false)
            } else {
              this.$message.error(res.msg)
            }
          })
        },
        onCancel () {
          console.log('Cancel')
        }
      })
    },
    // 新增
    handleAdd () {
      this.$refs.modal.add()
    },
    // 修改
    handleEdit (e) {
      this.$refs.modal.edit(e)
    },
    // 查看
    handleSee (e) {
      //this.$refs.see.see(e)
      this.$refs.userSeeNew.query('view',e)
    },
    changeStatue (text, record) {
      let status = 0
      if (text == 0) {
        status = 1
      } else {
        status = 0
      }
      record.status = status
      const params = { id: record.id, status: status }
      modifyStatus(params)
        .then(data => {
          if (data.code == 200) {
            this.$message.success('修改成功')
            this.$refs.table.refresh(false)
          }
        })
        .catch(error => {
          console.error(error)
        })
    },
    handleSaveOk () {
      this.$refs.table.refresh(false)
    },
    handleSaveClose () {
    },
    getUserStatusTxt(type){//请选择员工状态
      let map = {
        1:'试用期',
        2:'试用期不通过',
        3:'在职',
        4:'离职'
      }
      try{
        return map[type]
      }catch(err){
        return map['0']
      }
    }
  }
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

.wdf-add {
  margin-top: 14px;
}
</style>
