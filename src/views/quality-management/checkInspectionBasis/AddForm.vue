<template>
  <a-modal
    :title="modalTitle"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :width="1400"
  >
    <a-form-model
      ref="ruleForm"
      :model="form"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-row>
        <a-col :span="8">
          <a-form-model-item
            label="检验依据"
            required
            prop="inspectionBasis"
          >
            <a-input
              :disabled="isDisabled"
              placeholder="检验依据"
              style="width: 100%"
              allowClear
              v-model="form.inspectionBasis"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item
            label="检验等级"
            required
            prop="inspectionGrade"
          >
            <a-select
              :disabled="isDisabled"
              placeholder="检验等级"
              style="width: 100%"
              allowClear
              v-model="form.inspectionGrade"
            >
              <a-select-option :value="0">正常</a-select-option>
              <a-select-option :value="1">加严</a-select-option>
              <a-select-option :value="2">放宽</a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row type="flex">
        <a-col
          flex="112.66px"
          style="text-align:right;line-height: 38px;"
        >AQL值：</a-col>
        <a-col flex="auto">
          <a-form-model-item
            :label-col="{span:0}"
            :wrapper-col="{span:24}"
          >
            <CommonDictionarySelect
              style="width: 100%"
              :disabled="isDisabled"
              mode="multiple"
              placeholder="AQL值"
              :text="'AQL值'"
              :dictionaryId.sync="aqlList"
              @loaded="handlerDictionaryDataSource"
              @selected="handlerDictionaryChange"
            />
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row type="flex">
        <a-col
          flex="112.66px"
          style="text-align:right;line-height: 30px;"
        >备注信息：</a-col>
        <a-col flex="auto">
          <a-form-model-item
            :label-col="{span:0}"
            :wrapper-col="{span:24}"
          >
            <a-textarea
              :disabled="isDisabled"
              placeholder="备注"
              style="width: 100%"
              allow-clear
              autoSize
              v-model="form.remarks"
            />
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-form-model>

    <table class="custom-table custom-table-border">
      <caption>C=0抽样计划表</caption>

      <tbody>
        <tr>
          <td style="width:200px;">AQL值</td>
          <td
            v-for="col in planHeaderColumns"
            :key="col.text"
          >{{col.text}}</td>
          <td
            rowspan="3"
            v-if="!isDisabled"
            style="width:60px;"
          >操作</td>
        </tr>
        <tr>
          <td
            rowspan="2"
            style="width:200px;"
          >批量范围</td>
          <td :colspan="planHeaderColumns.length">样本数</td>
        </tr>
        <tr>
          <td
            v-for="col in planHeaderColumns"
            :key="col.text"
          >
            AC
          </td>
        </tr>
        <tr
          v-for="item in checkInspectionBasisAqls"
          :key="item.key"
        >
          <td>
            <div>
              <span>
                <a-input
                  style="width:45%;text-align:center;"
                  :disabled="isDisabled"
                  v-model="item.startValue"
                />
              </span>
              <span>~</span>
              <span>
                <a-input
                  style="width:45%;text-align:center;"
                  :disabled="isDisabled"
                  v-model="item.endValue"
                />
              </span>
            </div>
          </td>
          <td
            v-for="row in item.checkInspectionBasisAqlInfos"
            :key="row.text"
          >
            <a-input
              style="width:100%;text-align:center;"
              :disabled="isDisabled"
              v-model="row.ac"
            ></a-input>
          </td>
          <td v-if="!isDisabled">
            <a
              href="javascript:void(0);"
              @click="doAction('del',item)"
            >删除</a>
          </td>
        </tr>
      </tbody>
    </table>
    <a-button
      style="width: 100%"
      type="dashed"
      v-if="!isDisabled"
      icon="plus"
      @click="doAction('add',null)"
    >新增行</a-button>

  </a-modal>
