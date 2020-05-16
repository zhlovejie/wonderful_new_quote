<template>
  <div class="directory-wrapper">
    <a-row :gutter="24">
      <transition-group name="list" tag="div">
        <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" :xxl="8" v-for="dir in dirList" :key="dir.id">
          <DirectoryManagement :dir="dir" @finish="init()" />
        </a-col>
      </transition-group>
      <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" :xxl="8" v-if="$auth('files-management-list:addDir')">
        <div class="dir-add-wrapper">
          <a-button type="dashed" icon="plus" size="large" @click="doAction('add')">新建文件夹</a-button>
        </div>
      </a-col>
    </a-row>
    <AddDirectory ref="addDirectory" @finish="init()" />
  </div>
</template>
<script>
import { docDirList } from '@/api/files-management'
import DirectoryManagement from './DirectoryManagement'
import AddDirectory from './AddDirectory'
export default {
  name: 'files-management-list',
  components: {
    DirectoryManagement,
    AddDirectory
  },
  watch: {
    $route: {
      handler: function(to, from) {
        if (to.name === 'files-management-list') {
          this.init()
        }
      },
      immediate: true
    }
  },
  data() {
    return {
      dirList: []
    }
  },
  methods: {
    init() {
      let that = this
      docDirList().then(res => (that.dirList = res.data))
    },
    doAction(type, record) {
      let that = this
      if (type === 'add') {
        that.$refs.addDirectory.query()
      }
    }
  }
}
</script>
<style scoped>
.directory-wrapper {
  margin-top: -20px;
}
.dir-add-wrapper {
  padding: 20px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0 0 10px 0 rgba(34, 58, 156, 0.07);
  border-radius: 2px;
  border: 1px solid rgba(231, 233, 234, 1);
  margin-top: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 406.19px;
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