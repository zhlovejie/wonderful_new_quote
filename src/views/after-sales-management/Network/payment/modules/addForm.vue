<template>
  <a-modal
    :title="modalTitle"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <template slot="footer">
      <template v-if="isApproval">
        <a-button key="back" icon="close" @click="noPassAction">不通过</a-button>
        <a-button key="submit" type="primary" icon="check" :loading="confirmLoading" @click="passAction">通过</a-button>
      </template>
      <template v-else>
        <a-button key="back" @click="handleCancel">取消</a-button>
        <a-button key="submit" type="primary" :loading="confirmLoading" @click="handleOk">确定</a-button>
      </template>
    </template>
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <h3>基本信息</h3>
        <table class="custom-table custom-table-border">
          <tr>
            <td>网点编号</td>
            <td>{{ record && record.networkNum ? record.networkNum : '系统自动生成' }}</td>
          </tr>
          <tr>
            <td>网点类型</td>
            <td>企业</td>
          </tr>
          <tr>
            <td>网点名称</td>
            <td>
              <a-form-item>
                <a-input
                  :disabled="isDisabled"
                  placeholder="请输入网点名称"
                  v-decorator="[
                    'networkName',
                    {
                      rules: [
                        {
                          required: true,
                          message: '请输入正确网点名称!',
                        },
                      ],
                    },
                  ]"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>区域</td>
            <td>
              <a-form-item>
                <a-cascader
                  :disabled="isDisabled"
                  v-decorator="['territory', { rules: [{ required: true, message: '选择省市区' }] }]"
                  :options="birthplaceOptions"
                  @change="birthplaceCascaderChange"
                  :loadData="birthplaceCascaderLoadData"
                  placeholder="选择省市区"
                />
              </a-form-item>
            </td>
          </tr>
          <!-- <tr>
            <td>业务员</td>
            <td>
              <a-form-item>
                <a-input
                  :disabled="isDisabled"
                  placeholder="请输入业务员名称"
                  v-decorator="[
                    'serviceUserName',
                    {
                      rules: [
                        {
                          required: true,
                          message: '请输入正确业务员名称!',
                        },
                      ],
                    },
                  ]"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>业务员电话</td>
            <td>
              <a-form-item>
                <a-input
                  :disabled="isDisabled"
                  placeholder="请输入业务员电话"
                  v-decorator="[
                    'contactInformation',
                    {
                      rules: [
                        {
                          required: true,
                          message: '请输入正确业务员电话!',
                        },
                      ],
                    },
                  ]"
                />
              </a-form-item>
            </td>
          </tr> -->
          <tr>
            <td>营业执照</td>
            <td>
              <a-form-item>
                <a-upload
                  :action="uploadUrl"
                  :disabled="isDisabled"
                  list-type="picture-card"
                  :file-list="fileList"
                  @preview="handlePreview"
                  @change="handleChange"
                >
                  <div v-if="fileList.length < 5 && !isDisabled">
                    <a-icon type="plus" />
                    <div class="ant-upload-text">上传照片</div>
                  </div>
                </a-upload>
                <a-modal title="查看" :visible="previewVisible" :footer="null" @cancel="previewCancel">
                  <img alt="example" style="width: 100%" :src="previewImage" />
                </a-modal>
              </a-form-item>
            </td>
          </tr>
        </table>
        <h3>业务员</h3>
        <table class="custom-table custom-table-border">
          <tr>
            <th>序号</th>
            <th>业务员名称</th>
            <th>业务员电话</th>
            <th v-if="!isDisabled">操作</th>
          </tr>
          <tr v-for="(item, index) in serviceUserVoList" :key="item._key">
            <td style="width: 150px">{{ index + 1 }}</td>
            <td>
              <a-form-item>
                <a-input
                  :disabled="isDisabled"
                  placeholder="请输入业务员名称"
                  @change="inputChange($event, 'serviceUserVoList', item._key, 'serviceUserName')"
                  v-decorator="[
                    `serviceUserVoList.${index}.serviceUserName`,
                    { initialValue: item.serviceUserName, rules: [{ required: true, message: '输入业务员名称' }] },
                  ]"
                />
              </a-form-item>
            </td>
            <td>
              <a-form-item>
                <a-input
                  :disabled="isDisabled"
                  @change="inputChange($event, 'serviceUserVoList', item._key, 'contactInformation')"
                  placeholder="请输入业务员电话"
                  v-decorator="[
                    `serviceUserVoList.${index}.contactInformation`,
                    {
                      initialValue: item.contactInformation,
                      rules: [{ required: true, message: '输入业务员电话' }],
                    },
                  ]"
                />
              </a-form-item>
            </td>
            <td style="width: 70px" v-if="!isDisabled">
              <a-form-item>
                <a href="javascript:void(0);" @click="delItem(item._key)">删除</a>
              </a-form-item>
            </td>
          </tr>
        </table>
        <a-button
          v-if="!isDisabled"
          style="width: 100%"
          type="dashed"
          icon="plus"
          @click="addItem('serviceUserVoList')"
        ></a-button>
        <h3>
          协议信息 <span><a href="">协议模板</a> </span><span>（请填写完基本信息后，点击下载协议模板）</span>
        </h3>

        <table class="custom-table custom-table-border">
          <tr>
            <td>协议文件</td>
            <td>
              <a-form-item>
                <a-upload :action="uploadUrl" :disabled="isDisabled" :fileList="fileList1" @change="handleChange1">
                  <a-button> <a-icon type="upload" /> 上传文件 </a-button>
                </a-upload>
              </a-form-item>
            </td>
          </tr>
        </table>
      </a-form>
    </a-spin>

    <Approval ref="approval" @opinionChange="opinionChange" />
  </a-modal>
