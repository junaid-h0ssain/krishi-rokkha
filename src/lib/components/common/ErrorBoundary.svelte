<script lang="ts">
    import { onMount } from 'svelte';

    let {
        class: className = '',
        ...props
    } = $props();

    let error = $state(null);
    let errorInfo = $state(null);

    function handleError(event: ErrorEvent) {
        error = event.error;
        errorInfo = event;
    }

    onMount(() => {
        window.addEventListener('error', handleError);
        window.addEventListener('unhandledrejection', (event) => {
            error = event.reason;
        });

        return () => {
            window.removeEventListener('error', handleError);
        };
    });
</script>

{#if error}
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 {className}" {...props}>
        <div class="max-w-md w-full space-y-8">
            <div>
                <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Something went wrong
                </h2>
                <p class="mt-2 text-center text-sm text-gray-600">
                    An unexpected error occurred. Please try refreshing the page.
                </p>
            </div>
            <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Error Details</label>
                        <pre class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-xs overflow-auto max-h-32">{error?.message || 'Unknown error'}</pre>
                    </div>
                    <button
                        type="button"
                        class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        onclick={() => window.location.reload()}
                    >
                        Refresh Page
                    </button>
                </div>
            </div>
        </div>
    </div>
{:else}
    <slot />
{/if}