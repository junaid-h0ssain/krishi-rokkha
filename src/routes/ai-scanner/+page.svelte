<script>
  import ImageUpload from '$lib/components/ai-scanner/ImageUpload.svelte';
  import ScanResults from '$lib/components/ai-scanner/ScanResults.svelte';
  import SaveResultForm from '$lib/components/ai-scanner/SaveResultForm.svelte';
  import { analyzeImage } from '$lib/services/ai-scan';

  let file;
  let results = null;
  let loading = false;
  let error = null;

  function onSelect(e) {
    file = e.detail.file;
    runScan();
  }

  async function runScan() {
    if (!file) return;
    loading = true;
    error = null;
    results = null;
    try {
      results = await analyzeImage(file);
    } catch (err) {
      error = err?.message || String(err);
      results = { error };
    } finally {
      loading = false;
    }
  }

  function onSave(e) {
    // TODO: integrate with batches service to persist the scan result
    console.log('Saved scan:', e.detail.title, e.detail.result);
    alert('Saved scan: ' + e.detail.title);
  }
</script>

<main style="padding:16px">
  <h1>AI Scanner</h1>
  <ImageUpload on:select={onSelect} />
  {#if loading}
    <div style="margin-top:8px">Scanning image…</div>
  {/if}
  {#if error}
    <div style="color:#c00;margin-top:8px">Error: {error}</div>
  {/if}
  <ScanResults {results} />
  <SaveResultForm result={results} on:save={onSave} />
</main>
