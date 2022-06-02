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
            <DepartmentSelect placeholder="部门" style="width: 150px" allowClear :depId.sync="queryParam.applyDepId" />
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
            <a-select placeholder="紧急程度" style="width: 150px" allowClear v-model="queryParam.urgencyDegree">
              <a-select-option :value="1">一般</a-select-option>
              <a-select-option :value="2">加急</a-select-option>
              <a-select-option :value="3">特急</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item>
            <a-button type="primary" icon="search" @click="search({ current: 1 })">查询</a-button>
          </a-form-item>
        </a-form>
      </div>

      <div class="main-wrapper">
        <a-tabs :activeKey="activeKey" :defaultActiveKey="activeKey" @change="tabChange">
          <!-- <template v-if="$auth('requestApplyChange:all')"> -->
          <a-tab-pane tab="我的" :key="1" />
          <a-tab-pane tab="待我审核" :key="2" />
          <a-tab-pane tab="我已审核" :key="3" />
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
          <div slot="order" slot-scope="text, record, index">
            {{ index + 1 }}
          </div>
          <div slot="urgencyDegree" slot-scope="text, record, index">
            {{ { 1: '一般', 2: '加急', 3: '特急' }[text] }}
          </div>

          <div slot="approveStatus" slot-scope="text, record, index">
            <a href="javascript:void(0);" @click="approvalPreview(record)">
              {{ { 1: '待审批', 2: '通过', 3: '不通过', 4: '已撤销', 5: '已驳回' }[text] || '未知状态' }}
            </a>
          </div>

          <div slot="action" slot-scope="text, record, index">
            <a @click="doAction('view', record)">详情</a>
            <template v-if="+activeKey === 1">
              <!--3不通过，4已经撤销，5已被驳回 -->
              <template v-if="[3, 4, 5].includes(+record.approveStatus) && +record.createdId === +userInfo.id">
                <a-divider type="vertical" />
                <a @click="doAction('edit', record)">编辑</a>
                <a-divider type="vertical" />
                <a @click="doAction('del', record)">删除</a>
              </template>
              <template v-if="[1].includes(+record.approveStatus) && +record.createdId === +userInfo.id">
                <a-divider type="vertical" />
                <a @click="doAction('reback', record)">撤回</a>
              </template>
            </template>

            <template v-if="+activeKey === 2">
              <a-divider type="vertical" />
              <a @click="doAction('approval', record)">审批</a>
            </template>
          </div>

          <div slot="materialName" slot-scope="text, record, index">
            <a-popover :title="text" trigger="hover">
              <template slot="content">
                <p>物料名称：{{ record.materialName }}</p>
                <p>物料代码：{{ record.materialCode }}</p>
                <p>规格型号：{{ record.materialModelType }}</p>
                <p>单位：{{ record.unit }}</p>
              </template>
              <a href="javascript:void(0);" @click="doAction('materialView', record)">
                {{ text }}
              </a>
            </a-popover>
          </div>

          <div slot="presentRequestNum" slot-scope="text, record, index">
            <a-popover :title="`${record.materialName}（${record.materialCode}）数量预警`" trigger="hover">
              <template slot="content">
                <p>需求数量：{{ text }}</p>
                <p>安全库存：{{ record.__safetyStock }}</p>
                <p>超安全库存数量：{{ record.__difNum < 0 ? 0 : record.__difNum }}</p>
              </template>
              <template v-if="+record.approveStatus === 1">
                <a-button
                  type="link"
                  @click="doAction('changeQty', record)"
                  :style="{ color: record.__isWarning ? 'red' : '' }"
                  >{{ text }}</a-button
                >
              </template>
              <template v-else>
                <span :style="{ color: record.__isWarning ? 'red' : '' }" style="padding:5px 15px;">{{ text }}</span>
              </template>
            </a-popover>
          </div>

          <div slot="proposerName" slot-scope="text, record, index">
            {{ record.applyDepName }}/{{ record.proposerName }}
          </div>

          <div slot="reason" slot-scope="text, record, index">
            <a-tooltip v-if="String(text).length > 15">
              <template slot="title">{{ text }}</template>
              {{ String(text).slice(0, 15) }}...
            </a-tooltip>
            <span v-else>{{ text }}</span>
          </div>

          <div slot="remark" slot-scope="text, record, index">
            <a-tooltip v-if="String(text).length > 15">
              <template slot="title">{{ text }}</template>
              {{ String(text).slice(0, 15) }}...
            </a-tooltip>
            <span v-else>{{ text }}</span>
          </div>

          <div slot="createdTime" slot-scope="text, record, index">
            {{ record.updateTime || record.createdTime }}
          </div>
        </a-table>
      </div>
      <AddForm ref="addForm" @finish="() => search()" />
      <ChangeQtyForm ref="changeQtyForm" @finish="() => search()" />
      <MaterialView :key="normalAddFormKeyCount" ref="materialView" />
      <ApproveInfo ref="approveInfoCard" />
      <RejectForm ref="rejectForm" @finished="() => search()" />
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
import RejectForm from '../grab/RejectForm'
import { getBuyRequirement } from '@/api/routineMaterial'
import {
  applyChangeAudit,
  applyChangeDetail,
  applyChangePageList,
  applyChangeRevocation,
  applyChangeAddOrUpdate
} from '@/api/procurementModuleManagement'

