<template>
  <div class="__research-managements_sigle_form">
    <a-spin :spinning="spinning">
      <a-form :form="form">
        <table class="custom-table custom-table-border">
          <tr>
            <td>上级</td>
            <td>
              <a-form-item>
                <a-input
                  v-if="!isView"
                  disabled
                  style="width:100%;"
                  v-decorator="['permissionName',{initialValue:detail.permissionName}]"
                />
                <span v-else>{{detail.permissionName}}</span>
              </a-form-item>
              <a-form-item hidden>
                <a-input v-decorator="['menuId',{initialValue:detail.menuId}]" />
              </a-form-item>
              <a-form-item hidden>
                <a-input v-decorator="['permissionId',{initialValue:detail.permissionId}]" />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td style="width:120px;">名称</td>
            <td>
              <a-form-item>
                <a-input
                  v-if="!isView"
                  placeholder="名称"
                  allowClear
                  style="width:100%;"
                  v-decorator="['fileName', {initialValue:detail.fileName, rules: [{ required: true, message: '输入名称' }] }]"
                />
                <span v-else>{{detail.fileName}}</span>
              </a-form-item>
            </td>
          </tr>

          <tr>
            <td style="width:120px;">代码</td>
            <td>
              <a-form-item>
                <a-input
                  v-if="!isView"
                  placeholder="产品代码"
                  allowClear
                  style="width:100%;"
                  v-decorator="['productCode', {initialValue:detail.productCode, rules: [{ required: false, message: '输入产品代码' }] }]"
                />
                <span v-else>{{detail.productCode}}</span>
              </a-form-item>
            </td>
          </tr>

          <tr>
            <td style="width:120px;">类型</td>
            <td>
              <a-form-item>
                <a-radio-group
                  v-if="!isView"
                  v-decorator="['fileType',{initialValue: detail.fileType}]"
                >
                  <a-radio :value="1">研发图纸</a-radio>
                  <a-radio :value="2">工艺图纸</a-radio>
                </a-radio-group>
                <span v-else>{{ {1:'研发图纸',2:'工艺图纸'}[detail.fileType] }}</span>
              </a-form-item>
            </td>
          </tr>

          <tr>
            <td style="width:120px;">文件</td>
            <td>
              <a-form-item style="width:400px;overflow:hidden;">
                <div class="clearfix" v-if="!isView">
                  <a-upload
                    name="file"
                    :action="uploadPath"
                    :multiple="true"
                    :fileList="fileList"
                    @change="handleChange"
                  >
                    <a-button type="dashed" icon="upload">上传文件</a-button>
                  </a-upload>
                </div>
                <div v-else>
                  <template v-if="detail.fileUrl">
                    <img
                      @click="showImg(detail.fileUrl)"
                      alt="文件图片"
                      :src="detail.fileUrl"
                      style="width:48px;height:auto;overflow:hidden;"
                    />
                  </template>
                  <span v-else>无</span>
                </div>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td style="width:120px;">图号</td>
            <td>
              <a-form-item>
                <a-input
                  v-if="!isView"
                  placeholder="产品图号"
                  allowClear
                  style="width:100%;"
                  v-decorator="['pictureNum', {initialValue:detail.pictureNum, rules: [{ required: false, message: '输入产品图号' }] }]"
                />
                <span v-else>{{detail.pictureNum}}</span>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>备注</td>
            <td>
              <a-form-item>
                <a-textarea
                  v-if="!isView"
                  placeholder
                  :rows="2"
                  v-decorator="['remark', {initialValue:detail.remark, rules: [{ required: false, message: '输入备注' }] }]"
                />
                <div v-else v-html="formatHTML(detail.remark)" />
              </a-form-item>
            </td>
          </tr>
        </table>
        <div style="margin-top:20px;text-align:center;" v-if="!isView">
          <a-button @click="handleCancel">取消</a-button>
          <a-button style="margin-left:10px;" type="primary" @click="handleSubmit">确定</a-button>
        </div>
      </a-form>
    </a-spin>
    <ImgView ref="imgView" />
  </div>
</template>
<script>
import { blueprintFileDetail, blueprintFileAddOrUpdate, getUploadPath ,blueprintFileDelete} from '@/api/researchManagement'
import moment from 'moment'
import ImgView from '@/components/CustomerList/ImgView'
let uuid = () => Math.random().toString(32).slice(-10)

