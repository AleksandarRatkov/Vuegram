<template>
<div>
    <side-drawer/>
    <navbar/>
</div>
</template>

<script>
import Navbar from '@/components/Navbar.vue';
import SideDrawer from '@/components/SideDrawer.vue';

export default {
    components: {
        Navbar,
        SideDrawer
    }
}
</script>

<style lang="scss" scoped>

</style>
