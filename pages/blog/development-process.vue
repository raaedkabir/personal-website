<template>
  <Layout img="/development-process/hero.jpg" title="My Development Process" date="January 2020">
    <div slot="content">
      <div class="credit">
        Photo by
        <AppLink
          href="https://unsplash.com/@balazsketyi?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText"
          >Balázs Kétyi</AppLink
        >
        on
        <AppLink href="https://unsplash.com/?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText"
          >Unsplash</AppLink
        >
      </div>
      <h2 class="heading__section">Inspiration</h2>
      <p>
        I don't go very far in the raw creativity department so I need to look around for some inspiration. I like to
        find as many many sources as I can and dump whatever clicks with me into a folder. Then I take a break and open
        Photoshop the next day to create a design from memory. Once I think I'm done I revisit that inspiration folder
        from yesterday and see if there's anything I can improve, or if I accidentally copied a design and should toss
        it and make a new one.
      </p>

      <h2 class="heading__section">Color</h2>
      <p>
        Color can be frustratingly difficult because color changes in relation to another color. I tend to find two
        great colors but when I put them next to each other the whole design breaks. The Tweet below shows a demo of
        this.
      </p>

      <!-- Twitter Embed -->
      <br />
      <blockquote class="twitter-tweet tw-align-center" data-lang="en" data-theme="dark">
        <p lang="en" dir="ltr">
          A demo of lightness perception <a href="https://t.co/BSVpgcuIw1">pic.twitter.com/BSVpgcuIw1</a>
        </p>
        &mdash; Akiyoshi Kitaoka (@AkiyoshiKitaoka)
        <a href="https://twitter.com/AkiyoshiKitaoka/status/1028473566193315841?ref_src=twsrc%5Etfw">August 12, 2018</a>
      </blockquote>

      <p>
        If I don't have a color in mind then I will scour through
        <AppLink href="https://unsplash.com/" title="Unsplash">Unsplash</AppLink> for an image and then use that as a
        base to pick colors from. Alternatively, instead of Photoshop I sometimes use
        <AppLink href="https://www.0to255.com/" title="0to255">0to255</AppLink> to create darker and lighter accents to
        a color. It's also important to consider asseibility.
        <AppLink href="https://colorable.jxnblk.com/" title="Colorable" target="_blank" rel="noopener noreferrer"
          >Colorable</AppLink
        >
        has a great UI for this.
        <AppLink
          href="https://webaim.org/resources/contrastchecker/"
          title="WebAIM: Contrast Checker"
          target="_blank"
          rel="noopener noreferrer"
          >WebAIM</AppLink
        >
        also has a contrast checker. Also, don't use pure black as it is harsh to the eyes, instead use #333 as the
        darkest black.
      </p>
      <img src="~assets/images/blog/development-process/color-pallette.png" alt="color pallette" />

      <h2 class="heading__section">Typography</h2>
      <p>
        Fonts are fun because there isn't too much to think about. There are general rules and guidelines to follow when
        it comes to fonts. For paragraph text the font size should be 15 - 25 pixels with 120 - 150% line spacing.
        Headers with big font sizes can have smaller font weights to make them look clean.
      </p>
      <div
        style="
          padding: 1rem;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          place-items: center;
          background: #555;
          font-family: 'Roboto';
          border-radius: 5px;
        "
      >
        <p style="line-height: 0.9">No line spacing makes it hard for the eye to keep track of words.</p>
        <p style="font-size: 14px; line-height: 1.2">This is too small and difficult to read.</p>
        <p style="font-weight: 100; line-height: 1.2">Small font weight does not work well with small text.</p>
        <p style="line-height: 2; line-height: 2.2">Too much line spacing is also difficult to keep track of.</p>
        <p style="font-size: 26px; line-height: 1.2">This is too big and looks like a header.</p>
        <p style="font-family: serif; line-height: 1.2">Suddenly using a different font looks out of place.</p>
      </div>
      <p>
        The only big decision is, which font should I use? Ideally I'd like 2: 1 for the headers and 1 for the body.
        Only 1 font is too plain and 3 can get too chaotic. Serif and Display fonts are good for headers. Sans-Serif
        font is good for paragraph/body text, it is also used on headers to give a more clean and professional feel like
        with Tech Sites.
      </p>
      <img src="~assets/images/blog/development-process/types-of-fonts.png" alt="types of fonts" />

      <h2 class="heading__section">Layout</h2>
      <p>
        Deciding the Layout of the application is the most foundational step and sometimes the hardest. Deciding how
        elements are positioned, where to make users look first and when to lay out the information one-by-one or bunch
        them up together in a grid.
      </p>
      <p>
        Grids are wonderful because they bring order to chaos by bringing together a bunch of disparate things and
        telling the eye how to navigate a space as they're being hurled information at. Finding a balance in making a
        clean layout with Symmetry and then breaking that layout with Assymetry to grab the eye's attention is the first
        step. That is technique of the Call-To-Action Button.
      </p>
      <img src="~assets/images/blog/development-process/navbar.png" alt="navbar" />
      <p>
        But at the same time, too much order is... boring. There is nothing novel to make the user's experience
        exciting. Nature is not inherently Symmetrical so it's not surprising that when it comes to art people usually
        prefer Assymetry. This comes across in the traditional Japanese aesthetic called Wabi-Sabi. The aesthetic is
        described as appreciating beauty in imperfection. We also love <AppLink>diagonals</AppLink> in architecture and
        can dump them into websites to make it look better.
      </p>
      <p>
        Starting out I open Photoshop and only use Primitive Shapes to make a skeleton layout. I tend to start out with
        only 3 colors: primary, dark and light. I try to aim for something like what I have below. You can also see that
        I put in some diagonal lines so the design doesn't feel too flat.
      </p>
      <img
        src="~assets/images/blog/development-process/primitive-shapes.png"
        alt="example site using only primitive shapes"
      />
      <p>
        Then I use CSS Flexbox or Grid to make the layout. Usually I do this from scratch but if I need a template I go
        to
        <AppLink href="https://gridbyexample.com/" title="Grid by Example" target="_blank" rel="noopener noreferrer"
          >Grid by Example</AppLink
        >.
      </p>

      <!-- CodePen -->
      <br />
      <p
        class="codepen"
        data-height="615"
        data-theme-id="dark"
        data-default-tab="result"
        data-user="toddlowell"
        data-slug-hash="JjReNZz"
        data-pen-title="Example Layout"
        style="
          height: 615px;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid;
          margin: 1em 0;
          padding: 1em;
        "
      >
        <span>
          See the Pen <a href="https://codepen.io/toddlowell/pen/JjReNZz"> Example Layout</a> by Raaed M. Kabir (<a
            href="https://codepen.io/toddlowell"
            >@toddlowell</a
          >) on <a href="https://codepen.io">CodePen</a>.
        </span>
      </p>

      <h2 class="heading__section">Prototyping</h2>
      <p>
        This is where the real code starts coming. I build on top of the barebone layout and start adding animations and
        eases. Maybe I load in GSAP and try some whacky page transition or do a simple ease to make the app feel
        professional.
      </p>

      <h2 class="heading__section">Developing</h2>
      <p>
        Finally I start planning the production-level application and consider things like which framework to use and
        where to host it. Does SEO matter? How many people will be using it daily? How should I handle authentication?
        All the questions will be asked here. Once I reached this stage the design should already be locked in stone and
        I can move on to the core functionality and features of the app.
      </p>
    </div>
  </Layout>
</template>

<script>
import Layout from '~/layout/blog.vue';

export default {
  layout: 'empty',

  components: {
    Layout,
  },

  mounted() {
    const codepenScript = document.createElement('script');
    codepenScript.setAttribute('src', 'https://cpwebassets.codepen.io/assets/embed/ei.js');
    codepenScript.setAttribute('async', '');
    document.head.appendChild(codepenScript);

    const twitterScript = document.createElement('script');
    twitterScript.setAttribute('src', 'https://platform.twitter.com/widgets.js');
    twitterScript.setAttribute('charset', 'utf-8');
    twitterScript.setAttribute('async', '');
    document.head.appendChild(twitterScript);
  },
};
</script>
