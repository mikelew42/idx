When you await something, its sort of blocking...

Whether or not the parent script continues, is whether you're awaiting at that level.  So, if you await at all the levels, it'll literally just wait at all levels, sort of like blocking.

But, if you call an async function without await, then that context will continue.