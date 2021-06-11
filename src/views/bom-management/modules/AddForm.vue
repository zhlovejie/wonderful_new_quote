<template>
  <a-modal
    :title="modalTitle"
    :width="1050"
    :visible="visible"
    :footer="footer"
    @cancel="handleCancel"
    :maskClosable="false"
    :destroyOnClose="true"
  >
    <a-spin :spinning="spinning">
      <a-form-model
        ref="ruleForm"
        :model="form"
        :rules="rules"
        class="bom-management-wrapper"
      >
        <div class="card-item">
          <div class="__hd">基本信息</div>
          <div class="__bd">
            <table class="custom-table custom-table-border">
              <tr>
                <td style="width:150px;">BOM单组别</td>
                <td style="width:350px;">
                  <a-form-model-item>
                    <span>{{form.bomGroupName}}</span>
                  </a-form-model-item>
                </td>
                <td style="width:150px;">BOM单编号</td>
                <td style="width:350px;">
                  <a-form-model-item prop="bomCode">
                    <span>{{form.bomCode || '系统自动生成'}}</span>
                  </a-form-model-item>
                </td>
              </tr>
              <tr>
                <td>状态</td>
                <td>
                  <a-form-model-item prop="useStatus">
                    <a-select
                      v-if="!isDisabled"
                      v-model="form.useStatus"
                      placeholder="状态"
                    >
                      <a-select-option :value="0">未使用</a-select-option>
                      <a-select-option :value="1">使用</a-select-option>
                    </a-select>
                    <span v-else>{{ {0:'未使用',1:'使用'}[form.useStatus] }}</span>
                  </a-form-model-item>
                </td>
                <td>物料代码</td>
                <td>
                  <a-form-model-item prop="materialCode">
                    <a-select
                      show-search
                      :value="form.materialCode"
                      placeholder="模糊搜索"
                      style="width: 100%"
                      :default-active-first-option="false"
                      :show-arrow="false"
                      :filter-option="false"
                      @search="materialFuzzyAction"
                      @change="materialFuzzyHandleChange"
                    >
                      <a-spin
                        v-if="materialFuzzySearch.fetching"
                        slot="notFoundContent"
                        size="small"
                      />
                      <a-select-option
                        v-for="item in materialFuzzySearch.list"
                        :key="item.__key"
                        :value="item.__key"
                      >
                        {{ item.__label }}
                      </a-select-option>
                    </a-select>
                  </a-form-model-item>
                </td>
              </tr>
              <tr>
                <td>物料名称</td>
                <td>
                  <a-form-model-item>
                    {{form.materialName}}
                  </a-form-model-item>
                </td>
                <td>物料属性</td>
                <td>
                  <a-form-model-item>
                    {{ {1:'自制',2:'外购',3:'委外',4:'标准件'}[form.materialProperty]}}
                  </a-form-model-item>
                </td>
              </tr>
              <tr>
                <td>主计量单位</td>
                <td>
                  <a-form-model-item>
                    {{ {1:'支',2:'把',3:'件'}[form.materialUnit] }}
                  </a-form-model-item>
                </td>
              </tr>
              <tr>
                <td>成品率(%)</td>
                <td>
                  <a-form-model-item prop="yield">
                    <a-input-number
                      style="width:100%;"
                      :min="0"
                      :max="100"
                      :step="1"
                      v-model="form.yield"
                    />
                  </a-form-model-item>
                </td>
                <td>工艺路线代码</td>
                <td>
                  <a-form-model-item prop="routeCode">
                    <a-select
                      show-search
                      :value="form.routeCode"
                      placeholder="模糊搜索"
                      style="width: 100%"
                      :default-active-first-option="false"
                      :show-arrow="false"
                      :filter-option="false"
                      :not-found-content="null"
                      @search="bomFuzzyAction"
                      @change="bomFuzzyHandleChange"
                    >
                      <a-spin
                        v-if="bomFuzzySearch.fetching"
                        slot="notFoundContent"
                        size="small"
                      />
                      <a-select-option
                        v-for="item in bomFuzzySearch.list"
                        :key="item.__key"
                        :value="item.__key"
                      >
                        {{ item.__label }}
                      </a-select-option>
                    </a-select>
                  </a-form-model-item>
                </td>
              </tr>
              <tr>
                <td>工艺路线名称</td>
                <td>
                  <a-form-model-item prop="routeName">
                    {{form.routeName}}
                  </a-form-model-item>
                </td>
                <td>备注</td>
                <td>
                  <a-form-model-item prop="remark">
                    <a-textarea
                      placeholder="备注"
                      :rows="1"
                      v-model="form.remark"
                    />
                  </a-form-model-item>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
//物料代码模糊搜索
import { routineMaterialInfoPageList } from '@/api/routineMaterial'
import moment from 'moment'

