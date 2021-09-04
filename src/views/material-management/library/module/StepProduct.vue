<template>
  <div>
    <a-form-model
      ref="ruleForm"
      :model="form"
      :rules="rules"
      class="routine-addform-wrapper-step1"
    >
      <a-form-model-item
        ref="parentId"
        label="位置/名称"
        prop="parentId"
      >
        <a-tree-select
          v-model="form.parentId"
          style="width: 100%"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          :loadData="onLoadData"
          :tree-data="treeData"
          @select="handleClick"
        />
      </a-form-model-item>

      <a-form-model-item
        ref="isIntelligent"
        label="智能/非智能"
        prop="isIntelligent"
      >
        <a-select v-model="form.isIntelligent" placeholder="请选择材质">
          <a-select-option :value="1">智能（Z）</a-select-option>
          <a-select-option :value="2">非智能（F）</a-select-option>
        </a-select>
      </a-form-model-item>

    </a-form-model>
    <p style="margin-top:20px;text-align:center;">
      <a-button
        type="primary"
        @click="onSubmit"
      >
        下一步
      </a-button>
      <a-button
        style="margin-left: 10px;"
        @click="resetForm"
      >
        取消
      </a-button>
    </p>

    <div style="position: absolute;left: -99999px;" class="wuliao-qr-code-wrapper">
      <vue-qr :text="qrText" :size="qrSize" :callback="qrChangeHandler" ></vue-qr>
    </div>
  </div>
</template>
<script>
import {
  productMaterialInfoTwoTierTreeList,
  productMaterialInfoGetCode
} from '@/api/routineMaterial'

