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
        ref="texture"
        label="材质"
        prop="texture"
      >
        <a-select v-model="form.texture" placeholder="请选择材质">
          <a-select-option v-for="item in textureList" :key="item.id" :value="item.code">
            {{item.fullName}}
          </a-select-option>
        </a-select>
      </a-form-model-item>

      <a-form-model-item
        ref="thickness"
        label="厚度"
        prop="thickness"
      >
        <a-select v-model="form.thickness" placeholder="请选择厚度">
          <a-select-option v-for="item in thicknessList" :key="item.id" :value="item.code">
            {{item.fullName}}
          </a-select-option>
        </a-select>
      </a-form-model-item>

      <a-form-model-item
        ref="width"
        label="宽度"
        prop="width"
      >
        <a-select v-model="form.width" placeholder="请选择宽度">
          <a-select-option v-for="item in widthList" :key="item.id" :value="item.code">
            {{item.fullName}}
          </a-select-option>
        </a-select>
      </a-form-model-item>

      <a-form-model-item
        ref="length"
        label="长度"
        prop="length"
      >
        <a-select v-model="form.length" placeholder="请选择长度">
          <a-select-option v-for="item in lengthList" :key="item.id" :value="item.code">
            {{item.fullName}}
          </a-select-option>
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
  routineMaterialRulePageTwoTierTreeList,
  routineMaterialInfoTwoTierTreeList
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
        texture: undefined,
        thickness: undefined,
        width: undefined,
        length: undefined,
      },
      rules: {
        parentId: [{ required: true, message: '请选择位置/名称' }],
        texture: [{ required: true, message: '请输入材质' }],
        thickness: [{ required: true, message: '请输入厚度' }],
        width: [{ required: true, message: '请输入宽度' }],
        length: [{ required: true, message: '请输入长度' }]
      },
      treeData: [],
      dataList:[],
      qrText:'',
      qrSize:200,
      wuliaoQrUrl:null,
      textureList:[],
      thicknessList:[],
      widthList:[],
      lengthList:[],
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
        that.initSpecifications({...__selectItem})
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
    parentCodes(_parentId,_dataList) {
      let arr = []
      let parentId = _parentId
      if(+parentId === 0){
        return '0'
      }
      while (+parentId) {
        let target = _dataList.find((item) => +item.key === +parentId)
        arr.push({ ...target })
        parentId = target.parentId
        if(+parentId === 0){
          target = _dataList.find((item) => +item.key === +parentId)
          arr.push({ ...target })
        }
      }
      return arr
        .reverse()
        .map((item) => item.code)
        .join('.')
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
          let materialCode = that.makeMaterialCode()
          that.qrText = materialCode
          await that.wuliaoQrUrlReady()
          let materialQrCode = that.wuliaoQrUrl
          let ruleId = that.form.parentId
          let materialName = that.getNode(ruleId).title

          let {texture,thickness,width,length} = that.form
          let textureText = that.textureList.find(item => item.code === texture).fullName
          let thicknessText = that.thicknessList.find(item => item.code === thickness).fullName
          let widthText = that.widthList.find(item => item.code === width).fullName
          let lengthText = that.lengthList.find(item => item.code === length).fullName

          let params = {
            ...that.form,
            materialCode,
            materialQrCode,
            ruleId,
            materialName,
            texture:textureText,
            thickness:thicknessText,
            width:widthText,
            length:lengthText
          }

          that.$emit('change', { __action__: 'nextStep', values: params })
        } else {
          return false
        }
      })
    },
    makeMaterialCode(){
      const that = this
      let {parentId,texture,thickness,width,length} = this.form
      let prefixCode = this.parentCodes(parentId,that.dataList)
      return `${prefixCode}.${texture}.${thickness}.${width}.${length}`
    },
    resetForm() {
      this.$refs.ruleForm.resetFields()
      this.$emit('change', { __action__: 'close', values: null })
    },
    handleClick(selectedKeys, e) {
      let node = {...e.dataRef}
      this.normalAddForm.selectNode = node
      this.initSpecifications(node)
    },
    initSpecifications(node){
      const that = this
      routineMaterialRulePageTwoTierTreeList({ parentId: node.value }).then(res => {
        console.log(res)
        if(!res || res.code !== 200){
          that.$message.info(`获取节点【名称：${node.title}-编号：${node.value}】的规格数据失败！`)
          return
        }
        /*
        {
          "code": 200,
          "msg": "操作成功",
          "data": [
            {
              "id": 8889,
              "parentId": 8888,
              "ruleName": "材质",
              "code": "001",
              "newRuleName": "材质",
              "codeLength": 3,
              "newCodeLength": 3,
              "isSpecification": 1,
              "subList": [
                {
                  "id": 8893,
                  "parentId": 8889,
                  "ruleName": "塑料",
                  "code": "001",
                  "newRuleName": "塑料",
                  "codeLength": 3,
                  "newCodeLength": 3,
                  "isSpecification": 1,
                  "subList": null
                }
              ]
            }
          }
         */
        let list = res.data
        let textureTarget = list.find(item => String(item.newRuleName).includes('材质') || String(item.ruleName).includes('材质'))
        let thicknessTarget = list.find(item => String(item.newRuleName).includes('厚度') || String(item.ruleName).includes('厚度'))
        let widthTarget = list.find(item => String(item.newRuleName).includes('宽度') || String(item.ruleName).includes('宽度'))
        let lengthTarget = list.find(item => String(item.newRuleName).includes('长度') || String(item.ruleName).includes('长度'))

        let textureList = textureTarget ? (textureTarget.subList || []) : []
        let thicknessList = thicknessTarget ? (thicknessTarget.subList || []) : []
        let widthList = widthTarget ? (widthTarget.subList || []) : []
        let lengthList = lengthTarget ? (lengthTarget.subList || []) : [];
        (
          [textureList,thicknessList,widthList,lengthList].forEach(list => {
            if(list.length > 0){
              list.forEach(item => {
                item.fullName = `${(item.newRuleName || item.ruleName)}(${item.code})`
              })
            }else{
              list.push({
                id:-1,
                code:0,
                fullName:'未配置'
              })
            }
          })
        );
        // debugger
        that.textureList = textureList
        that.thicknessList = thicknessList
        that.widthList = widthList
        that.lengthList = lengthList
      })
    },
    onLoadData(treeNode) {
      const that = this
      return new Promise(resolve => {
        if (treeNode.dataRef.children) {
          resolve()
          return
        }
        routineMaterialInfoTwoTierTreeList({ parentId: treeNode.dataRef.value })
          .then(res => {
            treeNode.dataRef.children = res.data.map(item => that.formatTreeData(item))
            that.treeData = [...that.treeData]
            that.dataList = that.generateList(that.treeData)
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
