<template>
  <a-card
    :bordered="false"
    class="material-rule-management-library-normal"
  >
    <a-spin :spinning="spinning" v-if="addForm.isAdd">
    <a-row>
      <a-col :span="6" :offset="18">
        <a-button type="link" :disabled="+currentNode.key === 0" @click="goto('prev')">返回上一层</a-button>
        <a-divider type="vertical" />
        <a-button type="link" :disabled="+currentNode.key === 0" @click="goto('root')">返回根目录</a-button>
      </a-col>
    </a-row>
    <div class="selected-items-wrapper">
      <span
        class="selected-items"
        :class="{'selected-items':true,'selected-items-checked':item.__checked}"
        v-for="item in currentNode.children || []"
        @click="nodeClickHandler(item)"
      >
        {{item.title}}
      </span>
    </div>
    </a-spin>
    <div v-if="addForm.isEdit">
      <div class="selected-items-wrapper">
        <span
          class="selected-items"
          :class="{'selected-items':true,'selected-items-checked':true}"
        >
          {{parentItem.title}}
        </span>
      </div>
    </div>

    <p style="text-align:center;margin-top:20px;">
      <a-button type="primary" :disabled="btnNextDisabled"  @click="stepAction('next')">下一步</a-button>
    </p>
  </a-card>
</template>

<script>
import {
  productMaterialInfoTwoTierTreeList,
} from '@/api/routineMaterial'
export default {
  inject:['addForm'],
  data() {
    return {
      currentNode: {
        children:[]
      },
      treeData:[],
      spinning:false,
      parentItem:{}
    }
  },
  computed:{
    btnNextDisabled(){
      return this.addForm.isAdd ? !this.currentNode.children.some(node => !!node.__checked) : false
    }
  },
  created(){
    this.init()
  },
  methods:{
    init(){
      this.initTree()
    },
    initTree(){
      const that = this
      productMaterialInfoTwoTierTreeList({ parentId: 0 })
        .then(res => {
          const root = {
            key: '0',
            value: '0',
            title: '成品代码库',
            isLeaf: false,
            code: '0',
            codeLength: 10,
            parentId: 0,
            children: res.data.map(item => that.formatTreeData(item)),
          }
          that.treeData = [root]
          that.currentNode = root
        })
        .catch(err => {
          that.$message.error(`错误信息:${err}`)
        })
    },
    formatTreeData(item) {
      let that = this
      let obj = {}
      obj.key = String(item.id)
      let ruleName = item.newRuleName || item.ruleName
      let showCode = +item.isSpecification === 1 ? '' : `(${item.code})`
      obj.title = `${ruleName}${showCode}`
      obj.value = String(item.id)
      obj.parentId = item.parentId
      obj.codeLength = +item.codeLength
      obj.code = item.code
      if (Array.isArray(item.subList) && item.subList.length > 0) {
        obj.children = item.subList.map(v => that.formatTreeData(v))
      }
      return obj
    },
    onLoadData(parentId) {
      const that = this
      return productMaterialInfoTwoTierTreeList({ parentId })
          .then(res => {
            return res.data.map(item => that.formatTreeData(item))
          })
          .catch(err => {
            console.error(err)
            that.$message.error(`错误信息:${err}`)
            return []
          })
    },
    async nodeClickHandler(node){
      const that = this
      that.spinning = true
      if(!node.children){
        node.children = []
      }
      if(node.children && node.children.length === 0 && node.__loaded){
        let target = that.findNode(that.treeData[0],node.parentId)
        target.children = target.children.map(n => {
          if(n.key !== node.key){
            n.__checked = false
          }
          return n
        })
        node.__checked = !node.__checked
      }
      else if(node.children && node.children.length === 0 && !node.__loaded){
        node.children = await that.onLoadData(node.key)
        node.__loaded = true
        if(node.children.length > 0){
          that.currentNode = node
        }
      }else{
        that.currentNode = node
      }
      that.spinning = false
    },
    goto(type){
      const that = this
      if(type === 'prev'){
        let target = that.findNode(that.treeData[0],that.currentNode.parentId)
        that.currentNode = target
      }else if(type === 'root'){
        that.currentNode = that.treeData[0]
      }
    },
    findNode(node, id) {
      //查找指定ID的节点
      let res = null
      const fNode = obj => {
        if (String(obj.key) === String(id)) {
          return obj
        }
        if (obj && obj.children) {
          for (let i = 0, len = obj.children.length; i < len; i++) {
            res = fNode(obj.children[i])
            if (res !== null) {
              return res
            }
          }
        }
        return null
      }
      return fNode(node)
    },
    getEmitData(){
      const that = this
      let arr = []
      let targetNode = that.currentNode.children.find(node => node.__checked === true)
      arr.push({...targetNode})
      let parentId = targetNode.parentId
      while(+parentId !== 0){
        let target = that.findNode(that.treeData[0],parentId)
        arr.push({ ...target })
        parentId = target.parentId
      }
      return arr
    },
    stepAction(type){
      const that = this
      if(type === 'next'){
        this.$emit('change','step1','next',that.addForm.isAdd ? this.getEmitData() : [])
      }
    },
    fill(){
      const that = this
      let {productSeries} = that.addForm.form
      that.parentItem = {title:productSeries}
      that.parentId = -1
    }
  }
}
</script>

<style scoped>
.selected-items-wrapper{
  display: flex;
  justify-content: center;
  align-items: center;
}
.selected-items{
  border: 2px solid #e8e8e8;
  border-radius: 6px;
  padding: 10px 25px;
  background-color: #f5f5f5;
  font-size: 16px;
  margin: 20px;
  cursor: pointer;
}
.selected-items.selected-items-checked{
  border: 2px solid rgb(233, 148, 148);
}
</style>

