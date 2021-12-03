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
        <h3>库位基本信息</h3>
        <table class="custom-table custom-table-border">
          <tr>
            <td class="requiredMark">立体货架号</td>
            <td>
              <a-form-model-item ref="stereoscopicCode" prop="stereoscopicCode" v-if="!isDisabled">
                <a-input
                  v-model="form.stereoscopicCode"
                  :disabled="ifdelvali"
                  :maxLength="4"
                  @blur="
                    () => {
                      $refs.stereoscopicCode.onFieldBlur()
                    }
                  "
                />
              </a-form-model-item>
              <span v-else>
                {{ detail.stereoscopicCode }}
              </span>
            </td>
            <td class="requiredMark">立体货架名称</td>
            <td>
              <a-form-model-item ref="stereoscopicName" prop="stereoscopicName" v-if="!isDisabled">
                <a-input
                  v-model="form.stereoscopicName"
                  @blur="
                    () => {
                      $refs.stereoscopicName.onFieldBlur()
                    }
                  "
                />
              </a-form-model-item>
              <span v-else>
                {{ detail.stereoscopicName }}
              </span>
            </td>
          </tr>
          <tr>
            <td style="width: 160px" class="requiredMark">所属仓库</td>
            <td>
              <a-form-model-item prop="warehouseId" v-if="!isDisabled">
                <a-select v-model="form.warehouseId">
                  <a-select-option v-for="item in warehouseList" :key="item.id" :value="item.id">{{
                    item.warehouseName
                  }}</a-select-option>
                </a-select>
              </a-form-model-item>
              <span v-else>
                {{ detail.warehouseName }}
              </span>
            </td>
            <td style="width: 160px" class="requiredMark">所属库区</td>
            <td>
              <a-form-model-item prop="reservoirAreaId" v-if="!isDisabled">
                <a-select v-model="form.reservoirAreaId">
                  <a-select-option v-for="item in ReservoiList" :key="item.id" :value="item.id">{{
                    item.reservoirName
                  }}</a-select-option>
                </a-select>
              </a-form-model-item>
              <span v-else>
                {{ detail.reservoirAreaName }}
              </span>
            </td>
          </tr>
          <tr>
            <td style="width: 160px" class="requiredMark">所属巷道</td>
            <td>
              <a-form-model-item prop="roadwayId" v-if="!isDisabled">
                <a-select v-model="form.roadwayId">
                  <a-select-option v-for="item in roadwaygetList" :key="item.id" :value="item.id">{{
                    item.roadwayName
                  }}</a-select-option>
                </a-select>
              </a-form-model-item>
              <span v-else>
                {{ detail.roadwayName }}
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
            <td>负责人电话</td>
            <td>
              <span>
                {{ form.applyUser && form.applyUser.mobile ? form.applyUser.mobile : '系统带入' }}
              </span>
            </td>
            <td>总库位</td>
            <td>
              <span>
                {{
                  form.locationRow && form.locationColumn && form.locationRow
                    ? form.locationRow * form.locationColumn
                    : '系统计算'
                }}
              </span>
            </td>
          </tr>
          <tr>
            <td class="requiredMark">列</td>
            <td>
              <a-form-model-item ref="locationColumn" prop="locationColumn" v-if="!isDisabled">
                <a-input
                  v-model="form.locationColumn"
                  :disabled="ifdelvali"
                  @blur="
                    () => {
                      $refs.locationColumn.onFieldBlur()
                    }
                  "
                />
              </a-form-model-item>
              <span v-else>
                {{ detail.locationColumn }}
              </span>
            </td>
            <td class="requiredMark">行</td>
            <td>
              <a-form-model-item ref="locationRow" prop="locationRow" v-if="!isDisabled">
                <a-input
                  v-model="form.locationRow"
                  :disabled="ifdelvali"
                  @blur="
                    () => {
                      $refs.locationRow.onFieldBlur()
                    }
                  "
                />
              </a-form-model-item>
              <span v-else>
                {{ detail.locationRow }}
              </span>
            </td>
          </tr>
        </table>
        <h3>库位状态</h3>
        <table class="custom-table custom-table-border">
          <tr>
            <td style="width: 160px">是否锁定</td>
            <td>
              <a-form-model-item v-if="!isDisabled">
                <a-radio-group v-model="form.isLock">
                  <a-radio :value="1"> 是 </a-radio>
                  <a-radio :value="0"> 否 </a-radio>
                </a-radio-group>
              </a-form-model-item>
              <span v-else>
                {{ detail.isLock === 1 ? '是' : '否' }}
              </span>
            </td>
          </tr>
          <tr>
            <td style="width: 160px">是否禁入</td>
            <td>
              <a-form-model-item v-if="!isDisabled">
                <a-radio-group v-model="form.isForbid">
                  <a-radio :value="1"> 是 </a-radio>
                  <a-radio :value="0"> 否 </a-radio>
                </a-radio-group>
              </a-form-model-item>
              <span v-else>
                {{ detail.isForbid === 1 ? '是' : '否' }}
              </span>
            </td>
          </tr>
          <tr>
            <td style="width: 160px">是否禁出</td>
            <td>
              <a-form-model-item v-if="!isDisabled">
                <a-radio-group v-model="form.isNoExit">
                  <a-radio :value="1"> 是 </a-radio>
                  <a-radio :value="0"> 否 </a-radio>
                </a-radio-group>
              </a-form-model-item>
              <span v-else>
                {{ detail.isNoExit === 1 ? '是' : '否' }}
              </span>
            </td>
          </tr>
          <tr>
            <td style="width: 160px">盘点锁</td>
            <td>
              <a-form-model-item v-if="!isDisabled">
                <a-radio-group v-model="form.inventoryLock">
                  <a-radio :value="1"> 是 </a-radio>
                  <a-radio :value="0"> 否 </a-radio>
                </a-radio-group>
              </a-form-model-item>
              <span v-else>
                {{ detail.inventoryLock === 1 ? '是' : '否' }}
              </span>
            </td>
          </tr>
          <tr>
            <td style="width: 160px">是否异常</td>
            <td>
              <a-form-model-item v-if="!isDisabled">
                <a-radio-group v-model="form.isAbnormal">
                  <a-radio :value="1"> 是 </a-radio>
                  <a-radio :value="0"> 否 </a-radio>
                </a-radio-group>
              </a-form-model-item>
              <span v-else>
                {{ detail.isAbnormal === 1 ? '是' : '否' }}
              </span>
            </td>
          </tr>

          <tr>
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
    </a-spin>
  </a-modal>
