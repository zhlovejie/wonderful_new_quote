<template>
  <!-- <a-modal
    :title="modalTitle"
    :width="1200"
    :visible="visible"
    :maskClosable="false"
    @cancel="handleCancel"
    :confirmLoading="spinning"
  > -->
  <a-card :bordered="false">
    <template slot="footer">
      <template>
        <a-button key="back" @click="handleCancel">取消</a-button>
        <!-- <a-button key="submit" type="primary" :loading="spinning" @click="handleOk">确定</a-button> -->
      </template>
    </template>

    <a-spin :spinning="spinning">
      <div class="search-wrapper" style="margin-bottom: 10px">
        <!-- <a-input
            placeholder="姓名"
            v-model="queryParam.userName"
            allowClear
            style="width: 200px; margin-right: 10px"
          />
          <a-button
            class="a-button"
            type="primary"
            style="position: relative; top: -1px"
            icon="search"
            @click="searchActionsee"
            >查询</a-button
          > -->
        <template>
          <a-button style="float: right" type="primary" @click="handleGo()">返回</a-button>
        </template>
      </div>
      <a-table :columns="baseColumns" :data-source="this.dataSource">
        <div slot="order" slot-scope="text, record, index">
          <span>{{ index + 1 }}</span>
        </div>
        <div slot="salerAmountBegin" slot-scope="text, record, index">
          <span>{{ record.salerAmountBegin }}-{{ record.salerAmountEnd }}</span>
        </div>
        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="AddRule('edit-salary', record)">修改</a>
            <a-divider type="vertical" />
            <a class="ant-dropdown-link" @click="delete_list(record.id)">删除</a>
          </template>
        </span></a-table
      >
    </a-spin>
    <AppFrom ref="appFrom" />
  </a-card>

  <!-- </a-modal> -->
</template>
<script>
import { salary_listSalerRule, salary_Sale_RemoveSalerRule } from '@/api/bonus_management'
import { getDictionaryList } from '@/api/workBox'
import AppFrom from './AppFrom'

let uuid = () => Math.random().toString(16).slice(-6) + Math.random().toString(16).slice(-6)
const columns = [
  {
    title: '序号',
    width: 100,
    dataIndex: 'order',
    key: 'order',
    scopedSlots: { customRender: 'order' },
    align: 'center',
  },
  {
    title: '销售额(万元)',
    dataIndex: 'salerAmountBegin',
    align: 'center',
    key: 'salerAmountBegin',
    scopedSlots: { customRender: 'salerAmountBegin' },
  },
  { title: '基本工资', dataIndex: 'salaryBigDeciaml', align: 'center', key: 'salaryBigDeciaml' },
  { title: '提交人', dataIndex: 'createdUserName', align: 'center', key: 'createdUserName' },
  { title: '提交时间', dataIndex: 'createdTime', align: 'center', key: 'createdTime' },
  { title: '更新人', dataIndex: 'modifierUserName', align: 'center', key: 'modifierUserName' },
  { title: '修改时间', dataIndex: 'modifyTime', align: 'center', key: 'modifyTime' },
  { title: '操作', key: 'action', scopedSlots: { customRender: 'action' }, align: 'center' },
]
export default {
  name: 'BecomingForm',
  components: {
    AppFrom,
  },
  data() {
    return {
      columns,
      visible: false,
      spinning: false,
      modalTitle: '规则明细',
      dataSource: [],
      recordId: '',
      assetTypeList: {},
    }
  },
  computed: {
    baseColumns() {
      let _columns = []
      //debugger
      this.dataSource.map((item, idx) => {
        item.bounsItemVoList.map((_item, idx1) => {
          if (!_columns.find((c) => c.title === _item.bounsDicName)) {
            _columns.push({
              title: _item.bounsDicName,
              dataIndex: `bounsItemRetio_${_item.key}`,
              align: 'center',
            })
          }
        })
      })
      let __columns = [...columns]
      let idx = __columns.findIndex((item) => item.dataIndex === 'createdUserName')
      if (idx >= 0) {
        __columns.splice(idx, 0, ..._columns)
      }

      // if (this.dataSource.bounsItemVoList.lentth)
      // if (fasle) {
      //   return columns.slice(3, 1)
      // } else {
      //   return columns
      // }
      return __columns
    },
  },
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'salary-base-sale-module' && this.$route.params.id !== undefined) {
          let that = this
          getDictionaryList({ parentId: 616 }).then((res) => {
            let obj = {}
            res.data.map((item) => {
              obj[item.id] = uuid()
            })
            that.assetTypeList = obj
            that.$nextTick(() => that.searchActionsee())
          })
        } else {
          this.$router.go(-1)
        }
      },
      immediate: true,
    },
  },
  methods: {
    handleGo() {
      this.$router.go(-1)
    },
    // query(type, record) {
    //   this.visible = true
    //   this.type = type
    //   this.record = record
    //   this.searchActionsee()
    // },
    searchActionsee() {
      let that = this
      that.loading = true
      this.routerId = this.$route.params.id
      let _searchParam = Object.assign({ baseSalerId: this.$route.params.id })
      salary_listSalerRule(_searchParam)
        .then((res) => {
          that.loading = false
          that.dataSource = res.data.map((item, index) => {
            item.key = index + 1
            let _item = { ...item }
            let bounsItemVoList = [..._item.bounsItemVoList]
            bounsItemVoList.map((v) => {
              v.key = that.assetTypeList[v.bounsDicId]
              _item[`bounsItemRetio_${v.key}`] = v.bounsItemRetio
              return v
            })
            _item.bounsItemVoList = bounsItemVoList
            return _item
          })
        })
        .catch((err) => (that.loading = false))
    },
    delete_list(id) {
      let that = this
      salary_Sale_RemoveSalerRule(`id=${id}`).then((res) => {
        if (res.code === 200) {
          this.searchActionsee()
          that.$message.info(res.msg)
        } else {
          that.$message.error(res.msg)
        }
      })
    },
    handleCancel() {
      this.visible = false
    },
    //规则明细修改
    AddRule(type, record) {
      record.routerId = this.routerId
      this.$refs.appFrom.query(type, record)
    },
  },
}
</script>
<style scoped>
/*自定义table样式*/
</style>