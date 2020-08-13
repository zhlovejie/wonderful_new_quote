<template>
  <a-modal
    :title="modalTitle"
    :width="980"
    :visible="visible"
    :destroyOnClose="true"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :confirmLoading="spinning"
    :maskClosable="false"
  >
    <a-spin :spinning="spinning">
      <a-form :form="form">
        <table class="custom-table custom-table-border">
          <tr>
            <td>部门</td>
            <td>
              <a-select
                style="width:200px; margin-right: 10px;"
                v-decorator="['departmentId']"
                :disabled="isDisabled"
                @change=" depChangeHandler"
                placeholder="请选择部门"
              >
                <a-select-option
                  v-for="item in departmentList"
                  :key="item.id"
                  :value="item.id"
                >{{ item.departmentName }}</a-select-option>
              </a-select>
            </td>
            <td>岗位</td>
            <td>
              <a-select
                placeholder="选择岗位"
                v-decorator="['stationId']"
                :disabled="isDisabled"
                :allowClear="true"
                style="width: 200px"
              >
                <a-select-option
                  v-for="item in postSelectDataSource"
                  :key="item.id"
                  :value="item.id"
                >{{item.stationName}}</a-select-option>
              </a-select>
            </td>
          </tr>
        </table>
        <h3>有保险</h3>
        <table class="custom-table custom-table-border">
          <tr v-for="(item ,index) in todayList" :key="index">
            <td style="width:150px;">{{'合同'}}{{index + 1}}</td>
            <td>
              <a-form-item>
                <a-input
                  :disabled="isView"
                  placeholder
                  v-decorator="[`todayList.${index}.content`, {initialValue:todayList[index].content, rules: [{ required: true, message: '请选择合同协议' }] }]"
                  @click="selectCustomer"
                />
              </a-form-item>
            </td>
            <td style="width:70px;" v-if="!isView">
              <a-form-item>
                <a href="javascript:void(0);" @click="delItem('todayList',index)">删除</a>
              </a-form-item>
            </td>
          </tr>
        </table>
        <a-button
          v-if="!isView"
          style="width:100%;"
          type="dashed"
          icon="plus"
          @click="addItem('todayList')"
        >添加</a-button>
        <h3>无保险</h3>
        <table class="custom-table custom-table-border">
          <tr v-for="(item ,index) in planList" :key="index">
            <td style="width:150px;">{{'合同'}}{{index + 1}}</td>
            <td>
              <a-form-item>
                <a-input
                  :disabled="isView"
                  placeholder
                  v-decorator="[`planList.${index}.content`, {initialValue:planList[index].content, rules: [{ required: true, message: '请选择合同协议' }] }]"
                />
              </a-form-item>
            </td>
            <td style="width:70px;" v-if="!isView">
              <a-form-item>
                <a href="javascript:void(0);" @click="delItem('planList',index)">删除</a>
              </a-form-item>
            </td>
          </tr>
        </table>
        <a-button
          v-if="!isView"
          style="width:100%;"
          type="dashed"
          icon="plus"
          @click="addItem('planList')"
        >添加</a-button>
      </a-form>
      <ReceiptSaleContract ref="receiptContract" @onSelect="contractChange" />
    </a-spin>
  </a-modal>
