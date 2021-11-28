<script lang="ts">
    import { ExternalLinkTypes } from "./index";

    export let href: string;
    export let type: ExternalLinkTypes;
    export const ghost: boolean = false;
    let c: string = '';
    export { c as class };
</script>

<a
    href={href}
    target="_blank"
    rel="noopener nofollow"
    tabIndex={ghost ? -1 : 0}
    class={`focus:outline-none 
        ${type === ExternalLinkTypes.underline ? 'underline' : ''}
        ${type === ExternalLinkTypes.growingUnderline ? 'growing-underline' : ''}
        ${c}`}
>
    <slot />
</a>


