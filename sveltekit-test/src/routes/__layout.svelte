<script lang="ts">
    import '../app.css';
    import { Header } from '$lib/Slices/Header';
    import { BttButton } from '$lib/Components/BttButton';
    import AccessibleIcon from '$lib/Components/AccessibleIcon';
    import North from '$assets/Icons/24/north.svg';

    import { page } from '$app/stores';

    const getTitle = (path: string) => {
        const pathArray = path.split('/').filter((item) => item !== '');
        if (pathArray.length === 0) {
            return 'David Roeger Portfolio';
        }

        let finalPath = 'DR';
        pathArray.forEach((item) => {
            finalPath =
                finalPath +
                ` | ${item.charAt(0).toUpperCase()}${item.slice(1)}`;
        });
        return finalPath;
    };
    $: title = getTitle($page.url.pathname);
</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>

<div class="font-sans text-mauve-12">
    <Header class="z-30" />
    <main class="z-10 xl:max-w-7xl xl:border-r border-mauve-6">
        <slot />
    </main>

    <BttButton
        class="fixed bottom-0 left-0 block p-1 m-2 text-xs bg-white border rounded-full cursor-n-resize touch-manipulation focus:outline-none ring-mauve-12 focus:ring-1"
    >
        <AccessibleIcon label="Back to top"><North /></AccessibleIcon>
    </BttButton>
    <!--footer class="z-20 " /-->
</div>