export default {
  name: 'AddForm',
  components: { ImgView },
  props: {
    param: {
      type: Object,
      default: () => {},
    },
    action: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      form: this.$form.createForm(this),
      visible: false,
      spinning: false,
      type: '',
      detail: {},
      record: {},
      uploadPath: getUploadPath,
      fileList: [],
      previewVisible: false,
      userInfo: this.$store.getters.userInfo, // 当前登录人
    }
  },
  computed: {
    modalTitle() {
      return `${this.isView ? '查看' : this.isAdd ? '新增' : '编辑'}`
    },
    isView() {
      return this.type === 'view'
    },
    isEdit() {
      return this.type === 'edit'
    },
    isAdd() {
      return this.type === 'add'
    },
  },
  watch: {
    fileList(val) {
      // debugger
      let file = val.find(f => f.url)
      if(file){
        let pictureNum = ''
        let fileName = ''
        if(file.pictureNum && file.fileName){
          pictureNum = file.pictureNum
          fileName = file.fileName
        }else{
          try {
            //fileName = f.name.split('.')[0]
            //pictureNum = f.name.match(/([^\u4e00-\u9fa5]+)/g)[0]
            //新文件格式 图号__文件名.pdf   10月1之后执行
            let fullName = file.name.split('.')[0]
            let _arr = fullName.split('__')
            fileName = _arr[1]
            pictureNum = _arr[0]
          } catch (err) {
            console.log(err)
            fileName = file.name.split('.')[0]
            pictureNum = ''
          }
        }
        this.$nextTick(() => this.form.setFieldsValue({pictureNum:pictureNum,fileName:fileName}))
      }
    }
  },
  created() {
    this.query(this.action, this.param)
  },
  methods: {
    async query(type, record) {
      //debugger
      let that = this
      that.form.resetFields()
      that.type = type
      //that.detail = Object.assign({}, record)
      that.record = Object.assign({}, record)
      await that.initData()
      that.visible = true
    },
    initData() {
      let that = this
      let queue = []

      if (that.isAdd) {
        let { id, superiorId, menuName } = that.record.params
        that.detail = {
          permissionId: id,
          menuId: superiorId,
          permissionName: menuName,
          fileType: that.userInfo.departmentName.includes('工艺') ? 2 : 1,
        }
      } else {
        let task1 = blueprintFileDetail({ id: that.record.record.id }).then((res) => {
          that.detail = res.data
          if (that.detail.fileUrl) {
            that.fileList = [
              {
                uid: uuid(),
                name: that.detail.fileName,
                status: 'done',
                url: that.detail.fileUrl,
                pictureNum:that.detail.pictureNum,
                fileName:that.detail.fileName
              },
            ]
          }
        })
        queue.push(task1)
      }
      return Promise.all(queue)
    },
    handleSubmit() {
      let that = this
      if (that.isView) {
        that.handleCancel()
        return
      }
      this.form.validateFields((err, values) => {
        if (!err) {
          if (that.isEdit) {
            values.id = that.detail.id
          } else {
            //values.id = that.record.params.id || 0
          }
          if(that.fileList.length === 0){
            that.$message.info('请上传文件')
            return
          }
          values.fileUrl = that.fileList[0].url
          //console.log('Received values of form: ', values)
          that.spinning = true

          blueprintFileAddOrUpdate(values)
            .then((res) => {
              that.spinning = false
              if (res.code === 200) {
                that.handleCancel()
                that.$message.success('操作成功')
                that.$emit('finish')
              } else {
                that.$message.warning(res.msg)
              }
            })
            .catch((err) => {
              that.spinning = false
              that.$message.error('操作失败')
            })
        }
      })
    },
    handleCancel() {
      this.$nextTick(() => (this.visible = false))
      this.$emit('close')
    },
    handleChange({file,fileList}) {
      console.log(arguments)
      let that = this
      fileList = [...fileList].slice(-1)
      fileList = fileList.map((file) => {
        if (file.response && file.response.code === 200) {
          file.url = file.response.data
        }
        return file
      })
      that.fileList = fileList

      if(file && file.status === "removed" && file.url){
        blueprintFileDelete(`url=${file.url}`).then(res =>{
          console.log(res)
          if(res && +res.code === 200){
            that.form.setFieldsValue({pictureNum:undefined})
          }
        })
      }
    },
    formatHTML(htmlStr) {
      if (typeof htmlStr !== 'string') {
        return ''
      }
      htmlStr = htmlStr.replace(/[\n\r]/g, '<br/>')
      htmlStr = htmlStr.replace(/\s+/g, '&nbsp;')
      return htmlStr
    },
    showImg(url) {
      this.$refs.imgView && this.$refs.imgView.show(url)
    },
  },
}
</script>
<style scoped>
.custom-table-border th,
.custom-table-border td {
  padding: 10px;
  text-align: left;
}
.custom-table-border tr td:nth-child(1) {
  text-align: center;
}
.custom-table-border >>> .ant-form-item {
  margin-bottom: 0;
}
</style>
