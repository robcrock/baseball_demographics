
# Makeover Monday - Week 6

### Original visualization![Original visualization](https://pbs.twimg.com/profile_images/562466745340817408/_nIu8KHX.jpeg)

The Society for American Baseball created a 100% area chart display the pecent share between four ethnicities: White, African American, Asian, and Latino. In honor of Black History month the #MakeoverMonday community is taking a stab at presenting this data differently to explore a few more ways one might looks at the data.

Instead of doing a makeover I want to remake Ann Jackson's visualization in D3.js. Why recreate the wheel, when Ann's done such a good job of making this data look good 😍

### Ann's Visualization![Ann's Visualization](https://pbs.twimg.com/profile_images/562466745340817408/_nIu8KHX.jpeg)

Now, I can't get to all the cool interactivey in her viz, but I can at least create **another** good looking area chart.

### What I did![Your visualizaiton](http://metacentricities.com/wp-content/uploads/2016/09/Lion-5.jpg)
What's going on here:
* Stack Layout
* Area Labels
* Object Oriented D3

**Stack Layout**
When you build unconventional charts with D3, such as this 100% stacked area chat you have layouts to help you. The [stack layout](https://github.com/d3/d3-shape#_stack) as for a very specific data structure you'll see documented extensively and then still be confused by exactly how it works. I'll try to put a post together upacking this piece more deeply.

**Area Labels**
This is nothing short of magic. My buddy and now D3 coach [Curran Kelleher](https://twitter.com/currankelleher) create a package with accompanying documentation I leverage to programatically position and size text inside their respective layers. If you need to intelligently place text inside areas, then you should really check [this package](https://github.com/curran/d3-area-label)  out.

**Object Oriented D3**
I am not JavaScript pro, but from my experience developing with D3 it feels a little wild wild west. Thankfully I stumbled across a post by [Elliot Bently](https://twitter.com/elliot_bentley) taking advantage of somewhat new features of JavaScript to add some much needed structure to our D3. You can read his well written article, [A better way to structure D3 code](http://ejb.github.io/2017/08/09/a-better-way-to-structure-d3-code-es6-version.html) and see how I put his concept to good use in my code this week. I am looking forward to leveraging this approach in future makeovers.

If you like learning about data visualization follow I encourage you to follow me on Twitter [@robcrock](twitter.com/robcrock) to catch what I'm Tweeting about. **Spoiler alert**, it's almost always data visualization.

## Acknowledgments

This project would be what it is without the efforts of [Andy Kriebel](https://twitter.com/VizWizBI) and [Eva Murray](https://twitter.com/TriMyData), so be sure to give a shout out.

### Built With

* [D3v4](https://d3js.org/d3.v4.min.js) - JavaScript visualization kernel
* [Materialize CSS](https://cdnjs.cloudflare.com/ajax/libs/materialize/0.100.2/css/materialize.min.css) - Based on Google's design philosophy
* [Materialize JS](https://cdnjs.cloudflare.com/ajax/libs/materialize/0.100.2/js/materialize.min.js)- Materialize dependancy

### License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
