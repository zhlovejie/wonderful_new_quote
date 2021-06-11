<template>
  <!-- 资产保修申请列表 -->
  <div class="wdf-custom-wrapper">
    <div class="search-wrapper">
      <a-input placeholder="设备/模具编号" v-model="searchParam.code" :allowClear="true" style="width: 160px" />
      <a-input placeholder="设备/模具名称" v-model="searchParam.name" :allowClear="true" style="width: 160px" />
      <a-input placeholder="申请人" v-model="searchParam.userName" :allowClear="true" style="width: 160px" />
      <a-select placeholder="单据状态" v-model="searchParam.status" :allowClear="true" style="width: 160px">
        <a-select-option :value="1">待审批</a-select-option>
        <a-select-option :value="2">通过</a-select-option>
        <a-select-option :value="3">不通过</a-select-option>
        <a-select-option :value="4">已撤回</a-select-option>
        <a-select-option :value="5">待完结</a-select-option>
        <a-select-option :value="6">已完结</a-select-option>
      </a-select>

      <a-select placeholder="设备类型" v-model="searchParam.type" :allowClear="true" style="width: 160px">
        <a-select-option :value="1">固定资产</a-select-option>
        <a-select-option :value="2">车间设备</a-select-option>
      </a-select>

      <a-button class="a-button" type="primary" icon="search" @click="searchAction({ current: 1 })">查询</a-button>
    </div>
    <div class="main-wrapper">
      <a-tabs :activeKey="String(activeKey)" defaultActiveKey="0" @change="tabChange">
        <a-tab-pane tab="全部" key="0" />
        <template v-if="$auth('fixList-record:approval')">
          <a-tab-pane tab="待审批" key="1" />
          <a-tab-pane tab="已审批" key="2" />
        </template>
      </a-tabs>
      <a-table
        :columns="columns"
        :dataSource="dataSource"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <div slot="order" slot-scope="text, record, index">
          <span>{{ index + 1 }}</span>
        </div>
        <div slot="type" slot-scope="text, record, index">{{ { 1: '固定资产', 2: '车间设备' }[text] || '未知' }}</div>
        <div slot="emaeceLevel" slot-scope="text, record, index">{{ { 1: '一般', 2: '紧急' }[text] || '未知' }}</div>
        <div slot="status" slot-scope="text, record, index">
          <a href="javascript:void(0);" @click="approvalPreview(record)">{{
            { 1: '待审批', 2: '通过', 3: '不通过', 4: '已撤回', 5: '待完结', 6: '已完结' }[text] || '未知'
          }}</a>
        </div>
        <div slot="certificates" slot-scope="text, record, index">
          <a type="primary" @click="doAction('view_photo', record)">查看</a>
        </div>
        <div class="action-btns" slot="action" slot-scope="text, record">
          <template v-if="+activeKey === 0">
            <template v-if="$auth('fixList-record:view')">
              <a type="primary" @click="doAction('view', record)">查看</a>
            </template>

            <template
              v-if="+record.status === 1 && +record.userId === +userInfo.id && $auth('fixList-record:withdraw')"
            >
              <a-divider type="vertical" />
              <a-popconfirm title="确认撤回该条数据吗?" @confirm="() => doAction('withdraw', record)">
                <a type="primary" href="javascript:;">撤回</a>
              </a-popconfirm>
            </template>
            <template v-if="(+record.status === 3 || +record.status === 4) && +record.createdId === +userInfo.id">
              <a-divider type="vertical" />
              <a type="primary" @click="doAction('edit', record)">修改</a>
            </template>
            <template v-if="+record.status === 2 && $auth('fixList-record:fix')">
              <a-divider type="vertical" />
              <a type="primary" @click="doAction('fix', record)">填写维修方案</a>
            </template>
            <template v-if="+record.status === 5 && $auth('fixList-record:upload')">
              <a-divider type="vertical" />
              <a type="primary" @click="doAction('upload', record)">上传凭证</a>
            </template>
            <template v-if="+record.status === 5 && $auth('fixList-record:over')">
              <a-divider type="vertical" />
              <a-popconfirm title="确认执行完结操作吗?" @confirm="() => doAction('over', record)">
                <a type="primary" href="javascript:;">完结</a>
              </a-popconfirm>
            </template>
          </template>

          <template v-if="+activeKey === 1">
            <a type="primary" @click="doAction('approval', record)">审批</a>
          </template>

          <template v-if="+activeKey === 2">
            <a type="primary" @click="doAction('view', record)">查看</a>
          </template>
        </div>
      </a-table>
      <ApproveInfo ref="approveInfoCard" />
      <FixForm ref="fixForm" @finish="searchAction()" />
      <UploadFileModel ref="uploadFileModel" @finish="searchAction()" />
      <ImgViewList ref="imgViewList" title="预览凭证" />
    </div>
  </div>
