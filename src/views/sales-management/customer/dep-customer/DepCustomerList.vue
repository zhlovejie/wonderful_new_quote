<template>
  <a-card :bordered="false" class="depcustomer-list-wrapper">
    <!--搜索模块-->
    <div class="depcustomer-list-search-wrapper">
      <a-form layout="inline">
        <a-form-item label="客户名称/别名">
          <a-input v-model.trim="queryParam.name" placeholder="根据客户名模糊查询"/>
        </a-form-item>
        <a-form-item label="客户类型">
          <a-select style="width:200px;" v-model.trim="queryParam.type" placeholder="请选择客户类型" default-value="">
            <a-select-option v-for="cType in customerTypes" :key="cType.index" :value="cType.id">{{ cType.text }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="客户意向度">
          <a-select style="width:200px;" v-model.trim="queryParam.intention" placeholder="请选择客户意向度" default-value="">
            <a-select-option value="1">有效客户</a-select-option>
            <a-select-option value="2">无效客户</a-select-option>
            <a-select-option value="3">竞争对手</a-select-option>
            <a-select-option value="4">黑名单客户</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="联系人手机号">
          <a-input v-model.trim="queryParam.phone" placeholder="根据联系人手机号模糊查询"/>
        </a-form-item>
        <a-form-item label="联系人名">
          <a-input v-model.trim="queryParam.linkmanName" placeholder="根据联系人名模糊查询"/>
        </a-form-item>
        <a-form-item label="是否需要申诉">
          <a-select style="width:200px;" v-model.trim="queryParam.needAppeal" placeholder="请选择是否需要申诉" default-value="">
            <a-select-option value="0">不需要</a-select-option>
            <a-select-option value="1">需要</a-select-option>
            <a-select-option value="2">申诉中</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="所属销售" v-if="allSalesman.length > 0">
          <a-select style="width:200px;" v-model.trim="queryParam.userId" placeholder="请选择所属销售" default-value="">
            <a-select-option v-for="salesMan in allSalesman" :key="salesMan.index" :value="salesMan.userId">{{ salesMan.salesmanName }}</a-select-option>
          </a-select>
        </a-form-item>
        <template v-if="$auth('depCustomer:list')">
          <a-form-item>
          <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
          <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
          </a-form-item>
        </template>

        <div class="action-wrapper" style="float:right;">
          <a-form-item>
            <template v-if="$auth('depCustomer:add') && (salesJurisdiction.canEnterDep == 1 || salesJurisdiction.top)">
              <a-button style="float:right;" type="primary" icon="plus" @click="toAdd">新增</a-button>
            </template>
          </a-form-item>
        </div>
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
      <span slot="callRecord" slot-scope="text">
        <a @click="$refs.callRecord.show(text)">查看通话记录</a>
      </span>
      <!--客户信息完善任务已取消-->
      <!--      <span slot="perfectState" slot-scope="text,record">-->
      <!--        <span v-if="record.perfectState == 2">已完善</span>-->
      <!--        <span v-if="record.perfectState == 6">已锁定</span>-->
      <!--        <span v-else-if="record.perfectState != 2 && record.perfectState != 6">{{record.perfectTime}}</span>-->
      <!--      </span>-->
      <span slot="intention" slot-scope="text">
        <span v-if="text == 1">有效客户</span>
        <span v-if="text == 2">无效客户</span>
        <span v-if="text == 3">竞争对手</span>
        <span v-if="text == 4">黑名单客户</span>
      </span>
      <span slot="action" slot-scope="text,record">
        <template v-if="$auth('depCustomer:one')">
          <a @click="handlePreview(record.id)">查看</a>
        </template>
        <template v-if="$auth('depCustomer:edit') && record.perfectState != 6">
          <a-divider type="vertical" />
          <a @click="handleEdit(record.id)">修改</a>
        </template>
        <template v-if="record.userId == salesJurisdiction.userId">
          <a-divider type="vertical" />
          <!--只有是自己的客户才可以放弃-->
          <a @click="handleGiveUp(record.id)">放弃</a>
        </template>

        <!-- 客户释放 新增申诉按钮 -->
        <template v-if="record.needAppeal === 1">
          <a-divider type="vertical" />
          <a @click="handleAppeal('add',record)">申诉</a>
        </template>
      </span>
    </s-table>
    <dep-step-form ref="depStepForm" :salesJurisdiction="salesJurisdiction" @ok="handleOk" />
    <give-up ref="giveUp" @ok="handleOk" />
    <preview ref="previewModal" @ok="handleOk" />
    <call-record ref="callRecord"/>
    <AppealAddForm ref="appealAddForm" @finish="handleOk" />
  </a-card>
</template>

<script>
import { STable } from '@/components'
import DepStepForm from './modules/DepStepForm'
import GiveUp from './modules/GiveUp'
import Preview from './modules/Preview'
import CallRecord from './modules/CallRecord'
import { getDepList, salesJurisdiction, getCustomerVo } from '@/api/customer'
import { getDictionary } from '@/api/common'
import AppealAddForm from '../customerAppeal/AddForm'
export default {
  name: 'DepCustomerList',
  components: { // 组件
    STable,
    DepStepForm,
    GiveUp,
    Preview,
    CallRecord,
    AppealAddForm
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
          title: '销售负责人',
          dataIndex: 'userName'
        },
        {
          title: '联系倒计时',
          dataIndex: 'concatTime'
        },
        {
          title: '通话记录',
          dataIndex: 'id',
          scopedSlots: { customRender: 'callRecord' }
        },
        // {
        //   title: '信息完善倒计时',
        //   dataIndex: 'perfectState',
        //   scopedSlots: { customRender: 'perfectState' }
        // },
        {
          title: '录入时间',
          dataIndex: 'createTime'
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
      salesJurisdiction: {}, // 当前用户销售权限
      allSalesman: [], // 所有销售人员
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getDepList(Object.assign(parameter, this.queryParam)).then(res => {
          if (res.code === 200) {
            return res
          } else {
            this.$message.error(res.msg)
          }
        }).catch(function (err) {
          console.log(err)
        })
      }
    }
  },
  created () { // 初始化钩子
    salesJurisdiction().then(res => { // 当前用户的销售权限
      var salesJurisdiction = res.data
      this.salesJurisdiction = salesJurisdiction
      if (salesJurisdiction.top) { // 最高权限才可以查看所有销售人员的客户
        this.allSalesman = salesJurisdiction.allSalesman
      }
    }).catch(function (err) {
      console.log(err)
    })
    getDictionary({ text: '客户类型' }).then(res => { // 所有客户类型
      this.customerTypes = res.data
    }).catch(function (err) {
      console.log(err)
    })
  },
  watch: {
    $route: {
      handler: function(to, from) {
        if (to.name === 'DepCustomerList') {
          this.$refs.table.refresh()
        }
      },
      immediate: true
    }
  },
  methods: {
    toAdd () {
      if (!this.salesJurisdiction.top && this.salesJurisdiction.canEnterDep !== 1) { // 没有新增部门客户权限
        this.$message.error('你没有新增部门客户的权限！')
      } else {
        this.$refs.depStepForm.add()
      }
    },
    handleEdit (cId) { // 修改
      this.$refs.depStepForm.edit(cId)
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
    handleGiveUp (cId) {
      this.$refs.giveUp.showForm(cId)
    },
    handleAppeal(type,record){
      this.$refs.appealAddForm.query(type,record)
    }
  }
}
</script>

<style  scoped>
  .depcustomer-list-wrapper >>> .ant-pagination-total-text{
    color: red;
  }
</style>