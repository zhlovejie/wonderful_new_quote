<template>
  <a-modal
    :title="tableTitle"
    :width="1000"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    v-model="visible"
    :maskClosable="false"
  >
    <div v-if="showCheckbox">
      所属平台：
      <a-radio-group @change="dtypeChange">
        <a-radio :value="1">PC</a-radio>
        <a-radio :value="2">APP</a-radio>
      </a-radio-group>
    </div>
    <a-spin v-if="showForm" :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="父级ID" hidden>
          <a-input v-decorator="['parentId', { initialValue: parentId}]" />
        </a-form-item>
        <a-form-item label="所属平台：" hidden>
          <a-input v-decorator="['deviceType', { initialValue: deviceType}]" />
        </a-form-item>
        <a-form-item label="ID" hidden>
          <a-input v-decorator="['id']" />
        </a-form-item>
        <a-row class="form-row" :gutter="24">
          <a-col :lg="12" :md="12" :sm="24">
            <a-form-item label="上级菜单">
              <a-input read-only="read-only" v-decorator="['parentTitle', { initialValue: parentTitle}]" />
            </a-form-item>
          </a-col>
          <a-col :lg="12" :md="12" :sm="24">
            <a-form-item label="菜单名称">
              <a-input
                v-decorator="['title',{rules: [{required: true, min: 2, message: '菜单名称最少为2个字符！'}]}]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="form-row" :gutter="24">
          <a-col v-if="addOredit == 'save'" :lg="12" :md="12" :sm="24">
            <a-form-item label="类型">
              <a-radio-group @change="changeType" v-decorator="['type', { initialValue: 2 }]">
                <a-radio :value="1">目录</a-radio>
                <a-radio :value="2">菜单</a-radio>
                <a-radio :value="3">按钮</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col v-if="addOredit != 'save'" :lg="12" :md="12" :sm="24">
            <a-form-item label="类型">
              <a-input read-only="read-only" v-if="menuType == 1" value="目录"/>
              <a-input read-only="read-only" v-if="menuType == 2" value="菜单"/>
              <a-input read-only="read-only" v-if="menuType == 3" value="按钮"/>
            </a-form-item>
          </a-col>
          <a-col :lg="12" :md="12" :sm="24">
            <a-form-item label="所属平台">
              <a-input read-only="read-only" v-if="deviceType == 1" value="PC"/>
              <a-input read-only="read-only" v-if="deviceType == 2" value="APP"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="form-row" :gutter="24">
          <a-col :lg="12" :md="12" :sm="24">
            <a-form-item label="编码">
              <a-input @blur="checkCode()" v-decorator="['code', {rules: [{required: true, min: 3, message: '编码最少为3个字符！'}]}]"/>
            </a-form-item>
          </a-col>
          <a-col v-if="isPCMenu && !isbutton" :lg="12" :md="12" :sm="24">
            <a-form-item label="路由地址">
              <a-input
                v-decorator="['path', {rules: [{required: true, min: 5, message: '路由地址最少为5个字符！'}]}]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row v-if="isPCMenu && !isbutton" class="form-row" :gutter="24">
          <a-col :lg="12" :md="12" :sm="24">
            <a-form-item label="路由名称">
              <a-input
                @blur="checkName()"
                v-decorator="['name', {rules: [{required: true, min: 2, message: '路由名称最少为2个字符！'}]}]"
              />
            </a-form-item>
          </a-col>
          <a-col :lg="12" :md="12" :sm="24">
            <a-form-item label="路由相对路径">
              <a-input
                v-decorator="['redirect', {rules: [{required: false, min: 5, message: '路由相对路径最少为5个字符！'}]}]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row v-if="!isbutton" class="form-row" :gutter="24">
          <a-col v-if="isPCMenu" :lg="12" :md="12" :sm="24">
            <a-form-item label="组件">
              <a-input
                v-decorator="['component', {rules: [{required: false, min: 5, message: '组件最少为5个字符！'}]}]"
              />
            </a-form-item>
          </a-col>
          <a-col v-if="isPCMenu" :lg="12" :md="12" :sm="24">
            <a-form-item label="图标">
              <a-input v-decorator="['icon']" />
            </a-form-item>
          </a-col>
          <a-col v-if="!isPCMenu" :lg="24" :md="24" :sm="24">
            <a-form-item label="图标">
              <div class="clearfix">
                <a-upload
                  accept="multiple"
                  name="files"
                  :action="this.uploadPath"
                  listType="picture-card"
                  :fileList="fileList"
                  @preview="handlePreview"
                  @change="handleChange"
                >
                  <div v-if="fileList.length < 1">
                    <a-icon type="plus" />
                    <div class="ant-upload-text">选择图片</div>
                  </div>
                </a-upload>
                <a-modal :visible="previewVisible" :footer="null" @cancel="previewCancel">
                  <img alt="图片" style="width: 100%" :src="previewImage" />
                </a-modal>
              </div>
              <a-input type="hidden" v-decorator="['icon', {rules: [{required: false,message: '请上图标！'}]}]"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row v-if="isPCMenu && !isbutton" class="form-row" :gutter="24">
          <a-col :lg="12" :md="12" :sm="24">
            <a-form-item label="是否缓存路由">
              <a-radio-group v-decorator="['keepAlive', { initialValue: 0 }]">
                <a-radio :value="1">是</a-radio>
                <a-radio :value="0">否</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :lg="12" :md="12" :sm="24">
            <a-form-item label="是否隐藏菜单">
              <a-radio-group v-decorator="['hidden', { initialValue: 0 }]">
                <a-radio :value="1">是</a-radio>
                <a-radio :value="0">否</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="form-row" :gutter="24">
          <a-col v-if="isPCMenu && !isbutton" :lg="12" :md="12" :sm="24">
            <a-form-item label="隐藏 PageHeader 组件中的页面带的 面包屑和页面标题栏">
              <a-radio-group v-decorator="['hiddenHeaderContent', { initialValue: 1 }]">
                <a-radio :value="1">是</a-radio>
                <a-radio :value="0">否</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :lg="12" :md="12" :sm="24">
            <a-form-item label="序号">
              <a-input v-decorator="['sort']" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="form-row" :gutter="24">
          <a-col :lg="24" :md="24" :sm="24">
            <a-form-item label="状态">
              <a-radio-group v-decorator="['status',{ initialValue: 1 }]">
                <a-radio :value="1">启用</a-radio>
                <a-radio :value="0">禁用</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { updateRoute, saveRoute, getById, checkCode, checkName } from '@/api/system/menu'
