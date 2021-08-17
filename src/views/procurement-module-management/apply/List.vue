<template>
  <a-card :bordered="false">
    <a-spin :spinning="spinning">
      <div class="search-wrapper">
        <a-form layout="inline">
          <a-form-item>
            <a-input
              placeholder="需求单号、物料代码、物料名称模糊查询"
              v-model="queryParam.keyword"
              allowClear
              style="width: 300px"
            />
          </a-form-item>
          <a-form-item>
            <DepartmentSelect
              placeholder="部门"
              style="width: 150px"
              allowClear
              :depId.sync="queryParam.applyDepId"
            />
          </a-form-item>
          <a-form-item>
            <CommonDictionarySelect
              placeholder="需求类型"
              style="width: 150px"
              allowClear
              :text="'采购模块-需求类型'"
              :dictionaryId.sync="queryParam.requestType"
            />
          </a-form-item>
          <a-form-item>
            <a-select
              placeholder="紧急程度"
              style="width: 150px"
              allowClear
              v-model="queryParam.urgencyDegree"
            >
              <a-select-option :value="1">一般</a-select-option>
              <a-select-option :value="2">加急</a-select-option>
              <a-select-option :value="3">特急</a-select-option>
            </a-select>
          </a-form-item>

          <!-- <a-form-item v-if="+activeKey === 3">
            <a-select placeholder="审核结果" style="width: 150px" allowClear v-model="queryParam.result">
              <a-select-option :value="1">通过</a-select-option>
              <a-select-option :value="2">不通过</a-select-option>
              <a-select-option :value="3">被驳回</a-select-option>
            </a-select>
          </a-form-item> -->
          <a-form-item>
            <a-button
              type="primary"
              icon="search"
              @click="search({ current: 1 })"
            >查询</a-button>
          </a-form-item>

          <a-form-item style="float:right;">
            <a-button
              type="primary"
              icon="plus"
              @click="doAction('add',null)"
            >新增</a-button>
          </a-form-item>
        </a-form>
      </div>

      <div class="main-wrapper">
        <a-tabs
          :activeKey="activeKey"
          :defaultActiveKey="activeKey"
          @change="tabChange"
        >
          <!-- <template v-if="$auth('requestApply:all')"> -->
          <a-tab-pane
            tab="全部"
            :key="1"
          />

          <a-tab-pane
            tab="待审批"
            :key="2"
          />
          <a-tab-pane
            tab="通过"
            :key="4"
          />
          <a-tab-pane
            tab="不通过"
            :key="5"
          />
        </a-tabs>
        <a-table
          :columns="columns"
          :dataSource="dataSource"
          :pagination="pagination"
          :loading="loading"
          @change="handleTableChange"
          :customRow="customRowFunction"
          :rowSelection="1 ? null : { onChange: rowSelectionChangeHnadler, selectedRowKeys: selectedRowKeys }"
          :scroll="{ x: 2400 }"
        >
          <div
            slot="order"
            slot-scope="text, record, index"
          >
            {{index + 1}}
          </div>
          <div
            slot="urgencyDegree"
            slot-scope="text, record, index"
          >
            {{ {1:'一般',2:'加急',3:'特急'}[text] }}
          </div>

          <div
            slot="approveStatus"
            slot-scope="text, record, index"
          >
            <a href="javascript:void(0);" @click="approvalPreview(record)">
              {{ {1:'待审批',2:'通过',3:'不通过',4:'已撤销',5:'已驳回'}[text] || '未知状态' }}
            </a>
          </div>

          <div
            slot="action"
            slot-scope="text, record, index"
          >

            <template v-if="+activeKey === 1">
              <a @click="doAction('view',record)">查看</a>
              <!--待审批 -->
              <template v-if="+record.approveStatus === 1 && +record.createdId === +userInfo.id">
                <a-divider type="vertical" />
                <a @click="doAction('cancel',record)">取消申请</a>
              </template>

              <!--通过 -->
              <!-- <template v-if="+record.approveStatus === 2">
                <a-divider type="vertical" />
                <a @click="doAction('approval',record)">审批</a>
              </template> -->

              <!--3不通过，4已经撤销，5已被驳回 -->
              <template v-if="[3,4,5].includes(+record.approveStatus) && +record.createdId === +userInfo.id">
                <a-divider type="vertical" />
                <a @click="doAction('edit',record)">编辑</a>
                <a-divider type="vertical" />
                <a @click="doAction('del',record)">删除</a>
              </template>
            </template>

            <template v-if="+activeKey === 2">
              <a @click="doAction('view',record)">查看</a>
              <a-divider type="vertical" />
              <a @click="doAction('approval',record)">审批</a>
            </template>

            <template v-if="+activeKey === 4">
              <a @click="doAction('view',record)">查看</a>
            </template>

            <template v-if="+activeKey === 5 && +record.createdId === +userInfo.id">
              <a @click="doAction('edit',record)">编辑</a>
              <a-divider type="vertical" />
              <a @click="doAction('del',record)">删除</a>
            </template>
          </div>

          <div
            slot="materialName"
            slot-scope="text, record, index"
          >
            <a-popover
              :title="text"
              trigger="hover"
            >
              <template slot="content">
                <p>物料名称：{{record.materialName}}</p>
                <p>物料代码：{{record.materialCode}}</p>
                <p>规格型号：{{record.materialModelType}}</p>
                <p>单位：{{ {1:'支',2:'把',3:'件'}[record.unit] }}</p>
              </template>
              <a
                href="javascript:void(0);"
                @click="doAction('materialView',record)"
              >
                {{text}}
              </a>
            </a-popover>
          </div>

          <div
            slot="requestNum"
            slot-scope="text, record, index"
          >
            <template v-if="+record.approveStatus === 1">
              <a-button
                type="link"
                @click="doAction('changeQty',record)"
              >{{text}}</a-button>
            </template>
            <template v-else>{{text}}</template>
          </div>

          <div
            slot="proposerName"
            slot-scope="text, record, index"
          >
            {{record.applyDepName}}/{{record.proposerName}}
          </div>

          <div
            slot="reason"
            slot-scope="text, record, index"
          >
            <a-tooltip v-if="String(text).length > 15">
              <template slot="title">{{text}}</template>
              {{ String(text).slice(0,15) }}...
            </a-tooltip>
            <span v-else>{{text}}</span>
          </div>

          <div
            slot="remark"
            slot-scope="text, record, index"
          >
            <a-tooltip v-if="String(text).length > 15">
              <template slot="title">{{text}}</template>
              {{ String(text).slice(0,15) }}...
            </a-tooltip>
            <span v-else>{{text}}</span>
          </div>





          <!-- <template
            slot="footer"
            slot-scope="text"
          >
            <div class="__table-footer-action-wrapper">
              <template v-if="+activeKey === 2">
                <a-button
                  :disabled="!btnOneEnabled"
                  @click="doAction('changeQty',{...selectedRows[0]})"
                >调整需求数量</a-button>
                <a-button
                  :disabled="!btnMulEnabled"
                  @click="doAction('cancel',{...selectedRows[0]})"
                >取消申请</a-button>
                <a-button
                  :disabled="!btnMulEnabled"
                  @click="doAction('batchApproval',[...selectedRows])"
                >批量审核</a-button>
              </template>
              <template v-if="+activeKey === 4">
                <a-button
                  :disabled="!btnMulEnabled"
                  @click="doAction('cancel',{...selectedRows[0]})"
                >取消申请</a-button>
              </template>

              <template v-if="+activeKey === 5">
                <a-button
                  :disabled="!btnOneEnabled"
                  @click="doAction('changeQty',{...selectedRows[0]})"
                >调整需求数量</a-button>
                <a-button
                  :disabled="!btnMulEnabled"
                  @click="doAction('batchDel',[...selectedRows])"
                >批量删除</a-button>
                <a-button
                  :disabled="!btnMulEnabled"
                  @click="doAction('batchApproval',[...selectedRows])"
                >批量审核</a-button>
              </template>
            </div>
          </template> -->


        </a-table>
      </div>
      <AddForm ref="addForm" @finish="() => search()" />
      <ChangeQtyForm ref="changeQtyForm" @finish="() => search()" />
      <MaterialView
        :key="normalAddFormKeyCount"
        ref="materialView"
      />
      <ApproveInfo ref="approveInfoCard" />
    </a-spin>
  </a-card>
