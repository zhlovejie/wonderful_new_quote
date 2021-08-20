<template>
  <a-spin :spinning="spinning">
    <a-form-model ref="ruleForm" :model="form" :rules="rules" class="bom-management-wrapper" layout="inline">
      <a-form-model-item label="供应商属性">
        <a-select placeholder="供应商属性" disabled v-model="form.supplierType" :allowClear="true" style="width: 250px">
          <a-select-option :value="0">物料供应商</a-select-option>
          <a-select-option :value="1">委外加工商</a-select-option>
        </a-select></a-form-model-item
      >
      <div class="card-item"></div>
      <a-form-model-item label="已选物料">(品牌及型号非必填) </a-form-model-item>
      <table v-if="brandList.length > 0" class="custom-table custom-table-border">
        <tr>
          <th>已选物料名称及物料代码</th>
          <th>品牌型号</th>
        </tr>
        <tr v-for="(item, index) in brandList" :key="index">
          <td>{{ item.materialName }}({{ item.materialCode }})</td>
          <td>
            {{
              item.manageBrands.map((u) => u.brandName + '/' + u.manageBrandModels.map((i) => i.modelName)).join(',')
            }}
          </td>
          <!-- <td> -->
          <!-- <a-button @click="Addmodel(item)"  style="margin-right: 10px">添加品牌型号</a-button> -->
          <!-- <a-button @click="modelDel(index)">删除</a-button> -->
          <!-- </td> -->
        </tr>
      </table>

      <div class="card-item">
        <div class="__hd">选择供应商属性</div>
        <div class="__bd">
          <a-form-model-item label="是否为平台类" prop="platformType">
            <a-select
              placeholder="请选择是否为平台"
              v-model="form.platformType"
              disabled
              :allowClear="true"
              style="width: 200px"
            >
              <a-select-option :value="0">否</a-select-option>
              <a-select-option :value="1">是</a-select-option>
            </a-select></a-form-model-item
          >
          <a-form-model-item ref="platformName" label="所在平台为" prop="platformName">
            <a-input
              placeholder="请输入交易平台名称"
              v-model="form.platformName"
              :allowClear="true"
              disabled
              @blur="
                () => {
                  $refs.platformName.onFieldBlur()
                }
              "
              style="width: 100%"
          /></a-form-model-item>
          <a-form-model-item label="供应商规模" prop="supplierScale">
            <a-select
              placeholder="选择供应商规模"
              v-model="form.supplierScale"
              disabled
              :allowClear="true"
              style="width: 200px"
            >
              <a-select-option :value="0">小规模</a-select-option>
              <a-select-option :value="1">一般规模</a-select-option>
            </a-select></a-form-model-item
          >
          <a-form-model-item>
            <a-button v-if="form.supplierScale === 0" @click="transformation" type="primary"> 供应商转换 </a-button>
          </a-form-model-item>
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
                    v-model="form.scompanyName"
                    disabled
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
                    placeholder="请输入平台店铺名称"
                    v-model="form.pshopName"
                    disabled
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
                    placeholder="请输入业务员姓名"
                    v-model="form.salesmanName"
                    :allowClear="true"
                    disabled
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
                    placeholder="请输入平台联系方式"
                    v-model="form.pcontactMode"
                    disabled
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
                  <a-input
                    placeholder="请输入业务员手机号"
                    v-model="form.salesmanPhone"
                    disabled
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
                    v-model="form.salesmanWeChat"
                    disabled
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
                    v-model="form.establishYearId"
                    :allowClear="true"
                    disabled
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
                    :allowClear="true"
                    disabled
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
                    :allowClear="true"
                    disabled
                    style="width: 290px"
                  >
                    <a-select-option :value="0">现款现货</a-select-option>
                    <a-select-option :value="1">帐期结算</a-select-option>
                  </a-select></a-form-model-item
                >
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
                              <a-checkbox disabled :value="1" name="type" @change="checkboxChange"> 预付款 </a-checkbox>
                            </a-checkbox-group>
                          </a-form-model-item>
                        </a-col>
                        <a-col :span="8">
                          <a-form-model-item ref="padvanceProportion" prop="padvanceProportion">
                            <a-input-number
                              disabled
                              :min="0"
                              :max="100"
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
                              <a-checkbox :value="2" disabled name="type" @change="checkboxChange"> 提货款 </a-checkbox>
                            </a-checkbox-group>
                          </a-form-model-item>
                        </a-col>
                        <a-col :span="8">
                          <a-form-model-item ref="ccommodityProportion" prop="ccommodityProportion">
                            <a-input-number
                              :min="0"
                              :max="100"
                              disabled
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
                              <a-checkbox :value="3" disabled name="type" @change="checkboxChange"> 验收款 </a-checkbox>
                            </a-checkbox-group>
                          </a-form-model-item>
                        </a-col>
                        <a-col :span="8">
                          <a-form-model-item ref="ccollectProportion" prop="ccollectProportion">
                            <a-input-number
                              :min="0"
                              :max="100"
                              disabled
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
                          <a-form-model-item ref="ccollectProportion" prop="ccollectProportion">
                            <span>到货后 </span>
                            <a-input-number
                              :min="0"
                              :max="100"
                              :precision="0"
                              disabled
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
                              <a-checkbox :value="4" disabled name="type" @change="checkboxChange"> 验收款 </a-checkbox>
                            </a-checkbox-group>
                          </a-form-model-item>
                        </a-col>
                        <a-col :span="8">
                          <a-form-model-item ref="warrantyProportion" prop="warrantyProportion">
                            <a-input-number
                              :min="0"
                              :max="100"
                              disabled
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
                      <a-form-model-item ref="paymentCycleId" prop="paymentCycleId">
                        <span>票到付款周期 </span>
                        <a-select
                          placeholder="选择天数"
                          disabled
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
                    disabled
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
                    disabled
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
                    disabled
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
                    disabled
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
                  <a-input
                    placeholder="请输入财务主管的手机号"
                    v-model="form.fcontactMode"
                    disabled
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
                <td>合作协议</td>
                <td v-if="form.cooperationAgreement">
                  <a @click="delSee(form.cooperationAgreement)">查看</a>
                  <a-divider type="vertical" />
                  <a target="_blank" v-download="form.cooperationAgreement">下载</a>
                </td>
              </tr>
              <tr>
                <td>保密协议</td>
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
                    disabled
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
                    disabled
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
                    disabled
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
                    :disabled="Disabled"
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
                    :allowClear="true"
                    disabled
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
                    :allowClear="true"
                    disabled
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
                  <a-input
                    placeholder="请输入业务员手机号"
                    v-model="form.salesmanPhone"
                    :allowClear="true"
                    disabled
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
                    :allowClear="true"
                    disabled
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
                    :allowClear="true"
                    disabled
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
                    :allowClear="true"
                    disabled
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
                  <a-input
                    placeholder="请输入售后手机号"
                    v-model="form.asalePhone"
                    :allowClear="true"
                    disabled
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
                    :allowClear="true"
                    disabled
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
                    :allowClear="true"
                    disabled
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
                    :allowClear="true"
                    disabled
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
                    :allowClear="true"
                    disabled
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
                    :allowClear="true"
                    disabled
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
                    :allowClear="true"
                    disabled
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
                    :allowClear="true"
                    disabled
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
                    :allowClear="true"
                    disabled
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
                    :allowClear="true"
                    disabled
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
                    :allowClear="true"
                    disabled
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
                  <a-input
                    placeholder="请输入财务主管的手机号"
                    v-model="form.fcontactMode"
                    :allowClear="true"
                    disabled
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
                    :allowClear="true"
                    disabled
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
                    :allowClear="true"
                    disabled
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
                    :allowClear="true"
                    disabled
                    style="width: 290px"
                  >
                    <a-select-option :value="0">现款现货</a-select-option>
                    <a-select-option :value="1">帐期结算</a-select-option>
                  </a-select></a-form-model-item
                >
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
                              <a-checkbox :value="1" disabled name="type" @change="checkboxChange"> 预付款 </a-checkbox>
                            </a-checkbox-group>
                          </a-form-model-item>
                        </a-col>
                        <a-col :span="8">
                          <a-form-model-item ref="padvanceProportion" prop="padvanceProportion">
                            <a-input-number
                              :min="0"
                              :max="100"
                              :precision="0"
                              disabled
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
                              <a-checkbox :value="2" disabled name="type" @change="checkboxChange"> 提货款 </a-checkbox>
                            </a-checkbox-group>
                          </a-form-model-item>
                        </a-col>
                        <a-col :span="8">
                          <a-form-model-item ref="ccommodityProportion" prop="ccommodityProportion">
                            <a-input-number
                              :min="0"
                              :max="100"
                              :precision="0"
                              disabled
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
                              <a-checkbox :value="3" disabled name="type" @change="checkboxChange"> 验收款 </a-checkbox>
                            </a-checkbox-group>
                          </a-form-model-item>
                        </a-col>
                        <a-col :span="8">
                          <a-form-model-item ref="ccollectProportion" prop="ccollectProportion">
                            <a-input-number
                              :min="0"
                              :max="100"
                              :precision="0"
                              disabled
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
                          <a-form-model-item ref="ccollectProportion" prop="ccollectProportion">
                            <span>到货后 </span>
                            <a-input-number
                              :min="0"
                              :max="100"
                              :precision="0"
                              disabled
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
                              <a-checkbox :value="4" disabled name="type" @change="checkboxChange"> 验收款 </a-checkbox>
                            </a-checkbox-group>
                          </a-form-model-item>
                        </a-col>
                        <a-col :span="8">
                          <a-form-model-item ref="warrantyProportion" prop="warrantyProportion">
                            <a-input-number
                              :min="0"
                              :max="100"
                              :precision="0"
                              placeholder="填入数字"
                              v-model="form.warrantyProportion"
                              :allowClear="true"
                              disabled
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
                      <a-form-model-item ref="paymentCycleId" prop="paymentCycleId">
                        <span>票到付款周期 </span>
                        <a-select
                          placeholder="选择天数"
                          v-model="form.paymentCycleId"
                          :allowClear="true"
                          disabled
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
                <td>物流协议</td>
                <td v-if="form.logisticsAgreement">
                  <a @click="delSee(form.logisticsAgreement)">查看</a>
                  <a-divider type="vertical" />
                  <a target="_blank" v-download="form.logisticsAgreement">下载</a>
                </td>
              </tr>
              <tr>
                <td>技术协议</td>
                <td v-if="form.technologyAgreement">
                  <a @click="delSee(form.technologyAgreement)">查看</a>
                  <a-divider type="vertical" />
                  <a target="_blank" v-download="form.technologyAgreement">下载</a>
                </td>
              </tr>
              <tr>
                <td>质量保证协议</td>
                <td v-if="form.qensureAgreement">
                  <a @click="delSee(form.qensureAgreement)">查看</a>
                  <a-divider type="vertical" />
                  <a target="_blank" v-download="form.qensureAgreement">下载</a>
                </td>
              </tr>
              <tr>
                <td>战略合作协议</td>
                <td v-if="form.scooperationAgreement">
                  <a @click="delSee(form.scooperationAgreement)">查看</a>
                  <a-divider type="vertical" />
                  <a target="_blank" v-download="form.scooperationAgreement">下载</a>
                </td>
              </tr>
              <tr>
                <td>价格协议</td>
                <td v-if="form.priceAgreement">
                  <a @click="delSee(form.priceAgreement)">查看</a>
                  <a-divider type="vertical" />
                  <a target="_blank" v-download="form.priceAgreement">下载</a>
                </td>
              </tr>
              <tr>
                <td>保密协议</td>
                <td v-if="form.secrecyAgreement">
                  <a @click="delSee(form.secrecyAgreement)">查看</a>
                  <a-divider type="vertical" />
                  <a target="_blank" v-download="form.secrecyAgreement">下载</a>
                </td>
              </tr>
              <tr>
                <td>反贿赂协议</td>
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
    <AddForm ref="addForm" :key="normalAddFormKeyCount" @finish="goback()" />
    <BrandFrom ref="brandFrom" @brandChange="brandChange" />
    <XdocView ref="xdocView" />
  </a-spin>
