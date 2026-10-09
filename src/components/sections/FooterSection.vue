<template>
  <footer class="w-full bg-gray-200 text-gray-400 py-4 px-6 flex flex-col lg:flex-row items-center justify-between text-xs lg:text-sm">
    <div class="mb-2 lg:mb-0">
      © {{ new Date().getFullYear() }} PAFCPIC. All rights reserved.
    </div>
    <div class="flex gap-4">
      <a href="https://pafcpic.ph/who-we-are#our-story" target="_blank" rel="noopener" class="hover:text-primary hover:underline">About Us</a>
      <a href="https://pafcpic.ph/privacy-policy" target="_blank" rel="noopener" class="hover:text-primary hover:underline">Privacy Policy</a>
      <a href="https://pafcpic.ph/contact-us" target="_blank" rel="noopener" class="hover:text-primary hover:underline">Contact Us</a>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'FooterSection',
};
</script>

<style scoped>
a {
  color: inherit;              
  text-decoration: none;   
}

a:hover {
  color: var(--tw-text-primary);
}
</style>