</template>

<script>
import DepartmentSelect from '@/components/CustomerList/DepartmentSelect'
import CommonDictionarySelect from '@/components/CustomerList/CommonDictionarySelect'
import AddForm from './AddForm'
import ChangeQtyForm from './ChangeQtyForm'
import MaterialView from '@/views/material-management/library/module/NormalAddForm'
import ApproveInfo from '@/components/CustomerList/ApproveInfo'


import {
  requestApplyPageList,
  requestApplyDelete ,
  requestApplyApproval,
  requestApplyRevocation
} from '@/api/procurementModuleManagement'

const columns = [
  {
    title: '序号',
    scopedSlots: { customRender: 'order' },
    width:80
  },
  {
    title: '采购需求单号',
    dataIndex: 'requestApplyNum'
  },
  {
    title: '物料名称',
    dataIndex: 'materialName',
    scopedSlots: { customRender: 'materialName' }
  },
  {
    title: '需求类型',
    dataIndex: 'requestTypeText'
  },
  {
    title: '关联单号',
    dataIndex: 'relatedNum'
  },
  {
    title: '紧急程度',
    dataIndex: 'urgencyDegree',
    scopedSlots: { customRender: 'urgencyDegree' },
    width:120
  },
  {
    title: '需求数量',
    dataIndex: 'requestNum',
    scopedSlots: { customRender: 'requestNum' }
  },
  {
    title: '需求日期',
    dataIndex: 'requestTime'
  },
  {
    title: '申请人',
    dataIndex: 'proposerName',
    scopedSlots: { customRender: 'proposerName' },
    width:200
  },
  {
    title: '申请原因',
    dataIndex: 'reason',
    width:200,
    scopedSlots: { customRender: 'reason' }
  },
  {
    title: '审批状态',
    dataIndex: 'approveStatus',
    scopedSlots: { customRender: 'approveStatus' },
    width:120
  },
  {
    title: '备注',
    dataIndex: 'remark',
    width:200,
    scopedSlots: { customRender: 'remark' }
  },
  {
    title: '制单人',
    dataIndex: 'createdName',
    width:120
  },
  {
    title: '制单时间',
    dataIndex: 'createdTime',
    width:200
  },
  {
    title: '操作',
    scopedSlots: { customRender: 'action' },
    fixed: 'right',
  }
]

