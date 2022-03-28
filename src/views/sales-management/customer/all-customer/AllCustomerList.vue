<template>
  <a-card :bordered="false" class="depcustomer-list-wrapper">
    <!--搜索模块-->
    <div class="all-customer-list-search-wrapper">
      <a-form layout="inline" class="search-form-wrapper">

        <a-form-item label="客户名称/别名">
          <a-input v-model.trim="queryParam.name" :allowClear="true" placeholder="根据客户名模糊查询"/>
        </a-form-item>

        <a-form-item label="客户类型">
          <a-select  v-model.trim="queryParam.type" :allowClear="true" placeholder="请选择客户类型">
            <a-select-option v-for="cType in customerTypes" :key="cType.index" :value="cType.id">{{ cType.text }}</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="客户意向度">
          <a-select  v-model.trim="queryParam.intention" :allowClear="true" placeholder="请选择客户意向度">
            <a-select-option value="1">有效客户</a-select-option>
            <a-select-option value="2">无效客户</a-select-option>
            <a-select-option value="3">竞争对手</a-select-option>
            <a-select-option value="4">黑名单客户</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="所在客户池">
          <a-select  v-model.trim="queryParam.pool" :allowClear="true" placeholder="请选择所在客户池">
            <a-select-option value="1">公共客户池</a-select-option>
            <a-select-option value="2">部门客户池</a-select-option>
            <a-select-option value="3">待分配客户池</a-select-option>
            <a-select-option value="4">分配中客户</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="所属销售">
          <a-select
            showSearch
            optionFilterProp="children"
            :filterOption="enterFilter"
            v-model.trim="queryParam.userId"
            :allowClear="true"
            placeholder="根据所属销售查询"
          >
            <a-select-option v-for="enter in allEnter" :key="enter.index" :value="enter.id">{{ enter.trueName }}</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="录入渠道">
          <a-select  v-model.trim="queryParam.source" :allowClear="true" placeholder="请选录入渠道">
            <a-select-option v-for="source in sources" :key="source.index" :value="source.id">{{ source.text }}</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="录入日期">
          <a-range-picker @change="dateChange" :allowClear="true" style="width: 100%" v-model="queryParam.rangeDate"/>
        </a-form-item>



        <a-form-item label="联系人手机号">
          <a-input v-model.trim="queryParam.phone" :allowClear="true" placeholder="根据联系人手机号模糊查询"/>
        </a-form-item>

        <a-form-item label="联系人名">
          <a-input v-model.trim="queryParam.linkmanName" :allowClear="true" placeholder="根据联系人名模糊查询"/>
        </a-form-item>

        <a-form-item label="获知渠道">
          <a-select  v-model.trim="queryParam.learn" @change="learnChange" :allowClear="true" placeholder="请选获知渠道">
            <a-select-option v-for="source in getSources" :key="source.index" :value="source.id">{{ source.text }}</a-select-option>
          </a-select>
        </a-form-item>
        <template v-if="isOtherLearn">
          <a-form-item label="其他获知渠道">
            <a-input v-model.trim="queryParam.otherLearn" :allowClear="true" placeholder="其他获知渠道模糊查询"/>
          </a-form-item>
        </template>

        <template v-if="$auth('allCustomer:list')">
          <a-form-item>
            <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
            <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
          </a-form-item>
        </template>

      </a-form>
    </div>
    <s-table
      ref="table"
      size="default"
      rowKey="id"
      :columns="columns"
      :data="loadData"
      :pagination="pagination"
    >
      <span slot="serial" slot-scope="text,record,index">
        {{ index + 1 }}
      </span>
      <span slot="intention" slot-scope="text">
        <span v-if="text == 1">有效客户</span>
        <span v-if="text == 2">无效客户</span>
        <span v-if="text == 3">竞争对手</span>
        <span v-if="text == 4">黑名单客户</span>
      </span>
      <span slot="pool" slot-scope="text">
        <span v-if="text == 1">公共客户池</span>
        <span v-if="text == 2">部门客户池</span>
        <span v-if="text == 3">待分配客户池</span>
        <span v-if="text == 4">分配中</span>
      </span>
      <span slot="action" slot-scope="text,record">
        <template>
          <template v-if="$auth('allCustomer:one')">
            <a @click="handlePreview(record.id)">查看</a>
          </template>
          <template v-if="$auth('allCustomer:edit') && record.perfectState != 6">
            <a-divider type="vertical" />
            <a @click="handleEdit(record.id)">修改</a>
          </template>
          <template v-if="$auth('allCustomer:del') && (salesJurisdiction.top || salesJurisdiction.service)">
            <a-divider type="vertical" />
            <a-popconfirm title="确认删除这条数据？" @confirm="confirm(record.id)" okText="是" cancelText="否">
              <a href="#">删除</a>
            </a-popconfirm>
          </template>
        </template>
      </span>
    </s-table>
    <all-step-form ref="allStepForm" @ok="handleOk" />
    <preview ref="previewModal" @ok="handleOk" />
  </a-card>
