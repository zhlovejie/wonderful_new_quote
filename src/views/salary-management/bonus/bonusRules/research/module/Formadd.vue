<template>
  <a-modal
    :title="modalTitle"
    :width="800"
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
            <td>产品代码</td>
            <td colspan="2">
              <a-form-item>
                <a-input
                  style="width: 200px"
                  read-only
                  @click="handleCustomerClick"
                  placeholder="选择产品代码"
                  v-decorator="[
                    'productCode',
                    { initialValue: productCode, rules: [{ required: true, message: '输入合同协议名称!' }] },
                  ]"
                />
              </a-form-item>
            </td>
            <td>产品名称</td>
            <td colspan="2">
              <a-form-item>
                <a-input
                  style="width: 200px"
                  read-only
                  placeholder="选择产品名称"
                  v-decorator="[
                    'productName',
                    { initialValue: productName, rules: [{ required: true, message: '请输入版本号!' }] },
                  ]"
                />
              </a-form-item>
            </td>
          </tr>

          <tr>
            <td>部门</td>
            <td colspan="2">
              <a-form-item>
                <a-select style="width: 200px" @change="depChangeHandler" placeholder="请选择部门">
                  <a-select-option v-for="item in departmentList" :key="item.id" :value="item.id">{{
                    item.departmentName
                  }}</a-select-option>
                </a-select>
              </a-form-item>
            </td>
            <td>人员</td>
            <td colspan="2">
              <a-form-item>
                <a-select
                  style="width: 200px"
                  mode="multiple"
                  :allowClear="true"
                  :maxTagCount="1"
                  @change="addProcess"
                  showSearch
                  placeholder="请选择人员"
                  optionFilterProp="children"
                  :filterOption="selectFilter"
                  v-decorator="['authTrainFolderBoList']"
                >
                  <a-select-option v-for="(process, index) in postSelectDataSource" :key="index" :value="process.id">{{
                    process.trueName
                  }}</a-select-option>
                </a-select>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>释放周期</td>
            <td colspan="6">月度</td>
          </tr>
          <tr>
            <td colspan="6">
              <a-form-item>
                <div class="process_header_wrapper">
                  <div class="draggable-columns draggable-columns-1">人员</div>
                  <div class="draggable-columns draggable-columns-1">奖金系数（%）</div>
                  <div class="draggable-columns draggable-columns-3">
                    <a href="javascript:void(0);" @click="processClearAction">清空</a>
                  </div>
                </div>
                <vuedraggable
                  class="process_main_wrapper"
                  v-if="haveProcess.length > 0"
                  ghost-class="ghost"
                  v-model="haveProcess"
                >
                  <transition-group name="list">
                    <div v-for="(item, index) in haveProcess" :key="item.userId" class="draggable-columns-item">
                      <div class="draggable-columns draggable-columns-1">{{ item.trueName }}</div>
                      <div class="draggable-columns draggable-columns-1">
                        <a-form-item>
                          <a-input-number
                            style="width: 200px"
                            placeholder="输入奖金系数"
                            :precision="6"
                            @change="inputChange($event, item.userId, 'bounsToilt')"
                            v-decorator="[
                              `haveProcess${index}bounsToilt`,
                              {
                                initialValue: item.bounsToilt,
                                len: 8,
                                rules: [{ required: true, message: '输入奖金系数!' }],
                              },
                            ]"
                          />
                        </a-form-item>
                      </div>

                      <div class="draggable-columns draggable-columns-3" title="删除">
                        <a-popconfirm
                          title="确认删除这条数据？"
                          @confirm="confirm(item.userId, index)"
                          okText="是"
                          cancelText="否"
                        >
                          <a-icon type="close-circle" />
                        </a-popconfirm>
                      </div>
                    </div>
                  </transition-group>
                </vuedraggable>
              </a-form-item>
            </td>
          </tr>
        </table>
      </a-form>

      <Approval ref="approval" @selected="handlerCustomerSelected" />
    </a-spin>
  </a-modal>
</template>
<script>
import { queryList } from '@/api/humanResources'
import {
  oaSalaryInfo_addAndUpdate,
  oaSalaryInfo_getId,
  bonus_getDepartmentByType,
  oaSalaryIsSalary,
} from '@/api/bonus_management'
import vuedraggable from 'vuedraggable'
import Approval from './appForm'

