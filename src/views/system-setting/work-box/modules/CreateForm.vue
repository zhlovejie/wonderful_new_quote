<template>
  <a-modal
    :title="title"
    :width="940"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="产品代码" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input @blur="checkName(2)" v-decorator="['productModel',{rules: [{required: true, min: 1, message: '产品代码不可为空！'}]}]"/>
        </a-form-item>
        <a-form-item label="名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input @blur="checkName(1)" v-decorator="['productName',{rules: [{required: true, min: 1, message: '名称不可为空！'}]}]"/>
        </a-form-item>
        <a-form-item label="全名" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input  v-decorator="['fullName',{rules: [{required: true, min: 1, message: '全名不可为空！'}]}]"/>
        </a-form-item>
        <a-form-item label="产品类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select placeholder="请选择产品类型" v-decorator="['productType',{rules: [{required: true, message: '请选择产品类型！'}]}]">
            <a-select-option v-for="ptype in productTypes" :key="ptype.id" :value="ptype.id">{{ ptype.text }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="区域" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-tree-select
            :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
            :treeData="treeData"
            placeholder="选择区域"
            v-decorator="['area',{rules: [{required: true, message: '选择区域'}]}]"
          >
          </a-tree-select>
        </a-form-item>
        <a-form-item label="是否是常规系列" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select placeholder="请选择是否是常规系列" v-decorator="['seriesFlag',{rules: [{required: true, message: '请选择是否是常规系列！'}],initialValue: 0}]">
            <a-select-option :value="0">否</a-select-option>
            <a-select-option :value="1">是</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="状态" v-if="subType == 'add'" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select placeholder="请选择状态" v-decorator="['status',{rules: [{required: true, message: '请选择状态！'}],initialValue: 0}]">
            <a-select-option :value="0">启用</a-select-option>
            <a-select-option :value="1">禁用</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="规格" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-textarea placeholder="请输入规格尺寸" v-decorator="['productStandard',{rules: [{required: true, message: '请输入规格尺寸！'}]}]"/>
        </a-form-item>
        <a-form-item label="图片" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-alert message="提示" type="warning" show-icon style="margin-bottom:5px;">
            <div slot="description">
              <div>上传的第一张图片将作为产品封面图片来展示</div>
            </div>
          </a-alert>
          <div class="clearfix">
            <a-upload accept="multiple" name="file"
              :action="uploadPath"
              listType="picture-card"
              :fileList="fileList"
              @preview="handlePreview"
              @change="handleChange"
              :beforeUpload="handleBeforeUpload"
            >
              <div v-if="fileList.length < 10">
                <a-icon type="plus" /><div class="ant-upload-text">选择图片</div>
              </div>
            </a-upload>
            <a-modal :visible="previewVisible" :width="1000" :footer="null" @cancel="previewCancel">
              <div style="overflow:auto;">
                <img alt="图片" style="width: auto;height:auto;max-height:1000px;" :src="previewImage" />
              </div>
            </a-modal>
          </div>
          <a-input type="hidden" v-decorator="['productPic', {}]"/>
        </a-form-item>

        <a-form-item label="是否在售" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-decorator="['isSale',{initialValue: 0}]">
            <a-radio :value="0">在售</a-radio>
            <a-radio :value="1">停产</a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item label="功能描述" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <vue-ueditor-wrap v-model="content" ref="ueditor" :config="myConfig"></vue-ueditor-wrap>
          <a-input type="hidden" v-decorator="['description', {rules: [{required: false,min: 5, message: '请填写功能描述！'}]}]"/>
        </a-form-item>
        <a-form-item label="产品说明书" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-upload
            name="files"
            :fileList="installList"
            :multiple="false"
            :action="uploadPath"
            :headers="headers"
            @change="installChange">
            <a-button>
              <a-icon type="upload" /> 点击上传
            </a-button>
          </a-upload>
          <a-input type="hidden" v-decorator="['installExplain', {rules: [{required: false,message: '请上传产品说明书！'}]}]"/>
        </a-form-item>
        <!--<a-form-item label="操作说明" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-upload
            name="files"
            :fileList="operateList"
            :multiple="false"
            :action="uploadPath"
            :headers="headers"
            @change="operateChange">
            <a-button>
              <a-icon type="upload" /> 点击上传
            </a-button>
          </a-upload>
          <a-input type="hidden" v-decorator="['operateExplain', {rules: [{required: false,message: '请上传操作说明！'}]}]"/>
        </a-form-item>-->
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { addProduct, editProduct, checkName ,queryTreeByArea} from '@/api/workBox'
import { getUploadPath2, getDictionary, getUeditorUploadPath ,customUpload} from '@/api/common'
import VueUeditorWrap from 'vue-ueditor-wrap'
import ATextarea from 'ant-design-vue/es/input/TextArea'

let uuid = () => `${Math.random().toString(32).slice(-6)}-${Math.random().toString(32).slice(-6)}`

export default {
  name: 'CreateForm',
  data () {
    return {
      title: '',
      // ueditor配置
      myConfig: {
        // 如果需要上传功能,找后端小伙伴要服务器接口地址
        // serverUrl: this.$config.baseUrl + 'ueditor/uploadImg',
        serverUrl: getUeditorUploadPath(),
        // 你的UEditor资源存放的路径,相对于打包后的index.html
        UEDITOR_HOME_URL: '/plugins/',
        // 编辑器不自动被内容撑高
        autoHeightEnabled: false,
        // 工具栏是否可以浮动
        autoFloatEnabled: false,
        // 初始容器高度
        initialFrameHeight: 340,
        // 初始容器宽度
        initialFrameWidth: '100%',
        // 关闭自动保存
        nableAutoSave: true
      },
      content: '',
      headers: {
        authorization: 'authorization-text'
      },
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 }
      },
      form: this.$form.createForm(this), // 只有这样注册后，才能通过表单拉取数据
      visible: false, // 表单对话框是否可见
      confirmLoading: false, // 确定按钮后是否显示加载图 loading
      layout: 'inline', // 表单布局方式
      productTypes: [],
      subType: 'add', // 新增还是修改的标记
      previewVisible: false, // 图片预览框是否可见
      previewImage: '', //  预览图片的src值
      fileList: [], // 已上传的图片文件列表
      installList: [], // 已上传的功能描述文件
      operateList: [], // 已上传的操作说明文件
      pId: 0,
      uploadPath: getUploadPath2(),
      areaValue:undefined, //区域绑定值
      treeData:[] //区域数据源
    }
  },
  components:
    {
      ATextarea,
      VueUeditorWrap
    },
  created (record) { // 初始化钩子,获取所有产品类型
    getDictionary({ text: '产品类型' }).then(res => {
      this.productTypes = res.data
    })
  },
  methods: {
    add () { // 父页面点击新增调用
      this.title = '新增产品信息'
      this.visible = true
      this.subType = 'add'
      this.fileList = []
      this.initArea()
    },
    async edit (record) { // 父页面点击修改调用
      this.title = '修改产品信息'
      this.visible = true
      this.subType = 'edit'
      this.fileList = []
      await this.initArea()


      this.pId = record.id
      const { form: { setFieldsValue } } = this
      this.$nextTick(() => {
        // setFieldsValue只有通过这种方式给表单赋值
        setFieldsValue({
          productName: record.productName,
          productModel: record.productModel,
          productStandard: record.productStandard,
          productType: record.productType,
          status: record.status,
          productPic: record.productPic,
          isSale:record.isSale,
          description: record.description,
          installExplain: record.installExplain,
          operateExplain: record.operateExplain,
          fullName: record.fullName,
          seriesFlag: record.seriesFlag,
          area:String(record.area)
        })
      })
      if(record.productPicOriginal === null && record.productPic !== null){
        record.productPicOriginal = JSON.stringify([{
          origin:record.productPic,
          thumb:record.productPic
        }])
      }


      if (record.productPicOriginal != null && record.productPicOriginal.length > 0) {
        let _arr = []
        let imgInfo = []
        try{
          imgInfo = JSON.parse(record.productPicOriginal)
        }catch(err){
          imgInfo = []
        }


        imgInfo.map(item =>{
          const picList = item.thumb.split('/')
          _arr.push( {
            uid: uuid(),
            name: picList[picList.length - 1],
            status: 'done',
            'url': item.thumb,
            __thumbURL:item.thumb,
            __originURL :item.origin
          })
        })

        this.fileList = _arr
      }
      if (record.installExplain != null && record.installExplain.length > 0) {
        const spl = record.installExplain.split('/')
        this.installList[0] = {
          uid: '-1',
          name: spl[spl.length - 1],
          status: 'done',
          'url': record.installExplain
        } // 安装说明
      }
      if (record.operateExplain != null && record.operateExplain.length > 0) {
        var olist = record.operateExplain.split('/')
        this.operateList[0] = {
          uid: '-1',
          name: olist[olist.length - 1],
          status: 'done',
          'url': record.operateExplain
        } // 操作说明
      }
      this.content = record.description
    },
    handleSubmit () {
      const that = this
      that.form.setFieldsValue({ description: that.content })
      const { form: { validateFields } } = that
      that.confirmLoading = true


      // 通过validateFields的方法，能够校验必填项是否有值，若无，则页面会给出警告！
      // 执行this.form.resetFields()，则会将表单清空。
      validateFields(async (errors, values) => {
        if (!errors) {
          //values.area = 143

          console.log(values)
          let ArrFilesInfo = []
          for(let file of that.fileList){
            if(file.__thumbURL && file.__originURL){
              ArrFilesInfo.push({
                origin:file.__originURL,
                thumb:file.__thumbURL
              })
            }else if(file.response && file.originFileObj){
              file.__thumbURL = await that.customUploadAction(file.originFileObj)
              file.__originURL = file.response.data
              ArrFilesInfo.push({
                origin:file.__originURL,
                thumb:file.__thumbURL
              })
            }
          }

          values.productPic = ArrFilesInfo.length > 0 ? ArrFilesInfo[0].thumb : ''
          values.productPicOriginal = JSON.stringify(ArrFilesInfo)

          console.log(values)
          // return

          if (this.subType === 'add') { // 新增
            addProduct(values).then(res => {
              if (res.code === 200) {
                this.handleCancel()
                this.$emit('ok')// 刷新父组件
              } else {
                this.$message.error(res.msg)
              }
            }).catch(function (err) {
              console.log(err)
            })
          } else if (this.subType === 'edit') { // 修改
            this.$set(values, 'id', this.pId)
            editProduct(values).then(res => {
              if (res.code === 200) {
                this.handleCancel()
                this.$emit('ok')// 刷新父组件
              } else {
                this.$message.error(res.msg)
              }
            }).catch(function (err) {
              console.log(err)
            })
          }
        }
        this.confirmLoading = false
      })
    },
    handleCancel () {
      this.fileList = []
      this.installList = []
      this.operateList = []
      this.content = ''
      this.form.resetFields() // 清空表
      this.visible = false
    },
    previewCancel () {
      this.previewVisible = false
    },
    handlePreview (file) { // 点击文件链接或预览图标时的回调
      let url = ''
      if(file.response){
        url = file.response.data
      }else{
        url = file.__originURL ? file.__originURL : file.thumbUrl
      }
      this.previewImage = ''
      this.previewVisible = true
      this.$nextTick(() =>{
        this.previewImage = url
      })
    },
    handleChange ({ file, fileList }) { // 上传中、完成、失败都会调用这个函数。
      // if (file != null && file.status === 'done') { // 状态有：uploading done error removed
      //   if (file.response.code === 200) { // 成功
      //     this.form.setFieldsValue({ productPic: file.response.data[0].url })
      //   }
      // }

      // if (file.status === 'removed') { // 删除清空
      //   this.form.setFieldsValue({ productPic: '' })
      // }

      this.fileList = fileList.map(item =>{
        let _uid = -Date.now()
        item.uid = item.uid || _uid
        if(item.originFileObj){
          item.originFileObj.uid = item.originFileObj.uid || _uid
        }
        return item
      }) // 展示照片墙

      // debugger
      let case1 =this.fileList
        .map(f => {
          let _case = f.response && f.response.code && f.response.code === 200 && Array.isArray(f.response.data) && f.response.data.length > 0
          return _case ? {...f.response.data[0]} : null
        })
        .filter(item => item !== null)
        .map(item => item.url)
        .join(',')
      let case2 = this.fileList.map(item => item && item.url ? item.url : '').join(',')
      // console.log(`case1:${case1}`)
      // console.log(`case2:${case2}`)
      this.form.setFieldsValue({ productPic: case1 || case2 })
    },
    installChange (info) {
      if (info.file.status === 'uploading' && this.installList.length >= 1) {
        this.$message.error(`只能上传一个文件！`)
        return
      }
      if (info.file.status === 'done') {
        this.$message.success(`${info.file.name} 上传完成`)
        if (info.file.response.code === 200) {
          this.form.setFieldsValue({ installExplain: info.file.response.data[0].url })
        }
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} 上传失败`)
      } else if (info.file.status === 'removed') { // 删除清空
        this.form.setFieldsValue({ installExplain: '' })
      }
      this.installList = info.fileList
    },
    operateChange (info) {
      if (info.file.status === 'uploading' && this.operateList.length >= 1) {
        this.$message.error(`只能上传一个文件！`)
        return
      }
      if (info.file.status === 'done') {
        this.$message.success(`${info.file.name} 上传完成`)
        if (info.file.response.code === 200) {
          this.form.setFieldsValue({ operateExplain: info.file.response.data[0].url })
        }
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} 上传失败`)
      } else if (info.file.status === 'removed') { // 删除清空
        this.form.setFieldsValue({ operateExplain: '' })
      }
      this.operateList = info.fileList
    },
    checkName (type) {
      return
      var param = {}
      if (type === 1) {
        if (this.form.getFieldValue('productName') === undefined || this.form.getFieldValue('productName').length < 1) {
          return
        } else {
          param = { id: this.pId, productName: this.form.getFieldValue('productName') }
        }
      } else if (type === 2) {
        if (this.form.getFieldValue('productModel') === undefined || this.form.getFieldValue('productModel').length < 1) {
          return
        } else {
          param = { id: this.pId, productModel: this.form.getFieldValue('productModel') }
        }
      }
      checkName(param).then(res => {
        if (res.code === 200) {
          if (res.data.length > 0) {
            if (type === 1) {
              this.form.setFields({ 'productName': { value: '', errors: [{ 'message': '该产品名称已经存在!', 'field': 'productName' }] } })
            } else if (type === 2) {
              this.form.setFields({ 'productModel': { value: '', errors: [{ 'message': '该产品代码已经存在!', 'field': 'productModel' }] } })
            }
          }
        }
      }).catch(function (err) {
        console.log(err)
      })
    },
    handleBeforeUpload(file,fileList){
      return true
      // return this.compressPictures(file)
    },
    compressPictures(file){
      if(file.type.indexOf("image") !== 0){
        return false
      }

      return new Promise((resolve,reject) =>{
        let fileType = file.type
        let reader = new FileReader(),img = new Image();
        reader.readAsDataURL(file);
        reader.onload = e =>{img.src = e.target.result}
        img.onload = function () {
          let canvas = document.createElement('canvas');
          let context = canvas.getContext('2d');
          let originWidth = this.width;
          let originHeight = this.height;
          let maxWidth = 500,maxHeight = 500;
          let targetWidth = originWidth,targetHeight = originHeight;
          if(originWidth > maxWidth || originHeight > maxHeight) {
              if(originWidth / originHeight > maxWidth / maxHeight) {
                  targetWidth = maxWidth;
                  targetHeight = Math.round(maxWidth * (originHeight / originWidth));
              } else {
                  targetHeight = maxHeight;
                  targetWidth = Math.round(maxHeight * (originWidth / originHeight));
              }
          }
          canvas.width = targetWidth;
          canvas.height = targetHeight;
          context.clearRect(0, 0, targetWidth, targetHeight);
          context.drawImage(img, 0, 0, targetWidth, targetHeight);
          canvas.toBlob((blob)=>{
            resolve(new File([blob],file.name,{type:fileType}))
          }, fileType, 0.92)
        }
        img.onerror = function(err){
          reject(err)
        }
      })
    },
    initArea(){
      let that = this
      return queryTreeByArea().then(res => {
        that.treeData =  res.data
          .map(item =>that.formatTreeData(item))
          .map(item =>that.delLevelGt2(item))
      })
    },
    //格式化接口数据 key,title,value
    formatTreeData(item,level = 1){
      let that = this
      let obj = {}
      obj.key = String(item.key)
      obj.title = item.title
      obj.value = String(item.key)
      obj.icon = item.icon
      obj.parentId = item.parentId
      obj.level = level
      if(level === 1){
        obj.selectable = false
      }
      level ++
      if(item.children !== null && Array.isArray(item.children)){
        obj.children = item.children.map(v =>that.formatTreeData(v,level))
      }
      return obj
    },
    delLevelGt2(item){
      let that = this
      if(item.level > 2){
        item.children = []
        return item
      }
      if(item.children !== null && Array.isArray(item.children)){
        if(item.children.filter(v =>v.level > 2).length > 0){
          item.children = []
        }else{
          item.children.map(v => that.delLevelGt2(v))
        }
      }
      return item
    },
    async customUploadAction(file) {
      //上传 压缩过的图片
      let that = this
      let compressFile = await that.compressPictures(file)
      const formData = new FormData()
      formData.append('file', compressFile)
      let url = await customUpload(formData).then((res) => res.data)
      return url
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
