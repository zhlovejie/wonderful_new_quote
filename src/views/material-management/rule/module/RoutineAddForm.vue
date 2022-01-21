<template>
  <a-modal
    :title="modalTitle"
    :width="650"
    :visible="visible"
    :destroyOnClose="true"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :maskClosable="false"
    :confirmLoading="spinning"
  >
    <a-spin :spinning="spinning">

      <a-tabs v-if="isNormalAdd" :activeKey="activeKey" :defaultActiveKey="0" @change="tabChange">
        <a-tab-pane tab="新增" :key="1" />
        <a-tab-pane tab="复制" :key="2" />
      </a-tabs>
      <a-form :form="form" class="routine-addform-wrapper">
        <a-form-item hidden>
          <a-input v-decorator="['id', { initialValue: detail.id }]" />
        </a-form-item>
        <template v-if="activeKey === 1">
          <a-form-item label="上级菜单">
            <a-tree-select
              style="width: 100%"
              :disabled="isDisabled || treeDisable"
              v-decorator="[
                'parentId',
                { initialValue: detail.parentId, rules: [{ required: true, message: '请选择上级菜单' }] },
              ]"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              :loadData="onLoadData"
              :tree-data="treeData"
            />
          </a-form-item>
          <template v-if="isNormal">
            <a-form-item label="代码">
              <a-input
                :disabled="true"
                placeholder="代码自动生成"
                v-decorator="['code', { initialValue: detail.code }]"
              />
            </a-form-item>
          </template>
          <template v-if="isProduct">
            <a-form-item label="代码">
              <a-input
                :disabled="isDisabled"
                placeholder="请输入代码"
                v-decorator="[
                  'code',
                  {
                    initialValue: detail.code,
                    rules: [
                      { required: true, message: '请输入代码' },
                      { max: +detail.__selectItem.newCodeLength, message: `代码超过最大长度` },
                    ],
                  },
                ]"
              />
            </a-form-item>
          </template>
          <a-form-item label="下级代码位数">
            <a-input-number
              :disabled="isDisabled"
              style="width: 100%"
              @change="codeLengthChange"
              :min="1"
              :max="10"
              :step="1"
              v-decorator="[
                'codeLength',
                {
                  initialValue: detail.codeLength || 2,
                  rules: [{ required: true, message: '请输入代码' }],
                },
              ]"
            />
          </a-form-item>
              <a-form-item label="名称前缀" v-if="getFieldValue('isColor')">
                <a-select
                  :disabled="isDisabled"
                  placeholder="选择名称前缀"
                  :allowClear="true"
                  style="width: 100%"
                  v-decorator="[
                    'ruleNamePrefix',
                    {
                      initialValue: detail.ruleNamePrefix,
                      rules: [{ required: true, message: '请选择名称前缀' }],
                    },
                  ]"
                >
                  <a-select-option v-for="item in rulePrefixList" :key="item.id" :value="item.text">{{
                    item.text
                  }}</a-select-option>
                </a-select>
              </a-form-item>

              <a-form-item label="名称">
                <a-input
                  :disabled="isDisabled"
                  placeholder="名称"
                  v-decorator="[
                    'ruleName',
                    {
                      initialValue: detail.ruleName,
                      rules: [{ required: isInBatch ? false : true, message: '请输入名称' }],
                    },
                  ]"
                />
              </a-form-item>
            </a-col>
          </a-row>
          


          

          <a-form-item label="规则说明">
            <a-textarea
              :disabled="isDisabled"
              placeholder="规则说明"
              :rows="2"
              v-decorator="[
                'remark',
                {
                  initialValue: detail.remark,
                  rules: [{ required:false , message: '请输入规则说明' }],
                },
              ]"
            />
          </a-form-item>

          <template v-if="isNormal">
            <a-form-item label="图片">
              <a-upload
                :disabled="isDisabled"
                key=""
                :action="uploadPath"
                accept=".png, .jpg,.jpeg,.gif"
                list-type="picture-card"
                :file-list="fileList"
                @preview="handlePreview"
                @change="handleChange"
              >
                <div v-if="fileList.length < 1">
                  <a-icon type="plus" />
                  <div class="ant-upload-text">上传</div>
                </div>
              </a-upload>
              <a-modal :visible="previewVisible" :footer="null" @cancel="previewVisible = false">
                <img style="width: 100%" :src="previewImage" />
              </a-modal>
            </a-form-item>

            <div style="display:flex;" v-if="$auth('routineMaterialRule:canAdd')">
              <div style="width:140px;"><i v-if="hasParentCanAddAuth" class="wdf-required"></i>录入人</div>
              <div style="flex:1">
                <a-form-item >
                  <a-select 
                    :disabled="isDisabled || hasParentCanAddAuth"
                    style="width: 100%" 
                    allowClear
                    @change="handleDepartmentChange"
                    placeholder="请选择部门"
                    v-decorator="[
                      'departmentId',
                      {
                        initialValue: detail.departmentId,
                        rules: [{ required: hasParentCanAddAuth, message: '请选择部门' }],
                      },
                    ]"
                  >
                    <a-select-option v-for="dep in depList" :key="dep.value">
                      {{ dep.label }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item >
                  <a-select 
                    :disabled="isDisabled"
                    style="width: 100%;"
                    allowClear
                    mode="multiple"
                    placeholder="请选择岗位"
                    @change="handlePostChange"
                    v-decorator="[
                      'stationIds',
                      {
                        initialValue: detail.stationIds,
                        rules: [{ required: hasParentCanAddAuth, message: '请选择岗位' }],
                      },
                    ]"
                  >
                    <a-select-option v-for="post in postList" :key="post.value">
                      {{ post.label }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </div>
            </div>
            <a-form-item label="是否品牌/型号">
              <a-switch
                :disabled="isDisabled"
                checked-children="是"
                un-checked-children="否"
                v-decorator="[
                  'isBrand',
                  {
                    initialValue: +detail.isBrand === 1,
                    valuePropName: 'checked',
                    rules: [{ required: true, message: '请选择是否品牌/型号' }],
                  },
                ]"
              />
            </a-form-item>
            <a-form-item label="是否线缆">
              <a-switch
                :disabled="isDisabled"
                checked-children="是"
                un-checked-children="否"
                v-decorator="[
                  'isCable',
                  {
                    initialValue: +detail.isCable === 1,
                    valuePropName: 'checked',
                    rules: [{ required: true, message: '请选择是否线缆' }],
                  },
                ]"
              />
            </a-form-item>

            <a-form-item label="是否颜色">
              <a-switch
                :disabled="isDisabled"
                checked-children="是"
                un-checked-children="否"
                v-decorator="[
                  'isColor',
                  {
                    initialValue: +detail.isColor === 1,
                    valuePropName: 'checked',
                    rules: [{ required: true, message: '请选择是否颜色' }],
                  },
                ]"
              />
            </a-form-item>


          </template>

          <template v-if="isNormalAdd || isNormalUpdate">
            <a-form-item label="是否为规格型号">
              <a-switch
                :disabled="isDisabled"
                checked-children="是"
                un-checked-children="否"
                v-decorator="[
                  'isSpecification',
                  {
                    initialValue: +detail.isSpecification === 1,
                    valuePropName: 'checked',
                    rules: [{ required: true, message: '请选择是否为规格型号' }],
                  },
                ]"
                @change="handlerSpecificationChange"
              />
            </a-form-item>
            <a-form-item label="是否计入物料代码">
              <a-switch
                :disabled="isDisabled"
                checked-children="是"
                un-checked-children="否"
                v-decorator="[
                  'isBringCode',
                  {
                    initialValue: +detail.isBringCode === 1,
                    valuePropName: 'checked',
                    rules: [{ required: true, message: '请选择是否计入物料代码' }],
                  },
                ]"
                @change="handlerBringCodeChange"
              />
            </a-form-item>
          </template>

          <template v-if="isNormalAdd">

            <a-form-item label="是否存在循环">
              <a-switch
                :disabled="isDisabled"
                checked-children="是"
                un-checked-children="否"
                @change="inBatchChange"
                v-decorator="[
                  'inBatch',
                  {
                    initialValue: !!detail.inBatch,
                    valuePropName: 'checked',
                    rules: [{ required: true, message: '请选择是否存在循环' }],
                  },
                ]"
              />
            </a-form-item>

            <template v-if="isInBatch">
              <a-form-item label="最小值">
                <a-input-number
                  :disabled="isDisabled"
                  style="width: 100%"
                  :precision="2"
                  v-decorator="[
                    'miniNum',
                    {
                      initialValue: detail.miniNum,
                      rules: [{ required: true, message: '请输入最小值' }],
                    },
                  ]"
                />
              </a-form-item>

              <a-form-item label="等差">
                <a-select
                  :disabled="isDisabled"
                  placeholder="选择等差"
                  :allowClear="true"
                  style="width: 100%"
                  v-decorator="[
                    'differenceValue',
                    {
                      initialValue: detail.differenceValue,
                      rules: [{ required: true, message: '请选择等差' }],
                    },
                  ]"
                >
                  <a-select-option v-for="item in differenceList" :key="item.id" :value="item.text">{{
                    item.text
                  }}</a-select-option>
                </a-select>
              </a-form-item>

              <a-form-item label="单位">
                <a-select
                  :disabled="isDisabled"
                  placeholder="选择单位"
                  :allowClear="true"
                  style="width: 100%"
                  v-decorator="[
                    'unit',
                    {
                      initialValue: detail.unit,
                      rules: [{ required: true, message: '请选择单位' }],
                    },
                  ]"
                >
                  <a-select-option v-for="item in unitList" :key="item.id" :value="item.text">{{
                    item.text
                  }}</a-select-option>
                </a-select>
              </a-form-item>

              <a-form-item label="最大值">
                <a-input-number
                  :disabled="isDisabled"
                  style="width: 100%"
                  :precision="2"
                  v-decorator="[
                    'maximum',
                    {
                      initialValue: detail.maximum,
                      rules: [{ required: true, message: '请输入最大值' }],
                    },
                  ]"
                />
              </a-form-item>
            </template>
          </template>

          <a-form-item label="是否常用">
            <a-switch
              :disabled="isDisabled"
              checked-children="是"
              un-checked-children="否"
              v-decorator="[
                'useAlways',
                {
                  initialValue: +detail.useAlways === 1,
                  valuePropName: 'checked',
                  rules: [{ required: true, message: '请选择是否常用' }],
                },
              ]"
            />
          </a-form-item>

        </template>

        <template v-if="isNormalAdd && activeKey === 2">
          <a-form-item label="复制数据">
            <a-tree-select
              style="width: 100%"
              :disabled="isDisabled || treeDisable"
              v-decorator="['copySourceParentId', { rules: [{ required: true, message: '请选择复制数据节点' }] }]"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              :loadData="onLoadData"
              :tree-data="treeData"
            />
          </a-form-item>
          <a-form-item label="上级菜单(现位置)">
            <a-tree-select
              style="width: 100%"
              :disabled="isDisabled || treeDisable"
              v-decorator="['copyToParentId', { rules: [{ required: true, message: '请选择上级菜单(现位置)' }] }]"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              :loadData="onLoadData"
              :tree-data="treeData"
            />
          </a-form-item>
          <a-alert type="warning">
            <div slot="message">
              <!-- 若选择复制数据菜单存在下级，则菜单所有的【第一层下级】会被复制！ -->
              <p>注意：复制数据节点的直接子节点会被复制，子孙节点则不复制！！！</p>
              <div class="tree-copy-example-wrapper">
                <div class="tree-item">
                  <div>0</div>
                  <div>&nbsp;&nbsp;-1</div>
                  <div>&nbsp;&nbsp;&nbsp;&nbsp;-11</div>
                  <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-111</div>
                  <div>&nbsp;&nbsp;&nbsp;&nbsp;-12</div>
                  <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-121</div>
                  <div>&nbsp;&nbsp;-2</div>
                </div>
                <div class="tree-trnaslate-info">
                  <p>示例:把节点1复制到节点2</p>
                  <p>节点1的直接子节点11,12被复制了</p>
                  <p>11,12的子节点111,121没被复制</p>
                </div>
                <div class="tree-item">
                  <div>0</div>
                  <div>&nbsp;&nbsp;-1</div>
                  <div>&nbsp;&nbsp;&nbsp;&nbsp;-11</div>
                  <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-111</div>
                  <div>&nbsp;&nbsp;&nbsp;&nbsp;-12</div>
                  <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-121</div>
                  <div>&nbsp;&nbsp;-2</div>
                  <div>&nbsp;&nbsp;&nbsp;&nbsp;-11</div>
                  <div>&nbsp;&nbsp;&nbsp;&nbsp;-12</div>
                </div>
              </div>
            </div>
          </a-alert>
        </template>
      </a-form>
      <a-alert message="说明" type="warning" show-icon style="margin-top: 10px">
        <div slot="description">
          <template v-if="isNormal">
          <div class="alert-wrapper">
            <div class="hd">是否为规格型号</div>
            <div class="bd">
              <div>－判定输入的名称是否为产品的规格型号</div>
              <div>－是：不占用代码位数，不显示代码。　列：材质牌号</div>
              <div>－否：占用代码位数，显示代码。　　　列：镀锌钢卷（01）</div>
            </div>
          </div>
          <div class="alert-wrapper">
            <div class="hd">是否存在循环</div>
            <div class="bd">
              <div>－判定输入的数据是否存在有规律的循环，如果存在规律则可直接批量生成数据。</div>
            </div>
          </div>
          </template>
          <div class="alert-wrapper">
            <div class="hd">是否常用</div>
            <div class="bd">
              <div>－判定产品名称是否为常用数据，使用频率较高的数据。</div>
              <div>－是：常用数据加粗显示，位于数据前方。</div>
            </div>
          </div>
        </div>
      </a-alert>
    </a-spin>
  </a-modal>
