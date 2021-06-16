<template>
  <a-modal
    :title="modalTitle"
    :width="1200"
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
                    <span>{{form.bomGroupName || form.groupName}}</span>
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
                  <a-form-model-item >
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

          <div class="__hd">物料信息</div>
          <div class="__bd">
            <a-table
              :columns="columnsDetail"
              :dataSource="form.formChildDetailList"
              :pagination="false"
              size="small"
            >
              <div slot="order" slot-scope="text, record, index">
                {{index + 1}}
              </div>
              <div slot="useStatus" slot-scope="text, record, index">
                {{ {0:'未使用',1:'使用'}[text] }}
              </div>
              <div
                slot="modelType"
                slot-scope="text, record, index"
              >
                <a-tooltip>
                  <template slot="title">
                    {{text}}
                  </template>
                  <span class="icon-required">查看</span>
                  <a-icon
                    type="question-circle"
                    style="margin-left:5px;color:#1890ff;"
                  />
                </a-tooltip>
              </div>
              <div slot="materialProperty" slot-scope="text, record, index" >
                {{ {1:'自制',2:'外购',3:'委外',4:'标准件'}[text] }}
              </div>
              <div slot="materialUnit" slot-scope="text, record, index" >
                {{ {1:'支',2:'把',3:'件'}[text] }}
              </div>
              <div slot="isDelete" slot-scope="text, record, index" >
                {{ {1:'是',0:'否'}[text] }}
              </div>



              <div slot="level" slot-scope="text, record, index" >
                <a-form-model-item
                  :prop="`formChildDetailList.${index}.level`"
                  :rules=" {required: true, message: '输入顺序号'}"
                >
                  <a-input v-model="record.level" style="width:100px;" />
                </a-form-model-item>
              </div>

              <div slot="researchCode" slot-scope="text, record, index" >
                <a-form-model-item
                  :prop="`formChildDetailList.${index}.researchCode`"
                  :rules=" {required: true, message: '输入自研结构件代码'}"
                >
                  <a-input v-model="record.researchCode" style="width:100px;"/>
                </a-form-model-item>
              </div>

              <div slot="materialCode" slot-scope="text, record, index" >
                <a-form-model-item
                  :prop="`formChildDetailList.${index}.materialCode`"
                  :rules=" {required: true, message: '请选择物料代码'}"
                >
                  <a-select
                    style="width:150px;"
                    show-search
                    :value="record.materialCode"
                    placeholder="模糊搜索"
                    :default-active-first-option="false"
                    :show-arrow="false"
                    :filter-option="false"
                    @search="materialFuzzyAction"
                    @change="(key) => materialFuzzyTableHandleChange(key,record)"
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
              </div>

              <div slot="materialNum" slot-scope="text, record, index" >
                <a-form-model-item
                  :prop="`formChildDetailList.${index}.materialNum`"
                  :rules=" {required: true, message: '输入用量'}"
                >
                  <a-input-number
                    style="width:80px;"
                    :min="0"
                    :step="1"
                    :precision="2"
                    v-model="record.materialNum"
                  />
                </a-form-model-item>
              </div>
              <div slot="action" slot-scope="text, record, index" >
                <a href="javascript:void(0);" @click="materialTableAction('del',record)">删除</a>
              </div>
            </a-table>


            <!-- <table class="custom-table custom-table-border">
              <tr>
                <th style="width:80px;">序号</th>
                <th style="width:100px;">顺序号</th>
                <th style="width:100px;">自研结构件代码</th>
                <th>物料代码</th>
                <th>物料名称</th>
                <th style="width:150px;">规格型号</th>
                <th>物料属性</th>
                <th>辅计量单位</th>
                <th style="width:100px;">用量</th>
                <th>发料仓库</th>
                <th style="width:80px;">操作</th>
              </tr>
              <tr v-for="(item ,idx) in form.formChildDetailList" :key="item.key">
                <td>{{idx + 1}}</td>
                <td>
                  <a-form-model-item
                    :prop="`formChildDetailList.${idx}.level`"
                    :rules=" {required: true, message: '输入顺序号'}"
                  >
                    <a-input v-model="item.level" />
                  </a-form-model-item>
                </td>
                <td>
                  <a-form-model-item
                    :prop="`formChildDetailList.${idx}.researchCode`"
                    :rules=" {required: true, message: '输入自研结构件代码'}"
                  >
                    <a-input v-model="item.researchCode" />
                  </a-form-model-item>
                </td>
                <td>
                  <a-form-model-item
                    :prop="`formChildDetailList.${idx}.materialCode`"
                    :rules=" {required: true, message: '请选择物料代码'}"
                  >
                    <a-select
                      show-search
                      :value="item.materialCode"
                      placeholder="模糊搜索"
                      style="width: 100%"
                      :default-active-first-option="false"
                      :show-arrow="false"
                      :filter-option="false"
                      @search="materialFuzzyAction"
                      @change="(key) => materialFuzzyTableHandleChange(key,item)"
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
                <td>{{item.materialName}}</td>
                <td>{{item.modelType}}</td>
                <td>{{ {1:'自制',2:'外购',3:'委外',4:'标准件'}[item.materialProperty]}}</td>
                <td>{{ {1:'支',2:'把',3:'件'}[item.materialUnit] }}</td>
                <td>
                  <a-form-model-item
                    :prop="`formChildDetailList.${idx}.materialNum`"
                    :rules=" {required: true, message: '输入用量'}"
                  >
                    <a-input-number
                      style="width:100%;"
                      :min="0"
                      :step="1"
                      :precision="2"
                      v-model="item.materialNum"
                    />
                  </a-form-model-item>
                </td>
                <td>{{item.storeAddress}}</td>
                <td>
                  <a href="javascript:void(0);" @click="materialTableAction('del',item)">删除</a>
                </td>
              </tr>
            </table> -->
            <a-button
              style="width:100%;"
              type="dashed"
              icon="plus"
              @click="materialTableAction('add')"
            >添加</a-button>
          </div>

          <div class="__hd">操作信息</div>
          <div class="__bd">
            <table class="custom-table custom-table-border">
              <tr>
                <td style="width:150px;">提交人</td>
                <td style="width:350px;">
                  {{form.createdName}}
                </td>
                <td style="width:150px;">
                  提交时间
                </td>
                <td style="width:350px;">
                  {{form.createdTime}}
                </td>
              </tr>
              <tr>
                <td>
                  {{ [3,4].includes(+form.status) ? '审核人员' : '最后更新人' }}
                </td>
                <td>{{form.modifierName}}</td>
                <td>{{ [3,4].includes(+form.status) ? '审核时间' : '最后更新时间' }}</td>
                <td>{{form.modifyTime}}</td>
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
import { materialFormAddOrUpdate,getMaterialFormDetail } from '@/api/bomManagement'
import moment from 'moment'

