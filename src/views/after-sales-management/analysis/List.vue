<template>
  <a-card :bordered="false">
    <!--div中可以写搜索条件，和功能按键-->
    <div class="description-document-search-wrapper">
      <a-form layout="inline">
        <a-form-item>
          <a-select placeholder="问题类型" v-model="queryParam.problemTypeCode" allowClear style="width: 200px">
            <a-select-option v-for="item in Warehouse" :key="item.code" :value="item.code">{{
              item.text
            }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-input v-model.trim="queryParam.problemPoint" allowClear placeholder="问题点模糊查询" />
        </a-form-item>
        <a-form-item>
          <a-input v-model.trim="queryParam.problemDescription" allowClear placeholder="问题描述模糊查询" />
        </a-form-item>
        <a-form-item>
          <a-select placeholder="有无教程" v-model="queryParam.isTutorialVideo" allowClear style="width: 200px">
            <a-select-option :value="0">有</a-select-option>
            <a-select-option :value="1">没有</a-select-option>
          </a-select>
        </a-form-item>
        <template v-if="$auth('video:list')">
          <a-form-item>
            <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
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
        <template v-if="$auth('video:del')">
          <a-divider type="vertical" />
          <a class="delete" @click="() => del(record)">删除</a>
        </template>
        <template v-if="$auth('video:download')">
          <a-divider type="vertical" />
          <a v-download="record.url">下载</a>
        </template>
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
import { afterSaleAnalysisPage, delAnalysis } from '@/api/after-sales-management'
import { queryCode } from '@/api/workBox'

import { STable } from '@/components'
import Modal from './modules/Video'

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
    title: '问题类型',
    key: 'problemTypeText',
    dataIndex: 'problemTypeText',
  },
  {
    align: 'center',
    title: '问题点',
    key: 'problemPoint',
    dataIndex: 'problemPoint',
  },
  {
    align: 'center',
    title: '问题描述',
    key: 'problemDescription',
    dataIndex: 'problemDescription',
  },

  {
    align: 'center',
    title: '教程视频',
    key: 'tutorialVideo',
    dataIndex: 'tutorialVideo',
    scopedSlots: { customRender: 'tutorialVideo' },
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
    title: '更新人',
    key: 'modifierName',
    dataIndex: 'modifierName',
  },
  {
    align: 'center',
    title: '更新时间',
    key: 'modifyTime',
    dataIndex: 'modifyTime',
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
      visible: false,
      // 表头
      columns: columns,
      Warehouse: [],
      tutorialList: undefined,
      // 查询参数
      queryParam: {},
      // 初始化加载 必须为 Promise 对象
      loadData: (parameter) => {
        console.log('页面开始加载数据。。。', parameter, this.queryParam)
        return afterSaleAnalysisPage(Object.assign(parameter, this.queryParam))
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
  },
  methods: {
    showModal() {
      this.visible = true
    },
    handleOk(e) {
      console.log(e)
      this.visible = false
    },
    // 新增
    handleAdd(type, e) {
      this.$refs.modal.query(type, e)
    },
    // 详情
    query(e) {
      this.$refs.queryModal.query(e)
    },
    // 删除
    del(row) {
      const _this = this
      this.$confirm({
        title: '警告',
        content: `真的要删除 ${row.title} 吗?`,
        okText: '删除',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
          // 在这里调用删除接口
          delAnalysis({ id: row.id })
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
