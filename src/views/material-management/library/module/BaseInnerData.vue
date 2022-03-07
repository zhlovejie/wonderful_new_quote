<template>
  <a-form-model ref="ruleForm" :model="form" :rules="rules" class="routine-addform-wrapper-baseInnerData">
    <h3>基本数据</h3>
    <table class="custom-table custom-table-border">
      <tbody>
        <tr>
          <td style="width:150px;">
            <span class="icon-required">物料代码</span>
          </td>
          <td>
            <a-form-model-item ref="materialCode" prop="materialCode">
              <a-input v-model="form.materialCode" placeholder="系统生成" disabled="disabled" />
            </a-form-model-item>
          </td>
          <td style="width:150px;">
            <span class="icon-required">物料名称</span>
          </td>
          <td>
            <a-form-model-item ref="materialName" prop="materialName">
              <a-input v-model="form.materialName" :disabled="normalAddForm.isView" />
            </a-form-model-item>
          </td>
        </tr>

        <tr>
          <td style="width:150px;">
            <span class="icon-required">物料来源属性</span>
          </td>
          <td>
            <a-form-model-item prop="materialSource">
              <a-select
                :disabled="normalAddForm.isView"
                v-model="form.materialSource"
                placeholder="请选择物料来源属性"
                :allowClear="true"
              >
                <a-select-option :value="1">自制</a-select-option>
                <a-select-option :value="2">外购</a-select-option>
                <a-select-option :value="3">委外</a-select-option>
                <a-select-option :value="4">标准件</a-select-option>
                <a-select-option :value="5">定制</a-select-option>
              </a-select>
            </a-form-model-item>
          </td>
          <td style="width:150px;">
            <span class="icon-required">使用状态</span>
          </td>
          <td>
            <a-form-model-item prop="useStatus">
              <a-select
                :disabled="normalAddForm.isView"
                v-model="form.useStatus"
                placeholder="请选择使用状态"
                :allowClear="true"
              >
                <a-select-option :value="1">常规使用</a-select-option>
                <a-select-option :value="2">未使用</a-select-option>
                <a-select-option :value="3">即将淘汰</a-select-option>
                <a-select-option :value="4">已淘汰</a-select-option>
                <a-select-option :value="5">实验室使用</a-select-option>
              </a-select>
            </a-form-model-item>
          </td>
        </tr>

        <tr v-if="normalAddForm.isNormal">
          <td>规格型号</td>
          <td colspan="3">
            <a-form-model-item>
              <!-- 材质：{{form.texture}}&nbsp;&nbsp;
              厚度：{{form.thickness}}&nbsp;&nbsp;
              宽度：{{form.width}}&nbsp;&nbsp;
              长度：{{form.length}} -->
              <!-- {{form.specification}} -->
              <div v-html="form.specificationHTML"></div>
            </a-form-model-item>
          </td>
        </tr>

        <tr>
          <td>
            <span class="icon-required">采购计量单位</span>
          </td>
          <td>
            <a-form-model-item prop="mainUnit">
              <a-select
                :disabled="normalAddForm.isView"
                mode="multiple"
                v-model="form.mainUnit"
                placeholder="请选择采购计量单位"
                :allowClear="true"
              >
                <a-select-option v-for="item in materialUnitList" :key="item.text" :value="item.text">
                  {{ item.text }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </td>
          <td>
            <span class="icon-required">使用计量单位</span>
          </td>
          <td>
            <a-form-model-item prop="subUnit">
              <a-select
                :disabled="normalAddForm.isView"
                v-model="form.subUnit"
                placeholder="请选择使用计量单位"
                :allowClear="true"
              >
                <a-select-option v-for="item in materialUnitList" :key="item.text" :value="item.text">
                  {{ item.text }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </td>
        </tr>

        <tr>
          <!-- <td>
            <span style="margin-left:5px;">
              <a-tooltip>
                <template slot="title">
                  换算率是一个主计量单位等于多少个辅计量单位
                </template>
                <span class="icon-required">换算率</span>
                <a-icon type="question-circle" style="margin-left:5px;color:#1890ff;" />
              </a-tooltip>
            </span>
          </td>
          <td>
            <a-form-model-item ref="conversionRate" prop="conversionRate">
              <a-input-number
                :disabled="normalAddForm.isView"
                v-model="form.conversionRate"
                :allowClear="true"
                :min="0"
                :step="1"
                style="width:100%;"
              />
            </a-form-model-item>
          </td> -->
          <td>
            <span>预估重量(克)</span>
          </td>
          <td colspan="3">
            <a-form-model-item ref="estimateWeight" prop="estimateWeight">
              <a-input-number
                :disabled="normalAddForm.isView"
                v-model="form.estimateWeight"
                :min="0"
                :precision="2"
                step="1"
                style="width: 100%"
              />
            </a-form-model-item>
          </td>
        </tr>
        <tr>
          <template v-if="normalAddForm.isNormal">
            <td>
              <span class="icon-required">是否第三方送检</span>
            </td>
            <td>
              <a-form-model-item ref="needCheck" prop="needCheck">
                <a-radio-group :disabled="normalAddForm.isView" name="radioGroup" v-model="form.needCheck">
                  <a-radio :value="1">是</a-radio>
                  <a-radio :value="2">否</a-radio>
                </a-radio-group>
              </a-form-model-item>
            </td>
          </template>
          <td>原K3物料代码</td>
          <td >
            <a-form-model-item>
              <a-input :disabled="normalAddForm.isView" v-model="form.k3Code" :allowClear="true" />
            </a-form-model-item>
          </td>
          <template v-if="!normalAddForm.isNormal">
          <td >
            <span class="icon-required">方数<span style="margin:0 5px;">(m³)</span></span>
          </td>
          <td>
              <a-form-item label="">
              <a-input-number
                :disabled="normalAddForm.isView"
                style="width: 100%"
                :min="0"
                :step="1"
                :precision="2"
                v-model="form.squareNum"
              />
            </a-form-item>
          </td>
          </template>
        </tr>
        </tr>
        <tr>
          <td>备注</td>
          <td colspan="3">
            <a-form-model-item ref="remark" prop="remark">
              <a-input :disabled="normalAddForm.isView" v-model="form.remark" type="textarea" :allowClear="true" />
            </a-form-model-item>
          </td>
        </tr>

        <tr v-if="normalAddForm.isEdit && isShowMaterialReason()">
          <td>
            <span class="icon-required">物料代码变更原因</span>
          </td>
          <td colspan="3">
            <a-form-model-item ref="reason" prop="reason">
              <a-input v-model="form.reason" type="textarea" :allowClear="true" />
            </a-form-model-item>
          </td>
        </tr>
      </tbody>
    </table>
  </a-form-model>
</template>
<script>
import { getDictionary } from '@/api/common'

import { materialInfoCheckK3Code } from '@/api/routineMaterial'

export default {
  name: 'BaseInnerData',
  inject: ['normalAddForm'],
  data() {
    const that = this
    let checkPending
    let checkK3Code = (rule, value, callback) => {
      clearTimeout(checkPending)
      if (!value) {
        return callback(new Error('请输入原K3物料代码'))
      }
      checkPending = setTimeout(() => {
        that.checkk3code(value).then(res => {
          if (res) {
            return callback(new Error('K3物料代码重复'))
          } else {
            callback()
          }
        })
      }, 1000)
    }

    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      form: {
        materialCode: undefined,
        materialName: undefined,
        materialSource: undefined,
        useStatus: undefined,

        mainUnit: [],
        subUnit: undefined,
        conversionRate: '0',
        estimateWeight: 0,
        remark: undefined,
        k3Code: undefined,
        needCheck: 2
      },
      rules: {
        materialSource: [{ required: true, message: '请选择物料来源属性' }],
        useStatus: [{ required: true, message: '请选择使用状态' }],
        mainUnit: [{ required: true, message: '请选择主计量单位' }],
        subUnit: [{ required: true, message: '请选择辅计量单位' }],
        // conversionRate: [{ required: true, message: '请输入换算率' }],
        // k3Code: [{ required: true, message: '请输入原K3物料代码' }],
        // k3Code: [{ validator: checkK3Code, trigger: 'change' }],
        needCheck: [{ required: true, message: '请选择是否需要送检' }],
        reason: [{ required: true, message: '请输入物料代码变更原因' }],
        squareNum:[{ required: true, message: '请输入方数' }],
        // estimateWeight:[{ required: false, message: '请输入方数' }]
      },
      materialUnitList: [] //物料计量单位
    }
  },
  created() {
    const that = this
    let submitParams = that.normalAddForm.submitParams || {}
    let mainUnit = []
    if(submitParams.mainUnit){
      mainUnit = String(submitParams.mainUnit).split(',')
    }
    that.form = {
      ...that.normalAddForm.submitParams,
      mainUnit:mainUnit,
      specificationHTML: that.specificationFormat(that.form.specification)
    }


    if (that.normalAddForm.isAdd) {
      that.$nextTick(() => {
        that.form = {
          ...that.form,
          useStatus: 2,
          needCheck: 2
        }
      })
    }

    getDictionary({ text: '物料计量单位' }).then(res => {
      that.materialUnitList = res.data
    })
  },
  methods: {
    isShowMaterialReason() {
      const that = this
      try {
        const { materialCode, __materialCodeCache } = that.normalAddForm.submitParams
        console.log(`materialCode:${materialCode}---__materialCodeCache:${__materialCodeCache}`)
        return materialCode !== __materialCodeCache
      } catch (err) {
        console.error(err)
        return false
      }
    },
    validate() {
      const that = this
      return new Promise((resolve, reject) => {
        that.$refs.ruleForm.validate(valid => {
          if (valid) {
            resolve({ ...that.form ,mainUnit:Array.isArray(that.form.mainUnit) ? that.form.mainUnit.join(','):''})
          } else {
            resolve(null)
          }
        })
      })
    },
    reset() {
      this.$refs.ruleForm.resetFields()
    },
    checkk3code(e) {
      const that = this
      const k3Code = that.form.k3Code
      return materialInfoCheckK3Code({
        k3Code,
        _type: that.normalAddForm.isNormal ? 'normal' : 'product',
        materialInfoId: that.normalAddForm.submitParams.id
      })
        .then(res => {
          try {
            return !!res.data
          } catch (err) {
            console.log(err)
            return false
          }
        })
        .catch(err => {
          console.log(err)
          return false
        })
    },
    specificationFormat(sp) {
      if (sp) {
        let _sp = sp.replace(/\s+/g, '')
        let _strList = String(_sp).split(',')
        let maxWidth = 0,
          wordWidth = 16
        _strList.map(v => {
          v.split(':').map((e, idx) => {
            if (idx === 0) {
              const w = e.length * wordWidth
              maxWidth = w > maxWidth ? w : maxWidth
            }
          })
        })
        const HTML = _strList
          .map(v => {
            let arr = []
            v.split(':').map((e, idx) => {
              arr.push(
                `<div style="width:${idx === 0 ? maxWidth + 'px' : 'auto'};text-align:left;">${
                  idx === 1 ? ':&nbsp;&nbsp;' : ''
                }${e}</div>`
              )
            })
            return `<div style="display:flex;">${arr.join('')}</div>`
          })
          .join('')

        return HTML
      }
      return sp
    }
  }
}
</script>

<style scoped>
.routine-addform-wrapper-baseInnerData >>> .ant-form-item {
  display: flex;
  margin: 0;
}
.routine-addform-wrapper-baseInnerData >>> .ant-form-item .ant-form-item-label {
  width: auto;
  text-align: left;
}
.routine-addform-wrapper-baseInnerData >>> .ant-form-item .ant-form-item-control-wrapper {
  flex: 1;
}
.custom-table-border th,
.custom-table-border td {
  padding: 5px;
}
.custom-table-border caption {
  text-align: left;
}
.icon-required::before {
  display: inline-block;
  margin-right: 4px;
  color: #f5222d;
  font-size: 14px;
  font-family: SimSun, sans-serif;
  line-height: 1;
  content: '*';
}
</style>
