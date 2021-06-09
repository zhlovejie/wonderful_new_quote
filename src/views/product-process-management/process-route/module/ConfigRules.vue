<template>
  <a-modal
    :title="modelTitle"
    :width="1050"
    :visible="visible"
    @cancel="handleCancel"
    :footer="null"
    :maskClosable="false"
    :destroyOnClose="true"
  >
    <template v-if="addForm.isDisabled">
      <ConfigRulesView ref="configRulesView"/>
    </template>

    <template v-else>
    <div class="search-wrapper">
      <a-form layout="inline">
        <a-form-item>
          <a-input
            placeholder="设备名称/设备编号模糊查询"
            v-model="searchParam.numORName"
            allowClear
            style="width:220px;"
          />
        </a-form-item>
        <a-form-item>
          <a-input
            placeholder="设备型号"
            v-model="searchParam.devType"
            allowClear
            style="width:180px;"
          />
        </a-form-item>
        <a-form-item>
          <a-input
            placeholder="设备责任人"
            v-model="searchParam.devChargeName"
            allowClear
            style="width:180px;"
          />
        </a-form-item>
        <a-form-item>
          <a-select
            placeholder="状态"
            v-model="searchParam.status"
            allowClear
            style="width: 180px"
          >
            <a-select-option :value="1">在库</a-select-option>
            <a-select-option :value="2">保修中</a-select-option>
            <a-select-option :value="3">报废</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button
            class="a-button"
            type="primary"
            icon="search"
            @click="searchAction({current:1})"
          >查询</a-button>
        </a-form-item>
      </a-form>
    </div>
    <div class="main-wrapper">
      <a-table
        :columns="columns"
        :dataSource="dataSource"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange"
        size="small"
      >
        <div
          slot="order"
          slot-scope="text, record, index"
        >
          <span>{{ index + 1 }}</span>
        </div>
        <div
          slot="status"
          slot-scope="text, record, index"
        >
          <span>{{ text === 1 ? '正常' : text === 2 ? '保修中' : '报废' }}</span>
        </div>

        <div
          slot="devName"
          slot-scope="text, record"
        >
          <a
            href="javascript:void(0);"
            @click="() => doAction(record)"
          >{{text}}</a>
        </div>
      </a-table>
    </div>
    </template>

  </a-modal>
</template>

<script>
import { pageDevelopmentCraftDev,pageDevesaveCraftDev } from '@/api/ProcessManagement'
import ConfigRulesView from './ConfigRulesView'
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
    title: '设备编号',
    dataIndex: 'devNum'
  },
  {
    align: 'center',
    title: '设备名称',
    dataIndex: 'devName',
    scopedSlots: { customRender: 'devName' }
  },
  {
    align: 'center',
    title: '设备型号',
    dataIndex: 'devType'
  },
  {
    align: 'center',
    title: '设备负责人',
    dataIndex: 'devChargeName'
  },
  {
    align: 'center',
    title: '安装位置',
    dataIndex: 'installPosition'
  },
  {
    align: 'center',
    title: '设备状态',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' }
  }
]

export default {
  inject: ['addForm'],
  components:{
    ConfigRulesView
  },
  data() {
    return {
      visible: false,
      columns: columns,
      dataSource: [],
      loading: false,
      pagination: {
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: total => `共有 ${total} 条数据`, //分页中显示总的数据
        onShowSizeChange: this.onShowSizeChangeHandler
      },
      searchParam: {}
    }
  },
  computed:{
    modelTitle(){
      return `${this.addForm.modalTitle}操作规程`
    }
  },
  methods: {
    query() {
      const that = this
      that.visible = true

      that.$nextTick(() => {
        if(that.addForm.isDisabled){
          let deviceId = that.addForm.form.deviceId
          if(deviceId && that.$refs.configRulesView){
            that.$refs.configRulesView.query(deviceId)
          }
        }else{
          that.searchAction()
        }
      })

    },
    handleCancel() {
      this.visible = false
    },
    searchAction(opt = {}) {
      let that = this
      let paginationParam = {
        current: that.pagination.current || 1,
        size: that.pagination.pageSize || 10,
      }
      let _searchParam = Object.assign({}, { ...this.searchParam }, opt, paginationParam)
      that.loading = true
      pageDevelopmentCraftDev(_searchParam)
        .then((res) => {
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
        .catch((err) => (that.loading = false))
    },
    // 分页
    handleTableChange(pagination, filters, sorter) {
      this.pagination = { ...this.pagination, current: pagination.current }
      this.searchAction()
    },
    onShowSizeChangeHandler(current, pageSize) {
      this.pagination = { ...this.pagination, current, pageSize }
    },
    async doAction(record) {
      const that = this
      //检测该设备是否有操作规程
      let case1 = await pageDevesaveCraftDev({ id:record.id }).then((res) => {
        if(res && res.data && res.data.equipmentOperations && Array.isArray(res.data.equipmentOperations)){
          return res.data.equipmentOperations.length > 0
        }
        return false
      })
      if(!case1){
        // let {devNum,devName,devType} = record
        // let __msg = `${}`
        that.$message.info('该设备无相关操作规程，请及时维护设备信息！')
        return
      }else{
        that.$emit('change', record)
        that.handleCancel()
      }
    }
  }
}
</script>

<style scoped>
</style>
