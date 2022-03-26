<template>
  <div v-if="initialized" class="form-wrapper">
    <a-form-model ref="ruleForm" class="form-content" :v-model="formData">
      <div class="header">
        <div><h1>New review</h1></div>
        <a-button
          type="primary"
          html-type="submit"
          :disabled="useDisablebtn()"
          @click="useSaveReview"
        >
          Save
        </a-button>
      </div>
      <a-form-model-item :label="'Review type'" :required="true">
        <a-select
          v-model="formData.reviewTypes"
          @change="useChange($event)"
          size="default"
        >
          <a-select-option v-for="item in fieldList.reviewTypes" :key="item.id">
            {{ item.title }}
          </a-select-option>
        </a-select>
        <div v-if="formData.reviewTypes">
          <div
            v-for="(extraField, index) in fieldList.reviewTypes.find(
              (e) => e.id == formData.reviewTypes
            ).fields"
            :key="index"
          >
            <!-- SELECT TYPE -->
            <a-form-model-item
              v-if="extraField.type == 'select'"
              :key="extraField.id"
              :required="extraField.required"
              :label="extraField.title"
            >
              <a-select
                :key="extraField.id"
                v-model="
                  formData.input[
                    formData.input.findIndex(
                      (e) =>
                        e.fieldName == extraField.title &&
                        e.reviewtype == formData.reviewTypes
                    )
                  ].fieldValue[extraField.title]
                "
                size="default"
              >
                <a-select-option v-for="item in extraField.options" :key="item">
                  {{ item }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
            <!-- END OF SELECT  -->
            <!-- input TEXTAREA TYPE -->
            <a-form-model-item
              v-if="extraField.type == 'textarea'"
              :key="extraField.id"
              :required="extraField.required"
              :label="extraField.title"
            >
              <a-textarea
                :key="extraField.id"
                v-model="
                  formData.input[
                    formData.input.findIndex(
                      (e) =>
                        e.fieldName == extraField.title &&
                        e.reviewtype == formData.reviewTypes
                    )
                  ].fieldValue[extraField.title]
                "
                :auto-size="{ minRows: 3, maxRows: 3 }"
              />
            </a-form-model-item>
            <!-- END of input TEXTAREA  -->
            <!-- input TEXT TYPE -->
            <a-form-model-item
              v-if="extraField.type == 'text'"
              :key="extraField.id"
              :required="extraField.required"
              :label="extraField.title"
            >
              <a-input
                :key="extraField.id"
                v-model="
                  formData.input[
                    formData.input.findIndex(
                      (e) =>
                        e.fieldName == extraField.title &&
                        e.reviewtype == formData.reviewTypes
                    )
                  ].fieldValue[extraField.title]
                "
              />
            </a-form-model-item>
            <!-- END of input TEXT -->
          </div>
        </div>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>
<script lang="ts">
import { ref, onMounted, computed } from '@nuxtjs/composition-api'
import { useFormStore } from '../store/useStores'
export default {
  name: 'DynamicForm',
  setup () {
    // DEFINE DATA
    const store: any = useFormStore()
    const initialized = ref(false)
    const formData = ref({ reviewTypes: '' as any, input: [] as any })
    const obj = {
      fieldName: '',
      fieldType: '',
      fieldValue: {} as any,
      reviewtype: null,
      isRequired: false
    }
    // METHODES
    const useInitExtraFields = (e: any[]) => {
      // DEFAULT VALUE OF TYPE REVIEW
      formData.value.reviewTypes = e[0].id
      /* init extrafields formData fields */
      //
      e.forEach((element) => {
        obj.reviewtype = element.id
        element.fields.forEach((field: any) => {
          obj.fieldName = field.title
          obj.fieldType = field.type
          obj.fieldValue = {}
          obj.isRequired = field.required
          obj.fieldValue[field.title] = null
          formData.value.input.push({ ...obj })
        })
      })
      initialized.value = true
    }
    // SHOW RESULT OF FORMDATA IN CONSOLE
    const useSaveReview = () => {
      const result = {
        'review-type': formData.value.reviewTypes,
        values: [] as any
      }
      formData.value.input.forEach((element: any) => {
        if (element.reviewtype === formData.value.reviewTypes) {
          result.values.push(element.fieldValue)
        }
      })
      console.log('result', result)
    }
    // DISABLE/ENABLE SAVE BUTTON
    const useDisablebtn = () => {
      const isRequiredField = [] as any
      formData.value.input.forEach((element: any) => {
        if (element.reviewtype === formData.value.reviewTypes) {
          const isEmpty =
            Object.values(element.fieldValue).every(
              value => value === null || value === ''
            ) && element.isRequired
          isRequiredField.push(isEmpty)
        }
      })
      return isRequiredField.includes(true)
    }
    // GET DATA FROM STORE TO FETCH A DYNAMIC FORM
    const fieldList = computed(() => {
      return store.fields
    })
    const useStoreData = () => {
      store.useListOfDynamicFields({
        onError: () => {
          /** */
        },
        onSuccess: (e: any) => {
          /** */
          useInitExtraFields(e.reviewTypes)
        }
      })
    }
    // RESET FORM
    const useChange = () => {
      const index = formData.value.input.findIndex(
        (e: any) => e.reviewtype === formData.value.reviewTypes
      )
      formData.value.input[index].fieldValue = {}
    }
    // ONMOUNTED METHOD
    onMounted(() => {
      useStoreData()
    })
    // RETURN DATA TO BE USE IN DOM
    return {
      fieldList,
      formData,
      initialized,
      useSaveReview,
      useDisablebtn,
      useChange
    }
  }
}
</script>
<style lang="css" scoped>
.form-wrapper {
  padding: 100px;
}
.form-content {
  border: 2px solid #d9d9d9;
  border-radius: 10px;
  padding: 20px;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