export default {
  name: 'procurement-module-management-apply',
  components: {
    DepartmentSelect,
    CommonDictionarySelect,
    AddForm,
    MaterialView,
    ChangeQtyForm,
    ApproveInfo
  },
  data() {
    return {
      dataSource: [],
      loading: false,
      queryParam: {},
      activeKey: 1,
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
      spinning: false,
      normalAddFormKeyCount: 1,
      userInfo: this.$store.getters.userInfo, // 当前登录人
    }
  },
  computed: {
    btnOneEnabled() {
      return this.selectedRows.length === 1
    },
    btnMulEnabled() {
      return this.selectedRows.length > 0
    }
  },
  watch: {
    $route: {
      handler: function(to, from) {
        if (to.name === 'procurement-module-management-apply') {
          this.init()
        }
      },
      immediate: true
    }
  },
  methods: {
    init() {
      const that = this
      that.tabChange(that.activeKey)
    },
    rowSelectionChangeHnadler(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    search(params = {}) {
      const that = this
      that.selectedRowKeys = []
      that.selectedRows = []

      const paginationParam = {
        current: that.pagination.current || 1,
        size: that.pagination.pageSize || 10
      }
      const _searchParam = Object.assign({}, { ...that.queryParam }, paginationParam, params)
      that.loading = true
      requestApplyPageList(_searchParam)
        .then(res => {
          that.loading = false
          that.dataSource = res.data.records.map((item, index) => {
            item.key = index + 1
            item.requestTime = item.requestTime.slice(0, -3)
            return item
          })
          //设置数据总条数
          const pagination = { ...that.pagination }
          pagination.total = res.data.total || 0
          pagination.current = res.data.current || 1
          that.pagination = pagination

          //有两页数据,第二页只有一条数据,删除第二页的一条数据了,界面显示在第一页,但是不显示第一页数据了
          //刷新也不显示数据
          const { current, pages } = res.data
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
      let queryParam = { ...this.queryParam, queryType: this.activeKey }
      if(+tagKey === 4){
        queryParam.queryType = 3
        queryParam.result = 1
      }else if(+tagKey === 5){
        queryParam.queryType = 3
        queryParam.result = 2
      }else{
        queryParam.result = undefined
      }
      this.queryParam = queryParam
      this.selectedRowKeys = []
      this.selectedRows = []
      this.search({ current: 1 })
    },
    customRowFunction(record) {
      const that = this
      const __from = +that.type === 1 ? 'normal' : 'product'
      const { materialId } = record
      return {
        on: {
          dblclick: event => {
            console.log(record)
          }
        }
      }
    },
    approvalPreview(record) {
      this.$refs.approveInfoCard.init(record.instanceId)
    },
    async betachAction({promiseList,type}){
      const that = this
      let result = await Promise.all(promiseList)
      let msgQueue = []
      result.map(res => {
        if(res.out.code !== 200){
          msgQueue.push(that.$createElement('p',{style:{'color':'red'}},`采购需求单号：${res.in.requestApplyNum} 物料名称：${res.in.materialName} 执行${type}操作失败！错误信息：${res.out.msg}`))
        }
      })
      if(msgQueue.length > 0){
        that.selectedRowKeys = []
        that.selectedRows = []
        that.$warning({
          title: '提示信息',
          content: h => h('div',msgQueue),
          onOk() {
            console.log('OK');
          }
        });
      }else{
        that.$message.info('操作成功')
        that.selectedRowKeys = []
        that.selectedRows = []
        that.search()
      }
      return
    },
    confirmModel(opt){
      const that = this
      let {title,content,success,attrs} = opt
      that.$confirm({
        title: title || '提示',
        content: h => {
          return h('div',null,content)
        },
        onOk() {
          success && success()
        },
        onCancel() {
        },
        ...(attrs || {})
      })
      return
    },
    async doAction(type, record) {
      const that = this
      if (['add','edit', 'view', 'approval'].includes(type)) {
        that.$refs['addForm'].query(type, { ...record })
        return
      } else if (type === 'del') {
        that.confirmModel({
          content:'删除后无法恢复，请谨慎操作，确认删除该条数据吗?',
          success:() => {
            requestApplyDelete(`id=${record.id}`)
            .then(res => {
              that.$message.info(res.msg)
              if (+res.code === 200) {
                that.search()
              }
            })
            .catch(err => {
              console.error(err)
              that.$message.error(err)
            })
            return
          }
        })
        return

      } else if (type === 'materialView') {
        if(!record.materialId){
          that.$message.info('物料编号未定义');
          return
        }
        that.normalAddFormKeyCount++
        let reg = /^[0-9\.]+$/g
        let isNormal = reg.test(record.materialCode)
        let __from = isNormal ? 'normal' : 'product'
        that.$nextTick(() => {
          that.$refs['materialView'].query('view', {
            id: record.materialId,
            __from
          })
        })
        return
      } else if(type ==='changeQty'){
        that.$refs['changeQtyForm'].query({ ...record })
        return
      }else if(type === 'cancel'){
        that.confirmModel({
          content:'取消申请后，需求单将在不通过列表中出现，你可编辑数据后重新提交审核。确认执行取消操作吗?',
          success:() => {
            that.selectedRows = [record]
            let promiseList = that.selectedRows.map(row => {
              return requestApplyRevocation(`id=${row.id}`).then(res => {
                return {
                  in:{...row},
                  out:res
                }
              })
            })
            that.betachAction({promiseList,type:'取消申请'})
            return
          }
        })
        return
      }else if(type === 'batchApproval'){
        that.selectedRows = [record]
        let promiseList = that.selectedRows.map(row => {
          return requestApplyApproval({ isAdopt: 0, opinion: '通过' ,approveId:row.id}).then(res => {
            return {
              in:{...row},
              out:res
            }
          })
        })
        that.betachAction({promiseList,type:'审核'})
        return
      }else if(type === 'batchDel'){
        that.selectedRows = [record]
        let promiseList = that.selectedRows.map(row => {
          return requestApplyDelete(`id=${row.id}`).then(res => {
            return {
              in:{...row},
              out:res
            }
          })
        })
        that.betachAction({promiseList,type:'删除'})
        return
      }
    }
  }
}
</script>
<style scoped>
.__table-footer-action-wrapper > *{
  margin-right: 10px;
}
</style>
