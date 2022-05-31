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
            <td>加工商名称</td>
            <td colspan="3">
              <a-form-model-item> {{ detail.facName }} </a-form-model-item>
            </td>
          </tr>
        </table>

        <div class="__hd">物料信息</div>
        <div class="__bd">
          <a-table rowKey="id" :columns="columns" :dataSource="detail.materialList" :pagination="false" size="small">
            <div slot="order" slot-scope="text, record, index">
              {{ index + 1 }}
            </div>

            <template slot="footer">
              <a-row type="flex" align="middle">
                <a-col :span="4">
                  合计：
                </a-col>
                <a-col :span="20">
                  <a-form-model-item class="totle">
                    出库数量 &nbsp;{{
                      detail.materialList.reduce((adder, item) => adder + (parseFloat(item.exWarehouseNum) || 0), 0)
                    }}
                  </a-form-model-item>
                </a-col>
              </a-row>
            </template>
          </a-table>
        </div>

        <div class="__hd">检验记录</div>
        <table class="custom-table custom-table-border">
          <tr>
            <td style="width:150px;">实际质检数量</td>
            <td style="width:550px;">
              <a-form-model-item>{{
                detail.materialList.reduce((adder, item) => adder + (parseFloat(item.inspectionNum) || 0), 0)
              }}</a-form-model-item>
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

        <a-row v-if="!isView">
          <a-col :span="2">
            操作说明：
          </a-col>
          <a-col :span="22">
            <span
              >1.本次质检仅做记录，质检活动中遇到不合格物料走其他质检流程申请维修或退换，额外申请对应数量的合格物料补齐待检数量。<br />
              2.需保证本次质检保证需要出给外加工商的物料都是合格产品，实际质检数量默认为待检数量并不可修改。<br />
              3.确认提交后即代表本次需要出库的物料均为已检合格品。</span
            >
          </a-col>
        </a-row>

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
  materialTestDetail, //出库原料质检-详情
  materialTestAdd //出库原料质检-新增/编辑
} from '@/api/material'

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
    title: '出库数量',
    dataIndex: 'exWarehouseNum'
  },
  {
    title: '原料送取',
    dataIndex: 'providerText' //原料送取(1:委托方送货,2:加工商提货)
  }
]

export default {
  name: 'Materia-test-addForm',
  components: {},
  data() {
    return {
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
      return `${action}-出库原料质检单`
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
        //出库原料质检-查看详情
        materialTestDetail({ id: this.detail.id }).then(res => {
          let data = res.data
          that.detail = data
          that.detail.materialList = data.materialList.map(item => {
            ;(item.attributeText = { 1: '原材料', 2: '模具' }[item.attribute] || '未知'),
              (item.providerText = { 1: '委托方送货', 2: '加工商提货' }[item.provider] || '未知')
            return item
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
        const params = {
          ...that.detail,
          operationType: type === 'save' ? 1 : 2
        }
        that.spinning = true
        materialTestAdd(params)
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
      }
    },

    handleCancel() {
      const that = this
      that.$nextTick(() => {
        that.visible = false
      })
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
