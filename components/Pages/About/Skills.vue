<template>
  <div class="skills">
    <h2 class="heading__secondary text-center">Skills</h2>

    <div class="skills--container pt-2">
      <AppSkill name="JavaScript" proficiency="80%" />
      <AppSkill name="SCSS" proficiency="70%" />
      <AppSkill name="Vue.js" proficiency="70%" />
      <AppSkill name="React.js" proficiency="60%" />
      <AppSkill name="Nuxt.js" proficiency="70%" />
      <AppSkill name="Gatsby.js" proficiency="50%" />
      <AppSkill name="Amazon Web Services" proficiency="60%" />
      <AppSkill name="Node.js" proficiency="60%" />
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.skills--container {
  display: flex;
  flex-wrap: wrap;

  & > * {
    flex: 0 50%;
    max-width: 50%;
    padding: 0 0rem 4rem;

    &:nth-child(odd) {
      padding-right: 2rem;

      @include respond(phone) {
        padding-right: 0;
      }
    }

    &:nth-child(even) {
      padding-left: 2rem;

      @include respond(phone) {
        padding-left: 0;
      }
    }

    @include respond(phone) {
      flex: 0 100%;
      max-width: 100%;
      padding: 0 0 4rem;
    }
  }
}
</style>
