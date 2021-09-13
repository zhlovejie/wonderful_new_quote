<template>
  <a-card :bordered="false">
    <!--增删模块-->
    <div class="table-operator">
      <template v-if="$auth('salesman:add')">
        <a-button v-if="salesJurisdiction.top || salesJurisdiction.service" type="primary" icon="plus" @click="toForm">新增</a-button>
      </template>
    </div>

    <a-table
      ref="table"
      rowKey="id"
      :columns="columns"
      :dataSource="salesmans"
      :pagination="false"
    >
      <span slot="canDistribute" slot-scope="text,record">
        <template v-if="$auth('salesman:edit')">
          <a-switch
            :disabled="!salesJurisdiction.top && !salesJurisdiction.service"
            checkedChildren="有"
            :defaultChecked="(text === 1) ? true : false"
            unCheckedChildren="无"
            @change="changeJurisdiction(text,record,'distribute')"/>
        </template>
      </span>
      <span slot="canExtract" slot-scope="text,record">
        <template v-if="$auth('salesman:edit')">
          <a-switch
            :disabled="!salesJurisdiction.top && !salesJurisdiction.service"
            checkedChildren="有"
            :defaultChecked="(text === 1) ? true : false"
            unCheckedChildren="无"
            @change="changeJurisdiction(text,record, 'extract')"/>
        </template>
      </span>
      <span slot="canEnterDep" slot-scope="text,record">
        <template v-if="$auth('salesman:edit')">
          <a-switch
            :disabled="!salesJurisdiction.top && !salesJurisdiction.service"
            checkedChildren="有"
            :defaultChecked="(text === 1) ? true : false"
            unCheckedChildren="无"
            @change="changeJurisdiction(text,record, 'enterDep')"/>
        </template>
      </span>
      <span slot="canEnterOther" slot-scope="text,record">
        <template v-if="$auth('salesman:edit')">
          <a-switch
            :disabled="!salesJurisdiction.top && !salesJurisdiction.service"
            checkedChildren="有"
            :defaultChecked="(text === 1) ? true : false"
            unCheckedChildren="无"
            @change="changeJurisdiction(text,record, 'enterOther')"/>
        </template>
      </span>
      <span slot="canEnterCommon" slot-scope="text,record">
        <template v-if="$auth('salesman:edit')">
          <a-switch
            :disabled="!salesJurisdiction.top && !salesJurisdiction.service"
            checkedChildren="有"
            :defaultChecked="(text === 1) ? true : false"
            unCheckedChildren="无"
            @change="changeJurisdiction(text,record, 'enterCommon')"/>
        </template>
      </span>
      <span slot="overduePunish" slot-scope="text,record">
        <template v-if="$auth('salesman:edit')">
          <a-switch
            :disabled="!salesJurisdiction.top && !salesJurisdiction.service"
            checkedChildren="有"
            :defaultChecked="(text === 1) ? true : false"
            unCheckedChildren="无"
            @change="changeJurisdiction(text,record, 'overduePunish')"/>
        </template>
      </span>
      <span slot="action" slot-scope="text,record">
        <template v-if="$auth('salesman:del')">
          <a-popconfirm
            v-if="salesJurisdiction.top || salesJurisdiction.service"
            title="确认删除这条数据？"
            @confirm="confirm(record.id)"
            okText="是"
            cancelText="否">
            <a href="#">删除</a>
          </a-popconfirm>
        </template>
        <template v-if="$auth('salesman:edit')">
          <a-divider type="vertical" />
          <a v-if="salesJurisdiction.top || salesJurisdiction.service" @click="toForm(record)">修改</a>
        </template>
      </span>
    </a-table>
    <add-salesman ref="addSalesman" @ok="handleOk"/>
  </a-card>
</template>

<script>
import { salesJurisdiction } from '@/api/customer'
import AddSalesman from './modules/AddSalesman'
import { getAllSalesman, delSalesman, editSalesman } from '@/api/customer/salesman'

