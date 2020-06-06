<template>
  <a-card :bordered="false" class="depcustomer-list-wrapper">
    <!--搜索模块-->
    <div class="common-cutomer-list-search-wrapper">
      <a-form layout="inline">
            <a-form-item label="客户名称/别名">
              <a-input v-model.trim="queryParam.name" placeholder="根据客户名模糊查询"/>
            </a-form-item>

            <a-form-item label="客户类型">
              <a-select style="width:200px;" v-model.trim="queryParam.type" placeholder="请选择客户类型">
                <a-select-option v-for="cType in customerTypes" :key="cType.index" :value="cType.id">{{ cType.text }}</a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item label="客户意向度">
              <a-select style="width:200px;" v-model.trim="queryParam.intention" placeholder="请选择客户意向度">
                <a-select-option value="1">有效客户</a-select-option>
                <a-select-option value="2">无效客户</a-select-option>
                <a-select-option value="3">竞争对手</a-select-option>
                <a-select-option value="4">黑名单客户</a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item label="所在客户池">
              <a-select style="width:200px;" v-model.trim="queryParam.pool" placeholder="请选择所在客户池">
                <a-select-option value="1">公共客户池</a-select-option>
                <a-select-option value="3">待分配客户池</a-select-option>
                <a-select-option value="4">分配中客户</a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item label="客服联系次数">
              <a-input v-model.trim="queryParam.contactNum" placeholder="客服打电话次数"/>
            </a-form-item>

            <a-form-item label="联系人电话">
              <a-input v-model.trim="queryParam.phone" placeholder="根据联系人手机号模糊查询"/>
            </a-form-item>

            <a-form-item label="联系人姓名">
              <a-input v-model.trim="queryParam.linkmanName" placeholder="根据联系人名模糊查询"/>
            </a-form-item>

            <template v-if="$auth('commonCustomer:list')">
              <a-form-item>
              <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
              </a-form-item>
            </template>

            <div class="action-wrapper" style="float:right;">
            <a-form-item>
              <template v-if="$auth('commonCustomer:add') && (salesJurisdiction.canEnterCommon == 1 || salesJurisdiction.top || salesJurisdiction.service)">
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
      <span slot="intention" slot-scope="text">
        <span v-if="text == 1">有效客户</span>
        <span v-if="text == 2">无效客户</span>
        <span v-if="text == 3">竞争对手</span>
        <span v-if="text == 4">黑名单客户</span>
      </span>
      <span slot="pool" slot-scope="text">
        <span v-if="text == 1">公共客户池</span>
        <span v-if="text == 3">待分配客户池</span>
        <span v-if="text == 4">分配中</span>
      </span>
      <span slot="changeRecord" slot-scope="text">
        <a @click="getChangeRecord(text)">客户变更记录</a>
      </span>
      <span slot="action" slot-scope="text,record">
        <template>
          <a-popconfirm v-if="salesJurisdiction.canExtract == 1 && record.pool == 1 && record.intention != 4" title="确认提取此客户？" @confirm="extract(record.id)" okText="是" cancelText="否">
            <a href="#">提取</a>
          </a-popconfirm>
          <template v-if="$auth('commonCustomer:one') && (salesJurisdiction.top || salesJurisdiction.service)">
            <a @click="handlePreview(record.id)">查看</a>
          </template>
          <a-popconfirm v-if="salesJurisdiction.service" title="确认和该客户联系过？" @confirm="addContactNum(record.id)" okText="是" cancelText="否">
            <a-divider type="vertical"/>
            <a href="#">已联系</a>
          </a-popconfirm>
          <a-popconfirm v-if="salesJurisdiction.service && record.pool == 1" title="确认将该客户改为待分配？" @confirm="reAllocate(record.id)" okText="是" cancelText="否">
            <a-divider type="vertical"/>
            <a href="#">再分配</a>
          </a-popconfirm>
          <template v-if="$auth('commonCustomer:edit') && record.perfectState != 6 && (salesJurisdiction.top || salesJurisdiction.service)">
            <a @click="handleEdit(record.id)">
              <a-divider type="vertical"/>修改
            </a>
          </template>
          <template v-if="$auth('commonCustomer:del') && (salesJurisdiction.top || salesJurisdiction.service)">
            <a-popconfirm title="确认删除这条数据？" @confirm="confirm(record.id)" okText="是" cancelText="否">
              <a-divider type="vertical"/>
              <a href="#">删除</a>
            </a-popconfirm>
          </template>
        </template>
      </span>
    </s-table>
    <common-step-form ref="commonStepForm" @ok="handleOk" />
    <preview ref="previewModal" @ok="handleOk" />
    <change-record ref="changeRecord" @ok="handleOk" />
  </a-card>
</template>

<script>
import { STable } from '@/components'
import CommonStepForm from './modules/CommonStepForm'
import Preview from './modules/Preview'
import ChangeRecord from './modules/CustomerChangeRecord'
import { getCommonList, delCustomer, salesJurisdiction, getCustomerVo, getChangeRecord, addContactNum, reAllocate, extractCustomer } from '@/api/customer'
import { getDictionary } from '@/api/common'

export default {
  name: 'CommonCutomerList',
  components: { // 组件
    STable,
    CommonStepForm,
    Preview,
    ChangeRecord
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
          title: '客户池变更记录',
          dataIndex: 'id',
          scopedSlots: { customRender: 'changeRecord' }
        },
        {
          title: '联系次数',
          dataIndex: 'contactNum'
        },
        {
          title: '录入时间',
          dataIndex: 'createTime'
          // sorter: true
        },
        {
          title: '操作',
          dataIndex: 'action',
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
        return getCommonList(Object.assign(parameter, this.queryParam))
          .then(res => {
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
      this.salesJurisdiction = res.data
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
        if (to.name === 'CommonCutomerList') {
          this.$refs.table.refresh()
        }
      },
      immediate: true
    }
  },
  methods: {
    extract (customerId) { // 提取客户
      extractCustomer({ customerId: customerId }).then(res => {
        if (res.code === 200) {
          this.$refs.table.refresh()
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    reAllocate (cId) { // 再分配
      reAllocate({ cId: cId }).then(res => {
        if (res.code === 200) {
          this.$refs.table.refresh()
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    addContactNum (cId) {
      addContactNum({ 'cId': cId }).then(res => {
        if (res.code === 200) {
          this.$refs.table.refresh()
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    toAdd () {
      this.$refs.commonStepForm.add()
    },
    handleEdit (cId) { // 修改
      this.$refs.commonStepForm.edit(cId)
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
    getChangeRecord (cId) {
      getChangeRecord({ cId: cId }).then(res => {
        if (res.code === 200) {
          this.$refs.changeRecord.show(res.data)
        } else {
          this.$message.error(res.msg)
        }
      })
    }
  }
}
</script>

<style  scoped>
  .depcustomer-list-wrapper >>> .ant-pagination-total-text{
    color: red;
  }
</style>