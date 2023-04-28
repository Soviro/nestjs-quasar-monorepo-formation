<template>
  <div>
    <div class="q-pa-sm q-pa-md-md">
      <h4>{{ title }}</h4>
      <q-form @reset="resetForm"
              @submit="doSearchAll">
        <div class="q-pa-md">
          <div class="row q-col-gutter-xs q-col-gutter-md-md">
            <q-input v-model="form.labelLike"
                     :lazy-rules="true"
                     :rules="[mandatoryValidator]"
                     class="col-12 col-md-6"
                     hint="Champ Obligatoire"
                     label="Libellé"
                     stack-label
                     @update:model-value="doOnFormChanged"
            />
          </div>
          
          <div class="row justify-end">
            <q-btn :disable="!isFormChanged()"
                   color="primary"
                   icon="fa fa-search"
                   label="Rechercher"
                   type="submit"
            />
            <q-btn class="q-ml-sm"
                   color="primary"
                   flat
                   label="R.A.Z."
                   type="reset"
            />
          </div>
        </div>
      </q-form>
    </div>

    <div class="q-px-sm q-px-md-md">
      <q-table
          v-model:pagination="pagination"
          :columns="columns"
          :grid="$q.screen.lt.md"
          :loading="loading"
          :rows="searchAllResponse.list"
          binary-state-sort
          row-key="code"
          style="width: 100%"
          title="Liste des produits"
          @request="doPagination"
          @row-click="handleClick"
      >
      </q-table>
      

    </div>
  </div>
</template>

<script lang="ts"
        src="./ProductSearchComponent.ts">
    </script>
<style lang="scss"
       src="./ProductSearchComponent.scss"></style>
