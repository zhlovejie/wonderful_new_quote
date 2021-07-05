<template>
  <div class="options-select-wrapper">
    <a-card :title="modelTitle">
      <div
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
                style="width: 280px"
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
            name="checkboxgroup"
            :options="optionsCheckbox"
            @change="optionsCheckboxChange"
          />
        </div>
      </div>
      <div
        class="options-bd"
        style="margin-top:20px;"
      >
        <p>配置清单</p>
        <org-chart v-for="(item,idx) in optionsTableDataSource" :key="item.key" :datasource="item">
            <template slot-scope="{ nodeData }">
              <template v-if="nodeData.configType === 1">
                <a-checkbox @change="e => chkConfigChange(e,nodeData)" />
                <a-popover
                  v-model="nodeData.visible"
                  title="参数配置"
                  trigger="click"
                >
                  <a slot="content">
                    <a-radio-group
                      :options="optionsConfig"
                      :value="nodeData.configValue"
                      @change="(event) =>{ setConfigChange('change',nodeData,event.target.value) }"
                    />
                  </a>
                  <a href="javascript:void(0);" @click="setConfigChange('visible',nodeData)">{{nodeData.title}}</a>
                </a-popover>
              </template>
              <template v-else>
                {{ nodeData.title }}
              </template>
            </template>
          </org-chart>

        <!--
        <a-table
          :columns="columns"
          :dataSource="optionsTableDataSource"
          :pagination="false"
          size="small"
        >
          <span
            slot="order"
            slot-scope="text, record, index"
          >
            {{ index + 1 }}
          </span>
          <div
            slot="title111"
            slot-scope="text, record, index"
          >
            <template v-if="record && +record.configType === 1">
              <a-checkbox @change="e => chkConfigChange(e,record)" />
              <a-popover
                v-model="record.visible"
                title="参数配置"
                trigger="click"
              >
                <a slot="content">
                  <a-radio-group
                    :options="optionsConfig"
                    :value="record.configValue"
                    @change="(event) =>{ setConfigChange('change',record,event.target.value) }"
                  />
                </a>
                <a-button type="link" @click="setConfigChange('visible',record)">{{text}}</a-button>
              </a-popover>
            </template>
            <template v-else>{{text}}</template>
          </div>
        </a-table>
        -->
      </div>

    </a-card>
  </div>
</template>

<script>
import OrgChart from '@/components/Organization/OrganizationChartContainer'
import { priceQuotedItemConfigSubList, priceQuotedItemConfigTreeList } from '@/api/productOfferManagement'

export default {
  name: 'options-select',
  components:{
    OrgChart
  },
  props:{
    modelTitle:{
      type:String,
      default:() => '标准配置'
    },
    noShowKeys:{
      type:Array,
      default:() => []
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
        { label: '默认选中', value: '0' },
        { label: '默认不选中', value: '1' },
        { label: '必选项', value: '2' },
        { label: '非必选项', value: '3' }
      ]
    }
  },
  computed: {
    optionsCheckbox() {
      return this.optionsList.map(item => {
        return { label: item.configName, value: item.id }
      })
    }
  },
  created() {
    this.init()
  },
  methods: {
    async init() {
      await Promise.all([this.fetchOptions(), this.fetchTree()])
    },
    fetchOptions() {
      const that = this
      return priceQuotedItemConfigSubList(that.queryParam)
        .then(res => {
          that.optionsList = res.data.filter(item => item.parentConfigId === null && item.configType !== 9)
        })
        .catch(err => {
          that.$message.error(err)
          that.optionsList = []
        })
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
    fetchTree() {
      const that = this
      return priceQuotedItemConfigTreeList()
        .then(res => {
          const root = {
            key: 0,
            value: 0,
            title: '配置项',
            isLeaf: false,
            parentId: null,
            children: res.data.map(item => that.formatTreeData(item))
          }
          that.treeData = root
          console.log(JSON.stringify(that.treeData))
        })
        .catch(err => {
          that.$message.error(`调用接口[priceQuotedItemConfigTreeList]时发生错误，错误信息:${err}`)
        })
    },
    formatTreeData(item) {
      const that = this
      const obj = {}
      obj.key = String(item.id)
      obj.title = item.configName
      obj.value = String(item.id)
      // obj.isLeaf = !(Array.isArray(item.subList) && item.subList.length > 0)
      obj.parentId = item.parentConfigId || 0
      obj.serialNumber = item.serialNumber
      obj.configType = item.configType
      if (Array.isArray(item.quotedItemConfigTreeVOList) && item.quotedItemConfigTreeVOList.length > 0) {
        obj.children = item.quotedItemConfigTreeVOList.map(v => that.formatTreeData(v))
      }
      return obj
    },
    optionsCheckboxChange(keys) {
      const that = this
      const arr = []
      this.selectKeys.map(key => {
        const target = that.findNode(that.treeData, key)
        arr.push({ ...target })
      })
      that.optionsTableDataSource = arr
    },
    setConfigChange(type, record, value) {
      const that = this
      let optionsTableDataSource = [...that.optionsTableDataSource]
      if (type === 'visible') {
        optionsTableDataSource = optionsTableDataSource.map(item => {
          const node = that.findNode(item, record.key)
          if (node) {
            node.visible = !node.visible
          }
          return item
        })
        that.optionsTableDataSource = optionsTableDataSource
      } else if (type === 'change') {
        optionsTableDataSource = optionsTableDataSource.map(item => {
          const node = that.findNode(item, record.key)
          if (node) {
            node.configValue = value
            node.visible = false
          }
          return item
        })
        that.optionsTableDataSource = optionsTableDataSource
      }
    },
    chkConfigChange(e,record){
      console.log(arguments)
    }
  }
}
</script>

<style scoped>
.options-bd >>> .orgchart .node{
  -webkit-box-sizing: border-box;
    box-sizing: border-box;
    display: inline-block;
    position: relative;
    margin: 0 5px;
    padding: 5px;
    border: 1px solid rgba(0,0,0, 0.3);
    text-align: center;
    width: 100px;
    border-radius: 3px;
}
.options-bd >>> .orgchart table {
    border-spacing: 0;
    border-collapse: collapse;
}

.options-bd >>> .orgchart .lines .downLine{
  width: 1px;
}
.options-bd >>> .orgchart .lines .topLine{
  border-top: 1px solid rgba(0,0,0, 0.3);
}

.options-bd >>> .orgchart .node:hover{
  background:none;
}
</style>
