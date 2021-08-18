<template>
  <a-modal
    :title="modalTitle"
    :width="1200"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
    :confirmLoading="spinning"
  >
    <template slot="footer">
      <template v-if="isEdit">
        <a-button class="a-button" type="primary" icon="close" @click="noPassAction(recordDetails)">不通过</a-button>
        <a-button class="a-button" type="primary" icon="check" @click="passAction()">通过</a-button>
      </template>
      <template v-else>
        <a-button key="back" @click="handleCancel">取消</a-button>
        <a-button type="primary" :loading="spinning" @click="handleOk(0)">保存</a-button>
        <a-button type="primary" :loading="spinning" @click="handleOk(1)">提交审批</a-button>
      </template>
    </template>

    <a-spin :spinning="spinning">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" class="bom-management-wrapper" layout="inline">
        <a-form-model-item label="供应商属性">
          <a-select
            placeholder="供应商属性"
            :disabled="isEdit"
            v-model="form.supplierType"
            :allowClear="true"
            style="width: 250px"
          >
            <a-select-option :value="0">物料供应商</a-select-option>
            <a-select-option :value="1">委外加工商</a-select-option>
          </a-select></a-form-model-item
        >
        <div class="card-item">
          <div class="__hd" v-if="!isEdit">选择供应商物料（非必填）</div>
          <div class="__bd" v-if="!isEdit">
            <a-form-model-item>
              <a-select
                style="width: 450px"
                show-search
                :value="Brandform.materialItem.__label"
                placeholder="模糊搜索"
                :default-active-first-option="false"
                :show-arrow="false"
                :filter-option="false"
                :not-found-content="allMaterialFuzzySearch.fetching ? undefined : '未找到匹配项'"
                @search="allMaterialFuzzySearchAction"
                @change="(key) => allMaterialFuzzySearchActionChange(key, record)"
              >
                <a-spin v-if="allMaterialFuzzySearch.fetching" slot="notFoundContent" size="small" />
                <a-select-option v-for="item in allMaterialFuzzySearch.list" :key="item.__key" :value="item.__key">
                  {{ item.__label }}
                </a-select-option>
              </a-select>
              <a-button key="submit" type="primary" style="margin-left: 10px" :loading="spinning" @click="brandAdd"
                >新增</a-button
              >
              <a-button key="submits" type="primary" style="margin-left: 10px" :loading="spinning" @click="materialAdd"
                >分类新增</a-button
              >
            </a-form-model-item>
          </div>
        </div>
        <a-form-model-item label="已选物料">(品牌及型号非必填) </a-form-model-item>
        <table class="custom-table custom-table-border">
          <tr v-for="(item, index) in brandList" :key="index">
            <td>{{ item.materialName }}{{ item.materialCode }}</td>
            <td>
              {{
                item.manageBrands.map((u) => u.brandName + '/' + u.manageBrandModels.map((i) => i.modelName)).join(',')
              }}
            </td>
            <td>
              <a-button @click="Addmodel(item)" style="margin-right: 10px">添加品牌型号</a-button>
              <a-button @click="modelDel(index)">删除</a-button>
            </td>
          </tr>
        </table>

        <div class="card-item">
          <div class="__hd">选择供应商属性</div>
          <div class="__bd">
            <a-form-model-item label="是否为平台类" prop="platformType">
              <a-select
                :disabled="isEdit"
                placeholder="请选择是否为平台"
                v-model="form.platformType"
                :allowClear="true"
                style="width: 200px"
              >
                <a-select-option :value="0">否</a-select-option>
                <a-select-option :value="1">是</a-select-option>
              </a-select></a-form-model-item
            >
            <a-form-model-item ref="platformName" label="所在平台为" prop="platformName">
              <a-input
                :disabled="isEdit"
                placeholder="请输入交易平台名称"
                v-model="form.platformName"
                :allowClear="true"
                @blur="
                  () => {
                    $refs.platformName.onFieldBlur()
                  }
                "
                style="width: 100%"
            /></a-form-model-item>
            <a-form-model-item label="供应商规模" prop="supplierScale">
              <a-select
                :disabled="isEdit"
                placeholder="选择供应商规模"
                v-model="form.supplierScale"
                :allowClear="true"
                style="width: 200px"
              >
                <a-select-option :value="0">小规模</a-select-option>
                <a-select-option :value="1">一般规模</a-select-option>
              </a-select></a-form-model-item
            >
            <div>
              <a-icon type="question-circle" style="margin-left: 5px; font-size：30px; color: #1890ff" />
              供应规模说明：累计采购金额10000及以下，单笔采购5000元及以下供应商为小规模供应商,其他均为一般供应商
            </div>
          </div>
        </div>
        <div v-if="form.supplierScale === 0">
          <div class="card-item">
            <div class="__hd">补全供应商信息</div>
            <div class="__bd">
              <a-row :gutter="[16, 24]">
                <a-col :span="12">
                  <a-form-model-item ref="scompanyName" label="供应商公司名称" prop="scompanyName">
                    <a-input
                      placeholder="请输入供应商公司名称"
                      :disabled="isEdit"
                      v-model="form.scompanyName"
                      :allowClear="true"
                      @blur="
                        () => {
                          $refs.scompanyName.onFieldBlur()
                        }
                      "
                      style="width: 250px"
                  /></a-form-model-item>
                </a-col>
                <a-col :span="12">
                  <a-form-model-item ref="pshopName" label="平台店铺名称" prop="pshopName">
                    <a-input
                      :disabled="isEdit"
                      placeholder="请输入平台店铺名称"
                      v-model="form.pshopName"
                      :allowClear="true"
                      @blur="
                        () => {
                          $refs.pshopName.onFieldBlur()
                        }
                      "
                      style="width: 250px"
                  /></a-form-model-item>
                </a-col>
              </a-row>
              <a-row :gutter="[16, 24]">
                <a-col :span="12">
                  <a-form-model-item ref="salesmanName" label="  业务员姓名  " prop="salesmanName">
                    <a-input
                      :disabled="isEdit"
                      placeholder="请输入业务员姓名"
                      v-model="form.salesmanName"
                      :allowClear="true"
                      @blur="
                        () => {
                          $refs.salesmanName.onFieldBlur()
                        }
                      "
                      style="width: 270px"
                  /></a-form-model-item>
                </a-col>
                <a-col :span="12">
                  <a-form-model-item ref="pcontactMode" label="平台联系方式" prop="pcontactMode">
                    <a-input
                      :disabled="isEdit"
                      placeholder="请输入平台联系方式"
                      v-model="form.pcontactMode"
                      :allowClear="true"
                      @blur="
                        () => {
                          $refs.pcontactMode.onFieldBlur()
                        }
                      "
                      style="width: 250px" /></a-form-model-item
                ></a-col>
              </a-row>
              <a-row :gutter="[16, 24]">
                <a-col :span="12">
                  <a-form-model-item ref="salesmanPhone" label="业务员手机号" prop="salesmanPhone">
                    <a-input-number
                      placeholder="请输入业务员手机号"
                      :disabled="isEdit"
                      v-model="form.salesmanPhone"
                      :allowClear="true"
                      @blur="
                        () => {
                          $refs.salesmanPhone.onFieldBlur()
                        }
                      "
                      style="width: 260px" /></a-form-model-item
                ></a-col>
                <a-col :span="12">
                  <a-form-model-item ref="salesmanWeChat" label="业务员微信号" prop="salesmanWeChat">
                    <a-input
                      placeholder="请输入业务员微信号"
                      :disabled="isEdit"
                      v-model="form.salesmanWeChat"
                      :allowClear="true"
                      @blur="
                        () => {
                          $refs.salesmanWeChat.onFieldBlur()
                        }
                      "
                      style="width: 250px"
                  /></a-form-model-item>
                </a-col>
              </a-row>
              <a-row :gutter="[16, 24]">
                <a-col :span="12">
                  <a-form-model-item label="成立年限" prop="establishYearId">
                    <a-select
                      placeholder="选择成立年限"
                      :disabled="isEdit"
                      v-model="form.establishYearId"
                      :allowClear="true"
                      style="width: 290px"
                    >
                      <a-select-option v-for="item in Position" :key="item.id" :value="item.id">{{
                        item.text
                      }}</a-select-option>
                    </a-select></a-form-model-item
                  >
                </a-col>
                <a-col :span="12">
                  <a-form-model-item label="诚信级别" prop="sincerityLevelId">
                    <a-select
                      placeholder="选择诚信级别"
                      :disabled="isEdit"
                      v-model="form.sincerityLevelId"
                      :allowClear="true"
                      style="width: 280px"
                    >
                      <a-select-option v-for="item in Warehouse" :key="item.id" :value="item.id">{{
                        item.text
                      }}</a-select-option>
                    </a-select></a-form-model-item
                  >
                </a-col>
              </a-row>
              <a-row :gutter="[16, 24]">
                <a-col :span="12">
                  <a-form-model-item label="结算方式" prop="settlementMode">
                    <a-select
                      placeholder="选择结算方式"
                      :disabled="isEdit"
                      v-model="form.settlementMode"
                      :allowClear="true"
                      style="width: 290px"
                    >
                      <a-select-option :value="0">现款现货</a-select-option>
                      <a-select-option :value="1">帐期结算</a-select-option>
                    </a-select></a-form-model-item
                  >
                </a-col>
                <a-col :span="12">
                  <a-form-model-item label="最后交易时间" prop="endTime">
                    <a-date-picker
                      v-model="form.endTime"
                      show-time
                      :disabled="form.endTime !== undefined && !isAdd ? true : false"
                      type="date"
                      placeholder="请选择最后交易时间"
                      style="width: 255px"
                    />
                  </a-form-model-item>
                </a-col>
              </a-row>
              <div v-if="form.settlementMode === 0" class="form wdf-form">
                <a-row class="wdf-row">
                  <a-col class :span="20">
                    <a-row type="flex" align="middle">
                      <!-- 预付款 -->
                      <a-col :span="20">
                        <a-row type="flex" justify="space-around" align="middle">
                          <a-col :span="4" :offset="1">
                            <a-form-model-item>
                              <a-checkbox-group v-model="c1">
                                <a-checkbox :value="1" :disabled="isEdit" name="type" @change="checkboxChange">
                                  预付款
                                </a-checkbox>
                              </a-checkbox-group>
                            </a-form-model-item>
                          </a-col>
                          <a-col :span="8">
                            <a-form-model-item ref="padvanceProportion" prop="padvanceProportion">
                              <a-input-number
                                :min="0"
                                :max="100"
                                :precision="0"
                                :disabled="isEdit"
                                placeholder="填入数字"
                                v-model="form.padvanceProportion"
                                :allowClear="true"
                                @blur="
                                  () => {
                                    $refs.padvanceProportion.onFieldBlur()
                                  }
                                "
                                style="width: 200px"
                              />
                              <span> %</span></a-form-model-item
                            >
                          </a-col>
                          <a-col :span="9"></a-col>
                        </a-row>
                      </a-col>
                      <!-- 预付款 END-->
                      <!-- 提货款 -->
                      <a-col :span="20">
                        <a-row type="flex" justify="space-around" align="middle">
                          <a-col :span="4" :offset="1">
                            <a-form-model-item>
                              <a-checkbox-group v-model="c2">
                                <a-checkbox :value="2" :disabled="isEdit" name="type" @change="checkboxChange">
                                  提货款
                                </a-checkbox>
                              </a-checkbox-group>
                            </a-form-model-item>
                          </a-col>
                          <a-col :span="8">
                            <a-form-model-item ref="ccommodityProportion" prop="ccommodityProportion">
                              <a-input-number
                                :min="0"
                                :max="100"
                                :disabled="isEdit"
                                :precision="0"
                                placeholder="填入数字"
                                v-model="form.ccommodityProportion"
                                :allowClear="true"
                                @blur="
                                  () => {
                                    $refs.ccommodityProportion.onFieldBlur()
                                  }
                                "
                                style="width: 200px"
                              />
                              <span> %</span></a-form-model-item
                            >
                          </a-col>
                          <a-col :span="9"></a-col>
                        </a-row>
                      </a-col>
                      <!-- 提货款 END-->
                    </a-row>
                    <a-row class="row-in-col" type="flex" align="middle">
                      <!-- 验收款 -->
                      <a-col :span="20">
                        <a-row type="flex" justify="space-around" align="middle">
                          <a-col :span="4" :offset="1">
                            <a-form-model-item>
                              <a-checkbox-group v-model="c3">
                                <a-checkbox :value="3" :disabled="isEdit" name="type" @change="checkboxChange">
                                  验收款
                                </a-checkbox>
                              </a-checkbox-group>
                            </a-form-model-item>
                          </a-col>
                          <a-col :span="8">
                            <a-form-model-item ref="ccollectProportion" prop="ccollectProportion">
                              <a-input-number
                                :min="0"
                                :disabled="isEdit"
                                :max="100"
                                :precision="0"
                                placeholder="填入数字"
                                v-model="form.ccollectProportion"
                                :allowClear="true"
                                @blur="
                                  () => {
                                    $refs.ccollectProportion.onFieldBlur()
                                  }
                                "
                                style="width: 200px"
                              />
                              <span> %</span></a-form-model-item
                            >
                          </a-col>
                          <a-col :span="9">
                            <a-form-model-item ref="arrivalDay" prop="arrivalDay">
                              <span>到货后 </span>
                              <a-input-number
                                :min="0"
                                :max="180"
                                :disabled="isEdit"
                                :precision="0"
                                placeholder="填入数字"
                                v-model="form.arrivalDay"
                                :allowClear="true"
                                @blur="
                                  () => {
                                    $refs.arrivalDay.onFieldBlur()
                                  }
                                "
                                style="width: 200px"
                              />
                              <span> 天</span></a-form-model-item
                            >
                          </a-col>
                        </a-row>
                      </a-col>
                      <!-- 质保金 -->
                      <a-col :span="20">
                        <a-row type="flex" justify="space-around" align="middle">
                          <a-col :span="4" :offset="1">
                            <a-form-model-item>
                              <a-checkbox-group v-model="c4">
                                <a-checkbox :disabled="isEdit" :value="4" name="type" @change="checkboxChange">
                                  验收款
                                </a-checkbox>
                              </a-checkbox-group>
                            </a-form-model-item>
                          </a-col>
                          <a-col :span="8">
                            <a-form-model-item ref="warrantyProportion" prop="warrantyProportion">
                              <a-input-number
                                :min="0"
                                :disabled="isEdit"
                                :max="100"
                                :precision="0"
                                placeholder="填入数字"
                                v-model="form.warrantyProportion"
                                :allowClear="true"
                                @blur="
                                  () => {
                                    $refs.warrantyProportion.onFieldBlur()
                                  }
                                "
                                style="width: 200px"
                              />
                              <span> %</span></a-form-model-item
                            >
                          </a-col>
                          <a-col :span="9"></a-col>
                        </a-row>
                      </a-col>
                      <!-- 验收款 END-->
                    </a-row>
                  </a-col>
                </a-row>
              </div>
              <div v-else>
                <a-row class="wdf-row" style="margin-top: 30px">
                  <a-col :span="20">
                    <a-row type="flex" justify="space-around" align="middle">
                      <a-col :span="9">
                        <a-form-model-item prop="paymentCycleId">
                          <span>票到付款周期 </span>
                          <a-select
                            :disabled="isEdit"
                            placeholder="选择天数"
                            v-model="form.paymentCycleId"
                            :allowClear="true"
                            style="width: 200px"
                          >
                            <a-select-option v-for="item in Payment" :key="item.id" :value="item.id">{{
                              item.text
                            }}</a-select-option>
                          </a-select>
                          <span> 天</span></a-form-model-item
                        >
                      </a-col>
                    </a-row>
                  </a-col>
                </a-row>
              </div>
            </div>
          </div>
          <div class="card-item">
            <div class="__hd">付款资料</div>
            <div class="__bd">
              <a-row :gutter="[16, 24]">
                <a-col :span="12">
                  <a-form-model-item ref="cfullName" label="公司全称" prop="cfullName">
                    <a-input
                      placeholder="请输入公司全称"
                      v-model="form.cfullName"
                      :disabled="isEdit"
                      :allowClear="true"
                      @blur="
                        () => {
                          $refs.cfullName.onFieldBlur()
                        }
                      "
                      style="width: 380px"
                  /></a-form-model-item>
                </a-col>
                <a-col :span="12">
                  <a-form-model-item ref="taxpayerNumber" label="纳税人识别号" prop="taxpayerNumber">
                    <a-input
                      placeholder="请输入纳税人识别号"
                      v-model="form.taxpayerNumber"
                      :disabled="isEdit"
                      :allowClear="true"
                      @blur="
                        () => {
                          $refs.taxpayerNumber.onFieldBlur()
                        }
                      "
                      style="width: 250px"
                  /></a-form-model-item>
                </a-col>
              </a-row>
              <a-row :gutter="[16, 24]">
                <a-col :span="12">
                  <a-form-model-item ref="bankName" label="开户行+卡号" prop="bankName">
                    <a-input
                      placeholder="请输入开户行"
                      v-model="form.bankName"
                      :disabled="isEdit"
                      :allowClear="true"
                      @blur="
                        () => {
                          $refs.bankName.onFieldBlur()
                        }
                      "
                      style="width: 170px"
                  /></a-form-model-item>
                  <a-form-model-item ref="cardNumber" prop="cardNumber">
                    <a-input
                      placeholder="请输入银行卡号"
                      v-model="form.cardNumber"
                      :disabled="isEdit"
                      :allowClear="true"
                      @blur="
                        () => {
                          $refs.cardNumber.onFieldBlur()
                        }
                      "
                      style="width: 170px"
                  /></a-form-model-item>
                </a-col>
                <a-col :span="12">
                  <a-form-model-item ref="fcontactMode" label="财务联系方式" prop="fcontactMode">
                    <a-input-number
                      placeholder="请输入财务主管的手机号"
                      v-model="form.fcontactMode"
                      :disabled="isEdit"
                      :allowClear="true"
                      @blur="
                        () => {
                          $refs.fcontactMode.onFieldBlur()
                        }
                      "
                      style="width: 250px"
                  /></a-form-model-item>
                </a-col>
              </a-row>
            </div>
          </div>
          <div class="card-item">
            <div class="__hd">合作协议</div>
            <div class="__bd">
              <table>
                <tr>
                  <td>合作协议（非必填）</td>
                  <td v-if="!isEdit">
                    <UploadFile ref="uploadFile" @change="(fileList) => fileChange(fileList, '合作协议')" />
                  </td>
                  <td v-if="form.cooperationAgreement">
                    <a @click="delSee(form.cooperationAgreement)">查看</a>
                    <a-divider type="vertical" />
                    <a target="_blank" v-download="form.cooperationAgreement">下载</a>
                  </td>
                </tr>
                <tr>
                  <td>保密协议</td>
                  <td v-if="!isEdit">
                    <UploadFile ref="uploadFile" @change="(fileList) => fileChange(fileList, '保密协议')" />
                  </td>
                  <td v-if="form.secrecyAgreement">
                    <a @click="delSee(form.secrecyAgreement)">查看</a>
                    <a-divider type="vertical" />
                    <a target="_blank" v-download="form.secrecyAgreement">下载</a>
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </div>
        <div v-else>
          <div class="card-item">
            <div class="__hd">供应商公司信息</div>
            <div class="__bd">
              <a-row :gutter="[16, 24]">
                <a-col :span="12">
                  <a-form-model-item ref="scompanyName" label="供应商公司名称" prop="scompanyName">
                    <a-input
                      placeholder="请输入供应商公司名称"
                      v-model="form.scompanyName"
                      :disabled="isEdit"
                      :allowClear="true"
                      @blur="
                        () => {
                          $refs.scompanyName.onFieldBlur()
                        }
                      "
                      style="width: 250px"
                  /></a-form-model-item>
                </a-col>
                <a-col :span="12">
                  <a-form-model-item ref="pshopName" label="平台店铺名称" prop="pshopName">
                    <a-input
                      placeholder="请输入店铺名称"
                      v-model="form.pshopName"
                      :disabled="isEdit"
                      :allowClear="true"
                      @blur="
                        () => {
                          $refs.pshopName.onFieldBlur()
                        }
                      "
                      style="width: 250px"
                  /></a-form-model-item>
                </a-col>
              </a-row>
              <a-row :gutter="[16, 24]">
                <a-col :span="12">
                  <a-form-model-item ref="lpersonName" label="公司法人姓名" prop="lpersonName">
                    <a-input
                      placeholder="请输入公司法人名称"
                      v-model="form.lpersonName"
                      :disabled="isEdit"
                      :allowClear="true"
                      @blur="
                        () => {
                          $refs.lpersonName.onFieldBlur()
                        }
                      "
                      style="width: 260px"
                  /></a-form-model-item>
                </a-col>
                <a-col :span="12"> </a-col>
              </a-row>
              <a-row :gutter="[16, 24]">
                <a-col :span="24">
                  <div class="__hd">营业执照</div>
                  <div class="__bd">
                    <UploadF
                      ref="UploadF"
                      :disabled="isEdit"
                      :config="uploadConfig3"
                      @change="(files) => uploadChange(2, files)"
                    />
                  </div>
                </a-col>
              </a-row>
            </div>
          </div>
          <div class="card-item">
            <div class="__hd">业务员信息</div>
            <div class="__bd">
              <a-row :gutter="[16, 24]">
                <a-col :span="12">
                  <a-form-model-item ref="salesmanName" label="业务员姓名" prop="salesmanName">
                    <a-input
                      placeholder="请输入业务员姓名"
                      v-model="form.salesmanName"
                      :disabled="isEdit"
                      :allowClear="true"
                      @blur="
                        () => {
                          $refs.salesmanName.onFieldBlur()
                        }
                      "
                      style="width: 290px"
                  /></a-form-model-item>
                </a-col>
                <a-col :span="12">
                  <a-form-model-item ref="salesmanJob" label="业务员职务" prop="salesmanJob">
                    <a-input
                      placeholder="请输入业务员职务"
                      v-model="form.salesmanJob"
                      :disabled="isEdit"
                      :allowClear="true"
                      @blur="
                        () => {
                          $refs.salesmanJob.onFieldBlur()
                        }
                      "
                      style="width: 290px"
                  /></a-form-model-item>
                </a-col>
              </a-row>
              <a-row :gutter="[16, 24]">
                <a-col :span="12">
                  <a-form-model-item ref="salesmanPhone" label="业务员手机号" prop="salesmanPhone">
                    <a-input-number
                      placeholder="请输入业务员手机号"
                      v-model="form.salesmanPhone"
                      :disabled="isEdit"
                      :allowClear="true"
                      @blur="
                        () => {
                          $refs.salesmanPhone.onFieldBlur()
                        }
                      "
                      style="width: 280px"
                  /></a-form-model-item>
                </a-col>
                <a-col :span="12">
                  <a-form-model-item ref="salesmanWeChat" label="业务员微信号" prop="salesmanWeChat">
                    <a-input
                      placeholder="请输入业务员微信号"
                      v-model="form.salesmanWeChat"
                      :disabled="isEdit"
                      :allowClear="true"
                      @blur="
                        () => {
                          $refs.salesmanWeChat.onFieldBlur()
                        }
                      "
                      style="width: 280px"
                  /></a-form-model-item>
                </a-col>
              </a-row>
              <a-row :gutter="[16, 24]">
                <a-col :span="12">
                  <a-form-model-item ref="salesmanIdentity" label="业务员身份证信息" prop="salesmanIdentity">
                    <a-input
                      placeholder="请输入业务员身份证信息"
                      v-model="form.salesmanIdentity"
                      :disabled="isEdit"
                      :allowClear="true"
                      @blur="
                        () => {
                          $refs.salesmanIdentity.onFieldBlur()
                        }
                      "
                      style="width: 250px"
                  /></a-form-model-item>
                </a-col>
                <a-col :span="12"> </a-col>
              </a-row>
            </div>
          </div>
          <div class="card-item">
            <div class="__hd">售后信息</div>
            <div class="__bd">
              <a-row :gutter="[16, 24]">
                <a-col :span="12">
                  <a-form-model-item ref="asaleName" label="售后姓名" prop="asaleName">
                    <a-input
                      placeholder="请输入售后姓名"
                      v-model="form.asaleName"
                      :disabled="isEdit"
                      :allowClear="true"
                      @blur="
                        () => {
                          $refs.asaleName.onFieldBlur()
                        }
                      "
                      style="width: 280px"
                  /></a-form-model-item>
                </a-col>
                <a-col :span="12">
                  <a-form-model-item ref="asalePhone" label="售后手机号" prop="asalePhone">
                    <a-input-number
                      placeholder="请输入售后手机号"
                      v-model="form.asalePhone"
                      :disabled="isEdit"
                      :allowClear="true"
                      @blur="
                        () => {
                          $refs.asalePhone.onFieldBlur()
                        }
                      "
                      style="width: 280px"
                  /></a-form-model-item>
                </a-col>
              </a-row>
              <a-row :gutter="[16, 24]">
                <a-col :span="12">
                  <a-form-model-item ref="asaleJob" label="售后职务" prop="asaleJob">
                    <a-input
                      placeholder="请输入售后职务"
                      v-model="form.asaleJob"
                      :disabled="isEdit"
                      :allowClear="true"
                      @blur="
                        () => {
                          $refs.asaleJob.onFieldBlur()
                        }
                      "
                      style="width: 280px"
                  /></a-form-model-item>
                </a-col>
                <a-col :span="12">
                  <a-form-model-item ref="asaleWeChat" label="售后微信号" prop="asaleWeChat">
                    <a-input
                      placeholder="请输入售后微信号"
                      v-model="form.asaleWeChat"
                      :disabled="isEdit"
                      :allowClear="true"
                      @blur="
                        () => {
                          $refs.asaleWeChat.onFieldBlur()
                        }
                      "
                      style="width: 280px"
                  /></a-form-model-item>
                </a-col>
              </a-row>
            </div>
          </div>
          <div class="card-item">
            <div class="__hd">联系他们</div>
            <div class="__bd">
              <a-row :gutter="[16, 24]">
                <a-col :span="12">
                  <a-form-model-item ref="belongPlatformName" label="所在平台名称" prop="belongPlatformName">
                    <a-input
                      placeholder="请输入企业所在平台名称，如淘宝、京东"
                      v-model="form.belongPlatformName"
                      :disabled="isEdit"
                      :allowClear="true"
                      @blur="
                        () => {
                          $refs.belongPlatformName.onFieldBlur()
                        }
                      "
                      style="width: 280px"
                  /></a-form-model-item>
                </a-col>
                <a-col :span="12">
                  <a-form-model-item ref="officialPhone" label="官方电话" prop="officialPhone">
                    <a-input
                      placeholder="请输入企业电话"
                      v-model="form.officialPhone"
                      :disabled="isEdit"
                      :allowClear="true"
                      @blur="
                        () => {
                          $refs.officialPhone.onFieldBlur()
                        }
                      "
                      style="width: 280px"
                  /></a-form-model-item>
                </a-col>
              </a-row>
              <a-row :gutter="[16, 24]">
                <a-col :span="12">
                  <a-form-model-item ref="pcontactMode" label="平台联系方式" prop="pcontactMode">
                    <a-input
                      placeholder="请输入平台联系方式，如旺旺号"
                      v-model="form.pcontactMode"
                      :disabled="isEdit"
                      :allowClear="true"
                      @blur="
                        () => {
                          $refs.pcontactMode.onFieldBlur()
                        }
                      "
                      style="width: 280px"
                  /></a-form-model-item>
                </a-col>
                <a-col :span="12">
                  <a-form-model-item ref="supplierEmail" label="官方邮箱" prop="supplierEmail">
                    <a-input
                      placeholder="请输入售后微信号"
                      v-model="form.supplierEmail"
                      :disabled="isEdit"
                      :allowClear="true"
                      @blur="
                        () => {
                          $refs.supplierEmail.onFieldBlur()
                        }
                      "
                      style="width: 280px"
                  /></a-form-model-item>
                </a-col>
              </a-row>
            </div>
          </div>
          <div class="card-item">
            <div class="__hd">付款资料</div>
            <div class="__bd">
              <a-row :gutter="[16, 24]">
                <a-col :span="12">
                  <a-form-model-item ref="cfullName" label="公司全称" prop="cfullName">
                    <a-input
                      placeholder="请输入公司全称"
                      v-model="form.cfullName"
                      :disabled="isEdit"
                      :allowClear="true"
                      @blur="
                        () => {
                          $refs.cfullName.onFieldBlur()
                        }
                      "
                      style="width: 380px"
                  /></a-form-model-item>
                </a-col>
                <a-col :span="12">
                  <a-form-model-item ref="taxpayerNumber" label="纳税人识别号" prop="taxpayerNumber">
                    <a-input
                      placeholder="请输入纳税人识别号"
                      v-model="form.taxpayerNumber"
                      :disabled="isEdit"
                      :allowClear="true"
                      @blur="
                        () => {
                          $refs.taxpayerNumber.onFieldBlur()
                        }
                      "
                      style="width: 250px"
                  /></a-form-model-item>
                </a-col>
              </a-row>
              <a-row :gutter="[16, 24]">
                <a-col :span="12">
                  <a-form-model-item ref="bankName" label="开户行+卡号" prop="bankName">
                    <a-input
                      placeholder="请输入开户行"
                      v-model="form.bankName"
                      :disabled="isEdit"
                      :allowClear="true"
                      @blur="
                        () => {
                          $refs.bankName.onFieldBlur()
                        }
                      "
                      style="width: 170px"
                  /></a-form-model-item>
                  <a-form-model-item ref="cardNumber" prop="cardNumber">
                    <a-input
                      placeholder="请输入银行卡号"
                      v-model="form.cardNumber"
                      :disabled="isEdit"
                      :allowClear="true"
                      @blur="
                        () => {
                          $refs.cardNumber.onFieldBlur()
                        }
                      "
                      style="width: 170px"
                  /></a-form-model-item>
                </a-col>
                <a-col :span="12">
                  <a-form-model-item ref="fcontactMode" label="财务联系方式" prop="fcontactMode">
                    <a-input-number
                      placeholder="请输入财务主管的手机号"
                      v-model="form.fcontactMode"
                      :disabled="isEdit"
                      :allowClear="true"
                      @blur="
                        () => {
                          $refs.fcontactMode.onFieldBlur()
                        }
                      "
                      style="width: 250px"
                  /></a-form-model-item>
                </a-col>
              </a-row>
              <a-row :gutter="[16, 24]">
                <a-col :span="12">
                  <a-form-model-item label="成立年限" prop="establishYearId">
                    <a-select
                      placeholder="选择成立年限"
                      v-model="form.establishYearId"
                      :disabled="isEdit"
                      :allowClear="true"
                      style="width: 290px"
                    >
                      <a-select-option v-for="item in Position" :key="item.id" :value="item.id">{{
                        item.text
                      }}</a-select-option>
                    </a-select></a-form-model-item
                  >
                </a-col>
                <a-col :span="12">
                  <a-form-model-item label="诚信级别" prop="sincerityLevelId">
                    <a-select
                      placeholder="选择诚信级别"
                      v-model="form.sincerityLevelId"
                      :disabled="isEdit"
                      :allowClear="true"
                      style="width: 280px"
                    >
                      <a-select-option v-for="item in Warehouse" :key="item.id" :value="item.id">{{
                        item.text
                      }}</a-select-option>
                    </a-select></a-form-model-item
                  >
                </a-col>
              </a-row>
              <a-row :gutter="[16, 24]">
                <a-col :span="12">
                  <a-form-model-item label="结算方式" prop="settlementMode">
                    <a-select
                      placeholder="选择结算方式"
                      v-model="form.settlementMode"
                      :disabled="isEdit"
                      :allowClear="true"
                      style="width: 290px"
                    >
                      <a-select-option :value="0">现款现货</a-select-option>
                      <a-select-option :value="1">帐期结算</a-select-option>
                    </a-select></a-form-model-item
                  >
                </a-col>
                <a-col :span="12">
                  <a-form-model-item label="最后交易时间" prop="endTime">
                    <a-date-picker
                      v-model="form.endTime"
                      show-time
                      :disabled="form.endTime !== undefined && !isAdd ? true : false"
                      type="date"
                      placeholder="请选择最后交易时间"
                      style="width: 255px"
                    />
                  </a-form-model-item>
                </a-col>
              </a-row>
              <div v-if="form.settlementMode === 0" class="form wdf-form">
                <a-row class="wdf-row">
                  <a-col class :span="20">
                    <a-row type="flex" align="middle">
                      <!-- 预付款 -->
                      <a-col :span="20">
                        <a-row type="flex" justify="space-around" align="middle">
                          <a-col :span="4" :offset="1">
                            <a-form-model-item>
                              <a-checkbox-group v-model="c1">
                                <a-checkbox :value="1" :disabled="isEdit" name="type" @change="checkboxChange">
                                  预付款
                                </a-checkbox>
                              </a-checkbox-group>
                            </a-form-model-item>
                          </a-col>
                          <a-col :span="8">
                            <a-form-model-item ref="padvanceProportion" prop="padvanceProportion">
                              <a-input-number
                                :min="0"
                                :max="100"
                                :disabled="isEdit"
                                :precision="0"
                                placeholder="填入数字"
                                v-model="form.padvanceProportion"
                                :allowClear="true"
                                @blur="
                                  () => {
                                    $refs.padvanceProportion.onFieldBlur()
                                  }
                                "
                                style="width: 200px"
                              />
                              <span> %</span></a-form-model-item
                            >
                          </a-col>
                          <a-col :span="9"></a-col>
                        </a-row>
                      </a-col>
                      <!-- 预付款 END-->
                      <!-- 提货款 -->
                      <a-col :span="20">
                        <a-row type="flex" justify="space-around" align="middle">
                          <a-col :span="4" :offset="1">
                            <a-form-model-item>
                              <a-checkbox-group v-model="c2">
                                <a-checkbox :value="2" :disabled="isEdit" name="type" @change="checkboxChange">
                                  提货款
                                </a-checkbox>
                              </a-checkbox-group>
                            </a-form-model-item>
                          </a-col>
                          <a-col :span="8">
                            <a-form-model-item ref="ccommodityProportion" prop="ccommodityProportion">
                              <a-input-number
                                :min="0"
                                :max="100"
                                :disabled="isEdit"
                                :precision="0"
                                placeholder="填入数字"
                                v-model="form.ccommodityProportion"
                                :allowClear="true"
                                @blur="
                                  () => {
                                    $refs.ccommodityProportion.onFieldBlur()
                                  }
                                "
                                style="width: 200px"
                              />
                              <span> %</span></a-form-model-item
                            >
                          </a-col>
                          <a-col :span="9"></a-col>
                        </a-row>
                      </a-col>
                      <!-- 提货款 END-->
                    </a-row>
                    <a-row class="row-in-col" type="flex" align="middle">
                      <!-- 验收款 -->
                      <a-col :span="20">
                        <a-row type="flex" justify="space-around" align="middle">
                          <a-col :span="4" :offset="1">
                            <a-form-model-item>
                              <a-checkbox-group v-model="c3">
                                <a-checkbox :value="3" :disabled="isEdit" name="type" @change="checkboxChange">
                                  验收款
                                </a-checkbox>
                              </a-checkbox-group>
                            </a-form-model-item>
                          </a-col>
                          <a-col :span="8">
                            <a-form-model-item ref="ccollectProportion" prop="ccollectProportion">
                              <a-input-number
                                :min="0"
                                :max="100"
                                :disabled="isEdit"
                                :precision="0"
                                placeholder="填入数字"
                                v-model="form.ccollectProportion"
                                :allowClear="true"
                                @blur="
                                  () => {
                                    $refs.ccollectProportion.onFieldBlur()
                                  }
                                "
                                style="width: 200px"
                              />
                              <span> %</span></a-form-model-item
                            >
                          </a-col>
                          <a-col :span="9">
                            <a-form-model-item ref="arrivalDay" prop="arrivalDay">
                              <span>到货后 </span>
                              <a-input-number
                                :min="0"
                                :max="180"
                                :disabled="isEdit"
                                :precision="0"
                                placeholder="填入数字"
                                v-model="form.arrivalDay"
                                :allowClear="true"
                                @blur="
                                  () => {
                                    $refs.arrivalDay.onFieldBlur()
                                  }
                                "
                                style="width: 200px"
                              />
                              <span> 天</span></a-form-model-item
                            >
                          </a-col>
                        </a-row>
                      </a-col>
                      <!-- 质保金 -->
                      <a-col :span="20">
                        <a-row type="flex" justify="space-around" align="middle">
                          <a-col :span="4" :offset="1">
                            <a-form-model-item>
                              <a-checkbox-group v-model="c4">
                                <a-checkbox :value="4" :disabled="isEdit" name="type" @change="checkboxChange">
                                  质保金
                                </a-checkbox>
                              </a-checkbox-group>
                            </a-form-model-item>
                          </a-col>
                          <a-col :span="8">
                            <a-form-model-item ref="warrantyProportion" prop="warrantyProportion">
                              <a-input-number
                                :min="0"
                                :max="100"
                                :disabled="isEdit"
                                :precision="0"
                                placeholder="填入数字"
                                v-model="form.warrantyProportion"
                                :allowClear="true"
                                @blur="
                                  () => {
                                    $refs.warrantyProportion.onFieldBlur()
                                  }
                                "
                                style="width: 200px"
                              />
                              <span> %</span></a-form-model-item
                            >
                          </a-col>
                          <a-col :span="9"></a-col>
                        </a-row>
                      </a-col>
                      <!-- 验收款 END-->
                    </a-row>
                  </a-col>
                </a-row>
              </div>
              <div v-else>
                <a-row class="wdf-row" style="margin-top: 30px">
                  <a-col :span="20">
                    <a-row type="flex" justify="space-around" align="middle">
                      <a-col :span="9">
                        <a-form-model-item prop="paymentCycleId">
                          <span>票到付款周期 </span>
                          <a-select
                            placeholder="选择天数"
                            v-model="form.paymentCycleId"
                            :disabled="isEdit"
                            :allowClear="true"
                            style="width: 200px"
                          >
                            <a-select-option v-for="item in Payment" :key="item.id" :value="item.id">{{
                              item.text
                            }}</a-select-option>
                          </a-select>
                          <span> 天</span></a-form-model-item
                        >
                      </a-col>
                    </a-row>
                  </a-col>
                </a-row>
              </div>
            </div>
          </div>
          <div class="card-item">
            <div class="__hd">合作协议</div>
            <div class="__bd">
              <table>
                <tr>
                  <td>物流协议（非必签）</td>
                  <td v-if="!isEdit">
                    <UploadFile ref="uploadFile" @change="(fileList) => fileChange(fileList, '物流协议')" />
                  </td>
                  <td v-if="form.logisticsAgreement">
                    <a @click="delSee(form.logisticsAgreement)">查看</a>
                    <a-divider type="vertical" />
                    <a target="_blank" v-download="form.logisticsAgreement">下载</a>
                  </td>
                </tr>
                <tr>
                  <td>技术协议（非必签）</td>
                  <td v-if="!isEdit">
                    <UploadFile ref="uploadFile" @change="(fileList) => fileChange(fileList, '技术协议')" />
                  </td>
                  <td v-if="form.technologyAgreement">
                    <a @click="delSee(form.technologyAgreement)">查看</a>
                    <a-divider type="vertical" />
                    <a target="_blank" v-download="form.technologyAgreement">下载</a>
                  </td>
                </tr>
                <tr>
                  <td>质量保证协议（非必签）</td>
                  <td v-if="!isEdit">
                    <UploadFile ref="uploadFile" @change="(fileList) => fileChange(fileList, '质量保证协议')" />
                  </td>
                  <td v-if="form.qensureAgreement">
                    <a @click="delSee(form.qensureAgreement)">查看</a>
                    <a-divider type="vertical" />
                    <a target="_blank" v-download="form.qensureAgreement">下载</a>
                  </td>
                </tr>
                <tr>
                  <td>战略合作协议（非必签）</td>
                  <td v-if="!isEdit">
                    <UploadFile ref="uploadFile" @change="(fileList) => fileChange(fileList, '战略合作协议')" />
                  </td>
                  <td v-if="form.scooperationAgreement">
                    <a @click="delSee(form.scooperationAgreement)">查看</a>
                    <a-divider type="vertical" />
                    <a target="_blank" v-download="form.scooperationAgreement">下载</a>
                  </td>
                </tr>
                <tr>
                  <td>价格协议（非必签）</td>
                  <td v-if="!isEdit">
                    <UploadFile ref="uploadFile" @change="(fileList) => fileChange(fileList, '价格协议')" />
                  </td>
                  <td v-if="form.priceAgreement">
                    <a @click="delSee(form.priceAgreement)">查看</a>
                    <a-divider type="vertical" />
                    <a target="_blank" v-download="form.priceAgreement">下载</a>
                  </td>
                </tr>
                <tr>
                  <td>保密协议</td>
                  <td v-if="!isEdit">
                    <UploadFile ref="uploadFile" @change="(fileList) => fileChange(fileList, '保密协议')" />
                  </td>
                  <td v-if="form.secrecyAgreement">
                    <a @click="delSee(form.secrecyAgreement)">查看</a>
                    <a-divider type="vertical" />
                    <a target="_blank" v-download="form.secrecyAgreement">下载</a>
                  </td>
                </tr>
                <tr>
                  <td>反贿赂协议</td>
                  <td v-if="!isEdit">
                    <UploadFile ref="uploadFile" @change="(fileList) => fileChange(fileList, '反贿赂协议')" />
                  </td>
                  <td v-if="form.abriberyAgreement">
                    <a @click="delSee(form.abriberyAgreement)">查看</a>
                    <a-divider type="vertical" />
                    <a target="_blank" v-download="form.abriberyAgreement">下载</a>
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </div>

        <div class="card-item">
          <div class="__hd">质检报告</div>
          <div class="__bd">
            <table class="custom-table custom-table-border">
              <tr v-for="(item, index) in brandList" :key="index">
                <td v-if="item.needCheck === '1'">{{ item.materialName }}{{ item.materialCode }}</td>
                <td v-if="item.needCheck === '1'">
                  <UploadFile ref="uploadFile" @change="(fileList) => quality(fileList, item)" />
                </td>
                <td v-if="item.qualityReportUrl">
                  <a @click="delSee(item.qualityReportUrl)">查看</a>
                  <a-divider type="vertical" />
                  <a href="javascript:void(0);" v-download="item.qualityReportUrl">下载</a>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </a-form-model>

      <Approval ref="approval" @opinionChange="opinionChange" />
      <BrandFrom ref="brandFrom" @brandChange="brandChange" />
      <MaterialAdd ref="materialAdd" @filet="materialChange" />
      <XdocView ref="xdocView" />
    </a-spin>
  </a-modal>
