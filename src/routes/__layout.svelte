<script>
	import '../app.css';

	import '$lib/firebase';

	import Nav from '$lib/components/Nav.svelte';

	export let segment;
</script>

<Nav {segment} />
<main>
	<slot />
</main>
