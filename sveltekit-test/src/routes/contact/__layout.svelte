<script lang="ts">
    import { Background } from '$components/Background';
</script>

<Background
    center="hsla(208, 78%, 77%, 0.4)"
    outside="hsla(208, 78%, 77%, 0)"
/>

<div class="relative">
    <slot />
</div>
