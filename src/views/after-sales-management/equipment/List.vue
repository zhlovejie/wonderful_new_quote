<template>
  <a-card :bordered="false">
    <!--div中可以写搜索条件，和功能按键-->
    <div class="description-document-search-wrapper">
      <a-form layout="inline">
        <a-form-item>
          <a-select placeholder="设备类型" v-model="queryParam.deviceTypeId" allowClear style="width: 200px">
            <a-select-option v-for="item in Warehouse" :key="item.deviceTypeId" :value="item.deviceTypeId">{{
              item.deviceType
            }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-input v-model.trim="queryParam.deviceParameter" allowClear placeholder="设备名称/主板号模糊查询" />
        </a-form-item>
        <a-form-item>
          <a-select placeholder="设备状态" v-model="queryParam.deviceStateId" allowClear style="width: 200px">
            <a-select-option v-for="item in DeviceState" :key="item.deviceStateId" :value="item.deviceStateId">{{
              item.deviceState
            }}</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item>
          <a-select placeholder="是否过保" v-model="queryParam.isWarranty" allowClear style="width: 200px">
            <a-select-option :value="0">不过</a-select-option>
            <a-select-option :value="1">过</a-select-option>
          </a-select>
        </a-form-item>
        <template v-if="$auth('video:list')">
          <a-form-item>
            <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
            <a-button class="a-button" type="primary" icon="search" @click="openSearchModel">高级筛选</a-button>
          </a-form-item>
        </template>
      </a-form>
    </div>
    <s-table ref="table" size="default" rowKey="id" :columns="columns" :data="loadData" :alert="false">
      <div slot="order" slot-scope="text, record, index">
        <span>{{ index + 1 }}</span>
      </div>
      <!-- <div slot="tutorialVideo" slot-scope="text, record, index">
        <a-button v-if="text" type="link" @click="tutorialClick(text)">查看</a-button>
      </div> -->
      <span slot="action" slot-scope="text, record">
        <template v-if="$auth('equipment:view')">
          <a @click="handleAdd('view', record)">详情</a>
        </template>
        <template v-if="$auth('equipment:edit')">
          <a-divider type="vertical" />
          <a @click="tutorialClick(record)">维修记录</a>
        </template>
        <template v-if="$auth('equipment:del')">
          <a-divider type="vertical" />
          <a class="delete" @click="handleAdd('edit', record)">更换件清单</a>
        </template>
      </span>
    </s-table>
    <Modal ref="modal" @ok="handleSaveOk" />

    <Dictionaries ref="bictionaries" />
    <Dictionaries1 ref="bictionaries1" />
    <SearchForm ref="searchForm" @change="paramChangeHandler" />
    <!-- <a-modal v-model="visible" title="" @ok="handleOk">
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
    </a-modal> -->
  </a-card>
</template>

<script>
import { getDeviceArchivesPage } from '@/api/after-sales-management'

import { STable } from '@/components'
import Modal from './modules/Video'
import Dictionaries from './modules/Dictionaries'
import Dictionaries1 from './modules/Dictionaries1'
import SearchForm from './SearchForm'

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
    title: '机构',
    key: 'orgName',
    dataIndex: 'orgName',
  },
  {
    align: 'center',
    title: '小区',
    key: 'villageName',
    dataIndex: 'villageName',
  },
  {
    align: 'center',
    title: '设备名称',
    key: 'deviceName',
    dataIndex: 'deviceName',
    width: 200,
  },

  {
    align: 'center',
    title: '设备类型',
    key: 'deviceType',
    dataIndex: 'deviceType',
    // scopedSlots: { customRender: 'tutorialVideo' },
  },
  {
    align: 'center',
    title: '主板号',
    key: 'mainBoardNo',
    dataIndex: 'mainBoardNo',
  },
  {
    align: 'center',
    title: '状态',
    key: 'deviceState',
    dataIndex: 'deviceState',
  },
  {
    align: 'center',
    title: '出厂日期',
    key: 'outTime',
    dataIndex: 'outTime',
  },
  {
    align: 'center',
    title: 'SIM卡服务期限',
    key: 'cardServicePeriod',
    dataIndex: 'cardServicePeriod',
  },
  {
    align: 'center',
    title: '设备位置',
    key: 'deviceLocation',
    dataIndex: 'deviceLocation',
    width: 200,
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
    Dictionaries,
    SearchForm,
    Dictionaries1,
  },
  data() {
    return {
      visible: false,
      // 表头
      columns: columns,
      Warehouse: [],
      DeviceState: [],
      tutorialList: undefined,
      // 查询参数
      queryParam: {},
      // 初始化加载 必须为 Promise 对象
      loadData: (parameter) => {
        console.log('页面开始加载数据。。。', parameter, this.queryParam)
        return getDeviceArchivesPage(Object.assign(parameter, this.queryParam))
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
  created() {},
  methods: {
    openSearchModel() {
      this.$refs.searchForm.query(this.contractState)
    },
    paramChangeHandler(params) {
      this.isExpanded = true
      this.queryParam = { ...this.queryParam, ...params }
      this.handleSaveOk()
    },
    showModal() {
      this.visible = true
    },
    handleOk(e) {
      console.log(e)
      this.visible = false
    },
    // 新增
    handleAdd(type, e) {
      if (type === 'edit') {
        this.$refs.bictionaries1.query(e)
      } else {
        this.$refs.modal.query(type, e)
      }
    },
    handleSaveOk() {
      this.$refs.table.refresh(true)
    },
    tutorialClick(text) {
      this.$refs.bictionaries.query(text)
    },
  },
}
</script>

<style scoped>
.a-button {
  margin-left: 15px;
}
</style>
