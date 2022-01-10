<template>
  <div>
    <a-spin :spinning="spinning" :tip="tip">
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
        <a-row>
          <a-col :span="18">
            <div style="display:flex;">
              <a-input
                style="line-height: 40px;flex:1;"
                placeholder="规则名称模糊查询"
                v-model="searchValue"
              />
              <a-button title="查询" style="margin:0 7px;" icon="search" @click="() => searchAction(1)"></a-button>
              <a-button title="重置" icon="reload" @click="() => searchAction(2)"></a-button>
            </div>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="18">
            <a-tree-select
              ref="treeSelect"
              v-model="form.parentId"
              style="width: 100%"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              :loadData="onLoadData"
              @load="onLoadAction"
              :loadedKeys="loadedKeys"
              :tree-data="treeData"
              @select="handleClick"
              :treeExpandedKeys="expandedKeys"
              @treeExpand="onExpand"
            >
              <template slot="title" slot-scope="{ copyTitle }">
                <span v-if="copyTitle.indexOf(searchValue) > -1">
                  {{ copyTitle.substr(0, copyTitle.indexOf(searchValue)) }}
                  <span style="color: #f50">{{ searchValue }}</span>
                  {{ copyTitle.substr(copyTitle.indexOf(searchValue) + searchValue.length) }}
                </span>
                <span v-else>{{ copyTitle }}</span>
              </template>
            </a-tree-select>
          </a-col>
        </a-row>
      </a-form-model-item>

      <a-form-model-item
        v-for="(item,index) in form.specificationsList"
        :key="item.id"
        :label="item.newRuleName || item.ruleName"
        :prop="'specificationsList.' + index + '.selectedID'"
        :rules="{
          required: true,
          message: `请选择${item.newRuleName || item.ruleName}`,
        }"
      >
        
        
        <a-row>
          <a-col :span="18">
            <a-input
              v-model="item.selectedLabel"
              style="width: 100%"
              read-only="read-only"
              @click="doAction('specificationSearch',{...item})"
            />

          </a-col>
          <a-col :span="6">
            <div style="margin-left:10px;">
              <img v-if="item.selectedPicUrl" :src="item.selectedPicUrl" alt="物料图片" title="查看大图" @click="() => handleImgView(item.selectedPicUrl)" style="width:64px;height:auto;overflow:hidden;cursor: pointer;">
            </div>
            
          </a-col>
        </a-row>

        <!-- <a-select
          show-search
          option-filter-prop="children"
          v-model="item.selectedID"
          placeholder="请选择"
          :allowClear="true"
          :filter-option="filterOption"
          @search="(w) => searchHandler(w,item)"
          @click="doAction('specificationSearch',{...item})"
        >
          <a-select-option v-for="sub in item.searchList" :key="sub.id" :value="sub.id">
            {{`${(sub.newRuleName || sub.ruleName)}(${sub.code})`}}
          </a-select-option>
        </a-select> -->
      </a-form-model-item>

    </a-form-model>
    <p style="margin-top:20px;text-align:center;">
      <a-button
        type="primary"
        @click="onSubmit"
        :disabled="disabledStepButton"
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
    </a-spin>
    <div style="position: absolute;left: -99999px;" class="wuliao-qr-code-wrapper">
      <vue-qr :text="qrText" :size="qrSize" :callback="qrChangeHandler" ></vue-qr>
    </div>

    <SpecificationSearchForm ref="specificationSearchForm" @selected="specificationSelectedHandler" />
    <ImgView ref="imgView" />
  </div>
</template>
<script>
import {
  routineMaterialRulePageTwoTierTreeList,
  routineMaterialInfoTwoTierTreeList,
  routineMaterialInfoCheckCode,
  routineMaterialInfoCheckName,
  routineMaterialRulePageConditionTreeList,
  getNewstCableCode,
  checkSpecificationMaterial,
  routineMaterialRuleSpecificationsPagerTreeList
} from '@/api/routineMaterial'

import moment from 'moment'
import VueQr from 'vue-qr'
import { customUpload } from '@/api/common'
import SpecificationSearchForm from './SpecificationSearchForm'
import ImgView from '@/components/CustomerList/ImgView'
const getParentKey = (key, tree) => {
  let parentKey
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i]
    if (node.children) {
      if (node.children.some((item) => item.key === key)) {
        parentKey = node.key
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children)
      }
    }
  }
  return parentKey
}

