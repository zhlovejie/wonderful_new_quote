<template>
  <a-card :bordered="false">
    <!--div中可以写搜索条件，和功能按键-->
    <div class="description-document-search-wrapper">
      <a-form layout="inline">
        <a-form-item>
          <a-select placeholder="仓库类型" v-model="queryParam.warehouseType" allowClear style="width: 200px">
            <a-select-option :value="1">自动化立库</a-select-option>
            <a-select-option :value="2">平面库</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-input v-model.trim="queryParam.warehouseCode" allowClear placeholder="仓库代码" />
        </a-form-item>
        <a-form-item>
          <a-input v-model.trim="queryParam.warehouseName" allowClear placeholder="仓库名称" />
        </a-form-item>
        <a-form-item>
          <a-input v-model.trim="queryParam.headUserName" allowClear placeholder="负责人" />
        </a-form-item>
        <template>
          <a-form-item>
            <a-button type="primary" @click="searchAction">查询</a-button>
          </a-form-item>
        </template>
        <div class="action-wrapper" style="float: right">
          <a-form-item>
            <template v-if="$auth('warehouse:add')">
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
      <div slot="warehouseType" slot-scope="text, record, index">
        <span>{{ text === 1 ? '自动化立库' : '平面库' }}</span>
      </div>
      <span slot="action" slot-scope="text, record">
        <template v-if="$auth('warehouse:view')">
          <a @click="handleAdd('view', record)">查看</a>
        </template>
        <template v-if="$auth('warehouse:edit')">
          <a-divider type="vertical" />
          <a @click="handleAdd('edit', record)">修改</a>
        </template>
        <template v-if="$auth('warehouse:del')">
          <a-divider type="vertical" />
          <a @click="del(record)">删除</a>
        </template>
      </span>
    </s-table>
    <modal ref="modal" @ok="handleSaveOk" />
  </a-card>
</template>

<script>
import { getListByPage, delValidation, delById } from '@/api/storage'

import { STable } from '@/components'
import Modal from './modules/addForm'
// import Modal1 from './modules/addForm1'

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
    title: '仓库类型',
    key: 'warehouseType',
    dataIndex: 'warehouseType',
    scopedSlots: { customRender: 'warehouseType' },
  },
  {
    align: 'center',
    title: '仓库代码',
    key: 'warehouseCode',
    dataIndex: 'warehouseCode',
  },

  {
    align: 'center',
    title: '仓库名称',
    key: 'warehouseName',
    dataIndex: 'warehouseName',
  },

  {
    align: 'center',
    title: '负责人',
    key: 'headUserName',
    dataIndex: 'headUserName',
  },
  {
    align: 'center',
    title: '负责人电话',
    key: 'headUserPhone',
    dataIndex: 'headUserPhone',
  },
  {
    align: 'center',
    title: '质检员',
    key: 'inspectorUserName',
    dataIndex: 'inspectorUserName',
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
        console.log('页面开始加载数据。。。', parameter, this.queryParam)
        return getListByPage(Object.assign(parameter, this.queryParam))
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
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'configure') {
          this.searchAction()
        }
      },
      immediate: true,
    },
  },
  methods: {
    searchAction() {
      this.$refs.table.refresh(true)
    },
    del(record) {
      let that = this
      that.confirmModel({
        content: '确认删除该条数据吗?',
        success: () => {
          delValidation({ id: record.id })
            .then((res) => {
              if (+res.code === 200) {
                that.delvali(record)
              } else {
                that.$message.error(res.msg)
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
    delvali(record) {
      let that = this
      delById({ id: record.id })
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
    // 新增
    handleAdd(type, e) {
      this.$refs.modal.query(type, e)
    },
    handleSaveOk() {
      this.$refs.table.refresh(true)
    },
  },
}
</script>

<style scoped>
</style>
