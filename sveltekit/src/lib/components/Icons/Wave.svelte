<script lang="ts">
    import { Svg } from '$lib/components/Svg';

    export let fill: string | string[] = 'icon-white';
</script>

<div class="w-6 h-6 grid grid-cols-1 grid-rows-1">
    <Svg
        height={14}
        viewHeight={14}
        class="animate-wave-1 mt-[5px] origin-bottom col-start-1 row-start-1"
    >
        <path
            d="M5 0H7V14H5V0Z"
            fill="currentColor"
            class={typeof fill === 'string' ? fill : fill[0] || 'icon-white'}
        />
    </Svg>
    <Svg
        height={14}
        viewHeight={14}
        class="animate-wave-2 mt-[5px] origin-bottom col-start-1 row-start-1"
    >
        <path
            d="M9 0H11V14H9V0Z"
            fill="currentColor"
            class={typeof fill === 'string' ? fill : fill[1] || 'icon-white'}
        />
    </Svg>
    <Svg
        height={14}
        viewHeight={14}
        class="animate-wave-3 mt-[5px] origin-bottom col-start-1 row-start-1"
    >
        <path
            d="M13 0H15V14H13V0Z"
            fill="currentColor"
            class={typeof fill === 'string' ? fill : fill[2] || 'icon-white'}
        />
    </Svg>
    <Svg
        height={14}
        viewHeight={14}
        class="animate-wave-4 mt-[5px] origin-bottom col-start-1 row-start-1"
    >
        <path
            d="M17 0H19V14H17V0Z"
            fill="currentColor"
            class={typeof fill === 'string' ? fill : fill[3] || 'icon-white'}
        />
    </Svg>
</div>
); }; export default Wave;
