<script context="module">
  export function preload(page, { user, appUrl }) {
    return { user, appUrl };
  }
</script>

<script>
  import Nav from '../components/Nav.svelte';
  import { onMount } from 'svelte';

  onMount(() => {
    if (window.location.hash === '#auth_cb') {
      window.location.hash = '';
      window.setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  });

  export let user;
  export let appUrl;
  export let segment;
</script>

<style>
  main {
    position: relative;
    max-width: 56em;
    background-color: white;
    padding: 2em;
    margin: 0 auto;
    box-sizing: border-box;
  }

  .login-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  a {
    text-transform: uppercase;
    text-decoration: none;
    font-size: 1.2rem;
    display: block;
  }

  a:hover {
    color: rgb(255, 62, 0);
  }
</style>

<Nav {segment} />

<main>
  {#if user}
    <slot />
  {:else}
    <div class="login-wrapper">
      <a href={`${appUrl}/auth/login`}>Login with Google</a>
    </div>
  {/if}
</main>
