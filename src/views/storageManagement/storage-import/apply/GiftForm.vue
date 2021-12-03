<template>
  <a-form-model
        ref="ruleForm"
        :model="form"
        :rules="rules"
        class="gift-form-wrapper"
      >
        <div class="card-item">
          <div class="__hd">基本信息</div>
          <div class="__bd">
            <table class="custom-table custom-table-border">
              <tr>
                <td style="width:150px;">入库申请单号</td>
                <td style="width:350px;">
                  <a-form-model-item>
                    <span>{{form.storageCode}}</span>
                  </a-form-model-item>
                </td>
                <td style="width:150px;">入库仓库</td>
                <td style="width:350px;">
                  <a-form-model-item prop="bomCode">
                    <span>{{form.warehouseName}}</span>
                  </a-form-model-item>
                </td>
              </tr>
              <tr>
                <td>紧急程度</td>
                <td>
                  <a-form-model-item prop="useStatus">
                    <a-select
                      v-model="form.urgentType"
                      placeholder="状态"
                    >
                      <a-select-option :value="1">一般</a-select-option>
                      <a-select-option :value="2">紧急</a-select-option>
                      <a-select-option :value="3">特急</a-select-option>
                    </a-select>
                  </a-form-model-item>
                </td>
                <td>日期</td>
                <td>
                  <a-form-model-item>
                    <a-date-picker v-model="form.storageDate" />
                  </a-form-model-item>
                </td>
              </tr>
            </table>
          </div>

          <div class="__hd">物料信息</div>
          <div class="__bd">
            <a-table
              :columns="columns"
              :dataSource="form.materialTableList"
              :pagination="false"
              size="small"
            >
              <div
                slot="order"
                slot-scope="text, record, index"
              >
                {{index + 1}}
              </div>

              <div
                slot="materialCode"
                slot-scope="text, record, index"
              >
                <a-form-model-item
                  :prop="`materialTableList.${index}.materialCode`"
                  :rules=" {required: true, message: '请选择物料'}"
                >
                  <MaterialFuzzySearch @change="handlerMaterialChange" />
                </a-form-model-item>
              </div>

              <div
                slot="materialCode"
                slot-scope="text, record, index"
              >
                <a-form-model-item
                  :prop="`materialTableList.${index}.materialCode`"
                  :rules=" {required: true, message: '请选择物料'}"
                >
                  <MaterialFuzzySearch @change="handlerMaterialChange" />
                </a-form-model-item>
              </div>


              
              <div
                slot="materialName"
                slot-scope="text, record, index"
              >
                <a-popover title="物料信息">
                  <template slot="content">
                    <h3>物料名称</h3>
                    <p style="width:450px;">{{record.materialName}}</p>
                    <h3>规格型号</h3>
                    <p style="width:450px;">{{record.specification}}</p>
                    <h3>物料代码</h3>
                    <p style="width:450px;">{{record.materialCode}}</p>
                  </template>
                  <span>{{text}}</span>
                </a-popover>
              </div>

              <div
                slot="remarks"
                slot-scope="text, record"
              >
                <a-form-model-item>
                  <a-textarea v-model="record.remarks" placeholder="备注" auto-size />
                </a-form-model-item>
              </div>
            </a-table>
          </div>
        </div>
  </a-form-model>
</template>

<script>
import MaterialFuzzySearch from '@/components/CustomerList/MaterialFuzzySearch'

const columns = [
  {
    title: '序号',
    key: 'order',
    width: '70px',
    scopedSlots: { customRender: 'order' }
  },
  {
    title: '物料代码',
    dataIndex: 'materialCode',
    scopedSlots: { customRender: 'materialCode' }
  },
  {
    title: '物料名称',
    dataIndex: 'materialName',
    scopedSlots: { customRender: 'materialName' }
  },
  {
    title: '辅计量单位',
    dataIndex: 'subUnit',
  },
  {
    title: '产品重量',
    dataIndex: 'weight',
  },
  {
    title: '入库数量',
    dataIndex: 'storageNum',
    scopedSlots: { customRender: 'storageNum' }
  },
  {
    title: '备注',
    dataIndex: 'remarks',
    scopedSlots: { customRender: 'remarks' }
  },
  {
    title: '操作',
    scopedSlots: { customRender: 'action' }
  }
]


export default {
  name:'GiftForm',
  components:{
    MaterialFuzzySearch
  },
  data(){
    return {
      columns,
      form: {
        materialTableList: [] //物料信息
      },
      rules: {
        // routeName: [{ required: true, message: '请输入工艺路线名称' }],
        // defaultStatus: [{ required: true, message: '请选择缺省状态' }],
        // materialCode: [{ required: true, message: '请选择物料代码' }]
      }
    }
  }
}
</script>