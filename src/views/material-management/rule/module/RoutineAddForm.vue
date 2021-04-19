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
            :disabled="treeDisable"
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
            style="width: 100%"
            @change="codeLengthChange"
            :min="1"
            :max="10"
            :step="1"
            v-decorator="[
              'codeLength',
              {
                initialValue: detail.codeLength,
                rules: [{ required: true, message: '请输入代码' }],
              },
            ]"
          />
        </a-form-item>
        <a-form-item label="名称">
          <a-input
            placeholder="名称"
            v-decorator="[
              'ruleName',
              { initialValue: detail.ruleName, rules: [{ required: true, message: '请输入名称' }] },
            ]"
          />
        </a-form-item>

        <template v-if="isNormalAdd">
          <a-form-item label="是否为规格型号">
            <a-switch
              checked-children="是"
              un-checked-children="否"
              v-decorator="[
                'isSpecification',
                { initialValue: +detail.isSpecification === 1,valuePropName:'checked', rules: [{ required: true, message: '请选择是否为规格型号' }] },
              ]"
            />
          </a-form-item>
          <a-form-item label="是否存在循环">
            <a-switch
              checked-children="是"
              un-checked-children="否"
              @change="inBatchChange"
              v-decorator="[
                'inBatch',
                { initialValue: !!detail.inBatch,valuePropName:'checked', rules: [{ required: true, message: '请选择是否存在循环' }] },
              ]"
            />
          </a-form-item>

          <template v-if="isInBatch">
          <a-form-item label="最小值">
            <a-input-number
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
        </template>

        <template v-if="isNormalAdd && activeKey === 2">
          <a-form-item label="复制数据">
            <a-tree-select
              style="width: 100%"
              :disabled="treeDisable"
              v-decorator="[
                'copySourceParentId',
                { rules: [{ required: true, message: '请选择复制数据节点' }] },
              ]"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              :loadData="onLoadData"
              :tree-data="treeData"
            />
          </a-form-item>
          <a-form-item label="上级菜单(现位置)">
            <a-tree-select
              style="width: 100%"
              :disabled="treeDisable"
              v-decorator="[
                'copyToParentId',
                { rules: [{ required: true, message: '请选择上级菜单(现位置)' }] },
              ]"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              :loadData="onLoadData"
              :tree-data="treeData"
            />
          </a-form-item>
          <a-alert type="warning" >
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
  productMaterialRulePageTwoTierTreeList
} from '@/api/routineMaterial'
import { getDictionary } from '@/api/common'
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

export default {
  name: 'RoutineAddForm',
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
      isInBatch:false,
      activeKey:1,

    }
  },
  created() {},
  computed: {
    modalTitle() {
      return this.type === 'add' ? '新增' : '修改'
    },
    treeDisable() {
      return this.type === 'edit'
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
    isNormalAdd(){
      return this.isNormal && this.isAdd
    },
    isProductAdd(){
      return this.isProduct && this.isAdd
    }
  },
  methods: {
    async query(type, record) {
      const that = this
      that.type = type
      that.detail = {}
      that.isInBatch = false
      that.visible = true

      let { __selectItem, __treeData, __from } = record
      that.from = __from
      that.treeData = __treeData
      that._api = __API__[__from][type]

      if(that.isNormal){
        await Promise.all([
          getDictionary({ text: '物料等差' }).then((res) => (that.differenceList = res.data)),
          getDictionary({ text: '物料单位' }).then((res) => (that.unitList = res.data))
        ])
      }

      that.detail = { ...record }
      that.$nextTick(() => {
        that.form.setFieldsValue({ parentId: __selectItem.key })
      })
    },
    handleSubmit() {
      const that = this
      that.form.validateFields((err, values) => {
        if (!err) {
          console.log(values)
          that.spinning = true

          if(that.isAdd && 'isSpecification' in values){
            values.isSpecification = values.isSpecification === true ? 1 : 2
          }
          let param = { ...values }
          if('inBatch' in param){
            param.inBatch = param.inBatch ? 1 : 2
          }
          if (that.isEdit) {
            param.newCode = param.code
            param.newCodeLength = param.codeLength
            param.newRuleName = param.ruleName

            delete param.code
            delete param.codeLength
            delete param.ruleName
          }
          let isCopyAction = that.isNormalAdd && that.activeKey === 2
          if(isCopyAction){
            // param.id = param.copySourceParentId
            // param.targetId = param.copyToParentId
            // delete param.copySourceParentId
            // delete param.copyToParentId

            param = `id=${param.copySourceParentId}&targetId=${param.copyToParentId}`
          }
          let _api = isCopyAction ? routineMaterialRuleCopy : that._api

          let emitParam = {
            key:isCopyAction ? param.copyToParentId : param.parentId
          }

          _api(param)
            .then((res) => {
              that.spinning = false
              console.log(res)
              that.form.resetFields() // 清空表
              that.visible = false
              that.$message.info(res.msg)
              that.$emit('finish',emitParam)
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
    inBatchChange(b){
      this.isInBatch = b
    },
    tabChange(key){
      const that = this
      that.activeKey = +key
      let __selectItem = that.detail.__selectItem
      if(that.activeKey === 1){
        that.$nextTick(() =>{
          that.form.setFieldsValue({inBatch:that.isInBatch,parentId: __selectItem.key})
        })
      }else if(that.activeKey === 2){
        that.$nextTick(() => {
          that.form.setFieldsValue({ copyToParentId: __selectItem.key })
        })
      }
    },
    onLoadData(treeNode) {
      const that = this
      return new Promise(resolve => {
        if (treeNode.dataRef.children) {
          resolve();
          return;
        }
        let api = that.isNormal ? routineMaterialRulePageTwoTierTreeList : productMaterialRulePageTwoTierTreeList
        api({parentId:treeNode.dataRef.value})
        .then((res) => {
          treeNode.dataRef.children = res.data.map((item) => that.formatTreeData(item))
          that.treeData = [...that.treeData]
          resolve();
        })
        .catch((err) => {
          that.$message.error(`调用接口[routineMaterialRulePageTreeList]时发生错误，错误信息:${err}`)
        })
      });
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
    }
  },
}
</script>

<style scoped>
.routine-addform-wrapper >>> .ant-form-item{
  display: flex;
}
.routine-addform-wrapper >>> .ant-form-item .ant-form-item-label{
  width: 140px;
}
.routine-addform-wrapper >>> .ant-form-item .ant-form-item-control-wrapper{
  flex: 1;
}

.routine-addform-wrapper .tree-copy-example-wrapper{
  display: flex;
  justify-content: center;
  align-items: center;

}
.routine-addform-wrapper .tree-copy-example-wrapper .tree-item{
  background-color: #ddd;
  width: 150px;
  padding: 20px;
  border-radius: 3px;
  font-family: Menlo,Monaco,Consolas,"Andale Mono","lucida console","Courier New",monospace;
}
.routine-addform-wrapper .tree-copy-example-wrapper .tree-trnaslate-info{
  width: 220px;
  margin: 0 10px;
  font-weight: bold;
}

</style>

