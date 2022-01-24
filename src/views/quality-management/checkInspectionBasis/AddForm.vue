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
      class="checkInspectionBasisAddForm"
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
      <a-row >
        <a-col :span="16">
          <a-form-model-item label="AQL值">
            <a-select
              mode="multiple"
              :value="aqlList"
              @change="handlerDictionaryChange"
              :filter-option="filterOption"
              :disabled="isDisabled"
            >
              <a-select-option
                v-for="item in aqlDataSourceAll"
                :key="item.id"
                :value="item.id"
              >
                <template v-if="item.__lost">
                  <a-tooltip>
                    <template slot="title">
                      该条数据已经在【检验参数配置】的【AQL值】条目中被删除
                    </template>
                    <span>{{ item.termName }}</span>
                    <a-tag color="red" style="margin:0 5px;">已废弃</a-tag>
                  </a-tooltip>
                </template>
                <template v-else>
                  <span>{{ item.termName }}</span>
                </template>
              </a-select-option>
            </a-select>

          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row >
        <a-col :span="16">
          <a-form-model-item label="备注信息">
            <a-textarea
              :disabled="isDisabled"
              placeholder="备注"
              style="width: 100%"
              allow-clear
              :auto-size="{ minRows: 3, maxRows: 5 }"
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
            :key="col.termName"
          >{{col.termName}}<a-tag v-if="col.__lost" color="red" style="margin:0 5px;">已废弃</a-tag></td>
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
import { 
  checkInspectionBasisDetail, 
  checkInspectionBasisAddOrUpdate, 
  checkParameterTermList
} from '@/api/qualityManagement'
import CommonDictionarySelect from '@/components/CustomerList/CommonDictionarySelect'
export default {
  name:'checkInspectionBasisAddForm',
  components: {
    CommonDictionarySelect
  },
  data() {
    return {
      visible: false,
      form: {},
      checkInspectionBasisAqls: [],
      aqlList:[],
      aqlDataSource: [],
      aqlDataSource_result:[],
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
      const that = this
      let arr = []
      that.aqlList.map(v => {
        let target = that.aqlDataSourceAll.find(item => +item.id === +v)
        if(target){
          arr.push({...target})
        }
      })
      return arr
    },
    aqlDataSourceAll(){
      let arr = [...this.aqlDataSource]
      this.aqlDataSource_result.map(a => {
        if(!arr.find(b => b.id === a.id)){
          arr.push({...a,__lost:true})
        }
      })
      return arr
    },
    isDisabled() {
      return this.isView
    }
  },
  methods: {
    handlerDictionaryChange(arr) {
      const that = this
      that.aqlList = arr
      const checkInspectionBasisAqls = [...that.checkInspectionBasisAqls]
      that.$nextTick(() => {
        that.checkInspectionBasisAqls = checkInspectionBasisAqls.map(aql => {
          aql.checkInspectionBasisAqlInfos = that.planHeaderColumns.map(col => {
            const key = `${col.id}-${col.termName}`
            const target = aql.checkInspectionBasisAqlInfos.find(info => info.key === key)
            if (target) {
              return { ...target }
            } else {
              return {
                key,
                ac: undefined,
                parameterTermId: col.id,
                parameterTermName: col.termName
              }
            }
          })
          return aql
        })
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
          // if (!checkRange(startValue, endValue, ac)) {
          //   const msg = `第${line}行第${line1}列【${parameterTermName}】输入不符合规则，只能输入【数字或*号】且范围在【${startValue}~${endValue}】之间`
          //   that.$message.info(msg)
          //   return false
          // }
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
              key: `${item.id}-${item.termName}`,
              ac: '',
              parameterTermId: item.id,
              parameterTermName: item.termName
            }
          })
        })
        that.checkInspectionBasisAqls = checkInspectionBasisAqls
      } else if (type === 'del') {
        that.checkInspectionBasisAqls = checkInspectionBasisAqls.filter(item => item.key !== record.key)
      }
    },
    async query(type, record) {
      const that = this
      that.type = type
      that.form = {}
      that.checkInspectionBasisAqls = []
      that.aqlDataSource_result = []
      that.visible = true

      await that.fetchParameterTermList('AQL值','aqlDataSource',function(arr){
        return [...arr].sort((item1,item2) => Number(item1.termName) - Number(item2.termName))
      })
      
      if (that.isAdd) {
        that.aqlDataSource_result = that.aqlDataSource
        that.aqlList = that.aqlDataSource_result.map(item => item.id)
      } else {
        await checkInspectionBasisDetail({ id: record.id }).then(res => {
          const { id, inspectionBasis, inspectionGrade, remarks, checkInspectionBasisAqlDeatilVos } = res.data || {
            checkInspectionBasisAqlDeatilVos: []
          }
          that.form = {
            id,
            inspectionBasis,
            inspectionGrade,
            remarks
          }

          const aqlDataSource_result = []
          that.checkInspectionBasisAqls = checkInspectionBasisAqlDeatilVos.map((item ,idx) => {
            let checkInspectionBasisAqlInfos = that.$_.cloneDeep(item.checkInspectionBasisAqlInfoDetailVos || [])
            
            item.checkInspectionBasisAqlInfos = checkInspectionBasisAqlInfos.map(info => {
              const {parameterTermId,parameterTermName} = info
              info.key = `${parameterTermId}-${parameterTermName}`
              return info
            })

            if(idx === 0){
              item.checkInspectionBasisAqlInfos.map(info => {
                aqlDataSource_result.push({
                  id:info.parameterTermId,
                  termName:info.parameterTermName
                })
              })
            }

            delete item.checkInspectionBasisAqlInfoDetailVos
            return item
          })
          that.aqlDataSource_result = aqlDataSource_result
          that.aqlList = that.aqlDataSource_result.map(item => item.id)
        })
      }
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
    },
    async fetchParameterTermList(termName,fieldName,sortFn) {
      const that = this
      const id = await checkParameterTermList({ termName })
        .then(res => {
          return Array.isArray(res.data) && res.data.length > 0 ? res.data[0].id : null
        })
        .catch(err => {
          return null
        })

      const list = await checkParameterTermList({ parentId: id })
        .then(res => {
          return Array.isArray(res.data) && res.data.length > 0 ? res.data : []
        })
        .catch(err => {
          return []
        })
      that[fieldName] = typeof sortFn === 'function' ? sortFn(list) : list
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    },
  }
}
</script>
<style scoped>
.checkInspectionBasisAddForm >>> .ant-form-item{
  display: flex;
}
.ant-form-item >>> .ant-form-item-label {
  width: 120px;
}
.ant-form-item >>> .ant-form-item-control-wrapper {
  flex: 1;
}
.custom-table-border th,
.custom-table-border td {
  padding: 2px;
}
</style>
