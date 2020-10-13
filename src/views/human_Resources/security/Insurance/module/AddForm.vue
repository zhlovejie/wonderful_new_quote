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
        <a-button key="submit" type="primary" :loading="spinning" @click="handleOk">确定</a-button>
      </template>
    </template>

    <a-spin :spinning="spinning">
      <a-form :form="form" class="becoming-form-wrapper">
        <table class="custom-table custom-table-border">
          <tr>
            <td>部门</td>
            <td colspan="3">
              <a-form-item>
                <a-select
                  style="width: 400px"
                  @change="depChangeHandler"
                  v-decorator="['departmentId', { rules: [{ required: true, message: '选择部门' }] }]"
                  :disabled="isDisabled"
                  placeholder="请选择部门"
                >
                  <a-select-option v-for="item in departmentList" :key="item.id" :value="item.id">{{
                    item.departmentName
                  }}</a-select-option>
                </a-select>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>岗位</td>
            <td colspan="3">
              <a-form-item>
                <template v-if="this.type === 'add'">
                  <a-tree-select
                    v-decorator="['stationIds', { rules: [{ required: true, message: '选择岗位' }] }]"
                    style="width: 400px"
                    :tree-data="postSelectDataSource"
                    :dropdownStyle="{ maxHeight: '300px' }"
                    tree-checkable
                    :show-checked-strategy="SHOW_PARENT"
                    search-placeholder="Please select"
                    :disabled="isDisabled"
                  />
                </template>
                <template v-else>
                  <a-select
                    style="width: 400px"
                    :allowClear="true"
                    v-decorator="['stationId', { rules: [{ required: true, message: '选择岗位' }] }]"
                    :disabled="isDisabled"
                    placeholder="请选择岗位"
                  >
                    <a-select-option v-for="item in SingleChoice" :key="item.id" :value="item.id">{{
                      item.stationName
                    }}</a-select-option>
                  </a-select>
                </template>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>试用期时间</td>
            <td colspan="3">
              <a-form-item>
                <a-tree-select
                  v-decorator="['insuranceInfoList', { rules: [{ required: true, message: '试用期时间' }] }]"
                  placeholder="请选择试用期时间"
                  style="width: 400px"
                  :tree-data="treeData"
                  tree-checkable
                  :show-checked-strategy="SHOW_PARENT"
                  search-placeholder="Please select"
                  :disabled="isDisabled"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>入职空挡期</td>
            <td colspan="3">
              <a-form-item>
                <a-select
                  style="width: 400px"
                  v-decorator="['neutral', { rules: [{ required: true, message: '选择入职空挡期' }] }]"
                  :disabled="isDisabled"
                  placeholder="请选择入职空档期"
                >
                  <a-select-option v-for="item in InsuranceList" :key="item.id" :value="item.id">{{
                    item.text
                  }}</a-select-option>
                </a-select>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>试用期保险</td>
            <td colspan="3">
              <a-form-item>
                <a-select
                  style="width: 400px"
                  v-decorator="['probationPeriod', { rules: [{ required: true, message: '选择试用期保险' }] }]"
                  :disabled="isDisabled"
                  placeholder="请选择试用期保险"
                >
                  <a-select-option v-for="item in InsuranceList" :key="item.id" :value="item.id">{{
                    item.text
                  }}</a-select-option>
                </a-select>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>转正保险</td>
            <td colspan="3">
              <a-form-item>
                <a-select
                  style="width: 400px"
                  v-decorator="['turnJust', { rules: [{ required: true, message: '选择转正保险' }] }]"
                  :disabled="isDisabled"
                  placeholder="请选择转正保险"
                >
                  <a-select-option v-for="item in InsuranceList" :key="item.id" :value="item.id">{{
                    item.text
                  }}</a-select-option>
                </a-select>
              </a-form-item>
            </td>
          </tr>
        </table>
      </a-form>

      <div>注：</div>
      <div>入职空档期：每月20号后，次月10号前，人员购买保险；</div>
      <div>试用期保险：每月10号后，10号前，人员购买保险；</div>
      <div>转正保险：每月27号前，次月6号后，人员购买保险；</div>
      <!-- <Approval ref="approval" @opinionChange="opinionChange" /> -->
    </a-spin>
  </a-modal>
