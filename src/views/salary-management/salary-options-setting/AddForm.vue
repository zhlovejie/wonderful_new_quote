<template>
  <a-modal
    :title="modalTitle"
    :width="850"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <!-- <template slot="footer">
    <template v-if="isApproval && !isSelfApproval">
      <a-button key="back" icon="close" @click="noPassAction">不通过</a-button>
      <a-button key="submit" type="primary" icon="check" :loading="spinning" @click="passAction">通过</a-button>
    </template>
    <template v-else>
      <a-button key="back" @click="handleCancel">取消</a-button>
      <a-button key="submit" type="primary" :loading="spinning" @click="handleOk">{{isSelfApproval ? '保存提交' : '确定'}}</a-button>
    </template>
  </template> -->

    <a-spin :spinning="spinning">
      <a-form :form="form" class="add-form-wrapper">
        <a-form-item hidden>
          <a-input v-decorator="['id']" />
        </a-form-item>
        <a-form-item label="部门/岗位" v-if="isAdd">
          <a-select
            placeholder="部门"
            @change="depChange"
            v-model="departmentId"
            showSearch
            optionFilterProp="children"
            :filterOption="selectFilter"
            :allowClear="true"
          >
            <a-select-option v-for="item in depList" :key="item.id" :value="item.id">
              {{ item.departmentName }}
            </a-select-option>
          </a-select>
          <a-select
            placeholder="岗位"
            v-model="stationId"
            :allowClear="true"
            mode="multiple"
            showSearch
            optionFilterProp="children"
            :filterOption="selectFilter"
            @change="postChange"
          >
            <a-select-option v-for="item in postList" :key="item.id" :value="item.id">{{
              item.stationName
            }}</a-select-option>
          </a-select>
        </a-form-item>
        <h2 v-else>{{ fromSalaryDetail.departmentName }}/{{ fromSalaryDetail.stationName }}</h2>
        <p>薪资构成</p>
        <table class="custom-table custom-table-border">
          <tr v-for="(item, idx) in fromSalary" :key="idx">
            <td style="width: 100px">{{ item.name }}</td>
            <td>
              <a-select
                v-if="!isDisabled"
                :placeholder="item.name"
                :allowClear="true"
                mode="multiple"
                showSearch
                optionFilterProp="children"
                :filterOption="selectFilter"
                :value="item.val"
                @change="(e) => fromSalaryChange(item.key, e)"
              >
                <a-select-option v-for="opt in item.options" :key="opt.id" :value="opt.id">{{
                  opt.text
                }}</a-select-option>
              </a-select>
              <span v-else>{{ fromSalaryDetail[item.showkey] }}</span>
            </td>
          </tr>
        </table>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import {
  departmentList, //所有部门
  getStationList, //获取部门下面的岗位
} from '@/api/systemSetting'
//查询部门主管
import { getPositionManager } from '@/api/personnelManagement'
import { getDictionary } from '@/api/common'
import {
  oaSalaryConsistDetail,
  oaSalaryConsistAddOrUpdate,
  oaSalaryConsistIsAddByStationId,
} from '@/api/salaryManagement'
import moment from 'moment'

