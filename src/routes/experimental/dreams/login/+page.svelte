<script lang="ts">
	logger.page('experimental/dreams/login:  +page.svelte');
	// ----------------------------------------------------------------

	import { enhance } from '$app/forms';

	import { logger } from '$utils/logger';
</script>

<h1>Sign in</h1>
<form method="post" use:enhance>
	<label for="email">Email</label>
	<input name="email" id="email" />
	<br />
	<label for="password">Password</label>
	<input type="password" name="password" id="password" />
	<br />
	<input type="submit" />
</form>
<a href="/experimental/dreams/signup">Create an account</a>
