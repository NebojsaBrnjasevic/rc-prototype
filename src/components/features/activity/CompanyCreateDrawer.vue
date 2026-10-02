<template>
  <AppDrawer
    :model-value="!!kind"
    :title="kind === 'reseller' ? 'New reseller' : 'New end user'"
    :subtitle="`Create ${kind === 'reseller' ? 'a reseller' : 'an end user'} and add it to your activity`"
    @update:model-value="$emit('close')"
  >
    <form :id="formId" class="space-y-5" novalidate @submit.prevent="save">
      <AppFormField label="Company name" :input-id="`${formId}-name`" required :error="errors.name">
        <AppInput :id="`${formId}-name`" v-model="form.name" placeholder="e.g. Acme Corporation" :error="!!errors.name" />
      </AppFormField>

      <template v-if="kind === 'reseller'">
        <AppFormField label="Focus level" :input-id="`${formId}-focus`" required :error="errors.focusLevel">
          <AppSelect :id="`${formId}-focus`" v-model="form.focusLevel" :options="FOCUS_LEVELS" placeholder="Select focus level" :error="!!errors.focusLevel" />
        </AppFormField>
        <AppFormField label="Sourced by" :input-id="`${formId}-source`" required :error="errors.sourcedBy">
          <AppSelect :id="`${formId}-source`" v-model="form.sourcedBy" :options="SOURCED_BY" placeholder="Select source" :error="!!errors.sourcedBy" />
        </AppFormField>
      </template>

      <AppFormField label="Website" :input-id="`${formId}-web`" required :error="errors.website">
        <AppInput :id="`${formId}-web`" v-model="form.website" placeholder="e.g. www.acme.com" :error="!!errors.website">
          <template #leading><GlobeAltIcon class="w-[18px] h-[18px]" /></template>
        </AppInput>
      </AppFormField>

      <div class="flex gap-3 rounded-2xl bg-brand/[0.07] border border-brand/25 p-4">
        <InformationCircleIcon class="w-5 h-5 text-brand flex-shrink-0" />
        <p class="text-sm text-fg-2">
          <template v-if="kind === 'reseller'">This creates the reseller in Salesforce with record type “Regional” and your territory assigned automatically.</template>
          <template v-else>This creates the end user in Salesforce. It's available for activities straight away.</template>
        </p>
      </div>
    </form>

    <template #footer>
      <AppButton variant="ghost" @click="$emit('close')">Cancel</AppButton>
      <AppButton class="ml-auto" type="submit" :form="formId" :loading="saving">
        Save {{ kind === 'reseller' ? 'reseller' : 'end user' }}
      </AppButton>
    </template>
  </AppDrawer>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import { GlobeAltIcon, InformationCircleIcon } from '@heroicons/vue/24/outline'
import { useDirectoryStore, FOCUS_LEVELS, SOURCED_BY } from '@/stores/useDirectoryStore'
import AppDrawer from '@/components/ui/AppDrawer.vue'
import AppFormField from '@/components/ui/AppFormField.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppSelect from '@/components/ui/AppSelect.vue'
import AppButton from '@/components/ui/AppButton.vue'

const props = defineProps({
  /** 'reseller' | 'endUser' | null (closed) */
  kind: { type: String, default: null },
})
const emit = defineEmits(['close', 'created'])

const directory = useDirectoryStore()
const formId = 'company-create'
const saving = ref(false)
const form = reactive({ name: '', focusLevel: '', sourcedBy: '', website: '' })
const errors = reactive({ name: null, focusLevel: null, sourcedBy: null, website: null })

watch(() => props.kind, () => {
  Object.assign(form, { name: '', focusLevel: '', sourcedBy: '', website: '' })
  Object.keys(errors).forEach((k) => { errors[k] = null })
})

function validate() {
  errors.name = form.name.trim() ? null : 'Company name is required'
  errors.website = /^(https?:\/\/)?[\w-]+(\.[\w-]+)+/.test(form.website.trim()) ? null : 'Enter a website like www.acme.com'
  if (props.kind === 'reseller') {
    errors.focusLevel = form.focusLevel ? null : 'Choose a focus level'
    errors.sourcedBy = form.sourcedBy ? null : 'Choose who sourced it'
  }
  return !Object.values(errors).some(Boolean)
}

async function save() {
  if (!validate()) return
  saving.value = true
  const data = { name: form.name.trim(), website: form.website.trim() }
  if (props.kind === 'reseller') Object.assign(data, { focusLevel: form.focusLevel, sourcedBy: form.sourcedBy })
  const company = await directory.createCompany(props.kind, data)
  saving.value = false
  emit('created', company)
}
</script>
