import {
  IPaginatedListDto,
  IPagination,
  ISearchDto,
  ITEMS_PER_PAGE,
  mandatoryValidator,
  ProductDto,
  SearchProductDto,
  textValidatorToFixed3,
  WorkDone
} from '@formation/shared-lib'
import {
  defineComponent,
  reactive,
  Ref,
  ref
} from 'vue'
import { refsApiService } from 'boot/api'
// import {
//   displayNotification,
//   NotificationStatusEnum
// } from '../../services/common/notification.service'

/**
 * Composant permettant la détection des changement dans les form afin de gérer l'accès à certaine partie (ex: bouton rechercher)
 * @returns {{doOnFormChanged: (newValue: any) => void, resetFormChangedStatus: () => void, isFormChanged: () => boolean}}
 */
function defineFormChangedManager(): { doOnFormChanged: (newValue: any) => void; resetFormChangedStatus: () => void; isFormChanged: () => boolean } {
  const formChanged = ref(false)                                //valeur par default formChanged false (on voit pas la formulaire au début)

  function doOnFormChanged(newValue: any) {                    //quand on tape dans le qform, valeur de formChanged est mis en true
    formChanged.value = true
  }

  function isFormChanged() {                                 //bouton rechercher l'utilise pour checker valeur FormChanged. Si faux, peut pas clicker
    return formChanged.value
  }

  function resetFormChangedStatus() {
    formChanged.value = false                                 //.value, parce que formChanged est ref()
  }

  return {
    doOnFormChanged,
    isFormChanged,
    resetFormChangedStatus
  }
}

export default defineComponent({
  name: 'ProductSearchComponent',
  props: {
    title: {
      type: String,
      required: true
    }
  },
  setup() {
    const formChangedManager = { ...defineFormChangedManager() }

    const searchAllResponse = ref<IPaginatedListDto<ProductDto>>({ list: [], rowsNumber: 0 })              //ref<IPaginatedListDto<CustomerSearchResultDto>>({ list: [], rowsNumber: 0 })

    // Define the initial state of the form
    const initialFormState: SearchProductDto = {
      labelLike: ''
    }

    const initialPagination: IPagination = {
      sortBy: 'libelle',
      descending: false,
      page: 1,
      rowsPerPage: ITEMS_PER_PAGE,
      rowsNumber: 0
    }

    // Initialize reactive form with its initial state
    const form = reactive({
      ...initialFormState
    })

    // Initialize reactive pagination with its initial state
    const pagination = ref({
      ...initialPagination
    })

    const rows: Ref<never[]> = ref([])
    const loading = ref(false)

    let currentSearchParams: SearchProductDto = {
      labelLike: ''
    }

    const columns = [
      {
        name: 'code',
        required: true,
        label: 'Code',
        align: 'center',
        field: (row: ProductDto) => row.code,
        format: (val: string) => `${val}`,
        sortable: true
      },
      {
        name: 'libelle',
        required: true,
        label: 'Libellé',
        align: 'left',
        field: (row: ProductDto) => row.libelle,
        format: (val: string) => `${val}`,
        sortable: true
      },
      {
        name: 'commentaire',
        required: true,
        label: 'Commentaire',
        align: 'left',
        field: (row: ProductDto) => row.commentaire,
        format: (val: string) => `${val}`,
        sortable: true
      }
    ]

    async function doPagination(props: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      pagination.value = props.pagination
      console.log(props)
      //pagination.value.rowsNumber = 
      // get all rows if "All" (0) is selected
      pagination.value.rowsPerPage = pagination.value.rowsPerPage === 0 ? pagination.value.rowsNumber : pagination.value.rowsPerPage
     
     
      const searchAllParams = {
        criterias: currentSearchParams,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        pagination: pagination.value
      }
      console.log(searchAllParams)

      await _doSearchAll(searchAllParams)
    }

    async function doSearchAll() {
      const searchAllParams: ISearchDto<SearchProductDto> = {
        criterias: {
          labelLike: form.labelLike
        },
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        pagination: initialPagination
      }

      currentSearchParams = searchAllParams.criterias as SearchProductDto

      const wd = await _doSearchAll(searchAllParams)
      if (wd.isOk) {
        formChangedManager.resetFormChangedStatus()
      }
    }

    async function _doSearchAll(searchAllParams: ISearchDto<SearchProductDto>): Promise<WorkDone<boolean>> {

      loading.value = true
      const wd = await refsApiService.getProductListByCriterias(searchAllParams)
      if (wd.isOk && !!wd.data) {
        console.log(wd.data)
        // console.log(wd.data.list)
        // console.log(wd.data.rowsNumber)
        // console.log(wd.data.list.length)
        console.log(wd)
        
        searchAllResponse.value = wd.data
        console.log(searchAllResponse)
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        pagination.value.rowsNumber = wd.data.rowsNumber ?? searchAllParams.pagination.rowsNumber
        console.log(pagination.value.rowsPerPage)
        console.log(pagination.value.rowsNumber)
      }
      loading.value = false
      // return WorkDone.toOkNotOk(wd)
      return WorkDone.buildOk(true)
    }

    // Reset the form to it's initial state
    function resetForm() {
      Object.assign(form, initialFormState)
    }

    return {
      doSearchAll,
      resetForm,
      mandatoryValidator,
      textValidatorToFixed3,
      doPagination,
      searchAllResponse,
      form,
      columns,
      rows,
      loading,
      pagination,
      ...formChangedManager
    }
  },
  methods: {
    handleClick(e: any, row: ProductDto) {

      return this.$router.push({ path: `/refs/productdetails/${row.code}` })


    }

  }
})
