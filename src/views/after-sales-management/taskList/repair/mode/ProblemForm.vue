<template>
  <a-modal
    title="新增问题设备"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="主板号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input :disabled="isDisabled" style="width: 75%" placeholder="请输入主板号" v-decorator="['mainBoardNo']" />
          <a-button type="primary" style="margin-left: 10px" v-if="!isDisabled" @click="handleAdd()">查询</a-button>
        </a-form-item>

        <a-form-item label="机构名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input :disabled="isDisabled" placeholder="请输入机构名称" v-decorator="['orgName']" />
        </a-form-item>
        <a-form-item label="小区名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            :disabled="isDisabled"
            placeholder="请输入小区名称"
            v-decorator="[
              'villageName',
              {
                rules: [
                  {
                    required: true,
                    message: '请输入小区名称!',
                  },
                ],
              },
            ]"
          />
        </a-form-item>
        <a-form-item label="地址" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            :disabled="isDisabled"
            placeholder="请输入地址"
            v-decorator="[
              'deviceLocation',
              {
                rules: [
                  {
                    required: true,
                    message: '请输入地址!',
                  },
                ],
              },
            ]"
          />
        </a-form-item>
        <a-form-item label="产品名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            :disabled="isDisabled"
            placeholder="请输入产品名称"
            v-decorator="[
              'productName',
              {
                rules: [
                  {
                    required: true,
                    message: '请输入产品名称!',
                  },
                ],
              },
            ]"
          />
        </a-form-item>

        <a-form-item label="问题描述" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-textarea
            :disabled="isDisabled"
            placeholder="请输入问题描述"
            v-decorator="[
              'problemDescription',
              {
                rules: [
                  {
                    required: true,
                    message: '请输入问题描述!',
                  },
                ],
              },
            ]"
          />
          <a-input hidden v-decorator="['isWarranty']" />
        </a-form-item>

        <a-form-item label="照片" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-upload
            :action="uploadUrl"
            list-type="picture-card"
            :file-list="fileList1"
            @preview="handlePreview1"
            @change="handleChange1"
          >
            <div v-if="fileList1.length < 5">
              <a-icon type="plus" />
              <div class="ant-upload-text">上传照片</div>
            </div>
          </a-upload>
          <a-modal title="查看" :visible="previewVisible1" :footer="null" @cancel="previewCancel1">
            <img alt="example" style="width: 100%" :src="previewImage" />
          </a-modal>
        </a-form-item>
        <a-form-item label="视频" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-upload
            accept="multiple"
            name="files"
            :disabled="isDisabled"
            :multiple="true"
            :action="this.uploadPath"
            :fileList="fileList"
            @preview="handlePreview"
            @change="handleChange"
          >
            <a-button> <a-icon type="cloud-upload" />上传视频</a-button>
            <a-modal
              title="查看"
              :visible="previewVisible"
              :footer="null"
              @cancel="previewCancel"
              :maskClosable="false"
            >
              <video-player
                class="video-player vjs-custom-skin"
                ref="videoPlayer"
                :playsinline="true"
                :options="playerOptions"
              ></video-player>
            </a-modal>
          </a-upload>
        </a-form-item>
        <a-form-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-textarea :disabled="isDisabled" placeholder="请输入备注" v-decorator="['remark']" />
        </a-form-item>
      </a-form>
      <h3>注：问题描述一定要描述清楚,否则视为无效任务单！</h3>
    </a-spin>
  </a-modal>
</template>

<script>
import { addAndUpdateAnalysis, getNewDeviceInfoByMainBoardNo } from '@/api/after-sales-management'
import { getUploadVideoPath } from '@/api/manage'
import { getUploadPath2 } from '@/api/common'
import { queryCode } from '@/api/workBox'
// import Dictionaries from './Dictionaries'

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}
export default {
  name: 'EnterpriseSynopsis',
  components: {
    // Dictionaries,
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
      playerOptions: {
        playbackRates: [0.5, 1.0, 1.5, 2.0], // 可选择的播放速度
        autoplay: false, // 如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [
          {
            type: '',
            // src: ''//url地址
          },
        ],
        poster: '', // 你的封面地址
        // width: document.documentElement.clientWidth,
        notSupportedMessage: '此视频暂无法播放，请稍后再试', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true, // 当前时间和持续时间的分隔符
          durationDisplay: true, // 显示持续时间
          remainingTimeDisplay: false, // 是否显示剩余时间功能
          fullscreenToggle: true, // 全屏按钮
        },
      },
      visible: false,
      confirmLoading: false,
      addOredit: 'add',
      type: 0,
      record: {},
      mainBoard: undefined,
      toolType: 0,
      queryBoolean: false,
      previewVisible: false, // 图片预览框是否可见
      previewVisible1: false,
      previewImage: '', //  预览图片的src值
      fileList: [],
      fileList1: [],
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
    isDisabled() {
      return this.isView
    },
  },
  methods: {
    handleAdd() {
      // 拿去主板号获取设备信息
      let arr = this.form.getFieldValue('mainBoardNo')
      console.log(arr)
      getNewDeviceInfoByMainBoardNo({ mainBoardNo: arr }).then((res) => {
        this.mainBoard = res.data
        if (res.data !== null) {
          this.form.setFieldsValue({
            villageName: res.data.villageName,
            deviceLocation: res.data.deviceLocation,
            orgName: res.data.orgName,
            productName: res.data.productName,
            // isWarranty: res.data.isWarranty,
          })
        } else {
          this.$message.error('后台未匹配到对应的数据，请检查输入的主板号是否正确')
        }
      })
    },
    query(type, record) {
      this.visible = true
      this.addOredit = type
      this.record = record
    },
    close() {
      // this.$emit('ok')
      this.fileList = []
      this.fileList1 = []
      this.form.resetFields() // 清空表
      this.visible = false
      this.mainBoard = null
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
          console.log(values)
          if (this.isEdit) {
            values.id = this.record.id
          }
          if (this.fileList.length !== 0) {
            values.video = this.fileList.map((i) => (i.response && i.response.data[0].url) || i.url).toString() || ''
          }
          if (this.mainBoard !== null) {
            values.isWarranty = this.mainBoard.isWarranty
          }
          if (this.fileList1.length !== 0) {
            values.photo = this.fileList1.map((i) => (i.response && i.response.data) || i.url).toString() || ''
            values.picture = this.fileList1
          } else {
            return this.$message.error('请上传照片')
          }

          this.$emit('opinionChange', values)
          this.close()
        }
      })
    },
    previewCancel() {
      this.previewVisible = false
    },
    previewCancel1() {
      this.previewVisible1 = false
    },
    async handlePreview1(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj)
      }
      this.previewImage = file.url || file.preview
      this.previewVisible1 = true
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
      fileList = fileList.slice(-1)
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
  },
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
.input_video {
  width: 400px;
  height: 400px;
  margin: 0 auto;
}
</style>