const columnsDetail = [
  {
    align: 'center',
    title: '序号',
    key: 'order',
    width: '70px',
    scopedSlots: { customRender: 'order' }
  },
  {
    align: 'center',
    title: '顺序号',
    dataIndex: 'level',
    scopedSlots: { customRender: 'level' }
  },
  {
    align: 'center',
    title: '自研结构件代码',
    dataIndex: 'researchCode',
    scopedSlots: { customRender: 'researchCode' }
  },
  {
    align: 'center',
    title: '物料代码',
    dataIndex: 'materialCode',
    scopedSlots: { customRender: 'materialCode' }
  },
  {
    align: 'center',
    title: '物料名称',
    dataIndex: 'materialName'
  },
  {
    align: 'center',
    title: '规格型号',
    dataIndex: 'modelType',
    scopedSlots: { customRender: 'modelType' }
  },
  {
    align: 'center',
    title: '物料属性',
    dataIndex: 'materialProperty',
    scopedSlots: { customRender: 'materialProperty' }
  },
  {
    align: 'center',
    title: '辅计量单位',
    dataIndex: 'materialUnit',
    scopedSlots: { customRender: 'materialUnit' }
  },
  {
    align: 'center',
    title: '用量',
    dataIndex: 'materialNum',
    scopedSlots: { customRender: 'materialNum' }
  },
  {
    align: 'center',
    title: '发料仓库',
    dataIndex: 'storeAddress'
  },
  {
    align: 'center',
    title: '操作',
    scopedSlots: { customRender: 'action' }
  },
]


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
      columnsDetail,
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
        yield:100,
        formChildDetailList:[],//物料信息
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
      return this.isView ? '查看' : this.isAdd ? '新增' : this.isEdit ? '编辑' : this.isCopy ? '复制新增' : '审批'
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

      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          that.spinning = true
          materialFormAddOrUpdate({...that.form}).then(res => {
            console.log(res)
            that.spinning = false
            console.log(res)
            that.$message.info(res.msg)
            if (res.code === 200) {
              that.$emit('finish', { key: that.targetNode.value })
              that.handleCancel()
            }
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
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
      if(type === 'add'){
        that.form = {
          ...that.form,
          bomGroupName:that.targetNode.title,
          groupId:that.targetNode.value
        }
      }else if(type === 'edit' || type === 'copy'){
        let isEdit = type === 'edit'
        let isCopy = type === 'copy'
        getMaterialFormDetail({id:record.id}).then(res => {
          let data = res.data
          data.formChildDetailList = data.detailListVo.map(item => {
            return Object.assign({},item,{key:uuid()})
          })
          if(isCopy){
            delete data.id
            delete data.bomCode
            data.formChildDetailList = data.formChildDetailList.map(item => {
              let _item = Object.assign({},item)
              delete _item.id
              return _item
            })
          }
          that.form = res.data
        })
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
        materialUnit:target.mainUnit,
        modelType:target.specifications
      }
      console.log(target)
      that.materialFuzzySearch = {list:[],fetching:false,item:target}
    },
    materialFuzzyTableHandleChange(key,item){
      const that = this
      const target = that.materialFuzzySearch.list.find(item => item.__key === key)
      let formChildDetailList = [...that.form.formChildDetailList]
      let _target = formChildDetailList.find(itemSelf => itemSelf.key === item.key)

      _target.materialId =  target.id,
      _target.materialCode =  target.materialCode,
      _target.materialName =  target.materialName,
      _target.materialProperty =  target.materialSource,
      _target.materialUnit = target.mainUnit,
      _target.modelType = target.specifications

      that.form = {...that.form,formChildDetailList}
      that.materialFuzzySearch = {list:[],fetching:false,item:target}
    },
    materialTableAction(type,item){
      const that = this
      if(type === 'add'){
        let formChildDetailList = [...that.form.formChildDetailList]
        formChildDetailList.push({key:uuid()})
        that.form = {...that.form,formChildDetailList}
      }else if(type === 'del'){
        let formChildDetailList = [...that.form.formChildDetailList]
        formChildDetailList = formChildDetailList.filter(itemSelf => itemSelf.key !== item.key)
        that.form = {...that.form,formChildDetailList}
      }
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
      that.form = {...that.form,craftId:target.id,routeCode:target.routeCode,routeName:target.routeName}
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
