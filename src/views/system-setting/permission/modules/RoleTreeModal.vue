<template>

    <a-modal
      v-if="visible"
      title="角色-菜单"
      :width="500"
      :visible="visible"
      @ok="handleOk"
      @cancel="handleCancel"
      :confirmLoading="loading"
      :maskClosable="false"
    >
    <a-spin :spinning="loading" tip="处理中...">
      <div class="spin-content">
      <a-tree
        checkable
        checkedKeys 
        :showLine="false" 
        @expand="onExpand"
        :expandedKeys="expandedKeys"
        :autoExpandParent="autoExpandParent"
        v-model="defaultCheckedKeys"
        @select="onSelect"
        @check="onCheck"
        :selectedKeys="selectedKeys"
        :treeData="treeData"
      />
      </div>
    </a-spin>
    </a-modal>
  
</template>

<script>

import { routeTreeList } from '@/api/system/menu'
import { editAuthority ,editAuthorityWithCancel} from '@/api/systemSetting'

export default {
  name: 'RoleTreeModal',
  data () {
    return {
      defaultCheckedKeys: [],
      roleId: '',
      visible: false,
      expandedKeys: [],
      autoExpandParent: true,
      checkedKeys: [],
      selectedKeys: [],
      halfCheckedKeys: [],
      treeData: [],
      loading: false,
      cancelTag:null
    }
  },
  watch: {
    checkedKeys (val) {
      console.log('onCheck', val)
    }
  },
  created () {
    routeTreeList().then(res => {
      this.treeData = res.data
    })
  },
  methods: {

    onExpand (expandedKeys) {
      console.log('onExpand', expandedKeys)
      // if not set autoExpandParent to false, if children expanded, parent can not collapse.
      // or, you can remove all expanded children keys.
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    onCheck (checkedKeys, info) {
      console.log('onCheck', checkedKeys, 'fu', info.halfCheckedKeys)
      this.checkedKeys = checkedKeys
      this.halfCheckedKeys = info.halfCheckedKeys
    },
    onSelect (selectedKeys, info) {
      console.log('onSelect', info, 'fu', info.halfCheckedKeys)
      this.selectedKeys = selectedKeys
    },
    setCheckedNodes (res, id) {
      //fix 0607
      //由于包含父节点，会选中所有的子节点，会导致 新增的子节点也会被选中
      //此函数过滤父节点，只包含叶子节点，来修复此问题
      let defaultCheckedKeys = this.formatAuth(res)
      this.defaultCheckedKeys = defaultCheckedKeys
      this.checkedKeys = defaultCheckedKeys
      this.roleId = id
      this.visible = true
      console.log('权限选中的', this.defaultCheckedKeys)
    },
    handleOk () {
      const _this = this
      const canShu = {
        menuIdList: this.checkedKeys,
        // 未全选中的节点
        notAllMenuIdList: this.halfCheckedKeys,
        roleId: this.roleId
      }
      this.loading = true
      _this.cancelTag = null
      editAuthorityWithCancel(canShu,function(c){
        _this.cancelTag = c
      }).then(data => {
        if (data.code === 200) {
          _this.$message.success('保存成功')
          _this.$emit('close')
        }
      }).catch(error => {
        console.error('editAuthority 请求错误', error)
      }).finally(() => {
        _this.close()
        this.loading = false
        _this.cancelTag = null
      })
    },
    close () {
      this.$emit('close')
      this.visible = false
    },
    handleCancel () {
      //关闭时 请求尚未结束，取消该请求
      if(this.cancelTag !== null){
        this.cancelTag()
        this.$nextTick(() =>this.cancelTag = null)
      }
      this.defaultCheckedKeys = []
      this.checkedKeys = []
      this.roleId = ''
      this.close()
    },
    formatAuth(userAuth){
      let parentKeys = getParentKeys(this.treeData)
      let leafKeys =  userAuth.filter(role => !parentKeys.includes(role))
      return leafKeys
      //获取所有父节点
      function getParentKeys(treeData){ 
        let arr = []
        if(!Array.isArray(treeData)) return []
        treeData.map(item =>findParent(item))
        function findParent(item){
          if(item.children && Array.isArray(item.children)){
            if(item.children.length > 0){
              arr.push(item.key)
              for(let i=0,len = item.children.length ;i<len;i++){
                findParent(item.children[i])
              }
            }
          }
        }
        return arr
      }
    }
  }
}
</script>

<style scoped>

</style>