</template>
<script>
import { checkInspectionBasisDetail, checkInspectionBasisAddOrUpdate } from '@/api/qualityManagement'
import CommonDictionarySelect from '@/components/CustomerList/CommonDictionarySelect'
export default {
  components: {
    CommonDictionarySelect
  },
  data() {
    return {
      visible: false,
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      form: {},
      checkInspectionBasisAqls: [],
      aqlList: [],
      aqlDataSource: [],
      rules: {
        inspectionBasis: [{ required: true, message: '请输入检验依据', trigger: 'blur' }],
        inspectionGrade: [{ required: true, message: '请选择检验等级', trigger: 'change' }]
      },
      type: 'add'
    }
  },
  computed: {
    modalTitle() {
      return this.isAdd ? '新增' : this.isEdit ? '编辑' : '查看'
    },
    isAdd() {
      return this.type === 'add'
    },
    isEdit() {
      return this.type === 'edit'
    },
    isView() {
      return this.type === 'view'
    },
    planHeaderColumns() {
      const list = this.aqlDataSource.filter(item => this.aqlList.includes(item.id))
      return [...list]
    },
    isDisabled() {
      return this.isView
    }
  },
  methods: {
    handlerDictionaryChange() {
      const that = this
      const checkInspectionBasisAqls = [...that.checkInspectionBasisAqls]
      that.checkInspectionBasisAqls = checkInspectionBasisAqls.map(aql => {
        aql.checkInspectionBasisAqlInfos = that.planHeaderColumns.map(col => {
          const key = `${col.id}-${col.text}`
          const target = aql.checkInspectionBasisAqlInfos.find(info => info.key === key)
          if (target) {
            return { ...target }
          } else {
            return {
              key,
              ac: undefined,
              parameterTermId: col.id,
              parameterTermName: col.text
            }
          }
        })
        return aql
      })
    },
    validate() {
      const that = this
      const checkNumberOrAsterisk = n => {
        const _n = String(n).trim()
        const reg = /[1-9]\d*/
        return reg.test(_n) || _n === '*'
      }
      const checkRange = (min, max, n) => {
        return n === '*' || (+n >= +min && +n <= +max)
      }

      const checkInspectionBasisAqls = [...that.checkInspectionBasisAqls]
      if (checkInspectionBasisAqls.length === 0) {
        that.$message.info('AQL值不能为空')
        return false
      }
      for (let i = 0, len = checkInspectionBasisAqls.length; i < len; i++) {
        const { startValue, endValue, checkInspectionBasisAqlInfos } = checkInspectionBasisAqls[i]
        const line = i + 1
        if (!checkNumberOrAsterisk(startValue) || !checkNumberOrAsterisk(endValue)) {
          const msg = `第${line}行批量范围输入不符合规则，只能输入【数字或*号】`
          that.$message.info(msg)
          return false
        }

        for (let j = 0, len1 = checkInspectionBasisAqlInfos.length; j < len1; j++) {
          const { ac, parameterTermName } = checkInspectionBasisAqlInfos[j]
          const line1 = j + 1
          if (!checkNumberOrAsterisk(ac)) {
            const msg = `第${line}行第${line1}列【${parameterTermName}】输入不符合规则，只能输入【数字或*号】`
            that.$message.info(msg)
            return false
          }
          if (!checkNumberOrAsterisk(ac)) {
            const msg = `第${line}行第${line1}列【${parameterTermName}】输入不符合规则，只能输入【数字或*号】`
            that.$message.info(msg)
            return false
          }
          if (!checkRange(startValue, endValue, ac)) {
            const msg = `第${line}行第${line1}列【${parameterTermName}】输入不符合规则，只能输入【数字或*号】且范围在【${startValue}~${endValue}】之间`
            that.$message.info(msg)
            return false
          }
        }
      }
      return true
    },
    doAction(type, record) {
      const that = this
      const checkInspectionBasisAqls = [...that.checkInspectionBasisAqls]
      if (type === 'add') {
        checkInspectionBasisAqls.push({
          key: that._uuid(),
          startValue: '',
          endValue: '',
          checkInspectionBasisAqlInfos: that.planHeaderColumns.map(item => {
            return {
              key: `${item.id}-${item.text}`,
              ac: '',
              parameterTermId: item.id,
              parameterTermName: item.text
            }
          })
        })
        that.checkInspectionBasisAqls = checkInspectionBasisAqls
      } else if (type === 'del') {
        that.checkInspectionBasisAqls = checkInspectionBasisAqls.filter(item => item.key !== record.key)
      }
    },
    query(type, record) {
      const that = this
      that.type = type
      that.form = {}
      that.checkInspectionBasisAqls = []
      that.aqlList = []
      that.visible = true
      if (that.isAdd) {

      } else {
        checkInspectionBasisDetail({ id: record.id }).then(res => {
          debugger
          const { id, inspectionBasis, inspectionGrade, remarks, checkInspectionBasisAqlDeatilVos } = res.data || {
            checkInspectionBasisAqlDeatilVos: []
          }
          that.form = {
            id,
            inspectionBasis,
            inspectionGrade,
            remarks
          }

          const aqlList = []
          that.checkInspectionBasisAqls = checkInspectionBasisAqlDeatilVos.map(item => {
            item.checkInspectionBasisAqlInfos = that.$_.cloneDeep(item.checkInspectionBasisAqlInfoDetailVos || [])
            item.checkInspectionBasisAqlInfos.map(info => {
              aqlList.push(info.parameterTermId)
            })
            delete item.checkInspectionBasisAqlInfoDetailVos
            return item
          })

          that.aqlList = aqlList
        })
      }
    },
    handlerDictionaryDataSource(list) {
      this.aqlDataSource = [...list]
      this.aqlList = list.map(item => +item.id)
    },
    handleOk() {
      const that = this
      that.$refs['ruleForm'].validate(valid => {
        if (valid) {
          if (!that.validate()) {
            return
          }
          checkInspectionBasisAddOrUpdate({
            ...that.form,
            checkInspectionBasisAqls: that.checkInspectionBasisAqls
          })
            .then(res => {
              if (res.code === 200) {
                that.$emit('ok')
                that.visible = false
              }
              that.$message.info(res.msg)
            })
            .catch(err => {
              that.$message.error(err.message)
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm() {
      // this.$refs.ruleForm.resetFields();
    },
    handleCancel() {
      // this.resetForm()
      this.visible = false
    }
  }
}
</script>
<style scoped>
.custom-table-border th,
.custom-table-border td {
  padding: 2px;
}
</style>
