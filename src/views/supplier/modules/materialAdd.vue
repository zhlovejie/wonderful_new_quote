<template>
  <a-modal title="选择添加分类" v-model="visibles" @cancel="handleCancel" :width="700" :maskClosable="false">
    <template slot="footer">
      <template>
        <a-button @click="handleCancel">取消</a-button>
        <a-button type="primary" :loading="spinning" @click="handleOk">确定</a-button>
      </template>
    </template>
    <a-spin :spinning="spinning">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" class="routine-addform-wrapper-step1">
        <a-form-model-item ref="parentId" label="物料类别" prop="parentId">
          <a-tree-select
            v-model="form.parentId"
            style="width: 100%"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :loadData="onLoadData"
            :tree-data="treeData"
            @select="handleClick"
          />
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>
<script>
import { routineMaterialInfoTwoTierTreeList, routineMaterialInfoPageList } from '@/api/routineMaterial'
import moment from 'moment'
export default {
  components: {},
  data() {
    return {
      visibles: false,
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      dataSource: [],
      queryParam: {},
      other: '',
      form: {
        parentId: undefined,
        specificationsList: [], //动态加载节点下的菜单
      },
      rules: {
        parentId: [{ required: true, message: '请选择分类' }],
      },
      treeData: [],
      dataList: [],
      spinning: false,
      tip: '数据处理中...',
    }
  },
  computed: {},

  methods: {
    moment,
    handleOk() {
      this.dataSource = this.dataSource.map((i) => {
        return {
          materialId: i.id,
          materialCode: i.materialCode,
          materialName: i.materialName,
          specification: i.specification,
          manageBrands: [],
          needCheck: i.needCheck,
        }
      })
      this.$emit('filet', this.dataSource)
      this.visibles = false
    },
    handleCancel() {
      this.treeData = []
      this.form = {}
      this.visibles = false
    },
    init(type, record) {
      const that = this
      this.treeData = []
      this.form = {}
      this.visibles = true
      routineMaterialInfoTwoTierTreeList({ parentId: 0 })
        .then((res) => {
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
          that.treeData = [root]
          if (String(that.parentId) === '0') {
            that.parentItem = root
          }
        })
        .catch((err) => {
          that.$message.error(`调用接口[routineMaterialInfoTwoTierTreeList]时发生错误，错误信息:${err}`)
        })
    },
    //格式化接口数据 key,title,value
    formatTreeData(item) {
      let that = this
      let obj = {}
      obj.key = String(item.id)

      let ruleName = item.newRuleName || item.ruleName
      let showCode = +item.isSpecification === 1 ? '' : `(${item.code})`
      obj.title = `${ruleName}${showCode}`

      obj.value = String(item.id)
      // obj.isLeaf = !(Array.isArray(item.subList) && item.subList.length > 0)
      obj.parentId = item.parentId
      obj.codeLength = +item.codeLength
      obj.code = item.code
      obj.scopedSlots = { title: 'title' }
      //obj.__selectable = obj.isLeaf
      if (Array.isArray(item.subList) && item.subList.length > 0) {
        obj.children = item.subList.map((v) => that.formatTreeData(v))
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
    search(params = {}) {
      const that = this
      let paginationParam = {
        current: 1,
        size: 100,
        auditStatus: 3,
        isForbidden: 2,
      }
      that.loading = true
      let _searchParam = Object.assign({}, { ...that.queryParam }, paginationParam, params)
      routineMaterialInfoPageList(_searchParam)
        .then((res) => {
          that.loading = false
          if (!(res && res.data && res.data.records && Array.isArray(res.data.records))) {
            return
          }
          that.dataSource = res.data.records
        })
        .catch((err) => {
          console.error(err)
          that.loading = false
        })
    },
    handleClick(selectedKeys, e) {
      const that = this
      that.queryParam = { ruleId: selectedKeys === '0' ? undefined : selectedKeys }
      that.search()
    },
    onLoadData(treeNode) {
      const that = this
      return new Promise((resolve) => {
        if (treeNode.dataRef.children) {
          resolve()
          return
        }
        routineMaterialInfoTwoTierTreeList({ parentId: treeNode.dataRef.value })
          .then((res) => {
            treeNode.dataRef.children = res.data.map((item) => that.formatTreeData(item))
            that.treeData = [...that.treeData]
            that.dataList = that.generateList(that.treeData)
            resolve()
          })
          .catch((err) => {
            that.$message.error(`调用接口[routineMaterialInfoTwoTierTreeList]时发生错误，错误信息:${err}`)
          })
      })
    },
  },
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
