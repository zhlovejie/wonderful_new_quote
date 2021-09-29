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
      <a-form-model
        ref="ruleForm"
        :model="form"
        :rules="rules"
        class="routine-addform-wrapper-baseInnerData"
      >
        <h3>基本数据</h3>
        <table class="custom-table custom-table-border">
          <tbody>
            <tr>
              <td style="width:150px;">
                <span>日常报销单号</span>
              </td>
              <td>
                <a-form-model-item>
                  {{form.serialNum || '系统生成'}}
                </a-form-model-item>
              </td>
              <td style="width:150px;">
                <span class="icon-required">报销部门</span>
              </td>
              <td>
                <a-form-model-item>
                  {{userInfo.departmentName}}
                </a-form-model-item>
              </td>
            </tr>

            <tr>
              <td style="width:150px;">
                <span class="icon-required">报销人</span>
              </td>
              <td>
                <a-form-model-item prop="customerName">
                  {{form.createdName}}
                </a-form-model-item>
              </td>
              <td style="width:150px;">
                <span>报销时间</span>
              </td>
              <td>
                <a-form-model-item>
                  {{form.createdTime}}
                </a-form-model-item>
              </td>
            </tr>

            <tr>
              <td style="width:150px;">
                <span class="icon-required">报销描述</span>
              </td>
              <td colspan="3">
                <a-form-model-item prop="describes">
                  <a-textarea
                    v-if="!isDisabled"
                    placeholder="报销描述"
                    allow-clear
                    autoSize
                    v-model="form.describes"
                  />
                  <span v-else>{{form.describes}}</span>
                </a-form-model-item>
              </td>
            </tr>

            <tr>
              <td style="width:150px;">
                <span class="icon-required">银行名称(开户行)</span>
              </td>
              <td>
                <a-form-model-item>
                  {{form.bankName}}
                </a-form-model-item>
              </td>
              <td style="width:150px;">
                <span class="icon-required">账号</span>
              </td>
              <td>
                <a-form-model-item>
                  {{form.bankCard}}
                </a-form-model-item>
              </td>
            </tr>
          </tbody>
        </table>
        <div style="margin-top:20px;">
          <h3>行程记录</h3>
          <span style="color:red;">
            注：实际出差天数的计算以所乘交通工具出发时间到返回时间为准，12：00以后出发（或12：00以前到达）以半天计，12：00以前出发（或12：00以后到达）以一天计。
          </span>
          <a-table
            :columns="travelColumns"
            :dataSource="form.travelRecordList"
            :pagination="false"
            bordered
            size="small"
            :scroll="{ x: 2100 }"
          >
            <div
              slot="order"
              slot-scope="text, record, index"
            >
              {{ index + 1}}
            </div>

            <div
              slot="startTime"
              slot-scope="text, record, index"
            >
              <a-form-model-item
                :prop="'travelRecordList.' + index + '.startTime'"
                :rules="{
                  required: true,
                  message: '请选择出发时间',
                }"
              >
                <a-date-picker
                  v-if="!isDisabled"
                  show-time
                  v-model="record.startTime"
                />
                <span v-else>{{ record.startTime.format('YYYY-MM-DD HH:mm:ss') }}</span>
              </a-form-model-item>
            </div>

            <div
              slot="departurePlace"
              slot-scope="text, record, index"
            >
              <a-form-model-item
                :prop="'travelRecordList.' + index + '.departurePlaceId'"
                :rules="{
                required: true,
                message: '请选择出发地',
              }"
              >
                <CaseCadeArea
                  v-if="!isDisabled"
                  :area.sync="record.departurePlaceId"
                  @change="e => handleAreaChange(e,'departurePlace',record)"
                />
                <span v-else>{{record.departurePlace}}</span>
              </a-form-model-item>
            </div>

            <div
              slot="departureTime"
              slot-scope="text, record, index"
            >
              <a-form-model-item
                :prop="'travelRecordList.' + index + '.departureTime'"
                :rules="{
                required: true,
                message: '请选择离开时间',
              }"
              >
                <a-date-picker
                  v-if="!isDisabled"
                  show-time
                  v-model="record.departureTime"
                />
                <span v-else>{{ record.departureTime.format('YYYY-MM-DD HH:mm:ss') }}</span>
              </a-form-model-item>
            </div>

            <div
              slot="destination"
              slot-scope="text, record, index"
            >
              <a-form-model-item
                :prop="'travelRecordList.' + index + '.destinationId'"
                :rules="{
                required: true,
                message: '请选择目的地',
              }"
              >
                <CaseCadeArea
                  v-if="!isDisabled"
                  :area.sync="record.destinationId"
                  @change="e => handleAreaChange(e,'destination',record)"
                />
                <span v-else>{{record.destination}}</span>
              </a-form-model-item>
            </div>

            <div
              slot="longDistanceVehicle"
              slot-scope="text, record, index"
            >
              <a-form-model-item
                :prop="'travelRecordList.' + index + '.longDistanceVehicle'"
                :rules="{
                required: true,
                message: '请选择交通工具',
              }"
              >
                <CommonDictionarySelect
                  :disabled="isDisabled"
                  placeholder="交通工具"
                  :text="'交通工具'"
                  :dictionaryId.sync="record.longDistanceVehicle"
                />
              </a-form-model-item>
            </div>

            <div
              slot="longDistanceCost"
              slot-scope="text, record, index"
            >
              <a-form-model-item
                :prop="'travelRecordList.' + index + '.longDistanceCost'"
                :rules="{
                required: true,
                message: '请输入金额',
              }"
              >
                <a-input-number
                  v-if="!isDisabled"
                  v-model="record.longDistanceCost"
                  :min="0"
                  :step="1"
                  :precision="2"
                  @change="handleTravelRecordListChange"
                />
                <span v-else>{{record.longDistanceCost | moneyFormatNumber}}</span>
              </a-form-model-item>
            </div>

            <div
              slot="sortDistanceVehicle"
              slot-scope="text, record, index"
            >
              <a-form-model-item
                :prop="'travelRecordList.' + index + '.sortDistanceVehicle'"
                :rules="{
                required: true,
                message: '请选择交通工具',
              }"
              >
                <CommonDictionarySelect
                  :disabled="isDisabled"
                  placeholder="交通工具"
                  :text="'交通工具'"
                  :dictionaryId.sync="record.sortDistanceVehicle"
                />
              </a-form-model-item>
            </div>

            <div
              slot="sortDistanceCost"
              slot-scope="text, record, index"
            >
              <a-form-model-item
                :prop="'travelRecordList.' + index + '.sortDistanceCost'"
                :rules="{
                required: true,
                message: '请输入金额',
              }"
              >
                <a-input-number
                  v-if="!isDisabled"
                  v-model="record.sortDistanceCost"
                  :min="0"
                  :step="1"
                  :precision="2"
                  @change="handleTravelRecordListChange"
                />
                <span v-else>{{record.sortDistanceCost | moneyFormatNumber}}</span>
              </a-form-model-item>
            </div>

            <div
              slot="repastDays"
              slot-scope="text, record, index"
            >
              <a-form-model-item
                :prop="'travelRecordList.' + index + '.repastDays'"
                :rules="{
                required: true,
                message: '请输入天数',
              }"
              >
                <a-input-number
                  v-if="!isDisabled"
                  v-model="record.repastDays"
                  :min="0"
                  :step="1"
                  :precision="0"
                  @change="handleTravelRecordListChange"
                />
                <span v-else>{{record.repastDays}}</span>
              </a-form-model-item>
            </div>

            <div
              slot="foodCost"
              slot-scope="text, record, index"
            >
              <a-form-model-item
                :prop="'travelRecordList.' + index + '.foodCost'"
                :rules="{
                required: true,
                message: '请输入金额',
              }"
              >
                <a-input-number
                  v-if="!isDisabled"
                  v-model="record.foodCost"
                  :min="0"
                  :step="1"
                  :precision="2"
                  @change="handleTravelRecordListChange"
                />
                <span v-else>{{record.foodCost | moneyFormatNumber}}</span>
              </a-form-model-item>
            </div>

            <div
              slot="accommodationDays"
              slot-scope="text, record, index"
            >
              <a-form-model-item
                :prop="'travelRecordList.' + index + '.accommodationDays'"
                :rules="{
                required: true,
                message: '请输入天数',
              }"
              >
                <a-input-number
                  v-if="!isDisabled"
                  v-model="record.accommodationDays"
                  :min="0"
                  :step="1"
                  :precision="0"
                  @change="handleTravelRecordListChange"
                />
                <span v-else>{{record.accommodationDays}}</span>
              </a-form-model-item>
            </div>

            <div
              slot="accommodationCost"
              slot-scope="text, record, index"
            >
              <a-form-model-item
                :prop="'travelRecordList.' + index + '.accommodationCost'"
                :rules="{
                required: true,
                message: '请输入金额',
              }"
              >
                <a-input-number
                  v-if="!isDisabled"
                  v-model="record.accommodationCost"
                  :min="0"
                  :step="1"
                  :precision="2"
                  @change="handleTravelRecordListChange"
                />
                <span v-else>{{record.accommodationCost | moneyFormatNumber}}</span>
              </a-form-model-item>
            </div>

            <div
              slot="totalCost"
              slot-scope="text, record, index"
            >
              {{ record.totalCost | moneyFormatNumber}}
            </div>

            <div
              slot="doAction"
              slot-scope="text, record, index"
            >
              <a
                href="javascript:void(0);"
                @click="doAction('remove',record)"
              >删除</a>
            </div>

            <div
              slot="footer"
              slot-scope="text, record, index"
            >
              <div style="text-align:right;font-size:16px;color:red;">
                <span>长途交通费合计：{{ form.__sum.totalLongDistanceCost | moneyFormatNumber }}</span>
                <span style="margin:0 10px;">市内交通费合计：{{ form.__sum.totalSortDistanceCost | moneyFormatNumber }}</span>
                <span>餐饮费合计：{{ form.__sum.totalFoodCost | moneyFormatNumber}}</span>
                <span style="margin:0 10px;">住宿费合计：{{ form.__sum.totalAccommodationCost | moneyFormatNumber }}</span>
                <span>共合计：{{ form.__sum.totalCost | moneyFormatNumber }}</span>
              </div>
            </div>
          </a-table>
          <a-button
            style="width: 100%"
            type="dashed"
            icon="plus"
            @click="doAction('add-travelRecord')"
          >
            添加
          </a-button>
        </div>

        <div style="margin-top:20px;">
          <h3>费用说明</h3>
          <a-table
            :columns="costColumns"
            :dataSource="form.costDetailList"
            :pagination="false"
            bordered
            size="small"
          >
            <div
              slot="order"
              slot-scope="text, record, index"
            >
              {{index + 1}}
            </div>

            <div
              slot="costCategory"
              slot-scope="text, record, index"
            >
              {{ {1:'长途交通费',2:'市内交通费',3:'餐饮费',4:'住宿费'}[text] }}
            </div>
            <div
              slot="haveTicketCost"
              slot-scope="text, record, index"
            >
              <a-input-number
                v-if="!isDisabled"
                v-model="record.haveTicketCost"
                :min="0"
                :step="1"
                :precision="2"
                @change="handleTravelRecordListChange"
              />
              <span v-else>{{record.haveTicketCost | moneyFormatNumber}}</span>
            </div>
            <div
              slot="haveTicketEvidence"
              slot-scope="text, record, index"
            >
              <UploadFile
                :config="uploadImageConfig"
                :disabled="isDisabled"
                :ref="`haveTicketEvidence_${record.costCategory}`"
                @change="(fileList) => fileChange(fileList,'haveTicketEvidence',record)"
              />
            </div>
            <div
              slot="noTicketCost"
              slot-scope="text, record, index"
            >
              <a-input-number
                v-if="!isDisabled"
                v-model="record.noTicketCost"
                :min="0"
                :step="1"
                :precision="2"
                @change="handleTravelRecordListChange"
              />
              <span v-else>{{record.noTicketCost | moneyFormatNumber}}</span>
            </div>
            <div
              slot="noTicketEvidence"
              slot-scope="text, record, index"
            >
              <UploadFile
                :config="uploadImageConfig"
                :disabled="isDisabled"
                :ref="`noTicketEvidence_${record.costCategory}`"
                @change="(fileList) => fileChange(fileList,'noTicketEvidence',record)"
              />
            </div>
          </a-table>
        </div>

        <div style="margin-top:20px;">
          <h3>
            <span>关联出差单</span>
            <a-button
              v-if="!isDisabled"
              type="link"
              @click="() => $refs.travelSelectForm.query()"
            >选择单据</a-button>
          </h3>
          <a-table
            :columns="travelCaseColumns"
            :dataSource="travelCaseList"
            :pagination="false"
            bordered
            size="small"
          >
            <div
              slot="order"
              slot-scope="text, record, index"
            >
              <span>{{ index + 1 }}</span>
            </div>
            <div
              slot="travelType"
              slot-scope="text"
            >{{ { 1: '出差', 2: '公事外出' }[text] || '未知' }}</div>
            <div
              slot="travelUsers"
              slot-scope="text, record"
            >
              {{ Array.isArray(record.users) ? record.users.map((item) => item.userName).join(',') : '-' }}
            </div>
            <div
              slot="doAction"
              slot-scope="text, record, index"
            >
              <a-button
                type="link"
                @click="handleTravelCase('remove',record)"
              >删除</a-button>
            </div>

            <div slot="footer">
              <h3 style="color:red;">合计：{{ travelCaseList.map(item => Number(item.overdraftAmount) || 0).reduce((a,b) => a + b,0) | moneyFormatNumber }}</h3>
            </div>
          </a-table>
        </div>

      </a-form-model>

      <a-form-model
        v-if="+form.formKey === 1"
        :model="approvalForm"
        ref="approvalForm"
        :rules="approvalRules"
        class="routine-addform-wrapper-baseInnerData"
      >
        <div style="margin-top:20px;">
          <h3>审批结果</h3>
          <table class="custom-table custom-table-border">
            <tbody>
              <tr>
                <td style="width:150px;">
                  <span>实际报销金额(不含长途交通费)</span>
                </td>
                <td>
                  <a-form-model-item
                    prop="realityReimbursementAmount"
                    :rules="{
                      required: true,
                      message: '请输入实际报销金额',
                      trigger: 'blur',
                    }"
                  >
                    <a-input-number
                      v-model="approvalForm.realityReimbursementAmount"
                      :min="0"
                      :step="1"
                      :precision="2"
                      style="width:100%;"
                    />
                  </a-form-model-item>
                </td>
                <td style="width:150px;">
                  <span>是否超标准</span>
                </td>
                <td>
                  <a-form-model-item
                    prop="isExcessive"
                    :rules="{
                      required: true,
                      message: '请选择是否超标准',
                      trigger: 'change',
                    }"
                  >
                    <a-radio-group v-model="approvalForm.isExcessive">
                      <a-radio :value="1">是</a-radio>
                      <a-radio :value="0">否</a-radio>
                    </a-radio-group>
                  </a-form-model-item>
                </td>
              </tr>

              <tr>
                <td style="width:150px;">
                  <span>超标金额(元)</span>
                </td>
                <td>
                  <a-form-model-item
                    prop="excessiveAmount"
                    :rules="{
                      required: +approvalForm.isExcessive === 1,
                      message: '请输入超标金额',
                      trigger: 'blur',
                    }"
                  >
                    <a-input-number
                      v-model="approvalForm.excessiveAmount"
                      :min="0"
                      :step="1"
                      :precision="2"
                      style="width:100%;"
                    />
                  </a-form-model-item>
                </td>
                <td style="width:150px;">
                  <span>备注</span>
                </td>
                <td>
                  <a-form-model-item>
                    <a-textarea
                      placeholder="备注"
                      allow-clear
                      autoSize
                      v-model="approvalForm.remark"
                    />
                  </a-form-model-item>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </a-form-model>

      <p
        v-if="isAdd || isEdit"
        style="text-align:center;margin-top:20px;"
      >
        <a-button
          key="cancel"
          @click="() => handleCancel()"
        >取消</a-button>
        <a-button
          style="margin:0 10px;"
          key="save"
          type='primary'
          :loading="spinning"
          @click="() => handleSubmit(1)"
        >保存</a-button>
        <!-- <a-button
          key="submit"
          type='primary'
          :loading="spinning"
          @click="() => handleSubmit(2)"
        >提交审批</a-button> -->
      </p>

      <p
        v-if="isApproval"
        style="text-align:center;margin-top:20px;"
      >
        <a-button
          :loading="spinning"
          @click="() => approvalAction(2)"
        >不通过</a-button>
        <a-button
          type="primary"
          :loading="spinning"
          @click="() => approvalAction(1)"
          style="margin:0 10px;"
        >通过</a-button>
      </p>

    </a-spin>

    <TravelSelectForm
      ref="travelSelectForm"
      @change="handleTravelSelect"
    />
    <Approval
      ref="approval"
      @opinionChange="opinionChange"
    />
  </a-modal>
