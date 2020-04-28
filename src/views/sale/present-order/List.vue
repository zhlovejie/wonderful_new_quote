<template>
  <a-card :bordered="false">
    <div class="top-ation">
      <a-form layout="inline">
        <a-form-item>
          <a-button-group>
            <a-button type="primary" :class="{currentDayWeekMonth:dayWeekMonth === 1}" @click="simpleSearch(1)">今天</a-button>
            <a-button type="primary" :class="{currentDayWeekMonth:dayWeekMonth === 2}" @click="simpleSearch(2)">本周</a-button>
            <a-button type="primary" :class="{currentDayWeekMonth:dayWeekMonth === 3}" @click="simpleSearch(3)">本月</a-button>
          </a-button-group>
        </a-form-item>
        <a-form-item>
          <a-button
            class="a-button"
            type="primary"
            icon="search"
            @click="openSearchModel"
          >高级筛选</a-button>
        </a-form-item>
      </a-form>
    </div>
    <a-row>
      <a-col>
        <a-table
          :columns="columns"
          :dataSource="dataSource"
          :pagination="pagination"
          :loading="loading"
          @change="handleTableChange"
          :expandedRowKeys="expandedRowKeys" 
          @expand="expandHandler"
        >
          <div slot="order" slot-scope="text, record, index">
            <span>{{ index + 1}}</span>
          </div>
          <span slot="action" slot-scope="text, record">
            <a @click="doAction('view',record)">查看</a>
            <a-divider type="vertical"/>
            <a @click="doAction('edit',record)">编辑</a>
            <a-divider type="vertical"/>
            <a :href="record.orderUrl" target="_blank">下载</a>
          </span>
          <a-table
            slot="expandedRowRender"
            slot-scope="record, index, indent, expanded"
            :columns="innerColumns"
            :dataSource="record.productList"
            :pagination="false" 
            size="small"
          >
            <div slot="order" slot-scope="text, record, index">
              <span>{{ index + 1}}</span>
            </div>
            <div slot="sendFlag" slot-scope="text, record">
              <span>{{ parseInt(text,10) === 0 ? '否' : '是' }}</span>
            </div>

            <div slot="productModel" slot-scope="text">
              <a-tooltip v-if="String(text).length > 10">
                <template slot="title">{{text}}</template>
                {{ String(text).slice(0,10) }}...
              </a-tooltip>
              <span v-else>{{text}}</span>
            </div>
            <div slot="productName" slot-scope="text">
              <a-tooltip v-if="String(text).length > 10">
                <template slot="title">{{text}}</template>
                {{ String(text).slice(0,10) }}...
              </a-tooltip>
              <span v-else>{{text}}</span>
            </div>

          </a-table>
        </a-table>
      </a-col>
    </a-row>
    <SearchForm ref="searchForm" @change="paramChangeHandler" />
    <AddForm ref="addForm" @finish="searchAction" />
  </a-card>
</template>