</template>
<script>
// import { departmentList } from '@/api/systemSetting' //所有部门
import { getDevisionList, getStationList } from '@/api/systemSetting'
import { getDictionaryList } from '@/api/workBox'
import { securityInsurance_Add, securityInsurance_Details } from '@/api/humanResources'
// import moment from 'moment'

// import Approval from './Approval'
import { TreeSelect } from 'ant-design-vue'
const SHOW_PARENT = TreeSelect.SHOW_PARENT

export default {
  name: 'BecomingForm',
  components: {
    // Approval: Approval,
  },
  data() {
    return {
      // 部门列表
      departmentList: [],
      // 岗位列表
      postSelectDataSource: [],
      //单选列表
      SingleChoice: [],
      treeData: [],
      InsuranceList: [],

      SHOW_PARENT,
      visible: false,
      spinning: false,
      form: this.$form.createForm(this, { name: 'do_becoming' }),
      type: 'view',
      recordDetails: {},
      record: {},
      isModified: false, //财务人员为 true
    }
  },
  computed: {
    modalTitle() {
      if (this.isEditSalary) {
        return '保险配置'
      }
      let txt = this.isView ? '查看' : this.isEditSalary ? '修改' : '新增'
      return `${txt}保险配置`
    },
    isView() {
      //查看
      return this.type === 'edit'
    },
    isEditSalary() {
      //修改
      return this.type === 'edit-salary'
    },

    isDisabled() {
      return this.isView || this.isEdit
    },
  },
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'human_Resources_Insurance') {
          this.init()
        }
      },
      immediate: true,
    },
  },
  created() {
    getDevisionList().then((res) => {
      this.departmentList = res.data
    })

    // 社保数据字典
    getDictionaryList({ parentId: 518 }).then((res) => (this.InsuranceList = res.data))
  },
  methods: {
    depChangeHandler(dep_id) {
      let that = this
      that.postSelectDataSource = []
      return getStationList({ id: dep_id }).then((res) => {
        that.SingleChoice = res.data
        that.postSelectDataSource = res.data.map((item) => {
          return {
            id: item.id,
            key: item.id,
            value: item.id,
            title: item.stationName,
            isLeaf: false,
          }
        })
      })
    },
    init() {
      let that = this
      let queue = []
      let task1 = getDictionaryList({ parentId: 517 }).then((res) => {
        that.treeData = res.data.map((item) => {
          return {
            id: item.id,
            key: item.id,
            value: item.id,
            title: item.text,
            isLeaf: false,
          }
        })
      })
      queue.push(task1)
    },
    elementChange(key, val) {
      this[key] = val
    },
    scoreChange(type, event) {
      this[type] = parseInt(event, 10)
    },
    // moment:moment,
    query(type, record) {
      this.visible = true
      this.type = type
      this.record = record
      if (record !== null) {
        this.fillData()
      }
    },
    // 详情
    fillData() {
      let that = this
      let id = {
        id: this.record.id,
      }
      securityInsurance_Details(id).then((res) => {
        that.recordDetails = res.data
        let arr = []
        res.data.insuranceInfoList.map((item) => {
          return arr.push(item.dictId)
        })
        that.form.setFieldsValue({
          departmentId: res.data.departmentId,
          stationId: res.data.stationId,
          insuranceInfoList: arr,
          neutral: res.data.neutral,
          probationPeriod: res.data.probationPeriod,
          turnJust: res.data.turnJust,
        })
        if (that.record !== null) {
          this.depChangeHandler(res.data.departmentId)
        }
      })
    },

    handleOk() {
      let that = this
      if (that.isView) {
        that.form.resetFields() // 清空表
        that.visible = false
        return
      } else if (that.type === 'add' || that.type === 'edit-salary') {
        that.form.validateFields((err, values) => {
          if (!err) {
            values.insuranceInfoList = values.insuranceInfoList.map((item, index) => {
              return {
                dictId: item,
              }
            })
            if (that.type === 'edit-salary') {
              values.id = that.recordDetails.id
            }
            this.spinning = true
            securityInsurance_Add(values)
              .then((res) => {
                that.spinning = false
                that.form.resetFields() // 清空表
                that.visible = false
                that.$message.info(res.msg)
                that.$emit('finish')
              })
              .catch((err) => (that.spinning = false))
          }
        })
      } else if (that.isEditSalary) {
        // that.updateUserBackCardSalary()
      } else {
        that.form.resetFields() // 清空表
        that.visible = false
      }
    },
    handleCancel() {
      this.form.resetFields() // 清空表
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