export default {
  name: 'SalesmanList',
  components: { // 组件
    AddSalesman
  },
  data () {
    return {
      // 表头
      columns: [
        {
          title: '部门',
          dataIndex: 'departmentName'
        },
        {
          title: '岗位',
          dataIndex: 'stationName'
        },
        {
          title: '销售人名',
          dataIndex: 'salesmanName'
        },
        {
          title: '对应领导',
          dataIndex: 'leaderName'
        },
        {
          title: '对应销售助理',
          dataIndex: 'assistantName'
        },
        {
          title: '被分配权限',
          dataIndex: 'canDistribute',
          scopedSlots: { customRender: 'canDistribute' }
        },
        {
          title: '提取客户权限',
          dataIndex: 'canExtract',
          scopedSlots: { customRender: 'canExtract' }
        },
        {
          title: '录入部门客户权限',
          dataIndex: 'canEnterDep',
          scopedSlots: { customRender: 'canEnterDep' }
        },
        {
          title: '给他人录入客户权限',
          dataIndex: 'canEnterOther',
          scopedSlots: { customRender: 'canEnterOther' }
        },
        {
          title: '录入公共客户权限',
          dataIndex: 'canEnterCommon',
          scopedSlots: { customRender: 'canEnterCommon' }
        },
        {
          title: '未维护处罚',
          dataIndex: 'overduePunish',
          scopedSlots: { customRender: 'overduePunish' }
        },
        {
          title: '分配序号',
          dataIndex: 'distributeNum'
        },
        {
          title: '客户上限',
          dataIndex: 'maximum'
        },
        {
          title: '提取周期',
          dataIndex: 'recoverTime'
        },
        {
          title: '部门客户渠道周期',
          dataIndex: 'depCusDay'
        },
        {
          title: '自开发客户渠道周期',
          dataIndex: 'selfCusDay'
        },
        {
          title: '创建人',
          dataIndex: 'createName'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime'
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '120px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      salesmans: [],
      showMsg: false, // 是否显示提示框
      message: '', // 提示信息
      messageType: '', // 提示类型
      salesJurisdiction: {} // 当前用户销售权限
    }
  },
  created () { // 初始化钩子
    getAllSalesman().then(res => {
      if (res.code === 200) {
        this.salesmans = res.data
      } else {
        this.$message.error(res.msg)
      }
    })
    salesJurisdiction().then(res => { // 当前用户的销售权限
      var salesJurisdiction = res.data
      this.salesJurisdiction = salesJurisdiction
    }).catch(function (err) {
      console.log(err)
    })
  },
  methods: {
    handleOk () { // 重新加载数据
      let that = this
      that.salesmans =[]
      getAllSalesman().then(res => {
        console.log('ok==res', res)
        if (res.code === 200) {
          this.salesmans = [...res.data]
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    toForm (record) {
      this.$refs.addSalesman.showForm(record)
    },
    changeJurisdiction (text, record, type) {
      let status = 0
      if (text === 0) {
        status = 1
      }
      if (type === 'distribute') {
        this.$set(record, 'canDistribute', status)
      } else if (type === 'extract') {
        this.$set(record, 'canExtract', status)
      } else if (type === 'enterDep') {
        this.$set(record, 'canEnterDep', status)
      } else if (type === 'enterOther') {
        this.$set(record, 'canEnterOther', status)
      } else if (type === 'enterCommon') {
        this.$set(record, 'canEnterCommon', status)
      } else if (type === 'overduePunish') {
        this.$set(record, 'overduePunish', status)
      }
      editSalesman(record).then(res => {
        if (res.code === 200) {
          this.handleOk()
        } else {
          this.$message.error(res.msg)
        }
      }).catch(function (err) {
        console.log(err)
      })
    },
    confirm (id) { // 确认删除事件
      delSalesman({ id: id }).then(res => {
        if (res.code === 200) {
          this.handleOk()
        } else {
          this.$message.error(res.msg)
        }
      })
    }
  }
}
</script>
