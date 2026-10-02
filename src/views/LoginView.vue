<template>
  <div class="min-h-screen bg-page grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
    <!-- Brand side -->
    <section class="relative overflow-hidden hidden lg:flex flex-col justify-between p-12 xl:p-16 border-r border-line bg-surface-1">
      <!-- Light streaks echo the production login, built from tokens -->
      <span class="pointer-events-none absolute -right-40 top-1/3 w-[620px] h-[620px] rounded-full border-[18px] border-brand/10 blur-[2px]" aria-hidden="true" />
      <span class="pointer-events-none absolute -right-24 top-[45%] w-[520px] h-[520px] rounded-full border-[10px] border-presales/15 blur-[1px]" aria-hidden="true" />
      <span class="pointer-events-none absolute -left-32 -bottom-40 w-[560px] h-[560px] rounded-full bg-[radial-gradient(circle,rgb(var(--rc-brand)/0.16),transparent_70%)]" aria-hidden="true" />

      <div class="relative">
        <div class="flex items-center gap-3">
          <img :src="logoUrl" alt="" class="h-9 w-auto" width="25" height="36" />
          <span class="font-display font-bold text-lg tracking-[0.02em]">RACE CONTROL</span>
        </div>
        <p class="text-sm text-fg-muted mt-1.5 pl-[37px]">by Ignition Technology</p>
      </div>

      <div class="relative max-w-xl">
        <h2 class="font-display font-bold text-[52px] leading-[1.02] tracking-tight">
          Accelerating
          <span class="bg-gradient-to-r from-brand to-presales bg-clip-text text-transparent">Ignition</span><br />
          <span class="bg-gradient-to-r from-presales to-reward-fill bg-clip-text text-transparent">Driven</span> Business
        </h2>
        <p class="text-lg text-fg-2 mt-6 leading-relaxed max-w-md">
          Track activities, sync with Salesforce and unlock rewards — your sales performance command center.
        </p>
      </div>

      <p class="relative text-[13px] text-fg-muted">© {{ year }} Ignition Technology</p>
    </section>

    <!-- Form side -->
    <main class="flex items-center justify-center px-4 py-12">
      <div class="w-full max-w-[400px]">
        <!-- Mobile brand -->
        <div class="flex lg:hidden flex-col items-center mb-10">
          <div class="flex items-center gap-3">
            <img :src="logoUrl" alt="" class="h-8 w-auto" width="23" height="32" />
            <span class="font-display font-bold text-lg tracking-[0.02em]">RACE CONTROL</span>
          </div>
          <p class="text-[13px] text-fg-muted mt-1">by Ignition Technology</p>
        </div>

        <Transition name="step" mode="out-in">
          <!-- ── 1 · Sign in ──────────────────────────────────────────────── -->
          <div v-if="step === 'signin'" key="signin">
            <div class="text-center mb-8">
              <h1 class="font-display font-bold text-[28px] tracking-tight">Welcome back</h1>
              <p class="text-[15px] text-fg-2 mt-2">Sign in to access your dashboard</p>
            </div>

            <form class="space-y-5" novalidate @submit.prevent="submitCredentials">
              <AppFormField label="Email address" input-id="login-email" :error="errors.email">
                <AppInput
                  id="login-email"
                  v-model="email"
                  type="email"
                  autocomplete="email"
                  placeholder="you@company.com"
                  :error="!!errors.email"
                  @focus="autofill('email')"
                />
              </AppFormField>
              <AppFormField label="Password" input-id="login-password" :error="errors.password">
                <AppInput
                  id="login-password"
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  autocomplete="current-password"
                  placeholder="Your password"
                  :error="!!errors.password"
                  @focus="autofill('password')"
                >
                  <template #trailing>
                    <button type="button" class="text-fg-muted hover:text-fg" :aria-label="showPassword ? 'Hide password' : 'Show password'" @click="showPassword = !showPassword">
                      <EyeSlashIcon v-if="showPassword" class="w-[18px] h-[18px]" /><EyeIcon v-else class="w-[18px] h-[18px]" />
                    </button>
                  </template>
                </AppInput>
              </AppFormField>
              <AppButton type="submit" size="lg" full-width :loading="loading">
                Sign in <ArrowRightIcon v-if="!loading" class="w-4 h-4" />
              </AppButton>
            </form>

            <!-- TODO: WebAuthn sign-in -->
            <AppButton variant="secondary" size="lg" full-width class="mt-3" @click="note = 'Passkey sign-in isn\'t available in the prototype yet.'">
              <FingerPrintIcon class="w-5 h-5" />Sign in with a passkey
            </AppButton>

            <div class="flex items-center gap-3 my-6 text-[13px] text-fg-muted" aria-hidden="true">
              <span class="flex-1 h-px bg-line" />or<span class="flex-1 h-px bg-line" />
            </div>

            <AppButton variant="secondary" size="lg" full-width @click="goTo('request')">
              <UserPlusIcon class="w-5 h-5" />Request access
            </AppButton>

            <p v-if="note" class="text-[13px] text-fg-2 mt-4 text-center" role="status">{{ note }}</p>
            <p class="text-[13px] text-fg-muted mt-8 text-center">By signing in, you agree to our internal usage policies.</p>
          </div>

          <!-- ── 2 · Two-step verification ────────────────────────────────── -->
          <div v-else-if="step === 'verify'" key="verify" class="text-center">
            <span class="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br from-presales to-brand text-white items-center justify-center shadow-glow-brand mb-6">
              <ShieldCheckIcon class="w-8 h-8" />
            </span>
            <h1 class="font-display font-bold text-[28px] tracking-tight">Two-step verification</h1>
            <p class="text-[15px] text-fg-2 mt-2">
              Enter the 6-digit code for <span class="font-bold text-fg">{{ auth.pendingEmail }}</span>
            </p>

            <form class="mt-8 space-y-5" novalidate @submit.prevent="submitCode">
              <p id="otp-label" class="text-sm font-bold">Verification code</p>
              <AppOtpInput
                ref="otp"
                v-model="code"
                aria-labelledby="otp-label"
                :error="!!errors.code"
                :autofill="DEMO_LOGIN.code"
              />
              <p v-if="errors.code" class="text-sm text-danger" role="alert">{{ errors.code }}</p>
              <AppButton type="submit" size="lg" full-width :disabled="code.length < 6" :loading="loading">
                <ShieldCheckIcon v-if="!loading" class="w-5 h-5" />Verify &amp; continue
              </AppButton>
            </form>

            <div class="flex items-center justify-center gap-4 mt-6 text-sm">
              <button type="button" class="font-bold text-brand hover:text-brand-hover disabled:text-fg-muted disabled:cursor-not-allowed" :disabled="cooldown > 0" @click="resend">
                {{ cooldown > 0 ? `Resend code in ${cooldown}s` : 'Resend code' }}
              </button>
              <span class="w-px h-4 bg-line" aria-hidden="true" />
              <button type="button" class="font-bold text-fg-2 hover:text-fg" @click="backToSignIn">Back to sign in</button>
            </div>
            <p v-if="note" class="text-[13px] text-fg-2 mt-4" role="status">{{ note }}</p>
          </div>

          <!-- ── 3 · Request access ───────────────────────────────────────── -->
          <div v-else-if="step === 'request'" key="request">
            <div class="text-center mb-8">
              <h1 class="font-display font-bold text-[28px] tracking-tight">Request access</h1>
              <p class="text-[15px] text-fg-2 mt-2">An admin will review your request and email you.</p>
            </div>
            <form class="space-y-5" novalidate @submit.prevent="submitRequest">
              <AppFormField label="Full name" input-id="req-name" :error="errors.name">
                <AppInput id="req-name" v-model="request.name" autocomplete="name" placeholder="Jane Smith" :error="!!errors.name" @focus="autofillRequest('name')" />
              </AppFormField>
              <AppFormField label="Work email" input-id="req-email" :error="errors.reqEmail">
                <AppInput id="req-email" v-model="request.email" type="email" autocomplete="email" placeholder="you@company.com" :error="!!errors.reqEmail" @focus="autofillRequest('email')" />
              </AppFormField>
              <AppFormField label="Territory" input-id="req-territory" :error="errors.territory">
                <AppSelect id="req-territory" v-model="request.territory" :options="TERRITORIES" placeholder="Select your territory" :error="!!errors.territory" @focus="autofillRequest('territory')" />
              </AppFormField>
              <AppButton type="submit" size="lg" full-width :loading="loading">Send request</AppButton>
            </form>
            <button type="button" class="block mx-auto mt-6 text-sm font-bold text-fg-2 hover:text-fg" @click="goTo('signin')">Back to sign in</button>
          </div>

          <!-- ── 4 · Request sent ─────────────────────────────────────────── -->
          <div v-else key="requested" class="text-center">
            <span class="inline-flex w-16 h-16 rounded-2xl bg-success/15 text-success items-center justify-center mb-6">
              <CheckCircleIcon class="w-8 h-8" />
            </span>
            <h1 class="font-display font-bold text-[28px] tracking-tight">Request sent</h1>
            <p class="text-[15px] text-fg-2 mt-2">We'll email <span class="font-bold text-fg">{{ request.email }}</span> once an admin approves it.</p>
            <AppButton variant="secondary" size="lg" full-width class="mt-8" @click="goTo('signin')">Back to sign in</AppButton>
          </div>
        </Transition>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, onUnmounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  ArrowRightIcon, EyeIcon, EyeSlashIcon, FingerPrintIcon, UserPlusIcon, ShieldCheckIcon, CheckCircleIcon,
} from '@heroicons/vue/24/outline'
import logoUrl from '@/assets/logo.svg'
import { DEMO_LOGIN } from '@/data/demoLogin'
import { useAuthStore } from '@/stores/useAuthStore'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppSelect from '@/components/ui/AppSelect.vue'
import AppFormField from '@/components/ui/AppFormField.vue'
import AppOtpInput from '@/components/ui/AppOtpInput.vue'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const TERRITORIES = ['Ignition - UK', 'Ignition - DACH', 'Ignition - Benelux', 'Ignition - Nordics', 'Ignition - France', 'Ignition - CEE']
const year = new Date().getFullYear()

