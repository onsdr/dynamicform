
import { defineStore } from 'pinia'
const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json'
}
// the first argument is a unique id of the store across your application
export const useFormStore = defineStore('useFormStore', {
  // arrow function recommended for full type inference
  state: () => {
    return {
      // all these properties will have their type inferred automatically

      fields: {}

    }
  },
  actions: {

    async useListOfDynamicFields ({ onError, onSuccess }: any) {
      try {
        const response: any = await fetch('api.json', {
          method: 'GET',
          headers
        })
        const res = await response.json()
        if (response.status === 200) {
          this.fields = res
          return onSuccess(res)
        } else {
          return onError()
        }
      } catch (e) {
        return onError(e)
      }
    }
  }
})