</template>
<script>
//物料代码模糊搜索
import { getDetail } from '@/api/supplier'
import BrandFrom from './BrandFrom'
import AddForm from './Formadd'
import UploadFile from './UploadFile'
import UploadF from './UploadF'
import XdocView from './XdocView'
import moment from 'moment'
import { queryCode } from '@/api/workBox'

let uuid = () => Math.random().toString(32).slice(-10)

export default {
  inject: ['normalAddForm'],
  name: 'BecomingForm',
  components: {
    BrandFrom,
    UploadFile,
    UploadF,
    XdocView,
    AddForm,
  },
  data() {
    // this.allMaterialFuzzySearchAction = this.$_.debounce(this.allMaterialFuzzySearchAction, 800)
    return {
      Disabled: true,
      uploadConfig3: {
        maxFileCount: 3,
        fileType: 'img',
        enablePreview: true,
      },
      normalAddFormKeyCount: 1,
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
        padvanceProportion: 30, // 预付款
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
        lpersonName: undefined,
      },
      type: 'view',
      record: {},
      rules: {
        supplierEmail: [{ required: true, message: '请输入企业邮箱', trigger: 'blur' }],
        officialPhone: [{ required: true, message: '请输入企业电话', trigger: 'blur' }],
        belongPlatformName: [{ required: true, message: '请输入所在平台名称', trigger: 'blur' }],
        asaleWeChat: [{ required: true, message: '请输入售后微信号', trigger: 'blur' }],
        asaleJob: [{ required: true, message: '请输入售后职务', trigger: 'blur' }],
        asalePhone: [{ required: true, message: '请输入售后手机号', trigger: 'blur' }],
        asaleName: [{ required: true, message: '请输入售后姓名', trigger: 'blur' }],
        salesmanIdentity: [{ required: true, message: '请输入业务员身份证信息', trigger: 'blur' }],
        salesmanJob: [{ required: true, message: '请输入业务员职务', trigger: 'blur' }],
        fcontactMode: [{ required: true, message: '请输入财务主管手机号', trigger: 'blur' }],
        cardNumber: [{ required: true, message: '请输入银行卡号', trigger: 'blur' }],
        bankName: [{ required: true, message: '请输入开户行', trigger: 'blur' }],
        taxpayerNumber: [{ required: true, message: '请输入纳税人识别号', trigger: 'blur' }],
        cfullName: [{ required: true, message: '请输入公司全称', trigger: 'blur' }],
        paymentCycleId: [{ required: true, message: '请选择付款周期', trigger: 'change' }],
        salesmanWeChat: [{ required: true, message: '请输入业务员微信号', trigger: 'blur' }],
        salesmanPhone: [{ required: true, message: '请输入业务员手机号', trigger: 'blur' }],
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

  computed: {},
  created() {},
  methods: {
    moment,
    goback() {
      this.$router.go(-1)
    },
    transformation() {
      this.normalAddFormKeyCount++
      this.$nextTick(() => {
        this.$refs['addForm'].query('mation', this.record)
      })
    },
    //查看
    delSee(idurl) {
      this.$refs.xdocView.query(idurl)
    },
    uploadChange(fileType, fileList) {
      let fileAddBoList = [...(this.fileAddBoList || [])]
      let files = fileAddBoList.filter((f) => f.fileType !== fileType)
      fileAddBoList = [
        ...fileList.map((f) => {
          return { fileName: f.name, fileType, fileUrl: f.url }
        }),
        ...files,
      ]
      this.fileAddBoList = fileAddBoList
    },

    quality(fileList, type) {
      type.qualityReportUrl = fileList
    },
    checkboxChange(event) {
      let that = this
    },
    brandChange(data) {
      console.log(data)
      let react = this.brandList.find((i) => i.materialId === this.records.materialId)
      react.manageBrands = [...data]
    },
    //接受数据
    async query(record) {
      const that = this
      that.form = {}
      that.brandList = []
      that.c1 = []
      that.c2 = []
      that.c3 = []
      that.c4 = []
      that.record = record
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
      await queryCode({ code: 'period_0' })
        .then((res) => {
          that.Payment = res.data
        })
        .catch((err) => (that.loading = false))
      that.$refs.UploadF.empty()
      let detail = await getDetail({ id: record.id }).then((res) => res.data)
      detail.paymentCycleId = Number(detail.paymentCycleId)
      if (detail.settlementMode === 0) {
        that.c1 = detail.padvanceType === 0 ? [] : [detail.padvanceType]
        that.c2 = detail.ccommodityType === 0 ? [] : [detail.ccommodityType]
        that.c3 = detail.ccollectType === 0 ? [] : [detail.ccollectType]
        that.c4 = detail.warrantyType === 0 ? [] : [detail.warrantyType]
      }
      that.form = { ...that.form, ...detail }
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
