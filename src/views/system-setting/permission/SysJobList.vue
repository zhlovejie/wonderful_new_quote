<template>
  <a-card :bordered="false">
    <a-form layout="inline">
      <a-form-item label="任务名称">
        <a-input v-model.trim="queryParam.jobName" />
      </a-form-item>
      <a-form-item label="任务组">
        <a-input v-model.trim="queryParam.jobGroup"  />
      </a-form-item>
      <a-form-item label="bean名称">
        <a-input v-model.trim="queryParam.beanName"  />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
        <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
        <a-button v-if="$auth('sysJob:list')" style="margin-left: 8px" type="primary" @click="doAllJob('pause')">暂停全部</a-button>
        <a-button v-if="$auth('sysJob:list')" style="margin-left: 8px" type="primary" @click="doAllJob('resume')">启动全部</a-button>
        <a-button v-if="$auth('sysJob:add')" style="margin-left: 8px" type="primary" @click="handleAdd">新增</a-button>
      </a-form-item>
    </a-form>
    <!--<template v-if="$auth('sysJob:list')">
      <a-form-item>
        <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
        <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
        <a-button style="margin-left: 8px" type="primary" @click="doAllJob('pause')">暂停全部</a-button>
        <a-button style="margin-left: 8px" type="primary" @click="doAllJob('resume')">启动全部</a-button>
      </a-form-item>
    </template>-->
   <!-- <template v-if="$auth('sysJob:add')">
      <a-button type="primary" icon="plus" @click="handleAdd">新增</a-button>
    </template>-->
      <!--<template v-if="$auth('accountBank:one')">
        <a-button type="primary" icon="download" @click="exportToExcel">导出</a-button>
      </template>-->

    <a-layout>
      <!--  此处编写表单中的功能按钮    -->
      <a-layout-content>
        <s-table
          ref="table"
          size="default"
          rowKey="id"
          :columns="columns"
          :data="loadData"
          :alert="false"
          :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        >
          <div slot="order" slot-scope="text, record, index">
            <span>{{ index + 1 }}</span>
          </div>
          <div slot="status" slot-scope="text, record, index">
            <span v-if="text == 1">运行中</span>
            <span v-else>暂停</span>
          </div>
          <div slot="remarks" slot-scope="text, record, index">
            <p style="width:180px;text-align: left;word-break: break-all;">{{text}}</p>
          </div>

          <span slot="action" slot-scope="text, record">
            <template v-if="$auth('sysJob:one')">
              <a @click="query(record)">查看详情</a>
            </template>
            <template v-if="$auth('sysJob:edit')">
              <a-divider type="vertical"/>
              <a @click="handleEdit(record)">编辑</a>
            </template>
            <template v-if="record.status == 1">
              <a-divider type="vertical"/>
              <a @click="doOneJob('pause',record)">暂停</a>
            </template>
            <template v-if="record.status == 0">
              <a-divider type="vertical"/>
              <a @click="doOneJob('resume',record)">启动</a>
            </template>
            <template v-if="$auth('sysJob:del')">
              <a-divider type="vertical"/>
              <a class="delete" @click="() => delJob(record)">删除</a>
            </template>
          </span>
        </s-table>
      </a-layout-content>
    </a-layout>
    <modal ref="modal" @ok="handleSaveOk" @close="handleSaveClose"/>
    <modal ref="editModal" @ok="handleSaveOk" @close="handleSaveClose"/>
    <modal ref="queryModal" @ok="handleSaveOk" @close="handleSaveClose"/>
  </a-card>
</template>

