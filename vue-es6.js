Object.defineProperty(Array.prototype, 'chunk', {
  value: function (chunkSize) {
    let R = [];
    for (let i = 0; i < this.length; i += chunkSize)
      R.push(this.slice(i, i + chunkSize));
    return R;
  }
});
function dynamicSort(property, direction) {
  let sortOrder = -1;
  if(direction) {
    sortOrder = 1;
  }
  if(property !== 'price'){
    return function (a,b) {
      let result = (a.products[0][property].toLowerCase() < b.products[0][property].toLowerCase()) ? -1 : (a.products[0][property].toLowerCase() > b.products[0][property].toLowerCase()) ? 1 : 0;
      return result * sortOrder;
    }
  }
  return function (a,b) {
    let result = (a.products[0][property] < b.products[0][property]) ? -1 : (a.products[0][property] > b.products[0][property]) ? 1 : 0;
    return result * sortOrder;
  }
}

const app = new Vue({
  el: '#app',
  watch: {
    'compareProducts': {
      deep: true,
      handler() {
        localStorage.setItem(this.categoryName, JSON.stringify(this.compareProducts));
      }
    },
  },
  data: {
    filterConfiguration: [],
    arrayData: [],
    curIndex: 0,
    activeItemId: '',
    show: '',
    perPage: 12,
    defValues: {
      buttonsSettings: {
        maxButtons: 5,
      },
      arrowsSettings: {
        hideArrows: false,
        arrowSwitchHide: false
      },
      pageStarted: 1,

      pageSettings: {
        pageClass: ''
      }
    },
    sortData: {
      sortMin: true,
      sortBy: 'price',
    },
    filterParams: [],
    loaded: false,

    compareUrl: '',
    compareProducts: [],
    categoryName: '',
    isHidePopup: false
  },
  mounted() {
    jcf.destroyAll();
    jcf.setOptions("Select", {
      wrapNative: false,
      useCustomScroll: true,
      multipleCompactStyle: true,
      wrapNativeOnMobile: false,
    });
    jcf.replaceAll();
    if(!!localStorage.getItem(this.categoryName)){
      this.compareProducts = JSON.parse(localStorage.getItem(this.categoryName));
    }
    document.getElementById('app').style.opacity = '1';
  },
  methods: {
    colorStyle(product){
      return {
        backgroundColor: `${product.color}`,
        border: `1px solid ${(product.color !== '#ffffff' && product.color !== '#fff' ) ? 'transparent' : 'gray'}`
      }
    },
    setJson (payload) {
      if(this.loaded){
        return
      }
      this.arrayData = payload.arrayData
      this.filterConfiguration = payload.filterConfiguration;
      _.map(this.filterConfiguration, (item) =>{
        this.filterParams.push({
          filterParam: item.property,
          filterLabel: item.label,
          filterParamsData: []
        })
      });
      document.addEventListener('keydown', this.keydown);
      this.curIndex = this.def.pageStarted - 1;
      this.$set(this.settings.arrayData[this.curIndex], 'active', true)
      this.loaded = true
    },
    keydown: function (e) {
      if (e.ctrlKey && e.which === 39 && this.curIndex < this.settings.arrayData.length - 1) {
        this.switch_page(this.curIndex + 1)
      }
      if (e.ctrlKey && e.which === 37 && this.curIndex > 0) {
        this.switch_page(this.curIndex - 1)
      }
    },
    classArrowPrev: function () {
      if (this.curIndex === 0) {
        if (this.def.arrowsSettings.arrowSwitchHide) {
          return 'pagination-list__button_hide'
        } else {
          return 'pagination-list__button_disabled'
        }
      }
    },
    classArrowNext: function () {
      if (this.curIndex === this.settings.arrayData.length - 1) {
        if (this.def.arrowsSettings.arrowSwitchHide) {
          return 'pagination-list__button_hide'
        } else {
          return 'pagination-list__button_disabled'
        }
      }
    },
    switch_page: function (index) {
      this.curIndex = index
      for (let i = 0; i < this.settings.arrayData.length; i++) {
        this.$set(this.settings.arrayData[i], 'active', false)
      }
      this.$set(this.settings.arrayData[index], 'active', true)
      this.$emit('callMethod', index)
      $(this).parents(".product").find($(".product-color-item")).removeClass("active");
      $(this).parents(".product").find($(".product-color-item")).eq(0).addClass("active");
      let appTop = document.getElementById('app').offsetTop;
      window.scrollTo(0, appTop);
    },
    pagination: function (index) {
      if (index === 0 || index === this.settings.arrayData.length - 1) {
        return {
          li: true,
          button: true
        }
      } else {
        if (this.curIndex === 0) {
          if (index <= this.maxButton - 2) {
            return {
              li: true,
              button: true
            }
          } else if (index === this.maxButton - 1) {
            return {
              li: true,
              button: false
            }
          } else {
            return {
              li: false
            }
          }
        } else {
          if (index === this.curIndex) {
            return {
              li: true,
              button: true
            }
          } else if (this.curIndex - this.maxButton / 2 + 1 <= 0) {
            if ((index <= this.curIndex + this.maxButton / 2 - 1 + (Math.abs(this.curIndex - this.maxButton / 2 + 1)) && (index >= this.curIndex - this.maxButton / 2 + 1))) {
              return {
                li: true,
                button: true
              }
            } else if (index === this.curIndex + Math.round(this.maxButton / 2) - 1 + (Math.abs(this.curIndex - Math.round(this.maxButton / 2) + 1)) || (index === this.curIndex - Math.round(this.maxButton / 2) + 1)) {
              return {
                li: true,
                button: false
              }
            } else {
              return {
                li: false
              }
            }
          } else if (this.curIndex + this.maxButton / 2 + 1 > this.settings.arrayData.length) {
            if ((index <= this.curIndex + this.maxButton / 2 - 1) && (index >= this.curIndex - this.maxButton / 2 + 1 - (this.curIndex + Math.round(this.maxButton / 2) - this.settings.arrayData.length))) {
              return {
                li: true,
                button: true
              }
            } else if (index === this.curIndex - Math.round(this.maxButton / 2) + 1 - (this.curIndex + Math.round(this.maxButton / 2) - this.settings.arrayData.length)) {
              return {
                li: true,
                button: false
              }
            } else {
              return {
                li: false
              }
            }
          } else {
            if ((index <= this.curIndex + this.maxButton / 2 - 1) && (index >= this.curIndex - this.maxButton / 2 + 1)) {
              return {
                li: true,
                button: true
              }
            } else if ((index === this.curIndex + Math.round(this.maxButton / 2) - 1) || (index === this.curIndex - Math.round(this.maxButton / 2) + 1)) {
              return {
                li: true,
                button: false
              }
            } else {
              return {
                li: false
              }
            }
          }
        }
      }
    },
    changePerPage(newVal) {
      this.perPage = newVal;
      this.curIndex = this.def.pageStarted - 1;
      this.switch_page(this.curIndex)
    },
    setFirstPage() {
      this.curIndex = this.def.pageStarted - 1;
      this.switch_page(this.curIndex);
    },
    clearFilter(){
      this.filterParams.map((fpObj, index) => {
        this.filterParams[index].filterParamsData = []
      });
      _.map(this.$refs.filterSelect, (i, index) => {
        document.getElementsByClassName('jcf-select')[index].querySelector('.jcf-select-text').childNodes[0].textContent = i.getAttribute('placeholder')
      });
      this.setFirstPage()
    },
    clearSingleFilter(index, val){
      this.filterParams[index].filterParamsData = _.filter(this.filterParams[index].filterParamsData, (item)=>{
        return item !== val
      });
      _.map(this.$refs.filterSelect, (i, index) => {
        if(i.value.length > 0){
          let node = document.getElementsByClassName('jcf-select')[index].querySelector('.jcf-select-text').childNodes[0];
          let arr = node.innerHTML.split(', ');
          arr = _.without(arr, val);
          node.innerHTML = arr.join(', ');
          if(arr.length <= 0){
            document.getElementsByClassName('jcf-select')[index].querySelector('.jcf-select-text').childNodes[0].innerHTML = i.getAttribute('placeholder')
          }
        }
      });
      this.setFirstPage()
    },
    filteredItemsLength() {
      return this.arrayDataFiltered.length;
    },
    activeItemLength() {
      return this.settings.arrayData[this.curIndex].length
    },
    hasColor(items){
      let flag = true;
      _.map(items, (item) => {
        if(_.isEmpty(item.color)){
          flag = false
        }
      });
      return flag
    },

    //rating
    addRatingWidth(rating, index){
      const rate = Number(rating);
      const integer = Math.floor(rate);
      if(index < integer){
        return `100%`;
      }
      if(index === integer){
        return `${getRest(rate, integer)*100}%`;
      }
      return 0;
      function getRest(num, int) {
        if(num >= 1){
          return Number((num % int).toFixed(1))
        }
        return num
      }
    },

    //compare block
    removeCompareProduct(uuid){
      let index = _.findIndex(this.compareProducts, {uuid: uuid});
      if(index >= 0) this.$delete(this.compareProducts, index)
    },
    clearAllCompareProducts(){
      this.compareProducts = []
    },
    setCompareLink(url){
      if (!!url) {
        return this.compareUrl = url;
      }
      return this.api = `${window.location.origin}compare-products.html`
    },
    setCategory(categoryName){
      if (!!categoryName) {
        return this.categoryName = categoryName;
      }
      return this.categoryName = `${window.location.href}`;
    },
    compareMax(uuid){
      return this.compareProducts.length >= 4 && _.find(this.compareProducts, {uuid: uuid}) === undefined
    },
    hideShowComparePopup(){
      this.isHidePopup = !this.isHidePopup
    }
  },
  computed: {
    def: function () {
      return this.defValues
    },
    showPagination(){
      return this.settings.arrayData.length > 1
    },
    maxButton: function () {
      if (!isNaN(this.def.buttonsSettings.maxButtons % 2)) {
        if (this.def.buttonsSettings.maxButtons % 2 === 0) {
          return this.def.buttonsSettings.maxButtons + 1
        } else return this.def.buttonsSettings.maxButtons
      } else {
        return 5
      }
    },
    settings() {
      return {
        arrayData: this.arrayDataFiltered.chunk(this.perPage)
      }
    },
    sortedArray() {
      return this.arrayData.sort(dynamicSort(this.sortData.sortBy, this.sortData.sortMin));
    },
    arrayDataFiltered() {
      let filteredArr = this.sortedArray;
      _.map(this.filterParams, (fpObj) => {
        if(fpObj.filterParamsData.length > 0){
          _.map(filteredArr, (i) => {
            if(!i.filter[fpObj.filterParam]){
              filteredArr = filteredArr.filter(function (obj) {
                return !_.isEqual(obj.filter[fpObj.filterParam], i.filter[fpObj.filterParam]);
              });
              return
            }
            if (i.filter[fpObj.filterParam].some(r => fpObj.filterParamsData.includes(r))) {
              if(!filteredArr.includes(i)){
                filteredArr.push(i)
              }
            } else {
              filteredArr = filteredArr.filter(function (obj) {
                return !_.isEqual(obj.filter[fpObj.filterParam], i.filter[fpObj.filterParam]);
              });
            }
          })
        }
      });
      return filteredArr
    },
    filterParamsConverted(){
      let converted = [];
      _.map(this.filterParams, (fpObj, index) => {
        _.map(fpObj.filterParamsData, (param) => {
          converted.push({
            type: fpObj.filterParam,
            label: fpObj.filterLabel,
            value: param,
            index: index
          })
        })
      });
      return converted
    },


    //compare block
    compareLink(){
      let uuidArr = [];
      _.map(this.compareProducts, (i) => {
        uuidArr.push(i.uuid)
      });
      return `${this.compareUrl}?products=${uuidArr.join(',')}`
    },
    isActiveCompare(){
      return this.compareProducts.length > 0
    },
    productsWord(){
      return this.compareProducts.length > 1 ? 'products' : 'product'
    },
    compareProductsLength(){
      return !!this.compareProducts.length ? this.compareProducts.length : 0
    }
  }
});