<template>
  <div class="skills">
    <h2 class="heading__secondary text-center">Skills</h2>

    <div class="skills--container pt-2">
      <AppSkill name="JavaScript" proficiency="70%" />
      <AppSkill name="SCSS" proficiency="80%" />
      <AppSkill name="Vue.js" proficiency="80%" />
      <AppSkill name="Gatsby.js" proficiency="60%" />
      <AppSkill name="Amazon Web Services" proficiency="60%" />
      <AppSkill name="Node.js" proficiency="50%" />
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
    }

    &:nth-child(even) {
      padding-left: 2rem;
    }

    @media only screen and (max-width: 700px) {
      flex: 0 100%;
      max-width: 100%;
      padding: 0 0 4rem;
    }
  }
}
</style>
