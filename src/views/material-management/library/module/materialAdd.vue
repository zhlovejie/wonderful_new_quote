<template>
  <div>
    <a-spin :spinning="spinning" :tip="tip">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" class="routine-addform-wrapper-step1">
        <a-form-model-item ref="parentId" label="位置/名称" prop="parentId">
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
  </div>
</template>
<script>
import {
  routineMaterialRulePageTwoTierTreeList,
  routineMaterialInfoTwoTierTreeList,
  routineMaterialInfoCheckCode,
  routineMaterialInfoCheckName,
} from '@/api/routineMaterial'
import moment from 'moment'
import { customUpload } from '@/api/common'
export default {
  inject: ['normalAddForm'],
  components: {
    VueQr,
  },
  data() {
    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      other: '',
      form: {
        parentId: undefined,
        specificationsList: [], //动态加载节点下的菜单
      },
      rules: {
        parentId: [{ required: true, message: '请选择位置/名称' }],
      },
      treeData: [],
      dataList: [],
      spinning: false,
      tip: '数据处理中...',
    }
  },
  computed: {},
  created() {
    this.$nextTick(() => this.init())
  },
  methods: {
    moment,
    async init(type, record) {
      const that = this
      that.form = that.normalAddForm.submitParams
      that.type = type
      if (that.normalAddForm && that.normalAddForm.detail) {
        let { __treeData } = that.normalAddForm.detail
        that.treeData = __treeData
        // that.dataList = that.generateList(that.treeData)

        let __selectItem = that.normalAddForm.getSelectNode()
        that.form = { ...that.form, parentId: __selectItem.key }
        that.initSpecifications({ ...__selectItem })
      }
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
      let node = { ...e.dataRef }
      that.normalAddForm.selectNode = node
      ;(that.form = {
        ...that.form,
        texture: undefined,
        thickness: undefined,
        width: undefined,
        length: undefined,
      }),
        that.$nextTick(() => {
          that.initSpecifications(node)
        })
    },
    initSpecifications(node) {
      const that = this
      routineMaterialRulePageTwoTierTreeList({ parentId: node.value }).then((res) => {
        console.log(res)
        if (!res || res.code !== 200) {
          that.$message.info(`获取节点【名称：${node.title}-编号：${node.value}】的规格数据失败！`)
          return
        }

        //加载为规格型号的数据
        that.form = { ...that.form, specificationsList: res.data.filter((item) => item.isSpecification === 1) }
        // isSpecification
      })
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
