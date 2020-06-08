<template>
  <a-modal
    title="操作"
    :width="600"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form" >
        <a-form-item label="id" hidden>
          <a-input v-decorator="['id', {}]"/>
        </a-form-item>
        <a-form-item
          label="视频名称"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol">
          <a-input
            :disabled="queryBoolean"
            placeholder="请输入视频名称"
            v-decorator="['title', {
              rules: [{
                type: 'string', message: '请输入正确视频名称!',
              }, {
                required: true, message: '请输入视频名称!',
              }]
            }]"/>
        </a-form-item>
        <a-form-item label="视频" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-upload
            accept="multiple"
            name="files"
            :multiple="true"
            :action="this.uploadPath"
            :fileList="fileList"
            @preview="handlePreview"
            @change="handleChange">
            <a-button>
              <a-icon type="upload" /> 上传
            </a-button>
            <a-modal :visible="previewVisible" :footer="null" @cancel="previewCancel" :maskClosable="false">
              <video-player
                class="video-player vjs-custom-skin"
                ref="videoPlayer"
                :playsinline="true"
                :options="playerOptions"
              ></video-player>
            </a-modal>

          </a-upload>
          <a-input type="hidden" v-decorator="['url', {rules: [{required: true,message: '请选择视频！'}]}]"/>
          <a-input type="hidden" v-decorator="['showPic', {rules: [{required: false,message: '没有获取到头图！'}]}]"/>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { saveInformation, editInformation } from '@/api/enterpriseInformation'
import { getUploadVideoPath } from '@/api/manage'

export default {
  name: 'EnterpriseSynopsis',
  data () {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },
      playerOptions: {
        playbackRates: [0.5, 1.0, 1.5, 2.0], // 可选择的播放速度
        autoplay: false, // 如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [{
          type: ''
          // src: ''//url地址
        }],
        poster: '', // 你的封面地址
        // width: document.documentElement.clientWidth,
        notSupportedMessage: '此视频暂无法播放，请稍后再试', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true, // 当前时间和持续时间的分隔符
          durationDisplay: true, // 显示持续时间
          remainingTimeDisplay: false, // 是否显示剩余时间功能
          fullscreenToggle: true // 全屏按钮
        }
      },
      visible: false,
      confirmLoading: false,
      addOredit: 'save',
      type:0,
      queryBoolean: false,
      previewVisible: false, // 图片预览框是否可见
      previewImage: '', //  预览图片的src值
      fileList: [],
      uploadPath: getUploadVideoPath()
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  computed: {
    player () {
      return this.$refs.videoPlayer.player
    }
  },
  methods: {
    add: function (type){
      this.type = type
      this.visible = true
      this.addOredit = 'save'
    },
    edit (record) {
      console.log('record', record)
      this.addOredit = 'edit'
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue({ ...record })
      })
      if (record.url != null && record.url.length > 0) {
        this.fileList[0] = {
          uid: '-1',
          name: record.title,
          status: 'done',
          'url': record.url
        } // 图片预览缩略图
      }
    },
    close () {
      this.$emit('ok')
      this.visible = false
    },
    handleOk () {
      const _this = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        // 验证表单没错误
        if (!err) {
          _this.confirmLoading = true
          if (_this.addOredit == 'save') {
            _this.$set(values, 'Authorization', _this.$store.getters.token)
            _this.$set(values, 'informationType', this.type)
            saveInformation(values).then((data) => {
              console.log('date', data)
              if (data.code == 200) {
                _this.$message.success('保存成功')
              } else {
                _this.$message.error(data.msg)
              }
            }).catch(() => {
              // Do something
            }).finally(() => {
              _this.confirmLoading = false
              // 清空表单
              _this.form.resetFields()
              // 清空图片
              this.fileList = []
              _this.close()
            })
          } else if (this.addOredit == 'edit') {
            _this.$set(values, 'Authorization', _this.$store.getters.token)
            editInformation(values).then((data) => {
              if (data.code == 200) {
                _this.$message.success('修改成功')
              } else {
                _this.$message.error(data.msg)
              }
            }).catch(() => {
              // Do something
            }).finally(() => {
              _this.confirmLoading = false
              _this.form.resetFields()
              _this.close()
            })
          }
        }
      }
      )
    },
    previewCancel () {
      this.previewVisible = false
    },
    handlePreview (file) { // 点击文件链接或预览图标时的回调
      this.$set(this.playerOptions.sources[0], 'src', file.url || file.thumbUrl)
      // this.playerOptions.sources.src = file.url || file.thumbUrl
      this.previewVisible = true
    },
    handleChange ({ file, fileList }) { // 上传中、完成、失败都会调用这个函数。
      fileList = fileList.slice(-1)
      if (file.status !== 'uploading') {
        console.log(file, fileList)
      }
      if (file != null && file.status === 'done') { // 状态有：uploading done error removed
        if (file.response.code === 200) { // 成功
          console.log('file.response.data[0]', file.response.data[0])
          this.form.setFieldsValue({ url: file.response.data[0].url })
          this.form.setFieldsValue({ showPic: file.response.data[0].pic })
        }
      } else if (file.status === 'removed') { // 删除清空
        this.form.setFieldsValue({ url: '' })
      }
      this.fileList = fileList // 展示照片墙
    },
    handleCancel () {
      this.close()
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
  .input_video{
    width: 400px;
    height: 400px;
    margin: 0 auto;

  }
</style>
