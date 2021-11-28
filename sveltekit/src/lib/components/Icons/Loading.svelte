<script lang="ts">
    import { Svg } from "$lib/components/Svg";

    export let color: string = '';
    export let fill: string = 'icon-white';
    export let width: number = 24;
    export let height: number = 24;
    export let index: number = 0;
</script>

<div
    style={`width: ${width}; height: ${height}`}
    class="grid grid-cols-1 grid-rows-1"
>
    <Svg width={width} height={height} class="col-start-1 row-start-1">
        <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M23 1H1V23H23V1ZM0 0V24H24V0H0Z"
            fill="currentColor"
            class={color}
        />
    </Svg>

    <Svg
        width={width}
        height={height}
        class="col-start-1 row-start-1 animate-loading"
        style={`animationDelay: ${index * 200}ms`}
    >
        <path
            d="M12 2C6.47715 2 2 6.47715 2 12H22C22 6.47715 17.5228 2 12 2Z"
            fill="currentColor"
            class={fill}
        />
        <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M2 11.5H22V12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12V11.5ZM3.01365 12.5C3.2731 17.238 7.19722 21 12 21C16.8028 21 20.7269 17.238 20.9863 12.5H3.01365Z"
            fill="currentColor"
            class={color}
        />
        <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M3.01365 11.5H20.9863C20.7269 6.76201 16.8028 3 12 3C7.19722 3 3.2731 6.76201 3.01365 11.5ZM2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12V12.5H2V12Z"
            fill="currentColor"
            class={color}
        />
    </Svg>
</div>