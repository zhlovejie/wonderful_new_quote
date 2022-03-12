<template>
  <a-card :bordered="false">
    <a-spin :spinning="spinning">
      <div class="search-wrapper">
        <a-form layout="inline">
          <a-form-item label="负面消息等级">
            <a-select style="width: 150px" v-model="queryParam.downsideLevel">
              <a-select-option :value="0">无</a-select-option>
              <a-select-option :value="1">低</a-select-option>
              <a-select-option :value="2">中</a-select-option>
              <a-select-option :value="3">高</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item label="诚信等级">
            <CommonDictionarySelect
              style="width: 150px"
              placeholder="诚信等级"
              :text="'诚信级别'"
              :dictionaryId.sync="queryParam.faithDicId"
            />
          </a-form-item>
          <a-form-item>
            <a-input placeholder="公司代码模糊查询" v-model="queryParam.facInfoCode" allowClear style="width: 250px" />
          </a-form-item>
          <a-form-item>
            <a-input placeholder="公司名称模糊查询" v-model="queryParam.name" allowClear style="width: 250px" />
          </a-form-item>
          <a-form-item label="审批状态" v-if="+activeKey === 0">
            <a-select style="width: 150px" v-model="queryParam.approveStatus">
              <a-select-option :value="1">待提交</a-select-option>
              <a-select-option :value="2">待审批</a-select-option>
              <a-select-option :value="3">通过</a-select-option>
              <a-select-option :value="4">不通过</a-select-option>
              <a-select-option :value="5">已撤回</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" icon="search" @click="search({ current: 1 })">查询</a-button>
          </a-form-item>

          <a-form-item>
            <a-button type="primary" @click="doAction('import',null)">导入</a-button>
          </a-form-item>

          <a-form-item>
            <a-button type="primary" @click="doAction('add',null)">新增供应商</a-button>
          </a-form-item>
        </a-form>
      </div>

      <div class="main-wrapper material-rule-audit-wrapper">
        <a-tabs :activeKey="activeKey" :defaultActiveKey="0" @change="tabChange">
          <a-tab-pane tab="我的" :key="0" />
          <a-tab-pane tab="待我审批" :key="1" />
          <a-tab-pane tab="我已审批" :key="2" />
        </a-tabs>
        <a-table
          :columns="columns"
          :dataSource="dataSource"
          :pagination="pagination"
          :loading="loading"
          @change="handleTableChange"
          :rowSelection="
            +activeKey !== 2 ? { onChange: rowSelectionChangeHnadler, selectedRowKeys: selectedRowKeys } : null
          "
        >
          <div slot="order" slot-scope="text, record, index">
            <span>{{ index + 1 }}</span>
          </div>

          <div slot="downsideLevel" slot-scope="text, record, index">
            <span>{{ { 0: '无', 1: '低', 2: '中', 3: '高' }[text] }}</span>
          </div>

          <div slot="startFlag" slot-scope="text, record, index">
            <a @click="doAction('startFlag', record)">{{ { 0: '未启用', 1: '已启用' }[text] }}</a>
          </div>

          <div slot="approveStatus" slot-scope="text, record, index">
            <a @click="approvalPreview(record)">{{
              { 1: '待提交', 2: '待审批', 3: '通过', 4: '不通过', 5: '已撤回' }[text]
            }}</a>
          </div>

          <div slot="action" slot-scope="text, record, index">
            <a type="primary" @click="doAction('view', record)">详情</a>

            <template v-if="+activeKey === 0">
              <template v-if="[1, 4, 5].includes(+record.approveStatus)">
                <a-divider type="vertical" />
                <a type="primary" @click="doAction('edit', record)">修改</a>
                <a-divider type="vertical" />
                <a-popconfirm
                  title="确定删除吗？，删除操作不可逆，确认删除的数据无法查看。"
                  @confirm="doAction('del', record)"
                >
                  <a>删除</a>
                </a-popconfirm>
              </template>

              <template v-if="[2].includes(+record.approveStatus)">
                <a-divider type="vertical" />
                <a-popconfirm
                  title="确定撤回吗？确认撤回的数据可在我的列表中查看、编辑并重新提交审核。"
                  @confirm="doAction('back', record)"
                >
                  <a>撤回</a>
                </a-popconfirm>
              </template>
            </template>
            <template v-if="+activeKey === 1">
              <a-divider type="vertical" />
              <a type="primary" @click="doAction('approve', record)">审批</a>
            </template>
          </div>

          <div slot="footer" slot-scope="text, record, index">
            <a-button type="primary" :disabled="selectedRows.length === 0" @click="doAction('batchDel')"
              >批量删除</a-button
            >
          </div>
        </a-table>
      </div>
      <ApproveInfo ref="approveInfoCard" />
      <AddForm ref="addForm" @ok="handleOK" />
    </a-spin>
  </a-card>
