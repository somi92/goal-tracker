<script>
  export let segment;
</script>

<style>
  nav {
    background-color: #3b3b3b;
    border-bottom: 1px solid rgba(255, 62, 0, 0.3);
    font-weight: 300;
    padding: 0 1em;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 1;
  }

  ul {
    margin: 0;
    padding: 0;
  }

  /* clearfix */
  ul::after {
    content: '';
    display: block;
    clear: both;
  }

  li {
    display: block;
    float: left;
  }

  .selected {
    position: relative;
    display: inline-block;
  }

  .selected::after {
    position: absolute;
    content: '';
    width: calc(100% - 1em);
    height: 3px;
    background-color: rgb(255, 62, 0);
    display: block;
    bottom: -1px;
  }

  a {
    text-decoration: none;
    padding: 0.5em 0.5em;
    display: block;
    font-size: 1.3em;
  }
</style>

<nav>
  <ul>
    <li>
      <a class:selected={segment === undefined} href=".">HOME</a>
    </li>
    <li>
      <a class:selected={segment === 'about'} href="about">ABOUT</a>
    </li>

    <!-- for the blog link, we're using rel=prefetch so that Sapper prefetches
		     the blog data when we hover over the link or tap it on a touchscreen -->
    <li>
      <a rel="prefetch" class:selected={segment === 'blog'} href="blog">BLOG</a>
    </li>
  </ul>
</nav>
