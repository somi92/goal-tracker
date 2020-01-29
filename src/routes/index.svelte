<script>
  import { stores } from '@sapper/app';
  import { onMount } from 'svelte';
  import ApolloClient from 'apollo-boost';
  import { setClient } from 'svelte-apollo';
  import fetch from 'node-fetch';
  import gql from 'graphql-tag';

  const { session } = stores();

  let data = '';

  const client = new ApolloClient({ uri: `${$session.appUrl}/graphql`, fetch });

  onMount(async () => {
    setClient(client);
    try {
      const response = await client.query({
        query: gql`
          {
            hello
          }
        `,
      });
      data = response.data.hello;
    } catch (error) {
      console.log(error);
    }
  });
</script>

<style>
  h1,
  figure {
    text-align: center;
    margin: 0 auto;
  }

  h1 {
    font-size: 2.8em;
    text-transform: uppercase;
    font-weight: 700;
    margin: 0 0 0.5em 0;
  }

  figure {
    margin: 0 0 1em 0;
  }

  img {
    width: 100%;
    max-width: 400px;
    margin: 0 0 1em 0;
  }

  @media (min-width: 480px) {
    h1 {
      font-size: 4em;
    }
  }
</style>

<svelte:head>
  <title>Sapper project template</title>
</svelte:head>

<h1>Great success!</h1>

<figure>
  <img alt="Borat" src="great-success.png" />
  {#if data}
    <figcaption>{data}</figcaption>
  {/if}
</figure>
