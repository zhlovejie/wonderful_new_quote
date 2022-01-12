<template>
  <a-modal
    :title="modalTitle"
    :width="1000"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <a-spin :spinning="confirmLoading">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" class="addform-wrapper">
        <h3>基本信息</h3>
        <table class="custom-table custom-table-border">
          <tr>
            <td class="requiredMark">站台代码</td>
            <td>
              <a-form-model-item prop="platformCode" v-if="!isDisabled">
                <a-input v-model="form.platformCode" :disabled="isEdit" :maxLength="4" />
              </a-form-model-item>
              <span v-else>
                {{ detail.platformCode }}
              </span>
            </td>
            <td class="requiredMark">站台名称</td>
            <td>
              <a-form-model-item prop="platformName" v-if="!isDisabled">
                <a-input v-model="form.platformName" />
              </a-form-model-item>
              <span v-else>
                {{ detail.platformName }}
              </span>
            </td>
          </tr>
          <tr>
            <td style="width: 160px" class="requiredMark">站台位置</td>
            <td>
              <a-form-model-item prop="warehouseId" v-if="!isDisabled" style="width: 50%; float: left">
                <a-select v-model="form.warehouseId" @change="warehchange">
                  <a-select-option v-for="item in warehouseList" :key="item.id" :value="item.id">{{
                    item.warehouseName
                  }}</a-select-option>
                </a-select>
              </a-form-model-item>
              <a-form-model-item prop="reservoirAreaId" v-if="!isDisabled" style="width: 50%; float: left">
                <a-select v-model="form.reservoirAreaId">
                  <a-select-option v-for="item in ReservoiList" :key="item.id" :value="item.id">{{
                    item.reservoirName
                  }}</a-select-option>
                </a-select>
              </a-form-model-item>
              <span v-else>
                {{ detail.warehouseName + '-----' + detail.reservoirAreaName }}
              </span>
            </td>
            <td class="requiredMark">负责人</td>
            <td>
              <a-form-model-item prop="applyUser" v-if="!isDisabled">
                <DepartmentUserCascade allowClear :info.sync="form.applyUser" />
              </a-form-model-item>
              <span v-else> {{ detail.headDepartmentName }}----{{ detail.headUserName }} </span>
            </td>
          </tr>
          <tr>
            <td class="requiredMark">类别</td>
            <td>
              <a-form-model-item v-if="!isDisabled">
                <a-select placeholder="仓库类型" v-model="form.platformType">
                  <a-select-option :value="0">收货</a-select-option>
                  <a-select-option :value="1">发货</a-select-option>
                </a-select>
              </a-form-model-item>
              <span v-else>
                {{ detail.platformType === 0 ? '收货' : '发货' }}
              </span>
            </td>
            <td>负责人电话</td>
            <td>
              {{ form.headUserPhone }}
            </td>
          </tr>
          <tr>
            <td>二维码</td>
            <td>
              <img v-if="qrcodeUrl" :src="qrcodeUrl" alt="" srcset="" />
              <span v-else>系统自动生成</span>
            </td>
            <td style="width: 160px">备注</td>
            <td>
              <a-form-model-item v-if="!isDisabled">
                <a-input v-model="form.remark" type="textarea" />
              </a-form-model-item>
              <span v-else>
                {{ detail.remark }}
              </span>
            </td>
          </tr>
        </table>
      </a-form-model>
      <div style="position: absolute; left: -99999px" class="wuliao-qr-code-wrapper">
        <vue-qr :text="qrText" :size="qrSize" :callback="qrChangeHandler"></vue-qr>
      </div>
    </a-spin>
  </a-modal>
</template>

