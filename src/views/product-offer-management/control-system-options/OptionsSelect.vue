<template>
  <div class="options-select-wrapper">
    <a-card :title="modelTitle">
      <div
        class="options-hd"
        style="padding:20px;border:1px solid #e8e8e8;"
        v-if="!disabled"
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
                @click="fetchOptions()"
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
        :style="{'margin-top':disabled ? '0' : '20px'}"
      >
        <p>配置清单</p>
        <OptConfigTree :nodeList="optionsTableDataSource">
          <div
            slot-scope="node"
            style="padding:10px;"
          >
            <template v-if="node && node.itemConfigType === 1">
              <template v-if="!disabled">
                <a-checkbox
                  v-model="node.__checked"
                  @change="e => optChkboxChange(e.target.checked,{...node})"
                />
              </template>

              <a-popover
                title="参数配置"
                trigger="hover"
                v-if="!disabled"
              >
                <a slot="content">
                  <a-radio-group
                    :options="optionsConfig"
                    v-model="node.configValue"
                    @change="e => optRdoChange(e.target.value,{...node})"
                  />
                </a>
                <a-button type="link">{{node.configName}}</a-button>
              </a-popover>
              <span v-else>
                <a-button type="link">{{node.configName}}</a-button>
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
import OptConfigTree from './OptConfigTree'
export default {
  name: 'options-select',
  components: { OptConfigTree },
  inject: ['addForm'],
  props: {
    modelTitle: {
      type: String,
      default: () => '标准配置'
    },
    filterKeys: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      queryParam: {},
      optionsList: [],
      selectKeys: [],
      treeData: [],
      optionsTableDataSource: [],
      columns: [
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
      ],
      optionsConfig: [
        { label: '必选项默认选中', value: 1 },
        { label: '必选项默认不选中', value: 2 },
        { label: '非必选项默认选中', value: 3 },
        { label: '非必选项默认不选中', value: 4 }
      ],

      optSelectedNodesThis: [],
      type: 'add'
    }
  },
  computed: {
    isAdd() {
      return this.type === 'add'
    },
    isView() {
      return this.type === 'view'
    },
    isEdit() {
      return this.type === 'edit'
    },
    optionsCheckbox() {
      return this.optionsList.map(item => {
        return { label: item.configName, value: item.id }
      })
    },
    disabled() {
      return this.isView
    }
  },
  watch: {
    filterKeys(keys) {
      const that = this
      if(!that.optionsListCache){
        return
      }
      if(that.isAdd || that.isEdit){
        let optionsList = [...this.optionsListCache]
        this.optionsList = optionsList.filter(opt => !keys.includes(opt.id))
        let arrKeys = this.optionsList.map(opt => opt.id)
        this.selectKeys = this.selectKeys.filter(k => arrKeys.includes(k))
        // this.optionsCheckboxChange(this.selectKeys)
      }
    }
  },
  methods: {
    query(type, nodes,{optionsList,treeData}) {
      const that = this
      that.type = type
      that.optionsList = that.$_.cloneDeep(optionsList)
      that.treeData = that.$_.cloneDeep(treeData)
      that.optionsListCache = [...that.optionsList]
      if (that.isAdd) {
        that.selectKeys = []
        that.optionsTableDataSource = []
      } else if (that.isView) {
        that.selectKeys = nodes.map(node => node.itemConfigId || node.key)
        that.optionsTableDataSource = that.checkedAndRequired2ConfigValue(that.$_.cloneDeep(nodes))
      } else if (that.isEdit) {
        that.selectKeys = nodes.map(node => node.itemConfigId || node.key)
        that.optionsTableDataSource = that.selectKeys.map(key => {
          const target = that.findNode(that.treeData, key)
          return that.$_.cloneDeep(target)
        })
        that.optionsTableDataSource = that.margeNodes(
          that.$_.cloneDeep(that.optionsTableDataSource),
          that.checkedAndRequired2ConfigValue(that.$_.cloneDeep(nodes))
        )
      }
    },

    findNode(node, id) {
      //查找指定ID的节点
      let res = null
      const fNode = obj => {
        if (String(obj.key) === String(id)) {
          return obj
        }
        if (obj && obj.childrenList) {
          for (let i = 0, len = obj.childrenList.length; i < len; i++) {
            res = fNode(obj.childrenList[i])
            if (res !== null) {
              return res
            }
          }
        }
        return null
      }
      return fNode(node)
    },
    optionsCheckboxChange(keys) {
      const that = this
      const arr = []
      this.selectKeys.map(key => {
        const target = that.findNode(that.treeData, key)
        arr.push(that.$_.cloneDeep(target))
      })
      that.optionsTableDataSource = arr

      that.$emit('optChange', [...keys])
      that.emitData()
    },
    optRdoChange(v, node) {
      this.emitData()
    },
    optChkboxChange(checked, node) {
      const that = this
      that.emitData()
    },
    emitData() {
      const that = this
      that.$nextTick(() => {
        const optionsTableDataSource = that.$_.cloneDeep(that.optionsTableDataSource).filter(n => that.hasCheckedNode(n))
        let list = that.filterCheckedNode(optionsTableDataSource)
        list = that.configValue2CheckedAndRequired(list)
        that.$emit('change', list)
      })
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
    },
    filterCheckedNode(nodes) { // 过滤未选择的子项
      const f = n => {
        if (Array.isArray(n.childrenList) && n.childrenList.length > 0) {
          if (n.childrenList.some(node => '__checked' in node)) {
            n.childrenList = n.childrenList.map(node => f(node)).filter(node => node.__checked)
          } else {
            n.childrenList = n.childrenList.map(node => f(node))
          }
        }
        return n
      }
      return nodes.map(n => f(n))
    },
    hasCheckedNode(node){ // 过滤没有勾选子项的情况
      let arr = []
      const f = n => {
        arr.push(n)
        if (Array.isArray(n.childrenList) && n.childrenList.length > 0) {
          n.childrenList.map(_n => f(_n))
        }
      };
      f(node);
      return arr.some(n => '__checked' in n && n.__checked === true)
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
        if (Array.isArray(n.childrenList) && n.childrenList.length > 0) {
          n.childrenList = n.childrenList.map(node => f(node))
        }
        return n
      }
      return nodes.map(n => f(n))
    },

    margeNodes(sourceNodes, nodes) {
      const that = this
      const getCheckedNodes = function(nds) {
        const arr = []
        const f = n => {
          if (n.itemConfigType === 1) {
            arr.push(n)
          }
          if (Array.isArray(n.childrenList) && n.childrenList.length > 0) {
            n.childrenList = n.childrenList.map(node => f(node))
          }
          return n
        }
        nds.map(n => f(n))
        return arr
      }
      const checkedNodes = getCheckedNodes(nodes)

      const marge = function(snds) {
        const f = n => {
          const __node = checkedNodes.find(_n => _n.key === n.key)
          if (n.itemConfigType === 1 && __node) {
            n.__checked = true
            n.configValue = __node.configValue
            if (__node.id) {
              n.id = __node.id
            }
            if (__node.zktId) {
              n.zktId = __node.zktId
            }
          }
          if (Array.isArray(n.childrenList) && n.childrenList.length > 0) {
            n.childrenList = n.childrenList.map(node => f(node))
          }
          return n
        }
        return snds.map(n => f(n))
      }
      return marge(sourceNodes)
    }
  }
}
</script>
