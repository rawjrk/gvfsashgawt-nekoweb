# mosh manual

_Destroy Data, Not People_

Webtooling for animated glitch.
https://gvfsashgawt.nekoweb.org/mosh

> _**Warning:** do not use Firefox._
>
> _This browser has a known bug: flickering while background update. Which ruins animations._
>
> _**TL;DR** it just looks ugly._

## _what it does_

This tooling does exactly datamosh. Meaning that it does directly manipulate file's binary data and randomized its values on specific bytes.

You can control which bytes are exactly moshed by specifing datamoshed chunks.

> _If you are familiar with manual datamosh using hex-editor (or any text editor), this project does exactly that thing, but it's automated in a way that you can get an animation from a sequence of images._

## _what chunk is_

In this context I refer to "chunk" as a small portion of data (file) equal to 3 bytes.

Such a division was implemented because some underlying conversion to base64 (which is an encoding in which browser accepts image data).

> _Division by chunks is probably a subject to change, because specifing exact bytes position will give more control over the process._

## _what could be controled_

At this point, there are a few inputs:

- datamoshed chunks (from/to): specifies the range of randomized bytes
- animation (checkbox): switch on/off animated mode

## _feedback / contacts_

If you have any feature requests for this tooling, or ideas for collaboration, contact me here: [@gvfsashgawt](https://instagram.com/gvfsashgawt)
