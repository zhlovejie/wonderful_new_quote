<template>
  <a-modal
    :title="tableTitle"
    :width="1000"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    v-model="visible"
    :footer="null"
    :maskClosable="false"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-row class="form-row" :gutter="24">
          <a-col :lg="12" :md="12" :sm="24">
            <a-form-item label="上级菜单">
              <a-input read-only="read-only" v-model="route.parentTitle" />
            </a-form-item>
          </a-col>
          <a-col :lg="12" :md="12" :sm="24">
            <a-form-item label="菜单名称">
              <a-input
                read-only="read-only"
                v-model="route.title"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="form-row" :gutter="24">
          <a-col :lg="12" :md="12" :sm="24">
            <a-form-item label="类型">
              <a-input read-only="read-only" v-if="route.type == 1" value="目录"/>
              <a-input read-only="read-only" v-if="route.type == 2" value="菜单"/>
              <a-input read-only="read-only" v-if="route.type == 3" value="按钮"/>
            </a-form-item>
          </a-col>
          <a-col :lg="12" :md="12" :sm="24">
            <a-form-item label="所属平台">
              <a-input read-only="read-only" v-if="route.deviceType == 1" value="PC"/>
              <a-input read-only="read-only" v-if="route.deviceType == 2" value="APP"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="form-row" :gutter="24">
          <a-col :lg="12" :md="12" :sm="24">
            <a-form-item label="编码">
              <a-input
                read-only="read-only"
                v-model="route.code"
              />
            </a-form-item>
          </a-col>
          <a-col v-if="isPCMenu && !isbutton" :lg="12" :md="12" :sm="24">
            <a-form-item label="路由地址">
              <a-input
                read-only="read-only"
                v-model="route.path"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row v-if="isPCMenu && !isbutton" class="form-row" :gutter="24">
          <a-col :lg="12" :md="12" :sm="24">
            <a-form-item label="路由名称">
              <a-input
                read-only="read-only"
                v-model="route.name"
              />
            </a-form-item>
          </a-col>
          <a-col :lg="12" :md="12" :sm="24">
            <a-form-item label="路由相对路径">
              <a-input
                read-only="read-only"
                v-model="route.redirect"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row v-if="!isbutton" class="form-row" :gutter="24">
          <a-col v-if="isPCMenu" :lg="12" :md="12" :sm="24">
            <a-form-item label="组件">
              <a-input
                read-only="read-only"
                v-model="route.component"
              />
            </a-form-item>
          </a-col>
          <a-col v-if="isPCMenu" :lg="12" :md="12" :sm="24">
            <a-form-item label="图标">
              <a-input read-only="read-only" v-model="route.icon" />
            </a-form-item>
          </a-col>
          <a-col v-if="!isPCMenu" :lg="24" :md="24" :sm="24">
            <a-form-item label="图标">
              <img :src="route.icon" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row v-if="isPCMenu && !isbutton" class="form-row" :gutter="24">
          <a-col :lg="12" :md="12" :sm="24">
            <a-form-item label="是否缓存路由">
              <a-input read-only="read-only" v-if="route.keepAlive == 1" value="是"/>
              <a-input read-only="read-only" v-if="route.keepAlive == 0" value="否"/>
            </a-form-item>
          </a-col>
          <a-col :lg="12" :md="12" :sm="24">
            <a-form-item read-only="read-only" label="是否隐藏菜单">
              <a-input read-only="read-only" v-if="route.hidden == 1" value="是"/>
              <a-input read-only="read-only" v-if="route.hidden == 0" value="否"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="form-row" :gutter="24">
          <a-col v-if="isPCMenu && !isbutton" :lg="12" :md="12" :sm="24">
            <a-form-item read-only="read-only" label="隐藏 PageHeader 组件中的页面带的 面包屑和页面标题栏">
              <a-input read-only="read-only" v-if="route.hiddenHeaderContent == 1" value="是"/>
              <a-input read-only="read-only" v-if="route.hiddenHeaderContent == 0" value="否"/>
            </a-form-item>
          </a-col>
          <a-col :lg="12" :md="12" :sm="24">
            <a-form-item label="序号">
              <a-input read-only="read-only" v-model="route.sort"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="form-row" :gutter="24">
          <a-col :lg="24" :md="24" :sm="24">
            <a-form-item label="状态">
              <a-input read-only="read-only" v-if="route.status == 1" value="启用"/>
              <a-input read-only="read-only" v-if="route.status == 0" value="禁用"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>
<script>

export default {
  name: 'MenuView',
  data () {
    return {
      form: this.$form.createForm(this),
      confirmLoading: false, // 加载图标
      isPCMenu: true,
      isbutton: false, // 是否为按钮
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      visible: false,
      tableTitle: '', // 表单标题
      route: {}
    }
  },
  methods: {
    show (route) {
      // 父页面点击新增调用
      this.tableTitle = '菜单详情'
      this.visible = true
      this.route = route
      if (route.deviceType === 2) {
        this.isPCMenu = false
      }
      if (route.type === 3) {
        this.isbutton = true
      }
    },
    handleCancel () {
      this.isPCMenu = true
      this.visible = false
      this.isbutton = false
      this.form.resetFields()
    }
  }
}
</script>
