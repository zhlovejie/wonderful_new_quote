<template>
  <div class="__fac_info_wrapper__">
    <a-form-model ref="ruleForm" :model="form" :rules="rules">
      <h2>实际考察信息</h2>
      <table class="custom-table custom-table-border">
        <tr>
          <td style="width:120px;">考察内容</td>
          <td style="width:500px;">考察结果</td>
          <td>附件资料(非必填)</td>
        </tr>

        <tr>
          <td>门面图片</td>
          <td>
            <a-form-model-item label="" prop="frontResult">
              <a-input v-model="form.frontResult" placeholder="辅助说明" />
            </a-form-model-item>
          </td>
          <td style="text-align:left;">
            <a-form-model-item label="">
              <UploadFile
                key="image"
                ref="uploadImage"
                :config="uploadImageConfig"
                @change="fileList => fileChange(fileList, 'frontAnnex')"
              />
            </a-form-model-item>
          </td>
        </tr>

        <tr>
          <td>设备图片</td>
          <td>
            <a-form-model-item label="" prop="deviceResult">
              <a-input v-model="form.deviceResult" placeholder="辅助说明" />
            </a-form-model-item>
          </td>
          <td style="text-align:left;">
            <a-form-model-item label="">
              <UploadFile
                key="image"
                ref="uploadImage"
                :config="uploadImageConfig"
                @change="fileList => fileChange(fileList, 'deviceAnnex')"
              />
            </a-form-model-item>
          </td>
        </tr>

        <tr>
          <td>生产现场图片</td>
          <td>
            <a-form-model-item label="" prop="sceneResult">
              <a-input v-model="form.sceneResult" placeholder="辅助说明" />
            </a-form-model-item>
          </td>
          <td style="text-align:left;">
            <a-form-model-item label="">
              <UploadFile
                key="image"
                ref="uploadImage"
                :config="uploadImageConfig"
                @change="fileList => fileChange(fileList, 'sceneAnnex')"
              />
            </a-form-model-item>
          </td>
        </tr>

        <tr>
          <td>质量体系</td>
          <td>
            <a-form-model-item label="" prop="qualityResult">
              <a-input v-model="form.qualityResult" placeholder="辅助说明" />
            </a-form-model-item>
          </td>
          <td style="text-align:left;">
            <a-form-model-item label="">
              <UploadFile
                key="image"
                ref="uploadImage"
                :config="uploadImageConfig"
                @change="fileList => fileChange(fileList, 'qualityAnnex')"
              />
            </a-form-model-item>
          </td>
        </tr>

        <tr>
          <td>管理体系</td>
          <td>
            <a-form-model-item label="" prop="manageResult">
              <a-input v-model="form.manageResult" placeholder="辅助说明" />
            </a-form-model-item>
          </td>
          <td style="text-align:left;">
            <a-form-model-item label="">
              <UploadFile
                key="image"
                ref="uploadImage"
                :config="uploadImageConfig"
                @change="fileList => fileChange(fileList, 'manageAnnex')"
              />
            </a-form-model-item>
          </td>
        </tr>

        <tr>
          <td>行业资质证书</td>
          <td>
            <a-form-model-item label="" prop="certificationResult">
              <a-input v-model="form.certificationResult" placeholder="辅助说明" />
            </a-form-model-item>
          </td>
          <td style="text-align:left;">
            <a-form-model-item label="">
              <UploadFile
                key="image"
                ref="uploadImage"
                :config="uploadImageConfig"
                @change="fileList => fileChange(fileList, 'certificationAnnex')"
              />
            </a-form-model-item>
          </td>
        </tr>

        <tr>
          <td>负面消息数量</td>
          <td>
            <div style="display:flex;line-height:40px;">
              <a-form-model-item label="" prop="downsideNum">
                <a-input v-model="form.downsideNum" />
              </a-form-model-item>
              <span style="margin-left:10px;">条</span>
            </div>
          </td>
          <td style="text-align:left;">
            <a-form-model-item label="">
              <UploadFile
                key="image"
                ref="uploadImage"
                :config="uploadImageConfig"
                @change="fileList => fileChange(fileList, 'downsideAnnex')"
              />
            </a-form-model-item>
          </td>
        </tr>

        <tr>
          <td>负面消息等级</td>
          <td>
            <div style="display:flex;line-height:40px;">
              <a-form-item label="">
                <a-select style="width: 100px" v-model="form.downsideLevel" placeholder="选择负面消息等级">
                  <a-select-option :value="0">无</a-select-option>
                  <a-select-option :value="1">低</a-select-option>
                  <a-select-option :value="2">中</a-select-option>
                  <a-select-option :value="3">高</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-model-item label="" prop="downsideDesc" style="margin:0 10px;">
                <a-input style="width: 200px" v-model="form.downsideDesc" placeholder="辅助说明" />
              </a-form-model-item>
              <span>等级越高风险越大</span>
            </div>
          </td>
          <td style="text-align:left;"></td>
        </tr>
      </table>
    </a-form-model>
  </div>
</template>

<script>
import UploadFile from './UploadFile'
export default {
  name: 'handleInfo',
  components: {
    UploadFile
  },
  data() {
    return {
      form: {},
      rules: {},
      uploadImageConfig: {
        maxFileCount: 3,
        fileType: 'file', // file img
        enableCompress: false,
        enablePreview: false,
        showFileList: true,
        fileValidate: () => false,
        btn: {
          text: '上传文件',
          attr: {
            icon: 'upload',
            type: 'link'
          }
        }
      }
    }
  },
  methods: {
    fileChange(fileList, attrName) {
      const that = this
      that.form = {
        ...that.form,
        [attrName]: fileList.map(f => f.url).join(',')
      }
    },
    validate() {
      const that = this
      return new Promise(resolve => {
        that.$refs.ruleForm.validate(valid => {
          if (valid) {
            resolve({
              code:0,
              result:{
                facInfoExploreBo:{...that.form}
              }
            })
          } else {
            resolve({
              code:500,
              result:{}
            })
          }
        });
      })
    }
  }
}
</script>

<style scoped>
.__fac_info_wrapper__ >>> .ant-form-item {
  margin-bottom: 0;
}
.steps-action {
  text-align: center;
  margin-top: 20px;
}
.steps-action >>> .ant-btn {
  margin: 0 5px;
}
.custom-table-border th,
.custom-table-border td {
  padding: 10px;
}
</style>
