<script context="module" lang="ts">
	export const thumbnail = 'move.png';
</script>

<script lang="ts">
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
	<input type="range" name="hallo[]" />
	<input type="range" name="hallo[]" />
	<input type="range" name="hallo[]" />
	<input type="range" name="hallo[]" />
	<button>submit</button>
</form>
