<template>
  <a-card :bordered="false">
    <!--div中可以写搜索条件，和功能按键-->
    <div class="description-document-search-wrapper">
      <a-form layout="inline">
        <a-form-item>
          <a-select placeholder="网点类型" v-model="queryParam.networkType" allowClear style="width: 200px">
            <a-select-option :value="0">个人网点</a-select-option>
            <a-select-option :value="1">企业网点</a-select-option>
          </a-select>
        </a-form-item>
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
        <template v-if="$auth('video:list')">
          <a-form-item>
            <a-button type="primary" @click="searchAction">查询</a-button>
          </a-form-item>
        </template>
        <div class="action-wrapper" style="float: right">
          <a-form-item>
            <template v-if="$auth('video:add')">
              <a-button type="primary" icon="plus" @click="handleAdd('add', null)">新增</a-button>
            </template>
          </a-form-item>
        </div>
      </a-form>
    </div>
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
        <template v-if="$auth('video:edit')">
          <a @click="handleAdd('view', record)">查看</a>
        </template>
        <template v-if="$auth('video:edit')">
          <a-divider type="vertical" />
          <a @click="handleAdd('edit', record)">修改</a>
        </template>
        <!-- <template v-if="$auth('video:del')">
          <a-divider type="vertical" />
          <a class="delete" @click="() => del(record)">删除</a>
        </template>
        <template v-if="$auth('video:download')">
          <a-divider type="vertical" />
          <a v-download="record.url">下载</a>
        </template> -->
      </span>
    </s-table>
    <modal ref="modal" @ok="handleSaveOk" @close="handleSaveClose" />
    <a-modal v-model="visible" title="教程视频" @ok="handleOk">
      <table class="custom-table custom-table-border">
        <tr>
          <th>序号</th>
          <th>操作</th>
        </tr>
        <tr v-for="(item, index) in tutorialList" :key="item.index">
          <td>{{ index + 1 }}</td>
          <td>
            <a target="_blank" :href="item">预览</a>
            <a-divider type="vertical" />
            <a v-download="item">下载</a>
          </td>
        </tr>
      </table>
    </a-modal>
  </a-card>
</template>

<script>
import { networkManagementPage, delAnalysis } from '@/api/after-sales-management'
import { getAreaByParent } from '@/api/common'
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
    title: '网点类型',
    key: 'networkType',
    dataIndex: 'networkType',
    scopedSlots: { customRender: 'networkType' },
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
    align: 'center',
    title: '累计交易次数',
    key: 'dealNum',
    dataIndex: 'dealNum',
  },
  {
    align: 'center',
    title: '累计交易金额',
    key: 'dealAmount',
    dataIndex: 'dealAmount',
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
  },
  data() {
    return {
      birthplaceOptions: [], //籍贯 级联 省市
      visible: false,
      // 表头
      columns: columns,
      territory: [],
      Warehouse: [],
      tutorialList: undefined,
      // 查询参数
      queryParam: {},
      // 初始化加载 必须为 Promise 对象
      loadData: (parameter) => {
        console.log('页面开始加载数据。。。', parameter, this.queryParam)
        return networkManagementPage(Object.assign(parameter, this.queryParam))
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
    handleOk(e) {
      console.log(e)
      this.visible = false
    },
    // 新增
    handleAdd(type, e) {
      this.$refs.modal.query(type, e)
    },
    handleSaveOk() {
      this.$refs.table.refresh(true)
    },
    handleSaveClose() {},
    handleEditOk() {
      this.$refs.table.refresh(true)
    },
    tutorialClick(text) {
      this.tutorialList = text.split(',')
      this.visible = true
    },
  },
}
</script>

<style scoped>
</style>
