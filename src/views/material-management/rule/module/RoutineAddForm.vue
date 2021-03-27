<template>
  <a-modal
    :title="modalTitle"
    :width="650"
    :visible="visible"
    :destroyOnClose="true"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <a-spin :spinning="spinning">
      <a-form :form="form">
        <a-form-item hidden>
          <a-input v-decorator="['id', { initialValue: detail.id }]" />
        </a-form-item>
        <a-form-item label="上级菜单">
          <a-tree-select
            style="width: 100%"
            :disabled="treeDisable"
            show-search
            allow-clear
            v-decorator="[
              'parentId',
              { initialValue: detail.parentId, rules: [{ required: true, message: '请选择上级菜单' }] },
            ]"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
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
                    { max:+detail.__selectItem.codeLength,message:`代码超过最大长度`}
                  ]
                }
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
} from '@/api/routineMaterial'

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
      selectList: [],
      form: this.$form.createForm(this, { name: 'material-management-RoutineAddForm' }),
      detail: {},
      from: 'normal', // normal常规 product成品
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
  },
  methods: {
    query(type, record) {
      const that = this
      that.type = type
      that.detail = {}
      that.visible = true

      let { __selectItem, __treeData, __from } = record
      that.from = __from
      that.detail = { ...record }
      that.treeData = __treeData

      that._api = __API__[__from][type]

      that.$nextTick(() => {
        that.form.setFieldsValue({ parentId: __selectItem.key })
      })

      // if(type === 'add'){

      // }else if(type === 'edit'){
      //   debugger
      // }
    },
    handleSubmit() {
      const that = this
      that.form.validateFields((err, values) => {
        if (!err) {
          console.log(values)
          that.spinning = true
          let param = { ...values }
          if (that.isEdit) {
            param.newCode = param.code
            param.newCodeLength = param.codeLength
            param.newRuleName = param.ruleName

            delete param.code
            delete param.codeLength
            delete param.ruleName
            //param.code = that.detail.code
            //param.codeLength = that.detail.codeLength
            //param.ruleName = that.detail.ruleName
          }
          that
            ._api(param)
            .then((res) => {
              that.spinning = false
              console.log(res)
              that.form.resetFields() // 清空表
              that.visible = false
              that.$message.info(res.msg)
              that.$emit('finish')
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
  },
}
</script>