</template>
<script>
import {
  routineMaterialRuleAdd,
  routineMaterialRuleUpdate,
  productMaterialRuleAdd,
  productMaterialRuleUpdate,
  routineMaterialRuleCopy,
  routineMaterialRulePageTwoTierTreeList,
  productMaterialRulePageTwoTierTreeList,
} from '@/api/routineMaterial'
import {
  departmentList, //所有部门
  getStationList //获取所有岗位
} from '@/api/systemSetting'
import { getDictionary } from '@/api/common'
import { getUploadPath2 } from '@/api/common'
import CommonDictionarySelect from '@/components/CustomerList/CommonDictionarySelect'
import DepartmentPostCascade from '@/components/CustomerList/DepartmentPostCascade'
const __API__ = {
  normal: {
    add: routineMaterialRuleAdd,
    edit: routineMaterialRuleUpdate,
  },
  product: {
    add: productMaterialRuleAdd,
    edit: productMaterialRuleUpdate,
  },
}

const uuid = () => Math.random().toString(16).slice(-6) + Math.random().toString(16).slice(-6)
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}

export default {
  name: 'RoutineAddForm',
  components:{
    CommonDictionarySelect,
    DepartmentPostCascade
  },
  data() {
    return {
      type: 'add',
      visible: false,
      spinning: false,
      treeData: [],
      value: [],
      form: this.$form.createForm(this, { name: 'material-management-RoutineAddForm' }),
      detail: {},
      from: 'normal', // normal常规 product成品
      differenceList: [],
      unitList: [],
      isInBatch: false,
      activeKey: 1,

      previewVisible: false, // 图片预览框是否可见
      previewImage: '', //  预览图片的src值
      fileList: [],
      uploadPath: getUploadPath2(), // 上传图片的url
      rulePrefixList:[],
      ruleNamePrefix:undefined, // 物料规则名称前缀

      depList:[],
      postList:[],

      hasParentCanAddAuth:false,// 父节点 是否具有 录入人权限
    }
  },
  created() {
    this.fetchDepartment()
  },
  computed: {
    modalTitle() {
      return this.isAdd ? '新增' : this.isEdit ? '修改' : '查看'
    },
    treeDisable() {
      return this.type === 'edit'
    },
    isView() {
      return this.type === 'view'
    },
    isAdd() {
      return this.type === 'add'
    },
    isEdit() {
      return this.type === 'edit'
    },
    isNormal() {
      return this.from === 'normal'
    },
    isProduct() {
      return this.from === 'product'
    },
    isNormalAdd() {
      return this.isNormal && this.isAdd
    },
    isNormalUpdate(){
      return this.isNormal && this.isEdit
    },
    isProductAdd() {
      return this.isProduct && this.isAdd
    },
    isDisabled(){
      return this.isView
    }
  },
  methods: {
    fetchDepartment() {
      const that = this
      return departmentList().then(res => {
        that.depList = res.data.map(item => {
          return { label: item.departmentName, value: item.id, isLeaf: false }
        })
      })
    },
    handleDepartmentChange(departmentId){
      this.postList = []
      this.form.setFieldsValue({ stationIds: undefined })
      departmentId && this.fetchPost(departmentId)
    },
    fetchPost(departmentId) {
      const that = this
      if (!departmentId) {
        return
      }
      return getStationList({ id: departmentId }).then(res => {
        that.postList = res.data.map(item => {
          return { label: item.stationName, value: item.id, isLeaf: true }
        })
      })
    },
    handlePostChange(postArrList){
      console.log(postArrList)
    },
    handleChange({ fileList }) {
      this.fileList = fileList
    },
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj)
      }
      this.previewImage = file.url || file.preview
      this.previewVisible = true
    },
    async query(type, record) {
      const that = this
      that.type = type
      that.detail = {}
      that.isInBatch = false
      that.activeKey = 1
      that.fileList = []
      that.visible = true

      let { 
        __selectItem, 
        __treeData, 
        __from , 
        picUrl, 
        isColor, 
        ruleName,
        departmentId:_departmentId,
        stationIds:_stationIds
      } = record
      
      let {departmentId :__departmentId,stationIds :__stationIds} = __selectItem

      that.hasParentCanAddAuth = !!(__departmentId && __stationIds)

      let departmentId = _departmentId || __departmentId || undefined
      let stationIds = String(_stationIds || __stationIds || '')
      stationIds = stationIds.length === 0 ? [] : stationIds.split(',').map(v => +v)

      if(picUrl){
        that.fileList = [
          {
            uid: uuid(),
            name: picUrl,
            status: 'done',
            url: picUrl
          }
        ]
      }
      

      that.from = __from
      that.treeData = __treeData
      that._api = __API__[__from][type]

      try{
        that.spinning = true
        if (that.isNormal) {
          await Promise.all([
            getDictionary({ text: '物料等差' }).then((res) => (that.differenceList = res.data)),
            getDictionary({ text: '物料单位' }).then((res) => (that.unitList = res.data)),
            getDictionary({ text: '物料规则名称前缀' }).then((res) => (that.rulePrefixList = res.data)),
            that.fetchPost(departmentId)
          ])
        }
        that.spinning = false
      }catch(err){
        that.spinning = false
      }

      let __ruleName = ruleName
      if(isColor === 1){ // 名字存在前缀
        that.ruleNamePrefix = ruleName.split('_')[0]
        __ruleName =  ruleName.replace(`${that.ruleNamePrefix}_`,'')
      }else {
        that.ruleNamePrefix = undefined
      }

      that.detail = {
        isBringCode:1,
         ...record,
         ruleNamePrefix:that.ruleNamePrefix,
         ruleName:__ruleName,
         departmentId:departmentId,
         stationIds:stationIds
      }
      
      that.$nextTick(() => {
        that.form.setFieldsValue({ parentId: __selectItem.key })
      })
    },
    handleSubmit() {
      const that = this
      if(that.isView){
        that.visible = false
        return
      }
      that.form.validateFields((err, values) => {
        if (!err) {
          
          if ((that.isAdd || that.isEdit) && 'isSpecification' in values) {
            values.isSpecification = values.isSpecification === true ? 1 : 2
          }

          if ((that.isAdd || that.isEdit) && 'useAlways' in values) {
            values.useAlways = values.useAlways === true ? 1 : 0
          }

          let param = { ...values }

          let _dep = that.depList.find(dep => +dep.value === +param.departmentId)
          if(_dep){
            param.departmentName = _dep.label
          }
          
          let _post_arr = [];
          ;(param.stationIds || []).map(postId => {
            let _post = that.postList.find(post => +post.value === +postId)
            if(_post){
              _post_arr.push({..._post})
            }
          })

          param.stationIds = _post_arr.map(post => post.value).join(',')
          param.stationNames = _post_arr.map(post => post.label).join(',')

          if ('inBatch' in param) {
            param.inBatch = param.inBatch ? 1 : 2
          }
          if ('isBringCode' in param) {
            param.isBringCode = param.isBringCode ? 1 : 2
          }

          if ('isCable' in param) {
            param.isCable = param.isCable ? 1 : 0
          }

          if ('isColor' in param) {
            param.isColor = param.isColor ? 1 : 0
          }

          if ('isBrand' in param) {
            param.isBrand = param.isBrand ? 1 : 0
          }

          if(that.fileList.length > 0){
            param.picUrl = that.fileList[0].url || that.fileList[0].response.data
          }else{
            param.picUrl = ''
          }

          if(param.ruleNamePrefix){
            param.ruleName = `${param.ruleNamePrefix}_${param.ruleName}`
          }

          if (that.isEdit) {
            param.newCode = param.code
            param.newCodeLength = param.codeLength
            param.newRuleName = param.ruleName

            // delete param.code
            // delete param.codeLength
            // delete param.ruleName
          }
          let isCopyAction = that.isNormalAdd && that.activeKey === 2
          let emitParam = {
            key: isCopyAction ? param.copyToParentId : param.parentId,
          }
          if (isCopyAction) {
            // param.id = param.copySourceParentId
            // param.targetId = param.copyToParentId
            // delete param.copySourceParentId
            // delete param.copyToParentId
            param = `id=${param.copySourceParentId}&targetId=${param.copyToParentId}`
          }
          
          let _api = isCopyAction ? routineMaterialRuleCopy : that._api
          console.log(param)
          // return
          that.spinning = true
          _api(param)
            .then((res) => {
              that.spinning = false
              that.form.resetFields() // 清空表
              that.visible = false
              that.$message.info(res.msg)
              that.$emit('finish', emitParam)
            })
            .catch((err) => (that.spinning = false))
        }
      })
    },
    handleCancel() {
      this.value = []
      this.visible = false
    },
    codeLengthChange(v) {
      const _v = +v
      if (!isNaN(_v) && (v < 0 || v > 10)) {
        this.$message.info('代码位数区间范围为1-10，不可超过/低于此区间范围值')
      }
    },
    formatData(arr) {
      let format = (data) => {
        let _data = [...data]
        _data = _data.map((item) => {
          return {
            key: item.id,
            value: item.id,
            title: item.title,
            parentId: item.parentId,
            routeName: item.name,
            children: Array.isArray(item.children) && item.children.length > 0 ? format(item.children) : [],
          }
        })
        return _data
      }
      return format(arr)
    },
    changeAction(arrVal, arrTitle, extra) {
      this.value = [...arrVal]
    },
    findNodeByKey(node, key) {
      //查找指定key的节点
      let res = null
      let fNode = (obj) => {
        if (obj.key === key) {
          return obj
        }
        if (obj && obj.children) {
          for (let i = 0, len = obj.children.length; i < len; i++) {
            res = fNode(obj.children[i])
            if (res !== null) {
              return { ...res }
            }
          }
        }
        return null
      }

      for (let i = 0, len = node.length; i < len; i++) {
        res = fNode(node[i])
        if (res !== null) {
          return { ...res }
        }
      }

      return null
    },
    inBatchChange(b) {
      this.isInBatch = b
    },
    tabChange(key) {
      const that = this
      that.activeKey = +key
      let __selectItem = that.detail.__selectItem
      if (that.activeKey === 1) {
        that.$nextTick(() => {
          that.form.setFieldsValue({ inBatch: that.isInBatch, parentId: __selectItem.key })
        })
      } else if (that.activeKey === 2) {
        that.$nextTick(() => {
          that.form.setFieldsValue({ copyToParentId: __selectItem.key })
        })
      }
    },
    onLoadData(treeNode) {
      const that = this
      return new Promise((resolve) => {
        if (treeNode.dataRef.children) {
          resolve()
          return
        }
        let api = that.isNormal ? routineMaterialRulePageTwoTierTreeList : productMaterialRulePageTwoTierTreeList
        api({ parentId: treeNode.dataRef.value })
          .then((res) => {
            treeNode.dataRef.children = res.data.map((item) => that.formatTreeData(item))
            that.treeData = [...that.treeData]
            resolve()
          })
          .catch((err) => {
            that.$message.error(`调用接口[routineMaterialRulePageTreeList]时发生错误，错误信息:${err}`)
          })
      })
    },
    //格式化接口数据 key,title,value
    formatTreeData(item) {
      let that = this
      let obj = {}
      obj.key = String(item.id)
      obj.title = `${item.newRuleName || item.ruleName}(${item.code})`
      obj.value = String(item.id)
      // obj.isLeaf = !(Array.isArray(item.subList) && item.subList.length > 0)
      obj.parentId = item.parentId
      obj.codeLength = +item.codeLength
      obj.code = item.code
      obj.scopedSlots = { title: 'title' }
      //obj.__selectable = obj.isLeaf
      if (Array.isArray(item.subList) && item.subList.length > 0) {
        obj.children = item.subList.map((v) => that.formatTreeData(v))
      }
      return obj
    },
    handlerSpecificationChange(e){
      const that = this
      let isBringCode = that.form.getFieldValue('isBringCode')
      if(e){
        that.$nextTick(() => {
          that.form.setFieldsValue({ isBringCode:false })
        })
      }
    },
    handlerBringCodeChange(e){
      const that = this
      let isSpecification = that.form.getFieldValue('isSpecification')
      if(isSpecification){
        that.$message.info('该选项和规格型号相斥')
        that.$nextTick(() => {
          that.form.setFieldsValue({ isBringCode:false })
        })
      }
    },
    getFieldValue(fieldName){
      return this.form.getFieldValue(fieldName)
    },
    handleDictionaryChange(item){
      this.ruleNamePrefix = item ? item.text : ''
    }
    
  },
}
</script>

