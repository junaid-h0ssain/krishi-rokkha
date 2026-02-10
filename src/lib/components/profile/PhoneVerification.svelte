<script lang="ts">
  import { sendPhoneOTP, verifyPhoneOTPWithId } from '$lib/services/auth';
  import { authStore } from '$lib/stores/auth';
  import { onDestroy } from 'svelte';

  let unsubscribe = () => {};
  let user = null;
  unsubscribe = authStore.subscribe((s) => (user = s.user));
  onDestroy(() => unsubscribe());

  let phone = '';
  let verificationId = '';
  let code = '';
  let sending = false;
  let verifying = false;
  let message = '';

  async function sendOTP() {
    sending = true;
    message = '';
    try {
      verificationId = await sendPhoneOTP(phone, 'recaptcha-container');
      message = 'OTP sent';
    } catch (err: any) {
      message = err?.message || String(err);
    } finally {
      sending = false;
    }
  }

  async function verify() {
    verifying = true;
    message = '';
    try {
      await verifyPhoneOTPWithId(verificationId, code);
      message = 'Phone verified and linked to account';
    } catch (err: any) {
      message = err?.message || String(err);
    } finally {
      verifying = false;
    }
  }
</script>

<div style="max-width:480px">
  <h2>Phone Verification</h2>
  {#if user}
    <div id="recaptcha-container"></div>
    <div style="margin-bottom:8px">
      <label for="phone">Phone number</label>
      <input id="phone" placeholder="+8801xxxxxxxxx" bind:value={phone} />
    </div>
    <button on:click={sendOTP} disabled={sending}>{sending ? 'Sending…' : 'Send OTP'}</button>

    {#if verificationId}
      <div style="margin-top:8px">
        <label for="code">OTP code</label>
        <input id="code" bind:value={code} />
        <button on:click={verify} disabled={verifying}>{verifying ? 'Verifying…' : 'Verify'}</button>
      </div>
    {/if}

    {#if message}
      <div style="margin-top:8px">{message}</div>
    {/if}
  {:else}
    <div>Please log in to verify phone.</div>
  {/if}
</div>