const step = ref('signin') // 'signin' | 'verify' | 'request' | 'requested'
const email = ref('')
const password = ref('')
const code = ref('')
const showPassword = ref(false)
const loading = ref(false)
const note = ref('')
const otp = ref(null)
const errors = reactive({ email: null, password: null, code: null, name: null, reqEmail: null, territory: null })
const request = reactive({ name: '', email: '', territory: '' })

function clearErrors() { Object.keys(errors).forEach((k) => { errors[k] = null }); note.value = '' }
function goTo(s) { clearErrors(); step.value = s }

// Prototype: clicking an empty field fills the demo value
function autofill(field) {
  if (field === 'email' && !email.value) email.value = DEMO_LOGIN.email
  if (field === 'password' && !password.value) password.value = DEMO_LOGIN.password
}
function autofillRequest(field) {
  if (field === 'name' && !request.name) request.name = 'Jane Smith'
  if (field === 'email' && !request.email) request.email = 'jane.smith@ignition.technology'
  if (field === 'territory' && !request.territory) request.territory = TERRITORIES[0]
}

async function submitCredentials() {
  clearErrors()
  errors.email = /\S+@\S+\.\S+/.test(email.value) ? null : 'Enter your work email'
  errors.password = password.value ? null : 'Enter your password'
  if (errors.email || errors.password) return
  loading.value = true
  const res = await auth.signIn(email.value, password.value)
  loading.value = false
  if (!res.success) { errors.password = res.error; return }
  code.value = ''
  step.value = 'verify'
  startCooldown()
  await nextTick()
  setTimeout(() => otp.value?.focus(), 250) // after the step transition
}

