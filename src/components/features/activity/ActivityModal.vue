<template>
  <AppModal
    :model-value="ui.activityModal.open"
    :size="recordType ? 'xl' : 'md'"
    :title-id="titleId"
    :close-on-backdrop="!dirty"
    @update:model-value="close"
  >
    <template #header>
      <button
        v-if="recordType && !lockedType"
        type="button"
        class="w-9 h-9 rounded-lg flex items-center justify-center text-fg-muted hover:text-fg hover:bg-surface-2 flex-shrink-0"
        aria-label="Back to record type"
        @click="recordType = null"
      >
        <ChevronLeftIcon class="w-5 h-5" />
      </button>
      <h2 :id="titleId" class="font-display font-semibold text-xl flex-1">
        {{ prefill?.followUpOf ? 'Create follow-up' : 'Log activity' }}
      </h2>
      <!-- Record type switch (step 2) -->
      <div v-if="recordType" role="radiogroup" aria-label="Record type" class="hidden sm:flex gap-1 p-1 rounded-control bg-surface-2 border border-line">
        <button
          v-for="t in RECORD_TYPES"
          :key="t"
          type="button"
          role="radio"
          :aria-checked="recordType === t"
          :class="['h-9 px-3 rounded-[9px] text-sm font-bold flex items-center gap-1.5 transition-colors', recordType === t ? RECORD_STYLE[t].soft : 'text-fg-2 hover:text-fg']"
          @click="setRecordType(t)"
        >
          <component :is="RECORD_STYLE[t].icon" class="w-4 h-4" />{{ t }}
        </button>
      </div>
    </template>

    <!-- ── Step 1 · record type ─────────────────────────────────────────── -->
    <div v-if="!recordType" class="space-y-3">
      <p class="text-[15px] text-fg-2 text-center mb-2">What type of activity are you logging?</p>
      <button
        v-for="t in RECORD_TYPES"
        :key="t"
        type="button"
        class="w-full flex items-center gap-4 p-4 rounded-2xl border border-line bg-surface-2 hover:border-brand/50 hover:bg-surface-3 text-left transition-colors group"
        @click="setRecordType(t)"
      >
        <span :class="['w-12 h-12 rounded-[14px] flex items-center justify-center flex-shrink-0', RECORD_STYLE[t].soft]">
          <component :is="RECORD_STYLE[t].icon" class="w-6 h-6" />
        </span>
        <span class="flex-1">
          <span class="block text-base font-extrabold">{{ t }}</span>
          <span class="block text-sm text-fg-2">{{ RECORD_DESCRIPTION[t] }}</span>
        </span>
        <span class="text-sm font-extrabold text-reward tabular">+{{ POINTS[t] }} pts</span>
        <ChevronRightIcon class="w-5 h-5 text-fg-muted group-hover:text-fg" />
      </button>
    </div>

    <!-- ── Step 2 · details ─────────────────────────────────────────────── -->
    <form v-else :id="formId" class="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-5" novalidate @submit.prevent="submit(false)">
      <!-- Mobile record type switch -->
      <div class="sm:hidden lg:col-span-2">
        <AppSelect v-model="recordTypeModel" :options="RECORD_TYPES" aria-label="Record type" />
      </div>

      <div class="space-y-5">
        <AppFormField label="Link opportunity" :input-id="`${formId}-opp`" helper="Optional — search by number or name">
          <AppCombobox v-model="form.opportunity" :input-id="`${formId}-opp`" :options="opportunityOptions" placeholder="Search opportunities…" />
        </AppFormField>

        <div class="grid grid-cols-2 gap-4">
          <AppFormField label="Date" :input-id="`${formId}-date`" required :error="errors.date">
            <AppInput :id="`${formId}-date`" v-model="form.date" type="date" :error="!!errors.date" />
          </AppFormField>
          <AppFormField label="Type" :input-id="`${formId}-type`" required :error="errors.activityType">
            <AppSelect :id="`${formId}-type`" v-model="form.activityType" :options="ACTIVITY_TYPES[recordType]" placeholder="Select type" :error="!!errors.activityType" />
          </AppFormField>
        </div>
        <p v-if="form.date" class="-mt-3 text-[13px] text-fg-muted">
          Stage: <span class="font-bold text-fg-2">{{ stage }}</span> — set from the date.
        </p>

        <AppFormField label="Vendors" :input-id="`${formId}-vendors`" required :error="errors.vendors">
          <AppCombobox v-model="form.vendors" :input-id="`${formId}-vendors`" :options="companyOptions('vendor')" multiple tone="vendor" :min-chars="MIN_CHARS" placeholder="Search vendors…" :error="!!errors.vendors" />
        </AppFormField>

        <AppFormField :input-id="`${formId}-reseller`">
          <template #label>Reseller</template>
          <template #hint>
            <button type="button" class="text-xs font-bold text-brand hover:text-brand-hover flex items-center gap-1" @click="creating = 'reseller'">
              <PlusIcon class="w-3.5 h-3.5" />New reseller
            </button>
          </template>
          <AppCombobox v-model="form.reseller" :input-id="`${formId}-reseller`" :options="companyOptions('reseller')" tone="reseller" :min-chars="MIN_CHARS" placeholder="Search resellers…" />
        </AppFormField>

        <AppFormField :input-id="`${formId}-endusers`" :required="needsEndUser" :error="errors.endUsers">
          <template #label>End users</template>
          <template #hint>
            <button type="button" class="text-xs font-bold text-brand hover:text-brand-hover flex items-center gap-1" @click="creating = 'endUser'">
              <PlusIcon class="w-3.5 h-3.5" />New end user
            </button>
          </template>
          <AppCombobox v-model="form.endUsers" :input-id="`${formId}-endusers`" :options="companyOptions('endUser')" multiple tone="endUser" :min-chars="MIN_CHARS" placeholder="Search end users…" :error="!!errors.endUsers" />
        </AppFormField>
      </div>

      <div class="space-y-5 flex flex-col">
        <AppFormField label="Description" :input-id="`${formId}-desc`" required :error="errors.description" helper="Who was involved, what was discussed, any outcomes.">
          <AppTextarea :id="`${formId}-desc`" v-model="form.description" :rows="6" placeholder="Describe the activity…" :error="!!errors.description" />
        </AppFormField>
        <AppFormField label="Next step" :input-id="`${formId}-next`" required :error="errors.nextStep" helper="Make it actionable and time-bound.">
          <AppTextarea :id="`${formId}-next`" v-model="form.nextStep" :rows="4" placeholder="What's the next step?" :error="!!errors.nextStep" />
        </AppFormField>

        <!-- Duplicate detection -->
        <div v-if="duplicate" class="flex gap-3 rounded-2xl bg-warning/[0.08] border border-warning/30 p-4" role="status">
          <ExclamationTriangleIcon class="w-5 h-5 text-warning flex-shrink-0" />
          <div class="flex-1 text-sm">
            <p class="font-extrabold">Looks like this activity already exists</p>
            <p class="text-fg-2 mt-0.5">{{ duplicate.createdBy }} logged “{{ duplicate.activityType }}” with {{ directory.name(duplicate.vendors[0]) }} on this date.</p>
            <AppButton variant="secondary" size="sm" class="mt-3" @click="joinDuplicate">Join as attendee instead</AppButton>
          </div>
        </div>
      </div>
    </form>

    <template v-if="recordType" #footer>
      <span class="mr-auto hidden sm:flex items-center gap-2 text-sm text-fg-2">
        <span class="h-7 px-2.5 rounded-lg bg-reward-fill/15 text-reward font-extrabold flex items-center tabular">+{{ POINTS[recordType] }} pts</span>
        when you log this
      </span>
      <AppButton variant="ghost" @click="close">Cancel</AppButton>
      <AppButton variant="secondary" :disabled="saving" @click="submit(true)">
        <PlusIcon class="w-4 h-4" />Save &amp; new
      </AppButton>
      <AppButton type="submit" :form="formId" :loading="saving">Create activity</AppButton>
    </template>
  </AppModal>

  <CompanyCreateDrawer :kind="creating" @close="creating = null" @created="onCompanyCreated" />
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
import { useUiStore } from '@/stores/useUiStore'
import { useAuthStore } from '@/stores/useAuthStore'
import { useActivityStore, RECORD_TYPES, ACTIVITY_TYPES, POINTS } from '@/stores/useActivityStore'
import { useDirectoryStore } from '@/stores/useDirectoryStore'
import { RECORD_STYLE, RECORD_DESCRIPTION } from '@/utils/activity'
import AppModal from '@/components/ui/AppModal.vue'
import AppFormField from '@/components/ui/AppFormField.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppSelect from '@/components/ui/AppSelect.vue'
import AppTextarea from '@/components/ui/AppTextarea.vue'
import AppCombobox from '@/components/ui/AppCombobox.vue'
import AppButton from '@/components/ui/AppButton.vue'
import CompanyCreateDrawer from './CompanyCreateDrawer.vue'

