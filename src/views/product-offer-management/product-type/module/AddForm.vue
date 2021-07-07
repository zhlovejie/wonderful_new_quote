<template>
  <a-modal
    :title="modalTitle"
    :width="1050"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <a-spin :spinning="spinning">
      <a-form :form="form" class="add-form-wrapper">
        <table class="custom-table custom-table-border">
          <tr>
            <td class="requiredMark" style="width: 120px">产品类型名称</td>
            <td colspan="6">
              <a-form-item>
                <a-input
                  :disabled="isView"
                  style="width: 60%"
                  v-decorator="['typeName', { rules: [{ required: true, message: '请输入产品类型名称' }] }]"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td class="requiredMark" style="width: 120px">税率(%)</td>
            <td colspan="6">
              <a-form-item>
                <a-input-Number
                  :disabled="isView"
                  style="width: 60%"
                  v-decorator="['taxRate', { rules: [{ required: true, message: '请输入税率' }] }]"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td class="requiredMark" style="width: 120px">编码</td>
            <td colspan="6">
              <a-form-item>
                <a-input
                  style="width: 60%"
                  :disabled="isView"
                  v-decorator="['code', { rules: [{ required: true, message: '请输入编码' }] }]"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td class="requiredMark" style="width: 120px">底价</td>
            <td colspan="6">
              <a-form-item>
                <a-select
                  class="a-select"
                  style="width: 60%"
                  showSearch
                  :disabled="isView"
                  :allowClear="true"
                  optionFilterProp="children"
                  :filterOption="filterCustomerOption"
                  v-decorator="['lowPriceInterval', { rules: [{ required: true, message: '请选择底价区间' }] }]"
                >
                  <a-select-option v-for="val in configList" :key="val.idnex" :value="val.intervalValueName">{{
                    val.intervalValueName
                  }}</a-select-option>
                </a-select>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="7"><h3>区间范围</h3></td>
          </tr>
          <tr>
            <th>序号</th>
            <th>区间名称</th>
            <th>区间权限</th>
            <th colspan="4">区间范围</th>
          </tr>
          <tr v-for="(item, index) in typeConfigRangeList" :key="item.index">
            <td style="width: 70px">{{ index + 1 }}</td>
            <td>
              <a-form-item>
                <a-input
                  placeholder="区间名称"
                  :disabled="isView"
                  style="width: 150px"
                  @change="inputChange($event, item.key, 'intervalName')"
                  v-decorator="[
                    `typeConfigRangeList.${index}.intervalName`,
                    { initialValue: item.intervalName, rules: [{ required: true, message: '请输入区间名称' }] },
                  ]"
                />
              </a-form-item>
            </td>
            <td>
              <a-form-item>
                <a-select
                  placeholder="区间权限"
                  :disabled="isView"
                  :allowClear="true"
                  style="width: 150px"
                  @change="inputChange($event, item.key, 'intervalPermission')"
                  v-decorator="[
                    `typeConfigRangeList.${index}.intervalPermission`,
                    { initialValue: item.intervalPermission, rules: [{ required: true, message: '请选择区间权限' }] },
                  ]"
                >
                  <a-select-option :value="0">全部可见</a-select-option>
                  <a-select-option :value="1">销售总经理可见</a-select-option>
                </a-select>
              </a-form-item>
            </td>
            <td>默认区间</td>
            <td>
              <a-form-item>
                <a-select
                  placeholder="默认区间"
                  :disabled="isView"
                  :allowClear="true"
                  showSearch
                  style="width: 150px"
                  optionFilterProp="children"
                  :filterOption="filterCustomerOption"
                  @change="inputChange($event, item.key, 'defaultInterval')"
                  v-decorator="[
                    `typeConfigRangeList.${index}.defaultInterval`,
                    { initialValue: item.defaultInterval, rules: [{ required: true, message: '请选择默认区间' }] },
                  ]"
                >
                  <a-select-option v-for="val in configList" :key="val.idnex" :value="val.intervalValueName">{{
                    val.intervalValueName
                  }}</a-select-option>
                </a-select>
              </a-form-item>
            </td>
            <td>区间范围</td>
            <td>
              <a-form-item>
                <a-select
                  placeholder="开始区间"
                  :disabled="isView"
                  :allowClear="true"
                  showSearch
                  style="width: 150px"
                  optionFilterProp="children"
                  :filterOption="filterCustomerOption"
                  @change="inputChange($event, item.key, 'startInterval')"
                  v-decorator="[
                    `typeConfigRangeList.${index}.startInterval`,
                    { initialValue: item.startInterval, rules: [{ required: true, message: '请选择开始区间' }] },
                  ]"
                >
                  <a-select-option v-for="val in configList" :key="val.idnex" :value="val.intervalValueName">{{
                    val.intervalValueName
                  }}</a-select-option>
                </a-select>
              </a-form-item>
              至
              <a-form-item>
                <a-select
                  placeholder="结束区间"
                  :disabled="isView"
                  :allowClear="true"
                  showSearch
                  style="width: 150px"
                  optionFilterProp="children"
                  :filterOption="filterCustomerOption"
                  @change="inputChange($event, item.key, 'endInterval')"
                  v-decorator="[
                    `typeConfigRangeList.${index}.endInterval`,
                    { initialValue: item.endInterval, rules: [{ required: true, message: '请选择结束区间' }] },
                  ]"
                >
                  <a-select-option v-for="val in configLists" :key="val.idnex" :value="val.intervalValueName">{{
                    val.intervalValueName
                  }}</a-select-option>
                </a-select>
              </a-form-item>
            </td>
          </tr>
        </table>
        <a-button style="width: 100%" v-if="!isView" type="dashed" icon="plus" @click="handleAction()"
          >新增区间范围</a-button
        >
        <div style="margin-top: 20px">编码规则：数字加字母组合，不允许输入空格与中文字符。</div>
        <div>底价：低于底价至老板审批</div>
        <div>区间权限：全部：销售人员可见;销售总经理：只有销售总经理可见</div>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { addAndUpdateTypeConfig, typeConfigDetail, intervalConfigList } from '@/api/productOfferManagement'

