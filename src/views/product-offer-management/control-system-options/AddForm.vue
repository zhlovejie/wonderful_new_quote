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

        <OptionsSelect ref="optStand" modelTitle="标准配置" @change="nodes => optStandItems = nodes" @optChange="keys => filterKeys = keys" />
        <OptionsSelect ref="optChoice" modelTitle="选择配置" :filterKeys="filterKeys" @change="nodes => optChoiceItems = nodes" />

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
import { priceQuotedItemConfigSubList, priceQuotedItemConfigTreeList } from '@/api/productOfferManagement'
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

      optStandItems:[], // 标配
      optChoiceItems:[],// 选配
      filterKeys:[],

      optionsList:[],
      treeData:[]
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
    }
  },
  methods: {
    async query(type, record) {
      const that = this
      that.type = type
      that.detail = {}
      that.visible = true
      that.optStandItems = []
      that.optChoiceItems = []
      that.filterKeys = []
      await Promise.all([that.fetchOptions(), that.fetchTree()])
      if(that.isView || that.isEdit){
        that.spinning = true
        await priceQuotedZktDetail({id:record.id}).then(res => {
          that.spinning = false
          let result = res.data
          let nodes = that.addNodesKey(result.childrenList)
          let optStandItems = nodes.filter(item => +item.configType === 0)
          let optChoiceItems = nodes.filter(item => +item.configType === 1)
          that.optStandItems = optStandItems
          that.optChoiceItems = optChoiceItems

          delete result.childrenList
          that.form = {...result}
        }).catch(err => {
          that.spinning = false
          that.$message.error(err)
        })
      }

      that.$nextTick(() => {
        that.$refs.optStand.query(type,that.optStandItems,{optionsList:that.optionsList,treeData:that.treeData})
        that.$refs.optChoice.query(type,that.optChoiceItems,{optionsList:that.optionsList,treeData:that.treeData})


        that.filterKeys = that.optStandItems.map(opt => opt.itemConfigId)
      })
    },
    handleSubmit() {
      const that = this
      that.$refs.ruleForm.validate(valid => {
        if (valid) {
          let priceQuotedZktConfigList = [
            ...that.addConfigType(that.optStandItems,0), //标配 0
            ...that.addConfigType(that.optChoiceItems,1) //选配 1
          ]

          priceQuotedZktListAddOrUpdate({ ...that.form ,priceQuotedZktConfigList})
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

    fetchOptions() {
      const that = this
      return priceQuotedItemConfigSubList(that.queryParam)
        .then(res => {
          that.optionsList = res.data.filter(item => item.parentConfigId === 0 && item.itemConfigType !== 9)
        })
        .catch(err => {
          that.$message.error(err)
          that.optionsList = []
        })
    },
    fetchTree() {
      const that = this
      return priceQuotedItemConfigTreeList()
        .then(res => {
          const root = {
            id: 0,
            key: 0,
            configName: '配置项',
            isLeaf: false,
            parentConfigId: null,
            childrenList: res.data.map(item => that.formatTreeData(item))
          }

          // 去除没有参数的分支
          let shaking = (node) =>{
            let f = (n) => {
              if(!('childrenList' in n)){
                n.childrenList = []
              }
              if(Array.isArray(n.childrenList) && n.childrenList.length > 0){
                n.childrenList = n.childrenList.map(node => f(node)).filter(node => {
                  return !(node.itemConfigType === 0 && node.childrenList.length === 0)
                })
              }
              return n
            }
            return f(node)
          }

          that.treeData = shaking(root)
        })
        .catch(err => {
          that.$message.error(`调用接口[priceQuotedItemConfigTreeList]时发生错误，错误信息:${err}`)
        })
    },
    formatTreeData(item) {
      const that = this
      const obj = {}
      obj.id = undefined
      obj.configName = item.configName
      obj.parentConfigId = item.parentConfigId || 0
      obj.serialNumber = item.serialNumber
      obj.itemConfigType = item.itemConfigType
      obj.itemConfigId = item.id
      obj.key = item.id

      if (obj.itemConfigType === 1) {
        obj.__checked = false
        obj.configValue = undefined
        obj.isChecked = -1
        obj.isRequired = -1
      }

      if (Array.isArray(item.quotedItemConfigTreeVOList) && item.quotedItemConfigTreeVOList.length > 0) {
        obj.childrenList = item.quotedItemConfigTreeVOList.map(v => that.formatTreeData(v))
      }
      return obj
    },
  }
}
</script>

<style scoped>

</style>

