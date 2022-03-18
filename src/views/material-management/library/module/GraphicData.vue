<template>
  <div>
    <h3>
      <span>图形数据</span>
    </h3>
    <table class="custom-table custom-table-border">
      <tr>
        <td>物料二维码</td>
        <td>
          <img
            class="img-item"
            @click="showImg(materialQrCode)"
            :src="materialQrCode"
            style="width:128px;height:128px;"
            alt="物料二维码"
          >
        </td>
        <td>外购自带二维码</td>
        <td>
          <template v-if="normalAddForm.isAdd || normalAddForm.isEdit">
            <UploadFile
              ref="outsourcingQrCode"
              :config="uploadConfig"
              @change="(files) => fileChange('outsourcingQrCode',files)"
            />
          </template>
          <template v-else>
            <span v-if="materialDiagram.outsourcingQrCode">
              <img
                class="img-item"
                @click="showImg(materialDiagram.outsourcingQrCode)"
                :src="materialDiagram.outsourcingQrCode"
                alt="外购自带二维码"
              >
            </span>
            <span v-else>
              未上传图片
            </span>
          </template>
        </td>
      </tr>

      <tr>
        <td>检验贴</td>
        <td>
          <template v-if="normalAddForm.isAdd || normalAddForm.isEdit">
            <UploadFile
              ref="checkingCode"
              :config="uploadConfig"
              @change="(files) => fileChange('checkingCode',files)"
            />
          </template>
          <template v-else>
            <span v-if="materialDiagram.checkingCode">
              <img
                class="img-item"
                @click="showImg(materialDiagram.checkingCode)"
                :src="materialDiagram.checkingCode"
                alt="检验贴"
              >
            </span>
            <span v-else>
              未上传图片
            </span>
          </template>
        </td>
        <td>库存箱二维码</td>
        <td>
          <template v-if="normalAddForm.isAdd || normalAddForm.isEdit">
            <UploadFile
              ref="inventoryQrCode"
              :config="uploadConfig"
              @change="(files) => fileChange('inventoryQrCode',files)"
            />
          </template>
          <template v-else>
            <span v-if="materialDiagram.inventoryQrCode">
              <img
                class="img-item"
                @click="showImg(materialDiagram.inventoryQrCode)"
                :src="materialDiagram.inventoryQrCode"
                alt="库存箱二维码"
              >
            </span>
            <span v-else>
              未上传图片
            </span>
          </template>
        </td>
      </tr>

      <tr>
        <td>
          <span>物料图片</span>
        </td>
        <td colspan="3">
          <template v-if="normalAddForm.isAdd || normalAddForm.isEdit">
            <UploadFile
              ref="materialPhoto"
              :config="uploadConfig3"
              @change="(files) => fileChange('materialPhoto',files)"
            />
          </template>
          <template v-else>
            <span v-if="materialPhotoArray.length > 0">
              <img
                class="img-item"
                v-for="url in materialPhotoArray"
                :key="url"
                @click="showImg(url)"
                :src="url"
                alt="物料图片"
              >
            </span>
            <span v-else>
              未上传图片
            </span>
          </template>
        </td>
      </tr>
    </table>
    <ImgView
      ref="imgView"
      title="预览"
    />
  </div>
</template>

<script>
import UploadFile from './UploadFile'
import ImgView from '@/components/CustomerList/ImgView'

