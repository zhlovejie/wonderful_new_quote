<template>
  <a-card :bordered="false">
    <a-spin :spinning="spinning">
      <div class="search-wrapper">
        <a-form layout="inline">

          <a-form-item>
            <DepartmentSelect allowClear show-search placeholder="选择部门" :depId.sync="queryParam.applyDepartmentId" style="width: 140px" />
          </a-form-item>

          <a-form-item label="选择物料">
            <MaterialFuzzySearch
              style="width:250px;"
              @change="handlerMaterialChange"
            />
          </a-form-item>

          <a-form-item label="审批状态" v-if="+activeKey === 0">
            <a-select style="width: 120px" v-model="queryParam.approveStatus" placeholder="审批状态">
              <a-select-option :value="1">待提交</a-select-option>
              <a-select-option :value="2">待审批</a-select-option>
              <a-select-option :value="3">通过</a-select-option>
              <a-select-option :value="4">不通过</a-select-option>
              <a-select-option :value="5">已撤回</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item label="">
            <a-input-group compact>
              <a-select v-model="queryParam.__type" style="width: 120px">
                <a-select-option value="applyNo">
                  需求单号
                </a-select-option>
                <a-select-option value="productTaskNo">
                  任务单号
                </a-select-option>
                <a-select-option value="materialName">
                  物料名称
                </a-select-option>
              </a-select>
              <a-input style="width: 250px" placeholder="模糊查询" v-model="queryParam.__value" />
            </a-input-group>
          </a-form-item>

          <!-- <a-form-item>
            <a-input placeholder="需求单号模糊查询" v-model="queryParam.applyNo" allowClear style="width: 250px" />
          </a-form-item>

          <a-form-item>
            <a-input placeholder="任务单号模糊查询" v-model="queryParam.productTaskNo" allowClear style="width: 250px" />
          </a-form-item>

          <a-form-item>
            <a-input placeholder="物料名称模糊查询" v-model="queryParam.materialName" allowClear style="width: 250px" />
          </a-form-item> -->

          <a-form-item>
            <a-button type="primary" icon="search" @click="search({ current: 1 })">查询</a-button>
          </a-form-item>

          <a-form-item>
            <a-button type="primary" @click="doAction('add',null)">申请委外加工</a-button>
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

              <template v-if="[3].includes(+record.approveStatus)">
                <a-divider type="vertical" />
                <a-popconfirm
                  title="确定撤回吗？确认撤回的数据可在我的列表中查看、编辑并重新提交审核。"
                  @confirm="doAction('back', record)"
                >
                  <a>撤回</a>
                </a-popconfirm>

                <a-divider type="vertical" />
                <a type="primary" @click="doAction('materialChange', record)">换料</a>

                <a-divider type="vertical" />
                <a type="primary" @click="doAction('technologyChange', record)">变更工艺</a>
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
      <ViewForm ref="viewForm" @ok="handleOK"/>
    </a-spin>
  </a-card>
</template>

<script>
import {
  facinfoneedAdd,
  facinfoneedApprove,
  getCraftFile,
  facinfoneedDetail,
  facinfoneedPageList,
  listMaterialFormChildDetail,
  facinfoneedDelete,
  facinfoneedUpdateCount,
  facinfoneedUpdate,
  facinfoneedWithdraw
} from '@/api/outsourcingManagement'
import AddForm from './modules/AddForm'
import ViewForm from './modules/ViewForm'
import ApproveInfo from '@/components/CustomerList/ApproveInfo'
import CommonDictionarySelect from '@/components/CustomerList/CommonDictionarySelect'
import DepartmentSelect from '@/components/CustomerList/DepartmentSelect'
import MaterialFuzzySearch from '@/components/CustomerList/MaterialFuzzySearch'
const columns = [
  {
    align: 'center',
    title: '序号',
    dataIndex: 'order',
    scopedSlots: { customRender: 'order' }
  },
  {
    align: 'center',
    title: '加工需求单号',
    dataIndex: 'applyCode'
  },
  {
    align: 'center',
    title: '关联任务单',
    dataIndex: 'productTaskNo'
  },
  {
    align: 'center',
    title: '需求时间',
    dataIndex: 'needDate'
  },
  {
    align: 'center',
    title: '成品物料名称',
    dataIndex: 'materialName'
  },
  {
    align: 'center',
    title: '成品物料编码',
    dataIndex: 'materialCode'
  },
  {
    align: 'center',
    title: '加工数量',
    dataIndex: 'processCount',
  },
  {
    align: 'center',
    title: '所需原料中类',
    dataIndex: 'materialKinds',
  },
  {
    align: 'center',
    title: '所需原料数量',
    dataIndex: 'materialCount',
  },
  {
    align: 'center',
    title: '委外工艺工序',
    dataIndex: 'craftCount',
  },
  {
    align: 'center',
    title: '审核状态',
    dataIndex: 'approveStatus',
    scopedSlots: { customRender: 'approveStatus' }
  },
  {
    align: 'center',
    title: '申请人',
    dataIndex: 'applyUserName'
  },
  {
    align: 'center',
    title: '申请车间',
    dataIndex: 'applyDepartmentName'
  },
  {
    align: 'center',
    title: '制单人',
    dataIndex: 'createdName'
  },
  {
    align: 'center',
    title: '制单时间',
    dataIndex: 'createdTime'
  },
  {
    align: 'center',
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'outsourcing-fac-info-need',
  components: {
    AddForm,
    ViewForm,
    ApproveInfo,
    CommonDictionarySelect,
    MaterialFuzzySearch,
    DepartmentSelect
  },
  data() {
    return {
      dataSource: [],
      loading: false,
      queryParam: {
        __type:'applyNo'
      },
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
        if (to.name === 'outsourcing-fac-info-need') {
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
      const {__type,__value} = that.queryParam
      that.queryParam = {
        ...that.queryParam,
        applyNo:undefined,
        productTaskNo:undefined,
        materialName:undefined,
      }
      if(__type && __value){
        that.queryParam = {
          ...that.queryParam,
          [__type]:__value
        }
      }
      let _searchParam = Object.assign({}, { ...that.queryParam }, paginationParam, params)
      that.loading = true
      facinfoneedPageList(_searchParam)
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
        if(type === 'add'){
          that.$refs.addForm.query(type,record)
        }else{
          that.$refs.viewForm.query(type,record)
        }
        return 
      } else if (type === 'back') {
        facinfoneedWithdraw(`idList=${record.id}`)
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
        facinfoneedDelete(`idList=${record.id}`)
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
        facinfoneedDelete(str)
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
      } else if(type === 'materialChange'){
        that.$message.info('功能开发中...')
        return
      }else if(type === 'technologyChange'){
        that.$message.info('功能开发中...')
        return
      }
      else {
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
      this.$refs.approveInfoCard.init(record.instanceId, 'material')
    },
    handlerMaterialChange(item){
       this.queryParam = {
         ...this.queryParam,
         materialId:item ? item.materialId : undefined,
         materialName:item ? item.materialName : undefined,
       }
    }
  }
}
</script>

<style scoped></style>
