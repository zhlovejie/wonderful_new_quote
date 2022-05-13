<template>
  <!-- 注：编辑状态只有备注可修改，其他没有可动的 -->
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
      <a-form-model ref="ruleForm" :model="detail" class="gift-form-wrapper">
        <div class="__hd">基本信息</div>
        <table rowKey="id" class="custom-table custom-table-border">
          <tr>
            <td style="width:150px;">检验单号</td>
            <td style="width:350px;">
              <a-form-model-item>
                {{ detail.inspectionNo }}
              </a-form-model-item>
            </td>
            <td style="width:150px;">委外加工单号</td>
            <td style="width:350px;">
              <a-form-model-item>
                {{ detail.orderNo }}
              </a-form-model-item>
            </td>
          </tr>
          <tr>
            <td style="width:150px;">加工商名称</td>
            <td style="width:350px;">
              <a-form-model-item>
                {{ detail.facName }}
              </a-form-model-item>
            </td>
            <td style="width:150px;">加工商地址</td>
            <td style="width:350px;">
              <a-form-model-item>
                加工商地址需要后台返回
              </a-form-model-item>
            </td>
          </tr>
          <tr>
            <td style="width:150px;">业务员</td>
            <td style="width:350px;">
              <a-form-model-item>
                业务员名称后台返回
              </a-form-model-item>
            </td>
            <td style="width:150px;">业务员电话</td>
            <td style="width:350px;">
              <a-form-model-item>
                业务员电话后台返回
              </a-form-model-item>
            </td>
          </tr>
        </table>

        <div class="__hd">物料信息</div>
        <div class="__bd">
          <a-table
            rowKey="id"
            :columns="columns"
            :dataSource="[detail.inspectionMaterialVo]"
            :pagination="false"
            size="small"
          >
            <div slot="order" slot-scope="text, record, index">
              {{ index + 1 }}
            </div>
          </a-table>
        </div>

        <div class="__hd">检验结果</div>
        <table class="custom-table custom-table-border">
          <tr>
            <td style="width:150px;">检测结果</td>
            <td style="width:550px;">
              <a-form-model-item>
                <span v-if="isView">{{ detail.detectionResult }}</span>
                <a-select v-else placeholder="请选择检测结果" v-model="detail.detectionResult" :allowClear="true">
                  <a-select-option :value="1">合格</a-select-option>
                  <a-select-option :value="0">不合格</a-select-option>
                </a-select>
              </a-form-model-item>
            </td>
          </tr>
          <tr>
            <td style="width:150px;">检测说明</td>
            <td style="width:550px;">
              <a-form-model-item>
                <span v-if="isView">{{ detail.detectionExplain }}</span>
                <a-input
                  v-else
                  v-model="detail.detectionExplain"
                  placeholder="请输入详细的检测说明"
                  :allowClear="true"
                />
              </a-form-model-item>
            </td>
          </tr>
          <tr>
            <td style="width:150px;">检测图片</td>
            <td style="width:550px;height:200px;">
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
          <tr>
            <td style="width:150px;">备注</td>
            <td style="width:550px;">
              <a-form-model-item>
                <span v-if="isView">{{ detail.remark }}</span>
                <a-input v-else v-model="detail.remark" placeholder="请输入备注信息" :allowClear="true" />
              </a-form-model-item>
            </td>
          </tr>
        </table>

        <div class="__hd">操作记录</div>
        <table class="custom-table custom-table-border">
          <tr>
            <td style="width:150px;">报检人</td>
            <td style="width:350px;">
              <a-form-model-item>
                {{ detail.createdName }}
              </a-form-model-item>
            </td>
            <td style="width:150px;">报检时间</td>
            <td style="width:350px;">
              <a-form-model-item>
                {{ detail.createdTime }}
              </a-form-model-item>
            </td>
          </tr>
          <tr>
            <td style="width:150px;">检测人</td>
            <td style="width:350px;">
              <a-form-model-item>
                {{ detail.inspectionUserName }}
              </a-form-model-item>
            </td>
            <td style="width:150px;">检测时间</td>
            <td style="width:350px;">
              <a-form-model-item>
                {{ detail.inspectionTime }}
              </a-form-model-item>
            </td>
          </tr>
        </table>

        <div class="__footer">
          <a-button @click="handleSubmit('cancel')">取消</a-button>
          <a-button v-if="!isView" @click="handleSubmit('save')" type="primary">保存</a-button>
          <a-button v-if="!isView" @click="handleSubmit('submit')" type="primary">完结</a-button>
        </div>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
import {
  materialFirstDetail, //委外原料首检-详情
  materialFirstAdd //委外原料首检-新增/编辑
} from '@/api/material'
import { getUploadPath2 } from '@/api/common'
const uuid = () => Math.random().toString(16).slice(-6) + Math.random().toString(16).slice(-6)
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
  }
]

export default {
  name: 'materia-first-addForm',
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
      detail: {
        materialList: [] //物料信息
      },
      type: 'view'
    }
  },
  computed: {
    modalTitle() {
      const action = this.isView ? '查看' : '处理'
      return `${action}-委外原料首检单`
    },
    isView() {
      return this.type === 'view'
    }
  },
  methods: {
    //type:view/del
    async query(type, record) {
      const that = this
      that.visible = true
      that.type = type
      that.detail = { ...record }
      if (this.detail) {
        //委外原料首检-查看详情
        materialFirstDetail({ id: this.detail.id }).then(res => {
          that.detail = { ...res.data }
          let arr = (res.data.detectionPic || '').split(',')
          that.fileList = arr.map(item => {
            return {
              uid: uuid(),
              url: item,
              status: 'done',
              name: '1'
            }
          })
        })
      }
    },
    //操作-取消/保存/完结  operationType:操作类型1、保存 2、完结
    handleSubmit(type) {
      const that = this
      if (type === 'cancel') {
        that.handleCancel()
      } else if (type === 'save' || type === 'submit') {
        if (type === 'submit' && that.fileList.length === 0) {
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
          ...that.detail,
          operationType: type === 'save' ? 1 : 2,
          detectionPic:arrUrl.toString()
        }
        console.log(params)
        that.spinning = true
        materialFirstAdd(params)
          .then(res => {
            that.spinning = false
            console.log(res)
            that.visible = false
            that.$message.info(res.msg)
          })
          .catch(err => {
            that.spinning = false
            that.$message.error(err.message)
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
</style>
