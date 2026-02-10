<script lang="ts">
    let {
        label = '',
        error = '',
        type = 'text',
        placeholder = '',
        value = $bindable(''),
        required = false,
        disabled = false,
        class: className = '',
        ...props
    } = $props();

    const baseClasses = 'block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm';
    const errorClasses = error ? 'border-red-300 text-red-900 placeholder-red-300' : 'border-gray-300';
    const disabledClasses = disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white';
    const classes = `${baseClasses} ${errorClasses} ${disabledClasses} ${className}`;
</script>

<div class="mb-4">
    {#if label}
        <label class="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {#if required}<span class="text-red-500">*</span>{/if}
        </label>
    {/if}
    <input
        {type}
        {placeholder}
        {value}
        {required}
        {disabled}
        class={classes}
        {...props}
    />
    {#if error}
        <p class="mt-1 text-sm text-red-600">{error}</p>
    {/if}
</div>