export default {
  name: 'AddForm',
  components: {},
  data() {
    return {
      form: this.$form.createForm(this, { name: 'addForm' }),
      visible: false,
      actionType: 'add',
      spinning: false,
      configList: [],
      configLists: [],
      typeConfigRangeList: [],
    }
  },
  computed: {
    modalTitle() {
      let m = {
        add: '新增',
        view: '查看',
        edit: '修改',
      }
      return `${m[this.actionType]}产品类型`
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
  },
  methods: {
    inputChange(event, key, field) {
      let typeConfigRangeList = [...this.typeConfigRangeList]
      let target = typeConfigRangeList.find((item, index) => item.index === key)
      if (target) {
        target[field] = event instanceof Event ? event.target.value : event
        this.typeConfigRangeList = typeConfigRangeList
      }
    },

    handleAction() {
      this.typeConfigRangeList.push({
        startInterval: undefined,
        endInterval: undefined,
        intervalName: undefined,
        intervalPermission: undefined,
        defaultInterval: undefined,
      })
    },
    async handleOk() {
      let that = this
      this.form.validateFields((err, values) => {
        if (!err) {
          if (that.isEdit) {
            values.id = that.record.id
          }
          console.log(values)
          that.spinning = true
          addAndUpdateTypeConfig(values)
            .then((res) => {
              that.spinning = false
              if (res.code === 200) {
                that.visible = false
                that.$message.success(res.msg)
                that.$emit('finish')
              } else {
                that.$message.warning(res.msg)
              }
            })
            .catch((err) => {
              that.$message.error('操作失败')
              that.spinning = false
            })
        }
      })
    },
    handleCancel() {
      this.form.resetFields()
      this.typeConfigRangeList = []
      this.$nextTick(() => (this.visible = false))
    },
    async query(type, record) {
      let that = this
      that.actionType = type
      that.record = record || {}
      that.form.resetFields()
      that.visible = true
      intervalConfigList().then((res) => {
        that.configLists = res.data
        that.configLists = that.configLists.sort(function (a, b) {
          return b.intervalValueName.localeCompare(a.intervalValueName)
        })
      })
      intervalConfigList().then((res) => {
        that.configList = res.data
        that.configList = that.configList.sort(function (a, b) {
          return a.intervalValueName.localeCompare(b.intervalValueName)
        })
      })
      if (type !== 'add') {
        that.fillData()
      }
    },
    filterCustomerOption(input, option) {
      // 是否根据输入项进行筛选。当其为一个函数时，会接收 inputValue option 两个参数，当 option 符合筛选条件时，应返回 true，反之则返回 false。
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      // option.componentOptions.children[0].text   结果是"郑州依依不舍"
    },
    fillData() {
      let that = this
      typeConfigDetail({ id: this.record.id }).then((res) => {
        console.log(res.data)
        that.form.setFieldsValue({
          code: res.data.code,
          typeName: res.data.typeName,
          taxRate: res.data.taxRate,
          lowPriceInterval: res.data.lowPriceInterval,
        })
        that.typeConfigRangeList = res.data.typeConfigRangeList
      })
    },
  },
}
</script>
<style>
.requiredMark::before {
  display: inline-block;
  margin-right: 4px;
  color: #f5222d;
  font-size: 14px;
  font-family: SimSun, sans-serif;
  line-height: 1;
  content: '*';
}
.ant-upload-list-picture-card .ant-upload-list-item-info::before {
  left: 0;
}
</style>
<style scoped>
.add-form-wrapper >>> .ant-form-item {
  display: flex;
}
.add-form-wrapper >>> .ant-form-item-control-wrapper {
  flex: 1;
}

.custom-table-border th,
.custom-table-border td {
  padding: 5px 10px;
}

.add-form-wrapper >>> .ant-form-item {
  margin-bottom: 0;
}

.add-form-wrapper >>> .custom-table {
  margin-bottom: 0;
}

.hide-del-icon >>> .anticon-delete {
  display: none;
}
</style>