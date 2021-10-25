<template>
  <a-modal
    :title="modalTitle"
    :width="600"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form" labelAlign="left">
        <!-- <a-form-item label="id" hidden>
          <a-input v-decorator="['id', {}]" />
        </a-form-item> -->
        <a-form-item label="问题类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select
            placeholder="问题类型"
            :disabled="isDisabled"
            show-search
            :filter-option="filterOption"
            v-decorator="[
              'problemTypeId',
              {
                rules: [
                  {
                    required: true,
                    message: '请选择问题类型!',
                  },
                ],
              },
            ]"
            allowClear
            style="width: 200px"
          >
            <a-select-option v-for="item in Warehouse" :key="item.id" :value="item.id">{{ item.text }}</a-select-option>
          </a-select>
          <a-button type="primary" style="margin-left: 10px" v-if="!isDisabled" @click="handleAdd()">新增</a-button>
        </a-form-item>
        <a-form-item label="问题点" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            :disabled="isDisabled"
            placeholder="请输入问题点"
            v-decorator="[
              'problemPoint',
              {
                rules: [
                  {
                    type: 'string',
                    message: '请输入正确问题点!',
                  },
                  {
                    required: true,
                    message: '请输入问题点!',
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
        </a-form-item>
        <a-form-item label="解决方案" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-textarea
            :disabled="isDisabled"
            placeholder="请输入解决方案"
            v-decorator="[
              'solution',
              {
                rules: [
                  {
                    required: true,
                    message: '请输入解决方案!',
                  },
                ],
              },
            ]"
          />
        </a-form-item>
        <a-form-item label="教程视频" :labelCol="labelCol" :wrapperCol="wrapperCol">
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
            <a-modal :visible="previewVisible" :footer="null" @cancel="previewCancel" :maskClosable="false">
              <video-player
                class="video-player vjs-custom-skin"
                ref="videoPlayer"
                :playsinline="true"
                :options="playerOptions"
              ></video-player>
            </a-modal>
          </a-upload>
        </a-form-item>
        <a-form-item label="附件" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-upload :action="uploadUrl" :disabled="isDisabled" :fileList="fileList1" @change="handleChange1">
            <a-button> <a-icon type="upload" /> 上传文件 </a-button>
          </a-upload>
        </a-form-item>
      </a-form>
    </a-spin>
    <Dictionaries ref="dictionaries" @ok="After" />
  </a-modal>
</template>

<script>
import { addAndUpdateAnalysis } from '@/api/after-sales-management'
import { getUploadVideoPath } from '@/api/manage'
import { getUploadPath2 } from '@/api/common'
import { queryCode } from '@/api/workBox'
import Dictionaries from './Dictionaries'
let uuid = () => Math.random().toString(32).slice(-10)
export default {
  name: 'EnterpriseSynopsis',
  components: {
    Dictionaries,
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
      toolType: 0,
      queryBoolean: false,
      previewVisible: false, // 图片预览框是否可见
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
      this.$refs.dictionaries.query()
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    query(type, record) {
      this.visible = true
      this.addOredit = type
      this.record = record
      this.After()
      if (type !== 'add') {
        this.$nextTick(() => {
          this.form.setFieldsValue({
            problemTypeId: record.problemTypeId,
            problemPoint: record.problemPoint,
            problemDescription: record.problemDescription,
            solution: record.solution,
          })
          if (record.enclosure != null && record.enclosure.length > 0) {
            let react = record.enclosure.split(',')
            this.fileList1 = react.map((i) => {
              return {
                uid: uuid(),
                name: i.substr(41, 300),
                status: 'done',
                url: i,
              }
            })
          }
          if (record.tutorialVideo != null && record.tutorialVideo.length > 0) {
            let react = record.tutorialVideo.split(',')
            this.fileList = react.map((i) => {
              return {
                uid: uuid(),
                name: i.substr(41, 300),
                status: 'done',
                url: i,
              }
            })
          }
        })
      }
    },
    After() {
      queryCode({ code: 'After_sales_analysis01' })
        .then((res) => {
          this.Warehouse = res.data
        })
        .catch((err) => (this.loading = false))
    },

    close() {
      this.$emit('ok')
      this.fileList = []
      this.fileList1 = []
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
            values.tutorialVideo =
              this.fileList.map((i) => (i.response && i.response.data[0].url) || i.url).toString() || ''
          }
          if (this.fileList1.length !== 0) {
            values.enclosure = this.fileList1.map((i) => (i.response && i.response.data) || i.url).toString() || ''
          }

          let react = this.Warehouse.find((i) => i.id === values.problemTypeId)
          values.problemTypeCode = react.code

          _this.confirmLoading = true
          addAndUpdateAnalysis(values)
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

<style scoped>
.ant-form-item-label-left {
  padding-left: 20px;
}
/* text-align: left;
    padding-left: 20px; */
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
</stylev>
