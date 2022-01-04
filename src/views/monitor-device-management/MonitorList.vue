<template>
  <a-card :bordered="false" class="monitor-device-management-device-monitor monitor-list-wrapper">
    <div class="resize-column-wrapper">
      <div id="split-0">
        <div class="menu-tree-list-wrapper" style="width: 100%; overflow: auto; height: auto; min-height: 600px">
          <a-tree
            ref="treeRef"
            :loadData="onLoadData"
            :treeData="orgTree"
            :selectedKeys="treeSelectedKeys"
            :defaultExpandAll="true"
            @select="handleClick"
            :expandedKeys="expandedKeys"
            :autoExpandParent="autoExpandParent"
            @expand="onExpand"
            :showLine="true"
          >
          </a-tree>
        </div>
      </div>
      <div id="split-1">
        <div class="device-wrapper">
        <h3>不知道如何使用？点击查看<a href="#" @click="showGuid">功能使用说明</a></h3>
        <a-row >
          <transition-group name="list" tag="div" >
          <a-col v-for="item in dataSource" :md="12" :lg="12" :xl="12" :xxl="12" :key="item.key">
            <div class="device-item">
              <h3>
                <span>{{item.title}}</span>
                <a href="javascript:void(0);" style="position: absolute;right:10px;top:0;" @click="doAction('del',item.key)">关闭</a>
              </h3>
              <MonitorDevice :key="item.key"  :deviceKey="item.equipmentCode" :channelNo="item.equipmentChannelNo" />
            </div>
          </a-col>
          </transition-group>
        </a-row>
        </div>
      </div>
      <GuidForm ref="guidForm"/>
    </div>
  </a-card>
</template>

<script>
import {
  monitoringEquipmentTreeList
} from '@/api/monitorDeviceManagement'