<script>
  import {
    presentOrderPageList,presentOrderDetail,presentOrderDownload,presentOrderUpdate
   } from '@/api/receipt'
  import AddForm from './AddForm'
  import SearchForm from './SearchForm'

  const innerColumns = [
    {
      align: 'center',
      title: '产品代码',
      dataIndex: 'productCode',
      key: 'productCode',
    },
    {
      align: 'center',
      title: '产品名称',
      dataIndex: 'productName',
      key: 'productName'
    },
    {
      align: 'center',
      title: '规格型号',
      dataIndex: 'productStand',
      key: 'productStand'
    },
    {
      align: 'center',
      title: '数量',
      dataIndex: 'count',
      key: 'count'
    },
    {
      align: 'center',
      title: '是否发货',
      dataIndex: 'sendFlag',
      key: 'sendFlag',
      scopedSlots: { customRender: 'sendFlag' }
    },
  ]
  export default {
    name: 'ReceiptOrderList',
    components: {
      AddForm,
      SearchForm
    },
    data () {
      return {
        // 查询参数
        queryParam: {
          dayWeekMonth:1
        },
        showFlag: true,
        // 表头
        columns: [
          {
            align: 'center',
            title: '序号',
            key: 'order',
            width: '70px',
            scopedSlots: { customRender: 'order' }
          },
          {
            title: '赠送单编号',
            dataIndex: 'presentNum'
          },
          {
            title: '客户名称',
            dataIndex: 'customerName',
            scopedSlots: { customRender: 'customerName' }
          }, {
            title: '对应销售',
            dataIndex: 'saleUserName',
            scopedSlots: { customRender: 'saleUserName' }
          },  {
            title: '操作人',
            dataIndex: 'createdUserName'
          }, {
            title: '操作时间',
            dataIndex: 'createdTime'
          },
          {
            title: '操作',
            key:'action',
            scopedSlots: { customRender: 'action' }
          }
        ],
        innerColumns:innerColumns,
        selectedRowKeys: [],
        selectedRows: [],
        dayWeekMonth:1,

        dataSource: [],
        pagination: {
          current: 1
        },
        loading: false,
        isExpanded:false, //是否展开列表子数据
        expandedRowKeys:[]
      }
    },
    watch: {
      $route: {
        handler: function(to, from) {
          if (to.name === 'presentOrder') {
            this.searchAction()
          }
        },
        immediate: true
      }
    },
    methods: {
      searchAction(opt) {
        let that = this
        let _searchParam = Object.assign({}, { ...that.queryParam }, { ...that.pagination }, opt || {})
        console.log('执行搜索...', _searchParam)
        that.loading = true
        presentOrderPageList(_searchParam)
          .then(res => {
            that.loading = false
            that.dataSource = res.data.records.map((item, index) => {
              item.key = index + 1
              return item
            })

            that.expandedRowKeys = that.isExpanded ?  that.dataSource.map(item => item.key) : []

            //设置数据总条数
            const pagination = { ...that.pagination }
            pagination.total = res.data.total
            pagination.current = res.data.current || 1
            that.pagination = pagination
          })
          .catch(err => (that.loading = false))
      },
      // 分页
      handleTableChange(pagination, filters, sorter) {
        console.log(pagination, filters, sorter)
        const pager = { ...this.pagination }
        pager.current = pagination.current
        this.pagination = pager
        this.searchAction()
      },
      doAction(type,record){
        if(type === 'view' || type === 'edit'){
          this.$refs.addForm.query(type,record)
        }else{
          this.$message.info('功能尚未开发...')
        }
      },
      onSelectChange (selectedRowKeys, selectedRows) {
        console.log('onSelectChange 点击了')
        this.selectedRowKeys = selectedRowKeys
        this.selectedRows = selectedRows
      },
      openSearchModel(){
        this.$refs.searchForm.query()
      },
      paramChangeHandler(params){
        this.isExpanded = true
        this.queryParam = {...params}
        this.searchAction()
      },
      simpleSearch(type){
        this.isExpanded = false
        this.dayWeekMonth = this.dayWeekMonth === type ? undefined : type
        this.queryParam = {...this.queryParam,dayWeekMonth:this.dayWeekMonth}
        this.searchAction({current:1})
      },
      expandHandler(expanded,record){
        console.log(arguments)
        if(expanded){
          this.expandedRowKeys = [...this.expandedRowKeys,record.key]
        }else{
          this.expandedRowKeys = this.expandedRowKeys.filter(val => val !== record.key)
        }
      }
    }
  }

</script>

<style scoped>
  .top-ation .a-input {
    width: 160px;
    margin: 0 8px 8px 0;
  }

  .a-select {
    margin-right: 8px;
  }

  .a-button {
    margin-right: 8px;
  }

  .fl-r {
    float: right;
  }

  .develop-wrap {
    background-color: #fff;
    padding: 12px;
  }
  .currentDayWeekMonth{opacity: .7;}
</style>
