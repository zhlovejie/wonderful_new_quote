<template>
  <a-form-model ref="ruleForm" class="routine-addform-wrapper-baseInnerData">
    <div v-if="!Conference" style="margin-top: 20px">
      <h4>培训记录</h4>
      <a-table :columns="columns" :dataSource="dataSource" :pagination="false" size="small">
        <div slot="nextMeetingCode" slot-scope="text, record, index">
          <a @click="doAction('view', record)">查看</a>
        </div>
      </a-table>
    </div>
    <div class="saveOk">
      <a-button type="primary" style="margin-right: 10px" v-if="!isResults && !Conference" @click="validate(2)"
        >结束培训</a-button
      >

      <a-button type="primary" style="margin-right: 10px" v-if="Conference" @click="validate(1)">发起培训</a-button>
      <a-button style="margin-right: 10px" v-if="!isResults" @click="handleGo">取消</a-button>
    </div>
    <AddForm key="k1" ref="addForm" />
  </a-form-model>
</template>

<script>
import { startTraining, finishTraining } from '@/api/projectManagement'
import AddForm from './AddForm'
import moment from 'moment'
export default {
  inject: ['normalAddForm'],
  components: {
    AddForm,
  },
  computed: {
    isResults() {
      //可行性测试结果评审
      return (
        this.normalAddForm.isView ||
        this.normalAddForm.isApproval ||
        (this.normalAddForm.isHandle && this.normalAddForm.status !== 14)
      )
    },
    Conference() {
      //会议记录显示
      return this.normalAddForm.ProcessReleaseData.length === 0
    },
  },
  data() {
    return {
      columns: [
        {
          align: 'center',
          title: '发起人',
          dataIndex: 'createdName',
        },
        {
          align: 'center',
          title: '发起时间',
          dataIndex: 'createdTime',
        },
        {
          align: 'center',
          title: '结束时间',
          dataIndex: 'endTime',
        },
        {
          align: 'center',
          title: '会议记录',
          dataIndex: 'nextMeetingCode',
          scopedSlots: { customRender: 'nextMeetingCode' },
        },
      ],

      spinning: false,
      dataSource: [],
      Noshow: false,
      queryOneData: {},
      details: {},
    }
  },
  watch: {
    'normalAddForm.ProcessReleaseData': function (newVal, oldVal) {
      console.log(newVal, oldVal)
      if (newVal) {
        this.queryOneData = newVal
        this.init()
      }
    },
  },
  created() {},
  methods: {
    init() {
      const that = this
      if (that.queryOneData) {
        that.dataSource = that.normalAddForm.ProcessReleaseData
      }
    },
    moment,
    validate(type) {
      let that = this
      if (type === 1) {
        startTraining(`projectId=${that.normalAddForm.allInfo.id}`)
          .then((res) => {
            if (res.code === 200) {
              that.$message.info(res.msg)
              that.$router.go(-1)
            } else {
              that.$message.error(res.msg)
            }
          })
          .catch((err) => (that.spinning = false))
      } else {
        finishTraining(`projectId=${that.normalAddForm.allInfo.id}`)
          .then((res) => {
            if (res.code === 200) {
              that.$message.info(res.msg)
              that.$router.go(-1)
            } else {
              that.$message.error(res.msg)
            }
          })
          .catch((err) => (that.spinning = false))
      }
    },
    doAction(type, record) {
      this.$refs.addForm.query(type, record)
    },
    handleGo() {
      this.$router.go(-1)
    },
  },
}
</script>

<style scoped>
.saveOk {
  margin-top: 20px;
  text-align: center;
}
.routine-addform-wrapper-baseInnerData >>> .ant-form-item {
  display: flex;
  margin: 0;
  margin-top: 13px;
}
.routine-addform-wrapper-baseInnerData >>> .ant-form-item .ant-form-item-label {
  width: auto;
  text-align: left;
}
.routine-addform-wrapper-baseInnerData >>> .ant-form-item .ant-form-item-control-wrapper {
  flex: 1;
}
.custom-table-border th,
.custom-table-border td {
  padding: 5px;
}
.custom-table-border caption {
  text-align: left;
}
.icon-required::before {
  display: inline-block;
  margin-right: 4px;
  color: #f5222d;
  font-size: 14px;
  font-family: SimSun, sans-serif;
  line-height: 1;
  content: '*';
}
</style>