</template>
<script>
//物料代码模糊搜索
import { routineMaterialInfoPageList } from '@/api/routineMaterial'
import { saveAndUpdate, getDetail, listManageapproval } from '@/api/supplier'
import Approval from './Approval'
import BrandFrom from './BrandFrom'
import MaterialAdd from './materialAdd'
import XdocView from './XdocView'
import UploadFile from './UploadFile'
import UploadF from './UploadF'
import moment from 'moment'
import { queryCode } from '@/api/workBox'

let uuid = () => Math.random().toString(32).slice(-10)

export default {
  name: 'BecomingForm',
  components: {
    Approval,
    XdocView,
    BrandFrom,
    UploadFile,
    UploadF,
    MaterialAdd,
  },
  data() {
    this.allMaterialFuzzySearchAction = this.$_.debounce(this.allMaterialFuzzySearchAction, 800)
    return {
      uploadConfig3: {
        maxFileCount: 3,
        fileType: 'img',
        enablePreview: true,
      },
      remark: '',
      visible: false,
      spinning: false,
      fileAddBoList: [],
      Warehouse: [], //诚信级别
      Position: [], //成立年限
      Payment: [], //付款周期
      brandList: [],
      c1: [], //预付款
      c2: [], //提货款
      c3: [], // 验收款
      c4: [], //质保金
      Brandform: {
        replaceMaterialItem: '', // 替换物料
        materialItem: {},
      },
      form: {
        padvanceProportion: undefined, // 预付款
        ccommodityProportion: undefined, //提货款
        ccollectProportion: undefined,
        warrantyProportion: undefined, //质量保证金
        supplierType: undefined,
        platformType: undefined,
        platformName: undefined,
        supplierScale: 0,
        scompanyName: undefined,
        pshopName: undefined,
        pcontactMode: undefined,
        salesmanName: undefined,
        salesmanPhone: undefined,
        salesmanWeChat: undefined,
        settlementMode: 0,
        sincerityLevelId: undefined,
        establishYearId: undefined,
        paymentCycleId: undefined,
        cfullName: undefined,
        taxpayerNumber: undefined,
        bankName: undefined,
        cardNumber: undefined,
        fcontactMode: undefined,
        cooperationAgreement: undefined,
        logisticsAgreement: undefined,
        technologyAgreement: undefined,
        qensureAgreement: undefined,
        scooperationAgreement: undefined,
        abriberyAgreement: undefined,
        priceAgreement: undefined,
        salesmanJob: undefined,
        salesmanIdentity: undefined,
        asaleName: undefined,
        asalePhone: undefined,
        asaleJob: undefined,
        asaleWeChat: undefined,
        belongPlatformName: undefined,
        officialPhone: undefined,
        supplierEmail: undefined,
        arrivalDay: undefined,
        lpersonName: undefined,
        endTime: undefined,
      },
      type: 'view',
      record: {},
      rules: {
        arrivalDay: [{ required: true, message: '请输入到货后多少天', trigger: 'blur' }],
        endTime: [{ required: true, message: '请选择最后交易时间', trigger: 'change' }],
        lpersonName: [{ required: true, message: '请输入公司法人', trigger: 'blur' }],
        supplierEmail: [{ required: true, message: '请输入企业邮箱', trigger: 'blur' }],
        officialPhone: [{ required: true, message: '请输入企业电话', trigger: 'blur' }],
        belongPlatformName: [{ required: true, message: '请输入所在平台名称', trigger: 'blur' }],
        asaleWeChat: [{ required: true, message: '请输入售后微信号', trigger: 'blur' }],
        asaleJob: [{ required: true, message: '请输入售后职务', trigger: 'blur' }],
        asalePhone: [
          { required: true, message: '请输入售后手机号', trigger: 'blur' },
          { pattern: /^1\d{10}$/, message: '请输入正确的手机号码' },
        ],
        asaleName: [{ required: true, message: '请输入售后姓名', trigger: 'blur' }],
        salesmanIdentity: [{ required: true, message: '请输入业务员身份证信息', trigger: 'blur' }],
        salesmanJob: [{ required: true, message: '请输入业务员职务', trigger: 'blur' }],
        fcontactMode: [
          { required: true, message: '请输入财务主管手机号', trigger: 'blur' },
          { pattern: /^1\d{10}$/, message: '请输入正确的手机号码' },
        ],
        cardNumber: [{ required: true, message: '请输入银行卡号', trigger: 'blur' }],
        bankName: [{ required: true, message: '请输入开户行', trigger: 'blur' }],
        taxpayerNumber: [{ required: true, message: '请输入纳税人识别号', trigger: 'blur' }],
        cfullName: [{ required: true, message: '请输入公司全称', trigger: 'blur' }],
        paymentCycleId: [{ required: true, message: '请选择付款周期', trigger: 'change' }],
        salesmanWeChat: [{ required: true, message: '请输入业务员微信号', trigger: 'blur' }],
        salesmanPhone: [
          { required: true, message: '请输入业务员手机号', trigger: 'blur' },
          { pattern: /^1\d{10}$/, message: '请输入正确的手机号码' },
        ],
        salesmanName: [{ required: true, message: '请输入业务员名称', trigger: 'blur' }],
        pcontactMode: [{ required: true, message: '请输入平台联系方式', trigger: 'blur' }],
        pshopName: [{ required: true, message: '请输入平台店铺名称', trigger: 'blur' }],
        scompanyName: [{ required: true, message: '请输入公司名称', trigger: 'blur' }],
        platformName: [{ required: true, message: '请输入交易平台名称', trigger: 'blur' }],
        platformType: [{ required: true, message: '请选择是否为平台', trigger: 'change' }],
        supplierScale: [{ required: true, message: '选择供应商规模', trigger: 'change' }],
        settlementMode: [{ required: true, message: '选择结算方式', trigger: 'change' }],
        sincerityLevelId: [{ required: true, message: '选择诚信级别', trigger: 'change' }],
        establishYearId: [{ required: true, message: '选择成立年限', trigger: 'change' }],
      },
      records: {},
      allMaterialFuzzySearch: {
        //全部物料搜索
        list: [],
        item: {},
        fetching: false,
      },
    }
  },

  computed: {
    modalTitle() {
      if (this.isEditSalary) {
        return '修改供应商'
      }
      let txt = this.isView ? '查看' : this.isEdit ? '审核' : this.isView5 ? '查看' : '新增'
      return `${txt}供应商`
    },
    isView() {
      //查看
      return this.type === 'view'
    },
    isEdit() {
      //审核
      return this.type === 'edit'
    },
    isAdd() {
      //新增
      return this.type === 'add'
    },
    isEditSalary() {
      //修改
      return this.type === 'edit-salary'
    },
    isDisabled() {
      return this.isView || this.isEdit || this.isView5
    },
  },
  created() {},
  methods: {
    moment,
    delSee(idurl) {
      this.$refs.xdocView.query(idurl)
    },
    uploadChange(fileType, fileList) {
      let fileAddBoList = [...(this.fileAddBoList || [])]
      let files = fileAddBoList.filter((f) => f.fileType !== fileType)
      fileAddBoList = [
        ...fileList.map((f) => {
          return { name: f.name, url: f.url }
        }),
        ...files,
      ]
      this.fileAddBoList = fileAddBoList
    },
    fileChange(fileList, type) {
      const that = this
      if (type === '合作协议') {
        that.form.cooperationAgreement = fileList
        return
      }
      if (type === '保密协议') {
        that.form.secrecyAgreement = fileList
        return
      }
      if (type === '物流协议') {
        that.form.logisticsAgreement = fileList
        return
      }
      if (type === '技术协议') {
        that.form.technologyAgreement = fileList
        return
      }
      if (type === '质量保证协议') {
        that.form.qensureAgreement = fileList
        return
      }
      if (type === '战略合作协议') {
        that.form.scooperationAgreement = fileList
        return
      }
      if (type === '价格协议') {
        that.form.priceAgreement = fileList
        return
      }
      if (type === '反贿赂协议') {
        that.form.abriberyAgreement = fileList
        return
      }
    },
    quality(fileList, type) {
      type.qualityReportUrl = fileList
    },
    checkboxChange(event) {},
    brandChange(data) {
      console.log(data)
      let react = this.brandList.find((i) => i.materialId === this.records.materialId)
      react.manageBrands = [...data]
    },
    materialChange(data) {
      let that = this
      that.brandList = [...that.brandList, ...data]
    },
    brandAdd() {
      let that = this
      if (JSON.stringify(that.Brandform.materialItem) !== '{}') {
        that.brandList.push(that.Brandform.materialItem)
      } else {
        that.$message.info('请先选择供应物料')
      }
    },
    //选择物料分类
    materialAdd() {
      this.$refs.materialAdd.init()
    },
    Addmodel(record) {
      //添加品牌型号
      let that = this
      that.records = record
      that.$refs.brandFrom.query(record.manageBrands)
    },
    modelDel(index) {
      //删除品牌型号
      this.brandList.splice(index, 1)
    },
    async allMaterialFuzzySearchAction(wd) {
      const that = this
      const _searchParam = {
        current: 1,
        size: 50,
        materialCodeName: wd,
      }
      that.allMaterialFuzzySearch = { ...that.materialFuzzySearch, fetching: true }
      const res = await Promise.all([
        routineMaterialInfoPageList(_searchParam)
          .then((res) => {
            if (!(res && res.data && res.data.records && Array.isArray(res.data.records))) {
              return []
            }
            return res.data.records
          })
          .catch((err) => []),
      ])
      const result = [...res[0]].map((item, index) => {
        item.__key = uuid()
        item.__label = `${item.materialName}(${item.materialCode})`
        // item.specification
        return item
      })
      that.allMaterialFuzzySearch = { ...that.allMaterialFuzzySearch, fetching: false, list: result }
    },
    allMaterialFuzzySearchActionChange(key) {
      const that = this
      const target = that.allMaterialFuzzySearch.list.find((item) => item.__key === key)
      that.Brandform = {
        ...that.Brandform,
        materialItem: { ...target, ...{ materialId: target.id, manageBrands: [] } },
        replacedMaterialNum: target.materialNum || 0,
      }
      that.allMaterialFuzzySearch = { ...that.allMaterialFuzzySearch, item: { ...target } }
      //form.beReplacedMaterialNum : form.replacedMaterialNum"
      //replacedMaterialNum:target.materialNum || 0
    },
    //接受数据
    async query(type, record) {
      const that = this
      that.allMaterialFuzzySearch = { ...that.allMaterialFuzzySearch, list: [] }
      that.visible = true
      that.type = type
      that.form = {}
      that.brandList = []
      that.c1 = []
      that.c2 = []
      that.c3 = []
      that.c4 = []
      that.record = record
      await queryCode({ code: 'period_0' })
        .then((res) => {
          that.Payment = res.data
        })
        .catch((err) => (that.loading = false))
      await queryCode({ code: 'sincerity_0' })
        .then((res) => {
          that.Warehouse = res.data
        })
        .catch((err) => (that.loading = false))
      await queryCode({ code: 'Years_01' })
        .then((res) => {
          that.Position = res.data
        })
        .catch((err) => (that.loading = false))

      that.$refs.UploadF.empty()
      if (type !== 'add') {
        let detail = await getDetail({ id: record.id }).then((res) => res.data)
        that.$nextTick(() => {
          detail.paymentCycleId = Number(detail.paymentCycleId)
          if (detail.settlementMode === 0) {
            that.c1 = detail.padvanceType === 0 ? [] : [detail.padvanceType]
            that.c2 = detail.ccommodityType === 0 ? [] : [detail.ccommodityType]
            that.c3 = detail.ccollectType === 0 ? [] : [detail.ccollectType]
            that.c4 = detail.warrantyType === 0 ? [] : [detail.warrantyType]
          }
          that.form = { ...that.form, ...detail }
          this.form.endTime = this.form.endTime ? moment(this.form.endTime) : undefined
          that.brandList = detail.manageSupplierMaterials
          if (detail.supplierScale === 1) {
            let _sp = detail.licenseUrl.split(',')
            that.$refs.UploadF.setFiles(
              _sp.map((i, index) => {
                let arr = i.split('/')
                let name = arr[arr.length - 1]
                return {
                  uid: String(index + 1),
                  name: name,
                  status: 'done',
                  url: i,
                }
              })
            )
          }
        })
      }
    },
    //提交
    handleOk(type) {
      let that = this
      if (that.type === 'view') {
        this.visible = false
      } else {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            if (that.form.supplierScale == 1) {
              let react = that.$refs.UploadF.Throw()
              let hasImgs = react.length > 0
              if (!hasImgs) {
                that.$message.error('请上传营业执照')
                return
              } else {
                that.form.licenseUrl = react.map((i) => i.url).toString(',')
              }
            }
            if (that.form.settlementMode == 0) {
              let ishas =
                (Number(that.form.padvanceProportion) || 0) +
                  (Number(that.form.ccollectProportion) || 0) +
                  (Number(that.form.ccommodityProportion) || 0) +
                  (Number(that.form.warrantyProportion) || 0) ===
                100
                  ? true
                  : false

              if (!ishas) {
                that.$message.error('结算方式必须等于100')
                return
              }
            }
            if (that.form.settlementMode === 1) {
              let spt3 = that.Payment.find((i) => +i.id === +that.form.paymentCycleId)
              that.form.paymentCycle = spt3.text
              that.form.padvanceType = 0
              that.form.ccommodityType = 0
              that.form.ccollectType = 0
              that.form.warrantyType = 0
            }

            if (that.form.settlementMode == 0) {
              that.form.padvanceType = that.c1.length === 0 ? 0 : that.c1.join()
              that.form.ccommodityType = that.c2.length === 0 ? 0 : that.c2.join()
              that.form.ccollectType = that.c3.length === 0 ? 0 : that.c3.join()
              that.form.warrantyType = that.c4.length === 0 ? 0 : that.c4.join()
            }

            that.brandList = that.brandList.map((item) => {
              return {
                qualityReportUrl: item.qualityReportUrl,
                materialName: item.materialName,
                materialCode: item.materialCode,
                materialId: item.materialId,
                needCheck: item.needCheck,
                manageBrands:
                  item.manageBrands.map((u) => {
                    return {
                      brandName: u.brandName,
                      manageBrandModels:
                        u.manageBrandModels.map((i) => {
                          return {
                            modelName: i.modelName,
                          }
                        }) || [],
                    }
                  }) || [],
              }
            })
            that.form.status = type
            let spt1 = that.Warehouse.find((i) => i.id === that.form.sincerityLevelId)
            that.form.sincerityLevel = spt1.text

            let spt2 = that.Position.find((i) => i.id === that.form.establishYearId)
            that.form.establishYear = spt2.text

            that.form.manageSupplierMaterials = that.brandList
            that.form.endTime = moment(that.form.endTime).format('YYYY-DD-MM hh:mm:ss')
            if (that.type === 'edit-salary') {
              that.form.id = that.record.id
            }
            if (that.type === 'add' || that.type === 'edit-salary') {
              that.spinning = true
              saveAndUpdate(this.form)
                .then((res) => {
                  if (res.code === 200) {
                    this.visible = false
                    that.spinning = false
                    that.$refs.ruleForm.resetFields()
                    this.form = {}
                    that.$message.info(res.msg)
                    that.$emit('finish')
                  } else {
                    that.$message.error(res.msg)
                    that.spinning = false
                  }
                })
                .catch((err) => (that.spinning = false))
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    },
    handleCancel() {
      this.programme = []
      this.remark = '' // 清空表
      this.visible = false
    },
    // 审批
    submitAction(opt) {
      let that = this
      let values = {
        approveId: this.record.id,
        isAdopt: opt.isAdopt,
        opinion: opt.opinion,
      }
      that.spinning = true
      listManageapproval(values)
        .then((res) => {
          that.spinning = false
          // that.form.resetFields() // 清空表
          that.visible = false
          that.$message.info(res.msg)
          that.$emit('finish')
        })
        .catch((err) => (that.spinning = false))
    },
    passAction() {
      this.submitAction({
        isAdopt: 0,
        // opinion: '通过',
      })
    },
    noPassAction() {
      let that = this
      that.$refs.approval.query()
    },
    opinionChange(opinion) {
      //审批意见
      this.submitAction({
        isAdopt: 1,
        opinion: opinion,
      })
    },
  },
}
</script>
<style scoped>
/*自定义table样式*/
.card-item {
  margin-bottom: 20px;
}
.__hd {
  font-size: 100%;
  line-height: 40px;
  border-bottom: 1px solid #ccc;
  margin-bottom: 10px;
  font-weight: bold;
}
.custom-table {
  margin-bottom: 0;
}
.wdf-row {
  border: 1px solid #ddd;
}
.custom-table-border th,
.custom-table-border td {
  padding: 5px 10px;
  /* border: none; */
}

.custom-table >>> .custom-table {
  position: relative;
  top: 0;
  left: 0;
  width: calc(100% + 2px);
  margin-bottom: -2px;
}
.custom-table >>> .custom-table td {
  text-align: left;
}
.becoming-form-wrapper >>> .ant-form-item {
  margin-bottom: 0;
}

.bank-card-list-wrapper {
  display: flex;
}
.bank-card-list-wrapper >>> .ant-form-item {
  display: flex;
  margin: 0 7px;
}

.col-border {
  padding: 10px 0;
  border-bottom: none;
  min-height: 60px;
  box-sizing: border-box;
}

.col-border ~ .col-border {
  border-left: none;
}

.wdf-form {
  margin-top: 12px;
  padding: 12px;
}

.btns-grop {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 24px;
}

.btns-grop button:not(first-child) {
  margin-left: 12px;
}

.ant-row.ant-form-item {
  margin-bottom: 0;
}

.year-select {
  width: 100px;
  margin: 0 18px 0 8px;
}

.inner-col-div {
  float: left;
  width: 50%;
}

.checkbox-innerspan {
  margin: 0 10px 0 12px;
}

.mar-l0 {
  margin-left: 0;
}
</style>
