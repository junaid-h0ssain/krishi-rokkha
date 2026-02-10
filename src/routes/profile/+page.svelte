<script lang="ts">
  import ProfileForm from '$lib/components/profile/ProfileForm.svelte';
  import PhoneVerification from '$lib/components/profile/PhoneVerification.svelte';
  import { authStore } from '$lib/stores/auth';
  let user = null;
  const unsubscribe = authStore.subscribe(s => user = s.user);
</script>

<main style="padding:16px">
  <h1>Profile</h1>
  <ProfileForm />
  <div style="margin-top:24px">
    <PhoneVerification />
  </div>
</main>
