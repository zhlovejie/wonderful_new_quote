<template>
  <a-card :bordered="false">
    <!--站台管理-->
    <div class="description-document-search-wrapper">
      <a-form layout="inline">
        <a-form-item>
          <a-select placeholder="类别" v-model="queryParam.platformType" allowClear style="width: 200px">
            <a-select-option :value="0">进口站台</a-select-option>
            <a-select-option :value="1">出口站台</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-input v-model.trim="queryParam.platformParameter" allowClear placeholder="站台名称/站台代码" />
        </a-form-item>
        <template>
          <a-form-item>
            <a-button type="primary" @click="searchAction">查询</a-button>
          </a-form-item>
        </template>
        <div class="action-wrapper" style="float: right">
          <a-form-item>
            <template v-if="$auth('platform:add')">
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
      <div slot="platformType" slot-scope="text, record, index">
        <span>{{ text === 0 ? '收货' : '发货' }}</span>
      </div>

      <span slot="action" slot-scope="text, record">
        <template v-if="$auth('platform:view')">
          <a @click="handleAdd('view', record)">查看</a>
        </template>
        <template v-if="$auth('platform:edit')">
          <a-divider type="vertical" />
          <a @click="handleAdd('edit', record)">修改</a>
        </template>
        <template v-if="$auth('platform:del')">
          <a-divider type="vertical" />
          <a @click="del(record)">删除</a>
        </template>
      </span>
    </s-table>
    <modal ref="modal" @ok="searchAction" />
  </a-card>
</template>

<script>
import { platformgetListByPage, platformdelById } from '@/api/storage'

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
    title: '站台代码',
    key: 'platformCode',
    dataIndex: 'platformCode',
  },

  {
    align: 'center',
    title: '站台名称',
    key: 'platformName',
    dataIndex: 'platformName',
  },
  {
    align: 'center',
    title: '类别',
    key: 'platformType',
    dataIndex: 'platformType',
    scopedSlots: { customRender: 'platformType' },
  },
  {
    align: 'center',
    title: '负责人',
    key: 'headUserName',
    dataIndex: 'headUserName',
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
    // Modal1,
  },
  data() {
    return {
      visible: false,
      // 表头
      columns: columns,
      tutorialList: undefined,
      // 查询参数
      queryParam: {},
      // 初始化加载 必须为 Promise 对象
      loadData: (parameter) => {
        return platformgetListByPage(Object.assign(parameter, this.queryParam))
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
    searchAction() {
      this.$refs.table.refresh(true)
    },
    del(record) {
      let that = this
      that.confirmModel({
        content: '确认删除该条数据吗?',
        success: () => {
          platformdelById({ id: record.id })
            .then((res) => {
              that.$message.info(res.msg)
              if (+res.code === 200) {
                that.searchAction()
              }
            })
            .catch((err) => {
              console.error(err)
              that.$message.error(err)
            })
          return
        },
      })
    },
    confirmModel(opt) {
      const that = this
      let { title, content, success, attrs } = opt
      that.$confirm({
        title: title || '提示',
        content: (h) => {
          return h('div', null, content)
        },
        onOk() {
          success && success()
        },
        onCancel() {},
        ...(attrs || {}),
      })
      return
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    // 新增
    handleAdd(type, e) {
      this.$refs.modal.query(type, e)
    },
  },
}
</script>

<style scoped>
</style>
