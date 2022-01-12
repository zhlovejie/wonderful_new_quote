<template>
  <a-modal
    :title="modalTitle"
    :width="1250"
    :visible="visible"
    :destroyOnClose="true"
    :footer="null"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <a-spin :spinning="spinning">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" class="routine-addform-wrapper-baseInnerData">
        <h3>基本数据</h3>
        <table class="custom-table custom-table-border">
          <tbody>
            <tr>
              <td style="width: 150px">
                <span>单据编号</span>
              </td>
              <td style="width: 255px">
                <a-form-model-item>
                  {{ txtDetail.purchaseNum }}
                </a-form-model-item>
              </td>
              <td style="width: 150px">
                <span>不良品处置单号</span>
              </td>
              <td>
                <a-form-model-item>
                  {{ record.dealNum }}
                </a-form-model-item>
              </td>
              <td style="width: 150px">
                <span>供应商</span>
              </td>
              <td>
                <a-form-model-item>
                  {{ CheckDetail.supplierName }}
                </a-form-model-item>
              </td>
            </tr>

            <tr>
              <td style="width: 150px">
                <span>收料单号</span>
              </td>
              <td>
                <a-form-model-item>
                  {{ CheckDetail.receiveNum }}
                </a-form-model-item>
              </td>
              <td style="width: 150px">
                <span>采购单号</span>
              </td>
              <td>
                <a-form-model-item>
                  {{ CheckDetail.purchaseNum }}
                </a-form-model-item>
              </td>
              <td style="width: 150px">
                <span>收料仓库</span>
              </td>
              <td>
                <a-form-model-item>
                  {{ CheckDetail.storageName }}
                </a-form-model-item>
              </td>
            </tr>
            <tr>
              <td style="width: 150px">
                <span>检验人</span>
              </td>
              <td>
                <a-form-model-item>
                  {{ CheckDetail.checkUserName }}
                </a-form-model-item>
              </td>
              <td style="width: 150px">
                <span>检验时间</span>
              </td>
              <td colspan="3">
                <a-form-model-item>
                  {{ record.checkTime }}
                </a-form-model-item>
              </td>
            </tr>
          </tbody>
        </table>
        <h3>物料明细</h3>
        <table class="custom-table custom-table-border">
          <tbody>
            <tr>
              <th>序号</th>
              <th><a-form-model-item>物料代码 </a-form-model-item></th>
              <th>物料名称</th>
              <th>规格型号</th>
              <th>包装方式</th>
              <th>包内数量</th>
              <th>报检数量</th>
              <th>备注</th>
            </tr>
            <tr>
              <td>1</td>
              <td>
                <a-form-model-item>
                  {{ CheckDetail.materialCode }}
                </a-form-model-item>
              </td>
              <td>
                {{ CheckDetail.materialName }}
              </td>
              <td>
                <a-tooltip v-if="String(CheckDetail.specification).length > 5">
                  <template slot="title">{{ CheckDetail.specification }}</template>
                  {{ String(CheckDetail.specification).slice(0, 5) }}...
                </a-tooltip>
                <span v-else>{{ CheckDetail.specification }}</span>
              </td>
              <td>
                {{ CheckDetail.packageType }}
              </td>
              <td>
                {{ CheckDetail.packageCount }}
              </td>
              <td>
                {{ CheckDetail.reportNum }}
              </td>
              <td>
                {{ CheckDetail.remark }}
              </td>
            </tr>
          </tbody>
        </table>
        <div style="margin-top: 20px">
          <h3>检验结果</h3>
          <table class="custom-table custom-table-border">
            <tbody>
              <tr>
                <th><a-form-model-item>报检数量 </a-form-model-item></th>
                <th>检验数量</th>
                <th>合格数量</th>
                <th>不合格数量</th>
                <th>不良率</th>
              </tr>
              <tr>
                <td>
                  <a-form-model-item>
                    {{ CheckDetail.reportNum }}
                  </a-form-model-item>
                </td>
                <td>
                  {{ txtDetail.checkNum }}
                </td>
                <td>
                  {{ txtDetail.checkNum - CheckDetail.unqualifiedNum }}
                </td>
                <td>
                  {{ CheckDetail.unqualifiedNum }}
                </td>
                <td>
                  {{ (CheckDetail.unqualifiedNum / txtDetail.checkNum) * 100 }}%
                  <!-- 不合格数量/检验数量 -->
                </td>
              </tr>
            </tbody>
          </table>

          <h3>质检部处理结果</h3>
          <table class="custom-table custom-table-border" style="margin-top: 20px">
            <tbody>
              <tr>
                <td style="width: 150px">让步接收数量</td>
                <td>
                  <a-form-model-item>
                    <span>{{ txtDetail.compromiseNum }}</span>
                  </a-form-model-item>
                </td>
              </tr>
              <tr>
                <td>处理说明</td>
                <td colspan="3">
                  <a-form-model-item>
                    <span>{{ txtDetail.dealDesc }}</span>
                  </a-form-model-item>
                </td>
              </tr>
            </tbody>
          </table>
          <h3>处理结果</h3>
          <table class="custom-table custom-table-border" style="margin-top: 20px">
            <tbody>
              <tr>
                <td style="width: 150px">是否议价</td>
                <td>
                  <a-form-model-item
                    prop="disputeFlag"
                    :rules="{
                      required: true,
                      message: '请选择处理结果',
                    }"
                  >
                    <a-radio-group v-if="!isDisabled" v-model="form.disputeFlag">
                      <a-radio :value="1">是</a-radio>
                      <a-radio :value="0">否</a-radio>
                    </a-radio-group>
                    <span v-else>{{ { 1: '是', 0: '否' }[form.disputeFlag] }}</span>
                  </a-form-model-item>
                </td>
              </tr>
              <tr>
                <td style="width: 150px">折扣价格（元）</td>
                <td>
                  <a-form-model-item
                    prop="disputePrice"
                    :rules="{
                      required: true,
                      message: '请输折扣价格（元）',
                    }"
                  >
                    <a-input-number
                      style="width: 200px"
                      v-if="!isDisabled"
                      v-model="form.disputePrice"
                      :min="0"
                      :step="1"
                    />
                    <span v-else>{{ form.disputePrice }}</span>
                  </a-form-model-item>
                </td>
              </tr>
              <tr>
                <td>备注</td>
                <td colspan="3">
                  <a-form-model-item>
                    <a-textarea v-if="!isDisabled" v-model="form.remark" />
                    <span v-else>{{ form.remark }}</span>
                  </a-form-model-item>
                </td>
              </tr>
              <tr>
                <td>附件</td>
                <td colspan="3">
                  <a-form-model-item>
                    <UploadFile
                      :config="uploadImageConfig"
                      v-if="!isDisabled"
                      :ref="`noTicketEvidence_${form.disputeUrl}`"
                      @change="(fileList) => fileChange(fileList)"
                    />
                    <span v-else> <a href="javascript:void(0);" @click="docView(form.disputeUrl)">查看</a></span>
                  </a-form-model-item>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </a-form-model>
      <p style="text-align: center; margin-top: 20px">
        <a-button key="cancel" @click="() => handleCancel()">取消</a-button>
        <template v-if="isHandle">
          <a-button style="margin: 0 10px" key="save" type="primary" :loading="spinning" @click="() => handleSubmit(0)"
            >保存</a-button
          >
          <a-button style="margin: 0 10px" key="save1" type="primary" :loading="spinning" @click="() => handleSubmit(1)"
            >完结</a-button
          >
        </template>

        <a-button
          v-else
          style="margin: 0 10px"
          key="save"
          type="primary"
          :loading="spinning"
          @click="() => handleCancel()"
          >确定</a-button
        >
      </p>
    </a-spin>

    <ViewInspectionCriteria ref="viewInspectionCriteria" />
    <ViewInspectionRecords ref="viewInspectionRecords" />
    <XdocView ref="xdocView" />
  </a-modal>