const MIN_CHARS = 3 // same rule as production (see Guide → Pro tips)

// TODO: GET /api/opportunities?q=
const OPPORTUNITIES = [
  'OPP-10421 · Acme EDR refresh',
  'OPP-10388 · Contoso email resilience',
  'OPP-10377 · Northwind identity governance',
  'OPP-10352 · Tailspin managed detection',
]

const ui = useUiStore()
const auth = useAuthStore()
const activityStore = useActivityStore()
const directory = useDirectoryStore()

const titleId = 'activity-modal-title'
const formId = 'activity-form'
const today = () => new Date().toISOString().slice(0, 10)

const prefill = computed(() => ui.activityModal.prefill)
const lockedType = computed(() => !!prefill.value?.followUpOf)

const recordType = ref(null)
const saving = ref(false)
const creating = ref(null)

const blank = () => ({ opportunity: null, date: today(), activityType: '', vendors: [], reseller: null, endUsers: [], description: '', nextStep: '' })
const form = reactive(blank())
const errors = reactive({ date: null, activityType: null, vendors: null, endUsers: null, description: null, nextStep: null })

function resetErrors() { Object.keys(errors).forEach((k) => { errors[k] = null }) }

// Open → apply prefill (follow-up / company page)
watch(() => ui.activityModal.open, (open) => {
  if (!open) return
  Object.assign(form, blank())
  resetErrors()
  const p = prefill.value ?? {}
  recordType.value = p.recordType ?? null
  if (p.vendors) form.vendors = [...p.vendors]
  if (p.reseller) form.reseller = p.reseller
  if (p.endUsers) form.endUsers = [...p.endUsers]
})

