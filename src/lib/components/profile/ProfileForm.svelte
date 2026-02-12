<script lang="ts">
  import { authStore } from '$lib/stores/auth';
  import { updateProfileData } from '$lib/services/auth';
  import type { Language } from '$lib/stores/language';
  import { onDestroy } from 'svelte';

  let unsubscribe = () => {};
  let user = null;
  unsubscribe = authStore.subscribe((s) => (user = s.user));
  onDestroy(() => unsubscribe());

  let displayName = '';
  let lang = '';
  let saving = false;
  let message = '';

  $: if (user) {
    displayName = user.displayName || '';
    lang = $Language || '';
  }

  async function submit(e: Event) {
    e.preventDefault();
    saving = true;
    message = '';
    try {
      await updateProfileData({ displayName, language: lang });
      message = 'Profile updated';
    } catch (err: any) {
      message = err?.message || String(err);
    } finally {
      saving = false;
    }
  }
</script>

<form on:submit|preventDefault={submit} style="max-width:480px">
  <h2>Profile</h2>
  {#if user}
    <div style="margin-bottom:8px">
      <label>UID</label>
      <div>{user.uid}</div>
    </div>
    <div style="margin-bottom:8px">
      <label>Email</label>
      <div>{user.email}</div>
    </div>
    <div style="margin-bottom:8px">
      <label for="displayName">Display name</label>
      <input id="displayName" bind:value={displayName} />
    </div>
    <div style="margin-bottom:8px">
      <label for="lang">Language</label>
      <select id="lang" bind:value={lang}>
        <option value="en">English</option>
        <option value="bn">বাংলা</option>
      </select>
    </div>
    <button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
    {#if message}
      <div style="margin-top:8px">{message}</div>
    {/if}
  {:else}
    <div>Please log in to edit your profile.</div>
  {/if}
</form>