export default {
  name: 'BecomingForm',
  components: {
    vuedraggable,
    Approval: Approval,
  },
  data() {
    return {
      visible: false,
      spinning: false,
      productName: undefined,
      productCode: undefined,
      type: 'View',
      record: {},
      form: this.$form.createForm(this),
      departmentList: [], //部门
      postSelectDataSource: [], //人员
      haveProcess: [],
      productId: '',
      prodId: '',
      productType: '', //常规非常规
      depart: '',
      _d: {
        departmentId: '',
        departmentName: '',
      },
    }
  },
  computed: {
    commonReceiveBigDecimal() {
      return this.haveProcess.reduce((addr, item) => {
        addr = Number(addr) + Number(item.bounsToilt || 0)
        return parseFloat(addr).toFixed(2)
      }, 0)
    },

    modalTitle() {
      if (this.isEditSalary) {
        return '修改研发提成奖金规则'
      }
      if (this.isView) {
        return '新增研发提成奖金规则'
      }
    },
    isView() {
      //新增
      return this.type === 'add'
    },
    isEditSalary() {
      //修改
      return this.type === 'edit-salary'
    },

    isDisabled() {
      return this.isView || this.isEditSalary
    },
  },
  watch: {
    depart: function (val) {
      let _d = this.departmentList.find((_d) => _d.id === val)
      this._d.departmentId = val
      this._d.departmentName = _d.departmentName
    },
  },
  created() {
    bonus_getDepartmentByType({ type: 2 }).then((res) => (this.departmentList = res.data))
    // getDevisionList().then((res) => {
    //   this.departmentList = res.data
    // })
  },
  methods: {
    //打开产品代码列表
    handleCustomerClick() {
      this.$refs.approval.query()
    },
    //产品代码组件返回值
    handlerCustomerSelected(record) {
      if (this.type === 'edit-salary' && record.id === this.prodId) {
        this.productId = record.id
        this.productType = record.productType
        this.form.setFieldsValue({
          productCode: record.productModel,
          productName: record.productName,
        })
      } else {
        oaSalaryIsSalary({ productType: record.productType, productId: record.id }).then((res) => {
          if (res.code === 200) {
            this.productId = record.id
            this.productType = record.productType
            this.form.setFieldsValue({
              productCode: record.productModel,
              productName: record.productName,
            })
          } else {
            this.$message.error(res.msg)
          }
        })
      }
    },
    inputChange(event, keys, field) {
      let haveProcess = [...this.haveProcess]
      let target = haveProcess.find((item, index) => item.userId === keys)
      if (target) {
        target[field] = event instanceof Event ? event.target.value : event
        this.haveProcess = haveProcess
      }
    },
    query(type, record) {
      this.visible = true
      this.type = type
      this.record = record
      bonus_getDepartmentByType({ type: 2 }).then((res) => (this.departmentList = res.data))
      // getDevisionList().then((res) => {
      //   this.departmentList = res.data
      // })
      if (type === 'edit-salary') {
        this.fillData()
      }
    },

    fillData() {
      this.$nextTick(() => {
        oaSalaryInfo_getId({ id: this.record.id }).then((res) => {
          console.log(res.data)
          this.productName = res.data.productName
          this.productCode = res.data.productCode
          this.haveProcess = res.data.oaSalaryBounsPercentageRuleDetails
          this.productType = res.data.productType
          this.productId = res.data.productId
          this.prodId = res.data.productId
        })
      })
    },

    handleOk() {
      console.log('你是要提交')
      let that = this
      if (that.type === 'add' || that.type === 'edit-salary') {
        that.form.validateFields((err, values) => {
          if (!err) {
            if (that.haveProcess.length == 0) {
              return this.$message.error('请选择人员')
            }
            let arr = {}
            if (that.type !== 'add') {
              arr.id = this.record.id
            }
            arr.productCode = values.productCode
            arr.productName = values.productName
            arr.productId = that.productId
            arr.productType = that.productType
            arr.oaSalaryBounsPercentageRuleDetails = that.haveProcess.map((item) => {
              return {
                departmentId: item.departmentId,
                userId: item.userId,
                bounsToilt: item.bounsToilt,
              }
            })
            that.spinning = true
            oaSalaryInfo_addAndUpdate(arr)
              .then((res) => {
                that.spinning = false
                that.departmentList = []
                that.form.resetFields() // 清空表
                that.haveProcess = []
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
    //选择人员
    depChangeHandler(dep_id) {
      let that = this
      that.depart = dep_id
      that.postSelectDataSource = []
      return queryList({ departmentId: dep_id }).then((res) => {
        that.postSelectDataSource = res.data
      })
    },
    addProcess(selectedArray) {
      let that = this
      if (!Array.isArray(selectedArray)) return
      selectedArray.map((_ppid) => {
        if (!_ppid) return
        let target = that.haveProcess.find((p) => p.userId == _ppid)
        if (!target) {
          let _p = that.postSelectDataSource.find((_p) => _p.id == _ppid)
          _p.userId = _p.id
          _p.trueName = _p.trueName
          _p.bounsToilt = undefined
          that.haveProcess.push({ ..._p, ...that._d })
        }
      })
    },

    //清空
    processClearAction() {
      let that = this
      that.haveProcess = []
      that.form.setFieldsValue({
        authTrainFolderBoList: [],
      })
    },

    confirm(cpId, index) {
      // 确认删除事件
      this.haveProcess.splice(index, 1)
      let arr = []
      this.haveProcess.map((item) => {
        arr.push(item.userId)
      })
      this.form.setFieldsValue({
        authTrainFolderBoList: arr,
      })
    },
    selectFilter(input, option) {
      // 下拉框搜索
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },

    handleCancel() {
      this.departmentList = []
      this.haveProcess = []
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
.process_tips {
  background-color: antiquewhite;
}
.process_header_wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: antiquewhite;
  font-weight: 700;
  border: 1px solid #ddd;
}
.process_header_wrapper .draggable-columns-2 {
  flex: 1;
}
.process_main_wrapper {
  border: 1px solid #ddd;
}
.process_main_wrapper .draggable-columns-item {
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #ddd;
}
.process_main_wrapper .draggable-columns-item:last-child {
  border-bottom: none;
}
.process_main_wrapper .draggable-columns-2 {
  flex: 1;
}
.draggable-columns {
  text-align: center;
  line-height: 35px;
  cursor: move;
}
.draggable-columns-1,
.draggable-columns-3 {
  width: 50%;
}
.draggable-columns-3 {
  cursor: pointer;
}
.ghost {
  background-color: rgba(250, 235, 215, 0.5);
}
</style>