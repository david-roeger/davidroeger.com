<script lang="ts">
	import { enhance } from '$app/forms';
	console.info('experimental/dreams/signup:  +page.svelte');
</script>

<h1>Sign up</h1>
<form method="post" use:enhance>
	<label for="email">E-Mail</label>
	<input name="email" id="email" />
	<br />
	<label for="password">Password</label>
	<input type="password" name="password" id="password" />
	<br />
	<label for="name">Username</label>
	<input name="name" id="name" />
	<br />
	<input type="submit" />
</form>
<a href="/experimental/dreams/login">Sign in</a>