export default {
  name: 'GraphicData',
  inject: ['normalAddForm'],
  components: {
    UploadFile,
    ImgView
  },
  data() {
    return {
      uploadConfig: {
        maxFileCount: 1,
        fileType: 'img',
        enablePreview: true
      },
      uploadConfig3: {
        maxFileCount: 3,
        fileType: 'img',
        enablePreview: true
      },
      materialDiagram: {
        materialQrCode: '',
        outsourcingQrCode: '',
        checkingCode: '',
        inventoryQrCode: '',
        materialPhoto1: '',
        materialPhoto2: '',
        materialPhoto3: ''
      }
    }
  },
  computed: {
    materialQrCode() {
      let { materialQrCode, materialDiagram } = this.normalAddForm.submitParams
      if (materialQrCode) {
        return materialQrCode
      } else if (materialDiagram && materialDiagram.materialQrCode) {
        return materialDiagram.materialQrCode
      } else {
        return ''
      }
    },
    materialPhotoArray() {
      let arr = []
      let { materialPhoto1, materialPhoto2, materialPhoto3 } = this.materialDiagram
      if (materialPhoto1) {
        arr.push(materialPhoto1)
      }
      if (materialPhoto2) {
        arr.push(materialPhoto2)
      }
      if (materialPhoto3) {
        arr.push(materialPhoto3)
      }
      return arr
    }
  },
  created() {
    const that = this
    let materialDiagram = that.normalAddForm.submitParams.materialDiagram
    if (!materialDiagram) {
      return
    }
    that.materialDiagram = materialDiagram
    let refs = ['outsourcingQrCode', 'checkingCode', 'inventoryQrCode', 'materialPhoto']
    that.$nextTick(() => {
      refs.map(ref => {
        if (ref === 'materialPhoto') {
          let files = []
          if (materialDiagram[`${ref}1`]) {
            files.push({ url: materialDiagram[`${ref}1`] })
          }
          if (materialDiagram[`${ref}2`]) {
            files.push({ url: materialDiagram[`${ref}2`] })
          }
          if (materialDiagram[`${ref}3`]) {
            files.push({ url: materialDiagram[`${ref}3`] })
          }
          that.$refs[ref] && that.$refs[ref].setFiles(files)
        } else if (materialDiagram[ref]) {
          that.$refs[ref] && that.$refs[ref].setFiles([
            {
              url: materialDiagram[ref]
            }
          ])
        }
      })
    })
  },
  methods: {
    fileChange(field, files) {
      const that = this
      let isSp = 'materialPhoto' === field
      let _files = files.filter(f => f && f.status === 'done')
      if (_files && _files.length > 0) {
        _files.map((_f, idx) => {
          that.materialDiagram[isSp ? `${field}${idx + 1}` : `${field}`] = _f.url
        })
      } else {
        if (isSp) {
          that.materialDiagram = {
            ...that.materialDiagram,
            materialPhoto1: '',
            materialPhoto2: '',
            materialPhoto3: ''
          }
        } else {
          that.materialDiagram[`${field}`] = ''
        }
      }
    },
    validate() {
      const that = this
      return new Promise((resolve, reject) => {
          let id = that.normalAddForm.getId()
          resolve({
            ...that.materialDiagram,
            materialQrCode: that.materialDiagram.materialQrCode 
              ? that.materialDiagram.materialQrCode  
              : that.normalAddForm.submitParams.materialQrCode,
            // id
          })
        // let { materialPhoto1, materialPhoto2, materialPhoto3 } = that.materialDiagram
        // if (materialPhoto1 || materialPhoto2 || materialPhoto3) {
        //   let id = that.normalAddForm.getId()
        //   resolve({
        //     ...that.materialDiagram,
        //     materialQrCode: that.normalAddForm.submitParams.materialQrCode,
        //     id
        //   })
        // } else {
        //   that.$message.info('图形数据未上传物料图片')
        //   resolve(null)
        // }
      })
    },
    showImg(url) {
      // let imgList = res.data.fileUrl.split(',').map(url => decodeURIComponent(url))
      this.$refs.imgView.show(url)
    }
  }
}
</script>

<style scoped>
.custom-table-border th,
.custom-table-border td {
  padding: 5px;
}
.custom-table-border caption {
  text-align: left;
}
.icon-required::before {
  display: inline-block;
  margin-right: 4px;
  color: #f5222d;
  font-size: 14px;
  font-family: SimSun, sans-serif;
  line-height: 1;
  content: '*';
}
.img-item {
  width: auto;
  max-width: 128px;
  box-shadow: 0 0 6px 3px #ddd;
  border-radius: 3px;
  padding: 5px;
  margin-right: 20px;
  cursor: pointer;
}
</style>
