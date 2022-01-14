<template>
  <div style="padding:0 20px;">
    <a-select
      show-search
      :value="value"
      placeholder="菜单搜索..."
      style="width: 100%"
      :default-active-first-option="false"
      :show-arrow="false"
      :filter-option="false"
      :not-found-content="null"
      @search="handleSearch"
      @change="handleChange"
    >
      <a-select-option v-for="d in data" :key="d.name" :value="d.__idx">
        {{ d.title }}
      </a-select-option>
    </a-select>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dataSource: [],
      data: [],
      value: undefined
    }
  },
  mounted() {
    this.dataSource = this.generateList(this.$ls.get('USER_ROUTERS', []))
  },
  methods: {
    handleSearch(value) {
      const that = this
      const data = []
      that.dataSource.map((item, idx) => {
        if (String(item.title).indexOf(value) !== -1) {
          data.push({
            ...item,
            __idx: idx
          })
        }
      })
      that.data = data
    },
    handleChange(idx) {
      console.log(idx)
      let item = this.dataSource[idx]
      this.value = item.title
      this.$router.push({ name: item.name })
    },
    generateList(data) {
      let arr = []
      for (let i = 0; i < data.length; i++) {
        const node = data[i]
        const { title, name, path, children } = node
        arr.push({ title, name, path, isLeaf: Array.isArray(children) && children.length === 0 })
        if (node.children) {
          arr.push(...this.generateList(node.children))
        }
      }
      // 只保存叶子节点
      return arr.filter(item => item.isLeaf)
    }
  }
}
</script>