<script>
import { listPage, del, pauseOne, resumeOne, pauseAll, resumeAll } from '@/api/system/sysJob'
import { STable } from '@/components'
import Modal from './modules/SysJobModal'
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
    title: '任务名称',
    key: 'jobName',
    dataIndex: 'jobName'
  },
  {
    align: 'center',
    title: '任务组',
    dataIndex: 'jobGroup',
    key: 'jobGroup'
  },
  {
    align: 'center',
    title: 'bean名称',
    dataIndex: 'beanName',
    key: 'beanName'
  }, {
    align: 'center',
    title: '方法名称',
    dataIndex: 'methodName',
    key: 'methodName'
  },
  // {
  //   align: 'center',
  //   title: '参数信息',
  //   key: 'methodParams',
  //   dataIndex: 'methodParams'
  // },
  {
    align: 'center',
    title: '备注',
    dataIndex: 'remarks',
    scopedSlots: { customRender: 'remarks' }
  },
  {
    align: 'center',
    title: 'cron表达式',
    key: 'cronExpression',
    dataIndex: 'cronExpression'
  },
  {
    align: 'center',
    title: '任务状态',
    key: 'status',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' }
  },
  {
    align: 'center',
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  name: 'SysJob',
  components: {
    STable,
    Modal
  },
  data () {
    return {
      // 查询参数
      queryParam: {},
      selectedRowKeys: [],
      selectedRows: [],
      // 表头
      columns: columns,
      // 初始化加载 必须为 Promise 对象
      loadData: parameter => {
        console.log('页面开始加载数据。。。', parameter, this.queryParam)
        return listPage(Object.assign(parameter, this.queryParam))
          .then(res => {
            return res
          }).catch(error => {
            this.loading = false
            console.error(error)
          })
      }
    }
  },
  methods: {
    // 新增
    handleAdd () {
      this.$refs.modal.add()
    },
    // 修改详情
    handleEdit (e) {
      this.$refs.editModal.edit(e)
    },
    // 详情
    query (e) {
      this.$refs.queryModal.query(e)
    },
    // 删除
    delJob (record) {
      const _this = this
      this.$confirm({ title: '警告',
        content: `真的要删除当前任务吗?`,
        okText: '删除',
        okType: 'danger',
        cancelText: '取消',
        onOk () {
          // 在这里调用删除接口
          del(`quartzId=${record.id}`).then(data => {
            if (data.code == 200) {
              _this.$message.success('删除成功')
              _this.$refs.table.refresh(true)
            } else {
              _this.$message.error(data.msg)
            }
          }).catch(() => {
            // Do something
          })
        },
        onCancel () {
          console.log('Cancel')
        }
      })
    },
    // 删除
    doAllJob (actionType) {
      const _this = this
      // 在这里调用暂停接口
      if (actionType === 'pause') {
        //meetingRecordCancel(`id=${record.id}`)
        pauseAll().then(data => {
          if (data.code == 200) {
            _this.$message.success('暂停全部任务成功')
            _this.$refs.table.refresh(true)
          } else {
            _this.$message.error(data.msg)
          }
        }).catch(() => {
          // Do something
        })
      } else if (actionType === 'resume') {
        resumeAll().then(data => {
          if (data.code == 200) {
            _this.$message.success('启动全部任务成功')
            _this.$refs.table.refresh(true)
          } else {
            _this.$message.error(data.msg)
          }
        }).catch(() => {
          // Do something
        })
      }
    },
    // 修改详情
    doOneJob (actionType, record) {
      // debugger
      const _this = this
      // 在这里调用暂停接口
      if (actionType === 'pause') {
        //meetingRecordCancel(`id=${record.id}`)
        pauseOne(`quartzId=${record.id}`).then(data => {
          if (data.code == 200) {
            _this.$message.success('暂停成功')
            _this.$refs.table.refresh(true)
          } else {
            _this.$message.error(data.msg)
          }
        }).catch(() => {
          // Do something
        })
      } else if (actionType === 'resume') {
        resumeOne(`quartzId=${record.id}`).then(data => {
          if (data.code == 200) {
            _this.$message.success('启动成功')
            _this.$refs.table.refresh(true)
          } else {
            _this.$message.error(data.msg)
          }
        }).catch(() => {
          // Do something
        })
      }

    },
    formatJson (filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    handleSaveOk () {
      this.$refs.table.refresh(true)
    },
    handleSaveClose () {

    },
    handleEditOk () {
      this.$refs.table.refresh(true)
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      console.log('onSelectChange 点击了')
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
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
