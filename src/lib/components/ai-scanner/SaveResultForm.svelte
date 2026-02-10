<script>
  import { createEventDispatcher } from 'svelte';
  export let result = null;
  const dispatch = createEventDispatcher();
  let title = '';

  function submit() {
    dispatch('save', { title: title || 'Untitled scan', result });
  }
</script>

{#if result}
  <form on:submit|preventDefault={submit} style="margin-top:12px;display:flex;gap:8px;align-items:center">
    <input placeholder="Result title" bind:value={title} />
    <button type="submit">Save result</button>
  </form>
{/if}
