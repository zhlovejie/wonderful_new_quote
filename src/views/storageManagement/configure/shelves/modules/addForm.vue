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
            <td class="requiredMark">货架代码</td>
            <td>
              <a-form-model-item prop="shelvesCode" v-if="!isDisabled">
                <a-input v-model="form.shelvesCode" :disabled="ifdelvali" :maxLength="10" />
              </a-form-model-item>
              <span v-else>
                {{ detail.shelvesCode }}
              </span>
            </td>
            <td class="requiredMark">货架名称</td>
            <td>
              <a-form-model-item prop="shelvesName" v-if="!isDisabled">
                <a-input :disabled="ifdelvali" v-model="form.shelvesName" />
              </a-form-model-item>
              <span v-else>
                {{ detail.shelvesName }}
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
              <a-form-model-item ref="applyUser" prop="applyUser" v-if="!isDisabled">
                <DepartmentUserCascade allowClear :info.sync="form.applyUser" />
              </a-form-model-item>
              <span v-else> {{ detail.headDepartmentName }}----{{ detail.headUserName }} </span>
            </td>
            <td>负责人电话</td>
            <td>
              <span>
                {{ form.applyUser && form.applyUser.mobile ? form.applyUser.mobile : '系统带入' }}
              </span>
            </td>
          </tr>

          <tr>
            <td class="requiredMark">列</td>
            <td>
              <a-form-model-item prop="shelvesColumn" v-if="!isDisabled">
                <a-input v-model="form.shelvesColumn" :disabled="ifdelvali" />
              </a-form-model-item>
              <span v-else>
                {{ detail.shelvesColumn }}
              </span>
            </td>
            <td class="requiredMark">行</td>
            <td>
              <a-form-model-item prop="shelvesRow" v-if="!isDisabled">
                <a-input v-model="form.shelvesRow" :disabled="ifdelvali" />
              </a-form-model-item>
              <span v-else>
                {{ detail.shelvesRow }}
              </span>
            </td>
          </tr>
          <tr>
            <td>总库位</td>
            <td>
              <span>
                {{
                  form.shelvesRow && form.shelvesColumn && form.shelvesRow
                    ? form.shelvesRow * form.shelvesColumn
                    : '系统计算'
                }}
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
  roadwaygetList,
  shelvesaddOrUpdate,
  shelvesDetailById,
  shelvesdelValidation,
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
      form: {},
      detail: {},
      rules: {
        warehouseId: [{ required: true, message: '请选择所属仓库', trigger: 'change' }],
        reservoirAreaId: [{ required: true, message: '请选择所属库区', trigger: 'change' }],
        applyUser: [{ required: true, message: '请选择负责人', trigger: 'change' }],
        shelvesRow: [{ required: true, message: '请输入行', trigger: 'blur' }],
        shelvesColumn: [{ required: true, message: '请输入列', trigger: 'blur' }],
        shelvesCode: [{ required: true, message: '请输入货架代码', trigger: 'blur' }],
        shelvesName: [{ required: true, message: '请输入货架名称', trigger: 'blur' }],
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
      getList({ warehouseType: 2 }).then((res) => {
        this.warehouseList = res.data
      })
      // ReservoiGetList().then((res) => {
      //   this.ReservoiList = res.data
      // })
      roadwaygetList().then((res) => {
        this.roadwaygetList = res.data
      })

      if (type !== 'add') {
        let that = this
        shelvesdelValidation({ id: record.id }).then((res) => {
          if (+res.code === 200) {
            that.ifdelvali = false
          } else {
            that.ifdelvali = true
          }
        })
        shelvesDetailById({ id: record.id })
          .then((res) => {
            that.spinning = false
            this.warehchange(res.data.warehouseId)
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
          let { shelvesCode, shelvesName, warehouseId, remark, shelvesColumn, shelvesRow, reservoirAreaId } = _this.form
          let baseInfo = {
            shelvesCode,
            shelvesName,
            warehouseId,
            reservoirAreaId,
            headUserPhone: mobile,
            headDepartmentId: depId,
            headDepartmentName: depName,
            headUserId: userId,
            headUserName: userName,
            remark,
            shelvesColumn,
            shelvesRow,
            totalLocation: shelvesColumn * shelvesRow,
          }
          if (this.isEdit) {
            baseInfo.id = this.record.id
          }
          _this.confirmLoading = true
          shelvesaddOrUpdate(baseInfo)
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
