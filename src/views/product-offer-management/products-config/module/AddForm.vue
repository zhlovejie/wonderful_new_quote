<template>
  <a-modal
    :title="modalTitle"
    :width="850"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <a-spin :spinning="spinning">
      <a-form :form="form" class="add-form-wrapper">
        <a-form-item label="系列产品名称">
          <a-input
            :disabled="isDisabled"
            v-decorator="['name', { rules: [{ required: true, message: '系列产品名称' }] }]"
          />
        </a-form-item>
        <a-form-item label="系列产品型号">
          <a-input
            :disabled="isDisabled"
            v-decorator="['model', { rules: [{ required: true, message: '系列产品名称' }] }]"
          />
        </a-form-item>
        <a-form-item label="产品类型">
          <a-select
            :disabled="isDisabled"
            :allowClear="true"
            v-decorator="['productTypeConfigId', { rules: [{ required: true, message: '请选择产品类型' }] }]"
            placeholder="请选择产品类型"
            style="width: 100%"
          >
            <a-select-option v-for="item in productPriceCoefficientList" :value="item.id" :key="item.id">{{
              item.typeName
            }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="图片">
          <UploadFile ref="uploadFile" txt="上传图片" />
          <a-input hidden v-decorator="['productPic', { rules: [{ required: true, message: '请上传产品图片' }] }]" />
        </a-form-item>
        <a-form-item label="是否为产品">
          <a-radio-group v-decorator="['type', { initialValue: 1 }]">
            <a-radio :value="0">是</a-radio>
            <a-radio :value="1">否</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="是否在售">
          <a-radio-group v-decorator="['isSale', { initialValue: 0 }]">
            <a-radio :value="0">在售</a-radio>
            <a-radio :value="1">停产</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="标准配置" class="add-shadow">
          <OptList
            ref="ref_optStand"
            :dataSource="optStand"
            inputKey="optStand"
            :showRequire="false"
            @change="tableOptChoiceSelected"
          />
          <a-button style="width: 100%" type="dashed" icon="plus" @click="ShowModule('optStand')"
            >添加标准配置</a-button
          >
        </a-form-item>
        <a-form-item label="中控系列项" class="add-shadow">
          <OptList
            ref="ref_optControl"
            :dataSource="optControl"
            inputKey="optControl"
            :showRequire="false"
            @change="tableOptChoiceSelected"
          />
          <a-button style="width: 100%" type="dashed" icon="plus" @click="ShowModule('optControl')"
            >添加标准配置</a-button
          >
        </a-form-item>
        <div class="opt-choice-wrapper add-shadow">
          <a-form-item label="选择配置">
            <OptList
              ref="ref_optSelect"
              :dataSource="optSelect"
              inputKey="optSelect"
              :showRequire="false"
              @change="tableOptChoiceSelected"
            />
            <a-button style="width: 100%" type="dashed" icon="plus" @click="ShowModule('optSelect')"
              >添加选择配置</a-button
            >
          </a-form-item>
          <a-form-item label="选择项">
            <div class="opt-choice-item" :label="`选择项 ${index + 1}`" v-for="(item, index) in optChoice" :key="index">
              <div class="opt-choice-header">
                <h4>选择项{{ index + 1 }}:</h4>
                <a class="opt-choice-delete" @click="delOptChoice(index)" title="删除">删除</a>
              </div>
              <OptList
                :ref="`ref_optChoice_${index}`"
                :dataSource="item.dataSource"
                :inputKey="`optChoice.${index}`"
                :showRequire="true"
                @change="tableOptChoiceSelected"
              />
              <a-button style="width: 100%" type="dashed" icon="plus" @click="ShowModule('optChoice', index)"
                >添加</a-button
              >
            </div>

            <a-button style="width: 100%" type="dashed" icon="plus" @click="addOptChoiceItem">添加选择项</a-button>
          </a-form-item>
        </div>

        <a-form-item label="备注" style="margin-top: 10px">
          <a-textarea
            placeholder="备注"
            :rows="5"
            v-decorator="['remarks', { rules: [{ required: false, message: '备注' }] }]"
          />
        </a-form-item>
      </a-form>
      <TableOptChoice ref="tableOptChoice" @select="tableOptChoiceSelected" />
    </a-spin>
  </a-modal>
</template>

<script>
import vuedraggable from 'vuedraggable'
import {
  priceAdjustProductConfigDetail,
  priceAdjustProductConfigAddAndUpdate,
  typeConfigList,
} from '@/api/productOfferManagement'
import { productPriceCoefficientListWithoutPage } from '@/api/workBox'
import TableOptChoice from './TableOptChoice'
import OptList from './OptList'
import UploadFile from './UploadFile'
export default {
  name: 'AddForm',
  components: {
    vuedraggable,
    TableOptChoice,
    OptList,
    UploadFile,
  },
  data() {
    return {
      form: this.$form.createForm(this, { name: 'addForm' }),
      visible: false,
      actionType: 'add',
      spinning: false,
      record: {},
      optStand: [], //标准配置
      optControl: [], //中控系列项
      optSelect: [], //选择配置
      optChoice: [], //选择项
      productPriceCoefficientList: [],
    }
  },
  computed: {
    modalTitle() {
      let m = {
        view: '查看',
        add: '新增',
        edit: '修改',
        approval: '审批',
      }
      return `${m[this.actionType]}系列产品`
    },
    isView() {
      return this.actionType === 'view'
    },
    isAdd() {
      return this.actionType === 'add'
    },
    isEdit() {
      return this.actionType === 'edit'
    },
    isApproval() {
      return this.actionType === 'approval'
    },
    isDisabled() {
      return this.isView || this.isApproval
    },
  },

  methods: {
    init() {
      let that = this
      let queue = []
      queue.push(
        typeConfigList().then((res) => {
          that.productPriceCoefficientList = res.data
        })
      )
      return Promise.all(queue)
    },
    async handleOk() {
      let that = this
      if (that.isView || that.isApproval) {
        that.handleCancel()
        return
      }
      let files = that.$refs.uploadFile.getFiles()
      if (files.length > 0) {
        that.form.setFieldsValue({ productPic: files[0].url })
      }

      this.form.validateFields((err, values) => {
        if (!err) {
          if (that.isEdit) {
            values.id = that.record.id
          }

          let priceSysConfigBoList = []

          let optStandData = that.$refs['ref_optStand'].getData()
          let optSelectData = that.$refs['ref_optSelect'].getData()
          let optControlData = that.$refs['ref_optControl'].getData()
          let optChoiceData = []

          that.optChoice.map((item, index) => {
            try {
              let target = that.$refs[`ref_optChoice_${index}`][0]
              if (target) {
                optChoiceData.push(target.getData())
              }
            } catch (err) {
              console.log(err)
            }
          })

          optStandData &&
            optStandData.map((item, index) => {
              priceSysConfigBoList.push({
                itemId: item.id,
                mainBody: 2,
                orderNo: item.serialNum,
                type: 1,
                productId: values.id || '',
              })
            })

          optControlData &&
            optControlData.map((item, index) => {
              priceSysConfigBoList.push({
                itemId: item.id,
                mainBody: 2,
                orderNo: item.serialNum,
                type: 3,
                productId: values.id || '',
              })
            })

          optSelectData &&
            optSelectData.map((item, index) => {
              priceSysConfigBoList.push({
                itemId: item.id,
                mainBody: 2,
                orderNo: item.serialNum,
                type: 2,
                productId: values.id || '',
              })
            })

          optChoiceData &&
            optChoiceData.map((items, index) => {
              items.map((item, _index) => {
                priceSysConfigBoList.push({
                  groupId: index + 1,
                  itemId: item.id,
                  mainBody: 2,
                  orderNo: item.serialNum,
                  type: item.isRequire,
                  productId: values.id || '',
                })
              })
            })

          values.priceSysConfigBoList = priceSysConfigBoList
          values.productType = that.record.productType
          console.log('Received values of form: ', values)
          that.spinning = true
          priceAdjustProductConfigAddAndUpdate(values)
            .then((res) => {
              that.spinning = false
              if (res.code === 200) {
                that.visible = false
                that.$message.success('操作成功')
                that.$emit('finish')
              } else {
                that.$message.warning(res.msg)
              }
            })
            .catch((err) => {
              console.log(err)
              that.$message.error('操作失败')
              that.spinning = false
            })
        }
      })
    },
    handleCancel() {
      this.form.resetFields()
      this.$nextTick(() => (this.visible = false))
    },
    async query(type, record) {
      let that = this
      that.actionType = type
      that.record = record || {}
      that.form.resetFields()
      that.optStand = []
      that.optControl = []
      that.optSelect = []
      that.optChoice = []
      that.$refs.uploadFile && that.$refs.uploadFile.setFiles([])
      await that.init()
      that.visible = true

      if (this.isAdd) {
        return
      }

      priceAdjustProductConfigDetail({ id: record.id }).then((res) => {
        res.data.productPic &&
          that.$refs.uploadFile &&
          that.$refs.uploadFile.setFiles([
            {
              name: res.data.productPic.split('/').slice(-1).join(''),
              url: res.data.productPic,
            },
          ])
        //debugger
        that.form.setFieldsValue({
          name: res.data.name,
          model: res.data.model,
          type: res.data.type,
          remarks: res.data.remarks,
          productTypeConfigId: +res.data.productTypeConfigId,
          productPic: res.data.productPic || undefined,
          isSale: res.data.isSale,
        })
        let { optStandData, optSelectData, optChoiceData, optControlData } = that.formatData(res.data.sysConfigList)
        that.optStand = optStandData
        that.optSelect = optSelectData
        that.optChoice = optChoiceData
        that.optControl = optControlData
      })
    },
    ShowModule(key, index) {
      let that = this
      let map = {
        optStand: {
          key: 'optStand',
          searchParam: { type: 1 },
          selected: that.optStand.map((item) => Object.assign({}, item)),
        },
        optControl: {
          key: 'optControl',
          searchParam: { type: 2 },
          selected: that.optControl.map((item) => Object.assign({}, item)),
        },
        optSelect: {
          key: 'optSelect',
          searchParam: { type: 1 },
          selected: that.optSelect.map((item) => Object.assign({}, item)),
        },
        optChoice: {
          key: 'optChoice',
          searchParam: {},
          selected: that.optChoice.map((item) => Object.assign({}, item)),
        },
      }

      if (key === 'optChoice') {
        map[key] = {
          key: `optChoice.${index}`,
          searchParam: {},
          selected: that.optChoice[index]['dataSource'].map((item) => Object.assign({}, item)),
        }
      }

      map[key] && this.$refs.tableOptChoice.query(map[key])
    },
    tableOptChoiceSelected(result) {
      //debugger
      let that = this
      let { inputKey, selectedRecord } = result
      if (inputKey.startsWith('optChoice')) {
        let idx = inputKey.split('.')[1]
        let dataSource = [...that.optChoice]
        dataSource[idx]['dataSource'] = selectedRecord.map((item, index) => {
          let _item = Object.assign({}, item)
          _item.serialNum = index + 1
          return _item
        })
        that.optChoice = [...dataSource]
      } else {
        let dataSource = [...that[inputKey]]
        dataSource = selectedRecord.map((item, index) => {
          let _item = Object.assign({}, item)
          _item.serialNum = index + 1
          return _item
        })
        that[inputKey] = [...dataSource]
      }
    },
    addOptChoiceItem() {
      this.optChoice.push({
        dataSource: [],
      })
    },
    delOptChoice(index) {
      this.optChoice.splice(index, 1)
    },
    formatData(data) {
      let formatDataItem = (data) => {
        //返回的列表数据格式转换成需要的数据格式
        return data.map((item, index) => {
          let _item = {
            id: item.itemId,
            itemName: item.name,
            key: item.itemId,
            order: index + 1,
            serialNum: index + 1,
            productId: item.productId,
          }
          // if ([4, 5,6].includes(item.type)) {
          //   _item.isRequire = +item.type
          // }
          _item.isRequire = +item.type
          return _item
        })
      }
      let optStandData = data
        .filter((item) => item.mainBody === 2 && item.type === 1)
        .sort((a, b) => a.orderNo - b.orderNo)
      let optSelectData = data
        .filter((item) => item.mainBody === 2 && item.type === 2)
        .sort((a, b) => a.orderNo - b.orderNo)
      let optControlData = data
        .filter((item) => item.mainBody === 2 && item.type === 3)
        .sort((a, b) => a.orderNo - b.orderNo)

      let optChoiceData = data.filter((item) => item.mainBody === 2 && [4, 5, 6].includes(item.type))

      let groups = [...new Set(optChoiceData.map((item) => item.groupId))].sort()
      let res = []
      groups.map((groupId) => {
        let dataSource = optChoiceData.filter((item) => item.groupId === groupId).sort((a, b) => a.orderNo - b.orderNo)
        if (dataSource.length > 0) {
          res.push({
            dataSource: formatDataItem(dataSource),
          })
        }
      })
      return {
        optStandData: formatDataItem(optStandData),
        optSelectData: formatDataItem(optSelectData),
        optControlData: formatDataItem(optControlData),
        optChoiceData: res,
      }
    },
  },
}
</script>

<style scoped>
.custom-table-border th,
.custom-table-border td {
  padding: 5px 10px;
}

.add-form-wrapper >>> .ant-form-item {
  display: flex;
  margin-bottom: 10px;
}

.add-form-wrapper >>> .custom-table {
  margin-bottom: 0;
}

.add-form-wrapper >>> .ant-form-item .ant-form-item-label {
  width: 120px;
  text-align: left;
}
.add-form-wrapper >>> .ant-form-item .ant-form-item-control-wrapper {
  flex: 1;
}

.add-shadow {
  /* box-shadow: 0 0 3px #ccc; */
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  padding: 10px 20px 20px;
}

.opt-choice-wrapper .opt-choice-item {
  position: relative;
  border-top: 1px solid #ddd;
  padding: 10px 0;
  margin-bottom: 15px;
}

.opt-choice-wrapper .opt-choice-item .opt-choice-delete {
  padding: 0 15px;
}

.opt-choice-wrapper .opt-choice-item .opt-choice-header {
  display: flex;
  line-height: 40px;
}
.opt-choice-wrapper .opt-choice-item .opt-choice-header h4 {
  flex: 1;
  margin-bottom: 0;
}
.opt-choice-wrapper .opt-choice-item >>> .opt-list-is-require {
  position: absolute;
  top: 10px;
  right: 60px;
}
</style>