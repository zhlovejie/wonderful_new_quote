<template>
  <a-card :bordered="false">
      <a-form layout="inline">
        <a-form-item label="用户名">
          <a-input v-model="username" />
        </a-form-item>
        <a-form-item label="用户操作">
          <a-input v-model="operation" />
        </a-form-item>
        <a-form-item>
          <template v-if="$auth('sysLog:list')">
            <a-button type="primary" icon="search" @click="search">查询</a-button>
          </template>
        </a-form-item>
        <a-form-item label="请选择截止日期"  v-if="$auth('sysLog:delete')">
          <a-date-picker  format="YYYY-MM-DD" v-model="lastTime"/>
        </a-form-item>
        <a-form-item  v-if="$auth('sysLog:delete')">
          <template>
            <a-button type="primary" icon="search" @click="deleteData">删除</a-button>
          </template>
        </a-form-item>
      </a-form>

    <a-layout>
      <!--  此处编写表单中的功能按钮    -->
      <a-layout-content>
        <s-table
          ref="table"
          size="default"
          :columns="columns"
          :data="loadData"
          :alert="false"
          :rowKey="record => record.id"
        >
          <div slot="order" slot-scope="text, record, index">
            <span>{{ index + 1 }}</span>
          </div>

          <template slot="method" slot-scope="text, record, index">
            <div style="width:200px;white-space: normal;word-break: break-all;font-family: Consolas;">{{text}}</div>
          </template>

          <span slot="params" slot-scope="text, record">
              <a @click="showParams(record)">参数</a>
          </span>
        </s-table>
      </a-layout-content>
    </a-layout>
    <SysLogVue ref="SysLogVue"/>
  </a-card>
</template>

<script>
import { getSysLogList,deleteSysLog } from '@api/systemSetting'
import { STable } from '@/components'
import RoleModal from './modules/RoleModal'
import SysLogVue from './modules/SysLogVue'
import RoleTreeModal from './modules/RoleTreeModal'
import moment from 'moment'

export default {
  name: 'RoleManagement',
  components: {
    STable,
    RoleModal,
    RoleTreeModal,
    SysLogVue
  },
  data () {
    return {
      openKeys: ['id'],
      parentId: 0,
      hiddenBoolean: false,
      options: [],
      Selected: '',
      queryParam: {},
      recordResult: {},
      queryRecord: {},
      username:'',
      operation:'',
      lastTime:moment(),
      // 表头
      columns: [
        {
          align: 'center',
          title: '序号',
          key: 'order',
          width: '70px',
          scopedSlots: { customRender: 'order' }
        },
        {
          align: 'center',
          title: '用户名',
          key: 'username',
          dataIndex: 'username'
        },
        {
          align: 'center',
          title: '用户操作',
          dataIndex: 'operation',
          key: 'operation'
        },
        {
          align: 'center',
          title: '请求方法',
          dataIndex: 'method',
          key: 'method',
          scopedSlots: { customRender: 'method' },
          width:200
        },
        {
          align: 'center',
          title: '请求参数',
          key: 'params',
          dataIndex: 'params',
          scopedSlots: { customRender: 'params' }
        },
        /*{
          align: 'center',
          title: '执行时长(毫秒)',
          key: 'time',
          dataIndex: 'time'
        },*/
        {
          align: 'center',
          title: 'IP地址',
          key: 'ip',
          dataIndex: 'ip'
        },
        {
          align: 'center',
          title: '创建时间',
          key: 'createDate',
          dataIndex: 'createDate'
        }
      ],
      // 初始化加载 必须为 Promise 对象
      loadData: parameter => {
        console.log('页面开始加载数据。。。', parameter, this.queryParam)
        return getSysLogList(Object.assign(parameter, this.queryParam))
          .then(res => {
            console.log(res.data)
            return res
          })
      },
      selectedRowKeys: [],
      selectedRows: [],

      // 部门列表
      departmentList: [],
      // 角色列表
      roleList: {}
    }
  },
  methods: {

    // 清空、重置
    emptyQueryParam () {
      this.queryParam = {}
      this.roleList = {}
    },
    searchLog(){
      this.$router.push({ name: 'sysLog' })
    },
    showParams(record){
      console.log("params:" + record.params)
      this.$refs.SysLogVue.qure(record.params,record.oldParams)
    },
    //根据用户名和用户操作条件查询
    search(){
      if (this.username != '') {
        this.$set(this.queryParam, 'username', this.username)
      }
      if (this.operation != '') {
        this.$set(this.queryParam, 'operation', this.operation)
      }
      this.$refs.table.refresh(false)
    },
    deleteData(){
      /*删除截止日期前的日志*/
      const paramStr = {"currTime":this.lastTime.format('YYYY-MM-DD') };
      //deleteSysLog()
      deleteSysLog(paramStr)
        .then(res => {
          console.log(res.data)
          return res
        })
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
