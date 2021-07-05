<script>
/**
 * @description 横向渲染产品树
 * @author bean
 * @since 2021/07/03
 */
export default {
  name: 'OptConfigTree',
  props: {
    nodeList: {
      type: Array,
      default: () => []
    }
  },
  render(h) {
    const that = this
    const list = this.nodeList.map(node => {
      return h('div', { class: { 'opt-config-tree-item': true } }, [that.nodeFormat(node)])
    })
    return h('div', { class: { 'opt-config-tree-wrapper': true } }, list)
  },
  methods: {
    nodeFormat(node) {
      const that = this
      const h = that.$createElement
      const fNode = obj => {
        const isTag = obj.configType === 1
        const vnode = isTag
          ? h('div', { style: { display: 'inline-block' } }, [])
          : h('table', null, [h('tr', null, [])])
        const arr = []
        if (obj && obj.children) {
          for (let i = 0, len = obj.children.length; i < len; i++) {
            arr.push(fNode(obj.children[i]))
          }
        }

        const tagName = isTag ? 'span' : 'td'
        const tagStyle = isTag ? { display: 'inline-block' } : { width: '25%' }
        const subVnodeList = [h(tagName, { style: tagStyle }, that.$scopedSlots.default(obj))]
        if (arr.length > 0) {
          subVnodeList.push(h(tagName, null, arr))
        }
        if (isTag) {
          vnode.children = subVnodeList
        } else {
          vnode.children[0].children = subVnodeList
        }
        return vnode
      }
      return fNode(node)
    }
  }
}
</script>
<style scoped>
.opt-config-tree-wrapper {
  overflow-y: auto;
}
.opt-config-tree-wrapper .opt-config-tree-item:first-child {
  margin-top: 0;
}
.opt-config-tree-wrapper .opt-config-tree-item {
  position: relative;
  margin-top: -1px;
}
.opt-config-tree-wrapper table {
  width: 100%;
  border-collapse: collapse;
}
.opt-config-tree-wrapper table table {
  margin: -2px;
  width: calc(100% + 4px);
}
.opt-config-tree-wrapper table td {
  border: 1px solid #ccc;
}
</style>