</template>

<script>
import {
  facInfoPageList,
  facInfoAddOrUpdate,
  facInfoApprove,
  facInfoDetail,
  facInfoImportFacInfoExcel,
  facInfoDelete,
  facInfoStartOrStop,
  facInfoWithdraw
} from '@/api/outsourcingManagement'
import AddForm from './modules/AddForm'
import ApproveInfo from '@/components/CustomerList/ApproveInfo'
import CommonDictionarySelect from '@/components/CustomerList/CommonDictionarySelect'
const columns = [
  {
    align: 'center',
    title: '序号',
    dataIndex: 'order',
    scopedSlots: { customRender: 'order' }
  },
  {
    align: 'center',
    title: '加工商名称',
    dataIndex: 'name'
  },
  {
    align: 'center',
    title: '加工商代码',
    dataIndex: 'facInfoCode'
  },
  {
    align: 'center',
    title: '成立时间',
    dataIndex: 'buildYear'
  },
  {
    align: 'center',
    title: '诚信级别',
    dataIndex: 'faithDicName'
  },
  {
    align: 'center',
    title: '负面消息等级',
    dataIndex: 'downsideLevel',
    scopedSlots: { customRender: 'downsideLevel' }
  },
  {
    align: 'center',
    title: '审核状态',
    dataIndex: 'approveStatus',
    scopedSlots: { customRender: 'approveStatus' }
  },
  {
    align: 'center',
    title: '使用状态',
    dataIndex: 'startFlag',
    scopedSlots: { customRender: 'startFlag' }
  },
  {
    align: 'center',
    title: '提交人',
    dataIndex: 'createdName'
  },
  {
    align: 'center',
    title: '提交时间',
    dataIndex: 'createdTime'
  },
  {
    align: 'center',
    title: '操作',
    dataIndex: 'status',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'outsourcing-fac-info',
  components: {
    AddForm,
    ApproveInfo,
    CommonDictionarySelect
  },
  data() {
    return {
      dataSource: [],
      loading: false,
      queryParam: {},
      activeKey: 0,
      columns,
      selectedRowKeys: [],
      selectedRows: [],

      pagination: {
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: total => `共有 ${total} 条数据`, //分页中显示总的数据
        onShowSizeChange: this.onShowSizeChangeHandler
      },
      spinning: false
    }
  },
  watch: {
    $route: {
      handler: function(to, from) {
        if (to.name === 'outsourcing-fac-info') {
          this.init()
        }
      },
      immediate: true
    }
  },
  methods: {
    init() {
      const that = this
      that.queryParam = { ...that.queryParam, searchStatus: that.activeKey }
      let queue = []
      that.search()
      return Promise.all(queue)
    },
    rowSelectionChangeHnadler(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    search(params = {}) {
      const that = this
      that.selectedRowKeys = []
      that.selectedRows = []

      let paginationParam = {
        current: that.pagination.current || 1,
        size: that.pagination.pageSize || 10
      }
      let _searchParam = Object.assign({}, { ...that.queryParam }, paginationParam, params)
      that.loading = true
      facInfoPageList(_searchParam)
        .then(res => {
          that.loading = false
          that.dataSource = res.data.records.map((item, index) => {
            item.key = index + 1
            return item
          })
          //设置数据总条数
          const pagination = { ...that.pagination }
          pagination.total = res.data.total || 0
          pagination.current = res.data.current || 1
          that.pagination = pagination

          //有两页数据,第二页只有一条数据,删除第二页的一条数据了,界面显示在第一页,但是不显示第一页数据了
          //刷新也不显示数据
          let { current, pages } = res.data
          if (+pages > 0 && +current > +pages) {
            that.pagination = { ...pagination, current: pages }
            that.search()
          }
        })
        .catch(err => {
          that.loading = false
          console.log(err)
        })
    },
    handleTableChange(pagination, filters, sorter) {
      this.pagination = { ...this.pagination, current: pagination.current }
      this.search()
    },
    onShowSizeChangeHandler(current, pageSize) {
      this.pagination = { ...this.pagination, current, pageSize }
    },
    tabChange(tagKey) {
      this.activeKey = +tagKey
      this.queryParam = { ...this.queryParam, searchStatus: this.activeKey }
      this.selectedRowKeys = []
      this.selectedRows = []
      this.search({ current: 1 })
    },
    doAction(type, record) {
      const that = this

      if (type === 'startFlag') {
        // 0禁用 1 启用
        let title = `${+record.startFlag === 0 ? '启用' : '禁用'}提示`
        let content =
          +record.startFlag === 0
            ? '启用后该加工商可以参与委外加工报价及下单'
            : '禁用后该加工商不可参与委外加工报价及下单'
        let operationFlag = +record.startFlag === 0 ? 1 : 0

        that.$confirm({
          title,
          content,
          okText: '确定',
          cancelText: '取消',
          onOk() {
            facInfoStartOrStop({ idList: [record.id], operationFlag })
              .then(res => {
                that.$message.info(res.msg)
                if (res.code === 200) {
                  that.search()
                }
              })
              .catch(err => {
                that.$message.error(err)
              })
          },
          onCancel() {
            console.log('Cancel')
          }
        })
        return
      } else if (['add', 'view', 'edit', 'approve'].includes(type)) {
        that.$refs.addForm.query(type,record)
        return 
      } else if (type === 'back') {
        facInfoWithdraw(`idList=${record.id}`)
          .then(res => {
            that.$message.info(res.msg)
            if (res.code === 200) {
              that.search()
            }
          })
          .catch(err => {
            that.$message.error(err)
          })
        return
      } else if (type === 'del') {
        facInfoDelete(`idList=${record.id}`)
          .then(res => {
            that.$message.info(res.msg)
            if (res.code === 200) {
              that.search()
            }
          })
          .catch(err => {
            that.$message.error(err)
          })
        return
      } else if (type === 'batchDel') {
        let str = that.selectedRows.map(row => `idList=${row.id}`).join('&')
        facInfoDelete(str)
          .then(res => {
            that.$message.info(res.msg)
            if (res.code === 200) {
              that.search()
            }
          })
          .catch(err => {
            that.$message.error(err)
          })
        return
      } else if(type === 'import'){
        that.$message.info('功能开发中...')
        return
      }
    },
    handleOK(){
      this.search()
    },
    // submitAction(opt) {
    //   const that = this
    //   let values = Object.assign({}, opt || {}, { approveId: that.selectedRows[0].id })
    //   that.spinning = true
    //   materialRuleAudit(values)
    //     .then(res => {
    //       that.spinning = false
    //       that.$message.info(res.msg)
    //       if (+res.code === 200) {
    //         that.search()
    //       }
    //     })
    //     .catch(err => {
    //       that.spinning = false
    //       console.log(err)
    //     })
    // },
    // passAction(opt = {}) {
    //   //this.submitAction(Object.assign({}, { isAdopt: 0, opinion: '通过' }, opt || {}))
    //   const that = this
    //   const ids = that.selectedRows.map(item => item.id).join(',')
    //   that.spinning = true
    //   materialRuleAuditBatch(`ids=${ids}`)
    //     .then(res => {
    //       that.spinning = false
    //       that.$message.info(res.msg)
    //       that.search()
    //     })
    //     .catch(err => {
    //       that.spinning = false
    //       that.$message.error(`接口发生错误，错误信息：${err}`)
    //     })
    // },
    // noPassAction() {
    //   this.$refs.approval.query()
    // },
    // opinionChange(opinion) {
    //   //审批意见
    //   this.submitAction({
    //     isAdopt: 1,
    //     opinion: opinion
    //   })
    // },
    approvalPreview(record) {
      this.$refs.approveInfoCard.init(record.instanceId, 'dep')
    }
  }
}
</script>

<style scoped></style>