</template>

<script>
import { addAndUpdateEnterpriseNetwork, approvalEnterpriseNetwork } from '@/api/after-sales-management'
import { getUploadVideoPath } from '@/api/manage'
import { getUploadPath2, getAreaByParent } from '@/api/common'
import Approval from './Approval'
let uuid = () => Math.random().toString(32).slice(-10)
export default {
  name: 'EnterpriseSynopsis',
  components: {
    Approval,
  },
  data() {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 },
      },
      uploadUrl: getUploadPath2(),
      Warehouse: [],
      serviceUserVoList: [],
      visible: false,
      confirmLoading: false,
      addOredit: 'add',
      type: 0,
      record: {},
      toolType: 0,
      queryBoolean: false,
      birthplaceOptions: [], //籍贯 级联 省市
      previewVisible: false, // 图片预览框是否可见
      previewImage: '', //  预览图片的src值
      fileList: [],
      fileList1: [],
      labelName: undefined,
      uploadPath: getUploadVideoPath(),
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this)
  },
  computed: {
    player() {
      return this.$refs.videoPlayer.player
    },
    modalTitle() {
      let txt = this.isView ? '查看' : this.isEdit ? '修改' : '新增'
      return `${txt}`
    },
    isView() {
      return this.addOredit === 'view'
    },
    isAdd() {
      return this.addOredit === 'add'
    },
    isEdit() {
      //审核
      return this.addOredit === 'edit'
    },
    isApproval() {
      return this.addOredit === 'approval'
    },
    isDisabled() {
      return this.isView || this.isApproval
    },
  },
  methods: {
    submitAction(opt) {
      let that = this
      let values = Object.assign({}, opt || {}, { approveId: that.record.id })
      that.spinning = true
      approvalEnterpriseNetwork(values)
        .then((res) => {
          that.spinning = false
          console.log(res)
          that.form.resetFields() // 清空表
          that.visible = false
          that.$message.info(res.msg)
          that.close()
        })
        .catch((err) => (that.spinning = false))
    },
    passAction(opt = {}) {
      this.submitAction(Object.assign({}, { isAdopt: 0, opinion: '通过' }, opt || {}))
    },
    noPassAction() {
      let that = this
      that.$refs.approval.query()
    },
    opinionChange(opinion) {
      //审批意见
      this.submitAction({
        isAdopt: 1,
        opinion: opinion,
      })
    },
    handleAdd() {
      this.$refs.dictionaries.query()
    },
    inputChange(event, key, keys, field) {
      let programme = [...this[key]]
      let target = programme.find((item) => item._key === keys)
      if (target) {
        target[field] = event instanceof Event ? event.target.value : event
        this[key] = [...programme]
      }
    },
    addItem(key) {
      this[key].push({
        _key: uuid(),
        contactInformation: undefined,
        serviceUserName: undefined,
      })
    },
    async query(type, record) {
      let that = this
      this.visible = true
      this.addOredit = type
      this.record = record
      let _areaData = await this.loadAreaAction(100000)
      this.birthplaceOptions = _areaData
      if (type !== 'add') {
        that.serviceUserVoList = record.serviceUserVoList
        that.$nextTick(() => {
          that.form.setFieldsValue({
            networkName: record.networkName,
          })
          if (record.protocolFileUrl != null && record.protocolFileUrl.length > 0) {
            let react = record.protocolFileUrl.split(',')
            that.fileList1 = react.map((i) => {
              return {
                uid: uuid(),
                name: i.substr(41, 300),
                status: 'done',
                url: i,
              }
            })
          }
          if (record.businessLicenseUrl != null && record.businessLicenseUrl.length > 0) {
            let react = record.businessLicenseUrl.split(',')
            that.fileList = react.map((i) => {
              return {
                uid: uuid(),
                name: i.substr(41, 300),
                status: 'done',
                url: i,
              }
            })
          }
        })
        let _arr = record.territory.split(',')
        if (record.territory) {
          _arr = _arr.map((v) => parseInt(v, 10))
          let _areaCityData = await that.loadAreaAction(_arr[0])
          let ctiyTargetOption = that.birthplaceOptions.find((p) => p.value == _arr[0])
          if (ctiyTargetOption) {
            ctiyTargetOption.children = _areaCityData
            that.birthplaceOptions = [...that.birthplaceOptions]
          }

          let _areaAreaData = await that.loadAreaAction(_arr[1])
          let areaTargetOption = ctiyTargetOption.children.find((p) => p.value == _arr[1])
          if (areaTargetOption) {
            areaTargetOption.children = _areaAreaData
            that.birthplaceOptions = [...that.birthplaceOptions]
          }
          that.$nextTick(() => that.form.setFieldsValue({ territory: _arr }))
        }
      } else {
        that.addItem('serviceUserVoList')
      }
    },
    delItem(index) {
      let _d = this.serviceUserVoList
      _d = _d.filter((i) => i._key !== index)
      this.serviceUserVoList = [..._d]
    },
    close() {
      this.$emit('ok')
      this.fileList = []
      this.fileList1 = []
      this.serviceUserVoList = []
      this.form.resetFields() // 清空表
      this.visible = false
    },
    handleOk() {
      const _this = this
      if (this.isView) {
        return (this.visible = false)
      }
      // 触发表单验证
      this.form.validateFields((err, values) => {
        // 验证表单没错误
        if (!err) {
          if (this.isEdit) {
            values.id = this.record.id
          }
          if (this.fileList.length !== 0) {
            values.businessLicenseUrl =
              this.fileList.map((i) => (i.response && i.response.data) || i.url).toString() || ''
          } else {
            return this.$message.error('请上传营业执照')
          }
          if (this.fileList1.length !== 0) {
            values.protocolFileUrl =
              this.fileList1.map((i) => (i.response && i.response.data) || i.url).toString() || ''
          }
          values.networkType = 1
          values.territory = values.territory.toString()
          values.territoryName = this.labelName || this.record.territoryName
          _this.confirmLoading = true
          addAndUpdateEnterpriseNetwork(values)
            .then((res) => {
              if (res.code == 200) {
                _this.$message.success('保存成功')
              } else {
                _this.$message.error(res.msg)
              }
            })
            .catch(() => {
              // Do something
            })
            .finally(() => {
              _this.confirmLoading = false
              // 清空表单
              _this.form.resetFields()
              // 清空图片
              this.fileList = []
              _this.close()
            })
        }
      })
    },
    previewCancel() {
      this.previewVisible = false
    },
    handlePreview(file) {
      // 点击文件链接或预览图标时的回调
      this.$set(this.playerOptions.sources[0], 'src', file.url || file.thumbUrl)
      // this.playerOptions.sources.src = file.url || file.thumbUrl
      this.previewVisible = true
    },
    handleChange({ file, fileList }) {
      // debugger
      // 上传中、完成、失败都会调用这个函数。
      // fileList = fileList.slice(-1)
      if (file.status !== 'uploading') {
        console.log(file, fileList)
      }
      if (file != null && file.status === 'done') {
        // 状态有：uploading done error removed
        if (file.response.code === 200) {
          // 成功
          console.log('file.response.data[0]', file.response.data[0])
          this.form.setFieldsValue({ url: file.response.data[0].url })
          this.form.setFieldsValue({ showPic: file.response.data[0].pic })
        }
      } else if (file.status === 'removed') {
        // 删除清空
        this.form.setFieldsValue({ url: '' })
      }
      this.fileList = fileList // 展示照片墙
    },
    handleChange1(info) {
      let fileList = [...info.fileList]
      fileList = fileList.slice(-1)
      fileList = fileList.map((file) => {
        if (file.response) {
          file.url = file.response.url
        }
        return file
      })
      this.fileList1 = fileList
    },
    handleCancel() {
      this.close()
    },

    birthplaceCascaderChange(arrSelected) {
      console.log('birthplaceCascaderChange called...')
      console.log(arguments)
      this.labelName = arguments[1].map((i) => i.label).toString()
    },
    birthplaceCascaderLoadData(selectedOptions) {
      let that = this
      const targetOption = selectedOptions[selectedOptions.length - 1]
      targetOption.loading = true
      getAreaByParent({ pId: targetOption.value })
        .then((res) => {
          //城市
          targetOption.loading = false
          targetOption.children = res.data.map((item) => {
            return {
              label: item.area,
              value: item.id,
              isLeaf: item.level === 3 ? true : false,
            }
          })
          that.birthplaceOptions = [...that.birthplaceOptions]
        })
        .catch(function (err) {
          console.log(err)
        })
    },
    loadAreaAction(pId) {
      const that = this
      return getAreaByParent({ pId: pId })
        .then((res) => {
          //城市
          return res.data.map((item) => {
            return {
              label: item.area,
              value: item.id,
              isLeaf: item.level === 3 ? true : false,
            }
          })
        })
        .catch(function (err) {
          console.log(err)
          return []
        })
    },
  },
}
</script>

<style scoped >
/* you can make up upload button and sample style by using stylesheets */
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
.input_video {
  width: 400px;
  height: 400px;
  margin: 0 auto;
}
.ant-form-item {
  margin-bottom: 0;
}
</style>
