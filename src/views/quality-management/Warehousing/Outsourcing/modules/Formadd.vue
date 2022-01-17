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
                <span>检验单号</span>
              </td>
              <td style="width: 255px">
                <a-form-model-item>
                  {{ CheckDetail.checkSerNum }}
                </a-form-model-item>
              </td>
              <td style="width: 150px">
                <span>优先级</span>
              </td>
              <td style="width: 255px">
                <a-form-model-item>
                  {{ { 1: '一般', 2: '紧急', 3: '特急' }[CheckDetail.emergenceLevel] }}
                </a-form-model-item>
              </td>
              <td style="width: 150px">
                <span>生产厂家</span>
              </td>
              <td style="width: 255px">
                <a-form-model-item>
                  {{ CheckDetail.productName }}
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
                <span>委外单号</span>
              </td>
              <td>
                <a-form-model-item>
                  {{ CheckDetail.orderNum }}
                </a-form-model-item>
              </td>
              <td style="width: 150px">
                <span>工序名称</span>
              </td>
              <td>
                <a-form-model-item>
                  {{ CheckDetail.craftName }}
                </a-form-model-item>
              </td>
            </tr>
            <tr>
              <td style="width: 150px">
                <span>收料仓库</span>
              </td>
              <td>
                <a-form-model-item>
                  {{ CheckDetail.storageName }}
                </a-form-model-item>
              </td>
              <td style="width: 150px">
                <span>报检人</span>
              </td>
              <td>
                <a-form-model-item>
                  {{ CheckDetail.reportName }}
                </a-form-model-item>
              </td>
              <td style="width: 150px">
                <span>报检时间</span>
              </td>
              <td>
                <a-form-model-item>
                  {{ CheckDetail.reportTime }}
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
        <h3>检验标准</h3>
        <table class="custom-table custom-table-border">
          <tbody>
            <tr>
              <th><a-form-model-item>检验类别 </a-form-model-item></th>
              <th>检验方案</th>
              <th>检验数量</th>
              <th>标准明细</th>
            </tr>
            <tr>
              <td>
                {{ { 1: '来料检验', 2: '半成品检验', 3: '成品检验', 4: '退换货检验' }[testDetail.inspectionStatus] }}
              </td>
              <td>
                <a-form-model-item>
                  {{ testDetail.inspectionScheme }}
                </a-form-model-item>
              </td>
              <td>
                {{ checkNum }}
              </td>
              <td>
                <a @click="viewInspectionClick"> 查看</a>
              </td>
            </tr>
          </tbody>
        </table>
        <div style="margin-top: 20px" v-if="!isView">
          <h3>费用说明</h3>
          <a-table :columns="costColumns" :dataSource="form.checkResultHisBoList" :pagination="false" bordered>
            <div slot="qualifiedNum" slot-scope="text, record, index">
              <a-form-model-item
                :prop="'checkResultHisBoList.' + index + '.qualifiedNum'"
                :rules="{
                  required: true,
                  message: '请输入合格数量',
                }"
              >
                <a-input-number
                  v-if="!isDisabled"
                  v-model="record.qualifiedNum"
                  :min="0"
                  :max="record.checkNum"
                  @change="() => handleTravelRecordListChange(record)"
                  :step="1"
                />
                <span v-else>{{ record.qualifiedNum | moneyFormatNumber }}</span>
              </a-form-model-item>
            </div>

            <div slot="unqualifiedRate" slot-scope="text, record, index">
              <span>
                {{ (record.unqualifiedNum !== undefined && record.unqualifiedNum / record.checkNum) * 100 + '%' }}</span
              >
            </div>
            <div slot="detectionResult" slot-scope="text, record, index">
              <span> {{ record.unqualifiedNum > 0 ? '不合格' : '合格' }}</span>
            </div>
            <div slot="unqualifiedReason" slot-scope="text, record, index">
              <a-form-model-item
                :prop="'checkResultHisBoList.' + index + '.unqualifiedReason'"
                :rules="{
                  required: record.unqualifiedNum > 0 ? true : false,
                  message: '请输入不良原因',
                }"
              >
                <a-textarea v-if="!isDisabled" v-model="record.unqualifiedReason" />
                <span v-else>{{ record.unqualifiedReason }}</span>
              </a-form-model-item>
            </div>
            <div slot="itemUrl" slot-scope="text, record, index">
              <UploadFile
                :config="uploadImageConfig"
                :disabled="isDisabled"
                :ref="`noTicketEvidence_${record.itemUrl}`"
                @change="(fileList) => fileChange(fileList, 'itemUrl', record)"
              />
            </div>
            <div slot="remark" slot-scope="text, record, index">
              <a-form-model-item>
                <a-textarea v-if="!isDisabled" v-model="record.remark" />
                <span v-else>{{ record.remark }}</span>
              </a-form-model-item>
            </div>
          </a-table>
          <table class="custom-table custom-table-border" style="margin-top: 20px">
            <tbody>
              <tr>
                <td style="width: 150px">检验结果</td>
                <td>
                  <a-form-model-item
                    prop="checkResult"
                    :rules="{
                      required: true,
                      message: '请选择检验结果',
                    }"
                  >
                    <a-radio-group style="width: 200px" v-model="form.checkResult">
                      <a-radio :value="1">合格</a-radio>
                      <a-radio :value="0"> 不合格</a-radio>
                    </a-radio-group>
                  </a-form-model-item>
                </td>
                <td v-if="form.checkResult === 0">不合格数量</td>
                <td v-if="form.checkResult === 0">
                  <a-form-model-item
                    prop="unqualifiedNum"
                    :rules="{
                      required: true,
                      message: '请输入不合格数量',
                    }"
                  >
                    <a-input-number
                      style="width: 200px"
                      v-if="!isDisabled"
                      v-model="form.unqualifiedNum"
                      :min="0"
                      :max="record.reportNum"
                      :step="1"
                    />
                  </a-form-model-item>
                </td>
              </tr>
              <tr v-if="form.checkResult === 0">
                <td>不合格原因</td>
                <td colspan="3">
                  <a-form-model-item>
                    <a-textarea v-if="!isDisabled" v-model="form.unqualifiedReason" />
                    <span v-else>{{ form.unqualifiedReason }}</span>
                  </a-form-model-item>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-else>
          <h3>检验记录</h3>
          <table class="custom-table custom-table-border">
            <tbody>
              <tr>
                <th style="width: 25%"><a-form-model-item>检验结果（最终） </a-form-model-item></th>
                <th style="width: 25%">检验人</th>
                <th style="width: 25%">检验时间</th>
                <th style="width: 25%">详情</th>
              </tr>
              <tr>
                <td>
                  {{ { 1: '合格', 0: '不合格' }[CheckDetail.checkResult] }}
                </td>
                <td>
                  <a-form-model-item>
                    {{ CheckDetail.checkUserName }}
                  </a-form-model-item>
                </td>
                <td>
                  {{ CheckDetail.modifyTime }}
                </td>
                <td>
                  <a @click="viewInspectionRecordClick"> 查看</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </a-form-model>
      <p style="text-align: center; margin-top: 20px">
        <a-button key="cancel" @click="() => handleCancel()">取消</a-button>
        <template v-if="isHandle || isEdit">
          <a-button style="margin: 0 10px" key="save" type="primary" :loading="spinning" @click="() => handleSubmit(1)"
            >保存</a-button
          >
          <a-button style="margin: 0 10px" key="save1" type="primary" :loading="spinning" @click="() => handleSubmit(2)"
            >提交</a-button
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
  </a-modal>
