<template>
  <a-cascader
    :options="options"
    @change="change"
    change-on-select
    :loadData="loadData"
    placeholder="选择省市区"
    :notFoundContent="notFoundContent"
    allowClear
    :value="area"
  />
</template>

<script>
import { getAreaByParent } from '@/api/common'
/**
 * @description 省市区级联组件
 */
export default {
  name: "casecade_province-city-area",
  props: {
    area: Array
  },
  data() {
    return {
      options: [],
      notFoundContent: "无数据",
      isLoaded: false,
      areaInfo: {
        area: [],
        text: []
      }
    };
  },
  watch: {
    area: {
      handler(new_area) {
        if (Array.isArray(new_area) && new_area.length === 3) {
          this.fill();
        }
      },
      immediate: true
    }
  },
  created() {
    this.init();
  },
  methods: {
    getText() {
      return [...this.areaInfo.text];
    },
    async change(value, selectedOptions) {
      let area = [],
        text = [];
      selectedOptions.map(item => {
        area.push(item.value);
        text.push(item.label);
      });
      this.areaInfo = {
        area,
        text
      };
      this.$emit("update:area", [...value]);
      this.$emit("change",this.areaInfo)
    },
    async init() {
      const that = this;
      that.isLoaded = false;
      try {
        that.options = await that.fetchData("100000");
      } catch (err) {
        console.error(err);
      }
      that.isLoaded = true;
    },
    async fill() {
      const that = this;
      let area = [],
        text = [];
      let [provinceValue, cityValue, areaValue] = that.area;

      if (!that.isLoaded) {
        await that.init();
      }

      let _city_data = null,
        _area_data = null;
      try {
        let result = await Promise.all([
          that.fetchData(provinceValue),
          that.fetchData(cityValue)
        ]);
        _city_data = result[0];
        _area_data = result[1];
      } catch (err) {
        console.error(err);
        return;
      }

      let _area_item = _area_data.find(item => item.value === areaValue);
      let _city_item = _city_data.find(item => item.value === cityValue);

      if (!_area_item || !_city_item) {
        return;
      }

      _city_item.children = _area_data;
      let _province_item = that.options.find(
        item => item.value === provinceValue
      );
      _province_item.children = _city_data;
      that.options = [...that.options];

      area.push(_province_item.value);
      area.push(_city_item.value);
      area.push(_area_item.value);

      text.push(_province_item.label);
      text.push(_city_item.label);
      text.push(_area_item.label);
      that.areaInfo = { area, text };
    },
    async loadData(selectedOptions) {
      const that = this;
      const targetOption = selectedOptions[selectedOptions.length - 1];
      targetOption.loading = true;
      targetOption.children = await that.fetchData(targetOption.value);
      targetOption.loading = false;
      that.options = [...that.options];
    },
    format(item) {
      return {
        value: item.id,
        label: item.area,
        isLeaf: +item.level === 3,
        level: item.level
      };
    },
    async fetchData(pId) {
      const that = this;
      return getAreaByParent({ pId: pId })
        .then((res) => {
          return res.data.map(item => that.format(item));
        })
        .catch(function (err) {
          console.log(err)
          return []
        })
    }
  }
};
</script>