import {MonitorDevice,CAMERA_API} from '@/components/CustomerList/MonitorDevice'
import GuidForm from '@/components/CustomerList/MonitorDevice/Guid'
import Split from 'split.js'
let uuid = () => Math.random().toString(16).slice(-6) + Math.random().toString(16).slice(-6)

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
  name: 'monitor-device-management-device-monitor',
  components:{
    MonitorDevice,
    GuidForm
  },
  data() {
    return {
      parentId: 0, // 父id
      parentItem: {},
      selectedTreeNode: null, //新增修改后刷新节点用
      // 表头
      orgTree: [],
      dataSource: [],
      selectedRowKeys: [],
      selectedRows: [],

      expandedKeys: [],
      searchValue: '',
      autoExpandParent: true,

      loading: false,
      queryParam: {},
      pagination: {
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: (total) => `共有 ${total} 条数据`, //分页中显示总的数据
        onShowSizeChange: this.onShowSizeChangeHandler,
      },
      treeInputSearchDebounce: null,

      monitorWrapper:{
        gutter:[16,16],
        span:{ xs: 24, sm: 24, md: 12, lg: 12 }
      }
    }
  },
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'monitor-device-management-device-monitor') {
          this.init()
        }
      },
      immediate: true,
    },
  },
  computed: {
    treeSelectedKeys() {
      return [String(this.parentId)]
    }
  },
  methods: {
    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = true
    },
    init() {
      const that = this
      that.parentId = 0
      that.fetchTree()

      that.$nextTick(() => {
        that.splitClear()
        that.splitInstance = Split(['#split-0', '#split-1'], {
          gutter: function(i, gutterDirection) {
            var gut = document.createElement('div')
            gut.className = '_wdf_split_gutter _wdf_split_gutter-' + gutterDirection
            return gut
          },
          sizes: [20, 80]
        })
      })
    },

    fetchTree() {
      const that = this
      monitoringEquipmentTreeList()
        .then(res => {
          const root = {
            key: '0',
            value: '0',
            title: '监控画面',
            isLeaf: false,
            children: res.data.map((item) => that.formatTreeData(item)),
            scopedSlots: { title: 'title' },
          }
          that.orgTree = [root]
          if (String(that.parentId) === '0') {
            that.parentItem = root
          }
          that.expandedKeys = that.generateList(that.orgTree).map(item => item.key)
        })
        .catch(err => {
          that.$message.error(`调用接口[monitoringEquipmentTreeList]时发生错误，错误信息:${err}`)
          return null
        })

    },
    //格式化接口数据 key,title,value
    formatTreeData(item) {
      let that = this
      let obj = {}
      let _uuid = uuid()
      obj.key = _uuid
      obj.title = item.typeName || item.equipmentName
      obj.equipmentCode = item.equipmentCode
      obj.value = _uuid
      if(item && 'isLeaf' in item){
        obj.isLeaf = item.isLeaf
      }

      if(item && 'equipmentChannelNo' in item){
        obj.equipmentChannelNo = item.equipmentChannelNo
      }else{
        obj.equipmentChannelNo = 1
      }

      if (Array.isArray(item.equipmentList) && item.equipmentList.length > 0) {
        obj.children = item.equipmentList.map((v) => that.formatTreeData(v))
      }
      return obj
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
    handleClick(selectedKeys, e) {
      const that = this
      that.selectedTreeNode = e.node
      let dataRef = e.node.dataRef
      // 点击树结构菜单
      var parentId = this.parentId
      if (selectedKeys[0] !== undefined) {
        parentId = selectedKeys[0]
      }
      that.parentId = parentId

      that.selectedRowKeys = []
      that.selectedRows = []

      let {equipmentCode,equipmentChannelNo,key,title} = dataRef

      let dataSource = [...that.dataSource]
      let target = dataSource.find(item => item.key === key)
      if(target){
        return
      }else{
        if(dataSource.length >= 4){
          that.$message.info('最多支持4路监控查看，请先关闭其他监控再重新打开此监控')
          return
        }
        if(equipmentCode){
          dataSource.push({equipmentCode,equipmentChannelNo,key,title})
          that.dataSource = dataSource
        }
      }
    },
    doAction(type,key){
      if(type === 'del'){
        this.dataSource = this.dataSource.filter(item => item.key !== key)
      }
    },
    showGuid(){
      this.$refs.guidForm.show()
    },
    onLoadData(treeNode) {
      const that = this
      let {equipmentCode} = treeNode.dataRef

      return new Promise(async (resolve) => {
        if(!equipmentCode || !String(equipmentCode).startsWith('F')){
          resolve()
          return
        }
        let {accessToken} = await CAMERA_API.util.getTokenAndUrl('test')
        let deviceCameraList = await CAMERA_API.deviceCameraList({
          accessToken,
          deviceSerial:equipmentCode
        })
        if(+deviceCameraList.code !== 200){
          resolve()
        }

        treeNode.dataRef.children = deviceCameraList.data.map(item => {
          return that.formatTreeData({
            equipmentName:item.deviceName,
            equipmentCode:item.deviceSerial,
            equipmentChannelNo:item.channelNo,
            equipmentList:[],
            isLeaf:true,
            isNvr:false
          })
        })
        that.orgTree = [...that.orgTree]
        resolve()
      })
    },
    splitClear() {
      try {
        if (this.splitInstance !== null) {
          this.splitInstance.destroy()
          this.splitInstance = null
        }
      } catch (err) {
        this.splitInstance = null
        console.log(err)
      }
    }
  },
  beforeDestroy() {
    this.splitClear()
  }
}
</script>

<style scoped>
.monitor-list-wrapper >>> .resize-column-wrapper {
  width: 100%;
  height: 100%;
  background-color: #fff;
  display: flex;
  overflow: hidden;
}

#split-0,
#split-1 {
  padding: 0 5px;
}

.monitor-list-wrapper .device-wrapper .device-item{
  padding: 20px 10px;
  margin: 5px;
  text-align: center;
  background-color: rgb(61, 61, 61);
  box-shadow: 0 0 3px 3px #ddd;
  border-radius: 3px;
}

.monitor-list-wrapper .device-wrapper .device-item h3{
  color: #fff;
  position: relative;
}

.list-enter-active,
.list-leave-active {
  transition: all 1s;
}
.list-enter, .list-leave-to
/* .list-leave-active for below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}

</style>

