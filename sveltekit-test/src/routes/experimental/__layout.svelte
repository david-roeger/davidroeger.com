<script lang="ts">
    import { Background } from '$components/Background';
</script>

<Background
    center="hsla(206, 100%, 50.0%, 0.4)"
    outside="hsla(2206, 100%, 50.0%, 0)"
/>

<div class="relative">
    <slot />
</div>