</template>
<script>
import ImgViewList from '@/components/CustomerList/ImgViewList'
import UploadFile from './UploadFile'
import moment from 'moment'
import CaseCadeArea from '@/components/CustomerList/CaseCadeArea'
import CommonDictionarySelect from '@/components/CustomerList/CommonDictionarySelect'
import TravelSelectForm from './TravelSelectForm'
import Approval from './Approval'
import {
  reimburseAdd,
  reimburseApproval,
  reimburseDelete,
  reimburseDetail,
  reimbursePageList,
  reimburseWithdraw,
  reimburseSubmit
} from '@/api/after-sales-management-custom'

export default {
  name: 'approve-business-travel-addform',
  components: {
    UploadFile,
    ImgViewList,
    CaseCadeArea,
    CommonDictionarySelect,
    TravelSelectForm,
    Approval
  },
  data() {
    return {
      visible: false,
      type: 'add',
      record: {},
      form: {
        travelRecordList: [],
        costDetailList: [
          {
            key: 1,
            costCategory: 1,
            haveTicketCost: 0,
            haveTicketEvidence: undefined,
            noTicketCost: 0,
            noTicketEvidence: undefined
          },
          {
            key: 2,
            costCategory: 2,
            haveTicketCost: 0,
            haveTicketEvidence: undefined,
            noTicketCost: 0,
            noTicketEvidence: undefined
          },
          {
            key: 3,
            costCategory: 3,
            haveTicketCost: 0,
            haveTicketEvidence: undefined,
            noTicketCost: 0,
            noTicketEvidence: undefined
          },
          {
            key: 4,
            costCategory: 4,
            haveTicketCost: 0,
            haveTicketEvidence: undefined,
            noTicketCost: 0,
            noTicketEvidence: undefined
          }
        ],
        travelId: '',
        __sum: {}
      },
      rules: {
        describes: [{ required: true, message: '请输入报销描述', trigger: 'change' }]
      },
      approvalForm: {},
      approvalRules: {},
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
            type: 'link'
          }
        }
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
            type: 'link'
          }
        }
      }
      //流程节点 1表示是财务
    }
  },
  created() {},
  computed: {
    modalTitle() {
      const m = { add: '新增', edit: '编辑', view: '查看', approval: '审批' }
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
    isApproval() {
      return this.type === 'approval'
    },
    isDisabled() {
      return this.isView || this.isApproval
    },
    costColumns() {
      const baseColumns = [
        {
          title: '序号',
          scopedSlots: { customRender: 'order' },
          width: 80
        },
        {
          title: '费用类别',
          dataIndex: 'costCategory',
          scopedSlots: { customRender: 'costCategory' }
        },
        {
          title: '有票发票',
          children: [
            {
              title: '合计(元)',
              dataIndex: 'haveTicketCost',
              scopedSlots: { customRender: 'haveTicketCost' }
            },
            {
              title: '发票详情',
              dataIndex: 'haveTicketEvidence',
              scopedSlots: { customRender: 'haveTicketEvidence' }
            }
          ]
        },
        {
          title: '无票凭证',
          children: [
            {
              title: '合计(元)',
              dataIndex: 'noTicketCost',
              scopedSlots: { customRender: 'noTicketCost' }
            },
            {
              title: '付款凭证',
              dataIndex: 'noTicketEvidence',
              scopedSlots: { customRender: 'noTicketEvidence' }
            }
          ]
        }
      ]
      return baseColumns
    },
    travelColumns() {
      const baseColumns = [
        {
          title: '序号',
          scopedSlots: { customRender: 'order' },
          width: 60
        },
        {
          title: '出发时间',
          dataIndex: 'startTime',
          scopedSlots: { customRender: 'startTime' },
          width: 210
        },
        {
          title: '出发地',
          dataIndex: 'departurePlace',
          scopedSlots: { customRender: 'departurePlace' },
          width: 200
        },
        {
          title: '离开时间',
          dataIndex: 'departureTime',
          scopedSlots: { customRender: 'departureTime' },
          width: 210
        },
        {
          title: '目的地',
          dataIndex: 'destination',
          scopedSlots: { customRender: 'destination' },
          width: 200
        },
        {
          title: '长途交通费',
          children: [
            {
              title: '交通工具',
              dataIndex: 'longDistanceVehicle',
              scopedSlots: { customRender: 'longDistanceVehicle' },
              width: 140
            },
            {
              title: '小计金额',
              dataIndex: 'longDistanceCost',
              scopedSlots: { customRender: 'longDistanceCost' }
            }
          ]
        },
        {
          title: '市内交通费',
          children: [
            {
              title: '交通工具',
              dataIndex: 'sortDistanceVehicle',
              scopedSlots: { customRender: 'sortDistanceVehicle' },
              width: 140
            },
            {
              title: '小计金额',
              dataIndex: 'sortDistanceCost',
              scopedSlots: { customRender: 'sortDistanceCost' }
            }
          ]
        },
        {
          title: '餐饮费',
          children: [
            {
              title: '天数',
              dataIndex: 'repastDays',
              scopedSlots: { customRender: 'repastDays' }
            },
            {
              title: '小计金额',
              dataIndex: 'foodCost',
              scopedSlots: { customRender: 'foodCost' }
            }
          ]
        },
        {
          title: '住宿费',
          children: [
            {
              title: '天数',
              dataIndex: 'accommodationDays',
              scopedSlots: { customRender: 'accommodationDays' }
            },
            {
              title: '小计金额',
              dataIndex: 'accommodationCost',
              scopedSlots: { customRender: 'accommodationCost' }
            }
          ]
        },
        {
          title: '合计(元)',
          scopedSlots: { customRender: 'totalCost' },
          width: 200,
          fixed: 'right'
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'doAction' },
          width: 60,
          fixed: 'right'
        }
      ]
      if (this.isDisabled) {
        return baseColumns.slice(0, -1)
      }
      return baseColumns
    },
    travelCaseColumns() {
      const columns = [
        {
          align: 'center',
          title: '序号',
          key: 'order',
          width: '70px',
          scopedSlots: { customRender: 'order' }
        },
        {
          align: 'center',
          title: '出差人员',
          scopedSlots: { customRender: 'travelUsers' }
        },
        {
          align: 'center',
          title: '开始时间',
          dataIndex: 'startTime'
        },
        {
          align: 'center',
          title: '结束时间',
          dataIndex: 'endTime'
        },
        {
          align: 'center',
          title: '预付金额',
          dataIndex: 'overdraftAmount'
        },
        {
          align: 'center',
          title: '操作',
          scopedSlots: { customRender: 'doAction' }
        }
      ]
      if (this.isDisabled) {
        return columns.slice(0, -1)
      }
      return columns
    }
  },
  created() {
    const that = this
  },
  methods: {
    moment,
    query(type, record = {}) {
      const that = this
      that.type = type
      that.record = { ...record }

      that.form = {
        travelRecordList: [],
        costDetailList: [
          {
            key: 1,
            costCategory: 1,
            haveTicketCost: 0,
            haveTicketEvidence: undefined,
            noTicketCost: 0,
            noTicketEvidence: undefined
          },
          {
            key: 2,
            costCategory: 2,
            haveTicketCost: 0,
            haveTicketEvidence: undefined,
            noTicketCost: 0,
            noTicketEvidence: undefined
          },
          {
            key: 3,
            costCategory: 3,
            haveTicketCost: 0,
            haveTicketEvidence: undefined,
            noTicketCost: 0,
            noTicketEvidence: undefined
          },
          {
            key: 4,
            costCategory: 4,
            haveTicketCost: 0,
            haveTicketEvidence: undefined,
            noTicketCost: 0,
            noTicketEvidence: undefined
          }
        ],
        travelId: '',
        __sum: {}
      }

      that.visible = true
      if (that.isAdd) {
        that.form = {
          ...that.form,
          createdId: that.userInfo.id,
          createdName: that.userInfo.trueName,
          createdTime: that.moment().format('YYYY-MM-DD HH:mm:ss'),
          bankName: that.userInfo.bankName || '无',
          bankCard: that.userInfo.bankCard || '无'
        }
      } else {
        reimburseDetail({ id: record.id }).then(res => {
          let { travelRecordList, costDetailList } = res.data
          travelRecordList = travelRecordList.map(item => {
            item.key = that._uuid()
            item.departureTime = moment(item.departureTime)
            item.startTime = moment(item.startTime)
            item.departurePlaceName = item.departurePlace.split(' ')
            item.departurePlaceId = item.departurePlaceId.split(',').map(v => +v)

            item.destinationName = item.destination.split(' ')
            item.destinationId = item.destinationId.split(',').map(v => +v)

            item.longDistanceVehicle = +item.longDistanceVehicle
            item.sortDistanceVehicle = +item.sortDistanceVehicle
            return item
          })
          costDetailList = costDetailList.map(item => {
            item.key = that._uuid()
            return item
          })
          that.form = {
            ...res.data,
            travelRecordList,
            costDetailList
          }
          that.handleTravelRecordListChange()
          that.handleTravelSelect(res.data.travelApplyListVoList)

          that.$nextTick(() => {
            costDetailList.map(item => {
              const { costCategory, haveTicketEvidence, noTicketEvidence } = item
              const haveTicketEvidence_ref = `haveTicketEvidence_${costCategory}`
              const noTicketEvidence_ref = `noTicketEvidence_${costCategory}`
              if (haveTicketEvidence) {
                const files = haveTicketEvidence.split(',').map(url => {
                  return { url }
                })
                that.$refs[haveTicketEvidence_ref] && that.$refs[haveTicketEvidence_ref].setFiles(files)
              }
              if (noTicketEvidence) {
                const files = noTicketEvidence.split(',').map(url => {
                  return { url }
                })
                that.$refs[noTicketEvidence_ref] && that.$refs[noTicketEvidence_ref].setFiles(files)
              }
            })
          })
        })
      }
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
      const costDetailList = [...that.form.costDetailList]
      const target = costDetailList.find(item => item.key === record.key)
      target[field] = fileList.length > 0 ? fileList[0].url : ''

      that.form = { ...that.form, costDetailList }
      // console.log(arguments)
      // this.form = {
      //   ...this.form,
      //   pictureUrl: fileList.map(f => f.url).join(',')
      // }
    },

    handleSubmit(operationType) {
      const that = this
      that.$refs['ruleForm'].validate(valid => {
        if (valid) {
          // let {totalLongDistanceCost,totalSortDistanceCost,totalFoodCost,totalAccommodationCost} = that.form.__sum

          if(that.form.travelRecordList.length === 0){
            that.$message.info('请添加行程记录')
            return
          }
          if(that.travelCaseList.length === 0){
            that.$message.info('请选择关联出差单')
            return
          }

          that.spinning = true
          const params = that.$_.cloneDeep(that.form || {})

          params.travelId = params.travelId.join(',')
          params.travelRecordList = params.travelRecordList.map(item => {
            item.departureTime = moment(item.departureTime).format('YYYY-MM-DD HH:mm:ss')
            item.startTime = moment(item.startTime).format('YYYY-MM-DD HH:mm:ss')
            item.departurePlace = item.departurePlaceName.join(' ')
            item.departurePlaceId = item.departurePlaceId.join(',')
            item.destination = item.destinationName.join(' ')
            item.destinationId = item.destinationId.join(',')
            return item
          })
          delete params.createdTime
          console.log(params)
          reimburseAdd(params)
            .then(res => {
              that.spinning = false
              that.$message.info(res.msg)
              if (res.code === 200) {
                that.$emit('finish')
                that.handleCancel()
              }
            })
            .catch(err => {
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
      const imgList = pictureUrl.split(',').map(url => decodeURIComponent(url))
      this.$refs.imgViewList.show(imgList)
    },
    handleCancel() {
      this.visible = false
    },
    doAction(type, record) {
      const that = this
      if (type === 'add-travelRecord') {
        const travelRecordList = [...that.form.travelRecordList]
        travelRecordList.push({
          key: that._uuid(),
          startTime: undefined,
          departurePlace: [],
          departureTime: undefined,
          destination: [],
          longDistanceVehicle: undefined,
          longDistanceCost: 0,
          sortDistanceVehicle: undefined,
          sortDistanceCost: 0,
          repastDays: 0,
          foodCost: 0,
          serialNum: 0,
          accommodationDays: 0,
          accommodationCost: 0,
          totalCost: 0
        })
        that.form = { ...that.form, travelRecordList }
      } else if (type === 'remove') {
        let travelRecordList = [...that.form.travelRecordList]
        travelRecordList = travelRecordList.filter(item => item.key !== record.key)
        that.form = { ...that.form, travelRecordList }
      }
    },
    handleAreaChange({ area, text }, field, record) {
      const that = this
      const travelRecordList = [...that.form.travelRecordList]
      const target = travelRecordList.find(item => item.key === record.key)
      target[`${field}Name`] = text
      that.form = { ...that.form, travelRecordList }
      console.log(arguments)
    },
    handleTravelRecordListChange() {
      const that = this
      const travelRecordList = [...that.form.travelRecordList]

      const result = travelRecordList.reduce(
        (obj, current) => {
          const longDistanceCost = Number(current.longDistanceCost) || 0
          const sortDistanceCost = Number(current.sortDistanceCost) || 0

          const repastDays = Number(current.repastDays) || 0
          const foodCost = Number(current.foodCost) || 0

          const accommodationDays = Number(current.accommodationDays) || 0
          const accommodationCost = Number(current.accommodationCost) || 0

          //const totalCost = longDistanceCost + sortDistanceCost + repastDays * foodCost + accommodationDays * accommodationCost

          const totalCost = longDistanceCost + sortDistanceCost + foodCost + accommodationCost

          current.totalCost = totalCost

          obj.totalLongDistanceCost += longDistanceCost
          obj.totalSortDistanceCost += sortDistanceCost
          obj.totalFoodCost += foodCost
          obj.totalAccommodationCost += accommodationCost
          obj.totalCost += current.totalCost
          return obj
        },
        {
          totalLongDistanceCost: 0,
          totalSortDistanceCost: 0,
          totalFoodCost: 0,
          totalAccommodationCost: 0,
          totalCost: 0
        }
      )
      that.form = {
        ...that.form,
        travelRecordList,
        __sum: result
      }
    },
    handleTravelSelect(rows) {
      console.log(arguments)
      this.travelCaseList = rows.map(item => {
        item.key = this._uuid()
        return item
      })
      this.form = { ...this.form, travelId: rows.map(item => item.id) }
    },
    handleTravelCase(type, record) {
      if (type === 'remove') {
        this.travelCaseList = this.travelCaseList.filter(item => item.key !== record.key)
        this.form = {
          ...this.form,
          travelId: this.travelCaseList.map(item => item.id).join(',')
        }
      }
    },
    //审批
    approvalAction(type) {
      const that = this
      if (that.$refs['approvalForm']) {
        that.$refs['approvalForm'].validate(valid => {
          if (valid) {
            if (type === 1) {
              that.passAction()
            } else {
              that.noPassAction()
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      } else {
        if (type === 1) {
          that.passAction()
        } else {
          that.noPassAction()
        }
      }
    },
    submitAction(opt = {}) {
      const that = this

      const values = Object.assign({}, opt, { ...that.approvalForm }, { approveId: that.record.id })
      that.spinning = true
      reimburseApproval(values)
        .then(res => {
          that.spinning = false
          that.visible = false
          that.$message.info(res.msg)
          that.$emit('finish')
        })
        .catch(err => (that.spinning = false))
    },
    passAction(opt = {}) {
      this.submitAction(Object.assign({}, { isAdopt: 0, opinion: '通过' }, opt || {}))
    },
    noPassAction() {
      this.$refs.approval.query()
    },
    opinionChange(opinion) {
      //审批意见
      this.submitAction({
        isAdopt: 1,
        opinion: opinion
      })
    }
  }
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