import VueQr from 'vue-qr'
import { customUpload } from '@/api/common'
export default {
  inject: ['normalAddForm'],
  components:{
    VueQr
  },
  data() {
    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      other: '',
      form: {
        parentId: undefined,
        isIntelligent: undefined,
      },
      rules: {
        isIntelligent: [{ required: true, message: '请选择智能/非智能' }],
      },
      treeData: [],
      dataList:[],
      qrText:'',
      qrSize:200,
      wuliaoQrUrl:null
    }
  },
  created() {
    this.$nextTick(() => this.init())
  },
  methods: {
    async init(type, record) {
      const that = this
      that.form = that.normalAddForm.submitParams
      that.qrText = ''
      that.wuliaoQrUrl = null
      that.type = type
      if (that.normalAddForm && that.normalAddForm.detail) {
        let { __treeData } = that.normalAddForm.detail
        that.treeData = __treeData
        that.dataList = that.generateList(that.treeData)

        let __selectItem = that.normalAddForm.getSelectNode()
        that.form = { ...that.form, parentId: __selectItem.key }
      }
    },
    async qrChangeHandler(dataUrl,id){
      const that = this

      if(dataUrl){
        let file = await new Promise((resolve) => {
          setTimeout(function(){
            let img = document.querySelector('.wuliao-qr-code-wrapper > img')
            if(!img){
              resolve(null)
              return
            }
            let canvas = document.createElement('canvas')
            let context = canvas.getContext('2d')
            canvas.width = that.qrSize
            canvas.height = that.qrSize
            context.clearRect(0, 0, that.qrSize, that.qrSize)
            context.drawImage(img, 0, 0, that.qrSize, that.qrSize)
            let fileType = 'image/png'
            canvas.toBlob(
              (blob) => {
                resolve(new File([blob], 'wuliao_qr.png', { type: fileType }))
              },
              fileType,
              0.92
            )
          },150)
        })
        if(file !== null){
          const formData = new FormData()
          formData.append('file', file)
          let url = await customUpload(formData).then((res) => res.data)
          that.wuliaoQrUrl = url
          return url
        }else{
          that.wuliaoQrUrl = null
          return null
        }
      }else{
        that.wuliaoQrUrl = null
        return null
      }
    },
    wuliaoQrUrlReady(){
      const that = this
      let timer = null
      return new Promise((resolve) =>{
        timer = setInterval(function(){
          if(that.wuliaoQrUrl !== null){
            clearInterval(timer)
            resolve(that.wuliaoQrUrl)
          }
        },100)
      })
    },
    parentCodes(_parentId,_dataList,joinSymbol=".") {
      let arr = []
      let parentId = _parentId
      // if(+parentId === 0){
      //   return '0'
      // }
      while (+parentId) {
        let target = _dataList.find((item) => +item.key === +parentId)
        arr.push({ ...target })
        parentId = target.parentId
        // if(+parentId === 0){
        //   target = _dataList.find((item) => +item.key === +parentId)
        //   arr.push({ ...target })
        // }
      }
      return arr
        .reverse()
        .map((item) => item.code)
        .join(joinSymbol)
    },
    getNode(key){
      return this.dataList.find(n => n.key === key)
    },
    generateList(data) {
      let arr = []
      for (let i = 0; i < data.length; i++) {
        const node = data[i]
        arr.push({ ...node })
        if (node.children) {
          arr.push(...this.generateList(node.children))
        }
      }
      return arr
    },
    onSubmit() {
      const that = this
      that.$refs.ruleForm.validate(async valid => {
        if (valid) {
          let ruleId = that.form.parentId
          if(+ruleId === 0){
            that.$message.info('禁止在根节点增加成品物料')
            return
          }
          let orderCode = await productMaterialInfoGetCode({ruleId}).then(res => res.data)
          if(!orderCode){
            that.$message.info('获取顺序的物料代码号失败')
            return
          }
          let materialCode = that.makeMaterialCode(orderCode)
          that.qrText = materialCode
          await that.wuliaoQrUrlReady()
          let materialQrCode = that.wuliaoQrUrl
          let materialName = that.getNode(ruleId).title
          console.log(materialCode)

          let params = {
            ...that.form,
            materialCode,
            materialQrCode,
            ruleId,
            materialName
          }

          that.$emit('change', { __action__: 'nextStep', values: params })
        } else {
          return false
        }
      })
    },
    makeMaterialCode(orderCode){
      const that = this
      let {parentId,isIntelligent} = this.form
      let prefixCode = this.parentCodes(parentId,that.dataList,"")
      return `${prefixCode}${orderCode}${+isIntelligent === 1 ? 'Z' : 'F'}`
    },
    resetForm() {
      this.$refs.ruleForm.resetFields()
      this.$emit('change', { __action__: 'close', values: null })
    },
    handleClick(selectedKeys, e) {
      let node = {...e.dataRef}
      this.normalAddForm.selectNode = node
    },
    onLoadData(treeNode) {
      const that = this
      return new Promise(resolve => {
        if (treeNode.dataRef.children) {
          resolve()
          return
        }
        productMaterialInfoTwoTierTreeList({ parentId: treeNode.dataRef.value })
          .then(res => {
            if(res && res.code === 200 && Array.isArray(res.data)){
              treeNode.dataRef.children = res.data.map(item => that.formatTreeData(item))
              that.treeData = [...that.treeData]
              that.dataList = that.generateList(that.treeData)
            }else{
              treeNode.dataRef.isLeaf = true
              treeNode.dataRef.children = []
              that.treeData = [...that.treeData]
              that.dataList = that.generateList(that.treeData)
              that.$message.info(res.msg)
            }
            resolve()
          })
          .catch(err => {
            that.$message.error(`调用接口[routineMaterialInfoTwoTierTreeList]时发生错误，错误信息:${err}`)
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
        obj.children = item.subList.map(v => that.formatTreeData(v))
      }
      return obj
    }
  }
}
</script>

<style scoped>
.routine-addform-wrapper-step1 >>> .ant-form-item {
  display: flex;
}
.routine-addform-wrapper-step1 >>> .ant-form-item .ant-form-item-label {
  width: 140px;
  text-align: left;
}
.routine-addform-wrapper-step1 >>> .ant-form-item .ant-form-item-control-wrapper {
  flex: 1;
}
</style>
