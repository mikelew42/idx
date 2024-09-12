I've been bouncing back and forth between:
- await thing.ready
- await thing.ready()

And the variants:
- thing = await new Thing().ready
- thing = await new Thing().ready()


# Using methods is harder...
I thought it would provide more potential, but:
- you have to cache this._ready
- asdf

# .ready is probably easier
this.ready = this.file.ready;
// no need for a method

# We need to set up this.ready before awaiting file load
If we want to await new Thing().ready, the .ready property needs to be set up by the time the constructor returns...