const recordTypeModel = computed({ get: () => recordType.value, set: setRecordType })
function setRecordType(t) {
  recordType.value = t
  // Sub-types differ per record type — clear a type that no longer applies
  if (!ACTIVITY_TYPES[t].includes(form.activityType)) form.activityType = ''
}

const dirty = computed(() => !!(form.description || form.nextStep || form.vendors.length))
const stage = computed(() => (form.date > today() ? 'Date Confirmed' : 'Completed'))
const needsEndUser = computed(() => form.activityType === 'Account Intelligence')

const companyOptions = (kind) => directory.ofKind(kind).map((c) => ({
  value: c.id,
  label: c.name,
  meta: kind === 'vendor' ? c.category : kind === 'reseller' ? c.recordType : c.website,
}))
const opportunityOptions = OPPORTUNITIES.map((o) => ({ value: o, label: o }))

// Same date + shared vendor + (shared reseller or end user) → probably the same meeting
const duplicate = computed(() => {
  if (!form.date || !form.vendors.length) return null
  return activityStore.activities.find((a) =>
    a.date === form.date &&
    a.createdBy !== auth.user?.name &&
    a.vendors.some((v) => form.vendors.includes(v)) &&
    ((form.reseller && a.reseller === form.reseller) || a.endUsers.some((e) => form.endUsers.includes(e)) || (!form.reseller && !form.endUsers.length))
  ) ?? null
})

function joinDuplicate() {
  const a = duplicate.value
  if (!a.attendees.includes(auth.user?.name)) a.attendees.push(auth.user?.name)
  ui.toast(`You joined “${a.activityType}” as an attendee`)
  close(true)
}

function onCompanyCreated(company) {
  if (company.kind === 'reseller') form.reseller = company.id
  else form.endUsers = [...form.endUsers, company.id]
  creating.value = null
  ui.toast(`${company.name} created and added`)
}

function validate() {
  errors.date = form.date ? null : 'Pick a date'
  errors.activityType = form.activityType ? null : 'Choose an activity type'
  errors.vendors = form.vendors.length ? null : 'Add at least one vendor'
  errors.endUsers = needsEndUser.value && !form.endUsers.length ? 'Account Intelligence needs at least one end user' : null
  errors.description = form.description.trim() ? null : 'Describe the activity'
  errors.nextStep = form.nextStep.trim() ? null : 'Add a next step'
  const firstError = Object.keys(errors).find((k) => errors[k])
  if (firstError) document.getElementById(`${formId}-${{ date: 'date', activityType: 'type', vendors: 'vendors', endUsers: 'endusers', description: 'desc', nextStep: 'next' }[firstError]}`)?.focus()
  return !firstError
}

async function submit(another) {
  if (!validate()) return
  saving.value = true
  const record = await activityStore.createActivity({
    recordType: recordType.value,
    activityType: form.activityType,
    date: form.date,
    vendors: [...form.vendors],
    reseller: form.reseller,
    endUsers: [...form.endUsers],
    opportunity: form.opportunity,
    description: form.description.trim(),
    nextStep: form.nextStep.trim(),
    followUpOf: prefill.value?.followUpOf ?? null,
  })
  saving.value = false
  ui.toast(`Activity logged · +${record.points} pts`, 'reward')
  if (another) {
    // Keep record type and date, clear the rest
    const keepDate = form.date
    Object.assign(form, blank(), { date: keepDate })
    resetErrors()
  } else {
    close(true)
  }
}

function close(force) {
  if (force !== true && dirty.value && !window.confirm('Discard this activity? Your changes will be lost.')) return
  ui.closeActivityModal()
  recordType.value = null
}
</script>
