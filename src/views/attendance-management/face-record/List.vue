<template>
  <!-- 人脸打卡记录 -->
  <div class="wdf-custom-wrapper" id="attendance-over-time-apply">
    <div class="search-wrapper">
      <a-form layout="inline">
        <a-form-item>
          <a-input placeholder="员工名模糊查询" v-model="searchParam.userName" allowClear style="width: 200px" />
        </a-form-item>
        <a-form-item>
          <a-select placeholder="选择部门" v-model="searchParam.departmentId" :allowClear="true" style="width: 200px">
            <a-select-option v-for="item in depList" :key="item.id" :value="item.id">{{
              item.departmentName
            }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-range-picker
            v-model="sDate"
            :placeholder="['考勤开始日期', '考勤结束日期']"
            @change="rangePickerChange"
            style="width: 280px"
            :allowClear="true"
          />
        </a-form-item>
        <a-form-item>
          <a-button class="a-button" type="primary" icon="search" @click="searchAction({ current: 1 })">查询</a-button>
        </a-form-item>
        <a-form-item>
          <a-button class="a-button" type="primary" icon="download" @click="downAction">下载</a-button>
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
        <div slot="signBeginResult" slot-scope="text, record, index">
          {{ { 1: '正常', 2: '迟到', 3: '缺卡', 4: '加班' }[text] }}
        </div>
        <div slot="signEndResult" slot-scope="text, record, index">
          {{ { 1: '正常', 2: '早退', 3: '缺卡', 4: '加班' }[text] }}
        </div>
      </a-table>
    </div>
  </div>
</template>

<script>
import {
  departmentList, //所有部门
} from '@/api/systemSetting'
import { getFaceRecordList, DownFaceRecordList } from '@/api/attendanceManagement'
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
    title: '工号',
    dataIndex: 'jobNum',
    key: 'jobNum',
  },
  {
    align: 'center',
    title: '姓名',
    dataIndex: 'userName',
    key: 'userName',
  },
  {
    align: 'center',
    title: '部门',
    dataIndex: 'departmentName',
  },
  {
    align: 'center',
    title: '考勤组名称',
    dataIndex: 'attanceGroupName',
    key: 'attanceGroupName',
  },
  {
    align: 'center',
    title: '考勤日期',
    dataIndex: 'attenceDate',
    key: 'attenceDate',
  },
  {
    align: 'center',
    title: '上班打卡时间',
    dataIndex: 'signBeginTime',
    key: 'signBeginTime',
  },
  {
    align: 'center',
    title: '打卡结果',
    key: 'signBeginResult',
    dataIndex: 'signBeginResult',
    scopedSlots: { customRender: 'signBeginResult' },
  },
  {
    align: 'center',
    title: '打卡设备',
    key: 'beginDeviceName',
    dataIndex: 'beginDeviceName',
  },
  {
    align: 'center',
    title: '下班打卡时间',
    dataIndex: 'signEndTime',
    key: 'signEndTime',
  },
  {
    align: 'center',
    title: '打卡结果',
    dataIndex: 'signEndResult',
    key: 'signEndResult',
    scopedSlots: { customRender: 'signEndResult' },
  },
  {
    align: 'center',
    title: '打卡设备',
    dataIndex: 'endDeviceName',
    key: 'endDeviceName',
  },
]

export default {
  name: 'attendance-face-record',
  data() {
    return {
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
      userInfo: this.$store.getters.userInfo, // 当前登录人
    }
  },
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'attendance-face-record') {
          this.init()
        }
      },
      immediate: true,
    },
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      let that = this
      let queue = []
      //有查看全部权限时， 部门搜索条件 去除，显示全部部门
      let hasAuth = that.$auth('signHistory:all')
      let task1 = departmentList(hasAuth ? undefined : { id: this.$store.getters.userInfo.departmentId }).then(
        (res) => (that.depList = res.data)
      )
      queue.push(task1)
      that.searchAction()
      return Promise.all(queue)
    },
    searchAction(opt = {}) {
      let that = this
      if(that.loading){
        that.$message.info('操作太频繁了...')
        return
      }
      let _searchParam = Object.assign({}, { ...this.searchParam }, { ...this.pagination1 }, opt)
      console.log('执行搜索...', _searchParam)
      that.loading = true
      getFaceRecordList(_searchParam)
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
        .catch((err) => {
          console.log(err)
          that.loading = false
        })
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
          this.searchParam.attenceBeginDate = arrMoment[0].format('YYYY-MM-DD')
          this.searchParam.attenceEndDate = arrMoment[1].format('YYYY-MM-DD')
        } else {
          this.searchParam.attenceBeginDate = undefined
          this.searchParam.attenceEndDate = undefined
        }
      }
    },
    // 下载
    downAction() {
      const downListParams = Object.assign({}, { ...this.searchParam })
      this.loading = true
      DownFaceRecordList(downListParams)
        .then((res) => {
          this.loading = false
          if (res instanceof Blob) {
            const isFile = res.type === 'application/vnd.ms-excel'
            //const isFile = res.type === 'application/msword'
            const isJson = res.type === 'application/json'
            if (isFile) {
              //返回文件 则下载
              const objectUrl = URL.createObjectURL(res)
              const a = document.createElement('a')
              document.body.appendChild(a)
              a.style = 'display: none'
              a.href = objectUrl
              a.download = '人脸打卡记录.xls'
              a.click()
              document.body.removeChild(a)
              that.$message.info('下载成功')
              return
            } else if (isJson) {
              //返回json处理
              var reader = new FileReader()
              reader.onload = function (e) {
                let _res = null
                try {
                  _res = JSON.parse(e.target.result)
                } catch (err) {
                  _res = null
                }
                if (_res !== null) {
                  if (_res.code !== 0) {
                    that.$message.info(_res.message)
                  } else {
                    that.$message.info('下载成功')
                  }
                } else {
                  that.$message.info('json解析出错 e.target.result：' + e.target.result)
                  return
                }
              }
              reader.readAsText(res)
            } else {
              that.$message.info('不支持的类型:' + res)
            }
          }
        })
        .catch((err) => (this.loading = false))
    },
  },
}
</script>

<style scoped>
.wdf-custom-wrapper {
  background-color: #fff;
  padding: 10px 20px;
}

.main-wrapper {
  margin-top: 20px;
}
</style>
