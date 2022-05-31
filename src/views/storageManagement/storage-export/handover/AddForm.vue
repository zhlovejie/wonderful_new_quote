<template>
  <a-modal
    :title="modalTitle"
    :width="1000"
    :visible="visible"
    :destroyOnClose="true"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :maskClosable="false"
    :confirmLoading="spinning"
    :footer="null"
    :forceRender="true"
  >
    <!-- a-spin:loading 状态, spinning:是否为加载中状态 -->
    <a-spin :spinning="spinning">
      <!-- a-form-model:使用:model 来绑定整个表单的数据，使用:rules来绑定整个表单的校验 -->
      <a-form-model ref="ruleForm" :rules="validatorRules" :model="detail" class="gift-form-wrapper">
        <div class="__hd">基本信息</div>
        <table rowKey="id" class="custom-table custom-table-border">
          <tr>
            <td style="width:150px;">出库单号</td>
            <td style="width:350px;">
              <a-form-model-item>
                {{ detail.exWarehouseNo }}
              </a-form-model-item>
            </td>
            <td style="width:150px;">委外加工单号</td>
            <td style="width:350px;">
              <a-form-model-item>
                {{ detail.orderNo?detail.orderNo:'' }}
              </a-form-model-item>
            </td>
          </tr>
          <tr>
            <td style="width:150px;">加工商名称</td>
            <td style="width:350px;">
              <a-form-model-item>
                {{ detail.facName?detail.facName:'' }}
              </a-form-model-item>
            </td>
            <td style="width:150px;">原料送取</td>
            <td style="width:350px;">
              <a-form-model-item>
                加工商提货
              </a-form-model-item>
            </td>
          </tr>
        </table>

        <div class="__hd">物料信息</div>
        <div class="__bd" v-if="detail.exWarehouseMaterialList">
          <a-table
            rowKey="id"
            :columns="columns"
            :dataSource="detail.exWarehouseMaterialList"
            :pagination="false"
            size="small"
          >
            <div slot="order" slot-scope="text, record, index">
              {{ index + 1 }}
            </div>
            <template slot="footer">
              <div class="totle">
                合计:交接数量 &nbsp;{{
                  detail.exWarehouseMaterialList.reduce(
                    (adder, item) => adder + (parseFloat(item.exWarehouseNum) || 0),
                    0
                  )
                }}
              </div>
            </template>
          </a-table>
        </div>

        <div class="__hd">货物信息</div>
        <table class="custom-table custom-table-border">
          <tr>
            <td style="width:150px;">包裹数量</td>
            <td style="width:350px;">
              <a-form-model-item prop="parcelQuantity">
                <a-input v-if="!isView" class="numinput" placeholder="请输入包裹数量" v-model="detail.parcelQuantity" />
                <span v-else>{{ detail.parcelQuantity }}</span>
              </a-form-model-item>
            </td>
          </tr>
          <tr>
            <td style="width:150px;">图片</td>
            <td style="width:550px;">
              <a-form-model-item>
                <a-upload
                  key=""
                  :disabled="isView"
                  :action="uploadPath"
                  accept=".png, .jpg"
                  list-type="picture-card"
                  :file-list="fileList"
                  @preview="handlePreview"
                  @change="handleChange"
                >
                  <div v-if="!isView && fileList.length < 6">
                    <a-icon type="plus" />
                    <div class="ant-upload-text">上传</div>
                  </div>
                </a-upload>
                <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancelPreview">
                  <img alt="example" style="width: 100%" :src="previewImage" />
                </a-modal>
              </a-form-model-item>
            </td>
          </tr>
        </table>

        <div class="__hd">备注</div>
        <a-form-model-item>
          <a-textarea
            v-if="!isView"
            class="remark"
            :disabled="isView"
            v-model="detail.remark"
            placeholder="请输入备注信息"
            :rows="4"
          />
          <span v-else>{{ detail.remark }}</span>
        </a-form-model-item>
        <div class="__hd">交接信息</div>
        <table class="custom-table custom-table-border">
          <tr>
            <td style="width:150px;">交货人</td>
            <td style="width:350px;">
              <a-form-model-item>
                {{ detail.createdName }}
              </a-form-model-item>
            </td>
            <td style="width:150px;">交货/提货时间</td>
            <td style="width:350px;">
              <a-form-model-item>
                {{ detail.createdTime }}
              </a-form-model-item>
            </td>
          </tr>
          <tr>
            <td style="width:150px;">接货人</td>
            <td style="width:350px;">
              <a-form-model-item prop="handUserName">
                <a-input
                  v-if="!isView"
                  :bordered="false"
                  placeholder="请输入接货人姓名"
                  :max-length="6"
                  v-model="detail.handUserName"
                />
                <span v-else>{{ detail.handUserName?detail.handUserName:'' }}</span>
              </a-form-model-item>
            </td>
            <td style="width:150px;">手机号</td>
            <td style="width:350px;">
              <a-form-model-item prop="handUserTel">
                <a-input
                  v-if="!isView"
                  :bordered="false"
                  placeholder="请输入接货人手机号"
                  :max-length="11"
                  v-model="detail.handUserTel"
                />
                <span v-else>{{ detail.handUserTel?detail.handUserTel:''}}</span>
              </a-form-model-item>
            </td>
          </tr>
        </table>

        <div class="__footer">
          <a-button @click="handleSubmit('cancel')">取消</a-button>
          <a-button v-if="!isView" @click="handleSubmit('submit')" type="primary">提交</a-button>
        </div>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