</template>

<script>
import { STable } from '@/components'
import AllStepForm from './modules/AllStepForm'
import Preview from './modules/Preview'
import { getAllList, delCustomer, salesJurisdiction, getCustomerVo, getAllEnter } from '@/api/customer'
import { getDictionary } from '@/api/common'

export default {
  name: 'AllCustomerList',
  components: { // 组件
    STable,
    AllStepForm,
    Preview
  },
  data () {
    return {
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '序号',
          scopedSlots: { customRender: 'serial' }
        },
        {
          title: '客户名称',
          dataIndex: 'name'
        },
        {
          title: '客户地址',
          dataIndex: 'address'
        },
        {
          title: '客户类型',
          dataIndex: 'type'
        },
        {
          title: '客户意向度',
          dataIndex: 'intention',
          scopedSlots: { customRender: 'intention' }
        },
        {
          title: '录入渠道',
          dataIndex: 'source'
        },
        {
          title: '最初获知渠道',
          dataIndex: 'learn'
        },
        {
          title: '所属客户池',
          dataIndex: 'pool',
          scopedSlots: { customRender: 'pool' }
        },
        {
          title: '销售负责人',
          dataIndex: 'userName'
        },
        {
          title: '所属销售',
          dataIndex: 'createName'
        },
        {
          title: '录入时间',
          dataIndex: 'createTime'
          // sorter: true
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '200px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      pagination: {
        showTotal: total=> '共' + total +'条数据'
      },
      customerTypes: [],
      sources: [], // 所有客户录入渠道
      getSources:[],// 客户获知渠道
      allEnter: [], // 所有的客户所属销售员
      salesJurisdiction: {}, // 当前用户销售权限
      allSalesman: [], // 所有销售人员
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getAllList(Object.assign(parameter, this.queryParam)).then(res => {
          if (res.code === 200) {
            return res
          } else {
            this.$message.error(res.msg)
          }
        }).catch(function (err) {
          console.log(err)
        })
      },
      isOtherLearn:false
    }
  },
  created () { // 初始化钩子
    salesJurisdiction().then(res => { // 当前用户的销售权限
      this.salesJurisdiction = res.data
    }).catch(function (err) {
      console.log(err)
    })
    getDictionary({ text: '客户类型' }).then(res => { // 所有客户类型
      this.customerTypes = res.data
    }).catch(function (err) {
      console.log(err)
    })
    getDictionary({ text: '客户录入渠道' }).then(res => { // 所有客户录入渠道
      this.sources = res.data
    }).catch(function (err) {
      console.log(err)
    })

    getDictionary({ text: '客户获知渠道' }).then(res => { // 所有客户录入渠道
      this.getSources = res.data
    }).catch(function (err) {
      console.log(err)
    })


    getAllEnter().then(res => {
      this.allEnter = res.data
    })
  },
  watch: {
    $route: {
      handler: function(to, from) {
        if (to.name === 'AllCustomerList') {
          this.$nextTick(() => {
            this.$refs.table && this.$refs.table.refresh()
          })
        }
      },
      immediate: true
    }
  },
  methods: {
    enterFilter (input, option) { // 下拉框搜索
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    dateChange (date, dateString) { // 时间选择
      this.$set(this.queryParam, 'rangeDate', date)
      this.$set(this.queryParam, 'startTime', dateString[0])
      this.$set(this.queryParam, 'endTime', dateString[1])
    },
    handleEdit (cId) { // 修改
      this.$refs.allStepForm.edit(cId)
    },
    handleOk () {
      this.$refs.table.refresh()
    },
    handlePreview (cId) { // 查看
      getCustomerVo({ customerId: cId }).then(res => {
        if (res.code === 200) {
          this.$refs.previewModal.show(res.data)
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    confirm (cId) { // 确认删除事件
      delCustomer({ 'cId': cId }).then(res => {
        if (res.code === 200) {
          this.$refs.table.refresh()
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    learnChange(id){
      let target = this.getSources.find(item => +item.id === +id)
      this.isOtherLearn = target && target.text === '其它'
      this.queryParam = {...this.queryParam,otherLearn:undefined}


    }
  }
}
</script>

<style  scoped>
  .search-form-wrapper >>> .ant-form-item-label{
    width: 120px;
  }
  .search-form-wrapper >>> .ant-form-item-control{
    width: 200px;
  }
  .depcustomer-list-wrapper >>> .ant-pagination-total-text{
    color: red;
  }
</style>
