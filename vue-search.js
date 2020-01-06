
const router = new VueRouter({
  mode: 'history'
});
let formatedAxios = axios.create({
  paramsSerializer: params => Qs.stringify(params, {arrayFormat: 'repeat'})
});
let orderFlag = false;
let f = [true, false];
const app = new Vue({
  router,
  el: '#app',
  watch: {
    '$route.query': {
      deep: true,
      handler() {
        if(f[0]){
          this.getData()
        }else{
          f[0] = true
        }
      }
    },
    'priceRange': {
      handler() {
        if(f[1]){
          this.pushPriceRange()
        }else{
          f[1] = true
        }
      }
    },
    '$route.query.search': {
      deep: true,
      handler() {
        this.getCategories()
      }
    },
    'curPage': {
      deep: true,
      handler() {
        if(this.curPage > 1){
          let appTop = document.getElementById('app').offsetTop;
          window.scrollTo(0, appTop);
        }
      }
    },
    'compareProducts': {
      deep: true,
      handler() {
        localStorage.setItem('compareProductsSearch', JSON.stringify(this.compareProducts));
      }
    },
  },
  data() {
    return {
      prevpage: null,
      nextpage: null,
      currentPage: null,
      pageNumbers: [],
      totalPages: 0,
      totalItems: 0,
      currentTotalItems: 0,
      perPage: 20,
      dataFilterParams: {},
      selectedItems: {},
      search: '',
      searchWord: '',
      products: [],
      categories: [],
      currentCategory: '',
      chosenSortOrder: '',
      sortData: [],
      pageType: '',
      api: '',
      loading: false,
      initMinRange: 0,
      initMaxRange: 99999,
      hasPriceRange: false,
      priceRange: [],
      compareUrl: '',
      compareProducts: [],
      isHidePopup: false
    }
  },
  async mounted() {
    await this.getCategories();
    await this.getFilterParams();
    await this.getData();
    setTimeout(() => {
      this.syncFilter();
    });
    if(!!localStorage.getItem('compareProductsSearch')){
      this.compareProducts = JSON.parse(localStorage.getItem('compareProductsSearch'));
    }
    document.getElementById('app').style.opacity = 1;
  },
  computed: {
    //pagination
    totalPageCount() {
      return parseInt(this.totalPages)
    },
    isPagination() {
      return this.totalPages > 1
    },
    queryWithoutPage() {
      return _.omit(this.$route.query, 'page')
    },
    filteredQuery(){
      return _.omit(this.$route.query, ['page', 'search', 'path', 'orderBy'])
    },
    showFirst() {
      return this.currentPage >= 5
    },
    showFirstDots() {
      return this.currentPage >= 5
    },
    showLast() {
      return this.curPage <= this.totalPageCount - 4
    },
    showLastDots() {
      return this.curPage <= this.totalPageCount - 4
    },
    curPage() {
      return this.$route.query.page ? this.$route.query.page : 1
    },
    //end pagination
    omitFilterParams(){
      return _.omit(this.dataFilterParams, ['orderby', 'attributes_names'])
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
  },
  methods: {
    pushFilterQuery(name) {
      let filterValue = this.selectedItems[name];
      filterValue = filterValue.length > 0 ? filterValue : undefined;
      this.$router.push({
        query: {
          ...this.$route.query,
          [name]: filterValue,
          page: undefined
        }
      })
    },
    clearFilterQuery(name){
      if(this.selectedItems[name].length <= 0) return false;
      if(_.isArray(this.selectedItems[name])){
        this.selectedItems[name] = [];
      }else {
        this.selectedItems[name] = '';
      }
      this.$router.push({
        query: {
          ...this.$route.query,
          [name]: undefined,
          page: undefined
        }
      })
    },
    pushSortQuery() {
      this.$router.push({
        query: {
          ...this.$route.query,
          orderBy: this.chosenSortOrder,
          page: undefined
        }
      })
    },
    pushPriceRange: _.debounce(function () {
      if(this.$route.query.price === this.priceRange) return false
      return this.$router.push({
        query: {
          ...this.$route.query,
          price: this.priceRange,
          page: undefined
        }
      })
    }, 300),
    pushSearch() {
      if(!this.notEmpty(this.search)) return false;
      if(this.search === _.get(this.$route.query, 'search', '')) return false;
      this.dataFilterParams =  {};
      this.$router.push({
        query: {
          search: this.notEmpty(this.search) ? this.search: undefined,
          page: undefined
        }
      })
    },
    pushCategory(val) {
      this.$router.push({
        query: {
          search: this.$route.query.search,
          orderBy: this.$route.query.orderBy,
          path: this.notEmpty(val) ? val: undefined,
          page: undefined
        }
      }).then(()=>{
        this.getFilterParams();
      });
      this.currentCategory = val;
    },
    async getData() {
      let query = {...this.$route.query};
      if(!_.get(query, 'search', false)) return false;
      if (!_.isEmpty(query) && _.get(this.$route, 'query.search', false)) {
        if (!query.page) {
          query.page = 1
        }
        if (!query.orderBy && this.sortData.length > 0) {
          query.orderBy = _.get(this.sortData[0], 'value', undefined)
        }
        if(_.isEmpty(this.search) && _.get(query, 'search', false)){
          this.search = query.search
        }
      }
      query.offset = query.page * this.perPage -  this.perPage;
      query.offset = !!query.offset ? query.offset : 0;
      delete query.page;
      this.loading = true;
      try {
        const {data, headers} = await formatedAxios.get(`${this.api}.rest/productSearch/v1/search`, {
          params: {
            limit: !!this.perPage ? this.perPage : undefined,
            ...query
          }
        });

        this.totalItems = Number(_.get(headers, 'x_search_total', 0));
        this.perPage = Number(_.get(headers, 'x_search_limit', this.perPage));
        this.totalPages =  Math.ceil(this.totalItems / this.perPage);

        if(_.get(headers, 'x_price_min', false) &&  _.get(headers, 'x_price_max', false)){
          this.initMinRange = Number(headers["x_price_min"]);
          this.initMaxRange = Number(headers["x_price_max"]);
          $(".slider-range").slider( "option", "min", this.initMinRange);
          $(".slider-range").slider( "option", "max", this.initMaxRange);
          this.hasPriceRange = true;
        }else{
          this.hasPriceRange = false;
        }
        this.products = data;
        this.currentTotalItems = data.length;
        if(this.notEmpty(this.search)){
          this.searchWord = this.search

        }
        this.setPageNumbers();
        if(data.length > 0 && !document.getElementsByClassName('jcf-select')[0]){
          if(this.notEmpty(this.$route.query.orderBy)){
            this.chosenSortOrder = this.$route.query.orderBy
          }else{
            this.chosenSortOrder = this.sortData[0].value
          }
          setTimeout(()=>{
            jcf.destroyAll();
            jcf.replaceAll();
          })
        }
      } catch (e) {
        alert(e);
        this.$router.push({query: {}})
      } finally {
        this.loading = false;
      }
    },
    async getCategories(){
      if(!_.get(this.$route.query, 'search', false) || this.$route.query.search === this.searchWord) return false;
      try{
        const {data} = await formatedAxios.get(`${this.api}.rest/productSearch/v1/categories`);
        this.categories = data;
      } catch (e) {
        alert(e);
      }
    },
    async getFilterParams() {
      if(!this.$route.query.path) return false;
      try{
        const {data} = await formatedAxios.get(`${this.api}.rest/productSearch/v1/filters`, {
          params: {
            path: this.$route.query.path
          }
        });
        let filterCategories = {};
        _.map(data, (i) =>{
          if(i.values.length <= 1 ||  i.type !== 'OR'){
            filterCategories = {
              ...filterCategories,
              [i.uuid]: []
            }
          }else{
            filterCategories = {
              ...filterCategories,
              [i.uuid]: ''
            }
          }

        });
        this.selectedItems = filterCategories;
        this.dataFilterParams = data;
      } catch (e) {
        alert(e);
      }
    },
    setOrder(val){
      if(orderFlag) return;
      this.sortData = val;
      orderFlag = true
    },
    setApi(payload) {
      if (!!payload) {
        return this.api = payload;
      }
      return this.api = window.location.origin
    },
    notEmpty(i) {
      return !_.isEmpty(i)
    },
    // pagination
    compileQueries(query) {
      return {
        ...this.queryWithoutPage,
        ...query
      }
    },
    setPages(currentPage, totalPageCount) {
      this.prevpage = currentPage > 1 ? (currentPage - 1) : null;
      if (!totalPageCount) {
        this.nextpage = currentPage ? (parseInt(currentPage) + 1) : 2
      } else {
        this.nextpage = currentPage < totalPageCount ? (parseInt(currentPage) + 1) : null
      }
      let maxDynamicPages = 6;
      let centerSlice = 2;
      if (this.showFirst || this.showLast) {
        maxDynamicPages = 5
      }
      if (this.showFirst && this.showLast) {
        maxDynamicPages = 4;
        if (this.currentPage < this.totalPageCount / 2) {
          centerSlice = 1
        }
      }
      for (let i = 0; i < maxDynamicPages; i++) {
        let _p = ((parseInt(currentPage) - centerSlice) + i);
        if (_p > 0 && _p <= totalPageCount) {
          this.pageNumbers.push(_p);
        }
      }
    },
    setPageNumbers() {
      this.prevpage = null;
      this.nextpage = null;
      this.currentPage = null;
      this.pageNumbers = [];
      let _currentPage = this.curPage;
      this.currentPage = _currentPage;
      this.setPages(_currentPage, this.totalPageCount);
    },
    //end pagination
    hasColor(items){
      let flag = true;
      _.map(items, (item) => {
        if(_.isEmpty(item.color)){
          flag = false
        }
      });
      return flag
    },
    colorStyle(product){
      return {
        backgroundColor: `${product.color}`,
        border: `1px solid ${(product.color !== '#ffffff' && product.color !== '#fff' ) ? 'transparent' : 'gray'}`
      }
    },
    syncFilter() {
      this.search = _.get(this.$route, 'query.search', false) ? this.$route.query.search: undefined;
      this.priceRange = [this.initMinRange, this.initMaxRange];
      if(_.get(this.$route.query, 'price', false)){
        const f1 = () => {
          if(_.isEmpty(this.$route.query.price[0])){
            return this.initMinRange
          }
          if(Number(this.$route.query.price[0]) < this.initMinRange){
            return  this.initMinRange
          }

          if(!_.isEmpty(this.$route.query.price[1]) && Number(this.$route.query.price[1]) < Number(this.$route.query.price[0])){
            return _.get(this.$route.query, 'price[1]')
          }
          return this.$route.query.price[0]
        };
        const f2 = () =>{
          if(_.isEmpty(this.$route.query.price[1])){
            return  this.initMaxRange
          }
          if(Number(this.$route.query.price[1]) > this.initMaxRange){
            return  this.initMaxRange
          }
          if(this.$route.query.price[1] && !_.isEmpty(this.$route.query.price[0]) && Number(this.$route.query.price[0]) > Number(this.$route.query.price[1])){
            return this.$route.query.price[0]
          }
          return this.$route.query.price[1]
        };
        this.priceRange = [f1(), f2()];
      }
      this.initJquerySliderRange();
      this.setRangeJquerySlider();


      if (this.notEmpty(this.filteredQuery)) {
        _.map(this.filteredQuery, (n, c) => {
          if(_.isArray(this.selectedItems[c])){
            this.selectedItems[c] =  n.split(',');
          } else {
            this.selectedItems[c] =  n;
          }
        });
      }
      // sync sorter
      if(this.notEmpty(this.$route.query.orderBy)){
        this.chosenSortOrder = this.$route.query.orderBy
      }else{
        this.chosenSortOrder = this.sortData[0].value
      }
      setTimeout(()=>{
        jcf.destroyAll();
        jcf.replaceAll();
      }, 1000)
    },
    setRangeJquerySlider(){
      $(".slider-range").slider( "option", "values", this.priceRange);
    },
    initJquerySliderRange(){
      $(".slider-range").slider({
        range: true,
        min: this.initMinRange,
        max: this.initMaxRange,
        step: 0.01,
        values: this.priceRange,
        slide:  (event, ui) => {
          this.priceRange = ui.values;
        }
      });
    },
    filterType(item){
      if(item.values.length <= 1 ||  item.type !== 'OR'){
        return 'checkbox'
      }
      return 'radio'
    },
    isActiveCategory(path){
      return this.$route.query.path === path
    },
    getFilterName(item){
      return !!item.name ? item.name : 'Filter'
    },

    //rating
    addRatingWidth(rating, index){
      const rate = Number(rating);
      const integer = Math.floor(rate);
      if(index < integer){
        return '100%';
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
    compareMax(uuid){
      return this.compareProducts.length >= 4 && _.find(this.compareProducts, {uuid: uuid}) === undefined
    },
    hideShowComparePopup(){
      this.isHidePopup = !this.isHidePopup
    },
  }
});