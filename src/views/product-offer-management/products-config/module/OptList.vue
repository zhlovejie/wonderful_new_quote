<template>
  <div class="opt-list-wrapper" v-if="optStandDragList.length > 0">
    <div class="opt_header_wrapper">
      <div class="draggable-columns draggable-columns-1">序号</div>
      <div class="draggable-columns draggable-columns-2">配置名称</div>
      <div class="draggable-columns draggable-columns-3">
        <a-icon type="close-circle" @click="doAction('del',null)" />
      </div>
    </div>
    <vuedraggable
      class="opt_main_wrapper"
      ghost-class="ghost"
      v-model="optStandDragList"
      @end="dragEndHandler"
    >
      <transition-group name="list">
        <div v-for="(item) in optStandDragList" :key="item.id" class="draggable-columns-item">
          <div class="draggable-columns draggable-columns-1">{{item.serialNum}}</div>
          <div class="draggable-columns draggable-columns-2">{{item.itemName}}</div>
          <div class="draggable-columns draggable-columns-3" title="删除">
            <a-icon type="close-circle" @click="doAction('del',item.key)" />
          </div>
        </div>
      </transition-group>
    </vuedraggable>
    <a-form-item v-if="showRequire" style="margin-bottom:0;">
      <a-checkbox v-model="isRequire">是否必选项</a-checkbox>
    </a-form-item>
  </div>
</template>
<script>
import vuedraggable from 'vuedraggable'
export default {
  name: 'OptList',
  components: {
    vuedraggable
  },
  props: {
    dataSource: {
      type: Array,
      default: () => []
    },
    showRequire: {
      type: Boolean,
      default: () => false
    }
  },
  watch: {
    dataSource() {
      this.init()
    }
  },
  data() {
    return {
      optStandDragList: [],
      isRequire: false
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.optStandDragList = (this.dataSource || []).map(item => Object.assign({}, item))
      if(this.optStandDragList.length > 0){
        this.isRequire = this.optStandDragList[0].isRequire || false
      }
      this.reSortAction()
    },
    doAction(type, key) {
      if (type === 'del') {
        if (key === null) {
          this.optStandDragList = []
        } else {
          this.optStandDragList = this.optStandDragList.filter(item => item.key !== key)
          this.reSortAction()
        }
      }
      this.$emit('change',this.optStandDragList)
    },
    reSortAction() {
      this.optStandDragList = this.optStandDragList.map((p, index) => {
        let item = Object.assign({}, p)
        item.serialNum = index + 1
        return item
      })
    },
    dragEndHandler() {
      console.log(arguments)
      this.$nextTick(() => {
        this.reSortAction()
        this.$emit('change',this.optStandDragList)
      })
    },
    getData() {
      let that = this
      return that.optStandDragList.map(item =>{
          let _item = Object.assign({},item)
          _item.isRequire = that.isRequire
          return _item
        })
    }
  }
}
</script>
<style scoped>
.opt_tips {
  background-color: #f5f5f5;
}
.opt_header_wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
  font-weight: 700;
  border: 1px solid #ddd;
}
.opt_header_wrapper .draggable-columns-2 {
  flex: 1;
}
.opt_main_wrapper {
  border: 1px solid #ddd;
}
.opt_main_wrapper .draggable-columns-item {
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #ddd;
}
.opt_main_wrapper .draggable-columns-item:last-child {
  border-bottom: none;
}
.opt_main_wrapper .draggable-columns-2 {
  flex: 1;
}
.draggable-columns {
  text-align: center;
  line-height: 28px;
  cursor: move;
}
.draggable-columns-1,
.draggable-columns-3 {
  width: 50px;
}
.draggable-columns-3 {
  cursor: pointer;
}
.ghost {
  background-color: rgba(250, 235, 215, 0.5);
}

/*过渡动画*/
.list-enter-active,
.list-leave-active {
  transition: all 0.5s;
}
.list-enter,
.list-leave-to {
  opacity: 0;
  transform: translateX(-5%);
}
.list-move {
  transition: transform 0.3s;
}
</style>