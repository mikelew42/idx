# Should running and rendering be independent?

One of the tests setups uses the TestsView to .run() the test suite.  This seems a little off.  Maybe we should .run() the tests, and then .render() the results?

But, I sort of want the DOM to be produced sequentially, so maybe it's not such a bad idea...


# Sharing of Tests

This is probably not worth the effort.  I like the test() function, short and sweet.

But, the idea of creating a test suite, and being able to export, import, and apply tests to different classes, for example, seems like a reasonable idea.

For example, with OOP, if you're extending a class, you'll probably want to ensure that the base tests all work properly.

Yet, in the short term, it might not be worth it.  Maybe it's way better to just have simple test functions.