</template>

<script>
import {
  getList,
  ReservoiGetList,
  roadwaygetList,
  StereoscopicaddOrUpdate,
  StereoscopicgetDetailById,
  StereoscopicdelValidation,
} from '@/api/storage'
import DepartmentUserCascade from '@/components/CustomerList/DepartmentUserCascade'

export default {
  name: 'EnterpriseSynopsis',
  components: {
    DepartmentUserCascade,
  },
  data() {
    return {
      Warehouse: [],
      warehouseList: [],
      ReservoiList: [],
      roadwaygetList: [],
      visible: false,
      ifdelvali: false,
      confirmLoading: false,
      addOredit: 'add',
      record: {},
      form: {
        inventoryLock: 0,
        isAbnormal: 0,
        isForbid: 0,
        isLock: 0,
        isNoExit: 0,
      },
      detail: {},
      rules: {
        warehouseId: [{ required: true, message: '请选择所属仓库', trigger: 'change' }],
        reservoirAreaId: [{ required: true, message: '请选择所属库区', trigger: 'change' }],
        roadwayId: [{ required: true, message: '请选择所属巷道', trigger: 'change' }],
        applyUser: [{ required: true, message: '请选择负责人', trigger: 'change' }],
        locationRow: [{ required: true, message: '请输入行', trigger: 'blur' }],
        locationColumn: [{ required: true, message: '请输入列', trigger: 'blur' }],
        stereoscopicCode: [{ required: true, message: '请输入立体货架号', trigger: 'blur' }],
        stereoscopicName: [{ required: true, message: '请输入立体货架名称', trigger: 'blur' }],
      },
    }
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
    async query(type, record) {
      this.visible = true
      this.addOredit = type
      this.record = record
      this.form.remark = ''
      getList().then((res) => {
        this.warehouseList = res.data
      })
      ReservoiGetList().then((res) => {
        this.ReservoiList = res.data
      })
      roadwaygetList().then((res) => {
        this.roadwaygetList = res.data
      })

      if (type !== 'add') {
        let that = this
        StereoscopicdelValidation({ id: record.id }).then((res) => {
          if (+res.code === 200) {
            that.ifdelvali = false
          } else {
            that.ifdelvali = true
          }
        })
        StereoscopicgetDetailById({ id: record.id })
          .then((res) => {
            that.spinning = false
            that.detail = res.data
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
      }
    },

    handleOk() {
      const _this = this
      if (this.isView) {
        return (this.visible = false)
      }
      _this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          let { depId, depName, userId, userName, mobile } = _this.form.applyUser
          let {
            stereoscopicCode,
            stereoscopicName,
            warehouseId,
            roadwayId,
            reservoirAreaId,
            inventoryLock,
            isAbnormal,
            isForbid,
            remark,
            isLock,
            isNoExit,
            locationColumn,
            locationRow,
          } = _this.form
          let baseInfo = {
            stereoscopicCode,
            stereoscopicName,
            warehouseId,
            roadwayId,
            reservoirAreaId,
            headUserPhone: mobile,
            headDepartmentId: depId,
            headDepartmentName: depName,
            headUserId: userId,
            headUserName: userName,
            inventoryLock,
            isAbnormal,
            isForbid,
            isLock,
            remark,
            isNoExit,
            locationColumn,
            locationRow,
            totalLocation: locationColumn * locationRow,
          }
          if (this.isEdit) {
            baseInfo.id = this.record.id
          }
          _this.confirmLoading = true
          StereoscopicaddOrUpdate(baseInfo)
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
