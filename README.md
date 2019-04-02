# ifixit-grab-bag
A tool that uses the iFixit API to allow users to assemble and add a collection of devices they own to their account.

# Notes about iFixit API 2.0
- */categories/all* contains names of categories & devices, with no way to distinguish between the two. Also has duplicates.
- */Suggest* also does not distinguish between categories & devices.
- */wikis/CATEGORY?display=hierarchy* is functionally similar to */categories*
- */wikis/{namespace}* has limited functionality (e.g response limit).

