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
        <h1 style="text-align: center">{{ year }}年度培训方案</h1>
        <table class="custom-table custom-table-border" v-for="(item, key) in programme" :key="item.key">
          <tr>
            <th v-show="false">
              <a-form-item>
                <a-input
                  :disabled="isDisabled"
                  placeholder
                  v-decorator="[
                    `programme.${key}.month`,
                    { initialValue: item.monthId, rules: [{ required: false, message: '' }] },
                  ]"
                />
              </a-form-item>
            </th>
            <th colspan="3">
              {{ item.month }}月
              <span style="float: right" v-if="!isDisabled">
                <a href="javascript:void(0);" @click="delItem(key)">删除</a>
              </span>
            </th>
          </tr>
          <tr>
            <th>培训主题</th>
            <th>参与人员</th>
            <th>预估时间</th>
          </tr>
          <tr v-for="(items, index) in item.oaTrainYearPlanItemDetailSaveBoList" :key="items.key">
            <td>
              <a-form-item>
                <a-input
                  :disabled="isDisabled"
                  placeholder
                  @change="inputChange($event, item.key, items.key, 'title')"
                  v-decorator="[
                    `programme.${key}.oaTrainYearPlanItemDetailSaveBoList.${index}.title`,
                    { initialValue: items.title, rules: [{ required: true, message: '请输入培训主题' }] },
                  ]"
                />
              </a-form-item>
            </td>
            <td>
              <a-form-item>
                <a-input
                  :disabled="isDisabled"
                  placeholder
                  @change="inputChange($event, item.key, items.key, 'joinPerson')"
                  v-decorator="[
                    `programme.${key}.oaTrainYearPlanItemDetailSaveBoList.${index}.joinPerson`,
                    { initialValue: items.joinPerson, rules: [{ required: true, message: '请输入参与人员' }] },
                  ]"
                />
              </a-form-item>
            </td>
            <td>
              <a-form-item>
                <a-range-picker
                  :disabled="isDisabled"
                  @change="inputChange($event, item.key, items.key, 'beginData')"
                  v-decorator="[
                    `programme.${key}.oaTrainYearPlanItemDetailSaveBoList.${index}.beginData`,
                    { initialValue: items.beginData, rules: [{ required: true, message: '请输入预估时间' }] },
                  ]"
                  :defaultPickerValue="[
                    moment(`${year}-0${item.monthId}-01`, 'YYYY-MM-DD'),
                    moment(`${year}-0${item.monthId}-01`, 'YYYY-MM-DD'),
                  ]"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="3">
              <a-button
                :disabled="isDisabled"
                style="width: 100%"
                type="dashed"
                icon="plus"
                @click="addItem(key)"
              ></a-button>
            </td>
          </tr>
        </table>
      </a-form>
      <a-button :disabled="isDisabled" style="width: 100%" type="dashed" icon="plus" @click="addItemMonth"
        >新增月份</a-button
      >
      <table class="custom-table custom-table-border">
        <tr>
          <td>备注</td>
          <td colspan="3">
            <a-textarea :disabled="isDisabled" :rows="3" v-model="remark" />
          </td>
        </tr>
      </table>
      <a-modal v-model="visibleMonth" title="新增月份" @ok="handleOkMonth">
        <a-select placeholder="月份" v-model="monthsll" :allowClear="true" style="width: 280px; margin-left: 90px">
          <a-select-option
            v-for="(item, index) in monthList"
            :key="index"
            @click="departmentChange(item.name, item.id)"
            :value="item.id"
            >{{ item.name }}</a-select-option
          >
        </a-select>
      </a-modal>
      <Approval ref="approval" @opinionChange="opinionChange" />
    </a-spin>
  </a-modal>
</template>
<script>
import { annualAdd, annualDetail, annualisAdopt } from '@/api/training-management'
import moment from 'moment'
import Approval from './Approval'

let uuid = () => Math.random().toString(32).slice(-10)

