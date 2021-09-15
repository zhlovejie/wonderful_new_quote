<template>
  <a-modal
    title="维修记录"
    v-model="visible"
    @ok="handleSubmit()"
    okText="确认"
    cancelText="取消"
    :maskClosable="false"
  >
    <div class="wdf-custom-wrapper" id="attendance-abnormal-events">
      <div class="search-wrapper">
        <a-form layout="inline">
          <a-form-item>
            <a-select placeholder="选择部门" v-model="searchParam.depId" :allowClear="true" style="width: 160px">
              <a-select-option v-for="item in depList" :key="item.id" :value="item.id">{{
                item.departmentName
              }}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item>
            <a-input placeholder="员工名模糊查询" v-model="searchParam.userName" allowClear style="width: 160px" />
          </a-form-item>
          <a-form-item>
            <a-range-picker v-model="sDate" @change="rangePickerChange" style="width: 220px" :allowClear="true" />
          </a-form-item>
          <a-form-item>
            <a-button class="a-button" type="primary" icon="search" @click="searchAction({ current: 1 })"
              >查询</a-button
            >
          </a-form-item>
        </a-form>
      </div>
      <div class="main-wrapper">
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
        </a-table>
      </div>
    </div>
  </a-modal>
</template>

<script>
import { getDictionaryByText, getDictionaryByCode, dictionaryAdd } from '@/api/workBox'
export default {
  name: 'EnterpriseSynopsis',
  data() {
    return {
      visible: false,
      confirmLoading: false,
      columns: columns,
      dataSource: [],
      pagination1: {},
      pagination: {
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: (total) => `共有 ${total} 条数据`, //分页中显示总的数据
        onShowSizeChange: (current, pageSize) => ((this.pagination1.size = pageSize), this.searchAction()),
      },
      loading: false,
      searchParam: {},
      sDate: [undefined, undefined],
      depList: [],
      bindEnterFn: null,
      userInfo: this.$store.getters.userInfo, // 当前登录人
    }
  },
  methods: {
    query(type, record) {
      this.visible = true
      this.searchAction()
    },
    searchAction(opt = {}) {
      let that = this
      let _searchParam = Object.assign({}, { ...this.searchParam }, { ...this.pagination1 }, opt)
      console.log('执行搜索...', _searchParam)
      that.loading = true
      getFineRecordList(_searchParam)
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
      this.pagination1.size = pagination.pageSize
      this.pagination1.current = pagination.current
      this.searchAction()
    },
    rangePickerChange(arrMoment, arrStrs) {
      if (Array.isArray(arrMoment)) {
        if (arrMoment.length === 2) {
          this.searchParam.beginTime = arrMoment[0].format('YYYY-MM-DD')
          this.searchParam.endTime = arrMoment[1].format('YYYY-MM-DD')
        } else {
          this.searchParam.beginTime = undefined
          this.searchParam.endTime = undefined
        }
      }
    },

    // 点击确定提交
    handleSubmit() {
      this.visible = false
    },

    close() {
      this.$emit('ok')
      this.fileList = []
      this.fileList1 = []
      this.form.resetFields() // 清空表
      this.visible = false
    },

    handleCancel() {
      this.close()
    },
  },
}
</script>

<style>
</style>
