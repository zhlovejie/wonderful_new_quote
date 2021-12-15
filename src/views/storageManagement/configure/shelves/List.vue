<template>
  <a-card :bordered="false">
    <!--货架管理-->
    <div class="description-document-search-wrapper">
      <a-form layout="inline">
        <a-form-item>
          <a-select
            placeholder="仓库名称"
            show-search
            :filter-option="filterOption"
            v-model="queryParam.warehouseId"
            @change="warehchange"
            allowClear
            style="width: 200px"
          >
            <a-select-option v-for="item in warehouseList" :key="item.id" :value="item.id">{{
              item.warehouseName
            }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-select
            placeholder="库区名称"
            show-search
            :filter-option="filterOption"
            v-model="queryParam.reservoirAreaId"
            allowClear
            style="width: 200px"
          >
            <a-select-option v-for="item in ReservoiList" :key="item.id" :value="item.id">{{
              item.reservoirName
            }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-input v-model.trim="queryParam.shelvesName" allowClear placeholder="货架名称" />
        </a-form-item>
        <a-form-item>
          <a-input v-model.trim="queryParam.shelvesCode" allowClear placeholder="货架代码" />
        </a-form-item>
        <template>
          <a-form-item>
            <a-button type="primary" @click="searchAction">查询</a-button>
          </a-form-item>
        </template>
        <div class="action-wrapper" style="float: right">
          <a-form-item>
            <template v-if="$auth('shelves:add')">
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
      <span slot="action" slot-scope="text, record">
        <template v-if="$auth('shelves:view')">
          <a @click="handleAdd('view', record)">查看</a>
        </template>
        <template v-if="$auth('shelves:edit')">
          <a-divider type="vertical" />
          <a @click="handleAdd('edit', record)">修改</a>
        </template>
        <template v-if="$auth('shelves:del')">
          <a-divider type="vertical" />
          <a @click="del(record)">删除</a>
        </template>
      </span>
    </s-table>
    <modal ref="modal" @ok="searchAction" />
  </a-card>
</template>

<script>
import { getList, shelvesList, shelvesdelValidation, shelvesdelById, ReservoiGetList } from '@/api/storage'

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
    title: '货架代码',
    key: 'shelvesCode',
    dataIndex: 'shelvesCode',
  },

  {
    align: 'center',
    title: '货架名称',
    key: 'shelvesName',
    dataIndex: 'shelvesName',
  },
  {
    align: 'center',
    title: '所属仓库',
    key: 'warehouseName',
    dataIndex: 'warehouseName',
  },
  {
    align: 'center',
    title: '所属库区',
    key: 'reservoirAreaName',
    dataIndex: 'reservoirAreaName',
  },
  {
    align: 'center',
    title: '行',
    key: 'shelvesRow',
    dataIndex: 'shelvesRow',
  },
  {
    align: 'center',
    title: '列',
    key: 'shelvesColumn',
    dataIndex: 'shelvesColumn',
  },
  {
    align: 'center',
    title: '总库位',
    key: 'totalLocation',
    dataIndex: 'totalLocation',
  },
  {
    align: 'center',
    title: '已用库位',
    key: 'usedLocation',
    dataIndex: 'usedLocation',
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
      ReservoiList: [],
      columns: columns,
      tutorialList: undefined,
      // 查询参数
      queryParam: {},
      // 初始化加载 必须为 Promise 对象
      loadData: (parameter) => {
        console.log('页面开始加载数据。。。', parameter, this.queryParam)
        return shelvesList(Object.assign(parameter, this.queryParam))
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
    getList().then((res) => {
      this.warehouseList = res.data
    })
  },
  methods: {
    warehchange(opt) {
      this.queryParam = {
        ...this.queryParam,
        reservoirAreaId: undefined,
      }
      ReservoiGetList({ warehouseId: opt }).then((res) => {
        this.ReservoiList = res.data
      })
    },
    searchAction() {
      this.$refs.table.refresh(true)
    },
    del(record) {
      let that = this
      that.confirmModel({
        content: '确认删除该条数据吗?',
        success: () => {
          shelvesdelValidation({ id: record.id })
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
      shelvesdelById({ id: record.id })
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
