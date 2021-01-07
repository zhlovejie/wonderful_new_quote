<template>
  <div class="adjust-apply-list-wrapper">
    <div class="search-wrapper">
      <a-input
        class="main-items"
        style="width: 200px; margin-right: 10px"
        placeholder="设备名称"
        allowClear
        v-model="queryParam.gateName"
      />
      <a-input
        class="main-items"
        style="width: 200px; margin-right: 10px"
        placeholder="主板号"
        allowClear
        v-model="queryParam.mainBoardNo"
      />
      <a-button
        class="a-button"
        type="primary"
        style="position: relative; top: -1px"
        icon="search"
        @click="searchAction({ current: 1 })"
        >查询</a-button
      >
    </div>
    <div class="main-wrapper">
      <a-table
        :columns="columns"
        :dataSource="dataSource"
        :pagination="pagination"
        :loading="loading"
        v-if="$auth('GateequipmentList:list')"
        @change="handleTableChange"
      >
        <div slot="order" slot-scope="text, record, index">
          <span>{{ index + 1 }}</span>
        </div>
        <div class="action-btns" slot="action" slot-scope="text, record">
          <template v-if="$auth('GateequipmentList:opening')">
            <a @click="doAction('opening', record)">远程开门</a></template
          >
          <template v-if="$auth('GateequipmentList:modify')">
            <a-divider type="vertical" /><a @click="doAction('modify', record)">修改</a> </template
          ><template v-if="$auth('GateequipmentList:jurisdiction')">
            <a-divider type="vertical" /> <a @click="doAction('jurisdiction', record)">权限</a></template
          >
          <template v-if="$auth('GateequipmentList:jurisdiction')">
            <a-divider type="vertical" /> <a @click="doAction('jurisdictionDetail', record)">权限详情</a></template
          >
        </div>
      </a-table>
    </div>

    <a-modal v-model="visible" title="修改" ok-text="确认" cancel-text="取消" @ok="hideModal">
      <a-form :form="form" class="becoming-form-wrapper" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
        <a-form-item label="门闸设备名称" style="margin-left: 50px">
          <a-input
            style="width: 230px"
            placeholder="门闸设备名称"
            v-decorator="[
              'gateName',
              { initialValue: recordId.gateName, rules: [{ required: true, message: '门闸设备名称不能为空' }] },
            ]"
          />
        </a-form-item>
        <a-form-item label="设备位置" style="margin-left: 50px">
          <a-input
            style="width: 230px"
            placeholder="设备位置"
            v-decorator="[
              'deviceAddress',
              { initialValue: recordId.deviceAddress, rules: [{ required: true, message: '设备位置' }] },
            ]"
          />
        </a-form-item>
      </a-form>
    </a-modal>
    <Jurisdiction ref="jurisdiction" />
    <DetailsAuthority ref="detailsAuthority" />
  </div>
</template>
<script>
import { GateEquipment, GateEquipmentUpdate, GatelistOpen } from '@/api/accessControl'
import Jurisdiction from './Jurisdiction'
import DetailsAuthority from './DetailsAuthority'
import moment from 'moment'
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
    title: '门闸设备名称',
    dataIndex: 'gateName',
    key: 'gateName',
  },
  {
    align: 'center',
    title: '主板号',
    key: 'mainBoardNo',
    dataIndex: 'mainBoardNo',
  },
  {
    align: 'center',
    title: '设备位置',
    key: 'deviceAddress',
    dataIndex: 'deviceAddress',
  },
  {
    align: 'center',
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' },
  },
]

export default {
  name: 'NoticeList',
  components: {
    Jurisdiction,
    DetailsAuthority,
  },
  data() {
    return {
      visible: false,
      queryParam: { current: 1 },
      form: this.$form.createForm(this, { name: 'do_becoming' }),
      pagination: {
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: (total) => `共有 ${total} 条数据`, //分页中显示总的数据
        onShowSizeChange: (current, pageSize) => ((this.pagination1.size = pageSize), this.searchAction()),
      },
      status: '',
      depId: '',
      activeKey: 0,
      departmentList: [],
      rule_List: [],
      recordId: {},
      approval_status: undefined,
      depSelectDataSource: [],
      columns: columns,
      dataSource: [],
      userInfo: this.$store.getters.userInfo, // 当前登录人
      loading: false,
      whole: true,
    }
  },
  computed: {},
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'access_office_equipment') {
          this.init()
        }
      },
      immediate: true,
    },
  },
  methods: {
    moment,
    init() {
      let that = this
      that.searchAction()
    },

    searchAction(opt) {
      let that = this
      let _searchParam = Object.assign({}, { ...this.queryParam }, { ...this.pagination1 }, opt || {})
      that.loading = true
      GateEquipment(_searchParam)
        .then((res) => {
          that.loading = false
          that.dataSource = res.data.records.map((item, index) => {
            item.key = index + 1
            return item
          })
          //设置数据总条数
          const pagination = { ...that.pagination }
          pagination.total = res.data.total
          that.pagination = pagination
        })
        .catch((err) => (that.loading = false))
    },
    // 分页
    handleTableChange(pagination, filters, sorter) {
      this.pagination1.size = pagination.pageSize
      this.pagination1.current = pagination.current
      this.searchAction()
    },
    doAction(type, record) {
      if (type === 'opening') {
        GatelistOpen({ mainBoardNo: record.mainBoardNo })
          .then((res) => {
            if (res.code === 200) {
              this.$message.info(res.msg)
            }
          })
          .catch((err) => {})
      }
      if (type === 'modify') {
        this.visible = true
        this.recordId = record
      }
      if (type === 'jurisdiction') {
        this.$refs.jurisdiction.setCheckedNodes(record)
      }
      if (type === 'jurisdictionDetail') {
        this.$refs.detailsAuthority.setCheckedNodes(record)
      }
    },
    hideModal() {
      this.form.validateFields((err, values) => {
        if (!err) {
          values.id = this.recordId.id
          GateEquipmentUpdate(values)
            .then((res) => {
              if (res.code === 200) {
                this.$message.info(res.msg)
                this.visible = false
                this.searchAction()
              }
            })
            .catch((err) => (this.visible = true))
        }
      })
    },
    tabChange(tagKey) {
      this.activeKey = parseInt(tagKey)
      if (this.activeKey !== 0) {
        this.approval_status = undefined
      }
      //this.$message.info('全部，待审批，审批尚未实现')
      this.searchAction({ current: 1 })
    },
  },
}
</script>
<style scoped>
.adjust-apply-list-wrapper {
  background-color: #fff;
  padding: 10px 20px;
}
.topName {
  top: 230px !important;
}
.main-wrapper {
  margin-top: 20px;
}
</style>