</template>
<script>
import ImgViewList from '@/components/CustomerList/ImgViewList'
import UploadFile from './UploadFile'
import XdocView from './XdocView'
import moment from 'moment'
import CaseCadeArea from '@/components/CustomerList/CaseCadeArea'
import CommonDictionarySelect from '@/components/CustomerList/CommonDictionarySelect'
import ViewInspectionCriteria from './ViewInspectionCriteria'
import ViewInspectionRecords from './ViewInspectionRecords'
import { getPurchaseDisputeDealDetail, addAndUpdatePurchaseDisputeDeal } from '@/api/qualityTesting'

export default {
  name: 'approve-business-travel-addform',
  components: {
    UploadFile,
    ImgViewList,
    CaseCadeArea,
    CommonDictionarySelect,
    ViewInspectionCriteria,
    ViewInspectionRecords,
    XdocView,
  },
  data() {
    return {
      visible: false,
      type: 'add',
      record: {},
      CheckDetail: {},
      testDetail: {},
      txtDetail: {},
      getMaterialId: {},
      checkNum: undefined,
      form: {
        disputeUrl: undefined,
        remark: undefined,
        disputePrice: undefined,
        disputeFlag: undefined,
      },
      rules: {},
      approvalForm: {},
      travelCaseList: [],

      spinning: false,
      visible: false,
      uploadImageConfig: {
        maxFileCount: 3,
        fileType: 'img', // file img
        enableCompress: false,
        enablePreview: true,
        showFileList: true,
        fileValidate: () => true,
        btn: {
          attr: {
            icon: 'upload',
            type: 'link',
          },
        },
      },
      userInfo: this.$store.getters.userInfo, // 当前登录人
      dataSource: [],
      uploadImageConfig: {
        maxFileCount: 10,
        fileType: 'img', // file img
        enableCompress: false,
        enablePreview: true,
        showFileList: true,
        fileValidate: () => true,
        btn: {
          attr: {
            icon: 'upload',
            type: 'link',
          },
        },
      },
      //流程节点 1表示是财务
    }
  },
  created() {},
  computed: {
    modalTitle() {
      const m = { add: '新增', edit: '编辑', view: '查看', handle: '处理' }
      return m[this.type]
    },
    isAdd() {
      return this.type === 'add'
    },
    isEdit() {
      return this.type === 'edit'
    },
    isView() {
      return this.type === 'view'
    },
    isHandle() {
      return this.type === 'handle'
    },
    isDisabled() {
      return this.isView
    },
    costColumns() {
      const baseColumns = [
        {
          title: '检验项目',
          dataIndex: 'projectName',
        },
        {
          title: '检验数量',
          dataIndex: 'checkNum',
        },
        {
          title: '合格数量',
          dataIndex: 'qualifiedNum',
        },
        {
          title: '不合格数量',
          dataIndex: 'unqualifiedNum',
          // scopedSlots: { customRender: 'unqualifiedNum' },
        },
        {
          title: '不合格率',
          dataIndex: 'unqualifiedRate',
          scopedSlots: { customRender: 'unqualifiedRate' },
        },
        {
          title: '检验结果（系统）',
          dataIndex: 'detectionResult',
          scopedSlots: { customRender: 'detectionResult' },
        },
        {
          title: '不良原因描述',
          dataIndex: 'unqualifiedReason',
          // scopedSlots: { customRender: 'unqualifiedReason' },
        },
        {
          title: '附件',
          dataIndex: 'itemUrl',
          scopedSlots: { customRender: 'itemUrl' },
        },
        {
          title: '备注',
          dataIndex: 'remark',
          // scopedSlots: { customRender: 'remark' },
        },
      ]
      return baseColumns
    },
  },
  created() {
    const that = this
  },
  methods: {
    moment,
    fileChange(fileList, field) {
      const that = this
      this.form.disputeUrl = fileList.length > 0 ? fileList[0].url : ''
    },
    docView(url) {
      const that = this
      if (!url) {
        that.$message.info('尚未上传文件')
        return
      }
      that.$refs.xdocView.query(url)
    },
    viewInspectionClick() {
      this.$refs.viewInspectionCriteria.query(this.record)
    },
    viewInspectionRecordClick() {
      this.$refs.viewInspectionRecords.query(this.CheckDetail)
    },
    query(type, record = {}, test) {
      const that = this
      that.type = type
      that.record = { ...record }
      that.visible = true
      that.form = {
        disputeUrl: undefined,
        remark: undefined,
        disputePrice: undefined,
        disputeFlag: undefined,
      }
      getPurchaseDisputeDealDetail({ id: record.id }).then((res) => {
        this.CheckDetail = res.data.checkDealDetailVo
        this.txtDetail = res.data
        if (res.data.disputeFlag !== null) {
          this.form.disputeFlag = res.data.disputeFlag
          this.form.disputePrice = res.data.disputePrice
          this.form.disputeUrl = res.data.disputeUrl
          this.form.remark = res.data.remark
          that.$nextTick(() => {
            const noTicketEvidence_ref = `noTicketEvidence_${res.data.disputeUrl}`
            if (res.data.disputeUrl) {
              const files = [{ url: res.data.disputeUrl }]
              that.$refs[noTicketEvidence_ref] && that.$refs[noTicketEvidence_ref].setFiles(files)
            }
          })
        }

        let arr = {
          checkInspectionStandardDetailDetailVos: res.data.checkDealDetailVo.detailDealVoList,
          inspectionScheme: res.data.checkDealDetailVo.checkStandardHisDealVo.inspectionScheme,
          inspectionSchemeId: res.data.checkDealDetailVo.checkStandardHisDealVo.inspectionSchemeId,
          inspectionStatus: res.data.checkDealDetailVo.checkStandardHisDealVo.inspectionStatus,
          materialId: res.data.checkDealDetailVo.checkStandardHisDealVo.materialId,
        }
        that.testDetail = arr
        this.checkNum = res.data.checkDealDetailVo.checkStandardHisDealVo.checkNum
      })
    },
    // reset() {
    //   this.$refs.ruleForm.resetFields()
    // },
    handleCancel() {
      const that = this
      that.form = {}
      that.visible = false
      that.$emit('finish')
    },

    handleSubmit(operationType) {
      const that = this
      that.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          console.log(that.form)
          that.spinning = true
          const params = that.$_.cloneDeep(that.form || {})
          params.status = operationType
          params.id = that.record.id

          addAndUpdatePurchaseDisputeDeal(params)
            .then((res) => {
              that.spinning = false
              that.$message.info(res.msg)
              if (res.code === 200) {
                that.$emit('finish')
                that.handleCancel()
              }
            })
            .catch((err) => {
              that.spinning = false
              that.$message.error(err)
              that.$emit('finish')
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleCancel() {
      this.visible = false
    },
  },
}
</script>

<style scoped>
.routine-addform-wrapper-baseInnerData >>> .ant-form-item {
  display: flex;
  margin: 0;
}
.routine-addform-wrapper-baseInnerData >>> .ant-form-item .ant-form-item-label {
  width: auto;
  text-align: left;
}
.routine-addform-wrapper-baseInnerData >>> .ant-form-item .ant-form-item-control-wrapper {
  flex: 1;
}
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
</style>