</template>
<script>
import ImgViewList from '@/components/CustomerList/ImgViewList'
import UploadFile from './UploadFile'
import moment from 'moment'
import CaseCadeArea from '@/components/CustomerList/CaseCadeArea'
import CommonDictionarySelect from '@/components/CustomerList/CommonDictionarySelect'
import ViewInspectionCriteria from './ViewInspectionCriteria'
import ViewInspectionRecords from './ViewInspectionRecords'
import { quality_trust_getCheckDetail, quality_trust_dealCheck } from '@/api/qualityTesting'

export default {
  name: 'approve-business-travel-addform',
  components: {
    UploadFile,
    ImgViewList,
    CaseCadeArea,
    CommonDictionarySelect,
    ViewInspectionCriteria,
    ViewInspectionRecords,
  },
  data() {
    return {
      visible: false,
      type: 'add',
      record: {},
      CheckDetail: {},
      testDetail: {},
      getMaterialId: {},
      checkNum: undefined,
      form: {
        checkResultHisBoList: [],
        checkResult: undefined,
        unqualifiedNum: undefined,
        unqualifiedReason: undefined,
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
          scopedSlots: { customRender: 'qualifiedNum' },
        },
        {
          title: '不合格数量',
          dataIndex: 'unqualifiedNum',
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
          scopedSlots: { customRender: 'unqualifiedReason' },
        },
        {
          title: '附件',
          dataIndex: 'itemUrl',
          scopedSlots: { customRender: 'itemUrl' },
        },
        {
          title: '备注',
          dataIndex: 'remark',
          scopedSlots: { customRender: 'remark' },
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
    handleTravelRecordListChange(e) {
      let programme = [...this.form.checkResultHisBoList]
      let target = this.form.checkResultHisBoList.find((i) => i.key === e.key)
      if (target) {
        target.unqualifiedNum = target.checkNum - target.qualifiedNum
        this.form.checkResultHisBoList = [...programme]
      }
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
      if (that.isHandle && record.firstInit === 1) {
        that.testDetail = test
        this.checkNum = Math.max.apply(
          null,
          test.checkInspectionStandardDetailDetailVos.map((i) => {
            return i.checkNum === '*' ? record.reportNum : i.checkNum
          })
        )
        that.form.checkResultHisBoList = test.checkInspectionStandardDetailDetailVos.map((i) => {
          return {
            key: that._uuid(),
            projectName: i.projectName,
            projectId: i.projectId,
            checkNum: i.checkNum === '*' ? Number(record.reportNum) : Number(i.checkNum),
            itemUrl: undefined,
            qualifiedNum: undefined,
            unqualifiedNum: undefined,
            unqualifiedReason: undefined,
            remark: undefined,
          }
        })
      }

      quality_trust_getCheckDetail({ checkId: record.id }).then((res) => {
        this.CheckDetail = res.data
        if (record.firstInit === 0) {
          that.form.checkResultHisBoList = res.data.checkResultHisVoList.map((i) => {
            i.key = that._uuid()
            return i
          })
          let arr = {
            checkInspectionStandardDetailDetailVos: res.data.detailDealVoList,
            inspectionScheme: res.data.checkStandardHisDealVo.inspectionScheme,
            inspectionSchemeId: res.data.checkStandardHisDealVo.inspectionSchemeId,
            inspectionStatus: res.data.checkStandardHisDealVo.inspectionStatus,
            materialId: res.data.checkStandardHisDealVo.materialId,
          }
          that.testDetail = arr
          this.checkNum = res.data.checkStandardHisDealVo.checkNum
          that.form.checkResult = res.data.checkResult
          that.form.unqualifiedNum = res.data.unqualifiedNum
          that.form.unqualifiedReason = res.data.unqualifiedReason
          that.$nextTick(() => {
            that.form.checkResultHisBoList.map((i) => {
              const noTicketEvidence_ref = `noTicketEvidence_${i.itemUrl}`
              if (i.itemUrl) {
                const files = [{ url: i.itemUrl }]
                that.$refs[noTicketEvidence_ref] && that.$refs[noTicketEvidence_ref].setFiles(files)
              }
            })
          })
        }
      })
    },
    reset() {
      this.$refs.ruleForm.resetFields()
    },
    handleCancel() {
      const that = this
      that.form = {}
      that.visible = false
      that.$emit('finish')
    },
    handlerCustomerClick() {
      this.$refs.customerList && this.$refs.customerList.init()
    },

    fileChange(fileList, field, record) {
      const that = this
      const checkResultHisBoList = [...that.form.checkResultHisBoList]
      const target = checkResultHisBoList.find((item) => item.key === record.key)
      target[field] = fileList.length > 0 ? fileList[0].url : ''

      that.form = { ...that.form, checkResultHisBoList }
      // console.log(arguments)
      // this.form = {
      //   ...this.form,
      //   pictureUrl: fileList.map(f => f.url).join(',')
      // }
    },

    handleSubmit(operationType) {
      const that = this
      that.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          // let {totalLongDistanceCost,totalSortDistanceCost,totalFoodCost,totalAccommodationCost} = that.form.__sum
          console.log(that.form)

          that.spinning = true
          const params = that.$_.cloneDeep(that.form || {})
          params.operationStatus = operationType
          let arr = {
            checkNum: that.checkNum,
            inspectionScheme: that.testDetail.inspectionScheme,
            inspectionSchemeId: that.testDetail.inspectionSchemeId,
            inspectionStatus: that.testDetail.inspectionStatus,
            materialId: that.testDetail.materialId,
          }
          params.id = that.record.id
          params.checkStandardHisDealBo = arr
          params.detailDealBoList = that.testDetail.checkInspectionStandardDetailDetailVos
          console.log(params)
          quality_trust_dealCheck(params)
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
    handlerImageView() {
      const pictureUrl = this.form.pictureUrl
      const imgList = pictureUrl.split(',').map((url) => decodeURIComponent(url))
      this.$refs.imgViewList.show(imgList)
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
