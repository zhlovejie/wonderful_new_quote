<template>
  <a-card :bordered="false">
    <!--div中可以写搜索条件，和功能按键-->
    <div class="description-document-search-wrapper">
      <a-form layout="inline">
        <a-form-item>
          <a-cascader
            v-model="territory"
            :options="birthplaceOptions"
            @change="birthplaceCascaderChange"
            :loadData="birthplaceCascaderLoadData"
            placeholder="选择区域"
          />
        </a-form-item>
        <a-form-item>
          <a-input v-model.trim="queryParam.networkParameter" allowClear placeholder="网点编号/网点名称" />
        </a-form-item>
        <a-form-item>
          <a-input v-model.trim="queryParam.serviceUserParameter" allowClear placeholder="业务员/业务员手机号" />
        </a-form-item>
        <a-form-item>
          <a-select placeholder="营业执照" v-model="queryParam.isBusinessLicenseUrl" allowClear style="width: 200px">
            <a-select-option :value="0">有</a-select-option>
            <a-select-option :value="1">没有</a-select-option>
          </a-select>
        </a-form-item>
        <template>
          <a-form-item>
            <a-button type="primary" @click="searchAction">查询</a-button>
          </a-form-item>
        </template>
        <div class="action-wrapper" style="float: right">
          <a-form-item>
            <template v-if="$auth('enterprise:add')">
              <a-button type="primary" icon="plus" @click="handleAdd('add', null)">新增</a-button>
            </template>
          </a-form-item>
        </div>
      </a-form>
    </div>
    <div>
      <a-tabs defaultActiveKey="0" @change="paramClick">
        <a-tab-pane tab="我提交的" :key="0" forceRender> </a-tab-pane>

        <template v-if="$auth('enterprise:approval')">
          <a-tab-pane tab="待我审批" :key="1"> </a-tab-pane>
          <a-tab-pane tab="我已审批" :key="2"> </a-tab-pane>
        </template>
      </a-tabs>
      <s-table ref="table" size="default" rowKey="id" :columns="columns" :data="loadData" :alert="false">
        <div slot="order" slot-scope="text, record, index">
          <span>{{ index + 1 }}</span>
        </div>
        <div slot="businessLicenseUrl" slot-scope="text, record, index">
          <span>{{ text ? '有' : '没有' }}</span>
        </div>
        <div slot="networkType" slot-scope="text, record, index">
          <span>{{ text === 0 ? '个人' : '企业' }}</span>
        </div>
        <div slot="status" slot-scope="text, record">
          <a @click="handleClick(record)">{{
            { 1: '待审批 ', 2: '通过', 3: '不通过', 4: '已撤回' }[text] || '未知'
          }}</a>
        </div>
        <div slot="serviceUser" slot-scope="text, record, index">
          <span>{{ record.serviceUserVoList[0].serviceUserName }}</span>
        </div>

        <div slot="contactInformation" slot-scope="text, record, index">
          <span>{{ record.serviceUserVoList && record.serviceUserVoList[0].serviceUserName }}</span>
        </div>
        <div slot="tutorialVideo" slot-scope="text, record, index">
          <a-button v-if="text" type="link" @click="tutorialClick(text)">查看</a-button>
        </div>
        <span slot="action" slot-scope="text, record">
          <template v-if="$auth('enterprise:view')">
            <a @click="handleAdd('view', record)">查看</a>
          </template>
          <template v-if="queryParam.searchStatus === 0">
            <template
              v-if="
                userInfo.id === record.createdId &&
                $auth('enterprise:edit' && (+record.status === 3 || +record.status === 4))
              "
            >
              <a-divider type="vertical" />
              <a @click="handleAdd('edit', record)">修改</a>
            </template>
            <template v-if="userInfo.id === record.createdId && record.status === 1 && $auth('enterprise:reback')">
              <a-divider type="vertical" />
              <a-popconfirm title="确认撤回该条数据吗?" @confirm="() => doAction('reback', record)">
                <a type="primary" href="javascript:;">撤回</a>
              </a-popconfirm>
            </template>
            <template
              v-if="
                $auth('enterprise:del') &&
                userInfo.id === record.createdId &&
                (+record.status === 3 || +record.status === 4)
              "
            >
              <a-divider type="vertical" />

              <a class="delete" @click="() => del(record)">删除</a>
            </template>
          </template>
          <template v-if="queryParam.searchStatus === 1">
            <a-divider type="vertical" />
            <a @click="handleAdd('approval', record)">审批</a>
          </template>
        </span>
      </s-table>
    </div>

    <modal ref="modal" @ok="handleSaveOk" @close="handleSaveClose" />
    <ApproveInfo ref="approveInfoCard" />
  </a-card>
</template>

<script>
import { enterpriseNetworkPage, revocationEnterpriseNetwork, delNetworkManagement } from '@/api/after-sales-management'
import { getAreaByParent } from '@/api/common'
import ApproveInfo from '@/components/CustomerList/ApproveInfo'
import { queryCode } from '@/api/workBox'