export default {
  name: 'BecomingForm',
  components: {
    Approval: Approval,
  },
  data() {
    return {
      monthList: [
        { name: '一', id: 1 },
        { name: '二', id: 2 },
        { name: '三', id: 3 },
        { name: '四', id: 4 },
        { name: '五', id: 5 },
        {
          name: '六',
          id: 6,
        },
        {
          name: '七',
          id: 7,
        },
        {
          name: '八',
          id: 8,
        },
        {
          name: '九',
          id: 9,
        },
        {
          name: '十',
          id: 10,
        },
        {
          name: '十一',
          id: 11,
        },
        {
          name: '十二',
          id: 12,
        },
      ],
      todayList: [],
      programme: [],
      beginData: [],
      month: '',
      monthsll: '',
      remark: '',
      months: '',
      visible: false,
      visibleMonth: false,
      year: '',
      spinning: false,
      ment: false,
      form: this.$form.createForm(this, { name: 'do_becoming' }),
      type: 'view',
      record: {},
      isModified: false, //财务人员为 true
      previewVisible: false,
    }
  },
  computed: {
    modalTitle() {
      if (this.isEditSalary) {
        return '修改年度培训方案'
      }
      let txt = this.isView ? '查看' : this.isEdit ? '审核' : this.isView5 ? '查看' : '新增'
      return `${txt}年度培训方案`
    },
    isView() {
      //查看
      return this.type === 'view'
    },
    isView5() {
      //查看
      return this.type === 'view5'
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
  },
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'human_Resources_leagueBuilding') {
          this.init()
        }
      },
      immediate: true,
    },
  },
  methods: {
    moment,
    inputChange(event, key, keys, field) {
      let programme = [...this.programme]
      let target = programme.find((item) => item.key === key)
      let targets = target.oaTrainYearPlanItemDetailSaveBoList.find((items) => items.key === keys)
      if (targets) {
        targets[field] = event instanceof Event ? event.target.value : event
        this.programme = programme
      }
    },
    addItem(index) {
      this.programme[index].oaTrainYearPlanItemDetailSaveBoList.push({
        key: uuid(),
        title: undefined,
        joinPerson: undefined,
        beginData: undefined,
      })
    },
    //添加月份
    addItemMonth() {
      this.visibleMonth = true
    },
    //删除月份
    delItem(key) {
      // this.programme = this.programme.filter((item) => item.key !== key)
      this.programme.splice(key, 1)
    },
    handleOkMonth() {
      this.visibleMonth = false
      let arr = this.programme.some((item) => {
        return item.month === this.month
      })
      this.handle = this.month
      if (!arr && this.monthsll) {
        this.addprogramme(this.handle, this.months)
        this.month = ''
        this.monthsll = ''
      } else {
        this.$message.error('月份不能重复添加')
      }
    },
    addprogramme(name, ids) {
      let that = this
      that.programme.push({
        key: uuid(),
        month: name,
        monthId: ids,
        oaTrainYearPlanItemDetailSaveBoList: [
          {
            key: uuid(),
            title: undefined,
            joinPerson: undefined,
            beginData: undefined,
          },
        ],
      })
    },
    departmentChange(name, id) {
      this.months = id
      this.month = name
    },
    query(type, record) {
      this.visible = true
      this.type = type
      this.record = record
      if (type === 'add') {
        this.addprogramme('一', 1)
        this.addprogramme('二', 2)
        this.addprogramme('三', 3)
        this.year = moment(record.year).format('YYYY')
      } else {
        this.fillData()
      }
    },
    // 详情
    fillData() {
      let that = this
      let id = {
        oaTrainYearPlanId: this.record.id,
      }
      annualDetail(id).then((res) => {
        this.year = res.data.year
        this.remark = res.data.remark
        this.programme = res.data.planItemList.map((item) => {
          let arr = item.itemList.map((i) => {
            return {
              beginData: [moment(i.beginTime), moment(i.endTime)],
              beginTime: moment(i.beginTime),
              endTime: moment(i.endTime),
              joinPerson: i.joinPerson,
              title: i.title,
            }
          })
          return {
            month: item.monthStr,
            monthId: item.month,
            oaTrainYearPlanItemDetailSaveBoList: arr,
          }
        })
      })
    },

    handleOk() {
      let that = this
      if (that.type === 'view') {
        this.visible = false
      } else {
        that.form.validateFields((err, values) => {
          if (!err) {
            values.year = Number(this.year)
            values.remark = this.remark
            values.planItemList = values.programme
            delete values.programme
            values.planItemList = values.planItemList.map((item) => {
              let num = item.oaTrainYearPlanItemDetailSaveBoList.map((items) => {
                return {
                  beginTime: moment(items.beginData[0]).format('YYYY-MM-DD'),
                  endTime: moment(items.beginData[1]).format('YYYY-MM-DD'),
                  joinPerson: items.joinPerson,
                  title: items.title,
                }
                delete items.beginData
              })
              return { month: item.month, oaTrainYearPlanItemDetailSaveBoList: num }
            })
            if (that.type === 'edit-salary') {
              values.id = that.record.id
            }
            if (that.type === 'add' || that.type === 'edit-salary') {
              that.spinning = true
              annualAdd(values)
                .then((res) => {
                  this.programme = []
                  this.remark = ''
                  this.visible = false
                  that.spinning = false
                  that.$message.info(res.msg)
                  that.$emit('finish')
                })
                .catch((err) => (that.spinning = false))
            }
          }
        })
      }
    },
    handleCancel() {
      this.programme = []
      this.remark = '' // 清空表
      this.visible = false
    },
    submitAction(opt) {
      let that = this
      let values = {
        approveId: this.record.id,
        isAdopt: opt.isAdopt,
        opinion: opt.opinion,
      }
      that.spinning = true
      annualisAdopt(values)
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