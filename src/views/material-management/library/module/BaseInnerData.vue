<template>
  <a-form-model
    ref="ruleForm"
    :model="form"
    :rules="rules"
    class="routine-addform-wrapper-baseInnerData"
  >
    <h3>基本数据</h3>
    <table class="custom-table custom-table-border">
      <tbody>
        <tr>
          <td style="width:150px;">
            <span class="icon-required">物料代码</span>
          </td>
          <td>
            <a-form-model-item
              ref="materialCode"
              prop="materialCode"
            >
              <a-input
                v-model="form.materialCode"
                placeholder="系统生成"
                disabled="disabled"
              />
            </a-form-model-item>
          </td>
          <td style="width:150px;">
            <span class="icon-required">物料名称</span>
          </td>
          <td>
            <a-form-model-item
              ref="materialName"
              prop="materialName"
            >
              <a-input
                v-model="form.materialName"
                :disabled="normalAddForm.isView"
              />
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
                <a-select-option :value="1">使用</a-select-option>
                <a-select-option :value="2">未使用</a-select-option>
                <a-select-option :value="3">逐步淘汰</a-select-option>
                <a-select-option :value="4">已淘汰</a-select-option>
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
              {{form.specification}}
            </a-form-model-item>
          </td>
        </tr>

        <tr>
          <td>
            <span class="icon-required">主计量单位</span>
          </td>
          <td>
            <a-form-model-item prop="mainUnit">
              <a-select
                :disabled="normalAddForm.isView"
                v-model="form.mainUnit"
                placeholder="请选择主计量单位"
                :allowClear="true"
              >
                <a-select-option
                  v-for="item in materialUnitList"
                  :key="item.text"
                  :value="item.text"
                >
                {{item.text}}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </td>
          <td>
            <span class="icon-required">辅计量单位</span>
          </td>
          <td>
            <a-form-model-item prop="subUnit">
              <a-select
                :disabled="normalAddForm.isView"
                v-model="form.subUnit"
                placeholder="请选择辅计量单位"
                :allowClear="true"
              >
                <a-select-option
                  v-for="item in materialUnitList"
                  :key="item.text"
                  :value="item.text"
                >
                {{item.text}}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </td>
        </tr>

        <tr>
          <td>
            <span style="margin-left:5px;">
              <a-tooltip>
                <template slot="title">
                  换算率是一个主计量单位等于多少个辅计量单位
                </template>
                <span class="icon-required">换算率</span>
                <a-icon
                  type="question-circle"
                  style="margin-left:5px;color:#1890ff;"
                />
              </a-tooltip>
            </span>
          </td>
          <td>
            <a-form-model-item
              ref="conversionRate"
              prop="conversionRate"
            >
              <a-input-number
                :disabled="normalAddForm.isView"
                v-model="form.conversionRate"
                :allowClear="true"
                :min="0"
                :step="1"
                style="width:100%;"
              />
            </a-form-model-item>
          </td>
          <td>
            <span>预估重量(克)</span>
          </td>
          <td>
            <a-form-model-item
              ref="estimateWeight"
              prop="estimateWeight"
            >
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
              <span class="icon-required">是否需要送检</span>
            </td>
            <td>
              <a-form-model-item
                ref="needCheck"
                prop="needCheck"
              >
                <a-radio-group
                  :disabled="normalAddForm.isView"
                  name="radioGroup"
                  v-model="form.needCheck"
                >
                  <a-radio :value="1">是</a-radio>
                  <a-radio :value="2">否</a-radio>
                </a-radio-group>
              </a-form-model-item>
            </td>
          </template>
          <td class="icon-required">原K3物料代码</td>
          <td :colspan="normalAddForm.isNormal ? 1 : 3">
            <a-form-model-item
              ref="k3Code"
              prop="k3Code"
              has-feedback
            >
              <a-input
                :disabled="normalAddForm.isView"
                v-model="form.k3Code"
                :allowClear="true"
              />
            </a-form-model-item>
          </td>
        </tr>
        <tr>
          <td>备注</td>
          <td colspan="3">
            <a-form-model-item
              ref="remark"
              prop="remark"
            >
              <a-input
                :disabled="normalAddForm.isView"
                v-model="form.remark"
                type="textarea"
                :allowClear="true"
              />
            </a-form-model-item>
          </td>
        </tr>
      </tbody>
    </table>
  </a-form-model>
</template>
<script>
import { getDictionary } from '@/api/common'

import {
  materialInfoCheckK3Code
} from '@/api/routineMaterial'

export default {
  name: 'BaseInnerData',
  inject: ['normalAddForm'],
  data() {
    const that = this
    let checkPending
    let checkK3Code = (rule, value, callback) => {
      clearTimeout(checkPending);
      if (!value) {
        return callback(new Error('请输入原K3物料代码'));
      }
      checkPending = setTimeout(() => {
        that.checkk3code(value).then(res => {

          if(res){
            return callback(new Error('K3物料代码重复'));
          }else{
            callback();
          }
        })
      }, 1000);
    }

    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      form: {
        materialCode: undefined,
        materialName: undefined,
        materialSource: undefined,
        useStatus: undefined,

        mainUnit: undefined,
        subUnit: undefined,
        conversionRate: undefined,
        estimateWeight: 0,
        remark: undefined,
        k3Code: undefined,
        needCheck:2
      },
      rules: {
        materialSource: [{ required: true, message: '请选择物料来源属性' }],
        useStatus: [{ required: true, message: '请选择使用状态' }],
        mainUnit: [{ required: true, message: '请选择主计量单位' }],
        subUnit: [{ required: true, message: '请选择辅计量单位' }],
        conversionRate: [{ required: true, message: '请输入换算率' }],
        // k3Code: [{ required: true, message: '请输入原K3物料代码' }],
        k3Code: [{ validator: checkK3Code, trigger: 'change' }],
        needCheck:[{ required: true, message: '请选择是否需要送检' }]
      },
      materialUnitList:[], //物料计量单位
    }
  },
  created() {
    const that = this
    that.form = that.normalAddForm.submitParams
    if(that.normalAddForm.isAdd){
      that.$nextTick(() => {
        that.form = {
          ...that.form,
          useStatus:2,
          needCheck:2
        }
      })
    }

    getDictionary({ text: '物料计量单位' }).then((res) => {
      that.materialUnitList = res.data
    })
  },
  methods: {
    validate() {
      const that = this
      return new Promise((resolve, reject) => {
        that.$refs.ruleForm.validate(valid => {
          if (valid) {
            resolve({ ...that.form })
          } else {
            resolve(null)
          }
        })
      })
    },
    reset() {
      this.$refs.ruleForm.resetFields()
    },
    checkk3code(e){
      const that = this
      const k3Code = that.form.k3Code
      return materialInfoCheckK3Code({
        k3Code,
        _type:that.normalAddForm.isNormal ? 'normal' : 'product',
        materialInfoId:that.normalAddForm.submitParams.id
      }).then(res => {
        try{
          return !!res.data
        }catch(err){
          console.log(err)
          return false
        }
      }).catch(err => {
        console.log(err)
        return false
      })
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