let uuid = () => Math.random().toString(16).slice(2);
export default {
  name: 'bom-management-wrapper',
  provide(){
    return {
      addForm:this
    }
  },
  components: {

  },
  data() {
    this.materialFuzzyAction = this.$_.debounce(this.materialFuzzyAction, 800)
    this.bomFuzzyAction = this.$_.debounce(this.bomFuzzyAction, 800)
    return {
      visible: false,
      actionType: 'view',
      spinning: false,
      detail: {},
      materialFuzzySearch:{
        list: [],
        item:{},
        fetching: false,
      },
      bomFuzzySearch:{
        list:[],
        item:{},
        fetching:false
      },
      form: {
        materialNum:1, //数量默认 1 不可更改，前端不展示
      },
      rules: {
        routeName: [{ required: true, message: '请输入工艺路线名称' }],
        defaultStatus: [{ required: true, message: '请选择缺省状态' }],
        materialCode: [{ required: true, message: '请选择物料代码' }]
      }
    }
  },
  computed: {
    modalTitle() {
      return this.isView ? '查看' : this.isAdd ? '新增' : this.isEdit ? '编辑' : '审批'
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
    isCopy() {
      return this.actionType === 'copy'
    },
    isApproval() {
      return this.actionType === 'approval'
    },
    isDisabled() {
      return this.isView || this.isApproval
    },
    footer() {
      const that = this
      const h = that.$createElement
      const btn = []
      if (that.isView) {
        return null
      } else if (that.isAdd || that.isEdit) {
        btn.push(h('a-button', { key: 'cancel', on: { click: that.handleCancel } }, '取消'))
        btn.push(
          h(
            'a-button',
            {
              key: 'submit',
              on: { click: () => that.handleOk() },
              props: { type: 'primary', loading: that.spinning }
            },
            '提交'
          )
        )
      } else if (that.isApproval) {
        btn.push(
          h(
            'a-button',
            { key: 'no-pass', on: { click: that.noPassAction }, props: { loading: that.spinning } },
            '不通过'
          )
        )
        btn.push(
          h(
            'a-button',
            { key: 'pass', on: { click: that.passAction }, props: { type: 'primary', loading: that.spinning } },
            '通过'
          )
        )
      }
      return btn
    }
  },
  methods: {
    moment,

    async handleOk() {
      const that = this
      if (that.isView) {
        that.handleCancel()
        return
      }
      that.$refs.ruleForm.validate(valid => {
        if (valid) {
          const api = that.isAdd ? craftRouteAdd : craftRouteUpdate
          that.spinning = true
          api({ ...that.form })
            .then(res => {
              that.spinning = false
              console.log(res)
              that.$message.info(res.msg)
              if (res.code === 200) {
                that.$emit('finish', { key: that.targetNode.value })
                that.handleCancel()
              }
            })
            .catch(err => {
              that.$message.error(err)
              console.log(err)
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleCancel() {
      this.$nextTick(() => (this.visible = false))
    },
    async query(type, record = {}) {
      const that = this
      that.visible = true
      that.actionType = type
      that.detail = record
      that.targetNode = record.__selectItem

      that.form = {
        ...that.form,
        bomGroupName:that.targetNode.title
      }
    },
    async materialFuzzyAction(wd) {
      const that = this
      const _searchParam = {
        current: 1,
        size: 10,
        materialCode: wd
      }
      that.materialFuzzySearch = {...that.materialFuzzySearch,fetching:true}
      const result = await routineMaterialInfoPageList(_searchParam).then(res => {
        if (!(res && res.data && res.data.records && Array.isArray(res.data.records))) {
          return []
        }

        return res.data.records.map((item, index) => {
          item.__key = uuid()
          item.__label = item.materialCode
          item.__value = item.materialName

          item.specifications = `
              材质：${item.texture}
              厚度：${item.thickness}
              宽度：${item.width}
              长度：${item.length}
            `
          return item
        })
      })
      that.materialFuzzySearch = {...that.materialFuzzySearch,fetching:true,list:result}
    },
    materialFuzzyHandleChange(key) {
      const that = this
      const target = that.materialFuzzySearch.list.find(item => item.__key === key)
      that.form = {
        ...that.form,
        materialId: target.id,
        materialCode: target.materialCode,
        materialName: target.materialName,
        materialProperty: target.materialSource,
        materialUnit:target.mainUnit
      }
      console.log(target)
      that.materialFuzzySearch = {list:[],fetching:false,item:target}
    },

    async bomFuzzyAction(wd) {
      const that = this
      const _searchParam = {
        current: 1,
        size: 10,
        materialCode: wd
      }
      that.bomFuzzySearch = {...that.bomFuzzySearch,fetching:true}
      const result = await new Promise((resolve,reject) => {
        let testData = [
          {__value:'test1',__label:'测试工艺路线1',__key:uuid(),routeCode:'111',routeName:'test1111'},
          {__value:'test2',__label:'测试工艺路线2',__key:uuid(),routeCode:'222',routeName:'test2222'},
        ]
        setTimeout(() => {
          resolve(testData)
        }, 200);
      })
      that.bomFuzzySearch = {...that.bomFuzzySearch,fetching:true,list:result}
    },
    bomFuzzyHandleChange(key) {
      const that = this
      const target = that.bomFuzzySearch.list.find(item => item.__key === key)
      console.log(target)
      that.form = {...that.form,routeCode:target.routeCode,routeName:target.routeName}
      that.bomFuzzySearch = {list:[],fetching:false,item:target}
    }
  }
}
</script>

<style scoped>
.custom-table-border th,
.custom-table-border td {
  padding: 5px 10px;
  line-height: 40px;
}

.bom-management-wrapper >>> .ant-form-item {
  margin-bottom: 0;
}

.bom-management-wrapper >>> .custom-table {
  margin-bottom: 0;
}
.custom-table >>> .custom-table {
  margin: -1px;
  width: calc(100% + 2px);
}

.card-item {
  margin-bottom: 20px;
}
.__hd {
  font-size: 125%;
  line-height: 40px;
  border-bottom: 1px solid #ccc;
  margin-bottom: 10px;
}

.ghost {
  background-color: rgba(250, 235, 215, 0.5);
}
</style>