</template>
<script>
// import { workReportSetDailyDetail, workReportSetDailySaveAndUpdate } from '@/api/workReportManagement'
// 部门岗位接口
import { getDevisionList, getStationList } from '@/api/systemSetting'
import moment from 'moment'
import { mapGetters } from 'vuex'
//合同列表选择
import ReceiptSaleContract from './CutomerList'
export default {
  name: 'AddForm',
  components: {
    ReceiptSaleContract,
  },
  data() {
    return {
      // 部门列表
      departmentList: [],
      postSelectDataSource: [], //岗位接口
      departmentId: '', //要删
      stationId: '', //要删
      form: this.$form.createForm(this),
      visible: false,
      spinning: false,
      type: 'view',
      // departmentName: undefined,
      // stationName: undefined,
      // trueName: undefined,
      // reportNum: undefined,
      record: {},
      todayList: [],
      planList: [],
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    modalTitle() {
      return `${this.isView ? '查看' : this.isAdd ? '新增' : '编辑'}岗位`
    },
    isView() {
      return this.type === 'view'
    },
    isEdit() {
      return this.type === 'edit'
    },
    isAdd() {
      return this.type === 'add'
    },
    isDisabled() {
      return this.isView || this.isEdit
    },
  },
  created() {
    getDevisionList().then((res) => {
      this.departmentList = res.data
    })
  },
  methods: {
    //点击调用岗位接口
    depChangeHandler(dep_id) {
      let that = this
      that.postSelectDataSource = []
      return getStationList({ id: dep_id }).then((res) => {
        that.postSelectDataSource = res.data
      })
    },
    //点击显示列表组件
    selectCustomer() {
      this.$refs.receiptContract.query({ type: 1 })
    },
    contractChange(data) {
      const that = this
      console.log(data)
      that.contractId = data.id
      that.form.setFieldsValue({
        contractNum: data.contractNum,
        customerName: data.customerName,
        customerId: data.customerId,
      })
    },
    addItem(key) {
      this[key].push({
        content: undefined,
        progress: undefined,
      })
    },
    delItem(key, index) {
      let _d = [...this[key]]
      _d.splice(index, 1)
      this[key] = [..._d]
    },
    async query(type, record) {
      let that = this
      that.visible = true
      that.dataReset()
      that.type = type
      console.log(that)
      that.record = Object.assign({}, record)
      that.form.resetFields()
      await that.initData()

      if (that.isView || that.isEdit) {
        workReportSetDailyDetail({ id: that.record.id }).then((res) => {
          that.fillData(res.data)
        })
      } else {
        that.departmentName = that.userInfo.departmentName
        that.stationName = that.userInfo.stationName
        that.trueName = that.userInfo.trueName
        that.addItem('todayList')
        that.addItem('todayList')
        that.addItem('todayList')
        that.addItem('planList')
      }
    },
    initData() {
      let that = this
      let queue = []
      return Promise.all(queue)
    },
    async fillData(resultData) {
      let that = this

      that.reportNum = resultData.dailyNum
      that.departmentName = resultData.departmentName
      that.stationName = resultData.stationName
      that.trueName = resultData.userName
      that.todayList = resultData.todayList || []
      that.planList = resultData.planList || []
      if (Array.isArray(resultData.annexList)) {
        that.fileList = resultData.annexList.map((item, index) => {
          return {
            uid: String(index + 1),
            name: item.workUrl,
            status: 'done',
            url: item.workUrl,
          }
        })
      }
    },
    handleSubmit() {
      let that = this

      if (that.isView) {
        that.handleCancel()
        return
      }
      if (that.todayList.length === 0) {
        that.$message.info('请填写今日工作内容')
        return
      }
      if (that.planList.length === 0) {
        that.$message.info('请填写明日工作计划')
        return
      }

      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          let _values = {}
          let { todayList, planList } = values
          todayList = todayList.map((item, index) => {
            item.orderNum = index + 1
            return item
          })

          planList = planList.map((item, index) => {
            item.orderNum = index + 1
            return item
          })
          let annexList = that.fileList.map((item, index) => {
            return {
              orderNum: index + 1,
              workUrl: item.url,
            }
          })

          // _values.dailyNum = ''
          // _values.departmentId = ''
          // _values.stationId = ''

          _values.todayList = todayList
          _values.planList = planList
          _values.annexList = annexList

          if (that.isEdit) {
            _values.id = that.record.id
          }
          that.spinning = true
          workReportSetDailySaveAndUpdate(_values)
            .then((res) => {
              that.spinning = false
              if (res.code === 200) {
                that.handleCancel()
                that.$message.success('操作成功')
                that.$emit('finish')
              } else {
                that.$message.warning(res.msg)
              }
            })
            .catch((err) => {
              that.spinning = false
              that.$message.error('操作失败')
            })
        }
      })
    },
    handleCancel() {
      this.dataReset()
      this.$nextTick(() => (this.visible = false))
    },
    dataReset() {
      this.form.resetFields()
      this.todayList = []
      this.planList = []
      this.fileList = []
    },
    handleChange(info) {
      console.log(arguments)
      let fileList = [...info.fileList]
      fileList = fileList.map((file) => {
        if (file.response && file.response.code === 200) {
          file.url = file.response.data
        }
        return file
      })
      this.fileList = fileList
    },
  },
}
</script>
<style scoped>
.report-day-header h2 {
  text-align: center;
}
.custom-table-border th,
.custom-table-border td {
  padding: 10px;
}
.custom-table-border >>> .ant-form-item {
  margin-bottom: 0;
}
i.wdf-required::before {
  display: inline-block;
  margin-right: 4px;
  color: #f5222d;
  font-size: 14px;
  font-family: SimSun, sans-serif;
  font-style: normal;
  line-height: 1;
  content: '*';
}
</style>
