
import {
  defineComponent,
  onBeforeMount,
  reactive,
  ref

} from 'vue'
import { refsApiService } from 'boot/api'
import { ProductDto } from 'app/../libs/shared-lib/dist/dtos/poc.dtos';


export default defineComponent({
  name: 'ProductModDetailComponent',
  props: {
    title: {
      type: String,
      required: true
    }
  },
  setup() {
    const url = window.location.hash;
    const selectCode = url.substring(url.lastIndexOf('/') + 1)
    console.log(selectCode)

    onBeforeMount(async () => {

      const getPromiseResult = await refsApiService.getProduitDetailles(selectCode)
      console.log(getPromiseResult)
      if (getPromiseResult.isOk && getPromiseResult.data) {
        ProductDetails.code = getPromiseResult.data.code
        ProductDetails.libelle = getPromiseResult.data.libelle
        ProductDetails.commentaire = getPromiseResult.data.commentaire || ''                  //productDto commentaire optionel, donc envoie soit string, soit undefined. Donc maintenant on renvoie soit le commentaire rempli, soit '', donc string vide au lieu du commentaire undefined
      }
    })

    const ProductDetails = reactive({ code: '', libelle: '', commentaire: '' })
    console.log(ProductDetails)

    const showFormBoolUpdate = ref(false)

    function showFormUpdate() {
      if (showFormBoolUpdate.value === false) {
        return showFormBoolUpdate.value = true
      }
      else {
        showFormBoolUpdate.value = false
      }
    }

    const showFormBoolAdd = ref(false)

    function showFormAdd() {
      if (showFormBoolAdd.value === false) {
        return showFormBoolAdd.value = true
      }
      else {
        showFormBoolAdd.value = false
      }
    }


    const formChanged = ref(false)

    function doOnFormChanged(newValue: any) {
      formChanged.value = true
    }

    function isFormChanged() {
      return formChanged.value
    }

    function resetFormChangedStatus() {
      formChanged.value = false
    }

    // Define the initial state of the form
    const initialFormState: ProductDto = {
      code: '',
      libelle: '',
      commentaire: ''
    }
    // Initialize reactive form with its initial state
    const formUp = reactive({
      ...initialFormState
    })

    const formAdd = reactive({
      ...initialFormState
    })

    async function updateCurrentProd(this: any) {
      const product: ProductDto = reactive({ code: '', libelle: '', commentaire: '' })
      product.code = selectCode
      product.libelle = formUp.libelle
      product.commentaire = formUp.commentaire

      await refsApiService.updateProduitChoisi(selectCode, product)
      this.$router.go(0)
    }

    async function deleteCurrentProd(this: any) {
      await refsApiService.deleteProduitChoisi(selectCode)
      return this.$router.push({ path: `/refs/products` })
    }

    async function addNewProd(this: any) {
      const product: ProductDto = reactive({ code: '', libelle: '', commentaire: '' })
      product.code = formAdd.code
      product.libelle = formAdd.libelle
      product.commentaire = formAdd.commentaire

      const wd = await refsApiService.createProduit(product)
      if (wd.isOk && wd.data) {
        const newProduct = wd.data
        return this.$router.push({ path: `/refs/productdetails/${newProduct.code}` })
      }
      
    }

    // Reset the form to it's initial state
    function resetFormUp() {
      Object.assign(formUp, initialFormState)
    }

    function resetFormAdd() {
      Object.assign(formAdd, initialFormState)
    }

    //let productDetails = ref<ProductDto>({ code: '', libelle: '' })
    // let productDetails = ref<WorkDone<ProductDto>>({isOk: true, data: { code: '', libelle: '' }})
    // const productDetails = dets.then((data) => {
    //   console.log(data)
    // },
    //   (reason) => {
    //     console.error(reason)
    //   })
    // console.log(productDetails)



    return {


      ProductDetails,
      updateCurrentProd,
      resetFormUp,
      resetFormAdd,
      formUp,
      formAdd,
      showFormUpdate,
      showFormBoolUpdate,
      showFormAdd,
      showFormBoolAdd,
      doOnFormChanged,
      isFormChanged,
      resetFormChangedStatus,
      deleteCurrentProd,
      addNewProd
     
    }
  },
  methods: {
    handleClick(e: any) {

      return this.$router.push({ path: `/refs/products` })

    }

  }
  // mounted () {

  //   const url = window.location.hash;
  //   const selectCode = url.substring(url.lastIndexOf('/') + 1)
  //   console.log(selectCode)
  //   this.productDetails = this.showDetails(selectCode)
  // },
  // methods: {  
  //   async showDetails(selectCode: string) {

  //   this.productDetails = await refsApiService.getProduitDetailles(selectCode).then((data) => {

  //     console.log(test)
  //     console.log(this.productDetails)
  //     return this.productDetails
  //   },
  //     (reason) => {
  //       console.error(reason)
  //     })

  //   return this.productDetails


  //let productDetails = ref<ProductDto>({ code: '', libelle: '' })
  // let productDetails = ref<WorkDone<ProductDto>>({isOk: true, data: { code: '', libelle: '' }})

  // }

  //}

  //}
})
