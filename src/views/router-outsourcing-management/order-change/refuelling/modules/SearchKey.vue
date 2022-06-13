<template>
  <a-form layout="inline">
    <a-form-item label="申请车间">
      <DepartmentSelect
        allowClear
        show-search
        placeholder="选择部门"
        :depId.sync="searchParam.applyDepartmentId"
        style="width: 140px"
      />
    </a-form-item>

    <a-form-item label="选择物料">
      <MaterialFuzzySearch style="width:250px;" @change="onMaterialChange" />
    </a-form-item>
    <!-- 审批状态：1待提交 2待审批，3通过，4不通过，5已撤回 -->
    <a-form-item v-if="+activeKey === 0" label="审批状态">
      <a-select
        placeholder="请选择审批状态"
        v-model="searchParam.approveStatus"
        style="width:150px;"
        :allowClear="true"
      >
        <a-select-option :value="1">待提交</a-select-option>
        <a-select-option :value="2">待审批</a-select-option>
        <a-select-option :value="3">通过</a-select-option>
        <a-select-option :value="4">不通过</a-select-option>
        <a-select-option :value="5">已撤回</a-select-option>
      </a-select>
    </a-form-item>

    <a-form-item>
      <a-select placeholder="检索类型" v-model="searchParam.proIndex">
        <a-select-option v-for="item in proArr" :key="item.tag" :value="item.tag">{{ item.title }}</a-select-option>
      </a-select>
    </a-form-item>

    <a-form-item>
      <a-input
        placeholder="请输入关键词模糊检索"
        v-model="searchParam.parameter"
        style="width:250px;"
        :allowClear="true"
      />
    </a-form-item>
    <a-form-item>
      <a-button type="text" @click="onClean" style="margin-right:10px;">清除</a-button>
      <a-button type="primary" icon="search" @click="searchAction">查询</a-button>
      <a-button type="text" @click="onAdd" style="margin-left:10px;">测试新增</a-button>
    </a-form-item>
  </a-form>
</template>

<script>
import DepartmentSelect from '@/components/CustomerList/DepartmentSelect' //生产车间
import MaterialFuzzySearch from '@/components/CustomerList/MaterialFuzzySearch'

export default {
  name: 'outsourcing-search',
  components: {
    DepartmentSelect,
    MaterialFuzzySearch
  },
  props: {
    activeKey: {
      type: Number,
      required: true,
      default: 0
    },
    proArr: {
      type: Array,
      require: true,
      default: () => [
        {
          key: 'needCode',
          title: '需求单号',
          tag: 1
        },
        {
          key: 'materialName',
          title: '物料名称',
          tag: 2
        },
        {
          key: 'applyCode',
          title: '换料单号',
          tag: 3
        }
      ]
    }
  },
  data() {
    return {
      searchParam: {
        proIndex: 1, //标示根据什么模糊检索
        needCode: undefined, //需求单单号
        applyCode: undefined, //换料单单号
        createdDepartmentId: undefined, //部门id
        materialId: undefined, //物料id
        materialName: undefined, //物料名称
        approveStatus: undefined //审批状态：1待提交 2待审批，3通过，4不通过，5已撤回
      }
    }
  },
  methods: {
    //选择物料
    onMaterialChange(item) {
      console.log('选择物料：', item)
      this.searchParam = {
        ...this.searchParam,
        materialId: item ? item.materialId : undefined,
        materialName: item ? item.materialName : undefined
      }
    },
    //清空筛选条件
    onClean() {
      this.searchParam = {}
      this.$emit('clean')
    },
    //搜索
    searchAction() {
      this.$emit('search', this.searchParam)
    },
    //测试新增
    onAdd() {
      this.$emit('add')
    }
  }
}
</script>
