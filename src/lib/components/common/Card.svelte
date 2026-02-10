<script lang="ts">
    let {
        title = '',
        class: className = '',
        ...props
    } = $props();
</script>

<div class="bg-white overflow-hidden shadow rounded-lg {className}" {...props}>
    {#if title}
        <div class="px-4 py-5 sm:px-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900">{title}</h3>
        </div>
    {/if}
    <div class="px-4 py-5 sm:p-6">
        <slot />
    </div>
</div>