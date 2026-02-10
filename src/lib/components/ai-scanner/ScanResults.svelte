<script>
  export let results = null;
</script>

{#if results?.error}
  <div class="error">Error: {results.error}</div>
{:else if results}
  <div class="scan-results" style="margin-top:8px">
    <div>Processed: {results.metadata?.processedAt}</div>
    <ul>
      {#each results.detected as item}
        <li>{item.disease} — {(item.confidence * 100).toFixed(1)}%</li>
      {/each}
    </ul>
  </div>
{:else}
  <div style="margin-top:8px">No results</div>
{/if}