import { STable } from '@/components'
import Modal from './modules/addForm'

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
    title: '网点编号',
    key: 'networkNum',
    dataIndex: 'networkNum',
  },
  {
    align: 'center',
    title: '网点名称',
    key: 'networkName',
    dataIndex: 'networkName',
  },
  {
    align: 'center',
    title: '区域',
    key: 'territoryName',
    dataIndex: 'territoryName',
  },
  {
    align: 'center',
    title: '业务员',
    key: 'serviceUser',
    scopedSlots: { customRender: 'serviceUser' },
  },
  {
    align: 'center',
    title: '业务员电话',
    key: 'contactInformation',
    scopedSlots: { customRender: 'contactInformation' },
  },
  {
    align: 'center',
    title: '营业执照',
    key: 'businessLicenseUrl',
    dataIndex: 'businessLicenseUrl',
    scopedSlots: { customRender: 'businessLicenseUrl' },
  },
  {
    title: '状态',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' },
  },
  {
    align: 'center',
    title: '提交人',
    key: 'createdName',
    dataIndex: 'createdName',
  },
  {
    align: 'center',
    title: '提交时间',
    key: 'createdTime',
    dataIndex: 'createdTime',
  },

  {
    align: 'center',
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' },
  },
]

export default {
  name: 'EnterpriseSynopsis',
  components: {
    STable,
    Modal,
    ApproveInfo,
  },
  data() {
    return {
      birthplaceOptions: [], //籍贯 级联 省市
      visible: false,
      userInfo: this.$store.getters.userInfo,
      // 表头
      columns: columns,
      territory: [],
      Warehouse: [],
      tutorialList: undefined,
      // 查询参数
      queryParam: {
        searchStatus: 0,
      },
      // 初始化加载 必须为 Promise 对象
      loadData: (parameter) => {
        console.log('页面开始加载数据。。。', parameter, this.queryParam)
        return enterpriseNetworkPage(Object.assign(parameter, this.queryParam))
          .then((res) => {
            return res
          })
          .catch((error) => {
            this.loading = false
            console.error(error)
          })
      },
    }
  },
  created() {
    queryCode({ code: 'After_sales_analysis01' })
      .then((res) => {
        this.Warehouse = res.data
      })
      .catch((err) => (this.loading = false))

    this.init()

    // that.$nextTick(() => that.form.setFieldsValue({ areaPlace: _arr }))
  },
  methods: {
    handleClick(record) {
      this.$refs.approveInfoCard.init(record.instanceId)
    },
    searchAction() {
      let arr = this.$_.cloneDeep(this.territory || [])
      this.queryParam.territory = arr.toString()
      this.$refs.table.refresh(true)
    },

    async init() {
      let that = this
      let _areaData = await that.loadAreaAction(100000)
      that.birthplaceOptions = _areaData
    },
    handleSaveClose() {},
    loadAreaAction(pId) {
      const that = this
      return getAreaByParent({ pId: pId })
        .then((res) => {
          //城市
          return res.data.map((item) => {
            return {
              label: item.area,
              value: item.id,
              isLeaf: item.level === 3 ? true : false,
            }
          })
        })
        .catch(function (err) {
          console.log(err)
          return []
        })
    },
    birthplaceCascaderChange(arrSelected) {
      console.log('birthplaceCascaderChange called...')
      console.log(arguments)
    },
    birthplaceCascaderLoadData(selectedOptions) {
      let that = this
      const targetOption = selectedOptions[selectedOptions.length - 1]
      targetOption.loading = true
      getAreaByParent({ pId: targetOption.value })
        .then((res) => {
          //城市
          targetOption.loading = false
          targetOption.children = res.data.map((item) => {
            return {
              label: item.area,
              value: item.id,
              isLeaf: item.level === 3 ? true : false,
            }
          })
          that.birthplaceOptions = [...that.birthplaceOptions]
        })
        .catch(function (err) {
          console.log(err)
        })
    },
    doAction(type, record) {
      let that = this
      if (type === 'reback') {
        revocationEnterpriseNetwork({ id: record.id }).then((res) => {
          that.$message.info(res.msg)
          that.searchAction()
        })
        return
      }
    },
    // 新增
    handleAdd(type, e) {
      this.$refs.modal.query(type, e)
    },

    // 删除
    del(row) {
      const _this = this
      this.$confirm({
        title: '警告',
        content: `真的要删除 ${row.networkName} 吗?`,
        okText: '删除',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
          // 在这里调用删除接口
          delNetworkManagement({ id: row.id })
            .then((data) => {
              if (data.code == 200) {
                _this.$message.success('删除成功')
                _this.$refs.table.refresh(true)
              } else {
                _this.$message.error(data.msg)
              }
            })
            .catch(() => {
              // Do something
            })
        },
        onCancel() {
          console.log('Cancel')
        },
      })
    },
    paramClick(key) {
      this.queryParam = { ...this.queryParam, searchStatus: key }
      this.handleSaveOk()
    },
    handleSaveOk() {
      this.$refs.table.refresh(true)
    },
  },
}
</script>

<style scoped>
</style>
