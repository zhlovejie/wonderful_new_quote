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

        <div style="display:flex;">
          <a-input
            style="line-height: 40px;flex:1;"
            placeholder="规则名称模糊查询"
            v-model="searchValue"
          />
          <a-button title="查询" style="margin:0 7px;" icon="search" @click="() => searchAction(1)"></a-button>
          <a-button title="重置" icon="reload" @click="() => searchAction(2)"></a-button>
        </div>

        <a-tree-select
          v-model="form.parentId"
          style="width: 100%"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          :loadData="onLoadData"
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
      </a-form-model-item>

      <a-form-model-item
        v-for="(item,index) in form.specificationsList"
        :key="item.id"
        :label="item.newRuleName || item.ruleName"
        :prop="'specificationsList.' + index + '.selectedID'"
      >
        <a-select v-model="item.selectedID" placeholder="请选择" :allowClear="true" @change="specificationChangeHandler">
          <a-select-option v-for="sub in item.subList" :key="sub.id" :value="sub.id">
            {{`${(sub.newRuleName || sub.ruleName)}(${sub.code})`}}
          </a-select-option>
        </a-select>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>
<script>
import {
  routineMaterialRulePageTwoTierTreeList,
  routineMaterialInfoTwoTierTreeList,
  routineMaterialInfoCheckCode,
  routineMaterialInfoCheckName,
  routineMaterialRulePageConditionTreeList
} from '@/api/routineMaterial'

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
  props:['info'],
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
      },
      treeData: [],
      dataList:[],

      selectItem:null,
      expandedKeys:['0'],
      searchValue:undefined
    }
  },
  computed:{

  },
  watch:{
    'info':function(){
      this.$nextTick(() => this.init())
    }
  },
  created() {
    this.$nextTick(() => this.init())
  },
  methods: {
    async init(type, record) {
      const that = this
      if (that.info) {
        let { __treeData ,__selectItem} = that.info
        if(that.selectItem !== null && that.selectItem.key === __selectItem.key){
          return
        }
        that.selectItem = {...__selectItem}
        // that.treeData = __treeData
        // debugger
        // that.dataList = that.generateList(that.treeData)
        await that.fetchTree()
        that.form = { ...that.form, parentId: __selectItem.key }
        that.initSpecifications({...__selectItem})
      }
    },
    reset(){
      const that = this
      that.form = {
        ...that.form,
        parentId: undefined,
        specificationsList:[],//动态加载节点下的菜单
      }
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
    /**
     * 获取格式化规格型号
     */
    getSpecification(){
      const that = this
      let arr = []
      that.form.specificationsList.map(item => {
        let target = item.subList.find(s => s.id === item.selectedID)
        if(target){
          arr.push(`${item.newRuleName || item.ruleName}:${(target.newRuleName || target.ruleName)}(${target.code})  `)
        }
      })
      return arr.join(",")
    },

    handleClick(selectedKeys, e) {
      const that = this
      let node = {...e.dataRef}
      that.form = {
        ...that.form,
      },
      that.$nextTick(() => {
        that.initSpecifications(node)
      })
    },
    initSpecifications(node){
      const that = this
      routineMaterialRulePageTwoTierTreeList({ parentId: node.value }).then(res => {
        console.log(res)
        if(!res || res.code !== 200){
          that.$message.info(`获取节点【名称：${node.title}-编号：${node.value}】的规格数据失败！`)
          return
        }
        //加载为规格型号的数据
        that.form = {...that.form,specificationsList:res.data.filter(item => item.isSpecification === 1)}
      })
    },
    onLoadData(treeNode) {
      const that = this
      return new Promise((resolve,reject) => {
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
            console.log(err)
            reject()
            that.$message.error(`调用接口[routineMaterialInfoTwoTierTreeList]时发生错误，错误信息:${err}`)
          })
      })
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
    },
    fetchTree() {
      const that = this
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
    //格式化接口数据 key,title,value
    formatTreeData(item) {
      let that = this
      let obj = {}
      obj.key = String(item.id)
      // obj.title = `${item.newRuleName || item.ruleName}(${item.code})`
      obj.copyTitle = `${item.newRuleName || item.ruleName}(${item.code})`
      obj.value = String(item.id)
      // obj.isLeaf = !(Array.isArray(item.subList) && item.subList.length > 0)
      obj.parentId = item.parentId
      obj.codeLength = +item.codeLength
      obj.code = item.code

      //坑 上面如果设置了title ，这里插槽 也是title 的 会忽略插槽， 这里吧上面的title注释了
      obj.scopedSlots = { title: 'title' }


      //obj.__selectable = obj.isLeaf
      if (Array.isArray(item.subList) && item.subList.length > 0) {
        obj.children = item.subList.map(v => that.formatTreeData(v))
      }
      return obj
    },
    specificationChangeHandler(){
      // console.log(this.getSpecification())
      let specification = this.getSpecification()
      this.$emit('change',{specification})
    },
    onExpand(expandedKeys) {
      console.log(arguments)
      this.expandedKeys = expandedKeys
      // this.autoExpandParent = false
    },
  }
}
</script>

<style scoped>
.routine-addform-wrapper-step1 >>> .ant-form-item {
  display: flex;
}
.routine-addform-wrapper-step1 >>> .ant-form-item .ant-form-item-label {
  width: 120px;
  text-align: left;
}
.routine-addform-wrapper-step1 >>> .ant-form-item .ant-form-item-control-wrapper {
  flex: 1;
}
</style>
