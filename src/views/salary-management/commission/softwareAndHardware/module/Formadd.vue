<template>
  <a-modal
    :title="modalTitle"
    :width="1200"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
    :confirmLoading="spinning"
  >
    <template slot="footer">
      <template v-if="isApproval">
        <a-button class="a-button" type="primary" icon="close" @click="noPassAction(recordDetails)">不通过</a-button>
        <a-button class="a-button" type="primary" icon="check" @click="passAction()">通过</a-button>
      </template>
      <template v-else>
        <a-button key="back" @click="handleCancel">取消</a-button>
        <a-button key="submit" type="primary" :loading="spinning" @click="handleOk">确定</a-button>
      </template>
    </template>

    <a-spin :spinning="spinning">
      <a-form :form="form" class="becoming-form-wrapper">
        <a-row>
          <a-col :span="24" class="basic-tit" justify="center" align="middle"
            >{{ record.staticsDate }}软件提成奖金统计表</a-col
          >
        </a-row>
        <a-alert :message="percentageRetio" type="info" style="float: left; width: 200px; margin: 20px 0" />
        <a-table :columns="columns" :pagination="false" rowKey="id" :dataSource="saleCustomers"> </a-table>
      </a-form>
      <a-form :form="form" class="becoming-form-wrapper" style="margin: 30px 0">
        <a-row>
          <a-col :span="24" class="basic-tit" justify="center" align="middle"
            >{{ record.staticsDate }}硬件提成奖金统计表</a-col
          >
        </a-row>
        <a-alert :message="developmentAmount" type="info" style="float: left; width: 200px; margin: 20px 0" />
        <a-table :columns="columns" :pagination="false" rowKey="id" :dataSource="saleCustomers1"> </a-table>
      </a-form>
      <Approval ref="approval" @opinionChange="opinionChange" />
    </a-spin>
  </a-modal>
</template>
<script>
import { softHardPercentageBonus_Apply, softHardPercentageBonus_Detail } from '@/api/bonus_management'
import Approval from './Approval'
export default {
  name: 'BecomingForm',
  components: {
    Approval: Approval,
  },
  data() {
    return {
      remark: '',
      visible: false,
      memberLoading: false,
      dataSource: [],
      userList: [],
      month: undefined,
      percentageRetio: '',
      developmentAmount: '',
      departmentId: undefined,
      saleCustomers: [],
      saleCustomers1: [],
      columns: [
        {
          align: 'center',
          title: '部门',
          key: 'departmentName',
          dataIndex: 'departmentName',
        },
        {
          align: 'center',
          title: '岗位',
          dataIndex: 'stationName',
          key: 'stationName',
        },
        {
          align: 'center',
          title: '姓名',
          dataIndex: 'userName',
          key: 'userName',
        },
        {
          align: 'center',
          title: '差额',
          dataIndex: 'subAmount',
          key: 'subAmount',
        },

        {
          align: 'center',
          title: '提成金额',
          dataIndex: 'percentageAmount',
          key: 'percentageAmount',
        },
      ],

      spinning: false,
      form: this.$form.createForm(this, { name: 'do_becoming' }),
      type: 'view',
      record: {},
      assetTypeList: undefined,
    }
  },

  computed: {
    modalTitle() {
      let txt = this.isView ? '查看' : '审核'
      return `${txt}研发提成奖金`
    },
    isView() {
      //查看
      return this.type === 'view'
    },
    isApproval() {
      //通过不通过
      return this.type === 'Approval'
    },

    isDisabled() {
      return this.isView || this.isEdit || this.isView5
    },
  },
  methods: {
    //接受数据
    query(type, record) {
      let _that = this
      _that.dataSource = []
      _that.saleCustomers = []
      _that.saleCustomers1 = []
      _that.percentageRetio = ''
      _that.developmentAmount = ''
      _that.visible = true
      _that.type = type
      _that.record = record
      _that.fillData()
    },
    // 详情
    fillData() {
      let that = this
      that.$nextTick(() => {
        softHardPercentageBonus_Detail({ id: that.record.id }).then((res) => {
          this.saleCustomers = res.data[0].softHardPercentageBonusDetailVo
          this.percentageRetio = `软件总提成（元）: ${res.data[0].percentageRetio}`
          this.saleCustomers1 = res.data[1].softHardPercentageBonusDetailVo
          this.developmentAmount = `硬件总提成（元）: ${res.data[1].percentageRetio}`
        })
      })
    },
    //提交
    handleOk() {
      let that = this
      that.visible = false
    },
    handleCancel() {
      this.programme = []
      this.visible = false
    },
    // 审批
    submitAction(opt) {
      let that = this
      let values = {
        approveId: this.record.id,
        isAdopt: opt.isAdopt,
        opinion: opt.opinion,
      }
      that.spinning = true
      softHardPercentageBonus_Apply(values)
        .then((res) => {
          that.spinning = false
          that.form.resetFields() // 清空表
          that.visible = false
          that.$message.info(res.msg)
          that.$emit('finish')
        })
        .catch((err) => (that.spinning = false))
    },
    passAction() {
      this.submitAction({
        isAdopt: 0,
        // opinion: '通过',
      })
    },
    noPassAction() {
      let that = this
      that.$refs.approval.query()
    },
    opinionChange(opinion) {
      //审批意见
      this.submitAction({
        isAdopt: 1,
        opinion: opinion,
      })
    },
  },
}
</script>
<style scoped>
/*自定义table样式*/
.custom-table {
  margin-bottom: 0;
}

.custom-table-border th,
.custom-table-border td {
  padding: 5px 10px;
}

.custom-table >>> .custom-table {
  position: relative;
  top: 0;
  left: 0;
  width: calc(100% + 2px);
  margin-bottom: -2px;
}
.custom-table >>> .custom-table td {
  text-align: left;
}
.becoming-form-wrapper >>> .ant-form-item {
  margin-bottom: 0;
}

.bank-card-list-wrapper {
  display: flex;
}
.bank-card-list-wrapper >>> .ant-form-item {
  display: flex;
  margin: 0 7px;
}
</style>