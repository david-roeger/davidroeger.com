<script context="module" lang="ts">
	export const thumbnail = 'move.png';
</script>

<script lang="ts">
	import * as Slider from '$primitives/Slider';
</script>

<div class="inner-container">
	<div class="canvas-container" />
	<custom-icon
		class="loading"
		width="var(--var-icon-size-m)"
		height="var(--var-icon-size-m)"
		fill="black"
		type="smile"
		animation="spin"
		duration="1"
	/>
	<custom-button class="border info">
		<span>i</span>
	</custom-button>
	<span class="border preview" />
	<span class="border count">0</span>
	<div class="button-container">
		<div class="row slider-container">
			<input type="range" min="1" max="5" value="3" />
		</div>
		<div class="row">
			<custom-button class="border">
				<a href="#" id="download" crossOrigin download="mosaik.png">
					<custom-icon
						width="var(--var-icon-size-m)"
						height="var(--var-icon-size-m)"
						type="arrow-down"
					/>
				</a>
			</custom-button>

			<custom-button class="border" id="delete">
				<custom-icon width="var(--var-icon-size-m)" height="var(--var-icon-size-m)" type="close" />
			</custom-button>

			<custom-button class="border" id="play">
				<custom-icon width="var(--var-icon-size-m)" height="var(--var-icon-size-m)" type="pause" />
			</custom-button>

			<custom-button class="border" id="next">
				<custom-icon
					width="var(--var-icon-size-m)"
					height="var(--var-icon-size-m)"
					type="arrow-right"
				/>
			</custom-button>
		</div>
	</div>
</div>

<form>
	<Slider.Root
		on:valueChange={(e) => {
			console.log(e.detail.values);
		}}
		class="flex items-center py-4 w-96"
		min={0}
		max={100}
		step={1}
		minStepsBetweenThumbs={20}
		name="music"
		label="volume"
	>
		<Slider.Track class="h-2 border rounded-full border-mauve-12">
			<Slider.Range class="h-full rounded-full bg-orange-5" />
		</Slider.Track>
		<Slider.Thumb
			defaultValue={40}
			class="w-6 h-6 bg-white border rounded-full border-mauve-12 focus:outline-none ring-mauve-12 focus:ring-1 touch-none"
		/>
	</Slider.Root>
</form>