<script>
import { getList, ReservoiGetList, platformaddOrUpdate, platformgetDetailById } from '@/api/storage'
import { customUpload } from '@/api/common'
import DepartmentUserCascade from '@/components/CustomerList/DepartmentUserCascade'
import VueQr from 'vue-qr'
export default {
  name: 'EnterpriseSynopsis',
  components: {
    DepartmentUserCascade,
    VueQr,
  },
  data() {
    return {
      Warehouse: [],
      warehouseList: [],
      ReservoiList: [],
      visible: false,
      ifdelvali: false,
      confirmLoading: false,
      addOredit: 'add',
      record: {},
      form: {
        platformType: 0,
      },
      qrText: '',
      qrSize: 150,
      qrcodeUrl: '',
      wuliaoQrUrl: undefined,
      detail: {},
      rules: {
        warehouseId: [{ required: true, message: '请选择所属仓库', trigger: 'change' }],
        reservoirAreaId: [{ required: true, message: '请选择所属库区', trigger: 'change' }],
        applyUser: [{ required: true, message: '请选择负责人' }],
        platformCode: [{ required: true, message: '请输入站台代码', trigger: 'blur' }],
        platformName: [{ required: true, message: '请输入站台名称', trigger: 'blur' }],
      },
    }
  },

  watch: {
    form: {
      handler(newValue, oldValue) {
        this.form.headUserPhone = newValue.applyUser && newValue.applyUser.mobile ? newValue.applyUser.mobile : ''
      },
      deep: true,
    },
  },

  computed: {
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
      //修改
      return this.addOredit === 'edit'
    },
    isDisabled() {
      return this.isView
    },
  },
  methods: {
    warehchange(opt) {
      this.form = {
        ...this.form,
        reservoirAreaId: undefined,
      }
      ReservoiGetList({ warehouseId: opt }).then((res) => {
        this.ReservoiList = res.data
      })
    },
    async query(type, record) {
      this.visible = true
      this.addOredit = type
      this.record = record
      this.form.remark = ''
      await getList().then((res) => {
        this.warehouseList = res.data
      })

      if (type !== 'add') {
        let that = this
        await platformgetDetailById({ id: record.id })
          .then((res) => {
            that.spinning = false
            that.detail = res.data
            this.warehchange(res.data.warehouseId)
            that.form = {
              ...that.detail,
              applyUser: {
                depId: that.detail.headDepartmentId,
                depName: that.detail.headDepartmentName,
                userId: that.detail.headUserId,
                userName: that.detail.headUserName,
                mobile: that.detail.headUserPhone,
              },
            }
          })
          .catch((err) => {
            that.spinning = false
            that.$message.error(err)
          })
        that.qrText = record.platformCode
        await that.wuliaoQrUrlReady()
        let materialQrCode = that.wuliaoQrUrl
        console.log(that.wuliaoQrUrl)
        if (!materialQrCode) {
          that.$message.info('容器/托盘二维码生成失败，请联系管理员。')
          return
        } else {
          this.qrcodeUrl = materialQrCode
        }
      }
    },

    handleOk() {
      const _this = this
      if (this.isView) {
        return (this.visible = false)
      }
      _this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          let { depId, depName, userId, userName } = _this.form.applyUser
          let { platformCode, platformName, remark, headUserPhone, platformType, warehouseId, reservoirAreaId } =
            _this.form
          let baseInfo = {
            platformCode,
            platformName,
            warehouseId,
            reservoirAreaId,
            headUserPhone,
            headDepartmentId: depId,
            headDepartmentName: depName,
            headUserId: userId,
            headUserName: userName,
            remark,
            platformType,
          }
          if (this.isEdit) {
            baseInfo.id = this.record.id
          }
          _this.confirmLoading = true
          platformaddOrUpdate(baseInfo)
            .then((res) => {
              if (res.code == 200) {
                _this.confirmLoading = false
                _this.$message.success('保存成功')
                this.$emit('ok')
                this.$refs.ruleForm.resetFields() // 清空表
                this.visible = false
              } else {
                _this.confirmLoading = false
                _this.$message.error(res.msg)
              }
            })
            .catch(() => {})
        }
      })
    },
    previewCancel() {
      this.previewVisible = false
    },
    handleCancel() {
      this.$refs.ruleForm.resetFields() // 清空表
      this.visible = false
    },
    async qrChangeHandler(dataUrl, id) {
      const that = this
      console.log(`qrChangeHandler called`, arguments)
      that.tip = '生成容器/托盘二维码...'
      that.spinning = true
      if (dataUrl) {
        let file = await new Promise((resolve) => {
          setTimeout(function () {
            let img = document.querySelector('.wuliao-qr-code-wrapper > img')
            if (!img) {
              resolve(null)
              return
            }
            let canvas = document.createElement('canvas')
            let context = canvas.getContext('2d')
            canvas.width = that.qrSize
            canvas.height = that.qrSize
            context.clearRect(0, 0, that.qrSize, that.qrSize)
            context.drawImage(img, 0, 0, that.qrSize, that.qrSize)
            let fileType = 'image/png'
            canvas.toBlob(
              (blob) => {
                resolve(new File([blob], 'wuliao_qr.png', { type: fileType }))
              },
              fileType,
              0.92
            )
          }, 150)
        })
        if (file !== null) {
          const formData = new FormData()
          formData.append('file', file)
          let url = await customUpload(formData).then((res) => res.data)
          that.spinning = false
          that.wuliaoQrUrl = url
          return url
        } else {
          that.wuliaoQrUrl = null
          that.spinning = false
          return null
        }
      } else {
        that.spinning = false
        that.wuliaoQrUrl = null
        return null
      }
    },
    wuliaoQrUrlReady() {
      const that = this
      let timer = null
      let t1 = Date.now()
      let max = 1000 * 3
      return new Promise((resolve) => {
        timer = setInterval(function () {
          if (typeof that.wuliaoQrUrl === 'string' && that.wuliaoQrUrl.length > 0) {
            clearInterval(timer)
            resolve(that.wuliaoQrUrl)
          }
          let t2 = Date.now()
          if (t2 - t1 >= max) {
            clearInterval(timer)
            resolve(null)
          }
        }, 250)
      })
    },
  },
}
</script>

<style scoped >
/* you can make up upload button and sample style by using stylesheets */
.requiredMark::before {
  display: inline-block;
  margin-right: 4px;
  color: #f5222d;
  font-size: 14px;
  font-family: SimSun, sans-serif;
  line-height: 1;
  content: '*';
}
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
