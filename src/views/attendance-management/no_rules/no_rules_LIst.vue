<template>
  <div class="wdf-custom-wrapper" id="attendance-over-time-apply">
    <div class="main-wrapper">
      <a-table :columns="columns" :dataSource="dataSource" :pagination="false" :loading="loading">
        <div slot="order" slot-scope="text, record, index">
          <span>{{ index + 1 }}</span>
        </div>
      </a-table>
    </div>
  </div>
</template>

<script>
import { no_rules_List } from '@/api/attendanceManagement'

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
    title: '部门',
    key: 'departmentName',
    dataIndex: 'departmentName',
  },
  {
    align: 'center',
    title: '岗位',
    key: 'stationName',
    dataIndex: 'stationName',
  },
  {
    align: 'center',
    title: '操作',
    key: 'userName',
    dataIndex: 'userName',
  },
]

export default {
  name: 'attendance-no_rules',

  data() {
    return {
      columns: columns,
      dataSource: [],
      loading: false,
    }
  },

  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'attendance-no_rules') {
          this.searchAction()
        }
      },
      immediate: true,
    },
  },

  methods: {
    searchAction(opt = {}) {
      let that = this
      that.loading = true
      no_rules_List()
        .then((res) => {
          that.loading = false
          that.dataSource = res.data.map((item, index) => {
            item.key = index + 1
            return item
          })
        })
        .catch((err) => (that.loading = false))
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
