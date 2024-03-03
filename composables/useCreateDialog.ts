export function useCreateDialog<T = Record<string, any>>(model: Ref<boolean>, state: Ref<T>, defaultState: T) {
  const formDialog = ref<{ clearForm: () => void } | null>(null)

  const stopWatch = watch(model, (value) => {
    if (!value) {
      state.value = { ...defaultState }
      formDialog.value?.clearForm()
    }
  })

  return {
    formDialog,
    stopWatch,
  }
}