import {
  materialOutDetail, //原料出库申请单-详情
  materialHandoverDetail, //交接单-详情
  materialHandoverAdd //交接单-新增/编辑
} from '@/api/material'
import { getUploadPath2 } from '@/api/common'
const uuid = () =>
  Math.random()
    .toString(16)
    .slice(-6) +
  Math.random()
    .toString(16)
    .slice(-6)
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}

const columns = [
  {
    title: '序号',
    key: 'order',
    width: '70px',
    scopedSlots: { customRender: 'order' }
  },
  {
    title: '属性',
    dataIndex: 'attributeText' //属性（1原材料 2模具）
  },
  {
    title: '物料代码',
    dataIndex: 'materialCode'
  },
  {
    title: '物料名称',
    dataIndex: 'materialName'
  },
  {
    title: '规格型号',
    dataIndex: 'specification'
  },
  {
    title: '使用计量单位',
    dataIndex: 'subUnit'
  },
  {
    title: '交接数量',
    dataIndex: 'exWarehouseNum'
  }
]

export default {
  name: 'Stock_management_export_handover-addForm',
  components: {},
  data() {
    return {
      previewVisible: false, // 图片预览框是否可见
      previewImage: '', //  预览图片的src值
      fileList: [],
      uploadPath: getUploadPath2(), // 上传图片的url
      columns,
      visible: false,
      spinning: false,
      detail: {},
      type: 'view',
      validatorRules: {
        parcelQuantity: {
          rules: [
            {
              required: true,
              message: '请输入包裹数量'
            }
          ]
        },
        handUserName: {
          rules: [
            {
              required: true,
              message: '请输入接货人姓名'
            }
          ]
        },
        handUserTel: {
          rules: [
            {
              required: true,
              message: '请输入接货人手机号'
            }
          ]
        }
      }
    }
  },
  computed: {
    modalTitle() {
      const action = this.isView ? '查看' : '新增'
      return `${action}-交接单`
    },
    isView() {
      return this.type === 'view'
    }
  },
  methods: {
    //type:view/del/add
    async query(type, record) {
      const that = this
      that.visible = true
      that.type = type
      that.detail = { ...record }
      if (this.isView) {
        //交接单-查看详情
        materialHandoverDetail({ id: this.detail.id }).then(res => {
          that.detail = { ...res.data }
          let arr = (res.data.picUrl || '').split(',')
          that.fileList = arr.map(item => {
            return {
              uid: uuid(),
              url: item,
              status: 'done',
              name: '1'
            }
          })
        })
      } else {
        //原料出库申请单-查看详情 交接仅展示加工商提货的 sendType参数吧 传1委托方送货 2加工商提货
        materialOutDetail({ id: this.detail.id, sendType:2}).then(res => {
          let data = res.data
          that.detail = { ...data, parcelQuantity: '1', handUserName: '', handUserTel: '' }
          that.detail.exWarehouseMaterialList = data.exWarehouseMaterialList.map(item => {
            (item.attributeText = { 1: '原材料', 2: '模具' }[item.attribute] || '未知')
            return item
          })
        })
      }
    },
    //操作-取消/提交
    handleSubmit(type) {
      const that = this
      if (type === 'cancel') {
        that.handleCancel()
      } else if (type === 'submit') {
        that.$refs['ruleForm'].validate(valid => {
          if (valid) {
            if (that.fileList.length === 0) {
              return that.$message.error('请上传设备图片')
            }
            let arrUrl = []
            this.fileList.map(itme => {
              if (itme.response) {
                arrUrl.push(itme.response.data)
              } else {
                arrUrl.push(itme.url)
              }
            })
           
            let params = {
              exWarehouseId:that.detail.id,
              exWarehouseNo:that.detail.exWarehouseNo,
              remark:that.detail.remark,
              parcelQuantity:parseInt(that.detail.parcelQuantity),
              handUserName:that.detail.handUserName,
              handUserTel:that.detail.handUserTel,
              picUrl: arrUrl.toString()
            }
            console.log(params)
            that.spinning = true
            materialHandoverAdd(params)
              .then(res => {
                that.spinning = false
                that.$message.info(res.msg)
                if (res.code === 200) {
                  that.$emit('ok')
                  that.handleCancel()
                }
              })
              .catch(err => {
                that.spinning = false
                that.$message.error(err.message)
              })
          } else {
            console.log('校验失败')
            return false
          }
        })
      }
    },
    //取消弹窗
    handleCancel() {
      const that = this
      that.$nextTick(() => {
        that.visible = false
      })
    },
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj)
      }
      this.previewImage = file.url || file.preview
      this.previewVisible = true
    },
    handleChange({ fileList }) {
      this.fileList = fileList
    },
    //取消预览
    handleCancelPreview() {
      this.previewVisible = false
    }
  }
}
</script>

<style scoped>
.custom-table-border th,
.custom-table-border td {
  padding: 5px;
}
.custom-table-border {
  margin-top: 5px;
}
.gift-form-wrapper >>> .ant-form-item {
  margin-bottom: 0;
}
.__hd {
  font-size: 16px;
}
.__bd {
  margin-top: 5px;
  margin-bottom: 20px;
}
.__footer {
  text-align: center;
  margin-top: 20px;
}
.__footer * {
  margin: 0 5px;
}
.totle {
  margin-right: 20px;
  text-align: right;
  font-size: 16px;
}
.remark {
  border: 1px solid lightgrey;
  border-radius: 5px;
  margin-top: 5px;
  margin-bottom: 10px;
}
.numinput {
  width: 100%;
}
</style>
