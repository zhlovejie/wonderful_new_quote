<template>
  <a-modal
    :title="modalTitle"
    :width="800"
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
            <td style="width: 200px" class="requiredMark">仓库类型</td>
            <td>
              <a-form-model-item prop="warehouseType" v-if="!isDisabled">
                <a-select v-model="form.warehouseType" :disabled="AshSetting">
                  <a-select-option :value="1">自动化立库</a-select-option>
                  <a-select-option :value="2">平面库</a-select-option>
                </a-select>
              </a-form-model-item>
              <span v-else>
                {{ detail.warehouseType === 1 ? '自动化立库' : '平面库' }}
              </span>
            </td>
          </tr>
          <tr>
            <td class="requiredMark">仓库代码</td>
            <td>
              <a-form-model-item prop="warehouseCode" v-if="!isDisabled">
                <a-input :disabled="AshSetting" v-model="form.warehouseCode" />
              </a-form-model-item>
              <span v-else>
                {{ detail.warehouseCode }}
              </span>
            </td>
          </tr>
          <tr>
            <td class="requiredMark">仓库名称</td>
            <td>
              <a-form-model-item prop="warehouseName" v-if="!isDisabled">
                <a-input v-model="form.warehouseName" :disabled="AshSetting" />
              </a-form-model-item>
              <span v-else>
                {{ detail.warehouseName }}
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
          </tr>
          <tr>
            <td>负责人电话</td>
            <td>
              <span>
                {{ form.applyUser && form.applyUser.mobile ? form.applyUser.mobile : '系统带入' }}
              </span>
            </td>
          </tr>
          <tr>
            <td class="requiredMark">质检人</td>
            <td>
              <a-form-model-item prop="applyUsers" v-if="!isDisabled">
                <DepartmentUser allowClear :info.sync="form.applyUsers" />
              </a-form-model-item>
              <span v-else> {{ detail.inspectorDepartmentName }}----{{ detail.inspectorUserName }} </span>
            </td>
          </tr>
          <tr>
            <td>备注</td>
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
import { addOrUpdate, getDetailById, delValidation } from '@/api/storage'
import DepartmentUserCascade from '@/components/CustomerList/DepartmentUserCascade'
import DepartmentUser from './DepartmentUserCascade'

export default {
  name: 'EnterpriseSynopsis',
  components: {
    DepartmentUserCascade,
    DepartmentUser,
  },
  data() {
    return {
      Warehouse: [],
      visible: false,
      confirmLoading: false,
      AshSetting: false,
      addOredit: 'add',
      record: {},
      form: {},
      detail: {},
      rules: {
        warehouseType: [{ required: true, message: '请选择仓库类型', trigger: 'change' }],
        applyUser: [{ required: true, message: '请选择负责人' }],
        applyUsers: [{ required: true, message: '请选择质检人' }],
        warehouseCode: [{ required: true, message: '请输入仓库代码', trigger: 'blur' }],
        warehouseName: [{ required: true, message: '请输入仓库名称', trigger: 'blur' }],
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
      this.form = {}
      this.record = record
      if (type !== 'add') {
        let that = this
        getDetailById({ id: record.id })
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
              applyUsers: {
                inspectorDepartmentId: that.detail.inspectorDepartmentId,
                inspectorDepartmentName: that.detail.inspectorDepartmentName,
                inspectorUserId: that.detail.inspectorUserId.split(',').map((i) => {
                  return Number(i)
                }),
                inspectorUserName: that.detail.inspectorUserName,
              },
            }
          })
          .catch((err) => {
            that.spinning = false
            that.$message.error(err)
          })
        delValidation({ id: record.id }).then((res) => {
          if (+res.code === 500) {
            this.AshSetting = true
          }
        })
      }
    },

    close() {
      this.$emit('ok')
      this.$refs.ruleForm.resetFields() // 清空表
      this.visible = false
    },
    handleOk() {
      const _this = this
      if (this.isView) {
        return (this.visible = false)
      }
      _this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          let { depId, depName, userId, userName, mobile } = _this.form.applyUser
          let { inspectorDepartmentId, inspectorDepartmentName, inspectorUserId, inspectorUserName } =
            _this.form.applyUsers
          let { remark, warehouseType, warehouseCode, warehouseName } = _this.form
          let baseInfo = {
            remark,
            warehouseType,
            warehouseCode,
            warehouseName,
            inspectorDepartmentId,
            inspectorDepartmentName,
            inspectorUserId: inspectorUserId.toString(),
            inspectorUserName: inspectorUserName,
            headUserPhone: mobile,
            headDepartmentId: depId,
            headDepartmentName: depName,
            headUserId: userId,
            headUserName: userName,
          }
          if (this.isEdit) {
            baseInfo.id = this.record.id
          }
          _this.confirmLoading = true
          addOrUpdate(baseInfo)
            .then((res) => {
              if (res.code == 200) {
                _this.close()
                _this.confirmLoading = false
                _this.$message.success('保存成功')
              } else {
                _this.confirmLoading = false
                _this.$message.error(res.msg)
              }
            })
            .catch(() => {})
        }
      })
      // 触发表单验证
      // this.form.validateFields((err, values) => {
      //   // 验证表单没错误
      //   if (!err) {
      //     if (this.isEdit) {
      //       values.id = this.record.id
      //     }

      //   }
      // })
    },
    previewCancel() {
      this.previewVisible = false
    },
    handleCancel() {
      this.close()
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