const columns = [
  {
    title: '序号',
    scopedSlots: { customRender: 'order' },
    width: 80
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
    title: '变更类型',
    dataIndex: 'changeStatusText'
  },
  {
    title: '关联单号',
    dataIndex: 'relatedNum'
  },
  {
    title: '紧急程度',
    dataIndex: 'urgencyDegree',
    scopedSlots: { customRender: 'urgencyDegree' },
    width: 120
  },
  {
    title: '需求数量',
    dataIndex: 'presentRequestNum',
    scopedSlots: { customRender: 'presentRequestNum' }
  },
  {
    title: '需求日期',
    dataIndex: 'requestTime'
  },
  {
    title: '申请人',
    dataIndex: 'proposerName',
    scopedSlots: { customRender: 'proposerName' },
    width: 200
  },
  {
    title: '申请原因',
    dataIndex: 'reason',
    width: 200,
    scopedSlots: { customRender: 'reason' }
  },
  {
    title: '审批状态',
    dataIndex: 'approveStatus',
    scopedSlots: { customRender: 'approveStatus' },
    width: 120
  },
  {
    title: '备注',
    dataIndex: 'remark',
    width: 200,
    scopedSlots: { customRender: 'remark' }
  },
  {
    title: '制单人',
    dataIndex: 'createdName',
    width: 120
  },
  {
    title: '制单时间',
    dataIndex: 'createdTime',
    scopedSlots: { customRender: 'createdTime' },
    width: 200
  },
  {
    title: '操作',
    scopedSlots: { customRender: 'action' },
    fixed: 'right'
  }
]

