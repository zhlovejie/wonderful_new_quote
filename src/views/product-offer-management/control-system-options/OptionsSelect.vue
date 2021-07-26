<template>
  <div class="options-select-wrapper">
    <a-card :title="$attrs.title || '配置'">
      <div
        v-if="isAdd || isEdit"
        class="options-hd"
        style="padding:20px;border:1px solid #e8e8e8;"
      >
        <div class="search-wrapper">
          <a-form layout="inline">
            <a-form-item>
              <a-input
                placeholder="模糊查询"
                v-model="queryParam.configName"
                allowClear
                style="width: 220px"
              />
            </a-form-item>
            <a-form-item>
              <a-button
                type="primary"
                icon="search"
                @click="searchAction()"
              >查询</a-button>
            </a-form-item>
          </a-form>
        </div>
        <div
          class="options-list"
          style="margin-top:20px;"
        >
          <a-checkbox-group
            v-model="selectKeys"
            :options="optionsCheckbox"
            @change="optionsCheckboxChange"
          />
        </div>
      </div>
      <div
        class="options-bd"
        :style="{'margin-top':isView || isPrice ? '0' : '20px'}"
      >
        <p>配置清单</p>
        <OptConfigTree :nodeList="optionsTableDataSource">
          <div
            slot-scope="node"
            style="padding:10px;"
          >
            <template v-if="node && node.itemConfigType === 1">
              <template>
                <a-checkbox
                  v-if="isAdd || isEdit"
                  v-model="node.__checked"
                  @change="e => optChkboxChange(e.target.checked,{...node})"
                />
                <a-checkbox
                  v-else-if="isPrice"
                  v-model="node.__checked"
                  :disabled="+node.configValue === 1"
                  @change="e => optChkboxChange(e.target.checked,{...node})"
                />
              </template>

              <a-popover
                v-if="isAdd || isEdit"
                title="参数配置"
                trigger="hover"
              >
                <a slot="content">
                  <a-radio-group
                    :options="optionsConfig"
                    v-model="node.configValue"
                    @change="e => optRdoChange(e.target.value,{...node})"
                  />
                </a>
                <a-button type="link">
                  {{node.configName}}
                  <span style="margin:0 5px;font-size:80%;color:red;" v-if="showOptionConfigLabel">
                    {{getOptionsConfigTxt(node.configValue)}}
                  </span>
                </a-button>
              </a-popover>
              <span v-else>
                <a-button type="link">
                  {{node.configName}}
                  <span style="margin:0 5px;font-size:80%;color:red;" v-if="showOptionConfigLabel">
                    {{getOptionsConfigTxt(node.configValue)}}
                  </span>
                </a-button>
              </span>
            </template>
            <template v-else>{{node.configName}}</template>
          </div>
        </OptConfigTree>
      </div>
    </a-card>
  </div>
</template>