export default {
  inject: ['normalAddForm'],
  components:{
    VueQr,
    SpecificationSearchForm,
    ImgView
  },
  data() {
    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      other: '',
      form: {
        parentId: undefined,
        specificationsList:[],//动态加载节点下的菜单
      },
      rules: {
        parentId: [{ required: true, message: '请选择位置/名称' }],
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

      spinning:false,
      tip:'数据处理中...',
      // nextButtonDisable:true
      expandedKeys:['0'],
      loadedKeys:[],
      searchValue:undefined
    }
  },
  computed:{
    disabledStepButton(){
      const that = this
      let {parentId,specificationsList} = that.form
      let case1 = String(parentId) === '0'
      let case2 = specificationsList && specificationsList.length === 0
      return case1 || case2
    }
  },
  created() {
    this.materialCodeMapCache = {}
    this.$nextTick(() => this.init())
  },
  methods: {
    moment,
    init(type, record) {
      const that = this
      that.__hasFillDataFlag = false
      that.nextButtonDisable = false
      that.form = that.normalAddForm.submitParams
      that.qrText = ''
      that.wuliaoQrUrl = null
      that.type = type
      if (that.normalAddForm && that.normalAddForm.detail) {
        let { __treeData } = that.normalAddForm.detail
        that.treeData = that.$_.cloneDeep(__treeData)
        that.dataList = that.generateList(that.treeData)
        // await that.fetchTree()
        if(that.normalAddForm.stepOneCacheData.cached){
          that.form = that.$_.cloneDeep(that.normalAddForm.stepOneCacheData.form)
        }else{
          let __selectItem = that.normalAddForm.getSelectNode()
          that.form = { ...that.form, parentId: __selectItem.key }
          // that.initSpecifications({...__selectItem})

          that.handleClick([],{dataRef:__selectItem})
        }
      }
      try{
        console.log(that.$refs.treeSelect)
      }catch(e){}
    },
    async qrChangeHandler(dataUrl,id){
      const that = this
      console.log(`qrChangeHandler called`,arguments)
      that.wuliaoQrUrl = null
      that.tip = '生成物料二维码...'
      that.spinning = true
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
                resolve(blob ? new File([blob], 'wuliao_qr.png', { type: fileType }) : null)
              },
              fileType,
              0.92
            )
          },150)
        })
        if(file !== null){
          const formData = new FormData()
          formData.append('file', file)
          let url = await customUpload(formData).then((res) => res.data).catch(err => {
            that.$message.error(err.message)
            return null
          })
          that.spinning = false
          that.wuliaoQrUrl = url
          return url
        }else{
          that.wuliaoQrUrl = null
          that.spinning = false
          return null
        }
      }else{
        that.spinning = false
        that.wuliaoQrUrl = null
        return null
      }
    },
    wuliaoQrUrlReady(){
      const that = this
      let timer = null
      let t1 = Date.now()
      let max = 1000 * 10
      return new Promise((resolve) =>{
        timer = setInterval(function(){
          if(typeof that.wuliaoQrUrl === 'string' && that.wuliaoQrUrl.length > 0){
            clearInterval(timer)
            resolve(that.wuliaoQrUrl)
          }
          let t2 = Date.now()
          if(t2 - t1 >= max){
            clearInterval(timer)
            resolve(null)
          }
        },250)
      })
    },
    parentCodes(_parentId,_dataList,joinSymbol=".") {
      const that = this
      let arr = []
      let parentId = _parentId
      // if(+parentId === 0){
      //   return '0'
      // }
      while (+parentId) {
        let target = _dataList.find((item) => +item.key === +parentId)
        /**
         * @ApiModelProperty(value = "是否计入物料代码：1是，2否，默认值1")
         * private Integer isBringCode;
         */
        if(+target.isBringCode === 1){
          arr.push({ ...target })
        }
        parentId = target.parentId
        // if(+parentId === 0){
        //   target = _dataList.find((item) => +item.key === +parentId)
        //   arr.push({ ...target })
        // }
      }
      // debugger
      // for(let i=0,len = arr.length;i<len;i++){
      //   let node = arr[i]
      //   if(Object.keys(that.materialCodeMapCache).includes(node.key)){
      //     node.code = that.materialCodeMapCache[node.key]
      //   }
      // }

      return arr
        .reverse()
        .map((item) => item.code)
        .join(joinSymbol)
    },
    formatMaterialCode(codeStr,joinSymbol=""){
      if(typeof codeStr !== 'string'){
        console.warn(`${codeStr} is not string type..`)
        return ''
      }
      let trimLeft = /^[0]*/g,trimRight = /[0]*$/g;
      return codeStr.split('.').map(s => s.replace(trimLeft,'')).join(joinSymbol)
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
    checkSpecificationMaterial(){
      const that = this
      const {parentId,specificationsList} = that.form
      const specificationIds = specificationsList.map(item => item.selectedID).join(',')
      
      return checkSpecificationMaterial({
        ruleId:parentId,
        specificationIds,
        materialId:that.normalAddForm.detail.id
      }).then(res => {
        return res.data
      }).catch(err => {
        that.$message.error(err.message)
        return false
      })
    },
    onSubmit() {
      const that = this
      that.$refs.ruleForm.validate(async valid => {
        if (valid) {
          let ruleId = that.form.parentId
          
          let ruleItem = that.getNode(ruleId)
          let ruleCode = undefined
          let materialName = ruleItem.sourceTitle
          let materialCode
          if(+ruleItem.isCable === 1){ // 线缆类型使用接口生成的物料代码
            materialCode = that.materialCodeMapCache[ruleId]
            ruleCode = ruleItem.code
          }else{ // 自上而下生成 物料代码
            //成品物料库 物料代码不显示点
            materialCode = await that.makeMaterialCode(that.normalAddForm.isProduct ? "" : ".")
            // 去除物料代码的0
            materialCode = that.formatMaterialCode(materialCode,".")
          }

          console.log(materialCode)
          that.tip = '检测物料代码是否重复...'
          that.spinning = true
          const isMaterialCodeDuplicate = await routineMaterialInfoCheckCode({
            materialCode,
            materialId:that.normalAddForm.detail.id
          }).then(res => res.data).catch(err => false)
          that.spinning = false
          if(isMaterialCodeDuplicate){
            that.$message.info('物料代码重复，禁止操作')
            return
          }
          
          that.tip = '检测规格型号是否重复...'
          that.spinning = true
          const isSpecificationDuplicate = await that.checkSpecificationMaterial()
          that.spinning = false
          if(isSpecificationDuplicate){
            that.$message.info('规格型号重复，禁止操作')
            return
          }

          // let isMaterialNameDuplicate = await routineMaterialInfoCheckName({materialName,ruleId}).then(res => res.data).catch(err => false)
          // if(isMaterialNameDuplicate){
          //   that.$message.info('物料名称重复，禁止操作')
          //   return
          // }

          that.qrText = materialCode
          await that.wuliaoQrUrlReady()
          let materialQrCode = that.wuliaoQrUrl
          if(!materialQrCode){
            that.$message.info('物料二维码生成失败，请联系管理员。')
            return
          }

          // let {texture,thickness,width,length} = that.form
          // let textureText = that.textureList.find(item => item.code === texture).fullName
          // let thicknessText = that.thicknessList.find(item => item.code === thickness).fullName
          // let widthText = that.widthList.find(item => item.code === width).fullName
          // let lengthText = that.lengthList.find(item => item.code === length).fullName

          let params = {
            ...that.form,
            materialCode,
            materialQrCode,
            ruleId,
            materialName,
            // texture:textureText,
            // thickness:thicknessText,
            // width:widthText,
            // length:lengthText
            specification:that.getSpecification(),
            specificationIds:that.form.specificationsList.map(item => item.selectedID).join(','),
            isCable:ruleItem.isCable,
            ruleCode
          }

          that.normalAddForm.stepOneCacheData = {
            cached:true,
            form:that.$_.cloneDeep(that.form)
          }

          that.$emit('change', { __action__: 'nextStep', values: params })
        } else {
          return false
        }
      })
    },
    makeMaterialCode(joinSymbol="."){
      const that = this
      let {parentId,texture,thickness,width,length} = this.form
      let prefixCode = this.parentCodes(parentId,that.dataList,joinSymbol)

      let arr = []
      that.form.specificationsList.map(item => {
        let target = item.subList.find(s => +s.id === +item.selectedID)
        /**
         * @ApiModelProperty(value = "是否计入物料代码：1是，2否，默认值1")
         * private Integer isBringCode;
         */
        if(+target.isBringCode === 1){
          arr.push(target.code)
        }
      })

      //没有规格型号的情况 年月日时分秒4位毫秒数
      let spec = arr.length > 0
        ? arr.join(joinSymbol)
        : ''

      return `${prefixCode}${spec ? joinSymbol + spec : ''}`
    },
    /**
     * 获取格式化规格型号
     */
    getSpecification(){
      const that = this
      let arr = []
      that.form.specificationsList.map(item => {
        let target = item.subList.find(s => +s.id === +item.selectedID)
        arr.push(`${item.newRuleName || item.ruleName}:${(target.newRuleName || target.ruleName)}(${target.code})  `)
      })
      return arr.length > 0 ? arr.join(",") : '无'
    },
    resetForm() {
      this.$refs.ruleForm.resetFields()
      this.$emit('change', { __action__: 'close', values: null })
    },
    async handleClick(selectedKeys, e) {
      const that = this
      let node = {...e.dataRef}
      if(+node.isCable === 1){
        let code = await getNewstCableCode({code:node.code}).then(res => {
          return res.data
        })
        that.materialCodeMapCache[node.key] = code
      }else{
        that.materialCodeMapCache[node.key] = node.code
      }
      that.normalAddForm.selectNode = node
      that.form = {
        ...that.form,
        texture: undefined,
        thickness: undefined,
        width: undefined,
        length: undefined,
      },
      await that.initSpecifications(node)
    },
    initSpecifications(node){
      const that = this
      that.spinning = true
      return routineMaterialRulePageTwoTierTreeList({ parentId: node.value ,type:3}).then(res => {
        that.spinning = false
        // console.log(res)
        if(!res || res.code !== 200){
          that.$message.info(`获取节点【名称：${node.title}-编号：${node.value}】的规格数据失败！`)
          return
        }
        //加载为规格型号的数据
        let specificationsList = res.data.filter(item => {
          // 规格型号
          let case1 = +item.isSpecification === 1
          // 已审核状态
          let case2 = +item.auditStatus === 3
          return case1 && case2
        })
        specificationsList = specificationsList.map(item => {
          item.searchList = item.subList.slice(0,50)
          return item
        })
        that.form = {...that.form,specificationsList}
      }).catch(err => {
        that.spinning = false
        that.$message.info(err)
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
      // obj.title = `${item.newRuleName || item.ruleName}(${item.code})`
      obj.copyTitle = `${item.newRuleName || item.ruleName}(${item.code})`
      obj.sourceTitle = item.newRuleName || item.ruleName
      obj.value = String(item.id)
      // obj.isLeaf = !(Array.isArray(item.subList) && item.subList.length > 0)
      obj.parentId = item.parentId
      obj.codeLength = +item.codeLength
      obj.code = item.code
      /**
       * @ApiModelProperty(value = "是否计入物料代码：1是，2否，默认值1")
       * private Integer isBringCode;
       */
      obj.isBringCode = item.isBringCode || 1
      obj.isColor = item.isColor
      obj.isCable = item.isCable
      //坑 上面如果设置了title ，这里插槽 也是title 的 会忽略插槽， 这里吧上面的title注释了
      obj.scopedSlots = { title: 'title' }
      //obj.__selectable = obj.isLeaf
      if (Array.isArray(item.subList) && item.subList.length > 0) {
        obj.children = item.subList.map(v => that.formatTreeData(v))
      }
      return obj
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    },
    //a-select 组件加载数据多时严重影响性能，此处优化搜索显示
    searchHandler(w,item){
      const that = this
      let specificationsList = that.form.specificationsList
      let target = specificationsList.find(_item => _item.id === item.id)
      if(target){
        let list = target.subList.filter(n => {
          let ruleName = n.newRuleName || n.ruleName
          let label = `${ruleName}(${n.code})`
          return label.includes(w)
        })

        list = list.slice(0,400)

        target.searchList = [...list]
        that.form = {...that.form,specificationsList}
      }
    },

    searchAction(type) {
      const that = this
      const value = that.searchValue ? that.searchValue.trim() : ''
      if(type === 1){
        if(value.length === 0){
          return
        }else{
          that.fetchTreeWithName(value)
        }
      }else{
        that.searchValue = ''
        that.fetchTree()
      }
      that.form = {...that.form,parentId:undefined,specificationsList:[]}

    },
    fetchTree() {
      const that = this
      that.loadedKeys = []
      that.spinning = true
      routineMaterialInfoTwoTierTreeList({ parentId: 0 })
        .then((res) => {
          that.spinning = false
          if(+res.code !== 200){
            that.$message.info(res.msg)
            return
          }
          const root = {
            key: '0',
            value: '0',
            title: '常规物料库',
            isLeaf: false,
            code: '0',
            codeLength: 10,
            parentId: 0,
            children: res.data.map((item) => that.formatTreeData(item)),

          }
          that.treeData = [root]
          that.dataList = that.generateList(that.treeData)
          Object.assign(that, {
              expandedKeys:['0']
            })
        })
        .catch((err) => {
          that.spinning = false
          that.$message.error(`调用接口[routineMaterialRulePageTreeList]时发生错误，错误信息:${err}`)
        })
    },
    fetchTreeWithName(w) {
      const that = this
      that.loadedKeys = []
      that.spinning = true
      routineMaterialRulePageConditionTreeList({ ruleName: w,type:2 })
        .then((res) => {
          that.spinning = false
          if(+res.code !== 200){
            that.$message.info(res.msg)
            return
          }
          const root = {
            key: '0',
            value: '0',
            title: '常规物料库',
            isLeaf: false,
            code: '0',
            codeLength: 10,
            parentId: 0,
            children: res.data.map((item) => that.formatTreeData(item)),
            scopedSlots: { title: 'title' },
          }
          that.treeData = []

          that.$nextTick(() => {
            that.treeData = [root]
            that.dataList = that.generateList(that.treeData)

            let expandedKeys = that.dataList
            .map((item) => {
              return getParentKey(item.key, that.treeData)
            }).filter(item => item !== undefined && item !== null)

            // let expandedKeys = that.dataList
            // .map((item) => {
            //   return item.key
            // })

            expandedKeys = [...new Set(expandedKeys)]
            console.log(that.dataList.map(item =>item.key))

            console.log(expandedKeys)

            Object.assign(that, {
              expandedKeys
            })
          })
        })
        .catch((err) => {
          that.spinning = false
          that.$message.error(`调用接口[routineMaterialRulePageConditionTreeList]时发生错误，错误信息:${err}`)
        })
    },
    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys
      // this.autoExpandParent = false
    },
    onLoadAction(loadedKeys){
      this.loadedKeys = loadedKeys
    },
    specificationSelectedHandler({parentItem,selectItem}){
      const that = this
      let {specificationsList} = that.form
      let target = specificationsList.find(item => item.id === parentItem.id)
      if(target){
        target.selectedID = selectItem.id
        target.selectedPicUrl = selectItem.picUrl
        target.selectedLabel = `${(selectItem.newRuleName || selectItem.ruleName)}(${selectItem.code})`
        target.subList = [selectItem]
        that.form = {
          ...that.form,
          specificationsList
        }
      }
    },
    doAction(type,record){
      const that = this
      if(type === 'specificationSearch'){
        that.$refs.specificationSearchForm.query(type,{...record})
        return
      }
    },
    handleImgView(url){
      this.$refs.imgView.show(url)
    },
    async fillDate(){
      const that = this
      if(that.__hasFillDataFlag){
        return
      }
      const {stepOneData} = that.normalAddForm.submitParams
      if(!stepOneData){
        return
      }

      const {ruleTreeListVo,specificationVolist} = stepOneData
      // 1.生成树
      const root = {
          key: '0',
          value: '0',
          title: '常规物料库',
          isLeaf: false,
          code: '0',
          codeLength: 10,
          parentId: 0,
          children: [ruleTreeListVo].map((item) => that.formatTreeData(item)),
      }
      that.treeData = [root]
      that.dataList = that.generateList(that.treeData)
      Object.assign(that, {
        expandedKeys:['0']
      })
      that.dataList = that.generateList(that.treeData)
      let __selectItem = that.dataList[that.dataList.length - 1]
      that.form = { ...that.form, parentId: __selectItem.key }
      // 2.渲染规格型号选择
      try{
        that.spinning = true
        await that.handleClick([],{dataRef:__selectItem})
        that.spinning = false
      }catch(err){
        console.error(err)
        that.spinning = false
      }
      
      // 3.回显规格型号
      try{
        that.spinning = true
        let specificationsList = that.$_.cloneDeep(that.form.specificationsList || [])
        specificationVolist.map(item => {
          let target = specificationsList.find(node => +node.id === +item.specificationId)
          target.selectedID = item.specificationValueId
          target.selectedPicUrl = item.ruleTreeListVo ? item.ruleTreeListVo.picUrl : ''
          target.selectedLabel = `${item.specificationValueData}(${item.specificationValueCode})`
          target.subList = [item.ruleTreeListVo]
        })

        that.form = {
          ...that.form,
          specificationsList
        }
        that.spinning = false
      }catch(err){
        console.error(err)
        that.spinning = false
      }

      that.__hasFillDataFlag = true
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
