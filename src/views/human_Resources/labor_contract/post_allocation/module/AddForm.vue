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
              <a-form-item>
                <a-select
                  style="width:200px; margin-right: 10px;"
                  v-decorator="['departmentId',{ rules: [{ required: true, message: '请选择部门' }]}]"
                  :disabled="!isAdd"
                  @change=" depChangeHandler"
                  placeholder="请选择部门"
                >
                  <a-select-option
                    v-for="item in departmentList"
                    :key="item.id"
                    :value="item.id"
                  >{{ item.departmentName }}</a-select-option>
                </a-select>
              </a-form-item>
            </td>
            <td>岗位</td>
            <td>
              <a-form-item>
                <a-select
                  placeholder="选择岗位"
                  v-decorator="['stationId',{ rules: [{ required: true, message: '请选择合岗位' }]}]"
                  :disabled="!isAdd"
                  :allowClear="true"
                  style="width: 200px"
                >
                  <a-select-option
                    v-for="item in postSelectDataSource"
                    :key="item.id"
                    :value="item.id"
                  >{{item.stationName}}</a-select-option>
                </a-select>
              </a-form-item>
            </td>
          </tr>
        </table>
        <h3>有保险</h3>
        <table class="custom-table custom-table-border">
          <tr v-for="(item ,index) in todayList" :key="index">
            <td style="width:150px;">{{'合同'}}{{index + 1}}</td>
            <td>
              <!-- <a-form-item> -->
              <a-input
                :disabled="isDisabled"
                placeholder
                v-model="todayList[index].contractName"
                @click="selectCustomer('todayList',index)"
              />
            </td>
            <td style="width:70px;" v-if="!isEdit">
              <a-form-item>
                <a href="javascript:void(0);" @click="delItem('todayList',index)">删除</a>
              </a-form-item>
            </td>
          </tr>
        </table>
        <a-button
          :disabled="isDisabled"
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
              <!-- <a-form-item> -->
              <a-input
                :disabled="isDisabled"
                placeholder
                v-model="planList[index].contractName"
                @click="selectCustomer('planList',index)"
              />
            </td>
            <td style="width:70px;" v-if="!isEdit">
              <a-form-item>
                <a href="javascript:void(0);" @click="delItem('planList',index)">删除</a>
              </a-form-item>
            </td>
          </tr>
        </table>
        <a-button
          :disabled="isDisabled"
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
import { postAllocation_Add, postAllocation_Detail, postAllocation_Update } from '@/api/humanResources'
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
      form: this.$form.createForm(this),
      visible: false,
      spinning: false,
      todayListId: '',
      todayListName: '',
      type: 'view',
      contractArr: [],
      record: {},
      todayList: [],
      planList: [],
      todayListType: [],
      planListType: [],
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    modalTitle() {
      return `${this.isView ? '修改' : this.isAdd ? '新增' : '查看'}岗位配置`
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
      return this.isEdit
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
    selectCustomer(key, index) {
      this.todayListId = index
      this.todayListName = key
      this.$refs.receiptContract.query({ type: 1 })
    },
    todayL(data) {
      let that = this
      that.todayListType.push(data)
      that.todayList[that.todayListId].contractName = data.contractName
      that.todayList[that.todayListId].contractId = data.id
      that.todayList[that.todayListId].insureType = 1
    },
    planL(data) {
      let that = this
      that.planListType.push(data)
      that.planList[that.todayListId].contractName = data.contractName
      that.planList[that.todayListId].contractId = data.id
      that.planList[that.todayListId].insureType = 2
    },
    contractChange(data) {
      let that = this
      if (this.todayListName === 'todayList') {
        if (that.todayListType.length == 0 && this.todayListName === 'todayList') {
          this.todayL(data)
        } else {
          let contractName = this.todayListType.some((item) => data.contractName === item.contractName)
          if (!contractName) {
            this.todayL(data)
          } else {
            this.$message.error('不能选择同一个模板')
          }
        }
      } else {
        if (that.planListType.length == 0 && this.todayListName === 'planList') {
          this.planL(data)
        } else {
          let contractName = this.planListType.some((item) => data.contractName === item.contractName)
          if (!contractName) {
            this.planL(data)
          } else {
            that.$message.error('不能选择同一个模板')
          }
        }
      }
    },
    addItem(key) {
      this[key].push({
        contractName: undefined,
        progress: undefined,
      })
    },
    delItem(key, index) {
      let that = this
      that.todayList.splice(index, 1)
      this.todayListType.splice(index, 1)
    },

    async query(type, record) {
      let that = this
      that.visible = true
      that.dataReset()
      that.type = type
      that.record = Object.assign({}, record)
      that.form.resetFields()
      await that.initData()

      if (that.isView || that.isEdit) {
        postAllocation_Detail({ departmentId: that.record.departmentId, stationId: that.record.stationId }).then(
          (res) => {
            that.fillData(res.data)
            this.depChangeHandler(record.departmentId)
          }
        )
      } else {
        that.addItem('todayList')
        that.addItem('todayList')
        that.addItem('todayList')
        that.addItem('planList')
      }
    },
    async fillData(resultData) {
      let that = this
      that.form.setFieldsValue({
        departmentId: that.record.departmentId,
        stationId: that.record.stationId,
      })
      that.todayList =
        resultData.haveSueryContractFormList.map((item) => {
          return { contractId: item.id, insureType: 1, contractName: item.contractName }
        }) || []
      that.planList =
        resultData.noSueryContractFormList.map((item) => {
          return { contractId: item.id, insureType: 2, contractName: item.contractName }
        }) || []
    },
    initData() {
      let that = this
      let queue = []
      return Promise.all(queue)
    },
    handleSubmit() {
      let that = this

      if (that.isEdit) {
        that.handleCancel()
        return
      }
      if (that.todayList.length === 0) {
        that.$message.info('请选择模板')
      }

      if (this.isAdd) {
        this.form.validateFields((err, values) => {
          if (!err) {
            console.log(that.todayList)
            values.contractStationMapList = [...that.todayList, ...that.planList]
            that.spinning = true
            postAllocation_Add(values)
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
      } else {
        this.form.validateFields((err, values) => {
          if (!err) {
            console.log('修改')
            let today = that.todayList.map((item) => {
              return { contractId: item.contractId, insureType: item.insureType }
            })
            let plan = that.planList.map((item) => {
              return { contractId: item.contractId, insureType: item.insureType }
            })
            values.contractStationMapList = [...today, ...plan]
            that.spinning = true
            postAllocation_Update(values)
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
      }
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
      this.todayListType = []
      this.planListType = []
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