</template>

<script>
import {
  pageDevelopmentCraftDevRecoveApply,
  pageDevelopmentgetRevocation,
  pageDevelopmentRevocation,
  pageDevelopmentConcludeRevocation,
} from '@/api/ProcessManagement'

pageDevelopmentCraftDevRecoveApply
import { getDictionaryList } from '@/api/workBox'
import ApproveInfo from '@/components/CustomerList/ApproveInfo'
import FixForm from './modules/FixForm'
import UploadFileModel from './modules/UploadFileModel'
import ImgViewList from '@/components/CustomerList/ImgViewList'
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
    title: '申请部门',
    dataIndex: 'departmentName',
  },
  {
    align: 'center',
    title: '设备/模具编号',
    dataIndex: 'code',
  },
  {
    align: 'center',
    title: '设备/模具名称',
    dataIndex: 'name',
  },
  {
    align: 'center',
    title: '设备类型',
    dataIndex: 'type',
    scopedSlots: { customRender: 'type' },
  },
  {
    align: 'center',
    title: '紧急程度',
    dataIndex: 'emaeceLevel',
    scopedSlots: { customRender: 'emaeceLevel' },
  },
  {
    align: 'center',
    title: '需求时间',
    dataIndex: 'needTime',
  },
  {
    align: 'center',
    title: '单据状态',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' },
  },
  {
    align: 'center',
    title: '凭证',
    scopedSlots: { customRender: 'certificates' },
  },
  {
    align: 'center',
    title: '申请人',
    dataIndex: 'userName',
  },
  {
    align: 'center',
    title: '申请时间',
    dataIndex: 'applyTime',
  },
  {
    align: 'center',
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' },
  },
]

export default {
  name: 'asset-management-record',
  components: {
    ApproveInfo,
    FixForm,
    UploadFileModel,
    ImgViewList,
  },
  data() {
    return {
      columns: columns,
      dataSource: [],
      assetTypeList: [],
      pagination: {
        current: 1,
      },
      searchParam: {},
      loading: false,
      activeKey: 0,
      userInfo: this.$store.getters.userInfo,
    }
  },
  computed: {},
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'product-process-management_equipment-management_fix') {
          this.init()
        }
      },
      immediate: true,
    },
  },
  methods: {
    init() {
      let that = this
      let task1 = getDictionaryList({ parentId: 532 }).then((res) => (that.assetTypeList = res.data))
      that.tabChange(0)
    },
    searchAction(opt = {}) {
      let that = this
      let _searchParam = Object.assign({}, { ...this.searchParam }, { ...this.pagination }, opt)
      console.log('执行搜索...', _searchParam)
      that.loading = true
      pageDevelopmentCraftDevRecoveApply(_searchParam)
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
        })
        .catch((err) => (that.loading = false))
    },
    // 分页
    handleTableChange(pagination, filters, sorter) {
      console.log(pagination, filters, sorter)
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.searchAction({ current: pagination.current })
    },
    doAction(type, record) {
      let that = this
      if (['withdraw' /*撤回*/, 'over' /*完结*/].includes(type)) {
        let api = {
          withdraw: pageDevelopmentRevocation,
          over: pageDevelopmentConcludeRevocation,
        }
        api[type]({ id: record.id })
          .then((res) => {
            that.$message.info(res.msg)
            if (+res.code === 200) {
              that.searchAction()
            }
          })
          .catch((err) => that.$message.info(err))
        return
      }
      if (['view', 'edit', 'approval', 'fix'].includes(type)) {
        //查看，编辑，审批，填写维修方案
        that.$refs.fixForm.query(type, record)
        return
      }
      if (type === 'upload') {
        //上传凭证
        that.$refs.uploadFileModel.query(type, record)
        return
      }

      if (type === 'view_photo') {
        //查看凭证
        pageDevelopmentgetRevocation({ id: record.id }).then((res) => {
          if (res && res.data && res.data.fileUrl) {
            let imgList = res.data.fileUrl.split(',').map((url) => decodeURIComponent(url))
            that.$refs.imgViewList.show(imgList)
          } else {
            that.$message.info('未上传凭证')
          }
        })
        return
      }
    },
    tabChange(tagKey) {
      this.activeKey = parseInt(tagKey)
      this.searchParam.searchStatus = this.activeKey
      this.searchAction({ current: 1 })
    },
    approvalPreview(record) {
      this.$refs.approveInfoCard.init(record.instanceId)
    },
  },
}
</script>

<style scoped>
.wdf-custom-wrapper {
  background-color: #fff;
  padding: 10px 20px;
}
.wdf-custom-wrapper .search-wrapper * {
  margin: 10px 15px 0 0;
}
.main-wrapper {
  margin-top: 20px;
}
</style>
