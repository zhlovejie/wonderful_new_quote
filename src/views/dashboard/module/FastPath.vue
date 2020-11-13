<template>
  <a-modal
    :title="modalTitle"
    :width="650"
    :visible="visible"
    :destroyOnClose="true"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <a-spin :spinning="spinning">
      <a-form>
        <a-form-item label="选择快捷菜单">
          <a-tree-select
            style="width: 100%;"
            v-model="value"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :tree-data="treeData"
            tree-checkable
            @change="changeAction"
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>
<script>
import { TreeSelect } from "ant-design-vue";

export default {
  data() {
    return {
      modalTitle: "选择快捷菜单",
      visible: false,
      spinning:false,
      treeData: [],
      value: [],
      selectList: [],
    };
  },
  created() {
    
  },
  methods: {
    query(vals = []) {
      let that = this;
      that.visible = true;
      that.spinning = true
      that.treeData = that.formatData(that.$ls.get('USER_ROUTERS',[]));
      that.$nextTick(() => {
        that.value = vals
        that.spinning = false
      });
    },
    handleSubmit() {
      let res = this.value.map((val) => this.findNodeByKey(this.treeData, val));
      this.$emit("change", res);
      this.$nextTick(() => (this.visible = false));
    },
    handleCancel() {
      this.value = [];
      this.visible = false;
    },
    formatData(arr) {
      let format = (data) => {
        let _data = [...data];
        _data = _data.map((item) => {
          return {
            key: item.id,
            value: item.id,
            title: item.title,
            parentId: item.parentId,
            routeName: item.name,
            children:
              Array.isArray(item.children) && item.children.length > 0
                ? format(item.children)
                : [],
          };
        });
        return _data;
      };
      return format(arr);
    },
    changeAction(arrVal, arrTitle, extra) {
      this.value = [...arrVal];
    },
    findNodeByKey(node, key) {
      //查找指定key的节点
      let res = null;
      let fNode = (obj) => {
        if (obj.key === key) {
          return obj;
        }
        if (obj && obj.children) {
          for (let i = 0, len = obj.children.length; i < len; i++) {
            res = fNode(obj.children[i]);
            if (res !== null) {
              return { ...res };
            }
          }
        }
        return null;
      };

      for (let i = 0, len = node.length; i < len; i++) {
        res = fNode(node[i]);
        if (res !== null) {
          return { ...res };
        }
      }

      return null;
    },
  },
};
</script>
