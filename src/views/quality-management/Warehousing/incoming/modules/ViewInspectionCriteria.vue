<template>
  <a-modal
    title="检验标准"
    :width="1200"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <h3>物料基本信息</h3>
    <table class="custom-table custom-table-border">
      <tbody>
        <tr>
          <td style="width: 120px">物料编码</td>
          <td style="width: 280px">
            {{ CheckDetail.materialCode }}
          </td>
          <td style="width: 120px">物料名称</td>
          <td style="width: 280px">
            {{ CheckDetail.materialName }}
          </td>
        </tr>
        <tr>
          <td>规格型号</td>
          <td>
            <a-tooltip v-if="String(CheckDetail.specification).length > 5">
              <template slot="title">{{ CheckDetail.specification }}</template>
              {{ String(CheckDetail.specification).slice(0, 5) }}...
            </a-tooltip>
            <span v-else>{{ CheckDetail.specification }}</span>
          </td>
          <td>物料来源</td>
          <td>
            <!-- {{ {1:'自制',2:'外购',3:'委外',4:'标准件',5:'定制'}[CheckDetail.materialSource] }} -->
            {{ {1:'自制',2:'通用外购',3:'委外加工',4:'定制外购'}[CheckDetail.materialSource] }}
          </td>
        </tr>
      </tbody>
    </table>
    <h3>检验标准明细</h3>
    <table class="custom-table custom-table-border">
      <tbody>
        <tr>
          <td style="width: 120px">检验类别</td>
          <td style="width: 280px">
            {{ { 1: '来料检验', 2: '半成品检验', 3: '成品检验', 4: '退换货检验' }[CheckDetail.inspectionStatus] }}
          </td>
          <td style="width: 120px">检验方式</td>
          <td style="width: 280px">
            {{ { 1: '检验', 2: '免检' }[CheckDetail.inspectionType] }}
          </td>
        </tr>
        <tr>
          <td>检验方案</td>
          <td colspan="3">
            {{ CheckDetail.inspectionScheme }}
          </td>
        </tr>
      </tbody>
    </table>
    <table class="custom-table custom-table-border" style="margin-top: 20px">
      <tbody>
        <tr>
          <th>检验项目</th>
          <th>检验要点标准</th>
          <th>检验工具</th>
          <th>检验方法</th>
          <th>检验频次</th>
          <th>附件（文件/图片）</th>
          <th>图纸</th>
          <th>视频</th>
          <th>检验依据</th>
          <th>AQL值</th>
          <th>检验等级</th>
        </tr>
        <tr v-for="item in CheckDetail.checkInspectionStandardDetailDetailVos" :key="item.id">
          <td>{{ item.projectName }}</td>
          <td>{{ item.mainPoint }}</td>
          <td>{{ item.toolName }}</td>
          <td>{{ item.methodName }}</td>
          <td>
            {{ item.frequencyName }}
          </td>
          <td>
            <a href="javascript:void(0);" @click="docView(item.annexUrl)">查看</a>
          </td>
          <td>
            <a href="javascript:void(0);" @click="docView(item.bluepUrl)">查看</a>
          </td>
          <td>
            <a v-if="item.videoUrl" class="ant-btn" target="blank" :href="item.videoUrl">查看</a>
          </td>
          <td>{{ item.inspectionBasisName }}</td>
          <td>{{ item.parameterTermAqlName }}</td>
          <td>{{ { 0: '正常', 1: '加严', 2: '放宽' }[item.inspectionGrade] }}</td>
        </tr>
      </tbody>
    </table>
    <XdocView ref="xdocView" />
  </a-modal>
</template>

<script>
import { quality_getCheckGetMaterialId } from '@/api/qualityTesting'
import XdocView from './XdocView'
export default {
  name: 'ApprovalModal',
  components: {
    XdocView,
  },
  data() {
    return {
      visible: false,
      CheckDetail: {},
    }
  },
  methods: {
    docView(url) {
      const that = this
      if (!url) {
        that.$message.info('尚未上传文件')
        return
      }
      that.$refs.xdocView.query(url)
    },
    query(record) {
      this.visible = true
      quality_getCheckGetMaterialId({ materialId: record.materialId, reportCheckNum: record.reportNum }).then((res) => {
        this.CheckDetail = res.data
      })
    },
    handleOk() {
      let that = this
      that.visible = false
    },
    handleCancel() {
      let that = this
      that.visible = false
    },
  },
}
</script>