<script>
import { priceQuotedItemConfigTreeList } from '@/api/productOfferManagement'
import OptConfigTree from './OptConfigTree'
const columns = [
  {
    align: 'center',
    title: '序号',
    scopedSlots: { customRender: 'order' }
  },
  {
    align: 'center',
    title: '顺序号',
    dataIndex: 'serialNumber'
  },
  {
    align: 'center',
    title: '配置名称',
    dataIndex: 'title',
    scopedSlots: { customRender: 'title111' }
  }
]
const optionsConfig = [
  { label: '必选项', value: 1 },
  // { label: '必选项默认不选中', value: 2 },
  { label: '默认选中', value: 3 },
  { label: '默认不选中', value: 4 }
]
export default {
  components: { OptConfigTree },
  inject: ['addForm'],
  model: {
    prop: 'data',
    event: 'change'
  },
  props: {
    data: Object,
    filterKeys: Array
  },
  data() {
    return {
      queryParam: {}, //搜索用
      treeData: [],
      selectKeys: [],
      optionsTableDataSource: [],
      columns: Object.freeze(columns),
      optionsConfig: Object.freeze(optionsConfig)
    }
  },
  computed: {
    optionsCheckbox() {
      return this.treeData.map(item => {
        return { label: item.configName, value: item.itemConfigId }
      })
    },
    isView(){ // 查看状态
      return this.$attrs.actionType === 'view'
    },
    isAdd(){
      return this.$attrs.actionType === 'add'
    },
    isEdit(){
      return this.$attrs.actionType === 'edit'
    },
    showOptionConfigLabel(){ // 是否显示 optionsConfig 的label
      return !!this.$attrs.showOptionConfigLabel
    },
    isPrice(){ // 报价用
      return this.$attrs.actionType === 'price'
    }
  },
  watch: {
    data() {
      console.log('watch data called...')
      this.init()
    },
    filterKeys() {
      console.log('watch filterKeys called...')
      this.init()
    }
  },
  created() {
    console.log('hooks created called...')
    this.isSearch = false
    this.init()
  },
  methods: {
    async init() {
      const that = this
      if (!that.treeDataCache) {
        await Promise.all([
          that.fetchTree().then(data => {
            console.log('fetchTree called...')
            that.treeData = data.childrenList || []
            that.treeDataCache = [...that.treeData]
          })
        ])
      }
      if (!that.data) {
        return
      }
      // watch 部分
      // debugger
      const { treeData, keys } = that.data
      console.log(that.$attrs.title)
      if (that.isSearch) {
        const configName = that.queryParam.configName || ''
        that.treeData = that.$_.cloneDeep(that.treeDataCache)
          .filter(node => node.configName.includes(configName))
          .filter(node => !that.filterKeys.includes(node.itemConfigId))
      } else {
        that.treeData = that.$_.cloneDeep(that.treeDataCache).filter(node => !that.filterKeys.includes(node.itemConfigId))
      }

      that.selectKeys = keys
      const optionsTableDataSource = that.treeData.filter(node => that.selectKeys.includes(node.itemConfigId))
      if(that.isView){
        that.optionsTableDataSource = treeData
      }else if(that.isPrice){
        that.optionsTableDataSource = that.priceModeMarge(optionsTableDataSource, that.getSelectedNodes(treeData))
      }
      else{
        that.optionsTableDataSource = that.marge(optionsTableDataSource, that.getSelectedNodes(treeData))
      }

    },
    fetchTree() {
      const that = this
      return priceQuotedItemConfigTreeList().then(res => {
        const root = {
          id: 0,
          key: 0,
          configName: '配置项',
          isLeaf: false,
          parentConfigId: null,
          childrenList: res.data.map(item => that.formatTreeData(item))
        }
        // 去除没有参数的分支
        const shaking = node => {
          const f = n => {
            if (!('childrenList' in n)) {
              n.childrenList = []
            }
            if (Array.isArray(n.childrenList) && n.childrenList.length > 0) {
              n.childrenList = n.childrenList
                .map(node => f(node))
                .filter(node => {
                  return !(node.itemConfigType === 0 && node.childrenList.length === 0)
                })
            }
            return n
          }
          return f(node)
        }
        return shaking(root)
      })
    },
    formatTreeData(item) {
      const that = this
      const obj = {}
      obj.id = item.id
      obj.configName = item.configName
      obj.parentConfigId = item.parentConfigId || 0
      obj.serialNumber = item.serialNumber
      obj.itemConfigType = item.itemConfigType
      obj.itemConfigId = item.id

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
    optionsCheckboxChange(keys) {
      const that = this
      that.optionsTableDataSource = that.treeData.filter(node => keys.includes(node.itemConfigId))
      that.optChkboxChange()
    },
    searchAction() {
      const that = this
      const configName = that.queryParam.configName || ''

      const action = () => {
        that.treeData = that.$_.cloneDeep(that.treeDataCache)
          .filter(node => node.configName.includes(configName))
          .filter(node => !that.filterKeys.includes(node.itemConfigId))

        that.selectKeys = []
        const optionsTableDataSource = that.treeData.filter(node => that.selectKeys.includes(node.itemConfigId))
        that.optionsTableDataSource = optionsTableDataSource
        that.isSearch = configName.length !== 0
        that.optChkboxChange()
      }
      if (that.selectKeys.length > 0) {
        that.$confirm({
          title: '确认要执行搜索操作吗?',
          okText: '确定',
          okType: 'danger',
          cancelText: '取消',
          content: h => {
            return h('div', { style: { color: 'red' } }, [
              h('div', null, '搜索操作会有以下影响：'),
              h('div', null, '1、清空已经选择的项目'),
              h('div', null, '2、不显示被过滤的项目')
            ])
          },
          onOk() {
            action()
          },
          onCancel() {}
        })
      } else {
        action()
      }
    },
    optChkboxChange() {
      const that = this
      const nodes = that.getSelectedNodesWithTreeStruct(that.optionsTableDataSource)
      console.log(JSON.stringify(nodes))

      that.$emit('change', {
        keys: [...that.selectKeys],
        treeData: nodes
      })
    },
    optRdoChange() {
      this.optChkboxChange()
    },
    getSelectedNodesWithTreeStruct(nodes) {
      const that = this
      const _nodes = that.$_.cloneDeep(nodes)
      const f = n => {
        if (Array.isArray(n.childrenList) && n.childrenList.length > 0) {
          if (n.childrenList.some(item => item.itemConfigType === 1)) {
            const case1 = n.childrenList.filter(node => node.itemConfigType === 1 && node.__checked === true)
            const case2 = n.childrenList.filter(node => node.itemConfigType !== 1)
            n.childrenList = [...case1, ...case2].map(node => f(node))
          } else {
            n.childrenList = n.childrenList.map(node => f(node))
          }
        }
        return n
      }

      const f1 = n => {
        if (Array.isArray(n.childrenList)) {
          n.childrenList = n.childrenList.filter(node => {
            const case1 = node.itemConfigType === 0 && node.childrenList.length > 0
            const case2 = node.itemConfigType === 1 && node.__checked === true
            return case1 || case2
          })
          if (n.childrenList.length > 0) {
            n.childrenList = n.childrenList.map(node => f(node))
          }
        }
        return n
      }
      // 过滤未被选中的
      const step1 = _nodes.map(n => f(n))
      // 进一步过滤空节点
      let step2 = step1.map(n => f1(n))
      step2 = step2.filter(node => node.itemConfigType === 0 && node.childrenList.length > 0)
      return step2
    },
    getSelectedNodes(nodes) {
      const arr = []
      const f = n => {
        if (n.itemConfigType === 1) {
          arr.push({ ...n })
        }
        if (Array.isArray(n.childrenList) && n.childrenList.length > 0) {
          n.childrenList = n.childrenList.map(node => f(node))
        }
        return n
      }
      nodes.map(node => f(node))
      return arr
    },
    marge(sourceTree, nodes) {
      const f = n => {
        let target = nodes.find(node => node.itemConfigId === n.itemConfigId)
        if(target){
          n.__checked = target.__checked
          n.configValue = target.configValue
        }
        if (Array.isArray(n.childrenList) && n.childrenList.length > 0) {
          n.childrenList = n.childrenList.map(node => f(node))
        }
        return n
      }
      return sourceTree.map(node => f(node))
    },
    priceModeMarge(sourceTree, nodes) {
      let pNodes = nodes.filter(n => +n.configValue === 1)
      const f = n => {
        // 添加状态
        let target1 = nodes.find(node => node.itemConfigId === n.itemConfigId)
        if(target1){
          n.__checked = target1.__checked
          n.configValue = target1.configValue
        }

        // 过滤多余的必选项
        let target = pNodes.find(node => node.parentConfigId === n.itemConfigId)
        if(target){
          n.childrenList = [target,...n.childrenList.filter(nn => +nn.itemConfigType === 0)]
        }
        if (Array.isArray(n.childrenList) && n.childrenList.length > 0) {
          n.childrenList = n.childrenList.map(node => f(node))
        }
        return n
      }
      return sourceTree.map(node => f(node))
    },

    getOptionsConfigTxt(v){
      if(!v){
        return ''
      }
      try{
        let txt = this.optionsConfig.find(c => String(c.value) === String(v)).label
        return `(${txt})`
      }catch(err){
        return ''
      }
      return ''
    }
  }
}
</script>