export default {
  name: 'procurement-module-management-applychange',
  components: {
    DepartmentSelect,
    CommonDictionarySelect,
    AddForm,
    MaterialView,
    ChangeQtyForm,
    ApproveInfo,
    RejectForm
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
      userInfo: this.$store.getters.userInfo // 当前登录人
    }
  },
  watch: {
    $route: {
      handler: function(to, from) {
        if (to.name === 'procurement-module-management-applychange') {
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
      applyChangePageList(_searchParam)
        .then(res => {
          that.loading = false
          that.dataSource = res.data.records.map((item, index) => {
            item.key = index + 1
            item.requestTime = item.requestTime.slice(0, -3)
            item.changeStatusText = { 1: '需求数量减少', 2: '更换物料代码', 3: '需求数量减少且更换物料代码' }[
              item.changeStatus
            ]
            return item
          })

          that.fillNum()
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

    async fillNum() {
      const that = this
      let arr = that.dataSource.map(item => {
        return new Promise(resolve => {
          getBuyRequirement({ materialId: item.materialId })
            .then(res => {
              let n = 0
              try {
                n = res.data.pageNum || 0
              } catch (e) {
                n = 0
              }
              let dataSource = [...that.dataSource]
              let target = dataSource.find(_item => _item.key === item.key)
              target.__safetyStock = n //安全库存
              target.__difNum = (target.presentRequestNum || 0) - n
              target.__isWarning = (target.presentRequestNum || 0) > n //是否超安全库存
              that.dataSource = dataSource
            })
            .catch(err => {
              console.log(err)
            })
        })
      })

      await Promise.all(arr)
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
      this.queryParam = queryParam
      this.selectedRowKeys = []
      this.selectedRows = []
      this.search({ current: 1 })
    },
    customRowFunction(record) {
      const that = this
    },
    approvalPreview(record) {
      this.$refs.approveInfoCard.init(record.instanceId)
    },
    async betachAction({ promiseList, type }) {
      const that = this
      let result = await Promise.all(promiseList)
      let msgQueue = []
      result.map(res => {
        if (res.out.code !== 200) {
          msgQueue.push(
            that.$createElement(
              'p',
              { style: { color: 'red' } },
              `采购需求单号：${res.in.requestApplyNum} 物料名称：${res.in.materialName} 执行${type}操作失败！错误信息：${res.out.msg}`
            )
          )
        }
      })
      if (msgQueue.length > 0) {
        that.selectedRowKeys = []
        that.selectedRows = []
        that.$warning({
          title: '提示信息',
          content: h => h('div', msgQueue),
          onOk() {
            console.log('OK')
          }
        })
      } else {
        that.$message.info('操作成功')
        that.selectedRowKeys = []
        that.selectedRows = []
        that.search()
      }
      return
    },
    confirmModel(opt) {
      const that = this
      let { title, content, success, attrs } = opt
      that.$confirm({
        title: title || '提示',
        content: h => {
          return h('div', null, content)
        },
        onOk() {
          success && success()
        },
        onCancel() {},
        ...(attrs || {})
      })
      return
    },
    async doAction(type, record) {
      const that = this
      if (['add', 'edit', 'view', 'approval'].includes(type)) {
        that.$refs['addForm'].query(type, { ...record })
        return
      } else if (type === 'reback') {
        that.confirmModel({
          content: '确认撤回该条数据吗?',
          success: () => {
            applyChangeRevocation({ id: record.id })
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
      } else if (type === 'del') {
        that.$message.info(`功能尚未开发...`)
        return
        that.confirmModel({
          content: '删除后无法恢复，请谨慎操作，确认删除该条数据吗?',
          success: () => {
            requestApplyDelete({ id: record.id })
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
        if (!record.materialId) {
          that.$message.info('物料编号未定义')
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
      } else if (type === 'changeQty') {
        // that.$refs['changeQtyForm'].query({ ...record })
        return
      } else if (type === 'cancel') {
        that.confirmModel({
          content: '取消申请后，你可编辑数据后重新提交审核。确认执行取消操作吗?',
          success: () => {
            that.selectedRows = [record]
            let promiseList = that.selectedRows.map(row => {
              return requestApplyRevocation(`id=${row.id}`).then(res => {
                return {
                  in: { ...row },
                  out: res
                }
              })
            })
            that.betachAction({ promiseList, type: '取消申请' })
            return
          }
        })
        return
      } else if (type === 'batchApproval') {
        that.selectedRows = [record]

        return
        let promiseList = that.selectedRows.map(row => {
          return applyChangeAudit({ isAdopt: 0, opinion: '通过', approveId: row.id }).then(res => {
            return {
              in: { ...row },
              out: res
            }
          })
        })
        that.betachAction({ promiseList, type: '审核' })
        return
      } else if (type === 'batchDel') {
        that.selectedRows = [record]
        let promiseList = that.selectedRows.map(row => {
          return requestApplyDelete(`id=${row.id}`).then(res => {
            return {
              in: { ...row },
              out: res
            }
          })
        })
        that.betachAction({ promiseList, type: '删除' })
        return
      } else if (type === 'reject') {
        that.$refs.rejectForm.query({ requestId: record.id })
        return
      }
    }
  }
}
</script>
<style scoped>
.__table-footer-action-wrapper > * {
  margin-right: 10px;
}
</style>
