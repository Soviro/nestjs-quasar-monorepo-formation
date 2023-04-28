<template>
  <q-page padding>
    
    <product-mod-detail-component
    active
    title="Detailles Produit"
    ></product-mod-detail-component>
    
   
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ProductModDetailComponent from 'components/productModDetailComponent/ProductModDetailComponent.vue'

export default defineComponent({
  name: 'ProductDetailPage',
  components: {ProductModDetailComponent},
  props: {
    code: {
      type: String,
      required: true
    }
  },
})
</script>
