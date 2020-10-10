<!-- 违法/事故记录 -->
<template>
  <div class="wdf-custom-wrapper">
    <div class="search-wrapper">
      <a-input
        style="width:200px;"
        :allowClear="true"
        placeholder="车牌号模糊查询"
        v-model="searchParam.carCode"
      />
      <a-input
        style="width:200px;"
        :allowClear="true"
        placeholder="违章人员模糊查询"
        v-model="searchParam.userName"
      />
      <a-range-picker
        v-model="sDate"
        :placeholder="['开始日期','结束日期']"
        @change="rangePickerChange"
        style="width:280px;"
        :allowClear="true"
      />

      <a-button class="a-button" type="primary" icon="search" @click="searchAction">查询</a-button>
      <a-button style="float:right;" type="primary" icon="plus" @click="doAction('add',null)">新增</a-button>
    </div>
    <div class="main-wrapper">
      <a-table
        :columns="columns"
        :dataSource="dataSource"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <div slot="order" slot-scope="text, record, index">{{ index + 1 }}</div>

        <div slot="action" slot-scope="text, record, index">
          <a-tooltip v-if="String(text).length > 10">
            <template slot="title">{{text}}</template>
            {{ String(text).slice(0,10) }}...
          </a-tooltip>
          <span v-else>{{text}}</span>
        </div>
        <div slot="amount" slot-scope="text, record">
          {{text | moneyFormatNumber}}
        </div>
        <div slot="paperUrl" slot-scope="text, record">
          <a href="javascript:void(0);" @click="doAction('photo',record)">查看</a>
        </div>
        <div slot="status" slot-scope="text, record">
          {{ {0:'未完结',1:'完结'}[text] }}
        </div>
        <div class="action-btns" slot="action" slot-scope="text, record">
          <template v-if="record.userName">
            <a type="primary" @click="doAction('editUser',record)">修改人员</a>
          </template>
          <template v-else>
            <a type="primary" @click="doAction('addUser',record)">添加人员</a>
          </template>
          <a-divider type="vertical" />
          <a type="primary" target="_blank" :href="record.punishStencilUrl">下载罚款单</a>
          <a-divider type="vertical" />
          <a type="primary" @click="doAction('upload',record)">上传罚款单</a>
        </div>
      </a-table>
    </div>
    <ApproveInfo ref="approveInfoCard" />
    <ImgViewList ref="imgViewList" title="违章照片" />
    <AddForm ref="addForm" @finish="searchAction()" />
    <AddUsers ref="addUsers" @finish="searchAction()" />
    <UploadFileModel ref="uploadFileModel" @finish="searchAction()" />
    
  </div>
</template>
<script>
import { getDictionary } from '@/api/common'
import ApproveInfo from '@/components/CustomerList/ApproveInfo'
import ImgViewList from '@/components/CustomerList/ImgViewList'
import { carIllegalList,carIllegalDetail,carIllegalUpload,carIllegalAddOrUpdate } from '@/api/vehicleManagement'
import AddForm from './AddForm'
import AddUsers from './AddUsers'
import UploadFileModel from './UploadFileModel'
import moment from 'moment'
const columns = [
  {
    align: 'center',
    title: '序号',
    width: '70px',
    dataIndex: 'order',
    scopedSlots: { customRender: 'order' },
  },
  {
    align: 'center',
    title: '车牌号',
    dataIndex: 'carCode',
  },
  {
    align: 'center',
    title: '车辆名称',
    dataIndex: 'carName',
  },
  {
    align: 'center',
    title: '违章时间',
    dataIndex: 'happenTime',
  },
  {
    align: 'center',
    title: '违章行为',
    dataIndex: 'action',
    width:300
  },
  {
    align: 'center',
    title: '金额',
    dataIndex: 'amount',
    scopedSlots: { customRender: 'amount' },
  },
  {
    align: 'center',
    title: '分数',
    dataIndex: 'score'
  },
  {
    align: 'center',
    title: '违章人员',
    dataIndex: 'userName'
  },
  {
    align: 'center',
    title: '照片',
    scopedSlots: { customRender: 'paperUrl' },
  },
  {
    align: 'center',
    title: '状态',
    dataIndex:'status',
    scopedSlots: { customRender: 'status' },
  },
  {
    align: 'center',
    title: '提交时间',
    dataIndex: 'createdTime',
  },
  {
    align: 'center',
    title: '操作',
    scopedSlots: { customRender: 'action' },
  },
]

export default {
  name: 'vehicle-management-supervision-accident-record',
  components: {
    AddForm: AddForm,
    ApproveInfo,
    ImgViewList,
    AddUsers,
    UploadFileModel
  },
  data() {
    return {
      sDate: [undefined, undefined],
      columns: columns,
      dataSource: [],
      pagination: {
        current: 1,
      },
      loading: false,
      searchParam: {
        searchStatus: 0,
      },
      maintenanceList:[],
      visible: false,
      bindEnterFn: null,
      planList: []
    }
  },
  computed: {},
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'vehicle-management-supervision-accident-record') {
          this.init()
        }
      },
      immediate: true,
    },
  },
  mounted() {
    let that = this
    let ele = document.querySelector('.wdf-custom-wrapper')
    that.bindEnterFn = (event) => {
      if (event.type === 'keyup' && event.keyCode === 13) {
        //Enter
        that.searchAction()
      }
    }
    if (ele) {
      ele.addEventListener('keyup', that.bindEnterFn)
    }
  },
  beforeDestroy() {
    let that = this
    let ele = document.querySelector('.wdf-custom-wrapper')
    ele && that.bindEnterFn && ele.removeEventListener('keyup', that.bindEnterFn)
  },
  methods: {
    moment,
    init() {
      let that = this
      let task2 = getDictionary({ text: '保养内容' }).then((res) => (that.maintenanceList = res.data))
      this.searchAction()
    },
    searchAction(opt) {
      let that = this
      let _searchParam = Object.assign({}, { ...this.searchParam }, { ...this.pagination }, opt || {})
      console.log('执行搜索...', _searchParam)
      that.loading = true
      carIllegalList(_searchParam)
        .then((res) => {
          that.loading = false
          that.dataSource = res.data.records.map((item, index) => {
            item.key = index + 1
            return item
          })
          //设置数据总条数
          const pagination = { ...that.pagination }
          pagination.total = res.data.total
          that.pagination = pagination
        })
        .catch((err) => (that.loading = false))
    },
    // 分页
    handleTableChange(pagination, filters, sorter) {
      console.log(pagination, filters, sorter)
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
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
    doAction(type, record) {
      let that = this
      if (type === 'photo') {
        if (record.evidenceList.length > 0) {
          let imgList = record.evidenceList.map((item) => {
            return decodeURIComponent(item.url)
          })
          that.$refs.imgViewList.show(imgList)
        } else {
          that.$message.info('未上传违章照片')
        }
        return 
      }
      if(type === 'add'){
        this.$refs.addForm.query(type, record)
        return
      }
      if(type === 'addUser' || type === 'editUser'){
        this.$refs.addUsers.query(type, record)
        return
      }
      if(type === 'upload'){
        this.$refs.uploadFileModel.query(type, record)
      }
    },
    approvalPreview(record) {
      this.$refs.approveInfoCard.init(record.instanceId)
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