async function submitCode() {
  if (code.value.length < 6 || loading.value) return
  errors.code = null
  loading.value = true
  const res = await auth.verifyCode(code.value)
  loading.value = false
  if (!res.success) { errors.code = res.error; code.value = ''; otp.value?.focus(); return }
  router.push(route.query.redirect ?? '/')
}

// Resend with a 30s cooldown
const cooldown = ref(0)
let timer = null
function startCooldown() {
  cooldown.value = 30
  clearInterval(timer)
  timer = setInterval(() => { cooldown.value -= 1; if (cooldown.value <= 0) clearInterval(timer) }, 1000)
}
async function resend() {
  await auth.resendCode()
  note.value = `A new code is on its way to ${auth.pendingEmail}.`
  startCooldown()
}
onUnmounted(() => clearInterval(timer))

function backToSignIn() {
  auth.cancelSignIn()
  code.value = ''
  goTo('signin')
}

async function submitRequest() {
  clearErrors()
  errors.name = request.name.trim() ? null : 'Enter your name'
  errors.reqEmail = /\S+@\S+\.\S+/.test(request.email) ? null : 'Enter your work email'
  errors.territory = request.territory ? null : 'Choose your territory'
  if (errors.name || errors.reqEmail || errors.territory) return
  loading.value = true
  await auth.requestAccess({ ...request })
  loading.value = false
  step.value = 'requested'
}
</script>

<style scoped>
.step-enter-active, .step-leave-active { transition: opacity 0.18s ease, transform 0.18s ease; }
.step-enter-from { opacity: 0; transform: translateX(12px); }
.step-leave-to { opacity: 0; transform: translateX(-12px); }
@media (prefers-reduced-motion: reduce) {
  .step-enter-active, .step-leave-active { transition: none; }
}
</style>