<style scoped>
.routine-addform-wrapper >>> .ant-form-item {
  display: flex;
  margin-bottom: 0;
}
.routine-addform-wrapper >>> .ant-form-item .ant-form-item-label {
  width: 140px;
  text-align: left;
}
.routine-addform-wrapper >>> .ant-form-item .ant-form-item-control-wrapper {
  flex: 1;
}

.routine-addform-wrapper .tree-copy-example-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}
.routine-addform-wrapper .tree-copy-example-wrapper .tree-item {
  background-color: #ddd;
  width: 150px;
  padding: 20px;
  border-radius: 3px;
  font-family: Menlo, Monaco, Consolas, 'Andale Mono', 'lucida console', 'Courier New', monospace;
}
.routine-addform-wrapper .tree-copy-example-wrapper .tree-trnaslate-info {
  width: 220px;
  margin: 0 10px;
  font-weight: bold;
}

.alert-wrapper{
  display: flex;
}
.alert-wrapper .hd{
  width: 120px;
}
.alert-wrapper .bd{
  flex: 1;
}

i.wdf-required::before {
  display: inline-block;
  margin-right: 4px;
  color: #f5222d;
  font-size: 14px;
  font-family: SimSun, sans-serif;
  font-style: normal;
  line-height: 1;
  content: '*';
}
</style>

