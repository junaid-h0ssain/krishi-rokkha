<script lang="ts">
  import { uiStore, removeNotification } from '$lib/stores/ui';
  import Alert from './Alert.svelte';
  import { derived } from 'svelte/store';

  const notifications = derived(uiStore, $ui => $ui.notifications);

  function dismiss(id: string) {
    removeNotification(id);
  }
</script>

<div class="notification-center fixed top-4 right-4 z-50 space-y-2">
  {#each $notifications as n (n.id)}
    <div class="max-w-sm">
      <Alert type={n.type} on:click={() => dismiss(n.id)}>
        {n.message}
      </Alert>
    </div>
  {/each}
</div>

<style>
  .notification-center { width: 320px; }
</style>
