<template>
  <div>

    <h3>{{ title }}</h3>
    <div class="q-pa-md row items-start q-gutter-md">
      <q-card class="my-card bg-blue text-white">
        <q-card-section>
          <div class="text-h6">{{ ProductDetails.libelle }}</div>
          <div class="text-subtitle2">{{ ProductDetails.code }}</div>
          <div class="text-subtitle3">{{ ProductDetails.commentaire }}</div>
        </q-card-section>

        <q-card-actions>
          <q-btn @click="showFormUpdate" color="info">Modifier détailles</q-btn>
          <q-btn @click="deleteCurrentProd(this)" color="negative">Supprimer ce produit</q-btn>
          <q-btn @click="showFormAdd" color="warning">Ajouter un nouveau produit</q-btn>
        </q-card-actions>
      </q-card>


    </div>
    <div class="q-pa-md" style="max-width: 400px">

      <q-form v-if="showFormBoolUpdate" 
              @submit="updateCurrentProd(this)" 
              @reset="resetFormUp" class="q-gutter-md"
              name="form pour update">

        <q-input  name="formUp.libelle" 
                  filled v-model="formUp.libelle" label="Libellé du produit " 
                  hint="Modifiez le libellé"
                  lazy-rules :rules="[val => val && val.length > 0 || 'Modifiez ici']" 
                  @update:model-value="doOnFormChanged" />

        <q-input  name="formUp.commentaire" 
                  filled v-model="formUp.commentaire" 
                  label="Commentaire"
                  hint="Ajoutez une commentaire" 
                  lazy-rules :rules="[val => val && val.length > 0 || 'Modifiez ici']"
                  @update:model-value="doOnFormChanged" />

        <div>
          <q-btn :disable="!isFormChanged()" label="Submit" type="submit" color="primary" />
          <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
        </div>
      </q-form>

      <q-form v-if="showFormBoolAdd" 
              @submit="addNewProd(this)" 
              @reset="resetFormAdd" class="q-gutter-md"
              name="form pour Ajouter">

        <q-input  name="formAdd.code" 
                  filled v-model="formAdd.code" 
                  label="Code du produit " 
                  hint="Ajoutez le code"
                  lazy-rules :rules="[val => val && val.length > 0 || 'Modifiez ici']" 
                  @update:model-value="doOnFormChanged" />

        <q-input  name="formAdd.libelle" 
                  filled 
                  v-model="formAdd.libelle" 
                  label="Libellé du produit "
                  hint="Saisissez le libellé" 
                  lazy-rules :rules="[val => val && val.length > 0 || 'Modifiez ici']"
                  @update:model-value="doOnFormChanged" />

        <q-input name="formAdd.commentaire" 
                filled 
                v-model="formAdd.commentaire" 
                label="Commentaire"
                hint="Ajoutez une commentaire" 
                lazy-rules :rules="[val => val && val.length > 0 || 'Modifiez ici']"
                @update:model-value="doOnFormChanged" />

        <div>
          <q-btn :disable="!isFormChanged()" label="Submit" type="submit" color="primary" />
          <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
        </div>
      </q-form>
      
    </div>
    <div id="return">
      <q-btn @Click="handleClick" color="secondary" label="Retour vers la liste des produits" />
      </div>
  </div>
  
</template>

<script lang="ts"
        src="./ProductModDetailComponent.ts"></script>
<style lang="scss"
       src="./ProductModDetailComponent.scss"></style>
