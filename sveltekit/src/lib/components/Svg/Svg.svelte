<script lang="ts">
    export let width: number = 24;
    export let height: number = 24;
    export let viewHeight: number = 24;
    export let viewWidth: number = 24;

    let c : string = '';
    export {c as class};

    let s : string  = '';
    export {s as style};
</script>

<svg
    class={c}
    width={width}
    height={height}
    viewBox={`0 0 ${viewWidth} ${viewHeight}`}
    fill="none"
    style={s}
    xmlns="http://www.w3.org/2000/svg">
    <slot />
</svg>

