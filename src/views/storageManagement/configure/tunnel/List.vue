<template>
  <a-card :bordered="false">
    <!--巷道管理-->
    <div class="description-document-search-wrapper">
      <a-form layout="inline">
        <a-form-item>
          <a-input v-model.trim="queryParam.roadwayParameter" allowClear placeholder="巷道代码/名称" />
        </a-form-item>
        <a-form-item>
          <a-select placeholder="状态" v-model="queryParam.roadwayStatus" allowClear style="width: 200px">
            <a-select-option :value="1">正常</a-select-option>
            <a-select-option :value="2">锁定</a-select-option>
          </a-select>
        </a-form-item>
        <template>
          <a-form-item>
            <a-button type="primary" @click="searchAction">查询</a-button>
          </a-form-item>
        </template>
        <div class="action-wrapper" style="float: right">
          <a-form-item>
            <template v-if="$auth('networkManagement:add')">
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
      <div slot="roadwayStatus" slot-scope="text, record, index">
        <span>{{ text === 1 ? '正常' : '锁定' }}</span>
      </div>
      <div slot="growDirection" slot-scope="text, record, index">
        <span>{{ text === 0 ? '双向' : text === 1 ? '单向左' : '单向右' }}</span>
      </div>

      <span slot="action" slot-scope="text, record">
        <template v-if="$auth('networkManagement:view')">
          <a @click="handleAdd('view', record)">查看</a>
        </template>
        <template v-if="$auth('networkManagement:edit')">
          <a-divider type="vertical" />
          <a @click="handleAdd('edit', record)">修改</a>
        </template>
        <template v-if="$auth('networkManagement:edit')">
          <a-divider type="vertical" />
          <a @click="del(record)">删除</a>
        </template>
      </span>
    </s-table>
    <modal ref="modal" @ok="searchAction" />
  </a-card>
</template>

<script>
import { roadwaygetListByPage, roadwaydelById, ReservoidelById } from '@/api/storage'

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
    title: '巷道代码',
    key: 'roadwayCode',
    dataIndex: 'roadwayCode',
  },

  {
    align: 'center',
    title: '巷道名称',
    key: 'roadwayName',
    dataIndex: 'roadwayName',
  },
  {
    align: 'center',
    title: '状态',
    key: 'roadwayStatus',
    dataIndex: 'roadwayStatus',
    scopedSlots: { customRender: 'roadwayStatus' },
  },
  {
    align: 'center',
    title: '伸展方向',
    key: 'growDirection',
    dataIndex: 'growDirection',
    scopedSlots: { customRender: 'growDirection' },
  },
  {
    align: 'center',
    title: '备注',
    key: 'remark',
    dataIndex: 'remark',
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
      warehouseList: [],
      columns: columns,
      tutorialList: undefined,
      // 查询参数
      queryParam: {},
      // 初始化加载 必须为 Promise 对象
      loadData: (parameter) => {
        console.log('页面开始加载数据。。。', parameter, this.queryParam)
        return roadwaygetListByPage(Object.assign(parameter, this.queryParam))
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
        if (to.name === 'ReservoirList') {
          getList().then((res) => {
            this.warehouseList = res.data
          })
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
          roadwaydelById({ id: record.id })
            .then((res) => {
              if (+res.code === 200) {
                that.$message.info(res.msg)
                if (+res.code === 200) {
                  that.searchAction()
                }
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
      ReservoidelById({ id: record.id })
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
  },
}
</script>

<style scoped>
</style>
