<script>
  import { createEventDispatcher } from 'svelte';
  export let accept = 'image/*';
  const dispatch = createEventDispatcher();
  let preview;

  function onChange(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    preview = URL.createObjectURL(file);
    dispatch('select', { file });
  }
</script>

<div class="ai-image-upload">
  <label style="display:inline-block;cursor:pointer;padding:12px;border:1px dashed #ccc;border-radius:8px">
    <input type="file" accept={accept} on:change={onChange} style="display:none" />
    <div>Click to select an image (or drag & drop in future)</div>
  </label>
  {#if preview}
    <div style="margin-top:8px">
      <img src={preview} alt="preview" style="max-width:240px;border-radius:6px" />
    </div>
  {/if}
</div>
