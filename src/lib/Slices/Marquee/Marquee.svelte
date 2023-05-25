<script lang="ts">
	import { Image } from '$lib/Primitives/Image';

	import serious from '$assets/me/serious.png?w=40;80;120;160&format=webp;png&picture&imageTools';
	import smile from '$assets/me/smile.png?w=40;80;120;160&format=webp;png&picture&imageTools';

	export let title = '← this guy is looking for a job →';
	export let href = '/contact';
	export let count = 15;
</script>

<div class="flex my-2 mr-2 border-y border-r border-mauve-6 h-[42px] xl:mr-0">
	<div class="flex-1 relative">
		<div
			class="absolute left-0 right-0 overflow-hidden flex items-center justify-center"
		>
			<div class="w-fit-content flex will-change-transform">
				<a
					{href}
					class="w-fit-content flex will-change-transform c hover:underline"
				>
					<span class="ml-2 inline-flex items-center gap-2 shrink-0">
						<span>{title}</span>
						<span class="w-10">
							<Image picture={serious} alt="me" />
						</span>
						<span aria-hidden="true">
							{title}
						</span>
						<span class="w-10">
							<Image picture={smile} alt="me smiling" />
						</span>
					</span>
					{#each { length: count } as _, i}
						<span
							class="ml-2 inline-flex items-center gap-2 shrink-0"
							aria-hidden="true"
						>
							<span>{title}</span>
							<span class="w-10">
								<Image picture={serious} alt="me" />
							</span>
							<span>{title}</span>
							<span class="w-10 motion-reduce:inset-x-11">
								<Image picture={smile} alt="me smiling" />
							</span>
						</span>
					{/each}
				</a>
			</div>
		</div>
	</div>
</div>

<style>
	@media (prefers-reduced-motion: no-preference) {
		.c {
			animation: scroll 120s linear infinite;
		}

		.c:hover {
			animation-play-state: paused;
		}
	}

	@keyframes scroll {
		from {
			transform: translateX(0);
		}
		to {
			transform: translateX(-100%);
		}
	}
</style>
