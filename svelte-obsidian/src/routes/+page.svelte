<script>
  import NoteList from '@/components/NoteList.svelte';
  import NoteEditor from '@/components/NoteEditor.svelte';
  
</script>

<div class="app-container flex">
  <div class="w-1/5 p-4">
    <NoteList class="flex-grow-7" />
  </div>
  <div class="w-4/5 p-4">
    <NoteEditor class="flex-grow-3" />
  </div>

</div>

<style>
  .app-container {
    display: flex;
    justify-content: space-between;
    margin: 20px;
  }
</style>
