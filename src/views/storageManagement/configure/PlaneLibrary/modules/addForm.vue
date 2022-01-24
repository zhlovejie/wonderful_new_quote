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
            <td class="requiredMark">平面库位代码</td>
            <td>
              <a-form-model-item prop="planeCode" v-if="!isDisabled">
                <a-input v-model="form.planeCode" :disabled="ifdelvali" :maxLength="4" />
              </a-form-model-item>
              <span v-else>
                {{ detail.planeCode }}
              </span>
            </td>
            <td class="requiredMark">平面库位名称</td>
            <td>
              <a-form-model-item ref="planeName" prop="planeName" v-if="!isDisabled">
                <a-input v-model="form.planeName" :disabled="ifdelvali" />
              </a-form-model-item>
              <span v-else>
                {{ detail.planeName }}
              </span>
            </td>
          </tr>
          <tr>
            <td style="width: 160px" class="requiredMark">所属仓库</td>
            <td>
              <a-form-model-item prop="warehouseId" v-if="!isDisabled">
                <a-select :disabled="ifdelvali" v-model="form.warehouseId" @change="warehchange">
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
                <a-select :disabled="ifdelvali" v-model="form.reservoirAreaId">
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
            <td class="requiredMark">负责人</td>
            <td>
              <a-form-model-item prop="applyUser" v-if="!isDisabled">
                <DepartmentUserCascade allowClear :info.sync="form.applyUser" />
              </a-form-model-item>
              <span v-else> {{ detail.headDepartmentName }}----{{ detail.headUserName }} </span>
            </td>
            <td>负责人电话</td>
            <td>
              <a-form-model-item ref="headUserPhone" prop="headUserPhone" v-if="!isDisabled">
                <a-input v-model="form.headUserPhone" />
              </a-form-model-item>
              <span v-else>
                {{ detail.headUserPhone }}
              </span>
            </td>
          </tr>
          <tr>
            <td class="requiredMark">库位状态</td>
            <td>
              <a-form-model-item v-if="!isDisabled"> 闲置 </a-form-model-item>
              <span v-else>
                {{ detail.status === 0 ? '闲置' : '使用' }}
              </span>
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
    </a-spin>
  </a-modal>
</template>

<script>
import {
  getList,
  ReservoiGetList,
  planegetaddOrUpdate,
  planegetgetDetailById,
  planegetdelValidation,
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
      visible: false,
      ifdelvali: false,
      confirmLoading: false,
      addOredit: 'add',
      record: {},
      form: {
        status: 0,
      },
      detail: {},
      rules: {
        warehouseId: [{ required: true, message: '请选择所属仓库', trigger: 'change' }],
        reservoirAreaId: [{ required: true, message: '请选择所属库区', trigger: 'change' }],
        applyUser: [{ required: true, message: '请选择负责人', trigger: 'change' }],
        planeCode: [{ required: true, message: '请输入平面库位代码', trigger: 'blur' }],
        planeName: [{ required: true, message: '请输入平面库位名称', trigger: 'blur' }],
        headUserPhone: [{ required: true, message: '请输入负责人手机号', trigger: 'blur' }],
      },
    }
  },

  watch: {
    form: {
      handler(newValue, oldValue) {
        this.form.headUserPhone =
          newValue.applyUser && newValue.applyUser.mobile ? newValue.applyUser.mobile : this.form.headUserPhone
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
      this.ifdelvali = false
      getList({ warehouseType: 2 }).then((res) => {
        this.warehouseList = res.data
      })

      if (type !== 'add') {
        let that = this
        planegetdelValidation({ id: record.id }).then((res) => {
          if (+res.code === 200) {
            that.ifdelvali = false
          } else {
            that.ifdelvali = true
          }
        })
        planegetgetDetailById({ id: record.id })
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
          let { planeCode, planeName, warehouseId, remark, reservoirAreaId, headUserPhone, status } = _this.form
          let baseInfo = {
            planeCode,
            planeName,
            warehouseId,
            reservoirAreaId,
            headUserPhone,
            headDepartmentId: depId,
            headDepartmentName: depName,
            headUserId: userId,
            headUserName: userName,
            remark,
            status,
          }
          if (this.isEdit) {
            baseInfo.id = this.record.id
          }
          _this.confirmLoading = true
          planegetaddOrUpdate(baseInfo)
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