export default {
  name: 'AddForm',
  components: {},
  data() {
    return {
      departmentId: undefined,
      stationId: [],
      depList: [],
      postList: [],
      salaryList: [], //工资项目
      bonusList: [], //奖金项目
      subsidyList: [], //补贴项目
      deductionList: [], //扣款项目
      fromSalary: [],
      fromSalaryDetail: {},
      form: this.$form.createForm(this),
      visible: false,
      actionType: 'add',
      spinning: false,
    }
  },
  computed: {
    modalTitle() {
      let m = { view: '查看', add: '新增', edit: '修改', approval: '审批' }
      return `${m[this.actionType]}`
    },
    isView() {
      return this.actionType === 'view'
    },
    isAdd() {
      return this.actionType === 'add'
    },
    isEdit() {
      return this.actionType === 'edit'
    },
    isApproval() {
      return this.actionType === 'approval'
    },
    isDisabled() {
      //此状态下表单元素被禁用
      return this.isView || this.isApproval
    },
  },
  methods: {
    moment: moment,
    init() {
      let that = this
      return Promise.all([
        departmentList().then((res) => (that.depList = res.data)), //部门
        getDictionary({ text: '工资项' }).then((res) => (that.salaryList = res.data)),
        getDictionary({ text: '奖金项' }).then((res) => (that.bonusList = res.data)),
        getDictionary({ text: '补贴项' }).then((res) => (that.subsidyList = res.data)),
        getDictionary({ text: '扣款项' }).then((res) => (that.deductionList = res.data)),
      ]).then((res) => {
        let fromSalary = [
          {
            key: 'salary',
            skey: 'baseSalaryDicIds',
            showkey: 'baseSalaryDicText',
            name: '工资',
            options: that.salaryList,
            val: [],
          },
          {
            key: 'bonus',
            skey: 'bonusDicIds',
            showkey: 'bonusDicText',
            name: '奖金',
            options: that.bonusList,
            val: [],
          },
          {
            key: 'subsidy',
            skey: 'allowanceDicIds',
            showkey: 'allowanceDicText',
            name: '补贴',
            options: that.subsidyList,
            val: [],
          },
          {
            key: 'deduction',
            skey: 'fineDicIds',
            showkey: 'fineDicText',
            name: '扣款',
            options: that.deductionList,
            val: [],
          },
        ]
        that.fromSalary = fromSalary
      })
    },
    async handleOk() {
      let that = this
      if (that.isView || that.isApproval) {
        that.handleCancel()
        return
      }
      if (!that.departmentId) {
        that.$message.info('请选择部门')
        return
      }
      if (that.stationId.length === 0) {
        that.$message.info('请选择岗位')
        return
      }

      // for(let item of that.fromSalary){
      //   if(item.val.length === 0){
      //     that.$message.info(`${item.name}项尚未选择`)
      //     return
      //   }
      // }

      let consist = {}
      that.fromSalary.map((item) => (consist[item.skey] = item.val.join(',')))

      this.form.validateFields((err, values) => {
        if (!err) {
          let obj = {
            consist: {
              ...consist,
              departmentId: that.departmentId,
              stationId: that.stationId[0],
            },
            stationId: that.stationId.join(','),
          }

          if (that.isEdit) {
            obj.consist.id = that.fromSalaryDetail.id
          }
          that.spinning = true
          oaSalaryConsistAddOrUpdate(obj)
            .then((res) => {
              that.spinning = false
              let { code, msg } = res
              if (+code === 500) {
                that.$message.error(msg)
                return
              }
              that.$message.info(res.msg)
              that.$emit('finish')
              that.handleCancel()
            })
            .catch((err) => (that.spinning = false))
        }
      })
    },
    handleCancel() {
      this.form.resetFields()
      this.$nextTick(() => (this.visible = false))
    },
    async query(type, record) {
      let that = this
      that.visible = true
      that.actionType = type
      that.record = record || {}

      that.departmentId = undefined
      that.stationId = []
      that.depList = []
      that.postList = []
      that.fromSalary = []

      await that.form.resetFields()
      await that.init()
      if (type === 'add') return
      //填充数据
      oaSalaryConsistDetail({ id: that.record.id })
        .then((res) => {
          let result = res.data
          that.fromSalaryDetail = { ...result }
          that.departmentId = result.departmentId

          that.depChange(result.departmentId).then((res) => {
            that.stationId = [result.stationId]
          })

          let fromSalary = [...that.fromSalary]
          fromSalary.map((item) => {
            item.val = result[item.skey] ? result[item.skey].split(',').map((v) => +v) : []
            return item
          })
          that.fromSalary = fromSalary
        })
        .catch((err) => null)
    },
    depChange(dep_id) {
      let that = this
      return getStationList({ id: dep_id }).then((res) => {
        that.postList = res.data.map((item) => {
          item.stationId = item.id
          return item
        })
      })
    },
    postChange(plist) {
      let that = this
      return Promise.all(
        plist.map((postId) => {
          return new Promise((resolve, reject) => {
            oaSalaryConsistIsAddByStationId({ stationId: postId })
              .then((res) => resolve({ stationId: postId, code: +res.code }))
              .catch((err) => {
                resolve({ stationId: postId, code: 500, msg: err.message })
              })
          })
        })
      ).then((res) => {
        that.stationId = res.filter((item) => item.code === 200).map((item) => item.stationId)
        let repeatItems = res
          .filter((item) => item.code !== 200)
          .map((item) => {
            return that.postList.find((p) => p.id === item.stationId)
          })
        if (repeatItems.length > 0) {
          that.$message.info('以下岗位存在重复：' + repeatItems.map((p) => `【${p.stationName}】`).join(' , '))
        }
      })
    },
    selectFilter(input, option) {
      // 下拉框搜索
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    fromSalaryChange(key, list) {
      console.log(arguments)
      let that = this
      let fromSalary = [...that.fromSalary]
      let target = fromSalary.find((item) => item.key === key)
      if (target) {
        target.val = list
        that.fromSalary = fromSalary
      }
    },
  },
}
</script>

<style scoped>
.custom-table-border th,
.custom-table-border td {
  padding: 10px;
}

.add-form-wrapper >>> .custom-table {
  margin-bottom: 0;
}
.custom-table >>> .custom-table {
  margin: -1px;
}

.add-form-wrapper >>> .ant-form-item {
  display: flex;
  margin: 0;
}

.ant-form-item >>> .ant-form-item-label {
  width: 80px;
}
.ant-form-item >>> .ant-form-item-control-wrapper {
  flex: 1;
}
</style>