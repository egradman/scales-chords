## Scales and Chords

This is a plugin to allow you to capture guitar and piano tabs in fenced blocks.  When previewed, the block inserts links to chord images from [ScalesChords](https://www.scales-chords.com).  

To use this plugin, use a fenced code block like this:

<pre>
```tab
Verse
G         Am             G/B     G %
Blackbird singing in the dead of night
C          C#dim       D    D#dim    Em   D# %
Take these broken wings and learn to fly
D   C#dim   C    Cm %
All your    life
G/B             A7               D7         G %
You were only waiting for this moment to arise
```
</pre>

The `%` at the end of a line indicates that the line contains chords.  In preview mode, each chord is displayed in bold, and is clickable.  Clicking a chord brings up a modal containing a visual rendition of the chord (as supplied by [ScalesChords](https://www.scales-chords.com/)).

Lines that don't end in `%` will be rendered unmodified.

In addition, every chord captured by the plugin will be rendered in a big stack below the tab block.  This allows you to open two edit views and keep all the song's chords in view.

You can change the instrument in the settings.  Just type in one of:
- `guitar`
- `piano`
- `ukelele`
- `mandolin`
- `banjo`

## Caveats

- This is my first plugin.
- I can't play piano or guitar.  I'm learning, and writing a plugin is how I procrastinate practice.

Thanks to the fine folks at [ScalesChords](https://www.scales-chords.com/) who provided an API for generating these images!


