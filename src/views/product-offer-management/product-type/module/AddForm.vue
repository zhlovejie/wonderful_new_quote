<template>
  <a-modal
    :title="modalTitle"
    :width="800"
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
            <td colspan="2">
              <a-form-item>
                <a-input
                  :disabled="isView"
                  v-decorator="['typeName', { rules: [{ required: true, message: '请输入产品类型名称' }] }]"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td class="requiredMark" style="width: 120px">税率(%)</td>
            <td colspan="2">
              <a-form-item>
                <a-input-Number
                  :disabled="isView"
                  style="width: 100%"
                  v-decorator="['taxRate', { rules: [{ required: true, message: '请输入税率' }] }]"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td class="requiredMark" style="width: 120px">编码</td>
            <td colspan="2">
              <a-form-item>
                <a-input
                  :disabled="isView"
                  v-decorator="['code', { rules: [{ required: true, message: '请输入编码' }] }]"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="3"><h3>区间范围</h3></td>
          </tr>
          <tr>
            <th>序号</th>
            <th>区间名称</th>
            <th>区间范围</th>
          </tr>
          <tr v-for="(item, index) in typeConfigRangeList" :key="item.index">
            <td>{{ index + 1 }}</td>
            <td>{{ item.name }}</td>
            <td>
              <a-select
                class="a-select"
                style="width: 200px"
                v-model="item.startInterval"
                showSearch
                :disabled="isView"
                @change="Onchange()"
                :allowClear="true"
                placeholder="开始区间范围"
                optionFilterProp="children"
                :filterOption="filterCustomerOption"
              >
                <a-select-option v-for="val in configList" :key="val.idnex" :value="val.intervalValueName">{{
                  val.intervalValueName
                }}</a-select-option> </a-select
              >至
              <a-select
                class="a-select"
                style="width: 200px"
                :disabled="isView"
                v-model="item.endInterval"
                @change="Onchange()"
                showSearch
                :allowClear="true"
                placeholder="结束区间范围"
                optionFilterProp="children"
                :filterOption="filterCustomerOption"
              >
                <a-select-option v-for="val in configLists" :key="val.idnex" :value="val.intervalValueName">{{
                  val.intervalValueName
                }}</a-select-option>
              </a-select>
            </td>
          </tr>
        </table>
        <div style="margin-top: 20px">编码规则：数字加字母组合，不允许输入空格与中文字符。</div>
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
      typeConfigRangeList: [
        {
          name: '总区间',
          rateType: 1,
          startInterval: undefined,
          endInterval: undefined,
        },
        {
          name: '推荐区间',
          rateType: 2,
          startInterval: undefined,
          endInterval: undefined,
        },
        {
          name: '竞争利区间',
          rateType: 3,
          startInterval: undefined,
          endInterval: undefined,
        },
      ],
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
    Onchange(value, val) {
      this.verification()
    },
    //区间范围验证
    verification() {
      if (
        this.typeConfigRangeList[0].startInterval !== undefined &&
        this.typeConfigRangeList[0].endInterval !== undefined
      ) {
        if (
          this.typeConfigRangeList[0].startInterval < this.typeConfigRangeList[0].endInterval ||
          this.typeConfigRangeList[0].startInterval === this.typeConfigRangeList[0].endInterval
        ) {
          if (
            (this.typeConfigRangeList[0].startInterval < this.typeConfigRangeList[1].endInterval &&
              this.typeConfigRangeList[0].endInterval > this.typeConfigRangeList[1].startInterval) ||
            (this.typeConfigRangeList[0].startInterval < this.typeConfigRangeList[2].endInterval &&
              this.typeConfigRangeList[0].endInterval > this.typeConfigRangeList[2].startInterval)
          ) {
            this.$message.error('区间范围存在重叠')
          }
        } else {
          this.$message.error('总区间开始范围要大于结束范围')
        }
      }
      if (
        this.typeConfigRangeList[1].startInterval !== undefined &&
        this.typeConfigRangeList[1].endInterval !== undefined
      ) {
        if (
          this.typeConfigRangeList[1].startInterval < this.typeConfigRangeList[1].endInterval ||
          this.typeConfigRangeList[1].startInterval === this.typeConfigRangeList[1].endInterval
        ) {
          if (
            (this.typeConfigRangeList[1].startInterval < this.typeConfigRangeList[0].endInterval &&
              this.typeConfigRangeList[1].endInterval > this.typeConfigRangeList[0].startInterval) ||
            (this.typeConfigRangeList[1].startInterval < this.typeConfigRangeList[2].endInterval &&
              this.typeConfigRangeList[1].endInterval > this.typeConfigRangeList[2].startInterval)
          ) {
            this.$message.error('区间范围存在重叠')
          }
        } else {
          this.$message.error('推荐区间开始范围要大于结束范围')
        }
      }
      if (
        this.typeConfigRangeList[2].startInterval !== undefined &&
        this.typeConfigRangeList[2].endInterval !== undefined
      ) {
        if (
          this.typeConfigRangeList[2].startInterval < this.typeConfigRangeList[2].endInterval ||
          this.typeConfigRangeList[2].startInterval === this.typeConfigRangeList[2].endInterval
        ) {
          if (
            (this.typeConfigRangeList[2].startInterval < this.typeConfigRangeList[1].endInterval &&
              this.typeConfigRangeList[2].endInterval > this.typeConfigRangeList[1].startInterval) ||
            (this.typeConfigRangeList[2].startInterval < this.typeConfigRangeList[0].endInterval &&
              this.typeConfigRangeList[2].endInterval > this.typeConfigRangeList[0].startInterval)
          ) {
            this.$message.error('区间范围存在重叠')
          }
        } else {
          this.$message.error('竞争利区间开始范围要大于结束范围')
        }
      }
    },
    async handleOk() {
      let that = this
      this.form.validateFields((err, values) => {
        if (!err) {
          if (that.isEdit) {
            values.id = that.record.id
          }
          let react = that.typeConfigRangeList.every(
            (i) => i.startInterval === undefined && i.endInterval === undefined
          )
          console.log(react)
          if (react) {
            return that.$message.error('请选择区间范围')
          }
          values.typeConfigRangeList = that.typeConfigRangeList.filter(
            (val) => val.startInterval !== undefined && val.endInterval !== undefined
          )
          values.typeConfigRangeList = values.typeConfigRangeList.map((item) => {
            return {
              startInterval: item.startInterval,
              endInterval: item.endInterval,
              rateType: item.rateType,
            }
          })
          that.spinning = true
          addAndUpdateTypeConfig(values)
            .then((res) => {
              that.spinning = false
              if (res.code === 200) {
                that.visible = false
                that.$message.success('操作成功')
                that.$emit('finish')
              } else {
                that.$message.warning(res.msg)
              }
            })
            .catch((err) => {
              console.log(err)
              that.$message.error('操作失败')
              that.spinning = false
            })
        }
      })
    },
    handleCancel() {
      this.form.resetFields()
      this.typeConfigRangeList[0].startInterval = undefined
      this.typeConfigRangeList[0].endInterval = undefined
      this.typeConfigRangeList[1].startInterval = undefined
      this.typeConfigRangeList[1].endInterval = undefined
      this.typeConfigRangeList[2].startInterval = undefined
      this.typeConfigRangeList[2].endInterval = undefined
      this.$nextTick(() => (this.visible = false))
    },
    async query(type, record) {
      let that = this
      this.typeConfigRangeList[0].startInterval = undefined
      this.typeConfigRangeList[0].endInterval = undefined
      this.typeConfigRangeList[1].startInterval = undefined
      this.typeConfigRangeList[1].endInterval = undefined
      this.typeConfigRangeList[2].startInterval = undefined
      this.typeConfigRangeList[2].endInterval = undefined
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
        })
        res.data.typeConfigRangeList.map((val) => {
          if (val.rateType === 1) {
            this.typeConfigRangeList[0].startInterval = val.startInterval
            this.typeConfigRangeList[0].endInterval = val.endInterval
          }
          if (val.rateType === 2) {
            this.typeConfigRangeList[1].startInterval = val.startInterval
            this.typeConfigRangeList[1].endInterval = val.endInterval
          }
          if (val.rateType === 3) {
            this.typeConfigRangeList[2].startInterval = val.startInterval
            this.typeConfigRangeList[2].endInterval = val.endInterval
          }
        })
      })
    },
    formatHTML(htmlStr) {
      if (typeof htmlStr !== 'string') {
        return ''
      }
      htmlStr = htmlStr.replace(/[\n\r]/g, '<br/>')
      htmlStr = htmlStr.replace(/\s+/g, '&nbsp;')
      return htmlStr
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