import { getUploadPath } from '@/api/common'

export default {
  name: 'CreateMenu',
  data () {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      uploadPath: getUploadPath(), // 上传图片的url
      previewVisible: false, // 图片预览框是否可见
      previewImage: '', //  预览图片的src值
      fileList: [], // 图片文件集合
      showCheckbox: true, // 是否展示所属平台展示框
      showForm: false, // 是否展示form
      isPCMenu: true, // pc还是app菜单的标记
      isbutton: false, // 是否为按钮
      menuType: 1, // 菜单类型默认为目录
      checkedType: false, // 是否选择的平台类型
      deviceType: 1, // 平台类型，默认为1pc
      visible: false,
      confirmLoading: false, // 加载图标
      tableTitle: '', // 表单标题
      addOredit: 'save', // 新增或修改的标记
      parentTitle: '', // 父级菜单标题
      rId: 0,
      parentId: 0
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  methods: {
    checkCode () { // 判断是否有重复编码
      var param = {}
      if (this.form.getFieldValue('code') === undefined || this.form.getFieldValue('code').length < 1) {
        return
      }
      param = { id: this.rId, code: this.form.getFieldValue('code') }
      checkCode(param).then(res => {
        if (res.code === 600) {
          this.form.setFields({ 'code': { value: '', errors: [{ 'message': res.msg, 'field': 'name' }] } })
        }
      })
    },
    checkName () { // 判断是否有重复的路由名
      var param = {}
      if (this.form.getFieldValue('name') === undefined || this.form.getFieldValue('name').length < 1) {
        return
      }
      param = { id: this.rId, name: this.form.getFieldValue('name') }
      checkName(param).then(res => {
        if (res.code === 600) {
          this.form.setFields({ 'name': { value: '', errors: [{ 'message': res.msg, 'field': 'name' }] } })
        }
      })
    },
    changeType (e) { // 改变菜单类型
      if (e.target.value === 3) { // 按钮
        this.isbutton = true
      } else {
        this.isbutton = false
      }
    },
    handlePreview (file) { // 点击文件链接或预览图标时的回调
      this.previewImage = file.url || file.thumbUrl
      this.previewVisible = true
    },
    previewCancel () {
      this.previewVisible = false
    },
    handleChange ({ file, fileList }) { // 上传中、完成、失败都会调用这个函数。
      if (file != null && file.status === 'done') { // 状态有：uploading done error removed
        if (file.response.code === 200) { // 成功
          this.form.setFieldsValue({ icon: file.response.data[0].url })
        }
      } else if (file.status === 'removed') { // 删除清空
        this.form.setFieldsValue({ icon: '' })
      }
      this.fileList = fileList // 展示照片墙
    },
    dtypeChange (e) {
      if (e.target.value === 2) { // app菜单
        this.isPCMenu = false
        this.deviceType = 2
      }
      this.showCheckbox = false
      this.showForm = true
      this.checkedType = true
    },
    add (parentId) {
      // 父页面点击新增调用
      this.tableTitle = '新增菜单'
      this.visible = true
      this.addOredit = 'save'
      if (parentId === 0) {
        this.parentTitle = '无'
        this.parentId = 0
      } else {
        this.showForm = true
        this.showCheckbox = false
        getById({ id: parentId }).then(res => {
          if (res.code === 200) {
            if (res.data != null && res.data !== undefined) {
              this.parentTitle = res.data.title
              this.parentId = res.data.id
              if (res.data.deviceType === 2) {
                this.isPCMenu = false
                this.deviceType = 2
              }
            }
          } else {
            this.$message.error(res.msg)
          }
        })
      }
    },
    edit (route) {
      this.tableTitle = '修改菜单'
      this.rId = route.id
      const parentId = route.parentId
      if (parentId === 0) {
        this.parentTitle = '无'
        this.parentId = 0
      } else {
        getById({ id: parentId }).then(res => {
          if (res.code === 200) {
            if (res.data != null && res.data !== undefined) {
              this.parentTitle = res.data.title
              this.parentId = res.data.id
            }
          } else {
            this.$message.error(res.msg)
          }
        })
      }
      var deviceType = route.deviceType
      if (deviceType === 2) {
        this.isPCMenu = false
        if (route.icon != null && route.icon.length > 0) {
          this.fileList[0] = {
            uid: '-1',
            name: 'xxx.png',
            status: 'done',
            'url': route.icon
          } // 图片预览缩略图
        }
      }
      var mType = route.type
      if (mType === 3) { // 按钮
        this.isbutton = true
      } else {
        this.isbutton = false
      }
      this.menuType = mType
      this.deviceType = deviceType
      this.showCheckbox = false
      this.showForm = true
      this.addOredit = 'edit'
      this.visible = true
      this.checkedType = true
      this.$nextTick(() => {
        this.form.setFieldsValue({ ...route })
      })
    },
    handleOk () { // 提交
      if (!this.checkedType && this.parentId === 0) {
        this.$message.error('请先选择所属平台！')
        return false
      }
      // 触发表单验证
      this.form.validateFields((err, values) => {
        // 验证表单没错误
        if (!err) {
          this.confirmLoading = true
          if (this.addOredit === 'save') {
            saveRoute(values).then(res => {
              if (res.code === 200) {
                this.handleCancel()
                this.$emit('ok')
                this.$message.success('保存成功')
              } else {
                this.$message.error(res.msg)
              }
            })
          } else if (this.addOredit === 'edit') {
            updateRoute(values).then(res => {
              if (res.code === 200) {
                this.handleCancel()
                this.$emit('ok')
                this.$message.success('保存成功')
              } else {
                this.$message.error(res.msg)
              }
            })
          }
          this.confirmLoading = false
        }
      })
    },
    handleCancel () { // 关闭页面
      this.deviceType = 1 // 平台类型，默认为1pc
      this.menuType = 1 // 菜单类型 默认为1目录
      this.showCheckbox = true
      this.isbutton = false
      this.showForm = false
      this.isPCMenu = true
      this.parentTitle = ''
      this.parentId = 0
      this.checkedType = false
      this.form.resetFields()
      this.previewVisible = false // 图片预览框是否可见
      this.previewImage = '' //  预览图片的src值
      this.fileList = [] // 图片文件集合
      this.visible = false
    }
  }
}
</script>
<style>
  /* you can make up upload button and sample style by using stylesheets */
  .ant-upload-select-picture-card i {
    font-size: 32px;
    color: #999;
  }

  .ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
  }
</style>
