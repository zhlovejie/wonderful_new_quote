<!-- 客户维护逾期记录 -->
<template>
  <div class="wdf-custom-wrapper">
    <div class="search-wrapper">
      <a-input
        style="width:250px;"
        :allowClear="true"
        placeholder="客户名称模糊查询"
        v-model="searchParam.customerName"
      />

      <a-input
        style="width:100px;"
        :allowClear="true"
        placeholder="逾期天数"
        v-model="searchParam.overdueDay"
      />

      <a-select v-if="allSalesman.length > 0" style="width:200px;" v-model.trim="searchParam.userId" :allowClear="true" placeholder="销售经理" >
        <a-select-option v-for="salesMan in allSalesman" :key="salesMan.index" :value="salesMan.userId">{{ salesMan.salesmanName }}</a-select-option>
      </a-select>

      <a-select
        placeholder="状态"
        v-model="searchParam.status"
        :allowClear="true"
        style="width: 200px "
      >
        <a-select-option :value="1">已完结</a-select-option>
        <a-select-option :value="2">未完结</a-select-option>
      </a-select>

      <a-button class="a-button" type="primary" icon="search" @click="searchAction">查询</a-button>

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
        <div slot="status" slot-scope="text">
          {{ {'2':'未完结','1':'已完结'}[text] || `未知状态:${text}` }}
        </div>

        <div class="action-btns" slot="action" slot-scope="text, record">
          <template v-if="+record.status === 1">
            <a type="primary" @click="doAction('view',record)">查看罚款单</a>
          </template>
          <template v-else>
            <a type="primary" @click="handleUpload(record)">下载罚款单</a>
            <a-divider type="vertical" />
            <a type="primary" @click="doAction('upload',record)">上传罚款单</a>
          </template>

          <a-divider type="vertical" />
          <a-popconfirm title="是否要删除此行？" @confirm="doAction('del',record)">
            <a href="javascript:void(0);">删除</a>
          </a-popconfirm>
        </div>
      </a-table>
    </div>
    <AddForm ref="addForm" @finish="searchAction" />
    <UploadFileModal ref="uploadFile" @uploaded="() => searchAction()"/>
    <ImgView ref="imgView" />
  </div>
</template>
<script>
import {
  customerPunishRecordList,
  customerPunishRecordDelete,
  customerPunishRecordDownloadTemplate
} from '@/api/customerReleaseRule'
import { salesJurisdiction } from '@/api/customer'
import AddForm from './AddForm'
import UploadFileModal from './UploadFileModal'
import ImgView from '@/components/CustomerList/ImgView'
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
    title: '销售负责人',
    dataIndex: 'userName',
  },
  {
    align: 'center',
    title: '客户名称',
    dataIndex: 'customerName'
  },
  {
    align: 'center',
    title: '逾期天数',
    dataIndex: 'overdueDay'
  },
  {
    align: 'center',
    title: '状态',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' },
  },
  {
    align: 'center',
    title: '时间',
    dataIndex: 'createdTime',
  },
  {
    align: 'center',
    title: '操作',
    scopedSlots: { customRender: 'action' },
  },
]

export default {
  name: 'customerPunishRecord',
  props:{
    isForSelect:false //弹出框选择车牌号用
  },
  components: {
    AddForm,
    UploadFileModal,
    ImgView
  },
  data() {
    return {
      columns: columns,
      dataSource: [],
      pagination: {
        current: 1,
      },
      loading: false,
      searchParam: {},
      visible: false,
      bindEnterFn: null,
      allSalesman:[]
    }
  },
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'customerPunishRecord') {
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
      salesJurisdiction().then(res => { // 当前用户的销售权限
        var salesJurisdiction = res.data
        if (salesJurisdiction.top) { // 最高权限才可以查看所有销售人员的客户
          this.allSalesman = salesJurisdiction.allSalesman
        }
        if (salesJurisdiction.leader) {
          this.allSalesman = salesJurisdiction.subSalesman
        }
      }).catch(function (err) {
        console.log(err)
      })

      this.searchAction()
    },
    searchAction(opt) {
      let that = this
      let _searchParam = Object.assign({}, { ...this.searchParam }, { ...this.pagination }, opt || {})
      console.log('执行搜索...', _searchParam)
      that.loading = true
      customerPunishRecordList(_searchParam)
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

          //有两页数据,第二页只有一条数据,删除第二页的一条数据了,界面显示在第一页,但是不显示第一页数据了
          //刷新也不显示数据
          let {current,pages} = res.data
          if(+pages > 0 && +current > +pages){
            that.pagination = {...pagination,current:pages}
            that.searchAction()
          }
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
    doAction(type, record) {
      let that = this
      if (type === 'del') {
        customerPunishRecordDelete(`id=${record.id}`)
          .then((res) => {
            that.$message.info(res.msg)
            if(+res.code === 200){
              that.searchAction()
            }
          })
          .catch((err) => {
            that.$message.info(`错误：${err.message}`)
          })
        return
      } else if(type === 'upload'){
        this.$refs.uploadFile.query(record)
        return
      } else if(type === 'view'){
        this.$refs.imgView.show(record.ticketUrl)
        return
      }
    },
    handleUpload(record) {
      customerPunishRecordDownloadTemplate({id:record.id})
        .then((res) => {
          let that = this
          console.log(res.type)
          if (res instanceof Blob) {
            let action = {
              isFile: res.type === 'application/msword',
              isJson: res.type === 'application/json',
            }
            if (action.isFile) {
              const objectUrl = URL.createObjectURL(res)
              const a = document.createElement('a')
              document.body.appendChild(a)
              a.style = 'display: none'
              a.href = objectUrl
              a.download = '罚款单.doc'
              a.click()
              document.body.removeChild(a)
              return
            } else if (action.isJson) {
              var reader = new FileReader()
              reader.onload = function (e) {
                let _res = null
                try {
                  _res = JSON.parse(e.target.result)
                } catch (err) {
                  _res = null
                  console.log('JSON.parse error...', e.target.result)
                }
                if (_res !== null) {
                  that.$message.success(_res.msg || '操作成功')
                }
              }
              reader.readAsText(res)
            }
          } else {
            console.log('未知错误：')
            console.log('类型：' + typeof res)
            console.log(res)
          }
        })
        .catch(function (err) {
          console.log(err)
        })
    },
  }
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