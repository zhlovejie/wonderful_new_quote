<template>
  <a-modal
    :title="modalTitle"
    :width="1050"
    :visible="visible"
    :destroyOnClose="true"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :maskClosable="false"
    :confirmLoading="spinning"
  >
    <a-spin :spinning="spinning">
      <a-form-model
        ref="ruleForm"
        :model="form"
        :rules="rules"
        class="addform-wrapper"
      >
        <a-form-model-item
          label="中控系统名称"
          prop="configName"
        >
          <a-input v-if="!isView" v-model="form.configName" />
          <span v-else>{{form.configName}}</span>
        </a-form-model-item>

        <OptionsSelect title="标准配置" :actionType="type" v-model="standData" :filterKeys="standDataFilterKyes" />
        <OptionsSelect title="选择配置" :actionType="type" v-model="choiceData" :filterKeys="choiceDataFilterKyes" />

        <a-form-model-item
          label="备注"
          prop="remark"
        >
          <a-input
            v-if="!isView"
            v-model="form.remark"
            type="textarea"
          />
          <span v-else>{{form.remark}}</span>
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>
<script>
import { priceQuotedZktListAddOrUpdate ,priceQuotedZktDetail} from '@/api/productOfferManagement'
import OptionsSelect from './OptionsSelect'
export default {
  name: 'product-offer-management-opt-management_AddForm',
  components:{OptionsSelect},
  provide() {
    return {
      addForm: this
    }
  },
  data() {
    return {
      type: 'add',
      visible: false,
      spinning: false,
      treeData: [],
      value: [],
      form: {},
      rules: {
        configName:[
          { required: true, message: '请输入中控系统名称', trigger: 'blur' },
        ]
      },
      detail: {},
      standData:{
        keys:[],
        treeData:[]
      },
      choiceData:{
        keys:[],
        treeData:[]
      },
    }
  },
  created() {},
  computed: {
    modalTitle() {
      let type = this.type
      return type === 'add' ? '新增' : type === 'edit' ? '修改' : type === 'view' ? '查看' : '未知'
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
    isDisabled(){
      return this.isView
    },
    standDataFilterKyes(){
      return [...this.choiceData.keys]
    },
    choiceDataFilterKyes(){
      return [...this.standData.keys]
    }
  },
  methods: {
    async query(type, record) {
      const that = this
      that.type = type
      that.detail = {}
      that.visible = true

      that.standData = {
        keys:[],
        treeData:[]
      }
      that.choiceData = {
        keys:[],
        treeData:[]
      }

      if(that.isView || that.isEdit){
        that.spinning = true
        await priceQuotedZktDetail({id:record.id}).then(res => {
          that.spinning = false
          let result = res.data
          let nodes = that.checkedAndRequired2ConfigValue(result.childrenList)
          let optStandItems = nodes.filter(item => +item.configType === 0)
          let optChoiceItems = nodes.filter(item => +item.configType === 1)

          that.standData = {
            keys:optStandItems.map(node => node.itemConfigId),
            treeData:optStandItems
          }
          that.choiceData = {
            keys:optChoiceItems.map(node => node.itemConfigId),
            treeData:optChoiceItems
          }

          delete result.childrenList
          that.form = {...result}
        }).catch(err => {
          that.spinning = false
          that.$message.error(err)
        })
      }
    },
    handleSubmit() {
      const that = this
      that.$refs.ruleForm.validate(valid => {
        if (valid) {

          let standData = that.$_.cloneDeep(that.standData.treeData)
          standData = that.configValue2CheckedAndRequired(standData)
          standData = that.addConfigType(standData,0)
          let choiceData = that.$_.cloneDeep(that.choiceData.treeData)
          choiceData = that.configValue2CheckedAndRequired(choiceData)
          choiceData = that.addConfigType(choiceData,1)

          let params = {...that.form ,priceQuotedZktConfigList:[...standData,...choiceData]}

          priceQuotedZktListAddOrUpdate(params)
            .then(res => {
              that.spinning = false
              that.$message.info(res.msg)
              that.$emit('finish')
              that.handleCancel()
            })
            .catch(err => (that.spinning = false))
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleCancel() {
      const that = this
      that.$refs.ruleForm.resetFields()
      that.form = {}
      that.$nextTick(() => (that.visible = false))
    },
    addConfigType(nodes,configType=0){
      const that = this
      let f = (n) => {
        n.configType = configType
        if(Array.isArray(n.childrenList) && n.childrenList.length > 0){
          n.childrenList = n.childrenList.map(node => f(node))
        }
        return n
      }
      return nodes.map(n => f(n))
    },
    addNodesKey(nodes){
      const that = this
      let f = (n) => {
        n.key = n.itemConfigId
        if(Array.isArray(n.childrenList) && n.childrenList.length > 0){
          n.childrenList = n.childrenList.map(node => f(node))
        }
        return n
      }
      return nodes.map(n => f(n))
    },
    checkedAndRequired2ConfigValue(nodes) {
      const that = this
      const f = n => {
        if (n.isRequired === 0 && n.isChecked === 0) {
          n.configValue = 1
        } else if (n.isRequired === 0 && n.isChecked === 1) {
          n.configValue = 2
        } else if (n.isRequired === 1 && n.isChecked === 0) {
          n.configValue = 3
        } else if (n.isRequired === 1 && n.isChecked === 1) {
          n.configValue = 4
        }
        if(n.itemConfigType === 1){
          n.__checked = true
        }
        if (Array.isArray(n.childrenList) && n.childrenList.length > 0) {
          n.childrenList = n.childrenList.map(node => f(node))
        }
        return n
      }
      return nodes.map(n => f(n))
    },

    configValue2CheckedAndRequired(nodes) {
      const that = this
      const f = n => {
        if ('configValue' in n) {
          if (+n.configValue === 1) {
            n.isRequired = 0
            n.isChecked = 0
          } else if (+n.configValue === 2) {
            n.isRequired = 0
            n.isChecked = 1
          } else if (+n.configValue === 3) {
            n.isRequired = 1
            n.isChecked = 0
          } else if (+n.configValue === 4) {
            n.isRequired = 1
            n.isChecked = 1
          }
        }
        if (Array.isArray(n.childrenList) && n.childrenList.length > 0) {
          n.childrenList = n.childrenList.map(node => f(node))
        }
        return n
      }
      return nodes.map(n => f(n))
    }
  }
}
</script>

<style scoped>

</style>

