<template>
  <!-- 设备列表 -->
  <div class="wdf-custom-wrapper" id="attendance-over-time-apply">
    <div class="search-wrapper">
      <a-form layout="inline">
        <a-form-item>
          <a-input placeholder="设备名称模糊查询" v-model="searchParam.equipmentName" allowClear style="width: 180px" />
        </a-form-item>
        <a-form-item>
          <a-input placeholder="设备编码模糊查询" v-model="searchParam.equipmentCode" allowClear style="width: 180px" />
        </a-form-item>
        <a-form-item>
          <a-select placeholder="设备状态" v-model="searchParam.equipmentStatus" :allowClear="true" style="width: 180px">
            <a-select-option :value="1">在线</a-select-option>
            <a-select-option :value="2">不在线</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button class="a-button" type="primary" icon="search" @click="searchAction">查询</a-button>
        </a-form-item>
        <div style="float:right;">
        <a-form-item>
          <a-button class="a-button" type="primary" @click="doAction('type-management',null)">设备类别</a-button>
        </a-form-item>
        <a-form-item>
          <a-button class="a-button" type="primary" @click="doAction('add',null)">新增设备</a-button>
        </a-form-item>
        </div>
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
        <div class="action" slot="action" slot-scope="text, record">
          <a type="primary" @click="doAction('view',record)">查看</a>
          <a-divider type="vertical" />
          <a type="primary" @click="doAction('edit',record)">修改</a>
          <a-divider type="vertical" />
          <a-popconfirm
            title="确认删除该条数据吗?"
            @confirm="() => doAction('del',record)"
          >
            <a type="primary" href="javascript:;">删除</a>
          </a-popconfirm>
        </div>
      </a-table>
    </div>
    <AddForm ref="addForm" @finish="() => searchAction({current:1})" />
    <TypeAddForm ref="typeAddForm" @finish="() => searchAction({current:1})" />
  </div>
</template>

<script>
import {
  monitoringEquipmentDetail,
  monitoringEquipmentAdd,
  monitoringEquipmentUpdate,
  monitoringEquipmentDelete,
  monitoringEquipmentList,

  monitoringEquipmentTypeList,
  monitoringEquipmentTypeAdd,
  monitoringEquipmentTypeUpdate,
  monitoringEquipmentTypeDelete
} from '@/api/monitorDeviceManagement'

import AddForm from './modules/AddForm'
import TypeAddForm from './modules/TypeAddForm'

const columns = [
  {
    title: '序号',
    key: 'order',
    width: '70px',
    scopedSlots: { customRender: 'order' }
  },
  {
    title: '设备类别',
    dataIndex: 'typeName'
  },
  {
    title: '设备名称',
    dataIndex: 'equipmentName'
  },
  {
    title: '设备编码',
    dataIndex: 'equipmentCode'
  },
  {
    title: '设备位置',
    dataIndex: 'equipmentLocation',
  },
  {
    title: '设备状态',
    dataIndex: 'equipmentStatusText'
  },
  {
    title: '提交人',
    dataIndex: 'createdName'
  },
  {
    title: '提交时间',
    dataIndex: 'createdTime'
  },
  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'monitor-device-management-device-list',
  components:{
    AddForm,
    TypeAddForm
  },
  data() {
    return {
      columns: columns,
      dataSource: [],
      pagination:{
        current:1,
        _prePageSize: 10,
        pageSize:10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: (total) => `共有 ${total} 条数据`, //分页中显示总的数据
      },
      loading: false,
      searchParam: {}, //查询参数
      userInfo: this.$store.getters.userInfo, // 当前登录人
    }
  },
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'monitor-device-management-device-list') {
          this.searchAction({ current: 1})
        }
      },
      immediate: true,
    },
  },
  methods: {
    searchAction(opt = {}) {
      this.disabled = false
      let that = this

      let paginationParam = {
        current: that.pagination.current || 1,
        size: that.pagination.pageSize || 10,
      }
      let _searchParam = Object.assign({}, { ...this.searchParam }, paginationParam, opt)
      console.log('执行搜索...', _searchParam)
      that.loading = true
      monitoringEquipmentList(_searchParam)
        .then((res) => {
          that.loading = false
          that.dataSource = res.data.records.map((item, index) => {
            item.key = index + 1
            item.equipmentStatusText = ({1:'在线',2:'未在线'}[item.equipmentStatus]) || '未知'
            return item
          })

          //设置数据总条数
          const pagination = { ...that.pagination }
          pagination.total = res.data.total || 0
          pagination.current = res.data.current || 1
          that.pagination = pagination

          try{
            //有两页数据,第二页只有一条数据,删除第二页的一条数据了,界面显示在第一页,但是不显示第一页数据了
            //刷新也不显示数据
            let {current,pages} = res.data
            if(+pages > 0 && +current > +pages){
              that.pagination = {...pagination,current:pages}
              that.searchAction()
            }
          }catch(err){
            console.log(err)
          }
        })
        .catch((err) => {
          that.loading = false
          console.log(err)
        })
    },
    // 分页
    handleTableChange (pagination, filters, sorter) {
      const pager = pagination
      pager.current = pagination.current
      if(+pager.pageSize !== +pager._prePageSize){ //pageSize 变化
        pager.current = 1 //重置为第一页
        pager._prePageSize = +pager.pageSize //同步两者的值
      }
      this.pagination = {...this.pagination,...pager}
      this.searchAction()
    },
    doAction(type,record){
      const that = this
      if(['view','add','edit'].includes(type)){
        that.$refs.addForm.query(type,record)
        return
      }else if(type === 'del'){
        monitoringEquipmentDelete({id:record.id}).then(res =>{
          that.$message.info(res.msg)
          if(+res.code === 200){
            that.searchAction()
          }
        })
        return
      }else if(type === 'type-management'){
        that.$refs.typeAddForm.query(type,record)
        return
      }else{
        that.$message.warning(`不支持的指令:${type}-${record}`)
        return
      }
    }
  }
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
.currentDayWeekMonth {
  opacity: 0.7;
}
</style>
