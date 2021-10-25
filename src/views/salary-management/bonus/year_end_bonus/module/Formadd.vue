<template>
  <a-modal
    :title="modalTitle"
    :width="1005"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
    :confirmLoading="spinning"
  >
    <template slot="footer">
      <template>
        <a-button key="back" @click="handleCancel">取消</a-button>
        <a-button key="submit" type="primary" :loading="spinning" v-if="isHandle" @click="handleOk">完结</a-button>
        <a-button key="submit" type="primary" :loading="spinning" v-else @click="handleOk">确定</a-button>
        <!-- isHandle -->
      </template>
    </template>

    <a-spin :spinning="spinning">
      <a-form :form="form" class="becoming-form-wrapper">
        <h1 style="text-align: center">{{ year }}年终奖金规则</h1>

        <h3>发放规则</h3>
        <table class="custom-table custom-table-border">
          <tr v-for="(item, index) in planList" :key="item.index">
            <td style="width: 150px">{{ getStateText(index + 1) }}期比例（%）</td>
            <td style="width: 35%">
              {{ item.percentage }}
            </td>
            <td>发放时间</td>
            <td>
              {{ item.grantDate }}
            </td>
          </tr>
        </table>
        <h3 style="margin-top：15px">奖金明细</h3>
        <table class="custom-table custom-table-border">
          <tr>
            <th>序号</th>
            <th>部门</th>
            <th>岗位</th>
            <th>姓名</th>
            <th>年终奖金</th>
            <th>{{ details.batchCode }}期奖金</th>
          </tr>
          <tr v-for="(item, index) in programme" :key="item.key">
            <td>
              {{ index + 1 }}
            </td>
            <td>{{ item.departmentName }}</td>
            <td>{{ item.stationName }}</td>
            <td>{{ item.userName }}</td>
            <td>
              {{ item.amount }}
            </td>

            <td>{{ item.grantAmount }}</td>
          </tr>
          <tr>
            <td colspan="4">合计：</td>
            <td>{{ totalPrice }}</td>
            <td>{{ totalPhase }}</td>
          </tr>
        </table>
      </a-form>
    </a-spin>
  </a-modal>
</template>
<script>
import { getDepartmentUser, bounsRules_handle, year_send_getDetail } from '@/api/bonus_management'
import { getDevisionList } from '@/api/systemSetting'
let uuid = () => Math.random().toString(32).slice(-10)

export default {
  name: 'BecomingForm',
  components: {},
  data() {
    return {
      // 部门列表
      loading: false,
      planList: [],
      programme: [],
      visible: false,
      spinning: false,
      year: undefined,
      form: this.$form.createForm(this, { name: 'do_becoming' }),
      type: 'view',
      record: {},
      details: {},
    }
  },
  computed: {
    modalTitle() {
      if (this.isEditSalary) {
        return '修改年终奖金明细'
      }
      let txt = this.isView ? '查看' : this.isEdit ? '审核' : this.isView5 ? '查看' : '新增'
      return `${txt}年终奖金明细`
    },
    isView() {
      //查看
      return this.type === 'view'
    },
    isView5() {
      //查看
      return this.type === 'view5'
    },
    isHandle() {
      //查看
      return this.type === 'handle'
    },

    isEdit() {
      //审核
      return this.type === 'edit'
    },
    isApproval() {
      //通过不通过
      return this.type === 'edit'
    },
    isEditSalary() {
      //修改
      return this.type === 'edit-salary'
    },
    isDisabled() {
      return this.isView || this.isEdit || this.isView5
    },
    totalPrice() {
      return this.programme.reduce((addr, item) => {
        addr = Number(addr) + Number(item.amount)
        return parseFloat(addr).toFixed(2)
      }, 0)
    },
    totalPhase() {
      return this.programme.reduce((addr, item) => {
        addr = Number(addr) + Number(item.grantAmount || 0)
        return parseFloat(addr).toFixed(2)
      }, 0)
    },
  },
  created() {
    getDevisionList().then((res) => {
      this.departmentList = res.data
    })
    getDepartmentUser().then((res) => {
      this.treeData = res.data.map((i) => {
        return {
          departmentName: i.departmentName,
          userId: i.departmentId,
          title: i.departmentName,
          key: uuid(),
          children: i.userListsVos.map((s) => {
            return {
              departmentId: s.departmentId,
              departmentName: s.departmentName,
              stationId: s.stationId,
              stationName: s.stationName,
              userId: s.userId,
              userName: s.userName,
              title: s.userName,
              key: uuid(),
            }
          }),
        }
      })
    })
  },

  methods: {
    query(type, record) {
      this.visible = true
      this.type = type
      this.record = record
      this.fillData()
      this.year = record.applyDate
    },
    // 详情
    fillData() {
      let that = this
      that.$nextTick(() => {
        year_send_getDetail({ id: that.record.id }).then((res) => {
          that.details = res.data
          that.planList = res.data.salaryBonusAnnualRules
          that.programme = res.data.salaryBonusAnnualDetailedUserDetailVos
        })
      })
    },
    getStateText(state) {
      let stateMap = {
        1: '一',
        2: '二',
        3: '三',
        4: '四',
        5: '五',
        6: '六',
        7: '七',
        8: '八',
        9: '九',
        10: '十',
        11: '十一',
        12: '十二',
      }
      return stateMap[state]
    },

    handleOk() {
      // console.log('你是要提交')
      let that = this
      if (that.type === 'view') {
        this.visible = false
      } else {
        bounsRules_handle({ id: this.record.id })
          .then((res) => {
            if (res.code === 200) {
              this.programme = []
              that.planList = []
              this.visible = false
              that.spinning = false
              that.$message.info(res.msg)
              that.$emit('finish')
            }
          })
          .catch((err) => (that.spinning = false))
      }
    },
    handleCancel() {
      this.programme = []
      this.planList = []
      this.remark = '' // 清空表
      this.visible = false
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